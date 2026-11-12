// ===== The Gent's — Content & Media =====
// Injected inside app.js IIFE by _build.js. Adds the admin "Content & Media"
// tab: hero banner slides and gallery images, stored in db.hero / db.gallery
// and persisted through api/db.php like everything else.

// ---------- Shared upload helper ----------
async function ctUploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch('api/upload.php', { method: 'POST', body: fd, credentials: 'same-origin' });
  const j = await r.json().catch(() => null);
  if (!j || !j.ok) throw new Error((j && j.error) || 'Upload failed');
  return j.url;
}

function ctMediaField(label, name, value, placeholder) {
  return `<div class="form-group"><label class="form-label">${label}</label>
    <input class="field" name="${name}" value="${esc(value || '')}" placeholder="${placeholder || 'https://… or /uploads/…'}">
    <div class="ct-upload-row"><input type="file" id="ct-file-${name}" accept="image/*" data-target="${name}"><button type="button" class="btn btn-sm" data-action="ct-pick:${name}">Choose file</button><span class="small muted" id="ct-upstatus-${name}"></span></div>
    <div class="ct-preview" id="ct-preview-${name}">${value ? `<img src="${esc(value)}" alt="">` : ''}</div></div>`;
}

// ---------- Tab renderer (called by adminBody) ----------
function admContent(top) {
  return top + heroPanel() + galleryPanel();
}

// ---------- Hero banners ----------
function heroPanel() {
  const slides = db.hero && db.hero.length ? db.hero : HE;
  return `<div class="panel"><div class="panel-head"><h3>Hero Banners (${slides.length})</h3><div class="auth-actions">${hasPerm('content.manage') ? button('+ Add Slide', 'ct-hero-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <p class="muted small" style="margin-top:0">Slides appear in order on the homepage hero. The first slide shows on load.</p>
  <div class="ct-hero-list">${slides.map((s, i) => `<div class="ct-hero-item">
    <div class="ct-hero-img" style="background-image:url('${esc(s.photo || '')}')"></div>
    <div class="ct-hero-info"><strong>${esc(s.title || '(untitled)')}</strong><small class="muted">${esc(s.desc || '')}</small><small class="muted">Slide ${i + 1}</small></div>
    ${hasPerm('content.manage') ? `<div class="row-actions"><button class="btn btn-sm" data-action="ct-hero-up:${i}" ${i === 0 ? 'disabled' : ''}>↑</button><button class="btn btn-sm" data-action="ct-hero-down:${i}" ${i === slides.length - 1 ? 'disabled' : ''}>↓</button><button class="btn btn-sm" data-action="ct-hero-edit:${i}">Edit</button><button class="btn btn-sm" data-action="ct-hero-del:${i}">Del</button></div>` : ''}
  </div>`).join('')}</div></div>`;
}

function ctHeroForm(i) {
  const s = i >= 0 ? (db.hero || [])[i] : null;
  if (i >= 0 && !s) return;
  modal(i >= 0 ? 'Edit Hero Slide' : 'Add Hero Slide', `<form id="ct-hero-form"><input type="hidden" name="idx" value="${i}">
  <div class="form-group"><label class="form-label">Title</label><input class="field" required name="title" value="${esc(s ? s.title : '')}" placeholder="e.g. Made for the Modern Gent."></div>
  <div class="form-group"><label class="form-label">Subtitle / description</label><input class="field" name="desc" value="${esc(s ? s.desc : '')}"></div>
  ${ctMediaField('Banner image', 'photo', s ? s.photo : '', 'https://… or /uploads/…')}
  <button class="btn btn-gold">${i >= 0 ? 'Save Changes' : 'Add Slide'}</button></form>`);
}

