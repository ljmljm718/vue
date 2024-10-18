<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="主表ID" prop="mainTableId">
        <el-input v-model="formData.mainTableId" placeholder="请输入主表ID" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model="formData.quantity" placeholder="请输入数量" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="密度" prop="density">
        <el-input v-model="formData.density" placeholder="请输入密度" />
      </el-form-item>
      <el-form-item label="识别时间" prop="recognitionTime">
        <el-date-picker
          v-model="formData.recognitionTime"
          type="datetime"
          value-format="x"
          placeholder="选择识别时间"
        />
      </el-form-item>
      <el-form-item label="识别类型" prop="recognitionType">
        <el-select v-model="formData.recognitionType" placeholder="请选择识别类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_RECOGNITION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="记录人" prop="recorder">
        <el-input v-model="formData.recorder" placeholder="请输入记录人" />
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
import { IdentificationResultApi, IdentificationResultVO } from '@/api/agriculture/identificationresult'

/** 识别结果 表单 */
defineOptions({ name: 'IdentificationResultForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  mainTableId: undefined,
  name: undefined,
  quantity: undefined,
  density: undefined,
  recognitionTime: undefined,
  recognitionType: undefined,
  recorder: undefined
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
      formData.value = await IdentificationResultApi.getIdentificationResult(id)
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
    const data = formData.value as unknown as IdentificationResultVO
    if (formType.value === 'create') {
      await IdentificationResultApi.createIdentificationResult(data)
      message.success(t('common.createSuccess'))
    } else {
      await IdentificationResultApi.updateIdentificationResult(data)
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
    mainTableId: undefined,
    name: undefined,
    quantity: undefined,
    density: undefined,
    recognitionTime: undefined,
    recognitionType: undefined,
    recorder: undefined
  }
  formRef.value?.resetFields()
}
</script>