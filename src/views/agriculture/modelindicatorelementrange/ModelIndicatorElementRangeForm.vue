<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="指标要素" prop="indicatorElementId">
        <el-input v-model="formData.indicatorElementId" placeholder="请输入指标要素" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="下限" prop="lowLimit">
            <el-input v-model="formData.lowLimit" placeholder="请输入下限" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上限" prop="highLimit">
            <el-input v-model="formData.highLimit" placeholder="请输入上限" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="formData.unit" placeholder="请输入单位" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="健康比例" prop="healthRatio">
            <el-input v-model="formData.healthRatio" placeholder="请输入健康比例" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="健康等级" prop="healthLevel">
            <el-input v-model="formData.healthLevel" placeholder="请输入健康等级" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序" prop="sortBy">
            <el-input v-model="formData.sortBy" placeholder="请输入排序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="指标结果" prop="indicatorResult">
        <el-input v-model="formData.indicatorResult" placeholder="请输入指标结果" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ModelIndicatorElementRangeApi, ModelIndicatorElementRangeVO } from '@/api/agriculture/modelindicatorelementrange'

/** 指标要素范围 表单 */
defineOptions({ name: 'ModelIndicatorElementRangeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  indicatorElementId: undefined,
  lowLimit: undefined,
  highLimit: undefined,
  unit: undefined,
  healthRatio: undefined,
  healthLevel: undefined,
  indicatorResult: undefined,
  sortBy: undefined,
})
const formRules = reactive({
  indicatorElementId: [{ required: true, message: '指标要素id不能为空', trigger: 'blur' }],
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
      formData.value = await ModelIndicatorElementRangeApi.getModelIndicatorElementRange(id)
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
    const data = formData.value as unknown as ModelIndicatorElementRangeVO
    if (formType.value === 'create') {
      await ModelIndicatorElementRangeApi.createModelIndicatorElementRange(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelIndicatorElementRangeApi.updateModelIndicatorElementRange(data)
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
    indicatorElementId: undefined,
    lowLimit: undefined,
    highLimit: undefined,
    unit: undefined,
    healthRatio: undefined,
    healthLevel: undefined,
    indicatorResult: undefined,
    sortBy: undefined,
  }
  formRef.value?.resetFields()
}
</script>
