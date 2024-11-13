<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="auto"
    >
      <el-form-item label="主表ID" prop="mainTableId">
        <el-input
          v-model="queryParams.mainTableId"
          placeholder="请输入主表ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-select v-model="queryParams.name" placeholder="请选择名称" clearable class="!w-240px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DISEASE_NAME)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="密度" prop="density">
        <el-input
          v-model="queryParams.density"
          placeholder="请输入密度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="识别时间" prop="recognitionTime">
        <el-date-picker
          v-model="queryParams.recognitionTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="识别类型" prop="recognitionType">
        <el-select
          v-model="queryParams.recognitionType"
          placeholder="请选择识别类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_RECOGNITION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="记录人" prop="recorder">
        <el-input
          v-model="queryParams.recorder"
          placeholder="请输入记录人"
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
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item class="four-btn-form-item">
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
          v-hasPermi="['agriculture:identification-result:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:identification-result:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
      </el-form-item>
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="id" align="center" prop="id" /> -->
      <el-table-column label="主表ID" align="center" prop="mainTableId" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="密度(个/m³)" align="center" prop="density" />
      <el-table-column
        label="识别时间"
        align="center"
        prop="recognitionTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="识别类型" align="center" prop="recognitionType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_RECOGNITION_TYPE" :value="scope.row.recognitionType" />
        </template>
      </el-table-column>
      <el-table-column label="记录人" align="center" prop="recorder" />
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
            v-hasPermi="['agriculture:identification-result:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:identification-result:delete']"
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
  <IdentificationResultForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import {
  IdentificationResultApi,
  IdentificationResultVO
} from '@/api/agriculture/identificationresult';
import IdentificationResultForm from './IdentificationResultForm.vue';

/** 识别结果 列表 */
defineOptions({ name: 'IdentificationResult' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<IdentificationResultVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  mainTableId: undefined,
  name: undefined,
  quantity: undefined,
  density: undefined,
  recognitionTime: [],
  recognitionType: undefined,
  recorder: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await IdentificationResultApi.getIdentificationResultPage(queryParams);
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
    await IdentificationResultApi.deleteIdentificationResult(id);
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
    const data = await IdentificationResultApi.exportIdentificationResult(queryParams);
    download.excel(data, '识别结果.xls');
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

<style lang="scss" scoped>
// 搜索表单最后一项是四个按钮 超过每个表单项宽度 单独设置
:deep(.four-btn-form-item .el-form-item__content) {
  flex-wrap: nowrap;
}
</style>
