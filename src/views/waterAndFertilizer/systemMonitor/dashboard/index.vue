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
import {
  getSoilDeviceData,
  getDeviceStatusControl,
  getCenterBinData,
  getConsoleFrontDeviceData,
  getFertilizerControl,
  putUpdateStatus,
  getUpdateDeviceStatus,
  getIrrigationControl
} from './apis';
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';

const irrigateTypeDictList = getStrDictOptions(DICT_TYPE.WFI_IRRIGATION_TYPE);
const msg = useMessage();

// 从字符串中提取数字
function extractNumbers(str: string) {
  const pattern = /\d+/g;
  const matches = str.match(pattern);
  return matches ? matches.map(Number) : [];
}

// 控制台前端数据
const leftData = ref({
  traffic: '--',
  speed: '--',
  pressure: '--',
  frequency: '--',
  ec: '--',
  ph: '--'
});

const resetLeftData = () => {
  leftData.value = {
    traffic: '--',
    speed: '--',
    pressure: '--',
    frequency: '--',
    ec: '--',
    ph: '--'
  };
};

const getConsoleFrontDeviceDataList = async () => {
  resetLeftData();
  const res = await getConsoleFrontDeviceData();
  const keys = [
    { name: '流量', attr: 'traffic' },
    { name: '流速', attr: 'speed' },
    { name: '压力', attr: 'pressure' },
    { name: '频率', attr: 'frequency' },
    { name: 'EC', attr: 'ec' },
    { name: 'PH', attr: 'ph' }
  ];
  keys.forEach((ele) => {
    if (Array.isArray(res[ele.name]) && res[ele.name][0]) {
      const value = res[ele.name][0].latestData ? res[ele.name][0].latestData : '-';
      const unit = res[ele.name][0].unit ? res[ele.name][0].unit : '-';
      if (ele.name === 'EC' || ele.name === 'PH') {
        leftData.value[ele.attr] = '' + value;
      } else {
        leftData.value[ele.attr] = '' + value + unit;
      }
    }
  });
};
getConsoleFrontDeviceDataList();

// 中间料桶的数据
const centerBinData = ref<any>(null);
const getCenterBinDataList = async () => {
  centerBinData.value = null;
  let liquidLevel: string[] = [];
  let volume: string[] = [];
  let fertilizationSpeed: string[] = [];

  const res = await getCenterBinData();
  if (!res) return;

  // 获取key中的数字 添加到tmp对象中
  const tmp = {};
  const keys = Object.keys(res);
  const numbers = keys
    .map((ele: string) => {
      const sortId = extractNumbers(ele)[0];
      tmp[sortId] = [...res[ele]];
      return sortId;
    })
    .sort((a: number, b: number) => a - b);

  // 根据numbers中的顺序添加数据到液位 体积 肥速 三个数组中
  numbers.forEach((ele) => {
    const list = tmp[ele];
    list.forEach((item: any) => {
      const data = item.latestData ? item.latestData : '-';
      const unit = item.unit ? item.unit : '-';
      switch (item.deviceMonitorType) {
        case '液位':
          liquidLevel.push('' + data + unit);
          break;
        case '体积':
          volume.push('' + data + unit);
          break;
        case '肥速':
          fertilizationSpeed.push('' + data + unit);
          break;
      }
    });
  });

  centerBinData.value = {};
  centerBinData.value.liquidLevel = liquidLevel;
  centerBinData.value.volume = volume;
  centerBinData.value.fertilizationSpeed = fertilizationSpeed;
};
getCenterBinDataList();

// 施肥控制
const fertilizeControlData = ref({
  waterThresh: [] as any[],
  fertilize: [] as any[]
});

const getFertilizerControlData = async () => {
  fertilizeControlData.value.waterThresh = [];
  fertilizeControlData.value.fertilize = [];
  const res = await getFertilizerControl();
  if (!Array.isArray(res['上水阀']) || !Array.isArray(res['混肥'])) return;
  fertilizeControlData.value.waterThresh = res['上水阀'].map((ele) => {
    return { ...ele, open: ele.deviceStatus === 'online' };
  });
  fertilizeControlData.value.fertilize = res['混肥'].map((ele) => {
    return { ...ele, open: ele.deviceStatus === 'online' };
  });
};
getFertilizerControlData();

// 修改单个设备状态
const handleChangeDeviceStatus = async (index: number, attr: string) => {
  const id = fertilizeControlData.value[attr][index].deviceId;
  const deviceStatus = fertilizeControlData.value[attr][index].open ? 'online' : 'offline';
  await putUpdateStatus({ id, deviceStatus });
  msg.success('修改成功');
  await getFertilizerControlData();
};

