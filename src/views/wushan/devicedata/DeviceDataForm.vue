<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备名称" prop="deviceName">
<!--        <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" />-->
        <el-input v-model="formData.deviceName" placeholder="请输入设备编号" readonly>
          <template #append>
            <el-button @click="openSelectDevice">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
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
      <el-form-item label="监测类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择监测类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_DATA_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据值" prop="dataValue">
        <el-input v-model="formData.dataValue" placeholder="请输入数据值" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="formData.unit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="采集时间" prop="collectTime">
        <el-date-picker
          v-model="formData.collectTime"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择采集时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <SelectDevice
    ref="selectDeviceRef"
    @success="handleSelectDeviceChange"
  />
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { DeviceDataApi, DeviceDataVO } from '@/api/kaizhou/devicedata'
import SelectDevice from "@/views/kaizhou/warningrecord/component/SelectDevice.vue";
import {DeviceBaseVO} from "@/api/kaizhou/devicebase";

/** 设备数据 表单 */
defineOptions({ name: 'DeviceDataForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceCode: undefined,
  deviceType: undefined,
  type: undefined,
  dataValue: undefined,
  unit: undefined,
  collectTime: undefined,
  deviceName: undefined,
  belongPark: undefined, // 所属基地
  belongPlot: undefined, // 所属地块
  belongParkName: undefined, // 所属基地名称
  belongPlotName: undefined, // 所属地块名称
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
      formData.value = await DeviceDataApi.getDeviceData(id)
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
    const data = formData.value as unknown as DeviceDataVO
    if (formType.value === 'create') {
      await DeviceDataApi.createDeviceData(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeviceDataApi.updateDeviceData(data)
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
    deviceCode: undefined,
    deviceType: undefined,
    type: undefined,
    dataValue: undefined,
    unit: undefined,
    collectTime: undefined,
    deviceName: undefined,
    belongPark: undefined, // 所属基地
    belongPlot: undefined, // 所属地块
    belongParkName: undefined, // 所属基地名称
    belongPlotName: undefined, // 所属地块名称
  }
  formRef.value?.resetFields()
}

const selectDeviceRef = ref()
const openSelectDevice = () => {
  selectDeviceRef.value.open()
}
const handleSelectDeviceChange = (order: DeviceBaseVO) => {
  console.log("1231421")
  console.log(order[0])
  formData.value.deviceCode = String(order[0].deviceCode)
  formData.value.deviceName = String(order[0].deviceName)
  formData.value.belongPark = String(order[0].belongPark)
  formData.value.belongPlot = String(order[0].belongPlot)
  formData.value.belongParkName = String(order[0].belongParkName)
  formData.value.belongPlotName = String(order[0].belongPlotName)
}
</script>
