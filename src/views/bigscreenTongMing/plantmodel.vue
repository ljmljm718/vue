<script setup lang="ts">
import GrowthMonitorDataCenter from '@/views/growthMonitoringModelDataCenter/index.vue'
</script>
<template>
  <div class="absolute left-0 top-[100px]" style="filter: hue-rotate(-35deg);">
    <GrowthMonitorDataCenter :hiddenHeader="true" />
  </div>
  
  <div class="h-full flex justify-between !hidden">
    <div class="w-460px h-full bg-blue">
      <!-- 模型类型 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">模型类型</div>
      </div>
      <div class="h-95px flex"></div>

      <!-- 品种模型 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">品种模型</div>
      </div>
      <div class="h-95px flex"></div>

      <!-- 地块监测 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">地块监测</div>
      </div>
      <div class="h-95px flex"></div>
    </div>

    <div class="w-920px h-full bg-blue">
      <!-- 周期事项 -->
      <div class="agri-title-big-bg title-frame">
        <div class="linear-title-text art-font">周期事项</div>
      </div>
      <div class="h-260px flex bg-green"></div>
    </div>

    <div class="w-460px h-full bg-blue">
      <!-- 指标监测 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">指标监测</div>
      </div>
      <div class="h-95px flex"></div>

      <!-- 模型要素分析 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">模型要素分析</div>
      </div>
      <div class="h-95px flex"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.title-frame {
  display: flex;
  height: 36px;
  padding: 0 36px;
  align-items: center;
  font-size: 18px;
}

.linear-title-text {
  background: linear-gradient(to top, #9AFFD5, #FFFFFF); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
  -webkit-background-clip: text;/*将设置的背景颜色限制在文字中*/
  -webkit-text-fill-color: transparent;/*给文字设置成透明*/
}

.agri-title-bg {
  background-image: url(./assets/agriItemTitleBg.png);
  background-size: 100% 100%;
}

.agri-title-big-bg {
  background-image: url(./assets/agriItemTitleBigBg.png);
  background-size: 100% 100%;
}
</style>