<template>
  <div class="w-full">
    <div class="grid grid-cols-4 gap-4">
      <el-card>
        <div>
          <div class="flex justify-between">
            <!-- 左侧选择框 -->
            <el-select
              v-model="selectedParkName"
              size="large"
              style="width: 190px"
              @change="filterLeftData"
            >
              <el-option
                v-for="item in basicInfo"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
            <!-- 右侧选择框 -->
            <el-select
              v-model="selectedPlotName"
              size="large"
              style="width: 120px"
              @change="filterRightData"
            >
              <el-option
                v-for="item in plotInfo"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </div>

          <div v-if="Array.isArray(deviceDetail) && deviceDetail.length === 1">
            <div class="flex flex-col relative h-[200px]">
              <img
                src="./assets/deviceIcon.png"
                class="w-[7rem] h-[7rem] mr-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[65%] object-contain"
              />
              <span
                class="text-[#009688] absolute bottom-[9%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >{{
                  deviceDetail && deviceDetail[0] && deviceDetail[0].deviceName
                    ? deviceDetail[0].deviceName
                    : ''
                }}</span
              >
              <img
                src="./assets/subTitleBg.png"
                class="w-90% h-10 absolute bottom-0 left-1/2 transform -translate-x-1/2"
              />
            </div>
          </div>

          <div v-else-if="Array.isArray(deviceDetail) && deviceDetail.length > 1">
            <div class="flex flex-col relative h-[200px]">
              <div id="device1" @click="handleClick(0)" class="cursor-pointer z-10">
                <img
                  :src="imgSrc1"
                  class="device1-img w-[6rem] h-[6rem] mr-2 absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-[65%] object-contain"
                />
                <span
                  :style="{ color: textColor1 }"
                  class="device1-text text-[#009688] absolute bottom-[9%] left-1/4 transform -translate-x-1/2 -translate-y-1/2"
                  >{{
                    deviceDetail && deviceDetail[0] && deviceDetail[0].deviceName
                      ? deviceDetail[0].deviceName
                      : ''
                  }}</span
                >
              </div>
              <div id="device2" @click="handleClick(1)" class="cursor-pointer z-0">
                <img
                  :src="imgSrc2"
                  class="device2-img w-[6rem] h-[6rem] mr-2 absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-[65%] object-contain"
                />
                <span
                  :style="{ color: textColor2 }"
                  class="device2-text text-[#009688] absolute bottom-[9%] right-1/4 transform translate-x-1/4 -translate-y-1/2"
                  >{{
                    deviceDetail && deviceDetail[1] && deviceDetail[1].deviceName
                      ? deviceDetail[1].deviceName
                      : ''
                  }}</span
                >
              </div>

              <img
                src="./assets/subTitleBg.png"
                class="w-90% h-10 absolute bottom-0 left-1/2 transform -translate-x-1/2"
              />
            </div>
          </div>

          <div class="p-4 mt-3 space-y-4">
            <div
              class="flex items-center mb-2"
              v-show="
                (deviceDetail && deviceDetail[0] && deviceDetail[0].deviceStatus
                  ? deviceDetail[0].deviceStatus
                  : '') === 'online'
              "
            >
              <span>增氧机状态：</span>
              <img src="./assets/Online.png" class="w-4 h-4 mx-2" />
              <span class="text-[#00B53D]">在线</span>
            </div>
            <div
              class="flex items-center mb-2"
              v-show="
                (deviceDetail && deviceDetail[0] && deviceDetail[0].deviceStatus
                  ? deviceDetail[0].deviceStatus
                  : '') === 'offline'
              "
            >
              <span>增氧机状态：</span>
              <img src="./assets/Offline.png" class="w-4 h-4 mx-2" />
              <span class="text-[#999999]">离线</span>
            </div>
            <div
              class="flex items-center mb-2"
              v-show="
                (deviceDetail && deviceDetail[0] && deviceDetail[0].deviceStatus
                  ? deviceDetail[0].deviceStatus
                  : '') === 'fault'
              "
            >
              <span>增氧机状态：</span>
              <img src="./assets/Error.png" class="w-4 h-4 mx-2" />
              <span class="text-[#E31205]">故障</span>
            </div>
            <div class="mb-2">
              <span>通信时间：</span>
              <span>{{
                deviceDetail && deviceDetail[0] && deviceDetail[0].updateTime
                  ? deviceDetail[0].updateTime
                  : ''
              }}</span>
            </div>
            <div>
              <span>负责人：</span>
              <span>{{
                deviceDetail && deviceDetail[0] && deviceDetail[0].contact
                  ? deviceDetail[0].contact
                  : ''
              }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card>
        <div class="font-bold mb-4">当前要素健康分析</div>
        <div class="flex justify-center items-center w-full">
          <div id="radarChart" class="w-[100%] h-[270px] "></div>
        </div>
      </el-card>

      <el-card>
        <div class="flex mb-4 justify-between">
          <div class="font-bold">模型分析结果</div>
          <!-- <div class="text-#009688 bg-[#e5f4f3] px-6 py-2 rounded-full">
            溶解氧标准值： {{ standardDo.optimalTemperature }}
            <span v-if="CurrentDoInfo.dataValue !== '暂无数据'">{{ yyUnit }}</span>
          </div> -->
          <div class="text-#009688 bg-[#e5f4f3] 2xl:px-6 2xl:py-2 2xl:rounded-full xl:px-1 xl:rounded xl:py-1 xl:mt--2 xl:mr--1">
            <span class="xl:block xl:text-sm xl:whitespace-nowrap xl:mr--1 2xl:inline">溶解氧标准值：</span>
            <span class="xl:block xl:text-sm xl:text-center 2xl:inline"
              >{{ standardDo.optimalTemperature }} 
              <span v-if="CurrentDoInfo.dataValue !== '暂无数据'">{{ yyUnit }}</span>
            </span>
          </div>
        </div>
        <div class="flex flex-col relative w-full h-[200px] items-center  ">
          <img
            src="./assets/currentScore.png"
            class="w-[250px] h-[250px] object-contain absolute -translate-y-1/10"
          />
          <div class="flex flex-col absolute top-1/2 transform translate-x-1/20 -translate-y-1/2">
            <span class="text-[1.6rem]">{{ CurrentDoInfo.dataValue }}</span>
            <span class="text-[#999999] text-[1.2rem]">{{ CurrentDoInfo.yyUnit }}</span>
          </div>
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-[50%] xl:whitespace-nowrap"
            >溶解氧当前值</span
          >
        </div>

        <div
          class="flex items-center my-4 bg-[#fdeceb] text-[#E31205] text-lg p-2 rounded-md"
          v-for="(warning, index) in warningMessage"
          :key="index"
        >
          <img src="./assets/warnIcon.png" class="w-5 h-5 m-3 xl:w-4 h-4" />
          <span class="text-3.5">设备警告：{{ warning }}</span>
        </div>
      </el-card>

      <el-card class="w-full">
        <div class="font-bold mb-4">增氧机建议参数</div>
        <div class="flex flex-col h-17 gap-3">
          <div class="flex justify-between bg-[#e5f4f3] text-center p-2 text-#333333 px-3">
            <span>当前功率:</span>
            <span>{{ currentPower }}</span></div
          >
          <div class="flex justify-between bg-[#f5f5f5] text-center p-2 text-#333333 px-3">
            <span>建议功率:</span>
            <span>{{ suggestNumList[0] }}</span>
          </div>
        </div>
        <div class="border-2 border-solid border-[#f2f2f2] rounded-md mt-8 pb-3">
          <div class="text-#009688 mx-3 my-2 text-[1.2rem]">调整建议：</div>
          <span class="block mx-3">{{ suggestMessage }}</span>
        </div>

        <div class="flex mr-3 mt-5">
          <el-button
            type="primary"
            color="#009688"
            size="large"
            class="buttonSize"
            @click="
              router.push('/internetMonitor/device/deviceView?deviceCode=' + deviceDetail[0].id)
            "
            >去调整</el-button
          ></div
        >
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
              value-format="YYYY-MM-DD"
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
import deviceIcon from './assets/deviceIcon.png'
import deviceIcon1 from './assets/deviceIcon1.png'
import {
  getParkInfoPage,
  getParkDetailPage,
  getDissolvedOxygenEquipmentList,
  getRopriateEnvironmentalByDissolvedOxygen,
  getlineChartData,
  getCurrentPower,
  getOxygenRuleInfo,
  getCurrentDO
} from './api'
import { initChartStatic, generateBaseOptions } from '@/utils/bigscreenTool/index'
import dayjs from 'dayjs'
const router = useRouter() // 路由

const basicInfo = ref<any[]>([])
const plotInfo = ref<any[]>([])
const selectedParkName = ref('')
const selectedPlotName = ref('')
const deviceDetail = ref<any[]>([])
const yyUnit = ref('')

//获取增氧机状态
const getParkInfo = async () => {
  const parkRes = await getParkInfoPage()
  basicInfo.value = parkRes.list.map(({ id, name }) => ({ id, name }))
}

const getPlotInfo = async (parkId) => {
  const plotRes = await getParkDetailPage({ parkId })
  plotInfo.value = plotRes.list.map(({ id, parkId, name, contact }) => ({
    id,
    parkId,
    name,
    contact
  }))
}

//左侧选择框
const filterLeftData = () => {
  const selectedItem = basicInfo.value.find((item) => item.name === selectedParkName.value)
  if (selectedItem) {
    getPlotInfo(selectedItem.id)
  }
}
//右侧选择框
const filterRightData = () => {
  const selectedItem = plotInfo.value.find((item) => item.name === selectedPlotName.value)
  if (selectedItem) {
    getDeviceDetail(selectedItem.parkId, selectedItem.id)
  }
}

//设备信息获取
const getDeviceDetail = async (baseId, plotId) => {
  const res = await getDissolvedOxygenEquipmentList({ baseId, plotId })
  deviceDetail.value = res.map(
    ({ deviceName, deviceStatus, updateTime, belongPlot, id }) => ({
      deviceName,
      deviceStatus,
      updateTime: dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss'),
      belongPlot,
      id
    })
  )

  deviceDetail.value = deviceDetail.value.map((item) => {
    const plotContactInfo = plotInfo.value.find((ele) => ele.id === item.belongPlot)
    return {
      ...item,
      contact: plotContactInfo ? plotContactInfo.contact : null
    }
  })
  getDoInfo(deviceDetail.value[0].id)
  getCurrentPowerInfo(deviceDetail.value[0].id)
  getScoreInfo(deviceDetail.value[0].id)
}

//切换显示
const imgSrc1 = ref(deviceIcon)
const imgSrc2 = ref(deviceIcon1)
const textColor1 = ref('#009688')
const textColor2 = ref('#666666')

const handleClick = (index) => {
  const tempImgSrc = imgSrc1.value
  imgSrc1.value = imgSrc2.value
  imgSrc2.value = tempImgSrc

  // 交换文本颜色
  const tempColor = textColor1.value
  textColor1.value = textColor2.value
  textColor2.value = tempColor
// 获取图片元素
const imgElement1 = document.getElementById('device1');
  const imgElement2 = document.getElementById('device2');

  // 检查并切换z-index
  if (imgElement1.classList.contains('z-10')) {
    imgElement1.classList.remove('z-10');
    imgElement1.classList.add('z-0');
    imgElement2.classList.remove('z-0');
    imgElement2.classList.add('z-10');
  } else {
    imgElement1.classList.remove('z-0');
    imgElement1.classList.add('z-10');
    imgElement2.classList.remove('z-10');
    imgElement2.classList.add('z-0');
  }

  // 调用函数
  const selectedDeviceId = deviceDetail.value[index].id
  getDoInfo(selectedDeviceId)
  getCurrentPowerInfo(selectedDeviceId)
  getScoreInfo(selectedDeviceId)
}

const CurrentDoInfo = ref<any>({})
const getDoInfo = async (equipmentId) => {
  CurrentDoInfo.value = await getCurrentDO({ equipmentId })
}

const standardDo = ref<any>({})
const getStandardDo = async () => {
  standardDo.value = await getRopriateEnvironmentalByDissolvedOxygen()
}

//获取当前设备功率
const currentPower = ref<any[]>([])
const getCurrentPowerInfo = async (devicesId, subDevicesName = '当前功率') => {
  const _res = await getCurrentPower({ devicesId, subDevicesName })
  currentPower.value = _res
}

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
  const currentData = ScoreData.nowData || []
  drawRadarChart(targetNum, currentNum, factorName, currentData)
}

