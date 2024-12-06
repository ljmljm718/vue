<template>
  <div
    ref="button"
    class="draggable-button"
    @mousedown="startDrag"
    @touchstart="startDrag"
    :style="{
      top: `${position.y}px`,
      left: `${position.x}px`,
      transition: isSnapping ? 'left 0.3s, top 0.3s' : 'none'
    }"
  >
    <el-popconfirm
      title="Hi,我是智慧农业AI助手"
      icon=""
      confirm-button-text="打开"
      @confirm="handleConfirm()"
    >
      <template #reference>
        <img src="/robot.png" class="relative right-[20px]" />
      </template>
    </el-popconfirm>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const handleConfirm = () => {
  window.open('/ai');
};
const px2rem = (val) => val / 16 + 'rem';

const position = ref({ x: 0, y: 0 });
const dragging = ref(false);
const isSnapping = ref(true);
const button = ref<HTMLElement | null>(null);
let offsetX = 0;
let offsetY = 0;

const startDrag = (event: MouseEvent | TouchEvent) => {
  dragging.value = true;
  isSnapping.value = false;
  const clientX = (event as MouseEvent).clientX || (event as TouchEvent).touches[0].clientX;
  const clientY = (event as MouseEvent).clientY || (event as TouchEvent).touches[0].clientY;
  offsetX = clientX - position.value.x;
  offsetY = clientY - position.value.y;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', stopDrag);
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!dragging.value) return;
  const clientX = (event as MouseEvent).clientX || (event as TouchEvent).touches[0].clientX;
  const clientY = (event as MouseEvent).clientY || (event as TouchEvent).touches[0].clientY;
  let newX = clientX - offsetX;
  let newY = clientY - offsetY;
  const { innerWidth, innerHeight } = window;
  const buttonWidth = button.value?.offsetWidth || 0;
  console.log('🚀 ~ onDrag ~ buttonWidth:', buttonWidth);
  const buttonHeight = button.value?.offsetHeight || 0;

  // 边界碰撞检测和反弹效果
  if (newX < 0) newX = 0;
  if (newX + buttonWidth > innerWidth) newX = innerWidth - buttonWidth;
  if (newY < 0) newY = 0;
  if (newY + buttonHeight > innerHeight) newY = innerHeight - buttonHeight;

  position.value = { x: newX, y: newY };
};

const stopDrag = () => {
  dragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);

  // 吸附到最近的视口边缘
  const { innerWidth } = window;
  const buttonWidth = button.value?.offsetWidth || 0;
  const middleX = innerWidth / 2;
  if (position.value.x + buttonWidth / 2 < middleX) {
    // 吸附到左边
    position.value.x = 0;
  } else {
    // 吸附到右边
    position.value.x = innerWidth - buttonWidth;
  }

  // 触发过渡
  isSnapping.value = true;

  // 清除过渡效果（为了下一次拖拽时不受干扰）
  setTimeout(() => {
    isSnapping.value = false;
  }, 500); // 过渡时间与 CSS 中的过渡时间一致
};

onMounted(() => {
  button.value = document.querySelector('.draggable-button');
  // 设置初始位置为右下角
  const { innerWidth, innerHeight } = window;
  const buttonWidth = button.value?.offsetWidth || 152;
  const buttonHeight = button.value?.offsetHeight || 0;
  const bottom = px2rem('50').replace(new RegExp('rem', 'g'), '');
  position.value = {
    x: innerWidth - Number(buttonWidth),
    y: innerHeight - (Number(buttonHeight) + Number(bottom) * 44)
  };
});

onBeforeUnmount(() => {
  stopDrag();
});
</script>

<style scoped lang="scss">
.draggable-button {
  position: fixed;
  background-color: transparent;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  user-select: none;
  border-radius: 5px;
  z-index: 999;
  animation-delay: 2s;
}
</style>
