<template>
  <div class="home-tangbg-wrapper shadow-xl overflow-hidden">
    <MapTangBa ref="mapTangBgRef" class="h-full z-0" />
    <div
      class="absolute left-3 top-3 rounded-2 bg-slate-200 p-3 pr-1 shadow-xl box-border transition-all"
      :style="`height: ${collapsed ? '3rem' : 'calc(100% - 4.5rem)'};`"
      v-loading="menuDataLoading"
    >
      <div class="h-[1.5rem] mb-[.5rem] flex justify-between items-center">
        <div class="font-bold">设备监测列表</div>
        <div class="text-[.7rem] text-[#0160FF] pr-[.6rem]" @click="collapsed = !collapsed">
          <div v-if="collapsed" class="flex items-center space-x-1">
            <span>展开</span>
            <el-icon><ArrowDownBold /></el-icon>
          </div>
          <div v-else class="flex items-center space-x-1">
            <span>折叠</span>
            <el-icon><ArrowUpBold /></el-icon>
          </div>
        </div>
      </div>
      <el-scrollbar class="overflow-auto pr-2" style="height: calc(100% - 2rem)">
        <el-menu class="el-menu-vertical-demo min-w-[270px]" @select="handleSelect">
          <el-sub-menu :index="item.id" v-for="item in menuDataList" :key="item.id">
            <template #title>
              <div class="flex space-x-2 items-center">
                <div class="w-[4px] h-[13px] bg-[#0160ff]"></div>
                <div>{{ item.name }}</div>
              </div>
            </template>
            <el-sub-menu :index="subMenu.id" v-for="subMenu in item.children" :key="subMenu.id">
              <template #title>
                <span>{{ subMenu.name }}</span>
              </template>
              <el-menu-item
                v-for="secMenu in subMenu.children"
                :key="secMenu.id"
                :index="secMenu.id"
                :class="`${secMenuId == secMenu.id ? 'menu-bg' : ''}`"
                @click="menuCli(secMenu.id)"
              >
                <div :class="`flex items-center space-x-2 `">
                  <div :class="`${getIconClass(secMenu)} w-[20px] h-[20px]`"></div>
                  <div>{{ secMenu.name }}</div>
                </div>
              </el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <PanelTangBa ref="panelTangBaRef" class="absolute right-0 top-0" v-model="showPanel" />
    <div
      @click="mapTileLayer"
      class="absolute top-20px left-[19rem] flex items-center bg-[#fff] rounded px-[12px] py-[5px]"
      style="cursor: pointer; display: none"
    >
      <img
        v-if="mapTileLayerType"
        src="./assets/tangba/satelite2.png"
        class="w-30px h-30px"
        alt=""
      />
      <img v-else src="./assets/tangba/satelite.png" class="w-30px h-30px" alt="" />
      <div
        v-if="mapTileLayerType"
        style="font-weight: 600"
        class="ml-10px color-[#014cc6] text-sm text-center w-[2rem]"
      >
        路网
      </div>
      <div v-else style="font-weight: 600" class="color-[#014cc6] ml-10px text-center w-[2rem]">
        卫星
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// @ts-ignore
// import MapTangBa from './mapTangBa.vue'
import MapTangBa from './mapTangBacopy.vue';

// @ts-ignore
import PanelTangBa from './panelTangBa.vue';
import { getDeviceCategoryTree, getDeviceInfo, parkInfoPage } from './apis';
import meassageTop from './assets/tangba/meassage-top.png';
import * as turf from '@turf/turf';

defineOptions({ name: 'HomeTangBa' });

const collapsed = ref<boolean>(false);

const mapTangBgRef = ref<any>();
const deviceDataList = ref<Array<any>>([]);

