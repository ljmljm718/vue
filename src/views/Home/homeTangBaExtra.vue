<template>
  <div class="home-tangbg-wrapper shadow-xl overflow-hidden flex">
    <div
      class="rounded-2 bg-slate-200 p-3 pr-1 h-full"
      v-loading="menuDataLoading"
    >
      <div class="art-font pb-2 pl-1">设备监测列表</div>
      <el-scrollbar
        class="overflow-auto pr-2"
        height="calc(100% - 3.3rem)"
      >
        <el-menu
          class="el-menu-vertical-demo min-w-[230px]"
          @select="handleSelect"
        >
          <el-sub-menu
            :index="item.id"
            v-for="item in menuDataList"
            :key="item.id"
          >
            <template #title>
              <div class="flex space-x-2 items-center">
                <div class="w-[4px] h-[13px] bg-[#0160ff]"></div>
                <div>{{ item.name }}</div>
              </div>
            </template>
            <el-sub-menu
              :index="subMenu.id"
              v-for="subMenu in item.children"
              :key="subMenu.id"
            >
              <template #title>
                <span>{{ subMenu.name }}</span>
              </template>
              <el-menu-item
                v-for="secMenu in subMenu.children"
                :key="secMenu.id"
                :index="secMenu.id"
              >
                <div class="flex items-center space-x-2">
                  <div
                    :class="`${getIconClass(secMenu)} w-[20px] h-[20px]`"
                  ></div>
                  <div>{{ secMenu.name }}</div>
                </div>
              </el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="grow overflow-auto p-2">
      <div class="bg-[#25252500] grid xl:grid-cols-2 2xl:grid-cols-3 gap-3 w-full" id="chartOutWrapper">
        <div id="chartWD" class="chart-ins"></div>
        <div id="chartSD" class="chart-ins"></div>
        <div id="chartPH" class="chart-ins"></div>
        <div id="chartEC" class="chart-ins"></div>
        <div id="chartN" class="chart-ins"></div>
        <div id="chartP" class="chart-ins"></div>
        <div id="chartK" class="chart-ins"></div>
        <div id="chartLight" class="chart-ins"></div>
        <div id="chartAtmos" class="chart-ins"></div>
        <div id="chartGrow" class="chart-ins"></div>
        <div id="chartRain" class="chart-ins"></div>
        <div id="chartWindDirec" class="chart-ins"></div>
        <div id="chartWindSpeed" class="chart-ins"></div>
      </div>
    </div>
    
  </div>
</template>
<script setup lang="ts">
import {
  getDeviceCategoryTree,
  getDeviceInfo,
  getEquipmentDataById,
  getWarningRecordList,
  deviceInfoUpdate,
  getDeviceById,
  getNoticeList,
  pageA,
  getLineChar,
  environmentalDataHomePageA,
  environmentalDataHomePageC
} from './apis'
import { pinyin } from "pinyin-pro";
import * as echarts from 'echarts'
import {
  initChartStatic,
  generateBaseOptions
} from "../../utils/bigscreenTool/index";
defineOptions({ name: 'HomeTangBaExtra' })

const generateXY = (arr:Array<any>) => {
  const x:Array<any> = [], y:Array<any> = []
  arr.forEach((item:any) => {
    x.push(item.hour);
    y.push(item.dataValue)
  })
  let min = 0, max = 0
  if (arr.length > 0) {
    const {
      suitable_environment_max,
      suitable_environment_min
    } = arr[0]
    min = suitable_environment_max
    max = suitable_environment_min
  }
  return { x, y, min, max }
}

