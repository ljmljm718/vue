<script setup lang="ts">
import axios from 'axios';
import Dplayer from 'dplayer'
import Hls from "hls.js";
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DeviceNvrApi } from '@/api/agriculture/devicenvr/index'

const hls = new Hls();
onActivated(() => { initPlayer() })
onDeactivated(() => { hls.destroy() })

const sleep = (delaytime = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delaytime))
}

const route = useRoute()
const checkOnce = ref<boolean>(true)
hls.on(Hls.Events.ERROR, (err:any) => {
  console.log("🚀 ~ hls.on ~ err:", err)
  if (err === 'Success') return;
  if (!checkOnce.value) return;
  checkOnce.value = false;
  const param = route.query;
  const { dtu, channelId } = param;
  startVideoPush(dtu, channelId)
})
const checkAuth = async (deviceSerial, channelNo, leftTimes = 3):Promise<string> => {
  if (leftTimes <= 0) {
    ElMessage.error("获取视频流失败，请联系管理员!");
  }
  if (!deviceSerial || !channelNo || leftTimes <= 0) return '';
  const liveToken = localStorage.getItem("LIVE_TOKEN"), expireTime = localStorage.getItem("LIVE_EXPIRE_TIME") ?? '0';
  console.log("🚀 ~ checkAuth ~ liveToken:", liveToken)
  const isExpired = ((parseInt(expireTime) ?? 0) - new Date().valueOf()) < 0
  if (liveToken && !isExpired) {
    // 获取视频流
    const { data: liveDataRes } = await axios.post(
      "https://ezcloud.uniview.com/openapi/live/video/get",
      { deviceSerial, channelNo, protocol: 2, quality: 1 },
      { headers: { Authorization: liveToken } }
    )
    const { code, data: UrlData } = liveDataRes;
    const { status = -1, url } = UrlData;
    if (code === 200) {
      if (status !== 0) {
        await await axios.post(
          'https://ezcloud.uniview.com/openapi/live/video/start',
          { url }, { headers: { Authorization: liveToken } }
        )
        await sleep(3000)
      }
      return url;
    } else return ''
  }

  const { list } = await DeviceNvrApi.getDeviceNvrPage({ pageNo: 1, pageSize: 10 }).catch(() => {})
  let appId = "626194353357848583", secretKey = "ca06cd14935e031bd7a394ee7eca154d";
  if (Array.isArray(list) && list.length > 0) {
    const firstItem = list[0];
    const { appId:_appId, secretKey:_secretKey } = firstItem;
    appId = _appId;
    secretKey = _secretKey
  }
  const { data } = await axios.post("https://ezcloud.uniview.com/openapi/user/app/token/get", {
    appId, secretKey
  })
  if (data && data?.code === 200) {
    const { accessToken, expireTime } = data.data;
    if (accessToken) localStorage.setItem("LIVE_TOKEN", accessToken)
    if (expireTime) localStorage.setItem("LIVE_EXPIRE_TIME", expireTime + '000')
  }
  return await checkAuth(deviceSerial, channelNo, leftTimes - 1)
}


const initPlayer = async () => {
  const param = route.query;
  const { dtu, channelId, url } = param;
  if (!dtu || !channelId || dtu === 'null' || channelId === 'null') {
    if (url) return new Dplayer({
      container: document.getElementById("playerContainer"),
      loop: false, autoplay: true, volume: 0,
      video: {
        url,
        type: "customHls",
        customType: {
          customHls: (video) => {
            hls.loadSource(video.src);
            hls.attachMedia(video);
          },
        },
      }
    })
    return ElMessage.error('通道号或序列号不存在!');
  }
  const resUrl = await checkAuth(dtu, channelId)
  console.log("🚀 ~ initPlayer ~ resUrl:", resUrl)
  if (!resUrl) return ElMessage.error('获取视频流失败，请联系管理员!');
  new Dplayer({
    container: document.getElementById("playerContainer"),
    loop: false,
    autoplay: true,
    volume: 0,
    video: {
      url: resUrl,
      type: "customHls",
      customType: {
        customHls: (video) => {
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    }
  })
}

onMounted(() => { initPlayer() })
onBeforeUnmount(() => {
  hls.destroy()
})

const liveVideoId = ref<string>('')
const startOnce = ref<boolean>(true)
// 开启推流 quality: 0-高清、1-标清、2-流畅
const startVideoPush = async (deviceSerial, channelNo, protocol = 2, quality = 2) => {
  const liveToken = localStorage.getItem("LIVE_TOKEN");
  if (!liveToken) return ElMessage.warning('请等待初始化完成!');
  // 获取播放地址
  const { data: addData } = await axios.post(
    "https://ezcloud.uniview.com/openapi/live/video/get",
    { deviceSerial, channelNo, protocol, quality },
    { headers: { Authorization: liveToken } }
  )
  const { code:addDataCode, data:addDataData = {}, message:addDataMessage } = addData;
  const { status, url } = addDataData;
  console.log("🚀 ~ startVideoPush status === 0 已开启 ~ status:", status)
  if (addDataCode === 200 && status && status !== 0) {
    // 开启播放功能
    const { data:startData } = await axios.post(
      "https://ezcloud.uniview.com/openapi/live/video/start",
      { url }, { headers: { Authorization: liveToken } }
    )
    console.log("🚀 ~ startVideoPush ~ startData:", startData)
    if (startData) {
      const { code:succCode, data:succData } = startData;
      if (succCode === 200) {
        // 开启成功
        console.log("🚀 ~ startVideoPush ~ 开启成功:")
        const { liveId } = succData;
        liveVideoId.value = liveId;
        if (!startOnce.value) return;
        startOnce.value = false
        initPlayer()
      }
    }
    const { code, message } = startData;
    if (code !== 200) ElMessage.warning(message)
  } else {
    ElMessage.warning(addDataMessage)
    if (!startOnce.value) return;
    startOnce.value = false
    initPlayer()
  }
}
</script>
<template>
  <div class="flex justify-center items-center">
    <div id="playerContainer" class="container h-[calc(100vh_-_8rem)]"></div>
  </div>
</template>