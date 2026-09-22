/**
 * Comprehensive Mock Store for KINGSNAME CRM
 * Simulates Spring Boot + MySQL + Redis backend with full interactivity
 */

export interface MockAccessCode {
  id: number;
  code: string;
  userId: number;
  userName: string;
  roleCode: string;
  validType: number; // 1: Shift, 2: Day, 3: Permanent
  expireTime: string | null;
  status: number; // 0: Active, 1: Revoked
  createTime: string;
}

export interface MockClient {
  id: number;
  name: string;
  phone: string;
  city: string;
  instagram: string;
  vipLevel: number;
  totalSpent: number;
  notes: string;
  createTime: string;
}

export interface MockOrder {
  id: number;
  orderNo: string;
  clientId: number;
  clientName: string;
  clientPhone: string;
  channel: string;
  productType: string;
  orderType: string;
  status: string; // LEAD, APPOINTMENT, FITTING, PAYMENT_AGREED, TAILORING, DELIVERED
  
  // Measurements
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulderWidth?: number;
  sleeveLength?: number;
  trouserLength?: number;

  // Customization
  fabricBrand: string;
  fabricSku: string;
  fabricColor: string;
  lapelType: string;
  fitType: string;
  monogram: string;
  buttonType: string;
  tailorNotes?: string;

  // Financials
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  paymentMethod: string;
  paymentStatus: string;

  appointmentDate?: string;
  targetCompletionDate?: string;
  createTime: string;
}

export interface MockInventory {
  id: number;
  itemType: string;
  sku: string;
  name: string;
  size?: string;
  heightCategory?: string;
  color: string;
  stockQuantity: number;
  unit: string;
  minThreshold: number;
  price: number;
}

export interface MockLoginLog {
  id: number;
  code: string;
  userName: string;
  roleCode: string;
  ip: string;
  userAgent: string;
  resultStatus: number;
  resultMsg: string;
  loginTime: string;
}

class MockDatabase {
  private codes: MockAccessCode[] = [
    {
      id: 1,
      code: '88888888',
      userId: 1,
      userName: 'Шеф-Администратор KINGSNAME',
      roleCode: 'admin',
      validType: 3,
      expireTime: null,
      status: 0,
      createTime: '2026-09-01 10:00:00'
    },
    {
      id: 2,
      code: '12345678',
      userId: 2,
      userName: 'Мансур (Консультант салона)',
      roleCode: 'consultant',
      validType: 1,
      expireTime: '2026-09-22 22:00:00',
      status: 0,
      createTime: '2026-09-22 10:00:00'
    },
    {
      id: 3,
      code: '55555555',
      userId: 3,
      userName: 'Мастер-портной Адам',
      roleCode: 'tailor',
      validType: 2,
      expireTime: '2026-09-23 10:00:00',
      status: 0,
      createTime: '2026-09-22 10:00:00'
    },
    {
      id: 4,
      code: '77777777',
      userId: 4,
      userName: 'Залина (Менеджер @kingsname)',
      roleCode: 'manager',
      validType: 3,
      expireTime: null,
      status: 0,
      createTime: '2026-09-10 12:00:00'
    }
  ];

