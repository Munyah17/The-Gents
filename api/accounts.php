<?php
// Account/profile writes are committed together; passwords never enter site_data.
session_start();
require_once __DIR__ . '/lib.php';

function accountCheck(bool $ok, string $message, int $code = 400): void {
    if (!$ok) throw new InvalidArgumentException($message, $code);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonOut(['ok' => false, 'error' => 'method not allowed'], 405);
if (!isAdmin()) jsonOut(['ok' => false, 'error' => 'Please sign in again.'], 401);
ensureSchema();
$in = readJson();
$action = $in['action'] ?? '';

try {
    db()->beginTransaction();
    // Serialize targeted edits with other account edits and whole-document saves.
    $row = db()->query('SELECT payload FROM site_data WHERE id = 1 FOR UPDATE')->fetchColumn();
    $d = $row === false ? [] : json_decode($row, true);
    accountCheck(is_array($d), 'Site data could not be read.', 500);
    $perms = staffPermSet(currentStaff());
    $id = trim((string)($in['id'] ?? ''));
    $name = trim((string)($in['name'] ?? ''));
    accountCheck($name !== '', 'Name is required.');

    if ($action === 'role-save') {
        accountCheck(staffCan($perms, ['staffmgmt.manage']), 'Permission denied.', 403);
        $roles = $d['roles'] ?? [];
        $index = null;
        foreach ($roles as $i => $role) {
            if (($role['id'] ?? '') === $id) $index = $i;
            accountCheck(($role['id'] ?? '') === $id || strcasecmp(trim($role['name'] ?? ''), $name) !== 0, 'A role with that name exists.', 409);
        }
        accountCheck($id === '' || $index !== null, 'Role no longer exists.', 404);
        accountCheck(is_array($in['perms'] ?? null), 'Invalid permissions.');
        $role = $index === null ? ['id' => 'rol' . bin2hex(random_bytes(8)), 'createdAt' => date('Y-m-d')] : $roles[$index];
        $role['name'] = $name;
        $role['perms'] = array_values(array_unique(array_filter($in['perms'], 'is_string')));
        if ($index === null) $roles[] = $role; else $roles[$index] = $role;
        $d['roles'] = $roles;
    } elseif ($action === 'staff-save' || $action === 'client-save') {
        $staffMode = $action === 'staff-save';
        $key = $staffMode ? 'staff' : 'clientProfiles';
        $items = $d[$key] ?? [];
        $index = null;
        foreach ($items as $i => $item) if (($item['id'] ?? '') === $id) $index = $i;
        accountCheck($id === '' || $index !== null, 'Account no longer exists.', 404);
        $old = $index === null ? [] : $items[$index];
        $canManage = staffCan($perms, [$staffMode ? 'staffmgmt.manage' : 'usermgmt.manage']);
        $self = $staffMode && $id !== '' && $id === ($_SESSION['gents_staff_id'] ?? '');
        accountCheck($canManage || $self, 'Permission denied.', 403);
        $email = strtolower(trim((string)($in['email'] ?? '')));
        $password = (string)($in['password'] ?? '');
        accountCheck(filter_var($email, FILTER_VALIDATE_EMAIL) !== false, 'A valid email is required.');
        accountCheck($password === '' || (strlen($password) >= 6 && strlen($password) <= 72), 'Password must be 6–72 bytes.');
        accountCheck($index !== null || $password !== '', 'A password is required for a new account.');
        foreach ($items as $i => $item) {
            accountCheck($i === $index || strtolower(trim($item['email'] ?? '')) !== $email, 'Email is already in use.', 409);
        }
        $record = $old ?: ['id' => ($staffMode ? 'staff' : 'cli') . bin2hex(random_bytes(8)), 'createdAt' => date('Y-m-d')];
        $record['name'] = $name;
        $record['email'] = $email;
        unset($record['password']);

        if ($staffMode) {
            $username = trim((string)($in['username'] ?? ''));
            accountCheck($username !== '', 'Username is required.');
            foreach ($items as $i => $item) accountCheck($i === $index || strcasecmp(trim($item['username'] ?? ''), $username) !== 0, 'Username is already in use.', 409);
            $primaryId = null;
            if (!empty($old['protected'])) {
                $st = db()->prepare('SELECT id FROM admin_users WHERE LOWER(email) = ?');
                $st->execute([strtolower(trim($old['email'] ?? ''))]);
                $primaryId = $st->fetchColumn() ?: null;
                accountCheck($primaryId !== null, 'Primary admin record is missing.', 409);
            }
            $st = db()->prepare('SELECT id FROM admin_users WHERE LOWER(email) = ? OR LOWER(username) = ?');
            $st->execute([$email, strtolower($username)]);
            foreach ($st->fetchAll() as $a) accountCheck((string)$a['id'] === (string)$primaryId, 'Email or username is already in use.', 409);
            $st = db()->prepare('SELECT staff_key FROM staff_users WHERE LOWER(email) = ?');
            $st->execute([$email]);
            $existingKey = $st->fetchColumn();
            accountCheck($existingKey === false || $existingKey === $record['id'], 'Email is already in use by another staff credential.', 409);
            $record['username'] = $username;
            if ($canManage) {
                $admin = ($in['access'] ?? '') === 'admin' || !empty($old['protected']);
                $roleId = $admin ? '' : (string)($in['roleId'] ?? '');
                accountCheck($roleId === '' || in_array($roleId, array_column($d['roles'] ?? [], 'id'), true), 'Selected role no longer exists.');
                $record['roleId'] = $roleId;
                $record['role'] = $admin ? 'Administrator' : trim((string)($in['role'] ?? ''));
                $record['permissions'] = $admin ? '*' : (($old['permissions'] ?? []) === '*' ? [] : ($old['permissions'] ?? []));
                $record['status'] = !empty($old['protected']) ? 'active' : (($in['status'] ?? '') === 'suspended' ? 'suspended' : 'active');
            }
            if ($primaryId !== null) {
                $st = db()->prepare('UPDATE admin_users SET username = ?, email = ?' . ($password !== '' ? ', password_hash = ?' : '') . ' WHERE id = ?');
                $args = [$username, $email];
                if ($password !== '') $args[] = password_hash($password, PASSWORD_DEFAULT);
                $args[] = $primaryId;
                $st->execute($args);
            } else {
                $st = db()->prepare('SELECT id FROM staff_users WHERE staff_key = ?');
                $st->execute([$record['id']]);
                $credentialId = $st->fetchColumn();
                accountCheck($credentialId !== false || $password !== '', 'Set a password to enable login for this staff account.');
                if ($credentialId === false) {
                    $st = db()->prepare('INSERT INTO staff_users (staff_key, email, password_hash) VALUES (?, ?, ?)');
                    $st->execute([$record['id'], $email, password_hash($password, PASSWORD_DEFAULT)]);
                } else {
                    $st = db()->prepare('UPDATE staff_users SET email = ?' . ($password !== '' ? ', password_hash = ?' : '') . ' WHERE staff_key = ?');
                    $args = [$email];
                    if ($password !== '') $args[] = password_hash($password, PASSWORD_DEFAULT);
                    $args[] = $record['id'];
                    $st->execute($args);
                }
            }
        } else {
            $record['phone'] = trim((string)($in['phone'] ?? ''));
            $record['note'] = trim((string)($in['note'] ?? ''));
            $record['status'] = ($in['status'] ?? '') === 'suspended' ? 'suspended' : 'active';
            $st = db()->prepare('SELECT id FROM clients WHERE LOWER(email) = ?');
            $st->execute([strtolower(trim($old['email'] ?? ''))]);
            $clientId = $index === null ? false : $st->fetchColumn();
            $st = db()->prepare('SELECT id FROM clients WHERE LOWER(email) = ?');
            $st->execute([$email]);
            foreach ($st->fetchAll() as $c) accountCheck((string)$c['id'] === (string)$clientId, 'A login account with this email already exists.', 409);
            accountCheck($clientId !== false || $password !== '', 'Set a password to enable login for this client.');
            if ($clientId === false) {
                $st = db()->prepare('INSERT INTO clients (name, phone, email, password_hash) VALUES (?, ?, ?, ?)');
                $st->execute([$name, $record['phone'] ?: null, $email, password_hash($password, PASSWORD_DEFAULT)]);
            } else {
                $st = db()->prepare('UPDATE clients SET name = ?, phone = ?, email = ?' . ($password !== '' ? ', password_hash = ?' : '') . ' WHERE id = ?');
                $args = [$name, $record['phone'] ?: null, $email];
                if ($password !== '') $args[] = password_hash($password, PASSWORD_DEFAULT);
                $args[] = $clientId;
                $st->execute($args);
            }
        }
        if ($index === null) $items[] = $record; else $items[$index] = $record;
        $d[$key] = $items;
    } else {
        accountCheck(false, 'Unknown account action.');
    }

    storeData($d);
    $rev = dataRev();
    db()->commit();
    // Recalculate permissions after editing one's own account.
    $view = staffPermSet(currentStaff());
    $data = $view === null ? $d : filterForStaff($d, $view);
    if (isset($data['staff'])) foreach ($data['staff'] as &$s) unset($s['password']);
    unset($s);
    jsonOut(['ok' => true, 'data' => $data, 'rev' => $rev]);
} catch (Throwable $e) {
    if (db()->inTransaction()) db()->rollBack();
    if ($e instanceof InvalidArgumentException) jsonOut(['ok' => false, 'error' => $e->getMessage()], $e->getCode() ?: 400);
    if ($e instanceof PDOException && (string)$e->getCode() === '23000') jsonOut(['ok' => false, 'error' => 'Email or username is already in use.'], 409);
    error_log('Account save failed: ' . $e->getMessage());
    jsonOut(['ok' => false, 'error' => 'Account could not be saved. Please try again.'], 500);
}
