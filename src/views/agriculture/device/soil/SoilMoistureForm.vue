<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备id" prop="equId">
        <el-input v-model="formData.equId" placeholder="请输入设备id" />
      </el-form-item>
      <el-form-item label="采集时间" prop="gatherTime">
        <el-date-picker
          v-model="formData.gatherTime"
          type="date"
          value-format="x"
          placeholder="选择采集时间"
        />
      </el-form-item>
      <el-form-item label="土壤温度" prop="soilTemperature">
        <el-input v-model="formData.soilTemperature" placeholder="请输入土壤温度" />
      </el-form-item>
      <el-form-item label="土壤湿度" prop="soilHumidity">
        <el-input v-model="formData.soilHumidity" placeholder="请输入土壤湿度" />
      </el-form-item>
      <el-form-item label="PH值" prop="soilPh">
        <el-input v-model="formData.soilPh" placeholder="请输入PH值" />
      </el-form-item>
      <el-form-item label="EC值" prop="soilEc">
        <el-input v-model="formData.soilEc" placeholder="请输入EC值" />
      </el-form-item>
      <el-form-item label="土壤深度" prop="soilDepth">
        <el-input v-model="formData.soilDepth" placeholder="请输入土壤深度" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { SoilMoistureApi, SoilMoistureVO } from '@/api/agriculture/soilmoisture'

/** 土壤墒情 表单 */
defineOptions({ name: 'SoilMoistureForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  equId: undefined,
  gatherTime: undefined,
  soilTemperature: undefined,
  soilHumidity: undefined,
  soilPh: undefined,
  soilEc: undefined,
  soilDepth: undefined,
})
const formRules = reactive({
  gatherTime: [{ required: true, message: '采集时间不能为空', trigger: 'blur' }],
  soilTemperature: [{ required: true, message: '土壤温度不能为空', trigger: 'blur' }],
  soilHumidity: [{ required: true, message: '土壤湿度不能为空', trigger: 'blur' }],
  soilPh: [{ required: true, message: 'PH值不能为空', trigger: 'blur' }],
  soilEc: [{ required: true, message: 'EC值不能为空', trigger: 'blur' }],
  soilDepth: [{ required: true, message: '土壤深度不能为空', trigger: 'blur' }],
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
      formData.value = await SoilMoistureApi.getSoilMoisture(id)
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
    const data = formData.value as unknown as SoilMoistureVO
    if (formType.value === 'create') {
      await SoilMoistureApi.createSoilMoisture(data)
      message.success(t('common.createSuccess'))
    } else {
      await SoilMoistureApi.updateSoilMoisture(data)
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
    equId: undefined,
    gatherTime: undefined,
    soilTemperature: undefined,
    soilHumidity: undefined,
    soilPh: undefined,
    soilEc: undefined,
    soilDepth: undefined,
  }
  formRef.value?.resetFields()
}
</script>
