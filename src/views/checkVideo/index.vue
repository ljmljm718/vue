<script setup lang="ts">
import { getUserProfile } from '@/api/system/user/profile';

const deptId = ref(0);
const getDeptId = async () => {
  const data = await getUserProfile();
  deptId.value = data.dept.id;
};
getDeptId();

const deviceSerial = ref<string>('');
const channelNo = ref<number>(1);
const route = useRoute();
const getSerialAndChannelNo = () => {
  console.log('route', route);
  deviceSerial.value = route.query.dtu;
  channelNo.value = route.query.channelId;
};
getSerialAndChannelNo();
</script>
<template>
  <div class="flex justify-center items-center w-full" style="height: calc(100vh - 125px)">
    <ys-player v-if="[156, 161].includes(deptId)" v-model="deviceSerial" :channelNo="channelNo" />
    <ez-player v-else v-model="deviceSerial" :channelNo="channelNo" />
  </div>
</template>
