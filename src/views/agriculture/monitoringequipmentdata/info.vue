<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import {
  getParkTree,
  getEquipmentPhotographAndVideo,
  monitoringEquNoticePage,
  getPondCountFrySum
} from './api'
import cameraIcon from './assets/camera.png'
import mask from './assets/mask.png'
import Dplayer from 'dplayer'
import Hls from "hls.js";
import axios from 'axios';
import { isFunction } from '@/utils/is'

const checkAuth = async (deviceSerial, channelNo, leftTimes = 2):Promise<string> => {
  if (leftTimes <= 0) {
    ElMessage.error("获取视频流失败，请联系管理员!");
  }
  if (!deviceSerial || !channelNo || leftTimes <= 0) return deviceSerial;
  const liveToken = localStorage.getItem("LIVE_TOKEN"), expireTime = localStorage.getItem("LIVE_EXPIRE_TIME") ?? '0';
  console.log("🚀 ~ checkAuth ~ liveToken:", liveToken)
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

let destroyFunc:Function[] = []
const destroyHls = () => {
  destroyFunc.forEach(item => {
    if (isFunction(item)) item();
  })
  destroyFunc = []
}

onActivated(() => {
  deviceVideoList.value.forEach((item:any) => {
    if (!item.dtu || !item.channelId) {
      initPlayer(item.domId, item.url);
      return;
    }
    if (item.deviceStatus === 'online') {
      initPlayer(item.domId, item.dtu, item.channelId);
    }
  })
})
onDeactivated(() => { destroyHls() })
onUnmounted(() => { destroyHls() })
const initPlayer = async (containerId, dtu, channelId = '') => {
  if (!containerId || !dtu) return;
  const resUrl = await checkAuth(dtu, channelId);
  const hls = new Hls();
  const _player = new Dplayer({
    container: document.getElementById(containerId),
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
    },
    mutex: false
  })
  destroyFunc.push(() => {
    _player.destroy();
    hls.destroy();
  });
}

const router = useRouter()
const appStore = useAppStore()
const leftParkList = ref<any[]>([])
const leftParkLoading = ref<boolean>(false)
const getLeftParkList = async () => {
  leftParkLoading.value = true;
  const res = await getParkTree().catch(() => {
    leftParkLoading.value = false;
  });
  console.log("🚀 ~ getLeftParkList ~ res:", res)
  leftParkLoading.value = false;
  if (!Array.isArray(res)) return;
  leftParkList.value = res
}
getLeftParkList()

const activeParkId = ref<string>(''), activePlotId = ref<string>('')
const handleMenuSelect = (key, keyPath) => {
  if (Array.isArray(keyPath) && keyPath.length === 2) {
    const [_baseId, _plotId] = keyPath;
    activeParkId.value = _baseId;
    activePlotId.value = _plotId;
    getDeviceVideoList(_baseId, _plotId)
  }
}
const handleMenuCheck = (key, keyPath) => {
  if (Array.isArray(keyPath) && keyPath.length === 1) {
    const [_baseId] = keyPath;
    activeParkId.value = _baseId;
    activePlotId.value = '';
    getDeviceVideoList(_baseId, undefined);
  }
}

// 右侧视频列表
// 设备列表项
interface DeviceVideoListItemType {
  deviceName: string, videoSrc: string, deviceStatus: string,
  baseName: string, online: boolean, id: string | number
}
const deviceVideoLoading = ref<boolean>(false);
const selectedItem = ref<string>('');
const handleDeviceVideoItemClick = (item) => {
  selectedItem.value = item.id
}
const deviceVideoList = ref<DeviceVideoListItemType[]>([]);
const getDeviceVideoList = async (baseId = undefined, plotId = undefined) => {
  deviceVideoLoading.value = true;
  deviceVideoList.value = []
  const res = await getEquipmentPhotographAndVideo({ baseId, plotId }).catch(() => {
    deviceVideoLoading.value = false;
  })
  console.log("🚀 ~ getDeviceVideoList ~ res:", res)
  deviceVideoLoading.value = false;
  if (!Array.isArray) return;
  deviceVideoList.value = res.map(item => ({
    ...item,
    domId: `VIDEO_${item.id ?? (item.dtu + item.channelId)}`,
    videoSrc: item?.monitoringEquipmentDataDO?.videoLink,
    baseName: item?.monitoringEquipmentDataDO?.monitoringBaseName,
  }))
  nextTick(() => {
    deviceVideoList.value.forEach(item => {
      if (item.deviceStatus === 'online') initPlayer(item.domId, item.dtu, item.channelId);
    })
  })
}
getDeviceVideoList()

// 栅格样式
const columnNum = ref<number>(3)
const handleShowTypeChange = (column = 3) => {
  columnNum.value = column
}

