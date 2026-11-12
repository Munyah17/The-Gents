// ===== The Gent's — Membership & Wallet (admin) =====
// Injected inside app.js IIFE by _build.js. Adds the admin "Membership" tab:
// tier plans, member directory, wallet balances/top-ups, gift cards.

const memTiers = () => (db.membershipTiers && db.membershipTiers.length ? db.membershipTiers : (db.membershipTiers = structuredClone(TIERS)));
const memMembers = () => db.members || (db.members = []);
const memWallets = () => { if (!Array.isArray(db.wallets)) db.wallets = Object.entries(db.wallets || {}).map(([email, x]) => ({ email, balance: (x && x.balance) || 0 })); return db.wallets; };
const memGiftCards = () => db.giftCards || (db.giftCards = []);
const memTxns = () => db.walletTxns || (db.walletTxns = []);
const tierOf = id => memTiers().find(t => t.id === id) || { name: id, color: '#9aa3ad' };
const walletOf = email => memWallets().find(w => String(w.email || '').toLowerCase() === String(email || '').toLowerCase()) || { email: String(email || '').toLowerCase(), balance: 0 };
const walletEnsure = email => { const em = String(email || '').toLowerCase(); let w = memWallets().find(x => String(x.email || '').toLowerCase() === em); if (!w) { w = { email: em, balance: 0 }; memWallets().push(w); } return w; };
const nextMemberNo = () => 'GT-M-' + String(memMembers().length + 1).padStart(4, '0');

function admMembership(top) {
  return top
    + (hasPerm('membership.tiers') ? memTiersPanel() : '')
    + (hasPerm('membership.members') || hasPerm('membership.view') ? memMembersPanel() : '')
    + (hasPerm('membership.wallets') ? memWalletPanel() : '')
    + (hasPerm('membership.giftcards') ? memGiftPanel() : '')
    + (hasPerm('membership.rewards') ? memRewardsPanel() : '');
}

// ---------- Tiers ----------
function memTiersPanel() {
  return `<div class="panel"><div class="panel-head"><h3>Membership Tiers</h3>${button('+ Add Tier', 'adm-tier-add', 'btn btn-gold btn-sm')}</div>
  <p class="muted small" style="margin-top:0">Levels members can hold. Price = monthly fee shown on the card.</p>
  <div class="table-wrap"><table><thead><tr><th>Tier</th><th>Monthly</th><th>Color</th><th>Perks</th><th></th></tr></thead><tbody>
  ${memTiers().map(t => `<tr><td><span class="mem-tier" style="--tc:${esc(t.color || '#9aa3ad')}">${esc(t.name)}</span></td><td>$${Number(t.price || 0).toFixed(2)}</td><td><span class="mem-swatch" style="background:${esc(t.color || '#9aa3ad')}"></span></td><td class="small muted">${esc(t.perks || '')}</td><td><div class="row-actions">${button('Edit', 'adm-tier-edit:' + t.id, 'btn btn-sm')}${button('Delete', 'adm-tier-del:' + t.id, 'btn btn-sm')}</div></td></tr>`).join('')}
  </tbody></table></div></div>`;
}

function admTierForm(id) {
  const t = id ? memTiers().find(x => x.id === id) : null;
  if (id && !t) return;
  modal(id ? 'Edit Tier' : 'Add Tier', `<form id="adm-tier-form"><input type="hidden" name="id" value="${esc(t ? t.id : '')}">
  <div class="form-group"><label class="form-label">Name</label><input class="field" required name="name" value="${esc(t ? t.name : '')}" placeholder="e.g. Gold"></div>
  <div class="form-group"><label class="form-label">Monthly price ($)</label><input class="field" type="number" step="0.01" min="0" required name="price" value="${t ? t.price : ''}"></div>
  <div class="form-group"><label class="form-label">Card color</label><input class="field" type="color" name="color" value="${esc(t ? t.color : '#d4af37')}"></div>
  <div class="form-group"><label class="form-label">Perks (shown on card back)</label><input class="field" name="perks" value="${esc(t ? t.perks : '')}" placeholder="e.g. 10% off retail · priority booking"></div>
  <button class="btn btn-gold">${id ? 'Save Changes' : 'Add Tier'}</button></form>`);
}

