<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="品种名称" prop="varietyName">
        <el-input v-model="formData.varietyName" placeholder="请输入品种名称" />
      </el-form-item>
      <el-form-item label="品种编码" prop="varietyCode">
        <el-input v-model="formData.varietyCode" placeholder="请输入品种编码" />
      </el-form-item>
      <el-form-item label="图片" prop="images">
        <el-input v-model="formData.images" placeholder="请输入图片" />
      </el-form-item>
      <el-form-item label="品类ID" prop="categoryId">
        <el-input v-model="formData.categoryId" placeholder="请输入品类ID" />
      </el-form-item>
      <el-form-item label="品种来源" prop="categorySource">
        <el-input v-model="formData.categorySource" placeholder="请输入品种来源" />
      </el-form-item>
      <el-form-item label="品种特征" prop="categoryStigma">
        <el-input v-model="formData.categoryStigma" placeholder="请输入品种特征" />
      </el-form-item>
      <el-form-item label="分布地区" prop="areaDistribution">
        <el-input v-model="formData.areaDistribution" placeholder="请输入分布地区" />
      </el-form-item>
      <el-form-item label="简介" prop="briefIntroduction">
        <el-input v-model="formData.briefIntroduction" placeholder="请输入简介" />
      </el-form-item>
      <el-form-item label="启用停用" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注1" prop="remark2">
        <el-input v-model="formData.remark2" placeholder="请输入备注1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { VarietyManagementApi, VarietyManagementVO } from '@/api/agriculture/varietymanagement'

/** 品种管理 表单 */
defineOptions({ name: 'VarietyManagementForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  varietyName: undefined,
  varietyCode: undefined,
  images: undefined,
  categoryId: undefined,
  categorySource: undefined,
  categoryStigma: undefined,
  areaDistribution: undefined,
  briefIntroduction: undefined,
  status: undefined,
  remark2: undefined
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
      formData.value = await VarietyManagementApi.getVarietyManagement(id)
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
    const data = formData.value as unknown as VarietyManagementVO
    if (formType.value === 'create') {
      await VarietyManagementApi.createVarietyManagement(data)
      message.success(t('common.createSuccess'))
    } else {
      await VarietyManagementApi.updateVarietyManagement(data)
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
    varietyName: undefined,
    varietyCode: undefined,
    images: undefined,
    categoryId: undefined,
    categorySource: undefined,
    categoryStigma: undefined,
    areaDistribution: undefined,
    briefIntroduction: undefined,
    status: undefined,
    remark2: undefined
  }
  formRef.value?.resetFields()
}
</script>