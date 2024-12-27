<template>
  <!-- demo8.1.2 删掉ContentWrap 页面内容用下面的el-card包裹 -->
  <el-card body-style="padding: 16px; display: flex; flex-direction: column;" shadow="never">
    <!-- demo8.1.2 新增标题行部分 所有操作按钮移动到这一行 -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-[16px]">
        <!-- demo8.1.2 如果有新增按钮 下面的h1要加上这个 style="border-right: 1px solid #e6e6e6" -->
        <h1 class="m-0 text-[18px] pr-[16px]">批次产品</h1>
        <!-- demo8.1.2 新增按钮的样式 -->
        <!-- <el-button type="primary">
          <Icon icon="ep:plus" />
          <span>新增</span>
        </el-button> -->
      </div>
      <div class="flex items-center space-x-[8px]">
        <!-- demo8.1.2 注意 @click 函数 -->
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" />
          <span>搜索</span>
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />
          <span>重置</span>
        </el-button>
        <!-- demo8.1.2 按钮要注意 v-hasPermi -->
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['digital:village-product:export']"
        >
          <Icon icon="ep:download" />
          <span>导出</span>
        </el-button>
        <!--
          demo8.1.2 卡片列表切换按钮 注意 @click 和 :class 的条件 替换成自己的判断逻辑
          上面的是显示列表的逻辑 下面的是显示卡片的逻辑
          在最下面 style 标签里复制 tab-active 类
        -->
        <div class="flex">
          <el-button
            @click="cardList = true"
            class="!rounded-r-none"
            :class="`${cardList && 'tab-active'}`"
          >
            <Icon icon="ep:list" />
          </el-button>
          <el-button
            @click="cardList = false"
            class="!ml-0 !rounded-l-none"
            :class="`${!cardList && 'tab-active'}`"
          >
            <Icon icon="ep:menu" />
          </el-button>
        </div>
        <!-- demo8.1.2 script标签内新增 const showSearch = ref(true); -->
        <div
          class="w-[20px] h-[20px] !ml-[16px] text-center leading-[22px] rounded-full cursor-pointer transition-all"
          :class="showSearch ? 'rotate-0' : 'rotate-180'"
          style="border: 1px solid #e6e6e6"
          @click="showSearch = !showSearch"
        >
          <el-icon :size="14"><ArrowUpBold /></el-icon>
        </div>
      </div>
    </div>
    <!-- demo8.1.2 搜索栏将 custom-form 改成 el-form 注意 :model 和 ref -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-[8px] mt-[16px] form overflow-hidden"
      :style="`${!showSearch && 'height: 0'}`"
      label-width="95px"
      :inline="true"
    >
      <!-- demo8.1.2 所有输入删掉 !w-220px 和 !w-240px 等定宽的class -->
      <el-form-item label="产品名称" prop="product">
        <el-input
          v-model="queryParams.product"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否赋码" prop="codeType">
        <el-select v-model="queryParams.codeType" placeholder="请选择是否赋码" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CODE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属基地" prop="park">
        <el-input v-model="queryParams.park" placeholder="请选择所属基地" readonly>
          <template #append>
            <!-- demo8.1.2 输入框内图标居中 -->
            <el-button @click="openParkPopup('0')" class="!p-0 flex justify-center items-center">
              <Icon icon="ep:search" />
              <!-- demo8.1.2 删掉输入框里带图标按钮里的文字 -->
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="所属地块" prop="parkDetail">
        <el-input v-model="queryParams.parkDetail" placeholder="请选择所属地块" readonly>
          <template #append>
            <el-button
              @click="openPlotPopup(queryParams.parkId)"
              class="!p-0 flex justify-center items-center"
            >
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="产品年份" prop="years">
        <el-input
          v-model="queryParams.years"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--    <el-form-item label="" size="normal">-->
      <!--      <div class="w-2px h-40px bg-[#e6e6e6]"></div>-->
      <!--    </el-form-item>-->
    </el-form>
    <!-- demo8.1.2 删除原功能按钮和卡片列表切换按钮的代码 移至标题行 -->
    <!-- demo8.1.2 class 新增 mt-[16px] -->
    <div class="flex justify-center mt-[16px]">
      <!-- demo8.1.2 gap-[16px] -->
      <div
        v-if="!cardList"
        v-loading="loading"
        class="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-rows-1 gap-16px container"
      >
        <!-- demo8.1.2 卡片去掉原背景色 新增 shadow-md dark:bg-[#333] dark:shadow-[#000] 如果没有overflow-hidden也要加上 -->
        <div
          v-for="(item, index) in list"
          :key="index"
          class="rounded shadow-md shadow-[#000]/30 dark:bg-[#333] dark:shadow-[#000]"
          style="overflow: hidden"
        >
          <!-- demo8.1.2 图片部分要改写 要求16:9 -->
          <div class="w-full pb-[56.25%] relative">
            <el-image
              v-if="item.photo"
              :src="item.photo"
              :alt="产品图片"
              fit="cover"
              class="!absolute top-0 left-0 w-full h-full rounded-t"
              :preview-src-list="[item.photo]"
              preview-teleported
            />
            <div
              v-else
              class="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-#00000010"
            >
              暂无数据
            </div>
          </div>
          <!-- demo8.1.2 p-[16px] -->
          <div class="p-[16px]">
            <!-- demo8.1.2 文字不给尺寸 -->
            <div class="font-bold">
              {{ item.years }}{{ item.product }} {{ item.specifications }}Kg
            </div>
            <!-- demo8.1.2 my-[4px] text-[14px] -->
            <div class="my-[4px] color-[#878787] text-[14px]" style="word-break: break-all">
              {{ item.park }}-{{ item.parkDetail }}-{{ item.batchCode }}
            </div>
            <div class="flex justify-end">
              <!-- demo8.1.2 text-[14px] -->
              <div class="color-[#898989] text-[14px]">数量：{{ item.inventory }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-table
      v-if="cardList"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="产品名称" align="center" prop="product" />
      <!--      <el-table-column label="所属基地id" align="center" prop="parkId" />-->
      <el-table-column label="所属基地" align="center" prop="park" />
      <!--      <el-table-column label="所属地块id" align="center" prop="parkDetailId"/>-->
      <el-table-column label="所属地块" align="center" prop="parkDetail" />
      <el-table-column label="图片" align="center" prop="photo">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.photo"
            :preview-src-list="[row.photo]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否赋码" align="center" prop="codeType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_CODE_TYPE" :value="scope.row.codeType" />
        </template>
      </el-table-column>
      <el-table-column label="产品年份" align="center" prop="years" />
      <el-table-column label="产品数量(袋)" align="center" prop="inventory" />
      <el-table-column label="产品规格(Kg)" align="center" prop="specifications" />
      <el-table-column label="批次号" align="center" prop="batchCode" />
      <!--      <el-table-column label="采收编号" align="center" prop="recoveryNum" />-->
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        align="center"-->
      <!--        prop="createTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('show', scope.row.id)">详情</el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-if="scope.row.codeType === '0'"
            v-hasPermi="['digital:village-product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-if="scope.row.codeType === '0'"
            v-hasPermi="['digital:village-product:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- demo8.1.2 页码样式调整 -->
    <Pagination
      style="align-self: end; margin-bottom: 0; margin-top: 16px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-card>

  <!-- 表单弹窗：添加/修改 -->
  <VillageProductForm ref="formRef" @success="getList" />

  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange" />
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { VillageProductApi, VillageProductVO } from '@/api/digital/villageproduct';
import VillageProductForm from './VillageProductForm.vue';
import { useRoute } from 'vue-router';
import card from '../../../assets/imgs/card-active.png';
import card2 from '../../../assets/imgs/card-actived.png';
import listImg from '../../../assets/imgs/list-active.png';
import listImg2 from '../../../assets/imgs/list-actived.png';
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue';
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue';
import { ParkInfoVO } from '@/api/agriculture/parkinfo';
import { ParkDetailVO } from '@/api/agriculture/parkdetail';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';

/** 特色产品 列表 */
defineOptions({ name: 'VillageProduct' });
const router = useRouter(); // 路由
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化
const cardList = ref(false);
const loading = ref(true); // 列表的加载中
const list = ref<VillageProductVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  product: undefined,
  parkId: undefined,
  park: undefined,
  parkDetailId: undefined,
  parkDetail: undefined,
  photo: undefined,
  years: undefined,
  inventory: undefined,
  specifications: undefined,
  remark: undefined,
  createTime: [],
  batchCode: undefined,
  recoveryNum: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

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
    queryParams.parkId = String(order[0].code);
    queryParams.park = String(order[0].name);
  } else queryParams.parkDetailId = String(order[0].id);
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
const route = useRoute();
let codeType = route.query.codeType;
if (codeType) queryParams.codeType = codeType;
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log('--->>查看选择的地块信息：', order[0]);
  queryParams.parkDetailId = String(order[0].parkId);
  queryParams.parkDetailId = String(order[0].id);
  queryParams.parkDetail = String(order[0].name);
};
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await VillageProductApi.getVillageProductPage(queryParams);
    console.log(data.list, '数据');
    list.value = data.list;
    list.value.forEach((item) => {
      if (item.photo === '')
        item.photo =
          'https://www.zhuangbeizz.cn/minio/inspur/微信图片_202408141509051723619406676.png';
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
//新增或修改跳转列表后，自动刷新列表
// onActivated(() => {
//   resetQuery()
// })
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  queryParams.parkId = undefined;
  queryParams.parkDetailId = undefined;
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  // formRef.value.open(type, id)
  router.push({ path: '/pcg/production/villageproduct', query: { id: id, type: type } });
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await VillageProductApi.deleteVillageProduct(id);
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
    const data = await VillageProductApi.exportVillageProduct(queryParams);
    download.excel(data, '特色产品.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};
//新增或修改跳转列表后，自动刷新列表
onActivated(() => {
  getList();
});
/** 初始化 **/
onMounted(() => {
  getList();
});

const showSearch = ref(true);
</script>

<style lang="scss" scoped>
.tab-active {
  color: white;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

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
</style>
