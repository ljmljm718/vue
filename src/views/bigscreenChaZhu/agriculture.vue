<script setup lang="ts">
// @ts-ignore
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import adapter from '@/components/MapCustom/src/adapter';
import dayjs from 'dayjs';
import {
  getQianjiangAgriResource,
  getBreedCategory,
  getDeviceInfo,
  getVarietyManagement,
  qjDeviceStatistics,
  cropBase,
  // warnRecordInfo,
  getAgriMissionPlan,
  getAllBase,
  getAllPlotByBaseID,
  getProductBrand,
  getEquipmentMap,
  qianjiangMonitor,
  qianjiangWarnRecordInfo
} from './api';
import BigscreenCalendar from './components/calendar.vue';
import { coordinateTransformation } from '@/utils/map';
import { initChartStatic, generatePieOptions } from '../../utils/bigscreenTool/index';
import BigscreenBuilder from '@/components/BigscreenBuilder';
import { formatIconPath } from '@/utils/gisIcon';

const { BigscreenTable } = BigscreenBuilder;

adapter();
// const VEC_TILE = '/tdCache/api/tdtmap/tile?T=vec_w&x={x}&y={y}&l={z}'
const IMG_TILE = '/tdCache/api/tdtmap/tile?T=img_w&x={x}&y={y}&l={z}';
const CVA_TILE = '/tdCache/api/tdtmap/tile?T=cva_w&x={x}&y={y}&l={z}';

