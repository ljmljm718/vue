<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
import { ref } from 'vue'
import {
  initChartStatic,
  generateBaseOptions
} from '../../utils/bigscreenTool/index'
import {
  arrayFormatter,

  industryStatistics,
  baidiParkInfo,
  monitorDeviceByParkId,
  warningRecordInfo,
  getLineChar,
  baibuTypeMonitor,
  parkDetailPage,
  getDeviceForPark,
  featureProduct,
  deviceStatistics,
  deviceByCategoryName,
  deviceInfoById,
  getDeviceStateByParams,
  bigScreenDevicePointBaidi
} from './apis'
import * as echarts from 'echarts'
import { formatTime } from '@/utils/index'

const getBigScreenDevicePointBaidi = async () => {
  const { SensorDevice = [], monitorDevice = [] } = await bigScreenDevicePointBaidi()
}
getBigScreenDevicePointBaidi()

// 获取大屏中间内容
const weatherData = ref<Array<any>>([])
const soilData = ref<Array<any>>([])
const bugData = ref<Array<any>>([])
const getDeviceStateData = async (type) => {
  const res = await getDeviceStateByParams({
    type, // 0气象监测 1土壤监测 2虫情监测
    id: type === 0 ? '1776880507258351616' : type === 1 ? '1776886890255036416' : '1776889212813127680', // 设备ID
  })
  if (type === 0) {
    weatherData.value = res;
  } else if (type === 1) {
    soilData.value = res
  } else {
    bugData.value = res
  }
}
getDeviceStateData(0)
getDeviceStateData(1)
getDeviceStateData(2)

//  产线设备列表
const selectedDeviceInfo = ref<any>({
  "useHour": "",
  "name": "",
  "batch": "",
  "weight": "",
  "id": "",
  "infoList": [],
  "category": ""
})
const handleDeviceSelectorChange = async (e) => {
  const _item = deviceOptions.value.find(item => { return item.id === e.target.value})
  const res = await deviceInfoById({
    id: (_item as any).id
  })
  console.log('打印 ', res);
  
  selectedDeviceInfo.value = res
}
const deviceOptions = ref([])
const getDeviceByCategoryName = async () => {
  const res = await deviceByCategoryName({ categoryName: '产线设备' })
  deviceOptions.value = res
  if (Array.isArray(res) && res.length > 0) handleDeviceSelectorChange({
    target: { value: res[0].id }
  })
}
getDeviceByCategoryName()

// 右一-设备分类在线离线统计
const deviceInfoPart = ref<Array<any>>([])
const deviceInfoTotal = ref(0)
const deviceInfoName = ref('')
const getDeviceInfoBySum = async () => {
  const { list = [], total = 0, name = '物联网设备' } = await deviceStatistics();
  deviceInfoPart.value = list
  deviceInfoTotal.value = total
  deviceInfoName.value = name
}
getDeviceInfoBySum()

// 品牌打造
const featureList = ref<Array<any>>([])
const getFeatureProduct = async () => {
  const res = await featureProduct()
  featureList.value = res;
}
getFeatureProduct()

const envDataList = ref<Array<any>>([])
const envTemp = ref(0)
const soilDataList = ref<Array<any>>([])
const soilTemp = ref(0)
const bugDataList = ref<Array<any>>([])
const bugTemp = ref(0)
// 监测类型 0=气象站 1=土壤墒情 2=虫情监测 (必填)
const getBaibuTypeMonitor = async (type, equipmentCode, plotCode) => {
  const res = await baibuTypeMonitor({
    type: type === 0 ? 3 : type === 1 ? 4 : 2, equipmentCode, plotCode
  })
  
  if (Array.isArray(res) && res.length === 0) return
  if (type === 0) {
    const _tempItem = res.find(item => { return item.monitoringType === '温度'})
    envTemp.value = _tempItem.dataValue
    envDataList.value = arrayFormatter(res)
  }
  if (type === 1) {
    const _tempItem = res.find(item => { return item.monitoringType === '温度'})
    soilTemp.value = _tempItem.dataValue
    const _res = res.filter(item => { return item.monitoringType !== "温度"})
    soilDataList.value = arrayFormatter(_res)
  }
  if (type === 2) {
    const _tempItem = res.find(item => { return item.monitoringType === '杀虫仓温度'})
    bugTemp.value = _tempItem.dataValue
    const _res = res.filter(item => { return item.monitoringType !== "杀虫仓温度"})
    bugDataList.value = arrayFormatter(_res)
  }
}

