<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="模型名称" prop="modelId">
        <el-input v-model="modelName" placeholder="请选择模型" >
          <template #append>
            <el-button @click="openModelSelectPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="生长周期" prop="growthPeriodId">
        <el-input v-model="growthNewName" placeholder="请选择生长周期" >
          <template #append>
            <el-button @click="openCropGrowthNewPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="指标名称" prop="indicatorName">
        <el-input v-model="formData.indicatorName" placeholder="请输入指标名称" />
      </el-form-item>
      <el-form-item label="指标描述" prop="indicatorDescription">
        <el-input v-model="formData.indicatorDescription" type="textarea" placeholder="请输入指标描述" />
      </el-form-item>
      <el-form-item label="指标范围" prop="indicatorRange">
        <el-input v-model="formData.indicatorRange" placeholder="请输入指标范围" />
      </el-form-item>
      <el-form-item label="指标结果" prop="indicatorResult">
        <el-input v-model="formData.indicatorResult" placeholder="请输入指标结果" />
      </el-form-item>
      <el-form-item label="健康分值" prop="healthScore">
        <el-input v-model="formData.healthScore" placeholder="请输入健康分值" />
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input v-model="formData.weight" placeholder="请输入权重" />
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-radio-group v-model="formData.isDefault">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.ADOPTION_ODER_REMIND_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="实现类" prop="implementationClass">
        <el-input v-model="formData.implementationClass" placeholder="请输入实现类" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!--  选择模型-->
  <ModelSelectPopup ref="modelSelectPopupRef" @success="handleModelSelectPopupChange"/>

  <!--  选择生长周期-->
  <CropGrowthNewPopup ref="cropGrowthNewPopupRef" @success="handleCropGrowthNewPopupChange"/>
</template>
<script setup lang="ts">
import { ModelMonitorIndicatorApi, ModelMonitorIndicatorVO } from '@/api/agriculture/modelmonitorindicator'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {CropGrowthNewVO} from "@/api/agri/cropgrowthnew";
import {ModelManagementVO} from "@/api/agriculture/modelmanagement";
import ModelSelectPopup from "@/views/agriculture/modelmanagement/ModelSelectPopup.vue";
import CropGrowthNewPopup from "@/views/agri/cropgrowthnew/components/CropGrowthNewPopup.vue";

/** 监测指标 表单 */
defineOptions({ name: 'ModelMonitorIndicatorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<any>({
  id: undefined,
  modelId: undefined,
  growthPeriodId: undefined,
  indicatorName: undefined,
  indicatorDescription: undefined,
  indicatorRange: undefined,
  indicatorResult: undefined,
  healthScore: undefined,
  weight: undefined,
  isDefault: 0,
  implementationClass: undefined,
})
const formRules = reactive({
  // modelName: [{ required: true, message: '模型不能为空', trigger: 'blur' }],
  modelId: [{ required: true, message: '模型不能为空', trigger: 'blur' }],
  // growthNewName: [{ required: true, message: '生长周期不能为空', trigger: 'blur' }],
  growthPeriodId: [{ required: true, message: '生长周期不能为空', trigger: 'blur' }],
  isDefault: [{ required: true, message: '是否默认不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, item?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if ( item !== null && item !== undefined) {
    const { id, modelName:_modelName, growth } = item;
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        formData.value = await ModelMonitorIndicatorApi.getModelMonitorIndicator(id)
        formData.value.isDefault = parseInt(formData.value.isDefault)
        modelName.value = _modelName;
        growthNewName.value = growth;
      } finally {
        formLoading.value = false
      }
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
    const data = formData.value as unknown as ModelMonitorIndicatorVO
    console.log("data", data)
    if (formType.value === 'create') {
      await ModelMonitorIndicatorApi.createModelMonitorIndicator(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelMonitorIndicatorApi.updateModelMonitorIndicator(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

//模型名称
const modelName = ref()
//模型的选择
const modelSelectPopupRef = ref()
const openModelSelectPopup = (id: string) => {
  modelSelectPopupRef.value.open(id)
}
const handleModelSelectPopupChange = (order: ModelManagementVO) => {
  formData.value.modelId = order[0].id?.toString()
  modelName.value = order[0].modelName?.toString()
}

//生长周期
const growthNewName = ref()
//生长周期的选择
const cropGrowthNewPopupRef = ref()
const openCropGrowthNewPopup = (id: string) => {
  cropGrowthNewPopupRef.value.open(id)
}
const handleCropGrowthNewPopupChange = (order: CropGrowthNewVO) => {
  formData.value.growthPeriodId = order[0].id?.toString()
  growthNewName.value = order[0].growth?.toString()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    modelId: undefined,
    growthPeriodId: undefined,
    indicatorName: undefined,
    indicatorDescription: undefined,
    indicatorRange: undefined,
    indicatorResult: undefined,
    healthScore: undefined,
    weight: undefined,
    isDefault: 0,
    implementationClass: undefined,
  }
  formRef.value?.resetFields()
  modelName.value = undefined
  growthNewName.value = undefined
}
</script>
