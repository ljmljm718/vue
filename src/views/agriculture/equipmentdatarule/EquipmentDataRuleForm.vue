<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="终端id" prop="dtuId">
        <el-input v-model="formData.dtuId" placeholder="请输入终端id" />
      </el-form-item>
      <el-form-item label="通道" prop="channelId">
        <el-input v-model="formData.channelId" placeholder="请输入通道" />
      </el-form-item>
      <el-form-item label="参数" prop="param">
        <el-input v-model="formData.param" placeholder="请输入参数" />
      </el-form-item>
      <el-form-item label="监测类型" prop="monitoringType">
        <el-input v-model="formData.monitoringType" placeholder="请输入监测类型" />
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-input v-model="formData.ruleType" placeholder="请输入规则类型" />
      </el-form-item>
      <el-form-item label="系数" prop="rule">
        <el-input v-model="formData.rule" placeholder="请输入规则" />
      </el-form-item>
      <el-form-item label="字典" prop="dictionary">
        <el-input v-model="formData.dictionary" placeholder="请输入字典" />
      </el-form-item>
      <el-form-item label="单位" prop="ruleUnit">
        <el-input v-model="formData.ruleUnit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="设备" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请选择设备" disabled>
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <SelectDeviceInfo   ref="SelectDeviceInfoRef"
                          @success="SelectDeviceInfoSuccess"/>
</template>
<script setup lang="ts">
import { EquipmentDataRuleApi, EquipmentDataRuleVO } from '@/api/agriculture/equipmentdatarule'
import SelectDeviceInfo from "@/views/agriculture/deviceinfo/SelectDeviceInfoForms.vue";
import {EquipmentDataVO} from "@/api/agriculture/equipmentdata";

/** 设备数据规则 表单 */
defineOptions({ name: 'EquipmentDataRuleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  dtuId: undefined,
  channelId: undefined,
  param: undefined,
  monitoringType: undefined,
  ruleType: undefined,
  rule: undefined,
  ruleUnit: undefined,
  deviceId: undefined,
  deviceName: undefined,
  remark:undefined,
  dictionary: undefined
})
const formRules = reactive({
  dtuId: [{ required: true, message: '终端id不能为空', trigger: 'blur' }],
  channelId: [{ required: true, message: '通道不能为空', trigger: 'blur' }],
  param: [{ required: true, message: '参数不能为空', trigger: 'blur' }],
  monitoringType: [{ required: true, message: '监测类型不能为空', trigger: 'blur' }],
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'blur' }]
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
      formData.value = await EquipmentDataRuleApi.getEquipmentDataRule(id)
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
    const data = formData.value as unknown as EquipmentDataRuleVO
    if (formType.value === 'create') {
      await EquipmentDataRuleApi.createEquipmentDataRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await EquipmentDataRuleApi.updateEquipmentDataRule(data)
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
    dtuId: undefined,
    channelId: undefined,
    param: undefined,
    monitoringType: undefined,
    ruleType: undefined,
    rule: undefined,
    ruleUnit: undefined,
    deviceId: undefined,
    deviceName: undefined,
    remark:undefined,
    dictionary: undefined
  }
  formRef.value?.resetFields()
}
/* 选择设备 */
const SelectDeviceInfoRef = ref()
const openPurchaseOrderInEnableList = () => {
  SelectDeviceInfoRef.value.open()
}
const SelectDeviceInfoSuccess = async (order: EquipmentDataVO) => {
  //赋值id
  formData.value.deviceId = order[0].id
  //赋值设备名称
  formData.value.deviceName = order[0].deviceName;
}
</script>
