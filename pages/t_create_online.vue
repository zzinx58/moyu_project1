//赛事管理-赛事创建-线上赛
<script setup lang="ts">
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { genFileId } from "element-plus";

definePageMeta({
  layout: "pc",
  middleware: ["auth"],
});

const selectUiStyle = {
  base: "relative block w-full disabled:cursor-not-allowed disabled:bg-#e5e5e5 focus:outline-none border-0",
};
const selectMenuUiStyle = {
  option: {
    disabled: "cursor-not-allowed opacity-50 bg-#E5E5E5",
  },
};
const formGroupUiStyle = {
  wrapper: "flex items-center",
  label: {
    base: "mr-3 font-sans whitespace-nowrap text-16px",
  },
  container: "mt-0",
};
const inputUiStyle = {
  rounded: "rounded-10px",
  color: {
    white: {
      outline:
        "shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary_1 dark:focus:ring-primary-400",
    },
  },
  base: "relative block w-full disabled:cursor-not-allowed disabled:bg-#E5E5E5 focus:outline-none border-0",
};

const TournamentRounds: { id: number }[] = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
];
const TournamentProjects: {
  id: number;
  tournament_type: string;
  label: string;
  disabled?: boolean;
}[] = [
  {
    id: 1,
    tournament_type: "third_order",
    label: "三阶",
  },
  {
    id: 2,
    tournament_type: "pyramid",
    label: "金字塔",
  },
  {
    id: 3,
    tournament_type: "second_order",
    label: "二阶",
  },
  {
    id: 4,
    tournament_type: "oblique_rotation",
    label: "斜转",
  },
  {
    id: 5,
    tournament_type: "fourth_order",
    label: "四阶",
  },
  {
    id: 6,
    tournament_type: "funny_project",
    label: "趣味项目",
  },
  {
    id: 7,
    tournament_type: "singal-handedly",
    label: "单手",
  },
  {
    id: 8,
    tournament_type: "blindness_third_order",
    label: "三盲",
  },
  {
    id: 9,
    tournament_type: "ai-third-oder",
    label: "智能三阶",
  },
  {
    id: 10,
    tournament_type: "fifth-order",
    label: "五阶",
  },
  {
    id: 11,
    tournament_type: "sixth-order",
    label: "六阶",
  },
  {
    id: 12,
    tournament_type: "seventh_order",
    label: "七阶",
  },
  {
    id: 13,
    tournament_type: "sq1",
    label: "SQ1",
  },
  {
    id: 14,
    tournament_type: "megaminx",
    label: "五魔方",
  },
  {
    id: 15,
    tournament_type: "blindness_fourth_order",
    label: "四盲",
  },
  {
    id: 16,
    tournament_type: "blindness_fifth_oder",
    label: "五盲",
  },
  {
    id: 17,
    tournament_type: "multiple_blindness",
    label: "多盲",
  },
  {
    id: 18,
    tournament_type: "minimal_steps",
    label: "最少步",
  },
  {
    id: 19,
    tournament_type: "magic-watch",
    label: "魔表",
  },
  {
    id: 20,
    tournament_type: "foot_screw",
    label: "脚拧",
  },
];

