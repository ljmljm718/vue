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
      <el-form-item label="作物" prop="crop">
        <el-input
          v-model="queryParams.crop"
          placeholder="请输入作物"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生长物候" prop="phenologicalStage">
        <el-input
          v-model="queryParams.phenologicalStage"
          placeholder="请输入生长物候"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="适宜活动" prop="suitableActivity">
        <el-select
          v-model="queryParams.suitableActivity"
          placeholder="请选择适宜活动"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_SUITABILITY_ACTIVITY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物候开始时间" prop="phenologicalStartDate">
        <el-date-picker
          v-model="queryParams.phenologicalStartDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物候结束时间" prop="phenologicalEndDate">
        <el-date-picker
          v-model="queryParams.phenologicalEndDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="适宜度" prop="suitabilityLevel">
        <el-select
          v-model="queryParams.suitabilityLevel"
          placeholder="请选择适宜度"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_SUITABILITY_DEGREE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['agri:crop-suitability-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agri:crop-suitability-rule:export']"
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
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="作物" align="center" prop="crop" />
      <el-table-column label="生长物候" align="center" prop="phenologicalStage" />
      <el-table-column label="作物图片" align="center" prop="cropPicture">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            :src="row.cropPicture"
            :preview-src-list="[row.cropPicture]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="适宜活动" align="center" prop="suitableActivity">
        <template #default="scope">
          <dict-tag
            :type="DICT_TYPE.AGRI_SUITABILITY_ACTIVITY"
            :value="scope.row.suitableActivity"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="物候开始时间"
        align="center"
        prop="phenologicalStartDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="物候结束时间"
        align="center"
        prop="phenologicalEndDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="温度上限" align="center" prop="temperatureUpper" />
      <el-table-column label="温度下限" align="center" prop="temperatureLower" />
      <el-table-column label="适宜度" align="center" prop="suitabilityLevel">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_SUITABILITY_DEGREE" :value="scope.row.suitabilityLevel" />
        </template>
      </el-table-column>
      <el-table-column label="适宜度说明" align="center" prop="suitabilityDescription" />
      <el-table-column label="参考对策建议" align="center" prop="referenceSuggestions" />
      <el-table-column
        label="农事活动适宜度说明"
        align="center"
        prop="agriculturalActivitySuitabilityDescription"
      />
      <el-table-column
        label="未来七天湿度建议"
        align="center"
        prop="humidityRecommendationsForNext7Days"
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
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:crop-suitability-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:crop-suitability-rule:delete']"
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
  <CropSuitabilityRuleForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter2 } from '@/utils/formatTime';
import download from '@/utils/download';
import { CropSuitabilityRuleApi, CropSuitabilityRuleVO } from '@/api/agri/cropsuitabilityrule';
import CropSuitabilityRuleForm from './CropSuitabilityRuleForm.vue';

/** 作物适宜规则 列表 */
defineOptions({ name: 'CropSuitabilityRule' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<CropSuitabilityRuleVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  crop: undefined,
  phenologicalStage: undefined,
  cropPicture: undefined,
  suitableActivity: undefined,
  phenologicalStartDate: [],
  phenologicalEndDate: [],
  suitabilityLevel: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await CropSuitabilityRuleApi.getCropSuitabilityRulePage(queryParams);
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
    await CropSuitabilityRuleApi.deleteCropSuitabilityRule(id);
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
    const data = await CropSuitabilityRuleApi.exportCropSuitabilityRule(queryParams);
    download.excel(data, '作物适宜规则.xls');
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
