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
      <el-form-item label="计划流水号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入计划流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单流水号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="基地编号" prop="parkId">
        <el-input
          v-model="queryParams.parkId"
          placeholder="请输入基地编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="地块编号" prop="plotId">
        <el-input
          v-model="queryParams.plotId"
          placeholder="请输入地块编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select
          v-model="queryParams.orderType"
          placeholder="请选择订单类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址标识号" prop="addressNumber">
        <el-input
          v-model="queryParams.addressNumber"
          placeholder="请输入地址标识号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单金额" prop="orderAmount">
        <el-input
          v-model="queryParams.orderAmount"
          placeholder="请输入订单金额"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="实付金额" prop="realAmount">
        <el-input
          v-model="queryParams.realAmount"
          placeholder="请输入实付金额"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="付款时间" prop="paymentTime">
        <el-date-picker
          v-model="queryParams.paymentTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发货时间" prop="shippingTime">
        <el-date-picker
          v-model="queryParams.shippingTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="收货时间" prop="receiptTime">
        <el-date-picker
          v-model="queryParams.receiptTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单赠送标识" prop="isPresented">
        <el-input
          v-model="queryParams.isPresented"
          placeholder="请输入订单赠送标识"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="是否提醒" prop="isRemind">
        <el-input
          v-model="queryParams.isRemind"
          placeholder="请输入是否提醒"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="预计收货日期（起）" prop="expectStart">
        <el-date-picker
          v-model="queryParams.expectStart"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="选择预计收货日期（起）"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="预计收货日期（止）" prop="expectEnd">
        <el-date-picker
          v-model="queryParams.expectEnd"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="选择预计收货日期（止）"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
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
          v-hasPermi="['agriculture:adoption-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:adoption-order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="计划流水号" align="center" prop="serialNumber" />
      <el-table-column label="订单流水号" align="center" prop="orderNumber" />
      <el-table-column label="基地编号" align="center" prop="parkId" />
      <el-table-column label="地块编号" align="center" prop="plotId" />
      <el-table-column label="订单类型" align="center" prop="orderType" />
      <el-table-column label="地址标识号" align="center" prop="addressNumber" />
      <el-table-column label="订单金额" align="center" prop="orderAmount" />
      <el-table-column label="实付金额" align="center" prop="realAmount" />
      <el-table-column
        label="付款时间"
        align="center"
        prop="paymentTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="发货时间"
        align="center"
        prop="shippingTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="收货时间"
        align="center"
        prop="receiptTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="订单赠送标识" align="center" prop="isPresented" />
      <el-table-column label="是否提醒" align="center" prop="isRemind" />
      <el-table-column
        label="预计收货日期（起）"
        align="center"
        prop="expectStart"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="预计收货日期（止）"
        align="center"
        prop="expectEnd"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="备注" align="center" prop="remark" />
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
            v-hasPermi="['agriculture:adoption-order:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:adoption-order:delete']"
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
  <AdoptionOrderForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AdoptionOrderApi, AdoptionOrderVO } from '@/api/agriculture/adoptionorder'
import AdoptionOrderForm from './AdoptionOrderForm.vue'

/** 认养订单 列表 */
defineOptions({ name: 'AdoptionOrder' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AdoptionOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  serialNumber: undefined,
  orderNumber: undefined,
  parkId: undefined,
  plotId: undefined,
  orderType: undefined,
  addressNumber: undefined,
  orderAmount: undefined,
  realAmount: undefined,
  paymentTime: [],
  shippingTime: [],
  receiptTime: [],
  status: undefined,
  isPresented: undefined,
  isRemind: undefined,
  expectStart: undefined,
  expectStart: [],
  expectEnd: undefined,
  expectEnd: [],
  remark: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AdoptionOrderApi.getAdoptionOrderPage(queryParams)
    console.log("订单信息",data.list)
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
    await AdoptionOrderApi.deleteAdoptionOrder(id)
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
    const data = await AdoptionOrderApi.exportAdoptionOrder(queryParams)
    download.excel(data, '认养订单.xls')
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