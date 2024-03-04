<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备" prop="deviceCode">
        <!--        <el-input v-model="formData.deviceCode" placeholder="请输入设备号" />-->
        <el-input v-model="formData.deviceCode" readonly>
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" disabled/>
      </el-form-item>
      <el-form-item label="连接属性" prop="connection">
        <el-select v-model="formData.connection" placeholder="请选择连接属性">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.DEVICE_CONNECT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" disabled/>
      </el-form-item>
      <el-form-item label="在线状态" prop="presence">
        <el-select v-model="formData.presence" placeholder="请选择在线状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.EQU_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注"/>
      </el-form-item>
      <el-form-item label="上传时间" prop="upTime">
        <el-date-picker
          v-model="formData.upTime"
          type="datetime"
          value-format="x"
          placeholder="选择上传时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>

      <!-- 设备列表 -->
      <EquListForm
        ref="purchaseOrderInEnableListRef"
        @success="handlePurchaseOrderChange"
      />
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {OnLineMonitoringApi, OnLineMonitoringVO} from '@/api/wushan/onlinemonitoring'
import EquListForm from "@/views/wushan/onlinemonitoring/equListForm/equListForm.vue";
import {ParkBaseVO} from "@/api/kaizhou/parkbase";

/** 物联网设备在线监测 表单 */
defineOptions({name: 'OnLineMonitoringForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceCode: undefined,
  deviceName: undefined,
  connection: undefined,
  belongPlot: undefined,
  presence: undefined,
  remark: undefined,
  upTime: undefined,
})
const formRules = reactive({
  deviceCode: [{required: true, message: '设备不能为空', trigger: 'blur'}]
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
      formData.value = await OnLineMonitoringApi.getOnLineMonitoring(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}
const handlePurchaseOrderChange = (order: ParkBaseVO) => {
  // 将订单设置到入库单
  console.log(order)
  formData.value.deviceCode = String(order[0].deviceCode)
  formData.value.deviceName = String(order[0].deviceName)
  formData.value.belongPlot = String(order[0].belongPlot)
}


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OnLineMonitoringVO
    if (formType.value === 'create') {
      await OnLineMonitoringApi.createOnLineMonitoring(data)
      message.success(t('common.createSuccess'))
    } else {
      await OnLineMonitoringApi.updateOnLineMonitoring(data)
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
    deviceName: undefined,
    connection: undefined,
    belongPlot: undefined,
    presence: undefined,
    remark: undefined,
    upTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>
