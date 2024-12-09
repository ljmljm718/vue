<template>
  <el-card class="w-full !border-0" body-class="!p-[16px]" shadow="never">
    <h2 class="m-0 text-[18px]">基本信息</h2>
    <div class="mt-[16px] grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-[8px] text-[#333]">
      <div class="flex items-center bg-[#F0F7F6] py-[16px] pl-[32px] rounded-[6px]">
        <img :src="IconWaterSource" alt="水源数量" class="w-[64px] h-[64px] object-cover" />
        <div class="ml-[32px]">
          <div class="text-[24px]">{{ baseInfo.waterSourceNum }}</div>
          <div>水源数量(个)</div>
        </div>
      </div>
      <div class="flex items-center bg-[#F0F7F6] py-[16px] pl-[32px] rounded-[6px]">
        <img :src="IconIrrigationDistrict" alt="灌区数量" class="w-[64px] h-[64px] object-cover" />
        <div class="ml-[32px]">
          <div class="text-[24px]">{{ baseInfo.irrigationNum }}</div>
          <div>灌区数量(个)</div>
        </div>
      </div>
      <div class="flex items-center bg-[#F0F7F6] py-[16px] pl-[32px] rounded-[6px]">
        <img :src="IconBase" alt="基地数量" class="w-[64px] h-[64px] object-cover" />
        <div class="ml-[32px]">
          <div class="text-[24px]">{{ baseInfo.baseNum }}</div>
          <div>基地数量(个)</div>
        </div>
      </div>
      <div class="flex items-center bg-[#F0F7F6] py-[16px] pl-[32px] rounded-[6px]">
        <img :src="IconPlot" alt="地块数量" class="w-[64px] h-[64px] object-cover" />
        <div class="ml-[32px]">
          <div class="text-[24px]">{{ baseInfo.plotNum }}</div>
          <div>地块数量(个)</div>
        </div>
      </div>
      <div class="flex items-center bg-[#F0F7F6] py-[16px] pl-[32px] rounded-[6px]">
        <img :src="IconPlotArea" alt="地块面积" class="w-[64px] h-[64px] object-cover" />
        <div class="ml-[32px]">
          <div class="text-[24px]">{{ baseInfo.plotArea }}</div>
          <div>地块面积(亩)</div>
        </div>
      </div>
    </div>
  </el-card>

  <div class="w-full mt-[8px] space-y-[8px] xl:flex xl:space-x-[8px] xl:space-y-0">
    <el-card class="xl:grow !border-0" body-class="!p-[16px]" shadow="never">
      <h2 class="m-0 text-[18px]">灌区当前任务</h2>
      <el-scrollbar
        v-if="currentTasks.length > 0"
        class="mt-[16px] w-full border border-solid border-[#e6e6e6] rounded-[6px]"
        view-class="flex"
      >
        <div
          v-for="item in currentTasks"
          :key="item.wfiIrrigationAreaName"
          class="flex-none w-[180px] h-[198px] border-r border-r-solid border-[#e6e6e6] box-border"
        >
          <div
            class="flex justify-center items-center w-full h-[40px] border-b border-b-solid border-[#e6e6e6] bg-[#F5F6FA] text-[#333]"
          >
            {{ item.wfiIrrigationAreaName }}
          </div>
          <el-scrollbar style="height: 157px" view-class="p-[8px] box-border space-y-[4px]">
            <div
              v-for="ele in item.taskList"
              :key="ele"
              class="w-full flex items-center relative h-[32px] pl-[20px] box-border rounded-[4px]"
              :style="{
                backgroundColor: `rgba(${colorMap.get(ele) ? colorMap.get(ele) : '0, 150, 136'}, 0.1)`
              }"
            >
              <div
                class="absolute top-0 left-0 rounded-l-[4px] w-[4px] h-[32px]"
                :style="{
                  backgroundColor: `rgb(${colorMap.get(ele) ? colorMap.get(ele) : '0, 150, 136'})`
                }"
              ></div>
              {{ ele }}
            </div>
          </el-scrollbar>
        </div>
      </el-scrollbar>
      <div v-else class="mt-[16px] flex justify-center items-center w-full h-[200px]">
        <div class="no-data"></div>
      </div>
    </el-card>

    <el-card class="xl:flex-none !border-0" body-class="!p-[16px]" shadow="never">
      <h2 class="m-0 text-[18px]">今日气象</h2>
      <div class="mt-[16px] flex w-full justify-center space-x-[8px] text-[#333]">
        <div
          v-for="item in todayWeatherList"
          :key="item.id"
          class="flex-none flex flex-col justify-between items-center py-[31px] box-border w-[119px] h-[200px] bg-[#F0F7F6] rounded-[6px]"
        >
          <div class="flex flex-col items-center">
            <img
              :src="getWeatherIcon(item.monitoringType)"
              :alt="item.monitoringType"
              class="w-[36px] h-[36px] object-cover"
            />
            <div class="mt-[14px]">{{ item.monitoringType }}</div>
          </div>
          <div class="text-[22px]">{{ item.dataValue ? item.dataValue : 0 }}{{ item.yyUnit }}</div>
        </div>
      </div>
    </el-card>
  </div>

  <div class="w-full flex mt-[8px] space-x-[8px]">
    <el-card
      class="flex-none w-[350px] !border-0 card-with-header"
      body-class="!p-[16px] !pt-0"
      shadow="never"
    >
      <template #header>设备状态</template>
      <div class="w-[318px] h-[180px] flex justify-center items-center relative">
        <div id="deviceStatusChart" class="w-[180px] h-[180px]"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span class="text-[24px]">{{ deviceTotalNum }}</span>
          <br />
          设备总数
        </div>
      </div>

      <div class="space-y-[16px]">
        <div class="flex justify-between items-end">
          <span>设备总数</span>
          <span class="text-[24px]">{{ deviceTotalNum }}</span>
        </div>
        <div class="w-full h-[1px] bg-[#e6e6e6]"></div>
        <div class="flex justify-between items-end">
          <div class="flex items-center space-x-[4px]">
            <div class="w-[12px] h-[12px]" :style="{ backgroundColor: colors[0] }"></div>
            <span>在线设备</span>
          </div>
          <span class="text-[18px]">{{ deviceStatusInfo[0].value }}</span>
        </div>
        <div class="flex justify-between items-end">
          <div class="flex items-center space-x-[4px]">
            <div class="w-[12px] h-[12px]" :style="{ backgroundColor: colors[1] }"></div>
            <span>离线设备</span>
          </div>
          <span class="text-[18px]">{{ deviceStatusInfo[1].value }}</span>
        </div>
        <div class="flex justify-between items-end">
          <div class="flex items-center space-x-[4px]">
            <div class="w-[12px] h-[12px]" :style="{ backgroundColor: colors[2] }"></div>
            <span>故障设备</span>
          </div>
          <span class="text-[18px]">{{ deviceStatusInfo[2].value }}</span>
        </div>
      </div>
    </el-card>

    <el-card class="grow !border-0" body-class="!p-[16px]" shadow="never">
      <el-scrollbar height="386" class="h-[386px]">
        <div class="w-full flex justify-between items-center">
          <h2 class="m-0 text-[18px]">任务统计</h2>
          <el-radio-group v-model="taskStatisticsTimeRange" @change="handleChangeTimeRange">
            <el-radio-button label="month" value="month">本月</el-radio-button>
            <el-radio-button label="week" value="week">本周</el-radio-button>
          </el-radio-group>
        </div>

        <div class="mt-[16px] grid xl:grid-cols-2 2xl:grid-cols-3 gap-[8px] text-[#333]">
          <div
            class="h-[80px] flex justify-between items-center bg-[#F0F7F5] px-[32px] py-[15px] box-border rounded-[6px]"
          >
            <div class="flex items-center">
              <img
                :src="IconIrrigationTask"
                alt="灌溉任务"
                class="w-[48px] h-[48px] object-cover"
              />
              <span class="ml-[16px]">灌溉任务(次)</span>
            </div>
            <span class="text-[24px]">
              {{ taskStatisticsInfo[taskStatisticsTimeRange].total.irrigate }}
            </span>
          </div>
          <div
            class="h-[80px] flex justify-between items-center bg-[#FAF6ED] px-[32px] py-[15px] box-border rounded-[6px]"
          >
            <div class="flex items-center">
              <img
                :src="IconFertilizationtask"
                alt="施肥任务"
                class="w-[48px] h-[48px] object-cover"
              />
              <span class="ml-[16px]">施肥任务(次)</span>
            </div>
            <span class="text-[24px]">
              {{ taskStatisticsInfo[taskStatisticsTimeRange].total.fertilize }}
            </span>
          </div>
          <div
            class="h-[80px] flex justify-between items-center bg-[#F0F7F5] px-[32px] py-[15px] box-border rounded-[6px]"
          >
            <div class="flex items-center">
              <img
                :src="IconWaterConsumption"
                alt="用水量"
                class="w-[48px] h-[48px] object-cover"
              />
              <span class="ml-[16px]">用水量(L)</span>
            </div>
            <span class="text-[24px]">
              {{ taskStatisticsInfo[taskStatisticsTimeRange].total.water }}
            </span>
          </div>
        </div>

        <div id="taskStatisticsChart" class="mt-[16px] w-full h-[280px]"></div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import IconWaterSource from './assets/homeTongming/water-source-num.png';
