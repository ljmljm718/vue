<script setup lang="ts">
defineOptions({ name: 'FenceDialog' })
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue']);
</script>
<template>
  <div
    class="
      fixed left-0 top-0 z-9999
      w-100vw h-100vh overflow-hidden
      bg-white flex flex-col
    "
    v-if="props.modelValue"
  >
    <div
      class="flex justify-between items-center h-3rem px-1rem"
      style="border-bottom: 1px solid #e1e1e1;"
    >
      <div>{{ props.title }}</div>
      <div
        class="box-border hover:bg-[#e81123] hover:text-white transition rounded-1"
        @click="emit('update:modelValue', false)"
        style="padding: 5px 5px 1px 5px"
      >
        <el-icon><Close /></el-icon>
      </div>
    </div>
    <div class="grow p-3 box-border">
      <slot></slot>
    </div>
    <div
      class="h-3rem text-right px-2rem pt-.7rem box-border"
      style="border-top: 1px solid #e1e1e1;"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
</style>