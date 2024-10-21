<!-- 基地列表 -->
<template>
  <Dialog
    title="选择农事计划"
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
        <el-form-item label="计划编码" prop="planCode">
          <el-input
            v-model="queryParams.planCode"
            placeholder="请输入计划编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="计划名称" prop="planName">
          <el-input
            v-model="queryParams.planName"
            placeholder="请输入计划名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <!--        <el-form-item label="类型" prop="type">
                  <el-select
                    v-model="queryParams.type"
                    placeholder="请选择类型"
                    clearable
                    class="!w-160px"
                  >
                    <el-option
                      v-for="dict in queryParams.grade === '0' ? getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_TYPE).filter(item => item.value.toString().substring(0,4) === 'park') : getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_TYPE).filter(item => item.value.toString().substring(0,6) === 'massif')"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>-->
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
<!--        <el-table-column label="编号" align="center" prop="code" width="200"/>-->
        <el-table-column label="计划编码" align="center" prop="planCode" width="180" />
        <el-table-column label="计划名称" align="center" prop="planName" width="180" />
        <!--      <el-table-column label="所属基地" align="center" prop="belongPark" />-->
        <el-table-column label="基地名称" align="center" prop="parkName" width="180"  />
        <el-table-column label="农事阶段" align="center" prop="farmDefineType" width="120" >
          <template #default="scope">
            <el-select v-model="scope.row.farmDefineType" disabled>
              <el-option
                v-for="dict in farmDefineOptions"
                :key="dict.id"
                :label="dict.defineName"
                :value="dict.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
        <el-table-column label="地块名称" align="center" prop="plotName" width="180"/>
        <!--      <el-table-column label="作物id" align="center" prop="cropId" />-->
        <el-table-column label="作物名称" align="center" prop="cropName" width="180" />
        <el-table-column label="批次码" align="center" prop="batchCode" width="120" />
        <el-table-column label="品类" align="center" prop="cropType" width="100">
          <template #default="scope">
            <el-tag>{{ scope.row.cropType }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="计划状态" align="center" prop="planState" width="100" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.FARM_PLAN_STATE" :value="scope.row.planState" />
          </template>
        </el-table-column>
        <!--      <el-table-column label="责任人编号" align="center" prop="personId" />-->
        <el-table-column label="责任人" align="center" prop="personName" width="150" />
        <el-table-column
          label="计划开始时间"
          align="center"
          prop="startTime"
          :formatter="dateFormatter2"
          width="180px"
        />
        <el-table-column
          label="计划结束时间"
          align="center"
          prop="endTime"
          :formatter="dateFormatter2"
          width="180px"
        />
        <el-table-column label="计划面积（亩）" align="center" prop="planArea" width="150" />
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
import {dateFormatter, dateFormatter2} from "@/utils/formatTime";
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import {FarmPlanApi, FarmPlanVO} from "@/api/agriculture/farmplan";
import {CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {allDataCacheManager} from "@/api/agriculture/varietymanagement";

defineOptions({name: 'ParkInfoPopup'})
const list = ref<FarmPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
let farmDefineOptions = ref([])// 设备分类选项

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  planCode: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  planState: undefined,
  personId: undefined,
  personName: undefined,
  startTime: [],
  endTime: [],
  planArea: undefined,
  area: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<FarmPlanVO[]>([])
const handleSelectionChange = (rows: FarmPlanVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: FarmPlanVO[]): void
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
  farmDefineOptions.value =  await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmPlanApi.getFarmPlanPage(queryParams)
    //请求品类信息
    listCategoryManagement.value = await allDataCacheManager.getData({})
    data.list.forEach((item)=>{
      item.farmDefineType=item.farmDefineType?parseInt(item.farmDefineType):""
      listCategoryManagement.value.forEach((itm) => {
        if (item.cropType == itm.id) item.cropType = itm.categoryName
      })
    })
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
