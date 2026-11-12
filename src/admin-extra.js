// ===== The Gent's — Admin portal =====
// Injected inside app.js IIFE by _build.js. Overrides adminBody/dashboardFrame
// (later function declarations win) and adds adm-* actions/listeners.

let admQ = '', admStatusF = 'all', admCalOff = 0, admCQ = '', admRange = 30, reqTab = 'pending', admPayF = 'all';

const admF = () => {
  let l = branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter);
  if (admStatusF !== 'all') l = l.filter(b => b.status === admStatusF);
  if (admQ) l = l.filter(b => (b.name + ' ' + b.phone + ' ' + (b.email || '')).toLowerCase().includes(admQ));
  return l;
};

function adminBody() {
  const titles = { overview: 'Dashboard', bookings: 'Bookings', requests: 'Booking Requests', calendar: 'Calendar', branches: 'Branches', barbers: 'Barbers', services: 'Services', content: 'Content & Media', clients: 'Clients', membership: 'Membership & Wallet', reports: 'Reports', users: 'User Management', staff: 'Account Access', erp: 'Accounting & ERP', settings: 'Settings' };
  const f = branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter);
  const top = `<div class="dash-top"><div><div class="eyebrow">THE GENT’S · MANAGEMENT</div><h1>${titles[dashboardTab] || 'Dashboard'}</h1><p class="muted">All changes are saved locally.</p></div><select id="admin-branch" class="field" style="width:205px"><option value="all">All Branches</option>${db.branches.map(b => `<option value="${b.id}" ${branchFilter === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>`;
  if (!admCan(dashboardTab)) {
    const alt = Object.keys(PERM_MAP).find(k => admCan(k));
    if (alt) dashboardTab = alt;
  }
  if (!admCan(dashboardTab)) return top + `<div class="panel"><p class="muted">You don’t have permission to access this section. Contact your administrator.</p></div>`;
  if (dashboardTab === 'overview') return admOverview(f, top);
  if (dashboardTab === 'bookings') return admBookings(top);
  if (dashboardTab === 'requests') return admRequests(top);
  if (dashboardTab === 'calendar') return admCalendar(f, top);
  if (dashboardTab === 'branches') return admBranches(top);
  if (dashboardTab === 'barbers') return admBarbers(top);
  if (dashboardTab === 'services') return admServices(top);
  if (dashboardTab === 'content') return admContent(top);
  if (dashboardTab === 'membership') return admMembership(top);
  if (dashboardTab === 'clients') return admClients(top);
  if (dashboardTab === 'reports') return admReports(f, top);
  if (dashboardTab === 'users') return admUsers(top);
  if (dashboardTab === 'staff') return admStaff(top);
  if (dashboardTab === 'erp') return admErp(top);
  return admSettings(top);
}

function dashboardFrame(role, content) {
  const admin = role === 'admin';
  const items = admin
    ? [["overview", "Dashboard", "⌂"], ["requests", "Requests", "✉"], ["bookings", "Bookings", "▢"], ["calendar", "Calendar", "▦"], ["branches", "Branches", "⌖"], ["barbers", "Barbers", "✂"], ["services", "Services", "✧"], ["content", "Content & Media", "◈"], ["clients", "Clients", "♧"], ["membership", "Membership", "❖"], ["reports", "Reports", "▥"], ["users", "User Management", "♟"], ["staff", "Account Access", "⚑"], ["erp", "Accounting & ERP", "¤"], ["settings", "Settings", "⚙"]]
    : [["overview", "Overview", "⌂"], ["bookings", "My Bookings", "▢"], ["membership", "Membership", "❖"], ["wallet", "Wallet", "▣"], ["rewards", "Rewards", "★"], ["notifications", "Alerts", "◔"], ["profile", "Profile", "♙"]];
  const selected = admin ? dashboardTab : (typeof clientView !== 'undefined' ? clientView : 'overview');
  const navItems = admin ? items.filter(([key]) => admCan(key)) : items;
  const nav = navItems.map(([key, title, ico]) => `<button class="${selected === key ? 'active' : ''}" data-action="${admin ? 'admin-tab' : 'client-side'}:${key}">${ico} &nbsp; ${title}</button>`).join('');
  const out = `<button data-action="adm-logout">⇥ &nbsp; Sign Out</button>`;
  return `<div class="dashboard"><aside class="side"><a class="brand" data-page="home"><div class="brand-icon">⚒</div><div><div class="brand-title">The Gent’s</div><div class="brand-sub">BARBER & GENTS SALON</div></div></a><div class="side-nav">${nav}${out}<button data-page="home">↗ &nbsp; Visit Website</button></div></aside><div><div class="dash-mobile">${nav}${out}</div><main class="dash-main">${content}</main></div></div>`;
}

// ---------- Overview ----------
function admOverview(f, top) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = f.filter(b => b.date === todayISO);
  const pending = f.filter(b => b.status === 'Pending');
  const rev = f.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((s, b) => s + Number(service(b.service).price || 0), 0);
  const stats = [['▢', f.length, 'Total Bookings'], ['◷', today.length, 'Today'], ['✓', pending.length, 'Pending'], ['$', money(rev), 'Revenue']];
  let h = top + `<div class="stat-grid">${stats.map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div>`;
  h += `<div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Pending Approvals</h3>${admCan('requests') || admCan('bookings') ? button('View all', 'admin-tab:requests', 'btn btn-sm') : ''}</div>${pending.slice(0, 6).map(b => `<div class="appointment"><div><strong>${esc(b.name)}</strong><small>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} ${esc(b.time)}</small></div><div class="row-actions">${hasPerm('bookings.approve') ? `<button class="btn btn-sm" data-action="approve:${b.id}">✓</button>` : ''}${hasPerm('bookings.decline') ? `<button class="btn btn-sm" data-action="decline:${b.id}">×</button>` : ''}</div></div>`).join('') || '<p class="muted">Nothing pending.</p>'}</div>`;
  h += `<div class="panel"><div class="panel-head"><h3>Today’s Schedule</h3></div>${today.slice().sort((a, b) => a.time.localeCompare(b.time)).map(b => `<div class="appointment"><div><strong>${esc(b.time)} · ${esc(b.name)}</strong><small>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)}</small></div>${badge(b.status)}</div>`).join('') || '<p class="muted">No appointments today.</p>'}</div></div>`;
  h += `<div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Branch Performance</h3></div>${db.branches.map(x => { const n = db.bookings.filter(b => b.branch === x.id).length; return `<div class="progress-row"><span>${esc(x.name)}</span><div class="track"><div class="fill" style="width:${Math.max(3, n / Math.max(1, db.bookings.length) * 100)}%"></div></div><b>${n}</b></div>`; }).join('')}</div>`;
  h += `<div class="panel"><div class="panel-head"><h3>Recent Activity</h3></div>${(db.notifications || []).slice(0, 6).map(n => `<p class="small" style="margin:8px 0;color:var(--muted)">• ${esc(n)}</p>`).join('') || '<p class="muted">No activity yet.</p>'}</div></div>`;
  h += `<div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="grid grid-3">${button('+ Walk-in', 'walkin', 'btn')}${button('+ Branch', 'adm-add-branch', 'btn')}${button('+ Barber', 'adm-add-barber', 'btn')}${button('+ Service', 'adm-add-service', 'btn')}${button('All Bookings', 'admin-tab:bookings', 'btn')}${button('Calendar', 'admin-tab:calendar', 'btn')}</div></div>`;
  return h;
}

// ---------- Bookings ----------
function admBookings(top) {
  const list = admF().slice().sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  const statuses = ['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Declined'];
  return top + `<div class="panel"><div class="panel-head"><h3>All Bookings (${list.length})</h3><div class="auth-actions">${hasPerm('bookings.create') ? button('+ Walk-in', 'walkin', 'btn btn-gold btn-sm') : ''}${ioButtons('bookings', true)}${myPerms().includes('*') ? button('Reset Data', 'reset', 'btn btn-sm') : ''}</div></div>
  <div class="adm-filters"><input id="adm-q" class="field" style="max-width:260px" placeholder="Search name, phone, email…" value="${esc(admQ)}"><div class="segmented">${statuses.map(s => `<button class="pill ${admStatusF === s ? 'active' : ''}" data-action="adm-status:${s}">${s === 'all' ? 'All' : s}</button>`).join('')}</div></div>${admTable(list)}</div>`;
}

function admTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>Date & Time</th><th>Client</th><th>Contact</th><th>Service</th><th>Barber</th><th>Branch</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(b => `<tr><td>${fmt(b.date)}<br><span class="muted">${esc(b.time)}</span></td><td>${esc(b.name)}</td><td class="small muted">${esc(b.phone)}<br>${esc(b.email || '')}</td><td>${esc(service(b.service).name)}</td><td>${esc(barber(b.barber).name)}</td><td>${esc(branch(b.branch).name)}</td><td class="small">${esc(b.source || '—')}</td><td>${badge(b.status)}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="adm-view-booking:${b.id}">View</button>${b.status === 'Pending' && hasPerm('bookings.approve') ? `<button class="btn btn-sm" data-action="approve:${b.id}">✓</button>` : ''}${b.status === 'Pending' && hasPerm('bookings.decline') ? `<button class="btn btn-sm" data-action="decline:${b.id}">×</button>` : ''}${b.status === 'Confirmed' && hasPerm('bookings.complete') ? `<button class="btn btn-sm" data-action="adm-complete:${b.id}">Done</button>` : ''}${hasPerm('bookings.delete') ? `<button class="btn btn-sm" data-action="adm-del-booking:${b.id}">Del</button>` : ''}</div></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No bookings match.</div>'}</div>`;
}

function admViewBooking(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  const rows = [['Reference', b.id], ['Client', b.name], ['Phone', b.phone], ['Email', b.email || '—'], ['Branch', branch(b.branch).name], ['Service', service(b.service).name + ' · ' + service(b.service).duration + ' min'], ['Barber', barber(b.barber).name], ['Date', fmt(b.date)], ['Time', b.time], ['Status', b.status], ['Decline reason', b.declineReason || '—'], ['Payment', (b.payment || 'Unpaid') + (b.paidAt ? ' · ' + b.paidAt : '')], ['Source', b.source || '—'], ['Notes', b.notes || '—']];
  modal('Appointment ' + esc(b.id), rows.map(([k, v]) => `<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="auth-actions" style="margin-top:20px;flex-wrap:wrap">${b.status === 'Pending' && hasPerm('bookings.approve') ? `<button class="btn btn-gold" data-action="approve:${b.id}">Approve</button>` : ''}${(b.status === 'Pending' || b.status === 'Confirmed') && hasPerm('bookings.decline') ? `<button class="btn" data-action="decline:${b.id}">Decline</button>` : ''}${b.status === 'Confirmed' && hasPerm('bookings.complete') ? `<button class="btn" data-action="adm-complete:${b.id}">Mark Completed</button>` : ''}${hasPerm('bookings.cancel') ? `<button class="btn" data-action="adm-cancel-booking:${b.id}">Cancel Booking</button>` : ''}${hasPerm('bookings.delete') ? `<button class="btn" data-action="adm-del-booking:${b.id}">Delete</button>` : ''}</div>`);
}

// ---------- Booking Requests ----------
const payBadge = p => { const v = p || 'Unpaid'; return `<span class="badge status ${v === 'Unpaid' ? 'cancelled' : 'confirmed'}">${esc(v)}</span>`; };
function admRequests(top) {
  const map = { pending: 'Pending', approved: 'Confirmed', completed: 'Completed', declined: 'Declined', cancelled: 'Cancelled' };
  const base = admF();
  const counts = {}; Object.values(map).forEach(s => counts[s] = base.filter(b => b.status === s).length);
  let list = base;
  if (reqTab !== 'all') list = list.filter(b => b.status === (map[reqTab] || reqTab));
  if (admPayF !== 'all') list = list.filter(b => (b.payment || 'Unpaid') === admPayF);
  list = list.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const tabs = [['pending', 'Pending'], ['approved', 'Approved'], ['completed', 'Completed'], ['declined', 'Declined'], ['cancelled', 'Cancelled'], ['all', 'All']];
  const pays = ['Unpaid', 'Paid', 'Wallet', 'Gift Card', 'Comp'];
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return top + `<div class="panel"><div class="panel-head"><h3>Booking Requests</h3><div class="auth-actions">${hasPerm('bookings.create') ? button('+ Walk-in', 'walkin', 'btn btn-gold btn-sm') : ''}</div></div>
  <div class="adm-filters"><div class="segmented" style="flex-wrap:wrap">${tabs.map(([k, t]) => `<button class="pill ${reqTab === k ? 'active' : ''}" data-action="req-tab:${k}">${t} (${k === 'all' ? total : counts[map[k]] || 0})</button>`).join('')}</div></div>
  <div class="adm-filters"><div class="segmented">${['all', ...pays].map(p => `<button class="pill ${admPayF === p ? 'active' : ''}" data-action="req-pay:${p}">${p === 'all' ? 'All payments' : p}</button>`).join('')}</div><input id="adm-q" class="field" style="max-width:240px" placeholder="Search name, phone, email…" value="${esc(admQ)}"></div>
  ${admReqTable(list)}</div>`;
}
function admReqTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>Date & Time</th><th>Client</th><th>Contact</th><th>Service</th><th>Barber</th><th>Branch</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead><tbody>${list.map(b => `<tr><td>${fmt(b.date)}<br><span class="muted">${esc(b.time)}</span></td><td>${esc(b.name)}</td><td class="small muted">${esc(b.phone)}<br>${esc(b.email || '')}</td><td>${esc(service(b.service).name)}</td><td>${esc(barber(b.barber).name)}</td><td>${esc(branch(b.branch).name)}</td><td>${badge(b.status)}${b.declineReason ? `<br><span class="muted small" title="Decline reason">↳ ${esc(b.declineReason)}</span>` : ''}</td><td>${payBadge(b.payment)}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="adm-view-booking:${b.id}">View</button>${b.status === 'Pending' && hasPerm('bookings.approve') ? `<button class="btn btn-sm" data-action="approve:${b.id}">✓</button>` : ''}${(b.status === 'Pending' || b.status === 'Confirmed') && hasPerm('bookings.decline') ? `<button class="btn btn-sm" data-action="decline:${b.id}">Decline</button>` : ''}${b.status === 'Confirmed' && hasPerm('bookings.complete') ? `<button class="btn btn-sm" data-action="adm-complete:${b.id}">Done</button>` : ''}${(b.status === 'Confirmed' || b.status === 'Completed') && hasPerm('bookings.pay') ? button('Pay', 'adm-pay:' + b.id, 'btn btn-sm') : ''}</div></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No requests in this view.</div>'}</div>`;
}
function admDeclineModal(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  modal('Decline ' + esc(b.id), `<p class="muted">${esc(b.name)} · ${esc(service(b.service).name)} · ${fmt(b.date)} ${esc(b.time)}</p>
  <form id="adm-decline-form"><input type="hidden" name="id" value="${esc(id)}">
  <div class="form-group"><label class="form-label">Reason (kept on record)</label><textarea class="field" name="reason" rows="3" placeholder="e.g. Slot no longer available, outside service area…"></textarea></div>
  <button class="btn" type="submit">Decline Request</button></form>`);
}
function admPayModal(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  modal('Record payment — ' + esc(b.id), `<p class="muted">${esc(b.name)} · ${esc(service(b.service).name)} · ${money(service(b.service).price)} · ${fmt(b.date)} ${esc(b.time)}</p>
  <form id="adm-pay-form"><input type="hidden" name="id" value="${esc(id)}">
  <div class="form-group"><label class="form-label">Payment method</label><select class="field" name="method"><option value="Paid">Paid (cash / card)</option><option value="Wallet">Wallet</option><option value="Gift Card">Gift Card</option><option value="Comp">Complimentary</option></select></div>
  <button class="btn btn-gold" type="submit">Record Payment</button></form>`);
}

// ---------- Calendar ----------
function admCalendar(f, top) {
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + admCalOff);
  const y = base.getFullYear(), m = base.getMonth();
  const startDow = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const todayISO = new Date().toISOString().slice(0, 10);
  const byDate = {}; f.forEach(b => { (byDate[b.date] = byDate[b.date] || []).push(b); });
  let cells = '';
  for (let i = 0; i < startDow; i++) cells += '<div class="cal-day muted"></div>';
  for (let d = 1; d <= dim; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const list = byDate[iso] || [];
    cells += `<div class="cal-day ${iso === todayISO ? 'today' : ''}" data-action="adm-day:${iso}"><span class="n">${d}</span>${list.length ? `<span class="cal-count">${list.length}</span>` : ''}<div class="cal-chips">${list.slice(0, 3).map(b => `<span class="cal-chip">${esc(b.time)} ${esc(b.name.split(' ')[0])}</span>`).join('')}</div></div>`;
  }
  const mn = base.toLocaleDateString('en-ZW', { month: 'long', year: 'numeric' });
  return top + `<div class="panel"><div class="cal-head"><button class="btn btn-sm" data-action="adm-cal:prev">← Prev</button><h3 style="margin:0">${mn}</h3><div><button class="btn btn-sm" data-action="adm-cal:today">Today</button> <button class="btn btn-sm" data-action="adm-cal:next">Next →</button> ${ioButtons('calendar', false)}</div></div><div class="cal-dows">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="cal-dow">${d}</div>`).join('')}</div><div class="cal-grid">${cells}</div></div>`;
}

function admDay(iso) {
  const list = (branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter)).filter(b => b.date === iso).sort((a, b) => a.time.localeCompare(b.time));
  modal(fmt(iso), list.map(b => `<div class="data-line"><span class="muted">${esc(b.time)} · ${esc(b.name)} · ${esc(b.phone || '')}</span><b>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)} · ${esc(branch(b.branch).name)} · ${badge(b.status)}</b></div>`).join('') || '<p class="muted">No appointments.</p>');
}

// ---------- Branches ----------
function admBranches(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Branch Directory</h3><div class="auth-actions">${ioButtons('branches', true)}${hasPerm('branches.manage') ? button('+ Add Branch', 'adm-add-branch', 'btn btn-gold btn-sm') : ''}</div></div><div class="grid grid-3">${db.branches.map(x => { const n = db.bookings.filter(b => b.branch === x.id).length; return `<div class="card"><img class="branch-photo" src="${esc(x.photo)}"><div class="card-pad"><h3>${esc(x.name)}</h3><p class="muted small">${esc(x.place)}<br>${esc(x.hours)}<br>${n} booking${n === 1 ? '' : 's'}</p>${hasPerm('branches.manage') ? `<div class="row-actions" style="margin-top:10px"><button class="btn btn-sm" data-action="adm-edit-branch:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-branch:${x.id}">Delete</button></div>` : ''}</div></div>`; }).join('')}</div></div>`;
}

