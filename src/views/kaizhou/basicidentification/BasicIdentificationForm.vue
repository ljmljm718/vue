<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="标识码" prop="identificationCode">
        <el-input v-model="formData.identificationCode" placeholder="请输入标识码"/>
      </el-form-item>
      <el-form-item label="赋码" prop="isUniqueCode">
        <el-select
          v-model="formData.isUniqueCode"
          clearable
          placeholder="请选择赋码状态"
          style="width: 100%;"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        <span v-if="formData.isUniqueCode === '1' && formType === 'update'" style="color: red">注：关闭赋码,编辑时会自动清空二维码</span>
      </el-form-item>
      <!--      <el-form-item label="二维码" prop="qrCode">-->
      <!--        <el-input v-model="formData.qrCode" placeholder="请输入二维码" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="赋码时间" prop="uniqueCodeTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="formData.uniqueCodeTime"-->
      <!--          type="date"-->
      <!--          value-format="x"-->
      <!--          placeholder="选择赋码时间"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="是否绑定" prop="isBinding">-->
      <!--        <el-select v-model="formData.isBinding" placeholder="请选择是否绑定">-->
      <!--          <el-option-->
      <!--            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_IDENTIFICATION_BINDING)"-->
      <!--            :key="dict.value"-->
      <!--            :label="dict.label"-->
      <!--            :value="dict.value"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {BasicIdentificationApi, BasicIdentificationVO} from '@/api/kaizhou/basicidentification'

/** 标识管理 表单 */
defineOptions({name: 'BasicIdentificationForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  identificationCode: undefined,
  qrCode: undefined,
  uniqueCodeTime: undefined,
  isBinding: undefined,
  isUniqueCode: '0',
})
const formRules = reactive({
  identificationCode: [{required: true, message: '标识码不能为空', trigger: 'blur'},
    //   {
    //   required: true,
    //   validator: async (rule, value, callback) => {
    //     if (value) callback(new Error('Error'))
    //     callback()
    //   },
    //   trigger: "blur"
    // }
  ],
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
      formData.value = await BasicIdentificationApi.getBasicIdentification(id)
      if (type === 'update') {
        formData.value.isUniqueCode = '0';
      }
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
    const data = formData.value as unknown as BasicIdentificationVO
    if (formType.value === 'create') {
      await BasicIdentificationApi.createBasicIdentification(data)
      message.success(t('common.createSuccess'))
    } else {
      data.qrCode = window.location.origin + "/QRCode?qrCode="
      await BasicIdentificationApi.updateBasicIdentification(data)
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
    identificationCode: undefined,
    qrCode: undefined,
    uniqueCodeTime: undefined,
    isBinding: '0',
    isUniqueCode: '0',
  }
  formRef.value?.resetFields()
}
</script>
