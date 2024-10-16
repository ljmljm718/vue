<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="地块ID" prop="landBlockId">
        <el-input v-model="formData.landBlockId" placeholder="请输入地块ID" />
      </el-form-item>
      <el-form-item label="作物" prop="crop">
        <el-input v-model="formData.crop" placeholder="请输入作物" />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="formData.date"
          type="datetime"
          value-format="x"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input v-model="formData.category" placeholder="请输入类别" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="formData.unit" placeholder="请输入单位" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { StatisticalIntermediateTableApi, StatisticalIntermediateTableVO } from '@/api/agriculture/statisticalintermediatetable'

/** 统计中间 表单 */
defineOptions({ name: 'StatisticalIntermediateTableForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  landBlockId: undefined,
  crop: undefined,
  date: undefined,
  category: undefined,
  name: undefined,
  quantity: undefined,
  unit: undefined
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
      formData.value = await StatisticalIntermediateTableApi.getStatisticalIntermediateTable(id)
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
    const data = formData.value as unknown as StatisticalIntermediateTableVO
    if (formType.value === 'create') {
      await StatisticalIntermediateTableApi.createStatisticalIntermediateTable(data)
      message.success(t('common.createSuccess'))
    } else {
      await StatisticalIntermediateTableApi.updateStatisticalIntermediateTable(data)
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
    landBlockId: undefined,
    crop: undefined,
    date: undefined,
    category: undefined,
    name: undefined,
    quantity: undefined,
    unit: undefined
  }
  formRef.value?.resetFields()
}
</script>