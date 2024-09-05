<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="选择基地">
        <el-select class="!w-240px" v-model="queryParams.belongParkId">
          <el-option
            v-for="(item, index) in baseList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择地块">
        <el-select class="!w-240px" v-model="queryParams.belongPlotId">
          <el-option
            v-for="(item, index) in plotList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批次码" prop="batchCode">
        <el-input
          v-model="queryParams.batchCode"
          placeholder="请输入批次码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item
        label="品种"
        prop="varietyId"
      >
        <el-select
          v-model="queryParams.varietyId"
          clearable
          placeholder="请选择品种"
          class="!w-240px"
        >
          <el-option
            v-for="item in listVarietyManagement"
            :key="item.id"
            :label="item.varietyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="品类"
        prop="variety"
      >
        <el-select
          v-model="queryParams.variety"
          clearable
          placeholder="请选择品类"
          class="!w-240px"
        >
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.categoryName"
            :label="item.categoryName"
            :value="item.categoryName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传时间" prop="upTime">
        <el-date-picker
          v-model="queryParams.upTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
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
        <el-form-item>
          <el-button
            type="primary"
            class="!h-2.4rem"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:harvest-management:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
        </el-form-item>
      </div>
      <div class="grow">
        <IntroduceAlert title="采收管理模块的主要职责是集中展示作物的产量信息、库存状况以及相关的人工数据。"/>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" border>
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
      <!-- <el-table-column label="记录编号" align="center" prop="recordNum" /> -->

      <!-- <el-table-column label="基地ID" align="center" prop="belongParkId" /> -->
      <el-table-column label="基地" align="center" prop="belongPark" width="180"/>
      <!-- <el-table-column label="地块ID" align="center" prop="belongPlotId" /> -->
      <el-table-column label="地块" align="center" prop="belongPlot" width="180"/>
      <!-- <el-table-column label="品种ID" align="center" prop="varietyId" /> -->
      <el-table-column
        label="批次码" align="center" prop="batchCode" width="180"
        v-if="show !==118"/>
      <el-table-column
        label="上传时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="品种名称" align="center" prop="varietyName" width="140"
        v-if="show !==118"/>
      <el-table-column
        label="品类名称" align="center" prop="variety" width="120"
        v-if="show !==118"/>
      <!--      <el-table-column label="采收数量(亩/只/条)" align="center" prop="harvestNum" />-->
      <el-table-column label="采收数量（亩/只/条）" align="center" prop="harvestNum" width="160">
