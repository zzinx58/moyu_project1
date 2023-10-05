<script setup lang="ts">
import { useMessage, type DataTableColumns } from "naive-ui";
import * as xlsx from "xlsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ElMessage, ElMessageBox, ElCheckbox, type Action } from "element-plus";
import { useUserStore } from "@/stores/user";

definePageMeta({
  layout: "pc",
  middleware: ["auth"],
});

type UserDetailPrefixInfoType = {
  key: string;
  attrLabel: string;
  formatter?: (content: any) => string;
};
const user_detail_prefix_info_arr_part1: UserDetailPrefixInfoType[] = [
  {
    attrLabel: "昵称：",
    key: "nick_name",
  },
  {
    key: "wcu_id",
    attrLabel: "ID：",
  },
  {
    attrLabel: "注册时间：",
    key: "register_time",
  },
  {
    attrLabel: "地区：",
    key: "location",
  },
  {
    attrLabel: "魔方教室：",
    key: "classroom",
  },
  {
    attrLabel: "战队：",
    key: "squad_name",
  },
  {
    attrLabel: "手机号：",
    key: "phone",
  },
  {
    attrLabel: "实名认证：",
    key: "identity_info",
    formatter: (infoObj) => {
      return infoObj.status;
    },
  },
];
const user_detail_prefix_info_arr_part2: UserDetailPrefixInfoType[] = [
  {
    attrLabel: "积分：",
    key: "points_count",
  },
  {
    attrLabel: "道具卷：",
    key: "voucher_count",
  },
  {
    attrLabel: "绑定QQ：",
    key: "binded_qq",
  },
  {
    attrLabel: "绑定微信：",
    key: "binded_wechat",
  },
];
const user_detail_prefix_info_arr_part3: UserDetailPrefixInfoType[] = [
  {
    attrLabel: "在线总时间：",
    key: "online_time_count",
  },
  {
    attrLabel: "下载渠道：",
    key: "download_channel",
  },
  {
    attrLabel: "登录类型：",
    key: "login_method",
  },

  {
    attrLabel: "登录设备系统：",
    key: "device_agent",
  },
  {
    attrLabel: "登录设备型号：",
    key: "device_type",
  },
  {
    attrLabel: "CPU型号：",
    key: "cpu_model",
  },
  {
    attrLabel: "绑定智能魔方型号：",
    key: "binded_rubik_cube_model",
  },
  {
    attrLabel: "物理地址（mac）：",
    key: "mac_address",
  },
  {
    attrLabel: "设备尺寸：",
    key: "devicePixelRatio",
  },
];

const user_detail_prefix_info_arr_part4: UserDetailPrefixInfoType[] = [
  {
    attrLabel: "最后登录",
    key: "last_login_time",
  },
  {
    attrLabel: "登出时间：",
    key: "last_logout_time",
  },
];
const user_detail_prefix_info_arr_part5: UserDetailPrefixInfoType[] = [
  {
    attrLabel: "绑定时间：",
    key: "binding_time",
  },
  {
    attrLabel: "解绑时间：",
    key: "unbinding_time",
  },
];

const columns_timed_race_data = (): DataTableColumns => {
  return [
    // const columns_timed_race_data_raw = [
    {
      title: "最佳复原时长",
      key: "best_duration",
      titleAlign: "center",
    },
    {
      title: "完成率",
      key: "completion_rate",
      titleAlign: "center",
    },
    {
      title: "当前排名",
      key: "current_ranking",
      titleAlign: "center",
    },
    {
      title: "最高排名",
      key: "highest_ranking",
      titleAlign: "center",
    },
    {
      title: "最佳AO5",
      key: "best_ao5_duration",
      titleAlign: "center",
    },
    {
      title: "最佳AO12",
      key: "best_ao12_duration",
      titleAlign: "center",
    },
    {
      title: "最佳AO100",
      key: "best_ao100_duration",
      titleAlign: "center",
    },
    {
      title: "完成次数",
      key: "completions_count",
      titleAlign: "center",
    },
  ];
  // return columns_timed_race_data_raw;
};

