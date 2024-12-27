<template>
  <el-card
    class="!overflow-visible"
    body-style="padding: 16px; display: flex; flex-direction: column;"
    shadow="never"
  >
    <!-- title -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-[16px]">
        <h1 class="m-0 text-[18px] pr-[16px]" style="border-right: 1px solid #e6e6e6">监控抓拍</h1>
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agri:monitoring-equipment-data:create']"
        >
          <Icon icon="ep:plus" />
          <span>新增</span>
        </el-button>
      </div>
      <div class="flex items-center space-x-[8px]">
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" />
          <span>搜索</span>
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />
          <span>重置</span>
        </el-button>
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agri:monitoring-equipment-data:export']"
        >
          <Icon icon="ep:download" />
          <span>导出</span>
        </el-button>
        <!-- el-radio-button比el-button高 和button放在一行突兀 所以用el-button实现el-radio-button效果 单独使用时el-radio-button更佳 -->
        <div class="flex">
          <el-button
            @click="listType = 'list'"
            class="!rounded-r-none"
            :class="`${listType === 'list' && 'tab-active'}`"
          >
            <Icon icon="ep:list" />
          </el-button>
          <el-button
            @click="listType = 'card'"
            class="!ml-0 !rounded-l-none"
            :class="`${listType === 'card' && 'tab-active'}`"
          >
            <Icon icon="ep:menu" />
          </el-button>
        </div>
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
    <!-- search form -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-[8px] mt-[16px] form overflow-hidden"
      :style="`${!showSearch && 'height: 0'}`"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="基地名称" prop="monitoringBaseName">
        <el-input v-model="queryParams.monitoringBaseName" placeholder="请选择" clearable>
          <template #append>
            <el-button @click="openParkPopup('0')" class="!p-0 flex justify-center items-center">
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="地块名称" prop="monitoringPlotName">
        <el-input v-model="queryParams.monitoringPlotName" placeholder="请选择" clearable>
          <template #append>
            <el-button
              @click="openPlotPopup(queryParams.monitoringBaseId)"
              class="!p-0 flex justify-center items-center"
            >
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="queryParams.deviceName" placeholder="请选择" clearable>
          <template #append>
            <el-button
              @click="openSelectDeviceInfo()"
              class="!p-0 flex justify-center items-center"
            >
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="录入方式" prop="reserveOne">
        <el-select v-model="queryParams.reserveOne" placeholder="请选择" clearable>
          <el-option
            v-for="dict in options"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="拍摄时间" prop="reserveTwo">
        <el-date-picker
          v-model="queryParams.reserveTwo"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          clearable
        />
      </el-form-item>
    </el-form>
    <!-- main content -->
    <div class="mt-[16px]">
      <!-- list -->
      <el-table
        v-show="listType === 'list'"
        :data="list"
        v-loading="loading"
        :show-overflow-tooltip="true"
      >
        <el-table-column align="center" prop="monitoringBaseName" label="基地名称" />
        <el-table-column align="center" prop="monitoringPlotName" label="地块名称" />
        <el-table-column align="center" prop="deviceName" label="设备名称" />
        <el-table-column align="center" prop="reserveOne" label="录入方式" />
        <el-table-column label="抓拍图片" align="center" prop="capturedImage">
          <template #default="scope">
            <el-image
              class="h-50px w-50px"
              :src="scope.row.capturedImage"
              :preview-src-list="[scope.row.capturedImage]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="图片拍摄时间"
          align="center"
          prop="reserveTwo"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="备注" align="center" prop="remarks" />
        <el-table-column align="center" label="操作" fixed="right" width="280px">
          <template #default="scope">
            <el-button
              type="primary"
              v-show="scope.row.videoLink"
              @click="openVideo(scope.row.videoLink)"
            >
              查看视频
            </el-button>
            <el-button
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agri:monitoring-equipment-data:update']"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agri:monitoring-equipment-data:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- card -->
      <div v-show="listType === 'card'" v-loading="loading" class="grid grid-cols-2 gap-[16px]">
        <div>
          <div class="sticky top-0 w-full pb-[16px] rounded-b-[4px] shadow-md dark:shadow-[#000]">
            <template v-if="currentIdx !== -1 && list[currentIdx]">
              <div class="w-full pb-[56.25%] relative">
                <el-image
                  :src="list[currentIdx].capturedImage"
                  :alt="list[currentIdx].deviceName"
                  :preview-src-list="[list[currentIdx].capturedImage]"
                  preview-teleported
                  fit="cover"
                  class="!absolute top-0 left-0 w-full h-full"
                />
                <div
                  v-show="list[currentIdx].videoLink"
                  @click="openVideo(list[currentIdx].videoLink)"
                  class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                >
                  <el-icon size="16px"><VideoCamera /></el-icon>
                </div>
                <div
                  class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[60px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                  @click="openForm('update', list[currentIdx].id)"
                >
                  <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
                </div>
                <div
                  class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[10px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                  @click="handleDelete(list[currentIdx].id)"
                >
                  <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
                </div>
              </div>
              <div class="text-[8px] 2xl:text-[10px]">
                <div class="p-[1.6em] flex justify-between">
                  <span class="font-bold text-[1.4em]">{{ list[currentIdx].deviceName }}</span>
                  <span class="text-[#999] text-[1.4em]">
                    {{ timeFormat(list[currentIdx].reserveTwo) }}
                  </span>
                </div>
                <div style="border-bottom: 1px dashed #e6e6e6" class="mx-[1.6em]"></div>
                <div class="mt-[1.6em] px-[1.6em] flex justify-between">
                  <span class="text-[#999] text-[1.4em]">基地名称:</span>
                  <span class="text-[#999] text-[1.4em]">
                    {{ list[currentIdx].monitoringBaseName }}
                  </span>
                </div>
                <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                  <span class="text-[#999] text-[1.4em]">地块名称:</span>
                  <span class="text-[#999] text-[1.4em]">
                    {{ list[currentIdx].monitoringPlotName }}
                  </span>
                </div>
                <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                  <span class="text-[#999] text-[1.4em]">录入方式:</span>
                  <span class="text-[#999] text-[1.4em]">{{ list[currentIdx].reserveOne }}</span>
                </div>
                <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                  <span class="text-[#999] text-[1.4em]">备注:</span>
                  <span class="text-[#999] text-[1.4em]">
                    {{ list[currentIdx].remarks ? list[currentIdx].remarks : '无' }}
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="w-full pb-[56.25%] no-data"></div>
            </template>
          </div>
        </div>
        <div>
          <div class="grid grid-cols-2 xl:grid-cols-3 gap-[16px]">
            <div
              class="cursor-pointer shadow-md rounded-[4px] overflow-hidden pb-[16px] dark:bg-[#333] dark:shadow-[#000]"
              v-for="(item, index) in list"
              :key="item.id"
              @click="currentIdx = index"
              :style="`${index === currentIdx && 'border: 1px solid var(--el-color-primary)'}`"
            >
              <div class="w-full pb-[56.25%] relative">
                <el-image
                  :src="item.capturedImage"
                  :alt="item.deviceName"
                  fit="cover"
                  class="!absolute top-0 left-0 w-full h-full"
                />
              </div>
              <div class="text-[8px] 2xl:text-[10px] px-[1.6em] mt-[1.6em]">
                <div>
                  <span class="truncate text-[1.4em]">{{ item.deviceName }}</span>
                </div>
                <div class="mt-[0.8em]">
                  <span class="truncate text-[1.4em]">{{ timeFormat(item.reserveTwo) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- pagnition -->
      <Pagination
        style="margin-bottom: 0; margin-top: 16px"
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList()"
      />
    </div>
  </el-card>

  <!-- 表单弹窗：添加/修改 -->
  <MonitoringEquipmentDataForm ref="formRef" @success="handleUpdateSuccess" />
  <!-- 视频弹窗 -->
  <el-dialog
    v-model="isShow"
    title="查看视频"
    width="46.88%"
    class="video-dialog h-[65.29%]"
    @close="closeDialog"
  >
    <div class="w-full h-full flex justify-center">
      <video class="w-full h-full" :src="videoUrl" controls autoplay></video>
    </div>
  </el-dialog>
  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange" />
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange" />
  <!--  选择设备-->
  <SelectDeviceInfo ref="SelectDeviceInfoRef" @success="SelectDeviceInfoSuccess" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import {
  MonitoringEquipmentDataApi,
  MonitoringEquipmentDataVO
} from '@/api/agriculture/monitoringequipmentdata';
// @ts-ignore
import MonitoringEquipmentDataForm from './MonitoringEquipmentDataForm.vue';
// @ts-ignore
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue';
// @ts-ignore
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue';
// @ts-ignore
import SelectDeviceInfo from '@/views/agriculture/deviceinfo/SelectDeviceInfoForms.vue';
import { useAppStore } from '@/store/modules/app';
import { watch } from 'vue';

/** 监控设备数据 列表 */
defineOptions({ name: 'MonitoringEquipmentData' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<MonitoringEquipmentDataVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive<any>({
  pageNo: 1,
  pageSize: 9,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  capturedImage: undefined,
  videoLink: undefined,
  remarks: undefined,
  reserveOne: undefined,
  reserveTwo: [],
  reserveThree: undefined,
  createTime: []
});

const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

const options = [
  {
    value: '人工',
    label: '人工'
  },
  {
    value: '机器',
    label: '机器'
  }
];

// openVideo
let videoUrl = ref();
let isShow = ref(false);
const openVideo = (video: any) => {
  videoUrl.value = video;
  isShow.value = true;
};
const closeDialog = () => {
  isShow.value = false;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  currentIdx.value = -1;
  try {
    const data = await MonitoringEquipmentDataApi.getMonitoringEquipmentDataPage(queryParams);
    // console.log("data", data)
    list.value = data.list;
    total.value = data.total;
    if ('card' === listType.value) {
      currentIdx.value = list.value.length > 0 ? 0 : -1;
    }
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = async () => {
  if (queryParams.monitoringBaseName == null || queryParams.monitoringBaseName == '') {
    queryParams.monitoringBaseName = undefined;
    queryParams.monitoringBaseId = undefined;
  }
  if (queryParams.monitoringPlotName == null || queryParams.monitoringPlotName == '') {
    queryParams.monitoringPlotName = undefined;
    queryParams.monitoringPlotId = undefined;
  }
  if (queryParams.deviceName == null || queryParams.deviceName == '') {
    queryParams.deviceName = undefined;
    queryParams.deviceId = undefined;
  }
  queryParams.pageNo = 1;
  await getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

// 列表展示类型
const listType = ref('card');

// 切换列表展示类型
const handleCardChange = async () => {
  queryParams.pageNo = 1;
  await getList();
};

watch(listType, handleCardChange);

// 当前查看的数据下标
const currentIdx = ref(-1);

/** 添加/修改操作 */
const formRef = ref();
const tmpIndex = ref(-1);
const openForm = (type: string, id?: number) => {
  // 新增和编辑前 保存当前查看项的下标
  if ('card' === listType.value) {
    tmpIndex.value = list.value.findIndex((ele) => {
      return ele.id === list.value[currentIdx.value].id;
    });
  }

  // 新增前 清空表单数据
  // if ("create" === type) {
  //   resetQuery()
  // }

  formRef.value.open(type, id);
};

// 新增和修改成功后调用的函数
const handleUpdateSuccess = async () => {
  await getList();
  if ('card' !== listType.value) return;
  if (-1 !== tmpIndex.value) {
    currentIdx.value = tmpIndex.value;
    tmpIndex.value = -1;
  }
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  // 保留当前展示项的下标
  let tmp: number = -1;
  tmp = list.value.findIndex((ele) => {
    return ele.id === list.value[currentIdx.value].id;
  });

  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await MonitoringEquipmentDataApi.deleteMonitoringEquipmentData(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}

  if (-1 === tmp) return;
  if (tmp >= list.value.length) {
    currentIdx.value = list.value.length - 1;
  } else {
    currentIdx.value = tmp;
  }
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await MonitoringEquipmentDataApi.exportMonitoringEquipmentData(queryParams);
    download.excel(data, '监控设备数据.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
getList();

//基地的选择
const parkPopupRef = ref();
const openType = ref('');
const openParkPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === '') {
    message.error('请选择基地');
  } else parkPopupRef.value.open(id);
};
const handleParkPopupChange = (order: any) => {
  if (openType.value === '0') {
    queryParams.monitoringBaseId = String(order[0].id);
    queryParams.monitoringBaseName = String(order[0].name);
  } else queryParams.monitoringBaseName = String(order[0].name);
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
const handlePlotPopupChange = (order: any) => {
  console.log('--->>查看选择的地块信息：', order[0]);
  queryParams.monitoringPlotName = String(order[0].name);
};
// 机器信息选择
const SelectDeviceInfoRef = ref();
const openSelectDeviceInfo = () => {
  SelectDeviceInfoRef.value.open('jk'); //监控
};
//点击确定后
const SelectDeviceInfoSuccess = (item: any) => {
  queryParams.deviceId = item[0].id;
  queryParams.deviceName = item[0].deviceName;
};

// 时间戳转换成 YYYY-MM-DD HH:MM:SS
const timeFormat = (dataString: string) => {
  //dataString是整数，否则要parseInt转换
  var time = new Date(dataString);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  return (
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (day < 10 ? '0' + day : day) +
    ' ' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minute < 10 ? '0' + minute : minute) +
    ':' +
    (second < 10 ? '0' + second : second)
  );
};

const showSearch = ref(true);
</script>

<style scoped lang="scss">
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

.no-data {
  background-image: url(/images/noData.png);
  background-size: 100% 100%;
}
</style>

<style lang="scss">
.video-dialog .el-dialog__body {
  height: calc(100% - 54px);
  box-sizing: border-box;
}
</style>
