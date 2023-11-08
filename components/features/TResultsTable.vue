<script setup lang="ts">
import { TResultType } from "server/api/t_detail/t_results/[t_id].get";
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import * as xlsx from "xlsx";

const tableUiStyle = {
  th: {
    color: "text-white bg-primary_2",
    base: "h-48px text-left trl:text-right",
    padding: "py-0 px-3",
  },
  tr: {
    base: "even:bg-#EDF1FE h-36px",
  },
  td: {
    padding: "px-3 py-1",
    base: "whitespace-nowrap",
  },
  // tbody: ' divide-y divide-gray-200 dark:divide-gray-800',
  tbody: "",
  base: "min-w-full table-fixed",
};
const formGroupUiStyle = {
  wrapper: "flex items-center",
  label: {
    // base: "mr-3 font-sans text-18px w-40px whitespace-pre-wrap text-center",
    base: "mr-3 font-sans text-18px w-40px whitespace-no-wrap text-center",
  },
  container: "mt-0",
  error: "text-red-400 dark:text-red-400 mt-1 text-14px",
};
const inputUiStyle = {
  rounded: "rounded-10px",
  color: {
    white: {
      outline:
        "shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary_1 dark:focus:ring-primary-400",
    },
  },
  base: "relative block w-full disabled:cursor-not-allowed disabled:bg-#E5E5E5 focus:outline-none border-0 min-w-100px",
};

const props = defineProps<{
  t_resultsData: TResultType[];
  t_projects: {
    id: number | undefined;
    label: string;
    iconMeta: string;
    rounds_total: number;
    rounds_detail:
      | []
      | {
          promotion_quota: number;
          time_range: [string, string];
          t_format: number;
        }[];
  }[];
  // t_projects: { id: number; label: string; iconMeta: string }[];
}>();

type NuxtUITableColumnAttrType = {
  key: string;
  label: string;
  sortable?: boolean;
  direction?: "asc" | "desc";
  class?: string;
};
const columnsStable: NuxtUITableColumnAttrType[] = [
  {
    label: "姓名",
    key: "name",
  },
  {
    label: "编号",
    key: "t_number",
  },
  {
    label: "WCU id",
    key: "user_id",
    // key: 'wcu_id',
  },
  {
    label: "|",
    key: "interval",
  },
];
const columnsFlexible: NuxtUITableColumnAttrType[] = [
  {
    label: "最好成绩(s/秒)",
    key: "best_duration",
    sortable: true,
    direction: "asc",
  },
  {
    label: "平均成绩(s/秒)",
    key: "avg_duration",
    sortable: true,
    direction: "asc",
  },
  {
    label: "赛制",
    key: "round_format",
  },
  {
    label: "详情 [r1,r2,r...] (s/秒)",
    key: "overviewResults",
  },
  {
    label: "晋级",
    key: "is_rise",
    sortable: true,
    direction: "asc",
  },
];

const resultNumberFormatter = (targetNumber: number) => {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(targetNumber);
};
const columns = [...columnsStable, ...columnsFlexible];
const selectedColumns = ref([...columns]);

// const selectedProject = ref<{
//   id: number | undefined;
//   label: string;
// }>(props.t_projects[0]);
// const selectedProjects = ref<
//   {
//     id: number | undefined;
//     label: string;
//   }[]
// >([props.t_projects[0]]);

const selectedRowForIsRise = computed(() => {
  return display_resultsData.value.map((itemA, index) => {
    if (itemA.is_rise) {
      return itemA;
    }
  });
});
// console.log(display_resultsData.value);

const route = useRoute();
const router = useRouter();
const routeParamId = route.params.t_id;
const formStateObjTemp = {
  name: "",
  user_id: "",
  t_number: "",
  phase: undefined,
  projects: undefined,
  r1_duration: "",
  r2_duration: "",
  r3_duration: "",
  r4_duration: "",
  r5_duration: "",
};
const manuallyEnterFormState = ref<{
  name: string;
  user_id: string;
  t_number: string;
  phase: Record<string, any> | undefined;
  projects: Record<string, any> | undefined;
  r1_duration: string;
  r2_duration: string;
  r3_duration: string;
  r4_duration: string;
  r5_duration: string;
}>(structuredClone(formStateObjTemp));

