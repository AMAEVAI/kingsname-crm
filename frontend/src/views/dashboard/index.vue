<template>
  <div class="kn-dashboard">
    <!-- Top Greeting & Header -->
    <div class="kn-dash-header">
      <div>
        <h1 class="kn-dash-title font-brand">Аналитический Центр KINGSNAME</h1>
        <p class="kn-dash-subtitle">
          Грозный • Мониторинг ключевых показателей бренда, пошива и воронки продаж в реальном времени
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="kn-dash-actions">
        <button class="kn-btn-action insta" @click="openQuickLeadModal">
          <Instagram :size="16" :stroke-width="1.8" class="kn-btn-icon" />
          <span>+ Лид @kingsname</span>
        </button>
        <button class="kn-btn-action appoint" @click="openAppointmentModal">
          <CalendarPlus :size="16" :stroke-width="1.8" class="kn-btn-icon" />
          <span>+ Запись на примерку</span>
        </button>
        <button class="kn-btn-action bespoke" @click="router.push('/orders')">
          <Scissors :size="16" :stroke-width="1.8" class="kn-btn-icon" />
          <span>Оформить пошив</span>
        </button>
      </div>
    </div>

    <!-- 1. KPI Statistics Cards Row -->
    <div class="kn-kpi-grid">
      <!-- Total Revenue -->
      <div class="kn-card kn-kpi-card">
        <div class="kn-kpi-header">
          <span class="kn-kpi-title">Общая выручка (месяц)</span>
          <span class="kn-kpi-badge positive">+24.8%</span>
        </div>
        <div class="kn-kpi-value font-outfit">
          {{ formatMoney(analytics.totalRevenue || 1245000) }} ₽
        </div>
        <div class="kn-kpi-footer">
          <span class="kn-kpi-sub">Оформлено {{ analytics.totalOrderCount }} заказов</span>
        </div>
      </div>

      <!-- Today's Revenue -->
      <div class="kn-card kn-kpi-card">
        <div class="kn-kpi-header">
          <span class="kn-kpi-title">Выручка за сегодня</span>
          <span class="kn-kpi-icon">
            <Banknote :size="18" :stroke-width="1.8" />
          </span>
        </div>
        <div class="kn-kpi-value font-outfit">
          {{ formatMoney(analytics.todayRevenue || 185000) }} ₽
        </div>
        <div class="kn-kpi-footer">
          <span class="kn-kpi-sub">Включая предоплаты по пошиву</span>
        </div>
      </div>

      <!-- Average Check -->
      <div class="kn-card kn-kpi-card">
        <div class="kn-kpi-header">
          <span class="kn-kpi-title">Средний чек изделия</span>
          <span class="kn-kpi-icon">
            <Crown :size="18" :stroke-width="1.8" />
          </span>
        </div>
        <div class="kn-kpi-value font-outfit">
          {{ formatMoney(analytics.averageCheck || 165000) }} ₽
        </div>
        <div class="kn-kpi-footer">
          <span class="kn-kpi-sub">Сегмент Haute Bespoke & RTW</span>
        </div>
      </div>

      <!-- Active Tailoring Orders -->
      <div class="kn-card kn-kpi-card">
        <div class="kn-kpi-header">
          <span class="kn-kpi-title">В пошиве у мастеров</span>
          <span class="kn-kpi-badge warning">Ателье</span>
        </div>
        <div class="kn-kpi-value font-outfit">
          {{ analytics.activeTailoringCount || 4 }} <span class="kn-unit">костюма</span>
        </div>
        <div class="kn-kpi-footer">
          <span class="kn-kpi-sub">Мастерская портного Адама</span>
        </div>
      </div>

      <!-- Fittings Today -->
      <div class="kn-card kn-kpi-card">
        <div class="kn-kpi-header">
          <span class="kn-kpi-title">Примерок в салоне</span>
          <span class="kn-kpi-badge info">Сегодня</span>
        </div>
        <div class="kn-kpi-value font-outfit">
          {{ analytics.fittingsTodayCount || 3 }} <span class="kn-unit">записи</span>
        </div>
        <div class="kn-kpi-footer">
          <span class="kn-kpi-sub">Салон KINGSNAME, Грозный</span>
        </div>
      </div>
    </div>

    <!-- 2. 6-Stage Bespoke Sales & Tailoring Funnel -->
    <div class="kn-card kn-funnel-section">
      <div class="kn-section-header">
        <div>
          <div class="kn-funnel-title-row">
            <h2 class="kn-section-title font-brand">Воронка Продаж и Индивидуального Пошива KINGSNAME</h2>
            <button
              v-if="isMobile"
              class="kn-swipe-hint-btn font-outfit"
              @click="scrollFunnel(1)"
              title="Перейти к следующему этапу"
            >
              <span>Свайп</span>
              <ChevronRight :size="13" />
            </button>
          </div>
          <p class="kn-section-sub">
            Жизненный цикл классического мужского костюма: от обращения в Instagram до выдачи клиенту
          </p>
        </div>
        <button class="kn-view-all-orders-btn" @click="router.push('/orders')">
          <span>Все заказы в таблице</span>
          <ArrowRight :size="14" :stroke-width="2" />
        </button>
      </div>

      <!-- Funnel Progress Steps Grid with Swipe & Mouse Drag -->
      <div
        ref="funnelRef"
        class="kn-funnel-steps"
        :class="{ 'is-dragging': isDragging }"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @scroll.passive="onFunnelScroll"
      >
        <div
          v-for="(stage, idx) in funnelStages"
          :key="stage.key"
          class="kn-funnel-card"
          :class="{ active: selectedFunnelStage === stage.key }"
          @click="handleStageClick(stage.key)"
        >
          <div class="kn-funnel-top">
            <span class="kn-step-num">0{{ idx + 1 }}</span>
            <span class="kn-stage-icon">
              <component :is="stage.icon" :size="20" :stroke-width="1.8" />
            </span>
          </div>

          <h3 class="kn-stage-name">{{ stage.label }}</h3>
          <p class="kn-stage-desc">{{ stage.description }}</p>

          <div class="kn-funnel-metrics">
            <div class="kn-metric-count">
              <strong>{{ getStageCount(stage.key) }}</strong> заказов
            </div>
            <div class="kn-metric-sum font-outfit">
              {{ formatMoney(getStageSum(stage.key)) }} ₽
            </div>
          </div>

          <div class="kn-funnel-indicator"></div>
        </div>
      </div>

      <!-- Mobile / Responsive Stepper Navigation Controls -->
      <div v-if="isMobile" class="kn-funnel-stepper-bar">
        <button
          class="kn-stepper-arrow-btn"
          :disabled="currentFunnelIndex === 0"
          @click="scrollFunnel(-1)"
          aria-label="Предыдущий этап"
        >
          <ChevronLeft :size="15" />
        </button>

        <div class="kn-stepper-dots">
          <button
            v-for="(stage, idx) in funnelStages"
            :key="stage.key"
            class="kn-stepper-dot"
            :class="{ active: currentFunnelIndex === idx }"
            @click="scrollToStageIndex(idx)"
            :aria-label="'Этап ' + (idx + 1) + ': ' + stage.label"
          >
            <span class="kn-dot-inner"></span>
          </button>
        </div>

        <button
          class="kn-stepper-arrow-btn"
          :disabled="currentFunnelIndex >= funnelStages.length - 1"
          @click="scrollFunnel(1)"
          aria-label="Следующий этап"
        >
          <ChevronRight :size="15" />
        </button>
      </div>
    </div>

    <!-- 3. ECharts Row: Dynamics & Categories -->
    <div class="kn-charts-grid">
      <!-- Left Chart: Revenue Trend -->
      <div class="kn-card kn-chart-card">
        <div class="kn-chart-header">
          <h3 class="kn-chart-title font-brand">Динамика Выручки KINGSNAME</h3>
          <span class="kn-chart-legend-label">Месячные показатели (₽)</span>
        </div>
        <div ref="trendChartRef" class="kn-echarts-container"></div>
      </div>

      <!-- Right Chart: Category Breakdown -->
      <div class="kn-card kn-chart-card">
        <div class="kn-chart-header">
          <h3 class="kn-chart-title font-brand">Категории Изделий</h3>
          <span class="kn-chart-legend-label">Доля в продажах</span>
        </div>
        <div ref="categoryChartRef" class="kn-echarts-container"></div>
      </div>
    </div>

    <!-- 4. Active Orders & Appointments Quick Table -->
    <div class="kn-card kn-recent-orders-card">
      <div class="kn-section-header">
        <div>
          <h2 class="kn-section-title font-brand">Заказы в Работе и Ближайшие Примерки</h2>
          <p class="kn-section-sub">Оперативный контроль пошива и согласования мерок</p>
        </div>
        <el-button type="primary" plain size="small" @click="router.push('/orders')">
          Управление заказами
        </el-button>
      </div>

      <!-- Desktop Table View -->
      <el-table v-if="!isMobile" :data="recentOrders" style="width: 100%">
        <el-table-column prop="orderNo" label="№ Заказа" width="150">
          <template #default="{ row }">
            <span class="kn-order-badge font-outfit">{{ row.orderNo }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="clientName" label="Клиент">
          <template #default="{ row }">
            <div class="kn-client-cell">
              <strong>{{ row.clientName }}</strong>
              <span class="kn-client-sub">{{ row.clientPhone }} • {{ row.channel }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="productType" label="Изделие">
          <template #default="{ row }">
            <div>
              <span>{{ row.productType }}</span>
              <span class="kn-fabric-tag font-outfit">{{ row.fabricBrand }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="Статус" width="180">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" effect="dark">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="totalAmount" label="Сумма / Предоплата" width="200" align="right">
          <template #default="{ row }">
            <div class="kn-fin-cell font-outfit">
              <strong>{{ formatMoney(row.totalAmount) }} ₽</strong>
              <span v-if="row.balanceAmount > 0" class="kn-fin-debt">
                Остаток: {{ formatMoney(row.balanceAmount) }} ₽
              </span>
              <span v-else class="kn-fin-paid">Оплачен 100%</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Mobile Luxury Cards View -->
      <div v-else class="kn-mobile-orders-list">
        <div
          v-for="row in recentOrders"
          :key="row.id"
          class="kn-mobile-order-card"
          @click="router.push('/orders')"
        >
          <div class="kn-mo-header">
            <span class="kn-order-badge font-outfit">{{ row.orderNo }}</span>
            <el-tag :type="getStatusTagType(row.status)" size="small" effect="dark">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </div>

          <div class="kn-mo-client-row">
            <div class="kn-mo-client-info">
              <strong class="kn-mo-name">{{ row.clientName }}</strong>
              <span class="kn-mo-sub">{{ row.clientPhone }} • {{ row.channel }}</span>
            </div>
            <div class="kn-mo-amount font-outfit">
              <span class="kn-mo-price">{{ formatMoney(row.totalAmount) }} ₽</span>
              <span v-if="row.balanceAmount > 0" class="kn-fin-debt">
                Остаток: {{ formatMoney(row.balanceAmount) }} ₽
              </span>
              <span v-else class="kn-fin-paid">Оплачен 100%</span>
            </div>
          </div>

          <div class="kn-mo-suit-row">
            <span class="kn-mo-suit-type">{{ row.productType }}</span>
            <span class="kn-fabric-tag font-outfit">{{ row.fabricBrand }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Lead Modal (Multi-Channel) -->
    <el-dialog v-model="quickLeadVisible" title="Быстрая фиксация заявки (Лида)" :width="modalWidth">
      <el-form :model="leadForm" label-position="top">
        <!-- Invisible Honeypot Trap for automated spam bots -->
        <div class="kn-hp-field" aria-hidden="true" style="position: absolute; opacity: 0; pointer-events: none; height: 0; width: 0; overflow: hidden; z-index: -999;">
          <label for="lead_hp">Leave empty</label>
          <input id="lead_hp" v-model="leadForm.hp" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <el-form-item label="Канал обращения">
          <el-select v-model="leadForm.channel" style="width: 100%">
            <el-option label="Instagram (@kingsname)" value="INSTAGRAM" />
            <el-option label="WhatsApp Салон (+7 928...)" value="WHATSAPP" />
            <el-option label="Telegram Канал & Чат" value="TELEGRAM" />
            <el-option label="Салон KINGSNAME (Грозный)" value="SALON" />
            <el-option label="Сайт (kingsname.store)" value="WEBSITE" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="leadForm.channel === 'INSTAGRAM'" label="Instagram аккаунт клиента">
          <el-input v-model="leadForm.instagram" placeholder="@username" />
        </el-form-item>
        <el-form-item label="ФИО клиента">
          <el-input v-model="leadForm.name" placeholder="Например: Абубакар Кадыров" />
        </el-form-item>
        <el-form-item label="Номер телефона">
          <el-input v-model="leadForm.phone" placeholder="+7 (928) 000-00-00" />
        </el-form-item>
        <el-form-item label="Интересующее изделие">
          <el-select v-model="leadForm.productType" placeholder="Выберите тип">
            <el-option label="Костюм-тройка Bespoke" value="Костюм-тройка" />
            <el-option label="Смокинг Black Tie" value="Смокинг" />
            <el-option label="Костюм-двойка" value="Костюм-двойка" />
            <el-option label="Пальто кашемировое" value="Пальто" />
            <el-option label="Сорочка ручной работы" value="Сорочка" />
          </el-select>
        </el-form-item>
        <el-form-item label="Комментарий / Пожелания">
          <el-input v-model="leadForm.tailorNotes" type="textarea" placeholder="Уточнения из директа..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="quickLeadVisible = false">Отмена</el-button>
        <el-button type="primary" @click="saveQuickLead">Сохранить лид в воронку</el-button>
      </template>
    </el-dialog>

    <!-- Quick Appointment Modal -->
    <el-dialog v-model="appointmentVisible" title="Запись на примерку в салон (г. Грозный)" :width="modalWidth">
      <el-form :model="appointForm" label-position="top">
        <!-- Invisible Honeypot Trap for automated spam bots -->
        <div class="kn-hp-field" aria-hidden="true" style="position: absolute; opacity: 0; pointer-events: none; height: 0; width: 0; overflow: hidden; z-index: -999;">
          <label for="appoint_hp">Leave empty</label>
          <input id="appoint_hp" v-model="appointForm.hp" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <el-form-item label="ФИО Клиента">
          <el-input v-model="appointForm.name" placeholder="ФИО" />
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input v-model="appointForm.phone" placeholder="+7 (928) 000-00-00" />
        </el-form-item>
        <el-form-item label="Дата и время примерки">
          <el-date-picker
            v-model="appointForm.date"
            type="datetime"
            placeholder="Выберите дату и время"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Изделие для примерки">
          <el-input v-model="appointForm.product" placeholder="Костюм-тройка / Смокинг" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="appointmentVisible = false">Отмена</el-button>
        <el-button type="primary" @click="saveAppointment">Записать на примерку</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/utils/request';
import { useResponsive } from '@/utils/useResponsive';
import { sanitizeInput, sanitizePhone, sanitizeInstagram, checkRateLimit, isHoneypotTriggered } from '@/utils/security';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';

const { modalWidth, isMobile } = useResponsive();
import {
  Instagram,
  CalendarPlus,
  Scissors,
  Banknote,
  Crown,
  Inbox,
  CalendarClock,
  Ruler,
  CreditCard,
  Shirt,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';

const router = useRouter();

const analytics = ref<any>({});
const recentOrders = ref<any[]>([]);
const selectedFunnelStage = ref<string | null>(null);

const trendChartRef = ref<HTMLDivElement>();
const categoryChartRef = ref<HTMLDivElement>();

const quickLeadVisible = ref(false);
const appointmentVisible = ref(false);

const leadForm = ref({
  channel: 'INSTAGRAM',
  instagram: '',
  name: '',
  phone: '',
  productType: 'Костюм-тройка',
  tailorNotes: '',
  hp: '', // Honeypot trap for spam bots
});

const appointForm = ref({
  name: '',
  phone: '',
  date: '',
  product: 'Костюм-тройка',
  hp: '', // Honeypot trap for spam bots
});

// 6-Stage Bespoke Sales Funnel Definition
const funnelStages = [
  { key: 'LEAD', label: '1. Новая заявка', icon: Inbox, description: 'Лид из Instagram @kingsname или сайта' },
  { key: 'APPOINTMENT', label: '2. Запись на примерку', icon: CalendarClock, description: 'Дата визита в салон KINGSNAME' },
  { key: 'FITTING', label: '3. Примерка / Мерки', icon: Ruler, description: 'Снятие анатомических параметров' },
  { key: 'PAYMENT_AGREED', label: '4. Согласование ткани', icon: CreditCard, description: 'Выбор шерсти и предоплата 50%' },
  { key: 'TAILORING', label: '5. Пошив в ателье', icon: Shirt, description: 'Ручная сборка портным Адамом' },
  { key: 'DELIVERED', label: '6. Выдача клиенту', icon: CheckCircle2, description: 'Готов, выдан в чехле, закрыт' },
];

onMounted(async () => {
  await loadData();
  await nextTick();
  initCharts();
});

const loadData = async () => {
  try {
    const data = await api.getDashboardAnalytics();
    analytics.value = data;

    const ordersRes = await api.getOrders();
    recentOrders.value = (ordersRes.list || []).slice(0, 5);
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
};

const getStageCount = (stageKey: string) => {
  const match = analytics.value.funnel?.find((f: any) => f.stage === stageKey);
  return match ? match.count : 0;
};

const getStageSum = (stageKey: string) => {
  const match = analytics.value.funnel?.find((f: any) => f.stage === stageKey);
  return match ? match.totalAmount : 0;
};

const funnelRef = ref<HTMLDivElement>();
const isDragging = ref(false);
const startX = ref(0);
const scrollLeftStart = ref(0);
const hasDragged = ref(false);
const currentFunnelIndex = ref(0);

const touchStartX = ref(0);
const touchStartY = ref(0);

const startDrag = (e: MouseEvent) => {
  if (!funnelRef.value) return;
  isDragging.value = true;
  hasDragged.value = false;
  startX.value = e.pageX - funnelRef.value.offsetLeft;
  scrollLeftStart.value = funnelRef.value.scrollLeft;
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !funnelRef.value) return;
  e.preventDefault();
  const x = e.pageX - funnelRef.value.offsetLeft;
  const walk = (x - startX.value) * 1.5;
  if (Math.abs(walk) > 4) {
    hasDragged.value = true;
  }
  funnelRef.value.scrollLeft = scrollLeftStart.value - walk;
};

const endDrag = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  setTimeout(() => {
    hasDragged.value = false;
  }, 100);
};

const onTouchStart = (e: TouchEvent) => {
  if (!e.touches[0]) return;
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
  hasDragged.value = false;
};

const onTouchMove = (e: TouchEvent) => {
  if (!e.touches[0]) return;
  const deltaX = Math.abs(e.touches[0].clientX - touchStartX.value);
  const deltaY = Math.abs(e.touches[0].clientY - touchStartY.value);
  if (deltaX > 6 || deltaY > 6) {
    hasDragged.value = true;
  }
};

const onTouchEnd = () => {
  if (hasDragged.value) {
    setTimeout(() => {
      hasDragged.value = false;
    }, 150);
  }
};

const handleStageClick = (stageKey: string) => {
  if (hasDragged.value) return;
  filterByStage(stageKey);
};

const scrollFunnel = (direction: number) => {
  if (!funnelRef.value) return;
  const step = 225; // 215px card + 10px gap
  funnelRef.value.scrollBy({ left: direction * step, behavior: 'smooth' });
};

const scrollToStageIndex = (idx: number) => {
  if (!funnelRef.value) return;
  const step = 225;
  funnelRef.value.scrollTo({ left: idx * step, behavior: 'smooth' });
  currentFunnelIndex.value = idx;
};

const onFunnelScroll = () => {
  if (!funnelRef.value) return;
  const step = 225;
  const idx = Math.round(funnelRef.value.scrollLeft / step);
  currentFunnelIndex.value = Math.max(0, Math.min(funnelStages.length - 1, idx));
};

const filterByStage = (stageKey: string) => {
  selectedFunnelStage.value = stageKey;
  router.push({ path: '/orders', query: { status: stageKey } });
};

const formatMoney = (val: number) => {
  if (!val) return '0';
  return new Intl.NumberFormat('ru-RU').format(Math.round(val));
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    LEAD: 'Новая заявка',
    APPOINTMENT: 'Запись на примерку',
    FITTING: 'Снятие мерок',
    PAYMENT_AGREED: 'Согласован / Предоплата',
    TAILORING: 'В пошиве у мастера',
    DELIVERED: 'Выдан / Завершен',
  };
  return map[status] || status;
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'LEAD': return 'info';
    case 'APPOINTMENT': return 'warning';
    case 'FITTING': return '';
    case 'PAYMENT_AGREED': return 'warning';
    case 'TAILORING': return 'primary';
    case 'DELIVERED': return 'success';
    default: return 'info';
  }
};

const openQuickLeadModal = () => {
  leadForm.value = {
    channel: 'INSTAGRAM',
    instagram: '',
    name: '',
    phone: '',
    productType: 'Костюм-тройка',
    tailorNotes: '',
    hp: '',
  };
  quickLeadVisible.value = true;
};

const saveQuickLead = async () => {
  // 1. Invisible Bot Honeypot Protection
  if (isHoneypotTriggered(leadForm.value.hp)) {
    quickLeadVisible.value = false;
    ElMessage.success('Заявка успешно зафиксирована в воронке продаж!');
    return;
  }

  // 2. Sliding-Window Rate Limiting (Anti-DDoS / Form Flooding)
  if (!checkRateLimit('quick_lead_submit', 3, 15000)) {
    ElMessage.warning('Слишком много запросов. Подождите несколько секунд перед повторной отправкой.');
    return;
  }

  const rawName = leadForm.value.name?.trim();
  const rawPhone = leadForm.value.phone?.trim();

  if (!rawName || !rawPhone) {
    ElMessage.warning('Пожалуйста, заполните имя и телефон');
    return;
  }

  // 3. XSS Sanitization & Data Normalization
  const safeName = sanitizeInput(rawName, 100);
  const safePhone = sanitizePhone(rawPhone);
  const safeInstagram = sanitizeInstagram(leadForm.value.instagram);
  const safeNotes = sanitizeInput(leadForm.value.tailorNotes, 1000);
  const safeChannel = sanitizeInput(leadForm.value.channel || 'INSTAGRAM', 30);
  const safeProduct = sanitizeInput(leadForm.value.productType || 'Костюм-тройка', 60);

  await api.saveOrder({
    clientName: safeName,
    clientPhone: safePhone,
    channel: safeChannel,
    productType: safeProduct,
    orderType: 'BESPOKE',
    status: 'LEAD',
    totalAmount: 150000,
    depositAmount: 0,
    tailorNotes: `Лид (${safeChannel}${safeInstagram ? ' ' + safeInstagram : ''}): ${safeNotes}`,
  });

  quickLeadVisible.value = false;
  ElMessage.success('Заявка успешно зафиксирована в воронке продаж!');
  await loadData();
};

const openAppointmentModal = () => {
  appointForm.value = {
    name: '',
    phone: '',
    date: '',
    product: 'Костюм-тройка',
    hp: '',
  };
  appointmentVisible.value = true;
};

const saveAppointment = async () => {
  // 1. Invisible Bot Honeypot Protection
  if (isHoneypotTriggered(appointForm.value.hp)) {
    appointmentVisible.value = false;
    ElMessage.success('Клиент успешно записан на примерку в салон!');
    return;
  }

  // 2. Sliding-Window Rate Limiting
  if (!checkRateLimit('appointment_submit', 3, 15000)) {
    ElMessage.warning('Слишком много запросов. Подождите несколько секунд перед повторной отправкой.');
    return;
  }

  const rawName = appointForm.value.name?.trim();
  const rawPhone = appointForm.value.phone?.trim();

  if (!rawName || !rawPhone) {
    ElMessage.warning('Пожалуйста, заполните имя и телефон');
    return;
  }

  // 3. XSS Sanitization & Data Normalization
  const safeName = sanitizeInput(rawName, 100);
  const safePhone = sanitizePhone(rawPhone);
  const safeProduct = sanitizeInput(appointForm.value.product || 'Костюм-тройка', 60);

  await api.saveOrder({
    clientName: safeName,
    clientPhone: safePhone,
    channel: 'SALON_GROZNY',
    productType: safeProduct,
    orderType: 'BESPOKE',
    status: 'APPOINTMENT',
    totalAmount: 180000,
    depositAmount: 0,
    appointmentDate: appointForm.value.date || new Date().toISOString(),
    tailorNotes: 'Запись на примерку в салон в Грозном',
  });

  appointmentVisible.value = false;
  ElMessage.success('Клиент успешно записан на примерку в салон!');
  await loadData();
};

// Initialize ECharts
let trendChartInstance: echarts.ECharts | null = null;
let categoryChartInstance: echarts.ECharts | null = null;

const getCategoryOption = () => {
  const isSmall = window.innerWidth <= 768;
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1C1D24',
      borderColor: '#C5A059',
      textStyle: { color: '#FFFFFF' },
    },
    legend: {
      bottom: isSmall ? '1%' : '0%',
      left: 'center',
      itemGap: isSmall ? 8 : 12,
      itemWidth: isSmall ? 8 : 12,
      itemHeight: isSmall ? 8 : 12,
      textStyle: {
        color: '#9E9FA9',
        fontSize: isSmall ? 10 : 12,
      },
    },
    series: [
      {
        name: 'Категория',
        type: 'pie',
        center: ['50%', isSmall ? '34%' : '44%'],
        radius: isSmall ? ['30%', '52%'] : ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#15161D',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 'bold', color: '#DFBE7A' },
        },
        data: [
          { value: 650000, name: 'Костюмы-тройки', itemStyle: { color: '#C5A059' } },
          { value: 340000, name: 'Смокинги Black Tie', itemStyle: { color: '#DFBE7A' } },
          { value: 220000, name: 'Кашемировые пальто', itemStyle: { color: '#8E7032' } },
          { value: 160000, name: 'Костюмы-двойки', itemStyle: { color: '#5B6075' } },
          { value: 75000, name: 'Сорочки ручной работы', itemStyle: { color: '#3B82F6' } },
        ],
      },
    ],
  };
};

