<!-- 生长周期列表 -->
<template>
  <Dialog
    title="选择生长周期"
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
    </ContentWrap>

    <ContentWrap>
      <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true" ref="multipleTableRef"
                @select="select" @row-click="selectClick" @selection-change="handleSelectionChange">
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="品种名称" align="center" prop="cropName"/>
        <el-table-column label="品类名称" align="center" prop="cropType"/>
        <!--      <el-table-column label="品种编号" align="center" prop="cropCode" />-->
        <!--      <el-table-column label="品类编号" align="center" prop="cropId" />-->
        <!--      <el-table-column label="图片" align="center" prop="imgId" />-->
        <el-table-column label="图片" align="center" prop="imgId">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
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
          :formatter="dateFormatter3"
          width="120px"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="endTime"
          :formatter="dateFormatter3"
          width="120px"
        />

<!--        <el-table-column label="环境条件" align="center" prop="envCondition"/>-->
        <el-table-column label="生长地点" align="center" prop="growSite"/>
        <el-table-column label="周期（/天）" align="center" prop="cycle"/>
<!--        <el-table-column label="特点" align="center" prop="feature"/>-->
<!--        <el-table-column label="农事建议" align="center" prop="farmAdvice" />-->
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
import {dateFormatter3} from "@/utils/formatTime";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {CropGrowthNewVO, CropGrowthNewApi} from "@/api/agri/cropgrowthnew";
import {VarietyManagementVO} from "@/api/agriculture/varietymanagement";

defineOptions({name: 'CropGrowthNewPopup'})
const list = ref<CropGrowthNewVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
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
  farmAdvice: undefined,
})
const queryFormRef = ref() // 搜索的表单

const CategoryManagementQueryParams = reactive({})
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const listVarietyManagementVO = ref<VarietyManagementVO[]>([]) // 品种列表的数据

/** 选中操作 */
const selectionList = ref<CropGrowthNewVO[]>([])
const handleSelectionChange = (rows: CropGrowthNewVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: CropGrowthNewVO[]): void
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
  dialogVisible.value = true
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 加载列表  */
const getList = async () => {
  loading.value = true
  listCategoryManagement.value = await allDataCacheManager.getData({})
  try {
    const data = await CropGrowthNewApi.getCropGrowthNewPage(queryParams)
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams)
    list.value = data.list
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


// 作物品种单选
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
