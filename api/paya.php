<?php
// Paynow Zimbabwe — wallet top-up payments.
//   POST /api/paya.php {action:"init", amount}   → create pending top-up + Paynow payment → {redirect}
//   GET|POST /api/paya.php?action=callback       → Paynow result URL (server-to-server)
//   GET  /api/paya.php?action=return&reference=  → customer return URL → verify → bounce to client.html
session_start();
require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/paynow/autoloader.php';

function paynow(): ?Paynow\Payments\Paynow {
    if (PAYNOW_ID === '' || PAYNOW_KEY === '') return null;
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $base = $scheme . '://' . $host;
    return new Paynow\Payments\Paynow(
        PAYNOW_ID, PAYNOW_KEY,
        $base . '/api/paya.php?action=return',   // customer return
        $base . '/api/paya.php?action=callback'  // server result
    );
}

function txnFind(array $d, string $ref): ?int {
    foreach (($d['walletTxns'] ?? []) as $i => $t) if (($t['id'] ?? '') === $ref) return $i;
    return null;
}

function walletCredit(array &$d, string $email, float $amount): float {
    $i = null;
    foreach (($d['wallets'] ?? []) as $k => $w) if (strtolower($w['email'] ?? '') === strtolower($email)) { $i = $k; break; }
    if ($i === null) { $d['wallets'][] = ['email' => strtolower($email), 'balance' => 0]; $i = count($d['wallets']) - 1; }
    $d['wallets'][$i]['balance'] = (float)$d['wallets'][$i]['balance'] + $amount;
    return (float)$d['wallets'][$i]['balance'];
}

function auditTxn(array &$d, array $t): void {
    $d['walletTxns'][] = [
        'id' => 'AUD-' . strtoupper(bin2hex(random_bytes(4))), 'email' => $t['email'] ?? '',
        'kind' => $t['kind'] ?? 'adjust', 'amount' => $t['amount'] ?? 0,
        'balanceAfter' => $t['balanceAfter'] ?? null, 'ref' => $t['ref'] ?? '',
        'by' => $t['by'] ?? 'system', 'status' => 'completed', 'created' => date('c'),
    ];
}

// ---- Paynow server-to-server result ----
if (isset($_GET['action']) && $_GET['action'] === 'callback') {
    $pn = paynow();
    if (!$pn) { http_response_code(200); echo 'OK'; exit; }
    try { $status = $pn->processStatusUpdate(); }
    catch (Throwable $e) { http_response_code(200); echo 'OK'; exit; }
    $ref = (string)$status->reference();
    $d = loadData();
    if (is_array($d)) {
        normaliseWallets($d);
        $i = txnFind($d, $ref);
        if ($i !== null && ($d['walletTxns'][$i]['status'] ?? '') === 'pending') {
            if ($status->paid()) {
                $t = $d['walletTxns'][$i];
                $bal = walletCredit($d, $t['email'], (float)$t['amount']);
                $t['status'] = 'approved';
                $t['paynowReference'] = $status->paynowReference();
                auditTxn($d, ['email' => $t['email'], 'kind' => 'topup', 'amount' => (float)$t['amount'], 'balanceAfter' => $bal, 'ref' => $ref, 'by' => 'paynow']);
                storeData($d);
            } else {
                $d['walletTxns'][$i]['status'] = 'failed';
                storeData($d);
            }
        }
    }
    http_response_code(200);
    echo 'OK';
    exit;
}

