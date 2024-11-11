<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="库存编号" prop="productId">
        <el-input v-model="formData.productId" placeholder="请输入库存编号" />
      </el-form-item>
      <el-form-item label="阈值" prop="threshold">
        <el-input v-model="formData.threshold" placeholder="请输入阈值" />
      </el-form-item>
      <el-form-item label="采购数量" prop="purchaseNum">
        <el-input v-model="formData.purchaseNum" placeholder="请输入采购数量" />
      </el-form-item>
      <el-form-item label="状态" prop="warnStatus">
        <el-radio-group v-model="formData.warnStatus">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StockWarnApi, StockWarnVO } from '@/api/agriculture/stockwarn'

/** 库存预警配置 表单 */
defineOptions({ name: 'StockWarnForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  productId: undefined,
  threshold: undefined,
  purchaseNum: undefined,
  warnStatus: undefined,
})
const formRules = reactive({
  productId: [{ required: true, message: '库存编号不能为空', trigger: 'blur' }],
  threshold: [{ required: true, message: '阈值不能为空', trigger: 'blur' }],
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
      formData.value = await StockWarnApi.getStockWarn(id)
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
    const data = formData.value as unknown as StockWarnVO
    if (formType.value === 'create') {
      await StockWarnApi.createStockWarn(data)
      message.success(t('common.createSuccess'))
    } else {
      await StockWarnApi.updateStockWarn(data)
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
    productId: undefined,
    threshold: undefined,
    purchaseNum: undefined,
    warnStatus: undefined,
  }
  formRef.value?.resetFields()
}
</script>
