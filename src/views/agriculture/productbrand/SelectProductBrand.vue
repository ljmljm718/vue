<!-- 基地/地块列表 -->
<template>
  <Dialog
    title="选择产品品牌"
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
        <el-form-item label="品牌名" prop="productBrand">
          <el-input
            v-model="queryParams.productBrand"
            placeholder="请输入品牌名"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
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
      <el-table v-loading="loading" :data="list"
                :show-overflow-tooltip="true"
                @row-click="selectClick"
                ref="multipleTableRef"
                :stripe="true"
                @select="select"
                @selection-change="handleSelectionChange"
               >
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="品牌名" align="center" prop="productBrand" />
        <el-table-column label="品类" align="center" prop="belongCategory" />
        <el-table-column label="品种" align="center" prop="belongVariety" />
        <el-table-column label="品牌logo" align="center" prop="brandLogo">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              :src="row.brandLogo"
              :preview-src-list="[row.brandLogo]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌介绍" align="center" prop="brandDetail" />
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
import { ProductBrandApi, ProductBrandVO } from '@/api/agriculture/productbrand'
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {CategoryManagementApi, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

defineOptions({name: 'SelectProductBrand'})
const list = ref<ProductBrandVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  productBrand: undefined,
  belongCategoryId: undefined,
  belongCategory: undefined,
  belongVarietyId: undefined,
  belongVariety: undefined,
  brandLogo: undefined,
  brandDetail: undefined,
  usedStatus: '0',
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<ProductBrandVO[]>([])
const handleSelectionChange = (rows: ProductBrandVO[]) => {
  selectionList.value = rows
}

// 品牌单选
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

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: ProductBrandVO[]): void
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
  await getTypeData()
  await resetQuery()

}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品种列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  const res = await allDataCacheManager.getData({})
  if (Array.isArray(res)) listVarietyManagement.value = res
  const res1 = await CategoryManagementApi.getAllCategoryManagement({})
  if (Array.isArray(res1)) listCategoryManagement.value = res1
}

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductBrandApi.getProductBrandPage(queryParams)
    list.value = data.list.map(item => {
      const element = listVarietyManagement.value.find(ele => (ele.id === item.belongVarietyId))
      if (!element) return item;
      return {
        ...item,
        belongVariety: element.varietyName,
        belongCategory: element.categoryName
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
</script>

<style scoped lang='scss'>
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
