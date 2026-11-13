# Account and role saving repair

Deploy the rebuilt repository files together, including `api/accounts.php`, the changed PHP APIs, all generated HTML pages, and `assets/js/app.js`. Keep the existing private `api/config.php` and uploads.

**Do not re-import `gents_db.sql` on the existing site.** It drops live tables. This repair uses the existing schema and does not require a database reset.

After deployment:

1. Sign out, then sign in through `/admin` using the current administrator's email or username.
2. Create a custom role and confirm it remains after a reload.
3. Add a new administrator with a unique email/username and a password of at least six characters. Sign out and sign in as that administrator by email, then by username.
4. Add a restricted staff member, assign the custom role, and check the available menu items.
5. In User Management, add a client with a password and verify sign-in through `/login`.
6. For an older profile whose password was never saved, edit it and set a new password. Existing working passwords are retained when the password field is blank; passwords that never reached the database cannot be recovered.

Forms remain open when the database rejects a save, displaying the returned error. Profile and password writes now share one transaction. SQL credentials remain server-side and are never returned to the browser.

Regression checks: `node --test tests/forms.cjs`; PHP/MySQL integration checks: `python3 tests/accounts.py` in a disposable database with `GENTS_TEST_DB_PASSWORD` set. The GitHub Actions workflow runs both and checks generated files match the sources.
