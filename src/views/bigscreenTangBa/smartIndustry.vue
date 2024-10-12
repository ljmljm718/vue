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

const activeTab = ref<string>('1')
const bottomTabs = [
  { id: '1', name: '枳壳', icon: 'tab-icon-1' },
  { id: '2', name: '柠檬', icon: 'tab-icon-2' },
  { id: '3', name: '紫苏', icon: 'tab-icon-3' },
  { id: '4', name: '大米', icon: 'tab-icon-4' }
]

const situationMap = new Map([
  ['1', [
    { id: '1', title: '种植面积/亩', value: '4000+' },
    { id: '2', title: '年产值/万元', value: '4000+' },
    { id: '3', title: '带动就业/人', value: '8000+' },
    { id: '4', title: '农民增收/万元', value: '300+' },
  ]],
  ['2', [
    { id: '1', title: '种植面积/亩', value: '420+' },
    { id: '2', title: '年产值/万元', value: '90+' },
    { id: '3', title: '带动就业/人', value: '1800+' },
    { id: '4', title: '农民增收/万元', value: '120+' },
  ]],
  ['3', [
    { id: '1', title: '种植面积/亩', value: '1000+' },
    { id: '2', title: '年产值/万元', value: '2400+' },
    { id: '3', title: '带动就业/人', value: '540+' },
    { id: '4', title: '农民增收/万元', value: '80+' },
  ]],
  ['4', [
    { id: '1', title: '种植面积/亩', value: '200+' },
    { id: '2', title: '年产值/万元', value: '200+' },
    { id: '3', title: '带动就业/人', value: '200+' },
    { id: '4', title: '农民增收/万元', value: '50+' },
  ]],
])
const situationList = ref<any[]>([])
const getSituationList = (tab:string) => {
  const item = situationMap.get(tab);
  if (item) situationList.value = item;
  else situationList.value = []
}
getSituationList(activeTab.value)

const situationTextMap = new Map([
  ['1', '天印村积壳基地位于天印村1、2、3社，由重庆市印天湖现代农业发展有限公司和重庆市古传现代农业有限公司流转当地土地经营，于2018年建立，种植面积约4000余亩、10万余株，是西南地区最大标准化枳壳产业园，由村集体经济组织统一规划管理。产品主要是通过初加工烘烤后销往四川、安徽等中药材市场，年产值可达4000余万元，可带动周边群众就近8000余人次务工就业，为当地农民增收300余万元，具有良好的社会、经济效益。'],
  ['2', '天印村柠檬基地位于天印村4社，由重庆市潼南区悯瀚农业有限公司流转当地土地经营，成立于2019年1月，年产值90万元。公司主要从事柠檬种植及销售，种植面积约420余亩是一家规模比较大的柠檬基地。带动周边群众就近1800余人次务工就业，为当地农民增收120余万元。'],
  ['3', '天印村紫苏基地位于天印村9、10社，由根创乡美（重庆）科技发展集团有限公司流转当地土地经营，种植面积1000余亩，年产值2400万元。带动周边群众就近540余人次务工就业，为当地农民增收80余万元。'],
  ['4', '天印村水稻基种植面积200余亩，年产值200余万元。带动周边群众就近200余人次务工就业，为当地农民增收50余万元。']
])
const situationText = ref<string>('')
const getSituationText = (tab:string) => {
  const item = situationTextMap.get(tab)
  if (item) situationText.value = item;
  else situationText.value = '';
}
getSituationText(activeTab.value)

