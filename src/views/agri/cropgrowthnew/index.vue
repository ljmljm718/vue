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
      <el-form-item label="名称" prop="cropName">
        <el-input
          v-model="queryParams.cropName"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品类" prop="cropId">
        <el-select v-model="queryParams.cropId" clearable placeholder="请选择品类" class="!w-240px">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="品种" prop="cropName">
        <el-select v-model="queryParams.cropName" clearable placeholder="请选择品种" class="!w-240px">
          <el-option
            v-for="item in listVarietyManagementVO.list"
            :key="item.varietyName"
            :label="item.varietyName"
            :value="item.varietyName"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agri:crop-growth-new:create']"
        >
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agri:crop-growth-new:export']"
        >
          导出
        </el-button>
      </el-form-item>
    </div>

  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="品种名称" align="center" prop="cropName"/>
      <el-table-column label="品类名称" align="center" prop="cropType"/>
      <!--      <el-table-column label="品种编号" align="center" prop="cropCode" />-->
      <!--      <el-table-column label="品类编号" align="center" prop="cropId" />-->
      <!--      <el-table-column label="图片" align="center" prop="imgId" />-->
      <el-table-column label="图片" align="center" prop="imgId">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.imgId"
            :preview-src-list="[row.imgId]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="生长期" align="center" prop="growth"/>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="180px"
      />

      <el-table-column label="环境条件" align="center" prop="envCondition"/>
      <el-table-column label="生长地点" align="center" prop="growSite"/>
      <el-table-column label="周期（/天）" align="center" prop="cycle"/>
      <el-table-column label="特点" align="center" prop="feature"/>

      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        align="center"-->
      <!--        prop="createTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:crop-growth-new:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:crop-growth-new:delete']"
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
  <CropGrowthNewForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import {CropGrowthNewApi, CropGrowthNewVO} from '@/api/agri/cropgrowthnew'
import CropGrowthNewForm from './CropGrowthNewForm.vue'
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {VarietyManagementApi, VarietyManagementVO} from "@/api/agriculture/varietymanagement";

/** 作物生长周期 列表 */
defineOptions({name: 'CropGrowthNew'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CropGrowthNewVO[]>([]) // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const listVarietyManagementVO = ref<VarietyManagementVO[]>([]) // 品种列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  growth: undefined,
  feature: undefined,
  remark: undefined,
  createTime: [],
  startTime: [],
  endTime: [],
  cropId: undefined,
  envCondition: undefined,
  growSite: undefined,
  cycle: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const CategoryManagementQueryParams = reactive({})
const VarietyManagementVOQueryParams = reactive({})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CropGrowthNewApi.getCropGrowthNewPage(queryParams)
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams)
    listVarietyManagementVO.value =await VarietyManagementApi.getVarietyManagementPage(CategoryManagementQueryParams)
    console.log(listVarietyManagementVO.value)
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
    await CropGrowthNewApi.deleteCropGrowthNew(id)
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
    const data = await CropGrowthNewApi.exportCropGrowthNew(queryParams)
    download.excel(data, '作物生长周期.xls')
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
