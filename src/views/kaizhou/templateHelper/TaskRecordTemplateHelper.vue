<!-- 下属地块列表 -->
<template>
  <Dialog
      title="农事定义"
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

        <el-form-item label="审核状态" prop="auditStatus">
          <el-select
              v-model="queryParams.auditStatus"
              placeholder="请选择审核状态"
              clearable
              class="!w-240px"
          >
            <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_FARM_TASK_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核人员" prop="auditPerson">
          <el-input
              v-model="queryParams.auditPerson"
              placeholder="请输入审核人员"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="任务人员" prop="taskPerson">
          <el-input
              v-model="queryParams.taskPerson"
              placeholder="请输入任务人员"
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
      <el-table
          v-loading="loading" :data="list"
          border
          :show-overflow-tooltip="true" :stripe="true"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            label="开始时间"
            align="center"
            prop="startTime"
            :formatter="dateFormatter"
            width="180px"
        />
        <el-table-column
            label="完成时间"
            align="center"
            prop="endTime"
            :formatter="dateFormatter"
            width="180px"
        />
        <el-table-column label="任务人员" align="center" prop="taskPerson" />
        <el-table-column label="审核人员" align="center" prop="auditPerson" />
        <el-table-column label="审核状态" align="center" prop="auditStatus"/>
        <el-table-column label="审核意见" align="center" prop="auditOpinion" />

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
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import {dateFormatter} from "@/utils/formatTime";
import {TaskRecordApi, TaskRecordVO} from "@/api/kaizhou/taskrecord";
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";


defineOptions({name: 'TaskRecordTemplateHelper'})
const list = ref<TaskRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  startTime: [],
  endTime: [],
  auditStatus: undefined,
  auditOpinion: undefined,
  auditPerson: undefined,
  taskPerson: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<TaskRecordVO[]>([])
const handleSelectionChange = (rows: TaskRecordVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'setFarmWorkInfo', value: TaskRecordVO[]): void
}>()
const submitForm = () => {
  try {
    emits('setFarmWorkInfo', selectionList.value)
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
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await TaskRecordApi.getTaskRecordPage(queryParams)
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
</script>
