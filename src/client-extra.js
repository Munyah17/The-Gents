// ===== The Gent's — Client portal =====
// Injected inside app.js IIFE by _build.js. Overrides client() and adds
// cl-* actions + a capture-phase listener for client-side tab switching.

let clientView = 'overview';
const cp = () => db.clientProfile || (db.clientProfile = { name: 'T. Moyo', phone: '+263771234567', email: 'tmoyo@example.com', favBranch: '', favBarber: '' });
function clClient() { try { return JSON.parse(sessionStorage.getItem('gents_client') || 'null') } catch (e) { return null } }
function clEmail() { const c = clClient(); return (c && c.email) || '' }
const myBookings = () => { const em = clEmail(); return db.bookings.filter(b => em ? ((b.clientEmail && b.clientEmail === em) || (!b.clientEmail && cp().phone && b.phone === cp().phone)) : (b.clientCreated || (cp().phone && b.phone === cp().phone))) };
const clPoints = list => (list || myBookings()).filter(b => b.status === 'Completed').length * 100;

function client() {
  const p = cp();
  const list = myBookings();
  const upcoming = list.filter(x => !['Completed', 'Cancelled', 'Declined'].includes(x.status));
  const past = list.filter(x => !upcoming.includes(x));
  let content = '';
  if (clientView === 'bookings') content = clBookings(list, upcoming, past);
  else if (clientView === 'rewards') content = clRewards(list);
  else if (clientView === 'notifications') content = clNotifications(list);
  else if (clientView === 'profile') content = clProfile(p);
  else content = clOverview(p, list, upcoming);
  return dashboardFrame('client', content);
}

// ---------- Overview ----------
function clOverview(p, list, upcoming) {
  const next = upcoming.slice().sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];
  const done = list.filter(b => b.status === 'Completed').length;
  const pts = clPoints(list);
  return `<div class="dash-top"><div><div class="eyebrow">WELCOME BACK</div><h1>Hello, ${esc((p.name || 'there').split(' ')[0])}</h1><p class="muted">Here’s what’s happening with your bookings.</p></div>${button('Book New Appointment →', 'start-booking', 'btn btn-gold')}</div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Next Appointment</h3></div>${next ? `<div class="appointment"><div><strong>${esc(service(next.service).name)}</strong><small>⌖ ${esc(branch(next.branch).name)} · ${esc(barber(next.barber).name)} · ${fmt(next.date)} at ${esc(next.time)}</small></div>${badge(next.status)}</div>` : '<p class="muted">No upcoming appointments — book your next visit.</p>'}</div>
  <div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="grid grid-3">${button('Book Appointment', 'start-booking', 'btn')}${button('My Bookings', 'client-side:bookings', 'btn')}${button('Rewards', 'client-side:rewards', 'btn')}</div></div></div>
  <div class="stat-grid">${[['▢', upcoming.length, 'Upcoming'], ['✓', done, 'Completed Visits'], ['★', pts, 'Reward Points'], ['♙', list.length, 'Total Bookings']].map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div>
  <div class="panel"><div class="panel-head"><h3>Recent Bookings</h3><button class="btn btn-sm" data-action="client-side:bookings">View all</button></div>${list.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map(clBookingRow).join('') || '<p class="muted">No bookings yet.</p>'}</div>`;
}

function clBookingRow(b) {
  return `<div class="appointment"><div><strong>${esc(service(b.service).name)}</strong><small>${b.id} · ⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</small></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${badge(b.status)}<button class="btn btn-sm" data-action="cl-details:${b.id}">Details</button></div></div>`;
}

