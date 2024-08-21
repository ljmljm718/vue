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
      <el-form-item label="规则类型" prop="warnType">
        <el-select
          v-model="queryParams.warnType"
          placeholder="请选择规则类型"
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
      <el-form-item label="预警等级" prop="warnLevel">
        <el-select
          v-model="queryParams.warnLevel"
          placeholder="请选择预警等级"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_WARN_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
      <div style="margin-top: 20px;margin-left: 30px;height: 30px">
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:agri-warning-rule:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:agri-warning-rule:export']"
          >
            <Icon icon="ep:download" class="mr-5px"/>
            导出
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="规则标题" align="center" prop="ruleTitle"/>
      <el-table-column label="规则类型" align="center" prop="warnType" width="150">
<!--        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="scope.row.warnType"/>
        </template>-->
      </el-table-column>
      <el-table-column label="预警等级" align="center" prop="warnLevel" width="150">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_WARN_LEVEL" :value="scope.row.warnLevel"/>
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
      <el-table-column label="阙值" align="center" width="120">
        <template #default="scope">
          <div> {{ scope.row["thresholdValue"] }}{{ scope.row["warnUnit"] }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="低位预警消息" align="center" prop="lowMsg" /> -->
      <el-table-column label="预警消息" align="center" prop="lowMsg"/>
      <!-- <el-table-column label="高位预警消息" align="center" prop="highMsg" /> -->
      <!--      <el-table-column label="责任人编号" align="center" prop="responsiblePersonId" />-->
      <el-table-column label="责任人" align="center" prop="responsiblePerson" width="110"/>
      <!--      <el-table-column label="备注" align="center" prop="remark" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="生效状态" align="center" prop="effectiveStatus" width="110">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_RULE_STATUS" :value="scope.row.effectiveStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="160">
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
            v-hasPermi="['agriculture:agri-warning-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:agri-warning-rule:delete']"
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
  <AgriWarningRuleForm ref="formRef" @success="getList"/>

  <!-- 绑定设备列表 -->
  <AgriWarnRuleBindDevice ref="warnRuleBindDeviceRef" :warnRuleId="warnRuleId"
                          :deviceId="deviceId"/>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {AgriWarningRuleApi, AgriWarningRuleVO} from '@/api/agriculture/agriwarningrule'
import AgriWarningRuleForm from './AgriWarningRuleForm.vue'
import {AgriWarningRuleDeviceApi} from "@/api/agriculture/agriwarningruledevice";
import AgriWarnRuleBindDevice
  from "@/views/agriculture/agriwarningrule/component/AgriWarnRuleBindDevice.vue";

/** 鲁渝协作预警规则 列表 */
defineOptions({name: 'AgriWarningRule'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AgriWarningRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  highMsg: undefined,
  responsiblePersonId: undefined,
  responsiblePerson: undefined,
  remark: undefined,
  createTime: [],
  warnType: undefined,
  effectiveStatus: undefined,
  ruleTitle: undefined,
  warnLevel: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AgriWarningRuleApi.getAgriWarningRulePage(queryParams)
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
    await AgriWarningRuleApi.deleteAgriWarningRule(id)
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
    const data = await AgriWarningRuleApi.exportAgriWarningRule(queryParams)
    download.excel(data, '鲁渝协作预警规则.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
/** 绑定设备操作 */
const deviceId = ref([]) // 已绑定的设备id
const warnRuleId = ref()
const warnRuleBindDeviceRef = ref()
const bindDevice = async (id: number) => {
  try {
    console.log("id", id)
    const data = await AgriWarningRuleDeviceApi.selectAgriDeviceByWarnRuleId(String(id))
    console.log("data", data)
    deviceId.value = data.map(item => (item.deviceId))
    warnRuleId.value = id
    warnRuleBindDeviceRef.value.open()
  } catch {
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
