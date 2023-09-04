spanspan
<script setup lang="ts">
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { genFileId } from 'element-plus';
import type { FormEvent, FormError } from '@nuxthq/ui/dist/runtime/types';

const formGroupUiStyle = {
  wrapper: 'flex items-center',
  label: {
    base: 'mr-3 font-sans whitespace-nowrap text-18px',
  },
  container: 'mt-0',
  error: 'text-red-400 dark:text-red-400 mt-1 text-14px',
};

const inputUiStyle = {
  rounded: 'rounded-10px',
  color: {
    white: {
      outline:
        'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary_1 dark:focus:ring-primary-400',
    },
  },
  base: 'relative block w-full disabled:cursor-not-allowed disabled:bg-#E5E5E5 focus:outline-none border-0 min-w-100px',
};

const t_format_options = [
  {
    id: 3,
    label: '五次去头去尾取平均',
  },
  {
    id: 4,
    label: '三次取平均',
  },
  {
    id: 2,
    label: '三次取最快',
  },
  {
    id: 5,
    label: '两次取最快',
  },
  {
    id: 1,
    label: '单次',
  },
];

const custom_project_options = ['签到', '休息', '抽奖', '颁奖'];

const itemList: {
  project_id: number;
  project_label: string;
  iconMeta: string;
}[] = [
  {
    project_id: 9,
    project_label: '智能三阶',
    iconMeta: 'i-custom-svg:ai-third-order',
  },
  {
    project_id: 1,
    project_label: '三阶',
    iconMeta: 'i-custom-svg:third-order',
  },
  {
    project_id: 3,
    project_label: '二阶',
    iconMeta: 'i-custom-svg:second-order',
  },
  {
    project_id: 5,
    project_label: '四阶',
    iconMeta: 'i-custom-svg:fourth-order',
  },
  {
    project_id: 10,
    project_label: '五阶',
    iconMeta: 'i-custom-svg:fifth-order',
  },
  {
    project_id: 11,
    project_label: '六阶',
    iconMeta: 'i-custom-svg:sixth-order',
  },
  {
    project_id: 12,
    project_label: '七阶',
    iconMeta: 'i-custom-svg:seventh-order',
  },
  {
    project_id: 8,
    project_label: '三盲',
    iconMeta: 'i-custom-svg:blindness-third-order',
  },
  {
    project_id: 18,
    project_label: '最少步',
    iconMeta: 'i-custom-svg:minimal-steps',
  },
  {
    project_id: 7,
    project_label: '单手',
    iconMeta: 'i-custom-svg:single-handedly',
  },
  {
    project_id: 19,
    project_label: '魔表',
    iconMeta: 'i-custom-svg:magic-watch',
  },
  {
    project_id: 14,
    project_label: '五魔方',
    iconMeta: 'i-custom-svg:megaminx',
  },
  {
    project_id: 2,
    project_label: '金字塔',
    iconMeta: 'i-custom-svg:pyramid',
  },
  {
    project_id: 4,
    project_label: '斜转',
    iconMeta: 'i-custom-svg:oblique-rotation',
  },
  {
    project_id: 13,
    project_label: 'SQ1',
    iconMeta: 'i-custom-svg:sq1',
  },
  {
    project_id: 15,
    project_label: '四盲',
    iconMeta: 'i-custom-svg:blindness-fourth-order',
  },
  {
    project_id: 16,
    project_label: '五盲',
    iconMeta: 'i-custom-svg:blindness-fifth-order',
  },
  {
    project_id: 17,
    project_label: '多盲',
    iconMeta: 'i-custom-svg:multiple-blindness',
  },
];

const tournament_mode_options = [
  {
    id: 1,
    label: '线下赛',
  },
  {
    id: 2,
    label: '线上赛',
  },
];
// const tournament_type_options = ['个人赛', '团体赛', '综合赛'];
const tournament_type_options = [
  {
    id: 1,
    label: '个人赛',
  },
  {
    id: 2,
    label: '团体赛',
  },
  {
    id: 3,
    label: '综合赛',
  },
];
const tournament_rounds_options: {
  rounds_total: number;
  rounds_label: string;
}[] = [
  {
    rounds_label: '1',
    rounds_total: 1,
  },
  {
    rounds_label: '2',
    rounds_total: 2,
  },
  {
    rounds_label: '3',
    rounds_total: 3,
  },
  {
    rounds_label: '4',
    rounds_total: 4,
  },
  {
    rounds_label: '5',
    rounds_total: 5,
  },
];
const display_order_options = [
  {
    label: '1',
    id: 1,
  },
  {
    label: '2',
    id: 2,
  },
  {
    label: '3',
    id: 3,
  },
  {
    label: '4',
    id: 4,
  },
  {
    label: '5',
    id: 5,
  },
];
const tournament_groups_options = ['U8', 'U12', 'U18', '公开组', '女子组'];
// const tournament_group_options = [
//   {
//     group_label: 'U8',
//     group_id: 1,
//   },
//   {
//     group_label: 'U12',
//     group_id: 2,
//   },
//   {
//     group_label: 'U18',
//     group_id: 3,
//   },
//   {
//     group_label: '公开组',
//     group_id: 4,
//   },
//   {
//     group_label: '女子组',
//     group_id: 5,
//   },
// ];

