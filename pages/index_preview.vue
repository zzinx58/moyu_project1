<script setup lang="ts">
import { Column, Line, Area, Mix, line } from "@antv/g2plot";
import { Choropleth } from "@antv/l7plot";
import _ from "lodash";

const preview_prefix_info: {
  iconMeta: string;
  attrLabel: string;
  key: string;
  formatter?: () => any;
}[] = [
  {
    attrLabel: "总注册数",
    iconMeta: "i-custom-svg:p-total-registered",
    key: "total_registered",
  },
  {
    attrLabel: "新增注册",
    iconMeta: "i-custom-svg:p-new-registered-per-day",
    key: "new_registered_per_day",
  },
  {
    attrLabel: "日均在线",
    iconMeta: "i-custom-svg:p-avg-online-per-day",
    key: "avg_online_per_day",
  },
  {
    attrLabel: "激活魔方",
    iconMeta: "i-custom-svg:p-total-activated-cubes",
    key: "total_activated_rubik_cubes",
  },
  {
    attrLabel: "已有战队",
    iconMeta: "i-custom-svg:p-total-teams",
    key: "total_existed_team",
  },
  {
    attrLabel: "新增战队",
    iconMeta: "i-custom-svg:p-new-teams-per-day",
    key: "new_team_per_day",
  },
  {
    attrLabel: "竞赛累积",
    iconMeta: "i-custom-svg:p-total-competitions",
    key: "total_competitions",
  },
  {
    attrLabel: "赛事人数",
    iconMeta: "i-custom-svg:p-total-competition-players",
    key: "total_competition_players",
  },
];

const resultNumberFormatter = (targetNumber: number) => {
  return new Intl.NumberFormat(undefined, {
    // maximumFractionDigits: 2,
    // minimumFractionDigits: 2,
  }).format(targetNumber);
};

const { data } = await useFetch<{ [key: string]: any }>(
  "/index_preview_part1",
  {
    server: false,
    method: "GET",
  }
);
const { data: testData3 } = await useFetch<Array<any>>(
  "/index_preview_part_column",
  {
    server: false,
    method: "GET",
  }
);
const mixedData3 = testData3.value
  ? ref([...toRaw(testData3.value[0]), ...toRaw(testData3.value[1])])
  : ref([]);
const { data: lineDataRaw } = await useFetch<Array<any>>(
  "/index_preview_part_line",
  {
    method: "GET",
    server: false,
  }
);
// console.log(`output->lineDataRaw.value`, lineDataRaw.value);

const [DefineDailyOnlineChart, DailyOnlineChartTemp] = createReusableTemplate();
const [DefineWeeklyOnlineChart, WeeklyOnlineChartTemp] =
  createReusableTemplate();

const isShowDailyOnline = ref(true);
const handleDailyOnlineChartOpen = () => {
  isShowDailyOnline.value = !isShowDailyOnline.value;
};
let weeklyOnlineChartSaver = 0;
const handleWeeklyOnlineChartOpen = () => {
  isShowDailyOnline.value = !isShowDailyOnline.value;
  nextTick(() => {
    initWeeklyOnlineChart();
  });
};

