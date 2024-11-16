<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="reservedOne">
            <!--        <el-input v-model="formData.facilityId" placeholder="请输入设备ID" />-->
            <el-input v-model="formData.reservedOne" placeholder="请选择设备" disabled>
              <template #append>
                <el-button @click="openPurchaseOrderInEnableList">
                  <Icon icon="ep:search" />
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监测类型" prop="warnType">
            <el-select v-model="formData.warnType" placeholder="请选择监测类型">
              <el-option
                v-for="item in optionsType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="基地名称" prop="parkName">
            <el-input
              v-model="formData.parkName"
              placeholder="选择设备后自动填入基地名称"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地块名称" prop="plotName">
            <el-input
              v-model="formData.plotName"
              placeholder="选择设备后自动填入地块名称"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="预警信息" prop="lowMsg">
        <el-input v-model="formData.lowMsg" placeholder="预警信息" disabled>
          <template #append>
            <el-button @click="openPurchaseOrderInEnableListA">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="监测作物" prop="breedId">
            <!--        <el-input v-model="formData.breedId" placeholder="请输入监测作物"/>-->
            <el-select v-model="formData.breedId" placeholder="选择预警信息自动填入农作物" disabled>
              <el-option
                v-for="item in listCategoryManagement"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="病虫害种类" prop="diseaseType">
            <el-select
              v-model="formData.diseaseType"
              clearable
              placeholder="选择预警信息自动填入病虫害种类"
              disabled
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_DISEASE_NAME)"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="阈值下限" prop="warnLowValue">
            <el-input
              v-model="formData.warnLowValue"
              placeholder="选择预警信息自动填入阈值下限"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="阈值上限" prop="warnHighValue">
            <el-input
              v-model="formData.warnHighValue"
              placeholder="选择预警信息自动填入阈值上限"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位" prop="warnUnit">
            <el-input v-model="formData.warnUnit" placeholder="选择预警信息自动填入单位" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监测周期" prop="monitorPeriod">
            <el-input
              v-model="formData.monitorPeriod"
              placeholder="选择预警信息自动填入监测周期"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="当前值" prop="reservedTwo">
            <el-input v-model="formData.reservedTwo" placeholder="请输入当前值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="病虫害等级" prop="reservedFour">
            <el-input v-model="formData.reservedFour" placeholder="请输入病虫害等级" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange" />
  <SelectDiseaseThresholdRuleFrom
    ref="purchaseOrderInEnableListRefA"
    @success="handlePurchaseOrderChangeA"
  />
</template>
<script setup lang="ts">
import { DiseaseWarnInfoApi, DiseaseWarnInfoVO } from '@/api/agriculture/diseasewarninfo';
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue';
import SelectDiseaseThresholdRuleFrom from '@/views/agriculture/diseasethresholdrule/SelectDiseaseThresholdRuleFrom.vue';
import { EquipmentDataVO } from '@/api/agriculture/equipmentdata';
import { DiseaseThresholdRuleVO } from '@/api/agriculture/diseasethresholdrule';
import { allDataCacheManager, CategoryManagementVO } from '@/api/agriculture/categorymanagement';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';

/** 病虫害预警记录 表单 */
defineOptions({ name: 'DiseaseWarnInfoForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warnType: undefined,
  facilityId: undefined,
  breedId: undefined,
  cropName: undefined,
  diseaseType: undefined,
  diseaseId: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  monitorPeriod: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  parkName: undefined,
  plotName: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined,
  reservedFive: undefined,
  remark: undefined
});
const formRules = reactive({
  reservedOne: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
  warnType: [{ required: true, message: '监测类型不能为空', trigger: 'change' }],
  reservedThree: [{ required: true, message: '预警信息不能为空', trigger: 'change' }],
  reservedTwo: [{ required: true, message: '当前值不能为空', trigger: 'change' }],
  reservedFour: [{ required: true, message: '病虫害等级不能为空', trigger: 'change' }]
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
const getType = async () => {
  listCategoryManagement.value = await allDataCacheManager.getData({});
};
getType();
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
      formData.value = await DiseaseWarnInfoApi.getDiseaseWarnInfo(id);
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
  // 将订单设置到入库单
  //赋值id
  formData.value.facilityId = order[0].id;
  //基地
  formData.value.belongPark = order[0].belongPark;
  //地块
  formData.value.belongPlot = order[0].belongPlot;
  formData.value.plotName = order[0].parkDetailName;
  formData.value.parkName = order[0].parkName;
  //设备名称
  formData.value.reservedOne = order[0].deviceName;
};

const purchaseOrderInEnableListRefA = ref();
const openPurchaseOrderInEnableListA = () => {
  purchaseOrderInEnableListRefA.value.open();
};
const handlePurchaseOrderChangeA = async (order: DiseaseThresholdRuleVO) => {
  //赋值
  console.log('11111', order[0]);
  formData.value.reservedFive = order[0].id;
  formData.value.warnLowValue = order[0].warnLowValue;
  formData.value.warnHighValue = order[0].warnHighValue;
  formData.value.warnUnit = order[0].warnUnit;
  formData.value.lowMsg = order[0].lowMsg;
  formData.value.monitorPeriod = order[0].monitorPeriod;
  formData.value.breedId = order[0].breedId;
  formData.value.diseaseType = order[0].diseaseType;
  formData.value.reservedFour = order[0].reservedOne;
};

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as DiseaseWarnInfoVO;
    if (formType.value === 'create') {
      await DiseaseWarnInfoApi.createDiseaseWarnInfo(data);
      message.success(t('common.createSuccess'));
    } else {
      await DiseaseWarnInfoApi.updateDiseaseWarnInfo(data);
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
    warnType: undefined,
    facilityId: undefined,
    breedId: undefined,
    cropName: undefined,
    diseaseType: undefined,
    diseaseId: undefined,
    warnLowValue: undefined,
    warnHighValue: undefined,
    warnUnit: undefined,
    lowMsg: undefined,
    monitorPeriod: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    parkName: undefined,
    plotName: undefined,
    reservedOne: undefined,
    reservedTwo: undefined,
    reservedThree: undefined,
    reservedFour: undefined,
    reservedFive: undefined,
    remark: undefined
  };
  formRef.value?.resetFields();
};
</script>
