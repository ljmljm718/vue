<template>
  <div>
    <Home1 v-if="deptId === 117" />
    <Home v-else-if="deptId === 115" />
    <Index v-else-if="deptId === 114" />
    <HomeAiKou v-else-if="deptId === 118" />
    <HomeWenFeng v-else-if="deptId === 120" />
    <HomeBaiBu v-else-if="deptId === 122" />
    <HomeBaidi v-else-if="deptId === 119" />
    <HomeMingYue v-else-if="deptId === 152" />
    <homeQianJiang v-else-if="deptId === 153" />
    <HomeTangBa v-else-if="deptId === 154" />
    <div v-else v-loading class="w-full h-[30rem]"></div>
  </div>
</template>
<script setup lang="ts">
import { getUserProfile } from '@/api/system/user/profile'                                       
import Index from './Index.vue'
import Home from './home.vue'
import Home1 from './home1.vue'
import HomeWenFeng from './homeWenFeng.vue'
import HomeBaiBu from './homeBaiBu.vue'
import HomeAiKou from './homeAiKou.vue'
import HomeBaidi from './homeBaidi.vue'
import HomeMingYue from './homeMingYue.vue'
import homeQianJiang from './homeQianJiang.vue'
import HomeTangBa from './homeTangBa.vue'
import { ref } from 'vue'
const deptId = ref(0)
const judgeHomePage = async () => {
  const data = await getUserProfile()
  deptId.value = data.dept.id
}
judgeHomePage()
</script>