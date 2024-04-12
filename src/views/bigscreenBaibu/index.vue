<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import { ref } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import {
  arrayFormatter,

  industryStatistics,
  baidiParkInfo,
  monitorDeviceByParkId,
  // warningRecordInfo,
  getLineChar,
  // baibuTypeMonitor,

  getParkCountAndAreaSum,
  getCropBaseCount,
  getCropBaseList,
  managementPage,
  deviceInfoBySumType,
  locationPrice,
  deviceInfoBySum,
  getDeviceForPark,
  parkDetailPage,
  baibuTypeMonitor,
  parkInfoPage,
  warningRecordInfo,
  subDevicePage,
  subDeviceUpdate
} from './apis'
import * as echarts from 'echarts'
import { formatTime } from '@/utils/index'
import { ElMessage } from 'element-plus'

// 状态切换
const handleSwitchChange = async (e, ele) => {
  const res = await subDeviceUpdate({
    id: ele.id,
    swithState: e ? '0' : '1'
  }).catch(() => {
    ElMessage.error('操作失败')
  })
  if (res) ElMessage.success('操作成功')
  if (res) ElMessage.error('操作失败')
}

// 获取子设备
const subDeviceList = ref<Array<any>>([])
const getsubDevicePage = async () => {
  const { list = [] } = await subDevicePage()
  console.log('subDevicePage', list);
  subDeviceList.value = arrayFormatter(list.map(item => ({ ...item, button: item.swithState === '0' })))
}
getsubDevicePage()

// 右下角选择
const monitorOptions = ref<Array<any>>([])
const handleMonitorSelectorChange = (e) => {
  console.log('MonitorSelector', e.target.value);
}
const getMonitorOptions = async () => {
  const { list = [] } = await parkInfoPage();
  console.log('getMonitorOptions', list);
  monitorOptions.value = list
}
getMonitorOptions()

// [右二、右三、右四]环境/土壤/虫情监测数据查询
const envDataList = ref<Array<any>>([])
const envTemp = ref(0)
const soilDataList = ref<Array<any>>([])
const soilTemp = ref(0)
const bugDataList = ref<Array<any>>([])
const bugTemp = ref(0)
// 监测类型 0=气象站 1=土壤墒情 2=虫情监测 (必填)
const getBaibuTypeMonitor = async (type, equipmentCode, plotCode) => {
  const res = await baibuTypeMonitor({
    type, equipmentCode, plotCode
  })
  console.log('环境/土壤/虫情监测数据查询', res);
  
  if (Array.isArray(res) && res.length === 0) return
  if (type === 0) {
    const _tempItem = res.find(item => { return item.monitoringType === '温度'})
    envTemp.value = _tempItem.dataValue
    envDataList.value = arrayFormatter(res)
    console.log('气象站', envDataList.value);
  }
  if (type === 1) {
    const _tempItem = res.find(item => { return item.monitoringType === '温度'})
    soilTemp.value = _tempItem.dataValue
    const _res = res.filter(item => { return item.monitoringType !== "温度"})
    soilDataList.value = arrayFormatter(_res)
    console.log('土壤');
  }
  if (type === 2) {
    const _tempItem = res.find(item => { return item.monitoringType === '杀虫仓温度'})
    bugTemp.value = _tempItem.dataValue
    const _res = res.filter(item => { return item.monitoringType !== "杀虫仓温度"})
    bugDataList.value = arrayFormatter(_res)
    console.log('虫情', res);
  }
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
  console.log("item", item);
  getGetDeviceForPark(72, item.id)
}
const handleParkSoilSelectorChange = (e) => {
  const item = parkOptions.value.find(_item => _item.id === e.target.value)
  console.log("item", item);
  getGetDeviceForPark(73, item.id)
}
const handleParkBugSelectorChange = (e) => {
  const item = parkOptions.value.find(_item => _item.id === e.target.value)
  console.log("item", item);
  getGetDeviceForPark(76, item.id)
}


