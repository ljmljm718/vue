<script lang="ts" setup>
defineOptions({ name: 'EditFrame' });

const scrollY = ref(0);
const handleScroll = (scrollValue: any) => {
  scrollY.value = scrollValue.scrollTop;
};
const contentH = ref();
const calcContentH = () => {
  const dom = document.getElementById('contentDom');
  contentH.value = dom ? dom.offsetHeight : 0;
};
onMounted(() => {
  calcContentH();
  window.addEventListener('resize', calcContentH);
});
</script>

<template>
  <div class="bg-[#ECEFF7] dark:bg-[#666] rounded-[6px] w-full main-height">
    <div class="flex justify-between w-full p-[16px] box-border">
      <slot name="header">
        <div></div>
      </slot>
    </div>
    <el-scrollbar
      class="w-full p-[16px] box-border bg-white dark:bg-[#333] rounded-[6px] content-height"
      @scroll="handleScroll"
      id="contentDom"
    >
      <slot name="content" :scrollY="scrollY" :contentH="contentH"></slot>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
/*
  topMenuHeight     顶部菜单高度
  contentPadding    内容外边距
  modulePadding     模块内边距
  min-btn-height    el-button的最小高度
  max-btn-height    el-button的最大高度
*/
$topMenuHeight: 85;
$contentPadding: 8;
$modulePadding: 16;
$min-btn-height: 24;
$max-btn-height: 40;

// 内容高度
.main-height {
  height: calc(100vh - #{$topMenuHeight + 2 * $contentPadding + 1}px);
}

// 新增表单的高度
.content-height {
  max-height: calc(100% - #{2 * $modulePadding + $min-btn-height}px);
  min-height: calc(100% - #{2 * $modulePadding + $max-btn-height}px);
}
</style>
