<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="60%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      class="grid sm:grid-cols-2 gap-2 p-4"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="村" prop="villageName">
        <el-input v-model="formData.villageName" placeholder="请输入村" />
      </el-form-item>
      <el-form-item label="产业名称" prop="industryName">
        <el-input v-model="formData.industryName" placeholder="请输入产业名称" />
      </el-form-item>
      <el-form-item label="市场需求规格" prop="marketDemandScale">
        <el-input v-model="formData.marketDemandScale" type="textarea" placeholder="请输入市场需求规格" />
      </el-form-item>
      <el-form-item label="主要需求市场" prop="keyDemandMarket">
        <el-input v-model="formData.keyDemandMarket" type="textarea" placeholder="请输入主要需求市场" />
      </el-form-item>
      <el-form-item label="市场发展趋势" prop="marketDevTrend">
        <el-input v-model="formData.marketDevTrend" type="textarea" placeholder="请输入市场发展趋势" />
      </el-form-item>
      <el-form-item label="政策法规" prop="policy">
        <el-input v-model="formData.policy" type="textarea" placeholder="请输入政策法规" />
      </el-form-item>
      <el-form-item label="价值功效" prop="efficacy">
        <el-input v-model="formData.efficacy" type="textarea" placeholder="请输入价值功效" />
      </el-form-item>
      <el-form-item label="基地介绍" prop="baseIntr">
        <el-input v-model="formData.baseIntr" type="textarea" placeholder="请输入基地介绍" />
      </el-form-item>
      <el-form-item label="图片" prop="imgId">
        <UploadImg v-model="formData.imgId" />
      </el-form-item>
      <el-form-item label="宣传视频" prop="videoUrl">
<!--        <UploadFile v-model="formData.videoUrl" />-->
        <el-input v-model="formData.videoUrl" placeholder="请选择视频" :disabled="true" />
        <el-upload
          action="#"
          :auto-upload="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="beforeUpload"
        >
          <el-button solt="trigger" size="small" type="primary">选择视频</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { IndustryBaseApi, IndustryBaseVO } from '@/api/agriculture/industrybase'
import {ref} from "vue";
import {ElMessageBox} from "element-plus";
import {updateFile} from "@/api/infra/file";

/** 产业介绍 表单 */
defineOptions({ name: 'IndustryBaseForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  villageName: undefined,
  industryName: undefined,
  imgId: undefined,
  marketDemandScale: undefined,
  keyDemandMarket: undefined,
  marketDevTrend: undefined,
  policy: undefined,
  efficacy: undefined,
  baseIntr: undefined,
  videoUrl: undefined
})
const formRules = reactive({
  villageName: [{ required: true, message: '村不能为空', trigger: 'blur' }],
  industryName: [{ required: true, message: '产业名称不能为空', trigger: 'blur' }],
  imgId: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
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
      formData.value = await IndustryBaseApi.getIndustryBase(id)
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
    const data = formData.value as unknown as IndustryBaseVO
    if (formType.value === 'create') {
      await IndustryBaseApi.createIndustryBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await IndustryBaseApi.updateIndustryBase(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}



// 视频
let fileList = ref([])

const handleSuccess = (response, file, fileList) => {
  //console.log('Upload success:', response, file, fileList)
  videoType.value = false
}

const handleError = (err, file, fileList) => {
  console.error('Upload error:', err, file, fileList)
}
let videoType = ref(false)
const beforeUpload = async (file) => {
  const isVideo = file.raw.type === 'video/mp4'
  if (!isVideo) {
    ElMessageBox.alert('请上传视频文件（.mp4格式）', '错误', { type: 'error' })
  } else {
    videoType.value = true
    const fileForm = new FormData()
    fileForm.append('file', file.raw)
    const { data } = await updateFile(fileForm)
    //console.log('res', data)
    formData.value.videoUrl = data
    videoType.value = false
  }
  return isVideo
}


/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    villageName: undefined,
    industryName: undefined,
    imgId: undefined,
    marketDemandScale: undefined,
    keyDemandMarket: undefined,
    marketDevTrend: undefined,
    policy: undefined,
    efficacy: undefined,
    baseIntr: undefined,
    videoUrl: undefined
  }
  formRef.value?.resetFields()
}
</script>
