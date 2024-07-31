<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
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
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="设备点位" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备点位"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-cascader
            style="width: 100%"
            v-model="deviceType"
            :options="categoryOptions"
            :props="categoryProps"
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
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!--      <el-form-item label="所属基地" prop="belongPark">
                <el-input
                  v-model="queryParams.belongPark"
                  placeholder="请输入所属基地"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-240px"
                />
              </el-form-item>
              <el-form-item label="所属地块" prop="belongPlot">
                <el-input
                  v-model="queryParams.belongPlot"
                  placeholder="请输入所属地块"
                  clearable
                  @keyup.enter="handleQuery"
                  class="!w-240px"
                />
              </el-form-item>-->
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px"/>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openAddForm()"
            v-hasPermi="['agriculture:device-info:create']"
            v-if="!readonly"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
          <el-button
            plain
            type="success"
            @click="openEditForm()"
            v-hasPermi="['agriculture:device-info:update']"
            :disabled="single"
          >
            <Icon icon="ep:edit" class="mr-5px"/>
            编辑
          </el-button>
          <el-button
            plain
            type="primary"
            @click="openFormDetail()"
            :disabled="single"
          >
            <Icon icon="ep:view" class="mr-5px"/>
            查看
          </el-button>
          <el-button
            plain
            type="danger"
            @click="handleDelete()"
            v-hasPermi="['agriculture:device-info:delete']"
            :disabled="single"
          >
            <Icon icon="ep:delete" class="mr-5px"/>
            删除
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:device-info:export']"
            v-if="!readonly"
          >
            <Icon icon="ep:download" class="mr-5px"/>
            导出
          </el-button>
          <el-button
            type="warning"
            plain
            @click="openSubDeviceForm()"
            v-hasPermi="['agriculture:sub-device:create']"
            v-if="!readonly"
            :disabled="single"
          >
            <Icon icon="ep:tools" class="mr-5px"/>
            调试配置
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      ref="deviceInfoTableRef"
      v-loading="loading"
      :data="list"
      :row-key="(row) => row.id"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
      height="calc(100vh - 470px)"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true"/>
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
      <el-table-column label="设备编号" align="center" prop="deviceCode" width="200"/>
      <el-table-column label="设备点位" align="center" prop="deviceName" width="150"/>
      <el-table-column label="设备类型" align="center" prop="deviceType" width="200">
        <template #default="scope">
          <el-cascader
            style="width: 100%"
            v-model="scope.row.deviceType"
            :options="categoryOptions"
            :props="categoryProps"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="设备监测类型" align="center" prop="deviceMonitorType" width="150"/>
      <el-table-column
        label="开关"
        align="center"
        width="80"
        v-if="!readonly"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.deviceStatus"
            active-value="online"
            inactive-value="offline"
            @change="handleStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="经度" align="center" prop="longitude"/>
      <el-table-column label="纬度" align="center" prop="latitude"/>
      <el-table-column label="状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="imgId">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.imgId"
            :preview-src-list="[row.imgId]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <!--      <el-table-column label="所属基地" align="center" prop="belongPark" width="200"/>
            <el-table-column label="所属地块" align="center" prop="belongPlot" width="200"/>-->
      <el-table-column label="位置" align="center" prop="location"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="操作"
        align="center"
        width="250"
        fixed="right"
        v-if="!readonly"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-if="deviceTypeMain.includes(scope.row.deviceType[0])"
            @click="handleData(scope.row)">采集数据
          </el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.deviceStatus=='online'&&scope.row.url!=null&&scope.row.url.indexOf('mp4')>0"
            @click="openExternalLink(scope)">查看监控
          </el-button>
          <el-button
            link
            type="primary"
            v-if="deviceTypeMain.includes(scope.row.deviceType[0])"
            @click="$router.push({
              path: '/internetMonitor/deviceData/equipment-data-three',
              query: {
                equipmentCode:scope.row.id
              }
            })">查看数据
          </el-button>
          <el-button
            link
            type="primary"
            v-if="mingYueDeviceTypeMain.includes(scope.row.deviceType[0])"
            @click="$router.push({
              path: '/internetMonitor/interface/equipment-data-rule',
              query: {
                dtuId:scope.row.deviceCode
              }
            })">安装配置
          </el-button>
          <!--          <el-button
                      link
                      type="primary"
                      v-if="scope.row.userId===142&&deviceTypeMain.includes(scope.row.deviceType[4])"
                      @click="$router.push({
                        path: '/device/sub-device',
                        query: {
                          devicesId: scope.row.id
                        }
                      })">查看子设备
                    </el-button>
                    <el-button
                      link
                      type="primary"
                      v-if="scope.row.userId=== 157 && mingYueDeviceTypeMain.includes(80) && scope.row.deviceKind === '88' "
                      @click="$router.push({
                        path: '/internetMonitor/device/sub-device',
                        query: {
                          devicesId: scope.row.id
                        }
                      })">查看子设备
                    </el-button>-->

          <!--          <el-button-->
          <!--            link-->
          <!--            :type="scope.row.deviceStatus === 'online' ? 'danger' : 'primary'"-->
          <!--            @click="handleStatus(scope.row)"-->
          <!--            v-if="scope.row.deviceStatus === 'online' || scope.row.deviceStatus === 'offline'"-->
          <!--            v-hasPermi="['agriculture:device-info:update']"-->
          <!--          >-->
          <!--            {{scope.row.deviceStatus === 'online' ? '关机' : '开机'}}-->
          <!--          </el-button>-->

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
  <DeviceInfoForm ref="formRef" @success="getList()"/>
  <SubDeviceListForm ref="subDeviceFormRef" @success="getList"/>
