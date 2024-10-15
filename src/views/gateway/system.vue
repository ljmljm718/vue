<script setup lang="ts">
import Dplayer from 'dplayer'
import Hls from "hls.js";
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, FreeMode, Pagination, Navigation } from 'swiper/modules';
// import required modules
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

onMounted(() => {
  // initVideo('videoDom', '/public/video1/output.m3u8')
})

const currentIndex = ref<number>(1)
const handleVideoChange = (flag:number) => {
  if (currentIndex.value === 1 && flag < 0) return
  if (currentIndex.value === 6 && flag > 0) return
  currentIndex.value = flag + currentIndex.value
  if (currentIndex.value <= 0) {
    currentIndex.value = 1
  }
  if (currentIndex.value > 6) {
    currentIndex.value = 6
  }
  const url = `/public/video${currentIndex.value}/output.m3u8`
  initVideo('videoDom', url)
}

// const showHeader = ref<boolean>(true)
// const checkScroll = () => {
//   const dom = document.getElementById('gateWrapper')
//   if (!dom) return;
//   dom.addEventListener('scroll', () => {
//     showHeader.value = !(dom.scrollTop > 1000)
//   })
// }
// onMounted(() => { checkScroll() })

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
const activePoster = ref<string>('bg-1')
const handledDataList = ref<any[]>([]);

const handleItemChange = (item) => {
  selectedDataId.value = item.id;
  const dataItem = typeDataList.value.find(ele => ele.id === item.id);
  if (!dataItem) return;
  mainTitle.value = dataItem.title;
  mainDesc.value = dataItem.desc;
  activePoster.value = item.poster;
  systemFeature.value = dataItem.feature;
  //农业特色
  handledDataList.value = dataItem.cards.map(card => ({
    ...card,
    parentId: dataItem.id || null
  }))

  if (item.video) nextTick(() => {
    initVideo('videoDom', item.video)
  })
}

