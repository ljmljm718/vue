<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {
  warnRecordList,
  deviceInfoPage,
  deviceInfoByPark,
  getDeviceState,
  environmentalDataHomePage,
  waterQualityData,
  growthPage,
  getCountPageByBaseId,
  parkInfoPage,
  detailListByParkId
} from './apis'
import {formatTime} from '@/utils/index'
import {DICT_TYPE} from '@/utils/dict'
// import {generateBaseOptions, initChartStatic} from "@/utils/bigscreenTool";
import {
  initChartStatic,
  generatePieOptions
} from "../../utils/bigscreenTool/index";
import {ParkBaseInfo, ParkBaseInfo2} from '@/api/kaizhou/bigscreen/index'

const optionsX = ref([])
const handleSelectorChangeX = (e) => {
  console.log('handleSelectorChangeX', e.target.value);
  getGetCountPageByBaseId(e.target.value)
}
const getParkInfoPage = async () => {
  const {list = []} = await parkInfoPage({
    pageReqVO: {}
  })
  console.log('getDetailListByParkIdX', list);
  optionsX.value = list
  options1.value = list
  if (list.length > 0) {
    getGetCountPageByBaseId(list[0].id)
    getOptions2(list[0].id)
  }
}
getParkInfoPage()

// 设备巡检
const deviceCheckList = ref([])
const getGetCountPageByBaseId = async (baseId) => {
  const {list = []} = await getCountPageByBaseId({
    pageNo: 1,
    pageSize: 10,
    baseId
  })
  console.log('baseId', baseId);

  console.log('getGetCountPageByBaseId', list);
  deviceCheckList.value = list
}

const growthTypes = ref([])
const growthIndex = ref(0)
const getGrowthPage = async (belongPark, belongPlot) => {
  const {list = []} = await growthPage({
    pageNo: 1,
    pageSize: 1
  })
  console.log('getGrowthPage', list);
  growthTypes.value = list
}

const options1 = ref<Array<any>>([])
const getOptions1 = async (parentId = '0') => {
  const res = await ParkBaseInfo({parentId})
  options1.value = res
  getOptions2(options1.value[0].id)
}
// getOptions1()

const options2 = ref<Array<any>>([])
const getOptions2 = async (parentId) => {
  curBelongPark.value = parentId
  const res = await detailListByParkId({parkId: parentId})
  options2.value = res
  handleSelectorChange2({
    target: {value: res[0].id}
  })
}

const curBelongPark = ref('')
const handleSelectorChange1 = (val) => {
  getOptions2(val.target.value)
}
const curBelongPlot = ref('')
const handleSelectorChange2 = (val) => {
  const parentId = val.target.value || 0
  console.log('基地编号', curBelongPark.value);
  console.log('塘口编号', parentId)
  curBelongPlot.value = parentId;
  getGrowthPage(curBelongPark.value, parentId)
}

const topDataList = ref([])
const getenvironmentalData = async () => {
  const res = await environmentalDataHomePage()
  console.log('top Data', res);
  topDataList.value = res
}
getenvironmentalData()

const bottomDataList = ref([])
const getWaterQualityData = async () => {
  const res = await waterQualityData()
  bottomDataList.value = res
}
getWaterQualityData()

const initChart = async () => {
  const res = await getDeviceState()
  initChartStatic(
    "chart",
    generatePieOptions({
      color: [
        '#306fff',
        '#30c9c9',
        '#f7ad08',
        '#93beff'
      ],
      tooltip: {
        trigger: 'item'
      },
      legend: {
        left: 'right',
        top: 'center',
        orient: "vertical",
        textStyle:{color:"#969393"}
      },
      series: [
        {
          name: '设备',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            formatter: "{c|{c}} , {per|{d}%}",
            rich: {
              c: {
                color: "#969393",
                fontSize: 12,
                lineHeight: 33,
              },
              per: {
                color: "#969393",
                fontSize: 12,
                lineHeight: 33,
              },
            },
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
            {
              value: res[0].online, name: '运行'
            },
            {value: res[0].offline, name: '离线'}
          ],
        }
      ]
    })
  );
}
const loading = ref(false)
setTimeout(() => {
  loading.value = false
}, 3000)
const cardList = ref([
  {
    id: '1',
    title: '设备总数'
  },
  {
    id: '2',
    title: '水质监测'
  },
  {
    id: '3',
    title: '摄像头'
  },
  {
    id: '4',
    title: '气象站'
  },
  {
    id: '5',
    title: '预警数量'
  },
])

const tableData = ref([])
const getTableData = async () => {
  const {list = []} = await warnRecordList();
  tableData.value = list
}
getTableData()

