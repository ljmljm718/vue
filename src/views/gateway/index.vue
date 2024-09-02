<script setup lang="ts">// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const modules = [FreeMode, Pagination]

// 示范村ref
const buildRef = ref()
const handleTurn = (val) => {
  console.log("🚀 ~ handleTurn ~ buildRef.value:", buildRef.value)
  if (!buildRef.value) return
  if (val > 0) buildRef.value.slideNext();
  else buildRef.value.slidePrev();
}
  

const selectedCardId = ref<string>('1')
const cardDataList = ref<any[]>([
  { id: '1', label: '示范村', value: '39', desc: '基于自主可控的数字孪生技术、物联管控技术、人工智能、数据挖掘、边缘计算、GIS遥感监测等多种技术手段融合实现精准帮扶' },
  { id: '2', label: '帮扶区县', value: '14' },
  { id: '3', label: '精准帮扶基地', value: '19' },
  { id: '4', label: '产业形态', value: '11' },
])

const showHeader = ref<boolean>(true)
const checkScroll = () => {
  const dom = document.getElementById("homeContainer")
  if (dom) dom.addEventListener('scroll', () => {
    console.log("🚀 ~ checkScroll ~ dom.scrollTop:", dom.scrollTop)
    showHeader.value = !(dom.scrollTop > 1000);
  })
}
onMounted(() => {
  checkScroll()
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
      },
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
      },
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
      },
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
      },
    ]
  },
]);

