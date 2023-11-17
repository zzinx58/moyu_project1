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

/* Dynamic datetime fields constraint.

  dayjs.tz.setDefault('Asia/shanghai');
  选开始结束的其中日期 ：fail. time.getTime() < end || time.getTime() > start;
  time.getTime() 的逻辑好奇怪...哦，大于 end 的日期不可选， 小于 start 的日期不可选！！理解了。
  const test1 = ref<[string, string]>(['', '']);
  const test2 = ref<[string, string]>(['', '']);
  const test3 = ref<[string, string]>(['', '']);
  watchEffect(() =>
    // console.log('test1-h:', dayjs.unix(+test1.value[1]).get('hour'))
    console.log(
      // test1.value[1] && dayjs(+test1.value[1]).get('hour'),
      // test1.value[1] && dayjs(+test1.value[1]).utc(false).get('hour'),
      // test1.value[1] && dayjs(+test1.value[1]).utc(true).get('hour'),
      // test1.value[1] && dayjs(+test1.value[1]).utc(true).toString()
      test1.value[1] && dayjs(test1.value[1]).toString(),
      test1.value[1] && dayjs(test1.value[1]).utc(false).toString(),
      test1.value[1] && dayjs(test1.value[1]).utc(true).toString()
      // test1.value[1] && dayjs(+test1.value[1]).utc(true).toString()
    )
  );
*/

/* XLSX file header keys convert.

  function convertXlsxKeys<Raw = any, Target = any>(
    excelData: Raw[],
    keysMap: Record<string, string>
  ): Target[] {
    return excelData.map((excelItem) => {
      return Object.entries(excelItem).reduce((prevArr: any, currentArr: any) => {
        const [currentK, currentV] = currentArr;

        const mappedKey = keysMap[currentK];
        if (mappedKey) {
          prevArr[mappedKey] = currentV;
        } else {
          prevArr[currentK] = currentV;
        }
        return prevArr;
      }, {});
    });
  }
  console.log(convertXlsxKeys([{ name: "zzx" }], { 姓名: "name" }));
*/

/* Database & Prisma ORM usecases. */

/* Timestamp comparisons.
  
  const currentTimeUnix = dayjsInstance().unix();
  console.log(isValidTimeRange(time_range));
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
          id: 4,
          label: '公示需求错误',
          color: '#000000',
        };
    }
  }
*/

/* UseFetch token test and so on.
  
  const test = await $fetch("/api/user/user_detail/65942", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });
  const loginTest = await $fetch("/api_cors/admins/login", {
  method: "post",
  body: Object.fromEntries([
    ["username", "zzx"],
    ["password", "123456"],
  ]),
  });
*/

/* FeaturesTRaceSchedule tests.
  
  const { data: t_data } = await useFetch("/api/t_info/60");
  <FeaturesTRaceSchedule :t_info="t_data" />
*/

/* Composable tests. */

/* UseFetch Error tests.
  

  error.statusMessage
  error.statusCode
*/
</script>
<template>
  <!-- <div class="bg-[url()]"></div> -->
</template>
<style lang="scss" scoped></style>
