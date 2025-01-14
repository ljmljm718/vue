<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="登记证号" prop="registrationNumber">
        <el-input v-model="formData.registrationNumber" placeholder="请输入登记证号" />
      </el-form-item>
      <el-form-item label="登记证持有人" prop="holder">
        <el-input v-model="formData.holder" placeholder="请输入登记证持有人" />
      </el-form-item>
      <el-form-item label="农药名称" prop="pesticideName">
        <el-input v-model="formData.pesticideName" placeholder="请输入农药名称" />
      </el-form-item>
      <el-form-item label="剂型" prop="formulation">
        <el-input v-model="formData.formulation" placeholder="请输入剂型" />
      </el-form-item>
      <el-form-item label="毒性" prop="toxicity">
        <el-input v-model="formData.toxicity" placeholder="请输入毒性" />
      </el-form-item>
      <el-form-item label="有效成分及其含量" prop="activeIngredients">
        <el-input v-model="formData.activeIngredients" placeholder="请输入有效成分及其含量" />
      </el-form-item>
      <el-form-item label="农药类别" prop="pesticideCategory">
        <el-input v-model="formData.pesticideCategory" placeholder="请输入农药类别" />
      </el-form-item>
      <el-form-item label="作物/场所" prop="cropOrPlace">
        <el-input v-model="formData.cropOrPlace" placeholder="请输入作物/场所" />
      </el-form-item>
      <el-form-item label="防治对象" prop="controlObject">
        <el-input v-model="formData.controlObject" placeholder="请输入作物/场所" />
      </el-form-item>
      <el-form-item label="产品质量标准号" prop="qualityStandardNumber">
        <el-input v-model="formData.qualityStandardNumber" placeholder="请输入产品质量标准号" />
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
  PesticideRegistrationApi,
  PesticideRegistrationVO
} from '@/api/agriculture/pesticideregistration';

/** 农药登记 表单 */
defineOptions({ name: 'PesticideRegistrationForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  registrationNumber: undefined,
  holder: undefined,
  pesticideName: undefined,
  formulation: undefined,
  toxicity: undefined,
  activeIngredients: undefined,
  pesticideCategory: undefined,
  cropOrPlace: undefined,
  controlObject: undefined,
  qualityStandardNumber: undefined,
  usageRate: undefined,
  applicationMethod: undefined,
  technicalRequirements: undefined,
  productPerformance: undefined,
  precautions: undefined,
  poisoningFirstAid: undefined,
  storageAndTransport: undefined,
  qualityAssurancePeriod: undefined,
  remarks: undefined,
  approvalDate: undefined,
  reapprovalDate: undefined
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
      formData.value = await PesticideRegistrationApi.getPesticideRegistration(id);
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
    const data = formData.value as unknown as PesticideRegistrationVO;
    if (formType.value === 'create') {
      await PesticideRegistrationApi.createPesticideRegistration(data);
      message.success(t('common.createSuccess'));
    } else {
      await PesticideRegistrationApi.updatePesticideRegistration(data);
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
    registrationNumber: undefined,
    holder: undefined,
    pesticideName: undefined,
    formulation: undefined,
    toxicity: undefined,
    activeIngredients: undefined,
    pesticideCategory: undefined,
    cropOrPlace: undefined,
    controlObject: undefined,
    qualityStandardNumber: undefined,
    usageRate: undefined,
    applicationMethod: undefined,
    technicalRequirements: undefined,
    productPerformance: undefined,
    precautions: undefined,
    poisoningFirstAid: undefined,
    storageAndTransport: undefined,
    qualityAssurancePeriod: undefined,
    remarks: undefined,
    approvalDate: undefined,
    reapprovalDate: undefined
  };
  formRef.value?.resetFields();
};
</script>
