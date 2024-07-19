<!-- 基地列表 -->
<template>
  <Dialog
    title="选择种植品种"
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
        <el-form-item label="品种名称" prop="varietyName">
          <el-input
            v-model="queryParams.varietyName"
            placeholder="请输入品种名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="品种编码" prop="varietyCode">
          <el-input
            v-model="queryParams.varietyCode"
            placeholder="请输入品种编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="品类名称" prop="categoryId">
          <el-select v-model="queryParams.categoryId" clearable placeholder="请选择品类" class="!w-240px">
            <el-option
              v-for="item in listCategoryManagement"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
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
      <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true"
                ref="multipleTableRef"
                @select="select" @row-click="selectClick" @selection-change="handleSelectionChange">
        <el-table-column width="30" label="选择" type="selection"/>
        <!--        <el-table-column label="编号" align="center" prop="code" width="200"/>-->
        <el-table-column label="品种名称" align="center" prop="varietyName"/>
        <!--      <el-table-column label="品类ID" align="center" prop="categoryId"/>-->
        <el-table-column label="品类名称" align="center" prop="categoryName"/>
        <el-table-column label="品种编码" align="center" prop="varietyCode"/>
        <el-table-column label="图片" align="center" prop="images">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.images"
              :preview-src-list="[row.images]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="品种来源" align="center" prop="categorySource"/>
        <el-table-column label="品种特征" align="center" prop="categoryStigma"/>
        <el-table-column label="分布地区" align="center" prop="areaDistribution"/>
        <el-table-column label="简介" align="center" prop="briefIntroduction"/>
        <el-table-column label="启用停用" align="center" prop="status">
          <template #default="{ row }">
            <span v-if="row.status == '1'">启用</span>
            <span v-if="row.status == '2'">停用</span>
          </template>
        </el-table-column>
        <!--      <el-table-column label="备注1" align="center" prop="remark2" />-->
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
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
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
import {ParkInfoApi, ParkInfoVO} from '@/api/agriculture/parkinfo'
import {dateFormatter} from "@/utils/formatTime";
import {VarietyManagementApi, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

defineOptions({name: 'SelectVarietyManagement'})
const list = ref<VarietyManagementVO[]>([]) // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  varietyName: undefined,
  varietyCode: undefined,
  images: undefined,
  categoryId: undefined,
  categorySource: undefined,
  categoryStigma: undefined,
  areaDistribution: undefined,
  briefIntroduction: undefined,
  status: undefined,
  remark2: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<VarietyManagementVO[]>([])
const handleSelectionChange = (rows: VarietyManagementVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: VarietyManagementVO[]): void
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
  parentValue.value = id
  console.log("id:" + id)
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
    const data = await VarietyManagementApi.getVarietyManagementPage(queryParams)
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
  queryParams.parentId = parentValue.value
  getList()
}

// 基地单选
const multipleTableRef = ref()
const select = (selection, row) => {
  // 清除 所有勾选项
  multipleTableRef.value.clearSelection()
  // 当表格数据都没有被勾选的时候 就返回
  // 主要用于将当前勾选的表格状态清除
  if (selection.length == 0) return
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
