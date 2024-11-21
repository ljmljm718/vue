<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form :model="queryParams" ref="queryFormRef" :inline="true">
      <el-form-item label="设备" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请选择设备"
          disabled
          class="!w-240px"
        >
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="监测物种" prop="monitorSpecies">
        <el-select
          v-model="queryParams.monitorSpecies"
          clearable
          placeholder="请选择监测物种"
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
      <!-- <el-form-item label="监测类型" prop="monitorType">
          <el-select
            v-model="queryParams.monitorType"
            placeholder="请选择监测类型"
            clearable
            class="!w-240px"
          >
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item> -->
      <el-form-item label="监测时间" prop="monitorTime">
        <el-date-picker
          v-model="queryParams.monitorTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <!-- <el-form-item label="监测抓图" prop="monitorPicture">
          <el-input
            v-model="queryParams.monitorPicture"
            placeholder="请输入监测抓图"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item> -->
      <el-form-item label="地块" prop="belongPark">
        <el-select class="!w-240px" v-model="queryParams.belongPark">
          <el-option
            v-for="(item, index) in plotList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="识别状态" prop="identifyStatus">
        <el-select
          v-model="queryParams.identifyStatus"
          class="!w-240px"
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_IDENTIFY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="设备状态" prop="deviceStatus">
          <el-select
            v-model="queryParams.deviceStatus"
            placeholder="请选择设备状态"
            clearable
            class="!w-240px"
          >
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item> -->
      <!-- <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
          />
        </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery">
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
  <ContentWrap class="relative">
    <!-- 识别结果 -->
    <SpotResult ref="spotInstance" :title="activeTitle" />

    <!-- 标题 -->
    <div class="flex justify-between mb-[1rem]">
      <span class="text-[1.125rem]">病虫害监测</span>
      <el-radio-group size="small" v-model="listType" @change="handleCardChange">
        <el-radio-button label="card" value="card">
          <el-icon><Menu /></el-icon>
          <span>卡片</span>
        </el-radio-button>
        <el-radio-button label="list" value="list">
          <el-icon><List /></el-icon>
          <span>列表</span>
        </el-radio-button>
      </el-radio-group>
    </div>
    <div>
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:disease-pest-surveillance:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:disease-pest-surveillance:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
      </el-form-item>
    </div>
    <!-- 列表 -->
    <el-table
      v-show="listType === 'list'"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="设备" align="center" prop="device" />
      <el-table-column label="监测物种" align="center" prop="monitorSpecies" />
      <el-table-column label="监测类型" align="center" prop="monitorType" />
      <el-table-column
        label="监测时间"
        align="center"
        prop="monitorTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="监测抓图" align="center" prop="monitorPicture">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            :src="row.monitorPicture"
            :preview-src-list="[row.monitorPicture]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="地块" align="center" prop="belongPark" />
      <el-table-column label="识别状态" align="center" prop="identifyStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_IDENTIFY_STATUS" :value="scope.row.identifyStatus" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" prop="identifyStatus" width="200">
        <template #default="scope">
          <el-button
            v-show="scope.row.identifyStatus == '1'"
            link
            type="primary"
            @click="openRecognizeForm('create', scope.row.id)"
          >
            识别
          </el-button>
          <el-button link type="primary" @click="handleOpenSpotRes(scope.row)">识别结果</el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:disease-pest-surveillance:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:disease-pest-surveillance:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 卡片 -->
    <div v-show="listType === 'card'" class="mb-[20px]">
      <!-- 无数据 -->
      <div v-if="list.length === 0" class="w-full flex justify-center items-center">
        <div class="no-data">暂无数据</div>
      </div>
      <!-- 有数据 -->
      <div v-else>
        <div class="grid grid-cols-5" ref="cardContainer">
          <!-- 左侧展示图片(列表) -->
          <div class="col-span-2 p-[1rem] relative" style="border: 1px solid #e6e6e6">
            <!-- 主图片展示 -->
            <div
              v-show="list[curItem].monitorPicture"
              class="w-full flex justify-center items-center"
              ref="mainImgContainer"
            >
              <el-scrollbar :style="`width: 100%; height: ${imgContainerHeight}px`">
                <img
                  ref="mainImg"
                  :src="list[curItem].monitorPicture"
                  class="w-full object-contain rounded-lg"
                />
              </el-scrollbar>
            </div>
            <!-- 主图片地址缺失时显示样式 -->
            <div
              v-show="!list[curItem].monitorPicture"
              class="w-full flex justify-center items-center"
              :style="{ height: mainImgHeight + 'px' }"
            >
              <div class="no-data">暂无图片</div>
            </div>
            <!-- 图片列表 -->
            <div class="mt-[1rem] w-full relative" :style="{ height: imgSideLength + 4 + 'px' }">
              <div class="absolute top-0 overflow-hidden h-full" style="width: calc(100% + 1rem)">
                <div ref="imgListRef" class="flex w-full relative transition-all mt-[2px]">
                  <div
                    v-for="(item, index) in list"
                    :key="item.id"
                    class="mr-[1rem] flex-none relative cursor-pointer"
                    :style="{ width: imgSideLength + 'px', height: imgSideLength + 'px' }"
                    @click="handleClickImg(index)"
                  >
                    <img
                      :src="item.monitorPicture"
                      alt="图片展示"
                      class="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                </div>
                <!-- 左右箭头 -->
                <div
                  class="last-icon cursor-pointer"
                  :style="{
                    width: 0.2 * imgSideLength + 'px',
                    height: 0.2 * imgSideLength + 'px',
                    left: imgSideLength / 2 + 'px',
                    top: imgSideLength / 2 + 'px'
                  }"
                  @click="handleClickLastImg"
                ></div>
                <div
                  class="next-icon cursor-pointer"
                  :style="{
                    width: 0.2 * imgSideLength + 'px',
                    height: 0.2 * imgSideLength + 'px',
                    right: imgSideLength / 2 - 16 + 'px',
                    top: imgSideLength / 2 + 'px'
                  }"
                  @click="handleClickNextImg"
                ></div>
                <!-- 当前展示项边框 -->
                <div
                  class="absolute rounded-lg"
                  :style="{
                    width: imgSideLength + 'px',
                    height: imgSideLength + 'px',
                    left: imgSideLength + 14 + 'px',
                    top: 0,
                    border: '2px solid #009688'
                  }"
                ></div>
              </div>
            </div>
            <!-- 边框四个角 -->
            <div class="corner-left-top"></div>
            <div class="corner-left-bottom"></div>
            <div class="corner-right-top"></div>
            <div class="corner-right-bottom"></div>
          </div>
          <!-- 右侧识别记录 -->
          <div class="col-span-3 h-[25rem] ml-[2rem]">
            <!-- 识别虫害数量 & 虫害分类 -->
            <div class="lg:grid lg:grid-cols-2 lg:gap-2">
              <div class="h-[4rem] leading-[4rem] bg-[#F1F8FB] flex justify-between px-[2rem]">
                <div>
                  <img :src="PestAmountIcon" class="align-middle objcet-contain h-[2.5rem]" />
                  <span class="pl-[1rem]">病虫害数量</span>
                </div>
                <span class="text-[1.5rem]">{{ countDetail.dataSumByQuantity }}</span>
              </div>
              <div
                class="h-[4rem] leading-[4rem] bg-[#FEF9EE] flex justify-between px-[2rem] mt-[.5rem] lg:mt-0"
              >
                <div>
                  <img :src="PestCategoryIcon" class="align-middle objcet-contain h-[2.5rem]" />
                  <span class="pl-[1rem]">病虫害分类</span>
                </div>
                <span class="text-[1.5rem]">{{ countDetail.dataSumByType }}</span>
              </div>
            </div>
            <!-- 开始识别 & 手动标注 -->
            <div class="my-[1rem]">
              <el-button color="#009688" @click="handleClickIdentify(list[curItem])">开始识别</el-button>
              <el-button color="#59B9DE" @click="openRecognizeForm('create', list[curItem].id)">
                <span class="text-white">手动标注</span>
              </el-button>
            </div>
            <!-- 识别记录 -->
            <SpotResTable
              :activeMainTableId="list[curItem].id"
              :monitorType="list[curItem].monitorType"
              :key="spotResTableKey"
              height="h-[10rem] lg:h-[15rem]"
              @refresh="getCountDetail(list[curItem].id)"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="changePage"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <DiseasePestSurveillanceForm ref="formRef" @success="getList" />
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange" />

  <!-- 识别表单 -->
  <RecognizeForm ref="recognizeFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import {
  DiseasePestSurveillanceApi,
  DiseasePestSurveillanceVO
} from '@/api/agriculture/diseasepestsurveillance';
import DiseasePestSurveillanceForm from './DiseasePestSurveillanceForm.vue';
import RecognizeForm from './RecognizeForm.vue';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';
import {
  CategoryManagementApi,
  CategoryManagementVO,
  allDataCacheManager
} from '@/api/agriculture/categorymanagement';
import { page, parkPage } from '@/views/agriculture/IntelligentStatistics/api.ts';
import PestAmountIcon from './assets/pest-amount-icon.png';
import PestCategoryIcon from './assets/pest-category-icon.png';
import SpotResTable from './spotResTable.vue';
import { EquipmentDataVO } from '@/api/agriculture/equipmentdata';
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue';
import { throttle } from './utils';
import SpotResult from './spotResult.vue';