  private clients: MockClient[] = [
    {
      id: 1,
      name: 'Абубакар Кадыров',
      phone: '+7 (928) 001-95-95',
      city: 'Грозный',
      instagram: '@abubakar_k',
      vipLevel: 3,
      totalSpent: 420000,
      notes: 'Шерсть Loro Piana Super 150s, приталенный силуэт Slim Fit, монограмма на подкладке.',
      createTime: '2026-08-15 14:20:00'
    },
    {
      id: 2,
      name: 'Магомед Даудов',
      phone: '+7 (928) 111-22-33',
      city: 'Махачкала',
      instagram: '@magomed_d',
      vipLevel: 2,
      totalSpent: 235000,
      notes: 'Классический крой Regular, пиджаки с широким заостренным лацканом Peak Lapel.',
      createTime: '2026-08-20 11:00:00'
    },
    {
      id: 3,
      name: 'Тимур Эдилов',
      phone: '+7 (928) 222-33-44',
      city: 'Грозный',
      instagram: '@timur_e',
      vipLevel: 1,
      totalSpent: 95000,
      notes: 'Заказчик смокинга Black Tie для свадьбы.',
      createTime: '2026-09-02 16:30:00'
    },
    {
      id: 4,
      name: 'Хамзат Батаев',
      phone: '+7 (928) 333-44-55',
      city: 'Москва',
      instagram: '@khamzat_b',
      vipLevel: 2,
      totalSpent: 185000,
      notes: 'Регулярные заказы сорочек ручной работы и пальто из кашемира.',
      createTime: '2026-09-05 13:15:00'
    },
    {
      id: 5,
      name: 'Ислам Юсупов',
      phone: '+7 (928) 444-55-66',
      city: 'Дубай',
      instagram: '@islam_y',
      vipLevel: 3,
      totalSpent: 560000,
      notes: 'Индивидуальный пошив костюмов-троек Scabal, шелковые подкладки с золотой нитью.',
      createTime: '2026-09-12 18:45:00'
    }
  ];

