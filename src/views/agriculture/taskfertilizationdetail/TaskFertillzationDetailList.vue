<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
      <!-- <el-table-column label="所属任务id" align="center" prop="tfId" /> -->
      <el-table-column label="料桶名" align="center" prop="chargingBasketName" />
      <!-- <el-table-column label="上水阀id" align="center" prop="upperWaterValveId" /> -->
      <el-table-column label="上水量" align="center" prop="upperWaterYield" />
      <!-- <el-table-column label="混肥器id" align="center" prop="fertilizerMixerId" /> -->
      <el-table-column label="混肥器状态" align="center" prop="fertilizerMixerStatus">
        <template #default="scope">
          <dict-tag
            :type="DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK"
            :value="scope.row.fertilizerMixerStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="定量桶状态" align="center" prop="measureBucketStatus">
        <template #default="scope">
          <dict-tag
            :type="DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK"
            :value="scope.row.measureBucketStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
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
  <TaskFertilizationDetailForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import {
  TaskFertilizationDetailApi,
  TaskFertilizationDetailVO
} from '@/api/agriculture/taskfertilizationdetail';
import TaskFertilizationDetailForm from './TaskFertilizationDetailForm.vue';

/** 施肥任务明细 列表 */
defineOptions({ name: 'TaskFertilizationDetail' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<TaskFertilizationDetailVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tfId: undefined,
  chargingBasketName: undefined,
  upperWaterValveId: undefined,
  upperWaterYield: undefined,
  fertilizerMixerId: undefined,
  fertilizerMixerStatus: undefined,
  measureBucketStatus: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

const props = defineProps<{
  tfId: undefined; // 主表（主表的关联字段）
}>();

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    queryParams.tfId = props.tfId;
    const data = await TaskFertilizationDetailApi.getTaskFertilizationDetailPage(queryParams);
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
    await TaskFertilizationDetailApi.deleteTaskFertilizationDetail(id);
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
    const data = await TaskFertilizationDetailApi.exportTaskFertilizationDetail(queryParams);
    download.excel(data, '施肥任务明细.xls');
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
