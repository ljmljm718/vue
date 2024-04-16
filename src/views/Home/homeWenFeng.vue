<script lang="ts" setup name="HomeWenFeng">
import { ref, onMounted } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '@/utils/bigscreenTool/index'
import {
  homeDataCollection,
  deviceWarnAmount,
  QueryCurrentDateCount,
  QueryMonitorTypeCountRanking,
  orderFinishRate,
  deviceTypeCount,
  getProductionAndStock,
  warnAmountTrend,
  deviceCheckInfo,
  parkWarnDealRate,
} from '@/api/home/wenfeng'
import { formatTime } from '@/utils/index'
window._AMapSecurityConfig = {
    securityJsCode:'289153494763707d55b03878ace1cb08',
}

// 预警处理率
const parkWarnDealList = ref<Array<any>>([])
const getParkWarnDealRate = async () => {
  const res = await parkWarnDealRate()
  parkWarnDealList.value = res
}
getParkWarnDealRate()

const formatTimeRange = (type = '') => {
  if (!type) return []
  if (type === 'week') {
    const nowDate = new Date()
    nowDate.setDate(nowDate.getDate() - nowDate.getDay() + 1)
    return [formatTime(nowDate, 'yyyy-MM-dd'), formatTime(new Date(), 'yyyy-MM-dd')]
  } else if (type === 'month') {
    const nowDate = new Date()
    nowDate.setDate(1)
    return [formatTime(nowDate, 'yyyy-MM-dd'), formatTime(new Date(), 'yyyy-MM-dd')]
  } else {
    const nowDate = new Date()
    nowDate.setDate(1)
    nowDate.setMonth(0)
    return [formatTime(nowDate, 'yyyy-MM-dd'), formatTime(new Date(), 'yyyy-MM-dd')]
  }
}

// 设备巡检概览
const devicePreviewList = ref<Array<any>>([])
const checkSumCount = ref(0)
const checkCompletionRate = ref(0)
const getDeviceCheckInfo = async () => {
  const {
    count = '',
    completionRate = '',
    errorCount = '',
    errorDealCount = '',
    deviceCheckList = []
  } = await deviceCheckInfo()

  checkSumCount.value = count
  checkCompletionRate.value = completionRate
  devicePreviewList.value = [
    {
      title: '巡检设备总量',
      value: count || 0,
      unit: '台/次'
    },
    {
      title: '巡检完成率',
      value: completionRate || 0,
      unit: '%'
    },
    {
      title: '结果异常设备',
      value: errorCount || 0,
      unit: ''
    },
    {
      title: '巡检异常处理',
      value: errorDealCount || 0,
      unit: '台/次'
    },
  ]
  const mapIns = new AMap.Map("chart3", {
    zoom: 16,//级别
    center: [109.24604650765662, 31.41416444104432], //中心点坐标
    // mapStyle: 'amap://styles/blue', //设置地图的显示样式
  });
  mapIns.on('click', (e) => {
    navigator.clipboard.writeText(`[${e.lnglat.R.toString()}, ${e.lnglat.Q.toString()}],`)
  })

  deviceCheckList.forEach(item => {
    const marker = new AMap.Marker({
      position: new AMap.LngLat(item.longitude, item.latitude),
      title: item.deviceName
    });
    mapIns.add(marker);
  })
}
onMounted(() => { getDeviceCheckInfo() })

// 产品制造及库存
const productionTotalVal = ref(0)
const stockTotalVal = ref(0)
const getProductionList = async () => {
  const {
    list = [],
    productionTotal = '',
    stockTotal = ''
  } = await getProductionAndStock();
  console.log('产品制造及库存', list);
  productionTotalVal.value = productionTotal
  stockTotalVal.value = stockTotal
}
getProductionList()