// ---------- Gallery ----------
function galleryPanel() {
  const items = db.gallery && db.gallery.length ? db.gallery : GE;
  const cats = [...new Set(items.map(x => x.category).filter(Boolean))];
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Gallery (${items.length})</h3><div class="auth-actions">${hasPerm('content.manage') ? button('+ Add Image', 'ct-gal-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <p class="muted small" style="margin-top:0">Categories: ${cats.map(c => `<span class="badge status confirmed" style="margin-right:4px">${esc(c)}</span>`).join('') || '—'}</p>
  <div class="ct-gal-grid">${items.map((g, i) => `<div class="ct-gal-item">
    <img src="${esc(g.url)}" alt="${esc(g.alt || '')}" loading="lazy">
    <div class="ct-gal-info"><strong>${esc(g.alt || '(no caption)')}</strong><small class="muted">${esc(g.category || 'Uncategorised')}</small></div>
    ${hasPerm('content.manage') ? `<div class="row-actions"><button class="btn btn-sm" data-action="ct-gal-edit:${i}">Edit</button><button class="btn btn-sm" data-action="ct-gal-del:${i}">Delete</button></div>` : ''}
  </div>`).join('')}</div></div>`;
}

function ctGalleryForm(i) {
  const g = i >= 0 ? (db.gallery || [])[i] : null;
  if (i >= 0 && !g) return;
  const cats = [...new Set(((db.gallery && db.gallery.length ? db.gallery : GE).map(x => x.category).filter(Boolean)))];
  modal(i >= 0 ? 'Edit Gallery Image' : 'Add Gallery Image', `<form id="ct-gal-form"><input type="hidden" name="idx" value="${i}">
  ${ctMediaField('Image', 'url', g ? g.url : '', 'https://… or /uploads/…')}
  <div class="form-group"><label class="form-label">Caption / alt text</label><input class="field" name="alt" value="${esc(g ? g.alt : '')}" placeholder="e.g. Barbershop interior"></div>
  <div class="form-group"><label class="form-label">Category</label><input class="field" name="category" list="ct-cats" value="${esc(g ? g.category : 'Salon')}" placeholder="Salon"><datalist id="ct-cats">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist></div>
  <button class="btn btn-gold">${i >= 0 ? 'Save Changes' : 'Add Image'}</button></form>`);
}

// Where an image URL is also used (for delete warnings)
function ctInUse(url) {
  const uses = [];
  (db.barbers || []).forEach(b => { if (b.photo === url) uses.push('barber photo: ' + b.name); });
  (db.branches || []).forEach(b => { if (b.photo === url) uses.push('branch photo: ' + b.name); });
  (db.services || []).forEach(s => { if (s.image === url) uses.push('service image: ' + s.name); });
  (db.hero || []).forEach((s, i) => { if (s.photo === url) uses.push('hero slide ' + (i + 1)); });
  return uses;
}

// ---------- Events ----------
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c.startsWith('ct-') && !hasPerm('content.manage')) return toast('No permission.');
  if (c === 'ct-pick') {
    e.preventDefault();
    const inp = document.getElementById('ct-file-' + v);
    if (inp) inp.click();
    return;
  }
  if (c === 'ct-hero-add') return ctHeroForm(-1);
  if (c === 'ct-hero-edit') return ctHeroForm(Number(v));
  if (c === 'ct-hero-del') {
    const s = (db.hero || [])[Number(v)]; if (!s) return;
    if (!confirm('Delete this hero slide?')) return;
    db.hero.splice(Number(v), 1); if (!db.hero.length) db.hero = HE.map(x => ({ ...x }));
    save(); toast('Slide deleted.'); render(); return;
  }
  if (c === 'ct-hero-up' || c === 'ct-hero-down') {
    const i = Number(v), d = c === 'ct-hero-up' ? -1 : 1, j = i + d;
    if (!db.hero || j < 0 || j >= db.hero.length) return;
    [db.hero[i], db.hero[j]] = [db.hero[j], db.hero[i]];
    save(); render(); return;
  }
  if (c === 'ct-gal-add') return ctGalleryForm(-1);
  if (c === 'ct-gal-edit') return ctGalleryForm(Number(v));
  if (c === 'ct-gal-del') {
    const g = (db.gallery || [])[Number(v)]; if (!g) return;
    const uses = ctInUse(g.url);
    if (uses.length && !confirm('This image is also used as ' + uses.join(', ') + '. Delete from gallery anyway?')) return;
    if (!confirm('Delete this gallery image?')) return;
    db.gallery.splice(Number(v), 1); if (!db.gallery.length) db.gallery = GE.map(x => ({ ...x }));
    save(); toast('Image deleted.'); render(); return;
  }
});

// File chosen → upload → fill the URL field + preview
document.addEventListener('change', async e => {
  const inp = e.target;
  if (!inp.id || !inp.id.startsWith('ct-file-') || !inp.files || !inp.files[0]) return;
  const name = inp.dataset.target || inp.id.slice(8);
  const status = document.getElementById('ct-upstatus-' + name);
  const urlInput = document.querySelector(`[name="${name}"]`);
  const preview = document.getElementById('ct-preview-' + name);
  try {
    if (status) status.textContent = 'Uploading…';
    const url = await ctUploadFile(inp.files[0]);
    if (urlInput) urlInput.value = url;
    if (preview) preview.innerHTML = `<img src="${esc(url)}" alt="">`;
    if (status) status.textContent = 'Uploaded ✓';
    toast('Image uploaded.');
  } catch (err) {
    if (status) status.textContent = err.message || 'Upload failed';
    toast('Upload failed: ' + (err.message || 'server error'));
  }
});

// Live preview while typing/pasting a URL
document.addEventListener('input', e => {
  const inp = e.target;
  if (!inp.name || (inp.name !== 'photo' && inp.name !== 'url' && inp.name !== 'image')) return;
  const preview = document.getElementById('ct-preview-' + inp.name);
  if (preview) preview.innerHTML = inp.value ? `<img src="${esc(inp.value)}" alt="">` : '';
});

document.addEventListener('submit', e => {
  const form = e.target;
  if (form.id === 'ct-hero-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const item = { id: 'hero' + Date.now(), title: v.title, desc: v.desc || '', photo: v.photo || '' };
    const i = Number(v.idx);
    if (i >= 0 && db.hero && db.hero[i]) { const old = db.hero[i]; item.id = old.id || item.id; db.hero[i] = item; }
    else { if (!Array.isArray(db.hero)) db.hero = []; db.hero.push(item); }
    save(); closeModal(); toast('Hero slide saved.'); render(); return;
  }
  if (form.id === 'ct-gal-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (!v.url) { toast('Image URL is required.'); return; }
    const item = { id: 'gal' + Date.now(), url: v.url, alt: v.alt || '', category: v.category || 'Salon' };
    const i = Number(v.idx);
    if (i >= 0 && db.gallery && db.gallery[i]) { const old = db.gallery[i]; item.id = old.id || item.id; db.gallery[i] = item; }
    else { if (!Array.isArray(db.gallery)) db.gallery = []; db.gallery.push(item); }
    save(); closeModal(); toast('Gallery image saved.'); render(); return;
  }
});
