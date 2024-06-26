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
      <!--      <el-form-item label="产品码" prop="productCode">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.productCode"-->
      <!--          placeholder="请输入产品码"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-180px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="企业名称" prop="firmName">
        <el-input
          v-model="queryParams.firmName"
          placeholder="请输入企业名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="原产地" prop="sourceArea">
        <el-input
          v-model="queryParams.sourceArea"
          placeholder="请输入原产地"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="生产时间" prop="yieldTime">
        <el-date-picker
          v-model="queryParams.yieldTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="产品认证" prop="productApprove">
        <el-input
          v-model="queryParams.productApprove"
          placeholder="请输入产品认证"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
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
      </el-form-item>
      <div style="margin-top: 20px;margin-left: 30px;height: 30px">
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agri:product-tracing:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            发码
          </el-button>
          <!--        <el-button-->
          <!--          type="success"-->
          <!--          plain-->
          <!--          @click="handleExport"-->
          <!--          :loading="exportLoading"-->
          <!--          v-hasPermi="['agri:product-tracing:export']"-->
          <!--        >-->
          <!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
          <!--        </el-button>-->
        </el-form-item>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id"/>-->
      <el-table-column label="序号" align="center" prop="id">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="产品码" align="center" prop="productCode"/>
      <el-table-column label="产品名称" align="center" prop="batchCode"/>
      <el-table-column label="企业名称" align="center" prop="firmName"/>
      <el-table-column label="原产地" align="center" prop="sourceArea"/>
      <el-table-column label="产品认证" align="center" prop="productApprove"/>
      <el-table-column
        label="生产时间"
        align="center"
        prop="yieldTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--      <el-table-column label="二维码" align="center" prop="batchQrImg"/>-->
      <el-table-column label="二维码" align="center" prop="batchQrImg">
        <template #default="scope">
          <el-image :src="`data:image/png;base64,${scope.row.batchQrImg}`"
                    style="object-fit: cover;width: 2rem;height: 2rem;"
                    preview-teleported
                    :preview-src-list="[`data:image/png;base64,${scope.row.batchQrImg}`]"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:product-tracing:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:product-tracing:delete']"
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
  <ProductTracingForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {ProductTracingApi, ProductTracingVO} from '@/api/agri/producttracing'
import ProductTracingForm from './ProductTracingForm.vue'

/** 稻米产品溯源管理 列表 */
defineOptions({name: 'ProductTracing'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProductTracingVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  productCode: undefined,
  firmName: undefined,
  sourceArea: undefined,
  yieldTime: [],
  productApprove: undefined,
  remark: undefined,
  createTime: [],
  receiptStartTime: [],
  receiptEndTime: [],
  batchCode: undefined,
  batchQrImg: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductTracingApi.getProductTracingPage(queryParams)
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
    await ProductTracingApi.deleteProductTracing(id)
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
    const data = await ProductTracingApi.exportProductTracing(queryParams)
    download.excel(data, '稻米产品溯源管理.xls')
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
