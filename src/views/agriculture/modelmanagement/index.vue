<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">模型管理</h1>
        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
        <!-- 一级标题旁边的按钮 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agri:crop-growth-new:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>
      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button-group class="ml-4">
          <el-button
            :type="showType === 'list' ? 'primary' : ''"
            :icon="List"
            @click="showType = 'list'"
          />
          <el-button
            :type="showType === 'card' ? 'primary' : ''"
            :icon="Menu"
            @click="showType = 'card'"
          />
        </el-button-group>
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
      <el-form-item label="模型名称" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="品种" prop="belongVarietyId">
        <el-select
          v-model="queryParams.belongVarietyId"
          placeholder="请选择"
          clearable
          @change="handleVarietyChange"
        >
          <el-option
            v-for="dict in listVarietyManagement"
            :key="dict.id"
            :label="dict.varietyName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品类" prop="belongCategoryId">
        <el-select v-model="queryParams.belongCategoryId" placeholder="请选择" clearable>
          <el-option
            v-for="dict in listCategoryManagement"
            :key="dict.id"
            :label="dict.categoryName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 列表 -->

    <div>
      <div class="flex justify-center">
        <div
          v-if="showType === 'card'"
          class="container mt-3 mb-3 grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <div v-for="(item, index) in list" :key="index" class="p-5 bg-[#f5f5f5]">
            <div class="flex justify-center items-center flex-row">
              <div class="pr-2">
                <img
                  :src="item.modelImageId"
                  style="width: 100px; height: 85px; object-fit: contain"
                />
              </div>
              <div class="w-full pl-2">
                <div style="font-size: 18px; margin-bottom: 15px">{{ item.modelName }}</div>
                <div style="font-size: 14px; margin-bottom: 5px">品类：{{ item.categoryName }}</div>
                <div style="font-size: 14px; margin-bottom: 5px">品种：{{ item.varietyName }}</div>
              </div>
            </div>
            <div class="mt-15px grid grid-cols-4">
              <el-button
                style="font-size: 12px"
                type="primary"
                @click="
                  router.push(
                    `/growth_monitor/model-monitor-indicator?modelId=${item.id}&belongVarietyId=${item.belongVarietyId}`
                  )
                "
              >
                监测指标
              </el-button>
              <el-button
                style="font-size: 12px"
                @click="openForm('detail', item.id)"
                v-hasPermi="['agriculture:model-management:update']"
              >
                详情
              </el-button>
              <el-button
                style="font-size: 12px"
                @click="openForm('update', item.id)"
                v-hasPermi="['agriculture:model-management:update']"
              >
                编辑
              </el-button>
              <el-button
                style="font-size: 12px"
                @click="handleDelete(item.id)"
                v-hasPermi="['agriculture:model-management:delete']"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mt-[15px]"></div>
      <el-table
        v-if="showType === 'list'"
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <!--      <el-table-column label="主键（模型编码）" align="center" prop="id" />-->
        <el-table-column label="模型名称" align="center" prop="modelName" />
        <el-table-column label="模型类型" align="center" prop="modelType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.GROWTH_MODEL_TYPE" :value="scope.row.modelType" />
          </template>
        </el-table-column>
        <el-table-column label="关联品种" align="center" prop="varietyName" />
        <el-table-column label="关联品类" align="center" prop="categoryName" />
        <!--      <el-table-column label="关联品类" align="center" prop="belongCategory" />-->
        <!--      <el-table-column label="关联品种" align="center" prop="belongVariety" />-->
        <el-table-column label="模型图片" align="center" prop="modelImageId">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.modelImageId"
              :preview-src-list="[row.modelImageId]"
              preview-teleported
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column label="模型文件" align="center" prop="modelFileId" />
        <el-table-column label="启用状态" align="center" key="enabledStatus">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabledStatus"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description" width="240" />
        <el-table-column label="操作" align="center" fixed="right" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="
                router.push(
                  `/growth_monitor/model-monitor-indicator?modelId=${scope.row.id}&belongVarietyId=${scope.row.belongVarietyId}`
                )
              "
            >
              监测指标
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('detail', scope.row.id)"
              v-hasPermi="['agriculture:model-management:update']"
            >
              详情
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agriculture:model-management:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:model-management:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        style="margin-bottom: 0; margin-top: 8px"
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </el-scrollbar>
  <!-- 表单弹窗：添加/修改 -->
  <ModelManagementForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download';
import { ModelManagementApi, ModelManagementVO } from '@/api/agriculture/modelmanagement';
import ModelManagementForm from './ModelManagementForm.vue';
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict';
import { CommonStatusEnum } from '@/utils/constants';
import { allDataCacheManager, VarietyManagementVO } from '@/api/agriculture/varietymanagement';
import { CategoryManagementApi, CategoryManagementVO } from '@/api/agriculture/categorymanagement';
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue';
import { List, Menu, VideoCameraFilled } from '@element-plus/icons-vue';

/** 模型管理 列表 */
defineOptions({ name: 'ModelManagement' });

const listVarietyManagement = ref<VarietyManagementVO[]>([]); // 品种列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const getTypeData = async () => {
  const res = await allDataCacheManager.getData({});
  if (Array.isArray(res)) listVarietyManagement.value = res;
  const res1 = await CategoryManagementApi.getAllCategoryManagement({});
  if (Array.isArray(res1)) listCategoryManagement.value = res1;
};

