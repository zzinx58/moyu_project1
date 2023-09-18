// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  ssr: false,
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
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  imports: {
    autoImport: true,
  },
  //NuxtLab ui
  ui: {},
  devServer: {
    https: {
      // key: "keys/zzx-dev.key",
      // cert: "keys/zzx-dev.cert",
      key: "keys/zzx-192.key",
      cert: "keys/zzx-192.cert",
    },
    port: 5050,
  },
  vite: {
    plugins: [
      Components({
        dts: true,
        resolvers: [NaiveUiResolver()],
      }),
      AutoImport({
        imports: [
          "vue",
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
    ],
  },

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
});
