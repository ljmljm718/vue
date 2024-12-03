<!-- 宇视云 播放器 -->
<script setup lang="ts">
import { DeviceNvrApi } from '@/api/agriculture/devicenvr/index';
import Dplayer from 'dplayer';
import Hls from 'hls.js';
import axios from 'axios';
import { uniqueId } from 'lodash-es';
import request from '@/config/axios';

const liveToken = localStorage.getItem('LIVE_TOKEN');
if (liveToken === 'error') localStorage.removeItem('LIVE_TOKEN');

// 新接口
const getVideoToken = async () => {
  return await request.get({
    url: `/agriculture/device-nvr/getVideoToken`
  });
};

defineOptions({ name: 'EzPlayer' });

const domID = uniqueId();

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  channelNo: {
    type: [String, Number],
    default: () => 1
  }
});

watch(
  () => [props.modelValue, props.channelNo],
  (_deviceSerial, _channelNo) => {
    if (!_deviceSerial || !_channelNo) return;
    initPlayer(_deviceSerial, _channelNo);
  }
);

onMounted(() => {
  const _deviceSerial = props.modelValue;
  const _channelNo = props.channelNo;
  if (!_deviceSerial || !_channelNo) return;
  initPlayer(_deviceSerial, _channelNo);
});

const sleep = (delaytime = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, delaytime));
};

const checkAuth = async (deviceSerial, channelNo = 1, leftTimes = 10): Promise<string> => {
  if (leftTimes <= 0) {
    // ElMessage.error("获取视频流失败，请联系管理员!");
  }
  if (!deviceSerial || !channelNo || leftTimes <= 0) return deviceSerial;
  const liveToken = localStorage.getItem('LIVE_TOKEN');
  if (liveToken) {
    // 获取视频流
    const { data: liveDataRes } = await axios
      .post(
        'https://ezcloud.uniview.com/openapi/live/video/get',
        {
          deviceSerial,
          channelNo,
          protocol: 2,
          quality: 1
        },
        {
          headers: {
            Authorization: liveToken
          }
        }
      )
      .catch((e) => {
        console.error(e);
      });
    const { code, data: UrlData, msg } = liveDataRes;
    console.log('🚀 ~ checkAuth ~ UrlData:', UrlData);
    if (!UrlData) {
      localStorage.removeItem('LIVE_TOKEN');
      if (msg) ElMessage.warning(msg.toString());
      return await checkAuth(deviceSerial, channelNo, leftTimes);
    }
    const { status = -1, url } = UrlData;
    if (code === 200) {
      if (status !== 0) {
        await await axios.post(
          'https://ezcloud.uniview.com/openapi/live/video/start',
          { url },
          {
            headers: {
              Authorization: liveToken
            }
          }
        );
        await sleep(3000);
      }
      return url;
    } else {
      localStorage.removeItem('LIVE_TOKEN');
      return '';
    }
  }

  const { list } = await DeviceNvrApi.getDeviceNvrPage({ pageNo: 1, pageSize: 10 }).catch(() => {});
  let appId = '626194353357848583',
    secretKey = 'ca06cd14935e031bd7a394ee7eca154d';
  let _deviceSerial_ = '';
  if (Array.isArray(list) && list.length > 0) {
    const firstItem = list[0];
    const { deviceSerial: __deviceSerial } = firstItem;
    _deviceSerial_ = __deviceSerial;
  }
  const data = await getVideoToken();
  if (data && data !== 'error') localStorage.setItem('LIVE_TOKEN', data);
  return await checkAuth(deviceSerial, channelNo, leftTimes - 1);
};

let hls: any = null;
let playerIns: any = null;
const initPlayer = async (dtu, channelId = '') => {
  if (!dtu) return;
  const resUrl = await checkAuth(dtu, channelId);
  hls = new Hls();
  nextTick(() => {
    playerIns = new Dplayer({
      container: document.getElementById(domID),
      loop: false,
      autoplay: true,
      volume: 0,
      video: {
        url: resUrl,
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
  initPlayer(props.modelValue, props.channelNo);
});
onDeactivated(() => {
  if (playerIns) playerIns.destroy();
  if (hls) hls.destroy();
});

defineExpose({ initPlayer });
</script>
<template>
  <!-- 宇视云 -->
  <div class="w-full h-full bg-[#000] text-[#fff] flex justify-center items-center" :id="domID">
    视频加载中...
  </div>
</template>
<style scoped lang="scss"></style>
