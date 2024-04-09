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
      <el-form-item label="设备编码" prop="equipmentCode">
        <el-input
          v-model="queryParams.equipmentCode"
          placeholder="请输入设备编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="烘干方式" prop="dryingMethod">
        <!-- <el-input
          v-model="queryParams.dryingMethod"
          placeholder="请输入烘干方式"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-select
          v-model="queryParams.dryingMethod"
          placeholder="请选择烘干方式"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.DRYING_METHOD)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="加热时间" prop="heatingTime">
        <el-input
          v-model="queryParams.heatingTime"
          placeholder="请输入加热时间"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="烘干温度" prop="dryingTemperature">
        <el-input
          v-model="queryParams.dryingTemperature"
          placeholder="请输入烘干温度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设备转速" prop="equipmentSpeed">
        <el-input
          v-model="queryParams.equipmentSpeed"
          placeholder="请输入设备转速"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="适宜作物" prop="suitableCrops">
        <el-input
          v-model="queryParams.suitableCrops"
          placeholder="请输入适宜作物"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="yyRemarks">
        <el-input
          v-model="queryParams.yyRemarks"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input
          v-model="queryParams.reserveOne"
          placeholder="请输入备用一"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input
          v-model="queryParams.reserveTwo"
          placeholder="请输入备用二"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input
          v-model="queryParams.reserveThree"
          placeholder="请输入备用三"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
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
          v-hasPermi="['baibu:drying-process-management:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['baibu:drying-process-management:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="设备编码" align="center" prop="equipmentCode" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="烘干方式" align="center" prop="dryingMethod" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DRYING_METHOD" :value="scope.row.dryingMethod"/>
        </template>
      </el-table-column>
      <el-table-column label="加热时间(分钟)" align="center" prop="heatingTime" />
      <el-table-column label="烘干温度(℃)" align="center" prop="dryingTemperature" />
      <el-table-column label="设备转速(r/min)" align="center" prop="equipmentSpeed" />
      <el-table-column label="适宜作物" align="center" prop="suitableCrops" />
      <el-table-column label="备注" align="center" prop="yyRemarks" />
      <!-- <el-table-column label="备用一" align="center" prop="reserveOne" />
      <el-table-column label="备用二" align="center" prop="reserveTwo" />
      <el-table-column label="备用三" align="center" prop="reserveThree" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['baibu:drying-process-management:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['baibu:drying-process-management:delete']"
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
  <DryingProcessManagementForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import {DICT_TYPE, getStrDictOptions} from '@/utils/dict'
import { DryingProcessManagementApi, DryingProcessManagementVO } from "@/api/agriculture/baibu/dryingprocessmanagement"
import DryingProcessManagementForm from "./DryingProcessManagementForm.vue"
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'




/** 烘干工艺管理 列表 */
defineOptions({ name: 'DryingProcessManagement' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DryingProcessManagementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentCode: undefined,
  equipmentName: undefined,
  dryingMethod: undefined,
  heatingTime: undefined,
  dryingTemperature: undefined,
  equipmentSpeed: undefined,
  suitableCrops: undefined,
  yyRemarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DryingProcessManagementApi.getDryingProcessManagementPage(queryParams)
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
    await DryingProcessManagementApi.deleteDryingProcessManagement(id)
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
    const data = await DryingProcessManagementApi.exportDryingProcessManagement(queryParams)
    download.excel(data, '烘干工艺管理.xls')
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