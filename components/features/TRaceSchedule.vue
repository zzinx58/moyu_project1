<script setup lang="ts">
import dayjs from "dayjs";
// import { utc } from "dayjs";
import utc from "dayjs/plugin/utc";
import _ from "lodash";
import * as JSONPathPack from "jsonpath-plus";
const { JSONPath } = JSONPathPack;

dayjs.extend(utc);

const t_format_options = [
  {
    id: 3,
    label: "五次去头去尾取平均",
  },
  {
    id: 4,
    label: "三次取平均",
  },
  {
    id: 2,
    label: "三次取最快",
  },
  {
    id: 5,
    label: "两次取最快",
  },
  {
    id: 1,
    label: "单次",
  },
];
const projectItemList: {
  project_id: number;
  project_label: string;
  iconMeta: string;
}[] = [
  {
    project_id: 9,
    project_label: "智能三阶",
    iconMeta: "i-custom-svg:ai-third-order",
  },
  {
    project_id: 1,
    project_label: "三阶",
    iconMeta: "i-custom-svg:third-order",
  },
  {
    project_id: 3,
    project_label: "二阶",
    iconMeta: "i-custom-svg:second-order",
  },
  {
    project_id: 5,
    project_label: "四阶",
    iconMeta: "i-custom-svg:fourth-order",
  },
  {
    project_id: 10,
    project_label: "五阶",
    iconMeta: "i-custom-svg:fifth-order",
  },
  {
    project_id: 11,
    project_label: "六阶",
    iconMeta: "i-custom-svg:sixth-order",
  },
  {
    project_id: 12,
    project_label: "七阶",
    iconMeta: "i-custom-svg:seventh-order",
  },
  {
    project_id: 8,
    project_label: "三盲",
    iconMeta: "i-custom-svg:blindness-third-order",
  },
  {
    project_id: 18,
    project_label: "最少步",
    iconMeta: "i-custom-svg:minimal-steps",
  },
  {
    project_id: 7,
    project_label: "单手",
    iconMeta: "i-custom-svg:single-handedly",
  },
  {
    project_id: 19,
    project_label: "魔表",
    iconMeta: "i-custom-svg:magic-watch",
  },
  {
    project_id: 14,
    project_label: "五魔方",
    iconMeta: "i-custom-svg:megaminx",
  },
  {
    project_id: 2,
    project_label: "金字塔",
    iconMeta: "i-custom-svg:pyramid",
  },
  {
    project_id: 4,
    project_label: "斜转",
    iconMeta: "i-custom-svg:oblique-rotation",
  },
  {
    project_id: 13,
    project_label: "SQ1",
    iconMeta: "i-custom-svg:sq1",
  },
  {
    project_id: 15,
    project_label: "四盲",
    iconMeta: "i-custom-svg:blindness-fourth-order",
  },
  {
    project_id: 16,
    project_label: "五盲",
    iconMeta: "i-custom-svg:blindness-fifth-order",
  },
  {
    project_id: 17,
    project_label: "多盲",
    iconMeta: "i-custom-svg:multiple-blindness",
  },
];

const tableHeaderInfo: {
  label: string;
  key: string;
}[] = [
  {
    label: "时间",
    key: "time_range",
  },
  {
    label: "项目",
    key: "project_info_obj",
  },
  {
    label: "轮次",
    key: "current_rounds",
  },
  {
    label: "赛制",
    key: "t_format",
  },
  {
    label: "及格线",
    key: "passline",
  },
  {
    label: "还原时限",
    key: "reduction_limit",
  },
  {
    label: "晋级",
    key: "promotion_quota",
  },
];
/*
projects_detail 字段 json 对象中子字段含义注释：
reduction_limit，还原时限
rounds.detail[x].t_format, 赛制，如：三次取平均、三次取最快，这个和比赛详细规则的冲突？比赛详细规则用于描述自定义项目？
*/

/*
TRaceSchedule 赛程表字段头说明注释：
TRaceSchedule 作为 TDetailPreview 的子组件，其数据源从父组件处获取
通过解析 projects_detail json 对象数据获取所需内容

项目字段头：
获取 projects_detail 中 project 对象的 label 字段作为展示数据。

轮次字段头 - current_rounds：
需要根据配置表，将对应轮次转换为中文的轮次信息，如：初赛、复赛 等。

晋级字段头：晋级名额
决赛时可以为 0，为 0 可以不展示，这里需要赛事赛程表组件进行妥协，晋级名额为 0 时空白占位展示。
*/

