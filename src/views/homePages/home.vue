<template>
  <div class="w-full h-[100vh] overflow-hidden home-page-bg1 relative text-white p-[2.4rem] box-border">
    <div class="w-full flex justify-between items-center text-[2rem]">
      <div class="flex space-x-2 items-center">
        <div class="home-logo w-[4rem] h-[4rem]"></div>
        <div class="art-font">鲁渝协作</div>
      </div>
      <div class="flex items-center">
        <el-input
          v-model="input"
          style="border-radius: 10px;"
          placeholder="输入文字快速搜索"
        />
        <div class="power-logo w-[2rem] h-[1.3rem] ml-4" @click="logout"></div>
        <div
          class="w-[3rem] text-[#fff] text-[.8rem] pl-1"
          @click="logout"
        > 注销 </div>
      </div>
    </div>
    <div class="top-bg w-full aspect-[24] flex px-[2rem] flex justify-between text-black items-center box-border mt-[.4rem] rounded-xl shadow-xl">
      <div class="text-[1.8rem] font-bold">鲁渝协作乡村振兴示范村数字化平台</div>
      <div class="flex items-center cursor-pointer">
        <div class="ling-logo w-[2rem] h-[1.3rem] ml-4"></div>
        <el-badge :value="totalNum" class="item">
          <div>
            <span style="font-size: 14px;">我的待办</span>
          </div>
        </el-badge>
      </div>
    </div>
    <div
      class="bg-[#ffffffd0] w-full mt-[1rem] rounded-xl shadow-xl p-[2rem] grid grid-cols-5 grid-rows-2 gap-[1rem] box-border"
      style="height: calc(100vh - 17rem);"
    >
      <div
        :class="`bg-[#F3F8FF] flex flex-col items-center justify-center px-[2rem] col-span-${item.span || 1}`"
        v-for="item in menuList"
        :key="item.id"
        :style="`background-image: url(${item.imgId});background-size:cover;`"
        @click="item.path && router.push(item.path)"
      >
        <div :class="`icon-${item.icon || 0} w-[5.3rem] h-[5.3rem]`"></div>
        <div class="text-[1.3rem] art-font linear-title" style="mix-blend-mode: difference;">{{ item.name }}</div>
        <div
          class="flex flex-col items-center space-y-1 text-[#fff] p-3 min-h-[3.8rem] text-center"
          style="mix-blend-mode: difference;"
          v-html="item.description.replace(/\n|\\s/gm, '<br/>')"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const input = ref('')
const totalNum = ref(0)

const router = useRouter()
const { wsCache } = useCache()
console.log("userStore", wsCache.get(CACHE_KEY.ROLE_ROUTERS));
const staticMenus = [
  {
    id: 'home',
    icon: 1,
    name: '首页',
    imgId: '',
    description: '设备信息|预警信息\n种养殖监测数据统计信息',
  },
  {
    id: 'bigscreen',
    icon: 2,
    name: '可视化大屏',
    imgId: '',
    span: 2,
    description: '设备信息|预警信息\n种养殖监测数据统计信息',
  },
]
const menuList = ref<Array<any>>([])

const buildMenuList = () => {
  const activeMenus = wsCache.get(CACHE_KEY.ROLE_ROUTERS).filter(item => {
    if (item.description || item.description) return true
  })
  const iconMap = {
    "home" : '1',
    "bigscreen": "2",
    "3964": "3",
    "3992": "4",
    "3991": "5",
    "3999": "6",
    "4058": "8",
    "1": "9"
  }
  menuList.value = [...staticMenus, ...activeMenus.map(item => ({ ...item, icon: iconMap[item.id.toString()] }))]
  console.log('buildMenuList', menuList.value);
  
}
buildMenuList()

</script>
<style lang="scss" scoped>
.home-page-bg1 {
  background-image: url(./assets/home/bg.png);
  background-size: 100% 100%;
}

.home-item-bg {
  background-image: url(./assets/itemBg.png);
  background-size: 100% 100%;
}

.home-logo {
  background-image: url(./assets/home/logo.png);
  background-size: 100% 100%;
}

.power-logo {
  background-image: url(./assets/home/power.png);
  background-size: 100% auto;
}

.top-bg {
  background-image: url(./assets/home/topBg.png);
  background-size: 110% 110%;
  background-position: center center;
}

.ling-logo {
  background-image: url(./assets/home/ling.png);
  background-size: 100% 100%;
}

@for $i from 1 through 9 {
  .icon-#{$i} {
    background-image: url(./assets/home/icon#{$i}.png);
    background-size: 100% 100%;
  }
}

.linear-title {
  background-image: linear-gradient(to top, #9bbef4, #b7daf6);
  -webkit-background-clip: text;
  color: transparent;
}
</style>
