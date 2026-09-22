<template>
  <div class="kn-login-page">
    <!-- Ambient Gold Glows -->
    <div class="kn-glow-blob top-left"></div>
    <div class="kn-glow-blob bottom-right"></div>

    <div class="kn-login-card">
      <!-- Luxury Emblem & Branding -->
      <div class="kn-login-header">
        <div class="kn-login-emblem">
          <svg viewBox="0 0 24 24" class="kn-crown-svg">
            <path fill="url(#loginGold)" d="M2 19h20v2H2zM2 5l5 3.5L12 2l5 6.5L22 5v12H2z"/>
            <defs>
              <linearGradient id="loginGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E5CA8F"/>
                <stop offset="50%" stop-color="#C5A059"/>
                <stop offset="100%" stop-color="#917234"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="kn-brand-heading font-brand">KINGSNAME</h1>
        <p class="kn-brand-caption font-outfit">HAUTE SARTORIAL & BESPOKE TAILORING</p>
        <div class="kn-badge-gateway">
          <ShieldCheck :size="15" :stroke-width="1.8" class="kn-shield-icon" />
          <span>Защищенный цифровой терминал доступа</span>
        </div>
      </div>

      <!-- Lockout Overlay (Triggered after 3 failed attempts) -->
      <div v-if="isLocked" class="kn-lockout-container">
        <div class="kn-lockout-icon">
          <Lock :size="44" :stroke-width="1.6" />
        </div>
        <h3 class="kn-lockout-title">Терминал временно заблокирован</h3>
        <p class="kn-lockout-desc">
          Превышено допустимое число неудачных попыток ввода кода (3/3).
          Из соображений безопасности доступ приостановлен.
        </p>
        <div class="kn-lockout-timer">
          <span>Разблокировка через: </span>
          <strong class="kn-timer-digits">{{ formatTimer(lockoutSeconds) }}</strong>
        </div>
        <button class="kn-retry-btn" @click="resetLockoutForDemo">Сбросить для демонстрации</button>
      </div>

      <!-- 8-Digit PIN Input Area -->
      <div v-else class="kn-pin-section" :class="{ 'kn-shake': shakeError }">
        <p class="kn-pin-instructions">
          Введите персональный <strong>8-значный цифровой код</strong>, выданный Администратором:
        </p>

        <!-- 8 Split Input Cells -->
        <div class="kn-digits-row" @paste="handlePaste">
          <input
            v-for="(digit, idx) in 8"
            :key="idx"
            :ref="(el) => (inputRefs[idx] = el as HTMLInputElement)"
            type="password"
            inputmode="numeric"
            maxlength="1"
            class="kn-digit-box"
            :class="{ filled: digits[idx] !== '' }"
            :value="digits[idx]"
            @input="(e) => handleInput(e, idx)"
            @keydown="(e) => handleKeyDown(e, idx)"
            @focus="focusedIndex = idx"
          />
        </div>

        <!-- Security Error Message -->
        <transition name="el-fade-in">
          <div v-if="errorMessage" class="kn-security-error">
            <AlertTriangle :size="15" :stroke-width="1.8" class="kn-err-icon" />
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- Submit Button -->
        <button
          class="kn-submit-code-btn"
          :disabled="isSubmitting || fullCode.length !== 8"
          @click="submitLogin"
        >
          <span v-if="isSubmitting" class="kn-spinner"></span>
          <span v-else class="kn-btn-inner">
            <span>Войти в CRM KINGSNAME</span>
            <ArrowRight :size="16" :stroke-width="2" class="kn-btn-arrow" />
          </span>
        </button>

        <!-- Virtual Numeric Keypad -->
        <div class="kn-keypad">
          <button v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="num" class="kn-key" @click="pressKey(String(num))">
            {{ num }}
          </button>
          <button class="kn-key clear" @click="clearAll" title="Очистить">C</button>
          <button class="kn-key" @click="pressKey('0')">0</button>
          <button class="kn-key backspace" @click="backspace" title="Удалить">
            <Delete :size="18" :stroke-width="1.8" />
          </button>
        </div>

        <!-- Quick Demo Presets -->
        <div class="kn-quick-presets">
          <span class="kn-presets-label">Быстрый доступ (демо-коды):</span>
          <div class="kn-preset-tags">
            <button class="kn-preset-pill master" @click="fillPreset('88888888')">
              <Crown :size="13" :stroke-width="2" class="kn-preset-icon" />
              <span>88888888 (ADMIN KINGSNAME)</span>
            </button>
            <button class="kn-preset-pill" @click="fillPreset('12345678')">
              <UserCheck :size="13" :stroke-width="2" class="kn-preset-icon" />
              <span>12345678 (Консультант)</span>
            </button>
            <button class="kn-preset-pill" @click="fillPreset('55555555')">
              <Scissors :size="13" :stroke-width="2" class="kn-preset-icon" />
              <span>55555555 (Мастер-портной)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="kn-login-footer">
        <span>KINGSNAME Bespoke CRM • г. Грозный • Версия 1.0</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { checkRateLimit } from '@/utils/security';
