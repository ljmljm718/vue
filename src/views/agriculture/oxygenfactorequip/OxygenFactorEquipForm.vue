<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="因素ID" prop="factorId">
        <el-input v-model="formData.factorId" placeholder="请输入因素ID" />
      </el-form-item>
      <el-form-item label="增氧设备ID" prop="equipId">
        <el-input v-model="formData.equipId" placeholder="请输入增氧设备ID" />
      </el-form-item>
      <el-form-item label="基地ID" prop="baseId">
        <el-input v-model="formData.baseId" placeholder="请输入基地ID" />
      </el-form-item>
      <el-form-item label="地块ID" prop="plotId">
        <el-input v-model="formData.plotId" placeholder="请输入地块ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OxygenFactorEquipApi, OxygenFactorEquipVO } from '@/api/agriculture/oxygenfactorequip'

/** 溶解氧因素与增氧设备关联 表单 */
defineOptions({ name: 'OxygenFactorEquipForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  factorId: undefined,
  equipId: undefined,
  baseId: undefined,
  plotId: undefined,
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
      formData.value = await OxygenFactorEquipApi.getOxygenFactorEquip(id)
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
    const data = formData.value as unknown as OxygenFactorEquipVO
    if (formType.value === 'create') {
      await OxygenFactorEquipApi.createOxygenFactorEquip(data)
      message.success(t('common.createSuccess'))
    } else {
      await OxygenFactorEquipApi.updateOxygenFactorEquip(data)
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
    factorId: undefined,
    equipId: undefined,
    baseId: undefined,
    plotId: undefined,
  }
  formRef.value?.resetFields()
}
</script>