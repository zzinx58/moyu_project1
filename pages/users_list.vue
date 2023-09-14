<script setup lang="ts">
import dayjs from 'dayjs';
import { NButton, type DataTableColumns, DataTableRowKey } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import gsap from 'gsap';
import _ from 'lodash';

const { data: usersListData } = await useFetch<{ [key: string]: any }[]>(
  '/users_list',
  {
    method: 'GET',
    server: false,
  }
);

// type UsersListDataType = {};
// const createColumns = ({
//   contact,
//   detail,
// }: {
//   contact: (row: any) => void;
//   detail: (row: any) => void;
// }): DataTableColumns<any> => {
//   return [];
// };
const columns = (): DataTableColumns => {
  return [
    { type: 'selection' },
    {
      key: 'id',
      title: 'ID',
    },
    {
      title: '昵称',
      key: 'nick_name',
    },
    {
      title: '所在城市',
      key: 'location_city',
      titleAlign: 'center',
      className: 'text-center!',
    },
    {
      title: '注册时间',
      key: 'register_time',
      titleAlign: 'center',
    },
    {
      title: '手机',
      key: 'phone',
      titleAlign: 'center',
    },
    {
      title: '在线状态',
      key: 'online_status',
      render(rowData) {
        return h(
          'div',
          {
            class: 'justify-center flex',
          },
          h('div', {
            class:
              rowData.online_status === 1
                ? 'w-18px h-18px bg-#2CDEA7 rounded-full '
                : ' w-18px h-18px bg-#BBBBBB rounded-full',
          })
        );
      },
    },
    {
      title: '实名认证',
      key: 'identity_info',
      render(rowData: any, rowIndex) {
        return h(
          'div',
          {
            class:
              rowData.identity_info['status'] === 1
                ? 'bg-#2CDEA7 text-center rounded-10px text-white'
                : 'bg-#BBBBBB text-center rounded-10px text-white',
          },
          rowData.identity_info['status'] === 1 ? '已实名' : '未实名'
        );
      },
    },
    {
      title: '积分',
      key: 'points_count',
      className: 'text-center!',
    },
    {
      title: '道具卷',
      key: 'vocher_count',
      render(rowData) {
        return h(
          'div',
          {
            class: 'text-center',
          },
          rowData.vocher_count as string
        );
      },
    },
    {
      title: '登录方式',
      key: 'login_type',
      render(rowData: any) {
        return h(
          'div',
          {
            class: 'text-center',
          },
          login_type_options.find((item) => item.value === rowData.login_type)
            ?.label
        );
      },
    },
    {
      title: '下载渠道',
      key: 'download_channel',
      className: 'text-center!',
    },
    {
      title: '操作',
      titleAlign: 'center',
      key: 'action',
      className: 'flex justify-center items-center',
      render(rowData: any, rowIndex: any) {
        return h(
          'div',
          {
            class: 'flex gap-5',
          },
          [
            h(
              NButton,
              {
                type: 'primary',
                class: 'hover:opacity-80! rounded-12px! text-14px! h-40px!',
                iconPlacement: 'right',
                renderIcon() {
                  return h('div', {
                    class: 'i-custom-svg:u-l-contact',
                  });
                },
              },
              '沟通'
            ),
            h(
              NButton,
              {
                quaternary: true,
                class:
                  'bg-primary_2! rounded-12px!  text-white! hover:opacity-80! text-14px! h-40px!',
                iconPlacement: 'right',
                renderIcon() {
                  return h('div', {
                    class: 'i-custom-svg:u-l-detail',
                  });
                },
              },
              '查看'
            ),
          ]
        );
      },
    },
  ];
};

const selectedUserRowsRef = ref<DataTableRowKey[]>([]);
const handleSelectUsers = (rowKeys: DataTableRowKey[]) => {
  selectedUserRowsRef.value = rowKeys;
};

