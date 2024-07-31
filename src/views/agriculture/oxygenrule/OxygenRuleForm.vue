<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="因素" prop="oxygenId">
<!--        <el-input v-model="formData.oxygenId" placeholder="请输入因素ID" />-->
        <el-select v-model="formData.oxygenId" placeholder="因素">
          <el-option
            v-for="item in formOxygenFactorAll"
            :key="item.id"
            :label="'因素名称：' +item.factorName + '(绑定设备：' + item.deviceNames+ ')'"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="最小值" prop="minNum">
        <el-input v-model="formData.minNum" placeholder="请输入最小值,不得大于最大值" />
      </el-form-item>
      <el-form-item label="最大值" prop="maxNum">
        <el-input v-model="formData.maxNum" placeholder="请输入最大值，不得小于最小值" />
      </el-form-item>
      <el-form-item label="目标分值" prop="targetNum">
        <el-input v-model="formData.targetNum" placeholder="请输入目标分值，建议100" />
      </el-form-item>
      <el-form-item label="评分值" prop="scoreNum">
        <el-input v-model="formData.scoreNum" placeholder="请输入评分值，不得大于目标分值" />
      </el-form-item>
      <el-form-item label="调整建议" prop="suggestText">
        <el-input v-model="formData.suggestText" placeholder="请输入调整建议，例如：当前XX值异常，请及时调整" />
      </el-form-item>
      <el-form-item label="建议功率" prop="suggestNum">
        <el-input v-model="formData.suggestNum" placeholder="请输入建议功率，例如：43%" />
      </el-form-item>
<!--      <el-form-item label="增氧设备ID" prop="equipId">-->
<!--        <el-input v-model="formData.equipId" placeholder="请输入增氧设备ID" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="监测设备ID" prop="equipjianId">-->
<!--        <el-input v-model="formData.equipjianId" placeholder="请输入监测设备ID" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="基地ID" prop="baseId">-->
<!--        <el-input v-model="formData.baseId" placeholder="请输入基地ID" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="地块ID" prop="plotId">-->
<!--        <el-input v-model="formData.plotId" placeholder="请输入地块ID" />-->
<!--      </el-form-item>-->
      <el-form-item label="是否警告" prop="warnStatus">
        <el-radio-group v-model="formData.warnStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="警告内容" prop="warnContent">
        <el-input v-model="formData.warnContent" type="textarea" placeholder="请输入警告内容" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
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
import { OxygenRuleApi, OxygenRuleVO } from '@/api/agriculture/oxygenrule'
import {OxygenFactorApi} from "@/api/agriculture/oxygenfactor";

/** 因素评分规则 表单 */
defineOptions({ name: 'OxygenRuleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  maxNum: undefined,
  minNum: undefined,
  scoreNum: undefined,
  targetNum: undefined,
  suggestText: undefined,
  suggestNum: undefined,
  equipId: undefined,
  equipjianId: undefined,
  baseId: undefined,
  plotId: undefined,
  oxygenId: undefined,
  warnStatus: undefined,
  warnContent: undefined,
  remark: undefined
})
const formOxygenFactorAll =  ref([])
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formOxygenFactorAll.value = await OxygenFactorApi.getAll()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await OxygenRuleApi.getOxygenRule(id)
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
    const data = formData.value as unknown as OxygenRuleVO
    if (formType.value === 'create') {
      await OxygenRuleApi.createOxygenRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await OxygenRuleApi.updateOxygenRule(data)
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
    maxNum: undefined,
    minNum: undefined,
    scoreNum: undefined,
    targetNum: undefined,
    suggestText: undefined,
    suggestNum: undefined,
    equipId: undefined,
    equipjianId: undefined,
    baseId: undefined,
    plotId: undefined,
    oxygenId: undefined,
    warnStatus: undefined,
    warnContent: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
