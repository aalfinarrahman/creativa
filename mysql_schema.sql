
-- SQL Schema for LPK Website (MySQL / Hostinger)
-- Import this into phpMyAdmin on Hostinger

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- 1. Table: teams (Tim Kami)
CREATE TABLE IF NOT EXISTS `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1b. Table: admins (Admin Users)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1c. Table: settings (Website Settings)
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `loginBgUrl` varchar(500) DEFAULT NULL,
  `homeHeroBgUrl` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: participants (Peserta)
CREATE TABLE IF NOT EXISTS `participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(255) NOT NULL,
  `program` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `namaLengkap` varchar(255) DEFAULT NULL,
  `noKtp` varchar(100) DEFAULT NULL,
  `noWhatsapp` varchar(50) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `usia` int(11) DEFAULT NULL,
  `kotaDomisili` varchar(255) DEFAULT NULL,
  `lokasiTinggal` varchar(50) DEFAULT NULL,
  `pendidikan` varchar(100) DEFAULT NULL,
  `jurusan` varchar(255) DEFAULT NULL,
  `statusPekerjaan` varchar(100) DEFAULT NULL,
  `pengalamanKerjaIndonesia` varchar(10) DEFAULT NULL,
  `posisiPengalamanKerja` varchar(255) DEFAULT NULL,
  `tinggiBadan` int(11) DEFAULT NULL,
  `beratBadan` int(11) DEFAULT NULL,
  `statusPernikahan` varchar(50) DEFAULT NULL,
  `kondisiMata` varchar(50) DEFAULT NULL,
  `besarMinus` varchar(100) DEFAULT NULL,
  `butaWarna` varchar(10) DEFAULT NULL,
  `bertato` varchar(10) DEFAULT NULL,
  `bertindik` varchar(10) DEFAULT NULL,
  `patahTulang` varchar(10) DEFAULT NULL,
  `kondisiTulang` varchar(50) DEFAULT NULL,
  `skoliosis` varchar(10) DEFAULT NULL,
  `cacatFisik` varchar(10) DEFAULT NULL,
  `penyakitBerat` varchar(10) DEFAULT NULL,
  `penyakitMenular` varchar(10) DEFAULT NULL,
  `sertifikatJlpt` varchar(10) DEFAULT NULL,
  `sertifikatSsw` varchar(10) DEFAULT NULL,
  `bidangSsw` varchar(255) DEFAULT NULL,
  `programMinat` varchar(100) DEFAULT NULL,
  `matchingJob` varchar(255) DEFAULT NULL,
  `remarks` longtext DEFAULT NULL,
  `kemampuanBahasa` varchar(50) DEFAULT NULL,
  `rencanaKeJepang` varchar(50) DEFAULT NULL,
  `relasiDiJepang` varchar(50) DEFAULT NULL,
  `pengalamanLuarNegeri` varchar(10) DEFAULT NULL,
  `pengalamanIlegal` varchar(10) DEFAULT NULL,
  `details` longtext DEFAULT NULL,
  `fotoUrl` longtext DEFAULT NULL,
  `cvUrl` longtext DEFAULT NULL,
  `sertifikatJlptUrl` longtext DEFAULT NULL,
  `sertifikatSswUrl` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: programs (Program)
CREATE TABLE IF NOT EXISTS `programs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'Aktif',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: gallery (Galeri)
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `image` longtext NOT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: articles (Artikel)
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `date` date DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: documents (Dokumen)
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `url` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: broadcasts (Pengumuman)
CREATE TABLE IF NOT EXISTS `broadcasts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @__col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'participants'
    AND COLUMN_NAME = 'sertifikatJlptUrl'
);
SET @__sql := IF(
  @__col_exists = 0,
  'ALTER TABLE `participants` ADD COLUMN `sertifikatJlptUrl` longtext DEFAULT NULL',
  'SELECT 1'
);
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'participants'
    AND COLUMN_NAME = 'sertifikatSswUrl'
);
SET @__sql := IF(
  @__col_exists = 0,
  'ALTER TABLE `participants` ADD COLUMN `sertifikatSswUrl` longtext DEFAULT NULL',
  'SELECT 1'
);
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

COMMIT;