export interface ProjectDetailType {
  id: number;
  label: string;
  iconMeta?: string;
  passline: string | number;
  reduction_limit: string | number;
  rule_content: string;
  groups: string[];
  rounds: ProjectRoundsDetailType;
  project_id?: number;
  project_label?: string;
}
interface ProjectRoundsDetailType {
  // total: number|  | undefined;
  total: number;
  detail:
    | {
        promotion_quota: number;
        time_range: [string, string];
        t_format: number;
      }[]
    | [];
}
export type FinalFormStateType = {
  name: string;
  mode: Record<string, any> | undefined;
  type: Record<string, any> | undefined;
  apply_time_range: [string, string];
  time_range: [string, string];
  award_time_range: [string, string];
  signin_time_range: [string, string];
  lottery_time: { id: number; time_range: [string, string] }[];
  break_time: { id: number; time_range: [string, string] }[];
  [key: string]: any;
  projects_detail: ProjectDetailType[];
  display_on_homepage: boolean;
  display_order: number;
  //url: ; uploadApiUrl: ;
  banner: Record<string, any>;
};

const formState = ref<FinalFormStateType>({
  // const formState = ref<FormStateType>({
  name: '',
  mode: undefined,
  type: undefined,
  organizer: '',
  organizer_web_url: '',
  time_range: ['', ''],
  apply_time_range: ['', ''],
  //holdup ace 通常指代抢劫地点
  location: '',
  apply_condition: '',
  apply_condition_remarks: '',
  apply_quota: 0,
  //new
  apply_web_url: '',
  display_on_homepage: true,
  display_order: 0,
  banner: {
    name: 'zzx58',
    url: 'https://p9-passport.byteacctimg.com/img/user-avatar/59296777f828ae4101819744e0ef154c~64x64.awebp',
    uploadApiUrl: '',
  },
  projects_detail: [],
  award_time_range: ['', ''],
  signin_time_range: ['', ''],
  lottery_time: [{ id: 1, time_range: ['', ''] }],
  break_time: [{ id: 1, time_range: ['', ''] }],
});
// satisfies FinalFormStateType);

//赛事编辑
const route = useRoute();
const router = useRouter();
const routeParamId = route.params.id;
let t_exist: boolean;
onBeforeMount(async () => {
  if (routeParamId) {
    const { data: t_data } = await useFetch<FinalFormStateType | null>(
      `/api/t_info/${routeParamId}`
    );
    // console.log(t_data.value);
    if (!t_data.value) {
      t_exist = false;
      router.push('/t_info');
      alert('赛事不存在');
      // console.log('afterNav,id:', routeParamId);
      // throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
    }
    if (t_data.value) {
      formState.value = t_data.value;
      t_exist = true;
    }
  }
  formState.value.projects_detail.forEach((item) => {
    const selectedProject = {
      project_id: item.id,
      project_label: item.label,
      iconMeta: item.iconMeta,
    };
    t_create_preset_selected_projects.value.push(selectedProject);
  });
  t_create_preset_selected_projects_detail.value =
    formState.value.projects_detail.map((item) => item);
  // console.log(formState.value);
});

const t_create_preset_selected_projects = ref<
  {
    project_label: string;
    project_id: number;
    iconMeta?: string;
  }[]
>([]);
const createProjectDetailTemplate: ProjectDetailType = {
  id: 0,
  label: '',
  groups: [],
  rounds: {
    total: 0,
    detail: [],
  },
  rule_content: '',
  reduction_limit: '',
  passline: '',
};
const t_create_preset_selected_projects_detail = ref<ProjectDetailType[]>([]);
const t_create_custom_created_projects_detail = ref<ProjectDetailType[]>([
  structuredClone(createProjectDetailTemplate),
]);

const numberToChineseNumber = (number: number) => {
  const chineseNumbers = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
    '十三',
    '十四',
    '十五',
    '十六',
    '十七',
    '十八',
    '十九',
    '二十',
  ];
  if (number >= 0 && number <= 20) {
    return chineseNumbers[number];
  } else return number.toString();
};

