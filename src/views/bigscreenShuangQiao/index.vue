<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import {onMounted, ref, watch} from 'vue'
import * as echarts from 'echarts'
import {initChartStatic, generateBaseOptions} from '../../utils/bigscreenTool/index'
import preWarn from '@/views/bigscreen6/assets/preWarn.png'
import sensor from '@/views/bigscreen6/assets/sensor.png'
import monitor from '@/views/bigscreen6/assets/monitor.png'
import {ParkBaseInfo, ParkBaseInfo2} from '@/api/kaizhou/bigscreen/index'
import ScaleBox from "vue3-scale-box";
import {
  largeScreenGetWarning,
  largeScreenGetOneWarning,
  waterDetection,
  selectStateNum,
  deviceBaseList,
  waterDetectionType,
  deviceBasePage,
  monitoringEquipment,
  viewMonitoring,
  getDeviceDataYouEnvironment,
  waterDetectionByAddress,
  getDeviceDataYouEnvironmentLine,
  page,
  park,
  page2,
  page3,
  list, environmentalDataHomePageA
} from './apis'
import dayjs from "dayjs";

// 大屏中央右边监控设备(单条) 未完成
// const singleMonitor = ref({
// equipmentName: "",
// id: "",
// name: "",
// status: ""
// })
const singleMonitor = ref<Array<any>>([])
const getViewMonitoring = async () => {
  const {list = []} = await viewMonitoring({});
  Array.isArray(list) ? (singleMonitor.value = list.map((item) => ({
    ...item,
    id: item.id
  }))) : null;
  console.log('监控设备(单条)');
}

// 传感器 （单条）
const singleSensorInfo = ref({
  dataValue: "",
  deviceCode: "",
  deviceName: "",
  name: "",
  unit: ""
})
const getwaterDetectionByAddress = async () => {
  const res = await waterDetectionByAddress({
    belongPark: curBelongPark.value,
    belongPlot: curBelongPlot.value
  });
  console.log('singleSensorInfo', res);
  singleSensorInfo.value = res
}

// 左上角 根据设备获取环境监测值
const envVal = ref([])
// const envVal = ref({
//   "气压": "0",
//   "二氧化碳": "0",
//   "湿度": "0",
//   "雨量": "0",
//   "光照": "0",
//   "温度": "0",
//   "风向": "-",
//   "风速": "0"
// })
const leftCurDeviceCode1 = ref(0);
const leftCurDeviceCode2 = ref(0);
const leftTabSelected = ref('湿度')
const envLabel = ref('温度')
const getGetDeviceDataYouEnvironment = async (id) => {
  leftCurDeviceCode1.value = id;
  // leftCurDeviceCode2.value = belongPlot;
  const res = await environmentalDataHomePageA(id)
  console.log("数据1 环境监测", res)
  envVal.value = res;
  envLabel.value = res[0].monitoringType
  console.log(leftTabSelected.value, id, 'jiegoufuhzi')

  let id2 = id.id
  await initChart1({typeName: res[0].monitoringType, id: id2})
}

// 左下角设备监控
const monitorEquipList = ref<Array<any>>([])
const getMonitoringEquipment = async () => {
  const res = await monitoringEquipment({pageNo: '1', pageSize: '10', deviceType: '108,109'})
  console.log('左下角设备监控', res)
  monitorEquipList.value = res.list.slice(0, 2)
}
getMonitoringEquipment()

// 单条预警
const onWarningInfo = ref({
  deviceName: '',
  id: '',
  parkName: '',
  warnInfo: ''
})
const getLargeScreenGetOneWarning = async (parkId) => {
  const res = await largeScreenGetOneWarning({parkId})
  console.log('getLargeScreenGetOneWarninges', res)
  onWarningInfo.value = res
}

