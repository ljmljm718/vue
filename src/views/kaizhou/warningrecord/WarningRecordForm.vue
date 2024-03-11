<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90px"
      v-loading="formLoading"
    >
      <el-form-item label="设备编号" prop="deviceCode">
        <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" readonly>
          <template #append>
            <el-button @click="openSelectDevice">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="基地编号" prop="parkCode">
            <el-input v-model="formData.parkCode" placeholder="选择设备后自动带出" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地块编号" prop="plotCode">
            <el-input v-model="formData.plotCode" placeholder="选择设备后自动带出" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="预警标题" prop="warnTitle">
        <el-input v-model="formData.warnTitle" placeholder="请输入预警标题" />
      </el-form-item>
      <el-form-item label="预警信息" prop="warnInfo">
        <el-input v-model="formData.warnInfo" placeholder="请输入预警信息" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="当前值" prop="currentValue">
            <el-input v-model="formData.currentValue" placeholder="请输入当前值" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="阈值" prop="threshold">
            <el-input v-model="formData.threshold" placeholder="请输入阈值" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="formData.unit" placeholder="请选择单位" style="width: 100%;">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_VALUE_UNIT)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="预警时间" prop="warnTime">
            <el-date-picker
              v-model="formData.warnTime"
              type="datetime"
              value-format="x"
              placeholder="选择预警时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警状态" prop="warnStatus">
            <el-radio-group v-model="formData.warnStatus">
              <el-radio
                v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_STATUS)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="处理时间" prop="dealTime">
            <el-date-picker
              v-model="formData.dealTime"
              type="date"
              value-format="x"
              placeholder="选择处理时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理人" prop="dealPerson">
            <el-input v-model="formData.dealPerson" placeholder="请输入处理人" />
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-form-item label="处理人编号" prop="dealPersonId">-->
<!--        <el-input v-model="formData.dealPersonId" placeholder="请输入处理人编号" />-->
<!--      </el-form-item>-->
      <el-form-item label="处理信息" prop="dealInfo">
        <el-input v-model="formData.dealInfo" placeholder="请输入处理信息" />
      </el-form-item>
<!--      <el-form-item label="设备类型" prop="deviceType">-->
<!--        <el-select v-model="formData.deviceType" placeholder="请选择设备类型">-->
<!--          <el-option-->
<!--            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_TYPE)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
import { WarningRecordApi, WarningRecordVO } from '@/api/kaizhou/warningrecord'
import SelectDevice from "@/views/kaizhou/warningrecord/component/SelectDevice.vue";
import {DeviceBaseVO} from "@/api/kaizhou/devicebase";

/** 预警记录 表单 */
defineOptions({ name: 'WarningRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parkCode: undefined,
  plotCode: undefined,
  deviceCode: undefined,
  warnInfo: undefined,
  warnTitle: undefined,
  currentValue: undefined,
  unit: undefined,
  threshold: undefined,
  warnTime: undefined,
  warnStatus: undefined,
  dealTime: undefined,
  dealPerson: undefined,
  dealPersonId: undefined,
  dealInfo: undefined,
  deviceType: undefined,
})
const formRules = reactive({
  parkCode: [{ required: true, message: '园区编号不能为空', trigger: 'blur' }],
  plotCode: [{ required: true, message: '地块编号不能为空', trigger: 'blur' }],
  deviceCode: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
  warnTitle: [{ required: true, message: '预警标题不能为空', trigger: 'blur' }],
  currentValue: [{ required: true, message: '当前值不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
  threshold: [{ required: true, message: '阈值不能为空', trigger: 'blur' }],
  warnTime: [{ required: true, message: '预警时间不能为空', trigger: 'blur' }],
  warnStatus: [{ required: true, message: '预警状态不能为空', trigger: 'blur' }],
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
      formData.value = await WarningRecordApi.getWarningRecord(id)
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
    const data = formData.value as unknown as WarningRecordVO
    if (formType.value === 'create') {
      await WarningRecordApi.createWarningRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarningRecordApi.updateWarningRecord(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const selectDeviceRef = ref()
const openSelectDevice = () => {
  selectDeviceRef.value.open()
}

const handleSelectDeviceChange = (order: DeviceBaseVO) => {
  formData.value.deviceCode = String(order[0].deviceCode)
  formData.value.parkCode = String(order[0].belongPark)
  formData.value.plotCode = String(order[0].belongPlot)
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    parkCode: undefined,
    plotCode: undefined,
    deviceCode: undefined,
    warnInfo: undefined,
    warnTitle: undefined,
    currentValue: undefined,
    unit: undefined,
    threshold: undefined,
    warnTime: undefined,
    warnStatus: undefined,
    dealTime: undefined,
    dealPerson: undefined,
    dealPersonId: undefined,
    dealInfo: undefined,
    deviceType: undefined,
  }
  formRef.value?.resetFields()
}
</script>