// 设备类型占比
const radioOptions = ref<Array<any>>([])
const initChart5 = async (type = '') => {
  const res = await deviceTypeCount()
  console.log('getDeviceTypeCount', type);
  const data = res.map(item => ({
    name: item.categoryName,
    value: item.count,
    typeName: item.typeName
  })).filter(item => {
    if (!type) return true;
    return item.typeName === type;
  })
  radioOptions.value = [...new Set(res.map(item => (item.typeName)))]
  initChartStatic('chart5', generatePieOptions({
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

// 订单完成率
const orderFinishInfo = ref({
  "finishRate": "0%",
  "loopRate": "0%",
  "withRate": "0%"
})
const getorderFinishRate = async () => {
  const res = await orderFinishRate()
  orderFinishInfo.value = res
}
getorderFinishRate()

// 设备预警数
const deviceWarnInfo = ref({
  "todayDate": "2024-04-11",
  "todayWarn": "0",
  "monthWarn": "0",
  "yearRadio": "-%",
  "monthRadio": "-%"
})
const getDeviceWarnAmount = async () => {
  const res = await deviceWarnAmount()
  deviceWarnInfo.value = res
}
getDeviceWarnAmount()

const dataCollectTotal = ref(0)
const dataCollectDaily = ref(0)
const initChart1 = async () => {
  const { total = 0, daily = 0, x, y} = await homeDataCollection()
  dataCollectTotal.value = total
  dataCollectDaily.value = daily
  initChartStatic('chart1', generateBaseOptions({
    xAxis: {
        data: x,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#898989'
          }
        },
        nameTextStyle: {
          color: '#898989'
        }
      },
      legend: {
        show: false
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#898989'
            }
          },
          axisLabel: {
            color: '#898989'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#89898940', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        }
      ],

      series: [
        {
          name: '',
          data: y,
          type: 'bar'
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '25%'
      }
  }))
}

const initChart3 = async () => {
  initChartStatic('chart3', generateBaseOptions({
    xAxis: {
        data: [1,2,3,4,5,6],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: false
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            color: '#000'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#e1e7f1', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        }
      ],

      series: [
        {
          name: '',
          data: [2,5,33,1,23,4],
          type: 'bar'
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      }
  }))
}

const initChart4 = async (type = 'appoint', startTime = '', endTime = '') => {
  const res = await QueryCurrentDateCount(type === 'appoint' ? {
    type, startTime, endTime
  } : { type })
  console.log('Week', res);
  
  const x = res.map(item => (item.collectionDate))
  const y = res.map(item => (item.totalValue))
  initChartStatic('chart4', generateBaseOptions({
    xAxis: {
      data: x,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#898989'
        }
      },
      nameTextStyle: {
        color: '#898989'
      }
    },
    legend: {
      show: false
    },
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#898989'
          }
        },
        axisLabel: {
          color: '#898989'
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#89898940', //网格线颜色
            width: 1, //网格线的加粗程度
            type: 'dashed' //网格线类型
          }
        },
        splitArea: {
          //网格区域
          show: false //是否显示
        }
      }
    ],

    series: [
      {
        name: '',
        data: y,
        type: 'bar'
      }
    ],
    grid: {
      left: '3%',
      right: '2%',
      top: '15%',
      bottom: '15%'
    }
  }))
}

// 预警处理
const initChart6 = async () => {
  const res = await warnAmountTrend()
  console.log('预警处理', res)
  
  const x = res.map(item => (item.warnDate))
  const y1 = res.map(item => (item.warnAmount))
  const y2 = res.map(item => (item.dealAmount))
  initChartStatic('chart6', generateBaseOptions({
    xAxis: {
        data: x,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#898989'
          }
        },
        nameTextStyle: {
          color: '#898989'
        }
      },
      legend: {
        show: true
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#898989'
            }
          },
          axisLabel: {
            color: '#898989'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#89898940', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        }
      ],

      series: [
        {
          name: '预警数',
          data: y1,
          type: 'line',
          smooth: true
        },
        {
          name: '已处理数',
          data: y2,
          type: 'line',
          smooth: true
        },
      ],
      grid: {
        left: '3%',
        right: '2%',
        top: '15%',
        bottom: '12%'
      }
  }))
}
onMounted(() => {
  initChart1()
  // initChart3()
  initChart4('week')
  initChart5()
  initChart6()
  getQueryMonitorTypeCountRanking('week')
})

// 选中的设备类型
const selectedDeviceType = ref('全部')
const handleRadioChange = (e) => {
  if (e === '全部') {
    initChart5()
  } else {
    initChart5(e)
  }
}

// 数据采集类型
const dataCollectList = ref<Array<any>>([])
const getQueryMonitorTypeCountRanking = async (type = '', startDate = '', endDate = '') => {
  const [sTime, eTime] = formatTimeRange(type)
  const pararms = { startDate: sTime, endDate: eTime }
  const res = await QueryMonitorTypeCountRanking(type === 'appoint' ? {
    startDate, endDate
  } : pararms)
  dataCollectList.value = res
}

