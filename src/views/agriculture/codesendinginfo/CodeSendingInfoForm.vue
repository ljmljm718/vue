<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="源码" prop="codeContent">
        <Editor v-model="formData.codeContent" height="150px" />
      </el-form-item>
      <el-form-item label="模板ID" prop="templateId">
        <el-input v-model="formData.templateId" placeholder="请输入模板ID" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formData.productName" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="生产商" prop="producer">
        <el-input v-model="formData.producer" placeholder="请输入生产商" />
      </el-form-item>
      <el-form-item label="原产地" prop="sourceArea">
        <el-input v-model="formData.sourceArea" placeholder="请输入原产地" />
      </el-form-item>
      <el-form-item label="产品认证" prop="productCertification">
        <el-input v-model="formData.productCertification" placeholder="请输入产品认证" />
      </el-form-item>
      <el-form-item label="生产时间" prop="productionTime">
        <el-date-picker
          v-model="formData.productionTime"
          type="date"
          value-format="x"
          placeholder="选择生产时间"
        />
      </el-form-item>
      <el-form-item label="是否赋码" prop="codeType">
        <el-select v-model="formData.codeType" placeholder="请选择是否赋码">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="batchNum">
        <el-input v-model="formData.batchNum" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="备用字段" prop="prepareOne">
        <el-input v-model="formData.prepareOne" placeholder="请输入备用字段" />
      </el-form-item>
      <el-form-item label="备用字段" prop="prepareTwo">
        <el-input v-model="formData.prepareTwo" placeholder="请输入备用字段" />
      </el-form-item>
      <el-form-item label="备用字段" prop="prepareThree">
        <el-input v-model="formData.prepareThree" placeholder="请输入备用字段" />
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
import { CodeSendingInfoApi, CodeSendingInfoVO } from '@/api/agriculture/codesendinginfo'

/** 发码记录 表单 */
defineOptions({ name: 'CodeSendingInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  codeContent: undefined,
  templateId: undefined,
  productName: undefined,
  producer: undefined,
  sourceArea: undefined,
  productCertification: undefined,
  productionTime: undefined,
  codeType: undefined,
  batchNum: undefined,
  prepareOne: undefined,
  prepareTwo: undefined,
  prepareThree: undefined,
  remark: undefined
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
      formData.value = await CodeSendingInfoApi.getCodeSendingInfo(id)
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
    const data = formData.value as unknown as CodeSendingInfoVO
    if (formType.value === 'create') {
      await CodeSendingInfoApi.createCodeSendingInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await CodeSendingInfoApi.updateCodeSendingInfo(data)
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
    codeContent: undefined,
    templateId: undefined,
    productName: undefined,
    producer: undefined,
    sourceArea: undefined,
    productCertification: undefined,
    productionTime: undefined,
    codeType: undefined,
    batchNum: undefined,
    prepareOne: undefined,
    prepareTwo: undefined,
    prepareThree: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>