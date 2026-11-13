// Build: concatenate src/* into assets/ + generate page shells.
// Source of truth lives in src/ — edit those files, never the output.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const read = f => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8');

// --- CSS: core + admin + mobile (order matters — later wins) ---
let css = read('core.css') + '\n' + read('admin.css')
  + '\n.slider-content h1{white-space:nowrap;font-size:clamp(15px,4.6vw,44px)}\n'
  + '\n' + read('mobile.css');

// --- JS: core with module extras spliced at the marker ---
const EXTRAS = ['admin-extra.js', 'client-extra.js', 'erp-extra.js', 'content-extra.js', 'membership-extra.js'];
let js = read('core.js');
const extras = EXTRAS.map(read).join('\n');
if (!js.includes('/*@@EXTRAS@@*/')) throw new Error('extras marker missing from src/core.js');
js = js.replace('/*@@EXTRAS@@*/', () => extras);

// --- Write assets ---
fs.mkdirSync(path.join(ROOT, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'assets', 'js'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets', 'css', 'style.css'), css.trim() + '\n');
fs.writeFileSync(path.join(ROOT, 'assets', 'js', 'app.js'), js);

// --- Generate pages (hash-versioned assets) ---
const V = crypto.createHash('md5').update(css + js).digest('hex').slice(0, 8);
const tpl = (dp, title) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><title>The Gent’s · ${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=${V}">
</head>
<body data-page="${dp}">
<div id="app"></div><div id="modal-root"></div><div id="toast-root"></div>
<script src="assets/js/app.js?v=${V}"></script>
</body>
</html>
`;

const pages = [
  ['index.html', 'home', 'Home'],
  ['services.html', 'services', 'Services'],
  ['barbers.html', 'barbers', 'Barbers'],
  ['gallery.html', 'gallery', 'Gallery'],
  ['membership.html', 'membership', 'Membership'],
  ['contact.html', 'contact', 'Contact'],
  ['login.html', 'login', 'Login'],
  ['booking.html', 'booking', 'Book Appointment'],
  ['client.html', 'client', 'My Bookings'],
  ['admin.html', 'admin', 'Admin'],
  ['branch.html', 'branch', 'Branch'],
];

for (const [file, dp, title] of pages) {
  fs.writeFileSync(path.join(ROOT, file), tpl(dp, title));
  console.log('wrote', file);
}
console.log('done — bundle v' + V);