import IconIrrigationDistrict from './assets/homeTongming/irrigation-district-num.png';
import IconBase from './assets/homeTongming/base-num.png';
import IconPlot from './assets/homeTongming/plot-num.png';
import IconPlotArea from './assets/homeTongming/plot-area.png';
import IconTemperature from './assets/homeTongming/temperature.png';
import IconRainfall from './assets/homeTongming/rainfall.png';
import IconHumidity from './assets/homeTongming/humidity.png';
import IconWindForce from './assets/homeTongming/wind-force.png';
import IconIrrigationTask from './assets/homeTongming/irrigation-task.png';
import IconFertilizationtask from './assets/homeTongming/fertilization-task.png';
import IconWaterConsumption from './assets/homeTongming/water-consumption.png';

import { makeDeviceStatusOpt, makeTaskStatisticsOpt, colors, rgbColors } from './echartOption';
import * as echart from 'echarts';
import {
  getBaseInfo,
  getIrrigationAreaTask,
  getDeviceStatus,
  getEnvironmentalDataHomePageA,
  getTask
} from './apis';

// 基本信息
const baseInfo = ref({
  waterSourceNum: 0,
  irrigationNum: 0,
  baseNum: 0,
  plotNum: 0,
  plotArea: 0
});

const getMainInfo = async () => {
  baseInfo.value.waterSourceNum = 0;
  baseInfo.value.irrigationNum = 0;
  baseInfo.value.baseNum = 0;
  baseInfo.value.plotNum = 0;
  baseInfo.value.plotArea = 0;

  const res = await getBaseInfo();
  if (!res) return;

  baseInfo.value.waterSourceNum = res.waterSourceAmount ? res.waterSourceAmount : 0;
  baseInfo.value.irrigationNum = res.irrigationNum ? res.irrigationNum : 0;
  baseInfo.value.baseNum = res.parkAmount ? res.parkAmount : 0;
  baseInfo.value.plotNum = res.plotAmount ? res.plotAmount : 0;
  baseInfo.value.plotArea = res.plotAreaAmount ? Number(res.plotAreaAmount) : 0;
};
getMainInfo();