const uploadBannerRef = ref<UploadInstance>();
const isUploadConfirmModalOpen = ref(false);
const loadingState = ref(false);
const submitBannerUpload = () => {
  loadingState.value = true;
  uploadBannerRef.value?.submit();
  //下行模拟上传内容更新
  //设置延迟
  setTimeout(() => {
    loadingState.value = false;
  }, 1000);
  formState.value.tournament_banner.url = '';
  setTimeout(() => {
    isUploadConfirmModalOpen.value = false;
  }, 1000);
};
const handleUploadExceed: UploadProps['onExceed'] = (files) => {
  uploadBannerRef.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadBannerRef.value?.handleStart(file);
};

// const handleAddCustomCreatedProject = () => {
//   t_create_custom_created_projects_detail.value.push(
//     // Object.assign({}, createProjectDetailTemplate)
//     structuredClone(createProjectDetailTemplate)
//   );
//   console.log(t_create_custom_created_projects_detail.value.length);
// };

let selectedProjectChange = ref(0);
const customDeletedItemRef = ref();
let customCheckDeletedItem = (deletedItem: []) => {
  customDeletedItemRef.value = deletedItem;
};

watchEffect(() => {
  if (
    selectedProjectChange.value > t_create_preset_selected_projects.value.length
  ) {
    selectedProjectChange.value -= 1;
    let deleteTargetIndex =
      t_create_preset_selected_projects_detail.value.findIndex((item) => {
        return item.project_id === customDeletedItemRef.value[0].project_id;
      });
    if (deleteTargetIndex !== -1) {
      t_create_preset_selected_projects_detail.value.splice(
        deleteTargetIndex,
        1
      );
    }
    console.log(deleteTargetIndex);
    console.log(t_create_preset_selected_projects_detail.value);
  }
  if (
    selectedProjectChange.value < t_create_preset_selected_projects.value.length
  ) {
    selectedProjectChange.value += 1;
    //没法使用 foreach，比赛项目是能够取消的，而自定义项目没有取消的选项，所以自定义项目可以直接 push
    // t_create_preset_selected_projects_detail.value = t_create_preset_selected_projects.value.map(item => {
    //   return Object.assign({}, createProjectDetailTemplate, item);
    // })
    //取数组最后一个元素的方法有两个：一个通过索引-（length-1），但是如果数组为空会报错；另一个通过 slice 方法，返回一个新数组，包含从开始索引到结束索引的部分元素，该方法可以较好地处理空数组情况。
    let appendItem = t_create_preset_selected_projects.value.slice(-1)[0];
    let tempPSPDObj = Object.assign(createProjectDetailTemplate, appendItem);
    t_create_preset_selected_projects_detail.value.push(
      structuredClone(tempPSPDObj)
    );
    // console.log(
    //   '用户新增了一个项目的选择',
    //   'count:' + selectedProjectChange.value,
    //   'selected:' + t_create_preset_selected_projects_detail.value.length
    // );
  } else {
  }
});

interface RuleNeededAttr {
  custom_project_detail: ProjectDetailType[];
  selected_project_detail: ProjectDetailType[];
  t_name: string;
  t_mode: string;
  t_type: string;
}

const validateRules = (): FormError[] => {
  const errors = [];
  let specificTargetObj = {} as RuleNeededAttr;
  specificTargetObj['t_name'] = formState.value.tournament_name;
  specificTargetObj['t_mode'] = formState.value.tournament_mode;
  specificTargetObj['t_type'] = formState.value.tournament_type;
  specificTargetObj['custom_project_detail'] =
    t_create_custom_created_projects_detail.value;
  specificTargetObj['selected_project_detail'] =
    t_create_preset_selected_projects_detail.value;

  if (!specificTargetObj.t_name)
    errors.push({ path: 't_name', message: '比赛名称必填' });
  if (!specificTargetObj.t_mode)
    errors.push({ path: 't_mode', message: '比赛模式必选' });
  if (!specificTargetObj.t_type)
    errors.push({ path: 't_type', message: '比赛类型必选' });
  if (specificTargetObj.selected_project_detail.length === 0) {
    specificTargetObj.custom_project_detail.forEach((item, index) => {
      if (!item.label)
        errors.push({
          path: `custom_project_label${index}`,
          message: '自定义项目名称必填',
        });
    });
  }

  // return errors;
  return [];
};

