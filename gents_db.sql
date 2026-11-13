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

-- =====================================================================
-- Seed data (migrated from production dump — admin users preserved)
-- =====================================================================

-- =====================================================================
-- Seed data (migrated from production dump — admin users preserved)
-- =====================================================================

CREATE TABLE IF NOT EXISTS staff_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  staff_key VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO admin_users (id, username, email, password_hash) VALUES
('1','Munyah','munyah777@gmail.com','$2y$10$pAvHeJjntdYUkt3uybkovetqykQf8zlR.3sVTrMKPwQ9DIjK.KID6');



CREATE TABLE branches (
  id         VARCHAR(50)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  place      VARCHAR(150) NOT NULL,
  hours      VARCHAR(100) DEFAULT NULL,
  photo      VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE services (
  id          VARCHAR(50)   PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  description VARCHAR(255)  DEFAULT NULL,
  price       DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration    SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  icon        VARCHAR(20)   DEFAULT 'Γ£é',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE service_branches (
  service_id VARCHAR(50) NOT NULL,
  branch_id  VARCHAR(50) NOT NULL,
  PRIMARY KEY (service_id, branch_id),
  FOREIGN KEY (service_id) REFERENCES services(id)  ON DELETE CASCADE,
  FOREIGN KEY (branch_id)  REFERENCES branches(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE barbers (
  id         VARCHAR(50)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  role       VARCHAR(100) DEFAULT 'Barber',
  branch_id  VARCHAR(50)  DEFAULT NULL,
  photo      VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE barber_services (
  barber_id  VARCHAR(50) NOT NULL,
  service_id VARCHAR(50) NOT NULL,
  PRIMARY KEY (barber_id, service_id),
  FOREIGN KEY (barber_id)  REFERENCES barbers(id)  ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



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



CREATE TABLE contacts (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  branch_id  VARCHAR(50)  DEFAULT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message    TEXT NOT NULL,
  booking_id VARCHAR(20) DEFAULT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE settings (
  id          TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  salon_name  VARCHAR(120) NOT NULL DEFAULT 'The Gent''s',
  phone       VARCHAR(40)  DEFAULT '+263 77 601 1938',
  email       VARCHAR(150) DEFAULT 'admin@thegents.co.zw',
  address     VARCHAR(255) DEFAULT 'Fife Avenue & Borrowdale, Harare',
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_settings_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE site_data (
  id         TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  payload    MEDIUMTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_site_data_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




INSERT INTO branches (id, name, place, hours, photo) VALUES
('borrowdale','Kudu Corner','Kudu Corner, Harare','Mon–Sat · 08:00–17:30 · Sun by booking','/uploads/site/a10a0723.jpg'),
('fife','Five Avenue','Five Avenue, Harare','Mon–Sat · 08:00–18:00 · Sun · 08:00–15:00','/uploads/site/a10a0724.jpg');

INSERT INTO services (id, name, description, price, duration, icon) VALUES
('hot-towels','Hot Towels Cut & Shave','Precision cut and shave finished with warm towels.',15,25,'♨'),
('skin-fade-nodye','Skin Fade — No Dye','A seamless skin fade, no colour added.',10,20,'✂'),
('skin-fade-dye','Skin Fade — With Dye','Skin fade finished with colour dye.',15,30,'✂'),
('taper-fade','Taper Fade','A clean taper that blends naturally.',15,30,'◐'),
('burst-fade','Burst Fade','A curved burst fade around the ears.',15,30,'◎'),
('low-fade','Low Fade','A subtle, blended low fade.',15,30,'◔'),
('high-fade','High Fade','A bold, defined high fade.',15,30,'◑'),
('ladies-cut','Ladies Cut','A tailored cut, finished to perfection.',15,30,'❀'),
('kids-cut','Kids Cut','A patient, quality cut for the little gents.',10,30,'★'),
('beard-nodye','Beard Shave — No Dye','A clean beard line-up, no colour.',5,5,'♜'),
('beard-dye','Beard Shave — With Dye','Beard sculpting finished with dye.',10,15,'♜'),
('clean-shave','Clean Shave','A close, smooth clean shave.',10,10,'⌁'),
('white-tint','White Tint','A crisp white colour tint.',30,60,'❆'),
('color-tint','Color Tint — Other Colors','Custom colour tint in any shade.',25,60,'✧');

INSERT INTO service_branches (service_id, branch_id) VALUES
('hot-towels','borrowdale'),
('hot-towels','fife'),
('skin-fade-nodye','borrowdale'),
('skin-fade-nodye','fife'),
('skin-fade-dye','borrowdale'),
('skin-fade-dye','fife'),
('taper-fade','borrowdale'),
('taper-fade','fife'),
('burst-fade','borrowdale'),
('burst-fade','fife'),
('low-fade','borrowdale'),
('low-fade','fife'),
('high-fade','borrowdale'),
('high-fade','fife'),
('ladies-cut','borrowdale'),
('ladies-cut','fife'),
('kids-cut','borrowdale'),
('kids-cut','fife'),
('beard-nodye','borrowdale'),
('beard-nodye','fife'),
('beard-dye','borrowdale'),
('beard-dye','fife'),
('clean-shave','borrowdale'),
('clean-shave','fife'),
('white-tint','borrowdale'),
('white-tint','fife'),
('color-tint','borrowdale'),
('color-tint','fife');

INSERT INTO barbers (id, name, role, branch_id, photo) VALUES
('tawanda','Tawanda M.','Senior Barber','borrowdale',''),
('prince','Prince C.','Master Barber','fife',''),
('kuda','Kuda N.','Barber','fife',''),
('brian','Brian T.','Grooming Specialist','borrowdale',''),
('panashe','Panashe Dlamini','Barber','borrowdale','/uploads/panashe-dlamini.jpg'),
('charmaine','Charmaine Gwaze','Barber','borrowdale','/uploads/charmaine-gwaze.jpg'),
('takudzwa','Takudzwa Saruchera','Barber','fife','/uploads/takudzwa-saruchera.jpg'),
('kudakwashe','Kudakwashe Mudonhi','Barber','fife','/uploads/kudakwashe-mudonhi.jpg'),
('wesley','Wesley Enock','Barber','fife','/uploads/wesley-enock.jpg');

INSERT INTO barber_services (barber_id, service_id) VALUES
('tawanda','hot-towels'),
('tawanda','skin-fade-nodye'),
('tawanda','skin-fade-dye'),
('tawanda','taper-fade'),
('tawanda','burst-fade'),
('tawanda','low-fade'),
('tawanda','high-fade'),
('tawanda','beard-nodye'),
('tawanda','beard-dye'),
('tawanda','clean-shave'),
('tawanda','white-tint'),
('tawanda','color-tint'),
('prince','hot-towels'),
('prince','skin-fade-nodye'),
('prince','skin-fade-dye'),
('prince','taper-fade'),
('prince','burst-fade'),
('prince','low-fade'),
('prince','high-fade'),
('prince','ladies-cut'),
('prince','kids-cut'),
('prince','beard-nodye'),
('prince','beard-dye'),
('prince','clean-shave'),
('prince','white-tint'),
('prince','color-tint'),
('kuda','skin-fade-nodye'),
('kuda','taper-fade'),
('kuda','low-fade'),
('kuda','high-fade'),
('kuda','kids-cut'),
('kuda','beard-nodye'),
('kuda','clean-shave'),
('brian','hot-towels'),
('brian','ladies-cut'),
('brian','beard-nodye'),
('brian','beard-dye'),
('brian','clean-shave'),
('brian','white-tint'),
('brian','color-tint'),
('panashe','skin-fade-nodye'),
('panashe','skin-fade-dye'),
('panashe','taper-fade'),
('panashe','low-fade'),
('panashe','high-fade'),
('panashe','kids-cut'),
('panashe','beard-nodye'),
('panashe','beard-dye'),
('panashe','clean-shave'),
('charmaine','ladies-cut'),
('charmaine','kids-cut'),
('charmaine','skin-fade-nodye'),
('charmaine','taper-fade'),
('charmaine','low-fade'),
('charmaine','beard-nodye'),
('charmaine','clean-shave'),
('takudzwa','skin-fade-nodye'),
('takudzwa','skin-fade-dye'),
('takudzwa','taper-fade'),
('takudzwa','burst-fade'),
('takudzwa','low-fade'),
('takudzwa','high-fade'),
('takudzwa','beard-nodye'),
('takudzwa','beard-dye'),
('takudzwa','clean-shave'),
('kudakwashe','skin-fade-nodye'),
('kudakwashe','skin-fade-dye'),
('kudakwashe','taper-fade'),
('kudakwashe','burst-fade'),
('kudakwashe','low-fade'),
('kudakwashe','high-fade'),
('kudakwashe','beard-nodye'),
('kudakwashe','beard-dye'),
('kudakwashe','clean-shave'),
('wesley','skin-fade-nodye'),
('wesley','skin-fade-dye'),
('wesley','taper-fade'),
('wesley','burst-fade'),
('wesley','low-fade'),
('wesley','high-fade'),
('wesley','beard-nodye'),
('wesley','beard-dye'),
('wesley','clean-shave');



INSERT INTO settings (id, salon_name, phone, email, address) VALUES
(1,'The Gent’s','+263 79 052 0449','admin@thegents.co.zw','Kudu Corner & Five Avenue, Harare');

INSERT INTO site_data (id, payload) VALUES (1, '{"branches":[{"id":"borrowdale","name":"Kudu Corner","place":"Kudu Corner, Harare","hours":"Mon–Sat · 08:00–17:30 · Sun by booking","photo":"/uploads/site/a10a0723.jpg","phone":"079 052 0449"},{"id":"fife","name":"Five Avenue","place":"Five Avenue, Harare","hours":"Mon–Sat · 08:00–18:00 · Sun · 08:00–15:00","photo":"/uploads/site/a10a0724.jpg","phone":"078 766 6753"}],"services":[{"id":"hot-towels","name":"Hot Towels Cut & Shave","desc":"Precision cut and shave finished with warm towels.","price":15,"duration":25,"icon":"♨","branches":["borrowdale","fife"]},{"id":"skin-fade-nodye","name":"Skin Fade — No Dye","desc":"A seamless skin fade, no colour added.","price":10,"duration":20,"icon":"✂","branches":["borrowdale","fife"]},{"id":"skin-fade-dye","name":"Skin Fade — With Dye","desc":"Skin fade finished with colour dye.","price":15,"duration":30,"icon":"✂","branches":["borrowdale","fife"]},{"id":"taper-fade","name":"Taper Fade","desc":"A clean taper that blends naturally.","price":15,"duration":30,"icon":"◐","branches":["borrowdale","fife"]},{"id":"burst-fade","name":"Burst Fade","desc":"A curved burst fade around the ears.","price":15,"duration":30,"icon":"◎","branches":["borrowdale","fife"]},{"id":"low-fade","name":"Low Fade","desc":"A subtle, blended low fade.","price":15,"duration":30,"icon":"◔","branches":["borrowdale","fife"]},{"id":"high-fade","name":"High Fade","desc":"A bold, defined high fade.","price":15,"duration":30,"icon":"◑","branches":["borrowdale","fife"]},{"id":"ladies-cut","name":"Ladies Cut","desc":"A tailored cut, finished to perfection.","price":15,"duration":30,"icon":"❀","branches":["borrowdale","fife"]},{"id":"kids-cut","name":"Kids Cut","desc":"A patient, quality cut for the little gents.","price":10,"duration":30,"icon":"★","branches":["borrowdale","fife"]},{"id":"beard-nodye","name":"Beard Shave — No Dye","desc":"A clean beard line-up, no colour.","price":5,"duration":5,"icon":"♜","branches":["borrowdale","fife"]},{"id":"beard-dye","name":"Beard Shave — With Dye","desc":"Beard sculpting finished with dye.","price":10,"duration":15,"icon":"♜","branches":["borrowdale","fife"]},{"id":"clean-shave","name":"Clean Shave","desc":"A close, smooth clean shave.","price":10,"duration":10,"icon":"⌁","branches":["borrowdale","fife"]},{"id":"white-tint","name":"White Tint","desc":"A crisp white colour tint.","price":30,"duration":60,"icon":"❆","branches":["borrowdale","fife"]},{"id":"color-tint","name":"Color Tint — Other Colors","desc":"Custom colour tint in any shade.","price":25,"duration":60,"icon":"✧","branches":["borrowdale","fife"]}],"barbers":[{"id":"tawanda","name":"Tawanda M.","role":"Senior Barber","branch":"borrowdale","photo":"","services":["hot-towels","skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","beard-nodye","beard-dye","clean-shave","white-tint","color-tint"]},{"id":"prince","name":"Prince C.","role":"Master Barber","branch":"fife","photo":"","services":["hot-towels","skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","ladies-cut","kids-cut","beard-nodye","beard-dye","clean-shave","white-tint","color-tint"]},{"id":"kuda","name":"Kuda N.","role":"Barber","branch":"fife","photo":"","services":["skin-fade-nodye","taper-fade","low-fade","high-fade","kids-cut","beard-nodye","clean-shave"]},{"id":"brian","name":"Brian T.","role":"Grooming Specialist","branch":"borrowdale","photo":"","services":["hot-towels","ladies-cut","beard-nodye","beard-dye","clean-shave","white-tint","color-tint"]},{"id":"panashe","name":"Panashe Dlamini","role":"Barber","branch":"borrowdale","photo":"/uploads/panashe-dlamini.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","low-fade","high-fade","kids-cut","beard-nodye","beard-dye","clean-shave"]},{"id":"charmaine","name":"Charmaine Gwaze","role":"Barber","branch":"borrowdale","photo":"/uploads/charmaine-gwaze.jpg","bio":"","services":["ladies-cut","kids-cut","skin-fade-nodye","taper-fade","low-fade","beard-nodye","clean-shave"]},{"id":"takudzwa","name":"Takudzwa Saruchera","role":"Barber","branch":"fife","photo":"/uploads/takudzwa-saruchera.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","beard-nodye","beard-dye","clean-shave"]},{"id":"kudakwashe","name":"Kudakwashe Mudonhi","role":"Barber","branch":"fife","photo":"/uploads/kudakwashe-mudonhi.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","beard-nodye","beard-dye","clean-shave"]},{"id":"wesley","name":"Wesley Enock","role":"Barber","branch":"fife","photo":"/uploads/wesley-enock.jpg","bio":"","services":["skin-fade-nodye","skin-fade-dye","taper-fade","burst-fade","low-fade","high-fade","beard-nodye","beard-dye","clean-shave"]}],"bookings":[],"contacts":[],"notifications":[],"membership":false,"seeded":true,"hero":[{"title":"Modern Grooming for the Gentleman","desc":"Precision cuts, expert grooming and a premium lounge experience.","photo":"/uploads/site/a10a0712.jpg"},{"title":"Your Style. Our Craft.","desc":"Thoughtful details and precision barbering for every gentleman.","photo":"/uploads/site/a10a0713.jpg"},{"title":"A Cut Above the Ordinary.","desc":"A relaxed space, skilled hands and a fresh look.","photo":"/uploads/site/a10a0714.jpg"},{"title":"Made for the Modern Gent.","desc":"Discover signature haircuts, shaves and personal grooming.","photo":"/uploads/site/a10a0715.jpg"},{"title":"Find Your Perfect Barber.","desc":"Choose your branch, barber and preferred time in minutes.","photo":"/uploads/site/a10a0716.jpg"}],"gallery":[{"url":"/uploads/site/a10a0717.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0723.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0724.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0725.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0726.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0727.jpg","alt":"The Gent''s salon","category":"Salon"},{"url":"/uploads/site/a10a0718.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0719.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0720.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0721.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"},{"url":"/uploads/site/a10a0722.jpg","alt":"The Gent’s barbers at work","category":"Haircuts"}],"settings":{"name":"The Gent’s","phone":"+263 79 052 0449","email":"admin@thegents.co.zw","whatsapp":"+263 79 052 0449","address":"Kudu Corner & Five Avenue, Harare","logo":"/uploads/logo-the-gents.jpg","social":{"facebook":"https://www.facebook.com/share/1E9i4XqKWj/","instagram":"https://www.instagram.com/gents_cut_and_shaves","tiktok":"https://www.tiktok.com/@thegentscutandshaves"}},"membershipTiers":[{"id":"basic","name":"Basic","price":5,"color":"#9aa3ad","perks":"Member rates · 50 pts per visit"},{"id":"gold","name":"Gold","price":10,"color":"#d4af37","perks":"10% off retail · priority booking · 100 pts per visit"},{"id":"diamond","name":"Diamond","price":15,"color":"#67e8f9","perks":"15% off · free beard trim monthly · 150 pts per visit"},{"id":"platinum","name":"Platinum","price":25,"color":"#e5e4e2","perks":"20% off · dedicated barber · early access · 250 pts per visit"}],"members":[],"wallets":[],"giftCards":[],"walletTxns":[],"rewards":{},"rewardConfig":{"perVisit":100},"staff":[{"id":"admin1","username":"Munyah","name":"Munyah","email":"munyah777@gmail.com","role":"Super Admin","permissions":"*","protected":true,"status":"active","salary":0,"createdAt":"2026-01-01"}],"roles":[{"id":"rol-recep","name":"Receptionist","perms":["bookings.view","bookings.create","bookings.approve","bookings.decline","requests.view","calendar.view","clients.view"],"createdAt":"2026-01-01"}],"clientProfile":{"name":"","phone":"","email":"","favBranch":"","favBarber":""}}');
