<template>
  <div
    style="width: 300px; height: 85px;"
  >
    <div class="circle text-center">
      <!-- <el-image class="mt-[5px] h-[60px] w-[60px]" :src="iconImg" /> -->
      <div
        class="absolute top-[5px] left-[5px] h-[60px] w-[60px]"
        :style="`background-image: url(${ iconImg }); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;`"
      >
      </div>
      <div class="circle-border"></div>
      <div class="border-decorator"></div>
      <div class="line-decorator"></div>
      <div class="line"></div>
      <div class="absolute top-[10px] left-[108px] w-[180px] h-[30px] flex justify-between items-baseline">
        <div class="text-[16px]">{{ numName }}</div>
        <div class="text-[24px]">
          {{ numAmount }}
          <span class="text-[16px] text-[#435B63]">{{ numUnit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  iconImg: String,
  numName: String,
  numAmount: Number,
  numUnit: String,
})

</script>

<style scoped>
.circle {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/numshow/circle.png);
  background-size: 100% 100%;
  width: 70px;
  height: 70px;
  position: relative;
}
.circle-border {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/numshow/circle-border.png);
  background-size: 100% 100%;
  width: 85px;
  height: 85px;
  position: absolute;
  top: -8px;
  left: -8px;
}
.border-decorator {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/numshow/border-decorator.png);
  background-size: 100% 100%;
  width: 30px;
  height: 12px;
  position: absolute;
  top: -8px;
  left: 5.58px;
}
.line {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/numshow/line.png);
  background-size: 100% 100%;
  width: 206px;
  height: 30px;
  position: absolute;
  top: 20px;
  left: 87px;
}
.line-decorator {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/numshow/line-decorator.png);
  background-size: 100% 100%;
  width: 22px;
  height: 2px;
  position: absolute;
  top: 49px;
  left: 271px;
}

</style>