<script setup lang="ts">
import ImageFlowChart from './assets/flow-chart.png';
import type { TabsPaneContext } from 'element-plus';
import { dateFormatter } from '@/utils/formatTime';
// @ts-ignore
import TwoColResizeView from './components/twoColResizeView.vue';
// @ts-ignore
import FertilizationProgram from './components/fertilizationProgram.vue';
// @ts-ignore
import IrrigationProgram from './components/irrigationProgram.vue';

// 土壤数据
const monitorTypeList = ref<any[]>([]);

// 也许不能单独获取 得从数据中抽取监控类型
const getMonitorTypeList = async () => {
  monitorTypeList.value = [];

  // await
  const res = ['土壤温度', '土壤湿度', 'PH', 'EC', '氮', '磷', '钾'];

  monitorTypeList.value = Array.isArray(res) ? res : [];
};
getMonitorTypeList();

const soilDataList = ref<any[]>([]);

const getSoilDataList = async () => {
  soilDataList.value = [];

  // await
  const res = [
    {
      name: '灌区1',
      category: '玉米',
      irrigateType: '滴灌',
      soilTemperatureCurrent: '28℃',
      soilTemperatureThreshold: '30℃',
      soilTemperatureStatus: 1,
      soilHumidityCurrent: '32%RH',
      soilHumidityThreshold: '50%RH',
      soilHumidityStatus: 1,
      phCurrent: 8,
      phThreshold: 6,
      phStatus: 1,
      ecCurrent: '1.73ms/cm',
      ecThreshold: '2ms/cm',
      ecStatus: 1,
      nitrogenCurrent: '7.80mg/kg',
      nitrogenThreshold: '6mg/kg',
      nitrogenStatus: 0,
      phosphorusCurrent: '7.80mg/kg',
      phosphorusThreshold: '6mg/kg',
      phosphorusStatus: 0,
      potassiumCurrent: '7.80mg/kg',
      potassiumThreshold: '6mg/kg',
      potassiumStatus: 0
    },
    {
      name: '灌区2',
      category: '草莓',
      irrigateType: '滴灌',
      soilTemperatureCurrent: '28℃',
      soilTemperatureThreshold: '30℃',
      soilTemperatureStatus: 1,
      soilHumidityCurrent: '32%RH',
      soilHumidityThreshold: '50%RH',
      soilHumidityStatus: 1,
      phCurrent: 8,
      phThreshold: 6,
      phStatus: 1,
      ecCurrent: '1.73ms/cm',
      ecThreshold: '2ms/cm',
      ecStatus: 1,
      nitrogenCurrent: '7.80mg/kg',
      nitrogenThreshold: '6mg/kg',
      nitrogenStatus: 0,
      phosphorusCurrent: '7.80mg/kg',
      phosphorusThreshold: '6mg/kg',
      phosphorusStatus: 0,
      potassiumCurrent: '7.80mg/kg',
      potassiumThreshold: '6mg/kg',
      potassiumStatus: 0
    },
    {
      name: '灌区4',
      category: '韭菜',
      irrigateType: '微喷灌',
      soilTemperatureCurrent: '28℃',
      soilTemperatureThreshold: '30℃',
      soilTemperatureStatus: 1,
      soilHumidityCurrent: '32%RH',
      soilHumidityThreshold: '50%RH',
      soilHumidityStatus: 1,
      phCurrent: 8,
      phThreshold: 6,
      phStatus: 1,
      ecCurrent: '1.73ms/cm',
      ecThreshold: '2ms/cm',
      ecStatus: 1,
      nitrogenCurrent: '7.80mg/kg',
      nitrogenThreshold: '6mg/kg',
      nitrogenStatus: 0,
      phosphorusCurrent: '7.80mg/kg',
      phosphorusThreshold: '6mg/kg',
      phosphorusStatus: 0,
      potassiumCurrent: '7.80mg/kg',
      potassiumThreshold: '6mg/kg',
      potassiumStatus: 0
    },
    {
      name: '灌区5',
      category: '小麦',
      irrigateType: '滴灌',
      soilTemperatureCurrent: '28℃',
      soilTemperatureThreshold: '30℃',
      soilTemperatureStatus: 1,
      soilHumidityCurrent: '32%RH',
      soilHumidityThreshold: '50%RH',
      soilHumidityStatus: 1,
      phCurrent: 8,
      phThreshold: 6,
      phStatus: 1,
      ecCurrent: '1.73ms/cm',
      ecThreshold: '2ms/cm',
      ecStatus: 1,
      nitrogenCurrent: '7.80mg/kg',
      nitrogenThreshold: '6mg/kg',
      nitrogenStatus: 0,
      phosphorusCurrent: '7.80mg/kg',
      phosphorusThreshold: '6mg/kg',
      phosphorusStatus: 0,
      potassiumCurrent: '7.80mg/kg',
      potassiumThreshold: '6mg/kg',
      potassiumStatus: 0
    }
  ];

  soilDataList.value = Array.isArray(res) ? res : [];
};
getSoilDataList();

