<?php
// GET  /api/db.php        → current site data (admin-only keys stripped for guests)
// POST /api/db.php        → save site data.
//                          • admin session  → full replace
//                          • guest          → merged: bookings append/cancel,
//                                            contacts append, notifications prepend
session_start();
require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/notify.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $d = loadData();
    if ($d === null) jsonOut(['ok' => true, 'data' => null]);
    if (!isAdmin()) jsonOut(['ok' => true, 'data' => publicData($d)]);
    $perms = staffPermSet(currentStaff());
    if ($perms === null) {
        // Primary admin — full data, but never ship staff password fields.
        if (isset($d['staff']) && is_array($d['staff'])) {
            foreach ($d['staff'] as &$s) unset($s['password']);
            unset($s);
        }
        jsonOut(['ok' => true, 'data' => $d]);
    }
    jsonOut(['ok' => true, 'data' => filterForStaff($d, $perms)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inc = readJson();

    // Admin-only factory reset — primary admin only
    if (!empty($inc['__reset'])) {
        if (!isAdmin() || currentStaff() !== null) jsonOut(['ok' => false, 'error' => 'unauthorized'], 403);
        ensureSchema();
        db()->exec('DELETE FROM site_data');
        jsonOut(['ok' => true]);
    }

    // Frontend flags admin-intent writes; without a valid session they are rejected
    // (prevents expired sessions silently losing changes to the guest merge).
    if (($_SERVER['HTTP_X_GENTS_ROLE'] ?? '') === 'admin' && !isAdmin()) {
        jsonOut(['ok' => false, 'error' => 'admin session required'], 403);
    }

    if (empty($inc)) {
        jsonOut(['ok' => false, 'error' => 'invalid payload'], 400);
    }
    $stored = loadData();

    if (isAdmin()) {
        $perms = staffPermSet(currentStaff());
        if ($perms === null) {
            // Primary admin — full replace. Keep existing staff passwords if blanks sent.
            if ($stored && isset($inc['staff'], $stored['staff']) && is_array($inc['staff'])) {
                $pw = [];
                foreach ($stored['staff'] as $s) if (!empty($s['password'])) $pw[$s['id'] ?? ''] = $s['password'];
                foreach ($inc['staff'] as &$s) {
                    if (isset($pw[$s['id'] ?? '']) && empty($s['password'])) $s['password'] = $pw[$s['id']];
                }
                unset($s);
            }
            storeData($inc);
            try { sendBookingNotices(bookingDiffs($stored ?: [], $inc)); } catch (Throwable $t) {}
            jsonOut(['ok' => true]);
        }

        // Restricted staff — their payload only contains keys they may view.
        // 1) Reject writes to keys they hold no permission for (only if changed).
        foreach ($inc as $k => $v) {
            if ($k === '__reset') continue;
            $accepted = KEY_WRITE_PERMS[$k] ?? null;
            if ($accepted === null) continue;
            if (isset($stored[$k]) && json_encode($stored[$k]) === json_encode($v)) continue;
            if (!staffCan($perms, $accepted)) {
                jsonOut(['ok' => false, 'error' => 'permission denied: cannot modify ' . $k], 403);
            }
        }
        // 2) Merge sent keys onto stored data — keys they can't see are preserved.
        $merged = $stored;
        foreach ($inc as $k => $v) if ($k !== '__reset') $merged[$k] = $v;
        if (isset($merged['staff'], $stored['staff']) && is_array($merged['staff'])) {
            $pw = [];
            foreach ($stored['staff'] as $s) if (!empty($s['password'])) $pw[$s['id'] ?? ''] = $s['password'];
            foreach ($merged['staff'] as &$s) {
                if (isset($pw[$s['id'] ?? '']) && empty($s['password'])) $s['password'] = $pw[$s['id']];
            }
            unset($s);
        }
        storeData($merged);
        try { sendBookingNotices(bookingDiffs($stored ?: [], $merged)); } catch (Throwable $t) {}
        jsonOut(['ok' => true]);
    }

    if ($stored === null) {
        // First boot — accept the seed payload.
        storeData($inc);
        jsonOut(['ok' => true]);
    }

    // Guest merge requires the core collections to be present.
    if (!isset($inc['branches'], $inc['services'], $inc['barbers'], $inc['bookings'])) {
        jsonOut(['ok' => false, 'error' => 'invalid payload'], 400);
    }
    $merged = mergePublicData($stored, $inc);
    storeData($merged);
    try { sendBookingNotices(bookingDiffs($stored, $merged)); } catch (Throwable $t) {}
    jsonOut(['ok' => true, 'data' => publicData($merged)]);
}

jsonOut(['ok' => false, 'error' => 'method not allowed'], 405);
