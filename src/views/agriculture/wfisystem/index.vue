<script setup lang="ts">
/* 原页面的js代码复制在下面 包括import */
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { WfiSystemApi, WfiSystemVO } from '@/api/agriculture/wfisystem';
import WfiSystemForm from './WfiSystemForm.vue';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';
import { ElTable } from 'element-plus';
import { DeviceInfoVO } from '@/api/agriculture/deviceinfo';
import WfiSystemBindDevice from '@/views/agriculture/wfisystem/component/WfiSystemBindDevice.vue';

/** 水肥一体化系统信息 列表 */
defineOptions({ name: 'WfiSystem' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<WfiSystemVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  sysCode: undefined,
  sysName: undefined,
  belongWaterSource: undefined,
  sysStatus: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await WfiSystemApi.getWfiSystemPage(queryParams);
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
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await WfiSystemApi.deleteWfiSystem(id);
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
    const data = await WfiSystemApi.exportWfiSystem(queryParams);
    download.excel(data, '水肥一体化系统信息.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 选中行操作 */
const currentRow = ref({}); // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row;
};

/** 绑定设备*/
const deviceId = ref([]); // 已绑定的设备id
const systemId = ref(0);
const monitorType = ref('');
const loadingDevice = ref(true); // 列表的加载中
const wfiSystemBindDeviceRef = ref();
//绑定设备抽屉相关参数
const drawer = ref(false);
let categoryOptions = ref([]); // 设备分类选项
const listDevice = ref<DeviceInfoVO[]>([]); // 列表的数据
/**
 * 设备分类级联选择器
 */
const categoryProps = {
  value: 'id',
  label: 'categoryName'
};
const bindDevice = async (row) => {
  const { id } = row;
  loadingDevice.value = true;
  try {
    drawer.value = true;
    systemId.value = id;
    getDeviceList(id);
  } finally {
    loadingDevice.value = false;
  }
};

const handleBindDevice = async (device: any) => {
  try {
    loadingDevice.value = true;
    deviceId.value = device.map((item) => item.id);
    const res = await WfiSystemApi.bindWfiSystemDevice({
      systemId: systemId.value,
      deviceIds: deviceId.value
    });
    if (res) {
      message.success('绑定成功');
    } else {
      message.error('绑定失败');
    }
  } finally {
    getDeviceList(systemId.value);
    loadingDevice.value = false;
  }
};

const getDeviceList = async (systemId) => {
  const data = await WfiSystemApi.getWfiSystemDevice(systemId);
  listDevice.value = data;
  deviceId.value = data.map((item) => item.id);
};

const bindDeviceA = async () => {
  try {
    console.log('systemId', systemId.value);
    // const data = await WfiSystemApi.getWfiSystemDevice(systemId.value);
    // // deviceId.value = data.list.map((item) => item.deviceId);
    // console.log('monitorType11111111', monitorType.value);
    wfiSystemBindDeviceRef.value.open(monitorType.value);
  } catch {}
};

const handleDeleteA = async (id) => {
  try {
    // 移除的二次确认
    await message.delConfirm();
    loadingDevice.value = true;
    await WfiSystemApi.deleteSystemByDeviceId(id, systemId.value);
    message.success(t('common.delSuccess'));
  } catch {
  } finally {
    getDeviceList(systemId.value);
    loadingDevice.value = false;
  }
};
/** 初始化 **/
onMounted(() => {
  getList();
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

<template>
  <el-scrollbar
    class="w-full bg-white dark:bg-[#333] rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] dark:text-[#ccc] font-bold text-[18px]">系统信息</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!--
          一级标题旁边的按钮
          主按钮 type="primary" 次按钮不设置 type 属性 不设置 plain 属性
        -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:wfi-system:create']"
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
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:wfi-system:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>

        <button
          class="circle-arrow-up ml-[16px] !dark:text-[#ccc]"
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
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full overflow-hidden form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!--
        原来的表单里的内容复制过来 不要操作按钮
        去掉每项的固定宽度 比如 !w-240px !w-220px
        如果 输入框内 有按钮 则只保留图标 不要文字
      -->
      <el-form-item label="系统标识码" prop="sysCode">
        <el-input
          v-model="queryParams.sysCode"
          placeholder="请输入系统标识码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统名称" prop="sysName">
        <el-input
          v-model="queryParams.sysName"
          placeholder="请输入系统名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属水源地" prop="belongWaterSource">
        <el-input
          v-model="queryParams.belongWaterSource"
          placeholder="请输入所属水源地"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统状态" prop="sysStatus">
        <el-select v-model="queryParams.sysStatus" placeholder="请选择系统状态" clearable>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WFI_SYSTEM_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column label="系统标识码" align="center" prop="sysCode" />
        <el-table-column label="系统名称" align="center" prop="sysName" />
        <el-table-column label="所属水源地" align="center" prop="belongWaterSource" />
        <el-table-column label="系统状态" align="center" prop="sysStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_SYSTEM_STATUS" :value="scope.row.sysStatus" />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <!-- 按钮 -->
              <el-button
                link
                type="success"
                @click="bindDevice(scope.row)"
                v-hasPermi="['agriculture:wfi-system:update']"
              >
                绑定设备
              </el-button>

              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:wfi-system:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:wfi-system:delete']"
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
  <WfiSystemForm ref="formRef" @success="getList" />

  <ContentWrap>
    <el-drawer title="绑定设备" v-model="drawer" :with-header="false">
      <span>已绑定设备</span>
      <!--      v-if="listDevice.length > 0"-->
      <ContentWrap>
        <el-table
          v-loading="loadingDevice"
          :data="listDevice"
          :show-overflow-tooltip="true"
          v-if="listDevice.length > 0"
          :stripe="true"
        >
          <!--          <el-table-column type="selection" width="30" label="选择" :reserve-selection="true"/>-->
          <!--          <el-table-column label="设备编号" align="center" prop="id" width="150"/>-->
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
              <el-button link type="danger" @click="handleDeleteA(scope.row.id)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="color-[#808080] mx-auto w-100px">暂无数据</div>
      </ContentWrap>
      <el-row>
        <el-button type="primary" plain style="width: 100%; height: 60px" @click="bindDeviceA()">
          +增加绑定设备
        </el-button>
      </el-row>
    </el-drawer>
  </ContentWrap>

  <!-- 绑定设备列表 -->
  <WfiSystemBindDevice
    ref="wfiSystemBindDeviceRef"
    :monitorType="monitorType"
    :deviceId="deviceId"
    @success="handleBindDevice"
  />
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
    background-color: transparent;
  }
  to {
    transform: rotate(180deg);
    color: #ccc;
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
    color: #ccc;
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