// 最下面
const activeTabName = ref('irrigationControl');
const programControlRef = ref();

const handleTabChange = async (name: string) => {
  if (name === 'programControl') {
    await nextTick();
    programControlRef.value.initLeftAndRightBoxWidth();
  }
};

// 灌区控制
const irrigationSwitchList = ref<any[]>([]);
const getIrrigationSwitchList = async () => {
  irrigationSwitchList.value = [];

  // await
  const res = [
    { name: '灌区1', open: true },
    { name: '灌区2', open: true },
    { name: '灌区3', open: true },
    { name: '灌区4', open: false },
    { name: '灌区5', open: true },
    { name: '灌区6', open: true },
    { name: '灌区7', open: true },
    { name: '灌区8', open: false },
    { name: '灌区9', open: true },
    { name: '灌区10', open: false },
    { name: '灌区11', open: true },
    { name: '灌区12', open: true },
    { name: '灌区13', open: false },
    { name: '灌区14', open: true },
    { name: '灌区15', open: true },
    { name: '灌区16', open: false },
    { name: '灌区17', open: true },
    { name: '灌区18', open: true },
    { name: '灌区19', open: false },
    { name: '灌区20', open: true }
  ];

  irrigationSwitchList.value = Array.isArray(res) ? res : [];
};
getIrrigationSwitchList();

// 开关阀门的事件处理函数
const handleSwitchChange = (index: number) => {
  console.log('改变的ID和改变后的结果: ', index, irrigationSwitchList.value[index].open);
};

// 程式控制

// 状态监控
const statusMonitorList = ref<any[]>([]);

const getStatusMonitorList = async () => {
  statusMonitorList.value = [];

  // await
  const res = [
    { name: '流量计1', online: true, time: 1733215603592 },
    { name: '流量计2', online: true, time: 1733215603592 },
    { name: '流量计3', online: false, time: 1733215603592 },
    { name: '流量计4', online: true, time: 1733215603592 },
    { name: '流量计5', online: true, time: 1733215603592 },
    { name: '流量计6', online: false, time: 1733215603592 },
    { name: '流量计7', online: true, time: 1733215603592 },
    { name: '流量计8', online: true, time: 1733215603592 },
    { name: '流量计9', online: false, time: 1733215603592 },
    { name: '流量计10', online: true, time: 1733215603592 }
  ];

  statusMonitorList.value = Array.isArray(res) ? res : [];
};
getStatusMonitorList();

const scaleY = ref(1);
const scaleX = ref(1);
onMounted(() => {
  const controlElem = document.getElementById('control');
  const resizeObserver = new ResizeObserver((entries) => {
    const item = Array.isArray(entries[0].contentBoxSize)
      ? entries[0].contentBoxSize[0]
      : entries[0].contentBoxSize;
    const containerH = item.blockSize;
    const containerW = item.inlineSize;
    scaleX.value = containerW / 1562;
    scaleY.value = containerH / 856.56;
  });
  controlElem && resizeObserver.observe(controlElem);
});
</script>

