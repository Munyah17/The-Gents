const B = 'http://localhost:8080/api';
const j = r => r.json();
const log = (n, ok, x = '') => console.log((ok ? 'PASS' : 'FAIL') + ' ' + n + (x ? ' — ' + x : ''));
const post = (u, b, cookie) => fetch(B + u, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify(b) });

const booking = { id: 'GT-T1', name: 'Test Client', branch: 'borrowdale', service: 'cut', date: '2026-12-01', time: '10:00', status: 'Pending', source: 'Online', clientCreated: true, clientEmail: 'client@test.com' };
const dbGet = () => fetch(B + '/db.php').then(j);

(async () => {
  // ensure site_data seeded (reuse existing or seed minimal)
  let g = await dbGet();
  if (!g.data) {
    await post('/db.php', { branches: [], services: [{ id: 'cut', name: 'Cut', price: 10, branches: ['borrowdale'] }], barbers: [], bookings: [], contacts: [], notifications: [], membership: false, settings: {}, hero: [], gallery: [] });
    g = await dbGet();
  }
  log('site data present', !!g.data);

  // 1. guest booking append should now be DROPPED (no client session)
  const before = g.data.bookings.length;
  const guestDb = JSON.parse(JSON.stringify(g.data));
  guestDb.bookings.push(booking);
  await post('/db.php', guestDb);
  g = await dbGet();
  log('guest booking append rejected', g.data.bookings.length === before, 'n=' + g.data.bookings.length);

  // 2. client register
  let r = await post('/auth.php', { action: 'client-register', name: 'Test Client', email: 'client@test.com', phone: '+263770000001', password: 'secret123' });
  let d = await j(r); const cookie = r.headers.get('set-cookie');
  log('client register', r.ok && d.ok && d.client && d.client.email === 'client@test.com', JSON.stringify(d.client || d));

  // 3. duplicate register → 409
  r = await post('/auth.php', { action: 'client-register', name: 'X', email: 'client@test.com', password: 'secret123' });
  log('duplicate register → 409', r.status === 409);

  // 4. client login
  r = await post('/auth.php', { action: 'client-login', email: 'client@test.com', password: 'secret123' });
  d = await j(r); const cookie2 = r.headers.get('set-cookie');
  log('client login', r.ok && d.ok, JSON.stringify(d.client || {}).slice(0, 80));

  // 5. bad client login → 401
  r = await post('/auth.php', { action: 'client-login', email: 'client@test.com', password: 'wrong' });
  log('bad client login → 401', r.status === 401);

  // 6. authed client booking append should SUCCEED
  const cliDb = JSON.parse(JSON.stringify(g.data));
  cliDb.bookings.push(booking);
  await post('/db.php', cliDb, cookie2);
  g = await dbGet();
  log('client booking append accepted', g.data.bookings.some(b => b.id === 'GT-T1'), 'n=' + g.data.bookings.length);
  log('clientEmail persisted', g.data.bookings.find(b => b.id === 'GT-T1').clientEmail === 'client@test.com');

  // 7. auth GET returns client info
  r = await fetch(B + '/auth.php', { headers: { cookie: cookie2 } });
  d = await j(r);
  log('auth GET client info', d.client && d.client.email === 'client@test.com', 'ok=' + d.ok);

  // 8. cleanup: remove test booking via admin? just leave it — or delete via reset? Leave; it's test data in dev DB.
})();
