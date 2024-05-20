<template>
  <div class="w-full">
    <div
      class="grid gap-2"
      :style="`grid-template-columns: repeat(${topList.length}, 1fr);`"
    >
      <el-card
        v-for="item, index in topList"
        :key="index"
        style="background: #ebf3ff;"
      >
        <div class="flex items-center justify-between">
          <div :class="`w-[2rem] h-[2rem] ${item.icon}`" style="background-size: 100% 100%;"></div>
          <div class="flex justify-between flex-col items-end">
            <div style="font-size: 13px;">{{ item.title }}</div>
            <div class="art-font">{{ item.value }}</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="flex justify-between space-x-4 my-4">
      <el-card class="w-[16rem]" style="background: #ebf3ff;">
        <el-tree
          style="max-width: 100%;height:100%;background: #ebf3ff;"
          :data="data"
          :props="defaultProps"
          :default-expand-all="true"
          highlight-current
          node-key="id"
          @current-change="handleTreeChange"
        />
      </el-card>
      <div class="w-full">
        <!-- 左侧 -->
        <div
          class="w-full grid gap-3"
          style="grid-template-columns: 1fr 2fr 1fr;"
        >
          <el-card>
            <template #header>
              <div class="flex font-800">
                <div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>
                <div>巡检进度</div>
              </div>
            </template>
            <div class="relative">
              <div id="chart1"></div>
              <div class="absolute z-10 left-0 top-0 w-full h-full flex flex-col items-center justify-center">
                <div style="font-size: 1.1rem;color:#7696eb;font-weight: bold;">{{ devicePercent }}</div>
                <div style="font-size: .8rem">巡检进度</div>
              </div>
            </div>
            <div
              class="font-700 w-100% h-50px bg-[#ffc653] flex"
              style="align-items: center;justify-content: space-around"
            >
              <div class="flex ml--40px">
                <div
                  class="sanjiao mr-8px"
                  style="align-items: center;"
                ></div> 总设备数
              </div>
              <div>{{deviceTotal}}</div>
            </div>
            <div class="grid grid-cols-2 gap-5px grid-rows-2 h-40% mt-10px ">
              <div class="bg-[#f2f2f2] p-[10px]" v-for="item,index in typeList" :key="index">
                <div class="flex justify-between mb-4px" style="font-weight: bold;">{{item.categoryName}} <span>{{item.totalCount}}</span></div>
                <div class="flex items-center justify-between" style="color: #606266;">
                  <div>已巡检 <span class="ml-10px">{{item.yesCount}}</span></div>
                  <div>未巡检 <span class="ml-10px">{{item.notCount}}</span></div>
                </div>
              </div>
            </div>
          </el-card>
          <!-- 中间 -->
          <div class="flex space-y-2 flex-col">
            <el-card>
              <div class="flex">
                <div class="w-[10rem]">
                  <div style="border:1px solid #c1c1c1;padding: 5px;">
                    <div style="color: #847d78;">预警信息</div>
                    <div class=" mt-20px ml-30px">
                      <div style="color: #847d78;">今日报警</div>
                      <div
                        class="flex font-700 mt-10px"
                        style="font-size: 20px"
                      >{{ todayWarnNum }}
                      </div>
                    </div>
                    <div class=" mt-20px ml-30px">
                      <div style="color: #847d78;">近30天报警</div>
                      <div
                        class="flex font-700 mt-10px"
                        style="font-size: 20px"
                      >{{ thirtyDayWarn }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full">
                  <div id="chart2"></div>
                </div>
              </div>
            </el-card>
            <el-card>
              <template #header>
                <div class="flex font-800">
                  <div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>
                  <div>设备预警</div>
                </div>
              </template>
              <el-table
                :data="pageWarnList"
                :stripe="true"
                :show-overflow-tooltip="true"
                height="12rem"
              >
                <el-table-column
                  label="设备"
                  align="center"
                  prop="deviceName"
                />
                <el-table-column
                  label="预警类型"
                  align="center"
                  prop="warnType"
                />
                <el-table-column
                  label="描述"
                  align="center"
                  prop="warnInfo"
                />
                <el-table-column
                  label="时间"
                  align="center"
                  prop="warnTime"
                >
                  <template #default="scope">
                    <span>{{ new Date().toLocaleString(scope.row.warnTime) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
          <!-- 右侧 -->
          <el-card>
            <template #header>
              <div class="flex font-800">
                <div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>
                <div>实时数据</div>
              </div>
            </template>
            <el-scrollbar height="26rem">
              <div
                class="grid grid-cols-2 gap-2 pr-1"
              >
                <div
                  class="flex items-center justify-between rounded-sm p-2 px-3"
                  style="background-color: #237ced16;border: 1px solid #ffffff40;"
                  v-for="item,index in pageRealList"
                  :key="index"
                >
                  <div class="flex flex-col">
                    <div style="color: #1173ed;font-weight: bold;font-size:13px;">
                      <span>{{ item?.avgData }}</span>
                      <span>{{ item?.dataUnit }}</span>
                    </div>
                    <div class="text-sm">{{ item?.dataType }}</div>
                  </div>
                  <div
                    :class="`w-9 h-9 border icon-${index+1}`"
                    style="background-size: 100% 100%;"
                  >
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-card>
        </div>
        <!-- 底部 -->
        <el-card class="my-3">
          <template #header>
            <div class="flex font-800">
              <div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>
              <div>历史数据</div>
            </div>
          </template>
          <div class="flex py-2">
            <el-select
              @change='handleSelectedMonitorTypeChange'
              v-model="selectedMonitorType"
              placeholder="请选择类型"
              clearable
              class="!w-240px mx-2"
            >
              <el-option
                v-for="item, index in monitorTypeList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-radio-group
              v-model="radio"
              @change="handleRadioChange"
            >
              <el-radio-button
                :label="item.categoryName"
                :value="item.categoryCode"
                v-for="item, index in selectEquipmentType"
                :key="index"
              />
            </el-radio-group>
            <div style="margin: 0 .4rem;">
              <el-date-picker
                v-model="dateData"
                @change="initChart3"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </div>
            <el-button
              type="primary"
              @click="initChart3"
            >查询</el-button>
          </div>
          <div class=" w-[100] h-140px relative">
            <div id="chart3"></div>
          </div>
        </el-card>
        <div class="w-full grid grid-cols-3 gap-3 my-2">
          <el-card>
            <template #header>
              <div class="flex font-800">
                <div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>
                <div>设备类型占比</div>
              </div>
            </template>
            <el-radio-group v-model="deviceTypeRadio" class="my-2" @change="(val) => handleDeviceTypeRadioChange(val)">
              <el-radio-button label="全部" value="全部" />
              <el-radio-button label="视频监控" value="视频监控" />
              <el-radio-button label="监测设备" value="监测设备" />
              <el-radio-button label="控制设备" value="控制设备" />
            </el-radio-group>
            <div id="chartExtra1"></div>
          </el-card>
          <el-card class="col-span-2">
            <template #header>
              <div class="flex font-800">
                <div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>
                <div>数据采集</div>
              </div>
            </template>
            <div class="flex space-x-2 items-center">
              <el-radio-group
                v-model="dataCollectRadio"
                class="my-2"
                @change="(val) => handleDataCollectChange(val, dataCollectPicker)"
              >
                <el-radio-button label="今日" value="全部" />
                <el-radio-button label="本月" value="本月" />
                <el-radio-button label="本年" value="本年" />
              </el-radio-group>
              <div class="w-[6rem]">
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
          </el-card>
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
  pageRealTimeData,
  CountListByNowTime,
  warningRecordInfoByCode,
  environmentView,
  DataByParkAndPlotAndType,
  deviceTypeCount,
  QueryCurrentDateCount,
  getCountSumByCode,
} from './apis'
import { formatTime } from '@/utils';
import { DeviceCategoryApi } from "@/api/agriculture/devicecategory";

//存放采集类型
const selectEquipmentType = ref([])
// 查询采集类型列表
const queryList = async ()=>{
  const dataId = await DeviceCategoryApi.getDeviceCategoryList({ categoryName:'监测设备' })
  selectEquipmentType.value = await DeviceCategoryApi.getDeviceCategoryList({ parentId : dataId[0].id })
  console.log("查询采集类型列表", selectEquipmentType.value);
  if (selectEquipmentType.value.length > 0) {
    radio.value = selectEquipmentType.value[0].categoryName
    handleRadioChange(radio.value)
  }
}
queryList()

const todayWarnNum = ref(0), thirtyDayWarn = ref(0)
const getExtraDataInfo = async () => {
  const { todayCountNum = 0, thirtyDayCountNum = 0 } = await getCountSumByCode({});
  todayWarnNum.value = todayCountNum;
  thirtyDayWarn.value = thirtyDayCountNum
}
getExtraDataInfo()

const deviceTypeRadio = ref('全部')
const deviceTypeDataList = ref<Array<any>>([])
const handleDeviceTypeRadioChange = async (
  param: string | number | boolean = '全部'
) => {
  let _data = []
  if (deviceTypeDataList.value.length === 0) {
	  const res = await deviceTypeCount()
	  if (Array.isArray(res)) deviceTypeDataList.value = res
  }
  if (param === '全部') _data = deviceTypeDataList.value.map(item => ({ value: item.count, name: item.categoryName }))
  if (param === '视频监控') _data = deviceTypeDataList.value.filter(ele => { return ele.typeName === '视频监控'}).map(item => ({ value: item.count, name: item.categoryName }))
  if (param === '监测设备') _data = deviceTypeDataList.value.filter(ele => { return ele.typeName === '监测设备'}).map(item => ({ value: item.count, name: item.categoryName }))
  if (param === '控制设备') _data = deviceTypeDataList.value.filter(ele => { return ele.typeName === '控制设备'}).map(item => ({ value: item.count, name: item.categoryName }))
  console.log('param', param);
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
          radius: ['45%', '65%'],
          center: ['50%', '50%'],
          data: _data,
          label: {
            show: true,
            position: 'center',
            color: '#7c7c7d',
			formatter: (params) => {
				return "类型占比"
			}
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 40,
              fontWeight: 'bold'
            }
          }
        }
      ]
    })
  )
}
onMounted(() => { handleDeviceTypeRadioChange() })

