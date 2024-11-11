<template>
  <Dialog title="库存预警配置" v-model="dialogVisible" width="400">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
<!--      <el-form-item label="产品编号" prop="productId">
        <el-input v-model="formData.productId" placeholder="请输入产品编号" />
      </el-form-item>-->
      <el-form-item label="库存阈值" prop="threshold">
        <el-input v-model="formData.threshold" type="number"/>
      </el-form-item>
<!--      <el-form-item label="采购数量" prop="purchaseNum">
        <el-input v-model="formData.purchaseNum" type="number"/>
      </el-form-item>-->
      <el-form-item label="状态" prop="warnStatus">
        <el-radio-group v-model="formData.warnStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_PROCESS_FIXED)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">保 存</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StockWarnApi, StockWarnVO } from '@/api/agriculture/stockwarn'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

/** 库存预警配置 表单 */
defineOptions({ name: 'StockWarnConfiguration' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const stockId = ref() // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  productId: undefined,
  threshold: undefined,
  warnStatus: undefined,
  purchaseNum: undefined,
})
const formRules = reactive({
  warnStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  threshold: [{ required: true, message: '库存阈值不能为空', trigger: 'blur' }],
  purchaseNum: [{ required: true, message: '采购数量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  stockId.value = id
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
  await message.confirm("是否保存预警配置信息？")
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as StockWarnVO
    data.productId = stockId.value
    if (data.id != null) {
      await StockWarnApi.updateStockWarn(data)
      message.success(t('common.updateSuccess'))
    } else {
      await StockWarnApi.createStockWarn(data)
      message.success(t('common.createSuccess'))
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
  }
  formRef.value?.resetFields()
}
</script>
