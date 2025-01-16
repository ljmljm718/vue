<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="地块id" prop="plotId">
        <el-input v-model="formData.plotId" placeholder="请输入地块id" />
      </el-form-item>
      <el-form-item label="病虫害" prop="disease">
        <el-input v-model="formData.disease" placeholder="请输入病虫害" />
      </el-form-item>
      <el-form-item label="问题" prop="problem">
        <el-input v-model="formData.problem" placeholder="请输入问题" />
      </el-form-item>
      <el-form-item label="病虫害类型" prop="diseaseType">
        <el-select v-model="formData.diseaseType" placeholder="请选择病虫害类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DISEASE_CATEGORY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="治疗措施" prop="treatment">
        <el-input v-model="formData.treatment" placeholder="请输入治疗措施" />
      </el-form-item>
      <el-form-item label="治疗时间" prop="treatmentTime">
        <el-date-picker
          v-model="formData.treatmentTime"
          type="date"
          value-format="x"
          placeholder="选择治疗时间"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DISEASE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="效果" prop="effect">
        <el-select v-model="formData.effect" placeholder="请选择效果">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DISEASE_EFFECT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="失效日" prop="failureDate">
        <el-date-picker
          v-model="formData.failureDate"
          type="date"
          value-format="x"
          placeholder="选择失效日"
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
import { PathologyFollowupApi, PathologyFollowupVO } from '@/api/agriculture/pathologyfollowup';

/** 病理跟进 表单 */
defineOptions({ name: 'PathologyFollowupForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  plotId: undefined,
  disease: undefined,
  problem: undefined,
  diseaseType: undefined,
  treatment: undefined,
  treatmentTime: undefined,
  status: undefined,
  effect: undefined,
  failureDate: undefined,
  belongPark: undefined,
  belongPlot: undefined
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
      formData.value = await PathologyFollowupApi.getPathologyFollowup(id);
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
    const data = formData.value as unknown as PathologyFollowupVO;
    if (formType.value === 'create') {
      await PathologyFollowupApi.createPathologyFollowup(data);
      message.success(t('common.createSuccess'));
    } else {
      await PathologyFollowupApi.updatePathologyFollowup(data);
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
    plotId: undefined,
    disease: undefined,
    problem: undefined,
    diseaseType: undefined,
    treatment: undefined,
    treatmentTime: undefined,
    status: undefined,
    effect: undefined,
    failureDate: undefined,
    belongPark: undefined,
    belongPlot: undefined
  };
  formRef.value?.resetFields();
};
</script>
