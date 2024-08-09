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
      <el-form-item label="所属基地id" prop="belongParkId">
        <el-input
          v-model="queryParams.belongParkId"
          placeholder="请输入所属基地id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="所属地块id" prop="belongPlotId">
        <el-input
          v-model="queryParams.belongPlotId"
          placeholder="请输入所属地块id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="所属品类id" prop="belongCategoryId">
        <el-input
          v-model="queryParams.belongCategoryId"
          placeholder="请输入所属品类id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="所属品种id" prop="belongVarietyId">
        <el-input
          v-model="queryParams.belongVarietyId"
          placeholder="请输入所属品种id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="批次" prop="batch">
        <el-input
          v-model="queryParams.batch"
          placeholder="请输入批次"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="指标" prop="indicator">
        <el-input
          v-model="queryParams.indicator"
          placeholder="请输入指标"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="指标权重" prop="indicatorWeight">
        <el-input
          v-model="queryParams.indicatorWeight"
          placeholder="请输入指标权重"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="要素" prop="element">
        <el-input
          v-model="queryParams.element"
          placeholder="请输入要素"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="要素权重" prop="elementWeight">
        <el-input
          v-model="queryParams.elementWeight"
          placeholder="请输入要素权重"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="要素值" prop="elementValue">
        <el-input
          v-model="queryParams.elementValue"
          placeholder="请输入要素值"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="要素单位" prop="elementUnits">
        <el-input
          v-model="queryParams.elementUnits"
          placeholder="请输入要素单位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="要素得分" prop="elementScore">
        <el-input
          v-model="queryParams.elementScore"
          placeholder="请输入要素得分"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="周期节点" prop="growthId">
        <el-input
          v-model="queryParams.growthId"
          placeholder="请输入周期节点"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="健康等级" prop="healthLevel">
        <el-input
          v-model="queryParams.healthLevel"
          placeholder="请输入健康等级"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="指标结果" prop="indicatorResult">
        <el-input
          v-model="queryParams.indicatorResult"
          placeholder="请输入指标结果"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
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
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:model-monitor-execution-growth:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:model-monitor-execution-growth:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="所属基地id" align="center" prop="belongParkId" />
      <el-table-column label="所属地块id" align="center" prop="belongPlotId" />
      <el-table-column label="所属品类id" align="center" prop="belongCategoryId" />
      <el-table-column label="所属品种id" align="center" prop="belongVarietyId" />
      <el-table-column label="批次" align="center" prop="batch" />
      <el-table-column label="指标" align="center" prop="indicator" />
      <el-table-column label="指标权重" align="center" prop="indicatorWeight" />
      <el-table-column label="要素" align="center" prop="element" />
      <el-table-column label="要素权重" align="center" prop="elementWeight" />
      <el-table-column label="要素值" align="center" prop="elementValue" />
      <el-table-column label="要素单位" align="center" prop="elementUnits" />
      <el-table-column label="要素得分" align="center" prop="elementScore" />
      <el-table-column label="周期节点" align="center" prop="growthId" />
      <el-table-column label="健康等级" align="center" prop="healthLevel" />
      <el-table-column label="指标结果" align="center" prop="indicatorResult" />
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
            v-hasPermi="['agriculture:model-monitor-execution-growth:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:model-monitor-execution-growth:delete']"
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
  <ModelMonitorExecutionGrowthForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ModelMonitorExecutionGrowthApi, ModelMonitorExecutionGrowthVO } from '@/api/agriculture/modelmonitorexecutiongrowth'
import ModelMonitorExecutionGrowthForm from './ModelMonitorExecutionGrowthForm.vue'

/** 监测执行周期 列表 */
defineOptions({ name: 'ModelMonitorExecutionGrowth' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ModelMonitorExecutionGrowthVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  belongParkId: undefined,
  belongPlotId: undefined,
  belongCategoryId: undefined,
  belongVarietyId: undefined,
  batch: undefined,
  indicator: undefined,
  indicatorWeight: undefined,
  element: undefined,
  elementWeight: undefined,
  elementValue: undefined,
  elementUnits: undefined,
  elementScore: undefined,
  growthId: undefined,
  healthLevel: undefined,
  indicatorResult: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ModelMonitorExecutionGrowthApi.getModelMonitorExecutionGrowthPage(queryParams)
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
    await ModelMonitorExecutionGrowthApi.deleteModelMonitorExecutionGrowth(id)
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
    const data = await ModelMonitorExecutionGrowthApi.exportModelMonitorExecutionGrowth(queryParams)
    download.excel(data, '监测执行周期.xls')
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
