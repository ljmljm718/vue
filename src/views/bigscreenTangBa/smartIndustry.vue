<script setup lang="ts">
import Dplayer from 'dplayer'
import Hls from "hls.js";

const activeTab = ref<string>('1')
const bottomTabs = [
  { id: '1', name: '枳壳', icon: 'tab-icon-1' },
  { id: '2', name: '柠檬', icon: 'tab-icon-2' },
  { id: '3', name: '紫苏', icon: 'tab-icon-3' },
  { id: '4', name: '大米', icon: 'tab-icon-4' }
]

const situationList = ref<any[]>([
  {
    id: '1',
    title: '种植面积/亩',
    value: '4000+'
  },
  {
    id: '1',
    title: '种植面积/亩',
    value: '4000+'
  },
  {
    id: '1',
    title: '种植面积/亩',
    value: '4000+'
  },
  {
    id: '1',
    title: '种植面积/亩',
    value: '4000+'
  },
])

// 市场需求
const markNeedList = ref<any[]>([
  { id: '1', img: 'need-img-1', label: '枳壳'},
  { id: '2', img: 'need-img-2', label: '陈皮' },
  { id: '3', img: 'need-img-3', label: '陈皮条' },
])
</script>
<template>
  <div class="w-[1920px] h-[970px] bg-red relative">
    <!-- 左侧 -->
    <div class="absolute left-[16px] top-[16px] w-[500px] h-[930px] mengban z-10">
      <div class="flex items-center p-1 h-32px bottom-border">
        <div class="titleIcon w-16px h-16px mx-2"></div>
        <div class="text-[16px] art-font">本村产业情况</div>
      </div>
      <div class="flex justify-evenly items-center h-110px">
        <div
          v-for="item in situationList"
          :key="item.id"
          class="flex flex-col items-center relative top-10px"
        >
          <div class="relative top-10px text-[18px] text-[#08FFFF] art-font">{{ item.value }}</div>
          <div class="relative top-10px text-[14px] text-[#fff]">{{ item.title }}</div>
          <div class="IndusSituationImg w-80px h-60px"></div>
        </div>
      </div>
      <div class="w-full h-240px">
        <el-scrollbar height="240px">
          <div class="p-4 px-6 leading-6">天印村积壳基地位于天印村1、2、3社，由重庆市印天湖现代农业发展有限公司和重庆市古传现代农业有限公司流转当地土地经营，于2018年建立，种植面积约4000余亩、10万余株，是西南地区最大标准化枳壳产业园，由村集体经济组织统一规划管理。产品主要是通过初加工烘烤后销往四川、安徽等中药材市场，年产值可达4000余万元，可带动周边群众就近8000余人次务工就业，为当地农民增收300余万元，具有良好的社会、经济效益。</div>
        </el-scrollbar>
      </div>
      <div class="flex items-center p-1 h-32px bottom-border">
        <div class="titleIcon w-16px h-16px mx-2"></div>
        <div class="text-[16px] art-font">药用价值及功效</div>
      </div>
      <div class="w-full h-490px">
        <el-scrollbar height="490px">
          <div class="p-4 py-7">
            <div class="flex items-start justify-center">
              <div class="rounded-full w-50px h-50px bg-red"></div>
              <div class="w-350px ml-5">
                <div class="bg-#eefc6d text-black text-18px font-bold side-btn-title w-120px text-center py-1 mb-2">传统功效</div>
                <div class="pb-4">
                  <div class="text-#eefc6d text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                </div>
                <div class="pb-4">
                  <div class="text-#eefc6d text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                </div>
                <div class="pb-4">
                  <div class="text-#eefc6d text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                </div>
                <div class="pb-4">
                  <div class="text-#eefc6d text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                </div>
              </div>
            </div>
            <div class="flex items-start justify-center mt-4">
              <div class="rounded-full w-50px h-50px bg-red"></div>
              <div class="w-350px ml-5">
                <div class="bg-#08FFFF text-black text-18px font-bold side-btn-title w-120px text-center py-1 mb-2">传统功效</div>
                <div class="pb-4">
                  <div class="text-#08FFFF text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                </div>
                <div class="pb-4">
                  <div class="text-#08FFFF text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                </div>
                <div class="pb-4">
                  <div class="text-#08FFFF text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
                </div>
                <div class="pb-4">
                  <div class="text-#08FFFF text-18px">理气宽中:</div>
                  <div>枳壳味辛、苦，归脾经和胃经，辛能行散，苦能降泄，具有行气开胸、宽中的作用。</div>
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
        <div class="titleIcon w-16px h-16px mx-2"></div>
        <div class="text-[16px] art-font">视频</div>
      </div>
      <div class="p-4 box-border">
        <div id="player" class="w-full h-250px bg-black"></div>
      </div>
      <div class="flex items-center p-1 h-32px bottom-border">
        <div class="titleIcon w-16px h-16px mx-2"></div>
        <div class="text-[16px] art-font">市场需求</div>
      </div>
      <div class="flex justify-evenly items-center h-120px box-border pt-10px">
        <div
          v-for="item in markNeedList"
          :key="item.id"
          class="flex flex-col items-center space-y-2"
        >
          <div :class="[item.img, 'w-60px h-60px']"></div>
          <div class="bg-#08FFFF text-[#011414] flex justify-center items-center w-80px h-26px rounded-full">{{ item.label }}</div>
        </div>
      </div>
      <div class="w-full h-440px">
        <el-scrollbar height="440px">
          <div class="p-4 px-6 leading-6">枳壳的市场需求规模受到多种因素的影响，近年来呈现出一定的变化趋势。
	从整体市场需求来看，过去有数据显示国内外市场枳壳总需求曾达30000吨以上。中国市场是全球枳壳市场的主要消费国，占据了约70%的市场份额。国内部分地区的相关信息也能从侧面反映枳壳的市场需求，例如江苏扬子江药业年用量在500吨左右，重庆太极集团涪陵制药年用量为500吨左右（主要用于急支糖浆）。
	就目前的市场情况而言，有报道称枳壳市场年需求量在5000吨左右。不过，由于枳壳前几年存在大面积扩种的情况，导致产量增加，目前市场处于供大于求的状态，行情较为低迷。近期各中药材市场上枳壳货源走销不快，商家关注力度一般。
	总体来说，枳壳市场需求规模较大，但受到产量、市场行情等因素的影响，其实际的市场需求规模处于动态变化中。</div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 中间部分 -->
    <div class="w-full h-full absolute left-0 top-0 bg-#001110 z-0 flex flex-col items-center">
      <div class="industry-bg w-full h-[900px] flex flex-col items-center">
        <div class="w-[800px] mt-30px flex justify-between">
          <div class="leftButtonBg box-border flex items-center pl-50px w-280px h-50px text-[#fff] text-[23px]">传统功效</div>
          <div class="rightButtonBg box-border flex flex-row-reverse items-center pr-50px w-280px h-50px text-[#fff] text-[23px]">现代研究功效</div>
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
          class="middleTree w-650px h-650px mt-70px relative"
          v-if="activeTab === '2'"
        ></div>
        <div
          class="middleTree w-650px h-650px mt-70px relative"
          v-if="activeTab === '3'"
        ></div>
        <div
          class="middleTree w-650px h-650px mt-70px relative"
          v-if="activeTab === '4'"
        ></div>
      </div>
      <div class="h-45px bottomBg w-full mt-15px flex justify-center">
        <div class="w-400px h-full flex justify-evenly items-center">
          <div 
            v-for="item in bottomTabs"
            :key="item.id"
            @click="activeTab = item.id"
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

.middleTree {
  background-image: url(./assets/zhiqiao/tree.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.IndusSituationImg {
  background-image: url(./assets/IndusSituationImg.png);
  background-size: 100% 100%;
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

//智慧产业右侧
@for $i from 1 through 3 {
  .need-img-#{$i} {
    background-image: url(./assets/zhiqiao/needImg#{$i}.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
}

.side-btn-title {
  border-radius: 16px 0 16px 0;
}
</style>