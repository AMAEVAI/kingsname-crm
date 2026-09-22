import axios from 'axios';
import { ElMessage } from 'element-plus';
import { mockDb } from '@/mock';

const request = axios.create({
  baseURL: '/admin-api',
  timeout: 10000,
});

// Flag to use mock service when Spring Boot backend is offline or standalone dev mode
const USE_MOCK = true;

// Request interceptor: attach token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('kingsname_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Custom Mock Adapter to guarantee immediate zero-setup execution
export const api = {
  // 1. Auth & Security
  loginByCode: async (code: string) => {
    if (USE_MOCK) {
      await delay(120);
      const res = mockDb.loginByCode(code);
      if (res.code !== 0) throw new Error(res.msg);
      return res.data;
    }
    const res = await request.post('/kings/auth/login-by-code', { code });
    if (res.data.code !== 0) throw new Error(res.data.msg);
    return res.data.data;
  },

  getAccessCodes: async () => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getCodes().data;
    }
    const res = await request.get('/kings/security/codes/page');
    return res.data.data;
  },

  generateAccessCode: async (userName: string, roleCode: string, validType: number) => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.generateCode(userName, roleCode, validType).data;
    }
    const res = await request.post('/kings/security/codes/generate', { userName, roleCode, validType });
    return res.data.data;
  },

  revokeAccessCode: async (id: number) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.revokeCode(id).data;
    }
    const res = await request.post('/kings/security/codes/revoke', { id });
    return res.data.data;
  },

  getLoginLogs: async () => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getLogs().data;
    }
    const res = await request.get('/kings/security/logs/page');
    return res.data.data;
  },

  // 2. Clients
  getClients: async (search?: string) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getClients(search).data;
    }
    const res = await request.get('/kings/clients/page', { params: { search } });
    return res.data.data;
  },

  saveClient: async (client: any) => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.saveClient(client).data;
    }
    const res = client.id 
      ? await request.put('/kings/clients/update', client)
      : await request.post('/kings/clients/create', client);
    return res.data.data;
  },

  deleteClient: async (id: number) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.deleteClient(id).data;
    }
    const res = await request.delete('/kings/clients/delete', { params: { id } });
    return res.data.data;
  },

  // 3. Orders
  getOrders: async (status?: string, search?: string) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getOrders(status, search).data;
    }
    const res = await request.get('/kings/orders/page', { params: { status, search } });
    return res.data.data;
  },

  saveOrder: async (order: any) => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.saveOrder(order).data;
    }
    const res = order.id
      ? await request.put('/kings/orders/update', order)
      : await request.post('/kings/orders/create', order);
    return res.data.data;
  },

  updateOrderStatus: async (orderId: number, newStatus: string) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.updateOrderStatus(orderId, newStatus).data;
    }
    const res = await request.post('/kings/orders/update-status', { orderId, newStatus });
    return res.data.data;
  },

  recordOrderPayment: async (orderId: number, amount: number, paymentMethod: string) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.recordPayment(orderId, amount, paymentMethod).data;
    }
    const res = await request.post('/kings/orders/record-payment', { orderId, amount, paymentMethod });
    return res.data.data;
  },

  deleteOrder: async (id: number) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.deleteOrder(id).data;
    }
    const res = await request.delete('/kings/orders/delete', { params: { id } });
    return res.data.data;
  },

  // 4. Inventory
  getInventory: async (itemType?: string, search?: string) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getInventory(itemType, search).data;
    }
    const res = await request.get('/kings/inventory/page', { params: { itemType, search } });
    return res.data.data;
  },

  saveInventoryItem: async (item: any) => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.saveInventoryItem(item).data;
    }
    const res = await request.post('/kings/inventory/save', item);
    return res.data.data;
  },

  updateStock: async (id: number, delta: number) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.updateStock(id, delta).data;
    }
    const res = await request.post('/kings/inventory/update-stock', { id, delta });
    return res.data.data;
  },

  deleteInventory: async (id: number) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.deleteInventory(id).data;
    }
    const res = await request.delete('/kings/inventory/delete', { params: { id } });
    return res.data.data;
  },

  // 5. Dashboard
  getDashboardAnalytics: async () => {
    if (USE_MOCK) {
      await delay(120);
      return mockDb.getAnalytics().data;
    }
    const res = await request.get('/kings/dashboard/analytics');
    return res.data.data;
  },

  // 6. Finance & Accounting
  getFinanceOverview: async () => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.getFinanceOverview().data;
    }
    const res = await request.get('/kings/finance/overview');
    return res.data.data;
  },

  getChannelAnalytics: async () => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getChannelAnalytics().data;
    }
    const res = await request.get('/kings/finance/channels');
    return res.data.data;
  },

  getCashAccounts: async () => {
    if (USE_MOCK) {
      await delay(60);
      return mockDb.getCashAccounts().data;
    }
    const res = await request.get('/kings/finance/accounts');
    return res.data.data;
  },

  getCashTransactions: async (params?: { type?: string; accountId?: number }) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getCashTransactions(params).data;
    }
    const res = await request.get('/kings/finance/transactions', { params });
    return res.data.data;
  },

  createCashTransaction: async (data: any) => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.createCashTransaction(data).data;
    }
    const res = await request.post('/kings/finance/transactions/create', data);
    return res.data.data;
  },

  getPurchases: async (params?: { supplier?: string; status?: string }) => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getPurchases(params).data;
    }
    const res = await request.get('/kings/finance/purchases', { params });
    return res.data.data;
  },

  createPurchase: async (data: any) => {
    if (USE_MOCK) {
      await delay(100);
      return mockDb.createPurchase(data).data;
    }
    const res = await request.post('/kings/finance/purchases/create', data);
    return res.data.data;
  },

  getOrderEconomics: async () => {
    if (USE_MOCK) {
      await delay(80);
      return mockDb.getOrderEconomics().data;
    }
    const res = await request.get('/kings/finance/order-economics');
    return res.data.data;
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default request;