  private orders: MockOrder[] = [
    {
      id: 1,
      orderNo: 'KN-202609-001',
      clientId: 3,
      clientName: 'Тимур Эдилов',
      clientPhone: '+7 (928) 222-33-44',
      channel: 'INSTAGRAM',
      productType: 'Смокинг Black Tie',
      orderType: 'BESPOKE',
      status: 'LEAD',
      height: 182,
      chest: 104,
      waist: 88,
      hips: 102,
      shoulderWidth: 47.5,
      sleeveLength: 64,
      trouserLength: 106,
      fabricBrand: 'Vitale Barberis Canonico',
      fabricSku: 'VBC-9021',
      fabricColor: 'Black Tie',
      lapelType: 'Shawl',
      fitType: 'Slim Fit',
      monogram: 'T.E.',
      buttonType: 'Satin Covered',
      tailorNotes: 'Запрос из Direct @kingsname на пошив смокинга к свадьбе.',
      totalAmount: 120000,
      depositAmount: 0,
      balanceAmount: 120000,
      paymentMethod: 'Карта',
      paymentStatus: 'PENDING',
      appointmentDate: '2026-09-23 15:00:00',
      targetCompletionDate: '2026-10-07',
      createTime: '2026-09-22 09:30:00'
    },
    {
      id: 2,
      orderNo: 'KN-202609-002',
      clientId: 4,
      clientName: 'Хамзат Батаев',
      clientPhone: '+7 (928) 333-44-55',
      channel: 'WEBSITE',
      productType: 'Пальто кашемировое',
      orderType: 'BESPOKE',
      status: 'APPOINTMENT',
      height: 185,
      chest: 108,
      waist: 92,
      hips: 105,
      shoulderWidth: 49,
      sleeveLength: 66,
      trouserLength: 108,
      fabricBrand: 'Loro Piana',
      fabricSku: 'LP-CASHMERE-04',
      fabricColor: 'Charcoal Grey',
      lapelType: 'Peak',
      fitType: 'Regular Classic',
      monogram: 'K.B.',
      buttonType: 'Natural Horn',
      tailorNotes: 'Запись через сайт kingsname.store. Примерка образцов кашемира.',
      totalAmount: 180000,
      depositAmount: 0,
      balanceAmount: 180000,
      paymentMethod: 'Банковский перевод',
      paymentStatus: 'PENDING',
      appointmentDate: '2026-09-24 12:00:00',
      targetCompletionDate: '2026-10-14',
      createTime: '2026-09-21 14:15:00'
    },
    {
      id: 3,
      orderNo: 'KN-202609-003',
      clientId: 2,
      clientName: 'Магомед Даудов',
      clientPhone: '+7 (928) 111-22-33',
      channel: 'SALON_GROZNY',
      productType: 'Костюм-двойка',
      orderType: 'BESPOKE',
      status: 'FITTING',
      height: 178,
      chest: 106,
      waist: 94,
      hips: 104,
      shoulderWidth: 48,
      sleeveLength: 63.5,
      trouserLength: 102,
      fabricBrand: 'Scabal',
      fabricSku: 'SCABAL-ROYAL-77',
      fabricColor: 'Royal Navy',
      lapelType: 'Peak',
      fitType: 'Regular Classic',
      monogram: 'M.D.',
      buttonType: 'Natural Horn',
      tailorNotes: 'Мерки сняты мастером Адамом. Учесть асимметрию правого плеча -0.5 см.',
      totalAmount: 145000,
      depositAmount: 50000,
      balanceAmount: 95000,
      paymentMethod: 'Наличные',
      paymentStatus: 'PARTIAL',
      appointmentDate: '2026-09-22 11:00:00',
      targetCompletionDate: '2026-10-02',
      createTime: '2026-09-20 16:45:00'
    },
    {
      id: 4,
      orderNo: 'KN-202609-004',
      clientId: 1,
      clientName: 'Абубакар Кадыров',
      clientPhone: '+7 (928) 001-95-95',
      channel: 'SALON_GROZNY',
      productType: 'Костюм-тройка',
      orderType: 'BESPOKE',
      status: 'PAYMENT_AGREED',
      height: 184,
      chest: 105,
      waist: 86,
      hips: 101,
      shoulderWidth: 47,
      sleeveLength: 65,
      trouserLength: 107,
      fabricBrand: 'Loro Piana',
      fabricSku: 'LP-SUPER150-NAVY',
      fabricColor: 'Royal Navy',
      lapelType: 'Notch',
      fitType: 'Slim Fit',
      monogram: 'A.K.',
      buttonType: 'Mother of Pearl',
      tailorNotes: 'Предоплата 50% внесена. Ткань отрезана со склада, запущен раскрой.',
      totalAmount: 220000,
      depositAmount: 110000,
      balanceAmount: 110000,
      paymentMethod: 'Карта',
      paymentStatus: 'PARTIAL',
      appointmentDate: '2026-09-21 17:00:00',
      targetCompletionDate: '2026-09-30',
      createTime: '2026-09-18 10:20:00'
    },
    {
      id: 5,
      orderNo: 'KN-202609-005',
      clientId: 5,
      clientName: 'Ислам Юсупов',
      clientPhone: '+7 (928) 444-55-66',
      channel: 'INSTAGRAM',
      productType: 'Костюм-тройка с жилетом',
      orderType: 'BESPOKE',
      status: 'TAILORING',
      height: 180,
      chest: 102,
      waist: 84,
      hips: 99,
      shoulderWidth: 46.5,
      sleeveLength: 63,
      trouserLength: 104,
      fabricBrand: 'Vitale Barberis Canonico',
      fabricSku: 'VBC-FLANNEL-33',
      fabricColor: 'Charcoal Grey',
      lapelType: 'Peak',
      fitType: 'Bespoke Silhouette',
      monogram: 'I.Y.',
      buttonType: 'Corozo',
      tailorNotes: 'Сборка бортовой ткани вручную портным Адамом. Примерка через 2 дня.',
      totalAmount: 195000,
      depositAmount: 100000,
      balanceAmount: 95000,
      paymentMethod: 'Банковский перевод',
      paymentStatus: 'PARTIAL',
      appointmentDate: '2026-09-24 16:00:00',
      targetCompletionDate: '2026-09-27',
      createTime: '2026-09-15 12:00:00'
    },
    {
      id: 6,
      orderNo: 'KN-202609-006',
      clientId: 1,
      clientName: 'Абубакар Кадыров',
      clientPhone: '+7 (928) 001-95-95',
      channel: 'SALON_GROZNY',
      productType: 'Классический пиджак RTW',
      orderType: 'RTW',
      status: 'DELIVERED',
      height: 184,
      chest: 105,
      waist: 86,
      hips: 101,
      shoulderWidth: 47,
      sleeveLength: 65,
      trouserLength: 107,
      fabricBrand: 'Loro Piana',
      fabricSku: 'LP-RTW-JACKET',
      fabricColor: 'Твидовая клетка',
      lapelType: 'Notch',
      fitType: 'Slim Fit',
      monogram: '',
      buttonType: 'Natural Horn',
      tailorNotes: 'Выдан в фирменном чехле KINGSNAME. 100% расчет.',
      totalAmount: 85000,
      depositAmount: 85000,
      balanceAmount: 0,
      paymentMethod: 'Наличные',
      paymentStatus: 'PAID',
      appointmentDate: '2026-09-19 14:00:00',
      targetCompletionDate: '2026-09-21',
      createTime: '2026-09-10 11:30:00'
    }
  ];

