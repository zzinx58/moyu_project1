<script setup lang="ts">
// const props = defineProps<{
//   checkItemConfig: {
//     icon: {
//       iconMeta: string;
//       class: string;
//     };
//     label: {
//       content: string;
//       class: string;
//     };
//     class: string;
//   };
//   checkGroupConfig: {
//     class: string;
//   };
// }>();
const props = defineProps<{
  modelValue: Array<Object>;
  itemsList: { [key: string]: any }[];
}>();
const emits = defineEmits<{
  'update:modelValue': [itemData: {}];
  'deleted-item': [deletedItem: any];
}>();
// const [DefineCheckItem, ReuseCheckItem] = createReusableTemplate();

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(itemData) {
    emits('update:modelValue', itemData);
  },
});

function isSelected(itemData: {}) {
  if (!props.modelValue) return false;

  return selected.value.some(
    (someSelectedItem) => toRaw(someSelectedItem) === toRaw(itemData)
  );
}
// const deletedItem = ref<Object[]>([]);
function onSelect(itemData: {}) {
  if (!isSelected(itemData)) {
    selected.value.push(itemData);
  } else {
    const itemToRemoveIndex = selected.value.indexOf(itemData);
    if (itemToRemoveIndex !== -1) {
      const deletedItem = selected.value.splice(itemToRemoveIndex, 1);
      emits('deleted-item', deletedItem);
    }
  }
  // console.log(toRaw(selected.value));
}
</script>
<template>
  <!-- <DefineCheckItem>
    <div id="target-item" :class="`${props.checkItemConfig.class}`">
      <slot name="default">
        <div
          :class="`${props.checkItemConfig.icon.iconMeta} ${props.checkItemConfig.icon.class}`"
        />
        <label :class="`${props.checkItemConfig.label.class}`">{{
          props.checkItemConfig.label
        }}</label>
      </slot>
    </div>
  </DefineCheckItem> -->

  <div id="custom-check-group">
    <div
      id="custom-check-item"
      v-for="item in props.itemsList"
      @click="() => onSelect(item)"
    >
      <slot name="item" :item-data="item" :isItemSelected="isSelected"> </slot>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
