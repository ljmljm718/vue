<template>
  <div class="h-100vh pt-[5rem] box-border overflow-auto">
    <div class="fixed top-0 left-0 z-100 w-full bg-white transition-all flex justify-center shadow-sm h-[5rem]">
      <div class="container flex px-5 items-center">
        <div class="logo w-3rem h-3rem"></div>
        <div class="ml-1rem text-2rem font-600">工业安全生产数字化产品平台</div>
      </div>
    </div>
    <div class="w-full" id="carouselContainer">
      <el-carousel
        ref="carouselRef"
        direction="vertical"
        :autoplay="true"
        :motion-blur="true"
        class="w-full"
        height="40rem"
        :loop="true"
      >
        <el-carousel-item v-for="item in carouselItemList" :key="item.id">
          <div :class="`w-full ${item.background} h-[40rem] flex justify-center items-center`">
            <div class="container h-[27rem] px-[9rem]">
              <div class="text-white text-[3rem] font-600">{{ item.title }}</div>
              <div class="flex flex-col space-y-[1rem] py-[2rem] max-w-[30rem]">
                <div
                  v-for="ele in item.paragraph"
                  :key="ele"
                  class="text-[1rem] text-white"
                >
                  {{ ele }}
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="w-full relative">
      <div class="h-13rem bg-white"></div>
      <div class="digital-bg w-full h-27rem"></div>
      <div class="w-full flex flex-col items-center absolute left-0 top-0">
        <div class="absolute left-0 top-4rem w-full h-full text-[#66666616] font-bold text-[4rem] text-center">
          PRODUCT DIGITAL BASE
        </div>
        <div class="flex justify-center items-start space-x-4 text-black pt-5rem container">
          <div class="title-bar w-1.7rem h-1.7rem"></div>
          <div class="flex flex-col space-y-1 items-center relative top-[-.4rem]">
            <div class="text-2rem font-600">产品数字底座</div>
            <div class="text-[#999999]">PRODUCT DIGITAL BASE</div>
          </div>
          <div class="title-bar w-1.7rem h-1.7rem"></div>
        </div>
        <div class="container flex space-x-1 relative z-30 px-3 box-border mt-[2rem]">
          <div
            v-for="item in productItemList"
            :key="item.id"
            @mouseover="handleMouseEnter(item)"
            @click="handleMouseEnter(item)"
            :class="`${activeProductItem === item.id ? 'grow' : ''} bg-[#174BA1A0] text-white w-8rem transition-all h-20rem flex justify-center items-center overflow-hidden min-w-[9rem]`"
          >
            <div
              v-if="activeProductItem === item.id"
              :class="`mask-${item.id} w-full h-full p-[4rem] box-border custom-transtion`"
            >
              <div class="text-[2.2rem]">{{ item.title }}</div>
              <div class="py-5 pt-4">
                <div v-for="ele in item.paragraph" :key="ele">{{ ele }}</div>
              </div>
              <div
                class="w-4rem py-1 px-4 rounded-1 cursor-pointer select-none hover:bg-[#08215e] transition"
                style="border: 1px solid #999;"
                @click="handleBtnClick(item)"
              >立即查看</div>
            </div>
            <div v-else class="px-1">{{ item.title }}</div>
          </div>
        </div>
        <div class="container linear-bar aspect-27 mt-2"></div>
        <div
          class="container relative z-20 linear-bg py-[.8rem] text-[#f1f1f1c0] flex justify-center items-center text-[1.3rem] hover:text-[#fff] cursor-pointer"
          @click="handleBtnClick({ url: 'http://117.73.12.97:9200' })"
        >工业安全生产与分析研判系统</div>
      </div>
    </div>
    <div class="w-full h-[40rem] example-bg relative flex flex-col items-center">
      <div class="absolute left-0 top-4rem w-full text-[#f1f1f111] font-bold text-[4rem] text-center">
        SUCCESS CASES
      </div>
      <div class="flex justify-center items-start space-x-4 pt-5rem container text-white">
        <div class="title-bar-white w-1.7rem h-1.7rem"></div>
        <div class="flex flex-col space-y-1 items-center relative top-[-.4rem]">
          <div class="text-2rem font-600">成功案例</div>
          <div class="text-[#fff]">SUCCESS CASES</div>
        </div>
        <div class="title-bar-white w-1.7rem h-1.7rem"></div>
      </div>
      <div class="container flex justify-center mt-3rem space-x-[2rem] px-[6rem] box-border">
        <div v-for="item in 4" :key="item" :class="`card-${item + 1} grow min-w-[3rem] aspect-.75 shadow-md rounded-md hover:scale-102 transition`"></div>
      </div>
    </div>
    <div class="w-full h-4rem bg-white"></div>
    <div class="footer-bg w-full flex justify-center py-3rem min-h-[16rem]">
      <div class="container mb-3rem">
        <div class="px-2 flex justify-between">
          <div class="flex space-x-[5rem] text-white ml-4">
            <div v-for="item in footerMenus" :key="item.id" class="flex flex-col space-y-2 items-start">
              <div class="mb-3">{{ item.title }}</div>
              <div v-for="ele in item.children" :key="ele.id" class="text-.9rem text-[#ffffffc0] hover:text-[#fff] cursor-pointer">
                {{ ele.title }}
              </div>
            </div>
          </div>
          <div class="space-y-3 text-white">
            <div class="flex">
              <div class="logo w-2.4rem h-2.4rem relative top-[.3rem]"></div>
              <div class="pl-1rem text-white flex flex-col items-center">
                <div class="text-1.6rem">工业安全生产数字化产品平台</div>
                <div class="text-.6rem text-[#ffffff80]">DIGITAL PRODUCT PLATFORM FOR INDUSTRIAL SAFETY PRODUCTION</div>
              </div>
            </div>
            <div class="py-4 pl-3.4rem space-y-1">
              <div class="text-1rem text-[#ffffffd0]">产品咨询</div>
              <div class="text-1.2rem font-bold">156-6278-6424</div>
              <div class="text-.8rem text-[#ffffffd0]">工作日：8:30-18:00</div>
            </div>
            <div class="pl-3.4rem text-.8rem text-[#ffffffd0]">扫码关注平台公众号获取更多信息</div>
            <div class="ml-3.4rem text-1.2rem qrcode w-7rem h-7rem">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const carouselItemList = ref<any[]>([
  {
    id: '1',
    title: '机器视觉',
    paragraph: [
      '基于机器视觉技术、视频物联技术、人工智能技术、计算机技术与自动化技术的综合性应用，由光学设备+控制系统+执行机构组成，通过工业机器人和各类传感器的融合应用。',
      '凭借其超越人眼的高精度、高效率、灵活性和可靠性，为工厂生产和管理带来全新的变革，从而提高工厂管理效率，实现企业效益最大化，已经成为智能工厂发展的新趋势。',
      '机器视觉平台在质量检测、安全生产、森林防火、山林生态等业务场景中正在发挥着不可替代的作用。'
    ],
    background: 'para-bg1'
  },
  {
    id: '2',
    title: '车间安全数字化防控',
    paragraph: [
      '车间安防监控通过实时监视和记录车间内的活动和状况，能够及时发现潜在的安全隐患。',
      '例如，通过监控设备的运行情况，可以及时发现设备故障或异常情况，避免因设备故障引发的安全事故。此外，监控还能监测员工的工作状态，防止因疏忽大意或违规操作导致的安全事故发生‌'
    ],
    background: 'para-bg2'
  },
  {
    id: '3',
    title: '工业园区安全生产',
    paragraph: [
      '工业园区的安全生产不仅关乎园区的经济发展和企业的持续运营，更是对员工生命安全的直接保障。通过采取有效的安全管理措施和技术手段，可以显著提升园区的安全生产水平，为园区的长期稳定发展提供坚实的安全保障‌'
    ],
    background: 'para-bg3'
  },
  // {
  //   id: '4',
  //   title: '森林生态综合管理',
  //   paragraph: [
  //     '对企业生产环节的水、电、汽等能源数据进行采集、监控和管理。通过对能源消耗的统计、分析、监测、预测，达到深挖节能潜力，实时监测和推送能耗异常信息的精细化能源管控目标。'
  //   ],
  //   background: 'para-bg4'
  // },
])

