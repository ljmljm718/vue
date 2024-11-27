<template>
  <div ref="containerDom">
    <el-scrollbar
      class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
      :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
    >
      <div class="w-full flex justify-between items-center">
        <div class="flex items-center">
          <!-- 一级标题名字 -->
          <h1 class="m-0 text-[#333] font-bold text-[18px]">巡检总览</h1>

          <Icon
            icon="ep:question-filled"
            :size="14"
            class="ml-[8px] cursor-pointer text-[#F08000]"
          />
          <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

          <!--
            一级标题旁边的按钮
            主按钮 type="primary" 次按钮不设置 type 属性 不设置 plain 属性
          -->
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
        :model="queryParamsCountPageByBaseId"
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
        <el-form-item label="时间" prop="createTime">
          <el-date-picker
            v-model="queryParamsCountPageByBaseId.createTime"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择时间"
          />
        </el-form-item>
      </el-form>

      <!-- 如果有 6.1.2的部分 则这里是mt-[8px] -->
      <div class="w-full mt-[16px]">
        <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
        <el-table
          v-loading="loading"
          :data="listDevice"
          :show-overflow-tooltip="true"
          :stripe="true"
        >
          <!-- 子表的列表 -->
          <el-table-column type="expand">
            <template #default="scope">
              <el-tabs model-value="checkDetail">
                <el-tab-pane label="巡检信息" name="checkDetail">
                  <CheckDetailList :check-row="scope.row" :base-id="queryParamsCountPageByBaseId" />
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-table-column>
          <el-table-column label="设备类型" align="center" prop="categoryName" />
          <el-table-column label="巡检设备总数" align="center" prop="sumNum" />
          <el-table-column label="未巡检/个" align="center" prop="unFinishCheckNum" />
          <el-table-column label="已巡检/个" align="center" prop="finishCheckNum" />
        </el-table>
      </div>
      <Pagination
        style="margin-bottom: 0; margin-top: 8px"
        v-model:limit="queryParamsCountPageByBaseId.pageSize"
        v-model:page="queryParamsCountPageByBaseId.pageNo"
        :total="totalDevice"
        @pagination="getDeviceCountList"
      />
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
/** 巡检记录 列表 */
import CheckDetailList from '@/views/agriculture/checkview/components/checkDetailList.vue';

defineOptions({ name: 'CheckList' });

import { ParkInfoVO } from '@/api/agriculture/parkinfo';
import { CheckLogsApi } from '@/api/agriculture/checklogs';
// 设备统计信息列表的数据
const listDevice = ref<ParkInfoVO[]>([]);
// 设备统计信息列表的总页数
const totalDevice = ref(0);
const loading = ref(false); // 列表的加载中
const containerDom = ref();
const emit = defineEmits(['clearTree', 'heightChange']);

const queryParamsCountPageByBaseId = reactive({
  pageNo: 1,
  pageSize: 10,
  baseId: '',
  createTime: ''
});

/** 查询设备分类统计列表 */
const getDeviceCountList = async () => {
  loading.value = true;
  try {
    const data = await CheckLogsApi.getCountPageByBaseId(queryParamsCountPageByBaseId);
    listDevice.value = data.list;
    totalDevice.value = data.total;
  } finally {
    loading.value = false;
  }
  emit('heightChange', containerDom.value.clientHeight);
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParamsCountPageByBaseId.pageNo = 1;
  getDeviceCountList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryParamsCountPageByBaseId.pageNo = 1;
  queryParamsCountPageByBaseId.pageSize = 10;
  queryParamsCountPageByBaseId.createTime = formatCurrentDate();
  emit('clearTree');
  handleQuery();
};

/**获取当前时间 */
function formatCurrentDate() {
  const now = new Date();
  return (
    now.getFullYear() +
    '-' +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    now.getDate().toString().padStart(2, '0')
  );
}

/** 初始化 **/
onMounted(() => {
  //默认赋值查询参数
  resetQuery();
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

// 定义属性
const props = defineProps({
  currCategory: {
    type: Object,
    default: () => ({})
  }
});

// 监听父组件category变化
watch(
  () => props.currCategory,
  () => {
    if (props.currCategory) {
      queryParamsCountPageByBaseId.baseId = props.currCategory.id;
    }
    handleQuery();
  }
);
</script>
<style scoped lang="scss">
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