// 市场需求
const markNeedListMap = new Map([
  ['1', [
    { id: '1', img: 'need-img-1', label: '枳壳'},
    { id: '2', img: 'need-img-2', label: '陈皮' },
    { id: '3', img: 'need-img-3', label: '陈皮条' },
  ]],
  ['2', [
    { id: '1', img: 'need-img-4', label: '鲜食'},
    { id: '2', img: 'need-img-5', label: '加工' },
    { id: '3', img: 'need-img-6', label: '深加工' },
  ]],
  ['3', [
    { id: '1', img: 'need-img-7', label: '药用领域'},
    { id: '2', img: 'need-img-8', label: '食用领域' },
    { id: '3', img: 'need-img-9', label: '工业领域' },
  ]],
  ['4', [
    { id: '1', img: 'need-img-10', label: '直接食用'},
    { id: '2', img: 'need-img-11', label: '加工食用' },
    { id: '3', img: 'need-img-12', label: '深加工' },
  ]]
])
const markNeedList = ref<any[]>([])
const getMarkNeedList = (tab:string) => {
  const item = markNeedListMap.get(tab)
  if (item) markNeedList.value = item;
  else markNeedList.value = []
}
getMarkNeedList(activeTab.value)

const markNeedTextMap = new Map([
  ['1', '枳壳的市场需求规模受到多种因素的影响，近年来呈现出一定的变化趋势。 从整体市场需求来看，过去有数据显示国内外市场枳壳总需求曾达30000吨以上。中国市场是全球枳壳市场的主要消费国，占据了约70%的市场份额。国内部分地区的相关信息也能从侧面反映枳壳的市场需求，例如江苏扬子江药业年用量在500吨左右，重庆太极集团涪陵制药年用量为500吨左右（主要用于急支糖浆）。 就目前的市场情况而言，有报道称枳壳市场年需求量在5000吨左右。不过，由于枳壳前几年存在大面积扩种的情况，导致产量增加，目前市场处于供大于求的状态，行情较为低迷。近期各中药材市场上枳壳货源走销不快，商家关注力度一般。 总体来说，'],
  ['2', '中国柠檬市场需求规模呈现不断增长的态势。2022 年全国柠檬产量在 269.75 万吨左右，进口为 1.44 万吨，出口为 4.17 万吨，国内市场需求为 267.02 万吨。 随着人们对健康饮食的关注度不断提高以及柠檬在食品、饮料、美容、医药等多个领域的应用不断拓展，柠檬市场需求持续扩大。从产业结构来看，鲜食（含餐饮、烹饪、食品初加工等）销售额占比接近 75%，柠檬深加工产品（果汁制造、提取物等）销售额约为 25%。并且，未来我国柠檬深加工行业产业预计将会保持增长。 智研咨询曾预测，到 2024 年中国柠檬行业市场规模将增长到 118.3 亿元左右。但这只是一个预测数据，实际的市场需求规模会受到多种因素的影响，如种植面积、产量、市场价格、消费者需求变化、进出口政策等。'],
  ['3', `<div>紫苏市场需求规模呈现出不断增长的态势。以下是具体分析：</div><div class="mt-2 text-#08FFFF text-18px">1. 药用领域：</div><div>- 传统中药需求：紫苏是中成药市场上销量较多的常用品种，这方面的需求较为稳定且持续。 - 新药研发推动需求：一些企业和科研机构正在利用紫苏开发新的药品和保健品，这也进一步增加了对紫苏的需求。</div><div class="mt-2 text-#08FFFF text-18px">2. 食用领域：</div><div>- 国内市场：紫苏叶常被用作香料、调料，用于烹饪中增添风味，尤其是在一些地方菜系中应用广泛。 - 国外市场：紫苏在亚洲地区的日本、韩国等国家也备受欢迎，是当地料理中常用的食材。近年来，在国际市场上的需求也在不断增长。</div><div class="mt-2 text-#08FFFF text-18px">3.工业领域</div><div>- 提取加工：紫苏可以提取紫苏油、紫苏胡萝卜素等，这些提取物在食品、化妆品、保健品等行业具有广泛的应用。 - 饲料添加剂：紫苏的一些成分具有抗菌、抗氧化等作用，可以作为饲料添加剂用于畜牧业，提高动物的免疫力和生产性能。</div>`],
  ['4', '大米市场需求持续增长。大米作为世界上近一半人口的主食，其需求量巨大且持续增长。随着居民生活水平的提高和消费观念的转变，大米消费需求逐渐多样化，对品质、口感、包装等方面的要求也越来越高。此外，随着一些国家转向大米作为主要粮食来源，以及面粉和玉米饲料需求的减少，碎米等替代品的需求也大幅增加，这种需求结构的变化使得大米市场的供需关系更加紧张。全球大米市场的持续动荡，供应紧张与价格飙升成为了不可忽视的现象。这一系列变化背后，不仅关乎农业生产、国际贸易，还与全球气候、经济政策等紧密相连。全球大米供应的相对有限性是价格上涨的根本原因。主要大米出口国如印度、泰国等，由于国内政策调整、极端天气影响等因素，纷纷限制了大米的出口量，进一步加剧了全球大米市场的紧张局势']
])
const markNeedText = ref<string>('')
const getMarkNeedText = (tab:string) => {
  const item = markNeedTextMap.get(tab);
  if (item) markNeedText.value = item;
  else markNeedText.value = ''
}
getMarkNeedText(activeTab.value)

