<script setup lang="ts">
// Import Swiper Vue.js components
import {
  distinct,
  selectMap,
  page,
  filePage,
  selectHelp,
  selectHelpPage,
  selectCountysPage,
  selectImg
} from './api'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import noImg from './assets/new/noImg.png'
import type { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'
import { jsonData } from './assets/chongqing'
import meassageBg from './assets/meassageBg.png'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, FreeMode, Pagination, Navigation } from 'swiper/modules';
// import required modules
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { generateUUID } from '@/utils';

const router = useRouter()

const modules = [FreeMode, Pagination]

const distincDataMap = new Map<string, any>()
const getDistinctData = async (type:string) => {
  const cacheItem = distincDataMap.get(type)
  if (cacheItem) return Promise.resolve(cacheItem)
  const res = await distinct({ type })
  if (Array.isArray(res)) {
    distincDataMap.set(type, res);
    return Promise.resolve(res)
  } else Promise.reject()
}

// 示范村ref
const buildRef = ref()
const handleTurn = (val) => {
  return;
}

// 示范村建设
const countryBuildData = ref<any[]>([])
const getCountryBuildData = async () => {
  const param = { pageNo: 1, pageSize: 50 }
  const res2022 = await page({ ...param, years: '2022' })
  const res2023 = await page({ ...param, years: '2023' })
  const res2024 = await page({ ...param, years: '2024' })
  const res2025 = await page({ ...param, years: '2025' })
  const formatData = (item:any[]) => {
    const villageNum = [...new Set([...item.map(ele => ele.village)])].length;
    const areaNum = [...new Set([...item.map(ele => ele.county)])].length; // 区县
    const formNum = [...new Set([...item.map(ele => ele.form)])].length; // 产业类型
    const industryTypeNum = [...new Set([...item.map(ele => ele.industryType)])].length; // 产业形态
    return { villageNum, areaNum, formNum, industryTypeNum }
  }
  
  countryBuildData.value = [
    { id: '1', year: '2022', ...formatData(res2022.list) },
    { id: '2', year: '2023', ...formatData(res2023.list) },
    { id: '3', year: '2024', ...formatData(res2024.list) },
    { id: '4', year: '2025', ...formatData(res2025.list) }
  ]
}
getCountryBuildData()
  
const selectedCardId = ref<string>('1')
const cardDataList = ref<any[]>([])
const getCardDataList = async () => {
  const res1 = await getDistinctData('1')
  const res2 = await getDistinctData('2')
  const res3 = await getDistinctData('3')
  const res4 = await getDistinctData('4')
  cardDataList.value = [
    {
      id: '1',
      label: '示范村',
      value: res2.length,
      desc: '基于自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
    },
    {
      id: '2',
      label: '帮扶区县',
      value: res1.length,
      desc: '基于自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
    },
    {
      id: '3',
      label: '精准帮扶基地',
      value: res3.length,
      desc: '基于自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
    },
    {
      id: '4',
      label: '产业形态',
      value: res4.length,
      desc: '基于自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
    }
  ]
}
getCardDataList()

/****************************** 示范村数据 start ******************************/
const yrList = ref([2022, 2023, 2024])
const vlgData = ref<Array<any>>([{}, {}, {}])
const options = ref<Array<any>>([[], [], []])
const county = ref<Array<any>>(['全部', '全部', '全部'])

const getVlgDataFirst = () => {
  vlgData.value = [{}, {}, {}]
  options.value = [[], [], []]
  yrList.value.forEach(async (ele, idx) => {
    let param = { pageNo: 1, pageSize: 100, county: '', years: ele }
    let res = await page(param)
    vlgData.value[idx] = res
    let list : Array<any> = []
    res.list.forEach((elmt) => {
      list.push(elmt.county)
    })
    options.value[idx] = Array.from(new Set(list))
    // console.log(`读取${ele}年示范村数据: `, res, Array.from(new Set(list)))
  })
}
getVlgDataFirst()

// 下拉框切换
const selectChange = async (idx) => {
  let res = await page({
    pageNo: 1,
    pageSize: 100,
    county: county.value[idx] == '全部' ? '' : county.value[idx],
    years: yrList.value[idx]
  })
  vlgData.value[idx] = res
  // console.log("当前选择的地区数组: ", county.value)
}

// 点击表格中某一行的处理
const toBigScreen = (row) => {
  console.log('被点击了 ', row)
  if (row.bigscreen) { 
    window.open(row.bigscreen)
  } else {
    console.log(`示范村数据表格, 区县: ${row.county}, ID: ${row.id}, 没有对应的大屏地址`)
  }
}
/****************************** 示范村数据 end ******************************/

const showHeader = ref<boolean>(true)
const checkScroll = () => {
  const dom = document.getElementById('homeContainer')
  if (dom)
    dom.addEventListener('scroll', () => {
      showHeader.value = !(dom.scrollTop > 1000)
    })
}
onMounted(() => {
  checkScroll()

  // 加载地图
  initChinaMap()
})

const footerData = ref<any[]>([
  {
    id: '1',
    label: '成功案例',
    children: [
      {
        id: '1-1',
        label: '隘口镇山银花产业数字化赋能'
      },
      {
        id: '1-2',
        label: '白帝镇农文旅产业数字化赋能'
      },
      {
        id: '1-3',
        label: '奉节县鲁渝协作乡村振兴服务大屏'
      },
      {
        id: '1-4',
        label: '稻鱼鸭产业可视化数字驾驶舱'
      }
    ]
  },
  {
    id: '2',
    label: '帮扶基地',
    children: [
      {
        id: '2-1',
        label: '巫山县福田镇双凤村清露茶叶基地'
      },
      {
        id: '2-2',
        label: '秀山县梅江镇兴隆坳现代茶叶农业园'
      },
      {
        id: '2-3',
        label: '奉节县鹤峰乡青杠村百果园'
      },
      {
        id: '2-4',
        label: '开州区临江镇明月村柑橘园'
      }
    ]
  },
  {
    id: '3',
    label: '政府政策',
    children: [
      {
        id: '3-1',
        label: '党中央国务院政策'
      },
      {
        id: '3-2',
        label: '部委'
      },
      {
        id: '3-3',
        label: '市委市政府'
      },
      {
        id: '3-4',
        label: '市级部门'
      }
    ]
  },
  {
    id: '4',
    label: 'SAAS平台',
    children: [
      {
        id: '4-1',
        label: '乡村振兴平台'
      },
      {
        id: '4-2',
        label: '数商兴农平台'
      },
      {
        id: '4-3',
        label: '乡村服务平台'
      },
      {
        id: '4-4',
        label: '数字化赋能平台'
      }
    ]
  }
])

