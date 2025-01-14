<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="formData.companyName" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item label="产品通用名称" prop="genericName">
        <el-input v-model="formData.genericName" placeholder="请输入产品通用名称" />
      </el-form-item>
      <el-form-item label="产品商品名称" prop="brandName">
        <el-input v-model="formData.brandName" placeholder="请输入产品商品名称" />
      </el-form-item>
      <el-form-item label="产品形态" prop="productForm">
        <el-input v-model="formData.productForm" placeholder="请输入产品形态" />
      </el-form-item>
      <el-form-item label="登记技术指标" prop="technicalSpecifications">
        <el-input v-model="formData.technicalSpecifications" placeholder="请输入登记技术指标" />
      </el-form-item>
      <el-form-item label="适宜范围" prop="scopeOfMatter">
        <el-input v-model="formData.scopeOfMatter" placeholder="请输入事宜范围" />
      </el-form-item>
      <el-form-item label="登记证号" prop="registrationNumber">
        <el-input v-model="formData.registrationNumber" placeholder="请输入登记证号" />
      </el-form-item>
      <el-form-item label="登记有效期" prop="registrationValidity">
        <el-date-picker
          v-model="formData.registrationValidity"
          type="date"
          value-format="x"
          placeholder="选择登记有效期"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  FertilizerRegistrationApi,
  FertilizerRegistrationVO
} from '@/api/agriculture/fertilizerregistration';

/** 肥料登记 表单 */
defineOptions({ name: 'FertilizerRegistrationForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  companyName: undefined,
  genericName: undefined,
  brandName: undefined,
  productForm: undefined,
  technicalSpecifications: undefined,
  scopeOfMatter: undefined,
  registrationNumber: undefined,
  registrationValidity: undefined
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await FertilizerRegistrationApi.getFertilizerRegistration(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as FertilizerRegistrationVO;
    if (formType.value === 'create') {
      await FertilizerRegistrationApi.createFertilizerRegistration(data);
      message.success(t('common.createSuccess'));
    } else {
      await FertilizerRegistrationApi.updateFertilizerRegistration(data);
      message.success(t('common.updateSuccess'));
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    companyName: undefined,
    genericName: undefined,
    brandName: undefined,
    productForm: undefined,
    technicalSpecifications: undefined,
    scopeOfMatter: undefined,
    registrationNumber: undefined,
    registrationValidity: undefined
  };
  formRef.value?.resetFields();
};
</script>
