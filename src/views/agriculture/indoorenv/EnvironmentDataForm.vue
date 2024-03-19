<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        v-loading="formLoading"
    >
      <el-form-item label="设备编号" prop="deviceId">
        <el-input v-model="formData.deviceId" placeholder="请输入设备编号" />
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="formData.deviceType" placeholder="请选择设备类型">
          <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="温度" prop="temperature">
        <el-input v-model="formData.temperature" placeholder="请输入温度" />
      </el-form-item>
      <el-form-item label="湿度" prop="humidity">
        <el-input v-model="formData.humidity" placeholder="请输入湿度" />
      </el-form-item>
      <el-form-item label="光照" prop="lighting">
        <el-input v-model="formData.lighting" placeholder="请输入光照" />
      </el-form-item>
      <el-form-item label="降雨量" prop="rainfall">
        <el-input v-model="formData.rainfall" placeholder="请输入降雨量" />
      </el-form-item>
      <el-form-item label="大气压力" prop="airPressure">
        <el-input v-model="formData.airPressure" placeholder="请输入大气压力" />
      </el-form-item>
      <el-form-item label="二氧化碳浓度" prop="co2Density">
        <el-input v-model="formData.co2Density" placeholder="请输入二氧化碳浓度" />
      </el-form-item>
      <el-form-item label="数据上报时间" prop="reportDate">
        <el-date-picker
            v-model="formData.reportDate"
            type="date"
            value-format="x"
            placeholder="选择数据上报时间"
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
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { EnvironmentDataApi, EnvironmentDataVO } from '@/api/agriculture/environmentdata'

/** 环境数据 表单 */
defineOptions({ name: 'EnvironmentDataForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceId: undefined,
  temperature: undefined,
  humidity: undefined,
  lighting: undefined,
  windSpeed: undefined,
  rainfall: undefined,
  co2Density: undefined,
  reportDate: undefined,
  deviceType: undefined,
  airPressure: undefined,
})
const formRules = reactive({
  deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'change' }],
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
      formData.value = await EnvironmentDataApi.getEnvironmentData(id)
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
    const data = formData.value as unknown as EnvironmentDataVO
    if (formType.value === 'create') {
      await EnvironmentDataApi.createEnvironmentData(data)
      message.success(t('common.createSuccess'))
    } else {
      await EnvironmentDataApi.updateEnvironmentData(data)
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
    deviceId: undefined,
    temperature: undefined,
    humidity: undefined,
    lighting: undefined,
    windSpeed: undefined,
    rainfall: undefined,
    co2Density: undefined,
    reportDate: undefined,
    deviceType: undefined,
    airPressure: undefined,
  }
  formRef.value?.resetFields()
}
</script>
