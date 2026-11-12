# The Gents Barber — project notes

## Build
- Edit `prototype.html` and/or `src/*-extra.js`, then run `node _build.js` to regenerate all `.html` pages + `assets/`.
- Local run: `php -S localhost:8080 router.php` (extensionless routes work).
- Production: upload everything + `.htaccess`; import `thegents_db.sql` into the cPanel database.

## Conventions / rules
- **Barber card photos**: `.barber-photo` is `aspect-ratio:3/4` + `object-fit:cover` + `object-position:50% 15%` — portrait frame, top-biased crop so faces are never cut. Never use `contain` (leaves side gaps) or plain `cover` without top bias.
- **Homepage barber sections**: strictly 4 columns × 1 row per branch — slice to 4, extras reachable via "View All Barbers".
- **Branch ids are stable**: `borrowdale` displays as "Kudu Corner", `fife` as "Five Avenue" — never rename ids (bookings/barbers reference them).
- **API auth**: admin/staff permissions enforced server-side in `api/db.php` + `api/lib.php`; never expose staff passwords in payloads.
- **Secrets** live in `api/config.php` (DB, SMTP, Paynow) — do not commit to public remotes; rotate if exposed.