const adaptScreen = () => {
  const width = document.body.clientWidth;
  console.log("🚀 ~ adaptScreen ~ width:", width);
  if (width > 0 && width < 1200) columnNum.value = 2
  if (width >= 1200 && width < 2600) columnNum.value = 3
  if (width >= 2600) columnNum.value = 4
}
window.addEventListener('resize', (item) => { adaptScreen() })
</script>
<template>
  <div class="flex justify-between items-start">
    <div
      class="w-[16rem] h-[calc(100vh_-_8rem)] rounded-md overflow-hidden p-1 box-border"
      style="border: 1px solid var(--el-border-color);"
    >
      <el-scrollbar>
        <el-menu
          :active-text-color="`${appStore.getIsDark ? '#ffd04b' : '#1ed76d'}`"
          :background-color="`${appStore.getIsDark ? '#383f45' : '#fff'}`"
          class="el-menu-vertical-demo"
          :text-color="`${appStore.getIsDark ? '#fff' : '#000'}`"
          @select="handleMenuSelect"
          @open="handleMenuCheck"
          @close="handleMenuCheck"
        >
          <el-sub-menu
            v-for="item in leftParkList"
            :index="item.id"
            :key="item.id"
          >
            <template #title>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="ele in item.child"
              :index="ele.id"
              :key="ele.id"
              :style="`
                background-color:${ele.id === activePlotId ? '#07998b30' : '#00000000'};
                color: ${ele.id === activePlotId ? '#009688' : ''};
              `"
              class="w-full"
            >{{ ele.name }}</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div
      class="w-[calc(100%_-_17rem)] h-[calc(100vh_-_8rem)] p-3 box-border rounded-md"
      style="border: 1px solid var(--el-border-color);"
    >
      <div class="flex items-start justify-between h-2rem">
        <div class="font-bold">实时监控</div>
        <div class="flex space-x-2 cursor-pointer select-none text-[.8rem]">
          <div
            class="flex items-center space-x-1 px-2 py-1 rounded-1"
            @click="handleShowTypeChange(2)"
            :style="`
              background-color: ${columnNum === 2 ? '#e5f4f3' : ''};
              color: ${columnNum === 2 ? '#009688' : '#999'};
            `"
          >
            <el-icon><Menu /></el-icon>
            <div>两列</div>
          </div>
          <div
            class="flex items-center space-x-1 px-2 py-1 rounded-1"
            @click="handleShowTypeChange(3)"
            :style="`
              background-color: ${columnNum === 3 ? '#e5f4f3' : ''};
              color: ${columnNum === 3 ? '#009688' : '#999'};
            `"
          >
            <el-icon><Grid /></el-icon>
            <div>三列</div>
          </div>
          <div
            class="flex items-center space-x-1 px-2 py-1 rounded-1"
            @click="handleShowTypeChange(4)"
            :style="`
              background-color: ${columnNum === 4 ? '#e5f4f3' : ''};
              color: ${columnNum === 4 ? '#009688' : '#999'};
            `"
          >
            <el-icon><Grid /></el-icon>
            <div>四列</div>
          </div>
        </div>
      </div>
      <el-scrollbar height="calc(100% - 2rem)" v-loading="deviceVideoLoading">
        <div
          class="grid gap-3"
          :style="{ gridTemplateColumns: `repeat(${columnNum}, 1fr)` }"
        >
          <template
            v-for="item in deviceVideoList"
            :key="item.id"
          >
            <div
              class="rounded-1 p-2 box-border shadow-md transition"
              :style="`${
                selectedItem === item.id
                ? 'border: 1px solid #009688;background-color: #00968820;'
                : 'border: 1px solid #00968800;background-color: #00968810;'
              }`"
              @click="handleDeviceVideoItemClick(item)"
            >
              <div class="flex justify-between">
                <div class="flex items-center">
                  <img :src='cameraIcon' class="w-1.3rem mr-2" />
                  <div class="font-bold text-[.8rem]">{{ item.deviceName }}</div>
                </div>
                <div
                  class="flex items-center text-[#9fa3a3] text-[.8rem] space-x-0 hover:text-blue cursor-pointer transition-all"
                  @click="router.push('/internetMonitor/deviceData/monitoringequipmentdata?id=' + item.id)"
                >
                  <div>更多</div>
                  <el-icon class="scale-80"><ArrowRightBold /></el-icon>
                </div>
              </div>
              <div class="relative w-full aspect-video pt-2 box-border">
                <div class="w-full h-full bg-black block" :id="item.domId"></div>
                <!-- <video
                  class="w-full h-full bg-black block"
                  controls
                  autoplay
                  :src="item.videoSrc"
                  loop
                  v-if="item.deviceStatus === 'online'"
                ></video> -->
                <div
                  class="absolute z-20 right-1rem top-1rem bg-black p-2 py-1 flex items-center text-white space-x-[.4rem] text-[.6rem] rounded-1"
                  style="border: 1px solid #f1f1f180;"
                >
                  <div
                    class="w-[8px] h-[8px] rounded-full"
                    :style="`background-color: ${item.deviceStatus === 'online' ? '#009688' : '#fff'}`"
                  ></div>
                  <div>{{ item.deviceStatus === 'online' ? '在线' : '离线' }}</div>
                </div>
                <div
                  v-if="item.deviceStatus !== 'online'"
                  class="z-10 w-full h-100% absolute left-0 top-0 py-2 box-border"
                >
                  <img :src="mask" class="w-full h-full object-cover" />
                  <img :src="item.imgId" class="w-full h-[calc(100%_-_1rem)] object-cover opacity-30 absolute left-0 top-0.5rem" />
                </div>
              </div>
            </div>
          </template>
          <el-card
            v-if="deviceVideoList.length === 0"
            style="grid-column: 1 / -1;"
            :class="`col-span-${columnNum} h-[30vh] flex items-center justify-center`"
          >
            暂无数据
          </el-card>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>