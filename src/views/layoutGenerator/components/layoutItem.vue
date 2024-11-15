<script setup lang="ts">
import { uniqueId, debounce } from 'lodash-es';
import { layoutGeneratorBus } from '../eventBus';
import { isNumber } from '@/utils/is';

defineOptions({ name: 'LayoutItem' });

const props = defineProps({
  id: {
    type: Number,
    default: Number(uniqueId())
  },
  colSpan: {
    type: Number,
    default: 1
  },
  rowSpan: {
    type: Number,
    default: 1
  }
});

// 避免单行 超过最大限制
const applyColSpan = computed(() => {
  const layoutMainDom = document.getElementById('layoutMain_frame');
  if (!layoutMainDom) return;
  const gridColumnsNum = window
    .getComputedStyle(layoutMainDom, null)
    ?.gridTemplateColumns?.split(' ')?.length;
  if (!isNumber(gridColumnsNum) || isNaN(gridColumnsNum)) return;
  return Math.min(gridColumnsNum, props.colSpan);
});

const layoutItemId = 'layoutItem_' + props.id;
const handleItemFrameMouseDown = debounce(() => {
  console.log('handleItemFrameMouseDown', layoutItemId);
  layoutGeneratorBus.emit('itemKeyDown', layoutItemId);
}, 80);

const handleItemFrameMouseUp = debounce(() => {
  console.log('handleItemFrameMouseUp', layoutItemId);
  layoutGeneratorBus.emit('itemKeyUp', layoutItemId);
}, 80);

const handleChangeSizeBtnMouseDown = debounce((e) => {
  e.stopPropagation();
  layoutGeneratorBus.emit('itemChangeBtnDown', layoutItemId);
}, 80);
const handleChangeSizeBtnMouseUp = debounce((e) => {
  e.stopPropagation();
  layoutGeneratorBus.emit('itemChangeBtnUp', layoutItemId);
}, 80);

const handleDeleteItem = debounce((e) => {
  e.stopPropagation();
  layoutGeneratorBus.emit('itemDelete', layoutItemId);
}, 80);

const handleSetting = () => {
  layoutGeneratorBus.emit('itemSetting', layoutItemId);
};
</script>
<template>
  <div
    :id="layoutItemId"
    class="layout-generator-item-frame transition-all select-none bg-[#fff] shadow-sm rounded-md"
    @mousedown="handleItemFrameMouseDown()"
    @mouseup="handleItemFrameMouseUp()"
    draggable
    :style="{
      gridRow: `span ${props.rowSpan} / span ${props.rowSpan}`,
      gridColumn: `span ${applyColSpan} / span ${applyColSpan}`
    }"
  >
    <slot></slot>
    <div
      class="absolute right-0 bottom-0 w-2 h-2 bg-green cursor-se-resize"
      @mousedown="handleChangeSizeBtnMouseDown"
      @mouseup="handleChangeSizeBtnMouseUp"
      draggable
    ></div>
    <div
      class="absolute right-7 top-1 w-5 h-5 transition rounded-sm hover:bg-green bg-white hover:text-white text-black flex justify-center items-center"
      @click="handleSetting()"
    >
      <el-icon><MoreFilled /></el-icon>
    </div>
    <div
      class="absolute right-1 top-1 w-5 h-5 transition rounded-sm hover:bg-red bg-white hover:text-white text-black flex justify-center items-center"
      @click="handleDeleteItem"
    >
      <el-icon><Close /></el-icon>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
