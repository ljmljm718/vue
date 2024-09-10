<script setup lang="ts">
import Dplayer from 'dplayer'
import Hls from "hls.js";

// 初始化 Video
const initVideo = (containerId:string, url:string) => {
  const hls = new Hls();
  new Dplayer({
    container: document.getElementById(containerId),
    loop: false,
    autoplay: true,
    volume: 0,
    video: {
      url,
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

const showHeader = ref<boolean>(true)
const checkScroll = () => {
  const dom = document.getElementById('gateWrapper')
  if (!dom) return;
  dom.addEventListener('scroll', () => {
    showHeader.value = !(dom.scrollTop > 1000)
  })
}
onMounted(() => { checkScroll() })

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

const mainTitle = ref<string>('')
const mainDesc = ref<string>('')
const systemFeature = ref<string>('')
const selectedDataId = ref<string>('')
const handleItemChange = (item) => {
  selectedDataId.value = item.id;
  const dataItem = typeDataList.value.find(ele => ele.id === item.id);
  if (!dataItem) return;
  mainTitle.value = dataItem.title;
  mainDesc.value = dataItem.desc;
  systemFeature.value = dataItem.feature;
}
const typeDataList = ref<any[]>([
  {
    id: '1',
    title: '数字模型种植',
    desc: '‌是一种基于物联网和人工智能技术的农业解决方案，它通过将农作物种植最适宜的土壤、气温、虫情等条件数字化，形成“农业知识图谱”，并结合实时数据，实现对农作物生长环境的动态监测和精准管理指导。这种模型的应用显著提升了农作物的品质和产量，增加了农民的收入。',
    feature: '数字模型种植通过集成农业物联网、农业大数据、实时数据监测、精准农业管理等技术手段，实现了农业生产的高效化、智能化和科学化，为农业生产带来了显著的变革和提升‌'
  },
  {
    id: '2',
    title: '智慧农事决策',
    desc: '智慧农业通过其高精确性、高效率、可追溯性和可复制性的特点，不仅提升了农业生产的质量和效率，还保证了农产品的安全性和可追溯性，同时促进了农业生产模式的现代化和标准化，为农业生产和发展带来了革命性的变化‌。',
    feature: '多样化的监测要素、大屏可视化功能提高处理效率、以及远程控制能力，这些特色共同构成了智慧农事决策的独特性。‌这些特色共同支持了农业生产环境的准确监测、智能决策和高效管理，为现代农业的可持续发展提供了有力支撑。'
  },
  {
    id: '3',
    title: '农业一张图',
    desc: '综合不同基地、区域的农作物生产、经营、管理与服务等方面的各项数据资源，以空间地理信息平台为核心，基于数据采集、数据建模、数据集成、数据服务、数据管控和可视化，展现不同区域农业产业发展现状，为掌握当前农业发展实际情况和规划决策提供参考和指导。',
    feature: '该系统通过整合农业相关的空间数据，以地理空间的形式展示和管理，帮助用户了解农业情况和空间分布特征。系统能展示多种与农业相关的信息，并可以叠加展示不同信息的图层，支持农业决策和管理。系统可以实时更新数据，并通过可视化展示方式，使用户更容易理解农业情况。系统还提供多终端适配方案，适应不同终端设备的显示要求。'
  },
  {
    id: '4',
    title: '农业物联网',
    desc: '农业物联网系统是一种基于物联网技术，集数据监测、远程控制和智能分析为一体的现代化农业管理系统。该系统以整合农业信息化数据为原则，集成了各种传感器、设备和数据源，经过互联网连接并收集相关农业数据。通过统一管理、统一部署、统一规划，搭建了包含“底层数据+业务系统+终端应用+分析系统+可视化系统”的区域数字农业产品体系。',
    feature: '该大数据平台实现了各类农业数据的整合与分析，包括传感器、气象、土壤墒情等信息。通过先进的数据处理技术，为农业生产提供精准全面的支持。同时，系统可实时监测农田各项指标，预测作物生长趋势和病虫害风险。具有个性化定制、模块化功能，可快速搭建。开放式架构保证了强大的兼容性，支持多种传感器和传输方式的接入。'
  },
  {
    id: '5',
    title: '农业资源',
    desc: '农业资源需要科学评估资源的供应状况和需求量，制定合理的资源利用计划，通过技术手段提高资源的利用效率，同时要考虑到资源的可持续性，避免资源的过度开采和利用。农业资源管理是农业生产管理的重要组成部分，旨在依据农业生产的规律和农业科技的成果，进行科学决策、合理布局、有效控制，以达到提高农业生产效率、保障农业产品质量、实现农业经济效益的目标‌。',
    feature: '农业资源管理系统是一种综合性的计算机系统，旨在管理和优化农业资源，以提高农业生产效率、降低资源消耗和减少环境影响。这种系统架构有助于实现农业生产的精细化管理，提高生产效率和资源利用效率，同时降低环境影响，对于保障国家粮食安全、推动农业现代化和促进可持续发展具有重要意义‌。'
  },
  {
    id: '6',
    title: '农业认养',
    desc: '通过物联网技术和移动互联网，消费者可以线上“认养”农场中的作物或家畜，并通过远程监控技术实时了解其生长状况，这种透明化的生产方式不仅让消费者感到新鲜和有趣，还能确保产品的安全性和质量‌。通过直接对接消费者，减少了中间环节，提高了农产品的价格竞争力。同时，利用社交媒体分享功能，增加品牌曝光度，吸引更多的潜在客户‌',
    feature: '提升消费者体验、增强农业可持续性、拓宽销售渠道、直接参与农耕过程、新鲜健康、透明生产、支持本地农业、生态环保。农业认养系统不仅为消费者提供了新鲜、健康的农产品和良好的消费体验，同时也为农民带来了稳定的收入来源和更广阔的市场空间，促进了农业的可持续发展。'
  },
])
handleItemChange(typeDataList.value[0])
</script>
<template>
  <div
    class="w-full box-border relative overflow-y-auto h-100vh system-info-wrapper"
    id="gateWrapper"
  >
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
        <div class="text-3rem">{{ mainTitle }}</div>
        <div class="w-[43rem] text-.9rem mt-1.2rem h-5rem">
          {{ mainDesc }}
        </div>
        <div class="w-full h-2rem mt-7rem flex justify-center items-start space-x-1rem">
          <div class="left-icon w-.6rem h-1rem relative top-.1rem"></div>
          <div class="flex">
            <div
              v-for="item in typeDataList"
              :key="item.id"
              :class="`flex flex-col items-center space-y-2rem cursor-pointer transition ${
                selectedDataId === item.id ? 'text-#fff' : 'text-#a1a1a1'
              }`"
              @click="handleItemChange(item)"
            >
              <div
                class="w-full relative mt-.6rem"
                style="border-top: 2px dashed #a1a1a1;"
              >
                <div
                  class="w-1.6rem h-1.6rem absolute top-[-.8rem] rounded-full box-border p-2"
                  :style="`left: calc(50% - .8rem);border: 2px solid ${
                    selectedDataId === item.id ? '#fff' : '#a1a1a1'
                  };`"
                >
                  <div class="bg-white w-full h-full rounded-full"></div>
                </div>
              </div>
              <div class="px-3rem">{{ item.title }}</div>
            </div>
          </div>
          <div class="right-icon w-.6rem h-1rem relative top-.1rem"></div>
        </div>
      </div>
    </div>

    <!-- 视频展示 -->
    <div class="w-full flex flex-col justify-center items-center bg-#318255 text-white py-6rem">
      <div class="flex flex-col space-y-1 items-center mt-3 mb-[1rem]">
        <div class="text-1.8rem">视频展示</div>
        <div class="text-#fff text-.7rem">VIDEO DISPLAY</div>
      </div>
      <div class="container flex justify-center mt-1rem">
        <div class="bg-black aspect-video h-30rem" id="videoDom"></div>
      </div>
    </div>

    <!-- 系统特色 -->
    <div class="w-full flex flex-col justify-center items-center py-6rem bg-#dfe9e9">
      <div class="container box-border px-4rem">
        <div>系统特色</div>
        <div>SYSTEM FEATURES</div>
        <div>{{ systemFeature }}</div>
      </div>
    </div>

    <!-- 解决农业问题 -->
    <div class="w-full flex flex-col justify-center items-center py-4rem">
      <div class="flex flex-col space-y-1 items-center mt-3 mb-[5rem]">
        <div class="text-[40px]">解决农业问题</div>
        <div class=" text-[18px] text-#999999">ADDRESSING AGRICULTURAL ISSUES</div>
      </div>
      <div class="container">
        <div class="flex justify-center items-center mb-[4rem]">
          <div class='w-45% flex flex-col p-[2rem] '>
            <div class="text-[24px] mb-[1rem] ml-[3rem]">
              <span class="text-#318255 font-bold pr-3">01</span>
              实时观测土地
            </div>
            <div class="grid grid-cols-3 mt-[3rem]  space-y-3 text-[18px]">
              <div class="flex flex-col justify-center items-center space-y-3 mt-[12px]">
                <div class=" w-5rem h-5rem mb-[1rem] watchSoil1-bg"></div>
                <div>熵情早知道</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3">
                <div class="watchSoil2-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>智能决策</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3">
                <div class="watchSoil3-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>降低损失</div>
              </div>

            </div>
          </div>
          <div class='w-50%  solve-bg1 h-20rem'></div> 
        </div>
        <div class="flex justify-center items-center mb-[4rem]">
          <div class='w-50%  solve-bg2 h-20rem'></div> 
          <div class='w-45% flex flex-col p-[2rem] '>
            <div class="text-[24px] mb-[1rem] ml-[3rem]">
              <span class="text-#318255 font-bold pr-3">02</span>
              农业种植信息一键直报
            </div>
            <div class="grid grid-cols-3 mt-[3rem]  space-y-3 text-[18px]">
              <div class="flex flex-col justify-center items-center space-y-3 mt-[12px]">
                <div class="report1-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>专家咨询</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3 ">
                <div class="report2-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>数据定制</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3 ">
                <div class="report3-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>智慧种植</div>
              </div>

            </div>
          </div>
          
        </div>
        <div class="flex justify-center items-center mb-[4rem]">
          <div class='w-45% flex flex-col p-[2rem] '>
            <div class="text-[24px] mb-[1rem] ml-[3rem]">
              <span class="text-#318255 font-bold pr-3">03</span>
              专业定制平台
            </div>
            <div class="grid grid-cols-3 mt-[3rem]  space-y-3 text-[18px]">
              <div class="flex flex-col justify-center items-center space-y-3 mt-[12px]">
                <div class="platform1-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>多终端</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3">
                <div class="platform2-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>统一门户</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3">
                <div class="platform3-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>多租户</div>
              </div>
            </div>
          </div>
          <div class='w-50%  solve-bg3 h-20rem'></div> 
        </div>
        <div class="flex justify-center items-center mb-[3rem]">
          <div class='w-50% solve-bg4 h-20rem'></div> 
          <div class='w-45% flex flex-col p-[2rem] '>
            <div class="text-[24px] mb-[1rem] ml-[3rem]">
              <span class="text-#318255 font-bold pr-3">04</span>
              数字化管理
            </div>
            <div class="grid grid-cols-3 mt-[3rem]  space-y-3 text-[18px]">
              <div class="flex flex-col justify-center items-center space-y-3 mt-[12px]">
                <div class="manage1-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>全方位监测</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3 ">
                <div class="manage2-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>实时物联</div>
              </div>
              <div class="flex flex-col justify-center items-center space-y-3 ">
                <div class="manage3-bg w-5rem h-5rem mb-[1rem]"></div>
                <div>数字化管理</div>
              </div>

            </div>
          </div>
          
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
.system-info-wrapper {
  scroll-snap-type: y mandatory;
  overflow: auto;
  div {
    scroll-snap-align: start;
  }
}

.left-icon {
  background-image: url(./assets/new/left.png);
  background-size: 100% 100%;
}

.right-icon {
  background-image: url(./assets/new/right.png);
  background-size: 100% 100%;
}

@for $i from 1 through 7 {
  .bg-#{$i} {
    background-image: url(./assets/new/bg#{$i}.png);
    background-size: cover;
  }
}

.qr-code {
  background-image: url(./assets/new/qrcode.png);
  background-size: contain;
}
@for $i from 1 through 4 {
  .solve-bg#{$i} {
    background-image: url(./assets/new/solve#{$i}.png);
    background-size: cover;
  }
}
@for $i from 1 through 3 {
  .watchSoil#{$i}-bg{
    background-image: url(./assets/new/watchSoil#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .report#{$i}-bg{
    background-image: url(./assets/new/report#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .platform#{$i}-bg{
    background-image: url(./assets/new/platform#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .manage#{$i}-bg{
    background-image: url(./assets/new/manage#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
// @media (max-width:1722px) {
//   .content{
//     flex-direction: column;
//   }
  
//   .left-content {
//     width: 100%; 
//   }
//   .right-content{
//     width: 100%;
//     height: 65%;
//      display: block;
//   }
// }

</style>