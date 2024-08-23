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
      <el-form-item label="计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入计划编码"
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
<!--      <el-form-item label="所属基地" prop="belongPark">-->
<!--        <el-input-->
<!--          v-model="queryParams.belongPark"-->
<!--          placeholder="请输入所属基地"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="基地名称" prop="parkName">
        <!-- <el-input
          v-model="queryParams.parkName"
          placeholder="请输入基地名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-input v-model="queryParams.parkName" placeholder="请选择所属基地">
          <template #append>
            <el-button @click="openParkPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="所属地块" prop="belongPlot">-->
<!--        <el-input-->
<!--          v-model="queryParams.belongPlot"-->
<!--          placeholder="请输入所属地块"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="地块名称" prop="plotName">
        <!-- <el-input
          v-model="queryParams.plotName"
          placeholder="请输入地块名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-input v-model="queryParams.plotName" placeholder="请选择所属地块">
          <template #append>
            <el-button @click="openPlotPopup(queryParams.belongPark)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="作物id" prop="cropId">-->
<!--        <el-input-->
<!--          v-model="queryParams.cropId"-->
<!--          placeholder="请输入作物id"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="作物名称" prop="cropName">
        <el-input
          v-model="queryParams.cropName"
          placeholder="请输入作物名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="品种" prop="cropType">-->
<!--        <el-select-->
<!--          v-model="queryParams.cropType"-->
<!--          placeholder="请选择品种"-->
<!--          clearable-->
<!--          class="!w-240px"-->
<!--        >-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="计划状态" prop="planState">
        <el-select
          v-model="queryParams.planState"
          placeholder="请选择计划状态"
          clearable
          class="!w-150px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.FARM_PLAN_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="责任人编号" prop="personId">-->
<!--        <el-input-->
<!--          v-model="queryParams.personId"-->
<!--          placeholder="请输入责任人编号"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="责任人" prop="personName">
        <el-input
          v-model="queryParams.personName"
          placeholder="请输入责任人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="计划开始时间" prop="startTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.startTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="计划结束时间" prop="endTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.endTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="计划面积（亩）" prop="planArea">-->
<!--        <el-input-->
<!--          v-model="queryParams.planArea"-->
<!--          placeholder="请输入计划面积（亩）"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="土地面积（亩）" prop="area">-->
<!--        <el-input-->
<!--          v-model="queryParams.area"-->
<!--          placeholder="请输入土地面积（亩）"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="创建时间" prop="createTime">-->
<!--        <el-date-picker-->
<!--          v-model="queryParams.createTime"-->
<!--          value-format="YYYY-MM-DD HH:mm:ss"-->
<!--          type="daterange"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery" type="primary"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex items-center mb-3">
      <div style="margin-bottom: 1rem;margin-left: 1.5rem;margin-right: 1.5rem;height: 2rem">
        <el-form-item>
          <el-button
            type="primary"
            class="!h-2.4rem"
            plain
            @click="openForm('create')"
            v-hasPermi="['agri:farm-plan:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
        </el-form-item>
      </div>
      <div class="grow">
        <IntroduceAlert title="农事计划模块专门负责将作物的种植过程细分为若干个易于管理的计划。"/>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="计划编码" align="center" prop="planCode" width="180" />
      <el-table-column label="计划名称" align="center" prop="planName" width="180" />
<!--      <el-table-column label="所属基地" align="center" prop="belongPark" />-->
      <el-table-column label="基地名称" align="center" prop="parkName" width="180"  />
      <el-table-column label="农事阶段" align="center" prop="farmDefineType" width="120" >
        <template #default="scope">
          <el-select v-model="scope.row.farmDefineType" disabled>
            <el-option
              v-for="dict in farmDefineOptions"
              :key="dict.id"
              :label="dict.defineName"
              :value="dict.id"
            />
          </el-select>
        </template>
      </el-table-column>
<!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
      <el-table-column label="地块名称" align="center" prop="plotName" width="180"/>
<!--      <el-table-column label="作物id" align="center" prop="cropId" />-->
      <el-table-column label="作物名称" align="center" prop="cropName" width="180" />
      <el-table-column align="center" prop="batchCode" width="160px">
        <template #header>
          <QuestionMaskTip lable-name="批次号" content="批次号是分配给特定种植操作或作业的唯一标识符，每个批次号代表一组具有共同特征的作物或一轮种植活动，在产品追溯中起着重要作用。"/>
        </template>
      </el-table-column>      <el-table-column label="品类" align="center" prop="cropType" width="100" >
        <template #default="scope">
          <el-tag >{{scope.row.cropType}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="计划状态" align="center" prop="planState" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.FARM_PLAN_STATE" :value="scope.row.planState" />
        </template>
      </el-table-column>
<!--      <el-table-column label="责任人编号" align="center" prop="personId" />-->
      <el-table-column label="责任人" align="center" prop="personName" width="150" >
        <template #default="scope">
          <label>{{scope.row.personName=='null'?'':scope.row.personName}} </label>
        </template>
      </el-table-column>
      <el-table-column
        label="计划开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="计划结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="计划面积（亩）" align="center" prop="planArea" width="150" />
      <el-table-column label="计划描述" align="center" prop="planDesc" />
<!--      <el-table-column label="完成面积（亩）" align="center" prop="finishArea" fixed="right" width="150"/>-->
<!--      <el-table-column label="剩余面积（亩）" align="center" prop="area"  fixed="right" width="150" />-->
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:farm-plan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:farm-plan:delete']"
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
  <FarmPlanForm ref="formRef" @success="getList" />
  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>
</template>

<script setup lang="ts">
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import { FarmPlanApi, FarmPlanVO } from '@/api/agriculture/farmplan'
import FarmPlanForm from './FarmPlanForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import QuestionMaskTip from "@/components/QuestionMaskTip/index.vue";

/** 农事计划 列表 */
defineOptions({ name: 'FarmPlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FarmPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  planCode: undefined,
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
  planArea: undefined,
  area: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
let farmDefineOptions = ref([])// 设备分类选项

const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmPlanApi.getFarmPlanPage(queryParams)
    console.log(data)
    //请求品类信息
    listCategoryManagement.value = await allDataCacheManager.getData({})
    //把品类数据的name拼接到列表中
    data.list.forEach((item)=>{
      item.farmDefineType=item.farmDefineType?parseInt(item.farmDefineType):""
      listCategoryManagement.value.forEach(itm => {
        if (item.cropType == itm.id)
          item.cropType = itm.categoryName
      })
    })

    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  if(queryParams.parkName == null || queryParams.parkName == ''){
    queryParams.belongPark= undefined
    queryParams.parkName= undefined
  }
  if(queryParams.plotName == null || queryParams.plotName == ''){
    queryParams.plotName= undefined
    queryParams.belongPlot= undefined
  }
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
const router = useRouter()
const openForm = (type: string, id?: number) => {
  if(type=='create') {
    router.push('/farm_work/farmManage/createOrUpdate')
  }else{
    router.push('/farm_work/farmManage/createOrUpdate?type='+type+'&id='+id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FarmPlanApi.deleteFarmPlan(id)
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
    const data = await FarmPlanApi.exportFarmPlan(queryParams)
    download.excel(data, '农事计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async ()  => {
  getList()
  farmDefineOptions.value =  await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
})
onActivated(async () => {
  await getList()
})

//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择基地")
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
  openType1.value = id;
  if (!openType1.value) {
    message.error("请选择基地")
  } else plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
 // console.log("--->>查看选择的地块信息：", order[0])
  queryParams.belongPlot = String(order[0].id)
  queryParams.plotName = String(order[0].name)
}
</script>
