<template>
  <div class="kn-orders-page">
    <!-- Top Header -->
    <div class="kn-page-header">
      <div>
        <h1 class="kn-page-title font-brand">Управление Заказами и Индивидуальным Пошивом</h1>
        <p class="kn-page-subtitle">
          База заказов KINGSNAME • Снятие мерок, конфигурация костюмов и контроль этапов пошива
        </p>
      </div>

      <button class="kn-gold-button font-brand" @click="openCreateDrawer">
        <span>+ Оформить Заказ / Снять Мерки</span>
      </button>
    </div>

    <!-- Filter Controls Bar -->
    <div class="kn-card kn-filters-card">
      <div class="kn-filter-row">
        <!-- Search -->
        <div class="kn-search-input">
          <el-input
            v-model="searchQuery"
            placeholder="Поиск по № заказа, клиенту, телефону, Instagram..."
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <Search :size="15" :stroke-width="1.8" class="kn-search-icon" />
            </template>
          </el-input>
        </div>

        <!-- Channel Filter -->
        <el-select v-model="filterChannel" placeholder="Канал заявки" clearable @change="handleFilter">
          <el-option label="Все каналы" value="" />
          <el-option label="Instagram (@kingsname)" value="INSTAGRAM" />
          <el-option label="Сайт (kingsname.store)" value="WEBSITE" />
          <el-option label="Салон KINGSNAME (Грозный)" value="SALON_GROZNY" />
          <el-option label="Телефонный звонок" value="PHONE" />
        </el-select>

        <!-- Product Type Filter -->
        <el-select v-model="filterProductType" placeholder="Тип изделия" clearable @change="handleFilter">
          <el-option label="Все изделия" value="" />
          <el-option label="Костюм-тройка" value="Костюм-тройка" />
          <el-option label="Смокинг Black Tie" value="Смокинг" />
          <el-option label="Костюм-двойка" value="Костюм-двойка" />
          <el-option label="Пальто кашемировое" value="Пальто" />
          <el-option label="Сорочка ручной работы" value="Сорочка" />
        </el-select>
      </div>

      <!-- Funnel Status Tabs -->
      <div class="kn-status-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="kn-status-tab"
          :class="{ active: currentStatus === tab.value }"
          @click="setStatusFilter(tab.value)"
        >
          <span>{{ tab.label }}</span>
          <span class="kn-tab-badge">{{ getTabCount(tab.value) }}</span>
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="kn-card kn-table-card">
      <el-table :data="filteredOrders" style="width: 100%" v-loading="loading">
        <!-- Order No & Channel -->
        <el-table-column prop="orderNo" label="№ Заказа" width="160">
          <template #default="{ row }">
            <div class="kn-order-no-cell font-outfit">
              <span class="kn-order-code">{{ row.orderNo }}</span>
              <span class="kn-channel-badge" :class="row.channel.toLowerCase()">
                {{ formatChannel(row.channel) }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- Client Info -->
        <el-table-column prop="clientName" label="Клиент" min-width="190">
          <template #default="{ row }">
            <div class="kn-client-info-cell">
              <strong class="kn-client-name">{{ row.clientName }}</strong>
              <span class="kn-client-tel">{{ row.clientPhone }}</span>
              <span v-if="row.clientInstagram" class="kn-client-insta">
                <Instagram :size="12" :stroke-width="1.8" />
                <span>{{ row.clientInstagram }}</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- Suit & Customization Details -->
        <el-table-column prop="productType" label="Изделие и Ткань" min-width="220">
          <template #default="{ row }">
            <div class="kn-suit-cell">
              <div class="kn-suit-title">
                <strong>{{ row.productType }}</strong>
                <span class="kn-order-type-tag">{{ row.orderType }}</span>
              </div>
              <div class="kn-suit-specs font-outfit">
                <span>{{ row.fabricBrand }} • {{ row.fabricColor }}</span>
                <span v-if="row.monogram" class="kn-monogram-pill">
                  Монограмма: «{{ row.monogram }}»
                </span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Measurements Summary -->
        <el-table-column label="Мерки (см)" width="180">
          <template #default="{ row }">
            <div class="kn-measurements-pill" @click="openDrawerForEdit(row)">
              <span v-if="row.height">Рост: {{ row.height }} | Гр: {{ row.chest }} | Т: {{ row.waist }}</span>
              <span v-else class="kn-no-measurements">Мерки не зафиксированы</span>
            </div>
          </template>
        </el-table-column>

        <!-- 6-Stage Funnel Status Dropdown -->
        <el-table-column prop="status" label="Этап Воронки" width="200">
          <template #default="{ row }">
            <el-select
              :model-value="row.status"
              size="small"
              class="kn-status-select"
              @change="(val: string) => handleStatusChange(row.id, val)"
            >
              <el-option label="1. Новая заявка" value="LEAD" />
              <el-option label="2. Запись на примерку" value="APPOINTMENT" />
              <el-option label="3. Снятие мерок" value="FITTING" />
              <el-option label="4. Согласован / Предоплата" value="PAYMENT_AGREED" />
              <el-option label="5. Пошив в мастерской" value="TAILORING" />
              <el-option label="6. Выдан / Доставлен" value="DELIVERED" />
            </el-select>
          </template>
        </el-table-column>

        <!-- Financials -->
        <el-table-column prop="totalAmount" label="Финансы" width="180" align="right">
          <template #default="{ row }">
            <div class="kn-fin-col font-outfit">
              <span class="kn-total-price">{{ formatMoney(row.totalAmount) }} ₽</span>
              <div class="kn-deposit-row">
                <span class="kn-deposit-label">Аванс: {{ formatMoney(row.depositAmount) }} ₽</span>
              </div>
              <span v-if="row.balanceAmount > 0" class="kn-balance-due">
                Долг: {{ formatMoney(row.balanceAmount) }} ₽
              </span>
              <span v-else class="kn-balance-paid">Оплачен</span>
            </div>
          </template>
        </el-table-column>

        <!-- Action Buttons -->
        <el-table-column label="Действия" width="160" align="center">
          <template #default="{ row }">
            <div class="kn-row-actions">
              <button class="kn-action-btn edit" title="Редактировать заказ" @click="openDrawerForEdit(row)">
                <Pencil :size="14" :stroke-width="1.8" />
              </button>
              <button class="kn-action-btn print" title="Распечатать лист мерок портного" @click="openPrintSheet(row)">
                <Printer :size="14" :stroke-width="1.8" />
              </button>
              <button class="kn-action-btn pay" title="Принять платеж" @click="openPaymentDialog(row)">
                <CreditCard :size="14" :stroke-width="1.8" />
              </button>
              <button class="kn-action-btn del" title="Удалить" @click="handleDelete(row.id)">
                <Trash2 :size="14" :stroke-width="1.8" />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Comprehensive Bespoke Suit Drawer -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? `Заказ ${form.orderNo} — Индивидуальный пошив` : 'Новый Заказ Bespoke — KINGSNAME'"
      :size="drawerSize"
      direction="rtl"
    >
      <div class="kn-drawer-body">
        <el-tabs v-model="activeDrawerTab">
          <!-- Tab 1: Client & Source -->
          <el-tab-pane label="1. Клиент и Канал" name="client">
            <div class="kn-tab-content">
              <el-form :model="form" label-position="top">
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="ФИО Клиента">
                      <el-input v-model="form.clientName" placeholder="ФИО заказчика" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Телефон">
                      <el-input v-model="form.clientPhone" placeholder="+7 (928) 000-00-00" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Город">
                      <el-select v-model="form.clientCity" placeholder="Город клиента" style="width: 100%">
                        <el-option label="Грозный" value="Грозный" />
                        <el-option label="Махачкала" value="Махачкала" />
                        <el-option label="Москва" value="Москва" />
                        <el-option label="Дубай" value="Дубай" />
                        <el-option label="Санкт-Петербург" value="Санкт-Петербург" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Instagram аккаунт">
                      <el-input v-model="form.clientInstagram" placeholder="@username" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Канал привлечения">
                      <el-select v-model="form.channel" style="width: 100%">
                        <el-option label="Instagram Direct (@kingsname)" value="INSTAGRAM" />
                        <el-option label="Официальный сайт (kingsname.store)" value="WEBSITE" />
                        <el-option label="Салон KINGSNAME (Грозный)" value="SALON_GROZNY" />
                        <el-option label="Телефон" value="PHONE" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Формат изготовления">
                      <el-radio-group v-model="form.orderType">
                        <el-radio label="BESPOKE">Индивидуальный пошив</el-radio>
                        <el-radio label="RTW">Готовый размер</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="Тип изделия">
                  <el-select v-model="form.productType" style="width: 100%">
                    <el-option label="Костюм-тройка с жилетом (Bespoke)" value="Костюм-тройка" />
                    <el-option label="Смокинг Black Tie с атласными лацканами" value="Смокинг Black Tie" />
                    <el-option label="Костюм-двойка классический" value="Костюм-двойка" />
                    <el-option label="Пальто мужское из 100% кашемира" value="Пальто кашемировое" />
                    <el-option label="Пиджак ручной работы" value="Пиджак" />
                    <el-option label="Сорочка из итальянского хлопка" value="Сорочка ручной работы" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <!-- Tab 2: Anatomical Measurements (Bespoke Tailor Sheet) -->
          <el-tab-pane label="2. Анатомические Мерки" name="measurements">
            <div class="kn-tab-content">
              <div class="kn-measurements-banner">
                <span class="kn-measure-icon">
                  <Ruler :size="22" :stroke-width="1.8" />
                </span>
                <div>
                  <strong>Лист мерок мастера-портного</strong>
                  <p>Все параметры указываются в сантиметрах с точностью до 0.5 см</p>
                </div>
              </div>

              <el-form :model="form" label-position="top">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="Рост (см)">
                      <el-input-number v-model="form.height" :min="150" :max="220" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Обхват груди (см)">
                      <el-input-number v-model="form.chest" :min="80" :max="160" :step="0.5" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Обхват талии (см)">
                      <el-input-number v-model="form.waist" :min="65" :max="150" :step="0.5" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="Обхват бедер (см)">
                      <el-input-number v-model="form.hips" :min="80" :max="160" :step="0.5" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Ширина плеч (см)">
                      <el-input-number v-model="form.shoulderWidth" :min="40" :max="65" :step="0.5" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="Длина рукава (см)">
                      <el-input-number v-model="form.sleeveLength" :min="55" :max="80" :step="0.5" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Длина брюк (см)">
                      <el-input-number v-model="form.trouserLength" :min="90" :max="130" :step="0.5" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Силуэт посадки">
                      <el-select v-model="form.fitType" style="width: 100%">
                        <el-option label="Slim Fit (приталенный крой)" value="Slim Fit" />
                        <el-option label="Regular Classic (традиционный прямой)" value="Regular Classic" />
                        <el-option label="Bespoke Silhouette (индивидуальная анатомия)" value="Bespoke Silhouette" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="Заметки портного (асимметрия, осанка)">
                  <el-input
                    v-model="form.tailorNotes"
                    type="textarea"
                    rows="3"
                    placeholder="Например: наклон правого плеча -0.5 см, высокий подъем воротника..."
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <!-- Tab 3: Fabric & Customization Details -->
          <el-tab-pane label="3. Ткань и Спецификация" name="fabric">
            <div class="kn-tab-content">
              <el-form :model="form" label-position="top">
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Фабрика / Производитель ткани">
                      <el-select v-model="form.fabricBrand" style="width: 100%">
                        <el-option label="Loro Piana (Италия)" value="Loro Piana" />
                        <el-option label="Vitale Barberis Canonico (Италия)" value="Vitale Barberis Canonico" />
                        <el-option label="Scabal (Англия)" value="Scabal" />
                        <el-option label="Cerruti 1881" value="Cerruti" />
                        <el-option label="Dormeuil (Франция/Англия)" value="Dormeuil" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Артикул ткани и состав">
                      <el-input v-model="form.fabricSku" placeholder="Например: LP-SUPER150-NAVY" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Цвет / Рисунок">
                      <el-select v-model="form.fabricColor" style="width: 100%">
                        <el-option label="Royal Navy (Глубокий синий)" value="Royal Navy" />
                        <el-option label="Charcoal Grey (Графитовый серый)" value="Charcoal Grey" />
                        <el-option label="Black Tie (Глубокий черный)" value="Black Tie" />
                        <el-option label="Твидовая клетка (English Check)" value="Твидовая клетка" />
                        <el-option label="Midnight Blue" value="Midnight Blue" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Тип лацканов">
                      <el-select v-model="form.lapelType" style="width: 100%">
                        <el-option label="Прямой лацкан (Notch)" value="Notch" />
                        <el-option label="Заостренный лацкан (Peak)" value="Peak" />
                        <el-option label="Шалевый лацкан (Shawl)" value="Shawl" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Персональная монограмма">
                      <el-input v-model="form.monogram" placeholder="Инициалы клиента (например: K.A.M.)" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Фурнитура / Пуговицы">
                      <el-select v-model="form.buttonType" style="width: 100%">
                        <el-option label="Натуральный рог (Natural Horn)" value="Natural Horn" />
                        <el-option label="Перламутр (Mother of Pearl)" value="Mother of Pearl" />
                        <el-option label="Орех Корозо (Corozo)" value="Corozo" />
                        <el-option label="Атласные пуговицы (для смокинга)" value="Satin Covered" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>

          <!-- Tab 4: Financials & Dates -->
          <el-tab-pane label="4. Финансы и Сроки" name="finances">
            <div class="kn-tab-content">
              <el-form :model="form" label-position="top">
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Общая стоимость заказа (₽)">
                      <el-input-number
                        v-model="form.totalAmount"
                        :min="0"
                        :step="5000"
                        style="width: 100%"
                        @change="recalcBalance"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Внесенная предоплата (₽)">
                      <el-input-number
                        v-model="form.depositAmount"
                        :min="0"
                        :step="5000"
                        style="width: 100%"
                        @change="recalcBalance"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- Balance Summary Box -->
                <div class="kn-balance-summary-box">
                  <div class="kn-balance-item">
                    <span>Остаток к оплате:</span>
                    <strong class="kn-debt-sum font-outfit">{{ formatMoney(calculatedBalance) }} ₽</strong>
                  </div>
                  <div class="kn-balance-item">
                    <span>Статус расчетов:</span>
                    <el-tag :type="calculatedBalance === 0 ? 'success' : form.depositAmount > 0 ? 'warning' : 'info'">
                      {{ calculatedBalance === 0 ? 'Полностью оплачен' : form.depositAmount > 0 ? 'Частичная предоплата' : 'Ожидает оплаты' }}
                    </el-tag>
                  </div>
                </div>

                <el-row :gutter="16" style="margin-top: 16px;">
                  <el-col :span="12">
                    <el-form-item label="Способ оплаты">
                      <el-select v-model="form.paymentMethod" style="width: 100%">
                        <el-option label="Наличные в салоне" value="Наличные" />
                        <el-option label="Банковская карта (терминал)" value="Карта" />
                        <el-option label="Безналичный перевод на счет" value="Банковский перевод" />
                        <el-option label="Система быстрых платежей (СБП)" value="СБП" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Текущий этап воронки">
                      <el-select v-model="form.status" style="width: 100%">
                        <el-option label="1. Новая заявка" value="LEAD" />
                        <el-option label="2. Запись на примерку" value="APPOINTMENT" />
                        <el-option label="3. Снятие мерок" value="FITTING" />
                        <el-option label="4. Согласован / Предоплата" value="PAYMENT_AGREED" />
                        <el-option label="5. Пошив в мастерской" value="TAILORING" />
                        <el-option label="6. Выдан / Доставлен" value="DELIVERED" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="Дата примерки в салоне">
                      <el-date-picker
                        v-model="form.appointmentDate"
                        type="datetime"
                        placeholder="Дата визита"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Планируемая дата готовности">
                      <el-date-picker
                        v-model="form.targetCompletionDate"
                        type="date"
                        placeholder="Срок пошива"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <div class="kn-drawer-footer">
          <el-button @click="drawerVisible = false">Отмена</el-button>
          <button class="kn-gold-button font-brand" @click="saveOrder">
            {{ isEdit ? 'Сохранить изменения' : 'Создать заказ Bespoke' }}
          </button>
        </div>
      </template>
    </el-drawer>

    <!-- Printable Tailor Sheet Modal -->
    <el-dialog v-model="printModalVisible" title="Лист мерок мастера-портного (KINGSNAME)" :width="printModalWidth">
      <div id="tailor-sheet" class="kn-print-sheet">
        <!-- Print Header -->
        <div class="kn-print-header">
          <div class="kn-print-brand">
            <h2 class="font-brand">KINGSNAME</h2>
            <p>HAUTE SARTORIAL & BESPOKE TAILORING • GROZNY</p>
          </div>
          <div class="kn-print-order-info font-outfit">
            <strong>ЗАКАЗ № {{ currentPrintOrder?.orderNo }}</strong>
            <span>Дата: {{ currentPrintOrder?.createTime?.slice(0, 10) }}</span>
          </div>
        </div>

        <!-- Client & Suit Info -->
        <div class="kn-print-section-row">
          <div>
            <strong>Клиент:</strong> {{ currentPrintOrder?.clientName }} ({{ currentPrintOrder?.clientPhone }})
          </div>
          <div>
            <strong>Изделие:</strong> {{ currentPrintOrder?.productType }}
          </div>
        </div>

        <!-- Measurements Grid -->
        <table class="kn-print-table">
          <thead>
            <tr>
              <th>Параметр фигуры</th>
              <th>Значение</th>
              <th>Параметр фигуры</th>
              <th>Значение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Рост</td>
              <td><strong>{{ currentPrintOrder?.height }} см</strong></td>
              <td>Ширина плеч</td>
              <td><strong>{{ currentPrintOrder?.shoulderWidth }} см</strong></td>
            </tr>
            <tr>
              <td>Обхват груди</td>
              <td><strong>{{ currentPrintOrder?.chest }} см</strong></td>
              <td>Длина рукава</td>
              <td><strong>{{ currentPrintOrder?.sleeveLength }} см</strong></td>
            </tr>
            <tr>
              <td>Обхват талии</td>
              <td><strong>{{ currentPrintOrder?.waist }} см</strong></td>
              <td>Длина брюк</td>
              <td><strong>{{ currentPrintOrder?.trouserLength }} см</strong></td>
            </tr>
            <tr>
              <td>Обхват бедер</td>
              <td><strong>{{ currentPrintOrder?.hips }} см</strong></td>
              <td>Силуэт кроя</td>
              <td><strong>{{ currentPrintOrder?.fitType }}</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- Tailoring Specification Details -->
        <div class="kn-print-details">
          <div><strong>Ткань:</strong> {{ currentPrintOrder?.fabricBrand }} ({{ currentPrintOrder?.fabricColor }})</div>
          <div><strong>Лацканы:</strong> {{ currentPrintOrder?.lapelType }} | <strong>Пуговицы:</strong> {{ currentPrintOrder?.buttonType }}</div>
          <div v-if="currentPrintOrder?.monogram"><strong>Монограмма на подкладке:</strong> «{{ currentPrintOrder?.monogram }}»</div>
          <div v-if="currentPrintOrder?.tailorNotes"><strong>Заметки мастера:</strong> {{ currentPrintOrder?.tailorNotes }}</div>
        </div>

        <!-- Signatures Footer -->
        <div class="kn-print-signatures">
          <div>Мастер-портной: __________________ (Адам)</div>
          <div>Подпись клиента: __________________</div>
        </div>
      </div>

      <template #footer>
        <el-button @click="printModalVisible = false">Закрыть</el-button>
        <el-button type="primary" @click="printSheet">Распечатать лист мерок 🖨️</el-button>
      </template>
    </el-dialog>

    <!-- Payment Quick Dialog -->
    <el-dialog v-model="paymentModalVisible" title="Прием оплаты по заказу" :width="modalWidth">
      <el-form label-position="top">
        <el-form-item label="Сумма к оплате (₽)">
          <el-input-number v-model="payAmount" :min="1000" :step="5000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Способ оплаты">
          <el-select v-model="payMethod" style="width: 100%">
            <el-option label="Наличные в салоне (г. Грозный)" value="Наличные" />
            <el-option label="Банковская карта (эквайринг)" value="Карта" />
            <el-option label="Банковский перевод на расчетный счет" value="Банковский перевод" />
            <el-option label="СБП (Система быстрых платежей)" value="СБП" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="paymentModalVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitPayment">Зафиксировать платеж</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/utils/request';
import { useResponsive } from '@/utils/useResponsive';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Search,
  Instagram,
  Pencil,
  Printer,
  CreditCard,
  Trash2,
  Ruler
} from 'lucide-vue-next';