/*
赛事赛程表实现思路：
需要从赛事对象 - tournament 上获取比赛持续时间中每日的日期相关数据，组成日展示分隔数据行
需要获取所有数据行的
还需要从赛事对象 - tournament，取出 award_time_range, signin_time_range, breaktime 与 lottery_time 字段，形成所需的行式单条轮次相关数据行。
- 需要将多层级结构的赛事项目详情对象 - project，进行降维，形成所需的行式单条轮次相关数据行。
- 休息时间数据行对象的 轮次 current_rounds 展示数据需要改为 公布晋级名单
- 颁奖的时间数据行对象的 轮次 current_rounds 展示数据需要改为 公布获奖名单

TODO：赛事创建处次要时间项的选择限制。

需要计算的各个数据行来源：
项目各比赛轮次数据行
签到时间数据行
休息时间数据行
抽奖时间数据行
颁奖时间数据行
*/

/*
Advanced：赛事时间相关项之间规则假定

赛事涉及的时间相关项：
比赛持续时间
报名时间
比赛轮次时间
签到时间
休息时间
抽奖时间
颁奖时间

制约关系：
- 报名时间不能晚于比赛持续时间的开始时间。
- 除了报名时间，所有时间都需要在比赛持续时间内进行排期。
*/

// Notice the unorder rules of obj.
const mockMainRowData: FinalRaceScheduleMainRowDataType[] = [
  {
    time_range: "8:30-9:00",
    project_info_obj: {
      iconMeta: "i-custom-svg:third-order",
      label: "三阶",
    },
    current_rounds: "初赛",
    t_format: "三次还原最快",
    passline: "60秒",
    reduction_limit: "3分钟",
    promotion_quota: "前30",
  },
  {
    time_range: "8:30-9:00",
    project_info_obj: {
      iconMeta: "i-custom-svg:third-order",
      label: "三阶",
    },
    current_rounds: "初赛",
    t_format: "三次还原最快",
    passline: "60秒",
    reduction_limit: "3分钟",
    promotion_quota: "前30",
  },
  {
    time_range: "8:30-9:00",
    project_info_obj: {
      iconMeta: "i-custom-svg:third-order",
      label: "三阶",
    },
    current_rounds: "初赛",
    t_format: "三次还原最快",
    passline: "60秒",
    reduction_limit: "3分钟",
    promotion_quota: "前30",
  },
  {
    time_range: "8:30-9:00",
    project_info_obj: {
      iconMeta: "i-custom-svg:third-order",
      label: "三阶",
    },
    current_rounds: "初赛",
    t_format: "三次还原最快",
    passline: "60秒",
    reduction_limit: "3分钟",
    promotion_quota: "前30",
  },
  {
    time_range: "8:30-9:00",
    project_info_obj: {
      iconMeta: "i-custom-svg:third-order",
      label: "三阶",
    },
    current_rounds: "初赛",
    t_format: "三次还原最快",
    passline: "60秒",
    reduction_limit: "3分钟",
    promotion_quota: "前30",
  },
  {
    time_range: "8:30-9:00",
    project_info_obj: {
      iconMeta: "i-custom-svg:third-order",
      label: "三阶",
    },
    current_rounds: "初赛",
    t_format: "三次还原最快",
    passline: "60秒",
    reduction_limit: "3分钟",
    promotion_quota: "前30",
  },
];
mockMainRowData.unshift({
  content: "第一天 星期六 (2023年07月08日)",
});

const calcRoundsName = (roundsTotal: number) => {
  switch (roundsTotal) {
    case 1:
      return ["决赛"];
    case 2:
      return ["初赛", "决赛"];
    case 3:
      return ["初赛", "复赛", "决赛"];
    case 4:
      return ["初赛", "复赛", "半决赛", "决赛"];
    case 5:
      return ["初赛", "复赛", "四分之一决赛", "半决赛", "决赛"];
  }
};

type FinalRaceScheduleMainRowDataType =
  | {
      time_range: string;
      project_info_obj: {
        iconMeta: string;
        label: string;
      };
      current_rounds?: string;
      t_format?: string;
      passline?: string;
      reduction_limit?: string;
      promotion_quota?: string;
    }
  | { content: string };

const props = defineProps<{
  t_info: any;
}>();

const organized_sigin_time_range =
  props.t_info.signin_time_range[0] === ""
    ? null
    : {
        time_range: props.t_info.signin_time_range,
        project_info_obj: {
          label: "签到",
        },
        current_rounds: "",
        t_format: "",
        passline: "",
        reduction_limit: "",
        promotion_quota: "",
      };
const organized_award_time_range =
  props.t_info.award_time_range[0] === ""
    ? null
    : {
        time_range: props.t_info.award_time_range,
        project_info_obj: {
          label: "颁奖",
        },
        current_rounds: "公布获奖名单",
        t_format: "",
        passline: "",
        reduction_limit: "",
        promotion_quota: "",
      };
