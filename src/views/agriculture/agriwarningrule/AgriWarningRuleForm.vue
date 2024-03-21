<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" style="width: 1000px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则标题" prop="ruleTitle">
            <el-input v-model="formData.ruleTitle" placeholder="请输入规则标题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
        <el-col :span="12">
          <el-form-item label="规则类型" prop="warnType">
            <el-select v-model="formData.warnType" placeholder="请选择规则类型">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人" prop="responsiblePerson">
            <el-input v-model="formData.responsiblePerson" placeholder="请输入责任人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预警下限" prop="warnLowValue">
            <el-input v-model="formData.warnLowValue" placeholder="请输入预警下限" type="number">
              <template #append>
                <el-select
                  v-model="formData.warnUnit"
                  placeholder="单位"
                  style="width: 80px;"
                >
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_UNIT)"
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
          <el-form-item label="低位预警消息" prop="lowMsg">
            <el-input v-model="formData.lowMsg" placeholder="请输入低位预警消息" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预警上限" prop="warnHighValue">
            <el-input v-model="formData.warnHighValue" placeholder="请输入预警上限" type="number">
              <template #append>
                <el-select
                  v-model="formData.warnUnit"
                  placeholder="单位"
                  style="width: 80px;"
                >
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_UNIT)"
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
          <el-form-item label="高位预警消息" prop="highMsg">
            <el-input v-model="formData.highMsg" placeholder="请输入高位预警消息" />
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-form-item label="备注" prop="remark">-->
<!--        <el-input v-model="formData.remark" placeholder="请输入备注" />-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { AgriWarningRuleApi, AgriWarningRuleVO } from '@/api/agriculture/agriwarningrule'

/** 鲁渝协作预警规则 表单 */
defineOptions({ name: 'AgriWarningRuleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  highMsg: undefined,
  responsiblePersonId: undefined,
  responsiblePerson: undefined,
  remark: undefined,
  warnType: undefined,
  effectiveStatus: undefined,
  ruleTitle: undefined,
})
const formRules = reactive({
  warnLowValue: [{ required: true, message: '预警下限不能为空', trigger: 'blur' }],
  warnHighValue: [{ required: true, message: '预警上限不能为空', trigger: 'blur' }],
  warnType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  effectiveStatus: [{ required: true, message: '生效状态（0-未生效，1-生效）不能为空', trigger: 'blur' }],
  ruleTitle: [{ required: true, message: '规则标题不能为空', trigger: 'blur' }],
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
      formData.value = await AgriWarningRuleApi.getAgriWarningRule(id)
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
    const data = formData.value as unknown as AgriWarningRuleVO
    if (formType.value === 'create') {
      await AgriWarningRuleApi.createAgriWarningRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await AgriWarningRuleApi.updateAgriWarningRule(data)
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
    warnLowValue: undefined,
    warnHighValue: undefined,
    warnUnit: undefined,
    lowMsg: undefined,
    highMsg: undefined,
    responsiblePersonId: undefined,
    responsiblePerson: undefined,
    remark: undefined,
    warnType: undefined,
    effectiveStatus: undefined,
    ruleTitle: undefined,
  }
  formRef.value?.resetFields()
}
</script>
