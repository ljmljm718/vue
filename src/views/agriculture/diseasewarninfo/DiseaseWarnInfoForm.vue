<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="监测类型" prop="warnType">
        <el-select v-model="formData.warnType" placeholder="请选择监测类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备ID" prop="facilityId">
        <el-input v-model="formData.facilityId" placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item label="品种ID" prop="breedId">
        <el-input v-model="formData.breedId" placeholder="请输入品种ID" />
      </el-form-item>
      <el-form-item label="品种名称" prop="cropName">
        <el-input v-model="formData.cropName" placeholder="请输入品种名称" />
      </el-form-item>
      <el-form-item label="病害虫种类" prop="diseaseType">
        <el-select v-model="formData.diseaseType" placeholder="请选择病害虫种类">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="病害虫Id" prop="diseaseId">
        <el-input v-model="formData.diseaseId" placeholder="请输入病害虫Id" />
      </el-form-item>
      <el-form-item label="阈值下限" prop="warnLowValue">
        <el-input v-model="formData.warnLowValue" placeholder="请输入阈值下限" />
      </el-form-item>
      <el-form-item label="阈值上限" prop="warnHighValue">
        <el-input v-model="formData.warnHighValue" placeholder="请输入阈值上限" />
      </el-form-item>
      <el-form-item label="单位" prop="warnUnit">
        <el-input v-model="formData.warnUnit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="预警信息" prop="lowMsg">
        <el-input v-model="formData.lowMsg" placeholder="请输入预警信息" />
      </el-form-item>
      <el-form-item label="监测周期" prop="monitorPeriod">
        <el-input v-model="formData.monitorPeriod" placeholder="请输入监测周期" />
      </el-form-item>
      <el-form-item label="所属基地" prop="belongPark">
        <el-input v-model="formData.belongPark" placeholder="请输入所属基地" />
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />
      </el-form-item>
      <el-form-item label="基地名称" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="请输入基地名称" />
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="formData.plotName" placeholder="请输入地块名称" />
      </el-form-item>
      <el-form-item label="预留1" prop="reservedOne">
        <el-input v-model="formData.reservedOne" placeholder="请输入预留1" />
      </el-form-item>
      <el-form-item label="预留2" prop="reservedTwo">
        <el-input v-model="formData.reservedTwo" placeholder="请输入预留2" />
      </el-form-item>
      <el-form-item label="预留3" prop="reservedThree">
        <el-input v-model="formData.reservedThree" placeholder="请输入预留3" />
      </el-form-item>
      <el-form-item label="预留4" prop="reservedFour">
        <el-input v-model="formData.reservedFour" placeholder="请输入预留4" />
      </el-form-item>
      <el-form-item label="预留5" prop="reservedFive">
        <el-input v-model="formData.reservedFive" placeholder="请输入预留5" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DiseaseWarnInfoApi, DiseaseWarnInfoVO } from '@/api/agriculture/diseasewarninfo'

/** 病虫害预警记录 表单 */
defineOptions({ name: 'DiseaseWarnInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warnType: undefined,
  facilityId: undefined,
  breedId: undefined,
  cropName: undefined,
  diseaseType: undefined,
  diseaseId: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  monitorPeriod: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  parkName: undefined,
  plotName: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined,
  reservedFive: undefined,
  remark: undefined
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
      formData.value = await DiseaseWarnInfoApi.getDiseaseWarnInfo(id)
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
    const data = formData.value as unknown as DiseaseWarnInfoVO
    if (formType.value === 'create') {
      await DiseaseWarnInfoApi.createDiseaseWarnInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await DiseaseWarnInfoApi.updateDiseaseWarnInfo(data)
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
    warnType: undefined,
    facilityId: undefined,
    breedId: undefined,
    cropName: undefined,
    diseaseType: undefined,
    diseaseId: undefined,
    warnLowValue: undefined,
    warnHighValue: undefined,
    warnUnit: undefined,
    lowMsg: undefined,
    monitorPeriod: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    parkName: undefined,
    plotName: undefined,
    reservedOne: undefined,
    reservedTwo: undefined,
    reservedThree: undefined,
    reservedFour: undefined,
    reservedFive: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>