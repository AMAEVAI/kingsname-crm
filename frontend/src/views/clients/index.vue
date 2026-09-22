<template>
  <div class="kn-clients-page">
    <!-- Header -->
    <div class="kn-page-header">
      <div>
        <h1 class="kn-page-title font-brand">База VIP-Клиентов KINGSNAME</h1>
        <p class="kn-page-subtitle">
          Грозный, регионы СКФО и VIP-заказчики • История покупок, мерки и аккаунты Instagram
        </p>
      </div>

      <button class="kn-gold-button font-brand" @click="openCreateClientModal">
        <span>+ Добавить VIP-Клиента</span>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="kn-card kn-filter-card">
      <div class="kn-filter-row">
        <div class="kn-search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Поиск по ФИО, телефону, Instagram..."
            clearable
            @input="loadClients"
          >
            <template #prefix>
              <Search :size="15" :stroke-width="1.8" class="kn-search-icon" />
            </template>
          </el-input>
        </div>

        <el-select v-model="filterCity" placeholder="Фильтр по городу" clearable @change="loadClients">
          <el-option label="Все города" value="" />
          <el-option label="Грозный" value="Грозный" />
          <el-option label="Махачкала" value="Махачкала" />
          <el-option label="Москва" value="Москва" />
          <el-option label="Дубай" value="Дубай" />
        </el-select>

        <el-select v-model="filterVip" placeholder="VIP Уровень" clearable @change="loadClients">
          <el-option label="Все уровни" value="" />
          <el-option label="Bespoke Club Elite (Уровень 3)" :value="3" />
          <el-option label="Gold VIP (Уровень 2)" :value="2" />
          <el-option label="Classic VIP (Уровень 1)" :value="1" />
        </el-select>
      </div>
    </div>

    <!-- Client Cards Grid -->
    <div class="kn-clients-grid">
      <div v-for="client in filteredClients" :key="client.id" class="kn-card kn-client-card">
        <!-- Top Row -->
        <div class="kn-card-top">
          <div class="kn-vip-emblem" :class="'level-' + client.vipLevel">
            <Crown v-if="client.vipLevel === 3" :size="20" :stroke-width="2" />
            <Sparkles v-else-if="client.vipLevel === 2" :size="20" :stroke-width="2" />
            <UserCheck v-else :size="20" :stroke-width="2" />
          </div>
          <div class="kn-card-titles">
            <h3 class="kn-client-name">{{ client.name }}</h3>
            <span class="kn-client-city font-outfit">
              <MapPin :size="12" :stroke-width="1.8" />
              <span>{{ client.city }}</span>
            </span>
          </div>
          <el-tag :type="getVipTagType(client.vipLevel)" effect="dark" class="kn-vip-tag">
            {{ getVipTitle(client.vipLevel) }}
          </el-tag>
        </div>

        <!-- Details -->
        <div class="kn-card-body">
          <div class="kn-info-line">
            <span class="kn-info-label">Телефон:</span>
            <strong class="kn-info-val">{{ client.phone }}</strong>
          </div>

          <div class="kn-info-line" v-if="client.instagram">
            <span class="kn-info-label">Instagram:</span>
            <a
              :href="'https://instagram.com/' + client.instagram.replace('@', '')"
              target="_blank"
              class="kn-insta-link font-outfit"
            >
              <Instagram :size="13" :stroke-width="1.8" />
              <span>{{ client.instagram }}</span>
            </a>
          </div>

          <div class="kn-info-line">
            <span class="kn-info-label">Сумма покупок:</span>
            <strong class="kn-spent-val font-outfit">{{ formatMoney(client.totalSpent) }} ₽</strong>
          </div>

          <div class="kn-notes-box" v-if="client.notes">
            <p>{{ client.notes }}</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="kn-card-footer">
          <button class="kn-action-btn-small" @click="createOrderForClient(client)">
            <Scissors :size="13" :stroke-width="1.8" />
            <span>Оформить пошив</span>
          </button>
          <div class="kn-footer-icons">
            <button class="kn-icon-btn" title="Редактировать" @click="openEditClient(client)">
              <Pencil :size="14" :stroke-width="1.8" />
            </button>
            <button class="kn-icon-btn del" title="Удалить" @click="deleteClient(client.id)">
              <Trash2 :size="14" :stroke-width="1.8" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Modal -->
    <el-dialog v-model="clientModalVisible" :title="isEdit ? 'Редактировать VIP-Клиента' : 'Новый VIP-Клиент KINGSNAME'" :width="modalWidth">
      <el-form :model="clientForm" label-position="top">
        <el-form-item label="ФИО Клиента">
          <el-input v-model="clientForm.name" placeholder="Например: Абубакар Кадыров" />
        </el-form-item>
        <el-form-item label="Номер телефона">
          <el-input v-model="clientForm.phone" placeholder="+7 (928) 000-00-00" />
        </el-form-item>
        <el-form-item label="Город проживания">
          <el-select v-model="clientForm.city" style="width: 100%">
            <el-option label="Грозный" value="Грозный" />
            <el-option label="Махачкала" value="Махачкала" />
            <el-option label="Москва" value="Москва" />
            <el-option label="Дубай" value="Дубай" />
            <el-option label="Санкт-Петербург" value="Санкт-Петербург" />
          </el-select>
        </el-form-item>
        <el-form-item label="Instagram аккаунт">
          <el-input v-model="clientForm.instagram" placeholder="@username" />
        </el-form-item>
        <el-form-item label="VIP Статус">
          <el-select v-model="clientForm.vipLevel" style="width: 100%">
            <el-option label="Classic VIP (Уровень 1)" :value="1" />
            <el-option label="Gold VIP (Уровень 2)" :value="2" />
            <el-option label="Bespoke Club Elite (Уровень 3)" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="Предпочтения и особенности посадки">
          <el-input v-model="clientForm.notes" type="textarea" rows="3" placeholder="Любимые ткани, силуэт, инициалы..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="clientModalVisible = false">Отмена</el-button>
        <el-button type="primary" @click="saveClient">Сохранить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/utils/request';
