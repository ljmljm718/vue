<script setup lang="ts">
const sideBarCollapsed = ref<boolean>(false);
</script>
<template>
  <div class="w-100vw h-100vh bg-blue overflow-hidden flex">
    <div class="w-[200px] flex flex-col p-4 box-border">s</div>
    <div style="width: calc(100% - 200px)" class="bg-green"></div>
  </div>
</template>
<style scoped lang="scss"></style>
