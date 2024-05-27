<template>
  <div class="flex space-x-1 bigscreen-tab-wrapper">
    <div
      v-for="item, index in props.options"
      :key="index"
      :class="['bigscreen-tab-item', props.modelValue === item.key ? 'bigscreen-tab-active-item' : '']"
      @click="handleOptionClick(item.key)"
    >{{ item.label }}</div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'BigscreenTab' })
interface KeyLabelObject {
  key: string,
  label: string
}
const props = defineProps({
  options: {
    type: Array<KeyLabelObject>,
    default: []
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change']);

const handleOptionClick = (key:string) => {
  emit('update:modelValue', key)
  emit('change', key)
}
</script>
<style scoped>
.bigscreen-tab-wrapper {}
.bigscreen-tab-item {
  border: 1px solid #67b1ff;
  padding: 2px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .3s ease;
  background: linear-gradient(to top, #20575f, #20575f00, #20575f);
  user-select: none;
  cursor: pointer;
}
.bigscreen-tab-active-item {
  background: linear-gradient(to top, #4785d6, #4785d600, #4785d6);
}
</style>