function admBranchForm(id) {
  const x = id ? db.branches.find(b => b.id === id) : { name: '', place: '', hours: 'Mon–Sat · 09:00–18:00', photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80' };
  if (!x) return;
  modal(id ? 'Edit Branch' : 'Add Branch', `<form id="adm-branch-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-group"><label class="form-label">Branch name</label><input class="field" required name="name" value="${esc(x.name)}"></div><div class="form-group"><label class="form-label">Address / area</label><input class="field" required name="place" value="${esc(x.place || '')}"></div><div class="form-group"><label class="form-label">Opening hours</label><input class="field" name="hours" value="${esc(x.hours || '')}"></div><div class="form-group"><label class="form-label">Photo URL</label><input class="field" name="photo" value="${esc(x.photo || '')}"></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Branch'}</button></form>`);
}

// ---------- Barbers ----------
function admBarbers(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Team (${db.barbers.length})</h3><div class="auth-actions">${ioButtons('barbers', true)}${hasPerm('staff_data.manage') ? button('+ Add Barber', 'adm-add-barber', 'btn btn-gold btn-sm') : ''}</div></div><div class="grid grid-4">${db.barbers.map(x => `<div class="card"><img class="barber-photo" src="${esc(x.photo)}" alt="${esc(x.name)}" loading="lazy"><div class="barber-info"><h3>${esc(x.name)}</h3><p>${esc(x.role)} · ${esc(branch(x.branch).name)}</p><p class="small muted">${x.services.map(s => esc(service(s).name)).join(' · ')}</p>${x.bio ? `<p class="small muted">${esc(x.bio)}</p>` : ''}${hasPerm('staff_data.manage') ? `<div class="row-actions" style="margin-top:8px"><button class="btn btn-sm" data-action="adm-edit-barber:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-barber:${x.id}">Delete</button></div>` : ''}</div></div>`).join('')}</div></div>`;
}

function admBarberForm(id) {
  const x = id ? barber(id) : { name: '', role: 'Barber', branch: db.branches[0] ? db.branches[0].id : '', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80', services: db.services.map(s => s.id) };
  if (id && !db.barbers.find(b => b.id === id)) return;
  modal(id ? 'Edit Barber' : 'Add Barber', `<form id="adm-barber-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-group"><label class="form-label">Name</label><input class="field" required name="name" value="${esc(id ? x.name : '')}"></div><div class="form-group"><label class="form-label">Role</label><input class="field" name="role" value="${esc(id ? x.role : 'Barber')}"></div><div class="form-group"><label class="form-label">Branch</label><select class="field" name="branch">${db.branches.map(b => `<option value="${b.id}" ${x.branch === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Photo URL</label><input class="field" name="photo" value="${esc(x.photo || '')}"></div><div class="form-group"><label class="form-label">Bio (shown on profile cards)</label><textarea class="field" name="bio" rows="2" placeholder="e.g. 8 years of precision cutting">${esc(x.bio || '')}</textarea></div><div class="form-group"><label class="form-label">Services</label><div style="display:grid;gap:6px">${db.services.map(s => `<label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="services" value="${s.id}" ${(x.services || []).includes(s.id) ? 'checked' : ''}> ${esc(s.name)}</label>`).join('')}</div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Barber'}</button></form>`);
}

// ---------- Services ----------
function admServices(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Services & Pricing</h3><div class="auth-actions">${ioButtons('services', true)}${hasPerm('staff_data.manage') ? button('+ Add Service', 'adm-add-service', 'btn btn-gold btn-sm') : ''}</div></div>${db.services.map(x => `<div class="service-row">${x.image ? `<img class="service-thumb" src="${esc(x.image)}" alt="">` : `<span class="service-icon">${x.icon}</span>`}<div class="service-text"><strong>${esc(x.name)}</strong><small>${esc(x.desc || '')} · ${x.duration} min · ${x.branches.map(b => esc(branch(b).name)).join(', ') || 'all branches'}</small></div><b>${money(x.price)}</b>${hasPerm('staff_data.manage') ? `<div class="row-actions"><button class="btn btn-sm" data-action="adm-edit-service:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-service:${x.id}">Delete</button></div>` : ''}</div>`).join('')}</div>`;
}

function admServiceForm(id) {
  const x = id ? service(id) : { name: '', desc: '', price: 0, duration: 30, icon: '✂', branches: db.branches.map(b => b.id) };
  if (id && !db.services.find(s => s.id === id)) return;
  modal(id ? 'Edit Service' : 'Add Service', `<form id="adm-service-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-grid"><div class="form-group"><label class="form-label">Service name</label><input class="field" required name="name" value="${esc(id ? x.name : '')}"></div><div class="form-group"><label class="form-label">Icon</label><input class="field" name="icon" value="${esc(id ? x.icon : '✂')}"></div></div><div class="form-group"><label class="form-label">Description</label><input class="field" name="desc" value="${esc(id ? x.desc : '')}"></div><div class="form-group"><label class="form-label">Card image URL (optional)</label><input class="field" name="image" value="${esc(id ? x.image || '' : '')}" placeholder="https://… or /uploads/…"></div><div class="form-grid"><div class="form-group"><label class="form-label">Price (USD)</label><input class="field" type="number" min="0" step="0.01" required name="price" value="${id ? x.price : ''}"></div><div class="form-group"><label class="form-label">Duration (minutes)</label><input class="field" type="number" min="5" required name="duration" value="${id ? x.duration : 30}"></div></div><div class="form-group"><label class="form-label">Available at branches</label><div style="display:grid;gap:6px">${db.branches.map(b => `<label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="branches" value="${b.id}" ${(x.branches || []).includes(b.id) ? 'checked' : ''}> ${esc(b.name)}</label>`).join('')}</div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Service'}</button></form>`);
}

// ---------- Clients ----------
function admClients(top) {
  const map = {};
  db.bookings.forEach(b => { const k = b.phone || b.email || b.name; (map[k] = map[k] || { name: b.name, phone: b.phone, email: b.email, items: [] }).items.push(b); });
  let list = Object.values(map).map(c => ({ name: c.name, phone: c.phone, email: c.email, count: c.items.length, last: c.items.map(i => i.date).sort().pop(), spent: c.items.filter(i => i.status !== 'Cancelled' && i.status !== 'Declined').reduce((s, i) => s + Number(service(i.service).price || 0), 0) }));
  if (admCQ) list = list.filter(c => (c.name + ' ' + c.phone + ' ' + (c.email || '')).toLowerCase().includes(admCQ));
  list.sort((a, b) => (b.last || '').localeCompare(a.last || ''));
  return top + `<div class="panel"><div class="panel-head"><h3>Customers (${list.length})</h3><div class="auth-actions">${ioButtons('customers', false)}</div></div><div class="adm-filters"><input id="adm-cq" class="field" style="max-width:280px" placeholder="Search clients…" value="${esc(admCQ)}"></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Bookings</th><th>Last Visit</th><th>Total Spend</th><th></th></tr></thead><tbody>${list.map(c => `<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${esc(c.email || '—')}</td><td>${c.count}</td><td>${fmt(c.last)}</td><td>${money(c.spent)}</td><td><button class="btn btn-sm" data-action="adm-client:${encodeURIComponent(c.phone || c.email || c.name)}">History</button></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No clients yet.</div>'}</div></div>`;
}

function admClient(key) {
  const k = decodeURIComponent(key);
  const items = db.bookings.filter(b => (b.phone || b.email || b.name) === k).sort((a, b) => b.date.localeCompare(a.date));
  const c = items[0] || {};
  modal('Client · ' + esc(c.name || k), `<div class="kv" style="margin-bottom:16px"><span>Phone</span><b>${esc(c.phone || '—')}</b><span>Email</span><b>${esc(c.email || '—')}</b><span>Total bookings</span><b>${items.length}</b></div>` + items.map(b => `<div class="data-line"><span class="muted">${fmt(b.date)} ${esc(b.time)} · ${esc(service(b.service).name)}</span><b>${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${badge(b.status)}</b></div>`).join(''));
}

// ---------- Reports ----------
function admReports(f, top) {
  const days = admRange === 'all' ? null : Number(admRange);
  const cutoff = days ? new Date(Date.now() - days * 864e5).toISOString().slice(0, 10) : null;
  const r = days ? f.filter(b => b.date >= cutoff) : f;
  const rev = r.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((s, b) => s + Number(service(b.service).price || 0), 0);
  const done = r.filter(b => b.status === 'Completed').length;
  let buckets = [];
  if (days && days <= 31) {
    for (let i = days - 1; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5); const iso = d.toISOString().slice(0, 10); buckets.push({ label: d.toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' }), n: r.filter(b => b.date === iso).length }); }
  } else {
    const weeks = Math.ceil((days || 365) / 7);
    for (let i = weeks - 1; i >= 0; i--) { const end = new Date(Date.now() - i * 7 * 864e5); const start = new Date(end - 6 * 864e5); const n = r.filter(b => b.date >= start.toISOString().slice(0, 10) && b.date <= end.toISOString().slice(0, 10)).length; buckets.push({ label: start.toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' }), n }); }
  }
  const max = Math.max(1, ...buckets.map(x => x.n));
  const svc = {}; r.forEach(b => { svc[b.service] = (svc[b.service] || 0) + 1; });
  const topSvc = Object.entries(svc).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const brd = {}; r.forEach(b => { brd[b.barber] = (brd[b.barber] || 0) + 1; });
  const topBr = Object.entries(brd).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const st = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Declined'].map(s => [s, r.filter(b => b.status === s).length]);
  const stat = (i, n, t) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`;
  return top + `<div class="adm-filters"><div class="segmented">${['7', '30', '90', 'all'].map(x => `<button class="pill ${String(admRange) === x ? 'active' : ''}" data-action="adm-range:${x}">${x === 'all' ? 'All time' : x + ' days'}</button>`).join('')}</div>${ioButtons('reports', false)}</div>
  <div class="stat-grid">${stat('▢', r.length, 'Bookings')}${stat('$', money(rev), 'Revenue')}${stat('✓', done, 'Completed')}${stat('◷', r.length ? money(rev / r.length) : '$0.00', 'Avg ticket')}</div>
  <div class="dash-grid"><div class="panel"><h3>Bookings over time</h3><div class="chart">${buckets.map(x => `<div class="bar" title="${x.n} booking${x.n === 1 ? '' : 's'}"><i style="height:${Math.max(4, Math.round(x.n / max * 140))}px"></i><span>${x.label}</span></div>`).join('')}</div></div>
  <div class="panel"><h3>Status breakdown</h3>${st.map(([s, n]) => `<div class="progress-row"><span>${s}</span><div class="track"><div class="fill" style="width:${r.length ? n / r.length * 100 : 0}%"></div></div><b>${n}</b></div>`).join('')}</div></div></div>
  <div class="dash-grid"><div class="panel"><h3>Top services</h3>${topSvc.map(([id, n]) => `<div class="progress-row"><span>${esc(service(id).name)}</span><div class="track"><div class="fill" style="width:${n / Math.max(1, r.length) * 100}%"></div></div><b>${n}</b></div>`).join('') || '<p class="muted">No data.</p>'}</div>
  <div class="panel"><h3>Top barbers</h3>${topBr.map(([id, n]) => `<div class="progress-row"><span>${esc(barber(id).name)}</span><div class="track"><div class="fill" style="width:${n / Math.max(1, r.length) * 100}%"></div></div><b>${n}</b></div>`).join('') || '<p class="muted">No data.</p>'}</div></div>`;
}

// ---------- Settings ----------
function admSettings(top) {
  const s = db.settings || {};
  return top + `<div class="panel" style="max-width:640px"><div class="panel-head"><h3>Business Profile</h3></div><form id="adm-settings-form"><div class="form-grid"><div class="form-group"><label class="form-label">Salon name</label><input class="field" name="name" value="${esc(s.name || 'The Gent’s')}"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" name="phone" value="${esc(s.phone || '+263 77 601 1938')}"></div><div class="form-group"><label class="form-label">WhatsApp number</label><input class="field" name="whatsapp" value="${esc(s.whatsapp || '+263 77 601 1938')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" name="email" value="${esc(s.email || 'admin@thegents.co.zw')}"></div><div class="form-group"><label class="form-label">Address</label><input class="field" name="address" value="${esc(s.address || 'Fife Avenue & Borrowdale, Harare')}"></div><div class="form-group"><label class="form-label">Logo URL (optional — replaces the ⚒ icon)</label><input class="field" name="logo" value="${esc(s.logo || '')}" placeholder="/uploads/logo.png or https://…"></div><div class="form-group"><label class="form-label">Facebook URL</label><input class="field" name="fb" value="${esc((s.social || {}).facebook || '')}" placeholder="https://facebook.com/…"></div><div class="form-group"><label class="form-label">Instagram URL</label><input class="field" name="ig" value="${esc((s.social || {}).instagram || '')}" placeholder="https://instagram.com/…"></div><div class="form-group"><label class="form-label">TikTok URL</label><input class="field" name="tt" value="${esc((s.social || {}).tiktok || '')}" placeholder="https://tiktok.com/@…"></div></div><button class="btn btn-gold">Save Settings</button></form>
  <h3 style="margin-top:30px">Data</h3><div class="auth-actions">${button('Export Data (JSON)', 'adm-export-json', 'btn')}${button('Reset All Data', 'reset', 'btn')}</div><p class="muted small" style="margin-top:16px">Business details appear on the Contact page. Export downloads a backup of all local data.</p></div>`;
}

// ---------- Export ----------
function admDownload(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
function admExportCSV() {
  const list = admF();
  const rows = [['Date', 'Time', 'Client', 'Phone', 'Email', 'Service', 'Barber', 'Branch', 'Status', 'Source'].join(',')]
    .concat(list.map(b => [b.date, b.time, b.name, b.phone, b.email || '', service(b.service).name, barber(b.barber).name, branch(b.branch).name, b.status, b.source || ''].map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')));
  admDownload('bookings.csv', rows.join('\n'), 'text/csv');
  toast('CSV exported.');
}
function admExportJSON() {
  admDownload('thegents-data.json', JSON.stringify(db, null, 2), 'application/json');
  toast('Data exported.');
}

// ---------- Events ----------
// Decline always asks for a reason — intercept before the prototype's instant handler
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action^="decline:"]');
  if (!el || page !== 'admin') return;
  e.preventDefault(); e.stopImmediatePropagation();
  admDeclineModal(el.dataset.action.split(':')[1]);
}, true);

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c === 'adm-logout') { try { sessionStorage.removeItem('gents_auth'); sessionStorage.removeItem('gents_staff'); fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"logout"}', credentials: 'same-origin' }).catch(() => {}); } catch (x) {} location.href = page === 'admin' ? 'admin' : 'login'; return; }
  if (c === 'adm-add-branch' || c === 'adm-edit-branch' || c === 'adm-del-branch') { if (!hasPerm('branches.manage')) return toast('No permission.'); }
  if (c === 'adm-add-barber' || c === 'adm-edit-barber' || c === 'adm-del-barber' || c === 'adm-add-service' || c === 'adm-edit-service' || c === 'adm-del-service') { if (!hasPerm('staff_data.manage')) return toast('No permission.'); }
  if (c === 'adm-complete' && !hasPerm('bookings.complete')) return toast('No permission.');
  if (c === 'adm-cancel-booking' && !hasPerm('bookings.cancel')) return toast('No permission.');
  if (c === 'adm-del-booking' && !hasPerm('bookings.delete')) return toast('No permission.');
  if (c === 'adm-pay' && !hasPerm('bookings.pay')) return toast('No permission.');
  if (c === 'adm-add-branch') return admBranchForm();
  if (c === 'adm-edit-branch') return admBranchForm(v);
  if (c === 'adm-add-barber') return admBarberForm();
  if (c === 'adm-edit-barber') return admBarberForm(v);
  if (c === 'adm-add-service') return admServiceForm();
  if (c === 'adm-edit-service') return admServiceForm(v);
  if (c === 'adm-view-booking') return admViewBooking(v);
  if (c === 'adm-client') return admClient(v);
  if (c === 'adm-day') return admDay(v);
  if (c === 'adm-cal') { admCalOff += v === 'next' ? 1 : v === 'prev' ? -1 : 0; if (v === 'today') admCalOff = 0; return render(); }
  if (c === 'adm-status') { admStatusF = v; return render(); }
  if (c === 'req-tab') { reqTab = v; return render(); }
  if (c === 'req-pay') { admPayF = v; return render(); }
  if (c === 'adm-pay') return admPayModal(v);
  if (c === 'adm-range') { admRange = v === 'all' ? 'all' : Number(v); return render(); }
  if (c === 'adm-complete') { const b = db.bookings.find(x => x.id === v); if (b) { b.status = 'Completed'; db.notifications.unshift('Booking ' + b.id + ' completed.'); save(); toast('Booking marked completed.'); render(); } return; }
  if (c === 'adm-cancel-booking') { const b = db.bookings.find(x => x.id === v); if (!b) return; if (!confirm('Cancel this booking?')) return; b.status = 'Cancelled'; save(); toast('Booking cancelled.'); closeModal(); render(); return; }
  if (c === 'adm-del-booking') { const b = db.bookings.find(x => x.id === v); if (!b) return; if (!confirm('Permanently delete booking ' + b.id + '?')) return; db.bookings = db.bookings.filter(x => x.id !== v); save(); toast('Booking deleted.'); closeModal(); render(); return; }
  if (c === 'adm-del-branch') { const x = db.branches.find(b => b.id === v); if (!x) return; if (db.bookings.some(b => b.branch === v)) return toast('Cannot delete: this branch has bookings.'); if (db.barbers.some(b => b.branch === v)) return toast('Cannot delete: this branch still has barbers.'); if (!confirm('Delete branch "' + x.name + '"?')) return; db.branches = db.branches.filter(b => b.id !== v); save(); toast('Branch deleted.'); render(); return; }
  if (c === 'adm-del-barber') { const x = db.barbers.find(b => b.id === v); if (!x) return; if (db.bookings.some(b => b.barber === v)) return toast('Cannot delete: this barber has bookings.'); if (!confirm('Delete ' + x.name + '?')) return; db.barbers = db.barbers.filter(b => b.id !== v); save(); toast('Barber removed.'); render(); return; }
  if (c === 'adm-del-service') { const x = db.services.find(s => s.id === v); if (!x) return; if (db.bookings.some(b => b.service === v)) return toast('Cannot delete: this service has bookings.'); if (!confirm('Delete service "' + x.name + '"?')) return; db.services = db.services.filter(s => s.id !== v); save(); toast('Service deleted.'); render(); return; }
  if (c === 'adm-export') { if (!hasPerm('reports.view')) return toast('No permission.'); return admExportCSV(); }
  if (c === 'adm-export-json') { if (myPerms().includes('*')) return admExportJSON(); return toast('Primary admin only.'); }
});

document.addEventListener('input', e => {
  if (e.target.id === 'adm-q' || e.target.id === 'adm-cq') {
    if (e.target.id === 'adm-q') admQ = e.target.value; else admCQ = e.target.value;
    render();
    const i = document.getElementById(e.target.id);
    if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }
});

document.addEventListener('submit', async e => {
  const form = e.target;
  if (form.id === 'adm-decline-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const b = db.bookings.find(x => x.id === v.id); if (!b) return;
    b.status = 'Declined'; b.declineReason = (v.reason || '').trim() || 'No reason given';
    db.notifications.unshift('Booking ' + b.id + ' declined.');
    save(); closeModal(); toast('Booking ' + b.id + ' declined.'); render(); return;
  }
  if (form.id === 'adm-pay-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const b = db.bookings.find(x => x.id === v.id); if (!b) return;
    b.payment = v.method || 'Paid'; b.paidAt = new Date().toISOString().slice(0, 10);
    db.notifications.unshift('Booking ' + b.id + ' paid via ' + b.payment + '.');
    save(); closeModal(); toast('Payment recorded for ' + b.id + '.'); render(); return;
  }
  if (form.id === 'login-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const fd = new FormData(form); const em = (fd.get('email') || '').trim(); const pw = fd.get('password') || '';
    const role = form.dataset.role === 'admin' ? 'admin' : 'client';
    if (role === 'client') {
      // Client login — verify against the PHP/MySQL clients table
      try {
        const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'client-login', email: em, password: pw }), credentials: 'same-origin' });
        const j = await r.json();
        if (j && j.ok) { try { sessionStorage.setItem('gents_auth', 'client'); sessionStorage.setItem('gents_client', JSON.stringify(j.client)); sessionStorage.removeItem('gents_staff') } catch (x) {} location.href = 'client'; return; }
        if (r.status === 401) { toast('Invalid email or password.'); return; }
      } catch (x) { toast('Sign-in service unavailable — check your connection.'); return; }
    }
    // Admin login — verify against the PHP/MySQL backend (falls back to local check offline)
    try {
      const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em, password: pw }), credentials: 'same-origin' });
      const j = await r.json();
      if (j && j.ok) {
        try { sessionStorage.setItem('gents_auth', 'admin'); sessionStorage.setItem('gents_staff', j.staff && j.staff.id || '') } catch (x) {}
        bootRemote(); location.href = 'admin'; return;
      }
      if (r.status === 401) { toast('Invalid admin credentials.'); return; }
    } catch (x) { /* backend unreachable — fall through to local check */ }
    const s = staffAll().find(x => (x.email || '').toLowerCase() === em.toLowerCase());
    if (!s || s.password !== pw || s.status === 'suspended') { toast('Invalid admin credentials.'); return; }
    try { sessionStorage.setItem('gents_auth', 'admin'); sessionStorage.setItem('gents_staff', s.id) } catch (x) {}
    location.href = 'admin'; return;
  }
  if (form.id === 'adm-branch-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (v.id) { const x = db.branches.find(b => b.id === v.id); if (x) Object.assign(x, { name: v.name, place: v.place, hours: v.hours, photo: v.photo || x.photo }); toast('Branch updated.'); }
    else { db.branches.push({ id: v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4), name: v.name, place: v.place, hours: v.hours || 'Mon–Sat · 09:00–18:00', photo: v.photo || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80' }); toast('Branch added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'adm-barber-form') {
    e.preventDefault(); const fd = new FormData(form); const v = Object.fromEntries(fd); const sv = fd.getAll('services');
    const data = { name: v.name, role: v.role || 'Barber', branch: v.branch, photo: v.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80', bio: v.bio || '', services: sv.length ? sv : db.services.map(s => s.id) };
    if (v.id) { const x = db.barbers.find(b => b.id === v.id); if (x) Object.assign(x, data); toast('Barber updated.'); }
    else { db.barbers.push({ id: 'barber' + Date.now(), ...data }); toast('Barber added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'adm-service-form') {
    e.preventDefault(); const fd = new FormData(form); const v = Object.fromEntries(fd); const bv = fd.getAll('branches');
    const data = { name: v.name, desc: v.desc || 'Grooming service', image: v.image || '', icon: v.icon || '✂', duration: Number(v.duration) || 30, price: Number(v.price) || 0, branches: bv.length ? bv : db.branches.map(b => b.id) };
    if (v.id) { const x = db.services.find(s => s.id === v.id); if (x) Object.assign(x, data); toast('Service updated.'); }
    else { db.services.push({ id: 'srv' + Date.now(), ...data }); toast('Service added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'adm-settings-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    db.settings = { name: v.name, phone: v.phone, whatsapp: v.whatsapp || v.phone, email: v.email, address: v.address, logo: v.logo || '', social: { facebook: v.fb || '', instagram: v.ig || '', tiktok: v.tt || '' } };
    save(); toast('Settings saved.'); return;
  }
});