// ---------- My Bookings ----------
function clBookings(list, upcoming, past) {
  const show = clientTab === 'upcoming' ? upcoming : clientTab === 'past' ? past : list;
  const tabs = [['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'All']];
  return `<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>My Bookings</h1><p class="muted">View and manage your appointments.</p></div>${button('Book New Appointment →', 'start-booking', 'btn btn-gold')}</div>
  <div class="segmented" style="margin-bottom:22px">${tabs.map(([k, t]) => `<button class="pill ${clientTab === k ? 'active' : ''}" data-action="client-tab:${k}">${t} (${k === 'upcoming' ? upcoming.length : k === 'past' ? past.length : list.length})</button>`).join('')}</div>
  ${show.map(b => `<div class="card" style="padding:20px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap"><div><div class="eyebrow" style="font-size:10px">${esc(b.id)}</div><h3 style="margin:6px 0 4px">${esc(service(b.service).name)}</h3><p class="muted small" style="margin:0">⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</p></div><div style="text-align:right"><div style="font-size:17px;font-weight:700;color:var(--gold)">${money(service(b.service).price)}</div><div style="margin:8px 0">${badge(b.status)}</div></div></div><div class="row-actions" style="margin-top:14px"><button class="btn btn-sm" data-action="cl-details:${b.id}">Details</button>${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn btn-sm" data-action="client-cancel:${b.id}">Cancel</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-sm" data-action="rebook:${b.id}">Rebook</button>` : ''}</div></div>`).join('') || `<div class="empty card">No ${clientTab === 'all' ? '' : clientTab} bookings yet. <a href="booking.html" style="color:var(--gold)">Book an appointment</a>.</div>`}`;
}

function clDetails(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  const rows = [['Reference', b.id], ['Service', service(b.service).name + ' · ' + service(b.service).duration + ' min'], ['Price', money(service(b.service).price)], ['Branch', branch(b.branch).name], ['Barber', barber(b.barber).name], ['Date', fmt(b.date)], ['Time', b.time], ['Status', b.status]];
  modal('Appointment ' + esc(b.id), rows.map(([k, v]) => `<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="auth-actions" style="margin-top:18px">${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn" data-action="client-cancel:${b.id}">Cancel Booking</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-gold" data-action="rebook:${b.id}">Book Again</button>` : ''}</div>`);
}

// ---------- Rewards ----------
function clRewards(list) {
  const done = list.filter(b => b.status === 'Completed').sort((a, b) => a.date.localeCompare(b.date));
  const pts = done.length * 100;
  const tier = pts >= 800 ? 'Gold' : pts >= 300 ? 'Silver' : 'Bronze';
  const nextAt = pts >= 800 ? null : pts >= 300 ? 800 : 300;
  const pct = nextAt ? Math.min(100, Math.round(pts / nextAt * 100)) : 100;
  const perks = [['Bronze', '100 points per completed visit'], ['Silver', '10% off retail · priority booking'], ['Gold', 'Free beard trim monthly · early access']];
  const marks = ['◌', '◑', '●'];
  return `<div class="dash-top"><div><div class="eyebrow">LOYALTY</div><h1>Rewards</h1><p class="muted">Earn points every time you visit.</p></div></div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Your Tier · ${tier}</h3></div><div style="font-size:34px;font-weight:700;color:var(--gold)">${pts}<span class="small muted"> pts</span></div><div class="progress-row" style="margin-top:14px"><span>${nextAt ? nextAt + ' pts for ' + (pts >= 300 ? 'Gold' : 'Silver') : 'Top tier reached'}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><b>${pct}%</b></div><p class="muted small" style="margin-top:14px">100 points per completed appointment.</p></div>
  <div class="panel"><div class="panel-head"><h3>Perks</h3></div>${perks.map(([t, d], i) => `<div class="progress-row"><span>${marks[i]} ${t}</span><b class="small muted" style="font-weight:500">${d}</b></div>`).join('')}</div></div>
  <div class="panel"><div class="panel-head"><h3>Points History</h3></div>${done.map(b => `<div class="data-line"><span class="muted">${fmt(b.date)} · ${esc(service(b.service).name)}</span><b>+100 pts</b></div>`).join('') || '<p class="muted">Complete an appointment to start earning.</p>'}</div>`;
}

// ---------- Notifications ----------
function clNotifications(list) {
  const ids = list.map(b => b.id);
  const notes = (db.notifications || []).filter(n => ids.some(id => n.includes(id)));
  return `<div class="dash-top"><div><div class="eyebrow">UPDATES</div><h1>Notifications</h1><p class="muted">Booking confirmations and status changes.</p></div></div><div class="panel">${notes.map(n => `<div class="data-line"><span>◔</span><b class="small" style="font-weight:500">${esc(n)}</b></div>`).join('') || '<p class="muted">No notifications yet.</p>'}</div>`;
}

// ---------- Profile ----------
function clProfile(p) {
  return `<div class="dash-top"><div><div class="eyebrow">ACCOUNT</div><h1>Profile</h1><p class="muted">Your details are used for bookings and receipts.</p></div></div>
  <div class="panel" style="max-width:640px"><form id="cl-profile-form"><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(p.name || '')}"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" required name="phone" value="${esc(p.phone || '')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" value="${esc(p.email || '')}"></div><div class="form-group"><label class="form-label">Favorite branch</label><select class="field" name="favBranch"><option value="">No preference</option>${db.branches.map(b => `<option value="${b.id}" ${p.favBranch === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Favorite barber</label><select class="field" name="favBarber"><option value="">No preference</option>${db.barbers.map(b => `<option value="${b.id}" ${p.favBarber === b.id ? 'selected' : ''}>${esc(b.name)} · ${esc(branch(b.branch).name)}</option>`).join('')}</select></div></div><button class="btn btn-gold">Save Profile</button></form><div class="auth-actions" style="margin-top:14px">${button('Sign Out','cl-logout','btn btn-sm')}</div><p class="muted small" style="margin-top:16px">Bookings are matched to your account by email and phone number.</p></div>`;
}

// ---------- Booking auth gate (sign in / register to finish booking) ----------
let clAuthMode = 'login';
function clAuthModal() {
  const reg = clAuthMode === 'register';
  modal('One quick step', `<p class="muted" style="margin-top:0">Sign in or create a free account to confirm your booking.</p>
  <div class="segmented" style="margin-bottom:16px"><button class="pill ${!reg ? 'active' : ''}" data-action="cl-auth-mode:login">Sign In</button><button class="pill ${reg ? 'active' : ''}" data-action="cl-auth-mode:register">Create Account</button></div>
  <form id="client-auth-form" data-mode="${clAuthMode}">
    ${reg ? `<div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" placeholder="Your full name"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" name="phone" placeholder="+263..."></div>` : ''}
    <div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" placeholder="you@example.com"></div>
    <div class="form-group"><label class="form-label">Password</label><input class="field" type="password" required name="password" minlength="6" placeholder="${reg ? 'Choose a password (6+ characters)' : 'Your password'}"></div>
    <button class="btn btn-gold" type="submit" style="width:100%">${reg ? 'Create Account & Book →' : 'Sign In & Book →'}</button>
  </form>
  <p class="muted small" style="margin-top:14px;text-align:center">Your booking details are kept — you'll finish right after.</p>`);
}
// Intercept Submit Booking before the main handler when the visitor isn't signed in.
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action="book-submit"]');
  if (el && !auth('client') && !auth('admin')) { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = 'login'; clAuthModal(); }
}, true);