const initDailyOnlineChart = () => {
  new Area("daily-online-chart", {
    data: (lineDataRaw.value ??= []),
    height: 280, //285px,480 - 163 - 32
    xField: "datetime",
    yField: "value",
    smooth: true,
    color: "#FF8F6B",
    //Area 无法生成图例？

    //Bug. animation makes linedash fail.
    // animation: {
    //   appear: {
    //     animation: "path-in",
    //     duration: 3000,
    //   },
    // },
    tooltip: {
      fields: ["value"],
      title: "峰值",
      crosshairs: {
        line: {
          style: {
            stroke: "#FF8F6B",
            lineDash: [15, 15, 15],
          },
        },
      },
    },
  }).render();
};
// const initWeeklyOnlineChartColumnOnly = () => {
// new Column("weekly-online-chart", {
//   data: mixedData3.value.flat(),
//   xField: "date",
//   yField: "value",
//   seriesField: "type",
//   isGroup: true,
//   height: 280, //285px,480 - 163 - 32
//   color: ["#FF9370", "#70708C"].reverse(),
//   legend: {
//     position: "top-right",
//     itemName: {
//       style: {
//         fontSize: 14,
//       },
//     },
//     marker: (name, index, item) => {
//       return {
//         symbol: "line",
//         style: {
//           lineWidth: 28,
//           lineHeight: 6,
//           stroke: index === 1 ? "#FF9370" : "#70708C",
//         },
//       };
//     },
//     // 图例标题
//     //   title: {
//     //     spacing: 0,
//     //     text: "123",
//     //   },
//     // 图例 label 的样式
//     // 图例 icon/marker 的样式
//     //   marker: {
//     //     symbol: "square",
//     //     style: {
//     //       // fill: "green",
//     //       //   width: 28,
//     //       //   height: 100,
//     //       //为什么只有 r 能改变 marker 长度？
//     //       //   r: 10,
//     //     },
//     //   },
//   },
// }).render();
// }
const initWeeklyOnlineChartRaw = (containerName: string) => {
  const plot = new Mix(containerName, {
    // height: 280,
    height: 360,
    syncViewPadding: true,
    legend: {
      //@ts-ignore
      position: "top-right",
      marker: {
        symbol: "hyphen",
        style: {
          lineCap: "round",
          r: 12,
          lineWidth: 6,
        },
      },
      //@ts-ignore
      itemHeight: 80,
    },
  });
  plot.update({
    plots: [
      {
        type: "line",
        options: {
          data: (lineDataRaw.value ??= []),
          xField: "datetime",
          yField: "value",
          xAxis: false,
          yAxis: false,
          smooth: true,
          tooltip: false,
          color: "#FF8F6B",
          //Bug. animation makes linedash fail.
          // animation: {
          //   appear: {
          //     animation: "path-in",
          //     duration: 3000,
          //   },
          // },
          lineStyle: {
            lineDash: [4, 4],
          },
        },
      },
      {
        type: "column",
        options: {
          data: mixedData3.value.flat(),
          xField: "date",
          yField: "value",
          seriesField: "type",
          isGroup: true,
          color: ["#FF9370", "#70708C"].reverse(),
          // legend: {
          //   position: "top-right",
          //   itemName: {
          //     style: {
          //       fontSize: 14,
          //     },
          //   },
          //   marker: (name, index, item) => {
          //     return {
          //       symbol: "line",
          //       style: {
          //         lineWidth: 28,
          //         lineHeight: 6,
          //         stroke: index === 1 ? "#FF9370" : "#70708C",
          //       },
          //     };
          //   },
          // },
        },
      },
    ],
  });
  plot.render();
};
const initWeeklyOnlineChart = () => {
  if (!weeklyOnlineChartSaver) initWeeklyOnlineChartRaw("weekly-online-chart");
  weeklyOnlineChartSaver = 1;
};

const { data: ChoroplethData } = await useFetch("/getPart1Choropleth", {
  method: "GET",
  server: false,
});
// console.log(`output->ChoroplethData.value`, ChoroplethData.value);

