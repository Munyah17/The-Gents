-- =====================================================================
--  The Gent's — Barber & Gents Salon
--  MySQL / phpMyAdmin database schema + seed data
--
--  HOW TO IMPORT:
--    phpMyAdmin → select (or create) a database → "Import" tab →
--    choose this file → Go.
--    The file creates the database `thegents_db` itself, so you can also
--    import it from the home screen without selecting a database first.
--
--    CLI alternative:
--      mysql -u root -p < thegents_db.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS thegents_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thegents_db;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables on re-import so the file is safe to run more than once
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS barber_services;
DROP TABLE IF EXISTS service_branches;
DROP TABLE IF EXISTS barbers;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS admin_users;

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

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
--  DONE. Tables created:
--    admin_users, branches, services, service_branches,
--    barbers, barber_services, bookings, clients,
--    contacts, notifications, settings
-- =====================================================================