const handleResize = () => {
  trendChartInstance?.resize();
  if (categoryChartInstance) {
    categoryChartInstance.setOption(getCategoryOption());
    categoryChartInstance.resize();
  }
};

const initCharts = () => {
  if (trendChartRef.value) {
    trendChartInstance = echarts.init(trendChartRef.value);
    trendChartInstance.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1C1D24',
        borderColor: '#C5A059',
        textStyle: { color: '#FFFFFF' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
        axisLine: { lineStyle: { color: 'rgba(197, 160, 89, 0.2)' } },
        axisLabel: { color: '#9E9FA9' },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(197, 160, 89, 0.2)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
        axisLabel: { color: '#9E9FA9' },
      },
      series: [
        {
          name: 'Выручка',
          type: 'line',
          smooth: true,
          data: [720000, 890000, 1050000, 980000, 1180000, 1425000],
          lineStyle: { color: '#C5A059', width: 3 },
          itemStyle: { color: '#DFBE7A' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(197, 160, 89, 0.4)' },
              { offset: 1, color: 'rgba(197, 160, 89, 0.0)' },
            ]),
          },
        },
      ],
    });
  }

  if (categoryChartRef.value) {
    categoryChartInstance = echarts.init(categoryChartRef.value);
    categoryChartInstance.setOption(getCategoryOption());
  }

  window.addEventListener('resize', handleResize, { passive: true });
};

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  trendChartInstance?.dispose();
  categoryChartInstance?.dispose();
});
</script>

