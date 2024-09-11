<script setup lang="ts"></script>
<template>
  <div class="w-full h-full flex justify-between">
    <div class="h-full w-460px">
      <div class="w-460px h-45px agri-title"></div>
      <div class="w-460px pt-15px pb-20px flex justify-evenly">
        <div
          class="agri-bg-1 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center"
        >
          <div class="text-12px">种植地块</div>
          <div>
            <span class="text-18px pr-5px font-bold">16</span>
            <span class="text-12px">块</span>
          </div>
        </div>
        <div class="agri-bg-2 w-139px h-52px"></div>
        <div class="agri-bg-3 w-139px h-52px"></div>
      </div>
      <div class="w-460px h-45px device-title"></div>
      <div class="w-460px h-45px type-title"></div>
      <div class="w-460px h-45px mission-title"></div>
    </div>
    <div class="h-full w-460px">
      <div class="w-460px h-45px mission-title"></div>
      <div class="text-12px">
        <div class="w-447px h-35px flex text-#01F892 items-center">
          <div class="w-90px text-center">预警信息</div>
          <div class="w-257px text-center">时间</div>
          <div class="w-100px text-center">处理状态</div>
        </div>
        <el-scrollbar style="height: 210px">
          <div class="w-447px h-35px flex text-#01F892 items-center">
            <div class="w-90px text-center">预警信息</div>
            <div class="w-257px text-center">时间</div>
            <div class="w-100px text-center">处理状态</div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.agri-title {
  background-image: url(./assets/agriTitle.png);
  background-size: 100% 100%;
}

@for $i from 1 through 3 {
  .agri-bg-#{$i} {
    background-image: url(./assets/agriBg#{$i}.png);
    background-size: 100% 100%;
  }
}

.device-title {
  background-image: url(./assets/deviceTitle.png);
  background-size: 100% 100%;
}

.type-title {
  background-image: url(./assets/typeTitle.png);
  background-size: 100% 100%;
}

.mission-title {
  background-image: url(./assets/missionTitle.png);
  background-size: 100% 100%;
}

.plant-title {
  background-image: url(./assets/plantTitle.png);
  background-size: 100% 100%;
}

.weather-title {
  background-image: url(./assets/weatherTitle.png);
  background-size: 100% 100%;
}

.soil-title {
  background-image: url(./assets/soilTitle.png);
  background-size: 100% 100%;
}

.warn-title {
  background-image: url(./assets/warnTitle.png);
  background-size: 100% 100%;
}
</style>
