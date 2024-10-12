<script lang="tsx">
import { defineComponent, ref, onMounted } from 'vue'
import mainBg from './assets/bg.png'
import indusBg from './assets/indusBg.png'
import headerBg from './assets/headerBg.png'
import headerBg1 from './assets/headerBg1.png'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import SmartIndustry from './smartIndustry.vue'
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
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay } from "swiper/modules"
import 'swiper/css'
import 'swiper/css/autoplay'

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
    const bugDataList = ref<any[]>([])
    const getWeatherAndSoilDataList = async (type: '气象站' | '土壤墒情' | '杀虫设备') => {
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

      const bugIconMap = {
        "降雨状态": "bug-icon-1",
        "光照状态": "bug-icon-2",
        "引虫灯状态": "bug-icon-3",
        "风机状态": "bug-icon-4",
        "电池百分比": "bug-icon-5",
        "电池电压": "bug-icon-6",
      }
      if (type === '杀虫设备' && Array.isArray(res)) bugDataList.value = res.map(item => ({
        ...item, icon: bugIconMap[item.monitoringType] || 'bug-icon-1'
      }));
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
    getTopDataList()

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
    getDeviceDataList()

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
      getWeatherAndSoilDataList('杀虫设备')
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
    getBasePlotOptions()

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

    onMounted(() => { initChart() })

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
    getPreWarnList()

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
    getAgriResourceData()

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
    getCenterMapData()

    // 村情介绍
    const countryIntroData = ref<any[]>([
      { id: '1', title: '幅员面积', value: '8.6', unit: 'KM²' },
      { id: '2', title: '总人口', value: '4326', unit: '人' },
      { id: '3', title: '耕地面积', value: '7000', unit: '亩' },
    ])

    // 产业介绍图片滚动列表
    const indIntroPicList = ref<any[]>([

    ])

    //可视化监控页
    const baseTabPage = () => {
      return (
        <div class="flex space-x-4 w-full h-full px-5 box-border pt-[20px]">
          <div class="flex flex-col justify-between w-[420px]">
            <div class="h-[335px] item-bg-1 pt-[40px] pb-[18px] px-3 box-border">
              <el-scrollbar style="height: 295px;">
                <div class="grid grid-cols-2 h-full gap-y-[10px] mt-[20px]">
                  {
                    weatherDataList.value.length > 0 ? weatherDataList.value.map((item:any) => (
                      <div class="flex justify-center items-center">
                        <div class={`w-[180px] h-[68px] relative ${item.icon}`}>
                          <div class="absolute left-[60px] art-font linear-title top-[7px] text-[17px]">
                            <span>{ item.dataValue }</span>
                            <span class="pl-1">{ item.unit }</span>
                          </div>
                          <div class="absolute left-[60px] art-font text-[#fff] top-[30px] text-[14px]">
                            <span>{ item.monitoringType }</span>
                          </div>
                        </div>
                      </div>
                    )) : <div class="w-full col-span-2 h-250px flex justify-center items-center text-#1effff">暂无数据</div>
                  }
                </div>
              </el-scrollbar>
            </div>
            <div class="h-[340px] item-bg-2 box-border px-3 pt-[56px] pb-[24px]">
              <div class="grid grid-cols-2 grid-rows-4 h-full gap-2">
                {
                  soilDataList.value.length > 0 ? soilDataList.value.map((item:any) => (
                    <div class="flex justify-center items-center">
                      <div class="w-[190px] h-[40px] soil-bg flex items-center justify-between px-3">
                        <div>{item.monitoringType}</div>
                        <div class="art-font linear-title">
                          <span>{item.dataValue}</span>
                          <span class="pl-1">{item.unit}</span>
                        </div>
                      </div>
                    </div>
                  )) : <div class="w-full col-span-2 row-span-4 flex justify-center items-center text-#1effff">暂无数据</div>
                }
              </div>
            </div>
            <div class="h-[237px] item-bg-bug box-border px-3 pt-[56px] pb-[24px]">
              <div class="grid grid-cols-3 grid-rows-2 h-full gap-2">
                {
                  bugDataList.value.length > 0 ? bugDataList.value.map((item:any) => (
                    <div class="flex flex-col justify-center items-center bug-bg">
                      <div class="flex justify-between items-center space-x-[1rem]">
                        <div class={`${item.icon} w-1rem h-1rem`}></div>
                        <div class="text-16px text-#76ffff">{ item.dataValue } { item.unit ?? '' }</div>
                      </div>
                      <div class="text-16px">{ item.monitoringType }</div>
                    </div>
                  )) : <div class="w-full col-span-3 row-span-2 flex justify-center items-center text-#1effff">暂无数据</div>
                }
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
            <div class="flex h-237px justify-center">
              <div class="w-420px h-full item-bg-extra !hidden">
                <div class="h-full flex space-x-1 justify-between items-center box-border px-14px">
                  <div
                    class="left-btn w-[9px] h-[16px]" 
                    onClick={() => { if (parkDataIndex.value > 0) parkDataIndex.value-- }}
                  ></div>
                  {
                    parkDataList.value.slice(parkDataIndex.value, parkDataIndex.value + 2).map(item => (
                      <div class="flex flex-col space-y-2 items-center w-[160px] mt-24px">
                        <img src={item?.monitoringEquipmentDataDO?.capturedImage} class="w-full aspect-1.5 bg-#00000080 object-cover" />
                        <div class="monitor-bg w-[160px] h-[30px] flex justify-center items-center text-[10px]">
                          <span>{item?.monitoringEquipmentDataDO?.monitoringPlotName ?? ''}</span>
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
              <div class="w-1000px h-full center-card-bg box-border">
                <div class="art-font text-white text-20px h-50px pl-9 flex items-center">产业介绍</div>
                <div class="box-border px-4 py-1 flex justify-between">
                  <div class="w-300px h-160px overflow-hidden">
                    <Swiper
                      width={ 300 }
                      height={ 160 }
                      direction="vertical"
                      autoplay={{
                        delay: 2000,
                        pauseOnMouseEnter: true
                      }}
                      modules={[ Autoplay ]}
                    >
                      {
                        [1, 2, 3, 4, 5].map(item => (
                          <SwiperSlide>
                            <div class={ "w-full h-full picture-bg-" + item }></div>
                          </SwiperSlide>
                        ))
                      }
                    </Swiper>
                  </div>
                  <div class="w-650px h-160px">
                    <el-scrollbar height="160px">
                      天印村主要产业有以生猪、生态鱼为主的养殖业，有以特色经果、中药材规模化种植为主的种植业，有餐饮、种养业等小微企业24家，专业合作社3个；已建成4万平方米154户的农民新村，全村实现了社社通天然气，社社通硬化公路，80%以上的居民通硬化道路。人均可支配收入达到了18300元。全村经济社会发展形势良好，人民生活水平正阔步迈向小康。 村为适应社会经济发展需要，深化农村改革，发展壮大农村集体经济，2019年成立了潼南区塘坝镇天印村经济联合社（以下简称联合社）。联合社经营有土地面积500亩，其中流转租用土地320亩，农民土地入股180亩（涉及33户，142人）。主要经营有商品生态鱼220亩，观赏鱼10亩，中药材80亩，花卉苗木40亩，经果种植150亩。生产经营正常。联合社除销售本社的农产品外，还可销售周边乃至全区的农产品，实现年销售各种农产品400万公斤，销售总收入1000万元，利润120万元。租用土地128户320亩，增加农民收入16万元，新增常年固定性岗位32个（其中接纳当地贫困户7户），每个岗位年收入1.80万元；新增季节性岗位4500个工作日，每个工作日收入80元。 天印村在环境整治方面，坚持“生态优先、绿色发展”理念，向上级争取资金800万，组织群众自筹资金300万，大力实施“六改六治”，建宜居美丽乡村。六改：改厕、改厨、改水、改电、改气、改路；六治：治理乱搭乱建、治理房前屋后、治理畜禽散养、治理垃圾污水、治理危旧房屋、治理公共空间。另外，天印村聘请公益性岗位12名，组建常态化保洁队伍。每月开展一次环境卫生评比，并将评比结果进行公开公示，在环境整治工作上，已取得突破性进展。 天印村在建设法治村方面，组织建立治安巡逻队，定期在村居各社进行巡逻。使居民的安全感逐步增强，有力维护了本村的治安稳定，巡逻队在巡逻中一旦发现有乱张贴、乱堆放现象及时清理解决，杜绝脏乱差现象的蔓延。通过治安巡逻，加强防范力度，挤压了犯罪空间，对犯罪分子起到了较大的震慑作用，此项活动在本村安全防范，保护村民财产安全，维护本村稳定等方面起到了非常积极的作用，保障了广大人民群众的生命财产安全，共建和谐生活。 另外，天印村何家坪所修复的乡情馆，它源于100多年前修建的碉楼院子，总的建筑面积1200㎡，历时8个月修复。里面陈列的农耕用品是当地村民自发捐赠的，共100余件。农耕用具、生产工具（木匠、石匠、编制机等）、家庭生活用品、书房等等，可供村民及游客观赏。 天印村今年被评为重庆十大最美乡村和特色乡村之一，总之，天印村以打造宜居宜业宜游的休闲美丽乡村为目标而不懈努力！
                    </el-scrollbar>
                  </div>
                </div>
                <div class="h-full !hidden" id="chart"></div>
              </div>
            </div>
            
          </div>
          <div class="flex flex-col justify-between w-[420px]">
            <div class="h-[250px] !hidden item-bg-5 box-border px-3 pt-[59px] pb-[24px]">
              <div class="flex h-full justify-evenly">
                <div class="agri-1 w-[150px] h-[162px] flex justify-center items-center">
                  <div class="text-[26px] art-font linear-title relative top-[50px]">
                    {agriResInfo.value.shelterAmount}
                  </div>
                </div>
                <div class="agri-2 w-[150px] h-[162px] flex justify-center items-center">
                  <div class="text-[26px] art-font linear-title relative top-[50px]">
                    {agriResInfo.value.plantArea}亩
                  </div>
                </div>
              </div>
            </div>
            <div class="country-intro h-560px">
              <div class="text-22px text-white h-55px art-font flex items-center pl-9">村情介绍</div>
              <div class="h-505px">
                <div class="flex justify-evenly items-center">
                  {
                    countryIntroData.value.map(item => (
                      <div class="flex flex-col items-center">
                        <div class="text-#08fefe">
                          <span class="text-23px art-font">{item.value}</span>
                          <span class="text-15px">{item.unit}</span>
                        </div>
                        <div class="text-16px text-white">{item.title}</div>
                        <div class="platform-bg w-90px h-40px"></div>
                      </div>
                    ))
                  }
                </div>

                <el-scrollbar height="390px">
                  <div class="w-full h-390px px-6 py-6 box-border leading-7 text-18px">
                    <div>重庆市潼南区塘坝镇天印村位于塘坝镇政府东南部，距离潼南城区12公里，距离塘坝场镇3公里，距离遂渝高速潼南东互通口、潼荣高速塘坝互通口5分钟车程，琼江河、塘坝河穿境而过。因村中巨石朝天落座，形似翻转的印章而得名。全村辖10个社共1226户，4326人，党员68人；幅员面积8.6平方公里，有耕地7000亩（其中土3000亩）。</div>
                    <div>2017年获评全国首批绿色村庄，在乡村振兴方面表现突出，荣获<span>“市级乡村治理示范村”、“重庆市乡村振兴贡献奖先进集体”</span>的荣誉称号。</div>
                  </div>
                </el-scrollbar>
                <div></div>
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
            <div class="h-[295px] !hidden item-bg-7 box-border pt-[50px] pb-[20px] px-[10px] overflow-hidden">
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
      )
    }

    //智慧产业页面

    //底部tab
    const bottomTabs = ref([
      { name: '枳壳' },
      { name: '柠檬' },
      { name: '紫苏' },
      { name: '大米' },
    ]);

    const activeIndex = ref(0);

    const setActive = (index) => {
      activeIndex.value = index;
    };

    const isActive = (index) => {
      return activeIndex.value === index;
    };

    // 封装函数来生成单独的tab元素
    const renderTab = (tab, index) => {
      const isActiveStyle = isActive(index)
        ? { color: '#08FFFF' }
        : { color: '#fff' };
      return (
        <div
          key={index}
          class={['flex', 'items-center', 'space-x-2rem', 'cursor-pointer', 'font-semibold',
            isActive(index)
              ? `bottomTabIcon${index + 1}Active `
              : `bottomTabIcon${index + 1}`,
          ]}
          style={isActiveStyle}
          onClick={() => setActive(index)}
        >
          <div class="w-[24px] h-[24px]"></div> 
          <div class="ml-2 grow">{tab.name}</div>
        </div>
      );
    };
    
    const indusTabPage = () => {
      return(
        <div class="w-full h-full box-border flex relative">
          {/* 左侧 */}
          <div class="w-[450px] h-full flex flex-col justify-between mengban mt-[1.2rem] mb-[2rem] px-[1rem] ml-[1rem]">            
            {/* 上半部分 */}
            <div class="w-full h-[30rem] flex flex-col">
              {/* 标题 */}
              <div 
                class="flex mx-[1rem] mt-[1rem] items-center pb-[0.8rem]"
                style="border-bottom: 1px solid #08FFFF"
              >
                <div class="titleIcon"></div>
                <div class="text-[1.5rem] art-font">本村产业情况</div>
              </div>
              {/* 内容 */}
              <div class="mt-[1rem] flex items-center justify-evenly">
                <div class="flex flex-col justify-center items-center">
                  <div class="text-[1.3rem] text-[#08FFFF] art-font">4000+</div>
                  <div class="text-[1rem] text-[#fff]">种植面积/亩</div>
                  <div class="IndusSituationImg flex"></div>
                </div>
                <div class="flex flex-col justify-center items-center">
                  <div class="text-[1.3rem] text-[#08FFFF] art-font">4000+</div>
                  <div class="text-[1rem] text-[#fff]">年产值/万元</div>
                  <div class="IndusSituationImg flex "></div>
                </div>
                <div class="flex flex-col justify-center items-center">
                  <div class="text-[1.3rem] text-[#08FFFF] art-font">8000+</div>
                  <div class="text-[1rem] text-[#fff]">带动就业/人</div>
                  <div class="IndusSituationImg flex "></div>
                </div>
                <div class="flex flex-col justify-center items-center">
                  <div class="text-[1.3rem] text-[#08FFFF] art-font">300+</div>
                  <div class="text-[1rem] text-[#fff]">农民增收/万元</div>
                  <div class="IndusSituationImg flex "></div>
                </div>
              </div>
              <div class="flex line-height-loose text-[#fff] tracking-wider">天印村积壳基地位于天印村1、2、3社，由重庆市印天湖现代农业发展有限公司和重庆市古传现代农业有限公司流转当地土地经营，于2018年建立，种植面积约4000余亩、10万余株，是西南地区最大标准化枳壳产业园，由村集体经济组织统一规划管理。产品主要是通过初加工烘烤后销往四川、安徽等中药材市场，年产值可达4000余万元，可带动周边群众就近8000余人次务工就业，为当地农民增收300余万元，具有良好的社会、经济效益。</div>
            </div>
            {/* 下半部分 */}
            <div class="w-full h-[calc(100%-30rem)] flex flex-col">
              {/* 标题 */}
              <div
                class="flex mx-[1rem] mt-[1rem] items-center pb-[0.8rem] "
                style="border-bottom: 1px solid #08FFFF"
              >
                <div class="titleIcon"></div>
                <div class="text-[1.5rem] art-font">药用价值及功效</div>
              </div>
              {/* 内容 */}
              <div class="flex gap-[0.5rem] justify-between ">
                <div class="flex flex-col mr-10rem">
                  <div class="flex">图1</div>
                  <div class="flex">虚线</div>
                  <div class="flex">黄色圆点</div>
                  <div class="flex">蓝色圆点</div>
                  <div class="flex">虚线</div>
                  <div class="flex">图2</div>
                </div>
                <el-scrollbar height="380px" class="flex ">
                <div class="flex flex-col h-full ">
                  <div class="yellowTitleBg titleBg art-font text-[#021512] text-[1.2rem] flex">传统功效</div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#EFFC6D] text-[1rem] font-semibold mb-.3rem">理气宽中:</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。 枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                  </div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#EFFC6D] text-[1rem] font-semibold mb-.3rem">行滞消胀:</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">枳壳能够促进胃肠蠕动，帮助消化。</div>
                  </div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#EFFC6D] text-[1rem] font-semibold mb-.3rem">化痰除痞:</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">枳壳可用于治疗痰饮内停所致的咳嗽、咳痰、胸闷、痞满等症状。</div>
                  </div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#EFFC6D] text-[1rem] font-semibold mb-.3rem">升提脏器:</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">常与黄芪、升麻、柴胡等补气升阳药同用，治疗脏器下垂的病症。</div>
                  </div>
                  <div class="blueTitleBg titleBg art-font text-[#021512] text-[1.2rem] flex">现代研究功效</div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#08FFFF] text-[1rem] font-semibold mb-.3rem">心血管调节作用：</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">低浓度的枳壳煎剂可使心血管收缩增强，高浓度的枳壳煎剂可使心血管收缩减弱。</div>
                  </div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#08FFFF] text-[1rem] font-semibold mb-.3rem">升血压、抗休克作用：</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">枳壳具有升血压和抗休克的功效，对于低血压、休克等情况可能有一定的辅助治疗作用。</div>
                  </div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#08FFFF] text-[1rem] font-semibold mb-.3rem">利尿作用：</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">可促进尿液排出，对于水肿等疾病有一定的辅助治疗效果。</div>
                  </div>
                  <div class="flex flex-col mb-[0.8rem]">
                    <div class="text-[#08FFFF] text-[1rem] font-semibold mb-.3rem">其他作用：</div>
                    <div class="text-[#fff] line-height-relaxed tracking-wider">枳壳还具有镇静、保肝利胆、抗病原微生物、抑制过敏反应等作用。</div>
                  </div>
                </div>
              </el-scrollbar>
              </div>
            </div>
          </div>
          {/* 中间 */}
          <div class="grow h-full flex flex-col items-center">
            <div class="w-[800px] mt-30px flex justify-between">
              <div class="leftButtonBg box-border flex items-center pl-50px w-280px h-50px text-[#fff] text-[23px]">传统功效</div>
              <div class="rightButtonBg box-border flex flex-row-reverse items-center pr-50px w-280px h-50px text-[#fff] text-[23px]">现代研究功效</div>
            </div>
            <div class="middleTree w-650px h-680px mt-70px relative">
              <div class="left-card left-120px top-90px">理气宽中</div>
              <div class="left-card left-20px top-170px">行滞销胀</div>
              <div class="left-card left-[-20px] bottom-300px">化痰除痞</div>
              <div class="left-card left-60px bottom-160px">升提脏器</div>
              <div class="right-card right-120px top-90px">心血管调节</div>
              <div class="right-card right-20px top-170px">升血压 抗休克</div>
              <div class="right-card right-[-20px] bottom-300px">利尿消肿</div>
              <div class="right-card right-60px bottom-160px">镇静、保肝利胆...</div>

              <div class="absolute middle-img-left-1 w-100px h-90px left-[-30px] top-30px"></div>
              <div class="absolute middle-img-right-1 w-100px h-90px right-[-30px] top-30px"></div>
              <div class="absolute middle-img-left-2 w-100px h-90px left-[-30px] bottom-70px"></div>
              <div class="absolute middle-img-right-2 w-100px h-90px right-[-30px] bottom-70px"></div>
            </div>
          </div>
          {/* 右侧 */}
          <div class="w-[450px] h-full flex flex-col mengban mt-[1.2rem] mb-[2rem] px-[1rem] ml-[1rem]">
            {/* 上半部分 */}
            <div class="w-full h-25rem flex flex-col">
              {/* 标题 */}
              <div
                class="flex mx-[1rem] mt-[1rem] items-center pb-[0.8rem]"
                style="border-bottom: 1px solid #08FFFF"
              >
                <div class="titleIcon"></div>
                <div class="text-[1.5rem] art-font">视频</div>
              </div>
              {/* 内容 */}
              <div class="mt-[1rem] flex items-center justify-evenly"></div>
              <div class="flex w-full h-full bg-blue"></div>
            </div>
            {/* 下半部分 */}
            <div class="w-full h-[calc(100%-30rem)] flex flex-col">
              {/* 标题 */}
              <div
                class="flex mx-[1rem] mt-[1rem] items-center pb-[0.8rem] "
                style="border-bottom: 1px solid #08FFFF"
              >
                <div class="titleIcon"></div>
                <div class="text-[1.5rem] art-font">市场需求</div>
              </div>
              {/* 内容 */}
                <div class="flex flex-col gap-[1rem] grow mt-[1rem]">
                  <div class="flex space-x-2 w-full justify-evenly">
                    <div class="flex flex-col  justify-center items-center space-y-0.5rem ">
                      <div class="flex needImg1 w-6rem h-6rem "></div>
                      <div class="bg-#08FFFF text-[#011414] rounded-full w-5rem text-center font-semibold text-[1rem] py-0.18rem px-0.5rem">枳壳</div>
                    </div>
                    <div class="flex flex-col  justify-center items-center space-y-0.5rem ">
                      <div class="flex needImg2 w-6rem h-6rem "></div>
                      <div class="bg-#08FFFF text-[#011414] rounded-full w-5rem text-center font-semibold text-[1rem] py-0.18rem px-0.5rem">陈皮</div>
                    </div>
                    <div class="flex flex-col  justify-center items-center space-y-0.5rem ">
                      <div class="flex needImg3 w-6rem h-6rem "></div>
                      <div class="bg-#08FFFF text-[#011414] rounded-full w-5rem text-center font-semibold text-[1rem] py-0.18rem px-0.5rem">陈皮条</div>
                    </div>
                  </div>
                  <el-scrollbar style="height: 300px;" >
                  <div class="line-height-relaxed text-[#fff] tracking-wider ">  枳壳的市场需求规模受到多种因素的影响，近年来呈现出一定的变化趋势。 从整体市场需求来看，过去有数据显示国内外市场枳壳总需求曾达30000吨以上。中国市场是全球枳壳市场的主要消费国，占据了约70%的市场份额。国内部分地区的相关信息也能从侧面反映枳壳的市场需求，例如江苏扬子江药业年用量在500吨左右，重庆太极集团涪陵制药年用量为500吨左右（主要用于急支糖浆）。 就目前的市场情况而言，有报道称枳壳市场年需求量在5000吨左右。不过，由于枳壳前几年存在大面积扩种的情况，导致产量增加，目前市场处于供大于求的状态，行情较为低迷。近期各中药材市场上枳壳货源走销不快，商家关注力度一般。 总体来说， 枳壳的市场需求规模受到多种因素的影响，近年来呈现出一定的变化趋势。 从整体市场需求来看，过去有数据显示国内外市场枳壳总需求曾达30000吨以上。中国市场是全球枳壳市场的主要消费国，占据了约70%的市场份额。国内部分地区的相关信息也能从侧面反映枳壳的市场需求，例如江苏扬子江药业年用量在500吨左右，重庆太极集团涪陵制药年用量为500吨左右（主要用于急支糖浆）。 就目前的市场情况而言，有报道称枳壳市场年需求量在5000吨左右。不过，由于枳壳前几年存在大面积扩种的情况，导致产量增加，目前市场处于供大于求的状态，行情较为低迷。近期各中药材市场上枳壳货源走销不快，商家关注力度一般。 总体来说，</div>
                  </el-scrollbar>
                </div>
              </div>
          </div>       
        </div>
      )
    }
    //顶部Tab按钮切换
const activeTab = ref('base')
const bgImage = ref(mainBg)
const changeTab = (key: string) => {
  if (activeTab.value === key) return
  switch (key) {
    case 'base':
      activeTab.value = 'base'
      nextTick(() => { initChart() })
      bgImage.value = mainBg
      break
    case 'indus':
      activeTab.value = 'indus'
      bgImage.value = indusBg
      // nextTick(() => {
      //   getGrowthLineChartData()
      //   getHarvestChartData()
      //   getMenuDataList()
      // })
      break
  }
}

    return () => (
      <div class="bg-[#001922] w-[100vw] h-[100vh]">
        <BigscreenAdapter>
          <BigscreenContainer backgroundImage={bgImage.value} key={bgImage.value}>
            <BigscreenHeader
            
              backgroundImage={activeTab.value === 'base' ? headerBg : headerBg1}
              height="80px"
              v-slots={{
                right: () => (<BigScreenTime class="relative top-[-9px]" />),
                left: () => (
                  <div>
                    <div class="art-font text-[40px] tracking-[6px] relative cursor-default">
                      <div class={`${ activeTab.value === 'base' ? 'topTabButtonActive text-[#08FFFF]' : 'topTabButton'} absolute top-[-28px]  left-[-20px] contain-img text-[18px] tracking-normal leading-[40px] text-center cursor-pointer`} onClick={()=>{ changeTab('base') }}>可视化驾驶舱</div>
                      <div class={`${ activeTab.value === 'indus' ? 'topTabButtonActive text-[#08FFFF]' : 'topTabButton'} absolute top-[-28px] left-[120px] contain-img text-[18px] tracking-normal leading-[40px] text-center cursor-pointer`} onClick={()=>{ changeTab('indus') }}>智慧产业</div>
                    </div>
                  </div>
                )
              }}
            />
            <BigscreenMain 
              v-slots={{
                  default: () => {
                    if (activeTab.value === 'base') return baseTabPage()
                    {/* if (activeTab.value === 'indus') return indusTabPage() */}
                    if (activeTab.value === 'indus') return <SmartIndustry />
                  }
                }}
            >
            </BigscreenMain>
            <BigscreenFooter
              height="30px"
            />
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

.platform-bg {
  background-image: url(./assets/platform.png);
  background-size: 100% 100%;
}

.country-intro {
  background-image: url(./assets/countryIntro.png);
  background-size: 100% 100%;
}

.picture-bg {
  background-image: url(./assets/picture.png);
  background-size: cover;
}

// 产业介绍轮播图片样式
@for $i from 1 through 5 {
  .picture-bg-#{$i} {
    background-image: url(./assets/picture#{$i}.png);
    background-size: cover;
  }
}

.center-card-bg {
  background-image: url(./assets/centerCardBg.png);
  background-size: 100% 100%;
}

.item-bg-extra {
  background-image: url(./assets/itemBgExtra.png);
  background-size: 100% 100%;
}

.item-bg-bug {
  background-image: url(./assets/itemBgBug.png);
  background-size: 100% 100%;
}

@for $i from 1 through 8 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% 100%;
  }
}

@for $i from 1 through 6 {
  .bug-icon-#{$i} {
    background-image: url(./assets/bugIcon#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
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

.bug-bg {
  background-image: url(./assets/bugBg.png);
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
.contain-img {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.topTabButton {
  background-image: url(./assets/topTabButton.png);
  width: 168px;
  height: 40px;
}
.topTabButtonActive {
  background-image: url(./assets/topTabButtonActive.png);
  width: 168px;
  height: 40px;

}
.titleIcon {
  background-image: url(./assets/titleIcon.png);
  background-size: contain;
  background-repeat: no-repeat;
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
}
.bottomBg {
  background-image: url(./assets/bottomBg.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.IndusSituationImg {
  background-image: url(./assets/IndusSituationImg.png);
  background-size: contain;
  width: 7rem;
  aspect-ratio: 1;
}
.mengban {
  background-image: url(./assets/mengban.png);
  background-size: contain;
  background-repeat: no-repeat;
}
.titleBg {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 3rem;
  align-items: center; 
  justify-content: center;
  aspect-ratio: 1;
}
.yellowTitleBg {
  background-image: url(./assets/zhiqiao/yellowTitleBg.png);
  width: 6rem;
}
.blueTitleBg {
  background-image: url(./assets/zhiqiao/blueTitleBg.png);
  width: 8rem;
}


// 智慧产业中间部分样式、图片
.rightButtonBg {
  background-image: url(./assets/rightButtonBg.png);
  width: 17rem;
  background-size: cover !important;

}
.leftButtonBg {
  background-image: url(./assets/leftButtonBg.png);
  background-size: cover !important;
  width: 17rem;
}
.middleTree {
  background-image: url(./assets/zhiqiao/tree.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

@for $i from 1 to 2 {
  .middleImgLeft#{$i} {
    background-image: url(./assets/zhiqiao/middleImgLeft#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
}

.left-card, .right-card {
  padding: 8px 18px;
  position: absolute;
  background-color: #363937;
}

.left-card {
  border: 1px solid #EFFC6D;
  color: #EFFC6D;
  border-radius: 1000px 1000px 0 1000px;
}

.right-card {
  border: 1px solid #08FFFF;
  color: #08FFFF;
  border-radius: 1000px 1000px 1000px 0;
}
.middle-img-left-1 {
  background-image: url(./assets/zhiqiao/middleImgLeft1.png);
  background-size: 100% 100%;
}

.middle-img-left-2 {
  background-image: url(./assets/zhiqiao/middleImgLeft2.png);
  background-size: 100% 100%;
}

.middle-img-right-1 {
  background-image: url(./assets/zhiqiao/middleImgRight1.png);
  background-size: 100% 100%;
}

.middle-img-right-2 {
  background-image: url(./assets/zhiqiao/middleImgRight2.png);
  background-size: 100% 100%;
}
//底部
@for $i from 1 through 4 {
  .bottomTabIcon#{$i} {
    background-image: url(./assets/bottomTabIcon#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
    width: 24px;   
    height: 24px;
  }
  .bottomTabIcon#{$i}Active {
    background-image: url(./assets/bottomTabIcon#{$i}Active.png);
    background-size: contain;
    background-repeat: no-repeat;
    width: 24px;   
    height: 24px;
  }
}

//智慧产业右侧
@for $i from 1 through 3 {
  .needImg#{$i} {
    background-image: url(./assets/zhiqiao/needImg#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
