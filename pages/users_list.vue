<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NButton, type DataTableColumns, DataTableRowKey } from "naive-ui";
import { RowData } from "naive-ui/es/data-table/src/interface";
import gsap from "gsap";
import _, { head } from "lodash";
import * as xlsx from "xlsx";
import { useUserStore } from "@/stores/user";

dayjs.extend(utc);

definePageMeta({
  layout: "pc",
  middleware: ["auth"],
});
useHead({
  title: "U_List - 用户列表",
});

const exportExcelAsFileMethod = (
  sheetName: string,
  fileName: string,
  dataArr: Record<string, any>[]
) => {
  const jsonWorkSheet = xlsx.utils.json_to_sheet(dataArr);
  const workBook: xlsx.WorkBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet,
    },
  };
  return xlsx.writeFile(workBook, fileName);
};

// const { data: usersListData } = await useFetch<{ [key: string]: any }[]>(
//   "/users_list",
//   {
//     method: "GET",
//     server: false,
//   }
// );

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
    { type: "selection" },
    {
      // key: "id",
      key: "user_id",
      title: "ID",
    },
    {
      title: "昵称",
      key: "nick_name",
    },
    {
      title: "所在城市",
      key: "location_city",
      titleAlign: "center",
      className: "text-center!",
    },
    {
      title: "注册时间",
      key: "register_time",
      titleAlign: "center",
      className: "text-center!",
      render(rowData: any) {
        return h(
          "div",
          {
            class: "justify-center flex flex-col box-border",
          },
          [
            h(
              "div",
              {
                class: "",
              },
              `${dayjs
                .unix(+rowData.register_time)
                .utc(true)
                .format("YYYY年MM月DD日 ")}`
            ),
            h(
              "p",
              {
                class: "",
              },
              `${dayjs
                .unix(+rowData.register_time)
                .utc(true)
                .format("HH:mm:ss")}`
            ),
          ]
        );
      },
    },
    {
      title: "手机",
      key: "phone",
      titleAlign: "center",
      className: "text-center!",
    },
    {
      title: "在线状态",
      key: "online_status",
      className: "text-center!",
      render(rowData) {
        return h(
          "div",
          {
            class: "justify-center flex items-center gap-2",
          },
          [
            h("div", {
              class:
                rowData.online_status === 1
                  ? "w-18px h-18px bg-#2CDEA7 rounded-full "
                  : " w-18px h-18px bg-#BBBBBB rounded-full",
            }),
            h(
              "p",
              {
                class: "",
              },
              rowData.online_status === 1 ? "在线" : "离线"
            ),
          ]
        );
      },
    },
    {
      title: "实名认证",
      key: "identity_info",
      className: "text-center!",
      render(rowData: any, rowIndex) {
        return h(
          "div",
          {
            class:
              rowData.identity_info["status"] === 1
                ? "bg-#2CDEA7 text-center rounded-10px text-white"
                : "bg-#BBBBBB text-center rounded-10px text-white",
          },
          rowData.identity_info["status"] === 1 ? "已实名" : "未实名"
        );
      },
    },
    {
      title: "积分",
      key: "points_count",
      className: "text-center!",
    },
    {
      title: "道具卷",
      key: "vocher_count",
      titleAlign: "center",
      render(rowData) {
        return h(
          "div",
          {
            class: "text-center",
          },
          rowData.vocher_count as string
        );
      },
    },
    {
      title: "登录方式",
      key: "login_type",
      className: "text-center!",
      render(rowData: any) {
        return h(
          "div",
          {
            class: "text-center",
          },
          login_type_options.find((item) => item.value === rowData.login_type)
            ?.label
        );
      },
    },
    {
      title: "下载渠道",
      key: "download_channel",
      className: "text-center!",
    },
    {
      title: "操作",
      titleAlign: "center",
      key: "action",
      className: "flex justify-center items-center",
      render(rowData: any, rowIndex: any) {
        return h(
          "div",
          {
            class: "flex gap-5",
          },
          [
            h(
              NButton,
              {
                type: "primary",
                class: "hover:opacity-80! rounded-12px! text-14px! h-40px!",
                iconPlacement: "right",
                renderIcon() {
                  return h("div", {
                    class: "i-custom-svg:u-l-contact",
                  });
                },
              },
              "沟通"
            ),
            h(
              NButton,
              {
                quaternary: true,
                class:
                  "bg-primary_2! rounded-12px!  text-white! hover:opacity-80! text-14px! h-40px!",
                iconPlacement: "right",
                renderIcon() {
                  return h("div", {
                    class: "i-custom-svg:u-l-detail",
                  });
                },
                onclick: () => {
                  // navigateTo(`/user_detail/${rowData.id}`);
                  navigateTo(`/user_detail/${rowData.user_id}`);
                },
              },
              "查看"
            ),
          ]
        );
      },
    },
  ];
};

