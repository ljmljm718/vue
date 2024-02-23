<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="种植计划id" prop="plantId">
        <el-input v-model="formData.plantId" placeholder="请输入种植计划id" />
      </el-form-item>
      <el-form-item label="计划编码" prop="recodeCode">
        <el-input v-model="formData.recodeCode" placeholder="请输入计划编码" />
      </el-form-item>
      <el-form-item label="农事定义" prop="farmWork">
        <el-select v-model="formData.farmWork" placeholder="请选择农事定义">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_FARM_WORK)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker
          v-model="formData.recordTime"
          type="datetime"
          value-format="x"
          placeholder="选择记录时间"
        />
      </el-form-item>
      <el-form-item label="数值" prop="recordValue">
        <el-input v-model="formData.recordValue" placeholder="请输入数值" />
      </el-form-item>
      <el-form-item label="单位" prop="recordUnit">
        <el-input v-model="formData.recordUnit" placeholder="请输入单位" />
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
import { PlanRecordApi, PlanRecordVO } from '@/api/kaizhou/planrecord'

/** 农事记录 表单 */
defineOptions({ name: 'PlanRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  plantId: undefined,
  recodeCode: undefined,
  farmWork: undefined,
  remark: undefined,
  recordTime: undefined,
  recordValue: undefined,
  recordUnit: undefined,
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
      formData.value = await PlanRecordApi.getPlanRecord(id)
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
    const data = formData.value as unknown as PlanRecordVO
    if (formType.value === 'create') {
      await PlanRecordApi.createPlanRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await PlanRecordApi.updatePlanRecord(data)
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
    plantId: undefined,
    recodeCode: undefined,
    farmWork: undefined,
    remark: undefined,
    recordTime: undefined,
    recordValue: undefined,
    recordUnit: undefined,
  }
  formRef.value?.resetFields()
}
</script>