let map: L.Map | null = null;
const initMap = () => {
  if (map) return;
  // const vecLayer = L.tileLayer(VEC_TILE, { attribution: 'vec' })
  const imgLayer = L.tileLayer(IMG_TILE, { attribution: 'img' });
  const cvaLayer = L.tileLayer(CVA_TILE, { attribution: 'cva' });
  const img_cva_group = L.layerGroup([imgLayer, cvaLayer]);

  map = new L.Map(`bigMapContainer`, {
    minZoom: 1,
    maxZoom: 18,
    center: [39.89945, 116.40769],
    zoom: 12,
    zoomOffset: 1,
    zoomControl: false,
    attributionControl: false
  });

  img_cva_group.addTo(map);

  map.on('click', ({ latlng }) => {
    const { lat, lng } = latlng;
    navigator.clipboard.writeText(`[${lng}, ${lat}],`);
  });

  window.addEventListener('resize', () => {
    map.invalidateSize(true);
  });

  // 获取地图数据
  getEquipmentMapData();
};
//农业资源
const ResList = ref<any[]>([]);
const getResList = async () => {
  try {
    ResList.value = await Promise.all([getQianjiangAgriResource(), getVarietyManagement()]);
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

//种养信息
const cropList = ref<any[]>([]);
const getCropBase = async () => {
  const { list } = await cropBase({
    pageNo: 1,
    pageSize: 100
  });
  if (!Array.isArray(list)) return;
  cropList.value = list;
  console.log(cropList.value, 'cropListcropList1234');
};
getCropBase();
//品牌信息
const brandList = ref<any[]>([]);
const getWarnRecord = async () => {
  try {
    const data = await getProductBrand();
    brandList.value = data.list;
    console.log('长度：', brandList.value.length);
  } catch (error) {
    console.log('获取数据失败：', error);
  }
};
getWarnRecord();

/****************************** 设备信息 start ******************************/
interface DeviceData {
  categoryName: string;
  imgId: string;
  total: number;
  online: number;
  offline: number;
}
const deviceList = ref<Array<DeviceData>>([]);
const getDeviceList = async () => {
  let res = await getDeviceInfo();
  // console.log("设备信息: ", res)

  // 没数据直接返回
  if (!res || !res.category || res.category.length === 0) {
    return;
  }

  deviceList.value = [];
  let indexMap = new Map<string, number>();
  let cur = 0;
  const cate = res.category;

  // 假设传过来的数据一定有categoryName和imgId
  // 遍历res.category计算显示在页面上的数据 每一类的结果汇总到deviceList
  cate.forEach((ele: any) => {
    ele.categoryName = ele.categoryName ? ele.categoryName : '未知设备';
    if (!indexMap.has(ele.categoryName)) {
      let tmpData = {
        categoryName: ele.categoryName,
        imgId:
          ele.imgId ||
          'https://www.zhuangbeizz.cn/minio/inspur/ef6114eead1cacd3809addfb7e29332ae097fffdbf149f135a5f4b6417b1afbb.png',
        total: Number(ele.total) || 0,
        online: Number(ele.online) || 0,
        offline: Number(ele.offline) || 0
      };
      deviceList.value.push(tmpData);
      indexMap.set(tmpData.categoryName, cur);
      cur++;
    } else {
      let idx = indexMap.get(ele.categoryName);
      deviceList.value[idx!].total += Number(ele.total);
      deviceList.value[idx!].online += Number(ele.online);
      deviceList.value[idx!].offline += Number(ele.offline);
    }
  });
  // console.log("设备列表: ", deviceList.value)
};
getDeviceList();
/****************************** 设备信息  end  ******************************/

// 中上设备信息
const topDataInfo = ref<any>({
  total: '',
  online: '',
  offline: '',
  warningEquipmentDevice: ''
});
const getTopDataList = async () => {
  const res = await qjDeviceStatistics();
  const { total = '', online = '', offline = '', warningEquipmentDevice = '' } = res;
  topDataInfo.value = { total, online, offline, warningEquipmentDevice };
};
getTopDataList();
//品种分布
let chartIns = null;
const initChart = async () => {
  if (chartIns) chartIns.dispose();
  const res = await getBreedCategory();
  console.log('🚀 ~ initChart ~ res:', res);
  if (!Array.isArray(res)) return;
  const seriesData = res.map((item) => ({
    name: item.cropName || '暂无数据',
    value: item.number,
    unit: item.unit
  }));
  chartIns = initChartStatic(
    'typePercentChart',
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
      color: ['#01faea', '#02fbbc', '#ff994d'],
      series: [
        {
          type: 'pie',
          minAngle: 10,
          startAngle: 200,
          radius: ['35%', '60%'],
          center: ['30%', '50%'],
          data: seriesData,
          label: {
            formatter: ({ name, percent }) => `${name} - (${parseInt(percent)}%)`,
            color: '#d1d1d1'
          },
          labelLine: {
            show: true,
            lineStyle: {
              color: '#d1d1d1'
            }
          },
          emphasis: {
            itemStyle: { borderWidth: 0 }
          }
        }
      ],
      tooltip: {
        formatter: (item) => {
          return `数据详情<br />${item.marker}${item.name}<span style="padding-left: 1rem;">${item.value} ${item.data.unit}</span>`;
        },
        position: function (point) {
          return [point[0] - 90, point[1] + 20];
        }
      }
    })
  );
};

onMounted(async () => {
  await initMap();
  await getResList();
  await initChart();
});

/****************************** 农事任务 start ******************************/
const calendarIns = ref();
const missionList = ref<Array<any>>([]);
const remindArr = ref<Array<string>>([]);
const curBase = ref<any>({});
const baseList = ref<Array<any>>([]);
const curPlot = ref<any>({});
const plotList = ref<Array<any>>([]);
const showOptions = ref<boolean>(false);
const showOptionsBase = ref<boolean>(false);
const showingMission = ref<any>();

window.addEventListener('click', () => {
  showOptions.value = false;
  showOptionsBase.value = false;
});

const showOpt = (e: any) => {
  e.stopPropagation();
  showOptions.value = true;
};

const showOptBase = (e: any) => {
  e.stopPropagation();
  showOptionsBase.value = true;
};

const changeOpt = (item: any) => {
  curPlot.value = item;
  const _date = new Date();
  getMissionPlan(`${_date.getFullYear()}-${_date.getMonth() + 1}`, item.code);
};

