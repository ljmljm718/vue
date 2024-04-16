<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
import {ref, onMounted} from 'vue'
import * as echarts from 'echarts'
import {formatTime} from '@/utils/index'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import {
  getParkCountAndAreaSum,
  getCropBaseCount,
  getLineChar,
  cropBasePage,
  getFarmerCount,
  aikouMonitor,
  agriWarningRecord,
  parkInfoPage,
  getPageMonitoring,
  locationPrice,
  selectSum,
  getDeviceState,
  getDeviceStateByParams,
  deviceInfoBySum
} from './apis'
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'

// 右上角
const deviceTotal = ref(0)
const getdeviceInfoBySum = async () => {
  const {list = [], total = 0} = await deviceInfoBySum()
  console.log('deviceInfoBySum', list);
  deviceTotal.value = total
  deviceDataList.value = list.map(item => ({
    ...item,
    title: item.categoryName,
    value: item.total
  }))
}
getdeviceInfoBySum()

// 获取大屏中间内容
const weatherData = ref<Array<any>>([])
const soilData = ref<Array<any>>([])
const bugData = ref<Array<any>>([])
const getDeviceStateData = async (type) => {
  const res = await getDeviceStateByParams({
    type, // 0气象监测 1土壤监测 2虫情监测
    id: type === 0 ? '1774618074997252096' : type === 1 ? '1774647216884097024' : '1774632301782818816', // 设备ID
  })
  if (type === 0) {
    console.log('气象监测 数据', res);
    weatherData.value = res;
  } else if (type === 1) {
    console.log('土壤监测 数据', res);
    soilData.value = res
  } else {
    console.log('虫情监测 数据', res);
    bugData.value = res
  }
}
getDeviceStateData(0)
getDeviceStateData(1)
getDeviceStateData(2)

const getIndustryList = async () => {
  const res = await getParkCountAndAreaSum();
  const {parkCount = 0, areaSum = 0} = res;
  const data = await getFarmerCount();
  const count = await getCropBaseCount()
  industryList.value = [
    {
      title: '基地数量',
      value: parkCount,
      url:'/base/parkinfo'
    }, {
      title: '种植面积',
      value: areaSum + '亩',
      url:'/base/parkinfo'
    }, {
      title: '农户',
      value: data + '万户',
      url:'/base/farmer-info'
    }, {
      title: '品种',
      value: count + '种',
      url:'/crop/crop-base'
    }
  ]
}
getIndustryList()

const industryList = ref([{
  title: '基地数量',
  value: '0',
  url:'/base/parkinfo'
}, {
  title: '种植面积',
  value: '0亩',
  url:'/base/parkinfo'
}, {
  title: '农户',
  value: '0万户',
  url:'/base/farmer-info'
},{
  title: '品种',
  value: '0种',
  url:'/crop/crop-base'
}])

const getTopList = async () => {
  const res = await getDeviceState()
  if (Array.isArray(res) && res.length > 0) {
    const item = res[0]
    topList.value = topList.value.map(ele => {
      const obj = ele;
      for (const key in item) {
        if (key === ele.key) {
          obj.value = item[key] ? item[key] : 0
        }
      }
      return obj;
    })
  }
}
getTopList()
const topList = ref<Array<any>>([
  {
    key: 'total',
    value: 0,
    title: '设备数量',
    deviceType:''
  },
  {
    key: 'online',
    value: 0,
    title: '在线数量',
    deviceType:'online'
  },
  {
    key: 'offline',
    value: 0,
    title: '离线数量',
    deviceType:'offline'
  },
  {
    key: 'fault',
    value: 0,
    title: '故障数量',
    deviceType:'fault'
  },
])


const initChart1 = async (cropCode) => {
  if (!cropCode) return
  const {xValue = [], yValue = []} = await getLineChar({cropCode})

  initChartStatic(
    'chart1',
    generateBaseOptions({
      xAxis: {
        data: xValue,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
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
        name: '米',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#ffffff80', //网格线颜色
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
                {offset: 1, color: '#1bcad600'},
                {offset: 0, color: '#1bcad6'}
              ])
            },
          },
          areaStyle: {normal: {}},
        }
      ],
      grid: {
        left: '8%',
        right: '6%',
        top: '14%',
        bottom: '15%'
      }
    })
  )
}

