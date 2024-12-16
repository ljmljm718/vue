<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">指标要素</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:model-indicator-element:create']"
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
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full overflow-hidden form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="要素名称" prop="elementName">
        <el-input
          v-model="queryParams.elementName"
          placeholder="请输入要素名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
    </el-form>

    <div class="w-full mt-[16px]">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="要素编号" align="center" prop="id" />
        <el-table-column label="要素名称" align="center" prop="elementName" width="110" />
        <el-table-column label="权重(%)" align="center" prop="weight" width="90" />
        <el-table-column label="指标说明" align="center" prop="indicatorDescription" />
        <el-table-column label="绑定设备" align="center" prop="deviceName" />
        <el-table-column label="实现类" align="center" prop="implementationClass" />
        <el-table-column label="操作" align="center" fixed="right" min-width="184px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                link
                type="primary"
                @click="
                  router.push(
                    `/growth_monitor/model-indicator-element-range?indicatorElementId=${scope.row.id}`
                  )
                "
              >
                指标范围
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row)"
                v-hasPermi="['agriculture:model-indicator-element:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:model-indicator-element:delete']"
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

  <!-- 表单弹窗：添加/修改 -->
  <ModelIndicatorElementForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download';
import {
  ModelIndicatorElementApi,
  ModelIndicatorElementVO
} from '@/api/agriculture/modelindicatorelement';
import ModelIndicatorElementForm from './ModelIndicatorElementForm.vue';
import { CommonStatusEnum } from '@/utils/constants';
import { DeviceInfoApi, DeviceInfoVO } from '@/api/agriculture/deviceinfo';
import { ElTable } from 'element-plus';

/** 指标要素 列表 */
defineOptions({ name: 'ModelIndicatorElement' });

const router = useRouter();
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化
const route = useRoute();

const loading = ref(true); // 列表的加载中
const list = ref<ModelIndicatorElementVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  indicatorId: undefined,
  elementName: undefined,
  weight: undefined,
  indicatorDescription: undefined,
  bindDevice: undefined,
  status: undefined,
  implementationClass: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

const listDeviceInfo = ref<DeviceInfoVO[]>([]); // 设备列表的数据
const getTypeData = async () => {
  const { list: list1 } = await DeviceInfoApi.getDeviceInfoNoPage({});
  if (Array.isArray(list1)) listDeviceInfo.value = list1;
};

onMounted(() => {
  if (route.query) queryParams.indicatorId = route.query.indicatorId;
});

const deviceName = ref();

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ModelIndicatorElementApi.getModelIndicatorElementPage(queryParams);
    console.log('data', data);
    list.value = data.list.map((item) => {
      let deviceName = '';
      if (
        !(item.bindDevice === null || item.bindDevice === undefined) &&
        Array.isArray(listDeviceInfo.value)
      )
        listDeviceInfo.value.forEach((ele) => {
          if (item.bindDevice.includes(ele.id)) deviceName = deviceName + ',' + ele.deviceName;
        });
      // .find(ele => (ele.id === item.bindDevice)) : null
      return {
        ...item,
        deviceName: deviceName ? deviceName.substring(1, deviceName.length) : ''
      };
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

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  //重置路径上的指标id
  // queryParams.indicatorId = undefined
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, item: any) => {
  if (type === 'create') {
    item = {
      indicatorId: queryParams.indicatorId
    };
  }
  formRef.value.open(type, item);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await ModelIndicatorElementApi.deleteModelIndicatorElement(id);
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
    const data = await ModelIndicatorElementApi.exportModelIndicatorElement(queryParams);
    download.excel(data, '指标要素.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 修改状态 */
const handleStatusChange = async (row: ModelIndicatorElementApi.ModelIndicatorElementVO) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用';
    await message.confirm('确认要' + text + '当前指标吗?');
    // 发起修改状态
    await ModelIndicatorElementApi.updateModelIndicatorElementStatus(row.id, row.status);
    // 刷新列表
    await getList();
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE;
  }
};

const init = async () => {
  await getTypeData();
  await getList();
};

/** 初始化 **/
onMounted(() => {
  init();
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
