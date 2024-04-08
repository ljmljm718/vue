<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="子设备编号" prop="subDevicesNum">
        <el-input v-model="formData.subDevicesNum" placeholder="选填"/>
      </el-form-item>
      <el-form-item label="子设备名称" prop="subDevicesName">
        <el-input v-model="formData.subDevicesName" placeholder="请输入子设备名称"/>
      </el-form-item>
      <el-form-item label="所属设备" prop="devicesId">
        <!--        <el-input v-model="formData.devicesId" placeholder="请输入所属设备" />-->
        <el-input v-model="formData.devicesId" placeholder="请选择设备编码" :disabled="true">
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入"  disabled/>
      </el-form-item>
      <el-form-item label="开关状态" prop="swithState">
        <el-select v-model="formData.swithState" placeholder="请选择开关状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.EQU_SWITH_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef"
                        @success="handlePurchaseOrderChange"/>
</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {SubDeviceApi, SubDeviceVO} from '@/api/agriculture/subdevice'
import AgriculturalBaseList from "@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue";
import {EquipmentDataVO} from "@/api/agriculture/equipmentdata";
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import {string} from "vue-types";

/** 子设备管理 表单 */
defineOptions({name: 'SubDeviceForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  subDevicesNum: undefined,
  devicesId: undefined,
  subDevicesName: undefined,
  swithState: undefined,
  remark: undefined,
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()

}
const handlePurchaseOrderChange = async (order: EquipmentDataVO) => {
  //赋值id
  formData.value.devicesId = String(order[0].id)
  formData.value.remark = String(order[0].deviceName)
}


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
      formData.value = await SubDeviceApi.getSubDevice(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as SubDeviceVO
    if (formType.value === 'create') {
      await SubDeviceApi.createSubDevice(data)
      message.success(t('common.createSuccess'))
    } else {
      await SubDeviceApi.updateSubDevice(data)
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
    subDevicesNum: undefined,
    devicesId: undefined,
    subDevicesName: undefined,
    swithState: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
