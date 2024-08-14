
<script  lang='tsx'>
import { ref, onMounted } from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import mainBg from './assets/mainBg.png'
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
    const bigscreenName = ref('')
    const batch = ref('')
    const MainImg=ref('')
    console.log(route.query, ' route.query route.query route.query123')
    bigscreenName.value = route.query.modelName
    modelId.value = route.query.modelId
    beLongPlot.value = route.query.plotId
    growthId.value = route.query.growthId
    batch.value = route.query.batchCode

    const numVal = ref(1)
    const rightNum = ref(0)
    //雷达图
    const drawRadarChart = (obj) => {
      let list = obj.modelIndicatorElementCardVOList

      initChartStatic('radarChart', {
        title: {
          // text: '评估评分占比分析图'
        },
        tooltip: {},
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
            }
          }
        ],
        series: [
          {
            name: '模型要素',
            type: 'radar',
            data: [
              {
                value: list.map((item) => item.value),
                name: '模型要素',
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
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '',
              borderColor: '',
              borderWidth: 2
            },
            areaStyle: {
              color: '#26eae7'
            }
          }
        ]
      })
    }

    // onMounted(() => {
    //   initChartLine()
    // })
    //模型要素切换
    const mainList = ref([])
    const tabFn = (obj, val) => {
      rightNum.value = val
      drawRadarChart(obj)
      mainList.value = obj.modelIndicatorElementCardVOList
    }
    const mainTopNum = ref(0)
    const infoList = ref([])
    //顶部生长期
    const growTab = (val) => {
      mainTopNum.value = val
    }
    const numTab = (str) => {
      if (str == '+') {
        if (mainTopNum.value == infoList.value.length - 1) {
          mainTopNum.value = infoList.value.length - 1
        } else {
          mainTopNum.value++
        }
      } else {
        if (mainTopNum.value === 0) {
          mainTopNum.value = 0
        } else {
          mainTopNum.value--
        }
      }
    }
    //种植计划
    const planByList = ref([])
    const getModelPlanByModelId = async () => {
      let res = await ModelPlanByModelId({ modelId: modelId.value })
      planByList.value = res
    }
    getModelPlanByModelId()
    //中间生长周期跟左下共用
    const childList = ref([])
    const getModelInfo = async () => {
      let res = await modelInfo({ modelId: modelId.value })
      infoList.value = res.splice(1)
        console.log(infoList.value,'infoList.valueinfoList.value')
      infoList.value.forEach((item, index) => {
        if (item.growth == res[0].curPeriod) {
          mainTopNum.value = index
          MainImg.value=item.imgId
          numVal.value = index
          childList.value = item.child2
        }
      })
    }
    getModelInfo()
    //模型要素
    const DetailList = ref([])
    const DetailListChild = ref([])

    const getMonitorIndicatorWithDetail = async () => {
      console.log(1234)
      let res = await MonitorIndicatorWithDetail({
        modelId: modelId.value,
        growthId: growthId.value
      })
      DetailList.value = res
      console.log(res,'魔心要是')
      mainList.value=res[0].modelIndicatorElementCardVOList.map((item, index) => {
        return {
          ...item,
          left: Math.floor(Math.random()* (30-10+1)+10),
          top: Math.floor(Math.random()* (40-20+1)+20)
        }
      })
      console.log(mainList.value,'mainList.valuemainList.value123')
      drawRadarChart(res[0])
    }
    getMonitorIndicatorWithDetail()
    //地块信息
    const cropPlotList = ref({})
    const getCropPlotByModelId = async () => {
      let res = await CropPlotByModelId({ modelId: modelId.value, beLongPlot: beLongPlot.value })
      cropPlotList.value = res[0]
    }
    getCropPlotByModelId()
    //模型周期切换
    const handleTab = (item, index) => {
      numVal.value = index
      childList.value = item.child2
    }
    //模型监测
    const monitorList = ref([])
    const monitorListChild = ref([])
    const getModelMonitor = async () => {
      let res = await modelMonitor({ modelId: modelId.value, batch: batch.value })
      monitorList.value = res.splice(0, 2)
    }
    getModelMonitor()
    //中间下方折线图
    const footerList = ref([])
    const chartLineNum = ref(0)
    const getModelOverviewStatistics = async () => {
      console.log(3333345)
      let res = await ModelOverviewStatistics({
        modelId: modelId.value,
        growthId: growthId.value,
        batch: batch.value
      })
      console.log(res,'这想吐')
      footerList.value = res
      
      setTimeout(()=>{
        initChartLine1(footerList.value[0])

      },500)
    }
    getModelOverviewStatistics()
    //折线图
    const initChartLine1 =  (list) => {
      footerList.value.forEach((item,index)=>{
        initChartStatic(
        `chartLine${index+1}`,
        generateBaseOptions({
          xAxis: {
            data:item.dataList.map((itm) => itm.createTime),
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
    const chartNum2=ref(0)
    const chartNum3=ref(1)
    const mainFooter = (str) => {
      if (str == '+') {
        chartNum3.value=-1
        if (chartNum.value == footerList.value.length - 1 || chartNum2.value == footerList.value.length - 1) {
          return true
        } else if(chartNum.value==1 || chartNum.value==0) {
          chartNum.value=2
          chartNum2.value=3
        }else{
          chartNum.value++
          chartNum2.value++
        }
      }else{
        if(chartNum.value==0 || chartNum2.value==1){
          return true
        }else{
          chartNum.value--
          chartNum2.value--
        }
      }
    }
    const goPage=()=>{
      router.go(-1)
    }
    //// 处理周期列表移动
    const cycleListChange = (index) => {
      if (infoList.value.length > 5) {
        offsetLeft.value += (mainTopNum.value - index) * 93 * 2;
      }
    }
    const handlerMain=(item,index)=>{
      console.log(item,'MainImg.value123')
      growthId.value=item.growthId
      MainImg.value=item.imgId
      mainTopNum.value=index
      getMonitorIndicatorWithDetail()
      getModelOverviewStatistics()
      cycleListChange(index)
      mainTopNum.value = index
      
    }
     const offsetLeft=ref()
      
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
            <div class=''>
              <div class="box-title ">模型监测</div>
              <div class="box-item flex justify-center items-center flex-col">
                {monitorList.value.map((item, index) => {
                  return (
                    <div class="flex w-100% h-50% items-center justify-center">
                      <div class="left-icon-1 mr-15px"></div>
                      <div class="w-45% h-100% flex flex-col justify-center">
                        <div class="flex w-90% ml-[25px] mb-[-10px] items-center justify-between">
                          {' '}
                          <div class="color-[#8a969c]">{item.title}</div>
                          <div class="color-[#fff] text-xl">
                            {item.value}
                            <span v-if={index == 0} class="color-[#304650] ml-10px text-14px">
                              分
                            </span>
                          </div>
                        </div>
                        <div class="xian w-100% h-20px"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* 地块信息 */}
            <div >
              <div class="box-title ">地块信息</div>
              <div class="box-item ">
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
                  <div class="color-[#fff]">{cropPlotList.value.varitetyName}</div>
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
            </div>
            {/* 模型周期 */}
            <div >
              <div class="box-title">模型周期</div>
              <div class="box-item pb-[15px] box-border h-400px" style="overflow:none;">
                <div class="grid grid-cols-4 ">
                  {infoList.value}
                  {infoList.value.map((item, index) => {
                    return (
                      <div
                        class={numVal.value == index ? 'left-active' : 'left-actived'}
                        style="margin-bottom: 15px; cursor: pointer; width:100%;"
                        onClick={() => handleTab(item, index)}
                      >
                        {item.growth}
                      </div>
                    )
                  })}
                </div>
                <div class="w-100% mt-10px" style="height:200px">
                  <div class="flex items-center text-16px color-[#33d1ca]">
                    <div class="w-3px ml-10px h-10px bg-[#33d1ca] mr-15px"></div> 周期事项
                  </div>
                  <div class="mt-15px">
                    {childList.value.map((item, index) => {
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
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 中间 */}
          <div class="middle-main-wrapper grid gap-10px" style="grid-template-rows: 10% calc(60% - 20px) 30%; grid-auto-columns: 100%;">
            <div
              class=" w-100% h-110px flex justify-between"
              style="overflow-x: auto;overflow:hidden; white-space: nowrap; "
            >
              <div
                class={mainTopNum.value <= 3 ? 'main-top-left' : 'main-top-left2'}
                style="display:inlin-block;width: 20px;height:25px;margin-top:25px;"
              ></div>
              <div class="flex w-70% flex justify-evenly " >
                {infoList.value.length < 6 ? 
                (
                  <div class="w-full flex">
                    <div class="w-[837px] h-[100px] flex justify-center">
                      {infoList.value.map((e, i, arr) => (
                        <div class="flex">
                          <div onClick={()=>handlerMain(e,i)}
                            class={
                              i === mainTopNum.value
                                ? 'cycle-item main-top-active '
                                : 'cycle-item main-top-actived'
                            }
                          >
                            <span>{e.growth}</span>
                          </div>
                          {i != arr.length - 1 ? <div class="cycle-item next-arrow"></div> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )
                 : 
                 (
              <div style="overflow-x:auto" class='main-top'>
                      <div class="w-full flex">
                          {
                            infoList.value.map((e, i, arr) => (
                              <div class="flex">
                                {/** 周期名称展示 */}
                                <div 
                                  class={  i === mainTopNum.value
                                ? 'cycle-item main-top-active '
                                : 'cycle-item main-top-actived' }
                                  onClick={ () => { handlerMain(e,i) } }
                                >
                                  <span>{ e.growth }</span>
                                </div>
                                {/** 周期之间的箭头 */}
                                { i != infoList.value.length - 1 ? ( <div class="cycle-item next-arrow"></div> ) : null }
                              </div>
                            ))
                          }
                      </div>
                      
            </div>
                    )
                }
              </div>
              <div
                class={mainTopNum.value >= 6 ? 'main-top-right' : 'main-top-right2'}
                style="display:inlin-block; width: 20px;height:25px;margin-top:25px;"
              ></div>
            </div>
            <div class="main-bg w-100% h-100% color-[#fff] relative" >
              <img src={MainImg.value}  class='absolute  top-50% left-50%' style='transform: translate(-50%, -50%); object-fit:contain; background-size: 100% 100%;' />
              <div class='w-100% h-100% '>
                {mainList.value.map((item, index) => {
                return (
                  <div
                    class={`main-pie w-90px h-90px flex flex-col items-center justify-center left-${item.left}% top-${item.top}%`}
                  >
                    <div class="text-14px">{item.value}</div>
                    <div class="text-10px mt-5px">{item.elementName}</div>
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
                    <div v-show={chartNum.value==index || chartNum3.value==index  || chartNum2.value==index } class="w-45% h-100%" >
                        <div class="box-title">{item.elementName}折线图</div>
                        <div class="box-item">
                          <div id={`chartLine${index+1}`} class="w-390px h-200px"></div>
                        </div>
                      </div>
                  )
                })
              ) : (
                <div class="text-3xl color-[#35dad2]">暂无趋势折线图</div>
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
              <div class="box-title">种植计划</div>
              <div class="box-item flex flex-col !h-420px">
                {
                  planByList.value.length>0?
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
                }):<div class="text-3xl text-center mt-150px color-[#35dad2]">暂无种植计划</div>
                }
              </div>
            </div>
            <div>
              <div class="box-title">模型要素</div>
              <div class="box-item !h-400px">
                <div class="flex justify-evenly">
                  {DetailList.value.length > 0 ? (
                    DetailList.value.map((item, index) => {
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
                    })
                  ) : (
                    <div class="text-3xl text-center mt-150px color-[#35dad2]">暂无模型要素</div>
                  )}
                </div>
                <div
                  id="radarChart"
                  class="w-100%  mt-10px"
                  style="height: 300px"
                ></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return () => (
      <div class="bg-[#0b212c] w-[100vw] h-[100vh]">
        <BigscreenAdapter>
          <BigscreenContainer backgroundImage={mainBg}>
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
                right: () => <BigScreenTime />,
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
<style lang='scss' scoped>
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
.xian {
  background-size: 100% 100%;
  background-image: url(./assets/xian.png);
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
  height: 50px;
  line-height: 35px;
  margin-bottom: 0px !important;
  text-align: center;
  color: #1f8384;
  background-size: 100% 100%;
  background-image: url(./assets/active.png);
}
.left-actived {
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #afb9bc;
  background-size: 100% 100%;
  background-image: url(./assets/actived.png);
}
.main-top::-webkit-scrollbar{
width:0 ;
}
.cycle-item {
  background-position: center;
  background-repeat: no-repeat;
  width: 93px;
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
  .main-bg{
      width: 1400px;
      height: 700px;
      z-index: -1;
      left: calc(50% - 700px);
      top: calc(50% - 350px);
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
@for $i from 1 through 2 {
  .left-icon-#{$i} {
    background-image: url(./assets/left-icon-#{$i}.png);
    background-size: 100% 100%;
    width: 70px;
    height: 70px;
  }
}
</style>