const dataCollectRadio = ref('本年')
const dataCollectPicker = ref<any>([])
const handleDataCollectChange = async (radio: any = '本年', picker: any = []) => {
  const res = await QueryCurrentDateCount({
	  type: picker.length !== 0 ? 'appoint' : radio === '本年' ? 'year' : radio === '本月' ? 'month' : 'day',
	  startDate: formatTime(picker[0], 'yyyy-MM-dd'),
	  endDate: formatTime(picker[1], 'yyyy-MM-dd'),
  });
  console.log("数据采集数据", res)
  const xAxis = res.map(item => (item.collectionDate)), series = res.map(item => (item.totalValue))
  initChartStatic(
    'chartExtra2',
    generateBaseOptions({
      xAxis: {
        data: xAxis,
        interval: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1'
          }
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#20cafd'],
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1'
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
          data: series,
          type: 'line',
          symbol: 'none',
          areaStyle: {
            color: '#20cafd'
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

onMounted(() => { handleDataCollectChange() })

const dateData = ref('')
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
  console.log("arr", arr);
  const data = [
    { name: '已巡检', value: arr[0].yesCount },
    { name: '未巡检', value: arr[0].notCount },
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
          radius: ['45%', '70%'],
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
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#20cafd'],
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1'
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
            color: '#20cafd'
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
const initChart3 = async () => {
  const res = await DeviceCategoryApi.waterQualityDataLineChartA({
    belongPark: belongPark.value,
    belongPlot: belongPlot.value,
    lineChart: selectedMonitorType.value,
    collectionType: radio.value,
    startTime: dateData.value.length === 2 ? formatTime(dateData.value[0], 'yyyy-MM-dd HH:mm:ss') : null,
    endTime: dateData.value.length === 2 ? formatTime(dateData.value[1], 'yyyy-MM-dd HH:mm:ss') : null
  })
  console.log("历史数据", res);
  const xAxis = res.map(item => (item.collectionTime))
  const series = res.map(item => (item.dataValue))
  
  initChartStatic(
    'chart3',
    generateBaseOptions({
      xAxis: {
        data: xAxis,
        interval: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1'
          }
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#20cafd'],
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c1c1c1'
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
            color: '#20cafd'
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
  console.log("test", monitoringType);
  const res = await DeviceCategoryApi.QueryCollectionType({ monitoringType })
  monitorTypeList.value = res
  if (monitorTypeList.value.length > 0) {
    handleSelectedMonitorTypeChange(res[0])
    selectedMonitorType.value = res[0]
  }
}
const handleSelectedMonitorTypeChange = async (item) => {
  initChart3()
}
//获取顶部小卡片数据
const getHomeDeviceCard = () => {
  getEquipmentCountSum().then((res) => {
    console.log(res, '顶部小卡片')
    const _iconMap = {
      "虫情": "top-2",
      "土壤": "top-3",
      "报警": "top-9",
      "气象": "top-5",
      "生长": "top-7",
      "在线": "top-8",
      "视频": "top-4",
      "设备": "top-6",
      "水质": "top-1",
      "离线": 'top-10'
    }
    const getIconFrame = (text:string) => {
      let flag = false, res = ''
      Object.keys(_iconMap).forEach(item => {
        if (text.indexOf(item) !== -1 && !flag) {
          flag = true
          res = _iconMap[item]
        }
      })
      return res
    }

    topList.value = Object.keys(res).map(item => ({
      title: item, value: res[item], icon: getIconFrame(item)
    }))
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
    getHomeCheckLog(res[0].child[0].id)
    getPageRealTimeData(res[1].id, res[1].child[1].id)
    getpageWarningInfo(res[1].id, res[1].child[1].id)
    getEnvironmentView(res[2].id, res[2].child[1].id)
    getDataByParkAndPlotAndType(res[2].id, res[2].child[1].id)
  })
}
getParkTree()
//基地选择
const handleTreeChange = (data, b) => {
  belongPark.value = b.data.id
  belongPlot.value = b.parent.data.id
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
const getHomeCheckLog = (id) => {
  getInspectionProgress({
    belongPlot: id,
    date: formatTime(new Date(), 'yyyy-MM-dd')
  }).then((res) => {
    console.log("及接口2", res);
    const { notCount, yesCount } = res['巡检进度'][0]
    
    typeList.value = res['分组详情']
    deviceTotal.value = res['总设备数'][0].count
    devicePercent.value = (yesCount / (notCount + yesCount) * 100).toFixed(2)

    setTimeout(() => { initChart1(res['巡检进度']) }, 200)
  })
}
//获取实时数据
let pageRealList = ref([])
const getPageRealTimeData = (id, id2) => {
  pageRealTimeData({ parkId: id, plotId: id2 }).then((res) => {
    res.forEach((item) => {
      if (item == null) return
    })
    pageRealList.value = res
  })
}
//获取预警信息
const getpageWarningInfo = (id, id2) => {
  warningRecordInfoByCode({ parkCode: id, plotCode: id2 }).then((res) => {
	console.log("预警信息", res)
    pageWarnList.value = res
  })
}
//获取气象站历史数据
let chartList = ref({})
const getEnvironmentView = (id, id2) => {
  environmentView({ deviceType: deviceType.value, belongPark: id, belongPlot: id2 }).then((res) => {
    console.log(res, '气象站历史数据')
    chartList.value = res
    // initChart3(chartList.value.time, chartList.value.temperature)
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

#chartExtra1, #chartExtra2 {
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
    background-image: url(./assets/s#{$i}.png);
  }
}

@for $i from 1 through 10 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}
</style>