/** 病虫害监测 列表 */
defineOptions({ name: 'DiseasePestSurveillance' });

/*
  识别记录组件绑定的key 用时间戳
  这种做法并不好 但在本页面中 切换页码 切换图片 开始识别 手动标注执行完成后都需要刷新SpotResTable组件
  现有数据不足以完成此功能 因此每次执行完获取当前时间戳作为新的key
*/
const spotResTableKey = ref(new Date().getTime());

const spotInstance = ref();
const activeTitle = ref<string>('');
const handleOpenSpotRes = (item: any) => {
  const { id, device } = item;
  activeTitle.value = device;
  spotInstance.value.handleOpen(id);
};

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<DiseasePestSurveillanceVO[]>([]); // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  device: undefined,
  deviceName: undefined,
  monitorSpecies: undefined,
  monitorType: undefined,
  monitorTime: [],
  monitorPicture: undefined,
  belongPark: undefined,
  identifyStatus: undefined,
  deviceStatus: undefined,
  createTime: []
});
const CategoryManagementQueryParams = reactive({});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const purchaseOrderInEnableListRef = ref();
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open();
};
const handlePurchaseOrderChange = async (order: EquipmentDataVO) => {
  //赋值
  queryParams.device = order[0].id;
  queryParams.deviceName = order[0].deviceName;
};
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams);
    const data = await DiseasePestSurveillanceApi.getDiseasePestSurveillancePage(queryParams);
    list.value = data.list;
    console.log('🚀 ~ getList ~ list.value:', list.value);
    total.value = data.total;

    if ('card' === listType.value) {
      if (list.value.length > 0) {
        getCountDetail(list.value[curItem.value].id);
      }
      spotResTableKey.value = new Date().getTime();
    }
  } finally {
    loading.value = false;
  }
};