const route = useRoute();
const { isMobile, isTablet, isDesktop, drawerSize, modalWidth, printModalWidth } = useResponsive();

const loading = ref(false);
const orders = ref<any[]>([]);
const searchQuery = ref('');
const filterChannel = ref('');
const filterProductType = ref('');
const currentStatus = ref<string>('ALL');

// Status tabs
const statusTabs = [
  { value: 'ALL', label: 'Все заказы' },
  { value: 'LEAD', label: '1. Новая заявка' },
  { value: 'APPOINTMENT', label: '2. Примерка' },
  { value: 'FITTING', label: '3. Снятие мерок' },
  { value: 'PAYMENT_AGREED', label: '4. Согласован' },
  { value: 'TAILORING', label: '5. В пошиве' },
  { value: 'DELIVERED', label: '6. Выдан' },
];

// Drawer state
const drawerVisible = ref(false);
const isEdit = ref(false);
const activeDrawerTab = ref('client');
const form = ref<any>({});

// Print & Pay modals
const printModalVisible = ref(false);
const currentPrintOrder = ref<any>(null);

const paymentModalVisible = ref(false);
const currentPayOrder = ref<any>(null);
const payAmount = ref(50000);
const payMethod = ref('Карта');

onMounted(async () => {
  if (route.query.status) {
    currentStatus.value = String(route.query.status);
  }
  await fetchOrders();
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await api.getOrders();
    orders.value = res.list || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const filteredOrders = computed(() => {
  let list = orders.value;

  if (currentStatus.value !== 'ALL') {
    list = list.filter((o) => o.status === currentStatus.value);
  }
  if (filterChannel.value) {
    list = list.filter((o) => o.channel === filterChannel.value);
  }
  if (filterProductType.value) {
    list = list.filter((o) => o.productType.includes(filterProductType.value));
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (o) =>
        o.orderNo?.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.clientPhone?.includes(q) ||
        o.fabricBrand?.toLowerCase().includes(q)
    );
  }
  return list;
});

const getTabCount = (statusKey: string) => {
  if (statusKey === 'ALL') return orders.value.length;
  return orders.value.filter((o) => o.status === statusKey).length;
};

const setStatusFilter = (statusKey: string) => {
  currentStatus.value = statusKey;
};

const handleSearch = () => {};
const handleFilter = () => {};

const calculatedBalance = computed(() => {
  const total = form.value.totalAmount || 0;
  const deposit = form.value.depositAmount || 0;
  return Math.max(0, total - deposit);
});

const recalcBalance = () => {
  form.value.balanceAmount = calculatedBalance.value;
};

const openCreateDrawer = () => {
  isEdit.value = false;
  activeDrawerTab.value = 'client';
  form.value = {
    clientName: '',
    clientPhone: '',
    clientCity: 'Грозный',
    clientInstagram: '',
    channel: 'INSTAGRAM',
    orderType: 'BESPOKE',
    productType: 'Костюм-тройка',
    height: 180,
    chest: 104,
    waist: 88,
    hips: 102,
    shoulderWidth: 47.5,
    sleeveLength: 64,
    trouserLength: 106,
    fitType: 'Slim Fit',
    fabricBrand: 'Loro Piana',
    fabricSku: 'LP-SUPER150',
    fabricColor: 'Royal Navy',
    lapelType: 'Peak',
    monogram: '',
    buttonType: 'Natural Horn',
    tailorNotes: '',
    totalAmount: 180000,
    depositAmount: 90000,
    paymentMethod: 'Карта',
    status: 'LEAD',
    appointmentDate: '',
    targetCompletionDate: '',
  };
  drawerVisible.value = true;
};

const openDrawerForEdit = (row: any) => {
  isEdit.value = true;
  activeDrawerTab.value = 'client';
  form.value = { ...row };
  drawerVisible.value = true;
};

const saveOrder = async () => {
  if (!form.value.clientName || !form.value.clientPhone) {
    ElMessage.warning('Заполните обязательные поля: Имя и Телефон клиента');
    return;
  }

  form.value.balanceAmount = calculatedBalance.value;
  await api.saveOrder(form.value);
  drawerVisible.value = false;
  ElMessage.success(isEdit.value ? 'Заказ успешно обновлен' : 'Новый заказ Bespoke создан!');
  await fetchOrders();
};

const handleStatusChange = async (orderId: number, newStatus: string) => {
  await api.updateOrderStatus(orderId, newStatus);
  ElMessage.success('Статус воронки успешно изменен');
  await fetchOrders();
};

const openPaymentDialog = (row: any) => {
  currentPayOrder.value = row;
  payAmount.value = row.balanceAmount > 0 ? row.balanceAmount : 50000;
  paymentModalVisible.value = true;
};

const submitPayment = async () => {
  if (!currentPayOrder.value) return;
  await api.recordOrderPayment(currentPayOrder.value.id, payAmount.value, payMethod.value);
  paymentModalVisible.value = false;
  ElMessage.success(`Платеж на сумму ${formatMoney(payAmount.value)} ₽ успешно принят!`);
  await fetchOrders();
};

const openPrintSheet = (row: any) => {
  currentPrintOrder.value = row;
  printModalVisible.value = true;
};

const printSheet = () => {
  window.print();
};

const handleDelete = (id: number) => {
  ElMessageBox.confirm('Удалить данный заказ из системы?', 'Подтверждение', {
    confirmButtonText: 'Удалить',
    cancelButtonText: 'Отмена',
    type: 'warning',
  }).then(async () => {
    await api.deleteOrder(id);
    ElMessage.success('Заказ удален');
    await fetchOrders();
  });
};

const formatMoney = (val: number) => {
  if (!val) return '0';
  return new Intl.NumberFormat('ru-RU').format(Math.round(val));
};

const formatChannel = (ch: string) => {
  switch (ch) {
    case 'INSTAGRAM': return '@kingsname';
    case 'WEBSITE': return 'Сайт';
    case 'SALON_GROZNY': return 'Салон Грозный';
    case 'PHONE': return 'Телефон';
    default: return ch;
  }
};
</script>

<style scoped lang="scss">
.kn-orders-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.kn-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kn-page-title {
  font-size: 24px;
  font-weight: 700;
  background: var(--kn-gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

.kn-page-subtitle {
  font-size: 13px;
  color: var(--kn-text-secondary);
}

/* Filters Card */
.kn-filters-card {
  padding: 20px;
}

.kn-filter-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.kn-search-input {
  flex: 1;
}

/* Status Tabs */
.kn-status-tabs {
  display: flex;
  gap: 8px;
  border-top: 1px solid rgba(197, 160, 89, 0.1);
  padding-top: 16px;
  overflow-x: auto;
}

.kn-status-tab {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(197, 160, 89, 0.15);
  color: #C0C1CC;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(197, 160, 89, 0.1);
    color: #FFFFFF;
  }

  &.active {
    background: rgba(197, 160, 89, 0.18);
    border-color: var(--kn-gold-primary);
    color: #DFBE7A;
    font-weight: 600;
  }
}

.kn-tab-badge {
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
}

/* Table Card */
.kn-table-card {
  padding: 20px;
}

.kn-order-no-cell {
  display: flex;
  flex-direction: column;
}

.kn-order-code {
  color: var(--kn-gold-light);
  font-weight: 700;
  font-size: 13px;
}

.kn-channel-badge {
  font-size: 10px;
  color: #9E9FA9;
  margin-top: 2px;
}

.kn-client-info-cell {
  display: flex;
  flex-direction: column;
}

.kn-client-name {
  color: #FFFFFF;
  font-size: 13px;
}

.kn-client-tel {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-client-insta {
  font-size: 11px;
  color: #FF7096;
}

.kn-suit-cell {
  display: flex;
  flex-direction: column;
}

.kn-order-type-tag {
  font-size: 9px;
  background: rgba(197, 160, 89, 0.15);
  color: var(--kn-gold-light);
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
  font-weight: 600;
}

.kn-suit-specs {
  font-size: 11px;
  color: var(--kn-text-secondary);
  margin-top: 2px;
}

.kn-monogram-pill {
  color: #DFBE7A;
  margin-left: 6px;
}

.kn-measurements-pill {
  font-size: 11px;
  color: #DFBE7A;
  background: rgba(197, 160, 89, 0.08);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px dashed rgba(197, 160, 89, 0.3);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(197, 160, 89, 0.18);
  }
}

.kn-no-measurements {
  color: var(--kn-text-muted);
}

.kn-status-select {
  width: 170px;
}

.kn-fin-col {
  display: flex;
  flex-direction: column;
}

.kn-total-price {
  font-weight: 700;
  color: #FFFFFF;
  font-size: 13px;
}

.kn-deposit-label {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-balance-due {
  font-size: 11px;
  color: #F87171;
  font-weight: 600;
}

.kn-balance-paid {
  font-size: 11px;
  color: #34D399;
  font-weight: 600;
}

.kn-row-actions {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.kn-action-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(197, 160, 89, 0.15);
  border-radius: 6px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--kn-gold-primary);

  &:hover {
    background: rgba(197, 160, 89, 0.2);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
    transform: scale(1.08);
  }

  &.del {
    color: #F87171;
    border-color: rgba(239, 68, 68, 0.2);

    &:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: #EF4444;
      color: #FFFFFF;
    }
  }
}

/* Drawer Styling */
.kn-drawer-body {
  padding: 10px 0;
}

.kn-tab-content {
  padding: 16px 4px;
}

.kn-measurements-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(197, 160, 89, 0.08);
  border: 1px solid rgba(197, 160, 89, 0.2);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;

  strong {
    color: var(--kn-gold-light);
    font-size: 13px;
  }
  p {
    font-size: 11px;
    color: var(--kn-text-muted);
  }
}

