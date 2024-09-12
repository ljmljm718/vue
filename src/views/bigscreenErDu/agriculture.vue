<script setup lang="ts">
import * as L from 'leaflet'
import "leaflet/dist/leaflet.css"
import adapter from '@/components/MapCustom/src/adapter'
import { 
  getQianjiangAgriResource,
  getBreedCategory,
  getVarietyManagement,
} from './api'

adapter()
const VEC_TILE = '/tdCache/api/tdtmap/tile?T=vec_w&x={x}&y={y}&l={z}'
const IMG_TILE = '/tdCache/api/tdtmap/tile?T=img_w&x={x}&y={y}&l={z}'
const CVA_TILE = '/tdCache/api/tdtmap/tile?T=cva_w&x={x}&y={y}&l={z}'

let map: L.Map | null = null
const initMap = () => {
  if (map) return;
  const vecLayer = L.tileLayer(VEC_TILE, { attribution: 'vec' })
  const imgLayer = L.tileLayer(IMG_TILE, { attribution: 'img' })
  const cvaLayer = L.tileLayer(CVA_TILE, { attribution: 'cva' })
  const img_cva_group = L.layerGroup([imgLayer, cvaLayer])

  map = new L.Map(`bigMapContainer`, {
    minZoom: 1,
    maxZoom: 18,
    center: [39.89945, 116.40769],
    zoom: 12,
    zoomOffset: 1,
    zoomControl: false,
    attributionControl: false
  })

  img_cva_group.addTo(map)

  map.on('click', ({ latlng }) => {
    const { lat, lng } = latlng
    navigator.clipboard.writeText(`[${lng}, ${lat}],`)
  })

  window.addEventListener('resize', () => {
    map.invalidateSize(true)
  })
}
//农业资源
const ResList = ref<any[]>([])
const getResList = async () => {
  try {
    ResList.value = await Promise.all([
      getQianjiangAgriResource(),
      getVarietyManagement()
    ])
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => { initMap(),getResList() })
</script>
<template>
  <div class="w-full h-full flex justify-between relative">
    <div class="h-full w-460px">
      <div class="w-460px h-45px agri-title"></div>
      <div class="w-460px pt-15px pb-20px flex justify-evenly">
        <div class="agri-bg-1 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center">
          <div class="text-12px">种植地块</div>
          <div>
            <span class="text-18px pr-5px font-bold">{{
              Array.isArray(ResList) && ResList.length > 0 ? ResList[0].shelterAmount : 0}}</span>
            <span class="text-12px">块</span>
          </div>
        </div>
        <div class="agri-bg-2 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center">
          <div class="text-12px">种植面积</div>
          <div>
            <span class="text-18px pr-5px font-bold">{{ Array.isArray(ResList) && ResList.length > 0 ? ResList[0].plantArea :
              0}}</span>
            <span class="text-12px">亩</span>
          </div>
        </div>
        <div class="agri-bg-3 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center">
          <div class="text-12px">种养品种</div>
          <div>
            <span class="text-18px pr-5px font-bold">{{ Array.isArray(ResList) && ResList.length > 0 ? ResList[1].total :
              0}}</span>
            <span class="text-12px">种</span>
          </div>
        </div>
      </div>
      <div class="w-460px h-45px device-title"></div>
      <div class="grid grid-cols-2 gap-3 p-3 box-border">
        <div class="device-bg w-100% p-5 pb-3 box-border" v-for="item in 2" :key="item">
          <div class="flex space-x-3 items-start">
            <div class="w-50px h-50px bg-red"></div>
            <div class="text-white">
              <div class="text-18px">气象站</div>
              <div class="text-24px">14</div>
            </div>
          </div>
          <div class="flex justify-evenly text-#d1d1d1 mt-2 text-12px">
            <div>
              <span>在线:</span>
              <span>8</span>
            </div>
            <div>|</div>
            <div>
              <span>离线:</span>
              <span>6</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-460px h-45px type-title"></div>
      <div class="p-4 box-border">
        <div class="h-220px bg-red"></div>
      </div>
      <div class="w-460px h-45px mission-title"></div>
    </div>
    <div class="h-full w-460px">
      <div class="w-460px h-45px plant-title"></div>
      <el-scrollbar style="height: 510px;">
        <div class="p-3 box-border grid grid-cols-2 gap-3 text-white">
          <div class="plant-bg w-full p-3 box-border" v-for="item in 4" :key="item">
            <img src="/home.png" class="w-full h-130px object-cover" />
            <div class="flex items-start space-x-2 mt-2">
              <div class="w-5px h-14px bg-#01F892 mt-1 ml-1"></div>
              <div class="space-y-2 text-#d1d1d1 text-12px">
                <div class="text-16px text-white">麻鸭</div>
                <div>
                  <span>所属地块:</span>
                  <span>丰收鸭舍</span>
                </div>
                <div>
                  <span>起止时间:</span>
                  <span>2024.04.01-2024.05.01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="w-460px h-45px warn-title"></div>
      <div class="text-12px">
        <div class="w-447px h-35px flex text-#01F892 items-center">
          <div class="w-110px text-center">预警信息</div>
          <div class="w-237px text-center">时间</div>
          <div class="w-100px text-center">处理状态</div>
        </div>
        <el-scrollbar style="height: 310px" class="warn-table-wrapper">
          <div
class="w-447px h-35px flex text-#fff items-center warn-table-item transition" v-for="item in 14"
            :key="item" style="border: 1px solid #043b24;">
            <div class="w-110px text-center">土壤温度报警</div>
            <div class="w-237px text-center">2024.09.06 13:00:00</div>
            <div class="w-100px text-center">已处理</div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div
      class="absolute w-940px left-460px top-20px flex justify-center space-x-70px z-20 backdrop-blur-sm py-2 bg-#00000090">
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-1"></div>
        <div>
          <div
class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #08FFFF, #FFFFFF);">15</div>
          <div class="text-16px">设备总数</div>
        </div>
      </div>
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-2"></div>
        <div>
          <div
class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #3cffae, #FFFFFF);">15</div>
          <div class="text-16px">设备总数</div>
        </div>
      </div>
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-3"></div>
        <div>
          <div
class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #ffbd39, #FFFFFF);">15</div>
          <div class="text-16px">设备总数</div>
        </div>
      </div>
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-4"></div>
        <div>
          <div
class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #ff4242, #FFFFFF);">15</div>
          <div class="text-16px">设备总数</div>
        </div>
      </div>
    </div>
    <div class="absolute w-940px left-460px bottom-20px flex justify-center text-white z-20 ">
      <div class="flex justify-center space-x-40px backdrop-blur-sm p-3 px-6 bg-#00000090 rounded-3">
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px icon-1"></div>
          <div>摄像</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px icon-2"></div>
          <div>气象</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px icon-3"></div>
          <div>土壤</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px icon-4"></div>
          <div>杀虫</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px icon-5"></div>
          <div>生长记录</div>
        </div>
      </div>
    </div>
    <div class="absolute w-940px left-460px h-full z-0" id="bigMapContainer"></div>
  </div>
</template>
<style scoped lang="scss">
.warn-table-wrapper {
  .warn-table-item:nth-child(odd) {
    background-color: #051a11;
  }
  .warn-table-item:hover {
    background: linear-gradient(to right, #97979700, #047f4c, #97979700);
  }
}

.agri-title {
  background-image: url(./assets/agriTitle.png);
  background-size: 100% 100%;
}

@for $i from 1 through 3 {
  .agri-bg-#{$i} {
    background-image: url(./assets/agriBg#{$i}.png);
    background-size: 100% 100%;
  }
}

.device-title {
  background-image: url(./assets/deviceTitle.png);
  background-size: 100% 100%;
}

.type-title {
  background-image: url(./assets/typeTitle.png);
  background-size: 100% 100%;
}

.mission-title {
  background-image: url(./assets/missionTitle.png);
  background-size: 100% 100%;
}

.plant-title {
  background-image: url(./assets/plantTitle.png);
  background-size: 100% 100%;
}

.plant-bg {
  background-image: url(./assets/plantBg.png);
  background-size: 100% 100%;
}

.weather-title {
  background-image: url(./assets/weatherTitle.png);
  background-size: 100% 100%;
}

.soil-title {
  background-image: url(./assets/soilTitle.png);
  background-size: 100% 100%;
}

.warn-title {
  background-image: url(./assets/warnTitle.png);
  background-size: 100% 100%;
}

.device-bg {
  background-image: url(./assets/deviceBg.png);
  background-size: 100% 100%;
}

@for $i from 1 through 5 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% 100%;
  }
}

@for $i from 1 through 4 {
  .top-icon-#{$i} {
    background-image: url(./assets/topIcon#{$i}.png);
    background-size: 100% 100%;
  }
}

.text-linear-wrapper {
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
