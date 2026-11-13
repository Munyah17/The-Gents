"""Real HTTP/PHP/MySQL regression checks, only for a disposable gents_test DB."""
import http.cookiejar
import json
import os
from pathlib import Path
import subprocess
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
password = os.environ['GENTS_TEST_DB_PASSWORD']
config = ROOT / 'api/config.php'
if config.exists():
    raise RuntimeError('Refusing to replace an existing config.php')


def php(code):
    return subprocess.check_output(['php', '-r', code], text=True)


def browser():
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))


def request(client, path, data=None, expected=200, headers=None):
    req = urllib.request.Request('http://127.0.0.1:8089/api/' + path,
                                 data=None if data is None else json.dumps(data).encode(),
                                 headers={'Content-Type': 'application/json', **(headers or {})})
    try:
        response = client.open(req)
    except urllib.error.HTTPError as e:
        response = e
    result = json.load(response)
    assert response.code == expected, (path, response.code, expected, result)
    return result


def login(client, email, password='RegressionPassword1!', expected=200, action=None):
    data = {'email': email, 'password': password}
    if action:
        data['action'] = action
    return request(client, 'auth.php', data, expected)


def save(client, action, expected=200, **values):
    return request(client, 'accounts.php', {'action': action, **values}, expected)


def staff_values(**values):
    return dict(name='Test Staff', username='new.admin', email='new.admin@example.invalid',
                password='RegressionPassword1!', access='admin', status='active', **values)


