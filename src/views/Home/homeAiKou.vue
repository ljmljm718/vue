<script setup lang="ts">
import {
  deviceInfoBySum,
  warningRecordInfo,
  aikouMonitor,
  parkInfoPage,
  selectHarvestVolume,
  getCountPageByBaseId,
  getPageMonitoring
} from '@/api/home/aikou'
import { formatTime } from '@/utils/index'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import * as echarts from 'echarts'

// 基地新消息
const initChart1 = async () => {
  const { list = [] } = await parkInfoPage({
    pageReqVO: `{ "pageNo": 1, "pageSize": 10}`
  })
  const xValue = list.map(item => (item.categoryName))
  const yValue = list.map(item => (item.area))
  initChartStatic('chart1', generateBaseOptions({
    xAxis: {
      data: xValue,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      }
    },
    legend: {
      show: false,
      orient: 'horizontal',
      itemWidth: 15,
      itemHeight: 15
    },
    color: ['#ffa773', '#36e1d9'],
    yAxis: {
      name: '亩',
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      },
      splitLine: {
        //网格线
        show: true, //是否显示
        lineStyle: {
          //网格线样式
          color: '#a1a1aa80', //网格线颜色
          width: 1, //网格线的加粗程度
          type: 'dashed' //网格线类型
        }
      },
      splitArea: {
        //网格区域
        show: false //是否显示
      }
    },
    series: [
      {
        name: '',
        data: yValue,
        barWidth: 30,
        type: 'line',
        smooth: true,
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
          textStyle: {
            //数值样式
            color: '#eee',
            fontSize: 10
          }
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 1, color: '#1bcad600' },
              { offset: 0, color: '#1bcad6' }
            ])
          },
        },
        areaStyle: { normal: {} },
      }
    ],
    grid: {
      left: '12%',
      right: '10%',
      top: '16%',
      bottom: '15%'
    }
  }))
}

const initChart2 = async () => {
  const res = await selectHarvestVolume({})
  
  const data = res.map(item => ({
    name: item.belongPark,
    value: item.harvestVolume
  }))
  initChartStatic('chart2', generatePieOptions({
    legend: {
      show: true,
      top: "center",
      left: "right",
      bottom: '0',
      orient: 'vertical',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#a1a1aa'
      }
    },
    color: ["#48e5e5", "#9dadb0", "#3254dd", "#feba47", "#bee5fb", "#3cd495", "#ffedb7"],
    series: [
      {
        type: "pie",
        radius: ["45%", "65%"],
        center: ["40%", "50%"],
        data: data,
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],
  }))
}

onMounted(() => {
  initChart1()
  initChart2()
})

// 基地列表
const parkInfoList = ref<Array<any>>([])
const getParkInfoPage = async () => {
  const { list = [] } = await parkInfoPage({})
  parkInfoList.value = list
  if (Array.isArray(list) && list.length > 0) {
    selectedBase.value = list[0].id
    selectedBase1.value = list[0].id
    getAikouMonitor(0, list[0].id)
    getAikouMonitor(1, list[0].id)

    getMonitorDeviceList()
  }
}
getParkInfoPage()

// 0 气象监测 1 土壤监测
const topDataList = ref<Array<any>>([])
const bottomDataList = ref<Array<any>>([])
const getAikouMonitor = async (type = 0, baseCode = '') => {
  const res = await aikouMonitor({ type, baseCode })
  const fix_8 = (arr) => {
    const res = []
    let item = 0
    for (item = 0; item < 8; item++) {
      if (arr[item]) res.push(arr[item])
      if (!arr[item]) res.push({})
    }
    return res
  }
  console.log('获取', res);
  
  if (type === 0) {
    topDataList.value = fix_8(res)
  } else {
    bottomDataList.value = fix_8(res)
  }
}

// 预警信息
const preWarnInfoList = ref<Array<any>>([])
const getWarningRecordInfo = async () => {
  const res = await warningRecordInfo()
  preWarnInfoList.value = res
}
getWarningRecordInfo()

