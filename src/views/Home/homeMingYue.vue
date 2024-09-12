<template>
  <div class="w-100%">
    <!-- <div class="grid gap-2" :style="`grid-template-columns: repeat(${topList.length}, 1fr);`"> -->
    <div
      class="grid gap-2"
      :style="`grid-template-columns: repeat(${topList.length}, minmax(50px,auto));`"
    >
      <div
        class="custom-card !p-0"
        style="cursor: pointer"
        v-for="(item, index) in topList"
        :key="index"
        @click="goPage(item)"
      >
        <div
          class="flex items-center justify-between text-[#ffffff] rounded-md p-3 py-2 relative"
          :style="{ backgroundColor: item.color }"
        >
          <div class="flex justify-between flex-col m-2 mb-3 space-y-2">
            <div style="font-size: 13px">{{ item.title }}</div>
            <div class="art-font text-[1.4rem]">{{ item.value }}</div>
          </div>
          <div class="absolute right-3 bottom-3">
            <div :class="`w-[2rem] h-[2rem] ${item.icon}`" style="background-size: 100% 100%"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between space-x-2 my-4">
      <div class="w-[12rem] custom-card">
        <el-tree
          style="max-width: 100%; height: 100%"
          :data="data"
          :props="defaultProps"
          :default-expand-all="true"
          highlight-current
          node-key="id"
          @current-change="handleTreeChange"
        />
      </div>
      <div class="w-full">
        <!-- 左侧 -->
        <div class="w-full grid gap-3" style="grid-template-columns: 1fr 2fr 1fr">
          <div class="custom-card">
            <div class="flex font-600">
              <div>巡检进度</div>
            </div>
            <div class="relative">
              <div class="items-center" id="chart1"></div>
              <div
                class="absolute z-10 left-0 top-0 w-full h-full flex flex-col items-center justify-center"
              >
                <div style="font-size: 1.1rem; color: #009688; font-weight: bold"
                  >{{ devicePercent }}%</div
                >
                <div style="font-size: 0.8rem">巡检进度</div>
              </div>
            </div>
            <div
              class="font-500 w-100% h-2.5rem bg-[#ffA647] flex rounded-md text-[#ffffff] justify-center items-center mb-5"
              >总设备数: {{ deviceTotal }}</div
            >
            <el-scrollbar height="20rem">
              <div
                class="grid xl:grid-cols-1 2xl:grid-cols-2 gap-2 xl:grid-rows-4 2xl:grid-rows-2 xl:h-[600px] 2xl:h-[300px] mt-2"
              >
                <div
                  class="bg-[#f2f2f2] p-3 !rounded-md"
                  v-for="(item, index) in typeList"
                  :key="index"
                >
                  <div class="flex justify-between mb-3 font-medium"
                    >{{ item.categoryName }}
                    <span class="color-[#009688]">{{ item.totalCount }}</span></div
                  >
                  <div
                    class="flex flex-col space-y-2 items-center justify-between font-light color-[#333333]"
                  >
                    <div class="flex bg-[#fff] justify-between p-2 w-90% rounded mb-1"
                      >已巡检 <span class="ml-10px">{{ item.yesCount }}</span></div
                    >
                    <div class="flex bg-[#fff] justify-between p-2 w-90% rounded"
                      >未巡检 <span class="ml-10px">{{ item.notCount }}</span></div
                    >
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <!-- 中间 -->
          <div class="flex space-y-2 flex-col">
            <div class="custom-card">
              <div class="flex font-800">
                <div>预警信息</div>
              </div>

              <div class="flex">
                <div class="w-[10rem]">
                  <div style="padding: 5px">
                    <div class="mt-0.5rem mb-0.5rem bg-#fff1f0 flex flex-col items-center rounded-md ">
                      <div
                        @click="goPageWran(1)"
                        class="font-500 mt-10px text-[#FF3E23]"
                        style="font-size: 20px; cursor: pointer"
                        >{{ todayWarnNum }}
                      </div>
                      <div  class="mb-10px" style="color: #333333; cursor: pointer" @click="goPageWran(1)"
                        >今日报警</div
                      >
                    </div>
                    <div class="mt-0.5rem mb-0.5rem bg-#fff7ee flex flex-col items-center rounded-md">
                      <div
                        @click="goPageWran(2)"
                        class="flex font-500 mt-10px text-[#FF8400]"
                        style="font-size: 20px; cursor: pointer"
                        >{{ thirtyDayWarn }}
                      </div>
                      <div class="mb-10px" style="color: #333333; cursor: pointer" @click="goPageWran(2)"
                        >近30天报警</div
                      >
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <div id="chart2"></div>
                </div>
              </div>
            </div>
            <div class="custom-card grow">
              <div class="flex font-800 mb-3">
                <div>设备预警</div>
              </div>

              <el-table
                :data="pageWarnList"
                :stripe="true"
                :show-overflow-tooltip="true"
                height="18rem"
                :header-cell-style="{
                  backgroundColor: '#fff0ee',
                  color: '#E53820',
                  fontWeight: 'bold'
                }"
              >
                <el-table-column label="设备" align="center" prop="deviceName" />
                <el-table-column label="预警类型" align="center" prop="warnType" />
                <el-table-column label="描述" align="center" prop="warnInfo" />
                <el-table-column label="时间" align="center" prop="warnTime">
                  <template #default="scope">
                    <span>{{ new Date(scope.row.warnTime).toLocaleString() }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- 右侧 -->
          <div class="custom-card">
            <div class="flex font-800 mb-3 items-center">
              <span>实时数据</span>
            </div>

            <el-scrollbar height="500px">
              <div class="grid xl: grid-cols-1 2xl:grid-cols-2 gap-2 pr-1">
                <div
                  class="flex items-center justify-between rounded-sm p-2 px-3"
                  style="background-color: #ebf7f6; border: 1px solid #ffffff40"
                  v-for="(item, index) in pageRealList"
                  :key="index"
                >
                  <div class="flex flex-col">
                    <div class="text-sm mb-0.5">{{ item?.monitoringType }}</div>
                    <div style="color: #009688" class="font-medium">
                      <span>{{ item?.dataValue }}</span>
                      <span style="color: #009688" class="font-normal text-xs">{{
                        item?.yyUnit
                      }}</span>
                    </div>
                  </div>
                  <div :class="`w-9 h-9 border ${item.icon}`" style="background-size: 100% 100%">
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <!-- 底部 -->
        <div class="custom-card my-3">
          <div class="flex font-800 mb-3">
            <div>历史数据</div>
          </div>

          <div class="flex py-1 inline">
            <div class="flex 2xl:w-80% 2xl:inline">
              <el-radio-group v-model="radio" @change="handleRadioChange">
                <el-radio-button
                  :label="item.categoryName"
                  :value="item.categoryCode"
                  v-for="(item, index) in selectEquipmentType"
                  :key="index"
                />
              </el-radio-group>
              <el-select
                @change="handleSelectedMonitorTypeChange"
                v-model="selectedMonitorType"
                clearable
                class="flex xl:w-20px 2xl:!w-120px ml-1 2xl:mt-2"
              >
                <el-option
                  v-for="(item, index) in monitorTypeList"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
            <div class="flex">
              <div style="margin: 0 0.4rem">
                <el-date-picker
                  v-model="dateData"
                  @change="initChart3"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </div>
              <el-button type="primary" @click="initChart3">查询</el-button>
            </div>
          </div>

          <div class="w-[100] h-140px relative">
            <div id="chart3"></div>
          </div>
        </div>

        <div class="w-full grid grid-cols-3 gap-3 my-2">
          <div class="custom-card">
            <div class="flex font-800 mb-3">
              <div>设备类型占比</div>
            </div>

            <el-radio-group
              v-model="deviceTypeRadio"
              class="my-2"
              @change="(val) => handleDeviceTypeRadioChange(val)"
            >
              <div class="flex xl:w-[20rem] xl:h-[5rem] xl:ml--3.5 2xl:ml-0 2xl:w-full flex-wrap ">
                <el-radio-button label="全部" value="全部" />
                <el-radio-button label="视频监控" value="视频监控" />
                <el-radio-button label="监测设备" value="监测设备" />
                <el-radio-button label="控制设备" value="控制设备" />
              </div>
            </el-radio-group>
            <div id="chartExtra1"></div>
          </div>
          <div class="custom-card col-span-2">
            <div class="flex font-800 mb-3">
              <div>数据采集</div>
            </div>

            <div class="flex space-x-2 items-center xl:ml--4 2xl:ml-0">
              <el-radio-group
                v-model="dataCollectRadio"
                class="my-2"
                @change="(val) => handleDataCollectChange(val, dataCollectPicker)"
              >
                <div class="xl:block 2xl:inline">
                  <el-radio-button label="今日" value="全部" />
                  <el-radio-button label="本月" value="本月" />
                  <el-radio-button label="本年" value="本年" />
                </div>
              </el-radio-group>
              <div class="xl:w-[5rem] 2xl:w-[6rem] xl:!mt-0">
                <el-date-picker
                  v-model="dataCollectPicker"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="(val) => handleDataCollectChange(dataCollectRadio, val)"
                />
              </div>
            </div>
            <div id="chartExtra2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import {
  getEquipmentCountSum,
  ParkTree,
  getInspectionProgress,
  waterQualityData2,
  environmentalDataHomePageA,
  environmentalDataHomePageB,
  environmentalDataHomePageC,
  pageRealTimeData,
  CountListByNowTime,
  warningRecordInfoByCode,
  environmentView,
  DataByParkAndPlotAndType,
  deviceTypeCount,
  QueryCurrentDateCount,
  getCountSumByCode
} from './apis'
import { formatTime } from '@/utils'
import { DeviceCategoryApi } from '@/api/agriculture/devicecategory'
import { useRouter } from 'vue-router'
//存放采集类型
const selectEquipmentType = ref([])
// 查询采集类型列表
const queryList = async () => {
  const dataId = await DeviceCategoryApi.getDeviceCategoryList({ categoryName: '监测设备' })
  selectEquipmentType.value = await DeviceCategoryApi.getDeviceCategoryList({
    parentId: dataId[0].id
  })
  console.log('查询采集类型列表', selectEquipmentType.value)
  if (selectEquipmentType.value.length > 0) {
    radio.value = selectEquipmentType.value[0].categoryName
    handleRadioChange(radio.value)
  }
}
queryList()

