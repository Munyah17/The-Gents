<?php
// POST /api/auth.php  {email, password}          → staff/admin login (PHP session)
// POST /api/auth.php  {action:"logout"}          → end session
// GET  /api/auth.php                               → current session info
session_start();
require_once __DIR__ . '/lib.php';

function staffList(): array {
    $d = loadData();
    return (isset($d['staff']) && is_array($d['staff'])) ? $d['staff'] : [];
}

function publicStaff(array $s): array {
    unset($s['password']);
    return $s;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $client = clientRow();
    if (empty($_SESSION['gents_admin'])) {
        jsonOut(['ok' => false, 'client' => $client], $client ? 200 : 401);
    }
    $id = $_SESSION['gents_staff_id'] ?? '';
    $me = null;
    foreach (staffList() as $s) if (($s['id'] ?? '') === $id) { $me = publicStaff($s); break; }
    jsonOut(['ok' => true, 'staff' => $me, 'client' => $client]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = readJson();
    $action = $in['action'] ?? '';

    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        jsonOut(['ok' => true]);
    }

    // ---- Staff credential management (admin session required) ----
    // {action:"staff-credential", staffKey, email, password} → set/reset password
    // {action:"staff-credential", staffKey, remove:true}     → delete credential
    if ($action === 'staff-credential') {
        if (empty($_SESSION['gents_admin'])) jsonOut(['ok' => false, 'error' => 'unauthorized'], 401);
        ensureSchema();
        $sid = trim((string)($in['staffKey'] ?? ''));
        $em  = strtolower(trim((string)($in['email'] ?? '')));
        $pw  = (string)($in['password'] ?? '');
        if ($sid === '' || $em === '') jsonOut(['ok' => false, 'error' => 'missing fields'], 400);
        if (!empty($in['remove'])) {
            db()->prepare('DELETE FROM staff_users WHERE staff_key = ?')->execute([$sid]);
            jsonOut(['ok' => true]);
        }
        if (strlen($pw) < 6) jsonOut(['ok' => false, 'error' => 'password must be 6+ characters'], 400);
        db()->prepare('INSERT INTO staff_users (staff_key, email, password_hash) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE email = VALUES(email), password_hash = VALUES(password_hash)')
            ->execute([$sid, $em, password_hash($pw, PASSWORD_DEFAULT)]);
        jsonOut(['ok' => true]);
    }

    // ---- Client portal accounts ----
    if ($action === 'client-register' || $action === 'client-login') {
        ensureSchema();
        $name  = trim((string)($in['name'] ?? ''));
        $email = strtolower(trim((string)($in['email'] ?? '')));
        $phone = trim((string)($in['phone'] ?? ''));
        $pass  = (string)($in['password'] ?? '');

        if ($action === 'client-register') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonOut(['ok' => false, 'error' => 'invalid email'], 400);
            if ($name === '' || strlen($pass) < 6) jsonOut(['ok' => false, 'error' => 'name and a password of 6+ characters are required'], 400);
            $st = db()->prepare('SELECT id FROM clients WHERE email = ?');
            $st->execute([$email]);
            if ($st->fetch()) jsonOut(['ok' => false, 'error' => 'An account with this email already exists'], 409);
            $st = db()->prepare('INSERT INTO clients (name, phone, email, password_hash) VALUES (?, ?, ?, ?)');
            $st->execute([$name, $phone ?: null, $email, password_hash($pass, PASSWORD_DEFAULT)]);
            $cid = (int)db()->lastInsertId();
        } else {
            if ($pass === '') jsonOut(['ok' => false, 'error' => 'missing credentials'], 400);
            $login = strtolower(trim($in['email'] ?? ''));
            // Match email or full name in the clients table
            $st = db()->prepare('SELECT id, name, phone, email, password_hash FROM clients WHERE LOWER(email) = ? OR LOWER(name) = ?');
            $st->execute([$login, $login]);
            $c = $st->fetch();
            // Fall back to member pseudonym → resolve to the linked account email
            if (!$c && $login !== '') {
                $d = loadData() ?: [];
                foreach (($d['members'] ?? []) as $m) {
                    if (strtolower(trim($m['pseudo'] ?? '')) === $login && !empty($m['email'])) {
                        $st2 = db()->prepare('SELECT id, name, phone, email, password_hash FROM clients WHERE LOWER(email) = ?');
                        $st2->execute([strtolower(trim($m['email']))]);
                        $c = $st2->fetch();
                        if ($c) break;
                    }
                }
            }
            if (!$c || empty($c['password_hash']) || !password_verify($pass, $c['password_hash'])) {
                jsonOut(['ok' => false, 'error' => 'invalid credentials'], 401);
            }
            $cid = (int)$c['id'];
        }

        $_SESSION['gents_client_id'] = $cid;
        $st = db()->prepare('SELECT id, name, phone, email FROM clients WHERE id = ?');
        $st->execute([$cid]);
        jsonOut(['ok' => true, 'client' => $st->fetch()]);
    }

    $email = strtolower(trim($in['email'] ?? ''));
    $pass  = (string)($in['password'] ?? '');
    if ($email === '' || $pass === '') jsonOut(['ok' => false, 'error' => 'missing credentials'], 400);

    // 1) Primary admin account (bcrypt, admin_users table)
    ensureSchema();
    $st = db()->prepare('SELECT id, username, email FROM admin_users WHERE email = ?');
    $st->execute([$email]);
    $adm = $st->fetch();
    $isPrimary = false;
    if ($adm) {
        $st2 = db()->prepare('SELECT password_hash FROM admin_users WHERE id = ?');
        $st2->execute([$adm['id']]);
        $hash = (string)$st2->fetchColumn();
        $isPrimary = $hash !== '' && password_verify($pass, $hash);
    }

    // 2) Staff credentials — bcrypt hashes in the staff_users table
    $staff = null;
    $st = db()->prepare('SELECT staff_key, password_hash FROM staff_users WHERE email = ?');
    $st->execute([$email]);
    $su = $st->fetch();
    if ($su && password_verify($pass, (string)$su['password_hash'])) {
        foreach (staffList() as $s) {
            if (($s['id'] ?? '') === $su['staff_key'] || strtolower($s['email'] ?? '') === $email) { $staff = $s; break; }
        }
        if ($staff && ($staff['status'] ?? 'active') === 'suspended') $staff = null;
        // Strip any leftover plaintext password from the payload record
        if ($staff && isset($staff['password'])) {
            $d = loadData();
            foreach (($d['staff'] ?? []) as $i => $x) { if (($x['id'] ?? '') === ($staff['id'] ?? '')) unset($d['staff'][$i]['password']); }
            storeData($d);
            unset($staff['password']);
        }
    }

    // 3) Legacy migration: payload staff records may still hold plaintext passwords.
    // Verify once, move the credential into staff_users (bcrypt), strip it from the payload.
    if (!$staff) {
        $d = null;
        foreach (staffList() as $s) {
            if (strtolower($s['email'] ?? '') !== $email || !isset($s['password']) || $s['password'] === '') continue;
            if (!hash_equals((string)$s['password'], $pass)) continue;
            db()->prepare('INSERT INTO staff_users (staff_key, email, password_hash) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)')
                ->execute([$s['id'], $email, password_hash($pass, PASSWORD_DEFAULT)]);
            $d = $d ?? loadData();
            foreach (($d['staff'] ?? []) as $i => $x) { if (($x['id'] ?? '') === ($s['id'] ?? '')) unset($d['staff'][$i]['password']); }
            if (($s['status'] ?? 'active') !== 'suspended') $staff = $s;
            break;
        }
        if ($d) storeData($d);
    }

    if (!$isPrimary && !$staff) jsonOut(['ok' => false, 'error' => 'invalid credentials'], 401);

    $_SESSION['gents_admin'] = true;
    $_SESSION['gents_staff_id'] = $staff['id'] ?? ('admin_users:' . ($adm['id'] ?? 0));
    jsonOut(['ok' => true, 'staff' => $staff ? publicStaff($staff) : ['id' => 'admin_users:' . $adm['id'], 'name' => $adm['username'], 'email' => $adm['email'], 'role' => 'Super Admin', 'permissions' => '*']]);
}

jsonOut(['ok' => false, 'error' => 'method not allowed'], 405);