const envOptions = ref<Array<any>>([])
const handleEnvSelectorChange = (e) => {
  const _item = envOptions.value.find(ele => ele.id === e.target.value)
  console.log('EnvSelectorChange', _item);
}
const soilOptions = ref<Array<any>>([])
const handleSoilSelectorChange = (e) => {
  const _item = soilOptions.value.find(ele => ele.id === e.target.value)
  console.log('SoilSelectorChange', _item);
}
const bugOptions = ref<Array<any>>([])
const handleBugSelectorChange = (e) => {
  const _item = bugOptions.value.find(ele => ele.id === e.target.value)
  console.log('BugSelectorChange', _item);
}
// 1号设备，设备查询 76：虫情、73：土壤、72：环境
const getGetDeviceForPark = async (type, park) => {
  const res = await getDeviceForPark({
    park, type
  })
  console.log('getGetDeviceForPark', res);
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

// 右一-设备分类在线离线统计
const deviceInfoPart = ref<Array<any>>([])
const deviceInfoTotal = ref(0)
const getDeviceInfoBySum = async () => {
  const { list = [], total = 0 } = await deviceInfoBySum();
  deviceInfoPart.value = list
  deviceInfoTotal.value = total
}
getDeviceInfoBySum()

// 商品流通
const initChart2 = async () => {
  const res = await locationPrice();
  const data:Array<any> = []
  for (const key in res) {
    data.push({ value: res[key], name: key })
  }
  initChartStatic('chart2', generatePieOptions({
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
  }))
}

onMounted(() => { initChart2() })

// 工程设备
const deviceInfo = ref<Array<any>>([])
const getdeviceInfoBySumType = async () => {
  const { list = [] } = await deviceInfoBySumType();
  console.log('getdeviceInfoBySumType', list);
  if (Array.isArray(list) && list.length > 0) deviceInfo.value = list.splice(0, 5)
}
getdeviceInfoBySumType()

// [大屏]烘干工艺
const getManagementPage = async () => {
  const { list = [] } = await managementPage({
    pageReqVO: `{ "pageNo": ${1}, "pageSize": ${10} }`
  })
  console.log('managementPage list', list);
}
getManagementPage()

const productOptions = ref<Array<any>>([])
const handleProdSelectorChange = (item) => {
  const ele = productOptions.value.find(e => e.id === item.target.value)
  baibuIntroInfo.value = ele
  initChart1(item.target.value)
  getMonitorDeviceByParkId(item.target.value)
}
const baibuIntroInfo = ref<any>({
  id: '',
  imgId: '',
  remark: ''
})
const getBaibuParkInfo = async () => {
  const { list = [] } = await getCropBaseList({ pageNo: 1, pageSize: 50 })
  console.log('getBaibuParkInfo', list[0]);
  productOptions.value = list
  if (Array.isArray(list) && list.length > 0) {
    baibuIntroInfo.value = list[0]
    initChart1(list[0].id)
    getMonitorDeviceByParkId(list[0].id)
  }
}
getBaibuParkInfo()


// 获取监控设备 
const monitorDeviceList = ref<Array<any>>([])
const curMonitorPageIndex = ref(1)
const handleArrowClick = (param) => {
  if (!baibuIntroInfo.value.id) return
  curMonitorPageIndex.value += param
  if (curMonitorPageIndex.value < 1) {
    curMonitorPageIndex.value = 1
    return
  }
  console.log('curMonitorPageIndex', curMonitorPageIndex.value);
  
  getMonitorDeviceByParkId(baibuIntroInfo.value.id, curMonitorPageIndex.value)
}
const getMonitorDeviceByParkId = async (belongPark, pageNo = 1) => {
  const { list = [] } = await monitorDeviceByParkId({
    // belongPark,
    pageNo,
    pageSize: 3,
    deviceType: '58, 61'
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
    areaSum = '0',
  } = await getParkCountAndAreaSum();

  const cropCount = await getCropBaseCount();
  
  industryList.value = [
    {
      title: '基地数量',
      value: parkCount
    }, {
      title: '种植面积',
      value: areaSum + '亩'
    }, {
      title: '种植品种',
      value: cropCount
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
  title: '种植品种',
  value: '0'
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
      <div class="header-title-wrapper">彭水百部中药产业数字化赋能</div>
      <div class="header-right-part-wrapper"></div>
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
                >{{ item.cropName }}</option>
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
              <img :src="baibuIntroInfo.imgId" align="left" width="160" style="margin: .3rem 1rem 1rem .3rem;" />
              <span>{{ baibuIntroInfo.remark }}</span>
            </div>
            <div
              class="sub-title-bg h-[2rem]"
              style="margin-left: .7rem;width: calc(100% - .7rem);margin-bottom: .9rem;"
            >烘干工艺</div>
            <div id="chart1" style="height: 12rem;"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-column: span 2;">
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">智慧种植</div>
          <div class="main-item-container flex flex-col">
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-[length:100%_100%] card-width-bg flex justify-between p-3 col-span-2">
                <span>物联网设备</span>
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
                  <span>{{ item.categoryName }}</span>
                  <span>{{ item.total }}</span>
                </div>
                <div class="flex justify-between px-2">
                  <span>
                    在线
                    <span class="pl-3" style="color: green;">{{ item.online }}</span>
                  </span>
                  <span>
                    离线
                    <span class="pl-3" style="color: red;">{{ item.offline }}</span>
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
                <div style="font-family: 'TitleFont';" class="pt-1">{{ envTemp + '℃' }}</div>
              </div>
              <div
                class="bg-[length:100%_100%] card-bg px-1"
                style="font-size: .8rem;"
                v-for="(item, index) in envDataList"
                :key="index"
              >
                <div
                  class="flex justify-between p-2"
                  style="border-bottom: 1px solid #5fabd980;"
                  v-for="ele in item"
                  :key="ele.monitoringType"
                >
                  <span>{{ ele.monitoringType }}</span>
                  <span style="color: #68fffe;">{{ ele.dataValue + ele.unit }}</span>
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
                <div style="font-family: 'TitleFont';" class="pt-1">{{ soilTemp + '℃' }}</div>
              </div>
              <div
                class="bg-[length:100%_100%] card-bg px-1"
                style="font-size: .8rem;"
                v-for="(item, index) in soilDataList"
                :key="index"
              >
                <div
                  class="flex justify-between p-2"
                  style="border-bottom: 1px solid #5fabd980;"
                  v-for="ele in item"
                  :key="ele.monitoringType"
                >
                  <span>{{ ele.monitoringType }}</span>
                  <span style="color: #68fffe;">{{ ele.dataValue + (ele.monitoringType !== "EC值" ? ele.unit : '') }}</span>
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
            <div class="grid grid-cols-4 gap-1 p-1">
              <div class="bg-[length:100%_100%] card-bg p-2 flex flex-col items-center justify-center" style="font-size: .8rem;">
                <div class="bg-[length:100%_100%] temp-icon"></div>
                <div style="font-family: 'TitleFont';" class="pt-1">{{ bugTemp + '℃' }}</div>
              </div>
              <div
                class="bg-[length:100%_100%] card-bg px-1"
                style="font-size: .8rem;"
                v-for="(item, index) in bugDataList"
                :key="index"
              >
                <div
                  class="flex justify-between p-2"
                  style="border-bottom: 1px solid #5fabd980;"
                  v-for="ele in item"
                  :key="ele.monitoringType"
                >
                  <span>{{ ele.monitoringType }}</span>
                  <span style="color: #68fffe;">{{ ele.dataValue + (ele.monitoringType !== "EC值" ? ele.unit : '') }}</span>
                </div>
              </div>
              <div
                class="bg-[length:100%_100%] card-bg px-1"
                style="font-size: .8rem;"
                v-for="(item, index) in subDeviceList"
                :key="index"
              >
                <div
                  class="flex justify-between p-2 items-center"
                  style="border-bottom: 1px solid #5fabd980;"
                  v-for="ele in item"
                  :key="ele.id"
                >
                  <span>{{ ele.subDevicesName }}</span>
                  <el-switch
                    v-model="ele.button"
                    size="small"
                    @change="(e) => { handleSwitchChange(e, ele) }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">工业设备</div>
          <div class="main-item-container">
            <div class="flex justify-between h-full">
              <img
                src="/device.jpg"
                alt=""
                style="width: calc(100% - 10rem);height: 100%;object-fit: cover;"
              />

              <div class="w-[8rem] px-3">
                <div
                  class="flex justify-between"
                  v-for="(item, index) in deviceInfo"
                  :key="index"
                >
                  <span>{{ item.categoryName }}</span>
                  <span>{{ item.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">商品流通</div>
          <div class="main-item-container">
            <div id="chart2"></div>
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
          <div class="main-item-title">
            <div>监控设备</div>
            <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
              <select @change="handleMonitorSelectorChange">
                <option
                  :value="item.id"
                  v-for="item,index in monitorOptions"
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
#chart2 {
  width: 100%;
  height: 100%;
}
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
</style>