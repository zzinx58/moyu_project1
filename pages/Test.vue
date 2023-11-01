<script setup lang="ts">
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
// import { useManagerStore } from "@/stores/manager";
import { FinalFormStateType } from "./t_info.vue";
import { useUserStore } from "@/stores/user";

definePageMeta({
  layout: "pc",
  // middleware: ["auth"],
});

dayjs.extend(utc);
dayjs.extend(timezone);

const userStore = useUserStore();

// const managerEntity = useManagerStore();
// console.log(managerEntity.$state);
// const test = $fetch('https://www.baidu.com');
// (async () => {
// const test = await $fetch('/api/test');
// const test = await $fetch('/api/manager/login');
// const test = await managerEntity.login({ accountName: '', password: '' });
// console.log(test);
// const test1 = managerEntity.$state;
// console.log(test1);

// })();

// console.log(managerStore.$state.then);
// dayjs.tz.setDefault('Asia/shanghai');
// 选开始结束的其中日期 ：fail. time.getTime() < end || time.getTime() > start;
// time.getTime() 的逻辑好奇怪...哦，大于 end 的日期不可选， 小于 start 的日期不可选！！理解了。
// const test1 = ref<[string, string]>(['', '']);
// const test2 = ref<[string, string]>(['', '']);
// const test3 = ref<[string, string]>(['', '']);
// watchEffect(() =>
//   // console.log('test1-h:', dayjs.unix(+test1.value[1]).get('hour'))
//   console.log(
//     // test1.value[1] && dayjs(+test1.value[1]).get('hour'),
//     // test1.value[1] && dayjs(+test1.value[1]).utc(false).get('hour'),
//     // test1.value[1] && dayjs(+test1.value[1]).utc(true).get('hour'),
//     // test1.value[1] && dayjs(+test1.value[1]).utc(true).toString()
//     test1.value[1] && dayjs(test1.value[1]).toString(),
//     test1.value[1] && dayjs(test1.value[1]).utc(false).toString(),
//     test1.value[1] && dayjs(test1.value[1]).utc(true).toString()
//     // test1.value[1] && dayjs(+test1.value[1]).utc(true).toString()
//   )
// );

// const displayData = ref();
// const listData = ref([]);
// const specificData = ref();
// const deletedData = ref();
// const updatedData = ref();
// const getAll = () => {
//   $fetch('/api/t_list/t_getAll').then((e: { [key: string]: any }) => {
//     console.log(e.data);
//     listData.value = e.data;
//     displayData.value = listData.value;
//   });
// };
// const getOne = () => {
//   $fetch('/api/t_info/22', {}).then((e: { [key: string]: any }) => {
//     console.log(e);
//     specificData.value = e.data;
//     displayData.value = specificData.value;
//     // displayData.value = specificData.value.audit_status;
//   });
// };
// const deleteOne = () => {
//   $fetch('/api/t_info/t_delete', {
//     method: 'POST',
//     body: {
//       id: 25,
//     },
//   }).then((e: any) => {
//     console.log(e);
//     deletedData.value = e.data;
//     displayData.value = deletedData.value;
//   });
// };
// const updateOne = () => {
//   $fetch('/api/t_info/t_update', {
//     method: 'PATCH',
//     body: {
//       id: 26,
//       data: {
//         sub_name: '来自页面的赛事信息修改',
//       },
//     },
//   }).then((e: any) => {
//     console.log(e);
//     updatedData.value = e.data;
//     displayData.value = updatedData.value;
//   });
// };

// const raw_tournament_state = [
//   {
//     id: 1,
//     label: '报名未开始',
//     color: '#F19EC2',
//   },
//   {
//     id: 2,
//     label: '报名中',
//     color: '#88ABDA',
//   },
//   {
//     id: 3,
//     label: '报名已结束 比赛未开始',
//     color: '#89C997',
//   },
//   {
//     id: 4,
//     label: '比赛中',
//     color: '#F29B76',
//   },
//   {
//     id: 5,
//     label: '比赛已结束 未公示',
//     color: '#8F82BC',
//   },
//   {
//     id: 6,
//     label: '比赛已结束 公示中',
//     color: '#535353',
//   },
// ];
// function isValidTimeRange(time_range: [string, string] | null) {
//   return (
//     time_range !== null &&
//     //小 Bug 点，注意逻辑通顺
//     Array.prototype.includes.call(time_range, '') === false
//   );
// }
// const { data: validOne } = await useFetch('/api/t_info/63');
// // console.log(validOne.value);
// const currentTimeUnix = dayjs().utc(true).unix();
// const { time_range, apply_time_range } = validOne.value as any;
// console.log(time_range, apply_time_range);
// console.log(+apply_time_range[1] < +time_range[0]);
// console.log(currentTimeUnix > +time_range[0]);

