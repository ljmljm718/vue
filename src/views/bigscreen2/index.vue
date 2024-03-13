<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="linear-font-title header-title-wrapper">巫山县福田镇鲁渝协作乡村振兴示范村数字化赋能</div>
      <div class="header-right-part-wrapper">
        <div class="selector-wrapper">
          <select @change="handleSelectorChange1">
            <option :value="item.id" v-for="item,index in options1" :key="index">{{item.name}}</option>
          </select>
          <select @change="handleSelectorChange2">
            <option :value="item.id" v-for="item,index in options2" :key="index">{{item.name}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="content-main-wrapper">
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">农业资源</span>
          </div>
          <div class="content-main" style="padding: 14px;">
            <div class="panel-1-wrapper">
              <div class="panel-1-item" @click="$router.push('/wsxftzTeaPlantation/wsParkManagement/wsxparkbase?grade=0')">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">园区数量</div>
                  <div class="panel-1-value">
                    <span>{{ baseCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">个</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item"  @click="$router.push('/wsxftzTeaPlantation/wsParkManagement/wsxparkbase?grade=10')">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">地块数量</div>
                  <div class="panel-1-value">
                    <span>{{ teaCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">个</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item" @click="$router.push('/wsxftzTeaPlantation/wsParkManagement/wsxparkbase?grade=0')">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">种植面积</div>
                  <div class="panel-1-value">
                    <span>{{ areaCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">亩</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item" @click="$router.push('/wsxftzTeaPlantation/wsParkManagement/cropbaseWu')">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">种植品种</div>
                  <div class="panel-1-value">
                    <span>{{ cropNumRef }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">种</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item" @click="$router.push('/wsxftzTeaPlantation/wsPlantingManagement/plantplanWu')">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">种植计划</div>
                  <div class="panel-1-value">
                    <span>{{ plantNumRef }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">个</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item" @click="$router.push('/dict/type/data/kaizhou_agricultural_type')">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">农资类别</div>
                  <div class="panel-1-value">
                    <span>{{ suppliesCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">种</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item" style="grid-row: span 4;z-index: 2;">
        <div class="center-wrapper">
          <div class="top-items-wrapper">
            <div class="top-items-item" @click="$router.push('/basic/device/devicebase')">
              <div class="top-items-item-text">设备总数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.sum }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item" @click="$router.push('/basic/device/devicebase?deviceStatus=online')">
              <div class="top-items-item-text">在线数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.online }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item" @click="$router.push('/basic/device/devicebase?deviceStatus=offline')">
              <div class="top-items-item-text">离线数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.offline }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item" @click="$router.push('/basic/device/devicebase?deviceStatus=fault')">
              <div class="top-items-item-text">故障数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.fault }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item" @click="$router.push('/warning/warning-record?warnStatus=0')">
              <div class="top-items-item-text">预警数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ preWarnCount }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">个</span>
              </div>
            </div>
          </div>
        </div>
        <div id="mainBg">
          <div class="main-tip-dialog" style="left: calc(500px - 120px); bottom: 200px;">
            <div class="main-tip-inner" style="border: 2px solid #35ffd7;">
              <div>{{ monitorInfo.deviceName }}</div>
              <div>{{ monitorInfo.parkName }}</div>
              <div class="divider-bar" style="background-color: #06ef6060;"></div>
              <div>{{ monitorInfo.soilHumidity }}</div>
              <div>{{ monitorInfo.soilTemperature }}</div>
            </div>
            <img src="/images/blue.png" alt="" />
          </div>
          <div class="main-tip-dialog" style="left: calc(900px - 120px); bottom: 400px;">
            <div class="main-tip-inner" style="border: 2px solid red;">
              <div>{{ warnInfo.deviceName }}</div>
              <div>{{ warnInfo.parkName }}</div>
              <div class="divider-bar" style="background-color: #720904;"></div>
              <div>{{ warnInfo.warnInfo }}</div>
            </div>
            <img src="/images/red.png" alt="" />
          </div>
          <div class="main-tip-dialog" style="left: calc(1000px - 120px); bottom: 200px;">
            <div class="main-tip-inner" style="border: 2px solid #00ff04;">
              <div>{{ monitorCenterInfo.deviceName }}</div>
              <div>{{ monitorCenterInfo.teaGarden + '' + monitorCenterInfo.massif }}</div>
              <div class="divider-bar" style="background-color: #00ff0440;"></div>
              <div class="btn-inner">查看监控</div>
            </div>
            <img src="/images/green.png" alt="" />
          </div>
        </div>
        <div class="tool-tips-wrapper">
          <div class="tool-tips-item">
            <img src="/images/blue.png" alt="" />
            <span>摄像头</span>
          </div>
          <div class="tool-tips-item">
            <img src="/images/green.png" alt="" />
            <span>摄像头</span>
          </div>
          <div class="tool-tips-item">
            <img src="/images/red.png" alt="" />
            <span>摄像头</span>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper" @click="$router.push('/IotDevices/devicedataWu')">
          <div class="content-title">
            <span class="linear-font-title">环境监测</span>
          </div>
          <div class="content-main panel-2-wrapper">
            <div class="panel-2-item">
              <div class="panel-2-icon icon-1"></div>
              <div class="panel-text-wrapper">
                <div class="panel-text-inner" style="font-size: .8rem;">温度</div>
                <div class="panel-text-inner">
                  <span style="font-size: 1.2rem;font-family: 'TitleFont';">{{ detectData.env_temperature }}</span>
                  ℃
                </div>
              </div>
            </div>
            <div class="panel-2-item">
              <div class="panel-2-icon icon-2"></div>
              <div class="panel-text-wrapper">
                <div class="panel-text-inner" style="font-size: .8rem;">风速</div>
                <div class="panel-text-inner">
                  <span style="font-size: 1.2rem;font-family: 'TitleFont';">{{ detectData.env_speed }}</span>
                  m/s
                </div>
              </div>
            </div>
            <div class="panel-2-item">
              <div class="panel-2-icon icon-3"></div>
              <div class="panel-text-wrapper">
                <div class="panel-text-inner" style="font-size: .8rem;">风向</div>
                <div class="panel-text-inner">
                  <span style="font-size: 1.2rem;font-family: 'TitleFont';">{{ detectData.env_wind }}</span>
                </div>
              </div>
            </div>
            <div class="panel-2-item">
              <div class="panel-2-icon icon-4"></div>
              <div class="panel-text-wrapper">
                <div class="panel-text-inner" style="font-size: .8rem;">CO₂浓度</div>
                <div class="panel-text-inner">
                  <span style="font-size: 1.1rem;font-family: 'TitleFont';">{{ detectData.co2_num }}</span>
                  ppm
                </div>
              </div>
            </div>
            <div class="panel-2-item">
              <div class="panel-2-icon icon-5"></div>
              <div class="panel-text-wrapper">
                <div class="panel-text-inner" style="font-size: .8rem;">湿度</div>
                <div class="panel-text-inner">
                  <span style="font-size: 1.2rem;font-family: 'TitleFont';">{{ detectData.env_humidity }}</span>
                  %
                </div>
              </div>
            </div>
            <div class="panel-2-item">
              <div class="panel-2-icon icon-6"></div>
              <div class="panel-text-wrapper">
                <div class="panel-text-inner" style="font-size: .8rem;">降雨量</div>
                <div class="panel-text-inner">
                  <span style="font-size: 1.2rem;font-family: 'TitleFont';">{{ detectData.env_rainfall }}</span>
                  mm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div
          class="content-main-inner item-bg-wrapper"
          @click="$router.push('/wsxftzTeaPlantation/wsPlantingManagement/plantplanWu')"
        >
          <div class="content-title">
            <span class="linear-font-title">种植品种分布</span>
          </div>
          <div class="content-main plant-layout-wrapper">
            <div
              class="plant-layout-item"
              v-for="item in leftPlantLayout"
              :key="item.cropType"
            >
              <div class="plant-layout-label">{{ item.cropType }}</div>
              <div class="plant-layout-progress">
                <div class="plant-layout-progress-bar" :style="`width: ${item.proportion};`">
                  <div class="plant-layout-progress-val">{{ item.proportion }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper" @click="$router.push('/IotDevices/devicedataWu')">
          <div class="content-title">
            <span class="linear-font-title">土壤监测</span>
          </div>
          <div class="content-main panel-4-wrapper">
            <div class="panel-4-item scan-1">
              <div style="font-family: 'TitleFont';font-size: 1.3rem;">{{ detectData.soil_temperature }}℃</div>
              <div>温度</div>
            </div>
            <div class="panel-4-item scan-2">
              <div style="font-family: 'TitleFont';font-size: 1.3rem;">{{ detectData.soil_humidity }}%</div>
              <div>湿度</div>
            </div>
            <div class="panel-4-item scan-3">
              <div style="font-family: 'TitleFont';font-size: 1.3rem;">{{ detectData.soil_conductivity }}%</div>
              <div>导电率</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper" @click="$router.push('/erp/purchase/order')">
          <div class="content-title">
            <span class="linear-font-title">采购成本</span>
          </div>
          <div class="content-main" id="chart2"></div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">预警信息</span>
          </div>
          <div class="content-main table-wrapper">
            <table cellspacing="0" border="0" cellpadding="0">
              <thead>
                <tr>
                  <th>地块名称</th>
                  <th>设备</th>
                  <th>预警信息</th>
                  <th>时间</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in preWarnList" :key="index" @click="$router.push('/warning/warning-record')">
                  <td>{{ item.parkName }}</td>
                  <td>{{ item.deviceName }}</td>
                  <td>{{ item.warnInfo }}</td>
                  <td>{{ item.warnTime }}</td>
                  <td>{{ item.warnStatus == '0' ? '未处理' : '已处理' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper" @click="$router.push('/wsxftzTeaPlantation/wsPlantingManagement/farm-record')">
          <div class="content-title">
            <span class="linear-font-title">茶园产量与收入统计</span>
          </div>
          <div class="content-main" id="chart3"></div>
        </div>
      </div>
      <div class="content-main-item">
        <div
          class="content-main-inner item-bg-wrapper"
          @click="$router.push('/IotDevices/on-line-monitoring')"
          style="position: relative;"
        >
          <div class="content-title">
            <span class="linear-font-title">设备在线率分析</span>
          </div>
          <div class="content-main" id="chart4"></div>
          <div class="btns-wrapper" @click="(e) => { e.stopPropagation() }">
            <div class="btn-item" @click="handleBtnClick('month')">月</div>
            <div class="btn-item" @click="handleBtnClick('day')">日</div>
            <div class="btn-item">
              <input type="date" name="" id="" @change="handleDateChange" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-main-wrapper"></div>
  </div>
</template>
<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import {
  ParkBaseInfo,
  ParkBaseInfo2
} from '@/api/kaizhou/bigscreen/index'
import {
  dictDataPage,
  getBigLeftTopPin,
  getBigLeftTopPlantWu,
  productSumPrice,
  getSumOrderByDate,
  selectOfCustom,
  onlineRateOfCustom,
  monitoringSelectState,
  onlineRateNormal,
  onlineNumNormal,
  getCountSum,
  deviceBaseList,
  largeScreenGetWarningNum,
  largeScreenGetWarning,
  getBigLeftCentrePlantWu,
  largeScreenGetDeviceData,
  largeScreenGetOneDeviceData,
  largeScreenGetOneWarning
} from '@/api/wushan/bigscreen/index'
import { onMounted, ref } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'

const handleBtnClick = (type) => {
  getSelectOfCustom(type)
}

const handleDateChange = (e) => {
  getSelectOfCustom('custom', e.target.value)
}

const options1 = ref<Array<any>>([])
const getOptions1 = async (parentId = '0') => {
  const res = await ParkBaseInfo({ parentId });
  options1.value = res
  getOptions2(options1.value[0].id)
}
getOptions1()

const options2 = ref<Array<any>>([])
const getOptions2 = async (parentId) => {
  const res = await ParkBaseInfo2({ parentId })
  options2.value = res
  handleSelectorChange2({
    target: { value: res[0].id}
  })
}

const handleSelectorChange1 = (val) => {
  getOptions2(val.target.value)
}
const handleSelectorChange2 = (val) => {
  const parentId = val.target.value || 0
  getLargeScreenGetOneDeviceData(parentId)
  getLargeScreenGetOneWarning(parentId)
  getLargeScreenGetDeviceData(parentId)
}

const monitorCenterInfo = ref({
  deviceCode: "",
  deviceName: "",
  massif: "",
  teaGarden: ""
})
const getmonitoringSelectState = async () => {
  const res = await monitoringSelectState({});
  console.log('res monitor', res)
  monitorCenterInfo.value = res
}
getmonitoringSelectState()

// 大屏中间获取一条监测信息
const monitorInfo = ref({
  deviceName: "",
  parkName: "",
  soilHumidity: "",
  soilTemperature: ""
})
const getLargeScreenGetOneDeviceData = async (parkId = 0) => {
  const res = await largeScreenGetOneDeviceData({ parkId })
  console.log('大屏中间获取一条监测信息', res);
  monitorInfo.value = res
}
getLargeScreenGetOneDeviceData()

// 大屏中间获取一条预警信息
const warnInfo = ref({
  deviceName: "",
  parkName: "",
  warnInfo: ""
})
const getLargeScreenGetOneWarning = async (parkId = 0) => {
  const res = await largeScreenGetOneWarning({ parkId })
  console.log('大屏中间获取一条预警信息', res);
  warnInfo.value = res
}
getLargeScreenGetOneWarning()

// 获取左边中间种植品种分布
const leftPlantLayout = ref<Array<any>>([])
const getGetBigLeftCentrePlantWu = async () => {
  const res = await getBigLeftCentrePlantWu()
  console.log('resss', res);
  leftPlantLayout.value = res
  leftPlantLayout.value = [{
    "proportion": "57.98%",
    "cropType": "绿茶"
  },
  {
    "proportion": "21.57%",
    "cropType": "红茶"
  },
  {
    "proportion": "20.45%",
    "cropType": "白茶"
  }]
}
getGetBigLeftCentrePlantWu()

// 大屏右上角获取环境监测与土壤检测数据
const detectData = ref({
  co2_num: "0",
  env_humidity: "0",
  env_rainfall: "0",
  env_speed: "0",
  env_temperature: "0",
  env_wind: "-",
  soil_conductivity: "0",
  soil_humidity: "0",
  soil_temperature: "0"
})
const getLargeScreenGetDeviceData = async (parkId = 0) => {
  const res = await largeScreenGetDeviceData({ parkId })
  detectData.value = res
}
getLargeScreenGetDeviceData()

// 农资类别统计
const suppliesCount = ref(0)
const getdictDataPage = async () => {
  const { total = 0 } = await dictDataPage({
    pageNo: 1,
    pageSize: 10,
    dictType: 'kaizhou_agricultural_type'
  })
  suppliesCount.value = total;
}
getdictDataPage()

// 大屏中上方获取预警记录未处理数量
const preWarnCount = ref(0)
const getLargeScreenGetWarningNum = async () => {
  const { warningNum = '0' } = await largeScreenGetWarningNum()
  preWarnCount.value = warningNum;
}
getLargeScreenGetWarningNum()

// 右侧预警信息列表
const preWarnList = ref([])
const getlargeScreenGetWarning = async () => {
  const res = await largeScreenGetWarning({ pageSize: 3 })
  preWarnList.value = res;
}
getlargeScreenGetWarning()

// 园区、地块、面积统计个数
const baseCount = ref(0), teaCount = ref(0), areaCount = ref(0)
const getGetCountSum = async () => {
  const list = await getCountSum()
  console.log('list', list);
  
  if (Array.isArray(list)) list.forEach(item => {
    if (item.type === 'massif_base') {
      // 地块
      teaCount.value = item.nameCount
    }
    if (item.type === 'park_tea') {
      // 基地
      baseCount.value = item.nameCount
      areaCount.value = item.area || 0
    }
  })
}
getGetCountSum()

// 大屏中央设备数量统计
const centerDeviceCount = ref({
  camera: "0",
  fault: "0",
  offline: "0",
  online: "0",
  produc: "0",
  sensor: "1",
  sum: "0"
})
const getDeviceBaseList = async () => {
  const res = await deviceBaseList();
  if (Array.isArray(res) && res.length === 1) {
    centerDeviceCount.value = res[0]
  }
}
getDeviceBaseList()

const cropNumRef = ref(0) // 种植品种数量
const getGetBigLeftTopPin = async () => {
  const { cropNum = 0 } = await getBigLeftTopPin()
  cropNumRef.value = cropNum
}
getGetBigLeftTopPin()

const plantNumRef = ref(0) // 种植计划数量
const getGetBigLeftTopPlantWu = async () => {
  const { plantNum = 0 } = await getBigLeftTopPlantWu()
  plantNumRef.value = plantNum
}
getGetBigLeftTopPlantWu()

// Chart2
const getProductSumPrice = async () => {
  const ResList = await productSumPrice()
  const data = ResList.map((item: any) => ({
    name: item.name,
    value: item.purchasePrice
  }))
  initChartStatic(
    'chart2',
    generatePieOptions({
      legend: {
        show: true,
        top: 'center',
        right: '4%',
        itemWidth: 12,
        itemHeight: 12
      },
      color: ['#00b4ff', '#00f496', '#3b72ad'],
      series: [
        {
          name: '种植资源',
          type: 'pie',
          radius: ['40%', '62%'],
          center: ['35%', '50%'],
          data: data,
          label: {
            // formatter: "{c|{c}},{d|{d}%}",
            formatter: '\n{c}\n {d}%',
            color: '#fff',
            borderWidth: 0,
            rich: {
              c: {
                color: '#000',
                fontSize: 20
              },
              d: {
                color: '#fff',
                fontSize: 10
              }
            }
          }
        }
      ]
    }),
    'dark'
  )
}
onMounted(() => { getProductSumPrice() })

// 茶园产量与收入统计
const getGetSumOrderByDate = async () => {
  let data = await getSumOrderByDate();
  if (!data || data.length === 0) data = [
    {
      "month": "2023-12",
      "wushan_output": 63.3,
      "wushan_income": 1892.67
    },
    {
      "month": "2024-01",
      "wushan_output": 26.3,
      "wushan_income": 2051.4
    },
    {
      "month": "2024-02",
      "wushan_output": 134.6,
      "wushan_income": 54867.5
    },
    {
      "month": "2024-03",
      "wushan_output": 7.97,
      "wushan_income": 3166.71
    }
  ]

  const axis = data.map(item => (item.month))
  const list1 = data.map(item => (item.wushan_output))
  const list2 = data.map(item => (item.wushan_income))

  initChartStatic(
    "chart3",
    generateBaseOptions({
      xAxis: {
        data: axis,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#fff",
          },
        },
      },
      legend: {
        show: true,
        orient: 'horizontal',
        x: 'center',
        itemWidth: 15,
        itemHeight: 15,
      },
      color: ["#30c3ef", "#36e1d9"],
      yAxis: [{
        name: 'kg',
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff60",
          },
        },
        axisLabel: {
          // 刻度标签的样式
          hideOverlap: true, // 隐藏重叠的标签
          color: "#9b9ba4",
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: "#ffffff40", //网格线颜色
            width: 1, //网格线的加粗程度
            type: "dashed", //网格线类型
          },
        },
        splitArea: {
          //网格区域
          show: false, //是否显示
        },
      }, {
        name: '元',
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff60",
          },
        },
        axisLabel: {
          // 刻度标签的样式
          hideOverlap: true, // 隐藏重叠的标签
          color: "#9b9ba4",
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: "#ffffff40", //网格线颜色
            width: 1, //网格线的加粗程度
            type: "dashed", //网格线类型
          },
        },
        splitArea: {
          //网格区域
          show: false, //是否显示
        },
      }],
      series: [
        {
          name: '公斤数',
          data: list1,
          yAxisIndex: 0,
          type: "bar",
          barWidth: "20",
          smooth: false,
          barGap: '70%',
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              color: "#eee",
              fontSize: 10,
            },
          },
        },
        {
          name: '价格',
          data: list2,
          yAxisIndex: 1,
          type: "line",
          smooth: true,
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              color: "#eee",
              fontSize: 10,
            },
          },
        },
      ],
      grid: {
        left: "9%",
        right: "12%",
        top: "20%",
        bottom: "17%",
      },
    })
  );
}
onMounted(() => { getGetSumOrderByDate() })

