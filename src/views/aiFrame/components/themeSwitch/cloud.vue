<script setup lang="ts"></script>
<template>
  <div class="main-cloud">
    <div class="ttt-c"></div>
    <div class="ttt-c" style="left: 8px; top: -3px"></div>
    <div
      class="ttt-c"
      style="left: 18px; top: -6px; width: 16px; height: 16px; border-radius: 8px"
    ></div>
    <div class="ttt-c" style="left: 28px; top: -5px"></div>
    <div class="ttt-c" style="left: 37px; top: -10px"></div>
    <div class="ttt-c1"></div>
    <div class="ttt-c1" style="left: 4px; top: -5px"></div>
    <div
      class="ttt-c1"
      style="left: 14px; top: -7px; width: 16px; height: 16px; border-radius: 8px"
    ></div>
    <div class="ttt-c1" style="left: 24px; top: -7px"></div>
    <div class="ttt-c1" style="left: 33px; top: -12px"></div>
    <div class="tt-star">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
    </div>
  </div>
</template>
<style scoped lang="scss">
.main-cloud {
  width: 60px;
  height: 20px;
  position: absolute;
  top: 22px;
  left: 10px;
  z-index: 99;
  transition: all 0.7s ease-in-out;
  transition-delay: 0.2s;
  background-color: #ffffff;
  .ttt-c {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    position: absolute;
    top: -1px;
    left: -3px;
    z-index: 2;
    background-color: #ffffff;
  }
  .ttt-c1 {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    position: absolute;
    top: -1px;
    left: -1px;
    z-index: 1;
    background-color: #a7a7a7;
  }
  .tt-star {
    width: 18px;
    height: 18px;
    color: white;
    border-radius: -2px;
    position: absolute;
    top: -36px;
    left: -4px;
    z-index: 9999;
  }
}
</style>
