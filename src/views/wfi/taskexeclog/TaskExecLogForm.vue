<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="任务id" prop="taskId">
        <el-input v-model="formData.taskId" placeholder="请输入任务id" />
      </el-form-item>
      <el-form-item label="执行时间" prop="execTime">
        <el-date-picker
          v-model="formData.execTime"
          type="datetime"
          value-format="x"
          placeholder="选择执行时间"
        />
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="formData.taskType" placeholder="请选择任务类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_TASK_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择任务类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间/量（分钟/L）" prop="amountTimeNumber">
        <el-input v-model="formData.amountTimeNumber" placeholder="请输入时间/量（分钟/L）" />
      </el-form-item>
      <el-form-item label="任务执行灌区" prop="iaCodeList">
        <el-input v-model="formData.iaCodeList" placeholder="请输入任务执行灌区" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { TaskExecLogApi, TaskExecLogVO } from '@/api/wfi/taskexeclog'

/** 任务执行记录 表单 */
defineOptions({ name: 'TaskExecLogForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskId: undefined,
  execTime: undefined,
  taskType: undefined,
  type: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await TaskExecLogApi.getTaskExecLog(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as TaskExecLogVO
    if (formType.value === 'create') {
      await TaskExecLogApi.createTaskExecLog(data)
      message.success(t('common.createSuccess'))
    } else {
      await TaskExecLogApi.updateTaskExecLog(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    taskId: undefined,
    execTime: undefined,
    taskType: undefined,
    type: undefined,
    amountTimeNumber: undefined,
    iaCodeList: undefined
  }
  formRef.value?.resetFields()
}
</script>