// 政府政策
const govPolicyDataList = ref<any[]>([
  {
    id: '1',
    title: '中共重庆市委、重庆市人民政府印发 《重庆市建设深化集体…',
    content:
      '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  },
  {
    id: '2',
    title: '关于学习运用“千村示范、万村整治”工程经验加快建设巴渝…',
    content:
      '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  },
  {
    id: '3',
    title: '重庆市人民政府办公厅印发《关于推进生产供销信用“三位一…',
    content:
      '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  },
  {
    id: '4',
    title: '开展国际农业合作 共享农业发展机遇：镜头里的共建“一带一路”',
    content:
      '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  }
])
const getGovPolicyDataList = async () => {
  const { list = [] } = await filePage({ pageNo: 1, pageSize: 4 });
  console.log("🚀 ~ getGovPolicyDataList ~ res:", list)
  if (!Array.isArray(list)) return;
  govPolicyDataList.value = list.map(item => ({
    ...item, year: dayjs(item.upTime).year(), date: dayjs(item.upTime).format("MM-DD")
  }))
}
getGovPolicyDataList()

// 帮扶产业数据
const supportIndustries = ref<any[]>([
  { id: '2', label: '柑橘', content: '开州区竹溪县灵泉村好耍竹溪园', img: 'product-2' },
  { id: '3', label: '四鼻鲤鱼', content: '万州区长滩镇龙泉社区四鼻鲤鱼养殖中心', img: 'product-3' },
  { id: '4', label: '翡翠梨', content: '武隆区芙蓉街道堰塘村田园综合体', img: 'product-4' },
  { id: '5', label: '黄精', content: '石柱县中益乡华溪村中药材基地', img: 'product-5' },
  { id: '6', label: '布福娜', content: '', img: 'product-6' },
  { id: '7', label: '梨子', content: '', img: 'product-7' },
  { id: '8', label: '西红柿', content: '', img: 'product-8' },
  { id: '9', label: '脆李', content: '', img: 'product-9' },
  { id: '10', label: '玉米', content: '', img: 'product-10' },
  { id: '11', label: '葡萄', content: '', img: 'product-11' },
  { id: '12', label: '草莓', content: '', img: 'product-12' },
  { id: '13', label: '梨子', content: '', img: 'product-13' },
  { id: '14', label: '奉节脐橙', content: '', img: 'product-14' },
  { id: '15', label: '水产养殖', content: '', img: 'product-15' },
  { id: '16', label: '枇杷', content: '', img: 'product-16' },
])
const getSupportIndustriesData = async () => {
  const { list = [] } = await selectHelpPage({ pageNo: 1, pageSize: 20 });
  console.log("🚀 ~ getSupportIndustriesData ~ res:", list)
  if (!Array.isArray(list)) return;
  supportIndustries.value = list.map((item, index) => ({
    id: index, label: item.industry, content: item.park, img: item.industryImg
  }))
}
getSupportIndustriesData()

/****************************** 第二页地图 start ******************************/

const mapDataList = ref<Array<any>>([])
const nameDataMap = new Map()
const mapTipShow = ref(false)
const mapTipData = ref()

const initChinaMap = async () => {
  // 获取高亮地区列表并封装成ECharts用的形式
  mapDataList.value = await getDistinctData('1')
  let highlightList = mapDataList.value.map(item => ({
    name: item.name, value: 2000, selected: false
  }))
  // console.log("高亮地区: ", mapDataList.value)
  // console.log("高亮地区数据ECharts用: ", highlightList)

  // 准备ECharts地图tooltip数据，并修改highlighList中的名称
  const nameArr = jsonData.features.map((item) => item.properties.name)
  nameArr.forEach((item) => {
    selectMap({ county: item }).then((res) => {
      nameDataMap.set(item, res)
    })
  })
  const fixData = () => {
    highlightList = highlightList.map(_item => {
      const _parseData = JSON.parse(JSON.stringify(_item))
      nameArr.forEach(_name => {
        const text1 = _name.substring(0, 2)
        const text2 = _parseData.name.substring(0, 2)
        if (text1 === text2) _parseData.name = _name
      })
      return _parseData
    })
  }
  fixData()
  // console.log("地区名称列表: ", nameArr)
  // console.log("修改后的高亮地区数据: ", highlightList)
  // console.log("全部地区数据: ", nameDataMap)

  // 注册重庆市地图并渲染
  echarts.registerMap('chongqing', jsonData as GeoJSONSourceInput)
  const chartDom = document.getElementById('mapChart')
  const myChart = echarts.init(chartDom)
  myChart.setOption(
    {
      dataRange: { // 不显示面板 且 全选series.data并设置背景色
        show: false,
        splitList: [
          { start: 2000, end: 2000, color: '#2A8941' }
        ]
      },
      series: [
        {
          type: 'map',
          map: 'chongqing',
          zoom: 1.2,
          roam: false,
          aspectScale: 1.06,
          data: highlightList,
          itemStyle: {
            borderColor: '#81EEAD',
            borderWidth: 2,
            areaColor: 'transparent',
          },
          label: {
            show: true,
            color: '#ffffff',
            fontSize: 16,
            lineHeight: 20,
            width: 80,
            overflow: 'break',
            formatter: (item) => { // labelMap里的在地图上不显示文字 '璧山区'垂直显示
              const _name = item.name
              const labelMap = [
                "九龙坡区",
                "大渡口区",
                "渝中区",
                "沙坪坝区",
                "江北区",
                "南岸区"
              ]
              return labelMap.indexOf(_name) !== -1 ? '' : '璧山区' === _name ? _name.split("").join('\n') : _name
            }
          },
          emphasis: { // focus的样式
            itemStyle: {
              areaColor: '#2A8941',
              shadowColor: 'rgba(72, 255, 150, 0.6)',
              shadowBlur: 20,
            },
            label: {
              color: '#fff'
            }
          },
          select: { // click的样式
            itemStyle: {
              areaColor: '#2A8941',
              shadowColor: 'rgba(72, 255, 150, 0.6)',
              shadowBlur: 20,
            },
            label: {
              color: '#fff'
            }
          },
        }
      ],
      /* 如果需要在地图中显示，则使用这种tooltip方式
      tooltip: {
        show: true,
        trigger: 'item',
        enterable: true, // 鼠标是否可进入提示框浮层中，默认为false，
        showContent: true, // 是否显示提示框浮层
        triggerOn: 'click', // 提示框触发的条件(mousemove|click|none)
        padding: [0, 0], // 提示框浮层内边距，单位px
        backgroundColor: 'none', // 提示框浮层的背景颜色,
        borderWidth: 0, // 提示框边框,
        position: [517, 117],
        formatter: function (params) {
          const mapData: any = nameDataMap[params.name]
          // console.log('mapData', mapData)
          if (!mapData[0].data || mapData[0].data.length === 0) return '<div></div>'
          let str = ``
          let div=`
          ${
            mapData[0].data ? mapData[0].data.map(item=>{
              return `
              <div class='mt--5px'>
                <div class="color-[#fafafa] z-9999 my-8px text-sm">帮扶城市：${mapData[0]?.city}</div>
                <div class="color-[#fafafa] text-sm">${item.years}年示范村：<a href="${item.bigscreen}" target="_blank" style="color: white;text-decoration: none;">${item.village}</a></div>
              </div>
              `
            }) : ''
          }`
          if (mapData.length == 0) {
            str = ''
          } else {
            str = `<div class=" relative p-[20px]">
                  <img src="${meassageBg}" class="absolute z--1 left-0 top-0 w-100% bg-none h-100% "/>
                  <div class="text-lg color-[#04c2c2] z-9999 " style="font-weight:700;">${mapData[0]?.county}</div>
                  ${div}

                  </div>`
          }
          return str
        },
        rich: {
          img: {
            backgroundColor: {
              image: './assets/meassageBg.png'
            },
            width: 100,
            height: 100,
            align: 'center'
          }
        }
      },
      */
    },
    true
  )

  // 点击地图空白的处理 空白时没有params.target
  myChart.getZr().on('click', (params) => {
    if (!params.target) {
      mapTipShow.value = false
      mapTipData.value = null
      myChart.dispatchAction({
        type: 'unselect',
        name: nameArr
      })
    }
  })

  // 检查mapTipData是否合法
  const checkMapTipData = (obj) => {
    if (!Object.keys(obj).length) return false
    if (!obj.data || !Array.isArray(obj.data) || obj.data.length === 0) return false
    obj.data.forEach((ele) => {
      if (!ele.years || !ele.village || !ele.bigscreen) {
        return false
      }
    })
    return true
  }

  // 设置从地图到提示框的三角形效果
  const setMapToTip = (x, y) => {
    const tipDom = document.getElementById('mapToTip')
    const mapConDom = document.getElementById('mapContainer')
    if (tipDom && mapConDom) {
      const conWidth = mapConDom.offsetWidth
      const conHeight = mapConDom.offsetHeight
      const fullVH = window.innerHeight
      let remainWidth
      if (fullVH < 920) {
        remainWidth = conWidth - 1.06 * fullVH
      } else {
        remainWidth = conWidth - 1.06 * 975
      }
      let pointOverTip = [0, 0.61 * conHeight - 76.8 - 0.06 * conHeight]
      let pointUnderTip = [0, conHeight - 76.8 + 0.06 * conHeight]
      let pointMap = [remainWidth + x - 32, y]
      let height
      let top
      let pointOverTipInner
      let pointUnderTipInner
      let pointMapInner
      if (pointMap[1] <= pointOverTip[1]) { // 地图上的点高于提示框上方的点
        pointOverTip = [32 + 0.8 * remainWidth - 0.06 * conHeight, 0.61 * conHeight - 76.8 - 0.06 * conHeight]
        pointUnderTip = [32 + 0.8 * remainWidth + 0.18 * conHeight, conHeight - 76.8 + 0.06 * conHeight]
        height = pointUnderTip[1] - pointMap[1]
        top = pointMap[1]
        pointOverTipInner = `0% ${pointOverTip[1] - pointMap[1]}px`
        pointUnderTipInner = `${0.18 * conHeight}px 100%`
        pointMapInner = `100% 0%`
      } else if (pointMap[1] >= pointUnderTip[1]) { // 地图上的点低于提示框下方的点
        pointOverTip = [32 + 0.8 * remainWidth - 0.18 * conHeight, 0.61 * conHeight - 76.8 - 0.06 * conHeight]
        pointUnderTip = [32 + 0.8 * remainWidth + 0.06 * conHeight, conHeight - 76.8 + 0.06 * conHeight]
        height = pointMap[1] - pointOverTip[1]
        top = pointOverTip[1]
        pointOverTipInner = `${0.18 * conHeight}px 0%`
        pointUnderTipInner = `${0.06 * conHeight}px 100%`
        pointMapInner = `100% 100%`
      } else { // 地图上的点位于提示框上下两点之间
        pointOverTip = [32 + 0.8 * remainWidth - 0.06 * conHeight, 0.61 * conHeight - 76.8 - 0.06 * conHeight]
        pointUnderTip = [32 + 0.8 * remainWidth + 0.06 * conHeight, conHeight - 76.8 + 0.06 * conHeight]
        height = pointUnderTip[1] - pointOverTip[1]
        top = pointOverTip[1]
        pointOverTipInner = `0% 0%`
        pointUnderTipInner = `0% ${pointUnderTip[1] - pointOverTip[1]}px`
        pointMapInner = `100% ${pointMap[1] - pointOverTip[1]}px`
      }
      let left = pointOverTip[0]
      let width = pointMap[0] - pointOverTip[0]
      tipDom.style.width = `${width}px`
      tipDom.style.height = `${height}px`
      tipDom.style.top = `${top}px`
      tipDom.style.left = `${left}px`
      tipDom.style.clipPath = `polygon(${pointOverTipInner}, ${pointUnderTipInner}, ${pointMapInner})`
    }
  }
  
  // 点在地图上的处理
  myChart.on('click', (params) => {
    // console.log('ECharts点击事件参数: ', params)
    mapTipShow.value = false
    mapTipData.value = null
    if (!params.event) return
    const x = params.event.offsetX
    const y = params.event.offsetY
    let key = params.name
    if (nameDataMap.has(key) && checkMapTipData(nameDataMap.get(key)[0])) { 
      mapTipData.value = nameDataMap.get(key)[0]
      mapTipShow.value = true
      setMapToTip(x, y)
    }
    // console.log('点击地图后的mapTipData, mapTipShow: ', mapTipData.value, mapTipShow.value)
  })

  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
/****************************** 第二页地图 end ******************************/

// 对口帮扶地域
const helpAreaData = ref<any[]>([
  { id: '1', from: '潍坊市', to: '开州区' },
  { id: '2', from: '济宁市', to: '万州区' },
  { id: '3', from: '济南市', to: '武隆区' },
  { id: '4', from: '淄博市', to: '石柱县' },
  { id: '5', from: '聊城市', to: '彭水县' },
  { id: '6', from: '烟台市', to: '巫山县' },
  { id: '7', from: '威海市', to: '云阳县' },
  { id: '8', from: '滨州市', to: '奉节县' },
  { id: '9', from: '泰安市', to: '巫溪县' },
  { id: '10', from: '德州市', to: '秀山县' },
  { id: '11', from: '东营市', to: '酉阳县' },
  { id: '12', from: '日照市', to: '黔江区' },
  { id: '13', from: '枣庄市', to: '丰都县' },
  { id: '14', from: '临沂市', to: '城口区' },
])
const getHelpAreaData = async () => {
  const res = await selectHelp({ type: '1' })
  console.log("🚀 ~ getHelpAreaData ~ res:", res)
  if (Array.isArray(res)) helpAreaData.value = res.map((item, index) => ({
    id: index, from: item.city, to: item.county
  }))
}
getHelpAreaData()

//解决案例
const swiperInstance=ref(null)

const onSwiper = (swiper)=>{
  swiperInstance.value = swiper
}

const handleSwiperMouseEnter=()=>{
// if (swiperInstance) {
//   console.log('Swiper 实例已创建');
// } else {
//   console.log('Swiper 实例尚未创建');
// }

// if (swiperInstance.value.autoplay) {
//   console.log('Autoplay 已初始化');
// } else {
//   console.log('Autoplay 尚未初始化');
// }
  swiperInstance.value?.autoplay.stop();
  // console.log("🚀 ~ handleSwiperMouseEnter ~ swiperInstance.value?.autoplay:", swiperInstance.value?.autoplay)
  
}
  
const handleSwiperMouseLeave=()=>{
  swiperInstance.value?.autoplay.start();
  // console.log("🚀 ~ handleSwiperMouseLeave ~ swiperInstance.value?.autoplay:", swiperInstance.value?.autoplay)
}


//打造产业
const selectedIndustry = ref<string>('')
const industriesTree = ref<any[]>([])
const buildIndustriesTree = (data) => {
  const resArr:any[] = []
  Object.keys(data).forEach(firstItem => {
    resArr.push({
      id: generateUUID(),
      label: firstItem,
      children: Object.keys(data[firstItem]).map(secItem => {
        return {
          id: generateUUID(),
          label: secItem,
          children: data[firstItem][secItem].map(thirItem => ({
            ...thirItem, bigscreenImg: thirItem.bigscreenImg ?? noImg
          }))
        }
      })
    })
  })
  return resArr
}

const selectedSecIndustry = ref<any>({})
const selectedSecItem = ref<any>('')
//点击左侧一级产业
const handleFirstItemClick = (item) => {
  selectedIndustry.value = item.id;
  selectedSecIndustry.value = item;
  if (Array.isArray(item.children) && item.children.length > 0) {
    selectedSecItem.value = item.children[0]
    if (Array.isArray(selectedSecItem.value.children) && selectedSecItem.value.children.length > 0) {
      selectedThirItem.value = selectedSecItem.value.children[0]
    }
  }
}

const selectedThirItem = ref<any>()
//点击右侧切换二级产业
const handleNextItem = (val) => {
  const firstItem = industriesTree.value.find(item => (item.id === selectedIndustry.value));
  if (!firstItem) return;
  const _children:any[] = firstItem.children;
  const secItemIndex = _children.findIndex(item => (item.id === selectedSecItem.value.id))
  if(val>0){
      if (secItemIndex + 1 < _children.length) selectedSecItem.value = _children[secItemIndex + 1]
      else selectedSecItem.value = _children[0]
  }
  else{
    if(secItemIndex !== 0) selectedSecItem.value = _children[secItemIndex - 1]
    else selectedSecItem.value = _children[_children.length-1]
  }
  if (Array.isArray(selectedSecItem.value.children) && selectedSecItem.value.children.length > 0) {
    selectedThirItem.value = selectedSecItem.value.children[0]
  }
}

// 大屏图片按钮
const offsetPer = ref<number>(100)
const handleImgChange = (val) => {
  if (!Array.isArray(selectedSecItem.value.children)) return;
  if (!selectedThirItem.value?.bigscreen) return;
  
  const selectedImgIndex = selectedSecItem.value.children.findIndex(item => (item.bigscreen === selectedThirItem.value.bigscreen))

  // if(!selectedThirItem.value?.bigscreenImg) selectedThirItem.value.bigscreenImg = './assets/new/noImg.png'
  if (selectedImgIndex === -1) return;
  if (val > 0 && selectedImgIndex + 1 < selectedSecItem.value.children.length) {
    selectedThirItem.value = selectedSecItem.value.children[selectedImgIndex + 1]
    offsetPer.value = 100 - ((selectedImgIndex + 1) * 100 / (selectedSecItem.value.children.length-1))
  }
  if (val < 0 && selectedImgIndex !== 0) {
    selectedThirItem.value = selectedSecItem.value.children[selectedImgIndex - 1]
    offsetPer.value = 100 - ((selectedImgIndex - 1) * 100 / (selectedSecItem.value.children.length-1))
  }

}


const handlePageJump = () =>{
  if (!selectedThirItem.value?.bigscreen) return;
  window.open(selectedThirItem.value.bigscreen, '_blank');
}
  

//获得产业数据
const getSelectImg = async () => {
  const res = await selectImg().catch(() => {});
  industriesTree.value = buildIndustriesTree(res)
  console.log("🚀 ~ getSelectImg ~ industriesTree.value:", industriesTree.value)
  
  if (industriesTree.value.length > 0) {
    handleFirstItemClick(industriesTree.value[0])
  }
}
  
getSelectImg()

const btnAction = ref<boolean>(false)

const activePoster = ref<number>(1)
const enablePosterScroll = () => {
  setInterval(() => {
    if (activePoster.value === 3) return activePoster.value = 1;
    activePoster.value++
  }, 5000)
}
onMounted(() => { enablePosterScroll() })
</script>
<template>
  <div class="w-full box-border relative overflow-y-auto h-100vh" id="homeContainer">
    <div
      :class="`fixed left-0 z-100 w-full flex justify-center transition-all duration-1000 box-border ${
        showHeader ? 'top-0' : 'top-[-100%]'
      }`"
    >
      <div class="container flex items-center p-5 space-x-1rem">
        <div class="icon w-2.4rem h-2.4rem"></div>
        <div class="text-white">
          <div class="text-1.4rem">鲁渝协作乡村振兴示范村数字化赋能工程</div>
          <div class="text-.8rem relative left-.3rem text-[#f1f1f1c0]"
            >Lu Yu Collaborative Rural Revitalization Village Digital Empowerment Project</div
          >
        </div>
      </div>
    </div>
    <div :class="`w-full flex justify-center items-center h-100vh text-white`">
      <div class="absolute left-0 top-0 w-full h-full z-0">
        <swiper
          :modules="[Autoplay]"
          :loop="true"
          :autoplay="{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }"
          :speed="500"
        >
          <swiper-slide>
            <div class="poster-1 w-full h-full"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="poster-2 w-full h-full"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="poster-3 w-full h-full"></div>
          </swiper-slide>
        </swiper>
      </div>
      
      <div class="container px-3rem box-border relative z-20">
        <div class="text-3rem">数字农业一体化管理平台</div>
        <div class="w-[43rem] text-.9rem mt-1.2rem">
          基于自主可控的数字孪生技术、物联管控技术、云计算、人工智能、数据挖掘、边缘计算、GIS遥感监测、增强现实等多种技术手段融合，构建全流程的新型农业一体化管理平台
        </div>
        <div class="flex mt-10rem">
          <div class="outer-line p-1">
            <div
              class="flex !bg-white hover:text-#fff text-#318255 transition-all p-1px rounded-full cursor-pointer relative overflow-hidden"
              @mouseenter="btnAction = true"
              @mouseleave="btnAction = false"
              @click="router.push('/gateway')"
            >
              <div class="text-1rem flex justify-center items-center px-1rem pl-1.2rem relative z-30 tracking-widest">系统介绍</div>
              <div class="aspect-1 h-3rem bg-#318255 rounded-full arrow-icon relative z-30"></div>
              <div
                class="h-3rem top-1px absolute bg-#318255 transition-all rounded-full !duration-300 z-0"
                :style="`left: ${btnAction ? '1px' : '100%'};width:calc(100% - 2px);`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center items-center h-100vh bg-2">
      <div class="container flex flex-row-reverse relative px-2rem box-border" id="mapContainer">
        <!-- 地图 -->
        <div id="mapChart" class="h-100vh w-106vh max-h-[920px] max-w-[975px]"></div>
        <!-- 左侧弹框 -->
        <div class="flex flex-col py-[35px] box-border map-tip text-[0.67rem] lg:text-[1.33rem]" v-if="mapTipShow">
          <div class="text-[1rem] lg:text-[2rem] text-[#48FF96] text-center">{{ mapTipData.county }}</div>
          <div class="mt-[0.5em] grid grid-cols-2 gap-2 text-white">
            <div class="text-right">帮扶城市:</div>
            <div>{{ !mapTipData.city ? '暂无' : mapTipData.city }}</div>
          </div>
          <div class="mt-[0.5em] grid grid-cols-2 gap-2 text-white overflow-auto hidden-scrollbar">
            <template v-for="item in mapTipData.data" :key="`${mapTipData.county}-${item.village}`">
              <div class="text-right">{{ item.years }}年示范村:</div>
              <div><a :href="item.bigscreen" target="_blank" style="color: white;text-decoration: none;">{{ item.village }}</a></div>
            </template>
          </div>
        </div>
        <div id="mapToTip" v-show="mapTipShow"></div>
        <div class="absolute left-2rem top-[14%] text-white space-y-3 text-[1rem] lg:text-[1.4rem] xl:text-2.4rem">
          <div>打造100个鲁渝协作乡村振兴示范镇</div>
          <div>打造100个鲁渝协作特色产业园区</div>
          <div>培育100个鲁渝协作品牌</div>
          <div class="text-[0.6rem] xl:text-1rem text-[#f1f1f1d0]"
            >强化产业协作，实施“东产西移“，大力推动区域协同发展</div
          >
        </div>
      </div>
    </div>
    <div class="w-full flex bg-white justify-center items-center h-12rem">
      <div class="flex flex-col items-center space-y-1 relative">
        <div class="text-1.8rem">乡村振兴建设</div>
        <div class="text-#666 text-.7rem">RURAL REVITALIZATION CONSTRUCTION</div>
      </div>
    </div>
    <div class="w-full flex justify-center bg-3 h-[24rem]">
      <div class="container flex justify-center relative top-[-2rem] space-x-1">
        <div
          :class="`${
            selectedCardId === item.id
              ? 'items-start w-26rem px-2rem vc' + item.id
              : 'w-8rem items-center'
          } h-20rem flex flex-col justify-center space-y-5 transition-all duration-300 bg-[#00682Ec0] text-white`"
          v-for="item in cardDataList"
          :key="item.id"
          @mouseenter="selectedCardId = item.id"
        >
          <div :class="selectedCardId === item.id ? 'text-6xl font-bold' : 'text-4xl'">{{
            item.value
          }}</div>
          <div :class="selectedCardId === item.id ? 'text-[1.5rem]' : 'text-base'">{{
            item.label
          }}</div>

          <transition name="expand">
            <div v-show="selectedCardId === item.id" :class="`overflow-hidden ${selectedCardId === item.id ? 'linear-show' : ''}`">
              <div class="vcContent mt-3 text-base">
                {{ item.desc ?? '' }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 示范村建设部分 -->
    <div class="w-full flex justify-center items-center bg-4 h-100vh">
      <div class="container overflow-hidden px-[3rem] box-border">
        <div class="flex justify-between relative text-white py-5">
          <div class="text-1.2rem">示范村建设</div>
          <div class="flex space-x-2">
            <div @click="handleTurn(1)" class="swiper-button-next village-left cursor-pointer"></div>
            <div @click="handleTurn(-1)" class="swiper-button-prev village-right cursor-pointer "></div>
          </div>
        </div>
        <swiper
          ref="buildRef"
          :slidesPerView="4"
          :spaceBetween="20"
          :freeMode="true"
          :navigation="{
            nextEl: '.swiper-button-next', 
            prevEl: '.swiper-button-prev',
          }"
          :pagination="{
            clickable: true
          }"
          :modules="[FreeMode,Navigation]"
          class="mySwiper w-full overflow-hidden space-x-4rem"
        >
          <swiper-slide
            v-for="item in countryBuildData"
            :key="item.id"
          >
            <div class="w-21rem aspect-0.72 default-village-bg village-card-item box-border overflow-hidden">
              <div class="absolute z-0 left-0 top-0 w-full h-full overflow-hidden">
                <div :class="`w-full h-full village-${item.id} village-animation-bg`"></div>
              </div>
              <div class="w-full text-left py-1.9rem text-#fff text-1.3rem font-bold village-item-title box-border relative z-10">{{ item.year }}年</div>
              <div class="mt-30% w-full village-item-content box-border text-left relative z-10">
                <div class="village-yh w-2rem h-2rem"></div>
                <div class="text-white mt-2rem">
                  <div class="text-1.4rem">
                    <span>我们建设示范村</span>
                    <span class="text-1.6rem px-.4rem">{{ item.villageNum }}</span>
                    <span>个</span>
                  </div>
                  <div class="mt-1rem">
                    <span>区县</span>
                    <span class="font-bold text-1.2rem px-.4rem">{{ item.areaNum }}</span>
                    <span>个</span>
                    <span class="px-.4rem">|</span>
                    <span>产业类型</span>
                    <span class="font-bold text-1.2rem px-.4rem">{{ item.formNum }}</span>
                    <span>种</span>
                    <span class="px-.4rem">|</span>
                    <span>产业形态</span>
                    <span class="font-bold text-1.2rem px-.4rem">{{ item.industryTypeNum }}</span>
                    <span>种</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div
              :class="`w-full relative !hover:village-${item.id} default-village-bg transition aspect-.72  mb-2rem color-[#fff]`"
            >
              <div class='flex justify-between absolute top-20px items-center left-15px w-93%'>
                <div class="text-1.3rem font-bold">{{ item.year }}年</div>
                <div class='w-70% relative'>
                  <div class="border-1.5px  border-dashed border-[#85b7cd]"></div>
                  <div class='w-8px h-8px top--0.7 left-20px absolute bg-[#fff] rounded-full'></div>
                </div>
              </div>
              
              <div class='absolute color-[#f2f2f2] left-2rem w-85% text-1rem bottom-100px' style='text-align:left'>
                <div class='mb-5px'>我们建设示范村<span class='text-1.4rem text-center inline-block p-3 font-bold text-#fff'>{{ item.villageNum }}</span>个</div>
                <div>区县{{ item.areaNum }}个 | 产业类型{{ item.formNum }}种 | 产业形态{{ item.industryTypeNum }}种</div>
              </div>
            </div> -->
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- 示范村建设数据 -->
    <div class="w-full flex flex-col items-center justify-center bg-[#fff] h-100vh">
      <div class="container">
        <div class="flex flex-col items-center space-y-1">
          <div class="text-1.8rem">示范村建设数据</div>
          <div class="text-#666 text-.7rem">DEMONSTRATION VILLAGE CONSTRUCTION DATA</div>
        </div>
      </div>
      <div class="w-full overflow-hidden container h-[85%]">
        <swiper
          :initialSlide="1"
          :slidesPerView="1.5"
          :spaceBetween="0"
          :centeredSlides="true"
          :pagination="{
            clickable: true
          }"
          :modules="modules"
          class="build-data-wrapper vlg-data-swiper text-white"
        >
          <swiper-slide
            class="flex-col vlg-data-swiper-item"
            v-for="(item, index) in vlgData"
            :key="yrList[index]"
          >
            <div class="px-[5%] h-[10%] w-full box-border flex justify-between items-center">
              <div class="text-[20px]">{{ yrList[index] }}年</div>
              <div>
                <el-select
                  @change="selectChange(index)"
                  v-model="county[index]"
                  placeholder="请选择区县"
                  style="width: 130px;"
                  size="large"
                >
                  <el-option class="color-[#fff]" label="全部" value="全部" />
                  <el-option
                    class="color-[#fff]"
                    v-for="ele in options[index]"
                    :key="ele"
                    :label="ele"
                    :value="ele"
                  />
                </el-select>
              </div>
            </div>
            <el-table
              style="height: 65%; width: 100%; background-color: transparent;"
              :border="true"
              :data="item.list"
              :row-style="{'background-color': 'transparent', color: '#fff', cursor: 'pointer'}"
              :header-row-style="{'background-color': 'transparent', color: '#84EFAD'}"
              :header-cell-style="{'background-color': 'transparent', height: '60px', border: 'none', fontSize: '16px'}"
              :cell-style="{borderBottom: 'none', fontSize: '16px', height: '40px'}"
              @row-click="toBigScreen"
            >
              <el-table-column label="序号" type="index" align="center"/>
              <el-table-column label="区县" prop="county" align="center"/>
              <el-table-column label="示范村" prop="village" align="center"/>
              <el-table-column label="产业类型" prop="form" align="center"/>
              <el-table-column label="产业形态" prop="industry" align="center"/>
            </el-table>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- 对口帮扶地域 -->
    <div class="w-full bg-[#eaeaec] bg-area h-100vh flex items-center flex-col py-3rem box-border">
      <div class="flex flex-col items-center space-y-1 mb-4">
        <div class="text-1.8rem">对口帮扶地域</div>
        <div class="text-#666 text-.7rem">TARGETED ASSISTANCE REGIONS</div>
      </div>
      <div class="flex space-x-2rem items-center justify-center mt-2rem">
        <div
          class="s-card w-2.9rem h-15rem flex flex-col items-center box-border justify-between text-white text-1.2rem"
          v-for="item in helpAreaData"
          :key="item.id"
        >
          <div class="w-50% h-4.8%"></div>
          <div
            class="w-50% h-36.5% flex items-center justify-center"
            style="writing-mode: vertical-lr;"
          >{{ item.from }}</div>
          <div class="w-50% h-19.4%"></div>
          <div
            class="w-50% h-35.5% flex items-center justify-center"
            style="writing-mode: vertical-lr;"
          >{{ item.to }}</div>
          <div class="w-50% h-4.8%"></div>
          <!-- <div style="writing-mode: vertical-lr;">{{ item.from }}</div>
          <div style="writing-mode: vertical-lr;">{{ item.to }}</div> -->
        </div>
      </div>
      <div class="container flex justify-between items-center px-3rem py-2rem pb-4rem box-border">
        <div>
          <div class="text-6rem font-bold text-#318255">{{ helpAreaData.length }}</div>
          <div class="text-1.6rem">帮扶区县</div>
        </div>
        <div>
          <div class="space-y-1rem text-1.2rem">
            <div class="flex space-x-3 items-center">
              <div class="rounded-full w-1rem h-1rem bg-#2f3331"></div>
              <div>帮扶城市</div>
            </div>
            <div class="flex space-x-3 items-center">
              <div class="rounded-full w-1rem h-1rem bg-#318255"></div>
              <div>挂职区县</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 帮扶产业 -->
    <div class="w-full py-9rem bg-5 flex flex-col items-center justify-center">
      <div class="flex flex-col items-center space-y-1 mb-4">
        <div class="text-1.8rem">帮扶产业</div>
        <div class="text-#666 text-.7rem">TARGETED ASSISTANCE REGIONS</div>
      </div>
      <div class="w-full overflow-hidden pt-2rem container">
        <swiper
          :slidesPerView="4"
          :spaceBetween="30"
          :freeMode="true"
          :pagination="{
            clickable: true,
          }"
          :modules="modules"
          class="mySwiper build-data-wrapper"
        >
          <swiper-slide v-for="item in supportIndustries" :key="item.id">
            <div class="w-full bg-white h-20rem overflow-hidden rounded-md mb-4rem flex flex-col items-center shadow-md">
              <img :src="item.img" class="w-full !h-16rem object-fit" />
              <div class="py-1 font-bold">{{ item.label }}</div>
              <div class="text-.9rem">{{ item.content }}</div>
            </div>
          </swiper-slide>
        </swiper>
      </div>  
    </div>

    <!-- 打造产业 -->
    <div class="flex justify-center items-center bg-6">
      <div class="container">
        <div
          class="flex justify-between items-center space-y-1 py-3rem pl-6rem pr-2rem"
          style="border-bottom: 1px solid #f1f1f130;"
        >
          <div class="text-1.9rem text-#fff">打造产业</div>
          <div class="text-#fff text-1.2rem">更多></div>
        </div>
        <div class="flex">
          <div class="w-20rem p-2rem py-3.5rem box-border space-y-2rem" style="border-right: 1px solid #f1f1f130;">
            <div
              :class="`text-1.6rem  rounded-md p-1rem text-center transition cursor-pointer ${selectedIndustry === item.id ? 'bg-#fff text-#318255' : 'text-#fff'} `"
              v-for="item in industriesTree"
              :key="item.id"
              @click="handleFirstItemClick(item)"
            > {{ item.label }}</div>
          </div>
          <div class="grow box-border p-2rem py-3rem pb-1rem">
            <div class="flex justify-between items-center">
              <div class="text-white text-1.7rem">{{ selectedSecIndustry.label }} - {{ selectedSecItem.label }} ({{ selectedSecItem?.children?.length }})</div>
              <div class="industry-btn w-3rem h-3rem cursor-pointer" @click="handleNextItem(1)"></div>
            </div>
            <div class="flex justify-center items-center h-58vh">
              <div class="h-22rem aspect-1.68 tv-bg p-2.3rem box-border relative scale-130">
                <img
                  :src="selectedThirItem?.bigscreenImg"
                  class="w-full h-full object-contain rounded-2 box-border "
                  @click = "handlePageJump()"
                />
                <div class="absolute w-full h-2rem left-0 bottom-[3rem] flex justify-center items-center space-x-2rem">
                  <div class="left-btn w-2rem h-2rem cursor-pointer" @click="handleImgChange(-1)"></div>
                  <div class="right-btn w-2rem h-2rem cursor-pointer" @click="handleImgChange(1)"></div>
                </div>
                <div class="absolute w-87% h-0.15rem bg-white bottom-[2.5rem] overflow-hidden">
                  <div
                    class="w-100% h-full bg-#318255 absolute transition"
                    :style="`left: -${offsetPer}%;`"
                  ></div>
                </div>
              </div>
            </div>
            <div class="w-full h-[10rem] bottom-[-2rem] flex justify-center">
              <div class='flex flex-col justify-center items-center w-25rem'> 
                  <div class="flex justify-center  h-20% text-center text-#fff text-1.2rem">{{ selectedSecItem.label }}</div>
                  <div class="flex justify-center  h-80%  w-23rem  semicircule-bg2 overflow-hidden" @click="handleNextItem(-1)">
                      <div class = 'dashCircle mt-11'></div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 精准农业SAAS平台 -->
    <div class="w-full flex flex-col justify-center items-center py-3rem">
      <div class="flex flex-col space-y-1 items-center">
        <div class="text-1.8rem">精准农业SAAS平台</div>
        <div class="text-#666 text-.7rem">PRECISION AGRICULTURE SAAS PLATFORM</div>
      </div>
      <div class="flex space-x-2 mt-2rem mb-[-2rem]">
        <div class="w-20rem">
          <div class="card-1 w-full aspect-1.46"></div>
          <div class="shadow-1 w-full aspect-2.6 relative top-[-.6rem]"></div>
        </div>
        <div class="w-20rem">
          <div class="card-2 w-full aspect-1.77 relative top-[1.6rem]"></div>
          <div class="shadow-2 w-full aspect-4.93 relative top-[1.8rem]"></div>
        </div>
        <div class="w-20rem">
          <div class="card-3 w-full aspect-1.46"></div>
          <div class="shadow-3 w-full aspect-2.6 relative top-[-.6rem]"></div>
        </div>
      </div>
    </div>

    <!-- 政府政策 -->
    <div class="w-full flex flex-col justify-center items-center bg-#f7f7f7 py-3rem">
      <div class="flex flex-col space-y-1 items-center mb-7">
        <div class="text-1.8rem">政府政策</div>
        <div class="text-#666 text-.7rem">GOVERNMENT POLICY</div>
      </div>
      <div class="container flex justify-center items-start space-x-2">
        <div class="flex flex-col space-y-2">
          <div class="w-20rem h-14rem pic"></div>
          <div class="bg-white p-3 w-20rem box-border">
            <div class="line-clamp-1"
              >中共重庆史农村工作实施乡村振兴战略领导小组关于2024年东西…</div
            >
            <div class="text-.7rem mt-1 pl-1 text-[#666] line-clamp-3"
              >中共中央总书记、国家主席、中央军委主席习近平近日在重庆考察时强调，重庆要对标新时代新征程党的中心任务和党中央赋予的使命，充分发挥比较优势、后发优势，进一步全面深化改革开放，主动服务和融入新发…</div
            >
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <div
            v-for="item in govPolicyDataList"
            :key="item.id"
            class="flex items-center bg-white h-4.7rem"
          >
            <div class="ml-6 font-bold">
              <div>{{ item.date }}</div>
              <div class="text-.8rem">{{ item.year }}</div>
            </div>
            <div class="w-1px h-2rem mx-1rem bg-#c1c1c160"></div>
            <div class="space-y-1 box-border pr-4">
              <div class="text-.9rem line-clamp-1">{{ item.title }}</div>
              <div class="text-.6rem w-[30rem] line-clamp-2 text-[#666]">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数字农业综合解决案例 -->
    <div class="w-full flex flex-col justify-center items-center bg-#fff py-6">
      <div class="flex flex-col space-y-1 items-center mt-3 mb-[1rem]">
        <div class="text-1.8rem">数字农业综合解决案例</div>
        <div class="text-#666 text-.7rem">COMPREHENSIVE SOLUTION CASE OF DIGITAL AGRICULTURE</div>
      </div>
      <div class="w-full py-1.4rem h-60vh overflow-hidden">
        <div 
          class="w-100vw h-1/3 cursor-pointer" 
          style="position: relative; display: inline-flex"
          @mouseenter="handleSwiperMouseEnter"
          @mouseleave="handleSwiperMouseLeave"
        >
          <swiper
            ref="swiperLeft1"
            @swiper="onSwiper"
            :slidesPerView="5"
            :spaceBetween="5"
            :loop="true"
            :autoplay="{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }"
            :speed="10000"
            :reverseDirection="true"
            :modules="[Autoplay]"
            class="swiper-container swiper-Left"
          >
            <swiper-slide v-for="n in 15" :key="`'slide-2-' + ${n}`" :class="`num-one-${n}`" />
          </swiper>
        </div>
        <div class="w-100vw h-1/3 cursor-pointer" style="position: relative; display: inline-flex ">
          <swiper
            ref="swiperRight"
            :slidesPerView="5"
            :spaceBetween="5"
            :loop="true"
            :autoplay="{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }"
            :speed="10000"
            :reverseDirection="true"
            :modules="[Autoplay]"
            class="swiper-container swiper-right"
            dir="rtl"
          >
            <swiper-slide v-for="n in 16" :key="`'slide-2-' + ${n}`" :class="`num-two-${n}`" />
          </swiper>
        </div>
        <div class="w-100vw h-1/3 cursor-pointer" style="position: relative; display: inline-flex">
          <swiper
            ref="swiperLeft2"
            :slidesPerView="5"
            :spaceBetween="5"
            :loop="true"
            :autoplay="{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }"
            :speed="10000"
            :reverseDirection="true"
            :modules="[Autoplay]"
            class="swiper-container swiper-left"
          >
            <swiper-slide v-for="n in 15" :key="`'slide-3-' + ${n}`" :class="`num-three-${n}`" />
          </swiper>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="w-full flex flex-col justify-center items-center bg-7 text-white">
      <div class="container box-border flex justify-between items-center mt-7 px-2rem box-border">
        <div class="flex items-center py-5 space-x-1rem">
          <div class="icon w-2.4rem h-2.4rem"></div>
          <div class="text-white">
            <div class="text-1.4rem">鲁渝协作乡村振兴示范村数字化赋能工程</div>
            <div class="text-.8rem relative left-.3rem text-[#f1f1f1c0]"
              >Lu Yu Collaborative Rural Revitalization Village Digital Empowerment Project</div
            >
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="text-.9rem">联系我们</div>
          <div class="text-1.2rem font-bold">182-0647-2165</div>
        </div>
      </div>
      <div
        class="container box-border flex justify-between items-start py-3rem text-white px-2rem pl-5.3rem"
      >
        <div class="flex space-x-3rem items-start">
          <div v-for="item in footerData" :key="item.id">
            <div class="text-1.1rem mb-1.2rem">{{ item.label }}</div>
            <div
              v-for="ele in item.children"
              :key="ele.id"
              class="mb-.6rem text-.9rem text-#e1e1e1 hover:text-white cursor-pointer transition"
            >
              {{ ele.label }}
            </div>
          </div>
        </div>
        <div class="w-8rem flex flex-col items-center">
          <div class="w-full aspect-1 qr-code bg-white"></div>
          <div class="text-white mt-2">扫码关注</div>
        </div>
      </div>
      <div
        class="flex justify-center items-center w-full py-7 text-#f1f1f1"
        style="border-top: 1px solid #f1f1f110"
        >Copyright © 2024 zhinengshengchan. | 鲁ICP备17022090号 | ©2024
        山东浪潮智能生产技术有限公司</div
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
@for $i from 1 through 10 {
  .poster-#{$i} {
    background-size: cover;
    background-image: url(./assets/new/poster#{$i}.png);
  }
}
#homeContainer {
  scroll-snap-type: y mandatory;
  overflow: auto;
  div {
    scroll-snap-align: start;
  }
}
.village-yh{
  background-size: contain;
  background-image: url(./assets/new/village-yh.png)
}

.industry-btn {
  background-image: url(./assets/new/industryBtn.png);
  background-size: 100% 100%;
}

.icon {
  background-image: url(./assets/new/logo.png);
  background-size: 100% 100%;
}

.qr-code {
  background-image: url(./assets/new/qrcode.png);
  background-size: contain;
}

.pic {
  background-image: url(./assets/new/pic.png);
  background-size: cover;
}

.tv-bg {
  background-image: url(./assets/new/tv.png);
  background-size: 100% 100%;
}

.left-btn {
  background-image: url(./assets/new/lbtn.png);
  background-size: 100% 100%;
}

.right-btn {
  background-image: url(./assets/new/rbtn.png);
  background-size: 100% 100%;
}

@keyframes village-animation {
  0% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes village-animation-reverse {
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
  0% {
    transform: scale(1);
    opacity: 1;
  }
}

.village-card-item:hover {
  .village-item-title {
    padding-left: 2rem;
    padding-right: 2rem;
    transform: scale(1.1);
    transition: all .4s ease;
  }
  .village-item-content {
    padding-left: 2rem;
    padding-right: 2rem;
    transition: all .4s ease;
  }
  .village-animation-bg {
    animation: village-animation .4s linear forwards;
  }
}

.village-card-item {
  .village-animation-bg {
    animation: village-animation-reverse .4s linear forwards;
  }
}

.table-bg {
  background-image: url(./assets/new/tableBg.png);
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
}

.semicircule-bg2{
  background-image: url(./assets/new/semicircle2.png);
  background-size: 100% 330%;
}
.semicircule-bg{
  background-image: url(./assets/new/semicircule.png);
  background-size: 100% 100%;
}

@for $i from 1 through 7 {
  .bg-#{$i} {
    background-image: url(./assets/new/bg#{$i}.png);
    background-size: cover;
  }
}

@for $i from 1 through 4 {
  .village-#{$i} {
    background-image: url(./assets/new/village-bg-#{$i}.png);
    background-size: cover;
  }
}

.default-village-bg {
  background-image: url(./assets/new/defaultBg.png);
  background-size: 100% 100%;
}

@for $i from 1 through 3 {
  .card-#{$i} {
    background-image: url(./assets/new/card#{$i}.png);
    background-size: 100% 100%;
  }
  .shadow-#{$i} {
    background-image: url(./assets/new/shadow#{$i}.png);
    background-size: 100% 100%;
  }
}
@for $i from 1 through 4 {
  .vc#{$i} {
    background-image: url(./assets/villageConstruction/vc#{$i}.png);
    background-size: 100% 100%;
  }
}
// 乡村建设样式
.expand-enter-active {
  transition: max-height 0.5s ease;
  max-height: 30rem;
}
.expand-enter-from {
  max-height: 0;
}
.expand-enter-to {
  max-height: 10rem;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
  transition-delay: 0.1s;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.vcContent {
  min-height: 5rem;
  line-height: 1.5;
}

.outer-line {
  background-image: url(./assets/new/outerLine.png);
  background-size: 100% 100%;
}
//解决案例图片
@for $i from 1 through 15 {
  .num-one-#{$i} {
    background-image: url(./assets/num-one-#{$i}.png);
    background-size: 100%;
    transition: transform 0.3s;
  }
}
@for $i from 1 through 16 {
  .num-two-#{$i} {
    background-image: url(./assets/num-two-#{$i}.png);
    background-size: 100%;
    transition: transform 0.3s;
  }
}
@for $i from 1 through 15 {
  .num-three-#{$i} {
    background-image: url(./assets/num-three-#{$i}.png);
    background-size: 100%;
    transition: transform 0.3s;
  }
}

@for $i from 1 through 16 {
  .product-#{$i} {
    background-image: url(./assets/new/product#{$i}.png);
    background-size: cover;
  }
}

@for $i from 1 through 10 {
  .poster-#{$i} {
    background-image: url(./assets/new/poster#{$i}.png);
    background-size: cover;
  }
}

.build-data-wrapper {
  mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent 100%);
}

.arrow-icon {
  background-image: url(./assets/new/arrow.png);
  background-size: .8rem .6rem;
  background-repeat: no-repeat;
  background-position: center center;
}

.bg-area {
  background-image: url(./assets/new/bgArea.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: #f0f0f1;
}

.s-card {
  background-image: url(./assets/new/scard.png);
  background-size: 100% 100%;
}

@keyframes opacityIn {
  0% { opacity: 0; }
  30% { opacity: 0; }
  100% { opacity: 1; }
}
.linear-show {
  animation: opacityIn .7s ease forwards;
}
/****************************** 第二页地图 start ******************************/
.map-tip {
  max-height: 39%;
  width: calc((100% - 106vh) * 0.8);
  background: {
    image: url(./assets/map/map-tip.png);
    size: 100% 100%;
  }
  position: absolute;
  top: calc(61% - 4.8rem);
  left: 2rem;
}
@media screen and (min-height: 920px) {
  .map-tip {
    width: calc((100% - 975px) * 0.8);
  }
}

.hidden-scrollbar::-webkit-scrollbar {
  width: 0;
}

#mapToTip {
  position: absolute;
  background: linear-gradient(270deg, rgba(71, 253, 149, 0.3) 0%, rgba(125, 255, 199, 0) 100%);
}
/****************************** 第二页地图 end ******************************/

/****************************** 示范村建设数据 start ******************************/
.vlg-data-swiper-item {
  background: {
    image: url(./assets/vlg-data/vlg-data-bg.png);
    size: 100% 78%;
    position: center;
    repeat: no-repeat;
  }
}
.vlg-data-swiper .swiper-slide {
  transition: 300ms;
  transform: scale(0.9)
}
.vlg-data-swiper .swiper-slide-active,
.vlg-data-swiper .swiper-slide-duplicate-active {
  transform: scale(1);
}
:deep(.vlg-data-swiper .el-table__inner-wrapper::before) {
  display: none;
}
:deep(.vlg-data-swiper .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell),
:deep(.vlg-data-swiper .el-select__wrapper) {
  background-color: transparent;
}
:deep(.vlg-data-swiper .el-select__placeholder.is-transparent),
:deep(.vlg-data-swiper .el-select__caret),
:deep(.vlg-data-swiper .el-select__placeholder),
:deep(.vlg-data-swiper .el-table__empty-text) {
  color: #fff;
}
:deep(.vlg-data-swiper .el-select__wrapper) {
  box-shadow: none;
}
:deep(.vlg-data-swiper .el-select__selected-item.el-select__placeholder) {
  text-align: right;
}
/****************************** 示范村建设数据 end ******************************/
</style>
<style>
.swiper {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}
.village-bg{
  background-size: 100% 100%;
  background-image: url(./assets/new/village-bg.png);
}
.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination .swiper-pagination-bullet-active {
  background-color: #318255;
  width: 2rem;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.swiper-button-next{
  position: absolute;
  right: -10px;
  color:#fff;
}
.swiper-button-prev{
  color:#fff;
  position: absolute;
  font-size: 4px !important;
  left:1430px !important;
  bottom: -20px
}
.swiper-button-next:after{
  content: 'next';
  font-size: 15px;
}
.swiper-button-prev:after{
  content: 'next';
  font-size: 15px;
  transform: rotate(180deg)
}
.swiper-wrapper{
  transition-timing-function: linear !important;
}
@-webkit-keyframes rotate{
    from{-webkit-transform: rotate(0deg)}
    to{-webkit-transform: rotate(360deg)}
}
@-moz-keyframes rotate{
    from{-moz-transform: rotate(0deg)}
    to{-moz-transform: rotate(359deg)}
}
@-o-keyframes rotate{
    from{-o-transform: rotate(0deg)}
    to{-o-transform: rotate(359deg)}
}
@keyframes rotate{
    from{transform: rotate(0deg)}
    to{transform: rotate(359deg)}
}
.dashCircle{
  width:18rem;
  height: 18rem;
  border-radius: 50%;
  border: 1px dashed white;
  -webkit-animation: rotate 50s linear infinite;
  -moz-animation: rotate 50s linear infinite;
  -o-animation: rotate 50s linear infinite;
  animation: rotate 50s linear infinite;
  overflow: hidden;

}


</style>