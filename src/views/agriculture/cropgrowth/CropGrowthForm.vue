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
        <el-input v-model="formData.cropType" placeholder="请输入品种" />
      </el-form-item>
      <el-form-item label="图片" prop="imgId">
        <UploadImg v-model="formData.imgId" />
      </el-form-item>
      <el-form-item label="生长期" prop="growth">
        <el-input v-model="formData.growth" placeholder="请输入生长期" />
      </el-form-item>
      <el-form-item label="特点" prop="feature">
        <el-input v-model="formData.feature" type="textarea" placeholder="请输入特点" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPark">
        <el-input v-model="formData.belongPark" placeholder="请输入所属地块" />
      </el-form-item>
      <el-form-item label="所属园区" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="请输入所属园区" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="formData.endTime"
          type="date"
          value-format="x"
          placeholder="选择结束时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CropGrowthApi, CropGrowthVO } from '@/api/agriculture/cropgrowth'

/** 作物生长期管理 表单 */
defineOptions({ name: 'CropGrowthForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  growth: undefined,
  feature: undefined,
  remark: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  startTime: undefined,
  endTime: undefined,
})
const formRules = reactive({
  cropName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
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
      formData.value = await CropGrowthApi.getCropGrowth(id)
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
    const data = formData.value as unknown as CropGrowthVO
    if (formType.value === 'create') {
      await CropGrowthApi.createCropGrowth(data)
      message.success(t('common.createSuccess'))
    } else {
      await CropGrowthApi.updateCropGrowth(data)
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
    cropCode: undefined,
    cropName: undefined,
    cropType: undefined,
    imgId: undefined,
    growth: undefined,
    feature: undefined,
    remark: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    startTime: undefined,
    endTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>