  private inventory: MockInventory[] = [
    { id: 1, itemType: 'SUIT', sku: 'KN-SUIT-BLK-48', name: 'Костюм-двойка Black Sartorial', size: '48', heightCategory: '176-182', color: 'Черный', stockQuantity: 4, unit: 'шт', minThreshold: 2, price: 75000 },
    { id: 2, itemType: 'SUIT', sku: 'KN-SUIT-BLK-50', name: 'Костюм-двойка Black Sartorial', size: '50', heightCategory: '176-182', color: 'Черный', stockQuantity: 1, unit: 'шт', minThreshold: 2, price: 75000 }, // LOW STOCK
    { id: 3, itemType: 'SUIT', sku: 'KN-SUIT-NAV-52', name: 'Костюм-тройка Royal Navy Heritage', size: '52', heightCategory: '182-188', color: 'Royal Navy', stockQuantity: 5, unit: 'шт', minThreshold: 2, price: 95000 },
    { id: 4, itemType: 'SUIT', sku: 'KN-SUIT-GRY-54', name: 'Костюм-двойка Charcoal Wool', size: '54', heightCategory: '182-188', color: 'Charcoal Grey', stockQuantity: 3, unit: 'шт', minThreshold: 2, price: 82000 },
    { id: 5, itemType: 'SUIT', sku: 'KN-SUIT-TWD-50', name: 'Костюм твидовый English Tweed', size: '50', heightCategory: '176-182', color: 'Твидовая клетка', stockQuantity: 2, unit: 'шт', minThreshold: 2, price: 89000 },
    { id: 6, itemType: 'FABRIC', sku: 'FAB-LP-SUPER150', name: 'Ткань Loro Piana Super 150s Wool', size: '', heightCategory: '', color: 'Royal Navy', stockQuantity: 42, unit: 'метр', minThreshold: 10, price: 18000 },
    { id: 7, itemType: 'FABRIC', sku: 'FAB-VBC-130S', name: 'Ткань Vitale Barberis Canonico 130s', size: '', heightCategory: '', color: 'Черный', stockQuantity: 65, unit: 'метр', minThreshold: 15, price: 12000 },
    { id: 8, itemType: 'FABRIC', sku: 'FAB-SCABAL-CASH', name: 'Ткань Scabal Кашемир 100%', size: '', heightCategory: '', color: 'Charcoal Grey', stockQuantity: 18, unit: 'метр', minThreshold: 8, price: 28000 },
    { id: 9, itemType: 'SHIRT', sku: 'KN-SHIRT-WHT-40', name: 'Сорочка ручной работы Poplin White', size: '50', heightCategory: '176-182', color: 'Белый', stockQuantity: 12, unit: 'шт', minThreshold: 3, price: 16000 },
    { id: 10, itemType: 'ACCESSORY', sku: 'KN-ACC-TIE-GOLD', name: 'Галстук шелковый KINGSNAME Gold Accent', size: '', heightCategory: '', color: 'Gold/Navy', stockQuantity: 15, unit: 'шт', minThreshold: 5, price: 8500 }
  ];

