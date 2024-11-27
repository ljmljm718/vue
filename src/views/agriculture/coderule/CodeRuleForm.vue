<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="源码名称" prop="codeName">
        <el-input v-model="formData.codeName" placeholder="请输入源码名称" />
      </el-form-item>
      <el-form-item label="品类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择品类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="码前缀" prop="codeBefore">
        <el-input v-model="formData.codeBefore" placeholder="请输入码前缀" />
      </el-form-item>
      <el-form-item label="日期格式" prop="codeDate">
        <el-select v-model="formData.codeDate" placeholder="请选择日期格式">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CODE_DATE_FORMAT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="序列号" prop="codeSerial">
        <el-select v-model="formData.codeSerial" placeholder="请选择序列号">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CODE_SERIAL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
import { CodeRuleApi, CodeRuleVO } from '@/api/agriculture/coderule';
import { CategoryManagementApi, CategoryManagementVO } from '@/api/agriculture/categorymanagement';

/** 码规则 表单 */
defineOptions({ name: 'CodeRuleForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  codeName: undefined,
  categoryId: undefined,
  codeBefore: undefined,
  codeDate: undefined,
  codeSerial: undefined,
  remark: undefined
});
const formRules = reactive({
  codeName: [{ required: true, message: '源码名称不能为空', trigger: 'blur' }],
  categoryId: [{ required: true, message: '品类不能为空', trigger: 'blur' }],
  codeBefore: [
    { required: true, message: '前缀不能为空', trigger: 'blur' },
    {
      validator: async (rule, value, callback) => {
        const data = await CodeRuleApi.codeBeforeRep(value, formData.value.id);
        console.log('data', data);
        if ((typeof data === 'boolean' && data) || data.data) {
          callback(new Error('前缀不能重复'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  codeDate: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
  codeSerial: [{ required: true, message: '序列号不能为空', trigger: 'blur' }]
});
const formRef = ref(); // 表单 Ref
const categoryList = ref<CategoryManagementVO[]>([]); // 品类的数据

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  //获取品类数据
  categoryList.value = await CategoryManagementApi.getAllCategoryManagement();
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await CodeRuleApi.getCodeRule(id);
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
    const data = formData.value as unknown as CodeRuleVO;
    if (formType.value === 'create') {
      await CodeRuleApi.createCodeRule(data);
      message.success(t('common.createSuccess'));
    } else {
      await CodeRuleApi.updateCodeRule(data);
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
    codeName: undefined,
    categoryId: undefined,
    codeBefore: undefined,
    codeDate: undefined,
    codeSerial: undefined,
    remark: undefined
  };
  formRef.value?.resetFields();
};
</script>
