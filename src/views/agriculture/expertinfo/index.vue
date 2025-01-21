<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="专家姓名" prop="expert">
        <el-input
          v-model="queryParams.expert"
          placeholder="请输入专家姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="服务区域" prop="serviceArea">
        <el-input
          v-model="queryParams.serviceArea"
          placeholder="请输入服务区域"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="擅长病害" prop="specializedDiseases">
        <el-input
          v-model="queryParams.specializedDiseases"
          placeholder="请输入擅长病害"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="作物" prop="crop">
        <el-input
          v-model="queryParams.crop"
          placeholder="请输入作物"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input
          v-model="queryParams.status"
          placeholder="请输入状态"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="contactInfo">
        <el-input
          v-model="queryParams.contactInfo"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:expert-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:expert-info:export']"
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
      <!-- <el-table-column label="主键ID" align="center" prop="id" /> -->
      <el-table-column label="专家姓名" align="center" prop="expert" />
      <el-table-column label="服务区域" align="center" prop="serviceArea" />
      <el-table-column label="擅长病害" align="center" prop="specializedDiseases" />
      <el-table-column label="作物" align="center" prop="crop" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="联系方式" align="center" prop="contactInfo" />
      <el-table-column label="留言数" align="center" prop="messagesNumber" />
      <el-table-column label="点赞数" align="center" prop="likesNumber" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="240px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:expert-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:expert-info:delete']"
          >
            删除
          </el-button>
          <el-button link type="success" @click="addLike(scope.row.id)">点赞</el-button>
          <el-button link type="warning" @click="addMessages('create', scope.row.id)">
            留言
          </el-button>
          <el-button link type="default" @click="showMessages(scope.row.id)">查看留言</el-button>
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
  <ExpertInfoForm ref="formRef" @success="getList" />

  <!-- 表单弹窗：添加/修改 -->
  <CommentRecordForm ref="CommentRecordFormRef" @success="getList() && getListMessages()" />

  <!-- start事项查看弹窗 -->
  <el-drawer v-model="drawer2" :direction="direction" :data="MessageFormData">
    <template #header>
      <h3>留言查看</h3>
    </template>
    <template #default>
      <div class="relative space-y-3 py-4 box-border">
        <el-card class="w-full" v-for="(item, index) in MessageFormData" :key="index">
          <p>留言内容: {{ item.comment }}</p>
          <p>留言时间：{{ formatTime(item.commentTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
          <!-- <el-button @click="replyMassage(item)" type="primary">
            回复
          </el-button> -->
          <el-button type="primary" @click="replyMassage('create', item.commentId, item.toId)">
            回复
          </el-button>
        </el-card>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { ExpertInfoApi, ExpertInfoVO } from '@/api/agriculture/expertinfo';
import { LikeRecordApi, LikeRecordVO } from '@/api/repository/likerecord';

import ExpertInfoForm from './ExpertInfoForm.vue';
import CommentRecordForm from '@/views/repository/commentrecord/CommentRecordForm.vue';
import { CommentRecordApi, CommentRecordVO } from '@/api/repository/commentrecord';
import { formatTime } from '@/utils/index';

/** 专家信息 列表 */
defineOptions({ name: 'ExpertInfo' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<ExpertInfoVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  expert: undefined,
  serviceArea: undefined,
  specializedDiseases: undefined,
  crop: undefined,
  status: undefined,
  contactInfo: undefined,
  messagesNumber: undefined,
  likesNumber: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ExpertInfoApi.getExpertInfoPage(queryParams);
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
const formData = ref();

/** 查看评论操作 */
//start事件查看方法
const drawer2 = ref(false);
const MessageFormData = ref<CommentRecordVO[]>([]);
const expertId = ref();
const showMessages = async (id: number) => {
  expertId.value = id;
  let resData = await CommentRecordApi.getCommentRecordPage({ toId: id });
  MessageFormData.value = resData.list;
  drawer2.value = true;
};
/** 添加评论操作 */
const CommentRecordFormRef = ref();
const addMessages = (type: string, toId?: number) => {
  CommentRecordFormRef.value.open(type, toId);
};
/** 点赞按钮操作 */
const addLike = async (id: number) => {
  try {
    let resid = await LikeRecordApi.createLikeRecord({ likeId: id });
    if (resid.data == 0 || resid.data == '0' || resid == 0 || resid == '0') {
      message.error(t('取消点赞成功'));
    }
    message.success(t(' 点赞成功'));
    // 刷新列表
    await getList();
  } catch {}
};
/** 回复评论 */
const replyMassage = (type: string, id?: number, toId?: number) => {
  CommentRecordFormRef.value.open(type, id, toId);
};
/**
 * 获取最新的评论数据
 */
const getListMessages = async () => {
  let resData = await CommentRecordApi.getCommentRecordPage({ toId: expertId.value });
  MessageFormData.value = resData.list;
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await ExpertInfoApi.deleteExpertInfo(id);
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
    const data = await ExpertInfoApi.exportExpertInfo(queryParams);
    download.excel(data, '专家信息.xls');
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