<template>
  <div class="space-y-[4px]">
    <el-card class="!border-0" body-class="!p-[16px]" shadow="never">
      <div
        id="control"
        class="relative w-full box-border"
        :style="{
          paddingLeft: `${scaleX * 55}px`,
          paddingRight: `${scaleX * 55}px`
        }"
      >
        <img :src="ImageFlowChart" alt="流程图" class="w-full h-full object-contain" />
        <div
          class="tip-dialog absolute grid grid-cols-2"
          :style="{
            transform: `scale(${scaleX}, ${scaleY})`,
            top: `${scaleY * 38}px`,
            left: `${scaleX * -10}px`,
            transformOrigin: 'top left'
          }"
        >
          <span>累计流量:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">12L</span>
          <span>实时流速:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">0.3m³/h</span>
        </div>
        <div
          class="tip-dialog absolute grid grid-cols-2"
          :style="{
            transform: `scale(${scaleX}, ${scaleY})`,
            top: `${scaleY * 132}px`,
            left: `${scaleX * -10}px`,
            transformOrigin: 'top left'
          }"
        >
          <span>实时压力:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">0hpa</span>
          <span>实时频率:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">50Hz</span>
        </div>
        <div
          class="tip-dialog absolute grid grid-cols-2"
          :style="{
            transform: `scale(${scaleX}, ${scaleY})`,
            top: `${scaleY * 226}px`,
            left: `${scaleX * -10}px`,
            transformOrigin: 'top left'
          }"
        >
          <span>EC:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">12us/cm</span>
          <span>PH:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">7.8</span>
        </div>

        <div
          class="w-[692px] h-[112px] absolute grid grid-rows-3 border border-solid border-[#e6e6e6] rounded-[6px] bg-white/90"
          :style="{
            transform: `scale(${scaleX}, ${scaleY})`,
            top: `${scaleY * 320}px`,
            left: `${scaleX * 420}px`,
            transformOrigin: 'top left'
          }"
        >
          <div class="flex items-center border-b border-b-solid border-[#e6e6e6]">
            <span class="flex-none w-[70px] text-center" style="color: var(--el-color-primary)">
              液位
            </span>
            <div class="grow flex justify-between px-[30px] items-center">
              <span class="flex justify-center items-center">10cm</span>
              <span class="flex justify-center items-center">10cm</span>
              <span class="flex justify-center items-center">10cm</span>
              <span class="flex justify-center items-center">10cm</span>
              <span class="flex justify-center items-center">10cm</span>
            </div>
          </div>
          <div class="flex items-center border-b border-b-solid border-[#e6e6e6]">
            <span class="flex-none w-[70px] text-center" style="color: var(--el-color-primary)">
              体积
            </span>
            <div class="grow flex justify-between px-[30px] items-center">
              <span class="flex justify-center items-center">12L</span>
              <span class="flex justify-center items-center">12L</span>
              <span class="flex justify-center items-center">12L</span>
              <span class="flex justify-center items-center">12L</span>
              <span class="flex justify-center items-center">12L</span>
            </div>
          </div>
          <div class="flex items-center border-b border-b-solid border-[#e6e6e6]">
            <span class="flex-none w-[70px] text-center" style="color: var(--el-color-primary)">
              肥速
            </span>
            <div class="grow flex justify-between px-[30px] items-center">
              <span class="flex justify-center items-center">5L/H</span>
              <span class="flex justify-center items-center">5L/H</span>
              <span class="flex justify-center items-center">5L/H</span>
              <span class="flex justify-center items-center">5L/H</span>
              <span class="flex justify-center items-center">5L/H</span>
            </div>
          </div>
        </div>

        <div
          class="absolute top-0 h-[570px] w-[450px]"
          :style="{
            transform: `scale(${scaleX}, ${scaleY})`,
            right: `${scaleX * 12}px`,
            transformOrigin: 'top right'
          }"
        >
          <el-scrollbar>
            <h2 class="m-0 font-bold">施肥控制</h2>
            <div class="grid grid-cols-2 gap-[8px] mt-[16px]">
              <div class="space-y-[8px]">
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <span>水泵</span>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">上水阀1</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">上水阀2</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">上水阀3</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">上水阀4</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">上水阀5</span>
                  </div>
                  <el-switch />
                </div>
              </div>

              <div class="space-y-[8px]">
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <span>施肥泵</span>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">混肥1</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">混肥2</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">混肥3</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">混肥4</span>
                  </div>
                  <el-switch />
                </div>
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      1
                    </div>
                    <span class="ml-[8px]">混肥5</span>
                  </div>
                  <el-switch />
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-card>

    <el-card class="!border-0" body-class="!p-[16px]" shadow="never">
      <h2 class="m-0 text-[16px]">土壤数据</h2>
      <div
        v-if="soilDataList.length <= 0"
        class="w-full mt-[16px] h-[200px] flex justify-center items-center"
      >
        <img src="/images/noData.png" alt="暂无数据" class="w-[180px] h-[180px] object-contain" />
      </div>

      <el-scrollbar
        v-else
        class="w-full mt-[16px] border border-solid border-[#e6e6e6] rounded-[6px]"
        view-class="flex"
      >
        <div>
          <div class="soil-table-cell bg-[#F5F6FA]">监测类型</div>
          <div class="soil-table-cell"></div>
          <div v-for="item in monitorTypeList" :key="item" class="soil-table-cell">{{ item }}</div>
        </div>

        <div v-for="item in soilDataList" :key="item.name">
          <div class="soil-header-cell bg-[#F5F6FA]">
            {{ item.name }}({{ item.category }}-{{ item.irrigateType }})
          </div>
          <div class="flex">
            <div>
              <div class="soil-table-cell">当前值</div>
              <div class="soil-table-cell">{{ item.soilTemperatureCurrent }}</div>
              <div class="soil-table-cell">{{ item.soilHumidityCurrent }}</div>
              <div class="soil-table-cell">{{ item.phCurrent }}</div>
              <div class="soil-table-cell">{{ item.ecCurrent }}</div>
              <div class="soil-table-cell">{{ item.nitrogenCurrent }}</div>
              <div class="soil-table-cell">{{ item.phosphorusCurrent }}</div>
              <div class="soil-table-cell">{{ item.potassiumCurrent }}</div>
            </div>

            <div>
              <div class="soil-table-cell">阈值</div>
              <div class="soil-table-cell">{{ item.soilTemperatureThreshold }}</div>
              <div class="soil-table-cell">{{ item.soilHumidityThreshold }}</div>
              <div class="soil-table-cell">{{ item.phThreshold }}</div>
              <div class="soil-table-cell">{{ item.ecThreshold }}</div>
              <div class="soil-table-cell">{{ item.nitrogenThreshold }}</div>
              <div class="soil-table-cell">{{ item.phosphorusThreshold }}</div>
              <div class="soil-table-cell">{{ item.potassiumThreshold }}</div>
            </div>

            <div>
              <div class="soil-table-cell">状态</div>
              <div class="soil-table-cell">
                <div
                  :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.soilTemperatureStatus === 1 ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
                ></div>
                {{ item.soilTemperatureStatus === 1 ? '正常' : '异常' }}
              </div>
              <div class="soil-table-cell">
                <div
                  :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.soilHumidityStatus === 1 ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
                ></div>
                {{ item.soilHumidityStatus === 1 ? '正常' : '异常' }}
              </div>
              <div class="soil-table-cell">
                <div
                  :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.phStatus === 1 ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
                ></div>
                {{ item.phStatus === 1 ? '正常' : '异常' }}
              </div>
              <div class="soil-table-cell">
                <div
                  :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.ecStatus === 1 ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
                ></div>
                {{ item.ecStatus === 1 ? '正常' : '异常' }}
              </div>
              <div class="soil-table-cell">
                <div
                  :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.nitrogenStatus === 1 ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
                ></div>
                {{ item.nitrogenStatus === 1 ? '正常' : '异常' }}
              </div>
              <div class="soil-table-cell">
                <div
                  :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.phosphorusStatus === 1 ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
                ></div>
                {{ item.phosphorusStatus === 1 ? '正常' : '异常' }}
              </div>
              <div class="soil-table-cell">
                <div
                  :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.potassiumStatus === 1 ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
                ></div>
                {{ item.potassiumStatus === 1 ? '正常' : '异常' }}
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-card>

    <el-card class="!border-0" body-class="!p-[16px] !pt-0" shadow="never">
      <el-tabs v-model="activeTabName" @tab-change="handleTabChange">
        <el-tab-pane label="灌区控制" name="irrigationControl">
          <div
            v-if="irrigationSwitchList.length <= 0"
            class="w-full h-[200px] flex justify-center items-center"
          >
            <img
              src="/images/noData.png"
              alt="暂无数据"
              class="w-[180px] h-[180px] object-contain"
            />
          </div>

          <div v-else class="grid grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-[16px]">
            <div
              v-for="(item, index) in irrigationSwitchList"
              :key="item.name"
              class="h-[124px] border border-solid border-[#e6e6e6] box-border rounded-[6px]"
            >
              <div
                class="h-[38px] flex justify-center items-center border-b border-b-solid border-[#e6e6e6] bg-[#F5F6FA] text-[#333]"
              >
                {{ item.name }}
              </div>
              <div class="h-[83px] flex flex-col justify-center items-center">
                <el-switch
                  v-model="item.open"
                  :data-id="item.name"
                  @change="handleSwitchChange(index)"
                />
                <div :style="item.open && { color: 'var(--el-color-primary)' }">
                  <span>阀门{{ item.open ? '已开' : '已关' }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="程式控制" name="programControl">
          <div class="w-full h-[470px]">
            <two-col-resize-view ref="programControlRef" :leftMinWidth="390" :rightMinWidth="390">
              <template #left="leftProps">
                <fertilization-program v-model:width="leftProps.width" />
              </template>
              <template #right="rightProps">
                <irrigation-program v-model:width="rightProps.width" />
              </template>
            </two-col-resize-view>
          </div>
        </el-tab-pane>

        <el-tab-pane label="状态监控" name="statusMonitor">
          <el-table
            :data="statusMonitorList"
            :stripe="true"
            :show-overflow-tooltip="true"
            header-cell-class-name="!bg-[#F5F6FA]"
          >
            <el-table-column label="设备名称" prop="name" align="center" />
            <el-table-column label="设备状态" prop="online" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.online ? '' : 'danger'">
                  {{ scope.row.online ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="最新监测时间"
              prop="time"
              align="center"
              :formatter="dateFormatter"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.soil-table-cell {
  width: 100px;
  height: 40px;
  border-right: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.soil-header-cell {
  @extend .soil-table-cell;
  width: 300px;
}

.tip-dialog {
  width: 175px;
  height: 70px;
  background-image: url(./assets/dialog-bg.png);
  background-size: 100% 100%;
  padding: 12px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
