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
  getMissionStatisticsErdu,
  getProduceData,
  getProduceList,
  getCropNameDistribution
} from './apis'

//顶部左上方列表数据汇总
const topLeftDataList = ref<any[]>([])


const getTopLeftDataList = async () => {
  try {
    const [ topLeftDataListOne, topLeftDataListTwo ] = await Promise.all([
      getAreaYieldSales(), // 返回对象
      getErduEquipmentCount() // 返回数组
    ])

    topLeftDataList.value = [
      {
        id: 1,
        title: '种植面积',
        value: topLeftDataListOne.area,
        unit: '亩',
        logo: 'icon-zhongzhi'
      },
      {
        id: 2,
        title: '作物产量',
        value: topLeftDataListOne.yield,
        unit: 'Kg',
        logo: 'icon-zuowuchanliang'
      }, {
        id: 3,
        title: '销售额',
        value: topLeftDataListOne.salesVolume,
        unit: '元',
        logo: 'icon-icon-xiaoshoue'
      }, {
        id: 4,
        title: '设备总量',
        value: topLeftDataListTwo?.[topLeftDataListTwo.length - 1]?.totality,
        unit: '台',
        logo: 'icon-yonggongzongliang'
      }, {
        id: 5,
        children: [
          {
            id: '5-1',
            title: '在线设备',
            value: topLeftDataListTwo?.[topLeftDataListTwo.length - 1]?.online,
            unit: '台'
          },
          {
            id: '5-2',
            title: '离线设备',
            value: topLeftDataListTwo?.[topLeftDataListTwo.length - 1]?.offline,
            unit: '台'
          }
        ],
        logo: 'icon-bianzubeifen15'
      }, 
      {
        id: 6,
        title: '视频监控',
        value: topLeftDataListTwo.find(item => item.typeName === "视频监控")?.count || 0,
        unit: '台',
        logo: 'icon-shipinjiankong'
      }
    ]
    return
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}


// 种植作物规模 chart
const initPlantCropNumChart = async () => {
  const lineChartData: any[] = await getFiveYearValue()
  const yearArr = [2021, 2022, 2023, 2024];
  const formattedData = yearArr.map(item => {
    const selectedItem = lineChartData.find(ele => ele.heng_year === item)
    if (selectedItem) return selectedItem
    return {
      heng_year: item,
      unit: '亩',
      zong_summation: 0
    }
  })
  const linexAisData: number[] = formattedData.map(item => item.heng_year)
  const lineyAisData: number[] = formattedData.map(item => item.zong_summation)

  initChartStatic(
    'plantCropNum',
    generateBaseOptions({
      xAxis: {
        type: 'category',
        data: linexAisData,
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
        textStyle: {
          color: "#999"
        }
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
          data: lineyAisData,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
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
            show: false, //开启显示
            position: 'right', //在上方显示
            textStyle: {
              //数值样式
              color: '#a1a1aa',
              fontSize: 10
            }
          },
        }
      ],
      tooltip: {
        formatter: (item) => {
          const _item = formattedData.find(ele => ele.heng_year.toString() === item[0].name);
          if (!_item) return ''
          return `${_item.heng_year}年<br />${item[0].marker}种植规模<span style="padding-left: 1rem;">${_item.zong_summation}${_item.unit}</span>`
        }
      },
      grid: {
        left: '30',
        right: '26',
        top: '16%',
        bottom: '12%'
      }
    }))
}
onMounted(() => {
  initPlantCropNumChart();
  getTopLeftDataList()
})

// 种植品种一览图
const initPlantTypeChart = async () => {
  const res = await getCropNameDistribution()
  if (!res || !Array.isArray(res)) { return }
  const seriesData = res.map(item => ({
    name: item.cropName || '暂无数据',
    value: item.number,
    unit: item.unit || ''
  }))
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
        data: seriesData,
        label: {
          formatter: "{b} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],tooltip: {
        formatter: (item) => {
          return `数据详情<br />${item.marker}${item.name}<span style="padding-left: 1rem;">${item.value}${item.data.unit}</span>`
        },
        position: function (point) {
        return [point[0] - 90, point[1] + 20]
      },
      },
  }))
}
onMounted(() => { initPlantTypeChart() })

// ------------------数字产销--------------------
//数字产销饼状图

//数字产销中的特色产品柱状图,getProduceList
const initDigitalSaleChart = async () => {
  const res = await getProduceData().catch(()=>{})
  if(!Array.isArray(res)) return
  const data:Array<any> = []
  res.forEach((item) => {
    data.push({
      name: item?.city,
      value: item?.value
    })
  })
  console.log("🚀 ~ res.forEach ~ data:", data)
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
      },
      
    },//图例属性，
    color: ["#fe4377","#ff9f7f", "#9fe6b8", "#32c5e9", "#feba47", "#bee5fb",  "#3cb2ef"],
    tooltip: {
            trigger: 'item',
            formatter:"{b}:{c}({d}%)",
        },//提示框，鼠标悬浮交互时的信息提示
    series: [
      {
        type: "pie",
        radius: "65%",
        center: ["50%", "40%"],
        data: data ,
        label: {
          formatter: "{b}",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },//饼图文字的显示
      },
    ],
  }))
}
onMounted(() => { initDigitalSaleChart() })

