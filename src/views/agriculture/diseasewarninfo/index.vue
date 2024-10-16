<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <!--    <el-form-->
    <!--      class="-mb-15px"-->
    <!--      :model="queryParams"-->
    <!--      ref="queryFormRef"-->
    <!--      :inline="true"-->
    <!--      label-width="68px"-->
    <!--    >-->
    <!--      <el-form-item label="监测类型" prop="warnType">-->
    <!--        <el-select-->
    <!--          v-model="queryParams.warnType"-->
    <!--          placeholder="请选择监测类型"-->
    <!--          clearable-->
    <!--          class="!w-240px"-->
    <!--        >-->
    <!--          <el-option label="请选择字典生成" value="" />-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="设备ID" prop="facilityId">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.facilityId"-->
    <!--          placeholder="请输入设备ID"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="品种ID" prop="breedId">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.breedId"-->
    <!--          placeholder="请输入品种ID"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="品种名称" prop="cropName">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.cropName"-->
    <!--          placeholder="请输入品种名称"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="病害虫种类" prop="diseaseType">-->
    <!--        <el-select-->
    <!--          v-model="queryParams.diseaseType"-->
    <!--          placeholder="请选择病害虫种类"-->
    <!--          clearable-->
    <!--          class="!w-240px"-->
    <!--        >-->
    <!--          <el-option label="请选择字典生成" value="" />-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="病害虫Id" prop="diseaseId">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.diseaseId"-->
    <!--          placeholder="请输入病害虫Id"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="阈值下限" prop="warnLowValue">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.warnLowValue"-->
    <!--          placeholder="请输入阈值下限"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="阈值上限" prop="warnHighValue">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.warnHighValue"-->
    <!--          placeholder="请输入阈值上限"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="单位" prop="warnUnit">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.warnUnit"-->
    <!--          placeholder="请输入单位"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="预警信息" prop="lowMsg">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.lowMsg"-->
    <!--          placeholder="请输入预警信息"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="监测周期" prop="monitorPeriod">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.monitorPeriod"-->
    <!--          placeholder="请输入监测周期"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="所属基地" prop="belongPark">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.belongPark"-->
    <!--          placeholder="请输入所属基地"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="所属地块" prop="belongPlot">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.belongPlot"-->
    <!--          placeholder="请输入所属地块"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="基地名称" prop="parkName">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.parkName"-->
    <!--          placeholder="请输入基地名称"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="地块名称" prop="plotName">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.plotName"-->
    <!--          placeholder="请输入地块名称"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="预留1" prop="reservedOne">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.reservedOne"-->
    <!--          placeholder="请输入预留1"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="预留2" prop="reservedTwo">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.reservedTwo"-->
    <!--          placeholder="请输入预留2"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="预留3" prop="reservedThree">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.reservedThree"-->
    <!--          placeholder="请输入预留3"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="预留4" prop="reservedFour">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.reservedFour"-->
    <!--          placeholder="请输入预留4"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="预留5" prop="reservedFive">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.reservedFive"-->
    <!--          placeholder="请输入预留5"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="备注" prop="remark">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.remark"-->
    <!--          placeholder="请输入备注"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="创建时间" prop="createTime">-->
    <!--        <el-date-picker-->
    <!--          v-model="queryParams.createTime"-->
    <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
    <!--          type="daterange"-->
    <!--          start-placeholder="开始日期"-->
    <!--          end-placeholder="结束日期"-->
    <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
    <!--          class="!w-240px"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>-->
    <!--        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          plain-->
    <!--          @click="openForm('create')"-->
    <!--          v-hasPermi="['agriculture:disease-warn-info:create']"-->
    <!--        >-->
    <!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
    <!--        </el-button>-->
    <!--        <el-button-->
    <!--          type="success"-->
    <!--          plain-->
    <!--          @click="handleExport"-->
    <!--          :loading="exportLoading"-->
    <!--          v-hasPermi="['agriculture:disease-warn-info:export']"-->
    <!--        >-->
    <!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
    <!--        </el-button>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id"/>-->
      <!--      <el-table-column label="监测类型" align="center" prop="warnType"/>-->
      <el-table-column label="设备" align="center" prop="facilityId"/>
      <el-table-column label="监测作物" align="center" prop="breedId"/>
      <el-table-column label="地块名称" align="center" prop="plotName"/>
      <el-table-column label="预警信息" align="center" prop="lowMsg"/>
      <el-table-column label="监测类型" align="center" prop="warnType"/>
      <el-table-column label="病虫害等级" align="center" prop="reservedOne"/>
      <el-table-column
        label="预警时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--      <el-table-column label="品种名称" align="center" prop="cropName"/>-->
      <!--      <el-table-column label="病害虫种类" align="center" prop="diseaseType"/>-->
      <!--      <el-table-column label="病害虫Id" align="center" prop="diseaseId"/>-->
      <el-table-column label="阈值下限" align="center" prop="warnLowValue"/>
      <el-table-column label="阈值上限" align="center" prop="warnHighValue"/>
      <el-table-column label="单位" align="center" prop="warnUnit"/>
      <el-table-column label="监测周期" align="center" prop="monitorPeriod"/>
      <!--      <el-table-column label="所属基地" align="center" prop="belongPark"/>-->
      <!--      <el-table-column label="所属地块" align="center" prop="belongPlot"/>-->
      <!--      <el-table-column label="基地名称" align="center" prop="parkName"/>-->


      <!--      <el-table-column label="预留2" align="center" prop="reservedTwo"/>-->
      <!--      <el-table-column label="预留3" align="center" prop="reservedThree"/>-->
      <!--      <el-table-column label="预留4" align="center" prop="reservedFour"/>-->
      <!--      <el-table-column label="预留5" align="center" prop="reservedFive"/>-->
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:disease-warn-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:disease-warn-info:delete']"
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
  <DiseaseWarnInfoForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {DiseaseWarnInfoApi, DiseaseWarnInfoVO} from '@/api/agriculture/diseasewarninfo'
import DiseaseWarnInfoForm from './DiseaseWarnInfoForm.vue'

/** 病虫害预警记录 列表 */
defineOptions({name: 'DiseaseWarnInfo'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DiseaseWarnInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warnType: undefined,
  facilityId: undefined,
  breedId: undefined,
  cropName: undefined,
  diseaseType: undefined,
  diseaseId: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  monitorPeriod: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  parkName: undefined,
  plotName: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined,
  reservedFive: undefined,
  remark: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DiseaseWarnInfoApi.getDiseaseWarnInfoPage(queryParams)
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
    await DiseaseWarnInfoApi.deleteDiseaseWarnInfo(id)
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
    const data = await DiseaseWarnInfoApi.exportDiseaseWarnInfo(queryParams)
    download.excel(data, '病虫害预警记录.xls')
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