const typeDataList = ref<any[]>([
  {
    id: '1',
    title: '数字模型种植',
    video: '/public/video5/output.m3u8',
    poster: 'poster-4',
    desc: '‌是一种基于物联网和人工智能技术的农业解决方案，它通过将农作物种植最适宜的土壤、气温、虫情等条件数字化，形成“农业知识图谱”，并结合实时数据，实现对农作物生长环境的动态监测和精准管理指导。这种模型的应用显著提升了农作物的品质和产量，增加了农民的收入。',
    feature: '数字模型种植通过集成农业物联网、农业大数据、实时数据监测、精准农业管理等技术手段，实现了农业生产的高效化、智能化和科学化，为农业生产带来了显著的变革和提升‌',
    cards: [
      {
        'subId': '1',
        'subTitle': '多维融合',
        'subInfo': '该系统可以提供不同尺度（如微观、中观和宏观）的三维农业场景展示，包含：WEBGL网络版、PC版、VR版等多种平台的客户端，极大地适应各种需求，方便用户在不同尺度间自由切换，使得决策更加精准、全面。'
      },
      {
        'subId': '2',
        'subTitle': '实时同步',
        'subInfo': '基于实时感知等多元数据的获取，孪生系统可以全面、准确、动态地反映物理对象的状态变化，包括外观、性能、位置、异常等。'
      },
      {
        'subId': '3',
        'subTitle': '虚实映射',
        'subInfo': '数字孪生技术要求物理对象在数字空间的数字化表示，现实世界中的物理对象和数字空间中的孪生可以实现双向映射、数据连接和状态交互。'
      }
    ]
  },
  {
    id: '2',
    title: '智慧农事决策',
    video: '/public/video4/output.m3u8',
    poster: 'poster-5',
    desc: '智慧农业通过其高精确性、高效率、可追溯性和可复制性的特点，不仅提升了农业生产的质量和效率，还保证了农产品的安全性和可追溯性，同时促进了农业生产模式的现代化和标准化，为农业生产和发展带来了革命性的变化‌。',
    feature: '多样化的监测要素、大屏可视化功能提高处理效率、以及远程控制能力，这些特色共同构成了智慧农事决策的独特性。‌这些特色共同支持了农业生产环境的准确监测、智能决策和高效管理，为现代农业的可持续发展提供了有力支撑。',
    cards: [
      {
        'subId': '1',
        'subTitle': '实时监控报警',
        'subInfo': '系统可以对农业生产进行实时监控和预警，及时发现和解决问题，确保农业生产顺利进行。通过引入物联网技术，系统可以实现远程监控和管理，从而大大提高管理效率。'
      },
      {
        'subId': '2',
        'subTitle': '多源数据整合',
        'subInfo': '基于实时感知等多元数据的系统可以整合多源农业数据，包括气象数据、土壤数据、作物数据等，实现多领域数据的交叉分析和综合利用。通过数据的整合，系统能够提供更全面、准确的决策支持。获取，孪生系统可以全面、准确、动态地反映物理对象的状态变化，包括外观、性能、位置、异常等。'
      },
      {
        'subId': '3',
        'subTitle': '智能化决策',
        'subInfo': '系统利用人工智能技术，自动化地处理和分析农业数据，提供智能化的决策支持。通过机器学习和模型优化，系统能够学习和适应不断变化的农业环境，为决策者提供个性化的决策建议。'
      },
      {
        'subId': '4',
        'subTitle': '多设备集成',
        'subInfo': '系统集成了物联网、大数据、云计算、人工智能等先进技术，通过多样化的监测要素和远程控制功能，实现了农业生产的高效和智能化。'
      }
    ]
  },
  {
    id: '3',
    title: '农业一张图',
    video: '/public/video6/output.m3u8',
    poster: 'poster-6',
    desc: '综合不同基地、区域的农作物生产、经营、管理与服务等方面的各项数据资源，以空间地理信息平台为核心，基于数据采集、数据建模、数据集成、数据服务、数据管控和可视化，展现不同区域农业产业发展现状，为掌握当前农业发展实际情况和规划决策提供参考和指导。',
    feature: '该系统通过整合农业相关的空间数据，以地理空间的形式展示和管理，帮助用户了解农业情况和空间分布特征。系统能展示多种与农业相关的信息，并可以叠加展示不同信息的图层，支持农业决策和管理。系统可以实时更新数据，并通过可视化展示方式，使用户更容易理解农业情况。系统还提供多终端适配方案，适应不同终端设备的显示要求。',
    cards: [
      {
        'subId': '1',
        'subTitle': '可视化展示',
        'subInfo': '系统通过地图的可视化展示方式，将农业信息以直观的图形、符号和颜色进行展示，使用户能够更容易理解和把握农业情况。用户可以通过地图进行缩放、平移和标记等操作，以获得所需的详细信息，并进行交互式的数据查询和分析。'
      },
      {
        'subId': '2',
        'subTitle': '多维信息展示',
        'subInfo': '系统能够展示多种与农业相关的信息，包括土地类型、农作物种植情况、灌溉设施分布、气象条件、农产品销售等。这些多维信息可以通过地图上的图层进行叠加和展示，帮助用户全面了解农业领域的各个方面，支持农业决策和管理。'
      },
      {
        'subId': '3',
        'subTitle': '实时数据同步',
        'subInfo': '系统可以与实时数据源进行连接，获取最新的农业数据，并及时更新地图上的信息。如：实时获取气象数据，实时监测农田的土壤湿度和作物生长情况，以及农产品销售变化等。'
      },
      {
        'subId': '4',
        'subTitle': '多终端兼容',
        'subInfo': '系统提供多种终端适配方案，可以根据不同终端设备的屏幕尺寸和分辨率进行自适应布局和显示。无论是在PC端还是大屏设备上，系统都能够调整界面布局和元素大小，以适应不同终端的显示要求。'
      }
    ]
  },
  {
    id: '4',
    title: '农业物联网',
    video: '/public/video1/output.m3u8',
    poster: 'poster-7',
    desc: '农业物联网系统是一种基于物联网技术，集数据监测、远程控制和智能分析为一体的现代化农业管理系统。该系统以整合农业信息化数据为原则，集成了各种传感器、设备和数据源，经过互联网连接并收集相关农业数据。通过统一管理、统一部署、统一规划，搭建了包含“底层数据+业务系统+终端应用+分析系统+可视化系统”的区域数字农业产品体系。',
    feature: '该大数据平台实现了各类农业数据的整合与分析，包括传感器、气象、土壤墒情等信息。通过先进的数据处理技术，为农业生产提供精准全面的支持。同时，系统可实时监测农田各项指标，预测作物生长趋势和病虫害风险。具有个性化定制、模块化功能，可快速搭建。开放式架构保证了强大的兼容性，支持多种传感器和传输方式的接入。',
    cards: [
      {
        'subId': '1',
        'subTitle': '个性化定制',
        'subInfo': '个性化定制，功能模块化，自有组合，快速搭建。'
      },
      {
        'subId': '2',
        'subTitle': '大数据整合',
        'subInfo': '整合各类农业相关数据，如传感器数据、气象数据、土壤墒情、病虫害数据等。通过大数据分析技术，平台可以对这些数据进行处理和挖掘，提取有价值的信息和知识，为农业生产提供准确、全面的数据支持。'
      },
      {
        'subId': '3',
        'subTitle': '实时监测预警',
        'subInfo': '数字孪生技术要求物理对象在数系统可以实时监测农田的各项指标，如作物生长状态、气象变化、土壤水分等。基于历史数据和模型算法，平台能够进行预测和预警，提供农作物生长趋势、病虫害风险等预测信息。字空间的数字化表示，现实世界中的物理对象和数字空间中的孪生可以实现双向映射、数据连接和状态交互。'
      },
      {
        'subId': '4',
        'subTitle': '多设备兼容',
        'subInfo': '该系统采用开放式架构，具有良好的扩展性，兼容性强，可接入市面常规传感器，支持多种传输方式。'
      }
    ]
  },
  {
    id: '5',
    title: '农业资源',
    video: '/public/video2/output.m3u8',
    poster: 'poster-8',
    desc: '农业资源需要科学评估资源的供应状况和需求量，制定合理的资源利用计划，通过技术手段提高资源的利用效率，同时要考虑到资源的可持续性，避免资源的过度开采和利用。农业资源管理是农业生产管理的重要组成部分，旨在依据农业生产的规律和农业科技的成果，进行科学决策、合理布局、有效控制，以达到提高农业生产效率、保障农业产品质量、实现农业经济效益的目标‌。',
    feature: '农业资源管理系统是一种综合性的计算机系统，旨在管理和优化农业资源，以提高农业生产效率、降低资源消耗和减少环境影响。这种系统架构有助于实现农业生产的精细化管理，提高生产效率和资源利用效率，同时降低环境影响，对于保障国家粮食安全、推动农业现代化和促进可持续发展具有重要意义‌。',
    cards: [
      {
        'subId': '1',
        'subTitle': '高精度定位',
        'subInfo': '利用GPS等高精度定位技术，数字农业地图能够实现对农田位置的精确标定，为农业生产提供精确的空间信息支持'
      },
      {
        'subId': '2',
        'subTitle': '可视化表达',
        'subInfo': '通过地图可视化技术，数字农业地图能够将复杂的农田信息以直观、易懂的方式呈现出来,如作物分布图、土壤养分图、病虫害预警图等，方便农业生产者和管理者快速了解农田状况'
      },
      {
        'subId': '3',
        'subTitle': '空间数据分析',
        'subInfo': '借助GIS等空间分析技术，数字农业地图能够对农田空间数据进行深度挖掘和分析，揭示农田资源的空间分布规律、作物生长的空间变异特征等'
      },
      {
        'subId': '4',
        'subTitle': '精准管理',
        'subInfo': '通过现代信息技术手段，如物联网、大数据和人工智能等，实现对农资库存的精准监测和管理。这包括对农资品种、数量、质量以及存放位置等信息的精确记录，确保库存数据的准确性'
      }
    ]
  },
  {
    id: '6',
    title: '农业认养',
    video: '',
    poster: 'poster-9',
    desc: '通过物联网技术和移动互联网，消费者可以线上“认养”农场中的作物或家畜，并通过远程监控技术实时了解其生长状况，这种透明化的生产方式不仅让消费者感到新鲜和有趣，还能确保产品的安全性和质量‌。通过直接对接消费者，减少了中间环节，提高了农产品的价格竞争力。同时，利用社交媒体分享功能，增加品牌曝光度，吸引更多的潜在客户‌',
    feature: '提升消费者体验、增强农业可持续性、拓宽销售渠道、直接参与农耕过程、新鲜健康、透明生产、支持本地农业、生态环保。农业认养系统不仅为消费者提供了新鲜、健康的农产品和良好的消费体验，同时也为农民带来了稳定的收入来源和更广阔的市场空间，促进了农业的可持续发展。',
    cards: [
      {
        'subId': '1',
        'subTitle': '透明监控',
        'subInfo': '消费者可以直接了解农产品的生产过程，包括种植、养护、收获等各个环节，增加了食品安全的透明度。'
      },
      {
        'subId': '2',
        'subTitle': '参与体验',
        'subInfo': '消费者参与农业生产的过程，为消费者提供了学习农业知识、体验农业文化和参与农业交流的平台。'
      },
      {
        'subId': '3',
        'subTitle': '互动体验',
        'subInfo': '消费者可以亲自参与农事活动，如施肥、浇水、收割等，增强与自然的联系，体验农耕文化。'
      },
      {
        'subId': '4',
        'subTitle': '方式灵活',
        'subInfo': '系统为消费者提供了多种认养方式，可托管，可租赁，可赠送好友，可部分认养，可全部认养等多种途径。'
      }
    ]
  },
  {
    id: '7',
    title: '数字产销',
    video: '/public/video3/output.m3u8',
    poster: 'poster-10',
    desc: '‌在数字经济视域下，那些兼具生产功能的消费者，他们通过参与生产服务活动来创造价值，同时通过消费活动来享用价值。这类个体在数字经济的土壤中找到了丰厚的生存空间，既作为生产者参与价值的创造，又作为消费者享受价值。数字经济的发展为这类产消者提供了丰富的机会和平台，使得他们能够在生产和消费两个层面上都发挥重要作用，推动了数字经济和社会的进步‌。',
    feature: '‌数字产销特色主要体现在利用数字技术赋能经济社会发展，形成“新领域、新赛道”和“新动能、新优势”，成为驱动乡村振兴的重要力量。‌数字技术通过为农业现代化提供支持，如通过“一码溯源”实现智慧龙井的追溯，以及利用数字技术助力农产品销售步入“快车道”，展现了数字产销在促进农业发展方面的独特作用。',
    cards: [
      {
        'subId': '1',
        'subTitle': '精准控制',
        'subInfo': '过机器视觉技术、物联网技术和自动控制技术等手段，智慧车间可以实现对农产品加工过程的精准控制。'
      },
      {
        'subId': '2',
        'subTitle': '实时监测',
        'subInfo': '采用智能设备实现生产环境的实时监测和调控，如温湿度、光照等参数的精确控制，从而进一步提高产品质量。'
      },
      {
        'subId': '3',
        'subTitle': '品牌建设',
        'subInfo': '通过品牌故事、产品认证、消费者评价等方式增强消费者对农产品的信任度和忠诚度。'
      },
      {
        'subId': '4',
        'subTitle': '渠道多元化',
        'subInfo': '智慧销售利用电商平台、社交媒体等渠道进行农产品销售，打破了传统销售模式的时空限制消费者可以通过网络直接购买到需要的农产品，享受便捷的购物体验。'
      },
      {
        'subId': '5',
        'subTitle': '精准分析',
        'subInfo': '通过大数据分析消费者的购买行为和偏好，精准预测市场需求和趋势。这有助于农民和农产品企业根据市场需求调整种植结构和生产计划，提高市场竞争力。'
      }
    ]
  }
])
handleItemChange(typeDataList.value[0])

