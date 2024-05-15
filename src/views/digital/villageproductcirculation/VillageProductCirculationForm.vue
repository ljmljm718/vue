<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="产品id" prop="productId">
        <el-input v-model="formData.productId" placeholder="请输入产品id" disabled>
          <template #append>
            <el-button @click="openParkInfoPopup('0')">
              <Icon icon="ep:search"/>
              选择产品
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="product">
        <el-input v-model="formData.product" placeholder="请输入产品名称" disabled/>
      </el-form-item>
      <el-form-item label="客户名称" prop="customer">
        <el-input v-model="formData.customer" placeholder="请输入客户名称"/>
      </el-form-item>
      <el-form-item label="销售地" prop="salesLocation">
        <!--        <el-input v-model="formData.salesLocation" placeholder="请输入销售地"/>-->
        <el-cascader :options="areaSelectData" style="width: 100%"
                     @change="handleChange" class="full-width" size="large"
                     v-model="formData.salesLocation" placeholder="请选择销售地"/>

      </el-form-item>
      <el-form-item label="产品规格(Kg)" prop="productSpecifications">
        <el-input v-model="formData.productSpecifications" placeholder="请输入产品规格" disabled/>
      </el-form-item>
      <el-form-item label="单价(元)" prop="unitPrice">
        <!--        <el-input v-model="formData.unitPrice" placeholder="请输入单价"/>-->
        <el-input v-model="formData.unitPrice" placeholder="请输入单价" @input="() => {
          if (!formData.quantity || !formData.unitPrice) return
          formData.totalPrice = (formData.quantity * formData.unitPrice).toFixed(2)
        }"/>
      </el-form-item>
      <el-form-item label="数量(袋)" prop="quantity">
        <!--        <el-input v-model="formData.quantity" placeholder="请输入数量"/>-->
        <el-input v-model="formData.quantity" placeholder="请输入数量" :disabled="isDisabled" @input="() => {
          if (!formData.quantity || !formData.unitPrice) return
          formData.totalPrice = (formData.quantity * formData.unitPrice).toFixed(2)
        }"/>
      </el-form-item>
      <el-form-item label="总价(元)" prop="totalPrice">
        <el-input v-model="formData.totalPrice" placeholder="请输入总价"/>
      </el-form-item>
      <!--      <el-form-item label="时间" prop="times">-->
      <!--        <el-input v-model="formData.times" placeholder="请输入时间"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <VillageProductForm ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>
</template>
<script setup lang="ts">
import {
  VillageProductCirculationApi,
  VillageProductCirculationVO
} from '@/api/digital/villageproductcirculation'
import VillageProductForm
  from "@/views/digital/villageproduct/VillageProductList/VillageProductList.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {VillageProductVO} from "@/api/digital/villageproduct";
import {codeToText, regionData} from 'element-china-area-data';// 地址级联选择器
/** 产品流通 表单 */
defineOptions({name: 'VillageProductCirculationForm'})
const isDisabled = ref<boolean>(false)

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const areaSelectData = regionData // options绑定的数据就是引入的 regionData
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  product: undefined,
  customer: undefined,
  unitPrice: undefined,
  quantity: undefined,
  totalPrice: undefined,
  times: undefined,
  remark: undefined,
  productId: undefined,
  salesLocation: undefined,
  productSpecifications: undefined,
  provinceCode: undefined,
  provinceName: undefined,
  cityCode: undefined,
  cityName: undefined,
  countiesCode: undefined,
  countiesName: undefined,
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  isDisabled.value = false
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    isDisabled.value = true
    formLoading.value = true
    try {
      formData.value = await VillageProductCirculationApi.getVillageProductCirculation(id)
      formData.value.salesLocation = [formData.value.provinceCode, formData.value.cityCode, formData.value.countiesCode]
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗
//选择
const parkInfoPopupRef = ref()
const openType = ref('')
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择产品")
  } else parkInfoPopupRef.value.open(id)
}
const handleParkInfoPopupChange = (order: VillageProductVO) => {
  if (openType.value === '0') {
    formData.value.productId = String(order[0].id)
    formData.value.product = String(order[0].product)
    formData.value.productSpecifications = String(order[0].specifications)
  } else formData.value.productId = String(order[0].id)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  const strAddress = formData.value.salesLocation.toString()
  formData.value.salesLocation = strAddress
  try {
    const data = formData.value as unknown as VillageProductCirculationVO

    if (formType.value === 'create') {
      await VillageProductCirculationApi.createVillageProductCirculation(data)
      message.success(t('common.createSuccess'))
    } else {
      await VillageProductCirculationApi.updateVillageProductCirculation(data)
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
    product: undefined,
    customer: undefined,
    unitPrice: undefined,
    quantity: undefined,
    totalPrice: undefined,
    times: undefined,
    remark: undefined,
    productId: undefined,
    salesLocation: undefined,
    productSpecifications: undefined,
    provinceCode: undefined,
    provinceName: undefined,
    cityCode: undefined,
    cityName: undefined,
    countiesCode: undefined,
    countiesName: undefined,
  }
  formRef.value?.resetFields()
}
// 编辑格式化地址
const handleChange = (e) => {
  const self = e;
  // CodeToText属性是区域码，属性值是汉字 CodeToText['110000']输出北京市
  // formData.value.salesLocation = codeToText[self[0]] + '-' + codeToText[self[1]] + '-' + codeToText[self[2]];
  formData.value.cityCode = self[1];
  formData.value.cityName = codeToText[self[1]];
  formData.value.countiesCode = self[2];
  formData.value.countiesName = codeToText[self[2]];
  formData.value.provinceCode = self[0];
  formData.value.provinceName = codeToText[self[0]];
}
</script>