const columns_t_rank_data_raw = [
  {
    title: "月段位/最高段位",
    key: "best_duration",
    render(rowData: any) {},
  },
  {
    title: "月奖杯/最高奖杯",
    key: "completion_rate",
  },
  {
    title: "月胜场/总胜场",
    key: "current_ranking",
  },
  {
    title: "月败场/总败场",
    key: "highest_ranking",
  },
  {
    title: "月平局/总平局",
    key: "best_ao5_duration",
  },
  {
    title: "月连胜/最高连胜",
    key: "best_ao12_duration",
  },
];
const columns_t_rank_data = (): DataTableColumns => {
  return columns_t_rank_data_raw;
};
const columns_multi_race_speed_data_raw = [
  {
    title: "参加次数",
    key: "participate_count",
  },
  {
    title: "完成次数",
    key: "completions_count",
  },
  {
    title: "最佳排名",
    key: "best_ranking",
  },
  {
    title: "最佳AO5",
    key: "best_ao5",
  },
];
const columns_multi_race_speed_data = (): DataTableColumns => {
  return columns_multi_race_speed_data_raw;
};
const columns_squad_info = (): DataTableColumns => {
  return columns_squad_info_raw;
};
const columns_squad_info_raw = [
  {
    title: "战队id",
    key: "squad_id",
  },
  {
    title: "战队名称",
    key: "squad_name",
  },
  {
    title: "战队等级",
    key: "squad_level",
  },
  {
    title: "成员数量",
    key: "squad_members_count",
  },
  {
    title: "个人职称",
    key: "self_title_in_team",
  },
  {
    title: "战队地区",
    key: "squad_region",
  },
  {
    title: "战队战力值/排行",
    key: "squad_combat_value_rank",
  },
  {
    title: "个人战力值/排行",
    key: "self_combat_value_rank",
  },
  {
    title: "加入战队时间",
    key: "squad_join_time",
  },
  {
    title: "离开战队时间",
    key: "squad_leaving_time",
  },
];
const columns_pratice_task_info = (): DataTableColumns => {
  return columns_pratice_task_info_raw;
};
const columns_pratice_task_info_raw = [
  {
    title: "成就",
    key: "achievements_count",
  },
  {
    title: "完成任务数",
    key: "task_completions_count",
  },
  {
    title: "公式广场CFOP练习公式的id",
    key: "cfop_formula_id",
  },
  {
    title: "完成练习",
    key: "practice_completions_count",
  },
];

const columns_wcu_t_data = (): DataTableColumns => {
  return columns_wcu_t_data_raw;
};
const columns_wcu_t_data_raw = [
  {
    title: "赛事名称",
    key: "name",
  },
  {
    title: "模式",
    key: "mode",
  },
  {
    title: "项目",
    key: "p_name",
  },
  {
    title: "排名",
    key: "rank",
  },
  {
    title: "单次",
    key: "",
  },
  {
    title: "平均",
    key: "avg_duration",
  },
  {
    title: "详情",
    key: "rounds_duration_detail",
  },
  {
    title: "更新日期",
    key: "update_date",
  },
];

const columns_account_info = (): DataTableColumns => {
  return columns_account_info_raw;
};
const columns_account_info_raw = [
  {
    title: "积分",
    key: "points_count",
  },
  {
    title: "兑换卷",
    key: "vocher_count",
  },
  {
    title: "拥有物品id",
    key: "award_record_id",
  },
  {
    title: "中奖记录",
    key: "",
  },
];
const columns_order_info = (): DataTableColumns => {
  return columns_order_info_raw;
};
const columns_order_info_raw = [
  {
    title: "收件人",
    key: "receiver_name",
  },
  {
    title: "手机",
    key: "phone",
  },
  {
    title: "订单状态",
    key: "order_status",
  },
  {
    title: "收件地址",
    key: "receive_location",
  },
];

