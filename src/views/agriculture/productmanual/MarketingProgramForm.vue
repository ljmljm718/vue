<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="方案名称" prop="schemeName">
        <el-input v-model="formData.schemeName" placeholder="请输入方案名称" />
      </el-form-item>
      <el-form-item label="简介" prop="briefIntroduction">
        <el-input v-model="formData.briefIntroduction" type="textarea" placeholder="请输入简介" />
      </el-form-item>
      <el-form-item label="创作人" prop="marketingCreator">
        <el-input v-model="formData.marketingCreator" placeholder="请输入创作人" />
      </el-form-item>
      <el-form-item label="上传时间" prop="marketingUploadTime">
        <el-date-picker
          v-model="formData.marketingUploadTime"
          type="datetime"
          value-format="x"
          placeholder="选择上传时间"
        />
      </el-form-item>
      <el-form-item label="分类" prop="marketingCategory">
        <el-input v-model="formData.marketingCategory" placeholder="请输入分类" />
      </el-form-item>
      <el-form-item label="标签" prop="marketingTags">
        <el-input v-model="formData.marketingTags" placeholder="请输入标签" />
      </el-form-item>
      <el-form-item label="文件管理" prop="fileManagement">
        <UploadFile v-model="formData.fileManagement" :limit="1" />
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImage">
        <UploadImg v-model="formData.coverImage" />
      </el-form-item>
      <!-- <el-form-item label="营销推广类型" prop="marketingType">
        <el-input v-model="formData.marketingType" placeholder="请输入营销推广类型" />
      </el-form-item>
      <el-form-item label="备用一" prop="reserveOne">
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
import { MarketingProgramApi, MarketingProgramVO } from '@/api/agriculture/marketingprogram'

/** 营销方案 表单 */
defineOptions({ name: 'MarketingProgramForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  schemeName: undefined,
  briefIntroduction: undefined,
  marketingCreator: undefined,
  marketingUploadTime: undefined,
  marketingCategory: undefined,
  marketingTags: undefined,
  fileManagement: undefined,
  coverImage: undefined,
  marketingType: 'productmanual',
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
      formData.value = await MarketingProgramApi.getMarketingProgram(id)
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
    const data = formData.value as unknown as MarketingProgramVO
    if (formType.value === 'create') {
      await MarketingProgramApi.createMarketingProgram(data)
      message.success(t('common.createSuccess'))
    } else {
      await MarketingProgramApi.updateMarketingProgram(data)
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
    schemeName: undefined,
    briefIntroduction: undefined,
    marketingCreator: undefined,
    marketingUploadTime: undefined,
    marketingCategory: undefined,
    marketingTags: undefined,
    fileManagement: undefined,
    coverImage: undefined,
    marketingType: 'productmanual',
    reserveOne: undefined,
    reserveTwo: undefined,
    reserveThree: undefined,
  }
  formRef.value?.resetFields()
}
</script>