<template>
  <div class="kn-app-container">
    <!-- Mobile Sidebar Backdrop Overlay -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="kn-sidebar-backdrop" @click="mobileMenuOpen = false"></div>
    </transition>

    <!-- Sidebar -->
    <aside class="kn-sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <!-- Brand Logo Header -->
      <div class="kn-sidebar-brand">
        <div class="kn-emblem kn-logo-clickable" @click="goToDashboard" title="На главную">
          <svg viewBox="0 0 24 24" class="kn-crown-icon">
            <path fill="url(#goldGrad)" d="M2 19h20v2H2zM2 5l5 3.5L12 2l5 6.5L22 5v12H2z"/>
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#DFBE7A"/>
                <stop offset="50%" stop-color="#C5A059"/>
                <stop offset="100%" stop-color="#9A7B39"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="kn-brand-texts kn-logo-clickable" @click="goToDashboard" title="На главную">
          <h1 class="kn-brand-title font-brand">KINGSNAME</h1>
          <p class="kn-brand-sub">GROZNY • BESPOKE TAILORING</p>
        </div>
        <button class="kn-sidebar-close-btn" @click="mobileMenuOpen = false" title="Закрыть меню">
          <X :size="18" :stroke-width="2" />
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="kn-nav">
        <router-link to="/dashboard" class="kn-nav-item" active-class="active" @click="mobileMenuOpen = false">
          <LayoutDashboard :size="19" :stroke-width="1.8" class="kn-nav-icon" />
          <span class="kn-nav-label">Аналитика и Дашборд</span>
        </router-link>

        <router-link to="/orders" class="kn-nav-item" active-class="active" @click="mobileMenuOpen = false">
          <Scissors :size="19" :stroke-width="1.8" class="kn-nav-icon" />
          <span class="kn-nav-label">Заказы и Пошив</span>
        </router-link>

        <router-link
          v-if="userStore.canAccessFinance"
          to="/finance"
          class="kn-nav-item"
          active-class="active"
          @click="mobileMenuOpen = false"
        >
          <BadgeDollarSign :size="19" :stroke-width="1.8" class="kn-nav-icon" />
          <span class="kn-nav-label">Бухгалтерия и Касса</span>
          <span class="kn-admin-pill">Финансы</span>
        </router-link>

        <router-link to="/clients" class="kn-nav-item" active-class="active" @click="mobileMenuOpen = false">
          <Users :size="19" :stroke-width="1.8" class="kn-nav-icon" />
          <span class="kn-nav-label">База VIP-Клиентов</span>
        </router-link>

        <router-link to="/inventory" class="kn-nav-item" active-class="active" @click="mobileMenuOpen = false">
          <Package :size="19" :stroke-width="1.8" class="kn-nav-icon" />
          <span class="kn-nav-label">Склад и Ткани</span>
        </router-link>

        <router-link to="/security" class="kn-nav-item" active-class="active" @click="mobileMenuOpen = false">
          <ShieldCheck :size="19" :stroke-width="1.8" class="kn-nav-icon" />
          <span class="kn-nav-label">8-Значные Коды Доступа</span>
          <span v-if="userStore.isAdmin" class="kn-admin-pill">Admin</span>
        </router-link>
      </nav>

      <!-- Brand Integrations & Links -->
      <div class="kn-sidebar-footer">
        <div class="kn-channel-card">
          <div class="kn-channel-row">
            <span class="kn-channel-dot"></span>
            <span class="kn-channel-label">Каналы продаж:</span>
          </div>
          <a href="https://www.instagram.com/kingsname" target="_blank" class="kn-social-link">
            <Instagram :size="16" :stroke-width="1.8" class="kn-social-icon" />
            <span class="kn-social-text">Instagram: <strong>@kingsname</strong></span>
          </a>
          <a href="https://kingsname.store/" target="_blank" class="kn-social-link">
            <Globe :size="16" :stroke-width="1.8" class="kn-social-icon" />
            <span class="kn-social-text">Сайт: <strong>kingsname.store</strong></span>
          </a>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="kn-main-wrapper">
      <!-- Top Navigation Header -->
      <header class="kn-topbar">
        <div class="kn-topbar-left">
          <!-- Mobile Menu Toggle Button -->
          <button
            class="kn-mobile-toggle-btn"
            @click="mobileMenuOpen = !mobileMenuOpen"
            :title="mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
          >
            <component :is="mobileMenuOpen ? X : Menu" :size="20" :stroke-width="2" />
          </button>

          <!-- Luxury Brand Title with Vector Gold Crown -->
          <div class="kn-mobile-brand kn-logo-clickable" @click="goToDashboard" title="На главную">
            <div class="kn-mobile-crown">
              <svg viewBox="0 0 24 24" class="kn-crown-icon-mini">
                <path fill="url(#goldGradMini)" d="M2 19h20v2H2zM2 5l5 3.5L12 2l5 6.5L22 5v12H2z"/>
                <defs>
                  <linearGradient id="goldGradMini" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#DFBE7A"/>
                    <stop offset="50%" stop-color="#C5A059"/>
                    <stop offset="100%" stop-color="#9A7B39"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="kn-mobile-brand-texts">
              <span class="kn-mobile-brand-title font-brand">KINGSNAME</span>
              <span class="kn-mobile-brand-sub font-brand">GROZNY • BESPOKE</span>
            </div>
          </div>

          <!-- Location Badge (Desktop) -->
          <div class="kn-location-badge">
            <MapPin :size="15" :stroke-width="1.8" class="kn-loc-icon" />
            <span>Грозный, Чеченская Республика • Премиальный Салон KINGSNAME</span>
          </div>
        </div>

        <div class="kn-topbar-right">
          <!-- Role & User Profile -->
          <div class="kn-user-pill">
            <div class="kn-user-avatar">
              {{ userStore.userName.charAt(0) }}
            </div>
            <div class="kn-user-info">
              <span class="kn-user-name">{{ userStore.userName }}</span>
              <span v-if="userStore.roleLabel" class="kn-user-role">{{ userStore.roleLabel }}</span>
            </div>
          </div>

          <!-- Logout Button -->
          <button class="kn-logout-btn" @click="handleLogout" title="Выйти из системы">
            <LogOut :size="15" :stroke-width="1.8" class="kn-logout-icon" />
            <span class="kn-logout-text">Выход</span>
          </button>
        </div>
      </header>

      <!-- Router View with Smooth Transition -->
      <main class="kn-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessageBox } from 'element-plus';
