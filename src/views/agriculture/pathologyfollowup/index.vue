<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="病虫害" prop="disease">
        <el-input
          v-model="queryParams.disease"
          placeholder="请输入病虫害"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="病虫害类型" prop="diseaseType">
        <el-select
          v-model="queryParams.diseaseType"
          placeholder="请选择病虫害类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DISEASE_CATEGORY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="治疗时间" prop="treatmentTime">
        <el-date-picker
          v-model="queryParams.treatmentTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DISEASE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="效果" prop="effect">
        <el-select v-model="queryParams.effect" placeholder="请选择效果" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DISEASE_EFFECT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="失效日" prop="failureDate">
        <el-date-picker
          v-model="queryParams.failureDate"
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
          v-hasPermi="['agriculture:pathology-followup:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:pathology-followup:export']"
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
      <el-table-column label="地块" align="center" prop="plotName" />
      <el-table-column label="作物" align="center" prop="cropName" />
      <el-table-column label="病虫害" align="center" prop="disease" />
      <el-table-column label="问题" align="center" prop="problem" />
      <el-table-column label="病虫害类型" align="center" prop="diseaseType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_DISEASE_CATEGORY" :value="scope.row.diseaseType" />
        </template>
      </el-table-column>
      <el-table-column label="治疗措施" align="center" prop="treatment" />
      <el-table-column
        label="治疗时间"
        align="center"
        prop="treatmentTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_DISEASE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="效果" align="center" prop="effect">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_DISEASE_EFFECT" :value="scope.row.effect" />
        </template>
      </el-table-column>
      <el-table-column
        label="失效日"
        align="center"
        prop="failureDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:pathology-followup:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:pathology-followup:delete']"
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
  <PathologyFollowupForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime';
import download from '@/utils/download';
import { PathologyFollowupApi, PathologyFollowupVO } from '@/api/agriculture/pathologyfollowup';
import PathologyFollowupForm from './PathologyFollowupForm.vue';

/** 病理跟进 列表 */
defineOptions({ name: 'PathologyFollowup' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<PathologyFollowupVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  plotId: undefined,
  disease: undefined,
  diseaseType: undefined,
  treatmentTime: [],
  status: undefined,
  effect: undefined,
  failureDate: [],
  createTime: [],
  belongPark: undefined,
  belongPlot: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await PathologyFollowupApi.getPathologyFollowupPage(queryParams);
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
    await PathologyFollowupApi.deletePathologyFollowup(id);
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
    const data = await PathologyFollowupApi.exportPathologyFollowup(queryParams);
    download.excel(data, '病理跟进.xls');
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
