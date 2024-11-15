<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});
console.log('cardItem props => ', props);
</script>
<template>
  <div class="p-2 box-border w-full h-full">
    <div
      v-if="props.title"
      class="h-24px flex justify-between items-center"
      style="border-bottom: 1px solid #f1f1f1"
    >
      <div class="flex space-x-1 items-center text-16px">
        <el-icon><Menu /></el-icon>
        <div>{{ props.title }}</div>
      </div>
    </div>
    <div :style="{ height: props.title ? 'calc(100% - 24px)' : '100%' }" class="pb-1">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
