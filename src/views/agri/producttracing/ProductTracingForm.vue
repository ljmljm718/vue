<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
<!--      <el-form-item label="产品码" prop="productCode">-->
<!--        <el-input v-model="formData.productCode" placeholder="请输入产品码" />-->
<!--      </el-form-item>-->
      <el-form-item label="开始码" prop="startNum" v-if="formType === 'create'">
        <el-input v-model="formData.startNum" placeholder="请输入开始码" type="number" min="1"
        oninput="value=value.replace(/[^\d]/g,'')"/>
      </el-form-item>
      <el-form-item label="结束码" prop="endNum" v-if="formType === 'create'">
        <el-input v-model="formData.endNum" placeholder="请输入结束码" type="number"
                  oninput="value=value.replace(/[^\d]/g,'')"/>
      </el-form-item>
      <el-form-item label="企业名称" prop="firmName">
        <el-input v-model="formData.firmName" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item label="原产地" prop="sourceArea">
        <el-input v-model="formData.sourceArea" placeholder="请输入原产地" />
      </el-form-item>
      <el-form-item label="产品认证" prop="productApprove">
        <el-input v-model="formData.productApprove" placeholder="请输入产品认证" />
      </el-form-item>
      <el-form-item label="生产时间" prop="yieldTime">
        <el-date-picker
          v-model="formData.yieldTime"
          type="datetime"
          value-format="x"
          placeholder="选择生产时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProductTracingApi, ProductTracingVO } from '@/api/agri/producttracing'

/** 稻米产品溯源管理 表单 */
defineOptions({ name: 'ProductTracingForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  productCode: undefined,
  firmName: undefined,
  sourceArea: undefined,
  yieldTime: undefined,
  productApprove: undefined,
  remark: undefined,
  receiptStartTime: undefined,
  receiptEndTime: undefined,
  batchCode: undefined,
  startNum: '',
  endNum: '',
  batchQrImg: undefined
})
const formRules = reactive({
  firmName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
  sourceArea: [{ required: true, message: '原产地不能为空', trigger: 'blur' }],
  yieldTime: [{ required: true, message: '生产时间不能为空', trigger: 'blur' }],
  startNum: [ [
    { required: true, message: '请输入开始码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入整数值'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]],
  endNum: [ [
    { required: true, message: '请输入结束码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入整数值'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]]
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
      formData.value = await ProductTracingApi.getProductTracing(id)
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
    const data = formData.value as unknown as ProductTracingVO
    if (formType.value === 'create') {
      await ProductTracingApi.createProductTracing(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductTracingApi.updateProductTracing(data)
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
    productCode: undefined,
    firmName: undefined,
    sourceArea: undefined,
    yieldTime: undefined,
    productApprove: undefined,
    remark: undefined,
    receiptStartTime: undefined,
    receiptEndTime: undefined,
    batchCode: undefined,
    startNum: '',
    endNum: '',
    batchQrImg: undefined
  }
  formRef.value?.resetFields()
}
</script>
