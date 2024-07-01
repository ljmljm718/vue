<template>
  <div class="w-full h-[100vh] overflow-auto home-page-bg flex justify-center items-center">
    <div class="grid grid-cols-3 grid-rows-3 gap-[1rem]">
      <div class="home-item-bg"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss" scoped>
.home-page-bg {
  background-image: url(./assets/bg.png);
  background-size: 100% 100%;
}

.home-item-bg {
  background-image: url(./assets/itemBg.png);
  background-size: 100% 100%;
}
</style>
