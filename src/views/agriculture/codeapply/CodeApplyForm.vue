<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="申请名称" prop="applyName">
        <el-input v-model="formData.applyName" placeholder="请输入申请名称" />
      </el-form-item>
      <el-form-item label="申请数量" prop="applyNumber">
        <el-input v-model="formData.applyNumber" placeholder="请输入申请数量" />
      </el-form-item>
      <el-form-item label="申请描述" prop="applyDescribe">
        <el-input type="textarea" v-model="formData.applyDescribe" placeholder="请输入申请描述" />
      </el-form-item>
      <el-form-item label="溯源模版" prop="sourceId">
        <el-select v-model="formData.sourceId" placeholder="请选择溯源模版">
          <el-option
            v-for="item in templateList"
            :key="item.id"
            :label="item.templateName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="码规则" prop="ruleId">
        <el-select v-model="formData.ruleId" placeholder="请选择码规则">
          <el-option
            v-for="item in ruleList"
            :key="item.id"
            :label="item.codeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CodeApplyApi, CodeApplyVO } from '@/api/agriculture/codeapply'
import {TraceTemplateApi, TraceTemplateVO} from '@/api/agriculture/tracetemplate'
import { CodeRuleApi, CodeRuleVO } from '@/api/agriculture/coderule'

/** 码申请 表单 */
defineOptions({ name: 'CodeApplyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  applyName: undefined,
  applyNumber: undefined,
  applyDescribe: undefined,
  sourceId: undefined,
  ruleId: undefined,
  applyStatus: undefined,
  remark: undefined,
})
const formRules = reactive({
  applyName: [{ required: true, message: '申请名称不能为空', trigger: 'blur' }],
  applyNumber: [
    { required: true, message: '申请数量不能为空', trigger: 'blur' },
    { pattern: '^(0|[1-9]\\d*)$', message: '请输入正确的申请数量'}
  ],
  sourceId: [{ required: true, message: '溯源模版不能为空', trigger: 'blur' }],
  ruleId: [{ required: true, message: '码规则不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const templateList = ref<TraceTemplateVO[]>([]) // 溯源模版的数据
const ruleList = ref<CodeRuleVO[]>([]) // 码规则的数据

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  templateList.value = await TraceTemplateApi.getTraceTemplateAll()
  ruleList.value = await CodeRuleApi.getCodeRuleAll()
    resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CodeApplyApi.getCodeApply(id)
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
    const data = formData.value as unknown as CodeApplyVO
    if (formType.value === 'create') {
      data.applyStatus = '1'
      await CodeApplyApi.createCodeApply(data)
      message.success(t('common.createSuccess'))
    } else {
      await CodeApplyApi.updateCodeApply(data)
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
    applyName: undefined,
    applyNumber: undefined,
    applyDescribe: undefined,
    sourceId: undefined,
    ruleId: undefined,
    applyStatus: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