const formatDate = (d = new Date()) => {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// 右下角在线率 type day month custom
const getSelectOfCustom = async (type = 'day', endDate = formatDate()) => {
  let data:Array<any> = await onlineRateNormal({
    type,
    startDate: '2023-01-05',
    endDate
  })

  let dataNum:Array<any> = await onlineNumNormal({
    type,
    startDate: '2023-01-05',
    endDate
  })

  console.log('data1', data);
  console.log('dataNum', dataNum);
  

  const axis = data.map(item => (item.createDate)).reverse()
  const listRate = data.map(item => (item.sum)).reverse()
  const listNum = dataNum.map(item => (item.sum)).reverse()

  initChartStatic(
    "chart4",
    generateBaseOptions({
      xAxis: {
        data: axis,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff60",
          },
        },
      },
      legend: {
        show: true,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15,
      },
      color: ["#30c3ef", "#36e1d9"],
      yAxis: {
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff20",
          },
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: "#ffffff60", //网格线颜色
            width: 1, //网格线的加粗程度
            type: "dashed", //网格线类型
          },
        },
        splitArea: {
          //网格区域
          show: false, //是否显示
        },
      },
      series: [
        {
          name: '在线率',
          data: listRate,
          type: "line",
          barWidth: "20",
          smooth: true,
          barGap: '70%',
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              color: "#eee",
              fontSize: 10,
            },
          },
        },
        {
          name: '在线数量',
          data: listNum,
          type: "bar",
          barWidth: "20",
          smooth: false,
          barGap: '70%',
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              color: "#eee",
              fontSize: 10,
            },
          },
        },
      ],
      grid: {
        left: "10%",
        right: "6%",
        top: "17%",
        bottom: "17%",
      },
    })
  );
}

