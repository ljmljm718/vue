<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!-- <el-form-item label="设备id" prop="deviceId">
        <el-input v-model="formData.deviceId" placeholder="请输入设备id" />
      </el-form-item> -->
      <el-form-item label="设备" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请选择设备" readonly>
          <template #append>
            <el-button @click="openSelectDeviceInfo()">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="deviceStatus">
        <el-radio-group v-model="formData.deviceStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!--  选择设备-->
  <AgriculturalBaseList ref="SelectDeviceInfoRef" @success="SelectDeviceInfoSuccess" />
</template>
<script setup lang="ts">
import { DeviceHistoryStatusApi, DeviceHistoryStatusVO } from '@/api/agriculture/devicehistory';
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue';
/** 设备历史状态 表单 */
defineOptions({ name: 'DeviceHistoryStatusForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceId: undefined,
  deviceStatus: undefined,
  deviceName: undefined
});
const formRules = reactive({
  // deviceId: [{ required: true, message: '设备id不能为空', trigger: 'blur' }],
  deviceName: [{ required: true, message: '设备名字不能为空', trigger: 'blur' }],
  deviceStatus: [{ required: true, message: '设备状态不能为空', trigger: 'blur' }]
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
      formData.value = await DeviceHistoryStatusApi.getDeviceHistoryStatus(id);
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
    const data = formData.value as unknown as DeviceHistoryStatusVO;
    if (formType.value === 'create') {
      await DeviceHistoryStatusApi.createDeviceHistoryStatus(data);
      message.success(t('common.createSuccess'));
    } else {
      await DeviceHistoryStatusApi.updateDeviceHistoryStatus(data);
      message.success(t('common.updateSuccess'));
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

// 机器信息选择
const SelectDeviceInfoRef = ref();
const openSelectDeviceInfo = () => {
  SelectDeviceInfoRef.value.open('jk'); //监控
};
//点击确定后
const SelectDeviceInfoSuccess = (item: any) => {
  formData.value.deviceId = item[0].id;
  formData.value.deviceName = item[0].deviceName;
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    deviceId: undefined,
    deviceStatus: undefined,
    deviceName: undefined
  };
  formRef.value?.resetFields();
};
</script>
