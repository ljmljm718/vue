<template>
  <div>
    <el-dialog
    v-model="dialogVisible"
    width="70%"
    :before-close="handleClose"
  >
    <div class=" my-15px flex ">
      <div >地名：<input placeholder="请输入具体地名" class="w-200px h-30px rounded border-[#c1c1c1] border-1" type="text" v-model="mapData.keyword" /> <el-button type="primary" @click="search">搜索</el-button> </div>
      <div class="mx-15px">经度：<input class=" w-200px h-30px rounded border-[#c1c1c1] border-1" type="text" v-model="Inputlng" /></div>
      <div >纬度：<input class="w-200px h-30px rounded border-[#c1c1c1] border-1" type="text" v-model="Inputlat" /></div>
    </div>
    <div id="container" class="w-full h-[600px]"></div>
  </el-dialog>
   
  </div>
</template>
<script setup>
import { onMounted, ref,reactive,onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
  securityJsCode: '289153494763707d55b03878ace1cb08'
}
const dialogVisible=ref(false)
const Inputlng = ref('')
const Inputlat = ref('')

const map = ref(null)
const mapData = reactive({
  map: {},
  keyword: '',
  selectedLocation: {},
  selectedAddress: '',
  marker: null, // 用于存储选中位置的标记
})
// 初始化地图
const initMap=()=>{
  AMapLoader.reset()
  AMapLoader.load({
    key: 'e49669059fa36494531a82ed982f395c', // key值
    version: '1.4.15',
    plugins: ['AMap.PlaceSearch'],
  })
    .then((AMap) => {
      const mapInstance = new AMap.Map('container', {
        viewMode: '2D',
        zoom: 11,
        center: [116.397033, 39.917606],
        scrollWheel: true, // 启用滚动缩放
      })

      mapInstance.on('click', (e) => {
        Inputlng.value = e.lnglat.getLng()
        Inputlat.value = e.lnglat.getLat()

        // 移除之前的标记
        if (mapData.marker) {
          mapData.marker.setMap(null)
        }

        // 将地图中心设置为选中位置
        // mapData.map.setCenter([lng.value, lat.value])
      })

      mapData.map = mapInstance
    })
    .catch((e) => {
      console.log(e)
    })
}
//搜索
const search=()=>{
  if (mapData.keyword) {
    AMapLoader.load({
      key: 'e49669059fa36494531a82ed982f395c',
      version: '1.4.15',
      plugins: ['AMap.PlaceSearch',],
    }).then((AMap) => {
        const placeSearch = new AMap.PlaceSearch({
          city: '全国', 
          map: mapData.map,
          citylimit:true
        })
        placeSearch.search(mapData.keyword, (status, result) => {
          console.log(result) 
          if (status === 'complete') {
            const pois = result.poiList.pois
            if (pois.length > 0) {
              const { location } = pois[0]
              // 将地图中心设置为选中位置
              mapData.map.setCenter(location)
            }
          }
          else {
            console.log('搜索失败或无结果')
          }
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }




}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
})
</script>
