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
      <el-form-item label="运输单号" prop="transportNo">
        <el-input
          v-model="queryParams.transportNo"
          placeholder="请输入运输单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="起点省份" prop="startProvince">
        <el-input
          v-model="queryParams.startProvince"
          placeholder="请输入起点省份"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="起点城市" prop="startCity">
        <el-input
          v-model="queryParams.startCity"
          placeholder="请输入起点城市"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="起点区域" prop="startArea">
        <el-input
          v-model="queryParams.startArea"
          placeholder="请输入起点区域"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="终点省份" prop="endProvince">
        <el-input
          v-model="queryParams.endProvince"
          placeholder="请输入终点省份"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="终点城市" prop="endCity">
        <el-input
          v-model="queryParams.endCity"
          placeholder="请输入终点城市"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="终点区域" prop="endArea">
        <el-input
          v-model="queryParams.endArea"
          placeholder="请输入终点区域"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品编号" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入产品编号"
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
      <el-form-item label="产品类型" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入产品类型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="运输时间" prop="transportTime">
        <el-date-picker
          v-model="queryParams.transportTime"
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
          v-hasPermi="['kaizhou:transport-manage:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['kaizhou:transport-manage:export']"
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
      <el-table-column label="运输单号" align="center" prop="transportNo" />
      <el-table-column label="起点省份" align="center" prop="startProvince" />
      <el-table-column label="起点城市" align="center" prop="startCity" />
      <el-table-column label="起点区域" align="center" prop="startArea" />
      <el-table-column label="终点省份" align="center" prop="endProvince" />
      <el-table-column label="终点城市" align="center" prop="endCity" />
      <el-table-column label="终点区域" align="center" prop="endArea" />
      <el-table-column label="产品编号" align="center" prop="productId" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="产品类型" align="center" prop="categoryId" />
      <el-table-column
        label="运输时间"
        align="center"
        prop="transportTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="运输数量" align="center" prop="transportCount" />
      <el-table-column label="产品单位" align="center" prop="productUnitId" />
      <el-table-column label="车牌号" align="center" prop="vehicleLicense" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['kaizhou:transport-manage:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:transport-manage:delete']"
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
  <TransportManageForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { TransportManageApi, TransportManageVO } from '@/api/kaizhou/transportmanage'
import TransportManageForm from './TransportManageForm.vue'

/** 运输管理 列表 */
defineOptions({ name: 'TransportManage' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<TransportManageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  transportNo: undefined,
  startProvince: undefined,
  startCity: undefined,
  startArea: undefined,
  endProvince: undefined,
  endCity: undefined,
  endArea: undefined,
  productId: undefined,
  productName: undefined,
  categoryId: undefined,
  transportTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TransportManageApi.getTransportManagePage(queryParams)
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
    await TransportManageApi.deleteTransportManage(id)
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
    const data = await TransportManageApi.exportTransportManage(queryParams)
    download.excel(data, '运输管理.xls')
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