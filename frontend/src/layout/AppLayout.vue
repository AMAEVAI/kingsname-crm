<template>
  <div class="kn-app-container">
    <!-- Sidebar -->
    <aside class="kn-sidebar">
      <!-- Brand Logo Header -->
      <div class="kn-sidebar-brand">
        <div class="kn-emblem">
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
        <div class="kn-brand-texts">
          <h1 class="kn-brand-title font-brand">KINGSNAME</h1>
          <p class="kn-brand-sub">GROZNY • BESPOKE TAILORING</p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="kn-nav">
        <router-link to="/dashboard" class="kn-nav-item" active-class="active">
          <span class="kn-nav-icon">📊</span>
          <span class="kn-nav-label">Аналитика и Дашборд</span>
        </router-link>

        <router-link to="/orders" class="kn-nav-item" active-class="active">
          <span class="kn-nav-icon">✂️</span>
          <span class="kn-nav-label">Заказы и Пошив</span>
        </router-link>

        <router-link to="/clients" class="kn-nav-item" active-class="active">
          <span class="kn-nav-icon">👑</span>
          <span class="kn-nav-label">База VIP-Клиентов</span>
        </router-link>

        <router-link to="/inventory" class="kn-nav-item" active-class="active">
          <span class="kn-nav-icon">📦</span>
          <span class="kn-nav-label">Склад и Ткани</span>
        </router-link>

        <router-link to="/security" class="kn-nav-item" active-class="active">
          <span class="kn-nav-icon">🔐</span>
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
            <span class="kn-social-icon">📷</span>
            <span class="kn-social-text">Instagram: <strong>@kingsname</strong></span>
          </a>
          <a href="https://kingsname.store/" target="_blank" class="kn-social-link">
            <span class="kn-social-icon">🌐</span>
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
          <div class="kn-location-badge">
            <span class="kn-loc-icon">📍</span>
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
              <span class="kn-user-role">{{ userStore.roleLabel }}</span>
            </div>
          </div>

          <!-- Logout Button -->
          <button class="kn-logout-btn" @click="handleLogout" title="Выйти из системы">
            <span>Выход</span>
            <span class="kn-logout-icon">⏻</span>
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
import { useUserStore } from '@/store/user';
import { ElMessageBox } from 'element-plus';

const userStore = useUserStore();

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
  font-size: 18px;
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
</style>
