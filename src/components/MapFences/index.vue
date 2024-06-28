<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
// @ts-ignore
window._AMapSecurityConfig = {
    securityJsCode:'289153494763707d55b03878ace1cb08',
}
// @ts-ignore
const AMap = (window as any).AMap
defineOptions({ name: 'MapFences' })
const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('选择区域'),
  areaPositions: {
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

const selectedArea = ref<Array<Array<number>>>([])
const handleEmitPos = () => {
  console.log("Change", selectedArea.value);
  
  emit('change', selectedArea.value)
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (val:boolean) => {
  if (val) nextTick(() => { initMap() })
})

const generateRect = (swPos:Array<any>, nePos:Array<any>) => {
  const southWest = new AMap.LngLat(swPos[0], swPos[1])
  const northEast = new AMap.LngLat(nePos[0], nePos[1])
  const bounds = new AMap.Bounds(southWest, northEast)
  const rectangle = new AMap.Rectangle({
    bounds: bounds,
    strokeColor:'red',
    strokeWeight: 6,
    strokeOpacity:0.5,
    strokeDasharray: [30,10],
    // strokeStyle还支持 solid
    strokeStyle: 'dashed',
    fillColor:'blue',
    fillOpacity:0.5,
    cursor:'pointer',
    zIndex:50,
  })
  mapIns && rectangle.setMap(mapIns)
  // 缩放地图到合适的视野级别
  mapIns && mapIns.setFitView([ rectangle ])
  rectangleEditor = new AMap.RectangleEditor(mapIns, rectangle)

  rectangleEditor.on('adjust', function(event) {
    console.log('触发事件：adjust')
  })

  rectangleEditor.on('end', function(event) {
    const { northEast, southWest } = event.target.ir
    selectedArea.value = [
      [southWest.lng, southWest.lat],
      [northEast.lng, northEast.lat]
    ]
  })
}

const defaultAreaPositions = computed(() => props.areaPositions)

const initMap = () => {
  console.log("props.centerPos", props.centerPos);
  
  mapIns = new AMap.Map("mapFencesDom", {
    zoom: 18,//级别
    center: props.centerPos, //中心点坐标
    // mapStyle: 'amap://styles/blue', //设置地图的显示样式
  });
  // 处理默认的传入点数组
  if (defaultAreaPositions.value.length === 2) {
    mapIns.clearMap()
    const swPos:Array<number> = defaultAreaPositions.value[0]
    const nePos:Array<number> = defaultAreaPositions.value[1]

    generateRect(swPos, nePos)
  }
  mapIns.on('click', (e) => {
    if (e) console.log("click", e);
    const { lnglat } = e
    const { lng, lat } = lnglat
    navigator.clipboard.writeText(`[${lng}, ${lat}],`)
    if (defaultAreaPositions.value.length === 0) {
      // 如果没有默认区域，点击生成默认区域
      mapIns.clearMap()
      const swPos:Array<number> = [lng - 0.1, lat - 0.1]
      const nePos:Array<number> = [lng + 0.1, lat + 0.1]
      generateRect(swPos, nePos)
    }
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
      <div class="absolute top-2 left-2 bg-white rounded-2 shadow-md p-2 z-99">
        <div>
          <el-button
            type="primary"
            @click="rectangleEditor && rectangleEditor.open()"
          >开始编辑</el-button>
          <el-button
            @click="rectangleEditor && rectangleEditor.close()"
          >结束编辑</el-button>
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

