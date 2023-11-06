<script setup lang="ts">
import { ApplicantType } from "server/api/t_detail/t_applicants/[t_id].get";
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { ReadStream } from "fs";
import * as xlsx from "xlsx";
import { FormError } from "@nuxthq/ui/dist/runtime/types";
import { useMessage } from "naive-ui";
// import type { FormErrorEvent } from '@nuxthq/ui/dist/types'

const formGroupUiStyle = {
  wrapper: "flex items-center",
  label: {
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
const tableUiStyle = {
  // tbody: 'h-588px',
  th: {
    color: "text-white bg-primary_2",
    base: "h-48px text-left trl:text-right",
    padding: "px-3 py-0",
  },
  tr: {
    base: "even:bg-#EDF1FE h-36px",
  },
  td: {
    padding: "px-3 py-1",
  },
  // tbody: ' divide-y divide-gray-200 dark:divide-gray-800',
  tbody: "",
  base: "min-w-full table-fixed",
};

const props = defineProps<{
  t_applicantsData: ApplicantType[];
  // t_projects: { id: number; label: string; iconMeta: string }[];
  t_projects: { id: number | undefined; label: string; iconMeta: string }[];
}>();
const display_applicantsData = toRef(props.t_applicantsData);
const t_projects_options = props.t_projects;

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
    // key: 'wcu_id',
    key: "user_id",
  },
  {
    label: "|",
    key: "interval",
  },
];
// const columnsAttrs = props.t_projectsDetail
//   .map((item) => {
//     return {
//       label: item.label,
//       key: `p_id-${item.id}`,
//     };
//   })
//   .filter((item, index, selfArray) => {
//     return selfArray.findIndex((i) => i.label === item.label) === index;
//   });
const naiveMessage = useMessage();

const columnsAttrs = display_applicantsData.value
  .map((item: any) => {
    return {
      label: item.p_name,
      // key: `p_id`,
      key: `p_id-${item.p_id}`,
    };
  })
  .filter((item, index, selfArray) => {
    return selfArray.findIndex((i) => i.key === item.key) === index;
  });
// console.log(columnsAttrs);

const rows = display_applicantsData.value.map((item, index) => {
  return {
    name: item.name,
    user_id: item.user_id,
    t_number: item.t_number,
  };
});
const selectedColumns = ref([...columnsStable, ...columnsAttrs]);
const currentPage = ref(1);
const tablePageCount = 15;

const test: { user_id: number; user_projects: number[] }[] = [];
for (const itemA of props.t_applicantsData) {
  let existUser = test.find((itemB) => itemB.user_id === itemA.user_id);
  if (!existUser) {
    const userDataObj = {
      user_id: itemA.user_id,
      user_projects: [itemA.p_id],
    };
    test.push(userDataObj);
  }
  if (
    existUser?.user_projects.findIndex((itemC) => itemC === itemA.p_id) === -1
  )
    existUser?.user_projects.push(itemA.p_id);
}
// console.log(test);
test.forEach((itemA) => {
  const finalObj = itemA.user_projects.reduce(
    (accObj: { [key: string]: any }, item): { [key: string]: any } => {
      accObj[`p_id-${item}`] = "√";
      return accObj;
    },
    {}
  );
  // console.log(finalObj);
  const targetItem = props.t_applicantsData.find(
    (itemB) => itemB.user_id === itemA.user_id
  );
  if (targetItem) Object.assign(targetItem, finalObj);
});
display_applicantsData.value = display_applicantsData.value.filter(
  (itemA, index, selfArr) => {
    // let targetUserId = itemA.user_id
    let targetObj = selfArr.find((item) => item.user_id === itemA.user_id);
    if (targetObj) {
      let result = selfArr.indexOf(targetObj) === index;
      return result;
    } else {
      return false;
    }
  }
);
// console.log(display_applicantsData.value);

const finalListData = computed(() => {
  return display_applicantsData.value?.slice(
    (currentPage.value - 1) * tablePageCount,
    currentPage.value * tablePageCount
  );
});
const pageTotal = computed(() => {
  return display_applicantsData.value.length;
});

const formStateObjTemp = {
  name: "",
  t_number: "",
  user_id: "",
  selectedProjects: [],
};
const manuallyEnterFormState = ref<{
  name: string;
  t_number: string;
  user_id: string;
  // selectedProjects: Record<string, any>[];
  selectedProjects: { label: string; id: number; iconMeta: string }[];
}>(structuredClone(formStateObjTemp));
const applicantFormRef = ref();

const validateFormFunc = (): FormError[] => {
  const errors = [];
  if (!manuallyEnterFormState.value.name)
    errors.push({ path: "name", message: "选手姓名必填" });
  if (!manuallyEnterFormState.value.t_number)
    errors.push({ path: "t_number", message: "赛事编号必填" });
  if (!manuallyEnterFormState.value.user_id)
    errors.push({ path: "user_id", message: "用户 WCU_id 必填" });
  if (!(manuallyEnterFormState.value.selectedProjects.length !== 0))
    errors.push({ path: "selectedProjects", message: "项目必选" });
  return errors;
};

const uploadApplicantsExcelRef = ref<UploadInstance>();
const handleFileExceed: UploadProps["onExceed"] = (files) => {
  uploadApplicantsExcelRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadApplicantsExcelRef.value!.handleStart(file);
};
const applicantsExcelFileList = ref([]);

