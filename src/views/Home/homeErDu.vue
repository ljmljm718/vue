<script setup lang="ts">
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import {
  getAreaYieldSales,
  getErduEquipmentCount,
  getVarietyListErdu,
  getAdviceByCropCodeErdu,
  getFiveYearValue,
} from './apis'


//顶部左上方列表数据汇总
const topLeftDataList = ref<any[]>([
  {
    id: 1,
    title: '种植面积',
    value: null,
    unit: '亩',
    logo: '图'
  },
  {
    id: 2,
    title: '作物产量',
    value: null,
    unit: 'Kg',
    logo: '图'
  }, {
    id: 3,
    title: '销售额',
    value: null,
    unit: '万元',
    logo: '图'
  }, {
    id: 4,
    title: '设备总量',
    value: null,
    unit: '台',
    logo: '图'
  }, {
    id: 5,
    title: '设备在线<br/>设备离线',
    value: [null,null],
    unit: '台',
    logo: '图'
  }, 
  {
    id: 6,
    title: '视频监控',
    value: null,
    unit: '台',
    logo: '图'
  }
])


const getTopLeftDataList = async () => {
  try {
    const [topLeftDataListOne, topLeftDataListTwo] = await Promise.all([
      getAreaYieldSales(), // 返回对象
      getErduEquipmentCount() // 返回数组
    ])
    
    topLeftDataList.value[0].value = topLeftDataListOne?.area || 0 
    topLeftDataList.value[1].value = topLeftDataListOne?.yield || 0 
    topLeftDataList.value[2].value = topLeftDataListOne?.salesVolume || 0

    topLeftDataList.value[3].value = topLeftDataListTwo[topLeftDataListTwo.length - 1]?.totality || 0 
    topLeftDataList.value[4].value[0] = topLeftDataListTwo[topLeftDataListTwo.length - 1]?.online || 0 
    topLeftDataList.value[4].value[1] = topLeftDataListTwo[topLeftDataListTwo.length - 1]?.offline || 0 
    topLeftDataList.value[5].value = topLeftDataListTwo.find(item => item.typeName === "视频监控") || 0

    console.log('合并后的数据:', topLeftDataList.value)

  } catch (error) {
    console.error('获取数据失败:', error)
  }
}


// 种植作物规模 chart
const initPlantCropNumChart = async() => {
  const lineChartData:any[] = await getFiveYearValue()
  let linexAisData: number[] = []
  let lineyAisData: number[] = []
  let yAxisUnit:string = '';
  lineChartData.forEach(item => {
    linexAisData.push(item.heng_year); 
    lineyAisData.push(item.zong_summation); 
    if (!yAxisUnit) { 
        yAxisUnit = item.unit;
    }
});
  initChartStatic(
    'plantCropNum', 
    generateBaseOptions({
    xAxis: {
      type: 'category',
      data: [2021,2022,2023,2024],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      }
    },
    legend: {
      show: true,
      orient: 'horizontal',
      itemWidth: 15,
      itemHeight: 15,
    },
    color: ['rgba(126, 193, 232,1)', '#36e1d9'],
    yAxis: {
      name: '',
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      },
      splitLine: {
        //网格线
        show: true, //是否显示
        lineStyle: {
          //网格线样式
          color: '#a1a1aa80', //网格线颜色
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
        name: '种植规模',
        data: [20,40,60,80],
        type: 'line',
        smooth: true,
        areaStyle:{
          color:{
            type:'linear',
            colorStops: [
              {
                offset: 0,
                color: 'rgba(126, 193, 232,1)' 
              },
              {
                offset: 1,
                color: 'rgba(126, 193, 232,0.2)'
              }
            ]
          }
        },
        label: {
          show: true, //开启显示
          position: 'right', //在上方显示
          textStyle: {
            //数值样式
            color: '#a1a1aa',
            fontSize: 10
          }
        },
      }
    ],
    grid: {
      left: '8%',
      right: '6%',
      top: '6%',
      bottom: '12%'
    }
  }))
}
onMounted(() => { initPlantCropNumChart(), getTopLeftDataList() })

// 种植品种一览图
const initPlantTypeChart = (list = [
  { name: '1', value: '2' },
  { name: '4', value: '88' },
]) => {
  initChartStatic('plantTypeChart', generatePieOptions({
    legend: {
      show: true,
      top: "bottom",
      left: "center",
      bottom: '0',
      orient: 'horizontal',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#a1a1aa'
      }
    },
    color: ["#48e5e5", "#9dadb0", "#3254dd", "#feba47", "#bee5fb", "#3cd495", "#ffedb7"],
    series: [
      {
        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        data: list,
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],
  }))
}
onMounted(() => { initPlantTypeChart() })

