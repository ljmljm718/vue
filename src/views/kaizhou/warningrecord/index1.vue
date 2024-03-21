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
      <el-form-item label="设备编号" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
      <el-form-item label="预警类型" prop="warnType">
        <el-select
          v-model="queryParams.warnType"
          placeholder="请选择预警类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_TYPE)"
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          @click="openForm('create')"-->
<!--          v-hasPermi="['kaizhou:warning-record:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['kaizhou:warning-record:export']"
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
      <el-table-column label="基地名称" align="center" prop="parkName" width="150"/>
      <el-table-column label="地块名称" align="center" prop="plotName" width="150"/>
      <el-table-column label="地块编号" align="center" prop="plotCode" width="200"/>
      <el-table-column label="设备编号" align="center" prop="deviceCode" />
      <el-table-column label="设备名称" align="center" prop="deviceName" width="150"/>
      <el-table-column label="预警类型" align="center" prop="warnType" width="140">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_TYPE" :value="scope.row.warnType" />
        </template>
      </el-table-column>
      <el-table-column label="预警标题" align="center" prop="warnTitle" width="140"/>
      <el-table-column label="预警信息" align="center" prop="warnInfo" width="320"/>
      <el-table-column label="当前值" align="center" prop="currentValue" width="100">
        <template #default="scope">
          <div> {{ scope.row["currentValue"] }}{{ scope.row["unit"] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="阈值" align="center" prop="threshold" width="100">
        <template #default="scope">
          <div> {{ scope.row["threshold"] }}{{ scope.row["unit"] }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="预警时间"
        align="center"
        prop="warnTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="预警状态" align="center" prop="warnStatus" width="110">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_STATUS" :value="scope.row.warnStatus" />
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center" prop="dealPerson" width="110"/>
      <el-table-column
        label="处理时间"
        align="center"
        prop="dealTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="处理信息" align="center" prop="dealInfo" width="170"/>
<!--      <el-table-column label="设备类型" align="center" prop="deviceType">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_TYPE" :value="scope.row.deviceType" />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" width="170" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="success"
            @click="handleDeal(scope.row.id)"
            v-show="scope.row.warnStatus === '0'"
          >
            处理
          </el-button>
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="openForm('update', scope.row.id)"-->
<!--            v-hasPermi="['kaizhou:warning-record:update']"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:warning-record:delete']"
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
  <WarningRecordForm ref="formRef" @success="getList" />

  <!-- 处理预警信息对话框 -->
  <el-dialog :title="title" v-model="openDeal" :rules="dealDataRules" width="40%" append-to-body :close-on-click-modal="false">
    <el-form :model="dealData" size="small" label-width="68px">
      <el-form-item label="处理人" prop="dealPerson">
        <el-input v-model="dealData.dealPerson" placeholder="请输入处理人" />
      </el-form-item>
      <el-form-item label="处理信息" prop="dealInfo">
        <el-input v-model="dealData.dealInfo" type="textarea" placeholder="请填写处理信息" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitDialog" type="primary">确 定</el-button>
      <el-button @click="openDeal = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { WarningRecordApi, WarningRecordVO } from '@/api/kaizhou/warningrecord'
import WarningRecordForm from './WarningRecordForm.vue'
import { useRouter,useRoute } from "vue-router";
/** 预警记录 列表 */
defineOptions({ name: 'EquWarningRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<WarningRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceCode: undefined,
  warnTime: [],
  warnStatus: '',
  warnType: '',
  id: ''
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const { currentRoute } = useRouter()
const route = currentRoute.value

onMounted(()=>{
  if (route.query.warnStatus)
    queryParams.warnStatus = route.query.warnStatus as string
  if (route.query.id)
    queryParams.id = route.query.id as string
})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarningRecordApi.getWarningRecordPageWithParkName(queryParams)
    list.value = data.list
    console.log("list.value", list.value)
    console.log("data.list.value", data.list)
    total.value = data.total
  } finally {
    loading.value = false
  }
}
let route2=useRoute()
let location=route2.query
if(location.id){
  queryParams.id=location.id
  getList()
}else{
  getList()
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

const dealData = ref({
  id: undefined,
  parkCode: undefined,
  plotCode: undefined,
  deviceCode: undefined,
  warnInfo: undefined,
  warnTitle: undefined,
  currentValue: undefined,
  unit: undefined,
  threshold: undefined,
  warnTime: undefined,
  warnStatus: undefined,
  dealTime: undefined,
  dealPerson: undefined,
  dealPersonId: undefined,
  dealInfo: undefined,
  deviceType: undefined,
} as any)
const dealDataRules = reactive({
  dealPerson: [{ required: true, message: '处理人不能为空', trigger: 'blur' }],
  dealInfo: [{ required: true, message: '处理信息不能为空', trigger: 'blur' }],
})
const title = ref('')
const openDeal = ref(false)
/** 处理按钮操作 */
const handleDeal = async (id: number) => {
  openDeal.value = true
  title.value = '预警处理'
  resetForm()
  // 修改时，设置数据
  console.log("ID", id)
  if (id) {
    try {
      dealData.value = await WarningRecordApi.getWarningRecord(id)
      console.log("111", dealData.value)
    } finally {
    }
  }
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitDialog = async () => {
  try {
    console.log("dealData", dealData.value)
    dealData.value.dealTime = new Date().valueOf()
    dealData.value.warnStatus = '1'
    const data = dealData.value as unknown as WarningRecordVO
    await WarningRecordApi.updateWarningRecord(data)
    message.success(t('common.updateSuccess'))
    openDeal.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    resetQuery()
  }
}

/** 重置表单 */
const resetForm = () => {
  dealData.value = {
    id: undefined,
    parkCode: undefined,
    plotCode: undefined,
    deviceCode: undefined,
    warnInfo: undefined,
    warnTitle: undefined,
    currentValue: undefined,
    unit: undefined,
    threshold: undefined,
    warnTime: undefined,
    warnStatus: undefined,
    dealTime: undefined,
    dealPerson: undefined,
    dealPersonId: undefined,
    dealInfo: undefined,
    deviceType: undefined,
  }
  // formRef.value?.resetFields()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await WarningRecordApi.deleteWarningRecord(id)
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
    const data = await WarningRecordApi.exportWarningRecord(queryParams)
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