const getDeviceInfoPage = async () => {
  const {list} = await deviceInfoPage()
  console.log('getDeviceInfoPage', list);
}

const getdeviceInfoByPark = async () => {
  const res = await deviceInfoByPark()
  console.log('getdeviceInfoByPark', res);
  const stateRes = await getDeviceState()
  const {list} = await deviceInfoPage()
  cardList.value = [{
    id: 'all',
    title: '设备总数',
    ...stateRes[0]
  }, ...res.filter(item => {
    if (item.categoryName === "气象站") return true
    if (item.categoryName === "水质监测") return true
    if (item.categoryName === "摄像头") return true
    return false
  }).map(item => ({
    ...item,
    id: item.categoryName,
    title: item.categoryName,
  })), {
    id: 'prewarn',
    title: '预警数量',
    total: list.length
  }]
}
getdeviceInfoByPark()


onMounted(() => {
  initChart()
})
</script>
<template>
  <div>
    <div class="grid grid-cols-5 gap-4">
      <div
        :class="`top-bg-${index + 1} px-6 flex flex-col justify-center`"
        style="aspect-ratio: 2;color: black;"
        v-for="(item, index) in cardList"
        :key="item.id"
      >
        <div class="flex justify-between w-full items-center">
          <div style="font-family: 'ArtFont';font-size: 1.3rem;">{{ item.title }}</div>
          <div>{{
              (item.title !== '设备总数' && item.title !== '预警数量') ? (item.total + '台') : ''
            }}
          </div>
        </div>
        <div v-if="item.title === '设备总数' || item.title === '预警数量'">
          <div class="flex items-center pt-2 h-[2.5rem] px-2">
            <span>{{ item.total }}</span>
            <span v-if="item.title === '设备总数'"  style="padding-left: 2rem;">台</span>
            <span v-if="item.title === '预警数量'"  style="padding-left: 2rem;">个</span>
          </div>
        </div>
        <div v-else>
          <div class="h-[1rem] p-1 pt-2 flex items-center">
            <span>在线</span>
            <span style="padding-left: 2rem;">{{ item.online }}台</span>
          </div>
          <div class="h-[1rem] p-1 flex items-center">
            <span>离线</span>
            <span style="padding-left: 2rem;">{{ item.offline }}台</span>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4 py-4">
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>设备运行状态</span>
          </div>
          <el-divider class="!my-3"/>
          <div class="left1">
            <div id="chart"></div>
          </div>
        </el-skeleton>
      </el-card>
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon justify-between items-center">
            <span>养殖品种</span>
            <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
              <select @change="handleSelectorChange1">
                <option
                  :value="item.id"
                  v-for="item,index in options1"
                  :key="index"
                >{{ item.name }}
                </option>
              </select>
              <select @change="handleSelectorChange2">
                <option
                  :value="item.id"
                  v-for="item,index in options2"
                  :key="index"
                >{{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <el-divider class="!my-3"/>
          <div class="p-1">
            <div
              class="text-center py-2"
              style="background: linear-gradient(to right, #79cefe00, #79cefeA0, #79cefe00);"
            >养殖物名称: 黄河口大闸蟹
            </div>
            <div class="p-1 mt-3 flex items-start" v-if="growthTypes.length !== 0">
              <img :src="growthTypes[growthIndex].imgId" alt="" class="w-30 object-contain"/>
              <div class="px-2">
                <div class="p-1">
                  <span>养殖品种: </span>
                  <span class="pl-2">{{ growthTypes[growthIndex].cropType }}</span>
                </div>
                <div class="p-1">
                  <span>当前生育期: </span>
                  <span class="pl-2">{{ growthTypes[growthIndex].growth }}</span>
                </div>
                <div class="p-1 py-2">
                  <div>开始时间:</div>
                  <div class="pt-2">{{
                      formatTime(growthTypes[growthIndex].startTime, 'yyyy-MM-dd')
                    }}
                  </div>
                </div>
                <div class="p-1 py-2">
                  <div>预计结束时间:</div>
                  <div class="pt-2">{{
                      formatTime(growthTypes[growthIndex].endTime, 'yyyy-MM-dd')
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-skeleton>
      </el-card>
      <el-card class="col-span-2">
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>实时监测数据</span>
          </div>
          <el-divider class="!my-3"/>
          <div class="grid gap-2 grid-cols-5 grid-rows-4">
            <div
              class="row-span-2 flex flex-col items-center justify-center"
              style="border: 1px solid #5293EAA0;background-color: #5293EA30;"
            >
              <div class="t w-[2rem] h-[2rem] mb-2" style="background-size: 100% 100%;"></div>
              <div>环境监测</div>
            </div>
            <div v-for="(item, index) in topDataList" :key="item.monitoringType"
                 class="flex space-x-2 p-2 pl-4"
                 style="border: 1px solid #5293EAA0;background-color: #5293EA30;">
              <div :class="`t-${index + 1} w-[2rem] h-[2rem]`"
                   style="background-size: 100% 100%;"></div>
              <div>
                <div>
                  <span>{{ item.dataValue }}</span>
                  <span style="padding-left: .1rem;">{{ item.yyUnit }}</span>
                </div>
                <div style="font-size: .9rem;padding-top: .2rem;">{{ item.monitoringType }}</div>
              </div>
            </div>
            <div
              class="row-span-2 flex flex-col items-center justify-center"
              style="border: 1px solid #b5ead8A0;background-color: #b5ead830;"
            >
              <div class="b w-[2rem] h-[2rem] mb-2" style="background-size: 100% 100%;"></div>
              <div>环境监测</div>
            </div>
            <div v-for="(item, index) in bottomDataList" :key="item" class="flex space-x-2 p-2 pl-4"
                 style="border: 1px solid #b5ead8A0;background-color: #b5ead830;">
              <div :class="`b-${index + 1} w-[2rem] h-[2rem]`"
                   style="background-size: 100% 100%;"></div>
              <div>
                <div>
                  <span>{{ item.dataValue }}</span>
                  <span style="padding-left: .1rem;">{{ item.yyUnit }}</span>
                </div>
                <div style="font-size: .9rem;padding-top: .2rem;">{{ item.monitoringType }}</div>
              </div>
            </div>
          </div>
        </el-skeleton>
      </el-card>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon justify-between items-center">
            <span>设备巡检</span>
            <div class="selector-wrapper" @click="(e) => e.stopPropagation()">
              <select @change="handleSelectorChangeX">
                <option
                  :value="item.id"
                  v-for="item,index in optionsX"
                  :key="index"
                >{{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <el-divider class="!my-3"/>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="item in deviceCheckList" :key="item.deviceId">
              <img src="/img.png" alt="" class="w-full h-[9rem]"
                   style="object-fit: contain;border: 1px solid #ffffff20;"/>
              <div class="flex items-center px-3 py-1"
                   style="background: linear-gradient(to right, #7acfffA0, #7acfff00);">
                <span>{{ item.categoryName }}</span>
                <span style="padding-left: .3rem;">{{ item.sumNum }}</span>
              </div>
              <div class="grid grid-cols-2 mt-2">
                <div class="flex" style="color: #0fc87c;">
                  <span>已巡检</span>
                  <span style="padding-left: .3rem;">{{ item.finishCheckNum }}</span>
                </div>
                <div class="flex" style="color: #ff0000;">
                  <span>未巡检</span>
                  <span style="padding-left: .3rem;">{{ item.unFinishCheckNum }}</span>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </el-skeleton>
      </el-card>
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>预警信息</span>
          </div>
          <el-divider class="!my-3"/>
          <el-table :data="tableData" stripe max-height="240" fit border>
            <el-table-column label="塘口编号" prop="plotCode" min-width="100px"
                             show-overflow-tooltip/>
            <el-table-column label="设备" prop="deviceCode" min-width="100px"
                             show-overflow-tooltip/>
            <el-table-column label="预警信息" prop="warnInfo" min-width="100px"
                             show-overflow-tooltip/>
            <el-table-column label="时间" prop="warnTime" min-width="100px" show-overflow-tooltip>
              <template #default="scope">
                <span>{{ formatTime(scope.row.warnTime, 'yyyy-MM-dd') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="warnStatus" min-width="100px" show-overflow-tooltip>
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_STATUS" :value="scope.row.warnStatus"/>
              </template>
            </el-table-column>
          </el-table>
        </el-skeleton>
      </el-card>
    </div>
  </div>
</template>


<style lang="scss" scoped>
#chart {
  height: 14rem;
}

.title-icon {
  background-image: url(./assets/titleIcon.png);
  background-repeat: no-repeat;
  background-position: left center;
}

.left1 {
  //width: 100%;
  //height: 100px;
}

@for $i from 1 through 5 {
  .top-bg-#{$i} {
    background-image: url(./assets/top#{$i}.png);
    background-size: 100% 100%;
  }
}

.t {
  background-image: url(./assets/home1/t.png);
}

@for $i from 1 through 8 {
  .t-#{$i} {
    background-image: url(./assets/home1/t#{$i}.png);
  }
}

.b {
  background-image: url(./assets/home1/b.png);
}

@for $i from 1 through 8 {
  .b-#{$i} {
    background-image: url(./assets/home1/b#{$i}.png);
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
</style>
