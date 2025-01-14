// templateIndexForm模版
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { colorOpt } from '@/config/colorTheme/colorConfig';
import { setCssVar } from '@/utils';

/* todo原页面的js代码复制在下面 */
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import {
  PesticideRegistrationApi,
  PesticideRegistrationVO
} from '@/api/agriculture/pesticideregistration';
import PesticideRegistrationForm from './PesticideRegistrationForm.vue';

/** 农药登记 列表 */
defineOptions({ name: 'PesticideRegistration' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<PesticideRegistrationVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
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
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await PesticideRegistrationApi.getPesticideRegistrationPage(queryParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await PesticideRegistrationApi.deletePesticideRegistration(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await PesticideRegistrationApi.exportPesticideRegistration(queryParams);
    download.excel(data, '农药登记.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});
/* 原页面的代码复制在上面 */

/**
 * topMenuHeight      顶部菜单和标签页高度
 * contentPadding     页面内容外边距
 */
const topMenuHeight = 85;
const contentPadding = 8;

// 展开或收起搜索栏
const showSearch = ref(false);
const handleClickShowSearch = () => {
  showSearch.value = !showSearch.value;
};
</script>

<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 todo替换成菜单名称-->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">农药登记管理</h1>
        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
        <!-- 一级标题旁边的按钮 -->
        <!-- todo原新增按钮 -->
        <!-- todo需要包含type="primary"&&不能有plain属性 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:pesticide-registration:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <!-- todo复制原页面【搜索、重置、导出】 -->
        <!-- todo【搜索】按钮需要包含type="primary"&&不能有plain属性 -->
        <!-- todo删除导出按钮的type和plain属性 -->
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:pesticide-registration:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
        <button
          class="circle-arrow-up ml-[16px]"
          :class="showSearch ? 'rotate180andthemeBg' : 'rotate180andwhiteBg'"
          @click="handleClickShowSearch"
        >
          <Icon :size="14" icon="ep:arrow-up" />
        </button>
      </div>
    </div>

    <!-- 搜索栏 注意 :model 和 ref 的名称 -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form"
      :class="showSearch ? 'opacity-120' : 'h-0 opacity-0'"
      label-width="110px"
      :inline="true"
    >
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <!-- todo复制原来的搜索列表 -->
      <!-- todo 所有的都需要删除class=“!w-240” 这一类的属性 -->
      <el-form-item label="登记证号" prop="registrationNumber">
        <el-input
          v-model="queryParams.registrationNumber"
          placeholder="请输入登记证号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登记证持有人" prop="holder">
        <el-input
          v-model="queryParams.holder"
          placeholder="请输入登记证持有人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农药名称" prop="pesticideName">
        <el-input
          v-model="queryParams.pesticideName"
          placeholder="请输入农药名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="剂型" prop="formulation">
        <el-input
          v-model="queryParams.formulation"
          placeholder="请输入剂型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="毒性" prop="toxicity">
        <el-input
          v-model="queryParams.toxicity"
          placeholder="请输入毒性"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有效成分及其含量" prop="activeIngredients">
        <el-input
          v-model="queryParams.activeIngredients"
          placeholder="请输入有效成分及其含量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农药类别" prop="pesticideCategory">
        <el-input
          v-model="queryParams.pesticideCategory"
          placeholder="请输入农药类别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作物/场所" prop="cropOrPlace">
        <el-input
          v-model="queryParams.cropOrPlace"
          placeholder="请输入作物/场所"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="防治对象" prop="controlObject">
        <el-input
          v-model="queryParams.controlObject"
          placeholder="请输入防治对象"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="产品质量标准号" prop="qualityStandardNumber">
        <el-input
          v-model="queryParams.qualityStandardNumber"
          placeholder="请输入产品质量标准号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
    </el-form>

    <div class="w-full mt-[8px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :row-key="(row) => row.id"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :show-overflow-tooltip="true"
        @row-click="clickSelect"
        size="default"
      >
        <!-- todo复制列表 -->
        <!--      <el-table-column label="id" align="center" prop="id"/>-->
        <!-- <el-table-column type="selection" width="55" :reserve-selection="true" /> -->
        <el-table-column label="序号" align="center" prop="id" />
        <el-table-column label="登记证号" align="center" prop="registrationNumber" />
        <el-table-column label="登记证持有人" align="center" prop="holder" />
        <el-table-column label="农药名称" align="center" prop="pesticideName" />
        <el-table-column label="剂型" align="center" prop="formulation" />
        <el-table-column label="毒性" align="center" prop="toxicity" />
        <el-table-column label="有效成分及其含量" align="center" prop="activeIngredients" />
        <el-table-column label="农药类别" align="center" prop="pesticideCategory" />
        <el-table-column label="作物/场所" align="center" prop="cropOrPlace" />
        <el-table-column label="防治对象" align="center" prop="controlObject" />
        <el-table-column label="产品质量标准号" align="center" prop="qualityStandardNumber" />
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <!-- todo操作按钮 -->
            <!-- 1.  <template #default="scope"> 中，加入
                <div class="flex items-center justify-center">
                  其中放入编辑，删除"按钮"等，每一个按钮中完成后加入
                    <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
                  这段代码的含义是“竖杠”分隔符
                </div>
                2.请注意“方案一”和“方案二”只采用一种，请根据自身按钮数量选择性删除或保留
              -->
            <!-- todo方案一 -->
            <div class="flex items-center justify-center">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:pesticide-registration:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:pesticide-registration:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 页码组件 注意绑定的值和事件函数 -->
    <!-- 不用改 -->
    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>
  <!-- todo页面组件复制在下面 -->
  <!-- 表单弹窗：添加/修改 -->
  <PesticideRegistrationForm ref="formRef" @success="getList" />
</template>
<style lang="scss" scoped>
// 原页面样式复制在下面

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

// 收起
.circle-arrow-up {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ebebeb;
  color: #333;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    color: white;
    border-width: 0;
    background-color: var(--el-color-primary);
  }
}

// 向上箭头展开收起的动画
@keyframes rotate180andwhiteBg {
  from {
    transform: rotate(0deg);
    color: #333;
    background-color: white;
  }
  to {
    transform: rotate(180deg);
    color: white;
    background-color: var(--el-color-primary);
  }
}

.rotate180andwhiteBg {
  animation-duration: 0.5s;
  animation-name: rotate180andwhiteBg;
  animation-fill-mode: forwards;
}

@keyframes rotate180andthemeBg {
  from {
    transform: rotate(180deg);
    color: white;
    background-color: var(--el-color-primary);
  }
  to {
    transform: rotate(360deg);
    color: #333;
    background-color: white;
  }
}

.rotate180andthemeBg {
  animation-duration: 0.5s;
  animation-name: rotate180andthemeBg;
  animation-fill-mode: forwards;
}
</style>
