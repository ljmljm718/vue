<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="农资主键" prop="agriculturalId">
        <el-input v-model="formData.agriculturalId" placeholder="请输入农资主键" />
      </el-form-item>
      <el-form-item label="农资名称" prop="agriculturalName">
        <el-input v-model="formData.agriculturalName" placeholder="请输入农资名称" />
      </el-form-item>
      <el-form-item label="农资规格" prop="agriculturalSize">
        <el-input v-model="formData.agriculturalSize" placeholder="请输入农资规格" />
      </el-form-item>
      <el-form-item label="采购单号" prop="purchaseId">
        <el-input v-model="formData.purchaseId" placeholder="请输入采购单号" />
      </el-form-item>
      <el-form-item label="采购日期" prop="purchaseTime">
        <el-date-picker
          v-model="formData.purchaseTime"
          type="datetime"
          value-format="x"
          placeholder="选择采购日期"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierName">
        <el-input v-model="formData.supplierName" placeholder="请输入供应商" />
      </el-form-item>
      <el-form-item label="采购单价" prop="purchasePrice">
        <el-input v-model="formData.purchasePrice" placeholder="请输入采购单价" />
      </el-form-item>
      <el-form-item label="采购数量" prop="purchaseNum">
        <el-input v-model="formData.purchaseNum" placeholder="请输入采购数量" />
      </el-form-item>
      <el-form-item label="采购金额" prop="totalPrice">
        <el-input v-model="formData.totalPrice" placeholder="请输入采购金额" />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-radio-group v-model="formData.orderStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_AGRICULTURAL_ORDER_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生产日期" prop="productionDate">
        <el-date-picker
          v-model="formData.productionDate"
          type="date"
          value-format="x"
          placeholder="选择生产日期"
        />
      </el-form-item>
      <el-form-item label="有效日期" prop="expirationDate">
        <el-date-picker
          v-model="formData.expirationDate"
          type="date"
          value-format="x"
          placeholder="选择有效日期"
        />
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
import { AgriculturalPurchaseApi, AgriculturalPurchaseVO } from '@/api/kaizhou/agriculturalpurchase'

/** 农资采购信息 表单 */
defineOptions({ name: 'AgriculturalPurchaseForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  agriculturalId: undefined,
  agriculturalName: undefined,
  agriculturalSize: undefined,
  purchaseId: undefined,
  purchaseTime: undefined,
  supplierName: undefined,
  purchasePrice: undefined,
  purchaseNum: undefined,
  totalPrice: undefined,
  orderStatus: undefined,
  productionDate: undefined,
  expirationDate: undefined,
  remark: undefined,
})
const formRules = reactive({
  agriculturalId: [{ required: true, message: '农资主键不能为空', trigger: 'blur' }],
  agriculturalName: [{ required: true, message: '农资名称不能为空', trigger: 'blur' }],
  agriculturalSize: [{ required: true, message: '农资规格不能为空', trigger: 'blur' }],
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
      formData.value = await AgriculturalPurchaseApi.getAgriculturalPurchase(id)
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
    const data = formData.value as unknown as AgriculturalPurchaseVO
    if (formType.value === 'create') {
      await AgriculturalPurchaseApi.createAgriculturalPurchase(data)
      message.success(t('common.createSuccess'))
    } else {
      await AgriculturalPurchaseApi.updateAgriculturalPurchase(data)
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
    agriculturalId: undefined,
    agriculturalName: undefined,
    agriculturalSize: undefined,
    purchaseId: undefined,
    purchaseTime: undefined,
    supplierName: undefined,
    purchasePrice: undefined,
    purchaseNum: undefined,
    totalPrice: undefined,
    orderStatus: undefined,
    productionDate: undefined,
    expirationDate: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
