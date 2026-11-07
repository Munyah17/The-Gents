// ===== The Gent's — Staff, User Management & Accounting/ERP =====
// Injected inside app.js IIFE by _build.js. Adds admCan/myPerms (used by
// adminBody/dashboardFrame in admin-extra.js), new admin tabs, CRUD,
// CSV/Excel/PDF export and CSV/Excel import, payroll/payslips, petty cash,
// HR actions and a rule-based assistant.

let erpTab = 'overview', aiLog = [];
const ERPTABS = [['overview', 'Overview'], ['transactions', 'Income & Expenses'], ['payroll', 'Payroll'], ['petty', 'Petty Cash'], ['hr', 'Promotions & HR'], ['assistant', 'AI Assistant']];

// ---------- Permissions ----------
const PERM_LABELS = {
  dashboard: 'Dashboard', bookings: 'Bookings', calendar: 'Calendar',
  branches: 'Branches', staff_data: 'Barbers & Services', clients: 'Clients',
  reports: 'Reports', settings: 'Settings', usermgmt: 'User Management',
  staffmgmt: 'Staff Management', erp: 'Accounting & ERP'
};
const PERM_MAP = {
  overview: 'dashboard', bookings: 'bookings', calendar: 'calendar',
  branches: 'branches', barbers: 'staff_data', services: 'staff_data',
  clients: 'clients', reports: 'reports', settings: 'settings',
  users: 'usermgmt', staff: 'staffmgmt', erp: 'erp'
};
const STAFF_SEED = [{ id: 'admin1', username: 'Munyah', name: 'Munyah', email: 'munyah777@gmail.com', password: '@@Griezmann177#$', role: 'Super Admin', permissions: '*', protected: true, status: 'active', salary: 0, createdAt: '2026-01-01' }];
const ROLES = ['Receptionist', 'Manager', 'Super Admin'];

function safeSS(k) { try { return sessionStorage.getItem(k) } catch (e) { return null } }
function staffAll() { if (!Array.isArray(db.staff)) db.staff = JSON.parse(JSON.stringify(STAFF_SEED)); return db.staff; }
function admMe() { const l = staffAll(); return l.find(s => s.id === safeSS('gents_staff')) || l[0] || null; }
function myPerms() { const m = admMe(); if (!m) return []; return m.permissions === '*' ? ['*'] : (m.permissions || []); }
function admCan(tab) { const p = myPerms(); if (p.includes('*')) return true; const need = PERM_MAP[tab]; return need ? p.includes(need) : false; }
function acct() { if (!db.accounting) db.accounting = { openingBalance: 0, transactions: [], payroll: [], pettyFloat: 0, pettyCash: [], hrEvents: [] }; return db.accounting; }
function clientProfiles() {
  if (!Array.isArray(db.clientProfiles)) {
    const seen = {};
    db.clientProfiles = db.bookings.map(b => { const k = b.phone || b.email || b.name; if (!k || seen[k]) return null; seen[k] = 1; return { id: 'cli' + b.id, name: b.name, phone: b.phone || '', email: b.email || '', status: 'active', note: '', createdAt: b.date }; }).filter(Boolean);
  }
  return db.clientProfiles;
}

// ---------- ERP helpers ----------
const txList = () => acct().transactions;
const incTotal = l => (l || txList().filter(t => t.type === 'income')).reduce((s, t) => s + Number(t.amount || 0), 0);
const expTotal = l => (l || txList().filter(t => t.type === 'expense')).reduce((s, t) => s + Number(t.amount || 0), 0);
const pettyBalance = () => Number(acct().pettyFloat || 0) - acct().pettyCash.reduce((s, p) => s + Number(p.amount || 0), 0);
const money0 = n => '$' + Number(n || 0).toFixed(2);

