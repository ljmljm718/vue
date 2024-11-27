<script setup lang="ts">
/* 原页面的js代码复制在下面 包括import */
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { HarvestManagementApi, HarvestManagementVO } from '@/api/agriculture/harvestmanagement';
import HarvestManagementForm from './HarvestManagementForm.vue';

import VillageProductForm from '@/views/digital/villageproduct/VillageProductForm.vue';
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { DrawerProps } from 'element-plus';
import { FarmRecordApi, FarmRecordVO } from '@/api/agriculture/farmrecord';
import { formatTime } from '@/utils';
import {
  VillageProcessingRecordsApi,
  VillageProcessingRecordsVO
} from '@/api/digital/villageprocessingrecords';
import { getTenantId } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { allDataCacheManager, VarietyManagementVO } from '@/api/agriculture/varietymanagement';
import { CategoryManagementApi, CategoryManagementVO } from '@/api/agriculture/categorymanagement';
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue';
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue';
import { ParkDetailVO } from '@/api/agriculture/parkdetail';
import { ParkInfoVO } from '@/api/agriculture/parkinfo';
import { page, parkPage } from '@/views/agriculture/IntelligentStatistics/api.ts';

/** 采收管理 列表 */
defineOptions({ name: 'HarvestManagement' });
const drawer2 = ref(false);
const direction = ref<DrawerProps['direction']>('rtl');
const formData = ref<VillageProcessingRecordsVO[]>([]);
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<HarvestManagementVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  recordNum: undefined,
  upTime: [],
  belongPark: undefined,
  belongPlot: undefined,
  harvestVolume: undefined,
  laborQuantity: undefined,
  remark: undefined,
  createTime: [],
  varietyName: undefined, // 品种名称
  variety: undefined, // 品种
  varietyId: undefined, // 品种ID
  batchCode: undefined, // 批次码
  belongParkId: undefined, // 基地ID
  belongPlotId: undefined, // 地块ID
  varietyCode: undefined,
  harvestNum: undefined
});
const queryParam = reactive({
  pageNo: 1,
  pageSize: 10,
  recoveryNum: undefined,
  machiningTime: [],
  product: undefined,
  batchCode: undefined,
  createTime: [],
  remark: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const show = ref();
const userStore = useUserStore();
const userName = computed(() => userStore.user.deptId ?? '0');

function cancelClick() {
  drawer2.value = false;
}

const handleVarietyChange = (e) => {
  const _item = listVarietyManagement.value.find((item) => item.id === e);
  if (_item) queryParams.variety = _item.categoryId;
};
const damn = async (row) => {
  queryParam.recoveryNum = row.id;
  const data = await VillageProcessingRecordsApi.getVillageProcessingRecordsPage(queryParam);
  data.list.forEach((item) => {
    // item.farmDefineType = item.farmDefineType ? parseInt(item.farmDefineType) : ""
  });
  formData.value = data.list;
  drawer2.value = true;
};
//获取基地
const baseList = ref([]);
const getPage = async () => {
  let res = await page();
  baseList.value = res.list;
  // queryParams.belongPark = res.list[0].id
  getParkPage({ parkId: res.list.id });
};
getPage();
//获取地块
const plotList = ref([]);

const getParkPage = async (parkId) => {
  let res = await parkPage(parkId);
  plotList.value = res.list;
  // queryParams.belongPlot = res.list[0].id
};

// 采收管理
const formVpRef = ref();
const openVillageProductForm = async (type: string, id: number) => {
  formVpRef.value.open(type, await HarvestManagementApi.getHarvestManagement(id));
};

const listVarietyManagement = ref<VarietyManagementVO[]>([]); // 品类列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const getTypeData = async () => {
  //@ignore
  listVarietyManagement.value = await allDataCacheManager.getData({});
  listCategoryManagement.value = await CategoryManagementApi.getAllCategoryManagement({});
};
getTypeData();

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  show.value = userName.value;
  try {
    const data = await HarvestManagementApi.getHarvestManagementPage(queryParams);
    list.value = data.list;
    // list.value.forEach((item, index) => {
    //   const _itemA = listVarietyManagement.value.find(itemA => (itemA.id === item.varietyId))
    //   if (_itemA) {
    //     item.varietyName = _itemA.varietyName
    //     item.variety = _itemA.categoryName
    //     item.varietyCode = _itemA.categoryId
    //   }
    // });
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
  queryParams.belongParkId = undefined;
  queryParams.belongPlotId = undefined;
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};
const openForm1 = () => {
  message.alertWarning(t('新增需前往种植管理进行采收'));
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await HarvestManagementApi.deleteHarvestManagement(id);
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
    const data = await HarvestManagementApi.exportHarvestManagement(queryParams);
    download.excel(data, '采收管理.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});

onActivated(async () => {
  await getList();
});

//基地的选择
const parkPopupRef = ref();
const openType = ref('');
const openParkPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === '') {
    message.error('请选择基地');
  } else parkPopupRef.value.open(id);
};
const handleParkPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    queryParams.belongParkId = String(order[0].code);
    queryParams.belongPark = String(order[0].name);
  } else queryParams.belongPark = String(order[0].name);
};

