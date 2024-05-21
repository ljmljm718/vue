<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="主题名称" prop="topicName">
        <el-input v-model="formData.topicName" placeholder="请输入主题名称" />
      </el-form-item>
      <el-form-item label="主题类型" prop="topicType">
        <el-select v-model="formData.topicType" placeholder="请选择主题类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MQTT_TOPIC_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主题关键字" prop="topicKey">
        <el-input v-model="formData.topicKey" placeholder="请输入主题关键字" />
      </el-form-item>
      <el-form-item label="主题" prop="topicPath">
        <el-input v-model="formData.topicPath" placeholder="请输入主题" />
      </el-form-item>
      <el-form-item label="单位" prop="topicUnit">
        <el-input v-model="formData.topicUnit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="是否订阅" prop="topicIsorder">
        <el-select v-model="formData.topicIsorder" style="width: 100%;" disabled>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MQTT_SUBSCRIBE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理类" prop="topicClass">
        <el-input v-model="formData.topicClass" placeholder="请输入处理类" />
      </el-form-item>
      <el-form-item label="备注" prop="topicNote">
        <el-input v-model="formData.topicNote" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TopicDataApi, TopicDataVO } from '@/api/agriculture/topicdata'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";

/** 主题订阅 表单 */
defineOptions({ name: 'TopicDataForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  topicName: undefined,
  topicKey: undefined,
  topicPath: undefined,
  topicUnit: undefined,
  topicIsorder: undefined,
  topicClass: undefined,
  topicNote: undefined,
  topicType: undefined,
})
const formRules = reactive({
  topicName: [{ required: true, message: '主题名称不能为空', trigger: 'blur' }],
  topicKey: [{ required: true, message: '主题关键字不能为空', trigger: 'blur' }],
  topicPath: [{ required: true, message: '主题不能为空', trigger: 'blur' }],
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
      formData.value = await TopicDataApi.getTopicData(id)
    } finally {
      formLoading.value = false
    }
  }else {
    formData.value.topicIsorder = "0"
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
    const data = formData.value as unknown as TopicDataVO
    if (formType.value === 'create') {
      await TopicDataApi.createTopicData(data)
      message.success(t('common.createSuccess'))
    } else {
      await TopicDataApi.updateTopicData(data)
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
    topicName: undefined,
    topicKey: undefined,
    topicPath: undefined,
    topicUnit: undefined,
    topicIsorder: undefined,
    topicClass: undefined,
    topicNote: undefined,
    topicType: undefined,
  }
  formRef.value?.resetFields()
}
</script>