const getDeviceBasePage = async () => {
  const {list = []} = await deviceBasePage()
  console.log('左上下拉', list)
  Array.isArray(list)
    ? (envOptions.value = list.map((item) => ({
      ...item,
      id: item.id,
      name: item.deviceName
    })))
    : null;

  console.log(list, 'id')
  getGetDeviceDataYouEnvironment({id: list[0].id})
  await initChart1({typeName: '温度', id: list[0].id})
}
getDeviceBasePage()
//单个摄像头
let sxtObj = ref([])
const getPage2 = () => {
  page2({pageSize: 1, pageNo: 1, deviceType: '108,109'}).then(res => {
    console.log(res, '单个摄像头')
    sxtObj.value = res.list
  })
}
getPage2()
//单个数据采集
let sjList = ref({})
const getPage3 = () => {
  page3({pageSize: 1, pageNo: 1}).then(res => {
    console.log(res, '单个shuju')
    sjList.value = res.list[0]
  })
}
getPage3()
//预警信息
let warnList = ref({})
const getList = () => {
  list({pageSize: 1, pageNo: 1}).then(res => {
    console.log(res, '单个yujing')
    warnList.value = res.list[0]
  })
}
getList()
// 大屏中央设备设备数量统计
const deviceBaseInfo = ref<any>({
  total: 0,
  online: 0,
  offline: 0
})
const getDeviceBaseList = async () => {
  const res = await deviceBaseList()
  console.log('大屏中央设备设备数量统计', res)
  deviceBaseInfo.value = res[0]
}
getDeviceBaseList()

// 预警信息（大屏右下角）
const getlargeScreenGetWarning = async () => {
  const {list = []} = await largeScreenGetWarning({pageSize: 10})
  console.log('shit', list)
  if (Array.isArray(list))
    tableData.value = list.map((item) => ({
      name: item.plotCode,
      device: item.deviceCode,
      info: item.warnInfo,
      time: dayjs(item.warnTime).format("YYYY-MM-DD HH:mm:ss"),
      status: item.warnStatus === '0' ? '未处理' : '已处理'
    }))
  console.log("右下角", list)
  console.log("右下角", tableData.value)
}
getlargeScreenGetWarning()

// 大屏中央设备设备数量统计
const deviceNumCount = ref<Array<any>>([])
const getSelectStateNum = async () => {
  const res = await selectStateNum()
  Array.isArray(res) ? (deviceNumCount.value = [res[0], res[1], res[2], res[3]]) : null
  console.log(res)
}
getSelectStateNum()

// 水质监测（八项参数）
const waterTypeList = ref<Array<any>>([
  {
    unit: 'mg/L',
    month: '2024-03-19',
    dataValue: 0,
    type: 'ammonia_oxygen'
  },
  {
    unit: 'mg/L',
    month: '2024-03-19',
    dataValue: 0,
    type: 'nitrite_nitrogen'
  },
  {
    unit: 'ph',
    month: '2024-03-19',
    dataValue: 0,
    type: 'PH_value'
  },
  {
    unit: '%',
    month: '2024-03-19',
    dataValue: 0,
    type: 'salinity'
  },
  {
    unit: 'm',
    month: '2024-03-19',
    dataValue: 0,
    type: 'water_level'
  },
  {
    unit: 'mg/L',
    month: '2024-03-19',
    dataValue: 0,
    type: 'dissolved_oxygen'
  },
  {
    unit: 'ppm',
    month: '2024-03-19',
    dataValue: 0,
    type: 'turbidity'
  },
  {
    unit: '℃',
    month: '2024-03-19',
    dataValue: 0,
    type: 'temperature'
  }
])

/**
 * belongPark 基地编号
 * belongPlot 塘口编号
 */
const getWaterDetectionType = async (belongPark, belongPlot) => {
  const res = await waterDetectionType({belongPark, belongPlot})
  console.log('水质监测（八项参数）', res)
  Array.isArray(res) ? (waterTypeList.value = res) : null
}

const options1 = ref<Array<any>>([])
// const getOptions1 = async (parentId = '0') => {
//   const res = await ParkBaseInfo({parentId})
//   options1.value = res
//   if (options1.value.length > 0) await getOptions2(options1.value[0].id)
// }
// getOptions1()

