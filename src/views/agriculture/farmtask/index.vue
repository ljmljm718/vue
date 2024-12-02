<script setup lang="ts">
/* 原页面的js代码复制在下面 包括import */
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime';
import download from '@/utils/download';
import { FarmTaskApi, FarmTaskVO } from '@/api/agriculture/farmtask';
import FarmTaskForm from './FarmTaskForm.vue';
import { DICT_TYPE } from '@/utils/dict';
import Router from '@/router';
import * as ProcessInstanceApi from '@/api/bpm/processInstance';
import QuestionMaskTip from '@/components/QuestionMaskTip/index.vue';

/** 农事任务 列表 */
defineOptions({ name: 'FarmTask' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<FarmTaskVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  processInstanceId: undefined,
  status: undefined,
  startTime: [],
  endTime: [],
  completeRequirement: undefined,
  acceptanceStandard: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await FarmTaskApi.getFarmTaskPage(queryParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

const router = useRouter(); // 路由
/** 添加操作 */
const handleCreate = () => {
  router.push({ path: '/farm_work/farmWorkCreate' });
};

/** 详情操作 */
const handleDetail = (row: any) => {
  router.push({
    path: '/farm_work/FarmTaskDetail',
    query: {
      id: row.id
    }
  });
};

const lookPlanDetail = (planId: any) => {
  router.push('/farm_work/farmManage/createOrUpdate?type=view&id=' + planId);
};

/** 取消请假操作 */
const cancelLeave = async (row) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空'
  });
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstanceByStartUser(row.processInstanceId, value);
  message.success('取消成功');
  // 刷新列表
  await getList();
};

/** 审批进度 */
const handleProcessDetail = (row) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  });
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

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await FarmTaskApi.exportFarmTask(queryParams);
    download.excel(data, '农事任务.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});
onActivated(async () => {
  await getList();
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
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">农事任务</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!--
          一级标题旁边的按钮
          主按钮 type="primary" 次按钮不设置 type 属性 不设置 plain 属性
        -->
        <el-button
          type="primary"
          @click="handleCreate()"
          v-hasPermi="['agriculture:farm-task:create']"
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
      <!--
        原来的表单里的内容复制过来 不要操作按钮
        去掉每项的固定宽度 比如 !w-240px !w-220px
        如果 输入框内 有按钮 则只保留图标 不要文字
      -->
      <el-form-item label="基地名称" prop="parkName">
        <el-input
          v-model="queryParams.parkName"
          placeholder="请输入基地名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input
          v-model="queryParams.plotName"
          placeholder="请输入地块名称"
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

    <!-- 如果有 6.1.2的部分 则这里是mt-[8px] -->
    <div class="w-full mt-[16px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="计划名称" align="center" prop="planName" width="200">
          <template #header>
            <QuestionMaskTip
              lable-name="计划名称"
              content="可以点击计划名称，来查看具体的农事计划。"
            />
          </template>
          <template #default="scope">
            <label
              style="cursor: pointer; color: #0072c6"
              @click="lookPlanDetail(scope.row.planCode)"
            >
              {{ scope.row.planName }}
            </label>
          </template>
        </el-table-column>
        <el-table-column label="基地名称" align="center" prop="parkName" width="180" />
        <!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
        <el-table-column label="地块名称" align="center" prop="plotName" />
        <el-table-column label="审批状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          align="center"
          prop="startTime"
          :formatter="dateFormatter2"
          width="180px"
        />
        <el-table-column
          label="完成时间"
          align="center"
          prop="endTime"
          :formatter="dateFormatter2"
          width="180px"
        />
        <el-table-column label="完成要求" align="center" prop="completeRequirement" />
        <el-table-column label="验收标准" align="center" prop="acceptanceStandard" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <!-- 按钮 -->
              <el-button
                v-hasPermi="['agriculture:farm-task:query']"
                link
                type="primary"
                @click="handleDetail(scope.row)"
              >
                详情
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                v-hasPermi="['agriculture:farm-task:query']"
                link
                type="primary"
                @click="handleProcessDetail(scope.row)"
              >
                进度
              </el-button>
              <div
                v-if="scope.row.status === 1"
                class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"
              ></div>
              <el-button
                v-if="scope.row.status === 1"
                v-hasPermi="['agriculture:farm-task:create']"
                link
                type="danger"
                @click="cancelLeave(scope.row)"
              >
                取消
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
  <FarmTaskForm ref="formRef" @success="getList" />
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
