-- =====================================================================
--  The Gent's — Barber & Gents Salon
--  MySQL / phpMyAdmin database schema + seed data
--
--  HOW TO IMPORT:
--    1. Create the database first (cPanel → MySQL Databases, or phpMyAdmin).
--    2. SELECT that database in phpMyAdmin's left panel.
--    3. "Import" tab → choose this file → Go.
--    Tables are created unqualified, so they land in whichever database
--    is selected — works on cPanel shared hosting where CREATE DATABASE
--    privileges are not granted to the DB user.
--
--    CLI alternative:
--      mysql -u root -p thegents_db < thegents_db.sql
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables on re-import so the file is safe to run more than once.
-- Children must drop before their parents (foreign keys).
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS barber_services;
DROP TABLE IF EXISTS service_branches;
DROP TABLE IF EXISTS barbers;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS site_data;

-- =====================================================================
--  ADMIN ACCOUNTS
--  The primary admin (id = 1) is protected by a trigger below and can
--  never be deleted.
-- =====================================================================
CREATE TABLE admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO admin_users (id, username, email, password_hash) VALUES
(1, 'Munyah', 'munyah777@gmail.com',
 '$2y$10$pAvHeJjntdYUkt3uybkovetqykQf8zlR.3sVTrMKPwQ9DIjK.KID6');
-- ^ bcrypt hash of the admin password (compatible with PHP password_verify)

-- Protect the primary admin account from deletion
DELIMITER $$
CREATE TRIGGER protect_primary_admin
BEFORE DELETE ON admin_users
FOR EACH ROW
BEGIN
  IF OLD.id = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'The primary admin account cannot be deleted.';
  END IF;
END$$
DELIMITER ;

