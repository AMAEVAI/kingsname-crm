import { defineStore } from 'pinia';
import { api } from '@/utils/request';

export interface UserInfo {
  userId: number;
  userName: string;
  roleCode: string;
  code: string;
}

export const useUserStore = defineStore('user', {
  state: () => {
    let savedUser: UserInfo | null = null;
    try {
      savedUser = JSON.parse(localStorage.getItem('kingsname_user') || 'null');
      if (savedUser && (savedUser.roleCode === 'admin' || savedUser.userName?.includes('Шеф-Администратор'))) {
        savedUser.userName = 'ADMIN KINGSNAME';
        localStorage.setItem('kingsname_user', JSON.stringify(savedUser));
      }
    } catch (_) {}

    return {
      token: localStorage.getItem('kingsname_token') || '',
      user: savedUser as UserInfo | null,
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.roleCode === 'admin',
    canAccessFinance: (state) => ['admin', 'manager'].includes(state.user?.roleCode || ''),
    userName: (state) => {
      if (!state.user) return 'Сотрудник';
      if (state.user.roleCode === 'admin' || state.user.userName?.includes('Шеф-Администратор')) {
        return 'ADMIN KINGSNAME';
      }
      return state.user.userName;
    },
    roleLabel: (state) => {
      switch (state.user?.roleCode) {
        case 'admin':
          return ''; // Just "ADMIN KINGSNAME"
        case 'tailor':
          return 'Мастер-портной';
        case 'manager':
          return 'Менеджер Direct/Сайт';
        case 'consultant':
        default:
          return state.user ? 'Консультант салона' : '';
      }
    },
  },
  actions: {
    async login(code: string) {
      const data = await api.loginByCode(code);
      const userName = data.roleCode === 'admin' ? 'ADMIN KINGSNAME' : data.userName;
      this.token = data.token;
      this.user = {
        userId: data.userId,
        userName,
        roleCode: data.roleCode,
        code: data.code,
      };
      localStorage.setItem('kingsname_token', data.token);
      localStorage.setItem('kingsname_user', JSON.stringify(this.user));
      return data;
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('kingsname_token');
      localStorage.removeItem('kingsname_user');
      window.location.href = '/login';
    },
  },
});
