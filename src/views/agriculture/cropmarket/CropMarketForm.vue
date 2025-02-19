<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="农作物名称" prop="cropName">
        <el-input v-model="formData.cropName" placeholder="请输入农作物名称" />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="formData.date"
          type="date"
          value-format="x"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="产地" prop="origin">
        <el-input v-model="formData.origin" placeholder="请输入产地" />
      </el-form-item>
      <el-form-item label="当前价格（元/斤）" prop="price">
        <el-input v-model="formData.price" placeholder="请输入当前价格（元/斤）" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formData.remarks" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CropMarketApi, CropMarketVO } from '@/api/agriculture/cropmarket';

/** 农作物市场行情 表单 */
defineOptions({ name: 'CropMarketForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  cropName: undefined,
  date: undefined,
  origin: undefined,
  price: undefined,
  remarks: undefined
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
      formData.value = await CropMarketApi.getCropMarket(id);
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
    const data = formData.value as unknown as CropMarketVO;
    if (formType.value === 'create') {
      await CropMarketApi.createCropMarket(data);
      message.success(t('common.createSuccess'));
    } else {
      await CropMarketApi.updateCropMarket(data);
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
    cropName: undefined,
    date: undefined,
    origin: undefined,
    price: undefined,
    remarks: undefined
  };
  formRef.value?.resetFields();
};
</script>
