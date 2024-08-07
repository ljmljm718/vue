<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="生长期" prop="growthPeriod">
        <el-input v-model="formData.growthPeriod" placeholder="请输入生长期" />
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-input v-model="formData.time" placeholder="请输入时间" />
      </el-form-item>
      <el-form-item label="周期" prop="cycle">
        <el-input v-model="formData.cycle" placeholder="请输入周期" />
      </el-form-item>
      <el-form-item label="投喂频率" prop="feedingFrequency">
        <el-input type="textarea" v-model="formData.feedingFrequency" placeholder="请输入投喂频率" />
      </el-form-item>
      <el-form-item label="投喂时间" prop="feedingTime">
        <el-input type="textarea" v-model="formData.feedingTime" placeholder="请输入投喂时间" />
      </el-form-item>
      <el-form-item label="注意事项" prop="precautions">
        <el-input type="textarea" v-model="formData.precautions" placeholder="请输入注意事项" />
      </el-form-item>
      <el-form-item label="投喂建议" prop="feedingAdvice">
        <el-input type="textarea" v-model="formData.feedingAdvice" placeholder="请输入投喂建议" />
      </el-form-item>
      <el-form-item label="投喂饲料" prop="feedingFood">
        <el-input  v-model="formData.feedingFood" placeholder="请输入投喂饲料" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FeedingStrategyApi, FeedingStrategyVO } from '@/api/agriculture/feedingstrategy'

/** 投喂策略 表单 */
defineOptions({ name: 'FeedingStrategyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  growthPeriod: undefined,
  time: undefined,
  cycle: undefined,
  feedingFrequency: undefined,
  feedingTime: undefined,
  precautions: undefined,
  feedingAdvice: undefined,
  feedingFood: undefined,
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
      formData.value = await FeedingStrategyApi.getFeedingStrategy(id)
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
    const data = formData.value as unknown as FeedingStrategyVO
    if (formType.value === 'create') {
      await FeedingStrategyApi.createFeedingStrategy(data)
      message.success(t('common.createSuccess'))
    } else {
      await FeedingStrategyApi.updateFeedingStrategy(data)
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
    growthPeriod: undefined,
    time: undefined,
    cycle: undefined,
    feedingFrequency: undefined,
    feedingTime: undefined,
    precautions: undefined,
    feedingAdvice: undefined,
    feedingFood: undefined,
  }
  formRef.value?.resetFields()
}
</script>