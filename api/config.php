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

// =====================================================================
//  Paynow Zimbabwe — wallet top-ups & payments
//  Get ID + Key from https://www.paynow.co.zw → your integration.
//  Leave empty to disable online payments (manual top-up requests only).
// =====================================================================
define('PAYNOW_ID', '');
define('PAYNOW_KEY', '');
define('PAYNOW_BASE', 'https://www.paynow.co.zw'); // SDK hits this internally

// =====================================================================
//  SMTP — booking notifications (new requests + status changes)
//  cPanel email account. Port 587 = STARTTLS, 465 = SSL.
//  Leave SMTP_HOST empty to disable email sending.
// =====================================================================
define('SMTP_HOST', 'mail.thegents.co.zw');
define('SMTP_PORT', 465);
define('SMTP_USER', 'admin@thegents.co.zw');
define('SMTP_PASS', '@@Thegents12345#$');
define('SMTP_FROM', 'admin@thegents.co.zw');
define('SMTP_FROM_NAME', "The Gent's Barber");

// Company inbox that receives new-booking alerts (falls back to settings.email)
define('NOTIFY_EMAIL', 'admin@thegents.co.zw');
