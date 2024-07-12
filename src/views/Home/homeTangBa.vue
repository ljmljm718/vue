<template>
  <div class="home-tangbg-wrapper shadow-xl overflow-hidden">
    <MapTangBa ref="mapTangBgRef" class="h-full" />
    <div
      class="absolute left-3 top-3 rounded-2 bg-slate-200 p-3 pr-1 shadow-xl"
      style="height: calc(100% - 4.5rem);"
      v-loading="menuDataLoading"
    >
      <div class="art-font pb-2 pl-1">设备监测列表</div>
      <el-scrollbar
        class="overflow-auto pr-2"
        height="calc(100% - 2rem)"
      >
        <el-menu
          class="el-menu-vertical-demo min-w-[230px]"
          @select="handleSelect"
        >
          <el-sub-menu
            :index="item.id"
            v-for="item in menuDataList"
            :key="item.id"
          >
            <template #title>
              <div class="flex space-x-2 items-center">
                <div class="w-[4px] h-[13px] bg-[#0160ff]"></div>
                <div>{{ item.name }}</div>
              </div>
            </template>
            <el-sub-menu
              :index="subMenu.id"
              v-for="subMenu in item.children"
              :key="subMenu.id"
            >
              <template #title>
                <span>{{ subMenu.name }}</span>
              </template>
              <el-menu-item
                v-for="secMenu in subMenu.children"
                :key="secMenu.id"
                :index="secMenu.id"
              >
                <div class="flex items-center space-x-2">
                  <div
                    :class="`${getIconClass(secMenu)} w-[20px] h-[20px]`"
                  ></div>
                  <div>{{ secMenu.name }}</div>
                </div>
              </el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <PanelTangBa ref="panelTangBaRef" class="absolute right-0 top-0" v-model="showPanel" />
  </div>
</template>
<script setup lang="ts">
// @ts-ignore
import MapTangBa from './mapTangBa.vue'
// @ts-ignore
import PanelTangBa from './panelTangBa.vue'
import {
  getDeviceCategoryTree,
  getDeviceInfo
} from './apis'
defineOptions({ name: 'HomeTangBa' })

const mapTangBgRef = ref<any>()
const deviceDataList = ref<Array<any>>([])

const panelTangBaRef = ref<any>(null)
const handleSelect = async (item) => {
  showPanel.value = true
  const res = await getDeviceInfo({ id: item })
  if (panelTangBaRef.value) panelTangBaRef.value.getDeviceInfoData(res)
  if (mapTangBgRef.value) {
    console.log("地图设备详情", res);
    
    // mapTangBgRef.value.addMarkerToMap(res.longitude, res.latitude, res.deviceName)
    const infoString = `<div class="bg-[#e8f2fc] relative bottom-[35px]">
        <div class="bg-[#95bbf8] p-2 px-3 art-font">${res.parkName}</div>
        <div class="p-2 art-font text-[14px]">
          <div class="p-1 px-2">${res.parkDetailName}</div>
          <div class="p-1 px-2 flex space-x-2 items-center">
            <div class="${res.deviceStatus === 'online' ? 'bg-[#35dc71]' : 'bg-[#e84133]'} w-[8px] h-[8px] rounded-full"></div>
            <div>${res.deviceStatus === 'online' ? '在线' : '离线'}</div>
          </div>
        </div>
      </div>`
    mapTangBgRef.value.openInfoWindow(infoString, [res.longitude, res.latitude])
    mapTangBgRef.value.setMapCenter(res.longitude, res.latitude)
  }
}

const allDeviceDataList = ref<Array<any>>([])
const getAllLocationDevice = (arr: Array<any>): Array<any> => {
  let resArr:Array<any> = []
  arr.forEach(item => {
    if (item.children) {
      resArr = [...resArr, ...getAllLocationDevice(item.children)]
    } else resArr.push(item)
  })
  return resArr
}

const menuDataList = ref<Array<any>>([])
const menuDataLoading = ref<boolean>(false)
const getMenuDataList = async () => {
  menuDataLoading.value = true
  menuDataList.value = []
  const res = await getDeviceCategoryTree({}).catch(() => { menuDataLoading.value = false })
  console.log('getMenuDataList', res);
  menuDataLoading.value = false
  if (Array.isArray(res)) menuDataList.value = res.map(_first => ({
    ..._first,
    id: _first.id.toString(),
    children: _first.children.map(_sec => ({
      ..._sec,
      id: _sec.id.toString(),
      children: _sec.children.map(_third => ({
        ..._third,
        id: _third.id.toString()
      })) || []
    })) || []
  }))

  if (Array.isArray(res)) allDeviceDataList.value = getAllLocationDevice(res)
  console.log("allDeviceDataList", allDeviceDataList.value);
  const kindMap = {
    "101": "Monitor",
    "102": "Grow",
    "103": "Weather",
    "104": "Soil",
    "107": "Bug",
    "79": "Monitor"
  }
  allDeviceDataList.value.forEach(item => {
    const _item = JSON.parse(JSON.stringify(item))
    if (!_item.longitude || !_item.latitude) {
      return
    }
    
    const marker = mapTangBgRef.value.addMarkerToMap(
      _item.longitude,
      _item.latitude,
      _item.deviceName,
      '/tangba/' + _item.deviceStatus + (kindMap[_item.deviceKind] || 'Monitor') + '.png'
    )
    marker.on('click', () => {
      handleSelect(item.id)
    })
  })
  mapTangBgRef.value.setMapCenter(106.41226338163017, 30.05771932973406)
  mapTangBgRef.value.setMapZoom(9)
}
getMenuDataList()

const showPanel = ref<boolean>(false)

const getIconClass = (item) => {
  const { deviceStatus = 'offline', deviceKind = '' } = item
  const kindMap = {
    "101": "monitor",
    "102": "grow",
    "159": "weather",
    "104": "soil",
    "107": "bug",
  }
  return deviceStatus + '-' + (kindMap[deviceKind] || 'monitor')
}
</script>
<style scoped lang="scss">
.home-tangbg-wrapper {
  height: calc(100vh - 125px);
  position: relative;
}

.online-flag, .offline-flag {
  width: .8rem;
  height: .8rem;
  border-radius: .4rem;
}

.online-flag {
  background-color: #15a217;
}

.offline-flag {
  background-color: #a5320f;
}

.online-bug, .offline-bug,
.online-monitor, .offline-monitor,
.online-soil, .offline-soil,
.online-weather, .offline-weather,
.online-grow, .offline-grow {
  background-size: 100% auto;
}
.online-bug { background-image: url(./assets/tangba/onlineBug.png); }
.offline-bug { background-image: url(./assets/tangba/offlineBug.png); }

.online-monitor { background-image: url(./assets/tangba/onlineMonitor.png); }
.offline-monitor { background-image: url(./assets/tangba/offlineMonitor.png); }

.online-soil { background-image: url(./assets/tangba/onlineSoil.png); }
.offline-soil { background-image: url(./assets/tangba/offlineSoil.png); }

.online-weather { background-image: url(./assets/tangba/onlineWeather.png); }
.offline-weather { background-image: url(./assets/tangba/offlineWeather.png); }

.online-grow { background-image: url(./assets/tangba/onlineGrow.png); }
.offline-grow { background-image: url(./assets/tangba/offlineGrow.png); }
</style>