  private logs: MockLoginLog[] = [
    {
      id: 1,
      code: '88888888',
      userName: 'Шеф-Администратор KINGSNAME',
      roleCode: 'admin',
      ip: '127.0.0.1',
      userAgent: 'Chrome 128 / macOS',
      resultStatus: 1,
      resultMsg: 'Успешная авторизация по мастер-коду',
      loginTime: '2026-09-22 15:30:00'
    }
  ];

  // Rate Limiting simulation
  private failedAttempts = 0;
  private lockedUntil: number | null = null;

  // --- Auth Handlers ---
  public loginByCode(code: string) {
    const now = Date.now();
    if (this.lockedUntil && now < this.lockedUntil) {
      const remMinutes = Math.ceil((this.lockedUntil - now) / 60000);
      return {
        code: 429,
        data: null,
        msg: `Доступ заблокирован после 3 неверных попыток! Повторите через ${remMinutes} мин.`
      };
    }

    const matched = this.codes.find(c => c.code === code && c.status === 0);
    if (!matched) {
      this.failedAttempts++;
      const left = Math.max(0, 3 - this.failedAttempts);

      this.logs.unshift({
        id: this.logs.length + 1,
        code,
        userName: 'Неизвестный',
        roleCode: 'none',
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        resultStatus: 0,
        resultMsg: `Неверный код доступа. Осталось попыток: ${left}`,
        loginTime: new Date().toLocaleString('ru-RU')
      });

      if (this.failedAttempts >= 3) {
        this.lockedUntil = now + 15 * 60 * 1000; // 15 min lock
        return {
          code: 429,
          data: null,
          msg: 'Неверный код. Превышен лимит (3 попытки)! Система заблокирована на 15 минут.'
        };
      }
      return {
        code: 401,
        data: null,
        msg: `Неверный 8-значный код безопасности! Осталось попыток: ${left}`
      };
    }

    // Success
    this.failedAttempts = 0;
    this.lockedUntil = null;

    this.logs.unshift({
      id: this.logs.length + 1,
      code,
      userName: matched.userName,
      roleCode: matched.roleCode,
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
      resultStatus: 1,
      resultMsg: 'Успешный вход в CRM',
      loginTime: new Date().toLocaleString('ru-RU')
    });

    return {
      code: 0,
      data: {
        token: 'MOCK_KINGSNAME_JWT_TOKEN_' + matched.code,
        userId: matched.userId,
        userName: matched.userName,
        roleCode: matched.roleCode,
        code: matched.code
      },
      msg: 'OK'
    };
  }

  // --- Codes Handlers ---
  public getCodes() {
    return { code: 0, data: { list: [...this.codes], total: this.codes.length }, msg: 'OK' };
  }

  public generateCode(userName: string, roleCode: string, validType: number) {
    const random8 = String(Math.floor(10000000 + Math.random() * 90000000));
    const newCode: MockAccessCode = {
      id: this.codes.length + 1,
      code: random8,
      userId: 100 + this.codes.length,
      userName: userName || 'Сотрудник ' + random8.slice(-4),
      roleCode: roleCode || 'consultant',
      validType: validType || 1,
      expireTime: validType === 1 ? 'Через 12 часов' : validType === 2 ? 'Через 24 часа' : null,
      status: 0,
      createTime: new Date().toLocaleString('ru-RU')
    };
    this.codes.unshift(newCode);
    return { code: 0, data: newCode, msg: 'OK' };
  }

  public revokeCode(id: number) {
    const item = this.codes.find(c => c.id === id);
    if (item) item.status = 1;
    return { code: 0, data: true, msg: 'OK' };
  }

  public getLogs() {
    return { code: 0, data: { list: [...this.logs], total: this.logs.length }, msg: 'OK' };
  }

