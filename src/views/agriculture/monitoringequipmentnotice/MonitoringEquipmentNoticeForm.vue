<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="formData.deviceId" placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="监控基地ID" prop="monitoringBaseId">
        <el-input v-model="formData.monitoringBaseId" placeholder="请输入监控基地ID" />
      </el-form-item>
      <el-form-item label="监控基地名称" prop="monitoringBaseName">
        <el-input v-model="formData.monitoringBaseName" placeholder="请输入监控基地名称" />
      </el-form-item>
      <el-form-item label="监控地块ID" prop="monitoringPlotId">
        <el-input v-model="formData.monitoringPlotId" placeholder="请输入监控地块ID" />
      </el-form-item>
      <el-form-item label="监控地块名称" prop="monitoringPlotName">
        <el-input v-model="formData.monitoringPlotName" placeholder="请输入监控地块名称" />
      </el-form-item>
      <el-form-item label="抓拍图片或视频" prop="captured">
        <UploadImg v-model="formData.captured" />
      </el-form-item>
      <el-form-item label="视频链接" prop="videoLink">
        <el-input v-model="formData.videoLink" placeholder="请输入视频链接" />
      </el-form-item>
      <el-form-item label="通知事件类型" prop="noticeEvent">
        <el-input v-model="formData.noticeEvent" placeholder="请输入通知事件类型" />
      </el-form-item>
      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker
          v-model="formData.recordTime"
          type="date"
          value-format="x"
          placeholder="选择记录时间"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formData.remarks" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MonitoringEquipmentNoticeApi, MonitoringEquipmentNoticeVO } from '@/api/agriculture/monitoringequipmentnotice'

/** 监控设备通知 表单 */
defineOptions({ name: 'MonitoringEquipmentNoticeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  captured: undefined,
  videoLink: undefined,
  noticeEvent: undefined,
  recordTime: undefined,
  remarks: undefined
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
      formData.value = await MonitoringEquipmentNoticeApi.getMonitoringEquipmentNotice(id)
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
    const data = formData.value as unknown as MonitoringEquipmentNoticeVO
    if (formType.value === 'create') {
      await MonitoringEquipmentNoticeApi.createMonitoringEquipmentNotice(data)
      message.success(t('common.createSuccess'))
    } else {
      await MonitoringEquipmentNoticeApi.updateMonitoringEquipmentNotice(data)
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
    deviceName: undefined,
    monitoringBaseId: undefined,
    monitoringBaseName: undefined,
    monitoringPlotId: undefined,
    monitoringPlotName: undefined,
    captured: undefined,
    videoLink: undefined,
    noticeEvent: undefined,
    recordTime: undefined,
    remarks: undefined
  }
  formRef.value?.resetFields()
}
</script>