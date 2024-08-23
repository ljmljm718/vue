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
      <el-form-item label="基地名称" prop="parkName">
        <el-input
          v-model="queryParams.parkName"
          placeholder="请输入基地名称"
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
<!--      <el-form-item label="实例编号" prop="processInstanceId">-->
<!--        <el-input-->
<!--          v-model="queryParams.processInstanceId"-->
<!--          placeholder="请输入实例编号"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="审批结果" prop="status">-->
<!--        <el-select-->
<!--          v-model="queryParams.status"-->
<!--          placeholder="请选择审批结果"-->
<!--          clearable-->
<!--          class="!w-240px"-->
<!--        >-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="开始时间" prop="startTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.startTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="完成时间" prop="endTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.endTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="完成要求" prop="completeRequirement">-->
<!--        <el-input-->
<!--          v-model="queryParams.completeRequirement"-->
<!--          placeholder="请输入完成要求"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="验收标准" prop="acceptanceStandard">-->
<!--        <el-input-->
<!--          v-model="queryParams.acceptanceStandard"-->
<!--          placeholder="请输入验收标准"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
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
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          @click="openForm('create')"-->
<!--          v-hasPermi="['agriculture:farm-task:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex items-center mb-3">
      <div style="margin-bottom: 1rem;margin-left: 1.5rem;margin-right: 1.5rem;height: 2rem">
        <el-form-item>
          <el-button
            type="primary"
            class="!h-2.4rem"
            plain
            @click="handleCreate()"
            v-hasPermi="['agriculture:farm-task:create']" >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
        </el-form-item>
      </div>
      <div class="grow">
        <IntroduceAlert title="农事任务模块的核心功能在于为农事计划的具体实施制定明确的操作规范和验收标准。"/>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="计划名称" align="center" prop="planName"  width="200" >
        <template  #header>
          <QuestionMaskTip lable-name="计划名称" content="可以点击计划名称，来查看具体的农事计划。"/>
        </template>
        <template  #default="scope">
          <label style="cursor:pointer;color: #0072c6"  @click="lookPlanDetail(scope.row.planCode)"> {{ scope.row.planName }}</label>
        </template>
      </el-table-column>
      <el-table-column label="基地名称" align="center" prop="parkName" width="180" />
<!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
      <el-table-column label="地块名称" align="center" prop="plotName" />
      <el-table-column label="审批状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="完成时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="完成要求" align="center" prop="completeRequirement" />
      <el-table-column label="验收标准" align="center" prop="acceptanceStandard" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
            v-hasPermi="['agriculture:farm-task:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['agriculture:farm-task:query']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            进度
          </el-button>
          <el-button
            v-if="scope.row.status === 1"
            v-hasPermi="['agriculture:farm-task:create']"
            link
            type="danger"
            @click="cancelLeave(scope.row)"
          >
            取消
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
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import { FarmTaskApi, FarmTaskVO } from '@/api/agriculture/farmtask'
import FarmTaskForm from './FarmTaskForm.vue'
import {DICT_TYPE} from "@/utils/dict";
import Router from "@/router";
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import QuestionMaskTip from "@/components/QuestionMaskTip/index.vue";

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
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  processInstanceId: undefined,
  status: undefined,
  startTime: [],
  endTime: [],
  completeRequirement: undefined,
  acceptanceStandard: undefined,
  createTime: [],
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


const router = useRouter() // 路由
/** 添加操作 */
const handleCreate = () => {
  router.push({ path: '/farm_work/FarmWorkCreate' })
}

/** 详情操作 */
const handleDetail = (row: any) => {
  router.push({
    path: '/farm_work/FarmTaskDetail',
    query: {
      id: row.id
    }
  })
}

const lookPlanDetail = (planId:any) => {
  router.push('/farm_work/farmManage/createOrUpdate?type=view&id='+planId)
}

/** 取消请假操作 */
const cancelLeave = async (row) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空'
  })
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstanceByStartUser(row.processInstanceId, value)
  message.success('取消成功')
  // 刷新列表
  await getList()
}

/** 审批进度 */
const handleProcessDetail = (row) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
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
// const openForm = (type: string, id?: number) => {
//   formRef.value.open(type, id)
// }

/** 删除按钮操作 */
// const handleDelete = async (id: number) => {
//   try {
//     // 删除的二次确认
//     await message.delConfirm()
//     // 发起删除
//     await FarmTaskApi.deleteFarmTask(id)
//     message.success(t('common.delSuccess'))
//     // 刷新列表
//     await getList()
//   } catch {}
// }

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
onActivated(async () => {
  await getList()
})
</script>
