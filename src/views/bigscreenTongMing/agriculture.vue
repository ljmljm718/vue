<script setup lang="ts">
import * as L from 'leaflet'
import "leaflet/dist/leaflet.css"
import adapter from '@/components/MapCustom/src/adapter'
import {
  initChartStatic,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import { 
  getQianjiangAgriResource,
  getVarietyManagement,
  getDeviceInfo,
  getBreedCategory
} from './api';

adapter()
const IMG_TILE = '/tdCache/api/tdtmap/tile?T=img_w&x={x}&y={y}&l={z}'
const CVA_TILE = '/tdCache/api/tdtmap/tile?T=cva_w&x={x}&y={y}&l={z}'

let map: L.Map | null = null
const initMap = () => {
  if (map) return;
  // const vecLayer = L.tileLayer(VEC_TILE, { attribution: 'vec' })
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

  // 获取地图数据
  getEquipmentMapData()
}

const getEquipmentMapData = () => {}
onMounted(() => { initMap() });

//农业资源
const ResList = ref<any[]>([])
const agriResourceData = ref({
  shelterAmount: 0,
  plantArea: 0,
  total: 0
})
const getAgriResourceData = async () => {
  const res = await getQianjiangAgriResource().catch(() => {})
  console.log("🚀 ~ getAgriResourceData ~ res:", res)
  if (!res || (!res.shelterAmount || !res.plantArea)) return;
  agriResourceData.value.shelterAmount = res.shelterAmount;
  agriResourceData.value.plantArea = res.plantArea;

  // 获取种养品种总数
  const { total } = await getVarietyManagement().catch(() => {})
  console.log("🚀 ~ getAgriResourceData ~ total:", total);
  agriResourceData.value.total = res.total;
}
getAgriResourceData()


// 设备信息
const deviceList = ref<any[]>([])
const getDeviceList = async () => {
  const { category } = await getDeviceInfo();
  console.log("🚀 ~ getDeviceList ~ category:", category);
  if (!Array.isArray(category)) return;
  deviceList.value = category;
}
getDeviceList()

// 品种分布
const showVarietyNoData = ref<boolean>(false);
const initVarietyChart = async () => {
  const res = await getBreedCategory();
  console.log("🚀 ~ initVarietyChart ~ res:", res)
  if (!Array.isArray(res)) return;
  const seriesData = res.map(item => ({
    name: item.cropName || '暂无数据',
    value: item.number,
    unit: item.unit
  }))
  if (seriesData.length === 0) showVarietyNoData.value = true
  initChartStatic(
    'varietyChart',
    generatePieOptions({
      legend: {
        show: true,
        top: 'center',
        right: '10',
        bottom: '0',
        orient: 'vertical',
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
          color: '#fff'
        }
      },
      color: ['#01faea', '#02fbbc','#ff994d'],
      series: [
        {
          type: 'pie',
          minAngle: 10,
          startAngle:200,
          radius: ['35%', '60%'],
          center: ['30%', '50%'],
          data: seriesData,
          label: {
            formatter: ({ name, percent }) => `${name} - (${parseInt(percent)}%)`,
            color: '#d1d1d1',
          },
          labelLine: {
            show: true,
            lineStyle: {
              color:'#d1d1d1'
            }
          },
          emphasis: {
            itemStyle: { borderWidth: 0 }
          },
        }
      ],
      tooltip: {
        formatter: (item) => {
          return `数据详情<br />${item.marker}${item.name}<span style="padding-left: 1rem;">${item.value} ${item.data.unit}</span>`
        },
        position: function (point) {
          return [point[0] - 90, point[1] + 20]
        },
      },
    })
  )
}
onMounted(() => initVarietyChart())