onMounted(() => { getSelectOfCustom() })
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);

.bigscreen2-wrappper {
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/bg.png);
  background-size: 100% 100%;

  .content-main-wrapper {
    display: grid;
    grid-template-columns: 25% 50% 25%;
    grid-template-rows: repeat(4, 25%);

    .content-main-item {
      padding: 10px;
      position: relative;
      z-index: 9;

      .content-main-inner {
        height: 100%;

        .content-title {
          height: 18%;
          padding-left: 8%;
          padding-top: 5px;
          display: flex;
          align-items: center;
          font-family: 'TitleFont';
        }

        .content-main {
          height: 82%;
        }
        .btns-wrapper {
          display: flex;
          position: absolute;
          top: calc(18% + 2px);
          left: .8rem;
          .btn-item {
            margin: 0 .3rem;
            padding: .1rem .6rem;
            background-color: #017363;
            font-size: .7rem;
            border-radius: 3px 0 3px 0;
            input {
              background-color: #017363;
              color: white;
              border: none
            }
          }
        }
      }

      .item-bg-wrapper {
        background-image: url(./assets/itemBg.png);
        background-size: 100% 100%;
      }
    }
  }
}

.panel-1-wrapper {
  width: 100%;
  height: calc(100% - 28px);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;

  .panel-1-item {
    .panel-1-item-inner {
      width: 100%;
      height: 100%;
      background-image: url(./assets/panel1.png);
      background-size: auto 70%;
      background-position: center center;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .panel-1-title {
        color: white;
        margin-bottom: 8px;
        font-size: 0.8rem;
      }

      .panel-1-value {
        color: #00fecb;
        margin-bottom: 20px;
        font-family: 'TitleFont';
      }
    }
  }
}

