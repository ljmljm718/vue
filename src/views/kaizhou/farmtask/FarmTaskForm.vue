<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="任务编码" prop="taskCode">
        <el-input v-model="formData.taskCode" placeholder="请输入任务编码" />
      </el-form-item>
      <el-form-item label="任务人员" prop="taskPerson">
        <el-input v-model="formData.taskPerson" placeholder="请输入任务人员" />
      </el-form-item>
      <el-form-item label="任务完成要求" prop="taskDemand">
        <el-input v-model="formData.taskDemand" type="textarea" placeholder="请输入任务完成要求" />
      </el-form-item>
      <el-form-item label="任务开始时间" prop="taskStartdate">
        <el-date-picker
          v-model="formData.taskStartdate"
          type="date"
          value-format="x"
          placeholder="选择任务开始时间"
        />
      </el-form-item>
      <el-form-item label="任务截止时间" prop="taskEnddate">
        <el-date-picker
          v-model="formData.taskEnddate"
          type="date"
          value-format="x"
          placeholder="选择任务截止时间"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStastus">
        <el-select v-model="formData.taskStastus" placeholder="请选择任务状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_OPERATE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="formData.taskName" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="地块id" prop="plotId">
        <el-input v-model="formData.plotId" placeholder="请输入地块id" />
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="formData.plotName" placeholder="请输入地块名称" />
      </el-form-item>
      <el-form-item label="验收标准" prop="checkStandard">
        <el-input v-model="formData.checkStandard" type="textarea" placeholder="请输入验收标准" />
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
import { FarmTaskApi, FarmTaskVO } from '@/api/kaizhou/farmtask'

/** 农事任务 表单 */
defineOptions({ name: 'FarmTaskForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskCode: undefined,
  taskPerson: undefined,
  taskDemand: undefined,
  taskStartdate: undefined,
  taskEnddate: undefined,
  taskStastus: undefined,
  taskName: undefined,
  plotId: undefined,
  plotName: undefined,
  checkStandard: undefined,
})
const formRules = reactive({
  taskPerson: [{ required: true, message: '任务人员不能为空', trigger: 'blur' }],
  taskDemand: [{ required: true, message: '任务完成要求不能为空', trigger: 'blur' }],
  taskStartdate: [{ required: true, message: '任务开始时间不能为空', trigger: 'blur' }],
  taskEnddate: [{ required: true, message: '任务截止时间不能为空', trigger: 'blur' }],
  taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  plotName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
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
      formData.value = await FarmTaskApi.getFarmTask(id)
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
    const data = formData.value as unknown as FarmTaskVO
    if (formType.value === 'create') {
      await FarmTaskApi.createFarmTask(data)
      message.success(t('common.createSuccess'))
    } else {
      await FarmTaskApi.updateFarmTask(data)
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
    taskCode: undefined,
    taskPerson: undefined,
    taskDemand: undefined,
    taskStartdate: undefined,
    taskEnddate: undefined,
    taskStastus: undefined,
    taskName: undefined,
    plotId: undefined,
    plotName: undefined,
    checkStandard: undefined,
  }
  formRef.value?.resetFields()
}
</script>