// 开启全部上水阀/施肥泵
const waterSwitch = ref(false);
const fertilizeSwitch = ref(false);

const handleSwitchALLType = async (key: string) => {
  let deviceName = '';
  let status = '';
  switch (key) {
    case 'water':
      deviceName = '上水阀';
      status = waterSwitch.value ? 'online' : 'offline';
      break;
    case 'fertilize':
      deviceName = '混肥';
      status = fertilizeSwitch.value ? 'online' : 'offline';
      break;
  }
  await getUpdateDeviceStatus({ deviceName, status });
  msg.success('修改成功');
  await getFertilizerControlData();
};

// 土壤数据
const soilDeviceData = ref<any[]>([]);
const monitorTypes = ref<any[]>([]);

const getSoilDeviceDataInfo = async () => {
  soilDeviceData.value = [];
  monitorTypes.value = [];

  const res = await getSoilDeviceData();
  if (!res) return;

  // 遍历对象第一个元素值的列表 获取所有的监测类型 假设没有重复的类型
  const firstValue = Object.values(res)[0];
  if (!Array.isArray(firstValue)) return;
  const monitorTypesTmp: string[] = [];
  const sortMap = new Map<string, number>();
  firstValue.forEach((ele) => {
    monitorTypesTmp.push(ele.monitor);
    sortMap.set(ele.monitor, monitorTypesTmp.length - 1);
  });

  // 遍历数据的所有值 增加属性sortId用于排序 和 灌溉类型名称irrigationTypeName
  let list = Object.values(res);
  for (let i = 0; i < list.length; ++i) {
    const tmpList = list[i] as any[];
    for (let j = 0; j < tmpList.length; ++j) {
      const sortId =
        sortMap.get(tmpList[j].monitor) !== undefined ? sortMap.get(tmpList[j].monitor) : -1;
      const dictItem = irrigateTypeDictList.find((ele) => {
        return ele.value === tmpList[j].irrigationType;
      });
      const irrigationTypeName = dictItem?.label;
      tmpList[j] = { ...tmpList[j], sortId, irrigationTypeName };
    }
  }

  // 对list的每个值进行排序
  for (let i = 0; i < list.length; ++i) {
    let tmpList = list[i] as any[];
    tmpList = tmpList.sort((a: any, b: any) => {
      return a.sortId - b.sortId;
    });
  }

  soilDeviceData.value = list;
  monitorTypes.value = monitorTypesTmp;
};
getSoilDeviceDataInfo();

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

  const res = await getIrrigationControl();
  if (!Array.isArray(res)) return;

  const tmp = res.map((ele) => {
    return { ...ele, open: ele.deviceStatus === 'online' };
  });
  irrigationSwitchList.value = tmp;
};
getIrrigationSwitchList();

// 开关阀门的事件处理函数
const handleSwitchChange = async (index: number) => {
  const id = irrigationSwitchList.value[index].deviceId;
  const deviceStatus = irrigationSwitchList.value[index].open ? 'online' : 'offline';
  await putUpdateStatus({ id, deviceStatus });
  msg.success('修改成功');
  await getIrrigationSwitchList();
};

// 状态监控
const statusMonitorList = ref<any[]>([]);
const getStatusMonitorList = async () => {
  statusMonitorList.value = [];
  const res = await getDeviceStatusControl();
  statusMonitorList.value = Array.isArray(res)
    ? res.map((ele) => {
        return {
          ...ele,
          name: ele.deviceName ? ele.deviceName : '-',
          online: 'online' === ele.deviceStatus ? true : false,
          time: getTimeStr(ele.createTime)
        };
      })
    : [];
};
getStatusMonitorList();

