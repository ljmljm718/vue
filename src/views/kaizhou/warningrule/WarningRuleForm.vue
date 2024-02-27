<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="规则类型" prop="ruleType">
        <el-select v-model="formData.ruleType" placeholder="请选择规则类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_RULE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预警下限" prop="warnLowValue">
        <el-input v-model="formData.warnLowValue" placeholder="请输入预警下限" />
      </el-form-item>
      <el-form-item label="预警上限" prop="warnHighValue">
        <el-input v-model="formData.warnHighValue" placeholder="请输入预警上限" />
      </el-form-item>
      <el-form-item label="单位" prop="warnUnit">
        <el-input v-model="formData.warnUnit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="低位预警消息模板" prop="lowMsgTemplateId">
        <el-input v-model="formData.lowMsgTemplateId" placeholder="请输入低位预警消息模板" />
      </el-form-item>
      <el-form-item label="高位预警消息模板" prop="highMsgTemplateId">
        <el-input v-model="formData.highMsgTemplateId" placeholder="请输入高位预警消息模板" />
      </el-form-item>
      <el-form-item label="责任人编号" prop="responsiblePersonId">
        <el-input v-model="formData.responsiblePersonId" placeholder="请输入责任人编号" />
      </el-form-item>
      <el-form-item label="责任人" prop="responsiblePerson">
        <el-input v-model="formData.responsiblePerson" placeholder="请输入责任人" />
      </el-form-item>
      <el-form-item label="生效状态（0-未生效，1-生效）" prop="effectiveStatus">
        <el-radio-group v-model="formData.effectiveStatus">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
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
import { WarningRuleApi, WarningRuleVO } from '@/api/kaizhou/warningrule'

/** 预警规则 表单 */
defineOptions({ name: 'WarningRuleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  ruleType: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsgTemplateId: undefined,
  highMsgTemplateId: undefined,
  responsiblePersonId: undefined,
  responsiblePerson: undefined,
  effectiveStatus: undefined,
})
const formRules = reactive({
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  warnLowValue: [{ required: true, message: '预警下限不能为空', trigger: 'blur' }],
  warnHighValue: [{ required: true, message: '预警上限不能为空', trigger: 'blur' }],
  warnUnit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
  lowMsgTemplateId: [{ required: true, message: '低位预警消息模板不能为空', trigger: 'blur' }],
  highMsgTemplateId: [{ required: true, message: '高位预警消息模板不能为空', trigger: 'blur' }],
  responsiblePersonId: [{ required: true, message: '责任人编号不能为空', trigger: 'blur' }],
  responsiblePerson: [{ required: true, message: '责任人不能为空', trigger: 'blur' }],
  effectiveStatus: [{ required: true, message: '生效状态（0-未生效，1-生效）不能为空', trigger: 'blur' }],
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
      formData.value = await WarningRuleApi.getWarningRule(id)
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
    const data = formData.value as unknown as WarningRuleVO
    if (formType.value === 'create') {
      await WarningRuleApi.createWarningRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarningRuleApi.updateWarningRule(data)
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
    ruleType: undefined,
    warnLowValue: undefined,
    warnHighValue: undefined,
    warnUnit: undefined,
    lowMsgTemplateId: undefined,
    highMsgTemplateId: undefined,
    responsiblePersonId: undefined,
    responsiblePerson: undefined,
    effectiveStatus: undefined,
  }
  formRef.value?.resetFields()
}
</script>