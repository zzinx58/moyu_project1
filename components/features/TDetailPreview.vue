<script setup lang="ts">
import dayjs from "dayjs";

//satisfies ts 字段：本配置表字段后期可能动态增加，可以不用动态写死 type，通过 satisfies 可以获取动态类型提示
const t_detail_prefix_info: {
  [key: string]: {
    iconMeta: string;
    attrLabel: string;
    formatter?: (
      content: any
    ) => string | { isOutLink: boolean; web_url: string };
  };
} = {
  organizer: {
    iconMeta: "i-custom-svg:d-t-organizer",
    attrLabel: "主办方",
  },
  apply_web_url: {
    iconMeta: "i-custom-svg:d-t-apply-weburl",
    attrLabel: "报名链接",
    formatter: (web_url: string) => ({
      isOutLink: true,
      web_url: web_url,
    }),
  },
  location: {
    iconMeta: "i-custom-svg:d-t-location",
    attrLabel: "地点",
  },
  //Bug 点
  //name:
  mode: {
    iconMeta: "i-custom-svg:d-t-mode",
    attrLabel: "比赛模式",
    formatter: (mode: Record<string, any>) => {
      // debugger;
      return mode.label;
    },
  },
  groups: {
    iconMeta: "i-custom-svg:d-t-groups",
    attrLabel: "组别",
  },
  apply_condition: {
    iconMeta: "i-custom-svg:d-t-apply-conditions",
    attrLabel: "报名条件",
  },
  organizer_web_url: {
    iconMeta: "i-custom-svg:d-t-weburl",
    attrLabel: "主办方网站",
    formatter: (web_url: string) => ({
      isOutLink: true,
      web_url: web_url,
    }),
  },
  apply_time_range: {
    iconMeta: "i-custom-svg:d-t-apply-time-range",
    attrLabel: "报名截止日期",
    formatter: (time_range: [string, string]) => {
      //Bug 点
      if (time_range) {
        return `${dayjs.unix(+time_range[0]).format("YYYY年MM月DD日")}-${dayjs
          .unix(+time_range[1])
          .format("MM月DD日")}`;
      } else {
        // return "赛事未设置报名截止日期";
        return "";
      }
    },
  },
  time_range: {
    iconMeta: "i-custom-svg:d-t-time-range",
    attrLabel: "比赛时间",
    formatter: (time_range: [string, string]) => {
      if (time_range) {
        if (
          dayjs.unix(+time_range[0]).diff(dayjs.unix(+time_range[1]), "day") <=
          1
        ) {
          return `${dayjs.unix(+time_range[0]).format("YYYY年MM月DD日")}`;
        }
        if (
          dayjs.unix(+time_range[0]).year() !==
          dayjs.unix(+time_range[1]).year()
        ) {
          return `${dayjs.unix(+time_range[0]).format("YYYY年MM月DD日")}-${dayjs
            .unix(+time_range[1])
            .format("YYYY年MM月DD日")}`;
        }
        return `${dayjs.unix(+time_range[0]).format("YYYY年MM月DD日")}-${dayjs
          .unix(+time_range[1])
          .format("MM月DD日")}`;
      } else {
        // return "赛事未设置比赛时间";
        return "";
      }
    },
  },
  type: {
    iconMeta: "i-custom-svg:d-t-type",
    attrLabel: "比赛类型",
    formatter: (typeObj: { id: number; label: string }) => {
      return typeObj.label;
    },
  },
  projects: {
    iconMeta: "i-custom-svg:d-t-projects",
    attrLabel: "比赛项目",
  },
  apply_quota: {
    iconMeta: "i-custom-svg:d-t-apply-quota",
    attrLabel: "报名名额",
    formatter: (apply_quota: number) => {
      return `${apply_quota}人`;
    },
  },
};
// satisfies {
//   [key: string]: {
//     iconMeta: string;
//     attrLabel: string;
//   };
// };

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

const [DefineDetailPrefixTemplate, DetailPrefixTemplate] =
  createReusableTemplate<BaseDetailPrefixUIType>();