/*
  顶部banner
  第一屏的样式和原来保持一致
  第二屏 保留图标 每个tab字体是白色
  第三屏往后 背景白色 图标 每个tab字体是黑色
*/
const videoRef = ref<any>(null);
const firstRef = ref<any>(null);
const bannerStyle = ref<number>(1);

// 根据滚动高度切换顶部banner样式
const changeBannerStyle = () => {
  const wrapDom = document.getElementById("gateWrapper");
  if (!wrapDom || !firstRef.value || !videoRef.value) return;
  const firstHeight = firstRef.value.scrollHeight;
  const videoHeight = videoRef.value.scrollHeight;

  wrapDom.addEventListener('scroll', () => {
    if (wrapDom.scrollTop < firstHeight) {
      bannerStyle.value = 1;
    } else if (wrapDom.scrollTop >= ( firstHeight + videoHeight )) {
      bannerStyle.value = 3;
    } else {
      bannerStyle.value = 2;
    }
  })
};

// 顶部Banner切换事件
const handleItemChangeBanner = (item) => {
  handleItemChange(item);
  const wrapDom = document.getElementById("gateWrapper");
  if (!wrapDom) return;
  wrapDom.scrollTop = 0;
};

onMounted(() => { changeBannerStyle() });

// 系统亮点数组
const curHighlight = ref<number>(0);
const highlights = ref<any[]>([{
  title: "标准化种植",
  content: "制定标准化种植规范，包括种植环境、种植技术、施肥方式、农药使用等方面。根据作物种植周期，按标准进行农事操作。"
}, {
  title: "标准化管理",
  content: "跟踪农产品生产记录，统一管理包括作物品种、种植信息、农药使用、采摘情况等信息，提高农业生产效率，降低生产成本。"
}, {
  title: "全过程追溯",
  content: "建立溯源档案，溯源档案覆盖生产、加工、质检等主要环节，包含品牌、产品认证、农事记录、环境数据、生长期图片、实时视频等。"
}, {
  title: "智能控制",
  content: "实时监测基地数据，并设定阈值区间，数值超出阈值区间，如气温过高，水阀自动开启，气温降低到正常阈值，则自动关闭，精准控制种植环境指标。"
}, {
  title: "数据支撑",
  content: "农产品溯源系统将采集的涉农数据进行数据分析和共享，为推动农业产业的向数字化和智能化转型提供数据支撑，提高农业生产和管理效率，促进农业可持续发展。"
}, {
  title: "提升品牌形象",
  content: "根据特色农产品的产品亮点等优势，可提供专属品牌包装、二维码设计等服务，助力打造特色农产品品牌，提升品牌形象。"
}]);
</script>
<template>
  <div class="w-full box-border relative overflow-y-auto h-100vh system-info-wrapper" id="gateWrapper">
    <!-- 顶部 banner -->
    <div class="fixed left-0 w-full flex justify-center transition-all duration-1000 box-border top-0 z-999">
      <!-- 第一屏的banner -->
      <div v-show="bannerStyle === 1" class="container flex items-center p-5 space-x-1rem">
        <div class="icon w-2.4rem h-2.4rem"></div>
        <div class="text-white">
          <div class="text-1.4rem">鲁渝协作乡村振兴示范村数字化赋能工程</div>
          <div class="text-.8rem relative left-.3rem text-[#f1f1f1c0]">Lu Yu Collaborative Rural Revitalization Village
            Digital Empowerment Project</div>
        </div>
      </div>
      <!-- 不是第一屏的banner -->
      <div
        v-show="bannerStyle !== 1"
        :class="`w-full flex items-center justify-around px-40 transition-all duration-300 ${ bannerStyle === 3 && 'bg-white banner-shadow' }`"
      >
        <div class="icon w-2.4rem h-2.4rem"></div>
        <div v-for="item in typeDataList" :key="item.id" class="banner-btns h-[60px] leading-[60px] relative">
          <!-- 四个按钮同时只显示一个 -->
          <button
            v-show="selectedDataId === item.id && bannerStyle === 2"
            @click="handleItemChangeBanner(item)"
            class="text-white opacity-100 text-[1.125rem]"
          >
            {{ item.title }}
          </button>
          <button
            v-show="selectedDataId !== item.id && bannerStyle === 2"
            @click="handleItemChangeBanner(item)"
            class="text-white opacity-70 text-[1.125rem]"
          >
            {{ item.title }}
          </button>
          <button
            v-show="selectedDataId === item.id && bannerStyle === 3"
            @click="handleItemChangeBanner(item)"
            class="text-[#2F8255] text-[1.125rem]"
          >
            {{ item.title }}
          </button>
          <button
            v-show="selectedDataId !== item.id && bannerStyle === 3"
            @click="handleItemChangeBanner(item)"
            class="text-[1.125rem]"
          >
            {{ item.title }}
          </button>
          <!-- 激活时的短线 -->
          <div v-show="selectedDataId === item.id" :class="`absolute bottom-0 w-full h-[2px] ${ bannerStyle === 2 ? 'bg-white' : 'bg-[#2F8255]' }`"></div>
        </div>
      </div>
    </div>

    <!-- 第一屏 -->
    <div ref="firstRef" :class="`w-full flex justify-center items-center h-100vh ${activePoster} text-white`">
      <div class="container px-3rem box-border">
        <div class="text-3rem font-bold">{{ mainTitle }}</div>
        <div class="w-[43rem] text-1rem mt-1.2rem h-5rem leading-loose">
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
              <div class="w-full relative mt-.6rem" style="border-top: 2px dashed #a1a1a1;">
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
    <div ref="videoRef" class="w-full flex flex-col justify-center items-center video-bg  text-white py-6rem">
      <div class="flex flex-col space-y-1 items-center mt-3 mb-[1rem]">
        <div class="text-1.8rem">视频展示</div>
        <div class="text-#fff text-.7rem">VIDEO DISPLAY</div>
      </div>
      <div class="container flex justify-center mt-1rem relative">
        <div
          class="bg-black aspect-video h-30rem"
          id="videoDom"
        ></div>
        <div class="absolute left-[1rem] top-[14rem] !hidden" @click="handleVideoChange(-1)">
          <img src="/left.png" class="w-2rem" />
        </div>
        <div class="absolute right-[1rem] top-[14rem] !hidden" @click="handleVideoChange(1)">
          <img src="/right.png" class="w-2rem" />
        </div>
      </div>
    </div>

    <!-- 系统特色 -->
    <div
      class="relative w-full flex flex-col justify-center items-center spec-bg h-100vh text-#000000"
    >
      <div class="container px-3rem box-border">
        <div class="text-2rem pb-2">系统特色</div>
        <div class="text-.7rem text-#999999">SYSTEM FEATURES</div>
        <div class="text-1rem text-#333333 line-height-[1.8] w-36rem mt-1.2rem">
          {{ systemFeature }}
        </div>
      </div>
      <div class="container relative flex mt-5rem px-2rem box-border">
        <swiper
          :slidesPerView="3"
          :spaceBetween="20"
          :freeMode="true"
          :pagination="{ clickable: true }"
          :modules="[FreeMode, Pagination]"
          class="w-95%"
        >
          <swiper-slide v-for="item in handledDataList" :key="item.subId">
            <div class="w-full 2xl:h-15rem xl:h-14rem system-feature-wrapper mb-3rem px-1">
              <div
                class="w-full h-full bg-white box-border p-2rem system-feature-simple relative flex flex-col items-center justify-center space-y-4"
              >
                <div class="absolute left-1.8rem top-1rem text-1.3rem text-#318255">{{
                  `0${item.subId}`
                }}</div>
                <div :class="`specBtn${item.parentId}-${item.subId} w-4rem h-4rem`"></div>
                <div class="mb-3">{{ item.subTitle }}</div>
              </div>
              <div
                class="w-full h-full bg-#2f8255 box-border system-feature-content px-3rem text-#fff flex flex-col items-center justify-center specRightCard"
              >
                <div class="text-center 2xl:text-1.3rem xl:text-1.2rem">{{ item.subTitle }}</div>
                <div class="mt-1rem h-6rem line-clamp-4 overflow-auto leading-1.5rem text-left">{{
                  item.subInfo
                }}</div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div
          :class="`w-20rem h-20rem absolute top-[-16rem] right-[4rem] z-20 specRightCard-${selectedDataId}`"
        >
          <div :class="`w-90% h-90%  `"></div>
        </div>
      </div>
    </div>

    <!-- 解决农业问题 -->
    <div class="w-full flex flex-col justify-center items-center py-4rem ">
      <div class="flex flex-col space-y-1 items-center mt-3 mb-[5rem]">
        <div class="text-[40px]">解决农业问题</div>
        <div class=" text-[18px] text-#999999">ADDRESSING AGRICULTURAL ISSUES</div>
      </div>
      <div class="container ">
        <div class="flex justify-center items-center mb-[4rem] pl-2rem pr-2rem">
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
          <div class='w-50%  solve-bg1 h-20rem '></div>
        </div>
        <div class="flex justify-center items-center mb-[4rem] pl-2rem pr-2rem">
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
        <div class="flex justify-center items-center mb-[4rem] pl-2rem pr-2rem">
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
        <div class="flex justify-center items-center mb-[3rem] pl-2rem pr-2rem">
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

    <!-- 系统亮点 -->
    <div class="w-full flex flex-col items-center py-4rem">
      <div class="flex flex-col space-y-1 items-center mt-3 mb-[3rem]">
        <div class="text-[40px]"><span>系统亮点</span></div>
        <div class="text-[18px] text-[#999]"><span>SYSTEM HIGHLIGHTS</span></div>
      </div>
      <div class="container">
        <div
          class="w-full h-[90px] mb-[2.25rem] flex justify-between highlights"
          style="border-bottom: 1px solid #E6E6E6;"
        >
          <div v-for="item, index in highlights" :key="item.title" class="h-full relative">
            <button 
              @click="curHighlight = index"
              :class="`text-[1.125rem] leading-[90px] ${curHighlight === index && 'text-[#2F8255]'}`"
            >
              <span>{{ item.title }}</span>
            </button>
            <div v-show="curHighlight === index" class="absolute bottom-0 w-full h-[2px] bg-[#2F8255]"></div>
          </div>
        </div>
        <div :class="`sys-highlight-${ curHighlight + 1 } flex`">
          <div class="mt-[5rem] ml-[3.75rem] w-[40%]">
            <div><span class="text-[1.5rem] leading-[3rem]">{{ highlights[curHighlight].title }}:</span></div>
            <div><span class="leading-[2rem]">{{ highlights[curHighlight].content }}</span></div>
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
            <div class="text-.8rem relative left-.3rem text-[#f1f1f1c0]">Lu Yu Collaborative Rural Revitalization
              Village Digital Empowerment Project</div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="text-.9rem">联系我们</div>
          <div class="text-1.2rem font-bold">182-0647-2165</div>
        </div>
      </div>
      <div class="container box-border flex justify-between items-start py-3rem text-white px-2rem pl-5.3rem">
        <div class="flex space-x-3rem items-start">
          <div v-for="item in footerData" :key="item.id">
            <div class="text-1.1rem mb-1.2rem">{{ item.label }}</div>
            <div
              v-for="ele in item.children"
              :key="ele.id"
              class="mb-.6rem text-.9rem text-#e1e1e1 hover:text-white cursor-pointer transition"
            >{{ ele.label }}</div>
          </div>
        </div>
        <div class="w-8rem flex flex-col items-center">
          <div class="w-full aspect-1 qr-code bg-white"></div>
          <div class="text-white mt-2">扫码关注</div>
        </div>
      </div>
      <div class="flex justify-center items-center w-full py-7 text-#f1f1f1" style="border-top: 1px solid #f1f1f110">
        <span>Copyright © 2024 zhinengshengchan. | 鲁ICP备17022090号 | ©2024</span>
        <span>山东浪潮智能生产技术有限公司</span>
      </div>
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

