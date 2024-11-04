<script setup lang="ts">
import GrowthMonitorDataCenter from '@/views/growthMonitoringModelDataCenter/index.vue'
const handleActive = () => {}
defineExpose({ handleActive })
</script>
<template>
  <div class="absolute left-0 top-[100px]">
    <GrowthMonitorDataCenter :hiddenHeader="true" :isChazhu="true" />
  </div>
</template>