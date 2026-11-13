// ===== The Gent's — Client portal =====
// Injected inside app.js IIFE by _build.js. Overrides client() and adds
// cl-* actions + a capture-phase listener for client-side tab switching.

let clientView = 'overview';
const cp = () => db.clientProfile || (db.clientProfile = { name: '', phone: '', email: '', favBranch: '', favBarber: '' });
function clClient() { try { return JSON.parse(sessionStorage.getItem('gents_client') || 'null') } catch (e) { return null } }
function clEmail() { const c = clClient(); return (c && c.email) || '' }
const myBookings = () => { const em = clEmail(); return db.bookings.filter(b => em ? ((b.clientEmail && b.clientEmail === em) || (!b.clientEmail && cp().phone && b.phone === cp().phone)) : (b.clientCreated || (cp().phone && b.phone === cp().phone))) };
const clPerVisit = () => (clMem && clMem.rewards && clMem.rewards.perVisit) || 100;
const clPoints = list => { const done = (list || myBookings()).filter(b => b.status === 'Completed').length; const ov = clMem && clMem.rewards ? clMem.rewards.override : null; return ov != null ? ov : done * clPerVisit(); };

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
  else if (clientView === 'membership') content = clMembership();
  else if (clientView === 'wallet') content = clWallet();
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
  ${show.map(b => `<div class="card" style="padding:20px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap"><div><div class="eyebrow" style="font-size:10px">${esc(b.id)}</div><h3 style="margin:6px 0 4px">${esc(service(b.service).name)}</h3><p class="muted small" style="margin:0">⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</p></div><div style="text-align:right"><div style="font-size:17px;font-weight:700;color:var(--gold)">${money(service(b.service).price)}</div><div style="margin:8px 0">${badge(b.status)}</div></div></div><div class="row-actions" style="margin-top:14px"><button class="btn btn-sm" data-action="cl-details:${b.id}">Details</button>${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn btn-sm" data-action="client-cancel:${b.id}">Cancel</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-sm" data-action="rebook:${b.id}">Rebook</button>` : ''}</div></div>`).join('') || `<div class="empty card">No ${clientTab === 'all' ? '' : clientTab} bookings yet. <a href="booking" style="color:var(--gold)">Book an appointment</a>.</div>`}`;
}

