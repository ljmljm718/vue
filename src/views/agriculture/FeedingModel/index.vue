<template>
  <div class="box-border px-[15px] py-[15px]">
    <div class="w-100% px-[25px] py-[15px] box-border bg-[#fff] rounded">
      <div class="text-14px">饲料投喂模型</div>
      <div :class="`grid grid-cols-7 ${FeedingTopList.length} mt-[15px] `">
        <div
          v-for="(item, index) in FeedingTopList"
          @click="tabFeeding(item.growthPeriod)"
          :key="index"
          :class="`top-icon-${
            growthPeriod == item.growthPeriod ? '3' : index == FeedingTopList.length - 1 ? '2' : '1'
          } w-100% h-80px flex justify-center items-center`"
        >
          <div
            :class="`bg-[${
              growthPeriod == item.growthPeriod
                ? '#fff'
                : index == FeedingTopList.length - 1
                ? '#fff'
                : '#009688'
            }] w-25px mr-10px text-center leading-25px color-[${
              growthPeriod == item.growthPeriod
                ? '#009688'
                : index == FeedingTopList.length - 1
                ? '#009688'
                : '#fff'
            }] h-25px rounded-full`"
            >{{ index + 1 }}</div
          >
          <div>
            <div class="mb-6px text-15px">{{ item.growthPeriod }}</div>
            <div class="color-[#a5adac] text-13px">{{ item.time }},周期{{ item.cycle }}</div>
          </div>
        </div>
      </div>
      <div class="mt-20px">
        <div class="text-xl mb-10px">投喂策略</div>
        <div class="flex justify-between">
          <div class="w-83%">
            <div class="flex items-center">
              <div
                class="w-5px h-5px mr-10px rounded-full border-3 border-[#1fa296] border-solid"
              ></div>
              <div class="text-14px color-[#b2b2b2]"
                >投喂频率：<span class="color-[#000]">{{ periodObj.feedingFrequency }}</span></div
              >
            </div>
            <div class="w-2px h-15px bg-[#1fa296] ml-[3px]"></div>
            <div class="flex items-center">
              <div
                class="w-5px h-5px mr-10px rounded-full border-3 border-[#1fa296] border-solid"
              ></div>
              <div class="text-14px color-[#b2b2b2]"
                >投喂时间：<span class="color-[#000]">{{ periodObj.feedingTime }}</span></div
              >
            </div>
            <div class="w-2px h-15px bg-[#1fa296] ml-[3px]"></div>
            <div class="flex items-center">
              <div
                class="w-5px h-5px mr-10px rounded-full border-3 border-[#1fa296] border-solid"
              ></div>
              <div class="text-14px color-[#b2b2b2]"
                >注意事项：<span class="color-[#000]">{{ periodObj.precautions }}</span></div
              >
            </div>
            <div class="w-2px h-15px bg-[#1fa296] ml-[3px]"></div>
            <div class="flex items-center">
              <div
                class="w-5px h-5px mr-10px rounded-full border-3 border-[#1fa296] border-solid"
              ></div>
              <div class="text-14px color-[#b2b2b2]"
                >投喂建议：<span class="color-[#000]">{{ periodObj.feedingAdvice }}</span></div
              >
            </div>
            <div class="w-2px h-15px bg-[#1fa296] ml-[3px]"></div>
            <div class="flex items-center">
              <div
                class="w-5px h-5px mr-10px rounded-full border-3 border-[#1fa296] border-solid"
              ></div>
              <div class="text-14px color-[#b2b2b2]"
                >投喂饲料：<span class="color-[#000]">{{ periodObj.feedingFood }}</span></div
              >
            </div>
          </div>
          <div class="w-15%">
            <img v-if="periodObj.image" :src="periodObj.image" class="w-220px h-190px" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between mt-15px h-700px">
      <div class="w-49.5% h-100% box-border p-[20px] bg-[#fff]">
        <div>喂养量影响因子</div>
        <div class="factor-bg w-300px h-230px mx-auto"></div>
        <div>
          <div
            v-for="(item, index) in FactorList"
            :key="index"
            class="mt-10px bg-[#f5f5f5] flex items-center w-100% h-45px"
            style="overflow: hidden"
          >
            <div
              class="h-100% w-150px rounded-25px leading-40px text-center mr-5px bg-[#009688] color-[#fff]"
              >{{ item.factorName }}</div
            >
            <div class="w-80% factor-meassage">{{ item.influence }}</div>
          </div>
        </div>
      </div>
      <div class="w-49.5% h-100% box-border p-[20px] bg-[#fff]">
        <div>喂养量计算</div>
        <div class="w-100% flex my-15px items-center justify-evenly">
          <div
            class="flex items-center !px-[15px] h-38px rounded !border-2 !border-[#dcdfe6] !border-solid"
          >
            <div> 基地名称： </div>
            <select
              class="!w-200px !h-25px !border-none"
              name=""
              id=""
              @change="select"
              v-model="baseCode"
            >
              <option v-for="(item, index) in parkList" :key="index" :value="item.id">{{
                item.name
              }}</option
              >c
            </select>
          </div>

          <div
            class="flex items-center !px-[15px] h-38px rounded !border-2 !border-[#dcdfe6] !border-solid"
          >
            <div> 地块名称： </div>
            <select
              class="!w-200px !h-25px !border-none"
              name=""
              id=""
              @change="select2"
              v-model="plotCode"
            >
              <option v-for="(item, index) in dkList" :key="index" :value="item.id">{{
                item.name
              }}</option>
            </select>
          </div>
        </div>
        <div class="bg-[#009688] color-[#fff] w-100% h-40px flex justify-between items-center">
          <div class="w-33% h-100% text-center leading-40px">周期数量</div>
          <div class="w-33% h-100% text-center leading-40px">气象数据</div>
          <div class="w-33% h-100% text-center leading-40px">水质数据</div>
        </div>
        <div class="flex mt-10px justify-between">
          <div class="w-32%">
            <el-form>
              <el-form-item
                label="生长周期："
                class="!flex box-border !px-[10px] !w-100% !h-35px !items-center !border-2 !border-[#dcdfe6] !border-solid"
              >
                <select
                  class="!w-174px !h-100% !border-none"
                  name=""
                  id=""
                  @change="cycleSelect"
                  v-model="sycleVal"
                >
                  <option v-for="(item, index) in infoList" :key="index" :value="item">{{
                    item.growthPeriod
                  }}</option>
                </select>
              </el-form-item>
              <el-form-item
                label="鱼塘规模："
                class="!flex box-border !h-35px !px-[10px] !w-100% !items-center !border-2 !border-[#dcdfe6] !border-solid"
              >
                <el-input type="number" v-model="sycleCount" >
                  <template #suffix> 只 </template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="鱼塘面积："
                class="!flex box-border !h-35px !px-[10px] !w-100% !items-center !border-2 !border-[#dcdfe6] !border-solid"
              >
                <el-input type="number" v-model="sycleArea" >
                  <template #suffix> 亩 </template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="养殖规格："
                class="!flex !px-[10px] !h-35px !w-100% box-border !items-center !border-2 !border-[#dcdfe6] !border-solid"
              >
                <el-input type="number" v-model="sycleVal.weight" >
                  <template #suffix> 克/只 </template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="w-32%">
            <div
              v-for="(item, index) in waterList.meteorological"
              :key="index"
              class="!flex !px-[10px] !w-100% box-border flex justify-center items-center h-35px mb-18px rounded !items-center !border-2 !border-[#dcdfe6] !border-solid"
            >
              <div>{{ item?.monitoringType }}: {{ item?.dataValue }} {{ item?.dataUnit }}</div>
            </div>
          </div>
          <div class="w-32%">
            <div
              v-for="(item, index) in waterList.water"
              :key="index"
              class="!flex !px-[10px] box-border !w-100% flex justify-center items-center h-35px mb-18px rounded !items-center !border-2 !border-[#dcdfe6] !border-solid"
            >
              <div>{{ item?.monitoringType }}: {{ item?.dataValue }} {{ item?.dataUnit }}</div>
            </div>
          </div>
        </div>
        <div
          class="border-1px border-solid border-[#dcdfe6] h-120px box-border px-[15px] py-[20px] rounded"
        >
          <div class="color-[#cbcbcb]">投喂建议:</div>
          <div class="mt-7px">{{ sycleVal.strategy }}</div>
        </div>
        <div
          class="border-1px border-dashed bg-[#f6fbfa] mt-10px h-120px mb-20px border-[#7dc9c2] box-border px-[15px] py-[20px] rounded"
        >
          <div class="color-[#cbcbcb]">投喂量结果:</div>
          <div class="color-[#40b0a5] mt-7px">
            <div v-if="!feedVal">点击下方“投喂量计算”按钮获取投喂量结果</div>
            <div v-else>{{ feedVal }}</div>
          </div>
        </div>
        <div
          style="cursor: pointer"
          @click="getbyGrowthPeriod()"
          class="bg-[#009688] color-[#fff] rounded w-80px h-15px mx-auto px-10px py-10px text-center leading-15px"
          >投喂量计算</div
        >
      </div>
    </div>
    <div class="flex justify-between mt-15px">
      <div class="w-49.5% bg-[#fff] box-border p-[15px]">
        <div>喂养量趋势图</div>
        <div id="chartLine" class="w-100% h-280px"></div>
      </div>
      <div class="w-49.5% bg-[#fff] box-border p-[15px]">
        <div>喂养日志</div>
        <el-table :data="tableData" style="width: 100%; height: 280px">
          <el-table-column prop="plotName" label="地块名称" />
          <el-table-column prop="feedTime" label="投喂时间" />
          <el-table-column prop="crabNum" label="蟹数量" />
          <el-table-column prop="feedNum" label="投喂量" />
          <el-table-column prop="feedType" label="饲料种类" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import {
  periodStrategyAll,
  feedingList,
  PeriodStrategy,
  factorPage,
  FeedInfoChart,
  FeedInfoPage,
  realData,
  BaseList,
  plotList,
  infoByBasePlot,
  byGrowthPeriod,
  feedingGet
} from '@/api/agriculture/FeedingModel/index'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../../utils/bigscreenTool/index'
//获取生长周期
const growthPeriod = ref('')
const FeedingTopList = ref([])
const getPeriodStrategyAll = async () => {
  let res = await periodStrategyAll()
  console.log(res, '生长周期123')
  FeedingTopList.value = res
  growthPeriod.value = res[0].growthPeriod
  getPeriodStrategy(res[0].growthPeriod)
}
getPeriodStrategyAll()
//T投喂策略
const periodObj = ref({})
const getPeriodStrategy = async (val) => {
  let res = await PeriodStrategy({ growthPeriod: val })
  console.log(res, 'T投喂策略123')
  periodObj.value = res
}
//生长周期切换
const tabFeeding = (val) => {
  growthPeriod.value = val
  getPeriodStrategy(growthPeriod.value)
}
//喂养量影响因子
const FactorList = ref([])
const getFactorPage = async () => {
  let res = await factorPage()
  console.log(res, '喂养量因子')
  FactorList.value = res.list
}
getFactorPage()
//喂养量趋势图
const initChart = async () => {
  let res = await FeedInfoChart({ referType: '光照强度' })
  console.log(res, '喂养量趋势图')

  initChartStatic(
    'chartLine',
    generateBaseOptions({
      xAxis: {
        data: res.abscissa.reverse(),
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        }
      },
      legend: {
        show: true,
        top: 'top',
        left: 'center',
        textStyle: {
          color: '#000'
        }
      },
      yAxis: [
        {
          type: 'value',
          name: `喂养量/${res.feedUnitList[0]}`,
          nameTextStyle: {
            color: 'rgba(153, 153, 153, 1)',
            'font-family': 'AlibabaPuHuiTi',
            fontSize: '13px'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            color: '#000'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#e1e7f1', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        },
        {
          type: 'value',
          name: `光照强度/${res.illuminationUnitList[0]}`,
          nameTextStyle: {
            color: 'rgba(153, 153, 153, 1)',
            'font-family': 'AlibabaPuHuiTi',
            fontSize: '13px'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#c1c1c1'
            }
          },
          axisLabel: {
            color: '#000'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#e1e7f1', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        }
      ],
      color: ['#009688', '#ffbc33'],
      series: [
        {
          name: '喂养量',
          data: res.feedList.reverse(),
          type: 'bar',
          smooth: false,
          yAxisIndex: 0,
          barWidth: 28
        },
        {
          name: '光照强度',
          data: res.illuminationList.reverse(),
          type: 'line',
          symbol: 'none',
          yAxisIndex: 1,
          smooth: false,
          itemStyle: {
            color: '#FFAF0F'
          }
        }
      ],
      grid: {
        left: '5%',
        right: '6%',
        top: '25%',
        bottom: '15%'
      }
    })
  )
}
onMounted(() => {
  initChart()
})
//喂养日志
const tableData = ref([])
//时间转换

// 将时间戳转换为年月日时分秒的字符串格式
function timestampToDateTime(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  // 使用模板字符串返回格式化的日期时间字符串
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours
    .toString()
    .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}
const getFeedInfoPage = async () => {
  let res = await FeedInfoPage({ pageNo: 1, pageSize: 10 })
  console.log(res, '喂养日志')
  tableData.value = res.list
  tableData.value.forEach((item) => {
    item.feedNum = item.feedNum + item.feedOne
    item.feedTime = timestampToDateTime(item.feedTime)
  })
}
getFeedInfoPage()
//基地地块
const baseCode = ref('')
const plotCode = ref('')
const options = ref([])
const options2 = ref([])
//水质检测  气象数据
const waterList = reactive({
  meteorological: [],
  water: []
})
const getRealData = async () => {
  let res = await realData()
  console.log(res, '水质')
  res.map((item) => {
    if (item.collectionType === '气象站') waterList.meteorological.push(item)
  })
  console.log(waterList.meteorological, 'ddddddd')
  res.map((item) => {
    if (item.collectionType === '水质监测') waterList.water.push(item)
  })
}
getRealData()
//获取基地
const parkList = ref([])
const getBaseList = async () => {
  let res = await BaseList()
  console.log(res, 'jidi')
  parkList.value = res.list
  baseCode.value = res.list[0].id
  getPlotList(res.list[0].id)
}
getBaseList()
//获取地块
const dkList = ref([])
const getPlotList = async (val) => {
  let res = await plotList({ parkId: val,pageSize:20,pageNo:1 })
  plotCode.value = res.list[0].id
  dkList.value = res.list
  getInfoByBasePlot()
}
//基地切换
const select = (e) => {
  baseCode.value = e.target.value
}
const feedVal = ref('')

const select2 = (e) => {
  plotCode.value = e.target.value
  feedVal.value = 0
  getInfoByBasePlot()
}
//获取周期数量初始值
//获取周期数量初始值
function shallowUniqueByKeys(arr, keys) {
  const uniqueObjects = []
  const seenObjects = new Set()
  for (const obj of arr) {
    const key = keys.map((k) => obj[k]).join('|') // 使用指定的key生成唯一字符串
    if (!seenObjects.has(key)) {
      seenObjects.add(key)
      uniqueObjects.push(obj)
    }
  }
  return uniqueObjects
}
const infoObj = ref({})
const infoList = ref([])
const sycleCount = ref('')
const sycleArea = ref('')
const getInfoByBasePlot = async () => {
  let res = await infoByBasePlot({ belongPark: baseCode.value, belongPlot: plotCode.value })
  console.log(res,'基地切换')
  sycleCount.value=res.count
  sycleArea.value=res.area
  let res2 = await feedingList()
  res2.unshift(res)
  let keys=[ 'weight','growthPeriod']
  infoList.value=shallowUniqueByKeys(res2,keys)
  sycleVal.value = res
}
const sycleVal = ref('')

const cycleSelect = (e) => {
  console.log(sycleVal.value, 'sycleVal.valuesycleVal.value123')
  sycleVal.value.id ? getFeedingGet() : ''
}
//喂量计算
const getbyGrowthPeriod = async () => {
  let weight = sycleVal.value.weight.includes('克/只')
    ? sycleVal.value.weight.substring(0, sycleVal.value.weight.length - 3)
    : sycleVal.value.weight
  let count = sycleCount.value.includes('只')
    ? sycleCount.value.substring(0, sycleCount.value.length - 1)
    : sycleCount.value
  let res = await byGrowthPeriod({
    growthPeriod: sycleVal.value.growthPeriod,
    count: count,
    weight: weight
  })
  feedVal.value = res.weight
  //res.weight.substring(0,res.weight.length-1).toFixed(4)+'克'
}
//获取不同的养殖规格以及投喂建议
const getFeedingGet = async () => {
  let res = await feedingGet({ id: sycleVal.value.id })
  console.log(res, '不同养殖规格以及投喂')
  sycleArea.value.weight = res.weight
  sycleArea.value.strategy = res.strategy
}
</script>
<style lang='scss' scoped>
.factor-bg {
  background-size: 100% 100%;
  background-image: url(./assets/factor.png);
}
.factor-meassage {
  overflow-y: scroll;
  height: 100%;
}
select:focus {
  outline: none;
  border: none;
}
// 下拉框去除蓝色边框
::v-deep .el-select .el-input.is-focusable .el-input__inner:focus {
  border-color: #dcdfe6 !important; /* 还原为默认的边框颜色 */
  box-shadow: none !important; /* 去掉蓝色边框 */
}
::v-deep .el-input .el-input__inner {
  border: none !important;
  box-shadow: none !important;
}
::v-deep .el-input .el-input__wrapper {
  background: none !important;
  box-shadow: none !important;
}
.factor-meassage::-webkit-scrollbar {
  display: none;
}
@for $i from 1 through 4 {
  .top-icon-#{$i} {
    padding: 15px;
    box-sizing: border-box;
    background-image: url(./assets/top-icon#{$i}.png);
    background-size: 100% 100%;
  }
}
</style>