// 灌区当前任务
const currentTasks = ref<any[]>([]);
const colorMap = reactive(new Map());

const getCurrentTasks = async () => {
  currentTasks.value = [];
  const res = await getIrrigationAreaTask();
  currentTasks.value = Array.isArray(res) ? res : [];
};
getCurrentTasks().then(() => {
  getTaskColorMap();
});

// 获取任务到颜色rgb字符串的map
const getTaskColorMap = () => {
  if (currentTasks.value.length === 0) return;

  // 获取去重的任务列表
  let list: string[] = [];
  currentTasks.value.forEach((ele) => {
    list = list.concat(ele.taskList);
  });
  list = Array.from(new Set(list));

  // 每个任务分配一个颜色 颜色不够都用#009688
  if (list.length <= rgbColors.length) {
    list.forEach((ele, index) => {
      colorMap.set(ele, rgbColors[index]);
    });
  } else {
    for (let i = 0; i < list.length; ++i) {
      if (i >= rgbColors.length) {
        colorMap.set(list[i], '#009688');
      } else {
        colorMap.set(list[i], rgbColors[i]);
      }
    }
  }
};

// 今日气象
const todayWeatherInfo = ref({
  temperature: 0,
  rainfall: 0,
  humidity: 0,
  windForce: 0
});

