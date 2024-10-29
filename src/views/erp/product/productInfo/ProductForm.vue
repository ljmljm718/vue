<!-- ERP 产品的新增/修改 -->
<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="条码" prop="barCode">
            <el-input v-model="formData.barCode" placeholder="请输入条码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="categoryId">
            <el-tree-select
              v-model="formData.categoryId"
              :data="categoryList"
              :props="defaultProps"
              check-strictly
              default-expand-all
              placeholder="请选择分类"
              class="w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unitId">
            <el-select v-model="formData.unitId" clearable placeholder="请选择单位" class="w-1/1">
              <el-option
                v-for="unit in unitList"
                :key="unit.id"
                :label="unit.name"
                :value="unit.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格" prop="standard">
            <el-input v-model="formData.standard" placeholder="请输入规格" />
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="重量（kg）" prop="weight">-->
<!--            <el-input-number-->
<!--              v-model="formData.weight"-->
<!--              placeholder="请输入重量（kg）"-->
<!--              :min="0"-->
<!--              class="!w-1/1"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="采购价格" prop="purchasePrice">
            <el-input-number
              v-model="formData.purchasePrice"
              placeholder="请输入采购价格，单位：元"
              :min="0"
              :precision="2"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售价格" prop="salePrice">
            <el-input-number
              v-model="formData.salePrice"
              placeholder="请输入销售价格，单位：元"
              :min="0"
              :precision="2"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最低价格" prop="minPrice">
            <el-input-number
              v-model="formData.minPrice"
              placeholder="请输入最低价格，单位：元"
              :min="0"
              :precision="2"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产日期" prop="produceDate">
            <el-date-picker
              v-model="formData.produceDate"
              type="date"
              value-format="x"
              placeholder="选择生产日期"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保质期天数" prop="expiryDay">
            <el-input-number
              v-model="formData.expiryDay"
              placeholder="请输入保质期天数"
              :min="0"
              :precision="0"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效日期" prop="produceDate">
            <el-date-picker
              v-model="formData.effectiveTime"
              type="date"
              value-format="x"
              placeholder="选择有效日期"
              class="!w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记证号" prop="registerNum">
            <el-input  v-model="formData.registerNum" placeholder="请输入登记证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装关系" prop="packagingRelationship">
            <el-input  v-model="formData.packagingRelationship" placeholder="请输入包装关系" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片" prop="img">
            <UploadImg v-model="formData.img" />
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
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import { ProductCategoryApi, ProductCategoryVO } from '@/api/erp/product/category'
import { ProductUnitApi, ProductUnitVO } from '@/api/erp/product/unit'
import { CommonStatusEnum } from '@/utils/constants'
import { defaultProps, handleTree } from '@/utils/tree'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

/** ERP 产品 表单 */
defineOptions({ name: 'ProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  barCode: undefined,
  categoryId: undefined,
  unitId: undefined,
  status: undefined,
  standard: undefined,
  remark: undefined,
  expiryDay: undefined,
  weight: undefined,
  purchasePrice: undefined,
  salePrice: undefined,
  minPrice: undefined,
  img: undefined,
  produceDate: undefined,
  registerNum: undefined,
  packagingRelationship: undefined,
  effectiveTime: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  barCode: [{ required: true, message: '产品条码不能为空', trigger: 'blur' }],
  categoryId: [{ required: true, message: '产品分类编号不能为空', trigger: 'blur' }],
  unitId: [{ required: true, message: '单位编号不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '产品状态不能为空', trigger: 'blur' }],
  effectiveTime: [{ required: true, message: '有效日期不能为空', trigger: 'blur' }],
  produceDate: [{ required: true, message: '生产日期不能为空', trigger: 'blur' }],
  purchasePrice: [{ required: true, message: '采购价格不能为空', trigger: 'blur' }],
  salePrice: [{ required: true, message: '销售价格不能为空', trigger: 'blur' }],
  minPrice: [{ required: true, message: '最低价格不能为空', trigger: 'blur' }],
  standard: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
  expiryDay: [{ required: true, message: '保质期天数不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表
const unitList = ref<ProductUnitVO[]>([]) // 产品单位列表

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
      formData.value = await ProductApi.getProduct(id)
    } finally {
      formLoading.value = false
    }
  }
  // 产品分类
  let categoryData = await ProductCategoryApi.getProductCategorySimpleList()

  categoryList.value = handleTree(initCategoryData(categoryData), 'id', 'parentId')
  // 产品单位
  unitList.value = await ProductUnitApi.getProductUnitSimpleList()
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
    const data = formData.value as unknown as ProductVO
    if (formType.value === 'create') {
      await ProductApi.createProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductApi.updateProduct(data)
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
    name: undefined,
    barCode: undefined,
    categoryId: undefined,
    unitId: undefined,
    status: CommonStatusEnum.ENABLE,
    standard: undefined,
    remark: undefined,
    expiryDay: undefined,
    weight: undefined,
    purchasePrice: undefined,
    salePrice: undefined,
    minPrice: undefined,
    img: undefined,
    produceDate: undefined,
  }
  formRef.value?.resetFields()
}

const initCategoryData = (categoryData) => {
  let agriCategoryData = []
  let ids = categoryData.map(item => item.id)
  // 获取农资分类
  categoryData.forEach(item => {
    if (item.name.includes("农资")) {
      ids.push(item.id)
      agriCategoryData = [
        ...agriCategoryData,
        ...categoryData.filter(i => {
          ids.push(i.id)
          return item.id === i.parentId
        }),
        item
      ]
      categoryData = categoryData.filter(i2 => !ids.includes(i2.id))
    }
  })
  // 如果产品分类为空，则设置查询参数为全部
  if (agriCategoryData.size === 0) {
    agriCategoryData = categoryData
  }
  return agriCategoryData
}
</script>