// ---------- Members ----------
function memMembersPanel() {
  const canManage = hasPerm('membership.members');
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Members (${memMembers().length})</h3><div class="auth-actions">${canManage ? button('+ Enrol Member', 'adm-mem-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Card</th><th>Member</th><th>Pseudonym</th><th>Tier</th><th>Branch</th><th>Profession</th><th>Joined</th><th>Status</th><th></th></tr></thead><tbody>
  ${memMembers().map(m => { const t = tierOf(m.tier); return `<tr>
    <td><span class="mem-no">${esc(m.memberNo || '—')}</span></td>
    <td><strong>${esc(m.name || '')}</strong><br><span class="muted small">${esc(m.email || '')}</span></td>
    <td>"${esc(m.pseudo || '')}"</td>
    <td><span class="mem-tier" style="--tc:${esc(t.color || '#9aa3ad')}">${esc(t.name || m.tier)}</span></td>
    <td>${esc(branch(m.branch).name)}</td><td>${esc(m.profession || '—')}</td><td>${esc(m.joined || '—')}</td>
    <td>${badge(m.status === 'suspended' ? 'Cancelled' : 'Confirmed')}</td>
    <td>${canManage ? `<div class="row-actions">${button('Edit', 'adm-mem-edit:' + m.id, 'btn btn-sm')}${button(m.status === 'suspended' ? 'Activate' : 'Suspend', 'adm-mem-status:' + m.id, 'btn btn-sm')}${button('Delete', 'adm-mem-del:' + m.id, 'btn btn-sm')}</div>` : ''}</td></tr>`; }).join('')}
  </tbody></table></div></div>`;
}

function admMemberForm(id) {
  const m = id ? memMembers().find(x => x.id === id) : null;
  if (id && !m) return;
  modal(id ? 'Edit Member' : 'Enrol Member', `<form id="adm-mem-form"><input type="hidden" name="id" value="${esc(m ? m.id : '')}">
  <div class="form-grid">
    <div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(m ? m.name : '')}"></div>
    <div class="form-group"><label class="form-label">Nickname / pseudonym</label><input class="field" name="pseudo" value="${esc(m ? m.pseudo : '')}" placeholder="e.g. TM"></div>
    <div class="form-group"><label class="form-label">Email (links to client account)</label><input class="field" type="email" name="email" value="${esc(m ? m.email : '')}"></div>
    <div class="form-group"><label class="form-label">Profession</label><input class="field" name="profession" value="${esc(m ? m.profession : '')}" placeholder="e.g. Engineer"></div>
    <div class="form-group"><label class="form-label">Home branch</label><select class="field" name="branch">${db.branches.map(b => `<option value="${b.id}" ${(m ? m.branch : '') === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Membership tier</label><select class="field" name="tier">${memTiers().map(t => `<option value="${t.id}" ${(m ? m.tier : 'basic') === t.id ? 'selected' : ''}>${esc(t.name)} — $${Number(t.price || 0).toFixed(2)}/mo</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Date joined</label><input class="field" type="date" name="joined" value="${esc(m ? m.joined : new Date().toISOString().slice(0, 10))}"></div>
    <div class="form-group"><label class="form-label">Status</label><select class="field" name="status"><option value="active" ${(m ? m.status : 'active') === 'active' ? 'selected' : ''}>Active</option><option value="suspended" ${(m && m.status) === 'suspended' ? 'selected' : ''}>Suspended</option></select></div>
  </div>
  <button class="btn btn-gold">${id ? 'Save Changes' : 'Enrol Member'}</button></form>`);
}

// ---------- Wallets & top-ups ----------
function memWalletPanel() {
  const pending = memTxns().filter(t => t.status === 'pending');
  const bals = memWallets().filter(w => w.email);
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Wallets & Top-ups</h3></div>
  ${pending.length ? `<h3 style="font-size:16px;margin:0 0 10px">Pending top-up requests (${pending.length})</h3>${pending.map(t => `<div class="appointment"><div><strong>$${Number(t.amount).toFixed(2)} · ${esc(t.email)}</strong><small>${esc(t.created || '').slice(0, 16).replace('T', ' ')}</small></div><div class="row-actions">${button('Approve', 'adm-txn-ok:' + t.id, 'btn btn-sm btn-gold')}${button('Decline', 'adm-txn-no:' + t.id, 'btn btn-sm')}</div></div>`).join('')}` : '<p class="muted small">No pending top-up requests.</p>'}
  <h3 style="font-size:16px;margin:18px 0 10px">Balances (${bals.length})</h3>
  <div class="table-wrap"><table><thead><tr><th>Account</th><th>Balance</th><th>Member</th><th></th></tr></thead><tbody>
  ${bals.map(w => { const email = w.email; const m = memMembers().find(x => (x.email || '').toLowerCase() === email); return `<tr><td>${esc(email)}</td><td><strong>$${Number(w.balance || 0).toFixed(2)}</strong></td><td>${m ? esc(m.name) + ' · ' + esc(tierOf(m.tier).name) : '<span class="muted">—</span>'}</td><td><div class="row-actions">${button('Adjust', 'adm-bal:' + encodeURIComponent(email), 'btn btn-sm')}</div></td></tr>`; }).join('') || '<tr><td colspan="4" class="muted">No wallet balances yet.</td></tr>'}
  </tbody></table></div></div>`;
}

// ---------- Gift cards ----------
function memGiftPanel() {
  const cards = memGiftCards();
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Gift Cards (${cards.length})</h3></div>
  <div class="table-wrap"><table><thead><tr><th>Code</th><th>From → To</th><th>Value</th><th>Remaining</th><th>Uses</th><th>Status</th><th></th></tr></thead><tbody>
  ${cards.slice().reverse().map(g => { const cons = [g.serviceId ? 'Only: ' + esc(service(g.serviceId).name) : '', g.expiresAt ? 'Exp ' + esc(g.expiresAt) : ''].filter(Boolean).join(' · '); const expired = g.expiresAt && g.expiresAt < new Date().toISOString().slice(0, 10); return `<tr>
    <td><code>${esc(g.code)}</code>${cons ? `<br><span class="muted small">${cons}</span>` : ''}</td>
    <td>${esc(g.fromName || g.fromEmail || '')} → ${esc(g.toName || g.toEmail || '—')}</td>
    <td>$${Number(g.amount || 0).toFixed(2)}</td><td><strong>$${Number(g.remaining || 0).toFixed(2)}</strong></td>
    <td>${g.uses || 0}${g.maxUses ? ' / ' + g.maxUses : ' / ∞'}</td>
    <td>${badge(expired ? 'Cancelled' : g.status === 'active' ? 'Confirmed' : g.status === 'depleted' ? 'Completed' : 'Cancelled')}${expired ? '<br><span class="muted small">expired</span>' : ''}</td>
    <td>${g.status === 'active' && !expired ? button('Redeem', 'adm-gc-redeem:' + g.code, 'btn btn-sm') : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="muted">No gift cards issued yet.</td></tr>'}
  </tbody></table></div></div>`;
}

function admGcRedeem(code) {
  const g = memGiftCards().find(x => x.code === code);
  if (!g) return;
  if (g.expiresAt && g.expiresAt < new Date().toISOString().slice(0, 10)) return toast('This gift card has expired.');
  const cons = [g.serviceId ? 'Restricted to: ' + service(g.serviceId).name : 'Any service', g.expiresAt ? 'Valid until ' + g.expiresAt : 'No expiry'].join(' · ');
  modal('Redeem ' + esc(g.code), `<p class="muted">Issued by ${esc(g.fromName || g.fromEmail)} to ${esc(g.toName || g.toEmail || 'recipient')}. Remaining: <b>$${Number(g.remaining).toFixed(2)}</b>${g.maxUses ? ' · ' + (g.maxUses - (g.uses || 0)) + ' use(s) left' : ''}.</p><p class="small" style="margin-top:-8px">${esc(cons)}</p>
  <form id="adm-gc-form"><input type="hidden" name="code" value="${esc(g.code)}">
  <div class="form-group"><label class="form-label">Amount to redeem ($)</label><input class="field" type="number" step="0.01" min="0.01" max="${g.remaining}" required name="amount" value="${Number(g.remaining).toFixed(2)}"></div>
  <p class="muted small">The recipient may redeem any service worth up to the remaining balance.</p>
  <button class="btn btn-gold">Apply Redemption</button></form>`);
}

// ---------- Client rewards ----------
const rwTier = pts => pts >= 800 ? 'Gold' : pts >= 300 ? 'Silver' : 'Bronze';
function memRewardRows() {
  const cfg = db.rewardConfig || (db.rewardConfig = { perVisit: 100 });
  const emails = new Set();
  memMembers().forEach(m => m.email && emails.add(String(m.email).toLowerCase()));
  memWallets().forEach(w => w.email && emails.add(String(w.email).toLowerCase()));
  (db.bookings || []).forEach(b => b.clientEmail && emails.add(String(b.clientEmail).toLowerCase()));
  return [...emails].map(em => {
    const m = memMembers().find(x => String(x.email || '').toLowerCase() === em);
    const done = (db.bookings || []).filter(b => String(b.clientEmail || '').toLowerCase() === em && b.status === 'Completed').length;
    const base = done * (cfg.perVisit || 100);
    const ov = (db.rewards || {})[em];
    const eff = ov && ov.points != null ? Number(ov.points) : base;
    return { em, name: m ? m.name : em, done, base, eff, ov };
  }).sort((a, b) => b.eff - a.eff);
}
function memRewardsPanel() {
  const cfg = db.rewardConfig || (db.rewardConfig = { perVisit: 100 });
  const rows = memRewardRows();
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Client Rewards</h3><div class="auth-actions">${button('Points per visit: ' + (cfg.perVisit || 100), 'adm-rw-cfg', 'btn btn-sm')}</div></div>
  <p class="muted small" style="margin-top:0">Points are earned automatically per completed visit — override any client below. Admin changes are audit-logged.</p>
  <div class="table-wrap"><table><thead><tr><th>Client</th><th>Completed</th><th>Base</th><th>Points</th><th>Tier</th><th></th></tr></thead><tbody>
  ${rows.map(r => `<tr><td><strong>${esc(r.name)}</strong><br><span class="muted small">${esc(r.em)}</span></td><td>${r.done}</td><td>${r.base}${r.ov && r.ov.points != null ? ' <span class="muted">(auto)</span>' : ''}</td><td><strong style="color:var(--gold)">${r.eff}</strong>${r.ov && r.ov.points != null ? ' <span class="badge status confirmed">adjusted</span>' : ''}</td><td>${rwTier(r.eff)}</td>
  <td><div class="row-actions">${button('+100', 'adm-rw-adj:' + encodeURIComponent(r.em) + ':100', 'btn btn-sm')}${button('−100', 'adm-rw-adj:' + encodeURIComponent(r.em) + ':-100', 'btn btn-sm')}${button('Set', 'adm-rw-set:' + encodeURIComponent(r.em), 'btn btn-sm')}${r.ov && r.ov.points != null ? button('Auto', 'adm-rw-auto:' + encodeURIComponent(r.em), 'btn btn-sm') : ''}</div></td></tr>`).join('') || '<tr><td colspan="6" class="muted">No client reward records yet.</td></tr>'}
  </tbody></table></div></div>`;
}
function rwSet(em, points, reason) {
  if (!db.rewards) db.rewards = {};
  const cur = db.rewards[em] || { points: null, history: [] };
  cur.history = cur.history || [];
  cur.history.push({ points, reason: reason || 'manual', by: (admMe() || {}).name || 'admin', at: new Date().toISOString() });
  if (cur.history.length > 50) cur.history = cur.history.slice(-50);
  cur.points = points; cur.updated = new Date().toISOString();
  db.rewards[em] = cur;
}
function admRwSet(email) {
  const em = decodeURIComponent(email);
  const row = memRewardRows().find(r => r.em === em) || { eff: 0 };
  modal('Set reward points — ' + esc(em), `<p class="muted">Current: <b>${row.eff} pts</b>${row.ov && row.ov.points != null ? ' (admin override)' : ' (auto)'}</p>
  <form id="adm-rw-form"><input type="hidden" name="email" value="${esc(em)}">
  <div class="form-group"><label class="form-label">Points</label><input class="field" type="number" required name="points" value="${row.eff}"></div>
  <div class="form-group"><label class="form-label">Reason (audit log)</label><input class="field" name="reason" placeholder="e.g. Loyalty bonus, complaint compensation"></div>
  <button class="btn btn-gold">Apply</button></form>`);
}

// ---------- Events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  const need = c.startsWith('adm-tier') ? 'membership.tiers' : c.startsWith('adm-mem') ? 'membership.members' : (c.startsWith('adm-txn') || c === 'adm-bal') ? 'membership.wallets' : c === 'adm-gc-redeem' ? 'membership.giftcards' : c.startsWith('adm-rw') ? 'membership.rewards' : null;
  if (need && !hasPerm(need)) return toast('No permission.');
  if (c === 'adm-tier-add') return admTierForm(null);
  if (c === 'adm-tier-edit') return admTierForm(v);
  if (c === 'adm-tier-del') { const t = memTiers().find(x => x.id === v); if (!t) return; if (memMembers().some(m => m.tier === v)) return toast('Tier is assigned to members — reassign them first.'); if (!confirm('Delete tier "' + t.name + '"?')) return; db.membershipTiers = memTiers().filter(x => x.id !== v); save(); toast('Tier deleted.'); render(); return; }
  if (c === 'adm-mem-add') return admMemberForm(null);
  if (c === 'adm-mem-edit') return admMemberForm(v);
  if (c === 'adm-mem-del') { const m = memMembers().find(x => x.id === v); if (!m) return; if (!confirm('Delete member ' + m.name + '?')) return; db.members = memMembers().filter(x => x.id !== v); save(); toast('Member removed.'); render(); return; }
  if (c === 'adm-mem-status') { const m = memMembers().find(x => x.id === v); if (!m) return; m.status = m.status === 'suspended' ? 'active' : 'suspended'; save(); toast(m.name + (m.status === 'active' ? ' reactivated.' : ' suspended.')); render(); return; }
  if (c === 'adm-txn-ok') {
    const t = memTxns().find(x => x.id === v); if (!t || t.status !== 'pending') return;
    const w = walletEnsure(t.email);
    w.balance = Number(w.balance || 0) + Number(t.amount);
    memTxns().push({ id: 'AUD-' + Date.now().toString(36).toUpperCase(), email: String(t.email).toLowerCase(), kind: 'topup', amount: Number(t.amount), balanceAfter: w.balance, ref: t.id, by: (admMe() || {}).name || 'admin', status: 'completed', created: new Date().toISOString() });
    t.status = 'approved'; save(); toast('Top-up approved — $' + Number(t.amount).toFixed(2) + ' credited.'); render(); return;
  }
  if (c === 'adm-txn-no') { const t = memTxns().find(x => x.id === v); if (!t) return; t.status = 'declined'; save(); toast('Top-up declined.'); render(); return; }
  if (c === 'adm-bal') { const em = decodeURIComponent(v); admBalForm(em); return; }
  if (c === 'adm-gc-redeem') return admGcRedeem(v);
  if (c === 'adm-rw-cfg') return modal('Reward settings', `<form id="adm-rwc-form"><div class="form-group"><label class="form-label">Points per completed visit</label><input class="field" type="number" min="0" required name="perVisit" value="${(db.rewardConfig || {}).perVisit ?? 100}"></div><button class="btn btn-gold">Save</button></form>`);
  if (c === 'adm-rw-set') return admRwSet(v);
  if (c === 'adm-rw-adj') { const [em, dlt] = v.split(':'); const row = memRewardRows().find(r => r.em === decodeURIComponent(em)); if (!row) return; rwSet(decodeURIComponent(em), Math.max(0, row.eff + Number(dlt)), 'adjust ' + dlt); save(); toast('Points updated.'); render(); return; }
  if (c === 'adm-rw-auto') { const em = decodeURIComponent(v); if (db.rewards && db.rewards[em]) { delete db.rewards[em].points; save(); toast('Reverted to automatic points.'); render(); } return; }
});

function admBalForm(email) {
  const w = walletOf(email);
  modal('Adjust balance — ' + esc(email), `<p class="muted">Current balance: <b>$${Number(w.balance || 0).toFixed(2)}</b></p>
  <form id="adm-bal-form"><input type="hidden" name="email" value="${esc(email)}">
  <div class="form-group"><label class="form-label">Adjustment ($, negative to deduct)</label><input class="field" type="number" step="0.01" required name="delta" placeholder="e.g. 20 or -5"></div>
  <button class="btn btn-gold">Apply</button></form>`);
}

document.addEventListener('submit', e => {
  const form = e.target;
  if (form.id === 'adm-tier-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const data = { name: v.name, price: Number(v.price) || 0, color: v.color || '#d4af37', perks: v.perks || '' };
    const i = memTiers().findIndex(x => x.id === v.id);
    if (i >= 0) Object.assign(memTiers()[i], data); else memTiers().push({ id: 'tier' + Date.now().toString(36), ...data });
    save(); closeModal(); toast('Tier saved.'); render(); return;
  }
  if (form.id === 'adm-mem-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const data = { name: v.name, pseudo: v.pseudo || '', email: (v.email || '').toLowerCase(), profession: v.profession || '', branch: v.branch, tier: v.tier, joined: v.joined || new Date().toISOString().slice(0, 10), status: v.status || 'active' };
    const i = memMembers().findIndex(x => x.id === v.id);
    if (i >= 0) Object.assign(memMembers()[i], data);
    else memMembers().push({ id: 'm' + Date.now().toString(36), memberNo: nextMemberNo(), ...data });
    save(); closeModal(); toast('Member saved.'); render(); return;
  }
  if (form.id === 'adm-gc-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const g = memGiftCards().find(x => x.code === v.code); if (!g) return;
    const amt = Math.min(Number(v.amount), Number(g.remaining));
    if (!(amt > 0)) { toast('Invalid amount.'); return; }
    g.remaining = Number(g.remaining) - amt; g.uses = (g.uses || 0) + 1;
    if (g.remaining <= 0.004 || (g.maxUses && g.uses >= g.maxUses)) g.status = 'depleted';
    save(); closeModal(); toast('Redeemed $' + amt.toFixed(2) + ' from ' + g.code + '.'); render(); return;
  }
  if (form.id === 'adm-rw-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    rwSet(String(v.email).toLowerCase(), Math.max(0, Number(v.points) || 0), v.reason || 'manual');
    save(); closeModal(); toast('Reward points updated.'); render(); return;
  }
  if (form.id === 'adm-rwc-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (!db.rewardConfig) db.rewardConfig = {};
    db.rewardConfig.perVisit = Math.max(0, Number(v.perVisit) || 0);
    save(); closeModal(); toast('Reward settings saved.'); render(); return;
  }
  if (form.id === 'adm-bal-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const w = walletEnsure(v.email);
    w.balance = Math.max(0, Number(w.balance || 0) + Number(v.delta));
    memTxns().push({ id: 'AUD-' + Date.now().toString(36).toUpperCase(), email: String(v.email).toLowerCase(), kind: 'adjust', amount: Number(v.delta), balanceAfter: w.balance, ref: '', by: (admMe() || {}).name || 'admin', status: 'completed', created: new Date().toISOString() });
    save(); closeModal(); toast('Balance updated.'); render(); return;
  }
});
