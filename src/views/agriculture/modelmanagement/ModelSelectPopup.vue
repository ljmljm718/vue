<!-- 模型列表 -->
<template>
  <Dialog
    title="选择模型"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1300"
  >
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
    </ContentWrap>

    <ContentWrap>
      <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true" ref="multipleTableRef"
                @select="select" @row-click="selectClick" @selection-change="handleSelectionChange">
          <!--      <el-table-column label="主键（模型编码）" align="center" prop="id" />-->
        <el-table-column width="30" label="选择" type="selection"/>
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
          <el-table-column label="启用状态" align="center" prop="enabledStatus" >
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.enabledStatus" />
            </template>
          </el-table-column>
          <el-table-column label="描述" align="center" prop="description" width="240"/>
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button :disabled="!selectionList.length" type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict"
import {ModelManagementApi, ModelManagementVO} from "@/api/agriculture/modelmanagement";
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {CategoryManagementApi, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

defineOptions({name: 'ModelSelectPopup'})
const list = ref<ModelManagementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
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

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品类列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  const res = await allDataCacheManager.getData({})
  if (Array.isArray(res)) listVarietyManagement.value = res
  const res1 = await CategoryManagementApi.getAllCategoryManagement({})
  if (Array.isArray(res1)) listCategoryManagement.value = res1
}

/** 选中操作 */
const selectionList = ref<ModelManagementVO[]>([])
const handleSelectionChange = (rows: ModelManagementVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: ModelManagementVO[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}


/** 打开弹窗 */
const open = async (id: string) => {
  getTypeData()
  dialogVisible.value = true
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 加载列表  */
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

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

// 单选
const multipleTableRef = ref()
const select = (selection, row)=> {
  // 清除 所有勾选项
  multipleTableRef.value.clearSelection()
  // 当表格数据都没有被勾选的时候 就返回
  // 主要用于将当前勾选的表格状态清除
  if(selection.length == 0) return
  multipleTableRef.value.toggleRowSelection(row, true);
}

// 控制单选——table选择项发生变化时
const selectClick = (row) => {
  const selectData = selectionList.value
  multipleTableRef.value.clearSelection()
  if (selectData.length == 1) {
    selectData.forEach(item => {
      // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
      if (item == row) {
        multipleTableRef.value.toggleRowSelection(row, false);
      }
      // 不然就让当前的一行勾选
      else {
        multipleTableRef.value.toggleRowSelection(row, true);
      }
    })
  } else {
    multipleTableRef.value.toggleRowSelection(row, true);
  }
}
</script>

<style scoped lang='scss'>
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
