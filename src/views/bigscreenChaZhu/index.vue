<script setup lang="ts">
import ScaleBox from "vue3-scale-box";
import CurrentTime from './components/currentTime.vue'
import AgriculturePage from './agriculture.vue'
import VisualMonitor from './visualmonitor.vue'
import PlantModel from './plantmodel.vue'

const props = defineProps({
  title: {
    type: String,
    default: '永川区茶竹村大屏驾驶舱'
  },
})

const agricultureRef = ref()
const visualMonitorRef = ref()
const plantModelRef = ref()

const activeTab = ref<string>('agri');
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
  <div class="w-100vw h-100vw overflow-hidden bg-black">
    <ScaleBox>
      <div class="w-full h-full bg-black text-white">
        <div class="w-full h-100px header-bg flex items-center justify-between">
          <div class="w-410px h-50px flex items-end relative left-[55px] top-[-5px]">
            <div
              :class="`${activeTab === 'agri' ? 'active-btn-bg' : 'btn-bg'}`"
              @click="handleTabChange('agri')"
            >智慧农业</div>
            <div
              :class="`${activeTab === 'monitor' ? 'active-btn-bg' : 'btn-bg'}`"
              @click="handleTabChange('monitor')"
            >可视化监控</div>
            <div
              :class="`${activeTab === 'model' ? 'active-btn-bg' : 'btn-bg'}`"
              @click="handleTabChange('model')"
            >种植模型</div>
          </div>
          <div class="text-36px art-font">{{ props.title }}</div>
          <div class="w-410px flex justify-center">
            <div class="w-300px"><CurrentTime /></div>
          </div>
        </div>
        <div class="p-18px h-980px box-border pt-10px">
          <div class="w-full h-full">
            <AgriculturePage v-if="activeTab === 'agri'" ref="agricultureRef" />
            <VisualMonitor v-if="activeTab === 'monitor'" ref="visualMonitorRef" />
            <PlantModel v-if="activeTab === 'model'" ref="plantModelRef" />
          </div>
        </div>
      </div>
    </ScaleBox>
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

.active-btn-bg, .btn-bg {
  width: 117px;
  height: 32px;
  font-size: 14px;
  color: #01F892;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>