//地块的选择
const plotPopupRef = ref();
const openType1 = ref('');
const openPlotPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value) {
    message.error('请选择基地');
  } else plotPopupRef.value.open(id);
};
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log('--->>查看选择的地块信息：', order[0]);
  queryParams.belongParkId = String(order[0].parkId);
  queryParams.belongPlotId = String(order[0].id);
  queryParams.belongPlot = String(order[0].name);
};
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
        <h1 class="m-0 text-[#333] font-bold text-[18px]">采收管理</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!--
          一级标题旁边的按钮
          主按钮 type="primary" 次按钮不设置 type 属性 不设置 plain 属性
        -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:harvest-management:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
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
      <el-form-item label="选择基地">
        <el-select v-model="queryParams.belongParkId">
          <el-option
            v-for="(item, index) in baseList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择地块">
        <el-select v-model="queryParams.belongPlotId">
          <el-option
            v-for="(item, index) in plotList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批次码" prop="batchCode">
        <el-input
          v-model="queryParams.batchCode"
          placeholder="请输入批次码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品种" prop="varietyId">
        <el-select v-model="queryParams.varietyId" clearable placeholder="请选择品种">
          <el-option
            v-for="item in listVarietyManagement"
            :key="item.id"
            :label="item.varietyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品类" prop="variety">
        <el-select v-model="queryParams.variety" clearable placeholder="请选择品类">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.categoryName"
            :label="item.categoryName"
            :value="item.categoryName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
    </el-form>

    <!-- 如果有 6.1.2的部分 则这里是mt-[8px] -->
    <div class="w-full mt-[16px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        border
      >
        <!--      <el-table-column label="主键" align="center" prop="id" />-->
        <!-- <el-table-column label="记录编号" align="center" prop="recordNum" /> -->

        <!-- <el-table-column label="基地ID" align="center" prop="belongParkId" /> -->
        <el-table-column label="基地" align="center" prop="belongPark" width="180" />
        <!-- <el-table-column label="地块ID" align="center" prop="belongPlotId" /> -->
        <el-table-column label="地块" align="center" prop="belongPlot" width="180" />
        <!-- <el-table-column label="品种ID" align="center" prop="varietyId" /> -->
        <el-table-column
          label="批次码"
          align="center"
          prop="batchCode"
          width="180"
          v-if="show !== 118"
        />
        <el-table-column
          label="上传时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column
          label="品种名称"
          align="center"
          prop="varietyName"
          width="140"
          v-if="show !== 118"
        />
        <el-table-column
          label="品类名称"
          align="center"
          prop="variety"
          width="120"
          v-if="show !== 118"
        />
        <!--      <el-table-column label="采收数量(亩/只/条)" align="center" prop="harvestNum" />-->
        <el-table-column label="采收数量（亩/只/条）" align="center" prop="harvestNum" width="160">
          <!--        <template #default="scope">-->
          <!--          {{-->
          <!--            scope.row.harvestNum-->
          <!--              ? (-->
          <!--                scope.row.variety === '水稻'-->
          <!--                  ? scope.row.harvestNum + ' 亩'-->
          <!--                  : scope.row.variety === '鸭'-->
          <!--                    ? scope.row.harvestNum + ' 只'-->
          <!--                    : scope.row.variety === '鱼'-->
          <!--                      ? scope.row.harvestNum + ' 条'-->
          <!--                      : ''-->
          <!--              ) : '-'-->
          <!--          }}-->
          <!--        </template>-->
        </el-table-column>
        <el-table-column label="采收量" align="center" prop="harvestVolume" width="180">
          <template #default="scope">
            {{ scope.row.harvestVolume != undefined ? scope.row.harvestVolume + ' Kg' : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="人工数量" align="center" prop="laborQuantity" width="180">
          <template #default="scope">
            {{ scope.row.laborQuantity != undefined ? scope.row.laborQuantity + ' 人' : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" prop="remark" width="180">
          <template #default="scope">
            {{ scope.row.remark != undefined ? scope.row.remark + ' Kg' : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="155px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <!-- 按钮 -->
              <el-button
                link
                type="success"
                v-if="parseInt(scope.row.remark) > 0"
                @click="openVillageProductForm('create', scope.row.id)"
              >
                加工
              </el-button>
              <div
                v-if="
                  parseInt(scope.row.remark) < parseInt(scope.row.harvestVolume) &&
                  parseInt(scope.row.remark) > 0
                "
                class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"
              ></div>
              <el-button
                link
                type="warning"
                @click="damn(scope.row)"
                v-if="parseInt(scope.row.remark) < parseInt(scope.row.harvestVolume)"
              >
                加工记录
              </el-button>
              <div
                v-if="parseInt(scope.row.remark) >= parseInt(scope.row.harvestVolume)"
                class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"
              ></div>
              <el-button
                link
                type="primary"
                v-if="parseInt(scope.row.remark) >= parseInt(scope.row.harvestVolume)"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:harvest-management:update']"
              >
                编辑
              </el-button>
              <div
                v-if="parseInt(scope.row.remark) >= parseInt(scope.row.harvestVolume)"
                class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"
              ></div>
              <el-button
                link
                type="danger"
                v-if="parseInt(scope.row.remark) >= parseInt(scope.row.harvestVolume)"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:harvest-management:delete']"
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
  <HarvestManagementForm ref="formRef" @success="getList" />
  <!-- 表单弹窗：添加/修改 -->
  <VillageProductForm ref="formVpRef" @success="getList" />

  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>加工记录</h3>
    </template>
    <template #default>
      <!--      <el-timeline style="max-width: 600px">-->
      <!--        <el-timeline-item-->
      <!--          v-for="item, index in formData"-->
      <!--          :key="index"-->
      <!--          :timestamp="formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss') "-->
      <!--          placement="top"-->
      <!--        >-->
      <!--          <el-card>-->
      <!--            <h4>品种名称：{{ item.product }}</h4>-->
      <!--            <p>批次码：{{ item.batchCode }}</p>-->
      <!--            <p>消耗量：{{ item.remark + " " + "Kg" }}</p>-->
      <!--            <p>加工时间：{{ formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss') }}</p>-->
      <!--          </el-card>-->
      <!--        </el-timeline-item>-->
      <!--      </el-timeline>-->
      <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="品种名称" align="center" prop="product" />
        <el-table-column label="产品数量" align="center" prop="inventory" />
        <el-table-column label="产品规格" align="center" prop="specifications" />
        <el-table-column label="消耗量" align="center" prop="remark" />
        <el-table-column label="批次号" align="center" prop="batchCode" />
        <el-table-column
          label="加工时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
      </el-table>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
      </div>
    </template>
  </el-drawer>

  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange" />
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange" />
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
