# KINGSNAME CRM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, luxury CRM system for KINGSNAME (Grozny, bespoke menswear) based on the architectural patterns of ruoyi-vue-pro, featuring 8-digit secure code authentication, bespoke suit measurements, sales funnel, and inventory management.

**Architecture:** Spring Boot 3 + MyBatis-Plus backend with custom Spring Security 8-digit access code authentication filter and CommonResult response wrappers; paired with a luxury Vue 3 + Vite + Element Plus + Pinia frontend in obsidian/gold aesthetics (#0E0E10 / #C5A059) featuring an interactive mock adapter and complete backend API services.

**Tech Stack:** Java 17/21, Spring Boot 3, MyBatis-Plus, Spring Security, MySQL 8+, Vue 3, Vite, Element Plus, Pinia, Vue Router, ECharts, SCSS.

## Global Constraints
- Brand Aesthetics: Luxury dark (#0E0E10 obsidian, #18191E cards, #C5A059 noble gold, #FFFFFF text).
- Default Master Code: `88888888` for initial admin entry.
- Rate Limiting: 3 failed code attempts triggers a 15-minute temporary lockout.
- Standard ruoyi-vue-pro response format: `{ code: 0, data: ..., msg: "" }`.
- Integrations highlighted: Instagram `@kingsname` and website `https://kingsname.store/`.

---

### Task 1: Database Schema & Seed Data (`backend/sql`)

**Files:**
- Create: `backend/sql/kingsname_schema.sql`

- [ ] **Step 1: Write SQL schema and DDL**
Create `backend/sql/kingsname_schema.sql` with tables: `sys_access_code`, `kings_client`, `kings_order`, `kings_inventory`, `sys_login_log`. Include realistic KINGSNAME bespoke suits, fabrics (Loro Piana, VBC, Scabal), VIP clients from Grozny/Makhachkala, and master code `88888888`.

- [ ] **Step 2: Verify SQL syntax**
Ensure valid MySQL 8 syntax with proper indices and foreign keys.

- [ ] **Step 3: Commit**
`git add backend/sql/kingsname_schema.sql && git commit -m "feat(sql): add database schema and initial seed data for KINGSNAME CRM"`

---

### Task 2: Backend Java Spring Boot Project & Core Security Framework (`backend/`)

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/resources/application.yml`
- Create: `backend/src/main/java/ru/kingsname/crm/KingsnameCrmApplication.java`
- Create: `backend/src/main/java/ru/kingsname/crm/framework/common/pojo/CommonResult.java`
- Create: `backend/src/main/java/ru/kingsname/crm/framework/common/pojo/PageResult.java`
- Create: `backend/src/main/java/ru/kingsname/crm/framework/common/pojo/BaseDO.java`
- Create: `backend/src/main/java/ru/kingsname/crm/framework/security/core/filter/AccessCodeAuthenticationFilter.java`
- Create: `backend/src/main/java/ru/kingsname/crm/framework/security/core/token/AccessCodeAuthenticationToken.java`
- Create: `backend/src/main/java/ru/kingsname/crm/framework/security/core/service/AccessCodeSecurityService.java`
- Create: `backend/src/main/java/ru/kingsname/crm/framework/security/config/SecurityConfig.java`

- [ ] **Step 1: Scaffold Spring Boot POM and application configuration**
- [ ] **Step 2: Implement CommonResult, PageResult, BaseDO**
- [ ] **Step 3: Implement custom Spring Security 8-digit access code authentication filter and rate limiting (3-attempt lock)**
- [ ] **Step 4: Commit**
`git add backend/ && git commit -m "feat(backend): add Spring Boot 3 core security framework and 8-digit code filter"`

---

### Task 3: Backend Domain Modules: Access Codes, Clients, Orders & Inventory (`backend/`)

**Files:**
- Create: `backend/src/main/java/ru/kingsname/crm/module/security/controller/AccessCodeController.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/security/dal/dataobject/KingsAccessCodeDO.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/security/dal/mysql/KingsAccessCodeMapper.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/security/service/KingsAccessCodeService.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/client/controller/KingsClientController.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/client/dal/dataobject/KingsClientDO.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/client/dal/mysql/KingsClientMapper.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/client/service/KingsClientService.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/order/controller/KingsOrderController.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/order/dal/dataobject/KingsOrderDO.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/order/dal/mysql/KingsOrderMapper.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/order/service/KingsOrderService.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/inventory/controller/KingsInventoryController.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/inventory/dal/dataobject/KingsInventoryDO.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/inventory/dal/mysql/KingsInventoryMapper.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/inventory/service/KingsInventoryService.java`
- Create: `backend/src/main/java/ru/kingsname/crm/module/dashboard/controller/KingsDashboardController.java`

- [ ] **Step 1: Implement Access Code generation, expiration and session logging**
- [ ] **Step 2: Implement Client management with Instagram links and VIP metrics**
- [ ] **Step 3: Implement Orders with Bespoke measurements, 6-stage funnel, and financial tracking**
- [ ] **Step 4: Implement Inventory & Fabrics stock tracking with low-stock alerts**
- [ ] **Step 5: Implement Dashboard analytics (revenue, avg check, funnel counts, category share)**
- [ ] **Step 6: Commit**
`git add backend/ && git commit -m "feat(backend): implement KINGSNAME business modules and REST endpoints"`

---

### Task 4: Frontend Infrastructure, Design System & Mock Engine (`frontend/`)

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`
- Create: `frontend/src/assets/styles/theme.scss`
- Create: `frontend/src/utils/request.ts`
- Create: `frontend/src/mock/index.ts`
- Create: `frontend/src/router/index.ts`
- Create: `frontend/src/store/user.ts`
- Create: `frontend/src/layout/AppLayout.vue`

- [ ] **Step 1: Setup package.json, vite.config.ts, tsconfig.json, and HTML entry**
- [ ] **Step 2: Configure luxury styling system (#0E0E10 / #C5A059) and Element Plus dark theme variables**
- [ ] **Step 3: Build Axios API requester and Mock engine with seed data**
- [ ] **Step 4: Create AppLayout with luxury sidebar, KINGSNAME emblem, brand links, and user header**
- [ ] **Step 5: Install dependencies via `npm install`**
- [ ] **Step 6: Commit**
`git add frontend/ && git commit -m "feat(frontend): setup Vite, Vue 3, Pinia, luxury styling and mock engine"`

---

### Task 5: Luxury 8-Digit PIN Code Login View (`frontend/src/views/login/`)

**Files:**
- Create: `frontend/src/views/login/index.vue`

- [ ] **Step 1: Implement 8-digit split PIN input cells with auto-focus, paste support, backspace navigation**
- [ ] **Step 2: Implement brute-force protection logic (3-attempt counter, 15-min lockout countdown screen)**
- [ ] **Step 3: Add luxury styling, emblem, and default code helper (`88888888`)**
- [ ] **Step 4: Commit**
`git add frontend/src/views/login/ && git commit -m "feat(frontend): create luxury 8-digit PIN code login screen"`

---

### Task 6: Analytics Dashboard & 6-Stage Bespoke Funnel (`frontend/src/views/dashboard/`)

**Files:**
- Create: `frontend/src/views/dashboard/index.vue`

- [ ] **Step 1: Implement top KPI stat cards (Daily/Monthly revenue, avg check, active tailoring, appointments)**
- [ ] **Step 2: Implement 6-Stage visual sales funnel with interactive filtering**
- [ ] **Step 3: Integrate ECharts for sales dynamics and category distribution**
- [ ] **Step 4: Add quick action modals (Lead from Instagram @kingsname, Fitting appointment)**
- [ ] **Step 5: Commit**
`git add frontend/src/views/dashboard/ && git commit -m "feat(frontend): create analytics dashboard and 6-stage bespoke funnel"`

---

### Task 7: Orders & Bespoke Measurement Customization Drawer (`frontend/src/views/orders/`)

**Files:**
- Create: `frontend/src/views/orders/index.vue`

- [ ] **Step 1: Implement Orders table with status filters, search, and pagination**
- [ ] **Step 2: Implement Bespoke Suit Drawer with anatomical measurements (chest, waist, shoulders, sleeve, trouser)**
- [ ] **Step 3: Implement suit customization (fabrics selector, lapels, monograms, buttons, financials)**
- [ ] **Step 4: Add printable Tailor Measurement Sheet view**
- [ ] **Step 5: Commit**
`git add frontend/src/views/orders/ && git commit -m "feat(frontend): create orders management and bespoke measurements drawer"`

---

### Task 8: Clients Book, Inventory Matrix & Security Center (`frontend/src/views/`)

**Files:**
- Create: `frontend/src/views/clients/index.vue`
- Create: `frontend/src/views/inventory/index.vue`
- Create: `frontend/src/views/security/index.vue`

- [ ] **Step 1: Implement VIP Clients book with Instagram links and order histories**
- [ ] **Step 2: Implement Inventory size matrix (46-60+ vs heights) and fabrics stock with low-stock warnings**
- [ ] **Step 3: Implement Security Center for 8-digit code generation, validity settings, and session audit logs**
- [ ] **Step 4: Commit**
`git add frontend/src/views/ && git commit -m "feat(frontend): create clients book, inventory matrix, and security center"`

---

### Task 9: Verification, Build Testing & Demonstration

- [ ] **Step 1: Run `npm run build` in frontend to ensure zero TypeScript/Vue errors**
- [ ] **Step 2: Launch development server (`npm run dev`) and test interactive login with master code `88888888`**
- [ ] **Step 3: Test order creation with bespoke measurements and verify funnel transitions**
- [ ] **Step 4: Test security lockout after 3 incorrect codes**
- [ ] **Step 5: Document execution walkthrough**
