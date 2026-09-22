import { defineStore } from 'pinia';
import { api } from '@/utils/request';

export interface UserInfo {
  userId: number;
  userName: string;
  roleCode: string;
  code: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('kingsname_token') || '',
    user: JSON.parse(localStorage.getItem('kingsname_user') || 'null') as UserInfo | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.roleCode === 'admin',
    userName: (state) => state.user?.userName || 'Сотрудник',
    roleLabel: (state) => {
      switch (state.user?.roleCode) {
        case 'admin':
          return 'Шеф-Администратор';
        case 'tailor':
          return 'Мастер-портной';
        case 'manager':
          return 'Менеджер Direct/Сайт';
        case 'consultant':
        default:
          return 'Консультант салона';
      }
    },
  },
  actions: {
    async login(code: string) {
      const data = await api.loginByCode(code);
      this.token = data.token;
      this.user = {
        userId: data.userId,
        userName: data.userName,
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
