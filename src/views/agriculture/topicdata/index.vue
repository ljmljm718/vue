<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">主题订阅</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
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
      <el-form-item label="主题名称" prop="topicName">
        <el-input
          v-model="queryParams.topicName"
          placeholder="请输入主题名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="主题关键字" prop="topicKey">
          <el-input
            v-model="queryParams.topicKey"
            placeholder="请输入主题关键字"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>-->
      <el-form-item label="是否订阅" prop="topicIsorder">
        <el-select v-model="queryParams.topicIsorder" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MQTT_SUBSCRIBE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主题类型" prop="topicType">
        <el-select v-model="queryParams.topicType" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MQTT_TOPIC_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="flex justify-between mt-[16px]">
      <div class="space-x-[8px]">
        <!-- 左侧的按钮写在下面 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:topic-data:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          :disabled="multiple || sub"
          @click="handleSubscribe"
          v-hasPermi="['agriculture:topic-data:subscribe']"
        >
          订阅主题
        </el-button>
        <el-button
          :disabled="multiple || unsub"
          @click="handleUnsubscribe"
          v-hasPermi="['agriculture:topic-data:unsubscribe']"
        >
          退订主题
        </el-button>
        <el-button @click="handleSubscribeAll" v-hasPermi="['agriculture:topic-data:subscribeall']">
          全部订阅
        </el-button>
        <el-button
          @click="handleUnSubscribeAll"
          v-hasPermi="['agriculture:topic-data:unsubscribeAll']"
        >
          全部退订
        </el-button>
      </div>
      <div class="space-x-[8px]">
        <!-- 右侧的按钮写在这 -->
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:topic-data:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
      </div>
    </div>
    <div class="w-full mt-[8px]">
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        ref="multipleTableRef"
        :show-overflow-tooltip="true"
        border
        @select="select"
        @row-click="selectClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55px" align="left" />
        <el-table-column label="主题名称" align="center" prop="topicName" />
        <el-table-column label="主题类型" align="center" prop="topicType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.AGRI_MQTT_TOPIC_TYPE" :value="scope.row.topicType" />
          </template>
        </el-table-column>
        <!--      <el-table-column label="主题关键字" align="center" prop="topicKey"/>-->
        <el-table-column label="主题" align="center" prop="topicPath" />
        <!--      <el-table-column label="单位" align="center" prop="topicUnit"/>-->
        <el-table-column label="是否订阅" align="center" prop="topicIsorder">
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.AGRI_MQTT_SUBSCRIBE_STATUS"
              :value="scope.row.topicIsorder"
            />
          </template>
        </el-table-column>
        <el-table-column label="处理类" align="center" prop="topicClass" />
        <el-table-column label="备注" align="center" prop="topicNote" />
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
                v-hasPermi="['agriculture:topic-data:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:topic-data:delete']"
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
  <TopicDataForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { TopicDataApi, TopicDataVO } from '@/api/agriculture/topicdata';
import TopicDataForm from './TopicDataForm.vue';
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict';

/** 主题订阅 列表 */
defineOptions({ name: 'TopicData' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<TopicDataVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  topicName: undefined,
  topicKey: undefined,
  topicPath: undefined,
  topicUnit: undefined,
  topicIsorder: undefined,
  topicClass: undefined,
  topicNote: undefined,
  topicType: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

const multiple = ref(true); // 非多个禁用
const topicLists = ref([]); // 选中数据
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await TopicDataApi.getTopicDataPage(queryParams);
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
    await TopicDataApi.deleteTopicData(id);
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
    const data = await TopicDataApi.exportTopicData(queryParams);
    download.excel(data, '主题订阅.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

const sub = ref(true);
const unsub = ref(true);
// 多选框选中数据
const handleSelectionChange = async (selection) => {
  if (selection.length === 1) {
    multiple.value = false;
  } else {
    multiple.value = true;
  }
  topicLists.value = [];
  selection.forEach((item) => {
    if (item.topicIsorder === '1') {
      sub.value = true;
      unsub.value = false;
    } else {
      sub.value = false;
      unsub.value = true;
    }
    topicLists.value.push(item);
  });
};

/** 订阅主题操作 */
const handleSubscribe = async () => {
  const topics = topicLists.value;
  await message.confirm('是否确认订阅主题信息?');
  await TopicDataApi.subscribeTopic(topics);
  message.success('订阅成功');
  // 刷新列表
  await getList();
};

/** 取消订阅操作 */
const handleUnsubscribe = async () => {
  const topics = topicLists.value;
  await message.confirm('是否确认退订主题信息?');
  await TopicDataApi.unsubscribeTopic(topics);
  message.success('退订成功');
  // 刷新列表
  await getList();
};

/** 全部订阅操作 */
const handleSubscribeAll = async () => {
  await message.confirm('是否确认订阅全部主题信息?');
  await TopicDataApi.subscribeAll();
  message.success('全部订阅成功');
  // 刷新列表
  await getList();
};

/** 全部退订操作 */
const handleUnSubscribeAll = async () => {
  await message.confirm('是否确认退订全部主题信息?');
  await TopicDataApi.unsubscribeAll();
  message.success('全部退订成功');
  // 刷新列表
  await getList();
};

const multipleTableRef = ref();
const select = (selection, row) => {
  if (selection.length > 1) {
    let del_row = selection.shift();
    multipleTableRef.value.toggleRowSelection(del_row, false);
  }
};
const selectClick = (row) => {
  const selectData = topicLists.value;
  multipleTableRef.value.clearSelection();
  if (selectData.length == 1) {
    selectData.forEach((item) => {
      // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
      if (item == row) {
        multipleTableRef.value.toggleRowSelection(row, false);
      }
      // 不然就让当前的一行勾选
      else {
        multipleTableRef.value.toggleRowSelection(row, true);
      }
    });
  } else {
    multipleTableRef.value.toggleRowSelection(row, true);
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
<style scoped lang="scss">
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}

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