<style scoped lang="scss">
.kn-dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.kn-dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kn-dash-title {
  font-size: 24px;
  font-weight: 700;
  background: var(--kn-gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

.kn-dash-subtitle {
  font-size: 13px;
  color: var(--kn-text-secondary);
}

.kn-dash-actions {
  display: flex;
  gap: 12px;
}

.kn-btn-action {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &.insta {
    background: rgba(225, 48, 108, 0.12);
    border: 1px solid rgba(225, 48, 108, 0.4);
    color: #FF7096;
    &:hover {
      background: rgba(225, 48, 108, 0.25);
    }
  }

  &.appoint {
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(59, 130, 246, 0.4);
    color: #60A5FA;
    &:hover {
      background: rgba(59, 130, 246, 0.25);
    }
  }

  &.bespoke {
    background: var(--kn-gold-gradient);
    border: none;
    color: #0A0B0E;
    font-weight: 700;
    box-shadow: 0 0 14px var(--kn-gold-glow);
    &:hover {
      filter: brightness(1.15);
    }
  }
}

/* KPI Cards */
.kn-kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.kn-kpi-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.kn-kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.kn-kpi-title {
  font-size: 12px;
  color: var(--kn-text-muted);
  font-weight: 500;
}

.kn-kpi-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;

  &.positive {
    background: rgba(16, 185, 129, 0.15);
    color: #34D399;
  }
  &.warning {
    background: rgba(245, 158, 11, 0.15);
    color: #FBBF24;
  }
  &.info {
    background: rgba(59, 130, 246, 0.15);
    color: #60A5FA;
  }
}

.kn-kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.kn-unit {
  font-size: 14px;
  color: var(--kn-gold-light);
  font-weight: 500;
}

.kn-kpi-footer {
  font-size: 11px;
  color: var(--kn-text-muted);
}

/* Funnel Section */
.kn-funnel-section {
  padding: 24px 28px;
}

.kn-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.kn-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.kn-section-sub {
  font-size: 12px;
  color: var(--kn-text-muted);
}

.kn-view-all-orders-btn {
  background: transparent;
  border: 1px solid var(--kn-gold-border);
  color: var(--kn-gold-light);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(197, 160, 89, 0.12);
  }
}

