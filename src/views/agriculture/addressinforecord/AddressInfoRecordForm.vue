<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址标识号" prop="addressNumber">
            <el-input v-model="formData.addressNumber" placeholder="请输入地址标识号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="formData.contact" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地区信息" prop="areaInfo">
            <!--        <el-input v-model="formData.areaInfo" placeholder="请输入地区信息" />-->
            <el-cascader :options="areaSelectData" style="width: 100%"
                         class="full-width" clearable
                         v-model="formData.areaInfo" placeholder="请选择销售地"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细地址" prop="fullAddress">
            <el-input v-model="formData.fullAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input v-model="formData.zipCode" placeholder="请输入邮政编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否默认" prop="isDefault">
            <!--        <el-input v-model="formData.isDefault" placeholder="请输入是否默认" />-->
            <el-switch
              v-model="formData.isDefault"
              active-value="0"
              inactive-value="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AddressInfoRecordApi, AddressInfoRecordVO } from '@/api/agriculture/addressinforecord'
import {codeToText, regionData} from 'element-china-area-data';// 地址级联选择器

/** 地址信息记录 表单 */
defineOptions({ name: 'AddressInfoRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const areaSelectData = regionData // options绑定的数据就是引入的 regionData

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  addressNumber: undefined,
  contact: undefined,
  phoneNumber: undefined,
  areaInfo: undefined,
  fullAddress: undefined,
  zipCode: undefined,
  isDefault: "0",
  remark: undefined,
})
const formRules = reactive({
  addressNumber: [{ required: true, message: '地址标识号不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '手机号码不能为空', trigger: 'blur' },
    {
      required: true,
      pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }],
  areaInfo: [{ required: true, message: '地区信息不能为空', trigger: 'blur' }],
  fullAddress: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
  zipCode: [{pattern: /^[1-9]\d{5}$/, message: '请输入正确的邮政编码', trigger: 'blur' }],
  isDefault: [{ required: true, message: '是否默认不能为空', trigger: 'blur' }],
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
      formData.value = await AddressInfoRecordApi.getAddressInfoRecord(id)
      if (formData.value.areaInfo) {
        formData.value.areaInfo = formData.value.areaInfo.split(",")
      }
      console.log(formData.value.areaInfo)
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
    formData.value.areaInfo = formData.value.areaInfo.join(',')
    const data = formData.value as unknown as AddressInfoRecordVO
    if (formType.value === 'create') {
      await AddressInfoRecordApi.createAddressInfoRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await AddressInfoRecordApi.updateAddressInfoRecord(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const getCodeToText = (codeStr) => {
  if (null === codeStr || undefined === codeStr) {
    return null;
  }
  let codeArray = codeStr.split(",")

  let area = ""
  switch (codeArray.length) {
    case 1:
      area += codeToText[codeArray[0]]
      break
    case 2:
      area += codeToText[codeArray[0]] + "/" + codeToText[codeArray[1]]
      break
    case 3:
      area += codeToText[codeArray[0]] + "/" + codeToText[codeArray[1]] + "/" + codeToText[codeArray[2]]
      break
    default:
      break
  }
  console.log(area)
  return area;
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    addressNumber: undefined,
    contact: undefined,
    phoneNumber: undefined,
    areaInfo: undefined,
    fullAddress: undefined,
    zipCode: undefined,
    isDefault: "0",
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