const panelTangBaRef = ref<any>(null);
const handleSelect = async (item) => {
  showPanel.value = true;
  const res = await getDeviceInfo({ id: item });
  if (panelTangBaRef.value) {
    panelTangBaRef.value.getDeviceInfoData(res);
    panelTangBaRef.value.handleClick('设备概要', false);
  }
  if (mapTangBgRef.value) {
    console.log('地图设备详情', res);
    // mapTangBgRef.value.addMarkerToMap(res.longitude, res.latitude, res.deviceName)
    const infoString = `<div class="bg-[#e8f2fc] relative">
      <div class='relative'>
        <img src="${meassageTop}" class='w-100% h-40px z-[-1] top-0 left-0 absolute' />
        <div class="bg-[#95bbf8] p-2 px-3 meassage-top z-999" style="font-weight:600;">${
          res.parkName
        }</div>
        </div>
       
        <div class="p-2  text-[14px] meassage-bg">
          <div class="p-1 px-2 color-[#000] flex items-center "> <div class="bg-[#0160ff] mr-5px w-[8px] h-[8px] rounded-full"></div> ${
            res.deviceName
          }</div>
          <div class="p-1 px-2 flex space-x-2 items-center">
            <div class="${
              res.deviceStatus === 'online' ? 'bg-[#35dc71]' : 'bg-[#e84133]'
            } w-[8px] h-[8px] rounded-full"></div>
            <div>${res.deviceStatus === 'online' ? '在线' : '离线'}</div>
          </div>
            ${
              res.channelId !== null && res.channelId !== '' && res.dtu !== null && res.dtu !== ''
                ? `
              <div class="flex pt-[1.2rem] justify-center">
                <a 
                href="/checkVideo?dtu=${res.dtu}&channelId=${res.channelId}&url=${res.url}" 
                class="w-[60%] text-center bg-[#409eff] !text-white py-[5px] px-[10px] rounded-md font-medium hover:bg-[#66b1ff] transition-colors"
                style="text-decoration: none;">
              查看监控
                </a>
              </div>
            `
                : ''
            }
        </div> 
      </div>`;
    mapTangBgRef.value.openInfoWindow(infoString, [res.longitude, res.latitude]);
    mapTangBgRef.value.setMapCenter(res.longitude, res.latitude);
  }
};

const secMenuId = ref('');
const menuCli = (val) => {
  secMenuId.value = val;
};

const allDeviceDataList = ref<Array<any>>([]);
const getAllLocationDevice = (arr: Array<any>): Array<any> => {
  let resArr: Array<any> = [];
  arr.forEach((item) => {
    if (item.children) {
      resArr = [...resArr, ...getAllLocationDevice(item.children)];
    } else resArr.push(item);
  });
  return resArr;
};
//卫星图层切换
const mapTileLayerType = ref(false);
const mapTileLayer = () => {
  if (mapTileLayerType.value) mapTangBgRef.value.addSatellite();
  else mapTangBgRef.value.removeSatellite();
  mapTileLayerType.value = !mapTileLayerType.value;
};
const menuDataList = ref<Array<any>>([]);
const menuDataLoading = ref<boolean>(false);
const getMenuDataList = async () => {
  menuDataLoading.value = true;
  menuDataList.value = [];
  const res = await getDeviceCategoryTree({}).catch(() => {
    menuDataLoading.value = false;
  });
  console.log('🚀 ~ getMenuDataList ~ res:', res);
  menuDataLoading.value = false;
  if (Array.isArray(res))
    menuDataList.value = res.map((_first) => ({
      ..._first,
      id: _first.id.toString(),
      children:
        _first.children.map((_sec) => ({
          ..._sec,
          id: _sec.id.toString(),
          children:
            _sec.children.map((_third) => ({
              ..._third,
              id: _third.id.toString()
            })) || []
        })) || []
    }));

  if (Array.isArray(res)) allDeviceDataList.value = getAllLocationDevice(res);
  console.log('allDeviceDataList', allDeviceDataList.value);
  const kindMap = {
    '101': 'Monitor',
    '79': 'Monitor',
    '82': 'Grow',
    '102': 'Grow',
    '103': 'Weather',
    '159': 'Weather',
    '81': 'Weather',
    '86': 'Soil',
    '104': 'Soil',
    '107': 'Bug',
    '88': 'Bug',
    '109': 'Monitor',
    '110': 'Grow',
    '112': 'Bug',
    '113': 'Soil',
    '119': 'Weather',
    '148': 'Monitor',
    '152': 'Grow',
    '150': 'Weather',
    '151': 'Soil',
    '153': 'Bug'
  };
  localStorage.setItem('maplist', JSON.stringify(allDeviceDataList.value));

  // 添加 Marker 到地图上
  const _center = turf.centroid(
    turf.points(
      allDeviceDataList.value
        .map((ele) => {
          const _item = JSON.parse(JSON.stringify(ele));
          return [parseFloat(_item.longitude), parseFloat(_item.latitude)];
        })
        .filter((item) => {
          const [a, b] = item;
          if (isNaN(a) || isNaN(b) || !a || !b) return false;
          return true;
        })
    )
  );

  const { list } = await parkInfoPage({ pageNo: 1, pageSize: 10 }).catch(() => {
    {
    }
  });
  console.log('🚀 ~ getMenuDataList ~ resPark:', list);
  // 由于用户可能配置的中心点根本不包含 Marks，所以还是直接用计算方式取中心点算了
  const _flag = false;
  if (Array.isArray(list) && list.length === 1 && _flag) {
    // 如果基地只有一条且配置了中心点，定位到此中心点
    const { longitude, latitude } = list[0];
    mapTangBgRef.value.setMapCenter(longitude, latitude);
  } else {
    const { geometry } = _center;
    const { coordinates } = geometry;
    const [_lng, _lat] = coordinates;
    mapTangBgRef.value.setViewport(
      allDeviceDataList.value.map((item) => {
        return { lng: item.longitude, lat: item.latitude };
      })
    );
    mapTangBgRef.value.setMapCenter(_lng, _lat);
  }

  allDeviceDataList.value.forEach((item) => {
    const _item = JSON.parse(JSON.stringify(item));
    if (!_item.longitude || !_item.latitude) {
      return;
    }
    const statusText = _item.deviceStatus === 'online' ? 'online' : 'offline';

    const marker = mapTangBgRef.value.addMarkerToMap(
      _item.longitude,
      _item.latitude,
      _item.deviceName,
      `/tangba/${statusText}${kindMap[_item.deviceKind] || 'Monitor'}.png`
    );
    marker.on('click', () => {
      handleSelect(item.id);
    });
  });
};
getMenuDataList();

