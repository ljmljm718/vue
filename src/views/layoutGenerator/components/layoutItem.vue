<script setup lang="ts">
import { uniqueId, debounce } from 'lodash-es';
import { layoutGeneratorBus } from '../eventBus';

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
</script>
<template>
  <div
    :id="layoutItemId"
    class="layout-generator-item-frame transition-all transform select-none"
    @mousedown="handleItemFrameMouseDown()"
    @mouseup="handleItemFrameMouseUp()"
    draggable
    :style="{
      gridRow: `span ${props.rowSpan} / span ${props.rowSpan}`,
      gridColumn: `span ${props.colSpan} / span ${props.colSpan}`
    }"
  >
    <slot></slot>
    <div
      class="absolute right-1 bottom-1 w-2 h-2 bg-green cursor-se-resize"
      @mousedown="handleChangeSizeBtnMouseDown"
      @mouseup="handleChangeSizeBtnMouseUp"
      draggable
    ></div>
  </div>
</template>
<style scoped lang="scss"></style>
