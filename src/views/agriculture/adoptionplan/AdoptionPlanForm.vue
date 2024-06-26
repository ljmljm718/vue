<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="流水号" prop="serialNumber">
        <el-input v-model="formData.serialNumber" placeholder="请输入流水号" />
      </el-form-item>
      <el-form-item label="计划名称" prop="planName">
        <el-input v-model="formData.planName" placeholder="请输入计划名称" />
      </el-form-item>
      <el-form-item label="计划年度" prop="planYear">
        <el-input v-model="formData.planYear" placeholder="请输入计划年度" />
      </el-form-item>
      <el-form-item label="认养品种" prop="adoptionKind">
        <el-input v-model="formData.adoptionKind" placeholder="请输入认养品种" />
      </el-form-item>
      <el-form-item label="预售开始时间" prop="presaleStart">
        <el-date-picker
          v-model="formData.presaleStart"
          type="date"
          value-format="x"
          placeholder="选择预售开始时间"
        />
      </el-form-item>
      <el-form-item label="预售结束时间" prop="presaleEnd">
        <el-date-picker
          v-model="formData.presaleEnd"
          type="date"
          value-format="x"
          placeholder="选择预售结束时间"
        />
      </el-form-item>
      <el-form-item label="预计收货开始时间" prop="receivingStart">
        <el-date-picker
          v-model="formData.receivingStart"
          type="date"
          value-format="x"
          placeholder="选择预计收货开始时间"
        />
      </el-form-item>
      <el-form-item label="预计收货结束时间" prop="receivingEnd">
        <el-date-picker
          v-model="formData.receivingEnd"
          type="date"
          value-format="x"
          placeholder="选择预计收货结束时间"
        />
      </el-form-item>
      <el-form-item label="计划描述" prop="planDescribe">
        <el-input v-model="formData.planDescribe" placeholder="请输入计划描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AdoptionPlanApi, AdoptionPlanVO } from '@/api/agriculture/adoptionplan'

/** 认养计划 表单 */
defineOptions({ name: 'AdoptionPlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  serialNumber: undefined,
  planName: undefined,
  planYear: undefined,
  adoptionKind: undefined,
  presaleStart: undefined,
  presaleEnd: undefined,
  receivingStart: undefined,
  receivingEnd: undefined,
  planDescribe: undefined,
})
const formRules = reactive({
  planName: [{ required: true, message: '计划名称不能为空', trigger: 'blur' }],
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
      formData.value = await AdoptionPlanApi.getAdoptionPlan(id)
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
    const data = formData.value as unknown as AdoptionPlanVO
    if (formType.value === 'create') {
      await AdoptionPlanApi.createAdoptionPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await AdoptionPlanApi.updateAdoptionPlan(data)
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
    serialNumber: undefined,
    planName: undefined,
    planYear: undefined,
    adoptionKind: undefined,
    presaleStart: undefined,
    presaleEnd: undefined,
    receivingStart: undefined,
    receivingEnd: undefined,
    planDescribe: undefined,
  }
  formRef.value?.resetFields()
}
</script>
