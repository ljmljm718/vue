<template>
  <div class="w-full">
    <div class="md:col-span-3 mb-4">
      <el-card>
        <el-select
          v-model="selectedDeviceName"
          size="large"
          style="width: 240px"
          @change="filterData"
        >
          <el-option
            v-for="item in allData"
            :key="item.id"
            :label="item.deviceName"
            :value="item.deviceName"
          />
        </el-select>
        <div v-if="filteredData.length" class="flex space-x-35 mt-4">
          <div v-for="(data, index) in filteredData" :key="index">
            <span> {{ data.title }} :</span>
            <span class="pl-3">{{ data.value }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <el-card>
        <div class="flex mb-4">
          <div class="font-bold">溶解氧当前值：</div>
          <div class="font-bold text-#009688">
            {{ CurrentDoInfo.dataValue }}
            <span v-if="CurrentDoInfo.dataValue !== '暂无数据'">{{ yyUnit }}</span>
          </div>
        </div>
        <div
          class="flex items-center my-2 bg-[#fdeceb] text-[#E31205] text-lg p-2"
          v-for="(warning, index) in warningMessage"
          :key="index"
        >
          <img src="./assets/warnIcon.png" class="w-4 h-4 mr-2" />
          <span>设备警告：</span>
          <span>{{ warning }}</span>
        </div>
      </el-card>
      <el-card class="w-full">
        <div class="font-bold mb-4">增氧机参数</div>
        <div class="flex h-17 gap-3 mx-3">
          <div
            class="flex-1 bg-#E5F4F3 text-center border-0 border-t-3.5 border-t-#009688 border-solid p-2"
          >
            <span class="text-#666 block">当前功率</span>
            <span class="text-#333 block">{{ currentPower }}</span></div
          >
          <div
            class="flex-1 bg-#eef7ee text-center border-0 border-t-3.5 border-t-#59b756 border-solid p-2"
          >
            <span class="text-#666 block">建议功率</span>
            <span class="text-#333 block">{{ suggestNumList[0] }}</span>
          </div>
        </div>
        <div class="text-#009688 mx-3 my-2">调整建议：</div>
        <span class="block mx-3">{{ suggestMessage }}</span>
        <div class="flex justify-end mr-3">
          <el-button
            type="primary"
            color="#009688"
            @click="router.push('/internetMonitor/device/deviceView?deviceCode=' + currentId)"
            >去调整</el-button
          ></div
        >
      </el-card>
      <el-card>
        <div class="font-bold mb-4">评分占比分析图</div>
        <div class="flex justify-center items-center w-full">
          <div id="radarChart" class="w-[100%] h-[270px]"></div>
          <!-- <div id="radarChart" clas s="w-[50%] h-[50%] mx-auto"></div> -->
        </div>
      </el-card>
    </div>

    <div class="md:col-span-3 mt-4">
      <el-card>
        <div class="flex justify-between items-center p-4">
          <div class="font-bold">实时数据</div>
          <div class="flex items-center">
            <el-date-picker
              v-model="SelectedDate"
              type="date"
              placeholder="请输入查询日期"
              size="large"
              @change="onFilterDate"
            />
          </div>
        </div>
        <div id="lineChart" class="w-full aspect-[6]"></div>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {
  getBasicInfo,
  getlineChartData,
  getCurrentPower,
  getOxygenRuleInfo,
  getCurrentDO
} from './api'
import { initChartStatic, generateBaseOptions } from '@/utils/bigscreenTool/index'
import dayjs from 'dayjs'
const router = useRouter() // 路由

const selectedDeviceName = ref('')
const filteredData = ref<any[]>([])
const collectionTime = ref('')
const dataValue = ref('')
const yyUnit = ref('')

// 获取全部数据
//基本信息
const allData = ref<any[]>([])
const getallData = async (deviceKind) => {
  const res = await getBasicInfo({ deviceKind })
  if (!Array.isArray(res)) return
  allData.value = res
  if (res.length > 0) {
    yyUnit.value = res[0].yyUnit
    collectionTime.value = dayjs(res[0].collectionTime).format('YYYY-MM-DD HH:mm:ss')
  }
}

const currentId = ref<string>('1777173933829857345')
const filterData = () => {
  const selectedItem = allData.value.find((item) => item.deviceName === selectedDeviceName.value)
  if (selectedItem) {
    currentId.value = selectedItem.id
    getCurrentPowerInfo(selectedItem.id, '当前功率')
    getScoreInfo(selectedItem.id)
    dataValue.value = selectedItem.dataValue
    filteredData.value = [
      { title: '增氧机状态', value: selectedItem.deviceStatus },
      { title: '地块名称', value: selectedItem.plotName },
      {
        title: '通信时间',
        value: collectionTime.value
      },
      { title: '负责人', value: selectedItem.contact }
    ]
  } else {
    filteredData.value = []
    yyUnit.value = ''
  }
  getDoInfo(currentId.value)
}

const CurrentDoInfo = ref<any[]>([])
const getDoInfo = async (equipmentId) => {
  CurrentDoInfo.value = await getCurrentDO({ equipmentId })
}

const currentPower = ref<any[]>([])
const getCurrentPowerInfo = async (devicesId, subDevicesName) => {
  const _res = await getCurrentPower({ devicesId, subDevicesName })
  currentPower.value = _res
}
getCurrentPowerInfo('1777173933829857345', '当前功率')

const suggestNumList = ref<string[]>([])
const warningList = ref<string[]>([])
const suggestList = ref<string[]>([])
const warningMessage = ref<string[]>([])
const suggestMessage = ref<string>('')

const getScoreInfo = async (equipId) => {
  const ScoreData = await getOxygenRuleInfo({ equipId })
  const targetNum = ScoreData.targetNum.map(Number) || []
  const currentNum = ScoreData.currentNum.map(Number) || []
  // suggestNumList.value = ScoreData.suggestNumList.map((item) => Number(item.replace('%', ''))) || []
  suggestNumList.value = ScoreData.suggestNumList || []
  const factorName = ScoreData.factorName || []
  suggestList.value = ScoreData.suggestList || []
  warningList.value = ScoreData.warningList || []
  warningMessage.value = warningList.value
  suggestMessage.value = suggestList.value.join('; ')
  drawRadarChart(targetNum, currentNum, factorName)
}

//画图一
let chartIns: any = null
const drawRadarChart = (targetNum = [], currentNum = [], factorName = []) => {
  if (
    !Array.isArray(targetNum) ||
    !Array.isArray(currentNum) ||
    !Array.isArray(factorName) ||
    targetNum.length === 0 ||
    currentNum.length === 0 ||
    factorName.length === 0
  ) {
    chartIns && chartIns.clear()
  }
  chartIns = initChartStatic('radarChart', {
    title: {
      // text: '评估评分占比分析图'
    },
    tooltip: {},
    radar: [
      {
        indicator: factorName.map((name, i) => ({ name, max: targetNum[i] || 100 })),
        name: {
          textStyle: {
            fontSize: 15,
            color: '#666666',
            fontWeight: 'bold'
          }
        },
        splitArea: {
          // 坐标轴在 grid 区域中的分隔区域，默认不显示。
          show: true,
          areaStyle: {
            // 分隔区域的样式设置。
            color: ['rgba(251, 251, 251)', 'rgba(253, 253, 253)'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
          }
        },
        axisLine: {
          // 设置雷达图中间射线的颜色
          lineStyle: {
            color: '#rgba(241, 241, 241)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(241, 241, 241)'
          }
        }
      }
    ],
    series: [
      {
        name: 'Current Values',
        type: 'radar',
        data: [
          {
            value: currentNum,
            name: 'Current Values',
            itemStyle: {
              normal: {
                color: 'rgba(198, 234, 230)',
                lineStyle: {
                  color: 'rgba(0, 157, 143)'
                }
              }
            }
          }
        ],
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#00AD8F',
          borderColor: '#00AD8F',
          borderWidth: 2
        },
        areaStyle: {
          color: 'rgba(198, 234, 230, 0.5)'
        }
      }
    ]
  })
}

// 实时数据 Chart
const getLineChartInfo = async (date) => {
  const LineChartData = await getlineChartData({ date })
  const LineSeriesData: any[] = []
  for (let key in LineChartData) {
    const seriesName = key
    const seriesData = LineChartData[key]
    LineSeriesData.push({
      name: seriesName,
      data: seriesData.map((item) => item.dataValue)
    })
  }
  const PH = LineChartData.PH,
    Temp = LineChartData['温度'],
    Light = LineChartData['光照强度']
  const xValue = PH.map((item) => item.hour ?? '')

  initChartStatic(
    'lineChart',
    generateBaseOptions({
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
        show: true,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15,
        left: '85%',
        textStyle: {
          color: '#999999',
          fontSize: 14
        }
      },
      color: ['#ffa773', '#36e1d9','red','pink','yellow'],
      yAxis: {
        name: '',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#a1a1aa80'
          }
        },
        // minInterval:1,
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
      series: LineSeriesData.map((item) => ({
        name: item.name,
        data: item.data,
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
        }
      })),
      // series: [
      //   {
      //     name: 'PH',
      //     data: PH.map((item) => item.dataValue),
      //     barWidth: 30,
      //     type: 'line',
      //     smooth: true,
      //     label: {
      //       show: true, //开启显示
      //       position: 'top', //在上方显示
      //       textStyle: {
      //         //数值样式
      //         color: '#eee',
      //         fontSize: 10
      //       }
      //     },
      //     itemStyle: {
      //       normal: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //           { offset: 1, color: '#1bcad600' },
      //           { offset: 0, color: '#1bcad6' }
      //         ])
      //       }
      //     },
      //     areaStyle: { normal: {} }
      //   },
      //   {
      //     name: '温度',
      //     data: Temp.map((item) => item.dataValue),
      //     barWidth: 30,
      //     type: 'line',
      //     smooth: true,
      //     label: {
      //       show: true, //开启显示
      //       position: 'top', //在上方显示
      //       textStyle: {
      //         //数值样式
      //         color: '#eee',
      //         fontSize: 10
      //       }
      //     },
      //     itemStyle: {
      //       normal: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //           { offset: 1, color: '#d54b3f00' },
      //           { offset: 0, color: '#d54b3f' }
      //         ])
      //       }
      //     },
      //     areaStyle: { normal: {} }
      //   },
      //   {
      //     name: '光照强度',
      //     data: Light.map((item) => item.dataValue),
      //     barWidth: 30,
      //     type: 'line',
      //     smooth: true,
      //     label: {
      //       show: true, //开启显示
      //       position: 'top', //在上方显示
      //       textStyle: {
      //         //数值样式
      //         color: '#eee',
      //         fontSize: 10
      //       }
      //     },
      //     itemStyle: {
      //       normal: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //           { offset: 1, color: '#bfa26b00' },
      //           { offset: 0, color: '#bfa26b' }
      //         ])
      //       }
      //     },
      //     areaStyle: { normal: {} }
      //   }
      // ],
      grid: {
        left: '6%',
        right: '4%',
        top: '16%',
        bottom: '15%'
      }
    })
  )
}

const SelectedDate = ref('2024-07-18')
  const onFilterDate = () => {
    const date = SelectedDate.value
    getLineChartInfo(date)
  }
// 初始化
const init = async () => {
  await getallData(119)
  if (allData.value.length > 0) {
    selectedDeviceName.value = allData.value[3].deviceName
    filterData()
    onFilterDate()
  }
  await getScoreInfo('1777173933829857345')
}
// 初始化
onMounted(() => init())
</script>