<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="模型id" prop="modelId">
        <el-input v-model="formData.modelId" placeholder="请输入模型id" />
      </el-form-item>
      <el-form-item label="生长周期id" prop="growthPeriodId">
        <el-input v-model="formData.growthPeriodId" placeholder="请输入生长周期id" />
      </el-form-item>
      <el-form-item label="指标名称" prop="indicatorName">
        <el-input v-model="formData.indicatorName" placeholder="请输入指标名称" />
      </el-form-item>
      <el-form-item label="指标描述" prop="indicatorDescription">
        <el-input v-model="formData.indicatorDescription" type="textarea" placeholder="请输入指标描述" />
      </el-form-item>
      <el-form-item label="指标范围" prop="indicatorRange">
        <el-input v-model="formData.indicatorRange" placeholder="请输入指标范围" />
      </el-form-item>
      <el-form-item label="指标结果" prop="indicatorResult">
        <el-input v-model="formData.indicatorResult" placeholder="请输入指标结果" />
      </el-form-item>
      <el-form-item label="健康分值" prop="healthScore">
        <el-input v-model="formData.healthScore" placeholder="请输入健康分值" />
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input v-model="formData.weight" placeholder="请输入权重" />
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-radio-group v-model="formData.isDefault">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="实现类" prop="implementationClass">
        <el-input v-model="formData.implementationClass" placeholder="请输入实现类" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ModelMonitorIndicatorApi, ModelMonitorIndicatorVO } from '@/api/agriculture/modelmonitorindicator'

/** 监测指标 表单 */
defineOptions({ name: 'ModelMonitorIndicatorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  modelId: undefined,
  growthPeriodId: undefined,
  indicatorName: undefined,
  indicatorDescription: undefined,
  indicatorRange: undefined,
  indicatorResult: undefined,
  healthScore: undefined,
  weight: undefined,
  isDefault: undefined,
  implementationClass: undefined,
})
const formRules = reactive({
  modelId: [{ required: true, message: '模型id不能为空', trigger: 'blur' }],
  growthPeriodId: [{ required: true, message: '生长周期id不能为空', trigger: 'blur' }],
  isDefault: [{ required: true, message: '是否默认不能为空', trigger: 'blur' }],
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
      formData.value = await ModelMonitorIndicatorApi.getModelMonitorIndicator(id)
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
    const data = formData.value as unknown as ModelMonitorIndicatorVO
    if (formType.value === 'create') {
      await ModelMonitorIndicatorApi.createModelMonitorIndicator(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelMonitorIndicatorApi.updateModelMonitorIndicator(data)
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
    modelId: undefined,
    growthPeriodId: undefined,
    indicatorName: undefined,
    indicatorDescription: undefined,
    indicatorRange: undefined,
    indicatorResult: undefined,
    healthScore: undefined,
    weight: undefined,
    isDefault: undefined,
    implementationClass: undefined,
  }
  formRef.value?.resetFields()
}
</script>
