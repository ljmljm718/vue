<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!-- <el-form-item label="所属任务id" prop="tfId">
        <el-input v-model="formData.tfId" placeholder="请输入所属任务id" />
      </el-form-item> -->
      <el-form-item label="料桶名" prop="chargingBasketName">
        <el-input v-model="formData.chargingBasketName" placeholder="请输入料桶名" />
      </el-form-item>
      <!-- <el-form-item label="上水阀id" prop="upperWaterValveId">
        <el-input v-model="formData.upperWaterValveId" placeholder="请输入上水阀id" />
      </el-form-item> -->
      <el-form-item label="上水量" prop="upperWaterYield">
        <el-input v-model="formData.upperWaterYield" placeholder="请输入上水量" />
      </el-form-item>
      <!-- <el-form-item label="混肥器id" prop="fertilizerMixerId">
        <el-input v-model="formData.fertilizerMixerId" placeholder="请输入混肥器id" />
      </el-form-item> -->
      <el-form-item label="混肥器状态" prop="fertilizerMixerStatus">
        <el-select v-model="formData.fertilizerMixerStatus" placeholder="请选择混肥器状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="定量桶状态" prop="measureBucketStatus">
        <el-select v-model="formData.measureBucketStatus" placeholder="请选择定量桶状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
import { TaskFertilizationDetailApi, TaskFertilizationDetailVO } from '@/api/agriculture/taskfertilizationdetail'

/** 施肥任务明细 表单 */
defineOptions({ name: 'TaskFertilizationDetailForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  tfId: undefined,
  chargingBasketName: undefined,
  upperWaterValveId: undefined,
  upperWaterYield: undefined,
  fertilizerMixerId: undefined,
  fertilizerMixerStatus: undefined,
  measureBucketStatus: undefined
})
const formRules = reactive({
  fertilizerMixerStatus: [{ required: true, message: '混肥器状态不能为空', trigger: 'change' }],
  measureBucketStatus: [{ required: true, message: '定量桶状态不能为空', trigger: 'change' }]
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
      formData.value = await TaskFertilizationDetailApi.getTaskFertilizationDetail(id)
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
    const data = formData.value as unknown as TaskFertilizationDetailVO
    if (formType.value === 'create') {
      await TaskFertilizationDetailApi.createTaskFertilizationDetail(data)
      message.success(t('common.createSuccess'))
    } else {
      await TaskFertilizationDetailApi.updateTaskFertilizationDetail(data)
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
    tfId: undefined,
    chargingBasketName: undefined,
    upperWaterValveId: undefined,
    upperWaterYield: undefined,
    fertilizerMixerId: undefined,
    fertilizerMixerStatus: undefined,
    measureBucketStatus: undefined
  }
  formRef.value?.resetFields()
}
</script>