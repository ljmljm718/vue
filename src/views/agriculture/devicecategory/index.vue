<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">设备分类</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!-- 一级标题旁边的按钮 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:device-category:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
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
          v-hasPermi="['agriculture:device-category:export']"
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

    <!-- 搜索栏 注意 :model 和 ref 的名称 -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <el-form-item label="分类编码" prop="categoryCode">
        <el-input v-model="queryParams.categoryCode" placeholder="请输入分类编码" clearable />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="queryParams.categoryName" placeholder="请输入分类名称" clearable />
      </el-form-item>
      <el-form-item label="分类标签" prop="categoryLabel">
        <el-input v-model="queryParams.categoryLabel" placeholder="请输入分类标签" clearable />
      </el-form-item>
    </el-form>

    <div class="w-full mt-[8px]">
      <el-table
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        row-key="id"
        :default-expand-all="isExpandAll"
        v-if="refreshTable"
        :row-class-name="tableRowClassName"
        border
      >
        <!--      <el-table-column label="id主键" align="center" prop="id" />-->
        <!--      <el-table-column label="父结点" align="center" prop="parentId" />-->
        <el-table-column label="分类名称" align="left" prop="categoryName" min-width="130" />
        <el-table-column label="分类编码" align="left" prop="categoryCode" width="160" />
        <el-table-column label="分类标签" align="center" prop="categoryLabel" />
        <el-table-column label="是否显示" align="center" prop="showStatus" width="140">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.INFRA_INTEGER_STRING" :value="scope.row.showStatus" />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="120px"
        />
        <el-table-column label="分类排序" align="center" prop="categorySort" width="120" />
        <el-table-column label="监测属性" align="center" prop="monitor" width="160">
          <template #default="scope">
            <span>
              {{
                scope.row.monitor == undefined || scope.row.monitor == null
                  ? '无'
                  : scope.row.monitor
              }}
            </span>
          </template>
        </el-table-column>
        <!--      <el-table-column label="图片" align="center" prop="imgId" />-->
        <el-table-column label="描述" align="center" prop="description" />
        <!--      <el-table-column label="部门id" align="center" prop="deptId" />-->
        <!--      <el-table-column label="用户id" align="center" prop="userId" />-->
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                v-if="ids.includes(scope.row.id)"
                link
                type="primary"
                @click="router.push('/internetMonitor/deviceData/monitoring-threshold')"
              >
                监测阈值配置
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:device-category:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:device-category:delete']"
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

  <!-- 表单弹窗：添加/修改 -->
  <DeviceCategoryForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import { handleTree } from '@/utils/tree';
import download from '@/utils/download';
import { DeviceCategoryApi, DeviceCategoryVO } from '@/api/agriculture/devicecategory';
import DeviceCategoryForm from './DeviceCategoryForm.vue';
import router from '@/router';

/** 鲁渝协作设备分类 列表 */
defineOptions({ name: 'DeviceCategory' });
//监测阈值配置
const ids = [100, 103, 104];
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<DeviceCategoryVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  parentId: undefined,
  categoryCode: undefined,
  categoryName: undefined,
  categoryLabel: undefined,
  showStatus: undefined,
  categorySort: undefined,
  createTime: [],
  imgId: undefined,
  description: undefined,
  deptId: undefined,
  userId: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DeviceCategoryApi.getDeviceCategoryList(queryParams);
    list.value = handleTree(data, 'id', 'parentId');
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
    await DeviceCategoryApi.deleteDeviceCategory(id);
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
    const data = await DeviceCategoryApi.exportDeviceCategory(queryParams);
    download.excel(data, '鲁渝协作设备分类.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 展开/折叠操作 */
const isExpandAll = ref(false); // 是否展开，默认全部展开
const refreshTable = ref(true); // 重新渲染表格状态
const toggleExpandAll = async () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  await nextTick();
  refreshTable.value = true;
};

// 表格行颜色
const tableRowClassName = ({ row }: { row: DeviceCategoryVO; rowIndex: number }) => {
  if (row.parentId === 0) {
    return 'primary-row';
  } else {
    return 'success-row';
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
