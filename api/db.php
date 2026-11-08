<?php
// GET  /api/db.php        → current site data (admin-only keys stripped for guests)
// POST /api/db.php        → save site data.
//                          • admin session  → full replace
//                          • guest          → merged: bookings append/cancel,
//                                            contacts append, notifications prepend
session_start();
require_once __DIR__ . '/lib.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $d = loadData();
    if ($d === null) jsonOut(['ok' => true, 'data' => null]);
    jsonOut(['ok' => true, 'data' => isAdmin() ? $d : publicData($d)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inc = readJson();

    // Admin-only factory reset
    if (!empty($inc['__reset'])) {
        if (!isAdmin()) jsonOut(['ok' => false, 'error' => 'unauthorized'], 403);
        ensureSchema();
        db()->exec('DELETE FROM site_data');
        jsonOut(['ok' => true]);
    }

    // Frontend flags admin-intent writes; without a valid session they are rejected
    // (prevents expired sessions silently losing changes to the guest merge).
    if (($_SERVER['HTTP_X_GENTS_ROLE'] ?? '') === 'admin' && !isAdmin()) {
        jsonOut(['ok' => false, 'error' => 'admin session required'], 403);
    }

    if (empty($inc) || !isset($inc['branches'], $inc['services'], $inc['barbers'], $inc['bookings'])) {
        jsonOut(['ok' => false, 'error' => 'invalid payload'], 400);
    }
    $stored = loadData();

    if (isAdmin()) {
        // Keep existing staff passwords if the client sent blanks.
        if ($stored && isset($inc['staff'], $stored['staff']) && is_array($inc['staff'])) {
            $pw = [];
            foreach ($stored['staff'] as $s) if (!empty($s['password'])) $pw[$s['id'] ?? ''] = $s['password'];
            foreach ($inc['staff'] as &$s) {
                if (isset($pw[$s['id'] ?? '']) && empty($s['password'])) $s['password'] = $pw[$s['id']];
            }
            unset($s);
        }
        storeData($inc);
        jsonOut(['ok' => true]);
    }

    if ($stored === null) {
        // First boot — accept the seed payload.
        storeData($inc);
        jsonOut(['ok' => true]);
    }

    $merged = mergePublicData($stored, $inc);
    storeData($merged);
    jsonOut(['ok' => true, 'data' => publicData($merged)]);
}

jsonOut(['ok' => false, 'error' => 'method not allowed'], 405);
