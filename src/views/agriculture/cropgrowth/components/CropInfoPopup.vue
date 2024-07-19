<!-- 基地/地块列表 -->
<template>
  <Dialog
    title="种植管理"
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
        <el-form-item label="编号" prop="cropCode">
          <el-input
              v-model="queryParams.cropCode"
              placeholder="请输入编号"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="名称" prop="cropName">
          <el-input
              v-model="queryParams.cropName"
              placeholder="请输入名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="品种" prop="cropType">
          <el-select
              v-model="queryParams.cropType"
              placeholder="请选择品种"
              clearable
              class="!w-240px"
          >
            <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"
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
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="编号" align="center" prop="cropCode" />
        <el-table-column label="名称" align="center" prop="cropName" />
        <el-table-column label="品种" align="center" prop="categoryName">
          <template #default="scope">
            <el-tag >{{scope.row.categoryName}} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="imgId" >
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
<!--        <el-table-column label="所属基地" align="center" prop="belongPark"/>-->
        <el-table-column label="所属基地" align="center" prop="parkName"/>
<!--        <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
        <el-table-column label="所属基地" align="center" prop="plotName"/>
        <el-table-column label="批次码" align="center" prop="batchCode" />
        <el-table-column label="描述" align="center" prop="cropDesc" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :formatter="dateFormatter"
            width="180px"
        />
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
import {dateFormatter} from "@/utils/formatTime";
import {CropBaseVO,CropBaseApi} from "@/api/agriculture/cropbase";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

defineOptions({name: 'CropInfoPopup'})
const list = ref<CropBaseVO[]>([]) // 列表的数据
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
  createTime: [],
  belongPark: undefined,
  belongPlot: undefined,
  deptId: undefined,
  userId: undefined,
  recoveryNo:false,
})
const queryFormRef = ref() // 搜索的表单
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

/** 选中操作 */
const selectionList = ref<CropBaseVO[]>([])
const handleSelectionChange = (rows: CropBaseVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: CropBaseVO[]): void
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
  try {
    listCategoryManagement.value = await allDataCacheManager.getData({})
    const data = await CropBaseApi.getCropBasePage(queryParams)
    list.value = data.list
    //把品类数据的namep拼接到列表中
    list.value.forEach(item=>{
      listCategoryManagement.value.forEach(itm=>{
        if (item.cropType == itm.id)
          item.categoryName= itm.categoryName
      })
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
  queryParams.parentId = parentValue.value
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
