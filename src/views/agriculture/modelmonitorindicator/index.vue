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
      <el-form-item label="模型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请选择模型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        >
          <template #append>
            <el-button @click="openModelSelectPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="生长周期" prop="growthPeriodId">-->
<!--        <el-input-->
<!--          v-model="queryParams.growthPeriodId"-->
<!--          placeholder="请输入生长周期"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="指标名称" prop="indicatorName">-->
<!--        <el-input-->
<!--          v-model="queryParams.indicatorName"-->
<!--          placeholder="请输入指标名称"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="指标范围" prop="indicatorRange">-->
<!--        <el-input-->
<!--          v-model="queryParams.indicatorRange"-->
<!--          placeholder="请输入指标范围"-->
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
          v-hasPermi="['agriculture:model-monitor-indicator:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:model-monitor-indicator:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="指标编号" align="center" prop="id" />
      <el-table-column label="模型名称" align="center" prop="modelId" />
      <el-table-column label="生长周期" align="center" prop="growthPeriodId" />
      <el-table-column label="指标名称" align="center" prop="indicatorName" />
      <el-table-column label="指标说明" align="center" prop="indicatorDescription" />
      <el-table-column label="指标范围" align="center" prop="indicatorRange" />
      <el-table-column label="指标结果" align="center" prop="indicatorResult" />
      <el-table-column label="健康分值" align="center" prop="healthScore" />
      <el-table-column label="权重" align="center" prop="weight" />
      <el-table-column label="是否默认" align="center" prop="isDefault" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ADOPTION_ODER_REMIND_STATUS" :value="scope.row.modelType" />
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
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:model-monitor-indicator:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:model-monitor-indicator:delete']"
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
  <ModelMonitorIndicatorForm ref="formRef" @success="getList" />

  <!--  选择模型-->
  <ModelSelectPopup ref="modelSelectPopupRef" @success="handleModelSelectPopupChange"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ModelMonitorIndicatorApi, ModelMonitorIndicatorVO } from '@/api/agriculture/modelmonitorindicator'
import ModelMonitorIndicatorForm from './ModelMonitorIndicatorForm.vue'
import {DICT_TYPE} from "@/utils/dict";

/** 监测指标 列表 */
defineOptions({ name: 'ModelMonitorIndicator' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ModelMonitorIndicatorVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  modelId: undefined,
  growthPeriodId: undefined,
  indicatorName: undefined,
  indicatorDescription: undefined,
  indicatorRange: undefined,
  indicatorResult: undefined,
  healthScore: undefined,
  weight: undefined,
  isDefault: 0,
  implementationClass: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
//根据选中模型获取关联的品种品类
const categoryId = ref() //品类
const varietyId = ref() //品种

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ModelMonitorIndicatorApi.getModelMonitorIndicatorPage(queryParams)
    list.value = data.list
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
    await ModelMonitorIndicatorApi.deleteModelMonitorIndicator(id)
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
    const data = await ModelMonitorIndicatorApi.exportModelMonitorIndicator(queryParams)
    download.excel(data, '监测指标.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

//模型的选择
const modelSelectPopupRef = ref()
const openModelSelectPopup = (id: string) => {
  modelSelectPopupRef.value.open(id)
}
const handleModelSelectPopupChange = (order: ModelManagementVO) => {
  queryParams.modelId = String(order[0].id)
  queryParams.name = String(order[0].modelName)
  categoryId.value = String(order[0].belongCategoryId)
  varietyId.value = String(order[0].belongVarietyId)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
