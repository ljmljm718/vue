<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="品牌名" prop="productBrand">
        <el-input v-model="formData.productBrand" placeholder="请输入品牌名" />
      </el-form-item>
      <el-form-item label="品种" prop="belongVarietyId">
        <el-select
          v-model="formData.belongVarietyId"
          placeholder="请选择品种"
          clearable
          @change="handleVarietyChange"
        >
          <el-option
            v-for="dict in listVarietyManagement"
            :key="dict.id"
            :label="dict.varietyName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品类" prop="belongCategoryId">
        <el-select
          v-model="formData.belongCategoryId"
          placeholder="选择品种后自动填入"
          clearable
          disabled
        >
          <el-option
            v-for="dict in listVarietyManagement"
            :key="dict.categoryId"
            :label="dict.categoryName"
            :value="dict.categoryId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌logo" prop="brandLogo">
        <UploadImg v-model="formData.brandLogo" />
      </el-form-item>
      <el-form-item label="品牌介绍" prop="brandDetail">
        <el-input v-model="formData.brandDetail" placeholder="请输入品牌介绍" />
      </el-form-item>
      <el-form-item label="启用状态" prop="usedStatus">
        <el-radio-group v-model="formData.usedStatus">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
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
import { ProductBrandApi, ProductBrandVO } from '@/api/agriculture/productbrand'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";

/** 产品品牌 表单 */
defineOptions({ name: 'ProductBrandForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  productBrand: undefined,
  belongCategoryId: undefined,
  belongCategory: undefined,
  belongVarietyId: undefined,
  belongVariety: undefined,
  brandLogo: undefined,
  brandDetail: undefined,
  usedStatus: 0,
  remark: undefined,
})
const formRules = reactive({
  productBrand: [{ required: true, message: '品牌名不能为空', trigger: 'blur' }],
  usedStatus: [{ required: true, message: '启用状态不能为空', trigger: 'blur' }],
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
      formData.value = await ProductBrandApi.getProductBrand(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  listVarietyManagement.value = await allDataCacheManager.getData({})
}
getTypeData()
const handleVarietyChange = (e) => {
  const _item = listVarietyManagement.value.find(item => (item.id === e))
  if (_item) formData.value.belongCategoryId = _item.categoryId
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProductBrandVO
    if (formType.value === 'create') {
      await ProductBrandApi.createProductBrand(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductBrandApi.updateProductBrand(data)
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
    productBrand: undefined,
    belongCategoryId: undefined,
    belongCategory: undefined,
    belongVarietyId: undefined,
    belongVariety: undefined,
    brandLogo: undefined,
    brandDetail: undefined,
    usedStatus: 0,
    remark: undefined,
  }
  formRef.value?.resetFields()
}

</script>
