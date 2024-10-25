<script lang="ts" setup>
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../../utils/bigscreenTool/index'
import { ParkInfoApi } from '@/api/agriculture/parkinfo'
import { EquipmentDataApi } from '@/api/agriculture/equipmentdata/index'
import * as echarts from 'echarts'
import icon1 from './assets/icon1.png'
import icon2 from './assets/icon2.png'
import icon3 from './assets/icon3.png'
import icon4 from './assets/icon4.png'
import icon5 from './assets/icon5.png'
import { DeviceCategoryApi } from '@/api/agriculture/devicecategory'
//存放基地信息
const selectBase = ref([])
const getBaseDataList = async () => {
  const selectBaseList = await ParkInfoApi.getParkInfoPage({})
  selectBase.value = selectBaseList.list
}
getBaseDataList()
const soilList = ref([])
// 获取土壤墒情信息
const getSoilInfoList = async (belongPark?: any, belongPlot?: any) => {
  const res = await EquipmentDataApi.environmentalDataHomePageC({ belongPark, belongPlot })
  soilList.value = res
}
getSoilInfoList()
//获取虫情信息
let infestation = ref([])
const getEnvironmentalDataHomePageB = async (belongPark?: any, belongPlot?: any) => {
  infestation.value = await EquipmentDataApi.environmentalDataHomePageB({ belongPark, belongPlot })
}
getEnvironmentalDataHomePageB()
//获取气象信息
let weather = ref([])
const getEnvironmentalDataHomePageA = async (belongPark?: any, belongPlot?: any) => {
  weather.value = await EquipmentDataApi.environmentalDataHomePageA({ belongPark, belongPlot })
}
getEnvironmentalDataHomePageA()
//获取水质信息
const waterQuality = ref([])
const getWaterQualityData = async (belongPark?: any, belongPlot?: any) => {
  waterQuality.value = await EquipmentDataApi.waterQualityData({ belongPark, belongPlot })
}
getWaterQualityData()
const queryParams = ref({
  name: '',
  plot: ''
})
const handleQuery = async () => {
  getSoilInfoList(queryParams.value.name, queryParams.value.plot)
  getEnvironmentalDataHomePageB(queryParams.value.name, queryParams.value.plot)
  getEnvironmentalDataHomePageA(queryParams.value.name, queryParams.value.plot)
  getWaterQualityData(queryParams.value.name, queryParams.value.plot)
}
const resetQuery = () => {
  queryParams.value = { name: '', plot: '' }
  handleQuery()
}
handleQuery()
//时间提取
const DataCollectShows = ref([])
function startTime(time) {
  let data = new Date(time[0])
  let data2 = new Date(time[1])
  let year = data.getFullYear()
  let year2 = data2.getFullYear()
  let month = data.getMonth() + 1 > 9 ? data.getMonth() + 1 : '0' + (data.getMonth() + 1)
  let month2 = data2.getMonth() + 1 > 9 ? data2.getMonth() + 1 : '0' + (data2.getMonth() + 1)
  let day = data.getDate() > 9 ? data.getDate() : '0' + data.getDate()
  let day2 = data2.getDate() > 9 ? data2.getDate() : '0' + data2.getDate()
  DataCollectShows[0] = `${year}-${month}-${day}`
  DataCollectShows[1] = `${year2}-${month2}-${day2}`
}
const queryCollectionShows = () => {
  console.log('DataCollectShows[0]', DataCollectShows[0])
  console.log('DataCollectShows[1]', DataCollectShows[1])
  if(DataCollectShows[1] ===  undefined || DataCollectShows[0] ===  undefined){
    alert('请选择开始时间和结束时间')
    return
  }
  
  initDataCollectChart('appoint', DataCollectShows[0], DataCollectShows[1])
}
// 数据采集量展示
const dataCollectRadio = ref('本年')
const dataCollectDateRange = ref([])
const CollectDate = (e) => {
  if( e == null){
    dataCollectDateRange.value = []
    DataCollectShows[0] = undefined
    DataCollectShows[1] = undefined
    return
  }
  startTime(dataCollectDateRange.value)
}
const dataColleChange = async (val) => {
  if (val == '本年') val = 'year'
  else if (val == '本月') val = 'month'
  else if (val == '今日') val = 'day'
  dataCollectDateRange.value = []
  DataCollectShows[0] = undefined
  DataCollectShows[1] = undefined
  await nextTick();
  initDataCollectChart(val)
}
const el = document.documentElement
const elcolor = ref<string>('')