//获取基地
let selecteId1 = ref('')
const getPage = () => {
  page({}).then(res => {
    console.log(res, '基地')
    options1.value = res.list
    selecteId1.value = res.list[0].id
    getPark({parkId: res.list[0].id})
  })
}
getPage()
//获取堂口
const rightTabSelected = ref('溶氧量')
const options2 = ref<Array<any>>([])
const getPark = (id) => {
  park(id).then(res => {
    console.log(res, '塘口')
    options2.value = res
    initChart2(rightTabSelected.value)
    getWaterDetectionType2({belongPark: selecteId1.value, belongPlot: res[0].id})

  })
}
//获取八项
const getWaterDetectionType2 = (val) => {
  waterDetectionType(val).then(res => {
    console.log(res, '八项参数')
    waterTypeList.value = res;
  })
}
const selecte2 = (val) => {
  getWaterDetectionType2({belongPark: selecteId1.value, belongPlot: val.target.value})
}
const getOptions2 = async (parentId) => {
  curBelongPark.value = parentId
  const res = await ParkBaseInfo2({parentId})
  options2.value = res
  handleSelectorChange2({
    target: {value: res[0].id}
  })
}
const curBelongPark = ref('')
const handleSelectorChange1 = (val) => {
  selecteId1.value = val.target.value
  getPark({parkId: val.target.value})
}
const curBelongPlot = ref('')
const handleSelectorChange2 = (val) => {
  const parentId = val.target.value || 0;
  console.log('基地编号', curBelongPark.value);
  console.log('塘口编号', parentId)
  curBelongPlot.value = parentId;
  getWaterDetectionType(curBelongPark.value, parentId)
  initChart2(rightTabSelected.value, curBelongPark.value, parentId)
  getwaterDetectionByAddress()
  getViewMonitoring()
  getLargeScreenGetOneWarning(parentId)
}

// 环境监测 options
const envOptions = ref<Array<any>>([])
const handleEnvSelectorChange = (val) => {
  console.log(val.target.value, 'huanjjcid')
  const item = envOptions.value.find(item => {
    return item.id === val.target.value
  })
  getGetDeviceDataYouEnvironment({id: val.target.value})
}


const tableColumns = ref([
  {
    key: 'name',
    label: '编号',
    width: '5rem'
  },
  {
    key: 'device',
    label: '设备',
    width: '4rem'
  },
  {
    key: 'info',
    label: '预警信息',
    width: 'calc(100% - 19rem)'
  },
  {
    key: 'time',
    label: '时间',
    width: '5rem'
  },
  {
    key: 'status',
    label: '状态',
    width: '4rem'
  }
])

const tableData = ref<Array<any>>([])

const initChart1 = async (lineChart) => {
  const deviceCode1 = leftCurDeviceCode1.value;
  const deviceCode2 = leftCurDeviceCode2.value;
  if (!lineChart || !deviceCode1) return
  console.log('lineChart ', lineChart)

  const res = await getDeviceDataYouEnvironmentLine(lineChart)
  console.log('getDeviceDataYouEnvironmentLine ==', res);
  let xAxisData = []
  let yAxisData = []
  res.forEach(item => {
    xAxisData.push(item.collectionTime)
    yAxisData.push(item.dataValue)
  })
  console.log(xAxisData, yAxisData, 'data')
  nextTick(() => {
    initChartStatic(
      'chart1',
      generateBaseOptions({
        xAxis: {
          data: xAxisData,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        legend: {
          show: false,
          orient: 'horizontal',
          itemWidth: 15,
          itemHeight: 15
        },
        color: ['#ffa773'],
        yAxis: {
          name: leftUnitMap[lineChart],
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            //网格线
            show: false, //是否显示
            lineStyle: {
              //网格线样式
              color: '#fff', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
        },
        series: [
          {
            name: leftLabelMap[lineChart],
            data: yAxisData,
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
                  {offset: 1, color: '#ffa77300'},
                  {offset: 0, color: '#ffa773'}
                ])
              },
            },
            areaStyle: {normal: {}},
          }
        ],
        grid: {
          left: '8%',
          right: '6%',
          top: '13%',
          bottom: '15%'
        }
      })
    )
  })
}
let btnIndex = ref(0)
const getChart = (val, index) => {
  leftTabSelected.value = val
  envLabel.value = val
  btnIndex.value = index
  initChart1({typeName: val, id: leftCurDeviceCode1.value.id})
}
const initChart2 = async (lineChart, belongPark, belongPlot) => {
  // 水质监测（折线图）
  const res = await waterDetection({lineChart, belongPark, belongPlot})
  console.log('水质监测（折线图）', res)
  const seriseName = rightLabelMap[res[0].type]
  const yName = rightUnitMap[res[0].type]
  let xAxisData = []
  let yAxisData = []
  res.forEach(item => {
    xAxisData.push(item.collectionTime)
    yAxisData.push(item.dataValue)
  })
  initChartStatic(
    'chart2',
    generateBaseOptions({
      xAxis: {
        data: xAxisData,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#30c3ef', '#36e1d9'],
      yAxis: {
        name: yName,
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          //网格线
          show: false, //是否显示
          lineStyle: {
            //网格线样式
            color: '#fff', //网格线颜色
            width: 1, //网格线的加粗程度
            type: 'dashed' //网格线类型
          }
        },
      },
      series: [
        {
          name: seriseName,
          data: yAxisData,
          type: 'line',
          smooth: false,
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
                {offset: 1, color: '#30c3ef00'},
                {offset: 0, color: '#30c3ef'}
              ])
            },
          },
          areaStyle: {normal: {}},
        }
      ],
      grid: {
        left: '12%',
        right: '6%',
        top: '13%',
        bottom: '15%'
      }
    })
  )
}

