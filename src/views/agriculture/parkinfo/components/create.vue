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
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo';
import { ParkCategoryApi } from '@/api/agriculture/parkcategory';
import ParkDetailForm from '@/views/agriculture/parkinfo/components/ParkDetailForm.vue';
import FenceDialog from './fenceDialog.vue';

const route = useRoute();
const router = useRouter();
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path;
const FORMPAGE_NAME = '基地';
const ORIGIN_PATH = '/asset/base/parkinfo'; // 关闭表单时跳转的路径

// TODO: name使用创建菜单时填写的组件名
defineOptions({ name: 'ParkInfoCreateDetail' });

const parkCategoryOptions = ref(); //基地分类列表
const getFormInfo = async () => {
  parkCategoryOptions.value = await ParkCategoryApi.getAllParkCategory();
  resetForm();
  formData.value = await ParkInfoApi.getParkInfo(route.query.id as any);
  formData.value.parkDetails = await ParkInfoApi.getParkDetailListByParkId(route.query.id);
};
const getCategoryOptions = async () => {
  parkCategoryOptions.value = await ParkCategoryApi.getAllParkCategory();
};

// if (!route.query.id) getCategoryOptions()
// 页面 Loading
const formLoading = ref<boolean>(false);

// 表单 Ref
const formRef = ref();

// 表单字段数据
const formData = ref({
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
});

// 表单校验规则
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  altitude: [{ required: true, message: '海拔不能为空', trigger: 'blur' }],
  latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
  longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '通讯地址不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  tel: [
    {
      required: true,
      pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  area: [{ required: true, message: '面积不能为空', trigger: 'blur' }]
});

/** 子表的表单 */
const subTabsName = ref('parkDetail');
const parkDetailFormRef = ref();

/** 计算 面积 */
watch(
  () => formData.value,
  (val) => {
    if (!val) {
      return;
    }
    if (val.parkDetails) {
      const totalArea = val.parkDetails.reduce(
        (prev, curr) => Number(prev) + Number(curr.area != null ? curr.area : 0),
        0
      );
      formData.value.area = totalArea;
    }
  },
  { deep: true }
);

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
      if (!parkDetail.parkId) {
        parkDetail.parkId = formData.value.id;
      }
    });
    console.log('parkInfo', formData.value);
    const data = formData.value as unknown as ParkInfoVO;
    if (!formData.value.id) {
      await ParkInfoApi.createParkInfo(data);
      ElMessage.success('提交成功！');
    } else {
      await ParkInfoApi.updateParkInfo(data);
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
} else {
  getCategoryOptions();
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
          <h1 class="m-0 text-black font-bold text-[18px]">基地信息新增/编辑</h1>
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
          class="border border-solid border-[#e6e6e6] shadow-md custom-bounce fixed bottom-[16px] left-[50%] px-[8px] py-[6px] rounded-full bg-white z-999"
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
              <el-option
                v-for="dict in parkCategoryOptions"
                :key="dict.value"
                :label="dict.categoryLabel"
                :value="dict.id"
              />
            </el-select>
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
          <el-form-item label="海拔" prop="altitude">
            <el-input v-model="formData.altitude" placeholder="请输入海拔">
              <template #append>米</template>
            </el-input>
          </el-form-item>
          <el-form-item label="面积" prop="area">
            <el-input v-model="formData.area" placeholder="请输入面积" disabled>
              <template #append>亩</template>
            </el-input>
          </el-form-item>
          <el-form-item label="通讯地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入通讯地址" />
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="formData.quantity" placeholder="请输入数量" />
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="formData.contact" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="formData.tel" placeholder="请输入联系电话" />
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

          <el-form-item label="图片" prop="img">
            <UploadImg v-model="formData.img" />
          </el-form-item>
        </el-form>

        <!-- demo6.2.2新增 分隔线 -->
        <div class="w-full h-[2px] split-line my-[16px]"></div>

        <!-- 子表的表单 demo6.2.2新增 子表用div包裹 -->
        <div ref="subFormDom">
          <!-- 二级标题因为要和操作按钮写在同一行所以写在组件里了 -->
          <ParkDetailForm ref="parkDetailFormRef" :parkDetails="formData.parkDetails" />
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
  background-image: repeating-linear-gradient(to right, #e6e6e6 0 8px, #fff 8px 16px);
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
