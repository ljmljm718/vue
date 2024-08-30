<script lang="tsx">
import {defineComponent, ref, nextTick} from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import headerBg from './assets/v2/headerBg.png'
import mainBg from './assets/v2/bg.png'
import plantBg from './assets/v2/plant-bg.png'
import riskBg from './assets/v2/risk-bg.png'
import {formatTime} from '@/utils'
import * as echarts from 'echarts'
import Dplayer from 'dplayer';
import Hls from "hls.js";
import axios from 'axios';
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import {
  ElScrollbar,
  ElTable,
  ElTableColumn
} from 'element-plus'
// @ts-ignore
import Pagination from '@/components/Pagination/index.vue'
import {
  getParkTree,
  getEquipmentPhotographAndVideo,
  monitoringEquNoticePage,

  getPondCountFrySum,
  getLineChar,
  selectHarvest,
  getEquipmentCountSum,

  getEquipmentCountSumOrderByType,
  villageProductPage,
  environmentalDataHomePageA,
  // environmentalDataHomePageB,
  environmentalDataHomePageC,
  waterQualityData,

  fulingWarningInfo,
  fulingWarningDistr,
  getPestLevelChart,
  warningNum,
  agriWarningRecordPage,
  farmPlanPageW,
  farmdefineList,

  selectCount,
  getCountRiceDuckSum
} from './api'
import MapTangBa from '../Home/mapTangBacopy.vue'
import * as turf from '@turf/turf'
import { getDeviceCategoryTree, getDeviceInfo } from './api'
import meassageTop from './assets/tangba/meassage-top.png'

const {
  BigscreenAdapter,
  BigscreenContainer,
  BigscreenHeader,
  BigscreenFooter,
  BigscreenMain,
} = BigscreenBuilder

// 设备列表项
interface DeviceVideoListItemType {
  deviceName: string,
  videoSrc: string,
  baseName: string,
  online: boolean,
  videoId: string
}

// 通知事件列表项
interface NoticeItemType {
  noticeEvent: string,
  recordTime: number,
  captured: string
}