const route = useRoute();
const router = useRouter();
const routeParamId = route.params.t_id;

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
      // console.log(sheet1Data);
      // console.log();
      $fetch("/api/t_detail/t_applicants/createMany", {
        method: "POST",
        body: {
          data: sheet1Data,
        },
      });

      // $fetch('/api/t_detail/t_applicants/createMany', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/octet-stream',
      //   },
      //   body: loadEndEvent.target?.result,
      // });
    };
  }
};
const handleManualEnterApplicant = async () => {
  if (manuallyEnterFormState.value.selectedProjects.length === 0)
    naiveMessage.error("赛事项目未选，不可录入相关数据");
  console.log(await applicantFormRef.value.getErrors());
  if (await applicantFormRef.value.validate()) {
    // alert("赛事项目为空，不可相关录入数据");
    const asyncTasksArr: Promise<number>[] = [];
    manuallyEnterFormState.value.selectedProjects.forEach(
      async (item, index) => {
        const finalApplicantData = {
          t_number: +manuallyEnterFormState.value.t_number,
          user_id: +manuallyEnterFormState.value.user_id,
          name: manuallyEnterFormState.value.name,
          p_name: item.label,
          p_id: item.id,
          t_id: +routeParamId,
        };
        const enterDataTaskResult = $fetch(
          "/api/t_detail/t_applicants/createMany",
          {
            method: "POST",
            body: {
              data: [finalApplicantData],
            },
          }
        );
        asyncTasksArr.push(enterDataTaskResult);
      }
    );

    const asyncOperationResult = await Promise.all(asyncTasksArr);

    if (asyncOperationResult.every((item) => item === 1)) {
      alert("手动录入选手信息成功");
    } else alert("手动录入选手信息失败");
  } else {
    naiveMessage.error("输入有误，请检查必填项及各项内容是否填写正确");
  }
};
const onError = async (event: any) => {
  naiveMessage.error("输入有误，请检查必填项及各项内容是否填写正确");
};
const handleResetFormState = () => {
  manuallyEnterFormState.value = structuredClone(formStateObjTemp);
};
</script>
<template>
  <div class="rounded-b-10px bg-white">
    <!-- <div class="h-750px rounded-10px bg-white"> -->
    <!-- <div class="bg-primary_2 h-60px flex items-center rounded-t-10px">
      <div class="text-white text-30px ml-7 leading-30px">参赛选手</div>
    </div> -->
    <div class="px-3 py-4 flex gap-2">
      <div class="">
        <div class="h-590px border-#6F6F8B border bg-#F1F2FD">
          <div class="bg-primary_2 text-white h-48px flex items-center">
            <div class="text-18px ml-6 my-3">手动录入</div>
          </div>
          <div
            class="flex flex-col justify-between h-[calc(588px-48px)] pt-3 pr-5 pl-6 pb-5"
          >
            <div>
              <UForm
                class="flex flex-col gap-3"
                :state="manuallyEnterFormState"
                :validate="validateFormFunc"
                ref="applicantFormRef"
                @error="onError"
              >
                <UFormGroup label="姓名" :ui="formGroupUiStyle" required>
                  <UInput
                    :ui="inputUiStyle"
                    v-model="manuallyEnterFormState.name"
                  />
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
                <UFormGroup label="项目" :ui="formGroupUiStyle" required>
                  <USelectMenu
                    :options="t_projects_options"
                    placeholder="请选择参赛项目.."
                    v-model="manuallyEnterFormState.selectedProjects"
                    multiple
                  >
                    <template #label>
                      <span
                        v-if="manuallyEnterFormState.selectedProjects.length"
                        >{{
                          manuallyEnterFormState.selectedProjects
                            .map((item) => item.label)
                            .join(",")
                        }}</span
                      >
                      <span v-else>请设置参赛组别..</span>
                    </template>
                  </USelectMenu>
                </UFormGroup>
              </UForm>
            </div>
            <div class="flex gap-3 justify-center">
              <UButton
                class="bg-primary_2 active:opacity-80 rounded-24px w-96px h-42px flex justify-center"
                type="reset"
                @click="handleResetFormState"
                >重置</UButton
              >
              <!-- <input type="reset" value="Reset" /> -->
              <UButton
                class="bg-primary_1 active:opacity-80 rounded-24px w-96px h-42px flex justify-center leading-42px"
                @click="handleManualEnterApplicant"
                >确认</UButton
              >
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-20px">
          <el-upload
            ref="uploadApplicantsExcelRef"
            :file-list="applicantsExcelFileList"
            :auto-upload="false"
            :limit="1"
            action="none"
            class="relative flex flex-col"
            accept=".xlsx"
            :on-exceed="handleFileExceed"
            :on-change="handleUploadFileOnChange"
          >
            <!-- :action="" -->
            <!-- :action="formState.banner.uploadApiUrl" -->
            <!-- <template #trigger>
            </template> -->
            <UButton class="bg-primary_1 w-228px flex justify-center h-38px"
              >上传报名表单</UButton
            >
          </el-upload>
        </div>
      </div>

      <div class="w-full overflow-auto">
        <div
          class="w-full overflow-x-auto overflow-y-hidden border border-#6F6F8B"
        >
          <div class="w-full h-[calc(36px*16+12px)] h-588px">
            <UTable
              :columns="selectedColumns"
              :rows="finalListData"
              :ui="tableUiStyle"
            >
              <template
                v-for="item in columnsAttrs"
                v-slot:[`${item.key}-data`]="{ row }"
              >
                <div
                  class="bg-#FF8F6B w-16px h-16px rounded-full"
                  v-if="row[`${item.key}`] !== undefined"
                ></div>
              </template>
            </UTable>
            <!-- :rows="display_applicantsData" -->
          </div>
        </div>

        <div class="w-full flex justify-center mt-4">
          <UPagination
            :page-count="tablePageCount"
            :total="pageTotal"
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
<style scoped lang="scss">
::-webkit-scrollbar {
  width: 8px;
  display: none;
}
</style>