const productOptions = ref<Array<any>>([])
const handleProdSelectorChange = (item) => {
  const ele = productOptions.value.find(e => e.id === item.target.value)
  baidiIntroInfo.value = ele
  initChart1(item.target.value)
  getMonitorDeviceByParkId(item.target.value)
}
const baidiIntroInfo = ref<any>({
  id: '',
  img: '',
  remark: ''
})
const getBaidiParkInfo = async () => {
  const res = await baidiParkInfo()
  console.log('getBaidiParkInfo', res[0]);
  productOptions.value = res
  if (Array.isArray(res) && res.length > 0) {
    baidiIntroInfo.value = res[0]
    initChart1(res[0].id)
    getMonitorDeviceByParkId(res[0].id)
  }
}
getBaidiParkInfo()


// 获取监控设备 
const monitorDeviceList = ref<Array<any>>([])
const curMonitorPageIndex = ref(1)
const handleArrowClick = (param) => {
  if (!baidiIntroInfo.value.id) return
  curMonitorPageIndex.value += param
  if (curMonitorPageIndex.value < 1) {
    curMonitorPageIndex.value = 1
    return
  }
  console.log('curMonitorPageIndex', curMonitorPageIndex.value);
  
  getMonitorDeviceByParkId(baidiIntroInfo.value.id, curMonitorPageIndex.value)
}
const getMonitorDeviceByParkId = async (belongPark, pageNo = 1) => {
  const { list = [] } = await monitorDeviceByParkId({
    belongPark,
    pageNo,
    pageSize: 3,
    deviceType: '67,68'
  })
  console.log('右下角监控设备列表', list);
  monitorDeviceList.value = list.map(item => ({
    ...item, title: item.deviceName, img: item.imgId,
    online: item.deviceStatus === 'online'
  }))
}

const getIndustryStatistics = async () => {
  const {
    parkCount = '0',
    parkArea = '0',
    factoryCount = '0',
    factoryArea = '0'
  } = await industryStatistics();
  
  industryList.value = [
    {
      title: '基地数量',
      value: parkCount
    }, {
      title: '种植面积',
      value: parkArea + '亩'
    }, {
      title: '厂区数量',
      value: factoryCount
    },
    {
      title: '厂区面积',
      value: factoryArea + '亩'
    },
  ]
}
getIndustryStatistics()

const industryList = ref([{
  title: '基地数量',
  value: '0'
}, {
  title: '种植面积',
  value: '0亩'
}, {
  title: '厂区数量',
  value: '0'
}, {
  title: '厂区面积',
  value: '0亩'
}])

const initChart1 = async (cropCode) => {
  const { xValue = [], measureUnit = [], yValue = [] } = await getLineChar({
    pageNo: 1,
    pageSize: 6,
    cropCode
  })
  console.log('Chart1 Yvalue', yValue);
  
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
        name: measureUnit[0],
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
    })
  )
}

const parkOptions = ref<Array<any>>([])
const getparkDetailPage = async () => {
  const { list = [] } = await parkDetailPage()
  parkOptions.value = list
  const __item = list[0]
  getGetDeviceForPark(72, __item.id)
  getGetDeviceForPark(73, __item.id)
  getGetDeviceForPark(76, __item.id)
}
getparkDetailPage()
const handleParkEnvSelectorChange = (e) => {
  const item = parkOptions.value.find(_item => _item.id === e.target.value)
  console.log('Selector Change', item);
  getGetDeviceForPark(72, item.id)
}
const handleParkSoilSelectorChange = (e) => {
  const item = parkOptions.value.find(_item => _item.id === e.target.value)
  getGetDeviceForPark(73, item.id)
}
const handleParkBugSelectorChange = (e) => {
  const item = parkOptions.value.find(_item => _item.id === e.target.value)
  getGetDeviceForPark(76, item.id)
}

