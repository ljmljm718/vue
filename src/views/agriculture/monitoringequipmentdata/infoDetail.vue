<template>
  <div class="w-full">
    <el-radio-group v-model="tabVal" size="large">
      <el-radio-button
        v-for="item in tabOptions"
        :key="item.name"
        :label="item.title"
        :value="item.name"
      />
    </el-radio-group>
    <div class="w-full flex space-x-2 py-2" v-if="tabVal !== '实时拍摄'">
      <div class="flex flex-col space-y-2 grow">
        <video :src="currentVideoLink" class="w-full bg-black" autoplay muted></video>
        <div class="flex space-x-2">
          <el-button type="primary" size="default">
            回放录像<el-icon><Film /></el-icon>
          </el-button>
          <el-button type="primary" size="default">
            云平台<el-icon><Help /></el-icon>
          </el-button>
          <el-button type="primary" size="default">
            录制<el-icon><Camera /></el-icon>
          </el-button>
          <el-button type="primary" size="default">
            截图<el-icon><Crop /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="w-[270px]">
        <div v-show="tabVal === '消息事件'">
          <el-date-picker
            v-model="datePickVal"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
            style="width: 250px;"
            @change="handleDatePickerChange()"
          />
          <div class="flex flex-col space-y-2 py-2 min-h-[250px]" v-loading="msgEventLoading">
            <div
              v-for="item, index in msgEventsList"
              :key="index"
              class="flex p-2 rounded-lg justify-between"
              style="border: 1px solid #888888;"
            >
              <div class="flex flex-col justify-between">
                <div class="line-clamp-2">{{ item.noticeEvent }}</div>
                <div class="text-sm">{{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
              </div>
              <img :src="item.captured" alt="" class="w-[80px] h-[58px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full py-2" v-if="tabVal === '实时拍摄'">
      <div class="grid gap-2 lg:grid-cols-2 2xl:grid-cols-4" v-loading="runtimeLoading">
        <div
          v-for="item, index in runtimePictureList"
          :key="index"
          class="p-2 rounded-lg"
          style="border: 1px solid #888"
        >
          <div class="pb-2">{{ item.deviceName }}</div>
          <img :src="item.capturedImage" alt="" class="w-full aspect-video object-fill" />
          <div class="flex justify-between">
            <span>{{ formatTime(item.reserveTwo, 'yyyy-MM-dd') }}</span>
            <span
              class="lg:hidden 2xl:block"
            >{{ item.monitoringBaseName }}-{{ item.monitoringPlotName }}</span>
          </div>
        </div>
      </div>
      <Pagination
        :total="runtimeTotal"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getRuntimePicture"
        :pageSizes="[4, 8, 12, 16, 32]"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatTime } from '@/utils'
import {
  monitorEquipNoticePage,
  getVideoByDeviceId,
  monitorEquipDataPage
} from './api'
defineOptions({ name: 'InfoDetail' })
const route = useRoute()
const tabVal = ref("设备视频")
const tabOptions = ref<Array<any>>([
  {
    title: '设备视频',
    name: 'device_video',
  },
  {
    title: '消息事件',
    name: 'message_event',
  },
  {
    title: '实时拍摄',
    name: 'runtime_video',
  },
])

const datePickVal = ref<Array<any>>([])

const msgEventLoading = ref(false)
const msgEventsList = ref<Array<any>>([])
const getMsgEventsList = async () => {
  msgEventLoading.value = true
  const { total = 0, list = [] } = await monitorEquipNoticePage({
    recordTime: datePickVal.value.map(item => (formatTime(item, 'yyyy-MM-dd HH:mm:ss'))),
    deviceId: route.query.id
  }).catch(() => { msgEventLoading.value = false })
  msgEventLoading.value = false
  msgEventsList.value = list
  console.log("total", total);
}
getMsgEventsList()
const handleDatePickerChange = () => {
  getMsgEventsList()
}

// 获取视频
const currentVideoLink = ref<string>('')
const getVideoLink = async () => {
  const res = await getVideoByDeviceId({
    deviceId: route.query.id
  })
  currentVideoLink.value = res.videoLink
}
getVideoLink()

// 实时拍摄
const runtimeLoading = ref<boolean>(false)
const runtimeTotal = ref(0)
const runtimePictureList = ref<Array<any>>([])
const queryParams = ref({
  pageNo: 1,
  pageSize: 8
})
const getRuntimePicture = async () => {
  runtimeLoading.value = true
  const {
    list = [],
    total = 0
  } = await monitorEquipDataPage({
    ...queryParams.value
  }).catch(() => {
    runtimeLoading.value = false
  })
  runtimeLoading.value = false
  runtimePictureList.value = list
  runtimeTotal.value = total
}
getRuntimePicture()
</script>
<style scoped lang="scss">
</style>