-- =====================================================================
--  BRANCHES
-- =====================================================================
CREATE TABLE branches (
  id         VARCHAR(50)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  place      VARCHAR(150) NOT NULL,
  hours      VARCHAR(100) DEFAULT NULL,
  photo      VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO branches (id, name, place, hours, photo) VALUES
('borrowdale', 'Borrowdale',  'Borrowdale, Harare',  'Mon–Sat · 08:00–19:00',
 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80'),
('fife',      'Fife Avenue', 'Fife Avenue, Harare', 'Mon–Sat · 08:00–18:00',
 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80');

-- =====================================================================
--  SERVICES
-- =====================================================================
CREATE TABLE services (
  id          VARCHAR(50)   PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  description VARCHAR(255)  DEFAULT NULL,
  price       DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration    SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  icon        VARCHAR(20)   DEFAULT '✂',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO services (id, name, description, price, duration, icon) VALUES
('cut',     'Precision Haircut',  'A clean, refined cut tailored to your style.',        12.00, 30, '✂'),
('beard',   'Beard Grooming',     'Shape, trim and maintain a well-groomed beard.',     8.00, 20, '♜'),
('shave',   'Classic Shave',      'A close shave with a polished finish.',             10.00, 30, '⌁'),
('facial',  'Facial Treatment',   'A refreshing skin care treatment.',                 25.00, 45, '✧'),
('package', 'The Signature',      'Haircut, beard grooming and facial.',               40.00, 90, '✦');

-- Which services are offered at which branches
CREATE TABLE service_branches (
  service_id VARCHAR(50) NOT NULL,
  branch_id  VARCHAR(50) NOT NULL,
  PRIMARY KEY (service_id, branch_id),
  FOREIGN KEY (service_id) REFERENCES services(id)  ON DELETE CASCADE,
  FOREIGN KEY (branch_id)  REFERENCES branches(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO service_branches (service_id, branch_id) VALUES
('cut','borrowdale'),('cut','fife'),
('beard','borrowdale'),('beard','fife'),
('shave','borrowdale'),('shave','fife'),
('facial','borrowdale'),('facial','fife'),
('package','borrowdale'),('package','fife');

-- =====================================================================
--  BARBERS
-- =====================================================================
CREATE TABLE barbers (
  id         VARCHAR(50)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  role       VARCHAR(100) DEFAULT 'Barber',
  branch_id  VARCHAR(50)  DEFAULT NULL,
  photo      VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO barbers (id, name, role, branch_id, photo) VALUES
('tawanda', 'Tawanda M.', 'Senior Barber',        'borrowdale',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80'),
('prince',  'Prince C.',  'Master Barber',        'fife',
 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=620&q=80'),
('kuda',    'Kuda N.',    'Barber',               'fife',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=620&q=80'),
('brian',   'Brian T.',   'Grooming Specialist',  'borrowdale',
 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=620&q=80');

-- Which services each barber can perform
CREATE TABLE barber_services (
  barber_id  VARCHAR(50) NOT NULL,
  service_id VARCHAR(50) NOT NULL,
  PRIMARY KEY (barber_id, service_id),
  FOREIGN KEY (barber_id)  REFERENCES barbers(id)  ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO barber_services (barber_id, service_id) VALUES
('tawanda','cut'),('tawanda','beard'),('tawanda','shave'),('tawanda','package'),
('prince','cut'),('prince','beard'),('prince','facial'),('prince','package'),
('kuda','cut'),('kuda','beard'),('kuda','shave'),('kuda','package'),
('brian','cut'),('brian','facial'),('brian','package');

-- =====================================================================
--  BOOKINGS
-- =====================================================================
CREATE TABLE bookings (
  id             VARCHAR(20)  PRIMARY KEY,               -- e.g. GT-1042
  client_name    VARCHAR(120) NOT NULL,
  phone          VARCHAR(30)  DEFAULT NULL,
  email          VARCHAR(150) DEFAULT NULL,
  branch_id      VARCHAR(50)  NOT NULL,
  service_id     VARCHAR(50)  NOT NULL,
  barber_id      VARCHAR(50)  DEFAULT NULL,
  booking_date   DATE         NOT NULL,
  booking_time   TIME         NOT NULL,
  status         ENUM('Pending','Confirmed','Cancelled','Declined','Completed')
                 NOT NULL DEFAULT 'Pending',
  source         ENUM('Online','Walk-in') NOT NULL DEFAULT 'Online',
  notes          TEXT         DEFAULT NULL,
  client_created TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id)  REFERENCES branches(id)  ON DELETE RESTRICT,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
  FOREIGN KEY (barber_id)  REFERENCES barbers(id)  ON DELETE SET NULL,
  INDEX idx_bookings_date   (booking_date),
  INDEX idx_bookings_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO bookings
  (id, client_name, phone, email, branch_id, service_id, barber_id,
   booking_date, booking_time, status, source, client_created) VALUES
('GT-1042','T. Moyo',    '+263771234567','tmoyo@example.com',    'borrowdale','cut',    'tawanda',
 CURDATE() + INTERVAL 1 DAY,  '10:00', 'Confirmed', 'Online',  0),
('GT-1043','C. Dube',    '+263772234567','cdube@example.com',    'fife',      'beard',  'prince',
 CURDATE() + INTERVAL 2 DAY,  '11:30', 'Pending',   'Online',  0),
('GT-1044','R. Chikomo', '+263773234567','rchikomo@example.com', 'fife',      'cut',    'kuda',
 CURDATE() + INTERVAL 3 DAY,  '13:00', 'Pending',   'Online',  0),
('GT-1045','N. Sibanda', '+263774234567','nsibanda@example.com', 'borrowdale','package','brian',
 CURDATE() - INTERVAL 2 DAY,  '14:00', 'Completed', 'Walk-in', 0);

-- =====================================================================
--  CLIENTS (portal accounts)
-- =====================================================================
CREATE TABLE clients (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  phone         VARCHAR(30)  DEFAULT NULL,
  email         VARCHAR(150) DEFAULT NULL,
  password_hash VARCHAR(255) DEFAULT NULL,   -- NULL until password login is enabled
  fav_branch_id VARCHAR(50)  DEFAULT NULL,
  fav_barber_id VARCHAR(50)  DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_clients_phone (phone),
  FOREIGN KEY (fav_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  FOREIGN KEY (fav_barber_id) REFERENCES barbers(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO clients (name, phone, email) VALUES
('T. Moyo', '+263771234567', 'tmoyo@example.com');

-- =====================================================================
--  CONTACT FORM SUBMISSIONS
-- =====================================================================
CREATE TABLE contacts (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  branch_id  VARCHAR(50)  DEFAULT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
--  NOTIFICATIONS (booking confirmations / status changes)
-- =====================================================================
CREATE TABLE notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message    TEXT NOT NULL,
  booking_id VARCHAR(20) DEFAULT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO notifications (message, booking_id) VALUES
('New booking GT-1042 for Borrowdale', 'GT-1042'),
('Booking GT-1045 Completed.',         'GT-1045');

-- =====================================================================
--  SITE SETTINGS (single-row business profile)
-- =====================================================================
CREATE TABLE settings (
  id          TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  salon_name  VARCHAR(120) NOT NULL DEFAULT 'The Gent''s',
  phone       VARCHAR(40)  DEFAULT '+263 77 601 1938',
  email       VARCHAR(150) DEFAULT 'admin@thegents.co.zw',
  address     VARCHAR(255) DEFAULT 'Fife Avenue & Borrowdale, Harare',
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_settings_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO settings (id, salon_name, phone, email, address) VALUES
(1, 'The Gent''s', '+263 77 601 1938', 'admin@thegents.co.zw',
 'Fife Avenue & Borrowdale, Harare');

-- =====================================================================
--  SITE DATA (live application state)
--  The web app stores its whole state document here via api/db.php.
--  The relational tables above document the domain model; site_data is
--  the authoritative store used by the running application.
-- =====================================================================
CREATE TABLE site_data (
  id         TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  payload    MEDIUMTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_site_data_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Seed: full application state (staff, roles, members, tiers, wallets,
-- gift cards, rewards, bookings, content) captured from the live system.
INSERT INTO site_data (id, payload) VALUES (1, '{"branches":[{"id":"borrowdale","name":"Kudu Corner","place":"Kudu Corner, Harare","hours":"Mon–Sat · 08:00–17:30 · Sun by booking","photo":"/uploads/site/a10a0723.jpg","phone":"079 052 0449"},{"id":"fife","name":"Five Avenue","place":"Five Avenue, Harare","hours":"Mon–Sat · 08:00–18:00 · Sun · 08:00–15:00","photo":"/uploads/site/a10a0724.jpg","phone":"078 766 6753"}],"services":[{"id":"hot-towels","name":"Hot Towels Cut & Shave","desc":"Precision cut and shave finished with warm towels.","price":15,"duration":25,"icon":"♨","branches":["borrowdale","fife"]},{"id":"skin-fade-nodye","name":"Skin Fade — No Dye","desc":"A seamless skin fade, no colour added.","price":10,"duration":20,"icon":"✂","branches":["borrowdale","fife"]},{"id":"skin-fade-dye","name":"Skin Fade — With Dye","desc":"Skin fade finished with colour dye.","price":15,"duration":30,"icon":"✂","branches":["borrowdale","fife"]},{"id":"taper-fade","name":"Taper Fade","desc":"A clean taper that blends naturally.","price":15,"duration":30,"icon":"◐","branches":["borrowdale","fife"]},{"id":"burst-fade","name":"Burst Fade","desc":"A curved burst fade around the ears.","price":15,"duration":30,"icon":"◎","branches":["borrowdale","fife"]},{"id":"low-fade","name":"Low Fade","desc":"A subtle, blended low fade.","price":15,"duration":30,"icon":"◔","branches":["borrowdale","fife"]},{"id":"high-fade","name":"High Fade","desc":"A bold, defined high fade.","price":15,"duration":30,"icon":"◑","branches":["borrowdale","fife"]},{"id":"ladies-cut","name":"Ladies Cut","desc":"A tailored cut, finished to perfection.","price":15,"duration":30,"icon":"❀","branches":["borrowdale","fife"]},{"id":"kids-cut","name":"Kids Cut","desc":"A patient, quality cut for the little gents.","price":10,"duration":30,"icon":"★","branches":["borrowdale","fife"]},{"id":"beard-nodye","name":"Beard Shave — No Dye","desc":"A clean beard line-up, no colour.","price":5,"duration":5,"icon":"♜","branches":["borrowdale","fife"]},{"id":"beard-dye","name":"Beard Shave — With Dye","desc":"Beard sculpting finished with dye.","price":10,"duration":15,"icon":"♜","branches":["borrowdale","fife"]},{"id":"clean-shave","name":"Clean Shave","desc":"A close, smooth clean shave.","price":10,"duration":10,"icon":"⌁","branches":["borrowdale","fife"]},{"id":"white-tint","name":"White Tint","desc":"A crisp white colour tint.","price":30,"duration":60,"icon":"❆","branches":["borrowdale","fife"]},{"id":"color-tint","name":"Color Tint — Other Colors","desc":"Custom colour tint in any shade.","price":25,"duration":60,"icon":"✧","branches":["borrowdale","fife"]}],"barbers":[{"id":"tawanda","name":"Tawanda M.","role":"Senior Barber","branch":"borrowdale","photo":"","services":["skin-fade-nodye","beard-nodye","clean-shave","hot-towels"]},{"id":"prince","name":"Prince C.","role":"Master Barber","branch":"fife","photo":"","services":["skin-fade-nodye","beard-nodye","hot-towels"]},{"id":"kuda","name":"Kuda N.","role":"Barber","branch":"fife","photo":"","services":["skin-fade-nodye","beard-nodye","clean-shave","hot-towels"]},{"id":"brian","name":"Brian T.","role":"Grooming Specialist","branch":"borrowdale","photo":"","services":["skin-fade-nodye","hot-towels"]},{"id":"panashe","name":"Panashe Dlamini","role":"Barber","branch":"borrowdale","photo":"/uploads/panashe-dlamini.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","low-fade","high-fade","kids-cut","beard-nodye","beard-dye","clean-shave"]},{"id":"charmaine","name":"Charmaine Gwaze","role":"Barber","branch":"borrowdale","photo":"/uploads/charmaine-gwaze.jpg","bio":"","services":["ladies-cut","kids-cut","skin-fade-nodye","taper-fade","low-fade","beard-nodye","clean-shave"]},{"id":"takudzwa","name":"Takudzwa Saruchera","role":"Barber","branch":"fife","photo":"/uploads/takudzwa-saruchera.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","beard-nodye","beard-dye","clean-shave"]},{"id":"kudakwashe","name":"Kudakwashe Mudonhi","role":"Barber","branch":"fife","photo":"/uploads/kudakwashe-mudonhi.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","beard-nodye","beard-dye","clean-shave"]},{"id":"wesley","name":"Wesley Enock","role":"Barber","branch":"fife","photo":"/uploads/wesley-enock.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","beard-nodye","beard-dye","clean-shave"]}],"bookings":[{"id":"GT-1042","name":"T. Moyo","phone":"+263771234567","email":"tmoyo@example.com","branch":"borrowdale","service":"skin-fade-nodye","barber":"tawanda","date":"2026-11-08","time":"10:00","status":"Confirmed","source":"Online"},{"id":"GT-1043","name":"C. Dube","phone":"+263772234567","email":"cdube@example.com","branch":"fife","service":"beard-nodye","barber":"prince","date":"2026-11-09","time":"11:30","status":"Declined","source":"Online"},{"id":"GT-1044","name":"R. Chikomo","phone":"+263773234567","email":"rchikomo@example.com","branch":"fife","service":"skin-fade-nodye","barber":"kuda","date":"2026-11-10","time":"13:00","status":"Confirmed","source":"Online"},{"id":"GT-1045","name":"N. Sibanda","phone":"+263774234567","email":"nsibanda@example.com","branch":"borrowdale","service":"hot-towels","barber":"brian","date":"2026-11-05","time":"14:00","status":"Completed","source":"Walk-in"},{"id":"GT-D001","name":"Alex Demo","phone":"+263773909307","email":"demo@thegents.co.zw","branch":"borrowdale","service":"skin-fade-nodye","barber":"tawanda","date":"2026-11-10","time":"14:00","status":"Confirmed","source":"Online","clientCreated":true,"clientEmail":"demo@thegents.co.zw"},{"id":"GT-D002","name":"Alex Demo","phone":"+263773909307","email":"demo@thegents.co.zw","branch":"fife","service":"beard-nodye","barber":"prince","date":"2026-11-03","time":"11:00","status":"Completed","source":"Online","clientCreated":true,"clientEmail":"demo@thegents.co.zw"},{"branch":"fife","barber":"prince","date":"2026-11-19","time":"11:30","service":"beard-nodye","name":"Munyah Griezmann","phone":"+263773909307","email":"munyah778@gmail.com","notes":"","id":"GT-1056-30ec","status":"Confirmed","source":"Online","clientCreated":true,"clientEmail":"demo@thegents.co.zw"}],"contacts":[],"notifications":["Booking GT-1044 Confirmed. Email and WhatsApp confirmation simulated.","Booking GT-1043 Declined. Email and WhatsApp confirmation simulated.","Booking GT-1056-30ec Confirmed. Email and WhatsApp confirmation simulated.","New booking GT-1056-30ec for Fife Avenue"],"membership":false,"settings":{"name":"The Gent’s","phone":"+263 79 052 0449","email":"admin@thegents.co.zw","address":"Kudu Corner & Five Avenue, Harare","whatsapp":"+263 79 052 0449","logo":"/uploads/logo-the-gents.jpg","social":{"facebook":"https://www.facebook.com/share/1E9i4XqKWj/","instagram":"https://www.instagram.com/gents_cut_and_shaves","tiktok":"https://www.tiktok.com/@thegentscutandshaves"}},"clientProfile":{"name":"T. Moyo","phone":"+263771234567","email":"tmoyo@example.com","favBranch":"","favBarber":""},"seeded":true,"hero":[{"title":"Modern Grooming for the Gentleman","desc":"Precision cuts, expert grooming and a premium lounge experience.","photo":"/uploads/site/a10a0712.jpg"},{"title":"Your Style. Our Craft.","desc":"Thoughtful details and precision barbering for every gentleman.","photo":"/uploads/site/a10a0713.jpg"},{"title":"A Cut Above the Ordinary.","desc":"A relaxed space, skilled hands and a fresh look.","photo":"/uploads/site/a10a0714.jpg"},{"title":"Made for the Modern Gent.","desc":"Discover signature haircuts, shaves and personal grooming.","photo":"/uploads/site/a10a0715.jpg"},{"title":"Find Your Perfect Barber.","desc":"Choose your branch, barber and preferred time in minutes.","photo":"/uploads/site/a10a0716.jpg"}],"gallery":[{"url":"/uploads/site/a10a0717.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0723.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0724.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0725.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0726.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0727.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0718.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0719.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0720.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0721.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0722.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"}],"members":[{"id":"m47cff3aa","memberNo":"GT-M-0001","name":"Test Client","pseudo":"TC","profession":"","email":"client@test.com","branch":"borrowdale","tier":"basic","joined":"2026-11-08","status":"active"},{"id":"mf497a2a7","memberNo":"GT-M-0002","name":"Alex Demo","pseudo":"AD","profession":"Photographer","email":"demo@thegents.co.zw","branch":"borrowdale","tier":"gold","joined":"2026-11-08","status":"active"}],"membershipTiers":[{"id":"basic","name":"Basic","price":5,"color":"#9aa3ad","perks":"Member rates · 50 pts per visit"},{"id":"gold","name":"Gold","price":10,"color":"#d4af37","perks":"10% off retail · priority booking · 100 pts per visit"},{"id":"diamond","name":"Diamond","price":15,"color":"#67e8f9","perks":"15% off · free beard trim monthly · 150 pts per visit"},{"id":"platinum","name":"Platinum","price":25,"color":"#e5e4e2","perks":"20% off · dedicated barber · early access · 250 pts per visit"}],"giftCards":[{"id":"GC-3DEE3832","code":"GC-529514","fromEmail":"client@test.com","fromName":"Test Client","toName":"Buddy","toEmail":"buddy@test.com","amount":20,"remaining":20,"maxUses":2,"uses":0,"status":"active","created":"2026-11-08T15:36:38+00:00"},{"id":"GC-DEMO01","code":"GC-DEMO1","fromEmail":"munyah777@gmail.com","fromName":"The Gent’s","toName":"Alex Demo","toEmail":"demo@thegents.co.zw","amount":25,"remaining":25,"maxUses":2,"uses":0,"status":"active","created":"2026-11-08T15:47:36.093Z"},{"id":"GC-E3E656DA","code":"GC-ADC89844","fromEmail":"demo@thegents.co.zw","fromName":"Alex Demo","toName":"Test Pal","toEmail":"","amount":15,"remaining":15,"maxUses":1,"uses":0,"serviceId":"cut","expiresAt":"2026-12-31","status":"active","created":"2026-11-08T16:00:13+00:00"}],"walletTxns":[{"id":"TXN-83B39DFB","email":"client@test.com","amount":50,"status":"approved","created":"2026-11-08T15:34:21+00:00"},{"id":"TXN-FE002512","email":"client@test.com","amount":50,"status":"approved","created":"2026-11-08T15:36:02+00:00"},{"id":"TXN-6AC33C71","email":"client@test.com","amount":50,"status":"approved","created":"2026-11-08T15:36:38+00:00"},{"id":"TXN-EF4647CD","email":"demo@thegents.co.zw","amount":100,"status":"pending","created":"2026-11-08T15:53:17+00:00"},{"id":"TXN-1B4EFD82","email":"demo@thegents.co.zw","amount":50,"status":"pending","created":"2026-11-08T15:53:27+00:00"},{"id":"AUD-ED9D91F3","email":"demo@thegents.co.zw","kind":"giftcard","amount":-15,"balanceAfter":35,"ref":"GC-ADC89844","by":"client","status":"completed","created":"2026-11-08T16:00:13+00:00"}],"wallets":[{"email":"client@test.com","balance":129},{"email":"demo@thegents.co.zw","balance":35}],"staff":[{"id":"admin1","username":"Munyah","name":"Munyah","email":"munyah777@gmail.com","role":"Super Admin","permissions":"*","protected":true,"status":"active","salary":0,"createdAt":"2026-01-01"},{"id":"staff-test","username":"recep","name":"Test Receptionist","email":"recep@test.com","role":"Receptionist","roleId":"rol-recep","permissions":[],"protected":false,"status":"active","salary":0,"createdAt":"2026-01-01"}],"rewards":{"demo@thegents.co.zw":{"points":750,"history":[{"points":750,"reason":"Launch bonus","by":"Munyah","at":"2026-11-08T16:02:29.532Z"}],"updated":"2026-11-08T16:02:29.537Z"}},"rewardConfig":{"perVisit":100},"roles":[{"id":"rol-recep","name":"Receptionist","perms":["bookings.view","bookings.create","bookings.approve","bookings.decline","requests.view","calendar.view","clients.view"],"createdAt":"2026-01-01"}]}');

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
--  DONE. Tables created:
--    admin_users, clients, site_data  (live tables used by the app)
--    branches, services, service_branches, barbers, barber_services,
--    bookings, contacts, notifications, settings  (domain reference)
--  site_data is pre-seeded with the full application state.
-- =====================================================================
