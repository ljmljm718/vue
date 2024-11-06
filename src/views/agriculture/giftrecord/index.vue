<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
<!--      <el-form-item label="计划流水号" prop="planNumber">-->
<!--        <el-input-->
<!--          v-model="queryParams.planNumber"-->
<!--          placeholder="请输入计划流水号"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="赠送记录流水号" prop="recordNumber">
        <el-input
          v-model="queryParams.recordNumber"
          placeholder="请输入赠送记录流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="赠送方用户" prop="presenterId">-->
<!--        <el-input-->
<!--          v-model="queryParams.presenterId"-->
<!--          placeholder="请输入赠送方用户"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="赠送时间" prop="dealTime">
        <el-date-picker
          v-model="queryParams.dealTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="原始订单流水号" prop="oldOrderNumber">
        <el-input
          v-model="queryParams.oldOrderNumber"
          placeholder="请输入原始订单流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="领取状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择领取状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.GIFT_ORDER_RECEIVE_STATUS)"
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
<!--      <el-form-item label="创建时间" prop="createTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.createTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="接收方用户" prop="recipientId">-->
<!--        <el-input-->
<!--          v-model="queryParams.recipientId"-->
<!--          placeholder="请输入接收方用户"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="接收时间" prop="receptionTime">
        <el-date-picker
          v-model="queryParams.receptionTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="新订单流水号" prop="newOrderNumber">
        <el-input
          v-model="queryParams.newOrderNumber"
          placeholder="请输入新订单流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <!--        <el-button-->
          <!--          type="primary"-->
          <!--          plain-->
          <!--          @click="openForm('create')"-->
          <!--          v-hasPermi="['agriculture:gift-record:create']"-->
          <!--        >-->
          <!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
          <!--        </el-button>-->
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:gift-record:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
        </el-form-item>
      </el-row>
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="主键id" align="center" prop="id" />-->
      <el-table-column label="计划流水号" align="center" prop="planNumber" />
      <el-table-column label="赠送记录流水号" align="center" prop="recordNumber" />
      <el-table-column label="原始订单流水号" align="center" prop="oldOrderNumber" />
      <el-table-column label="新订单流水号" align="center" prop="newOrderNumber" />
<!--      <el-table-column label="领取状态" align="center" prop="status" />-->
      <el-table-column label="赠送方用户" align="center" prop="presenterId" />
      <el-table-column
        label="赠送时间"
        align="center"
        prop="dealTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="接收方用户" align="center" prop="recipientId" />
      <el-table-column
        label="接收时间"
        align="center"
        prop="receptionTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="备注" align="center" prop="remark" />
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        align="center"-->
<!--        prop="createTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
      <el-table-column label="操作" align="center">
        <template #default="scope">
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="openForm('update', scope.row.id)"-->
<!--            v-hasPermi="['agriculture:gift-record:update']"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:gift-record:delete']"
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
  <GiftRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { GiftRecordApi, GiftRecordVO } from '@/api/agriculture/giftrecord'
import GiftRecordForm from './GiftRecordForm.vue'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

/** 赠送记录 列表 */
defineOptions({ name: 'GiftRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<GiftRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  planNumber: undefined,
  recordNumber: undefined,
  presenterId: undefined,
  dealTime: [],
  oldOrderNumber: undefined,
  status: undefined,
  remark: undefined,
  createTime: [],
  recipientId: undefined,
  receptionTime: [],
  newOrderNumber: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await GiftRecordApi.getGiftRecordPage(queryParams)
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
    await GiftRecordApi.deleteGiftRecord(id)
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
    const data = await GiftRecordApi.exportGiftRecord(queryParams)
    download.excel(data, '赠送记录.xls')
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
