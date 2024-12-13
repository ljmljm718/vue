<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">产品品牌</h1>
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
        <el-button @click="handleExport">
          <Icon icon="ep:download" class="mr-5px" />
          导出
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
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
   
        <el-form-item label="品牌名" prop="productBrand">
          <el-input
            v-model="queryParams.productBrand"
            placeholder="请输入品牌名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
    </el-form>
     

    <!-- 列表 -->
    <div>
      <div class="w-full mt-[15px]"></div>
      <el-table
        v-if="showType === 'list'"
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="品牌名" align="center" prop="productBrand" />
        <el-table-column label="品类" align="center" prop="belongCategory" width="120" />
        <el-table-column label="品种" align="center" prop="belongVariety" width="120" />
        <el-table-column label="品牌logos" align="center" prop="brandLogo">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              :src="row.brandLogo"
              :preview-src-list="[row.brandLogo]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌介绍" align="center" prop="brandDetail" />
        <el-table-column label="使用状态" align="center" prop="usedStatus" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.usedStatus"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!--      <el-table-column label="备注" align="center" prop="remark" />-->
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agriculture:product-brand:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:product-brand:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="showType === 'card' && list.length < 1"
        class="flex w-full justify-center items-center text-[13px] pt-2"
      >
        暂无数据
      </div>
      <div class="flex justify-center">
        <div
          v-if="showType === 'card'"
          class="container mt-3 mb-3 grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <div v-for="item in list" :key="item.id" class="bg-[#f5f5f5] p-2">
            <div class="flex flex-row justify-center items-center h-[150px] p-2">
              <div class="p-2">
                <img :src="item.brandLogo" class="w-[100px] h-full object-contain" />
              </div>
              <div class="p-2 w-full">
                <div class="text-18px p-1.5">{{ item.productBrand }}</div>
                <div class="text-14px p-1.5 pt-3">{{ item.belongCategory }}</div>
                <div class="pt-3">
                  <span class="text-14px p-1.5">
                    {{ item.usedStatus === 0 ? '已启用' : '已禁用' }}
                  </span>
                  <el-switch
                    v-model="item.usedStatus"
                    :active-value="0"
                    :inactive-value="1"
                    @change="handleStatusChange1(item)"
                  />
                </div>
                <div
                  style="display: flex; margin-left: auto; justify-content: flex-end"
                  class="pt-2.5 pb-1"
                >
                  <el-button
                    type="primary"
                    @click="openForm('update', item.id)"
                    v-hasPermi="['agriculture:product-brand:update']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    @click="handleDelete(item.id)"
                    v-hasPermi="['agriculture:product-brand:delete']"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </el-scrollbar>
  <!-- 表单弹窗：添加/修改 -->
  <ProductBrandForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { ProductBrandApi, ProductBrandVO } from '@/api/agriculture/productbrand';
import ProductBrandForm from './ProductBrandForm.vue';
import { CommonStatusEnum } from '@/utils/constants';
import { allDataCacheManager, VarietyManagementVO } from '@/api/agriculture/varietymanagement';
import { CategoryManagementApi, CategoryManagementVO } from '@/api/agriculture/categorymanagement';
import { List, Menu, VideoCameraFilled } from '@element-plus/icons-vue';

/** 产品品牌 列表 */
defineOptions({ name: 'ProductBrand' });
const showType = ref('card') //布局切换类型
const topMenuHeight = 85;
const contentPadding = 8;
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化
const selectType = ref('card'); //列表卡片切换
const loading = ref(true); // 列表的加载中
const list = ref<ProductBrandVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  productBrand: undefined,
  belongCategoryId: undefined,
  belongCategory: undefined,
  belongVarietyId: undefined,
  belongVariety: undefined,
  brandLogo: undefined,
  brandDetail: undefined,
  usedStatus: undefined,
  remark: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

const listVarietyManagement = ref<VarietyManagementVO[]>([]); // 品种列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const getTypeData = async () => {
  const res = await allDataCacheManager.getData({});
  if (Array.isArray(res)) listVarietyManagement.value = res;
  const res1 = await CategoryManagementApi.getAllCategoryManagement({});
  if (Array.isArray(res1)) listCategoryManagement.value = res1;
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
    const data = await ProductBrandApi.getProductBrandPage(queryParams);
    list.value = data.list.map((item) => {
      const element = listVarietyManagement.value.find((ele) => ele.id === item.belongVarietyId);
      if (!element) return item;
      return {
        ...item,
        belongVariety: element.varietyName,
        belongCategory: element.categoryName
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
const openForm = (type: string, id?: any) => {
  formRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: any) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await ProductBrandApi.deleteProductBrand(id);
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
    const data = await ProductBrandApi.exportProductBrand(queryParams);
    download.excel(data, '产品品牌.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 修改使用状态 */
const handleStatusChange = async (row: ProductBrandApi.ProductBrandVO) => {
  try {
    // 修改状态的二次确认
    const text = row.usedStatus === CommonStatusEnum.ENABLE ? '启用' : '禁用';
    await message.confirm('确认要' + text + '当前产品品牌吗?');
    // 发起修改状态
    await ProductBrandApi.updateProductBrandStatus(row.id, row.usedStatus);
    // 刷新列表
    await getList();
  } catch {
    // 取消后，进行恢复按钮
    row.usedStatus =
      row.usedStatus === CommonStatusEnum.ENABLE
        ? CommonStatusEnum.DISABLE
        : CommonStatusEnum.ENABLE;
  }
};

const init = async () => {
  await getTypeData();
  await getList();
};
const handleStatusChange1 = async (item) => {
  try {
    // 修改状态的二次确认
    const text = item.usedStatus === CommonStatusEnum.ENABLE ? '启用' : '禁用';
    await message.confirm('确认要' + text + '当前产品品牌吗?');
    // 发起修改状态
    await ProductBrandApi.updateProductBrandStatus(item.id, item.usedStatus);
    // 刷新列表
    await getList();
  } catch {
    // 取消后，进行恢复按钮
    item.usedStatus =
      item.usedStatus === CommonStatusEnum.ENABLE
        ? CommonStatusEnum.DISABLE
        : CommonStatusEnum.ENABLE;
  }
};
/** 初始化 **/
onMounted(() => {
  init();
});
</script>
<style scoped lang="scss">
.tab-btn-select,
.tab-btn {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: row;
  width: 6rem;
  height: 1.5rem;
  align-items: center;
}
.tab-btn {
  border: 1px solid #e6e6e6;
  color: #666666;
  background-color: #ffffff;
}
.tab-btn-select {
  border: 1px solid var(--el-color-primary);
  background-color: #e5f4f3;
  color: var(--el-color-primary);
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
.rotate180andthemeBg {
  animation-duration: 0.5s;
  animation-name: rotate180andthemeBg;
  animation-fill-mode: forwards;
}
// @for $i from 1 through 10 {
//   @media screen and (min-width: calc(400px + calc(#{$i} * 300px))) {
//     .changecols {
//       grid-template-columns: repeat(#{$i}, 1fr);
//     }
//   }
// }
</style>
