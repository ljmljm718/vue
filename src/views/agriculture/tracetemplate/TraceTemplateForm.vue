<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px">
    <div class="flex space-x-5 items-stretch">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        v-loading="formLoading"
        class="grow"
      >
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="formData.templateName" placeholder="请输入模板名称" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="生产商" prop="mfrsId">
          <el-select
            v-model="formData.mfrsId"
            placeholder="请选择生产商"
            clearable
            style="width: 100%"
            :disabled="disabled"
          >
            <el-option
              v-for="item in producerEntryList"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产地" prop="origin">
          <el-input v-model="formData.origin" placeholder="请输入产地" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="适用品牌" prop="brandName">
          <el-input v-model="formData.brandName" disabled placeholder="请选择适用品牌">
            <template #append>
              <el-button @click="openProductBrandPopup()" :disabled="disabled">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="品牌介绍" prop="brandDetail">
          <el-input v-model="formData.brandDetail" type="textarea" placeholder="请选择适用品牌"
                    disabled/>
        </el-form-item>
        <el-form-item label="头部宣传图" prop="headerImg">
          <UploadImg v-model="formData.headerImg" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="产品展示图片" prop="productImgs">
          <UploadImgs v-model="formData.productImgs" :limit="10" :disabled="disabled" aria-readonly="true"/>
        </el-form-item>
      </el-form>
      <div class="w-20rem max-h-[35rem]">
        <MobilePage :data="formData" />
      </div>
    </div>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="!disabled">确 定</el-button>
      <el-button @click="dialogVisible = false" v-if="!disabled">取 消</el-button>
    </template>
  </Dialog>

  <SelectProductBrand
    ref="selectProductBrandRef"
    @success="handleSelectProductBrandChange"
  />
</template>
<script setup lang="ts">
import {TraceTemplateApi, TraceTemplateVO} from '@/api/agriculture/tracetemplate'
import SelectProductBrand from "@/views/agriculture/productbrand/SelectProductBrand.vue";
import {ProducerEntryApi, ProducerEntryVO} from "@/api/agriculture/producerentry";
import {ProductBrandVO} from "@/api/agriculture/productbrand";
import MobilePage from './mobile.vue'

/** 溯源模板 表单 */
defineOptions({name: 'TraceTemplateForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const disabled = ref(false) // 表单是否可编辑
const producerEntryList = ref<ProducerEntryVO[]>([]) // 生产商的数据
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  templateName: undefined,
  mfrsId: undefined,
  origin: undefined,
  brandId: undefined,
  headerImg: undefined,
  productImg: undefined,
  remark: undefined,
  remark1: undefined,
  productImgs: undefined,
  brandName: undefined,
  brandDetail: undefined
})
const formRules = reactive({
  templateName: [{required: true, message: '模板名称不能为空', trigger: 'blur'}],
  origin: [{required: true, message: '产地不能为空', trigger: 'blur'}],
  mfrsId: [{required: true, message: '生产商不能为空', trigger: 'change'}],
  brandName: [{required: true, message: '适用品牌不能为空', trigger: 'change'}],
  headerImg: [{required: true, message: '头部宣传图不能为空', trigger: 'change'}],
  productImgs: [{required: true, message: '产品展示图片不能为空', trigger: 'change'}],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  await getProducerEntryList()
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await TraceTemplateApi.getTraceTemplate(id)
      if (formData.value.productImg)
      formData.value.productImgs = formData.value.productImg.split(",")
      if (formType.value === 'detail') disabled.value = true
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
  if (formData.value.productImgs)
    formData.value.productImg = formData.value.productImgs.join(",")
  try {
    const data = formData.value as unknown as TraceTemplateVO
    if (formType.value === 'create') {
      await TraceTemplateApi.createTraceTemplate(data)
      message.success(t('common.createSuccess'))
    } else {
      await TraceTemplateApi.updateTraceTemplate(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 查询生产商列表 */
const getProducerEntryList = async () => {
  const data = await ProducerEntryApi.getProducerEntryAll({approvalStatus: 1})
  producerEntryList.value = data
}

// 产品品牌
const selectProductBrandRef = ref()
const openProductBrandPopup = () => {
  selectProductBrandRef.value.open()
}
const handleSelectProductBrandChange = (order: ProductBrandVO) => {
  formData.value.brandId = String(order[0].id)
  formData.value.brandName = String(order[0].productBrand)
  formData.value.brandDetail = String(order[0].brandDetail)
}
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    templateName: undefined,
    mfrsId: undefined,
    origin: undefined,
    brandId: undefined,
    headerImg: undefined,
    productImg: undefined,
    remark: undefined,
    remark1: undefined,
    productImgs: undefined,
    brandName: undefined,
    brandDetail: undefined
  }
  formRef.value?.resetFields()
  disabled.value = false
}
</script>
