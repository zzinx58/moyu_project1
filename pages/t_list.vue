<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
const selectUiMenuStyle = {};
const selectUiStyle = {
  base: 'min-w-240px max-w-260px h-36px',
  option: {
    color: 'bg-red',
  },
};
const formGroupUiStyle = {
  label: {
    base: 'mr-4 text-16px',
  },
  container: 'mt-0',
};
const tableUiStyle = {
  //   divide: 'divide-y divide-gray-300 dark:divide-gray-700',
  // tbody: 'divide-y divide-gray-200 dark:divide-gray-800 rounded-10px',
  // tbody: 'h-[calc(60px*10)]',
  //这个 divide 是改 行头和数据行分隔线的。
  divide: '',
  th: {
    color: 'text-white bg-primary_2 ',
    base: 'text-center  first:rounded-l-10px last:rounded-r-10px',
  },
  td: {
    base: 'text-center  first:rounded-l-10px last:rounded-r-10px py-3 h-60px',
  },
  tr: {
    base: 'even:bg-#EDF1FE h-60px',
  },
  base: 'min-w-full table-fixed',
};

//可以使用 safelist 优化
const raw_tournament_state = [
  {
    id: 1,
    label: '报名未开始',
    color: 'bg-#F19EC2',
  },
  {
    id: 2,
    label: '报名中',
    color: 'bg-#88ABDA',
  },
  {
    id: 3,
    label: '报名已结束 比赛未开始',
    color: 'bg-#89C997',
  },
  {
    id: 4,
    label: '比赛中',
    color: 'bg-#F29B76',
  },
  {
    id: 5,
    label: '比赛已结束 未公示',
    color: 'bg-#8F82BC',
  },
  {
    id: 6,
    label: '比赛已结束 公示中',
    color: 'bg-#535353',
  },
];

const columns: {
  key: string;
  label: string;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  class?: string;
}[] = [
  {
    label: '#',
    key: 'id',
  },
  {
    label: '比赛名称',
    key: 'sub_name',
  },
  {
    label: '日期',
    key: 'time_range',
  },
  {
    label: '状态',
    key: 'status_obj',
  },
  {
    label: '操作',
    key: 'actions',
  },
  {
    label: '审核',
    key: 'audit_status',
  },
];

const currentTimeUnix = dayjs().utc(true).unix();
function isValidTimeRange(time_range: [string, string] | null) {
  return (
    time_range !== null &&
    Array.prototype.includes.call(time_range, '') === false
  );
}
const calcStatus = (
  currentTimeUnix: number,
  apply_time_range: [string, string],
  time_range: [string, string]
) => {
  // console.log(
  //   isValidTimeRange(time_range) && isValidTimeRange(apply_time_range)
  // );
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
          label: '比赛结束，公示错误:字段暂未给出',
          color: '#535353',
        };
    }
  }
};

let pageTotal = ref(0);
const display_list_data = ref<any[]>();
onBeforeMount(async () => {
  const { data: t_list } = await useFetch('/api/t_list/t_getAll');
  // console.log(t_list.value);
  if (!t_list.value) {
    alert('数据获取失败');
  }
  if (t_list.value) {
    const solvedListData = t_list.value.map((item) => {
      let statusItemObj = calcStatus(
        currentTimeUnix,
        item.apply_time_range,
        item.time_range
      );
      return {
        id: item.id,
        time_range: item.time_range,
        apply_time_range: item.apply_time_range,
        sub_name: item.sub_name,
        audit_status: item.audit_status,
        status_obj: statusItemObj,
      };
    });
    // console.log(solvedListData);
    display_list_data.value = solvedListData;
    pageTotal.value = display_list_data.value.length;
    // console.log(display_list_data.value);
    // console.log('pageTotal', pageTotal.value);
  }
});

const tournament_state_selected = ref([]);

