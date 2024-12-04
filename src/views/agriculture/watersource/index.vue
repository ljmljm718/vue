<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">水源管理</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:water-source:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center">
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
          v-hasPermi="['agriculture:water-source:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
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

    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="水源编号" prop="wsCode">
        <el-input
          v-model="queryParams.wsCode"
          placeholder="请输入水源编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水源名称" prop="wsName">
        <el-input
          v-model="queryParams.wsName"
          placeholder="请输入水源名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省市区" prop="areaLocation">
        <el-cascader
          :options="areaSelectData"
          style="width: 100%"
          @change="handleChange"
          v-model="queryParams.district"
          placeholder="请选择省市区"
        />
      </el-form-item>
      <el-form-item label="水源类型" prop="wsType">
        <el-select v-model="queryParams.wsType" placeholder="请选择水源类型" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WS_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="w-full mt-[16px]">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <!--        <el-table-column label="主键" align="center" prop="id" />-->
        <el-table-column label="水源编号" align="center" prop="wsCode" />
        <el-table-column label="水源名称" align="center" prop="wsName" />
        <el-table-column label="水源类型" align="center" prop="wsType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WS_TYPE" :value="scope.row.wsType" />
          </template>
        </el-table-column>
        <el-table-column label="省市区" align="center" prop="areaLocation" width="200px">
          <template #default="scope">
            {{
              codeToText[scope.row.province] +
              '/' +
              codeToText[scope.row.city] +
              '/' +
              codeToText[scope.row.district]
            }}
          </template>
        </el-table-column>
        <el-table-column label="最高水位（米）" align="center" prop="maxLevel" />
        <el-table-column label="最低水位（米）" align="center" prop="minLevel" />
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="纬度" align="center" prop="latitude" />
        <!--        <el-table-column-->
        <!--          label="创建时间"-->
        <!--          align="center"-->
        <!--          prop="createTime"-->
        <!--          :formatter="dateFormatter"-->
        <!--          width="180px"-->
        <!--        />-->
        <el-table-column label="操作" align="center" fixed="right" min-width="184px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button link type="success" @click="bindDevice(scope.row)">绑定设备</el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:water-source:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:water-source:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>

  <!-- 页面组件复制在下面 -->
  <ContentWrap>
    <el-drawer
      title="绑定设备"
      v-model="drawer"
      :direction="direction"
      :before-close="handleClose"
      :with-header="false"
    >
      <span>已绑定设备</span>
      <ContentWrap>
        <el-table
          v-if="listDevice.length > 0"
          v-loading="loadingDevice"
          :data="listDevice"
          :show-overflow-tooltip="true"
          :stripe="true"
        >
          <el-table-column label="设备名称" align="center" prop="deviceName" width="150" />
          <el-table-column label="设备类型" align="center" prop="deviceType" width="200">
            <template #default="scope">
              <el-cascader
                style="width: 100%"
                v-model="scope.row.deviceType"
                :options="categoryOptions"
                :props="categoryProps"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="所属基地" align="center" prop="belongPark" />
          <el-table-column label="所属地块" align="center" prop="belongPlot" />
          <el-table-column label="状态" align="center" prop="deviceStatus">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus" />
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
          <el-table-column label="经度" align="center" prop="longitude" />
          <el-table-column label="纬度" align="center" prop="latitude" />
          <el-table-column label="操作" align="center" fixed="right" width="40">
            <template #default="scope">
              <el-button link type="danger" @click="handleRemove(scope.row.id)">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="color-[#808080] mx-auto w-100px">暂无数据</div>
      </ContentWrap>
      <el-row>
        <el-button
          type="primary"
          plain
          style="width: 100%; height: 60px"
          @click="bindDeviceDialog()"
        >
          +增加绑定设备
        </el-button>
      </el-row>
    </el-drawer>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <WaterSourceForm ref="formRef" @success="getList" />

  <!-- 绑定设备列表 -->
  <BindDevice ref="wsBindDeviceRef" :deviceId="deviceId" @success="handleUpdateDeviceInfo" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { WaterSourceApi, WaterSourceVO } from '@/api/agriculture/watersource';
