<?php
// Router for PHP's built-in server: enables extensionless page URLs.
//   /admin  →  admin.html      /booking  →  booking.html
//   /api/... and real files are served normally.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;

// Existing files/dirs (assets, api, .php, .html, uploads…) — serve directly
if ($path !== '/' && (is_file($file) || is_dir($file))) return false;

// Extensionless URL → try .html
if ($path !== '/' && is_file($file . '.html')) {
    require $file . '.html';
    return true;
}

// Root → index.html
if ($path === '/' || $path === '/index') {
    require __DIR__ . '/index.html';
    return true;
}

http_response_code(404);
echo '404 Not Found';
return true;