// ---- Customer return ----
if (isset($_GET['action']) && $_GET['action'] === 'return') {
    $ref = preg_replace('/[^A-Za-z0-9\-]/', '', $_GET['reference'] ?? '');
    $d = loadData();
    $state = 'pending';
    if (is_array($d)) {
        $i = txnFind($d, $ref);
        if ($i !== null) $state = $d['walletTxns'][$i]['status'] ?? 'pending';
        // Still pending? Poll Paynow once before deciding.
        if ($state === 'pending') {
            $pn = paynow();
            $poll = $i !== null ? ($d['walletTxns'][$i]['pollUrl'] ?? '') : '';
            if ($pn && $poll !== '') {
                try {
                    $st = $pn->pollTransaction($poll);
                    if ($st->paid()) {
                        $t = $d['walletTxns'][$i];
                        $bal = walletCredit($d, $t['email'], (float)$t['amount']);
                        $t['status'] = 'approved';
                        auditTxn($d, ['email' => $t['email'], 'kind' => 'topup', 'amount' => (float)$t['amount'], 'balanceAfter' => $bal, 'ref' => $ref, 'by' => 'paynow']);
                        storeData($d);
                        $state = 'approved';
                    } elseif (in_array($st->status(), ['Cancelled', 'Disputed', 'Refunded'], true)) {
                        $d['walletTxns'][$i]['status'] = 'failed';
                        storeData($d);
                        $state = 'failed';
                    }
                } catch (Throwable $e) { /* keep pending */ }
            }
        }
    }
    $map = ['approved' => 'ok', 'failed' => 'fail'];
    header('Location: /client?paid=' . ($map[$state] ?? 'pending'));
    exit;
}

// ---- Init (client session required) ----
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pn = paynow();
    if (!$pn) jsonOut(['ok' => false, 'error' => 'payments_not_configured'], 503);
    if (!isClient()) jsonOut(['ok' => false, 'error' => 'not signed in'], 401);
    $in = readJson();
    $amt = (float)($in['amount'] ?? 0);
    if ($amt < 1 || $amt > 10000) jsonOut(['ok' => false, 'error' => 'amount must be between 1 and 10,000'], 400);
    $c = clientRow();
    $email = strtolower(trim($c['email']));

    $d = loadData();
    if (!is_array($d)) $d = [];
    normaliseWallets($d);
    // Cap outstanding pending top-ups per account
    $pending = 0;
    foreach (($d['walletTxns'] ?? []) as $t) if (($t['status'] ?? '') === 'pending' && strtolower($t['email'] ?? '') === $email) $pending++;
    if ($pending >= 5) jsonOut(['ok' => false, 'error' => 'Too many pending top-ups — please wait for confirmation.'], 429);

    $ref = 'TXN-' . strtoupper(bin2hex(random_bytes(5)));
    $d['walletTxns'][] = ['id' => $ref, 'email' => $email, 'kind' => 'topup', 'amount' => $amt, 'status' => 'pending', 'created' => date('c'), 'pollUrl' => ''];
    storeData($d);

    try {
        $payment = $pn->createPayment($ref, $email)->add("Wallet Top-up — The Gent's", $amt);
        $resp = $pn->send($payment);
    } catch (Throwable $e) {
        // mark txn failed
        $d = loadData(); $i = txnFind($d, $ref);
        if ($i !== null) { $d['walletTxns'][$i]['status'] = 'failed'; storeData($d); }
        jsonOut(['ok' => false, 'error' => 'payment gateway error'], 502);
    }

    if (!$resp->success()) {
        $d = loadData(); $i = txnFind($d, $ref);
        if ($i !== null) { $d['walletTxns'][$i]['status'] = 'failed'; storeData($d); }
        jsonOut(['ok' => false, 'error' => 'payment gateway rejected the request'], 502);
    }

    // persist poll URL for status checks
    $d = loadData(); $i = txnFind($d, $ref);
    if ($i !== null) { $d['walletTxns'][$i]['pollUrl'] = (string)$resp->pollUrl(); storeData($d); }

    jsonOut(['ok' => true, 'redirect' => $resp->redirectUrl(), 'reference' => $ref]);
}

jsonOut(['ok' => false, 'error' => 'method not allowed'], 405);

function normaliseWallets(array &$d): void {
    if (!isset($d['wallets']) || !is_array($d['wallets'])) $d['wallets'] = [];
    if ($d['wallets'] && array_keys($d['wallets']) !== range(0, count($d['wallets']) - 1)) {
        $d['wallets'] = array_values(array_map(fn($email, $w) => ['email' => $email, 'balance' => $w['balance'] ?? 0], array_keys($d['wallets']), $d['wallets']));
    }
}
