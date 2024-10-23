<script setup lang="ts">
import ScaleBox from "vue3-scale-box";
import CurrentTime from './components/currentTime.vue'
import AgriComponent from './agriculture.vue'
import VisualMonitor from './visualmonitor.vue'
import PlantModel from './plantmodel.vue'

const activeTab = ref<string>('agri')
const openPage = (url:string) => {
  if (!url) return;
  window.open(url);
}

const agricultureRef = ref()
const visualMonitorRef = ref()
const plantModelRef = ref()
const handleTabChange = (tab:string) => {
  if (!tab) return;
  activeTab.value = tab;
  nextTick(() => {
    if (tab === 'agri') agricultureRef.value?.handleActive();
    if (tab === 'monitor') visualMonitorRef.value?.handleActive();
    if (tab === 'model') plantModelRef.value?.handleActive();
  })
}
</script>
<template>
  <div class="w-[100vw] h-[100vh] overflow-hidden bg-black">
    <!-- 默认分辨率 1920 1080 -->
    <scale-box>
      <div class="w-full h-full">
        <div class="w-full h-100px header-bg flex items-end justify-between">
          <div class="h-86px flex items-center pl-50px">
            <div
              :class="`${
                activeTab === 'agri' ? 'active-btn-bg' : 'btn-bg'
              } w-117px h-32px text-14px text-#01F892 flex items-center justify-center cursor-pointer hover:scale-105 transition`"
              @click="handleTabChange('agri')"
            >智慧农业</div>
            <div
              :class="`${
                activeTab === 'monitor' ? 'active-btn-bg' : 'btn-bg'
              } w-117px h-32px text-14px text-#FFFFFF flex items-center justify-center cursor-pointer hover:scale-105 transition`"
              @click="activeTab = 'monitor'"
            >可视化监控</div>
            <div
              :class="`${
                activeTab === 'model' ? 'active-btn-bg' : 'btn-bg'
              } w-117px h-32px text-14px text-#FFFFFF flex items-center justify-center cursor-pointer hover:scale-105 transition`"
              @click="activeTab = 'model'"
            >种植模型</div>
          </div>
          <div class="h-86px flex items-center pl-50px w-320px relative top-[-8px]">
            <current-time />
          </div>
        </div>
        <div class="w-full h-980px p-20px pt-10px box-border">
          <agri-component v-if="activeTab === 'agri'" ref="agricultureRef" />
          <visual-monitor v-if="activeTab === 'monitor'" ref="visualMonitorRef" />
          <plant-model v-if="activeTab === 'model'" ref="plantModelRef" />
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