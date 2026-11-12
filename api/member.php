<?php
// Client membership & wallet API.
// GET  /api/member.php            → own member card, wallet, gift cards, tiers
// POST /api/member.php {action}   → enrol | topup | issue-giftcard
session_start();
require_once __DIR__ . '/lib.php';

// Fallback tier list — mirrors TIERS in prototype.html for installs whose
// site_data predates the membership feature.
const DEFAULT_TIERS = [
    ['id' => 'basic', 'name' => 'Basic', 'price' => 5, 'color' => '#9aa3ad', 'perks' => 'Member rates · 50 pts per visit'],
    ['id' => 'gold', 'name' => 'Gold', 'price' => 10, 'color' => '#d4af37', 'perks' => '10% off retail · priority booking · 100 pts per visit'],
    ['id' => 'diamond', 'name' => 'Diamond', 'price' => 15, 'color' => '#67e8f9', 'perks' => '15% off · free beard trim monthly · 150 pts per visit'],
    ['id' => 'platinum', 'name' => 'Platinum', 'price' => 25, 'color' => '#e5e4e2', 'perks' => '20% off · dedicated barber · early access · 250 pts per visit'],
];

function memberEmail(): ?string {
    $c = clientRow();
    return $c ? strtolower(trim($c['email'])) : null;
}

function memberFind(array $d, string $email): ?array {
    foreach (($d['members'] ?? []) as $m) {
        if (strtolower($m['email'] ?? '') === $email) return $m;
    }
    return null;
}

function walletFind(array $d, string $email): ?int {
    foreach (($d['wallets'] ?? []) as $i => $w) {
        if (strtolower($w['email'] ?? '') === $email) return $i;
    }
    return null;
}

function walletBalance(array $d, string $email): float {
    $i = walletFind($d, $email);
    return $i === null ? 0.0 : (float)($d['wallets'][$i]['balance'] ?? 0);
}

function walletSet(array &$d, string $email, float $balance): void {
    $i = walletFind($d, $email);
    if ($i === null) { $d['wallets'][] = ['email' => $email, 'balance' => $balance]; return; }
    $d['wallets'][$i]['balance'] = $balance;
}

function memberTiers(array $d): array {
    return (!empty($d['membershipTiers']) && is_array($d['membershipTiers'])) ? $d['membershipTiers'] : DEFAULT_TIERS;
}

function memberPublic(array $m, array $tiers): array {
    $t = null;
    foreach ($tiers as $x) if (($x['id'] ?? '') === ($m['tier'] ?? '')) { $t = $x; break; }
    return [
        'memberNo' => $m['memberNo'] ?? '', 'name' => $m['name'] ?? '', 'pseudo' => $m['pseudo'] ?? '',
        'profession' => $m['profession'] ?? '', 'branch' => $m['branch'] ?? '', 'joined' => $m['joined'] ?? '',
        'status' => $m['status'] ?? 'active', 'tier' => $m['tier'] ?? 'basic',
        'tierName' => $t['name'] ?? ucfirst($m['tier'] ?? 'basic'), 'tierColor' => $t['color'] ?? '#9aa3ad',
        'perks' => $t['perks'] ?? '', 'price' => $t['price'] ?? 0,
    ];
}

function gcPublic(array $g): array {
    return [
        'id' => $g['id'] ?? '', 'code' => $g['code'] ?? '', 'toName' => $g['toName'] ?? '',
        'toEmail' => $g['toEmail'] ?? '', 'amount' => $g['amount'] ?? 0, 'remaining' => $g['remaining'] ?? 0,
        'maxUses' => $g['maxUses'] ?? 0, 'uses' => $g['uses'] ?? 0, 'status' => $g['status'] ?? 'active',
        'serviceId' => $g['serviceId'] ?? '', 'expiresAt' => $g['expiresAt'] ?? '',
        'created' => $g['created'] ?? '',
    ];
}

function auditTxn(array &$d, array $t): void {
    $d['walletTxns'][] = [
        'id' => 'AUD-' . strtoupper(bin2hex(random_bytes(4))), 'email' => $t['email'] ?? '',
        'kind' => $t['kind'] ?? 'adjust', 'amount' => $t['amount'] ?? 0,
        'balanceAfter' => $t['balanceAfter'] ?? null, 'ref' => $t['ref'] ?? '',
        'by' => $t['by'] ?? 'system', 'status' => 'completed', 'created' => date('c'),
    ];
}

