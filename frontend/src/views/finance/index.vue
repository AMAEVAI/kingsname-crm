<template>
  <div class="kn-finance-view">
    <!-- 1. Executive Liquidity Banner (Total Capital in Grozny Salon) -->
    <div class="kn-capital-banner">
      <div class="kn-capital-main">
        <div class="kn-capital-badge">
          <ShieldCheck :size="14" :stroke-width="2" />
          <span>Контур Владельца и Менеджера • KINGSNAME</span>
        </div>
        <div class="kn-capital-total-row">
          <div class="kn-capital-total">
            <span class="kn-capital-label">Общий ликвидный капитал:</span>
            <div class="kn-capital-amount font-outfit">
              {{ formatMoney(overview.totalLiquid || 4850000) }} <span class="kn-rub">₽</span>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="kn-capital-actions">
            <button class="kn-btn-action income" @click="openCashModal('INCOME')">
              <PlusCircle :size="16" />
              <span>+ Приход</span>
            </button>
            <button class="kn-btn-action purchase" @click="openPurchaseModal">
              <Layers :size="16" />
              <span>+ Закупка ткани</span>
            </button>
            <button class="kn-btn-action expense" @click="openCashModal('EXPENSE')">
              <MinusCircle :size="16" />
              <span>- Расход</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 3 Real-time Account Balance Pills -->
      <div class="kn-accounts-strip">
        <div
          v-for="acc in cashAccounts"
          :key="acc.id"
          class="kn-acc-pill"
          :class="acc.accountType.toLowerCase()"
          @click="selectAccountFilter(acc.id)"
        >
          <div class="kn-acc-icon-box">
            <Vault v-if="acc.accountType === 'CASH'" :size="16" />
            <CreditCard v-else-if="acc.accountType === 'POS'" :size="16" />
            <Landmark v-else :size="16" />
          </div>
          <div class="kn-acc-info">
            <span class="kn-acc-name">{{ acc.name }}</span>
            <span class="kn-acc-balance font-outfit">{{ formatMoney(acc.balance) }} ₽</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Navigation Tabs (Responsive Segmented Layout with Luxury Slider) -->
    <div class="kn-nav-section">
      <div 
        ref="navWrapRef" 
        class="kn-finance-nav-wrap"
        @scroll.passive="updateNavScroll"
      >
        <div class="kn-finance-nav">
          <button
            class="kn-finance-tab"
            :class="{ active: activeTab === 'pnl' }"
            @click="selectTab('pnl', $event)"
          >
            <TrendingUp :size="15" />
            <span>Сводка P&L</span>
          </button>

          <button
            class="kn-finance-tab"
            :class="{ active: activeTab === 'channels' }"
            @click="selectTab('channels', $event)"
          >
            <Share2 :size="15" />
            <span>Каналы Лидов</span>
            <span class="kn-tab-badge">IG • WA • TG</span>
          </button>

          <button
            class="kn-finance-tab"
            :class="{ active: activeTab === 'cash' }"
            @click="selectTab('cash', $event)"
          >
            <Receipt :size="15" />
            <span>Касса & ДДС</span>
          </button>

          <button
            class="kn-finance-tab"
            :class="{ active: activeTab === 'purchases' }"
            @click="selectTab('purchases', $event)"
          >
            <Package :size="15" />
            <span>Закупки Тканей</span>
          </button>

          <button
            class="kn-finance-tab"
            :class="{ active: activeTab === 'economics' }"
            @click="selectTab('economics', $event)"
          >
            <Percent :size="15" />
            <span>Юнит-Маржа Заказов</span>
          </button>
        </div>
      </div>

      <!-- Luxury Interactive Slider Bar ("Ползунок" для мобильных и планшетов) -->
      <div v-if="canScrollTabs" class="kn-nav-slider-bar">
        <div class="kn-nav-slider-track" @click="onTrackClick" title="Нажмите или проведите для перехода">
          <div 
            class="kn-nav-slider-thumb"
            :style="{
              left: `${scrollLeftProgress * 65}%`,
              width: '35%'
            }"
          ></div>
        </div>
        <div class="kn-nav-slider-meta">
          <span class="kn-nav-counter font-outfit">
            Раздел {{ currentTabNumber }} из 5
          </span>
          <span class="kn-nav-hint font-outfit">
            свайп разделов <ChevronRight :size="12" />
          </span>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         TAB 1: P&L Financial Dashboard
         ========================================================================= -->
    <div v-show="activeTab === 'pnl'" class="kn-tab-content">
      <!-- 4 KPI Cards -->
      <div class="kn-kpi-grid">
        <div class="kn-card kn-kpi-card highlight">
          <div class="kn-kpi-header">
            <span class="kn-kpi-title">Валовая Выручка</span>
            <span class="kn-kpi-badge success">Все продажи</span>
          </div>
          <div class="kn-kpi-val font-outfit">
            {{ formatMoney(overview.totalRevenue || 10870000) }} <span class="kn-rub">₽</span>
          </div>
          <div class="kn-kpi-sub">Оплаты клиентов по всем каналам</div>
        </div>

        <div class="kn-card kn-kpi-card">
          <div class="kn-kpi-header">
            <span class="kn-kpi-title">Закупки Тканей</span>
            <span class="kn-kpi-badge warning">COGS</span>
          </div>
          <div class="kn-kpi-val font-outfit">
            {{ formatMoney(overview.totalCogs || 3840000) }} <span class="kn-rub">₽</span>
          </div>
          <div class="kn-kpi-sub">Loro Piana, VBC, Scabal</div>
        </div>

        <div class="kn-card kn-kpi-card">
          <div class="kn-kpi-header">
            <span class="kn-kpi-title">Расходы (OPEX)</span>
            <span class="kn-kpi-badge info">Салон</span>
          </div>
          <div class="kn-kpi-val font-outfit">
            {{ formatMoney(overview.totalOpex || 2150000) }} <span class="kn-rub">₽</span>
          </div>
          <div class="kn-kpi-sub">Оплата портных, аренда, реклама</div>
        </div>

        <div class="kn-card kn-kpi-card profit-card">
          <div class="kn-kpi-header">
            <span class="kn-kpi-title">Чистая Прибыль</span>
            <span class="kn-kpi-badge gold">{{ overview.netMarginPercent || 44.9 }}% маржа</span>
          </div>
          <div class="kn-kpi-val font-outfit profit-val">
            +{{ formatMoney(overview.netProfit || 4880000) }} <span class="kn-rub">₽</span>
          </div>
          <div class="kn-kpi-sub">Прибыль дома KINGSNAME</div>
        </div>
      </div>

      <!-- ECharts Row: Trend & Expense Structure -->
      <div class="kn-charts-grid">
        <div class="kn-card kn-chart-card">
          <div class="kn-chart-header">
            <div>
              <h3 class="kn-chart-title font-brand">Динамика P&L по Месяцам</h3>
              <p class="kn-chart-sub">Выручка vs Закупки vs Чистая прибыль (₽)</p>
            </div>
          </div>
          <div ref="pnlChartRef" class="kn-echarts-box"></div>
        </div>

        <div class="kn-card kn-chart-card kn-expense-structure-card">
          <div class="kn-chart-header">
            <div>
              <h3 class="kn-chart-title font-brand">Структура Затрат Дома</h3>
              <p class="kn-chart-sub">Доли себестоимости и обслуживания дома</p>
            </div>
            <div class="kn-chart-total-pill font-outfit">
              Всего: {{ formatMoney(totalExpenses) }} ₽
            </div>
          </div>

          <!-- Multi-Segment Visual Stacked Progress Bar (100% обзор расходов) -->
          <div class="kn-expense-visual-bar-wrap">
            <div class="kn-expense-stacked-bar">
              <div 
                v-for="item in expenseCategories" 
                :key="item.name"
                class="kn-expense-bar-segment"
                :style="{ width: `${item.value}%`, background: item.color }"
                :title="`${item.shortName}: ${item.value}%`"
              ></div>
            </div>
          </div>

          <!-- Centered Donut with Dynamic Total Center Text -->
          <div class="kn-donut-container">
            <div ref="expenseChartRef" class="kn-echarts-donut kn-expense-donut"></div>
          </div>

          <!-- Luxury Detailed Expense Breakdown List (Понятные карточки затрат) -->
          <div class="kn-expense-breakdown-list">
            <div 
              v-for="item in expenseCategories" 
              :key="item.name"
              class="kn-expense-row-card"
            >
              <div class="kn-expense-row-top">
                <div class="kn-expense-name-wrap">
                  <span class="kn-expense-dot" :style="{ background: item.color, boxShadow: `0 0 8px ${item.color}88` }"></span>
                  <div>
                    <span class="kn-expense-title">{{ item.name }}</span>
                    <span class="kn-expense-desc">{{ item.desc }}</span>
                  </div>
                </div>
                <div class="kn-expense-numbers font-outfit">
                  <strong class="kn-expense-amount">{{ formatMoney(item.amount) }} ₽</strong>
                  <span class="kn-expense-pct-badge" :style="{ color: item.color, background: `${item.color}1f`, borderColor: `${item.color}40` }">
                    {{ item.value }}%
                  </span>
                </div>
              </div>

              <!-- Animated Progress Track for each category -->
              <div class="kn-expense-track">
                <div 
                  class="kn-expense-fill"
                  :style="{ width: `${item.value}%`, background: item.gradient, boxShadow: `0 0 8px ${item.color}55` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         TAB 2: Lead Channels Financial Analytics (Instagram, WhatsApp, Telegram, Salon)
         ========================================================================= -->
    <div v-show="activeTab === 'channels'" class="kn-tab-content">
      <!-- Channel Cards Grid -->
      <div class="kn-channels-grid">
        <div
          v-for="ch in channelAnalytics"
          :key="ch.channel"
          class="kn-card kn-channel-card"
          :class="ch.channel.toLowerCase()"
        >
          <div class="kn-channel-top">
            <div class="kn-channel-brand">
              <div class="kn-channel-icon-wrap">
                <Instagram v-if="ch.channel === 'INSTAGRAM'" :size="20" />
                <MessageSquare v-else-if="ch.channel === 'WHATSAPP'" :size="20" />
                <Send v-else-if="ch.channel === 'TELEGRAM'" :size="20" />
                <Crown v-else :size="20" />
              </div>
              <div>
                <h4 class="kn-channel-title">{{ ch.label }}</h4>
                <span class="kn-channel-leads font-outfit">{{ ch.leadsCount }} обращений</span>
              </div>
            </div>
            <div class="kn-channel-margin-pill font-outfit">
              {{ ch.netMargin }}% маржа
            </div>
          </div>

          <div class="kn-channel-metrics-row">
            <div class="kn-cm-item">
              <span class="kn-cm-lbl">Выручка</span>
              <strong class="kn-cm-val font-outfit">{{ formatMoney(ch.totalRevenue) }} ₽</strong>
            </div>
            <div class="kn-cm-item">
              <span class="kn-cm-lbl">Средний чек</span>
              <strong class="kn-cm-val font-outfit">{{ formatMoney(ch.avgCheck) }} ₽</strong>
            </div>
            <div class="kn-cm-item">
              <span class="kn-cm-lbl">Заказов</span>
              <strong class="kn-cm-val font-outfit">{{ ch.ordersCount }} шт</strong>
            </div>
            <div class="kn-cm-item">
              <span class="kn-cm-lbl">Конверсия</span>
              <strong class="kn-cm-val font-outfit text-gold">{{ ch.conversionToOrder }}%</strong>
            </div>
          </div>

          <div class="kn-channel-footer">
            <div class="kn-channel-profit">
              <span>Чистая прибыль с канала:</span>
              <strong class="font-outfit">+{{ formatMoney(ch.netProfit) }} ₽</strong>
            </div>
            <span v-if="ch.adSpend > 0" class="kn-channel-spend font-outfit">
              Реклама: {{ formatMoney(ch.adSpend) }} ₽
            </span>
            <span v-else class="kn-channel-spend organic font-outfit">
              Органика / 0 ₽
            </span>
          </div>
        </div>
      </div>

      <!-- Channel Charts: Revenue Distribution & Conversion -->
      <div class="kn-charts-grid kn-channel-analytics-grid">
        <!-- 1. Donut Revenue Distribution Card -->
        <div class="kn-card kn-chart-card kn-channel-pie-card">
          <div class="kn-chart-header">
            <div>
              <h3 class="kn-chart-title font-brand">Доли Выручки по Каналам</h3>
              <p class="kn-chart-sub">Instagram vs WhatsApp vs Telegram vs Салон</p>
            </div>
            <div class="kn-chart-total-pill font-outfit">
              Всего: {{ formatMoney(totalChannelsRevenue) }} ₽
            </div>
          </div>

          <div class="kn-donut-container">
            <div ref="channelPieChartRef" class="kn-echarts-donut"></div>
          </div>

          <!-- Native Luxury Legend Breakdown -->
          <div class="kn-channel-legend-list">
            <div 
              v-for="ch in channelAnalytics" 
              :key="ch.channel" 
              class="kn-channel-legend-item"
            >
              <div class="kn-legend-left">
                <span class="kn-legend-dot" :class="ch.channel.toLowerCase()"></span>
                <span class="kn-legend-name">{{ formatChannelShort(ch.channel) }}</span>
              </div>
              <div class="kn-legend-right">
                <span class="kn-legend-val font-outfit">{{ formatMoney(ch.totalRevenue) }} ₽</span>
                <span class="kn-legend-pct font-outfit" :class="ch.channel.toLowerCase()">
                  {{ getChannelPercent(ch.totalRevenue) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Horizontal Conversion Funnel Card -->
        <div class="kn-card kn-chart-card kn-channel-conv-card">
          <div class="kn-chart-header">
            <div>
              <h3 class="kn-chart-title font-brand">Конверсия в Пошив (%)</h3>
              <p class="kn-chart-sub">Эффективность обработки лидов по каналам</p>
            </div>
            <div class="kn-chart-badge font-outfit">
              Воронка продаж
            </div>
          </div>

          <div class="kn-channel-conversion-board">
            <div 
              v-for="ch in channelAnalytics" 
              :key="ch.channel" 
              class="kn-conv-row-card"
              :class="ch.channel.toLowerCase()"
            >
              <div class="kn-conv-row-header">
                <div class="kn-conv-channel-info">
                  <div class="kn-conv-icon-wrap" :class="ch.channel.toLowerCase()">
                    <Instagram v-if="ch.channel === 'INSTAGRAM'" :size="15" />
                    <MessageSquare v-else-if="ch.channel === 'WHATSAPP'" :size="15" />
                    <Send v-else-if="ch.channel === 'TELEGRAM'" :size="15" />
                    <Crown v-else :size="15" />
                  </div>
                  <span class="kn-conv-channel-name">{{ formatChannelShort(ch.channel) }}</span>
                </div>
                <div class="kn-conv-badge font-outfit">
                  <span class="kn-conv-rate">{{ ch.conversionToOrder }}%</span>
                  <span class="kn-conv-label">в заказ</span>
                </div>
              </div>

              <!-- Animated gradient progress bar -->
              <div class="kn-conv-progress-track">
                <div 
                  class="kn-conv-progress-fill" 
                  :class="ch.channel.toLowerCase()"
                  :style="{ width: `${Math.min(100, Math.max(6, ch.conversionToOrder))}%` }"
                ></div>
              </div>

              <div class="kn-conv-row-details font-outfit">
                <span class="kn-conv-funnel-step">
                  <strong class="text-white">{{ ch.ordersCount }}</strong> зак. из <strong class="text-white">{{ ch.leadsCount }}</strong> лидов
                </span>
                <span class="kn-conv-substat">
                  Визит: <strong class="text-gold">{{ ch.conversionToAppointment }}%</strong>
                </span>
                <span class="kn-conv-substat">
                  Чек: <strong class="text-white">{{ formatMoney(ch.avgCheck) }} ₽</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         TAB 3: Cash Desk & Cash Flow (Касса Салона)
         ========================================================================= -->
    <div v-show="activeTab === 'cash'" class="kn-tab-content">
      <div class="kn-card kn-table-card">
        <div class="kn-table-header">
          <div>
            <h3 class="kn-table-title font-brand">Журнал Кассовых Проводок и ДДС</h3>
            <p class="kn-table-sub">Фиксация всех приходов и списаний в реальном времени</p>
          </div>

          <div class="kn-filter-row">
            <el-radio-group v-model="txTypeFilter" size="small" @change="loadCashTransactions">
              <el-radio-button label="">Все</el-radio-button>
              <el-radio-button label="INCOME">Приход (+)</el-radio-button>
              <el-radio-button label="EXPENSE">Расход (-)</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <!-- Desktop Table View -->
        <el-table v-if="!isMobile" :data="cashTransactions" style="width: 100%">
          <el-table-column prop="transactionNo" label="№ Ордера" width="130">
            <template #default="{ row }">
              <span class="kn-order-badge font-outfit">{{ row.transactionNo }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="Дата и Время" width="160">
            <template #default="{ row }">
              <span class="font-outfit kn-date-cell">{{ row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="type" label="Тип" width="120">
            <template #default="{ row }">
              <span class="kn-tx-badge" :class="row.type.toLowerCase()">
                {{ row.type === 'INCOME' ? '+ Приход' : '- Расход' }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="accountName" label="Счет / Касса" width="200">
            <template #default="{ row }">
              <span class="kn-acc-cell">{{ row.accountName }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="category" label="Статья ДДС" width="180">
            <template #default="{ row }">
              <span class="kn-category-tag font-outfit">{{ row.category }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="comment" label="Назначение / Комментарий">
            <template #default="{ row }">
              <div class="kn-comment-cell">
                <span>{{ row.comment }}</span>
                <span v-if="row.relatedOrderNo" class="kn-related-order font-outfit">
                  Заказ: {{ row.relatedOrderNo }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="amount" label="Сумма" width="160" align="right">
            <template #default="{ row }">
              <span
                class="font-outfit kn-tx-amount"
                :class="row.type === 'INCOME' ? 'text-income' : 'text-expense'"
              >
                {{ row.type === 'INCOME' ? '+' : '-' }}{{ formatMoney(row.amount) }} ₽
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- Mobile Luxury Transaction Cards -->
        <div v-else class="kn-mobile-tx-list">
          <div
            v-for="row in cashTransactions"
            :key="row.id"
            class="kn-mobile-tx-card"
            :class="row.type.toLowerCase()"
          >
            <div class="kn-mtx-top">
              <span class="kn-order-badge font-outfit">{{ row.transactionNo }}</span>
              <span class="kn-tx-badge" :class="row.type.toLowerCase()">
                {{ row.type === 'INCOME' ? '+ Приход' : '- Расход' }}
              </span>
            </div>

            <div class="kn-mtx-amount-row">
              <div class="kn-mtx-cat">{{ row.category }}</div>
              <div
                class="kn-mtx-amount font-outfit"
                :class="row.type === 'INCOME' ? 'text-income' : 'text-expense'"
              >
                {{ row.type === 'INCOME' ? '+' : '-' }}{{ formatMoney(row.amount) }} ₽
              </div>
            </div>

            <p class="kn-mtx-comment">{{ row.comment }}</p>

            <div class="kn-mtx-footer">
              <span class="kn-mtx-acc">{{ row.accountName }}</span>
              <span class="kn-mtx-time font-outfit">{{ row.createTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         TAB 4: Material & Fabric Purchases (COGS)
         ========================================================================= -->
    <div v-show="activeTab === 'purchases'" class="kn-tab-content">
      <div class="kn-card kn-table-card">
        <div class="kn-table-header">
          <div>
            <h3 class="kn-table-title font-brand">Закупки Тканей и Фурнитуры («От закупа»)</h3>
            <p class="kn-table-sub">
              Поставки рулонов Loro Piana, VBC, Scabal и шелковой фурнитуры из Европы
            </p>
          </div>

          <button class="kn-btn-gold" @click="openPurchaseModal">
            <Plus :size="15" />
            <span>+ Оформить поставку</span>
          </button>
        </div>

        <!-- Desktop Purchases Table -->
        <el-table v-if="!isMobile" :data="purchases" style="width: 100%">
          <el-table-column prop="invoiceNo" label="Инвойс" width="130">
            <template #default="{ row }">
              <span class="kn-order-badge font-outfit">{{ row.invoiceNo }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="supplier" label="Фабрика / Поставщик" width="220">
            <template #default="{ row }">
              <strong>{{ row.supplier }}</strong>
            </template>
          </el-table-column>

          <el-table-column prop="materialName" label="Материал / Артикул">
            <template #default="{ row }">
              <div>
                <span>{{ row.materialName }}</span>
                <span class="kn-fabric-tag font-outfit">{{ row.materialType }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="quantity" label="Метраж / Кол-во" width="140" align="center">
            <template #default="{ row }">
              <span class="font-outfit">{{ row.quantity }} {{ row.unit }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="pricePerUnit" label="Цена за ед." width="140" align="right">
            <template #default="{ row }">
              <span class="font-outfit">{{ formatMoney(row.pricePerUnit) }} ₽</span>
            </template>
          </el-table-column>

          <el-table-column prop="totalCost" label="Сумма счёта" width="160" align="right">
            <template #default="{ row }">
              <strong class="font-outfit kn-gold-text">{{ formatMoney(row.totalCost) }} ₽</strong>
            </template>
          </el-table-column>

          <el-table-column prop="paymentStatus" label="Оплата" width="130" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.paymentStatus === 'PAID' ? 'success' : row.paymentStatus === 'PARTIAL' ? 'warning' : 'info'"
                effect="dark"
                size="small"
              >
                {{ row.paymentStatus === 'PAID' ? 'Оплачен' : row.paymentStatus === 'PARTIAL' ? 'Частично' : 'Не оплачен' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- Mobile Purchases Cards -->
        <div v-else class="kn-mobile-purchases-list">
          <div v-for="p in purchases" :key="p.id" class="kn-mobile-purchase-card">
            <div class="kn-mp-top">
              <span class="kn-order-badge font-outfit">{{ p.invoiceNo }}</span>
              <el-tag
                :type="p.paymentStatus === 'PAID' ? 'success' : p.paymentStatus === 'PARTIAL' ? 'warning' : 'info'"
                effect="dark"
                size="small"
              >
                {{ p.paymentStatus === 'PAID' ? 'Оплачен' : p.paymentStatus === 'PARTIAL' ? 'Частично' : 'Не оплачен' }}
              </el-tag>
            </div>

            <div class="kn-mp-supplier">{{ p.supplier }}</div>
            <div class="kn-mp-name">{{ p.materialName }}</div>

            <div class="kn-mp-metrics">
              <div class="kn-mp-met">
                <span>Метраж:</span>
                <strong class="font-outfit">{{ p.quantity }} {{ p.unit }}</strong>
              </div>
              <div class="kn-mp-met">
                <span>За ед:</span>
                <strong class="font-outfit">{{ formatMoney(p.pricePerUnit) }} ₽</strong>
              </div>
              <div class="kn-mp-met">
                <span>Итого:</span>
                <strong class="font-outfit text-gold">{{ formatMoney(p.totalCost) }} ₽</strong>
              </div>
            </div>

            <div class="kn-mp-footer">
              <span>Прибытие: {{ p.arrivalDate }}</span>
              <span class="font-outfit">Оплачено: {{ formatMoney(p.paidAmount) }} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         TAB 5: Unit Economics of Orders («До продажи»)
         ========================================================================= -->
    <div v-show="activeTab === 'economics'" class="kn-tab-content">
      <div class="kn-card kn-table-card">
        <div class="kn-table-header">
          <div>
            <h3 class="kn-table-title font-brand">Юнит-Экономика и Маржинальность Заказов</h3>
            <p class="kn-table-sub">
              Анализ себестоимости каждого пошитого костюма: ткань + фурнитура + работа мастера
            </p>
          </div>
        </div>

        <!-- Desktop Economics Table -->
        <el-table v-if="!isMobile" :data="orderEconomics" style="width: 100%">
          <el-table-column prop="orderNo" label="№ Заказа" width="140">
            <template #default="{ row }">
              <span class="kn-order-badge font-outfit">{{ row.orderNo }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="clientName" label="Клиент" width="180">
            <template #default="{ row }">
              <strong>{{ row.clientName }}</strong>
            </template>
          </el-table-column>

          <el-table-column prop="productType" label="Изделие и Ткань">
            <template #default="{ row }">
              <div>
                <span>{{ row.productType }}</span>
                <span class="kn-fabric-tag font-outfit">{{ row.fabricBrand }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="salePrice" label="Цена продажи" width="150" align="right">
            <template #default="{ row }">
              <strong class="font-outfit">{{ formatMoney(row.salePrice) }} ₽</strong>
            </template>
          </el-table-column>

          <el-table-column prop="totalCogs" label="Себестоимость" width="150" align="right">
            <template #default="{ row }">
              <span class="font-outfit text-muted">{{ formatMoney(row.totalCogs) }} ₽</span>
            </template>
          </el-table-column>

          <el-table-column prop="grossProfit" label="Чистая Маржа" width="160" align="right">
            <template #default="{ row }">
              <strong class="font-outfit text-gold">+{{ formatMoney(row.grossProfit) }} ₽</strong>
            </template>
          </el-table-column>

          <el-table-column prop="marginPercent" label="Маржа %" width="140" align="center">
            <template #default="{ row }">
              <div class="kn-margin-bar-wrap">
                <span class="font-outfit font-bold">{{ row.marginPercent }}%</span>
                <el-progress
                  :percentage="row.marginPercent"
                  :color="row.marginPercent > 60 ? '#10B981' : '#C5A059'"
                  :show-text="false"
                  :stroke-width="5"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- Mobile Economics Cards -->
        <div v-else class="kn-mobile-eco-list">
          <div v-for="eco in orderEconomics" :key="eco.id" class="kn-mobile-eco-card">
            <div class="kn-meco-top">
              <span class="kn-order-badge font-outfit">{{ eco.orderNo }}</span>
              <span class="kn-meco-status font-outfit">{{ eco.status }}</span>
            </div>

            <div class="kn-meco-client">{{ eco.clientName }}</div>
            <div class="kn-meco-item">{{ eco.productType }} • {{ eco.fabricBrand }}</div>

            <div class="kn-meco-split">
              <div class="kn-meco-row">
                <span>Продажа:</span>
                <strong class="font-outfit">{{ formatMoney(eco.salePrice) }} ₽</strong>
              </div>
              <div class="kn-meco-row text-muted">
                <span>Себестоимость (Ткань+Мастера):</span>
                <span class="font-outfit">{{ formatMoney(eco.totalCogs) }} ₽</span>
              </div>
              <div class="kn-meco-row highlight">
                <span>Чистая маржа:</span>
                <strong class="font-outfit text-gold">
                  +{{ formatMoney(eco.grossProfit) }} ₽ ({{ eco.marginPercent }}%)
                </strong>
              </div>
            </div>

            <el-progress
              :percentage="eco.marginPercent"
              :color="eco.marginPercent > 60 ? '#10B981' : '#C5A059'"
              :stroke-width="4"
              :show-text="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         MODALS: Cash Desk Transaction & Material Purchase
         ========================================================================= -->
    <!-- Modal 1: Cash Operation -->
    <el-dialog
      v-model="cashModalVisible"
      :title="cashForm.type === 'INCOME' ? 'Внесение средств в кассу (Приход)' : 'Списание средств из кассы (Расход)'"
      :width="modalWidth"
      class="kn-dark-dialog"
    >
      <el-form :model="cashForm" label-position="top">
        <el-form-item label="Тип операции">
          <el-radio-group v-model="cashForm.type">
            <el-radio-button label="INCOME">+ Приход</el-radio-button>
            <el-radio-button label="EXPENSE">- Расход</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Счет / Касса">
          <el-select v-model="cashForm.accountId" placeholder="Выберите счет" style="width: 100%">
            <el-option
              v-for="a in cashAccounts"
              :key="a.id"
              :label="a.name + ' (Остаток: ' + formatMoney(a.balance) + ' ₽)'"
              :value="a.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Сумма операции (₽)">
          <el-input-number
            v-model="cashForm.amount"
            :min="100"
            :step="1000"
            style="width: 100%"
            placeholder="Сумма в рублях"
          />
        </el-form-item>

        <el-form-item label="Статья ДДС">
          <el-select v-model="cashForm.category" placeholder="Выберите статью" style="width: 100%">
            <el-option label="Предоплата 50% по заказу" value="Предоплата 50%" />
            <el-option label="Окончательный расчет (100%)" value="100% Оплата" />
            <el-option label="Оплата работы портному" value="Оплата портному" />
            <el-option label="Срочная закупка фурнитуры" value="Фурнитура" />
            <el-option label="Аренда и салон" value="Аренда салона" />
            <el-option label="Маркетинг и таргет" value="Маркетинг" />
            <el-option label="Инкассация" value="Инкассация" />
            <el-option label="Прочие расходы" value="Прочее" />
          </el-select>
        </el-form-item>

        <el-form-item label="Номер связанного заказа (если применимо)">
          <el-input v-model="cashForm.relatedOrderNo" placeholder="Например: KNG-2026-001" />
        </el-form-item>

        <el-form-item label="Комментарий / Назначение">
          <el-input v-model="cashForm.comment" type="textarea" placeholder="Детали операции..." />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="cashModalVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitCashTransaction">Провести операцию</el-button>
      </template>
    </el-dialog>

    <!-- Modal 2: Material Purchase -->
    <el-dialog
      v-model="purchaseModalVisible"
      title="Оформление закупки тканей и материалов"
      :width="modalWidth"
      class="kn-dark-dialog"
    >
      <el-form :model="purchaseForm" label-position="top">
        <el-form-item label="Фабрика / Поставщик">
          <el-select v-model="purchaseForm.supplier" placeholder="Выберите фабрику" style="width: 100%">
            <el-option label="Loro Piana S.p.A. (Италия)" value="Loro Piana S.p.A. (Италия)" />
            <el-option label="Vitale Barberis Canonico (Италия)" value="Vitale Barberis Canonico (Италия)" />
            <el-option label="Scabal (Англия/Бельгия)" value="Scabal (Англия/Бельгия)" />
            <el-option label="Dormeuil (Франция/Англия)" value="Dormeuil (Франция/Англия)" />
            <el-option label="Lampo & Cobrax (Фурнитура Италия)" value="Lampo & Cobrax (Италия)" />
          </el-select>
        </el-form-item>

        <el-form-item label="Наименование ткани / Артикул">
          <el-input v-model="purchaseForm.materialName" placeholder="Например: Шерсть Super 150s Tasmanian Navy" />
        </el-form-item>

        <div class="kn-form-row">
          <el-form-item label="Метраж (м) / Кол-во" style="flex: 1">
            <el-input-number v-model="purchaseForm.quantity" :min="1" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Цена за метр (₽)" style="flex: 1">
            <el-input-number v-model="purchaseForm.pricePerUnit" :min="500" :step="500" style="width: 100%" />
          </el-form-item>
        </div>

        <el-form-item label="Счет для оплаты">
          <el-select v-model="purchaseForm.accountId" style="width: 100%">
            <el-option
              v-for="a in cashAccounts"
              :key="a.id"
              :label="a.name + ' (' + formatMoney(a.balance) + ' ₽)'"
              :value="a.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Статус оплаты">
          <el-radio-group v-model="purchaseForm.paymentStatus">
            <el-radio-button label="PAID">Оплачен 100%</el-radio-button>
            <el-radio-button label="PARTIAL">Предоплата 50%</el-radio-button>
            <el-radio-button label="UNPAID">Постоплата</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="purchaseModalVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitPurchase">Оприходовать поставку</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, shallowRef, watch } from 'vue';
import { api } from '@/utils/request';
import { useResponsive } from '@/utils/useResponsive';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import {
  TrendingUp,
  Share2,
  Receipt,
  Package,
  Percent,
  PlusCircle,
  MinusCircle,
  Layers,
  ShieldCheck,
  Vault,
  CreditCard,
  Landmark,
  Instagram,
  MessageSquare,
  Send,
  Crown,
  Plus,
  ChevronRight
} from 'lucide-vue-next';

const { isMobile, modalWidth } = useResponsive();

const activeTab = ref<'pnl' | 'channels' | 'cash' | 'purchases' | 'economics'>('pnl');

const overview = ref<any>({});
const channelAnalytics = ref<any[]>([]);
const cashAccounts = ref<any[]>([]);
const cashTransactions = ref<any[]>([]);
const purchases = ref<any[]>([]);
const orderEconomics = ref<any[]>([]);

const totalChannelsRevenue = computed(() => {
  return channelAnalytics.value.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
});

const getChannelPercent = (revenue: number) => {
  if (!totalChannelsRevenue.value || !revenue) return '0.0';
  return ((revenue / totalChannelsRevenue.value) * 100).toFixed(1);
};

const formatChannelShort = (chKey: string) => {
  switch (chKey) {
    case 'INSTAGRAM': return 'Instagram';
    case 'WHATSAPP': return 'WhatsApp';
    case 'TELEGRAM': return 'Telegram';
    case 'SALON': return 'Салон & Органика';
    default: return chKey;
  }
};

const totalExpenses = computed(() => {
  const cogs = overview.value.totalCogs || 3500000;
  const opex = overview.value.totalOpex || 1000000;
  return cogs + opex;
});

const getExpenseAmount = (percent: number) => {
  return Math.round((totalExpenses.value * percent) / 100);
};

const expenseCategories = computed(() => {
  const raw = overview.value.expenseStructure || [
    { name: 'Ткани и материалы (Loro Piana, VBC, Scabal)', value: 52 },
    { name: 'Работа мастеров-портных', value: 26 },
    { name: 'Аренда флагманского салона', value: 12 },
    { name: 'Фирменная упаковка и кофры', value: 5 },
    { name: 'Маркетинг и реклама', value: 5 }
  ];

  const meta = [
    {
      shortName: 'Ткани и материалы',
      desc: 'Итальянская и британская шерсть Super 150s–180s',
      color: '#C5A059',
      gradient: 'linear-gradient(90deg, #C5A059, #E5C378)'
    },
    {
      shortName: 'Работа мастеров',
      desc: 'Индивидуальный ручной раскрой, бортовка и вспушка',
      color: '#10B981',
      gradient: 'linear-gradient(90deg, #10B981, #34D399)'
    },
    {
      shortName: 'Аренда салона',
      desc: 'Салон KINGSNAME Haute Sartorial и VIP-примерочные',
      color: '#3B82F6',
      gradient: 'linear-gradient(90deg, #3B82F6, #60A5FA)'
    },
    {
      shortName: 'Упаковка и кофры',
      desc: 'Деревянные вешалки, дышащие чехлы и шелковая бумага',
      color: '#8B5CF6',
      gradient: 'linear-gradient(90deg, #8B5CF6, #A78BFA)'
    },
    {
      shortName: 'Маркетинг & PR',
      desc: 'Съемки лукбуков, VIP-приемы и реклама в каналах',
      color: '#F59E0B',
      gradient: 'linear-gradient(90deg, #F59E0B, #FBBF24)'
    }
  ];

  return raw.map((item: any, i: number) => {
    const m = meta[i] || meta[0];
    return {
      ...item,
      shortName: m.shortName,
      desc: m.desc,
      color: m.color,
      gradient: m.gradient,
      amount: getExpenseAmount(item.value)
    };
  });
});

const txTypeFilter = ref('');

// Navigation Scroll Slider State
const navWrapRef = ref<HTMLDivElement>();
const scrollLeftProgress = ref(0);
const canScrollTabs = ref(false);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const tabKeys = ['pnl', 'channels', 'cash', 'purchases', 'economics'] as const;

const currentTabNumber = computed(() => {
  const idx = tabKeys.indexOf(activeTab.value);
  return idx >= 0 ? idx + 1 : 1;
});

const updateNavScroll = () => {
  if (!navWrapRef.value) return;
  const { scrollLeft, scrollWidth, clientWidth } = navWrapRef.value;
  const maxScroll = scrollWidth - clientWidth;
  canScrollTabs.value = maxScroll > 6;
  canScrollLeft.value = scrollLeft > 6;
  canScrollRight.value = scrollLeft < maxScroll - 6;
  scrollLeftProgress.value = maxScroll > 0 ? Math.min(1, Math.max(0, scrollLeft / maxScroll)) : 0;
};

const selectTab = (tabKey: 'pnl' | 'channels' | 'cash' | 'purchases' | 'economics', event?: MouseEvent) => {
  activeTab.value = tabKey;
  if (event?.currentTarget) {
    (event.currentTarget as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }
  nextTick(() => updateNavScroll());
};

const scrollToActiveTab = () => {
  if (!navWrapRef.value) return;
  const activeEl = navWrapRef.value.querySelector('.kn-finance-tab.active') as HTMLElement;
  if (activeEl) {
    activeEl.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }
};

const onTrackClick = (e: MouseEvent) => {
  if (!navWrapRef.value) return;
  const track = e.currentTarget as HTMLElement;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  const maxScroll = navWrapRef.value.scrollWidth - navWrapRef.value.clientWidth;
  navWrapRef.value.scrollTo({
    left: ratio * maxScroll,
    behavior: 'smooth'
  });
};

// Chart DOM refs & instances
const pnlChartRef = ref<HTMLDivElement>();
const expenseChartRef = ref<HTMLDivElement>();
const channelPieChartRef = ref<HTMLDivElement>();
const channelBarChartRef = ref<HTMLDivElement>();

const pnlChartInstance = shallowRef<echarts.ECharts>();
const expenseChartInstance = shallowRef<echarts.ECharts>();
const channelPieChartInstance = shallowRef<echarts.ECharts>();
const channelBarChartInstance = shallowRef<echarts.ECharts>();

// Modal states
const cashModalVisible = ref(false);
const purchaseModalVisible = ref(false);

const cashForm = ref({
  type: 'INCOME',
  accountId: 1,
  amount: 50000,
  category: 'Предоплата 50%',
  relatedOrderNo: '',
  comment: '',
});

const purchaseForm = ref({
  supplier: 'Loro Piana S.p.A. (Италия)',
  materialName: '',
  quantity: 15,
  unit: 'м',
  pricePerUnit: 14000,
  accountId: 3,
  paymentStatus: 'PAID',
});

onMounted(async () => {
  await loadAllData();
  await nextTick();
  initCharts();
  updateNavScroll();
  window.addEventListener('resize', handleResize);
  window.addEventListener('resize', updateNavScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('resize', updateNavScroll);
  pnlChartInstance.value?.dispose();
  expenseChartInstance.value?.dispose();
  channelPieChartInstance.value?.dispose();
  channelBarChartInstance.value?.dispose();
});

const loadAllData = async () => {
  try {
    const [ov, ch, accs, txs, purch, eco] = await Promise.all([
      api.getFinanceOverview(),
      api.getChannelAnalytics(),
      api.getCashAccounts(),
      api.getCashTransactions(),
      api.getPurchases(),
      api.getOrderEconomics(),
    ]);

    overview.value = ov;
    channelAnalytics.value = ch;
    cashAccounts.value = accs;
    cashTransactions.value = txs.list || [];
    purchases.value = purch.list || [];
    orderEconomics.value = eco.list || [];

    await nextTick();
    initCharts();
  } catch (err) {
    console.error('Error loading finance data:', err);
  }
};

watch(activeTab, async (newTab) => {
  await nextTick();
  scrollToActiveTab();
  updateNavScroll();
  setTimeout(() => {
    handleResize();
    updateNavScroll();
    if (newTab === 'pnl') {
      initPnlChart();
      initExpenseChart();
    } else if (newTab === 'channels') {
      initChannelPieChart();
    }
  }, 60);
});

const loadCashTransactions = async () => {
  const res = await api.getCashTransactions({ type: txTypeFilter.value || undefined });
  cashTransactions.value = res.list || [];
};

const selectAccountFilter = (accId: number) => {
  activeTab.value = 'cash';
};

const openCashModal = (type: 'INCOME' | 'EXPENSE') => {
  cashForm.value = {
    type,
    accountId: type === 'INCOME' ? 2 : 1,
    amount: 50000,
    category: type === 'INCOME' ? 'Предоплата 50%' : 'Оплата портному',
    relatedOrderNo: '',
    comment: '',
  };
  cashModalVisible.value = true;
};

const submitCashTransaction = async () => {
  if (!cashForm.value.amount || cashForm.value.amount <= 0) {
    ElMessage.warning('Укажите корректную сумму операции');
    return;
  }
  await api.createCashTransaction(cashForm.value);
  ElMessage.success('Кассовая операция успешно проведена');
  cashModalVisible.value = false;
  await loadAllData();
};

const openPurchaseModal = () => {
  purchaseForm.value = {
    supplier: 'Loro Piana S.p.A. (Италия)',
    materialName: 'Шерсть Super 150s Tasmanian',
    quantity: 20,
    unit: 'м',
    pricePerUnit: 15400,
    accountId: 3,
    paymentStatus: 'PAID',
  };
  purchaseModalVisible.value = true;
};

const submitPurchase = async () => {
  if (!purchaseForm.value.materialName) {
    ElMessage.warning('Укажите артикул или наименование ткани');
    return;
  }
  await api.createPurchase(purchaseForm.value);
  ElMessage.success('Поставка ткани оприходована и проведена');
  purchaseModalVisible.value = false;
  await loadAllData();
};

// ECharts Initializations
const initCharts = () => {
  initPnlChart();
  initExpenseChart();
  initChannelPieChart();
  initChannelBarChart();
};

const initPnlChart = () => {
  if (!pnlChartRef.value) return;
  pnlChartInstance.value = pnlChartInstance.value || echarts.getInstanceByDom(pnlChartRef.value) || echarts.init(pnlChartRef.value);

  const months = overview.value.pnlTrend?.months || ['Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'];
  const rev = overview.value.pnlTrend?.revenue || [1200000, 1450000, 1680000, 1920000, 2150000, 2470000];
  const cogs = overview.value.pnlTrend?.cogs || [450000, 520000, 610000, 680000, 740000, 840000];
  const profit = overview.value.pnlTrend?.netProfit || [520000, 660000, 770000, 890000, 980000, 1150000];

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1A1A1E',
      borderColor: '#C5A059',
      textStyle: { color: '#FFFFFF' }
    },
    legend: {
      data: ['Выручка', 'Себестоимость', 'Чистая прибыль'],
      textStyle: { color: '#A1A1AA', fontSize: 11 },
      top: 0
    },
    grid: {
      left: isMobile.value ? '12%' : '8%',
      right: '4%',
      bottom: '10%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: 'rgba(197, 160, 89, 0.2)' } },
      axisLabel: { color: '#A1A1AA', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
      axisLabel: {
        color: '#A1A1AA',
        fontSize: 10,
        formatter: (val: number) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}k`)
      }
    },
    series: [
      {
        name: 'Выручка',
        type: 'line',
        smooth: true,
        data: rev,
        itemStyle: { color: '#DFBE7A' },
        lineStyle: { width: 3 }
      },
      {
        name: 'Себестоимость',
        type: 'line',
        smooth: true,
        data: cogs,
        itemStyle: { color: '#E53E3E' },
        lineStyle: { width: 2, type: 'dashed' }
      },
      {
        name: 'Чистая прибыль',
        type: 'bar',
        data: profit,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#10B981' },
            { offset: 1, color: '#047857' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };

  pnlChartInstance.value.setOption(option);
};

const initExpenseChart = () => {
  if (!expenseChartRef.value) return;
  expenseChartInstance.value = expenseChartInstance.value || echarts.getInstanceByDom(expenseChartRef.value) || echarts.init(expenseChartRef.value);

  const data = expenseCategories.value.map(item => ({
    name: item.shortName,
    value: item.value
  }));

  const total = totalExpenses.value;

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: '#1A1A1E',
      borderColor: '#C5A059',
      borderWidth: 1,
      textStyle: { color: '#FFFFFF', fontSize: 12 },
      formatter: '{b}: <br/><b>{c}%</b> от общих затрат'
    },
    title: {
      text: `${formatMoney(total)} ₽`,
      subtext: 'Всего затрат',
      left: 'center',
      top: '38%',
      textStyle: {
        color: '#FFFFFF',
        fontSize: isMobile.value ? 15 : 17,
        fontWeight: 'bold',
        fontFamily: 'Jura, sans-serif'
      },
      subtextStyle: {
        color: '#A1A1AA',
        fontSize: 11
      }
    },
    legend: {
      show: false
    },
    series: [
      {
        name: 'Структура расходов',
        type: 'pie',
        radius: ['54%', '76%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data,
        color: ['#C5A059', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B']
      }
    ]
  };

  expenseChartInstance.value.setOption(option);
  expenseChartInstance.value.resize();
};

const initChannelPieChart = () => {
  if (!channelPieChartRef.value) return;
  channelPieChartInstance.value = channelPieChartInstance.value || echarts.getInstanceByDom(channelPieChartRef.value) || echarts.init(channelPieChartRef.value);

  const data = channelAnalytics.value.map(c => ({
    name: formatChannelShort(c.channel),
    value: c.totalRevenue
  }));

  const total = totalChannelsRevenue.value;

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1A1A1E',
      borderColor: '#C5A059',
      borderWidth: 1,
      textStyle: { color: '#FFFFFF', fontSize: 12 },
      formatter: '{b}: <br/><b>{c} ₽</b> ({d}%)'
    },
    title: {
      text: `${formatMoney(total)} ₽`,
      subtext: 'Выручка каналов',
      left: 'center',
      top: '38%',
      textStyle: {
        color: '#FFFFFF',
        fontSize: isMobile.value ? 16 : 18,
        fontWeight: 'bold',
        fontFamily: 'Jura, sans-serif'
      },
      subtextStyle: {
        color: '#A1A1AA',
        fontSize: 11
      }
    },
    legend: {
      show: false
    },
    series: [
      {
        name: 'Выручка по каналам',
        type: 'pie',
        radius: ['54%', '76%'],
        center: ['50%', '50%'],
        data,
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        color: ['#E1306C', '#25D366', '#0088CC', '#C5A059']
      }
    ]
  };

  channelPieChartInstance.value.setOption(option);
  channelPieChartInstance.value.resize();
};

const initChannelBarChart = () => {
  // Transformed to native luxury HTML conversion board for 100% responsiveness and high fidelity
};

const handleResize = () => {
  pnlChartInstance.value?.resize();
  expenseChartInstance.value?.resize();
  channelPieChartInstance.value?.resize();
};

const formatMoney = (val: number) => {
  if (!val) return '0';
  return new Intl.NumberFormat('ru-RU').format(Math.round(val));
};
</script>

<style scoped lang="scss">
.kn-finance-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.35s ease;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 1. Capital Liquidity Banner */
.kn-capital-banner {
  background: linear-gradient(135deg, rgba(20, 20, 24, 0.95), rgba(14, 14, 16, 0.98));
  border: 1px solid var(--kn-gold-primary);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 0 20px rgba(197, 160, 89, 0.12);
  border-radius: 14px;
  padding: 22px 24px;
}

.kn-capital-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(197, 160, 89, 0.12);
  border: 1px solid rgba(197, 160, 89, 0.35);
  color: var(--kn-gold-primary);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.kn-capital-total-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.kn-capital-label {
  font-size: 13px;
  color: var(--kn-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: block;
  margin-bottom: 4px;
}

.kn-capital-amount {
  font-size: 36px;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.1;

  .kn-rub {
    color: var(--kn-gold-primary);
    font-size: 28px;
  }
}

.kn-capital-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.kn-btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &.income {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #10B981;
    &:hover { background: rgba(16, 185, 129, 0.25); }
  }

  &.purchase {
    background: rgba(197, 160, 89, 0.18);
    border: 1px solid var(--kn-gold-primary);
    color: var(--kn-gold-light);
    &:hover { background: rgba(197, 160, 89, 0.3); }
  }

  &.expense {
    background: rgba(229, 62, 62, 0.15);
    border: 1px solid rgba(229, 62, 62, 0.35);
    color: #F87171;
    &:hover { background: rgba(229, 62, 62, 0.25); }
  }
}

/* Account Balance Strips */
.kn-accounts-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.kn-acc-pill {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--kn-gold-primary);
    background: rgba(197, 160, 89, 0.06);
  }
}

.kn-acc-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(197, 160, 89, 0.15);
  color: var(--kn-gold-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kn-acc-info {
  display: flex;
  flex-direction: column;
}

.kn-acc-name {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-acc-balance {
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
}

/* 2. Navigation Tabs & Slider */
.kn-nav-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.kn-finance-nav-wrap {
  position: relative;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  margin: 0;
  padding: 4px 2px 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(197, 160, 89, 0.4) transparent;

  &::-webkit-scrollbar {
    height: 3px;
    display: block;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(197, 160, 89, 0.35);
    border-radius: 999px;
    &:hover {
      background: var(--kn-gold-primary);
    }
  }
}

.kn-finance-nav {
  display: flex;
  gap: 8px;
  width: max-content;
  min-width: 100%;
  padding-bottom: 2px;
}

.kn-finance-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--kn-text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: rgba(197, 160, 89, 0.08);
    border-color: rgba(197, 160, 89, 0.3);
    color: #FFFFFF;
  }

  &.active {
    background: var(--kn-gold-primary);
    border-color: var(--kn-gold-primary);
    color: #0E0E10;
    box-shadow: 0 4px 14px rgba(197, 160, 89, 0.35);
  }
}

.kn-tab-badge {
  background: #E1306C;
  color: #FFFFFF;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
  letter-spacing: 0.04em;
}

/* Luxury Interactive Slider Bar ("Ползунок") */
.kn-nav-slider-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px 4px;
  animation: fadeIn 0.3s ease;
}

.kn-nav-slider-track {
  position: relative;
  flex: 1;
  max-width: 180px;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  cursor: pointer;
  overflow: hidden;
}

.kn-nav-slider-thumb {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--kn-gold-primary), #E5C378);
  border-radius: 999px;
  box-shadow: 0 0 10px rgba(197, 160, 89, 0.6);
  transition: left 0.15s ease-out;
}

.kn-nav-slider-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
}

.kn-nav-counter {
  color: var(--kn-gold-primary);
  font-weight: 600;
  letter-spacing: 0.2px;
}

.kn-nav-hint {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--kn-text-muted);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 3. Cards & Grids */
.kn-card {
  background: var(--kn-bg-surface);
  border: 1px solid var(--kn-gold-border-subtle);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--kn-card-shadow);
}

.kn-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.kn-kpi-card {
  display: flex;
  flex-direction: column;
}

.kn-kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.kn-kpi-title {
  font-size: 12px;
  color: var(--kn-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.kn-kpi-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 12px;

  &.success { background: rgba(16, 185, 129, 0.15); color: #10B981; }
  &.warning { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
  &.info { background: rgba(59, 130, 246, 0.15); color: #60A5FA; }
  &.gold { background: rgba(197, 160, 89, 0.2); color: var(--kn-gold-light); }
}

.kn-kpi-val {
  font-size: 26px;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 6px;

  .kn-rub {
    font-size: 18px;
    color: var(--kn-gold-primary);
  }

  &.profit-val {
    color: #10B981;
  }
}

.kn-kpi-sub {
  font-size: 11px;
  color: var(--kn-text-muted);
}

/* Charts Grid */
.kn-charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.kn-chart-title {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.kn-chart-sub {
  font-size: 12px;
  color: var(--kn-text-muted);
  margin-bottom: 14px;
}

.kn-echarts-box {
  width: 100%;
  height: 320px;
}

/* Channel Analytics Specific Charts & Breakdown */
.kn-channel-analytics-grid {
  margin-top: 16px;
}

.kn-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.kn-chart-total-pill, .kn-chart-badge {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  background: rgba(197, 160, 89, 0.12);
  color: var(--kn-gold-primary);
  border: 1px solid rgba(197, 160, 89, 0.25);
  white-space: nowrap;
}

.kn-donut-container {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kn-echarts-donut {
  width: 100%;
  height: 200px;
}

/* Expense Structure Card */
.kn-expense-structure-card {
  display: flex;
  flex-direction: column;
}

.kn-expense-visual-bar-wrap {
  width: 100%;
  margin-bottom: 12px;
}

.kn-expense-stacked-bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  display: flex;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
}

.kn-expense-bar-segment {
  height: 100%;
  transition: width 0.4s ease;
  &:not(:last-child) {
    border-right: 1px solid #0E0E10;
  }
}

.kn-expense-donut {
  height: 190px;
}

.kn-expense-breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
  width: 100%;
}

.kn-expense-row-card {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(197, 160, 89, 0.3);
  }
}

.kn-expense-row-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.kn-expense-name-wrap {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.kn-expense-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.kn-expense-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.3;
}

.kn-expense-desc {
  display: block;
  font-size: 11px;
  color: var(--kn-text-muted);
  margin-top: 2px;
  line-height: 1.3;
}

.kn-expense-numbers {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.kn-expense-amount {
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
  white-space: nowrap;
}

.kn-expense-pct-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
}

.kn-expense-track {
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.kn-expense-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Channel Legend List */
.kn-channel-legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  width: 100%;
}

.kn-channel-legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(197, 160, 89, 0.3);
  }
}

.kn-legend-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kn-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  &.instagram { background: #E1306C; box-shadow: 0 0 8px rgba(225, 48, 108, 0.6); }
  &.whatsapp { background: #25D366; box-shadow: 0 0 8px rgba(37, 211, 102, 0.6); }
  &.telegram { background: #0088CC; box-shadow: 0 0 8px rgba(0, 136, 204, 0.6); }
  &.salon { background: var(--kn-gold-primary); box-shadow: 0 0 8px rgba(197, 160, 89, 0.6); }
}

.kn-legend-name {
  font-size: 13px;
  font-weight: 500;
  color: #E4E4E7;
}

.kn-legend-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kn-legend-val {
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
}

.kn-legend-pct {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;

  &.instagram { background: rgba(225, 48, 108, 0.15); color: #FF6584; }
  &.whatsapp { background: rgba(37, 211, 102, 0.15); color: #25D366; }
  &.telegram { background: rgba(0, 136, 204, 0.15); color: #38BDF8; }
  &.salon { background: rgba(197, 160, 89, 0.15); color: var(--kn-gold-primary); }
}

/* Horizontal Conversion Board */
.kn-channel-conversion-board {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.kn-conv-row-card {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(197, 160, 89, 0.3);
    background: rgba(255, 255, 255, 0.04);
  }
}

.kn-conv-row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kn-conv-channel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kn-conv-icon-wrap {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.instagram { background: linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045); color: #fff; }
  &.whatsapp { background: #25D366; color: #fff; }
  &.telegram { background: #0088CC; color: #fff; }
  &.salon { background: var(--kn-gold-primary); color: #0E0E10; }
}

.kn-conv-channel-name {
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
}

.kn-conv-badge {
  display: flex;
  align-items: baseline;
  gap: 4px;

  .kn-conv-rate {
    font-size: 15px;
    font-weight: 700;
    color: var(--kn-gold-primary);
  }

  .kn-conv-label {
    font-size: 10px;
    color: var(--kn-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
}

.kn-conv-progress-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.kn-conv-progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  &.instagram { background: linear-gradient(90deg, #E1306C, #FD1D1D); box-shadow: 0 0 8px rgba(225, 48, 108, 0.5); }
  &.whatsapp { background: linear-gradient(90deg, #10B981, #25D366); box-shadow: 0 0 8px rgba(37, 211, 102, 0.5); }
  &.telegram { background: linear-gradient(90deg, #0088CC, #38BDF8); box-shadow: 0 0 8px rgba(0, 136, 204, 0.5); }
  &.salon { background: linear-gradient(90deg, #C5A059, #F59E0B); box-shadow: 0 0 8px rgba(197, 160, 89, 0.5); }
}

.kn-conv-row-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--kn-text-muted);
  flex-wrap: wrap;
  gap: 6px;

  strong {
    font-weight: 600;
  }
}

/* Channel Cards */
.kn-channels-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.kn-channel-card {
  padding: 18px;
  border: 1px solid rgba(197, 160, 89, 0.2);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--kn-gold-primary);
    transform: translateY(-2px);
  }

  &.instagram .kn-channel-icon-wrap { background: linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045); color: #fff; }
  &.whatsapp .kn-channel-icon-wrap { background: #25D366; color: #fff; }
  &.telegram .kn-channel-icon-wrap { background: #0088CC; color: #fff; }
  &.salon .kn-channel-icon-wrap { background: var(--kn-gold-primary); color: #0E0E10; }
}

.kn-channel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.kn-channel-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.kn-channel-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kn-channel-title {
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.kn-channel-leads {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-channel-margin-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

.kn-channel-metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  background: rgba(0, 0, 0, 0.25);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.kn-cm-item {
  display: flex;
  flex-direction: column;
}

.kn-cm-lbl {
  font-size: 10px;
  color: var(--kn-text-muted);
  text-transform: uppercase;
}

.kn-cm-val {
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
}

.text-gold { color: var(--kn-gold-primary); }

.kn-channel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.kn-channel-profit {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--kn-text-muted);

  strong {
    color: #10B981;
    font-size: 13px;
  }
}

.kn-channel-spend {
  font-size: 11px;
  color: #F87171;

  &.organic { color: #60A5FA; }
}

/* Tables & Cards */
.kn-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.kn-table-title {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.kn-table-sub {
  font-size: 12px;
  color: var(--kn-text-muted);
}

.kn-order-badge {
  font-size: 12px;
  font-weight: 700;
  color: var(--kn-gold-primary);
  background: rgba(197, 160, 89, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(197, 160, 89, 0.25);
}

.kn-tx-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;

  &.income { background: rgba(16, 185, 129, 0.15); color: #10B981; }
  &.expense { background: rgba(229, 62, 62, 0.15); color: #F87171; }
}

.kn-tx-amount {
  font-size: 14px;
  font-weight: 700;

  &.text-income { color: #10B981; }
  &.text-expense { color: #F87171; }
}

.kn-fabric-tag {
  font-size: 10px;
  color: var(--kn-gold-light);
  background: rgba(197, 160, 89, 0.12);
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
}

.kn-category-tag {
  font-size: 11px;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 6px;
}

.kn-comment-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kn-related-order {
  font-size: 10px;
  color: var(--kn-gold-primary);
}

.kn-margin-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kn-btn-gold {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--kn-gold-primary);
  color: #0E0E10;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--kn-gold-light);
    transform: translateY(-1px);
  }
}

/* Mobile Transaction & Purchase Cards */
.kn-mobile-tx-list,
.kn-mobile-purchases-list,
.kn-mobile-eco-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kn-mobile-tx-card,
.kn-mobile-purchase-card,
.kn-mobile-eco-card {
  padding: 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(197, 160, 89, 0.18);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kn-mtx-top, .kn-mp-top, .kn-meco-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kn-mtx-amount-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kn-mtx-cat {
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
}

.kn-mtx-amount {
  font-size: 16px;
  font-weight: 800;
}

.kn-mtx-comment {
  font-size: 12px;
  color: var(--kn-text-muted);
  margin: 0;
}

.kn-mtx-footer, .kn-mp-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: var(--kn-text-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 6px;
}

.kn-mp-supplier {
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
}

.kn-mp-name {
  font-size: 12px;
  color: var(--kn-gold-light);
}

.kn-mp-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: rgba(0, 0, 0, 0.25);
  padding: 8px 10px;
  border-radius: 6px;
}

.kn-mp-met {
  display: flex;
  flex-direction: column;
  span { font-size: 9px; color: var(--kn-text-muted); }
  strong { font-size: 12px; }
}

.kn-meco-client {
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
}

.kn-meco-item {
  font-size: 12px;
  color: var(--kn-gold-light);
}

.kn-meco-split {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 11px;
}

.kn-meco-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.highlight { font-weight: 700; }
}

.kn-form-row {
  display: flex;
  gap: 12px;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .kn-kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .kn-charts-grid {
    grid-template-columns: 1fr;
  }
  .kn-channels-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .kn-card {
    padding: 14px 12px;
  }

  .kn-capital-banner {
    padding: 16px 14px;
  }

  .kn-capital-total-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .kn-capital-amount {
    font-size: 28px;
    .kn-rub { font-size: 22px; }
  }

  .kn-capital-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
  }

  .kn-btn-action {
    padding: 8px 6px;
    font-size: 11px;
    justify-content: center;
    span { white-space: nowrap; }
  }

  .kn-accounts-strip {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  /* Responsive Horizontal Tabs with Luxury Slider */
  .kn-finance-nav-wrap {
    overflow-x: auto;
    width: 100%;
    margin: 0;
    padding: 2px 0 4px;
  }

  .kn-finance-nav {
    display: flex;
    width: max-content;
    gap: 8px;
  }

  .kn-finance-tab {
    width: auto;
    flex-shrink: 0;
    padding: 9px 14px;
    font-size: 12px;
  }

  /* 4 KPI Cards - Perfectly Fitted */
  .kn-kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    margin-bottom: 16px;
  }

  .kn-kpi-card {
    padding: 14px 12px;
    min-width: 0;
    overflow: hidden;
  }

  .kn-kpi-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    margin-bottom: 6px;
    min-width: 0;
  }

  .kn-kpi-title {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--kn-text-muted);
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .kn-kpi-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 5px;
    border-radius: 6px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .kn-kpi-val {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .kn-rub {
      font-size: 14px;
    }
  }

  .kn-kpi-sub {
    font-size: 10.5px;
    line-height: 1.25;
    color: var(--kn-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .kn-echarts-box {
    height: 260px;
  }

  .kn-channel-metrics-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

@media (max-width: 440px) {
  .kn-kpi-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .kn-kpi-card {
    padding: 14px 14px;
  }
  .kn-kpi-val {
    font-size: 22px;
  }
}
</style>
