<!-- ERP 产品列表 -->
<template>
  <!--  -->
  <introduce-alert
    title="展示农资的投入品的基础信息，【产品分类】中属于【农资】的相关数据会展示在此页面"
  />
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['erp:product:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" />
            新增
          </el-button>
          <el-button type="info" plain @click="handleCraftImport()">
            <Icon icon="ep:upload" class="mr-5px" />
            导入
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['erp:product:export']"
          >
            <Icon icon="ep:download" class="mr-5px" />
            导出
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
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
      <el-table-column label="操作" align="center" width="110" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['erp:product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['erp:product:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProductForm ref="formRef" @success="getList" />

  <!-- 批量导入-->
  <ProductImportForm ref="importFormRef" @success="getList" />
</template>

<script setup lang="ts">
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
</script>
