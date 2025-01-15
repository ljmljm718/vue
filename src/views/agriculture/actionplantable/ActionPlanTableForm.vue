<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="动作编号" prop="actionId">
        <el-input v-model="formData.actionId" placeholder="请输入动作编号" />
      </el-form-item>
      <el-form-item label="动作内容" prop="actionContent">
        <el-input v-model="formData.actionContent" placeholder="请输入动作内容" />
      </el-form-item>
      <el-form-item label="动作名称" prop="actionName">
        <el-input v-model="formData.actionName" placeholder="请输入动作名称" />
      </el-form-item>
      <el-form-item label="动作类型" prop="actionType">
        <el-select v-model="formData.actionType" placeholder="请选择动作类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.ACTION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="formData.url" placeholder="请输入URL" />
      </el-form-item>
      <el-form-item label="请求参数" prop="requestParams">
        <el-input v-model="formData.requestParams" placeholder="请输入请求参数" />
      </el-form-item>
      <el-form-item label="排序" prop="sortOrder">
        <el-input v-model="formData.sortOrder" placeholder="请输入排序" />
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
import { ActionPlanTableApi, ActionPlanTableVO } from '@/api/agriculture/actionplantable';

/** 方案动作 表单 */
defineOptions({ name: 'ActionPlanTableForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  actionId: undefined,
  actionContent: undefined,
  actionName: undefined,
  actionType: undefined,
  url: undefined,
  requestParams: undefined,
  sortOrder: undefined
});
const formRules = reactive({
  actionId: [{ required: true, message: '动作ID不能为空', trigger: 'blur' }],
  actionName: [{ required: true, message: '动作名称不能为空', trigger: 'blur' }],
  actionType: [{ required: true, message: '动作类型不能为空', trigger: 'change' }],
  url: [
    {
      required:
        formData.value.actionType == 'open_page' || formData.value.actionType == 'send_request',
      message: 'url不能为空',
      trigger: 'change'
    }
  ]
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
      formData.value = await ActionPlanTableApi.getActionPlanTable(id);
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
    const data = formData.value as unknown as ActionPlanTableVO;
    if (formType.value === 'create') {
      await ActionPlanTableApi.createActionPlanTable(data);
      message.success(t('common.createSuccess'));
    } else {
      await ActionPlanTableApi.updateActionPlanTable(data);
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
    actionId: undefined,
    actionContent: undefined,
    actionName: undefined,
    actionType: undefined,
    url: undefined,
    requestParams: undefined,
    sortOrder: undefined
  };
  formRef.value?.resetFields();
};
</script>
