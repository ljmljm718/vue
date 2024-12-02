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
import AutoRecognizeAddForm from './AutoRecognizeAddForm.vue';
import ImgNoIdentify from './assets/not-identify.png';
import ImgNoData from '@/assets/imgs/chartNull.png';

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

const ratio = (3 / 4) * 100; // 图片比例 这里宽:高=4:3
const numShowImg = 5; // 大图下面的小图列表显示的图片个数
const imgInterval = 8; // 小图的图片间隔 单位px

// 切换页码操作 卡片模式下切换页码需要设置图片列表显示第一个 列表模式无影响
const changePage = async () => {
  if ('card' === listType.value) {
    // 设置当前展示的项为第一项 并查询病虫害数量
    curItem.value = 0;
    if (imgListRef.value) imgListRef.value.style.left = imgSideLength.value + imgInterval + 'px';
  }
  await getList();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  if ('card' === listType.value) {
    // 设置当前展示的项为第一项 并查询病虫害数量
    curItem.value = 0;
    if (imgListRef.value) imgListRef.value.style.left = imgSideLength.value + imgInterval + 'px';
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

// 自动识别后的手动补充操作
const autoRecognizeAddFormRef = ref();
const openAutoRecognizeAddForm = (type: string, id?: string) => {
  autoRecognizeAddFormRef.value.open(type, id);
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
    imgListRef.value.style.left = imgSideLength.value + imgInterval + 'px';
    spotResTableKey.value = new Date().getTime();
  }
};

const imgSideLength = ref<any>(); // 图片列表每个项的边长
const imgListRef = ref<any>(); // 图片列表的模板引用

// 图片列表左移 当前查看的不是最后一个时 左移一个单位 + imgInterval px
const handleClickNextImg = throttle(() => {
  if (curItem.value === list.value.length - 1) return;
  imgId.value = null;
  identified.value = false;
  curItem.value = curItem.value + 1;
  getCountDetail(list.value[curItem.value].id);
  const curLeft = Number(window.getComputedStyle(imgListRef.value).left.slice(0, -2));
  imgListRef.value.style.left = curLeft - (imgSideLength.value + imgInterval) + 'px';
  spotResTableKey.value = new Date().getTime();
}, 500);

// 图片列表右移 当前查看的不是第一个时 右移一个单位 + imgInterval px
const handleClickLastImg = throttle(() => {
  if (curItem.value === 0) return;
  imgId.value = null;
  identified.value = false;
  curItem.value = curItem.value - 1;
  getCountDetail(list.value[curItem.value].id);
  const curLeft = Number(window.getComputedStyle(imgListRef.value).left.slice(0, -2));
  imgListRef.value.style.left = curLeft + imgSideLength.value + imgInterval + 'px';
  spotResTableKey.value = new Date().getTime();
}, 500);

// 点击图片切换到当前显示位置
const handleClickImg = (index) => {
  if (curItem.value === index) return;
  imgId.value = null;
  identified.value = false;
  curItem.value = index;
  getCountDetail(list.value[curItem.value].id);
  imgListRef.value.style.left = (imgSideLength.value + imgInterval) * (1 - index) + 'px';
  spotResTableKey.value = new Date().getTime();
};

// 初次显示列表时 右移一位 表示右二是当前查看的项
watch(imgListRef, () => {
  if (!imgListRef.value) return;
  imgSideLength.value = Number(window.getComputedStyle(imgListRef.value).height.slice(0, -2));
  imgListRef.value.style.left = imgSideLength.value + imgInterval + 'px';
});
window.addEventListener('resize', () => {
  if (!imgListRef.value) return;
  imgSideLength.value = Number(window.getComputedStyle(imgListRef.value).height.slice(0, -2));
  imgListRef.value.style.left = (imgSideLength.value + imgInterval) * (1 - curItem.value) + 'px';
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

const isLoading = ref(false);
const imgId = ref(); //传入补充对话框的图片url
const resultMap = ref(); //自动识别的虫害map
const identified = ref(false); // 是否被识别过

// 点击开始识别
const handleClickIdentify = async (objects: any) => {
  console.log('objects.id', objects.id);
  identified.value = false;
  isLoading.value = true;
  // 判断当前状态
  // if(objects.identifyStatus == 0){
  //   isLoading.value = false;
  //   ElMessage.error('该图片已识别，请选择未识别的图片')
  //   spotResTableKey.value = new Date().getTime();
  //   return
  // }
  // 判断是否属于虫害
  if ('虫害' == objects.monitorType) {
    ElMessage.warning({ message: '识别中，请稍等', duration: 1000 });
    let pyData = await DiseasePestSurveillanceApi.pyDiseasePestSurveillance(objects.id);
    console.log('pyData.data', pyData.data);
    // 无论是否有识别结果均打开编辑对话框
    imgId.value = pyData.data.imgId;
    resultMap.value = pyData.data.resultMap;
    openAutoRecognizeAddForm('create', objects.id);
    identified.value = true;
    isLoading.value = false;
    // if(Object.keys(pyData.data.resultMap).length > 0){
    //   let resultString = '当前识别结果为：\n '; // 创建一个空字符串来拼接结果
    //   for (let key in pyData.data.resultMap) {
    //     if (pyData.data.resultMap.hasOwnProperty(key)) {
    //       resultString += '虫害名称: ' +key + ', 数量: ' + pyData.data.resultMap[key]+'\n';
    //     }
    //   }
    //   resultString += '请选择是否替换'
    //   console.log(resultString,"resultString");
    //   isLoading.value = false;
    //   ElMessageBox.confirm(resultString).then(async() => {
    //     isLoading.value = true;
    //     try{
    //       let restMsg = await DiseasePestSurveillanceApi.pyCreateDiseasePestSurveillance(objects.id);
    //       isLoading.value = false;
    //       ElMessage.success(restMsg);
    //     }catch{
    //       isLoading.value = false;
    //     }
    //     await getList();
    //   })
    //   isLoading.value = false;
    // }else{
    //   isLoading.value = false;
    //   ElMessage.error(pyData.msg + ",请更换图片再试");
    // }
  } else {
    isLoading.value = false;
    ElMessage.error('抱歉，无法识别病害图片');
  }

  spotResTableKey.value = new Date().getTime();
};

const handleIdentifyImgError = (e) => {
  console.log('Error when loading identify image');
  console.log(e);
};

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
    class="w-full bg-white dark:bg-#333 rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="m-0 text-[#333] dark:text-[#ccc] font-bold text-[18px]">病虫害监测</h1>
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:disease-pest-surveillance:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center space-x-[8px]">
        <el-button @click="handleQuery" type="primary">
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
          v-hasPermi="['agriculture:disease-pest-surveillance:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>

        <el-radio-group v-model="listType" @change="handleCardChange">
          <el-radio-button label="card" value="card">
            <div class="flex items-center">
              <el-icon class="mr-[5px]"><Menu /></el-icon>
              <span>卡片</span>
            </div>
          </el-radio-button>
          <el-radio-button label="list" value="list">
            <div class="flex items-center">
              <el-icon class="mr-[5px]"><List /></el-icon>
              <span>列表</span>
            </div>
          </el-radio-button>
        </el-radio-group>

        <button
          class="circle-arrow-up !ml-[16px] !dark:text-[#ccc]"
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
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form overflow-hidden"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="设备" prop="deviceName">
        <el-input v-model="queryParams.deviceName" placeholder="请选择设备" disabled>
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="监测物种" prop="monitorSpecies">
        <el-select v-model="queryParams.monitorSpecies" clearable placeholder="请选择监测物种">
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
        <el-select v-model="queryParams.belongPark">
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
        <el-select v-model="queryParams.identifyStatus" clearable placeholder="请选择状态">
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
    </el-form>

    <div class="w-full mt-[16px]">
      <!-- 识别结果 -->
      <SpotResult ref="spotInstance" :title="activeTitle" />

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

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          prop="identifyStatus"
          width="200"
        >
          <template #default="scope">
            <el-button
              v-show="scope.row.identifyStatus == '1'"
              link
              type="primary"
              @click="openRecognizeForm('create', scope.row.id)"
            >
              识别
            </el-button>
            <el-button link type="primary" @click="handleOpenSpotRes(scope.row)">
              识别结果
            </el-button>
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

      <div v-show="listType === 'list'">
        <Pagination
          style="margin-bottom: 0; margin-top: 8px"
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="changePage"
        />
      </div>

      <!-- 卡片 -->
      <div v-show="listType === 'card'" class="mb-[20px]">
        <!-- 无数据 -->
        <div v-if="list.length === 0" class="w-full flex justify-center items-center">
          <div class="no-data">暂无数据</div>
        </div>

        <!-- 有数据 -->
        <div v-else>
          <div class="grid grid-cols-2 gap-x-[20px]">
            <!-- 左侧展示图片(列表) -->
            <div class="col-span-1">
              <div class="relative p-[8px]" style="border: 1px solid #e6e6e6">
                <div class="w-full relative pb-[75%]">
                  <el-image
                    v-show="list[curItem].monitorPicture"
                    :src="list[curItem].monitorPicture"
                    alt="图片展示"
                    fit="cover"
                    :preview-src-list="[list[curItem].monitorPicture]"
                    class="w-full h-full !absolute top-0 left-0"
                  />
                  <div
                    v-show="!list[curItem].monitorPicture"
                    class="absolute top-0 left-0 w-full h-full flex justify-center items-center"
                  >
                    <div class="no-data">暂无图片</div>
                  </div>
                </div>

                <div class="mt-[9px] w-full relative" :class="`pb-[calc((100%-32px)/5)]`">
                  <div class="absolute top-0 left-0 overflow-hidden w-full">
                    <div
                      class="flex relative transition-all"
                      :class="`space-x-[8px]`"
                      ref="imgListRef"
                    >
                      <div
                        v-for="(item, index) in list"
                        :key="item.id"
                        class="flex-none relative cursor-pointer"
                        :class="`
                          pb-[calc((100%-32px)/5)]
                          w-[calc((100%-32px)/5)]
                        `"
                        @click="handleClickImg(index)"
                      >
                        <img
                          :src="item.monitorPicture"
                          alt="图片展示"
                          class="object-cover w-full h-full absolute top-0 left-0"
                        />
                      </div>
                    </div>

                    <div class="last-icon" @click="handleClickLastImg(index)"></div>
                    <div class="next-icon" @click="handleClickNextImg(index)"></div>

                    <div
                      class="h-full absolute top-0 box-border"
                      :class="`
                        w-[calc((100%-32px)/5)]
                        left-[calc((100%-32px)/5+8px)]
                      `"
                      :style="{
                        border: '2px solid var(--el-color-primary)'
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
              <Pagination
                style="margin-bottom: 0; margin-top: 8px"
                :total="total"
                v-model:page="queryParams.pageNo"
                v-model:limit="queryParams.pageSize"
                @pagination="changePage"
              />
            </div>

            <!-- 右侧识别记录 -->
            <div class="col-span-1">
              <!-- 开始识别 & 手动标注 -->
              <div class="mb-[1rem]">
                <el-button type="primary" @click="handleClickIdentify(list[curItem])">
                  开始识别
                </el-button>
                <el-button class="!ml-[8px]" @click="openRecognizeForm('create', list[curItem].id)">
                  手动标注
                </el-button>
              </div>

              <!-- 识别虫害数量 & 虫害分类 -->
              <div class="lg:grid lg:grid-cols-2 gap-x-[16px] mb-[16px]">
                <div class="w-full relative" :class="`pb-[75%]`">
                  <el-image
                    v-show="imgId"
                    :src="imgId"
                    alt="识别结果"
                    fit="cover"
                    class="!absolute top-0 left-0 w-full h-full"
                    :preview-src-list="[imgId]"
                  />
                  <el-image
                    v-show="!imgId && !identified"
                    :src="list[curItem].recognizeImg"
                    alt="上次结果"
                    fit="cover"
                    class="!absolute top-0 left-0 w-full h-full"
                    :preview-src-list="[imgId]"
                  />
                  <img
                    v-show="
                      (!imgId && identified) ||
                      (!identified && !imgId && !list[curItem].recognizeImg)
                    "
                    :src="ImgNoIdentify"
                    alt="识别失败"
                    class="absolute top-0 left-0 w-full h-full object-contain"
                  />
                </div>

                <div class="mt-[16px] lg:mt-0 grid grid-cols-1 grid-rows-2 gap-y-[8px]">
                  <div
                    class="py-[8px] lg:py-0 pl-[16px] flex items-center border border-solid border-[#e6e6e6] rounded-[4px]"
                  >
                    <div class="flex">
                      <img
                        :src="PestAmountIcon"
                        class="objcet-contain h-[48px] w-[48px] 2xl:h-[64px] 2xl:w-[64px]"
                      />
                      <div class="ml-[20px] flex flex-col justify-center">
                        <span>识别虫害数量</span>
                        <span class="font-bold 2xl:text-[30px]">
                          {{ countDetail.dataSumByQuantity }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="py-[8px] lg:py-0 pl-[16px] flex items-center border border-solid border-[#e6e6e6] rounded-[4px]"
                  >
                    <div class="flex">
                      <img
                        :src="PestCategoryIcon"
                        class="objcet-contain h-[48px] w-[48px] 2xl:h-[64px] 2xl:w-[64px]"
                      />
                      <div class="ml-[20px] flex flex-col justify-center">
                        <span>病虫害分类</span>
                        <span class="font-bold 2xl:text-[30px]">
                          {{ countDetail.dataSumByType }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 识别记录 -->
              <SpotResTable
                :activeMainTableId="list[curItem].id"
                :monitorType="list[curItem].monitorType"
                :key="spotResTableKey"
                @refresh="getCountDetail(list[curItem].id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>

  <!-- 表单弹窗：添加/修改 -->
  <DiseasePestSurveillanceForm ref="formRef" @success="getList" />
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange" />

  <!-- 识别表单 -->
  <RecognizeForm ref="recognizeFormRef" @success="getList" />
  <!-- 遮罩层 -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">Loading...</div>
  </div>

  <!-- 自动识别补充表单 -->
  <AutoRecognizeAddForm
    ref="autoRecognizeAddFormRef"
    :imgId="imgId"
    :resultMap="resultMap"
    @success="getList"
  />
</template>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明的背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 确保遮罩层在其他内容之上 */
}

.loading-content {
  color: white;
  /* 可以添加更多的样式来美化加载提示 */
}
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
  width: 37px;
  height: 37px;
  background: {
    position: center;
    repeat: no-repeat;
    size: contain;
  }
  position: absolute;
  top: 50%;
  cursor: pointer;
  margin: 0;
}

.last-icon {
  background-image: url(./assets/last-icon.png);
  left: calc((100% - 32px) / 5 / 2);
  transform: translate(-50%, -50%);
}

.next-icon {
  background-image: url(./assets/next-icon.png);
  right: calc((100% - 32px) / 5 / 2);
  transform: translate(50%, -50%);
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

// 收起
.circle-arrow-up {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ebebeb;
  color: #333;
  background-color: transparent;
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
    background-color: transparent;
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
    background-color: transparent;
  }
}

.rotate180andthemeBg {
  animation-duration: 0.5s;
  animation-name: rotate180andthemeBg;
  animation-fill-mode: forwards;
}
</style>
