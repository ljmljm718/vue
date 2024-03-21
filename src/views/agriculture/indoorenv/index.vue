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
      <el-form-item label="设备编号" prop="deviceId">
        <el-input
            v-model="queryParams.deviceId"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="数据上报时间" prop="reportDate" label-width="100">
        <el-date-picker
            v-model="queryParams.reportDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="设备类型" prop="deviceType">-->
<!--        <el-select-->
<!--            v-model="queryParams.deviceType"-->
<!--            placeholder="请选择设备类型"-->
<!--            clearable-->
<!--            class="!w-240px"-->
<!--        >-->
<!--          <el-option-->
<!--              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_TYPE)"-->
<!--              :key="dict.value"-->
<!--              :label="dict.label"-->
<!--              :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:environment-data:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:environment-data:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备编号" align="center" prop="deviceId" />
<!--      <el-table-column label="设备类型" align="center" prop="deviceType">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_TYPE" :value="scope.row.deviceType" />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="温度(℃)" align="center" prop="temperature" />
      <el-table-column label="湿度(%/RH)" align="center" prop="humidity" />
      <el-table-column label="光照(Lux)" align="center" prop="lighting" />
      <el-table-column label="大气压力(kPa)" align="center" prop="airPressure" />
      <el-table-column label="降雨量(mm)" align="center" prop="rainfall" />
      <el-table-column label="二氧化碳浓度(mmol/L)" align="center" prop="co2Density" />
      <el-table-column
          label="数据上报时间"
          align="center"
          prop="reportDate"
          :formatter="dateFormatter"
          width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agriculture:environment-data:update']"
          >
            编辑
          </el-button>
          <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:environment-data:delete']"
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
  <EnvironmentDataForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { EnvironmentDataApi, EnvironmentDataVO } from '@/api/agriculture/environmentdata'
import EnvironmentDataForm from './EnvironmentDataForm.vue'

/** 环境数据 列表 */
defineOptions({ name: 'InDoorEnvironmentData' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<EnvironmentDataVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceId: undefined,
  reportDate: [],
  deptId: undefined,
  userId: undefined,
  deviceType: 'indoor',
  airPressure: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await EnvironmentDataApi.getEnvironmentDataPage(queryParams)
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
    await EnvironmentDataApi.deleteEnvironmentData(id)
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
    const data = await EnvironmentDataApi.exportEnvironmentData(queryParams)
    download.excel(data, '环境数据.xls')
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