// const calcStatus = (
//   currentTimeUnix: number,
//   apply_time_range: [string, string],
//   time_range: [string, string]
// ) => {
//   console.log(
//     isValidTimeRange(time_range) && isValidTimeRange(apply_time_range)
//   );
//   if (isValidTimeRange(time_range) && isValidTimeRange(apply_time_range)) {
//     switch (true) {
//       case currentTimeUnix < +apply_time_range[0]:
//         return raw_tournament_state[0];
//       case currentTimeUnix > +apply_time_range[0] &&
//         currentTimeUnix < +apply_time_range[1]:
//         return raw_tournament_state[1];
//       case currentTimeUnix > +apply_time_range[1] &&
//         currentTimeUnix < +time_range[0]:
//         return raw_tournament_state[2];
//       case currentTimeUnix > +time_range[0] && currentTimeUnix < +time_range[1]:
//         return raw_tournament_state[3];
//       case currentTimeUnix > +time_range[1]:
//         return {
//           id: 5,
//           label: '比赛结束，公示字段暂未给出',
//           color: '#535353',
//         };
//     }
//   }
// };

// console.log(calcStatus(currentTimeUnix, apply_time_range, time_range));

// console.log(dayjs().utc(true).unix());
// console.log(dayjs().unix());
// console.log(currentTimeUnix);
// console.log();
// console.log(dayjs.unix(+apply_time_range[1]).utc(true).unix());
// console.log(dayjs.unix(+apply_time_range[0]).utc(true).toString());
// console.log(dayjs.unix(+apply_time_range[1]).utc(true).toString());
// console.log('现在的时间:', currentTimeUnix);
// console.log('报名开始时间:', dayjs.unix(+apply_time_range[0]).utc(true).unix());
// console.log('报名结束时间:', dayjs.unix(+apply_time_range[1]).utc(true).unix());
// console.log(
//   '现在时间比报名开始时间早:',
//   currentTimeUnix < +apply_time_range[0]
// );
// // console.log(currentTimeUnix < +apply_time_range[1]);
// console.log(
//   '现在时间比报名截止时间早:',
//   currentTimeUnix < +apply_time_range[1]
// );
// console.log(currentTimeUnix < time_range[0]);
// console.log(currentTimeUnix < time_range[1]);

// const calcStatus = (
//   dayjsInstance: typeof dayjs,
//   apply_time_range: [string, string],
//   time_range: [string, string]
// ) => {
//   const currentTimeUnix = dayjsInstance().unix();
//   console.log(isValidTimeRange(time_range));
//   if (isValidTimeRange(time_range) && isValidTimeRange(apply_time_range)) {
//     switch (true) {
//       case currentTimeUnix < +apply_time_range[0]:
//         return raw_tournament_state[0];
//       case currentTimeUnix > +apply_time_range[0] &&
//         currentTimeUnix < +apply_time_range[1]:
//         return raw_tournament_state[1];
//       case currentTimeUnix > +apply_time_range[1] &&
//         currentTimeUnix < +time_range[0]:
//         return raw_tournament_state[2];
//       case currentTimeUnix > +time_range[0] && currentTimeUnix < +time_range[1]:
//         return raw_tournament_state[3];
//       case currentTimeUnix > +time_range[1]:
//         return {
//           id: 4,
//           label: '公示需求错误',
//           color: '#000000',
//         };
//     }
//   }
//   return false;
// };
// const showModal1 = ref(false);
// const showModal2 = ref(false);
// const { data: t_infoData } = await useFetch<FinalFormStateType | null>(
//   `/api/t_info/${60}`
// );
// const { data: testData } = await useFetch('/test1', {
//   method: 'GET',
//   server: false,
// });
// const { data: testData } = await useFetch('/users/1', {
//   method: 'GET',
//   server: false,
// });
// const { data: testData } = await useFetch('/users_list', {
//   method: 'GET',
//   server: false,
// });

