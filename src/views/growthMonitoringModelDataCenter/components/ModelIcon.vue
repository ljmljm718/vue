<template>
  <div class="w-[160px] h-[170px] relative">
    <div 
      :class="modelIconStyle"
    >
      <img :src="modelImg" class="w-[100px] h-[80px] mt-[15px] object-contain" />
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
      // :style="`background-image: url('${ modelImg }');background-size: contain; background-repeat: no-repeat; background-position: center center;`"

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
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/model-base.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 120px;
  height: 111px;
  position: absolute;
  left: 20px;
  text-align: center;
}
.modelIconActivated {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/model-base.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 120px;
  height: 111px;
  position: absolute;
  left: 20px;
  text-align: center;
  box-shadow: 0px 2px 10px 0px #08795D;
}
.nameActivated {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/model-name-activated.png);
  background-size: 100% 100%;
  color: #35DAD2;
}
</style>