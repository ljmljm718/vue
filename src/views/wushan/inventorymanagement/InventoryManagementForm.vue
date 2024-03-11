<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="农资名称" prop="agriculturalMaterialName">
        <!-- <el-input v-model="formData.agriculturalMaterialName" placeholder="请输入农资名称" /> -->
        <el-input v-model="formData.agriculturalMaterialName" placeholder="请选择农资名称" :disabled="true">
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="规格" prop="wushanSpecification">
        <el-input v-model="formData.wushanSpecification" placeholder="请输入规格" />
      </el-form-item>
      <el-form-item label="库存数量" prop="stockQuantity">
        <el-input v-model="formData.stockQuantity" placeholder="请输入库存数量" />
      </el-form-item>
      <el-form-item label="生产日期" prop="productionDate">
        <el-date-picker
          v-model="formData.productionDate"
          type="datetime"
          value-format="x"
          placeholder="选择生产日期"
        />
      </el-form-item>
      <el-form-item label="有效日期" prop="expiryDate">
        <el-date-picker
          v-model="formData.expiryDate"
          type="datetime"
          value-format="x"
          placeholder="选择有效日期"
        />
      </el-form-item>
      <el-form-item label="出库详情" prop="outboundDetails">
        <el-input v-model="formData.outboundDetails" placeholder="请输入出库详情" />
      </el-form-item>
      <el-form-item label="备注" prop="wushanRemarks">
        <el-input v-model="formData.wushanRemarks" placeholder="请输入备注" />
      </el-form-item>
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input v-model="formData.reserveOne" placeholder="请输入备用一" />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input v-model="formData.reserveTwo" placeholder="请输入备用二" />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input v-model="formData.reserveThree" placeholder="请输入备用三" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <AgriculturalBaseList   ref="purchaseOrderInEnableListRef"
                          @success="handlePurchaseOrderChange"/>
</template>
<script setup lang="ts">
import { InventoryManagementApi, InventoryManagementVO } from '@/api/wushan/inventorymanagement'
import AgriculturalBaseList from '@/views/erp/product/product/SelectProductList.vue'

/** 农资库存管理 表单 */
defineOptions({ name: 'InventoryManagementForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  agriculturalMaterialName: undefined,
  wushanSpecification: undefined,
  stockQuantity: undefined,
  productionDate: undefined,
  expiryDate: undefined,
  outboundDetails: undefined,
  wushanRemarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 新加方法 */
const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}

const handlePurchaseOrderChange = (order: InventoryManagementVO) => {
  // 将订单设置到入库单
  console.log("--->>查看查到的农资信息",order)
  formData.value.agriculturalMaterialName = String(order[0].name);
  formData.value.wushanSpecification = String(order[0].standard);

  // formData.value.agriculturalName = String(order[0].name)
  // formData.value.agriculturalSize = String(order[0].size)
}
// 截至


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
      formData.value = await InventoryManagementApi.getInventoryManagement(id)
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
    const data = formData.value as unknown as InventoryManagementVO
    if (formType.value === 'create') {
      await InventoryManagementApi.createInventoryManagement(data)
      message.success(t('common.createSuccess'))
    } else {
      await InventoryManagementApi.updateInventoryManagement(data)
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
    agriculturalMaterialName: undefined,
    wushanSpecification: undefined,
    stockQuantity: undefined,
    productionDate: undefined,
    expiryDate: undefined,
    outboundDetails: undefined,
    wushanRemarks: undefined,
    reserveOne: undefined,
    reserveTwo: undefined,
    reserveThree: undefined,
  }
  formRef.value?.resetFields()
}
</script>