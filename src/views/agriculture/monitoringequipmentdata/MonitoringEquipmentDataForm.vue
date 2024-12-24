<template>
  <!-- 2024.12.14修改 demo8.1.1 调整了dialog宽度和距离顶部高度 -->
  <Dialog :title="dialogTitle" v-model="dialogVisible" :width="780" top="9vh">
    <!-- 2024.12.14修改 demo8.1.1 表单项分两栏 删掉输入框内按钮对应的文字 只保留图标 -->
    <el-form
      class="form grid gap-y-[8px] grid-cols-2 gap-x-[16px]"
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="监控基地ID" prop="monitoringBaseId">
        <el-input v-model="formData.monitoringBaseId" placeholder="请输入所属基地" :disabled="true">
          <template #append>
            <el-button @click="openParkInfoPopup('0')">
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="监控基地名称" prop="monitoringBaseName">
        <el-input
          v-model="formData.monitoringBaseName"
          placeholder="请输入监控基地名称"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="监控地块ID" prop="monitoringPlotId">
        <el-input v-model="formData.monitoringPlotId" placeholder="请输入所属地块" :disabled="true">
          <template #append>
            <el-button @click="openParkDetailPopup(formData)">
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="监控地块名称" prop="monitoringPlotName">
        <el-input
          v-model="formData.monitoringPlotName"
          placeholder="请输入监控地块名称"
          :disabled="true"
        />
      </el-form-item>
      <!-- 原:备用一 -->
      <el-form-item label="录入方式" prop="reserveOne">
        <el-radio-group v-model="formData.reserveOne">
          <el-radio label="人工">人工</el-radio>
          <el-radio label="机器">机器</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceId" v-if="formData.reserveOne == '机器'">
        <!-- <el-input v-model="formData.deviceId" placeholder="请输入设备ID" :disabled="true" /> -->
        <el-input v-model="formData.deviceId" placeholder="请输入设备ID" :disabled="true">
          <template #append>
            <el-button @click="openSelectDeviceInfo(formData)">
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName" v-if="formData.reserveOne == '机器'">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" :disabled="true" />
      </el-form-item>
      <!-- 2024.12.14修改 demo8.1.1 调整了表单项顺序 -->
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formData.remarks" placeholder="请输入备注" />
      </el-form-item>
      <!-- 备用二 -->
      <el-form-item label="图片拍摄时间" prop="reserveTwo">
        <!-- <el-input v-model="formData.reserveTwo" placeholder="请输入图片拍摄时间" /> -->
        <el-date-picker
          v-model="formData.reserveTwo"
          type="datetime"
          value-format="x"
          placeholder="选择图片拍摄时间"
        />
      </el-form-item>
      <el-form-item label="视频链接" prop="videoLink" class="col-span-2">
        <!-- <el-input v-model="formData.videoLink" placeholder="请输入视频链接" /> -->
        <el-input v-model="formData.videoLink" placeholder="请选择视频" :disabled="true" />
        <el-upload
          action="#"
          :auto-upload="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="beforeUpload"
          class="mt-[4px]"
        >
          <el-button solt="trigger" size="small" type="primary">选择视频</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="抓拍图片" prop="capturedImage">
        <UploadImg v-model="formData.capturedImage" />
      </el-form-item>

      <!--

      <el-form-item label="备用三" prop="reserveThree">
        <el-input v-model="formData.reserveThree" placeholder="请输入备用三" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!--  选择基地-->
  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange" />
  <!--  选择地块-->
  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange" />
  <!--  选择设备-->
  <SelectDeviceInfo ref="SelectDeviceInfoRef" @success="SelectDeviceInfoSuccess" />
</template>
<script setup lang="ts">
import {
  MonitoringEquipmentDataApi,
  MonitoringEquipmentDataVO
} from '@/api/agriculture/monitoringequipmentdata';
import { ParkInfoVO } from '@/api/agriculture/parkinfo';
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue';
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue';
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { updateFile } from '@/api/infra/file/index';
import SelectDeviceInfo from '@/views/agriculture/deviceinfo/SelectDeviceInfoForms.vue';

// 视频监控
let fileList = ref([]);

const handleSuccess = (response, file, fileList) => {
  //console.log('Upload success:', response, file, fileList)
  videoType.value = false;
};