const uploadApplicantsExcelRef = ref<UploadInstance>();
const handleFileExceed: UploadProps["onExceed"] = (files) => {
  uploadApplicantsExcelRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadApplicantsExcelRef.value!.handleStart(file);
};

const handleUploadFileOnChange = (
  fileObj: Record<string, any>,
  // fileObj: { raw: File; [key: string]: any },
  filesList: Record<number, any>
) => {
  // console.log(fileObj, filesList);
  if (fileObj) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(fileObj.raw);
    fileReader.onloadend = (loadEndEvent) => {
      // console.log(loadEndEvent.target?.result);
      const fileArrBuff = loadEndEvent.target?.result;
      const workbook = xlsx.read(fileArrBuff, { type: "buffer" });
      const sheetNames = workbook.SheetNames;
      const sheet1 = workbook.Sheets[sheetNames[0]];
      const sheet1Data = xlsx.utils.sheet_to_json(sheet1);
      $fetch("/api/t_detail/t_results/createMany", {
        method: "POST",
        body: {
          t_id: routeParamId,
          data: sheet1Data,
        },
      });
    };
  }
};

const round_format_grade_calc_strategy = [
  {
    id: 3,
    label: "五次去头去尾取平均",
    games_total: 5,
    calcRule: (durationResultArr: Array<number>) => {
      const filtered_and_sorted_duration_arr = durationResultArr.sort(
        (a, b) => a - b
      );
      const avg_result =
        filtered_and_sorted_duration_arr
          .slice(1, 4)
          .reduce((a, b) => a + b, 0) / 3;
      // filtered_and_sorted_duration_arr.length;
      return {
        avg: avg_result,
        best_duration: filtered_and_sorted_duration_arr.shift() ?? 0,
      };
    },
  },
  {
    id: 4,
    label: "三次取平均",
    games_total: 3,
    calcRule: (durationResultArr: Array<number>) => {
      const filtered_and_sorted_duration_arr = durationResultArr
        .filter((item) => item !== 0)
        .sort((a, b) => a - b);
      const avg_result =
        filtered_and_sorted_duration_arr.reduce((a, b) => a + b, 0) / 3;
      // filtered_and_sorted_duration_arr.length;
      return {
        avg: avg_result,
        best_duration: filtered_and_sorted_duration_arr.shift() ?? 0,
      };
    },
  },
  {
    id: 2,
    label: "三次取最快",
    games_total: 3,
    calcRule: (durationResultArr: Array<number>) => {
      const filtered_and_sorted_duration_arr = durationResultArr
        .filter((item) => item !== 0)
        .sort((a, b) => a - b);
      const avg_result =
        filtered_and_sorted_duration_arr.reduce((a, b) => a + b, 0) /
        filtered_and_sorted_duration_arr.length;
      return {
        avg: avg_result,
        best_duration: filtered_and_sorted_duration_arr.shift() ?? 0,
      };
    },
  },
  {
    id: 5,
    label: "两次取最快",
    games_total: 2,
    calcRule: (durationResultArr: Array<number>) => {
      const filtered_and_sorted_duration_arr = durationResultArr
        .filter((item) => item !== 0)
        .sort((a, b) => a - b);
      const avg_result =
        durationResultArr.reduce((a, b) => a + b, 0) / durationResultArr.length;
      return {
        avg: avg_result,
        best_duration: filtered_and_sorted_duration_arr.shift() ?? 0,
      };
    },
  },
  {
    id: 1,
    label: "单次",
    games_total: 1,
    calcRule: (durationResultArr: Array<number>) => {
      const filtered_and_sorted_duration_arr = durationResultArr
        .filter((item) => item !== 0)
        .sort((a, b) => a - b);
      const avg_result =
        durationResultArr.reduce((a, b) => a + b, 0) / durationResultArr.length;
      return {
        avg: avg_result,
        best_duration: filtered_and_sorted_duration_arr.shift() ?? 0,
      };
    },
  },
];

