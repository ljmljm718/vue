<template>
  <!-- 搜索工作栏 -->
  <Dialog
    title="选择方案动作"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    @close="resetQuery()"
    width="1300"
  >
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="动作编号" prop="actionId">
          <el-input
            v-model="queryParams.actionId"
            placeholder="请输入动作编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="动作内容" prop="actionContent">
          <el-input
            v-model="queryParams.actionContent"
            placeholder="请输入动作内容"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="动作名称" prop="actionName">
          <el-input
            v-model="queryParams.actionName"
            placeholder="请输入动作名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="动作类型" prop="actionType">
          <el-select
            v-model="queryParams.actionType"
            placeholder="请选择动作类型"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.ACTION_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请求参数" prop="requestParams">
          <el-input
            v-model="queryParams.requestParams"
            placeholder="请输入请求参数"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input
            v-model="queryParams.sortOrder"
            placeholder="请输入排序"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
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
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        :stripe="true"
        ref="multipleTableRef"
        @select="select"
        @row-click="selectClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column label="动作编号" align="center" prop="actionId" />
        <el-table-column label="动作内容" align="center" prop="actionContent" />
        <el-table-column label="动作名称" align="center" prop="actionName" />
        <el-table-column label="动作类型" align="center" prop="actionType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ACTION_TYPE" :value="scope.row.actionType" />
          </template>
        </el-table-column>
        <el-table-column label="URL" align="center" prop="url" />
        <el-table-column label="请求参数" align="center" prop="requestParams" />
        <el-table-column label="排序" align="center" prop="sortOrder" />
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { ActionPlanTableApi, ActionPlanTableVO } from '@/api/agriculture/actionplantable';
import { TemplateIntermediateTableApi } from '@/api/agriculture/templateintermediatetable';

/** 方案动作 列表 */
defineOptions({ name: 'ActionPlanTable' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<ActionPlanTableVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  actionId: undefined,
  actionContent: undefined,
  actionName: undefined,
  actionType: undefined,
  requestParams: undefined,
  sortOrder: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/**
 *
 */
const multipleTableRef = ref();
const select = (selection, row) => {
  // 清除 所有勾选项
  //   multipleTableRef.value.clearSelection();
  // 当表格数据都没有被勾选的时候 就返回
  // 主要用于将当前勾选的表格状态清除
  if (selection.length == 0) return;
  multipleTableRef.value.toggleRowSelection(row, true);
};

// 控制单选——table选择项发生变化时
const selectClick = (row) => {
  const selectData = selectionList.value;
  //   multipleTableRef.value.clearSelection();
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

/** 选中操作 */
const selectionList = ref<ActionPlanTableVO[]>([]);
const handleSelectionChange = (rows: ActionPlanTableVO[]) => {
  selectionList.value = rows;
};

const dialogVisible = ref(false); // 弹窗的是否展示
/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: ActionPlanTableVO[]): void;
}>();

const idArray = ref([]);
const submitForm = async () => {
  selectionList.value.forEach((item) => {
    idArray.value.push(item.id.toString());
  });
  await TemplateIntermediateTableApi.createBatchTemplateIntermediateTable(
    idArray.value,
    fuId.value
  );
  ElMessage({
    message: '绑定成功.',
    type: 'success'
  });
  try {
    emits('success', selectionList.value);
  } finally {
    // 关闭弹窗
    dialogVisible.value = false;
  }
};

const fuId = ref();
/** 打开弹窗 */
const open = async (id: string) => {
  fuId.value = id;
  idArray.value = [];

  dialogVisible.value = true;
  await nextTick(); // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery();
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/**
 *
 */

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ActionPlanTableApi.getActionPlanTablePage(queryParams);
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
    await ActionPlanTableApi.deleteActionPlanTable(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}
};

/** 初始化 **/
onMounted(() => {
  getList();
});
</script>
