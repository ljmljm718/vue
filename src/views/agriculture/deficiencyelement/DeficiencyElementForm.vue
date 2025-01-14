<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="植物类型" prop="plantType">
        <el-input v-model="formData.plantType" placeholder="请输入存植物类型" />
      </el-form-item>
      <el-form-item label="缺素" prop="deficiencyElement">
        <el-input v-model="formData.deficiencyElement" placeholder="请输入缺素" />
      </el-form-item>
      <el-form-item label="缺素症状的详细描述" prop="deficiencySymptoms">
        <el-input v-model="formData.deficiencySymptoms" placeholder="请输入缺素症状的详细描述" />
      </el-form-item>
      <el-form-item label="缺素发生阶段" prop="deficiencyStage">
        <el-input v-model="formData.deficiencyStage" placeholder="请输入缺素发生阶段" />
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <UploadImg v-model="formData.image" />
      </el-form-item>
      <el-form-item label="诊断方法" prop="diagnosisMethod">
        <el-input v-model="formData.diagnosisMethod" placeholder="请输入诊断方法" />
      </el-form-item>
      <el-form-item label="补救措施" prop="treatmentMeasures">
        <el-input v-model="formData.treatmentMeasures" placeholder="请输入补救措施" />
      </el-form-item>
      <el-form-item label="补救效果" prop="treatmentEffect">
        <el-input v-model="formData.treatmentEffect" placeholder="请输入补救效果" />
      </el-form-item>
      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker
          v-model="formData.recordTime"
          type="date"
          value-format="x"
          placeholder="选择记录时间"
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
import { DeficiencyElementApi, DeficiencyElementVO } from '@/api/agriculture/deficiencyelement';

/** 农业缺素 表单 */
defineOptions({ name: 'DeficiencyElementForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  plantType: undefined,
  deficiencyElement: undefined,
  deficiencySymptoms: undefined,
  deficiencyStage: undefined,
  diagnosisMethod: undefined,
  treatmentMeasures: undefined,
  treatmentEffect: undefined,
  recordTime: undefined,
  image: undefined
});
const formRules = reactive({
  plantType: [{ required: true, message: '植物类型不能为空', trigger: 'change' }],
  deficiencyElement: [{ required: true, message: '存储缺少的元素不能为空', trigger: 'blur' }],
  // deficiencySymptoms: [{ required: true, message: '缺素症状的详细描述不能为空', trigger: 'blur' }],
  deficiencyStage: [{ required: true, message: '缺素发生阶段不能为空', trigger: 'blur' }]
  // diagnosisMethod: [{ required: true, message: '诊断方法不能为空', trigger: 'blur' }],
  // treatmentMeasures: [{ required: true, message: '补救措施不能为空', trigger: 'blur' }],
  // treatmentEffect: [{ required: true, message: '补救效果不能为空', trigger: 'blur' }],
  // recordTime: [{ required: true, message: '记录时间不能为空', trigger: 'blur' }]
});
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
      formData.value = await DeficiencyElementApi.getDeficiencyElement(id);
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
    const data = formData.value as unknown as DeficiencyElementVO;
    if (formType.value === 'create') {
      await DeficiencyElementApi.createDeficiencyElement(data);
      message.success(t('common.createSuccess'));
    } else {
      await DeficiencyElementApi.updateDeficiencyElement(data);
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
    plantType: undefined,
    deficiencyElement: undefined,
    deficiencySymptoms: undefined,
    deficiencyStage: undefined,
    diagnosisMethod: undefined,
    treatmentMeasures: undefined,
    treatmentEffect: undefined,
    recordTime: undefined
  };
  formRef.value?.resetFields();
};
</script>
