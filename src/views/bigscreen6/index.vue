<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import { onMounted, ref, watch } from 'vue'
import { initChartStatic, generateBaseOptions } from '../../utils/bigscreenTool/index';
import preWarn from './assets/preWarn.png'
import sensor from './assets/sensor.png'
import monitor from './assets/monitor.png'
import {
  ParkBaseInfo,
  ParkBaseInfo2
} from '@/api/kaizhou/bigscreen/index'
import {
  largeScreenGetWarning,
  largeScreenGetOneWarning,
  waterDetection,
  selectStateNum,
  deviceBaseList,
  waterDetectionType,
  deviceBasePage
} from './apis'

// 单条预警
const onWarningInfo = ref({
  deviceName: "",
  id: "",
  parkName: "",
  warnInfo: ""
})
const getLargeScreenGetOneWarning = async (parkId) => {
  const res = await largeScreenGetOneWarning({ parkId })
  console.log('getLargeScreenGetOneWarninges', res);
  onWarningInfo.value = res
}
getLargeScreenGetOneWarning('1')

const getDeviceBasePage = async () => {
  const { list = [] } = await deviceBasePage();
  console.log('getDeviceBasePage', list);
  Array.isArray(list) ? envOptions.value = list.map(item => ({
    id: item.id, name: item.deviceName
  })) : null
}
getDeviceBasePage()

// 大屏中央设备设备数量统计
const deviceBaseInfo = ref<any>({
  sum: 0, online: 0, offline: 0
})
const getDeviceBaseList = async () => {
  const res = await deviceBaseList()
  console.log('大屏中央设备设备数量统计', res);
  deviceBaseInfo.value = res[0]
}
getDeviceBaseList()

// 预警信息（大屏右下角）
const getlargeScreenGetWarning = async () => {
  const res = await largeScreenGetWarning({ pageSize: 10 })
  if (Array.isArray(res)) tableData.value = res.map(item => ({
    name: item.parkName,
    device: item.deviceName,
    info: item.warnInfo,
    time: item.warnTime,
    status: item.warnStatus === '0' ? '未处理' : '已处理'
  }))
}
getlargeScreenGetWarning()

// 大屏中央设备设备数量统计
const deviceNumCount = ref<Array<any>>([])
const getSelectStateNum = async () => {
  const res = await selectStateNum();
  Array.isArray(res) ? deviceNumCount.value = res : null
}
getSelectStateNum()

// 水质监测（八项参数）
const waterTypeList = ref<Array<any>>([
  {
    "unit": "mg/L",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "ammonia_oxygen"
  },
  {
    "unit": "mg/L",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "nitrite_nitrogen"
  },
  {
    "unit": "ph",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "PH_value"
  },
  {
    "unit": "%",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "salinity"
  },
  {
    "unit": "m",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "water_level"
  },
  {
    "unit": "mg/L",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "dissolved_oxygen"
  },
  {
    "unit": "ppm",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "turbidity"
  },
  {
    "unit": "℃",
    "month": "2024-03-19",
    "dataValue": 0,
    "type": "temperature"
  }
])
const getWaterDetectionType = async () => {
  const res = await waterDetectionType()
  console.log('水质监测（八项参数）', res);
  Array.isArray(res) ? waterTypeList.value = res : null
}
getWaterDetectionType()

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
  console.log('parentId', parentId);
}

// 环境监测 options
const envOptions = ref<Array<any>>([])
const handleEnvSelectorChange = (val) => {}

const tableColumns = ref([
  {
    key: 'name',
    label: '基地名称',
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
  },
])

const tableData = ref<Array<any>>([])