import {
  LayoutDashboard,
  Scissors,
  Users,
  Package,
  ShieldCheck,
  BadgeDollarSign,
  Instagram,
  Globe,
  MapPin,
  LogOut,
  Menu,
  X
} from 'lucide-vue-next';

const userStore = useUserStore();
const route = useRoute();
const mobileMenuOpen = ref(false);

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false;
});

const goToDashboard = () => {
  mobileMenuOpen.value = false;
  window.location.href = '/dashboard';
};

const handleLogout = () => {
  ElMessageBox.confirm('Завершить текущую рабочую смену?', 'Выход из CRM KINGSNAME', {
    confirmButtonText: 'Да, выйти',
    cancelButtonText: 'Отмена',
    type: 'warning',
  }).then(() => {
    userStore.logout();
  });
};
</script>

<style scoped lang="scss">
.kn-app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--kn-bg-primary);
}

/* Sidebar Styling */
.kn-sidebar {
  width: 280px;
  background-color: var(--kn-bg-surface);
  border-right: 1px solid var(--kn-gold-border-subtle);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
}

.kn-sidebar-brand {
  padding: 28px 24px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid rgba(197, 160, 89, 0.12);
}

.kn-emblem {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(197, 160, 89, 0.1);
  border: 1px solid var(--kn-gold-border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px var(--kn-gold-glow);
}

.kn-crown-icon {
  width: 26px;
  height: 26px;
}

.kn-brand-title {
  font-size: 18px;
  font-weight: 800;
  background: var(--kn-gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}

.kn-brand-sub {
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--kn-text-muted);
  margin-top: 4px;
}

/* Navigation Links */
.kn-nav {
  padding: 24px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kn-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #C0C1CC;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(197, 160, 89, 0.08);
    color: #FFFFFF;
    border-color: rgba(197, 160, 89, 0.15);
  }

  &.active {
    background: rgba(197, 160, 89, 0.14);
    color: #DFBE7A;
    font-weight: 600;
    border-color: var(--kn-gold-border);
    box-shadow: 0 2px 12px rgba(197, 160, 89, 0.15);
  }
}

.kn-nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.2s ease;
}

.kn-nav-item:hover .kn-nav-icon,
.kn-nav-item.active .kn-nav-icon {
  transform: scale(1.1);
  color: #DFBE7A;
}

.kn-admin-pill {
  margin-left: auto;
  font-size: 10px;
  background: var(--kn-gold-gradient);
  color: #0A0B0E;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
}

/* Sidebar Footer / Brand Integrations */
.kn-sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(197, 160, 89, 0.1);
}

