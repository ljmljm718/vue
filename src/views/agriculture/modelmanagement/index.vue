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
      <el-form-item label="模型名称" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入模型名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="模型类型" prop="modelType">
        <el-select
          v-model="queryParams.modelType"
          placeholder="请选择模型类型"
          clearable
          class="!w-240px"
        >
          <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.GROWTH_MODEL_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联品种" prop="belongVarietyId">
        <el-select
          v-model="queryParams.belongVarietyId"
          placeholder="请选择关联品种"
          clearable
          @change="handleVarietyChange"
          class="!w-240px"
        >
          <el-option
            v-for="dict in listVarietyManagement"
            :key="dict.id"
            :label="dict.varietyName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联品类" prop="belongCategoryId">
        <el-select
          v-model="queryParams.belongCategoryId"
          placeholder="请选择品类或者选择品种后自动填入"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in listCategoryManagement"
            :key="dict.id"
            :label="dict.categoryName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态" prop="enabledStatus">
        <el-select
          v-model="queryParams.enabledStatus"
          placeholder="请选择启用状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
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
          v-hasPermi="['agriculture:model-management:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:model-management:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="主键（模型编码）" align="center" prop="id" />-->
      <el-table-column label="模型名称" align="center" prop="modelName" />
      <el-table-column label="模型类型" align="center" prop="modelType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.GROWTH_MODEL_TYPE" :value="scope.row.modelType" />
        </template>
      </el-table-column>
      <el-table-column label="关联品种" align="center" prop="varietyName" />
      <el-table-column label="关联品类" align="center" prop="categoryName" />
<!--      <el-table-column label="关联品类" align="center" prop="belongCategory" />-->
<!--      <el-table-column label="关联品种" align="center" prop="belongVariety" />-->
      <el-table-column label="模型图片" align="center" prop="modelImageId" >
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.modelImageId"
            :preview-src-list="[row.modelImageId]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="模型文件" align="center" prop="modelFileId" />
      <el-table-column label="启用状态" align="center" key="enabledStatus">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabledStatus"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="description" width="240"/>
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:model-management:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:model-management:delete']"
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
  <ModelManagementForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { ModelManagementApi, ModelManagementVO } from '@/api/agriculture/modelmanagement'
import ModelManagementForm from './ModelManagementForm.vue'
import {DICT_TYPE, getIntDictOptions, getStrDictOptions} from '@/utils/dict'
import {CommonStatusEnum} from "@/utils/constants";
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {CategoryManagementApi, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";

/** 模型管理 列表 */
defineOptions({ name: 'ModelManagement' })

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品类列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  const res = await allDataCacheManager.getData({})
  if (Array.isArray(res)) listVarietyManagement.value = res
  const res1 = await CategoryManagementApi.getAllCategoryManagement({})
  if (Array.isArray(res1)) listCategoryManagement.value = res1
}

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ModelManagementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  modelName: undefined,
  modelType: undefined,
  belongCategoryId: undefined,
  belongCategory: undefined,
  belongVarietyId: undefined,
  belongVariety: undefined,
  modelImageId: undefined,
  modelFileId: undefined,
  enabledStatus: undefined,
  description: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const handleVarietyChange = (e) => {
  const _item = listVarietyManagement.value.find(item => (item.id === e))
  if (_item) queryParams.belongCategoryId = _item.categoryId
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ModelManagementApi.getModelManagementPage(queryParams)
    list.value = data.list.map(item => {
      const element = listVarietyManagement.value.find(ele => (ele.id === item.belongVarietyId))
      if (!element) return item;
      return {
        ...item,
        varietyName: element.varietyName,
        categoryName: element.categoryName
      }
    })
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
    await ModelManagementApi.deleteModelManagement(id)
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
    const data = await ModelManagementApi.exportModelManagement(queryParams)
    download.excel(data, '模型管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 修改启用状态 */
const handleStatusChange = async (row: ModelManagementApi.ModelManagementVO) => {
  try {
    // 修改状态的二次确认
    const text = row.enabledStatus === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm('确认要' + text + '当前模型吗?')
    // 发起修改状态
    await ModelManagementApi.updateModelManagementStatus(row.id, row.enabledStatus)
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.enabledStatus =
      row.enabledStatus === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

const init = async () => {
  await getTypeData()
  await getList()
}

/** 初始化 **/
onMounted(() => {
  init()
})
</script>