import { ElMessage } from 'element-plus';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  Delete,
  Crown,
  UserCheck,
  Scissors,
  ArrowRight
} from 'lucide-vue-next';

const router = useRouter();
const userStore = useUserStore();

// ─── iPhone-style tap sound via Web Audio API ───────────────────────────────
let _audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return _audioCtx;
};

const playTap = (type: 'key' | 'delete' | 'error' = 'key') => {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    if (type === 'key') {
      // Short noise click — classic iPhone keyboard tick
      const bufferSize = ctx.sampleRate * 0.04; // 40ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.08));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3200;
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);

    } else if (type === 'delete') {
      // Slightly lower pitched for backspace
      const bufferSize = ctx.sampleRate * 0.035;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);

    } else if (type === 'error') {
      // Short double-buzz for wrong code
      [0, 0.08].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 180;
        gain.gain.setValueAtTime(0.18, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.06);
      });
    }
  } catch (_) { /* silent fail if audio not supported */ }
};
// ────────────────────────────────────────────────────────────────────────────

const digits = ref<string[]>(['', '', '', '', '', '', '', '']);
const inputRefs = ref<HTMLInputElement[]>([]);
const focusedIndex = ref(0);
const isSubmitting = ref(false);
const errorMessage = ref('');
const shakeError = ref(false);

// Lockout state
const isLocked = ref(false);
const lockoutSeconds = ref(900); // 15 mins
let lockInterval: any = null;

const fullCode = computed(() => digits.value.join(''));

onMounted(() => {
  nextTick(() => {
    inputRefs.value[0]?.focus();
  });
});

const handleInput = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement;
  const val = target.value.replace(/\D/g, '');

  if (val) {
    digits.value[index] = val.slice(-1);
    if (index < 7) {
      inputRefs.value[index + 1]?.focus();
    } else {
      // 8th digit filled, auto submit
      submitLogin();
    }
  } else {
    digits.value[index] = '';
  }
};

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      digits.value[index - 1] = '';
      inputRefs.value[index - 1]?.focus();
    } else {
      digits.value[index] = '';
    }
  } else if (e.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  } else if (e.key === 'ArrowRight' && index < 7) {
    inputRefs.value[index + 1]?.focus();
  } else if (e.key === 'Enter' && fullCode.value.length === 8) {
    submitLogin();
  }
};

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasted = e.clipboardData?.getData('text') || '';
  const clean = pasted.replace(/\D/g, '').slice(0, 8);
  if (clean) {
    for (let i = 0; i < 8; i++) {
      digits.value[i] = clean[i] || '';
    }
    const targetIdx = Math.min(clean.length, 7);
    inputRefs.value[targetIdx]?.focus();

    if (clean.length === 8) {
      submitLogin();
    }
  }
};

const pressKey = (key: string) => {
  playTap('key');
  const emptyIndex = digits.value.findIndex((d) => d === '');
  if (emptyIndex !== -1) {
    digits.value[emptyIndex] = key;
    if (emptyIndex < 7) {
      inputRefs.value[emptyIndex + 1]?.focus();
    } else {
      submitLogin();
    }
  }
};

