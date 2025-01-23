<template>
  <div>
    <EditFrame>
      <template #header>
        <!-- demo6.2.2新增 一级标题和按钮 -->
        <div>
          <h1 class="m-0 font-bold text-[18px]">农药登记信息</h1>
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

        <!-- 原内容 -->
        <el-form
          class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-y-[10px] w-full form"
          :show-message="false"
          @validate="handleValidate"
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          v-loading="formLoading"
        >
          <el-form-item label="登记证号" prop="registrationNumber">
            <el-input v-model="formData.registrationNumber" placeholder="请输入登记证号" />
          </el-form-item>
          <el-form-item label="登记证持有人" prop="holder">
            <el-input v-model="formData.holder" placeholder="请输入登记证持有人" />
          </el-form-item>
          <el-form-item label="农药名称" prop="pesticideName">
            <el-input v-model="formData.pesticideName" placeholder="请输入农药名称" />
          </el-form-item>
          <el-form-item label="剂型" prop="formulation">
            <el-input v-model="formData.formulation" placeholder="请输入剂型" />
          </el-form-item>
          <el-form-item label="毒性" prop="toxicity">
            <el-input v-model="formData.toxicity" placeholder="请输入毒性" />
          </el-form-item>
          <el-form-item label="有效成分及其含量" prop="activeIngredients">
            <el-input v-model="formData.activeIngredients" placeholder="请输入有效成分及其含量" />
          </el-form-item>
          <el-form-item label="农药类别" prop="pesticideCategory">
            <el-input v-model="formData.pesticideCategory" placeholder="请输入农药类别" />
          </el-form-item>
          <el-form-item label="作物/场所" prop="cropOrPlace">
            <el-input v-model="formData.cropOrPlace" placeholder="请输入作物/场所" />
          </el-form-item>
          <el-form-item label="防治对象" prop="controlObject">
            <el-input v-model="formData.controlObject" placeholder="请输入作物/场所" />
          </el-form-item>
          <el-form-item label="产品质量标准号" prop="qualityStandardNumber">
            <el-input v-model="formData.qualityStandardNumber" placeholder="请输入产品质量标准号" />
          </el-form-item>
        </el-form>
        <!-- demo6.2.2新增 分隔线 -->
        <div class="w-full h-[2px] split-line my-[16px]"></div>
        <!-- 子表的表单 demo6.2.2新增 子表用div包裹 -->
        <div ref="subFormDom">
          <!-- 二级标题因为要和操作按钮写在同一行所以写在组件里了 -->
          <PesticideRegistrationSubForm
            ref="PesticideRegistrationSubFormRef"
            :pesticideRegistrationSubDOList="formData.pesticideRegistrationSubDOList"
          />
        </div>
        <!-- 截至 -->
        <!-- demo6.2.2新增 分隔线 -->
        <div class="w-full h-[2px] split-line my-[16px]"></div>
        <!-- 子表的表单 demo6.2.2新增 子表用div包裹 -->
        <div ref="subFormDom">
          <!-- 二级标题因为要和操作按钮写在同一行所以写在组件里了 -->
          <PesticideMatterSubForm
            ref="PesticideMatterSubFormRef"
            :pesticideMatterSubDOList="formData.pesticideMatterSubDOList"
          />
        </div>
        <!-- 截至 -->
      </template>
    </EditFrame>
  </div>
</template>
<script setup lang="ts">
import {
  EditFrame,
  addFormStorage,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index';
import { useTagsViewStore } from '@/store/modules/tagsView';

import {
  PesticideRegistrationApi,
  PesticideRegistrationVO
} from '@/api/agriculture/pesticideregistration';
import { PesticideMatterSubApi, PesticideMatterSubVO } from '@/api/agriculture/pesticidemattersub';

import PesticideRegistrationSubForm from '@/views/agriculture/pesticideregistration/PesticideRegistrationSubForm.vue';
import PesticideMatterSubForm from '@/views/agriculture/pesticideregistration/PesticideMatterSubForm.vue';

// 本地保存表单
const route = useRoute();
const router = useRouter();
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path;
const FORMPAGE_NAME = '农药登记';
const ORIGIN_PATH = '/asset/pesticide-registration'; // 关闭表单时跳转的路由

/** 农药登记 表单 */
defineOptions({ name: 'PesticideRegistrationForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  registrationNumber: undefined,
  holder: undefined,
  pesticideName: undefined,
  formulation: undefined,
  toxicity: undefined,
  activeIngredients: undefined,
  pesticideCategory: undefined,
  cropOrPlace: undefined,
  controlObject: undefined,
  qualityStandardNumber: undefined,
  usageRate: undefined,
  applicationMethod: undefined,
  technicalRequirements: undefined,
  productPerformance: undefined,
  precautions: undefined,
  poisoningFirstAid: undefined,
  storageAndTransport: undefined,
  qualityAssurancePeriod: undefined,
  remarks: undefined,
  approvalDate: undefined,
  reapprovalDate: undefined,
  pesticideRegistrationSubDOList: [],
  pesticideMatterSubDOList: []
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref
const PesticideRegistrationSubFormRef = ref();
const PesticideMatterSubFormRef = ref();
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
      formData.value = await PesticideRegistrationApi.getPesticideRegistration(id);
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
  await PesticideRegistrationSubFormRef.value.validate();
  await PesticideMatterSubFormRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as PesticideRegistrationVO;
    if (!formData.value.id) {
      await PesticideRegistrationApi.createPesticideRegistration(data);
      message.success(t('common.createSuccess'));
    } else {
      await PesticideRegistrationApi.updatePesticideRegistration(data);
      message.success(t('common.updateSuccess'));
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
    deleteFormStorage(ROUTE_PATH, formData.value.id ? formData.value.id : 'new_form');
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
    // 发送操作成功的事件
    router.push(ORIGIN_PATH);
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    registrationNumber: undefined,
    holder: undefined,
    pesticideName: undefined,
    formulation: undefined,
    toxicity: undefined,
    activeIngredients: undefined,
    pesticideCategory: undefined,
    cropOrPlace: undefined,
    controlObject: undefined,
    qualityStandardNumber: undefined,
    usageRate: undefined,
    applicationMethod: undefined,
    technicalRequirements: undefined,
    productPerformance: undefined,
    precautions: undefined,
    poisoningFirstAid: undefined,
    storageAndTransport: undefined,
    qualityAssurancePeriod: undefined,
    remarks: undefined,
    approvalDate: undefined,
    reapprovalDate: undefined,
    pesticideRegistrationSubDOList: [],
    pesticideMatterSubDOList: []
  };
  formRef.value?.resetFields();
};

// todo

//保存到浏览器缓存
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
  if (_form) formData.value = _form.formContent;
};
if (!formData.value.id) loadData();

//起步函数
const getFrom = async () => {
  resetForm();
  if (route.query.id) {
    formData.value = await PesticideRegistrationApi.getPesticideRegistration(route.query.id as any);
    loadData(route.query.id);
  }
};

// 方式二 调用立即执行函数
onMounted(async () => {
  getFrom();
});
</script>