const runTimeDataLoading = ref<boolean>(false)
const runTimeDataList = ref<Array<any>>([])
const getRunTimeData = async (equipmentId, deviceKind) => {
  console.log("getRunTimeData", equipmentId);
  console.log("getRunTimeData deviceKind", deviceKind);
  
  if (!equipmentId) return
  runTimeDataLoading.value = true
  const res = await getEquipmentDataById({ equipmentId }).catch(() => { runTimeDataLoading.value = false })
  console.log("getRunTimeData", res);
  runTimeDataLoading.value = false
  runTimeDataList.value = []

  const activeApi = deviceKind === '103' ? environmentalDataHomePageA : deviceKind === '104' ? environmentalDataHomePageC : null
  if (activeApi) {
    const resp = await activeApi({ facilityId: equipmentId })
    if (Array.isArray(resp)) runTimeDataList.value = resp
  }

  // const {
  //   // temperature = [],
  //   potassium = [],
  //   ecValue = [],
  //   // humidity = [],
  //   // lightIntensity = [],
  //   nitrogen = [],
  //   pHValue = [],
  //   phosphorus = [],
  //   // atmosphericPressure = []
  // } = res

  // const temperature = res['温度'] || []
  // const lightIntensity = res['光照'] || []
  // const atmosphericPressure = res['大气压力'] || []
  // const humidity = res['湿度'] || []
  // const rain = res['雨量'] || []
  // const windDirection = res['风向'] || []
  // const windSpeed = res['风速'] || []

  const chartOutWrapper = document.getElementById("chartOutWrapper")
  if (!chartOutWrapper) return
  chartOutWrapper.innerHTML = ''
  for (let key in res) {
    const domName = pinyin(key, { toneType: "none", type: "array" }).join('')
    const newDom = document.createElement("div")
    newDom.id = domName
    newDom.className = 'tangba-chart-wrapper'
    chartOutWrapper.append(newDom)
    nextTick(() => {
      const unit = res[key][0].units || ''
      const { x, y, min, max } = generateXY(res[key])
      initChart(domName, x, y, unit, key, min, max)
    })
  }

  // const { x:WDX, y:WDY, min:WDMin, max: WDMax } = generateXY(temperature)
  // initChart('chartWD', WDX, WDY, '℃', '温度', WDMin, WDMax)

  // const { x:SDX, y:SDY, min:SDMin, max:SDMax } = generateXY(humidity)
  // initChart('chartSD', SDX, SDY, '%RH', '湿度', SDMin, SDMax)

  // const { x:PHX, y:PHY, min:PHMin, max:PHMax } = generateXY(pHValue)
  // initChart('chartPH', PHX, PHY, 'ph', 'PH值', PHMin, PHMax)

  // const { x:ECX, y:ECY, min:ECMin, max:ECMax } = generateXY(ecValue)
  // initChart('chartEC', ECX, ECY, 'mS/cm', 'EC值', ECMin, ECMax)

  // const { x:LightX, y:LightY, min:LightMin, max:LightMax } = generateXY(lightIntensity)
  // initChart('chartLight', LightX, LightY, 'Lux', '光照', LightMin, LightMax)

  // const { x:NX, y:NY, min:NMin, max:NMax } = generateXY(nitrogen)
  // initChart('chartN', NX, NY, 'mg/Kg', '氮', NMin, NMax)

  // const { x:PX, y:PY, min:PMin, max:PMax } = generateXY(phosphorus)
  // initChart('chartP', PX, PY, 'mg/Kg', '磷', PMin, PMax)

  // const { x:KX, y:KY, min:KMin, max:KMax } = generateXY(potassium)
  // initChart('chartK', KX, KY, 'mg/Kg', '钾', KMin, KMax)

  // const { x:AtmosX, y:AtmosY, min:AtmosMin, max:AtmosMax } = generateXY(atmosphericPressure)
  // initChart('chartAtmos', AtmosX, AtmosY, 'hpa', '大气压力', AtmosMin, AtmosMax)

  // const { x:RainX, y:RainY, min:RainMin, max:RainMax } = generateXY(rain)
  // initChart('chartRain', RainX, RainY, 'mm/min', '雨量', RainMin, RainMax)

  // const { x:WindDirecX, y:WindDirecY, min:WindDirecMin, max:WindDirecMax } = generateXY(windDirection)
  // initChart('chartWindDirec', WindDirecX, WindDirecY, '度°', '风向', WindDirecMin, WindDirecMax)

  // const { x:WindSpeedX, y:WindSpeedY, min:WindSpeedMin, max:WindSpeedMax } = generateXY(windSpeed)
  // initChart('chartWindSpeed', WindSpeedX, WindSpeedY, 'm/s', '风速', WindSpeedMin, WindSpeedMax)
}

const initChart = (
  chartName = '',
  xValue:Array<any> = [],
  yValue:Array<any> = [],
  unit = '', text = '',
  min = 0, max = 0
) => {
  const markLines:Array<any> = []
  if (min > 0) markLines.push({
    name:'最小值',
    yAxis: min
  })
  if (max > 0) markLines.push({
    name:'最大值',
    yAxis: max
  })
  if (xValue.length === 0) return
  const dom = document.getElementById(chartName)
  if (dom) {
    dom.style.display = 'block';
    dom.style.height = '16rem';
  }
  nextTick(() => {
    initChartStatic(
      chartName,
      generateBaseOptions({
        title: {
          text,
          textStyle: {
            fontSize: 12
          },
          x: '10',
          y: '10'
        },
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
          name: unit + '    ',
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ffffff80'
            }
          },
          nameLocation: 'end',
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#25252525', //网格线颜色
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
            markLine: {
              data: markLines,
              silent: true
            }
          }
        ],
        grid: {
          left: '50',
          right: '30',
          top: '65',
          bottom: '40'
        }
      })
    );
  })
}

