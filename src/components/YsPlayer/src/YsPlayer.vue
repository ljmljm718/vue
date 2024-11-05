<!-- 萤石云 播放器 -->
<script setup lang="ts">
import axios from 'axios';
import Dplayer from 'dplayer'
import Hls from "hls.js";
import { uniqueId } from 'lodash-es';

defineOptions({ name: 'YsPlayer' })

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  channelNo: {
    type: [String, Number],
    default: 1
  }
})
console.log("🚀 ~ props:", props)


watch(
  () => [props.modelValue, props.channelNo],
  (_deviceSerial, _channelNo) => {
    console.log("🚀 ~ _deviceSerial:", _deviceSerial)
    console.log("🚀 ~ _channelNo:", _channelNo)
    if (!_deviceSerial || !_channelNo) return;
    initPlayer(_deviceSerial, _channelNo)
  }
)

onMounted(() => {
  const _deviceSerial = props.modelValue;
  const _channelNo = props.channelNo
  if (!_deviceSerial || !_channelNo) return;
  initPlayer(_deviceSerial, _channelNo)
})

const APP_KEY:string = '10091090083e431d8c06690f1827089a';
const APP_SECRET:string = '70f73dadf7f27aaa0c41d772f85b8619';
const getAccessToken = async () => {
  const existedExpireTime = Number(localStorage.getItem("YS_EXPIRE_TIME"));
  if (isNaN(existedExpireTime)) return Promise.reject();
  const currentTime = new Date().valueOf();
  // 如果距离过期时间还有一天以上，不用访问接口
  if ((existedExpireTime - currentTime) > 1000 * 60 * 60 * 24) {
    return localStorage.getItem("YS_ACCESS_TOKEN");
  }
  const res = await axios.post(
    `https://open.ys7.com/api/lapp/token/get?appKey=${APP_KEY}&appSecret=${APP_SECRET}`,
    {}, { timeout: 1000 * 4 }
  ).catch(() => {
    console.error("获取accesstoken失败")
  })
  if (!res || !res?.data) return Promise.reject();
  const { data:codeData } = res;
  if (!codeData) return Promise.reject();
  const { code, data } = codeData;
  if (code != 200) return Promise.reject();
  const { accessToken, expireTime } = data;
  if (!accessToken || !expireTime) return Promise.reject();
  localStorage.setItem("YS_ACCESS_TOKEN", accessToken)
  localStorage.setItem("YS_EXPIRE_TIME", expireTime)
}

let playerIns:any = null;
let hls:any = null
const domID = uniqueId()
const initPlayer = async (deviceSerial:string, channelNo:number = 1) => {
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
  })
}

onUnmounted(() => {
  if (playerIns) playerIns.destroy();
  if (hls) hls.destroy();
})

onActivated(() => {
  initPlayer(props.modelValue, props.channelNo)
})
onDeactivated(() => {
  if (playerIns) playerIns.destroy();
  if (hls) hls.destroy();
})

const formatParams = (obj:Object):string => {
  let res = ''
  for (let key in obj) {
    res += `${key.toString()}=${obj[key].toString()}&`
  }
  return res;
}

// 获取播放地址, 如果没有accessToken 尝试三次获取token
const getPlayUrl = async (deviceSerial:string, channelNo:number = 1, tryNum = 3) => {
  const accessToken = localStorage.getItem("YS_ACCESS_TOKEN")
  if (!accessToken || tryNum <= 0) return getAccessToken().then(() => { getPlayUrl(deviceSerial, channelNo, tryNum--) });
  
  const formattedUrl = formatParams({
    accessToken, deviceSerial, channelNo, protocol: 2
  })
  const res = await axios.post(
    `https://open.ys7.com/api/lapp/v2/live/address/get?${formattedUrl}`,
    {}, { timeout: 1000 * 4 }
  ).catch(() => {
    console.error("获取accesstoken失败")
  })
  console.log("获取到的播放地址", res)
  const resUrl = res?.data?.data?.url;
  if (!resUrl) return;
  console.log("resUrl", resUrl)
  return resUrl;
}

defineExpose({ initPlayer })
</script>
<template>
  <!-- 萤石云 -->
  <div class="w-full h-full" :id="domID"></div>
</template>
<style scoped lang="scss">
</style>