const ProvinceData = [
  {
    name: "云南省",
    code: 530000,
    value: 17881.12,
  },
  {
    name: "黑龙江省",
    code: 230000,
    value: 16361.62,
  },
  {
    name: "贵州省",
    code: 520000,
    value: 14806.45,
  },
  {
    name: "北京市",
    code: 110000,
    value: 30319.98,
  },
  {
    name: "河北省",
    code: 130000,
    value: 36010.27,
  },
  {
    name: "山西省",
    code: 140000,
    value: 16818.11,
  },
  {
    name: "吉林省",
    code: 220000,
    value: 15074,
  },
  {
    name: "宁夏回族自治区",
    code: 640000,
    value: 3705.18,
  },
  {
    name: "辽宁省",
    code: 210000,
    value: 25315.35,
  },
  {
    name: "海南省",
    code: 460000,
    value: 4832.05,
  },
  {
    name: "内蒙古自治区",
    code: 150000,
    value: 17289.22,
  },
  {
    name: "天津市",
    code: 120000,
    value: 18809.64,
  },
  {
    name: "新疆维吾尔自治区",
    code: 650000,
    value: 12199.08,
  },
  {
    name: "上海市",
    code: 310000,
    value: 32679.87,
  },
  {
    name: "陕西省",
    code: 610000,
    value: 24438.32,
  },
  {
    name: "甘肃省",
    code: 620000,
    value: 8246.07,
  },
  {
    name: "安徽省",
    code: 340000,
    value: 30006.82,
  },
  {
    name: "香港特别行政区",
    code: 810000,
    value: 0,
  },
  {
    name: "广东省",
    code: 440000,
    value: 97277.77,
  },
  {
    name: "河南省",
    code: 410000,
    value: 48055.86,
  },
  {
    name: "湖南省",
    code: 430000,
    value: 36425.78,
  },
  {
    name: "江西省",
    code: 360000,
    value: 21984.78,
  },
  {
    name: "四川省",
    code: 510000,
    value: 40678.13,
  },
  {
    name: "广西壮族自治区",
    code: 450000,
    value: 20353.51,
  },
  {
    name: "江苏省",
    code: 320000,
    value: 92595.4,
  },
  {
    name: "澳门特别行政区",
    code: 820000,
    value: null,
  },
  {
    name: "浙江省",
    code: 330000,
    value: 56197.15,
  },
  {
    name: "山东省",
    code: 370000,
    value: 76469.67,
  },
  {
    name: "青海省",
    code: 630000,
    value: 2865.23,
  },
  {
    name: "重庆市",
    code: 500000,
    value: 20363.19,
  },
  {
    name: "福建省",
    code: 350000,
    value: 35804.04,
  },
  {
    name: "湖北省",
    code: 420000,
    value: 39366.55,
  },
  {
    name: "西藏自治区",
    code: 540000,
    value: 1477.63,
  },
  {
    name: "台湾省",
    code: 710000,
    value: null,
  },
];

const initRegionalDistribution = () => {
  //9.20
  new Choropleth("regional-distrubution", {
    height: 400,
    // width: 365, //749-80-177-28 = 464
    width: 464,
    map: {
      type: "amap",
      style: "blank",
      // style: "light",
      // style: "normal",
      // token: "",
      center: [120.19382669582967, 30.258134],
      zoom: 3,
      pitch: 0,
    },
    source: {
      // data: (ChoroplethData.value ??= [] as any),
      data: ProvinceData,
      joinBy: {
        sourceField: "code",
        geoField: "adcode",
      },
    },
    viewLevel: {
      level: "country",
      adcode: 100000,
    },
    autoFit: true,
    color: {
      field: "value",
      value: [
        "#FF9370",
        "#FFA081",
        "#FFB198",
        "#FFC3B0",
        "#FFD5C7",
        "#FFE3DB",
        "#FFF0EB",
        "#FFFCFC",
        "#FFFFFE",
        "#FFFFFF",
      ].reverse(),
      scale: { type: "quantile" },
    },
    style: {
      opacity: 1,
      stroke: "#ccc",
      // stroke: "yellow",
      lineWidth: 0.2,
      lineOpacity: 1,
    },
    label: {
      visible: true,
      field: "name",
      style: {
        fill: "#000",
        opacity: 0.8,
        fontSize: 10,
        stroke: "#fff",
        strokeWidth: 1.5,
        textAllowOverlap: false,
        padding: [5, 5],
      },
    },
    state: {
      active: {
        stroke: "#FE856A",
        lineWidth: 1,
      },
    },
    tooltip: {
      items: ["name", "adcode", "value"],
    },
    zoom: {
      position: "bottomright",
    },
    legend: {
      position: "bottomleft",
    },
    theme: "light",
    chinaBorder: {
      national: {
        color: "#FE856A",
        width: 0.7,
        opacity: 0.8,
      },
      coast: {
        color: "#FE856A",
        width: 0.7,
        opacity: 0.8,
      },
      dispute: { color: "#ccc", width: 0.7, opacity: 0.8, dashArray: [2, 4] },
    },
    layerMenu: {},
  }).on(
    "tooltip:show",
    // rigionalDataRef.value = event;
    _.throttle((event) => {
      if (
        event.data.items &&
        event.data.items[0] &&
        ProvinceData.some((item) => item.name === event.data.items[0].value)
      ) {
        console.log(`output->event`, event);
        regionalDataRef.value!.province_name = event.data.items[0].value ??= "";
        regionalDataRef.value!.users = event.data.items[2].value ??= 0;
        regionalDataRef.value!.classrooms = event.data.items[1].value ??= 0;
        regionalDataRef.value!.teams = event.data.items[1].value ??= 0;
        regionalDataRef.value!.wcu_tournaments =
          event.data.items[1].value ??= 0;
      }
    }, 1000)
  );
  // .on("fillAreaLayer:click", (event) => {
  //   console.log(`output->event`, event);
  // });
  // .on("mousedown", (event) => {
  //   console.log(`output->event`, event);
  // });
};
const regionalDataRef = ref({
  province_name: "",
  users: 0,
  classrooms: 0,
  teams: 0,
  wcu_tournaments: 0,
});

