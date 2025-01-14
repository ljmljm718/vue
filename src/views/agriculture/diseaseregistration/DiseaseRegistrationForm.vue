<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="病害名称" prop="diseaseName">
        <el-input v-model="formData.diseaseName" placeholder="请输入病害名称" />
      </el-form-item>
      <el-form-item label="病害类型" prop="diseaseType">
        <el-input v-model="formData.diseaseType" placeholder="请输入发病对象" />
      </el-form-item>
      <el-form-item label="发病对象" prop="affectedObject">
        <el-input v-model="formData.affectedObject" placeholder="请输入发病对象" />
      </el-form-item>
      <el-form-item label="发病部位" prop="affectedPart">
        <el-input v-model="formData.affectedPart" placeholder="请输入发病部位" />
      </el-form-item>
      <el-form-item label="主要症状描述" prop="mainSymptoms">
        <el-input v-model="formData.mainSymptoms" placeholder="请输入主要症状描述" />
      </el-form-item>
      <el-form-item label="发病条件" prop="onsetConditions">
        <el-input v-model="formData.onsetConditions" placeholder="请输入发病条件" />
      </el-form-item>
      <el-form-item label="常见防治方法" prop="commonPreventionMethods">
        <el-input v-model="formData.commonPreventionMethods" placeholder="请输入常见防治方法" />
      </el-form-item>
      <el-form-item label="防治注意事项" prop="preventionNotes">
        <el-input v-model="formData.preventionNotes" placeholder="请输入防治注意事项" />
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
  DiseaseRegistrationApi,
  DiseaseRegistrationVO
} from '@/api/agriculture/diseaseregistration';

/** 病害登记 表单 */
defineOptions({ name: 'DiseaseRegistrationForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  diseaseName: undefined,
  diseaseType: undefined,
  affectedObject: undefined,
  affectedPart: undefined,
  mainSymptoms: undefined,
  onsetConditions: undefined,
  commonPreventionMethods: undefined,
  preventionNotes: undefined
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
      formData.value = await DiseaseRegistrationApi.getDiseaseRegistration(id);
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
    const data = formData.value as unknown as DiseaseRegistrationVO;
    if (formType.value === 'create') {
      await DiseaseRegistrationApi.createDiseaseRegistration(data);
      message.success(t('common.createSuccess'));
    } else {
      await DiseaseRegistrationApi.updateDiseaseRegistration(data);
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
    diseaseName: undefined,
    diseaseType: undefined,
    affectedObject: undefined,
    affectedPart: undefined,
    mainSymptoms: undefined,
    onsetConditions: undefined,
    commonPreventionMethods: undefined,
    preventionNotes: undefined
  };
  formRef.value?.resetFields();
};
</script>
