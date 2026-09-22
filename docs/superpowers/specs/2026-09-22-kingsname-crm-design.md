# KINGSNAME CRM — Technical Specification & Architecture Design

## 1. Project Overview
- **Project Name:** KINGSNAME CRM
- **Target Brand:** KINGSNAME (Grozny, Chechen Republic / North Caucasus / Russia)
- **Business Domain:** Luxury Bespoke Menswear, Haute Sartorial classic suits, tuxedos, coats, handmade shirts, and footwear.
- **Reference Architecture:** [ruoyi-vue-pro](https://github.com/YunaiV/ruoyi-vue-pro) (Spring Boot 3, MyBatis-Plus, Spring Security, Vue 3, Element Plus, Pinia, Vite).
- **Primary Design Aesthetics:** Luxury dark palette (`#0E0E10` obsidian background, `#18191E` elevated surfaces, `#C5A059` noble gold accents, `#FFFFFF` crisp text).

---

## 2. Authentication & Security Architecture

### 2.1 8-Digit Secure Access Code Model
Standard username/password login is replaced for managers and tailors with an 8-digit secure code entry, backed by an Administrator security control center.

- **Initial Access:** Default master code `88888888` generated in seed database for initial administrator login.
- **Code Lifespan Options:**
  1. `SHIFT` (8–12 hours) — for daily retail / salon shifts.
  2. `DAY` (24 hours) — for temporary staff or daily passes.
  3. `PERMANENT` — persistent employee code tied to employee ID with manual revocation capability.
- **Brute-Force & Rate-Limiting Protection:**
  - Track failed attempts per code and IP.
  - After 3 consecutive failed attempts: temporary 15-minute lock with security warning and countdown.
- **Session & Audit Logging:**
  - Every login records timestamp, client IP address, User-Agent, and role permissions in `sys_login_log`.
- **Role-Based Permissions:**
  - `admin`: Full access, KPI metrics, code generation, audit logs, order & inventory management.
  - `consultant`: Lead capture, client appointments, order creation, payments recording.
  - `tailor`: Measurements review, tailoring status updates, alteration notes, tailoring sheet printing.
  - `manager`: Online leads from Instagram (@kingsname) and website (kingsname.store), delivery tracking.

---

## 3. Data Architecture (Backend & Database)

### 3.1 Tables & Entities (ruoyi-vue-pro patterns)
All entities extend `BaseDO` (`create_time`, `update_time`, `creator`, `updater`, `deleted`):

1. **`sys_access_code`**:
   - `id`: BIGINT AUTO_INCREMENT PRIMARY KEY
   - `code`: VARCHAR(8) NOT NULL (UNIQUE index)
   - `user_id`: BIGINT NOT NULL
   - `user_name`: VARCHAR(64) NOT NULL
   - `role_code`: VARCHAR(32) NOT NULL (`admin`, `consultant`, `tailor`, `manager`)
   - `valid_type`: TINYINT NOT NULL (1 = Shift, 2 = Day, 3 = Permanent)
   - `expire_time`: DATETIME NULL
   - `status`: TINYINT NOT NULL DEFAULT 0 (0 = Active, 1 = Revoked, 2 = Locked)
   - `failed_attempts`: INT NOT NULL DEFAULT 0
   - `locked_until`: DATETIME NULL
   - Standard audit fields from `BaseDO`.

2. **`kings_client`**:
   - `id`: BIGINT AUTO_INCREMENT PRIMARY KEY
   - `name`: VARCHAR(128) NOT NULL (Full name)
   - `phone`: VARCHAR(32) NOT NULL (Indexed)
   - `city`: VARCHAR(64) DEFAULT 'Грозный'
   - `instagram`: VARCHAR(64) NULL (e.g., `@abubakar_k`)
   - `vip_level`: TINYINT DEFAULT 1 (Standard, Gold VIP, Bespoke Club)
   - `total_spent`: DECIMAL(12, 2) DEFAULT 0.00
   - `notes`: TEXT NULL
   - Standard audit fields from `BaseDO`.

3. **`kings_order`**:
   - `id`: BIGINT AUTO_INCREMENT PRIMARY KEY
   - `order_no`: VARCHAR(32) NOT NULL UNIQUE (e.g. `KN-202609-001`)
   - `client_id`: BIGINT NOT NULL
   - `client_name`: VARCHAR(128) NOT NULL
   - `client_phone`: VARCHAR(32) NOT NULL
   - `channel`: VARCHAR(32) NOT NULL (`INSTAGRAM`, `WEBSITE`, `SALON_GROZNY`, `PHONE`)
   - `product_type`: VARCHAR(64) NOT NULL (Костюм-тройка, Костюм-двойка, Смокинг, Пальто, Сорочка)
   - `order_type`: VARCHAR(16) NOT NULL (`BESPOKE` - инд. пошив, `RTW` - готовый размер)
   - `status`: VARCHAR(32) NOT NULL (`LEAD`, `APPOINTMENT`, `FITTING`, `PAYMENT_AGREED`, `TAILORING`, `DELIVERED`, `CANCELLED`)
   - **Measurements (JSON / columns):**
     - `height`: INT (Рост в см)
     - `chest`: DECIMAL(5,1) (Обхват груди)
     - `waist`: DECIMAL(5,1) (Обхват талии)
     - `hips`: DECIMAL(5,1) (Обхват бедер)
     - `shoulder_width`: DECIMAL(5,1) (Ширина плеч)
     - `sleeve_length`: DECIMAL(5,1) (Длина рукава)
     - `trouser_length`: DECIMAL(5,1) (Длина брюк)
   - **Suit Customization Specifications:**
     - `fabric_brand`: VARCHAR(64) (Loro Piana, Vitale Barberis Canonico, Scabal, etc.)
     - `fabric_sku`: VARCHAR(64) (Артикул ткани и состав)
     - `fabric_color`: VARCHAR(32) (Черный, Royal Navy, Графит, Клетка)
     - `lapel_type`: VARCHAR(32) (Notch / Peak / Shawl)
     - `fit_type`: VARCHAR(32) (Slim Fit / Regular / Bespoke)
     - `monogram`: VARCHAR(32) (Персональные инициалы, e.g. "K.A.M.")
     - `button_type`: VARCHAR(32) (Рог, Перламутр, Корозо)
   - **Financials:**
     - `total_amount`: DECIMAL(12,2) NOT NULL
     - `deposit_amount`: DECIMAL(12,2) DEFAULT 0.00
     - `balance_amount`: DECIMAL(12,2) NOT NULL
     - `payment_method`: VARCHAR(32) (Наличные, Карта, Банковский перевод)
     - `payment_status`: VARCHAR(32) (`PENDING`, `PARTIAL`, `PAID`)
   - Standard audit fields from `BaseDO`.

4. **`kings_inventory`**:
   - `id`: BIGINT AUTO_INCREMENT PRIMARY KEY
   - `item_type`: VARCHAR(32) NOT NULL (`SUIT`, `JACKET`, `TROUSERS`, `SHIRT`, `FABRIC`, `ACCESSORY`)
   - `sku`: VARCHAR(64) NOT NULL UNIQUE
   - `name`: VARCHAR(128) NOT NULL
   - `size`: VARCHAR(16) NULL (46, 48, 50, 52, 54, 56, 58, 60, 62)
   - `height_category`: VARCHAR(16) NULL (170-176, 176-182, 182-188, 188+)
   - `color`: VARCHAR(32) NOT NULL
   - `stock_quantity`: INT NOT NULL DEFAULT 0
   - `unit`: VARCHAR(16) DEFAULT 'шт'
   - `min_threshold`: INT DEFAULT 2 (Critical stock threshold alert)
   - `price`: DECIMAL(12,2) NOT NULL
   - Standard audit fields from `BaseDO`.

5. **`sys_login_log`**:
   - Audit trail of access code authentications with IP, user agent, success status, and message.

---

## 4. Frontend Architecture (Vue 3 + Element Plus + Pinia)

### 4.1 Aesthetics & Styling
- **Theme Variables:**
  - `--kn-bg-primary`: `#0E0E10`
  - `--kn-bg-surface`: `#18191E`
  - `--kn-bg-card`: `#22232A`
  - `--kn-gold-primary`: `#C5A059`
  - `--kn-gold-light`: `#DFBE7A`
  - `--kn-gold-glow`: `rgba(197, 160, 89, 0.25)`
  - `--kn-border`: `rgba(197, 160, 89, 0.18)`
  - `--kn-text-primary`: `#FFFFFF`
  - `--kn-text-secondary`: `#A0A0A5`

### 4.2 Views & Components
1. **`/login` (Security Gateway)**:
   - Centered luxury branding: *KINGSNAME Haute Sartorial — Grozny*.
   - 8-digit split PIN input cells with auto-focus, paste support, backspace navigation, and audio/haptic cues.
   - Master code indication helper (`88888888` for initial setup).
   - Lockout overlay after 3 failed attempts.
2. **`/dashboard` (Executive Overview)**:
   - KPI metrics: Today's Revenue, Monthly Total, Active Bespoke Orders in Production, Fittings scheduled today.
   - 6-Stage Visual Sales Funnel (Lead -> Appointment -> Fitting -> Prepayment -> Tailoring -> Delivered) with drag-to-filter or click-to-filter.
   - Interactive ECharts graphs: Sales Trend over time, Category Split (Three-piece suits, Tuxedos, Blazers, Shirts).
   - Quick Action buttons: "+ Лид из Instagram @kingsname", "+ Запись на примерку", "+ Новый пошив".
3. **`/orders` (Bespoke & RTW Orders Management)**:
   - Status filters, size filters, search by client/phone/Instagram.
   - Order Details & Creation Drawer with anatomical measurement fields and interactive suit silhouette.
   - Printable "Tailor Measurement Sheet" (Лист мерок мастера-портного).
4. **`/clients` (VIP Client Book)**:
   - Profile cards, total spent, cities (Grozny, Makhachkala, Moscow, Dubai, etc.), Instagram handles with direct links.
5. **`/inventory` (Sartorial Stock & Fabrics)**:
   - Grid of sizes vs heights, fabric roll inventory in meters, low stock warnings.
6. **`/security` (Access Code Control Center - Admin only)**:
   - Generate 8-digit codes with validity presets (Shift / Day / Permanent).
   - Revoke active codes in real time.
   - Active session monitoring.

### 4.3 Integrated Mock & Live Backend Adapter
- Supports running entirely in standalone mode with realistic KINGSNAME demo data right inside Vite via Mock Service Worker / Mock Adapter.
- Seamlessly connects to real Spring Boot backend endpoints when the backend is active.

---

## 5. Verification & Testing Plan
- Unit testing of 8-digit code validation, rate-limiting, and expiration checks.
- Verification of order status transitions across the 6-stage funnel.
- Frontend build and lint checks (`npm run build`).
- UI verification: responsive layout, luxury gold theme rendering, 8-digit input behavior.
