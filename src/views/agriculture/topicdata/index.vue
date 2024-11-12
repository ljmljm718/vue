<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="90px">
      <el-form-item label="主题名称" prop="topicName">
        <el-input
          v-model="queryParams.topicName"
          placeholder="请输入主题名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
        <el-select v-model="queryParams.topicIsorder" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MQTT_SUBSCRIBE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主题类型" prop="topicType">
        <el-select v-model="queryParams.topicType" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MQTT_TOPIC_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
      </el-form-item>
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-form-item>
      <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['agriculture:topic-data:create']">
        <Icon icon="ep:plus" class="mr-5px" />
        新增
      </el-button>
      <el-button
        type="success"
        plain
        @click="handleExport"
        :loading="exportLoading"
        v-hasPermi="['agriculture:topic-data:export']"
      >
        <Icon icon="ep:download" class="mr-5px" />
        导出
      </el-button>
      <el-button
        type="primary"
        plain
        :disabled="multiple || sub"
        @click="handleSubscribe"
        v-hasPermi="['agriculture:topic-data:subscribe']"
      >
        订阅主题
      </el-button>
      <el-button
        type="warning"
        plain
        :disabled="multiple || unsub"
        @click="handleUnsubscribe"
        v-hasPermi="['agriculture:topic-data:unsubscribe']"
      >
        退订主题
      </el-button>
      <el-button type="success" plain @click="handleSubscribeAll" v-hasPermi="['agriculture:topic-data:subscribeall']">
        全部订阅
      </el-button>
      <el-button type="danger" plain @click="handleUnSubscribeAll" v-hasPermi="['agriculture:topic-data:unsubscribeAll']">
        全部退订
      </el-button>
    </el-form-item>
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
          <dict-tag :type="DICT_TYPE.AGRI_MQTT_SUBSCRIBE_STATUS" :value="scope.row.topicIsorder" />
        </template>
      </el-table-column>
      <el-table-column label="处理类" align="center" prop="topicClass" />
      <el-table-column label="备注" align="center" prop="topicNote" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
      <el-table-column label="操作" align="center" width="100">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['agriculture:topic-data:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['agriculture:topic-data:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

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
</script>
<style scoped lang="scss">
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
