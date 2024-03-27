<script setup lang="ts">
import * as echarts from 'echarts';
import {
  getParkTree,
  getDeviceByParkAndPlot,
  pageWarningInfo,
  pageRealTimeData,
  homeDeviceCard
} from './apis'
import { formatTime } from '@/utils/index'

const deviceCardList = ref([])
const getHomeDeviceCard = async () => {
  const res = await homeDeviceCard();
  console.log('getHomeDeviceCard',  res);
}
getHomeDeviceCard()

const pageWarnList = ref([])
const getPageWarningInfo = async (parkId = '', plotId = '') => {
  const res = await pageWarningInfo({ parkId, plotId })
  console.log('getPageWarningInfo', res);
  pageWarnList.value = res
}
getPageWarningInfo()

const runTimeData = ref([])
const getPageRealTimeData = async (parkId = '', plotId = '') => {
  const res = await pageRealTimeData({ parkId, plotId })
  console.log('pageRealTimeData', res);
  runTimeData.value = res
}
getPageRealTimeData()

const sensorList = ref([]), monitorList = ref([]), lineList = ref([])
const getDeviceList = async (belongPark = '', belongPlot = '') => {
  const res = await getDeviceByParkAndPlot({ belongPark, belongPlot })
  console.log('res', res);
  
  if (Array.isArray(res.sensor)) sensorList.value = res.sensor
  if (Array.isArray(res.surveillance)) monitorList.value = res.surveillance
  if (Array.isArray(res.prodLine)) lineList.value = res.prodLine
}
getDeviceList()

const treeList = ref([])
const buildTree = (tree = [], parentId = '') => {
  const res = []
  tree.forEach(item => {
    const _item = {
      id: item.id,
      label: item.name,
      parentId
    }
    if (item.child) _item.children = buildTree(item.child, item.id)
    res.push(_item)
  })
  return res
}
const getTreeList = async () => {
  const data = await getParkTree({});
  treeList.value = buildTree(data)
  console.log('treeList.value', treeList.value);
}
getTreeList()

const defaultProps = {
  children: 'children',
  label: 'label',
}

interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
  if (data.parentId) {
    getDeviceList(data.parentId, data.id)
    getPageWarningInfo(data.parentId, data.id)
    getPageRealTimeData(data.parentId, data.id)
  }
}

const initChart1 = () => {
  const chartDom = document.getElementById('chart1');
  const myChart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false,
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 3,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 81, name: 'Search Engine' },
          { value: 19, name: 'Direct' },
        ]
      }
    ]
  };

  option && myChart.setOption(option);
}

onMounted(() => { initChart1() })

const activeName = ref('sensor')
const handleClick = () => {}

const radio = ref('env')
const dateData = ref('')

