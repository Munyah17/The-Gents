const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function setup(response) {
  const listeners = {}, events = [], requests = [];
  const context = {
    document: { addEventListener: (type, fn) => (listeners[type] ||= []).push(fn) },
    sessionStorage: { getItem: () => null },
    db: { staff: [], roles: [], bookings: [] }, remoteRev: 'before',
    FormData: class {
      constructor(form) { this.values = form.values; }
      *[Symbol.iterator]() { yield* Object.entries(this.values); }
      get(key) { return this.values[key] || ''; }
      getAll(key) { return key === 'perm' ? ['bookings.view'] : []; }
    },
    flushRemote: async () => { events.push('flush'); return true; },
    fetch: async (url, init) => { requests.push({ url, body: JSON.parse(init.body) }); return response; },
    adoptRemote: data => { events.push('adopt'); context.db = data; },
    closeModal: () => events.push('close'), render: () => events.push('render'),
    toast: text => events.push(text), save: () => { throw new Error('Account save must not use background save'); }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('src/erp-extra.js', 'utf8'), context);
  return { context, listeners, events, requests };
}

for (const [id, action] of [['stf-form', 'staff-save'], ['role-form', 'role-save'], ['usr-form', 'client-save']]) {
  test(`${id}: a named id control does not bypass submission; wait for acknowledgement`, async () => {
    let release;
    const data = { staff: [{ id: 'new' }], roles: [] };
    const env = setup({ ok: true, json: () => new Promise(resolve => { release = () => resolve({ ok: true, data, rev: 'after' }); }) });
    const btn = { disabled: false };
    const form = {
      // Match the browser's named-property shadowing, rather than supplying a string id.
      id: { tagName: 'INPUT', name: 'id' }, dataset: {}, values: { id: '', name: 'Example', password: 'valid-password' },
      getAttribute: key => key === 'id' ? id : null,
      querySelector: () => btn
    };
    let prevented = false;
    const promise = env.listeners.submit[0]({ target: form, preventDefault: () => { prevented = true; }, stopImmediatePropagation() {} });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(prevented, true);
    assert.equal(btn.disabled, true);
    assert(!env.events.includes('close'));
    assert.equal(env.context.db.staff.length, 0);
    assert.equal(env.requests[0].url, 'api/accounts.php');
    assert.equal(env.requests[0].body.action, action);
    release(); await promise;
    assert(env.events.includes('close'));
    assert.equal(env.context.remoteRev, 'after');
    assert.equal(btn.disabled, false);
  });
}

test('API rejection preserves entered values and the open form; no false success', async () => {
  const env = setup({ ok: false, json: async () => ({ ok: false, error: 'Email is already in use.' }) });
  const btn = { disabled: false };
  const form = { dataset: {}, values: { id: '', name: 'Keep me' }, getAttribute: () => 'stf-form', querySelector: () => btn };
  await env.listeners.submit[0]({ target: form, preventDefault() {}, stopImmediatePropagation() {} });
  assert.equal(form.values.name, 'Keep me');
  assert(!env.events.includes('close'));
  assert(!env.events.includes('adopt'));
  assert(env.events.includes('Email is already in use.'));
  assert.equal(btn.disabled, false);
});

test('all editing listeners avoid shadowable form.id', () => {
  for (const file of fs.readdirSync('src').filter(x => x.endsWith('-extra.js'))) {
    assert(!/\bform\.id\b/.test(fs.readFileSync('src/' + file, 'utf8')), file);
  }
  const app = fs.readFileSync('assets/js/app.js', 'utf8');
  assert(!app.includes("sessionStorage.setItem('gents_auth',form.dataset.role"), 'prototype login must not grant browser-only auth');
});
