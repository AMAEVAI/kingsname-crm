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
          <span class="kn-btn-icon">📷</span>
          <span>+ Лид из @kingsname</span>
        </button>
        <button class="kn-btn-action appoint" @click="openAppointmentModal">
          <span class="kn-btn-icon">📅</span>
          <span>+ Запись на примерку</span>
        </button>
        <button class="kn-btn-action bespoke" @click="router.push('/orders')">
          <span class="kn-btn-icon">✂️</span>
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
          <span class="kn-kpi-icon">💵</span>
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
          <span class="kn-kpi-icon">👑</span>
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
          <h2 class="kn-section-title font-brand">Воронка Продаж и Индивидуального Пошива KINGSNAME</h2>
          <p class="kn-section-sub">
            Жизненный цикл классического мужского костюма: от обращения в Instagram до выдачи клиенту
          </p>
        </div>
        <button class="kn-view-all-orders-btn" @click="router.push('/orders')">
          Все заказы в таблице →
        </button>
      </div>

      <!-- Funnel Progress Steps Grid -->
      <div class="kn-funnel-steps">
        <div
          v-for="(stage, idx) in funnelStages"
          :key="stage.key"
          class="kn-funnel-card"
          :class="{ active: selectedFunnelStage === stage.key }"
          @click="filterByStage(stage.key)"
        >
          <div class="kn-funnel-top">
            <span class="kn-step-num">0{{ idx + 1 }}</span>
            <span class="kn-stage-icon">{{ stage.icon }}</span>
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

      <el-table :data="recentOrders" style="width: 100%">
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
    </div>

    <!-- Quick Lead Modal (Instagram @kingsname) -->
    <el-dialog v-model="quickLeadVisible" title="Новая Заявка из Instagram @kingsname" width="500px">
      <el-form :model="leadForm" label-position="top">
        <el-form-item label="Instagram аккаунт клиента">
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
    <el-dialog v-model="appointmentVisible" title="Запись на примерку в салон (г. Грозный)" width="500px">
      <el-form :model="appointForm" label-position="top">
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
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/utils/request';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';

const router = useRouter();

const analytics = ref<any>({});
const recentOrders = ref<any[]>([]);
const selectedFunnelStage = ref<string | null>(null);

const trendChartRef = ref<HTMLDivElement>();
const categoryChartRef = ref<HTMLDivElement>();

const quickLeadVisible = ref(false);
const appointmentVisible = ref(false);

const leadForm = ref({
  instagram: '',
  name: '',
  phone: '',
  productType: 'Костюм-тройка',
  tailorNotes: '',
});

const appointForm = ref({
  name: '',
  phone: '',
  date: '',
  product: 'Костюм-тройка',
});

// 6-Stage Bespoke Sales Funnel Definition
const funnelStages = [
  { key: 'LEAD', label: '1. Новая заявка', icon: '📥', description: 'Лид из Instagram @kingsname или сайта' },
  { key: 'APPOINTMENT', label: '2. Запись на примерку', icon: '📅', description: 'Дата визита в салон KINGSNAME' },
  { key: 'FITTING', label: '3. Примерка / Мерки', icon: '📏', description: 'Снятие анатомических параметров' },
  { key: 'PAYMENT_AGREED', label: '4. Согласование ткани', icon: '💳', description: 'Выбор шерсти и предоплата 50%' },
  { key: 'TAILORING', label: '5. Пошив в ателье', icon: '🧵', description: 'Ручная сборка портным Адамом' },
  { key: 'DELIVERED', label: '6. Выдача клиенту', icon: '👑', description: 'Готов, выдан в чехле, закрыт' },
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
    instagram: '',
    name: '',
    phone: '',
    productType: 'Костюм-тройка',
    tailorNotes: '',
  };
  quickLeadVisible.value = true;
};

const saveQuickLead = async () => {
  if (!leadForm.value.name || !leadForm.value.phone) {
    ElMessage.warning('Пожалуйста, заполните имя и телефон');
    return;
  }
  await api.saveOrder({
    clientName: leadForm.value.name,
    clientPhone: leadForm.value.phone,
    channel: 'INSTAGRAM',
    productType: leadForm.value.productType,
    orderType: 'BESPOKE',
    status: 'LEAD',
    totalAmount: 150000,
    depositAmount: 0,
    tailorNotes: `Лид из @kingsname (${leadForm.value.instagram}): ${leadForm.value.tailorNotes}`,
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
  };
  appointmentVisible.value = true;
};

const saveAppointment = async () => {
  if (!appointForm.value.name || !appointForm.value.phone) {
    ElMessage.warning('Пожалуйста, заполните имя и телефон');
    return;
  }
  await api.saveOrder({
    clientName: appointForm.value.name,
    clientPhone: appointForm.value.phone,
    channel: 'SALON_GROZNY',
    productType: appointForm.value.product,
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
const initCharts = () => {
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value);
    chart.setOption({
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
    const chart = echarts.init(categoryChartRef.value);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1C1D24',
        borderColor: '#C5A059',
        textStyle: { color: '#FFFFFF' },
      },
      legend: {
        bottom: '0%',
        textStyle: { color: '#9E9FA9' },
      },
      series: [
        {
          name: 'Категория',
          type: 'pie',
          radius: ['45%', '70%'],
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
    });
  }
};
</script>

<style scoped lang="scss">
.kn-dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
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
  font-family: 'Outfit', sans-serif;
}

.kn-stage-icon {
  font-size: 16px;
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
</style>
