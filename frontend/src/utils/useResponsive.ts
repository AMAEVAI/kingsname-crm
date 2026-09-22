import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useResponsive() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  const isMobile = computed(() => windowWidth.value < 768);
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value <= 1024);
  const isDesktop = computed(() => windowWidth.value > 1024);

  const drawerSize = computed(() => {
    if (windowWidth.value < 768) return '100%';
    if (windowWidth.value <= 1024) return '80%';
    return '680px';
  });

  const modalWidth = computed(() => {
    if (windowWidth.value < 600) return '95%';
    if (windowWidth.value < 900) return '80%';
    return '540px';
  });

  const printModalWidth = computed(() => {
    if (windowWidth.value < 768) return '96%';
    return '720px';
  });

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    drawerSize,
    modalWidth,
    printModalWidth,
  };
}