const organized_break_time_data_arr =
  props.t_info.break_time[0].time_range[0] === ""
    ? null
    : (props.t_info.break_time as Array<any>).map((breakTimeItem, index) => {
        return {
          time_range: breakTimeItem.time_range,
          project_info_obj: {
            label: "休息",
          },
          current_rounds: "公布晋级名单",
          t_format: "",
          passline: "",
          reduction_limit: "",
          promotion_quota: "",
        };
      });
const organized_lottery_time_data_arr =
  props.t_info.lottery_time[0].time_range[0] === ""
    ? null
    : (props.t_info.break_time as Array<any>).map((lotteryTimeItem, index) => {
        return {
          time_range: lotteryTimeItem.time_range,
          project_info_obj: {
            label: "抽奖",
          },
          current_rounds: "公布抽奖名单",
          t_format: "",
          passline: "",
          reduction_limit: "",
          promotion_quota: "",
        };
      });

// {
//     time_range: "8:30-9:00",
//     project_info_obj: {
//       iconMeta: "i-custom-svg:third-order",
//       label: "三阶",
//     },
//     current_rounds: "初赛",
//     t_format: "三次还原最快",
//     passline: "60秒",
//     reduction_limit: "3分钟",
//     promotion_quota: "前30",
//   },

const organized_projects_detail_data_arr = (
  props.t_info.projects_detail as Array<any>
).map((projectItem, index) => {
  const currentProjectItemRaceScheduleTotalRounds = projectItem.rounds.total;
  const currentProjectItemRoundNamesArr = calcRoundsName(
    currentProjectItemRaceScheduleTotalRounds
  );
  // Notice the type error.
  // Notice the attrs order!!
  const result = (projectItem.rounds.detail as Array<any>).map(
    (roundItem, index): FinalRaceScheduleMainRowDataType => {
      const roundItemTimeRangeArr = JSONPath({
        path: "$.time_range.*",
        json: roundItem,
      });
      return {
        time_range: roundItemTimeRangeArr ?? "",
        project_info_obj: {
          iconMeta: projectItem.iconMeta ?? "",
          label: projectItem.label ?? "",
        },
        current_rounds: currentProjectItemRoundNamesArr![index] ?? "",
        t_format:
          t_format_options.find((item) => item.id === roundItem.t_format)
            ?.label ?? "",
        passline: (projectItem.passline ?? "") + "秒",
        // Needed handle at create page.
        reduction_limit:
          ((projectItem.reduction_limit / 60).toFixed(2) ?? "") + "分钟",
        promotion_quota:
          roundItem.promotion_quota === 0
            ? ""
            : "前" + roundItem.promotion_quota,
      };
    }
  );
  return result;
});

const raw_main_row_data_arr = [
  organized_sigin_time_range,
  organized_award_time_range,
  organized_break_time_data_arr,
  organized_lottery_time_data_arr,
  organized_projects_detail_data_arr,
].filter((item) => item !== null);
const organized_main_row_data_arr = _.flatMapDeep(
  raw_main_row_data_arr as Array<any>
);

// StartDate oriented sorting.
const sorted_main_row_data_arr = organized_main_row_data_arr.sort(
  (A, B) => A.time_range[0] - B.time_range[0]
);

const final_main_row_data_arr = sorted_main_row_data_arr.map((item) => {
  // 'YYYY年MM月DD日 HH:mm:ss'
  const dayFormatFunc = (time_range: ["", ""]) => {
    return `${dayjs.unix(item.time_range[0]).utc(true).format("HH:mm")}-${dayjs
      .unix(item.time_range[1])
      .utc(true)
      .format("HH:mm")}`;
  };
  return {
    ...item,
    time_range: dayFormatFunc(item.time_range),
  };
});