</template>

<script setup lang="ts">
import {DICT_TYPE, getStrDictOptions} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {DeviceInfoApi, DeviceInfoVO} from '@/api/agriculture/deviceinfo'
import DeviceInfoForm from './DeviceInfoForm.vue'
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import {retainFirstTwoLayers} from "@/utils/tree";
import router from "@/router";
import {useRoute, onBeforeRouteUpdate} from 'vue-router'
import {EquipmentDataApi} from "@/api/agriculture/equipmentdata";
import SubDeviceListForm from "@/views/agriculture/deviceinfo/components/SubDeviceListForm.vue";

/** 设备信息 列表 */
defineOptions({name: 'DeviceInfo'})

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
 */
const deviceTypeMain = ref([14, 25, 39, 59, 46, 76, 80, 90, 100, 111])
const mingYueDeviceTypeMain = ref([80])
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DeviceInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
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
  dtu: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
let categoryOptions = ref([])// 设备分类选项
const deviceType = ref()
const single = ref(true)  // 非单个禁用
const deviceId = ref() // 选中的设备id
const deviceName = ref() // 选中的设备名称
const openExternalLink = (scope) => {
  const url = scope.row.url // 替换为你想要跳转的外部链接
  window.open(url, '_blank'); // 使用'_blank'来确保在新窗口打开
}
/** 查询列表 */
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
    console.log("list.value", list.value)
    total.value = data.total
    setTimeout(() => {
      handleSelectedDeviceIds()
    })
  } finally {
    loading.value = false
    nextTick(() => {
      enableSwitch.value = true
    })
  }
}
let route = useRoute()
if (route.query.deviceType) {
  queryParams.deviceType = route.query.deviceType
  getList()
}
getList()
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
  queryParams.belongPark = undefined
  queryParams.belongPlot = undefined
  emit('reset'); // 清空基地树的选中节点
  handleQuery()
}


const formRef = ref()
/** 添加操作 */
const openAddForm = () => {
  router.push(`/internetMonitor/device/deviceView/create`)
}
/** 修改操作 */
const openEditForm = () => {
  const id = deviceId.value.toString()
  router.push(`/internetMonitor/device/deviceView/create?id=${id}`)
}

onActivated(() => {
  resetQuery()
})

/** 删除按钮操作 */
const handleDelete = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    const id = deviceId.value.toString()
    await DeviceInfoApi.deleteDeviceInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 查看操作 */
const openFormDetail = () => {
  const id = deviceId.value.toString()
  if (id) router.push(`/internetMonitor/device/deviceView/detail?id=${id}`)
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
  const categoryTree = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
  categoryOptions.value = retainFirstTwoLayers(categoryTree)
  if (router.currentRoute.value.query.deviceType) {
    const type = router.currentRoute.value.query.deviceType;
    if (type != null && type != undefined && type != "" && type != 'undefined') {
      queryParams.deviceType = type;
      deviceType.value = type.toString().split(',').map(Number)
    }
  }
  let location = route.query
  if (location) {
    queryParams.deviceCode = location.deviceCode
    queryParams.deviceKind = location.id
    queryParams.deviceStatus = location.val
    if (queryParams.deviceCode) {
      deviceId.value = location.deviceCode
      setTimeout(() => { openSubDeviceForm() }, 1000)
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
  }
})

/**
 * table多选
 * 目前只是作为组件向父组件传值
 */
const multipleSelection = ref<DeviceInfoVO[]>([])
const emit = defineEmits(["selectedDeviceInfo"]);
const handleSelectionChange = (val: DeviceInfoVO[]) => {
  multipleSelection.value = val
  emit('selectedDeviceInfo', multipleSelection.value)

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
const enableSwitch = ref<boolean>(false)
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
