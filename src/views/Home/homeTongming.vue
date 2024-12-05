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
          :key="item.district"
          class="flex-none w-[180px] h-[198px] border-r border-r-solid border-[#e6e6e6] box-border"
        >
          <div
            class="flex justify-center items-center w-full h-[40px] border-b border-b-solid border-[#e6e6e6] bg-[#F5F6FA] text-[#333]"
          >
            {{ item.district }}
          </div>
          <el-scrollbar style="height: 157px" view-class="p-[8px] box-border space-y-[4px]">
            <div
              v-for="ele in item.tasks"
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
          class="flex-none flex flex-col justify-between items-center py-[31px] box-border w-[119px] h-[200px] bg-[#F0F7F6] rounded-[6px]"
        >
          <div>
            <img :src="IconTemperature" alt="温度" class="w-[36px] h-[36px] object-cover" />
            <div class="mt-[14px]">温度</div>
          </div>
          <div class="text-[22px]">{{ todayWeatherInfo.temperature }}℃</div>
        </div>
        <div
          class="flex-none flex flex-col justify-between items-center py-[31px] box-border w-[119px] h-[200px] bg-[#F0F7F6] rounded-[6px]"
        >
          <div>
            <img :src="IconRainfall" alt="降雨量" class="w-[36px] h-[36px] object-cover" />
            <div class="mt-[14px]">降雨量</div>
          </div>
          <div class="text-[22px]">{{ todayWeatherInfo.rainfall }}mm/min</div>
        </div>
        <div
          class="flex-none flex flex-col justify-between items-center py-[31px] box-border w-[119px] h-[200px] bg-[#F0F7F6] rounded-[6px]"
        >
          <div>
            <img :src="IconHumidity" alt="湿度" class="w-[36px] h-[36px] object-cover" />
            <div class="mt-[14px]">湿度</div>
          </div>
          <div class="text-[22px]">{{ todayWeatherInfo.humidity }}%RH</div>
        </div>
        <div
          class="flex-none flex flex-col justify-between items-center py-[31px] box-border w-[119px] h-[200px] bg-[#F0F7F6] rounded-[6px]"
        >
          <div>
            <img :src="IconWindForce" alt="风力" class="w-[36px] h-[36px] object-cover" />
            <div class="mt-[14px]">风力</div>
          </div>
          <div class="text-[22px]">{{ todayWeatherInfo.windForce }}m/s</div>
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
          <el-radio-group
            v-model="taskStatisticsTimeRange"
            @change="handleTaskStatisticsTimeRangeChange"
          >
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
            <span class="text-[24px]">{{ taskStatisticsInfo.irrigationTaskNum }}</span>
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
            <span class="text-[24px]">{{ taskStatisticsInfo.fertiliztionTaskNum }}</span>
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
            <span class="text-[24px]">{{ taskStatisticsInfo.waterConsumption }}</span>
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

// 基本信息
const baseInfo = ref({
  waterSourceNum: 0,
  irrigationNum: 0,
  baseNum: 0,
  plotNum: 0,
  plotArea: 0
});

const getBaseInfo = async () => {
  baseInfo.value.waterSourceNum = 0;
  baseInfo.value.irrigationNum = 0;
  baseInfo.value.baseNum = 0;
  baseInfo.value.plotNum = 0;
  baseInfo.value.plotArea = 0;

  // await
  const res = {
    waterSourceNum: 12,
    irrigationNum: 36,
    baseNum: 2,
    plotNum: 32,
    plotArea: 53.27
  };

  baseInfo.value.waterSourceNum = res.waterSourceNum ? res.waterSourceNum : 0;
  baseInfo.value.irrigationNum = res.irrigationNum ? res.irrigationNum : 0;
  baseInfo.value.baseNum = res.baseNum ? res.baseNum : 0;
  baseInfo.value.plotNum = res.plotNum ? res.plotNum : 0;
  baseInfo.value.plotArea = res.plotArea ? res.plotArea : 0;
};
getBaseInfo();

// 灌区当前任务
const currentTasks = ref<any[]>([]);
const colorMap = reactive(new Map());