const todayWarnNum = ref(0),
  thirtyDayWarn = ref(0)
const getExtraDataInfo = async () => {
  const { todayCountNum = 0, thirtyDayCountNum = 0 } = await getCountSumByCode({})
  todayWarnNum.value = todayCountNum
  thirtyDayWarn.value = thirtyDayCountNum
}
getExtraDataInfo()

const deviceTypeRadio = ref('全部')
const deviceTypeDataList = ref<Array<any>>([])
const handleDeviceTypeRadioChange = async (param: string | number | boolean = '全部') => {
  let _data: Array<any> = []
  if (deviceTypeDataList.value.length === 0) {
    const res = await deviceTypeCount({})
    if (Array.isArray(res)) deviceTypeDataList.value = res
  }
  if (param === '全部')
    _data = deviceTypeDataList.value.map((item) => ({ value: item.count, name: item.categoryName }))
  if (param === '视频监控')
    _data = deviceTypeDataList.value
      .filter((ele) => {
        return ele.typeName === '视频监控'
      })
      .map((item) => ({ value: item.count, name: item.categoryName }))
  if (param === '监测设备')
    _data = deviceTypeDataList.value
      .filter((ele) => {
        return ele.typeName === '监测设备'
      })
      .map((item) => ({ value: item.count, name: item.categoryName }))
  if (param === '控制设备')
    _data = deviceTypeDataList.value
      .filter((ele) => {
        return ele.typeName === '控制设备'
      })
      .map((item) => ({ value: item.count, name: item.categoryName }))
  console.log('param', param)
  initChartStatic(
    'chartExtra1',
    generatePieOptions({
      legend: {
        show: true,
        top: 'center',
        left: 'right',
        bottom: '0',
        orient: 'vertical',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: '#7c7c7d'
        }
      },
      color: ['#3381ed'],
      series: [
        {
          type: 'pie',
          radius: ['35%', '55%'],
          center: ['40%', '50%'],
          data: _data,
          label: {
            formatter: '{c|{c}}台 , {per|{d}%}',
            color: '#888',
            rich: {
              c: {
                color: '#888',
                fontSize: 12,
                lineHeight: 33
              },
              per: {
                color: '#888',
                fontSize: 12,
                lineHeight: 33
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          }
        }
      ]
    })
  )
}
onMounted(() => {
  handleDeviceTypeRadioChange()
})
//今日预警跳转
const goPageWran = (val) => {
  router.push(`/internetMonitor/warn/agri-warning-record?time=${val}`)
}
//顶部跳转
let router = useRouter()
const goPage = (obj) => {
  console.log(obj, 'objasd')
  let title = obj.title
  switch (title) {
    case '虫情监测':
      router.push('/internetMonitor/device/deviceView?deviceType=80,88')
      break
    case '土壤监测':
      router.push('/internetMonitor/device/deviceView?deviceType=80,87')
      break
    case '报警设备':
      router.push('/internetMonitor/device/deviceView?deviceStatus=fault')
      break
    case '气象站':
      router.push('/internetMonitor/device/deviceView?deviceType=80,81')
      break
    case '生长记录仪':
      router.push('/internetMonitor/device/deviceView?deviceType=78,82')
      break
    case '在线设备':
      router.push('/internetMonitor/device/deviceView?deviceStatus=online')
      break
    case '视频监控':
      router.push('/internetMonitor/device/deviceView?deviceType=78,79')
      break
    case '设备总数':
      router.push('/internetMonitor/device/deviceView')
      break
    case '水质监测':
      router.push('/internetMonitor/device/deviceView?deviceType=80,86')
      break
    case '离线设备':
      router.push('/internetMonitor/device/deviceView?deviceStatus=offline')
      break
    default:
      break
  }
}
const dataCollectRadio = ref('本年')
const dataCollectPicker = ref<any>([])
const handleDataCollectChange = async (radio: any = '本年', picker: any = []) => {
  let res
  if (picker == null) {
    res = await QueryCurrentDateCount({
      type: picker ? 'appoint' : radio === '本年' ? 'year' : radio === '本月' ? 'month' : 'day',
      startDate: dataCollectPicker.value ? formatTime(picker[0], 'yyyy-MM-dd') : null,
      endDate: dataCollectPicker.value ? formatTime(picker[1], 'yyyy-MM-dd') : null
    })
  } else {
    res = await QueryCurrentDateCount({
      type:
        picker.length !== 0 || picker == null
          ? 'appoint'
          : radio === '本年'
          ? 'year'
          : radio === '本月'
          ? 'month'
          : 'day',
      startDate: dataCollectPicker.value ? formatTime(picker[0], 'yyyy-MM-dd') : null,
      endDate: dataCollectPicker.value ? formatTime(picker[1], 'yyyy-MM-dd') : null
    })
  }
  console.log('数据采集数据', res)
  const xAxis = res.map((item) => item.collectionDate),
    series = res.map((item) => item.totalValue)
  initChartStatic(
    'chartExtra2',
    generateBaseOptions({
      xAxis: {
        data: xAxis.reverse(),
        interval: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1'
          }
        },
        axisTick: {
          show: false // 不显示刻度线
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#009688'],
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1',
            opacity: 0
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#c1c1c1', //网格线颜色
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
          name: '数据采集信息',
          data: series.reverse(),
          type: 'line',
          symbol: 'none',
          smooth: false
        }
      ],
      // grid: {
      //   left: '10%',
      //   right: '3%',
      //   top: '17%',
      //   bottom: '15%'
      // }
      grid:{
        containLabel: true
      }
    })
  )
}

