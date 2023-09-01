<script setup lang="ts">
const props = defineProps<{
  modelValue:
    | {
        id: number;
        label: string;
      }
    | {
        id: number;
        label: string;
      }[];
  sourceList: any;
  multiple: boolean;
}>();
// const emit = defineEmits<{
//   (e: 'change', id: number): void
//   (e: 'update', value: string): void
// }>()
const emits = defineEmits<{
  'update:modelValue': [
    itemData:
      | {
          id: number;
          label: string;
        }
      | { id: number; label: string }[]
  ];
  //   'update:modelValue': [itemData: {}];
  //   'deleted-item': [deletedItem: any];
}>();
</script>
<template></template>
<style scoped lang="scss"></style>
