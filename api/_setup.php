<?php
require __DIR__ . '/lib.php';
try {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';port=' . DB_PORT, DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec('CREATE DATABASE IF NOT EXISTS ' . DB_NAME . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    echo "database " . DB_NAME . " ready\n";
    ensureSchema();
    echo "tables ready\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
