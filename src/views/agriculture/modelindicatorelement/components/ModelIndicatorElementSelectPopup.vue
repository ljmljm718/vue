<!-- 模型列表 -->
<template>
  <Dialog
    title="选择指标要素"
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
        <el-form-item label="要素名称" prop="elementName">
          <el-input
            v-model="queryParams.elementName"
            placeholder="请输入要素名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
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
        <el-table-column label="要素编号" align="center" prop="id" />
        <!--      <el-table-column label="监测指标" align="center" prop="indicatorId" />-->
        <el-table-column label="要素名称" align="center" prop="elementName" width="110"/>
        <el-table-column label="权重" align="center" prop="weight" width="90"/>
        <el-table-column label="指标说明" align="center" prop="indicatorDescription" />
        <el-table-column label="绑定设备" align="center" prop="deviceName" />
        <el-table-column label="状态" align="center" prop="status" width="110">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
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
</template>

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import {DICT_TYPE, getIntDictOptions, getStrDictOptions} from "@/utils/dict"
import {
  ModelIndicatorElementApi,
  ModelIndicatorElementVO
} from "@/api/agriculture/modelindicatorelement";

defineOptions({name: 'ModelIndicatorElementSelectPopup'})
const list = ref<ModelIndicatorElementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  indicatorId: undefined,
  elementName: undefined,
  weight: undefined,
  indicatorDescription: undefined,
  bindDevice: undefined,
  status: undefined,
  implementationClass: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<ModelIndicatorElementVO[]>([])
const handleSelectionChange = (rows: ModelIndicatorElementVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: ModelIndicatorElementVO[]): void
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
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()

  if (typeof id === 'string' && id.length > 1) {
    const activeItem = list.value.find(ele => ele.id === id)
    if (!activeItem) return;
    selectionList.value = [activeItem]
    submitForm()
  }

}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await ModelIndicatorElementApi.getModelIndicatorElementPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 重置按钮操作 */
const resetQuery = async () => {
  queryFormRef.value.resetFields()
  await handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = async () => {
  queryParams.pageNo = 1
  await getList()
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
