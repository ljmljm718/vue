<template>
  <div ref="containerDom">

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-row>
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input
            v-model="queryParams.deviceCode"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter="handleQuery()"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="设备点位" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备点位"
            clearable
            @keyup.enter="handleQuery()"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-cascader
            class="!w-240px"
            v-model="deviceType"
            :options="categoryOptions"
            :props="categoryProps"
          />
        </el-form-item>
        <el-form-item label="监测类型" prop="deviceMonitorType">
          <el-input
            v-model="queryParams.deviceMonitorType"
            placeholder="请输入监测类型"
            clearable
            @keyup.enter="handleQuery()"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="状态" prop="deviceStatus">
          <el-select
            v-model="queryParams.deviceStatus"
            placeholder="请选择状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict, index in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
              :key="index"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="handleQuery()"
            class="!color-[#fff] !bg-[#009688]"
          >
            <Icon icon="ep:search" class="mr-5px" />
            <span>搜索</span>
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />
            <span>重置</span>
          </el-button>
        </el-form-item>
      </el-row>

    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class='flex justify-between mb-15px'>
      <div class='flex space-x-2'>
        <el-button
          type="primary"
          plain
          :icon="Plus"
          class="!color-[#fff] !bg-[#009688]"
          @click="openAddForm()"
          v-hasPermi="['agriculture:device-info:create']"
          v-if="!readonly"
        >新增</el-button>
        <div v-if='cardList'>
          <el-button
            type="success"
            plain
            class="!color-[#fff] !bg-[#3ba272]"
            @click="handleExport()"
            :icon="Download"
            :loading="exportLoading"
            v-hasPermi="['agriculture:device-info:export']"
            v-if="!readonly"
          >导出</el-button>
          <el-button
            plain
            type="success"
            :icon="Edit"
            class="!color-[#fff] !bg-[#fac858]"
            @click="openEditForm(null)"
            v-hasPermi="['agriculture:device-info:update']"
            :disabled="single"
          >编辑</el-button>
          <el-button
            plain
            type="primary"
            :icon="View"
            class="!color-[#fff] !bg-[#73c0de]"
            @click="openFormDetail()"
            :disabled="single"
          >查看</el-button>
          <el-button
            plain
            type="danger"
            :icon="Delete"
            @click="handleDelete(null)"
            class="!color-[#fff] !bg-[#ee6666]"
            v-hasPermi="['agriculture:device-info:delete']"
            :disabled="single"
          >删除</el-button>

          <el-button
            type="warning"
            plain
            @click="openSubDeviceForm()"
            :icon="Tools"
            class="!color-[#fff] !bg-[#59b756]"
            v-hasPermi="['agriculture:sub-device:create']"
            v-if="!readonly"
            :disabled="single"
          >调试配置</el-button>
          <el-button
            plain
            type="primary"
            :icon="Refresh"
            class="!color-[#fff] !bg-[#73c0de]"
            :loading="refreshLoading"
            @click="refreshStatus()"
          >刷新</el-button>
        </div>
      </div>
      <div class="flex items-center cursor-pointer ml-[1.5rem]">
        <div
          :class="[!cardList ? 'tab-btn-selected' : 'tab-btn']"
          @click="tabCard()"
        >
          <el-icon>
            <Menu />
          </el-icon>
          <div class="pl-1 text-[13px]">卡片</div>
        </div>
        <div
          :class="[cardList ? 'tab-btn-selected2' : 'tab-btn2']"
          @click="listCard()"
        >
          <el-icon>
            <List />
          </el-icon>
          <div class="pl-1 text-[13px]">列表</div>
        </div>
      </div>
      <div class="flex !hidden">
        <div
          @click="tabCard()"
          class="py-3px px-15px cursor-pointer rounded-l"
          :style="`background-color: ${cardList ? '' : '#e5f4f3'}; border:1.5px solid ${cardList ? '#e6e6e6' : '#36a99e'}; color:${cardList ? '' : '#36a99e'}`"
        >
          <img :src="cardList ? card2 : card" class="w-10px h-10px" alt="" />
          <span>卡片</span>
        </div>
        <div
          @click="listCard()"
          class="py-3px cursor-pointer px-15px rounded-r"
          :style="`border:1.5px solid ${cardList ? '#36a99e' : '#e6e6e6'};background-color: ${cardList ? '#e5f4f3' : ''}; color:${cardList ? '#36a99e' : ''}`"
        >
          <img :src="cardList ? listImg : listImg2" class="w-10px h-10px" alt="" />
          <span>列表</span>
        </div>
      </div>
    </div>
    <div
      v-if="!cardList"
      v-loading="loading"
      class="grid 2xl:grid-cols-3 xl:grid-cols-2 gap-15px"
    >
      <div
        class="
          box-border pl-[25px] flex
          w-100% h-220px justify-between
          overflow-hidden items-center
          rounded-10px border-2px
          border-solid border-[#ededed]
        "
        v-for='item, index in list'
        :key='index'
      >
        <div>
          <div
            class="text-18px mb-15px color-[#000] flex items-center flex-wrap space-y-[8px] space-x-[5px]"
          >
            <div>{{ item.deviceName }}</div>
            <div
              class="
                bg-[#e8f9e9] text-[14px] w-[83px]
                flex items-center px-10px py-[5px]
                rounded-25px box-border color-[#27c05a]
              "
              v-show='item.deviceStatus == "online"'
            >
              <div class='icon-1 mr-5px'></div>
              <div>在线</div>
            </div>
            <div
              class="
                bg-[#f5f5f5] text-[14px]
                flex items-center px-10px ml-5px
                py-3px rounded-25px box-border color-[#9c9c9c]
              "
              v-show='item.deviceStatus == "offline"'
            >
              <div class='icon-2'></div>
              <div>离线</div>
            </div>
            <div
              class="bg-[#faeceb] text-[14px] flex items-center px-10px ml-5px py-3px rounded-25px box-border color-[#e31205]"
              v-show='item.deviceStatus == "dault"'>
              <div class='icon-3'></div> 故障
            </div>
          </div>
          <div class="text-14px color-[#707070]">经度：{{ item.longitude }}</div>
          <div class="text-14px color-[#707070] my-3px">纬度：{{ item.latitude }}</div>
          <div v-if="item.channelId" class="text-14px color-[#707070]">通道号：{{ item.channelId }}</div>
          <div class="mt-10px flex items-start justify-start space-x-[5px] pr-[5px]">
            <el-button
              v-if="deviceTypeMain.includes(item.deviceType[0])"
              plain
              type="success"
              class="
                !color-[#fff] !border-none
                !bg-[#59b756] !px-16px !py-13px
              "
              @click="router.push({
                path: '/internetMonitor/deviceData/equipment-data-three',
                query: { equipmentCode: item.id }
              })"
            >查看数据</el-button>

            <el-button
              v-if="item.deviceStatus == 'online' && item.url != null && item.url.indexOf('mp4') > 0"
              plain
              type="success"
              class='!color-[#fff] !border-none !bg-[#59b756] !px-25px !py-13px'
              @click="openExternalLink(item)"
            >查看监控</el-button>

            <el-button
              plain
              type="warning"
              class='!color-[#fff] !bg-[#fac858] !border-none !px-25px !py-13px'
              @click="openEditForm(item.id)"
              v-hasPermi="['agriculture:device-info:update']"
            >编辑</el-button>

            <el-button
              plain
              type="danger"
              class='!color-[#fff] !bg-[#ee6666] !px-25px !py-13px'
              @click="handleDelete(item.id)"
              v-hasPermi="['agriculture:device-info:delete']"
            >删除</el-button>
          </div>
        </div>
        <div class="w-150px h-100%">
          <el-image class="h-100% w-100%" lazy :src="item.imgId" :preview-src-list="[item.imgId]" preview-teleported
            fit="cover" />
        </div>
      </div>
    </div>
    <el-table
      v-if="cardList"
      ref="deviceInfoTableRef"
      v-loading="loading"
      :data="list"
      :row-key="(row) => row.id"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
      height='900px'
    >
      <el-table-column type="selection" width="55" :reserve-selection="true" />
      <!-- 子设备的列表 -->
      <!--      <el-table-column type="expand">
                      <template #default="scope">
                        <el-tabs model-value="deviceDetail">
                          <el-tab-pane label="子设备" name="deviceDetail">
                            <SubDeviceList :device-id="scope.row.id"/>
                    </el-tab-pane>
                  </el-tabs>
                </template>
  </el-table-column>-->
      <el-table-column label="设备编号" align="center" prop="deviceCode" width="200" />
      <el-table-column label="设备点位" align="center" prop="deviceName" width="150" />
      <el-table-column label="设备类型" align="center" prop="deviceType" width="200" :show-overflow-tooltip="false">
        <template #default="scope">
          <el-cascader style="width: 100%" v-model="scope.row.deviceType" :options="categoryOptions"
            :props="categoryProps" disabled />
        </template>
      </el-table-column>
      <el-table-column label="设备监测类型" align="center" prop="deviceMonitorType" width="150" />
      <el-table-column label="通道号" align="center" prop="channelId" />
      <el-table-column label="开关" align="center" width="80" v-if="!readonly">
        <template #default="scope">
          <el-switch v-model="scope.row.deviceStatus" active-value="online" inactive-value="offline"
            @change="handleStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus" />
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="imgId">
        <template #default="{ row }">
          <el-image class="h-50px w-50px" lazy :src="row.imgId" :preview-src-list="[row.imgId]" preview-teleported
            fit="cover" />
        </template>
      </el-table-column>
      <!--      <el-table-column label="所属基地" align="center" prop="belongPark" width="200"/>
              <el-table-column label="所属地块" align="center" prop="belongPlot" width="200"/>-->
      <el-table-column label="位置" align="center" prop="location" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
      <el-table-column label="操作" align="center" width="250" fixed="right" v-if="!readonly">
        <template #default="scope">
          <el-button link type="primary" v-if="deviceTypeMain.includes(scope.row.deviceType[0])"
            @click="handleData(scope.row)">采集数据
          </el-button>
          <el-button link type="primary"
            v-if="scope.row.deviceStatus == 'online' && scope.row.url != null && scope.row.url.indexOf('mp4') > 0"
            @click="openExternalLink(scope.row)">查看监控
          </el-button>
          <el-button
            link
            type="primary"
            v-if="deviceTypeMain.includes(scope.row.deviceType[0])"
            @click="router.push({
              path: '/internetMonitor/deviceData/equipment-data-three',
              query: { equipmentCode: scope.row.id }
            })"
          >查看数据</el-button>
          <el-button
            link
            type="primary"
            v-if="mingYueDeviceTypeMain.includes(scope.row.deviceType[0])"
            @click="router.push({
              path: '/internetMonitor/interface/equipment-data-rule',
              query: { dtuId: scope.row.deviceCode }
            })"
          >安装配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList()"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <DeviceInfoForm ref="formRef" @success="getList()" />
  <SubDeviceListForm ref="subDeviceFormRef" @success="getList()" />
  </div>
</template>

<script setup lang="ts">
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { DeviceInfoApi, DeviceInfoVO } from '@/api/agriculture/deviceinfo'
import DeviceInfoForm from './DeviceInfoForm.vue'
import { DeviceCategoryApi } from "@/api/agriculture/devicecategory";
import { retainFirstTwoLayers } from "@/utils/tree";
import { useRoute } from 'vue-router'
import { EquipmentDataApi } from "@/api/agriculture/equipmentdata";
import SubDeviceListForm from "@/views/agriculture/deviceinfo/components/SubDeviceListForm.vue";
import card from '../../../assets/imgs/card-active.png'
import card2 from '../../../assets/imgs/card-actived.png'
import listImg from '../../../assets/imgs/list-active.png'
import listImg2 from '../../../assets/imgs/list-actived.png'
import {
  Plus, Download, Edit, View,
  Delete, Tools, Refresh
} from '@element-plus/icons-vue'

/** 设备信息 列表 */
defineOptions({ name: 'DeviceView' })

const router = useRouter()

/**
 * 需要跳转的设备类型，一级分类为监测设备的
 * 14 - 武隆
 * 25 - 酉阳
 * 39 - 隘口
 * 46 - 白帝
 * 80 - 明月
 * 90 - 黔江县中元村
 * 100 - 塘坝镇天印村
 * 111 - 酉阳县板桥乡双桥村
 * 120 - 万州区龙驹镇梧桐村
 * 149 - 茶竹
 * 156 - 望岩村
 */
const deviceTypeMain = ref([14, 25, 39, 59, 46, 76, 80, 90, 100, 111, 120, 131, 133, 143, 149,156])
const mingYueDeviceTypeMain = ref([80])
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const cardList = ref(false)
const loading = ref(true) // 列表的加载中
const refreshLoading = ref(false)  //刷新按钮的加载中
const list = ref<DeviceInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 12,
  deviceCode: undefined,
  deviceName: undefined,
  deviceType: undefined,
  deviceTypes: undefined,
  longitude: undefined,
  latitude: undefined,
  deviceStatus: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined,
  location: undefined,
  deviceMonitorType: undefined,
  deviceKind: undefined,
  status: undefined,
  channelId: undefined,
  dtu: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
let categoryOptions = ref([])// 设备分类选项
const deviceType = ref()
const single = ref(true)  // 非单个禁用
const deviceId = ref() // 选中的设备id
const deviceName = ref() // 选中的设备名称
const router1 = useRouter()
const openExternalLink = (item) => {
  console.log("🚀 ~ openExternalLink ~ item:", item)
  const { url, dtu, channelId } = item;
  //router.push(`/checkVideo?dtu=${dtu}&channelId=${channelId}&url=${url}`);
  router1.push(`/checkVideo?dtu=${dtu}&channelId=${channelId}&url=${url}`);
  // const url = scope.row.url // 替换为你想要跳转的外部链接
  // console.log("url",url)
  // window.open(url, '_blank'); // 使用'_blank'来确保在新窗口打开
}
/** 查询列表 */
const enableSwitch = ref<boolean>(false)
  const containerDom = ref()

const getList = async () => {
  loading.value = true
  enableSwitch.value = false
  try {
    if (route.query.deviceStatus) {
      let aa = route.query.deviceStatus;
      queryParams.deviceStatus = aa;
    }
    const data = await DeviceInfoApi.getDeviceInfoPage(queryParams)
    list.value = data.list.map((item: any) => {
      item.deviceType = item.deviceType.split(',').map(Number)
      return item;
    })
    console.log("list.value123", list.value)
    total.value = data.total
    setTimeout(() => {
      handleSelectedDeviceIds()
    })
    emit("heightChange", containerDom.value.clientHeight);

  } finally {
    loading.value = false
    nextTick(() => {
      enableSwitch.value = true
    })
  }
}

// 选中已经绑定的设备id
const deviceInfoTableRef = ref()
const handleSelectedDeviceIds = () => {
  multipleSelection.value = list.value.filter(item => props.initDeviceInfoIdList.includes(item.id))
  if (multipleSelection.value.length > 0) {
    multipleSelection.value.forEach((row) => {
      deviceInfoTableRef.value!.toggleRowSelection(row, true);
    })
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  if (deviceType.value != null && deviceType.value != undefined) {
    queryParams.deviceType = deviceType.value.join(",")
  }
  console.log(deviceType.value);
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  deviceType.value = null
  //route.query.deviceType = null
  queryParams.deviceType = null
  queryParams.belongPark = undefined
  queryParams.belongPlot = undefined
  emit('reset'); // 清空基地树的选中节点
  const currentPath = router.currentRoute.value.path;
  router.replace({ path: currentPath, query: {} });
  handleQuery()
}
//卡片切换
const tabCard = () => {
  cardList.value = false
  queryParams.pageSize = 12
  getList()

}
const listCard = () => {
  cardList.value = true
  queryParams.pageSize = 10
  getList()

}

const formRef = ref()
/** 添加操作 */
const openAddForm = () => {
  router.push(`/internetMonitor/device/deviceView/create`)
}
/** 修改操作 */
const openEditForm = (val) => {
  const id = val ? val : deviceId.value.toString()
  router.push(`/internetMonitor/device/deviceView/create?id=${id}`)
}

/** 删除按钮操作 */
const handleDelete = async (val) => {
  try {
    console.log(val, 'valvalvalval')
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    const id = val ? val : deviceId.value.toString()
    console.log(id, 'shanchuid shanchuid')
    await DeviceInfoApi.deleteDeviceInfo(id)
    message.success(t('common.delSuccess'))
    deviceInfoTableRef.value.clearSelection(); //清除之前的选中状态
    // 刷新列表
    await getList()
  } catch {
  }
  await getList()

}

/** 查看操作 */
const openFormDetail = () => {
  const id = deviceId.value.toString()
  if (id) router.push(`/internetMonitor/device/deviceView/detail?id=${id}`)
}

/** 设备状态刷新操作 */
const refreshStatus = async () => {
  refreshLoading.value = true
  try {
    const response = await DeviceInfoApi.refreshDeviceStatus()
    await getList()
  } finally {
    refreshLoading.value = false
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await DeviceInfoApi.exportDeviceInfo(queryParams)
    download.excel(data, '设备信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/**
 * 设备分类级联选择器
 */
const categoryProps = {
  value: 'id',
  label: 'categoryName'
}

/** 初始化 **/
onMounted(async () => {
  const categoryTree = await DeviceCategoryApi.getDeviceCategoryTree({ parentId: 0, status: 1 });
  categoryOptions.value = retainFirstTwoLayers(categoryTree)
  if (router.currentRoute.value.query.deviceType) {
    const type = router.currentRoute.value.query.deviceType;
    if (type != null && type != undefined && type != "" && type != 'undefined') {
      queryParams.deviceType = type;
      deviceType.value = type.toString().split(',').map(Number)
    }
  }
  let location = route.query王
  if (location) {
    queryParams.deviceCode = location.deviceCode
    queryParams.deviceKind = location.id
    queryParams.deviceStatus = location.val
    if (queryParams.deviceCode) {
      deviceId.value = location.deviceCode
      setTimeout(() => {
        openSubDeviceForm()
      }, 1000)
    }
  }
  await getList()
})

// 定义属性
const props = defineProps({
  // todo (zhangyu26, 2024-03-26 15:19:17) : currCategory, 暂时没用
  currCategory: {
    type: Object,
    default: () => ({})
  },
  // 多选
  multi: {
    type: Boolean,
    default: () => false
  },
  // 只读
  readonly: {
    type: Boolean,
    default: () => false
  },
  // 选中的设备id
  initDeviceInfoIdList: {
    type: Array,
    default: () => ([])
  },
  inDialog: {
    type: Boolean,
    default: () => false
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
})
//监听父组件isCollapse变化
const isCollapse2 = ref(false)
watch(
  () => props.isCollapse,
  (val) => {
    console.log(val, '1234isCollapse')
    isCollapse2.value = val
  }
)
let route = useRoute()
if (route.query.deviceType) {
  queryParams.deviceType = route.query.deviceType
}
const selectedItemSet = ref<any[]>([])
onActivated(() => {
  getList()
  if (selectedItemSet.value.length > 0 && deviceInfoTableRef.value) nextTick(() => {
    list.value.forEach(item => {
      const flag = selectedItemSet.value.find(ele => ele === item.id)
      if (flag) deviceInfoTableRef.value.toggleRowSelection(item, true)
    })
  })
})

/**
 * table多选
 * 目前只是作为组件向父组件传值
 */
const multipleSelection = ref<DeviceInfoVO[]>([])
const emit = defineEmits(["selectedDeviceInfo",'clearTree', 'heightChange']);
const handleSelectionChange = (val: DeviceInfoVO[]) => {
  console.log("🚀 ~ handleSelectionChange ~ val:", val)
  multipleSelection.value = val
  emit('selectedDeviceInfo', multipleSelection.value)
  selectedItemSet.value = val.map(item => item.id)

  single.value = val.length !== 1
  deviceId.value = val.map(item => item.id)
  deviceName.value = val.map(item => item.deviceName)
}

// 监听父组件category变化
watch(() => props.currCategory,
  () => {
    if (props.currCategory) {
      if (props.currCategory.parkId === undefined) {
        queryParams.belongPark = props.currCategory.id
        queryParams.belongPlot = undefined
      } else {
        queryParams.belongPark = undefined
        queryParams.belongPlot = props.currCategory.id
      }
    } else {
      queryParams.belongPark = undefined
      queryParams.belongPlot = undefined
    }
    handleQuery()
  })

/** 开关机 */
const handleStatus = async (item: any) => {
  if (!enableSwitch.value) return
  let s = item.deviceStatus === 'online' ? '开机' : '关机'

  try {
    // 开关机的二次确认
    await message.confirm("是否确认" + s + "?", s + "确认")
    // 发起开关机
    let status = item.deviceStatus === 'online' ? 'online' : 'offline'
    await DeviceInfoApi.updateDeviceStatus(item.id, status)
    message.alertSuccess(s + "成功")
    // 刷新列表
    await getList()
  } catch {
    item.deviceStatus = item.deviceStatus === 'online' ? 'offline' : 'online'
  }
}

const handleData = async (item: any) => {
  loading.value = true
  try {
    await EquipmentDataApi.queryNewData(item.id)
    message.success(item.deviceName + ",采集最新数据成功")
    router.push({
      path: '/internetMonitor/deviceData/equipment-data-three',
      query: {
        equipmentCode: item.id
      }
    })
  } finally {
    loading.value = false
  }
}

/** 添加子设备操作 */
const subDeviceFormRef = ref()
const openSubDeviceForm = () => {
  subDeviceFormRef.value.open(deviceId.value.toString())
}
</script>
<style lang="scss" scoped>
@for $i from 1 through 3 {
  .icon-#{$i} {
    background-image: url(../../../assets/imgs/icon-#{$i}.png);
    background-size: 100% 100%;
    width: 13px;
    height: 13px;
  }
}

.tab-btn,
.tab-btn-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  border-radius: 5px 0 0 5px;
  height: 2rem;
}
.tab-btn2,
.tab-btn-selected2 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  border-radius: 0 5px 5px 0;
  height: 2rem;
}
.tab-btn {
  border: 1px solid #e6e6e6;
  color: #666666;
}
.tab-btn2 {
  border: 1px solid #e6e6e6;
  color: #666666;
}
.tab-btn-selected {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}
.tab-btn-selected2 {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}
</style>
