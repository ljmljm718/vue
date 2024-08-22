<script setup lang="ts">
import { ref } from 'vue';
import ArrowIcon from '@/components/arrow/index.vue'
import request from '@/config/axios'

const projectCategoryTree = async (params: any) => {
  return await request.get({
    url: `/portal/project-category/tree`, params
  })
}

const fetchMenuList = async () => {
  const data = await projectCategoryTree({ parentId: 0, status: 1 })
  if (Array.isArray(data)) topMenuList.value = data.map((item, index) => {
    return {
      ...item,
      onClick: (item) => {
        globalClick(index, item)
      },
      onMouseEnter: () => {
        menuFlag.value = true
        if (item.code === 'production_education_training') {
          getFloatText('以培养产业需求的高素质技术技能人才和满足产业转型升级和技术创新为重点，联合行业组织、职业院校、普通高等学校、上下游企业等共同组建，促进产教布局高度匹配，服务高效对接，构建“产学研用”长效机制，推动产业需求全面融入人才培养全过程，秉持“开放、协同、共享、共赢”的运行理念，在更多领域、更深层次加强合作，为产业发展和职业教育发展做出贡献，支撑机器人和工业互联网人才培养和行业发展。', (text) => {
            text1.value = text
          })
        }
        setTimeout(() => {
          if (menuFlag.value) handleMainContentScroll(index)
        }, 300)
      }
    }
  })
}

const generating = ref(false)
const getFloatText = (text = '', callback) => {
  if (generating.value) return
  generating.value = true
  const textLength = text.length
  let index = 0
  const tempTextGenerator = () => {
    index++
    setTimeout(() => {
      if (index === textLength + 1) {
        index = 0
        generating.value = false
      } else {
        callback(text.slice(0, index))
        tempTextGenerator()
      }
    }, parseInt(Math.random() * (60 - 30 + 1 ) + 30, 10)) // 
  }
  tempTextGenerator()
}

const selectedMenu = ref(0), menuFlag = ref(false)
const text1 = ref('以培养产业需求的高素质技术技能人才和满足产业转型升级和技术创新为重点，联合行业组织、职业院校、普通高等学校、上下游企业等共同组建，促进产教布局高度匹配，服务高效对接，构建“产学研用”长效机制，推动产业需求全面融入人才培养全过程，秉持“开放、协同、共享、共赢”的运行理念，在更多领域、更深层次加强合作，为产业发展和职业教育发展做出贡献，支撑机器人和工业互联网人才培养和行业发展。')

const hiddenMenuItem = ref([])
const hiddenSelectIndex = ref(0)
const globalClick = (index = 0, item = []) => {
  selectedMenu.value = index
  handleMainContentScroll(index)
  setTimeout(() => {
    if (Array.isArray(item)) {
      console.log('ITEM', item);
      hiddenMenuItem.value = item
    } else { hiddenMenuItem.value = [] }
    console.log(hiddenMenuItem.value[0]);
    hiddenSelectIndex.value = 0
    showHiddenMenu.value = true
  }, 100)
}
const topMenuList = ref<any[]>([])

const curIndex = ref(0)
const handleMainContentScroll = (index = 0) => {
  curIndex.value = index
  const mainContainer = document.getElementById("mainContainer") as any
  const currentWindowHeight = window.innerHeight;
  mainContainer.scrollTop = (currentWindowHeight - 64) * index
  // scrollAnimation(mainContainer.scrollTop, (currentWindowHeight - 64) * index)
}

const scrollTimer = ref<any>(null)
const handleContainerScroll = (e) => {
  clearTimeout(scrollTimer.value)
  const mainContainer = document.getElementById("mainContainer")
  const currentWindowHeight = window.innerHeight;
  curIndex.value = Math.ceil(mainContainer.scrollTop / currentWindowHeight - .5)
  scrollTimer.value = setTimeout(() => {
    handleMainContentScroll(curIndex.value)
  }, 1000)
}