onMounted(() => {
  handleDataCollectChange()
})

const dateData = ref([])
let radio = ref()
let pageWarnList = ref([])
let topList = ref<Array<any>>([])
let data = ref([])
let deviceType = ref('15')
let deviceKind = ref('48')
let belongPark = ref(0) //基地id
let belongPlot = ref(0) // 地块id
let selecteList = ref([
  {
    title: '土壤温度',
    value: '1'
  },
  {
    title: '土壤湿度',
    value: '2'
  },
  {
    title: '光照',
    value: '3'
  },
  {
    title: '大气压',
    value: '4'
  },
  {
    title: '降雨量',
    value: '5'
  },
  {
    title: '风速',
    value: '6'
  }
])
let selecteList2 = ref([])
const initChart1 = (arr = []) => {
  console.log('arr', arr)
  const data = [
    { name: '已巡检', value: arr[0].yesCount },
    { name: '未巡检', value: arr[0].notCount }
  ]
  initChartStatic(
    'chart1',
    generatePieOptions({
      legend: {
        show: false,
        top: 'center',
        left: 'right',
        bottom: '0',
        orient: 'vertical',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: '#a1a1aa'
        }
      },
      color: ['#3381ed'],
      series: [
        {
          type: 'pie',
          radius: ['55%', '70%'],
          center: ['50%', '50%'],
          data,
          label: {
            show: false,
            position: 'center',
            color: '#000'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#009688' }, // 渐变起始色
                { offset: 1, color: '#ffffff' } // 渐变结束色
              ]
            }
          }
        }
      ]
    })
  )
}
const initChart2 = async () => {
  let xAisData = []
  let yAisData = []
  let res = await CountListByNowTime({ size: '10' })
  xAisData = res.xList
  yAisData = res.yList
  initChartStatic(
    'chart2',
    generateBaseOptions({
      xAxis: {
        data: xAisData,
        interval: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1'
          }
        },
        axisTick: {
          show: false // 不显示刻度线
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#FE6852'],
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1',
            opacity: 0
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#c1c1c1', //网格线颜色
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
          name: '预警信息',
          data: yAisData,
          type: 'line',
          symbol: 'none',
          areaStyle: {
            color: 'rgba(254, 104, 82, 0.2)'
          }
        }
      ],
      grid: {
        left: '10%',
        right: '3%',
        top: '17%',
        bottom: '15%'
      }
    })
  )
}