const login_type_options = [
  {
    label: '微信',
    value: 1,
  },
  {
    label: 'QQ',
    value: 2,
  },
  {
    label: '手机',
    value: 3,
  },
  {
    label: '邮箱',
    value: 4,
  },
];
const identity_status_options = [
  {
    label: '已实名',
    value: 1,
  },
  {
    label: '未实名',
    value: 0,
  },
];
const search_options = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: 'ID',
    value: 'id',
  },
  {
    label: 'WCU_ID',
    value: 'wcu_id',
  },
  {
    label: '昵称',
    value: 'nick_name',
  },
  {
    label: '手机号',
    value: 'phone',
  },
];

const collapseItem = ref();
const isCollapsed = ref(true);
watchEffect(() => {
  if (collapseItem.value) {
    gsap.to(collapseItem.value, {
      paddingBottom: isCollapsed.value ? '0px' : '28px',
      height: isCollapsed.value ? '0px' : 'auto',
      visibility: isCollapsed.value ? 'hidden' : 'visible',
      duration: 0.5,
    });
  }
});

const filterObjTemp = {
  register_time_range: undefined,
  //Bug 点：[空] 1
  // available_points_range_arr: [,],
  available_points_range_arr: ['', ''],
  region: undefined,
  login_type: undefined,
  identity_status: undefined,
};
const filterObj = ref(structuredClone(filterObjTemp));
const selectedSearchOption = ref();
const searchOptionDetailInfo = ref();
const currentPage = ref(1);
const tablePageSize = 10;
const finalSourceDisplayData = ref<Array<any>>([]);
const totalPageSize = ref(1);
//?会吗？
// watchEffect(() => {
//   if (usersListData.value) {
//     finalSourceDisplayData.value = usersListData.value;
//     totalPageSize.value = finalSourceDisplayData.value.length / tablePageSize;
//   }
// });
watch(
  () => usersListData.value,
  () => {
    if (usersListData.value) {
      // finalSourceDisplayData.value = usersListData.value.map((item) => {
      //   return Object.assign({}, item, {
      //     identity_status: item.identity_info.status,
      //   });
      // });
      //Bug 点
      finalSourceDisplayData.value = usersListData.value;

      totalPageSize.value = totalPageSize.value = Math.ceil(
        finalSourceDisplayData.value.length / tablePageSize
      );
    }
  },
  { immediate: true }
);
const finalDisplayData = computed({
  get() {
    return finalSourceDisplayData.value?.slice(
      (currentPage.value - 1) * tablePageSize,
      currentPage.value * tablePageSize
    );
  },
  set(filteredListData: any[]) {
    finalSourceDisplayData.value = filteredListData;
    totalPageSize.value = Math.ceil(
      finalSourceDisplayData.value.length / tablePageSize
    );
    // console.log(finalSourceDisplayData.value.length);
  },
});
// watch(
//   () => finalDisplayData.value.length,
//   () => {
//     totalPageSize.value = finalDisplayData.value.length / tablePageSize;
//   }
// );

const handleClickSimpleSearchButton = () => {
  const simpleFilteredData = usersListData.value?.filter(
    (item, index, selfArr) => {
      const targetOption = selectedSearchOption.value;
      // console.log(targetOption, item.id);
      switch (true) {
        case targetOption === 'all':
          return true;
        case targetOption === 'id':
          return item.id === +searchOptionDetailInfo.value;
        case targetOption === 'wcu_id':
          return item.wcu_id === +searchOptionDetailInfo.value;
        case targetOption === 'nick_name':
          return item.nick_name === searchOptionDetailInfo.value;
        case targetOption === 'phone':
          return item.phone === searchOptionDetailInfo.value;
      }
    }
  );
  watchEffect(() => {
    if (selectedSearchOption.value === 'all' && usersListData.value) {
      finalDisplayData.value = finalSourceDisplayData.value;
      searchOptionDetailInfo.value = '';
      filterObj.value = structuredClone(filterObjTemp);
    }
  });
  if (simpleFilteredData) finalDisplayData.value = simpleFilteredData;
};