const [DefinePart2CurrentOnlineChart, Part2CurrentOnlineChart] =
  createReusableTemplate();
const [DefinePart2WeeklyOnlineChart, Part2WeeklyOnlineChart] =
  createReusableTemplate();
const [DefinePart2MonthlyOnlineChart, Part2MonthlyOnlineChart] =
  createReusableTemplate();

const showWhichPart2 = ref(0);
const handlePart2CurrentOnlineChartOpen = () => {
  showWhichPart2.value = 0;
  nextTick(() => {
    initPart2CurrentOnlineChart();
  });
};
const handlePart2WeeklyOnlineChartOpen = () => {
  showWhichPart2.value = 1;
  nextTick(() => {
    initPart2WeeklyOnlineChart();
  });
};
const handlePart2MonthlyOnlineChartOpen = () => {
  showWhichPart2.value = 2;
  nextTick(() => {
    initPart2MonthlyOnlineChart();
  });
};

const { data: Part2MonthlyOnlineData } = await useFetch<Array<any>>(
  "/getPart2MonthlyOnlineData",
  {
    method: "GET",
    server: false,
  }
);

let Part2FirstTimeRenderCurrent = true;
let Part2FirstTimeRenderMonthly = true;
let Part2FirstTimeRenderWeekly = true;
const initPart2CurrentOnlineChart = () => {
  if (Part2FirstTimeRenderCurrent)
    new Line("part2-monthly-online-chart", {
      // data: (Part2MonthlyOnlineData.value ??= []),
      data: (Part2MonthlyOnlineData.value ??= []),
      xField: "date",
      yField: "value",
      seriesField: "type",
      // height: 280,
      height: 340,
      // color: ["#FF9370", "#A8A8B9", "#70708C"],
      color: ["#FF9370", "#70708C", "#A8A8B9"].reverse(),
      tooltip: {
        title: (title, datum) => {
          // console.log(`output->datum`, datum);
          return `峰值-${datum.type + datum.date}日：`;
        },
      },
      // lineShape: (datum) => {
      //     return ''
      // },
      lineStyle: (datum) => {
        if (datum.type === "上上月")
          return {
            lineDash: [4, 4],
          };
      },
      legend: {
        position: "top-right",
        layout: "vertical",
        flipPage: false,
        itemName: {
          style: {
            fontSize: 14,
          },
        },
        itemHeight: 10,
        marker: (
          name: string,
          index: number,
          // item: { name: string; value: string }
          item: { [key: string]: any }
        ) => {
          // if (name === "本月")
          //   return {
          //     symbol: "circle",
          //   };
          if (name === "上上月")
            return {
              symbol: "hyphen",
              style: {
                lineWidth: 6,
                r: 12,
                lineCap: "round",
                lineDash: [8, 8],
                textAlign: "center",
              },
            };
          return {
            symbol: "hyphen",
            style: {
              // lineCap: "round",
              // lineCap: "butt",
              lineCap: "round",
              //hight
              lineWidth: 6,
              //width
              r: 12,
              // lineHeight: 28,
              // lineDash: [2, 2],
            },
          };
        },
      },
      // annotations: [
      //   {
      //     type: "text",
      //     content: "123",
      //     position: ["start", "end"],
      //   },
      // ],
    }).render();
  Part2FirstTimeRenderCurrent = false;
};
const initPart2WeeklyOnlineChart = () => {
  if (Part2FirstTimeRenderWeekly)
    new Line("part2-weekly-online-chart", {
      data: (Part2MonthlyOnlineData.value ??= []),
      xField: "date",
      yField: "value",
      seriesField: "type",
      height: 280,
      color: ["#FF9370", "#A8A8B9", "#70708C"],
      tooltip: {
        title: (title, datum) => {
          console.log(`output->datum`, datum);
          return `峰值-${datum.type + datum.date}日：`;
        },
      },
    }).render();
  Part2FirstTimeRenderWeekly = false;
};
const initPart2MonthlyOnlineChart = () => {
  if (Part2FirstTimeRenderMonthly)
    new Line("part2-monthly-online-chart", {
      data: (Part2MonthlyOnlineData.value ??= []),
      xField: "date",
      yField: "value",
      seriesField: "type",
      height: 280,
      color: ["#FF9370", "#A8A8B9", "#70708C"],
      tooltip: {
        title: (title, datum) => {
          console.log(`output->datum`, datum);
          return `峰值-${datum.type + datum.date}日：`;
        },
      },
    }).render();
  Part2FirstTimeRenderMonthly = false;
};