const updateColor = () => {
  elcolor.value = getComputedStyle(el).getPropertyValue('--el-color-primary')
}
updateColor()

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') updateColor()
  })
})

observer.observe(el, {
  attributes: true,
  attributeFilter: ['style']
})
const initDataCollectChart = async (type, startDate = '', endDate = '') => {
  let res = await EquipmentDataApi.QueryCurrentDateCount(
    type == 'appoint' ? { type, startDate, endDate } : { type }
  )
  console.log('🚀 ~ initDataCollectChart ~ res:', res)
  const chartElement = document.getElementById('dataCollectChart')
  if (!chartElement) {
    console.error('Chart element not found!');
    return;
  }
  const chartInstance = echarts.getInstanceByDom(chartElement)  // 检查该 DOM 元素上是否已经存在 ECharts 实例
  if(chartInstance){
    chartInstance.dispose()  // 销毁已有的图表实例，防止重复初始化
  }
  if (chartElement) {
    if (res.length < 1) {
      chartElement.innerHTML = '<p style=" color:#a1a1aa;">暂无查询数据</p>'
    } else {
       // 清空提示文本，确保重新渲染图表
      chartElement.innerHTML = '';
      initChartStatic(
        'dataCollectChart',
        generateBaseOptions({
          xAxis: {
            data:
              type == 'appoint'
                ? res.map((item) => item.collectionDate)
                : res.map((item) => item.collectionDate).reverse(),
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
          color: [elcolor.value, '#36e1d9'],
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
              name: '数据采集量展示',
              data:
                type == 'appoint'
                  ? res.map((item) => item.totalValue)
                  : res.map((item) => item.totalValue).reverse(),
              type: 'line',
              smooth: true,
              label: {
                show: true, //开启显示
                position: 'right', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#a1a1aa',
                  fontSize: 10
                }
              }
            }
          ],
          grid: {
            left: '0%',
            right: '4%',
            top: '8%',
            bottom: '12%'
          }
        })
      )
    }
  }
}
// 数据展示
const dataShowRadio = ref('气象站')
let seletValue = ref()
let options = ref([])
const dataShowDate = ref('')
const selectEquipmentType = ref([])
//获取气象站等数据
const getTopList = async () => {
  const dataId = await DeviceCategoryApi.getDeviceCategoryList({ categoryName: '监测设备' })
  selectEquipmentType.value = await DeviceCategoryApi.getDeviceCategoryList({
    parentId: dataId[0].id
  })
  dataShowRadio.value = selectEquipmentType.value[0].categoryName
}
getTopList()
// //获取下拉
const dataShowChange = async (val) => {
  let res = await EquipmentDataApi.QueryCollectionType({ monitoringType: val })
  options.value = res
  dataShowRadio.value = val
  seletValue.value = res[0]
  initDataShowChart(dataShowRadio.value, res[0], dataShowDate.value)
}
dataShowChange(dataShowRadio.value)
//下拉选择
const selectCli = (e) => {
  console.log(e, 'value221')
  seletValue.value = e
  initDataShowChart(dataShowRadio.value, seletValue.value, dataShowDate.value)
}
//选择时间
const dataShowDateChange = (val) => {
  let data = new Date(val)
  let year = val.getFullYear()
  let month = data.getMonth() + 1
  let day = data.getDate()
  dataShowDate.value = `${year}-${month}-${day}`
}

const queryChart = () => {
  initDataShowChart(dataShowRadio.value, seletValue.value, dataShowDate.value)
}

//十六进制转rgb
const handleHexToRgb = (hex) => {
  let str = hex.replace('#', '')
  if (str.length % 3) {
    return 'hex格式不正确！'
  }
  //获取截取的字符长度
  let count = str.length / 3
  //根据字符串的长度判断是否需要 进行幂次方
  let power = 6 / str.length
  let r = parseInt('0x' + str.substring(0 * count, 1 * count)) ** power
  let g = parseInt('0x' + str.substring(1 * count, 2 * count)) ** power
  let b = parseInt('0x' + str.substring(2 * count)) ** power

  return `${r}, ${g}, ${b}`
}

