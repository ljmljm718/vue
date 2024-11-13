<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="地块名称" prop="plotName">
        <el-input
          v-model="queryParams.plotName"
          placeholder="请选择"
          class="!w-240px"
          :disabled="true"
        >
          <template #append>
            <el-button @click="openPlotPopup(queryParams.belongPark)">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="品类" prop="cropType">
        <el-select
          v-model="queryParams.cropType"
          clearable
          placeholder="请选择品类"
          class="!w-240px"
        >
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="品种" prop="cropName">-->
      <!--        <el-input v-model="queryParams.cropName" placeholder="请选择品种" class="!w-180px">-->
      <!--          <template #append>-->
      <!--            <el-button @click="openBreedFrom()">-->
      <!--              <Icon icon="ep:search"/>-->
      <!--              选择-->
      <!--            </el-button>-->
      <!--          </template>-->
      <!--        </el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="品种" prop="breedId">
        <el-select
          v-model="queryParams.breedId"
          clearable
          placeholder="请选择品种"
          class="!w-240px"
        >
          <el-option
            v-for="item in listVarietyManagementVO"
            :key="item.id"
            :label="item.varietyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="种植时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input
          v-model="queryParams.batchCode"
          placeholder="请输入批次号"
          clearable
          @keyup.enter="handleQuery"
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
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex items-center">
      <div class="mx-[1.5rem]">
        <el-button
          type="primary"
          plain
          class="!h-2rem !text-white !bg-[#009688]"
          @click="openForm('create')"
          v-hasPermi="['agriculture:crop-base:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>
      <div class="grow">
        <IntroduceAlert
          class="flex 2xl:h-100% xl:h-100% 2xl:mt-1"
          title="该模块是对不同基地地块下的作物种植信息进行管理，记录作物种植数量以及预估产量，同时生成批次号，对作物进行溯源管理。"
        />
      </div>
      <div class="flex items-center cursor-pointer ml-[1.5rem]">
        <div
          :class="[showType === 'card' ? 'tab-btn-selected' : 'tab-btn']"
          @click="showType = 'card'"
        >
          <el-icon>
            <Menu />
          </el-icon>
          <div class="pl-1 text-[13px]">卡片</div>
        </div>
        <div
          :class="[showType === 'list' ? 'tab-btn-selected2' : 'tab-btn2']"
          @click="showType = 'list'"
        >
          <el-icon>
            <List />
          </el-icon>
          <div class="pl-1 text-[13px]">列表</div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="w-full pt-5" v-show="showType === 'list'">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="种植品种" align="center" prop="cropName" width="140" />
        <el-table-column label="品类" align="center" prop="cropType">
          <template #default="scope">
            <el-tag>{{ scope.row.cropType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="imgId">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.imgId"
              :preview-src-list="[row.imgId]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="基地名称" align="center" prop="parkName" width="160" />
        <el-table-column label="地块名称" align="center" prop="plotName" width="160" />
        <el-table-column label="数量" align="center" prop="number" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="预计产量" align="center" prop="predictedOutput" />
        <el-table-column
          label="开始时间"
          align="center"
          prop="receiptStartTime"
          :formatter="dateFormatter2"
          width="120px"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="receiptEndTime"
          :formatter="dateFormatter2"
          width="120px"
        />
        <el-table-column align="center" prop="batchCode" width="160px">
          <template #header>
            <QuestionMaskTip
              lable-name="批次号"
              content="批次号是分配给特定种植操作或作业的唯一标识符，每个批次号代表一组具有共同特征的作物或一轮种植活动，在产品追溯中起着重要作用。"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="batchQrImg" width="100px">
          <template #default="scope">
            <el-image
              :src="`data:image/png;base64,${scope.row.batchQrImg}`"
              style="object-fit: cover; width: 2rem; height: 2rem"
              preview-teleported
              :preview-src-list="[`data:image/png;base64,${scope.row.batchQrImg}`]"
            />
          </template>
          <template #header>
            <QuestionMaskTip
              lable-name="二维码"
              content="扫描二维码获取当前作物的生长流程，对作物进行溯源管理。"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" key="isEnableModel" width="120px">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isEnableModel"
              :active-value="true"
              :inactive-value="false"
              @change="handleStatusChange(scope.row)"
            />
          </template>
          <template #header>
            <QuestionMaskTip
              lable-name="启用模型"
              content="是否启用该地块作物的模型配置，使其进入模型监测行列。"
            />
          </template>
        </el-table-column>
        <el-table-column label="采收状态" align="center" prop="recoveryNo" width="120">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.recoveryNo">已采收</el-tag>
            <el-tag v-if="!scope.row.recoveryNo">未采收</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="cropDesc" width="240" />
        <el-table-column
          :label="deptId === 156 ? '数量' : '备注'"
          align="center"
          prop="remark"
          width="180"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('detail', scope.row.id)"
              v-hasPermi="['agriculture:crop-base:update']"
              v-if="!scope.row.recoveryNo"
            >
              详情
            </el-button>
            <el-button link type="success" @click="damn(scope.row)" v-if="show !== 118">
              溯源
            </el-button>
            <el-button
              link
              type="warning"
              @click="openFormA('create', scope.row)"
              v-hasPermi="['agriculture:harvest-management:create']"
              v-if="!scope.row.recoveryNo"
            >
              采收
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agriculture:crop-base:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:crop-base:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 卡片 -->
    <div class="w-full pt-2 grid 2xl:grid-cols-3 grid-cols-2 gap-3" v-show="showType === 'card'">
      <div
        v-for="(item, index) in cardDataList"
        :key="index"
        class="p-3 rounded-2 px-4 border-[#E5E5E5] border-1 border-solid flex relative"
      >
        <div class="flex w-1/3">
          <img :src="item.imgId" class="h-100% w-100% object-cover rounded-md" />
        </div>
        <div class="flex flex-col space-y-1.5 w-2/3">
          <div class="flex mt-1rem">
            <div class="flex ml-1rem">{{ item.cropName }}</div>
            <el-tag class="flex ml-0.5rem">{{ item.cropType }}</el-tag>
            <img
              :src="`data:image/png;base64,${item.batchQrImg}`"
              class="flex w-3rem h-3rem absolute right-1rem top-1rem"
            />
          </div>
          <div class="flex text-#666666 flex-col space-y-1 !mt-2rem">
            <div class="flex ml-1rem">所属地块：{{ item.plotName }}</div>
            <div class="flex ml-1rem">
              起止时间：{{
                `${formatTime(item.receiptStartTime, 'yyyy.MM.dd')}-${formatTime(
                  item.receiptEndTime,
                  'yyyy.MM.dd'
                )}`
              }}
            </div>
          </div>
          <div class="flex space-x-2 ml-1rem !mt-1rem">
            <el-button
              type="primary"
              @click="openForm('detail', item.id)"
              v-hasPermi="['agriculture:crop-base:update']"
              v-if="!item.recoveryNo"
            >
              详情
            </el-button>
            <el-button type="success" @click="damn(item)" v-if="show !== 118">溯源</el-button>
            <el-button
              type="warning"
              @click="openFormA('create', item)"
              v-hasPermi="['agriculture:harvest-management:create']"
              v-if="!item.recoveryNo"
            >
              采收
            </el-button>
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
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CropBaseForm ref="formRef" @success="getList" />
  <!-- 表单弹窗：添加/修改 -->
  <HarvestManagementAdd ref="formRefA" @success="getList" />
  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>种植管理-溯源</h3>
    </template>
    <template #default>
      <div class="flex justify-center h-full">
        <div v-if="Array.isArray(formData) && formData.length > 0" class="flex flex-col">
          <div class="flex flex-col" v-for="item in formData" :key="item.id">
            <div class="flex relative">
              <span
                class="flex w-[0.9rem] h-[0.9rem] mt-[1.2rem] ml-[-1rem] rounded-full bg-[#089df7] absolute left-10px top--7px timeline-dot"
              ></span>
              <div class="flex mb-[0.5rem] mt-[0.5rem] absolute left-40px">
                {{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}
              </div>
            </div>

            <div>
              <el-card class="w-[20rem] ml-[2rem] mt-[2rem]">
                <h4>农事活动：{{ getValByDict(item.farmDefineType) }}</h4>
                <p>
                  品类：
                  <el-tag>{{ item.cropType }}</el-tag>
                  <!--            <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="item.cropType"/>-->
                </p>
                <p>作物名称：{{ item.cropName }}</p>
                <p>记录时间：{{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
              </el-card>
            </div>
          </div>
        </div>
        <div v-else class="w-full h-[20rem] flex flex-col justify-center space-y-2 items-center">
          <img src="/images/noData.png" class="aspect-1 w-8rem" />
          <div class="py-3 text-[.9rem] text-[#999]">
            暂无溯源记录，去“智慧农事”-“农事活动”-“农事记录”中添加
          </div>
          <div
            class="flex space-x-1 items-center justify-center bg-[#009688] text-white p-1 px-3 rounded-2 cursor-pointer text-.8rem"
            @click="router.push('/farm_work/farmManage/farm-record')"
          >
            <Icon icon="ep:plus" />
            <span>去添加</span>
          </div>
        </div>
      </div>
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

  <BreedFrom ref="BreedFromRef" @success="BreedFromSuccess" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime';
import { FarmDefineApi } from '@/api/agriculture/farmdefine';
import download from '@/utils/download';
import { CropBaseApi, CropBaseVO } from '@/api/agriculture/cropbase';
import CropBaseForm from './CropBaseForm.vue';
import HarvestManagementAdd from '@/views/agriculture/harvestmanagement/HarvestManagementAdd.vue';
import { DrawerProps } from 'element-plus';
import { FarmRecordApi, FarmRecordVO } from '@/api/agriculture/farmrecord';
import { formatTime } from '@/utils/index';
import router from '@/router';
import { getTenantId } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import avatarImg from '@/assets/imgs/avatar.gif';
import { CategoryManagementVO, allDataCacheManager } from '@/api/agriculture/categorymanagement';
import { getUserProfile } from '@/api/system/user/profile';
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue';
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue';
import { ParkInfoVO } from '@/api/agriculture/parkinfo';
import QuestionMaskTip from '@/components/QuestionMaskTip/index.vue';
import { ParkDetailVO } from '@/api/agriculture/parkdetail';
import { CommonStatusEnum, CommonStatusEnumBoolean } from '@/utils/constants';
import BreedFrom from '@/views/agriculture/varietymanagement/SelectVarirtManagement.vue';
import { VarietyManagementApi, VarietyManagementVO } from '@/api/agriculture/varietymanagement';
import { cloneDeep } from 'lodash-es';

/** 鲁渝协作品种管理 列表 */
defineOptions({ name: 'AgriCropBase' });
const drawer2 = ref(false);
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化
const direction = ref<DrawerProps['direction']>('rtl');
const loading = ref(true); // 列表的加载中
const list = ref<CropBaseVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 12,
  cropCode: undefined,
  breedId: undefined,
  cropName: undefined,
  cropType: undefined,
  createTime: [],
  batchCode: undefined,
  recoveryNo: undefined,
  belongPark: undefined,
  parkName: undefined,
  plotName: undefined,
  belongPlot: undefined,
  deptId: undefined,
  userId: undefined,
  isEnableModel: undefined
});
const formData = ref<FarmRecordVO[]>([]);
const queryParam = reactive({
  pageNo: 1,
  pageSize: 10,
  planId: undefined,
  breedId: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  planState: undefined,
  personId: undefined,
  personName: undefined,
  startTime: [],
  endTime: [],
  recordTime: [],
  planArea: undefined,
  recordArea: undefined,
  recordState: undefined,
  createTime: []
});
const queryParams1 = reactive({
  pageNo: 1,
  pageSize: 10,
  varietyName: undefined,
  varietyCode: undefined,
  images: undefined,
  categoryId: undefined,
  categorySource: undefined,
  categoryStigma: undefined,
  areaDistribution: undefined,
  briefIntroduction: undefined,
  status: undefined,
  remark2: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const show = ref();
const userStore = useUserStore();
const userName = computed(() => userStore.user.deptId ?? '0');
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const listVarietyManagementVO = ref<VarietyManagementVO[]>([]); // 品种列表的数据
const deptId = ref(0);
const judgeHomePage = async () => {
  const data = await getUserProfile();
  deptId.value = data.dept.id;
};
judgeHomePage();
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  show.value = userName.value;
  listCategoryManagement.value = await allDataCacheManager.getData({});
  try {
    const data = await CropBaseApi.getCropBasePage(queryParams);
    const data1 = await VarietyManagementApi.getVarietyManagementPage(queryParams1);
    listVarietyManagementVO.value = data1.list;
    list.value = data.list;
    cardDataList.value = data.list;
    //把品类数据的namep拼接到列表中
    list.value.forEach((item) => {
      listCategoryManagement.value.forEach((itm) => {
        if (item.cropType == itm.id) item.cropType = itm.categoryName;
      });
    });
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

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
    queryParams.belongPark = String(order[0].id);
    queryParams.parkName = String(order[0].name);
  } else queryParams.parkName = String(order[0].name);
};

//地块的选择
const plotPopupRef = ref();
const openType1 = ref('');
const openPlotPopup = (id: string) => {
  openType1.value = id;
  // if (!openType1.value) {
  //   message.error('请选择基地')
  // } else
  plotPopupRef.value.open(id);
};
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log('--->>查看选择的地块信息：', order[0]);
  queryParams.belongPlot = String(order[0].id);
  queryParams.plotName = String(order[0].name);
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  queryParams.belongPlot = null;
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  // formRef.value.open(type, id)
  if (type == 'create') router.push('/farm_work/CreateOrUpdateCropbase');
  else router.push('/farm_work/CreateOrUpdateCropbase?id=' + id + '&type=' + type);
};

/** 添加/修改操作 */
const formRefA = ref();
const openFormA = (type: string, row?: any) => {
  formRefA.value.open(type, row);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await CropBaseApi.deleteCropBase(id);
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
    const data = await CropBaseApi.exportCropBase(queryParams);
    download.excel(data, '鲁渝协作品种管理.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

function cancelClick() {
  drawer2.value = false;
}

/** 修改品种模型绑定状态 */
const handleStatusChange = async (row: CropBaseApi.CropBaseVO) => {
  try {
    // 修改状态的二次确认
    const text = row.isEnableModel === CommonStatusEnumBoolean.ENABLE ? '绑定' : '停绑';
    await message.confirm('确认要' + text + '当前模型吗?');
    // 发起修改状态
    await CropBaseApi.updateModelEnableStatus(row.id, row.isEnableModel);
    // 刷新列表
    await getList();
  } catch {
    // 取消后，进行恢复按钮
    row.isEnableModel =
      row.isEnableModel === CommonStatusEnumBoolean.ENABLE
        ? CommonStatusEnumBoolean.DISABLE
        : CommonStatusEnumBoolean.ENABLE;
  }
};

const damn = async (row) => {
  queryParam.batchCode = row.batchCode;
  const data = await FarmRecordApi.getFarmRecordPage(queryParam);
  console.log('🚀 ~ damn ~ data:', data);
  data.list.forEach((item) => {
    item.farmDefineType = item.farmDefineType ? parseInt(item.farmDefineType) : '';
  });
  formData.value = data.list;
  listCategoryManagement.value = await allDataCacheManager.getData({});
  //把品类数据的namep拼接到列表中
  formData.value.forEach((item) => {
    listCategoryManagement.value.forEach((itm) => {
      if (item.cropType == itm.id) item.cropType = itm.categoryName;
    });
  });
  console.log('222222', formData.value);
  drawer2.value = true;
};

/** */
const { push } = useRouter();
// const goCheck = (row) => {
//   //打开新的页签并传递参数
//   push(`/farm_work/farmManage/farm-record?batchCode=${row.batchCode}`);
// }

/** 初始化 **/
const farmDefineOptions = ref([]); // 设备分类选项
const getValByDict = (item) => {
  let res = '';
  farmDefineOptions.value.forEach((dict) => {
    if (dict.id === item) res = dict.defineName;
  });
  return res;
};

//品种名称管理
const BreedFromRef = ref();
const openBreedFrom = () => {
  BreedFromRef.value.open();
};

const BreedFromSuccess = (order: any) => {
  queryParams.breedId = String(order[0].id);
  queryParams.cropName = String(order[0].varietyName);
};

//卡片、列表按钮切换
const showType = ref('card');
const cardDataList = ref<any[]>([]);

watch(
  () => showType.value,
  (val) => {
    if (val === 'list') {
      const _list = cloneDeep(list.value);
      list.value = [];
      nextTick(() => {
        list.value = _list;
      });
    }
  }
);

onMounted(async () => {
  await getList();
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({ parentId: 0, status: 1 });
});
onActivated(async () => {
  await getList();
});
</script>
<style lang="scss" scoped>
.timeline-dot::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 100%;
  width: 2px;
  height: 15rem; /* 这里设置竖线的长度 */
  background-color: #089df7;
}
.tab-btn,
.tab-btn-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  border-radius: 5px 0 0 5px;
  height: 2rem;
}

.tab-btn {
  border: 1px solid #e6e6e6;
  color: #666666;
}
.tab-btn-selected {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}
.tab-btn2,
.tab-btn-selected2 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  border-radius: 0 5px 5px 0;
  height: 2rem;
}
.tab-btn2 {
  border: 1px solid #e6e6e6;
  color: #666666;
}
.tab-btn-selected2 {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}
</style>
