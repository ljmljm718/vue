<template>
  <el-scrollbar
    class="w-full bg-white dark:bg-#333 rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding + 4) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="m-0 text-[#333] dark:text-[#ccc] font-bold text-[18px]">灌区管理</h1>
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:irrigation-area:create']"
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
          v-hasPermi="['agriculture:irrigation-area:export']"
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
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="灌区名称" prop="iaName">
        <el-input
          v-model="queryParams.iaName"
          placeholder="请输入灌区名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="喷灌类型" prop="irrigationType">
        <el-select
          v-model="queryParams.irrigationType"
          placeholder="请选择喷灌类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_IRRIGATION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="principal">
        <el-input
          v-model="queryParams.principal"
          placeholder="请输入负责人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="contactInformation">
        <el-input
          v-model="queryParams.contactInformation"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
    </el-form>

    <div class="w-full mt-[16px]">
      <el-table
        v-show="listType === 'list'"
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column type="expand">
          <template #default="scope">
            <el-tabs model-value="parkDetail">
              <el-tab-pane label="地块列表" name="parkDetail">
                <IrrigationParkDetailList :irrigation-id="scope.row.id" />
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <el-table-column label="灌区编号" align="center" prop="iaCode" />
        <el-table-column label="灌区名称" align="center" prop="iaName" />
        <el-table-column label="喷灌类型" align="center" prop="irrigationType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_IRRIGATION_TYPE" :value="scope.row.irrigationType" />
          </template>
        </el-table-column>
        <el-table-column label="阀门状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <el-switch
              v-model="scope.row.deviceStatus"
              active-value="online"
              inactive-value="offline"
              @change="handleStatus(scope.row)"
              v-if="scope.row.deviceStatus != null"
            />
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="iaImage">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.iaImage"
              :preview-src-list="[row.iaImage]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="纬度" align="center" prop="latitude" />
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="负责人" align="center" prop="principal" />
        <el-table-column label="联系方式" align="center" prop="contactInformation" />
        <el-table-column label="地址" align="center" prop="isAddress" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="scope">
            <!--            <el-button-->
            <!--              link-->
            <!--              type="primary"-->
            <!--              @click="handleDraw(scope.row)"-->
            <!--              v-hasPermi="['agriculture:irrigation-area:update']"-->
            <!--            >-->
            <!--              绘制围栏-->
            <!--            </el-button>-->
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agriculture:irrigation-area:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="warning"
              @click="bindSolenoidValve(scope.row.id)"
              v-if="scope.row.deviceId === null"
            >
              绑定电磁阀
            </el-button>
            <el-button
              link
              type="primary"
              @click="notBindSolenoidValve(scope.row.id)"
              v-if="scope.row.deviceId != null"
            >
              解绑电磁阀
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:irrigation-area:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="listType === 'list'">
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>

      <div
        v-show="listType === 'card'"
        :style="`height: calc(100vh - ${showSearch ? '220px' : '194px'});`"
      >
        <el-scrollbar>
          <div class="flex justify-center items-center">
            <div class="container gap-[8px] grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="item in list"
                :key="item.id"
                class="shadow-md rounded-2 p-[8px] box-border flex items-start space-x-[8px]"
                style="border: 1px solid var(--el-border-color)"
              >
                <img :src="item.iaImage" alt="" class="w-100px h-100px object-cover" />
                <div class="space-y-[6px] text-12px">
                  <div class="font-bold text-15px">{{ item.iaName }}</div>
                  <div class="flex items-center">
                    <div class="w-80px">类型:</div>
                    <dict-tag :type="DICT_TYPE.WFI_IRRIGATION_TYPE" :value="item.irrigationType" />
                  </div>
                  <div class="flex items-center">
                    <div class="w-80px">阀门状态:</div>
                    <el-tag :type="`${item.deviceStatus === 'online' ? 'success' : 'danger'}`">
                      {{ item.deviceStatus === 'online' ? '开' : '关' }}
                    </el-tag>
                  </div>
                  <div class="flex">
                    <!--                    <el-button-->
                    <!--                      type="primary"-->
                    <!--                      @click="handleDraw(item)"-->
                    <!--                      v-hasPermi="['agriculture:irrigation-area:update']"-->
                    <!--                    >-->
                    <!--                      绘制围栏-->
                    <!--                    </el-button>-->
                    <el-button
                      type="primary"
                      @click="openForm('update', item.id)"
                      v-hasPermi="['agriculture:irrigation-area:update']"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="warning"
                      class="!ml-8px"
                      @click="bindSolenoidValve(item.id)"
                      v-if="item.deviceId === null"
                    >
                      绑定电磁阀
                    </el-button>
                    <el-button
                      type="primary"
                      class="!ml-8px"
                      @click="notBindSolenoidValve(item.id)"
                      v-if="item.deviceId != null"
                    >
                      解绑电磁阀
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </el-scrollbar>
      </div>
    </div>
  </el-scrollbar>
  <fence-dialog
    v-model="showDrawDialog"
    title="绘制围栏"
    width="80vw"
    draggable
    append-to-body
    destroy-on-close
  >
    <div class="w-full h-full">
      <map-custom ref="tiandiIns" :enableEdit="true" />
    </div>
    <template #footer>
      <el-button size="small" @click="handleCancel()">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm()">确 定</el-button>
    </template>
  </fence-dialog>
  <!-- 表单弹窗：添加/修改 -->
  <IrrigationAreaForm ref="formRef" @success="getList" />
  <SelectValvesDeviceFrom ref="selectValvesDeviceRef" @success="selectValvesDeviceSuccess" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { IrrigationAreaApi, IrrigationAreaVO } from '@/api/agriculture/irrigationarea';
import IrrigationAreaForm from './IrrigationAreaForm.vue';
import SelectValvesDeviceFrom from '@/views/agriculture/irrigationarea/components/SelectValvesDeviceFrom.vue';
import { DeviceInfoApi } from '@/api/agriculture/deviceinfo';
import { ElMessage } from 'element-plus';
import FenceDialog from '@/views/agriculture/parkinfo/components/fenceDialog.vue';
import { CropGrowthNewApi } from '@/api/agri/cropgrowthnew';
import IrrigationParkDetailList from '@/views/agriculture/irrigationarea/components/IrrigationParkDetailList.vue';
/** 灌区信息 列表 */
defineOptions({ name: 'IrrigationArea' });

const topMenuHeight = 85;
const contentPadding = 8;
const listType = ref<string>('card'); // 卡片 card 列表 list
const handleCardChange = async () => {
  queryParams.pageNo = 1;
  await getList();
  // 切换回卡片时需要设置图片列表移动到第一项
  if ('card' === listType.value) {
    // TODO 单独处理卡片列表
  }
};
// 展开或收起搜索栏
const showSearch = ref(false);
const handleClickShowSearch = () => {
  showSearch.value = !showSearch.value;
};

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<IrrigationAreaVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  iaCode: undefined,
  iaName: undefined,
  irrigationType: undefined,
  iaImage: undefined,
  geofencing: undefined,
  latitude: undefined,
  longitude: undefined,
  principal: undefined,
  contactInformation: undefined,
  isAddress: undefined,
  remark: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const router = useRouter(); // 路由
const enableSwitch = ref<boolean>(false);

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  enableSwitch.value = false;
  try {
    const data = await IrrigationAreaApi.getIrrigationAreaPage(queryParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
    nextTick(() => {
      enableSwitch.value = true;
    });
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
  if (id) router.push(`/integrationWaterFertilizer/irrigate/irrigationArea/create?id=${id}`);
  else router.push(`/integrationWaterFertilizer/irrigate/irrigationArea/create`);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await IrrigationAreaApi.deleteIrrigationArea(id);
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
    const data = await IrrigationAreaApi.exportIrrigationArea(queryParams);
    download.excel(data, '灌区信息.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

const selectValvesDeviceRef = ref();
/** 绑定电磁阀 */
const bindSolenoidValve = async (id: string) => {
  selectValvesDeviceRef.value.open(id);
};
/** 绑定成功*/
const selectValvesDeviceSuccess = async (item: any) => {
  await IrrigationAreaApi.bindValvesDevice(item[0].belongIrrigationArea, item[0].id);
  message.success('绑定成功');
  await getList();
};
/** 解绑电磁阀*/
const notBindSolenoidValve = async (id: string) => {
  try {
    // 解绑的二次确认
    await message.confirm('是否确认解绑电磁阀');
    // 发起解绑
    await IrrigationAreaApi.notBindValvesDevice(id);
    message.success('解绑成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 开关机 */
const handleStatus = async (item: any) => {
  if (!enableSwitch.value) return;
  let s = item.deviceStatus === 'online' ? '开启' : '关闭';

  try {
    // 开关机的二次确认
    await message.confirm('是否确认' + s + '?', s + '确认');
    // 发起开关机
    let status = item.deviceStatus === 'online' ? 'online' : 'offline';
    await DeviceInfoApi.updateDeviceStatus(item.deviceId, status);
    message.alertSuccess(s + '成功');
    // 刷新列表
    await getList();
  } catch {
    item.deviceStatus = item.deviceStatus === 'online' ? 'offline' : 'online';
  }
};

// 绘制围栏
const selectedDrawId = ref('');
const showDrawDialog = ref<boolean>(false);
const tiandiIns = ref();
const handleDraw = (item) => {
  const { id, geofencing } = item;
  if (!id) {
    ElMessage.error('当前数据ID不存在');
    return;
  }
  selectedDrawId.value = id;
  showDrawDialog.value = true;
  nextTick(() => {
    if (geofencing) {
      const _arr = JSON.parse(geofencing);
      if (Array.isArray(_arr) && _arr.length === 1) {
        const _polyArr = _arr[0].map((ele) => [ele.lat, ele.lng]);
        setTimeout(() => {
          tiandiIns.value.createPolygon(_polyArr);
        }, 500);
      } else {
        // TODO： 新版
        const { corrdinates, option } = JSON.parse(geofencing);
        if (Array.isArray(corrdinates) && corrdinates.length > 0) {
          setTimeout(() => {
            tiandiIns.value.createPolygon(
              corrdinates[0].map((location) => [location.lat, location.lng]),
              option
            );
          }, 500);
        }
      }
    } else {
      // TODO 如果不存在围栏，把中心点设置在基地中间
      if (activeBaseCenter.value.length !== 2) return;
      nextTick(() => {
        tiandiIns.value.setCenterZoom(activeBaseCenter.value, 17);
      });
    }
  });
};
// TODO 设置活动的基地
const activeBaseCenter = ref<number[]>([]);
const handleConfirm = async () => {
  const geofencing = tiandiIns.value.getCurrentSaveCoordinates();
  const { corrdinates, option } = geofencing;
  if (!Array.isArray(corrdinates)) return ElMessage.error('您还未选择区域!');
  if (corrdinates.length < 1) return ElMessage.error('您还未选择区域!');
  const data = await CropGrowthNewApi.saveGeofencing({
    id: selectedDrawId.value,
    geofencing: JSON.stringify(geofencing),
    infraType: '3' //灌区
  });

  if (data) ElMessage.success('保存成功!');
  else ElMessage.error('保存失败！');
  showDrawDialog.value = false;
  selectedDrawId.value = '';
  getList(true);
};

const handleCancel = () => {
  selectedDrawId.value = '';
  showDrawDialog.value = false;
};

/** 初始化 **/
onMounted(() => {
  getList();
});

/** 初始化 **/
onActivated(() => {
  getList();
});
</script>
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
