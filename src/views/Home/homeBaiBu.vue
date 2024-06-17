<script setup lang="ts">
import {
  baidiHomeDeviceCard,
  getLineChar,
  getCropBaseCountRatio,
  QueryCurrentDateCount,
  QueryMonitorTypeCountRanking,
  getBaseCollect,
  locationPrice
} from '@/api/home/baibu'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import * as echarts from 'echarts'
import { formatTime } from '@/utils/index'

// 产品流通统计
const initChart3 = async () => {
  const res = await locationPrice()
  const xValue:Array<any> = [], yValue:Array<any> = []
  for (let key in (res as any)) {
    xValue.push(key)
    yValue.push(res[key])
  }
  initChartStatic('chart3', generateBaseOptions({
    yAxis: {
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
      itemHeight: 15,
    },
    color: ['#ffa773', '#36e1d9'],
    xAxis: {
      name: '',
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
        type: 'bar',
        smooth: true,
        label: {
          show: true, //开启显示
          position: 'right', //在上方显示
          textStyle: {
            //数值样式
            color: '#a1a1aa',
            fontSize: 10
          }
        },
      }
    ],
    grid: {
      left: '8%',
      right: '6%',
      top: '6%',
      bottom: '12%'
    }
  }))
}

// 种植基地
const baseCollectList = ref<Array<any>>([])
const getGetBaseCollect = async () => {
  const res = await getBaseCollect();
  baseCollectList.value = res
}
getGetBaseCollect()

const dataCollectList = ref<Array<any>>([])
const getQueryMonitorTypeCountRanking = async (params) => {{
  const res = await QueryMonitorTypeCountRanking({ ... params })
  dataCollectList.value = res
}}
getQueryMonitorTypeCountRanking({})

const initChart4 = async (params) => {{
  const res = await QueryCurrentDateCount({ ...params })
  console.log('数据采集趋势', res);
  const xValue = res.map(item => (item.collectionDate))
  const yValue = res.map(item => (item.totalValue))
  initChartStatic('chart4', generateBaseOptions({
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
      name: '',
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
      left: '4%',
      right: '2%',
      top: '16%',
      bottom: '15%'
    }
  }))
}}

const initChart2 = async () => {
  const { list = [] } = await getCropBaseCountRatio()
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
        data: list.map(item => ({
          name: item.cropName,
          value: item.cultivatedArea
        })),
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

const initChart1 = async () => {
  const {
    xValue = [],
    yValue = [],
    measureUnit = []
  } = await getLineChar({ cropCode: '1774743080484405248' })
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
      itemHeight: 15,
    },
    color: ['#ffa773', '#36e1d9'],
    yAxis: {
      name: measureUnit[0],
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
      left: '8%',
      right: '6%',
      top: '16%',
      bottom: '15%'
    }
  }))
}
onMounted(() => {
  initChart1()
  initChart2()
  initChart3()
  initChart4({})
})

const baidiHomeCardList = ref<Array<any>>([])
const getBaidiHomeDeviceCard = async () => {
  const res = await baidiHomeDeviceCard()
  baidiHomeCardList.value = res.filter(item => (parseInt(item.deviceCount) > 0))
}
getBaidiHomeDeviceCard()

//  数据采集
const dataPickerSelected = ref('')
const dataPickerVal = ref<any>([])
const handleRadioChange = (e) => {
  dataPickerVal.value = []
  console.log("radio", e);
  if (e === '今日') {
    initChart4({ type: 'day' })
  }
  if (e === '本月') {
    initChart4({ type: 'month' })
  }
  if (e === '本年') {
    initChart4({ type: 'year' })
  }
}
const handleDataPickerChange = (e) => {
  dataPickerSelected.value = ''
  console.log("picker", e);
  if (Array.isArray(e) && e.length > 0) {
    const startDate = formatTime(e[0], 'yyyy-MM-dd')
    const endDate = formatTime(e[1], 'yyyy-MM-dd')
    getQueryMonitorTypeCountRanking({ startDate, endDate })
    initChart4({ type: 'appoint', startDate, endDate })
  }
}
</script>
<template>
  <div class="w-full">
    <div class="grid gap-2" :style="`grid-template-columns: repeat(${baidiHomeCardList.length}, 1fr)`">
      <el-card v-for="item, index in baidiHomeCardList" :key="index">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">{{ item.title }}</span>
            <el-icon>
              <Warning />
            </el-icon>
          </div>
        </template>
        <div class="text-[1.2rem] art-font">{{ item.deviceCount }}</div>
      </el-card>
    </div>
    <div class="grid grid-cols-2 gap-2 mt-2">
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">作物生长趋势</span>
          </div>
        </template>
        <div id="chart1"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">种植基地</span>
          </div>
        </template>
        <div style="height: 12rem;" class="scroll-bar-hidden">
          <div
            v-for="item, index in baseCollectList"
            :key="index"
            class="flex items-center my-1 justify-between"
          >
            <div class="flex w-[13rem] justify-between items-center">
              <div class="px-2 py-1 w-[5rem]" style="background-color: #facd91;">{{ item.baseName }}</div>
              <div>地块: {{ item.plotCount }}</div>
            </div>
            <div>种植品种: {{ item.variety }}</div>
          </div>
        </div>
      </el-card>
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">种植分布</span>
          </div>
        </template>
        <div id="chart2"></div>
      </el-card>
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">产品流通分布</span>
          </div>
        </template>
        <div id="chart3"></div>
      </el-card>
      <el-card class="col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">数据采集</span>
            <div class="flex space-x-3">
              <el-radio-group v-model="dataPickerSelected" @change="handleRadioChange">
                <el-radio-button label="今日" value="今日" />
                <el-radio-button label="本月" value="本月" />
                <el-radio-button label="本年" value="本年" />
              </el-radio-group>
              <el-date-picker
                @change="handleDataPickerChange"
                v-model="dataPickerVal"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </div>
          </div>
        </template>
        <div class="flex justify-between">
          <div class="p-2" style="width: calc(100% - 15.5rem);">
            <div class="art-font" style="font-size: .9rem;">数据采集趋势</div>
            <div id="chart4" style="height: 14rem;"></div>
          </div>
          <div class="w-[15rem]">
            <div class="art-font" style="font-size: .9rem;">数据采集类型排名</div>
            <div style="height: 14rem;" class="overflow-auto scroll-bar-hidden">
              <div
                v-for="item, index in dataCollectList"
                :key="index"
                class="flex items-center justify-between my-3"
              >
                <div class="flex items-center space-x-2">
                  <div
                    class="rounded-full flex items-center justify-center w-[1rem] h-[1rem]"
                    :style="`background-color: ${index < 3 ? '#314659' : '#f0f2f5'};color: ${index < 3 ? '#f0f2f5' : '#314659'};`"
                  >{{ index + 1 }}</div>
                  <div>{{ item.monitoringType }}</div>
                </div>
                <div>{{ item.totalValue }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#chart1, #chart2, #chart3, #chart4 {
  height: 12rem;
}

.scroll-bar-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>