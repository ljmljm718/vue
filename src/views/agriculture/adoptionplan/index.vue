<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="流水号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入流水号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入计划名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="认养品种" prop="adoptionKind">
        <el-input
          v-model="queryParams.adoptionKind"
          placeholder="请输入认养品种"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:adoption-plan:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:adoption-plan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="主键id" align="center" prop="id" />-->
      <el-table-column label="流水号" align="center" prop="serialNumber" width="160px"/>
      <el-table-column label="计划名称" align="center" prop="planName" width="160px"/>
      <el-table-column label="计划年度" align="center" prop="planYear" width="100px"/>
      <el-table-column label="认养品种" align="center" prop="adoptionKind" width="100px"/>
      <el-table-column
        label="计划开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="计划结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="预售开始时间"
        align="center"
        prop="presaleStart"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="预售结束时间"
        align="center"
        prop="presaleEnd"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="预计收获开始时间"
        align="center"
        prop="receivingStart"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="预计收获结束时间"
        align="center"
        prop="receivingEnd"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column label="计划描述" align="center" prop="planDescribe" />
      <el-table-column label="操作" align="center" fixed="right" width="160">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:adoption-plan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="success"
            @click="openForm('view', scope.row.id)"
            v-hasPermi="['agriculture:adoption-plan:update']"
          >
            详情
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:adoption-plan:delete']"
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
  <AdoptionPlanForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { AdoptionPlanApi, AdoptionPlanVO } from '@/api/agriculture/adoptionplan'
import AdoptionPlanForm from './AdoptionPlanForm.vue'

/** 认养计划 列表 */
defineOptions({ name: 'AdoptionPlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AdoptionPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  serialNumber: undefined,
  planName: undefined,
  planYear: undefined,
  adoptionKind: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AdoptionPlanApi.getAdoptionPlanPage(queryParams)
    data.list.forEach( item =>{
      if (item.planYear){
        const year = new Date().toLocaleDateString(item.planYear).split('/')
        item.planYear = year[0]
      }
    })
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

const router = useRouter() // 路由
/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (id) router.push(`/adoption/adoption-plan/create?type=` + type + "&id=" + id)
  else router.push(`/adoption/adoption-plan/create`)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AdoptionPlanApi.deleteAdoptionPlan(id)
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
    const data = await AdoptionPlanApi.exportAdoptionPlan(queryParams)
    download.excel(data, '认养计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

onActivated(() => {
  handleQuery()
})
</script>
