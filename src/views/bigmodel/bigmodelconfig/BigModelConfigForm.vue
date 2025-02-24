<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="disabled"
    >
      <el-form-item label="所属大模型" prop="bigModel">
        <el-select v-model="formData.bigModel" placeholder="请选择所属大模型" clearable>
          <el-option
            v-for="(dict, index) in getStrDictOptions(DICT_TYPE.BIGMODEL_CONFIG_BELONG)"
            :key="index"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模型类型" prop="modelType">
        <el-input v-model="formData.modelType" placeholder="请输入模型类型" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="嵌入模型" prop="embeddingModel">
        <el-input v-model="formData.embeddingModel" placeholder="请输入嵌入模型" />
      </el-form-item>
      <el-form-item label="鉴权" prop="authorization">
        <el-input v-model="formData.authorization" placeholder="请输入鉴权" />
      </el-form-item>
      <el-form-item label="索引类型" prop="indexType">
        <el-input v-model="formData.indexType" placeholder="请输入索引类型" />
      </el-form-item>
      <el-form-item label="向量维度" prop="embeddingDimension">
        <el-input v-model="formData.embeddingDimension" placeholder="请输入向量维度" />
      </el-form-item>
      <el-form-item label="量化方式" prop="quant">
        <el-input v-model="formData.quant" placeholder="请输入量化方式" />
      </el-form-item>
      <el-form-item label="片段长度" prop="chunkLength">
        <el-input v-model="formData.chunkLength" placeholder="请输入片段长度" />
      </el-form-item>
      <el-form-item label="检索类型" prop="searchType">
        <el-input v-model="formData.searchType" placeholder="请输入检索类型" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="!disabled">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BigModelConfigApi, BigModelConfigVO } from '@/api/bigmodel/bigmodelconfig';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';

/** 模型配置 表单 */
defineOptions({ name: 'BigModelConfigForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  modelType: undefined,
  name: undefined,
  embeddingModel: undefined,
  authorization: undefined,
  indexType: undefined,
  embeddingDimension: undefined,
  quant: undefined,
  chunkLength: undefined,
  searchType: undefined,
  bigModel: undefined
});
const formRules = reactive({
  bigModel: [{ required: true, message: '所属大模型不能为空', trigger: 'change' }],
  modelType: [{ required: true, message: '模型类型不能为空', trigger: 'blur' }],
  authorization: [{ required: true, message: '鉴权不能为空', trigger: 'blur' }]
});
const disabled = computed(() => formType.value === 'detail');
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
      formData.value = await BigModelConfigApi.getBigModelConfig(id);
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
    const data = formData.value as unknown as BigModelConfigVO;
    if (formType.value === 'create') {
      await BigModelConfigApi.createBigModelConfig(data);
      message.success(t('common.createSuccess'));
    } else {
      await BigModelConfigApi.updateBigModelConfig(data);
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
    modelType: undefined,
    name: undefined,
    embeddingModel: undefined,
    authorization: undefined,
    indexType: undefined,
    embeddingDimension: undefined,
    quant: undefined,
    chunkLength: undefined,
    searchType: undefined,
    bigModel: undefined
  };
  formRef.value?.resetFields();
};
</script>