/* Funnel Cards */
.kn-funnel-steps {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.kn-funnel-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(197, 160, 89, 0.15);
  border-radius: 10px;
  padding: 16px 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--kn-gold-primary);
    background: rgba(197, 160, 89, 0.08);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--kn-gold-primary);
    box-shadow: 0 0 16px var(--kn-gold-glow);
  }
}

.kn-funnel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.kn-step-num {
  font-size: 11px;
  font-weight: 700;
  color: var(--kn-gold-primary);
  font-family: 'Jura', sans-serif;
}

.kn-stage-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--kn-gold-primary);
  transition: transform 0.2s ease, color 0.2s ease;
}

.kn-funnel-card:hover .kn-stage-icon,
.kn-funnel-card.active .kn-stage-icon {
  transform: scale(1.15);
  color: #DFBE7A;
}

.kn-kpi-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--kn-gold-primary);
}

.kn-stage-name {
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.kn-stage-desc {
  font-size: 10px;
  color: var(--kn-text-muted);
  line-height: 1.3;
  margin-bottom: 14px;
  min-height: 26px;
}

.kn-funnel-metrics {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 10px;
}

.kn-metric-count {
  font-size: 12px;
  color: #D1D2DA;
  margin-bottom: 2px;

  strong {
    color: var(--kn-gold-light);
    font-size: 15px;
  }
}

.kn-metric-sum {
  font-size: 12px;
  color: var(--kn-text-muted);
}

.kn-funnel-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--kn-gold-gradient);
  opacity: 0.6;
}

