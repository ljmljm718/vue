<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="运输单号" prop="transportNo">
        <el-input v-model="formData.transportNo" placeholder="请输入运输单号" />
      </el-form-item>
      <el-form-item label="起点省份" prop="startProvince">
        <el-input v-model="formData.startProvince" placeholder="请输入起点省份" />
      </el-form-item>
      <el-form-item label="起点城市" prop="startCity">
        <el-input v-model="formData.startCity" placeholder="请输入起点城市" />
      </el-form-item>
      <el-form-item label="起点区域" prop="startArea">
        <el-input v-model="formData.startArea" placeholder="请输入起点区域" />
      </el-form-item>
      <el-form-item label="终点省份" prop="endProvince">
        <el-input v-model="formData.endProvince" placeholder="请输入终点省份" />
      </el-form-item>
      <el-form-item label="终点城市" prop="endCity">
        <el-input v-model="formData.endCity" placeholder="请输入终点城市" />
      </el-form-item>
      <el-form-item label="终点区域" prop="endArea">
        <el-input v-model="formData.endArea" placeholder="请输入终点区域" />
      </el-form-item>
      <el-form-item label="产品编号" prop="productId">
        <el-input v-model="formData.productId" placeholder="请输入产品编号" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formData.productName" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品类型" prop="categoryId">
        <el-input v-model="formData.categoryId" placeholder="请输入产品类型" />
      </el-form-item>
      <el-form-item label="运输时间" prop="transportTime">
        <el-date-picker
          v-model="formData.transportTime"
          type="date"
          value-format="x"
          placeholder="选择运输时间"
        />
      </el-form-item>
      <el-form-item label="运输数量" prop="transportCount">
        <el-input v-model="formData.transportCount" placeholder="请输入运输数量" />
      </el-form-item>
      <el-form-item label="产品单位" prop="productUnitId">
        <el-input v-model="formData.productUnitId" placeholder="请输入产品单位" />
      </el-form-item>
      <el-form-item label="车牌号" prop="vehicleLicense">
        <el-input v-model="formData.vehicleLicense" placeholder="请输入车牌号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { TransportManageApi, TransportManageVO } from '@/api/kaizhou/transportmanage'

/** 运输管理 表单 */
defineOptions({ name: 'TransportManageForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  transportNo: undefined,
  startProvince: undefined,
  startCity: undefined,
  startArea: undefined,
  endProvince: undefined,
  endCity: undefined,
  endArea: undefined,
  productId: undefined,
  productName: undefined,
  categoryId: undefined,
  transportTime: undefined,
  transportCount: undefined,
  productUnitId: undefined,
  vehicleLicense: undefined,
})
const formRules = reactive({
  transportNo: [{ required: true, message: '运输单号不能为空', trigger: 'blur' }],
  startProvince: [{ required: true, message: '起点省份不能为空', trigger: 'blur' }],
  startCity: [{ required: true, message: '起点城市不能为空', trigger: 'blur' }],
  startArea: [{ required: true, message: '起点区域不能为空', trigger: 'blur' }],
  endProvince: [{ required: true, message: '终点省份不能为空', trigger: 'blur' }],
  endCity: [{ required: true, message: '终点城市不能为空', trigger: 'blur' }],
  endArea: [{ required: true, message: '终点区域不能为空', trigger: 'blur' }],
  productId: [{ required: true, message: '产品编号不能为空', trigger: 'blur' }],
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  categoryId: [{ required: true, message: '产品类型不能为空', trigger: 'blur' }],
  transportTime: [{ required: true, message: '运输时间不能为空', trigger: 'blur' }],
  transportCount: [{ required: true, message: '运输数量不能为空', trigger: 'blur' }],
  productUnitId: [{ required: true, message: '产品单位不能为空', trigger: 'blur' }],
  vehicleLicense: [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
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
      formData.value = await TransportManageApi.getTransportManage(id)
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
    const data = formData.value as unknown as TransportManageVO
    if (formType.value === 'create') {
      await TransportManageApi.createTransportManage(data)
      message.success(t('common.createSuccess'))
    } else {
      await TransportManageApi.updateTransportManage(data)
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
    transportNo: undefined,
    startProvince: undefined,
    startCity: undefined,
    startArea: undefined,
    endProvince: undefined,
    endCity: undefined,
    endArea: undefined,
    productId: undefined,
    productName: undefined,
    categoryId: undefined,
    transportTime: undefined,
    transportCount: undefined,
    productUnitId: undefined,
    vehicleLicense: undefined,
  }
  formRef.value?.resetFields()
}
</script>