watch(
  () => filterObj,
  () => {
    // let complexFilteredData = usersListData.value ? usersListData.value : [];
    let complexFilteredData = usersListData.value
      ? usersListData.value.map((item) => {
          return Object.assign({}, item, {
            identity_status: item.identity_info.status,
          });
        })
      : [];
    let tempFilterObj = Object.fromEntries(
      // let tempFilterObj = Object.entries(filterObj.value)
      Object.entries(filterObj.value)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            if (value.every((item) => item.trim() === ''))
              return [key, undefined];
          }
          return [key, value];
        })
        .filter(([key, value]) => value !== undefined)
    );

    complexFilteredData = _.filter(
      complexFilteredData,
      _.matches(tempFilterObj)
    );
    // console.log(
    //   complexFilteredData,
    //   tempFilterObj,
    //   finalSourceDisplayData.value
    // );
    console.log(complexFilteredData, tempFilterObj);
    finalDisplayData.value = complexFilteredData;
    // console.log(filterObj.value);
    // complexFilteredData = complexFilteredData.filter((item, index, selfArr) => {
    //   const matchFilterArr = [];
    //   switch (true) {
    //     case filterObj.value.identity_status !== undefined:
    //       matchFilterArr.push(
    //         item.identity_info.status === filterObj.value.identity_status!
    //       );
    //     case filterObj.value.login_type !== undefined:
    //       matchFilterArr.push(
    //         item.login_type.value === filterObj.value.login_type
    //       );
    //   }
    //   console.log(matchFilterArr);

    //   const filterResult = matchFilterArr.reduce((result, item) => {
    //     // console.log(result, item);
    //     return item && result;
    //   }, true);
    //   // console.log(filterResult);

    //   return filterResult;
    // });
    // finalDisplayData.value = complexFilteredData;

    // switch (true) {
    //   case filterObj.value.identity_status !== undefined:
    //     usersListData.value &&
    //       (complexFilteredData = complexFilteredData.filter(
    //         (item, index, selfArr) => {
    //           return (
    //             item.identity_info.status === +filterObj.value.identity_status!
    //           );
    //         }
    //       ));
    //   case filterObj.value.login_type !== undefined:
    //     usersListData.value &&
    //       (complexFilteredData = complexFilteredData.filter(
    //         (item, index, selfArr) => {
    //           return item.login_type.value === filterObj.value.login_type;
    //         }
    //       ));
    //   case filterObj.value.region !== undefined:
    //     usersListData.value &&
    //       (complexFilteredData = complexFilteredData.filter(
    //         (item, index, selfArr) => {
    //           //Bug 点：源和页面业务字段不对应
    //           // return item.region.includes(filterObj.value.region);
    //           // return item.location_city.includes(filterObj.value.region);
    //         }
    //       ));
    // }
    // finalDisplayData.value = complexFilteredData;
  },
  { deep: true }
);
</script>
<template>
  <!-- <pre>{{ testData }}</pre> -->
  <div>
    <div class="flex items-center gap-4 mb-7 w-280px! h-36px!">
      <n-input-group class="w-280px!">
        <n-select
          class="w-120px! h-36px! select_options_style"
          placeholder="Select"
          :options="search_options"
          v-model:value="selectedSearchOption"
        ></n-select>
        <n-input
          class="w-160px! rounded-10px!"
          placeholder="Input.."
          v-model:value="searchOptionDetailInfo"
        >
          <template #suffix>
            <n-button
              quaternary
              type="primary"
              @click="handleClickSimpleSearchButton"
            >
              <template #icon>
                <div :class="`i-custom-svg:nav-search text-primary_1`" />
              </template>
            </n-button>
          </template>
        </n-input>
      </n-input-group>
      <n-button
        class="rounded-24px! w-96px! text-16px!"
        type="primary"
        icon-placement="right"
        @click="isCollapsed = !isCollapsed"
      >
        更多
        <template #icon>
          <div class="i-ep:arrow-down" />
        </template>
      </n-button>
    </div>
    <div class="flex gap-x-25 gap-y-4 flex-wrap h-0 pb-0" ref="collapseItem">
      <div class="flex gap-3 text-16px items-center">
        <label>注册时间</label>
        <n-date-picker
          type="datetimerange"
          clearable
          class="w-453px!"
          v-model:value="filterObj.register_time_range"
        ></n-date-picker>
      </div>
      <div class="flex gap-3 text-16px items-center">
        <label>登录平台</label>
        <n-select
          class="w-120px!"
          placeholder="platform"
          :options="login_type_options"
          v-model:value="filterObj.login_type"
        ></n-select>
      </div>
      <div class="flex gap-3 text-16px items-center">
        <label>实名认证</label>
        <n-select
          class="w-120px!"
          placeholder="id_status"
          :options="identity_status_options"
          v-model:value="filterObj.identity_status"
        ></n-select>
      </div>
      <div class="flex gap-3 text-16px items-center">
        <label>可用积分</label>
        <n-input-group class="w-200px!">
          <n-input
            placeholder="number"
            class="rounded-10px!"
            v-model:value="filterObj.available_points_range_arr[0]"
          ></n-input>
          <n-input-group-label>-</n-input-group-label>
          <n-input
            placeholder="number"
            class="rounded-10px!"
            v-model:value="filterObj.available_points_range_arr[1]"
          ></n-input>
        </n-input-group>
      </div>
      <div class="flex gap-3 text-16px items-center">
        <label>所在地区</label>
        <n-input
          placeholder="region"
          class="rounded-10px!"
          v-model:value="filterObj.region"
        ></n-input>
      </div>
    </div>
    <n-data-table
      :columns="columns()"
      :data="finalDisplayData"
      :single-line="true"
      :single-column="true"
      :striped="true"
      :bordered="false"
      :row-key="(row) => row"
      @update:checked-row-keys="handleSelectUsers"
      class="h-660px"
    />
    <div class="text-#707070 text-16px gap-2 flex items-center mt-3 ml-7">
      <span>
        已选
        <span class="text-primary_1">
          {{ `${selectedUserRowsRef.length}/${usersListData?.length}` }}
        </span>
        位用户
      </span>
      <n-button type="primary" class="rounded-10px!">导出选中用户</n-button>
    </div>
  </div>
  <div class="flex justify-center mt-7">
    <n-pagination
      size="large"
      :page-count="totalPageSize"
      v-model:page="currentPage"
    >
      <template #prev>
        <sapn class="i-mdi:navigate-before text-30px" />
        <span class="text-16px!"> 上一步 </span>
      </template>
      <template #next>
        <span class="text-16px!"> 下一步 </span>
        <sapn class="i-mdi:navigate-next text-30px" />
      </template>
    </n-pagination>
  </div>
  <!-- :row-props="rowProps" -->
</template>
<style scoped lang="scss">

:deep(.n-data-table-th) {
  --uno: first:rounded-l-10px last:rounded-r-10px h-60px;
  background-color: #70708C !important;
  font-size: 16px;
}
:deep(.n-data-table-td) {
  --uno: first:rounded-l-10px last:rounded-r-10px h-60px;
}
:deep( .n-data-table-td) {
  color: #6b7280 !important;
}
:deep(.n-input-wrapper) {
  padding-right: 0 !important;
}
:deep(.select_options_style .n-base-selection-label) {
  background-color: #70708C !important;
  height: 36px !important;
}
:deep(.select_options_style .n-base-selection-placeholder__inner) {
  color: white;
}
:deep(.select_options_style .n-base-selection-input__content) {
  color: white;
}
:deep(.select_options_style .n-base-suffix__arrow svg) {
  color: white;
}
</style>