const scrollAnimation = (start, end) => {
  const DEFALUT_STEP = Math.abs(start - end) > 2000 ? 50
    : Math.abs(start - end) > 1000 ? 30
    : 20
  let step = DEFALUT_STEP, position = start;
  if (start > end) step = -DEFALUT_STEP
  const _dom = document.getElementById("mainContainer")
  if (_dom.scrollTop === end) return
  const animate = () => {
    if (Math.abs(position - end) <= Math.abs(step)) {
      position = end
    } else { position += step }
    _dom.scrollTop = position
    if (step === DEFALUT_STEP && position < end) requestAnimationFrame(animate)
    if (step === -DEFALUT_STEP && position > end) requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}


const showHiddenMenu = ref(false)
window.addEventListener('click', () => {
  if(permitCloseMenu.value && showHiddenMenu.value) showHiddenMenu.value = false
})
const permitCloseMenu = ref(true)

fetchMenuList()
const openPage = (url) => {
  window.open(url)
}
</script>

<template>
  <main class="frame-wrapper">
    <div class="header-wrapper">
      <div class="header-logo">
        <img src="/images/logo.png" alt="" />
        <div class="header-title">
          装备智能制造产品云控中台
        </div>
      </div>
      <div class="top-menu-wrapper">
        <div
          :class="`top-menu-item ${index === selectedMenu ? 'selected-menu-item' : ''}`"
          v-for="(item, index) in topMenuList"
          :key="index"
          @click="item.onClick(item.children)"
          @mouseenter="item.onMouseEnter"
          @mouseleave="menuFlag = false"
        >{{ item.label }}</div>
      </div>
      <div class="input-wrapper">
      </div>
      <div class="avatar-wrapper">
        <img src="/images/avatar.png" alt="" />
      </div>
    </div>
    <div class="main-container" @scroll="handleContainerScroll" id="mainContainer">
      <div
        class="main-item"
        :style="`background-image: url(${item.pic ? item.pic : '/images/constructionSite.png'})`"
        v-for="(item, index) in topMenuList"
        :key="index"
      >
        <div class="main-item-inner">
          <div class="left-inner-part">
            <div class="main-title" v-show="item.description">
              <span>{{ item.name }}</span>
              <ArrowIcon />
            </div>
            <div class="main-text">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="`hidden-menu-wrapper ${showHiddenMenu ? 'menu-show-animation' : 'menu-hidden-animation'}`"
      v-show="showHiddenMenu"
      @mouseenter="permitCloseMenu = false"
      @mouseleave="permitCloseMenu = true"
    >
      <div class="hidden-menu-left">
        <div
          v-for="(item, index) in hiddenMenuItem"
          :key="item.id"
          :class="`hidden-menu-left-item ${index === hiddenSelectIndex ? 'hidden-left-selected' : ''}`"
          @click="hiddenSelectIndex = index"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="hidden-menu-item" v-if="hiddenMenuItem.length > 0">
          <div
            class="hidden-menu-item-item"
            v-for="item in hiddenMenuItem[hiddenSelectIndex].projectBaseRespVOList"
            :key="item.id"
            @click="openPage(item.accessPath)"
          >
            <img :src="item.pic ? item.pic : '/images/Rect.png'" alt="" />
            <div class="float-panel" v-if="item.description">{{ item.description }}</div>
            <span>{{ item.name }}</span>
          </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.frame-wrapper {
  width: 100vw;
  height: 100vh;
  $HeaderHeight: 64px;
  .header-wrapper {
    height: $HeaderHeight;
    width: 100%;
    background: #ffffffc9;
    backdrop-filter: saturate(180%) blur(20px);
    box-shadow: 2px 2px 2px #25252513;
    display: flex;
    justify-content: center;
    align-items: center;
    .header-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding-left: 1rem;
      padding-right: .6rem;
      color: white;
      background: linear-gradient(296deg, #0057E6 0%, #00ADF6 100%, #0CB7FF 100%);
      img {
        width: 1.3rem;
        height: 1.3rem;
        object-fit: contain;
      }
      .header-title {
        padding: 0 1rem;
      }
    }
    .top-menu-wrapper {
      display: flex;
      align-items: center;
      padding: 0 30px;
      .top-menu-item {
        color: black;
        padding: 0 16px;
        height: 62px;
        display: flex;
        align-items: center;
        user-select: none;
        transition: all .1s ease;
        cursor: pointer;
      }
      .selected-menu-item {
        border-top: 3px solid #0069f3;
        position: relative;
      }

      .selected-menu-item::after {
        content: '';
        width: 0px;
        height: 0px;
        position: absolute;
        top: 3px;
        left: calc(50% - 6px);
        border: 6px solid transparent;
        border-top: 6px solid #0069f3;
      }
    }
    .input-wrapper {
      margin-left: 160px;
      input {
        border: 1px solid #14141464;
        border-radius: .2rem;
        height: 1.9rem;
        padding: 0 .8rem;
      }
    }
    .avatar-wrapper {
      width: 2rem;
      height: 2rem;
      border-radius: 1rem;
      background-color: #0069f3;
      margin-left: 1rem;
      box-shadow: 2px 2px 2px #25252525;
      img {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
      }
    }
  }
  .main-container {
    overflow: auto;
    width: 100%;
    height: calc(100vh - #{$HeaderHeight});
    .main-item {
      position: relative;
      height: calc(100vh - #{$HeaderHeight});
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      .main-item-inner {
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 100%;
        color: #484848;
        mix-blend-mode: difference;
        .left-inner-part {
          width: 50%;
          height: 100%;
          padding: 7% 0% 10% 10%;
        }
      }
    }
  }
  .main-container::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .hidden-menu-wrapper {
    position: fixed;
    z-index: 999;
    top: 64px;
    width: 100vw;
    min-height: 300px;
    display: flex;
    background: #ffffffdb;
    backdrop-filter: saturate(180%) blur(20px);
    box-shadow: 2px 2px 2px #25252513;
    transition: all .4s ease;

    .hidden-menu-left {
      max-width: 400px;
      background-image: url(/images/menu.png);
      background-repeat: no-repeat;
      background-position: left bottom;
      background-size: 100% auto;
      background-color: #e8eaee;
      padding: 40px 60px;
      .hidden-menu-title {
        font-size: 1.3rem;
        padding-bottom: .6rem;
      }
      .hidden-menu-text {
        color: #25252589;
        padding: .6rem 0;
      }
      .hidden-menu-left-item {
        color: #181818;
        padding: .8rem 0 .4rem 0;
        cursor: pointer;
      }
    }
    .hidden-menu-item {
      width: calc(100% - 200px);
      padding: 40px 50px;
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x;
      .hidden-menu-title {
        font-size: 1.1rem;
        padding-bottom: .9rem;
      }
      .hidden-menu-text {
        color: #25252589;
        padding: .4rem 0;
      }
      .hidden-menu-item-item {
        color: #25252589;
        flex: 0 0 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        position: relative !important;
        cursor: pointer;
        scroll-snap-align: start;
        user-select: none;
        img {
          width: 30rem;
          height: 12rem;
          object-fit: contain;
        }
        .float-panel {
          position: absolute;
          left: 2.4rem;
          top: 2rem;
          padding: .4rem .6rem;
          background-color: #ffffffd6;
        }
      }
    }
  }
}

.hidden-menu-item::-webkit-scrollbar {
  /*滚动条整体样式*/
    width: 6px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
}
.hidden-menu-item::-webkit-scrollbar-thumb {
/*滚动条里面深色条*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(236, 236, 236, 0.1);
  background: #ccc;
}
.hidden-menu-item::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(236, 236, 236, 0.1);
  border-radius: 10px;
  background: #ededed;
}

.menu-hidden-animation {
  opacity: 0.4;
  transform: translateY(-20px);
}

.menu-show-animation {
  opacity: 1;
  transform: translateY(0);
}

.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-title {
  font-size: 4rem;
  font-weight: bolder;
  display: flex;
  align-items: center;
  font-family: 'BiaoTi';
  color: white;
  mix-blend-mode: difference;
  span {
    padding-right: 2rem;
  }
}

.main-text {
  color: #ffffffde;
  padding: .6rem 0;
  line-height: 2.4rem;
  font-size: 1.2rem;
}

.pic-wall-wrapper {
  display: flex;
  .pic-wall-item {
    margin-right: 3rem;
    img {
      width: 16rem !important;
      height: 16rem !important;
      position: relative !important;
    }
  }
}

.hidden-left-selected {
  color: #006eff !important;
  border-bottom: 2px solid #006eff;
}
</style>