const currentPage = ref(1);
const tablePageCount = 10;
const finalListData = computed(() => {
  if (tournament_state_selected.value.length === 0)
    return display_list_data.value?.slice(
      (currentPage.value - 1) * tablePageCount,
      currentPage.value * tablePageCount
    );

  let filterListData = display_list_data.value?.filter(
    (item, index, selfArr) => {
      return Object.values(tournament_state_selected.value).some(
        (valueItem) => {
          if (item.status_obj && item.status_obj.id) {
            return valueItem === item.status_obj.id;
          }
        }
      );
    }
  );

  return filterListData?.slice(
    (currentPage.value - 1) * tablePageCount,
    currentPage.value * tablePageCount
  );
});
const handleDeleteItem = async (rowData: any) => {
  const rowDataId = rowData.id;

  const { data: deletedItem } = await useFetch('/api/t_list/t_delete', {
    method: 'POST',
    body: {
      id: rowDataId,
    },
  });
  if (deletedItem.value) {
    const deletedItemIndexInRowData = display_list_data.value?.findIndex(
      (item) => {
        return item.id === rowDataId;
      }
    );
    deletedItemIndexInRowData &&
      display_list_data.value?.splice(deletedItemIndexInRowData, 1);
  }
  return deletedItem.value;
};
</script>
<template>
  <div>
    <!-- <pre>{{ display_list_data }}</pre> -->

    <div class="flex justify-between mb-6 items-center">
      <UFormGroup label="比赛状态" class="flex" :ui="formGroupUiStyle">
        <!-- v-model="tournament_state_selected" -->
        <USelectMenu
          v-model="tournament_state_selected"
          :options="raw_tournament_state"
          option-attribute="label"
          value-attribute="id"
          placeholder="全部"
          multiple
          :ui-menu="selectUiMenuStyle"
          :ui="selectUiStyle"
        >
          <template #label>
            <span v-if="tournament_state_selected" class="truncate">
              {{
                tournament_state_selected
                  .map((itemId, indexA) => {
                    return raw_tournament_state.find((itemObj, indexB) => {
                      return itemObj.id === itemId;
                    })?.label;
                  })
                  .join('、')
              }}
            </span>
            <span v-else> 全部 </span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UButton
        class="bg-primary_1 hover:bg-primary_1 active:opacity-80 rounded-24px w-120px h-48px flex justify-center"
        :ui="{ size: { sm: 'text-20px' } }"
        @click="navigateTo('/t_info')"
        >创建赛事</UButton
      >
    </div>
    <div class="h-[calc(60px*11)]">
      <UTable
        :columns="columns"
        :column-attribute="'label'"
        :rows="finalListData"
        :ui="tableUiStyle"
      >
        <template #sub_name-data="{ row }">
          <NuxtLink
            :to="`/t_detail/${row.id}`"
            class="underline text-#315EFB"
            >{{ row.sub_name }}</NuxtLink
          >
        </template>
        <template #time_range-data="{ row }">
          <span>{{
            `${
              row.time_range === null
                ? '日期为 Null'
                : Array.prototype.includes.call(row.time_range, '')
                ? '日期错误，日期数组中有空元素'
                : `${dayjs
                    .unix(+row.time_range[0])
                    .utc(true)
                    .format('YYYY.MM.DD')
                    .toString()} - ${dayjs
                    .unix(+row.time_range[1])
                    .utc(true)
                    .format('YYYY.MM.DD')
                    .toString()}`
            }`
          }}</span>
        </template>
        <template #status_obj-data="{ row }">
          <UBadge
            :class="`${
              row.status_obj ? row.status_obj.color : 'bg-#000'
            } w-212px justify-center text-16px`"
          >
            {{
              row.status_obj
                ? row.status_obj.label
                : '缺少时间,无法计算相关状态'
            }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="space-x-5">
            <UButton
              icon="i-mdi-edit"
              :trailing="true"
              class="bg-primary_1 hover:bg-primary_1 hover:opacity-80"
              @click="navigateTo(`/t_info/${row.id}`)"
              >编辑</UButton
            >
            <UButton
              icon="i-mdi-delete"
              :trailing="true"
              class="bg-primary_2 hover:bg-primary_2 hover:opacity-80"
              @click="handleDeleteItem(row)"
              >删除</UButton
            >
          </div>
        </template>
        <template #audit_status-data="{ row }">
          <span v-if="+row.audit_status === 0">审核不通过</span>
          <span v-if="+row.audit_status === 1">审核通过</span>
          <span v-if="+row.audit_status === 2">
            <UButton type="button" class="bg-primary_1">审核</UButton>
          </span>
        </template>
      </UTable>
    </div>
    <div class="flex justify-center mt-50px">
      <UPagination
        :page-count="tablePageCount"
        :total="pageTotal"
        v-model="currentPage"
        :prev-button="{ label: '上一页', variant: 'ghost', color: 'orange' }"
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
</template>
<style scoped lang="scss"></style>
