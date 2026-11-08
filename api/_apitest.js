// API smoke test — run: node api/_apitest.js
const B = 'http://localhost:8080/api';
const j = r => r.json();
const log = (name, ok, extra = '') => console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (extra ? ' — ' + extra : ''));

const seed = {
  branches: [{ id: 'borrowdale', name: 'Borrowdale' }],
  services: [{ id: 'cut', name: 'Precision Haircut', price: 12 }],
  barbers: [{ id: 'tawanda', name: 'Tawanda M.' }],
  bookings: [{ id: 'GT-1042', name: 'T. Moyo', branch: 'borrowdale', service: 'cut', barber: 'tawanda', date: '2026-11-08', time: '10:00', status: 'Confirmed', source: 'Online' }],
  contacts: [], notifications: [], membership: false,
  settings: { name: "The Gent's", phone: '+263 77 601 1938' },
  staff: [{ id: 'admin1', name: 'Munyah', email: 'munyah777@gmail.com', password: '@@Griezmann177#$', permissions: '*' }],
  hero: [{ title: 'Slide 1', desc: 'd', photo: 'x.jpg' }],
  gallery: [{ url: 'g.jpg', alt: 'a', category: 'Salon' }]
};

(async () => {
  // 1. guest seed POST (empty server)
  let r = await fetch(B + '/db.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(seed) });
  let d = await j(r); log('guest seed POST', r.ok && d.ok);

  // 2. guest GET — staff must be stripped
  r = await fetch(B + '/db.php'); d = await j(r);
  log('guest GET strips staff', d.ok && d.data && d.data.staff === undefined, 'staff=' + d.data.staff);
  log('guest GET keeps hero', d.data.hero && d.data.hero.length === 1);

  // 3. guest tries admin header without session → 403
  r = await fetch(B + '/db.php', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Gents-Role': 'admin' }, body: JSON.stringify(seed) });
  log('admin header w/o session → 403', r.status === 403, 'status=' + r.status);

  // 4. guest merge: change services (protected) + add booking + cancel booking
  const mod = JSON.parse(JSON.stringify(seed));
  mod.services[0].price = 999;                                   // should be ignored
  mod.bookings.push({ id: 'GT-2000', name: 'New Client', branch: 'borrowdale', service: 'cut', date: '2026-11-09', time: '12:00', status: 'Pending', source: 'Online' }); // allowed
  mod.bookings[0].status = 'Cancelled';                          // allowed (client cancel)
  r = await fetch(B + '/db.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mod) });
  d = await j(r);
  const g = await j(await fetch(B + '/db.php'));
  log('merge adds booking', g.data.bookings.length === 2, 'n=' + g.data.bookings.length);
  log('merge keeps service price', g.data.services[0].price === 12, 'price=' + g.data.services[0].price);
  log('merge allows cancel', g.data.bookings.find(b => b.id === 'GT-1042').status === 'Cancelled');

  // 5. guest tries non-cancel status change → ignored
  const mod2 = JSON.parse(JSON.stringify(g.data));
  mod2.bookings.find(b => b.id === 'GT-1042').status = 'Completed';
  await fetch(B + '/db.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mod2) });
  const g2 = await j(await fetch(B + '/db.php'));
  log('non-cancel status blocked', g2.data.bookings.find(b => b.id === 'GT-1042').status === 'Cancelled');

  // 6. admin login
  r = await fetch(B + '/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'munyah777@gmail.com', password: '@@Griezmann177#$' }) });
  d = await j(r); const cookie = r.headers.get('set-cookie');
  log('admin login', r.ok && d.ok && d.staff && d.staff.permissions === '*', JSON.stringify(d.staff || {}).slice(0, 80));

  // 7. admin GET returns staff unmasked
  r = await fetch(B + '/db.php', { headers: { cookie } });
  d = await j(r);
  log('admin GET has staff', d.ok && Array.isArray(d.data.staff) && d.data.staff.length === 1);

  // 8. admin full replace (change service price + add gallery)
  const adm = JSON.parse(JSON.stringify(d.data));
  adm.services[0].price = 15;
  adm.gallery.push({ url: 'new.jpg', alt: 'New', category: 'Haircuts' });
  r = await fetch(B + '/db.php', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Gents-Role': 'admin', cookie }, body: JSON.stringify(adm) });
  d = await j(r); log('admin POST ok', r.ok && d.ok);
  const g3 = await j(await fetch(B + '/db.php'));
  log('admin change persisted', g3.data.services[0].price === 15, 'price=' + g3.data.services[0].price);
  log('admin gallery persisted', g3.data.gallery.length === 2);

  // 9. wrong password → 401
  r = await fetch(B + '/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'munyah777@gmail.com', password: 'wrong' }) });
  log('bad login → 401', r.status === 401);

  // 10. reset
  r = await fetch(B + '/db.php', { method: 'POST', headers: { 'Content-Type': 'application/json', cookie }, body: '{"__reset":true}' });
  d = await j(r); log('admin reset', r.ok && d.ok);
  r = await fetch(B + '/db.php'); d = await j(r);
  log('data cleared', d.data === null);
})();
