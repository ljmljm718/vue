<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="openId" prop="openId">
        <el-input v-model="formData.openId" placeholder="请输入openId"/>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="formData.nickName" placeholder="请输入用户昵称"/>
      </el-form-item>
      <!--      <el-form-item label="用户头像" prop="buyerImg">-->
      <!--        <el-input v-model="formData.buyerImg" placeholder="请输入用户头像"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="备用字段1" prop="buyerOne">-->
      <!--        <el-input v-model="formData.buyerOne" placeholder="请输入备用字段1" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="备用字段2" prop="buyerTwo">-->
      <!--        <el-input v-model="formData.buyerTwo" placeholder="请输入备用字段2" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="备用字段3" prop="buyerThree">-->
      <!--        <el-input v-model="formData.buyerThree" placeholder="请输入备用字段3" />-->
      <!--      </el-form-item>-->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {BuyerInfoApi, BuyerInfoVO} from '@/api/agriculture/buyerinfo'

/** 买家管理详情 表单 */
defineOptions({name: 'BuyerInfoForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  openId: undefined,
  nickName: undefined,
  buyerImg: undefined,
  buyerOne: undefined,
  buyerTwo: undefined,
  buyerThree: undefined,
  remark: undefined
})
const formRules = reactive({
  nickName: [{required: true, message: '用户昵称不能为空', trigger: 'blur'}]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await BuyerInfoApi.getBuyerInfo(id)
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
    const data = formData.value as unknown as BuyerInfoVO
    if (formType.value === 'create') {
      await BuyerInfoApi.createBuyerInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await BuyerInfoApi.updateBuyerInfo(data)
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
    openId: undefined,
    nickName: undefined,
    buyerImg: undefined,
    buyerOne: undefined,
    buyerTwo: undefined,
    buyerThree: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