const tabs_competition_data = [
  {
    tabLabel: "计时赛",
    key: "timed_race_data",
  },
  {
    tabLabel: "排位赛",
    key: "t_rank_data",
  },
  {
    tabLabel: "多人速拧",
    key: "multi_race_speed_data",
  },
  {
    tabLabel: "战队",
    key: "squad_info",
  },
  {
    tabLabel: "练习&任务",
    key: "pratice_task_info",
  },
];
const tabs_t_data = [
  {
    tabLabel: "WCU 赛事",
    key: "wcu_t_data",
  },
  {
    tabLabel: "WCA 赛事",
    key: "wca_t_data",
  },
];
const tabs_account_info = [
  {
    tabLabel: "基础信息",
    key: "account_info",
  },
  {
    tabLabel: "订单信息",
    key: "order_info",
  },
];

const identity_info_detail_obj = [
  {
    label: "姓名",
    key: "name",
  },
  {
    label: "身份证号",
    key: "identity_number",
  },
  {
    label: "实名手机",
    key: "phone",
  },
  {
    label: "详细地址",
    key: "location",
  },
];

const route = useRoute();

const refTabFor_competitionData = ref(0);
const refTabFor_tData = ref(0);
const refTabFor_accountInfo = ref(0);

const userStore = useUserStore();
const naiveMessage = useMessage();

