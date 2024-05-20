<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="108px"
    >
      <el-form-item label="子设备编号" prop="subDevicesNum">
        <el-input
          v-model="queryParams.subDevicesNum"
          placeholder="请输入子设备编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="所属设备" prop="devicesId">-->
<!--        <el-input-->
<!--          v-model="queryParams.devicesId"-->
<!--          placeholder="请输入所属设备"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="子设备名称" prop="subDevicesName">
        <el-input
          v-model="queryParams.subDevicesName"
          placeholder="请输入子设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="开关状态" prop="swithState">
        <el-select
          v-model="queryParams.swithState"
          placeholder="请选择开关状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.EQU_SWITH_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="备注" prop="remark">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.remark"-->
      <!--          placeholder="请输入备注"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
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
          v-hasPermi="['agriculture:sub-device:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:sub-device:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<<<<<<< HEAD
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="子设备编号" align="center" prop="subDevicesNum"/>
=======
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
<!--      <el-table-column label="子设备编号" align="center" prop="subDevicesNum"/>-->
>>>>>>> 97bab8a254cb8ca8eb3086f94816009969d24b6f
      <el-table-column label="子设备名称" align="center" prop="subDevicesName"/>
      <el-table-column label="所属设备" align="center" prop="devicesId"/>
      <el-table-column label="所属设备名称" align="center" prop="remark"/>
      <el-table-column label="开关状态" align="center" prop="swithState">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                     @change="handleSwitchChange(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:sub-device:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:sub-device:delete']"
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
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <SubDeviceForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {SubDeviceApi, SubDeviceVO} from '@/api/agriculture/subdevice'
import SubDeviceForm from './SubDeviceForm.vue'
import {useRoute} from "vue-router";

let route = useRoute();
/** 子设备管理 列表 */
defineOptions({name: 'SubDevice'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<SubDeviceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  subDevicesNum: undefined,
  devicesId: undefined,
  subDevicesName: undefined,
  swithState: undefined,
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SubDeviceApi.getSubDevicePage(queryParams)
    list.value = data.list.map(item => ({...item, status: item.swithState === '0'}))
    total.value = data.total
  } finally {
    loading.value = false
  }
}
if (route.query.devicesId){
  let aa = route.query.devicesId;
  queryParams.devicesId = aa;
}

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


// 监听父组件category变化
watch(() => props.currCategory,
  () => {
    if (props.currCategory) {
      if (props.currCategory.deviceName==undefined){
        queryParams.devicesId = undefined
      }else {
        queryParams.devicesId = props.currCategory.id
      }
    } else {
      queryParams.devicesId = undefined
    }
    handleQuery()
  })


/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  emit('reset'); // 清空基地树的选中节点
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleSwitchChange = async (item) => {
  message.success(t('操作成功'))
  try {
    await SubDeviceApi.updateSubDevice({
      ...item, swithState: item.swithState === '0' ? '1' : '0'
    })



  } catch {
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SubDeviceApi.deleteSubDevice(id)
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
    const data = await SubDeviceApi.exportSubDevice(queryParams)
    download.excel(data, '子设备管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
