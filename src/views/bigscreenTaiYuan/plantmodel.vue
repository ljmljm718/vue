<script setup lang="ts">
import GrowthMonitorDataCenter from '@/views/growthMonitoringModelDataCenter/index.vue'
const handleActive = () => {}
defineExpose({ handleActive })
</script>
<template>
  <div class="absolute left-0 top-[100px]" style="filter: hue-rotate(-35deg);">
    <GrowthMonitorDataCenter :hiddenHeader="true" />
  </div>
</template>