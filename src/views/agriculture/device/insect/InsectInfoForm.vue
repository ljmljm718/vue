<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备id" prop="equId">
        <el-input v-model="formData.equId" placeholder="请输入设备id" />
      </el-form-item>
      <el-form-item label="采集时间" prop="gatherTime">
        <el-date-picker
          v-model="formData.gatherTime"
          type="date"
          value-format="x"
          placeholder="选择采集时间"
        />
      </el-form-item>
      <el-form-item label="虫害数量" prop="insectPestNumber">
        <el-input v-model="formData.insectPestNumber" placeholder="请输入虫害数量" />
      </el-form-item>
      <el-form-item label="虫害种类" prop="insectPestKind">
        <el-input v-model="formData.insectPestKind" placeholder="请输入虫害种类" />
      </el-form-item>
      <el-form-item label="杀虫仓温度" prop="insectTemperature">
        <el-input v-model="formData.insectTemperature" placeholder="请输入杀虫仓温度" />
      </el-form-item>
      <el-form-item label="烘干仓温度" prop="dryingTemperature">
        <el-input v-model="formData.dryingTemperature" placeholder="请输入烘干仓温度" />
      </el-form-item>
      <el-form-item label="诱虫灯状态" prop="insectLampStatus">
        <el-radio-group v-model="formData.insectLampStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="杀虫灯状态" prop="killInsectStatus">
        <el-radio-group v-model="formData.killInsectStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="杀虫灯挡板状态" prop="killInsectBaffleStatus">
        <el-radio-group v-model="formData.killInsectBaffleStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="摄像头状态" prop="insectVideo">
        <el-radio-group v-model="formData.insectVideo">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
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
import { InsectInfoApi, InsectInfoVO } from '@/api/agriculture/insectinfo'

/** 虫情信息 表单 */
defineOptions({ name: 'InsectInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  equId: undefined,
  gatherTime: undefined,
  insectPestNumber: undefined,
  insectPestKind: undefined,
  insectTemperature: undefined,
  dryingTemperature: undefined,
  insectLampStatus: undefined,
  killInsectStatus: undefined,
  killInsectBaffleStatus: undefined,
  insectVideo: undefined,
})
const formRules = reactive({
  gatherTime: [{ required: true, message: '采集时间不能为空', trigger: 'blur' }],
  insectPestNumber: [{ required: true, message: '虫害数量不能为空', trigger: 'blur' }],
  insectPestKind: [{ required: true, message: '虫害种类不能为空', trigger: 'blur' }],
  insectTemperature: [{ required: true, message: '杀虫仓温度不能为空', trigger: 'blur' }],
  dryingTemperature: [{ required: true, message: '烘干仓温度不能为空', trigger: 'blur' }],
  insectLampStatus: [{ required: true, message: '诱虫灯状态不能为空', trigger: 'blur' }],
  killInsectStatus: [{ required: true, message: '杀虫灯状态不能为空', trigger: 'blur' }],
  killInsectBaffleStatus: [{ required: true, message: '杀虫灯挡板状态不能为空', trigger: 'blur' }],
  insectVideo: [{ required: true, message: '摄像头状态不能为空', trigger: 'blur' }],
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
      formData.value = await InsectInfoApi.getInsectInfo(id)
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
    const data = formData.value as unknown as InsectInfoVO
    if (formType.value === 'create') {
      await InsectInfoApi.createInsectInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await InsectInfoApi.updateInsectInfo(data)
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
    equId: undefined,
    gatherTime: undefined,
    insectPestNumber: undefined,
    insectPestKind: undefined,
    insectTemperature: undefined,
    dryingTemperature: undefined,
    insectLampStatus: undefined,
    killInsectStatus: undefined,
    killInsectBaffleStatus: undefined,
    insectVideo: undefined,
  }
  formRef.value?.resetFields()
}
</script>