const envOptions = ref<Array<any>>([])
const handleEnvSelectorChange = (e) => {
  const _item = envOptions.value.find(ele => ele.id === e.target.value)
  getBaibuTypeMonitor(0, _item.id, _item.belongPlot)
}
const soilOptions = ref<Array<any>>([])
const handleSoilSelectorChange = (e) => {
  const _item = soilOptions.value.find(ele => ele.id === e.target.value)
  getBaibuTypeMonitor(1, _item.id, _item.belongPlot)
}
const bugOptions = ref<Array<any>>([])
const handleBugSelectorChange = (e) => {
  const _item = bugOptions.value.find(ele => ele.id === e.target.value)
  getBaibuTypeMonitor(2, _item.id, _item.belongPlot)
}

// 1号设备，设备查询 76：虫情、73：土壤、72：环境
const getGetDeviceForPark = async (type, park) => {
  console.log('type', type);
  console.log('park', park);
  
  const res = await getDeviceForPark({
    park, type
  })
  console.log('res', res);
  
  if (type === 72) {
    envOptions.value = res
    if (Array.isArray(res) && res.length > 0) getBaibuTypeMonitor(0, res[0].id, res[0].belongPlot)
  }
  if (type === 73) {
    soilOptions.value = res;
    if (Array.isArray(res) && res.length > 0) getBaibuTypeMonitor(1, res[0].id, res[0].belongPlot)
  }
  if (type === 76) {
    bugOptions.value = res;
    if (Array.isArray(res) && res.length > 0) getBaibuTypeMonitor(2, res[0].id, res[0].belongPlot)
  }
}