// 切换页码操作 卡片模式下切换页码需要设置图片列表显示第一个 列表模式无影响
const changePage = async () => {
  if ('card' === listType.value) {
    // 设置当前展示的项为第一项 并查询病虫害数量
    curItem.value = 0;
    if (imgListRef.value) imgListRef.value.style.left = imgSideLength.value + 16 + 'px';
  }
  await getList();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  if ('card' === listType.value) {
    // 设置当前展示的项为第一项 并查询病虫害数量
    curItem.value = 0;
    if (imgListRef.value) imgListRef.value.style.left = imgSideLength.value + 16 + 'px';
  }
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  queryParams.deviceName = undefined;
  queryParams.device = undefined;
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};

// 识别操作
const recognizeFormRef = ref();
const openRecognizeForm = (type: string, id?: string) => {
  recognizeFormRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await DiseasePestSurveillanceApi.deleteDiseasePestSurveillance(id);
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
    const data = await DiseasePestSurveillanceApi.exportDiseasePestSurveillance(queryParams);
    download.excel(data, '病虫害监测.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});

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
};

const listType = ref<string>('card'); // 卡片 card 列表 list
const curItem = ref<number>(0); // 当前list被查看的项

// 切换卡片或列表时 重新查询第一页内容
const handleCardChange = async () => {
  queryParams.pageNo = 1;
  await getList();
  // 切换回卡片时需要设置图片列表移动到第一项
  if ('card' === listType.value) {
    curItem.value = 0;
    getCountDetail(list.value[0].id);
    imgListRef.value.style.left = imgSideLength.value + 16 + 'px';
    spotResTableKey.value = new Date().getTime();
  }
};

const mainImg = ref<any>(); // 大图的模板引用
const mainImgHeight = ref<any>(); // 大图高度
const mainImgContainer = ref<any>(); // 大图容器的模板引用
const cardContainer = ref<any>(); // 卡片容器的模板引用
const imgSideLength = ref<any>(); // 图片列表每个项的边长
const imgContainerHeight = ref<any>(); // 大图的高

// 设置图片容器的高度就是宽度的3/4 以及小图片的边长
const setImgContainerWidthAndImgStyle = () => {
  if (!cardContainer.value) return;
  const containerWidth =
    Number(window.getComputedStyle(cardContainer.value).width.slice(0, -2)) * 0.4 - 32;
  imgContainerHeight.value = containerWidth * (3 / 4);
  mainImgHeight.value = imgContainerHeight.value;
  if (!mainImgContainer.value) return;
  mainImgContainer.value.style.height = imgContainerHeight.value + 'px';
  imgSideLength.value = (containerWidth - 3 * 16) / 4;
};

window.addEventListener('resize', setImgContainerWidthAndImgStyle);
watchEffect(setImgContainerWidthAndImgStyle);

const imgListRef = ref<any>(); // 图片列表的模板引用

// 图片列表左移 当前查看的不是最后一个时 左移一个单位 + 1rem
const handleClickNextImg = throttle(() => {
  if (curItem.value === list.value.length - 1) return;
  curItem.value = curItem.value + 1;
  getCountDetail(list.value[curItem.value].id);
  const curLeft = Number(window.getComputedStyle(imgListRef.value).left.slice(0, -2));
  imgListRef.value.style.left = curLeft - (imgSideLength.value + 16) + 'px';
  spotResTableKey.value = new Date().getTime();
}, 500);

// 图片列表右移 当前查看的不是第一个时 右移一个单位 + 1rem
const handleClickLastImg = throttle(() => {
  if (curItem.value === 0) return;
  curItem.value = curItem.value - 1;
  getCountDetail(list.value[curItem.value].id);
  const curLeft = Number(window.getComputedStyle(imgListRef.value).left.slice(0, -2));
  imgListRef.value.style.left = curLeft + imgSideLength.value + 16 + 'px';
  spotResTableKey.value = new Date().getTime();
}, 500);

// 点击图片切换到当前显示位置
const handleClickImg = (index) => {
  if (curItem.value === index) return;
  curItem.value = index;
  getCountDetail(list.value[curItem.value].id);
  imgListRef.value.style.left = (imgSideLength.value + 16) * (1 - index) + 'px';
  spotResTableKey.value = new Date().getTime();
};

// 初次显示列表时 右移一位 表示右二是当前查看的项
// 因为刚加载页面时可能没有cardContainer.value 因此不能用onMounted
watchEffect(() => {
  if (!cardContainer.value) return;
  imgListRef.value.style.left = imgSideLength.value + 16 + 'px';
});
window.addEventListener('resize', () => {
  imgListRef.value.style.left = (imgSideLength.value + 16) * (1 - curItem.value) + 'px';
});

// 病虫害数量
const countDetail = ref<any>({
  dataSumByType: 0, // 分类数量
  dataSumByQuantity: 0 // 总数量
});

// 获取病虫害数量
const getCountDetail = async (id) => {
  const res = await DiseasePestSurveillanceApi.countDetails({ id });
  countDetail.value.dataSumByType = res.dataSumByType;
  countDetail.value.dataSumByQuantity = res.dataSumByQuantity;
};

// 点击开始识别
const handleClickIdentify = async (objects:any) => {
  if(objects.identifyStatus == 0){
    ElMessage.error('该图片已识别，请选择未识别的图片')
    return
  }
  if('虫害' == objects.monitorType){
    ElMessage.warning( '识别中，请稍等')
    let restMsg = await DiseasePestSurveillanceApi.pyCreateDiseasePestSurveillance(objects.id);
    ElMessage({
      message: restMsg,
      type: 'success',
      });
    await getList();
  }else{
    ElMessage.error('抱歉，无法识别病害图片');
  }
  
  
  
  spotResTableKey.value = new Date().getTime();
};
</script>

<style lang="scss" scoped>
// 无数据
.no-data {
  background: {
    image: url(@/assets/imgs/chartNull.png);
    size: contain;
    position: center;
    repeat: no-repeat;
  }
  height: 10rem;
  width: 10rem;
  text-align: center;
  letter-spacing: 0.1rem;
}

// 图片边框四个角
.corner-left-top,
.corner-left-bottom,
.corner-right-top,
.corner-right-bottom {
  position: absolute;
  background-size: 100%, 100%;
  width: 24px;
  height: 24px;
}

.corner-left-top {
  background-image: url(./assets/border-left-top.png);
  left: 0;
  top: 0;
}

.corner-left-bottom {
  background-image: url(./assets/border-left-bottom.png);
  left: 0;
  bottom: 0;
}

.corner-right-top {
  background-image: url(./assets/border-right-top.png);
  right: 0;
  top: 0;
}

.corner-right-bottom {
  background-image: url(./assets/border-right-bottom.png);
  bottom: 0;
  right: 0;
}

.last-icon,
.next-icon {
  background: {
    position: center;
    repeat: no-repeat;
    size: contain;
  }
  position: absolute;
  transform: translate(-50%, -50%);
}

.last-icon {
  background-image: url(./assets/last-icon.png);
}

.next-icon {
  background-image: url(./assets/next-icon.png);
}
</style>
