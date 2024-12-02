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
      <!-- <el-form-item label="所属任务id" prop="tfId">
        <el-input
          v-model="queryParams.tfId"
          placeholder="请输入所属任务id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="料桶名" prop="chargingBasketName">
        <el-input
          v-model="queryParams.chargingBasketName"
          placeholder="请输入料桶名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <!-- <el-form-item label="上水阀id" prop="upperWaterValveId">
        <el-input
          v-model="queryParams.upperWaterValveId"
          placeholder="请输入上水阀id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="上水量(L)" prop="upperWaterYield">
        <el-input
          v-model="queryParams.upperWaterYield"
          placeholder="请输入上水量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="混肥器id" prop="fertilizerMixerId">
        <el-input
          v-model="queryParams.fertilizerMixerId"
          placeholder="请输入混肥器id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="混肥器状态" prop="fertilizerMixerStatus">
        <el-select
          v-model="queryParams.fertilizerMixerStatus"
          placeholder="请选择混肥器状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="定量桶状态" prop="measureBucketStatus">
        <el-select
          v-model="queryParams.measureBucketStatus"
          placeholder="请选择定量桶状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK)"
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
          v-hasPermi="['wfi:task-fertilization-detail:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wfi:task-fertilization-detail:export']"
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
      <!-- <el-table-column label="所属任务id" align="center" prop="tfId" /> -->
      <el-table-column label="料桶名" align="center" prop="chargingBasketName" />
      <!-- <el-table-column label="上水阀id" align="center" prop="upperWaterValveId" /> -->
      <el-table-column label="上水量" align="center" prop="upperWaterYield" />
      <!-- <el-table-column label="混肥器id" align="center" prop="fertilizerMixerId" /> -->
      <el-table-column label="混肥器状态" align="center" prop="fertilizerMixerStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK" :value="scope.row.fertilizerMixerStatus" />
        </template>
      </el-table-column>
      <el-table-column label="定量桶状态" align="center" prop="measureBucketStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK" :value="scope.row.measureBucketStatus" />
        </template>
      </el-table-column>
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
            v-hasPermi="['wfi:task-fertilization-detail:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wfi:task-fertilization-detail:delete']"
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
  <TaskFertilizationDetailForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { TaskFertilizationDetailApi, TaskFertilizationDetailVO } from '@/api/wfi/taskfertilizationdetail'
import TaskFertilizationDetailForm from './TaskFertilizationDetailForm.vue'

/** 施肥任务明细 列表 */
defineOptions({ name: 'TaskFertilizationDetail' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<TaskFertilizationDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tfId: undefined,
  chargingBasketName: undefined,
  upperWaterValveId: undefined,
  upperWaterYield: undefined,
  fertilizerMixerId: undefined,
  fertilizerMixerStatus: undefined,
  measureBucketStatus: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TaskFertilizationDetailApi.getTaskFertilizationDetailPage(queryParams)
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
    await TaskFertilizationDetailApi.deleteTaskFertilizationDetail(id)
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
    const data = await TaskFertilizationDetailApi.exportTaskFertilizationDetail(queryParams)
    download.excel(data, '施肥任务明细.xls')
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