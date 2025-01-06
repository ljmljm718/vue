<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="登记证号" prop="registrationNumber">
        <el-input
          v-model="queryParams.registrationNumber"
          placeholder="请输入登记证号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="登记证持有人" prop="holder">
        <el-input
          v-model="queryParams.holder"
          placeholder="请输入登记证持有人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农药名称" prop="pesticideName">
        <el-input
          v-model="queryParams.pesticideName"
          placeholder="请输入农药名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="剂型" prop="formulation">
        <el-input
          v-model="queryParams.formulation"
          placeholder="请输入剂型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="毒性" prop="toxicity">
        <el-input
          v-model="queryParams.toxicity"
          placeholder="请输入毒性"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="有效成分及其含量" prop="activeIngredients">
        <el-input
          v-model="queryParams.activeIngredients"
          placeholder="请输入有效成分及其含量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农药类别" prop="pesticideCategory">
        <el-input
          v-model="queryParams.pesticideCategory"
          placeholder="请输入农药类别"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="作物/场所" prop="cropOrPlace">
        <el-input
          v-model="queryParams.cropOrPlace"
          placeholder="请输入作物/场所"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品质量标准号" prop="qualityStandardNumber">
        <el-input
          v-model="queryParams.qualityStandardNumber"
          placeholder="请输入产品质量标准号"
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
          v-hasPermi="['agriculture:pesticide-registration:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:pesticide-registration:export']"
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
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="登记证号" align="center" prop="registrationNumber" />
      <el-table-column label="登记证持有人" align="center" prop="holder" />
      <el-table-column label="农药名称" align="center" prop="pesticideName" />
      <el-table-column label="剂型" align="center" prop="formulation" />
      <el-table-column label="毒性" align="center" prop="toxicity" />
      <el-table-column label="有效成分及其含量" align="center" prop="activeIngredients" />
      <el-table-column label="农药类别" align="center" prop="pesticideCategory" />
      <el-table-column label="作物/场所" align="center" prop="cropOrPlace" />
      <el-table-column label="产品质量标准号" align="center" prop="qualityStandardNumber" />
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:pesticide-registration:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:pesticide-registration:delete']"
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
  <PesticideRegistrationForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import {
  PesticideRegistrationApi,
  PesticideRegistrationVO
} from '@/api/agriculture/pesticideregistration';
import PesticideRegistrationForm from './PesticideRegistrationForm.vue';

/** 农药登记 列表 */
defineOptions({ name: 'PesticideRegistration' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<PesticideRegistrationVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  registrationNumber: undefined,
  holder: undefined,
  pesticideName: undefined,
  formulation: undefined,
  toxicity: undefined,
  activeIngredients: undefined,
  pesticideCategory: undefined,
  cropOrPlace: undefined,
  qualityStandardNumber: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await PesticideRegistrationApi.getPesticideRegistrationPage(queryParams);
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
    await PesticideRegistrationApi.deletePesticideRegistration(id);
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
    const data = await PesticideRegistrationApi.exportPesticideRegistration(queryParams);
    download.excel(data, '农药登记.xls');
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