// ---------- Events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c === 'cl-auth-mode') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = v; return clAuthModal(); }
  if (c === 'cl-register') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = 'register'; return clAuthModal(); }
  if (c === 'cl-logout') {
    e.preventDefault(); e.stopImmediatePropagation();
    try { sessionStorage.removeItem('gents_auth'); sessionStorage.removeItem('gents_client'); sessionStorage.removeItem('gents_staff'); fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"logout"}', credentials: 'same-origin' }).catch(() => {}); } catch (x) {}
    location.href = 'login.html'; return;
  }
  if (page !== 'client') return;
  if (c === 'client-side') { e.preventDefault(); e.stopImmediatePropagation(); clientView = v; render(); return; }
  if (c === 'cl-details') { e.stopImmediatePropagation(); return clDetails(v); }
}, true);

document.addEventListener('submit', async e => {
  const form = e.target;
  if (form.id === 'client-auth-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
    try {
      const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: form.dataset.mode === 'register' ? 'client-register' : 'client-login', name: v.name, email: v.email, phone: v.phone, password: v.password }), credentials: 'same-origin' });
      const j = await r.json();
      if (j && j.ok) {
        try { sessionStorage.setItem('gents_auth', 'client'); sessionStorage.setItem('gents_client', JSON.stringify(j.client)); sessionStorage.removeItem('gents_staff') } catch (x) {}
        closeModal(); toast('Welcome' + (j.client && j.client.name ? ', ' + j.client.name.split(' ')[0] : '') + '! Confirming your booking…');
        handle('book-submit'); return;
      }
      if (r.status === 409) { clAuthMode = 'login'; clAuthModal(); toast('Account already exists — please sign in.'); return; }
      toast((j && j.error === 'invalid credentials') ? 'Invalid email or password.' : ((j && j.error) || 'Sign-in failed — please try again.'));
    } catch (x) { toast('Could not reach the server — check your connection.'); }
    if (btn) btn.disabled = false; return;
  }
  if (form.id !== 'cl-profile-form') return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(form));
  db.clientProfile = { name: v.name, phone: v.phone, email: v.email, favBranch: v.favBranch || '', favBarber: v.favBarber || '' };
  save(); toast('Profile saved.'); render();
});
