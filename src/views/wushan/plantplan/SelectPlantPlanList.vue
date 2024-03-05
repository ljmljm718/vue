 <template>
  <Dialog     title="种植计划"
              v-model="dialogVisible"
              :appendToBody="true"
              :scroll="true"
              width="1300">
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="计划编码" prop="plantCode">
        <el-input
            v-model="queryParams.plantCode"
            placeholder="请输入计划编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="园区名称" prop="parkName">
        <el-input
          v-model="queryParams.parkName"
          placeholder="请输入园区名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input
          v-model="queryParams.plotName"
          placeholder="请输入地块名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="种植作物品种名称" prop="plantVariety" label-width="130px">
        <el-input
          v-model="queryParams.plantVariety"
          placeholder="请输入种植作物品种名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="类别" prop="plantCategory">
        <el-input
          v-model="queryParams.plantCategory"
          placeholder="请输入类别"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="plantStatus">
        <el-select
          v-model="queryParams.plantStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['kaizhou:plant-plan:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['kaizhou:plant-plan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true"  :show-overflow-tooltip="true" @selection-change="handleSelectionChange">
      <el-table-column width="30" label="选择" type="selection"  />
      <el-table-column label="计划编码" align="center" prop="plantCode" width="200" />
      <el-table-column label="园区名称" align="center" prop="parkName" />
      <el-table-column label="地块名称" align="center" prop="plotName" />
      <el-table-column label="种植作物品种名称" align="center" prop="plantVariety" width="200" />
      <el-table-column label="类别" align="center" prop="plantCategory" />
      <el-table-column label="状态" align="center" prop="plantStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.plantStatus" />
        </template>
      </el-table-column>
      <el-table-column label="面积" align="center" prop="area"  width="100"/>
      <el-table-column label="负责人" align="center" prop="plantPerson"  width="100"/>
      <el-table-column
        label="种植开始时间"
        align="center"
        prop="plantStarttime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="种植结束时间"
        align="center"
        prop="plantEndtime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!-- <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['kaizhou:plant-plan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:plant-plan:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column> -->
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
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { PlantPlanApi, PlantPlanVO } from '@/api/kaizhou/plantplan'
import PlantPlanForm from './PlantPlanForm.vue'

/** 种植计划 列表 */
defineOptions({ name: 'PlantPlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PlantPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  parkId: undefined,
  parkName: undefined,
  plotId: undefined,
  plotName: undefined,
  plantVariety: undefined,
  plantCategory: undefined,
  plantStatus: undefined,
  area: undefined,
  plantPerson: undefined,
  plantStarttime: [],
  plantEndtime: [],
  cropId: undefined,
  createTime: [],
  plantCode: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中



/** 选中操作 */
const dialogVisible = ref(false) // 弹窗的是否展示
const selectionList = ref<PlantPlanVO[]>([])
const handleSelectionChange = (rows: PlantPlanVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{(e: 'success', value: PlantPlanVO[]): void}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}
/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗
// 结束



/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PlantPlanApi.getPlantPlanPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PlantPlanApi.deletePlantPlan(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PlantPlanApi.exportPlantPlan(queryParams)
    download.excel(data, '种植计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