// 产品数字底座
const activeProductItem = ref<string>('1')
const handleMouseEnter = (item) => {
  activeProductItem.value = item.id;
}
const productItemList = ref<any[]>([
  {
    id: '1',
    title: '安防中心',
    url: 'http://117.73.12.97:9230',
    paragraph: [
      '通过技术手段和人员管理相结合，旨在提高安全防范能力，确保人员和财产的安全'
    ]
  },
  {
    id: '2',
    title: '监控中心',
    url: 'http://117.73.12.97:9240',
    paragraph: [
      '通过技术手段和人员管理相结合，旨在提高安全防范能力，确保人员和财产的安全'
    ]
  },
  {
    id: '3',
    title: '监控APP',
    url: 'http://117.73.12.97:9090',
    paragraph: [
      '通过技术手段和人员管理相结合，旨在提高安全防范能力，确保人员和财产的安全'
    ]
  },
  {
    id: '4',
    title: '数据分析平台',
    url: 'http://117.73.12.97:9250',
    paragraph: [
      '通过技术手段和人员管理相结合，旨在提高安全防范能力，确保人员和财产的安全'
    ]
  },
  {
    id: '5',
    title: '安全生产信息化',
    paragraph: [
      '通过技术手段和人员管理相结合，旨在提高安全防范能力，确保人员和财产的安全'
    ]
  },
  {
    id: '6',
    title: '工业知识融合平台',
    paragraph: [
      '通过技术手段和人员管理相结合，旨在提高安全防范能力，确保人员和财产的安全'
    ]
  },
])
const handleBtnClick = (item) => {
  if (!item.url) return;
  window.open(item.url)
}

