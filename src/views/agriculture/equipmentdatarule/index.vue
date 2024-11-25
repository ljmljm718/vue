<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">数据同步规则</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!--
          一级标题旁边的按钮
          主按钮 type="primary" 次按钮不设置 type 属性 不设置 plain 属性
        -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:equipment-data-rule:create']"
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
      <el-form-item label="终端" prop="dtuId">
        <el-input
          v-model="queryParams.dtuId"
          placeholder="请输入终端"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通道" prop="channelId">
        <el-input
          v-model="queryParams.channelId"
          placeholder="请输入通道"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="监测类型" prop="monitoringType">
        <el-input
          v-model="queryParams.monitoringType"
          placeholder="请输入监测类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
    </el-form>

    <div class="w-full mt-[16px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        border
      >
        <el-table-column label="设备名称" align="center" prop="deviceName" width="180" />
        <el-table-column label="终端" align="center" prop="dtuId" width="150" />
        <el-table-column label="通道" align="center" prop="channelId" width="150" />
        <el-table-column label="参数" align="center" prop="param" />
        <el-table-column label="监测类型" align="center" prop="monitoringType" width="100" />
        <el-table-column label="单位" align="center" prop="ruleUnit" />
        <el-table-column label="规则类型" align="center" prop="ruleType" width="150">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.DATA_SYNC_RULE_TYPE" :value="scope.row.ruleType" />
          </template>
        </el-table-column>
        <el-table-column label="系数" align="center" prop="rule" />
        <el-table-column label="字典" align="center" prop="dictionary" />
        <el-table-column label="备注" align="center" prop="remark" />
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
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:equipment-data-rule:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:equipment-data-rule:delete']"
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
  <EquipmentDataRuleForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { EquipmentDataRuleApi, EquipmentDataRuleVO } from '@/api/agriculture/equipmentdatarule';
import EquipmentDataRuleForm from './EquipmentDataRuleForm.vue';

/** 设备数据规则 列表 */
defineOptions({ name: 'EquipmentDataRule' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<EquipmentDataRuleVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  dtuId: undefined,
  channelId: undefined,
  param: undefined,
  monitoringType: undefined,
  ruleType: undefined,
  rule: undefined,
  ruleUnit: undefined,
  deviceId: undefined,
  deviceName: undefined,
  createTime: [],
  remark: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
import { useRouter } from 'vue-router';
import { DICT_TYPE } from '@/utils/dict';

const { currentRoute } = useRouter();
const route = currentRoute.value;
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await EquipmentDataRuleApi.getEquipmentDataRulePage(queryParams);
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
    await EquipmentDataRuleApi.deleteEquipmentDataRule(id);
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
    const data = await EquipmentDataRuleApi.exportEquipmentDataRule(queryParams);
    download.excel(data, '设备数据规则.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  if (route.query.dtuId) queryParams.dtuId = route.query.dtuId as string;
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
