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
      <el-form-item label="规则类型" prop="ruleType">
        <el-select
          v-model="queryParams.ruleType"
          placeholder="请选择规则类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_RULE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="责任人编号" prop="responsiblePersonId">-->
<!--        <el-input-->
<!--          v-model="queryParams.responsiblePersonId"-->
<!--          placeholder="请输入责任人编号"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="责任人" prop="responsiblePerson">
        <el-input
          v-model="queryParams.responsiblePerson"
          placeholder="请输入责任人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生效状态" prop="effectiveStatus">
        <el-select
          v-model="queryParams.effectiveStatus"
          placeholder="请选择生效状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_RULE_STATUS)"
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
          v-hasPermi="['kaizhou:warning-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['kaizhou:warning-rule:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="规则编号" align="center" prop="id" width="200"/>-->
      <el-table-column label="规则类型" align="center" prop="ruleType" width="200">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_RULE_TYPE" :value="scope.row.ruleType" />
        </template>
      </el-table-column>
      <el-table-column label="预警下限" align="center" width="120">
        <template #default="scope">
          <div> {{ scope.row["warnLowValue"] }}{{ scope.row["warnUnit"] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="预警上限" align="center" width="120">
        <template #default="scope">
          <div> {{ scope.row["warnHighValue"] }}{{ scope.row["warnUnit"] }}</div>
        </template>
      </el-table-column>
<!--      <el-table-column label="单位" align="center" prop="warnUnit" />-->
      <el-table-column label="低位预警消息模板" align="center" prop="lowMsgTemplate" />
      <el-table-column label="高位预警消息模板" align="center" prop="highMsgTemplate" />
<!--      <el-table-column label="责任人编号" align="center" prop="responsiblePersonId" />-->
      <el-table-column label="责任人" align="center" prop="responsiblePerson" width="150"/>
      <el-table-column label="生效状态" align="center" width="130">
        <template #default="scope">
          <el-switch
            v-model="scope.row.effectiveStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="handleChangeEffectiveStatus(scope.row)"
          />
        </template>
      </el-table-column>
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
            link
            type="success"
            @click="bindDevice(scope.row.id)"
          >
            绑定设备
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['kaizhou:warning-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:warning-rule:delete']"
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
  <WarningRuleForm ref="formRef" @success="getList" />

  <!-- 绑定设备列表 -->
  <WarnRuleBindDevice ref="warnRuleBindDeviceRef" :warnRuleId="warnRuleId" :deviceId="deviceId"/>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { WarningRuleApi, WarningRuleVO } from '@/api/kaizhou/warningrule'
import WarningRuleForm from './WarningRuleForm.vue'
import WarnRuleBindDevice from "@/views/kaizhou/warningrule/WarnRuleBindDevice.vue";
import {WarningRuleDeviceApi} from "@/api/kaizhou/warningruledevice";

/** 预警规则 列表 */
defineOptions({ name: 'WarningRule' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<WarningRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  ruleType: undefined,
  responsiblePersonId: undefined,
  responsiblePerson: undefined,
  effectiveStatus: undefined,
  createTime: [],
})
const formData = ref({
  id: undefined,
  ruleType: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsgTemplateId: undefined,
  highMsgTemplateId: undefined,
  responsiblePersonId: undefined,
  responsiblePerson: undefined,
  effectiveStatus: undefined,
  lowMsgTemplate: undefined,
  highMsgTemplate: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarningRuleApi.getWarningRulePage(queryParams)
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

const deviceId = ref([]) // 已绑定的设备id
const warnRuleId = ref()
const warnRuleBindDeviceRef = ref()
/** 绑定设备操作 */
const bindDevice = async (id: number) => {
  try{
    console.log("id",id)
    const data = await WarningRuleDeviceApi.selectDeviceByWarnRuleId(String(id))
    console.log("data", data)
    deviceId.value = data.map(item => (item.deviceId))
    warnRuleId.value = id
    warnRuleBindDeviceRef.value.open()
  } catch{
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await WarningRuleApi.deleteWarningRule(id)
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
    const data = await WarningRuleApi.exportWarningRule(queryParams)
    download.excel(data, '预警规则.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 切换生效状态按钮 */
const handleChangeEffectiveStatus = async (row) => {
  formData.value = await WarningRuleApi.getWarningRule(row.id)
  const data = formData.value as unknown as WarningRuleVO
  data.effectiveStatus = row.effectiveStatus
  await WarningRuleApi.updateWarningRule(data)
  message.success(t('common.updateSuccess'))
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
