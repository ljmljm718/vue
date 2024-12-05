<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">指标要素范围</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
      </div>

      <div class="flex items-center">
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
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

    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="健康等级" prop="healthLevel">
        <el-select
          v-model="queryParams.healthLevel"
          placeholder="请选择健康等级"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_HEALTH_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="w-full mt-[16px]">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="指标要素" align="center" prop="indicatorElementId" width="240" />
        <el-table-column label="指标范围" align="center" width="240">
          <template #default="scope">
            {{
              scope.row.lowLimit +
              '  ~  ' +
              scope.row.highLimit +
              '  ' +
              (!scope.row.unit ? '' : scope.row.unit)
            }}
          </template>
        </el-table-column>
        <el-table-column label="健康值" align="center" prop="healthRatio" />
        <el-table-column label="健康等级" align="center" prop="healthLevel">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.AGRI_HEALTH_LEVEL" :value="scope.row.healthLevel" />
          </template>
        </el-table-column>
        <el-table-column label="指标结果" align="center" prop="indicatorResult" width="240" />
        <el-table-column label="排序" align="center" prop="sortBy" />
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:model-indicator-element-range:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:model-indicator-element-range:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>

  <!-- 表单弹窗：添加/修改 -->
  <ModelIndicatorElementRangeForm ref="formRef" @success="getList" />

  <!--  选择指标要素-->
  <ModelIndicatorElementSelectPopup
    ref="modelIndicatorElementSelectPopupRef"
    @success="handleModelIndicatorElementSelectPopupChange"
  />
</template>

<script setup lang="ts">
import download from '@/utils/download';
import {
  ModelIndicatorElementRangeApi,
  ModelIndicatorElementRangeVO
} from '@/api/agriculture/modelindicatorelementrange';
import ModelIndicatorElementRangeForm from './ModelIndicatorElementRangeForm.vue';
import { ModelIndicatorElementVO } from '@/api/agriculture/modelindicatorelement';
import ModelIndicatorElementSelectPopup from '@/views/agriculture/modelindicatorelement/components/ModelIndicatorElementSelectPopup.vue';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';
import { ElTable } from 'element-plus';

/** 指标要素范围 列表 */
defineOptions({ name: 'ModelIndicatorElementRange' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<ModelIndicatorElementRangeVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  indicatorElementId: undefined,
  lowLimit: undefined,
  highLimit: undefined,
  unit: undefined,
  healthRatio: undefined,
  healthLevel: undefined,
  indicatorResult: undefined,
  sortBy: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

const route = useRoute();
onMounted(() => {
  if (route.query) queryParams.indicatorElementId = route.query.indicatorElementId;
});

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ModelIndicatorElementRangeApi.getModelIndicatorElementRangePage(queryParams);
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
  // queryParams.indicatorElementId = undefined
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
    await ModelIndicatorElementRangeApi.deleteModelIndicatorElementRange(id);
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
    const data = await ModelIndicatorElementRangeApi.exportModelIndicatorElementRange(queryParams);
    download.excel(data, '指标要素范围.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

//指标要素的选择
const modelIndicatorElementSelectPopupRef = ref();
const openModelIndicatorElementSelectPopup = (id: string) => {
  modelIndicatorElementSelectPopupRef.value.open(id);
};
const handleModelIndicatorElementSelectPopupChange = (order: ModelIndicatorElementVO) => {
  queryParams.indicatorElementId = order[0].id?.toString();
};

/** 初始化 **/
onMounted(() => {
  getList();
});

/* 原页面的js代码复制在上面 包括import */

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

<style lang="scss" scoped>
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