watch(
  () => leftTabSelected.value,
  (newValue) => {
    console.log('newValue', newValue)
    initChart1({typeName: newValue, id: leftCurDeviceCode1.value.id})
  }
)
const leftIconMap = {
  "温度": 1, //环境温度
  "湿度": 2, //环境湿度
  "光照": 3, //光照
  "二氧化碳": 4, //二氧化碳浓度
  "风速": 5, //风速
  "气压": 6, //气压
  "雨量": 7, //降雨量
  "风向": 8, //风向
  "空气温度": 1,//空气温度
  "空气湿度": 2,//空气湿度
  "大气压力": 6,//大气压力
  "光照强度": 3,//光照强度
  "PM2.5": 9,//PM2.5/101
  "风力": 5,
  "土壤湿度":2,
  "土壤温度":1,
  "土壤EC值":6,
  "当前雨量":7,
  "PM10": 9
}

const leftUnitMap = {
  "温度": '℃', //环境温度
  "湿度": '%', //环境湿度
  "光照": 'Lux', //光照
  "二氧化碳": 'ppm', //二氧化碳浓度
  "风速": 'm/s', //风速
  "气压": 'hPa', //气压
  "雨量": 'mm', //降雨量
  "风向": '度', //风向
  "空气温度": '℃',//空气温度
  "空气湿度": '%',//空气湿度
  "大气压力": 'hPa',//大气压力
  "光照强度": 'Lux',//光照强度
  "PM2.5/10": 'μg/m³',//PM2.5/101
}

const leftLabelMap = {
  "温度": '温度', //环境温度
  "湿度": '湿度', //环境湿度
  "光照": '光照', //光照
  "二氧化碳": '二氧化碳', //二氧化碳浓度
  "风速": '风速', //风速
  "气压": '气压', //气压
  "雨量": '雨量', //降雨量
  "风向": '风向' //风向
}


let btnIndex2 = ref(0)
let right2Val = ref('溶氧量')
const btnCli = (val, index) => {
  rightTabSelected.value = val.monitoringType
  right2Val.value = val.monitoringType
  btnIndex2.value = index
  initChart2(rightTabSelected.value)
}
watch(
  () => rightTabSelected.value,
  (newValue) => {
    console.log('newValue', newValue)
    initChart2(newValue, curBelongPark.value, curBelongPlot.value)
  }
)
const rightIconMap = {
  temperature: 'PH值',
  salinity: 2,
  turbidity: 3,
  water_level: 4,
  PH_value: 5,
  dissolved_oxygen: 6,
  ammonia_oxygen: 7,
  nitrite_nitrogen: 8
}
const rightLabelMap = {
  temperature: '温度',
  salinity: '盐度',
  turbidity: '浑浊度',
  water_level: '水位',
  PH_value: 'PH值',
  dissolved_oxygen: '溶氧量',
  ammonia_oxygen: '氨氧量',
  nitrite_nitrogen: '亚硝酸盐氮'
}

const rightUnitMap = {
  temperature: '℃',
  salinity: '%',
  turbidity: 'ppm',
  water_level: 'm',
  PH_value: 'ph',
  dissolved_oxygen: 'mg/L',
  ammonia_oxygen: 'mg/L',
  nitrite_nitrogen: 'mg/L'
}

