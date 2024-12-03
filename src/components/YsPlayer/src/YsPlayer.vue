<!-- 萤石云 播放器 -->
<script setup lang="ts">
import axios from 'axios';
import Dplayer from 'dplayer';
import Hls from 'hls.js';
import { uniqueId } from 'lodash-es';
import request from '@/config/axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

defineOptions({ name: 'YsPlayer' });

const userStore = useUserStore();
//获取部门ID
const deptId = computed(() => userStore.user.deptId ?? '0');
// 新接口
const getVideoToken = async () => {
  return await request.get({
    url: `/agriculture/device-nvr/getVideoToken`
  });
};

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  channelNo: {
    type: [String, Number],
    default: 1
  }
});

watch(
  () => [props.modelValue, props.channelNo],
  (_deviceSerial, _channelNo) => {
    if (!_deviceSerial || !_channelNo) return;
    initPlayer(_deviceSerial as any, _channelNo as any);
  }
);

onMounted(() => {
  const _deviceSerial = props.modelValue;
  const _channelNo = props.channelNo;
  if (!_deviceSerial || !_channelNo) return;
  initPlayer(_deviceSerial, _channelNo as any);
});

const getAccessToken = async () => {
  const existedExpireTime = Number(localStorage.getItem('YS_EXPIRE_TIME'));
  if (isNaN(existedExpireTime)) return Promise.reject();
  const currentTime = new Date().valueOf();
  // 如果距离过期时间还有一天以上，不用访问接口
  if (existedExpireTime - currentTime > 1000 * 60 * 60 * 24) {
    return localStorage.getItem('YS_ACCESS_TOKEN');
  }
  const data = await getVideoToken();
  console.log('🚀 ~ checkAuth ~ data:', data);
  if (data && data !== 'error') {
    const myExpireTime = new Date().valueOf() + 1000 * 60 * 60 * 25;
    localStorage.setItem('YS_ACCESS_TOKEN', data);
    localStorage.setItem('YS_EXPIRE_TIME', myExpireTime as any);
  }
};

let playerIns: any = null;
let hls: any = null;
const domID = uniqueId();
const initPlayer = async (deviceSerial: string, channelNo: number = 1) => {
  const url = await getPlayUrl(deviceSerial, channelNo);
  if (!url) return;
  hls = new Hls();
  nextTick(() => {
    playerIns = new Dplayer({
      container: document.getElementById(domID),
      loop: false,
      autoplay: true,
      volume: 0,
      video: {
        url: url,
        type: 'customHls',
        customType: {
          customHls: (video) => {
            hls.loadSource(video.src);
            hls.attachMedia(video);
          }
        }
      },
      mutex: false
    });
  });
};

onUnmounted(() => {
  if (playerIns) playerIns.destroy();
  if (hls) hls.destroy();
});

onActivated(() => {
  initPlayer(props.modelValue, props.channelNo as any);
});
onDeactivated(() => {
  if (playerIns) playerIns.destroy();
  if (hls) hls.destroy();
});

const formatParams = (obj: Object): string => {
  let res = '';
  for (let key in obj) {
    res += `${key.toString()}=${obj[key].toString()}&`;
  }
  return res;
};

// 获取播放地址, 如果没有accessToken 尝试三次获取token
const getPlayUrl = async (deviceSerial: string, channelNo: number = 1, tryNum = 3) => {
  const accessToken = localStorage.getItem('YS_ACCESS_TOKEN');
  if (!accessToken || tryNum <= 0) {
    await getAccessToken();
    return await getPlayUrl(deviceSerial, channelNo, tryNum - 1);
  }

  const formattedUrl = formatParams({
    accessToken,
    deviceSerial,
    channelNo,
    protocol: 2
  });
  const { data } = await axios
    .post(
      `https://open.ys7.com/api/lapp/v2/live/address/get?${formattedUrl}`,
      {},
      { timeout: 1000 * 4 }
    )
    .catch(() => {
      console.error('获取accesstoken失败');
    });
  const resUrl = data?.data?.url;
  console.log('🚀 ~ getPlayUrl ~ res:', data);
  if (!resUrl) {
    const { msg } = data;
    if (msg && ![152, 154].includes(deptId.value)) ElMessage.warning(msg.toString());
    return;
  }
  return resUrl;
};

const info = ref<string>('');
defineExpose({ initPlayer });
</script>
<template>
  <!-- 萤石云 -->
  <div class="w-full h-full bg-black text-white" :id="domID">
    {{ info }}
  </div>
</template>
<style scoped lang="scss"></style>
