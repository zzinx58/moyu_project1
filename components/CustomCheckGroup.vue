<script setup lang="ts">
const props = defineProps<{
  modelValue: Array<Object>;
  itemsList: { [key: string]: any }[];
}>();
const emits = defineEmits<{
  'update:modelValue': [itemData: {}];
  'deleted-item': [deletedItem: any];
}>();

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(itemData) {
    emits('update:modelValue', itemData);
  },
});

function isSelected(itemData: { [key: string]: any }) {
  return selected.value.some((someItem: { [key: string]: any }) => {
    //Bug 点
    // return toRaw(someItem) === itemData;
    return toRaw(someItem).project_id === itemData.project_id;
  });
}

function onSelect(itemData: { [key: string]: any }) {
  if (!isSelected(itemData)) {
    selected.value.push(itemData);
  } else {
    //Bug 点，方法选用错误
    // const itemToRemoveIndex = selected.value.indexOf(itemData);
    const itemToRemoveIndex = selected.value.findIndex(
      (item: { [key: string]: any }) => item.project_id === itemData.project_id
    );
    if (itemToRemoveIndex !== -1) {
      const deletedItem = selected.value.splice(itemToRemoveIndex, 1);
      emits('deleted-item', deletedItem);
    }
  }
}
</script>
<template>
  <div id="custom-check-group">
    <div
      id="custom-check-item"
      v-for="item in props.itemsList"
      @click="() => onSelect(item)"
    >
      <!-- <slot name="item" :item-data="item" :isItemSelected="isSelected"> </slot> -->
      <slot name="item" :item-data="item" :isItemSelected="isSelected"> </slot>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
