-- ==============================================================================
-- KINGSNAME CRM Database Schema & Seed Data (MySQL 8+)
-- Tailored to ruoyi-vue-pro architecture: BaseDO, MyBatis-Plus, Spring Security
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `kingsname_crm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kingsname_crm`;

-- ------------------------------------------------------------------------------
-- 1. Table: sys_access_code (8-Digit Secure Access Codes)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `sys_access_code`;
CREATE TABLE `sys_access_code` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `code` VARCHAR(8) NOT NULL COMMENT '8-digit secure digital code',
  `user_id` BIGINT NOT NULL COMMENT 'Linked employee / user ID',
  `user_name` VARCHAR(64) NOT NULL COMMENT 'Employee name / designation',
  `role_code` VARCHAR(32) NOT NULL DEFAULT 'consultant' COMMENT 'Role: admin, consultant, tailor, manager',
  `valid_type` TINYINT NOT NULL DEFAULT 1 COMMENT '1 = Shift (8-12h), 2 = 1 Day (24h), 3 = Permanent',
  `expire_time` DATETIME NULL COMMENT 'Expiration datetime (NULL for permanent)',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0 = Active, 1 = Revoked/Deactivated, 2 = Locked',
  `failed_attempts` INT NOT NULL DEFAULT 0 COMMENT 'Failed attempts counter',
  `locked_until` DATETIME NULL COMMENT 'Locked timestamp if failed_attempts >= 3',
  `creator` VARCHAR(64) DEFAULT '' COMMENT 'Creator username/code',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
  `updater` VARCHAR(64) DEFAULT '' COMMENT 'Updater username/code',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
  `deleted` BIT(1) NOT NULL DEFAULT b'0' COMMENT 'Soft delete flag',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code_active` (`code`, `deleted`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='8-digit access codes table for KINGSNAME CRM';

-- ------------------------------------------------------------------------------
-- 2. Table: sys_login_log (Access Code Authentication Audit Trail)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `code` VARCHAR(8) NOT NULL COMMENT '8-digit code attempted',
  `user_name` VARCHAR(64) DEFAULT '' COMMENT 'Employee name if recognized',
  `role_code` VARCHAR(32) DEFAULT '' COMMENT 'Role identified',
  `ip` VARCHAR(64) NOT NULL COMMENT 'Client IP address',
  `user_agent` VARCHAR(256) DEFAULT '' COMMENT 'Browser / Client User Agent',
  `result_status` TINYINT NOT NULL COMMENT '1 = Success, 0 = Failed, 2 = Blocked/RateLimited',
  `result_msg` VARCHAR(256) DEFAULT '' COMMENT 'Authentication message or failure reason',
  `login_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Login attempt timestamp',
  PRIMARY KEY (`id`),
  KEY `idx_login_time` (`login_time`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Access code authentication audit logs';

-- ------------------------------------------------------------------------------
-- 3. Table: kings_client (VIP Clients of KINGSNAME)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `kings_client`;
CREATE TABLE `kings_client` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` VARCHAR(128) NOT NULL COMMENT 'Client Full Name',
  `phone` VARCHAR(32) NOT NULL COMMENT 'Contact phone number',
  `city` VARCHAR(64) NOT NULL DEFAULT 'Грозный' COMMENT 'City: Грозный, Махачкала, Москва, Дубай, etc.',
  `instagram` VARCHAR(64) DEFAULT '' COMMENT 'Instagram handle (e.g. @abubakar_k)',
  `vip_level` TINYINT NOT NULL DEFAULT 1 COMMENT '1 = Classic VIP, 2 = Gold VIP, 3 = Bespoke Club Elite',
  `total_spent` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Cumulative total spent in rubles',
  `notes` TEXT COMMENT 'Personal style preferences, tailoring nuances',
  `creator` VARCHAR(64) DEFAULT '' COMMENT 'Creator',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
  `updater` VARCHAR(64) DEFAULT '' COMMENT 'Updater',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
  `deleted` BIT(1) NOT NULL DEFAULT b'0' COMMENT 'Soft delete flag',
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='KINGSNAME VIP Clients Directory';

-- ------------------------------------------------------------------------------
-- 4. Table: kings_order (Orders, Bespoke Measurements & 6-Stage Funnel)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `kings_order`;
CREATE TABLE `kings_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `order_no` VARCHAR(32) NOT NULL COMMENT 'Order Number (e.g. KN-202609-001)',
  `client_id` BIGINT NOT NULL COMMENT 'Client ID reference',
  `client_name` VARCHAR(128) NOT NULL COMMENT 'Client Full Name at time of order',
  `client_phone` VARCHAR(32) NOT NULL COMMENT 'Client phone number',
  `channel` VARCHAR(32) NOT NULL DEFAULT 'INSTAGRAM' COMMENT 'INSTAGRAM (@kingsname), WEBSITE (kingsname.store), SALON_GROZNY, PHONE',
  `product_type` VARCHAR(64) NOT NULL COMMENT 'Костюм-тройка, Костюм-двойка, Смокинг, Пальто, Сорочка, Обувь',
  `order_type` VARCHAR(16) NOT NULL DEFAULT 'BESPOKE' COMMENT 'BESPOKE (индивидуальный пошив) or RTW (готовый размер)',
  `status` VARCHAR(32) NOT NULL DEFAULT 'LEAD' COMMENT 'LEAD, APPOINTMENT, FITTING, PAYMENT_AGREED, TAILORING, DELIVERED, CANCELLED',
  
  -- Anatomical Bespoke Measurements
  `height` INT DEFAULT NULL COMMENT 'Height (cm)',
  `chest` DECIMAL(5, 1) DEFAULT NULL COMMENT 'Chest circumference (cm)',
  `waist` DECIMAL(5, 1) DEFAULT NULL COMMENT 'Waist circumference (cm)',
  `hips` DECIMAL(5, 1) DEFAULT NULL COMMENT 'Hips circumference (cm)',
  `shoulder_width` DECIMAL(5, 1) DEFAULT NULL COMMENT 'Shoulder width (cm)',
  `sleeve_length` DECIMAL(5, 1) DEFAULT NULL COMMENT 'Sleeve length (cm)',
  `trouser_length` DECIMAL(5, 1) DEFAULT NULL COMMENT 'Trouser outseam length (cm)',
  
  -- Suit Tailoring Specifications
  `fabric_brand` VARCHAR(64) DEFAULT 'Loro Piana' COMMENT 'Fabric brand: Loro Piana, Vitale Barberis Canonico, Scabal, Cerruti',
  `fabric_sku` VARCHAR(64) DEFAULT '' COMMENT 'Fabric code / article name',
  `fabric_color` VARCHAR(32) DEFAULT 'Royal Navy' COMMENT 'Color: Royal Navy, Charcoal Grey, Black Tie, Твидовая клетка',
  `lapel_type` VARCHAR(32) DEFAULT 'Notch' COMMENT 'Notch (прямой), Peak (заостренный), Shawl (шалевый)',
  `fit_type` VARCHAR(32) DEFAULT 'Slim Fit' COMMENT 'Slim Fit, Regular Classic, Bespoke Silhouette',
  `monogram` VARCHAR(32) DEFAULT '' COMMENT 'Personalized client monogram (e.g. K.A.M.)',
  `button_type` VARCHAR(32) DEFAULT 'Natural Horn' COMMENT 'Natural Horn (рог), Mother of Pearl (перламутр), Corozo',
  `tailor_notes` TEXT COMMENT 'Tailor craft notes, collar posture, alterations',
  
  -- Financials
  `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Total order price in rubles',
  `deposit_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Paid deposit amount',
  `balance_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Remaining balance to pay',
  `payment_method` VARCHAR(32) DEFAULT 'Наличные' COMMENT 'Наличные, Карта, Банковский перевод, СПБ',
  `payment_status` VARCHAR(32) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, PARTIAL, PAID',
  
  -- Appointment / Delivery Timelines
  `appointment_date` DATETIME DEFAULT NULL COMMENT 'Scheduled salon fitting appointment',
  `target_completion_date` DATE DEFAULT NULL COMMENT 'Expected tailoring readiness date',
  `delivery_date` DATETIME DEFAULT NULL COMMENT 'Actual delivery/pickup timestamp',
  
  `creator` VARCHAR(64) DEFAULT '' COMMENT 'Creator',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
  `updater` VARCHAR(64) DEFAULT '' COMMENT 'Updater',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
  `deleted` BIT(1) NOT NULL DEFAULT b'0' COMMENT 'Soft delete flag',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`, `deleted`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_status` (`status`),
  KEY `idx_channel` (`channel`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='KINGSNAME Orders and Bespoke Tailoring Funnel';

-- ------------------------------------------------------------------------------
-- 5. Table: kings_inventory (Sartorial Stock Matrix & Premium Fabrics)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `kings_inventory`;
CREATE TABLE `kings_inventory` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `item_type` VARCHAR(32) NOT NULL COMMENT 'SUIT, JACKET, TROUSERS, SHIRT, FABRIC, ACCESSORY',
  `sku` VARCHAR(64) NOT NULL COMMENT 'Stock Keeping Unit identifier',
  `name` VARCHAR(128) NOT NULL COMMENT 'Product name in Russian',
  `size` VARCHAR(16) DEFAULT NULL COMMENT '46, 48, 50, 52, 54, 56, 58, 60, 62',
  `height_category` VARCHAR(16) DEFAULT NULL COMMENT '170-176, 176-182, 182-188, 188+',
  `color` VARCHAR(32) NOT NULL COMMENT 'Color description',
  `stock_quantity` INT NOT NULL DEFAULT 0 COMMENT 'Current available count or fabric meters',
  `unit` VARCHAR(16) NOT NULL DEFAULT 'шт' COMMENT 'шт, метр, компл.',
  `min_threshold` INT NOT NULL DEFAULT 2 COMMENT 'Low stock alert threshold',
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Retail price in rubles',
  `creator` VARCHAR(64) DEFAULT '' COMMENT 'Creator',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
  `updater` VARCHAR(64) DEFAULT '' COMMENT 'Updater',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
  `deleted` BIT(1) NOT NULL DEFAULT b'0' COMMENT 'Soft delete flag',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sku` (`sku`, `deleted`),
  KEY `idx_item_type` (`item_type`),
  KEY `idx_size` (`size`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='KINGSNAME Suits & Fabrics Warehouse Inventory';

-- ==============================================================================
-- INITIAL SEED DATA (KINGSNAME LUXURY BESPOKE DATASET)
-- ==============================================================================

-- 1. Seed Access Codes
-- Master code: 88888888 (Permanent Administrator access)
INSERT INTO `sys_access_code` (`code`, `user_id`, `user_name`, `role_code`, `valid_type`, `expire_time`, `status`, `creator`)
VALUES 
('88888888', 1, 'Шеф-Администратор KINGSNAME', 'admin', 3, NULL, 0, 'SYSTEM'),
('12345678', 2, 'Мансур (Консультант салона)', 'consultant', 1, DATE_ADD(NOW(), INTERVAL 12 HOUR), 0, '88888888'),
('55555555', 3, 'Мастер-портной Адам', 'tailor', 2, DATE_ADD(NOW(), INTERVAL 24 HOUR), 0, '88888888'),
('77777777', 4, 'Залина (Менеджер сайта и Instagram)', 'manager', 3, NULL, 0, '88888888');

-- 2. Seed Clients
INSERT INTO `kings_client` (`id`, `name`, `phone`, `city`, `instagram`, `vip_level`, `total_spent`, `notes`)
VALUES
(1, 'Абубакар Кадыров', '+7 (928) 001-95-95', 'Грозный', '@abubakar_k', 3, 420000.00, 'Предпочитает шерсть Loro Piana Super 150s, приталенный силуэт Slim Fit, монограмма на подкладке.'),
(2, 'Магомед Даудов', '+7 (928) 111-22-33', 'Махачкала', '@magomed_d', 2, 235000.00, 'Классический крой Regular, пиджаки с широким заостренным лацканом Peak Lapel.'),
(3, 'Тимур Эдилов', '+7 (928) 222-33-44', 'Грозный', '@timur_e', 1, 95000.00, 'Заказчик смокинга Black Tie для торжественного мероприятия.'),
(4, 'Хамзат Батаев', '+7 (928) 333-44-55', 'Москва', '@khamzat_b', 2, 185000.00, 'Регулярные заказы сорочек ручной работы и пальто из кашемира.'),
(5, 'Ислам Юсупов', '+7 (928) 444-55-66', 'Дубай', '@islam_y', 3, 560000.00, 'Индивидуальный пошив костюмов-троек Scabal, шелковые подкладки с золотой нитью.');

-- 3. Seed Orders (Demonstrating all 6 funnel stages)
INSERT INTO `kings_order` 
(`id`, `order_no`, `client_id`, `client_name`, `client_phone`, `channel`, `product_type`, `order_type`, `status`, 
 `height`, `chest`, `waist`, `hips`, `shoulder_width`, `sleeve_length`, `trouser_length`, 
 `fabric_brand`, `fabric_sku`, `fabric_color`, `lapel_type`, `fit_type`, `monogram`, `button_type`, `tailor_notes`, 
 `total_amount`, `deposit_amount`, `balance_amount`, `payment_method`, `payment_status`, `appointment_date`, `target_completion_date`)
VALUES
-- Stage 1: LEAD (Instagram Direct lead)
(1, 'KN-202609-001', 3, 'Тимур Эдилов', '+7 (928) 222-33-44', 'INSTAGRAM', 'Смокинг Black Tie', 'BESPOKE', 'LEAD',
 182, 104.0, 88.0, 102.0, 47.5, 64.0, 106.0,
 'Vitale Barberis Canonico', 'VBC-9021', 'Black Tie', 'Shawl', 'Slim Fit', 'T.E.', 'Satin Covered', 'Запрос из Direct @kingsname на пошив смокинга к свадьбе.',
 120000.00, 0.00, 120000.00, 'Карта', 'PENDING', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY)),

-- Stage 2: APPOINTMENT (Scheduled fitting at salon)
(2, 'KN-202609-002', 4, 'Хамзат Батаев', '+7 (928) 333-44-55', 'WEBSITE', 'Пальто кашемировое', 'BESPOKE', 'APPOINTMENT',
 185, 108.0, 92.0, 105.0, 49.0, 66.0, 108.0,
 'Loro Piana', 'LP-CASHMERE-04', 'Charcoal Grey', 'Peak', 'Regular Classic', 'K.B.', 'Natural Horn', 'Запись через сайт kingsname.store. Примерка образцов кашемира в субботу.',
 180000.00, 0.00, 180000.00, 'Банковский перевод', 'PENDING', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY)),

