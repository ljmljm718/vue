<!-- 基地列表 -->
<template>
  <Dialog
    title="选择种植品种"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
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
        <el-form-item label="地块名称" prop="plotName">
          <el-input v-model="queryParams.plotName" placeholder="请选择" class="!w-180px">
            <template #append>
              <el-button @click="openPlotPopup(queryParams.belongPark)">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="品类" prop="cropType">
          <el-select v-model="queryParams.cropType" clearable placeholder="请选择品类"
                     class="!w-180px">
            <el-option
              v-for="item in listCategoryManagement"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品种" prop="cropName">
          <el-input v-model="queryParams.cropName" placeholder="请选择品种" class="!w-180px">
            <template #append>
              <el-button @click="openBreedFrom()">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="种植时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-180px"
          />
        </el-form-item>
        <el-form-item label="批次号" prop="batchCode">
          <el-input
            v-model="queryParams.batchCode"
            placeholder="请输入批次号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-180px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" type="primary">
            <Icon icon="ep:search" class="mr-5px"/>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
                ref="multipleTableRef"
                @select="select" @row-click="selectClick" @selection-change="handleSelectionChange">
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="种植品种" align="center" prop="cropName" width="140"/>
        <el-table-column label="品类" align="center" prop="cropType">
          <template #default="scope">
            <el-tag>{{ scope.row.cropType }}</el-tag>
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
        <el-table-column label="所属基地" align="center" prop="parkName" width="160"/>
        <el-table-column label="所属地块" align="center" prop="plotName" width="160"/>
        <el-table-column label="数量" align="center" prop="number"/>
        <el-table-column label="单位" align="center" prop="unit"/>
        <el-table-column label="预计产量" align="center" prop="predictedOutput"/>
        <el-table-column
          label="开始时间"
          align="center"
          prop="receiptStartTime"
          :formatter="dateFormatter2"
          width="120px"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="receiptEndTime"
          :formatter="dateFormatter2"
          width="120px"
        />
        <el-table-column label="批次号" align="center" prop="batchCode" width="160px"/>
        <el-table-column label="二维码" align="center" prop="batchQrImg">
          <template #default="scope">
            <el-image :src="`data:image/png;base64,${scope.row.batchQrImg}`"
                      style="object-fit: cover;width: 2rem;height: 2rem;"
                      preview-teleported
                      :preview-src-list="[`data:image/png;base64,${scope.row.batchQrImg}`]"
            />
          </template>
        </el-table-column>
        <el-table-column label="启用模型" align="center" key="isEnableModel">
          <template #default="scope">
            <el-switch v-model="scope.row.isEnableModel" :active-value="true"
                       :inactive-value="false"
                       @change="handleStatusChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="采收状态" align="center" prop="recoveryNo" width="120">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.recoveryNo">已采收</el-tag>
            <el-tag v-if="!scope.row.recoveryNo">未采收</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="cropDesc" width="240"/>
        <el-table-column :label="deptId === 156 ? '数量' : '备注'" align="center" prop="remark"
                         width="180"/>
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
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!-- 表单弹窗：添加/修改 -->
  <CropBaseForm ref="formRef" @success="getList"/>
  <!-- 表单弹窗：添加/修改 -->
  <HarvestManagementAdd ref="formRefA" @success="getList"/>
</template>