// const userDetailData = ref()
// const userRelatedData = ref()
const handleFetchUserDetailData = async () => {
  const { data: userDetailDataRaw, error } = await useFetch<{
    [key: string]: any;
  }>(`/api_cors/dashboard/users/${route.params.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });
  // console.log(`output->error.value`, error.value);
  // console.log(`output->userDetailDataRaw.value`, userDetailDataRaw.value);
  // if (!userDetailDataRaw.value) {
  //   naiveMessage.error("目标用户不存在，正在跳转至主页..");
  //   setTimeout(() => {
  //     navigateTo("/users_list");
  //   }, 1000);
  // }
  console.log(`output->userDetailDataRaw.value`, userDetailDataRaw.value);
  let userDetailDataTemp = {};
  if (userDetailDataRaw.value?.data) {
    const userDetailDataRawInfo = userDetailDataRaw.value.data;
    userDetailDataTemp = {
      // B 接口 对应字段名是 id，需要更改
      user_id: userDetailDataRawInfo.user_id,
      // Part_One 对接
      //缺少
      // oath_type 只有一个对象信息，并没有给足 wechat、qq 的 oath_type 信息
      // binded_qq: oauth_type?
      // binded_wechat: oauth_type?
      // binded_rubik_cube_model: 缺少字段
      // binding_time: 缺少字段
      // clssroom: 缺少字段
      // cpu_model: terminal.cpu
      // devicePixelRatio: terminal.size
      // device_agent: terminal.name
      // device_type: terminal.type
      // download_channel: channel_id
      // gender: oauth_json.gender
      // id: user_id <= user_id & wcu_id
      // identity_info: {
      //    status: 缺少字段
      // 目标字段不明确,起名不算规范？
      //    identity_number: oauth_json.unionid?
      //    location: 缺少字段
      //    name: oauth_json.name
      // 需要业务讨论，用户直接手机号不一定是 身份认证的手机号？身份认证的手机号
      //    phone: phone?
      // }
      // last_login_time: last_login_time
      // last_logout_time: last_logout_time
      // location: 缺少字段，通过 privince、country、city 字段计算获取？
      // login_method: 缺少字段 oauth_type?
      // mac_address: 缺少字段
      // nick_name: 缺少字段
      // online_time_count: 缺少字段, 通过计算获取？
      // phone: phone
      // points_count: score
      // register_time: reg_time
      // sex: oauth_json.gender
      // squad_name: 缺少字段
      // unbinding_time: 缺少字段
      // voucher_count: ticket
      // wca_authentication: 缺少字段
      // wcu_id: 缺少字段

      // Part_two 对接
      // account_info: {
      //    award_record_id: 缺少字段
      //    points_count: score
      //    vocher_count: ticket
      // }
      // multi_race_speed_data: {
      //    best_ao5: user_comp_multi.best_ao5
      //    best_ranking: user_comp_multi.best_rank
      //    completions_count: 缺少字段 enter_num??
      //    participate_count: 缺少字段 finish_num??
      // }
      // order_info: {
      //    order_status: 缺少字段
      //    phone: 缺少字段
      //    receive_location: 缺少字段
      //    receiver_name: 缺少字段
      // }
      // 缺少 pratice_task_info 块相关字段
      // pratice_task_info: {
      //    achievements_count:
      //    cfop_formula_id:
      //    practice_completions_count:
      //    task_completions_count:
      // }
      // 缺少 squad_info 块相关字段
      // squad_info: {
      //    self_combat_value:
      //    self_combat_value_rank:
      //    self_title_in_team:
      //    squad_combat_value:
      //    squad_combat_value_rank:
      //    squad_id:
      //    squad_join_time:
      //    squad_leaving_time:
      //    squad_level:
      //    squad_max_merbers:
      //    squad_members_count:
      //    squad_name:
      //    squad_region:
      // }
      // timed_race_data: {
      //    best_ao5_duration: user_time_trial.best_ao5
      //    best_ao12_duration: user_time_trial.best_ao12
      //    best_ao100_duration: user_time_trial.best_ao100
      //    best_duration: user_time_trial.best_duration
      //    completion_rate: 缺少字段或表意不明确, user_time_trial.finish_num?
      //    completions_count: 缺少字段或表意不明确, user_time_trial.finish_num?
      //    current_ranking: 缺少字段或表意不明确, user_time_trial.num?
      //    highest_ranking: 缺少字段或表意不明确, user_time_trial.used_num?
      // user_time_trial.add_num_time?
      // }
      // wac_t_data: {}
      // 缺少 wcu_t_data 块相关字段
      // wcu_t_data: {
      //    avg_duration:
      //    best_duration:
      //    mode:
      //    name:
      //    p_name:
      //    rank:
      //    rounds_duration_detail:
      //    update_date:
      // }
      // 不清楚 user_qualifier 块字段对应模块。t_rank_data?
      // t_rank_data: {
      //    draw_total: 缺少字段或表意不明确 user_qualifier.drawn?
      //    highest_winning_streak: user_qualifier.max_cup?
      //    lose_total: user_qualifier.lose?
      //    monthly_draw_total: 缺少字段或表意不明确 user_qualifier.drawn?
      //    monthly_highest_rank: user_qualifier.id?
      //    monthly_lose_total: user_qualifier.lose?
      //    monthly_rank: user_qualifier.period?
      //    monthly_win_total: user_qualifier.recently_win? []?
      //    monthly_winning_streak: user_qualifier.win_streak?
      //    wins_total: user_qualifier.max_cup?
      // user_qualifier.is_reward?
      // user_qualifier.period?
      //
      // }
    };
  }
};
handleFetchUserDetailData();

const { data: userDetailData } = await useFetch<{ [key: string]: any }>(
  "/user_detail/1",
  {
    method: "GET",
    server: false,
  }
);
// console.log(userDetailData.value);
const { data: userRelatedData } = await useFetch<{ [key: string]: any }>(
  "/user_related_data/1",
  {
    method: "get",
    server: false,
  }
);
console.log(userRelatedData.value);

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
// const handleExportPlayerDetailData = () => {
//   // console.log(1);
//   if (t_infoData.value) {
//     const sheetName = `Sheet1`;
//     const fileName = `选手基础资料导出 - ${dayjs()
//       .utc(true)
//       .format('YYYY-MM-DD HH\:mm')
//       .toString()}.xlsx`;
//     exportExcelAsFileMethod(sheetName, fileName, [t_infoData.value]);
//   }
// };
// const handleExportPlayerCompetitionData = () => {
//   // console.log(2);
//   if (t_applicantsData.value) {
//     const sheetName = `Sheet1`;
//     const fileName = `选手竞赛数据导出 - ${dayjs()
//       .utc(true)
//       .format('YYYY-MM-DD HH:mm')
//       .toString()}.xlsx`;
//     exportExcelAsFileMethod(sheetName, fileName, t_applicantsData.value);
//   }
// };
// const handleExportPlayerTData = () => {
//   // console.log(3);
//   if (t_resultsData.value) {
//     const sheetName = `Sheet1`;
//     const fileName = `选手赛事数据导出 - ${dayjs()
//       .utc(true)
//       .format('YYYY-MM-DD HH:mm')
//       .toString()}.xlsx`;

//     exportExcelAsFileMethod(sheetName, fileName, t_resultsData.value);
//   }
// };
// const handleExportPlayerAccountInfoData = () => {
//   // console.log(3);
//   if (t_resultsData.value) {
//     const sheetName = `Sheet1`;
//     const fileName = `选手账户信息导出 - ${dayjs()
//       .utc(true)
//       .format('YYYY-MM-DD HH:mm')
//       .toString()}.xlsx`;

//     exportExcelAsFileMethod(sheetName, fileName, t_resultsData.value);
//   }
// };

// const exportStateTemp = {
//   isExportPlayerDetailData: false,
//   isExportPlayerCompetitionData: false,
//   isExportPlayerTData: false,
//   isExportPlayerAccountInfoData: false,
// };
// const exportStateObjRef = ref(structuredClone(exportStateTemp));
// const correspondExportMethodObj: Record<string, () => void> = {
//   isExportPlayerDetailData: handleExportPlayerDetailData,
//   isExportPlayerCompetitionData: handleExportPlayerCompetitionData,
//   isExportPlayerTData: handleExportPlayerTData,
//   isExportPlayerAccountInfoData: handleExportPlayerAccountInfoData,
// };
// const handleExportModalClick = () => {
//   ElMessageBox({
//     // dangerouslyUseHTMLString: true,
//     title: '选择导出',
//     message: () =>
//       h(
//         'div',
//         {
//           class: 'flex justify-between',
//         },
//         // [h('span', null, 1), h('span', null, 2)]
//         [
//           h(ElCheckbox, {
//             modelValue: exportStateObjRef.value.isExportPlayerDetailData,
//             'onUpdate:modelValue': (val: boolean | string | number) => {
//               exportStateObjRef.value.isExportPlayerDetailData = val as boolean;
//             },
//             label: '基础资料',
//           }),
//           h(ElCheckbox, {
//             modelValue: exportStateObjRef.value.isExportPlayerCompetitionData,
//             'onUpdate:modelValue': (val: boolean | string | number) => {
//               exportStateObjRef.value.isExportPlayerCompetitionData = val as boolean;
//             },
//             label: '竞赛数据',
//           }),
//           h(ElCheckbox, {
//             modelValue: exportStateObjRef.value.isExportPlayerTData,
//             'onUpdate:modelValue': (val: boolean | string | number) => {
//               exportStateObjRef.value.isExportPlayerTData =
//                 val as boolean;
//             },
//             label: '赛事数据',
//           }),
//           h(ElCheckbox, {
//             modelValue: exportStateObjRef.value.isExportPlayerAccountInfoData,
//             'onUpdate:modelValue': (val: boolean | string | number) => {
//               exportStateObjRef.value.isExportPlayerAccountInfoData =
//                 val as boolean;
//             },
//             label: '账户信息',
//           }),
//         ]
//       ),
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//     callback: (action: Action) => {
//       if (action === 'confirm') {
//         Object.entries(exportStateObjRef.value).forEach(([key, value]) => {
//           // console.log(key, value);
//           if (value) {
//             const excuteMethod = correspondExportMethodObj[key];
//             if (excuteMethod) {
//               excuteMethod();
//             }
//           }
//         });
//       }
//     },
//   });
// };

// debugger;
</script>
<template>
  <div class="min-w-640px">
    <!--  -->
    <div class="mb-5 flex justify-between min-w-640px">
      <div class="text-20px! text-primary_1! leading-24px! bg-#F7F8FD">
        赛事管理
      </div>
      <div>
        <UButton
          class="bg-primary_1 active:opacity-80 flex justify-center"
          trailing-icon="i-mdi:cloud-upload-outline text-24px"
          >导出数据</UButton
        >
        <!-- @click="handleExportModalClick" -->
      </div>
    </div>
    <div class="bg-#70708C text-white rounded-10px">
      <div class="pt-6 pb-9 px-9 mb-12">
        <div
          class="rounded-18px w-148px h-36px bg-primary_1 flex justify-center items-center text-23px"
        >
          ID:26532
        </div>
        <div class="divide-y flex flex-col">
          <div
            class="grid 2xl:grid-cols-4 lg:grid-cols-3 pt-4 pb-7 gap-5 text-16px text-white"
          >
            <span
              v-for="item in user_detail_prefix_info_arr_part1"
              class="flex"
            >
              {{ item.attrLabel }}
              <span v-if="item.key === 'identity_info'">
                <div
                  :class="`${
                    userDetailData?.[item.key].status === 1
                      ? 'bg-green w-64px h-24px rounded-12px text-center'
                      : 'bg-#BBBBBB w-64px h-24px rounded-12px text-center'
                  }`"
                >
                  <n-tooltip
                    trigger="hover"
                    :style="{
                      'background-color': 'white',
                      color: '#292968',
                      'font-size': '16px',
                    }"
                    arrow-style="background-color: white"
                    :arrow-point-to-center="false"
                    placement="right-end"
                  >
                    <template #trigger>
                      {{
                        userDetailData?.[item.key].status === 1
                          ? "已实名"
                          : "未实名"
                      }}
                    </template>
                    <div v-for="itemI in identity_info_detail_obj">
                      {{ itemI.label }}：{{
                        userDetailData?.[item.key][itemI.key]
                      }}
                    </div>
                  </n-tooltip>
                </div>
              </span>
              <span v-if="item.key !== 'identity_info'">{{
                userDetailData?.[item.key]
              }}</span>
            </span>
          </div>
          <div
            class="grid lg:grid-cols-2 2xl:grid-cols-4 py-7 gap-5 text-16px text-white"
          >
            <span v-for="item in user_detail_prefix_info_arr_part2">
              {{ item.attrLabel }}
              <span>{{ userDetailData?.[item.key] }}</span>
            </span>
          </div>
          <div class="flex pt-7 flex-wrap gap-5">
            <!-- <div class="grid grid-cols-3 gap-5 text-16px text-white"> -->
            <div
              class="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3 text-16px text-white"
            >
              <span v-for="item in user_detail_prefix_info_arr_part3">
                {{ item.attrLabel }}
                <span>{{ userDetailData?.[item.key] }}</span>
              </span>
            </div>
            <div class="grid gap-5 text-16px text-white">
              <span>
                <span>
                  {{ user_detail_prefix_info_arr_part4[0].attrLabel }}/
                  {{ user_detail_prefix_info_arr_part4[1].attrLabel }}
                </span>
                <span>
                  {{ userDetailData?.last_login_time }}/
                  {{ userDetailData?.last_logout_time }}
                </span>
              </span>
              <span v-for="item in user_detail_prefix_info_arr_part5">
                {{ item.attrLabel }}
                <span>{{ userDetailData?.[item.key] }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="mb-10 flex flex-col justify-center items-center">
      <h1 class="mb-6 text-#70708C text-28px">竞赛数据</h1>
      <n-tabs
        type="card"
        default-value="1"
        v-model:value="refTabFor_competitionData"
      >
        <n-tab-pane
          v-for="(item, index) in tabs_competition_data"
          :tab="item.tabLabel"
          :key="item.tabLabel"
          :name="index"
        >
          <!-- :data="finalDisplayData"
  :single-line="true"
  :single-column="true"
  :striped="true"
  :bordered="false"
  :row-key="(row) => row" -->
          <n-data-table
            v-if="item.key === 'timed_race_data'"
            :columns="columns_timed_race_data()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
          <n-data-table
            v-if="item.key === 't_rank_data'"
            :columns="columns_t_rank_data()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
          <n-data-table
            v-if="item.key === 'multi_race_speed_data'"
            :columns="columns_multi_race_speed_data()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
          <n-data-table
            v-if="item.key === 'squad_info'"
            :columns="columns_squad_info()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
          <n-data-table
            v-if="item.key === 'pratice_task_info'"
            :columns="columns_pratice_task_info()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
        </n-tab-pane>
        <!-- <n-tab-pane v-for="item in tabs_timed_race" :tab="item.tabLabel" :key="item.tabLabel" :name="item.tabLabel">{{}}</n-tab-pane> -->
      </n-tabs>
    </div>
    <!--  -->
    <div class="mb-10 flex flex-col justify-center items-center">
      <h1 class="mb-6 text-#70708C text-28px">赛事数据</h1>
      <n-tabs type="card" default-value="1" v-model:value="refTabFor_tData">
        <n-tab-pane
          v-for="(item, index) in tabs_t_data"
          :tab="item.tabLabel"
          :key="item.tabLabel"
          :name="index"
        >
          <n-data-table
            v-if="item.key === 'wcu_t_data'"
            :columns="columns_wcu_t_data()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
          <n-data-table
            v-if="item.key === 'wca_t_data'"
            :columns="columns_wcu_t_data()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
        </n-tab-pane>
      </n-tabs>
    </div>
    <!--  -->
    <div class="mb-10 flex flex-col justify-center items-center">
      <div class="mb-6 text-#70708C text-28px">账户信息</div>
      <n-tabs
        type="card"
        default-value="1"
        v-model:value="refTabFor_accountInfo"
      >
        <n-tab-pane
          v-for="(item, index) in tabs_account_info"
          :tab="item.tabLabel"
          :key="item.tabLabel"
          :name="index"
        >
          <n-data-table
            v-if="item.key === 'account_info'"
            :columns="columns_account_info()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
          <n-data-table
            v-if="item.key === 'order_info'"
            :columns="columns_order_info()"
            :striped="true"
            :bordered="false"
            :data="[userRelatedData?.[item.key]]"
          >
          </n-data-table>
        </n-tab-pane>
      </n-tabs>
    </div>
    <!--  -->
  </div>
</template>
<style scoped lang="scss">
:deep(.n-data-table-th) {
  --uno: h-40px;
  background-color: #70708C !important;
  font-size: 16px;
}
:deep(.n-data-table-td) {
  --uno: first:rounded-l-10px last:rounded-r-10px h-48px;
}
:deep( .n-data-table-td) {
  color: #6b7280 !important;
}
:deep(.n-tabs.n-tabs--top .n-tab-pane) {
  padding: 0;
}
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab.n-tabs-tab--active) {
  --uno: bg-#70708C border-0 text-white text-20px;
}
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab) {
  --uno: bg-#EDF1FE border-0 text-#70708C text-20px;
}
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-pad) {
  --uno: bg-#EDF1FE border-0;
}
:deep(.n-tabs .n-tabs-tab-pad) {
  width: 0;
}
</style>
