<script setup lang="ts">
const router = useRouter()
onMounted(() => {
  openPage('/growthMonitoringModelDataCenter')
})
const openPage = (url) => window.open(url)
</script>
<template>
  <div class="flex justify-center items-center h-20rem">
    <el-button
      @click="openPage('/growthMonitoringModelDataCenter')"
      type="primary"
      size="large"
    >点击跳转至数据中心大屏</el-button>
  </div>
</template>
<style scoped lang="scss">

</style>