.panel-2-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  padding: .8rem;

  .panel-2-item {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .panel-2-icon {
      width: 2.5rem;
      height: 2.5rem;
      background-size: 100% 100%;
    }

    .panel-text-wrapper {
      width: 6.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .panel-text-inner {
        padding: 2px 10px;
      }
    }
  }
}

.panel-4-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100%;

  .panel-4-item {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: auto 60%;
    padding: 20px 0 16px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
}

.linear-font-title {
  background-image: linear-gradient(to top, #5bdcc2, white) !important;
  -webkit-background-clip: text;
  color: transparent;
}

.center-wrapper {
  position: relative;

  .top-items-wrapper {
    position: absolute;
    left: 10%;
    top: 1rem;
    width: 80%;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(5, 1fr);

    .top-items-item {
      aspect-ratio: 1;
      background-image: url(./assets/TopBg.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 80% auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .top-items-item-text {
        font-family: 'TitleFont';
        padding: 4px 0;
      }
    }
  }
}

.selector-wrapper {
  float: right;
  margin-right: 1rem;
  margin-top: 1rem;
  select {
    margin: 0 .3rem;
    padding: .2rem .3rem;
    border-radius: .4rem 0 .4rem 0;
    background-color: #0a2019;
    color: white;
    border: 2px solid #00fbc9;
  }
}

#mainBg {
  width: 1600px;
  height: 800px;
  background-image: url(./assets/image.png);
  background-size: 100% 100%;
  position: relative;
  left: calc(50% - 800px);
  top: calc(50% - 400px);
  .divider-bar {
    width: 100%;
    margin: .6rem 0;
    height: 2px;
  }
  .main-tip-dialog {
    width: 240px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-tip-inner {
      padding: .6rem 1rem;
      background-color: #0a2019b3;
      width: 100%;
      font-size: .8rem;
      .btn-inner {
        width: 80%;
        margin-left: 10%;
        aspect-ratio: 4;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url(./assets/btn.png);
        background-size: 100% 100%;
        font-family: 'TitleFont';
        font-size: 1.2rem;
      }
    }
  }
}

.tool-tips-wrapper {
  position: fixed;
  left: 35vw;
  width: 30vw;
  bottom: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .tool-tips-item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 1rem;
  }
}