const router = useRouter();
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<ModelManagementVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const showType = ref('card'); //布局切换类型
const topMenuHeight = 85;
const contentPadding = 8;
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  modelName: undefined,
  modelType: undefined,
  belongCategoryId: undefined,
  belongCategory: undefined,
  belongVarietyId: undefined,
  belongVariety: undefined,
  modelImageId: undefined,
  modelFileId: undefined,
  enabledStatus: undefined,
  description: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

const handleVarietyChange = (e) => {
  const _item = listVarietyManagement.value.find((item) => item.id === e);
  if (_item) queryParams.belongCategoryId = _item.categoryId;
};
// 展开或收起搜索栏
const showSearch = ref(false);
const handleClickShowSearch = () => {
  showSearch.value = !showSearch.value;
};
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ModelManagementApi.getModelManagementPage(queryParams);
    list.value = data.list.map((item) => {
      const element = listVarietyManagement.value.find((ele) => ele.id === item.belongVarietyId);
      if (!element) return item;
      return {
        ...item,
        varietyName: element.varietyName,
        categoryName: element.categoryName
      };
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
    await ModelManagementApi.deleteModelManagement(id);
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
    const data = await ModelManagementApi.exportModelManagement(queryParams);
    download.excel(data, '模型管理.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 修改启用状态 */
const handleStatusChange = async (row: ModelManagementApi.ModelManagementVO) => {
  try {
    // 修改状态的二次确认
    const text = row.enabledStatus === CommonStatusEnum.ENABLE ? '启用' : '停用';
    await message.confirm('确认要' + text + '当前模型吗?');
    // 发起修改状态
    await ModelManagementApi.updateModelManagementStatus(row.id, row.enabledStatus);
    // 刷新列表
    await getList();
  } catch {
    // 取消后，进行恢复按钮
    row.enabledStatus =
      row.enabledStatus === CommonStatusEnum.ENABLE
        ? CommonStatusEnum.DISABLE
        : CommonStatusEnum.ENABLE;
  }
};

const init = async () => {
  await getTypeData();
  await getList();
};

/** 初始化 **/
onMounted(() => {
  init();
});
</script>
<style scoped lang="scss">
.tab-btn,
.tab-btn-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 5rem;
  height: 1.5rem;
}

.tab-btn {
  border: 1px solid #e6e6e6;
  color: #666666;
  background-color: #ffffff;
}

.tab-btn-selected {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}

.changeBtnColor:hover,
.changeBtnColor:focus {
  color: #ffffff;
  background: #009688;
}

// @media screen and (min-width: 1680px) {
//   .changecols {
//     grid-template-columns: repeat(5, minmax(0, 1fr));
//   }
// }

// @media screen and (min-width: 1920px) {
//   .changecols {
//     grid-template-columns: repeat(7, minmax(0, 1fr));
//   }
// }
@for $i from 1 through 10 {
  @media screen and (min-width: calc(320px + calc(#{$i} * 300px))) {
    .changecols {
      grid-template-columns: repeat(#{$i}, 1fr);
    }
  }
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
.el-form-item--small {
  --font-size: 12px;
  --el-form-label-font-size: var(--font-size);
  margin-bottom: 0px;
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
