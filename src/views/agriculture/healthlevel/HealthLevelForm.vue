<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-form-item label="品种名称" prop="cropName">
        <el-input v-model="formData.cropName" placeholder="请选择品种">
          <template #append>
            <el-button @click="openBreedFrom()">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="健康等级" prop="healthLevel">
        <el-input v-model="formData.healthLevel" placeholder="请输入健康等级" />
      </el-form-item>
      <el-form-item label="健康等级上限分" prop="max">
        <el-input v-model="formData.max" placeholder="请输入健康等级上限分" />
      </el-form-item>
      <el-form-item label="健康等级下限分" prop="min">
        <el-input v-model="formData.min" placeholder="请输入健康等级下限分" />
      </el-form-item>
      <el-form-item label="模型名称" prop="modelName">
        <el-input v-model="formData.modelName" placeholder="请选择模型" >
          <template #append>
            <el-button @click="openModelFrom()">
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

  <BreedFrom ref="BreedFromRef" @success="BreedFromSuccess"/>
  <ModelFrom ref="ModelFromRef" @success="ModelFromSuccess"/>
</template>
<script setup lang="ts">
import { HealthLevelApi, HealthLevelVO } from '@/api/agriculture/healthlevel'
//品种管理页面
import BreedFrom from "@/views/agriculture/varietymanagement/SelectVarirtManagement.vue";
//模型管理页面
import ModelFrom from "@/views/agriculture/modelmanagement/ModelSelectPopup.vue";

/** 健康等级 表单 */
defineOptions({ name: 'HealthLevelForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  cropCode: undefined,
  cropName: undefined,
  healthLevel: undefined,
  max: undefined,
  min: undefined,
  modelId: undefined,
  modelName: undefined,
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
      formData.value = await HealthLevelApi.getHealthLevel(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

//品种名称管理
const BreedFromRef = ref()
const openBreedFrom = () => {
  BreedFromRef.value.open();
}
const BreedFromSuccess = (order: any) => {
  console.log(order,"---------=----");
  formData.value.cropName = String(order[0].varietyName)
  formData.value.cropCode = String(order[0].id)
}

//模型名称管理
const ModelFromRef = ref()
const openModelFrom = () => {
  ModelFromRef.value.open();
}
const ModelFromSuccess = (order: any) => {
  console.log(order,"---------=----");
  formData.value.modelName = String(order[0].modelName)
  formData.value.modelId = String(order[0].id)
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as HealthLevelVO
    if (formType.value === 'create') {
      await HealthLevelApi.createHealthLevel(data)
      message.success(t('common.createSuccess'))
    } else {
      await HealthLevelApi.updateHealthLevel(data)
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
    cropCode: undefined,
    cropName: undefined,
    healthLevel: undefined,
    max: undefined,
    min: undefined,
    modelId: undefined,
    modelName: undefined,
  }
  formRef.value?.resetFields()
}
</script>
