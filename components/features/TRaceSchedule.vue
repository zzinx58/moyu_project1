<script setup lang="ts">
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
    key: "project_label",
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
-
*/

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

const props = defineProps<{
  time_range_related_obj: {
    apply_time_range: [string, string];
    tournament_during_time_range: [string, string];
    signin_time_range: [string, string];
    award_time_range: [string, string];
    breaktime_jsonObj: {
      id: number;
      time_range: [string, string];
    }[];
    lottery_time_range: {
      id: number;
      time_range: [string, string];
    }[];
    project_details_jsonObj: Record<string, any>;
  };
}>();
</script>
<template></template>
<style lang="scss" scoped></style>
