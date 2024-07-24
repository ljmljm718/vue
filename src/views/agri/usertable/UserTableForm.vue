<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="年份" prop="years">
        <el-input v-model="formData.years" placeholder="请输入年份" />
      </el-form-item>
      <el-form-item label="区县" prop="county">
        <el-input v-model="formData.county" placeholder="请输入区县" />
      </el-form-item>
      <el-form-item label="示范村" prop="village">
        <el-input v-model="formData.village" placeholder="请输入示范村" />
      </el-form-item>
      <el-form-item label="帮扶城市" prop="city">
        <el-input v-model="formData.city" placeholder="请输入帮扶城市" />
      </el-form-item>
      <el-form-item label="产业类别" prop="form">
        <el-input v-model="formData.form" placeholder="请输入产业类别" />
      </el-form-item>
      <el-form-item label="产业" prop="industry">
        <el-input v-model="formData.industry" placeholder="请输入产业" />
      </el-form-item>
      <el-form-item label="大屏地址" prop="bigscreen">
        <el-input v-model="formData.bigscreen" placeholder="请输入大屏地址" />
      </el-form-item>
      <el-form-item label="基地园区" prop="park">
        <el-input v-model="formData.park" placeholder="请输入基地园区" />
      </el-form-item>
      <el-form-item label="特色品牌" prop="product">
        <el-input v-model="formData.product" placeholder="请输入特色品牌" />
      </el-form-item>
      <el-form-item label="是否帮扶地域" prop="yesno">
        <el-input v-model="formData.yesno" placeholder="请输入是否帮扶地域" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { UserTableApi, UserTableVO } from '@/api/agri/usertable'

/** 数农门户 表单 */
defineOptions({ name: 'UserTableForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  years: undefined,
  county: undefined,
  village: undefined,
  city: undefined,
  form: undefined,
  industry: undefined,
  bigscreen: undefined,
  park: undefined,
  product: undefined,
  yesno: undefined,
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
      formData.value = await UserTableApi.getUserTable(id)
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
    const data = formData.value as unknown as UserTableVO
    if (formType.value === 'create') {
      await UserTableApi.createUserTable(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserTableApi.updateUserTable(data)
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
    years: undefined,
    county: undefined,
    village: undefined,
    city: undefined,
    form: undefined,
    industry: undefined,
    bigscreen: undefined,
    park: undefined,
    product: undefined,
    yesno: undefined,
  }
  formRef.value?.resetFields()
}
</script>