const carouselRef = ref()
onMounted(() => {
  const carouselContainer = document.getElementById("carouselContainer");
  carouselContainer?.addEventListener('wheel', (e) => {
    e.stopPropagation();
    if (!carouselRef.value) return;
    if (e.deltaY > 20) carouselRef.value.next()
    if (e.deltaY < -20) carouselRef.value.prev()
  })
})


// 底部菜单
const footerMenus = ref<any[]>([
  {
    id: '1',
    title: '关于我们',
    children: [
      { id: '1-1', title: '平台简介' },
      { id: '1-2', title: '资质荣誉' },
      { id: '1-3', title: '客户案例' },
      { id: '1-3', title: '新闻中心' },
    ]
  },
  {
    id: '2',
    title: '行业解决方案',
    children: [
      { id: '2-1', title: '机器视觉' },
      { id: '2-2', title: '安全生产' },
      { id: '2-3', title: '森林防火' },
      { id: '2-4', title: '车间安防' },
      { id: '2-5', title: '工业园区' },
      { id: '2-6', title: '智慧工地' },
      { id: '2-7', title: '外包装' },
      { id: '2-8', title: '汽车零部件检测' },
    ]
  },
  {
    id: '3',
    title: '产品中心',
    children: [
      { id: '3-1', title: '机器视觉产品' },
      { id: '3-2', title: '安全生产产品' },
      { id: '3-3', title: '森林防火产品' },
      { id: '3-4', title: '车间安防产品' },
      { id: '3-5', title: '工业园区产品' },
    ]
  },
  {
    id: '4',
    title: '成功案例',
    children: [
      { id: '4-1', title: '机器视觉公司' },
      { id: '4-2', title: '安全生产公司' },
      { id: '4-3', title: '森林防火公司' },
      { id: '4-4', title: '车间安防公司' },
      { id: '4-5', title: '工业园区公司' },
      { id: '4-6', title: '智慧工地公司' },
      { id: '4-7', title: '汽车零部件检测公司' },
    ]
  },
  {
    id: '5',
    title: '合作伙伴',
    children: [
      { id: '5-1', title: '机器视觉公司' },
      { id: '5-2', title: '安全生产公司' },
      { id: '5-3', title: '森林防火公司' },
      { id: '5-4', title: '车间安防公司' },
      { id: '5-5', title: '工业园区公司' },
      { id: '5-6', title: '智慧工地公司' },
      { id: '5-7', title: '汽车零部件检测公司' },
    ]
  },
  {
    id: '6',
    title: '联系我们',
    children: [
      { id: '6-1', title: '联系我们' },
      { id: '6-2', title: '加入我们' },
    ]
  },
])
</script>
<style scoped lang="scss">
.logo {
  background-image: url(./assets/logo.png);
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
}
.digital-bg {
  background-image: url(./assets/digitalBg.png);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.title-bar {
  background-image: url(./assets/titleBar.png);
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
}

.title-bar-white {
  background-image: url(./assets/titleBarWhite.png);
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
}

.linear-bar {
  background-image: url(./assets/linearBar.png);
  background-size: 100% 100%;
}

.example-bg {
  background-image: url(./assets/exampleBg.png);
  background-size: cover;
}

.footer-bg {
  background-image: url(./assets/footerBg.png);
  background-size: cover;
}

@for $i from 1 through 4 {
  .para-bg#{$i} {
    background-image: url(./assets/bg#{$i}.png);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
}

.linear-bg {
  background: linear-gradient(to top, #0678E2, #004EB0);
}


@for $i from 1 through 6 {
  .mask-#{$i} {
    background-image: url(./assets/mask#{$i}.png);
    background-size: cover;
  }
}

@for $i from 1 through 5 {
  .card-#{$i} {
    background-image: url(./assets/card#{$i}.png);
    background-size: 100% 100%;
  }
}

.qrcode {
  background-image: url(./assets/qrcode.png);
  background-size: 90% 90%;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: white;
}

@keyframes topCause {
  0% {
    opacity: 0;
    top: 10px;
  }
  100% {
    opacity: 1;
    top: 0px;
  }
}
.custom-transtion {
  position: relative;
  animation: topCause .5s ease;
}
</style>