type AdvanceDetailPrefixType = Partial<{
  iconMeta: string;
  labelText: string;
  wrapperClass: string;
  labelClass: string;
  infoObj: Partial<{
    [key: string]: string | undefined;
    label: string;
    iconMeta: string;
  }>;
  "label-attribute-name": string;
  "iconMeta-attribute-name": string;
}>;
type BaseDetailPrefixUIType = Partial<{
  iconMeta: string;
  labelText: string;
  wrapperClass: string;
  labelClass: string;
  content: string | { isOutLink: boolean; web_url: string };
  contentClass: string;
  containerClass: string;
  ui: { wrapper: string; label: string; [key: string]: any };
  //没有类型声明也是可以访问的，只要属性存在。
  // ui: { wrapper: string; label: string; container: string; [key: string]: any };
}>;

const DetailPrefixUIPreset: BaseDetailPrefixUIType["ui"] = {
  container: "flex text-white items-center",
  wrapper: "flex items-center text-18px mr-3 gap-2",
  label: "font-bold",
  // content: 'text-16px leading-20px',
  content: "text-16px leading-20px whitespace-pre-wrap",
};

const props = defineProps<{
  t_info_data: any;
}>();
const display_infoData = toRef(props.t_info_data);

function isValidURL(str: string) {
  if (typeof str === "string") {
    return str.startsWith("https://");
  } else return false;
}
const tDetailInfoTemplateObjArr = () => {
  const resultArr: {
    iconMeta: string;
    attrLabel: string;
    attrContent: string | { isOutLink: boolean; web_url: string };
  }[] = [];
  //按规范，最好是顺序数组，而不是动态获取对象的顺序键。
  const templateKeysArr = Object.keys(t_detail_prefix_info);
  for (const key of templateKeysArr) {
    if (display_infoData.value.hasOwnProperty(key)) {
      const currentKeyFormatter = t_detail_prefix_info[key].formatter;
      resultArr.push({
        iconMeta: t_detail_prefix_info[key].iconMeta,
        attrLabel: t_detail_prefix_info[key].attrLabel,
        attrContent: currentKeyFormatter
          ? currentKeyFormatter(display_infoData.value[key])
          : display_infoData.value[key],
      });
    }
  }
  return resultArr;
};
const tDetailInfoObjArr = tDetailInfoTemplateObjArr();
// console.log('detailObjArr:', tDetailInfoObjArr);