const defaultProps = {
  children: 'child',
  label: 'name'
}
onMounted(() => {
  initChart2()
})

const test = ref()
const test2 = ref()
const monitorTypeList = ref([])
const selectedMonitorType = ref()

const handleRadioChange = async (monitoringType) => {
  console.log(monitoringType, 'monitoringTypemonitoringTypemonitoringType')
  const res = await DeviceCategoryApi.QueryCollectionType({ monitoringType })
  monitorTypeList.value = res
  if (monitorTypeList.value.length > 0) {
    handleSelectedMonitorTypeChange(res[0])
    selectedMonitorType.value = res[0]
    initChart3()
  }
}
const initChart3 = async () => {
  console.log(dateData.value, 'length')
  const res = await DeviceCategoryApi.waterQualityDataLineChartA({
    // belongPark: belongPark.value,
    // belongPlot: belongPlot.value,
    lineChart: selectedMonitorType.value,
    collectionType: radio.value,
    startTime: dateData.value ? formatTime(dateData.value[0], 'yyyy-MM-dd HH:mm:ss') : null,
    endTime: dateData.value ? formatTime(dateData.value[1], 'yyyy-MM-dd HH:mm:ss') : null
  })
  console.log('历史数据', res)
  const xAxis = res.map((item) => item.collectionTime)
  const series = res.map((item) => item.dataValue)

  initChartStatic(
    'chart3',
    generateBaseOptions({
      xAxis: {
        data: xAxis,
        interval: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dbe4f0'
          }
        },
        axisTick: {
          show: false // 不显示刻度线
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#009688'],
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1',
            opacity: 0
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#c1c1c1', //网格线颜色
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
          name: '数据详情',
          data: series,
          type: 'line',
          symbol: 'none',
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
                  color: '#ceebe8' // 颜色的起点
                },
                {
                  offset: 1,
                  color: 'rgba(0, 150, 136, 0)' // 透明的终点
                }
              ]
            }
          }
        }
      ],
      grid: {
        left: '5%',
        right: '3%',
        top: '17%',
        bottom: '15%'
      }
    })
  )
}
const handleSelectedMonitorTypeChange = async (item) => {
  selectedMonitorType.value = item
  initChart3()
}
//获取顶部小卡片数据
const getHomeDeviceCard = () => {
  getEquipmentCountSum().then((res) => {
    console.log(res, '顶部小卡片')
    const _iconMap = {
      // 虫情: 'top-2',
      // 土壤: 'top-3',
      // 报警: 'top-9',
      // 气象: 'top-5',
      // 生长: 'top-7',
      // 在线: 'top-8',
      // 视频: 'top-4',
      // 设备: 'top-6',
      // 水质: 'top-1',
      // 离线: 'top-10',
      虫情: { icon: 'top-2', color: '#ffa647' },
      土壤: { icon: 'top-3', color: 'red' },
      报警: { icon: 'top-9', color: '#ff6f60' },
      气象: { icon: 'top-5', color: '#528cf7' },
      生长: { icon: 'top-7', color: '#10c6d4' },
      在线: { icon: 'top-8', color: '#56c96b' },
      视频: { icon: 'top-4', color: '#538ef7' },
      设备总数: { icon: 'top-6', color: '#4d87f6' },
      水质: { icon: 'top-1', color: '#8e6efd' },
      离线设备: { icon: 'top-10', color: '#fe7062' }
    }
    const getIconFrame = (text: string) => {
      let flag = false,
        res = { icon: '', color: '' }
      Object.keys(_iconMap).forEach((item) => {
        if (text.indexOf(item) !== -1 && !flag) {
          flag = true
          res = _iconMap[item]
        }
      })
      return res
    }

    topList.value = Object.keys(res).map((item) => {
      const { icon, color } = getIconFrame(item)
      return {
        title: item,
        value: res[item],
        icon: icon,
        color: color
      }
    })
  })
}
getHomeDeviceCard()
//左侧基地树
const getParkTree = () => {
  ParkTree().then((res) => {
    data.value = res
    console.log(res, 'dd')
    belongPark.value = res[2].id
    belongPlot.value = res[2].child[1].id
    // getPageRealTimeData(res[1].id, res[1].child[1].id)
    getEnvironmentView(res[2].id, res[2].child[1].id)
    getDataByParkAndPlotAndType(res[2].id, res[2].child[1].id)
  })
}
getParkTree()
//基地选择
const handleTreeChange = (data, b) => {
  if (!b.parent.data.id) return true
  belongPark.value = b.parent.data.id
  belongPlot.value = b.data.id
  getHomeCheckLog(data.id)
  getPageRealTimeData(b.parent.data.id, b.data.id)
  getpageWarningInfo(b.parent.data.id, b.data.id)
  getEnvironmentView(b.parent.data.id, b.data.id)
  getDataByParkAndPlotAndType(b.parent.data.id, b.data.id)
}
//获取巡检进度
let typeList = ref([])
let deviceTotal = ref(0)
let devicePercent = ref(0)
const getHomeCheckLog = (id = '') => {
  getInspectionProgress({
    belongPlot: id,
    date: formatTime(new Date(), 'yyyy-MM-dd')
  }).then((res) => {
    console.log('及接口2', res)
    const { notCount, yesCount } = res['巡检进度'][0]

    typeList.value = res['分组详情']
    deviceTotal.value = res['总设备数'][0].count
    devicePercent.value = ((yesCount / (notCount + yesCount)) * 100).toFixed(2)

    setTimeout(() => {
      initChart1(res['巡检进度'])
    }, 200)
  })
}
getHomeCheckLog()
//获取实时数据
const getIconClass = (text: string = '') => {
  const iconMap = {
    温度: '1',
    湿度: '2',
    PH: '3',
    EC: '4',
    光: '5',
    雨: '6',
    二氧化碳: '7',
    气压: '8',
    虫: '9',
    类: '10',
    default: '1',
    // 磷: '11',
    氮: '12',
    // 钾: '13',
    // 深度: '14',
    // 种植面积: '18',
    // 农户: '17',
    // 大棚: '15',
    // 盆栽: '16',
    // 施肥: '19',
    // 虫害: '20',
    // 浇水: '21',
    // 除草: '22',
    // 打药: '23',
    // 采收: '24',
    风: '25',
    电导率: '26',
    盐度: '27',
    // 水位: '28',
    // 氧: '29',
    // 辐射: '30',
    浊度: '31',
    // 氯: '32',
    溶解氧浓度: '33',
    溶解氧饱和度: '34',
    ORP: '35',
    TDS: '36',
    余氯浓度: '37'
  }
  const iconLabel = Object.keys(iconMap)
  let key = 'default'
  iconLabel.forEach((item) => {
    if (text.indexOf(item) !== -1) key = item
  })
  return iconMap[key]
}
let pageRealList = ref<Array<any>>([])
const getPageRealTimeData = async (belongPark = '', belongPlot = '') => {
  const res = await waterQualityData2({ belongPark, belongPlot })
  const res2 = await environmentalDataHomePageA({ belongPark, belongPlot })
  const res3 = await environmentalDataHomePageB({ belongPark, belongPlot })
  const res4 = await environmentalDataHomePageC({ belongPark, belongPlot })
  let data = [...res, ...res2, ...res3, ...res4]
  if (!Array.isArray(data)) return
  pageRealList.value = data
    .filter((item) => {
      if (!item.monitoringType || !item.dataValue) return false
      return true
    })
    .map((ele) => ({ ...ele, icon: 'my-icon-' + getIconClass(ele.monitoringType) }))
  console.log(pageRealList.value, 'pageRealList.valuepageRealList.value')
}
getPageRealTimeData()
//获取预警信息
const getpageWarningInfo = (id = '', id2 = '') => {
  warningRecordInfoByCode({ parkCode: id, plotCode: id2 }).then((res) => {
    console.log('预警信息', res)
    pageWarnList.value = res
  })
}
getpageWarningInfo()
//获取气象站历史数据
let chartList = ref({})
const getEnvironmentView = (id, id2) => {
  environmentView({ deviceType: deviceType.value, belongPark: id, belongPlot: id2 }).then((res) => {
    console.log(res, '气象站历史数据')
    chartList.value = res
  })
}
//获取土壤墒情和虫情监测
const getDataByParkAndPlotAndType = (id, id2) => {
  DataByParkAndPlotAndType({ deviceKind, belongPark: id, belongPlot: id2 }).then((res) => {
    console.log(res, '土壤墒情和虫情监测')
    selecteList2.value = res
    setTimeout(() => {
      // initChart4(res[0].list)
    }, 200)
  })
}
//下拉选择
const selecteCli = (e) => {
  console.log(e, '下拉选择')
  test.value = e
}
//下拉选择2
const selecteCli2 = (e) => {
  test2.vlaue = e
  // initChart4(selecteList2.value[e].list)
}
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);

