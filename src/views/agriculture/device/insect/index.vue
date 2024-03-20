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
      <el-form-item label="设备id" prop="equId">
        <el-input
          v-model="queryParams.equId"
          placeholder="请输入设备id"
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
      <el-form-item label="虫害数量" prop="insectPestNumber">
        <el-input
          v-model="queryParams.insectPestNumber"
          placeholder="请输入虫害数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="虫害种类" prop="insectPestKind">
        <el-input
          v-model="queryParams.insectPestKind"
          placeholder="请输入虫害种类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="杀虫仓温度" prop="insectTemperature">
        <el-input
          v-model="queryParams.insectTemperature"
          placeholder="请输入杀虫仓温度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="烘干仓温度" prop="dryingTemperature">
        <el-input
          v-model="queryParams.dryingTemperature"
          placeholder="请输入烘干仓温度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="诱虫灯状态" prop="insectLampStatus">
        <el-select
          v-model="queryParams.insectLampStatus"
          placeholder="请选择诱虫灯状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="杀虫灯状态" prop="killInsectStatus">
        <el-select
          v-model="queryParams.killInsectStatus"
          placeholder="请选择杀虫灯状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="杀虫灯挡板状态" prop="killInsectBaffleStatus">
        <el-select
          v-model="queryParams.killInsectBaffleStatus"
          placeholder="请选择杀虫灯挡板状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="摄像头状态" prop="insectVideo">
        <el-select
          v-model="queryParams.insectVideo"
          placeholder="请选择摄像头状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
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
          v-hasPermi="['agri:insect-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agri:insect-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="设备id" align="center" prop="equId" />
      <el-table-column
        label="采集时间"
        align="center"
        prop="gatherTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="虫害数量" align="center" prop="insectPestNumber" />
      <el-table-column label="虫害种类" align="center" prop="insectPestKind" />
      <el-table-column label="杀虫仓温度" align="center" prop="insectTemperature" />
      <el-table-column label="烘干仓温度" align="center" prop="dryingTemperature" />
      <el-table-column label="诱虫灯状态" align="center" prop="insectLampStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.insectLampStatus" />
        </template>
      </el-table-column>
      <el-table-column label="杀虫灯状态" align="center" prop="killInsectStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.killInsectStatus" />
        </template>
      </el-table-column>
      <el-table-column label="杀虫灯挡板状态" align="center" prop="killInsectBaffleStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.killInsectBaffleStatus" />
        </template>
      </el-table-column>
      <el-table-column label="摄像头状态" align="center" prop="insectVideo">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.insectVideo" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:insect-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:insect-info:delete']"
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
  <InsectInfoForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { InsectInfoApi, InsectInfoVO } from '@/api/agriculture/insectinfo'
import InsectInfoForm from './InsectInfoForm.vue'

/** 虫情信息 列表 */
defineOptions({ name: 'InsectInfo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InsectInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equId: undefined,
  gatherTime: [],
  insectPestNumber: undefined,
  insectPestKind: undefined,
  insectTemperature: undefined,
  dryingTemperature: undefined,
  insectLampStatus: undefined,
  killInsectStatus: undefined,
  killInsectBaffleStatus: undefined,
  insectVideo: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InsectInfoApi.getInsectInfoPage(queryParams)
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
    await InsectInfoApi.deleteInsectInfo(id)
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
    const data = await InsectInfoApi.exportInsectInfo(queryParams)
    download.excel(data, '虫情信息.xls')
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
