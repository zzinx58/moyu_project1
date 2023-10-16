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
useHead({
  title: "UserDetail - 用户详情",
});

dayjs.extend(utc);

type UserDetailPrefixInfoType = {
  key: string;
  attrLabel: string;
  formatter?: (content: any) => string;
};
const user_detail_prefix_info_arr_part1: UserDetailPrefixInfoType[] = [
  {
    attrLabel: "昵称：",
    key: "nick_name",
    // formatter: (infoObj) => {
    //   return 123;
    // },
  },
  {
    attrLabel: "ID：",
    key: "wcu_id",
  },
  {
    attrLabel: "注册时间：",
    key: "register_time",
  },
  {
    attrLabel: "实名认证：",
    key: "identity_info",
    formatter: (infoObj) => {
      return infoObj.status;
    },
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
    attrLabel: "地区：",
    key: "location",
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
  // {
  //   attrLabel: "绑定QQ：",
  //   key: "binded_qq",
  // },
  // {
  //   attrLabel: "绑定微信：",
  //   key: "binded_wechat",
  // },
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
    formatter: (content) => {
      return dayjs.unix(+content).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    attrLabel: "登出时间：",
    key: "last_logout_time",
    formatter: (content) => {
      return dayjs.unix(+content).format("YYYY-MM-DD HH:mm:ss");
    },
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

/* dataTable 数据展示组件所需列头数据 */
const columns_timed_race_data = (): DataTableColumns => {
  return [
    // const columns_timed_race_data_raw = [
    {
      title: "最佳复原时长",
      key: "best_duration",
      // titleAlign: "center",
      // render(rowData, rowIndex) {
      //   return;
      // },
    },
    {
      title: "完成率",
      key: "completion_rate",
      // titleAlign: "center",
    },
    {
      title: "当前排名",
      key: "current_ranking",
      // titleAlign: "center",
    },
    {
      title: "最高排名",
      key: "highest_ranking",
      // titleAlign: "center",
    },

    {
      title: "最佳AO5",
      key: "best_ao5_duration",
      // titleAlign: "center",
    },
    {
      title: "最佳AO12",
      key: "best_ao12_duration",
      // titleAlign: "center",
    },
    {
      title: "最佳AO100",
      key: "best_ao100_duration",
      // titleAlign: "center",
    },
    {
      title: "完成次数",
      key: "completions_count",
      // titleAlign: "center",
    },
  ];
  // return columns_timed_race_data_raw;
};
const columns_t_rank_data_raw = [
  {
    title: "月段位/最高段位",
    key: "about_rank_data",
  },
  {
    title: "月奖杯/最高奖杯",
    key: "about_cup_data",
  },
  {
    title: "月胜场/总胜场",
    key: "about_win_data",
  },
  {
    title: "月败场/总败场",
    key: "about_lose_data",
  },
  {
    title: "月平局/总平局",
    key: "about_draw_data",
  },
  {
    title: "月连胜/最高连胜",
    key: "about_winning_streak_data",
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

/* tabs 组件所需数据内容 */
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

/* Tooltip 身份认证详细信息组件所需数据 */
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

/* 当前后端接口类型结构 */
type currentBackendInterfaceType = {
  code: number;
  data: {
    //
    channel_id: number;
    //用户所在市
    city: string;
    //用户所在国家
    country: string;
    //用户所在省
    province: string;
    //用户最后登陆时间
    last_login_time: number;
    //用户最后登出时间
    last_logout_time: number;
    //用户昵称
    nickname: string;
    //用户身份认证信息
    oauth_json: {
      gender: string;
      iconurl: string;
      name: string;
      openid: string;
      uid: string;
      unionid: string;
    };
    //用户使用的身份认证渠道类型ID
    oauth_type: number;
    //用户手机
    phone: string;
    // 用户注册时间
    reg_time: number;
    // 用户现有积分情况
    score: number;
    // 用户所用终端相关信息
    terminal: {
      cpu: string;
      name: string;
      size: string;
      type: number;
    };
    // 用户现有道具卷情况
    ticket: number;
    // 用户多人速拧赛相关数据信息
    user_comp_multi: {
      user_id: number;
      enter_num: number;
      finish_num: number;
      best_ao5: number;
      best_rank: number;
    };
    // 用户 id
    user_id: number;
    // 用户排位赛相关数据信息
    user_qualifier: {
      cup: number;
      drawn: number;
      id: number;
      is_reward: number;
      lose: number;
      max_cup: number;
      max_win_streak: number;
      period: number;
      recently_win: string;
      total_cup: number;
      total_drawn: number;
      total_lose: number;
      total_win: number;
      total_win_streak: number;
      user_id: number;
      win: number;
      win_streak: number;
    };
    // 用户计时赛相关数据信息
    user_time_trial: {
      user_id: number;
      num: number;
      add_num_time: number;
      this_start_time: number;
      used_num: number;
      finish_num: number;
      best_duration: number;
      best_ao5: number;
      best_ao12: number;
      best_ao100: number;
      best_duration_l: string;
    };
    // wcu 赛事相关数据信息
    tournament_results: {
      avg: number;
      best_duration: number;
      create_time: number;
      cube_id: string;
      del_time: number;
      id: number;
      is_del: number;
      is_rise: number;
      name: string;
      on_off_line: number;
      p_id: number;
      p_name: string;
      phase: number;
      r1_duration: number;
      r1_scramble: string;
      r2_duration: number;
      r2_scramble: string;
      r3_duration: number;
      r3_scramble: string;
      r4_duration: number;
      r4_scramble: string;
      r5_duration: number;
      r5_scramble: string;
      record_id: number;
      result: number;
      t_id: number;
      tournament_name: string;
      user_id: number;
    }[];
    exchange_orders: {
      user_id: number;
      phone: string;
      address: string;
      order_state: number;
      consignee: string;
    }[];
    guild_member: {
      user_id: number;
      guild_id: number;
      duty: number;
      time: number;
      power: number;
    };
    guild: {
      id: number;
      status: number;
      name: string;
      level: number;
      declaration: string;
      notice: string;
      duration_need: number;
      qualifier_need: number;
      max_members: number;
      members: string;
      region_id: number;
      leader: number;
      sign: string;
      grade: number;
      count: number;
      power: number;
      time: number;
    };
  };
};

/* 当前可用前端数据结构 */
type correspondFEInterfaceType_userDetailDataPart = {
  gender: string;
  sex: string;
  id: number;
  nick_name: string;
  wcu_id: number;
  register_time: string;
  location: string;
  classroom: string;
  squad_name: string;
  phone: string;
  identity_info: {
    status: number;
    name: string;
    identity_number: string;
    phone: string;
    location: string;
  };
  points_count: number;
  voucher_count: number;
  binded_qq: string;
  binded_wechat: string;
  download_channel: string;
  login_channel_type: string;
  wca_authentication: any;
  online_time_count: number;
  last_login_time: string;
  last_logout_time: string;
  login_device_system: string;
  login_device_type: string;
  login_cpu_model: string;
  login_device_pixelRatio: string;
  binded_rubik_cube_model: string;
  mac_address: string;
  binding_time: string;
  unbinding_time: string;
};
type correspondFEInterfaceType_userRelatedDataType = {
  timed_race_data: {
    best_duration: number;
    completion_rate: string;
    current_ranking: number;
    highest_ranking: number;
    best_ao5_duration: number;
    best_ao12_duration: number;
    best_ao100_duration: number;
    completions_count: number;
  };
  t_rank_data: {
    monthly_highest_rank: number;
    monthly_rank: number;
    monthly_win_total: number;
    wins_total: number;
    lose_total: number;
    monthly_lose_total: number;
    draw_total: number;
    monthly_draw_total: number;
    highest_winning_streak: number;
    monthly_winning_streak: number;
    // 业务需讨论
    monthly_winned_cups: number;
    highest_winned_cups: number;
  };
  multi_race_speed_data: {
    participate_count: number;
    completions_count: number;
    best_ranking: number;
    best_ao5: number;
  };
  squad_info: {
    squad_id: number;
    squad_name: string;
    squad_level: number;
    squad_members_count: number;
    squad_max_merbers: number;
    self_title_in_team: string;
    squad_region: string;
    squad_combat_value: number;
    squad_combat_value_rank: number;
    self_combat_value: number;
    self_combat_value_rank: number;
    squad_join_time: string;
    squad_leaving_time: string;
  };
  pratice_task_info: {
    achievements_count: number;
    task_completions_count: number;
    practice_completions_count: number;
    cfop_formula_id: string;
  };
  wcu_t_data: {
    name: string;
    mode: number;
    p_name: string;
    rank: number;
    best_duration: number;
    avg_duration: number;
    rounds_duration_detail: string;
    update_date: string;
  }[];
  wca_t_data: {};
  account_info: {
    points_count: number;
    vocher_count: number;
    award_record_id: string;
  };
  order_info: {
    receiver_name: string;
    phone: string;
    order_status: number;
    receive_location: string;
  };
};

/* 真实数据获取与处理逻辑 */
const route = useRoute();

const refTabFor_competitionData = ref(0);
const refTabFor_tData = ref(0);
const refTabFor_accountInfo = ref(0);

const userStore = useUserStore();
const naiveMessage = useMessage();

// const userDetailData = ref()
// const userRelatedData = ref()

let userDetailDataTemp: Ref<
  correspondFEInterfaceType_userDetailDataPart | { [key: string]: any }
> = ref({});
let userRelatedDataTemp: Ref<
  correspondFEInterfaceType_userRelatedDataType | { [key: string]: any }
> = ref({});
const handleFetchUserDetailData = async () => {
  const { data: userDetailDataRaw, error } = await useFetch<
    currentBackendInterfaceType & {
      [key: string]: any;
    }
    // >(`/api_cors/dashboard/users/${route.params.id}`, {
  >(`/api/user/user_detail/${route.params.id}`, {
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
  // console.log(`output->userDetailDataRaw.value`, userDetailDataRaw.value);

  const resultNumberFormatter = (targetNumber: number) => {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(targetNumber);
  };

  if (userDetailDataRaw.value?.data) {
    const userDetailDataRawInfo = userDetailDataRaw.value
      .data as currentBackendInterfaceType["data"] & { [key: string]: any };
    userDetailDataTemp.value = {
      nick_name: (userDetailDataRawInfo.nickname ??= ""),
      wcu_id: (userDetailDataRawInfo.user_id ??= 0),
      register_time: (userDetailDataRawInfo.reg_time ??= 0),
      location:
        userDetailDataRawInfo.country &&
        userDetailDataRawInfo.province &&
        userDetailDataRawInfo.city
          ? userDetailDataRawInfo.country +
            userDetailDataRawInfo.province +
            userDetailDataRawInfo.city
          : "",
      classroom: (userDetailDataRawInfo.classroom ??= ""),
      squad_name: userDetailDataRawInfo.guild?.name ?? "",
      phone: (userDetailDataRawInfo.phone ??= ""),
      //暂无
      identity_info: {
        identity_status: "",
        identity_number: "",
        name: "",
        phone: "",
        location: "无",
      },
      points_count: (userDetailDataRawInfo.score ??= 0),
      voucher_count: (userDetailDataRawInfo.ticket ??= 0),
      /*
      业务问题需要讨论,去掉字段,如果接口结构没有提前定义好，前端就不该先行，
      前端 mock 数据完成视图先验的前提是接口结构已经定义好了，而接口结构定义好的前提是后端的业务逻辑确认完毕。
      否则在业务逻辑还没确立时建立起来的前端业务逻辑就会重新动工。
      */
      //  这里的默认值赋值，??= 会将默认值赋值给判定对象的对应属性值，如果出现
      binded_qq:
        userDetailDataRawInfo.oauth_type === 10
          ? userDetailDataRawInfo.oauth_json.name
          : "",
      binded_wechat:
        userDetailDataRawInfo.oauth_type === 10
          ? userDetailDataRawInfo.oauth_json.name
          : "",
      // 业务问题，字段对应业务逻辑不明确,可能需求不合理，或现有不支持这个问题
      online_time_count:
        userDetailDataRawInfo.last_logout_time &&
        userDetailDataRawInfo.last_login_time
          ? userDetailDataRawInfo.last_logout_time -
            userDetailDataRawInfo.last_login_time
          : 0,
      // 业务字典暂不明确
      login_channel_type: userDetailDataRawInfo.oauth_type
        ? userDetailDataRawInfo.oauth_type === 10
          ? "qq"
          : "暂缺业务字典"
        : "无",
      // 暂无
      login_device_type:
        userDetailDataRawInfo?.terminal?.type &&
        userDetailDataRawInfo.terminal.type === 1
          ? "安卓设备"
          : "暂无数据",
      login_cpu_model: userDetailDataRawInfo.terminal?.cpu ?? "",
      download_channel:
        (userDetailDataRawInfo.channel_id ??= -1) &&
        userDetailDataRawInfo.channel_id === -1
          ? "无"
          : "暂无业务字典",
      //暂无
      mac_address: "",
      //暂无
      binded_rubik_cube_model: "",
      // 暂无
      login_device_pixelRatio: "",
      // 暂无
      login_device_system: "",
      last_login_time: (userDetailDataRawInfo.last_login_time ??= 0),
      last_logout_time: (userDetailDataRawInfo.last_logout_time ??= 0),
      // 暂无
      binding_time: "",
      // 暂无
      unbinding_time: "",
    };

    userRelatedDataTemp.value = {
      timed_race_data: {
        best_ao5_duration:
          resultNumberFormatter(
            userDetailDataRawInfo.user_time_trial?.best_ao5
          ) ?? 0,
        best_ao12_duration:
          resultNumberFormatter(
            userDetailDataRawInfo.user_time_trial?.best_ao12
            // undefined
          ) ?? 0,
        best_ao100_duration:
          resultNumberFormatter(
            userDetailDataRawInfo.user_time_trial?.best_ao100
          ) ?? 0,
        best_duration:
          resultNumberFormatter(
            userDetailDataRawInfo.user_time_trial?.best_duration
          ) ?? 0,
        // 后端在文档中书写的不明确
        completion_rate: "",
        // 该字段及对应 UI 需要讨论
        current_ranking: "",
        // 需要与后端商讨，文档中后端声明这部分并不存在，但应该是能获取的
        highest_ranking: "",
        // 完成次数和完成率之间有歧义，需要讨论解决
        completions_count: "",
      },
      t_rank_data: {
        /*
        // 需要讨论字段及对应 UI 是否该存在
        monthly_highest_rank: 0,
        // 需要讨论字段及对应 UI 是否该存在
        monthly_rank: 0,
        monthly_win: userDetailDataRawInfo.user_qualifier?.win ?? 0,
        monthly_win_total: userDetailDataRawInfo.user_qualifier?.total_win ?? 0,
        monthly_draw: userDetailDataRawInfo.user_qualifier?.drawn ?? 0,
        monthly_draw_total:
          userDetailDataRawInfo.user_qualifier?.total_drawn ?? 0,
        monthly_lost: userDetailDataRawInfo.user_qualifier?.lose ?? 0,
        monthly_lose_total:
          userDetailDataRawInfo.user_qualifier?.total_lose ?? 0,
        monthly_winning_streak:
          userDetailDataRawInfo.user_qualifier?.win_streak ?? 0,
        // 后端字段表意错误
        // highest_winning_streak: userDetailDataRawInfo.user_qualifier?.total_win_streak,
        draw_total: userDetailDataRawInfo.user_qualifier?.total_drawn ?? 0,
        wins_total: userDetailDataRawInfo.user_qualifier?.total_win ?? 0,
        losses_total: userDetailDataRawInfo.user_qualifier?.total_lose ?? 0,
        // monthly_winned_cups: userDetailDataRawInfo.user_qualifier?.cup??0,
        // highest_winned_cups: userDetailDataRawInfo.user_qualifier?.max_cup ?? 0,
        */
        //  about_rank_data 暂不支持
        about_cup_data: `${userDetailDataRawInfo.user_qualifier?.cup} / ${userDetailDataRawInfo.user_qualifier?.max_cup}`,
        about_win_data: `${userDetailDataRawInfo.user_qualifier?.win} / ${userDetailDataRawInfo.user_qualifier?.total_win}`,
        about_lose_data: `${userDetailDataRawInfo.user_qualifier?.lose} / ${userDetailDataRawInfo.user_qualifier?.total_lose}`,
        about_draw_data: `${userDetailDataRawInfo.user_qualifier?.drawn} / ${userDetailDataRawInfo.user_qualifier?.total_drawn}`,
        about_winning_streak_data: `${userDetailDataRawInfo.user_qualifier?.win_streak} / ${userDetailDataRawInfo.user_qualifier?.total_win_streak}`,
      },
      multi_race_speed_data: {
        participate_count:
          userDetailDataRawInfo.user_comp_multi?.enter_num ?? 0,
        completions_count:
          userDetailDataRawInfo.user_comp_multi?.finish_num ?? 0,
        best_ranking: userDetailDataRawInfo.user_comp_multi?.best_rank ?? 0,
        best_ao5:
          resultNumberFormatter(
            userDetailDataRawInfo.user_comp_multi?.best_ao5
          ) ?? 0,
      },
      squad_info: {
        squad_id: userDetailDataRawInfo.guild?.id,
        squad_name: userDetailDataRawInfo.guild?.name,
        squad_level: userDetailDataRawInfo.guild?.level,
        squad_members_count: `${userDetailDataRawInfo.guild?.members.length} / ${userDetailDataRawInfo.guild?.max_members}`,
        self_title_in_team: userDetailDataRawInfo.guild_member?.duty,
        // 后端描述：客户端有自己的业务表。但前端没有，前端需要对应的业务字典
        squad_region: userDetailDataRawInfo.guild?.region_id,
        // 后端不支持排行，只展示战队战力值
        squad_combat_value_rank: `${userDetailDataRawInfo.guild?.power} /`,
        self_combat_value_rank: `${userDetailDataRawInfo.guild_member?.power} /`,
        // squad_combat_value: userDetailDataRawInfo.guild?.power,
        // self_combat_value: userDetailDataRawInfo.guild_member?.power,

        // 后端排名相关不该在此表出现
        // squad_combat_value_rank: userDetailDataRawInfo.guild
        // 后端排名相关不该在此表出现
        // self_combat_value_rank: userDetailDataRawInfo.guild_member
        squad_join_time: dayjs
          .unix(userDetailDataRawInfo.guild_member?.time)
          .format("YYYY-MM-DD HH:mm:ss"),
        // 后端暂不支持
        // squad_leaving_time: userDetailDataRawInfo.guild_member.
      },
      // 本部分后端均不支持
      pratice_task_info: {
        achievements_count: 0,
        task_completions_count: 0,
        cfop_formula_id: "",
        practice_completions_count: 0,
      },
      wcu_t_data: userDetailDataRawInfo.tournament_results.map((item) => {
        return {
          name: item.tournament_name,
          avg_duration: item.avg,
          best_duration: resultNumberFormatter(item.best_duration),
          p_name: item.p_name,
          rank: item.result,
          update_date: dayjs
            .unix(item.create_time)
            .format("YYYY-MM-DD HH:mm:ss"),
          mode: item.on_off_line,
          rounds_duration_detail: "",
          // 后端提供的 rn_duration 暂未发现，不清楚具体情况
          // rounds_duration_detail:
        };
      }),
      // 业务暂无
      wca_t_data: [],
      account_info: {
        points_count: userDetailDataRawInfo.score,
        vocher_count: userDetailDataRawInfo.ticket,
        // 后端暂未更新后端文档
        // award_record_id: userDetailDataRawInfo.
        // 拥有物品 id 字段功能不清晰
      },
      // 根据后端文档相关注解，
      order_info: userDetailDataRawInfo.exchange_orders.map((item) => {
        return {
          order_status: item.order_state,
          phone: item.phone,
          receive_location: item.address,
          receiver_name: item.consignee,
        };
      }),
    };
    // userDetailDataTemp = {
    // B 接口 对应字段名是 id，需要更改
    // user_id: userDetailDataRawInfo.user_id,
    // Part_One 对接
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
    // };
  }
};
await handleFetchUserDetailData();
let userDetailData = userDetailDataTemp;
let userRelatedData = userRelatedDataTemp;

/* 前端 mock 数据获取 */
// const { data: userDetailData } = await useFetch<{ [key: string]: any }>(
//   "/user_detail/1",
//   {
//     method: "GET",
//     server: false,
//   }
// );
// console.log(userDetailData.value);
// const { data: userRelatedData } = await useFetch<{ [key: string]: any }>(
//   "/user_related_data/1",
//   {
//     method: "get",
//     server: false,
//   }
// );
// console.log(userRelatedData.value);

/* 数据导出模块 */
//Raw[] ???
function convertXlsxKeys<Raw = any, Target = any>(
  excelData: {}[],
  keysMap: Record<string, string>
): Target[] {
  return excelData.map((excelItem) => {
    return Object.entries(excelItem).reduce((prevArr: any, currentArr: any) => {
      const [currentK, currentV] = currentArr;
      const mappedKey = keysMap[currentK];
      if (mappedKey) {
        prevArr[mappedKey] = currentV;
      } else {
        prevArr[currentK] = currentV;
      }
    }, {});
  });
}

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
const handleExportPlayerDetailData = () => {
  // console.log(1);
  if (userDetailData.value) {
    const sheetName = `Sheet1`;
    const fileName = `选手基础资料导出 - ${dayjs()
      .utc(true)
      .format("YYYY-MM-DD HH\:mm")
      .toString()}.xlsx`;
    exportExcelAsFileMethod(sheetName, fileName, [userDetailData.value]);
  }
};
const handleExportPlayerCompetitionData = () => {
  // console.log(2);
  if (userRelatedData.value) {
    const sheetName = `Sheet1`;
    const fileName = `选手竞赛数据导出 - ${dayjs()
      .utc(true)
      .format("YYYY-MM-DD HH:mm")
      .toString()}.xlsx`;
    exportExcelAsFileMethod(sheetName, fileName, [
      Object.assign(
        {},
        userRelatedData.value.timed_race_data,
        userRelatedData.value.t_rank_data,
        userRelatedData.value.multi_race_speed_data,
        userRelatedData.value.squad_info,
        userRelatedData.value.pratice_task_info
      ),
    ]);
  }
};
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

const exportStateTemp = {
  isExportPlayerDetailData: false,
  isExportPlayerCompetitionData: false,
  isExportPlayerTData: false,
  isExportPlayerAccountInfoData: false,
};
const exportStateObjRef = ref(structuredClone(exportStateTemp));
const correspondExportMethodObj: Record<string, () => void> = {
  isExportPlayerDetailData: handleExportPlayerDetailData,
  isExportPlayerCompetitionData: handleExportPlayerCompetitionData,
  // isExportPlayerTData: handleExportPlayerTData,
  // isExportPlayerAccountInfoData: handleExportPlayerAccountInfoData,
};
const handleExportModalClick = () => {
  ElMessageBox({
    // dangerouslyUseHTMLString: true,
    title: "选择导出",
    message: () =>
      h(
        "div",
        {
          class: "flex justify-between",
        },
        // [h('span', null, 1), h('span', null, 2)]
        [
          h(ElCheckbox, {
            modelValue: exportStateObjRef.value.isExportPlayerDetailData,
            "onUpdate:modelValue": (val: boolean | string | number) => {
              exportStateObjRef.value.isExportPlayerDetailData = val as boolean;
            },
            label: "基础资料",
          }),
          h(ElCheckbox, {
            modelValue: exportStateObjRef.value.isExportPlayerCompetitionData,
            "onUpdate:modelValue": (val: boolean | string | number) => {
              exportStateObjRef.value.isExportPlayerCompetitionData =
                val as boolean;
            },
            label: "竞赛数据",
          }),
          h(ElCheckbox, {
            modelValue: exportStateObjRef.value.isExportPlayerTData,
            "onUpdate:modelValue": (val: boolean | string | number) => {
              exportStateObjRef.value.isExportPlayerTData = val as boolean;
            },
            label: "赛事数据",
          }),
          h(ElCheckbox, {
            modelValue: exportStateObjRef.value.isExportPlayerAccountInfoData,
            "onUpdate:modelValue": (val: boolean | string | number) => {
              exportStateObjRef.value.isExportPlayerAccountInfoData =
                val as boolean;
            },
            label: "账户信息",
          }),
        ]
      ),
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    callback: (action: Action) => {
      if (action === "confirm") {
        Object.entries(exportStateObjRef.value).forEach(([key, value]) => {
          // console.log(key, value);
          if (value) {
            const excuteMethod = correspondExportMethodObj[key];
            if (excuteMethod) {
              excuteMethod();
            }
          }
        });
      }
    },
  });
};

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
          @click="handleExportModalClick"
          >导出数据</UButton
        >
      </div>
    </div>
    <div class="bg-#70708C text-white rounded-10px">
      <div class="pt-6 pb-9 px-9 mb-12">
        <div
          class="rounded-18px w-148px h-36px bg-primary_1 flex justify-center items-center text-23px"
        >
          ID:{{ userDetailData.wcu_id }}
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
                    userDetailData?.[item.key].identity_status === 1
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
                    <div
                      v-for="itemI in identity_info_detail_obj"
                      v-if="userDetailData?.[item.key].identity_status === 1"
                    >
                      {{ itemI.label }}：
                      <p>{{ userDetailData?.[item.key][itemI.key] }}</p>
                    </div>
                  </n-tooltip>
                </div>
              </span>
              <span v-if="item.key !== 'identity_info'">{{
                item.formatter
                  ? item.formatter(
                      userDetailData?.[
                        item.key as keyof correspondFEInterfaceType_userDetailDataPart
                      ]
                    )
                  : userDetailData?.[
                      item.key as keyof correspondFEInterfaceType_userDetailDataPart
                    ]
              }}</span>
            </span>
          </div>
          <div
            class="grid lg:grid-cols-2 2xl:grid-cols-4 py-7 gap-5 text-16px text-white"
          >
            <span v-for="item in user_detail_prefix_info_arr_part2">
              {{ item.attrLabel }}
              <span>{{
                userDetailData?.[
                  item.key as keyof correspondFEInterfaceType_userDetailDataPart
                ]
              }}</span>
            </span>
          </div>
          <div class="flex pt-7 flex-wrap gap-5">
            <!-- <div class="grid grid-cols-3 gap-5 text-16px text-white"> -->
            <div
              class="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3 text-16px text-white"
            >
              <span v-for="item in user_detail_prefix_info_arr_part3">
                {{ item.attrLabel }}
                <span>{{
                  userDetailData?.[
                    item.key as keyof correspondFEInterfaceType_userDetailDataPart
                  ]
                }}</span>
              </span>
            </div>
            <div class="grid gap-5 text-16px text-white">
              <span>
                <span>
                  {{ user_detail_prefix_info_arr_part4[0].attrLabel }} /
                  {{ user_detail_prefix_info_arr_part4[1].attrLabel }}
                </span>
                <span>
                  {{
                    userDetailData?.last_logout_time &&
                    user_detail_prefix_info_arr_part4[0].formatter
                      ? user_detail_prefix_info_arr_part4[0].formatter(
                          userDetailData?.last_login_time
                        )
                      : ""
                  }}
                  /
                  {{
                    userDetailData?.last_logout_time &&
                    user_detail_prefix_info_arr_part4[1].formatter
                      ? user_detail_prefix_info_arr_part4[1].formatter(
                          userDetailData?.last_logout_time
                        )
                      : ""
                  }}
                </span>
              </span>
              <span v-for="item in user_detail_prefix_info_arr_part5">
                {{ item.attrLabel }}
                <span>{{
                  userDetailData?.[
                    item.key as keyof correspondFEInterfaceType_userDetailDataPart
                  ]
                }}</span>
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
          <!-- 赛事相关数据是数组类型，不需要外套 []。 -->
          <n-data-table
            v-if="item.key === 'wcu_t_data'"
            :columns="columns_wcu_t_data()"
            :striped="true"
            :bordered="false"
            :data="userRelatedData?.[item.key]"
          >
            <!-- :data="[userRelatedData?.[item.key]]" -->
          </n-data-table>
          <n-data-table
            v-if="item.key === 'wca_t_data'"
            :columns="columns_wcu_t_data()"
            :striped="true"
            :bordered="false"
            :data="userRelatedData?.[item.key]"
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
            :data="userRelatedData?.[item.key]"
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
