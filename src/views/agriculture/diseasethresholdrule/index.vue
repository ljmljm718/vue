<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { colorOpt } from '@/config/colorTheme/colorConfig';
import { setCssVar } from '@/utils';

/* todo原页面的js代码复制在下面 */
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import {
  DiseaseThresholdRuleApi,
  DiseaseThresholdRuleVO
} from '@/api/agriculture/diseasethresholdrule';
import DiseaseThresholdRuleForm from './DiseaseThresholdRuleForm.vue';
import { allDataCacheManager, CategoryManagementVO } from '@/api/agriculture/categorymanagement';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';

/** 病虫害预警阈值设置 列表 */
defineOptions({ name: 'DiseaseThresholdRule' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<DiseaseThresholdRuleVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warnType: undefined,
  breedId: undefined,
  cropName: undefined,
  diseaseType: undefined,
  diseaseId: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  monitorPeriod: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined,
  reservedFive: undefined,
  remark: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const getType = async () => {
  listCategoryManagement.value = await allDataCacheManager.getData({});
};
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DiseaseThresholdRuleApi.getDiseaseThresholdRulePage(queryParams);
    list.value = data.list;
    //把品类数据的namep拼接到列表中
    list.value.forEach((item) => {
      listCategoryManagement.value.forEach((itm) => {
        if (item.breedId == itm.id) item.breedId = itm.categoryName;
      });
    });
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
    await DiseaseThresholdRuleApi.deleteDiseaseThresholdRule(id);
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
    const data = await DiseaseThresholdRuleApi.exportDiseaseThresholdRule(queryParams);
    download.excel(data, '病虫害预警阈值设置.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
  getType();
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
        <h1 class="m-0 text-[#333] font-bold text-[18px]">预警阈值设置</h1>
        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
        <!-- 一级标题旁边的按钮 -->
        <!-- todo原新增按钮 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:disease-threshold-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <!-- todo复制原页面【搜索、重置、导出】 -->
        <!-- todo记得检测搜索按钮的type属性是否等于'primary' -->
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
          v-hasPermi="['agriculture:disease-threshold-rule:export']"
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
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full overflow-hidden form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <!-- todo复制原来的搜索列表 -->
      <el-form-item label="农作物" prop="breedId">
        <el-select v-model="queryParams.breedId" placeholder="请选择农作物" clearable>
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="品种名称" prop="cropName">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.cropName"-->
      <!--          placeholder="请输入品种名称"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="病虫害种类" prop="diseaseType">
        <!--        <el-input-->
        <!--          v-model="queryParams.diseaseType"-->
        <!--          placeholder="请输入病虫害种类"-->
        <!--          clearable-->
        <!--          @keyup.enter="handleQuery"-->
        <!--        />-->
        <el-select v-model="queryParams.diseaseType" clearable placeholder="请选择病虫害种类">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_DISEASE_NAME)"
            :key="dict.label"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="病害虫Id" prop="diseaseId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.diseaseId"-->
      <!--          placeholder="请输入病害虫Id"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="阈值下限" prop="warnLowValue">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.warnLowValue"-->
      <!--          placeholder="请输入阈值下限"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="阈值上限" prop="warnHighValue">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.warnHighValue"-->
      <!--          placeholder="请输入阈值上限"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="单位" prop="warnUnit">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.warnUnit"-->
      <!--          placeholder="请输入单位"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预警信息" prop="lowMsg">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.lowMsg"-->
      <!--          placeholder="请输入预警信息"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="监测周期" prop="monitorPeriod">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.monitorPeriod"-->
      <!--          placeholder="请输入监测周期"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="病虫害等级" prop="reservedOne">
        <el-input
          v-model="queryParams.reservedOne"
          placeholder="请输入病虫害等级"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="预留2" prop="reservedTwo">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.reservedTwo"-->
      <!--          placeholder="请输入预留2"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留3" prop="reservedThree">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.reservedThree"-->
      <!--          placeholder="请输入预留3"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留4" prop="reservedFour">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.reservedFour"-->
      <!--          placeholder="请输入预留4"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留5" prop="reservedFive">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.reservedFive"-->
      <!--          placeholder="请输入预留5"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
    </el-form>

    <div class="w-full mt-[8px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <!-- todo复制列表，没什么要改订单 -->
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <!--      <el-table-column label="主键" align="center" prop="id"/>-->
        <el-table-column label="农作物" align="center" prop="breedId" />
        <el-table-column label="病虫害种类" align="center" prop="diseaseType" />
        <el-table-column label="监测周期" align="center" prop="monitorPeriod" />
        <el-table-column label="阈值下限" align="center" prop="warnLowValue" />
        <el-table-column label="阈值上限" align="center" prop="warnHighValue" />
        <el-table-column label="单位" align="center" prop="warnUnit" />
        <el-table-column label="病虫害等级" align="center" prop="reservedOne" />
        <el-table-column label="预警信息" align="center" prop="lowMsg" />
        <!--      <el-table-column label="品种名称" align="center" prop="cropName"/>-->
        <!--      <el-table-column label="病虫害Id" align="center" prop="diseaseId"/>-->
        <!--      <el-table-column label="监测类型" align="center" prop="warnType"/>-->
        <!--      <el-table-column label="预留3" align="center" prop="reservedThree"/>-->
        <!--      <el-table-column label="预留4" align="center" prop="reservedFour"/>-->
        <!--      <el-table-column label="预留5" align="center" prop="reservedFive"/>-->
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <!-- todo操作按钮 -->
            <!-- 1.  <template #default="scope"> 中，加入
                <div class="flex items-center justify-center">
                  其中放入编辑，删除按钮等，每一个按钮中完成后加入
                    <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
                  这段代码
                </div>
              -->
            <div class="flex items-center justify-center">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:disease-threshold-rule:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:disease-threshold-rule:delete']"
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
  <!-- 表单弹窗-->
  <DiseaseThresholdRuleForm ref="formRef" @success="getList" />
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
