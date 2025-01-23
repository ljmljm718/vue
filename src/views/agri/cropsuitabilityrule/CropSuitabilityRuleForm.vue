<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="作物" prop="crop">
        <el-input v-model="formData.crop" placeholder="请输入作物" />
      </el-form-item>
      <el-form-item label="生长物候" prop="phenologicalStage">
        <el-input v-model="formData.phenologicalStage" placeholder="请输入生长物候" />
      </el-form-item>
      <el-form-item label="适宜活动" prop="suitableActivity">
        <el-select v-model="formData.suitableActivity" placeholder="请选择适宜活动">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_SUITABILITY_ACTIVITY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物候开始时间" prop="phenologicalStartDate">
        <el-date-picker
          v-model="formData.phenologicalStartDate"
          type="date"
          value-format="x"
          placeholder="选择物候开始时间"
        />
      </el-form-item>
      <el-form-item label="物候结束时间" prop="phenologicalEndDate">
        <el-date-picker
          v-model="formData.phenologicalEndDate"
          type="date"
          value-format="x"
          placeholder="选择物候结束时间"
        />
      </el-form-item>
      <el-form-item label="温度上限" prop="temperatureUpper">
        <el-input v-model="formData.temperatureUpper" placeholder="请输入温度上限" />
      </el-form-item>
      <el-form-item label="温度下限" prop="temperatureLower">
        <el-input v-model="formData.temperatureLower" placeholder="请输入温度下限" />
      </el-form-item>
      <el-form-item label="适宜度" prop="suitabilityLevel">
        <el-select v-model="formData.suitabilityLevel" placeholder="请选择适宜度">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_SUITABILITY_DEGREE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="适宜度说明" prop="suitabilityDescription">
        <el-input
          v-model="formData.referenceSuggestions"
          placeholder="请输入参考对策建议"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="参考对策建议" prop="referenceSuggestions">
        <el-input
          v-model="formData.referenceSuggestions"
          placeholder="请输入参考对策建议"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="农事活动适宜度说明" prop="agriculturalActivitySuitabilityDescription">
        <el-input
          v-model="formData.agriculturalActivitySuitabilityDescription"
          placeholder="请输入农事活动适宜度说明"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="未来七天湿度建议" prop="humidityRecommendationsForNext7Days">
        <el-input
          v-model="formData.humidityRecommendationsForNext7Days"
          placeholder="请输入未来七天湿度建议"
          type="textarea"
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
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { CropSuitabilityRuleApi, CropSuitabilityRuleVO } from '@/api/agri/cropsuitabilityrule';

/** 作物适宜规则 表单 */
defineOptions({ name: 'CropSuitabilityRuleForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  crop: undefined,
  phenologicalStage: undefined,
  suitableActivity: undefined,
  phenologicalStartDate: undefined,
  phenologicalEndDate: undefined,
  temperatureUpper: undefined,
  temperatureLower: undefined,
  suitabilityLevel: undefined,
  suitabilityDescription: undefined,
  referenceSuggestions: undefined,
  agriculturalActivitySuitabilityDescription: undefined,
  humidityRecommendationsForNext7Days: undefined
});
const formRules = reactive({
  crop: [{ required: true, message: '作物不能为空', trigger: 'blur' }],
  phenologicalStage: [{ required: true, message: '生长物候不能为空', trigger: 'blur' }],
  suitableActivity: [{ required: true, message: '适宜活动不能为空', trigger: 'change' }],
  phenologicalStartDate: [{ required: true, message: '物候开始时间不能为空', trigger: 'blur' }],
  phenologicalEndDate: [{ required: true, message: '物候结束时间不能为空', trigger: 'blur' }],
  temperatureUpper: [{ required: true, message: '温度上限不能为空', trigger: 'blur' }],
  temperatureLower: [{ required: true, message: '温度下限不能为空', trigger: 'blur' }],
  suitabilityLevel: [{ required: true, message: '适宜度不能为空', trigger: 'change' }]
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
      formData.value = await CropSuitabilityRuleApi.getCropSuitabilityRule(id);
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
    const data = formData.value as unknown as CropSuitabilityRuleVO;
    if (formType.value === 'create') {
      await CropSuitabilityRuleApi.createCropSuitabilityRule(data);
      message.success(t('common.createSuccess'));
    } else {
      await CropSuitabilityRuleApi.updateCropSuitabilityRule(data);
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
    crop: undefined,
    phenologicalStage: undefined,
    suitableActivity: undefined,
    phenologicalStartDate: undefined,
    phenologicalEndDate: undefined,
    temperatureUpper: undefined,
    temperatureLower: undefined,
    suitabilityLevel: undefined,
    suitabilityDescription: undefined,
    referenceSuggestions: undefined,
    agriculturalActivitySuitabilityDescription: undefined,
    humidityRecommendationsForNext7Days: undefined
  };
  formRef.value?.resetFields();
};
</script>
