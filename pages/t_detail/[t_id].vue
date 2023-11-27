<script setup lang="ts">
import gsap from "gsap";
import { ApplicantType } from "server/api/t_detail/t_applicants/[t_id].get";
import { TResultType } from "server/api/t_detail/t_results/[t_id].get";
import { FinalFormStateType } from "../t_info.vue";
import { ElMessage, ElMessageBox, ElCheckbox } from "element-plus";
import type { Action } from "element-plus";
import * as xlsx from "xlsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { CollapseProps } from "naive-ui";

definePageMeta({
  layout: "pc",
  middleware: ["auth"],
});
useHead({
  title: "T_Detail - 赛事详情",
});

dayjs.extend(utc);
dayjs.extend(timezone);

const route = useRoute();
const router = useRouter();
const routeParamTId = route.params.t_id;

const { data: t_infoData } = await useFetch<FinalFormStateType | null>(
  `/api/t_info/${routeParamTId}`
);
if (!t_infoData.value) {
  router.push("/t_list");
  alert("赛事不存在");
}
const { data: t_applicantsData, refresh: refresh_applicantsData } =
  await useFetch<ApplicantType[] | null>(
    `/api/t_detail/t_applicants/${routeParamTId}`
  );
const { data: t_resultsData, refresh: refresh_resultsData } = await useFetch<
  TResultType[] | null
>(`/api/t_detail/t_results/${routeParamTId}`);
// console.log(t_infoData.value, t_applicantsData.value, t_resultsData.value);

// const isExportModalOpen = ref(false);
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
const handleExportTDetailData = () => {
  // console.log(1);
  if (t_infoData.value) {
    const sheetName = `Sheet1`;
    const fileName = `赛事详情数据导出 - ${dayjs()
      .utc(true)
      .format("YYYY-MM-DD HH\:mm")
      .toString()}.xlsx`;
    exportExcelAsFileMethod(sheetName, fileName, [t_infoData.value]);
  }
};
const handleExportApplicantsData = () => {
  // console.log(2);
  if (t_applicantsData.value) {
    const finalData = t_applicantsData.value.map((item) => {
      const {
        id,
        identity_card,
        tel,
        gender,
        region,
        region_id,
        wca_id,
        apply_time,
        verify,
        verify_time,
        ...rest
      } = item;
      return rest;
    });
    const sheetName = `Sheet1`;
    const fileName = `赛事参赛选手数据导出 - ${dayjs()
      .utc(true)
      .format("YYYY-MM-DD HH:mm")
      .toString()}.xlsx`;
    // exportExcelAsFileMethod(sheetName, fileName, t_applicantsData.value);
    exportExcelAsFileMethod(sheetName, fileName, finalData);
  }
};
const handleExportPlayersResultsData = () => {
  // console.log(3);
  if (t_resultsData.value) {
    const finalData = t_resultsData.value.map((item) => {
      const finalItem = {
        t_id: item.t_id,
        p_id: item.p_id,
        p_name: item.p_name,
        user_id: item.user_id,
        name: item.name,
        phase: item.phase,
        r1_duration: item.r1_duration,
        r2_duration: item.r2_duration,
        r3_duration: item.r3_duration,
        r4_duration: item.r4_duration,
        r5_duration: item.r5_duration,
        round_format: item.round_format,

        best_duration: item.best_duration,
        avg: item.avg,
      };
      return finalItem;
    });
    const sheetName = `Sheet1`;
    const fileName = `赛事选手成绩数据导出 - ${dayjs()
      .utc(true)
      .format("YYYY-MM-DD HH:mm")
      .toString()}.xlsx`;

    // exportExcelAsFileMethod(sheetName, fileName, t_resultsData.value);
    exportExcelAsFileMethod(sheetName, fileName, finalData);
  }
};

