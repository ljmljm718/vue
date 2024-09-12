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

const VEC_TILE = '/tdCache/api/tdtmap/tile?T=vec_w&x={x}&y={y}&l={z}'
const IMG_TILE = '/tdCache/api/tdtmap/tile?T=img_w&x={x}&y={y}&l={z}'
const CVA_TILE = '/tdCache/api/tdtmap/tile?T=cva_w&x={x}&y={y}&l={z}'

let map: L.Map | null = null
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
  return;
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
  map.on(L.Draw.Event.CREATED, (e) => {
    const type = e.layerType, layer = e.layer;
    layer.addTo(map)
  })
}

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})
const layerMap = new Map<string, any>()

// 创建多边形
const createPolygon = (latlngs: L.point[], option = {}) => {
  const sha256 = CryptoJS.SHA256(latlngs.toString().replace(' ', '')).toString()
  const polygon = L.polygon(latlngs, option)
  if (!layerMap.has(sha256)) {
    polygon.addTo(map)
    layerMap.set(sha256, polygon)
  }
  map.fitBounds(latlngs, { padding: [5, 5] })
}

// 设置中心点和缩放层级
const setCenterZoom = (latlng: L.point, zoom: number) => {
  map.setView(latlng, zoom)
}

defineExpose({
  initMap,
  createPolygon,
  setCenterZoom
})
</script>
<template>
  <div class="w-full h-full relative">
    <div
      class="w-full h-full"
      :id="`mapIns_${componentID}`"
    ></div>
  </div>
</template>
<style lang="scss">
.leaflet-draw-actions a {
  background-color: #f1f1f1;
}
</style>