const plantInfoList = ref([
  {
    id: 1,
    label: '种植品种',
    value: '金红九'
  },
  {
    id: 2,
    label: '种植时间',
    value: '2024/4/21'
  },
  {
    id: 3,
    label: '当前生育期',
    value: '育苗期'
  },
  {
    id: 4,
    label: '预计收获',
    value: '2024/8/21'
  },
])
</script>
<template>
  <div class="bg-slate-100">
    <div class="grid grid-cols-10 gap-2">
      <div
        class="border rounded-lg shadow-lg bg-white p-2 px-4"
        v-for="item in 10"
        :key="item"
        style="background-color: #f2f6fe;color: white;border: 1px solid #00000020;"
      >
        <div class="art-font mt-1" style="color: #237ced;">设备总数</div>
        <div class="flex items-center linear-font-type">
          <span class="art-font text-xl">1223</span>
          <span class="text-sm pl-2">台</span>
        </div>
      </div>
    </div>
    <div class="flex py-3 space-x-3">
      <div class="w-[16rem] rounded-md shadow-lg bg-white p-4">
        <el-tree
          style="max-width: 16rem;"
          :data="treeList"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :default-expand-all="true"
        />
      </div>
      <div class="w-full grid" style="grid-template-columns: 15rem calc(100% - 35rem) 18rem;gap: 1rem;">
        <div class="rounded-md shadow-lg bg-white row-span-2 p-3 px-4">
          <div class="card-title">种植信息</div>
          <div class="relative">
            <div id="chart1"></div>
            <div class="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center">
              <div style="font-size: 1.1rem;color:#7696eb;font-weight: bold;">81%</div>
              <div style="font-size: .8rem">种植进度</div>
            </div>
          </div>
          <div
            class="flex items-center p-2 py-1 my-1"
            style="color: white;background-color: #ffc653;"
          >
            <span class="text-sm">种植作物:</span>
            <span class="text-md px-1">西红柿</span>
          </div>
          <div class="grid grid-cols-2 grid-rows-2 gap-2 py-1">
            <div v-for="item in plantInfoList" :key="item.id" class="rounded-sm p-1 px-2" style="background-color: #f2f6fe;">
              <div style="font-size: .8rem;">{{ item.label }}</div>
              <div style="color:#7696eb;font-weight: bold;">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="rounded-md shadow-lg bg-white p-3 px-4">
          <div class="card-title">设备列表</div>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="传感监测" name="sensor">
              <el-table :data="sensorList" :stripe="true" :show-overflow-tooltip="true">
                <el-table-column label="名称" align="center" prop="deviceName" />
                <el-table-column label="编号" align="center" prop="deviceCode" />
                <el-table-column label="类型" align="center" prop="deviceType" />
                <el-table-column label="状态" align="center" prop="deviceStatus" />
                <el-table-column label="创建时间" align="center" prop="createTime">
                  <template #default="scope">
                    <span>{{ formatTime(scope.row.createTime, 'yyyy-MM-dd') }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="监控设备" name="monitor">
              <el-table :data="monitorList" :stripe="true" :show-overflow-tooltip="true">
                <el-table-column label="名称" align="center" prop="deviceName" />
                <el-table-column label="编号" align="center" prop="deviceCode" />
                <el-table-column label="类型" align="center" prop="deviceType" />
                <el-table-column label="状态" align="center" prop="deviceStatus" />
                <el-table-column label="创建时间" align="center" prop="createTime">
                  <template #default="scope">
                    <span>{{ formatTime(scope.row.createTime, 'yyyy-MM-dd') }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="产线设备" name="line">
              <el-table :data="lineList" :stripe="true" :show-overflow-tooltip="true">
                <el-table-column label="名称" align="center" prop="deviceName" />
                <el-table-column label="编号" align="center" prop="deviceCode" />
                <el-table-column label="类型" align="center" prop="deviceType" />
                <el-table-column label="状态" align="center" prop="deviceStatus" />
                <el-table-column label="创建时间" align="center" prop="createTime">
                  <template #default="scope">
                    <span>{{ formatTime(scope.row.createTime, 'yyyy-MM-dd') }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="rounded-md shadow-lg bg-white row-span-2 p-3 px-4">
          <div class="card-title">实时数据</div>
          <div class="grid grid-cols-2 gap-2 grid-rows-5 py-2">
            <div
              class="rounded-sm"
              style="background-color: #f2f6fe;"
              v-for="item in runTimeData"
              :key="item.dataType"
            >
              <div class="flex p-1 px-2 items-center justify-between">
                <div class="flex flex-col">
                  <div style="color: #1173ed;font-weight: bold;">
                    <span>{{ item.avgData }}</span>
                    <span>{{ item.dataUnit }}</span>
                  </div>
                  <div class="text-sm">{{ item.dataType }}</div>
                </div>
                <div class="w-8 h-8 border" style="border: 1px solid red;"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-md shadow-lg bg-white p-3 px-4">
          <div class="card-title">预警信息</div>
          <el-table :data="pageWarnList" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="设备" align="center" prop="deviceName" />
            <el-table-column label="预警类型" align="center" prop="warnType" />
            <el-table-column label="描述" align="center" prop="warnInfo" />
            <el-table-column label="时间" align="center" prop="warnTime">
              <template #default="scope">
                <span>{{ formatTime(scope.row.warnTime, 'yyyy-MM-dd') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="col-span-3 rounded-md shadow-lg bg-white p-3 px-4">
          <div class="card-title">历史数据</div>
          <div class="flex py-2">
            <el-radio-group v-model="radio">
              <el-radio-button label="棚内环境" value="env" />
              <el-radio-button label="气象站" value="weather" />
              <el-radio-button label="土壤墒情" value="solid" />
            </el-radio-group>
            <div style="margin: 0 .4rem;">
              <el-date-picker
                v-model="dateData"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </div>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="sensorList" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="设备类型" align="center" prop="deviceCode" />
            <el-table-column label="设备名称" align="center" prop="deviceName" />
            <el-table-column label="温度(℃)" align="center" prop="deviceCode" />
            <el-table-column label="湿度(%/RH)" align="center" prop="deviceName" />
            <el-table-column label="光照(Lux)" align="center" prop="deviceName" />
            <el-table-column label="气压(kPa)" align="center" prop="deviceName" />
            <el-table-column label="雨量(mm)" align="center" prop="deviceName" />
            <el-table-column label="二氧化碳(mmol/L)" align="center" prop="deviceName" />
            <el-table-column label="数据采集时间" align="center" prop="deviceName" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.linear-font-type {
    background-image: linear-gradient(to top, #2281ee, #2281ee3d);
    -webkit-background-clip: text;
    color: transparent;
}

#chart1 {
  width: 100%;
  height: 10rem;
}

.card-title {
  font-family: 'ArtFont';
  position: relative;
  padding-left: 14px;
}
.card-title::after {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  width: 5px;
  height: 80%;
  background-color: #7696eb;
}
</style>