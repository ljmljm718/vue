<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="所属基地" prop="belongPark">
        <el-input v-model="formData.belongPark" placeholder="请输入所属基地" />
      </el-form-item>
      <el-form-item label="基地名称" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="请输入基地名称" />
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="formData.plotName" placeholder="请输入地块名称" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="完成时间" prop="endTime">
        <el-date-picker
          v-model="formData.endTime"
          type="date"
          value-format="x"
          placeholder="选择完成时间"
        />
      </el-form-item>
      <el-form-item label="完成要求" prop="completeRequirement">
        <el-input v-model="formData.completeRequirement" placeholder="请输入完成要求" />
      </el-form-item>
      <el-form-item label="验收标准" prop="acceptanceStandard">
        <el-input v-model="formData.acceptanceStandard" placeholder="请输入验收标准" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FarmTaskApi, FarmTaskVO } from '@/api/agriculture/farmtask'

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
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  processInstanceId: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
  completeRequirement: undefined,
  acceptanceStandard: undefined,
})
const formRules = reactive({
  parkName: [{ required: true, message: '基地名称不能为空', trigger: 'blur' }],
  plotName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '完成时间不能为空', trigger: 'blur' }],
  completeRequirement: [{ required: true, message: '完成要求不能为空', trigger: 'blur' }],
  acceptanceStandard: [{ required: true, message: '验收标准不能为空', trigger: 'blur' }],
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
    belongPark: undefined,
    parkName: undefined,
    belongPlot: undefined,
    plotName: undefined,
    processInstanceId: undefined,
    status: undefined,
    startTime: undefined,
    endTime: undefined,
    completeRequirement: undefined,
    acceptanceStandard: undefined,
  }
  formRef.value?.resetFields()
}
</script>
