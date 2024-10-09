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
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审批状态" prop="approvalStatus">
        <el-select
          v-model="queryParams.approvalStatus"
          placeholder="请选择审批状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PRODUCER_ENTRY_APPROVAL_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:producer-entry:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:producer-entry:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="公司名称" align="center" prop="companyName" width="200"/>
      <el-table-column label="法人" align="center" prop="legalPerson" />
      <el-table-column label="注册地址" align="center" prop="registeredAddress" />
      <el-table-column label="联系方式" align="center" prop="contactPhone" />
      <el-table-column label="注册资金" align="center" prop="registeredCapital" />
      <el-table-column label="统一社会信用代码" align="center" prop="socialCreditCode" />
      <el-table-column
        label="成立时间"
        align="center"
        prop="establishDate"
        :formatter="dateFormatter2"
        width="100px"
      />
      <el-table-column label="营业执照" align="center" prop="businessLicense" />
      <el-table-column label="食品生产许可证" align="center" prop="foodProduceLicense" />
      <el-table-column label="审批状态" align="center" prop="approvalStatus" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PRODUCER_ENTRY_APPROVAL_STATUS" :value="scope.row.approvalStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <el-button
            v-if="scope.row.approvalStatus==='0'"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:producer-entry:update']"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.approvalStatus==='1'"
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['agriculture:producer-entry:update']"
          >
            查看详情
          </el-button>
          <el-button
            v-if="scope.row.approvalStatus==='0'"
            link
            type="warning"
            @click="openForm('approval', scope.row.id)"
            v-hasPermi="['agriculture:producer-entry:update']"
          >
            审批
          </el-button>
          <el-button
            v-if="scope.row.approvalStatus==='0'"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:producer-entry:delete']"
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
  <ProducerEntryForm ref="formRef" @success="getList" @refresh="resetQuery()" />
</template>

<script setup lang="ts">
import { dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProducerEntryApi, ProducerEntryVO } from '@/api/agriculture/producerentry'
import ProducerEntryForm from './ProducerEntryForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import activiti
  from "@/components/bpmnProcessDesigner/package/designer/plugins/extension-moddle/activiti";

/** 生产商入库 列表 */
defineOptions({ name: 'ProducerEntry' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProducerEntryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  companyName: undefined,
  legalPerson: undefined,
  registeredAddress: undefined,
  contactPhone: undefined,
  registeredCapital: undefined,
  socialCreditCode: undefined,
  establishDate: [],
  businessLicense: undefined,
  foodProduceLicense: undefined,
  approvalStatus: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProducerEntryApi.getProducerEntryPage(queryParams)
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

//修改审批状态
// const updateApprovalStatus = async (row: ProducerEntryApi.ProducerEntryVO) => {
//   try {
//     openForm("approval", row.id)
//     // 修改状态的二次确认
//     await message.confirm('确认通过当前入库审批吗？')
//     const data = row as unknown as ProducerEntryVO
//     data.approvalStatus = '1'
//     console.log("data", data)
//     // 发起修改状态
//     await ProducerEntryApi.updateProducerEntry(data)
//     // 刷新列表
//     await getList()
//   } catch {
//   }
// }


/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProducerEntryApi.deleteProducerEntry(id)
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
    const data = await ProducerEntryApi.exportProducerEntry(queryParams)
    download.excel(data, '生产商入库.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

onActivated(() => {
  getList()
})

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