const selectedUserRowsRef = ref<Array<any>>([]);
const handleSelectedUsers = (rowKeys: DataTableRowKey[]) => {
  selectedUserRowsRef.value = rowKeys;
};
const handleExportSelectedUsers = () => {
  if (selectedUserRowsRef.value) {
    const sheetName = `Sheet1`;
    const fileName = `勾选用户数据导出 - ${dayjs()
      .utc(true)
      .format("YYYY-MM-DD HH\:mm")
      .toString()}.xlsx`;
    exportExcelAsFileMethod(sheetName, fileName, selectedUserRowsRef.value);
  }
};

const login_type_options = [
  {
    label: "微信",
    value: 1,
  },
  {
    label: "QQ",
    value: 2,
  },
  {
    label: "手机",
    value: 3,
  },
  {
    label: "邮箱",
    value: 4,
  },
];
const identity_status_options = [
  {
    label: "已实名",
    value: 1,
  },
  {
    label: "未实名",
    value: 0,
  },
];
const search_options = [
  {
    label: "全部",
    value: "all",
  },
  {
    label: "ID",
    value: "user_id",
  },
  {
    label: "昵称",
    value: "nick_name",
  },
  {
    label: "手机号",
    value: "phone",
  },
];

const collapseItem = ref();
const isCollapsed = ref(true);
watchEffect(() => {
  if (collapseItem.value) {
    gsap.to(collapseItem.value, {
      paddingBottom: isCollapsed.value ? "0px" : "28px",
      height: isCollapsed.value ? "0px" : "auto",
      visibility: isCollapsed.value ? "hidden" : "visible",
      duration: 0.5,
    });
  }
});

/* 前端数据过滤逻辑 */
const filterObjTemp = {
  register_time_range: undefined,
  //Bug 点：[空] 1
  // available_points_range_arr: [,],
  available_points_range_arr: ["", ""],
  region: undefined,
  login_type: undefined,
  identity_status: undefined,
};
const filterObj = ref(structuredClone(filterObjTemp));

const selectedSearchOption = ref();
const searchOptionDetailInfo = ref();
// const selectedSearchOption = ref();
// const searchOptionDetailInfo = ref();
// const currentPage = ref(1);
// const tablePageSize = 10;
// const finalSourceDisplayData = ref<Array<any>>([]);
// const totalPageSize = ref(1);
//?会吗？
// watchEffect(() => {
//   if (usersListData.value) {
//     finalSourceDisplayData.value = usersListData.value;
//     totalPageSize.value = finalSourceDisplayData.value.length / tablePageSize;
//   }
// });

const userStore = useUserStore();

const currentPage = ref(1);
const tablePageSize = ref(10);
const totalPageCount = ref(0);
const totalRowCount = ref(0);
const pageUsersListData = ref<Array<any>>([]);
const finalSourceDisplayData = ref<Array<any>>([]);
const finalDisplayData = ref<Array<any>>([]);