function normalise(array $d): array {
    foreach (['members', 'membershipTiers', 'giftCards', 'walletTxns', 'wallets'] as $k) {
        if (!isset($d[$k]) || !is_array($d[$k])) $d[$k] = [];
    }
    // wallets may exist as an object map from older saves — convert to list
    if ($d['wallets'] && array_keys($d['wallets']) !== range(0, count($d['wallets']) - 1)) {
        $d['wallets'] = array_values(array_map(fn($email, $w) => ['email' => $email, 'balance' => $w['balance'] ?? 0], array_keys($d['wallets']), $d['wallets']));
    }
    // never persist an empty tier list — seed defaults instead
    if (empty($d['membershipTiers'])) $d['membershipTiers'] = DEFAULT_TIERS;
    return $d;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = memberEmail();
    if (!$email) jsonOut(['ok' => false, 'error' => 'not signed in'], 401);
    $d = normalise(loadData() ?: []);
    $m = memberFind($d, $email);
    $issued = array_values(array_map('gcPublic', array_filter($d['giftCards'], fn($g) => strtolower($g['fromEmail'] ?? '') === $email)));
    $received = array_values(array_map('gcPublic', array_filter($d['giftCards'], fn($g) => strtolower($g['toEmail'] ?? '') === $email && ($g['status'] ?? '') === 'active')));
    $txns = array_values(array_filter($d['walletTxns'], fn($t) => strtolower($t['email'] ?? '') === $email));
    jsonOut(['ok' => true, 'member' => $m ? memberPublic($m, memberTiers($d)) : null,
             'wallet' => ['balance' => walletBalance($d, $email)],
             'giftCards' => ['issued' => $issued, 'received' => $received],
             'transactions' => array_slice(array_reverse($txns), 0, 20),
             'rewards' => ['override' => $d['rewards'][$email]['points'] ?? null,
                           'perVisit' => (int)($d['rewardConfig']['perVisit'] ?? 100)],
             'tiers' => memberTiers($d)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = memberEmail();
    if (!$email) jsonOut(['ok' => false, 'error' => 'not signed in'], 401);
    $in = readJson();
    $action = $in['action'] ?? '';
    $d = normalise(loadData() ?: []);
    $c = clientRow();

    if ($action === 'enrol') {
        if ($m = memberFind($d, $email)) jsonOut(['ok' => true, 'member' => memberPublic($m, memberTiers($d)), 'already' => true]);
        $n = count($d['members']) + 1;
        $parts = preg_split('/\s+/', trim($c['name'] ?? 'M'));
        $pseudo = strtoupper(substr($parts[0] ?? 'M', 0, 1) . substr(end($parts) ?: '', 0, 1));
        $m = ['id' => 'm' . substr(md5($email . microtime()), 0, 8), 'memberNo' => 'GT-M-' . str_pad((string)$n, 4, '0', STR_PAD_LEFT),
              'name' => $c['name'] ?? 'Member', 'pseudo' => $pseudo, 'profession' => '', 'email' => $email,
              'branch' => $d['branches'][0]['id'] ?? '', 'tier' => 'basic', 'joined' => date('Y-m-d'), 'status' => 'active'];
        $d['members'][] = $m;
        storeData($d);
        jsonOut(['ok' => true, 'member' => memberPublic($m, memberTiers($d))]);
    }

    if ($action === 'topup') {
        $amt = (float)($in['amount'] ?? 0);
        if ($amt <= 0 || $amt > 10000) jsonOut(['ok' => false, 'error' => 'amount must be between 0 and 10,000'], 400);
        $pending = 0;
        foreach ($d['walletTxns'] as $t) if (($t['status'] ?? '') === 'pending' && strtolower($t['email'] ?? '') === $email) $pending++;
        if ($pending >= 5) jsonOut(['ok' => false, 'error' => 'Too many pending top-ups — please wait for confirmation.'], 429);
        $d['walletTxns'][] = ['id' => 'TXN-' . strtoupper(bin2hex(random_bytes(5))), 'email' => $email, 'kind' => 'topup', 'amount' => $amt, 'status' => 'pending', 'created' => date('c')];
        storeData($d);
        jsonOut(['ok' => true, 'message' => 'Top-up request submitted — the salon will confirm it shortly.']);
    }

    if ($action === 'issue-giftcard') {
        $amt = (float)($in['amount'] ?? 0);
        $maxUses = max(0, (int)($in['maxUses'] ?? 1));
        $toName = trim((string)($in['toName'] ?? ''));
        $toEmail = strtolower(trim((string)($in['toEmail'] ?? '')));
        $serviceId = trim((string)($in['serviceId'] ?? ''));
        $expiresAt = trim((string)($in['expiresAt'] ?? ''));
        if ($amt <= 0 || $amt > 10000) jsonOut(['ok' => false, 'error' => 'invalid amount'], 400);
        if ($serviceId !== '' && !in_array($serviceId, array_map(fn($s) => $s['id'] ?? '', $d['services'] ?? []), true)) {
            jsonOut(['ok' => false, 'error' => 'unknown service'], 400);
        }
        if ($expiresAt !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $expiresAt)) {
            jsonOut(['ok' => false, 'error' => 'invalid expiry date'], 400);
        }
        $bal = walletBalance($d, $email);
        if ($bal < $amt) jsonOut(['ok' => false, 'error' => 'Insufficient wallet balance'], 400);
        walletSet($d, $email, $bal - $amt);
        $code = 'GC-' . strtoupper(bin2hex(random_bytes(4)));
        $g = ['id' => 'GC-' . strtoupper(bin2hex(random_bytes(4))), 'code' => $code,
              'fromEmail' => $email, 'fromName' => $c['name'] ?? '', 'toName' => $toName, 'toEmail' => $toEmail,
              'amount' => $amt, 'remaining' => $amt, 'maxUses' => $maxUses, 'uses' => 0,
              'serviceId' => $serviceId, 'expiresAt' => $expiresAt,
              'status' => 'active', 'created' => date('c')];
        $d['giftCards'][] = $g;
        auditTxn($d, ['email' => $email, 'kind' => 'giftcard', 'amount' => -$amt, 'balanceAfter' => $bal - $amt, 'ref' => $code, 'by' => 'client']);
        storeData($d);
        jsonOut(['ok' => true, 'giftCard' => gcPublic($g), 'balance' => $bal - $amt]);
    }

    jsonOut(['ok' => false, 'error' => 'unknown action'], 400);
}

jsonOut(['ok' => false, 'error' => 'method not allowed'], 405);
