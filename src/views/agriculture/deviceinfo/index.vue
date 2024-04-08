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
      <el-form-item label="设备编号" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:device-info:create']"
          v-if="!readonly"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
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
      </el-form-item>
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
      :style="`${props.inDialog ? 'height: 40vh;' : ''}`"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="multi" type="selection" width="55" :reserve-selection="true"/>
      <el-table-column label="设备编号" align="center" prop="deviceCode" width="200"/>
      <el-table-column label="设备名称" align="center" prop="deviceName" width="150"/>
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
      <el-table-column label="所属基地" align="center" prop="belongPark" width="200"/>
      <el-table-column label="所属地块" align="center" prop="belongPlot" width="200"/>
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
            @click="$router.push({
              path: '/deviceData/equipment-data-three',
              query: {
                equipmentCode: scope.row.id
              }
            })">查看监测数据
          </el-button>

          <el-button
            link
            type="primary"
            v-if="scope.row.userId===142"
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
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:device-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:device-info:delete']"
          >
            删除
          </el-button>
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
import {useRoute} from 'vue-router'

/** 设备信息 列表 */
defineOptions({name: 'DeviceInfo'})

/**
 * 需要跳转的设备类型，一级分类为监测设备的
 * 14 - 武隆
 * 25 - 酉阳
 * 39 - 隘口
 * 46 - 白帝
 */
const deviceTypeMain = ref([14, 25, 39, 46])

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
  deviceKind: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
let categoryOptions = ref([])// 设备分类选项
const deviceType = ref()


/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
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
  }
}
let route=useRoute()

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
  handleQuery()
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
    await DeviceInfoApi.deleteDeviceInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
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
  const categoryTree = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
  categoryOptions.value = retainFirstTwoLayers(categoryTree)
  if (router.currentRoute.value.query.deviceType) {
    const type = router.currentRoute.value.query.deviceType;
    if (type != null && type != undefined && type != "" && type != 'undefined') {
      queryParams.deviceType = type;
      deviceType.value = type.toString().split(',').map(Number)
    }
  }
  let location=route.query
    if(location){
      queryParams.deviceKind=location.id
      queryParams.deviceStatus=location.val
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
}

// 监听父组件category变化
watch(() => props.currCategory,
  () => {
    if (props.currCategory) {
      if (props.currCategory.parkId === undefined ) {
        queryParams.belongPark = props.currCategory.id
        queryParams.belongPlot = undefined
      } else {
        queryParams.belongPark = undefined
        queryParams.belongPlot=  props.currCategory.id
      }
    } else {
      queryParams.belongPark = undefined
      queryParams.belongPlot = undefined
    }
    handleQuery()
  })

</script>
