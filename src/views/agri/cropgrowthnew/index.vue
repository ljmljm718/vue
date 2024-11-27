<template>
  <div
    class="w-full bg-white dark:bg-#1d1e1f dark:text-#ccc rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="m-0 text-[#333] dark:text-[#ddd] font-bold text-[18px]">生长周期</h1>
        <el-popover
          placement="bottom-start"
          trigger="hover"
          :width="400"
          content="该模块可以对不同作物的各个生长期进行汇总管理，可以添加不同生长期的注意事项以及需要进行的农事活动。"
        >
          <template #reference>
            <Icon
              icon="ep:question-filled"
              :size="14"
              class="ml-[8px] cursor-pointer text-[#F08000]"
            />
          </template>
        </el-popover>

        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

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
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery()">
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
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="品种" prop="cropCode">
        <el-select
          v-model="queryParams.cropCode"
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
      <el-form-item label="品类" prop="cropId">
        <el-select v-model="queryParams.cropId" clearable placeholder="请选择品类" class="!w-240px">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生长期" prop="growth">
        <el-input
          v-model="queryParams.growth"
          placeholder="请输入生长期"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
    </el-form>
    <div
      class="mt-[16px] relative"
      :style="{ height: `calc(100% - ${showSearch ? '80' : '55'}px)` }"
    >
      <template v-if="showType === 'list'">
        <div style="height: calc(100% - 40px)">
          <el-table
            v-loading="loading"
            :data="list"
            :stripe="true"
            :show-overflow-tooltip="true"
            height="100%"
          >
            <el-table-column label="品种名称" align="center" prop="cropName" />
            <el-table-column label="品类名称" align="center" prop="cropType" />
            <el-table-column label="图片" align="center" prop="imgId">
              <template #default="{ row }">
                <el-image
                  class="h-50px w-50px"
                  :src="row.imgId"
                  :preview-src-list="[row.imgId]"
                  preview-teleported
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column label="生长期" align="center" prop="growth" />
            <el-table-column
              label="开始时间"
              align="center"
              prop="startTime"
              :formatter="dateFormatter3"
              width="100px"
            >
              <template #header>
                <div class="flex items-center">
                  <div>开始时间</div>
                  <div
                    @click="sortChange(0)"
                    class="time-icon2 w-10px ml-10px h-15px"
                    v-if="timeNum == 2"
                  ></div>
                  <div
                    @click="sortChange(1)"
                    class="time-icon w-10px ml-10px h-15px"
                    v-else-if="timeNum == 0"
                  ></div>
                  <div
                    @click="sortChange(2)"
                    class="time-icon w-10px ml-10px h-15px"
                    v-else
                    style="transform: rotate(180deg)"
                  ></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="结束时间"
              align="center"
              prop="endTime"
              :formatter="dateFormatter3"
              width="100px"
            />
            <el-table-column label="环境条件" align="center" prop="envCondition" width="220px" />
            <el-table-column label="生长地点" align="center" prop="growSite" width="180px" />
            <el-table-column label="周期（/天）" align="center" prop="cycle" width="120px" />
            <el-table-column label="特点" align="center" prop="feature" width="220px" />
            <el-table-column label="农事建议" align="center" prop="farmAdvice" width="200px" />
            <el-table-column align="center" prop="orders" width="200px">
              <template #header>
                <div class="flex items-center">
                  <div>种植顺序</div>
                  <div
                    @click="plantChange(0)"
                    class="time-icon2 w-10px ml-10px h-15px"
                    v-if="plantNum == 2"
                  ></div>
                  <div
                    @click="plantChange(1)"
                    class="time-icon w-10px ml-10px h-15px"
                    v-else-if="plantNum == 0"
                  ></div>
                  <div
                    @click="plantChange(2)"
                    class="time-icon w-10px ml-10px h-15px"
                    v-else
                    style="transform: rotate(180deg)"
                  ></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="270px" fixed="right">
              <template #default="scope">
                <el-button link type="success" plain @click="damn(scope.row)">事项查看</el-button>
                <el-button
                  link
                  type="warning"
                  plain
                  @click="openSubDeviceForm(scope.row.id, scope.row.growth)"
                >
                  事项添加
                </el-button>
                <el-button
                  link
                  type="primary"
                  @click="openForm('update', scope.row.id)"
                  v-hasPermi="['agri:crop-growth-new:update']"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  v-hasPermi="['agri:crop-growth-new:delete']"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList()"
        />
      </template>
      <template v-else>
        <el-scrollbar height="100%">
          <div class="space-y-[8px]" v-loading="loading">
            <div
              class="rounded-2 p-3 py-1 flex flex-wrap items-center shadow-md"
              style="border: 1px solid #66666666"
              v-for="item in cardDataList"
              :key="item.id"
            >
              <div class="flex items-center 2xl:w-[calc(100%_-_700px)] w-full">
                <div
                  class="h-[14rem] box-border px-1 py-1 flex items-center"
                  style="width: calc(100% - 15.5rem)"
                >
                  <div class="flex flex-col items-center">
                    <img
                      :src="item.imgId"
                      class="h-130px !w-130px object-contain shadow-md rounded-md !bg-[#f5f7f9] !dark:bg-#333 p-1"
                      style="border: 1px solid #25252525"
                    />
                    <div class="p-1 bg-#ecf3f3 dark:bg-#333 text-14px mt-13px px-5 rounded-full">
                      {{ item.cropType }}
                    </div>
                  </div>
                  <div class="grow p-0 pl-20px box-border">
                    <div class="text-20px font-bold">{{ item.cropName }}</div>
                    <div class="flex items-start mt-15px">
                      <div class="w-180px">环境条件:</div>
                      <div class="line-clamp-3">
                        <el-tooltip
                          class="box-item"
                          :content="item.envCondition"
                          placement="top-start"
                        >
                          <div>
                            {{ item.envCondition }}
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                    <div class="flex items-start mt-15px">
                      <div class="w-180px">特点:</div>
                      <div class="line-clamp-3">
                        <el-tooltip class="box-item" :content="item.feature" placement="top-start">
                          <div>
                            {{ item.feature }}
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="block h-[13rem] w-1px bg-[#66666636] mx-3"></div>
                <div :id="`chart_${item.id}`" class="w-[15rem] h-[14rem]"></div>
              </div>
              <div class="2xl:hidden w-full h-[1px] bg-[#66666636] my-3"></div>
              <div class="2xl:block hidden h-[13rem] w-1px bg-[#66666636] mx-12px"></div>
              <div class="2xl:w-[660px] w-full 2xl:p-1 p-3 box-border min-h-10rem">
                <div class="flex justify-between items-center px-6 overflow-hidden pb-[25px]">
                  <div
                    v-for="(ele, idx) in item.child1"
                    :key="idx"
                    class="relative cursor-pointer select-none"
                    @click="
                      item.growth =
                        ele.growth &&
                        updateInstanceOptions(
                          `chart_${item.id}`,
                          {
                            title: {
                              text: ele.growth,
                              subtext: ele.cycle + '天'
                            }
                          },
                          item.cropCode,
                          item.cropId
                        )
                    "
                  >
                    <div>
                      {{ ele.growth }}
                    </div>
                    <div>{{ ele.cycle }}天</div>
                    <div
                      :class="[ele.growth === item.growth ? 'progress-bar-active' : 'progress-bar']"
                    ></div>
                  </div>
                </div>
                <div class="flex mt-2">
                  <div
                    :class="`grow text-[#333] ${child.id === item.activeBar ? 'bg-[#009688] text-[#fff]' : 'bg-[#f1f1f1] dark:bg-[#333] dark:text-[#ddd]'} text-center py-2`"
                    v-for="(child, flag) in item.child2"
                    :key="flag"
                    @click="item.activeBar = child.id"
                  >
                    {{ child.itemName }}
                  </div>
                </div>
                <div class="px-[1rem] pt-3 text-[.9rem]">
                  {{ getLabelById(item.child2, item.activeBar) }}
                </div>
                <div class="flex flex-row-reverse mt-1">
                  <el-button
                    v-if="item.child2 && item.child2.length > 0"
                    type="primary"
                    :icon="VideoCameraFilled"
                    @click="handleOpenVideo(item.child2, item.activeBar)"
                  >
                    技术指导视频
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </template>
    </div>
  </div>

  <!-- 表单弹窗：添加/修改 -->
  <CropGrowthNewForm ref="formRef" @success="getList()" />
  <CropGrowthSubForm ref="subformRef" @success="getList()" />
  <el-dialog v-model="dialogVisible" title="指导视频" width="700" :before-close="handleClose">
    <video width="100%" autoplay :src="vedioUrl" controls></video>
  </el-dialog>

  <!-- start事项查看弹窗 -->
  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>{{ thisGrowth }}注意事项</h3>
    </template>
    <template #default>
      <div class="relative space-y-3 py-4 box-border">
        <el-card class="w-full" v-for="(item, index) in formData" :key="index">
          <!-- <h4>农事活动：{{ getValByDict(item.farmDefineType) }}</h4>
          <p>品种：
            <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="item.cropType"/>
          </p>
          <p>作物名称：{{ item.cropName }}</p>
          <p>记录时间：{{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}</p> -->
          <p v-if="thisCropType">品种: {{ thisCropType }}</p>
          <p>
            事项名称:
            {{ item.itemName }}
          </p>
          <p>事项内容：{{ item.itemContent }}</p>
          <el-button v-if="item.remark != null" @click="lookVedio(item)" type="primary">
            查看指导视频
          </el-button>
        </el-card>
      </div>
    </template>
  </el-drawer>
  <!-- end事项查看弹窗 -->

  <Dialog v-model="showVideoDialog" title="技术指导视频">
    <video width="100%" autoplay :src="activeVideoUrl" controls></video>
  </Dialog>
</template>

<script setup lang="ts">
import download from '@/utils/download';
import { CropGrowthNewApi, CropGrowthNewVO } from '@/api/agri/cropgrowthnew';
// @ts-ignore
import CropGrowthNewForm from './CropGrowthNewForm.vue';
import { allDataCacheManager, CategoryManagementVO } from '@/api/agriculture/categorymanagement';
import { VarietyManagementApi, VarietyManagementVO } from '@/api/agriculture/varietymanagement';
// @ts-ignore
import CropGrowthSubForm from './CropGrowthSubForm.vue';
//本次请求接口 生长周期子表接口
import { CropGrowthSubApi, CropGrowthSubVO } from '@/api/agriculture/cropgrowthsub';
// 时间格式化工具类
import { formatTime } from '@/utils/index';
import { generateUUID } from '@/utils';
import { initChartStatic, generatePieOptions } from '@/utils/bigscreenTool/index';
import { dateFormatter3 } from '@/utils/formatTime';
import { List, Menu, VideoCameraFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const topMenuHeight = 85;
const contentPadding = 8;
// 展开或收起搜索栏
const showSearch = ref(false);
const handleClickShowSearch = () => {
  showSearch.value = !showSearch.value;
};

const showVideoDialog = ref<boolean>(false);
const activeVideoUrl = ref<string>('');
const handleOpenVideo = (arr, id) => {
  const _item = arr.find((item) => item.id === id);
  console.log('🚀 ~ handleOpenVideo ~ _item:', _item);
  if (!_item.remark) return ElMessage.warning('暂无视频');
  activeVideoUrl.value = _item.remark;
  showVideoDialog.value = true;
};

/** 作物生长周期 列表 */
defineOptions({ name: 'CropGrowthNew' });
const dialogVisible = ref(false);
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const showType = ref('card');
watch(
  () => showType.value,
  (val) => {
    if (val === 'card')
      nextTick(() => {
        initCharts();
      });
  }
);
const loading = ref(true); // 列表的加载中
const list = ref<CropGrowthNewVO[]>([]); // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const listVarietyManagementVO = ref<VarietyManagementVO[]>([]); // 品种列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  growth: undefined,
  feature: undefined,
  remark: undefined,
  createTime: [],
  startTime: [],
  endTime: [],
  cropId: undefined,
  envCondition: undefined,
  growSite: undefined,
  cycle: undefined,
  orders: undefined,
  farmAdvice: undefined,
  startTimeSort: undefined,
  ordersSort: undefined
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
const CategoryManagementQueryParams = reactive({});
const VarietyManagementVOQueryParams = reactive({});

//start事件查看方法
const drawer2 = ref(false);

function cancelClick() {
  thisCropType.value = undefined;
  thisGrowth.value = undefined;
  drawer2.value = false;
}

const formData = ref<CropGrowthSubVO[]>([]);
const thisCropType = ref();
const thisGrowth = ref();
const damn = async (row) => {
  thisCropType.value = row.cropName;
  thisGrowth.value = row.growth;
  const datas = await CropGrowthSubApi.getCropGrowthSubPage({ cropCode: row.id });
  formData.value = datas.list;
  drawer2.value = true;
};
//end事件查看

// TODO: 生长周期卡片 接口参数
const getLabelById = (arr: any[], id: string) => {
  const _item = arr.find((item) => item.id === id);
  if (_item) return _item.itemContent;
  return '';
};

const instanceMap = new Map<string, any>();
const updateInstanceOptions = async (id: string, option, cropCode = '', cropId = '') => {
  console.log('🚀 ~ updateInstanceOptions ~ option:', option);

  if (!option || !id) return;
  const instance = instanceMap.get(id);
  if (instance) instance.setOption(option);
  const res = await CropGrowthNewApi.getCropGrowthCardMap({
    growth: option.title.text,
    cropCode,
    cropId
  });
  if (!Array.isArray(res)) return;
  if (Array.isArray(res)) console.log('🚀 ~ updateInstanceOptions ~ res:', res);
  const _resFiltedItem = res.find((ele) => ele.cropCode === cropCode && ele.cropId === cropId);
  let activeBar = '';
  if (Array.isArray(_resFiltedItem.child2) && _resFiltedItem.child2.length > 0) {
    activeBar = _resFiltedItem.child2[0].id;
  }
  cardDataList.value = cardDataList.value.map((item) => {
    const _id_ = id.split('_')[1];
    if (item.id !== _id_) return item;
    console.log('item.id !== id', item.id !== id);
    return {
      ..._resFiltedItem,
      activeBar,
      id: item.id
    };
  });
};

const initCharts = () => {
  cardDataList.value.forEach((item) => {
    console.log('🚀 ~ initCharts ~ item:', item);
    if (!Array.isArray(item.child1)) return;
    const instance = initChartStatic(
      `chart_${item.id}`,
      generatePieOptions({
        title: {
          text: item.growth,
          subtext: item.cycle + '天',
          left: 'center',
          top: '37%',
          textStyle: {
            color: '#252525',
            fontSize: 15
          },
          subtextStyle: {
            color: '#252525',
            fontSize: 15
          }
        },
        legend: { show: false },
        tooltip: { show: false },
        color: ['#59b756', '#009688', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '80%'],
            center: 'center',
            data: item.child1.map((ele) => ({
              name: ele.growth,
              value: ele.cycle
            })),
            label: {
              position: 'inside',
              formatter: '{b}',
              rich: {
                b: {
                  color: '#c1c1c1',
                  fontSize: 10
                },
                d: {
                  color: '#c1c1c1',
                  fontSize: 10
                }
              }
            },
            emphasis: {
              disabled: false
            },
            itemStyle: {
              borderWidth: 5,
              borderColor: '#ffffff'
            }
          }
        ]
      })
    );
    console.log('🚀 ~ instance&&instance.on ~ instance:', instance);
    const existIns = instanceMap.has(`chart_${item.id}`);
    if (!existIns) instanceMap.set(`chart_${item.id}`, instance);
    instance &&
      instance.on('click', (params) => {
        console.log('🚀 ~ instance&&instance.on ~ params:', params);
        item.growth = params.name;
        updateInstanceOptions(
          `chart_${item.id}`,
          {
            title: {
              text: params.name,
              subtext: params.value + '天'
            }
          },
          item.cropCode,
          item.cropId
        );
      });
  });
};
const cardDataList = ref<any[]>([]);
const getCardDataList = async () => {
  const res = await CropGrowthNewApi.getCropGrowthCardMap({});
  console.log('getCardDataList', getCardDataList);
  if (Array.isArray(res)) {
    cardDataList.value = res.map((item) => ({
      ...item,
      id: generateUUID(),
      activeBar: Array.isArray(item.child2) && item.child2.length > 0 ? item.child2[0].id : ''
    }));
    console.log('🚀 ~ cardDataList.value=res.map ~ cardDataList.value:', cardDataList.value);
    nextTick(() => {
      initCharts();
    });
  }
};
getCardDataList();

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await CropGrowthNewApi.getCropGrowthNewPage(queryParams);
    // @ts-ignore
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams);
    list.value = data.list;
    total.value = data.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  if (showType === 'card') getCardDataList();
  else getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  plantNum.value = 2;
  timeNum.value = 2;
  queryFormRef.value.resetFields();
  handleQuery();
};

