<template>
  <div class="w-full h-full flex justify-between main-bg">
    <div class="w-23% h-100%">
      <div class="device-title w-100% h-45px"></div>
      <div class="w-100% flex mt-20px mb-20px justify-between">
        <div class="w-48% h-80px online-bg">
          <div class="ml-110px">
            <div class="color-[#8effd0] text-30px">{{ deviceObj.online }}</div>
            <div class="color-[#fff] text-15px mt-2px">在线设备</div>
          </div>
        </div>
        <div class="w-48% h-80px offline-bg">
          <div class="ml-110px">
            <div class="color-[#ffd37d] text-30px">{{ deviceObj.offline }}</div>
            <div class="color-[#fff] text-15px mt-2px">离线设备</div>
          </div>
        </div>
      </div>
      <div class="device-tree relative flex w-100% justify-end" style="height: calc(100% - 165px)">
        <div class="tree-icon absolute top-15px left-15px"></div>
        <el-tree
          ref="treeRef"
          style="width: 94%; height: 100%"
          :data="categoryTree"
          :props="defaultProps"
          default-expand-all
          highlight-current
          node-key="id"
          :expand-on-click-node="false"
          @current-change="handleCurrentCategoryChange"
        />
      </div>
    </div>
    <div class="w-75% p-15px box-border flex flex-wrap h-100% device-main overflow-auto ">
      <div
        class="w-23% h-200px m-10px flex justify-center items-center px-10px py-10px box-border main-item"
        v-for="(item, index) in videoList"
        :key="index"
      >
        <div class="w-100% h-100% relative border-2px border-solid border-[#2c473d]">
          <div class="w-100% h-100%" :id="item.domId"></div>
          <!-- <video
            :controls="true"
            :autoplay="true"
            muted
            :src="item.url"
            class="w-100% h-100%"
          ></video> -->
          <div
            class="absolute flex box-border px-[10px] justify-between items-center left-0 top-0 w-100% h-35px main-item-top"
          >
            <div class="color-[#c1c9c6] text-14px"
              >{{ item?.monitoringEquipmentDataDO?.monitoringPlotName }}-{{ item.deviceName }}</div
            >
            <div v-if="item.deviceStatus == 'online'" class="color-[green] flex items-center">
              <div class="online w-10px h-10px"></div>
              <div class="text-14px ml-7px">在线</div>
            </div>
            <div v-if="item.deviceStatus == 'offline'" class="color-[green] flex items-center">
              <div class="offline w-10px h-10px"></div>
              <div class="text-14px ml-7px">离线</div>
            </div>
            <div v-if="item.deviceStatus == 'fault'" class="color-[green] flex items-center">
              <div class="fault w-10px h-10px"></div>
              <div class="text-14px ml-7px">故障</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { qjDeviceStatistics, ParkTree, EquipmentPhotographAndVideo } from './monitorApi'
import Dplayer from 'dplayer'
import Hls from 'hls.js'
import axios from 'axios'
import { isFunction } from '@/utils/is'
import { DeviceNvrApi } from '@/api/agriculture/devicenvr/index'

const sleep = (delaytime = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delaytime))
}

const checkAuth = async (deviceSerial, channelNo, leftTimes = 2): Promise<string> => {
  if (leftTimes <= 0) {
    ElMessage.error('获取视频流失败，请联系管理员!')
  }
  if (!deviceSerial || !channelNo || leftTimes <= 0) return deviceSerial
  const liveToken = localStorage.getItem('LIVE_TOKEN'),
    expireTime = localStorage.getItem('LIVE_EXPIRE_TIME') ?? '0'
  console.log('🚀 ~ checkAuth ~ liveToken:', liveToken)
  const isExpired = (parseInt(expireTime) ?? 0) - new Date().valueOf() < 0
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
    const { accessToken, expireTime } = data.data
    if (accessToken) localStorage.setItem('LIVE_TOKEN', accessToken)
    if (expireTime) localStorage.setItem('LIVE_EXPIRE_TIME', expireTime + '000')
  }
  return await checkAuth(deviceSerial, channelNo, leftTimes - 1)
}

let destroyFunc: Function[] = []
const destroyHls = () => {
  destroyFunc.forEach((item) => {
    if (isFunction(item)) item()
  })
  destroyFunc = []
}
const categoryTree = ref<Array<any>>([])
const handleCurrentCategoryChange = (currNodeData:any) => {
  console.log('🚀 ~ handleCurrentCategoryChange ~ currNodeData:', currNodeData)
  if(!currNodeData.parkId)getEquipmentPhotographAndVideo( currNodeData.id,'')
  else getEquipmentPhotographAndVideo(currNodeData.parkId, currNodeData.id)
}
//在线离线
const deviceObj = ref<Object>({})
const getQjDeviceStatistics = async () => {
  let res = await qjDeviceStatistics()
  console.log(res, '在线离线')
  deviceObj.value = res
}
getQjDeviceStatistics()