.video-bg {
  background-image: url(./assets/new/videoBg.png);
  background-size: cover;
}

@for $i from 1 through 10 {
  .poster-#{$i} {
    background-image: url(./assets/new/poster#{$i}.png);
    background-size: cover;
  }
}

.icon {
  background-image: url(./assets/new/logo.png);
  background-size: 100% 100%;
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

.spec-bg {
  background-image: url(./assets/spec/bgImg/specBg.png);
  background-size: cover;
}

@for $i from 1 through 7 {
  .specRightCard-#{$i}{
    background-image: url(./assets/spec/bgImg/specRightCardBg#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 20;
  }
}
// 农业特色卡片图标start
@for $i from 1 through 3 {
  .specBtn1-#{$i}{
    background-image: url(./assets/spec/specBtn1-#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;  
    background-position: center; 
  }
}
@for $i from 1 through 4 {
  .specBtn2-#{$i}{
    background-image: url(./assets/spec/specBtn2-#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;  
    background-position: center; 
  }
}

@for $i from 1 through 4 {
  .specBtn3-#{$i}{
    background-image: url(./assets/spec/specBtn3-#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;  
    background-position: center; 
  }
}
@for $i from 1 through 4 {
  .specBtn4-#{$i}{
    background-image: url(./assets/spec/specBtn4-#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;  
    background-position: center; 
  }
}
@for $i from 1 through 4 {
  .specBtn5-#{$i}{
    background-image: url(./assets/spec/specBtn5-#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;  
    background-position: center; 
  }
}
@for $i from 1 through 4 {
  .specBtn6-#{$i}{
    background-image: url(./assets/spec/specBtn6-#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;  
    background-position: center; 
  }
}
@for $i from 1 through 5 {
  .specBtn7-#{$i}{
    background-image: url(./assets/spec/specBtn7-#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;  
    background-position: center; 
  }
}
// 农业特色卡片图标end


@keyframes slideIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.system-feature-wrapper {
  .system-feature-content {
    display: none;
    transition: all .4s ease;
  }
}

.system-feature-wrapper:hover {
  .system-feature-simple {
    display: none;
  }
  .system-feature-content {
    display: flex;
    animation: slideIn .5s ease forwards;
  }
}

.specRightCard {
  background-image: url(./assets/spec/bgImg/specGreenCardBg.png);
  background-size: contain;
  background-repeat: no-repeat;
}

// 默认button背景透明 无边框 鼠标悬停指针
.banner-btns button,
.highlights button {
  background: none;
  border: 0;
  cursor: pointer;
}

.banner-shadow {
  box-shadow: 0px 0px 20px 0px rgba(204,204,204,0.5);
}

// 系统亮点
@for $i from 1 through 6 {
  .sys-highlight-#{$i} {
    background: {
      image: url(./assets/sys-highlight-#{$i}.png);
      size: 100% 100%;
    }
    height: 22.5rem;
    width: 100%;
  }
}
</style>