const getCurrentTasks = async () => {
  currentTasks.value = [];

  // await
  const res = [
    {
      district: '灌区1',
      tasks: ['任务1', '任务2', '任务3', '任务4', '任务5', '任务6']
    },
    {
      district: '灌区2',
      tasks: []
    },
    {
      district: '灌区3',
      tasks: ['任务3', '任务4', '任务5']
    },
    {
      district: '灌区4',
      tasks: ['任务3', '任务4', '任务5', '任务7', '任务8']
    },
    {
      district: '灌区5',
      tasks: ['任务5', '任务7', '任务9']
    },
    {
      district: '灌区6',
      tasks: ['任务10', '任务11', '任务12']
    }
  ];

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
    list = list.concat(ele.tasks);
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

const getTodayWeatherInfo = async () => {
  todayWeatherInfo.value.temperature = 0;
  todayWeatherInfo.value.rainfall = 0;
  todayWeatherInfo.value.humidity = 0;
  todayWeatherInfo.value.windForce = 0;

  // await
  const res = {
    temperature: 29.6,
    rainfall: 11,
    humidity: 32,
    windForce: 9
  };

  todayWeatherInfo.value.temperature = res.temperature ? res.temperature : 0;
  todayWeatherInfo.value.rainfall = res.rainfall ? res.rainfall : 0;
  todayWeatherInfo.value.humidity = res.humidity ? res.humidity : 0;
  todayWeatherInfo.value.windForce = res.windForce ? res.windForce : 0;
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

  // await
  const res = {
    total: 28,
    online: 14,
    offline: 7,
    error: 7
  };

  deviceTotalNum.value = res.total ? res.total : 0;
  deviceStatusInfo.value[0].value = res.online ? res.online : 0;
  deviceStatusInfo.value[1].value = res.offline ? res.offline : 0;
  deviceStatusInfo.value[2].value = res.error ? res.error : 0;
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
const handleTaskStatisticsTimeRangeChange = (param: any) => {
  console.log('切换时间粒度: ', param);
};

// 图上面的三项数据
const taskStatisticsInfo = ref({
  irrigationTaskNum: 0,
  fertiliztionTaskNum: 0,
  waterConsumption: 0
});

const getTaskStatisticsInfo = async () => {
  taskStatisticsInfo.value.irrigationTaskNum = 0;
  taskStatisticsInfo.value.fertiliztionTaskNum = 0;
  taskStatisticsInfo.value.waterConsumption = 0;

  // await
  const res = {
    irrigationTaskNum: 60,
    fertiliztionTaskNum: 46,
    waterConsumption: 43.27
  };

  taskStatisticsInfo.value.irrigationTaskNum = res.irrigationTaskNum ? res.irrigationTaskNum : 0;
  taskStatisticsInfo.value.fertiliztionTaskNum = res.fertiliztionTaskNum
    ? res.fertiliztionTaskNum
    : 0;
  taskStatisticsInfo.value.waterConsumption = res.waterConsumption ? res.waterConsumption : 0;
};
getTaskStatisticsInfo();

// 统计图数据
const taskStatisticsChartData = ref({
  xData: [] as string[],
  irrigationData: [] as number[],
  fertilizationData: [] as number[],
  waterConsumptionData: [] as number[]
});

const getTaskStatisticsChartData = async () => {
  taskStatisticsChartData.value.xData = [];
  taskStatisticsChartData.value.irrigationData = [];
  taskStatisticsChartData.value.fertilizationData = [];
  taskStatisticsChartData.value.waterConsumptionData = [];

  // await
  const res = {
    xData: [
      '05-01',
      '05-04',
      '05-07',
      '05-10',
      '05-13',
      '05-16',
      '05-19',
      '05-22',
      '05-25',
      '05-28',
      '05-31'
    ],
    irrigationData: [30, 75, 70, 30, 40, 85, 80, 75, 80, 60, 85, 115],
    fertilizationData: [15, 30, 25, 40, 55, 40, 38, 25, 30, 43, 40, 55],
    waterConsumptionData: [45, 60, 40, 75, 45, 60, 110, 90, 60, 80, 100, 95]
  };

  taskStatisticsChartData.value.xData = Array.isArray(res.xData) ? res.xData : [];
  taskStatisticsChartData.value.irrigationData = Array.isArray(res.irrigationData)
    ? res.irrigationData
    : [];
  taskStatisticsChartData.value.fertilizationData = Array.isArray(res.fertilizationData)
    ? res.fertilizationData
    : [];
  taskStatisticsChartData.value.waterConsumptionData = Array.isArray(res.waterConsumptionData)
    ? res.waterConsumptionData
    : [];
};

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
  await getTaskStatisticsChartData();
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
