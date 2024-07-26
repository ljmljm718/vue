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
  qianjiangMonitor,
  getEquipmentPhotographAndVideo,
  qjDeviceStatistics,
  getQianjiangAgriResource,
  qianjiangWarnRecordInfo,
  qjDeviceInfo,
  getLineChar
} from './apis'
import { formatTime } from '@/utils'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'

const permissionStore = usePermissionStore()

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
    const weatherDataList = ref<Array<any>>([])
    const soilDataList = ref<Array<any>>([])
    const getWeatherAndSoilDataList = async (type: '气象站' | '土壤墒情') => {
      const res = await qianjiangMonitor({
        type,
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
      if (type === '气象站' && Array.isArray(res)) weatherDataList.value = res.map(item => ({
        ...item, icon: iconMap[item.monitoringType] || 'icon-1'
      }))

      if (type === '土壤墒情' && Array.isArray(res)) soilDataList.value = res
    }
    
    const topDataList = ref<Array<any>>([])
    const getTopDataList = async () => {
      const res:any = await qjDeviceStatistics({})
      const {
        total = '0',
        online = '0',
        offline = '0',
        //warningDevice = '0'
      } = res
      //console.log("res:",res)
      topDataList.value = [
        {
          value: total,
          label: '设备总数',
          color: '#7dffff',
          url: '/internetMonitor/device/deviceView'
        },
        {
          value: online,
          label: '在线设备',
          color: '#7dffff',
          url: '/internetMonitor/device/deviceView?deviceStatus=online'
        },
        {
          value: offline,
          label: '离线数量',
          color: '#ffd47f',
          url: '/internetMonitor/device/deviceView?deviceStatus=offline'
        },
        {
          value: Number(res.warningEquipmentDevice) + Number(res.warningSensorDevice),
          label: '设备预警',
          color: '#ff8383',
          url: '/internetMonitor/warn/agri-warning-record'
        },
      ]
    }
    // getTopDataList()

    const deviceDataList = ref<Array<any>>([])
    const deviceAmount = ref<number>(0)
    const getDeviceDataList = async () => {
      const res = await qjDeviceInfo({})
      if (Array.isArray(res)) {
        deviceDataList.value = res.map(item => ({
          ...item,
          label: item.deviceKind,
        }))
        deviceAmount.value = 0
        res.forEach(item => {
          deviceAmount.value += (+item.numByType || 0)
        })
      }
    }
    // getDeviceDataList()

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
      parkDataIndex.value = 0
      getWeatherAndSoilDataList('气象站')
      getWeatherAndSoilDataList('土壤墒情')
      getParkDataList()
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
    // getBasePlotOptions()

    const initChart = async () => {
      const res = await getLineChar({
        cropCode: '1801136074673094656',
        facilityId: '1800718949558734848'
      })
      const { xValue = [], yValue = [], measureUnit = [] } = res
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
              name: measureUnit[0] || '',
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
            top: '17%',
            bottom: '15%'
          }
        })
      )
    }

    // onMounted(() => { initChart() })

    const preWarnLoading = ref<boolean>(false)
    const preWarnList = ref<Array<any>>([])
    const getPreWarnList = async () => {
      const res = await qianjiangWarnRecordInfo({})
      console.log("pre warn List", res);
      if (Array.isArray(res)) preWarnList.value = res.map(item => ({
        ...item, warnTime: formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss'),
        warnStatus: item.warnStatus === '0' ? '未处理' : '已处理'
      }))
    }
    // getPreWarnList()

    const WindowOpen = (url:string) => {
      if (url) window.open(url)
    }

    const parkDataList = ref<Array<any>>([])
    const parkDataIndex = ref<number>(0)
    const getParkDataList = async () => {
      const res = await getEquipmentPhotographAndVideo({
        baseId: selectedBase.value,
        plotId: selectedPlot.value
      })
      console.log("getParkDataList", res);
      if (Array.isArray(res)) parkDataList.value = res
    }
    
    const agriResInfo = ref({
      shelterAmount: 0,
      pottingAmount: 0,
      plantArea: 0
    })
    const getAgriResourceData = async () => {
      const res = await getQianjiangAgriResource({})
      agriResInfo.value = res
    }
    // getAgriResourceData()

    // 正中间
    const activeMapIns = ref<string>('')
    const centerMapData = ref({
      meteorologicalStation: {
        deviceName: '',
        location: '',
        deviceStatus: ''
      },
      growthMonitoring: {
        deviceName: '',
        location: '',
        deviceStatus: ''
      },
      camera: {
        deviceName: '',
        location: '',
        deviceStatus: ''
      },
      soilMoistureContent: {
        deviceName: '',
        location: '',
        deviceStatus: ''
      },
      otherEquipment: {
        deviceName: '',
        location: '',
        deviceStatus: ''
      },
    })
    const getCenterMapData = async () => {
      const res = await getEquipmentMap({})
      centerMapData.value = res
    }
    // getCenterMapData()

    const initPage = async () => {
      const userInfo = permissionStore.getUserPassList.find(item => item.id === '159')
      if (!userInfo.users || !userInfo.password) return;
      const res = await LoginApi.login({
        tenantName: '鲁渝协作乡村振兴示范村数字化赋能',
        username: userInfo.users,
        password: userInfo.password,
        rememberMe: true // 默认记录我。如果不需要，可手动修改
      })
      if (res) authUtil.setToken(res)

      getTopDataList()
      getDeviceDataList()
      getBasePlotOptions()
      nextTick(() => { initChart() })
      getPreWarnList()
      getAgriResourceData()
      getCenterMapData()
    }
    initPage()
    return () => (
      <div class="bg-[#001922] w-[100vw] h-[100vh]">
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
                                <span class="pl-1">{ item.unit }</span>
                              </div>
                              <div class="absolute left-[60px] art-font text-[#fff] top-[30px] text-[14px]">
                                <span>{ item.monitoringType }</span>
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
                            <div class="w-[190px] h-[40px] soil-bg flex items-center justify-between px-3">
                              <div>{item.monitoringType}</div>
                              <div class="art-font linear-title">
                                <span>{item.dataValue}</span>
                                <span class="pl-1">{item.unit}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div class="h-[237px] item-bg-3 box-border px-3 pt-[56px] pb-[24px]">
                    <div class="h-full flex space-x-1 justify-between items-center">
                      <div
                        class="left-btn w-[9px] h-[16px]" 
                        onClick={() => { if (parkDataIndex.value > 0) parkDataIndex.value-- }}
                      ></div>
                      {
                        parkDataList.value.slice(parkDataIndex.value, parkDataIndex.value + 2).map(item => (
                          <div class="flex flex-col space-y-2 items-center w-[170px]">
                            <img src={item.monitoringEquipmentDataDO.capturedImage} class="w-full aspect-video object-cover" />
                            <div class="monitor-bg w-[160px] h-[30px] flex justify-center items-center text-[10px]">
                              <span>{item.monitoringEquipmentDataDO.monitoringPlotName}</span>
                              <span class="mx-1">|</span>
                              <span
                                class={item.deviceStatus === 'online' ? "text-[#2ede72]" : 'text-[#e33f32]'}
                              >{item.deviceStatus === 'online' ? "在线" : '离线'}</span>
                            </div>
                          </div>
                        ))
                      }
                      <div
                        class="right-btn w-[9px] h-[16px]"
                        onClick={() => { if (parkDataIndex.value < parkDataList.value.length - 1) parkDataIndex.value++ }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-4 grow">
                  <div class="grow relative">
                    <div class="w-full h-full relative">
                      <div class="camera-icon absolute left-[740px] top-[280px]" onClick={() => { activeMapIns.value = 'camera' }}>
                        {
                          activeMapIns.value === 'camera' ? (
                            <div
                              class="dialog-bg w-[200px] h-[120px] absolute bottom-[60px] left-[60px] pl-[26px] pt-[12px] pr-[5px] pb-[38px] box-border"
                            >
                              <div class="w-full h-full p-2 px-3">
                                <div>{centerMapData.value.camera.deviceName}</div>
                                <div>{centerMapData.value.camera.location}</div>
                                <div>{centerMapData.value.camera.deviceStatus === 'online' ? '在线' : '离线'}</div>
                              </div>
                            </div>
                          ) : null
                        }
                      </div>
                      <div class="grow-icon absolute left-[150px] top-[400px]" onClick={() => { activeMapIns.value = 'grow' }}>
                        {
                          activeMapIns.value === 'grow' ? (
                            <div
                              class="dialog-bg w-[200px] h-[120px] absolute bottom-[60px] left-[60px] pl-[26px] pt-[12px] pr-[5px] pb-[38px] box-border"
                            >
                              <div class="w-full h-full p-2 px-3">
                                <div>{centerMapData.value.growthMonitoring.deviceName}</div>
                                <div>{centerMapData.value.growthMonitoring.location}</div>
                                <div>{centerMapData.value.growthMonitoring.deviceStatus === 'online' ? '在线' : '离线'}</div>
                              </div>
                            </div>
                          ) : null
                        }
                      </div>
                      <div class="meteo-icon absolute left-[400px] top-[300px]" onClick={() => { activeMapIns.value = 'meteo' }}>
                        {
                          activeMapIns.value === 'meteo' ? (
                            <div
                              class="dialog-bg w-[240px] h-[120px] absolute bottom-[60px] left-[60px] pl-[26px] pt-[12px] pr-[5px] pb-[38px] box-border"
                            >
                              <div class="w-full h-full p-2 px-3">
                                <div>{centerMapData.value.meteorologicalStation.deviceName}</div>
                                <div>{centerMapData.value.meteorologicalStation.location}</div>
                                <div>{centerMapData.value.meteorologicalStation.deviceStatus === 'online' ? '在线' : '离线'}</div>
                              </div>
                            </div>
                          ) : null
                        }
                      </div>
                      <div class="soil-icon absolute left-[700px] top-[500px]" onClick={() => { activeMapIns.value = 'soil' }}>
                        {
                          activeMapIns.value === 'soil' ? (
                            <div
                              class="dialog-bg w-[200px] h-[120px] absolute bottom-[60px] left-[60px] pl-[26px] pt-[12px] pr-[5px] pb-[38px] box-border"
                            >
                              <div class="w-full h-full p-2 px-3">
                                <div>{centerMapData.value.soilMoistureContent.deviceName}</div>
                                <div>{centerMapData.value.soilMoistureContent.location}</div>
                                <div>{centerMapData.value.soilMoistureContent.deviceStatus === 'online' ? '在线' : '离线'}</div>
                              </div>
                            </div>
                          ) : null
                        }
                      </div>

                      <div class="bug-icon absolute left-[300px] top-[500px]" onClick={() => { activeMapIns.value = 'otherEquipment' }}>
                        {
                          activeMapIns.value === 'otherEquipment' ? (
                            <div
                              class="dialog-bg w-[200px] h-[120px] absolute bottom-[60px] left-[60px] pl-[26px] pt-[12px] pr-[5px] pb-[38px] box-border"
                            >
                              <div class="w-full h-full p-2 px-3">
                                <div>{centerMapData.value.otherEquipment.deviceName}</div>
                                <div>{centerMapData.value.otherEquipment.location}</div>
                                <div>{centerMapData.value.otherEquipment.deviceStatus === 'online' ? '在线' : '离线'}</div>
                              </div>
                            </div>
                          ) : null
                        } 
                      </div>

                    </div>
                    <div class="absolute top-1 w-full flex justify-between">
                      {
                        topDataList.value.map((item, index) => (
                          <div
                            class={`w-[235px] h-[76px] cursor-pointer relative topBg-${index + 1}`}
                            onClick={() => WindowOpen(item.url)}
                          >
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
                        <div class="text-[26px] art-font linear-title relative top-[50px]">
                          {agriResInfo.value.shelterAmount}
                        </div>
                      </div>
                      <div class="agri-2 w-[185px] h-[212px] flex justify-center items-center">
                        <div class="text-[26px] art-font linear-title relative top-[50px]">
                          {agriResInfo.value.plantArea}亩
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="h-[370px] item-bg-6 box-border px-3 pt-[59px] pb-[24px] flex flex-col items-center">
                    <div class="device-header w-[378px] h-[50px] px-[40px] flex justify-between items-center box-border">
                      <div>物联网设备</div>
                      <div>
                        <span>总数:</span>
                        <span class="linear-title art-font pl-2">{deviceAmount.value}台</span>
                      </div>
                    </div>
                    <div class="h-[230px] mt-[14px] w-full px-2 box-border flex flex-col justify-evenly">
                      {
                        deviceDataList.value.map(item => (
                          <div class="flex flex-col space-y-1">
                            <div class="flex justify-between">
                              <div>
                                <span>{item.label}:</span>
                                <span class="linear-title pl-2">{item.numByType}</span>
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
                              <div
                                class="h-full high-light-bar"
                                style={{ width: `${(+item.online / +item.numByType) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div class="h-[237px] item-bg-7 box-border pt-[50px] pb-[20px] px-[10px] overflow-hidden">
                    <div class="h-[220px] overflow-auto hidden-scroll-bar">
                      <BigscreenTable
                        headerBackgroundColor="#012831"
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
              </div>
            </BigscreenMain>
            <BigscreenFooter height="30px" />
          </BigscreenContainer>
        </BigscreenAdapter>
      </div>
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

.monitor-bg {
  background-image: url(./assets/monitorBg.png);
  background-size: 100% 100%;
}

.hidden-scroll-bar::-webkit-scrollbar {
  width: 0px;
}

.bug-icon, .camera-icon, .grow-icon, .meteo-icon, .soil-icon {
  width: 80px;
  height: 85px;
  background-size: 100% 100%;
}

.bug-icon { background-image: url(./assets/bug.png); }
.camera-icon { background-image: url(./assets/camera.png); }
.grow-icon { background-image: url(./assets/grow.png); }
.meteo-icon { background-image: url(./assets/meteo.png); }
.soil-icon { background-image: url(./assets/soil.png); }

.dialog-bg {
  background-image: url(./assets/dialog.png);
  background-size: 100% 100%;
}
</style>
