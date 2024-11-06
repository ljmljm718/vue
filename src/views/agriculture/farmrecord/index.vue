<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="基地名称" prop="parkName">
        <el-input class="!w-240px" v-model="queryParams.parkName" placeholder="请选择所属基地">
          <template #append>
            <el-button @click="openParkPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input class="!w-240px" v-model="queryParams.plotName" placeholder="请选择所属地块">
          <template #append>
            <el-button @click="openPlotPopup(queryParams.belongPark)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="农事阶段" prop="farmDefineType">
        <el-select v-model="queryParams.farmDefineType" clearable placeholder="请选择农事阶段" class="!w-240px">
          <el-option
              v-for="dict in farmDefineOptions"
              :key="dict.id"
              :label="dict.defineName"
              :value="dict.id"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="作物名称" prop="cropName" v-if="show !==117">
        <el-input
          v-model="queryParams.cropName"
          placeholder="请输入作物名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品类" prop="cropType">
        <el-select v-model="queryParams.cropType" clearable placeholder="请选择品类" class="!w-240px">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="personName">
        <el-input
          v-model="queryParams.personName"
          placeholder="请输入责任人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </custom-form>
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
            v-hasPermi="['agri:farm-record:create']"      >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
        </el-form-item>
      </div>
      <div class="grow">
        <IntroduceAlert title="该模块的主要功能是对农事活动的各项任务进行详细记录。"/>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="作物品种" align="center" prop="cropName" v-if="show !==117"/>
      <el-table-column label="基地名称" align="center" prop="parkName"/>
      <el-table-column label="地块名称" align="center" prop="plotName" />
      <el-table-column label="农事阶段" align="center" prop="farmDefineType" width="125%" >
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
      <el-table-column label="种植品类" align="center" prop="cropType" width="120">
        <template #default="scope">
          <el-tag >{{scope.row.cropType}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="批次码" align="center" prop="batchCode"  v-if="show !==117"/>
      <el-table-column label="责任人" align="center" prop="personName" >
        <template #default="scope">
          <label>{{scope.row.personName=='null'?'':scope.row.personName}} </label>
        </template>
      </el-table-column>
      <el-table-column
        label="记录时间"
        align="center"
        prop="recordTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="土地面积（亩）" align="center" prop="recordArea"  v-if="show !==117"/>

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" fixed="right" align="center" width="160">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:farm-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('select', scope.row.id)"
          >
            详情
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:farm-record:delete']"
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
  <FarmRecordForm ref="formRef" @success="getList" />
  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import { FarmRecordApi, FarmRecordVO } from '@/api/agriculture/farmrecord'
import FarmRecordForm from './FarmRecordForm.vue'
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {useUserStore} from "@/store/modules/user";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

/** 农事记录 列表 */
defineOptions({ name: 'FarmRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
let farmDefineOptions = ref([])// 设备分类选项

const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const loading = ref(true) // 列表的加载中
const list = ref<FarmRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  planId: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  farmDefineType: undefined,
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
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const show = ref()
const userStore = useUserStore()
//获取部门ID
const userName = computed(() => userStore.user.deptId ?? '0')
//show的值是部门ID的值
show.value = userName.value
/** 查询列表 */
const getList = async () => {
  loading.value = true
  listCategoryManagement.value = await allDataCacheManager.getData({})
  try {
    console.log("queryParams", queryParams)
    const data = await FarmRecordApi.getFarmRecordPage(queryParams)
    data.list.forEach((item)=>{
      item.farmDefineType=item.farmDefineType?parseInt(item.farmDefineType):""
    })
    list.value = data.list
    //把品类数据的namep拼接到列表中
    list.value.forEach(item=>{
      listCategoryManagement.value.forEach(itm=>{
        if (item.cropType == itm.id)
          item.cropType = itm.categoryName
      })
    })
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
const router = useRouter()
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if(type == 'create'){
    router.push('/farm_work/farmManage/farm-record/CreateOrUpdate?type='+type)
  }else{
    router.push('/farm_work/farmManage/farm-record/CreateOrUpdate?type='+type+'&id='+id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FarmRecordApi.deleteFarmRecord(id)
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
    const data = await FarmRecordApi.exportFarmRecord(queryParams)
    download.excel(data, '农事记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const route = useRoute()
/** 路由传参赋值 */
const setCheckParams = () => {
  //首先将路由传参的参数  赋值给查询参数
  queryParams.belongPlot = route.query.baseId
  //批次码  路由传参获取
  queryParams.batchCode = route.query.batchCode
}

/** 初始化 **/
onMounted(async () => {
  setCheckParams()
  getList()
  farmDefineOptions.value =  await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
})
onActivated(async () => {
  await getList()
})

//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup= (id: string) => {
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
    message.error("请勿手动输入基地名称，请选择基地！")
  } else plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
 // console.log("--->>查看选择的地块信息：", order[0])
  queryParams.belongPlot = String(order[0].id)
  queryParams.plotName = String(order[0].name)
}

</script>