  // --- Clients Handlers ---
  public getClients(search?: string) {
    let list = [...this.clients];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.instagram.toLowerCase().includes(q));
    }
    return { code: 0, data: { list, total: list.length }, msg: 'OK' };
  }

  public saveClient(client: Partial<MockClient>) {
    if (client.id) {
      const idx = this.clients.findIndex(c => c.id === client.id);
      if (idx !== -1) {
        this.clients[idx] = { ...this.clients[idx], ...client } as MockClient;
        return { code: 0, data: this.clients[idx], msg: 'OK' };
      }
    }
    const newClient: MockClient = {
      id: this.clients.length + 1,
      name: client.name || '',
      phone: client.phone || '',
      city: client.city || 'Грозный',
      instagram: client.instagram || '',
      vipLevel: client.vipLevel || 1,
      totalSpent: client.totalSpent || 0,
      notes: client.notes || '',
      createTime: new Date().toLocaleString('ru-RU')
    };
    this.clients.unshift(newClient);
    return { code: 0, data: newClient, msg: 'OK' };
  }

  public deleteClient(id: number) {
    this.clients = this.clients.filter(c => c.id !== id);
    return { code: 0, data: true, msg: 'OK' };
  }

  // --- Orders Handlers ---
  public getOrders(status?: string, search?: string) {
    let list = [...this.orders];
    if (status) {
      list = list.filter(o => o.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => o.orderNo.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q) || o.productType.toLowerCase().includes(q));
    }
    return { code: 0, data: { list, total: list.length }, msg: 'OK' };
  }

  public saveOrder(order: Partial<MockOrder>) {
    if (order.id) {
      const idx = this.orders.findIndex(o => o.id === order.id);
      if (idx !== -1) {
        this.orders[idx] = { ...this.orders[idx], ...order } as MockOrder;
        return { code: 0, data: this.orders[idx], msg: 'OK' };
      }
    }

    const total = order.totalAmount || 0;
    const deposit = order.depositAmount || 0;
    const balance = Math.max(0, total - deposit);
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');

    const newOrder: MockOrder = {
      id: this.orders.length + 1,
      orderNo: `KN-${dateStr}-${String(this.orders.length + 1).padStart(3, '0')}`,
      clientId: order.clientId || 1,
      clientName: order.clientName || 'Новый Клиент',
      clientPhone: order.clientPhone || '+7 (928) 000-00-00',
      channel: order.channel || 'INSTAGRAM',
      productType: order.productType || 'Костюм-тройка',
      orderType: order.orderType || 'BESPOKE',
      status: order.status || 'LEAD',
      height: order.height || 180,
      chest: order.chest || 102,
      waist: order.waist || 85,
      hips: order.hips || 100,
      shoulderWidth: order.shoulderWidth || 47,
      sleeveLength: order.sleeveLength || 64,
      trouserLength: order.trouserLength || 105,
      fabricBrand: order.fabricBrand || 'Loro Piana',
      fabricSku: order.fabricSku || 'LP-BESPOKE',
      fabricColor: order.fabricColor || 'Royal Navy',
      lapelType: order.lapelType || 'Peak',
      fitType: order.fitType || 'Slim Fit',
      monogram: order.monogram || '',
      buttonType: order.buttonType || 'Natural Horn',
      tailorNotes: order.tailorNotes || '',
      totalAmount: total,
      depositAmount: deposit,
      balanceAmount: balance,
      paymentMethod: order.paymentMethod || 'Наличные',
      paymentStatus: balance === 0 ? 'PAID' : deposit > 0 ? 'PARTIAL' : 'PENDING',
      appointmentDate: order.appointmentDate || '2026-09-25 15:00:00',
      targetCompletionDate: order.targetCompletionDate || '2026-10-10',
      createTime: new Date().toLocaleString('ru-RU')
    };

    this.orders.unshift(newOrder);
    return { code: 0, data: newOrder, msg: 'OK' };
  }

  public updateOrderStatus(orderId: number, newStatus: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      if (newStatus === 'DELIVERED') {
        order.depositAmount = order.totalAmount;
        order.balanceAmount = 0;
        order.paymentStatus = 'PAID';
      }
    }
    return { code: 0, data: true, msg: 'OK' };
  }

  public recordPayment(orderId: number, amount: number, method: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.depositAmount += amount;
      order.balanceAmount = Math.max(0, order.totalAmount - order.depositAmount);
      order.paymentMethod = method || order.paymentMethod;
      order.paymentStatus = order.balanceAmount === 0 ? 'PAID' : 'PARTIAL';
    }
    return { code: 0, data: true, msg: 'OK' };
  }

  public deleteOrder(id: number) {
    this.orders = this.orders.filter(o => o.id !== id);
    return { code: 0, data: true, msg: 'OK' };
  }

  // --- Inventory Handlers ---
  public getInventory(itemType?: string, search?: string) {
    let list = [...this.inventory];
    if (itemType) list = list.filter(i => i.itemType === itemType);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.color.toLowerCase().includes(q));
    }
    return { code: 0, data: { list, total: list.length }, msg: 'OK' };
  }

  public saveInventoryItem(item: Partial<MockInventory>) {
    if (item.id) {
      const idx = this.inventory.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        this.inventory[idx] = { ...this.inventory[idx], ...item } as MockInventory;
        return { code: 0, data: this.inventory[idx], msg: 'OK' };
      }
    }
    const newItem: MockInventory = {
      id: this.inventory.length + 1,
      itemType: item.itemType || 'SUIT',
      sku: item.sku || `KN-ITEM-${this.inventory.length + 1}`,
      name: item.name || '',
      size: item.size || '50',
      heightCategory: item.heightCategory || '176-182',
      color: item.color || 'Черный',
      stockQuantity: item.stockQuantity || 1,
      unit: item.unit || 'шт',
      minThreshold: item.minThreshold || 2,
      price: item.price || 50000
    };
    this.inventory.unshift(newItem);
    return { code: 0, data: newItem, msg: 'OK' };
  }

  public updateStock(id: number, delta: number) {
    const item = this.inventory.find(i => i.id === id);
    if (item) {
      item.stockQuantity = Math.max(0, item.stockQuantity + delta);
    }
    return { code: 0, data: true, msg: 'OK' };
  }

  public deleteInventory(id: number) {
    this.inventory = this.inventory.filter(i => i.id !== id);
    return { code: 0, data: true, msg: 'OK' };
  }

  // --- Dashboard Handlers ---
  public getAnalytics() {
    const totalRev = this.orders.reduce((acc, o) => acc + o.depositAmount, 0);
    const totalOrders = this.orders.length;
    const avgCheck = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
    const activeTailoring = this.orders.filter(o => o.status === 'TAILORING').length;
    const fittingsToday = this.orders.filter(o => o.status === 'FITTING' || o.status === 'APPOINTMENT').length;

    const stages = ['LEAD', 'APPOINTMENT', 'FITTING', 'PAYMENT_AGREED', 'TAILORING', 'DELIVERED'];
    const funnel = stages.map(stage => {
      const match = this.orders.filter(o => o.status === stage);
      return {
        stage,
        count: match.length,
        totalAmount: match.reduce((a, b) => a + b.totalAmount, 0)
      };
    });

    const categoryMap: Record<string, number> = {};
    this.orders.forEach(o => {
      categoryMap[o.productType] = (categoryMap[o.productType] || 0) + o.totalAmount;
    });
    const categories = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const channelMap: Record<string, number> = {};
    this.orders.forEach(o => {
      channelMap[o.channel] = (channelMap[o.channel] || 0) + 1;
    });
    const channels = Object.entries(channelMap).map(([name, value]) => ({ name, value }));

    return {
      code: 0,
      data: {
        totalRevenue: totalRev,
        todayRevenue: 185000,
        totalOrderCount: totalOrders,
        averageCheck: avgCheck,
        activeTailoringCount: activeTailoring,
        fittingsTodayCount: fittingsToday,
        funnel,
        categories,
        channels
      },
      msg: 'OK'
    };
  }
}

export const mockDb = new MockDatabase();
