<template>
  <Dialog title="绑定模板" v-model="dialogVisible" style="width: 1000px">
    <!-- 搜索工作栏 -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入模板名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="模板编号" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入模版编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择开启状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" />
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table
        ref="dialogTable"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        :stripe="true"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
        @row-click="selectClick"
        highlight-current-row
      >
        <el-table-column type="selection" width="30" label="选择" :reserve-selection="true" />
        <el-table-column
          label="模板编码"
          align="center"
          prop="code"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="模板名称"
          align="center"
          prop="name"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="发送人名称" align="center" prop="nickname" />
        <el-table-column
          label="模板内容"
          align="center"
          prop="content"
          width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="开启状态" align="center" prop="status" width="80">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <!--        <el-table-column-->
        <!--          label="创建时间"-->
        <!--          align="center"-->
        <!--          prop="createTime"-->
        <!--          width="180"-->
        <!--          :formatter="dateFormatter"-->
        <!--        />-->
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getTableList"
      />
    </ContentWrap>
    <template #footer>
      <el-button type="primary" @click="handleBindTemplate">确 定</el-button>
      <el-button @click="handleBeforeClose()">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import * as NotifyTemplateApi from '@/api/system/notify/template';
import { ElTable } from 'element-plus';
import { AgriWarningRuleDeviceApi } from '@/api/agriculture/agriwarningruledevice';
import { NotifyTemplateRuleApi } from '@/api/agriculture/notifytemplaterule';

defineOptions({ name: 'NotifyTemplateSelectList' });

const message = useMessage(); // 消息弹窗

const ruleId = ref(); // 传入的预警规则id
const templateIds = ref([]); // 绑定的模板id
const dialogVisible = ref(false); // 弹窗的是否展示
const loading = ref(false); // 列表的加载中
const total = ref(0); // 列表的总页数
const list = ref([]); // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  code: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单

/** 打开弹窗 */
const open = async (id?: number) => {
  dialogVisible.value = true;
  ruleId.value = id;
  resetQuery();
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const dialogTable = ref();
const getTableList = async () => {
  loading.value = true;
  try {
    templateIds.value = await NotifyTemplateRuleApi.selectTemplateIdByRuleId(
      'agri_warning_rule',
      ruleId.value
    );
    console.log('templateIds.value', templateIds.value);
    const data = await NotifyTemplateApi.getNotifyTemplatePage(queryParams);
    list.value = data.list;
    total.value = data.total;
    await initializeSelection();
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getTableList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields();
  }
  handleQuery();
};

//选中的list
const getRowKeys = (row) => {
  //记录每行的key值
  return row.id;
};
const selectionList = ref<Array<any>>([]);
//当表格选择项发生变化时会触发该事件
const handleSelectionChange = (rows) => {
  // 解决来回切换页面，也无法清除上次选中情况
  selectionList.value = rows;
  templateIds.value = [];
  if (rows) {
    undefined;
    rows.forEach((row) => {
      undefined;
      if (row) {
        undefined;
        templateIds.value.push(row.id);
      }
    });
  }
};

// 控制table-----多选选择
const selectClick = (row) => {
  const selectData = selectionList.value;
  // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
  const isRowSelected = selectData.some((selectedRow) => selectedRow === row);
  dialogTable.value.toggleRowSelection(row, !isRowSelected);
};

const initializeSelection = async () => {
  await nextTick(() => {
    templateIds.value.forEach((id) => {
      const row = list.value.find((item) => item.id === id);
      if (row && dialogTable.value) {
        dialogTable.value.toggleRowSelection(row, true);
      }
    });
  });
};

const handleBeforeClose = () => {
  queryFormRef.value?.resetFields();
  list.value = [];
  dialogVisible.value = false;
};

/** 确认绑定站内信模块  */
const emit = defineEmits(['template']);
const handleBindTemplate = async () => {
  loading.value = true;
  try {
    const temp = { ruleId: ruleId.value, templateIds: templateIds.value };
    const data = temp as any;
    await NotifyTemplateRuleApi.WarnRuleBindTemplate(data);
    message.success(t('common.createSuccess'));
    emit('template');
  } finally {
    loading.value = false;
    dialogVisible.value = false;
  }
};

// /** 初始化 **/
// onMounted(() => {
//   initializeSelection()
// })
</script>
