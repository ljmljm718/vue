<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="溯源码" prop="traceCode">
        <el-input v-model="formData.traceCode" placeholder="请输入溯源码" />
      </el-form-item>
      <el-form-item label="产品id" prop="productId">
        <el-input v-model="formData.productId" placeholder="请输入产品id" />
      </el-form-item>
      <el-form-item label="生产商id" prop="producerId">
        <el-input v-model="formData.producerId" placeholder="请输入生产商id" />
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="formData.batchCode" placeholder="请输入批次号" />
      </el-form-item>
      <el-form-item label="溯源时间" prop="traceTime">
        <el-date-picker
          v-model="formData.traceTime"
          type="date"
          value-format="x"
          placeholder="选择溯源时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TraceRecordApi, TraceRecordVO } from '@/api/agriculture/tracerecord'

/** 溯源记录 表单 */
defineOptions({ name: 'TraceRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  traceCode: undefined,
  productId: undefined,
  producerId: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  batchCode: undefined,
  traceTime: undefined,
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
      formData.value = await TraceRecordApi.getTraceRecord(id)
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
    const data = formData.value as unknown as TraceRecordVO
    if (formType.value === 'create') {
      await TraceRecordApi.createTraceRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await TraceRecordApi.updateTraceRecord(data)
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
    traceCode: undefined,
    productId: undefined,
    producerId: undefined,
    reserveOne: undefined,
    reserveTwo: undefined,
    batchCode: undefined,
    traceTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>
