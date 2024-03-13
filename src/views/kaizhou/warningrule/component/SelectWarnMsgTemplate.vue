<template>
  <Dialog
    title="选择预警消息模板"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1150"
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
        <el-form-item label="消息标题" prop="msgTitle">
          <el-input
            v-model="queryParams.msgTitle"
            placeholder="请输入消息标题"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="消息类型" prop="msgType">
          <el-select
            v-model="queryParams.msgType"
            placeholder="请选择消息类型"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_DATA_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消息级别" prop="msgLevel">
          <el-select
            v-model="queryParams.msgLevel"
            placeholder="请选择消息级别"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_MSG_LEVEL)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="消息标题" align="center" prop="msgTitle" width="180"/>
        <el-table-column label="消息内容" align="center" prop="msgContent" />
        <el-table-column label="消息类型" align="center" prop="msgType" width="120">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_DATA_TYPE" :value="scope.row.msgType" />
          </template>
        </el-table-column>
        <el-table-column label="消息级别" align="center" prop="msgLevel" width="120">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_MSG_LEVEL" :value="scope.row.msgLevel" />
          </template>
        </el-table-column>
        <!--      <el-table-column label="备注" align="center" prop="remark" />-->
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
import { ElTable } from 'element-plus'
import {dateFormatter} from '@/utils/formatTime'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {WarningMsgTemplateApi, WarningMsgTemplateVO} from "@/api/kaizhou/warningmsgtemplate";

defineOptions({ name: 'SelectWarnMsgTemplate' })

const list = ref<WarningMsgTemplateVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  msgTitle: undefined,
  msgContent: undefined,
  msgType: undefined,
  msgLevel: undefined,
  remark: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<WarningMsgTemplateVO[]>([])
const handleSelectionChange = (rows: WarningMsgTemplateVO[]) => {
  selectionList.value = rows
}

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  await nextTick() // 等待，避免 queryFormRef 为空
  await resetQuery()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: WarningMsgTemplateVO[]): void
}>()
const submitForm = () => {
  try {
    console.log("selectionList.value", selectionList.value)
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false

  }
}

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarningMsgTemplateApi.getWarningMsgTemplatePage(queryParams)
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
  selectionList.value = []
  getList()
}
</script>
