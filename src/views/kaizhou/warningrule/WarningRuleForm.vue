<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="60%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="规则类型" prop="ruleType">
            <el-select v-model="formData.ruleType" placeholder="请选择规则类型" style="width: 100%;">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_DATA_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="责任人" prop="responsiblePerson">
            <el-input v-model="formData.responsiblePerson" placeholder="请输入责任人" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生效状态" prop="effectiveStatus">
            <el-radio-group v-model="formData.effectiveStatus">
              <el-radio
                v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_RULE_STATUS)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预警下限" prop="warnLowValue">
            <el-input v-model="formData.warnLowValue" placeholder="请输入预警下限">
              <template #append>
                <el-select
                  v-model="formData.warnUnit"
                  placeholder="单位"
                  style="width: 80px;"
                >
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_VALUE_UNIT)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item :label="'低位预警\n消息模板'" prop="lowMsgTemplateId" class="msg-template-label">
            <el-input v-model="formData.lowMsgTemplate" placeholder="请选择低位预警消息模板" readonly>
              <template #append>
                <el-button @click="openWarnMsgTemplateList">
                  <Icon icon="ep:search" /> 选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预警上限" prop="warnHighValue">
            <el-input v-model="formData.warnHighValue" placeholder="请输入预警上限">
              <template #append>
                <el-select
                  v-model="formData.warnUnit"
                  placeholder="单位"
                  style="width: 80px;"
                >
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_VALUE_UNIT)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item :label="'高位预警\n消息模板'" prop="highMsgTemplateId" class="msg-template-label">
            <el-input v-model="formData.highMsgTemplate" placeholder="请选择高位预警消息模板" readonly>
              <template #append>
                <el-button @click="openWarnMsgTemplateList2">
                  <Icon icon="ep:search" /> 选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

<!--  选择预警消息模板-->
  <SelectWarnMsgTemplate
    ref="selectWarnMsgTemplateRef"
    @success="handleSelectWarnMsgTemplate"
  />
  <SelectWarnMsgTemplate
    ref="selectWarnMsgTemplateRef2"
    @success="handleSelectWarnMsgTemplate2"
  />
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { WarningRuleApi, WarningRuleVO } from '@/api/kaizhou/warningrule'
import {WarningMsgTemplateVO} from "@/api/kaizhou/warningmsgtemplate";
import SelectWarnMsgTemplate from "@/views/kaizhou/warningrule/component/SelectWarnMsgTemplate.vue";

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
  lowMsgTemplate: undefined,
  highMsgTemplate: undefined,
} as any)
const formRules = reactive({
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  warnLowValue: [{ required: true, message: '预警下限不能为空', trigger: 'blur' }],
  warnHighValue: [{ required: true, message: '预警上限不能为空', trigger: 'blur' }],
  warnUnit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
  lowMsgTemplate: [{ required: true, message: '低位预警消息模板不能为空', trigger: 'blur' }],
  highMsgTemplate: [{ required: true, message: '高位预警消息模板不能为空', trigger: 'blur' }],
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
    lowMsgTemplate: undefined,
    highMsgTemplate: undefined,
  }
  formRef.value?.resetFields()
}

const selectWarnMsgTemplateRef = ref() // 选择的预警消息模板
const openWarnMsgTemplateList = () => {
  console.log('selectWarnMsgTemplateRef', selectWarnMsgTemplateRef.value)
  selectWarnMsgTemplateRef.value.open()
}

const handleSelectWarnMsgTemplate = (template: WarningMsgTemplateVO) => {
  console.log('template', template[0].id)
  // 传回选择的模板id
  formData.value.lowMsgTemplateId = String(template[0].id)
  formData.value.lowMsgTemplate = String(template[0].msgTitle)
}

const selectWarnMsgTemplateRef2 = ref() // 选择的预警消息模板
const openWarnMsgTemplateList2 = () => {
  selectWarnMsgTemplateRef2.value.open()
}

const handleSelectWarnMsgTemplate2 = (template: WarningMsgTemplateVO) => {
  // 传回选择的模板id
  formData.value.highMsgTemplateId = String(template[0].id)
  formData.value.highMsgTemplate = String(template[0].msgTitle)
}
</script>


<style scoped lang="scss">
:deep(.el-form-item.msg-template-label .el-form-item__label) {
  white-space: pre-line; /*换行显示*/
  height: 36px; /*设置lable高度，与input高度一样*/
  line-height: 18px !important; /*设置行高为label高度的一半（有n行就是label高度的1/n）*/
}

</style>