const handleFetchPageUserListData = async (
  searchOptions: Partial<{
    currentPageRaw: number;
    // rowPerPage_size: number;
    [key: string]: any;
    phone: string;
    user_id: string;
  }>
) => {
  // console.log(`output->searchOptions`, searchOptions);
  const { data: usersListDataRaw, error } = await useFetch<any>(
    // "/api_cors/dashboard/users/list",
    "/api/user/users_list",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      query: {
        page: (searchOptions.currentPageRaw ??= 1),
        size: tablePageSize.value,
        ...searchOptions,
      },
    }
  );

  if (usersListDataRaw.value) {
    const usersListDataTemp =
      (usersListDataRaw.value.data?.items as Array<any>) ?? [];

    currentPage.value = usersListDataRaw.value.data?.current_page;
    totalPageCount.value = usersListDataRaw.value.data?.total_pages;
    totalRowCount.value = usersListDataRaw.value.data?.total;

    pageUsersListData.value = usersListDataTemp.map((item) => {
      return {
        user_id: item.user_id,
        nick_name: item.nickname,
        location_city: item.city,
        register_time: item.reg_time,
        phone: item.phone,
        // lack of online_status
        online_status: 1,
        // lack of identity_info
        identity_info: {
          status: 1,
        },
        points_count: item.score,
        vocher_count: item.ticket,
        login_type: item.oauth_type,
        download_channel: item.channel_id,
      };
    });
  }

  // console.log(`output->pageUsersListData.value`, pageUsersListData.value);
  // finalSourceDisplayData.value = pageUsersListData.value;
  // finalDisplayData.value = finalSourceDisplayData.value;
  finalDisplayData.value = pageUsersListData.value;
};
handleFetchPageUserListData({
  currentPageRaw: currentPage.value,
  rowPerPage_size: tablePageSize.value,
});

// watch(
//   () => pageUsersListData.value,
//   () => {
//     if (pageUsersListData.value) {
//       // finalSourceDisplayData.value = usersListData.value.map((item) => {
//       //   return Object.assign({}, item, {
//       //     identity_status: item.identity_info.status,
//       //   });
//       // });
//       //Bug 点
//       finalSourceDisplayData.value = pageUsersListData.value;

//       // totalPageSize.value = Math.ceil(
//       //   finalSourceDisplayData.value.length / tablePageSize.value
//       // );
//     }
//   },
//   { immediate: true }
// );

// const finalDisplayData = computed({
//   get() {
//     return finalSourceDisplayData.value?.slice(
//       (currentPage.value - 1) * tablePageSize.value,
//       currentPage.value * tablePageSize.value
//     );
//   },
//   set(filteredListData: any[]) {
//     finalSourceDisplayData.value = filteredListData;
//     // totalPageSize.value = Math.ceil(
//     //   finalSourceDisplayData.value.length / tablePageSize.value
//     // );
//     // console.log(finalSourceDisplayData.value.length);
//   },
// });
// watch(
//   () => finalDisplayData.value.length,
//   () => {
//     totalPageSize.value = finalDisplayData.value.length / tablePageSize;
//   }
// );

watchEffect(() => {
  if (selectedSearchOption.value === "all") {
    handleFetchPageUserListData({
      currentPageRaw: 1,
    });
  }
});

const handleClickSimpleSearchButton = async () => {
  const searchTargetOption = selectedSearchOption.value;
  handleFetchPageUserListData({
    ...Object.fromEntries([[searchTargetOption, searchOptionDetailInfo.value]]),
  });

  // const simpleFilteredData = usersListData.value?.filter(
  //   (item, index, selfArr) => {
  //     const targetOption = selectedSearchOption.value;
  //     // console.log(targetOption, item.id);
  //     switch (true) {
  //       case targetOption === "all":
  //         return true;
  //       case targetOption === "id":
  //         return item.id === +searchOptionDetailInfo.value;
  //       case targetOption === "wcu_id":
  //         return item.wcu_id === +searchOptionDetailInfo.value;
  //       case targetOption === "nick_name":
  //         return item.nick_name === searchOptionDetailInfo.value;
  //       case targetOption === "phone":
  //         return item.phone === searchOptionDetailInfo.value;
  //     }
  //   }
  // );
  // console.log(selectedSearchOption.value, searchOptionDetailInfo.value);
  // const { data: simpleFilteredData } = await useFetch<any>(
  //   "/api_cors/dashboard/users/list",
  //   {
  //     headers: {
  //       Authorization: `Bearer ${userStore.userInfo.token}`,
  //     },
  //     method: "GET",
  //     query: Object.fromEntries([
  //       [selectedSearchOption.value, searchOptionDetailInfo.value],
  //     ]),
  //   }
  // );
  // console.log(`output->simpleFilteredData.value`, simpleFilteredData.value);
  // watchEffect(() => {
  //   if (selectedSearchOption.value === "all" && pageUsersListData.value) {
  //     finalDisplayData.value = finalSourceDisplayData.value;
  //     searchOptionDetailInfo.value = "";
  //     filterObj.value = structuredClone(filterObjTemp);
  //   }
  // });
  // // if (simpleFilteredData) finalDisplayData.value = simpleFilteredData;
  // if (simpleFilteredData.value)
  //   finalDisplayData.value = simpleFilteredData.value.data.items;
};

