<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备" prop="deviceName">
        <!-- <el-input v-model="formData.device" placeholder="请输入设备" /> -->
        <el-input v-model="formData.deviceName" placeholder="请选择设备" disabled>
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="监测物种" prop="monitorSpecies">
        <el-select v-model="formData.monitorSpecies" clearable placeholder="请选择监测物种">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监测类型" prop="monitorType">
        <el-select v-model="formData.monitorType" placeholder="请选择监测类型">
          <el-option
            v-for="item in optionsType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监测时间" prop="monitorTime">
        <el-date-picker
          v-model="formData.monitorTime"
          type="datetime"
          value-format="x"
          placeholder="选择监测时间"
        />
      </el-form-item>
      <el-form-item label="监测抓图" prop="monitorPicture">
        <UploadImg v-model="formData.monitorPicture" />
      </el-form-item>
      <el-form-item label="地块" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="选择设备后自动填入地块名称" disabled />
      </el-form-item>
      <el-form-item label="识别状态" prop="identifyStatus">
        <el-select v-model="formData.identifyStatus" clearable placeholder="请选择识别状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_IDENTIFY_STATUS)"
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
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange" />
</template>
<script setup lang="ts">
import {
  DiseasePestSurveillanceApi,
  DiseasePestSurveillanceVO
} from '@/api/agriculture/diseasepestsurveillance';
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue';
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict';
import { EquipmentDataVO } from '@/api/agriculture/equipmentdata';
import {
  CategoryManagementApi,
  CategoryManagementVO,
  allDataCacheManager
} from '@/api/agriculture/categorymanagement';
import { page, parkPage } from '@/views/agriculture/IntelligentStatistics/api.ts';
/** 病虫害监测 表单 */
defineOptions({ name: 'DiseasePestSurveillanceForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  device: undefined,
  deviceName: undefined,
  monitorSpecies: undefined,
  monitorType: undefined,
  monitorTime: undefined,
  monitorPicture: undefined,
  belongPark: undefined,
  parkName: undefined,
  identifyStatus: undefined,
  deviceStatus: undefined
});
const formRules = reactive({
  deviceName: [{ required: true, message: '设备不能为空', trigger: 'change' }],
  monitorPicture: [{ required: true, message: '监测抓图不能为空', trigger: 'change' }]
});
const formRef = ref(); // 表单 Ref
//监测类型
const optionsType = ref([
  {
    value: '病害',
    label: '病害'
  },
  {
    value: '虫害',
    label: '虫害'
  }
]);
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  listCategoryManagement.value = await allDataCacheManager.getData({});
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await DiseasePestSurveillanceApi.getDiseasePestSurveillance(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

const purchaseOrderInEnableListRef = ref();
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open();
};
const handlePurchaseOrderChange = async (order: EquipmentDataVO) => {
  //赋值id
  formData.value.device = order[0].id;
  //地块id
  formData.value.belongPark = order[0].belongPlot;
  //地块名称
  formData.value.parkName = order[0].parkDetailName;
  //设备名称
  formData.value.deviceName = order[0].deviceName;
};

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as DiseasePestSurveillanceVO;
    if (formType.value === 'create') {
      await DiseasePestSurveillanceApi.createDiseasePestSurveillance(data);
      message.success(t('common.createSuccess'));
    } else {
      await DiseasePestSurveillanceApi.updateDiseasePestSurveillance(data);
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
    device: undefined,
    deviceName: undefined,
    monitorSpecies: undefined,
    monitorType: undefined,
    monitorTime: undefined,
    monitorPicture: undefined,
    belongPark: undefined,
    parkName: undefined,
    identifyStatus: undefined,
    deviceStatus: undefined
  };
  formRef.value?.resetFields();
};
</script>
