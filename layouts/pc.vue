<script setup lang="ts">
import {
  SiteRouteMap,
  type SiteRouteItemType,
  type SiteRoutesType,
} from "../configs/base";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

interface propsNavMenuItem {
  to?: string;
  label?: string;
  icon?: string;
  children?: any;
  className?: string;
  disabled?: boolean;
}
interface propsNavMenu {
  accordinMode?: boolean;
  className?: string;
  // children: Array<JSX.Element>
}

const inputUiStyle = {
  rounded: "rounded-24px",
  color: {
    white: {
      outline:
        "shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary_1 dark:focus:ring-primary-400",
    },
  },
  base: "relative block disabled:cursor-not-allowed disabled:bg-#E5E5E5 focus:outline-none border-0  w-288px h-48px min-w-100px",
  icon: {
    trailing: {
      padding: {
        lg: "pe-4",
      },
    },
  },
};

const isOpen = ref(false);
const people = [
  { id: 1, label: "Wade Cooper" },
  { id: 2, label: "Arlene Mccoy" },
  { id: 3, label: "Devon Webb" },
  { id: 4, label: "Tom Cook" },
  { id: 5, label: "Tanya Fox" },
  { id: 6, label: "Hellen Schmidt" },
  { id: 7, label: "Caroline Schultz" },
  { id: 8, label: "Mason Heaney" },
  { id: 9, label: "Claudie Smitham" },
  { id: 10, label: "Emil Schaefer" },
];
const selected = ref([]);

// const projectEnv =
//   import.meta.env.VITE_PROJECT_ENV ??
//   //  "ENV_UNSET";
//   "FORMAL";
const projectInfo = await $fetch("/api/project-info");
// console.log(projectInfo);
const projectENV = projectInfo;
</script>
<template>
  <div class="h-100vh w-100vw bg-#F1F2FD flex">
    <aside class="w-280px">
      <div class="logo w-full h-100px grid place-items-center">
        <!-- <div class="i-custom-svg:nav-logo w-98px h-57px" /> -->
        <div class="i-custom-svg:nav-logo w-98px h-57px bg-black" />
      </div>
      <div class="w-280px h-[calc(100vh-100px)]">
        <UVerticalNavigation
          :links="SiteRouteMap.menuList"
          :ui="{
            base: 'flex flex-row first:pt-14',
            wrapper: 'space-y-5',
            padding: '',
            active: 'text-primary_1',
          }"
        >
          <template #default="{ link, isActive }">
            <!-- isActive() ? 'text-primary_1' : '' -->
            <div
              :class="`flex items-center group text-primary_2 text-20px leading-24px`"
            >
              <div
                :class="`${link.iconMeta} group-hover:text-primary_1 group-hover:opacity-60 group-active:opacity-80 pr-4 pl-12`"
              />
              <div
                class="group-hover:text-primary_1 group-hover:opacity-60 group-active:opacity-80"
              >
                {{ link.label }}
              </div>
            </div>
          </template>
        </UVerticalNavigation>
      </div>
    </aside>
    <div class="w-full h-full mr-10 mb-17 overflow-auto">
      <div class="h-100px w-full flex items-center justify-between">
        <!-- id selector consumes lots of performance? -->
        <div class="flex gap-14 items-center">
          <!-- <UInput :ui="inputUiStyle" size="lg">
            <template #trailing>
              <div
                :class="`i-custom-svg:nav-search text-20px text-primary_1`"
              />
            </template>
          </UInput> -->
          <n-input
            size="large"
            class="flex items-center"
            :style="{
              height: '48px',
              'border-radius': '24px',
              'font-size': '16px',
              'min-width': '200px',
              width: '288px',
            }"
            placeholder="搜索"
          >
            <template #suffix>
              <!-- <div
                :class="`i-custom-svg:nav-search text-20px text-primary_1`"
              /> -->
              <n-button quaternary circle>
                <template #icon>
                  <div
                    :class="`i-custom-svg:nav-search text-20px text-primary_1`"
                  />
                </template>
              </n-button>
            </template>
          </n-input>
          <div
            class="i-custom-svg:nav-email text-primary_2 w-40px h-35px cursor-pointer hover:bg-primary_1 hover:opacity-60"
          />
          <div
            class="i-custom-svg:nav-ringbell text-primary_2 w-40px h-35px cursor-pointer hover:bg-primary_1 hover:opacity-60"
          />
        </div>
        <div class="flex items-center gap-12 mr-25">
          <div class="text-24px text-#292968">
            {{ userStore.userInfo.username }}
          </div>
          <n-avatar round :size="50" class="bg-white!">
            <div class="i-mdi:account text-35px text-#70708C" />
          </n-avatar>
          <div class="absolute right-2 top-1 text-#6F6F8B">
            {{ projectENV }}
          </div>
        </div>
      </div>
      <div
        class="content-container h-[calc(100vh-100px-68px)] bg-background_2 overflow-auto rounded-24px"
      >
        <main class="mx-8 mt-8 mb-19 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vertical_menu {
  --at-apply: "w-280px h-[calc(100vh-100px)]";
  --at-apply: flex flex-col;
  --at-apply: space-y-6;

  .menu_item:first-child {
    --at-apply: pt-14;
  }
  // --at-apply: bg-yellow;
  .menu_item {
    // @apply flex flex-row;
    // To use rules with :, you will have to quote the valu
    --at-apply: flex flex-row;
    --at-apply: w-full;
    --at-apply: font-normal text-20px;
    --at-apply: ;

    .menu_item_icon {
      --at-apply: "text-primary_2";
      --at-apply: pr-4 pl-12;
      --at-apply: text-24px;
    }

    .menu_item_label {
      --at-apply: "text-primary_2";
      --at-apply: leading-24px;
    }
  }

  .menu_item:hover {
    // --at-apply
    .menu_item_icon {
      --at-apply: text-primary_1;
    }

    .menu_item_label {
      --at-apply: text-primary_1;
    }
  }
}
::-webkit-scrollbar {
  width: 8px;
  display: none;
}
// ::-webkit-scrollbar-thumb {
//   &:vertical {
//     background-color: yellow;
//     border-radius: 24px;
//     overflow: overlay;
//   }
// }
// ::-webkit-scrollbar-track {
//   border-radius: 24px;
//   background-color: black;
// }
</style>
