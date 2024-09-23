<script lang="tsx">
import BigscreenBuilder from '@/components/BigscreenBuilder'
import * as echarts from 'echarts'
// import headerBg from './assets/headerBg.png'
// @ts-ignore
import CesiumMap from '@/views/tiandiMap/index.vue'
import dayjs from "dayjs";
import titleBar from './assets/titleBar.png'
import BigscreenCalendar from './components/calendar.vue'
import {
  getBreedCategory,
  getBreedVariety,
  farmPlanSchedule,
  getWeather,
  getPlan,
  getParkBaseInfo
} from './apis'
import {
  initChartStatic,
  generatePieOptions,
  generateBaseOptions
} from '../../utils/bigscreenTool/index'
import axios from 'axios';
import { useUserStore } from "@/store/modules/user";

const {
  BigscreenAdapter,
  BigscreenContainer,
  BigscreenHeader,
  BigscreenMain,
} = BigscreenBuilder


export default defineComponent({
  name: 'BigscreenMingYueBase',
  setup() {
    const userStore = useUserStore()
    const showSidePanel = ref<boolean>(false)

    // 获取经纬度对应的地名
    const getPositionName = async(keyWord:string, lng:string, lat: string) => {
      const res = await axios.get(`http://api.tianditu.gov.cn/search?postStr={"keyWord":"${keyWord}","level":"15","mapBound":"${lng},${lat},116.45119,39.93542","queryType":"7","count":"20","start":"0","queryTerminal":"10000"}&type=query&tk=您的密钥`)
      console.log("🚀 ~ getPositionName ~ res:", res)
    }

    // 获取当前坐标点
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            resolve([position.coords.longitude, position.coords.latitude])
          })
        } else reject()
      })
    }

    setTimeout(() => {
      showSidePanel.value = true
    }, 100)

    const cesiumIns = ref()

    const TitleValue = ({ title, value, active }) => {
      return (
        <div class={["p-3 py-2", active ? 'active-rect' : 'inner-rect']}>
          <div class="flex items-center">
            <img src={titleBar} class="w-.6rem h-.6rem mr-2" />
            <div>{title}</div>
          </div>
          <div class="pl-1rem text-[#daf5fa]">{value}</div>
        </div>
      )
    }

    const selectedPlot = ref<string>('')
    const options = ref<any[]>([])
    const getLabelByValue = (val) => {
      let res = '------'
      if (Array.isArray(options.value)) {
        options.value.forEach(item => {
          if (item.value === val) res = item.label
        })
      }
      return res
    }
    
    // 获取作业排期
    const calendarIns = ref(), remindArr = ref<any[]>([])
    const farmPlanScheduleList = ref<any[]>([])
    const getFarmPlanSchedule = async (yearMonth, belongPlot) => {
      const res = await farmPlanSchedule({ yearMonth, belongPlot });
      if (Array.isArray(res)) {
        farmPlanScheduleList.value = res
        remindArr.value = res.filter(item => (Array.isArray(item.planList) && item.planList.length > 0)).map(item => item.monthDate)
      }
    }

    const getPlotData = async (parentId) => {
      const res = await getParkBaseInfo({ parentId })
      if (Array.isArray(res)) {
        options.value = res.map(item => ({
          label: item.name,
          value: item.id
        }))
        if (res.length > 0) {
          selectedPlot.value = res[0].id
          const _date = new Date()
          getFarmPlanSchedule(`${_date.getFullYear()}-${_date.getMonth() + 1}`, res[0].id)
        }
      }
    }
    getPlotData("1787680115895037952")

    const breedCategoryList = ref<any[]>([])
    const activeBreedCategoryId = ref<string>('')
    const getBreedCategoryData = async () => {
      const res = await getBreedCategory()
      if (Array.isArray(res)) {
        breedCategoryList.value = res.filter(item => (item.category_name && item.number))
        if (Array.isArray(breedCategoryList.value) && breedCategoryList.value.length > 0) {
          activeBreedCategoryId.value = breedCategoryList.value[0].id
          nextTick(() => { initChart(activeBreedCategoryId.value) })
        }
      }
    }
    getBreedCategoryData()

    const initChart = async (categoryId) => {
      const res = await getBreedVariety({ categoryId })
      if (!Array.isArray(res)) return
      initChartStatic(
        "chartPlant",
        generatePieOptions({
          legend: {
            show: true,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
          },  
          color: ["#beee36", "#1cf0d8", "#1af796", '#ff9f15'],
          series: [
            {
              nam: "种植品种",
              type: "pie",
              radius: ["35%", "60%"],
              center: "center",
              data: res.map(item => ({
                name: item.crop_name,
                value: item.number
              })),
              label: {
                // formatter: "{c|{c}},{d|{d}%}",
                color: '#fff',
                formatter: "{c} {d}%",
                rich: {
                  c: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                  d: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                },
              },
            },
          ],
        })
      );
    }

    const bottomDataList = ref<any[]>([])
    const handleCalendarClick = (item) => {
      const formatMonthDay = (val) => val > 9 ? val : ('0' + val)
      bottomDataList.value = [];
      farmPlanScheduleList.value.forEach(ele => {
        const _date_ = item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date)
        if (_date_ === ele.monthDate) {
          if (Array.isArray(ele.planList)) {
            bottomDataList.value = ele.planList
          }
        }
      })
    }

    const curWeather = ref<any>({}), hourTemp = ref<any[]>([]), hourWeather = ref<any[]>([])
    const initWeatherChart = (xAxisData:any[] = [], yAxisData:any[] = []) => {
      initChartStatic(
        'weatherDom',
        generateBaseOptions({
          xAxis: {
            data: xAxisData,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#666666'
              }
            },
          },
          legend : {
            show: false
          },
          yAxis: [
            {
              type: 'value',
              name: `单位：℃`,
              max: 50,
              nameTextStyle: {
                color: 'rgba(153, 153, 153, 1)',
                "font-family": "AlibabaPuHuiTi",
                fontSize: "13px",
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#666666'
                }
              },
              axisLabel: {
                color: '#666666'
              },
              splitLine: {
                //网格线
                show: true, //是否显示
                lineStyle: {
                  //网格线样式
                  color: '#666666', //网格线颜色
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

          series: [
            {
              name: '温度',
              data: yAxisData,
              type: 'line',
              smooth: false,
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: "#999"
                  },
                  formatter: (params) => {
                    return `${params.value}℃`
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 1, color: '#22564500' },
                    { offset: 0, color: '#225645' }
                  ])
                },
              },
              areaStyle: {normal: {}},
            }
          ],
          grid: {
            left: '10%',
            right: '5%',
            top: '19%',
            bottom: '15%'
          }
        })
      )
    }
    const getWeatherData = async () => {
      const res = await getWeather({
        location: '107.04821,29.46118',
        key: 'c8d24d8285274a3a89617fa7cb2f2eaa'
      })

      const {
        currentWeather,
        hourTemperature,
        dayWeather
      } = res;
      curWeather.value = currentWeather;
      if (Array.isArray(hourTemperature)) {
        hourTemp.value = hourTemperature
        nextTick(() => {
          initWeatherChart(
            hourTemperature.map(item => item.fxTime),
            hourTemperature.map(item => item.temp)
          )
        })
      }
      if (Array.isArray(dayWeather) && dayWeather.length >= 2) {
        hourWeather.value = dayWeather.slice(0, 2).map((item, index) => {
          return {
            ...item,
            time: index === 0 ? '明天' : '后天',
            range: `${item.tempMin}℃~${item.tempMax}℃`
          }
        })
      }
    }
    getWeatherData()

    const planInfo = reactive({
      totalPlan: '0',
      finishPlan: '0',
      notStartPlan: '0',
      onGoingPlan: '0',
      finishRate: '0%'
    })
    const planList = ref<any[]>([])
    const getPlanData = async () => {
      const res = await getPlan({})
      if (res) {
        planInfo.totalPlan = res.totalPlan ?? '0'
        planInfo.finishPlan = res.finishPlan ?? '0'
        planInfo.notStartPlan = res.notStartPlan ?? '0'
        planInfo.finishRate = res.finishRate ?? '0%'
        planInfo.onGoingPlan = res.onGoingPlan ?? '0'
      }
      if (Array.isArray(res.list)) {
        planList.value = res.list
      }
    }
    getPlanData()

    const showOptions = ref<boolean>(false)

    window.addEventListener('click', () => {
      showOptions.value = false
    })

    const handleCalendarChange = (item) => {
      console.log("🚀 ~ handleCalendarChange ~ item:", item)
      if (!selectedPlot.value) return
      getFarmPlanSchedule(`${item.getFullYear()}-${item.getMonth() + 1}`, selectedPlot.value)
    }
    return () => (
      <div class="w-[100%] aspect-[2] bg-[#0d1724]">

          <BigscreenContainer width="100%" height="auto" extraClass="aspect-[1]">
            <BigscreenMain>
              <div class="bg-[#0d1724] w-full h-full relative overflow-hidden">
                <div class="absolute z-2 w-full h-full">
                  <CesiumMap ref={e => cesiumIns.value = e} />
                  { /*<CesiumMap ref={e => cesiumIns.value = e} /> */ }
                  <div class="meng-ban z-0"></div>
                </div>
                <div
                  class="z-10 absolute left-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] transition-all duration-100"
                  style={{
                    left: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="title-1 w-full aspect-[6]"></div>
                  <div class="item-bg w-full p-4 box-border">
                    <div class="flex justify-between space-x-2">
                      {
                        breedCategoryList.value.map(item => (
                          <div class="grow cursor-pointer" onClick={() => {
                            activeBreedCategoryId.value = item.id
                            nextTick(() => { initChart(item.id) })
                          }}>
                            <TitleValue
                              active={activeBreedCategoryId.value === item.id}
                              title={item.category_name}
                              value={item.number + (item.unit ?? '')}
                            />
                          </div>
                        ))
                      }
                    </div>
                    <div id="chartPlant"></div>
                  </div>
                  <div class="title-2 w-full aspect-[6]"></div>
                  <div class="item-bg">
                    <div class="flex justify-center py-4 items-center text-[#11eeaf]">
                    <div class="relative h-[1.4rem] w-[10rem]">
                      <div class="h-full text-center cursor-pointer" onClick={(e) => {
                        e.stopPropagation()
                        showOptions.value = true
                      }}>
                        {getLabelByValue(selectedPlot.value)}
                        <el-icon class="ml-3 relative top-[.1rem]"><CaretBottom /></el-icon>
                      </div>
                        {
                          showOptions.value ? <div class="absolute left-0 top-[1.4rem] z-1000 w-full max-h-[8rem] overflow-auto">
                            {
                              Array.isArray(options.value) ? options.value.map(item => (
                                <div
                                  class="py-3 text-center w-full bg-[#0d1724]"
                                  onClick={() => {
                                    selectedPlot.value = item.value
                                    const _date = new Date()
                                    getFarmPlanSchedule(`${_date.getFullYear()}-${_date.getMonth() + 1}`, item.value)
                                  }}
                                >{item.label}</div>
                              )) : null
                            }
                          </div> : null
                        }
                      </div>
                    </div>
                    <div class="split-line w-full h-[2px]"></div>
                    <div class="w-full box-border p-3 py-4">
                      <BigscreenCalendar
                        ref={e => calendarIns.value = e}
                        remind={remindArr.value}
                        onSelect={(item) => { handleCalendarClick(item) }}
                        onChange={(item) => handleCalendarChange(item)}
                      />
                      <div class="item-bg p-3 mt-2 px-4 pb-1 h-[8.3rem] overflow-auto">
                        {
                          bottomDataList.value.map(item => (
                            <>
                              <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-2">
                                  <div class="w-[.3rem] h-[1rem] bg-[#11f47f]"></div>
                                  <div>{item.planName}</div>
                                </div>
                                <div>{item.planState}</div>
                              </div>
                              <div class="line-clamp-4 mt-1 mb-2 leading-6 px-3 text-[#DAF5FA]">{item.planDesc ?? '暂无详细介绍'}</div>
                            </>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="z-10 absolute right-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] transition-all duration-100"
                  style={{
                    right: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="title-3 w-full aspect-[6]"></div>
                  <div class="item-bg">
                    <div class="flex justify-center py-4 items-center text-[#11eeaf] !hidden">
                      {userStore.user.nickname.replace('用户', '')}
                    </div>
                    <div class="split-line w-full h-[2px] !hidden"></div>
                    <div class="w-full box-border p-3 py-4">
                      <div class="flex justify-between items-center px-5 pr-[2rem]">
                        <div class="flex justify-between items-center">
                          <div class="text-[1.9rem] art-font">{curWeather.value.temp ?? '--' }</div>
                          <div class="pl-3 text-[13px] space-x-2">
                            <span>{curWeather.value.text ?? '--' }</span>
                            <span>{curWeather.value.windDir ?? '--' }</span>
                            <span>{curWeather.value.windScale ?? '--' }</span>
                          </div>
                        </div>
                        <i class={`qi-${curWeather.value.icon ?? ''}-fill text-[2rem]`}></i>
                      </div>
                      <div id="weatherDom"></div>
                      <div class="flex justify-evenly space-x-2">
                        {
                          hourWeather.value.map(item => (
                            <div class="item-bg w-50% p-1 px-4 pt-2 flex items-center space-x-7" style="border: 1px solid #ffffff30;">
                              <i class={`qi-${item.iconDay}-fill text-[2rem] pl-3`}></i>
                              <div>
                                <div>{item.time}</div>
                                <div class="text-[#DAF5FA]">{item.range}</div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  <div class="title-4 w-full aspect-[6]"></div>
                  <div class="item-bg p-2 box-border">
                    <div class="w-full space-x-2 flex">
                      <div class="mission-bg flex justify-center items-center flex-col w-[8rem] text-[.8rem]">
                        <div>
                          <span class="text-[1.3rem] pr-1">{planInfo.finishRate}</span>
                        </div>
                        <div>任务完成率</div>
                      </div>
                      <div class="flex flex-col space-y-2 grow">
                        <div class="flex w-full justify-between items-center inner-rect p-3 box-border">
                          <div class="flex items-center">
                            <img src={titleBar} class="w-.6rem h-.6rem mr-2" />
                            <span>总农事任务:</span>
                          </div>
                          <div>{planInfo.totalPlan}</div>
                        </div>
                        <div class="inner-rect box-border p-3 px-6 space-y-2">
                          <div class="flex w-full justify-between items-center box-border">
                            <div class="flex items-center">
                              <img src={titleBar} class="w-.6rem h-.6rem mr-2" />
                              <span class="whitespace-nowrap">已执行:</span>
                            </div>
                            <div class="grow overflow-hidden px-2 flex justify-center text-[#577D7E] whitespace-nowrap"></div>
                            <div>{planInfo.finishPlan}</div>
                          </div>
                          <div class="flex w-full justify-between items-center box-border">
                            <div class="flex items-center">
                              <img src={titleBar} class="w-.6rem h-.6rem mr-2" />
                              <span class="whitespace-nowrap">进行中:</span>
                            </div>
                            <div class="grow overflow-hidden mx-2 flex justify-center text-[#577D7E] whitespace-nowrap"></div>
                            <div>{planInfo.onGoingPlan}</div>
                          </div>
                          <div class="flex w-full justify-between items-center box-border">
                            <div class="flex items-center">
                              <img src={titleBar} class="w-.6rem h-.6rem mr-2" />
                              <span class="whitespace-nowrap">未执行:</span>
                            </div>
                            <div class="grow overflow-hidden px-2 flex justify-center text-[#577D7E] whitespace-nowrap"></div>
                            <div>{planInfo.notStartPlan}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="py-3 box-border h-[17rem] hidden-scrollbar">
                      {
                        planList.value.map(item => (
                          <div class="rb-item w-full h-[7rem] pl-[2rem] box-border pb-[1rem]">
                            <div class="w-full h-full p-5 box-border">
                              <div class="flex justify-between items-center">
                                <div class="flex space-x-2">
                                  <div class="w-[3px] h-[1rem] bg-[#11f47f]"></div>
                                  <div>{item.planName}</div>
                                </div>
                                <div>{item.planState === '0' ? '未开始' : ''}</div>
                              </div>
                              <div class="flex space-x-2 mt-3 text-[#DAF5FA] pl-2">
                                <span>{item.plotName}</span>
                                <span>|</span>
                                <span>{dayjs(item.startTime).format('YYYY-MM-DD')}-{dayjs(item.endTime).format('YYYY-MM-DD')}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </BigscreenMain>
          </BigscreenContainer>

      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
.meng-ban {
  width: 100%;
  height: 100%;
  background-image: url(./assets/mb.png);
  background-size: 100% 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

@for $i from 1 through 4 {
  .title-#{$i} {
    background-image: url(./assets/title#{$i}.png);
    background-size: 100% 100%;
  }
}

.item-bg {
  background-size: 100% 100%;
  background-image: url(./assets/itemBg.png);
}

.item-bg::-webkit-scrollbar {
  width: 0px;
}

.inner-rect {
  background-image: url(./assets/innerRect.png);
  background-size: 100% 100%;
}

.active-rect {
  background-image: url(./assets/activeBg.png);
  background-size: 100% 100%;
}

#chartPlant {
  width: 100%;
  height: 130px;
  margin-top: .5rem;
}

#weatherDom {
  width: 100%;
  height: 220px;
  margin-top: .5rem;
}

.mission-bg {
  background-image: url(./assets/missionBg.png);
  background-size: 100% 100%;
}

.split-line {
  background-image: url(./assets/splitLine.png);
  background-size: 100% 100%;
}

.rb-item {
  background-image: url(./assets/rbItem.png);
  background-size: 100% 100%;
}

.hidden-scrollbar::-webkit-scrollbar {
  width: 0px;
}
</style>