const initChart2 = async () => {
  const res = await locationPrice()
  console.log('initChart3', res);
  const data: any = []
  for (const key in res) {
    data.push({value: res[key], name: key})
  }
  initChartStatic(
    "chart2",
    generatePieOptions({
      legend: {
        show: true,
        top: "center",
        left: "right",
        bottom: '0',
        orient: 'vertical',
        itemWidth: 12,
        itemHeight: 12,
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
            color: '#fff'
          },
        },
      ],
    })
  );
}

const initChart3 = async () => {
  const res = await selectSum()
  console.log('initChart3', res);
  const xAxisData = res.map(item => (item.salesYear))
  const data1 = res.map(item => (parseFloat(item.sum).toFixed(2)))
  const data2 = res.map(item => (item.salesSum))

  initChartStatic(
    'chart3',
    generateBaseOptions({
      xAxis: {
        data: xAxisData,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
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
            color: '#ffffff80'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#ffffff80', //网格线颜色
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
          name: '采购(万斤)230',
          data: data1,
          barWidth: 30,
          type: 'bar',
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
                {offset: 1, color: '#1bcad600'},
                {offset: 0, color: '#1bcad6'}
              ])
            },
          },
          areaStyle: {normal: {}},
        },
        {
          name: '销售(万元)1300',
          data: data2,
          barWidth: 30,
          type: 'bar',
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
                {offset: 1, color: '#facb5100'},
                {offset: 0, color: '#facb51'}
              ])
            },
          },
          areaStyle: {normal: {}},
        },
      ],
      grid: {
        left: '8%',
        right: '6%',
        top: '13%',
        bottom: '15%'
      }
    })
  )
}
onMounted(() => {
  initChart2()
  initChart3()
})

// 设备数据
const deviceDataList = ref<Array<any>>([
  {
    title: '气象监测',
    value: 0,
    online: 0,
    offline: 0
  },
  {
    title: '设备监控',
    value: 0,
    online: 0,
    offline: 0
  },
  {
    title: '土壤墒情',
    value: 0,
    online: 0,
    offline: 0
  },
  {
    title: '虫情测报灯',
    value: 0,
    online: 0,
    offline: 0
  },
])

const getWeatherMonitorList = async () => {
  const data = await aikouMonitor({type: 0})
  console.log('气象监测', data);
  weatherMonitorList.value = weatherMonitorList.value.map(item => {
    let obj = {...item}
    data.forEach(ele => {
      if (ele.monitoringType == item.title) {
        obj.value = ele.dataValue
        obj.unit = ele.unit
      }
    })
    return obj
  })
}
getWeatherMonitorList()

// 气象监测
const weatherMonitorList = ref([
  {
    title: '温度',
    value: '--',
    unit: '℃'
  },
  {
    title: '湿度',
    value: '--',
    unit: '%'
  },
  {
    title: '风速',
    value: '--',
    unit: 'm/s'
  },
  {
    title: '气压',
    value: '--',
    unit: 'Pa'
  },
  {
    title: '光照',
    value: '--',
    unit: 'Lux'
  },
  {
    title: '雨量',
    value: '--',
    unit: 'mm'
  },
])

// 土壤监测
const getSoilMonitorList = async () => {
  const data = await aikouMonitor({type: 1})
  console.log('土壤监测', data);
  soilMonitorList.value = soilMonitorList.value.map(item => {
    let obj = {...item}
    data.forEach(ele => {
      if (item.title.indexOf(ele.monitoringType.toUpperCase()) !== -1) {
        obj.value = ele.dataValue
        obj.unit = ele.unit
      }
    })
    return obj
  })
}
getSoilMonitorList()
const soilMonitorList = ref([
  {
    icon: 'icon-1',
    title: '土壤温度',
    value: '--',
    unit: '℃'
  },
  {
    icon: 'icon-2',
    title: '土壤湿度',
    value: '--',
    unit: '%'
  },
  {
    icon: 'icon-7',
    title: 'PH值',
    value: '--',
    unit: ''
  },
  {
    icon: 'icon-8',
    title: '土壤EC值',
    value: '--',
    unit: ''
  },
])

// 预警信息
const getPreWarnList = async () => {
  const {list = []} = await agriWarningRecord()
  console.log('getPreWarnList', list);
  preWarnList.value = list.map(item => ({
    ...item,
    warnTime: formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss')
  }))
}
getPreWarnList()
const preWarnList = ref<Array<any>>([])

// 大屏中间的监控设备数据
const mapMonitorData = ref<any>({
  longitude: '--',
  latitude: '--',
  deviceName: '--',
  deviceStatus: '--'
})

