<script setup lang="ts">
import DeviceInfo from "@/views/agriculture/deviceinfo/index.vue";

/** 设备信息 列表 */
defineOptions({ name: 'DeviceView' })

const currCategory = ref({})
const handleCurrentCategoryChange = (currNodeData) => {
  currCategory.value = currNodeData
}

const plotSelectorRef = ref()
// 取消选择
const clearCategory = () => {
  plotSelectorRef.value.clearCategory()
}
const resetTreeSelections = () => {
  clearCategory() // 清空选中的节点
};

const collapsed = ref<boolean>(false)
const handleCollapse = (e) => {
  collapsed.value = e
}
</script>

<template>
  <div
    class="flex space-x-.1rem w-full pb-4 box-border"
    style="height: calc(100vh - 125px);"
  >
    <plot-selector
      ref="plotSelectorRef"
      @current-change="handleCurrentCategoryChange"
      @collapse="handleCollapse"
    />
    <div
      :style="{
        width: collapsed ? '100%' : 'calc(100% - 240px)',
        height: 'calc(100vh - 125px)'
      }"
    >
      <device-info
        :currCategory="currCategory"
        @clear-category="clearCategory"
        @reset="resetTreeSelections"
      />
    </div>
  </div>
</template>
<style scoped lang='scss'>
@keyframes slide-from-left-to-right {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-from-left-to-right {
  animation: slide-from-left-to-right 0.1s ease-out forwards;
}

@keyframes slide-from-right-to-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.slide-from-right-to-left {
  animation: slide-from-right-to-left 0.1s ease-in forwards;
}

@keyframes content-grow {
  from {
    margin-left: 0;
  }
  to {
    margin-left: -350px;
  }
}

.content-grow {
  animation: content-grow 0.1s ease-out forwards;
}

@keyframes content-shrink {
  from {
    margin-left: -350px;
  }
  to {
    margin-left: 0;
  }
}

.content-shrink {
  animation: content-shrink 0.1s ease-out forwards;
}
</style>