//基地树
const defaultProps = {
  children: 'child',
  label: 'name'
}
const getParkTree = async () => {
  let res = await ParkTree()
  console.log('🚀 ~ getParkTree ~ res基地树:', res)
  categoryTree.value = res
  getEquipmentPhotographAndVideo()
}
getParkTree()
//获取视频
const videoList = ref<Array<any>>([])
const getEquipmentPhotographAndVideo = async (baseId = '', plotId = '') => {
  let res = await EquipmentPhotographAndVideo({ baseId: baseId, plotId: plotId })
  console.log('🚀 ~ getEquipmentPhotographAndVideo ~ res获取视频:', res)
  videoList.value = res.map((item: any) => ({
    ...item,
    domId: `VIDEO_${item.id ?? item.dtu + item.channelId}`,
    videoSrc: item?.monitoringEquipmentDataDO?.videoLink,
    baseName: item?.monitoringEquipmentDataDO?.monitoringBaseName
  }))
  nextTick(() => {
    videoList.value.forEach((item: any) => {
      if (!item.dtu || !item.channelId) {
        initPlayer(item.domId, item.url)
      } else {
        initPlayer(item.domId, item.dtu, item.channelId)
      }
    })
  })
}
onActivated(() => {
  videoList.value.forEach((item: any) => {
    if (!item.dtu || !item.channelId) {
      initPlayer(item.domId, item.url)
    } else {
      initPlayer(item.domId, item.dtu, item.channelId)
    }
  })
})

onMounted(() => {})
onDeactivated(() => {
  destroyHls()
})
onUnmounted(() => {
  destroyHls()
})
const initPlayer = async (containerId, dtu, channelId = '') => {
  if (!containerId || !dtu) return
  const resUrl = await checkAuth(dtu, channelId)
  const hls = new Hls()
  const _player = new Dplayer({
    container: document.getElementById(containerId),
    loop: false,
    autoplay: true,
    volume: 0,
    video: {
      url: resUrl,
      type: 'customHls',
      customType: {
        customHls: (video) => {
          hls.loadSource(video.src)
          hls.attachMedia(video)
        }
      }
    },
    mutex: false
  })
  destroyFunc.push(() => {
    _player.destroy()
    hls.destroy()
  })
}

const handleActive = () => {}
defineExpose({ handleActive })
</script>
<style scoped lang="scss">
@for $i from 1 through 3 {
  .agri-bg-#{$i} {
    background-image: url(./assets/agriBg#{$i}.png);
    background-size: 100% 100%;
  }
}
.main-item {
  background-size: 100% 100%;
  background-image: url(./assets/main-item.png);
}
.device-title {
  background-image: url(./assets/device-title.png);
  background-size: 100% 100%;
}
.online-bg {
  background-image: url(./assets/online-bg.png);
  background-size: 100% 100%;
}
.offline-bg {
  background-image: url(./assets/offline-bg.png);
  background-size: 100% 100%;
}
.device-tree {
  overflow-y: scroll;
  background-image: url(./assets/device-tree.png);
  background-size: 100% 100%;
}
.device-tree::-webkit-scrollbar {
  width: 0;
}
.device-main {
  background-image: url(./assets/device-main.png);
  background-size: 100% 100%;
}
.device-main::-webkit-scrollbar{
  width: 0;
}
.online {
  background-image: url(./assets/online.png);
  background-size: 100% 100%;
}
.offline {
  background-image: url(./assets/offline.png);
  background-size: 100% 100%;
}
.fault {
  background-image: url(./assets/fault.png);
  background-size: 100% 100%;
}
.el-tree {
  background-color: transparent !important;
  color: #fff;
}
.tree-icon {
  background-size: 100% 100%;
  background-image: url(./assets/tree-icon.png);
  width: 15px;
  height: 15px;
}
.main-bg {
  background-size: 100% 100%;
  background-image: url(./assets/moitor-main-bg.png);
}
.main-item-top {
  background-size: 100% 100%;
  background-image: url(./assets/main-device-top.png);
}
// element-plus中tree时修改选中当前的样式
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-image: url(./assets/tree-act.png) !important;
  height: 35px;
  line-height: 35px;
  background-color: transparent;
  background-size: 100% 100% !important;
  color: #01f892;
}
//取消tree的鼠标滑过
::v-deep .el-tree-node__content:hover {
  background-color: transparent;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: transparent;
}
::v-deep .el-table tbody tr {
  pointer-events: none;
}
//修改未选中的元素
::v-deep .el-tree .el-tree-node__content:not(.is-current) {
  background-image: url(./assets/tree-acd.png); /* 你想要的未选中背景颜色 */
  background-size: 100% 100%;
  height: 35px;
  line-height: 35px;
  margin: 5px;
}
</style>