// 监控设备
const curBelongPark = ref(null)
const handleArrowClick = (index) => {
  if (index < 0 && monitorDeviceIndex.value <= 1) return
  monitorDeviceIndex.value += index
  getMonitorDeviceList(monitorDeviceIndex.value)
}
const getMonitorDeviceList = async (pageNo = 1, belongPark = curBelongPark.value) => {
  if (!belongPark) return;
  curBelongPark.value = belongPark
  const {list = []} = await getPageMonitoring({
    pageNo, pageSize: 3, deviceType: '40,44', belongPark
  })
  monitorDeviceList.value = list.map(item => ({
    ...item,
    img: item.imgId,
    title: item.deviceName,
    online: item.deviceStatus === 'online'
  }))
  if (Array.isArray(list) && list.length > 0) mapMonitorData.value = list[0]
}
const monitorDeviceIndex = ref(1)
const monitorDeviceList = ref<Array<any>>([])

const getProductionOptions = async () => {
  const {list = []} = await cropBasePage();
  console.log('getProductionOptions', list);
  productOptions.value = list.map(item => ({
    ...item,
    id: item.id,
    name: item.cropName
  }))
  if (list.length > 0) handleCropIdChange(list[0].id)
}
getProductionOptions()
const productOptions = ref<Array<any>>([])
const handleProdSelectorChange = (item) => {
  handleCropIdChange(item.target.value)
}

const handleCropIdChange = (id) => {
  if (!id) return;
  const item = productOptions.value.find(item => {
    return item.id === id
  })
  leftTopText.img = item.imgId
  leftTopText.text = item.cropDesc
  initChart1(id)
}

const leftTopText = reactive({
  img: '',
  text: ''
})

const getBaseOption = async () => {
  const {list = []} = await parkInfoPage()
  console.log('getBaseOption', list);
  baseOptions.value = list
  if (list.length > 0) handleBaseIdChange(list[0].id)
}
getBaseOption()
const baseOptions = ref<Array<any>>([])
const handleBaseSelectorChange = (item) => {
  handleBaseIdChange(item.target.value)
}

