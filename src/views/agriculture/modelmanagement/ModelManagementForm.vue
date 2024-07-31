<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="模型名称" prop="modelName">
        <el-input v-model="formData.modelName" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="模型类型" prop="modelType">
        <el-select v-model="formData.modelType" placeholder="请选择模型类型">
          <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.GROWTH_MODEL_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联品种" prop="belongVarietyId">
        <el-select
          v-model="formData.belongVarietyId"
          placeholder="请选择关联品种"
          clearable
          @change="handleVarietyChange"
        >
          <el-option
            v-for="dict in listVarietyManagement"
            :key="dict.id"
            :label="dict.varietyName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联品类" prop="belongCategoryId">
        <el-select
          v-model="formData.belongCategoryId"
          placeholder="选择品种后自动填入"
          clearable
          :disabled = "true"
        >
          <el-option
            v-for="dict in listVarietyManagement"
            :key="dict.categoryId"
            :label="dict.categoryName"
            :value="dict.categoryId"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="关联品类" prop="belongCategory">-->
<!--        <el-input v-model="formData.belongCategory" placeholder="请输入关联品类" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="关联品种" prop="belongVariety">-->
<!--        <el-input v-model="formData.belongVariety" placeholder="请输入关联品种" />-->
<!--      </el-form-item>-->
      <el-form-item label="模型图片" prop="modelImageId">
        <UploadImg v-model="formData.modelImageId" />
      </el-form-item>
      <el-form-item label="模型文件" prop="modelFileId">
        <UploadFile v-model="formData.modelFileId" />
      </el-form-item>
<!--      <el-form-item label="启用状态（0正常1停用）" prop="enabledStatus">-->
<!--        <el-radio-group v-model="formData.enabledStatus">-->
<!--          <el-radio label="1">请选择字典生成</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ModelManagementApi, ModelManagementVO } from '@/api/agriculture/modelmanagement'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";

/** 模型管理 表单 */
defineOptions({ name: 'ModelManagementForm' })

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  listVarietyManagement.value = await allDataCacheManager.getData({})
}
getTypeData()

const handleVarietyChange = (e) => {
  const _item = listVarietyManagement.value.find(item => (item.id === e))
  if (_item) formData.value.belongCategoryId = _item.categoryId
}

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  modelName: undefined,
  modelType: undefined,
  belongCategoryId: undefined,
  belongCategory: undefined,
  belongVarietyId: undefined,
  belongVariety: undefined,
  modelImageId: undefined,
  modelFileId: undefined,
  enabledStatus: 0,
  description: undefined,
})
const formRules = reactive({
  modelName: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }],
  modelType: [{ required: true, message: '模型类型不能为空', trigger: 'change' }],
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
      formData.value = await ModelManagementApi.getModelManagement(id)
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
    const data = formData.value as unknown as ModelManagementVO
    if (formType.value === 'create') {
      await ModelManagementApi.createModelManagement(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelManagementApi.updateModelManagement(data)
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
    modelName: undefined,
    modelType: undefined,
    belongCategoryId: undefined,
    belongCategory: undefined,
    belongVarietyId: undefined,
    belongVariety: undefined,
    modelImageId: undefined,
    modelFileId: undefined,
    enabledStatus: 0,
    description: undefined,
  }
  formRef.value?.resetFields()
}
</script>