const roundFormatBasedGradeCalc = (
  durationResultArr: Array<number>,
  round_format: number
): { avg: number; best_duration: number } => {
  return (
    round_format_grade_calc_strategy
      .find((strategy) => strategy.id === round_format)
      ?.calcRule(durationResultArr) ?? {
      best_duration: 0,
      avg: 0,
    }
  );
};

const t_phase_options: {
  phase: number;
  label: string;
}[] = [
  {
    label: "第1轮",
    phase: 1,
  },
  {
    label: "第2轮",
    phase: 2,
  },
  {
    label: "第3轮",
    phase: 3,
  },
  {
    label: "第4轮",
    phase: 4,
  },
  {
    label: "第5轮",
    phase: 5,
  },
];

const ref_t_phase_options = ref(t_phase_options);
watchEffect(() => {
  const currentProjectId = manuallyEnterFormState.value.projects?.id ?? 0;
  const rounds_total =
    props.t_projects.find((project) => project.id == currentProjectId)
      ?.rounds_total ?? 0;
  ref_t_phase_options.value = t_phase_options.slice(0, rounds_total);
});

const ref_round_games_total = ref(5);
watchEffect(() => {
  const currentProjectId = manuallyEnterFormState.value.projects?.id ?? 0;
  const currentRoundIndex = manuallyEnterFormState.value.phase?.phase - 1 ?? 0;
  const currentRoundFormat = props.t_projects
    .find((project) => project.id == currentProjectId)
    ?.rounds_detail.find(
      (item, index) => index === currentRoundIndex
    )?.t_format;
  const currentRoundGamesTotal =
    round_format_grade_calc_strategy.find(
      (item) => item.id === currentRoundFormat
    )?.games_total ?? 0;

  ref_round_games_total.value = currentRoundGamesTotal;
});

const selectedProjectItems = ref<{ [key: string]: string }[]>([]);
const selectedPhase = ref();
// watchEffect(() => console.log(typeof selectedPhase.value));

const currentPage = ref(1);
const tablePageCount = 15;

const display_resultsData = computed(() => {
  return (
    props.t_resultsData
      // .filter((item, index, selfArr) => {
      //   return selectedProject.value.id === item.p_id;
      // })
      .map((itemA, indexA) => {
        const itemAOverviewResults: [string, number][] = [];
        Object.entries(itemA).forEach(([key, value]) => {
          if (key.startsWith("r") && key.endsWith("_duration")) {
            const _durationStrIndex = key.indexOf("_duration");
            let keySimplified = key.slice(0, _durationStrIndex);

            itemAOverviewResults.push(
              // Object.fromEntries([[keySimplified, value]])
              [
                keySimplified,
                typeof value === "number" ? value : parseInt("" + value),
              ]
            );
          }
        });
        itemAOverviewResults.sort(
          (preVal: [string, number], curVal: [string, number]) => {
            //逆，5,4,3,2,1; judge>0
            // return +curVal[0].slice(-1) - +preVal[0].slice(-1);
            //正，1,2,3,4,5; judge<0
            return +preVal[0].slice(-1) - +curVal[0].slice(-1);
          }
        );
        return {
          name: itemA.name,
          user_id: itemA.user_id,
          wcu_id: null,
          best_duration: resultNumberFormatter(itemA.best_duration / 1000),
          avg_duration: resultNumberFormatter(itemA.avg / 1000),
          is_rise: itemA.is_rise,
          // is_rise: itemA.is_rise ? '是' : '否',
          overviewResults: itemAOverviewResults,
          p_id: itemA.p_id,
          phase: itemA.phase,
          t_number: itemA.t_number,
          round_format: round_format_grade_calc_strategy.find(
            (item) => item.id === itemA.round_format
          )?.label,
        };
      })
  );
});
// console.log(display_resultsData.value);
const filterListDataLength = computed(() => {
  return (
    display_resultsData.value
      .filter((item, index, selfArr) => {
        return selectedProjectItems.value.some(
          (itemA) => +itemA.id === item.p_id
        );
      })
      //Bug 小点
      .filter((item) => {
        return item.phase === +selectedPhase.value;
      }).length
  );
});

