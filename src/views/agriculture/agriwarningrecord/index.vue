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
      <el-form-item label="设备类型" prop="deviceType">
        <el-select
          v-model="queryParams.deviceType"
          placeholder="请选择设备类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="预警类型" prop="warnType">
        <el-select
          v-model="queryParams.warnType"
          placeholder="请选择预警类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预警状态" prop="warnStatus">
        <el-select
          v-model="queryParams.warnStatus"
          placeholder="请选择预警状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预警时间" prop="warnTime">
        <el-date-picker
          v-model="queryParams.warnTime"
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
          v-hasPermi="['agriculture:agri-warning-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:agri-warning-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="主键" align="center" prop="id" />-->
<!--      <el-table-column label="园区编号" align="center" prop="parkCode" />-->
<!--      <el-table-column label="地块编号" align="center" prop="plotCode" />-->
      <el-table-column label="设备编号" align="center" prop="deviceCode" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备类型" align="center" prop="deviceType" />
      <el-table-column label="预警类型" align="center" prop="warnType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="scope.row.warnType" />
        </template>
      </el-table-column>
      <el-table-column label="预警标题" align="center" prop="warnTitle" />
      <el-table-column label="预警信息" align="center" prop="warnInfo" />
      <el-table-column label="当前值" align="center">
        <template #default="scope">
          <div> {{ scope.row["currentValue"] }}{{ scope.row["warnUnit"] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="阈值" align="center">
        <template #default="scope">
          <div> {{ scope.row["threshold"] }}{{ scope.row["warnUnit"] }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="预警时间"
        align="center"
        prop="warnTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="预警状态" align="center" prop="warnStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_STATUS" :value="scope.row.warnStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="处理时间"
        align="center"
        prop="dealTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="处理人" align="center" prop="dealPerson" />
<!--      <el-table-column label="处理人编号" align="center" prop="dealPersonId" />-->
      <el-table-column label="处理信息" align="center" prop="dealInfo" />
<!--      <el-table-column label="预警图片" align="center" prop="imgId" />-->
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:agri-warning-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:agri-warning-record:delete']"
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
  <AgriWarningRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AgriWarningRecordApi, AgriWarningRecordVO } from '@/api/agriculture/agriwarningrecord'
import AgriWarningRecordForm from './AgriWarningRecordForm.vue'

/** 预警记录 列表 */
defineOptions({ name: 'AgriWarningRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AgriWarningRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warnTime: [],
  warnStatus: undefined,
  deviceType: undefined,
  warnType: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AgriWarningRecordApi.getAgriWarningRecordPage(queryParams)
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
    await AgriWarningRecordApi.deleteAgriWarningRecord(id)
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
    const data = await AgriWarningRecordApi.exportAgriWarningRecord(queryParams)
    download.excel(data, '预警记录.xls')
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
