<template>
  <div class="flex justify-center">
    <div
      class='container grid grid-cols-3 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-20px bg-[#f5f5f5]'
      :class="{'dark-bg': themeIsDark}"
    >
      <div class="box-border w-100% px-[20px] py-[15px] bg-[#fff] rounded" v-for="item in list" :key="item.categoryName" :class="{'dark-card-bg': themeIsDark}">
        <div class="flex justify-between">
          <div style="font-weight:600">{{item.categoryName}}</div>
          <div class="color-[#4db5ab] text-sm" style="cursor: pointer;" @click="showDetail(item)">详情 
            <img src='./right.png' class='w-8px h-10px' />
          </div>
        </div>
        <div class="flex justify-between items-center mt-15px">
          <img :src="item.imgId" class="w-48% h-180px object-cover"/>
          <div class="w-48%">
            <div class="totalBg flex justify-around items-center w-100% h-40px" :class="{'no-bg': themeIsDark}">
              <div class='flex items-center'>
                <div class="w-3px h-15px bg-[#009688] mr-10px"></div>
                <div>总数</div>
              </div>
              <div class="text-lg color-[#009688]" style="font-weight:600">{{item.total}}</div>
            </div>
            
            <div class=" flex bg-[#f5f5f5] my-10px justify-around items-center w-100% h-40px" :class="{'no-bg': themeIsDark}">
              <div class='flex items-center'>
                <div class="icon-1 mr-10px"></div>
                <div>在线</div>
              </div>
              <div class=" color-[#0dc59e]" >{{item.online}}</div>
            </div>

            <div class=" flex justify-around items-center bg-[#f5f5f5] w-100% h-40px" :class="{'no-bg': themeIsDark}">
              <div class='flex items-center'>
                <div class="icon-2 mr-10px "></div>
                <div style="font-weight: 500;">离线</div>
              </div>
              <div class=" color-[#fba83d]" >{{item.offline}}</div>
            </div>

            <div class=" flex justify-around bg-[#f5f5f5] mt-10px items-center w-100% h-40px" :class="{'no-bg': themeIsDark}">
              <div class='flex items-center'>
                <div class="icon-3 mr-10px"></div>
                <div>故障</div>
              </div>
              <div class=" color-[#e31d10]" >{{item.fault}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {DeviceOverviewApi,DeviceOverviewVO} from '@/api/agriculture/device/overview'
import { useRouter} from "vue-router";
const router=useRouter()
/** 设备总览 */
defineOptions({ name: 'DeviceOverview' })

//const message = useMessage() // 消息弹窗
//const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DeviceOverviewVO[]>([]) // 列表的数据
// const queryParams = reactive({
//   parkId: undefined,
// })
// const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceOverviewApi.getDeviceOverview()
    console.log(data.category,'data.categorydata.category')
    list.value = data.category
  } finally {
    loading.value = false
  }
}
//详情
const showDetail = async (item) => {
  console.log(item,'itemitem')
  router.push('/internetMonitor/device/deviceView?deviceType=' + item.deviceType)
  // router.push('/device/deviceinfo?deviceType=14,16')
}

/** 初始化 **/
onMounted(() => {
  getList()

  // 获取当前是否是深色主题
  themeIsDark.value = appStore.getIsDark
})

/** 
 * fix 深色模式文字显示不清晰问题 
 * 系统切换深色模式时切换容器和卡片的背景色
 * 并且去掉各项数据的背景色和背景图片
 */
import { useAppStore } from '@/store/modules/app'
import { watch } from "vue"

const appStore = useAppStore()
const themeIsDark = ref(false)

// 监听主题模式变化
watch(() => appStore.isDark, (newVal, oldVal) => {
  console.log("isDark", newVal, oldVal)
  themeIsDark.value = newVal
})

</script>
<style lang="scss" scoped>
.totalBg{
  background-size:100% 100%;
  background-image: url(./total-bg.png);
}

.icon-1 {
  background-image: url(./icon-1.png);
  background-size: 100% 100%;
  width: 30px;
  height: 30px;

}
.icon-2 {
  background-image: url(./icon-2.png);
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}
.icon-3 {
  background-image: url(./icon-3.png);
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

/** fix 深色模式文字显示不清晰问题 */
.dark-bg {
  background-color: #141414;
}
.dark-card-bg {
  background-color: #343A46;
}
.no-bg {
  background: none;
}
</style>
