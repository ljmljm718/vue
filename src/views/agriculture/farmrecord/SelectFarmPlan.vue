<!-- 基地/地块列表 -->
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
                @selection-change="handleSelectionChange">
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="计划编码" align="center" prop="planCode" />
        <el-table-column label="计划名称" align="center" prop="planName" />
        <!--      <el-table-column label="所属基地" align="center" prop="belongPark" />-->
        <el-table-column label="基地名称" align="center" prop="parkName" />
        <!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
        <el-table-column label="地块名称" align="center" prop="plotName" />
        <!--      <el-table-column label="作物id" align="center" prop="cropId" />-->
        <el-table-column label="作物名称" align="center" prop="cropName" />
        <el-table-column label="品种" align="center" prop="cropType" />
        <el-table-column label="计划状态" align="center" prop="planState" />
        <!--      <el-table-column label="责任人编号" align="center" prop="personId" />-->
        <el-table-column label="责任人" align="center" prop="personName" />
        <el-table-column
          label="计划开始时间"
          align="center"
          prop="startTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column
          label="计划结束时间"
          align="center"
          prop="endTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="面积（亩）" align="center" prop="planArea" />
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
import {dateFormatter} from "@/utils/formatTime";
import {FarmPlanApi, FarmPlanVO} from "@/api/agri/farmplan";

defineOptions({name: 'SelectFarmPlan'})
const list = ref<FarmPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
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
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmPlanApi.getFarmPlanPage(queryParams)
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
</script>
