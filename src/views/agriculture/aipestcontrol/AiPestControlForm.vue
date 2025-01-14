<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="虫害名称" prop="pestName">
        <el-input v-model="formData.pestName" placeholder="请输入虫害名称" />
      </el-form-item>
      <el-form-item label="虫害类别" prop="pestType">
        <el-input v-model="formData.pestType" placeholder="请输入虫害类别" />
      </el-form-item>
      <el-form-item label="宿主作物" prop="hostName">
        <el-input v-model="formData.hostName" placeholder="请输入宿主作物" />
      </el-form-item>
      <el-form-item label="生命周期" prop="lifeCycle">
        <el-input v-model="formData.lifeCycle" placeholder="请输入生命周期" />
      </el-form-item>
      <el-form-item label="危害症状" prop="damage">
        <el-input v-model="formData.damage" placeholder="请输入危害症状" />
      </el-form-item>
      <el-form-item label="监测方法" prop="monitorType">
        <el-input v-model="formData.monitorType" placeholder="请输入监测方法" />
      </el-form-item>
      <el-form-item label="预防措施" prop="prevention">
        <el-input v-model="formData.prevention" placeholder="请输入预防措施" />
      </el-form-item>
      <el-form-item label="控制方法" prop="controlMethod">
        <el-input v-model="formData.controlMethod" placeholder="请输入控制方法" />
      </el-form-item>
      <el-form-item label="虫害图片" prop="imageUrl">
        <UploadImg v-model="formData.imageUrl" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AiPestControlApi, AiPestControlVO } from '@/api/agriculture/aipestcontrol';

/** 虫害防治 表单 */
defineOptions({ name: 'AiPestControlForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  pestName: undefined,
  pestType: undefined,
  hostName: undefined,
  lifeCycle: undefined,
  damage: undefined,
  monitorType: undefined,
  prevention: undefined,
  controlMethod: undefined,
  imageUrl: undefined,
  remark: undefined
});
const formRules = reactive({
  pestName: [{ required: true, message: '虫害名称不能为空', trigger: 'blur' }],
  hostName: [{ required: true, message: '宿主作物不能为空', trigger: 'blur' }],
  monitorType: [{ required: true, message: '监测方法不能为空', trigger: 'change' }]
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
      formData.value = await AiPestControlApi.getAiPestControl(id);
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
    const data = formData.value as unknown as AiPestControlVO;
    if (formType.value === 'create') {
      await AiPestControlApi.createAiPestControl(data);
      message.success(t('common.createSuccess'));
    } else {
      await AiPestControlApi.updateAiPestControl(data);
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
    pestName: undefined,
    pestType: undefined,
    hostName: undefined,
    lifeCycle: undefined,
    damage: undefined,
    monitorType: undefined,
    prevention: undefined,
    controlMethod: undefined,
    imageUrl: undefined,
    remark: undefined
  };
  formRef.value?.resetFields();
};
</script>
