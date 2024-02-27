<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="消息标题" prop="msgTitle">
        <el-input v-model="formData.msgTitle" placeholder="请输入消息标题" />
      </el-form-item>
      <el-form-item label="消息内容" prop="msgContent">
        <el-input v-model="formData.msgContent" type="textarea" placeholder="请输入消息内容" />
      </el-form-item>
      <el-form-item label="消息类型" prop="msgType">
        <el-select v-model="formData.msgType" placeholder="请选择消息类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_MSG_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消息级别" prop="msgLevel">
        <el-select v-model="formData.msgLevel" placeholder="请选择消息级别">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_MSG_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { WarningMsgTemplateApi, WarningMsgTemplateVO } from '@/api/kaizhou/warningmsgtemplate'

/** 预警消息模板 表单 */
defineOptions({ name: 'WarningMsgTemplateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  msgTitle: undefined,
  msgContent: undefined,
  msgType: undefined,
  msgLevel: undefined,
  remark: undefined,
})
const formRules = reactive({
  msgTitle: [{ required: true, message: '消息标题不能为空', trigger: 'blur' }],
  msgContent: [{ required: true, message: '消息内容不能为空', trigger: 'blur' }],
  msgType: [{ required: true, message: '消息类型不能为空', trigger: 'change' }],
  msgLevel: [{ required: true, message: '消息级别不能为空', trigger: 'change' }],
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
      formData.value = await WarningMsgTemplateApi.getWarningMsgTemplate(id)
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
    const data = formData.value as unknown as WarningMsgTemplateVO
    if (formType.value === 'create') {
      await WarningMsgTemplateApi.createWarningMsgTemplate(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarningMsgTemplateApi.updateWarningMsgTemplate(data)
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
    msgTitle: undefined,
    msgContent: undefined,
    msgType: undefined,
    msgLevel: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>