<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入规则名称"/>
      </el-form-item>
<!--      <el-form-item label="处理器的名字" prop="handlerName">-->
<!--        <el-input v-model="formData.handlerName" placeholder="请输入处理器的名字" disabled/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="处理器的参数" prop="handlerParam">-->
<!--        <el-input v-model="formData.handlerParam" placeholder="请输入处理器的参数" disabled/>-->
<!--      </el-form-item>-->
      <el-form-item label="CRON 表达式" prop="cronExpression">
<!--        <el-input v-model="formData.cronExpression" placeholder="请输入CRON 表达式"/>-->
        <crontab v-model="formData.cronExpression" />
      </el-form-item>
      <el-form-item label="重试次数" prop="retryCount">
        <el-input v-model="formData.retryCount" placeholder="请输入重试次数。设置为 0 时，不进行重试"/>
      </el-form-item>
      <el-form-item label="重试间隔" prop="retryInterval">
        <el-input v-model="formData.retryInterval" placeholder="请输入重试间隔，单位：毫秒。设置为 0 时，无需间隔"/>
      </el-form-item>
      <el-form-item label="监控超时时间" prop="monitorTimeout">
        <el-input v-model="formData.monitorTimeout" placeholder="请输入监控超时时间，单位：毫秒"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {CheckRuleApi, CheckRuleVO} from '@/api/agriculture/checkrule'
import {InfraJobStatusEnum} from "@/utils/constants";

/** 巡检规则 表单 */
defineOptions({name: 'CheckRuleForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  status: InfraJobStatusEnum.NORMAL,
  handlerName: '',
  handlerParam: '',
  cronExpression: '',
  retryCount: undefined,
  retryInterval: undefined,
  monitorTimeout: undefined,
  remark: undefined,
  deptId: undefined,
  userId: undefined,
})
const formRules = reactive({
  name: [{required: true, message: '规则名称不能为空', trigger: 'blur'}],
  // handlerName: [{required: true, message: '处理器的名字不能为空', trigger: 'blur'}],
  cronExpression: [{required: true, message: 'CRON 表达式不能为空', trigger: 'change'}],
  retryCount: [{required: true, message: '重试次数不能为空', trigger: 'blur'}],
  retryInterval: [{required: true, message: '重试间隔不能为空', trigger: 'blur'}],
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
      formData.value = await CheckRuleApi.getCheckRule(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CheckRuleVO
    if (formType.value === 'create') {
      await CheckRuleApi.createCheckRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await CheckRuleApi.updateCheckRule(data)
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
    name: undefined,
    status: InfraJobStatusEnum.NORMAL,
    handlerName: '',
    handlerParam: '',
    cronExpression: '',
    retryCount: undefined,
    retryInterval: undefined,
    monitorTimeout: undefined,
    remark: undefined,
    deptId: undefined,
    userId: undefined,
  }
  formRef.value?.resetFields()
}
</script>
