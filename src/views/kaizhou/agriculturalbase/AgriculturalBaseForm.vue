<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="登记证号" prop="code">
        <el-input v-model="formData.code" placeholder="请输入登记证号" />
      </el-form-item>
      <el-form-item label="农资名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入农资名称" />
      </el-form-item>
      <el-form-item label="农资类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择农资类型" style="width: 100%;">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_AGRICULTURAL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品规格" prop="size">
        <el-input v-model="formData.size" placeholder="请输入产品规格" />
      </el-form-item>
      <el-form-item label="包装关系" prop="packageRelation">
        <el-input v-model="formData.packageRelation" placeholder="请输入包装关系" />
      </el-form-item>
      <el-form-item label="采购公司" prop="company">
        <el-input v-model="formData.company" placeholder="请输入采购公司" />
      </el-form-item>
      <el-form-item label="采购单价" prop="price">
        <el-input v-model="formData.price" placeholder="请输入采购单价" />
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
import { AgriculturalBaseApi, AgriculturalBaseVO } from '@/api/kaizhou/agriculturalbase'

/** 农资基础信息 表单 */
defineOptions({ name: 'AgriculturalBaseForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  type: undefined,
  size: undefined,
  company: undefined,
  price: undefined,
  remark: undefined,
  packageRelation: undefined,
})
const formRules = reactive({
  code: [{ required: true, message: '登记证号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '农资名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '农资类型不能为空', trigger: 'change' }],
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
      formData.value = await AgriculturalBaseApi.getAgriculturalBase(id)
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
    const data = formData.value as unknown as AgriculturalBaseVO
    if (formType.value === 'create') {
      await AgriculturalBaseApi.createAgriculturalBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await AgriculturalBaseApi.updateAgriculturalBase(data)
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
    code: undefined,
    name: undefined,
    type: undefined,
    size: undefined,
    company: undefined,
    price: undefined,
    remark: undefined,
    packageRelation: undefined,
  }
  formRef.value?.resetFields()
}
</script>
