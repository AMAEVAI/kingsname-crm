/**
 * Comprehensive Mock Store for KINGSNAME CRM
 * Simulates Spring Boot + MySQL + Redis backend with full interactivity and 100% data synchronization.
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

export interface MockCashAccount {
  id: number;
  name: string;
  accountType: 'CASH' | 'POS' | 'BANK';
  balance: number;
  currency: string;
  accountNo?: string;
  updateTime: string;
}

export interface MockCashTransaction {
  id: number;
  transactionNo: string;
  accountId: number;
  accountName: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  relatedOrderNo?: string;
  operatorName: string;
  comment: string;
  createTime: string;
}

export interface MockPurchase {
  id: number;
  invoiceNo: string;
  supplier: string;
  materialType: 'FABRIC' | 'LINING' | 'BUTTONS' | 'ACCESSORY';
  materialName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalCost: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  accountId: number;
  paidAmount: number;
  arrivalDate: string;
  createTime: string;
}

export interface MockChannelAnalytics {
  channel: string;
  label: string;
  leadsCount: number;
  appointmentsCount: number;
  ordersCount: number;
  totalRevenue: number;
  avgCheck: number;
  conversionToAppointment: number;
  conversionToOrder: number;
  adSpend: number;
  netMargin: number;
  netProfit: number;
  icon: string;
}

export interface MockOrderEconomics {
  id: number;
  orderNo: string;
  clientName: string;
  channel: string;
  productType: string;
  fabricBrand: string;
  salePrice: number;
  fabricCost: number;
  materialsCost: number;
  tailorWorkCost: number;
  totalCogs: number;
  grossProfit: number;
  marginPercent: number;
  status: string;
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
    },
    {
      id: 6,
      name: 'Рамзан Магомадов',
      phone: '+7 (928) 777-88-99',
      city: 'Грозный',
      instagram: '@ramzan_m',
      vipLevel: 2,
      totalSpent: 240000,
      notes: 'Заказ через WhatsApp. Премиальный пошив из шерсти Loro Piana.',
      createTime: '2026-09-17 14:00:00'
    },
    {
      id: 7,
      name: 'Турпал-Али Хакимов',
      phone: '+7 (928) 555-44-33',
      city: 'Грозный',
      instagram: '@turpal_kh',
      vipLevel: 2,
      totalSpent: 280000,
      notes: 'Заказ через Telegram-канал. Смокинг Black Tie из ткани Scabal.',
      createTime: '2026-09-16 16:30:00'
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
      channel: 'SALON',
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
      channel: 'SALON',
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
      channel: 'SALON',
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
    },
    {
      id: 7,
      orderNo: 'KN-202609-007',
      clientId: 6,
      clientName: 'Рамзан Магомадов',
      clientPhone: '+7 (928) 777-88-99',
      channel: 'WHATSAPP',
      productType: 'Костюм-тройка Bespoke',
      orderType: 'BESPOKE',
      status: 'TAILORING',
      height: 182,
      chest: 104,
      waist: 86,
      hips: 100,
      shoulderWidth: 48,
      sleeveLength: 64,
      trouserLength: 105,
      fabricBrand: 'Loro Piana',
      fabricSku: 'LP-SUPER150-NAVY',
      fabricColor: 'Royal Navy',
      lapelType: 'Peak',
      fitType: 'Slim Fit',
      monogram: 'R.M.',
      buttonType: 'Natural Horn',
      tailorNotes: 'Заявка из WhatsApp (+7 928...). Раскрой шерсти Loro Piana.',
      totalAmount: 240000,
      depositAmount: 120000,
      balanceAmount: 120000,
      paymentMethod: 'Карта',
      paymentStatus: 'PARTIAL',
      appointmentDate: '2026-09-21 15:00:00',
      targetCompletionDate: '2026-10-05',
      createTime: '2026-09-17 14:00:00'
    },
    {
      id: 8,
      orderNo: 'KN-202609-008',
      clientId: 7,
      clientName: 'Турпал-Али Хакимов',
      clientPhone: '+7 (928) 555-44-33',
      channel: 'TELEGRAM',
      productType: 'Смокинг Black Tie',
      orderType: 'BESPOKE',
      status: 'PAYMENT_AGREED',
      height: 180,
      chest: 106,
      waist: 90,
      hips: 102,
      shoulderWidth: 47,
      sleeveLength: 63,
      trouserLength: 103,
      fabricBrand: 'Scabal',
      fabricSku: 'SCABAL-CASH',
      fabricColor: 'Black Tie',
      lapelType: 'Shawl',
      fitType: 'Regular Classic',
      monogram: 'U.D.',
      buttonType: 'Satin Covered',
      tailorNotes: 'Заказ через Telegram-канал KINGSNAME. Предоплата внесена на р/с.',
      totalAmount: 280000,
      depositAmount: 140000,
      balanceAmount: 140000,
      paymentMethod: 'Банковский перевод',
      paymentStatus: 'PARTIAL',
      appointmentDate: '2026-09-23 18:00:00',
      targetCompletionDate: '2026-10-08',
      createTime: '2026-09-16 16:30:00'
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

  private cashAccounts: MockCashAccount[] = [
    {
      id: 1,
      name: 'Сейф салона (Наличные)',
      accountType: 'CASH',
      balance: 1420000,
      currency: 'RUB',
      accountNo: 'SAFE-GROZNY-01',
      updateTime: '2026-09-22 16:30'
    },
    {
      id: 2,
      name: 'POS-терминал / СБП (Эквайринг)',
      accountType: 'POS',
      balance: 1980000,
      currency: 'RUB',
      accountNo: 'POS-KNG-9801',
      updateTime: '2026-09-22 17:00'
    },
    {
      id: 3,
      name: 'Расчетный счет KINGSNAME (Банк)',
      accountType: 'BANK',
      balance: 1450000,
      currency: 'RUB',
      accountNo: '40702810900000088888',
      updateTime: '2026-09-22 15:45'
    }
  ];

  private cashTransactions: MockCashTransaction[] = [
    {
      id: 1,
      transactionNo: 'TX-2026-001',
      accountId: 2,
      accountName: 'POS-терминал / СБП (Эквайринг)',
      type: 'INCOME',
      category: 'Предоплата 50%',
      amount: 120000,
      relatedOrderNo: 'KN-202609-007',
      operatorName: 'Шеф-Администратор',
      comment: 'Предоплата за пошив костюма Loro Piana (Рамзан Магомадов)',
      createTime: '2026-09-22 14:20'
    },
    {
      id: 2,
      transactionNo: 'TX-2026-002',
      accountId: 1,
      accountName: 'Сейф салона (Наличные)',
      type: 'INCOME',
      category: '100% Оплата',
      amount: 85000,
      relatedOrderNo: 'KN-202609-006',
      operatorName: 'Менеджер Direct/Сайт',
      comment: 'Полный расчет за классический пиджак RTW (Абубакар Кадыров)',
      createTime: '2026-09-22 13:45'
    },
    {
      id: 3,
      transactionNo: 'TX-2026-003',
      accountId: 3,
      accountName: 'Расчетный счет KINGSNAME (Банк)',
      type: 'INCOME',
      category: 'Предоплата 50%',
      amount: 140000,
      relatedOrderNo: 'KN-202609-008',
      operatorName: 'Шеф-Администратор',
      comment: 'Предоплата за смокинг Scabal (Турпал-Али Хакимов)',
      createTime: '2026-09-21 17:15'
    },
    {
      id: 4,
      transactionNo: 'TX-2026-004',
      accountId: 3,
      accountName: 'Расчетный счет KINGSNAME (Банк)',
      type: 'EXPENSE',
      category: 'Закупка ткани',
      amount: 385000,
      relatedOrderNo: 'LP-2026-88',
      operatorName: 'Шеф-Администратор',
      comment: 'Оплата инвойса Loro Piana S.p.A. (25м Super 150s Tasmanian)',
      createTime: '2026-09-21 16:30'
    },
    {
      id: 5,
      transactionNo: 'TX-2026-005',
      accountId: 1,
      accountName: 'Сейф салона (Наличные)',
      type: 'EXPENSE',
      category: 'Оплата портному',
      amount: 60000,
      relatedOrderNo: 'KN-202609-005',
      operatorName: 'Шеф-Администратор',
      comment: 'Аванс мастеру-портному Адаму за раскрой и сборку костюмов',
      createTime: '2026-09-21 12:00'
    },
    {
      id: 6,
      transactionNo: 'TX-2026-006',
      accountId: 2,
      accountName: 'POS-терминал / СБП (Эквайринг)',
      type: 'INCOME',
      category: 'Предоплата 50%',
      amount: 110000,
      relatedOrderNo: 'KN-202609-004',
      operatorName: 'Менеджер Direct/Сайт',
      comment: 'Предоплата за костюм-тройку Loro Piana (Абубакар Кадыров)',
      createTime: '2026-09-20 18:10'
    },
    {
      id: 7,
      transactionNo: 'TX-2026-007',
      accountId: 3,
      accountName: 'Расчетный счет KINGSNAME (Банк)',
      type: 'EXPENSE',
      category: 'Фурнитура и приклад',
      amount: 85000,
      relatedOrderNo: 'ACC-2026-01',
      operatorName: 'Шеф-Администратор',
      comment: 'Пуговицы из натурального рога буйвола + бортовка Lampo (Италия)',
      createTime: '2026-09-19 11:30'
    }
  ];

  private purchases: MockPurchase[] = [
    {
      id: 1,
      invoiceNo: 'LP-2026-88',
      supplier: 'Loro Piana S.p.A. (Италия)',
      materialType: 'FABRIC',
      materialName: 'Шерсть Super 150s Tasmanian Navy Twill',
      quantity: 25,
      unit: 'м',
      pricePerUnit: 15400,
      totalCost: 385000,
      paymentStatus: 'PAID',
      accountId: 3,
      paidAmount: 385000,
      arrivalDate: '2026-09-18',
      createTime: '2026-09-15'
    },
    {
      id: 2,
      invoiceNo: 'VBC-2026-04',
      supplier: 'Vitale Barberis Canonico (Италия)',
      materialType: 'FABRIC',
      materialName: 'Шерсть Super 130s Perennial Charcoal',
      quantity: 30,
      unit: 'м',
      pricePerUnit: 9200,
      totalCost: 276000,
      paymentStatus: 'PAID',
      accountId: 3,
      paidAmount: 276000,
      arrivalDate: '2026-09-20',
      createTime: '2026-09-16'
    },
    {
      id: 3,
      invoiceNo: 'SC-2026-12',
      supplier: 'Scabal (Англия/Бельгия)',
      materialType: 'FABRIC',
      materialName: 'Diamond Chip Super 180s Midnight Blue',
      quantity: 15,
      unit: 'м',
      pricePerUnit: 28000,
      totalCost: 420000,
      paymentStatus: 'PARTIAL',
      accountId: 3,
      paidAmount: 210000,
      arrivalDate: '2026-09-25',
      createTime: '2026-09-19'
    },
    {
      id: 4,
      invoiceNo: 'ACC-2026-01',
      supplier: 'Lampo & Cobrax (Италия)',
      materialType: 'BUTTONS',
      materialName: 'Пуговицы из рога буйвола (200 шт) + шелковая подкладка Cupro',
      quantity: 1,
      unit: 'компл',
      pricePerUnit: 85000,
      totalCost: 85000,
      paymentStatus: 'PAID',
      accountId: 3,
      paidAmount: 85000,
      arrivalDate: '2026-09-19',
      createTime: '2026-09-14'
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

  // --- Physical Inventory & Cash Synchronization Helpers ---
  private deductInventoryForOrder(order: MockOrder) {
    if (order.orderType === 'BESPOKE') {
      let meters = 3.5;
      const pt = order.productType.toLowerCase();
      if (pt.includes('двойка')) meters = 3.0;
      else if (pt.includes('тройка') || pt.includes('смокинг')) meters = 3.5;
      else if (pt.includes('пальто')) meters = 2.8;
      else if (pt.includes('пиджак')) meters = 2.0;
      else if (pt.includes('сорочка') || pt.includes('рубашка')) meters = 1.8;

      const brand = (order.fabricBrand || '').toLowerCase();
      const fabricItem = this.inventory.find(i =>
        i.itemType === 'FABRIC' && (
          (brand && i.name.toLowerCase().includes(brand.split(' ')[0])) ||
          (order.fabricSku && i.sku.toLowerCase().includes(order.fabricSku.toLowerCase()))
        )
      ) || this.inventory.find(i => i.itemType === 'FABRIC');

      if (fabricItem) {
        fabricItem.stockQuantity = Math.max(0, Math.round((fabricItem.stockQuantity - meters) * 10) / 10);
      }
    } else {
      const suit = this.inventory.find(i =>
        (i.itemType === 'SUIT' || i.itemType === 'SHIRT') && i.stockQuantity > 0
      );
      if (suit) {
        suit.stockQuantity = Math.max(0, suit.stockQuantity - 1);
      }
    }
  }

  private processPaymentFinance(order: MockOrder, amount: number, method: string, category: string) {
    if (amount <= 0) return;

    let targetAccountId = 2; // Default POS / Card / СБП
    if (method === 'Наличные') {
      targetAccountId = 1; // Safe
    } else if (method === 'Банковский перевод') {
      targetAccountId = 3; // Bank
    }

    const account = this.cashAccounts.find(a => a.id === targetAccountId);
    if (account) {
      account.balance += amount;
      account.updateTime = new Date().toLocaleString('ru-RU');
    }

    const newTx: MockCashTransaction = {
      id: this.cashTransactions.length + 1,
      transactionNo: 'TX-2026-' + String(this.cashTransactions.length + 101).padStart(3, '0'),
      accountId: targetAccountId,
      accountName: account?.name || 'Касса',
      type: 'INCOME',
      category,
      amount,
      relatedOrderNo: order.orderNo,
      operatorName: 'Шеф-Администратор',
      comment: `${category} по заказу ${order.orderNo} (${order.clientName})`,
      createTime: new Date().toLocaleString('ru-RU')
    };
    this.cashTransactions.unshift(newTx);
  }

  private syncClientWithOrder(order: MockOrder) {
    let client = this.clients.find(c => c.id === order.clientId || c.name.toLowerCase() === order.clientName.toLowerCase());
    const spent = Number(order.depositAmount) || 0;
    if (client) {
      client.totalSpent += spent;
      client.vipLevel = client.totalSpent >= 400000 ? 3 : client.totalSpent >= 200000 ? 2 : 1;
    } else {
      const newClient: MockClient = {
        id: this.clients.length + 1,
        name: order.clientName,
        phone: order.clientPhone,
        city: 'Грозный',
        instagram: '',
        vipLevel: spent >= 400000 ? 3 : spent >= 200000 ? 2 : 1,
        totalSpent: spent,
        notes: `Заказ ${order.orderNo} (${order.productType}, ${order.fabricBrand})`,
        createTime: new Date().toLocaleString('ru-RU')
      };
      this.clients.unshift(newClient);
      order.clientId = newClient.id;
    }
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
        const prev = this.orders[idx];
        const updated = { ...prev, ...order } as MockOrder;

        // If deposit increased, process additional payment into cash account
        const depositDiff = (updated.depositAmount || 0) - (prev.depositAmount || 0);
        if (depositDiff > 0) {
          this.processPaymentFinance(updated, depositDiff, updated.paymentMethod, 'Доплата по заказу');
          const client = this.clients.find(c => c.id === updated.clientId);
          if (client) {
            client.totalSpent += depositDiff;
            client.vipLevel = client.totalSpent >= 400000 ? 3 : client.totalSpent >= 200000 ? 2 : 1;
          }
        }

        // If delivered and balance remains, settle balance
        if (updated.status === 'DELIVERED' && prev.status !== 'DELIVERED') {
          const remaining = updated.balanceAmount || 0;
          if (remaining > 0) {
            updated.depositAmount = updated.totalAmount;
            updated.balanceAmount = 0;
            updated.paymentStatus = 'PAID';
            this.processPaymentFinance(updated, remaining, updated.paymentMethod, 'Окончательный расчет (100%)');
            const client = this.clients.find(c => c.id === updated.clientId);
            if (client) {
              client.totalSpent += remaining;
              client.vipLevel = client.totalSpent >= 400000 ? 3 : client.totalSpent >= 200000 ? 2 : 1;
            }
          }
        }

        this.orders[idx] = updated;
        return { code: 0, data: this.orders[idx], msg: 'OK' };
      }
    }

    const total = Number(order.totalAmount) || 0;
    const deposit = Number(order.depositAmount) || 0;
    const balance = Math.max(0, total - deposit);
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');

    const newOrder: MockOrder = {
      id: this.orders.length + 1,
      orderNo: `KN-${dateStr}-${String(this.orders.length + 1).padStart(3, '0')}`,
      clientId: order.clientId || 1,
      clientName: order.clientName || 'Новый Клиент',
      clientPhone: order.clientPhone || '+7 (928) 000-00-00',
      channel: (order.channel || 'INSTAGRAM').toUpperCase(),
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

    // 1. Deduct physical stock / meters from inventory
    this.deductInventoryForOrder(newOrder);

    // 2. Add cash deposit to accounts & log income transaction
    if (deposit > 0) {
      this.processPaymentFinance(
        newOrder,
        deposit,
        newOrder.paymentMethod,
        deposit >= total ? '100% Оплата' : 'Предоплата 50%'
      );
    }

    // 3. Synchronize customer metrics
    this.syncClientWithOrder(newOrder);

    this.orders.unshift(newOrder);
    return { code: 0, data: newOrder, msg: 'OK' };
  }

  public updateOrderStatus(orderId: number, newStatus: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      const prevStatus = order.status;
      order.status = newStatus;

      // When order is delivered and has pending balance, settle remaining debt
      if (newStatus === 'DELIVERED' && prevStatus !== 'DELIVERED') {
        const remaining = order.balanceAmount;
        if (remaining > 0) {
          order.depositAmount = order.totalAmount;
          order.balanceAmount = 0;
          order.paymentStatus = 'PAID';
          this.processPaymentFinance(order, remaining, order.paymentMethod, 'Окончательный расчет (100%)');

          const client = this.clients.find(c => c.id === order.clientId);
          if (client) {
            client.totalSpent += remaining;
            client.vipLevel = client.totalSpent >= 400000 ? 3 : client.totalSpent >= 200000 ? 2 : 1;
          }
        }
      }
    }
    return { code: 0, data: true, msg: 'OK' };
  }

  public recordPayment(orderId: number, amount: number, method: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      const payAmt = Math.min(amount, order.balanceAmount > 0 ? order.balanceAmount : amount);
      order.depositAmount += payAmt;
      order.balanceAmount = Math.max(0, order.totalAmount - order.depositAmount);
      order.paymentMethod = method || order.paymentMethod;
      order.paymentStatus = order.balanceAmount === 0 ? 'PAID' : 'PARTIAL';

      this.processPaymentFinance(
        order,
        payAmt,
        order.paymentMethod,
        order.balanceAmount === 0 ? '100% Оплата' : 'Доплата по заказу'
      );

      const client = this.clients.find(c => c.id === order.clientId);
      if (client) {
        client.totalSpent += payAmt;
        client.vipLevel = client.totalSpent >= 400000 ? 3 : client.totalSpent >= 200000 ? 2 : 1;
      }
    }
    return { code: 0, data: true, msg: 'OK' };
  }

  public deleteOrder(id: number) {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      // Restore inventory meters / suits
      if (order.orderType === 'BESPOKE') {
        const fabricItem = this.inventory.find(i =>
          i.itemType === 'FABRIC' && i.name.toLowerCase().includes((order.fabricBrand || '').toLowerCase())
        ) || this.inventory.find(i => i.itemType === 'FABRIC');
        if (fabricItem) {
          fabricItem.stockQuantity += 3.5;
        }
      } else {
        const suit = this.inventory.find(i => i.itemType === 'SUIT');
        if (suit) suit.stockQuantity += 1;
      }
    }
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
    const totalRev = this.orders.reduce((acc, o) => acc + (o.depositAmount || 0), 0);
    const totalOrders = this.orders.length;
    const avgCheck = totalOrders > 0 ? Math.round(this.orders.reduce((a, b) => a + b.totalAmount, 0) / totalOrders) : 0;
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
      const ch = (o.channel || 'INSTAGRAM').toUpperCase();
      channelMap[ch] = (channelMap[ch] || 0) + 1;
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

  // --- Finance & Accounting Handlers ---
  public getFinanceOverview() {
    const totalLiquid = this.cashAccounts.reduce((acc, a) => acc + a.balance, 0);
    
    // Dynamic calculation of order revenue
    const liveOrderRevenue = this.orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalRevenue = Math.max(liveOrderRevenue, 10870000);
    
    // Direct COGS from material purchases + tailors
    const totalCogs = Math.round(totalRevenue * 0.353);
    
    // Live opex from cash transactions
    const opexFromTx = this.cashTransactions
      .filter(t => t.type === 'EXPENSE' && t.category !== 'Закупка ткани')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalOpex = Math.max(opexFromTx + 1800000, 2150000);
    
    const netProfit = totalRevenue - totalCogs - totalOpex;
    const netMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;

    return {
      code: 0,
      data: {
        totalLiquid,
        totalRevenue,
        totalCogs,
        totalOpex,
        netProfit,
        netMarginPercent,
        pnlTrend: {
          months: ['Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
          revenue: [1200000, 1450000, 1680000, 1920000, 2150000, Math.round(totalRevenue / 4.4)],
          cogs: [450000, 520000, 610000, 680000, 740000, Math.round(totalCogs / 4.4)],
          netProfit: [520000, 660000, 770000, 890000, 980000, Math.round(netProfit / 4.4)]
        },
        expenseStructure: [
          { name: 'Ткани и материалы (Loro Piana, VBC, Scabal)', value: 52 },
          { name: 'Работа мастеров-портных', value: 26 },
          { name: 'Аренда флагманского салона', value: 12 },
          { name: 'Фирменная упаковка и кофры', value: 5 },
          { name: 'Маркетинг и реклама', value: 5 }
        ]
      },
      msg: 'OK'
    };
  }

  public getChannelAnalytics() {
    const channelDefinitions = [
      {
        key: 'INSTAGRAM',
        label: 'Instagram @kingsname',
        icon: 'Instagram',
        baseLeads: 28,
        adSpend: 180000,
      },
      {
        key: 'WHATSAPP',
        label: 'WhatsApp Салон (+7 928...)',
        icon: 'MessageSquare',
        baseLeads: 18,
        adSpend: 60000,
      },
      {
        key: 'TELEGRAM',
        label: 'Telegram Канал & Чат',
        icon: 'Send',
        baseLeads: 14,
        adSpend: 45000,
      },
      {
        key: 'SALON',
        label: 'Прямой визит в салон / Рекомендации',
        icon: 'Crown',
        baseLeads: 8,
        adSpend: 0,
      },
    ];

    const results: MockChannelAnalytics[] = channelDefinitions.map(def => {
      const ordersInCh = this.orders.filter(o => {
        const ch = (o.channel || '').toUpperCase();
        if (def.key === 'SALON') {
          return ch === 'SALON' || ch === 'SALON_GROZNY' || ch === 'PHONE' || ch === 'WEBSITE';
        }
        return ch === def.key;
      });

      const ordersCount = ordersInCh.filter(o => o.status !== 'LEAD').length;
      const appointmentsCount = ordersInCh.filter(o =>
        ['APPOINTMENT', 'FITTING', 'PAYMENT_AGREED', 'TAILORING', 'DELIVERED'].includes(o.status)
      ).length;

      const liveRevenue = ordersInCh.reduce((sum, o) => {
        return sum + (o.depositAmount > 0 ? o.totalAmount : 0);
      }, 0);

      // Baseline synthetic turnover for realistic high-end salon metrics
      const baselineRev = def.key === 'INSTAGRAM' ? 3000000 : def.key === 'WHATSAPP' ? 2400000 : def.key === 'TELEGRAM' ? 1100000 : 2800000;
      const totalRevenue = baselineRev + liveRevenue;
      const totalOrdersCount = ordersCount + (def.key === 'INSTAGRAM' ? 16 : def.key === 'WHATSAPP' ? 13 : def.key === 'TELEGRAM' ? 6 : 13);
      const leadsCount = def.baseLeads + ordersInCh.length + (def.key === 'INSTAGRAM' ? 18 : def.key === 'WHATSAPP' ? 15 : def.key === 'TELEGRAM' ? 7 : 9);
      const apptsCount = appointmentsCount + (def.key === 'INSTAGRAM' ? 25 : def.key === 'WHATSAPP' ? 20 : def.key === 'TELEGRAM' ? 10 : 15);

      const avgCheck = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 180000;
      const conversionToAppointment = leadsCount > 0 ? Math.round((apptsCount / leadsCount) * 1000) / 10 : 0;
      const conversionToOrder = leadsCount > 0 ? Math.round((totalOrdersCount / leadsCount) * 1000) / 10 : 0;

      const cogs = Math.round(totalRevenue * 0.36);
      const netProfit = Math.max(0, totalRevenue - cogs - def.adSpend);
      const netMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;

      return {
        channel: def.key,
        label: def.label,
        leadsCount,
        appointmentsCount: apptsCount,
        ordersCount: totalOrdersCount,
        totalRevenue,
        avgCheck,
        conversionToAppointment: Math.min(96, Math.max(45, conversionToAppointment)),
        conversionToOrder: Math.min(88, Math.max(30, conversionToOrder)),
        adSpend: def.adSpend,
        netMargin,
        netProfit,
        icon: def.icon
      };
    });

    return {
      code: 0,
      data: results,
      msg: 'OK'
    };
  }

  public getCashAccounts() {
    return {
      code: 0,
      data: [...this.cashAccounts],
      msg: 'OK'
    };
  }

  public getCashTransactions(params?: { type?: string; accountId?: number }) {
    let list = [...this.cashTransactions];
    if (params?.type) {
      list = list.filter(t => t.type === params.type);
    }
    if (params?.accountId) {
      list = list.filter(t => t.accountId === Number(params.accountId));
    }
    return {
      code: 0,
      data: { list, total: list.length },
      msg: 'OK'
    };
  }

  public createCashTransaction(data: any) {
    const amount = Number(data.amount) || 0;
    const account = this.cashAccounts.find(a => a.id === Number(data.accountId));
    if (account) {
      if (data.type === 'INCOME') {
        account.balance += amount;
      } else {
        account.balance = Math.max(0, account.balance - amount);
      }
      account.updateTime = new Date().toLocaleString('ru-RU');
    }

    const newTx: MockCashTransaction = {
      id: this.cashTransactions.length + 1,
      transactionNo: 'TX-2026-' + String(this.cashTransactions.length + 101).padStart(3, '0'),
      accountId: Number(data.accountId) || 1,
      accountName: account?.name || 'Сейф салона (Наличные)',
      type: data.type || 'INCOME',
      category: data.category || 'Прочее',
      amount,
      relatedOrderNo: data.relatedOrderNo || '',
      operatorName: data.operatorName || 'Шеф-Администратор',
      comment: data.comment || '',
      createTime: new Date().toLocaleString('ru-RU')
    };
    this.cashTransactions.unshift(newTx);
    return { code: 0, data: newTx, msg: 'OK' };
  }

  public getPurchases(params?: { supplier?: string; status?: string }) {
    let list = [...this.purchases];
    if (params?.supplier) {
      list = list.filter(p => p.supplier.toLowerCase().includes(params.supplier!.toLowerCase()));
    }
    if (params?.status) {
      list = list.filter(p => p.paymentStatus === params.status);
    }
    return {
      code: 0,
      data: { list, total: list.length },
      msg: 'OK'
    };
  }

  public createPurchase(data: any) {
    const quantity = Number(data.quantity) || 10;
    const pricePerUnit = Number(data.pricePerUnit) || 12000;
    const totalCost = Number(data.totalCost) || (quantity * pricePerUnit);
    const paidAmount = data.paymentStatus === 'PAID' ? totalCost : data.paymentStatus === 'PARTIAL' ? totalCost / 2 : 0;
    const accountId = Number(data.accountId) || 3;

    // 1. Deduct cash from account & register expense transaction
    if (paidAmount > 0) {
      const account = this.cashAccounts.find(a => a.id === accountId);
      if (account) {
        account.balance = Math.max(0, account.balance - paidAmount);
        account.updateTime = new Date().toLocaleString('ru-RU');
      }

      this.cashTransactions.unshift({
        id: this.cashTransactions.length + 1,
        transactionNo: 'TX-2026-' + String(this.cashTransactions.length + 101).padStart(3, '0'),
        accountId: account ? account.id : 3,
        accountName: account ? account.name : 'Расчетный счет KINGSNAME (Банк)',
        type: 'EXPENSE',
        category: 'Закупка ткани',
        amount: paidAmount,
        relatedOrderNo: data.invoiceNo || 'INV-2026-NEW',
        operatorName: 'Шеф-Администратор',
        comment: `Закупка: ${data.materialName} (${data.supplier})`,
        createTime: new Date().toLocaleString('ru-RU')
      });
    }

    // 2. Physical inventory synchronization (credit fabric meters or accessories)
    if (data.materialType === 'FABRIC' || !data.materialType) {
      const existingFabric = this.inventory.find(i =>
        i.itemType === 'FABRIC' && (
          i.name.toLowerCase().includes(data.materialName.toLowerCase()) ||
          data.materialName.toLowerCase().includes(i.name.toLowerCase())
        )
      );

      if (existingFabric) {
        existingFabric.stockQuantity += quantity;
        existingFabric.price = Math.round(pricePerUnit * 1.5);
      } else {
        const brandShort = (data.supplier || 'FAB').slice(0, 3).toUpperCase();
        this.inventory.unshift({
          id: this.inventory.length + 1,
          itemType: 'FABRIC',
          sku: `FAB-${brandShort}-${Date.now().toString().slice(-4)}`,
          name: data.materialName.startsWith('Ткань') ? data.materialName : `Ткань ${data.materialName}`,
          color: 'Итальянская шерсть',
          stockQuantity: quantity,
          unit: data.unit || 'метр',
          minThreshold: 10,
          price: Math.round(pricePerUnit * 1.5)
        });
      }
    } else {
      const existingAcc = this.inventory.find(i => i.itemType === 'ACCESSORY');
      if (existingAcc) {
        existingAcc.stockQuantity += quantity;
      }
    }

    const newPurchase: MockPurchase = {
      id: this.purchases.length + 1,
      invoiceNo: data.invoiceNo || 'LP-2026-' + (this.purchases.length + 100),
      supplier: data.supplier || 'Loro Piana S.p.A. (Италия)',
      materialType: data.materialType || 'FABRIC',
      materialName: data.materialName || '',
      quantity,
      unit: data.unit || 'м',
      pricePerUnit,
      totalCost,
      paymentStatus: data.paymentStatus || 'PAID',
      accountId,
      paidAmount,
      arrivalDate: data.arrivalDate || '2026-10-01',
      createTime: new Date().toISOString().split('T')[0]
    };
    this.purchases.unshift(newPurchase);
    return { code: 0, data: newPurchase, msg: 'OK' };
  }

  public getOrderEconomics() {
    const statusLabels: Record<string, string> = {
      LEAD: 'Новый лид',
      APPOINTMENT: 'Запись на примерку',
      FITTING: 'Снятие мерок',
      PAYMENT_AGREED: 'Согласован',
      TAILORING: 'В пошиве',
      DELIVERED: 'Готов / Закрыт'
    };

    const list: MockOrderEconomics[] = this.orders.map(o => {
      const salePrice = o.totalAmount;
      const fb = (o.fabricBrand || '').toLowerCase();
      let fabricRate = 0.20;
      if (fb.includes('loro piana')) fabricRate = 0.24;
      else if (fb.includes('scabal')) fabricRate = 0.26;
      else if (fb.includes('vitale') || fb.includes('vbc')) fabricRate = 0.18;

      const fabricCost = Math.round(salePrice * fabricRate);
      const materialsCost = Math.round(salePrice * 0.05); // lining, buttons, canvas
      const tailorWorkCost = Math.round(salePrice * 0.16); // tailor Adam fee
      const totalCogs = fabricCost + materialsCost + tailorWorkCost;
      const grossProfit = salePrice - totalCogs;
      const marginPercent = salePrice > 0 ? Math.round((grossProfit / salePrice) * 1000) / 10 : 0;

      return {
        id: o.id,
        orderNo: o.orderNo,
        clientName: o.clientName,
        channel: o.channel,
        productType: o.productType,
        fabricBrand: `${o.fabricBrand} (${o.fabricColor})`,
        salePrice,
        fabricCost,
        materialsCost,
        tailorWorkCost,
        totalCogs,
        grossProfit,
        marginPercent,
        status: statusLabels[o.status] || o.status
      };
    });

    return {
      code: 0,
      data: { list, total: list.length },
      msg: 'OK'
    };
  }
}

export const mockDb = new MockDatabase();
