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
<!--      <el-form-item label="指标id" prop="indicatorId">-->
<!--        <el-input-->
<!--          v-model="queryParams.indicatorId"-->
<!--          placeholder="请输入指标id"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="要素名称" prop="elementName">
        <el-input
          v-model="queryParams.elementName"
          placeholder="请输入要素名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="权重" prop="weight">-->
<!--        <el-input-->
<!--          v-model="queryParams.weight"-->
<!--          placeholder="请输入权重"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="绑定设备" prop="bindDevice">-->
<!--        <el-input-->
<!--          v-model="queryParams.bindDevice"-->
<!--          placeholder="请输入绑定设备"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="实现类" prop="implementationClass">-->
<!--        <el-input-->
<!--          v-model="queryParams.implementationClass"-->
<!--          placeholder="请输入实现类"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:model-indicator-element:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--          v-hasPermi="['agriculture:model-indicator-element:export']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="要素编号" align="center" prop="id" />
<!--      <el-table-column label="监测指标" align="center" prop="indicatorId" />-->
      <el-table-column label="要素名称" align="center" prop="elementName" width="110"/>
      <el-table-column label="权重" align="center" prop="weight" width="90"/>
      <el-table-column label="指标说明" align="center" prop="indicatorDescription" />
      <el-table-column label="绑定设备" align="center" prop="deviceName" />
      <el-table-column label="状态" align="center" prop="status" width="110">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="实现类" align="center" prop="implementationClass" />
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        align="center"-->
<!--        prop="createTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="router.push(`/growth_monitor/model-indicator-element-range?indicatorElementId=${scope.row.id}`)"
          >
            指标范围
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row)"
            v-hasPermi="['agriculture:model-indicator-element:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:model-indicator-element:delete']"
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
  <ModelIndicatorElementForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { ModelIndicatorElementApi, ModelIndicatorElementVO } from '@/api/agriculture/modelindicatorelement'
import ModelIndicatorElementForm from './ModelIndicatorElementForm.vue'
import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'
import {CommonStatusEnum} from "@/utils/constants";
import {ModelManagementApi, ModelManagementVO} from "@/api/agriculture/modelmanagement";
import {DeviceInfoApi, DeviceInfoVO} from "@/api/agriculture/deviceinfo";
import {CropGrowthNewApi} from "@/api/agri/cropgrowthnew";

/** 指标要素 列表 */
defineOptions({ name: 'ModelIndicatorElement' })

const router = useRouter()
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute()

const loading = ref(true) // 列表的加载中
const list = ref<ModelIndicatorElementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  indicatorId: undefined,
  elementName: undefined,
  weight: undefined,
  indicatorDescription: undefined,
  bindDevice: undefined,
  status: undefined,
  implementationClass: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const listDeviceInfo = ref<DeviceInfoVO[]>([]) // 设备列表的数据
const getTypeData = async () => {
  const { list: list1 } = await DeviceInfoApi.getDeviceInfoNoPage({})
  if (Array.isArray(list1)) listDeviceInfo.value = list1
}

onMounted( () => {
  if (route.query) queryParams.indicatorId = route.query.indicatorId
})

const deviceName = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ModelIndicatorElementApi.getModelIndicatorElementPage(queryParams)
    list.value = data.list.map(item => {
      const element = Array.isArray(listDeviceInfo.value) ? listDeviceInfo.value.find(ele => (ele.id === item.bindDevice)) : null
      return {
        ...item,
        deviceName: element ? element.deviceName : ''
      }
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.indicatorId = undefined
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, item: any) => {
  formRef.value.open(type, item)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ModelIndicatorElementApi.deleteModelIndicatorElement(id)
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
    const data = await ModelIndicatorElementApi.exportModelIndicatorElement(queryParams)
    download.excel(data, '指标要素.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 修改状态 */
const handleStatusChange = async (row: ModelIndicatorElementApi.ModelIndicatorElementVO) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm('确认要' + text + '当前指标吗?')
    // 发起修改状态
    await ModelIndicatorElementApi.updateModelIndicatorElementStatus(row.id, row.status)
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

const init = async () => {
  await getTypeData()
  await getList()
}

/** 初始化 **/
onMounted(() => {
  init()
})
</script>
