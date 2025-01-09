<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input v-model="formData.enterpriseName" placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="邮政编码" prop="postCode">
        <el-input v-model="formData.postCode" placeholder="请输入邮政编码" />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="formData.longitude" placeholder="请输入经度">
          <template #suffix>
            <div class="px-2 h-full text-[#009688] cursor-pointer" @click="handleSelectPoint()">
              选点
            </div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="formData.latitude" placeholder="请输入纬度">
          <template #suffix>
            <div class="px-2 h-full text-[#009688] cursor-pointer" @click="handleSelectPoint()">
              选点
            </div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="登记证号" prop="productionNumber">
        <el-input v-model="formData.productionNumber" placeholder="请输入登记证号" />
      </el-form-item>
      <el-form-item label="有效期至" prop="expirationDate">
        <el-date-picker
          v-model="formData.expirationDate"
          type="date"
          value-format="x"
          placeholder="选择有效期"
        />
      </el-form-item>
      <el-form-item label="生产范围" prop="productionScope">
        <el-input v-model="formData.productionScope" placeholder="请输入生产范围" />
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model="formData.contactPerson" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactNumber">
        <el-input v-model="formData.contactNumber" placeholder="请输入联系电话" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <fence-dialog v-model="showDrawDialog" title="地图选点" class="dialog-top">
    <div class="w-full h-full">
      <map-custom
        ref="tiandiIns"
        :enableEdit="false"
        :searchLocation="true"
        @map-click="handleMapClick"
      />
    </div>
    <template #footer>
      <el-button size="small" @click="handleCancel()">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm()">确 定</el-button>
    </template>
  </fence-dialog>
</template>
<script setup lang="ts">
import { EnterpriseInfoApi, EnterpriseInfoVO } from '@/api/agriculture/enterpriseinfo';
import FenceDialog from '@/views/agriculture/parkinfo/components/fenceDialog.vue';

/** 企业信息 表单 */
defineOptions({ name: 'EnterpriseInfoForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  enterpriseName: undefined,
  address: undefined,
  postCode: undefined,
  longitude: undefined,
  latitude: undefined,
  contactPerson: undefined,
  contactNumber: undefined,
  productionNumber: undefined,
  productionScope: undefined,
  expirationDate: null
});
const formRules = reactive({
  enterpriseName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
  postCode: [{ required: true, message: '邮政编码不能为空', trigger: 'blur' }],
  productionNumber: [{ required: true, message: '企业生产登记证号不能为空', trigger: 'blur' }],
  expirationDate: [{ required: true, message: '有效期不能为空', trigger: 'blur' }]
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
      formData.value = await EnterpriseInfoApi.getEnterpriseInfo(id);
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
    const data = formData.value as unknown as EnterpriseInfoVO;
    if (formType.value === 'create') {
      await EnterpriseInfoApi.createEnterpriseInfo(data);
      message.success(t('common.createSuccess'));
    } else {
      await EnterpriseInfoApi.updateEnterpriseInfo(data);
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
    enterpriseName: undefined,
    address: undefined,
    postCode: undefined,
    longitude: undefined,
    latitude: undefined,
    contactPerson: undefined,
    contactNumber: undefined,
    productionNumber: undefined,
    productionScope: undefined,
    expirationDate: null
  };
  formRef.value?.resetFields();
};

const tiandiIns = ref();
const handleSelectPoint = () => {
  showDrawDialog.value = true;
  setTimeout(() => {
    const latitude = Number(formData.value.latitude);
    const longitude = Number(formData.value.longitude);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const positionString = `${longitude},${latitude}`;
      if (positionString) tiandiIns.value.handleSearchItemClick({ lonlat: positionString });
    }
  }, 300);
};
const showDrawDialog = ref<boolean>(false);
const handleCancel = () => {
  showDrawDialog.value = false;
  selectedLat.value = '';
  selectedLng.value = '';
};
const handleConfirm = () => {
  showDrawDialog.value = false;
  if (!selectedLat.value || !selectedLat.value) return;
  formData.value.latitude = selectedLat.value;
  formData.value.longitude = selectedLng.value;
};

const selectedLng = ref<string>('');
const selectedLat = ref<string>('');
const handleMapClick = (item) => {
  tiandiIns.value.clearMarkers();
  setTimeout(() => {
    const { lng, lat } = item;
    selectedLng.value = lng.toString();
    selectedLat.value = lat.toString();
    const positionString = `${lng},${lat}`;
    if (positionString) tiandiIns.value.handleSearchItemClick({ lonlat: positionString });
  }, 200);
};
</script>

<style scoped>
.dialog-top {
  z-index: 9999 !important;
}
</style>
