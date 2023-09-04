<script setup lang="ts">
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);
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

const raw_tournament_state = [
  {
    id: 1,
    label: '报名未开始',
    color: '#F19EC2',
  },
  {
    id: 2,
    label: '报名中',
    color: '#88ABDA',
  },
  {
    id: 3,
    label: '报名已结束 比赛未开始',
    color: '#89C997',
  },
  {
    id: 4,
    label: '比赛中',
    color: '#F29B76',
  },
  {
    id: 5,
    label: '比赛已结束 未公示',
    color: '#8F82BC',
  },
  {
    id: 6,
    label: '比赛已结束 公示中',
    color: '#535353',
  },
];
function isValidTimeRange(time_range: [string, string] | null) {
  return (
    time_range !== null &&
    //小 Bug 点，注意逻辑通顺
    Array.prototype.includes.call(time_range, '') === false
  );
}
const { data: validOne } = await useFetch('/api/t_info/63');
// console.log(validOne.value);
const currentTimeUnix = dayjs().utc(true).unix();
const { time_range, apply_time_range } = validOne.value as any;
console.log(time_range, apply_time_range);
// console.log(+apply_time_range[1] < +time_range[0]);
// console.log(currentTimeUnix > +time_range[0]);

const calcStatus = (
  currentTimeUnix: number,
  apply_time_range: [string, string],
  time_range: [string, string]
) => {
  console.log(
    isValidTimeRange(time_range) && isValidTimeRange(apply_time_range)
  );
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
          label: '比赛结束，公示字段暂未给出',
          color: '#535353',
        };
    }
  }
};

console.log(calcStatus(currentTimeUnix, apply_time_range, time_range));

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
</script>
<template>
  <div class="flex flex-col">
    <!-- <el-date-picker
      type="datetimerange"
      v-model="test1"
      format="YYYY-MM-DD HH:mm"
      value-format="x"
      :clearable="true"
    /> -->
  </div>
  <!-- <UButton @click="getAll" color="amber">getall</UButton>
  <UButton @click="getOne" color="amber">getOne</UButton>
  <UButton @click="deleteOne" color="amber">deleteOne</UButton>
  <UButton @click="updateOne" color="amber">updateOne</UButton> -->
  <!-- <pre>{{ displayData }}</pre> -->
</template>
<style lang="scss" scoped></style>