-- Stage 3: FITTING (Measurements taken, selecting buttons and lapels)
(3, 'KN-202609-003', 2, 'Магомед Даудов', '+7 (928) 111-22-33', 'SALON_GROZNY', 'Костюм-двойка', 'BESPOKE', 'FITTING',
 178, 106.0, 94.0, 104.0, 48.0, 63.5, 102.0,
 'Scabal', 'SCABAL-ROYAL-77', 'Royal Navy', 'Peak', 'Regular Classic', 'M.D.', 'Natural Horn', 'Мерки сняты мастером Адамом. Учесть асимметрию правого плеча -0.5 см.',
 145000.00, 50000.00, 95000.00, 'Наличные', 'PARTIAL', NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY)),

-- Stage 4: PAYMENT_AGREED (Down payment paid, fabric assigned)
(4, 'KN-202609-004', 1, 'Абубакар Кадыров', '+7 (928) 001-95-95', 'SALON_GROZNY', 'Костюм-тройка', 'BESPOKE', 'PAYMENT_AGREED',
 184, 105.0, 86.0, 101.0, 47.0, 65.0, 107.0,
 'Loro Piana', 'LP-SUPER150-NAVY', 'Royal Navy', 'Notch', 'Slim Fit', 'A.K.', 'Mother of Pearl', 'Внесена предоплата 50%. Ткань отрезана со склада. Старт раскроя.',
 220000.00, 110000.00, 110000.00, 'Карта', 'PARTIAL', NOW(), DATE_ADD(NOW(), INTERVAL 8 DAY)),

