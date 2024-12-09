<script setup lang="ts">
import {
  EditFrame,
  addFormStorage,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index';
import { FolderChecked, TopRight, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { IrrigationAreaApi, IrrigationAreaVO } from '@/api/agriculture/irrigationarea';
import ParkDetailFormReadOnly from '@/views/agriculture/irrigationarea/components/ParkDetailFormReadOnly.vue';
import FenceDialog from '@/views/agriculture/parkinfo/components/fenceDialog.vue';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';

const route = useRoute();
const router = useRouter();
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path;
const FORMPAGE_NAME = '基地';
const ORIGIN_PATH = '/integrationWaterFertilizer/irrigate/irrigationArea'; // 关闭表单时跳转的路径

// TODO: name使用创建菜单时填写的组件名
defineOptions({ name: 'IrrigationAreaCreateDetail' });

const getFormInfo = async () => {
  resetForm();
  formData.value = await IrrigationAreaApi.getIrrigationArea(route.query.id as any);
  formData.value.parkDetails = await IrrigationAreaApi.getParkDetailListByIaId(route.query.id);
};

// 页面 Loading
const formLoading = ref<boolean>(false);

// 表单 Ref
const formRef = ref();

// 表单字段数据
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

// 表单校验规则
const formRules = reactive({
  iaName: [{ required: true, message: '灌区名称不能为空', trigger: 'blur' }],
  irrigationType: [{ required: true, message: '喷灌类型不能为空', trigger: 'change' }]
});

/** 子表的表单 */
const subTabsName = ref('parkDetail');
const parkDetailFormRef = ref();

// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate(() => {});
  // 校验子表单
  try {
    await parkDetailFormRef.value.validate();
  } catch (e) {
    subTabsName.value = 'parkDetail';
    return;
  }
  // 提交请求
  formLoading.value = true;
  try {
    formData.value.parkDetails.forEach((parkDetail) => {
      if (!parkDetail.belongIrrigationArea) {
        parkDetail.belongIrrigationArea = formData.value.id;
      }
    });
    console.log('iaInfo', formData.value);
    const data = formData.value as unknown as IrrigationAreaVO;
    if (!formData.value.id) {
      await IrrigationAreaApi.createIrrigationArea(data);
      ElMessage.success('提交成功！');
    } else {
      await IrrigationAreaApi.updateIrrigationArea(data);
      ElMessage.success('提交成功！');
    }
    // 表单已提交，从本地删除此表单
    deleteFormStorage(ROUTE_PATH, formData.value.id ? formData.value.id : 'new_form');
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
    router.push(ORIGIN_PATH);
  } catch (err) {
    ElMessage.error('提交失败, 请联系管理员');
  } finally {
    formLoading.value = false;
  }
};

// 重置表单方法
const resetForm = () => {
  formData.value = {
    id: undefined,
    code: undefined,
    name: undefined,
    type: undefined,
    altitude: undefined,
    latitude: undefined,
    longitude: undefined,
    address: undefined,
    contact: undefined,
    tel: undefined,
    area: undefined,
    remark: undefined,
    deptId: undefined,
    userId: undefined,
    quantity: undefined,
    img: undefined,
    parkDetails: [],
    geofencing: undefined
  };
};

// 本地保存表单
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  );
  ElMessage.success('保存成功！');
};
//获取浏览器缓存
const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage(ROUTE_PATH, id);
  if (_form) {
    formData.value = _form.formContent;
    return true;
  } else {
    return false;
  }
};
if (!formData.value.id) loadData();

const getAsyncData = async (id) => {
  const flag = await loadData(id);
  if (!flag) getFormInfo(); // 如果缓存中有数据，则不调用接口
};
if (route.query.id) {
  getAsyncData(route.query.id);
}

// 手风琴展开项
const activeName = ref<any>('1');

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

// demo6.2.2新增 表单校验提示 复制即可
const msg = useMessage();
const handleValidate = (prop: any, isValid: boolean, message: string) => {
  if (!isValid) msg.error(message);
};
// 子表dom容器
const subFormDom = ref();
</script>
<template>
  <div>
    <EditFrame>
      <template #header>
        <!-- demo6.2.2新增 一级标题和按钮 -->
        <div>
          <h1 class="m-0 text-black dark:text-[#ccc] font-bold text-[18px]">灌区信息新增/编辑</h1>
        </div>
        <div class="space-x-[8px]">
          <el-button type="primary" :icon="TopRight" @click="submitForm">提交</el-button>
          <el-button :icon="FolderChecked" @click="localSave()">暂存</el-button>
          <el-button :icon="Refresh" @click="resetForm()">清空</el-button>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <!-- demo6.2.2新增 子表在第一屏显示不出来的提示 加上#content="contentProps" -->
      <template #content="contentProps">
        <!-- 这个div直接复制 -->
        <div
          v-show="
            subFormDom && subFormDom.offsetTop - contentProps.scrollY - contentProps.contentH >= 0
          "
          class="border border-solid border-[#e6e6e6] shadow-md custom-bounce fixed bottom-[16px] left-[50%] px-[8px] py-[6px] rounded-full bg-white dark:bg-[#333] z-999"
          :style="{ color: 'var(--el-color-primary)' }"
        >
          <el-icon><Bottom /></el-icon>
        </div>

        <!--
          demo6.2.2新增 表单里输入框带按钮的只保留图标不要文字 多行输入独占一行 图片放在最后一项
          注意修改el-form的属性
        -->
        <el-form
          class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-[8px] w-full form"
          :show-message="false"
          @validate="handleValidate"
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
          <!-- demo6.2.2新增 注意多行输入添加class -->
          <el-form-item label="简介" prop="remark" class="col-span-2 xl:col-span-3 2xl:col-span-4">
            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入备注"
              resize="none"
            />
          </el-form-item>
          <el-form-item label="图片" prop="iaImage">
            <UploadImg v-model="formData.iaImage" />
          </el-form-item>
        </el-form>
        <!-- demo6.2.2新增 分隔线 -->
        <div class="w-full h-[2px] split-line my-[16px]"></div>

        <!-- 子表的表单 demo6.2.2新增 子表用div包裹 -->
        <div ref="subFormDom">
          <!-- 二级标题因为要和操作按钮写在同一行所以写在组件里了 -->
          <ParkDetailFormReadOnly
            ref="parkDetailFormRef"
            :parkDetails="formData.parkDetails"
            :iaId="formData.id"
          />
        </div>
      </template>
    </EditFrame>
    <fence-dialog v-model="showDrawDialog" title="地图选点">
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
  </div>
</template>

<style scoped lang="scss">
.scroll-bar-template {
  height: calc(100vh - 250px);
  overflow: auto;
}

// demo6.2.2新增 加上下面这些css样式 需要style标签上加 lang="scss"

// 鼠标移在按钮上时显示主题色边框
:deep(.el-button:hover) {
  border-color: var(--el-color-primary);
}

// 去掉表单的边距
:deep(.form > *) {
  margin: 0;
}

// 调整表单标签和输入框之间的距离
:deep(.form .el-form-item__label) {
  padding: 0 4px 0 0;
}

// 调整多行输入框的高度
:deep(.form .el-textarea__inner) {
  height: 60px !important;
}

// 分隔线样式
.split-line {
  background-image: repeating-linear-gradient(to right, #ccc 0 8px, transparent 8px 16px);
}

// 动画
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-15%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.custom-bounce {
  animation: bounce 1.5s infinite;
}
</style>
