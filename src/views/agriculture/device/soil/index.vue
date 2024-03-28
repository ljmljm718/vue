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
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采集时间" prop="gatherTime">
        <el-date-picker
          v-model="queryParams.gatherTime"
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
          v-hasPermi="['agri:soil-moisture:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--          v-hasPermi="['agri:soil-moisture:export']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" width="60" align="center">
        <template v-slot="scope">
          <span>{{ scope.$index + (queryParams.pageNo - 1) * (queryParams.pageSize) + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编号" align="center" prop="deviceCode" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column
        label="采集时间"
        align="center"
        prop="gatherTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="土壤温度" align="center" prop="soilTemperature">
        <template v-slot="scope">
          <span>{{scope.row.soilTemperature}}℃</span>
        </template>
      </el-table-column>
      <el-table-column label="土壤湿度" align="center" prop="soilHumidity">
        <template v-slot="scope">
          <span>{{scope.row.soilTemperature}}%/RH</span>
        </template>
      </el-table-column>
      <el-table-column label="PH值" align="center" prop="soilPh" />
      <el-table-column label="EC值" align="center" prop="soilEc" />
      <el-table-column label="土壤深度" align="center" prop="soilDepth">
        <template v-slot="scope">
          <span>{{scope.row.soilDepth}}m</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id, scope.row.deviceCode, scope.row.deviceName)"
            v-hasPermi="['agri:soil-moisture:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:soil-moisture:delete']"
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
  <SoilMoistureForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { SoilMoistureApi, SoilMoistureVO } from '@/api/agriculture/soilmoisture'
import SoilMoistureForm from './SoilMoistureForm.vue'

/** 土壤墒情 列表 */
defineOptions({ name: 'SoilMoisture' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<SoilMoistureVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceCode: undefined,
  deviceName: undefined,
  gatherTime: [],
  soilTemperature: undefined,
  soilHumidity: undefined,
  soilPh: undefined,
  soilEc: undefined,
  soilDepth: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SoilMoistureApi.getSoilMoisturePage(queryParams)
    //const data = await SoilMoistureApi.getSoilMoisturePageJoin(queryParams)
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
const openForm = (type: string, id?: number, deviceCode?: string, deviceName?: string) => {
  formRef.value.open(type, id, deviceCode, deviceName)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SoilMoistureApi.deleteSoilMoisture(id)
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
    const data = await SoilMoistureApi.exportSoilMoisture(queryParams)
    download.excel(data, '土壤墒情.xls')
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
