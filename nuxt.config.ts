// https://nuxt.com/docs/api/configuration/nuxt-config
import { type IconifyJSON } from '@iconify/types';
import { compareColors, stringToColor } from '@iconify/utils/lib/colors';
import { presetIcons } from '@unocss/preset-icons';
import {
  importDirectory,
  parseColors,
  runSVGO,
  deOptimisePaths,
} from '@iconify/tools';

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxthq/ui', '@unocss/nuxt', '@element-plus/nuxt', '@vueuse/nuxt'],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  imports: {
    autoImport: true,
  },
});
