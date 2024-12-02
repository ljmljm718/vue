<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import { DICT_TYPE } from '@/utils/dict';
import { CategoryManagementApi } from '@/api/agriculture/categorymanagement';
import IdentificationResultForm from '../identificationresult/IdentificationResultForm.vue';
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化
import { IdentificationResultApi } from '@/api/agriculture/identificationresult';

const loading = ref<boolean>(false);
const tableData = ref<any[]>([]);
const tableTotal = ref<number>(0);
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
});

const props = defineProps({
  activeMainTableId: { type: String, required: true },
  monitorType: { type: String, required: true },
  height: { type: String, required: false }
});
const activeMainTableId = ref<string>(props.activeMainTableId);
const monitorType = ref<string>(props.monitorType);

const emit = defineEmits(['refresh']);

const getList = async (mainTableId: string = activeMainTableId.value) => {
  activeMainTableId.value = mainTableId;
  loading.value = true;
  const { list, total } = await CategoryManagementApi.identificationResultPage({
    mainTableId,
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize
  }).catch(() => {
    loading.value = false;
  });
  loading.value = false;
  if (Array.isArray(list)) {
    tableData.value = list.map((ele) => {
      return { ...ele, monitorType: monitorType };
    });
    tableTotal.value = total;
  }
  emit('refresh');
};
getList();

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
  if (type === 'create') {
    formRef.value.formData.mainTableId = activeMainTableId.value;
  }
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
</script>
<template>
  <div :class="height">
    <el-table
      style="height: 100%"
      v-loading="loading"
      :data="tableData"
      :show-overflow-tooltip="true"
      stripe
    >
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="密度(个/m³)" align="center" prop="density" />
      <el-table-column label="监测类型" align="center" prop="monitorType" />
      <el-table-column
        label="识别时间"
        align="center"
        prop="recognitionTime"
        width="200"
        :formatter="dateFormatter"
      />
      <el-table-column label="识别类型" align="center" prop="recognitionType" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_RECOGNITION_TYPE" :value="scope.row.recognitionType" />
        </template>
      </el-table-column>
      <el-table-column label="记录人" align="center" prop="recorder" />
      <el-table-column label="操作" align="center" fixed="right" width="100">
        <template #default="scope">
          <a
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:identification-result:delete']"
          >
            <span class="text-[#009688] cursor-pointer">删除</span>
          </a>
          <span class="mx-[.5rem] cursor-default">|</span>
          <a
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:identification-result:update']"
          >
            <span class="text-[#009688] cursor-pointer">编辑</span>
          </a>
        </template>
      </el-table-column>

      <template #empty>
        <div class="w-full h-[255px] flex justify-center items-center">
          <div class="table-no-data"></div>
        </div>
      </template>
    </el-table>

    <Pagination
      :total="tableTotal"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 表单弹窗：添加/修改 -->
    <IdentificationResultForm ref="formRef" @success="getList" />
  </div>
</template>
<style scoped lang="scss">
.table-no-data {
  width: 64px;
  height: 62px;
  background-image: url(./assets/table-no-data.png);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
