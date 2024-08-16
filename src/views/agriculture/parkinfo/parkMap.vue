<template>
  <div class="w-full h-full relative">
    <div id="parkMap" class="w-full h-full z-0 relative"></div>
    <div class="absolute right-2 top-2 bg-white rounded-2 shadow-md z-20 p-1">
      <div v-if="curLayer === 'img'" class="flex items-center" @click="turn2vec()">
        <img :src="vector" alt="" class="w-[4rem]" />
      </div>
      <div v-else class="flex items-center" @click="turn2img()">
        <img :src="satellite" alt="" class="w-[4rem]" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import satellite from './satellite.jfif'
import vector from './vector.png'
// 服务域名
const tdtUrl = 'https://www.zhuangbeizz.cn/tiandi/'
// 服务负载子域
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
const token = '7eb5c1eba47d10073b06a4bb8d5a1e3c'

const curLayer = ref('img')
const turn2vec = () => {
  curLayer.value = 'vec'
  const vecLayer = new T.TileLayer(tdtUrl + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + token, {
    minZoom: 1,
    maxZoom: 18
  })
  map && map.addLayer(vecLayer)
}
const turn2img = () => {
  if (!map) return
  const layers = map.getLayers()
  if (!Array.isArray(layers)) return
  curLayer.value = 'img'
  for (let i = 0; i < layers.length; i++) {
    const _layer = layers[i]
    const { FR = '' } = _layer
    if (FR.indexOf('T=vec_w') !== -1) {
      map.removeLayer(_layer)
    }
  }
}

let map: any = null
const init = () => {
  const imgLayer = new T.TileLayer(tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token, {
    minZoom: 1,
    maxZoom: 18
  })
  const wtfsLayer = new T.TileLayer(tdtUrl + 'DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + token, {
    minZoom: 1,
    maxZoom: 18,
    zIndex: 999
  })

  map = new T.Map('parkMap', {
    layers: [imgLayer, wtfsLayer],
    projection: 'EPSG:900913',
    minZoom: 5,
    maxZoom: 18
  })
  //@ts-ignore
  const lnglat = new T.LngLat(116.40769, 39.89945)
  map.centerAndZoom(lnglat, 12)
}

const createPolygon = (_polyPoints: any[]) => {
  const _polygon = new T.Polygon(_polyPoints, {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWidth: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.3
  })
  map.addOverLay(_polygon)
}

const setCenterZoom = (_pos: any[], _zoom: number = 13) => {
  map.centerAndZoom(new T.LngLat(_pos[0], _pos[1]), _zoom)
}

onMounted(() => {
  init()
})

defineExpose({
  createPolygon,
  setCenterZoom
})
</script>
