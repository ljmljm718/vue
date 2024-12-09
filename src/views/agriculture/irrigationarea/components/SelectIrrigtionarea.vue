<template>
  <Dialog title="灌区列表" v-model="dialogVisible" :appendToBody="true" :scroll="true" width="1400">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="灌区名称" prop="iaName">
          <el-input
            v-model="queryParams.iaName"
            placeholder="请输入灌区名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="喷灌类型" prop="irrigationType">
          <el-select
            v-model="queryParams.irrigationType"
            placeholder="请选择喷灌类型"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.WFI_IRRIGATION_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="principal">
          <el-input
            v-model="queryParams.principal"
            placeholder="请输入负责人"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="contactInformation">
          <el-input
            v-model="queryParams.contactInformation"
            placeholder="请输入联系方式"
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
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table
        ref="dialogTable"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        :stripe="true"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
        @row-click="selectClick"
        highlight-current-row
      >
        <el-table-column fixed width="30" label="选择" type="selection" />
        <el-table-column label="灌区编号" align="center" prop="iaCode" />
        <el-table-column label="灌区名称" align="center" prop="iaName" />
        <el-table-column label="喷灌类型" align="center" prop="irrigationType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WFI_IRRIGATION_TYPE" :value="scope.row.irrigationType" />
          </template>
        </el-table-column>
        <el-table-column label="阀门状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <el-switch
              :disabled="false"
              v-model="scope.row.deviceStatus"
              active-value="online"
              inactive-value="offline"
            />
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="iaImage" />
        <el-table-column label="纬度" align="center" prop="latitude" />
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="负责人" align="center" prop="principal" />
        <el-table-column label="联系方式" align="center" prop="contactInformation" />
        <el-table-column label="地址" align="center" prop="isAddress" />
        <el-table-column label="备注" align="center" prop="remark" />
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
    <template #footer>
      <el-button :disabled="!selectionList.length" type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="clear()">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { IrrigationAreaApi, IrrigationAreaVO } from '@/api/agriculture/irrigationarea';
import IrrigationAreaForm from './IrrigationAreaForm.vue';
import SelectValvesDeviceFrom from '@/views/agriculture/irrigationarea/components/SelectValvesDeviceFrom.vue';
/** 灌区信息 列表 */
defineOptions({ name: 'IrrigationArea' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<IrrigationAreaVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  iaCode: undefined,
  iaName: undefined,
  irrigationType: undefined,
  iaImage: undefined,
  geofencing: undefined,
  latitude: undefined,
  longitude: undefined,
  principal: undefined,
  contactInformation: undefined,
  isAddress: undefined,
  remark: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const router = useRouter(); // 路由

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    resetQuery();
    dialogVisible.value = false;
  }
});

const clear = async () => {
  dialogVisible.value = false;
  resetQuery();
};

/** 选中操作 */
const dialogVisible = ref(false); // 弹窗的是否展示
const ids = ref([]); // 绑定的设备id
const selectionList = ref<Array<any>>([]);
//当表格选择项发生变化时会触发该事件
const handleSelectionChange = (rows) => {
  // 解决来回切换页面，也无法清除上次选中情况
  selectionList.value = rows;
  ids.value = [];
  if (rows) {
    undefined;
    rows.forEach((row) => {
      undefined;
      if (row) {
        undefined;
        ids.value.push(row.id);
      }
    });
  }
};
// 控制table-----多选选择
const dialogTable = ref();
const selectClick = (row) => {
  console.log('执行selectClick');
  console.log(row.selection);
  const selectData = selectionList.value;
  // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
  const isRowSelected = selectData.some((selectedRow) => selectedRow === row);
  dialogTable.value.toggleRowSelection(row, !isRowSelected);
};

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: IrrigationAreaVO[]): void;
}>();
const submitForm = () => {
  try {
    emits('success', selectionList.value);
  } finally {
    // 关闭弹窗
    dialogVisible.value = false;
  }
};
/** 打开弹窗 */
const idsArray = ref();
const open = async (queryParams) => {
  dialogVisible.value = true;
  idsArray.value = queryParams.split(',');
  await resetQuery();
  await nextTick(); // 等待，避免 queryFormRef 为空
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗
//结束

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await IrrigationAreaApi.getIrrigationAreaPage(queryParams);
    list.value = data.list;
    // console.log("勁來了1");
    // list.value.forEach(item => {
    //   if(idsArray.value.includes(item.id)){
    //     console.log("勁來了");
    //     item.selection = true
    //   }
    // });
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
  if (id) router.push(`/integrationWaterFertilizer/irrigate/irrigationArea/create?id=${id}`);
  else router.push(`/integrationWaterFertilizer/irrigate/irrigationArea/create`);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await IrrigationAreaApi.deleteIrrigationArea(id);
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
    const data = await IrrigationAreaApi.exportIrrigationArea(queryParams);
    download.excel(data, '灌区信息.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

const selectValvesDeviceRef = ref();

/** 初始化 **/
onMounted(() => {
  getList();
});
</script>
