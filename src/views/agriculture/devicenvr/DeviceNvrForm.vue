<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备编号" prop="deviceSerial">
        <el-input v-model="formData.deviceSerial" placeholder="请输入设备序列号" />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="请求体" prop="appId">
        <el-input v-model="formData.appId" placeholder="请输入应用Id" />
      </el-form-item>
      <el-form-item label="地址" prop="secretKey">
        <el-input v-model="formData.secretKey" placeholder="请输入密钥" />
      </el-form-item>
      <el-form-item label="所属系统" prop="belongSys">
        <el-input v-model="formData.belongSys" placeholder="请输入所属系统" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="类型" prop="remark1">
        <el-input v-model="formData.remark1" placeholder="请输入类型" />
      </el-form-item>
      <el-form-item label="返回值" prop="remark2">
        <el-input v-model="formData.remark2" placeholder="请输入返回值" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DeviceNvrApi, DeviceNvrVO } from '@/api/agriculture/devicenvr'

/** 录像机设备信息 表单 */
defineOptions({ name: 'DeviceNvrForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceSerial: undefined,
  deviceName: undefined,
  appId: undefined,
  secretKey: undefined,
  belongSys: undefined,
  remark: undefined,
  remark1: undefined,
  remark2: undefined,
})
const formRules = reactive({
  deviceName: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
  deviceSerial: [{ required: true, message: '设备序列号不能为空', trigger: 'blur' }],
  appId: [{ required: true, message: '请求体不能为空', trigger: 'blur' }],
  secretKey: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
  belongSys: [{ required: true, message: '所属系统不能为空', trigger: 'blur' }],
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
      formData.value = await DeviceNvrApi.getDeviceNvr(id)
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
    const data = formData.value as unknown as DeviceNvrVO
    if (formType.value === 'create') {
      await DeviceNvrApi.createDeviceNvr(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeviceNvrApi.updateDeviceNvr(data)
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
    deviceSerial: undefined,
    deviceName: undefined,
    appId: undefined,
    secretKey: undefined,
    belongSys: undefined,
    remark: undefined,
    remark1: undefined,
    remark2: undefined,
  }
  formRef.value?.resetFields()
}
</script>