const handleSelect = async (item) => {
  const chartOutWrapper = document.getElementById("chartOutWrapper")
  if (!chartOutWrapper) return
  chartOutWrapper.innerHTML = ''
  const chartInstances = document.querySelectorAll('.chart-ins')
  chartInstances.forEach((item: HTMLElement) => {
    item.style.height = '0px'
    item.style.marginTop = '0px'
  })
  
  const res = await getDeviceInfo({ id: item })
  const { deviceKind, id } = res
  
  setTimeout(() => { id && getRunTimeData(id, deviceKind) }, 300)
}

const allDeviceDataList = ref<Array<any>>([])
const getAllLocationDevice = (arr: Array<any>): Array<any> => {
  let resArr:Array<any> = []
  arr.forEach(item => {
    if (item.children) {
      resArr = [...resArr, ...getAllLocationDevice(item.children)]
    } else resArr.push(item)
  })
  return resArr
}

const menuDataList = ref<Array<any>>([])
const menuDataLoading = ref<boolean>(false)
const getMenuDataList = async () => {
  menuDataLoading.value = true
  menuDataList.value = []
  const res = await getDeviceCategoryTree({}).catch(() => { menuDataLoading.value = false })
  console.log('getMenuDataList', res);
  menuDataLoading.value = false
  if (Array.isArray(res)) menuDataList.value = res.map(_first => ({
    ..._first,
    id: _first.id.toString(),
    children: _first.children.map(_sec => ({
      ..._sec,
      id: _sec.id.toString(),
      children: _sec.children.map(_third => ({
        ..._third,
        id: _third.id.toString()
      })) || []
    })) || []
  }))

  if (Array.isArray(res)) allDeviceDataList.value = getAllLocationDevice(res)
  console.log("allDeviceDataList", allDeviceDataList.value);
}
getMenuDataList()

const getIconClass = (item) => {
  const { deviceStatus = 'offline', deviceKind = '' } = item
  const kindMap = {
    "101": "monitor",
    "102": "grow",
    "159": "weather",
    "104": "soil",
    "107": "bug",
  }
  return deviceStatus + '-' + (kindMap[deviceKind] || 'monitor')
}
</script>

<style scoped lang="scss">
.home-tangbg-wrapper {
  height: calc(100vh - 125px);
  position: relative;
}

.chart-ins {
  height: 16rem;
  display: none;
  background-color: #15a21700;
  box-shadow: 2px 2px 2px #25252525, -2px -2px 2px #14141414;
  border-radius: 8px;
  background-color: #fff;
  overflow: hidden;
}

.online-flag, .offline-flag {
  width: .8rem;
  height: .8rem;
  border-radius: .4rem;
}

.online-flag {
  background-color: #15a217;
}

.offline-flag {
  background-color: #a5320f;
}

.online-bug, .offline-bug,
.online-monitor, .offline-monitor,
.online-soil, .offline-soil,
.online-weather, .offline-weather,
.online-grow, .offline-grow {
  background-size: 100% auto;
}
.online-bug { background-image: url(./assets/tangba/onlineBug.png); }
.offline-bug { background-image: url(./assets/tangba/offlineBug.png); }

.online-monitor { background-image: url(./assets/tangba/onlineMonitor.png); }
.offline-monitor { background-image: url(./assets/tangba/offlineMonitor.png); }

.online-soil { background-image: url(./assets/tangba/onlineSoil.png); }
.offline-soil { background-image: url(./assets/tangba/offlineSoil.png); }

.online-weather { background-image: url(./assets/tangba/onlineWeather.png); }
.offline-weather { background-image: url(./assets/tangba/offlineWeather.png); }

.online-grow { background-image: url(./assets/tangba/onlineGrow.png); }
.offline-grow { background-image: url(./assets/tangba/offlineGrow.png); }
</style>
<style>
.tangba-chart-wrapper {
  background: linear-gradient(to top, #ebf3ff, #ebf3ff40);
  height: 0px;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid #25252540;
}
</style>