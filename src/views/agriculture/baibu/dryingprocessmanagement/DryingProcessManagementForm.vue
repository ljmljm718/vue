<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="124px"
      v-loading="formLoading"
    >
      <el-form-item label="设备编码" prop="equipmentCode">
        <el-input v-model="formData.equipmentCode" placeholder="请输入设备编码(不写时后端自动填入)" />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="formData.equipmentName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="烘干方式" prop="dryingMethod">
        <!-- <el-input v-model="formData.dryingMethod" placeholder="请输入烘干方式" /> -->
        <el-select
          v-model="formData.dryingMethod"
          placeholder="请选择烘干方式"
          clearable
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.DRYING_METHOD)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="加热时间(分钟)" prop="heatingTime">
        <el-input v-model="formData.heatingTime" placeholder="请输入加热时间" />
      </el-form-item>
      <el-form-item label="烘干温度(℃)" prop="dryingTemperature">
        <el-input v-model="formData.dryingTemperature" placeholder="请输入烘干温度" />
      </el-form-item>
      <el-form-item label="设备转速(rpm/m)" prop="equipmentSpeed">
        <el-input v-model="formData.equipmentSpeed" placeholder="请输入设备转速" />
      </el-form-item>
      <el-form-item label="适宜作物" prop="suitableCrops">
        <el-input v-model="formData.suitableCrops" placeholder="请输入适宜作物" />
      </el-form-item>
      <el-form-item label="备注" prop="yyRemarks">
        <el-input v-model="formData.yyRemarks" placeholder="请输入备注" />
      </el-form-item>
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input v-model="formData.reserveOne" placeholder="请输入备用一" />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input v-model="formData.reserveTwo" placeholder="请输入备用二" />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input v-model="formData.reserveThree" placeholder="请输入备用三" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { DryingProcessManagementApi, DryingProcessManagementVO } from '@/api/agriculture/baibu/dryingprocessmanagement'

/** 烘干工艺管理 表单 */
defineOptions({ name: 'DryingProcessManagementForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  equipmentCode: undefined,
  equipmentName: undefined,
  dryingMethod: undefined,
  heatingTime: undefined,
  dryingTemperature: undefined,
  equipmentSpeed: undefined,
  suitableCrops: undefined,
  yyRemarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
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
      formData.value = await DryingProcessManagementApi.getDryingProcessManagement(id)
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
    const data = formData.value as unknown as DryingProcessManagementVO
    if (formType.value === 'create') {
      await DryingProcessManagementApi.createDryingProcessManagement(data)
      message.success(t('common.createSuccess'))
    } else {
      await DryingProcessManagementApi.updateDryingProcessManagement(data)
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
    equipmentCode: undefined,
    equipmentName: undefined,
    dryingMethod: undefined,
    heatingTime: undefined,
    dryingTemperature: undefined,
    equipmentSpeed: undefined,
    suitableCrops: undefined,
    yyRemarks: undefined,
    reserveOne: undefined,
    reserveTwo: undefined,
    reserveThree: undefined,
  }
  formRef.value?.resetFields()
}
</script>