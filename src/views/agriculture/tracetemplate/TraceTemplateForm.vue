<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="formData.templateName" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="生产商" prop="mfrsId">
        <el-input v-model="formData.mfrsId" placeholder="请输入生产商" />
      </el-form-item>
      <el-form-item label="产地" prop="origin">
        <el-input v-model="formData.origin" placeholder="请输入产地" />
      </el-form-item>
      <el-form-item label="适用品牌" prop="brandId">
        <el-input v-model="formData.brandId" placeholder="请输入适用品牌" />
      </el-form-item>
      <el-form-item label="头部宣传图" prop="headerImg">
        <UploadImg v-model="formData.headerImg" />
      </el-form-item>
      <el-form-item label="产品展示图片" prop="productImgs">
        <UploadImgs v-model="formData.productImgs" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TraceTemplateApi, TraceTemplateVO } from '@/api/agriculture/tracetemplate'

/** 溯源模板 表单 */
defineOptions({ name: 'TraceTemplateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  templateName: undefined,
  mfrsId: undefined,
  origin: undefined,
  brandId: undefined,
  headerImg: undefined,
  productImg: undefined,
  remark: undefined,
  remark1: undefined,
  productImgs: undefined,
})
const formRules = reactive({
  templateName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
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
      formData.value = await TraceTemplateApi.getTraceTemplate(id)
      formData.value.productImgs = formData.value.productImg.split(",")
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
  formData.value.productImg = formData.value.productImgs.join(",")
  try {
    const data = formData.value as unknown as TraceTemplateVO
    if (formType.value === 'create') {
      await TraceTemplateApi.createTraceTemplate(data)
      message.success(t('common.createSuccess'))
    } else {
      await TraceTemplateApi.updateTraceTemplate(data)
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
    templateName: undefined,
    mfrsId: undefined,
    origin: undefined,
    brandId: undefined,
    headerImg: undefined,
    productImg: undefined,
    remark: undefined,
    remark1: undefined,
  }
  formRef.value?.resetFields()
}
</script>
