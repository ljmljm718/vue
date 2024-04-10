<script setup lang="ts">
import * as echarts from 'echarts';
import { dateFormatter } from '@/utils/formatTime'
import {
  getParkTree,
  getDeviceByParkAndPlot,
  pageWarningInfo,
  pageRealTimeData,
  homeDeviceCard,
  envPage, // 棚内环境
  envDataPage, // 气象站
  soilPage, // 土壤墒情
} from './apis'
import { formatTime } from '@/utils/index'
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import {retainFirstTwoLayers} from "@/utils/tree";
import {DICT_TYPE} from "@/utils/dict";
import {useRouter} from "vue-router";
import {ElTree} from "element-plus";

const getIcon = (type) => {
  const iconMap = {
    '温度': '1',
    '湿度': '2',
    'PH': '3',
    'EC': '4',
    '光': '5',
    '雨': '6',
    '二氧化碳': '7',
    '气压': '8',
    '虫': '9',
    '类': '10',
    'default': '1'
  }
  const iconLabel = Object.keys(iconMap);
  let key = 'default'
  iconLabel.forEach(item => {
    if (type.indexOf(item) !== -1) key = item
  })
  return iconMap[key]
}

const deviceCardList = ref([])
const getHomeDeviceCard = async () => {
  const res = await homeDeviceCard();
  console.log('getHomeDeviceCard',  res);
  deviceCardList.value = res
}
getHomeDeviceCard()

let router=useRouter()
const goPage=(index,id)=>{
  if (id === 'online' || id === 'offline'|| id === 'fault'){
    router.push({
      path:'/device/deviceView',
      query:{
        val: id
      }
    })
  }else {
    router.push({
      path:'/device/deviceView',
      query:{
        id
      }
    })
  }
}

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

let categoryOptions = ref([])// 设备分类选项
/**
 * 设备分类级联选择器
 */
const categoryProps = {
    value: 'id',
    label: 'categoryName'
}
const getDeviceList = async (belongPark = '', belongPlot = '') => {
    const res = await getDeviceByParkAndPlot({ belongPark, belongPlot })
    console.log('res', res);

    sensorList.value = res.sensor.map((item: any) => {
        item.deviceType = item.deviceType.split(',').map(Number)
        return item;
    })
    monitorList.value = res.surveillance.map((item: any) => {
        item.deviceType = item.deviceType.split(',').map(Number)
        return item;
    })
    lineList.value = res.prodLine.map((item: any) => {
        item.deviceType = item.deviceType.split(',').map(Number)
        return item;
    })
    if (Array.isArray(res.sensor)) sensorList.value = res.sensor
    if (Array.isArray(res.surveillance)) monitorList.value = res.surveillance
    if (Array.isArray(res.prodLine)) lineList.value = res.prodLine
    const categoryTree = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
    categoryOptions.value = retainFirstTwoLayers(categoryTree)
    console.log('res32', res);
}
getDeviceList()

const treeList = ref([])
const treeRef = ref<InstanceType<typeof ElTree>>()
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
  nextTick(() => {
    if (treeList.value) {
      treeRef.value.setCurrentKey(treeList.value[0].children[0].id);
    }
  });
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

const radio = ref('棚内环境')
const getEnvPage = async (params) => {
  const { list = [], total:_total = 0 } = await envPage({
    ...params,
    // collectionTime: dateData.value
  })
  console.log('棚内环境', list);
  lastDataList.value = list
  total.value = _total
}

const getEnvDataPage = async (params) => {
  const { list = [], total:_total = 0 } = await envDataPage(params)
  console.log('气象站', list);
  lastDataList.value = list
  total.value = _total
}

const getSoilDataPage = async (params) => {
  const { list = [], _total = 0 } = await soilPage(params)
  console.log('土壤墒情', list);
  lastDataList.value = list
  total.value = _total
}

const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})

