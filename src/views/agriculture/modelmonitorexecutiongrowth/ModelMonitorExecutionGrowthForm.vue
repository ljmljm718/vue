<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="所属基地id" prop="belongParkId">
        <el-input v-model="formData.belongParkId" placeholder="请输入所属基地id" />
      </el-form-item>
      <el-form-item label="所属地块id" prop="belongPlotId">
        <el-input v-model="formData.belongPlotId" placeholder="请输入所属地块id" />
      </el-form-item>
      <el-form-item label="所属品类id" prop="belongCategoryId">
        <el-input v-model="formData.belongCategoryId" placeholder="请输入所属品类id" />
      </el-form-item>
      <el-form-item label="所属品种id" prop="belongVarietyId">
        <el-input v-model="formData.belongVarietyId" placeholder="请输入所属品种id" />
      </el-form-item>
      <el-form-item label="批次" prop="batch">
        <el-input v-model="formData.batch" placeholder="请输入批次" />
      </el-form-item>
      <el-form-item label="指标" prop="indicator">
        <el-input v-model="formData.indicator" placeholder="请输入指标" />
      </el-form-item>
      <el-form-item label="指标权重" prop="indicatorWeight">
        <el-input v-model="formData.indicatorWeight" placeholder="请输入指标权重" />
      </el-form-item>
      <el-form-item label="要素" prop="element">
        <el-input v-model="formData.element" placeholder="请输入要素" />
      </el-form-item>
      <el-form-item label="要素权重" prop="elementWeight">
        <el-input v-model="formData.elementWeight" placeholder="请输入要素权重" />
      </el-form-item>
      <el-form-item label="要素值" prop="elementValue">
        <el-input v-model="formData.elementValue" placeholder="请输入要素值" />
      </el-form-item>
      <el-form-item label="要素单位" prop="elementUnits">
        <el-input v-model="formData.elementUnits" placeholder="请输入要素单位" />
      </el-form-item>
      <el-form-item label="要素得分" prop="elementScore">
        <el-input v-model="formData.elementScore" placeholder="请输入要素得分" />
      </el-form-item>
      <el-form-item label="周期节点" prop="growthId">
        <el-input v-model="formData.growthId" placeholder="请输入周期节点" />
      </el-form-item>
      <el-form-item label="健康等级" prop="healthLevel">
        <el-input v-model="formData.healthLevel" placeholder="请输入健康等级" />
      </el-form-item>
      <el-form-item label="指标结果" prop="indicatorResult">
        <el-input v-model="formData.indicatorResult" placeholder="请输入指标结果" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ModelMonitorExecutionGrowthApi, ModelMonitorExecutionGrowthVO } from '@/api/agriculture/modelmonitorexecutiongrowth'

/** 监测执行周期 表单 */
defineOptions({ name: 'ModelMonitorExecutionGrowthForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  belongParkId: undefined,
  belongPlotId: undefined,
  belongCategoryId: undefined,
  belongVarietyId: undefined,
  batch: undefined,
  indicator: undefined,
  indicatorWeight: undefined,
  element: undefined,
  elementWeight: undefined,
  elementValue: undefined,
  elementUnits: undefined,
  elementScore: undefined,
  growthId: undefined,
  healthLevel: undefined,
  indicatorResult: undefined,
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
      formData.value = await ModelMonitorExecutionGrowthApi.getModelMonitorExecutionGrowth(id)
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
    const data = formData.value as unknown as ModelMonitorExecutionGrowthVO
    if (formType.value === 'create') {
      await ModelMonitorExecutionGrowthApi.createModelMonitorExecutionGrowth(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelMonitorExecutionGrowthApi.updateModelMonitorExecutionGrowth(data)
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
    belongParkId: undefined,
    belongPlotId: undefined,
    belongCategoryId: undefined,
    belongVarietyId: undefined,
    batch: undefined,
    indicator: undefined,
    indicatorWeight: undefined,
    element: undefined,
    elementWeight: undefined,
    elementValue: undefined,
    elementUnits: undefined,
    elementScore: undefined,
    growthId: undefined,
    healthLevel: undefined,
    indicatorResult: undefined,
  }
  formRef.value?.resetFields()
}
</script>
