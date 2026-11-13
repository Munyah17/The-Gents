<?php
// Shared helpers for the The Gent's JSON-document API.
// The whole site state lives in one MySQL row (site_data.payload) so the
// static frontend can keep its existing single-object `db` model.

require_once __DIR__ . '/config.php';

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
             PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    }
    return $pdo;
}

function ensureSchema(): void {
    static $done = false;
    if ($done) return;
    $done = true;
    db()->exec("CREATE TABLE IF NOT EXISTS site_data (
        id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
        payload MEDIUMTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_site_data_singleton CHECK (id = 1)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    db()->exec("CREATE TABLE IF NOT EXISTS admin_users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(60) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    // Existing administrators belong in admin_users. Never ship or recreate a
    // default login credential during ordinary API requests.
    // Client portal accounts (matches the clients table in thegents_db.sql)
    db()->exec("CREATE TABLE IF NOT EXISTS clients (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(30) DEFAULT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    // Staff login credentials (bcrypt) — profiles/permissions stay in site_data.staff
    db()->exec("CREATE TABLE IF NOT EXISTS staff_users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        staff_key VARCHAR(60) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

function loadData() {
    ensureSchema();
    $row = db()->query("SELECT payload FROM site_data WHERE id = 1")->fetch();
    if (!$row) return null;
    $d = json_decode($row['payload'], true);
    return is_array($d) ? $d : null;
}

// Revision token for optimistic concurrency — changes whenever the payload changes.
function dataRev(): ?string {
    ensureSchema();
    $p = db()->query("SELECT payload FROM site_data WHERE id = 1")->fetchColumn();
    return $p === false ? null : md5((string)$p);
}

function storeData(array $data): void {
    ensureSchema();
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) { http_response_code(500); echo json_encode(['ok' => false, 'error' => 'encode']); exit; }
    $st = db()->prepare("INSERT INTO site_data (id, payload) VALUES (1, ?)
                         ON DUPLICATE KEY UPDATE payload = VALUES(payload)");
    $st->execute([$json]);
}

function isAdmin(): bool {
    if (empty($_SESSION['gents_admin'])) return false;
    $id = (string)($_SESSION['gents_staff_id'] ?? '');
    if (strpos($id, 'admin_users:') === 0) {
        ensureSchema();
        $st = db()->prepare('SELECT id FROM admin_users WHERE id = ?');
        $st->execute([substr($id, 12)]);
        return $st->fetchColumn() !== false;
    }
    $staff = currentStaff();
    return $staff !== null && ($staff['status'] ?? 'active') !== 'suspended';
}

function isClient(): bool {
    return !empty($_SESSION['gents_client_id']);
}

function clientRow() {
    if (!isClient()) return null;
    $st = db()->prepare('SELECT id, name, phone, email, created_at FROM clients WHERE id = ?');
    $st->execute([$_SESSION['gents_client_id']]);
    $r = $st->fetch();
    return $r ?: null;
}

function jsonOut($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJson(): array {
    $raw = file_get_contents('php://input');
    $d = json_decode($raw ?: '', true);
    return is_array($d) ? $d : [];
}

// Keys only an authenticated admin may change / see.
const ADMIN_ONLY_KEYS = ['staff', 'accounting', 'clientProfiles', 'members', 'membershipTiers', 'wallets', 'giftCards', 'walletTxns', 'rewards', 'rewardConfig', 'roles'];

// ---------- Staff permissions (RBAC) ----------
// Top-level site_data keys → acceptable VIEW perms (GET payload filtering)
// and WRITE perms (POST change enforcement). Any match grants access.
const KEY_VIEW_PERMS = [
    'bookings' => ['bookings.view', 'requests.view', 'calendar.view'],
    'notifications' => ['bookings.view', 'requests.view'],
    'branches' => ['branches.view'],
    'barbers' => ['staff_data.view'], 'services' => ['staff_data.view'],
    'gallery' => ['content.view'], 'heroSlides' => ['content.view'],
    'settings' => ['settings.manage'],
    'contacts' => ['clients.view'], 'clientProfiles' => ['clients.view', 'usermgmt.view'],
    'members' => ['membership.view', 'membership.members'],
    'membershipTiers' => ['membership.view', 'membership.tiers'],
    'wallets' => ['membership.view', 'membership.wallets'], 'walletTxns' => ['membership.view', 'membership.wallets'],
    'giftCards' => ['membership.view', 'membership.giftcards'],
    'rewards' => ['membership.view', 'membership.rewards'], 'rewardConfig' => ['membership.view', 'membership.rewards'],
    'staff' => ['staffmgmt.view'], 'roles' => ['staffmgmt.view'],
    'accounting' => ['erp.view', 'erp.transactions', 'erp.payroll', 'erp.petty', 'erp.hr', 'erp.assistant'],
];
const KEY_WRITE_PERMS = [
    'bookings' => ['bookings.create', 'bookings.approve', 'bookings.decline', 'bookings.complete', 'bookings.cancel', 'bookings.delete', 'bookings.pay'],
    'notifications' => ['bookings.create', 'bookings.approve', 'bookings.decline', 'bookings.complete', 'bookings.cancel', 'bookings.delete', 'bookings.pay'],
    'branches' => ['branches.manage'],
    'barbers' => ['staff_data.manage'], 'services' => ['staff_data.manage'],
    'gallery' => ['content.manage'], 'heroSlides' => ['content.manage'], 'settings' => ['settings.manage'],
    'contacts' => ['clients.manage'], 'clientProfiles' => ['usermgmt.manage'],
    'members' => ['membership.members'], 'membershipTiers' => ['membership.tiers'],
    'wallets' => ['membership.wallets'], 'walletTxns' => ['membership.wallets'],
    'giftCards' => ['membership.giftcards'],
    'rewards' => ['membership.rewards'], 'rewardConfig' => ['membership.rewards'],
    'staff' => ['staffmgmt.manage'], 'roles' => ['staffmgmt.manage'],
    'accounting' => ['erp.manage', 'erp.transactions', 'erp.payroll', 'erp.petty', 'erp.hr'],
];
// Legacy module-level permission keys → granular expansion (keep in sync with src/erp-extra.js)
const LEGACY_PERM_MAP = [
    'dashboard' => ['dashboard.view'],
    'bookings' => ['bookings.view', 'bookings.create', 'bookings.approve', 'bookings.decline', 'bookings.complete', 'bookings.cancel', 'bookings.delete', 'bookings.pay', 'bookings.export', 'requests.view', 'calendar.view'],
    'calendar' => ['calendar.view'],
    'branches' => ['branches.view', 'branches.manage'],
    'staff_data' => ['staff_data.view', 'staff_data.manage'],
    'content' => ['content.view', 'content.manage'],
    'clients' => ['clients.view', 'clients.manage'],
    'membership' => ['membership.view', 'membership.tiers', 'membership.members', 'membership.wallets', 'membership.giftcards', 'membership.rewards'],
    'reports' => ['reports.view'],
    'settings' => ['settings.manage'],
    'usermgmt' => ['usermgmt.view', 'usermgmt.manage'],
    'staffmgmt' => ['staffmgmt.view', 'staffmgmt.manage'],
    'erp' => ['erp.view', 'erp.transactions', 'erp.payroll', 'erp.petty', 'erp.hr', 'erp.assistant', 'erp.manage'],
];

function permExpand(array $perms): array {
    $out = [];
    foreach ($perms as $p) {
        if (isset(LEGACY_PERM_MAP[$p])) foreach (LEGACY_PERM_MAP[$p] as $x) $out[$x] = true;
        else $out[(string)$p] = true;
    }
    return array_keys($out);
}

// The staff record for the current admin session, or null for the primary admin.
function currentStaff(): ?array {
    $id = $_SESSION['gents_staff_id'] ?? '';
    if ($id === '' || strpos($id, 'admin_users:') === 0) return null;
    $d = loadData();
    foreach (($d['staff'] ?? []) as $s) if (($s['id'] ?? '') === $id) return $s;
    return null;
}

// null → primary admin (unrestricted); ['*'] → all perms; else granular list.
function staffPermSet(?array $staff): ?array {
    if ($staff === null) return null;
    if (($staff['permissions'] ?? null) === '*') return ['*'];
    $d = loadData() ?: [];
    $perms = $staff['permissions'] ?? [];
    if (!is_array($perms)) $perms = [];
    $rid = $staff['roleId'] ?? ($staff['role'] ?? '');
    foreach (($d['roles'] ?? []) as $r) {
        if (($r['id'] ?? '') === $rid || ($r['name'] ?? '') === $rid) {
            $perms = array_merge($perms, $r['perms'] ?? []);
            break;
        }
    }
    return permExpand($perms);
}

function staffCan(?array $perms, array $accepted): bool {
    if ($perms === null || in_array('*', $perms, true)) return true;
    foreach ($accepted as $a) if (in_array($a, $perms, true)) return true;
    return false;
}

// Strip site_data keys a restricted staff member may not view.
function filterForStaff(array $d, array $perms): array {
    $me = currentStaff();
    $ownRoles = [];
    if ($me) foreach (($d['roles'] ?? []) as $role) {
        if (($role['id'] ?? '') === ($me['roleId'] ?? '') || ($role['name'] ?? '') === ($me['roleId'] ?? $me['role'] ?? '')) $ownRoles[] = $role;
    }
    foreach (KEY_VIEW_PERMS as $key => $accepted) {
        if (array_key_exists($key, $d) && !staffCan($perms, $accepted)) unset($d[$key]);
    }
    // A restricted account still needs its own profile/role to render its menu.
    if ($me && !isset($d['staff'])) $d['staff'] = [$me];
    if ($me && !isset($d['roles'])) $d['roles'] = $ownRoles;
    // Never ship staff password fields to any browser session.
    if (isset($d['staff']) && is_array($d['staff'])) {
        foreach ($d['staff'] as &$s) unset($s['password']);
        unset($s);
    }
    return $d;
}

// Content keys that may be back-filled from client data when missing server-side.
const FILLABLE_KEYS = ['settings', 'clientProfile', 'hero', 'gallery'];

// Merge a non-admin payload into stored data: only public-safe mutations apply.
function mergePublicData(array $stored, array $inc): array {
    $out = $stored;

    // Bookings: allow appends and client-side cancellation only.
    if (isset($inc['bookings']) && is_array($inc['bookings'])) {
        $byId = [];
        foreach ($out['bookings'] ?? [] as $b) if (!empty($b['id'])) $byId[$b['id']] = $b;
        foreach ($inc['bookings'] as $b) {
            if (!is_array($b) || empty($b['id'])) continue;
            if (!isset($byId[$b['id']])) {
                // New booking — requires a signed-in client or admin.
                if ((isClient() || isAdmin()) && !empty($b['name']) && !empty($b['branch']) && !empty($b['service']) && !empty($b['date']) && !empty($b['time'])) {
                    $b['status'] = in_array($b['status'] ?? '', ['Pending', 'Confirmed'], true) ? $b['status'] : 'Pending';
                    $b['source'] = in_array($b['source'] ?? '', ['Online', 'Walk-in'], true) ? $b['source'] : 'Online';
                    $b['payment'] = 'Unpaid'; // payment is recorded by staff only
                    $byId[$b['id']] = $b;
                }
            } else {
                // Existing booking — clients may only cancel their own.
                if (($b['status'] ?? '') === 'Cancelled' && in_array($byId[$b['id']]['status'] ?? '', ['Pending', 'Confirmed'], true)) {
                    $byId[$b['id']]['status'] = 'Cancelled';
                }
            }
        }
        $out['bookings'] = array_values($byId);
    }

    // Contacts: append-only.
    if (isset($inc['contacts']) && is_array($inc['contacts'])) {
        $seen = array_map('json_encode', $out['contacts'] ?? []);
        foreach ($inc['contacts'] as $c) {
            if (is_array($c) && !in_array(json_encode($c), $seen, true)) { $out['contacts'][] = $c; $seen[] = json_encode($c); }
        }
    }

    // Notifications: prepend new entries, dedupe, cap at 200.
    if (isset($inc['notifications']) && is_array($inc['notifications'])) {
        $have = array_map('strval', array_slice($out['notifications'] ?? [], 0, 200));
        $add = [];
        foreach ($inc['notifications'] as $n) {
            $s = is_string($n) ? $n : json_encode($n);
            if (!in_array($s, $have, true) && !in_array($s, $add, true)) $add[] = $n;
        }
        $out['notifications'] = array_merge($add, array_slice($out['notifications'] ?? [], 0, 200 - count($add)));
    }

    foreach (FILLABLE_KEYS as $k) {
        if (!isset($out[$k]) && isset($inc[$k])) $out[$k] = $inc[$k];
    }
    if (!empty($inc['membership'])) $out['membership'] = true;
    if (isset($inc['clientProfile']) && is_array($inc['clientProfile'])) $out['clientProfile'] = $inc['clientProfile'];

    return $out;
}

// Strip admin-only data for anonymous visitors.
function publicData(array $d): array {
    foreach (ADMIN_ONLY_KEYS as $k) unset($d[$k]);
    return $d;
}