const changeOptBase = async (item: any) => {
  curBase.value = item;
  // 根据基地ID获取地块列表
  let pList = await getAllPlotByBaseID({ parkId: curBase.value.id });
  if (!pList || !Array.isArray(pList) || pList.length === 0) {
    curPlot.value = {};
    plotList.value = [];
    return;
  }
  plotList.value = pList;
  curPlot.value = plotList.value[0];
  // console.log("切换基地后 地块列表: ", pList)
  const _date = new Date();
  getMissionPlan(`${_date.getFullYear()}-${_date.getMonth() + 1}`, curPlot.value.code);
};

// 获取指定年月 指定地块 的农事任务列表
const getMissionPlan = async (yearMonth: string, belongPlot: string) => {
  const res = await getAgriMissionPlan({ yearMonth, belongPlot });
  if (Array.isArray(res)) {
    missionList.value = res;
    remindArr.value = res
      .filter((item) => Array.isArray(item.planList) && item.planList.length > 0)
      .map((item) => item.monthDate);
  }
  // console.log("哪些日期有任务: ", remindArr.value)
};

// 初始化农事任务
const initMission = async () => {
  // 获取基地列表 设置第0项为当前基地
  let bList = await getAllBase();
  if (!bList || !Array.isArray(bList) || bList.length === 0) {
    return;
  }
  baseList.value = bList;
  curBase.value = baseList.value[0];
  // console.log("基地列表: ", bList)

  // 根据基地ID获取地块列表 设置第0项为当前地块
  let pList = await getAllPlotByBaseID({ parkId: curBase.value.id });
  if (!pList || !Array.isArray(pList) || pList.length === 0) {
    return;
  }
  plotList.value = pList;
  curPlot.value = plotList.value[0];
  // console.log("地块列表: ", pList)

  // 获取农事任务列表
  let tmp = new Date();
  let year = tmp.getFullYear();
  let month = tmp.getMonth() + 1;
  getMissionPlan(`${year}-${month}`, curPlot.value.code);
};
initMission();

// 显示当天的事项
const handleCalendarClick = (item: any) => {
  const formatMonthDay = (val) => (val > 9 ? val : '0' + val);
  // console.log('处理日历点击事件: ', item)
  showingMission.value = null;
  showingMission.value = missionList.value.find((ele) => {
    const _date_ = item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date);
    return _date_ === ele.monthDate;
  });
  // console.log("对应农事任务列表: ", showingMission.value)
  showingMission.value.monthDate = showingMission.value.monthDate
    ? showingMission.value.monthDate
    : item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date);
};

// 切换月份 重新获取农事任务列表
const handleCalendarChange = (item: Date) => {
  if (!curBase.value.id || !curPlot.value.code) {
    return;
  }
  getMissionPlan(`${item.getFullYear()}-${item.getMonth() + 1}`, curPlot.value.code);
};

const missionAddPlanClass = (event: any) => {
  event.currentTarget.className = 'mb-10px leading-[30px] mission-plan';
};

const missionremovePlanClass = (event: any) => {
  event.currentTarget.className = 'mb-10px leading-[30px]';
};
/****************************** 农事任务  end  ******************************/

// 中间地图接口
const getEquipmentMapData = async () => {
  const res = await getEquipmentMap({});
  console.log('🚀 ~ getEquipmentMapData ~ res:', res);

  const latlngs: any[] = [];
  const iconMap = {
    camrea: 'icon1',
    meteorologicalStation: 'icon2',
    soilMoistureContent: 'icon3'
  };

  const revertArr = (arr): any[] => {
    const iconInnerMap = {
      视频监控: 'icon1',
      气象站: 'icon2',
      土壤墒情: 'icon3',
      杀虫设备: 'icon4',
      生长监控: 'icon5'
    };
    if (!Array.isArray(arr)) return [];
    let resArr: any[] = [];
    arr.forEach((item) => {
      resArr = [
        ...resArr,
        ...item.children.map((ele) => ({
          ...ele,
          icon: iconInnerMap[item.name],
          parentName: item.name
        }))
      ];
    });
    return resArr;
  };

  const formattedArr = revertArr(res);
  formattedArr.forEach((formattedItem) => {
    const {
      longitude,
      latitude,
      deviceName = '',
      baseName = '',
      plotName = '',
      location = '',
      type,
      icon: _icon,
      parentName,
      deviceStatus
    } = formattedItem;
    const isOnline = deviceStatus === 'online';
    if (!longitude || !latitude) return;
    const [lng, lat] = coordinateTransformation.BD09II2WGS84(longitude, latitude);
    latlngs.push([lat, lng]);
    const icon = L.icon({
      iconUrl: formatIconPath(parentName, isOnline),
      // iconUrl: `/images/bigscreenED/${_icon}.png`, //marker图片地址
      iconSize: [62, 66], //marker宽高
      iconAnchor: [31, -4] //marker中心点位置
    });
    L.marker([lat, lng], { icon })
      .addTo(map)
      .on('click', () => {
        L.popup()
          .setLatLng([lat, lng])
          .setContent(
            `
        <div>${deviceName}</div>
        <div class="mt-[.4rem]">${baseName}-${plotName}</div>
        <div class="mt-[.4rem]">位置:${location}</div>
      `
          )
          .openOn(map);
      });
    map.fitBounds(latlngs, { padding: [5, 5] });
  });
};
/****************************  气象检测 土壤墒情 ****************************/