const backspace = () => {
  playTap('delete');
  for (let i = 7; i >= 0; i--) {
    if (digits.value[i] !== '') {
      digits.value[i] = '';
      inputRefs.value[i]?.focus();
      break;
    }
  }
};

const clearAll = () => {
  playTap('delete');
  digits.value = ['', '', '', '', '', '', '', ''];
  errorMessage.value = '';
  inputRefs.value[0]?.focus();
};

const fillPreset = (code: string) => {
  for (let i = 0; i < 8; i++) {
    digits.value[i] = code[i] || '';
  }
  submitLogin();
};

const submitLogin = async () => {
  if (fullCode.value.length !== 8 || isSubmitting.value) return;

  // Anti-Brute Force / Rate Limit Defense
  if (!checkRateLimit('login_pin_attempt', 5, 10000)) {
    errorMessage.value = 'Слишком частые попытки ввода. Подождите 10 секунд.';
    triggerShake();
    return;
  }

  // Strict numeric format enforcement
  if (!/^\d{8}$/.test(fullCode.value)) {
    errorMessage.value = 'Код безопасности должен состоять ровно из 8 цифр';
    triggerShake();
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const data = await userStore.login(fullCode.value);
    ElMessage.success({
      message: `Добро пожаловать в KINGSNAME CRM, ${data.userName}!`,
      duration: 3000,
    });
    router.push('/dashboard');
  } catch (err: any) {
    errorMessage.value = err.message || 'Ошибка безопасности при вводе кода';
    triggerShake();

    if (err.message && err.message.includes('Превышен лимит')) {
      triggerLockout();
    }
  } finally {
    isSubmitting.value = false;
  }
};

const triggerShake = () => {
  playTap('error');
  shakeError.value = true;
  setTimeout(() => {
    shakeError.value = false;
  }, 600);
};

const triggerLockout = () => {
  isLocked.value = true;
  lockoutSeconds.value = 900;
  if (lockInterval) clearInterval(lockInterval);

  lockInterval = setInterval(() => {
    if (lockoutSeconds.value > 0) {
      lockoutSeconds.value--;
    } else {
      clearInterval(lockInterval);
      isLocked.value = false;
    }
  }, 1000);
};

const resetLockoutForDemo = () => {
  if (lockInterval) clearInterval(lockInterval);
  isLocked.value = false;
  clearAll();
};

const formatTimer = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
</script>

<style scoped lang="scss">
.kn-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 30%, #15161E 0%, #090A0D 100%);
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* Atmospheric Gold Glows */
.kn-glow-blob {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, transparent 70%);
  pointer-events: none;

  &.top-left {
    top: -200px;
    left: -200px;
  }
  &.bottom-right {
    bottom: -200px;
    right: -200px;
  }
}

