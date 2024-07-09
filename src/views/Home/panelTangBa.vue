<template>
  <div
    :class="`bg-white w-[600px] h-full p-3 box-border pr-1 ${props.modelValue ? 'panel-animation-in' : 'panel-animation-out'}`"
    id="panelTangBaDom"
  >
    <div class="flex justify-between items-start p-2 pb-1">
      <div>
        <div class="art-font flex items-center">
          <span class="pr-3 text-[20px]">{{ title }}</span>
          <el-tag
            :type="`${curDeviceStatus === 'online' ? 'success' : 'danger'}`"
          >{{ curDeviceStatus === 'online' ? '在线' : '离线' }}</el-tag>
        </div>
        <div class="text-sm">{{ time }}</div>
      </div>
      <el-icon class="mr-2" @click="handleClose"><Close /></el-icon>
    </div>
    <el-tabs v-model="activeTab" class="px-2">
      <el-tab-pane label="设备概要" name="设备概要">
        <el-scrollbar :height="`${currentWindowHeight - 135}px`" class="px-2">
          <div class="tab-title-wrapper">实时数据</div>
          <div
            class="grid grid-cols-3 gap-2 py-2 min-h-[100px]"
            v-loading="runTimeDataLoading"
            v-show="curDeviceKind === '103' || curDeviceKind === '104'"
          >
            <div
              class="bg-slate-200 p-3 py-2 flex justify-between items-center"
              v-for="item in runTimeDataList"
              :key="item.id"
            >
              <div>{{ item.monitoringType }}</div>
              <div>
                <span>{{ item.dataValue }}</span>
                <span>{{ item.yyUnit }}</span>
              </div>
            </div>
          </div>
          <div class="w-full box-border p-5" v-show="curDeviceKind === '101'">
            <video :src="curVideoLink" controls muted loop class="w-full aspect-video"></video>
          </div>
          <div v-show="curDeviceKind === '102'" class="py-3 pb-[42px]">
            <el-table
              :data="growRuntimeDataList"
              size="small"
              border
              v-loading="growRuntimeDataLoading"
              stripe
            >
              <el-table-column label="基地名称" prop="baseName" />
              <el-table-column label="地块名称" prop="massifName" />
              <el-table-column label="设备名称" prop="facilityName" />
              <el-table-column label="品种名称" prop="cropName" />
              <el-table-column label="测量类型" prop="measureType" />
              <el-table-column label="测量值" prop="measureNum" />
              <el-table-column
                label="测量时间"
                prop="measureTime"
                :formatter="(row) => {
                  return formatTime(row.measureTime, 'yyyy-MM-dd HH:mm:ss')
                }"
              />
            </el-table>
            <Pagination
              :total="growRuntimeDataTotal"
              v-model:page="growRuntimeQueryParams.pageNo"
              v-model:limit="growRuntimeQueryParams.pageSize"
              @pagination="getPageA(updateForm.id)"
            />
          </div>
          
          <div class="tab-title-wrapper mt-2" v-show="curDeviceKind !== '101'">统计数据</div>
          <div id="chartOutWrapper" class="space-y-2"></div>
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
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="报警" name="报警">
        <el-scrollbar :height="`${currentWindowHeight - 135}px`" class="px-2">
          <el-table
            :data="warnDataList"
            size="small"
            border
            v-loading="warnDataLoading"
            stripe
            v-show="curDeviceKind !== '101'"
          >
            <el-table-column label="报警类型" prop="warnType">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="scope.row.warnType"/>
              </template>
            </el-table-column>
            <el-table-column label="报警等级" prop="warnLevel">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.AGRI_WARN_LEVEL" :value="scope.row.warnLevel"/>
              </template>
            </el-table-column>
            <el-table-column label="报警信息" min-width="150" prop="warnInfo" />
            <el-table-column label="当前值" prop="currentValue" />
            <el-table-column label="阈值" prop="threshold" />
            <el-table-column label="处理状态" prop="warnStatus">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_STATUS" :value="scope.row.warnStatus"/>
              </template>
            </el-table-column>
            <el-table-column
              label="报警时间"
              prop="warnTime"
              :formatter="(row) => {
                return formatTime(row.warnTime, 'yyyy-MM-dd HH:mm:ss')
              }"
            />
          </el-table>
          <el-table
            :data="monitorWarnList"
            size="small"
            border
            v-loading="monitorWarnLoading"
            stripe
            v-show="curDeviceKind === '101'"
          >
            <el-table-column label="设备名称" prop="deviceName" />
            <el-table-column label="基地名称" prop="monitoringBaseName" />
            <el-table-column label="地块名称" prop="monitoringPlotName" />
            <el-table-column label="预警事件" prop="noticeEvent" />
            <el-table-column
              label="记录时间"
              prop="recordTime"
              :formatter="(row) => {
                return formatTime(row.recordTime, 'yyyy-MM-dd HH:mm:ss')
              }"
            />
          </el-table>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="设备属性" name="设备属性">
        <el-scrollbar :height="`${currentWindowHeight - 135}px`" class="px-2">
          <div class="tab-title-wrapper">设备点位信息</div>
          <div class="flex flex-col items-center mt-4">
            <div class="flex items-center space-x-2 p-4 py-2 mt-4">
              <div class="form-inner-label">设备编号:</div>
              <el-input
                v-model="updateForm.deviceCode"
                placeholder="请输入设备编号"
                style="width: 250px;"
                :disabled="!editEnabled"
              />
            </div>
            <div class="flex items-center space-x-2 p-4 py-2">
              <div class="form-inner-label">安装地址:</div>
              <el-input
                v-model="updateForm.location"
                placeholder="请输入安装地址"
                style="width: 250px;"
                :disabled="!editEnabled"
              />
            </div>
            <div class="flex items-center space-x-2 p-4 py-2">
              <div class="form-inner-label">安装时间:</div>
              <el-date-picker
                v-model="updateForm.createTime"
                type="datetime"
                placeholder="请输入安装时间"
                style="width: 250px;"
                :disabled="!editEnabled"
              />
            </div>
            <div class="flex items-center space-x-2 p-4 py-2">
              <div class="form-inner-label">坐标经度:</div>
              <el-input
                v-model="updateForm.longitude"
                placeholder="请输入坐标经度"
                style="width: 250px;"
                :disabled="!editEnabled"
              />
            </div>
            <div class="flex items-center space-x-2 p-4 py-2">
              <div class="form-inner-label">坐标纬度:</div>
              <el-input
                v-model="updateForm.latitude"
                placeholder="请输入坐标纬度"
                style="width: 250px;"
                :disabled="!editEnabled"
              />
            </div>
            <div class="flex space-x-2 pl-3 pt-3">
              <el-button type="primary" @click="editEnabled = true" :disabled="editEnabled">修改</el-button>
              <el-button type="primary" :disabled="!editEnabled" @click="handleSave()">保存</el-button>
              <el-button :disabled="!editEnabled" @click="editEnabled = false">取消</el-button>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { formatTime } from '@/utils'