// 获取今日气象对应的图标
const getWeatherIcon = (monitorType: string) => {
  const list = [
    { name: '温度', icon: IconTemperature },
    { name: '雨', icon: IconRainfall },
    { name: '湿度', icon: IconHumidity },
    { name: '风', icon: IconWindForce }
  ];

  for (let i = 0; i < list.length; ++i) {
    if (monitorType.indexOf(list[i].name) !== -1) {
      return list[i].icon;
    }
  }
  return IconWindForce;
};

// 获取今日气象列表
const todayWeatherList = ref<any[]>([]);
const getTodayWeatherInfo = async () => {
  todayWeatherList.value = [];
  const res = await getEnvironmentalDataHomePageA();
  todayWeatherList.value = Array.isArray(res) ? res : [];
};
getTodayWeatherInfo();

// 设备状态
const deviceTotalNum = ref(0);
const deviceStatusInfo = ref([
  { value: 0, name: '在线设备' },
  { value: 0, name: '离线设备' },
  { value: 0, name: '故障设备' }
]);

const getDeviceStatusInfo = async () => {
  deviceTotalNum.value = 0;
  deviceStatusInfo.value.forEach((ele) => {
    ele.value = 0;
  });

  const res = await getDeviceStatus();
  if (!Array.isArray(res)) return;

  let tmp = 0;
  res.forEach((ele) => {
    switch (ele.name) {
      case '在线':
        deviceStatusInfo.value[0].value = ele.value ? Number(ele.value) : 0;
        tmp += Number(ele.value);
        break;
      case '故障':
        deviceStatusInfo.value[1].value = ele.value ? Number(ele.value) : 0;
        tmp += Number(ele.value);
        break;
      case '离线':
        deviceStatusInfo.value[2].value = ele.value ? Number(ele.value) : 0;
        tmp += Number(ele.value);
        break;
    }
  });
  deviceTotalNum.value = tmp;
};

let deviceStatusChart: any = null;
const setDeviceStatusChart = () => {
  const dom = document.getElementById('deviceStatusChart');
  if (!dom) return;
  const opt = makeDeviceStatusOpt(deviceStatusInfo.value);
  deviceStatusChart = echart.init(dom);
  deviceStatusChart.setOption(opt);
};

/**
 * 数据请求到了但是DOM没有加载完
 * DOM加载完了但是数据没有请求到
 *
 * 以上两种情况均有可能发生 因此采用下面的方式获取数据并渲染ECharts
 * DOM加载 -> 请求数据 -> 渲染ECharts
 */
onMounted(async () => {
  await getDeviceStatusInfo();
  setDeviceStatusChart();
  window.addEventListener('resize', () => {
    deviceStatusChart && deviceStatusChart.resize();
  });
});

// 任务统计
const taskStatisticsTimeRange = ref('month');

// 切换时间粒度
const handleChangeTimeRange = async () => {
  await getTaskStatisticsInfo();
  setTaskStatisticsChartData();
  const opt = makeTaskStatisticsOpt(taskStatisticsChartData.value);
  taskStatisticsChart.setOption(opt);
};

// 任务统计数据
const taskStatisticsInfo = ref({
  week: {
    total: {
      fertilize: 0,
      irrigate: 0,
      water: 0
    },
    fertilizeList: [],
    irrigateList: [],
    waterList: []
  },
  month: {
    total: {
      fertilize: 0,
      irrigate: 0,
      water: 0
    },
    fertilizeList: [],
    irrigateList: [],
    waterList: []
  }
});

// 初始化任务统计数据
const initTaskStatisticsInfo = () => {
  taskStatisticsInfo.value = {
    week: {
      total: {
        fertilize: 0,
        irrigate: 0,
        water: 0
      },
      fertilizeList: [],
      irrigateList: [],
      waterList: []
    },
    month: {
      total: {
        fertilize: 0,
        irrigate: 0,
        water: 0
      },
      fertilizeList: [],
      irrigateList: [],
      waterList: []
    }
  };
};