function clDetails(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  const rows = [['Reference', b.id], ['Service', service(b.service).name + ' · ' + service(b.service).duration + ' min'], ['Price', money(service(b.service).price)], ['Branch', branch(b.branch).name], ['Barber', barber(b.barber).name], ['Date', fmt(b.date)], ['Time', b.time], ['Status', b.status]];
  modal('Appointment ' + esc(b.id), rows.map(([k, v]) => `<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="auth-actions" style="margin-top:18px">${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn" data-action="client-cancel:${b.id}">Cancel Booking</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-gold" data-action="rebook:${b.id}">Book Again</button>` : ''}</div>`);
}

// ---------- Rewards ----------
function clRewards(list) {
  clKickMem();
  const done = list.filter(b => b.status === 'Completed').sort((a, b) => a.date.localeCompare(b.date));
  const pts = clPoints(list);
  const perVisit = clPerVisit();
  const tier = pts >= 800 ? 'Gold' : pts >= 300 ? 'Silver' : 'Bronze';
  const nextAt = pts >= 800 ? null : pts >= 300 ? 800 : 300;
  const pct = nextAt ? Math.min(100, Math.round(pts / nextAt * 100)) : 100;
  const perks = [['Bronze', perVisit + ' points per completed visit'], ['Silver', '10% off retail · priority booking'], ['Gold', 'Free beard trim monthly · early access']];
  const marks = ['◌', '◑', '●'];
  const adjusted = clMem && clMem.rewards && clMem.rewards.override != null;
  return `<div class="dash-top"><div><div class="eyebrow">LOYALTY</div><h1>Rewards</h1><p class="muted">Earn points every time you visit.</p></div></div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Your Tier · ${tier}</h3></div><div style="font-size:34px;font-weight:700;color:var(--gold)">${pts}<span class="small muted"> pts</span></div><div class="progress-row" style="margin-top:14px"><span>${nextAt ? nextAt + ' pts for ' + (pts >= 300 ? 'Gold' : 'Silver') : 'Top tier reached'}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><b>${pct}%</b></div><p class="muted small" style="margin-top:14px">${perVisit} points per completed appointment.${adjusted ? ' Points adjusted by the grooming center.' : ''}</p></div>
  <div class="panel"><div class="panel-head"><h3>Perks</h3></div>${perks.map(([t, d], i) => `<div class="progress-row"><span>${marks[i]} ${t}</span><b class="small muted" style="font-weight:500">${d}</b></div>`).join('')}</div></div>
  <div class="panel"><div class="panel-head"><h3>Points History</h3></div>${done.map(b => `<div class="data-line"><span class="muted">${fmt(b.date)} · ${esc(service(b.service).name)}</span><b>+${perVisit} pts</b></div>`).join('') || '<p class="muted">Complete an appointment to start earning.</p>'}</div>`;
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
    <div class="form-group"><label class="form-label">Email, name or pseudonym</label><input class="field" type="text" required name="email" placeholder="you@example.com · Alex Demo · AD"></div>
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

// ---------- Membership & Wallet ----------
let clMem = null, clMemLoading = false, clMemLoaded = false;
async function clLoadMem(force) {
  if (clMemLoading || (clMemLoaded && !force)) return;
  clMemLoading = true;
  try { const r = await fetch('api/member.php', { credentials: 'same-origin' }); const j = await r.json(); if (j && j.ok) clMem = j; }
  catch (e) {}
  clMemLoading = false; clMemLoaded = true;
  if (page === 'client') render();
}
function clKickMem(force) { if (force || !clMemLoaded) clLoadMem(force); }

function clMembership() {
  clKickMem();
  const top = `<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>Membership</h1><p class="muted">Your digital member card — tap it to flip.</p></div>${button('Wallet →', 'client-side:wallet', 'btn')}</div>`;
  if (!clMemLoaded) return top + '<div class="panel"><p class="muted">Loading your membership…</p></div>';
  const m = clMem && clMem.member;
  if (!m) return top + `<div class="panel" style="max-width:560px"><h3>Not a member yet</h3><p class="muted">Enrol for a membership card to unlock member rates, a wallet and gift cards. Basic tier is free to join.</p><div style="margin-top:16px">${button('Enrol — Basic Tier', 'cl-enrol', 'btn btn-gold')}</div></div>`;
  const w = (clMem.wallet || {}).balance || 0;
  return top + `<div class="dash-grid"><div>${clCard(m)}<p class="muted small" style="text-align:center;margin-top:10px">Tap the card to flip it · valid at any branch</p></div>
  <div><div class="panel"><div class="panel-head"><h3>${esc(m.tierName || 'Member')}</h3><span class="mem-tier" style="--tc:${esc(m.tierColor || '#9aa3ad')}">${esc(m.tierName || '')}</span></div>
  <div class="data-line"><span class="muted">Member No</span><b>${esc(m.memberNo)}</b></div>
  <div class="data-line"><span class="muted">Status</span><b>${m.status === 'active' ? 'Active' : 'Suspended'}</b></div>
  <div class="data-line"><span class="muted">Wallet balance</span><b>$${Number(w).toFixed(2)}</b></div>
  <p class="muted small" style="margin-top:14px">${esc(m.perks || '')}</p>
  <div class="auth-actions" style="margin-top:14px">${button('Open Wallet', 'client-side:wallet', 'btn btn-gold btn-sm')}</div></div></div></div>`;
}

function clCard(m) {
  const tc = m.tierColor || '#d4af37';
  return `<div class="mcard-scene"><div class="mcard" data-action="cl-flip" title="Tap to flip">
    <div class="mcard-face mcard-front" style="--tc:${esc(tc)}">
      <div class="mcard-top"><span class="mcard-brand">The Gent’s</span><span class="mcard-tier">${esc(m.tierName || 'MEMBER')}</span></div>
      <div class="mcard-mid"><div class="mcard-chip">▣</div><div class="mcard-name">${esc(m.name || 'Member')}</div><div class="mcard-pseudo">“${esc(m.pseudo || '—')}”</div></div>
      <div class="mcard-bottom"><span class="mcard-no">${esc(m.memberNo || '')}</span><span class="mcard-tag">MEMBER</span></div>
    </div>
    <div class="mcard-face mcard-back" style="--tc:${esc(tc)}">
      <div class="mcard-back-top"><span class="mcard-brand">The Gent’s</span><span class="mcard-tier">${esc(m.tierName || '')}</span></div>
      <div class="mcard-details">
        <div><span>Profession</span><b>${esc(m.profession || '—')}</b></div>
        <div><span>Branch</span><b>${esc(branch(m.branch).name)}</b></div>
        <div><span>Date joined</span><b>${esc(m.joined || '—')}</b></div>
        <div><span>Status</span><b>${m.status === 'active' ? 'Active' : 'Suspended'}</b></div>
        <div><span>Member No</span><b>${esc(m.memberNo || '')}</b></div>
      </div>
      <div class="mcard-perks">${esc(m.perks || '')}</div>
      <div class="mcard-barcode"></div>
    </div>
  </div></div>`;
}

async function clApi(action, payload) {
  const r = await fetch('api/member.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...(payload || {}) }), credentials: 'same-origin' });
  return r.json().catch(() => null);
}

function clWallet() {
  clKickMem();
  const top = `<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>Wallet & Gift Cards</h1><p class="muted">Top up your balance and send gift cards to friends & family.</p></div></div>`;
  if (!clMemLoaded) return top + '<div class="panel"><p class="muted">Loading your wallet…</p></div>';
  if (!clMem || !clMem.member) return top + `<div class="panel" style="max-width:560px"><h3>Wallet needs a membership</h3><p class="muted">Enrol as a member first to use the wallet and issue gift cards.</p><div style="margin-top:16px">${button('Go to Membership', 'client-side:membership', 'btn btn-gold')}</div></div>`;
  const w = (clMem.wallet || {}).balance || 0;
  const issued = (clMem.giftCards && clMem.giftCards.issued) || [];
  const received = (clMem.giftCards && clMem.giftCards.received) || [];
  const txns = clMem.transactions || [];
  const gcRow = g => { const cons = [g.serviceId ? 'Only: ' + esc(service(g.serviceId).name) : '', g.expiresAt ? 'Expires ' + esc(g.expiresAt) : ''].filter(Boolean).join(' · '); return `<div class="card" style="padding:16px;margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><div class="eyebrow" style="font-size:10px">GIFT CARD · ${esc(g.code)}</div><div style="font-weight:700;margin:4px 0">${esc(g.toName || g.toEmail || 'Recipient')}</div><small class="muted">${g.maxUses ? g.maxUses + ' use' + (g.maxUses === 1 ? '' : 's') + ' max' : 'Until balance runs out'}${cons ? ' · ' + cons : ''} · issued ${esc((g.created || '').slice(0, 10))}</small></div><div style="text-align:right"><div style="font-size:18px;font-weight:700;color:var(--gold)">$${Number(g.remaining).toFixed(2)}</div><div class="small muted">of $${Number(g.amount).toFixed(2)}</div></div></div></div>`; };
  return top + `<div class="dash-grid">
  <div class="panel"><div class="panel-head"><h3>Balance</h3></div><div style="font-size:34px;font-weight:700;color:var(--gold)">$${Number(w).toFixed(2)}</div><p class="muted small">Pre-load to pay for services at any branch.</p>
  <form id="cl-topup-form" style="margin-top:14px"><div class="form-group"><label class="form-label">Top-up amount ($)</label><input class="field" type="number" step="0.01" min="1" max="10000" required name="amount" placeholder="e.g. 50"></div><button class="btn btn-gold">Request Top-up</button><p class="muted small" style="margin-top:8px">The grooming center confirms top-ups — balance updates once approved.</p></form></div>
  <div class="panel"><div class="panel-head"><h3>Issue a Gift Card</h3></div><form id="cl-gc-form">
  <div class="form-group"><label class="form-label">Amount ($)</label><input class="field" type="number" step="0.01" min="1" max="10000" required name="amount" placeholder="e.g. 30"></div>
  <div class="form-group"><label class="form-label">Recipient name</label><input class="field" required name="toName" placeholder="e.g. T. Moyo"></div>
  <div class="form-group"><label class="form-label">Recipient email (optional — lets them see it)</label><input class="field" type="email" name="toEmail" placeholder="them@example.com"></div>
  <div class="form-group"><label class="form-label">Use limit</label><select class="field" name="maxUses"><option value="1">Once</option><option value="2">Twice</option><option value="3">Three times</option><option value="5">Five times</option><option value="0">Until balance runs out</option></select></div>
  <div class="form-group"><label class="form-label">Restrict to service (optional)</label><select class="field" name="serviceId"><option value="">Any service</option>${db.services.map(s => `<option value="${esc(s.id)}">${esc(s.name)} — ${money(s.price)}</option>`).join('')}</select></div>
  <div class="form-group"><label class="form-label">Expires on (optional)</label><input class="field" type="date" name="expiresAt" min="${new Date().toISOString().slice(0, 10)}"></div>
  <button class="btn btn-gold">Issue Gift Card</button><p class="muted small" style="margin-top:8px">Deducted from your balance instantly. The recipient redeems services up to the remaining value — you can restrict it to one service or set an expiry.</p></form></div></div>
  <div class="dash-grid" style="margin-top:18px"><div class="panel"><div class="panel-head"><h3>Gift Cards I've Sent (${issued.length})</h3></div>${issued.map(gcRow).join('') || '<p class="muted">None yet — issue one above.</p>'}</div>
  <div class="panel"><div class="panel-head"><h3>Gift Cards for Me (${received.length})</h3></div>${received.map(gcRow).join('') || '<p class="muted">No gift cards addressed to you.</p>'}</div></div>
  <div class="panel" style="margin-top:18px"><div class="panel-head"><h3>Wallet History</h3></div>${txns.map(t => { const kind = t.kind === 'giftcard' ? 'Gift card' : t.kind === 'adjust' ? 'Adjustment' : 'Top-up'; const amt = Number(t.amount || 0); return `<div class="data-line"><span class="muted">${esc((t.created || '').slice(0, 10))} · ${kind} ${amt < 0 ? '−' : '+'}$${Math.abs(amt).toFixed(2)}${t.ref ? ' · ' + esc(t.ref) : ''}${t.balanceAfter != null ? ' → $' + Number(t.balanceAfter).toFixed(2) : ''}</span><b>${badge(t.status === 'approved' || t.status === 'completed' ? 'Confirmed' : t.status === 'pending' ? 'Pending' : 'Cancelled')}</b></div>`; }).join('') || '<p class="muted">No wallet activity yet.</p>'}</div>`;
}

// ---------- Events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c === 'cl-flip') { const card = el.closest('.mcard'); if (card) card.classList.toggle('flipped'); e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (c === 'cl-enrol') {
    e.preventDefault(); e.stopImmediatePropagation();
    clApi('enrol').then(j => { if (j && j.ok) { clMemLoaded = false; clKickMem(true); toast('Welcome to The Gent’s membership!'); } else toast('Could not enrol right now.'); }); return;
  }
  if (c === 'cl-auth-mode') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = v; return clAuthModal(); }
  if (c === 'cl-register') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = 'register'; return clAuthModal(); }
  if (c === 'cl-logout') {
    e.preventDefault(); e.stopImmediatePropagation();
    try { sessionStorage.removeItem('gents_auth'); sessionStorage.removeItem('gents_client'); sessionStorage.removeItem('gents_staff'); fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"logout"}', credentials: 'same-origin' }).catch(() => {}); } catch (x) {}
    location.href = 'login'; return;
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
  if (form.id === 'cl-topup-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const amount = Number(v.amount);
    // Try Paynow first — falls back to a manual top-up request if not configured
    try {
      const pr = await fetch('api/paya.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'init', amount }), credentials: 'same-origin' });
      const pj = await pr.json();
      if (pj && pj.ok && pj.redirect) { location.href = pj.redirect; return; }
      if (!(pj && pj.error === 'payments_not_configured')) { toast((pj && pj.error) || 'Payment failed — try again.'); return; }
    } catch (x) { /* gateway unreachable → manual request */ }
    clApi('topup', { amount }).then(j => {
      if (j && j.ok) { toast(j.message || 'Top-up requested.'); clMemLoaded = false; clKickMem(true); }
      else toast((j && j.error) || 'Top-up failed.');
    }).catch(() => toast('Could not reach the server.')); return;
  }
  if (form.id === 'cl-gc-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    clApi('issue-giftcard', { amount: Number(v.amount), toName: v.toName, toEmail: v.toEmail, maxUses: Number(v.maxUses), serviceId: v.serviceId || '', expiresAt: v.expiresAt || '' }).then(j => {
      if (j && j.ok) { toast('Gift card ' + j.giftCard.code + ' issued — $' + Number(j.balance).toFixed(2) + ' left.'); clMemLoaded = false; clKickMem(true); }
      else toast((j && j.error) || 'Could not issue gift card.');
    }).catch(() => toast('Could not reach the server.')); return;
  }
  if (form.id !== 'cl-profile-form') return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(form));
  db.clientProfile = { name: v.name, phone: v.phone, email: v.email, favBranch: v.favBranch || '', favBarber: v.favBarber || '' };
  save(); toast('Profile saved.'); render();
});
