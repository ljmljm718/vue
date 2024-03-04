<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="统计时间" prop="statisticalTime">
        <el-date-picker
          v-model="queryParams.statisticalTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农事记录编码" prop="agriculturalRecordCode">
        <el-input
          v-model="queryParams.agriculturalRecordCode"
          placeholder="请输入农事记录编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产量(KG)" prop="wushanOutput">
        <el-input
          v-model="queryParams.wushanOutput"
          placeholder="请输入产量(KG)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="单价(元)" prop="unitPrice">
        <el-input
          v-model="queryParams.unitPrice"
          placeholder="请输入单价(元)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="收入(元)" prop="wushanIncome">
        <el-input
          v-model="queryParams.wushanIncome"
          placeholder="请输入收入(元)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="备用一" prop="reserveOne">
              <el-input
                v-model="queryParams.reserveOne"
                placeholder="请输入备用一"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>
            <el-form-item label="备用二" prop="reserveTwo">
              <el-input
                v-model="queryParams.reserveTwo"
                placeholder="请输入备用二"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>
            <el-form-item label="备用三" prop="reserveThree">
              <el-input
                v-model="queryParams.reserveThree"
                placeholder="请输入备用三"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>-->
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
          v-hasPermi="['wushan:farm-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wushan:farm-record:export']"
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
      <el-table-column label="编码" align="center" prop="id"/>
      <!--      <el-table-column label="统计时间" align="center" prop="statisticalTime" />-->
      <el-table-column label="统计时间" align="center" prop="statisticalTime" width="180" :formatter="dateFormatter"/>

      <el-table-column label="农事记录编码" align="center" prop="agriculturalRecordCode"/>
      <el-table-column label="产量(KG)" align="center" prop="wushanOutput"/>
      <el-table-column label="单价(KG/元)" align="center" prop="unitPrice"/>
      <el-table-column label="收入(元)" align="center" prop="wushanIncome"/>
      <!--      <el-table-column label="备用一" align="center" prop="reserveOne" />
            <el-table-column label="备用二" align="center" prop="reserveTwo" />
            <el-table-column label="备用三" align="center" prop="reserveThree" />-->
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
            v-hasPermi="['wushan:farm-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wushan:farm-record:delete']"
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
  <FarmRecordForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {FarmRecordApi, FarmRecordVO} from '@/api/wushan/farmrecord'
import FarmRecordForm from './FarmRecordForm.vue'

/** 巫山农事记录 列表 */
defineOptions({name: 'FarmRecord'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FarmRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  statisticalTime: [],
  agriculturalRecordCode: undefined,
  wushanOutput: undefined,
  unitPrice: undefined,
  wushanIncome: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmRecordApi.getFarmRecordPage(queryParams)
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
    await FarmRecordApi.deleteFarmRecord(id)
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
    const data = await FarmRecordApi.exportFarmRecord(queryParams)
    download.excel(data, '巫山农事记录.xls')
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
