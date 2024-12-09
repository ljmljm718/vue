<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="灌区编号" prop="iaCode">
        <el-input v-model="formData.iaCode" placeholder="请输入灌区编号，不填自动生成" />
      </el-form-item>
      <el-form-item label="灌区名称" prop="iaName">
        <el-input v-model="formData.iaName" placeholder="请输入灌区名称" />
      </el-form-item>
      <el-form-item label="喷灌类型" prop="irrigationType">
        <el-select v-model="formData.irrigationType" placeholder="请选择喷灌类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_IRRIGATION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="iaImage">
        <UploadImg v-model="formData.iaImage" />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="formData.latitude" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="formData.longitude" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="负责人" prop="principal">
        <el-input v-model="formData.principal" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contactInformation">
        <el-input v-model="formData.contactInformation" placeholder="请输入联系方式" />
      </el-form-item>
      <el-form-item label="地址" prop="isAddress">
        <el-input v-model="formData.isAddress" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <div ref="subFormDom">
      <ParkDetailFormReadOnly ref="parkDetailFormRef" :parkDetails="formData.parkDetails" />
    </div>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { IrrigationAreaApi, IrrigationAreaVO } from '@/api/agriculture/irrigationarea';
import ParkDetailFormReadOnly from '@/views/agriculture/irrigationarea/components/ParkDetailFormReadOnly.vue';

/** 灌区信息 表单 */
defineOptions({ name: 'IrrigationAreaForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  iaCode: undefined,
  iaName: undefined,
  irrigationType: undefined,
  iaImage: undefined,
  geofencing: undefined,
  latitude: undefined,
  longitude: undefined,
  principal: undefined,
  contactInformation: undefined,
  isAddress: undefined,
  remark: undefined,
  parkDetails: []
});
const formRules = reactive({
  iaName: [{ required: true, message: '灌区名称不能为空', trigger: 'blur' }],
  irrigationType: [{ required: true, message: '喷灌类型不能为空', trigger: 'change' }]
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
      formData.value = await IrrigationAreaApi.getIrrigationArea(id);
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
    const data = formData.value as unknown as IrrigationAreaVO;
    if (formType.value === 'create') {
      await IrrigationAreaApi.createIrrigationArea(data);
      message.success(t('common.createSuccess'));
    } else {
      await IrrigationAreaApi.updateIrrigationArea(data);
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
    iaCode: undefined,
    iaName: undefined,
    irrigationType: undefined,
    iaImage: undefined,
    geofencing: undefined,
    latitude: undefined,
    longitude: undefined,
    principal: undefined,
    contactInformation: undefined,
    isAddress: undefined,
    remark: undefined
  };
  formRef.value?.resetFields();
};
// 子表dom容器
const subFormDom = ref();
</script>