<script lang="ts" setup>
import {ParkInfoVO} from '@/api/agriculture/parkinfo'
import {dateFormatter, dateFormatter2} from "@/utils/formatTime";
import {VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {CropBaseApi, CropBaseVO} from "@/api/agriculture/cropbase";
import {CommonStatusEnumBoolean} from "@/utils/constants";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import CropBaseForm from "@/views/agriculture/cropbase/CropBaseForm.vue";
import HarvestManagementAdd from "@/views/agriculture/harvestmanagement/HarvestManagementAdd.vue";
import {useUserStore} from "@/store/modules/user";
import {ElTable} from "element-plus";

defineOptions({name: 'SelectVarietyManagement'})
const list = ref<VarietyManagementVO[]>([]) // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const total = ref(0) // 列表的总页数
const message = useMessage() // 消息弹窗
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const show = ref()
const userStore = useUserStore()
const userName = computed(() => userStore.user.deptId ?? '0')
const deptId = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  breedId: undefined,
  cropName: undefined,
  cropType: undefined,
  createTime: [],
  batchCode: undefined,
  recoveryNo: undefined,
  belongPark: undefined,
  parkName: undefined,
  plotName: undefined,
  belongPlot: undefined,
  deptId: undefined,
  userId: undefined,
  isEnableModel: undefined,
})
const queryFormRef = ref() // 搜索的表单
/** 选中操作 */
const selectionList = ref<CropBaseVO[]>([])
const handleSelectionChange = (rows: CropBaseVO[]) => {
  selectionList.value = rows
}
const queryParam = reactive({
  pageNo: 1,
  pageSize: 10,
  planId: undefined,
  breedId: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  planState: undefined,
  personId: undefined,
  personName: undefined,
  startTime: [],
  endTime: [],
  recordTime: [],
  planArea: undefined,
  recordArea: undefined,
  recordState: undefined,
  createTime: [],
})
//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup = (id: string) => {
  openType.value = id
  if (openType.value === undefined || openType.value === '') {
    message.error('请选择基地')
  } else parkPopupRef.value.open(id)
}
const handleParkPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    queryParams.belongPark = String(order[0].id)
    queryParams.parkName = String(order[0].name)
  } else queryParams.parkName = String(order[0].name)
}
//地块的选择
const plotPopupRef = ref()
const openType1 = ref('')
const openPlotPopup = (id: string) => {
  openType1.value = id
  plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log('--->>查看选择的地块信息：', order[0])
  queryParams.belongPlot = String(order[0].id)
  queryParams.plotName = String(order[0].name)
}
/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: CropBaseVO[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}
/** 修改品种模型绑定状态 */
const handleStatusChange = async (row: CropBaseApi.CropBaseVO) => {
  try {
    // 修改状态的二次确认
    const text = row.isEnableModel === CommonStatusEnumBoolean.ENABLE ? '绑定' : '停绑'
    await message.confirm('确认要' + text + '当前模型吗?')
    // 发起修改状态
    await CropBaseApi.updateModelEnableStatus(row.id, row.isEnableModel)
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.isEnableModel =
      row.isEnableModel === CommonStatusEnumBoolean.ENABLE ? CommonStatusEnumBoolean.DISABLE : CommonStatusEnumBoolean.ENABLE
  }
}


/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  parentValue.value = id
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}

const getItemByBatchCode = async (batchCode:string) => {
  queryParams.pageSize = 100;
  await getList();
  queryParams.pageSize = 10;
  const selectedItem = list.value.find(item => item.batchCode === batchCode);
  if (!selectedItem) return;
  selectionList.value = [selectedItem as any];
  submitForm()
  await resetQuery()
}

defineExpose({
  open,
  getItemByBatchCode
}) // 提供 open 方法，用于打开弹窗

/** 加载列表  */
const getList = async () => {
  loading.value = true
  listCategoryManagement.value = await allDataCacheManager.getData({})
  try {
    const data = await CropBaseApi.getCropBasePage(queryParams)
    list.value = data.list
    //把品类数据的namep拼接到列表中
    list.value.forEach(item => {
      listCategoryManagement.value.forEach(itm => {
        if (item.cropType == itm.id)
          item.cropType = itm.categoryName
      })
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  queryParams.parentId = parentValue.value
  getList()
}

// 基地单选
const multipleTableRef = ref()
const select = (selection, row) => {
  // 清除 所有勾选项
  multipleTableRef.value.clearSelection()
  // 当表格数据都没有被勾选的时候 就返回
  // 主要用于将当前勾选的表格状态清除
  if (selection.length == 0) return
  multipleTableRef.value.toggleRowSelection(row, true);
}
//品种名称管理
const BreedFromRef = ref()
const openBreedFrom = () => {
  BreedFromRef.value.open();
}
// 控制单选——table选择项发生变化时
const selectClick = (row) => {
  const selectData = selectionList.value
  multipleTableRef.value.clearSelection()
  if (selectData.length == 1) {
    selectData.forEach(item => {
      // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
      if (item == row) {
        multipleTableRef.value.toggleRowSelection(row, false);
      }
      // 不然就让当前的一行勾选
      else {
        multipleTableRef.value.toggleRowSelection(row, true);
      }
    })
  } else {
    multipleTableRef.value.toggleRowSelection(row, true);
  }
}
</script>

<style scoped lang='scss'>
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