/* Charts Grid */
.kn-charts-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
}

.kn-chart-card {
  padding: 24px;
}

.kn-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.kn-chart-title {
  font-size: 16px;
  color: #FFFFFF;
}

.kn-chart-legend-label {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-echarts-container {
  height: 260px;
  width: 100%;
}

/* Recent Orders */
.kn-recent-orders-card {
  padding: 24px;
}

.kn-order-badge {
  color: var(--kn-gold-light);
  font-weight: 600;
  font-size: 13px;
}

.kn-client-cell {
  display: flex;
  flex-direction: column;
}

.kn-client-sub {
  font-size: 11px;
  color: var(--kn-text-muted);
  margin-top: 2px;
}

.kn-fabric-tag {
  display: inline-block;
  font-size: 10px;
  color: var(--kn-gold-primary);
  background: rgba(197, 160, 89, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
}

.kn-fin-cell {
  display: flex;
  flex-direction: column;
}

.kn-fin-debt {
  font-size: 11px;
  color: #F87171;
}

.kn-fin-paid {
  font-size: 11px;
  color: #34D399;
}

/* Funnel Title Row & Swipe Hint */
.kn-funnel-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kn-swipe-hint-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(197, 160, 89, 0.15);
  border: 1px solid rgba(197, 160, 89, 0.35);
  color: var(--kn-gold-light);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover, &:active {
    background: rgba(197, 160, 89, 0.28);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
  }
}

.kn-funnel-stepper-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 12px;
  padding-top: 4px;
}