const handleError = (err, file, fileList) => {
  console.error('Upload error:', err, file, fileList);
};
let videoType = ref(false);
const beforeUpload = async (file) => {
  const isVideo = file.raw.type === 'video/mp4';
  if (!isVideo) {
    ElMessageBox.alert('请上传视频文件（.mp4格式）', '错误', { type: 'error' });
  } else {
    videoType.value = true;
    const fileForm = new FormData();
    fileForm.append('file', file.raw);
    const { data } = await updateFile(fileForm);
    //console.log('res', data)
    formData.value.videoLink = data;
    videoType.value = false;
  }
  return isVideo;
};

const submitUpload = () => {
  if (fileList.value && fileList.value.length > 0) {
    const formData = new FormData();
    formData.append('file', fileList.value[0].raw);
    // 使用你的HTTP库发送formData到服务器
  } else {
    ElMessageBox.alert('请选择一个视频文件上传', '提示', { type: 'info' });
  }
};
//视频监控结尾

/** 监控设备数据 表单 */
defineOptions({ name: 'MonitoringEquipmentDataForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  capturedImage: undefined,
  videoLink: undefined,
  remarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined
});
const formRules = reactive({
  monitoringBaseId: [{ required: true, message: '基地不能为空', trigger: 'blur' }],
  monitoringPlotId: [{ required: true, message: '地块不能为空', trigger: 'blur' }],
  reserveOne: [{ required: true, message: '录入方式不能为空', trigger: 'blur' }],
  reserveTwo: [{ required: true, message: '图片拍摄时间不能为空', trigger: 'blur' }],
  capturedImage: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
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
      formData.value = await MonitoringEquipmentDataApi.getMonitoringEquipmentData(id);
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
    const data = formData.value as unknown as MonitoringEquipmentDataVO;
    if (formType.value === 'create') {
      await MonitoringEquipmentDataApi.createMonitoringEquipmentData(data);
      message.success(t('common.createSuccess'));
    } else {
      await MonitoringEquipmentDataApi.updateMonitoringEquipmentData(data);
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
    deviceId: undefined,
    deviceName: undefined,
    monitoringBaseId: undefined,
    monitoringBaseName: undefined,
    monitoringPlotId: undefined,
    monitoringPlotName: undefined,
    capturedImage: undefined,
    videoLink: undefined,
    remarks: undefined,
    reserveOne: undefined,
    reserveTwo: undefined,
    reserveThree: undefined
  };
  formRef.value?.resetFields();
};

//基地的选择
const parkInfoPopupRef = ref();
const openType = ref('');
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === '') {
    message.error('请选择基地');
  } else parkInfoPopupRef.value.open(id);
};
const handleParkInfoPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    formData.value.monitoringBaseId = String(order[0].id);
    formData.value.monitoringBaseName = String(order[0].name);
  } else formData.value.belongPlot = String(order[0].id);
};

//地块的选择
const parkDetailPopupRef = ref();
const openType1 = ref('');
const openParkDetailPopup = (id: any) => {
  // console.log(id,"------------");
  openType1.value = id.monitoringBaseId;
  if (!openType1.value) {
    message.error('请选择基地');
  } else parkDetailPopupRef.value.open(id.monitoringBaseId);
};
const handleParkDetailPopupChange = (order: ParkDetailVO) => {
  // console.log("--->>查看选择的地块信息：",order[0])
  formData.value.monitoringBaseId = String(order[0].parkId);
  formData.value.monitoringPlotId = String(order[0].id);
  formData.value.monitoringPlotName = String(order[0].name);
};
// 机器信息选择
const SelectDeviceInfoRef = ref();
const openSelectDeviceInfo = (item: any) => {
  // console.log(item);
  if (!item.monitoringBaseId || item.monitoringBaseId === undefined) {
    message.error('请选择基地');
  } else if (!item.monitoringPlotId || !item.monitoringPlotId === undefined) {
    message.error('请选择地块');
  } else SelectDeviceInfoRef.value.open(item);
};
//点击确定后
const SelectDeviceInfoSuccess = (item: any) => {
  // console.log(item,"--------");
  formData.value.deviceId = item[0].id;
  formData.value.deviceName = item[0].deviceName;
};
</script>

<style lang="scss" scoped>
// 2024.12.14修改 demo8.1.1 修改表单项间距
.form > * {
  margin: 0;
}

:deep(.el-date-editor.el-input) {
  width: 100% !important;
}
</style>
