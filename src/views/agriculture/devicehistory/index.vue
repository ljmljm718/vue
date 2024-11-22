<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full box-border flex justify-between items-center">
      <div class="flex items-center">
        <!-- 标题名字写在这 标题旁边有按钮的写在h1下面 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">设备状态</h1>
        <button
          class="primary-btn ml-[16px] flex items-center"
          @click="openForm('create')"
          v-hasPermi="['agriculture:device-history-status:create']"
        >
          新增
        </button>
      </div>

      <div class="flex items-center">
        <!-- 标题这行右侧的按钮写在下面 -->
        <button class="primary-btn flex items-center" @click="handleQuery">搜索</button>
        <button class="secondary-btn ml-[8px] flex items-center" @click="resetQuery">重置</button>
        <button
          class="secondary-btn ml-[8px] flex items-center"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:device-history-status:export']"
        >
          导出
        </button>

        <!-- 搜索栏展开收起的按钮 -->
        <button
          class="circle-arrow-up ml-[16px]"
          :class="showSearch ? 'rotate180andthemeBg' : 'rotate180andwhiteBg'"
          @click="handleClickShowSearch"
        >
          <Icon :size="14" icon="ep:arrow-up" />
        </button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-form
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[8px] mt-[8px] w-full card-list"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      :model="queryParams"
      ref="queryFormRef"
      label-width="100px"
      :inline="true"
      id="formDom"
    >
      <!-- 搜索栏的每一项 加上class="!mb-0" 去掉表单组件的固定宽度 比如!w-240px和!w-220px -->
      <el-form-item label="设备: " prop="deviceId" class="!mb-0">
        <el-input v-model="queryParams.deviceName" placeholder="请选择设备" readonly>
          <template #append>
            <el-button @click="openSelectDeviceInfo()">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="设备状态: " prop="deviceStatus" class="!mb-0">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区 (操作按钮较多时用 用就去掉!hidden) -->
    <div class="flex justify-between mt-[16px] !hidden">
      <div class="space-x-[8px]">
        <!-- 左侧的按钮写在下面 -->
        <button class="primary-btn">新增</button>
        <button class="secondary-btn">导出</button>
        <button class="secondary-btn">编辑</button>
        <button class="secondary-btn">查看</button>
        <button class="secondary-btn">删除</button>
        <button class="secondary-btn">调配测试</button>
        <button class="secondary-btn">展开</button>
      </div>
      <!-- 右侧的按钮写在这 多个按钮像上面一样用div包裹起来 -->
      <button class="secondary-btn">
        <Icon icon="ep:refresh" :size="12" class="mr-[3px]" />
        刷新
      </button>
    </div>

    <!-- 内容 列表形式 如果有操作按钮区就是mt-[8px] 否则是 mt-[16px] -->
    <div class="w-full mt-[16px] box-border min-h-[295px]" :style="{ height: mainHeight }">
      <el-table
        style="height: 100%; width: 100%"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        header-cell-class-name="h-[48px] text-black !font-medium text-[14px] !bg-[#ECEFF7] tracking-wide"
        cell-class-name="h-[48px] text-[#333] text-[14px] tracking-wide"
      >
        <!-- 把原来 el-table里 的内容复制过来 只有操作按钮那部分需要改 -->
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column label="设备状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus" />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />

        <!-- 操作按钮要加fixed="right" 和 最小宽度154px -->
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <button
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:device-history-status:update']"
                class="link-btn"
              >
                编辑
              </button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <button
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:device-history-status:delete']"
                class="link-btn"
              >
                删除
              </button>

              <!-- 按钮超过三个以上的 参照下面的部分 template里的是三个点 template下面写按钮 -->
              <!-- <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-popover :width="104" trigger="hover" popper-style="min-width: 0">
                <template #reference>
                  <button class="link-btn flex items-center">
                    <div class="w-[2px] h-[2px] mx-[1px] rounded-full" style="background-color: var(--el-color-primary)"></div>
                    <div class="w-[2px] h-[2px] mx-[1px] rounded-full" style="background-color: var(--el-color-primary)"></div>
                    <div class="w-[2px] h-[2px] mx-[1px] rounded-full" style="background-color: var(--el-color-primary)"></div>
                  </button>
                </template>
                
                <div class="flex flex-col items-start space-y-[8px]">
                  <button
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['agriculture:device-history-status:delete']"
                    class="link-btn-black-text"
                  >删除</button>
                  <button
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['agriculture:device-history-status:delete']"
                    class="link-btn-black-text"
                  >删除</button>
                  <button
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['agriculture:device-history-status:delete']"
                    class="link-btn-black-text"
                  >删除</button>
                </div>
              </el-popover> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 页码组件边距有点大 如果不加style得修改 pagnitionHeight 的值 -->
    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList()"
    />
  </el-scrollbar>

  <!-- 表单弹窗：添加/修改 -->
  <DeviceHistoryStatusForm ref="formRef" @success="getList" />
  <!--  选择设备-->
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { DeviceHistoryStatusApi, DeviceHistoryStatusVO } from '@/api/agriculture/devicehistory';
import DeviceHistoryStatusForm from './DeviceHistoryStatusForm.vue';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue';
import { useAppStore } from '@/store/modules/app';
import { colorOpt } from '@/config/colorTheme/colorConfig';
import { setCssVar } from '@/utils';