// 政府政策
const govPolicyDataList = ref<any[]>([
  {
    id: '1',
    title: '中共重庆市委、重庆市人民政府印发 《重庆市建设深化集体…',
    content: '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  },
  {
    id: '2',
    title: '关于学习运用“千村示范、万村整治”工程经验加快建设巴渝…',
    content: '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  },
  {
    id: '3',
    title: '重庆市人民政府办公厅印发《关于推进生产供销信用“三位一…',
    content: '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  },
  {
    id: '4',
    title: '开展国际农业合作 共享农业发展机遇：镜头里的共建“一带一路”',
    content: '为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我际…',
    year: '2024',
    date: '06-30'
  },
])
</script>
<template>
  <div class="w-full box-border relative overflow-y-auto h-100vh" id="homeContainer">
    <div :class="`fixed left-0 w-full flex justify-center transition-all duration-1000 box-border backdrop-blur-2xl ${showHeader ? 'top-0' : 'top-[-100%]'}`">
      <div class="container flex items-center p-5 space-x-1rem">
        <div class="icon w-2.4rem h-2.4rem"></div>
        <div class="text-white">
          <div class="text-1.4rem">鲁渝协作乡村振兴示范村数字化赋能工程</div>
          <div class="text-.8rem relative left-.3rem text-[#f1f1f1c0]">Lu Yu Collaborative Rural Revitalization Village Digital Empowerment Project</div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center items-center h-100vh bg-1 text-white">
      <div class="container px-3 box-border">
        <div class="text-3rem">数字农业一体化管理平台</div>
        <div class="w-[43rem] text-.9rem mt-1.2rem">
          基于自主可控的数字孪生技术、物联管控技术、云计算、人工智能、数据挖掘、边缘计算、GIS遥感监测、增强现实等多种技术手段融合，构建全流程的新型农业一体化管理平台
        </div>
        <div class="flex mt-10rem text-#318255">
          <div class="rounded-full p-[2px] overflow-hidden w-6.6rem bg-white text-.9rem flex justify-between">
            <div class="px-2 py-1">系统介绍</div>
            <div class="aspect-1 h-full bg-#318255 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center items-center h-100vh bg-2">
      <div class="container flex flex-row-reverse relative px-2rem box-border">
        <div id="mapChart" class="h-68vh w-68vh bg-[#25546b80]"></div>
        <div class="absolute left-2rem top-0 text-white text-2.4rem space-y-3">
          <div>打造100个鲁渝协作乡村振兴示范镇</div>
          <div>打造100个鲁渝协作特色产业园区</div>
          <div>培育100个鲁渝协作品牌</div>
          <div class="text-1rem text-[#f1f1f1d0]">强化产业协作，实施“东产西移“，大力推动区域协同发展</div>
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
      <div class="container flex justify-center relative top-[-1.6rem] space-x-3">
        <div
          :class="`${
            selectedCardId === item.id ? 'items-start w-26rem px-2rem' : 'w-8rem items-center'
          } h-17rem flex flex-col justify-center space-y-5 transition-all bg-[#00682Ec0] text-white`"
          v-for="item in cardDataList"
          :key="item.id"
          @mouseenter="selectedCardId = item.id"
        >
          <div class="text-2.2rem">{{ item.value }}</div>
          <div class="text-1rem">{{ item.label }}</div>
          <div v-show="selectedCardId === item.id">
            {{ item.desc ?? '' }}
          </div>
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
            clickable: true,
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
    <div class="w-full flex flex-col items-center justify-center bg-[#fff] h-100vh">
      <div class="container">
        <div class="flex flex-col items-center space-y-1">
          <div class="text-1.8rem">示范村建设数据</div>
          <div class="text-#666 text-.7rem">DEMONSTRATION VILLAGE CONSTRUCTION DATA</div>
        </div>
      </div>
      <div class="w-full overflow-hidden pt-2rem">
        <swiper
          :slidesPerView="3"
          :spaceBetween="30"
          :freeMode="true"
          :pagination="{
            clickable: true,
          }"
          :modules="modules"
          class="mySwiper"
        >
          <swiper-slide>
            <div class="w-full h-18rem table-bg bg-red mb-2rem"></div>
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

    <!-- 对口帮扶地域 这块真是想要我老命了 -->
    <div class="w-full bg-[#eaeaec]"></div>

    <!-- 帮扶产业 -->
    <div class="w-full h-100vh bg-5 flex items-center justify-center">
      <div class="flex flex-col items-center space-y-1">
        <div class="text-1.8rem">帮扶产业</div>
        <div class="text-#666 text-.7rem">TARGETED ASSISTANCE REGIONS</div>
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
            <div class="line-clamp-1">中共重庆史农村工作实施乡村振兴战略领导小组关于2024年东西…</div>
            <div class="text-.7rem mt-1 pl-1 text-[#666] line-clamp-3">中共中央总书记、国家主席、中央军委主席习近平近日在重庆考察时强调，重庆要对标新时代新征程党的中心任务和党中央赋予的使命，充分发挥比较优势、后发优势，进一步全面深化改革开放，主动服务和融入新发…</div>
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <div
            v-for="item in govPolicyDataList"
            :key="item.id"
            class="flex items-center bg-white h-4.7rem "
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
      <div class="flex flex-col space-y-1 items-center mt-3">
        <div class="text-1.8rem">数字农业综合解决案例</div>
        <div class="text-#666 text-.7rem">COMPREHENSIVE SOLUTION CASE OF DIGITAL AGRICULTURE</div>
      </div>
      <div class="w-full bg-red py-1.4rem">SS</div>
    </div>

    <!-- Footer -->
    <div class="w-full flex flex-col justify-center items-center bg-7 text-white">
      <div class="container box-border flex justify-between items-center mt-7 px-2rem">
        <div class="flex items-center py-5 space-x-1rem">
          <div class="icon w-2.4rem h-2.4rem"></div>
          <div class="text-white">
            <div class="text-1.4rem">鲁渝协作乡村振兴示范村数字化赋能工程</div>
            <div class="text-.8rem relative left-.3rem text-[#f1f1f1c0]">Lu Yu Collaborative Rural Revitalization Village Digital Empowerment Project</div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="text-.9rem">联系我们</div>
          <div class="text-1.2rem font-bold">182-0647-2165</div>
        </div>
      </div>
      <div class="container box-border flex justify-between items-start py-3rem text-white px-2rem pl-5.3rem">
        <div class="flex space-x-3rem items-start">
          <div
            v-for="item in footerData"
            :key="item.id"
          >
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
        style="border-top: 1px solid #f1f1f110;"
      >Copyright © 2024 zhinengshengchan. | 鲁ICP备17022090号  |  ©2024 山东浪潮智能生产技术有限公司</div>
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
  background-size: cover;
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
</style>
<style>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

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
  transition: all .2s ease;
}
</style>