// watch(
//   () => filterObj,
//   () => {
//     // let complexFilteredData = usersListData.value ? usersListData.value : [];
//     let complexFilteredData = pageUsersListData.value
//       ? pageUsersListData.value.map((item) => {
//           return Object.assign({}, item, {
//             identity_status: item.identity_info.status,
//           });
//         })
//       : [];
//     let tempFilterObj = Object.fromEntries(
//       // let tempFilterObj = Object.entries(filterObj.value)
//       Object.entries(filterObj.value)
//         .filter(([key, value]) => value !== undefined)
//         .map(([key, value]) => {
//           if (Array.isArray(value)) {
//             if (value.every((item) => item.trim() === ""))
//               return [key, undefined];
//           }
//           return [key, value];
//         })
//         .filter(([key, value]) => value !== undefined)
//     );

//     complexFilteredData = _.filter(
//       complexFilteredData,
//       _.matches(tempFilterObj)
//     );
//     // console.log(
//     //   complexFilteredData,
//     //   tempFilterObj,
//     //   finalSourceDisplayData.value
//     // );
//     console.log(complexFilteredData, tempFilterObj);
//     finalDisplayData.value = complexFilteredData;
//     // console.log(filterObj.value);
//     // complexFilteredData = complexFilteredData.filter((item, index, selfArr) => {
//     //   const matchFilterArr = [];
//     //   switch (true) {
//     //     case filterObj.value.identity_status !== undefined:
//     //       matchFilterArr.push(
//     //         item.identity_info.status === filterObj.value.identity_status!
//     //       );
//     //     case filterObj.value.login_type !== undefined:
//     //       matchFilterArr.push(
//     //         item.login_type.value === filterObj.value.login_type
//     //       );
//     //   }
//     //   console.log(matchFilterArr);

//     //   const filterResult = matchFilterArr.reduce((result, item) => {
//     //     // console.log(result, item);
//     //     return item && result;
//     //   }, true);
//     //   // console.log(filterResult);

//     //   return filterResult;
//     // });
//     // finalDisplayData.value = complexFilteredData;

//     // switch (true) {
//     //   case filterObj.value.identity_status !== undefined:
//     //     usersListData.value &&
//     //       (complexFilteredData = complexFilteredData.filter(
//     //         (item, index, selfArr) => {
//     //           return (
//     //             item.identity_info.status === +filterObj.value.identity_status!
//     //           );
//     //         }
//     //       ));
//     //   case filterObj.value.login_type !== undefined:
//     //     usersListData.value &&
//     //       (complexFilteredData = complexFilteredData.filter(
//     //         (item, index, selfArr) => {
//     //           return item.login_type.value === filterObj.value.login_type;
//     //         }
//     //       ));
//     //   case filterObj.value.region !== undefined:
//     //     usersListData.value &&
//     //       (complexFilteredData = complexFilteredData.filter(
//     //         (item, index, selfArr) => {
//     //           //Bug 点：源和页面业务字段不对应
//     //           // return item.region.includes(filterObj.value.region);
//     //           // return item.location_city.includes(filterObj.value.region);
//     //         }
//     //       ));
//     // }
//     // finalDisplayData.value = complexFilteredData;
//   },
//   { deep: true }
// );
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
      @update:checked-row-keys="handleSelectedUsers"
      class="h-660px"
    />
    <div class="text-#707070 text-16px gap-2 flex items-center mt-3 ml-7">
      <span>
        已选
        <span class="text-primary_1">
          {{ `${selectedUserRowsRef.length}/${totalRowCount}` }}
        </span>
        位用户
      </span>
      <n-button
        type="primary"
        class="rounded-10px!"
        @click="handleExportSelectedUsers"
        >导出选中用户</n-button
      >
    </div>
  </div>
  <div class="flex justify-center mt-7">
    <n-pagination
      size="large"
      :page-count="totalPageCount"
      v-model:page="currentPage"
      :on-update:page="(currentPageRaw: number) => handleFetchPageUserListData({
        currentPageRaw: currentPageRaw,
      })"
    >
      <!-- :page-count="totalPageSize" -->
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

// Change naive-ui DataTable's register_time padding.
:deep(.n-data-table .n-data-table-td) {
  padding: 0px;
}

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
