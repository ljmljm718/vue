<!-- 指标列表 -->
<template>
  <Dialog
    title="选择监测指标"
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
        <el-form-item label="模型名称" prop="modelId">
          <el-input
            v-model="modelName"
            placeholder="请选择模型"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          >
            <template #append>
              <el-button @click="openModelSelectPopup('0')">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
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
        <el-table-column label="指标编号" align="center" prop="id" />
        <el-table-column label="模型名称" align="center" prop="modelName" />
        <el-table-column label="生长周期" align="center" prop="growth" />
        <el-table-column label="指标名称" align="center" prop="indicatorName" />
        <el-table-column label="指标说明" align="center" prop="indicatorDescription" />
<!--        <el-table-column label="指标范围" align="center" prop="indicatorRange" />-->
<!--        <el-table-column label="指标结果" align="center" prop="indicatorResult" />-->
        <el-table-column label="健康分值" align="center" prop="healthScore" />
        <el-table-column label="权重" align="center" prop="weight" />
        <el-table-column label="是否默认" align="center" prop="isDefault" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ADOPTION_ODER_REMIND_STATUS" :value="scope.row.isDefault" />
          </template>
        </el-table-column>
        <el-table-column label="实现类" align="center" prop="implementationClass" />
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

  <!--  选择模型-->
  <ModelSelectPopup ref="modelSelectPopupRef" @success="handleModelSelectPopupChange"/>
</template>

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict"
import {ModelManagementApi, ModelManagementVO} from "@/api/agriculture/modelmanagement";
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {CategoryManagementApi, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import ModelSelectPopup from "@/views/agriculture/modelmanagement/ModelSelectPopup.vue";
import {CropGrowthApi, CropGrowthVO} from "@/api/agriculture/cropgrowth";
import {
  ModelIndicatorElementApi,
  ModelIndicatorElementVO
} from "@/api/agriculture/modelindicatorelement";
import {
  ModelMonitorIndicatorApi,
  ModelMonitorIndicatorVO
} from "@/api/agriculture/modelmonitorindicator";

defineOptions({name: 'IndicatorSelectPopup'})
const list = ref<ModelMonitorIndicatorVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  modelId: undefined,
  growthPeriodId: undefined,
  indicatorName: undefined,
  indicatorDescription: undefined,
  indicatorRange: undefined,
  indicatorResult: undefined,
  healthScore: undefined,
  weight: undefined,
  isDefault: undefined,
  implementationClass: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

const listModelManagement = ref<ModelManagementVO[]>([]) // 模型列表的数据
const listCropGrowth = ref<CropGrowthVO[]>([]) // 生长周期列表的数据
const getTypeData = async () => {
  const { list } = await ModelManagementApi.getModelManagementPage({})
  if (Array.isArray(list)) listModelManagement.value = list
  const { list: growthList } = await CropGrowthApi.getCropGrowthPage({})
  if (Array.isArray(growthList)) listCropGrowth.value = growthList
}

/** 选中操作 */
const selectionList = ref<ModelMonitorIndicatorVO[]>([])
const handleSelectionChange = (rows: ModelMonitorIndicatorVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: ModelMonitorIndicatorVO[]): void
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
  await getTypeData()
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
    const data = await ModelMonitorIndicatorApi.getModelMonitorIndicatorPage(queryParams)
    list.value = data.list.map(item => {
      const element = Array.isArray(listModelManagement.value) ? listModelManagement.value.find(ele => (ele.id === item.modelId)) : null
      const cropItem = Array.isArray(listCropGrowth.value) ? listCropGrowth.value.find(ele => ele.id === item.growthPeriodId) : null
      return {
        ...item,
        modelName: element ? element.modelName : '',
        growth: cropItem ? cropItem.growth : ''
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

//模型的选择
const modelSelectPopupRef = ref()
const openModelSelectPopup = (id: string) => {
  modelSelectPopupRef.value.open(id)
}
const modelName = ref()
const handleModelSelectPopupChange = (order: ModelManagementVO) => {
  queryParams.modelId = String(order[0].id)
  modelName.value = String(order[0].modelName)
}

</script>

<style scoped lang='scss'>
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
