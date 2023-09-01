<script setup lang="ts">
import {
  SiteRouteMap,
  type SiteRouteItemType,
  type SiteRoutesType,
} from '../configs/base';
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
</script>
<template>
  <div class="h-100vh w-100vw bg-#F1F2FD flex">
    <aside class="w-280px">
      <div class="logo w-full h-100px grid place-items-center">
        <div class="w-98px h-57px flex flex-col justify-center items-center">
          <span text-2xl>MoYu</span>
          <span>魔域文化</span>
        </div>
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
              :class="`flex items-center group text-primary_2 text-20px leading-24px ${true}`"
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
      <header class="h-100px">
        <!-- id selector consumes lots of performance? -->
        123
      </header>
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
  --at-apply: 'w-280px h-[calc(100vh-100px)]';
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
      --at-apply: 'text-primary_2';
      --at-apply: pr-4 pl-12;
      --at-apply: text-24px;
    }

    .menu_item_label {
      --at-apply: 'text-primary_2';
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
