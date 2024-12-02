<script setup lang="ts">
/* 原页面的js代码复制在下面 包括import */
import { dateFormatter2 } from '@/utils/formatTime';
import download from '@/utils/download';
import { ProductApi, ProductVO } from '@/api/erp/product/product';
import { ProductCategoryApi, ProductCategoryVO } from '@/api/erp/product/category';
import ProductForm from './ProductForm.vue';
import { defaultProps, handleTree } from '@/utils/tree';
import { erpPriceTableColumnFormatter } from '@/utils';
import ProductImportForm from '@/views/erp/product/productInfo/ProductImportForm.vue';
import IntroduceAlert from '@/components/IntroduceAlert/index.vue';

/** ERP 产品列表 */
defineOptions({ name: 'ErpProduct' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<ProductVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  categoryId: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const categoryList = ref<ProductCategoryVO[]>([]); // 产品分类列表

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ProductApi.getProductPage(queryParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  // 如果产品分类为空，则设置查询参数
  console.log('queryParams.categoryId', queryParams.categoryId);
  if (!queryParams.categoryId || queryParams.categoryId.length === 0) {
    queryParams.categoryId = agriCategoryData.map((item) => item.id);
  }
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  // 如果产品分类不为空，则设置查询参数
  if (agriCategoryData.length > 0) {
    queryParams.categoryId = agriCategoryData.map((item) => item.id);
  }
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
    await ProductApi.deleteProduct(id);
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
    const data = await ProductApi.exportProduct(queryParams);
    download.excel(data, '产品.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 导入 */
const importFormRef = ref();
const handleCraftImport = () => {
  importFormRef.value.open();
};

let agriCategoryData = [];
const initCategoryData = (categoryData) => {
  const originCategoryData = [...categoryData];
  let ids = categoryData.map((item) => item.id);
  // 获取农资分类
  categoryData.forEach((item) => {
    if (item.name.includes('农资')) {
      ids.push(item.id);
      agriCategoryData = [
        ...agriCategoryData,
        ...categoryData.filter((i) => {
          ids.push(i.id);
          return item.id === i.parentId;
        }),
        item
      ];
      categoryData = categoryData.filter((i2) => !ids.includes(i2.id));
    }
  });
  // 如果产品分类为空，则设置查询参数为全部
  if (!agriCategoryData || agriCategoryData.length === 0) {
    agriCategoryData = originCategoryData;
  }
};

/** 初始化 **/
onMounted(async () => {
  // 产品分类
  let categoryData = await ProductCategoryApi.getProductCategorySimpleList();

  // 筛选分类中产品类别为“投入品”的
  categoryData = categoryData.filter((item) => item.productCategory === '投入品');
  initCategoryData(categoryData);
  categoryList.value = handleTree(agriCategoryData, 'id', 'parentId');

  await resetQuery();
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

<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">投入品管理</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!--
          一级标题旁边的按钮
          主按钮 type="primary" 次按钮不设置 type 属性 不设置 plain 属性
        -->
        <el-button type="primary" @click="openForm('create')" v-hasPermi="['erp:product:create']">
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button type="info" plain @click="handleCraftImport()">
          <Icon icon="ep:upload" class="mr-5px" />
          导入
        </el-button>
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <el-button type="primary" @click="handleQuery">
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
          v-hasPermi="['erp:product:export']"
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
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!--
        原来的表单里的内容复制过来 不要操作按钮
        去掉每项的固定宽度 比如 !w-240px !w-220px
        如果 输入框内 有按钮 则只保留图标 不要文字
      -->
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-tree-select
          v-model="queryParams.categoryId"
          :data="categoryList"
          :props="defaultProps"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          check-strictly
          default-expand-all
          placeholder="请输入分类"
        />
      </el-form-item>
    </el-form>

    <!-- 如果有 6.1.2的部分 则这里是mt-[8px] -->
    <div class="w-full mt-[16px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="条码" align="center" prop="barCode" width="160" />
        <el-table-column label="名称" align="center" prop="name" width="160" />
        <el-table-column label="分类" align="center" prop="categoryName" width="130" />
        <el-table-column label="单位" align="center" prop="unitName" width="80" />
        <el-table-column label="规格" align="center" prop="standard" width="100" />
        <el-table-column label="图片" align="center" prop="imgId">
          <template #default="{ row }">
            <el-image
              v-if="row.img != null && row.img != ''"
              class="h-50px w-50px"
              lazy
              :src="row.img"
              :preview-src-list="[row.img]"
              preview-teleported
              fit="cover"
            />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column
          label="采购价格"
          align="center"
          prop="purchasePrice"
          width="120"
          :formatter="erpPriceTableColumnFormatter"
        />
        <el-table-column
          label="销售价格"
          align="center"
          prop="salePrice"
          width="120"
          :formatter="erpPriceTableColumnFormatter"
        />
        <el-table-column
          label="最低价格"
          align="center"
          prop="minPrice"
          width="120"
          :formatter="erpPriceTableColumnFormatter"
        />
        <!--      <el-table-column label="状态" align="center" prop="status" width="150">-->
        <!--        <template #default="scope">-->
        <!--          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />-->
        <!--        </template>-->
        <!--      </el-table-column>-->
        <el-table-column
          label="生产日期"
          align="center"
          prop="produceDate"
          :formatter="dateFormatter2"
          width="140"
        />
        <el-table-column label="保质期天数" align="center" prop="expiryDay" width="100" />
        <el-table-column
          label="有效日期"
          align="center"
          prop="effectiveTime"
          :formatter="dateFormatter2"
          width="140"
        />
        <el-table-column label="登记证号" align="center" prop="registerNum" width="100" />
        <el-table-column label="包装关系" align="center" prop="packagingRelationship" width="100" />
        <el-table-column label="认证状态" align="center" prop="certifyStatus" width="100" />
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <!-- 按钮 -->
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['erp:product:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['erp:product:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 页码组件 注意绑定的值和事件函数 -->
    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>

  <!-- 页面使用的组件复制在下面 -->

  <!-- 表单弹窗：添加/修改 -->
  <ProductForm ref="formRef" @success="getList" />

  <!-- 批量导入-->
  <ProductImportForm ref="importFormRef" @success="getList" />
</template>

<style lang="scss" scoped>
// 原页面样式复制在下面

// 原页面样式复制在上面

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
