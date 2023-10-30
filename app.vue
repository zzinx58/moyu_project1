<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from "naive-ui";
// import { worker } from './mocks/browser';
// worker.start();

const vue3App = (useNuxtApp().vueApp.config.warnHandler = () => null);

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#ff8f6b",
    primaryColorHover: "#ff8f6b",
    primaryColorPressed: "#ff8f6b",
  },
  Input: {},
  Button: {},
  InternalSelection: {
    borderRadius: "10px",
    // arrowColor: 'white',
    // placeholderColor: 'white',
    // textColor: 'white',
  },
  InternalSelectMenu: {
    color: "#8989A2",
    optionColorActive: "#E7E7EC",
    optionTextColorActive: "#292968",
    optionTextColor: "white",
    optionColorPending: "#ff8f6b",
    optionTextColorPressed: "white",
  },
  Collapse: {
    titlePadding: "0 0 0 0",
    itemMargin: "0 0 44px 0",
  },
  CollapseTransition: {},
  Select: {},
  DataTable: {
    // thColor: '#70708C',
    // thFontWeight: '800',
    thTextColor: "white",
    tdColor: "#F7F8FE",
    tdColorStriped: "#EDF1FE",
    // borderRadius: '10px',
    tdColorHover: "none",
  },
  Pagination: {
    // buttonColor: '#ff8f6b',
    // buttonColorHover: '#ff8f6b',
    itemColorActive: "#ff8f6b",
    itemTextColor: "#ff8f6b",
    itemColorActiveHover: "#ff8f6b",
    itemTextColorActive: "white",
    itemBorder: "none",
    itemBorderHover: "none",
    itemBorderActive: "none",
  },
};
</script>
<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <n-config-provider :theme-overrides="themeOverrides">
      <n-message-provider>
        <n-dialog-provider>
          <!-- <NuxtLayout name="pc" class="select-none whitespace-nowrap"> -->
          <NuxtLayout class="select-none whitespace-nowrap">
            <NuxtPage class="" />
          </NuxtLayout>
        </n-dialog-provider>
      </n-message-provider>
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
