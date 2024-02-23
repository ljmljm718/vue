<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编号" prop="cropCode">
        <el-input v-model="formData.cropCode" placeholder="请输入编号" />
      </el-form-item>
      <el-form-item label="名称" prop="cropName">
        <el-input v-model="formData.cropName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="品种" prop="cropType">
        <el-select v-model="formData.cropType" placeholder="请选择品种" style="width: 100%;">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_CROP_CULTIVARS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="imgId">
        <el-input v-model="formData.imgId" placeholder="请输入图片" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="描述" prop="cropDesc">
        <el-input v-model="formData.cropDesc" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { CropBaseApi, CropBaseVO } from '@/api/kaizhou/cropbase'

/** 作物管理 表单 */
defineOptions({ name: 'CropBaseForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  remark: undefined,
  cropCode: undefined,
  cropDesc: undefined,
})
const formRules = reactive({
  cropName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  cropType: [{ required: true, message: '品种不能为空', trigger: 'change' }],
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
      formData.value = await CropBaseApi.getCropBase(id)
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
    const data = formData.value as unknown as CropBaseVO
    if (formType.value === 'create') {
      await CropBaseApi.createCropBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await CropBaseApi.updateCropBase(data)
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
    cropName: undefined,
    cropType: undefined,
    imgId: undefined,
    remark: undefined,
    cropCode: undefined,
    cropDesc: undefined,
  }
  formRef.value?.resetFields()
}
</script>