// 药用价值及其功效
const medicalDataMap = new Map([
  ['1', [
    {
      id: '1',
      icon: 'med-icon-1',
      color: '#effc6d',
      title: '传统功效',
      children: [
        {
          title: '理气宽中：',
          content: '枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。'
        },
        {
          title: '行滞消胀：',
          content: '枳壳能够促进胃肠蠕动，帮助消化。'
        },
        {
          title: '化痰除痞：',
          content: '枳壳可用于治疗痰饮内停所致的咳嗽、咳痰、胸闷、痞满等症状。'
        },
        {
          title: '升提脏器：',
          content: '常与黄芪、升麻、柴胡等补气升阳药同用，治疗脏器下垂的病症。'
        },
      ]
    },
    {
      id: '2',
      icon: 'med-icon-2',
      color: '#08ffff',
      title: '现代研究功效',
      children: [
        {
          title: '心血管调节作用：',
          content: '低浓度的枳壳煎剂可使心血管收缩增强，高浓度的枳壳煎剂可使心血管收缩减弱。'
        },
        {
          title: '升血压、抗休克作用：',
          content: '枳壳具有升血压和抗休克的功效，对于低血压、休克等情况可能有一定的辅助治疗作用。'
        },
        {
          title: '利尿作用：',
          content: '可促进尿液排出，对于水肿等疾病有一定的辅助治疗效果。'
        },
        {
          title: '其他作用：',
          content: '枳壳还具有镇静、保肝利胆、抗病原微生物、抑制过敏反应等作用。'
        },
      ]
    }
  ]],
  ['2', [
    {
      id: '1',
      icon: 'med-icon-3',
      color: '#effc6d',
      title: '营养成分',
      children: [
        {
          title: '维生素C：',
          content: '含量极高，具有抗氧化作用，能增强人体免疫力，促进胶原蛋白的合成。'
        },
        {
          title: '柠檬酸：',
          content: '赋予柠檬独特的酸味，有助于促进消化液分泌，增强胃肠蠕动，帮助消化。'
        },
        {
          title: '类黄酮：',
          content: '具有抗氧化、抗炎和抗菌作用，可降低心血管疾病风险，保护细胞免受自由基损伤。'
        },
        {
          title: '钙、磷、铁等矿物质：',
          content: '对维持人体正常生理功能起着重要作用。 '
        },
      ]
    },
    {
      id: '2',
      icon: 'med-icon-4',
      color: '#08ffff',
      title: '药用功效',
      children: [
        {
          title: '消化系统：',
          content: '柠檬酸刺激胃液分泌，促进消化；柠檬中的膳食纤维能促进肠道蠕动，有助于缓解便秘。'
        },
        {
          title: '免疫系统：',
          content: '丰富的维生素C可以刺激白细胞的产生，增强免疫力；柠檬还具有一定的抗菌消炎作用。'
        },
        {
          title: '心血管系统：',
          content: '柠檬中的钾元素有助于调节血压；果胶等成分可以结合胆固醇，减少其在肠道的吸收。'
        },
        {
          title: '呼吸系统：',
          content: '柠檬的酸味和挥发性成分可以刺激呼吸道黏膜，促进痰液排出，缓解咳嗽症状；维生素C 和类黄酮等成分有助于增强呼吸道的免疫力，预防呼吸道感染。'
        },
        {
          title: '美容护肤：',
          content: '维生素 C 可以抑制黑色素的形成，使肌肤更加白皙；类黄酮等抗氧化成分可以抵抗自由基的损伤，延缓皮肤衰老；柠檬的酸性可以调节皮肤的 pH 值，控油祛痘。'
        }
      ]
    }
  ]],
  ['3', [
    {
      id: '1',
      icon: 'med-icon-5',
      color: '#effc6d',
      title: '紫苏叶',
      children: [
        {
          title: '解表散寒：',
          content: '味辛性温，能发散侵袭肌肤表面的寒邪，可用于治疗风寒感冒。'
        },
        {
          title: '行气和胃：',
          content: '气味芳香，入脾经，擅于调理脾胃的气机，可缓解胸腹、胃脘部位胀满等脾胃气滞症状'
        },
        {
          title: '解鱼蟹毒：',
          content: '可辅助治疗进食鱼蟹中毒引起的腹痛、呕吐、腹泻，及进食鱼虾引起的过敏、瘙痒等症状。'
        }
      ]
    },
    {
      id: '2',
      icon: 'med-icon-6',
      color: '#d880ff',
      title: '紫苏梗',
      children: [
        {
          title: '理气宽中：',
          content: '药性微温，可疏通身体上下郁滞的气机，用于治疗脾胃寒邪凝聚、气机郁滞引起的胸膈痞闷、胃脘疼痛、嗳气呕吐等。'
        },
        {
          title: '止痛：',
          content: '能缓解因气机不畅或寒邪凝滞等原因导致的疼痛。'
        },
        {
          title: '安胎：',
          content: '可用于治疗胎动不安、妊娠恶阻，症见妊娠早期出现较严重的恶心呕吐、头晕、厌食等。'
        },
      ]
    },
    {
      id: '3',
      icon: 'med-icon-7',
      color: '#08ffff',
      title: '紫苏子',
      children: [
        {
          title: '降气化痰：',
          content: '入肺经，擅长平降肺气、化痰，可用于治疗咳嗽气喘、胸膈满闷等症状。'
        },
        {
          title: '止咳平喘：',
          content: '对于咳嗽、气喘等症状有较好的缓解作用，常与其他止咳平喘药物配伍使用。'
        },
        {
          title: '润肠通便：',
          content: '富含油脂，性质润泽，既能润燥滑肠，又能平降、倾泄肺气，有助于大肠恢复传导功能。'
        },
      ]
    }
  ]],
  ['4', [
    {
      id: '1',
      icon: 'med-icon-8',
      color: '#effc6d',
      title: '营养价值',
      children: [
        {
          title: '碳水化合物：',
          content: '白米饭是碳水化合物的重要来源，提供身体所需的能量。'
        },
        {
          title: '蛋白质：',
          content: '大米含有适量的蛋白质，尤其是谷氨酸和赖氨酸等必需氨基酸。'
        },
        {
          title: '维生素B：',
          content: '大米中富含多种维生素B，包括核黄素、烟酸和叶酸等。'
        },
        {
          title: '矿物质：',
          content: '大米含有钾、镁和锰等矿物质，有助于支持心脏健康和其他身体功能。'
        },
      ]
    },
    {
      id: '2',
      icon: 'med-icon-9',
      color: '#08ffff',
      title: '功效作用',
      children: [
        {
          title: '健脾养胃：',
          content: '大米性甘、味平，具有补中益气、健脾养胃的功效，适量食用可帮助改善脾胃气虚、食少纳呆、倦怠乏力等症。'
        },
        {
          title: '止泻痢：',
          content: '大米糯而不粘，能帮助泻下痢疾，适合此类患者食用。'
        },
        {
          title: '助消化：',
          content: '大米有益于婴儿的生长发育，还能刺激胃液的分泌，有助于消化，并对脂肪的吸收有促进作用，亦能促使奶粉中的酪蛋白形成疏松而又柔软的小凝块，使之容易消化、吸收。'
        }
      ]
    }
  ]]
])
const medicalData = ref<any[]>([])
const getMedicalData = (tab:string) => {
  const item = medicalDataMap.get(tab)
  if (item) medicalData.value = item
  else medicalData.value = []
}
getMedicalData(activeTab.value)

