<template>
  <div id="resizeBox" class="flex relative w-full h-full">
    <div id="left" class="w-[calc((100%-33px)/2)] box-border">
      <el-scrollbar>
        <slot name="left" :width="leftBoxWidth"></slot>
      </el-scrollbar>
    </div>

    <div class="w-[9px] mx-[12px] my-0 relative" id="mid">
      <div
        class="w-[1px] h-full bg-[#ebebeb] mx-[4px] cursor-ew-resize user-no-drag select-none"
        @mousedown="handleMouseDown"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[48px] cursor-ew-resize user-no-drag select-none"
        @mousedown="handleMouseDown"
      >
        <svg width="8" height="48" viewBox="0 0 8 48" xmlns="http://www.w3.org/2000/svg">
          <polygon
            fill="white"
            stroke="#ebebeb"
            stroke-width="1"
            points="4 0,0 4,0 44,4 48,8 44,8 4,4 0"
          />
        </svg>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-[4px]">
          <div class="w-[2px] h-[2px] rounded-full bg-[#ebebeb]"></div>
          <div class="w-[2px] h-[2px] rounded-full bg-[#ebebeb]"></div>
          <div class="w-[2px] h-[2px] rounded-full bg-[#ebebeb]"></div>
          <div class="w-[2px] h-[2px] rounded-full bg-[#ebebeb]"></div>
        </div>
      </div>
    </div>

    <div id="right" class="w-[calc((100%-33px)/2)] box-border">
      <el-scrollbar>
        <slot name="right" :width="rightBoxWidth"></slot>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  leftMinWidth: { type: Number, required: true },
  rightMinWidth: { type: Number, required: true }
});

const leftBoxWidth = ref<number>(0);
const rightBoxWidth = ref<number>(0);

const initLeftAndRightBoxWidth = () => {
  const leftDom = document.getElementById('left');
  const rightDom = document.getElementById('right');
  if (!leftDom || !rightDom) {
    console.log('获取dom失败');
    return;
  }

  leftBoxWidth.value = leftDom.clientWidth;
  rightBoxWidth.value = rightDom.clientWidth;
};

defineExpose({ initLeftAndRightBoxWidth });

window.addEventListener('resize', () => {
  const resizeDom = document.getElementById('resizeBox');
  const leftDom = document.getElementById('left');
  const rightDom = document.getElementById('right');

  if (!resizeDom || !leftDom || !rightDom) return;

  if (leftDom.clientWidth < props.leftMinWidth) leftDom.style.width = props.leftMinWidth + 'px';

  if (rightDom.clientWidth < props.rightMinWidth) {
    const leftW = resizeDom.clientWidth - 33 - props.rightMinWidth;
    leftBoxWidth.value = leftW;
    leftDom.style.width = leftW + 'px';
    rightDom.style.width = 'calc(100% - ' + (leftW + 33) + 'px)';
  }

  rightBoxWidth.value = resizeDom.clientWidth - leftDom.clientWidth - 33;
});

const handleMouseDown = (event: any) => {
  const resizeDom = document.getElementById('resizeBox');
  const leftDom = document.getElementById('left');
  const midDom = document.getElementById('mid');
  const rightDom = document.getElementById('right');

  if (!resizeDom || !leftDom || !rightDom || !midDom) return;

  let startX = event.clientX;
  let allowResize = true;
  const midOffsetLeft = midDom.offsetLeft;

  document.onmousemove = (e: any) => {
    if (!allowResize) return;

    const endX = e.clientX;
    const moveLen = endX - startX;

    let leftW = midOffsetLeft + moveLen;
    const maxLeftW = resizeDom.clientWidth - 33 - props.rightMinWidth;
    if (leftW < props.leftMinWidth) leftW = props.leftMinWidth;
    if (leftW > maxLeftW) leftW = maxLeftW;
    leftBoxWidth.value = leftW;

    const rightW = 'calc(100% - ' + (leftW + 33) + 'px)';
    rightBoxWidth.value = resizeDom.clientWidth - leftW;

    leftDom.style.width = leftW + 'px';
    rightDom.style.width = rightW;
  };

  document.onmouseup = () => {
    allowResize = false;
    document.onmousemove = null;
    document.onmouseup = null;
  };
};
</script>

<style scoped lang="scss">
.drag-btn {
  width: 8px;
  height: 48px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.user-no-drag {
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
}
</style>
