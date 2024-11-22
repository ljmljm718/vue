<script setup lang="ts">
const router = useRouter();
onMounted(() => {
  openPage('/bigscreenCZExtra');
});
const openPage = (url) => window.open(url);
</script>
<template>
  <div class="flex justify-center items-center h-20rem">
    <el-button @click="openPage('/bigscreenCZExtra')" type="primary" size="large">
      点击跳转至销售可视化数据中心大屏
    </el-button>
  </div>
</template>
<style scoped lang="scss"></style>
