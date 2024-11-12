<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="因子名称" prop="factorName">
        <el-input v-model="formData.factorName" placeholder="请输入因子名称"/>
      </el-form-item>
      <el-form-item label="监测类型" prop="monitorType">
        <el-select v-model="formData.monitorType" placeholder="请选择传感器监测类型" class="w-1/1">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MONITOR_TYPE)"
            :key="dict.label"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="因子类别" prop="factorType">
        <el-select v-model="formData.factorType" placeholder="请选择因子类别" class="w-1/1">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.FACTOR_TYPE)"
            :key="dict.label"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="影响类别" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入影响类别"/>
      </el-form-item>
      <el-form-item label="影响结果" prop="influence">
        <el-input v-model="formData.influence" type="textarea" placeholder="请输入影响结果"/>
      </el-form-item>
      <el-form-item label="影响信息" prop="influenceInfo">
        <el-input v-model="formData.influenceInfo" type="textarea" placeholder="请输入影响信息"/>
      </el-form-item>
      <el-form-item label="建议" prop="proposal">
        <el-input v-model="formData.proposal" type="textarea" placeholder="请输入建议"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {InfluenceFactorApi, InfluenceFactorVO} from '@/api/agri/influencefactor'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 影响因子 表单 */
defineOptions({name: 'InfluenceFactorForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  factorName: undefined,
  factorType: undefined,
  influence: undefined,
  monitorType: undefined,
  proposal: undefined,
  remark: undefined,
  influenceInfo: undefined,
})
const formRules = reactive({
  factorName: [{required: true, message: '因子名称不能为空', trigger: 'blur'}],
  monitorType: [{required: true, message: '传感器监测类型不能为空', trigger: 'blur'}],
  factorType: [{required: true, message: '因子类别不能为空', trigger: 'blur'}],
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
      formData.value = await InfluenceFactorApi.getInfluenceFactor(id)
      console.log("SSS", formData.value)
      // formData.value.monitorType = parseInt(formData.value.monitorType)
      // formData.value.factorType = parseInt(formData.value.factorType)
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
    const data = formData.value as unknown as InfluenceFactorVO
    if (formType.value === 'create') {
      await InfluenceFactorApi.createInfluenceFactor(data)
      message.success(t('common.createSuccess'))
    } else {
      await InfluenceFactorApi.updateInfluenceFactor(data)
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
    factorName: undefined,
    factorType: undefined,
    influence: undefined,
    monitorType: undefined,
    proposal: undefined,
    remark: undefined,
    influenceInfo: undefined,
  }
  formRef.value?.resetFields()
}
</script>