const exportStateTemp = {
  isExportTournamentDetail: false,
  isExportApplicantsData: false,
  isExportPlayerResultsData: false,
};
const exportStateObjRef = ref(structuredClone(exportStateTemp));
const correspondExportMethodObj: Record<string, () => void> = {
  isExportTournamentDetail: handleExportTDetailData,
  isExportApplicantsData: handleExportApplicantsData,
  isExportPlayerResultsData: handleExportPlayersResultsData,
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
            modelValue: exportStateObjRef.value.isExportTournamentDetail,
            "onUpdate:modelValue": (val: boolean | string | number) => {
              exportStateObjRef.value.isExportTournamentDetail = val as boolean;
            },
            label: "赛事详情",
          }),
          h(ElCheckbox, {
            modelValue: exportStateObjRef.value.isExportApplicantsData,
            "onUpdate:modelValue": (val: boolean | string | number) => {
              exportStateObjRef.value.isExportApplicantsData = val as boolean;
            },
            label: "参赛选手详情",
          }),
          h(ElCheckbox, {
            modelValue: exportStateObjRef.value.isExportPlayerResultsData,
            "onUpdate:modelValue": (val: boolean | string | number) => {
              exportStateObjRef.value.isExportPlayerResultsData =
                val as boolean;
            },
            label: "赛事赛果详情",
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

const collapseItem2 = ref();
const collapseItem1 = ref();
const handleClickCollapseItem: CollapseProps["onItemHeaderClick"] = ({
  name,
  expanded,
}) => {
  gsap.to(
    name === "1"
      ? collapseItem1.value
      : name === "2"
      ? collapseItem2.value
      : undefined,
    { rotate: expanded ? 90 : 0, duration: 0.2 }
  );
};
</script>
<template>
  <div class="flex flex-col w-full min-w-740px">
    <div class="mb-5 flex justify-between">
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

    <div class="flex flex-col gap-11">
      <FeaturesTDetailPreview v-if="t_infoData" :t_info_data="t_infoData" />
      <!-- <FeaturesTApplicantsTable
        v-if="t_applicantsData && t_infoData"
        :t_projects="
        t_infoData.projects_detail.length > 0 ?
        t_infoData.projects_detail.map((item) => {
          return {
            id: item.id,
            label: item.label,
            iconMeta: item.iconMeta!,
          };
        }) : []
      "
        :t_applicants-data="t_applicantsData"
        class=""
      />
      <FeaturesTResultsTable
        v-if="t_resultsData && t_infoData"
        :t_projects="
        t_infoData.projects_detail.map((item) => {
          return {
            id: item.id,
            label: item.label,
            iconMeta: item.iconMeta!,
          };
        })
      "
        :t_results-data="t_resultsData"
        class=""
      /> -->
      <n-collapse
        arrow-placement="right"
        :default-expanded-names="['1', '2']"
        @item-header-click="handleClickCollapseItem"
      >
        <n-collapse-item name="1">
          <template #header>
            <div
              class="bg-primary_2 h-60px flex items-center rounded-t-10px w-full justify-between group"
            >
              <div class="text-white text-30px ml-7 leading-30px">参赛选手</div>
              <img
                ref="collapseItem1"
                src="../../assets/icons/d-collapse.svg"
                class="w-40px h-40px mr-3 origin-center rotate-90"
              />
            </div>
          </template>
          <template #arrow>
            <div class="absolute"></div>
          </template>
          <template #default>
            <!-- Bugs point -->
            <FeaturesTApplicantsTable
              v-if="t_applicantsData && t_infoData"
              :t_projects="
                t_infoData.projects_detail.length > 0 ?
                t_infoData.projects_detail.map((item) => {
                  return {
                    id: item.id,
                    label: item.label,
                    iconMeta: item.iconMeta!,
                  };
                }) : []
                "
              :t_applicants-data="t_applicantsData"
              class=""
            />
          </template>
        </n-collapse-item>
        <n-collapse-item name="2">
          <template #header>
            <div
              class="bg-primary_2 h-60px flex items-center justify-between rounded-t-10px w-full group"
            >
              <div class="text-white text-30px ml-7 leading-30px">赛果</div>
              <img
                ref="collapseItem2"
                src="../../assets/icons/d-collapse.svg"
                class="w-40px h-40px mr-3 origin-center rotate-90"
              />
              <!-- collapse-end-state -->
              <!-- motion-safe:animate-bounce -->
            </div>
          </template>
          <template #arrow>
            <div></div>
          </template>
          <FeaturesTResultsTable
            v-if="t_resultsData && t_infoData"
            :t_projects="
              t_infoData.projects_detail.map((item) => {
                return {
                  id: item.id,
                  label: item.label,
                  iconMeta: item.iconMeta!,
                  rounds_total: item.rounds.total,
                  rounds_detail: item.rounds.detail
                };
              })
      "
            :t_results-data="t_resultsData"
            class=""
          />
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(
    .n-collapse
      .n-collapse-item
      .n-collapse-item__content-wrapper
      .n-collapse-item__content-inner
  ) {
  padding-top: 0;
}

.collapse-end-state {
  --uno: origin-center rotate-90;
  // transition duration-500 group-hover:rotate-90
}
</style>