// 1代表棚内环境 2代表气象站 3土壤墒情
const lastDataList = ref([])
const getLastList = async (type = '1') => {
  lastDataList.value = []
  total.value = 0
  if (type === '1') getEnvPage(queryParams)
  if (type === '2') getEnvDataPage(queryParams)
  if (type === '3') getSoilDataPage(queryParams)
}
getLastList('1')
const handleRadioChange = (e) => {
  console.log('e', e);
  queryParams.pageNo = 1
  queryParams.pageSize = 10
  if (e === '棚内环境') {
    getLastList('1')
  } else if (e === '气象站') {
    getLastList('2')
  } else {
    getLastList('3')
  }
}
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
  <div>
    <div class="grid grid-cols-10 gap-2">
      <div
        :class="`border rounded-lg shadow-lg p-2 px-4 s-icon s-${index + 1}`"
        v-for="(item, index) in deviceCardList"
        :key="index"
        style="background-color: #ffffff20;border: 1px solid #00000020;"
        @click="goPage(index,item.category)"
      >
        <div class="art-font mt-1">{{ item.title }}</div>
        <div class="flex items-center">
          <span class="art-font text-xl">{{ item.deviceCount }}</span>
          <span class="text-sm pl-2">台</span>
        </div>
      </div>
    </div>
    <div class="flex py-3 space-x-3">
      <el-card class="w-[16rem]">
        <el-tree
          ref="treeRef"
          style="max-width: 16rem;"
          :data="treeList"
          :props="defaultProps"
          highlight-current
          node-key="id"
          @current-change="handleNodeClick"
          :default-expand-all="true"
        />
      </el-card>
      <div class="w-full grid" style="grid-template-columns: 15rem calc(100% - 37rem) 20rem;gap: 1rem;">
        <el-card class="row-span-2">
          <template #header>
            <div class="card-title">种植信息</div>
          </template>
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
            <div v-for="item in plantInfoList" :key="item.id" class="rounded-sm p-1 px-2" style="background-color: #237ced20;">
              <div style="font-size: .8rem;">{{ item.label }}</div>
              <div style="color:#7696eb;font-weight: bold;">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
        <el-card>
          <template #header>
            <div class="card-title">设备列表</div>
          </template>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="传感监测" name="sensor">
              <el-table :data="sensorList" :stripe="true" :show-overflow-tooltip="true" height="10rem">
                <el-table-column label="名称" align="center" prop="deviceName" />
                <el-table-column label="编号" align="center" prop="deviceCode" />
                <el-table-column label="类型" align="center" prop="deviceType" width="200px" >
                  <template #default="scope">
                    <el-cascader
                        style="width: 100%"
                        v-model="scope.row.deviceType"
                        :options="categoryOptions"
                        :props="categoryProps"
                        disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center" prop="deviceStatus" >
                  <template #default="scope">
                    <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime">
                  <template #default="scope">
                    <span>{{ formatTime(scope.row.createTime, 'yyyy-MM-dd') }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="监控设备" name="monitor">
              <el-table :data="monitorList" :stripe="true" :show-overflow-tooltip="true" height="10rem">
                <el-table-column label="名称" align="center" prop="deviceName" />
                <el-table-column label="编号" align="center" prop="deviceCode" />
                <el-table-column label="类型" align="center" prop="deviceType"  width="200px">
                  <template #default="scope">
                    <el-cascader
                        style="width: 100%"
                        v-model="scope.row.deviceType"
                        :options="categoryOptions"
                        :props="categoryProps"
                        disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center" prop="deviceStatus" >
                  <template #default="scope">
                    <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime">
                  <template #default="scope">
                    <span>{{ formatTime(scope.row.createTime, 'yyyy-MM-dd') }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="产线设备" name="line">
              <el-table :data="lineList" :stripe="true" :show-overflow-tooltip="true" height="10rem">
                <el-table-column label="名称" align="center" prop="deviceName" />
                <el-table-column label="编号" align="center" prop="deviceCode" />
                <el-table-column label="类型" align="center" prop="deviceType" width="200px" >
                  <template #default="scope">
                    <el-cascader
                        style="width: 100%"
                        v-model="scope.row.deviceType"
                        :options="categoryOptions"
                        :props="categoryProps"
                        disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center" prop="deviceStatus" >
                  <template #default="scope">
                    <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime">
                  <template #default="scope">
                    <span>{{ formatTime(scope.row.createTime, 'yyyy-MM-dd') }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-card class="row-span-2">
          <template #header>
            <div class="card-title">实时数据</div>
          </template>
          <div class="overflow-auto h-[31rem]">
            <div class="grid grid-cols-2 gap-2 grid-rows-5 py-2">
              <div
                class="rounded-sm"
                style="background-color: #237ced16;border: 1px solid #ffffff40;"
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
                  <div :class="`w-8 h-8 border icon-${getIcon(item.dataType)}`" style="background-size: 100% 100%;">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card>
          <template #header>
            <div class="card-title">预警信息</div>
          </template>
          <el-table :data="pageWarnList" :stripe="true" :show-overflow-tooltip="true" height="10rem">
            <el-table-column label="设备" align="center" prop="deviceName" />
            <el-table-column label="预警类型" align="center" prop="warnType" />
            <el-table-column label="描述" align="center" prop="warnInfo" />
            <el-table-column label="时间" align="center" prop="warnTime">
              <template #default="scope">
                <span>{{ formatTime(scope.row.warnTime, 'yyyy-MM-dd') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="col-span-3">
          <template #header>
            <div class="card-title">历史数据</div>
          </template>
          <div class="flex py-2">
            <el-radio-group v-model="radio" @change="handleRadioChange">
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
            <el-button type="primary" @click="handleRadioChange(radio)">查询</el-button>
          </div>
          <el-table :data="lastDataList" :stripe="true" :show-overflow-tooltip="true" height="12rem">
            <el-table-column label="设备类型" align="center" prop="collectionType" />
            <el-table-column label="设备名称" align="center" prop="equipmentCode" />
            <el-table-column label="温度(℃)" align="center" prop="temperature" />
            <el-table-column label="湿度(%/RH)" align="center" prop="humidity" />
            <el-table-column label="光照(Lux)" align="center" prop="lighting" />
            <el-table-column label="气压(kPa)" align="center" prop="airPressure" />
            <el-table-column label="雨量(mm)" align="center" prop="rainfall" />
            <el-table-column label="二氧化碳(mmol/L)" align="center" prop="co2Density" />
            <el-table-column label="数据采集时间" align="center" prop="collectionTime" :formatter="dateFormatter" />
          </el-table>
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getLastList(radio === '棚内环境' ? '1' : radio === '气象站' ? '2' : '3')"
          />
        </el-card>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
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

@for $i from 1 through 10 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}

.s-icon {
  background-position: 90% 80%;
  background-repeat: no-repeat;
  background-size: 2rem 2rem;
}
@for $i from 1 through 10 {
  .s-#{$i} {
    background-image: url(./assets/s#{$i}.png);
  }
}
</style>