const finalListData = computed(() => {
  if (selectedProjectItems.value.length === 0) {
    return display_resultsData.value?.slice(
      (currentPage.value - 1) * tablePageCount,
      currentPage.value * tablePageCount
    );
  }
  let filterListData = display_resultsData.value
    .filter((item, index, selfArr) => {
      return selectedProjectItems.value.some(
        (itemA) => +itemA.id === item.p_id
      );
    })
    //Bug 小点
    .filter((item) => {
      return item.phase === +selectedPhase.value;
    });
  return filterListData.slice(
    (currentPage.value - 1) * tablePageCount,
    currentPage.value * tablePageCount
  );
});

const handleManualEnterPlayerResults = () => {
  if (props.t_projects.length === 0) {
    alert("赛事项目为空，不可录入相关数据");
  } else {
    const r1_duration = +manuallyEnterFormState.value.r1_duration;
    const r2_duration = +manuallyEnterFormState.value.r2_duration;
    const r3_duration = +manuallyEnterFormState.value.r3_duration;
    const r4_duration = +manuallyEnterFormState.value.r4_duration;
    const r5_duration = +manuallyEnterFormState.value.r5_duration;
    const durationResultArr = [
      r1_duration,
      r2_duration,
      r3_duration,
      r4_duration,
      r5_duration,
    ];

    const currentProjectId = manuallyEnterFormState.value.projects!.id;
    const currentRoundIndex = manuallyEnterFormState.value.phase!.phase;
    const currentRoundFormat = props.t_projects
      .find((project) => project.id === currentProjectId)
      ?.rounds_detail.find((round, index) => index === currentRoundIndex - 1)
      ?.t_format!;

    const finalFormData = {
      p_name: manuallyEnterFormState.value.projects?.label,
      p_id: +manuallyEnterFormState.value.projects?.id,
      phase: +manuallyEnterFormState.value.phase?.phase,
      user_id: +manuallyEnterFormState.value.user_id,
      name: manuallyEnterFormState.value.name,
      t_number: +manuallyEnterFormState.value.t_number,
      // t_number: manuallyEnterFormState.value.t_number,
      t_id: +routeParamId,
      r1_duration: r1_duration,
      r2_duration: r2_duration,
      r3_duration: r3_duration,
      r4_duration: r4_duration,
      r5_duration: r5_duration,
      ...roundFormatBasedGradeCalc(durationResultArr, currentRoundFormat),
      round_format: currentRoundFormat,
    };
    console.log(finalFormData);
    console.log(finalFormData.avg, finalFormData.best_duration);
    $fetch("/api/t_detail/t_results/createMany", {
      method: "POST",
      body: {
        data: [finalFormData],
      },
    }).then((e) => {
      // console.log(e);
      if (e === 1) alert("手动录入选手信息成功");
      if (e === 0) alert("手动录入选手信息失败");
    });
  }
};
const handleResetFormState = () => {
  manuallyEnterFormState.value = structuredClone(formStateObjTemp);
};
</script>
<template>
  <!-- <CustomSelectGroup
    :model-value="selectedProject"
    :source-list="projects_options"
    :multiple="false"
  ></CustomSelectGroup> -->
  <!-- v-model="selectedRowForIsRise" -->
  <!-- :sort="{ column: 'is_rise', direction: 'desc' }" -->
  <!-- <div class="h-852px rounded-10px bg-white"> -->
  <div class="rounded-10px bg-white">
    <!-- <div class="bg-primary_2 h-60px flex items-center rounded-t-10px">
      <div class="text-white text-30px ml-7 leading-30px">赛果</div>
    </div> -->
    <div class="px-3 py-4 flex gap-2">
      <div class="">
        <div class="h-[calc(590px+104px)] border-#6F6F8B border bg-#F1F2FD">
          <div class="bg-primary_2 text-white h-48px flex items-center">
            <div class="text-18px ml-6 my-3">手动录入</div>
          </div>
          <div
            class="flex flex-col justify-between h-[calc(588px-48px+104px)] pt-3 pr-5 pl-6 pb-5"
          >
            <div>
              <UForm
                class="flex flex-col gap-3"
                :state="manuallyEnterFormState"
              >
                <UFormGroup label="项目" :ui="formGroupUiStyle" required>
                  <USelectMenu
                    v-model="manuallyEnterFormState.projects"
                    :options="props.t_projects"
                    placeholder="请选择比赛项目.."
                  />
                </UFormGroup>
                <UFormGroup label="轮次" :ui="formGroupUiStyle" required>
                  <USelectMenu
                    v-model="manuallyEnterFormState.phase"
                    :options="ref_t_phase_options"
                    placeholder="请选择比赛轮次.."
                  />
                  <!-- :options="t_phase_options" -->
                </UFormGroup>
                <UFormGroup label="编号" :ui="formGroupUiStyle" required>
                  <UInput
                    :ui="inputUiStyle"
                    v-model="manuallyEnterFormState.t_number"
                    type="number"
                    min="0"
                  />
                </UFormGroup>
                <UFormGroup
                  label="WCU id"
                  :ui="{
                    wrapper: 'flex items-center',
                    label: {
                      base: 'mr-3 font-sans text-18px w-40px whitespace-pre-wrap text-center',
                    },
                    container: 'mt-0',
                    error: 'text-red-400 dark:text-red-400 mt-1 text-14px',
                  }"
                  required
                >
                  <UInput
                    :ui="inputUiStyle"
                    v-model="manuallyEnterFormState.user_id"
                    type="number"
                    min="0"
                  />
                </UFormGroup>
                <UFormGroup label="姓名" :ui="formGroupUiStyle" required>
                  <UInput
                    :ui="inputUiStyle"
                    v-model="manuallyEnterFormState.name"
                  />
                </UFormGroup>
                <UFormGroup
                  label="成绩"
                  :ui="{
                    wrapper: 'flex items-start',
                    label: {
                      base: 'mr-3 font-sans text-18px w-40px whitespace-no-wrap text-center mt-1 leading-20px',
                    },
                    container: 'mt-0 flex flex-col gap-2',
                    error: 'text-red-400 dark:text-red-400 mt-1 text-14px',
                  }"
                  required
                >
                  <div class="flex items-center gap-1">
                    <span>第一局</span>
                    <UInput
                      :ui="inputUiStyle"
                      v-model="manuallyEnterFormState.r1_duration"
                      type="number"
                      min="0"
                      :disabled="ref_round_games_total < 1"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span>第二局</span>
                    <UInput
                      :ui="inputUiStyle"
                      v-model="manuallyEnterFormState.r2_duration"
                      type="number"
                      min="0"
                      :disabled="ref_round_games_total < 2"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span>第三局</span>
                    <UInput
                      :ui="inputUiStyle"
                      v-model="manuallyEnterFormState.r3_duration"
                      type="number"
                      min="0"
                      :disabled="ref_round_games_total < 3"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span>第四局</span>
                    <UInput
                      :ui="inputUiStyle"
                      v-model="manuallyEnterFormState.r4_duration"
                      type="number"
                      min="0"
                      :disabled="ref_round_games_total < 4"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span>第五局</span>
                    <UInput
                      :ui="inputUiStyle"
                      v-model="manuallyEnterFormState.r5_duration"
                      type="number"
                      min="0"
                      :disabled="ref_round_games_total < 5"
                    />
                  </div>
                </UFormGroup>
              </UForm>
            </div>
            <div class="flex gap-3 justify-center">
              <UButton
                class="bg-primary_2 active:opacity-80 rounded-24px w-96px h-42px flex justify-center"
                @click="handleResetFormState"
                >重置</UButton
              >
              <UButton
                class="bg-primary_1 active:opacity-80 rounded-24px w-96px h-42px flex justify-center leading-42px"
                @click="handleManualEnterPlayerResults"
                >确认</UButton
              >
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-20px">
          <el-upload
            ref="uploadBannerRef"
            :auto-upload="false"
            action="none"
            :limit="1"
            class="relative flex flex-col"
            accept=".xlsx"
            :on-exceed="handleFileExceed"
            :on-change="handleUploadFileOnChange"
          >
            <!-- :action="" -->
            <!-- :on-exceed="" -->
            <template #trigger>
              <UButton class="bg-primary_1 w-228px flex justify-center h-38px"
                >上传成绩单</UButton
              >
            </template>
          </el-upload>
        </div>
      </div>
      <!-- Table Content Block Start. -->
      <div class="w-full overflow-auto">
        <div>
          <CustomCheckGroup
            :multiple="false"
            :items-list="t_projects"
            :model-value="selectedProjectItems"
            :class="`flex gap-7 mb-5`"
          >
            <template #item="{ itemData, isItemSelected }">
              <div
                :class="`flex items-center justify-center 
                  gap-3 
                  group 
                  px-2
                text-primary_2 text-12px 
                bg-#F1F2FD border border-#6F6F8B border-solid rounded-10px
                  w-90px h-28px
                 hover:bg-primary_1 hover:opacity-80
                  active:opacity-60
                 ${
                   isItemSelected(itemData)
                     ? 'bg-primary_1 text-white! border-none!'
                     : ''
                 }`"
              >
                <div :class="`${itemData.iconMeta}  group-hover:text-white`" />
                <div :class="`  group-hover:text-white`">
                  {{ itemData.label }}
                </div>
              </div>
            </template>
          </CustomCheckGroup>
        </div>
        <div class="mb-5 flex items-center justify-between">
          <n-form-item
            label="轮次"
            label-placement="left"
            class="h-36px!"
            label-style="font-size:18px"
          >
            <n-select
              v-model:value="selectedPhase"
              value-field="phase_id"
              label-field="label"
              class="w-180px!"
              placeholder="请选择比赛轮次.."
              :options="[
                {
                  label: '第一轮',
                  phase_id: '1',
                },
                {
                  label: '第二轮',
                  phase_id: '2',
                },
                {
                  label: '第三轮',
                  phase_id: '3',
                },
                {
                  label: '第四轮',
                  phase_id: '4',
                },
                {
                  label: '第五轮',
                  phase_id: '5',
                },
              ]"
            />
          </n-form-item>

          <div class="flex gap-2 items-center leading-36px">
            <div class="bg-green w-52px h-20px"></div>
            <div class="text-18px">晋级</div>
          </div>
        </div>
        <div
          class="w-full overflow-x-auto overflow-y-hidden border border-#6F6F8B"
        >
          <div class="h-588px w-full">
            <UTable
              :columns="selectedColumns"
              :rows="finalListData"
              :ui="tableUiStyle"
              :sort-button="{
                color: '',
              }"
            >
              <!-- class="border border-#6F6F8B" -->
              <template #name-data="{ row }">
                <div>{{ row.name }}</div>
              </template>
              <template #overviewResults-data="{ row }">
                <span>
                  {{
                    row.overviewResults
                      .map((item: [string, number], index: number) => {
                        return resultNumberFormatter(item[1] / 1000);
                      })
                      .join("&nbsp&nbsp&nbsp&nbsp&nbsp")
                  }}
                </span>
              </template>
              <template #is_rise-data="{ row }">
                <div
                  :class="`text-center ${
                    row.is_rise ? 'bg-green text-white' : ''
                  }`"
                >
                  <!-- {{ row.is_rise ? "是" : "否" }} -->
                  <select
                    name="is_rise"
                    id="is_rise_select"
                    :value="row.is_rise"
                  >
                    <option value="1" class="bg-green!">是</option>
                    <option value="0">否</option>
                  </select>
                </div>
              </template>
            </UTable>
          </div>
        </div>
        <!--  -->
        <div class="w-full flex justify-center mt-4 basis-100%">
          <UPagination
            :page-count="tablePageCount"
            :total="filterListDataLength"
            v-model="currentPage"
            :prev-button="{
              label: '上一页',
              variant: 'ghost',
              color: 'orange',
            }"
            :next-button="{
              label: '下一页',
              trailing: true,
              variant: 'ghost',
              color: 'orange',
            }"
            :ui="{
              base: 'min-w-[40px] h-40px active:bg-primary_1 active:text-white',
              rounded: 'rounded-10px justify-center',
            }"
            :inactive-button="{ variant: 'ghost', color: 'orange' }"
            :active-button="{ variant: 'solid', color: 'orange' }"
          >
          </UPagination>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
  display: none;
}
</style>
