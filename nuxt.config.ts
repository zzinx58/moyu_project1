// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      titleTemplate: "%s | MOYU",
    },
  },
  modules: [
    "@unocss/nuxt",
    "@nuxthq/ui",
    "@element-plus/nuxt",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
      },
    ],
    // "@nuxtjs/color-mode",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  piniaPersistedstate: {
    storage: "sessionStorage",
  },
  devServer: {
    https: {
      key: "keys/zzx-19231.key",
      cert: "keys/zzx-19231.cert",
    },
    port: 5050,
  },
  nitro: {
    devProxy: {
      "/api_cors": {
        target: "https://api.yicloud.vip/api",
        changeOrigin: true,
        // not know.
        // prependPath: true,
      },
    },
  },
  vite: {
    plugins: [
      Components({
        dts: true,
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
  colorMode: {
    preference: "class",
  },
});

// router: {
// },
// pinia: {
// },
// imports: {
//   autoImport: true,
// },

// colorMode: {
//   // preference: "dark",
//   preference: "light",
// },
// tailwindcss: {
//   config: {
//     darkmode: "class",
//   },
// },
//NuxtLab ui
// ui: {},

// 工具链可能永远会把 tailwind 的样式插入 head 的尾部。这种情况下，你需要在 app 挂载之前动态的插入 meta 标签。
// app: {
//   head: {
//     meta: [
//       {
//         name: 'naive-ui-style',
//       },
//       {
//         name: 'vueuc-style',
//       },
//     ],
//   },
// },

// Vite. Use Nitro devServer instead.
// server: {
//   proxy: {
//     "/api_cors": {
//       target: "https://api.yicloud.vip/api",
//       changeOrigin: true,
//     },
//   },
// },
// AutoImport seems doesn't work.
// AutoImport({
//   imports: [
//     "vue",
//     {
//       "naive-ui": [
//         "useDialog",
//         "useMessage",
//         "useNotification",
//         "useLoadingBar",
//       ],
//     },
//   ],
// }),