-- Stage 5: TAILORING (In tailoring room, sewing in progress)
(5, 'KN-202609-005', 5, 'Ислам Юсупов', '+7 (928) 444-55-66', 'INSTAGRAM', 'Костюм-тройка с жилетом', 'BESPOKE', 'TAILORING',
 180, 102.0, 84.0, 99.0, 46.5, 63.0, 104.0,
 'Vitale Barberis Canonico', 'VBC-FLANNEL-33', 'Charcoal Grey', 'Peak', 'Bespoke Silhouette', 'I.Y.', 'Corozo', 'Сборка бортовой ткани вручную. Подготовка к промежуточной примерке.',
 195000.00, 100000.00, 95000.00, 'Банковский перевод', 'PARTIAL', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY)),

-- Stage 6: DELIVERED (Delivered and settled 100%)
(6, 'KN-202609-006', 1, 'Абубакар Кадыров', '+7 (928) 001-95-95', 'SALON_GROZNY', 'Классический пиджак RTW', 'RTW', 'DELIVERED',
 184, 105.0, 86.0, 101.0, 47.0, 65.0, 107.0,
 'Loro Piana', 'LP-RTW-JACKET', 'Твидовая клетка', 'Notch', 'Slim Fit', '', 'Natural Horn', 'Подогнан по фигуре в салоне. Выдан в фирменном чехле KINGSNAME.',
 85000.00, 85000.00, 0.00, 'Наличные', 'PAID', NOW(), NOW());

