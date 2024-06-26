<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="认养规则流水号" prop="ruleNumber">
        <el-input v-model="formData.ruleNumber" placeholder="请输入认养规则流水号" />
      </el-form-item>
      <el-form-item label="规格流水号" prop="specsNumber">
        <el-input v-model="formData.specsNumber" placeholder="请输入规格流水号" />
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-select v-model="formData.ruleType" placeholder="请选择规则类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="规格" prop="specs">
        <el-input v-model="formData.specs" placeholder="请输入规格" />
      </el-form-item>
      <el-form-item label="单价" prop="singlePrice">
        <el-input v-model="formData.singlePrice" placeholder="请输入单价" />
      </el-form-item>
      <el-form-item label="份数" prop="servingNumber">
        <el-input v-model="formData.servingNumber" placeholder="请输入份数" />
      </el-form-item>
      <el-form-item label="每份数量" prop="servingAmount">
        <el-input v-model="formData.servingAmount" placeholder="请输入每份数量" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AdoptionRuleSpecsApi, AdoptionRuleSpecsVO } from '@/api/agriculture/adoptionrulespecs'

/** 认养规则规格 表单 */
defineOptions({ name: 'AdoptionRuleSpecsForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  ruleNumber: undefined,
  specsNumber: undefined,
  ruleType: undefined,
  specs: undefined,
  singlePrice: undefined,
  servingNumber: undefined,
  servingAmount: undefined,
  remark: undefined
})
const formRules = reactive({
  ruleNumber: [{ required: true, message: '认养规则流水号不能为空', trigger: 'blur' }],
  specsNumber: [{ required: true, message: '规格流水号不能为空', trigger: 'blur' }]
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
      formData.value = await AdoptionRuleSpecsApi.getAdoptionRuleSpecs(id)
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
    const data = formData.value as unknown as AdoptionRuleSpecsVO
    if (formType.value === 'create') {
      await AdoptionRuleSpecsApi.createAdoptionRuleSpecs(data)
      message.success(t('common.createSuccess'))
    } else {
      await AdoptionRuleSpecsApi.updateAdoptionRuleSpecs(data)
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
    ruleNumber: undefined,
    specsNumber: undefined,
    ruleType: undefined,
    specs: undefined,
    singlePrice: undefined,
    servingNumber: undefined,
    servingAmount: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