// 时间排序
const timeNum = ref(2);
const sortChange = async (val) => {
  timeNum.value = val;
  plantNum.value = 2;
  if (val == 2) {
    queryParams.ordersSort = undefined;
    queryParams.startTimeSort = undefined;
    getList();
  } else {
    queryParams.ordersSort = undefined;
    queryParams.startTimeSort = val;
    getList();
  }
};
//种植排序
const plantNum = ref(2);
const plantChange = async (val) => {
  console.log(val, 'zhongzhipaixu ');
  timeNum.value = 2;
  plantNum.value = val;
  if (val == 2) {
    queryParams.ordersSort = undefined;
    queryParams.startTimeSort = undefined;
    getList();
  } else {
    queryParams.ordersSort = val;
    queryParams.startTimeSort = undefined;
    getList();
  }
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
    await CropGrowthNewApi.deleteCropGrowthNew(id);
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
    const data = await CropGrowthNewApi.exportCropGrowthNew(queryParams);
    download.excel(data, '作物生长周期.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 添加生长周期子表操作 */
const subformRef = ref();
const openSubDeviceForm = (id, growth) => {
  subformRef.value.open('create', id, growth);
};

const initValue = async () => {
  const data1 = await VarietyManagementApi.getVarietyManagementPage(queryParams1);
  listVarietyManagementVO.value = data1.list;
};
const vedioUrl = ref('');
const lookVedio = (item) => {
  vedioUrl.value = item.remark;
  dialogVisible.value = true;
};
/** 初始化 **/
onMounted(() => {
  getList();
  initValue();
});
</script>
<style lang="scss" scoped>
.tab-btn,
.tab-btn-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 1.5rem;
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

.chart-bg {
  background-image: url(./chart.png);
  background-size: 100% 100%;
}

.progress-bar-active {
  position: absolute;
  left: 0px;
  bottom: -15px;
  width: 1400px;
  height: 2px;
  background-color: #b7b7b7;
}

.progress-bar-active::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #009688;
  border-radius: 5px;
  position: absolute;
  top: -4px;
}

.progress-bar {
  position: absolute;
  left: 0px;
  bottom: -15px;
  width: 1400px;
  height: 2px;
  background-color: #b7b7b7;
}

.progress-bar::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #009688;
  border-radius: 5px;
  position: absolute;
  top: -4px;
}

.right-content-wrapper {
  display: none;
}

@media screen and (min-width: 1400px) {
  .right-content-wrapper {
    display: block;
    width: 500px;
  }
}

@media screen and (min-width: 1500px) {
  .right-content-wrapper {
    display: block;
    width: 600px;
  }
}

@media screen and (min-width: 1700px) {
  .right-content-wrapper {
    display: block;
    width: 800px;
  }
}

@media screen and (min-width: 2000px) {
  .right-content-wrapper {
    display: block;
    width: 1100px;
  }
}

.time-icon {
  cursor: pointer;
  background-size: 100% 100%;
  background-image: url(../../../assets/imgs/time-icon.png);
}

.time-icon2 {
  cursor: pointer;

  background-size: 100% 100%;
  background-image: url(../../../assets/imgs/time-icon2.png);
}
</style>

<style lang="scss" scoped>
// 鼠标移在按钮上时显示主题色边框
:deep(.el-button:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-table th.el-table__cell) {
  background-color: var(--el-table-row-hover-bg-color);
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
