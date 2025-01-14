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
      <el-form-item label="虫害名称" prop="pestName">
        <el-input
          v-model="queryParams.pestName"
          placeholder="请输入虫害名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="虫害类别" prop="pestType">
        <el-input
          v-model="queryParams.pestType"
          placeholder="请输入虫害类别"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="宿主作物" prop="hostName">
        <el-input
          v-model="queryParams.hostName"
          placeholder="请输入宿主作物"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="监测方法" prop="monitorType">
        <el-input
          v-model="queryParams.monitorType"
          placeholder="请输入监测方法"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:ai-pest-control:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:ai-pest-control:export']"
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
      <el-table-column label="虫害名称" align="center" prop="pestName" width="120" />
      <el-table-column label="虫害类别" align="center" prop="pestType" width="100" />
      <el-table-column label="宿主作物" align="center" prop="hostName" width="80" />
      <el-table-column label="生命周期" align="center" prop="lifeCycle" />
      <el-table-column label="危害症状" align="center" prop="damage" />
      <el-table-column label="监测方法" align="center" prop="monitorType" />
      <el-table-column label="预防措施" align="center" prop="prevention" />
      <el-table-column label="控制方法" align="center" prop="controlMethod" />
      <el-table-column label="虫害图片" align="center" prop="imageUrl">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.imageUrl"
            :preview-src-list="[row.imageUrl]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:ai-pest-control:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:ai-pest-control:delete']"
          >
            删除
          </el-button>
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
  <AiPestControlForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download';
import { AiPestControlApi, AiPestControlVO } from '@/api/agriculture/aipestcontrol';
import AiPestControlForm from './AiPestControlForm.vue';

/** 虫害防治 列表 */
defineOptions({ name: 'AiPestControl' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<AiPestControlVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  pestName: undefined,
  pestType: undefined,
  hostName: undefined,
  monitorType: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await AiPestControlApi.getAiPestControlPage(queryParams);
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
    await AiPestControlApi.deleteAiPestControl(id);
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
    const data = await AiPestControlApi.exportAiPestControl(queryParams);
    download.excel(data, '虫害防治.xls');
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
