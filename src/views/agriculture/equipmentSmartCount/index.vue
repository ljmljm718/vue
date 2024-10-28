<script setup lang="ts">
import { getUserProfile } from '@/api/system/user/profile'
import DefaultView from './defaultView.vue'
import TongMingView from './tongmingView.vue'

const deptId = ref(0)
const 智能统计 = async () => {
  const data = await getUserProfile()
  deptId.value = data.dept.id
}
智能统计()
</script>
<template>
  <div>
    <TongMingView v-if="deptId === 166" />
    <DefaultView v-else />
  </div>
</template>