// const final_schedule_date_row_data = {};
// {
//   content: "第一天 星期六 (2023年07月08日)",
// }
// Cool to learn.!!
const itemDay = (
  itemWithTimeRange: { time_range: ["", ""] } & Record<string, any>
) => {
  const itemDay = dayjs.unix(+itemWithTimeRange.time_range[0]).utc(true).day();
  switch (itemDay) {
    case 0:
      return "星期天";
    case 1:
      return "星期一";
    case 2:
      return "星期二";
    case 3:
      return "星期三";
    case 4:
      return "星期四";
    case 5:
      return "星期五";
    case 6:
      return "星期六";
    default:
      return "item 时间信息缺失";
  }
};
const test = () => {
  //Notice format resolve, about '-'.
  const finalDayHaveRacesArr = sorted_main_row_data_arr
    .map((item) => {
      return {
        time_range: item.time_range,
        // Use of the format.
        // content: dayjs.unix(item.time_range[0]).utc(true).format("YYYY-MM-DD"),
        content:
          itemDay(item) +
          " " +
          dayjs.unix(item.time_range[0]).utc(true).format("YYYY年MM月DD日"),
      };
    })
    .filter((valueObj, index, self) => {
      const currentIndex = self.findIndex(
        (item) => item.content === valueObj.content
      );
      return currentIndex === index;
    });

  const dayGroupMainRowItems = finalDayHaveRacesArr.map(
    (groupLeadDay, index) => {
      // const groupLeadDayTimeStamp = dayjs(+groupLeadDay.time_range[0]).unix();
      const filteredItems = sorted_main_row_data_arr.filter(
        (item, index, selfArr) => {
          return (
            dayjs.unix(+item.time_range[0]).utc(true).format("YYYY-MM-DD") ===
            dayjs
              .unix(+groupLeadDay.time_range[0])
              .utc(true)
              .format("YYYY-MM-DD")
          );
        }
      );
      return filteredItems;
    }
  );

  const dayGroupedRowItems = dayGroupMainRowItems.map((item, index) => {
    item.unshift(finalDayHaveRacesArr[index]);
    item = item.map((itemB: any) => {
      return {
        ...itemB,
        time_range: `${dayjs
          .unix(+itemB.time_range[0])
          .utc(true)
          .format("HH:mm")}-${dayjs
          .unix(+itemB.time_range[1])
          .utc(true)
          .format("HH:mm")}`,
      };
    });
    // console.log(item);
    return item;
  });

  // console.log("dayGroupMainRowItems:", dayGroupMainRowItems);
  // console.log("dayGroupedRowItems:", dayGroupedRowItems);
  return dayGroupedRowItems;
};
const test2 = test();

type DayGroupRowDatasType = {
  dayGroupRowData: FinalRaceScheduleMainRowDataType[];
  current_index: number;
};
const [DefineDayGroupRowDatasTable, DayGroupRowDatasTable] =
  createReusableTemplate<DayGroupRowDatasType>();
const numberToDayCalc = (numberOfDay: number) => {
  switch (numberOfDay) {
    case 0:
      return "一";
    case 1:
      return "二";
    case 2:
      return "三";
    case 3:
      return "四";
    case 4:
      return "五";
    case 5:
      return "六";
    case 6:
      return "七";
    case 7:
      return "八";
    case 8:
      return "九";
    case 9:
      return "十";
    case 10:
      return "十一";
    default:
      return "number error.";
  }
};
</script>
<template>
  <DefineDayGroupRowDatasTable v-slot="{ dayGroupRowData, current_index }">
    <td
      class="text-center text-20px leading-44px odd:bg-#F1F2FD even:bg-#FFFFFF"
      :colspan="tableHeaderInfo.length"
    >
      第{{ numberToDayCalc(current_index) }}天
      {{ (dayGroupRowData[0] as any).content }}
    </td>
    <div
      class="table-row h-32px odd:bg-#F1F2FD even:bg-#FFFFFF"
      v-for="RowItemDataObj in dayGroupRowData.slice(1)"
    >
      <div
        v-for="(item, key) in RowItemDataObj"
        class="table-cell text-center text-14px leading-32px"
      >
        <div
          v-if="key === 'project_info_obj'"
          class="flex justify-center items-center gap-2"
        >
          <div
            v-if="(item as any).iconMeta"
            :class="(item as any).iconMeta"
          ></div>
          <p class="">{{ (item as any).label }}</p>
        </div>
        <div v-else>{{ item }}</div>
      </div>
    </div>
  </DefineDayGroupRowDatasTable>
  <div class="table w-full text-#6F6F8B bg-#FFFFFF">
    <!-- table-header -->
    <div class="table-header-group">
      <div class="table-row h-32px">
        <div
          class="table-cell text-center text-16px leading-32px font-bold"
          v-for="item in tableHeaderInfo"
        >
          <div>
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <!-- table-row-group -->
    <div class="table-row-group">
      <!-- <DayGroupRowDatasTable :day-group-row-data="mockMainRowData" /> -->
      <DayGroupRowDatasTable
        v-for="(dayGroupItem, currentIndex) in test2"
        :day-group-row-data="dayGroupItem"
        :current_index="currentIndex"
      />
    </div>
  </div>
  <!-- table -->
  <!-- <hr class="my-10" /> -->
  <!-- test -->
  <!-- <pre>{{ final_main_row_data_arr }}</pre> -->
</template>
<style lang="scss" scoped></style>
