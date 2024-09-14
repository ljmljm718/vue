<script setup lang="ts">
import * as L from 'leaflet'
import CryptoJS from 'crypto-js'
import { generateUUID } from '@/utils'
import adapter from './adapter'
import 'leaflet-draw'
import "leaflet/dist/leaflet.css"
import 'leaflet-draw/dist/leaflet.draw.css'

adapter()
defineOptions({ name: 'MapCustom' })
const componentID = ref<string>(generateUUID())
const message = useMessage() // 消息

const props = defineProps({
  // 使能绘制围栏
  enableEdit: {
    type: Boolean,
    default: () => false
  }
})

const VEC_TILE = '/tdCache/api/tdtmap/tile?T=vec_w&x={x}&y={y}&l={z}'
const IMG_TILE = '/tdCache/api/tdtmap/tile?T=img_w&x={x}&y={y}&l={z}'
const CVA_TILE = '/tdCache/api/tdtmap/tile?T=cva_w&x={x}&y={y}&l={z}'

let map: L.Map | null = null
let activeLayer = null
const initMap = () => {
  if (map) return;
  const vecLayer = L.tileLayer(VEC_TILE, { attribution: 'vec' })
  const imgLayer = L.tileLayer(IMG_TILE, { attribution: 'img' })
  const cvaLayer = L.tileLayer(CVA_TILE, { attribution: 'cva' })

  const vec_cva_group = L.layerGroup([vecLayer, cvaLayer])
  const img_cva_group = L.layerGroup([imgLayer, cvaLayer])

  map = new L.Map(`mapIns_${componentID.value}`, {
    minZoom: 1,
    maxZoom: 18,
    center: [39.89945, 116.40769],
    zoom: 12,
    zoomOffset: 1,
    zoomControl: false,
    attributionControl: false
    // crs: L.CRS.EPSG4326,
  })

  img_cva_group.addTo(map)

  map.on('click', ({ latlng }) => {
    const { lat, lng } = latlng
    navigator.clipboard.writeText(`[${lng}, ${lat}],`)
  })

  L.control
    .layers({
      卫星图层: img_cva_group,
      标准图层: vec_cva_group
    })
    .addTo(map)

  window.addEventListener('resize', () => {
    map.invalidateSize(true)
  })
  //添加绘制图层
  if (!props.enableEdit) return;
  const drawnItems = new L.FeatureGroup()
  map.addLayer(drawnItems)
  //添加绘制控件
  const drawControl = new L.Control.Draw({
    draw: {
      //绘制线
      polyline: false,
      //绘制多边形
      polygon: true,
      //绘制矩形
      rectangle: true,
      //绘制圆
      circle: true,
      //绘制标注
      marker: false,
      //绘制圆形标注
      circlemarker: false
    },
  })
  //添加绘制控件
  map.addControl(drawControl)
  map.on("draw:drawstart", async () => {
    await message.confirm('绘制围栏需要先清除先前绘制的内容，是否继续？').then(() => {
      if (activeLayer) {
        map.removeLayer(activeLayer);
        activeLayer = null;
      }
    }).catch(() => {
      map.removeControl(drawControl)
      map.addControl(drawControl)
      if (activeLayer) activeLayer.addTo(map)
    });
  })
  map.on(L.Draw.Event.CREATED, (e) => {
    const type = e.layerType, layer = e.layer;
    activeLayer = layer;
    layer.setStyle({ ...layerStyle.value }).addTo(map)
    showStyleController.value = true
  })
}

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})
const layerMap = new Map<string, any>()

// 创建多边形
const createPolygon = (latlngs: L.point[], option = {}, enableEdit = true) => {
  const sha256 = CryptoJS.SHA256(latlngs.toString().replace(' ', '')).toString()
  const polygon = L.polygon(latlngs, option)
  if (!layerMap.has(sha256)) {
    polygon.addTo(map)
    layerMap.set(sha256, polygon)
  }
  if (enableEdit) activeLayer = polygon
  map.fitBounds(latlngs, { padding: [5, 5] })
}

// 设置中心点和缩放层级
const setCenterZoom = (latlng: L.point, zoom: number) => {
  map.setView(latlng, zoom)
}

const showStyleController = ref<boolean>(false)
const layerStyle = ref({
  color: '#3388ff',
  fillColor: '#3388ff',
  weight: 1
})
const handleStyleChange = () => {
  activeLayer.setStyle({
    ...layerStyle.value,
  })
}

const getCurrentSaveCoordinates = () => {
  const { editing } = activeLayer;
  const { latlngs } = editing;
  if (Array.isArray(latlngs) && latlngs.length > 0) {
    const corrdinates = latlngs[0]
    return { corrdinates, option: layerStyle.value }
  } else {
    return { corrdinates: [], option: {} }
  }
}

defineExpose({
  initMap,
  createPolygon,
  setCenterZoom,
  getCurrentSaveCoordinates
})
</script>
<template>
  <div class="w-full h-full relative">
    <div
      class="w-full h-full"
      :id="`mapIns_${componentID}`"
    ></div>
    <div
      class="absolute right-3 bottom-3 p-6 py-4 bg-white z-999 rounded-2 shadow-md"
      v-show="showStyleController"
    >
      <div class="flex items-center">
        <div class="flex items-center py-2">
          <div class="w-5rem">边框颜色:</div>
          <div class="w-3rem">
            <el-color-picker v-model="layerStyle.color" @change="handleStyleChange()" />
          </div>
        </div>
        <div class="flex items-center py-2">
          <div class="w-5rem">填充颜色:</div>
          <div class="w-3rem">
            <el-color-picker v-model="layerStyle.fillColor" @change="handleStyleChange()" />
          </div>
        </div>
      </div>
      
      <div class="flex items-center py-2">
        <div class="w-5rem">边框宽度:</div>
        <div>
          <el-input-number
            v-model="layerStyle.weight"
            class="!w-10rem"
            :min="1"
            :max="10"
            @change="handleStyleChange()"
          />
        </div>
      </div>
      
    </div>
  </div>
</template>
<style lang="scss">
.leaflet-draw-actions a {
  background-color: #f1f1f1;
}
</style>