.top-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(./assets/topBg.png);
  background-size: 100% 100%;
  .top-icon {
    width: 1.5rem;
    height: 1.5rem;
    background-size: 100% 100%;
  }
}
.top-asd {
  border: 1pxs;
  width: 120px;
  height: 222px;
}
.sanjiao {
  width: 0;
  height: 0;
  border-top: 8px solid transparent; /* 顶部边框 */
  border-bottom: 8px solid transparent; /* 底部边框 */
  border-left: 8px solid #fff; /* 左边边框，即三角形的可见部分 */
}
.dayWarn-1 {
  width: 0;
  height: 0;
  border-right: 8px solid transparent; /* 顶部边框 */
  border-bottom: 8px solid #00d531; /* 底部边框 */
  border-left: 8px solid transparent; /* 左边边框，即三角形的可见部分 */
}
.dayWarn-2 {
  width: 0;
  height: 0;
  border-right: 8px solid transparent; /* 顶部边框 */
  border-top: 8px solid red; /* 底部边框 */
  border-left: 8px solid transparent; /* 左边边框，即三角形的可见部分 */
}
#chart1 {
  width: 100%;
  height: 200px;
}
#chart2 {
  width: 100%;
  height: 100%;
}
#chart3 {
  width: 100%;
  height: 100%;
}
#chart4 {
  width: 100%;
  height: 100%;
}

