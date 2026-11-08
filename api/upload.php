<?php
// POST /api/upload.php  (multipart, field "file")  → admin only
// Saves a validated image to /uploads and returns its public URL.
session_start();
require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonOut(['ok' => false, 'error' => 'method not allowed'], 405);
if (!isAdmin()) jsonOut(['ok' => false, 'error' => 'unauthorized'], 401);
if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    jsonOut(['ok' => false, 'error' => 'no file'], 400);
}
$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) jsonOut(['ok' => false, 'error' => 'upload error ' . $f['error']], 400);
if ($f['size'] > MAX_UPLOAD_BYTES) jsonOut(['ok' => false, 'error' => 'file too large (max 8MB)'], 400);

$info = @getimagesize($f['tmp_name']);
$mimeToExt = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_GIF => 'gif', IMAGETYPE_WEBP => 'webp'];
if (!$info || !isset($mimeToExt[$info[2]])) jsonOut(['ok' => false, 'error' => 'not a valid image'], 400);

if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
$name = 'img_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $mimeToExt[$info[2]];
$dest = UPLOAD_DIR . '/' . $name;
if (!move_uploaded_file($f['tmp_name'], $dest)) jsonOut(['ok' => false, 'error' => 'save failed'], 500);

jsonOut(['ok' => true, 'url' => UPLOAD_URL . '/' . $name]);
