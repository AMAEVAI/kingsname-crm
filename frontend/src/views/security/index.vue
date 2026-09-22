<template>
  <div class="kn-security-page">
    <!-- Header -->
    <div class="kn-page-header">
      <div>
        <h1 class="kn-page-title font-brand">Центр Безопасности & Генератор 8-Значных Кодов</h1>
        <p class="kn-page-subtitle">
          Административный шлюз доступа KINGSNAME • Выпуск цифровых PIN-кодов смен, мониторинг входов и защита от подбора
        </p>
      </div>

      <button class="kn-gold-button font-brand" @click="openGenerateModal">
        <span>+ Сгенерировать 8-Значный Код</span>
      </button>
    </div>

    <!-- Security Status Banners -->
    <div class="kn-security-grid">
      <div class="kn-card kn-sec-status-card">
        <div class="kn-sec-icon">
          <ShieldCheck :size="26" :stroke-width="1.8" />
        </div>
        <div>
          <h3 class="kn-sec-card-title">Контур защиты от перебора (Brute-Force)</h3>
          <p class="kn-sec-card-desc">
            Лимит: <strong>3 неверные попытки</strong> ввода. Автоматическая блокировка терминала на <strong>15 минут</strong> с логированием IP.
          </p>
        </div>
        <el-tag type="success" effect="dark" class="kn-status-tag">АКТИВЕН</el-tag>
      </div>

      <div class="kn-card kn-sec-status-card">
        <div class="kn-sec-icon master">
          <Crown :size="26" :stroke-width="1.8" />
        </div>
        <div>
          <h3 class="kn-sec-card-title">Мастер-код Администратора</h3>
          <p class="kn-sec-card-desc">
            Предустановленный код: <code class="kn-master-code">88888888</code> (Бессрочный доступ суперадминистратора).
          </p>
        </div>
        <button class="kn-copy-pill" @click="copyCode('88888888')">Скопировать</button>
      </div>
    </div>

    <!-- Active Codes Table -->
    <div class="kn-card kn-table-card">
      <div class="kn-table-header">
        <div>
          <h2 class="kn-section-title font-brand">Выданные 8-Значные Коды Доступа</h2>
          <p class="kn-section-sub">Управление правами сотрудников и ролями в CRM</p>
        </div>
        <button class="kn-refresh-btn" @click="loadData">
          <RefreshCw :size="13" :stroke-width="1.8" />
          <span>Обновить</span>
        </button>
      </div>

      <el-table :data="codes" style="width: 100%" v-loading="loading">
        <!-- 8-digit Code -->
        <el-table-column prop="code" label="8-Значный PIN-код" width="220">
          <template #default="{ row }">
            <div class="kn-code-cell font-outfit">
              <span class="kn-code-badge">{{ formatCode(row.code) }}</span>
              <button class="kn-code-copy-btn" title="Скопировать код" @click="copyCode(row.code)">
                <Copy :size="13" :stroke-width="1.8" />
              </button>
            </div>
          </template>
        </el-table-column>

        <!-- Employee Info -->
        <el-table-column prop="userName" label="Сотрудник / Назначение" min-width="220">
          <template #default="{ row }">
            <div class="kn-emp-cell">
              <strong>{{ row.userName }}</strong>
              <span class="kn-emp-id font-outfit">ID: #{{ row.userId }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Role -->
        <el-table-column prop="roleCode" label="Роль доступа" width="180">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.roleCode)" effect="dark">
              {{ getRoleTitle(row.roleCode) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Validity -->
        <el-table-column prop="validType" label="Срок действия" width="180">
          <template #default="{ row }">
            <div class="kn-validity-cell">
              <span class="kn-validity-text">{{ getValidTypeLabel(row.validType) }}</span>
              <span v-if="row.expireTime" class="kn-expire-time font-outfit">
                До: {{ row.expireTime }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- Status -->
        <el-table-column prop="status" label="Статус" width="130">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'" effect="dark">
              {{ row.status === 0 ? 'Активен' : 'Отозван' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Action -->
        <el-table-column label="Действие" width="140" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 0 && row.code !== '88888888'"
              type="danger"
              size="small"
              plain
              @click="revokeCode(row.id)"
            >
              Отозвать
            </el-button>
            <span v-else-if="row.code === '88888888'" class="kn-master-lock">
              <Lock :size="12" :stroke-width="1.8" />
              <span>Мастер</span>
            </span>
            <span v-else class="kn-revoked-text">Деактивирован</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Login Audit Trail Logs Table -->
    <div class="kn-card kn-table-card">
      <div class="kn-table-header">
        <div>
          <h2 class="kn-section-title font-brand">Журнал Аудита Авторизаций (sys_login_log)</h2>
          <p class="kn-section-sub">Фиксация всех попыток входа по 8-значному коду с IP-адресами и статусами</p>
        </div>
      </div>

      <el-table :data="logs" style="width: 100%">
        <el-table-column prop="loginTime" label="Время попытки" width="180" class-name="font-outfit" />
        <el-table-column prop="code" label="Введенный код" width="150">
          <template #default="{ row }">
            <span class="kn-log-code font-outfit">{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="Сотрудник" width="180" />
        <el-table-column prop="ip" label="IP Адрес" width="140" class-name="font-outfit" />
        <el-table-column prop="resultStatus" label="Результат" width="140">
          <template #default="{ row }">
            <el-tag :type="row.resultStatus === 1 ? 'success' : row.resultStatus === 2 ? 'danger' : 'warning'" effect="dark">
              {{ row.resultStatus === 1 ? 'Успешно' : row.resultStatus === 2 ? 'Заблокирован' : 'Ошибка' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resultMsg" label="Сообщение системы / Причина" />
      </el-table>
    </div>

    <!-- Generate Code Modal -->
    <el-dialog v-model="generateModalVisible" title="Выпуск нового 8-значного кода доступа" :width="modalWidth">
      <el-form :model="codeForm" label-position="top">
        <el-form-item label="ФИО сотрудника / Назначение">
          <el-input v-model="codeForm.userName" placeholder="Например: Мастер-портной Зелимхан" />
        </el-form-item>

        <el-form-item label="Роль и уровень доступа">
          <el-select v-model="codeForm.roleCode" style="width: 100%">
            <el-option label="Шеф-Администратор (Полный доступ)" value="admin" />
            <el-option label="Консультант салона (Заявки, клиенты, оплата)" value="consultant" />
            <el-option label="Мастер-портной (Мерки, пошив, готовность)" value="tailor" />
            <el-option label="Менеджер сайта и Instagram Direct" value="manager" />
          </el-select>
        </el-form-item>

        <el-form-item label="Срок действия кода">
          <el-select v-model="codeForm.validType" style="width: 100%">
            <el-option label="1 Смена (8–12 часов) — для сменного персонала" :value="1" />
            <el-option label="1 Сутки (24 часа) — для временных задач" :value="2" />
            <el-option label="Постоянный (бессрочный с возможностью ручного отзыва)" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="generateModalVisible = false">Отмена</el-button>
        <button class="kn-gold-button font-brand" @click="submitGenerateCode">
          Сгенерировать 8-значный код
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useResponsive } from '@/utils/useResponsive';
import {
  ShieldCheck,
  Crown,
  RefreshCw,
  Copy,
  Lock
} from 'lucide-vue-next';

const { modalWidth } = useResponsive();

const loading = ref(false);
const codes = ref<any[]>([]);
const logs = ref<any[]>([]);

const generateModalVisible = ref(false);
const codeForm = ref({
  userName: '',
  roleCode: 'consultant',
  validType: 1,
});

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const codesRes = await api.getAccessCodes();
    codes.value = codesRes.list || [];

    const logsRes = await api.getLoginLogs();
    logs.value = logsRes.list || [];
  } finally {
    loading.value = false;
  }
};

const formatCode = (code: string) => {
  if (!code) return '';
  return `${code.slice(0, 4)} ${code.slice(4)}`;
};

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  ElMessage.success(`Код ${code} скопирован в буфер обмена!`);
};

const getRoleTitle = (role: string) => {
  switch (role) {
    case 'admin': return 'Шеф-Администратор';
    case 'tailor': return 'Мастер-портной';
    case 'manager': return 'Менеджер Direct';
    case 'consultant':
    default: return 'Консультант салона';
  }
};

const getRoleTagType = (role: string) => {
  switch (role) {
    case 'admin': return 'warning';
    case 'tailor': return 'primary';
    case 'manager': return 'success';
    case 'consultant':
    default: return 'info';
  }
};

const getValidTypeLabel = (type: number) => {
  switch (type) {
    case 1: return '1 Смена (12ч)';
    case 2: return '1 День (24ч)';
    case 3:
    default: return 'Постоянный';
  }
};

const openGenerateModal = () => {
  codeForm.value = {
    userName: '',
    roleCode: 'consultant',
    validType: 1,
  };
  generateModalVisible.value = true;
};

const submitGenerateCode = async () => {
  if (!codeForm.value.userName) {
    ElMessage.warning('Укажите имя сотрудника');
    return;
  }
  const created = await api.generateAccessCode(
    codeForm.value.userName,
    codeForm.value.roleCode,
    codeForm.value.validType
  );

  generateModalVisible.value = false;
  ElMessageBox.alert(
    `Новый 8-значный код доступа: <strong>${created.code}</strong><br><br>Сотрудник: <strong>${created.userName}</strong><br>Роль: <strong>${getRoleTitle(created.roleCode)}</strong>`,
    'Код безопасности успешно создан',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: 'Скопировать и закрыть',
      callback: () => {
        copyCode(created.code);
      },
    }
  );
  await loadData();
};

const revokeCode = (id: number) => {
  ElMessageBox.confirm('Отозвать данный 8-значный код? Сотрудник потеряет доступ в CRM.', 'Подтверждение', {
    confirmButtonText: 'Отозвать доступ',
    cancelButtonText: 'Отмена',
    type: 'warning',
  }).then(async () => {
    await api.revokeAccessCode(id);
    ElMessage.success('Код доступа успешно отозван');
    await loadData();
  });
};
</script>

<style scoped lang="scss">
.kn-security-page {
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

/* Security Grid Banners */
.kn-security-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.kn-sec-status-card {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.kn-sec-icon {
  font-size: 32px;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  &.master {
    background: rgba(197, 160, 89, 0.15);
    border-color: var(--kn-gold-primary);
  }
}

.kn-sec-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.kn-sec-card-desc {
  font-size: 12px;
  color: var(--kn-text-secondary);
  line-height: 1.4;

  strong {
    color: var(--kn-gold-light);
  }
}

.kn-master-code {
  background: rgba(197, 160, 89, 0.15);
  color: var(--kn-gold-light);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.kn-copy-pill {
  margin-left: auto;
  background: rgba(197, 160, 89, 0.12);
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

/* Tables */
.kn-table-card {
  padding: 24px;
}

.kn-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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

.kn-refresh-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #C0C1CC;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    border-color: var(--kn-gold-primary);
    color: var(--kn-gold-light);
  }
}

.kn-code-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kn-code-badge {
  background: #111219;
  border: 1px solid rgba(197, 160, 89, 0.35);
  color: var(--kn-gold-light);
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: 14px;
}

.kn-code-copy-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(197, 160, 89, 0.15);
  border-radius: 4px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--kn-gold-primary);
  transition: all 0.2s;

  &:hover {
    background: rgba(197, 160, 89, 0.18);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
  }
}

.kn-master-lock {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--kn-gold-primary);
  font-weight: 600;
  font-size: 12px;
}

.kn-emp-cell {
  display: flex;
  flex-direction: column;
}

.kn-emp-id {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-validity-cell {
  display: flex;
  flex-direction: column;
}

.kn-validity-text {
  font-size: 12px;
  color: #FFFFFF;
}

.kn-expire-time {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-master-lock {
  font-size: 11px;
  color: var(--kn-gold-primary);
  font-weight: 600;
}

.kn-revoked-text {
  font-size: 11px;
  color: var(--kn-text-muted);
}

.kn-log-code {
  color: var(--kn-gold-light);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .kn-page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .kn-security-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .kn-sec-status-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .kn-copy-pill {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }

  .kn-status-tag {
    align-self: flex-start;
  }

  .kn-table-card {
    padding: 14px;
    overflow-x: auto;
  }

  .kn-table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .kn-gold-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