#chart1,
#chart2,
#chart3,
#chart4 {
  border: 1px solid #ff000000;
}

.plant-layout-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  .plant-layout-item {
    width: 90%;
    margin-left: 5%;
    padding: .4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .plant-layout-label {
      font-size: .9rem;
    }
    .plant-layout-progress {
      width: 95%;
      margin-top: .2rem;
      height: .6rem;
      background-color: #065148;
      border-radius: 3px;
      .plant-layout-progress-bar {
        background-color: #00fbc9;
        height: 100%;
        position: relative;
        .plant-layout-progress-val {
          position: absolute;
          right: -4.3rem;
          top: -6px;
          font-family: 'TitleFont';
        }
      }
    }
  }
}

.table-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.table-wrapper {
  background-color: #5bdcc228;
  width: calc(100% - .6rem);
  height: calc(100% - 3.2rem) !important;
  overflow: auto;
  padding: 0 .6rem .3rem .6rem;
  font-size: .8rem;
  tr {
    background-image: url(./assets/rect.png);
    background-size: 100% 100%;
  }

  td, th {
    /* border-right: 1px solid gray;
    border-bottom: 1px solid gray; */
    width: 100px;
    height: 30px;
    box-sizing: border-box;
    text-align: center;
    padding: .3rem;
  }
  td {
    height: 35px !important;
  }

  th {
    background-color: #0a2019;
  }


  table {
    border-collapse: separate;
    table-layout: fixed;
    width: 100%;
  }

  /* td:first-child, th:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: lightpink;
  } */

  thead tr th {
    position: sticky;
    top: 0;
    /* 第一列最上 */
  }

  /* th:first-child {
    z-index: 2;
    background-color: lightblue;
  } */
}

@for $i from 1 through 6 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}

@for $i from 1 through 3 {
  .scan-#{$i} {
    background-image: url(./assets/scan#{$i}.png);
  }
}
</style>