const windowOpen = item => window.open(item)
</script>
<template>
  <div class="w-[100vw] h-[100vh] overflow-hidden bg-black">
    <scale-box>
      <div class="bigscreen-main-wrapper">
        <div class="header-main-wrapper header-bg">
          <div class="header-left-part-wrapper">
            <BigScreenTime/>
          </div>
          <div class="header-title-wrapper">
            板桥乡双桥村鲁渝协作示范村数字化赋能
          </div>
          <div class="header-right-part-wrapper"></div>
        </div>
        <div class="content-main-wrapper grid-container">
          <div class="gird-item-wrapper">
            <div class="grid-main-item">
              <div
                class="main-item-title title-bg"
                @click="windowOpen('/internetMonitor/deviceData/equipment-data-three?collectionType=气象站')"
              >
                <div>环境监测</div>
                <div
                  class="selector-wrapper"
                  @click="(e) => e.stopPropagation()"
                >
                  <select
                    @change="handleEnvSelectorChange"
                  >
                    <option
                      :value="item.id"
                      v-for="item,index in envOptions"
                      :key="index"
                    >{{ item.name }}</option>
                  </select>
                </div>
              </div>
              <div class="main-item-container">
                <div class="grow overflow-auto custom-scroll-bar">
                  <div class="card-grid-wrapper min-h-[16rem]">
                    <div
                      :class="`card-grid-item ${leftTabSelected === item.monitoringType ? 'card-selected' : ''}`"
                      v-for="item,index in envVal"
                      :key="index"
                    >
                      <div :class="`icon-wrapper l-icon-${leftIconMap[item.monitoringType] || 6}`"></div>
                      <div class="label-val-wrapper">
                        <div class="value-wrapper">
                          <span class="value">{{ item.dataValue }}</span>
                          <span class="unit">{{ item.yyUnit }}</span>
                        </div>
                        <div class="label-wrapper">{{ item.monitoringType }}</div>
                      </div>
                      <div
                        :class="btnIndex==index? 'check-btn2':'check-btn'"
                        @click="getChart(item.monitoringType,index)"
                      >查看</div>
                    </div>
                  </div>
                </div>
                <div class="sub-title-wrapper">
                  <div style="width: 8px;height: 1rem;background-color: #68fffe;"></div>
                  <div
                    style="font-family: 'TitleFont';font-size: 1rem;padding: 0 .3rem;"
                  >{{ envLabel }}变化趋势</div>
                  <div style="width: calc(100% - 7rem);height: 100%;background: linear-gradient(to right, #68fffe, #68fffe00);"></div>
                </div>
                <div
                  class="h-[250px]"
                  id="chart1"
                ></div>
              </div>
            </div>
          </div>
          <div
            class="gird-item-wrapper"
            style="grid-row: span 3;z-index: 10;"
          >
            <div class="grid-main-item center-container">
              <div class="tool-tip-wrapper">
                <div class="tool-tip-item">
                  <img :src="preWarn" alt="" />
                  <span>预警信息</span>
                </div>
                <div class="tool-tip-item">
                  <img :src="sensor" alt="" />
                  <span>传感器</span>
                </div>
                <div class="tool-tip-item">
                  <img :src="monitor" alt="" />
                  <span>监控设备</span>
                </div>
              </div>
              <div id="mainMap">
                <div
                  class="tool-info"
                  style="left: calc(400px - 100px);bottom: 300px;"
                >
                  <div class="info-rect">
                    <div class="text-info" v-for="(item, index) in sxtObj" :key="index">
                      <div class="text-row">编号: {{ item.deviceCode }}</div>
                      <div class="text-row">位置: {{ item.location }}</div>
                      <div class="text-row">设备: {{ item.deviceName }}</div>
                      <div class="text-row">
                        状态:
                        <span
                          :style="`color: ${item.deviceStatus === 'online' ? '#35bb60' : '#bc3f00'};`"
                        >{{ item.deviceStatus === 'online' ? '在线' : '离线' }}</span>
                      </div>
                    </div>
                  </div>
                  <img :src="monitor" alt="" />
                </div>

                <div
                  class="tool-info"
                  style="left: calc(600px - 100px);bottom: 100px;"
                >
                  <div class="info-rect">
                    <div class="text-info">
                      <div class="text-row">编号: {{ sjList.equipmentCode }}</div>
                      <div class="text-row">位置: {{ sjList.parkName }}</div>
                      <div class="text-row">设备: {{ sjList.deviceName }}</div>
                      <div class="text-row">当前读数: {{ sjList.dataValue + " " + sjList.yyUnit }}</div>
                    </div>
                  </div>
                  <img :src="sensor" alt="" />
                </div>
                <div
                  class="tool-info"
                  style="left: calc(900px - 100px);bottom: 200px;"
                >
                  <div class="info-rect">
                    <div class="text-info">
                      <div class="text-row">编号: {{ warnList.parkCode }}</div>
                      <div class="text-row">设备: {{ warnList.deviceCode }}</div>
                      <div class="text-row">
                        预警信息:
                        <span style="color: #ff0000;">{{ warnList.warnInfo }}</span>
                      </div>
                    </div>
                  </div>
                  <img :src="preWarn" alt="" />
                </div>
              </div>
              <div class="top-card-wrapper">
                <div class="top-card-item">
                  <div class="label-card">设备总数</div>
                  <div
                    class="value-card"
                    @click="windowOpen('/internetMonitor/device/deviceView')"
                  >{{ deviceBaseInfo.total }}</div>
                </div>
                <div class="top-card-item">
                  <div class="label-card">在线总数</div>
                  <div
                    class="value-card"
                    @click="windowOpen('/internetMonitor/device/deviceView?val=online')"
                  >{{ deviceBaseInfo.online }}</div>
                </div>
                <div class="top-card-item">
                  <div class="label-card">离线总数</div>
                  <div
                    class="value-card"
                    @click="windowOpen('/internetMonitor/device/deviceView?val=offline')"
                  >{{ deviceBaseInfo.offline }}</div>
                </div>
              </div>
              <div class="extra-card-wrappper">
                <div
                  class="top-card-item"
                  v-for="item in deviceNumCount"
                  :key="item"
                >
                  <div class="extra-icon t-icon-1"></div>
                  <div class="extra-text-wrapper">
                    <div class="extra-text-row extra-title-font">
                      <div>{{ item.categoryName }}</div>
                      <div>{{ item.total }}</div>
                    </div>
                    <div class="extra-text-row">
                      <div>在线数量</div>
                      <div style="color: #0fc87c;">{{ item.online }}</div>
                    </div>
                    <div class="extra-text-row">
                      <div>离线数量</div>
                      <div style="color: #c51416;">{{ item.offline }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="gird-item-wrapper">
            <div class="grid-main-item">
              <div
                class="main-item-title title-bg"
                @click="windowOpen('/internetMonitor/deviceData/equipment-data-three?collectionType=水质监测')"
              >
                <div>水质监测</div>
                <div
                  class="selector-wrapper"
                  @click="(e) => e.stopPropagation()"
                >
                  <select @change="handleSelectorChange1">
                    <option
                      :value="item.id"
                      v-for="item,index in options1"
                      :key="index"
                    >{{ item.name }}</option>
                  </select>
                  <select @change="selecte2">
                    <option
                      :value="item.id"
                      v-for="item,index in options2"
                      :key="index"
                    >{{ item.name }}</option>
                  </select>
                </div>
              </div>
              <div class="main-item-container">
                <div class="grow overflow-auto custom-scroll-bar">
                  <div class="card-grid-wrapper">
                    <div
                      :class="`card-grid-item ${rightTabSelected === item.monitoringType ? 'card-selected' : ''}`"
                      v-for="(item, index) in waterTypeList"
                      :key="index"
                    >
                      <div :class="`icon-wrapper r-icon-${index < 8 ? index + 1 : 'default'}`"></div>
                      <div class="label-val-wrapper">
                        <div class="value-wrapper">
                          <span class="value">{{ item.dataValue }}</span>
                          <span class="unit">{{ item.yyUnit }}</span>
                        </div>
                        <div class="label-wrapper">{{ item.monitoringType }}</div>
                      </div>
                      <div
                        :class="btnIndex2==index ? 'check-btn2' : 'check-btn'"
                        @click="btnCli(item,index)"
                      >查看</div>
                    </div>
                  </div>
                </div>
                <div class="sub-title-wrapper">
                  <div style="width: 8px;height: 1rem;background-color: #68fffe;"></div>
                  <div style="font-family: 'TitleFont';font-size: 1rem;padding: 0 .3rem;">
                    {{ right2Val }}变化趋势
                  </div>
                  <div style="width: calc(100% - 11rem);height: 100%;background: linear-gradient(to right, #68fffe, #68fffe00);"></div>
                </div>
                <div
                  class="h-[250px]"
                  id="chart2"
                ></div>
              </div>
            </div>
          </div>
          <div class="gird-item-wrapper">
            <div class="grid-main-item">
              <div
                class="main-item-title title-bg"
                @click="windowOpen('/internetMonitor/device/deviceView?deviceType=108,109')"
              >
                <div>监控设备</div>
              </div>
              <div
                class="main-item-container monitor-device"
                style="flex-direction: row;"
              >
                <div
                  class="monitor-item"
                  v-for="(item, index) in monitorEquipList"
                  :key="index"
                >
                  <div class="video-wrapper">
                    <img
                      :src="item.imgId"
                      alt=""
                      style="width: 100%;height: 100%;object-fit: contain;"
                    />
                    <div
                      class="filter-img"
                      :style="`background-image: url(${item.capturedImage});`"
                    ></div>
                  </div>
                  <div class="text-wrapper">
                    <div class="text-row">名称:{{ item.deviceName }}</div>
                    <div class="text-row">位置:{{ item.location }}</div>
                    <div
                      class="text-row"
                    >
                      状态:
                      <span
                        :style="`color: ${item.deviceStatus === 'online' ? '#35bb60' : '#bc3f00'};`"
                      >{{ item.deviceStatus === 'online' ? '在线' : '离线' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="gird-item-wrapper">
            <div class="grid-main-item">
              <div
                class="main-item-title title-bg"
                @click="windowOpen('/internetMonitor/warn/agri-warning-record')"
              >
                <div>预警信息</div>
              </div>
              <div class="main-item-container pre-warn-table">
                <div class="table-header">
                  <div
                    class="table-cell"
                    v-for="(item) in tableColumns"
                    :key="item.key"
                    :style="`width: ${item.width};`"
                  >{{ item.label }}</div>
                </div>
                <div class="table-container">
                  <div
                    class="row-wrapper"
                    v-for="(item, index) in tableData"
                    :key="index"
                  >
                    <div
                      class="table-cell"
                      v-for="(column) in tableColumns"
                      :key="column.key"
                      :style="`width: ${column.width};`"
                    >{{ item[column.key] }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-main-wrapper"></div>
      </div>
    </scale-box>
  </div>
</template>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);

.header-bg {
  background-image: url(./assets/headerBg.png);
}

.title-bg {
  background-image: url(./assets/titleBg.png);
}

.bigscreen-main-wrapper {
  background-image: url(./assets/bg.png);
}

.grid-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
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
        height: 2.2rem;
        padding: 0 2rem;
        background-size: 100% 100%;
        font-family: 'TitleFont';
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .main-item-container {
        height: calc(100% - 2.2rem);
        background-image: url(./assets/bottomBg.png);
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center bottom;
        padding: 1rem;
        display: flex;
        flex-direction: column;

        .card-grid-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(4, 1fr);
          gap: 1rem;

          .card-selected {
            background: linear-gradient(to right, #00000000, #2f6979, #00000000);
          }

          .card-grid-item {
            border: 1px solid #325c98;
            padding: 0.6rem 0.8rem;
            display: flex;
            align-items: center;
            position: relative;

            .icon-wrapper {
              width: 2rem;
              height: 2rem;
              background-size: 100% 100%;
            }

            .label-val-wrapper {
              padding: 0 0.8rem;

              .label-wrapper {
                color: #2efbf6;
                font-size: 0.7rem;
              }

              .value-wrapper {
                .value {
                  font-size: 1.1rem;
                  font-family: 'TitleFont';
                }

                .unit {
                  font-size: 0.6rem;
                  padding-left: 0.3rem;
                }
              }
            }

            .check-btn {
              position: absolute;
              right: 0.8rem;
              background-color: #136db2;
              color: white;
              text-align: center;
              margin: 0 auto;
              padding: 0.2rem 0.5rem;
              font-size: 0.8rem;
              border-radius: 0.6rem;
              cursor: pointer;
            }

            .check-btn2 {
              position: absolute;
              right: 0.8rem;
              background-color: #68fffe;
              color: white;
              text-align: center;
              margin: 0 auto;
              padding: 0.2rem 0.5rem;
              font-size: 0.8rem;
              border-radius: 0.6rem;
              cursor: pointer;
            }
          }
        }

        .sub-title-wrapper {
          height: 1rem;
          display: flex;
          margin: 0.7rem 0;
          align-items: center;
        }

        .chart-wrapper {
          height: 200px;
        }
      }
    }
  }
}