const initDataShowChart = async (collectionType = '', monitoringType = '', date = '') => {
  let res = await EquipmentDataApi.getDataPresentation({ collectionType, monitoringType, date })
  let data = res.map((item) => item.dateTime + '时')
  const xAxisData = ref<string[]>([])
  data.forEach((item) => {
    xAxisData.value.push(item.slice(11))
  })

  initChartStatic(
    'dataShowChart',
    generateBaseOptions({
      xAxis: {
        data: xAxisData.value,
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
      color: [elcolor.value, '#36e1d9'],
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
          name: res[0].monitoringType,
          data: res.map((item) => item.dataValue),
          type: 'line',
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
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(' + handleHexToRgb(elcolor.value) + ',0.3)' // 渐变起始颜色
              },
              {
                offset: 1,
                color: 'rgba(' + handleHexToRgb(elcolor.value) + ',0)' // 渐变结束颜色
              }
            ])
          }
        }
      ],
      grid: {
        left: '5%',
        right: '4%',
        top: '8%',
        bottom: '12%'
      }
    })
  )
}

// 数据采集量情况
const collectConditionDateRange = ref([])
const collectConditionData = ref([])
//数据采集量情况时间提取
function getTime(time) {
  let data = new Date(time[0])
  let data2 = new Date(time[1])
  console.log(data.getDate(), 'asdasdq123')
  let year = data.getFullYear()
  let year2 = data2.getFullYear()
  let month = data.getMonth() + 1
  let month2 = data2.getMonth() + 1
  let day = data.getDate()
  let day2 = data2.getDate()
  let hour = data.getHours()
  let hour2 = data2.getHours()
  let minute = data.getMinutes()
  let minute2 = data2.getMinutes()
  let miao = data.getSeconds()
  let miao2 = data2.getSeconds()
  collectConditionData[0] = `${year}-${month}-${day} ${hour}:${minute}:${miao}`
  collectConditionData[1] = `${year2}-${month2}-${day2} ${hour2}:${minute2}:${miao2}`
}
const queryCollection = () => {
  initCollectConditionChart(collectConditionData[0], collectConditionData[1])
}
const collectChange = () => {
  getTime(collectConditionDateRange.value)
}
//数据采集量情况

const initCollectConditionChart = async (dataStartTime = '', dataEndTime = '') => {
  const res = await EquipmentDataApi.getPieDataList({ dataStartTime, dataEndTime })
  const data: Array<any> = []
  res.forEach((item) => {
    data.push({
      name: item.collectionType,
      value: item.countNum
    })
  })
  let dataNum = 0
  for (var i = 0; i < data.length; i++) {
    dataNum += data[i].value
  }
  initChartStatic(
    'collectConditionChart',
    generatePieOptions({
      legend: {
        show: true,
        top: 'center',
        right: '5%',
        left: '57%',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: '#252525'
        },
        formatter: function (name) {
          let tarValue = 0
          let p = 0
          for (let i = 0; i < data.length; i++) {
            if (data[i].name == name) {
              tarValue = data[i].value
              p = ((tarValue / dataNum) * 100).toFixed(2)
            }
          }

          return name + '\r' + tarValue + '\r' + p + '%'
        }
      },

      graphic: {
        type: 'text',
        left: '32.5%',
        //left: '37%',
        top: 'center',
        style: {
          text: dataNum + '\n\n' + '共计',
          // String(this.circularGraph.sum.number).replace(/(\d)(?=(?:\d{6})+$)/g, '$1.'),
          textAlign: 'center',
          fill: '#333',
          width: 30,
          height: 30,
          fontSize: 14,
          fontFamily: 'AlibabaPuHuiTi'
        }
      },

      color: ['#009688', '#1AA2F3', '#FC9F12', '#E31205'],
      series: [
        {
          name: '数据采集量情况',
          type: 'pie',
          radius: ['40%', '62%'],
          center: ['35%', '50%'],
          data: data,

          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'top'
          },
          labelLine: {
            show: false
          }
        }
      ]
    })
  )
}
onMounted(async () => {
  initDataCollectChart('year')
  initCollectConditionChart()
})

