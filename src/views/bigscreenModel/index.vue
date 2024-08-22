<script lang="tsx">
import { ref, onMounted } from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import mainBg from './assets/main-bg.png'
import duckBg from './assets/duck-bg.png'
import fishBg from './assets/fish-bg.png'
import headerBg from './assets/headerBg.png'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import {
  ModelPlanByModelId,
  modelInfo,
  MonitorIndicatorWithDetail,
  CropPlotByModelId,
  modelMonitor,
  ModelOverviewStatistics
} from './api'
const {
  BigscreenAdapter,
  BigscreenContainer,
  BigscreenHeader,
  BigscreenFooter,
  BigscreenMain,
  BigscreenCard,

  BigscreenTab,
  // BigscreenSelector,
  BigscreenTable
} = BigscreenBuilder
export default defineComponent({
  name: 'BigscreenTest',
  setup() {
    const route = useRoute()
    const router = useRouter()
    //模型id
    const modelId = ref('')
    const beLongPlot = ref('')
    const growthId = ref()
    const growthId2 = ref(true)
    const bigscreenName = ref('')
    const batch = ref('')
    const MainImg = ref('')
    console.log(route.query, 'route.query route.query route.query123')
    bigscreenName.value = route.query.modelName
    modelId.value = route.query.modelId
    beLongPlot.value = route.query.plotId
    growthId.value = route.query.growthId
    batch.value = route.query.batchCode
    const setInter = ref(null)
    const bubbles = ref([])
    const widht = ref()
    const height = ref()
    const createBubbles = () => {
      bubbles.value=[]
      for (let i = 0; i < mainList.value.length; i++) {
        bubbles.value.push({
          id: i,
          x: Math.random() * 300,
          y: Math.random() * 300,
          velocityX: (Math.random() - 0.5) * 10,
          velocityY: (Math.random() - 0.5) * 10
        })
      }
    }
    const animateBubbles = () => {
      setInter.value = setInterval(() => {
        bubbles.value.forEach((bubble) => {
          bubble.x += bubble.velocityX
          bubble.y += bubble.velocityY

          if (bubble.x < 0 || bubble.x > widht.value) {
            bubble.velocityX *= -1
          }
          if (bubble.y < 0 || bubble.y > height.value) {
            bubble.velocityY *= -1
          }
        })
      }, 1000 / 20)
    }
    const numVal = ref(1)
    const rightNum = ref(0)
    //雷达图
    const drawRadarChart = (obj) => {
      let list = obj.modelIndicatorElementCardVOList
      initChartStatic('radarChart', {
        title: {
          // text: '评估评分占比分析图'
        },
        tooltip: {
          textStyle: {
            color: '#000'
          },
          formatter: (params) => {
            //自定义绘制tooltip
            let str = '<div>模型要素</div>'
            list.forEach((item) => {
              str += ` <div>
                <div class='flex justify-between color-[${
                  item.assess.includes('正常') ? '#000' : 'red'
                }]'><div>${item.elementName} </div>  <div class=' ml-10px mr-10px'>${
                item.assess
              }</div> <div>${item.score}</div> </div>
                </div> `
            })
            return str //解决未在拐点悬浮undefine问题
          }
        },
        radar: [
          {
            indicator: list.map((item) => {
              return {
                name: item.elementName
              }
            }),
            name: {
              textStyle: {
                fontSize: 15,
                color: '#666666',
                fontWeight: 'bold'
              }
            },
            splitArea: {
              // 坐标轴在 grid 区域中的分隔区域，默认不显示。
              show: true,
              areaStyle: {
                // 分隔区域的样式设置。
                color: '#18303a' // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
              }
            },
            axisLine: {
              // 设置雷达图中间射线的颜色
              lineStyle: {
                color: '#rgba(241, 241, 241)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(241, 241, 241)'
              }
            },
          }
        ],
        series: [
          {
            name: '模型要素',
            type: 'radar',
            data: [
              {
                value: list.map((item) => item.score),
                name: '模型要素',
                label: {},
                itemStyle: {
                  normal: {
                    color: 'rgba(198, 234, 230)',
                    lineStyle: {
                      color: 'rgba(0, 157, 143)'
                    }
                  }
                }
              }
            ],

            textStyle: {
              color: '#000'
            },
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '',
              borderColor: '',
              borderWidth: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                colorStops: [
                  {
                    offset: 0,
                    color: '#26eae7'
                  },
                  {
                    offset: 1,
                    color: '#26eae7'
                  }
                ]
              }
            }
          }
        ]
      })
    }
    //为空调用的echart
    const drawRadarChart2 = () => {
      initChartStatic('radarChart', {
        series: [
          {
            name: '模型要素',
            type: 'radar',
            data: [
              {
                value: [],
                name: '模型要素',
                label: {},
                itemStyle: {
                  normal: {
                    color: 'rgba(198, 234, 230)',
                    lineStyle: {
                      color: 'rgba(0, 157, 143)'
                    }
                  }
                }
              }
            ],

            textStyle: {
              color: '#000'
            },
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '',
              borderColor: '',
              borderWidth: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                colorStops: [
                  {
                    offset: 0,
                    color: '#26eae7'
                  },
                  {
                    offset: 1,
                    color: '#26eae7'
                  }
                ]
              }
            }
          }
        ]
      })
    }
    // 右侧移动
    const rightSetNum = ref(0)
    const cycleListChange3 = (index) => {
      if (infoList.value.length > 3) {
        rightRelativeNum.value += (rightSetNum.value - index) * 75 * 2
      }
    }
    //模型要素切换
    const mainList = ref([])
    const tabFn = (obj, val) => {
      cycleListChange3(val)
      rightNum.value = val
      drawRadarChart(obj)
      mainList.value = obj.modelIndicatorElementCardVOList
      rightSetNum.value = val
      createBubbles()
    }
    const mainTopNum = ref(0)
    const infoList = ref([])
    //农事计划
    const planByList = ref([])
    const getModelPlanByModelId = async () => {
      let res = await ModelPlanByModelId({ modelId: modelId.value,plotId: beLongPlot.value })
      console.log(res,'农事计划')
      planByList.value = res
    }
    getModelPlanByModelId()
    //中间生长周期跟左下共用
    const leftRelatice = ref(0)
    const setNum = ref(0)
    const leftSetNum = ref(0)
    const childList = ref([])
    const getModelInfo = async () => {
      let res = await modelInfo({ modelId: modelId.value })
      infoList.value = res.splice(1)
      infoList.value.forEach((item, index) => {
        if (item.growth == res[0].curPeriod) {
          mainTopNum.value = index
          MainImg.value = item.imgId
          numVal.value = index
          childList.value = item.child2
        }
      })
      let num = mainTopNum.value
      let num2 = numVal.value
      setNum.value = 2
      leftSetNum.value = 2
      cycleListChange(num)
      cycleListChange2(num)
      setNum.value = num
      leftSetNum.value = num2
    }
    getModelInfo()
    //模型要素
    const DetailList = ref([])
    const DetailListChild = ref([])
    const rightRelativeNum = ref(0)
    const getMonitorIndicatorWithDetail = async () => {
      let res = await MonitorIndicatorWithDetail({
        modelId: modelId.value,
        growthId: growthId.value
      })
      console.log(res,'moxyaosu ')
      DetailList.value = res
      mainList.value = res.length>0? res[0].modelIndicatorElementCardVOList:[]
      if(res.length>0){
      drawRadarChart(res[0])
      }
      if (growthId2.value || DetailList.value.length >0 ) {
        let dom = document.getElementById('mainDom')
        widht.value = dom.offsetWidth - 100
        height.value = dom.offsetHeight - 100
        createBubbles()
        animateBubbles()
      }
      if(DetailList.value.length==0  ){
         mainList.value=[]
         bubbles.value=[]
         drawRadarChart2()
        }
    }
    getMonitorIndicatorWithDetail()

    //地块信息
    const cropPlotList = ref({})
    const getCropPlotByModelId = async () => {
      let res = await CropPlotByModelId({ modelId: modelId.value, beLongPlot: beLongPlot.value })
      console.log(res,'dikuaixinxi')
      cropPlotList.value = res[0]
    }
    getCropPlotByModelId()

    //模型监测
    const monitorList = ref([])
    const monitorListChild = ref([])
    const getModelMonitor = async () => {
      let res = await modelMonitor({ modelId: modelId.value, batch: batch.value })
      monitorList.value = res.splice(0, 2)
      monitorList.value.forEach(item=>{
        let list=Object.keys(item)
        if(list.length==0 ){
          item.value=''
        }
      })
    }
    getModelMonitor()
    //中间下方折线图
    const footerList = ref([])
    const chartLineNum = ref(0)
    const getModelOverviewStatistics = async () => {
      let res = await ModelOverviewStatistics({
        modelId: modelId.value,
        growthId: growthId.value,
        batch: batch.value
      })
      footerList.value = res

      setTimeout(() => {
        initChartLine1(footerList.value[0])
      }, 500)
    }
    getModelOverviewStatistics()
    //折线图
    const initChartLine1 = (list) => {
      footerList.value.forEach((item, index) => {
        initChartStatic(
          `chartLine${index + 1}`,
          generateBaseOptions({
            xAxis: {
              data: item.dataList.map((itm) => itm.createTime),
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
            yAxis: {
              type: 'value',
              name: `单位：${item.dataList[0].units}`,
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
            color: ['#34d9d1'],
            series: [
              {
                name: `${item.elementName}折线图`,
                data: item.dataList.map((itm) => itm.elementValue),
                type: 'line',
                smooth: false,
                symbol: 'none',
                barGap: '70%',
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: {
                    //数值样式
                    color: '#eee',
                    fontSize: 10
                  }
                },
                areaStyle: {
                  color: '#18565c'
                }
              }
            ],
            grid: {
              left: '10%',
              right: '4%',
              top: '20%',
              bottom: '15%'
            }
          })
        )
      })
    }

    //底部折线图加减
    const chartNum = ref(0)
    const chartNum2 = ref(0)
    const chartNum3 = ref(1)
    const mainFooter = (str) => {
      if (str == '+') {
        chartNum3.value = -1
        if (
          chartNum.value == footerList.value.length - 1 ||
          chartNum2.value == footerList.value.length - 1
        ) {
          return true
        } else if (chartNum.value == 1 || chartNum.value == 0) {
          chartNum.value = 2
          chartNum2.value = 3
        } else {
          chartNum.value++
          chartNum2.value++
        }
      } else {
        if (chartNum.value == 0 || chartNum2.value == 1) {
          return true
        } else {
          chartNum.value--
          chartNum2.value--
        }
      }
    }
    const goPage = () => {
      router.go(-1)
    }
    // 处理周期列表移动
    const left = ref(0)
    const cycleListChange = (index) => {
      if (infoList.value.length > 6) {
        left.value += (setNum.value - index) * 85 * 2
      }
    }
    const mainRight = () => {
      if (infoList.value.length - 1 > mainTopNum.value) {
        handlerMain(infoList.value[mainTopNum.value + 1], mainTopNum.value + 1)
      }
    }
    const mainLeft = () => {
      if (mainTopNum.value > 0) {
        handlerMain(infoList.value[mainTopNum.value - 1], mainTopNum.value - 1)
      }
    }
    //中间顶部点击
    const handlerMain = (item, index) => {
      cycleListChange(index)
      growthId.value = item.growthId
      growthId2.value = false
      MainImg.value = item.imgId
      mainTopNum.value = index
      setNum.value = index
      getMonitorIndicatorWithDetail()
      getModelOverviewStatistics()

    }
    // 左侧移动
    const cycleListChange2 = (index) => {
      if (infoList.value.length > 4) {
        leftRelatice.value += (leftSetNum.value - index) * 50 * 2
      }
    }
    //模型周期切换
    const handleTab = (item, index) => {
      cycleListChange2(index)
      numVal.value = index
      childList.value = item.child2
      leftSetNum.value = index
    }
    //header头部时间问题
    const curTime = ref({})
    const getCurTime = () => {
      const tmpTime = new Date()
      let year = tmpTime.getFullYear()
      let month = tmpTime.getMonth() + 1
      let day = tmpTime.getDate() < 10 ? '0' + tmpTime.getDate() : tmpTime.getDate()
      let hours = tmpTime.getHours() < 10 ? '0' + tmpTime.getHours() : tmpTime.getHours()
      let minutes = tmpTime.getMinutes() < 10 ? '0' + tmpTime.getMinutes() : tmpTime.getMinutes()
      let seconds = tmpTime.getSeconds() < 10 ? '0' + tmpTime.getSeconds() : tmpTime.getSeconds()
      curTime.value = {
        year,
        month,
        day,
        hours,
        minutes,
        seconds
      }
    }
    const timeDom = () => {
      return (
        <div class="absolute mt-[-25px]">
          <div class="text-white text-[24px]">
            {curTime.value.hours}:{curTime.value.minutes}:{curTime.value.seconds}
          </div>
          <div class="text-[14px] text-white opacity-50">
            {curTime.value.year}年{curTime.value.month}月{curTime.value.day}日
          </div>
        </div>
      )
    }
    onMounted(() => {
      getCurTime()
      setInterval(() => {
        getCurTime()
      }, 1000)
    })
    //中间内容
    const MainContent = () => {
      return (
        <div
          class="w-100% h-100% grid  gap-15px "
          style="grid-template-columns: 25% calc(50% - 30px) 25%; grid-auto-columns: 100%;"
        >
          {/* 左侧 */}
          <div
            class="grid gap-15px overflow-auto "
            style="grid-template-rows: 32% 32% calc(36% - 30px); grid-auto-rows: 100%;"
          >
            {/* 模型监测 */}
            <div class="">
              <div class="box-title ">模型监测</div>
              <div class="box-item flex justify-center items-center flex-col">
                {monitorList.value.map((item, index) => {
                  return (
                    <div class="flex w-100% h-50% items-center justify-center">
                      <div
                        class={`${
                          item.value == '优秀'
                            ? 'left-icon-2'
                            : item.value == '良好'
                            ? 'left-icon-3'
                            : item.value == '一般'
                            ? 'left-icon-4'
                            : item.value == '很差'
                            ? 'left-icon-5'
                          : item.value==''?'left-icon-3':'left-icon-1'
                        } mr-15px`}
                      ></div>
                      <div class="w-45% h-100% flex flex-col justify-center">
                        <div class="flex w-90% ml-[25px] mb-[-10px] items-center justify-between">
                          {' '}
                          <div class="color-[#8a969c]">{item.title}</div>
                          <div class="color-[#fff] text-xl">
                            {item.value}
                            <span v-if={index == 0} class="color-[#304650] ml-10px text-14px">
                              {index==0?'分':''}
                            </span>
                          </div>
                        </div>
                        <div
                          class={` ${
                            item.value == '优秀'
                              ? 'left-xian-1'
                              : item.value == '良好'
                              ? 'left-xian-2'
                              : item.value == '一般'
                              ? 'left-xian-3'
                              : item.value == '很差'
                              ? 'left-xian-4'
                              : 'left-xian-2'
                          } w-100% h-20px`}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* 地块信息 */}
            <div>
              <div class="box-title ">地块信息</div>
              <div class="box-item ">
                {
                  cropPlotList.value?(
                    <div>
                      <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">
                    基地名称：
                  </div>
                  <div class="color-[#fff]">{cropPlotList.value.parkName}</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">
                    地块名称：
                  </div>
                  <div class="color-[#fff]">{cropPlotList.value.plotName}</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">
                    种植品种：
                  </div>
                  <div class="color-[#fff]">{cropPlotList.value.varietyName}</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">
                    地块面积：
                  </div>
                  <div class="color-[#fff]">{cropPlotList.value.plotArea}亩</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">
                    预计产量：
                  </div>
                  <div class="color-[#fff]">{cropPlotList.value.predictedOutput}</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">
                    经营人：
                  </div>
                  <div class="color-[#fff]">{cropPlotList.value.farmerName}</div>
                </div>
                    </div>
                  ):(
                    <div class='dataNull w-150px mx-auto h-100px '></div>

                  )
                }
                
              </div>
            </div>
            {/* 模型周期 */}
            <div style="overflow:hidden ;">
              <div class="box-title">模型周期</div>
              <div class="box-item2 pb-[15px] box-border h-400px" style="overflow:hidden ;">
                <div style="overflow:hidden; " class=" left-item1 ">
                  {infoList.value.length < 4 ? (
                    <div class="flex w-full relative">
                      {infoList.value.map((item, index) => {
                        return (
                          <div class="flex">
                            <div
                              class={numVal.value == index ? 'left-active ' : 'left-actived'}
                              style="margin-bottom: 15px; cursor: pointer; "
                              onClick={() => handleTab(item, index)}
                            >
                              {item.growth}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div class="flex w-full relative" style={`left:${leftRelatice.value}px`}>
                      {infoList.value.map((item, index) => {
                        return (
                          <div class="flex">
                            <div
                              class={numVal.value == index ? 'left-active ' : 'left-actived'}
                              style="margin-bottom: 15px; cursor: pointer; "
                              onClick={() => handleTab(item, index)}
                            >
                              {item.growth}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div class="w-100% mt-10p left-item2" style="height:200px;overflow-x:scroll; ">
                  <div class="flex items-center text-16px color-[#33d1ca]">
                    <div class="w-3px ml-10px h-10px bg-[#33d1ca] mr-15px"></div> 周期事项
                  </div>
                  <div class="mt-15px">
                    {
                      childList.value.length>0?
                        childList.value.map((item, index) => {
                      return (
                        <div class="flex ml-10px h-110px">
                          <div class="color-[#33d1ca] text-xl">{index + 1}</div>
                          <div class="mx-15px flex flex-col items-center ">
                            <div class="left3-pie w-40px h-35px mr-[-13px]"></div>
                            <div class="w-2px !h-500px mt-[-9px] mr-[-10px] bg-[#435b63]"></div>
                          </div>
                          <div class=" w-75% px-20px h-68% py-10px left3-meassage">
                            <div class="color-[#33d1ca] text-lg ml-5px">{item.itemName}</div>
                            <div class="color-[#9db1b7] text-sm">{item.itemContent}</div>
                          </div>
                        </div>
                      )
                    })
                      :
                        <div class='dataNull w-150px mx-auto h-100px '></div>
                      
                    }
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 中间 */}
          <div
            class="middle-main-wrapper grid gap-10px"
            style="grid-template-rows: 10% calc(60% - 20px) 30%; grid-auto-columns: 100%;"
          >
            <div
              class=" w-100% h-110px flex justify-between items-center"
              style="overflow-x: auto;overflow:hidden; white-space: nowrap; "
            >
              <div
                onClick={() => mainLeft()}
                class={
                  mainTopNum.value == 0
                    ? 'main-top-left cursor-pointer'
                    : 'main-top-left2 cursor-pointer'
                }
                style="display:inlin-block;width: 20px;height:25px;margin-top:25px;"
              ></div>
              <div class="flex w-80% flex justify-evenly ">
                {infoList.value.length < 6 ? (
                  <div class="w-full flex">
                    <div class="w-[837px] h-[100px] flex justify-center">
                      {infoList.value.map((e, i, arr) => (
                        <div class="flex">
                          <div
                            onClick={() => handlerMain(e, i)}
                            class={
                              i === mainTopNum.value
                                ? 'cycle-item main-top-active cursor-pointer'
                                : 'cycle-item main-top-actived cursor-pointer'
                            }
                          >
                            <span>{e.growth}</span>
                          </div>
                          {i != arr.length - 1 ? (
                            <div class="cycle-item next-arrow mt-25px"></div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style="overflow:hidden" class="main-top ">
                    <div class="w-full flex relative " style={`left:${left.value}px`}>
                      {infoList.value.map((e, i) => (
                        <div class="flex">
                          <div
                            class={
                              i === mainTopNum.value
                                ? 'cycle-item main-top-active cursor-pointer'
                                : 'cycle-item main-top-actived cursor-pointer'
                            }
                            onClick={() => {
                              handlerMain(e, i)
                            }}
                          >
                            <span>{e.growth}</span>
                          </div>
                          {/** 周期之间的箭头 */}
                          {i != infoList.value.length - 1 ? (
                            <div class="cycle-item next-arrow mt-25px"></div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div
                onClick={() => mainRight()}
                class={
                  mainTopNum.value == infoList.value.length - 1
                    ? 'main-top-right cursor-pointer'
                    : 'main-top-right2 cursor-pointer'
                }
                style="display:inlin-block; width: 20px;height:25px;margin-top:25px;"
              ></div>
            </div>
            <div class="   w-100% h-100% color-[#fff] relative">
              <img
                src={MainImg.value}
                class="absolute w-350px h-350px top-50% left-50%"
                style="transform: translate(-50%, -50%); object-fit:contain; background-size: 100% 100%;"
              />
              
              <div class="w-100% h-100% " id="mainDom">
                {bubbles.value.map((item, index) => {
                  return (
                    <div
                      style={` top: ${item.y}px; left: ${item.x}px `}
                      class={`main-pie  w-100px h-100px flex flex-col items-center justify-center`}
                    >
                      <div class="text-14px">{mainList.value[index]?.value}</div>
                      <div class="text-10px mt-5px">{mainList.value[index]?.elementName}</div>
                      <div class="text-10px mt-5px">{mainList.value[index]?.assess}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div class="flex w-100% h-100% justify-evenly items-center">
              <div
                onClick={() => mainFooter('-')}
                class="main-footer-left w-15px h-20px -ml-20px"
                style="cursor:pointer"
              ></div>
              {footerList.value.length > 0 ? (
                footerList.value.map((item, index) => {
                  return (
                    <div
                      v-show={
                        chartNum.value == index ||
                        chartNum3.value == index ||
                        chartNum2.value == index
                      }
                      class="w-45% h-100%"
                    >
                      <div class="box-title">{item.elementName}折线图</div>
                      <div class="box-item">
                        <div id={`chartLine${index + 1}`} class="w-390px h-200px"></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div class='dataNull w-150px h-100px mt-20px'></div>
              )}

              <div
                onClick={() => mainFooter('+')}
                class="main-footer-right w-15px h-20px"
                style="cursor:pointer"
              ></div>
            </div>
          </div>
          {/* 右侧 */}
          <div
            class="grid grid-rows-2 gap-20px "
            style="grid-template-rows: 49% 50%; grid-auto-columns: 100%;"
          >
            <div>
              <div class="box-title">
                {bigscreenName.value.includes('连粳11号模型一') ? '农事计划' : '农事计划'}
              </div>
              <div class=' box-item flex flex-col !h-420px'>
                {planByList.value.length > 0 ? (
                  planByList.value.map((item) => {
                    return (
                        <div class="flex justify-around mt-[-10px]">
                        <div class="flex flex-col items-center">
                          <div class="w-20px h-20px right-warpper-bg"></div>
                          <div class="w-2px h-90px mt-[-10px] bg-[#435b63]"></div>
                        </div>
                        <div class="w-85% left3-meassage h-75px  px-[20px] box-border py-10px">
                          <div class="color-[#fff] flex justify-between items-center text-17px">
                            <div>{item.farmStage}</div>
                            <div class="right-xian"></div>
                            <div>{item.plotNAme}</div>
                          </div>
                          <div class="flex text-14px mt-10px color-[#7c97a0] items-center">
                            <div>{item.userName}</div>
                            <div class="w-1px h-10px mx-10px bg-[#44656c]"></div>
                            <div>
                              {item.startTime}-{item.endTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div class='dataNull w-200px mx-auto mt-100px h-150px '></div>
                )}
              </div>
            </div>
            <div>
              <div class="box-title">模型要素</div>
              <div class="box-item !h-400px">
                {
                  DetailList.value.length>0?'': <div class='dataNull mx-auto my-100px w-200px h-150px '></div>
                }
              
                  <div class="flex justify-evenly">
                    {DetailList.value.map((item, index) => {
                      return (
                        <div
                          onClick={() => {
                            tabFn(item, index)
                          }}
                          style="cursor:pointer;"
                          class={rightNum.value == index ? 'right-active' : 'right-actived'}
                        >
                          {item.indicatorName}
                        </div>
                      )
                    })}
                  </div>
                      <div id="radarChart" class="w-100%  mt-10px" style="height:300px"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return () => (
      <div class="bg-[#0b212c] w-[100vw] h-[100vh]">
        <BigscreenAdapter>
          <BigscreenContainer backgroundImage={bigscreenName.value.includes('稻田鱼')? fishBg:bigscreenName.value.includes('麻鸭')?duckBg :mainBg }>
            <BigscreenHeader
              backgroundImage={headerBg}
              class="!bg-[#0b212c]"
              v-slots={{
                left: () => (
                  <div
                    onClick={() => goPage()}
                    style="cursor:pointer"
                    class="flex items-center justify-center relative btn-bg w-90px -mt-[20px] color-[#fff] h-35px"
                  >
                    <div class="btn-icon w-10px h-15px mr-10px"></div> 返回
                  </div>
                ),
                right: () => timeDom(),
                default: () => (
                  <div class="art-font tracking-wide color-[#caffec]">
                    {bigscreenName.value}模型概览
                  </div>
                )
              }}
            ></BigscreenHeader>
            <BigscreenMain
              v-slots={{
                default: () => {
                  return MainContent()
                }
              }}
            />
            <BigscreenFooter height="30px" />
          </BigscreenContainer>
        </BigscreenAdapter>
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
.box-title {
  color: #caffec;
  font-weight: 550;
  background-size: 100% 100%;
  z-index: 9999;

  text-indent: 4.8rem;
  height: 40px;
  line-height: 35px;
  font-size: 18px;
  background-image: url(./assets/box-title.png);
}
.dataNull{
    background-size: 100% 100%;
    background-image: url(./assets/null.png);
  }
.box-item {
  margin-top: 15px;
  z-index: 9999;
  box-sizing: border-box;
  padding: 10px;
  overflow-y: scroll;
  height: calc(100% - 55px);
  background-size: 100% 100%;
  background-image: url(./assets/box-Item.png);
}
.box-item::-webkit-scrollbar {
  width: 0;
}
.box-item2 {
  margin-top: 15px;
  z-index: 9999;
  box-sizing: border-box;
  padding: 10px;
  height: calc(100% - 55px);
  background-size: 100% 100%;
  background-image: url(./assets/box-Item.png);
}
.left-item2::-webkit-scrollbar {
  width: 0;
}
.left-item1 {
  width: 100%;
  height: 80px;
}
.left-item1::-webkit-scrollbar {
  width: 0;
}

.left-plot {
  width: 100%;
  margin-bottom: 10px;
  height: 28px;
  line-height: 28px;
  background-size: 100% 100%;
  background-image: url(./assets/left-plot.png);
}
.left-active {
  width: 100px;
  height: 50px;
  line-height: 35px;
  margin-bottom: 0px !important;
  text-align: center;
  color: #1f8384;
  background-size: 100% 100%;
  background-image: url(./assets/active.png);
}
.mainDom {
  position: relative;
}
.next-arrow {
  background-image: url(./assets/arrow.png);
  background-size: 30px;
}
.left-actived {
  width: 100px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #afb9bc;
  background-size: 100% 100%;
  background-image: url(./assets/actived.png);
}
.main-top::-webkit-scrollbar {
  width: 0;
}
.cycle-item {
  background-position: center;
  background-repeat: no-repeat;
  width: 85px;
  height: 67px;
  object-fit: contain;
  font-size: 16px;
  text-align: center;
}
.right-active {
  width: 130px;
  height: 50px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background-size: 100% 100%;
  background-image: url(./assets/right-active.png);
}
.right-actived {
  width: 130px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #afb9bc;
  background-size: 100% 100%;
  background-image: url(./assets/right-actived.png);
}
.left3-meassage {
  background-size: 100% 100%;
  background-image: url(./assets/meassage-bg.png);
}
.right-xian {
  width: 50%;
  height: 2px;
  background-size: 100% 100%;
  background-image: url(./assets/right-xian.png);
}
.middle-main-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .main-top-active {
    background-size: 100% 100%;
    line-height: 65px;
    align-self: flex-end;
    cursor: pointer;
    height: 80px;
    color: #00f06d;
    background-image: url(./assets/main-top-active.png);
  }
  .main-bg {
    z-index: -1;
    background-size: 100% 100%;
    background-image: url(./assets/main-bg.png) !important;
  }
  .main-top-actived {
    cursor: pointer;
    line-height: 45px;
    height: 70px;
    color: #97bcbc;
    align-self: flex-end;
    background-size: 100% 100%;
    background-image: url(./assets/main-top-actived.png);
  }
  .main-top-left {
    background-size: 100% 100%;
    background-image: url(./assets/main-top-left1.png);
  }
  .main-top-left2 {
    background-size: 100% 100%;
    background-image: url(./assets/main-top-left2.png);
  }
  
  .main-top-right2 {
    background-size: 100% 100%;
    background-image: url(./assets/main-top-right2.png);
  }
  .main-top-right {
    background-size: 100% 100%;
    background-image: url(./assets/main-top-right1.png);
  }
  .main-top-arrow {
    background-size: 100% 100%;
    background-image: url(./assets/arrow.png);
  }
}
.main-footer-left {
  background-size: 100% 100%;
  background-image: url(./assets/main-footer-left.png);
}
.main-footer-right {
  background-size: 100% 100%;
  background-image: url(./assets/main-footer-right.png);
}
.left3-pie {
  background-size: 100% 100%;
  background-image: url(./assets/left3-pie.png);
}
.btn-bg {
  background-size: 100% 100%;
  background-image: url(./assets/btn-bg.png);
}
.btn-icon {
  background-size: 100% 100%;
  background-image: url(./assets/btn-icon.png);
}
.right-warpper-bg {
  background-size: 100% 100%;
  background-image: url(./assets/right-item-bg.png);
}
.main-pie {
  position: absolute;
  color: #1bdbdc;
  background-image: url(./assets/main-pie.png);
  background-size: 100% 100%;
}

@for $i from 1 through 5 {
  .left-icon-#{$i} {
    background-image: url(./assets/left-icon-#{$i}.png);
    background-size: 100% 100%;
    width: 100px;
    height: 100px;
  }
}
@for $i from 1 through 4 {
  .left-xian-#{$i} {
    background-image: url(./assets/left-xian-#{$i}.png);
    background-size: 100% 100%;
  }
}
</style>
