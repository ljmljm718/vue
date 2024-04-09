<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="95px"
    >
      <el-form-item label="产线编号" prop="lineNo">
        <el-input
          v-model="queryParams.lineNo"
          placeholder="请输入产线编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产线名称" prop="lineName">
        <el-input
          v-model="queryParams.lineName"
          placeholder="请输入产线名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品批次" prop="productBatch">
        <el-input
          v-model="queryParams.productBatch"
          placeholder="请输入产品批次"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="lineStatus">
        <el-select
          v-model="queryParams.lineStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_PRODUCTION_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理日期" prop="handleStartTime">
        <el-date-picker
          v-model="queryParams.handleStartTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="结束处理时间" prop="handleEndTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.handleEndTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
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
          v-hasPermi="['agriculture:production-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--          v-hasPermi="['agriculture:production-record:export']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" width="60" align="center">
        <template v-slot="scope">
          <span>{{ scope.$index + (queryParams.pageNo - 1) * (queryParams.pageSize) + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产线编号" align="center" prop="lineNo" width="160" />
      <el-table-column label="产线名称" align="center" prop="lineName" width="160" />
<!--      <el-table-column label="出库单id" align="center" prop="outOrderId" />-->
      <el-table-column label="原材料" align="center" prop="rawName" width="160" />
      <el-table-column label="原材料数量" align="center" prop="rawNumber" width="120" />
<!--      <el-table-column label="单位" align="center" prop="rawUnit" width="120" />-->
      <el-table-column label="产品批次" align="center" prop="productBatch" width="160" />
      <el-table-column label="产品名称" align="center" prop="productName" width="160" />
      <el-table-column label="产出总数量" align="center" prop="totalNumber" width="120" />
      <el-table-column label="合格数量" align="center" prop="qualifiedNumber" width="120" />
      <el-table-column label="单位" align="center" prop="productUnit" width="120" />
      <el-table-column
        label="开始处理时间"
        align="center"
        prop="handleStartTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column
        label="结束处理时间"
        align="center"
        prop="handleEndTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="状态" align="center" prop="lineStatus" width="160">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_PRODUCTION_STATUS" :value="scope.row.lineStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-if="scope.row.lineStatus != '2'"
            v-hasPermi="['agriculture:production-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-if="scope.row.lineStatus != '2'"
            v-hasPermi="['agriculture:production-record:delete']"
          >
            删除
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
          >
            详情
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
  <ProductionRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProductionRecordApi, ProductionRecordVO } from '@/api/agriculture/productionrecord'
import ProductionRecordForm from './ProductionRecordForm.vue'

/** 生产记录 列表 */
defineOptions({ name: 'ProductionRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProductionRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  lineNo: undefined,
  lineName: undefined,
  outOrderId: undefined,
  rawName: undefined,
  rawNumber: undefined,
  rawUnit: undefined,
  productBatch: undefined,
  productName: undefined,
  totalNumber: undefined,
  qualifiedNumber: undefined,
  productUnit: undefined,
  handleStartTime: [],
  handleEndTime: [],
  lineStatus: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductionRecordApi.getProductionRecordPage(queryParams)
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
    await ProductionRecordApi.deleteProductionRecord(id)
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
    const data = await ProductionRecordApi.exportProductionRecord(queryParams)
    download.excel(data, '生产记录.xls')
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
