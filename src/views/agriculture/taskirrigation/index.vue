<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 todo替换成菜单名称-->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">灌溉任务</h1>
        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
        <!-- 一级标题旁边的按钮 -->
        <!-- todo原新增按钮 -->
        <!-- todo需要包含type="primary"&&不能有plain属性 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:wfi-task-irrigation:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <!-- todo复制原页面【搜索、重置、导出】 -->
        <!-- todo【搜索】按钮需要包含type="primary"&&不能有plain属性 -->
        <!-- todo删除导出按钮的type和plain属性 -->
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
          v-hasPermi="['agriculture:wfi-task-irrigation:export']"
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
      <el-form-item label="任务名称" prop="tiName">
        <el-input
          v-model="queryParams.tiName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="灌溉类型" prop="irrigationType">
        <el-select v-model="queryParams.irrigationType" placeholder="请选择灌溉类型" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="tiBeginTime">
        <el-date-picker
          v-model="queryParams.tiBeginTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="tiEndTime">
        <el-date-picker
          v-model="queryParams.tiEndTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
      <el-form-item label="灌溉周期" prop="tiExecCron">
        <el-select v-model="queryParams.tiExecCron" placeholder="请选择灌溉周期" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_IRRIGATE_EXEC_CRON)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务执行时间" prop="tiExecBeginTime">
        <el-input
          v-model="queryParams.tiExecBeginTime"
          placeholder="请输入任务执行时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水泵控制" prop="waterPumpStatus">
        <el-select v-model="queryParams.waterPumpStatus" placeholder="请选择水泵控制" clearable>
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>
      <el-form-item label="并发任务数量" prop="concurrentTaskNumber">
        <el-input
          v-model="queryParams.concurrentTaskNumber"
          placeholder="请输入并发任务执行数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="灌溉时长/量（分钟/L）" prop="amountTimeNumber">
        <el-input
          v-model="queryParams.amountTimeNumber"
          placeholder="请输入灌溉时长/量（分钟/L）"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="执行灌区" prop="iaCodeList">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.iaCodeList"-->
      <!--          placeholder="请输入任务执行灌区"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="任务状态" prop="status">
        <el-input
          v-model="queryParams.status"
          placeholder="请输入状态，停用、启用"
          clearable
          @keyup.enter="handleQuery"
        />
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
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <!-- todo复制列表 -->
        <el-table-column label="任务名称" align="center" prop="tiName" />
        <el-table-column label="灌溉类型" align="center" prop="irrigationType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_FERTILIZE_TYPE" :value="scope.row.irrigationType" />
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          align="center"
          prop="tiBeginTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="tiEndTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="灌溉周期" align="center" prop="tiExecCron">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_IRRIGATE_EXEC_CRON" :value="scope.row.tiExecCron" />
          </template>
        </el-table-column>
        <el-table-column label="周期天数" align="center" prop="tiExecCronDay" />
        <el-table-column label="任务执行时间" align="center" prop="tiExecBeginTime" />
        <el-table-column label="水泵控制" align="center" prop="waterPumpStatus">
          <!--        <template #default="scope">-->
          <!--          <dict-tag :type="DICT_TYPE.EQU_SWITH_STATE" :value="scope.row.waterPumpStatus" />-->
          <!--        </template>-->
        </el-table-column>
        <el-table-column label="并发任务执行数量" align="center" prop="concurrentTaskNumber" />
        <el-table-column label="灌溉时长/量（分钟/L）" align="center" prop="amountTimeNumber" />
        <el-table-column label="任务执行灌区" align="center" prop="iaCodeList" />
        <el-table-column label="任务状态" align="center" prop="status" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
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
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:wfi-task-irrigation:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:wfi-task-irrigation:delete']"
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
    <!-- <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    /> -->
  </el-scrollbar>
  <!-- todo页面组件复制在下面 -->
  <!-- 表单弹窗-->
  <!-- 表单弹窗：添加/修改 -->
  <WfiTaskIrrigationForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { WfiTaskIrrigationApi, WfiTaskIrrigationVO } from '@/api/agriculture/taskirrigation';
import WfiTaskIrrigationForm from './WfiTaskIrrigationForm.vue';

/** 灌溉任务 列表 */
defineOptions({ name: 'WfiTaskIrrigation' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<WfiTaskIrrigationVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tiName: undefined,
  irrigationType: undefined,
  tiBeginTime: [],
  tiEndTime: [],
  tiExecCron: undefined,
  tiExecBeginTime: [],
  waterPumpStatus: undefined,
  concurrentTaskNumber: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined,
  status: undefined,
  jobId: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await WfiTaskIrrigationApi.getWfiTaskIrrigationPage(queryParams);
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
    await WfiTaskIrrigationApi.deleteWfiTaskIrrigation(id);
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
    const data = await WfiTaskIrrigationApi.exportWfiTaskIrrigation(queryParams);
    download.excel(data, '灌溉任务.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});

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
