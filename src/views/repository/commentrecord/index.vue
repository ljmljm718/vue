<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="评价对象序号" prop="toId">
        <el-input
          v-model="queryParams.toId"
          placeholder="请输入评价对象序号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="回复评论序号" prop="recoverId">
        <el-input
          v-model="queryParams.recoverId"
          placeholder="请输入回复评论序号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="评论内容" prop="comment">
        <el-input
          v-model="queryParams.comment"
          placeholder="请输入评论内容"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="评论时间" prop="commentTime">
        <el-date-picker
          v-model="queryParams.commentTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <!-- <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['repository:comment-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button> -->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['repository:comment-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键" align="center" prop="commentId" /> -->
      <el-table-column label="评价对象序号" align="center" prop="toId" />
      <el-table-column label="回复评论序号" align="center" prop="recoverId" />
      <el-table-column label="评论内容" align="center" prop="comment" />
      <el-table-column
        label="评论时间"
        align="center"
        prop="commentTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.commentId)"
            v-hasPermi="['repository:comment-record:update']"
          >
            编辑
          </el-button> -->
          <el-button
            link
            type="primary"
            @click="openForm('create', scope.row.commentId, scope.row.toId)"
          >
            回复
          </el-button>
          <!-- <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.commentId)"
            v-hasPermi="['repository:comment-record:delete']"
          >
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CommentRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { CommentRecordApi, CommentRecordVO } from '@/api/repository/commentrecord';
import CommentRecordForm from './CommentRecordForm.vue';

/** 评价记录 列表 */
defineOptions({ name: 'CommentRecord' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<CommentRecordVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  toId: undefined,
  recoverId: undefined,
  comment: undefined,
  commentTime: [],
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await CommentRecordApi.getCommentRecordPage(queryParams);
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
const openForm = (type: string, id?: number, toId?: number) => {
  formRef.value.open(type, id, toId);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await CommentRecordApi.deleteCommentRecord(id);
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
    const data = await CommentRecordApi.exportCommentRecord(queryParams);
    download.excel(data, '评价记录.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList();
});
</script>
