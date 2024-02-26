<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="formData.productCode" placeholder="请输入产品编号" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formData.productName" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品种类" prop="productKind">
        <el-input v-model="formData.productKind" placeholder="请输入产品种类" />
      </el-form-item>
      <el-form-item label="产品描述" prop="productDescribe">
        <el-input v-model="formData.productDescribe" placeholder="请输入产品描述" />
      </el-form-item>
      <el-form-item label="标识码" prop="identificationCode">
        <el-input v-model="formData.identificationCode" placeholder="请输入标识码" />
      </el-form-item>
<!--      <el-form-item label="认证状态" prop="approveStatus">-->
<!--        <el-select v-model="formData.approveStatus" placeholder="请选择认证状态" style="width: 100%;">-->
<!--          <el-option-->
<!--            v-for="dict in getStrDictOptions(DICT_TYPE.APPROVE_STATUS)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="认证时间" prop="approveTime">-->
<!--        <el-date-picker-->
<!--          v-model="formData.approveTime"-->
<!--          type="date"-->
<!--          value-format="x"-->
<!--          placeholder="选择认证时间"-->
<!--        />-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { BasicProductApi, BasicProductVO } from '@/api/kaizhou/basicproduct'

/** 产品管理 表单 */
defineOptions({ name: 'BasicProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  productCode: undefined,
  productName: undefined,
  productKind: undefined,
  productDescribe: undefined,
  identificationCode: undefined,
  approveStatus: undefined,
  approveTime: undefined,
})
const formRules = reactive({
  productCode: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  productKind: [{ required: true, message: '产品种类不能为空', trigger: 'blur' }],
  productDescribe: [{ required: true, message: '产品描述不能为空', trigger: 'blur' }],
  identificationCode: [{ required: true, message: '标识码不能为空', trigger: 'blur' }],
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
      formData.value = await BasicProductApi.getBasicProduct(id)
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
    const data = formData.value as unknown as BasicProductVO
    if (formType.value === 'create') {
      await BasicProductApi.createBasicProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await BasicProductApi.updateBasicProduct(data)
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
    productName: undefined,
    productKind: undefined,
    productDescribe: undefined,
    identificationCode: undefined,
    approveStatus: '0',
    approveTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>
