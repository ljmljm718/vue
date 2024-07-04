<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="计划流水号" prop="planNumber">
        <el-input v-model="formData.planNumber" placeholder="请输入计划流水号" />
      </el-form-item>
      <el-form-item label="赠送记录流水号" prop="recordNumber">
        <el-input v-model="formData.recordNumber" placeholder="请输入赠送记录流水号" />
      </el-form-item>
      <el-form-item label="赠送方用户" prop="presenterId">
        <el-input v-model="formData.presenterId" placeholder="请输入赠送方用户" />
      </el-form-item>
      <el-form-item label="赠送时间" prop="dealTime">
        <el-date-picker
          v-model="formData.dealTime"
          type="date"
          value-format="x"
          placeholder="选择赠送时间"
        />
      </el-form-item>
      <el-form-item label="原始订单流水号" prop="oldOrderNumber">
        <el-input v-model="formData.oldOrderNumber" placeholder="请输入原始订单流水号" />
      </el-form-item>
      <el-form-item label="领取状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="接收方用户" prop="recipientId">
        <el-input v-model="formData.recipientId" placeholder="请输入接收方用户" />
      </el-form-item>
      <el-form-item label="接收时间" prop="receptionTime">
        <el-date-picker
          v-model="formData.receptionTime"
          type="date"
          value-format="x"
          placeholder="选择接收时间"
        />
      </el-form-item>
      <el-form-item label="新订单流水号" prop="newOrderNumber">
        <el-input v-model="formData.newOrderNumber" placeholder="请输入新订单流水号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { GiftRecordApi, GiftRecordVO } from '@/api/agriculture/giftrecord'

/** 赠送记录 表单 */
defineOptions({ name: 'GiftRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planNumber: undefined,
  recordNumber: undefined,
  presenterId: undefined,
  dealTime: undefined,
  oldOrderNumber: undefined,
  status: undefined,
  remark: undefined,
  recipientId: undefined,
  receptionTime: undefined,
  newOrderNumber: undefined
})
const formRules = reactive({
  planNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  recordNumber: [{ required: true, message: '赠送记录流水号不能为空', trigger: 'blur' }],
  presenterId: [{ required: true, message: '赠送方用户不能为空', trigger: 'blur' }],
  dealTime: [{ required: true, message: '赠送时间不能为空', trigger: 'blur' }],
  oldOrderNumber: [{ required: true, message: '原始订单流水号不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '领取状态不能为空', trigger: 'blur' }]
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
      formData.value = await GiftRecordApi.getGiftRecord(id)
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
    const data = formData.value as unknown as GiftRecordVO
    if (formType.value === 'create') {
      await GiftRecordApi.createGiftRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await GiftRecordApi.updateGiftRecord(data)
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
    planNumber: undefined,
    recordNumber: undefined,
    presenterId: undefined,
    dealTime: undefined,
    oldOrderNumber: undefined,
    status: undefined,
    remark: undefined,
    recipientId: undefined,
    receptionTime: undefined,
    newOrderNumber: undefined
  }
  formRef.value?.resetFields()
}
</script>
