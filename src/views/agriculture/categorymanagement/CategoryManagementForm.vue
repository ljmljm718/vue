<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" @close="handleClose">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="diableForm"
    >
      <el-form-item label="品类名称" prop="categoryName">
        <el-input v-model="formData.categoryName" placeholder="请输入品类名称" />
      </el-form-item>
      <el-form-item label="品类编码" prop="categoryCode">
        <el-input v-model="formData.categoryCode" placeholder="请输入品类编码" />
      </el-form-item>
      <el-form-item label="门类" prop="phylum">
        <el-input v-model="formData.phylum" placeholder="请输入门类" />
      </el-form-item>
      <el-form-item label="科类" prop="family">
        <el-input v-model="formData.family" placeholder="请输入科类" />
      </el-form-item>
      <el-form-item label="属类" prop="genus">
        <el-input v-model="formData.genus" placeholder="请输入属类" />
      </el-form-item>
      <el-form-item label="图片" prop="images">
        <UploadImg :disabled="diableForm" v-model="formData.images" />
      </el-form-item>
      <el-form-item label="简介" prop="briefIntroduction">
        <el-input v-model="formData.briefIntroduction" placeholder="请输入简介" />
      </el-form-item>
      <!-- <el-form-item label="备注1" prop="remark1">
        <el-input v-model="formData.remark1" placeholder="请输入备注1" />
      </el-form-item>
      <el-form-item label="备注2" prop="remark2">
        <el-input v-model="formData.remark2" placeholder="请输入备注2" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CategoryManagementApi, CategoryManagementVO } from '@/api/agriculture/categorymanagement'

/** 品类管理 表单 */
defineOptions({ name: 'CategoryManagementForm' })

/** 将详情按钮 设为不可编辑 */
const diableForm = ref<boolean>(false)
const turnDisable = (val) => {
  diableForm.value = val
}
const handleClose = () => {
  diableForm.value = false
}

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  categoryName: undefined,
  categoryCode: undefined,
  phylum: undefined,
  family: undefined,
  genus: undefined,
  images: undefined,
  briefIntroduction: undefined,
  remark1: undefined,
  remark2: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  if(type == 'select'){
    dialogTitle.value = '详情'
  }else{
    dialogTitle.value = t('action.' + type)
  }
  
  
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CategoryManagementApi.getCategoryManagement(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open, turnDisable }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CategoryManagementVO
    if (formType.value === 'create') {
      await CategoryManagementApi.createCategoryManagement(data)
      message.success(t('common.createSuccess'))
    } else {
      await CategoryManagementApi.updateCategoryManagement(data)
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
    categoryName: undefined,
    categoryCode: undefined,
    phylum: undefined,
    family: undefined,
    genus: undefined,
    images: undefined,
    briefIntroduction: undefined,
    remark1: undefined,
    remark2: undefined
  }
  formRef.value?.resetFields()
}
</script>