const soilList = ref<Array<any>>([]);
const montiorList = ref<Array<any>>([]);
const soil = ref({
  光照: '1',
  氮: '2',
  钾: '3',
  磷: '4',
  PH值: '5',
  湿度: '6',
  EC值: '7',
  温度: '8'
});
const montior = ref({
  空气温度: '1',
  空气湿度: '2',
  降雨量: '3',
  雨量: '3',
  光照强度: '4',
  光照: '4',
  风力: '5',
  风速: '5',
  风向: '6'
});
const getQianjiangMonitor = async () => {
  let res = await qianjiangMonitor({ type: '气象站' });
  let res2 = await qianjiangMonitor({ type: '土壤墒情' });
  console.log(res, '气象监测');
  console.log(res2, ' 土壤墒情');
  soilList.value = res2;
  montiorList.value = res;

  soilList.value = soilList.value.map((item) => ({
    ...item,
    icon: soil.value[item.monitoringType] ?? '1'
  }));
  montiorList.value = montiorList.value.map((item) => ({
    ...item,
    icon: montior.value[item.monitoringType] ?? '1'
  }));
  console.log(montiorList.value, ' montiorList.value montiorList.value1234');
};
getQianjiangMonitor();

const warnRecordList = ref<any[]>([]);
const tableHeaderColor = ref({
  color: '#078b52'
});
const getQianjiangWarnRecordInfo = async () => {
  const res = await qianjiangWarnRecordInfo({});
  console.log('🚀 ~ getQianjiangWarnRecordInfo ~ res:', res);
  if (Array.isArray(res))
    warnRecordList.value = res.map((item) => ({
      ...item,
      warnStatus: item.warnStatus === '0' ? '未处理' : '已处理',
      warnTime: dayjs(item.warnTime).format('YYYY-MM-DD HH:mm:ss')
    }));
};
getQianjiangWarnRecordInfo();

