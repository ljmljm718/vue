<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { colorOpt } from '@/config/colorTheme/colorConfig';
import { setCssVar } from '@/utils';

/* todo原页面的js代码复制在下面 */
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { TaskFertilizationApi, TaskFertilizationVO } from '@/api/agriculture/taskfertilization';
import TaskFertilizationForm from './TaskFertilizationForm.vue';
import ShowTaskFertilizationDetailForm from '@/views/agriculture/taskfertilizationdetail/ShowTaskFertilizationDetailForm.vue';
import TaskFertillzationDetailList from '@/views/agriculture/taskfertilizationdetail/TaskFertillzationDetailList.vue';

const ShowTaskFertilizationDetailRef = ref();
const showTaskFertilizationDetailList = (ids: string) => {
  ShowTaskFertilizationDetailRef.value.open(ids);
};

/** 施肥任务 列表 */
defineOptions({ name: 'TaskFertilization' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<TaskFertilizationVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tfName: undefined,
  belongWfiSystem: undefined,
  fertilizationType: undefined,
  mixingType: undefined,
  waterPumpStatus: undefined,
  concurrentTaskNumber: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined,
  iaCodeNameList: undefined,
  status: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await TaskFertilizationApi.getTaskFertilizationPage(queryParams);
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
    await TaskFertilizationApi.deleteTaskFertilization(id);
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
    const data = await TaskFertilizationApi.exportTaskFertilization(queryParams);
    download.excel(data, '施肥任务.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});
/* 原页面的代码复制在上面 */

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
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 todo替换成菜单名称-->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">施肥任务管理</h1>
        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
        <!-- 一级标题旁边的按钮 -->
        <!-- todo原新增按钮 -->
        <!-- todo需要包含type="primary"&&不能有plain属性 -->
        <!-- <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:task-fertilization:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button> -->
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <!-- todo复制原页面【搜索、重置、导出】 -->
        <!-- todo【搜索】按钮需要包含type="primary"&&不能有plain属性 -->
        <!-- todo删除导出按钮的type和plain属性 -->
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
          v-hasPermi="['agriculture:task-fertilization:export']"
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
      <!-- todo复制原来的搜索列表 -->
      <!-- todo 所有的都需要删除class=“!w-240” 这一类的属性 -->
      <el-form-item label="任务名称" prop="tfName">
        <el-input
          v-model="queryParams.tfName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="所属系统" prop="belongWfiSystem">
        <el-input
          v-model="queryParams.belongWfiSystem"
          placeholder="请输入所属系统"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="施肥类型" prop="fertilizationType">
        <el-select v-model="queryParams.fertilizationType" placeholder="请选择施肥类型" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="搅拌类型" prop="mixingType">
        <el-select v-model="queryParams.mixingType" placeholder="请选择搅拌类型" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_STIR_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="水泵控制" prop="waterPumpStatus">
        <el-select
          v-model="queryParams.waterPumpStatus"
          placeholder="请选择水泵控制"
          clearable
          @change="handleQuery"
        >
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>

      <el-form-item label="同时施肥灌区数" prop="concurrentTaskNumber">
        <el-input
          v-model="queryParams.concurrentTaskNumber"
          placeholder="请输入同时施肥灌区数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="施肥时长/量" prop="amountTimeNumber">
        <el-input
          v-model="queryParams.amountTimeNumber"
          placeholder="请输入施肥时长/量（分钟/L）"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="施肥灌区" prop="iaCodeList">
        <el-input
          v-model="queryParams.iaCodeList"
          placeholder="请输入施肥灌区"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
    </el-form>
    <div class="w-full mt-[8px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :row-key="(row) => row.id"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :show-overflow-tooltip="true"
        @row-click="clickSelect"
        size="default"
      >
        <!-- todo复制列表 -->
        <el-table-column type="expand">
          <template #default="scope">
            <el-tabs model-value="parkDetail">
              <el-tab-pane label="料桶列表" name="parkDetail">
                <TaskFertillzationDetailList :tf-id="scope.row.id" />
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
        <!-- <el-table-column label="所属系统" align="center" prop="belongWfiSystem" /> -->
        <el-table-column label="施肥类型" align="center" prop="fertilizationType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_FERTILIZE_TYPE" :value="scope.row.fertilizationType" />
          </template>
        </el-table-column>
        <el-table-column label="搅拌类型" align="center" prop="mixingType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_STIR_TYPE" :value="scope.row.mixingType" />
          </template>
        </el-table-column>
        <el-table-column label="水泵控制" align="center" prop="waterPumpStatus">
          <template #default="scope">
            <el-tag v-if="scope.row.waterPumpStatus === '是'" type="success">
              {{ scope.row.waterPumpStatus }}
            </el-tag>
            <el-tag v-if="scope.row.waterPumpStatus === '否'" type="danger">
              {{ scope.row.waterPumpStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="同时施肥罐区数量" align="center" prop="concurrentTaskNumber" />
        <el-table-column label="施肥时长/量(分钟/L)" align="center" prop="amountTimeNumber" />
        <!-- <el-table-column label="施肥灌区" align="center" prop="iaCodeList" /> -->
        <el-table-column label="施肥灌区" align="center" prop="iaCodeNameList" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_FERTILIZE_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="任务名称" align="center" prop="tfName" />
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <!-- todo操作按钮 -->
            <!-- 1.  <template #default="scope"> 中，加入
                <div class="flex items-center justify-center">
                  其中放入编辑，删除"按钮"等，每一个按钮中完成后加入
                    <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
                  这段代码的含义是“竖杠”分隔符
                </div>
                2.请注意“方案一”和“方案二”只采用一种，请根据自身按钮数量选择性删除或保留
              -->
            <!-- todo方案一 -->
            <div class="flex items-center justify-center">
              <!-- <el-button
                  link
                  type="primary"
                  @click="showTaskFertilizationDetailList(scope.row.id)"
                >
                  查看料桶
                </el-button>
                <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div> -->
              <!-- <el-button
                  link
                  type="primary"
                  @click="openForm('update', scope.row.id)"
                  v-hasPermi="['agriculture:task-fertilization:update']"
                >
                  编辑
                </el-button> -->
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:task-fertilization:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 页码组件 注意绑定的值和事件函数 -->
    <!-- 不用改 -->
    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>
  <!-- todo页面组件复制在下面 -->
  <!-- 表单弹窗：添加/修改 -->
  <TaskFertilizationForm ref="formRef" @success="getList" />
  <!-- 料桶表 -->
  <ShowTaskFertilizationDetailForm ref="ShowTaskFertilizationDetailRef" />
</template>
<style lang="scss" scoped>
// 原页面样式复制在下面

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