const handleBaseIdChange = (id) => {
  if (!id) return
  console.log('获取设备监控信息', id);
  getMonitorDeviceList(monitorDeviceIndex.value, id)
}
</script>
<template>
  <div class="bigscreen-main-wrapper">
    <div class="header-main-wrapper header-bg">
      <div class="header-left-part-wrapper">
        <BigScreenTime/>
      </div>
      <div class="header-title-wrapper">隘口镇山银花产业数字化赋能</div>
      <div class="header-right-part-wrapper">
        <BackOrHome />
      </div>
    </div>
    <div class="content-main-wrapper grid-container">
      <div class="gird-item-wrapper" style="grid-row: span 3;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>产业介绍</div>
            <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
              <select @change="handleProdSelectorChange">
                <option
                  :value="item.id"
                  v-for="item,index in productOptions"
                  :key="index"
                >{{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="main-item-container flex flex-col">
            <div class="w-full flex justify-center h-[4.6rem]">
              <div v-for="(item, index) in industryList" :key="index"
                   class="flex flex-col items-center industry-bg h-full w-[28%] mx-1"
                   @click="$router.push({
                          path:item.url
                  })">
                <div style="font-size: 1.2rem;font-family: 'TitleFont';">{{ item.value }}</div>
                <div style="font-size: .9rem;color: #00d4ff;">{{ item.title }}</div>
              </div>
            </div>
            <div style="height: calc(100% - 4.6rem);padding: 1rem;">
              <img :src="leftTopText.img" align="left" width="160"
                   style="margin: .3rem 1rem 1rem .3rem;"/>
              <span>{{ leftTopText.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper relative" style="grid-row: span 7;z-index: 0;">
        <div id="mainMap">
          <div class="tool-tip-wrapper" style="left: 250px;top: 200px;">
            <div class="rect-bg">
              <div class="rect-title">监控设备</div>
              <div class="flex rect-line mt-2">
                <div class="w-[5rem]">坐标:</div>
                <div>经度: {{ mapMonitorData.longitude }}</div>
              </div>
              <div class="flex rect-line">
                <div class="w-[5rem]"></div>
                <div>纬度: {{ mapMonitorData.latitude }}</div>
              </div>
              <div class="flex rect-line">
                <div class="w-[5rem]">设备名称:</div>
                <div>{{ mapMonitorData.deviceName }}</div>
              </div>
              <div class="flex rect-line">
                <div class="w-[5rem]">状态:</div>
                <div
                  :style="`color: ${mapMonitorData.deviceStatus === 'online' ? '#10bd76' : '#e80909'};`"
                >{{ mapMonitorData.deviceStatus === 'online' ? '在线' : '离线' }}
                </div>
              </div>
            </div>
            <img src="/images/bigscreen9/icon2.png" alt=""/>
          </div>
          <div class="tool-tip-wrapper" style="left: 470px;top: 360px;">
            <div class="rect-bg" style="min-height: 13rem;">
              <div class="rect-title">气象站</div>
              <div class="grid grid-cols-2 gap-1 pt-2 px-1" style="font-size: .9rem;">
                <div
                  class="flex"
                  v-for="(item, index) in weatherData"
                  :key="index"
                >
                  <span>{{ item.monitoringType }}: </span>
                  <span style="padding-left: .1rem;">{{ item.dataValue + item.yyUnit }}</span>
                </div>
                <div>
                  <span>状态:</span>
                  <span
                    class="pl-2"
                    :style="`color: ${(weatherData && weatherData[0] && weatherData[0].status === 'online') ? '#26bd70' : '#ff0000'};`"
                  >{{
                      (weatherData && weatherData[0] && weatherData[0].status === 'online') ? '在线' : '离线'
                    }}</span>
                </div>
              </div>
            </div>
            <img src="/images/bigscreen9/icon1.png" alt=""/>
          </div>
          <div class="tool-tip-wrapper" style="left: 540px;top: 100px;">
            <div class="rect-bg" style="width: 9rem;min-height: 10rem;">
              <div class="rect-title">虫情测报灯</div>
              <div class="grid gap-1 pt-2 px-1" style="font-size: .9rem;">
                <div
                  class="flex"
                  v-for="(item, index) in bugData"
                  :key="index"
                >
                  <span>{{ item.monitoringType }}: </span>
                  <span style="padding-left: .1rem;">{{ item.dataValue + item.yyUnit }}</span>
                </div>
                <div>
                  <span>状态:</span>
                  <span
                    class="pl-2"
                    :style="`color: ${(bugData && bugData[0] && bugData[0].status === 'online') ? '#26bd70' : '#ff0000'};`"
                  >{{
                      (bugData && bugData[0] && bugData[0].status === 'online') ? '在线' : '离线'
                    }}</span>
                </div>
              </div>
            </div>
            <img src="/images/bigscreen9/icon3.png" alt=""/>
          </div>
          <div class="tool-tip-wrapper" style="left: 770px;top: 260px;">
            <div class="rect-bg" style="min-height: 12rem;">
              <div class="rect-title">土壤传感</div>
              <div class="grid grid-cols-2 gap-1 pt-2 px-1" style="font-size: .9rem;">
                <div
                  class="flex"
                  v-for="(item, index) in soilData"
                  :key="index"
                >
                  <span>{{ item.monitoringType }}: </span>
                  <span style="padding-left: .1rem;">{{ item.dataValue + item.yyUnit }}</span>
                </div>
                <div>
                  <span>状态:</span>
                  <span
                    class="pl-2"
                    :style="`color: ${(soilData && soilData[0] && soilData[0].status === 'online') ? '#26bd70' : '#ff0000'};`"
                  >{{
                      (soilData && soilData[0] && soilData[0].status === 'online') ? '在线' : '离线'
                    }}</span>
                </div>
              </div>
            </div>
            <img src="/images/bigscreen9/icon4.png" alt=""/>
          </div>
        </div>
        <div class="w-full absolute top-0 left-0 flex justify-center space-x-6 h-[6rem] pt-4">
          <div v-for="(item, index) in topList" :key="index"
               class="flex flex-col items-center h-full w-[8rem] top-bg"
               @click="$router.push({
                          path:'/device/deviceinfo',
                          query: {
                            deviceStatus: item.deviceType
                          }})">
            <span class="linear-font-type"
                  style="font-size: 1.4rem;font-family: 'TitleFont';"
            >{{ item.value }}</span>
            <span class="linear-font-type"
                  style="font-size: .9rem;font-family: 'TitleFont';">{{ item.title }}</span>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 h-[24vh] flex justify-between"
             style="width: calc(100% - 1rem);padding: 0 .5rem;">
          <div style="width: calc(50% - .5rem);">
            <div class="grid-main-item">
              <div class="main-item-title title-bg"  @click="$router.push({
                          path:'/crop/sales-management'
                  })">
                <div>商品流通分布</div>
              </div>
              <div class="main-item-container flex flex-col">
                <div id="chart2"></div>
              </div>
            </div>
          </div>
          <div style="width: calc(50% - .5rem);">
            <div class="grid-main-item">
              <div class="main-item-title title-bg" @click="$router.push({
                          path:'/crop/harvest-management'
                  })">
                <div>采收销售趋势分析</div>
              </div>
              <div class="main-item-container flex flex-col">
                <div id="chart3"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute flex bottom-[24vh] pb-3 left-0">
          <div class="flex items-center px-2">
            <img src="/images/bigscreen9/icon1.png" alt=""/>
            <span class="pl-1">气象站</span>
          </div>
          <div class="flex items-center px-2">
            <img src="/images/bigscreen9/icon2.png" alt=""/>
            <span class="pl-1">监控设备</span>
          </div>
          <div class="flex items-center px-2">
            <img src="/images/bigscreen9/icon3.png" alt=""/>
            <span class="pl-1">虫情测报灯</span>
          </div>
          <div class="flex items-center px-2">
            <img src="/images/bigscreen9/icon4.png" alt=""/>
            <span class="pl-1">土壤传感</span>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>设备数据</div>
          </div>
          <div class="!flex-row main-item-container">
            <div class="w-[6rem] flex flex-col items-center justify-center"
                 @click="$router.push({
                          path:'/device/deviceinfo',
                          query: {}})">
              <div class="w-[4.5rem] h-[4.5rem] device-icon flex justify-center items-center pb-4"
                   style="font-family: 'TitleFont';font-size: 1.2rem;">{{ deviceTotal }}
              </div>
              <div style="font-size: .9rem;">总数
              </div>
            </div>
            <div class="grid grid-cols-2 grid-rows-2" style="width: calc(100% - 6rem);">
              <div v-for="(item, index) in deviceDataList" :key="index"
                   class="flex flex-col justify-center px-2 device-bg">
                <div class="flex" style="font-family: 'TitleFont';">
                  <span>{{ item.title }}</span>
                  <span style="padding-left: 3rem;">{{ item.value }}</span>
                </div>
                <div class="flex" style="color: #0fbf7a;">
                  <div class="w-[50%]">
                    <span>在线:</span>
                    <span style="padding-left: .6rem;">{{ item.online }}</span>
                  </div>
                  <div class="w-[50%]" style="color: #ff0000;">
                    <span>离线:</span>
                    <span style="padding-left: .6rem;">{{ item.offline }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg"
               @click="$router.push({
                          path:'/deviceData/equipment-data',
                          query: {
                            collectionType: '气象监测'
                          }})">
            <div>气象监测</div>
          </div>
          <div class="main-item-container !grid grid-rows-2 grid-cols-3 gap-2">
            <div v-for="(item, index) in weatherMonitorList" :key="index"
                 class="flex weather-bg items-center px-2 justify-evenly"
                 style="font-size: 0.9rem;">
              <div :class="`icon-${index + 1}`"></div>
              <div>{{ item.title }}</div>
              <div style="color: #68fffe;">
                <span>{{ item.value }}</span>
                <span>{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-row: span 2;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg" @click="$router.push({
                          path:'/deviceData/equipment-data',
                          query: {
                            collectionType: '土壤监测'
                          }})">
            <div>土壤监测</div>
          </div>
          <div class="main-item-container !grid grid-cols-4 gap-2">
            <div v-for="(item, index) in soilMonitorList" :key="index"
                 class="flex weather-bg items-center px-2 justify-evenly"
                 style="font-size: 0.9rem;">
              <div :class="`${item.icon}`"></div>
              <div>
                <div style="color: #68fffe;padding-left: .1rem;">
                  <span>{{ item.value }}</span>
                  <span>{{ item.unit }}</span>
                </div>
                <div>{{ item.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-row: span 2;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg"  @click="$router.push({
                          path:'/crop/grow-record'
                  })">
            <div>生长趋势</div>
          </div>
          <div class="main-item-container flex flex-col">
            <div id="chart1"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-row: span 2;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg" @click="$router.push({
                          path:'/warn/agri-warning-record'})">
            <div>预警信息</div>
          </div>
          <div class="main-item-container flex flex-col warn-bg">
            <div class="prewarn-list-wrapper">
              <div
                v-for="(item, index) in preWarnList"
                :key="index"
                class="warn-item"
                style="border: 1px solid #0b9b7980;padding: .2rem .4rem;"
              >
                <div class="flex justify-between">
                  <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="item.warnType"/>
                  <div style="width: 8rem;">{{ item.warnTime }}</div>
                </div>
                <div style="padding: .2rem;font-size: .9rem;">{{ item.warnInfo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-row: span 2;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg" @click="$router.push({
                          path:'/crop/crop-growth'
                  })">
            <div>农事活动</div>
          </div>
          <div class="main-item-container flex flex-col">
            <div class="agriculture-bg"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg" @click="$router.push({
                          path:'/device/deviceinfo',
                          query:{deviceType:'40,44'}
                  })">
            <div>监控设备</div>
            <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
              <select @change="handleBaseSelectorChange">
                <option
                  :value="item.id"
                  v-for="item,index in baseOptions"
                  :key="index"
                >{{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="main-item-container !grid"
            style="grid-template-columns: 5% repeat(3, 30%) 5%;"
          >
            <div class="left-arrow-bg h-full" @click="handleArrowClick(-1)"></div>
            <div
              v-for="(item, index) in monitorDeviceList"
              :key="index"
              class="flex flex-col px-1"
            >
              <img :src="item.img" alt=""
                   style="width: 100%;aspect-ratio: 1.3;object-fit: contain;"/>
              <div>{{ item.title }}</div>
              <div :style="`color: ${item.online ? '#0fc87c' : '#ff0000'};`">
                {{ item.online ? '在线' : '离线' }}
              </div>
            </div>
            <div
              class="right-arrow-bg h-full"
              v-show="monitorDeviceList.length === 3"
              @click="handleArrowClick(1)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url(../../utils/bigscreenTool/index.scss);

#chart1,
#chart2,
#chart3 {
  width: 100%;
  height: 100%;
}

.header-bg {
  background-image: url(./assets/headerBg.png);
}

.title-bg {
  background-image: url(./assets/titleBg.png);
}

.industry-bg {
  background-image: url(./assets/industryBg.png);
  background-size: 100% 100%;
}

.top-bg {
  background-image: url(./assets/topBg.png);
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100% auto;
}

.device-bg {
  background-image: url(./assets/deviceBg.png);
  background-size: 100% 100%;
}

.device-icon {
  background-image: url(./assets/deviceIcon.png);
  background-size: 100% 100%;
}

.weather-bg {
  background-size: 100% 100%;
  background-image: url(./assets/weatherBg.png);
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

.warn-bg {
  background-size: 100% 95% !important;
  background-image: url(./assets/warnBg.png);
}

.prewarn-list-wrapper {
  padding: .4rem 0rem;
  overflow: auto;
}

.prewarn-list-wrapper::-webkit-scrollbar {
  width: 0px;
}

.warn-item {
  padding: .2rem 0;
}

.agriculture-bg {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-image: url(./assets/agricultureBg.png);
}

#mainMap {
  position: absolute;
  width: 1200px;
  height: 800px;
  z-index: -2;
  left: calc(50% - 600px);
  top: calc(50% - 400px);
  background-image: url(./assets/centerImg.png);
  background-size: 100% 100%;
}

.grid-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 20% 15% 5% 10% 20% 4% 26%;
  color: aliceblue;

  .gird-item-wrapper {
    padding: 0.5rem;
    position: relative;
    z-index: 20;

    .grid-main-item {
      height: 100%;
      display: flex;
      flex-direction: column;

      .main-item-title {
        height: 2.4rem;
        padding: 0 2rem;
        padding-left: 2.6rem;
        background-size: 100% 100%;
        font-family: 'TitleFont';
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .main-item-container {
        height: calc(100% - 2.4rem);
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center bottom;
        padding: 1rem;
        display: flex;
        flex-direction: column;

        .sub-title-wrapper {
          height: 1rem;
          display: flex;
          margin: 0.7rem 0;
          align-items: center;
        }

        .chart-wrapper {
          height: 100%;
        }
      }
    }
  }
}

.tool-tip-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;

  .rect-bg {
    width: 12rem;
    min-height: 11rem;
    background-image: url(./assets/rect.png);
    background-size: 100% 100%;
    padding: 1rem;

    .rect-title {
      width: 100%;
      text-align: center;
      font-family: 'TitleFont';
    }

    .rect-line {
      font-size: .9rem;
    }
  }
}

@for $i from 1 through 8 {
  .icon-#{$i} {
    width: 1rem;
    height: 1rem;
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% 100%;
  }
}
</style>
