<template>
  <div class="kn-inventory-page">
    <!-- Header -->
    <div class="kn-page-header">
      <div>
        <h1 class="kn-page-title font-brand">Склад Готовых Костюмов и Премиальных Тканей</h1>
        <p class="kn-page-subtitle">
          Учет размерной сетки RTW (46–60+), рулонов итальянской шерсти и контроль критических остатков
        </p>
      </div>

      <button class="kn-gold-button font-brand" @click="openCreateModal">
        <span>+ Добавить Товар / Ткань</span>
      </button>
    </div>

    <!-- Inventory KPIs -->
    <div class="kn-inv-kpis">
      <div class="kn-card kn-inv-kpi">
        <span class="kn-kpi-lbl">Костюмов RTW на складе:</span>
        <strong class="kn-kpi-num font-outfit">{{ totalSuitsCount }} шт</strong>
      </div>
      <div class="kn-card kn-inv-kpi">
        <span class="kn-kpi-lbl">Тканей в наличии:</span>
        <strong class="kn-kpi-num font-outfit">{{ totalFabricsMeters }} метров</strong>
      </div>
      <div class="kn-card kn-inv-kpi alert">
        <span class="kn-kpi-lbl">Критические остатки:</span>
        <strong class="kn-kpi-num font-outfit text-danger">{{ lowStockCount }} позиций ⚠️</strong>
      </div>
    </div>

    <!-- Filters & Type Selector -->
    <div class="kn-card kn-filter-card">
      <div class="kn-filter-row">
        <!-- Tab selector -->
        <div class="kn-type-tabs">
          <button
            class="kn-type-tab"
            :class="{ active: activeType === 'ALL' }"
            @click="activeType = 'ALL'"
          >
            Все позиции
          </button>
          <button
            class="kn-type-tab"
            :class="{ active: activeType === 'SUIT' }"
            @click="activeType = 'SUIT'"
          >
            👔 Классические Костюмы
          </button>
          <button
            class="kn-type-tab"
            :class="{ active: activeType === 'FABRIC' }"
            @click="activeType = 'FABRIC'"
          >
            🧵 Рулоны Тканей
          </button>
          <button
            class="kn-type-tab"
            :class="{ active: activeType === 'SHIRT' }"
            @click="activeType = 'SHIRT'"
          >
            👔 Сорочки и Рубашки
          </button>
          <button
            class="kn-type-tab"
            :class="{ active: activeType === 'ACCESSORY' }"
            @click="activeType = 'ACCESSORY'"
          >
            🎩 Аксессуары
          </button>
        </div>

        <!-- Search -->
        <div class="kn-search-wrap">
          <el-input v-model="searchQuery" placeholder="Поиск по SKU, названию, цвету..." clearable />
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="kn-card kn-table-card">
      <el-table :data="filteredInventory" style="width: 100%" v-loading="loading">
        <el-table-column prop="sku" label="Артикул / SKU" width="160">
          <template #default="{ row }">
            <span class="kn-sku-code font-outfit">{{ row.sku }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="Наименование изделия" min-width="220">
          <template #default="{ row }">
            <div class="kn-prod-title">
              <strong>{{ row.name }}</strong>
              <span class="kn-color-sub">{{ row.color }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="size" label="Размер / Ростовка" width="160">
          <template #default="{ row }">
            <div v-if="row.size" class="kn-size-pill font-outfit">
              <span>Р-р <strong>{{ row.size }}</strong></span>
              <span class="kn-height-sub">{{ row.heightCategory }}</span>
            </div>
            <span v-else class="kn-fabric-unit">В рулонах</span>
          </template>
        </el-table-column>

        <el-table-column prop="stockQuantity" label="Остаток на складе" width="180">
          <template #default="{ row }">
            <div class="kn-stock-cell">
              <span class="kn-stock-val font-outfit" :class="{ 'low-stock': row.stockQuantity <= row.minThreshold }">
                {{ row.stockQuantity }} {{ row.unit }}
              </span>
              <el-tag
                v-if="row.stockQuantity <= row.minThreshold"
                type="danger"
                size="small"
                effect="dark"
                class="kn-alert-tag"
              >
                ⚠️ Заканчивается!
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="price" label="Розничная цена" width="160" align="right">
          <template #default="{ row }">
            <strong class="kn-price font-outfit">{{ formatMoney(row.price) }} ₽</strong>
          </template>
        </el-table-column>

        <el-table-column label="Управление остатком" width="160" align="center">
          <template #default="{ row }">
            <div class="kn-counter-btns">
              <button class="kn-counter-btn" @click="changeStock(row.id, -1)">-</button>
              <button class="kn-counter-btn plus" @click="changeStock(row.id, 1)">+</button>
              <button class="kn-del-btn" @click="deleteItem(row.id)" title="Удалить">🗑️</button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Create / Edit Modal -->
    <el-dialog v-model="modalVisible" :title="isEdit ? 'Редактировать товар' : 'Добавить товар на склад'" width="520px">
      <el-form :model="form" label-position="top">
        <el-form-item label="Тип позиции">
          <el-select v-model="form.itemType" style="width: 100%">
            <el-option label="Костюм классический (SUIT)" value="SUIT" />
            <el-option label="Рулон ткани (FABRIC)" value="FABRIC" />
            <el-option label="Сорочка ручной работы (SHIRT)" value="SHIRT" />
            <el-option label="Аксессуар (ACCESSORY)" value="ACCESSORY" />
          </el-select>
        </el-form-item>

        <el-form-item label="Артикул / SKU">
          <el-input v-model="form.sku" placeholder="Например: KN-SUIT-BLK-52" />
        </el-form-item>

        <el-form-item label="Наименование">
          <el-input v-model="form.name" placeholder="Название изделия или ткани" />
        </el-form-item>

        <el-row :gutter="16" v-if="form.itemType !== 'FABRIC'">
          <el-col :span="12">
            <el-form-item label="Размер (сетка 46-62)">
              <el-select v-model="form.size" style="width: 100%">
                <el-option v-for="s in ['46', '48', '50', '52', '54', '56', '58', '60', '62']" :key="s" :label="s" :value="s" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ростовка">
              <el-select v-model="form.heightCategory" style="width: 100%">
                <el-option label="170-176" value="170-176" />
                <el-option label="176-182" value="176-182" />
                <el-option label="182-188" value="182-188" />
                <el-option label="188+" value="188+" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Цвет">
              <el-input v-model="form.color" placeholder="Цвет" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Единица измерения">
              <el-select v-model="form.unit" style="width: 100%">
                <el-option label="шт (штука)" value="шт" />
                <el-option label="метр (погонный)" value="метр" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Количество на складе">
              <el-input-number v-model="form.stockQuantity" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Порог предупреждения">
              <el-input-number v-model="form.minThreshold" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Розничная цена (₽)">
          <el-input-number v-model="form.price" :min="0" :step="1000" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">Отмена</el-button>
        <el-button type="primary" @click="saveItem">Сохранить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api } from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(false);
const inventory = ref<any[]>([]);
const searchQuery = ref('');
const activeType = ref('ALL');

const modalVisible = ref(false);
const isEdit = ref(false);
const form = ref<any>({});

onMounted(async () => {
  await loadInventory();
});

const loadInventory = async () => {
  loading.value = true;
  try {
    const res = await api.getInventory();
    inventory.value = res.list || [];
  } finally {
    loading.value = false;
  }
};

const filteredInventory = computed(() => {
  let list = inventory.value;
  if (activeType.value !== 'ALL') {
    list = list.filter((i) => i.itemType === activeType.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (i) =>
        i.name?.toLowerCase().includes(q) ||
        i.sku?.toLowerCase().includes(q) ||
        i.color?.toLowerCase().includes(q)
    );
  }
  return list;
});

const totalSuitsCount = computed(() => {
  return inventory.value
    .filter((i) => i.itemType === 'SUIT')
    .reduce((acc, i) => acc + (i.stockQuantity || 0), 0);
});

const totalFabricsMeters = computed(() => {
  return inventory.value
    .filter((i) => i.itemType === 'FABRIC')
    .reduce((acc, i) => acc + (i.stockQuantity || 0), 0);
});

const lowStockCount = computed(() => {
  return inventory.value.filter((i) => i.stockQuantity <= i.minThreshold).length;
});

const changeStock = async (id: number, delta: number) => {
  await api.updateStock(id, delta);
  await loadInventory();
};

const deleteItem = (id: number) => {
  ElMessageBox.confirm('Удалить позицию со склада?', 'Подтверждение', {
    confirmButtonText: 'Удалить',
    cancelButtonText: 'Отмена',
    type: 'warning',
  }).then(async () => {
    await api.deleteInventory(id);
    ElMessage.success('Позиция удалена');
    await loadInventory();
  });
};

const openCreateModal = () => {
  isEdit.value = false;
  form.value = {
    itemType: 'SUIT',
    sku: '',
    name: '',
    size: '50',
    heightCategory: '176-182',
    color: 'Черный',
    unit: 'шт',
    stockQuantity: 2,
    minThreshold: 2,
    price: 85000,
  };
  modalVisible.value = true;
};

const saveItem = async () => {
  if (!form.value.name || !form.value.sku) {
    ElMessage.warning('Заполните артикул и наименование');
    return;
  }
  await api.saveInventoryItem(form.value);
  modalVisible.value = false;
  ElMessage.success('Позиция успешно сохранена на складе');
  await loadInventory();
};

const formatMoney = (val: number) => {
  if (!val) return '0';
  return new Intl.NumberFormat('ru-RU').format(Math.round(val));
};
</script>

<style scoped lang="scss">
.kn-inventory-page {
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

/* KPIs */
.kn-inv-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.kn-inv-kpi {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.alert {
    border-color: rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.06);
  }
}

.kn-kpi-lbl {
  font-size: 13px;
  color: var(--kn-text-muted);
}

.kn-kpi-num {
  font-size: 22px;
  color: #FFFFFF;

  &.text-danger {
    color: #F87171;
  }
}

/* Filters */
.kn-filter-card {
  padding: 16px 20px;
}

.kn-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.kn-type-tabs {
  display: flex;
  gap: 8px;
}

.kn-type-tab {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(197, 160, 89, 0.15);
  color: #C0C1CC;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
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

.kn-search-wrap {
  width: 300px;
}

/* Table */
.kn-table-card {
  padding: 20px;
}

.kn-sku-code {
  color: var(--kn-gold-light);
  font-weight: 700;
  font-size: 12px;
}

.kn-prod-title {
  display: flex;
  flex-direction: column;
}

.kn-color-sub {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-size-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.kn-height-sub {
  font-size: 10px;
  color: var(--kn-text-muted);
}

.kn-fabric-unit {
  font-size: 11px;
  color: var(--kn-gold-light);
}

.kn-stock-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kn-stock-val {
  font-weight: 700;
  font-size: 13px;

  &.low-stock {
    color: #F87171;
  }
}

.kn-alert-tag {
  font-size: 10px;
}

.kn-price {
  color: #FFFFFF;
}

.kn-counter-btns {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

.kn-counter-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(197, 160, 89, 0.2);
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background: var(--kn-gold-gradient);
    color: #0A0B0E;
  }
}

.kn-del-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: 6px;
  font-size: 13px;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}
</style>