// tab页切换到此页面时触发
const handleActive = () => {}
defineExpose({ handleActive })
</script>
<template>
  <div class="h-full flex justify-between">
    <div class="w-460px h-full">
      <!-- 农业资源 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">农业资源</div>
      </div>
      <div class="h-95px flex items-center justify-evenly">
        <div class="agri-bg-1 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center">
          <div class="text-12px">种植地块</div>
          <div>
            <span class="text-18px pr-5px font-bold">
              {{ agriResourceData.shelterAmount ?? 0 }}
            </span>
            <span class="text-12px">块</span>
          </div>
        </div>
        <div class="agri-bg-2 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center">
          <div class="text-12px">种植面积</div>
          <div>
            <span class="text-18px pr-5px font-bold">
              {{ agriResourceData.plantArea ?? 0 }}
            </span>
            <span class="text-12px">亩</span>
          </div>
        </div>
        <div class="agri-bg-3 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center">
          <div class="text-12px">种养品种</div>
          <div>
            <span class="text-18px pr-5px font-bold">
              {{ agriResourceData.total }}
            </span>
            <span class="text-12px">种</span>
          </div>
        </div>
      </div>

      <!-- 设备信息 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">设备信息</div>
      </div>
      <div class="h-150px flex">
        <el-scrollbar class="w-full">
          <div
            class="grid grid-cols-2 gap-3 p-3 box-border"
            v-if="deviceList.length"
          >
            <div 
              class="device-bg w-100% p-5 pb-3 box-border"
              v-for="item in deviceList"
              :key="item.imgId"
            >
              <div class="flex space-x-3 items-start">
                <div class="w-50px h-50px">
                  <img
                    :src="item.imgId"
                    class="object-contain w-50px h-50px"
                  />
                </div>
                <div class="text-white">
                  <div class="text-18px">
                    {{ item.categoryName }}
                  </div>
                  <div class="text-24px">
                    {{ item.total }}
                  </div>
                </div>
              </div>
              <div class="flex justify-evenly text-#d1d1d1 mt-2 text-12px">
                <div>
                  <span>在线:</span>
                  <span>{{ item.online }}</span>
                </div>
                <div>|</div>
                <div>
                  <span>离线:</span>
                  <span>{{ item.offline }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="w-full h-135px p-3 box-border flex justify-center items-center tracking-widest">
            <div class="text-[#01F892]">暂无数据</div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 品种分布 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">品种分布</div>
      </div>
      
      <div class="h-232px flex relative">
        <div id="varietyChart" class=""></div>
        <div
          class="
            absolute left-0 top-0 w-full h-full
            text-[#01F892] flex justify-center
            items-center tracking-widest
          "
          v-if="showVarietyNoData"
        >暂无数据</div>
      </div>

      <!-- 农事任务 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">农事任务</div>
      </div>
      <div class="h-325px flex bg-green"></div>
    </div>

    <div class="w-920px h-full">
      <div class="h-650px relative rounded-2">
        <div class="flex justify-evenly items-center"></div>
        <div id="bigMapContainer" class="absolute left-0 top-0 w-full h-full"></div>
        <div class="absolute w-full bottom-3 left-0 flex justify-center z-10">
          <div class="flex"></div>
        </div>
      </div>
      
      <!-- 农事任务 -->
      <div class="agri-title-big-bg title-frame mt-10px">
        <div class="linear-title-text art-font">种养方案</div>
      </div>
      <div class="h-250px flex bg-green"></div>
    </div>

    <div class="w-460px h-full bg-blue">
      <!-- 气象监测 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">气象监测</div>
      </div>
      <div class="h-260px flex bg-green"></div>

      <!-- 土壤墒情 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">土壤墒情</div>
      </div>
      <div class="h-260px flex bg-green"></div>

      <!-- 预警信息 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">预警信息</div>
      </div>
      <div class="h-260px flex bg-green"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.title-frame {
  display: flex;
  height: 36px;
  padding: 0 36px;
  align-items: center;
  font-size: 18px;
}

.linear-title-text {
  background: linear-gradient(to top, #9AFFD5, #FFFFFF); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
  -webkit-background-clip: text;/*将设置的背景颜色限制在文字中*/
  -webkit-text-fill-color: transparent;/*给文字设置成透明*/
}

.agri-title-bg {
  background-image: url(./assets/agriItemTitleBg.png);
  background-size: 100% 100%;
}

.agri-title-big-bg {
  background-image: url(./assets/agriItemTitleBigBg.png);
  background-size: 100% 100%;
}

@for $i from 1 through 3 {
  .agri-bg-#{$i} {
    background-image: url(./assets/agriBg#{$i}.png);
    background-size: 100% 100%;
  }
}
</style>