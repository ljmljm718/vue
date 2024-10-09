<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="formData.companyName" placeholder="请输入公司名称" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人" prop="legalPerson">
            <el-input v-model="formData.legalPerson" placeholder="请输入法人" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contactPhone">
            <el-input v-model="formData.contactPhone" placeholder="请输入联系方式" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="注册地址" prop="registeredAddress">
            <el-input v-model="formData.registeredAddress" placeholder="请输入注册地址" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="注册资金" prop="registeredCapital">
            <el-input v-model="formData.registeredCapital" placeholder="请输入注册资金" :disabled="disabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立时间" prop="establishDate">
            <el-date-picker
                v-model="formData.establishDate"
                style="width: 100%"
                type="date"
                value-format="x"
                placeholder="选择成立时间"
                :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="统一社会信用代码" prop="socialCreditCode">
            <el-input v-model="formData.socialCreditCode" placeholder="请输入统一社会信用代码" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="营业执照" prop="businessLicense">
            <el-input v-model="formData.businessLicense" placeholder="请输入营业执照" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="食品生产许可证" prop="foodProduceLicense">
            <el-input v-model="formData.foodProduceLicense" placeholder="请输入食品生产许可证" :disabled="disabled"/>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-form-item label="审批状态" prop="approvalStatus">-->
<!--        <el-select-->
<!--          v-model="formData.approvalStatus"-->
<!--          placeholder="请选择审批状态"-->
<!--          clearable-->
<!--          class="!w-240px"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.PRODUCER_ENTRY_APPROVAL_STATUS)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" v-if="!disabled">确 定</el-button>
      <el-button @click="dialogVisible = false" v-if="!disabled">取 消</el-button>
      <el-button @click="approvalForm" type="primary" v-if="approvalShow">审 批</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProducerEntryApi, ProducerEntryVO } from '@/api/agriculture/producerentry'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 生产商入库 表单 */
defineOptions({ name: 'ProducerEntryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const approvalShow = ref(false) // 审批按钮是否展示
const disabled = ref(false) // 表单是否可编辑
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  companyName: undefined,
  legalPerson: undefined,
  registeredAddress: undefined,
  contactPhone: undefined,
  registeredCapital: undefined,
  socialCreditCode: undefined,
  establishDate: undefined,
  businessLicense: undefined,
  foodProduceLicense: undefined,
  approvalStatus: undefined,
})
const formRules = reactive({
  companyName: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
  businessLicense: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }],
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
      formData.value = await ProducerEntryApi.getProducerEntry(id)
      if (formType.value === 'detail') disabled.value = true
      if (formType.value === 'approval') {
        disabled.value = true
        approvalShow.value = true
        dialogTitle.value = '审批'
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success', 'refresh']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProducerEntryVO
    if (formType.value === 'create') {
      await ProducerEntryApi.createProducerEntry(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProducerEntryApi.updateProducerEntry(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

//修改审批状态
const approvalForm = async () => {
  try {
    // 修改状态的二次确认
    await message.confirm('确认通过当前入库审批吗？')
    const data = formData.value as unknown as ProducerEntryVO
    data.approvalStatus = '1'
    // 发起修改状态
    await ProducerEntryApi.updateProducerEntry(data)
    dialogVisible.value = false
    emit('refresh')
  } catch {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    companyName: undefined,
    legalPerson: undefined,
    registeredAddress: undefined,
    contactPhone: undefined,
    registeredCapital: undefined,
    socialCreditCode: undefined,
    establishDate: undefined,
    businessLicense: undefined,
    foodProduceLicense: undefined,
    approvalStatus: undefined,
  }
  formRef.value?.resetFields()
  disabled.value = false
  approvalShow.value = false
}
</script>
