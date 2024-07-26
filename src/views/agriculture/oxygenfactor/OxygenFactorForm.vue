<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="因素名称" prop="factorName">
        <el-input v-model="formData.factorName" placeholder="请输入因素名称" />
      </el-form-item>
      <el-form-item label="因素编码" prop="factorCode">
        <el-input v-model="formData.factorCode" placeholder="请输入因素编码" />
      </el-form-item>
      <el-form-item label="数据库名称" prop="nameDatabase">
        <el-input v-model="formData.nameDatabase" placeholder="请输入数据库名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="影响指标" prop="impactIndicator">
        <el-input v-model="formData.impactIndicator" placeholder="请输入影响指标" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OxygenFactorApi, OxygenFactorVO } from '@/api/agriculture/oxygenfactor'

/** 溶解氧因素 表单 */
defineOptions({ name: 'OxygenFactorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  factorName: undefined,
  factorCode: undefined,
  nameDatabase: undefined,
  remark: undefined,
  impactIndicator: undefined,
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
      formData.value = await OxygenFactorApi.getOxygenFactor(id)
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
    const data = formData.value as unknown as OxygenFactorVO
    if (formType.value === 'create') {
      await OxygenFactorApi.createOxygenFactor(data)
      message.success(t('common.createSuccess'))
    } else {
      await OxygenFactorApi.updateOxygenFactor(data)
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
    factorName: undefined,
    factorCode: undefined,
    nameDatabase: undefined,
    remark: undefined,
    impactIndicator: undefined,
  }
  formRef.value?.resetFields()
}
</script>