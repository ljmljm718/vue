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
      <el-form-item label="规则名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入规则名称"
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
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_JOB_STATUS)"
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
          v-hasPermi="['agriculture:check-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:check-rule:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="规则编号" align="center" prop="id" />
      <el-table-column label="规则名称" width="300px" align="center" prop="name"/>
      <el-table-column label="规则状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_JOB_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
<!--      <el-table-column label="处理器的名字" align="center" prop="handlerName" />-->
<!--      <el-table-column label="处理器的参数" align="center" prop="handlerParam" />-->
      <el-table-column label="CRON 表达式" align="center" prop="cronExpression" />
      <el-table-column label="重试次数" align="center" prop="retryCount" />
      <el-table-column label="重试间隔" align="center" prop="retryInterval" />
      <el-table-column label="监控超时时间" align="center" prop="monitorTimeout" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="操作"
        align="center"
        width="250px"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openDeviceInfoHelperDialog(scope.row)"
            v-hasPermi="['agriculture:check-rule:update']"
          >
            绑定设备
          </el-button>
          <el-button
            type="primary"
            link
            @click="handleChangeStatus(scope.row)"
            v-hasPermi="['agriculture:check-rule:update']"
          >
            {{ scope.row.status === InfraJobStatusEnum.STOP ? '开启' : '暂停' }}
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:check-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:check-rule:delete']"
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
  <CheckRuleForm ref="formRef" @success="getList" />
  <!-- 弹窗:设备选择 -->
  <DeviceInfoHelper
    ref="deviceInfoHelperRef"
    :multi="true"
    @confirm-device-info-list="handleBindDevice"
  />
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {CheckRuleApi, CheckRuleVO} from '@/api/agriculture/checkrule'
import CheckRuleForm from './CheckRuleForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {InfraJobStatusEnum} from "@/utils/constants";
import DeviceInfoHelper from "@/views/components/DeviceInfoHelper/index.vue";
import {JobVO} from "@/api/infra/job";
import {CACHE_KEY, useCache} from "@/hooks/web/useCache";

/** 巡检规则 列表 */
defineOptions({ name: 'CheckRule' })

const {wsCache} = useCache()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CheckRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  handlerName: undefined,
  handlerParam: undefined,
  cronExpression: undefined,
  retryCount: undefined,
  retryInterval: undefined,
  monitorTimeout: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CheckRuleApi.getCheckRulePage(queryParams)
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

/** 修改状态操作 */
const handleChangeStatus = async (row: CheckRuleVO) => {
  try {
    // 修改状态的二次确认
    const text = row.status === InfraJobStatusEnum.STOP ? '开启' : '关闭'
    await message.confirm(
      '确认要' + text + '巡检规则编号为"' + row.id + '"的数据项?',
      t('common.reminder')
    )
    const status =
      row.status === InfraJobStatusEnum.STOP ? InfraJobStatusEnum.NORMAL : InfraJobStatusEnum.STOP
    await CheckRuleApi.updateCheckRuleStatus(row.id, status)
    message.success(text + '成功')
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === InfraJobStatusEnum.NORMAL ? InfraJobStatusEnum.NORMAL : InfraJobStatusEnum.STOP
  }
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
    await CheckRuleApi.deleteCheckRule(id)
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
    const data = await CheckRuleApi.exportCheckRule(queryParams)
    download.excel(data, '巡检规则.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/**
 * 绑定设备操作
 */
// 打开设备选择弹窗
const deviceInfoHelperRef = ref()
const currRule = ref()
const openDeviceInfoHelperDialog = (job: JobVO) => {
  currRule.value = job
  const jsonObject = JSON.parse(job.handlerParam);
  deviceInfoHelperRef.value.open(jsonObject.deviceIds)
}
// 绑定设备
const handleBindDevice = async (val) => {
  const user = wsCache.get(CACHE_KEY.USER).user
  const handlerParam = {
    userId: user.id,
    deptId: user.deptId,
    deviceIds: val.map(item => item.id)
  }
  const formData: CheckRuleVO = {
    id: currRule.value.id,
    handlerParam: JSON.stringify(handlerParam),
  }
  await CheckRuleApi.checkRuleBindDeviceInfo(formData)
  await getList()
  message.success("绑定设备成功！")
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
