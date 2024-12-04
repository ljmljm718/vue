<template>
  <Dialog
    title="电磁阀设备列表"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1400"
  >
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input
            v-model="queryParams.deviceCode"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="设备点位" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备点位"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="状态" prop="deviceStatus">
          <el-select
            v-model="queryParams.deviceStatus"
            placeholder="请选择状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="所属基地" prop="belongPark">
          <el-input
            v-model="queryParams.belongPark"
            placeholder="请输入所属基地"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="所属地块" prop="belongPlot">
          <el-input
            v-model="queryParams.belongPlot"
            placeholder="请输入所属地块"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>-->
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
        v-loading="loading"
        :data="list"
        :stripe="true"
        ref="suibian"
        :show-overflow-tooltip="true"
        @select="fangfa"
        scrollbar-always-on="false"
        @selection-change="handleSelectionChange"
        @row-click="selectClick"
      >
        <el-table-column fixed width="30" label="选择" type="selection" />
        <el-table-column fixed label="设备编号" align="center" prop="deviceCode" width="200" />
        <el-table-column fixed label="设备点位" align="center" prop="deviceName" width="150" />
        <el-table-column label="设备类型" align="center" prop="deviceType" width="200">
          <template #default="scope">
            <el-cascader
              style="width: 100%"
              v-model="scope.row.deviceType"
              :options="categoryOptions"
              :props="categoryProps"
              disabled
            />
          </template>
        </el-table-column>
        <!--        <el-table-column label="所属基地" align="center" prop="belongPark" width="200" />-->
        <el-table-column label="基地名称" align="center" prop="parkName" width="200" />
        <!--        <el-table-column label="所属地块" align="center" prop="belongPlot" width="200" />-->
        <el-table-column label="地块名称" align="center" prop="parkDetailName" width="200" />
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="纬度" align="center" prop="latitude" />
        <el-table-column label="状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus" />
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="imgId">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.imgId"
              :preview-src-list="[row.imgId]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>

        <el-table-column label="位置" align="center" prop="location" />
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
import { DeviceInfoApi, DeviceInfoVO } from '@/api/agriculture/deviceinfo';
import { DeviceCategoryApi } from '@/api/agriculture/devicecategory';

/** 设备信息 列表 */
defineOptions({ name: 'SelectValvesDeviceForm' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<DeviceInfoVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceCode: undefined,
  deviceName: undefined,
  deviceType: undefined,
  longitude: undefined,
  latitude: undefined,
  deviceStatus: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined,
  location: undefined,
  belongIrrigationArea: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
let categoryOptions = ref([]); // 设备分类选项
const deviceType = ref();
const irrigationAreaId = ref(); //传过来的灌区id
//开始

let suibian = ref(null);
const fangfa = (select: any, row: any) => {
  if (select.length > 1) {
    let del_row = select.shift();
    suibian.value.toggleRowSelection(del_row, false);
  }
};

// 控制单选——table选择项发生变化时
const selectClick = (row) => {
  const selectData = selectionList.value;
  suibian.value.clearSelection();
  if (selectData.length == 1) {
    selectData.forEach((item) => {
      // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
      if (item == row) {
        suibian.value.toggleRowSelection(row, false);
      }
      // 不然就让当前的一行勾选
      else {
        suibian.value.toggleRowSelection(row, true);
      }
    });
  } else {
    suibian.value.toggleRowSelection(row, true);
  }
};

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
const selectionList = ref<DeviceInfoVO[]>([]);
const handleSelectionChange = (rows: DeviceInfoVO[]) => {
  selectionList.value = rows;
};

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: DeviceInfoVO[]): void;
}>();
const submitForm = () => {
  try {
    selectionList.value.forEach((list) => {
      list.belongIrrigationArea = irrigationAreaId.value;
    });
    emits('success', selectionList.value);
  } finally {
    // 关闭弹窗
    dialogVisible.value = false;
  }
};
/** 打开弹窗 */
const open = async (id: string) => {
  irrigationAreaId.value = id;
  dialogVisible.value = true;
  Object.keys(queryParams).forEach((key) => {
    queryParams[key] = undefined;
  });
  await resetQuery();
  await nextTick(); // 等待，避免 queryFormRef 为空
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

//结束

// 定义属性
const props = defineProps({
  currCategory: {
    type: Object,
    default: () => ({})
  },
  deviceTypeA: {
    type: String,
    default: ''
  }
});
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DeviceInfoApi.getDeviceInfoIrrigationAreaPage(queryParams);
    list.value = data.list.map((item: any) => {
      item.deviceType = item.deviceType.split(',').map(Number);
      return item;
    });
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  queryParams.pageSize = 10;
  if (deviceType.value != null && deviceType.value != undefined) {
    queryParams.deviceType = deviceType.value.join(',');
  }
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  Object.keys(queryParams).forEach((key) => {
    queryParams[key] = undefined;
  });
  deviceType.value = null;
  handleQuery();
};

/**
 * 设备分类级联选择器
 */
const categoryProps = {
  value: 'id',
  label: 'categoryName'
};

/** 初始化 **/
onMounted(async () => {
  categoryOptions.value = await DeviceCategoryApi.getDeviceCategoryTree({
    parentId: 0,
    status: 1
  });
  await getList();
});

// 监听父组件category变化
watch(
  () => props.currCategory,
  () => {
    if (props.currCategory) {
      if (props.currCategory.parentId === 0) {
        queryParams.deviceType = props.currCategory.id;
      } else {
        queryParams.deviceType = props.currCategory.parentId + ',' + props.currCategory.id;
      }
    } else {
      queryParams.deviceType = undefined;
    }
    handleQuery();
  }
);
</script>
<style lang="scss" scoped></style>