// 数字产销
const initDigitalSaleChart = (list = [
  { name: '1', value: '2' },
  { name: '4', value: '88' },
]) => {
  initChartStatic('digitalSale', generatePieOptions({
    legend: {
      show: true,
      top: "bottom",
      left: "center",
      bottom: '0',
      orient: 'horizontal',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#a1a1aa'
      }
    },
    color: ["#48e5e5", "#9dadb0", "#3254dd", "#feba47", "#bee5fb", "#3cd495", "#ffedb7"],
    series: [
      {
        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        data: list,
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],
  }))
}
onMounted(() => { initDigitalSaleChart() })

// 数字产销 特色产品
const initFeatureProductChart = () => {
  initChartStatic('featureProduct', generateBaseOptions({
    xAxis: {
      data: [1,2,3,4],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      }
    },
    legend: {
      show: false,
      orient: 'horizontal',
      itemWidth: 15,
      itemHeight: 15,
    },
    color: ['#ffa773', '#36e1d9'],
    yAxis: {
      name: '',
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      },
      splitLine: {
        //网格线
        show: true, //是否显示
        lineStyle: {
          //网格线样式
          color: '#a1a1aa80', //网格线颜色
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
        data: [1,2,3,4],
        type: 'bar',
        smooth: true,
        label: {
          show: true, //开启显示
          position: 'right', //在上方显示
          textStyle: {
            //数值样式
            color: '#a1a1aa',
            fontSize: 10
          }
        },
      }
    ],
    grid: {
      left: '8%',
      right: '6%',
      top: '6%',
      bottom: '12%'
    }
  }))
}
onMounted(() => { initFeatureProductChart() })

// 农事任务
const initAgriMissionChart = (list = [
  { name: '1', value: '2' },
  { name: '4', value: '88' },
]) => {
  initChartStatic('agriMission', generatePieOptions({
    legend: {
      show: true,
      top: "center",
      left: "right",
      bottom: '0',
      orient: 'vertical',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#a1a1aa'
      }
    },
    color: ["#48e5e5", "#9dadb0", "#3254dd", "#feba47", "#bee5fb", "#3cd495", "#ffedb7"],
    series: [
      {
        type: "pie",
        radius: "65%",
        center: ["40%", "50%"],
        data: list,
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],
  }))
}
onMounted(() => { initAgriMissionChart() })

interface AdviceOption {
  id: string,
  name: string
}
interface AdviceData {
  createTime: string,
  feature: string,
  growth: string,
  imgId: string
}
// 农事建议列表
const agriAdviceDataList = ref<Array<AdviceData>>([])

// 农事建议
const selectedAgriAdvice = ref<string>('')
const agriAdviceOptions = ref<Array<AdviceOption>>([])

// feature样式字符串
const agriAdviceFeatureClassList = ref<Array<string>>([])

// 切换品种
const handleAgriAdviceChange = async (item: string) => {
  // console.log("🚀 ~ item:", item)
  // 在选项列表里找到item对应的项
  const tmp = agriAdviceOptions.value.find(ele => item === ele.name)
  // console.log("$$$$$$$$$$$$$", tmp)

  // 用找到的item的ID作为品种ID请求数据
  const params = { cropCode: tmp!.id }
  let adviceList = await getAdviceByCropCodeErdu(params)
  // console.log("农事建议-建议列表-切换选项1: ", adviceList)
  if (!adviceList) {
    adviceList = []
  }
  // console.log("农事建议-建议列表-切换选项2: ", adviceList)

  // 设置选中的选项和建议列表
  selectedAgriAdvice.value = tmp!.name
  agriAdviceDataList.value = adviceList
  agriAdviceFeatureClassList.value = adviceList.map((ele: AdviceData) => {
    return 'h-2.5rem text-.9rem line-clamp-2 pl-.5rem my-.5rem'
  })
}

// 初始化农事建议
const getAgriAdvice = async () => {
  // 获取品种列表
  const varietyList = await getVarietyListErdu()
  if (!varietyList || !varietyList.length) {
    return
  }
  // console.log("农事建议-品种列表: ", varietyList)

  // 设置下拉列表 第0项为当前选中
  agriAdviceOptions.value = varietyList
  selectedAgriAdvice.value = varietyList[0].name

  // 根据当前选中的品种ID获取建议列表
  const params = { cropCode: varietyList[0].id }
  const adviceList = await getAdviceByCropCodeErdu(params)
  if (!adviceList || !adviceList.length) {
    return
  }
  // console.log("农事建议-建议列表: ", adviceList)

  // 设置当前建议列表
  agriAdviceDataList.value = adviceList
  agriAdviceFeatureClassList.value = adviceList.map((ele: AdviceData) => {
    return 'h-2.5rem text-.9rem line-clamp-2 pl-.5rem my-.5rem'
  })
}
getAgriAdvice()