// 根据时间戳返回YYYY-MM-DD HH:MM:SS
const getTimeStr = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
  const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
  const minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
  const second = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};

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
          <span :style="{ color: 'var(--el-color-primary)' }">{{ leftData.traffic }}</span>
          <span>实时流速:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">{{ leftData.speed }}</span>
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
          <span :style="{ color: 'var(--el-color-primary)' }">{{ leftData.pressure }}</span>
          <!-- <span>实时频率:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">{{ leftData.frequency }}</span> -->
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
          <span :style="{ color: 'var(--el-color-primary)' }">{{ leftData.ec }}</span>
          <span>PH:</span>
          <span :style="{ color: 'var(--el-color-primary)' }">{{ leftData.ph }}</span>
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
            <div
              v-if="centerBinData && centerBinData.liquidLevel"
              class="grow flex justify-between px-[30px] items-center"
            >
              <span
                v-for="item in centerBinData.liquidLevel"
                :key="item"
                class="flex justify-center items-center"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="flex items-center border-b border-b-solid border-[#e6e6e6]">
            <span class="flex-none w-[70px] text-center" style="color: var(--el-color-primary)">
              体积
            </span>
            <div
              v-if="centerBinData && centerBinData.volume"
              class="grow flex justify-between px-[30px] items-center"
            >
              <span
                v-for="item in centerBinData.volume"
                :key="item"
                class="flex justify-center items-center"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="flex items-center border-b border-b-solid border-[#e6e6e6]">
            <span class="flex-none w-[70px] text-center" style="color: var(--el-color-primary)">
              肥速
            </span>
            <div
              v-if="centerBinData && centerBinData.fertilizationSpeed"
              class="grow flex justify-between px-[30px] items-center"
            >
              <span
                v-for="item in centerBinData.fertilizationSpeed"
                :key="item"
                class="flex justify-center items-center"
              >
                {{ item }}
              </span>
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
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border shadow-md"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <span>水泵</span>
                  <el-switch v-model="waterSwitch" @change="handleSwitchALLType('water')" />
                </div>
                <div
                  v-for="(item, index) in fertilizeControlData.waterThresh"
                  :key="item.deviceId"
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border shadow-md"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      {{ index + 1 }}
                    </div>
                    <span class="ml-[8px]">{{ item.deviceName }}</span>
                  </div>
                  <el-switch
                    v-model="item.open"
                    @change="handleChangeDeviceStatus(index, 'waterThresh')"
                  />
                </div>
              </div>

              <div class="space-y-[8px]">
                <div
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border shadow-md"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <span>施肥泵</span>
                  <el-switch v-model="fertilizeSwitch" @change="handleSwitchALLType('fertilize')" />
                </div>
                <div
                  v-for="(item, index) in fertilizeControlData.fertilize"
                  :key="item.deviceId"
                  class="flex items-center justify-between w-full h-[80px] rounded-[6px] px-[16px] box-border shadow-md"
                  style="border: 1px solid var(--el-color-primary)"
                >
                  <div class="flex items-center">
                    <div
                      class="px-[6px] rounded-full text-white"
                      style="background-color: var(--el-color-primary)"
                    >
                      {{ index + 1 }}
                    </div>
                    <span class="ml-[8px]">{{ item.deviceName }}</span>
                  </div>
                  <el-switch
                    v-model="item.open"
                    @change="handleChangeDeviceStatus(index, 'fertilize')"
                  />
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
        v-if="soilDeviceData.length <= 0"
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
          <div v-for="item in monitorTypes" :key="item" class="soil-table-cell">
            {{ item }}
          </div>
        </div>

        <div v-for="item in soilDeviceData" :key="item[0].irrigationId">
          <div class="soil-header-cell bg-[#F5F6FA]">
            {{ item[0].irrigationName }}({{ item[0].irrigationTypeName }})
          </div>
          <div class="flex">
            <div class="soil-table-cell">当前值</div>
            <div class="soil-table-cell">阈值</div>
            <div class="soil-table-cell">状态</div>
          </div>
          <div v-for="ele in item" :key="ele.monitor" class="flex">
            <div class="soil-table-cell">
              {{ ele.dataValue }}{{ ele.unit === '无' ? '' : ele.unit }}
            </div>
            <div class="soil-table-cell">{{ ele.lowValue }}~{{ ele.highValue }}</div>
            <div class="soil-table-cell">
              <div
                :class="`w-[6px] h-[6px] mr-[8px] rounded-full ${item.status !== '正常' ? 'bg-[#53C31B]' : 'bg-[#FF5951]'}`"
              ></div>
              {{ ele.status }}
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
              :key="item.deviceId"
              class="h-[124px] border border-solid border-[#e6e6e6] box-border rounded-[6px] shadow-md"
            >
              <div
                class="h-[38px] flex justify-center items-center border-b border-b-solid border-[#e6e6e6] bg-[#F5F6FA] text-[#333]"
              >
                {{ item.deviceName }}
              </div>
              <div class="h-[83px] flex flex-col justify-center items-center">
                <el-switch v-model="item.open" @change="handleSwitchChange(index)" />
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
  width: 150px;
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
  width: 450px;
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