import WaterSourceForm from './WaterSourceForm.vue';
import { codeToText, regionData } from 'element-china-area-data';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';
import { ElTable } from 'element-plus';
import { DeviceCategoryApi } from '@/api/agriculture/devicecategory';
import { DeviceInfoVO } from '@/api/agriculture/deviceinfo';
import { WaterSourceDeviceApi } from '@/api/agriculture/watersourcedevice';
import BindDevice from './components/BindDevice.vue';

/** 水源信息 列表 */
defineOptions({ name: 'WaterSource' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<WaterSourceVO[]>([]); // 列表的数据
const listDevice = ref<DeviceInfoVO[]>([]); // 抽屉已绑定设备列表的数据
const total = ref(0); // 列表的总页数
const areaLocation = ref(); // 省市区的统一回显
const areaSelectData = regionData; // options绑定的数据就是引入的 regionData
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  wsCode: undefined,
  wsName: undefined,
  wsType: undefined,
  // province: undefined,
  // city: undefined,
  district: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
//绑定设备抽屉相关参数
const drawer = ref(false);
const direction = ref('rtl');
let categoryOptions = ref([]); // 设备分类选项
/**
 * 设备分类级联选择器
 */
const categoryProps = {
  value: 'id',
  label: 'categoryName'
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await WaterSourceApi.getWaterSourcePage(queryParams);
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
  queryParams.district = undefined;
  areaLocation.value = undefined;
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await WaterSourceApi.deleteWaterSource(id);
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
    const data = await WaterSourceApi.exportWaterSource(queryParams);
    download.excel(data, '水源信息.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

// 编辑格式化地址
const handleChange = (e) => {
  const self = e;
  // CodeToText属性是区域码，属性值是汉字 CodeToText['110000']输出北京市
  // queryParams.province = self[0];
  // queryParams.city = self[1];
  queryParams.district = self[2];
  areaLocation.value = codeToText[self[0]] + '/' + codeToText[self[1]] + '/' + codeToText[self[2]];
};

/** 绑定设备操作 */
const loadingDevice = ref(true); // 绑定设备抽屉的加载
const deviceId = ref([]); // 已绑定的设备id
const wsId = ref(''); // 水源id
// const monitorType = ref(''); //所选设备监测类型
const wsBindDeviceRef = ref();
// 绑定弹窗确定后回调函数
const handleUpdateDeviceInfo = async (ids) => {
  const temp = { wsId: wsId.value, deviceId: ids.value };
  const params = temp as any;
  await WaterSourceDeviceApi.WsBindDevice(params);
  message.success(t('common.createSuccess'));
  const data = await WaterSourceDeviceApi.selectDeviceListByWsId(wsId.value);
  listDevice.value = data.map((item: any) => {
    item.deviceType = item.deviceType.split(',').map(Number);
    return item;
  });
};
const bindDevice = async (row) => {
  const { id } = row;
  loadingDevice.value = true;
  try {
    drawer.value = true;
    const data = await WaterSourceDeviceApi.selectDeviceListByWsId(id);
    listDevice.value = data.map((item: any) => {
      item.deviceType = item.deviceType.split(',').map(Number);
      return item;
    });
    wsId.value = id;
    loadingDevice.value = false;
  } catch {
    loadingDevice.value = false;
  }
};
/** 移除按钮操作 */
const handleRemove = async (id: number) => {
  try {
    // 移除的二次确认
    await message.delConfirm();
    // 发起移除
    await WaterSourceDeviceApi.deleteBindRecordByWsIdAndDeviceId(wsId.value, id);
    const data = await WaterSourceDeviceApi.selectDeviceListByWsId(wsId.value);
    listDevice.value = data.map((item: any) => {
      item.deviceType = item.deviceType.split(',').map(Number);
      return item;
    });
    message.success(t('common.delSuccess'));
  } catch {}
};
// 打开绑定设备弹窗
const bindDeviceDialog = async () => {
  try {
    const data = await WaterSourceDeviceApi.selectBindDeviceIdByWsId(wsId.value);
    deviceId.value = data.map((item) => item.deviceId);
    wsBindDeviceRef.value.open();
  } catch {}
};

/** 查询设备分类列表 */
const getDeviceCategoryTree = async () => {
  try {
    categoryOptions.value = await DeviceCategoryApi.getDeviceCategoryTree({
      parentId: 0,
      status: 1
    });
  } finally {
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
  getDeviceCategoryTree();
});
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
