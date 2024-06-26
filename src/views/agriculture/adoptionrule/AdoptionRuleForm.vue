<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="规则流水号" prop="ruleNumber">
        <el-input v-model="formData.ruleNumber" placeholder="请输入规则流水号" />
      </el-form-item>
      <el-form-item label="计划流水号" prop="planNumber">
        <el-input v-model="formData.planNumber" placeholder="请输入计划流水号" />
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-select v-model="formData.ruleType" placeholder="请选择规则类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="规则概述" prop="ruleOverview">
        <el-input v-model="formData.ruleOverview" placeholder="请输入规则概述" />
      </el-form-item>
      <el-form-item label="具体说明" prop="ruleDescribe">
        <el-input v-model="formData.ruleDescribe" placeholder="请输入具体说明" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="认养规则规格" name="adoptionRuleSpecs">
        <AdoptionRuleSpecsForm ref="adoptionRuleSpecsFormRef" :rule-number="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AdoptionRuleApi, AdoptionRuleVO } from '@/api/agriculture/adoptionrule'
import AdoptionRuleSpecsForm from './components/AdoptionRuleSpecsForm.vue'

/** 认养规则 表单 */
defineOptions({ name: 'AdoptionRuleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  ruleNumber: undefined,
  planNumber: undefined,
  ruleType: undefined,
  ruleOverview: undefined,
  ruleDescribe: undefined,
  remark: undefined
})
const formRules = reactive({
  ruleNumber: [{ required: true, message: '规则流水号不能为空', trigger: 'blur' }],
  planNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  ruleOverview: [{ required: true, message: '规则概述不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('adoptionRuleSpecs')
const adoptionRuleSpecsFormRef = ref()

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
      formData.value = await AdoptionRuleApi.getAdoptionRule(id)
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
  // 校验子表单
  try {
    await adoptionRuleSpecsFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'adoptionRuleSpecs'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as AdoptionRuleVO
    // 拼接子表的数据
    data.adoptionRuleSpecss = adoptionRuleSpecsFormRef.value.getData()
    if (formType.value === 'create') {
      await AdoptionRuleApi.createAdoptionRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await AdoptionRuleApi.updateAdoptionRule(data)
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
    planNumber: undefined,
    ruleType: undefined,
    ruleOverview: undefined,
    ruleDescribe: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
