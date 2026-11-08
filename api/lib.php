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
    // Primary admin (bcrypt hash of the admin password — see thegents_db.sql)
    db()->exec('INSERT IGNORE INTO admin_users (id, username, email, password_hash) VALUES
        (1, \'Munyah\', \'munyah777@gmail.com\',
         \'$2y$10$pAvHeJjntdYUkt3uybkovetqykQf8zlR.3sVTrMKPwQ9DIjK.KID6\')');
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
}

function loadData() {
    ensureSchema();
    $row = db()->query("SELECT payload FROM site_data WHERE id = 1")->fetch();
    if (!$row) return null;
    $d = json_decode($row['payload'], true);
    return is_array($d) ? $d : null;
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
    return !empty($_SESSION['gents_admin']);
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
const ADMIN_ONLY_KEYS = ['staff', 'accounting', 'clientProfiles'];

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