import { useResponsive } from '@/utils/useResponsive';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Search,
  Crown,
  Sparkles,
  UserCheck,
  MapPin,
  Instagram,
  Scissors,
  Pencil,
  Trash2
} from 'lucide-vue-next';

const router = useRouter();
const { modalWidth, isMobile } = useResponsive();

const clients = ref<any[]>([]);
const searchQuery = ref('');
const filterCity = ref('');
const filterVip = ref<number | ''>('');

const clientModalVisible = ref(false);
const isEdit = ref(false);
const clientForm = ref<any>({});

onMounted(async () => {
  await loadClients();
});

const loadClients = async () => {
  const res = await api.getClients(searchQuery.value);
  clients.value = res.list || [];
};

const filteredClients = computed(() => {
  let list = clients.value;
  if (filterCity.value) {
    list = list.filter((c) => c.city === filterCity.value);
  }
  if (filterVip.value) {
    list = list.filter((c) => c.vipLevel === filterVip.value);
  }
  return list;
});

const getVipTitle = (level: number) => {
  switch (level) {
    case 3: return 'Bespoke Elite';
    case 2: return 'Gold VIP';
    case 1:
    default: return 'Classic VIP';
  }
};

const getVipTagType = (level: number) => {
  switch (level) {
    case 3: return 'warning';
    case 2: return 'warning';
    case 1:
    default: return 'info';
  }
};

const formatMoney = (val: number) => {
  if (!val) return '0';
  return new Intl.NumberFormat('ru-RU').format(Math.round(val));
};

const openCreateClientModal = () => {
  isEdit.value = false;
  clientForm.value = {
    name: '',
    phone: '',
    city: 'Грозный',
    instagram: '',
    vipLevel: 1,
    totalSpent: 0,
    notes: '',
  };
  clientModalVisible.value = true;
};

const openEditClient = (client: any) => {
  isEdit.value = true;
  clientForm.value = { ...client };
  clientModalVisible.value = true;
};

const saveClient = async () => {
  if (!clientForm.value.name || !clientForm.value.phone) {
    ElMessage.warning('Заполните обязательные поля: ФИО и Телефон');
    return;
  }
  await api.saveClient(clientForm.value);
  clientModalVisible.value = false;
  ElMessage.success(isEdit.value ? 'Данные клиента обновлены' : 'Клиент успешно добавлен в базу KINGSNAME!');
  await loadClients();
};

const deleteClient = (id: number) => {
  ElMessageBox.confirm('Удалить данного клиента из базы?', 'Подтверждение', {
    confirmButtonText: 'Удалить',
    cancelButtonText: 'Отмена',
    type: 'warning',
  }).then(async () => {
    await api.deleteClient(id);
    ElMessage.success('Клиент удален');
    await loadClients();
  });
};

const createOrderForClient = (client: any) => {
  router.push({
    path: '/orders',
    query: {
      clientName: client.name,
      clientPhone: client.phone,
      clientCity: client.city,
      clientInstagram: client.instagram,
    },
  });
};
</script>

<style scoped lang="scss">
.kn-clients-page {
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

.kn-filter-card {
  padding: 20px;
}

.kn-filter-row {
  display: flex;
  gap: 16px;
}

.kn-search-box {
  flex: 1;
}

/* Clients Grid */
.kn-clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.kn-client-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.kn-card-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.kn-vip-emblem {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(197, 160, 89, 0.2);

  &.level-3 {
    background: rgba(197, 160, 89, 0.18);
    border-color: var(--kn-gold-primary);
    box-shadow: 0 0 12px var(--kn-gold-glow);
  }
  &.level-2 {
    border-color: rgba(197, 160, 89, 0.4);
  }
}

.kn-card-titles {
  flex: 1;
}

.kn-client-name {
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
}

.kn-client-city {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-vip-tag {
  font-size: 10px;
  text-transform: uppercase;
}

.kn-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.kn-info-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.kn-info-label {
  color: var(--kn-text-muted);
}

.kn-info-val {
  color: #FFFFFF;
}

.kn-insta-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #FF7096;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
}

.kn-spent-val {
  color: var(--kn-gold-light);
  font-size: 14px;
}

.kn-notes-box {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 10px;
  border-radius: 6px;
  font-size: 11px;
  color: #B2B4C0;
  line-height: 1.4;
}

.kn-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(197, 160, 89, 0.1);
  padding-top: 14px;
}

.kn-action-btn-small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(197, 160, 89, 0.1);
  border: 1px solid var(--kn-gold-border);
  color: var(--kn-gold-light);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--kn-gold-gradient);
    color: #0A0B0E;
  }
}

.kn-footer-icons {
  display: flex;
  gap: 6px;
}

.kn-icon-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--kn-gold-primary);
  transition: all 0.2s;

  &:hover {
    background: rgba(197, 160, 89, 0.2);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
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

/* ==============================================================================
   RESPONSIVE MEDIA QUERIES (iPad & Tablet: <=1024px, Mobile: <=640px)
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

  .kn-search-box {
    width: 100%;
  }

  .kn-clients-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
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

  .kn-filter-row {
    flex-direction: column;

    .el-select {
      width: 100%;
    }
  }

  .kn-clients-grid {
    grid-template-columns: 1fr;
  }

  .kn-card-footer {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .kn-action-btn-small {
    justify-content: center;
  }

  .kn-footer-icons {
    justify-content: flex-end;
  }
}
</style>