const handleActive = () => {
  nextTick(() => initChart());
};
defineExpose({ handleActive });
</script>
<template>
  <div class="w-full h-full flex justify-between relative text-white">
    <div class="h-full w-460px">
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">农业资源</div>
      </div>
      <div class="w-460px pt-15px pb-20px flex justify-evenly">
        <div
          class="agri-bg-1 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center"
        >
          <div class="text-12px">种植地块</div>
          <div>
            <span class="text-18px pr-5px font-bold">
              {{ Array.isArray(ResList) && ResList.length > 0 ? ResList[0].shelterAmount : 0 }}
            </span>
            <span class="text-12px">块</span>
          </div>
        </div>
        <div
          class="agri-bg-2 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center"
        >
          <div class="text-12px">种植面积</div>
          <div>
            <span class="text-18px pr-5px font-bold">
              {{ Array.isArray(ResList) && ResList.length > 0 ? ResList[0].plantArea : 0 }}
            </span>
            <span class="text-12px">亩</span>
          </div>
        </div>
        <div
          class="agri-bg-3 w-139px h-52px pl-65px box-border text-white flex flex-col justify-center"
        >
          <div class="text-12px">种养品种</div>
          <div>
            <span class="text-18px pr-5px font-bold">
              {{ Array.isArray(ResList) && ResList.length > 0 ? ResList[1].total : 0 }}
            </span>
            <span class="text-12px">种</span>
          </div>
        </div>
      </div>
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">设备信息</div>
      </div>
      <div class="h-135px">
        <el-scrollbar>
          <div class="grid grid-cols-2 gap-3 p-3 box-border" v-if="deviceList.length">
            <div
              class="device-bg w-100% p-5 pb-3 box-border"
              v-for="item in deviceList"
              :key="item.imgId"
            >
              <div class="flex space-x-3 items-start">
                <div class="w-50px h-50px">
                  <img :src="item.imgId" class="object-contain w-50px h-50px" />
                </div>
                <div class="text-white">
                  <div class="text-18px">{{ item.categoryName }}</div>
                  <div class="text-24px">{{ item.total }}</div>
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
          <div
            v-else
            class="w-full h-135px p-3 box-border flex justify-center items-center tracking-widest"
          >
            <div class="text-[#01F892]">暂无数据</div>
          </div>
        </el-scrollbar>
      </div>
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">品种分布</div>
      </div>
      <div class="p-4 box-border">
        <div class="h-190px">
          <div class="items-start w-full h-full" id="typePercentChart"></div>
        </div>
      </div>
      <!-- 农事任务 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">农事任务</div>
      </div>
      <div class="flex justify-between items-center text-[#11eeaf] cursor-pointer">
        <div class="relative h-[1.4rem] w-[15rem]">
          <div class="h-full text-center cursor-pointer" @click="showOptBase">
            {{ curBase.name }}
            <el-icon class="ml-3 relative top-[.1rem]"><CaretBottom /></el-icon>
          </div>
          <div
            v-if="showOptionsBase && Array.isArray(baseList) && baseList.length > 0"
            class="absolute left-0 top-[1.4rem] z-1000 w-full max-h-[8rem]"
          >
            <el-scrollbar max-height="8rem">
              <div
                v-for="item in baseList"
                :key="item.id"
                class="py-3 text-center w-full bg-[#0d1724]"
                @click="changeOptBase(item)"
              >
                {{ item.name }}
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="relative h-[1.4rem] w-[10rem]">
          <div class="h-full text-center cursor-pointer" @click="showOpt">
            {{ curPlot.name ? curPlot.name : '-----' }}
            <el-icon class="ml-3 relative top-[.1rem]"><CaretBottom /></el-icon>
          </div>
          <div
            v-if="showOptions && Array.isArray(plotList) && plotList.length > 0"
            class="absolute left-0 top-[1.4rem] z-1000 w-full max-h-[8rem]"
          >
            <el-scrollbar max-height="8rem">
              <div
                v-for="item in plotList"
                :key="item.code"
                class="py-3 text-center w-full bg-[#0d1724]"
                @click="changeOpt(item)"
              >
                {{ item.name }}
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="mission-split"></div>
      <div class="w-450px h-330px">
        <div class="w-450px h-330px">
          <BigscreenCalendar
            :key="curPlot ? curPlot.code : ''"
            ref="calendarIns"
            :remind="remindArr"
            @select="
              (item) => {
                handleCalendarClick(item);
              }
            "
            @change="
              (item) => {
                handleCalendarChange(item);
              }
            "
          >
            <template #tip>
              <div
                v-if="showingMission"
                class="pt-[10px] pb-[20px] px-[15px] w-full h-full box-border font-normal"
              >
                <div class="w-full text-white text-center">{{ showingMission.monthDate }}</div>
                <div class="mt-[10px] w-full h-[90px] text-center text-[#01F892]">
                  <el-scrollbar>
                    <div
                      v-for="(item, index) in showingMission.planList"
                      :key="`item.planName${index}`"
                      class="tracking-widest"
                    >
                      <div
                        class="mb-10px leading-[30px]"
                        @mouseenter="missionAddPlanClass"
                        @mouseleave="missionremovePlanClass"
                      >
                        {{ item.planName }}
                      </div>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
            </template>
          </BigscreenCalendar>
        </div>
      </div>
    </div>
    <!-- 气象监测 -->
    <div class="h-full w-460px">
      <!----气象监测----->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">气象监测</div>
      </div>
      <el-scrollbar style="height: 200px">
        <div class="p-3 box-border color-[#fff] grid grid-cols-3 gap-1">
          <div
            class="w-100% p-3 box-border flex justify-between"
            v-for="item in montiorList"
            :key="item.id"
          >
            <div :class="`meteor-icon-${item.icon} w-50px h-50px`"></div>
            <div class="!w-60%">
              <div class="flex justify-center">{{ item.monitoringType }}</div>
              <div class="flex text-1rem mt-10px justify-center">
                {{ item.dataValue }}
                <div class="text-13px mt-[2px] color-[#929593]">{{ item.unit }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!----土壤墒情----->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">土壤墒情</div>
      </div>
      <el-scrollbar style="height: 300px">
        <div class="p-3 box-border grid color-[#fff] grid-cols-3 gap-3">
          <div
            class="w-100% p-3 box-border flex justify-between items-center"
            v-for="item in soilList"
            :key="item.id"
          >
            <div :class="`soil-icon-${item.icon} w-50px h-50px`"></div>
            <div class="!w-60%">
              <div class="flex justify-center">{{ item.monitoringType }}</div>
              <div class="flex text-1rem justify-center mt-10px">
                {{ item.dataValue }}
                <div class="text-13px mt-[5px] color-[#929593]">{{ item.unit }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!----品牌介绍----->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">预警信息</div>
      </div>
      <el-scrollbar style="height: 280px">
        <el-table
          :data="warnRecordList"
          :header-cell-style="tableHeaderColor"
          style="width: 460px; margin-top: 10px; border: 1px solid #66666686"
          height="270px"
        >
          <el-table-column prop="warnInfo" label="预警信息" align="center" />
          <el-table-column prop="warnTime" label="时间" width="100" align="center" />
          <el-table-column label="处理状态" width="120" align="center">
            <template #default="scope">
              <div :class="scope.row.warnStatus === '未处理' ? 'text-[#ff893e]' : 'text-[#ffffff]'">
                {{ scope.row.warnStatus }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <div
      class="absolute w-940px left-460px top-20px flex justify-center space-x-70px z-20 backdrop-blur-sm py-2 bg-#00000090"
    >
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-1"></div>
        <div>
          <div
            class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #08ffff, #ffffff)"
          >
            {{ topDataInfo.total }}
          </div>
          <div class="text-16px">设备总数</div>
        </div>
      </div>
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-2"></div>
        <div>
          <div
            class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #3cffae, #ffffff)"
          >
            {{ topDataInfo.online }}
          </div>
          <div class="text-16px">在线设备</div>
        </div>
      </div>
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-3"></div>
        <div>
          <div
            class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #ffbd39, #ffffff)"
          >
            {{ topDataInfo.offline }}
          </div>
          <div class="text-16px">离线数量</div>
        </div>
      </div>
      <div class="flex space-x-2 items-center text-white">
        <div class="w-70px h-58px top-icon-4"></div>
        <div>
          <div
            class="text-32px font-bold text-linear-wrapper art-font"
            style="background-image: linear-gradient(to top, #ff4242, #ffffff)"
          >
            {{ topDataInfo.warningEquipmentDevice }}
          </div>
          <div class="text-16px">设备预警</div>
        </div>
      </div>
    </div>
    <div class="absolute w-940px left-460px bottom-300px flex justify-center text-white z-20">
      <div
        class="flex justify-center space-x-40px backdrop-blur-sm p-3 px-6 bg-#00000090 rounded-3"
      >
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px gis-map-icon-2"></div>
          <div>摄像</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px gis-map-icon-1"></div>
          <div>气象</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px gis-map-icon-3"></div>
          <div>土壤</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px gis-map-icon-4"></div>
          <div>杀虫</div>
        </div>
        <div class="flex space-x-2 items-center">
          <div class="w-26px h-30px gis-map-icon-6"></div>
          <div>生长记录</div>
        </div>
      </div>
    </div>
    <div class="absolute w-940px left-460px h-70% z-0" id="bigMapContainer"></div>
    <div class="absolute w-940px h-28% bottom-0 left-460px">
      <div class="w-940px h-45px plant-title"></div>
      <el-scrollbar style="height: calc(100% - 45px); margin-bottom: 15px">
        <div class="p-3 box-border grid grid-cols-3 gap-3 text-white">
          <div class="plant-bg w-full p-3 box-border" v-for="item in cropList" :key="item.id">
            <img :src="item.imgId" class="w-full h-130px object-contain" />
            <div class="flex items-start space-x-2 mt-2">
              <div class="w-5px h-14px bg-#01F892 mt-1 ml-1"></div>
              <div class="space-y-2 text-#d1d1d1 text-12px">
                <div class="text-[16px] text-white">{{ item.cropName }}</div>
                <div class="text-[12px]">
                  <span>所属地块:</span>
                  <span>{{ item.plotName }}</span>
                </div>
                <div class="text-[12px]">
                  <span>起止时间:</span>
                  <div class="text-[12px]">
                    {{ dayjs(item.receiptStartTime).format('YYYY-MM-DD') }}
                    -
                    {{
                      item.receiptEndTime
                        ? dayjs(item.receiptEndTime).format('YYYY-MM-DD')
                        : '暂无数据'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
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

@for $i from 1 through 6 {
  .meteor-icon-#{$i} {
    background-image: url(./assets/meteor-icon-#{$i}.png);
    background-size: 100% 100%;
  }
}

@for $i from 1 through 8 {
  .soil-icon-#{$i} {
    background-image: url(./assets/soil-icon-#{$i}.png);
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

.brand-title {
  background-image: url(./assets/warnTitle.png);
  background-size: 100% 100%;
}

.meteor-title {
  background-image: url(./assets/meteorTitle.png);
  background-size: 100% 100%;
}

.soil-title {
  background-image: url(./assets/soilTitle.png);
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

/****************************** 农事任务 start ******************************/
.mission-split {
  width: 460px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(1, 248, 146, 0) -1%,
    #01f892 50%,
    rgba(1, 248, 146, 0) 100%
  );
  margin-top: 5px;
  margin-bottom: 5px;
}
.mission-plan {
  background: {
    image: url(./assets/plan-bg.png);
    size: 100% 100%;
  }
}
/****************************** 农事任务  end  ******************************/
.moduletitle {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 8; //控制行数
  -webkit-box-orient: vertical;
  height: 119px;
}
.moduletitle:hover {
  height: 163px;
}

.title-frame {
  display: flex;
  height: 36px;
  padding: 0 36px;
  align-items: center;
  font-size: 18px;
  margin-bottom: 9px;
}

.linear-title-text {
  background: linear-gradient(
    to top,
    #9affd5,
    #ffffff
  ); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
  -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
  -webkit-text-fill-color: transparent; /*给文字设置成透明*/
}

.agri-title-bg {
  background-image: url(./assets/agriItemTitleBg.png);
  background-size: 100% 100%;
}

.agri-title-big-bg {
  background-image: url(./assets/agriItemTitleBigBg.png);
  background-size: 100% 100%;
}

.text-linear-wrapper {
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

//表格改变颜色
// 去掉el-table的所有背景颜色以及所有hover的颜色
::v-deep .el-table {
  --el-table-row-hover-bg-color: #04623b !important;
  --el-table-bg-color: none !important;
  --el-table-text-color: #fff !important;
}
.el-table {
  --el-table-border-color: none !important;
  --el-table-border: none !important;
  --el-table-text-color: white;
  --el-table-header-text-color: white;
  --el-table-row-hover-bg-color: transparent;
  --el-table-current-row-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
  @media (prefers-color-scheme: light) {
    --el-table-text-color: #213547;
    --el-table-header-text-color: #213547;
  }
}
::v-deep .el-table .el-table__body {
  background-color: transparent !important;
}
</style>