#chartExtra1,
#chartExtra2 {
  height: 12rem;
}
select {
  position: absolute;
  z-index: 999;
  top: -40px;
  right: 200px;
  width: 150px;
  height: 30px;
}
@for $i from 1 through 10 {
  .top-#{$i} {
    background-image: url(./assets/b#{$i}.png);
  }
}

// .top-background {

// }
@for $i from 1 through 10 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}

@for $i from 1 through 37 {
  .my-icon-#{$i} {
    background-image: url(./assets//mingyue1/icon#{$i}.png);
    background-size: 100% auto;
  }
}
.custom-card {
  background-color: white;
  border-radius: 0.2rem;
  padding: 1rem;
  box-shadow: var(--el-box-shadow-light);
}

@media screen and (max-width: 1279px) {
  :deep(.el-select) {
    width: 100px;
  }
}
// @media screen and (max-width:1279px){
//   ::v-deep .el-radio-group{
//     padding-bottom:4px
//   }
// }
// @media screen and (max-width:1280px){
//   ::v-deep input.el-range-input {
//     width:100px
//   }
// }



:deep(.el-tree-node__expand-icon) {
  color: #009688;
  font-size: 1.2rem;
  left: 0;
}

:deep(.el-tree-node__expand-icon) {
  padding-left: 0;
  padding-right: 0;
}

:deep(.el-tree-node__content) {
  height: 2.2rem;
  padding-right: 5px
} 

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
            background: #ECF4FF !important;
            border-right:  solid  #009688;
            height: 2.2rem;
            background-color: #e5f4f3 !important;
            z-index: -1;
            span{
                color: #009688;
                font-weight: 16px}}
:deep(.el-tree-node__content) {
  color: #333333;
}            

:deep(.el-tree-node__content:hover) {
  background-color: #e5f4f3 !important;
}    
:deep(.el-tree-node:focus>.el-tree-node__content) {
  background-color: #e5f4f3 !important;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: #e5f4f3 !important;
}
</style>
