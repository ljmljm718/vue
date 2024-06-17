<script lang="tsx">
import { defineComponent, ref, onMounted } from 'vue'
import mainBg from './assets/bg.png'
import headerBg from './assets/headerBg.png'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import {
  initChartStatic,
  generateBaseOptions
} from '../../utils/bigscreenTool/index'
import * as echarts from 'echarts'
import {
  getParkBaseInfo,
  getEquipmentMap,
  qianjiangMonitor
} from './apis'

const {
  BigscreenAdapter,
  BigscreenContainer,
  BigscreenHeader,
  BigscreenFooter,
  BigscreenMain,
  BigscreenSelector,
  BigscreenTable
} = BigscreenBuilder

export default defineComponent({
  name: 'BigscreenTest',
  setup() {
    const weatherDataList = ref<Array<any>>([1,1,1,1,1,1,1,1])
    const getWeatherDataList = async () => {
      const res = await qianjiangMonitor({
        type: '气象站',
        belongPark: selectedBase.value,
        belongPlot: selectedPlot.value
      })
      const iconMap = {
        "温度": "icon-1",
        "湿度": "icon-2",
        "二氧化碳": "icon-3",
        "降雨量": "icon-4",
        "大气压": "icon-5",
        "光照强度": "icon-6",
        "风速": "icon-7",
        "风向": "icon-8",
      }
      if (Array.isArray(res)) weatherDataList.value = res.map(item => ({
        ...item, icon: iconMap[item.monitoringType] || 'icon-1'
      }))
    }
    const soilDataList = ref<Array<any>>([1,1,1,1,1,1,1,1])
    const getSoilDataList = async () => {
      const res = await qianjiangMonitor({
        type: '气象站',
      })
      console.log("res", res);
    }
    const topDataList = ref<Array<any>>([
      {
        value: '0',
        label: '设备总数',
        color: '#7dffff'
      },
      {
        value: '0',
        label: '在线设备',
        color: '#7dffff'
      },
      {
        value: '0',
        label: '离线数量',
        color: '#ffd47f'
      },
      {
        value: '0',
        label: '设备预警',
        color: '#ff8383'
      },
    ])

    const deviceDataList = ref<Array<any>>([
      {
        label: '生长监控',
        total: 65,
        online: 60,
        offline: 5,
      },
      {
        label: '生长监控',
        total: 65,
        online: 60,
        offline: 5,
      },
      {
        label: '生长监控',
        total: 65,
        online: 60,
        offline: 5,
      },
      {
        label: '生长监控',
        total: 65,
        online: 60,
        offline: 5,
      },
    ])

    const baseOptions = ref<Array<any>>([])
    const plotOptions = ref<Array<any>>([
      {
        key: '1',
        label: 'ads'
      },
      {
        key: '2',
        label: 'ads2'
      },
    ])
    const selectedBase = ref(), selectedPlot = ref()

    // 地块变化，刷新所有数据
    const refreshAllData = () => {
      getWeatherDataList()
      getSoilDataList()
    }

    const getBasePlotOptions = async (parentId = 0) => {
        const res = await getParkBaseInfo({ parentId })
        if (!Array.isArray(res)) return
        if (parentId === 0) {
          // 查询基地列表
          baseOptions.value = res.map(item => ({
            key: item.id,
            label: item.name
          }))
          if (res.length > 0) {
            selectedBase.value = res[0].id
            if (res[0].id !== 0) getBasePlotOptions(res[0].id)
          }
        } else {
          // 查询地块列表
          plotOptions.value = res.map(item => ({
            key: item.id,
            label: item.name
          }))
          if (res.length > 0) {
            selectedPlot.value = res[0].id
            refreshAllData()
          }
        }
      }
      getBasePlotOptions()

    const initChart = () => {
      const xValue = [1,2,3,4,5,6], yValue = [145, 112, 41, 78, 115, 22]
      initChartStatic(
        'chart',
        generateBaseOptions({
          xAxis: {
              data: xValue,
              axisLine: {
                  show: true,
                  lineStyle: {
                      color: '#ffffff80'
                  }
              }
          },
          legend: {
              show: false,
              orient: 'horizontal',
              itemWidth: 15,
              itemHeight: 15
          },
          color: ['#ffa773', '#36e1d9'],
          yAxis: {
              name: '',
              type: 'value',
              axisLine: {
                  show: true,
                  lineStyle: {
                      color: '#ffffff80'
                  }
              },
              splitLine: {
                  //网格线
                  show: true, //是否显示
                  lineStyle: {
                      //网格线样式
                      color: '#ffffff80', //网格线颜色
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
              data: yValue,
              barWidth: 30,
              type: 'line',
              smooth: true,
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#eee',
                  fontSize: 10
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 1, color: '#1bcad600' },
                    { offset: 0, color: '#1bcad6' }
                  ])
                },
              },
              areaStyle: { normal: {} },
            }
          ],
          grid: {
            left: '6%',
            right: '4%',
            top: '16%',
            bottom: '15%'
          }
        })
      )
    }

    onMounted(() => { initChart() })

    const preWarnLoading = ref<boolean>(false)
    const preWarnList = ref<Array<any>>([])
    return () => (
      <BigscreenAdapter>
        <BigscreenContainer backgroundImage={mainBg}>
          <BigscreenHeader
            backgroundImage={headerBg}
            height="80px"
            v-slots={{
              left: () => (
                <div class="flex space-x-2 relative top-[-10px]">
                  <BigscreenSelector
                    width={'10rem'}
                    options={baseOptions.value}
                    v-model={selectedBase.value}
                    onChange={(key) => getBasePlotOptions(key)}
                  />
                  <BigscreenSelector
                    width={'12rem'}
                    options={plotOptions.value}
                    v-model={selectedPlot.value}
                    onChange={() => refreshAllData()}
                  />
                </div>
              ),
              right: () => (<BigScreenTime class="relative top-[-9px]" />)
            }}
          />
          <BigscreenMain>
            <div class="flex space-x-4 w-full h-full px-5 box-border pt-[20px]">
              <div class="flex flex-col justify-between w-[420px]">
                <div class="h-[382px] item-bg-1 pt-[40px] pb-[18px] px-3 box-border">
                  <div class="grid grid-cols-2 grid-rows-4 h-full">
                    {
                      weatherDataList.value.map((item:any) => (
                        <div class="flex justify-center items-center">
                          <div class={`w-[165px] h-[60px] relative ${item.icon}`}>
                            <div class="absolute left-[60px] art-font linear-title top-[7px] text-[17px]">
                              <span>{ item.dataValue }</span>
                              <span>{ item.unit }</span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div class="h-[295px] item-bg-2 box-border px-3 pt-[56px] pb-[24px]">
                  <div class="grid grid-cols-2 grid-rows-4 h-full gap-2">
                    {
                      soilDataList.value.map((item:any) => (
                        <div class="flex justify-center items-center">
                          <div class="w-[190px] h-[40px] soil-bg"></div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div class="h-[237px] item-bg-3 box-border px-3 pt-[56px] pb-[24px]">
                  <div class="h-full bg-red flex space-x-1 justify-between items-center">
                    <div class="left-btn w-[9px] h-[16px]"></div>
                    <div class="flex flex-col space-y-2"></div>
                    <div class="right-btn w-[9px] h-[16px]"></div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col space-y-4 grow">
                <div class="grow relative">
                  <div class="absolute top-1 w-full flex justify-between">
                    {
                      topDataList.value.map((item, index) => (
                        <div class={`w-[235px] h-[76px] relative topBg-${index + 1}`}>
                          <div class="absolute left-[110px] art-font text-[26px]" style={{
                            color: item.color
                          }}>{item.value}</div>
                          <div class="absolute left-[110px] top-[35px]">{item.label}</div>
                        </div>
                      ))
                    }
                  </div>
                  <div class="tool-tip-bg w-[410px] h-[100px] absolute right-0 bottom-0"></div>
                </div>
                <div class="h-[237px] item-bg-4 box-border px-3 pt-[52px] pb-[22px]">
                  <div class="h-full" id="chart"></div>
                </div>
              </div>
              <div class="flex flex-col justify-between w-[420px]">
                <div class="h-[308px] item-bg-5 box-border px-3 pt-[59px] pb-[24px]">
                  <div class="flex h-full justify-evenly">
                    <div class="agri-1 w-[185px] h-[212px] flex justify-center items-center">
                      <div class="text-[26px] art-font linear-title relative top-[50px]">50</div>
                    </div>
                    <div class="agri-2 w-[185px] h-[212px] flex justify-center items-center">
                      <div class="text-[26px] art-font linear-title relative top-[50px]">50</div>
                    </div>
                  </div>
                </div>
                <div class="h-[370px] item-bg-6 box-border px-3 pt-[59px] pb-[24px] flex flex-col items-center">
                  <div class="device-header w-[378px] h-[50px] px-[40px] flex justify-between items-center box-border">
                    <div>物联网设备</div>
                    <div>
                      <span>总数:</span>
                      <span class="linear-title art-font pl-2">--台</span>
                    </div>
                  </div>
                  <div class="h-[230px] mt-[14px] w-full px-2 box-border flex flex-col justify-evenly">
                    {
                      deviceDataList.value.map(item => (
                        <div class="flex flex-col space-y-1">
                          <div class="flex justify-between">
                            <div>
                              <span>{item.label}:</span>
                              <span class="linear-title pl-2">{item.total}</span>
                            </div>
                            <div>
                              <span>在线:</span>
                              <span class="linear-title pl-2">{item.online}</span>
                              <span class="px-2">|</span>
                              <span>离线:</span>
                              <span class="linear-title pl-2">{item.offline}</span>
                            </div>
                          </div>
                          <div class="bg-[#04363c] h-[12px]">
                            <div class="h-full w-[100px] high-light-bar"></div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div class="h-[237px] item-bg-7 box-border pt-[50px] pb-[20px] px-[10px]">
                  <BigscreenTable
                    columns={[
                      {
                        key: 'warnInfo',
                        label: '预警信息',
                        width: '12rem'
                      },
                      {
                        key: 'warnTime',
                        label: '报警时间',
                        width: '7rem'
                      },
                      {
                        key: 'warnStatus',
                        label: '状态',
                      },
                    ]}
                    dataList={preWarnList.value}
                    loading={preWarnLoading.value}
                  />
                </div>
              </div>
            </div>
          </BigscreenMain>
          <BigscreenFooter height="30px" />
        </BigscreenContainer>
      </BigscreenAdapter>
    )
  }
})
</script>
<style lang="scss" scoped>
@for $i from 1 through 7 {
  .item-bg-#{$i} {
    background-image: url(./assets/itemBg#{$i}.png);
    background-size: 100% 100%;
  }
}

@for $i from 1 through 8 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% 100%;
  }
}

@for $i from 1 through 4 {
  .topBg-#{$i} {
    background-image: url(./assets/top#{$i}.png);
    background-size: 100% 100%;
  }
}

.soil-bg {
  background-image: url(./assets/soilBg.png);
  background-size: 100% 100%;
}

.left-btn, .right-btn { background-size: 100% 100%; }
.left-btn { background-image: url(./assets/leftBtn.png); }
.right-btn { background-image: url(./assets/rightBtn.png); }

.agri-1, .agri-2 { background-size: 100% 100%; }
.agri-1 { background-image: url(./assets/agri1.png); }
.agri-2 { background-image: url(./assets/agri2.png); }

.device-header {
  background-image: url(./assets/deviceHeader.png);
  background-size: 100% 100%;
}

.tool-tip-bg {
  background-image: url(./assets/toolTip.png);
  background-size: 100% 100%;
}

.high-light-bar {
  background: linear-gradient(to right, #277051, #11c5c4);
}

.linear-title {
  background-image: linear-gradient(to top, #41ffff, #c0ffff);
  -webkit-background-clip: text;
  color: transparent;
}
</style>