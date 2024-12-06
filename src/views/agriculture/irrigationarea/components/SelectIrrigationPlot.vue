<!-- 基地/地块列表 -->
<template>
  <Dialog
    title="选择地块"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    @close="resetQuery()"
    width="1300"
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
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-160px"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input
            v-model="queryParams.contact"
            placeholder="请输入联系人"
            clearable
            @keyup.enter="handleQuery"
            class="!w-160px"
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

    <ContentWrap>
      <el-table
        ref="multipleTableRef"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        :stripe="true"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
        @row-click="selectClick"
        highlight-current-row
      >
        <el-table-column width="30" label="选择" type="selection" reserve-selection />
        <el-table-column label="所属基地" align="center" prop="parkName" width="150" />
        <!--        <el-table-column label="编号" align="center" prop="code" width="200" />-->
        <el-table-column label="名称" align="center" prop="name" width="150" />
        <el-table-column label="海拔（米）" align="center" prop="altitude" width="100" />
        <el-table-column label="纬度" align="center" prop="latitude" />
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="通讯地址" align="center" prop="address" />
        <el-table-column label="联系人" align="center" prop="contact" />
        <el-table-column label="联系电话" align="center" prop="tel" />
        <el-table-column label="面积（亩）" align="center" prop="area" width="100" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button :disabled="!selectionList.length" type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ElTable } from 'element-plus';
import { ParkDetailApi, ParkDetailVO } from '@/api/agriculture/parkdetail';
import { any } from 'vue-types';

defineOptions({ name: 'SelectIrrigationPlot' });
const list = ref<ParkDetailVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const loading = ref(false); // 列表的加载中
const dialogVisible = ref(false); // 弹窗的是否展示
const parentValue = ref('');
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  parkId: undefined, // 主表
  code: undefined,
  name: undefined,
  grade: undefined,
  type: undefined,
  altitude: undefined,
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  contact: undefined,
  tel: undefined,
  area: undefined,
  parentId: '',
  remark: undefined,
  belongIrrigationArea: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const props = defineProps({
  plotId: {
    type: Array,
    default: () => []
  }
});

/** 选中操作 */
const selectionList = ref<ParkDetailVO[]>([]);
const handleSelectionChange = (rows: ParkDetailVO[]) => {
  selectionList.value = rows;
};

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: ParkDetailVO[]): void;
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
const open = async (id: string) => {
  dialogVisible.value = true;
  parentValue.value = id;
  await nextTick(); // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery();
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 加载列表  */
const getList = async () => {
  loading.value = true;
  try {
    const data = await ParkDetailApi.getIrrigationParkDetailPage(queryParams);
    list.value = data.list;
    nextTick(() => {
      list.value.forEach((row) => {
        props.plotId.forEach((ele) => {
          if (row.id === ele.id) {
            multipleTableRef.value.toggleRowSelection(row, true);
          }
        });
      });
    });
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  queryParams.belongIrrigationArea = parentValue.value;
  getList();
};
//选中的list
const getRowKeys = (row) => {
  //记录每行的key值
  return row.id;
};
// 控制table-----多选选择
const multipleTableRef = ref();

// 控制多选——table选择项发生变化时
const selectClick = (row) => {
  const selectData = selectionList.value;
  // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
  const isRowSelected = selectData.some((selectedRow) => selectedRow === row);
  multipleTableRef.value.toggleRowSelection(row, !isRowSelected);
};
</script>