const raw_tournament_state = [
  {
    id: 1,
    label: "报名未开始",
    color: "bg-#F19EC2",
  },
  {
    id: 2,
    label: "报名中",
    color: "bg-#88ABDA",
  },
  {
    id: 3,
    label: "报名已结束 比赛未开始",
    color: "bg-#89C997",
  },
  {
    id: 4,
    label: "比赛中",
    color: "bg-#F29B76",
  },
  {
    id: 5,
    label: "比赛已结束 未公示",
    color: "bg-#8F82BC",
  },
  {
    id: 6,
    label: "比赛已结束 公示中",
    color: "bg-#535353",
  },
];
//BUG 点，dayjs 获取当前时间的秒时间戳不需要进行 utc(true) 转换。
const currentTimeUnix = dayjs().utc(false).unix();
// const currentTimeUnix = dayjs().utc(true).unix();
function isValidTimeRange(time_range: [string, string] | null) {
  return (
    time_range !== null &&
    Array.prototype.includes.call(time_range, "") === false
  );
}
const calcStatus = (
  currentTimeUnix: number,
  apply_time_range: [string, string],
  time_range: [string, string]
) => {
  if (isValidTimeRange(time_range) && isValidTimeRange(apply_time_range)) {
    switch (true) {
      case currentTimeUnix < +apply_time_range[0]:
        return raw_tournament_state[0];
      case currentTimeUnix > +apply_time_range[0] &&
        currentTimeUnix < +apply_time_range[1]:
        return raw_tournament_state[1];
      case currentTimeUnix > +apply_time_range[1] &&
        currentTimeUnix < +time_range[0]:
        return raw_tournament_state[2];
      case currentTimeUnix > +time_range[0] && currentTimeUnix < +time_range[1]:
        return raw_tournament_state[3];
      case currentTimeUnix > +time_range[1]:
        return {
          id: 5,
          // label: "比赛结束，公示错误:字段暂未给出",
          label: "比赛结束",
          color: "#535353",
        };
    }
  }
};
</script>
<template>
  <!-- <pre>{{ props.t_info_data }}</pre> -->
  <DefineDetailPrefixTemplate
    v-slot="{
      iconMeta,
      labelText,
      wrapperClass,
      labelClass,
      ui,
      content,
      contentClass,
      containerClass,
    }"
  >
    <div :class="`${containerClass ? containerClass : ui?.container}`">
      <div :class="`${wrapperClass ? wrapperClass : ui?.wrapper}`">
        <div :class="`${iconMeta}`" />
        <label :class="`${labelClass ? labelClass : ui?.label}`">{{
          labelText
        }}</label>
      </div>
      <NuxtLink
        v-if="
          content &&
          typeof content === 'object' &&
          content.isOutLink &&
          content.isOutLink === true
        "
        class="underline underline-offset-2"
        :target="'_blank'"
        title="外链网页链接"
        :href="`${
          content.web_url && isValidURL(content.web_url)
            ? content.web_url
            : `/t_list`
        }`"
        >{{
          content.web_url && isValidURL(content.web_url) // : `链接不合规，请重新核查`
            ? content.web_url
            : ``
        }}</NuxtLink
      >
      <p v-else :class="`${contentClass ? contentClass : ui?.content}`">
        {{ content }}
      </p>
    </div>
  </DefineDetailPrefixTemplate>
  <!--  -->
  <div class="bg-#6F6F8B pt-5 pl-8 pb-10 pr-15px rounded-10px min-w-740px">
    <div class="flex mb-6">
      <h1
        class="text-30px leading-30px text-white mr-2 h-42px flex items-center"
      >
        {{ t_info_data.name }}
      </h1>
      <span class="flex items-end mb-1.5">
        <!-- <UBadge :class="`text-14px bg-red h-20px`">{{ `报名中` }}</UBadge> -->
        <UBadge
          :class="`text-14px bg-${
            calcStatus(
              currentTimeUnix,
              props.t_info_data.apply_time_range,
              props.t_info_data.time_range
            )?.color ?? '#000'
          } h-20px`"
          >{{
            `${
              calcStatus(
                currentTimeUnix,
                props.t_info_data.apply_time_range,
                props.t_info_data.time_range
              )?.label ?? ""
            }`
          }}</UBadge
        >
      </span>
    </div>
    <!-- <div class="grid grid-cols-2 grid-rows-6 gap-3 grid-flow-col"> -->
    <div class="grid gap-3 lg:grid-cols-2 lg:grid-rows-6 lg:grid-flow-col">
      <DetailPrefixTemplate
        v-for="(item, index) in tDetailInfoObjArr"
        :icon-meta="item.iconMeta"
        :label-text="item.attrLabel"
        :content="item.attrContent"
        :ui="DetailPrefixUIPreset"
      />
    </div>
    <!--  -->
    <div class="grid gap-3 lg:grid-cols-2 mt-3">
      <div class="flex-1">
        <DetailPrefixTemplate
          :label-text="`比赛规则`"
          :icon-meta="`i-custom-svg:d-t-rules`"
          :ui="DetailPrefixUIPreset"
        />
        <div :class="`whitespace-pre-wrap flex flex-col gap-2 ml-7 mt-2`">
          <DetailPrefixTemplate
            v-for="(item, index) in display_infoData.projects_detail"
            :key="item.id"
            :iconMeta="item.iconMeta"
            :content="item.rule_content"
            :label-text="`${item.label}魔方分为${calcRoundsName(
              item.rounds.total
            )?.join('-')}`"
            :wrapper-class="`flex space-x-3 font-bold items-center text-16px`"
            :content-class="`ml-7 mt-2 text-14px`"
            :container-class="`text-white`"
            :style="{ 'text-wrap': 'balance' }"
          />
        </div>
      </div>
      <div class="">
        <DetailPrefixTemplate
          :label-text="`赛程`"
          :icon-meta="`i-custom-svg:d-t-schedule`"
          :ui="DetailPrefixUIPreset"
        />
        <FeaturesTRaceSchedule :t_info="props.t_info_data" />
      </div>
    </div>
  </div>

  <!-- <pre>{{ props.t_info_data }}</pre> -->
</template>
<style lang="scss" scoped></style>