// =====================================================================
//  USER MANAGEMENT (client profiles)
// =====================================================================
function admUsers(top) {
  const list = clientProfiles().slice().sort((a, b) => a.name.localeCompare(b.name));
  const spend = {};
  db.bookings.forEach(b => { const k = b.phone || b.email || b.name; spend[k] = (spend[k] || 0) + (b.status !== 'Cancelled' && b.status !== 'Declined' ? Number(service(b.service).price || 0) : 0); });
  return top + `<div class="panel"><div class="panel-head"><h3>Client Profiles (${list.length})</h3><div class="auth-actions">${ioButtons('clients', true)}${button('+ Add Client', 'usr-add', 'btn btn-gold btn-sm')}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Bookings</th><th>Total Spend</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(c => { const bk = db.bookings.filter(b => (b.phone || b.email || b.name) === (c.phone || c.email || c.name)); const sp = spend[c.phone || c.email || c.name] || 0; const plat = sp >= 100; return `<tr><td><strong>${esc(c.name)}</strong>${plat ? ' <span class="badge status completed" style="font-size:9px">PLATINUM</span>' : ''}</td><td>${esc(c.phone || '—')}</td><td>${esc(c.email || '—')}</td><td>${bk.length}</td><td>${money(sp)}</td><td>${c.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="usr-edit:${c.id}">Edit</button><button class="btn btn-sm" data-action="usr-del:${c.id}">Del</button></div></td></tr>`; }).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No client profiles yet.</div>'}</div></div>`;
}

function usrForm(id) {
  const x = id ? clientProfiles().find(c => c.id === id) : { name: '', phone: '', email: '', status: 'active', note: '' };
  if (id && !x) return;
  modal(id ? 'Edit Client' : 'Add Client', `<form id="usr-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(x.name || '')}"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" name="phone" value="${esc(x.phone || '')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" name="email" value="${esc(x.email || '')}"></div><div class="form-group"><label class="form-label">Status</label><select class="field" name="status"><option value="active" ${x.status === 'active' ? 'selected' : ''}>Active</option><option value="suspended" ${x.status === 'suspended' ? 'selected' : ''}>Suspended</option></select></div></div><div class="form-group"><label class="form-label">Notes</label><input class="field" name="note" value="${esc(x.note || '')}"></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Client'}</button></form>`);
}

// =====================================================================
//  STAFF MANAGEMENT (admins + permissions)
// =====================================================================
function admStaff(top) {
  const list = staffAll().slice().sort((a, b) => a.name.localeCompare(b.name));
  const permCount = s => s.permissions === '*' ? Object.keys(PERM_LABELS).length : (s.permissions || []).length;
  return top + `<div class="panel"><div class="panel-head"><h3>Staff & Admins (${list.length})</h3><div class="auth-actions">${ioButtons('staff', admMe() && (admMe().permissions === '*' || myPerms().includes('staffmgmt'))) }${button('+ Add Staff', 'stf-add', 'btn btn-gold btn-sm')}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Salary</th><th>Permissions</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(s => `<tr><td><strong>${esc(s.name)}</strong>${s.protected ? ' <span class="badge status confirmed" style="font-size:9px">OWNER</span>' : ''}</td><td>${esc(s.username)}</td><td>${esc(s.email)}</td><td>${esc(s.role)}</td><td>${money(s.salary || 0)}</td><td>${s.permissions === '*' ? 'All' : permCount(s) + ' modules'}</td><td>${s.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="stf-edit:${s.id}">Edit</button>${s.protected ? '' : `<button class="btn btn-sm" data-action="stf-perms:${s.id}">Perms</button><button class="btn btn-sm" data-action="stf-del:${s.id}">Del</button>`}</div></td></tr>`).join('')}</tbody></table></div></div>`;
}

function stfForm(id) {
  const x = id ? staffAll().find(s => s.id === id) : { username: '', name: '', email: '', role: 'Receptionist', password: '', salary: 0, status: 'active' };
  if (id && !x) return;
  modal(id ? 'Edit Staff' : 'Add Staff', `<form id="stf-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(x.name || '')}"></div><div class="form-group"><label class="form-label">Username</label><input class="field" required name="username" value="${esc(x.username || '')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" value="${esc(x.email || '')}"></div><div class="form-group"><label class="form-label">Role</label><select class="field" name="role">${ROLES.map(r => `<option ${x.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">${id ? 'New password (blank = keep)' : 'Password'}</label><input class="field" type="password" name="password" ${id ? '' : 'required'}></div><div class="form-group"><label class="form-label">Monthly salary (USD)</label><input class="field" type="number" min="0" step="0.01" name="salary" value="${x.salary || 0}"></div><div class="form-group"><label class="form-label">Status</label><select class="field" name="status"><option value="active" ${x.status === 'active' ? 'selected' : ''}>Active</option><option value="suspended" ${x.status === 'suspended' ? 'selected' : ''}>Suspended</option></select></div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Staff'}</button></form>`);
}

function stfPerms(id) {
  const s = staffAll().find(x => x.id === id); if (!s || s.protected) return;
  const cur = s.permissions === '*' ? Object.keys(PERM_LABELS) : (s.permissions || []);
  modal('Permissions — ' + esc(s.name), `<form id="stf-perms-form"><input type="hidden" name="id" value="${esc(id)}"><p class="muted small" style="margin-top:0">Select which modules this staff member can access.</p><div style="display:grid;gap:8px;margin:14px 0">${Object.entries(PERM_LABELS).map(([k, label]) => `<label class="small" style="display:flex;gap:10px;align-items:center"><input type="checkbox" name="perm" value="${k}" ${cur.includes(k) ? 'checked' : ''}> <b>${label}</b></label>`).join('')}</div><button class="btn btn-gold">Save Permissions</button></form>`);
}

// =====================================================================
//  ACCOUNTING & ERP
// =====================================================================
function admErp(top) {
  const a = acct();
  const inc = incTotal(), exp = expTotal(), net = inc - exp;
  return erpTab === 'transactions' ? erpTransactions(top) : erpTab === 'payroll' ? erpPayroll(top) : erpTab === 'petty' ? erpPetty(top) : erpTab === 'hr' ? erpHr(top) : erpTab === 'assistant' ? erpAssistant(top) : erpOverview(a, inc, exp, net, top);
}

function erpOverview(a, inc, exp, net, top) {
  const pendingPay = a.payroll.filter(p => p.status === 'pending').length;
  const stats = [
    ['▤', money0(a.openingBalance), 'Opening Balance'],
    ['↓', money0(inc), 'Income'],
    ['↑', money0(exp), 'Expenses'],
    ['◈', money0(net), 'Net Profit'],
    ['¤', money0(pettyBalance()), 'Petty Cash'],
    ['▣', pendingPay, 'Payroll Pending']
  ];
  // last 6 months income vs expense
  const months = [];
  for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); months.push({ key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), label: d.toLocaleDateString('en-ZW', { month: 'short' }) }); }
  const inM = months.map(m => ({ label: m.label, n: a.transactions.filter(t => t.type === 'income' && (t.date || '').startsWith(m.key)).reduce((s, t) => s + Number(t.amount || 0), 0) }));
  const exM = months.map(m => ({ label: m.label, n: a.transactions.filter(t => t.type === 'expense' && (t.date || '').startsWith(m.key)).reduce((s, t) => s + Number(t.amount || 0), 0) }));
  const maxV = Math.max(1, ...inM.map(x => x.n), ...exM.map(x => x.n));
  const chart = months.map((m, i) => `<div class="bar" style="flex-direction:column;align-items:center;justify-content:flex-end;height:150px;gap:4px"><div style="display:flex;gap:3px;align-items:flex-end;height:120px"><i title="Income ${money0(inM[i].n)}" style="width:12px;background:var(--gold);border-radius:3px 3px 0 0;height:${Math.max(2, inM[i].n / maxV * 110)}px"></i><i title="Expense ${money0(exM[i].n)}" style="width:12px;background:#c0392b;border-radius:3px 3px 0 0;height:${Math.max(2, exM[i].n / maxV * 110)}px"></i></div><span style="font-size:9px;color:var(--muted)">${m.label}</span></div>`).join('');
  const recent = a.transactions.slice().sort((x, y) => (y.date || '').localeCompare(x.date || '')).slice(0, 6);
  return `<div class="dash-top"><div><div class="eyebrow">FINANCE</div><h1>Accounting & ERP</h1><p class="muted">Income, expenses, payroll, petty cash and HR — all in one place.</p></div></div>
  <div class="segmented" style="margin-bottom:20px">${ERPTABS.map(([k, t]) => `<button class="pill ${erpTab === k ? 'active' : ''}" data-action="erp-tab:${k}">${t}</button>`).join('')}</div>
  <div class="stat-grid">${stats.map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number" style="font-size:20px">${n}</div><div class="small">${t}</div></div>`).join('')}</div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Income vs Expenses · 6 months</h3><span class="small muted"><i style="display:inline-block;width:9px;height:9px;background:var(--gold);border-radius:2px"></i> income &nbsp;<i style="display:inline-block;width:9px;height:9px;background:#c0392b;border-radius:2px"></i> expense</span></div><div class="chart">${chart}</div></div>
  <div class="panel"><div class="panel-head"><h3>Opening Balance & Quick Actions</h3></div><form id="erp-opening" class="form-group" style="display:flex;gap:8px;align-items:end;margin-bottom:14px"><input class="field" type="number" step="0.01" name="opening" value="${a.openingBalance || 0}" style="max-width:160px"><button class="btn btn-sm">Set</button></form><div class="grid grid-3">${button('+ Income', 'erp-addtx:income', 'btn')}${button('+ Expense', 'erp-addtx:expense', 'btn')}${button('Run Payroll', 'erp-payroll-run', 'btn')}</div></div></div>
  <div class="panel"><div class="panel-head"><h3>Recent Transactions</h3><button class="btn btn-sm" data-action="erp-tab:transactions">View all</button></div>${recent.map(t => `<div class="data-line"><span class="muted">${esc(t.date)} · ${esc(t.description || t.category)}</span><b style="color:${t.type === 'income' ? 'var(--gold)' : '#e08a8a'}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</b></div>`).join('') || '<p class="muted">No transactions yet.</p>'}</div>`;
}

function erpTransactions(top) {
  const list = txList().slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const cats = [...new Set(txList().map(t => t.category).filter(Boolean))];
  return top + `<div class="panel"><div class="panel-head"><h3>Transactions (${list.length})</h3><div class="auth-actions">${button('+ Income', 'erp-addtx:income', 'btn btn-gold btn-sm')}${button('+ Expense', 'erp-addtx:expense', 'btn btn-sm')}${ioButtons('transactions', true)}</div></div>
  ${cats.length ? `<div class="adm-filters"><div class="segmented">${['all', ...cats].map(c => `<button class="pill ${admTxCat === c ? 'active' : ''}" data-action="erp-cat:${c}">${c === 'all' ? 'All' : esc(c)}</button>`).join('')}</div></div>` : ''}
  <div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Branch</th><th>Amount</th></tr></thead><tbody>${list.filter(t => admTxCat === 'all' || t.category === admTxCat).map(t => `<tr><td>${esc(t.date)}</td><td>${t.type === 'income' ? '<span class="badge status confirmed">Income</span>' : '<span class="badge status declined">Expense</span>'}</td><td>${esc(t.category)}</td><td>${esc(t.description || '—')}</td><td>${esc(branch(t.branch).name)}</td><td style="color:${t.type === 'income' ? 'var(--gold)' : '#e08a8a'}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No transactions yet.</div>'}</div>
  <p class="muted small" style="margin-top:12px">Totals — Income: <b style="color:var(--gold)">${money(incTotal())}</b> · Expenses: <b style="color:#e08a8a">${money(expTotal())}</b> · Net: <b>${money(incTotal() - expTotal())}</b></p></div>`;
}
let admTxCat = 'all';

function txForm(type) {
  const cats = type === 'income' ? ['Service Sales', 'Product Sales', 'Membership', 'Other Income'] : ['Rent', 'Supplies', 'Utilities', 'Salaries', 'Marketing', 'Other Expense'];
  modal(type === 'income' ? 'Add Income' : 'Add Expense', `<form id="erp-tx-form"><input type="hidden" name="type" value="${type}"><div class="form-grid"><div class="form-group"><label class="form-label">Date</label><input class="field" type="date" required name="date" value="${new Date().toISOString().slice(0, 10)}"></div><div class="form-group"><label class="form-label">Amount (USD)</label><input class="field" type="number" min="0.01" step="0.01" required name="amount"></div><div class="form-group"><label class="form-label">Category</label><select class="field" name="category">${cats.map(c => `<option>${c}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Branch</label><select class="field" name="branch">${db.branches.map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('')}<option value="">All / HQ</option></select></div></div><div class="form-group"><label class="form-label">Description</label><input class="field" name="description" placeholder="e.g. Saturday service sales"></div><button class="btn btn-gold">Save ${type === 'income' ? 'Income' : 'Expense'}</button></form>`);
}

function erpPayroll(top) {
  const a = acct();
  const list = a.payroll.slice().sort((x, y) => (y.month || '').localeCompare(x.month || ''));
  return top + `<div class="panel"><div class="panel-head"><h3>Payroll</h3><div class="auth-actions">${button('Run Payroll', 'erp-payroll-run', 'btn btn-gold btn-sm')}${ioButtons('payroll', true)}</div></div>
  <p class="muted small" style="margin-top:0">Run payroll generates a payslip for every active staff member based on their monthly salary.</p>
  <div class="table-wrap"><table><thead><tr><th>Payslip</th><th>Staff</th><th>Role</th><th>Month</th><th>Gross</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th></th></tr></thead><tbody>${list.map(p => `<tr><td>${esc(p.id)}</td><td>${esc(p.name)}</td><td>${esc(p.role)}</td><td>${esc(p.month)}</td><td>${money(p.gross)}</td><td>${money(p.deductions || 0)}</td><td><b>${money(p.net)}</b></td><td>${p.status === 'paid' ? '<span class="badge status completed">Paid</span>' : '<span class="badge status pending">Pending</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="erp-payslip:${p.id}">Payslip</button>${p.status === 'pending' ? `<button class="btn btn-sm" data-action="erp-pay-paid:${p.id}">Mark Paid</button>` : ''}</div></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No payslips yet — run payroll to generate them.</div>'}</div></div>`;
}

function runPayroll() {
  const month = new Date().toISOString().slice(0, 7);
  const a = acct();
  const staff = staffAll().filter(s => s.status === 'active');
  if (!staff.length) return toast('No active staff.');
  staff.forEach(s => {
    if (a.payroll.some(p => p.staffId === s.id && p.month === month)) return;
    const gross = Number(s.salary || 0), deductions = 0;
    a.payroll.push({ id: 'PAY-' + s.id + '-' + month, staffId: s.id, name: s.name, role: s.role, month, gross, deductions, net: gross - deductions, status: 'pending' });
  });
  save(); toast('Payroll generated for ' + month + '.'); render();
}

function payslip(id) {
  const p = acct().payroll.find(x => x.id === id); if (!p) return;
  const s = staffAll().find(x => x.id === p.staffId) || {};
  modal('Payslip ' + esc(p.id), `<div class="payslip"><div class="payslip-head"><div><div class="eyebrow">THE GENT’S BARBER & GENTS SALON</div><h3>Payslip</h3></div><div class="small muted" style="text-align:right">${esc(p.month)}<br>${p.status === 'paid' ? 'PAID' : 'PENDING'}</div></div>
  <div class="kv" style="margin:16px 0"><span>Employee</span><b>${esc(p.name)}</b><span>Role</span><b>${esc(p.role)}</b><span>Employee ID</span><b>${esc(p.staffId)}</b></div>
  <table style="width:100%;font-size:13px"><thead><tr><th style="text-align:left">Earnings</th><th style="text-align:right">Amount</th></tr></thead><tbody><tr><td>Basic Salary</td><td style="text-align:right">${money(p.gross)}</td></tr></tbody></table>
  <table style="width:100%;font-size:13px;margin-top:8px"><thead><tr><th style="text-align:left">Deductions</th><th style="text-align:right">Amount</th></tr></thead><tbody><tr><td>Statutory / Other</td><td style="text-align:right">${money(p.deductions || 0)}</td></tr></tbody></table>
  <div class="data-line" style="margin-top:14px;border-top:1px solid var(--line);padding-top:10px"><span>NET PAY</span><b style="font-size:18px;color:var(--gold)">${money(p.net)}</b></div>
  <p class="muted small" style="margin-top:18px">Generated ${new Date().toLocaleDateString('en-ZW')}. This is a system-generated payslip.</p></div>
  <div class="auth-actions" style="margin-top:16px">${button('Download PDF', 'erp-payslip-pdf:' + p.id, 'btn btn-gold')}${p.status === 'pending' ? button('Mark Paid', 'erp-pay-paid:' + p.id, 'btn') : ''}</div>`);
}

function erpPetty(top) {
  const a = acct();
  const list = a.pettyCash.slice().sort((x, y) => (y.date || '').localeCompare(x.date || ''));
  return top + `<div class="panel"><div class="panel-head"><h3>Petty Cash</h3><div class="auth-actions">${button('Set Float', 'erp-float', 'btn btn-sm')}${button('+ Expense Voucher', 'erp-petty-add', 'btn btn-gold btn-sm')}${ioButtons('petty', true)}</div></div>
  <div class="stat-grid" style="margin-bottom:18px"><div class="stat"><span class="stat-icon">¤</span><div class="number">${money0(pettyBalance())}</div><div class="small">Current Balance</div></div><div class="stat"><span class="stat-icon">▤</span><div class="number">${money0(a.pettyFloat || 0)}</div><div class="small">Float</div></div><div class="stat"><span class="stat-icon">↑</span><div class="number">${money0(a.pettyCash.reduce((s, p) => s + Number(p.amount || 0), 0))}</div><div class="small">Total Spent</div></div></div>
  <div class="table-wrap"><table><thead><tr><th>Date</th><th>Voucher</th><th>Description</th><th>Received By</th><th>Amount</th></tr></thead><tbody>${list.map(p => `<tr><td>${esc(p.date)}</td><td>${esc(p.id)}</td><td>${esc(p.description)}</td><td>${esc(p.receivedBy || '—')}</td><td style="color:#e08a8a">−${money(p.amount)}</td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No petty cash expenses yet.</div>'}</div></div>`;
}

function pettyForm() {
  modal('Petty Cash Voucher', `<form id="erp-petty-form"><div class="form-grid"><div class="form-group"><label class="form-label">Date</label><input class="field" type="date" required name="date" value="${new Date().toISOString().slice(0, 10)}"></div><div class="form-group"><label class="form-label">Amount (USD)</label><input class="field" type="number" min="0.01" step="0.01" required name="amount"></div><div class="form-group"><label class="form-label">Received by</label><input class="field" name="receivedBy" placeholder="Staff member"></div></div><div class="form-group"><label class="form-label">Description</label><input class="field" required name="description" placeholder="e.g. Taxi fare for supplier pickup"></div><button class="btn btn-gold">Save Voucher</button></form>`);
}

function erpHr(top) {
  const a = acct();
  const events = a.hrEvents.slice().sort((x, y) => (y.date || '').localeCompare(x.date || ''));
  const roleIdx = r => ROLES.indexOf(r);
  return top + `<div class="panel"><div class="panel-head"><h3>Staff Roles & Actions</h3></div><p class="muted small" style="margin-top:0">Promote, demote or suspend staff members. Every action is logged below.</p>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Current Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>${staffAll().filter(s => !s.protected).map(s => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.role)}</td><td>${s.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="erp-hr:promote:${s.id}">▲ Promote</button><button class="btn btn-sm" data-action="erp-hr:demote:${s.id}">▼ Demote</button><button class="btn btn-sm" data-action="erp-hr:${s.status === 'active' ? 'suspend' : 'activate'}:${s.id}">${s.status === 'active' ? 'Suspend' : 'Reactivate'}</button></div></td></tr>`).join('') || '<tr><td colspan="4" class="muted">Only the owner account exists.</td></tr>'}</tbody></table></div></div>
  <div class="panel"><div class="panel-head"><h3>HR Event Log</h3></div>${events.map(e => `<div class="data-line"><span class="muted">${esc(e.date)} · ${esc(e.staffName)}</span><b>${e.type === 'promotion' ? '▲ Promoted' : e.type === 'demotion' ? '▼ Demoted' : '⏻ ' + e.type}${e.fromRole || e.toRole ? ' · ' + esc(e.fromRole || '') + ' → ' + esc(e.toRole || '') : ''}</b></div>`).join('') || '<p class="muted">No HR events yet.</p>'}</div>`;
}

function erpAssistant(top) {
  return top + `<div class="panel" style="max-width:720px"><div class="panel-head"><h3>Assistant</h3></div><p class="muted small" style="margin-top:0">Ask about revenue, expenses, bookings, approvals, top barbers, petty cash or staff.</p>
  <div id="ai-log" style="display:grid;gap:10px;margin:14px 0;max-height:340px;overflow:auto">${aiLog.map(m => `<div class="data-line"><span class="muted">You: ${esc(m.q)}</span><b style="font-weight:500">${esc(m.a)}</b></div>`).join('') || '<p class="muted">No questions yet.</p>'}</div>
  <form id="ai-form" style="display:flex;gap:8px"><input class="field" name="q" placeholder="e.g. What was revenue this month?" required><button class="btn btn-gold">Ask</button></form></div>`;
}

function aiAnswer(q) {
  const s = q.toLowerCase(), a = acct();
  const mkey = new Date().toISOString().slice(0, 7);
  const mTx = a.transactions.filter(t => (t.date || '').startsWith(mkey));
  if (/revenue|income|sales|earn|money in/.test(s)) return 'This month: income ' + money(incTotal(mTx.filter(t => t.type === 'income'))) + ', expenses ' + money(incTotal(mTx.filter(t => t.type === 'expense'))) + ', net ' + money(incTotal(mTx.filter(t => t.type === 'income')) - incTotal(mTx.filter(t => t.type === 'expense'))) + '.';
  if (/expense|spent|cost|money out/.test(s)) return 'Expenses this month total ' + money(expTotal(mTx.filter(t => t.type === 'expense'))) + ' across ' + mTx.filter(t => t.type === 'expense').length + ' transactions.';
  if (/profit|net|bottom line/.test(s)) return 'Net profit this month is ' + money(incTotal(mTx.filter(t => t.type === 'income')) - incTotal(mTx.filter(t => t.type === 'expense'))) + '.';
  if (/booking|appointment|reservation/.test(s)) { const n = db.bookings.filter(b => (b.date || '').startsWith(mkey)).length; return 'There are ' + n + ' bookings dated this month (' + db.bookings.filter(b => b.status === 'Pending').length + ' still pending approval overall).'; }
  if (/pending|approval|approve/.test(s)) return db.bookings.filter(b => b.status === 'Pending').length + ' bookings are waiting for approval.';
  if (/barber|top|best|perform/.test(s)) { const c = {}; db.bookings.forEach(b => { if (b.status !== 'Cancelled' && b.status !== 'Declined') c[b.barber] = (c[b.barber] || 0) + 1; }); const top = Object.entries(c).sort((x, y) => y[1] - x[1])[0]; return top ? esc(barber(top[0]).name) + ' leads with ' + top[1] + ' bookings.' : 'No booking data yet.'; }
  if (/petty|float|cash/.test(s)) return 'Petty cash balance is ' + money0(pettyBalance()) + ' (float ' + money0(a.pettyFloat || 0) + ').';
  if (/staff|team|admin|employee/.test(s)) return staffAll().length + ' staff accounts: ' + staffAll().map(s => s.name + ' (' + s.role + ')').join(', ') + '.';
  if (/opening|balance/.test(s)) return 'Opening balance is set to ' + money0(a.openingBalance) + '.';
  if (/hi|hello|help/.test(s)) return 'Hi! I can report on revenue, expenses, profit, bookings, pending approvals, top barbers, petty cash, staff and opening balance. What would you like to know?';
  return 'I can help with revenue, expenses, bookings, approvals, top barbers, petty cash, staff and balances. Try asking "what is net profit this month?"';
}

// =====================================================================
//  IMPORT / EXPORT
// =====================================================================
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src)); document.head.appendChild(s); }); }
async function loadXLSX() { if (!window.XLSX) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'); }
async function loadPDF() { if (!(window.jspdf && window.jspdf.jsPDF)) { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'); } }

const IO = {
  bookings: { title: 'Bookings', headers: ['Date', 'Time', 'Client', 'Phone', 'Email', 'Service', 'Barber', 'Branch', 'Status', 'Source'], rows: () => db.bookings.map(b => [b.date, b.time, b.name, b.phone, b.email || '', service(b.service).name, barber(b.barber).name, branch(b.branch).name, b.status, b.source || '']), imp: true },
  branches: { title: 'Branches', headers: ['Name', 'Place', 'Hours', 'Photo'], rows: () => db.branches.map(b => [b.name, b.place, b.hours || '', b.photo || '']), imp: true },
  barbers: { title: 'Barbers', headers: ['Name', 'Role', 'Branch', 'Services', 'Photo'], rows: () => db.barbers.map(b => [b.name, b.role, branch(b.branch).name, b.services.map(s => service(s).name).join('; '), b.photo || '']), imp: true },
  services: { title: 'Services', headers: ['Name', 'Description', 'Price', 'Duration', 'Icon', 'Branches'], rows: () => db.services.map(s => [s.name, s.desc || '', s.price, s.duration, s.icon, s.branches.map(b => branch(b).name).join('; ')]), imp: true },
  clients: { title: 'Client Profiles', headers: ['Name', 'Phone', 'Email', 'Status', 'Notes'], rows: () => clientProfiles().map(c => [c.name, c.phone || '', c.email || '', c.status, c.note || '']), imp: true },
  customers: { title: 'Customers', headers: ['Name', 'Phone', 'Email', 'Bookings', 'Last Visit', 'Total Spend'], rows: () => { const m = {}; db.bookings.forEach(b => { const k = b.phone || b.email || b.name; (m[k] = m[k] || { n: b.name, p: b.phone, e: b.email, c: 0, l: '', s: 0 }).c++; if ((b.date || '') > m[k].l) m[k].l = b.date; if (b.status !== 'Cancelled' && b.status !== 'Declined') m[k].s += Number(service(b.service).price || 0); }); return Object.values(m).map(c => [c.n, c.p || '', c.e || '', c.c, c.l, c.s.toFixed(2)]); }, imp: false },
  staff: { title: 'Staff', headers: ['Username', 'Name', 'Email', 'Role', 'Salary', 'Status'], rows: () => staffAll().map(s => [s.username, s.name, s.email, s.role, s.salary || 0, s.status]), imp: true },
  transactions: { title: 'Transactions', headers: ['Date', 'Type', 'Category', 'Amount', 'Description', 'Branch'], rows: () => txList().map(t => [t.date, t.type, t.category, t.amount, t.description || '', branch(t.branch).name]), imp: true },
  payroll: { title: 'Payroll', headers: ['Payslip', 'Staff', 'Role', 'Month', 'Gross', 'Deductions', 'Net', 'Status'], rows: () => acct().payroll.map(p => [p.id, p.name, p.role, p.month, p.gross, p.deductions || 0, p.net, p.status]), imp: true },
  petty: { title: 'Petty Cash', headers: ['Date', 'Voucher', 'Description', 'Received By', 'Amount'], rows: () => acct().pettyCash.map(p => [p.date, p.id, p.description, p.receivedBy || '', p.amount]), imp: true },
  calendar: { title: 'Calendar Bookings', headers: ['Date', 'Time', 'Client', 'Service', 'Barber', 'Branch', 'Status'], rows: () => { const base = new Date(); base.setMonth(base.getMonth() + admCalOff); const y = base.getFullYear(), m = base.getMonth(); const p = n => String(n).padStart(2, '0'); const pref = y + '-' + p(m + 1); return db.bookings.filter(b => (b.date || '').startsWith(pref)).map(b => [b.date, b.time, b.name, service(b.service).name, barber(b.barber).name, branch(b.branch).name, b.status]); }, imp: false },
  reports: { title: 'Reports Summary', headers: ['Metric', 'Value'], rows: () => [['Total bookings', db.bookings.length], ['Revenue (confirmed+completed)', db.bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((s, b) => s + Number(service(b.service).price || 0), 0).toFixed(2)], ['Pending', db.bookings.filter(b => b.status === 'Pending').length], ['Income (ERP)', incTotal().toFixed(2)], ['Expenses (ERP)', expTotal().toFixed(2)], ['Net profit', (incTotal() - expTotal()).toFixed(2)]], imp: false }
};

function ioButtons(entity, canImport) { const d = IO[entity]; if (!d) return ''; return `<span class="io-bar">${button('CSV', 'io-exp:' + entity + ':csv', 'btn btn-sm')}${button('Excel', 'io-exp:' + entity + ':xlsx', 'btn btn-sm')}${button('PDF', 'io-exp:' + entity + ':pdf', 'btn btn-sm')}${canImport && d.imp ? button('Import', 'io-imp:' + entity, 'btn btn-sm') : ''}</span>`; }

function csvEscape(v) { return '"' + String(v ?? '').replace(/"/g, '""') + '"'; }
async function doExport(entity, fmt) {
  const d = IO[entity]; if (!d) return;
  const rows = [d.headers, ...d.rows()];
  if (fmt === 'csv') { admDownload(d.title + '.csv', rows.map(r => r.map(csvEscape).join(',')).join('\n'), 'text/csv'); toast('CSV exported.'); return; }
  if (fmt === 'xlsx') { await loadXLSX(); const ws = XLSX.utils.aoa_to_sheet(rows); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, d.title.slice(0, 31)); XLSX.writeFile(wb, d.title + '.xlsx'); toast('Excel exported.'); return; }
  if (fmt === 'pdf') { await loadPDF(); const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.setFontSize(14); doc.text("The Gent's — " + d.title, 14, 15); doc.setFontSize(9); doc.text('Generated ' + new Date().toLocaleString('en-ZW'), 14, 21); doc.autoTable({ head: [d.headers], body: rows.slice(1), startY: 26, styles: { fontSize: 8 }, headStyles: { fillColor: [60, 45, 20] } }); doc.save(d.title + '.pdf'); toast('PDF exported.'); }
}

const normH = h => String(h || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const findCol = (hdrs, names) => { for (const n of names) { const i = hdrs.findIndex(h => normH(h) === normH(n)); if (i > -1) return i; } return -1; };

async function doImport(entity) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.csv,.xlsx,.xls';
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      await loadXLSX();
      let wb;
      if (/\.csv$/i.test(f.name)) wb = XLSX.read(await f.text(), { type: 'string' });
      else wb = XLSX.read(await f.arrayBuffer());
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      if (rows.length < 2) return toast('File is empty.');
      const hdrs = rows[0].map(String);
      const data = rows.slice(1).filter(r => r.some(c => String(c).trim() !== ''));
      const n = importRows(entity, hdrs, data);
      toast(n + ' row(s) imported into ' + entity + '.');
      render();
    } catch (err) { toast('Import failed: ' + (err && err.message ? err.message : err)); }
  };
  inp.click();
}

function importRows(entity, hdrs, data) {
  const col = (names) => findCol(hdrs, names);
  let n = 0;
  const nameTo = (arr, nm) => { const t = String(nm || '').toLowerCase().trim(); return arr.find(x => (x.name || '').toLowerCase() === t) || arr.find(x => (x.name || '').toLowerCase().includes(t)) || null; };
  if (entity === 'bookings') {
    const ci = { date: col(['date']), time: col(['time']), name: col(['client', 'name']), phone: col(['phone']), email: col(['email']), service: col(['service']), barber: col(['barber']), branch: col(['branch']), status: col(['status']), source: col(['source']) };
    data.forEach(r => { const sv = nameTo(db.services, r[ci.service]); const br = nameTo(db.branches, r[ci.branch]); const ba = nameTo(db.barbers, r[ci.barber]); if (!sv || !br) return; db.bookings.push({ id: 'GT-' + (1100 + db.bookings.length) + '-' + Date.now().toString().slice(-3), name: String(r[ci.name] || 'Guest'), phone: String(r[ci.phone] || ''), email: String(r[ci.email] || ''), branch: br.id, service: sv.id, barber: ba ? ba.id : null, date: String(r[ci.date] || '').slice(0, 10), time: String(r[ci.time] || '10:00').slice(0, 5), status: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Declined'].includes(r[ci.status]) ? r[ci.status] : 'Pending', source: r[ci.source] === 'Walk-in' ? 'Walk-in' : 'Online', notes: '' }); n++; });
  } else if (entity === 'branches') {
    const ci = { name: col(['name']), place: col(['place', 'address']), hours: col(['hours']), photo: col(['photo']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; db.branches.push({ id: 'br-' + Date.now().toString().slice(-6) + n, name: String(r[ci.name]), place: String(r[ci.place] || ''), hours: String(r[ci.hours] || ''), photo: String(r[ci.photo] || '') || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80' }); n++; });
  } else if (entity === 'services') {
    const ci = { name: col(['name']), desc: col(['description', 'desc']), price: col(['price']), duration: col(['duration']), icon: col(['icon']), branches: col(['branches']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; const bnames = String(r[ci.branches] || '').split(/[;,]/).map(x => x.trim().toLowerCase()).filter(Boolean); const bids = db.branches.filter(b => bnames.includes(b.name.toLowerCase())).map(b => b.id); db.services.push({ id: 'srv' + Date.now() + n, name: String(r[ci.name]), desc: String(r[ci.desc] || ''), price: Number(r[ci.price]) || 0, duration: Number(r[ci.duration]) || 30, icon: String(r[ci.icon] || '✂'), branches: bids.length ? bids : db.branches.map(b => b.id) }); n++; });
  } else if (entity === 'barbers') {
    const ci = { name: col(['name']), role: col(['role']), branch: col(['branch']), services: col(['services']), photo: col(['photo']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; const br = nameTo(db.branches, r[ci.branch]); const snames = String(r[ci.services] || '').split(/[;,]/).map(x => x.trim().toLowerCase()).filter(Boolean); const sids = db.services.filter(s => snames.includes(s.name.toLowerCase())).map(s => s.id); db.barbers.push({ id: 'barber' + Date.now() + n, name: String(r[ci.name]), role: String(r[ci.role] || 'Barber'), branch: br ? br.id : (db.branches[0] ? db.branches[0].id : ''), photo: String(r[ci.photo] || '') || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80', services: sids.length ? sids : db.services.map(s => s.id) }); n++; });
  } else if (entity === 'clients') {
    const ci = { name: col(['name']), phone: col(['phone']), email: col(['email']), status: col(['status']), note: col(['notes', 'note']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; clientProfiles().push({ id: 'cli' + Date.now() + n, name: String(r[ci.name]), phone: String(r[ci.phone] || ''), email: String(r[ci.email] || ''), status: String(r[ci.status] || 'active') === 'suspended' ? 'suspended' : 'active', note: String(r[ci.note] || ''), createdAt: new Date().toISOString().slice(0, 10) }); n++; });
  } else if (entity === 'staff') {
    const ci = { username: col(['username']), name: col(['name']), email: col(['email']), role: col(['role']), salary: col(['salary']), status: col(['status']) };
    data.forEach(r => { const em = String(r[ci.email] || '').toLowerCase(); if (!String(r[ci.name] || '').trim() || staffAll().some(s => s.email.toLowerCase() === em)) return; staffAll().push({ id: 'staff' + Date.now() + n, username: String(r[ci.username] || String(r[ci.name]).toLowerCase().replace(/\s+/g, '.')), name: String(r[ci.name]), email: em, password: '', role: ROLES.includes(r[ci.role]) ? r[ci.role] : 'Receptionist', permissions: [], protected: false, status: String(r[ci.status] || 'active') === 'suspended' ? 'suspended' : 'active', salary: Number(r[ci.salary]) || 0, createdAt: new Date().toISOString().slice(0, 10) }); n++; });
  } else if (entity === 'transactions') {
    const ci = { date: col(['date']), type: col(['type']), category: col(['category']), amount: col(['amount']), desc: col(['description']), branch: col(['branch']) };
    data.forEach(r => { const type = String(r[ci.type] || '').toLowerCase() === 'income' ? 'income' : 'expense'; if (!(Number(r[ci.amount]) > 0)) return; const br = nameTo(db.branches, r[ci.branch]); acct().transactions.push({ id: 'TX-' + Date.now().toString().slice(-6) + n, type, category: String(r[ci.category] || (type === 'income' ? 'Other Income' : 'Other Expense')), amount: Number(r[ci.amount]), date: String(r[ci.date] || '').slice(0, 10), description: String(r[ci.desc] || ''), branch: br ? br.id : '' }); n++; });
  } else if (entity === 'payroll') {
    const ci = { id: col(['payslip', 'id']), name: col(['staff', 'name']), role: col(['role']), month: col(['month']), gross: col(['gross']), deductions: col(['deductions']), net: col(['net']), status: col(['status']) };
    data.forEach(r => { const nm = String(r[ci.name] || ''); if (!nm.trim()) return; const s = staffAll().find(x => x.name.toLowerCase() === nm.toLowerCase()); acct().payroll.push({ id: String(r[ci.id] || '') || 'PAY-IMP-' + Date.now() + n, staffId: s ? s.id : '', name: nm, role: String(r[ci.role] || ''), month: String(r[ci.month] || '').slice(0, 7), gross: Number(r[ci.gross]) || 0, deductions: Number(r[ci.deductions]) || 0, net: Number(r[ci.net]) || 0, status: String(r[ci.status] || 'pending') === 'paid' ? 'paid' : 'pending' }); n++; });
  } else if (entity === 'petty') {
    const ci = { date: col(['date']), id: col(['voucher', 'id']), desc: col(['description']), by: col(['received by', 'receivedby']), amount: col(['amount']) };
    data.forEach(r => { if (!(Number(r[ci.amount]) > 0)) return; acct().pettyCash.push({ id: String(r[ci.id] || '') || 'PC-' + Date.now().toString().slice(-6) + n, date: String(r[ci.date] || '').slice(0, 10), description: String(r[ci.desc] || ''), receivedBy: String(r[ci.by] || ''), amount: Number(r[ci.amount]) }); n++; });
  }
  return n;
}

// =====================================================================
//  EVENTS
// =====================================================================
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, parts = a.split(':'), c = parts[0];
  if (!['erp-', 'usr-', 'stf-', 'io-'].some(p => c.startsWith(p))) return;
  e.stopImmediatePropagation();
  const v = parts.slice(1).join(':');

  // --- tab switching ---
  if (c === 'erp-tab') { erpTab = v; return render(); }
  if (c === 'erp-cat') { admTxCat = v; return render(); }

  // --- user management ---
  if (c === 'usr-add') return usrForm();
  if (c === 'usr-edit') return usrForm(v);
  if (c === 'usr-del') { const x = clientProfiles().find(c => c.id === v); if (!x) return; if (!confirm('Delete client profile "' + x.name + '"?')) return; db.clientProfiles = clientProfiles().filter(c => c.id !== v); save(); toast('Client deleted.'); render(); return; }

  // --- staff management ---
  if (c === 'stf-add') return stfForm();
  if (c === 'stf-edit') return stfForm(v);
  if (c === 'stf-perms') return stfPerms(v);
  if (c === 'stf-del') { const x = staffAll().find(s => s.id === v); if (!x) return; if (x.protected) return toast('This account cannot be deleted.'); if (!confirm('Permanently delete ' + x.name + '?')) return; db.staff = staffAll().filter(s => s.id !== v); save(); toast('Staff removed.'); render(); return; }

  // --- erp ---
  if (c === 'erp-addtx') return txForm(v);
  if (c === 'erp-payroll-run') return runPayroll();
  if (c === 'erp-payslip') return payslip(v);
  if (c === 'erp-payslip-pdf') { const p = acct().payroll.find(x => x.id === v); if (p) payslipPDF(p); return; }
  if (c === 'erp-pay-paid') { const p = acct().payroll.find(x => x.id === v); if (p) { p.status = 'paid'; save(); toast('Payslip marked paid.'); closeModal(); render(); } return; }
  if (c === 'erp-petty-add') return pettyForm();
  if (c === 'erp-float') { const f = prompt('Set petty cash float amount (USD):', acct().pettyFloat || 0); if (f === null) return; acct().pettyFloat = Number(f) || 0; save(); toast('Float updated.'); render(); return; }
  if (c.startsWith('erp-hr:')) {
    const [, act, sid] = a.split(':'); const s = staffAll().find(x => x.id === sid); if (!s || s.protected) return;
    const today = new Date().toISOString().slice(0, 10);
    if (act === 'promote' || act === 'demote') {
      const i = ROLES.indexOf(s.role); const ni = act === 'promote' ? Math.min(ROLES.length - 1, i + 1) : Math.max(0, i - 1);
      if (ni === i) return toast(s.role + ' is already ' + (act === 'promote' ? 'the highest' : 'the lowest') + ' role.');
      acct().hrEvents.unshift({ id: 'HR-' + Date.now(), staffId: s.id, staffName: s.name, type: act === 'promote' ? 'promotion' : 'demotion', fromRole: s.role, toRole: ROLES[ni], date: today });
      s.role = ROLES[ni]; save(); toast(s.name + ' ' + (act === 'promote' ? 'promoted' : 'demoted') + ' to ' + s.role + '.'); render(); return;
    }
    if (act === 'suspend' || act === 'activate') { s.status = act === 'suspend' ? 'suspended' : 'active'; acct().hrEvents.unshift({ id: 'HR-' + Date.now(), staffId: s.id, staffName: s.name, type: act === 'suspend' ? 'expulsion' : 'activation', date: today }); save(); toast(s.name + (act === 'suspend' ? ' suspended.' : ' reactivated.')); render(); return; }
  }

  // --- import / export ---
  if (c === 'io-exp') { const [, ent, fmt] = a.split(':'); doExport(ent, fmt); return; }
  if (c === 'io-imp') { const ent = v; doImport(ent); return; }
});

document.addEventListener('submit', e => {
  const form = e.target;
  if (form.id === 'usr-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (v.id) { const x = clientProfiles().find(c => c.id === v.id); if (x) Object.assign(x, { name: v.name, phone: v.phone, email: v.email, status: v.status, note: v.note }); toast('Client updated.'); }
    else { clientProfiles().push({ id: 'cli' + Date.now(), name: v.name, phone: v.phone, email: v.email, status: v.status, note: v.note, createdAt: new Date().toISOString().slice(0, 10) }); toast('Client added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'stf-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (v.id) { const x = staffAll().find(s => s.id === v.id); if (x) { Object.assign(x, { name: v.name, username: v.username, email: v.email.toLowerCase(), role: v.role, status: v.status, salary: Number(v.salary) || 0 }); if (v.password) x.password = v.password; } toast('Staff updated.'); }
    else { staffAll().push({ id: 'staff' + Date.now(), username: v.username, name: v.name, email: v.email.toLowerCase(), password: v.password, role: v.role, permissions: [], protected: false, status: v.status, salary: Number(v.salary) || 0, createdAt: new Date().toISOString().slice(0, 10) }); toast('Staff added — assign permissions from the Perms button.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'stf-perms-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form)); const fd = new FormData(form);
    const s = staffAll().find(x => x.id === v.id); if (!s || s.protected) return;
    s.permissions = fd.getAll('perm'); save(); toast('Permissions saved for ' + s.name + '.'); closeModal(); render(); return;
  }
  if (form.id === 'erp-tx-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    acct().transactions.push({ id: 'TX-' + Date.now().toString().slice(-6), type: v.type, category: v.category, amount: Number(v.amount) || 0, date: v.date, description: v.description || '', branch: v.branch || '' });
    db.notifications.unshift((v.type === 'income' ? 'Income' : 'Expense') + ' recorded: ' + money(v.amount) + ' — ' + (v.description || v.category));
    save(); toast(v.type === 'income' ? 'Income recorded.' : 'Expense recorded.'); closeModal(); render(); return;
  }
  if (form.id === 'erp-petty-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    acct().pettyCash.push({ id: 'PC-' + Date.now().toString().slice(-6), date: v.date, description: v.description, receivedBy: v.receivedBy || '', amount: Number(v.amount) || 0 });
    save(); toast('Petty cash voucher saved.'); closeModal(); render(); return;
  }
  if (form.id === 'erp-opening') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    acct().openingBalance = Number(v.opening) || 0; save(); toast('Opening balance updated.'); render(); return;
  }
  if (form.id === 'ai-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form)); const q = (v.q || '').trim(); if (!q) return;
    aiLog.push({ q, a: aiAnswer(q) }); save(); render();
    const log = document.getElementById('ai-log'); if (log) log.scrollTop = log.scrollHeight;
    return;
  }
});

// ---------- Payslip PDF ----------
async function payslipPDF(p) {
  await loadPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16); doc.text("The Gent's Barber & Gents Salon", 14, 18);
  doc.setFontSize(11); doc.text('PAYSLIP — ' + p.month, 14, 26);
  doc.setFontSize(10);
  doc.text('Employee: ' + p.name + '  |  Role: ' + p.role + '  |  ID: ' + p.staffId, 14, 34);
  doc.text('Status: ' + p.status.toUpperCase(), 14, 40);
  doc.autoTable({
    startY: 48,
    head: [['Earnings', 'Amount (USD)'], ['Deductions', 'Amount (USD)']],
    body: [['Basic Salary', p.gross.toFixed(2)], ['Statutory / Other', (p.deductions || 0).toFixed(2)]],
    styles: { fontSize: 10 }, headStyles: { fillColor: [60, 45, 20] }
  });
  doc.setFontSize(12); doc.text('NET PAY: $' + Number(p.net).toFixed(2), 14, doc.lastAutoTable.finalY + 12);
  doc.setFontSize(8); doc.text('Generated ' + new Date().toLocaleString('en-ZW') + ' — system-generated document', 14, doc.lastAutoTable.finalY + 20);
  doc.save('Payslip-' + p.id + '.pdf');
  toast('Payslip PDF downloaded.');
}