const formState = ref({
  tournament_state: {},
  tournament_name: "",
  tournament_mode: "123",
  tournament_type: "231",
  tournament_organizer: "",
  tournament_organizer_weburl: "",
  tournament_time_range: "",
  tournament_register_deadline: "",
  tournament_register_conditions: "",
  tournament_remarks: "",
  tournament_player_quota: 0,
  tournament_project: "",
  tournament_rounds: 1,
  tournament_display_on_home: true,
  tournament_display_order: 0,
  tournament_banner: {
    name: "zzx58",
    url: "https://p9-passport.byteacctimg.com/img/user-avatar/59296777f828ae4101819744e0ef154c~64x64.awebp",
    uploadApiUrl: "",
  },
});
const tournament_mode_options = [
  {
    type_id: "2",
    name: "线上赛",
    value: "online",
  },
  {
    type_id: "1",
    name: "线下赛",
    value: "offline",
  },
];
const tournament_type_options = [
  {
    name: "个人赛",
    value: "individual",
  },
];
const tournament_project_options = [
  {
    name: "智能三阶",
    value: "ai_third_order",
  },
];

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
  formState.value.tournament_banner.url = "";
  setTimeout(() => {
    isUploadConfirmModalOpen.value = false;
  }, 1000);
  // console.log(
  //   formState.value.tournament_register_deadline,
  //   formState.value.tournament_time_range
  // );
};
const handleUploadExceed: UploadProps["onExceed"] = (files) => {
  uploadBannerRef.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadBannerRef.value?.handleStart(file);
};
</script>
<template>
  <div class="flex flex-col justify-between">
    <!-- <div class="text-20px text-primary_1">{{ $route.name }}</div> -->
    <!-- <UButton class="bg-primary_1 hover:bg-red-1 rounded-24px">123</UButton> -->
    <UForm :state="formState" ref="formData" class="space-y-6">
      <UFormGroup label="比赛名称" :ui="formGroupUiStyle">
        <UInput
          :ui="inputUiStyle"
          v-model="formState.tournament_name"
          :disabled="!!formState.tournament_name"
        />
      </UFormGroup>
      <div class="flex space-x-9">
        <UFormGroup label="比赛模式" :ui="formGroupUiStyle">
          <USelectMenu
            :ui="selectUiStyle"
            v-model="formState.tournament_mode"
            :options="tournament_mode_options"
            option-attribute="name"
            placeholder="请选择比赛模式.."
            :disabled="!!formState.tournament_mode"
          />
        </UFormGroup>
        <UFormGroup label="比赛类型" :ui="formGroupUiStyle">
          <USelectMenu
            :ui="selectUiStyle"
            v-model="formState.tournament_type"
            :options="tournament_type_options"
            option-attribute="name"
            placeholder="请选择比赛类型.."
            :disabled="!!formState.tournament_type"
          />
        </UFormGroup>
      </div>
      <div class="flex space-x-9">
        <UFormGroup label="主办方" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
        <UFormGroup label="主办网站" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
      </div>
      <div class="flex space-x-9">
        <UFormGroup label="比赛时间" :ui="formGroupUiStyle">
          <el-date-picker
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="large"
            v-model="formState.tournament_time_range"
          />
        </UFormGroup>
        <UFormGroup label="报名截止时间" :ui="formGroupUiStyle">
          <el-date-picker
            type="datetime"
            placeholder="选择报名截止时间"
            size="large"
            v-modal="formState.tournament_register_deadline"
          />
        </UFormGroup>
      </div>
      <div class="flex space-x-9">
        <UFormGroup label="报名条件" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
        <UFormGroup label="备注" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
        <UFormGroup label="报名名额" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
      </div>
      <!-- <USelect
          :class="selectUiStyle"
          v-model="formState.tournament_project"
          :options="TournamentProject"
          option-attribute="label"
          placeholder="请选择比赛项目"
          /> -->
      <UFormGroup :ui="formGroupUiStyle" label="比赛项目">
        <!-- <CustomCheckGroup
        :model-value="formState.tournament_project"
        :items-list="itemList"
        class="border box-border border-1px border-solid border-primary_2 rounded-10px
        p-3 min-w-340px max-w-732px text-primary_2 leading-28px grid grid-rows-2 grid-cols-9 gap-2"
      >
        <template #item="{ itemData, isItemSelected }">
          <div
            :class="`group flex flex-col items-center ${
              isItemSelected(itemData) ? 'text-primary_1' : ''
            }`"
          >
            <div
              :class="`${itemData.iconMeta} text-28px group-hover:bg-primary_1`"
            />
            <label :class="`text-12px group-hover:text-primary_1`">{{
              itemData.label
            }}</label>
          </div>
        </template>
      </CustomCheckGroup> -->
      </UFormGroup>
      <div class="flex space-x-9">
        <UFormGroup label="比赛规则" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
        <UFormGroup label="比赛轮次" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
      </div>
      <div class="flex space-x-9 items-center">
        <UFormGroup label="是否上首页赛事展示" :ui="formGroupUiStyle">
          <!-- <UToggle v-model="formState.tournament_display_on_home" /> -->
          <el-switch
            v-model="formState.tournament_display_on_home"
            style="
              --el-switch-off-color: #70708c;
              --el-switch-on-color: #ff8f6b;
            "
            size="large"
            active-text="是"
            inactive-text="否"
            inline-prompt
          />
        </UFormGroup>
        <UFormGroup label="展示排序" :ui="formGroupUiStyle">
          <UInput :ui="inputUiStyle" />
        </UFormGroup>
      </div>
      <!-- <div>
        <el-upload
          drag
          class="flex box-border h-64px w-256px"
          style="height: 64px"
        >
          <div class="flex justify-center">
            <div
              class="i-custom-svg:image-placeholder text-#E6EDFF text-36px"
            />
          </div>
          <div>上传赛事横幅</div>
        </el-upload>
      </div> -->
      <div class="flex items-center">
        <label class="mr-3">赛事横幅</label>
        <el-image
          class="border border-1 border-solid border-gray-300 h-64px w-256px rounded-10px mr-9"
          :src="formState.tournament_banner.url"
          fit="contain"
          :preview-src-list="[formState.tournament_banner.url]"
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
          :action="formState.tournament_banner.uploadApiUrl"
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
            >上传图片
          </UButton>
        </el-upload>
      </div>
    </UForm>
  </div>
</template>
<style scoped lang="scss"></style>