<!--        <template #default="scope">-->
<!--          {{-->
<!--            scope.row.harvestNum-->
<!--              ? (-->
<!--                scope.row.variety === '水稻'-->
<!--                  ? scope.row.harvestNum + ' 亩'-->
<!--                  : scope.row.variety === '鸭'-->
<!--                    ? scope.row.harvestNum + ' 只'-->
<!--                    : scope.row.variety === '鱼'-->
<!--                      ? scope.row.harvestNum + ' 条'-->
<!--                      : ''-->
<!--              ) : '-'-->
<!--          }}-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="采收量" align="center" prop="harvestVolume" width="180">
        <template #default="scope">
          {{ scope.row.harvestVolume != undefined ? scope.row.harvestVolume + ' Kg' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="人工数量" align="center" prop="laborQuantity" width="180">
        <template #default="scope">
          {{ scope.row.laborQuantity != undefined ? scope.row.laborQuantity + ' 人' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="remark" width="180">
        <template #default="scope">
          {{ scope.row.remark != undefined ? scope.row.remark + ' Kg' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" min-width="200px">
        <template #default="scope">
          <el-button
            link
            type="success"
            @click="openVillageProductForm('create', scope.row.id)"
          >
            加工
          </el-button>
          <el-button
            link
            type="warning"
            @click="damn(scope.row)"
            v-if="getTenantId() !== 158"
          >
            加工记录
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:harvest-management:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:harvest-management:delete']"
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
  <HarvestManagementForm ref="formRef" @success="getList"/>
  <!-- 表单弹窗：添加/修改 -->
  <VillageProductForm ref="formVpRef" @success="getList"/>

  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>加工记录</h3>
    </template>
    <template #default>
      <el-timeline style="max-width: 600px">
        <el-timeline-item
          v-for="item, index in formData"
          :key="index"
          :timestamp="formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss') "
          placement="top"
        >
          <el-card>
            <h4>品种名称：{{ item.product }}</h4>
            <p>批次码：{{ item.batchCode }}</p>
            <p>消耗量：{{ item.remark + " " + "Kg" }}</p>
            <p>加工时间：{{ formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
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
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {HarvestManagementApi, HarvestManagementVO} from '@/api/agriculture/harvestmanagement'
import HarvestManagementForm from './HarvestManagementForm.vue'

import VillageProductForm from '@/views/digital/villageproduct/VillageProductForm.vue'
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {DrawerProps} from "element-plus";
import {FarmRecordApi, FarmRecordVO} from "@/api/agriculture/farmrecord";
import {formatTime} from "@/utils";
import {
  VillageProcessingRecordsApi,
  VillageProcessingRecordsVO
} from "@/api/digital/villageprocessingrecords";
import {getTenantId} from "@/utils/auth";
import {useUserStore} from "@/store/modules/user";
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {CategoryManagementApi, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ParkDetailVO} from '@/api/agriculture/parkdetail'
import {ParkInfoVO} from '@/api/agriculture/parkinfo'
import {page, parkPage} from '@/views/agriculture/IntelligentStatistics/api.ts'

/** 采收管理 列表 */
defineOptions({name: 'HarvestManagement'})
const drawer2 = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')
const formData = ref<VillageProcessingRecordsVO[]>([])
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<HarvestManagementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  recordNum: undefined,
  upTime: [],
  belongPark: undefined,
  belongPlot: undefined,
  harvestVolume: undefined,
  laborQuantity: undefined,
  remark: undefined,
  createTime: [],
  varietyName: undefined, // 品种名称
  variety: undefined, // 品种
  varietyId: undefined, // 品种ID
  batchCode: undefined, // 批次码
  belongParkId: undefined, // 基地ID
  belongPlotId: undefined, // 地块ID
  varietyCode: undefined,
  harvestNum: undefined
})
const queryParam = reactive({
  pageNo: 1,
  pageSize: 10,
  recoveryNum: undefined,
  machiningTime: [],
  product: undefined,
  batchCode: undefined,
  createTime: [],
  remark: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const show = ref()
const userStore = useUserStore()
const userName = computed(() => userStore.user.deptId ?? '0')

function cancelClick() {
  drawer2.value = false
}

const handleVarietyChange = (e) => {
  const _item = listVarietyManagement.value.find(item => (item.id === e))
  if (_item) queryParams.variety = _item.categoryId
}
const damn = async (row) => {
  queryParam.recoveryNum = row.id;
  const data = await VillageProcessingRecordsApi.getVillageProcessingRecordsPage(queryParam)
  data.list.forEach((item) => {
    // item.farmDefineType = item.farmDefineType ? parseInt(item.farmDefineType) : ""
  })
  formData.value = data.list
  drawer2.value = true
}
//获取基地
const baseList = ref([])
const getPage = async () => {
  let res = await page()
  baseList.value = res.list
  // queryParams.belongPark = res.list[0].id
  getParkPage({parkId: res.list.id})
}
getPage()
//获取地块
const plotList = ref([])

const getParkPage = async (parkId) => {
  let res = await parkPage(parkId)
  plotList.value = res.list
  // queryParams.belongPlot = res.list[0].id
}

// 采收管理
const formVpRef = ref()
const openVillageProductForm = async (type: string, id: number) => {
  formVpRef.value.open(type, await HarvestManagementApi.getHarvestManagement(id))
}

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品类列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  //@ignore
  listVarietyManagement.value = await allDataCacheManager.getData({})
  listCategoryManagement.value = await CategoryManagementApi.getAllCategoryManagement({})
}
getTypeData()


/** 查询列表 */
const getList = async () => {
  loading.value = true
  show.value = userName.value
  try {
    const data = await HarvestManagementApi.getHarvestManagementPage(queryParams)
    list.value = data.list
    // list.value.forEach((item, index) => {
    //   const _itemA = listVarietyManagement.value.find(itemA => (itemA.id === item.varietyId))
    //   if (_itemA) {
    //     item.varietyName = _itemA.varietyName
    //     item.variety = _itemA.categoryName
    //     item.varietyCode = _itemA.categoryId
    //   }
    // });
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
  queryParams.belongParkId = undefined
  queryParams.belongPlotId = undefined
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}
const openForm1 = () => {
  message.alertWarning(t('新增需前往种植管理进行采收'))
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await HarvestManagementApi.deleteHarvestManagement(id)
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
    const data = await HarvestManagementApi.exportHarvestManagement(queryParams)
    download.excel(data, '采收管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
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
    queryParams.belongParkId = String(order[0].code)
    queryParams.belongPark = String(order[0].name)
  } else queryParams.belongPark = String(order[0].name)
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
  console.log("--->>查看选择的地块信息：", order[0])
  queryParams.belongParkId = String(order[0].parkId)
  queryParams.belongPlotId = String(order[0].id)
  queryParams.belongPlot = String(order[0].name)
}
</script>
