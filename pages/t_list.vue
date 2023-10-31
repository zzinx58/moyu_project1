<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useDialog, useMessage } from "naive-ui";

definePageMeta({
  layout: "pc",
  middleware: ["auth"],
});
useHead({
  title: "T_List - 赛事列表",
});

dayjs.extend(utc);
dayjs.extend(timezone);

const naiveMessage = useMessage();
const naiveDialog = useDialog();

const selectUiMenuStyle = {};
const selectUiStyle = {
  base: "min-w-240px max-w-260px h-36px",
  option: {
    color: "bg-red",
  },
};
const formGroupUiStyle = {
  label: {
    base: "mr-4 text-16px",
  },
  container: "mt-0",
};
const tableUiStyle = {
  //   divide: 'divide-y divide-gray-300 dark:divide-gray-700',
  // tbody: 'divide-y divide-gray-200 dark:divide-gray-800 rounded-10px',
  // tbody: 'h-[calc(60px*10)]',
  //这个 divide 是改 行头和数据行分隔线的。
  divide: "",
  th: {
    color: "text-white bg-primary_2 ",
    base: "text-center  first:rounded-l-10px last:rounded-r-10px",
  },
  td: {
    base: "text-center  first:rounded-l-10px last:rounded-r-10px h-60px",
    padding: "py-3 px-3",
  },
  tr: {
    base: "even:bg-#EDF1FE h-60px",
  },
  base: "min-w-full table-fixed",
};

//可以使用 safelist 优化
const raw_tournament_state = [
  {
    id: 1,
    label: "报名未开始",
    color: "bg-#F19EC2",
  },
  {
    id: 2,
    label: "报名中",
    color: "bg-#88ABDA",
  },
  {
    id: 3,
    label: "报名已结束 比赛未开始",
    color: "bg-#89C997",
  },
  {
    id: 4,
    label: "比赛中",
    color: "bg-#F29B76",
  },
  {
    id: 5,
    label: "比赛已结束 未公示",
    color: "bg-#8F82BC",
  },
  {
    id: 6,
    label: "比赛已结束 公示中",
    color: "bg-#535353",
  },
];

const columns: {
  key: string;
  label: string;
  sortable?: boolean;
  direction?: "asc" | "desc";
  class?: string;
}[] = [
  {
    label: "#",
    key: "id",
  },
  {
    label: "赛事名称",
    key: "sub_name",
  },
  {
    label: "赛事起止日期",
    key: "time_range",
  },
  {
    label: "赛事状态",
    key: "status_obj",
  },
  {
    label: "操作",
    key: "actions",
  },
  // Hidden for now. 2023-10-31.
  // {
  //   label: "审核",
  //   key: "audit_status",
  // },
];

//BUG 点，dayjs 获取当前时间的秒时间戳不需要进行 utc(true) 转换。
const currentTimeUnix = dayjs().utc(false).unix();
// const currentTimeUnix = dayjs().utc(true).unix();
function isValidTimeRange(time_range: [string, string] | null) {
  return (
    time_range !== null &&
    Array.prototype.includes.call(time_range, "") === false
  );
}
const calcStatus = (
  currentTimeUnix: number,
  apply_time_range: [string, string],
  time_range: [string, string]
) => {
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
          label: "比赛结束，公示错误:字段暂未给出",
          color: "#535353",
        };
    }
  }
};