//赛事创建
const formRef = ref();
const handleCreateTournament = async () => {
  // const solved_custom_projects_detail = toRaw(
  //   t_create_custom_created_projects_detail.value
  // );
  const solved_selected_projects_detail = toRaw(
    t_create_preset_selected_projects_detail.value
  );
  //toRaw => 返回由 reactive() 、等创建的代理对应的原始对象
  const solved_formState = toRaw(formState.value);

  const formValidState = await formRef.value.validate();
  formValidState &&
    (solved_formState.projects_detail = [
      // ...solved_custom_projects_detail,
      ...solved_selected_projects_detail,
    ]);

  // solved_formState.projects_detail = solved_formState.projects_detail.filter(
  //   (item) => item.label.trim() || item.project_id
  // );
  console.log(
    // formValidState,
    'solved_formState',
    solved_formState
  );
  const route = useRoute();
  const router = useRouter();
  const routeParamId = route.params.id;
  if (t_exist) {
    $fetch('/api/t_info/t_create', {
      method: 'post',
      body: {
        id: routeParamId,
        t_create_form: solved_formState,
      },
    })
      .then((m) => {
        console.log(m);
        alert(m);
      })
      .catch((e) => alert(e));
  } else {
    $fetch('/api/t_info/t_create', {
      method: 'post',
      body: {
        t_create_form: solved_formState,
        // t_create_form: newObj,
      },
    })
      .then((m) => {
        console.log(m);
        alert(m);
        navigateTo('/t_list');
      })
      .catch((e) => alert(e));
  }
};
const handlePresetProjectRoundsChange = (
  e: any,
  presetProjectIndex: number
) => {
  let tempDetailWithClone = toRaw(
    t_create_preset_selected_projects_detail.value[presetProjectIndex].rounds
      .detail
  );
  t_create_preset_selected_projects_detail.value[
    presetProjectIndex
  ].rounds.detail = Array.from({ length: e }, (_, index) =>
    reactive({
      promotion_quota: 0,
      time_range: ['', ''],
      t_format: 0,
    })
  );
  //结果，引用类型，toRaw 能保留内容。但是最终结果里，没有呈现出预想的结果。
  //因为 window console 的实时性，直接查看 tempDetail 的前后值意义不大。通过事实证明了这一点。这里数据丢失的问题可以通过手动赋值解决。因为 赋值 detail 新的空初始数组了。
  //问题解决。Hack 方式。
  tempDetailWithClone.map((item, index) => {
    // tempDetail[index].time_range = item.time_range;
    t_create_preset_selected_projects_detail.value[
      presetProjectIndex
    ].rounds.detail[index].time_range = item.time_range;
  });
};

