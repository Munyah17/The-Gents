<?php
// =====================================================================
//  The Gent's — API configuration
//  Edit these credentials to match your MySQL / phpMyAdmin setup.
// =====================================================================
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'thegents_db');
define('DB_USER', 'root');
define('DB_PASS', '');

define('UPLOAD_DIR', __DIR__ . '/../uploads');
define('UPLOAD_URL', '/uploads');
define('MAX_UPLOAD_BYTES', 8 * 1024 * 1024); // 8 MB