const deviceInfoList = ref<Array<any>>([])
const deviceInfoTotal = ref(0)
const getDeviceInfoBySum = async () => {
  const { list = [], total = 0 } = await deviceInfoBySum()
  deviceInfoList.value = list
  deviceInfoTotal.value = total
}
getDeviceInfoBySum()

// 实时监测数据
const selectedBase =ref('')
const handleSelectedBaseChange = (e) => {
  console.log('e', e);
  getAikouMonitor(0, e)
  getAikouMonitor(1, e)
}
const selectedBase1 =ref('')
const handleSelectedBaseChange1 = () => {
  getMonitorDeviceList()
}

const monitorDeviceList = ref<Array<any>>([])
const monitorDeviceIndex = ref(1)
const getMonitorDeviceList = async (pageNo = 1, baseId = selectedBase1.value) => {
  if (!baseId) return;
  selectedBase1.value = baseId
  const {list = []} = await getCountPageByBaseId({
    pageNo, pageSize: 3, deviceType: '40,44', baseId
  })

  console.log('巡检统计', list);
  
  monitorDeviceList.value = list.map(item => ({
    ...item,
    img: item.imgId,
    title: item.deviceName,
    online: item.deviceStatus === 'online'
  }))
}

const handleArrowClick = (index) => {
  if (index < 0 && monitorDeviceIndex.value <= 1) return
  monitorDeviceIndex.value += index
  getMonitorDeviceList(monitorDeviceIndex.value)
}
</script>
<template>
  <div class="w-full">
    <div class="grid gap-2" :style="`grid-template-columns: repeat(${deviceInfoList.length + 1}, 1fr)`">
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">设备总数</span>
            <el-icon>
              <Warning />
            </el-icon>
          </div>
        </template>
        <div>
          <span>{{ deviceInfoTotal }}</span>
          <span class="ml-1">台</span>
        </div>
      </el-card>
      <el-card v-for="item, index in deviceInfoList" :key="index">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">{{ item.categoryName }}</span>
            <span>{{ item.total }}台</span>
          </div>
        </template>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex">
            <span>在线: </span>
            <span class="ml-2" style="color:#409eff;">{{ item.online }}</span>
          </div>
          <div class="flex">
            <span>离线: </span>
            <span class="ml-2" style="color: red;">{{ item.offline }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <div class="grid grid-cols-4 gap-2 mt-2">
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">基地信息</span>
          </div>
        </template>
        <div id="chart1"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">采收信息</span>
          </div>
        </template>
        <div id="chart2"></div>
      </el-card>
      <el-card class="col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">实时监测数据</span>
            <el-select v-model="selectedBase" @change="handleSelectedBaseChange" style="width: 10rem;" size="small">
              <el-option :label="item.name" :value="item.id" v-for="item, index in parkInfoList" :key="index" />
            </el-select>
          </div>
        </template>
        <div class="grid gap-2 grid-cols-5 grid-rows-4">
          <div
            class="row-span-2 flex flex-col items-center justify-center"
            style="border: 1px solid #5293EAA0;background-color: #5293EA30;"
          >
            <div class="t w-[2rem] h-[2rem] mb-2" style="background-size: 100% 100%;"></div>
            <div>环境监测</div>
          </div>
          <div
            v-for="(item, index) in topDataList"
            :key="item.monitoringType"
            class="flex space-x-2 p-2 pl-4"
            style="border: 1px solid #5293EAA0;background-color: #5293EA30;font-size: .9rem;"
          >
            <div
              :class="`t-${index + 1} w-[2rem] h-[2rem]`"
              style="background-size: 100% 100%;"
            ></div>
            <div>
              <div>
                <span>{{ item.dataValue }}</span>
                <span style="padding-left: .1rem;">{{ item.yyUnit }}</span>
              </div>
              <div style="font-size: .9rem;padding-top: .2rem;">{{ item.monitoringType }}</div>
            </div>
          </div>
          <div
            class="row-span-2 flex flex-col items-center justify-center"
            style="border: 1px solid #b5ead8A0;background-color: #b5ead830;"
          >
            <div class="b w-[2rem] h-[2rem] mb-2" style="background-size: 100% 100%;"></div>
            <div>水质监测</div>
          </div>
          <div
            v-for="(item, index) in bottomDataList"
            :key="item"
            class="flex space-x-2 p-2 pl-4"
            style="border: 1px solid #b5ead8A0;background-color: #b5ead830;font-size: .9rem;"
          >
            <div
              :class="`b-${index + 1} w-[2rem] h-[2rem]`"
              style="background-size: 100% 100%;"
            ></div>
            <div>
              <div>
                <span>{{ item.dataValue }}</span>
                <span style="padding-left: .1rem;">{{ item.yyUnit }}</span>
              </div>
              <div style="font-size: .9rem;padding-top: .2rem;">{{ item.monitoringType }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="grid grid-cols-2 gap-2 mt-2">
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">设备巡检</span>
            <el-select v-model="selectedBase1" @change="handleSelectedBaseChange1" style="width: 10rem;" size="small">
              <el-option :label="item.name" :value="item.id" v-for="item, index in parkInfoList" :key="index" />
            </el-select>
          </div>
        </template>
        <div
          class="grid"
          style="grid-template-columns: 5% repeat(3, 30%) 5%;"
        >
          <div class="left-arrow-bg h-full" @click="handleArrowClick(-1)"></div>
          <div
            v-for="(item, index) in monitorDeviceList"
            :key="index"
            class="flex flex-col px-1"
          >
            <div class="p-1" style="background-color: aliceblue;">
              <img
                :src="item.img || '/img.png'"
                alt=""
                style="width: 100%;aspect-ratio: 2;object-fit: contain;"
              />
            </div>
            <div class="flex p-2 py-1" style="background: linear-gradient(to right, #409effa0, #409eff00)">
              <span>{{ item.categoryName }}</span>
              <span class="pl-4">{{ item.sumNum }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 py-1">
              <div class="flex items-center">
                <el-icon style="color: green;"><HelpFilled /></el-icon>
                <span>已巡检</span>
                <span class="pl-2">{{ item.finishCheckNum }}</span>
              </div>
              <div class="flex items-center">
                <el-icon style="color: red;"><HelpFilled /></el-icon>
                <span>未巡检</span>
                <span class="pl-2">{{ item.unFinishCheckNum }}</span>
              </div>
            </div>
          </div>
          <div
            class="right-arrow-bg h-full"
            v-show="monitorDeviceList.length === 3"
            @click="handleArrowClick(1)"
          ></div>
        </div>
      </el-card>
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">预警信息</span>
          </div>
        </template>
        <el-table
          :data="preWarnInfoList"
          :stripe="true"
          :show-overflow-tooltip="true"
        >
          <el-table-column label="预警标题" align="center" prop="warnTitle" />
          <el-table-column label="预警类型" align="center" prop="warnType" />
          <el-table-column label="预警信息" align="center" prop="warnInfo" />
          <el-table-column label="预警时间" align="center">
            <template #default="scope">
              <span>{{ formatTime(scope.row.warnTime, 'yyyy-MM-dd') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#chart1, #chart2 {
  height: 14rem;
}
.t {
  background-image: url(./assets/home1/t.png);
}

@for $i from 1 through 8 {
  .t-#{$i} {
    background-image: url(./assets/home1/t#{$i}.png);
  }
}

.b {
  background-image: url(./assets/home1/b.png);
}

@for $i from 1 through 8 {
  .b-#{$i} {
    background-image: url(./assets/home1/b#{$i}.png);
  }
}

.left-arrow-bg {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 90% auto;
  background-image: url(./assets/leftArrowBg.png);
}

.right-arrow-bg {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 90% auto;
  background-image: url(./assets/rightArrowBg.png);
}
</style>