/** 设备历史状态 列表 */
defineOptions({ name: 'DeviceHistoryStatus' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<DeviceHistoryStatusVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceId: undefined,
  deviceStatus: undefined,
  deviceName: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DeviceHistoryStatusApi.getDeviceHistoryStatusPage(queryParams);
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
  queryParams.deviceName = null;
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
    await DeviceHistoryStatusApi.deleteDeviceHistoryStatus(id);
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
    const data = await DeviceHistoryStatusApi.exportDeviceHistoryStatus(queryParams);
    download.excel(data, '设备历史状态.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};
// 机器信息选择
const purchaseOrderInEnableListRef = ref();
const openSelectDeviceInfo = () => {
  purchaseOrderInEnableListRef.value.open(); //监控
};
//点击确定后
const handlePurchaseOrderChange = (item: any) => {
  queryParams.deviceId = item[0].id;
  queryParams.deviceName = item[0].deviceName;
};
/** 初始化 **/
onMounted(() => {
  getList();
});

/**
 * 以下为布局需要的各类元素的高度
 * 需要修改的是 pagnitionHeight 页码组件的高度 这个需要包括margin
 * 运行页面用控制台查看一下
 *
 * topMenuHeight      顶部菜单和标签页高度
 * contentPadding     页面内容外边距
 * modulePadding      模块内边距
 * btnHeight          按钮高度
 * searchAreaHeight   搜索栏区域高度
 * pagnitionHeight    页码组件高度 需要包括margin
 *
 * mainHeight 是 本页 列表内容的高度 用白色区域的高度 - 操作按钮 - 搜索栏 - 页码 - 所有垂直方向上的边距
 */
const topMenuHeight = 85;
const contentPadding = 8;
const modulePadding = 16;
const btnHeight = 32;
const pagnitionHeight = 24 + 8;
const mainHeight = ref();

// 计算列表内容的高度 如果有操作按钮区 则多减一个 ( btnHeight + contentPadding )
const calcMainHeight = () => {
  let dom = document.querySelector('#formDom');
  if (!dom) return;
  mainHeight.value =
    'calc(100% - ' +
    (contentPadding + 1 * modulePadding + btnHeight + dom.clientHeight + pagnitionHeight) +
    'px)';
  dom = null;
};

onMounted(() => {
  calcMainHeight();
  window.addEventListener('resize', calcMainHeight);
});

// 展开或收起搜索栏
const showSearch = ref(true);
const handleClickShowSearch = async () => {
  showSearch.value = !showSearch.value;
  await nextTick();
  calcMainHeight();
};

// 设置主按钮激活时的背景颜色 目前只有绿色主题的 默认设置绿色主题的
const appStore = useAppStore();
watchEffect(() => {
  const primaryColor = appStore.getTheme.elColorPrimary;
  let primaryActiveColor: string;
  if (primaryColor && colorOpt[primaryColor]) {
    primaryActiveColor = colorOpt[primaryColor].primaryBtnActiveBg;
  } else {
    primaryActiveColor = '#00877A';
  }
  setCssVar('--primary-active-color', primaryActiveColor);
});
</script>

<style lang="scss" scoped>
// 下边这些都要复制
// 主按钮
.primary-btn {
  padding-left: 16px;
  padding-right: 16px;
  height: 32px;
  font-size: 14px;
  color: white;
  border-width: 0;
  border-radius: 6px;
  background-color: var(--el-color-primary);

  &:hover {
    cursor: pointer;
    background-color: var(--primary-active-color);
  }
}

// 次按钮
.secondary-btn {
  padding-left: 16px;
  padding-right: 16px;
  height: 32px;
  font-size: 14px;
  color: #333;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  background-color: white;

  &:hover {
    cursor: pointer;
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
}

// 链接按钮
.link-btn {
  background-color: transparent;
  border-width: 0;
  font-size: 14px;
  height: 24px;
  color: var(--el-color-primary);
  padding: 0;

  &:hover {
    color: var(--primary-active-color);
    cursor: pointer;
  }
}

// 正常情况下字体为黑色的链接按钮
.link-btn-black-text {
  @extend .link-btn;
  color: black;
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

:deep(.card-list .el-form-item__label) {
  font-size: 14px;
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
