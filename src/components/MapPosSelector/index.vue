<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
// @ts-ignore
window._AMapSecurityConfig = {
    securityJsCode:'289153494763707d55b03878ace1cb08',
}
// @ts-ignore
const AMap = (window as any).AMap
defineOptions({ name: 'MapPosSelector' })
const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('选择坐标点'),
  position: {
    type: Array<Array<number>>,
    default: []
  },
  centerPos: propTypes.array.def([108.60662259981041, 29.5245921193875])
})
const emit = defineEmits(['update:modelValue', 'change']);

const dialogVisible = computed(() => props.modelValue)
const handleClose = () => {
  emit('update:modelValue', false)
}

let mapIns:any = null
let rectangleEditor:any = null

const selectedPosition = ref<Array<number>>([])
const handleEmitPos = () => {
  emit('change', selectedPosition.value)
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (val:boolean) => {
  if (val) nextTick(() => { initMap() })
})

const defaultPosition = computed(() => props.position)

const addMarker = (position) => {
  const marker = new AMap.Marker({ position });

  // 将 markers 添加到地图
  mapIns.add(marker);
}

const initMap = () => {
  mapIns = new AMap.Map("mapFencesDom", {
    zoom: 18,//级别
    center: props.centerPos, //中心点坐标
    // mapStyle: 'amap://styles/blue', //设置地图的显示样式
  });
  // 处理默认的传入点数组
  if (defaultPosition.value.length === 2) {
    mapIns.clearMap()
    addMarker(new AMap.LngLat(defaultPosition.value[0], defaultPosition.value[1]))
  }
  mapIns.on('click', (e) => {
    const { lnglat } = e
    const { lng, lat } = lnglat
    navigator.clipboard.writeText(`[${lng}, ${lat}],`)
    mapIns.clearMap()
    addMarker(new AMap.LngLat(lng, lat))
    selectedPosition.value = [lng, lat]
  })
}
</script>
<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="70%"
    :before-close="handleClose"
  >
    <div class="relative">
      <div class="absolute top-2 left-2 bg-white rounded-2 shadow-md p-2 z-99 hidden">
        <div>
          <el-button
            type="primary"
            @click="rectangleEditor && rectangleEditor.open()"
          >开始编辑</el-button>
        </div>
        <div class="text-[#666666] text-[.7rem] mt-1">点击空白区域生成选框</div>
      </div>
      <div
        id="mapFencesDom"
        class="w-full h-[600px] shadow-md"
      ></div>
    </div>
    <template #footer>
      <el-button @click="handleClose()">取消</el-button>
      <el-button type="primary" @click="handleEmitPos()">确认</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss">
</style>


