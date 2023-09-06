<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui';

const meta = document.createElement('meta');
meta.name = 'naive-ui-style';
document.head.appendChild(meta);
// useHead({
//   meta: [{ name: 'naive-ui-style' }],
// });

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ff8f6b',
    primaryColorHover: '#ff8f6b',
    primaryColorPressed: '#ff8f6b',
  },
  Input: {},
  Button: {},
};
</script>
<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <n-config-provider :theme-overrides="themeOverrides">
      <NuxtLayout name="pc" class="select-none whitespace-nowrap">
        <NuxtPage class="" />
      </NuxtLayout>
    </n-config-provider>
  </div>
</template>
<style lang="scss">
html {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 16px;
}
body {
  margin: 0;
  padding: 0;
}
</style>