// 获取任务统计数据
const getTaskStatisticsInfo = async () => {
  initTaskStatisticsInfo();
  const res = await getTask();

  if (res.week) {
    const item = res.week;
    taskStatisticsInfo.value.week.total.fertilize = item.total.fertilize ? item.total.fertilize : 0;
    taskStatisticsInfo.value.week.total.irrigate = item.total.irrigate ? item.total.irrigate : 0;
    taskStatisticsInfo.value.week.total.water = item.total.water ? item.total.water : 0;
    taskStatisticsInfo.value.week.fertilizeList = Array.isArray(item.fertilizeList)
      ? item.fertilizeList
      : [];
    taskStatisticsInfo.value.week.irrigateList = Array.isArray(item.irrigateList)
      ? item.irrigateList
      : [];
    taskStatisticsInfo.value.week.waterList = Array.isArray(item.waterList) ? item.waterList : [];
  }

  if (res.month) {
    const item = res.month;
    taskStatisticsInfo.value.month.total.fertilize = item.total.fertilize
      ? item.total.fertilize
      : 0;
    taskStatisticsInfo.value.month.total.irrigate = item.total.irrigate ? item.total.irrigate : 0;
    taskStatisticsInfo.value.month.total.water = item.total.water ? item.total.water : 0;
    taskStatisticsInfo.value.month.fertilizeList = Array.isArray(item.fertilizeList)
      ? item.fertilizeList
      : [];
    taskStatisticsInfo.value.month.irrigateList = Array.isArray(item.irrigateList)
      ? item.irrigateList
      : [];
    taskStatisticsInfo.value.month.waterList = Array.isArray(item.waterList) ? item.waterList : [];
  }
};

// 统计图数据
const taskStatisticsChartData = ref({
  xData: [] as string[],
  irrigationData: [] as number[],
  fertilizationData: [] as number[],
  waterConsumptionData: [] as number[]
});

// 初始化折线图数据
const setTaskStatisticsChartData = async () => {
  taskStatisticsChartData.value.xData = [];
  taskStatisticsChartData.value.irrigationData = [];
  taskStatisticsChartData.value.fertilizationData = [];
  taskStatisticsChartData.value.waterConsumptionData = [];

  const timeRange = taskStatisticsTimeRange.value;
  const item = taskStatisticsInfo.value[timeRange];

  const n = item.fertilizeList.length;
  for (let i = 0; i < n; ++i) {
    taskStatisticsChartData.value.xData.push(item.fertilizeList[i].date);
    taskStatisticsChartData.value.fertilizationData.push(item.fertilizeList[i].count);
    taskStatisticsChartData.value.irrigationData.push(item.irrigateList[i].count);
    taskStatisticsChartData.value.waterConsumptionData.push(item.waterList[i].count);
  }
};

// 创建echarts实例
let taskStatisticsChart: any = null;
const setTaskStatisticsChart = () => {
  const dom = document.getElementById('taskStatisticsChart');
  if (!dom) return;
  const opt = makeTaskStatisticsOpt(taskStatisticsChartData.value);
  taskStatisticsChart = echart.init(dom);
  taskStatisticsChart.setOption(opt);
};

/**
 * 数据请求到了但是DOM没有加载完
 * DOM加载完了但是数据没有请求到
 *
 * 以上两种情况均有可能发生 因此采用下面的方式获取数据并渲染ECharts
 * DOM加载 -> 请求数据 -> 渲染ECharts
 */
onMounted(async () => {
  await getTaskStatisticsInfo();
  setTaskStatisticsChartData();
  setTaskStatisticsChart();
  window.addEventListener('resize', async () => {
    taskStatisticsChart && taskStatisticsChart.resize();
  });
});
</script>

<style lang="scss" scoped>
:deep(.card-with-header .el-card__header) {
  padding: 16px 0;
  margin: 0 16px;
}

.no-data {
  width: 180px;
  height: 180px;
  background-image: url(/images/noData.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