// 产品制造及销售
const productSellList = ref<Array<any>>([])
const productSellParams = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})
const getProductSellList = () => {

}

//  数据采集
const dataPickerSelected = ref('本周')
const dataPickerVal = ref<any>([])
const handleRadioChange1 = (e) => {
  dataPickerVal.value = []
  const theMap = {
    '本周': 'week',
    '本月': 'month',
    '本年': 'year'
  }
  initChart4(theMap[e])
  getQueryMonitorTypeCountRanking(theMap[e])
}
const handleDatePickerChange = (e) => {
  dataPickerSelected.value = 'appoint'
  initChart4('appoint', formatTime(e[0], 'yyyy-MM-dd'), formatTime(e[1], 'yyyy-MM-dd'))
  getQueryMonitorTypeCountRanking('appoint', formatTime(e[0], 'yyyy-MM-dd'), formatTime(e[1], 'yyyy-MM-dd'))
}
</script>
<template>
  <div class="w-full">
    <div class="grid grid-cols-4 gap-2">
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>数据采集量</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">{{ dataCollectTotal }}</div>
          <div class="h-[5rem] flex justify-center items-center">
            <div id="chart1"></div>
          </div>
          <el-divider  class="!my-2"/>
          <div class="flex items-center">
            <span>日数据采集量</span>
            <span class="pl-3">{{ dataCollectDaily }}</span>
          </div>
      </el-card>
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>设备报警数</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">{{ deviceWarnInfo.todayWarn }}</div>

          <div class="h-[5rem] flex justify-center items-center">
            <div class="grid grid-cols-2 gap-2 w-full">
              <div class="flex items-center">
                <span>月同比</span>
                <el-icon style="color: green;"><Top /></el-icon>
                <span>{{ deviceWarnInfo.yearRadio }}</span>
              </div>
              <div class="flex items-center">
                <span>月环比</span>
                <el-icon style="color: red;"><Bottom /></el-icon>
                <span>{{ deviceWarnInfo.monthRadio }}</span>
              </div>
            </div>
          </div>
          
          <el-divider  class="!my-2"/>
          <div class="flex items-center">
            <span>本月报警数</span>
            <span class="pl-3">{{ deviceWarnInfo.monthWarn }}</span>
          </div>
      </el-card>
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>巡检总次数</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">{{ checkSumCount }}</div>
          <div class="h-[5rem] flex justify-center items-center">
            <div class="w-full h-4 bg-slate-100">
              <div class="h-full relative" :style="`width: ${checkCompletionRate};background-color: #409eff;`">
                <div
                  :class="['absolute', 'top-[-1.4rem]', parseInt(checkCompletionRate) > 50 ? 'right-0' : 'right-[-3rem]']"
                >{{ checkCompletionRate }}</div>
              </div>
            </div>
          </div>
          
          <el-divider  class="!my-2"/>
          <div class="flex items-center">
            <span>巡检完成率</span>
            <span class="pl-3">{{ checkCompletionRate }}</span>
          </div>
      </el-card>
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>订单完成率</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">{{ orderFinishInfo.finishRate }}</div>
          <div class="h-[5rem] flex justify-center items-center">
            <div class="w-full h-4 bg-slate-100">
              <div class="h-full bg-green-300 relative" :style="`width: ${orderFinishInfo.finishRate};`">
                <div
                  :class="['absolute', 'top-[-1.4rem]', parseInt(orderFinishInfo.finishRate) > 50 ? 'right-0' : 'right-[-3rem]']"
                >{{ orderFinishInfo.finishRate }}</div>
              </div>
            </div>
          </div>
          <el-divider  class="!my-2"/>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center">
              <span>月同比</span>
              <el-icon v-if="orderFinishInfo.withRate.startsWith('+')" style="color: green;"><Top /></el-icon>
              <el-icon v-else style="color: red;"><Bottom /></el-icon>
              <span>{{ orderFinishInfo.withRate }}</span>
            </div>
            <div class="flex items-center">
              <span>月环比</span>
              <el-icon v-if="orderFinishInfo.loopRate.startsWith('+')" style="color: green;"><Top /></el-icon>
              <el-icon v-else style="color: red;"><Bottom /></el-icon>
              <span>{{ orderFinishInfo.loopRate }}</span>
            </div>
          </div>
      </el-card>
    </div>
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center art-font">
          <span>设备巡检预览</span>
        </div>
      </template>
      <div class="relative">
        <div id="chart3"></div>
        <div class="grid grid-cols-4 gap-3 absolute top-1 left-0 z-40 p-3" style="width: calc(100% - 1.5rem);">
          <div
            class="p-3 rounded-sm shadow-lg"
            v-for="(item, index) in devicePreviewList"
            style="background-color: #ffffffa0;color: #252525;"
            :key="index"
          >
            <div>{{ item.title }}</div>
            <div class="flex items-end">
              <span class="art-font" style="font-size: 1.2rem;">{{ item.value }}</span>
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="art-font">数据采集</span>
          <div class="flex space-x-3">
            <el-radio-group v-model="dataPickerSelected" @change="handleRadioChange1">
              <el-radio-button label="本周" value="week" />
              <el-radio-button label="本月" value="month" />
              <el-radio-button label="本年" value="year" />
            </el-radio-group>
            <el-date-picker
              v-model="dataPickerVal"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDatePickerChange"
            />
          </div>
          
        </div>
      </template>
      <div class="flex justify-between h-[14rem]">
        <div class="h-full" style="width: calc(100% - 15.5rem);">
          <div class="art-font h-[1rem]">数据采集量趋势</div>
          <div style="height: calc(100% - 1rem);" id="chart4"></div>
        </div>
        <div class="w-[15rem] h-full">
            <div class="art-font" style="font-size: .9rem;">数据采集类型排名</div>
            <div style="height: calc(100% - 1rem);" class="overflow-auto scroll-bar-hidden">
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
    <div class="grid grid-cols-2 gap-4 mt-4">
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">产品制造及销售</span>
          </div>
        </template>
        <div class="grid grid-cols-2 gap-2 pb-3">
          <div
            class="shadow-md p-2 px-4 rounded-md"
            style="box-shadow: 2px 2px 2px #eeeeee80, -2px -2px 1px #eeeeee40;"
          >
            <div class="art-font">产品制造</div>
            <div class="flex justify-between items-center w-full">
              <div>
                <span>{{ productionTotalVal }}</span>
              </div>
              <div>
                <span>{{ stockTotalVal }}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <el-table :data="productSellList" :show-overflow-tooltip="true" :stripe="true">
            <el-table-column align="center" label="销售排名" prop="mobile" />
            <el-table-column align="center" label="产品名称" prop="telephone" />
            <el-table-column align="center" label="月销量" prop="telephone" />
            <el-table-column align="center" label="月涨幅" prop="telephone" />
          </el-table>
          <Pagination
            v-model:limit="productSellParams.pageSize"
            v-model:page="productSellParams.pageNo"
            :total="productSellParams.total"
            @pagination="getProductSellList"
          />
        </div>
      </el-card>
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">设备类型占比</span>
          </div>
        </template>
        <el-radio-group v-model="selectedDeviceType" @change="handleRadioChange">
          <el-radio-button label="全部" value="全部" />
          <el-radio-button
            v-for="item, index in radioOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-radio-group>
        <div id="chart5"></div>
      </el-card>
    </div>
    <el-card class="mt-4">
      <div class="grid gap-2 mb-2" :style="`grid-template-columns: repeat(${parkWarnDealList.length}, 1fr);`">
        <el-card v-for="item, index in parkWarnDealList" :key="index">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="art-font">{{ item.parkName }}</span>
            </div>
          </template>
          <div class="flex justify-between">
            <span>预警处理率</span>
            <span>{{ item.dealRate }}</span>
          </div>
        </el-card>
      </div>
      <div class="flex justify-between items-center">
        <span class="art-font">预警处理</span>
      </div>
      <div id="chart6"></div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
#chart1, #chart2 {
  width: 100%;
  height: 5rem;
}

#chart3 {
  width: 100%;
  height: 29rem;
}

#chart4 {
  width: 100%;
  height: 12rem;
}

#chart5 {
  width: 100%;
  height: 12rem;
}

#chart6 {
  width: 100%;
  height: 12rem;
}
.scroll-bar-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