.center-container {
  position: relative;

  .top-card-wrapper,
  .extra-card-wrappper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
    padding: 0.8rem 0;
  }

  .top-card-wrapper {
    .top-card-item {
      margin: 0 1.3rem;
      width: 7rem;
      aspect-ratio: 1.5;
      background-image: url(./assets/topBg.png);
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .value-card {
        font-size: 1.4rem;
        font-family: 'TitleFont';
        margin-bottom: 1.6rem;
      }

      .label-card {
        font-size: 0.9rem;
      }
    }
  }

  .extra-card-wrappper {
    .top-card-item {
      margin: 0 0.4rem;
      padding: 0.5rem;
      background-image: url(./assets/extraBg.png);
      background-size: 100% 100%;
      display: flex;

      .extra-icon {
        background-size: 100% 100%;
        width: 3rem;
        height: 3rem;
        margin-right: 0.6rem;
      }

      .extra-text-wrapper {
        width: 9rem;

        .extra-text-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .extra-title-font {
          font-size: 1.1rem;
          font-family: 'TitleFont';
        }
      }
    }
  }

  #mainMap {
    width: 1400px;
    height: 800px;
    position: absolute;
    z-index: 0;
    left: calc(50% - 700px);
    top: calc(50% - 400px);
    background-image: url(./assets/main.png);
    background-size: 100% 100%;

    .tool-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      width: 200px;

      img {
        width: 2rem;
      }

      .info-rect {
        background-size: 100% 100%;
        width: 100%;
        aspect-ratio: .8;
        background-image: url(./assets/infoRect.png);

        .text-info {
          width: calc(100% - 1.6rem);
          height: calc(70% - 1.6rem);
          margin: 0.8rem;

          .text-row {
            font-size: 0.9rem;
            padding: 0.1rem;
          }
        }
      }
    }
  }
}

