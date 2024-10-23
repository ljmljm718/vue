<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
import { CategoryManagementApi } from "@/api/agriculture/categorymanagement";
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  title: propTypes.string.def('')
});

const dialogTitle = computed(() => {
  return props.title ?? ''
})

const showResult = ref<boolean>(false)
const loading = ref<boolean>(false);
const tableData = ref<any[]>([]);
const tableTotal = ref<number>(0);
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
});
const activeMainTableId = ref<string>('')
const getList = async (
  mainTableId:string = activeMainTableId.value
) => {
  activeMainTableId.value = mainTableId;
  loading.value = true;
  const { list, total } = await CategoryManagementApi.identificationResultPage({
    mainTableId,
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize
  }).catch(() => {
    loading.value = false;
  })
  loading.value = false;
  if (Array.isArray(list)) {
    tableData.value = list;
    tableTotal.value = total;
  }
}

// 关闭侧栏
const handleClose = () => {
  loading.value = false;
  showResult.value = false;
  tableData.value = [];
  queryParams.pageNo = 1;
  queryParams.pageSize = 10;
  tableTotal.value = 0;
}

const handleOpen = (mainTableId:string) => {
  showResult.value = true;
  getList(mainTableId);
}
defineExpose({ handleOpen })
</script>
<template>
  <div
    class="
      absolute top-0 right-0
      p-3 z-20 bg-white
      shadow-xl h-full
      transition-all 
      duration-700 box-border
    "
    :style="`right: ${showResult ? '0' : '-100%'};`"
  >
    <div
      class="
        flex justify-between items-center
        pb-3 pt-1 px-1 h-2rem box-border
      "
    >
      <div class="font-bold">{{ dialogTitle }} 识别结果</div>
      <el-icon @click="handleClose()"><Close /></el-icon>
    </div>
    <div
      style="
        border: 1px solid #e1e1e1;
        height: calc(100% - 2rem);
      "
      class="overflow-auto p-2 box-border rounded-2"
    >
      <el-table
        v-loading="loading"
        :data="tableData"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="数量" align="center" prop="quantity" />
        <el-table-column label="密度" align="center" prop="density" />
        <el-table-column
          label="识别时间"
          align="center"
          prop="recognitionTime"
          width="120"
          :formatter="dateFormatter"
        />
        <el-table-column
          label="识别类型"
          align="center"
          prop="recognitionType"
          width="100"
        >
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.AGRI_RECOGNITION_TYPE"
              :value="scope.row.recognitionType"
            />
          </template>
        </el-table-column>
        <el-table-column label="记录人" align="center" prop="recorder" />
      </el-table>

      <div class="flex flex-row-reverse pr-3">
        <Pagination
          :total="tableTotal"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList()"
        />
      </div>
    </div>
  </div>
</template>