const videoMap = new Map([
  ['1', 'video-1'],
  ['2', 'video-2'],
  ['3', 'video-3'],
  ['4', 'video-4'],
])
const activeVideo = ref<string>('')
const getActiveVideo = (tab:string) => {
  const item = videoMap.get(tab)
  if (item) activeVideo.value = item
  else activeVideo.value = ''
}
getActiveVideo(activeTab.value)

const videoActiveMap = new Map([
  ['1', '/public/zhiqiao/zhiqiao.m3u8'],
  ['2', '/public/ningmeng/ningmeng.m3u8'],
  ['3', '/public/zhiqiao/zhiqiao.m3u8'],
  ['4', '/public/ningmeng/ningmeng.m3u8']
])
const enableActiveVideo = (tab:string) => {
  const item = videoActiveMap.get(tab)
  if (item) initVideo('player', item)
  else initVideo('player', '/public/zhiqiao/zhiqiao.m3u8')
}
onMounted(() => { enableActiveVideo(activeTab.value) })

const handleBottomTabClick = (item) => {
  activeTab.value = item.id;
  getSituationList(activeTab.value)
  getSituationText(activeTab.value)
  getMarkNeedList(activeTab.value)
  getMarkNeedText(activeTab.value)
  getMedicalData(activeTab.value)
  getActiveVideo(activeTab.value)
  enableActiveVideo(activeTab.value)
}
</script>
<template>
  <div class="w-[1920px] h-[970px] relative">
    <!-- 左侧 -->
    <div class="absolute left-[16px] top-[16px] w-[500px] h-[930px] mengban z-10">
      <div class="flex items-center p-1 h-32px bottom-border">
        <div class="titleIcon w-22px h-22px mx-2"></div>
        <div class="text-[20px] font-extrabold tracking-wide">本村产业情况</div>
      </div>
      <div class="flex justify-evenly items-center h-110px">
        <div
          v-for="item in situationList"
          :key="item.id"
          class="flex flex-col items-center relative top-10px"
        >
          <div class="relative top-10px text-[18px] text-[#08FFFF] font-bold tracking-wide">{{ item.value }}</div>
          <div class="relative top-10px text-[14px] text-[#fff]">{{ item.title }}</div>
          <div class="IndusSituationImg w-80px h-60px"></div>
        </div>
      </div>
      <div class="w-full h-210px">
        <el-scrollbar height="210px">
          <div class="p-4 px-6 leading-6 text-[16px]">{{ situationText }}</div>
        </el-scrollbar>
      </div>
      <div class="flex items-center p-1 h-32px bottom-border">
        <div class="titleIcon w-22px h-22px mx-2"></div>
        <div class="text-[20px] font-extrabold tracking-wide">药用价值及功效</div>
      </div>
      <div class="w-full h-520px">
        <el-scrollbar height="520px">
          <div class="p-4 py-7 space-y-4">
            <div
              v-for="item in medicalData"
              :key="item.id"
              class="flex items-start justify-center"
            >
              <div :class="`rounded-full w-100px h-100px ${item.icon}`"></div>
              <div class="w-350px ml-5">
                <div
                  class="text-black text-19px font-bold side-btn-title w-140px text-center py-1 mb-2"
                  :style="`background-color: ${item.color};`"
                >
                  {{ item.title }}
                </div>
                <div
                  v-for="ele in item.children"
                  :key="ele.title"
                  class="pb-4"
                >
                  <div
                    class="text-18px"
                    :style="`color: ${item.color};`"
                  >{{ ele.title }}</div>
                  <div>{{ ele.content }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="absolute right-[16px] top-[16px] w-[500px] h-[930px] mengban z-10">
      <div class="flex items-center p-1 h-32px bottom-border">
        <div class="titleIcon w-22px h-22px mx-2"></div>
        <div class="text-[20px] font-extrabold tracking-wide">视频</div>
      </div>
      <div class="p-4 box-border">
        <div
          id="player"
          style="height: 250px;"
          class="w-full"
        ></div>
      </div>
      <div class="flex items-center p-1 h-32px bottom-border">
        <div class="titleIcon w-22px h-22px mx-2"></div>
        <div class="text-[20px] font-extrabold tracking-wide">市场需求</div>
      </div>
      <div class="flex justify-evenly items-center h-170px box-border pt-10px">
        <div
          v-for="item in markNeedList"
          :key="item.id"
          class="flex flex-col items-center space-y-4"
        >
          <div :class="[item.img, 'w-100px h-100px']"></div>
          <div class="bg-#08FFFF text-[#011414] flex justify-center items-center w-80px h-26px rounded-full font-semibold">{{ item.label }}</div>
        </div>
      </div>
      <div class="w-full h-390px">
        <el-scrollbar height="390px">
          <div
            class="p-4 px-6 leading-6"
            v-html="markNeedText"
          ></div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 中间部分 -->
    <div class="w-full h-full absolute left-0 top-0 bg-#001110 z-0 flex flex-col items-center">
      <div class="industry-bg w-full h-[900px] flex flex-col items-center">
        <div class="w-[800px] mt-30px flex justify-between">
          <template v-if="activeTab === '1'">
            <div class="leftButtonBg box-border flex items-center pl-50px w-280px h-50px text-[#fff] text-[23px]">传统功效</div>
            <div class="rightButtonBg box-border flex flex-row-reverse items-center pr-50px w-280px h-50px text-[#fff] text-[23px]">现代研究功效</div>
          </template>
          <template v-if="activeTab === '2'">
            <div class="leftButtonBg box-border flex items-center pl-50px w-280px h-50px text-[#fff] text-[23px]">营养成分</div>
            <div class="rightButtonBg box-border flex flex-row-reverse items-center pr-50px w-280px h-50px text-[#fff] text-[23px]">药用功效</div>
          </template>
          <template v-if="activeTab === '3'">
            <div class="leftButtonBg box-border flex items-center pl-50px w-280px h-50px text-[#fff] text-[23px]">紫苏叶</div>
            <div class="bottomButtonBg box-border flex items-center pl-50px w-280px h-50px text-[#fff] text-[23px]">紫苏梗</div>
            <div class="rightButtonBg box-border flex flex-row-reverse items-center pr-50px w-280px h-50px text-[#fff] text-[23px]">紫苏子</div>
          </template>
        </div>
        <div
          class="middleTree w-650px h-650px mt-70px relative"
          v-if="activeTab === '1'"
        >
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
        <div
          class="middleTree2 w-650px h-650px mt-70px relative"
          v-if="activeTab === '2'"
        >
          <div class="left-card left-120px top-90px">维生素C</div>
          <div class="left-card left-0px top-170px">柠檬酸</div>
          <div class="left-card left-[10px] bottom-300px">类黄酮</div>
          <div class="left-card left-70px bottom-220px">钙磷铁矿物质</div>
          <div class="right-card right-150px top-30px">消化系统</div>
          <div class="right-card right-100px top-80px">免疫系统</div>
          <div class="right-card right-10px top-150px">心血管系统</div>
          <div class="right-card right-60px top-240px">呼吸系统</div>
          <div class="right-card right-80px top-340px">美容护肤</div>

          
          <div class="absolute middle-icon-1 w-100px h-90px left-[-30px] top-30px"></div>
          <div class="absolute middle-icon-2 w-100px h-90px left-[-10px] bottom-150px"></div>
          <div class="absolute middle-icon-3 w-90px h-81px right-[130px] bottom-150px"></div>
          <div class="absolute middle-icon-4 w-100px h-90px right-[30px] bottom-120px"></div>
        </div>
        <div
          class="middleTree3 w-650px h-650px mt-70px relative"
          v-if="activeTab === '3'"
        >
          <div class="left-card left-120px top-290px">解鱼蟹毒</div>
          <div class="left-card left-100px top-350px">解表散寒</div>
          <div class="left-card left-130px top-420px">行气和胃</div>

          <div class="right-card right-150px top-180px">降气化痰</div>
          <div class="right-card right-150px top-230px">止咳平喘</div>
          <div class="right-card right-120px top-300px">润肠通便</div>

          <div class="bottom-card right-310px bottom-120px">理气宽中</div>
          <div
            class="bottom-card right-210px bottom-80px"
            style="border-radius: 1000px 1000px 1000px 0;"
          >安胎</div>
          <div class="bottom-card right-300px bottom-50px">止痛</div>

          <div class="absolute middle-icon-5 w-100px h-90px left-[-10px] bottom-130px"></div>
          <div class="absolute middle-icon-6 w-100px h-90px right-[-10px] top-150px"></div>
          <div class="absolute middle-icon-7 w-90px h-81px right-[90px] bottom-160px"></div>
        </div>
        <div
          class="middleTree4 w-650px h-650px mt-70px relative"
          v-if="activeTab === '4'"
        >
          <div class="absolute right-[-90px] top-80px">
            <div class="text-#effc6d text-18px font-semibold">1.原粮验收</div>
            <div>对收购的稻谷进行检验，确保稻谷符合加工要求。</div>
          </div>
          <div class="absolute right-[-80px] top-200px">
            <div class="text-#08ffff text-18px font-semibold">2.清理</div>
            <div class="w-[200px]">先利用圆筒初清，再通过去石机去除稻谷中的杂质，最后使用磁选机吸附稻谷中的金属杂质。</div>
          </div>
          <div class="absolute right-[-80px] top-350px">
            <div class="text-#08ffff text-18px font-semibold">3.砻谷</div>
            <div class="w-[200px]">使用砻谷机将稻谷的谷壳脱下，使稻谷变成糙米。</div>
          </div>
          <div class="absolute right-[-40px] bottom-100px">
            <div class="text-#08ffff text-18px font-semibold">4.谷糙分离</div>
            <div class="w-[200px]">利用谷糙分离机将谷糙混合物中的谷粒和糙米分离开来。</div>
          </div>
          <div class="absolute right-[210px] bottom-[-60px] flex flex-col items-center">
            <div class="text-#08ffff text-18px font-semibold">5.糙米调质</div>
            <div class="w-[200px]">根据糙米的情况调整其水分和温度，使其达到适宜的碾米条件。</div>
          </div>
          <div class="absolute left-[-40px] bottom-80px flex flex-col items-end">
            <div class="text-#08ffff text-18px font-semibold">6.碾米</div>
            <div class="w-[200px]">根据糙米的情将糙米放入碾米机中除去糙米的皮层和胚芽。况调整其水分和温度，使其达到适宜的碾米条件。</div>
          </div>
          <div class="absolute left-[-80px] top-350px flex flex-col items-end">
            <div class="text-#08ffff text-18px font-semibold">7.白米分级</div>
            <div class="w-[200px]">使用白米分级筛对白米进行分级。</div>
          </div>
          <div class="absolute left-[-80px] top-220px flex flex-col items-end">
            <div class="text-#08ffff text-18px font-semibold">8.色选</div>
            <div class="w-[200px]">利用色选机对大米进行光学检测，剔除有缺陷的米粒。</div>
          </div>
          <div class="absolute left-[-70px] top-80px flex flex-col items-end">
            <div class="text-#08ffff text-18px font-semibold">9.抛光</div>
            <div class="w-[200px]">将白米放入抛光机中，通过摩擦使米粒表面光滑。</div>
          </div>
          <div class="absolute left-[340px] top-[-30px]">
            <div class="text-#08ffff text-18px font-semibold">10.包装</div>
            <div class="w-[200px]">对经过上述工序处理后的成品大米进行包装。</div>
          </div>
        </div>
      </div>
      <div class="h-45px bottomBg w-full mt-15px flex justify-center">
        <div class="w-400px h-full flex justify-evenly items-center">
          <div 
            v-for="item in bottomTabs"
            :key="item.id"
            @click="handleBottomTabClick(item)"
            class="flex space-x-1 items-center cursor-pointer select-none"
          >
            <div
              :class="[item.icon + (item.id === activeTab ? '-active' : ''), 'w-16px h-16px']"
            ></div>
            <div :class="[item.id === activeTab ? 'text-[#16ffff]' : '']">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.mengban {
  background-image: url(./assets/mengban.png);
  background-size: 100% 100%;
}

.titleIcon {
  background-image: url(./assets/titleIcon.png);
  background-size: 100% 100%;
}

.bottom-border {
  border-bottom: 1px solid #08FFFF;
}

.bottomBg {
  background-image: url(./assets/bottomBg.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.industry-bg {
  background-image: url(./assets/industryBg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

// 功效图片
.valueImg1 {
  background-image: url(./assets/zhiqiao/valueImg1.png);
  background-size: contain;
  background-repeat: no-repeat;
} 
.valueImg2 {
  background-image: url(./assets/zhiqiao/valueImg2.png);
  background-size: contain;
  background-repeat: no-repeat;
}
//底部
@for $i from 1 through 4 {
  .tab-icon-#{$i} {
    background-image: url(./assets/bottomTabIcon#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
  }

  .tab-icon-#{$i}-active {
    background-image: url(./assets/bottomTabIcon#{$i}Active.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
}

// 智慧产业中间部分样式、图片
.rightButtonBg {
  background-image: url(./assets/rightButtonBg.png);
  background-size: 100% 100%;

}

.leftButtonBg {
  background-image: url(./assets/leftButtonBg.png);
  background-size: 100% 100%;
}

.bottomButtonBg {
  background-image: url(./assets/centerButtonBg.png);
  background-size: 100% 100%;
}

.middleTree {
  background-image: url(./assets/zhiqiao/tree.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.middleTree2 {
  background-image: url(./assets/tree2.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.middleTree3 {
  background-image: url(./assets/tree3.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.middleTree4 {
  background-image: url(./assets/tree4.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.IndusSituationImg {
  background-image: url(./assets/IndusSituationImg.png);
  background-size: 100% 100%;
}

.left-card, .right-card, .bottom-card {
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

.bottom-card {
  border: 1px solid #d980ff;
  color: #d980ff;
  border-radius: 1000px 1000px 0 1000px;
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

//智慧产业右侧
@for $i from 1 through 12 {
  .need-img-#{$i} {
    background-image: url(./assets/zhiqiao/needImg#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
}

.side-btn-title {
  border-radius: 16px 4px 16px 4px;
}

@for $i from 1 through 9 {
  .med-icon-#{$i} {
    background-image: url(./assets/medIcon#{$i}.png);
    background-size: 100% 100%;
  }
}
  
@for $i from 1 through 7 {
  .middle-icon-#{$i} {
    background-image: url(./assets/middleIcon#{$i}.png);
    background-size: 100% 100%;
  }
}

@for $i from 1 through 4 {
  .video-#{$i} {
    background-image: url(./assets/video#{$i}.png);
    background-size: 100% 100%;
  }
}
</style>
