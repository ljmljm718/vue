<template>
  <div>
    <Home1 v-if="deptId === 117" />
    <Home v-else-if="deptId === 115" />
    <HomeWenFeng v-else-if="deptId === 120" />
    <HomeBaiBu v-else-if="deptId === 122" />
    <Index v-else />
  </div>
</template>
<script setup lang="ts">
import { getUserProfile } from '@/api/system/user/profile'
import Index from './Index.vue'
import Home from './home.vue'
import Home1 from './home1.vue'
import HomeWenFeng from './homeWenFeng.vue'
import HomeBaiBu from './homeBaiBu.vue'
const deptId = ref(0)
const judgeHomePage = async () => {
  const data = await getUserProfile()
  deptId.value = data.dept.id
}
judgeHomePage()
</script>