//画图一
let chartIns: any = null
const drawRadarChart = (targetNum = [], currentNum = [], factorName = [], currentData = []) => {
  if (
    !Array.isArray(targetNum) ||
    !Array.isArray(currentNum) ||
    !Array.isArray(factorName) ||
    !Array.isArray(currentData) ||
    targetNum.length === 0 ||
    currentNum.length === 0 ||
    factorName.length === 0 ||
    currentData.length === 0
  ) {
    chartIns && chartIns.clear()
  }
  chartIns = initChartStatic('radarChart', {
    title: {
      // text: '评估评分占比分析图'
    },

    tooltip: {
      formatter: function (params) {
        // 获取当前数据和额外数据的组合
        let combinedData = factorName
          .map((name, index) => {
            return `<span style="font-size: 14px;">
                    <span style="display: inline-block; width: 4px; height: 4px; background-color: #a3d7d1; border-radius: 50%; margin-right: 5px;margin-bottom: 5px"></span>
                    <strong>${name}</strong>\n:\n\n  ${currentNum[index]} 分 (${currentData[index]})
                </span>`
          })
          .join('<br/>')
        return `${params.seriesName}<br/>${combinedData}`
      },
      position: function (point) {
        return [point[0] - 90, point[1] + 20]
      },
      extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);'
    },

    radar: [
      {
        indicator: factorName.map((name, i) => ({ name, max: targetNum[i] || 100 })),
        name: {
          textStyle: {
            fontSize: 15,
            color: '#666666',
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
        },
        radius:'60%'
      }
    ],
    series: [
      {
        name: '指标得分与数值',
        type: 'radar',
        data: [
          {
            value: currentNum,
            name: 'Current Values',
            // label: {
            //   show: true,
            //   formatter: (params) => {
            //     return currentData
            //   }
            // },
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
const colorList = ['#FF8C69', '#64DDA0', '#FFBB78', '#FF6F61', '#6FC2FF', '#FFD700']
const hexToRgba = (hex, alpha) => {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16))
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}
const getLineChartInfo = async (date) => {
  const LineChartData = await getlineChartData({ date })
  const LineSeriesData: any[] = []
  let colorIndex = 0
  for (let key in LineChartData) {
    const seriesName = key
    const seriesData = LineChartData[key]
    LineSeriesData.push({
      name: seriesName,
      data: seriesData.map((item) => item.dataValue),
      color: colorList[colorIndex % colorList.length]
    })
    colorIndex++
    if (colorIndex >= colorList.length) {
      colorIndex = 0 // 当 colorIndex 超过 colorList 长度时重置为 0
    }
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
        },
        boundaryGap: false
      },
      legend: {
        show: true,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15,
        // left: '80%',
        padding:[0,40,0,0],
        textStyle: {
          color: '#999999',
          fontSize: 14
        }
      },
      color: ['#FF8C69', '#64DDA0', '#FFBB78', '#FF6F61', '#6FC2FF', '#FFD700'],
      yAxis: [
        {
          name: '',
          type: 'value',
          axisLine: {
            show: false,
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
          },
          axisLabel: {
            show: true, // 确保显示坐标轴标签
            color: '#999999', // 设置标签文字的颜色
            fontSize: 10,
            formatter: function (value) {
              if (value === 0) {
                return ''
              }
              return value
            }
          }
          // min: 0,
          // max: 150,
          // axisTick: {
          //   show: true // 确保显示坐标轴刻度
          // }
        },
        // 右侧y轴
        {
          name: '',
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#a1a1aa80'
            }
          },
          // minInterval:1,
          splitLine: {
            //网格线
            show: false, //是否显示
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
          },
          axisLabel: {
            show: true, // 确保显示坐标轴标签
            color: '#999999', // 设置标签文字的颜色
            fontSize: 10,
            formatter: function (value) {
              if (value === 0) {
                return ''
              }
              return value
            }
          }
        }
      ],
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
        },
        yAxisIndex: item.name === '光照强度' ? 1 : 0,
        areaStyle: {
          // color: '#009688'
          // color: 'rgba(154, 213, 207,0.2)'
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: item.color // 颜色的起点
              },
              {
                offset: 1,
                color: hexToRgba(item.color, 0)
              }
            ]
          }
        }
      })),
      grid: {
        left: '4%',
        right: '4%',
        top: '17%',
        bottom: '10%'
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
  await getParkInfo()
  if (basicInfo.value.length > 0) {
    selectedParkName.value = basicInfo.value[0].name
    await getPlotInfo(basicInfo.value[0].id)
    if (plotInfo.value.length > 0) {
      selectedPlotName.value = plotInfo.value[0].name
    }
    await getDeviceDetail(basicInfo.value[0].id, plotInfo.value[0].id)
  }
  await getStandardDo()
  onFilterDate()
}
// 初始化
onMounted(() => init())
</script>
<style lang="scss" scoped>
.buttonSize {
  width: 100%;
  font-size: 16px;
}
</style>