server = None
try:
    config.write_text("<?php\ndefine('DB_HOST', '127.0.0.1'); define('DB_PORT', 3306);\n"
                      "define('DB_NAME', 'gents_test'); define('DB_USER', 'root');\n"
                      "define('DB_PASS', " + json.dumps(password) + ");\n")
    php("require 'api/lib.php'; ensureSchema(); "
        "db()->exec('DELETE FROM staff_users'); db()->exec('DELETE FROM clients'); "
        "$st=db()->prepare('INSERT INTO admin_users (id,username,email,password_hash) VALUES (90,?,?,?) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash)');"
        "$st->execute(['test.owner','owner@example.invalid',password_hash('RegressionPassword1!',PASSWORD_DEFAULT)]);"
        "storeData(['staff'=>[],'roles'=>[],'clientProfiles'=>[],'branches'=>[],'services'=>[],'barbers'=>[],'bookings'=>[],'notifications'=>[]]);")
    log = open('/tmp/gents-php-test.log', 'w')
    server = subprocess.Popen(['php', '-S', '127.0.0.1:8089', 'router.php'], stdout=log, stderr=log)
    guest = browser()
    for attempt in range(50):
        try:
            request(guest, 'auth.php', expected=401)
            break
        except OSError:
            time.sleep(.1)
    else:
        raise RuntimeError('PHP server did not start')
    owner = browser()
    login(owner, 'test.owner')
    save(guest, 'role-save', expected=401, name='Forbidden', perms=[])

    role = save(owner, 'role-save', name='Reception test', perms=['bookings.view'])
    rid = role['data']['roles'][0]['id']
    save(owner, 'role-save', expected=409, name='reception TEST', perms=[])
    save(owner, 'role-save', id=rid, name='Reception edited', perms=['bookings.view'])
    assert request(owner, 'db.php')['data']['roles'][0]['name'] == 'Reception edited'
    print('PASS role create/edit/reload and duplicate rejection')

    before = request(owner, 'db.php')
    created = save(owner, 'staff-save', **staff_values())
    sid = created['data']['staff'][0]['id']
    assert 'password' not in created['data']['staff'][0]
    admin = browser()
    login(admin, 'new.admin@example.invalid')
    request(admin, 'auth.php', {'action': 'logout'})
    login(admin, 'new.admin')
    login(browser(), 'new.admin', password='incorrect', expected=401)
    # A stale whole-document write cannot undo the account transaction.
    request(owner, 'db.php', before['data'], expected=409,
            headers={'X-Gents-Role': 'admin', 'X-Data-Rev': before['rev']})
    assert len(request(owner, 'db.php')['data']['staff']) == 1
    print('PASS new admin email/username login, wrong password, stale-save protection')

    invalid = staff_values(); invalid.update(username='short', email='short@example.invalid', password='123')
    save(owner, 'staff-save', expected=400, **invalid)
    duplicate = staff_values(); duplicate['username'] = 'different'
    save(owner, 'staff-save', expected=409, **duplicate)
    duplicate = staff_values(); duplicate['email'] = 'different@example.invalid'
    save(owner, 'staff-save', expected=409, **duplicate)
    assert len(request(owner, 'db.php')['data']['staff']) == 1
    # Inject a storage failure AFTER credential insertion, exercising rollback.
    php("require 'api/lib.php'; db()->exec(\"CREATE TRIGGER fail_account_save BEFORE UPDATE ON site_data FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='test rollback'\");")
    failed = staff_values(); failed.update(username='rollback', email='rollback@example.invalid')
    try:
        save(owner, 'staff-save', expected=500, **failed)
    finally:
        php("require 'api/lib.php'; db()->exec('DROP TRIGGER IF EXISTS fail_account_save');")
    assert php("require 'api/lib.php'; echo db()->query(\"SELECT COUNT(*) FROM staff_users WHERE email='rollback@example.invalid'\")->fetchColumn();") == '0'
    print('PASS validation, duplicate rejection and credential/profile transaction rollback')

    edit = staff_values(); edit.update(id=sid, email='changed@example.invalid', password='')
    save(owner, 'staff-save', **edit)
    login(browser(), 'changed@example.invalid')
    login(browser(), 'new.admin@example.invalid', expected=401)
    edit['password'] = 'ReplacementPassword1!'
    save(owner, 'staff-save', **edit)
    login(browser(), 'changed@example.invalid', expected=401)
    login(browser(), 'changed@example.invalid', password='ReplacementPassword1!')
    print('PASS email update retains password and explicit password reset replaces it')

    limited_values = staff_values(); limited_values.update(username='limited', email='limited@example.invalid', access='staff', roleId=rid)
    result = save(owner, 'staff-save', **limited_values)
    limited_id = next(s['id'] for s in result['data']['staff'] if s['username'] == 'limited')
    limited = browser(); login(limited, 'limited')
    view = request(limited, 'db.php')['data']
    assert [s['id'] for s in view['staff']] == [limited_id]
    assert view['roles'][0]['id'] == rid
    save(limited, 'role-save', expected=403, name='Forbidden', perms=['*'])
    save(limited, 'staff-save', expected=403, **staff_values())
    limited_values.update(id=limited_id, access='admin', password='')
    result = save(limited, 'staff-save', **limited_values)
    assert result['data']['staff'][0]['permissions'] != '*'
    # Existing users cannot call the legacy credential endpoint to escalate.
    request(limited, 'auth.php', {'action': 'staff-credential', 'staffKey': sid,
                                 'email': 'changed@example.invalid', 'password': 'TakeoverPassword'}, expected=403)
    limited_values.update(status='suspended', access='staff')
    save(owner, 'staff-save', **limited_values)
    request(limited, 'auth.php', expected=401)
    login(browser(), 'limited', expected=401)
    print('PASS assigned-role data, staff permissions, self-edit protection and suspension')

    client = save(owner, 'client-save', name='Created Client', email='client@example.invalid', password='ClientPassword1!', phone='123')
    cid = client['data']['clientProfiles'][0]['id']
    login(browser(), 'client@example.invalid', password='ClientPassword1!', action='client-login')
    save(owner, 'client-save', id=cid, name='Renamed Client', email='client.changed@example.invalid', password='', phone='456')
    login(browser(), 'client.changed@example.invalid', password='ClientPassword1!', action='client-login')
    login(browser(), 'client@example.invalid', password='ClientPassword1!', action='client-login', expected=401)
    save(owner, 'client-save', expected=409, name='Duplicate', email='client.changed@example.invalid', password='ClientPassword2!')
    registered = browser()
    request(registered, 'auth.php', {'action': 'client-register', 'name': 'Public Client', 'email': 'public@example.invalid', 'password': 'PublicPassword1!'})
    request(registered, 'auth.php', {'action': 'logout'})
    login(registered, 'public@example.invalid', password='PublicPassword1!', action='client-login')
    print('PASS admin-created client login, edit synchronization and public registration/login')
    print('All PHP/MySQL regression checks passed.')
finally:
    if server:
        server.terminate(); server.wait(timeout=10)
    config.unlink(missing_ok=True)
