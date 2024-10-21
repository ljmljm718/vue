<script setup lang="ts">
import { getParkTree, getEquipmentPhotographAndVideo } from './api'
import Dplayer from 'dplayer'
import Hls from 'hls.js'
import axios from 'axios'

const defaultProps = { children: 'child', label: 'name' }
const categoryTree = ref<Array<any>>([])
const getCategoryTree = async () => {
  const res = await getParkTree()
  if (!Array.isArray(res)) return;
  categoryTree.value = res;
  if (res.length > 0) {
    const item = res[0]; // 取出树中第一个元素
  }
}
const handleCurrentCategoryChange = (item) => {
  console.log("🚀 ~ handleCurrentCategoryChange ~ item:", item)
}

const videoList = ref<Array<any>>([]);
const getEquipmentPhotographAndVideoData = async (baseId: any, plotId: any) => {
  const res = await getEquipmentPhotographAndVideo({ baseId: baseId, plotId: plotId })
  console.log('🚀 ~ getEquipmentPhotographAndVideoData ~ res获取视频:', res)
  if (!Array.isArray(res)) return;
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
let destroyFunc: Function[] = []
const destroyHls = () => {
  destroyFunc.forEach((item) => {
    if (isFunction(item)) item()
  })
  destroyFunc = []
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
onDeactivated(() => { destroyHls() })
onUnmounted(() => { destroyHls() })

const checkAuth = async (deviceSerial, channelNo, leftTimes = 2): Promise<string> => {
  if (leftTimes <= 0) ElMessage.error('获取视频流失败，请联系管理员!')
  if (!deviceSerial || !channelNo || leftTimes <= 0) return deviceSerial
  const liveToken = localStorage.getItem('LIVE_TOKEN')
  const expireTime = localStorage.getItem('LIVE_EXPIRE_TIME') ?? '0'
  const isExpired = (parseInt(expireTime) ?? 0) - new Date().valueOf() < 0

  if (liveToken && !isExpired) {
    // 获取视频流
    const { data: liveDataRes } = await axios.post(
      'https://ezcloud.uniview.com/openapi/live/video/device/url/get',
      { deviceSerial, channelNo },
      { headers: { Authorization: liveToken } }
    )
    const { code, data: liveData } = liveDataRes
    if (code === 200) {
      const { liveUrlList } = liveData
      if (Array.isArray(liveUrlList) && liveUrlList.length > 0) {
        return liveUrlList[0].url
      } else return ''
    } else return ''
  }

  const { data } = await axios.post('https://ezcloud.uniview.com/openapi/user/app/token/get', {
    appId: '626194353357848583',
    secretKey: 'ca06cd14935e031bd7a394ee7eca154d'
  })
  if (data && data?.code === 200) {
    const { accessToken, expireTime } = data.data
    if (accessToken) localStorage.setItem('LIVE_TOKEN', accessToken)
    if (expireTime) localStorage.setItem('LIVE_EXPIRE_TIME', expireTime + '000')
  }
  return await checkAuth(deviceSerial, channelNo, leftTimes - 1)
}

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

// tab页切换到此页面时触发
const handleActive = () => {}
defineExpose({ handleActive })
</script>
<template>
  <div class="h-full flex justify-between monitor-bg">
    <div class="w-414px h-full">
      <!-- 设备一览 -->
      <div class="agri-title-bg title-frame">
        <div class="linear-title-text art-font">设备一览</div>
      </div>
      <div class="h-122px flex ml-12px w-402px">
        <div class="w-full h-full flex justify-between items-center">
          <div class="device-item-1 w-190px h-65px">
            <div class="ml-[95px]">
              <div class="art-font text-32px linear-title-text">13</div>
              <div class="relative top-[-7px] text-16px">在线设备</div>
            </div>
          </div>
          <div class="device-item-2 w-190px h-65px">
            <div class="ml-[95px]">
              <div class="art-font text-32px linear-title-text">4</div>
              <div class="relative top-[-7px] text-16px">离线设备</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="ml-12px w-402px h-795px bg-#2A433860 rounded-1"
        style="border: 1px solid #2A4338;"
      >
        <el-scrollbar class="w-full h-full">
          <div class="flex space-x-3 p-4 box-border">
            <div class="tree-icon"></div>
            <el-tree
              ref="treeRef"
              :data="categoryTree"
              :props="defaultProps"
              default-expand-all
              highlight-current
              node-key="id"
              class="w-340px min-h-200px"
              :expand-on-click-node="false"
              @current-change="handleCurrentCategoryChange"
            />
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="w-1445px h-full monitor-rect grid grid-rows-4 grid-cols-4 gap-15px">
      <div
        class="
          w-100% h-100% flex justify-center
          items-center px-10px py-10px box-border main-item
        "
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
<style scoped lang="scss">
.title-frame {
  display: flex;
  height: 36px;
  padding: 0 36px;
  align-items: center;
  font-size: 18px;
}

.agri-title-bg {
  background-image: url(./assets/agriItemTitleBg.png);
  background-size: 100% 100%;
}

.monitor-bg {
  background-image: url(./assets/monitorBg.png);
  background-size: 100% 100%;
}

.monitor-rect {
  background-image: url(./assets/monitorRect.png);
  background-size: 100% 100%;
}

.device-item-1 {
  background-image: url(./assets/deviceItem1.png);
  background-size: 100% 100%;
  .linear-title-text {
    background: linear-gradient(to top, #08FF98, #FFFFFF); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
    -webkit-background-clip: text;/*将设置的背景颜色限制在文字中*/
    -webkit-text-fill-color: transparent;/*给文字设置成透明*/
  }
}

.device-item-2 {
  background-image: url(./assets/deviceItem2.png);
  background-size: 100% 100%;
  .linear-title-text {
    background: linear-gradient(to top, #FFAA00, #FFFFFF); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
    -webkit-background-clip: text;/*将设置的背景颜色限制在文字中*/
    -webkit-text-fill-color: transparent;/*给文字设置成透明*/
  }
}

.tree-icon {
  background-image: url(./assets/tree-icon.png);
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 1rem;
  height: 1rem;
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