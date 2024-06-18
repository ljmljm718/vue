<template>
  <div
    :class="`bg-white w-[600px] h-full p-3 box-border pr-1 ${props.modelValue ? 'panel-animation-in' : 'panel-animation-out'}`"
    id="panelTangBaDom"
  >
    <div class="flex justify-between items-start p-2 pb-1">
      <div>
        <div class="art-font">
          <span class="pr-3">{{ title }}</span>
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
          <div class="grid grid-cols-3 gap-2 py-2 min-h-[100px]" v-loading="runTimeDataLoading">
            <div
              class="bg-slate-200 p-3 py-2 flex justify-between items-center"
              v-for="item in runTimeDataList"
              :key="item.type"
            >
              <div>{{ item.type }}</div>
              <div>
                <span>{{ item.dataValue }}</span>
                <span>{{ item.units }}</span>
              </div>
            </div>
          </div>
          <div class="tab-title-wrapper mt-2">统计数据</div>
          <div id="chartWD" class="chart-ins"></div>
          <div id="chartSD" class="chart-ins"></div>
          <div id="chartPH" class="chart-ins"></div>
          <div id="chartEC" class="chart-ins"></div>
          <div id="chartN" class="chart-ins"></div>
          <div id="chartP" class="chart-ins"></div>
          <div id="chartK" class="chart-ins"></div>
          <div id="chartLight" class="chart-ins"></div>
          <div id="chartAtmos" class="chart-ins"></div>
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
import {
  getEquipmentDataById,
  getWarningRecordList,
  deviceInfoUpdate
} from './apis'
import {
  initChartStatic,
  generateBaseOptions
} from "../../utils/bigscreenTool/index";
import * as echarts from 'echarts'
defineOptions({ name: 'PanelTangBa' })

const runTimeDataLoading = ref<boolean>(false)
const runTimeDataList = ref<Array<any>>([])
const getRunTimeData = async (equipmentId) => {
  if (!equipmentId) return
  runTimeDataLoading.value = true
  const res = await getEquipmentDataById({ equipmentId }).catch(() => { runTimeDataLoading.value = false })
  console.log("getRunTimeData", res);
  runTimeDataLoading.value = false
  runTimeDataList.value = []
  Object.keys(res).forEach(item => {
    if (Array.isArray(res[item]) && res[item].length > 0) runTimeDataList.value.push(res[item][0])
  })

  const {
    temperature = [],
    potassium = [],
    ecValue = [],
    humidity = [],
    lightIntensity = [],
    nitrogen = [],
    pHValue = [],
    phosphorus = [],
    atmosphericPressure = []
  } = res

  const generateXY = (arr:Array<any>) => {
    const x:Array<any> = [], y:Array<any> = []
    arr.forEach((item:any) => {
      x.push(item.hour);
      y.push(item.dataValue)
    })
    return { x, y }
  }

  const { x:WDX, y:WDY } = generateXY(temperature)
  initChart('chartWD', WDX, WDY, '℃', '土壤温度')

  const { x:SDX, y:SDY } = generateXY(humidity)
  initChart('chartSD', SDX, SDY, '%RH', '土壤湿度')

  const { x:PHX, y:PHY } = generateXY(pHValue)
  initChart('chartPH', PHX, PHY, 'ph', 'PH值')

  const { x:ECX, y:ECY } = generateXY(ecValue)
  initChart('chartEC', ECX, ECY, 'mS/cm', 'EC值')

  const { x:LightX, y:LightY } = generateXY(lightIntensity)
  initChart('chartLight', LightX, LightY, 'Lux', '光照')

  const { x:NX, y:NY } = generateXY(nitrogen)
  initChart('chartN', NX, NY, 'mg/Kg', '氮')

  const { x:PX, y:PY } = generateXY(phosphorus)
  initChart('chartP', PX, PY, 'mg/Kg', '磷')

  const { x:KX, y:KY } = generateXY(potassium)
  initChart('chartK', KX, KY, 'mg/Kg', '钾')

  const { x:AtmosX, y:AtmosY } = generateXY(atmosphericPressure)
  initChart('chartAtmos', AtmosX, AtmosY, 'hpa', '大气压力')
}

const initChart = (
  chartName = '',
  xValue:Array<any> = [],
  yValue:Array<any> = [],
  unit = '', text = ''
) => {
  if (xValue.length === 0) return
  const dom = document.getElementById(chartName)
  if (dom) dom.style.height = '220px';
  nextTick(() => {
    initChartStatic(
      chartName,
      generateBaseOptions({
        title: {
          text,
          textStyle: {
            fontSize: 12
          },
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
          name: unit,
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
          top: '23%',
          bottom: '15%'
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

  setTimeout(() => { item.id && getRunTimeData(item.id) }, 300)
  
  item.deviceCode && getWarnDataList(item.deviceCode)
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
  const chartInstances = document.querySelectorAll('.chart-ins')
  chartInstances.forEach((item: HTMLElement) => {
    item.style.height = '0px'
  })
  title.value = ''
  time.value = ''
  editEnabled.value = false
  activeTab.value = '设备概要'
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

#chartWD,
#chartSD,
#chartPH,
#chartEC,
#chartN,
#chartP,
#chartK,
#chartLight,
#chartAtmos
{
  background: linear-gradient(to top, #ebf3ff, #ebf3ff40);
  height: 0px;
  margin-top: 12px;
  overflow: hidden;
}
</style>
