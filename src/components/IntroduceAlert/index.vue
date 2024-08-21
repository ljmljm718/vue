<template>
  <div class="h-[3rem] overflow-hidden">
    <el-alert :title="props.title" type="success" closable effect="light" show-icon />
  </div>
  
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { defineProps } from 'vue'

defineOptions({ name: 'IntroduceAlert' })
const props = defineProps({
  title: String
})
</script>

<style scoped>
.el-alert {
  border: 1px solid #72c63c;
  margin-bottom: 8px;
}
</style>