.kn-login-card {
  width: 100%;
  max-width: 540px;
  background: rgba(20, 21, 28, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(197, 160, 89, 0.25);
  border-radius: 20px;
  padding: 44px 36px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(197, 160, 89, 0.12);
  position: relative;
  z-index: 10;
  text-align: center;
}

.kn-login-emblem {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 14px;
  background: rgba(197, 160, 89, 0.12);
  border: 1px solid var(--kn-gold-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(197, 160, 89, 0.3);
}

.kn-crown-svg {
  width: 32px;
  height: 32px;
}

.kn-brand-heading {
  font-size: 26px;
  font-weight: 800;
  background: var(--kn-gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.kn-brand-caption {
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--kn-text-secondary);
  margin-bottom: 16px;
}

.kn-badge-gateway {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(197, 160, 89, 0.08);
  border: 1px solid rgba(197, 160, 89, 0.2);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  color: #DFBE7A;
  margin-bottom: 28px;
}

.kn-shield-icon {
  display: inline-flex;
  color: var(--kn-gold-primary);
}

.kn-pin-instructions {
  font-size: 13px;
  color: #C0C1CB;
  margin-bottom: 20px;

  strong {
    color: var(--kn-gold-light);
  }
}

/* Digits Grid */
.kn-digits-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.kn-digit-box {
  width: 44px;
  height: 54px;
  background: #111218;
  border: 1.5px solid rgba(197, 160, 89, 0.25);
  border-radius: 10px;
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    border-color: var(--kn-gold-primary);
    box-shadow: 0 0 16px rgba(197, 160, 89, 0.4);
    background: #171822;
    transform: scale(1.04);
  }

  &.filled {
    border-color: rgba(197, 160, 89, 0.6);
    background: #191B24;
  }
}

.kn-security-error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #F87171;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
}

.kn-submit-code-btn {
  width: 100%;
  padding: 14px;
  background: var(--kn-gold-gradient);
  border: none;
  border-radius: 10px;
  color: #0A0B0E;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 24px;

  &:hover:not(:disabled) {
    filter: brightness(1.15);
    box-shadow: 0 0 20px rgba(197, 160, 89, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

/* Keypad */
.kn-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 280px;
  margin: 0 auto 24px;
}

.kn-key {
  height: 48px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(197, 160, 89, 0.15);
  border-radius: 10px;
  color: #E2E3EB;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(197, 160, 89, 0.15);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.96);
  }

  &.clear {
    color: #EF4444;
    font-size: 14px;
  }

  &.backspace {
    color: var(--kn-gold-light);
  }
}

/* Quick Demo Presets */
.kn-quick-presets {
  border-top: 1px solid rgba(197, 160, 89, 0.12);
  padding-top: 18px;
  margin-top: 12px;
}

.kn-presets-label {
  display: block;
  font-size: 11px;
  color: var(--kn-text-muted);
  margin-bottom: 8px;
}

.kn-preset-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.kn-preset-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(197, 160, 89, 0.2);
  color: #C5A059;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(197, 160, 89, 0.15);
    border-color: var(--kn-gold-primary);
    color: #FFFFFF;
  }

  &.master {
    border-color: var(--kn-gold-primary);
    background: rgba(197, 160, 89, 0.12);
    font-weight: 600;
  }
}

/* Lockout Overlay */
.kn-lockout-container {
  padding: 30px 10px;
}

.kn-lockout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #EF4444;
  margin-bottom: 16px;
}

.kn-lockout-title {
  color: #EF4444;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.kn-lockout-desc {
  color: #B5B6C2;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.kn-lockout-timer {
  font-size: 14px;
  color: #FFFFFF;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.kn-timer-digits {
  color: #EF4444;
  font-size: 18px;
  font-family: monospace;
}

.kn-retry-btn {
  background: transparent;
  border: 1px solid var(--kn-gold-border);
  color: var(--kn-gold-light);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.kn-login-footer {
  margin-top: 24px;
  font-size: 11px;
  color: var(--kn-text-muted);
}

/* Responsive Styles for Mobile & iPad */
@media (max-width: 540px) {
  .kn-login-page {
    padding: 16px 12px;
  }

  .kn-login-card {
    padding: 28px 16px;
    border-radius: 16px;
  }

  .kn-brand-heading {
    font-size: 22px;
  }

  .kn-brand-caption {
    font-size: 10px;
    letter-spacing: 0.12em;
    margin-bottom: 14px;
  }

  .kn-badge-gateway {
    font-size: 11px;
    padding: 5px 10px;
    margin-bottom: 20px;
  }

  .kn-digits-row {
    gap: 4px;
    margin-bottom: 16px;
  }

  .kn-digit-box {
    width: 33px;
    height: 44px;
    font-size: 18px;
    border-radius: 7px;
  }

  .kn-keypad {
    max-width: 270px;
    gap: 8px;
    margin-bottom: 18px;
  }

  .kn-key {
    height: 46px;
    font-size: 17px;
  }

  .kn-preset-tags {
    flex-direction: column;
    gap: 6px;
  }

  .kn-preset-pill {
    width: 100%;
    justify-content: center;
    padding: 7px 10px;
  }
}
</style>