const checkAuth = async (deviceSerial, channelNo, leftTimes = 2):Promise<string> => {
  if (leftTimes <= 0) {
    ElMessage.error("获取视频流失败，请联系管理员!");
  }
  if (!deviceSerial || !channelNo || leftTimes <= 0) return '';
  const liveToken = localStorage.getItem("LIVE_TOKEN"), expireTime = localStorage.getItem("LIVE_EXPIRE_TIME") ?? '0';
  console.log("🚀 ~ checkAuth ~ liveToken:", liveToken)
  const isExpired = ((parseInt(expireTime) ?? 0) - new Date().valueOf()) < 0
  if (liveToken && !isExpired) {
    // 获取视频流
    const { data: liveDataRes } = await axios.post(
      "https://ezcloud.uniview.com/openapi/live/video/device/url/get",
      { deviceSerial, channelNo },
      { headers: { Authorization: liveToken } }
    )
    const { code, data: liveData } = liveDataRes;
    if (code === 200) {
      const { liveUrlList } = liveData
      if (Array.isArray(liveUrlList) && liveUrlList.length > 0) {
        return liveUrlList[0].url
      } else return ''
    } else return ''
  }

  const { data } = await axios.post("https://ezcloud.uniview.com/openapi/user/app/token/get", {
    appId: "626194353357848583",
    secretKey: "ca06cd14935e031bd7a394ee7eca154d"
  })
  if (data && data?.code === 200) {
    const { accessToken, expireTime } = data.data;
    if (accessToken) localStorage.setItem("LIVE_TOKEN", accessToken)
    if (expireTime) localStorage.setItem("LIVE_EXPIRE_TIME", expireTime + '000')
  }
  return await checkAuth(deviceSerial, channelNo, leftTimes - 1)
}
const initPlayer = async (containerId, dtu, channelId) => {
  if (!containerId || !dtu || !channelId) return;
  const resUrl = await checkAuth(dtu, channelId);
  const hls = new Hls();
  new Dplayer({
    container: document.getElementById(containerId),
    loop: false,
    autoplay: true,
    volume: 0,
    video: {
      url: resUrl,
      type: "customHls",
      customType: {
        customHls: (video) => {
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    },
    mutex: false
  })
}
export default defineComponent({
  name: 'BigscreenTest',
  setup() {
    const getIconClass = (text: string) => {
      const iconMap = {
        '温度': '1',
        '湿度': '2',
        'PH': '3',
        'EC': '4',
        '光': '5',
        '雨': '6',
        '二氧化碳': '7',
        '气压': '8',
        '虫': '9',
        '类': '10',
        'default': '1',
        "磷": '11',
        "氮": '12',
        "钾": '13',
        "深度": '14',
        "种植面积": '18',
        "农户": '17',
        "大棚": '15',
        "盆栽": '16',
        "施肥": "19",
        "虫害": "20",
        "浇水": "21",
        "除草": "22",
        "打药": "23",
        "采收": "24",
        "风力": "25",
        "风速": "26",
        "亚硝酸盐氮": "27",
        "氨氮量": "28",
        "水位": "29",
        "浑浊度": "30",
        "氧": "31",
        "盐": "32",
        "喂养": "33",
      }
      // 有完全匹配的项直接返回
      if (iconMap[text])
        return iconMap[text]

      const iconLabel = Object.keys(iconMap);
      let key = 'default'
      iconLabel.forEach(item => {
        // 之前没匹配到的才需要更新key
        if ('default' === key && (text.indexOf(item) !== -1 || item.indexOf(text) !== -1)) {
          key = item
        }
      })
      return iconMap[key]
    }

    // tab修改事件
    const TabChangeMap = new Map<string, Array<Function>>()
    const addTabChangeMap = (key: string, func: Function) => {
      const existMap: any = TabChangeMap.get(key) ? TabChangeMap.get(key) : []
      TabChangeMap.set(key, [
        ...existMap,
        func
      ])
    }
    const handleTabChange = (key: string) => {
      const existMap: any = TabChangeMap.get(key) ? TabChangeMap.get(key) : []
      existMap.forEach(func => {
        func()
      })
    }
    // tab修改 v2
    const bgImage = ref(mainBg)
    const changeTab = (key: string) => {
      if (activeTab.value === key)
        return
      
      switch (key) {
        case 'base':
          activeTab.value = 'base'
          bgImage.value = mainBg
          break
        case 'plant':
          activeTab.value = 'plant'
          bgImage.value = plantBg
          nextTick(() => {
            getGrowthLineChartData()
            getHarvestChartData()
            getMenuDataList()
          })
          break
        case 'risk':
          activeTab.value = 'risk'
          bgImage.value = riskBg
          nextTick(() => {
            initChartWarnLayout()
            initBugCountChart()
          })
          break
      }
    }

    const activeBasePark = ref()
    const handleMenuActive = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
      activeBasePark.value = key
      if (keyPath.length === 2) getMonitorDeviceList(keyPath[0], keyPath[1])
    }
    const baseParkTreeList = ref<Array<any>>([]);
    const getBaseParkTreeList = async () => {
      const res = await getParkTree();
      console.log('基地导览大屏基地树', res);
      if (!Array.isArray(res)) return
      baseParkTreeList.value = res
    }
    getBaseParkTreeList()

    // 获取监控设备列表
    const monitorDeviceLoading = ref<boolean>(false)
    const deviceVideoList = ref<Array<DeviceVideoListItemType>>([])
    const getMonitorDeviceList = async (baseId = '', plotId = '') => {
      deviceVideoList.value = []
      monitorDeviceLoading.value = true
      const res = await getEquipmentPhotographAndVideo(
        plotId ? {baseId, plotId} : baseId ? {baseId} : {}
      ).catch(() => {
        monitorDeviceLoading.value = false
      })
      console.log("获取监控设备列表", res);
      monitorDeviceLoading.value = false
      deviceVideoList.value = res.filter(ele => (ele.dtu && ele.channelId)).map(item => ({
        ...item,
        deviceName: item.deviceName,
        videoSrc: item?.monitoringEquipmentDataDO?.videoLink,
        baseName: item?.monitoringEquipmentDataDO?.monitoringBaseName,
        online: item.deviceStatus === 'online',
        videoId: `${item.dtu}_${item.channelId}`
      })).slice(0, 9);
      nextTick(() => {
        deviceVideoList.value.forEach(item => {
          if (item.online) initPlayer(item.videoId, item.dtu, item.channelId);
        })
      })
    }
    getMonitorDeviceList()
    const activeTab = ref('base')


    // 监控通知事件
    const monitorNoticeLoading = ref<boolean>(false)
    const monitorQueryParams = ref({
      pageNo: 1,
      pageSize: 9
    })
    const noticeListTotal = ref<number>(0)
    const noticeDatePickerVal = ref<Array<any>>([])
    const getMonitorNoticeList = async () => {
      monitorNoticeLoading.value = true
      const {list = [], total = 0} = await monitoringEquNoticePage({
        ...monitorQueryParams.value,
        recordTime: noticeDatePickerVal.value ? noticeDatePickerVal.value.map(item => formatTime(item, 'yyyy-MM-dd HH:mm:ss')) : undefined
      }).catch(() => {
        monitorNoticeLoading.value = false
      })
      monitorNoticeLoading.value = false
      if (!Array.isArray(list)) return
      noticeList.value = list.map(item => ({
        captured: item.captured,
        noticeEvent: item.noticeEvent,
        recordTime: item.recordTime
      }))
      noticeListTotal.value = total
    }
    getMonitorNoticeList()

    const noticeList = ref<Array<NoticeItemType>>([])
    const handleMenuChange = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
      activeBasePark.value = ''
      if (keyPath.length === 1) getMonitorDeviceList(keyPath[0], '')
    }

    // 基地列表下拉菜单图标
    const subMenuCloseIcon = <div style="color: #11F47F;"><el-icon><CaretRight /></el-icon></div>
    const subMenuOpenIcon = <div style="color: #11F47F;"><el-icon><CaretBottom /></el-icon></div>

    // 基地导览页面部分
    const baseTabPage = () => {
      return (
        <div class="w-full h-full box-border">
          <div class="w-full h-full px-[20px] flex box-border">
            {/** 左侧基地列表 */}
            <div class="w-[180px] h-[950px] pt-[10px] base-list-bg overflow-auto hidden-scrollbar">
              <el-menu
                active-text-color="transparent"
                background-color="transparent"
                default-active={activeBasePark.value}
                text-color="#fff"
                class="w-[180px]"
                onSelect={handleMenuActive}
                onOpen={handleMenuChange}
                onClose={handleMenuChange}
              >
                {
                  baseParkTreeList.value.map(item => {
                    if (item.child) return (
                      <el-sub-menu index={item.id} v-slots={{
                        title: () => (
                          <span class="text-wrap leading-[20px] text-center tracking-widest">{item.name}</span>
                        )
                      }}
                      expand-close-icon={ subMenuCloseIcon }
                      expand-open-icon={ subMenuOpenIcon }
                      >
                        {
                          Array.isArray(item.child) ? item.child.map(ele => (
                            <el-menu-item index={ele.id} class="text-wrap leading-[20px] tracking-widest">
                              {ele.name}
                            </el-menu-item>
                          )) : null
                        }
                      </el-sub-menu>
                    )
                    return (
                      <el-menu-item index={item.id} class="text-wrap leading-[20px] tracking-widest">
                        {item.name}
                      </el-menu-item>
                    )
                  })
                }
              </el-menu>
            </div>
            {/** 中间监控视频列表 */}
            <div class="w-[1310px] mx-[15px] p-[15px] grid grid-cols-3 grid-rows-3 gap-3 monitor-bg" v-loading={monitorDeviceLoading.value}>
              {
                deviceVideoList.value.map((item: DeviceVideoListItemType) => (
                  <div class="video-bg cursor-pointer" onClick={() => { window.open("/internetMonitor/deviceData/monitoring-equipment-data") }}>
                    <div class="art-font h-[37px] leading-[37px] text-[18px] text-center tracking-wide">{item.deviceName}</div>
                    <div class="w-full h-[200px] py-[5px] flex justify-center">
                      <div class="aspect-video w-340px" id={item.videoId}></div>
                    </div>
                    <div class="base-name">{ item.baseName }</div>
                    <div class={`${ item.online ? 'text-[#09DB61]' : 'text-[#DEDEDE]' } device-status-bg absolute bottom-[24px] right-[24px] flex items-center justify-center`}>
                      <div class={ item.online ? 'device-online' : 'device-offline' }></div>
                      <div class="pl-[5px]">{ item.online ? '在线' : '离线' }</div>
                    </div>
                  </div>
                ))
              }
            </div>
            {/** 右侧通知事件 */}
            <div class="w-[370px] h-[930px] p-[15px] notice-bg">
              <div class="art-font notice-title flex items-center cursor-pointer" onClick={() => { window.open("/internetMonitor/deviceData/monitoring-equipment-notice") }}>
                <div class="contain-img notice-icon"></div>
                <div>通知事件</div>
              </div>
              {/** 日期选择 */}
              <div class='mt-[15px] flex justify-between'>
                <el-date-picker
                  v-model={noticeDatePickerVal.value}
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size='default'
                  onChange={ () => { getMonitorNoticeList() } }
                />
                <button class='w-[80px] ml-[10px] btn-date' onClick={ () => { getMonitorNoticeList() }}>查询</button>
              </div>
              {/** 通知事件列表 */}
              <div class="mt-[10px] h-[790px] overflow-auto hidden-scrollbar cursor-pointer" v-loading={monitorNoticeLoading.value} onClick={() => {
                window.open("/internetMonitor/deviceData/monitoring-equipment-notice")
              }}>
                {
                  noticeList.value.map((item: NoticeItemType) => (
                    <div class="event-item flex justify-between">
                      <div class="flex flex-col justify-center pl-[20px]">
                        <el-tooltip
                          effect="dark"
                          content={item.noticeEvent}
                          placement="bottom"
                        >
                          <div class="text-[18px]">{item.noticeEvent}</div>
                        </el-tooltip>
                        <div class="mt-[6.5px] opacity-60">{formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss')}</div>
                      </div>
                      <div class="py-[2px] pr-[2px]">
                        <img src={item.captured} class="h-[86px] object-contain rounded-md"/>
                      </div>
                    </div>
                  ))
                }
              </div>
              <Pagination
                total={noticeListTotal.value}
                v-model:page={monitorQueryParams.value.pageNo}
                v-model:limit={monitorQueryParams.value.pageSize}
                onPagination={() => getMonitorNoticeList()}
                layout="total, prev, pager, next"
              />
            </div>
          </div>
        </div>
      )
    }

    // const runtimeBase = ref('')
    // 智慧种植部分
    // 基础设施
    const baseEquipmentLoading = ref<boolean>(false)
    const baseEquipmentList = ref<Array<any>>([])
    const getBaseEquipmentList = async () => {
      baseEquipmentLoading.value = true
      try {
        const res = await getPondCountFrySum()
        const res2 = await selectCount()
        const res1 = await getCountRiceDuckSum()
        console.log("基础设施", res);
        baseEquipmentList.value = [
          {label: '池塘', value: res.pondCount + '个'},
          {label: '鱼苗', value: res.fryCount + '条'},
          {
            label: '鸭舍',
            value: res1.duckCoopCount + '间',
            url: '/asset/base/parkdetail?type=DuckCoop'
          },
          {label: '稻鸭', value: res1.riceDuckCount + '只' , url: '/asset/base/parkdetail?type=DuckCoop'},
          {label: '示范基地', value: res2.parkSum + '亩', url: '/asset/base/parkinfo'},
          {label: '基地数量', value: res2.parkCount + '个', url: '/asset/base/parkinfo'},
          {label: '养殖农户', value: res2.farmerCount + '户', url: '/asset/base/farmer-info'},
        ]


      } catch (err) {
        baseEquipmentLoading.value = false
      }

      baseEquipmentLoading.value = false
    }
    getBaseEquipmentList()

    // 生长分析折线图
    const getGrowthLineChartData = async () => {
      const {
        xValue = [],
        yValue = [],
        measureUnit = []
      } = await getLineChar({cropCode: '1787727824907661312'})
      console.log("xValue", xValue);
      console.log("yValue", yValue);
      console.log("measureUnit", measureUnit);
      initChartStatic(
        'growthChart',
        generateBaseOptions({
          xAxis: {
            data: xValue,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#ffffff80'
              }
            },
            // x轴刻度标签字体白色
            axisLabel: {
              color: '#fff'
            }
          },
          legend: {
            show: false,
          },
          color: ['#ffa773', '#36e1d9'],
          yAxis: {
            name: `单位/${measureUnit[0]}`,
            nameTextStyle: {
              color: '#fff'
            },
            type: 'value',
            axisLine: {
              show: false,
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
            },
            // y轴刻度标签字体白色
            axisLabel: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                width: 3,
                color: '#11F47F',
                type: 'solid'
              }
            },
            extraCssText: 'background: linear-gradient(270deg, #3DFF9B 0%, rgba(10, 87, 47, 0) 100%);',
            textStyle: {
              color: '#fff'
            },
            borderWidth: 0
          },
          series: [
            {
              name: '',
              data: yValue,
              barWidth: 30,
              type: 'line',
              symbol: 'none',
              lineStyle: {
                width: 3,
                color: '#11F47F'
              },
              smooth: false,
              label: {
                show: false, 
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(1, 255, 124, 0.3)' },
                  { offset: 1, color: 'rgba(1, 255, 124, 0)' }
                ])
              },
            }
          ],
          grid: {
            left: '10%',
            right: '8%',
            top: '16%',
            bottom: '15%'
          }
        })
      )
    }
    // 产量分析
    const getHarvestChartData = async () => {
      const res = await selectHarvest()
      console.log("产量分析", res);
      let xAxis = res.map(item => (item.time))
      xAxis = [...new Set([...xAxis])].sort().reverse()
      console.log("xAxis", xAxis);
      let types = res.map(item => (item.variety))
      types = [...new Set([...types])]
      const findValByTimeAndvariety = (item) => {
        let _res = '0'
        res.forEach(ele => {
          if (
            item.time === ele.time
            &&
            item.variety === ele.variety
          ) _res = parseFloat(ele.harvest).toFixed(2)
        })
        return _res
      }
      const colorList = ['92, 230, 216', '1, 255, 124', '233, 216, 16']
      const series = types.map((item, index) => {
        const nameMap = {
          "duck": '稻田鸭',
          "fish": '稻田鱼',
          "rice": "稻谷"
        }
        // console.log("weijialin", item)
        return {
          name: item,
          data: xAxis.map(x => {
            return findValByTimeAndvariety({
              time: x,
              variety: item
            })
          }),
          type: "bar",
          smooth: false,
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#000',
              fontSize: 12
            },
            backgroundColor: `rgba(${colorList[index]}, 1)`,
            width: 38,
            height: 13,
            formatter: () => "",
            distance: 7
          },
          itemStyle: {
            color: `rgba(${colorList[index]}, 0.2)`,
            borderColor: `rgba(${colorList[index]}, 1)`,
            borderWidth: 3
          },
        }
      })
      initChartStatic(
        "harvestChart",
        generateBaseOptions({
          xAxis: {
            data: xAxis,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#ffffff80",
              },
            },
            // x轴刻度标签字体白色
            axisLabel: {
              color: '#fff'
            }
          },
          legend: {
            show: true,
            orient: 'horizontal',
            itemWidth: 12,
            itemHeight: 4,
            textStyle: {
              color: '#fff',
              fontSize: 14
            },
            data: colorList.map((item, index) => {
              return {name: types[index], itemStyle: {color: `rgba(${item}, 1)`, borderWidth: 0}}
            }),
            top: 10,
            left: 240
          },
          color: ["#ed7d31", "#a9d18e", "#d9d9d9"],
          yAxis: [
            {
              type: "value",
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#ffffff80",
                },
              },
              // y轴刻度字体白色
              axisLabel: {
                color: '#ffffff'
              },
              splitLine: {
                //网格线
                show: true, //是否显示
                lineStyle: {
                  //网格线样式
                  color: "#ffffff80", //网格线颜色
                  width: 1, //网格线的加粗程度
                  type: "dashed", //网格线类型
                },
              },
              splitArea: {
                //网格区域
                show: false, //是否显示
              }
            },
          ],
          series,
          grid: {
            left: "12%",
            right: "8%",
            top: "17%",
            bottom: "15%",
          },
        })
      );
    }
    addTabChangeMap('plant', () => {
      nextTick(() => {
        getGrowthLineChartData()
        getHarvestChartData()
      })
    })

    // 设备信息
    const deviceInfoLoading = ref<boolean>(false)
    const deviceInfoList = ref<Array<any>>([])
    const deviceInfoTotal = ref(0)
    const getDeviceInfoList = async () => {
      deviceInfoTotal.value = 0
      deviceInfoLoading.value = true
      const res = await getEquipmentCountSumOrderByType().catch(() => {
        deviceInfoLoading.value = false
      })
      console.log('设备信息', res);
      const buildArr: Array<any> = []
      const kayMap = {
        "atmosphere": "气象监测",
        "growthMonitoring": "生长监控",
        "soil": "土壤监控",
        "waterQuality": "水质监测"
      }
      for (let key in res) {
        buildArr.push({
          deviceKind: kayMap[key],
          total: res[key]['totality'],
          online: res[key]['online'],
          offline: res[key]['offline']
        })
      }
      deviceInfoLoading.value = false
      const getRateByData = (_item) => {
        return parseInt(_item.online) / parseInt(_item.total) * 100
      }
      deviceInfoList.value = buildArr.map(item => ({...item, rate: getRateByData(item)}))
      buildArr.forEach(item => {
        deviceInfoTotal.value += parseInt(item.total)
      })
    }
    getDeviceInfoList()

    // 特色产品
    const villageProductPageLoading = ref<boolean>(false)
    const villageProductPageList = ref<Array<any>>([])
    const showedProductPageList = ref<Array<any>>([])
    const villageActiveIndex = ref<number>(0)
    let villageTimer: any = null
    onMounted(() => {
      villageTimer = setInterval(() => {
        const len = villageProductPageList.value.length
        if (villageProductPageList.value.length <= 2) return
        if (villageActiveIndex.value + 2 >= len) {
          villageActiveIndex.value = 0
        } else {
          villageActiveIndex.value++
        }
        showedProductPageList.value = villageProductPageList.value.slice(
          villageActiveIndex.value, villageActiveIndex.value + 2
        )
      }, 8000)
    })
    onBeforeUnmount(() => {
      clearInterval(villageTimer)
    })
    const getvillageProductPage = async () => {
      villageProductPageLoading.value = true
      const {list = []} = await villageProductPage().catch(() => {
        villageProductPageLoading.value = false
      })
      villageProductPageLoading.value = false
      console.log("特色产品", list);
      if (!Array.isArray(list)) return
      villageProductPageList.value = list.filter(item => {
        if (item.photo) return true
        return false
      })
      showedProductPageList.value = villageProductPageList.value.slice(0, 2)
    }
    getvillageProductPage()

    // 气象站
    const weatherLoading = ref<boolean>(false)
    const weatherList = ref<Array<any>>([])
    const getWeatherList = async () => {
      weatherLoading.value = true
      const res = await environmentalDataHomePageA({}).catch(() => {
        weatherLoading.value = false
      })
      weatherLoading.value = false
      console.log("气象站", res);
      if (!Array.isArray(res)) return
      weatherList.value = res.map(item => ({
        id: item.id,
        icon: getIconClass(item.monitoringType),
        label: item.monitoringType || '--',
        value: item.dataValue || '--',
        unit: item.yyUnit || ''
      })).slice(0, 8)
    }
    getWeatherList()

    // 土壤墒情
    const soilLoading = ref<boolean>(false)
    const soilList = ref<Array<any>>([])
    const getsoilList = async () => {
      soilLoading.value = true
      const res = await environmentalDataHomePageC({}).catch(() => {
        soilLoading.value = false
      })
      soilLoading.value = false
      console.log("土壤墒情", res);
      if (!Array.isArray(res)) return
      soilList.value = res.map(item => ({
        id: item.id,
        icon: getIconClass(item.monitoringType),
        label: item.monitoringType || '--',
        value: item.dataValue || '--',
        unit: item.yyUnit || ''
      })).slice(0, 8)
    }
    getsoilList()

    // 水质
    const waterLoading = ref<boolean>(false)
    const waterList = ref<Array<any>>([])
    const getWaterList = async () => {
      waterLoading.value = true
      const res = await waterQualityData({}).catch(() => {
        waterLoading.value = false
      })
      waterLoading.value = false
      console.log("水质", res);
      if (!Array.isArray(res)) return
      waterList.value = res.map(item => ({
        id: item.id,
        icon: getIconClass(item.monitoringType),
        label: item.monitoringType || '--',
        value: item.dataValue || '--',
        unit: item.yyUnit || ''
      })).slice(0, res.length)
    }
    getWaterList()

    // 中间顶部
    // 添加背景类名和图标类名
    const plantCenterTopCardList = ref<Array<any>>([])
    const getPlantCenterTopCardList = async () => {
      const res = await getEquipmentCountSum()
      console.log("中间顶部", res);
      plantCenterTopCardList.value = [
        {
          label: '设备总数',
          value: res['设备总数'],
          param: '',
          bgClass: 'device-total-bg',
          iconClass: 'device-total-icon',
        },
        {
          label: '在线设备',
          value: res['在线设备'],
          param: 'online',
          bgClass: 'device-online-bg',
          iconClass: 'device-online-icon',
        },
        {
          label: '离线设备',
          value: res['离线设备'],
          param: 'offline',
          bgClass: 'device-offline-bg',
          iconClass: 'device-offline-icon',
        },
        {
          label: '故障设备',
          value: res['报警设备'],
          param: 'fault',
          bgClass: 'device-error-bg',
          iconClass: 'device-error-icon',
        },
      ]
    }
    getPlantCenterTopCardList()

    const mapTangBgRef = ref<any>()
    const allDeviceDataList = ref<Array<any>>([])

    const getAllLocationDevice = (arr: Array<any>): Array<any> => {
      let resArr: Array<any> = []
      arr.forEach((item) => {
        if (item.children) {
          resArr = [...resArr, ...getAllLocationDevice(item.children)]
        } else resArr.push(item)
      })
      return resArr
    }

    const handleSelect = async (item) => {
      const res = await getDeviceInfo({ id: item })
      if (mapTangBgRef.value) {
        console.log('地图设备详情', res)
        // mapTangBgRef.value.addMarkerToMap(res.longitude, res.latitude, res.deviceName)
        const infoString = `<div class="bg-[#e8f2fc] relative">
          <div class='relative'>
            <img src="${meassageTop}" class='w-100% h-40px z-[-1] top-0 left-0 absolute' />
            <div class="bg-[#95bbf8] p-2 px-3 meassage-top z-999" style="font-weight:600;">${
              res.parkName
            }</div>
            </div>
          
            <div class="p-2  text-[14px] meassage-bg">
              <div class="p-1 px-2 color-[#000] flex items-center "> <div class="bg-[#0160ff] mr-5px w-[8px] h-[8px] rounded-full"></div> ${
                res.deviceName
              }</div>
              <div class="p-1 px-2 flex space-x-2 items-center">
                <div class="${
                  res.deviceStatus === 'online' ? 'bg-[#35dc71]' : 'bg-[#e84133]'
                } w-[8px] h-[8px] rounded-full"></div>
                <div>${res.deviceStatus === 'online' ? '在线' : '离线'}</div>
              </div>
                ${res.channelId !== null && res.channelId !== '' && res.dtu !== null && res.dtu !== ''? 
                `
                  <div class="flex pt-[1.2rem] justify-center">
                    <a 
                    href="/checkVideo?dtu=${res.dtu}&channelId=${res.channelId}&url=${res.url}" 
                    class="w-[60%] text-center bg-[#409eff] !text-white py-[5px] px-[10px] rounded-md font-medium hover:bg-[#66b1ff] transition-colors"
                    style="text-decoration: none;">
                  查看监控
                    </a>
                  </div>
                `
                : ''}
            </div> 
          </div>`
        mapTangBgRef.value.openInfoWindow(infoString, [res.longitude, res.latitude])
        mapTangBgRef.value.setMapCenter(res.longitude, res.latitude)
      }
    }

    const getMenuDataList = async () => {
      const res = await getDeviceCategoryTree({})
      console.log('getMenuDataList14123', res)
      console.log('模板引用', mapTangBgRef.value)

      if (Array.isArray(res)) allDeviceDataList.value = getAllLocationDevice(res)
      console.log('allDeviceDataList', allDeviceDataList.value)
      const kindMap = {
        '101': 'Monitor',
        '79': 'Monitor',
        '82': 'Grow',
        '102': 'Grow',
        '103': 'Weather',
        '159': 'Weather',
        '81': 'Weather',
        '86': 'Soil',
        '104': 'Soil',
        '107': 'Bug',
        '88': 'Bug'
      }

      // 添加 Marker 到地图上
      const _center = turf.centroid(
        turf.points(
          allDeviceDataList.value
            .map((ele) => {
              const _item = JSON.parse(JSON.stringify(ele))
              return [parseFloat(_item.longitude), parseFloat(_item.latitude)]
            })
            .filter((item) => {
              const [a, b] = item
              if (isNaN(a) || isNaN(b) || !a || !b) return false
              return true
            })
        )
      )

      const { geometry } = _center
      const { coordinates } = geometry
      const [_lng, _lat] = coordinates
      mapTangBgRef.value.setViewport(
        allDeviceDataList.value.map((item) => {
          return { lng: item.longitude, lat: item.latitude }
        })
      )
      mapTangBgRef.value.setMapCenter(_lng, _lat)
      // mapTangBgRef.value.setMapZoom(17)

      allDeviceDataList.value.forEach((item) => {
        const _item = JSON.parse(JSON.stringify(item))
        if (!_item.longitude || !_item.latitude) {
          return
        }
        const statusText = _item.deviceStatus === 'online' ? 'online' : 'offline'
        console.log('ImgSrc', `/tangba/${statusText}${kindMap[_item.deviceKind] || 'Monitor'}.png`)

        const marker = mapTangBgRef.value.addMarkerToMap(
          _item.longitude,
          _item.latitude,
          _item.deviceName,
          `/tangba/${statusText}${kindMap[_item.deviceKind] || 'Monitor'}.png`
        )
        marker.on('click', () => {
          handleSelect(item.id)
        })
      })
    }
    // getMenuDataList()

    const plantTabPage = () => {
      return (
        <div class="w-full h-full px-[20px] pt-[10px] box-border flex">
          {/** 左 */}
          <div class="w-[420px] h-full flex flex-col justify-between">
            {/** 基础设施 */}
            <div class="w-full h-[310px]">
              {/** 标题 */}
              <div class="plant-card-title">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">基础设施</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="plant-card-content">
                <div class="px-[20px] py-[28px] grid grid-cols-2 gap-[10px] overflow-auto hidden-scrollbar" v-loading={baseEquipmentLoading.value}>
                  {
                    baseEquipmentList.value.map(item => (
                      <div class="flex justify-between box-border px-[16px] py-[12px] base-device-item cursor-pointer" onClick={() => { if (item.url) window.open(item.url) }}>
                        <div>{item.label}</div>
                        <div class="text-[#11F47F]">{item.value}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            {/** 生长分析 */}
            <div class="w-full h-[310px]">
              {/** 标题 */}
              <div class="plant-card-title">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">生长分析</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="plant-card-content">
                <div id="growthChart" class="cursor-pointer" onClick={() => { window.open("/internetMonitor/deviceData/grow-record") }}></div>
              </div>
            </div>
            {/** 产量分析 */}
            <div class="w-full h-[310px]">
              {/** 标题 */}
              <div class="plant-card-title">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">产量分析</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="plant-card-content">
                <div id="harvestChart" class="mt-2 cursor-pointer" onClick={() => { window.open("/farm_work/harvest-management") }}></div>
              </div>
            </div>
          </div>
          {/** 中 */}
          <div class="w-[1010px] h-full mx-[15px] flex flex-col justify-between relative">
            {/** 地图 */}
            <MapTangBa ref={mapTangBgRef} class="w-full h-[630px] z-0" />
            {/* h(MapTangBa, {class: 'w-full h-[630px] z-0', ref: mapTangBgRef}) */}
            {/** 设备统计 */}
            <div class="w-full box-border h-[70px] px-[52.5px] pt-[10px] grid grid-cols-4 gap-[15px] absolute top-0 left-0">
              {
                plantCenterTopCardList.value.map(item => (
                  <div class={`device-bg ${ item.bgClass } flex justify-between items-center cursor-pointer`} onClick={() => { window.open("/internetMonitor/device/deviceView?deviceStatus=" + item.param) }}>
                    <div class="flex items-center">
                      <div class={`device-icon ${ item.iconClass }`}></div>
                      <div class="ml-[10px]">{item.label}</div>
                    </div>
                    <div class="text-[24px]">{item.value}</div>
                  </div>
                ))
              }
            </div>
            {/** 打造特色产品 */}
            <div class="w-full h-[310px]">
              {/** 标题 */}
              <div class="plant-card-title-wide">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">打造特色产品</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="plant-card-content-wide box-border px-[17px] py-[21px]">
                <div class="flex justify-between cursor-pointer" onClick={() => { window.open("/pcg/production/village-product") }} v-loading={baseEquipmentLoading.value}>
                  {
                    showedProductPageList.value.map(item => (
                      <div class="flex justify-between product-item">
                        <img src={item.photo} class="h-[170px] object-contain" />
                        <div class="w-[150px] overflow-auto hidden-scrollbar">
                          <div>
                            <div class="text-[#B6BECE]">农场名称:</div>
                            <div class="text-[18px] product-item-detail-bg mt-[5px]">{item.park}</div>
                          </div>
                          <div class="mt-[17px]">
                            <div class="text-[#B6BECE]">农场详情:</div>
                            <div class="text-[18px] product-item-detail-bg mt-[5px]">{item.parkDetail}</div>
                          </div>
                          <div class="mt-[17px]">
                            <div class="text-[#B6BECE]">产品名称:</div>
                            <div class="text-[18px] product-item-detail-bg mt-[5px]">{item.product}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          {/** 右 */}
          <div class="w-[420px] h-full flex flex-col justify-between">
            {/** 物联网设备 */}
            <div class="w-full h-[278px]">
              {/** 标题 */}
              <div class="plant-card-title">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">物联网设备</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="plant-card-content-small box-border px-[15px] py-[12px]">
                <div class="cursor-pointer" onClick={() => { window.open("/internetMonitor/device/overview") }} v-loading={deviceInfoLoading.value}>
                  <div class="flex justify-between box-border px-[20px] py-[6px] iot-total">
                    <div>物联网设备</div>
                    <div class="text-sm">共计: <span class="text-[18px]">{deviceInfoTotal.value}</span>台</div>
                  </div>
                  <div class="overflow-auto hidden-scrollbar">
                    {
                      deviceInfoList.value.map(item => (
                        <div class="iot-item">
                          <div class="flex justify-between">
                            <div>{item.deviceKind}</div>
                            <div>共计: {item.total}台</div>
                          </div>
                          <el-progress percentage={item.rate} class="mt-[9px]" stroke-width="10px" color="#01FF7C" show-text={ false } striped striped-flow duration="30"/>
                          <div class="mt-[7px] flex justify-end items-center">
                            <div class="pr-[3px]">在线: {item.online}</div>
                            <div class="w-[1px] h-[10px] box-border border border-solid border-[#82868F]"></div>
                            <div><span class="pl-[5px]">离线: {item.offline}</span></div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            {/** 实时监测 */}
            <div class="w-full h-[667px]">
              {/** 标题 */}
              <div class="plant-card-title">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">实时监测</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="plant-card-content-high box-border py-[10px] px-[14px] overflow-auto hidden-scrollbar">
                {/** 气象监测 */}
                <div class="art-font w-fit h-[21px] leading-[21px] text-[16px] cursor-pointer" onClick={() => { window.open("/internetMonitor/deviceData/equipment-data-three?collectionType=气象站") }}>
                  气象监测
                </div>
                <div class="mt-[6px] grid grid-cols-4 gap-[8px] cursor-pointer" v-loading={weatherLoading.value} onClick={() => { window.open("/internetMonitor/deviceData/equipment-data-three?collectionType=气象站") }}>
                  {
                    weatherList.value.map((item) => (
                      <div class="real-time-item flex flex-col items-center">
                        <div class={['iconv2-' + item.icon]}></div>
                        <div>{item.label}</div>
                        <div class="real-time-item-value">
                          <span class="text-[16px]">{item.value}</span>
                          <span class="">{item.unit || ''}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {/** 土壤墒情 */}
                <div class="art-font w-fit h-[21px] leading-[21px] text-[16px] mt-[8px] hidden cursor-pointer" onClick={() => { window.open("/internetMonitor/deviceData/equipment-data-three?collectionType=土壤监测") }}>
                  土壤墒情
                </div>
                <div class="mt-[6px] grid grid-cols-4 gap-[8px] hidden cursor-pointer" v-loading={soilLoading.value}  cursor-pointer={() => { window.open("/internetMonitor/deviceData/equipment-data-three?collectionType=土壤监测") }}>
                  {
                    soilList.value.map((item) => (
                      <div class="real-time-item flex flex-col items-center">
                        <div class={['iconv2-' + item.icon]}></div>
                        <div>{item.label}</div>
                        <div class="real-time-item-value">
                          <span class="text-[16px]">{item.value}</span>
                          <span class="">{item.unit || ''}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {/** 水质监测 */}
                <div class="art-font w-fit h-[21px] leading-[21px] text-[16px] mt-[8px] cursor-pointer" onClick={() => { window.open("/internetMonitor/deviceData/equipment-data-three?collectionType=水质监测") }}>
                  水质监测
                </div>
                <div class="mt-[6px] grid grid-cols-4 gap-[8px] cursor-pointer" v-loading={waterLoading.value} onClick={() => { window.open("/internetMonitor/deviceData/equipment-data-three?collectionType=水质监测") }}>
                  {
                    waterList.value.map((item) => (
                      <div class="real-time-item flex flex-col items-center">
                        <div class={['iconv2-' + item.icon]}></div>
                        <div>{item.label}</div>
                        <div class="real-time-item-value">
                          <span class="text-[16px]">{item.value}</span>
                          <span class="">{item.unit || ''}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 预警列表
    const preWarnLoading = ref<boolean>(false)
    const preWarnList = ref<Array<any>>([])
    const getPreWarnList = async () => {
      preWarnLoading.value = true
      const res = await fulingWarningInfo({
        parkId: '',
        plotId: ''
      }).catch(() => {
        preWarnLoading.value = false
      })
      if (!Array.isArray(res)) return
      preWarnLoading.value = false
      console.log("预警列表", res);
      preWarnList.value = res.map(item => ({
        ...item,
        warnLocation: item.warnLocation ? item.warnLocation : '未知',
        warnTime: formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss'),
        warnStatus: item.warnStatus === '0' ? '未处理' : '已处理'
      }))
    }
    getPreWarnList()

    // 预警分布Echarts
    const initChartWarnLayout = async () => {
      const res = await fulingWarningDistr({})
      console.log("预警分布ECharts数据", res)
      const colorList = ['100, 170, 234', '255, 137, 53', '181, 181, 181', '255, 211, 0', '74, 125, 215', '246, 107, 191', '55, 216, 255', '113, 246, 249', '91, 155, 213', '237, 125, 49', '165, 165, 165', '255, 192, 0', '68, 114, 196', '255, 94, 94', '17, 234, 201', '17, 244, 127']
      if (!Array.isArray(res)) return
      initChartStatic(
        "preWarnLayoutChart",
        generatePieOptions({
          legend: {
            show: true,
            top: "84%",
            left: "center",
            orient: 'horizontal',
          },
          color: ["#5b9bd5", "#ed7d31", "#a5a5a5", '#ffc000', '#4472c4'],
          series: [
            {
              nam: "预警分布",
              type: "pie",
              radius: ["40%", "50%"],
              center: ["50%", "47%"],
              padAngle: 5,
              data: res.map((item, index) => ({
                name: item.warnType,
                value: item.warnRatio,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: `rgba(${colorList[index]}, 1)` },
                    { offset: 1, color: `rgba(${colorList[index]}, 0.2)` }
                  ])
                }
              })),
              label: {
                formatter: "{b}\n{c},{d}%",
                color: '#fff',
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

    // 虫害数量
    const initBugCountChart = async () => {
      const {
        abscissaList = [],
        eList = [],
        sumList = [],
        jinList = [],
        xiList = []
      } = await getPestLevelChart({})
      console.log("虫害数量 总数", sumList);
      const colorList = ['255, 98, 19', '9, 79, 58', '157, 110, 48', '53, 117, 124']
      const types = ['总数', '金蝉子数量', '蛾对应数量', '蟋蟀数量']
      initChartStatic(
        'bugCountChart',
        generateBaseOptions({
          xAxis: {
            data: abscissaList,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#ffffff80'
              }
            }
          },
          legend: {
            show: true,
            orient: 'horizontal',
            itemWidth: 15,
            itemHeight: 5,
            textStyle: {
              color: '#fff',
              fontSize: 14
            },
            data: colorList.map((item, index) => {
              return {name: types[index], itemStyle: {color: `rgba(${item}, 1)`, borderWidth: 0}}
            }),
            top: 20,
            left: 180
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
              name: '总数',
              data: sumList,
              barWidth: 30,
              type: 'line',
              smooth: false,
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
                color: '#FF6213'
              }
            },
            {
              name: '金蝉子数量',
              data: jinList,
              type: 'bar',
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#14F17F' },
                  { offset: 1, color: 'rgba(9, 79, 58, 0.5)' }
                ])
              }
            },
            {
              name: '蛾对应数量',
              data: eList,
              type: 'bar',
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FFD534' },
                  { offset: 1, color: 'rgba(157, 110, 48, 0.5)' }
                ])
              }
            },
            {
              name: '蟋蟀数量',
              data: xiList,
              type: 'bar',
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#66E1DF' },
                  { offset: 1, color: 'rgba(53, 117, 124, 0.5)' }
                ])
              }
            },
          ],
          grid: {
            left: '12%',
            right: '10%',
            top: '16%',
            bottom: '15%'
          }
        })
      )
    }
    addTabChangeMap('risk', () => {
      nextTick(() => {
        initChartWarnLayout()
        initBugCountChart()
      })
    })

    // 报警信息处理情况
    const warnHandleInfo = ref<Array<any>>([])
    const getWarnHandleInfoList = async () => {
      const res = await warningNum({})
      console.log('报警信息处理情况左侧统计', res);
      if (!Array.isArray(res)) return
      warnHandleInfo.value = res.map(item => ({
        ...item,
        label: item.warnStatus === '0'
          ? '未处理'
          : item.warnStatus === '1'
            ? '已处理'
            : '已忽略',
        value: item.num
      }))
    }
    getWarnHandleInfoList()

    // 报警信息处理情况列表
    const warnInfoHandleLoading = ref<boolean>(false)
    const warnInfoHandleList = ref<Array<any>>([])
    const getWarnInfoHandleList = async () => {
      warnInfoHandleLoading.value = true
      const {list = []} = await agriWarningRecordPage({warnStatus: '0'}).catch(() => {
        warnInfoHandleLoading.value = false
      })
      warnInfoHandleLoading.value = false
      if (!Array.isArray(list)) return
      warnInfoHandleList.value = list.map(item => {
        return {
          ...item,
          warnTime: formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss'),
        }
      })
    }
    getWarnInfoHandleList()

    // 指挥调度
    const commandLoading = ref<boolean>(false)
    const commandInfoList = ref<Array<any>>([])
    const getCommandInfoList = async (farmDefineType: string) => {
      commandInfoList.value = []
      commandLoading.value = true
      const {list = [], total = 0} = await farmPlanPageW({
        pageNo: 1, pageSize: 7, farmDefineType
      }).catch(() => {
        commandLoading.value = false
      })
      console.log("指挥调度", list);
      commandLoading.value = false
      commandInfoList.value = list.map(item => ({
        ...item,
        lastTime: formatTime(item.lastTime, 'yyyy-MM-dd'),
        startTime: formatTime(item.startTime, 'yyyy-MM-dd')
      }))
      console.log("total", total);
    }

    // 指挥调度 上面
    const farmTopLoading = ref<boolean>(false)
    const farmTopList = ref<Array<any>>([])
    const selectedFarmTopId = ref<string>()
    const getFarmTopList = async () => {
      farmTopLoading.value = true
      const res = await farmdefineList().catch(() => {
        farmTopLoading.value = false
      })
      farmTopLoading.value = false
      farmTopList.value = res.map(item => ({
        ...item,
        icon: 'icon-schedule-' + getIconClass(item.defineName),
        label: item.defineName
      }))
      if (farmTopList.value.length > 0) {
        selectedFarmTopId.value = farmTopList.value[0].id
        getCommandInfoList(farmTopList.value[0].id)
      }
    }
    getFarmTopList()
    //跳转农事记录添加接口，定义可传递的参数
    const generateUrlParams = (params: object) => {
      const _keys = Object.keys(params)
      let _url = []
      _keys.forEach(_ele => {
        const _text = _ele + '=' + params[_ele]
        _url.push(_text)
      })
      return _url.join('&')
    }

    // 预警信息表格行 样式
    const warnInfoRow = (data: { row: any, rowIndex: number }) => {
      let res = {"background-color": 'transparent', color: '#fff'}
      if (data.rowIndex % 2) {
        res['background'] = 'linear-gradient(90deg, rgba(255, 69, 69, 0.182) 0%, rgba(255, 69, 69, 0.05) 100%)'
      }
      return res
    }
    // 预警信息表格头 样式
    const warnInfoTitle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }) => {
      let res = {
        "background-color": "rgba(17, 234, 201, 0.1)",
        color: "#11EAC9",
        height: '35px',
        'line-height': '35px'
      }
      if (!data.columnIndex) {
        res['padding-left'] = '35px'
      }
      return res
    }

    // 报警信息处理情况表头 样式
    const dealTitle = () => {
      return {
        "background-color": "rgba(17, 234, 201, 0.1)",
        color: "#11EAC9",
        border: 'none',
        height: '35px',
        'line-height': '35px'
      }
    }
    // 报警信息处理情况内容 样式
    const dealContent = () => {
      return {
        color: '#fff',
        height: '35px',
        'line-height': '35px',
        'border-bottom': '1px dashed rgba(61, 255, 226, 0.15)',
      }
    }

    const riskTabPage = () => {
      return (
        <div class="flex w-full h-full box-border pt-[10px] px-[20px]">
          {/** 左 */}
          <div class="w-[1165px] h-full mr-[15px]">
            {/** 预警信息 */}
            <div>
              {/** 标题 */}
              <div class="risk-card-title-lg">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">预警信息</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="risk-card-content-lg">
                <div class="w-full h-full box-border px-[15px] pt-[15px] pb-[10px] cursor-pointer" v-loading={preWarnLoading.value} onClick={() => { window.open("/internetMonitor/warn/agri-warning-record") }}>
                  <ElTable data={preWarnList.value} rowStyle={warnInfoRow} headerCellStyle={warnInfoTitle} headerRowStyle={{'background-color': 'transparent'}} height="392.5px" style="background-color: transparent">
                    <ElTableColumn label="预警信息">
                      {
                        ({ row }) => (
                          <div class="flex items-center">
                            <div class="contain-img risk-warn-info-icon"></div>
                            <div>{ row.warnInfo }</div>
                          </div>
                        )
                      }
                    </ElTableColumn>
                    <ElTableColumn label="预警地点" property="warnLocation" />
                    <ElTableColumn label="预警时间" property="warnTime" />
                    <ElTableColumn label="预警类型" property="warnType" />
                    <ElTableColumn label="预警状态">
                      {
                        ({row}) => (
                          <span class={'未处理' === row.warnStatus ? 'text-[#11F47F]' : ''}>{row.warnStatus}</span>
                        )
                      }
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </div>
            <div class="mt-[15px] flex">
              {/** 预警分布 */}
              <div>
                {/** 标题 */}
                <div class="risk-card-title-sm">
                  <div class="flex items-center ml-[15px]">
                    <div class="notice-icon contain-img"></div>
                    <div class="art-font notice-title">预警分布</div>
                  </div>
                </div>
                {/** 内容 */}
                <div class="risk-card-content-sm relative">
                  <div id="preWarnLayoutChart" class="cursor-pointer" onClick={() => { window.open("/internetMonitor/warn/agri-warning-record") }}></div>
                  <div class="absolute top-[118.75px] left-[217.5px] distribution-label flex justify-center items-center">
                    <span class="art-font text-[24px] distribution-text">预警分布</span>
                  </div>
                </div>
              </div>
              {/** 虫害数量 */}
              <div class="ml-[15px]">
                {/** 标题 */}
                <div class="risk-card-title-sm">
                  <div class="flex items-center ml-[15px]">
                    <div class="notice-icon contain-img"></div>
                    <div class="art-font notice-title">虫害数量</div>
                  </div>
                </div>
                {/** 内容 */}
                <div class="risk-card-content-sm">
                  <div id="bugCountChart" class="cursor-pointer" onClick={() => { window.open("/internetMonitor/deviceData/equipment-data?collectionType=虫情监测") }}></div>
                </div>
              </div>
            </div>
          </div>
          {/** 右 */}
          <div class="w-[700px] h-full">
            {/** 报警信息处理情况 */}
            <div>
              {/** 标题 */}
              <div class="risk-card-title-md">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title cursor-pointer" onClick={() => { window.open("/internetMonitor/warn/agri-warning-record") }}>
                    报警信息处理情况
                  </div>
                </div>
              </div>
              {/** 内容 */}
              <div class="risk-card-content-md">
                <div class="w-full h-full box-border py-[13px] px-[15px]">
                  {/** 处理情况统计 */}
                  <div class="flex justify-between w-full h-[60px]">
                    {
                      warnHandleInfo.value.map(item => (
                        <div class="flex justify-between items-center cursor-pointer risk-deal-num" onClick={() => { window.open(`/internetMonitor/warn/agri-warning-record?warnStatus=${item.warnStatus}`) }}>
                          <div class="flex items-center">
                            <div class={`contain-img risk-deal-icon-${item.warnStatus}`}></div>
                            <div class="ml-[11px]">{item.label}</div>
                          </div>
                          <span class="notice-title">{item.value}</span>
                        </div>
                      ))
                    }
                  </div>
                  <ElTable
                    data={warnInfoHandleList.value}
                    class="mt-[10px] cursor-default"
                    height="321.5px"
                    headerCellStyle={dealTitle}
                    headerRowStyle={{backgroundColor: 'transparent'}}
                    cellStyle={dealContent}
                    rowStyle={{'background-color': 'transparent'}}
                    v-loading={warnInfoHandleLoading.value}
                    style="background-color: transparent"
                  >
                    <ElTableColumn label="预警信息" property="warnInfo"/>
                    <ElTableColumn label="预警时间" property="warnTime"/>
                    <ElTableColumn label="操作">
                      {
                        ({row}) => (
                          <div>
                            <button class="bg-transparent box-border w-[60px] h-[24px] text-[#11F47F] border border-solid border-[#11F47F] cursor-pointer rounded" onClick={() => { window.open(`/internetMonitor/warn/agri-warning-record?id=${row.id}&status=2`)}}>
                              忽略
                            </button>
                            <button class="bg-transparent box-border w-[60px] h-[24px] text-[#5CFFEF] border border-solid border-[#5CFFEF] cursor-pointer rounded ml-[5px]" onClick={() => { window.open(`/internetMonitor/warn/agri-warning-record?id=${row.id}`)}}>
                              去处理
                            </button>
                          </div>
                        )
                      }
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </div>
            {/** 农事智慧调度 */}
            <div class="mt-[15px]">
              {/** 标题 */}
              <div class="risk-card-title-md">
                <div class="flex items-center ml-[15px]">
                  <div class="notice-icon contain-img"></div>
                  <div class="art-font notice-title">农事智慧调度</div>
                </div>
              </div>
              {/** 内容 */}
              <div class="risk-card-content-md">
                <div class="w-full h-full p-[15px] box-border">
                  {/** 第一行按钮 */}
                  <div class="h-[26px] mb-[10px]">
                    <ElScrollbar>
                      <div class="flex w-fit">
                        {
                          farmTopList.value.map(item => (
                            <div class={`${item.id === selectedFarmTopId.value ? 'risk-schedule-item-active text-[#11F47F] mr-[10px]' : 'risk-schedule-item-normal mr-[10px]'} cursor-pointer flex items-center`} onClick={() => {
                                selectedFarmTopId.value = item.id
                                getCommandInfoList(selectedFarmTopId.value as any)
                              }}
                            >
                              <div class={`${item.icon} ml-[20px]`}></div>
                              <div class="ml-[8px]">{item.label}</div>
                            </div>
                          ))
                        }
                      </div>
                    </ElScrollbar>
                  </div>
                  {/** 表格 */}
                  <ElTable data={commandInfoList.value} v-loading={commandLoading.value} headerCellStyle={dealTitle} headerRowStyle={{backgroundColor: 'transparent'}} cellStyle={dealContent} rowStyle={{'background-color': 'transparent'}} height="351.5px" class="cursor-default" style="background-color: transparent;">
                    <ElTableColumn label="基地" property="parkName" width='200'/>
                    <ElTableColumn label="地块" property="plotName" />
                    <ElTableColumn label="上次执行时间" property="lastTime" />
                    <ElTableColumn label="计划执行时间" property="startTime" />
                    <ElTableColumn label="计划状态">
                      {
                        ({row}) => (
                          row.planState === '0' ? <span class="text-[#FF4545]">未开始</span> : row.planState === '1' ? <span class="text-[#F8CD01]">未开始</span> : '已结束'
                        )
                      }
                    </ElTableColumn>
                    <ElTableColumn label="操作">
                      {
                        ({row}) => (
                          row.planState === '2' ? null : 
                            <button class="bg-transparent box-border w-[60px] h-[24px] text-[#11F47F] border border-solid border-[#11F47F] cursor-pointer rounded" onClick={() => { window.open(`/farm_work/farmManage/farm-record/CreateOrUpdate?type=create&${generateUrlParams(row)}`) }}>
                              去处理
                            </button>
                        )
                      }
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 路由
    const router = useRouter()
    // 返回上一页
    const toLastPage = () => {
      router.go(-1)
    }
    // 跳到指定页
    const handleRoute = (path: string) => {
      router.push(path)
    }
    return () => (
      <div class="bg-[#112029] w-[100vw] h-[100vh]">
        <BigscreenAdapter>
          <BigscreenContainer backgroundImage={bgImage.value} key={bgImage.value}>
            <BigscreenHeader
              style="background-color: #112029;"
              backgroundImage={headerBg}
              v-slots={{
                left: () => (
                  <div class="h-[40px] mb-[20px] flex">
                      <button onClick={() => { toLastPage() }} class="bg-transparent border-none contain-img last-icon cursor-pointer"></button>
                      <button onClick={() => { handleRoute('/') }} class="bg-transparent border-none contain-img home-icon ml-[13px] cursor-pointer"></button>
                    {/** 
                    <BigscreenTab
                      v-model={activeTab.value}
                      options={[
                        {key: 'base', label: '基地导览'},
                        {key: 'plant', label: '智慧种植'},
                        {key: 'risk', label: '风险预警'}
                      ]}
                      onChange={handleTabChange}
                    />*/}
                    {/** 在请求监控设备列表或者监控通知事件的时候不允许点击其他Tab页 */}
                    {/*
                      monitorDeviceLoading.value || monitorNoticeLoading.value ? (
                        <div
                          class="absolute left-0 top-0 w-230px h-30px"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        ></div>
                      ) : null
                    */}
                  </div>
                ),
                right: () => (
                  <div class="mb-[20px] h-[40px]]">
                    <BigScreenTime style="color: #fff; margin-bottom: 20px;" />
                  </div>
                ),
                default: () => (
                  <div>
                    <div class="art-font text-[40px] tracking-[6px] relative cursor-default">
                      稻鱼鸭产业可视化数字驾驶舱
                      <div class={`${ activeTab.value === 'base' ? 'module-active-left' : 'module-normal-left'} absolute top-[-10px] left-[-245px] contain-img text-[18px] tracking-normal leading-[40px] text-center cursor-pointer`} onClick={()=>{ changeTab('base') }}>基地导览</div>
                      <div class={`${ activeTab.value === 'plant' ? 'module-active-left' : 'module-normal-left'} absolute top-[-10px] left-[-97px] contain-img text-[18px] tracking-normal leading-[40px] text-center cursor-pointer`} onClick={()=>{ changeTab('plant') }}>智慧种植</div>
                      <div class={`${ activeTab.value === 'risk' ? 'module-active-right' : 'module-normal-right'} absolute top-[-10px] right-[-97px] contain-img text-[18px] tracking-normal leading-[40px] text-center cursor-pointer`} onClick={()=>{ changeTab('risk') }}>风险预警</div>
                    </div>
                    {/** 在请求监控设备列表或者监控通知事件的时候不允许点击其他Tab页 */}
                    {
                      monitorDeviceLoading.value || monitorNoticeLoading.value ? (
                        <div
                          class="absolute left-[-490px] top-[-10px] w-[1920px] h-[40px]"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        ></div>
                      ) : null
                    }
                  </div>
                )
              }}
            ></BigscreenHeader>
            <BigscreenMain
              v-slots={{
                default: () => {
                  if (activeTab.value === 'base') return baseTabPage()
                  if (activeTab.value === 'plant') return plantTabPage()
                  if (activeTab.value === 'risk') return riskTabPage()
                }
              }}
            />
            <BigscreenFooter height="30px"/>
          </BigscreenContainer>
        </BigscreenAdapter>
      </div>
    )
  },
})

</script>
<style scoped lang="scss">
.inner-border {
  border: 1px solid #449ce9;
}

#growthChart, #harvestChart {
  height: 270px;
}

#preWarnLayoutChart, #bugCountChart {
  height: 400px;
}

.smart-plant-center {
  background-image: url(./assets/smartCenter.png);
  background-size: contain;
}

@for $i from 1 through 24 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% auto;
    width: 2rem;
    height: 2rem;
  }
}

.table-row {
  background-color: #b9b9b9;
}

.selected-farm-top {
  position: relative;

  &::after {
    position: absolute;
    bottom: -2px;
    width: 100%;
    height: .2rem;
    content: '';
    background-color: #00d3b6;
  }
}

.hidden-scrollbar::-webkit-scrollbar {
  width: 0;
}

/** 返回上一页 返回首页 */
.contain-img {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.last-icon {
  background-image: url(./assets/v2/last.png);
  width: 32px;
  height: 32px;
}
.home-icon {
  background-image: url(./assets/v2/home.png);
  width: 32px;
  height: 32px;
}

/** 模块图标 */
.module-normal-left {
  background-image: url(./assets/v2/module-normal-left.png);
  width: 168px;
  height: 40px;
}
.module-active-left {
  background-image: url(./assets/v2/module-active-left.png);
  width: 168px;
  height: 40px;
}
.module-normal-right {
  background-image: url(./assets/v2/module-normal-right.png);
  width: 168px;
  height: 40px;
}
.module-active-right {
  background-image: url(./assets/v2/module-active-right.png);
  width: 168px;
  height: 40px;
}

/** 基地导览部分 */
/** 左侧基地列表 */
.base-list-bg {
  background-image: url(./assets/v2/base-list-bg.png);
  background-size: 100% 100%;
}
// 调整下拉菜单箭头位置到左侧
:deep(.el-sub-menu .el-sub-menu__icon-arrow) {
  right: 140px;
}
// 调整下拉菜单的左右内距
:deep(.el-menu:not(.el-menu--collapse) .el-sub-menu__title) {
  padding-right: 20px;
}
:deep(.el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-sub-menu__title) {
  padding-left: 40px;
}
// 调整菜单项的左内距
:deep(.el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item) {
  padding-left: 60px;
}
// 菜单项悬停和被选中的样式
:deep(.el-menu-item:hover) {
  background-image: url(./assets/v2/menuitem-active.png);
  background-size: 100% 100%;
  color: #5AFFAA;
}
:deep(.el-menu-item.is-active) {
  background-image: url(./assets/v2/menuitem-active.png);
  background-size: 100% 100%;
  color: #5AFFAA;
}

/** 中间监控视频 */
.monitor-bg {
  background-image: url(./assets/v2/monitor-bg.png);
  background-size: 100% 100%;
}
.video-bg {
  background-image: url(./assets/v2/video-bg.png);
  background-size: 100% 100%;
  position: relative;
}
.base-name {
  width: 100%;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background: linear-gradient(180deg, #FFFFFF 18%, #5CFFAB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-size: 16px;
}
.device-status-bg {
  background-image: url(./assets/v2/device-status-bg.png);
  background-size: 100% 100%;
  width: 60px;
  height: 18px;
}
.device-online {
  background: {
    image: url(./assets/v2/device-status-online.png);
    position: 3px;
    repeat: no-repeat;
    size: contain;
  }
  width: 17px;
  height: 14px;
}
.device-offline {
  background: {
    image: url(./assets/v2/device-status-offline.png);
    position: 3px;
    repeat: no-repeat;
    size: contain;
  }
  width: 17px;
  height: 14px;
}

/** 右侧通知事件 */
.btn-date {
  background: linear-gradient(180deg, #11EAC9 0%, #11F47F 100%);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.notice-bg {
  background-image: url(./assets/v2/notice-bg.png);
  background-size: 100% 100%;
}
.notice-title {
  background: linear-gradient(180deg, #FFFFFF 18%, #5CFFAB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-size: 24px;
  height: 31px;
  line-height: 31px;
  width: fit-content;
}
.notice-icon {
  background-image: url(./assets/v2/notice-icon.png);
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.event-item {
  background-image: url(./assets/v2/event-bg.png);
  background-size: 100% 100%;
  width: 370px;
  height: 90px;
  margin-bottom: 10px;
}
:deep(.el-input__wrapper) {
  background-color: #0B2729;
}
:deep(.el-input__wrapper) {
  box-shadow: none;
}
:deep(.el-date-editor.el-input__wrapper) {
  box-shadow: none;
}
:deep(.el-pagination.is-background .btn-prev:disabled) {
  background: linear-gradient(180deg, rgba(17, 234, 201, 0.2) 0%, rgba(17, 244, 127, 0.2) 100%);
}
:deep(.el-pagination.is-background .btn-prev) {
  background: linear-gradient(180deg, rgba(17, 234, 201, 0.2) 0%, rgba(17, 244, 127, 0.2) 100%);
}
:deep(.el-pagination.is-background .btn-next:disabled) {
  background: linear-gradient(180deg, rgba(17, 234, 201, 0.2) 0%, rgba(17, 244, 127, 0.2) 100%);
}
:deep(.el-pagination.is-background .btn-next) {
  background: linear-gradient(180deg, rgba(17, 234, 201, 0.2) 0%, rgba(17, 244, 127, 0.2) 100%);
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background: linear-gradient(180deg, #11EAC9 0%, #11F47F 100%);
}
:deep(.el-pagination.is-background .el-pager li) {
  background-color: transparent;
}

/** 智慧种植部分 */
// 卡片
.plant-card-title {
  background: {
    image: url(./assets/v2/plant-card-title-bg.png);
    size: 100% 100%;
  }
  width: 420px;
  height: 40px;
}
.plant-card-title-wide {
  background: {
    image: url(./assets/v2/plant-card-title-bg-wide.png);
    size: 100% 100%;
  }
  width: 1010px;
  height: 40px;
}
.plant-card-content {
  background: {
    image: url(./assets/v2/plant-card-content-bg.png);
    size: 100% 100%;
  }
  width: 420px;
  height: 260px;
  margin-top: 10px;
}
.plant-card-content-small {
  background: {
    image: url(./assets/v2/plant-card-content-bg-small.png);
    size: 100% 100%;
  }
  width: 420px;
  height: 228px;
  margin-top: 10px;
}
.plant-card-content-high {
  background: {
    image: url(./assets/v2/plant-card-content-bg-high.png);
    size: 100% 100%;
  }
  width: 420px;
  height: 617px;
  margin-top: 10px;
}
.plant-card-content-wide {
  background: {
    image: url(./assets/v2/plant-card-content-bg-wide.png);
    size: 100% 100%;
  }
  width: 1010px;
  height: 260px;
  margin-top: 10px;
}
// 基础设施
.base-device-item {
  background: {
    image: url(./assets/v2/base-device-item-bg.png);
    size: 100% 100%;
  }
  width: 185px;
  height: 45px;
}
// 设备统计
.device-bg {
  background-size: 100% 100%;
  width: 215px;
  height: 60px;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 18px;
}
.device-total-bg {
  background-image: url(./assets/v2/device-total-bg.png);
}
.device-online-bg {
  background-image: url(./assets/v2/device-online-bg.png);
}
.device-offline-bg {
  background-image: url(./assets/v2/device-offline-bg.png);
}
.device-error-bg {
  background-image: url(./assets/v2/device-error-bg.png);
}
.device-icon {
  background: {
    size: contain;
    position: center;
    repeat: no-repeat;
  }
  width: 38px;
  height: 38px;
}
.device-total-icon {
  background-image: url(./assets/v2/device-total-icon.png);
}
.device-online-icon {
  background-image: url(./assets/v2/device-online-icon.png);
}
.device-offline-icon {
  background-image: url(./assets/v2/device-offline-icon.png);
}
.device-error-icon {
  background-image: url(./assets/v2/device-error-icon.png);
}
// 打造特色产品
.product-item {
  background: {
    image: url(./assets/v2/product-item-bg.png);
    size: 100% 100%;
  }
  width: 482px;
  height: 220px;
  box-sizing: border-box;
  padding: 24px 27px;
}
.product-item-detail-bg {
  background: {
    image: url(./assets/v2/product-item-detail-bg.png);
    size: contain;
    position: bottom;
    repeat: no-repeat;
  }
}
// 物联网设备
.iot-total {
  background: {
    image: url(./assets/v2/IOT-total-bg.png);
    size: 100% 100%;
  }
  width: 390px;
  height: 34px;
}
.iot-item {
  background: {
    image: url(./assets/v2/IOT-item-bg.png);
    size: 100% 100%;
  }
  width: 390px;
  height: 80px;
  box-sizing: border-box;
  padding: 10px 14px;
  margin-top: 6px;
}
// 实时监测
.real-time-item {
  background: {
    image: url(./assets/v2/real-time-item-bg.png);
    size: 100% 100%;
  }
  width: 92px;
  height: 80px;
  box-sizing: border-box;
  padding: {
    top: 5px;
    bottom: 5px;
  }
}
@for $i from 1 through 32 {
  .iconv2-#{$i} {
    background: {
      image: url(./assets/v2/icon#{$i}.png);
      size: contain;
      position: center;
      repeat: no-repeat;
    }
    height: 32px;
    width: 32px;
  }
}
.real-time-item-value {
  background: linear-gradient(180deg, #FFFFFF 50%, #8FFFC5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

/** 风险预警部分 */
// 卡片的标题和内容
.risk-card-title-lg {
  background: {
    image: url(./assets/v2/risk-card-title-lg.png);
    size: 100% 100%;
  }
  width: 1165px;
  height: 40px;
}
.risk-card-title-md {
  background: {
    image: url(./assets/v2/risk-card-title-md.png);
    size: 100% 100%;
  }
  width: 700px;
  height: 40px;
}
.risk-card-title-sm {
  background: {
    image: url(./assets/v2/risk-card-title-sm.png);
    size: 100% 100%;
  }
  width: 575px;
  height: 40px;
}
.risk-card-content-lg {
  background: {
    image: url(./assets/v2/risk-card-content-lg.png);
    size: 100% 100%;
  }
  width: 1165px;
  height: 417.5px;
  margin-top: 10px;
}
.risk-card-content-md {
  background: {
    image: url(./assets/v2/risk-card-content-md.png);
    size: 100% 100%;
  }
  width: 700px;
  height: 417.5px;
  margin-top: 10px;
}
.risk-card-content-sm {
  background: {
    image: url(./assets/v2/risk-card-content-sm.png);
    size: 100% 100%;
  }
  width: 575px;
  height: 417.5px;
  margin-top: 10px;
}
// 预警信息
.risk-warn-info-icon {
  background-image: url(./assets/v2/risk-warn-info-icon.png);
  width: 27px;
  height: 27px;
}
// 去掉表格最下边框
:deep(.el-table__inner-wrapper::before) {
  display: none;
}
// 去掉表格内的下边框
:deep(.el-table td.el-table__cell) {
  border: none;
}
// 去掉表头下边框
:deep(.el-table th.el-table__cell.is-leaf) {
  border: none;
}
// 报警信息处理情况
.risk-deal-num {
  background: {
    image: url(./assets/v2/risk-deal-num-bg.png);
    size: 100% 100%;
  }
  width: 215px;
  height: 60px;
  box-sizing: border-box;
  padding: {
    left: 10px;
    right: 20px;
  }
}
@for $i from 0 through 2 {
  .risk-deal-icon-#{$i} {
    background-image: url(./assets/v2/risk-deal-icon-#{$i}.png);
    width: 38px;
    height: 38px;
  }
}
// 预警分布
.distribution-label {
  background: {
    image: url(./assets/v2/distribution-label-bg.png);
    size: 100% 100%;
  }
  width: 140px;
  height: 140px;
}
.distribution-text {
  background: linear-gradient(180deg, #1DA6FF 0%, #97D6FF 60%, #FFFFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
// 农事智慧调度 
@for $i from 19 through 33 {
  .icon-schedule-#{$i} {
    background-image: url(./assets/v2/icon-schedule-#{$i}.png);
    width: 12px;
    height: 12px;
  }
}
.risk-schedule-item-normal {
  width: 100px;
  height: 26px;
  background: {
    image: url(./assets/v2/risk-schedule-item-normal.png);
    size: 100% 100%;
  }
}
.risk-schedule-item-active {
  width: 100px;
  height: 26px;
  background: {
    image: url(./assets/v2/risk-schedule-item-active.png);
    size: 100% 100%;
  }
}
:deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
  background-color: rgba(17, 244, 127, 0.15);
}
</style>