// 数字产销 特色产品
const initFeatureProductChart = async() => {
  const data = await getProduceList().catch(()=>{})
  if(!Array.isArray(data)) return 
  console.log("🚀 ~ initFeatureProductChart ~ data:", data)
  const productNames = data.map(item => item?.product)
  const values = data.map(item => item?.value)

  initChartStatic('featureProduct', generateBaseOptions({
    dimensions: ['product', 'value'],
    xAxis: {
      type: 'category',
      data: productNames,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      }
    },
    title: {
      text: '特色产品',
      left: 'center',
      y: '16',
      textStyle: {
        color: '#5470c6',
        fontSize: 14
      },
    },


    color: ['#5470c6', '#36e1d9'],
    yAxis: {
      type: 'value',
      name: '销售额（元）',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      },
      splitLine: {
        //网格线
        show: false, //是否显示
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
        data: values,
        type: 'bar',
        smooth: true,
        label: {
          show: false, //开启显示
          position: 'right', //在上方显示
          textStyle: {
            //数值样式
            color: '#5470c6',
            fontSize: 10
          }
        },
      }
    ],
    grid: {
      left: '40',
      right: '16',
      top: '50',
      bottom: '25'
    }
  }))
}
onMounted(() => { initFeatureProductChart() })

// 农事任务
interface MissionStatistics {
  unfinishedNum: number,
  countAllNum: number,
  underway: number,
  finishNum: number,
  ratio: string
}
let missions = ref<MissionStatistics>({
  unfinishedNum: 0,
  countAllNum: 0,
  underway: 0,
  finishNum: 0,
  ratio: '0%'
})
const getMission = async () => {
  let res = await getMissionStatisticsErdu()
  if (!res) {
    return
  }
  // 初始化missions
  missions.value = {
    unfinishedNum: res.unfinishedNum || 0,
    countAllNum: res.countAllNum || 0,
    underway: res.underway || 0,
    finishNum: res.finishNum || 0,
    ratio: res.ratio || '0%'
  }
  // console.log('农事任务: ', res, missions.value)
  initAgriMissionChart([
    { name: "未完成数", value: missions.value.unfinishedNum },
    { name: "进行中", value: missions.value.underway },
    { name: "完成数", value: missions.value.finishNum },
  ])
}
getMission()
const initAgriMissionChart = (list: Array<any>) => {
  // console.log("农事任务-ECharts数据: ", list)
  initChartStatic('agriMission', generatePieOptions({
    title: {
      text: `任务完成率\n  ${ missions.value.ratio }`,
      textStyle: {
        fontSize: 14
      },
      left: '29.5%',
      top: '41%'
    },
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
        radius: ['40%', '65%'],
        center: ["40%", "50%"],
        data: list,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
        emphasis: {
          itemStyle: { borderWidth: 0 }
        }
      },
    ],
  }))
}

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
        <div class="grid grid-cols-3 2xl:grid-cols-6 gap-3 grid-cols-3-custom">
          <el-card v-for="item in topLeftDataList" :key="item.id" class="topLeftCard">
            <div class="flex items-center justify-between px-1rem box-border h-5rem space-x-4">
              <div class="w-3rem h-3rem flex items-center">
                <span :class="`!text-2rem text-#009688  iconfont ${item.logo}`"> </span>
              </div>
              <template v-if="item.children">
                <div class="flex items-end flex-col space-y-1 text-0.9rem whitespace-nowrap">
                  <div v-for="ele in item.children" :key="ele.id" class="space-x-1">
                    <span>{{ ele.title }}</span>
                      <span>{{ ele.value }}</span>
                      <span >{{ ele.unit }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex items-end flex-col space-y-1 whitespace-nowrap">
                  <div>{{ item.title }}</div>
                  <div>
                    <span>{{ item.value }}</span>
                    <span class="pl-1">{{ item.unit }}</span>
                  </div>
                </div>
              </template>
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
          class="w-full h-50rem xl:h-26rem 2xl:h-22rem overflow-auto space-y-.4rem pl-2 box-border"
          v-if="agriAdviceDataList.length > 0"
        >
          <el-scrollbar>
            <div
              v-for="(item, index) in agriAdviceDataList"
              :key="item.createTime"
              class="lg:flex box-border p-3 space-x-3 shadow-sm mb-2 rounded-1 mr-2"
              style="border: 1px solid #d1d1d1;"
              @mouseenter="showFullContent(index)"
              @mouseleave="showLessContent(index)"
            >
              <div class="!w-5rem h-5rem">
                <img :src="item.imgId" class="h-full object-contain"/>
              </div>
              <div class="w-full lg:w-[calc(100%_-_5.5rem)]">
                <div>{{ item.growth }}</div>
                <div :class="agriAdviceFeatureClassList[index]">{{ item.feature }}</div>
                <div class="w-full xl:flex xl:justify-between xl:items-center text-#666 text-.8rem pt-.1rem">
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
          <div id="digitalSale" class="w-20rem h-18rem"></div>
          <div id="featureProduct" style="width: calc(100% - 22rem)"></div>
        </div>
      </el-card>
      <el-card
        class="w-26rem p-2"
        header="农事任务"
      >
        <div
          class="shadow-sm flex rounded-2 justify-between items-center p-3"
          style="border: 1px solid #e1e1e1;"
        >
          <div>总农事任务:</div>
          <div>{{ missions.countAllNum }}</div>
        </div>
        <div id="agriMission" class="w-full h-14rem mt-3"></div>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url(./assets/iconfont/iconfont.css);
:deep(.topLeftCard > .el-card__body) {
  padding: 0 !important;
}
@media (max-width: 1600px) {
  .grid-cols-3-custom {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }
}

</style>