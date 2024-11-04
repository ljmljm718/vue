<template>
  <div
    :class="`bg-white w-[600px] h-full p-3 box-border pr-1 ${props.modelValue ? 'panel-animation-in' : 'panel-animation-out'}`"
    id="panelTangBaDom"
  >
    <div class="flex justify-between items-start p-2 pb-1">
      <div>
        <div class=" flex items-center">
          <span class="pr-3 text-[18px]">{{ title }}</span>
          <el-tag
            :type="`${curDeviceStatus === 'online' ? 'success' : 'danger'}`"
          >{{ curDeviceStatus === 'online' ? '在线' : '离线' }}</el-tag>
        </div>
        <div class="text-sm my-10px color-[#9b9b9b]">{{ time }}</div>
      </div>
      <el-icon class="mr-2" @click="handleClose"><Close /></el-icon>
    </div>
    <div class="w-full flex mb-10px items-center">
      <div @click="handleClick('设备概要',true)" style="cursor: pointer;" :class="`${tabsVal=='设备概要'?'active':'actived'} text-center leading-30px w-[33%] h-30px rounded-l`">设备监测</div>
      <div @click="handleClick('报警',true)" style="cursor: pointer;" :class="`${tabsVal=='报警'?'active':'actived'} text-center leading-30px w-[33%] h-30px`">报警</div>
      <div @click="handleClick('设备属性',true)" style="cursor: pointer;" :class="`${tabsVal=='设备属性'?'active':'actived'} text-center leading-30px w-[33%] h-30px rounded-r`">设备属性</div>
    </div>
    <div>
      <div v-show="tabsVal === '设备概要'">
      <el-scrollbar :height="`${currentWindowHeight - 135}px`" class="px-2">
          <div class="tab-title-wrapper" v-show="!runTimeDataLoading && runTimeDataList.length > 0">实时数据</div>
          <div
            class="grid grid-cols-4 gap-2 py-2 min-h-[100px]"
            v-loading="runTimeDataLoading"
            v-show="!runTimeDataLoading && runTimeDataList.length > 0"
          >
            <div
              class="bg-slate-200 data-bg flex flex-col w-100% h-100px justify-evenly items-center"
              v-for="item in runTimeDataList"
              :key="item.id"
            >
              <!-- <div v-show="item.monitoringType=='温度'" :class="`w-2rem h-2rem tb-home-1 `"></div>
              <div v-show="item.monitoringType=='湿度'" :class="`w-2rem h-2rem tb-home-2 `"></div>
              <div v-show="item.monitoringType=='PH值' || item.monitoringType=='PH'" :class="`w-2rem h-2rem tb-home-3 `"></div>
              <div v-show="item.monitoringType=='EC值'" :class="`w-2rem h-2rem tb-home-4 `"></div>
              <div v-show="item.monitoringType=='光照'" :class="`w-2rem h-2rem tb-home-5 `"></div>
              <div v-show="item.monitoringType=='雨量'" :class="`w-2rem h-2rem tb-home-6 `"></div>
              <div v-show="item.monitoringType=='氮'" :class="`w-2rem h-2rem tb-home-7 `"></div>
              <div v-show="item.monitoringType=='磷'" :class="`w-2rem h-2rem tb-home-8 `"></div>
              <div v-show="item.monitoringType=='钾'" :class="`w-2rem h-2rem tb-home-9 `"></div>
              <div v-show="item.monitoringType=='风向'" :class="`w-2rem h-2rem tb-home-10 `"></div>
              <div v-show="item.monitoringType=='风速'" :class="`w-2rem h-2rem tb-home-11 `"></div>
              <div v-show="item.monitoringType=='大气压力'" :class="`w-2rem h-2rem tb-home-12 `"></div>
              <div v-show="item.monitoringType=='虫害种类'" :class="`w-2rem h-2rem tb-home-13 `"></div>
              <div v-show="item.monitoringType=='虫害数量'" :class="`w-2rem h-2rem tb-home-14 `"></div>
              <div v-show="item.monitoringType=='TDS'" :class="`w-2rem h-2rem tb-home-15 `"></div>
              <div v-show="item.monitoringType=='浊度'" :class="`w-2rem h-2rem tb-home-16 `"></div>
              <div v-show="item.monitoringType=='溶解氧饱和度'" :class="`w-2rem h-2rem tb-home-17 `"></div>
              <div v-show="item.monitoringType=='溶解氧浓度'" :class="`w-2rem h-2rem tb-home-18 `"></div>
              <div v-show="item.monitoringType=='余氯浓度'" :class="`w-2rem h-2rem tb-home-19 `"></div>
              <div v-show="item.monitoringType=='ORP'" :class="`w-2rem h-2rem tb-home-20 `"></div>
              <div v-show="item.monitoringType=='电导率'" :class="`w-2rem h-2rem tb-home-21 `"></div>
              <div v-show="item.monitoringType=='盐度'" :class="`w-2rem h-2rem tb-home-22 `"></div>
              <div v-show="item.monitoringType=='总辐射'" :class="`w-2rem h-2rem tb-home-23 `"></div>
              <div v-show="item.monitoringType=='当前雨量'" :class="`w-2rem h-2rem tb-home-24 `"></div>
              <div v-show="item.monitoringType=='风力'" :class="`w-2rem h-2rem tb-home-25 `"></div>
              <div v-show="item.monitoringType=='空气温度'" :class="`w-2rem h-2rem tb-home-26 `"></div>
              <div v-show="item.monitoringType=='空气湿度'" :class="`w-2rem h-2rem tb-home-27 `"></div> -->
              <div :class="`w-2rem h-2rem object-contain ${item.icon}`"></div>
              <div>{{ item.monitoringType }}</div>
              <div>
                <span>{{ item.dataValue }}</span>
                <span>{{ item.yyUnit }}</span>
              </div>
            </div>
          </div>
          <div class="w-full box-border p-5 bg-#00000020" v-show="curDeviceKind === '101'">
            <div v-for="item in pictureList" :key="item.id">
              <img :src="item.capturedImage" class="w-full min-h-10px object-contain" />
            </div>
            <div v-if="pictureList.length === 0" class="w-full flex items-center justify-center py-[3rem]">暂无监控图片</div>
            <!-- <video :src="curVideoLink" autoplay controls muted loop class="w-full aspect-video"></video> -->
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
              <el-table-column label="测量类型" prop="measureType" >
                <template #default="scope">
                 <dict-tag :type="DICT_TYPE.AGRI_GROW_TYPE" :value="scope.row.measureType"/>
                </template>
              </el-table-column>
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
          
          <div class="tab-title-wrapper mt-2" v-show="chartNum !== 0">统计数据</div>
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
    </div>
    <div v-show="tabsVal==='报警'">
      <el-scrollbar :height="`${currentWindowHeight - 135}px`" class="px-2">
        <el-table
          :data="warnDataList"
          size="small"
          border
          v-loading="warnDataLoading"
          stripe
          v-show="curDeviceKind === '110'"
        >
          <el-table-column align="center" prop="monitoringBaseName" label="基地名称" />
          <el-table-column align="center" prop="monitoringPlotName" label="地块名称" />
          <el-table-column align="center" prop="deviceName" label="设备名称" />
          <el-table-column align="center" prop="noticeEvent" label="事件类型" />
          <el-table-column align="center" prop="remarks" label="消息内容" />
          <el-table-column align="center" label="拍摄时间">
            <template #default="scope">
              {{
                scope.row.recordTime
                  ? dayjs(scope.row.recordTime).format("YYYY-MM-DD")
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column label="抓拍图片" align="center" prop="captured">
            <template #default="scope">
              <el-image
                class="h-50px w-50px"
                lazy
                :src="scope.row.captured"
                :preview-src-list="[scope.row.captured]"
                preview-teleported
                fit="contain"
              />
            </template>
          </el-table-column>
        </el-table>
          <el-table
            :data="warnDataList"
            size="small"
            border
            v-loading="warnDataLoading"
            stripe
            v-show="curDeviceKind !== '101' && curDeviceKind !== '110'"
          >
            <el-table-column label="报警类型" prop="warnType" width="150">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="scope.row.warnType"/>
              </template>
            </el-table-column>
            <el-table-column label="报警等级" prop="warnLevel">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.AGRI_WARN_LEVEL" :value="scope.row.warnLevel"/>
              </template>
            </el-table-column>
            <el-table-column label="报警信息" min-width="100" prop="warnInfo" />
            <el-table-column label="当前值" prop="currentValue" />
            <el-table-column label="阈值" prop="threshold" />
            <el-table-column label="处理状态" prop="warnStatus">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_STATUS" :value="scope.row.warnStatus"/>
              </template>
            </el-table-column>
            <el-table-column
              label="报警时间"
              width="150px"
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
      </div>
    <div v-show="tabsVal==='设备属性'">
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
              <el-button :disabled="!editEnabled" @click="clearChange()">取消</el-button>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
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
  environmentalDataHomePageC,
  getEquipmentDataByEquipmentCode,
  getMonitoringEquipmentDataPage,
  getMonitoringEquipmentNoticePage
} from './apis'
import {
  initChartStatic,
  generateBaseOptions
} from "../../utils/bigscreenTool/index";
import {
  EquipmentDataApi
} from '@/api/agriculture/equipmentdata'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const pictureList = ref<any[]>([])
const getPictureList = async (deviceId:string = '') => {
  const { list } = await getMonitoringEquipmentDataPage({ pageNo: 1, pageSize: 7, deviceId })
  if (Array.isArray(list)) pictureList.value = list
}

const ImageClassList = [
  'EC值', 'ORP', 'PH', 'PH值',
  'pm2.5', 'pm10', 'TDS', '氨氮质浓度值',
  '虫害数量', '虫害种类', '大气压力',
  '氮', '当前雨量', '电池百分比', '电池电压',
  '电导率', '风机状态', '风力', '风速', '风向',
  '光照', '钾', '降雨状态', '空气湿度', '空气温度',
  '磷', '氯', '溶解氧饱和度', '溶解氧浓度', '湿度',
  '土壤湿度', '土壤温度', '温度', '盐度', '液位',
  '引虫灯', '余氯浓度', '雨量', '浊度', '总辐射'
]
const getImgClassByName = (name:string) => {
  const index = ImageClassList.findIndex(item => name.indexOf(item) !== -1);
  return `runtime-icon-${index + 1}`
}

defineOptions({ name: 'PanelTangBa' })

console.log("pinyin", pinyin("汉语拼音", { toneType: "none", type: "array" }).join(''));
//标签切换
const tabsVal=ref('设备概要')
const equipmentIdA = ref('')
const deviceKinds = ref('')
const typeCom=ref<Boolean>(false)
const handleClick = (val,type) => {
    tabsVal.value = val
    runTimeDataList.value=[]
    console.log(runTimeDataList.value,'runTimeDataList1235')
    typeCom.value=type
    if(type){
      getRunTimeData(equipmentIdA.value ,deviceKinds.value)
    }
}
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
const chartNum = ref<number>(0)
const getRunTimeData = async (equipmentId, deviceKind) => {
  equipmentIdA.value = equipmentId
  if (!equipmentId) return
  runTimeDataLoading.value = true
  const res = await getEquipmentDataById({ equipmentId }).catch(() => { runTimeDataLoading.value = false })
  console.log("🚀 ~ getRunTimeData ~ res:", res);
  runTimeDataLoading.value = false

  const activeApi = EquipmentDataApi.getEquipmentDataByEquipmentCode
  if (activeApi && typeCom.value) {
    const list = await activeApi(equipmentId)
    console.log("🚀 ~ getRunTimeData ~ list =>:", list)
    if (Array.isArray(list)) runTimeDataList.value = list.map(item => ({ ...item, icon: getImgClassByName(item.monitoringType || "温度") }));
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
  chartNum.value = 0;
  const chartDataResource = { ...res.normal, ...res.abnormal }
  for (let key in chartDataResource) {
    const domName = pinyin(key, { toneType: "none", type: "array" }).join('')
    const newDom = document.createElement("div")
    newDom.id = domName
    newDom.className = 'tangba-chart-wrapper'
    chartNum.value++
    chartOutWrapper.append(newDom)
    nextTick(() => {
      const unit = chartDataResource[key][0].units || ''
      const { x, y, min, max } = generateXY(chartDataResource[key])
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
            areaStyle: { 
              normal: {},
            },
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
const getWarnDataList = async (deviceCode, deviceKind) => {
  if (!deviceCode) return;
  let requestFunc = getWarningRecordList
  if (deviceKind === '110') requestFunc = getMonitoringEquipmentNoticePage
  warnDataLoading.value = true
  const { list = [], total = 0 } = await requestFunc({ deviceCode, pageSize: 100 }).catch(() => { warnDataLoading.value = false })
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
const clearObj = ref({})
const clearObj2 = ref({})
const getDeviceInfoData = async (item) => {
  console.log("🚀 ~ getDeviceInfoData ~ item:", item)
  if (!(item && item.id)) return;
  getPictureList(item.deviceCode)
  const res = await getEquipmentDataByEquipmentCode({ id:item.id })
  console.log("🚀 ~ getDeviceInfoData ~ res:", res)
  if (Array.isArray(res)) runTimeDataList.value = res.map(item => ({ ...item, icon: getImgClassByName(item.monitoringType || "温度") }));

  reset()
  const {
    id = '',
    url = '',
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
  clearObj.value = item
  curVideoLink.value = url;
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
  let timeDate = res.length > 0? formatTime(res[0].collectionTime, 'yyyy-MM-dd HH:mm:ss') :formatTime(createTime, 'yyyy-MM-dd HH:mm:ss')
  time.value = '最新数据更新于:' + timeDate
  deviceKinds.value = deviceKind
  equipmentIdA.value = item.id
    getRunTimeData(item.id ,deviceKind)
  if (deviceKind === '102') {
    // 生长监控
    getPageA(id)
    getGrowChartData(id)
  }
  
  if (deviceKind === '101') {
    getMonitorVideo(id)
    getMonitorWarnList(id)
  } else {
    item.deviceCode && getWarnDataList(item.id, deviceKind)
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
  chartNum.value = 0
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

defineExpose({ getDeviceInfoData,handleClick })

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
const clearChange = () => {
  
  editEnabled.value = false

  console.log(clearObj.value,'clear123')
  
  console.log(updateForm.value,'updateForm123')

  updateForm.value = clearObj.value 

  
}


</script>
<style lang="scss" scoped>
.panel-animation-in {
  animation: slide-in .7s ease forwards;
}

.panel-animation-out {
  animation: slide-out .7s ease forwards;
}

.active{
  color: #fff;
  padding: 0 !important;
  background-color: #0c67ff;
}
.actived{
  background-color: #e4eeff;
  padding: 0 !important;
}
.el-tab > .el-tabs__item-label div { /* 注意：这里可能需要调整选择器以匹配实际的 DOM 结构 */  
  padding: 0 !important; /* 使用 !important 来确保覆盖默认的样式，但请谨慎使用 */  
  /* 其他样式调整 */  
} 
#tab-设备概要 .el-tabs_item .is-top .is-active{
  padding-right:0 !important;
}
@keyframes slide-in {
  0% { transform: translateX(100%);}
  100% { transform: translateX(0%);}
}

@keyframes slide-out {
  0% { transform: translateX(0%);}
  100% { transform: translateX(100%);}
}
.el-tab-pane {
  padding: 0 !important;
}
.el-tabs__item{
  padding: 0 !important;
}
.tab-title-wrapper {
  // font-family: 'ArtFont';
  font-weight: 500;
  padding: 0rem 1.4rem .4rem 2rem;
  background-image: url(./assets/tangba/itemHeader.png);
  background-size: 100% 100%;
}

@for $i from 1 through 40 {
  .runtime-icon-#{$i} {
    background-image: url(./assets/runtimeIcons/icon#{$i}.png);
    background-size: contain;
  }
}

.form-inner-label {
  width: 5rem;
}

#chartOutWrapper {
  display: flex;
  flex-direction: column;
}
.data-bg{
  background-image: url(./assets/tb-home-bg.png);
  background-size: 100% 100%;
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
@for $i from 1 through 27 {
  .tb-home-#{$i} {
    background-image: url(./assets/tb-home-#{$i}.png);
    background-size:100% 100%;
  }
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
