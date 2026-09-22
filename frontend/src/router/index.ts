import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { requiresAuth: false, title: 'Вход по коду безопасности' },
  },
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { requiresAuth: true, title: 'Главный Дашборд' },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/orders/index.vue'),
        meta: { requiresAuth: true, title: 'Управление Заказами и Мерки' },
      },
      {
        path: 'clients',
        name: 'Clients',
        component: () => import('@/views/clients/index.vue'),
        meta: { requiresAuth: true, title: 'База VIP-Клиентов' },
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/inventory/index.vue'),
        meta: { requiresAuth: true, title: 'Склад костюмов и Ткани' },
      },
      {
        path: 'security',
        name: 'Security',
        component: () => import('@/views/security/index.vue'),
        meta: { requiresAuth: true, title: 'Управление 8-значными кодами' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('kingsname_token');

  if (to.meta.requiresAuth !== false && !token) {
    next({ path: '/login' });
  } else if (to.path === '/login' && token) {
    next({ path: '/dashboard' });
  } else {
    next();
  }
});

export default router;
