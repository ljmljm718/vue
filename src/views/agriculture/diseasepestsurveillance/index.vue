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
      <el-form-item label="设备" prop="deviceName">
        <el-input
v-model="queryParams.deviceName" placeholder="请选择设备" disabled
                  class="!w-240px">
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="监测物种" prop="monitorSpecies">
        <el-select
v-model="queryParams.monitorSpecies" clearable placeholder="请选择监测物种"
                   class="!w-240px">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="监测类型" prop="monitorType">
        <el-select
          v-model="queryParams.monitorType"
          placeholder="请选择监测类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="监测时间" prop="monitorTime">
        <el-date-picker
          v-model="queryParams.monitorTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="监测抓图" prop="monitorPicture">
        <el-input
          v-model="queryParams.monitorPicture"
          placeholder="请输入监测抓图"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="地块" prop="belongPark">
        <el-select class="!w-240px" v-model="queryParams.belongPark">
          <el-option
            v-for="(item, index) in plotList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="识别状态" prop="identifyStatus">
        <el-select v-model="queryParams.identifyStatus" class="!w-240px" clearable placeholder="请选择状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_IDENTIFY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="设备状态" prop="deviceStatus">
        <el-select
          v-model="queryParams.deviceStatus"
          placeholder="请选择设备状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
      <div style="margin-top: 20px;margin-left: 30px;height: 30px">
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:disease-pest-surveillance:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:disease-pest-surveillance:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="设备" align="center" prop="device" />
      <el-table-column label="监测物种" align="center" prop="monitorSpecies" />
      <el-table-column label="监测类型" align="center" prop="monitorType" />
      <el-table-column
        label="监测时间"
        align="center"
        prop="monitorTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="监测抓图" align="center" prop="monitorPicture" >
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.monitorPicture"
            :preview-src-list="[row.monitorPicture]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="地块" align="center" prop="belongPark" />
      <el-table-column label="识别状态" align="center" prop="identifyStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_IDENTIFY_STATUS" :value="scope.row.identifyStatus" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="设备状态" align="center" prop="deviceStatus" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_DEVICE_STATUS" :value="scope.row.deviceStatus" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:disease-pest-surveillance:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:disease-pest-surveillance:delete']"
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
  <DiseasePestSurveillanceForm ref="formRef" @success="getList" />
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { DiseasePestSurveillanceApi, DiseasePestSurveillanceVO } from '@/api/agriculture/diseasepestsurveillance'
import DiseasePestSurveillanceForm from './DiseasePestSurveillanceForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {
  CategoryManagementApi,
  CategoryManagementVO,
  allDataCacheManager
} from "@/api/agriculture/categorymanagement";
import {page, parkPage} from '@/views/agriculture/IntelligentStatistics/api.ts'
import {EquipmentDataVO} from "@/api/agriculture/equipmentdata";
import AgriculturalBaseList from "@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue";

/** 病虫害监测 列表 */
defineOptions({ name: 'DiseasePestSurveillance' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DiseasePestSurveillanceVO[]>([]) // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  device: undefined,
  deviceName: undefined,
  monitorSpecies: undefined,
  monitorType: undefined,
  monitorTime: [],
  monitorPicture: undefined,
  belongPark: undefined,
  identifyStatus: undefined,
  deviceStatus: undefined,
  createTime: [],
})
const CategoryManagementQueryParams = reactive({})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}
const handlePurchaseOrderChange = async (order: EquipmentDataVO) => {
  //赋值
  queryParams.device = order[0].id
  queryParams.deviceName = order[0].deviceName
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams)
    const data = await DiseasePestSurveillanceApi.getDiseasePestSurveillancePage(queryParams)
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
  queryParams.deviceName = undefined
  queryParams.device = undefined
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
    await DiseasePestSurveillanceApi.deleteDiseasePestSurveillance(id)
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
    const data = await DiseasePestSurveillanceApi.exportDiseasePestSurveillance(queryParams)
    download.excel(data, '病虫害监测.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

//获取基地
const baseList = ref([])
const getPage = async () => {
  let res = await page()
  baseList.value = res.list
  // queryParams.belongPark = res.list[0].id
  getParkPage({parkId: res.list.id})
}
getPage()
//获取地块
const plotList = ref([])
const getParkPage = async (parkId) => {
  let res = await parkPage(parkId)
  plotList.value = res.list
}
</script>