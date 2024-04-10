<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="85px"
      v-loading="formLoading"
    >
      <el-form-item label="景区名称" prop="scenicName">
        <el-input v-model="formData.scenicName" placeholder="请输入景区名称" />
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input v-model="formData.location" placeholder="请输入位置" />
      </el-form-item>
      <el-form-item label="经度" prop="lon">
        <el-input v-model="formData.lon" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input v-model="formData.lat" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item label="星级" prop="starLevel">
        <el-select v-model="formData.starLevel" placeholder="请选择星级">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_SCENIC_STAR)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="detail">
        <el-input v-model="formData.detail" placeholder="请输入描述" type="textarea"/>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <UploadImg v-model="formData.img" />
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
import { ScenicAreaApi, ScenicAreaVO } from '@/api/agriculture/scenicarea'

/** 景区管理 表单 */
defineOptions({ name: 'ScenicAreaForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  scenicName: undefined,
  lon: undefined,
  lat: undefined,
  location: undefined,
  starLevel: undefined,
  detail: undefined,
  img: undefined,
})
const formRules = reactive({
  scenicName: [{ required: true, message: '景区名称不能为空', trigger: 'blur' }],
  location: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
  starLevel: [{ required: true, message: '请选择景区星级', trigger: 'change' }],
  img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
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
      formData.value = await ScenicAreaApi.getScenicArea(id)
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
    const data = formData.value as unknown as ScenicAreaVO
    if (formType.value === 'create') {
      await ScenicAreaApi.createScenicArea(data)
      message.success(t('common.createSuccess'))
    } else {
      await ScenicAreaApi.updateScenicArea(data)
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
    scenicName: undefined,
    lon: undefined,
    lat: undefined,
    location: undefined,
    starLevel: undefined,
    detail: undefined,
    img: undefined,
  }
  formRef.value?.resetFields()
}

</script>