-- 4. Seed Inventory (RTW Suits & Fabrics)
INSERT INTO `kings_inventory` (`item_type`, `sku`, `name`, `size`, `height_category`, `color`, `stock_quantity`, `unit`, `min_threshold`, `price`)
VALUES
('SUIT', 'KN-SUIT-BLK-48', 'Костюм-двойка Black Sartorial', '48', '176-182', 'Черный', 4, 'шт', 2, 75000.00),
('SUIT', 'KN-SUIT-BLK-50', 'Костюм-двойка Black Sartorial', '50', '176-182', 'Черный', 1, 'шт', 2, 75000.00), -- LOW STOCK!
('SUIT', 'KN-SUIT-NAV-52', 'Костюм-тройка Royal Navy Heritage', '52', '182-188', 'Royal Navy', 5, 'шт', 2, 95000.00),
('SUIT', 'KN-SUIT-GRY-54', 'Костюм-двойка Charcoal Wool', '54', '182-188', 'Charcoal Grey', 3, 'шт', 2, 82000.00),
('SUIT', 'KN-SUIT-TWD-50', 'Костюм твидовый English Tweed', '50', '176-182', 'Твидовая клетка', 2, 'шт', 2, 89000.00),
('FABRIC', 'FAB-LP-SUPER150', 'Ткань Loro Piana Super 150s Wool', NULL, NULL, 'Royal Navy', 42, 'метр', 10, 18000.00),
('FABRIC', 'FAB-VBC-130S', 'Ткань Vitale Barberis Canonico 130s', NULL, NULL, 'Черный', 65, 'метр', 15, 12000.00),
('FABRIC', 'FAB-SCABAL-CASH', 'Ткань Scabal Кашемир 100%', NULL, NULL, 'Charcoal Grey', 18, 'метр', 8, 28000.00),
('SHIRT', 'KN-SHIRT-WHT-40', 'Сорочка ручной работы Poplin White', '50', '176-182', 'Белый', 12, 'шт', 3, 16000.00),
('ACCESSORY', 'KN-ACC-TIE-GOLD', 'Галстук шелковый KINGSNAME Gold Accent', NULL, NULL, 'Gold/Navy', 15, 'шт', 5, 8500.00);

-- 5. Seed initial login log
INSERT INTO `sys_login_log` (`code`, `user_name`, `role_code`, `ip`, `user_agent`, `result_status`, `result_msg`, `login_time`)
VALUES
('88888888', 'Шеф-Администратор KINGSNAME', 'admin', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 1, 'Успешная авторизация по мастер-коду администратора', NOW());

SET FOREIGN_KEY_CHECKS = 1;