.kn-channel-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(197, 160, 89, 0.12);
  border-radius: 8px;
  padding: 12px;
}

.kn-channel-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.kn-channel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 6px #10B981;
}

.kn-channel-label {
  font-size: 11px;
  color: var(--kn-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kn-social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #D1D2DA;
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.2s;

  &:hover {
    color: var(--kn-gold-light);
  }
}

.kn-social-icon {
  font-size: 14px;
}

/* Main Container */
.kn-main-wrapper {
  margin-left: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}

/* Topbar */
.kn-topbar {
  height: 70px;
  background-color: var(--kn-bg-surface);
  border-bottom: 1px solid var(--kn-gold-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 40;
}

.kn-topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.kn-location-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--kn-text-secondary);
}

.kn-topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.kn-user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--kn-gold-border-subtle);
  padding: 6px 14px;
  border-radius: 30px;
}

.kn-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--kn-gold-gradient);
  color: #0A0B0E;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.kn-user-info {
  display: flex;
  flex-direction: column;
}

.kn-user-name {
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
}

.kn-user-role {
  font-size: 11px;
  color: var(--kn-gold-primary);
}

.kn-logout-btn {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #F87171;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #EF4444;
  }
}

/* Page Content */
.kn-content {
  flex: 1;
  padding: 32px;
  background-color: var(--kn-bg-primary);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

/* Mobile Toggle & Brand in Topbar */
.kn-mobile-toggle-btn {
  display: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(197, 160, 89, 0.28);
  color: var(--kn-gold-light);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover, &:active {
    background: rgba(197, 160, 89, 0.15);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
  }
}

.kn-logo-clickable {
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 0.85;
  }
}

.kn-mobile-brand {
  display: none;
  align-items: center;
  gap: 10px;

  .kn-mobile-crown {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kn-crown-icon-mini {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 6px rgba(197, 160, 89, 0.35));
  }

  .kn-mobile-brand-texts {
    display: flex;
    flex-direction: column;
  }

  .kn-mobile-brand-title {
    font-size: 16px;
    font-weight: 700;
    background: var(--kn-gold-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.12em;
    line-height: 1.1;
  }

  .kn-mobile-brand-sub {
    font-size: 8px;
    color: var(--kn-text-muted);
    letter-spacing: 0.18em;
    font-weight: 600;
    margin-top: 1px;
  }
}

.kn-sidebar-close-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--kn-text-secondary);
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  transition: color 0.2s;

  &:hover {
    color: #FFFFFF;
  }
}

.kn-sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 998;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ==============================================================================
   RESPONSIVE MEDIA QUERIES (iPad & Tablet: <=1024px, Mobile: <=768px)
   ============================================================================== */

@media (max-width: 1024px) {
  .kn-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: none;

    &.mobile-open {
      transform: translateX(0);
      box-shadow: 12px 0 32px rgba(0, 0, 0, 0.85);
    }
  }

  .kn-sidebar-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kn-main-wrapper {
    margin-left: 0 !important;
    width: 100% !important;
  }

  .kn-topbar {
    padding: 0 24px;
    height: 68px;
  }

  .kn-topbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .kn-mobile-toggle-btn {
    display: flex;
  }

  .kn-mobile-brand {
    display: flex;
  }

  .kn-location-badge {
    display: none;
  }

  .kn-user-pill {
    padding: 6px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .kn-user-info {
    display: flex;
  }

  .kn-logout-text {
    display: inline;
  }

  .kn-content {
    padding: 24px 20px;
  }
}

@media (max-width: 768px) {
  .kn-topbar {
    padding: 0 12px;
    height: 58px;
  }

  .kn-topbar-left {
    gap: 10px;
  }

  .kn-mobile-toggle-btn {
    width: 36px;
    height: 36px;
  }

  .kn-mobile-brand-title {
    font-size: 15px;
  }

  .kn-mobile-brand-sub {
    display: none;
  }

  .kn-topbar-right {
    gap: 8px;
  }

  .kn-user-pill {
    padding: 4px 10px;
    gap: 8px;
  }

  .kn-user-avatar {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }

  .kn-user-info {
    display: flex;
  }

  .kn-user-name {
    font-size: 11px;
    white-space: nowrap;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .kn-user-role {
    display: none;
  }

  .kn-logout-btn {
    padding: 6px 8px;
  }

  .kn-logout-text {
    display: none;
  }

  .kn-content {
    padding: 14px 12px;
    min-width: 0;
  }
}

@media (max-width: 380px) {
  .kn-topbar {
    padding: 0 8px;
  }

  .kn-content {
    padding: 12px 8px;
  }
}
</style>
