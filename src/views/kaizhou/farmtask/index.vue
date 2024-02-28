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
      <el-form-item label="任务编码" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入任务编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="任务人员" prop="taskPerson">
        <el-input
          v-model="queryParams.taskPerson"
          placeholder="请输入任务人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="任务开始时间" prop="taskStartdate" label-width="100">
        <el-date-picker
          v-model="queryParams.taskStartdate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStastus">
        <el-select
          v-model="queryParams.taskStastus"
          placeholder="请选择任务状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_FARM_TASK_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input
          v-model="queryParams.plotName"
          placeholder="请输入地块名称"
          clearable
          @keyup.enter="handleQuery"
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
          v-hasPermi="['kaizhou:farm-task:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['kaizhou:farm-task:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="任务编码" align="center" prop="taskCode" width="200" />
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="任务状态" align="center" prop="taskStastus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_FARM_TASK_STATUS" :value="scope.row.taskStastus" />
        </template>
      </el-table-column>
      <el-table-column label="地块名称" align="center" prop="plotName" />
      <el-table-column label="任务人员" align="center" prop="taskPerson" />
      <el-table-column label="任务完成要求" align="center" prop="taskDemand" />
      <el-table-column
        label="任务开始时间"
        align="center"
        prop="taskStartdate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="任务截止时间"
        align="center"
        prop="taskEnddate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="验收标准" align="center" prop="checkStandard" />
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        align="center"-->
<!--        prop="createTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button
            link
            type="success"
            v-if="scope.row.taskStastus=='待发布'"
            @click="handlePublish(scope.row.id)"
            v-hasPermi="['kaizhou:farm-task:publish']"
          >
              发布
          </el-button>
          <el-button
            link
            type="success"
            v-if="scope.row.taskStastus=='待完成'||scope.row.taskStastus=='已驳回'"
            @click="handleSuccess(scope.row.id)"
            v-hasPermi="['kaizhou:farm-task:audit']"
          >
              完成
          </el-button>
          <el-button
            link
            type="success"
            v-if="scope.row.taskStastus=='待审核'"
            @click="handlePass(scope.row.id)"
            v-hasPermi="['kaizhou:farm-task:audit']"
          >
              通过
          </el-button>
          <el-button
            link
            type="danger"
            v-if="scope.row.taskStastus=='待审核'"
            @click="handleBack(scope.row.id)"
            v-hasPermi="['kaizhou:farm-task:audit']"
          >
              驳回
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['kaizhou:farm-task:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:farm-task:delete']"
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
  <FarmTaskForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { FarmTaskApi, FarmTaskVO } from '@/api/kaizhou/farmtask'
import FarmTaskForm from './FarmTaskForm.vue'

/** 农事任务 列表 */
defineOptions({ name: 'FarmTask' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FarmTaskVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskCode: undefined,
  taskPerson: undefined,
  taskDemand: undefined,
  taskStartdate: [],
  taskStastus: undefined,
  taskName: undefined,
  plotName: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmTaskApi.getFarmTaskPage(queryParams)
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
    await FarmTaskApi.deleteFarmTask(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
const handlePublish =async (id: number) =>{
  try {
    await message.confirm('请确定是否发布该任务?')
    await FarmTaskApi.publishFarmTask(id,'待完成')
    message.success('发布成功!')
    await getList()
  }catch {
  }
}
const handleSuccess =async (id: number) =>{
    try {
        await message.confirm('请确定是否完成该任务?')
        await FarmTaskApi.auditFarmTask(id,'待审核','完成任务')
        message.success('任务完成!')
        await getList()
    }catch {
    }
}
const handlePass =async (id: number) =>{
    try {
        await message.confirm('请确定是否通过该任务?')
        await FarmTaskApi.auditFarmTask(id,'已完成','审核通过')
        message.success('通过成功!')
        await getList()
    }catch {
    }
}
const handleBack =async (id: number) =>{
    try {
        await message.confirm('请确定是否驳回该任务?')
        await FarmTaskApi.auditFarmTask(id,'已驳回','审核驳回')
        message.success('驳回成功!')
        await getList()
    }catch {
    }
}
/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await FarmTaskApi.exportFarmTask(queryParams)
    download.excel(data, '农事任务.xls')
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
