<script setup lang="ts">
import ScaleBox from "vue3-scale-box";
import CurrentTime from './components/currentTime.vue'
import AgriComponent from './agriculture.vue'

const acviveTab = ref<string>('agri')
</script>
<template>
  <div class="w-[100vw] h-[100vh] overflow-hidden bg-black">
    <!-- 默认分辨率 1920 1080 -->
    <scale-box>
      <div class="w-full h-full">
        <div class="w-full h-100px header-bg flex items-end justify-between">
          <div class="h-86px flex items-center pl-50px">
            <div
              class="active-btn-bg w-117px h-32px text-14px text-#01F892 flex items-center justify-center"
              @click="acviveTab = 'agri'"
            >智慧农业</div>
            <div
              class="btn-bg w-117px h-32px text-14px text-#FFFFFF flex items-center justify-center"
              @click="acviveTab = 'monitor'"
            >可视化监控</div>
            <div
              class="btn-bg w-117px h-32px text-14px text-#FFFFFF flex items-center justify-center"
            >种植模型</div>
          </div>
          <div class="h-86px flex items-center pl-50px w-320px relative top-[-8px]">
            <current-time />
          </div>
        </div>
        <div class="w-full h-980px p-20px pt-10px box-border">
          <agri-component />
        </div>
      </div>
    </scale-box>
  </div>
</template>
<style scoped lang="scss">
.header-bg {
  background-image: url(./assets/headerBg.png);
  background-size: 100% 100%;
}

.btn-bg {
  background-image: url(./assets/btn.png);
  background-size: 100% 100%;
}

.active-btn-bg {
  background-image: url(./assets/activeBtn.png);
  background-size: 100% 100%;
}
</style>