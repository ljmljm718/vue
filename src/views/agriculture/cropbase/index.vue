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
      <!--      <el-form-item label="品种" prop="cropName">-->
      <!--        <el-input v-model="queryParams.cropName" placeholder="请选择品种" class="!w-180px">-->
      <!--          <template #append>-->
      <!--            <el-button @click="openBreedFrom()">-->
      <!--              <Icon icon="ep:search"/>-->
      <!--              选择-->
      <!--            </el-button>-->
      <!--          </template>-->
      <!--        </el-input>-->
      <!--      </el-form-item>-->
      <el-form-item
        label="品种"
        prop="breedId"
      >
        <el-select
          v-model="queryParams.breedId"
          clearable
          placeholder="请选择品种"
          class="!w-180px"
        >
          <el-option
            v-for="item in listVarietyManagementVO"
            :key="item.id"
            :label="item.varietyName"
            :value="item.id"
          />
        </el-select>
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
    <div class="flex items-center mb-3">
      <div style="margin-bottom: 1rem;margin-left: 1.5rem;margin-right: 1.5rem;height: 2rem">
        <el-button
          type="primary"
          plain
          class="!h-2.4rem"
          @click="openForm('create')"
          v-hasPermi="['agriculture:crop-base:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
      </div>
      <div class="grow">
        <IntroduceAlert title="数字农业管理系统的种植管理模块是现代农业中重要的组成部分，它利用数字技术和数据分析来优化种植过程，提高作物生产效率和管理水平。"/>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
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
      <el-table-column align="center" prop="batchCode" width="160px">
        <template #header>
          <QuestionMaskTip lable-name="批次号" content="批次号是分配给特定种植操作或作业的唯一标识符，每个批次号代表一组具有共同特征的作物或一轮种植活动，在产品追溯中起着重要作用。"/>
        </template>
      </el-table-column>
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
          <el-switch v-model="scope.row.isEnableModel" :active-value="true" :inactive-value="false"
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
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['agriculture:crop-base:update']"
            v-if="!scope.row.recoveryNo"
          >
            详情
          </el-button>
          <el-button
            link
            type="success"
            @click="damn(scope.row)"
            v-if="show !==118"
          >
            溯源
          </el-button>
          <el-button
            link
            type="warning"
            @click="openFormA('create', scope.row)"
            v-hasPermi="['agriculture:harvest-management:create']"
            v-if="!scope.row.recoveryNo"
          >
            采收
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:crop-base:update']"
            v-if="!scope.row.recoveryNo"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:crop-base:delete']"
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
  <CropBaseForm ref="formRef" @success="getList"/>
  <!-- 表单弹窗：添加/修改 -->
  <HarvestManagementAdd ref="formRefA" @success="getList"/>
  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>种植管理-溯源</h3>
    </template>
    <template #default>
      <div class="relative">
        <div v-if='formData.length>0'
             class="flex absolute top--30px left-50px flex-col items-center">
          <div class="flex items-center">
            <div class="w-15px h-15px rounded-full bg-[#089df7]"></div>
            <div class="ml-30px">{{ formatTime(formData[0].recordTime, 'yyyy-MM-dd HH:mm:ss') }}
            </div>
          </div>
          <div v-if='formData.length>1' class="w-2px h-240px bg-[#089df7] ml--185px"></div>
          <div class="flex items-center" v-if='formData.length>1'>
            <div class="w-15px h-15px rounded-full bg-[#089df7]"></div>
            <div class="ml-30px">{{ formatTime(formData[0].recordTime, 'yyyy-MM-dd HH:mm:ss') }}
            </div>
          </div>
        </div>
        <el-card class="w-400px ml-80px mt-50px" v-for="item, index in formData" :key="index">
          <h4>农事活动：{{ getValByDict(item.farmDefineType) }}</h4>
          <p>品类：
            <el-tag>{{ item.cropType }}</el-tag>
            <!--            <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="item.cropType"/>-->
          </p>
          <p>作物名称：{{ item.cropName }}</p>
          <p>记录时间：{{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
        </el-card>
      </div>


    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
      </div>
    </template>
  </el-drawer>
  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>

  <BreedFrom ref="BreedFromRef" @success="BreedFromSuccess"/>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import download from '@/utils/download'
import {CropBaseApi, CropBaseVO} from '@/api/agriculture/cropbase'
import CropBaseForm from './CropBaseForm.vue'
import HarvestManagementAdd from "@/views/agriculture/harvestmanagement/HarvestManagementAdd.vue";
import {DrawerProps} from "element-plus";
import {FarmRecordApi, FarmRecordVO} from "@/api/agriculture/farmrecord";
import {formatTime} from '@/utils/index'
import router from "@/router";
import {getTenantId} from "@/utils/auth";
import {useUserStore} from "@/store/modules/user";
import avatarImg from "@/assets/imgs/avatar.gif";
import {CategoryManagementVO, allDataCacheManager} from "@/api/agriculture/categorymanagement";
import {getUserProfile} from "@/api/system/user/profile";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import QuestionMaskTip from "@/components/QuestionMaskTip/index.vue";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import {CommonStatusEnum, CommonStatusEnumBoolean} from "@/utils/constants";
import BreedFrom from "@/views/agriculture/varietymanagement/SelectVarirtManagement.vue";
import {VarietyManagementApi, VarietyManagementVO} from "@/api/agriculture/varietymanagement";

/** 鲁渝协作品种管理 列表 */
defineOptions({name: 'AgriCropBase'})
const drawer2 = ref(false)
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const direction = ref<DrawerProps['direction']>('rtl')
const loading = ref(true) // 列表的加载中
const list = ref<CropBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
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
const formData = ref<FarmRecordVO[]>([])
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
const queryParams1 = reactive({
  pageNo: 1,
  pageSize: 10,
  varietyName: undefined,
  varietyCode: undefined,
  images: undefined,
  categoryId: undefined,
  categorySource: undefined,
  categoryStigma: undefined,
  areaDistribution: undefined,
  briefIntroduction: undefined,
  status: undefined,
  remark2: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const show = ref()
const userStore = useUserStore()
const userName = computed(() => userStore.user.deptId ?? '0')
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const listVarietyManagementVO = ref<VarietyManagementVO[]>([]) // 品种列表的数据
const deptId = ref(0)
const judgeHomePage = async () => {
  const data = await getUserProfile()
  deptId.value = data.dept.id
}
judgeHomePage()
/** 查询列表 */
const getList = async () => {
  loading.value = true
  show.value = userName.value
  listCategoryManagement.value = await allDataCacheManager.getData({})
  try {
    const data = await CropBaseApi.getCropBasePage(queryParams)
    const data1 = await VarietyManagementApi.getVarietyManagementPage(queryParams1)
    listVarietyManagementVO.value = data1.list
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
  // if (!openType1.value) {
  //   message.error('请选择基地')
  // } else
  plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log('--->>查看选择的地块信息：', order[0])
  queryParams.belongPlot = String(order[0].id)
  queryParams.plotName = String(order[0].name)
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.belongPlot = null
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  // formRef.value.open(type, id)
  if (type == 'create') router.push('/farm_work/CreateOrUpdateCropbase')
  else router.push('/farm_work/CreateOrUpdateCropbase?id=' + id + '&type=' + type)
}

/** 添加/修改操作 */
const formRefA = ref()
const openFormA = (type: string, row?: any) => {
  formRefA.value.open(type, row)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CropBaseApi.deleteCropBase(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CropBaseApi.exportCropBase(queryParams)
    download.excel(data, '鲁渝协作品种管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

function cancelClick() {
  drawer2.value = false
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

const damn = async (row) => {
  queryParam.batchCode = row.batchCode;
  const data = await FarmRecordApi.getFarmRecordPage(queryParam)
  data.list.forEach((item) => {
    item.farmDefineType = item.farmDefineType ? parseInt(item.farmDefineType) : ""
  })
  formData.value = data.list
  console.log("222222", formData.value)
  drawer2.value = true
}
/** */
const {push} = useRouter()
// const goCheck = (row) => {
//   //打开新的页签并传递参数
//   push(`/farm_work/farmManage/farm-record?batchCode=${row.batchCode}`);
// }

/** 初始化 **/
const farmDefineOptions = ref([])// 设备分类选项
const getValByDict = (item) => {
  let res = ''
  farmDefineOptions.value.forEach(dict => {
    if (dict.id === item) res = dict.defineName
  })
  return res
}

//品种名称管理
const BreedFromRef = ref()
const openBreedFrom = () => {
  BreedFromRef.value.open();
}

const BreedFromSuccess = (order: any) => {
  queryParams.breedId = String(order[0].id)
  queryParams.cropName = String(order[0].varietyName)
}

onMounted(async () => {
  await getList()
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1})
})
onActivated(async () => {
  await getList()
})
</script>
<style lang="scss" scoped>
</style>