.kn-measure-icon {
  font-size: 24px;
}

.kn-balance-summary-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(197, 160, 89, 0.2);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kn-debt-sum {
  font-size: 16px;
  color: #EF4444;
  margin-left: 8px;
}

.kn-drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Print Sheet Styling */
.kn-print-sheet {
  background: #FFFFFF;
  color: #111111;
  padding: 24px;
  border-radius: 6px;
  font-family: 'Times New Roman', serif;
}

.kn-print-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #111111;
  padding-bottom: 12px;
  margin-bottom: 16px;

  h2 {
    font-size: 20px;
    letter-spacing: 0.1em;
  }
  p {
    font-size: 10px;
    color: #555555;
  }
}

.kn-print-section-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 13px;
}

.kn-print-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    border: 1px solid #CCCCCC;
    padding: 8px 12px;
    font-size: 12px;
    text-align: left;
  }

  th {
    background: #F4F4F4;
    font-weight: bold;
  }
}

.kn-print-details {
  border-top: 1px solid #DDDDDD;
  padding-top: 12px;
  margin-bottom: 30px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kn-print-signatures {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 40px;
  border-top: 1px dashed #AAAAAA;
  padding-top: 16px;
}

/* ==============================================================================
   RESPONSIVE MEDIA QUERIES (iPad & Tablet: <=1024px, Mobile: <=768px)
   ============================================================================== */

@media (max-width: 1024px) {
  .kn-page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .kn-filter-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .kn-search-input {
    width: 100%;
  }

  .kn-status-tabs {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }

  .kn-status-tab {
    flex-shrink: 0;
  }

  .kn-table-card {
    padding: 16px;
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .kn-page-title {
    font-size: 20px;
  }

  .kn-page-subtitle {
    font-size: 11px;
  }

  .kn-gold-button {
    width: 100%;
    justify-content: center;
  }

  .kn-filters-card {
    padding: 14px;
  }

  .kn-filter-row {
    flex-direction: column;
    gap: 10px;

    .el-select {
      width: 100%;
    }
  }

  .kn-print-sheet {
    padding: 14px;
    overflow-x: auto;
  }

  .kn-print-section-row {
    flex-direction: column;
    gap: 6px;
  }

  .kn-balance-summary-box {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