// const token =
// "SFMyNTY.g2gDdAAAAANkAAhhZG1pbl9pZGEDZAAFcm9sZXNqZAAEdHlwZWQACGV4dGVybmFsbgYAY8q-tooBYgABUYA.lqKC4rrVYbYHtmciiRbbNQgODWgt_c4tLK5THt-zMLQ";
// const { data: simpleFilteredData } = useFetch("/api_cors", {
//   method: "GET",
//   // baseURL: "https://api.yicloud.vip/api/dashboard",
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
//   // 要使用 Object.fromEntries 方法，需要提供一个包含数组的数组
//   // params: Object.fromEntries([["id", "66348"]]),
// });
// const simpleFilteredData = await $fetch("/api_cors");

// const { data: simpleFilteredData, error } = await useFetch(
//   // "/api_cors/admins/login",
//   "/api_cors/dashboard/users/list",
//   {
//     // method: "post",
//     // body: Object.fromEntries([
//     //   ["username", "zzx"],
//     //   ["password", "123456"],
//     // ]),
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${userStore.token}`,
//     },
//     params: Object.fromEntries([
//       ["size", "5"],
//       ["page", 166],
//     ]),
//     // query: Object.fromEntries([["size", 5]]),
//     // query: Object.fromEntries([["user_id", "66348"]]),
//   }
// );

// let test = {
//   abc: null,
// };
// const testRef = ref(test.abc?.asd);
// console.log(testRef.value);
// function convertXlsxKeys<Raw = any, Target = any>(
//   excelData: Raw[],
//   keysMap: Record<string, string>
// ): Target[] {
//   return excelData.map((excelItem) => {
//     return Object.entries(excelItem).reduce((prevArr: any, currentArr: any) => {
//       const [currentK, currentV] = currentArr;

//       const mappedKey = keysMap[currentK];
//       if (mappedKey) {
//         prevArr[mappedKey] = currentV;
//       } else {
//         prevArr[currentK] = currentV;
//       }
//       return prevArr;
//     }, {});
//   });
// }
// console.log(convertXlsxKeys([{ name: "zzx" }], { 姓名: "name" }));

// const loginTest = await $fetch("/api_cors/admins/login", {
//   method: "post",
//   body: Object.fromEntries([
//     ["username", "zzx"],
//     ["password", "123456"],
//   ]),
// });
// console.log(loginTest);

// const getTest = await useFetch("/api_cors/dashboard/users/list", {
//   method: "GET",
// });
// console.log(getTest);
// const { data } = await useFetch("/api/manager/login", {
//   method: "post",
//   body: {
//     username: "zzx",
//     password: "123456",
//   },
// });
// console.log(data.value);
// const test = await $fetch("/api/user/user_detail/65942", {
//   method: "GET",
//   headers: {
//     Authorization: `Bearer ${userStore.token}`,
//   },
// });
// console.log(test);

const { data: t_data } = await useFetch("/api/t_info/60");
</script>
<template>
  <FeaturesTRaceSchedule :time_range_related_obj="t_data" />
  <pre>{{ t_data.projects_detail }}</pre>
  <!-- <pre v-if="simpleFilteredData"> {{ simpleFilteredData }}</pre>
  <div v-else>
    <pre>{{ error?.data }}</pre>
    <pre>{{ error?.message }}</pre>
    <pre>{{ error?.name }}</pre>
    <pre>{{ error?.stack }}</pre>
    <pre>{{ error?.statusCode }}</pre>
    <pre>{{ error?.statusMessage }}</pre>
  </div> -->

  <!-- <div id="test"></div>
  <div class="bg-[url()]"></div> -->
  <!-- <pre>{{ ChoroplethData }}</pre> -->
  <!-- <n-select
    :options="[
      {
        value: 1,
        label: '1',
      },
      {
        value: 2,
        label: '2',
      },
      {
        value: 3,
        label: '3',
      },
      {
        value: 4,
        label: '4',
      },
    ]"
  >
  </n-select>
  <n-button type="primary">123</n-button>
  <pre>{{ testData }}</pre> -->
  <!-- <n-space>
    <n-button @click="() => (showModal1 = true)" type="primary"
      >showModal1={{ showModal1 }}</n-button
    >
    <n-button @click="() => (showModal2 = true)" type="primary"
      >showModal2={{ showModal2 }}</n-button
    >
  </n-space> -->
  <!-- <n-modal v-model:show="showModal1">
    <n-card
      @close="showModal1 = false"
      :bordered="false"
      class="bg-#B0B0C4! min-w-800px! max-w-1200px!"
    >
      <FeaturesTDetailPreview
        v-bind:t_info_data="t_infoData"
      ></FeaturesTDetailPreview>
      <div class="flex justify-center mt-10 gap-7">
        <n-button
          type="primary"
          class="hover:opacity-80! rounded-12px! w-108px! h-40px! text-16px!"
          >审核通过</n-button
        >
        <n-button
          class="bg-primary_2! rounded-12px! w-108px! h-40px! text-white! hover:opacity-80! text-16px!"
          quaternary
          >审核不通过</n-button
        >
      </div>
    </n-card>
  </n-modal> -->
  <!-- <n-modal v-model:show="showModal2"> -->
  <!-- closable -->
  <!-- header-style="height:50px; background:#70708C; border-radius: 20px 20px 0 0; display:flex; justify-content: center; width: 100%;" -->
  <!-- <n-card
      @close="showModal2 = false"
      class="h-550px! w-888px! rounded-20px!"
      :bordered="false"
      content-style="padding: 0px"
    >
      <div>
        <div
          class="rounded-t-20px w-888px h-50px h-100px bg-#70708C text-white flex justify-center text-28px items-center relative select-none"
        >
          <div>邮件</div>
          <div
            class="i-mdi-close text-white absolute right-5 hover:opacity-70 hover:cursor-pointer"
            @click="showModal2 = false"
          ></div>
        </div>
        <div class="pt-13 px-15">
          <n-form ref="emailFormRef" label-placement="left" label-width="80px">
            <n-form-item label="主题:" label-style="font-size: 20px">
              <n-input></n-input>
            </n-form-item>
            <n-form-item label="收件人:" label-style="font-size: 20px">
              <n-input></n-input>
            </n-form-item>
            <n-form-item label="内容:" label-style="font-size: 20px">
              <n-input
                type="textarea"
                :autosize="{
                  minRows: 10,
                }"
              ></n-input>
            </n-form-item>
            <div class="flex justify-end">
              <n-button
                role="submit"
                icon-placement="left"
                :bordered="false"
                class="bg-primary_2! w-100px! h-40px! text-white! rounded-10px! text-20px!"
              >
                <template #icon>
                  <div>
                    <div
                      class="i-mingcute:send-plane-fill text-white text-20px"
                    />
                  </div>
                </template>
                发送
              </n-button>
            </div>
          </n-form>
        </div>
      </div>
    </n-card>
  </n-modal> -->
  <!-- <n-modal v-model:show="showModal">{{ showModal }}</n-modal> -->
  <!-- <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="模态框"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra> 噢！ </template>
      内容
      <template #footer> 尾部 </template>
    </n-card>
  </n-modal> -->
  <!-- <pre>{{}}</pre>
  <div class="flex flex-col"> -->
  <!-- <el-date-picker
      type="datetimerange"
      v-model="test1"
      format="YYYY-MM-DD HH:mm"
      value-format="x"
      :clearable="true"
    /> -->
  <!-- </div> -->
  <!-- <UButton @click="getAll" color="amber">getall</UButton>
  <UButton @click="getOne" color="amber">getOne</UButton>
  <UButton @click="deleteOne" color="amber">deleteOne</UButton>
  <UButton @click="updateOne" color="amber">updateOne</UButton> -->
  <!-- <pre>{{ displayData }}</pre> -->
</template>
<style lang="scss" scoped></style>