onMounted(() => {
  // initTest();
  initDailyOnlineChart();
  initRegionalDistribution();
  initPart2CurrentOnlineChart();
});
</script>
<template>
  <DefineDailyOnlineChart>
    <div class="">
      <!--  -->
      <div class="flex gap-8 mb-6">
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">日总在线量</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              lineDataRaw?.reduce((acc, cur) => cur.value + acc, 0)
            )
          }}</span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">最高在线量</label>
          <span class="text-24px text-primary_1">
            {{
              resultNumberFormatter(
                lineDataRaw?.reduce((result, cur) => {
                  return Math.max(cur.value, result);
                }, 0)
              )
            }}
          </span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">前一日总在线量</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(lineDataRaw?.[0].value)
          }}</span>
        </div>
      </div>
      <!--  -->
    </div>

    <div id="daily-online-chart"></div>
  </DefineDailyOnlineChart>
  <DefineWeeklyOnlineChart>
    <div class="relative">
      <!--  -->
      <div class="flex gap-8 mb-6 absolute">
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px"> 本周总在线量 </label>
          <span class="text-primary_1 text-24px">
            {{
              resultNumberFormatter(
                mixedData3
                  ?.flat()
                  .filter((item) => {
                    return item.type === "本周";
                  })
                  .reduce((acc, cur) => cur.value + acc, 0)
              )
            }}
          </span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px"> 上周总在线量 </label>
          <span class="text-primary_1 text-24px">
            {{
              resultNumberFormatter(
                mixedData3
                  ?.flat()
                  .filter((item) => {
                    return item.type === "上周";
                  })
                  .reduce((acc, cur) => cur.value + acc, 0)
              )
            }}
          </span>
        </div>
      </div>
      <!--  -->
    </div>

    <div id="weekly-online-chart"></div>
  </DefineWeeklyOnlineChart>
  <!--  -->
  <!-- <DefinePart2CurrentOnlineChart>
    <div class="relative">

      <div class="flex gap-8 mb-6 2xl:gap-17 absolute">
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">月总在线量</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.filter(
                (item) => item.type === "本月"
              ).reduce((acc, item) => (acc = item.value + acc), 0)
            )
          }}</span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">上月</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.filter(
                (item) => item.type === "上月"
              ).reduce((acc, item) => (acc = item.value + acc), 0)
            )
          }}</span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">同比</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.reduce((acc, item) => item.value + acc, 0)
            )
          }}</span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">环比</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.reduce((acc, item) => item.value + acc, 0)
            )
          }}</span>
        </div>
      </div>

    </div>
    <div id="part2-current-online-chart"></div>
  </DefinePart2CurrentOnlineChart> -->
  <!-- <DefinePart2WeeklyOnlineChart>
    <div class="flex gap-8 mb-6 2xl:gap-17">
      <div class="flex flex-col">
        <label class="text-#5F616E text-14px">月总在线量</label>
        <span class="text-24px text-primary_1">{{
          resultNumberFormatter(
            Part2MonthlyOnlineData?.filter(
              (item) => item.type === "本月"
            ).reduce((acc, item) => (acc = item.value + acc), 0)
          )
        }}</span>
      </div>
      <div class="flex flex-col">
        <label class="text-#5F616E text-14px">上月</label>
        <span class="text-24px text-primary_1">{{
          resultNumberFormatter(
            Part2MonthlyOnlineData?.filter(
              (item) => item.type === "上月"
            ).reduce((acc, item) => (acc = item.value + acc), 0)
          )
        }}</span>
      </div>
      <div class="flex flex-col">
        <label class="text-#5F616E text-14px">同比</label>
        <span class="text-24px text-primary_1">{{
          resultNumberFormatter(
            Part2MonthlyOnlineData?.reduce((acc, item) => item.value + acc, 0)
          )
        }}</span>
      </div>
      <div class="flex flex-col">
        <label class="text-#5F616E text-14px">环比</label>
        <span class="text-24px text-primary_1">{{
          resultNumberFormatter(
            Part2MonthlyOnlineData?.reduce((acc, item) => item.value + acc, 0)
          )
        }}</span>
      </div>
    </div>
    <div id="part2-weekly-online-chart"></div>
  </DefinePart2WeeklyOnlineChart> -->
  <DefinePart2MonthlyOnlineChart>
    <div class="relative">
      <div class="flex gap-8 mb-6 2xl:gap-17 absolute">
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">月总在线量</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.filter(
                (item) => item.type === "本月"
              ).reduce((acc, item) => (acc = item.value + acc), 0)
            )
          }}</span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">上月</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.filter(
                (item) => item.type === "上月"
              ).reduce((acc, item) => (acc = item.value + acc), 0)
            )
          }}</span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">同比</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.reduce((acc, item) => item.value + acc, 0)
            )
          }}</span>
        </div>
        <div class="flex flex-col">
          <label class="text-#5F616E text-14px">环比</label>
          <span class="text-24px text-primary_1">{{
            resultNumberFormatter(
              Part2MonthlyOnlineData?.reduce((acc, item) => item.value + acc, 0)
            )
          }}</span>
        </div>
      </div>
    </div>

    <div id="part2-monthly-online-chart"></div>
  </DefinePart2MonthlyOnlineChart>
  <!--  -->
  <div
    class="grid gap-x-9 gap-y-6 grid-rows-2 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 mb-10"
  >
    <div
      class="bg-primary_2 text-white rounded-10px h-120px items-center flex flex-col justify-center p-4"
      v-for="item in preview_prefix_info"
    >
      <span class="text-48px font-bold leading-65px">
        {{ resultNumberFormatter(data?.[item.key]) }}
      </span>
      <div class="text-24px flex items-center gap-2">
        <div :class="item.iconMeta"></div>
        <label class="">{{ item.attrLabel }}</label>
      </div>
    </div>
  </div>
  <!--  -->
  <div class="grid grid-cols-2 gap-9 max-h-480px mb-10">
    <div
      class="bg-white p-8 rounded-10px min-w-420px box-border max-h-480px min-h-480px"
    >
      <div class="h-32px grid grid-cols-2 min-w-120px max-w-160px mb-7">
        <button
          :class="`rounded-l-10px
                    border border-solid border-1px border-#70708C
                    h-full w-full
                    hover:cursor-pointer
            ${
              isShowDailyOnline === true
                ? 'bg-primary_2 text-white '
                : 'bg-white text-#70708C'
            }`"
          @click="
            () => {
              if (isShowDailyOnline === false) {
                handleDailyOnlineChartOpen();
              }
            }
          "
        >
          日在线
        </button>
        <button
          :class="`rounded-r-10px
                    border border-solid border-1px border-#70708C
                    h-full w-full
                    hover:cursor-pointer
            ${
              isShowDailyOnline === false
                ? 'bg-primary_2 text-white '
                : 'bg-white text-#70708C'
            }`"
          @click="
            () => {
              if (isShowDailyOnline === true) {
                handleWeeklyOnlineChartOpen();
              }
            }
          "
        >
          周在线
        </button>
      </div>
      <keep-alive>
        <component
          :is="isShowDailyOnline ? DailyOnlineChartTemp : WeeklyOnlineChartTemp"
        ></component>
      </keep-alive>
      <!--  -->
    </div>
    <!--  -->
    <div
      class="bg-white p-8 rounded-10px min-w-420px max-h-480px flex justify-between"
    >
      <div class="text-#70708C flex flex-col text-16px gap-2 mr-8">
        <h2 class="text-24px mb-16">地区分布</h2>
        <!-- <h3 class="text-20px text-#FF9370">新疆维吾尔族自治区</h3> -->
        <h3 class="text-20px text-#FF9370">
          {{ regionalDataRef?.province_name }}
        </h3>
        <label class="text-18px font-bold"
          >用户数：{{ regionalDataRef?.users }}</label
        >
        <label class="">魔方教室：{{ regionalDataRef?.classrooms }}</label>
        <label>战队数量：{{ regionalDataRef?.teams }}</label>
        <label>WCU比赛：{{ regionalDataRef?.wcu_tournaments }}</label>
      </div>
      <div id="regional-distrubution"></div>
    </div>
  </div>
  <!--  -->
  <div class="bg-white h-480px p-10">
    <div class="h-32px grid grid-cols-3 min-w-180px max-w-240px mb-8">
      <!-- <button
        :class="`rounded-l-10px
          border border-solid border-1px border-#70708C
          ${
            showWhichPart2 === 0
              ? 'bg-primary_2 text-white '
              : 'bg-white text-#70708C'
          }
        `"
        @click="
          () => {
            if (showWhichPart2 !== 0) {
              handlePart2CurrentOnlineChartOpen();
            }
          }
        "
      >
        实时在线
      </button>
      <button
        :class="`
          border border-solid border-1px border-#70708C
          ${
            showWhichPart2 === 1
              ? 'bg-primary_2 text-white '
              : 'bg-white text-#70708C'
          }
        `"
        @click="
          () => {
            if (showWhichPart2 !== 1) {
              handlePart2WeeklyOnlineChartOpen();
            }
          }
        "
      >
        周在线
      </button> -->
      <!-- rounded-r-10px -->
      <button
        :class="`
          rounded-10px
          border border-solid border-1px border-#70708C
          ${
            // showWhichPart2 === 2
            showWhichPart2 === 0
              ? 'bg-primary_2 text-white '
              : 'bg-white text-#70708C'
          }
        `"
        @click="
          () => {
            // if (showWhichPart2 !== 2) {
            //   handlePart2MonthlyOnlineChartOpen();
            // }
          }
        "
      >
        月在线
      </button>
    </div>
    <!--  -->
    <keep-alive>
      <component
        :is="
          [
            // Part2CurrentOnlineChart,
            // Part2WeeklyOnlineChart,
            Part2MonthlyOnlineChart,
          ][showWhichPart2]
        "
      ></component>
    </keep-alive>
    <!--  -->
  </div>
</template>
<style lang="scss" scoped></style>