const handleAddBreakTimeRoundsChange = () => {
  formState.value.break_time.push(
    reactive({
      id: formState.value.break_time.length + 1,
      time_range: ['', ''],
    })
  );
};
const handleAddLotteryTimeRoundsChange = () => {
  formState.value.lottery_time.push(
    reactive({
      id: formState.value.lottery_time.length + 1,
      time_range: ['', ''],
    })
  );
};
</script>
<template>
  <UForm
    ref="formRef"
    :state="formState"
    class="space-y-6"
    :validate="validateRules"
  >
    <UFormGroup :ui="formGroupUiStyle" label="比赛名称" name="t_name">
      <UInput :ui="inputUiStyle" v-model="formState.name" :disabled="false" />
    </UFormGroup>
    <div class="flex space-x-9">
      <UFormGroup :ui="formGroupUiStyle" label="比赛模式" name="t_mode">
        <USelectMenu
          v-model="formState.mode"
          :options="tournament_mode_options"
          placeholder="请选择比赛模式.."
          option-attribute="label"
          :disabled="false"
        >
        </USelectMenu>
      </UFormGroup>
      <UFormGroup :ui="formGroupUiStyle" label="比赛类型" name="t_type">
        <!-- value-attribute="type_id" -->
        <USelectMenu
          v-model="formState.type"
          :options="tournament_type_options"
          option-attribute="label"
          placeholder="请选择比赛类型.."
          :disabled="false"
        >
          <!-- <template #label>
            <span v-if="formState.type">{{
              tournament_type_options.find((item) => item.id === formState.type)
                ?.label
            }}</span>
            <span v-else>请选择比赛类型..</span>
          </template> -->
        </USelectMenu>
      </UFormGroup>
    </div>
    <!-- <div class="flex space-x-9"> -->
    <div class="flex flex-wrap gap-5">
      <UFormGroup :ui="formGroupUiStyle" label="主办方">
        <UInput
          class="min-w-200px"
          :ui="inputUiStyle"
          v-model="formState.organizer"
          :disabled="false"
        />
      </UFormGroup>
      <UFormGroup :ui="formGroupUiStyle" label="主办网站">
        <UInput
          class="min-w-200px"
          :ui="inputUiStyle"
          v-model="formState.organizer_web_url"
          :disabled="false"
        />
      </UFormGroup>
      <UFormGroup :ui="formGroupUiStyle" label="报名网站">
        <UInput
          class="min-w-200px"
          :ui="inputUiStyle"
          v-model="formState.apply_web_url"
          :disabled="false"
        />
      </UFormGroup>
    </div>
    <!-- <div class="flex space-x-9"> -->
    <div class="flex flex-wrap gap-5">
      <UFormGroup :ui="formGroupUiStyle" label="比赛时间" class="items-center">
        <el-date-picker
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="large"
          v-model="formState.time_range"
          value-format="X"
          format="YYYY-MM-DD HH:mm"
        />
      </UFormGroup>
      <UFormGroup
        :ui="formGroupUiStyle"
        label="报名起止时间"
        class="items-center"
      >
        <el-date-picker
          type="datetimerange"
          placeholder="选择报名截止时间"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="large"
          v-model="formState.apply_time_range"
          value-format="X"
          format="YYYY-MM-DD HH:mm"
        />
      </UFormGroup>
    </div>
    <UFormGroup :ui="formGroupUiStyle" label="比赛地点">
      <UInput
        class="min-w-340px"
        :ui="inputUiStyle"
        v-model="formState.location"
        :disabled="false"
      />
    </UFormGroup>
    <!-- <div class="flex space-x-9"> -->
    <div class="flex flex-wrap gap-5">
      <UFormGroup :ui="formGroupUiStyle" label="比赛条件">
        <UInput
          :ui="inputUiStyle"
          v-model="formState.apply_condition"
          :disabled="false"
        />
      </UFormGroup>
      <UFormGroup :ui="formGroupUiStyle" label="备注">
        <UInput
          :ui="inputUiStyle"
          v-model="formState.apply_condition_remarks"
          :disabled="false"
        />
      </UFormGroup>
      <UFormGroup :ui="formGroupUiStyle" label="报名名额">
        <UInput
          :ui="inputUiStyle"
          v-model="formState.apply_quota"
          :disabled="false"
          type="number"
        />
      </UFormGroup>
    </div>

    <div class="">
      <UFormGroup
        :ui="
          Object.assign({}, formGroupUiStyle, {
            wrapper: 'flex items-start',
            label: {
              base: 'mr-3 mt-2 font-sans whitespace-nowrap text-18px',
            },
          })
        "
        label="比赛项目"
      >
        <CustomCheckGroup
          :model-value="t_create_preset_selected_projects"
          @deleted-item="customCheckDeletedItem"
          :items-list="itemList"
          class="border box-border border-1px border-solid border-gray-300 rounded-10px p-3 min-w-340px bg-white text-primary_2 leading-28px grid grid-rows-2 grid-cols-9 gap-2"
        >
          <template #item="{ itemData, isItemSelected }">
            <div
              :class="`group flex flex-col items-center ${
                isItemSelected(itemData) ? 'text-primary_1' : ''
              }`"
            >
              <div
                :class="`${itemData.iconMeta} text-28px group-hover:bg-primary_1 group-hover:opacity-50`"
              />
              <label :class="`text-12px group-hover:text-primary_1`">{{
                itemData.project_label
              }}</label>
            </div>
          </template>
        </CustomCheckGroup>
      </UFormGroup>
    </div>

    <UFormGroup
      v-if="t_create_preset_selected_projects.length"
      :ui="
        Object.assign({}, formGroupUiStyle, {
          wrapper: 'flex items-start',
          label: {
            base: 'mr-3 mt-2 font-sans whitespace-nowrap text-18px',
          },
        })
      "
      label="比赛规则"
      name="customCreateProjectDetail"
    >
      <div class="space-y-5">
        <div
          class="flex items-center gap-2 flex-wrap"
          v-for="(project, index) in t_create_preset_selected_projects"
          :key="index"
        >
          <span font-bold mr-1>项目{{ numberToChineseNumber(index) }}</span>
          <span>{{ project.project_label }}</span>
          <div class="flex items-center space-x-2">
            <span>赛程为</span>
            <USelectMenu
              v-model="
                t_create_preset_selected_projects_detail[index].rounds.total
              "
              :options="tournament_rounds_options"
              option-attribute="rounds_label"
              value-attribute="rounds_total"
              placeholder="请选择比赛轮次.."
              @change="
                (e) => {
                  handlePresetProjectRoundsChange(e, index);
                }
              "
            >
              <template #label>
                <span
                  v-if="
                    t_create_preset_selected_projects_detail[index].rounds.total
                  "
                  >{{
                    t_create_preset_selected_projects_detail[index].rounds.total
                  }}</span
                >
                <span v-else>请选择比赛轮次..</span>
              </template>
            </USelectMenu>
            <span> 轮，</span>
          </div>
          <div class="flex items-center space-x-2">
            <span> 分别设置 </span>
            <USelectMenu
              v-model="t_create_preset_selected_projects_detail[index].groups"
              option-attribute="group_label"
              :options="tournament_groups_options"
              placeholder="请设置比赛组别.."
              multiple
            >
              <template #label>
                <span
                  v-if="
                    t_create_preset_selected_projects_detail[index].groups
                      .length
                  "
                  >{{
                    t_create_preset_selected_projects_detail[index].groups
                      .map((item) => item)
                      .join(',')
                  }}</span
                >
                <span v-else>请设置参赛组别..</span>
              </template>
            </USelectMenu>
            <span> 组。</span>
          </div>
          <!-- rounds_dynamic -->
          <div
            v-if="t_create_preset_selected_projects_detail[index].rounds.total"
            class="space-y-2 basis-100%"
          >
            <!--  -->
            <div
              v-for="(item, i) in t_create_preset_selected_projects_detail[
                index
              ].rounds.detail"
              class=""
            >
              <div class="flex leading-32px items-center gap-2 flex-wrap">
                <UFormGroup
                  :label="`第${numberToChineseNumber(i)}轮`"
                  :ui="
                    Object.assign(formGroupUiStyle, {
                      label: {
                        base: 'mr-3 font-sans whitespace-nowrap text-16px leading-32px flex',
                      },
                      wrapper: 'flex items-center',
                      container: 'mt-0',
                    })
                  "
                >
                  <el-date-picker
                    type="datetimerange"
                    start-placeholder="轮次开始时间"
                    end-placeholder="轮次结束时间"
                    size="default"
                    range-separator="到"
                    value-format="X"
                    v-model:model-value="item.time_range"
                    format="YYYY-MM-DD HH:mm"
                    @update:model-value="
                        (e) => {
                          (item.time_range as any).value = e;
                        }
                      "
                  />
                  <!-- :model-value="item.time_range" -->
                </UFormGroup>
                <div class="flex gap-2">
                  <span>本轮赛制</span>
                  <USelectMenu
                    :options="t_format_options"
                    option-attribute="label"
                    value-attribute="id"
                    v-model="item.t_format"
                    placeholder="请选择本轮赛制.."
                  >
                    <template #label>
                      <span v-if="item.t_format">
                        {{
                          t_format_options.find(
                            (itemB) => itemB.id === item?.t_format
                          )?.label
                        }}
                      </span>
                      <span v-else>请选择本轮赛制..</span>
                    </template>
                  </USelectMenu>
                  <span
                    v-if="
                      i !==
                      t_create_preset_selected_projects_detail[index].rounds
                        .detail.length -
                        1
                    "
                    >,</span
                  >
                  <span v-else>。</span>
                </div>
                <div
                  class="flex gap-2"
                  v-if="
                    i !==
                    t_create_preset_selected_projects_detail[index].rounds
                      .detail.length -
                      1
                  "
                >
                  <span>晋级名额：</span>
                  <div flex w-150px>
                    <span>前</span>
                    <!-- :ui="inputUiStyle" -->

                    <UInput
                      v-model="item.promotion_quota"
                      :ui="inputUiStyle"
                      type="number"
                    />
                    <span>人</span>
                  </div>
                  <span>晋级下一轮。</span>
                </div>
                <!--  -->
              </div>
            </div>

            <!--  -->
          </div>
          <!--  -->
          <!--  -->
          <div class="basis-100% flex items-center flex-wrap gap-2">
            <div class="flex items-center space-x-2 whitespace-nowrap w-200px">
              <span>及格线</span>
              <UInput
                :ui="inputUiStyle"
                :model-value="
                  t_create_preset_selected_projects_detail[index].passline
                "
                @update:model-value="
                  (e) =>
                    (t_create_preset_selected_projects_detail[index].passline =
                      e)
                "
                type="number"
              />
              <span>秒，</span>
            </div>
            <div class="flex items-center space-x-2 whitespace-nowrap w-200px">
              <span>还原时限</span>
              <UInput
                :ui="inputUiStyle"
                :model-value="
                  t_create_preset_selected_projects_detail[index]
                    .reduction_limit
                "
                @update:model-value="
                  (e) =>
                    (t_create_preset_selected_projects_detail[
                      index
                    ].reduction_limit = e)
                "
                type="number"
              />
              <span>秒</span>
            </div>
          </div>
          <!-- rounds_dynamic -->
          <div class="basis-100% min-w-340px max-w-732px">
            <UTextarea
              placeholder="比赛详细规则 选填"
              v-model="
                t_create_preset_selected_projects_detail[index].rule_content
              "
              :ui="inputUiStyle"
            />
          </div>
        </div>

        <!-- <div class="space-y-5">
          <div
            class="flex items-center gap-2 flex-wrap"
            v-for="(project, index) in t_create_custom_created_projects_detail"
            :key="index"
          > -->
        <!--  -->
        <!-- <div class="flex gap-2 flex-wrap">
              <UFormGroup
                :label="`流程`"
                :ui="{
                  wrapper: 'flex items-start space-x-2',
                  container: '',
                  label: {
                    base: ' text-16px font-bold mt-2',
                  },
                  error: 'mt-1 text-red-400 dark:text-red-400 text-14px',
                }"
                :name="`custom_project_label${index}`"
              > -->
        <!-- :required="t_create_preset_selected_projects.length === 0" -->
        <!-- <UInput
                  v-model="t_create_custom_created_projects_detail[index].label"
                  placeholder="请输入项目名称.."
                  :ui="inputUiStyle"
                /> -->
        <!-- <USelectMenu
                  v-model="t_create_custom_created_projects_detail[index].label"
                  :options="custom_project_options"
                  option-attribute="label"
                  placeholder="请选择流程环节.."
                />
              </UFormGroup> -->
        <!--  -->
        <!-- <div class="flex items-center flex-wrap gap-2">
                <span>共</span>
                <USelectMenu
                  v-model="
                    t_create_custom_created_projects_detail[index].rounds.total
                  "
                  :options="tournament_rounds_options"
                  placeholder="请选择总轮次.."
                  @change="
                    (e) => {
                      project.rounds.detail = Array.from(
                        { length: e },
                        (_, index) => ({
                          time_range: ['', ''],
                          promotion_quota: 0,
                          t_format: 0,
                        })
                      );
                    }
                  "
                ></USelectMenu>
                <span>轮。</span>
              </div> -->
        <!--  -->
        <!-- <div class="basis-100%">
                <div v-if="project.rounds.total" class="gap-1 flex flex-col">
                  <div
                    class="relative"
                    v-for="(item, index) in project.rounds.detail"
                    :key="index"
                  > -->
        <!--  -->
        <!-- <div class="flex leading-32px items-center flex-wrap gap-1">
                      <UFormGroup
                        :label="`第${numberToChineseNumber(index)}轮从`"
                        :ui="
                          Object.assign(formGroupUiStyle, {
                            label: {
                              base: 'mr-3 font-sans whitespace-nowrap text-16px leading-32px font-medium',
                            },
                            wrapper: 'flex items-center',
                            container: 'mt-0',
                          })
                        "
                      >
                        <el-date-picker
                          type="datetimerange"
                          start-placeholder="轮次开始时间"
                          end-placeholder="轮次结束时间"
                          size="default"
                          range-separator="到"
                          value-format="X"
                          :model-value="item.time_range"
                          @update:model-value="(e) => (item.time_range = e)"
                        />
                        <span>。</span>
                      </UFormGroup>
                    </div> -->
        <!--  -->
        <!-- </div> -->
        <!--  -->
        <!-- </div>
              </div> -->
        <!-- </div>
          </div>
        </div>
      </div> -->
      </div>
    </UFormGroup>
    <div class="flex flex-wrap gap-5">
      <UFormGroup :ui="formGroupUiStyle" label="签到时间" class="items-center">
        <el-date-picker
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="default"
          v-model="formState.signin_time_range"
          value-format="X"
          format="YYYY-MM-DD HH:mm"
        />
      </UFormGroup>
      <UFormGroup :ui="formGroupUiStyle" label="颁奖时间" class="items-center">
        <el-date-picker
          type="datetimerange"
          placeholder="颁奖时间"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="default"
          v-model="formState.award_time_range"
          value-format="X"
          format="YYYY-MM-DD HH:mm"
        />
      </UFormGroup>
    </div>
    <div class="flex flex-col gap-2">
      <div v-for="(item, index) in formState.break_time" :key="item.id">
        <div class="flex gap-2 relative">
          <UFormGroup
            :label="`第${numberToChineseNumber(index)}轮 休息时间`"
            :ui="
              Object.assign(formGroupUiStyle, {
                label: {
                  base: 'mr-3 font-sans whitespace-nowrap text-16px leading-32px flex',
                },
                wrapper: 'flex items-center',
                container: 'mt-0',
              })
            "
          >
            <el-date-picker
              type="datetimerange"
              start-placeholder="轮次开始时间"
              end-placeholder="轮次结束时间"
              size="default"
              range-separator="到"
              value-format="X"
              v-model="formState.break_time[index].time_range"
              format="YYYY-MM-DD HH:mm"
            />
          </UFormGroup>
          <div
            v-if="index === formState.break_time.length - 1"
            @click="handleAddBreakTimeRoundsChange"
            class="group text-24px flex items-center"
          >
            <!-- <div class="i-carbon-add-alt text-#282867 absolute" /> -->
            <div
              class="i-carbon-add-filled text-#81819D absolute group-hover:opacity-60 group-active:opacity-85"
            />
            <div
              class="i-carbon-add text-#282867 absolute group-hover:opacity-60 group-active:opacity-85"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div v-for="(item, index) in formState.lottery_time" :key="item.id">
        <div class="flex gap-2 relative">
          <UFormGroup
            :label="`第${numberToChineseNumber(index)}轮 抽奖时间`"
            :ui="
              Object.assign(formGroupUiStyle, {
                label: {
                  base: 'mr-3 font-sans whitespace-nowrap text-16px leading-32px flex',
                },
                wrapper: 'flex items-center',
                container: 'mt-0',
              })
            "
          >
            <el-date-picker
              type="datetimerange"
              start-placeholder="轮次开始时间"
              end-placeholder="轮次结束时间"
              size="default"
              range-separator="到"
              value-format="X"
              v-model="formState.lottery_time[index].time_range"
              format="YYYY-MM-DD HH:mm"
            />
          </UFormGroup>
          <div
            v-if="index === formState.lottery_time.length - 1"
            @click="handleAddLotteryTimeRoundsChange"
            class="group text-24px flex items-center"
          >
            <!-- <div class="i-carbon-add-alt text-#282867 absolute" /> -->
            <div
              class="i-carbon-add-filled text-#81819D absolute group-hover:opacity-60 group-active:opacity-85"
            />
            <div
              class="i-carbon-add text-#282867 absolute group-hover:opacity-60 group-active:opacity-85"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex space-x-9 items-center">
      <UFormGroup
        :ui="formGroupUiStyle"
        label="是否上首页赛事展示"
        class="items-center"
      >
        <el-switch
          v-model="formState.display_on_homepage"
          style="--el-switch-off-color: #70708c; --el-switch-on-color: #ff8f6b"
          size="large"
          active-text="是"
          inactive-text="否"
          inline-prompt
        />
      </UFormGroup>
      <UFormGroup :ui="formGroupUiStyle" label="展示排序">
        <USelectMenu
          placeholder="请选择展示排序.."
          :options="display_order_options"
          option-attribute="label"
          value-attribute="id"
          v-model="formState.display_order"
        >
          <template #label>
            <span v-if="formState.display_order">
              {{
                display_order_options.find(
                  (item) => item.id === formState.display_order
                )?.label
              }}
            </span>
            <span v-else>请选择展示排序..</span>
          </template>
        </USelectMenu>
      </UFormGroup>
    </div>
    <div class="flex items-center">
      <label class="mr-3">赛事横幅</label>
      <el-image
        class="border border-1 border-solid border-gray-300 h-64px w-256px rounded-10px mr-9"
        :src="formState.banner.url"
        fit="contain"
        :preview-src-list="[formState.banner.url]"
      >
        <template #error>
          <div class="flex justify-center items-center h-full bg-white">
            <div
              class="i-custom-svg:image-placeholder text-#E6EDFF text-44px"
            />
          </div>
        </template>
      </el-image>
      <el-upload
        ref="uploadBannerRef"
        :auto-upload="false"
        :action="formState.banner.uploadApiUrl"
        :limit="1"
        :on-exceed="handleUploadExceed"
        class="relative flex"
      >
        <template #trigger>
          <UButton
            class="mr-5 bg-primary_1 hover:bg-primary_1 active:opacity-80"
          >
            选择图片
          </UButton>
        </template>
        <UModal v-model="isUploadConfirmModalOpen" :overlay="true">
          <div class="m-4 flex flex-col items-center">
            <div class="text-14px w-160px mb-4 text-center">
              新上传的文件将覆盖原有上传文件,确定操作？
            </div>
            <div class="flex justify-around">
              <UButton
                @click="
                  () => {
                    submitBannerUpload();
                  }
                "
                class="bg-primary_2 hover:bg-primary_2 hover:opacity-80 disabled:bg-primary_2"
                :loading="loadingState"
                >确认上传</UButton
              >
            </div>
          </div>
        </UModal>
        <UButton
          class="bg-primary_2 hover:bg-primary_2 hover:opacity-80"
          @click="isUploadConfirmModalOpen = true"
          >上传图片</UButton
        >
      </el-upload>
    </div>
    <!-- space-y-6, after that i can't change the items margin? -->
    <div class="flex justify-center items-center pt-9">
      <UButton
        class="bg-primary_1 active:bg-opacity-80 w-120px h-48px justify-center rounded-24px"
        @click="handleCreateTournament()"
        >确认创建</UButton
      >
    </div>
  </UForm>
</template>
<style scoped lang="scss"></style>