.kn-stepper-arrow-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(197, 160, 89, 0.12);
  border: 1px solid rgba(197, 160, 89, 0.28);
  color: var(--kn-gold-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled), &:active:not(:disabled) {
    background: rgba(197, 160, 89, 0.28);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
    transform: scale(1.08);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: rgba(255, 255, 255, 0.08);
    color: var(--kn-text-muted);
  }
}

.kn-stepper-dots {
  display: flex;
  align-items: center;
  gap: 7px;
}

.kn-stepper-dot {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  .kn-dot-inner {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(197, 160, 89, 0.25);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.active .kn-dot-inner {
    width: 20px;
    border-radius: 4px;
    background: var(--kn-gold-primary);
    box-shadow: 0 0 8px rgba(197, 160, 89, 0.6);
  }
}

/* Mobile Order Cards */
.kn-mobile-orders-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kn-mobile-order-card {
  padding: 14px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(197, 160, 89, 0.18);
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background: rgba(197, 160, 89, 0.1);
    border-color: var(--kn-gold-primary);
  }
}

.kn-mo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kn-mo-client-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.kn-mo-client-info {
  display: flex;
  flex-direction: column;
}

.kn-mo-name {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.kn-mo-sub {
  color: var(--kn-text-muted);
  font-size: 11px;
  margin-top: 2px;
}

.kn-mo-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.kn-mo-price {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
}

.kn-mo-suit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.kn-mo-suit-type {
  font-size: 12px;
  color: var(--kn-text-secondary);
}

/* ==============================================================================
   RESPONSIVE MEDIA QUERIES (iPad & Tablet: <=1200px, Mobile: <=768px)
   ============================================================================== */

@media (max-width: 1200px) {
  .kn-kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .kn-funnel-steps {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .kn-dash-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    width: 100%;
  }

  .kn-dash-actions {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .kn-kpi-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .kn-kpi-card:first-child {
    grid-column: span 2;
  }

  .kn-funnel-steps {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .kn-charts-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .kn-dashboard {
    gap: 16px;
    width: 100%;
    min-width: 0;
  }

  .kn-dash-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    width: 100%;
  }

  .kn-dash-title {
    font-size: 20px;
    letter-spacing: 0.02em;
    line-height: 1.25;
    margin-bottom: 4px;
  }

  .kn-dash-subtitle {
    font-size: 11.5px;
    line-height: 1.45;
    color: var(--kn-text-secondary);
  }

  /* Full-width responsive action stack: primary bespoke on top, 2 secondary side-by-side */
  .kn-dash-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
  }

  .kn-btn-action.bespoke {
    grid-column: span 2;
    order: -1;
    height: 44px;
    font-size: 13.5px;
    justify-content: center;
    border-radius: 8px;
    padding: 0 16px;
  }

  .kn-btn-action.insta,
  .kn-btn-action.appoint {
    height: 38px;
    font-size: 11.5px;
    padding: 0 8px;
    justify-content: center;
    border-radius: 8px;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  /* 2-Column Luxury Compact KPI Grid */
  .kn-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: 100%;
  }

  /* Hero Card: Total Month Revenue */
  .kn-kpi-card:first-child {
    grid-column: span 2;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(197, 160, 89, 0.14) 0%, rgba(22, 23, 31, 0.95) 100%);
    border: 1px solid rgba(197, 160, 89, 0.35);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
  }

  .kn-kpi-card:first-child .kn-kpi-value {
    font-size: 26px;
    margin-bottom: 2px;
  }

  .kn-kpi-card {
    padding: 12px 12px;
    min-height: auto;
    border-radius: 10px;
    overflow: hidden;
  }

  .kn-kpi-header {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
  }

  .kn-kpi-title {
    font-size: 11px;
    line-height: 1.2;
    color: var(--kn-text-secondary);
    min-width: 0;
  }

  .kn-kpi-badge {
    flex-shrink: 0;
    font-size: 10px;
    padding: 2px 6px;
  }

  .kn-kpi-value {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 2px;
  }

  .kn-kpi-sub {
    font-size: 10px;
    opacity: 0.85;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Horizontal Swipe Funnel Pipeline */
  .kn-funnel-section {
    padding: 16px 12px;
    border-radius: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  .kn-section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    width: 100%;
  }

  .kn-funnel-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 8px;
  }

  .kn-section-title {
    font-size: 16px;
    line-height: 1.3;
    margin-bottom: 0;
  }

  .kn-section-sub {
    font-size: 11px;
    line-height: 1.35;
    color: var(--kn-text-muted);
  }

  .kn-swipe-hint-btn {
    flex-shrink: 0;
    font-size: 10.5px;
    padding: 3px 8px;
  }

  .kn-view-all-orders-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 14px;
    font-size: 12px;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .kn-funnel-steps {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 10px;
    padding: 6px 2px 14px 2px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &.is-dragging {
      cursor: grabbing;
      scroll-snap-type: none;
      scroll-behavior: auto;
    }
  }

  .kn-funnel-card {
    flex: 0 0 215px;
    width: 215px;
    min-height: 112px;
    padding: 14px 12px;
    scroll-snap-align: start;
    border-radius: 10px;
    user-select: none;
    -webkit-user-select: none;
  }

  .kn-stage-name {
    font-size: 13px;
    margin-bottom: 2px;
  }

  .kn-stage-desc {
    font-size: 10px;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .kn-metric-count strong {
    font-size: 13px;
  }

  .kn-metric-sum {
    font-size: 11px;
  }

  .kn-funnel-stepper-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin-top: 8px;
    padding-top: 4px;
  }

  .kn-stepper-arrow-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }

  .kn-stepper-dots {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .kn-stepper-dot {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Charts Container on Mobile */
  .kn-charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
  }

  .kn-chart-card {
    padding: 14px 12px;
    border-radius: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  .kn-chart-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 12px;
  }

  .kn-chart-title {
    font-size: 15px;
  }

  .kn-chart-legend-label {
    font-size: 10.5px;
    color: var(--kn-text-muted);
  }

  .kn-echarts-container {
    height: 260px;
    width: 100%;
  }

  .kn-recent-orders-card {
    padding: 14px 12px;
    border-radius: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  .kn-recent-orders-card .kn-section-header {
    margin-bottom: 12px;

    .el-button {
      width: 100%;
      height: 38px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 8px;
      background: rgba(197, 160, 89, 0.12);
      border: 1px solid rgba(197, 160, 89, 0.35);
      color: #DFBE7A;
      margin-left: 0;

      &:hover, &:active {
        background: rgba(197, 160, 89, 0.25);
        border-color: var(--kn-gold-primary);
        color: #FFFFFF;
      }
    }
  }

  .kn-mobile-orders-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .kn-mobile-order-card {
    padding: 14px 14px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(197, 160, 89, 0.18);
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      background: rgba(197, 160, 89, 0.1);
      border-color: var(--kn-gold-primary);
    }
  }
}

@media (max-width: 400px) {
  .kn-dash-actions {
    grid-template-columns: 1fr;
  }

  .kn-btn-action.bespoke {
    grid-column: span 1;
  }

  .kn-kpi-grid {
    grid-template-columns: 1fr;
  }

  .kn-kpi-card:first-child {
    grid-column: span 1;
  }

  .kn-funnel-card {
    flex: 0 0 200px;
    width: 200px;
  }
}

:deep(.el-dialog) {
  @media (max-width: 768px) {
    width: 94% !important;
    max-width: 480px;
    margin: 20px auto !important;
    border-radius: 14px;

    .el-dialog__header {
      padding: 16px 16px 10px;
      margin-right: 0;
    }

    .el-dialog__body {
      padding: 12px 16px;
    }

    .el-dialog__footer {
      padding: 10px 16px 16px;
      display: flex;
      gap: 10px;

      .el-button {
        flex: 1;
        margin-left: 0 !important;
        height: 40px;
        font-size: 13px;
      }
    }
  }
}
</style>
