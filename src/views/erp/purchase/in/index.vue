<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">采购入库</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!-- 一级标题旁边的按钮 -->
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
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <el-form-item label="入库单号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入入库单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品" prop="productId">
        <el-select v-model="queryParams.productId" clearable filterable placeholder="请选择产品">
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间" prop="inTime">
        <el-date-picker
          v-model="queryParams.inTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model="queryParams.supplierId"
          clearable
          filterable
          placeholder="请选择供供应商"
        >
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="仓库" prop="warehouseId">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.warehouseId"-->
      <!--          clearable-->
      <!--          filterable-->
      <!--          placeholder="请选择仓库"-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="item in warehouseList"-->
      <!--            :key="item.id"-->
      <!--            :label="item.name"-->
      <!--            :value="item.id"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="创建人" prop="creator">
        <el-select v-model="queryParams.creator" clearable filterable placeholder="请选择创建人">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="关联订单" prop="orderNo">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.orderNo"-->
      <!--          placeholder="请输入关联订单"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="结算账户" prop="accountId">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.accountId"-->
      <!--          clearable-->
      <!--          filterable-->
      <!--          placeholder="请选择结算账户"-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="item in accountList"-->
      <!--            :key="item.id"-->
      <!--            :label="item.name"-->
      <!--            :value="item.id"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="付款状态" prop="paymentStatus">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.paymentStatus"-->
      <!--          placeholder="请选择有款状态"-->
      <!--          clearable-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option label="未付款" value="0" />-->
      <!--          <el-option label="部分付款" value="1" />-->
      <!--          <el-option label="全部付款" value="2" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="备注" prop="remark">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.remark"-->
      <!--          placeholder="请输入备注"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
    </el-form>
    <div class="flex justify-between mt-[16px]">
      <div class="space-x-[8px]">
        <!-- 左侧的按钮写在下面 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['erp:purchase-in:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['erp:purchase-in:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" />
          删除
        </el-button>
      </div>
      <div class="space-x-[8px]">
        <!-- 右侧的按钮写在这 -->
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['erp:purchase-in:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
      </div>
    </div>

    <div class="w-full mt-[8px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column min-width="180" label="入库单号" align="center" prop="no" />
        <el-table-column label="产品信息" align="center" prop="productNames" min-width="200" />
        <el-table-column label="供应商" align="center" prop="supplierName" />
        <el-table-column
          label="入库时间"
          align="center"
          prop="inTime"
          :formatter="dateFormatter2"
          width="120px"
        />
        <el-table-column label="创建人" align="center" prop="creatorName" />
        <el-table-column
          label="总数量"
          align="center"
          prop="totalCount"
          :formatter="erpCountTableColumnFormatter"
        />
        <el-table-column
          label="应付金额"
          align="center"
          prop="totalPrice"
          :formatter="erpPriceTableColumnFormatter"
        />
        <el-table-column
          label="已付金额"
          align="center"
          prop="paymentPrice"
          :formatter="erpPriceTableColumnFormatter"
        />
        <el-table-column label="未付金额" align="center">
          <template #default="scope">
            <span v-if="scope.row.paymentPrice === scope.row.totalPrice">0</span>
            <el-tag type="danger" v-else>
              {{ erpPriceInputFormatter(scope.row.totalPrice - scope.row.paymentPrice) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" fixed="right" width="90" prop="status">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ERP_AUDIT_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                link
                @click="openForm('detail', scope.row.id)"
                v-hasPermi="['erp:purchase-in:query']"
              >
                详情
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['erp:purchase-in:update']"
                :disabled="scope.row.status === 20"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-popover :width="104" trigger="hover" popper-style="min-width: 0">
                <template #reference>
                  <div class="flex items-center">
                    <div
                      class="w-[2px] h-[2px] mx-[1px] rounded-full"
                      style="background-color: var(--el-color-primary)"
                    ></div>
                    <div
                      class="w-[2px] h-[2px] mx-[1px] rounded-full"
                      style="background-color: var(--el-color-primary)"
                    ></div>
                    <div
                      class="w-[2px] h-[2px] mx-[1px] rounded-full"
                      style="background-color: var(--el-color-primary)"
                    ></div>
                  </div>
                </template>

                <div class="flex flex-col items-start space-y-[8px] space-x-0">
                  <el-button
                    link
                    type="primary"
                    @click="handleUpdateStatus(scope.row.id, 20)"
                    v-hasPermi="['erp:purchase-in:update-status']"
                    :disabled="scope.row.status === 20"
                  >
                    审批
                  </el-button>
                  <!--          <el-button-->
                  <!--            link-->
                  <!--            type="danger"-->
                  <!--            @click="handleUpdateStatus(scope.row.id, 10)"-->
                  <!--            v-hasPermi="['erp:purchase-in:update-status']"-->
                  <!--            v-else-->
                  <!--          >-->
                  <!--            反审批-->
                  <!--          </el-button>-->
                  <el-button
                    link
                    type="danger"
                    @click="handleDelete([scope.row.id])"
                    v-hasPermi="['erp:purchase-in:delete']"
                  >
                    删除
                  </el-button>
                </div>
              </el-popover>
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

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseInForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter2 } from '@/utils/formatTime';
import download from '@/utils/download';
import { PurchaseInApi, PurchaseInVO } from '@/api/erp/purchase/in';
import PurchaseInForm from './PurchaseInForm.vue';
import { ProductApi, ProductVO } from '@/api/erp/product/product';
import { UserVO } from '@/api/system/user';
import * as UserApi from '@/api/system/user';
import {
  erpCountTableColumnFormatter,
  erpPriceInputFormatter,
  erpPriceTableColumnFormatter
} from '@/utils';
import { WarehouseApi, WarehouseVO } from '@/api/erp/stock/warehouse';
import { AccountApi, AccountVO } from '@/api/erp/finance/account';
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier';

/** ERP 销售入库列表 */
defineOptions({ name: 'ErpPurchaseIn' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<PurchaseInVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  supplierId: undefined,
  productId: undefined,
  warehouseId: undefined,
  inTime: [],
  orderNo: undefined,
  paymentStatus: undefined,
  accountId: undefined,
  status: undefined,
  remark: undefined,
  creator: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const productList = ref<ProductVO[]>([]); // 产品列表
const supplierList = ref<SupplierVO[]>([]); // 供应商列表
const userList = ref<UserVO[]>([]); // 用户列表
const warehouseList = ref<WarehouseVO[]>([]); // 仓库列表
const accountList = ref<AccountVO[]>([]); // 账户列表

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await PurchaseInApi.getPurchaseInPage(queryParams);
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
const handleDelete = async (ids: number[]) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await PurchaseInApi.deletePurchaseIn(ids);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id));
  } catch {}
};

/** 审批/反审批操作 */
const handleUpdateStatus = async (id: number, status: number) => {
  try {
    // 审批的二次确认
    await message.confirm(`确定${status === 20 ? '审批' : '反审批'}该入库吗？`);
    // 发起审批
    await PurchaseInApi.updatePurchaseInStatus(id, status);
    message.success(`${status === 20 ? '审批' : '反审批'}成功`);
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
    const data = await PurchaseInApi.exportPurchaseIn(queryParams);
    download.excel(data, '销售入库.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 选中操作 */
const selectionList = ref<PurchaseInVO[]>([]);
const handleSelectionChange = (rows: PurchaseInVO[]) => {
  selectionList.value = rows;
};

/** 初始化 **/
onMounted(async () => {
  await getList();
  // 加载产品、仓库列表、供应商
  productList.value = await ProductApi.getProductSimpleList();
  supplierList.value = await SupplierApi.getSupplierSimpleList();
  userList.value = await UserApi.getSimpleUserList();
  warehouseList.value = await WarehouseApi.getWarehouseSimpleList();
  accountList.value = await AccountApi.getAccountSimpleList();
});
// TODO 芋艿：可优化功能：列表界面，支持导入
// TODO 芋艿：可优化功能：详情界面，支持打印
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
