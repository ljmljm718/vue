<template>
  <!-- <el-scrollbar height="79vh" @scroll="scroll"> -->
    <!-- 搜索栏 -->
    <ContentWrap>
      <el-form
        class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2"
        :model="queryParams"
        ref="queryFormRef"
        label-width="68px"
        :inline="true"
      >
        <!-- 表单内容 -->
        <div
          class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-2 md:col-span-3 lg:col-span-4 xl:col-span-5 2xl:col-span-6 md:border-r md:border-r-solid md:border-[#E5E5E5] md:pr-20px"
        >
          <el-form-item label="基地名称" prop="monitoringBaseName">
            <el-input v-model="queryParams.monitoringBaseName" placeholder="请选择">
              <template #append>
                <el-button @click="openParkPopup('0')">
                  <Icon icon="ep:search" />
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="地块名称" prop="monitoringPlotName">
            <el-input v-model="queryParams.monitoringPlotName" placeholder="请选择">
              <template #append>
                <el-button @click="openPlotPopup(queryParams.monitoringBaseId)">
                  <Icon icon="ep:search" />
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="queryParams.deviceName" placeholder="请选择">
              <template #append>
                <el-button @click="openSelectDeviceInfo()">
                  <Icon icon="ep:search" />
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="录入方式" prop="reserveOne">
            <el-select v-model="queryParams.reserveOne" placeholder="请选择" clearable>
              <el-option
                v-for="dict in options"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="拍摄时间" prop="reserveTwo">
            <el-date-picker
              v-model="queryParams.reserveTwo"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            />
          </el-form-item>
        </div>
        <!-- 表单按钮 -->
        <div class="flex flex-wrap justify-center content-center md:col-span-1">
          <el-form-item>
            <el-button @click="handleQuery" type="primary">
              <Icon icon="ep:search" />
              查询
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" />
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </ContentWrap>
    <!-- 数据列表 -->
    <ContentWrap>
      <!-- 第一行功能按钮 -->
      <div class="flex justify-between">
        <div class="flex flex-wrap content-center">
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agri:monitoring-equipment-data:create']"
          >
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agri:monitoring-equipment-data:export']"
          >
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
        <div class="flex flex-wrap content-center">
          <el-radio-group v-model="listType" size="small" @change="handleCardChange">
            <el-radio-button label="card" value="card">
              <el-icon><Menu /></el-icon>
              卡片
            </el-radio-button>
            <el-radio-button label="list" value="list">
              <el-icon><List /></el-icon>
              列表
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 第二行列表数据 -->
      <el-scrollbar height="70vh" class="mt-[20px]">
        <div>
          <!-- 卡片形式 -->
          <div
            v-if="list.length && currentItem && listType === 'card'"
            class="grid grid-cols-2 gap-3 text-[10px] xl:text-[14px] text-[#999999]"
            :class="{'text-[#fff]': themeIsDark}"
            v-loading="loading"
          >
            <!-- 预览区 -->
            <div class="col-span-1 rounded-md bg-[#F5F5F5] shadow-md previewContainer" :class="{'dark-card-bg shadow-[#666]': themeIsDark}">
              <div class="previewArea sticky top-0">
                <div class="relative">
                  <div class="text-center">
                    <el-image
                      lazy
                      :src="currentItem.capturedImage"
                      :preview-src-list="[currentItem.capturedImage]"
                      preview-teleported
                      fit="contain"
                      class="h-[50vh]"
                    />
                  </div>
                  <div
                    v-show="currentItem.videoLink"
                    @click="openVideo(currentItem.videoLink)"
                    class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded text-center leading-[40px] hover:cursor-pointer"
                  >
                    <el-icon color="#FFFFFF" size="16px"><VideoCamera /></el-icon>
                  </div>
                  <div
                    class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[60px] rounded text-center leading-[40px] hover:cursor-pointer"
                    @click="openForm('update', currentItem.id)"
                  >
                    <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
                  </div>
                  <div
                    class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[10px] rounded text-center leading-[40px] hover:cursor-pointer"
                    @click="handleDelete(currentItem.id)"
                  >
                    <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
                  </div>
                </div>
                <div class="grid grid-cols-2 xl:grid-cols-3 gap-1 my-10px px-3">
                  <div>
                    基地名称: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ currentItem.monitoringBaseName }}</span>
                  </div>
                  <div>
                    地块名称: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ currentItem.monitoringPlotName }}</span>
                  </div>
                  <div>
                    设备名称: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ currentItem.deviceName }}</span>
                  </div>
                  <div>
                    录入方式: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ currentItem.reserveOne }}</span>
                  </div>
                  <div>
                    备注: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ currentItem.remarks ?  currentItem.remarks : "无" }}</span>
                  </div>
                  <div>
                    拍摄时间: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ timeFormat(currentItem.reserveTwo) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 卡片列表区 -->
            <div
              class="col-span-1 grid grid-cols-2 xl:grid-cols-3 gap-3 rounded"
            >
              <div
                class="bg-[#F5F5F5] cursor-pointer shadow-md rounded-md h-[30vh]"
                :class="{'dark-card-bg shadow-[#666]': themeIsDark}"
                v-for="item in list"
                :key="item.id"
                @click="changCurrentItem(item)"
              >
                <div class="text-center">
                  <el-image
                    lazy
                    :src="item.capturedImage"
                    preview-teleported
                    fit="contain"
                    class="h-[17vh] rounded"
                  />
                </div>
                <div
                  class="text-[6px] lg:text-[10px] 2xl:text-[14px] px-[5px] mt-[5px]"
                >
                  <div>
                    设备名称: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ item.deviceName }}</span>
                  </div>
                  <div class="mt-[5px]">
                    拍摄时间: <span class="text-[#666666]" :class="{'text-[#999]': themeIsDark}">{{ timeFormat(item.reserveTwo) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="listType === 'card'" class="text-center tracking-widest">
            暂无数据
          </div>
          <!-- 列表形式 -->
          <div v-show="listType === 'list'">
            <el-table :data="list" v-loading="loading" :show-overflow-tooltip="true">
              <el-table-column align="center" prop="monitoringBaseName" label="基地名称" />
              <el-table-column align="center" prop="monitoringPlotName" label="地块名称" />
              <el-table-column align="center" prop="deviceName" label="设备名称" />
              <el-table-column align="center" prop="reserveOne" label="录入方式" />
              <el-table-column label="抓拍图片" align="center" prop="capturedImage">
                <template #default="scope">
                  <el-image
                    class="h-50px w-50px"
                    :src="scope.row.capturedImage"
                    :preview-src-list="[scope.row.capturedImage]"
                    preview-teleported
                    fit="contain"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="图片拍摄时间"
                align="center"
                prop="reserveTwo"
                :formatter="dateFormatter"
                width="180px"
              />
              <el-table-column label="备注" align="center" prop="remarks" />
              <el-table-column align="center" label="操作" fixed="right" width="280px">
                <template #default="scope">
                  <el-button
                    type="primary"
                    v-show="scope.row.videoLink"
                    @click="openVideo(scope.row.videoLink)"
                  >
                    查看视频
                  </el-button>
                  <el-button
                    @click="openForm('update', scope.row.id)"
                    v-hasPermi="['agri:monitoring-equipment-data:update']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['agri:monitoring-equipment-data:delete']"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-scrollbar>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList()"
      />
    </ContentWrap>
  <!-- </el-scrollbar> -->

  <!-- 表单弹窗：添加/修改 -->
  <MonitoringEquipmentDataForm ref="formRef" @success="getList" />
  <!-- 视频弹窗 -->
  <el-dialog v-model="isShow" width="900px" height="900px" @close="closeDialog" class="videoBox">
    <video :src="videoUrl" controls autoplay class="video" width="800px" height="800px"></video>
  </el-dialog>
  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange" />
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange" />
  <!--  选择设备-->
  <SelectDeviceInfo ref="SelectDeviceInfoRef" @success="SelectDeviceInfoSuccess" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import {
  MonitoringEquipmentDataApi,
  MonitoringEquipmentDataVO
} from '@/api/agriculture/monitoringequipmentdata'
import MonitoringEquipmentDataForm from './MonitoringEquipmentDataForm.vue'
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue'
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue'
import SelectDeviceInfo from '@/views/agriculture/deviceinfo/SelectDeviceInfoForms.vue'

/** 监控设备数据 列表 */
defineOptions({ name: 'MonitoringEquipmentData' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MonitoringEquipmentDataVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  capturedImage: undefined,
  videoLink: undefined,
  remarks: undefined,
  reserveOne: undefined,
  reserveTwo: [],
  reserveThree: undefined,
  createTime: []
})

const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const options = [
  {
    value: '人工',
    label: '人工'
  },
  {
    value: '机器',
    label: '机器'
  }
]

// openVideo
let videoUrl = ref()
let isShow = ref(false)
const openVideo = (video: any) => {
  videoUrl.value = video
  isShow.value = true
}
const closeDialog = () => {
  isShow.value = false
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MonitoringEquipmentDataApi.getMonitoringEquipmentDataPage(queryParams)
    // console.log("data", data)
    list.value = data.list
    total.value = data.total
    if ("card" === listType.value) {
      currentItem.value = list.value[0]
    }
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  if (queryParams.monitoringBaseName == null || queryParams.monitoringBaseName == '') {
    queryParams.monitoringBaseName = undefined
    queryParams.monitoringBaseId = undefined
  }
  if (queryParams.monitoringPlotName == null || queryParams.monitoringPlotName == '') {
    queryParams.monitoringPlotName = undefined
    queryParams.monitoringPlotId = undefined
  }
  if (queryParams.deviceName == null || queryParams.deviceName == '') {
    queryParams.deviceName = undefined
    queryParams.deviceId = undefined
  }
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 列表展示类型
const listType = ref('card')

// 当前查看的数据
const currentItem = ref({
  id: undefined,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  capturedImage: undefined,
  videoLink: undefined,
  remarks: null,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: null,
  createTime: undefined
})

const changCurrentItem = (item: any) => {
  currentItem.value = item
}

// 切换列表展示类型
const handleCardChange = () => {
  queryParams.pageNo = 1
  getList()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MonitoringEquipmentDataApi.deleteMonitoringEquipmentData(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await MonitoringEquipmentDataApi.exportMonitoringEquipmentData(queryParams)
    download.excel(data, '监控设备数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()

  // 获取当前是否是深色主题
  themeIsDark.value = appStore.getIsDark
})

//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup = (id: string) => {
  openType.value = id
  if (openType.value === undefined || openType.value === '') {
    message.error('请选择基地')
  } else parkPopupRef.value.open(id)
}
const handleParkPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    queryParams.monitoringBaseId = String(order[0].id)
    queryParams.monitoringBaseName = String(order[0].name)
  } else queryParams.monitoringBaseName = String(order[0].name)
}

//地块的选择
const plotPopupRef = ref()
const openType1 = ref('')
const openPlotPopup = (id: string) => {
  openType1.value = id
  if (!openType1.value) {
    message.error('请选择基地')
  } else plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log('--->>查看选择的地块信息：', order[0])
  queryParams.monitoringPlotName = String(order[0].name)
}
// 机器信息选择
const SelectDeviceInfoRef = ref()
const openSelectDeviceInfo = () => {
  SelectDeviceInfoRef.value.open('jk') //监控
}
//点击确定后
const SelectDeviceInfoSuccess = (item: any) => {
  queryParams.deviceId = item[0].id
  queryParams.deviceName = item[0].deviceName
}

// 时间戳转换成 YYYY-MM-DD HH:MM:SS
const timeFormat = (dataString: string) => {
  //dataString是整数，否则要parseInt转换
  var time = new Date(dataString)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var day = time.getDate()
  var hour = time.getHours()
  var minute = time.getMinutes()
  var second = time.getSeconds()
  return (
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (day < 10 ? '0' + day : day) +
    ' ' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minute < 10 ? '0' + minute : minute) +
    ':' +
    (second < 10 ? '0' + second : second)
  )
}

// 设置预览区始终显示在视口范围内
const scroll = ({ scrollTop }) => {
  let dom = document.querySelector(".previewArea")
  let domContainer = document.querySelector(".previewContainer")
  if (scrollTop >= dom?.offsetTop) {
    dom?.setAttribute("style", `position: fixed;width: ${ domContainer?.clientWidth }px;top: 80px;`)
  } else {
    dom?.setAttribute("style", "position: relative;width: auto;top: 0;")
  }
}

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

<style scoped lang="scss">
.dark-card-bg {
  background-color: #343A46;
}
/* 消除element部分组件的部分样式 */
.el-tabs__nav-wrap::after {
  display: none;
}
.el-form-item {
  margin-bottom: 0;
}
.el-form-item--small {
  margin-bottom: 0;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-range-editor.el-input__wrapper {
  padding: 0;
}
.el-button + .el-button {
  margin-left: 10px;
}
</style>