const getIconFrame = (text: string) => {
  const _iconMap = {
    温度: 'icon-1',
    磷: 'icon-2',
    氮: 'icon-3',
    钾: 'icon-4',
    PH: 'icon-5',
    湿度: 'icon-6',
    EC: 'icon-7',
    虫害种类: 'icon-8',
    光: 'icon-27',
    风向: 'icon-10',
    亚硝酸: 'icon-15',
    风: 'icon-17',
    雨量: 'icon-12',
    位: 'icon-13',
    盐度: 'icon-14',
    浊: 'icon-16',
    辐射: 'icon-18',
    虫害数量: 'icon-19',
    ORP: 'icon-20',
    TDS: 'icon-21',
    余: 'icon-22',
    溶解氧浓度: 'icon-23',
    溶解氧饱和度: 'icon-24',
    溶氧: 'icon-24',
    电: 'icon-25',
    大气压力: 'icon-26',
    二氧化碳: 'icon-28',
    PM: 'icon-29'
  }
  let res: string = 'icon-11'
  let flag: boolean = false
  Object.keys(_iconMap).forEach((item) => {
    if (text.indexOf(item) !== -1 && !flag) {
      res = _iconMap[item]
      flag = true
    }
  })
  return res
}
const boo = ref(false)
let listPlot = ref([])
watch(
  () => queryParams.value.name,
  async (val) => {
    if (val != null && val != '' && val != undefined) {
      boo.value = true
      listPlot.value = await ParkInfoApi.getParkDetailListByParkId(queryParams.value.name)
    }
  }
)
</script>
<template>
  <div>
    <el-card style="height: 64px" class="mt-1 mb-3 grid gap-3 2xl:grid-cols-12 xl:grid-cols-12">
      <el-form :model="queryParams" label-width="80px" class="flex items-center space-x-3 ss">
        <el-form-item label="选择基地：" class="form-item1">
          <el-select
            v-model="queryParams.name"
            placeholder="请选择"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          >
            <el-option v-for="item in selectBase" :key="item" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :model="queryParams" label="选择地块：" class="flex space-x-3">
          <el-input
            v-if="!boo"
            v-model="queryParams.plot"
            clearable
            placeholder="请选择"
            style="width: 240px"
            @keyup.enter="handleQuery"
          />

          <el-select
            v-if="boo"
            v-model="queryParams.plot"
            placeholder="请选择基地名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          >
            <el-option
              v-for="items in listPlot"
              :key="items"
              :label="items.name"
              :value="items.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="flex space-x-3">
            <el-button @click="handleQuery" type="primary" class="btn1">
              <!-- <Icon icon="ep:search" class="mr-5px"/> -->
              查询
            </el-button>
            <el-button @click="resetQuery" class="btn2">
              <!-- <Icon icon="ep:refresh" class="mr-5px"/> -->
              重置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="grid gap-3 2xl:grid-cols-12 xl:grid-cols-6">
      <!-- 气象站 -->
      <el-card class="col-span-6">
        <div class="flex items-center border-b-0" style="margin-bottom: 16px"> 气象站 </div>
        <!-- </template> -->
        <div class="grid xl:grid-cols-3 2xl:grid-cols-3 gap-1 xl:gap-2 border-t-0">
          <div class="weather_div" v-for="(item, index) in weather" :key="index">
            <div class="flex flex-col items-start justify-center">
              <div class="monitoringType">{{ item.monitoringType }}</div>
              <div class="data">
                <span class="data-value">{{ item.dataValue }}</span>
                <span class="unit">{{ item.yyUnit }}</span>
              </div>
            </div>
            <div class="circle flex justify-center items-center">
              <i alt="" :class="`w-1.4rem h-1.4rem block ${getIconFrame(item.monitoringType)}`"></i>
            </div>
          </div>
          <div
            class="col-span-full h-[10rem] flex flex-col justify-center items-center space-y-2"
            v-if="weather.length === 0"
          >
            <img src="/images/noData.png" class="aspect-1 w-8rem" />
            <div class="text-[.9rem] text-[#999]">暂无气象站数据</div>
          </div>
        </div>
      </el-card>
      <el-card class="col-span-6">
        <div class="flex items-center border-b-0" style="margin-bottom: 16px">土壤墒情</div>
        <div class="grid xl:grid-cols-3 2xl:grid-cols-3 gap-1 xl:gap-2 border-t-0">
          <div class="weather_div" v-for="(item, index) in soilList" :key="index">
            <div class="flex flex-col items-start justify-center">
              <div class="monitoringType">{{ item.monitoringType }}</div>
              <div class="data">
                <span class="data-value">{{ item.dataValue }}</span>
                <span class="unit">{{ item.yyUnit }}</span>
              </div>
            </div>
            <div class="circle flex justify-center items-center">
              <i alt="" :class="`w-1.4rem h-1.4rem block ${getIconFrame(item.monitoringType)}`"></i>
            </div>
          </div>
          <div
            class="col-span-full h-[10rem] flex flex-col justify-center items-center space-y-2"
            v-if="soilList?.length === 0"
          >
            <img src="/images/noData.png" class="aspect-1 w-8rem" />
            <div class="text-[.9rem] text-[#999]">暂无土壤墒情数据</div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 水质监测 -->
    <div class="mt-3 grid gap-3 2xl:grid-cols-12 xl:grid-cols-6">
      <el-card class="col-span-10">
        <div class="flex items-center border-b-0" style="margin-bottom: 16px"> 水质监测 </div>
        <!-- </template> -->
        <div class="grid xl:grid-cols-3 2xl:grid-cols-5 gap-1 xl:gap-2 border-t-0">
          <div class="weather_div" v-for="(item, index) in waterQuality" :key="index">
            <div class="flex flex-col items-start justify-center">
              <div class="monitoringType">{{ item.monitoringType }}</div>
              <div class="data">
                <span class="data-value">{{ item.dataValue }}</span>
                <span class="unit">{{ item.yyUnit }}</span>
              </div>
            </div>
            <div class="circle flex justify-center items-center">
              <i alt="" :class="`w-1.4rem h-1.4rem block ${getIconFrame(item.monitoringType)}`"></i>
            </div>
          </div>
          <div
            class="col-span-full h-[10rem] flex flex-col justify-center items-center space-y-2"
            v-if="waterQuality.length === 0"
          >
            <img src="/images/noData.png" class="aspect-1 w-8rem" />
            <div class="text-[.9rem] text-[#999]">暂无水质监测数据</div>
          </div>
        </div>
      </el-card>
      <!-- 虫情监测 -->
      <el-card class="col-span-2">
        <div class="flex items-center border-b-0" style="margin-bottom: 16px"> 虫情监测 </div>
        <!-- </template> -->
        <div class="grid grid-cols-1 gap-1 xl:gap-2 border-t-0">
          <div class="weather_div" v-for="(item, index) in infestation" :key="index">
            <div class="flex flex-col items-start justify-center">
              <div class="monitoringType">{{ item.monitoringType }}</div>
              <div class="data">
                <span class="data-value">{{ item.dataValue }}</span>
                <span class="unit">{{ item.yyUnit }}</span>
              </div>
            </div>
            <div class="circle flex justify-center items-center">
              <i alt="" :class="`w-1.4rem h-1.4rem block ${getIconFrame(item.monitoringType)}`"></i>
            </div>
          </div>
          <div
            class="col-span-full h-[10rem] flex flex-col justify-center items-center space-y-2"
            v-if="infestation.length === 0"
          >
            <img src="/images/noData.png" class="aspect-1 w-8rem" />
            <div class="text-[.9rem] text-[#999]">暂无虫情监测数据</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="mt-3 grid gap-3 2xl:grid-cols-12 xl:grid-cols-12">
      <el-card class="col-span-12">
        <!-- <template #header> -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span>数据展示</span>
          </div>
        </div>
        <div class="flex items-center space-x-3 mt-4">
          <el-radio-group v-model="dataShowRadio" @change="dataShowChange">
            <el-radio-button
              v-for="(item, index) in selectEquipmentType"
              :key="index"
              :label="item.categoryName"
              :value="item.categoryName"
            />
          </el-radio-group>
          <el-select
            @change="selectCli"
            v-model="seletValue"
            :placeholder="options[0]"
            style="width: 100px"
          >
            <el-option v-for="item in options" :key="item" :label="item" :value="item" />
          </el-select>
          <el-date-picker
            @change="dataShowDateChange"
            v-model="dataShowDate"
            placeholder="请选择时间"
          />
          <el-button type="primary" class="btn1" @click="queryChart"> 查询 </el-button>
        </div>

        <!-- </template> -->
        <div id="dataShowChart"></div>
      </el-card>
    </div>
    <div class="mt-3 grid gap-3 2xl:grid-cols-12 xl:grid-cols-12">
      <el-card class="col-span-4">
        <!-- <template #header> -->
        <div class="flex items-center">
          <div class="flex items-center space-x-2 mb-4">
            <span>数据采集量情况</span>
          </div>
        </div>
        <div class="flex items-center space-x-2" style="width: 350px">
          <el-date-picker
            v-model="collectConditionDateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="collectChange"
          />
          <el-button type="primary" class="btn1" @click="queryCollection"> 查询 </el-button>
        </div>

        <!-- </template> -->
        <div id="collectConditionChart"></div>
      </el-card>
      <el-card class="col-span-8">
        <!-- <template #header> -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span>数据采集量展示</span>
          </div>
        </div>
        <div class="flex items-center space-x-2 mt-3" style="width: 650px">
          <el-radio-group v-model="dataCollectRadio" @change="dataColleChange">
            <el-radio-button label="今日" value="今日" />
            <el-radio-button label="本月" value="本月" />
            <el-radio-button label="本年" value="本年" />
          </el-radio-group>
          <el-date-picker
            @change="CollectDate"
            v-model="dataCollectDateRange"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            class="choosetime"
          />
          <el-button type="primary" class="btn1" @click="queryCollectionShows"> 查询 </el-button>
        </div>
        <!-- </template> -->
        <div id="dataCollectChart"></div>
      </el-card>
    </div>
  </div>
