<template>
  <el-config-provider :locale="ru">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import ru from 'element-plus/es/locale/lang/ru';
</script>

<style>
/* Global Reset and root styles handled by theme.scss */
</style>
