<script setup lang="ts">
// Import Swiper Vue.js components
import { distinct, selectMap } from './api'
import * as echarts from 'echarts'
import type { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'
import { jsonData } from './assets/chongqing'
import meassageBg from './assets/meassageBg.png'
import { Swiper, SwiperSlide } from 'swiper/vue'
// import required modules
import { Autoplay, FreeMode, Pagination } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

const modules = [FreeMode, Pagination]

// 示范村ref
const buildRef = ref()
const handleTurn = (val) => {
  console.log('🚀 ~ handleTurn ~ buildRef.value:', buildRef.value)
  if (!buildRef.value) return
  if (val > 0) buildRef.value.slideNext()
  else buildRef.value.slidePrev()
}

const selectedCardId = ref<string>('1')
const cardDataList = ref<any[]>([
  {
    id: '1',
    label: '示范村',
    value: '39',
    desc: '1基于自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
  },
  {
    id: '2',
    label: '帮扶区县',
    value: '14',
    desc: '2于自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
  },
  {
    id: '3',
    label: '精准帮扶基地',
    value: '19',
    desc: '3自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
  },
  {
    id: '4',
    label: '产业形态',
    value: '11',
    desc: '4主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶'
  }
])

const showHeader = ref<boolean>(true)
const checkScroll = () => {
  const dom = document.getElementById('homeContainer')
  if (dom)
    dom.addEventListener('scroll', () => {
      console.log('🚀 ~ checkScroll ~ dom.scrollTop:', dom.scrollTop)
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

/****************************** 第二页地图 start ******************************/

const mapDataList = ref<Array<any>>([])
const nameDataMap = {}

const initChinaMap = async () => {
  // 获取高亮地区列表并封装成ECharts用的形式
  mapDataList.value = await distinct({ type: '1' })
  let highlightList = mapDataList.value.map(item => ({
    name: item.name, value: 2000, selected: false
  }))
  console.log("高亮地区: ", mapDataList.value)
  console.log("高亮地区数据ECharts用: ", highlightList)

  // 准备ECharts地图tooltip数据，并修改highlighList中的名称
  const nameArr = jsonData.features.map((item) => item.properties.name)
  nameArr.forEach((item) => {
    selectMap({ county: item }).then((res) => {
      nameDataMap[item] = res
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
  console.log("修改后的高亮地区数据: ", highlightList)

  // 注册重庆市地图并渲染
  echarts.registerMap('chongqing', jsonData as GeoJSONSourceInput)
  const chartDom = document.getElementById('mapChart')
  const myChart = echarts.init(chartDom)
  myChart.setOption(
    {
      // tooltip: {
      //   show: true,
      //   trigger: 'item',
      //   enterable: true, // 鼠标是否可进入提示框浮层中，默认为false，
      //   showContent: true, // 是否显示提示框浮层
      //   triggerOn: 'click', // 提示框触发的条件(mousemove|click|none)
      //   padding: [0, 0], // 提示框浮层内边距，单位px
      //   backgroundColor: 'none', // 提示框浮层的背景颜色,
      //   borderWidth: 0, // 提示框边框
      //   formatter: function (params) {
      //     const mapData: any = nameDataMap[params.name]
      //     // console.log('mapData', mapData)
      //     if (!mapData[0].data || mapData[0].data.length === 0) return '<div></div>'
      //     let str = ``
      //     let div=`
      //     ${
      //       mapData[0].data ? mapData[0].data.map(item=>{
      //         return `
      //         <div class='mt--5px'>
      //           <div class="color-[#fafafa] z-9999 my-8px text-sm">帮扶城市：${mapData[0]?.city}</div>
      //           <div class="color-[#fafafa] text-sm">${item.years}年示范村：<a href="${item.bigscreen}" target="_blank" style="color: white;text-decoration: none;">${item.village}</a></div>
      //         </div>
      //         `
      //       }) : ''
      //     }`
      //     if (mapData.length == 0) {
      //       str = ''
      //     } else {
      //       str = `<div class=" relative p-[20px]">
      //             <img src="${meassageBg}" class="absolute z--1 left-0 top-0 w-100% bg-none h-100% "/>
      //             <div class="text-lg color-[#04c2c2] z-9999 " style="font-weight:700;">${mapData[0]?.county}</div>
      //             ${div}

      //             </div>`
      //     }
      //     return str
      //   },
      //   rich: {
      //     img: {
      //       backgroundColor: {
      //         image: './assets/meassageBg.png'
      //       },
      //       width: 100,
      //       height: 100,
      //       align: 'center'
      //     }
      //   }
      // },
      dataRange: { // 不显示面板 全选series.data并设置背景色
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
            fontWeight: 'bold',
            fontSize: '11',
            formatter: (item) => {
              const _name = item.name // .replace("区", "").replace("自治县", "").replace("县", "")
              const labelMap = [
                "九龙坡区",
                "大渡口区",
                "渝中区",
                "璧山区"
              ]

              return labelMap.indexOf(_name) !== -1 ? _name.replace("区", "").replace("自治县", "").replace("县", "").split("").join('\n') : _name
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
      ]
    },
    true
  )

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
</script>
<template>
  <div class="w-full box-border relative overflow-y-auto h-100vh" id="homeContainer">
    <div
      :class="`fixed left-0 w-full flex justify-center transition-all duration-1000 box-border backdrop-blur-2xl ${
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
    <div class="w-full flex justify-center items-center h-100vh bg-1 text-white">
      <div class="container px-3rem box-border">
        <div class="text-3rem">数字农业一体化管理平台</div>
        <div class="w-[43rem] text-.9rem mt-1.2rem">
          基于自主可控的数字孪生技术、物联管控技术、云计算、人工智能、数据挖掘、边缘计算、GIS遥感监测、增强现实等多种技术手段融合，构建全流程的新型农业一体化管理平台
        </div>
        <div class="flex mt-10rem text-#318255">
          <div
            class="rounded-full p-[2px] overflow-hidden w-6.6rem bg-white text-.9rem flex justify-between"
          >
            <div class="px-2 py-1">系统介绍</div>
            <div class="aspect-1 h-full bg-#318255 rounded-full arrow-icon"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center items-center h-100vh bg-2">
      <div class="container flex flex-row-reverse relative px-2rem box-border">
        <div id="mapChart" class="h-100vh w-106vh"></div>
        <div class="absolute left-2rem top-10rem text-white text-2.4rem space-y-3">
          <div>打造100个鲁渝协作乡村振兴示范镇</div>
          <div>打造100个鲁渝协作特色产业园区</div>
          <div>培育100个鲁渝协作品牌</div>
          <div class="text-1rem text-[#f1f1f1d0]"
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
          <div :class="selectedCardId === item.id ? 'text-`2xl' : 'text-base'">{{
            item.label
          }}</div>

          <transition name="expand">
            <div v-show="selectedCardId === item.id" :class="`overflow-hidden ${selectedCardId === item.id ? 'linear-show' : ''}`">
              <div class="vcContent mt-3 text-sm">
                {{ item.desc ?? '' }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 示范村建设部分 -->
    <div class="w-full flex justify-center items-center bg-4 h-100vh">
      <div class="container overflow-hidden px-3 box-border">
        <div class="flex justify-between text-white py-3">
          <div class="text-1.2rem">示范村建设</div>
          <div class="flex space-x-2">
            <div @click="handleTurn(1)">L</div>
            <div @click="handleTurn(-1)">R</div>
          </div>
        </div>
        <swiper
          ref="buildRef"
          :slidesPerView="3"
          :spaceBetween="30"
          :freeMode="true"
          :pagination="{
            clickable: true
          }"
          :modules="[FreeMode]"
          class="mySwiper w-full overflow-hidden"
        >
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem">1</div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem">2</div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem">3</div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem">4</div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem"></div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- 示范村建设数据 -->
    <div class="w-full flex flex-col items-center justify-center bg-[#fff] py-4rem">
      <div class="container">
        <div class="flex flex-col items-center space-y-1">
          <div class="text-1.8rem">示范村建设数据</div>
          <div class="text-#666 text-.7rem">DEMONSTRATION VILLAGE CONSTRUCTION DATA</div>
        </div>
      </div>
      <div class="w-full overflow-hidden pt-2rem container">
        <swiper
          :slidesPerView="3"
          :spaceBetween="30"
          :freeMode="true"
          :pagination="{
            clickable: true
          }"
          :modules="modules"
          class="mySwiper build-data-wrapper"
        >
          <swiper-slide>
            <div class="w-full h-20rem table-bg mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-20rem table-bg mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-20rem table-bg mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-20rem table-bg mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-20rem table-bg mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-20rem table-bg mb-2rem"></div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-full h-20rem table-bg mb-2rem"></div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- 对口帮扶地域 -->
    <div class="w-full bg-[#eaeaec] bg-area h-100vh flex items-center flex-col py-6rem box-border">
      <div class="flex flex-col items-center space-y-1 mb-4">
        <div class="text-1.8rem">对口帮扶地域</div>
        <div class="text-#666 text-.7rem">TARGETED ASSISTANCE REGIONS</div>
      </div>
      <div class="flex space-x-2rem items-center justify-center mt-2rem">
        <div
          class="s-card w-2.9rem h-15rem flex flex-col items-center py-3 box-border justify-between text-white text-1.2rem"
          v-for="item in helpAreaData"
          :key="item.id"
        >
          <div style="writing-mode: vertical-lr;">{{ item.from }}</div>
          <div style="writing-mode: vertical-lr;">{{ item.to }}</div>
        </div>
      </div>
      <div class="container flex justify-between items-center px-3rem py-2rem box-border">
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
              <div :class="`w-full h-16rem ${item.img}`"></div>
              <div class="py-1 font-bold">{{ item.label }}</div>
              <div class="text-.9rem">{{ item.content }}</div>
            </div>
          </swiper-slide>
        </swiper>
      </div>  
    </div>

    <!-- 打造产业 -->
    <div class="flex justify-center items-center h-100vh bg-6">
      <div class="container">
        <div class="flex justify-between items-center space-y-1">
          <div class="text-1.8rem">打造产业</div>
          <div class="text-#666 text-.7rem">更多</div>
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
      <div class="container flex justify-center items-center space-x-2">
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
          class="w-100vw h-1/3" 
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
        <div class="w-100vw h-1/3" style="position: relative; display: inline-flex">
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
        <div class="w-100vw h-1/3" style="position: relative; display: inline-flex">
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
#homeContainer {
  scroll-snap-type: y mandatory;
  overflow: auto;
  div {
    scroll-snap-align: start;
  }
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

.table-bg {
  background-image: url(./assets/new/tableBg.png);
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
}

@for $i from 1 through 7 {
  .bg-#{$i} {
    background-image: url(./assets/new/bg#{$i}.png);
    background-size: cover;
  }
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

.swiper-wrapper{
  transition-timing-function: linear !important;
}
</style>