const showPanel = ref<boolean>(false);

const getIconClass = (item) => {
  const { deviceStatus = 'offline', deviceKind = '' } = item;
  const kindMap = {
    '101': 'monitor',
    '79': 'monitor',
    '82': 'grow',
    '102': 'grow',
    '103': 'weather',
    '159': 'weather',
    '81': 'weather',
    '86': 'soil',
    '104': 'soil',
    '107': 'bug',
    '88': 'bug',
    '109': 'monitor',
    '110': 'grow',
    '112': 'bug',
    '113': 'soil',
    '119': 'weather',
    '148': 'monitor',
    '152': 'grow',
    '150': 'weather',
    '151': 'soil',
    '153': 'bug'
  };
  return deviceStatus + '-' + (kindMap[deviceKind] || 'monitor');
};
</script>
<style scoped lang="scss">
.home-tangbg-wrapper {
  height: calc(100vh - 125px);
  position: relative;
}

.online-flag,
.offline-flag {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.4rem;
}

.online-flag {
  background-color: #15a217;
}

.offline-flag {
  background-color: #a5320f;
}
.menu-bg {
  width: 150% !important;
  height: 100%;
  background-size: 100% 100%;
  background-image: url(./assets/menu-bg.png) !important;
}
.meassage-top {
  background-size: 100% 100%;
  background-image: url(./assets/tangba/meassage-top.png);
}
.meassage-bg {
  background-size: 100% 100%;
  background-image: url(./assets/tangba/meassage-bg.png);
}

.online-bug,
.offline-bug,
.online-monitor,
.offline-monitor,
.online-soil,
.offline-soil,
.online-weather,
.offline-weather,
.online-grow,
.offline-grow {
  background-size: 100% auto;
}
.online-bug {
  background-image: url(./assets/tangba/onlineBug.png);
}
.offline-bug {
  background-image: url(./assets/tangba/offlineBug.png);
}

.online-monitor {
  background-image: url(./assets/tangba/onlineMonitor.png);
}
.offline-monitor {
  background-image: url(./assets/tangba/offlineMonitor.png);
}

.online-soil {
  background-image: url(./assets/tangba/onlineSoil.png);
}
.offline-soil {
  background-image: url(./assets/tangba/offlineSoil.png);
}

.online-weather {
  background-image: url(./assets/tangba/onlineWeather.png);
}
.offline-weather {
  background-image: url(./assets/tangba/offlineWeather.png);
}

.online-grow {
  background-image: url(./assets/tangba/onlineGrow.png);
}
.offline-grow {
  background-image: url(./assets/tangba/offlineGrow.png);
}
</style>