</template>
<style scoped lang="scss">
.choosetime {
  width: 100px;
}
.card1 {
  left: 280px;
  top: 89px;
  width: 84.38%;
  height: 5.52%;
  border-radius: 4px;
  opacity: 1;

  background: #ffffff;
}
.card2 {
  position: relative;
  margin-top: 15px;
  left: 0px;
  top: 0px;
  width: 802px;
  border-bottom: none;
  height: 240px;
  border-radius: 4px;
  opacity: 1;
  grid-column: span 6; /* 跨越6列 */
  background: #ffffff;
}

.form1 {
  left: 298px;
  top: 109px;
  width: 45.05%;
  height: 2.36%;
  opacity: 1;
}
.btn1 {
  /* position: absolute; */
  left: 0px;
  top: 0px;
  width: 80px;
  height: 24px;
  border-radius: 4px;
  opacity: 1;

  /* background: #009688; */
}
.btn2 {
  /* position: absolute; */
  left: 0px;
  top: 0px;
  width: 80px;
  height: 24px;
  border-radius: 4px;
  opacity: 1;

  background: #ffffff;

  box-sizing: border-box;
  border: 1px solid #cccccc;
}

.font_weather {
  position: relative;
  left: 20px;
  top: 12px;
  width: 54px;
  height: 22px;
  opacity: 1;

  font-family: AlibabaPuHuiTi;
  font-size: 18px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0px;

  color: #333333;

  text-shadow: 0px 2px 4px rgba(255, 255, 255, 0.5);
}
.weather_div {
  min-width: 7rem;

  /* flex: 应用 Flexbox 布局模式 */
  display: flex;

  /* px-3: 水平方向内边距为 0.75rem (12px) */
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  /* py-2: 垂直方向内边距为 0.5rem (8px) */
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  /* justify-between: 子元素水平分散对齐 */
  justify-content: space-between;

  /* items-center: 子元素垂直居中对齐 */
  align-items: center;

  /* rounded-lg: 圆角边框为 0.5rem (8px) */
  position: relative;
  border-radius: 4px;
  opacity: 1;
  margin-right: 5px;
  // background: linear-gradient(0deg, rgba(0, 150, 136, 0.08), rgba(0, 150, 136, 0.08)), #ffffff;
}
.weather_div::after {
  position: absolute;
  content: '';
  left: -2px;
  display: block;
  width: 100%;
  height: 100%;
  background: var(--el-color-primary);
  opacity: 0.1;
}
.monitoringType {
  /* position: relative; */
  left: 36px;
  top: 64px;
  width: 80px;
  height: 16px;
  opacity: 1;

  font-family: PingFangSC;
  font-size: 13px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0px;
  margin-bottom: 7px;
  color: #333333;
}
.data {
  left: 36px;
  top: 87px;
  width: 82px;
  height: 24px;
  opacity: 1;

  font-family: PingFangSC;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0px;

  color: #009688;
}
.data-value {
  font-family: PingFangSC;
  font-weight: 400;
  font-size: 18px;
  color: var(--el-color-primary);
  /* 设置 dataValue 的字体大小为 20号 */
}

.unit {
  font-family: PingFangSC;
  font-weight: 400;
  font-size: 12px;
  color: var(--el-color-primary);
}

.circle {
  width: 50px; /* 设置你需要的尺寸 */
  height: 50px;
  background-color: var(--el-color-primary); /* 设置你需要的背景颜色 */
  border-radius: 50%; /* 使div变成圆形 */
}

@for $i from 1 through 29 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% 100%;
  }
}
#dataShowChart,
#dataCollectChart {
  height: 16rem;
}
#collectConditionChart {
  height: 12rem;
  flex-direction: column;
}
@media (max-width: 1722px) {
  .extra-grid-css {
    grid-template-columns: 1fr 1fr !important;
  }
}
.extra-grid-css {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
