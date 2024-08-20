<script setup lang="ts">
import axios from 'axios';
import Dplayer from 'dplayer'
import Hls from "hls.js";

const checkAuth = async (deviceSerial, channelNo, leftTimes = 3):Promise<string> => {
  if (leftTimes <= 0) {
    ElMessage.error("获取视频流失败，请联系管理员!");
  }
  if (!deviceSerial || !channelNo || leftTimes <= 0) return '';
  const liveToken = localStorage.getItem("LIVE_TOKEN"), expireTime = localStorage.getItem("LIVE_EXPIRE_TIME") ?? '0';
  const isExpired = ((parseInt(expireTime) ?? 0) - new Date().valueOf()) < 0
  if (liveToken && !isExpired) {
    // 获取视频流
    const { data: liveDataRes } = await axios.post(
      "https://ezcloud.uniview.com/openapi/live/video/device/url/get",
      { deviceSerial, channelNo },
      { headers: { Authorization: liveToken } }
    )
    const { code, data: liveData } = liveDataRes;
    if (code === 200) {
      const { liveUrlList } = liveData
      if (Array.isArray(liveUrlList) && liveUrlList.length > 0) {
        return liveUrlList[0].url
      } else return ''
    } else return ''
  }

  const { data } = await axios.post("https://ezcloud.uniview.com/openapi/user/app/token/get", {
    appId: "626194353357848583",
    secretKey: "ca06cd14935e031bd7a394ee7eca154d"
  })
  if (data && data?.code === 200) {
    const { accessToken, expireTime } = data.data;
    if (accessToken) localStorage.setItem("LIVE_TOKEN", accessToken)
    if (expireTime) localStorage.setItem("LIVE_EXPIRE_TIME", expireTime + '000')
  }
  return await checkAuth(deviceSerial, channelNo, leftTimes - 1)
}

const route = useRoute()
const initPlayer = async () => {
  const param = route.query;
  const { dtu, channelId } = param;
  if (!dtu || !channelId || dtu === 'null' || channelId === 'null') {
    return ElMessage.error('通道号或序列号不存在!');
  }
  const resUrl = await checkAuth(dtu, channelId)
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
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    }
  })
}

onMounted(() => { initPlayer() })
</script>
<template>
  <div class="flex justify-center items-center">
    <div id="playerContainer" class="container h-[calc(100vh_-_8rem)]"></div>
  </div>
</template>