import { DICT_TYPE } from "@/utils/dict"
import { pinyin } from "pinyin-pro";
import {
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
import {
  initChartStatic,
  generateBaseOptions
} from "../../utils/bigscreenTool/index";
import {
  EquipmentDataApi
} from '@/api/agriculture/equipmentdata'
import * as echarts from 'echarts'
defineOptions({ name: 'PanelTangBa' })

console.log("pinyin", pinyin("汉语拼音", { toneType: "none", type: "array" }).join(''));

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
  if (!equipmentId) return
  runTimeDataLoading.value = true
  const res = await getEquipmentDataById({ equipmentId }).catch(() => { runTimeDataLoading.value = false })
  console.log("getRunTimeData", res);
  runTimeDataLoading.value = false
  runTimeDataList.value = []

  const activeApi = EquipmentDataApi.getEquipmentDataByEquipmentCode
  if (activeApi) {
    const list = await activeApi(equipmentId)
    if (Array.isArray(list)) runTimeDataList.value = list
  }

  // const {
  //   // temperature = [],
  //   potassium = res['钾'] || [],
  //   ecValue = res['EC值'] || [],
  //   // humidity = [],
  //   // lightIntensity = [],
  //   nitrogen = res['氮'] || [],
  //   pHValue = res['PH值'] || [],
  //   phosphorus = res['磷'] || [],
  //   // atmosphericPressure = []
  // } = res

  // const temperature = res['空气温度'] || res['温度'] || []
  // const lightIntensity = res['总辐射'] || res['光照'] || []
  // const atmosphericPressure = res['大气压力'] || []
  // const humidity = res['空气湿度'] || []
  // const rain = res['当前雨量'] || []
  // const windDirection = res['风向'] || []
  // const windSpeed = res['风力'] || []

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
    dom.style.height = '220px';
    dom.style.marginTop = '12px';
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

const warnDataLoading = ref<boolean>(false)
const warnDataList = ref<Array<any>>([])
const warnDataTotal = ref<number>(0)
const getWarnDataList = async (deviceCode) => {
  if (!deviceCode) return
  warnDataLoading.value = true
  const { list = [], total = 0 } = await getWarningRecordList({ deviceCode, pageSize: 100 }).catch(() => { warnDataLoading.value = false })
  console.log("报警列表", list);
  
  warnDataLoading.value = false
  if (Array.isArray(list)) warnDataList.value = list
  warnDataTotal.value = total
}

const curVideoLink = ref<string>('')
const getMonitorVideo = async (deviceId:string) => {
  curVideoLink.value = ''
  const res = await getDeviceById({ deviceId })
  console.log("getMonitorVideo", res);
  curVideoLink.value = res.videoLink
}

const monitorWarnLoading = ref<boolean>(false)
const monitorWarnList = ref<Array<any>>([])
const getMonitorWarnList = async (deviceId) => {
  monitorWarnLoading.value = true
  const res = await getNoticeList({ deviceId }).catch(() => {
    monitorWarnLoading.value = false
  })
  monitorWarnLoading.value = false
  console.log("getMonitorWarnList", res);
  if (Array.isArray(res)) monitorWarnList.value = res
}

const growRuntimeDataLoading = ref<boolean>(false)
const growRuntimeDataList = ref<Array<any>>([])
const growRuntimeDataTotal = ref<number>(0)
const growRuntimeQueryParams = ref({
  pageNo: 1,
  pageSize: 10
})
const getPageA = async (facilityId) => {
  growRuntimeDataLoading.value = true
  const { list = [], total = 0 } = await pageA({
    facilityId,
    pageNo: growRuntimeQueryParams.value.pageNo,
    pageSize: growRuntimeQueryParams.value.pageSize,
  }).catch(() => {
    growRuntimeDataLoading.value = false
  })
  growRuntimeDataLoading.value = false
  console.log("getPageA", list);
  if (Array.isArray(list)) {
    growRuntimeDataList.value = list
    growRuntimeDataTotal.value = total
  }
}

const getGrowChartData = async (facilityId) => {
  const res = await getLineChar({ facilityId })
  console.log("getGrowChartData", res);
  const { xValue = [], measureUnit = [], yValue = [] } = res
  initChart('chartGrow', xValue, yValue, measureUnit[0] || '', '')
}

const title = ref<string>(''), time = ref<string>(''), curDeviceKind = ref<string>('')
const curDeviceStatus = ref<string>('')
const getDeviceInfoData = async (item) => {
  reset()
  const {
    id = '',
    deviceName = '',
    deviceCode = '',
    longitude = '',
    latitude = '',
    location = '',
    parkDetailName = '',
    deviceStatus = 'offline',
    createTime = new Date().valueOf(),
    deviceMonitorType = '',
    deviceKind = '',
    deviceId = '',
  } = item || {}
  curDeviceKind.value = deviceKind
  curDeviceStatus.value = deviceStatus
  updateForm.value.id = id
  updateForm.value.deviceName = deviceName
  updateForm.value.deviceCode = deviceCode
  updateForm.value.location = location
  updateForm.value.longitude = longitude
  updateForm.value.latitude = latitude
  updateForm.value.deviceMonitorType = [deviceMonitorType]
  updateForm.value.createTime = createTime
  title.value = parkDetailName + '-' + deviceName
  time.value = '最新数据更新于' + formatTime(createTime, 'yyyy-MM-dd HH:mm:ss')

  setTimeout(() => { item.id && getRunTimeData(item.id, deviceKind) }, 300)

  console.log("deviceKind", deviceId);

  if (deviceKind === '102') {
    // 生长监控
    getPageA(id)
    getGrowChartData(id)
  }
  
  if (deviceKind === '101') {
    getMonitorVideo(id)
    getMonitorWarnList(id)
  } else {
    item.deviceCode && getWarnDataList(item.deviceCode)
  }
}

const editEnabled = ref<boolean>(false)
const updateForm = ref<any>({
  id: '',
  deviceName: '',
  deviceCode: '',
  deviceMonitorType: [],
  createTime: 0,
  location: '',
  longitude: '',
  latitude: '',
})
const message = useMessage()
const handleSave = async () => {
  const res = await deviceInfoUpdate({
    ...updateForm.value,
    createTime: new Date(updateForm.value.createTime).valueOf()
  })
  if (res) message.success("操作成功！")
  editEnabled.value = false
}

const emit = defineEmits(['update:modelValue'])
const reset = () => {
  const chartOutWrapper = document.getElementById("chartOutWrapper")
  if (!chartOutWrapper) return
  chartOutWrapper.innerHTML = ''
  const chartInstances = document.querySelectorAll('.chart-ins')
  chartInstances.forEach((item: HTMLElement) => {
    item.style.height = '0px'
    item.style.marginTop = '0px'
  })
  title.value = ''
  time.value = ''
  editEnabled.value = false
  activeTab.value = '设备概要'
  curDeviceStatus.value = ''
  curVideoLink.value = ''
  curDeviceKind.value = ''
}
const handleClose = () => {
  reset()
  emit('update:modelValue', false)
}

defineExpose({ getDeviceInfoData })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const activeTab = ref<string>('设备概要')

const currentWindowHeight = ref(1000)
const getCurrentHeight = () => {
  const panelTangBaDom = document.getElementById("panelTangBaDom")
  currentWindowHeight.value = panelTangBaDom?.clientHeight || 1000
}
onMounted(() => { getCurrentHeight() })
window.addEventListener('resize', () => getCurrentHeight())

</script>
<style lang="scss" scoped>
.panel-animation-in {
  animation: slide-in .7s ease forwards;
}

.panel-animation-out {
  animation: slide-out .7s ease forwards;
}

@keyframes slide-in {
  0% { transform: translateX(100%);}
  100% { transform: translateX(0%);}
}

@keyframes slide-out {
  0% { transform: translateX(0%);}
  100% { transform: translateX(100%);}
}

.tab-title-wrapper {
  font-family: 'ArtFont';
  padding: 0rem 1.4rem .4rem 2rem;
  background-image: url(./assets/tangba/itemHeader.png);
  background-size: 100% 100%;
}

.form-inner-label {
  width: 5rem;
}

#chartOutWrapper {
  display: flex;
  flex-direction: column;
}


#chartWD,
#chartSD,
#chartPH,
#chartEC,
#chartN,
#chartP,
#chartK,
#chartLight,
#chartAtmos,
#chartGrow,
#chartRain,
#chartWindDirec,
#chartWindSpeed
{
  background: linear-gradient(to top, #ebf3ff, #ebf3ff40);
  height: 0px;
  overflow: hidden;
}
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