#chart1,
#chart2 {
  border: 1px solid #ff000032;
}

/**图例 */
.tool-tip-wrapper {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;

  .tool-tip-item {
    padding: 0 1rem;
    display: flex;
    align-items: center;

    img {
      width: 2rem;
    }

    span {
      padding-left: 0.7rem;
    }
  }
}

/** 右下角的表格 */
.pre-warn-table {
  position: relative;
  padding: 0.4rem 1rem !important;

  .table-cell {
    text-align: center;
    font-size: 0.9rem;
    padding: 0 0.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }

  .table-container {
    height: calc(100% - 1.8rem);
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0px;
    }
  }

  .table-header {
    display: flex;
    height: 1.8rem;
    align-items: center;
    font-family: 'TitleFont';
    font-size: 0.7rem !important;
    color: #f5f5f5c8;
  }

  .row-wrapper {
    display: flex;
    align-items: center;
    color: aliceblue;
    margin: 0.3rem 0 0.5rem 0;
    padding: 0.3rem 0;
    padding-bottom: 0.5rem;
    background-image: url(./assets/tablebg.png);
    background-size: 100% 100%;
  }
}

/**监控设备 */
.monitor-device {
  display: flex;
  justify-content: space-between;

  .monitor-item {
    width: calc(50% - 0.5rem);

    .video-wrapper {
      width: 100%;
      aspect-ratio: 1.8;
      position: relative;

      .filter-img {
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        filter: blur(2px);
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }
    }

    .text-wrapper {
      padding: 0.4rem 0;

      .text-row {
        padding: 0.1rem 1rem;
        position: relative;
        font-size: 0.7rem;
      }

      .text-row::before {
        content: '';
        position: absolute;
        left: 0.2rem;
        top: 0.3rem;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: gold;
      }
    }
  }
}

.selector-wrapper {
  select {
    margin: 0 0.3rem;
    padding: 0.2rem 0.3rem;
    border-radius: 0.4rem 0.4rem 0 0;
    background-color: #0a2019;
    color: white;
    border: 2px solid #0be3de;
  }
}

@for $i from 1 through 9 {
  .l-icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}

@for $i from 1 through 10 {
  .r-icon-#{$i} {
    background-image: url(./assets/rcon#{$i}.png);
  }
}
.r-icon-default {
  background-image: url(./assets/rcon8.png);
}
@for $i from 1 through 4 {
  .t-icon-#{$i} {
    background-image: url(./assets/tcon#{$i}.png);
  }
}

.custom-scroll-bar::-webkit-scrollbar {
  display: none;
}
</style>
