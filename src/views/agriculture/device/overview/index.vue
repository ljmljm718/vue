<template>
  <el-row :gutter="20">
    <el-col :span="8" class="chunk" v-for="item in list" :key="item.categoryName">
      <div class="content">
        <div class="header">
          <div class="left">
            <div class="header-icon"></div>
            <span class="header-title">{{ item.categoryName }}</span>
          </div>
          <div class="right" @click="showDetail(item)">详情></div>
        </div>
        <div class="content-bottom">
          <el-row>
            <el-col :span="15" class="left">
              <img v-if="item.imgId != null && item.imgId != ''" style="width: 100%;height: 100%;" :src="item.imgId"/>
              <img v-else style="width: 100%;height: 100%;" src="./noImag.jpg"/>
            </el-col>
            <el-col :span="9" class="right" >
              <el-row>
                <el-col :span="12" class="right-chunk">总数</el-col>
                <el-col :span="12" class="right-chunk">
                  <div class="value-backgroud color1">{{ item.total }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="right-chunk">在线</el-col>
                <el-col :span="12" class="right-chunk">
                  <div class="value-backgroud color2">{{ item.online }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="right-chunk">离线</el-col>
                <el-col :span="12" class="right-chunk">
                  <div class="value-backgroud color3">{{ item.offline }}</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="right-chunk">故障</el-col>
                <el-col :span="12" class="right-chunk">
                  <div class="value-backgroud color4">{{ item.fault }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {DeviceOverviewApi,DeviceOverviewVO} from '@/api/agriculture/device/overview'
import router from "@/router";
const deviceStatustype=ref(
  [
  "总数",
  "在线",
  "离线",
  "故障"
  ]
)

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
    list.value = data.category
  } finally {
    loading.value = false
  }
}

const showDetail = async (item) => {
  router.push('/internetMonitor/device/deviceView?deviceType=' + item.deviceType)
  // router.push('/device/deviceinfo?deviceType=14,16')
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="css">
.chunk {
  height: 265px;
  margin-bottom: 20px;
  border-radius: 15px;
  .content {
    width: calc(100% - 50px);
    height: calc(100% - 30px);
    background-color: #ffffff;
    border-radius: 20px;
    padding: 15px 25px;
    .header {
      height: 40px;
      width: calc(100% - 20px);
      background: linear-gradient(90deg, #78CEFF 0%, rgba(120, 206, 255, 0) 100%);
      border-radius: 10px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      font-family: PingFang SC;
      justify-content: space-between;
      .left {
        .header-icon {
          width: 5px;
          height: 20px;
          border-radius: 2px;
          background-color: #ffffff;
          float: left;
          margin-top: 4px;
        }
        .header-title {
          font-size: 20px;
          font-weight: bold;
          color: #333333;
          float: left;
          padding-left: 10px;
        }
      }
      .right {
        font-size: 16px;
        font-weight: normal;
        color: #000000;
        cursor: pointer;
      }
    }
    .content-bottom {
      width: 100%;
      height: 175px;
      margin-top: 20px;
      .left {
        height: 175px;
        width: calc(100% - 30px);
        border-radius: 10px;
        background-color: #DBEFFF;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .right {
        font-size: 18px;
        font-family: PingFang SC;
        .right-chunk {
          height: 44px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: right;
          padding-right: 8px;
          color: #000;
          .value-backgroud {
            height: 28px;
            width: 28px;
            border-radius: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }
          .color1 {
            background: linear-gradient(180deg, rgba(54, 134, 255, 0) 0%, #3686FF 100%);
            color: #4865DE;
          }
          .color2 {
            background: linear-gradient(180deg, rgba(15, 200, 124, 0) 0%, #0FC87C 100%);
            color: #0FC87C;
          }
          .color3 {
            background: linear-gradient(180deg, rgba(246, 187, 66, 0) 0%, #F6BB42 100%);
            color: #F6BB42;
          }
          .color4 {
            background: linear-gradient(180deg, rgba(255, 0, 0, 0) 0%, #FF0000 100%);
            color: #FF0000;
          }
        }
      }
    }
  }
}
</style>
