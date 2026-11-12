<?php
// Minimal SMTP client — AUTH LOGIN + STARTTLS, no external dependencies.
// Works on shared cPanel hosting. All failures are silent (never break the API).
require_once __DIR__ . '/config.php';

function smtpRead($fp): string {
    $r = '';
    while (($l = fgets($fp, 515)) !== false) {
        $r .= $l;
        if (isset($l[3]) && $l[3] === ' ') break;
    }
    return $r;
}

function smtpCmd($fp, string $cmd, string $expect = '250'): string {
    fwrite($fp, $cmd . "\r\n");
    $r = smtpRead($fp);
    if ($expect !== '' && substr($r, 0, 3) !== $expect) throw new Exception('SMTP: ' . trim($r));
    return $r;
}

function mimeHeader(string $s): string {
    return preg_match('//u', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
}

// Returns true on success, false on any failure (never throws).
function sendMail(string $to, string $subject, string $html, string $text = ''): bool {
    if (!defined('SMTP_HOST') || !SMTP_HOST || !defined('SMTP_USER') || !SMTP_USER) return false;
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) return false;
    $host = SMTP_HOST;
    $port = defined('SMTP_PORT') && SMTP_PORT ? SMTP_PORT : 587;
    $secure = ($port === 465);
    $fp = @fsockopen(($secure ? 'ssl://' : 'tcp://') . $host, $port, $errno, $errstr, 15);
    if (!$fp) return false;
    try {
        smtpRead($fp); // banner
        smtpCmd($fp, 'EHLO ' . (gethostname() ?: 'localhost'));
        if (!$secure) {
            smtpCmd($fp, 'STARTTLS', '220');
            if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new Exception('TLS failed');
            smtpCmd($fp, 'EHLO ' . (gethostname() ?: 'localhost'));
        }
        smtpCmd($fp, 'AUTH LOGIN', '334');
        smtpCmd($fp, base64_encode(SMTP_USER), '334');
        smtpCmd($fp, base64_encode(SMTP_PASS), '235');
        smtpCmd($fp, 'MAIL FROM: <' . SMTP_FROM . '>');
        smtpCmd($fp, 'RCPT TO: <' . $to . '>');
        smtpCmd($fp, 'DATA', '354');
        $fromName = defined('SMTP_FROM_NAME') ? SMTP_FROM_NAME : 'The Gent\'s Barber';
        $headers = "From: " . mimeHeader($fromName) . " <" . SMTP_FROM . ">\r\n"
                 . "To: <{$to}>\r\n"
                 . "Subject: " . mimeHeader($subject) . "\r\n"
                 . "MIME-Version: 1.0\r\n"
                 . "Content-Type: text/html; charset=UTF-8\r\n"
                 . "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body = $html . "\r\n";
        if ($text !== '') $body = '<!-- plain -->' . "\r\n" . $text . "\r\n" . $html;
        fwrite($fp, $headers . $body . "\r\n.\r\n");
        smtpRead($fp);
        smtpCmd($fp, 'QUIT', '221');
        fclose($fp);
        return true;
    } catch (Throwable $t) {
        @fclose($fp);
        return false;
    }
}
