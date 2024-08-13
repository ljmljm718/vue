<template>
  <div class="w-[160px] h-[170px] relative">
    <div 
      :class="modelIconStyle"
      :style="`background-image: url('${ modelImg }')`"
    >
    </div>
    <div 
      class="absolute top-[121px] w-[160px] h-[40px] mt-[10px] text-[20px] text-center leading-[40px]"
      :class="nameStyle"
    >
      {{ modelName }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  modelName: String,
  activated: Boolean,
  modelImg: String,
})

const modelIconStyle = reactive({
  modelIconActivated: props.activated,
  modelIconNormal: !props.activated
})

const nameStyle = reactive({
  nameActivated: props.activated
})

</script>

<style scoped>
.modelIconNormal {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/model-icon.png);
  background-size: 100% 100%;
  width: 120px;
  height: 111px;
  position: absolute;
  left: 20px;
}
.modelIconActivated {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/model-icon-activated.png);
  background-size: 100% 100%;
  width: 120px;
  height: 111px;
  position: absolute;
  left: 20px;
  box-shadow: 0px 2px 10px 0px #08795D;
}
.nameActivated {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/model-name-activated.png);
  background-size: 100% 100%;
  color: #35DAD2;
}
</style>