let pageTotal = ref(0);
const display_list_data = ref<any[]>();
const onGoingTs = ref();
onBeforeMount(async () => {
  const { data: t_list } = await useFetch("/api/t_list/t_getAll");
  // console.log(t_list.value);
  if (!t_list.value) {
    alert("数据获取失败");
  }
  if (t_list.value) {
    const solvedListData = t_list.value.map((item) => {
      let statusItemObj = calcStatus(
        currentTimeUnix,
        item.apply_time_range,
        item.time_range
      );
      return {
        ...item,
        //
        // id: item.id,
        // time_range: item.time_range,
        // apply_time_range: item.apply_time_range,
        // sub_name: item.sub_name,
        // audit_status: item.audit_status,

        //Custom logic.
        status_obj: statusItemObj,
        //Differ with the t_info/[id] complement.
        name: item.sub_name,
        type: {
          label: item.type,
          id: item.type_id,
        },
      };
    });
    onGoingTs.value = solvedListData.filter((item, index, selfArr) => {
      return item.status_obj?.id === 4;
    }).length;
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
const handleDeleteItem = (rowData: any) => {
  const rowDataId = rowData.id;

  naiveDialog.create({
    title: "删除赛事警告",
    content: "赛事删除操作无法复原，确认删除？",
    positiveText: "确定删除",
    negativeText: "取消操作",
    onPositiveClick: async () => {
      const { data: deletedItem } = await useFetch("/api/t_list/t_delete", {
        method: "POST",
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
        naiveMessage.success(`删除赛事操作成功,赛事名:${rowData.sub_name}`);
        return deletedItem.value;
      } else {
        naiveMessage.success(`删除赛事操作成功,赛事不存在`);
      }
    },
  });
};

const showAuditModal = ref(false);
const currentAuditRowData = ref<{ [key: string]: any }>({});
const showEmailModal = ref(false);
const auditEmailFormInfo = reactive({
  email_title: "",
  content: "",
  target_t_owner_id: "",
});
const handleClickAuditButton = (rowData: any) => {
  showAuditModal.value = true;
  currentAuditRowData.value = rowData;
};
const handleClickAuditFailedButton = () => {
  showEmailModal.value = true;
  auditEmailFormInfo.email_title = `关于您创建的 "${currentAuditRowData.value.name}" 赛事，审核不通过的原因和建议`;
};
const handleClickFailedEmailSendButton = () => {
  showAuditModal.value = false;
  showEmailModal.value = false;
  // console.log('formInfo:', auditEmailFormInfo);
};
</script>
<template>
  <div>
    <!-- <pre>{{ display_list_data }}</pre> -->

    <div class="flex justify-between mb-6 items-center">
      <UFormGroup label="赛事状态" class="flex" :ui="formGroupUiStyle">
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
                  .join("、")
              }}
            </span>
            <span v-else> 全部 </span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <div class="flex items-center gap-11">
        <div class="text-20px text-#70708C">
          今日 <span class="text-primary_1">{{ onGoingTs }}</span> 场 赛事进行
        </div>
        <UButton
          class="bg-primary_1 hover:bg-primary_1 active:opacity-80 rounded-24px w-120px h-48px flex justify-center"
          :ui="{ size: { sm: 'text-20px' } }"
          @click="navigateTo('/t_info')"
          >创建赛事</UButton
        >
      </div>
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
                ? "日期为 Null"
                : Array.prototype.includes.call(row.time_range, "")
                ? "日期错误，日期数组中有空元素"
                : `${dayjs
                    .unix(+row.time_range[0])
                    .utc(true)
                    .format("YYYY.MM.DD")
                    .toString()} - ${dayjs
                    .unix(+row.time_range[1])
                    .utc(true)
                    .format("YYYY.MM.DD")
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
                : "缺少时间,无法计算相关状态"
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
            <!-- <NDialog
            title="删除赛事"
            content="删除赛事操作无法回滚，确定删除赛事吗？"
            negative-text="取消"
            positive-text="确认删除"
            @positive-click="handleDeleteItem(row)"
            /> -->
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
            <UButton
              type="button"
              class="bg-primary_1"
              @click="handleClickAuditButton(row)"
              >审核</UButton
            >
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
  <n-modal v-model:show="showAuditModal">
    <n-card
      @close="showAuditModal = false"
      :bordered="false"
      class="bg-#B0B0C4! min-w-800px! max-w-1200px!"
    >
      <FeaturesTDetailPreview
        v-bind:t_info_data="currentAuditRowData"
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
          @click="handleClickAuditFailedButton"
          >审核不通过</n-button
        >
      </div>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showEmailModal">
    <!-- closable -->
    <!-- header-style="height:50px; background:#70708C; border-radius: 20px 20px 0 0; display:flex; justify-content: center; width: 100%;" -->
    <n-card
      @close="showEmailModal = false"
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
            @click="showEmailModal = false"
          ></div>
        </div>
        <div class="pt-13 px-15">
          <n-form
            ref="emailFormRef"
            label-placement="left"
            label-width="80px"
            :model="auditEmailFormInfo"
          >
            <n-form-item label="主题:" label-style="font-size: 20px">
              <n-input
                type="text"
                v-modal:value="auditEmailFormInfo.email_title"
                :default-value="auditEmailFormInfo.email_title"
              ></n-input>
            </n-form-item>
            <n-form-item label="收件人:" label-style="font-size: 20px">
              <n-input
                type="text"
                v-model:value="auditEmailFormInfo.target_t_owner_id"
                :default-value="auditEmailFormInfo.target_t_owner_id"
              ></n-input>
            </n-form-item>
            <n-form-item label="内容:" label-style="font-size: 20px">
              <n-input
                type="textarea"
                :autosize="{
                  minRows: 10,
                }"
                v-model:value="auditEmailFormInfo.content"
                :default-value="auditEmailFormInfo.content"
              ></n-input>
            </n-form-item>
            <div class="flex justify-end">
              <n-button
                role="submit"
                icon-placement="left"
                :bordered="false"
                class="bg-primary_2! w-100px! h-40px! text-white! rounded-10px! text-20px!"
                @click="handleClickFailedEmailSendButton"
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
  </n-modal>
</template>
<style scoped lang="scss"></style>
