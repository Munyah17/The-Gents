// Clean demo data out of gents_db.sql:
//  1) remove demo bookings + demo client INSERT statements
//  2) parse site_data payload, strip demo bookings/clientProfile/members,
//     rewrite the INSERT with the cleaned JSON
// Also emits gents_cleanup.sql for the LIVE database (full payload replace).
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const sqlPath = path.join(ROOT, 'gents_db.sql');
let sql = fs.readFileSync(sqlPath, 'utf8');

// --- 1) drop demo INSERT blocks ---
sql = sql.replace(/INSERT INTO bookings \([\s\S]*?\);\n?/i, '');
sql = sql.replace(/-- notifications: none\n?/i, '');
sql = sql.replace(/INSERT INTO clients \([\s\S]*?\);\n?/i, '');

// --- 2) extract + clean the site_data payload ---
const m = sql.match(/INSERT INTO site_data \(id, payload\) VALUES \(1, '([\s\S]*?)'\);/);
if (!m) throw new Error('site_data INSERT not found');
const inner = m[1].replace(/''/g, "'");           // SQL unescape
const payload = JSON.parse(inner);

const isDemo = b => /@example\.com$/i.test(b.email || '');
payload.bookings = (payload.bookings || []).filter(b => !isDemo(b));
payload.clientProfile = { name: '', phone: '', email: '', favBranch: '', favBarber: '' };
payload.members = [];
// scrub any other lingering demo emails
const scrub = o => {
  if (Array.isArray(o)) return o.forEach(scrub);
  if (o && typeof o === 'object') for (const k in o) {
    if (typeof o[k] === 'string' && /@example\.com$/i.test(o[k])) o[k] = '';
    else scrub(o[k]);
  }
};
scrub(payload);

const cleanJson = JSON.stringify(payload);
const escSql = s => s.replace(/'/g, "''");
const newInsert = `INSERT INTO site_data (id, payload) VALUES (1, '${escSql(cleanJson)}');`;
sql = sql.replace(m[0], newInsert);
fs.writeFileSync(sqlPath, sql);
console.log('gents_db.sql cleaned — payload', inner.length, '->', cleanJson.length, 'bytes; bookings:', payload.bookings.length);

// --- 3) cleanup SQL for the live DB (full payload swap + table deletes) ---
const cleanup = `-- The Gents — purge demo data from the LIVE database (phpMyAdmin safe)
DELETE FROM bookings WHERE email LIKE '%@example.com';
DELETE FROM clients  WHERE email LIKE '%@example.com';
UPDATE site_data SET payload = '${escSql(cleanJson)}' WHERE id = 1;
`;
fs.writeFileSync(path.join(ROOT, 'gents_cleanup.sql'), cleanup);
console.log('wrote gents_cleanup.sql');
