<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="140px"
    >
      <el-form-item label="任务名称" prop="tfName">
        <el-input
          v-model="queryParams.tfName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="所属系统" prop="belongWfiSystem">
        <el-input
          v-model="queryParams.belongWfiSystem"
          placeholder="请输入所属系统"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="施肥类型" prop="fertilizationType">
        <el-select
          v-model="queryParams.fertilizationType"
          placeholder="请选择施肥类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="搅拌类型" prop="mixingType">
        <el-select
          v-model="queryParams.mixingType"
          placeholder="请选择搅拌类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_STIR_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="水泵控制" prop="waterPumpStatus">
        <el-select
          v-model="queryParams.waterPumpStatus"
          placeholder="请选择水泵控制"
          clearable
          @change="handleQuery"
          style="width:240px"
        >
          <el-option
            label="是"
            value="是"
          />
          <el-option
            label="否"
            value="否" 
          />
        </el-select>
      </el-form-item>

      <el-form-item label="同时施肥灌区数量" prop="concurrentTaskNumber">
        <el-input
          v-model="queryParams.concurrentTaskNumber"
          placeholder="请输入同时施肥灌区数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="施肥时长/量（分钟/L）" prop="amountTimeNumber">
        <el-input
          v-model="queryParams.amountTimeNumber"
          placeholder="请输入施肥时长/量（分钟/L）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="施肥灌区" prop="iaCodeList">
        <el-input
          v-model="queryParams.iaCodeList"
          placeholder="请输入施肥灌区"
          clearable
          @keyup.enter="handleQuery"
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
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['wfi:task-fertilization:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wfi:task-fertilization:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
      
      <!-- <el-table-column label="所属系统" align="center" prop="belongWfiSystem" /> -->
      <el-table-column label="施肥类型" align="center" prop="fertilizationType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WFI_FERTILIZE_TYPE" :value="scope.row.fertilizationType" />
        </template>
      </el-table-column>
      <el-table-column label="搅拌类型" align="center" prop="mixingType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WFI_STIR_TYPE" :value="scope.row.mixingType" />
        </template>
      </el-table-column>
      <el-table-column label="水泵控制" align="center" prop="waterPumpStatus" />
      <el-table-column label="同时施肥罐区数量" align="center" prop="concurrentTaskNumber" />
      <el-table-column label="施肥时长/量（分钟/L）" align="center" prop="amountTimeNumber" />
      <el-table-column label="施肥灌区" align="center" prop="iaCodeList" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WFI_FERTILIZE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="任务名称" align="center" prop="tfName" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wfi:task-fertilization:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wfi:task-fertilization:delete']"
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
  <TaskFertilizationForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { TaskFertilizationApi, TaskFertilizationVO } from '@/api/wfi/taskfertilization'
import TaskFertilizationForm from './TaskFertilizationForm.vue'

/** 施肥任务 列表 */
defineOptions({ name: 'TaskFertilization' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<TaskFertilizationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tfName: undefined,
  belongWfiSystem: undefined,
  fertilizationType: undefined,
  mixingType: undefined,
  waterPumpStatus: undefined,
  concurrentTaskNumber: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined,
  status: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TaskFertilizationApi.getTaskFertilizationPage(queryParams)
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
    await TaskFertilizationApi.deleteTaskFertilization(id)
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
    const data = await TaskFertilizationApi.exportTaskFertilization(queryParams)
    download.excel(data, '施肥任务.xls')
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