const showFullContent = (idx: number) => {
  agriAdviceFeatureClassList.value[idx] = 'text-.9rem pl-.5rem my-.5rem'
}
const showLessContent = (idx: number) => {
  agriAdviceFeatureClassList.value[idx] = 'h-2.5rem text-.9rem line-clamp-2 pl-.5rem my-.5rem'
}
</script>
<template>
  <div class="space-y-3">
    <div class="flex items-stretch space-x-3">
      <div class="flex flex-col space-y-3 grow">
        <div class="grid xl:grid-cols-3 2xl:grid-cols-6 gap-3">
          <el-card v-for="item in topLeftDataList" :key="item.id" class="topLeftCard">
            <div class="flex items-center space-x-1rem justify-center h-5rem ">
              <div class="w-1rem h-1rem bg-red flex">{{ item.logo }}</div>
              <div class="flex text-0.9rem" v-html="item.title"></div>
              <div class="w-2rem flex ">
                <div v-if="Array.isArray(item.value) && item.value.length > 1" class="flex flex-col  text-0.6rem whitespace-nowrap">
                  <div>{{ item.value[0] !== null ? item.value[0] : 0 }} {{ item.unit }}</div>
                  <div><br /></div> <!-- 手动换行 -->
                  <div>{{ item.value[1] !== null ? item.value[1] : 0 }} {{ item.unit }}</div>
                </div>
                <div v-else>
                  <div class="text-0.6rem whitespace-nowrap">{{ item.value !== null ? item.value : 0 }} {{ item.unit }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="flex space-x-3 items-stretch">
          <el-card
            class="grow p-2"
            header="种植作物规模"
          >
            <div id="plantCropNum" class="w-full h-16rem"></div>
          </el-card>
          <el-card
            class="w-20rem p-2"
            header="种植品种一览图"
          >
            <div id="plantTypeChart" class="w-full h-16rem"></div>
          </el-card>
        </div>
      </div>
      <el-card
        class="w-26rem p-2"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div>农事建议</div>
            <div>
              <el-select
                v-model="selectedAgriAdvice"
                @change="handleAgriAdviceChange"
                class="!w-8rem"
                v-if="agriAdviceOptions.length > 0"
              >
                <el-option
                  v-for="item in agriAdviceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </div>
          </div>
        </template>
        <div
          class="w-full h-20rem overflow-auto space-y-.4rem p-2 box-border"
          v-if="agriAdviceDataList.length > 0"
        >
          <el-scrollbar>
            <div
              v-for="(item, index) in agriAdviceDataList"
              :key="item.createTime"
              class="flex box-border p-3 space-x-3 shadow-md"
              @mouseenter="showFullContent(index)"
              @mouseleave="showLessContent(index)"
            >
              <div class="!w-5rem h-5rem">
                <img :src="item.imgId" class="h-full object-contain"/>
              </div>
              <div style="width: calc(100% - 5.5rem)">
                <div>{{ item.growth }}</div>
                <div :class="agriAdviceFeatureClassList[index]">{{ item.feature }}</div>
                <div class="w-full flex justify-between items-center text-#666 text-.8rem pt-.1rem">
                  <div>农事建议</div>
                  <div>{{ item.createTime.replace("T", " ") }}</div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-else class="w-full min-h-15rem flex flex-col justify-center space-y-2 items-center">
          <img src="/images/noData.png" class="aspect-1 w-8rem" />
          <div
            class="py-3 text-[.9rem] text-[#999]"
          >暂无数据</div>
        </div>
      </el-card>
    </div>
    <div class="flex items-stretch space-x-3">
      <el-card
        class="grow p-2"
        header="数字产销"
      >
        <div class="flex justify-between">
          <div id="digitalSale" class="w-16rem h-18rem"></div>
          <div id="featureProduct" style="width: calc(100% - 16.6rem)"></div>
        </div>
      </el-card>
      <el-card
        class="w-26rem p-2"
        header="农事任务"
      >
        <div class="shadow-md flex justify-between items-center p-3">
          <div>总农事任务:</div>
          <div></div>
        </div>
        <div id="agriMission" class="w-full h-14rem mt-3"></div>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.topLeftCard > .el-card__body) {
  padding: 0 !important;
}
</style>