onMounted(() => {
  initChartStatic(
    'chart1',
    generateBaseOptions({
      xAxis: {
        data: ['1', '2', '3', '4', '5', '6'],
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
        name: '℃',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#fff', //网格线颜色
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
          name: 'ss',
          data: [1, 3, 4, 2, 1],
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
          }
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

onMounted(async () => {
  // 水质监测（折线图）
  const res = await waterDetection()
  console.log('res', res);
  
  initChartStatic(
    'chart2',
    generateBaseOptions({
      xAxis: {
        data: ['1', '2', '3', '4', '5', '6'],
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
        name: '℃',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#fff', //网格线颜色
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
          name: 'ss',
          data: [1, 3, 4, 2, 1],
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
          }
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

const rightTabSelected = ref('temperature')
watch(
  () => rightTabSelected.value,
  (newValue) => {
    console.log('newValue', newValue);
  }
)
const rightIconMap = {
  'temperature': 1,
  'salinity': 2,
  'turbidity': 3,
  'water_level': 4,
  'PH_value': 5,
  'dissolved_oxygen': 6,
  'ammonia_oxygen': 7,
  'nitrite_nitrogen': 8
}
const rightLabelMap = {
  'temperature': '温度',
  'salinity': '盐度',
  'turbidity': '浑浊度',
  'water_level': '水位',
  'PH_value': 'PH值',
  'dissolved_oxygen': '溶氧量',
  'ammonia_oxygen': '氨氧量',
  'nitrite_nitrogen': '向亚硝酸盐氮'
}
</script>
<template>
  <div class="bigscreen-main-wrapper">
    <div class="header-main-wrapper header-bg">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="header-title-wrapper">酉阳鲁渝协作示范村数字化赋能</div>
      <div class="header-right-part-wrapper"></div>
    </div>
    <div class="content-main-wrapper grid-container">
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>环境监测</div>
            <div class="selector-wrapper">
              <select @change="handleEnvSelectorChange">
                <option :value="item.id" v-for="item,index in envOptions" :key="index">{{item.name}}</option>
              </select>
            </div>
          </div>
          <div class="main-item-container">
            <div class="card-grid-wrapper">
              <div
                class="card-grid-item"
                v-for="item in 8"
                :key="item"
              >
                <div :class="`icon-wrapper l-icon-${item}`"></div>
                <div class="label-val-wrapper">
                  <div class="value-wrapper">
                    <span class="value">22</span>
                    <span class="unit">℃</span>
                  </div>
                  <div class="label-wrapper">温度</div>
                </div>
                <div class="check-btn">查看</div>
              </div>
            </div>
            <div class="sub-title-wrapper">
              <div style="width: 8px;height: 1rem;background-color: #68fffe;"></div>
              <div style="font-family: 'TitleFont';font-size: 1rem;padding: 0 .3rem;">温度变化趋势</div>
              <div style="width: calc(100% - 7rem);height: 100%;background: linear-gradient(to right, #68fffe, #68fffe00);"></div>
            </div>
            <div
              class="chart-wrapper"
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
            <div class="tool-info" style="left: calc(400px - 100px);bottom: 300px;">
              <div class="info-rect">
                <div class="text-info">
                  <div class="text-row">编号: 125464786434543</div>
                  <div class="text-row">编号: 125464786434543</div>
                  <div class="text-row">编号: 125464786434543</div>
                  <div class="text-row">编号: 125464786434543</div>
                </div>
              </div>
              <img :src="monitor" alt="" />
            </div>

            <div class="tool-info" style="left: calc(600px - 100px);bottom: 100px;">
              <div class="info-rect">
                <div class="text-info">
                  <div class="text-row">编号: 125464786434543</div>
                  <div class="text-row">编号: 125464786434543</div>
                  <div class="text-row">编号: 125464786434543</div>
                  <div class="text-row">编号: 125464786434543</div>
                </div>
              </div>
              <img :src="sensor" alt="" />
            </div>
            <div class="tool-info" style="left: calc(900px - 100px);bottom: 200px;">
              <div class="info-rect">
                <div class="text-info">
                  <div class="text-row">位置: {{ onWarningInfo.parkName }}</div>
                  <div class="text-row">设备: {{ onWarningInfo.deviceName }}</div>
                  <div class="text-row">
                    预警信息:
                    <span  style="color: #ff0000;">{{ onWarningInfo.warnInfo }}</span>
                  </div>
                </div>
              </div>
              <img :src="preWarn" alt="" />
            </div>
          </div>
          <div class="top-card-wrapper">
            <div class="top-card-item">
              <div class="label-card">设备总数</div>
              <div class="value-card">{{ deviceBaseInfo.sum }}</div>
            </div>
            <div class="top-card-item">
              <div class="label-card">在线总数</div>
              <div class="value-card">{{ deviceBaseInfo.online }}</div>
            </div>
            <div class="top-card-item">
              <div class="label-card">离线总数</div>
              <div class="value-card">{{ deviceBaseInfo.offline }}</div>
            </div>
          </div>
          <div class="extra-card-wrappper">
            <div class="top-card-item" v-for="item in deviceNumCount" :key="item">
              <div class="extra-icon t-icon-1"></div>
              <div class="extra-text-wrapper">
                <div class="extra-text-row extra-title-font">
                  <div>{{ item[0].name }}</div>
                  <div>{{ item[0].sum }}</div>
                </div>
                <div class="extra-text-row">
                  <div>在线数量</div>
                  <div style="color: #0fc87c;">{{ item[0].online }}</div>
                </div>
                <div class="extra-text-row">
                  <div>离线数量</div>
                  <div style="color: #c51416;">{{ item[0].offline }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>水质监测</div>
            <div class="selector-wrapper">
              <select @change="handleSelectorChange1">
                <option :value="item.id" v-for="item,index in options1" :key="index">{{item.name}}</option>
              </select>
              <select @change="handleSelectorChange2">
                <option :value="item.id" v-for="item,index in options2" :key="index">{{item.name}}</option>
              </select>
            </div>
          </div>
          <div class="main-item-container">
            <div class="card-grid-wrapper">
              <div
                :class="`card-grid-item ${rightTabSelected === item.type ? 'card-selected' : ''}`"
                v-for="item in waterTypeList"
                :key="item.type"
              >
                <div :class="`icon-wrapper r-icon-${rightIconMap[item.type]}`"></div>
                <div class="label-val-wrapper">
                  <div class="value-wrapper">
                    <span class="value">{{ item.dataValue }}</span>
                    <span class="unit">{{ item.unit  }}</span>
                  </div>
                  <div class="label-wrapper">{{ rightLabelMap[item.type] }}</div>
                </div>
                <div class="check-btn" @click="rightTabSelected = item.type">查看</div>
              </div>
            </div>
            <div class="sub-title-wrapper">
              <div style="width: 8px;height: 1rem;background-color: #68fffe;"></div>
              <div style="font-family: 'TitleFont';font-size: 1rem;padding: 0 .3rem;">{{ rightLabelMap[rightTabSelected] }}变化趋势</div>
              <div style="width: calc(100% - 11rem);height: 100%;background: linear-gradient(to right, #68fffe, #68fffe00);"></div>
            </div>
            <div
              class="chart-wrapper"
              id="chart2"
            ></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>监控设备</div>
          </div>
          <div
            class="main-item-container monitor-device"
            style="flex-direction: row;"
          >
            <div class="monitor-item">
              <div class="video-wrapper"></div>
              <div class="text-wrapper">
                <div class="text-row">名称:董石摄像机</div>
                <div class="text-row">位置:虞溪鱼塘</div>
                <div class="text-row">状态:在线</div>
              </div>
            </div>
            <div class="monitor-item">
              <div class="video-wrapper"></div>
              <div class="text-wrapper">
                <div class="text-row">名称:董石摄像机</div>
                <div class="text-row">位置:虞溪鱼塘</div>
                <div class="text-row">状态:在线</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
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
          }
        }
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
        font-size: .9rem;
      }
    }
  }
  .extra-card-wrappper {
    .top-card-item {
      margin: 0 .4rem;
      padding: .8rem;
      background-image: url(./assets/extraBg.png);
      background-size: 100% 100%;
      display: flex;
      .extra-icon {
        background-size: 100% 100%;
        width: 3rem;
        height: 3rem;
        margin-right: .6rem;
      }
      .extra-text-wrapper {
        width: 9rem;
        .extra-text-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: .8rem;
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
        aspect-ratio: 1.1;
        background-image: url(./assets/infoRect.png);
        .text-info {
          width: calc(100% - 1.6rem);
          height: calc(70% - 1.6rem);
          margin: .8rem;

          .text-row {
            font-size: .9rem;
            padding: .1rem;
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
      padding-left: .7rem;
    }
  }
}

/** 右下角的表格 */
.pre-warn-table {
  position: relative;
  padding: .4rem 1rem !important;
  .table-cell {
    text-align: center;
    font-size: .9rem;
    padding: 0 .1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow:hidden;
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
    font-size: .7rem !important;
    color: #f5f5f5c8;
  }
  .row-wrapper {
    display: flex;
    align-items: center;
    color: aliceblue;
    margin: .3rem 0 .5rem 0;
    padding: .3rem 0;
    padding-bottom: .5rem;
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
      border: 1px solid #ff000044;
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
    margin: 0 .3rem;
    padding: .2rem .3rem;
    border-radius: .4rem .4rem 0 0;
    background-color: #0a2019;
    color: white;
    border: 2px solid #0be3de;
  }
}


@for $i from 1 through 8 {
  .l-icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}
@for $i from 1 through 8 {
  .r-icon-#{$i} {
    background-image: url(./assets/rcon#{$i}.png);
  }
}
@for $i from 1 through 4 {
  .t-icon-#{$i} {
    background-image: url(./assets/tcon#{$i}.png);
  }
}
</style>