// 报警信息
const warningList = ref<Array<any>>([])
const getwarningRecordInfo = async () => {
  const res = await warningRecordInfo();
  console.log('报警信息列表', res);
  warningList.value = res
}
getwarningRecordInfo()
</script>
<template>
  <div class="bigscreen-main-wrapper">
    <div class="header-main-wrapper header-bg">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="header-title-wrapper">巫溪文峰三宝村桂花产业数字化赋能</div>
      <div class="header-right-part-wrapper">
        <BackOrHome />
      </div>
    </div>
    <div class="content-main-wrapper grid-container">
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>产业介绍</div>
            <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
              <select @change="handleProdSelectorChange">
                <option
                  :value="item.id"
                  v-for="item,index in productOptions"
                  :key="index"
                >{{ item.name }}</option>
              </select>
            </div>
          </div>
          <div class="main-item-container flex flex-col">
            <div class="w-full flex justify-center h-[4.6rem]">
              <div v-for="(item, index) in industryList" :key="index"
                class="flex flex-col items-center industry-bg h-full w-[28%] mx-1">
                <div style="font-size: 1.2rem;font-family: 'TitleFont';">{{ item.value }}</div>
                <div style="font-size: .9rem;color: #00d4ff;">{{ item.title }}</div>
              </div>
            </div>
            <div style="height: calc(100% - 19.5rem);padding: 1rem;">
              <img :src="baidiIntroInfo.img" align="left" width="160" style="margin: .3rem 1rem 1rem .3rem;" />
              <span>{{ baidiIntroInfo.remark }}</span>
            </div>
            <div
              class="sub-title-bg h-[2rem]"
              style="margin-left: .7rem;width: calc(100% - .7rem);margin-bottom: .9rem;"
            >长势分析</div>
            <div id="chart1" style="height: 12rem;"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-column: span 2;z-index: 0;">
        <div id="mainMap">
          <div class="tool-tip-wrapper" style="left: 250px;top: 200px;">
            <!-- <div class="rect-bg">
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
            </div> -->
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
            <div class="rect-bg" style="width: 9rem;min-height: 14rem;">
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
            <div class="rect-bg" style="min-height: 13.5rem;">
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
        <div class="absolute flex bottom-[.3rem] pb-3 left-0">
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
          <div class="main-item-title">智慧种植</div>
          <div class="main-item-container flex flex-col">
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-[length:100%_100%] card-width-bg flex justify-between p-3 col-span-2">
                <span>{{ deviceInfoName }}</span>
                <span>
                  <span>总数</span>
                  <span style="color: #00ff96;font-family: 'TitleFont';padding: 0 .3rem;">{{ deviceInfoTotal }}</span>
                  <span>台</span>
                </span>
              </div>
              <div
                class="bg-[length:100%_100%] card-thin-bg p-1 px-3"
                v-for="item in deviceInfoPart"
                :key="item"
                style="font-size: .8rem;"
              >
                <div class="flex justify-between px-2">
                  <span>{{ item.name }}</span>
                  <span>{{ item.equipmentNum }}</span>
                </div>
                <div class="flex justify-between px-2">
                  <span>
                    在线
                    <span class="pl-3" style="color: green;">{{ item.equipmentOnline }}</span>
                  </span>
                  <span>
                    离线
                    <span class="pl-3" style="color: red;">{{ item.equipmentOffline }}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="sub-title-bg w-full h-[2rem] flex justify-between items-center">
              <div>环境数据</div>
              <div class="flex space-x-2">
                <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
                  <select @change="handleParkEnvSelectorChange">
                    <option
                      :value="item.id"
                      v-for="item,index in parkOptions"
                      :key="index"
                    >{{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
                  <select @change="handleEnvSelectorChange">
                    <option
                      :value="item.id"
                      v-for="item,index in envOptions"
                      :key="index"
                    >{{ item.deviceName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-1 p-1">
              <div class="bg-[length:100%_100%] card-bg p-2 flex flex-col items-center justify-center" style="font-size: .8rem;">
                <div class="bg-[length:100%_100%] temp-icon"></div>
                <div style="font-family: 'TitleFont';" class="pt-1">11.14℃</div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
            </div>
            <div class="sub-title-bg w-full h-[2rem] flex justify-between items-center">
              <div>土壤数据</div>
              <div class="flex space-x-2">
                <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
                  <select @change="handleParkSoilSelectorChange">
                    <option
                      :value="item.id"
                      v-for="item,index in parkOptions"
                      :key="index"
                    >{{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
                  <select @change="handleSoilSelectorChange">
                    <option
                      :value="item.id"
                      v-for="item,index in soilOptions"
                      :key="index"
                    >{{ item.deviceName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-1 p-1">
              <div class="bg-[length:100%_100%] card-bg p-2 flex flex-col items-center justify-center" style="font-size: .8rem;">
                <div class="bg-[length:100%_100%] temp-icon"></div>
                <div style="font-family: 'TitleFont';" class="pt-1">11.14℃</div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
            </div>
            <div class="sub-title-bg w-full h-[2rem] flex justify-between items-center">
              <div>虫情监测</div>
              <div class="flex space-x-2">
                <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
                  <select @change="handleParkBugSelectorChange">
                    <option
                      :value="item.id"
                      v-for="item,index in parkOptions"
                      :key="index"
                    >{{ item.name }}
                    </option>
                  </select>
                </div>
                <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
                  <select @change="handleBugSelectorChange">
                    <option
                      :value="item.id"
                      v-for="item,index in bugOptions"
                      :key="index"
                    >{{ item.deviceName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">
            <div>烘干炉实时数据</div>
            <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
              <select @change="handleDeviceSelectorChange">
                <option
                  :value="item.id"
                  v-for="item,index in deviceOptions"
                  :key="index"
                >{{ item.deviceName }}
                </option>
              </select>
            </div>
          </div>
          <div class="main-item-container !grid grid-cols-2 gap-2">
            <div class="col-span-2 flex justify-between p-2 bg-slate-700 items-center">
              <span>当前批次:</span>
              <span>{{ selectedDeviceInfo.batch }}</span>
            </div>
            <div class="col-span-1 flex justify-between p-2 bg-slate-700 items-center">
              <span>品类:</span>
              <span>{{ selectedDeviceInfo.category }}</span>
            </div>
            <div class="col-span-1 flex justify-between p-2 bg-slate-700 items-center">
              <span>重量:</span>
              <span>{{ selectedDeviceInfo.weight }}</span>
            </div>
            <div class="col-span-1 flex justify-between p-2 bg-slate-700 items-center">
              <span>用时:</span>
              <span>{{ selectedDeviceInfo.useHour }}</span>
            </div>
            <div
              class="flex justify-between p-2 bg-slate-700 items-center"
              v-for="(item, index) in selectedDeviceInfo.infoList"
              :key="index"
            >
              <span>{{ item.name  }}:</span>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">品牌打造</div>
          <div
            class="main-item-container !grid"
            style="grid-template-columns: repeat(3, 33%);"
          >
            <div
              v-for="(item, index) in featureList"
              :key="index"
              class="flex flex-col px-1"
            >
              <img :src="item.img" alt="" class="bg-slate-600" style="width: 100%;aspect-ratio: 1.3;object-fit: contain;" />
              <div style="background-color: #252525;">
                <div class="mt-1 flex justify-between px-1">
                  <span>产品名:</span>
                  <span>{{ item.featureName }}</span>
                </div>
                <div class="flex justify-between px-1">
                  <span>订单数量:</span>
                  <span>{{ item.orderNum }}</span>
                </div>
                <div class="flex justify-between px-1">
                  <span>销售额:</span>
                  <span>{{ item.sale + item.saleUnit }}</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">报警信息</div>
          <div class="main-item-container warn-bg">
            <div
              class="flex"
              v-for="(item, index) in warningList"
              :key="index"
              style="color: #fffffff0;padding: .2rem 0;border-bottom: 1px solid #ffffff60;"
            >
              <div :class="['w-[6.5rem]']">{{ item.warnTitle }}</div>
              <div
                style="width: calc(100% - 15.4rem);padding: 0 .4rem;"
                :title="item.warnInfo"
                class="line-clamp-2"
              >{{ item.warnInfo }}</div>
              <div class="w-[8rem] text-center">{{ formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">监控设备</div>
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
              <img :src="item.img" alt="" style="width: 100%;aspect-ratio: 1.3;object-fit: contain;" />
              <div>{{ item.title }}</div>
              <div :style="`color: ${item.online ? '#0fc87c' : '#ff0000'};`">{{ item.online ? '在线' : '离线' }}</div>
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
.header-bg {
  background-image: url(./assets/headerBg.png);
}

.industry-bg {
  background-image: url(./assets/industryBg.png);
  background-size: 100% 100%;
}

.card-width-bg {
  background-image: url(./assets/cardWidthBg.png);
  background-size: 100% 100%;
}

.card-thin-bg {
  background-image: url(./assets/cardThinBg.png);
  background-size: 100% 100%;
}

.card-bg {
  background-image: url(./assets/cardBg.png);
  background-size: 100% 100%;
}

.temp-icon {
  background-image: url(./assets/tempIcon.png);
  background-size: 100% 100%;
  width: 1.6rem;
  height: 1.6rem;
}

.warn-bg {
  background-size: 100% 95% !important;
  background-image: url(./assets/warnBg.png);
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

.sub-title-bg {
  background-image: url(./assets/subTitleBg.png);
  background-size: 100% 100%;
  font-family: 'TitleFont';
  display: flex;
  align-items: center;
  padding-left: .5rem;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: 70% 30%;
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
        padding-left: 2.3rem;
        background-size: 100% 100%;
        font-family: 'TitleFont';
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-image: url(./assets/titleBg.png);
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

#mainMap {
  position: absolute;
  width: 1200px;
  height: 800px;
  z-index: -2;
  left: calc(50% - 600px);
  top: calc(50% - 400px);
  background-image: url(./assets/mainBg.png);
  background-size: 100% 100%;
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
</style>