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
      <!--      <el-form-item label="编号" prop="cropCode">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.cropCode"-->
      <!--            placeholder="请输入编号"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--            class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="queryParams.plotName" placeholder="请选择" class="!w-240px">
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
                   class="!w-240px">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="品种" prop="cropName">
        <el-input v-model="queryParams.cropName" placeholder="请选择品种" class="!w-240px">
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
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input
          v-model="queryParams.batchCode"
          placeholder="请输入批次号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="编号" align="center" prop="cropCode" />-->
      <el-table-column label="名称" align="center" prop="cropName"/>
      <el-table-column label="品类" align="center" prop="cropType">
        <template #default="scope">
          <el-tag >{{scope.row.cropType}} </el-tag>
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
      <!--      <el-table-column label="所属基地" align="center" prop="belongPark"/>-->
      <el-table-column label="所属基地" align="center" prop="parkName"/>
      <!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
      <el-table-column label="所属地块" align="center" prop="plotName"/>
      <el-table-column
        label="开始时间"
        align="center"
        prop="receiptStartTime"
        :formatter="dateFormatter2"
        width="100px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="receiptEndTime"
        :formatter="dateFormatter2"
        width="100px"
      />
      <el-table-column label="批次号" align="center" prop="batchCode" width="160px"/>
      <!--      <el-table-column label="是否采收" align="center" prop="recoveryNo" />-->
      <el-table-column label="二维码" align="center" prop="batchQrImg">
        <template #default="scope">
          <el-image :src="`data:image/png;base64,${scope.row.batchQrImg}`"
                    style="object-fit: cover;width: 2rem;height: 2rem;"
                    preview-teleported
                    :preview-src-list="[`data:image/png;base64,${scope.row.batchQrImg}`]"
          />
        </template>
      </el-table-column>
      <el-table-column label="采收状态" align="center" prop="recoveryNo">
        <template #default="scope">
          <span v-if="scope.row.recoveryNo">已采收</span>
          <span v-if="!scope.row.recoveryNo">未采收</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="cropDesc"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <!--                    <el-button-->
          <!--                      link-->
          <!--                      type="success"-->
          <!--                      @click="goCheck(scope.row)"-->
          <!--                    >-->
          <!--                      溯源-->
          <!--                    </el-button>-->
          <el-button
            link
            type="success"
            @click="damn(scope.row)"
          >
            溯源
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
  <HarvestManagementForm ref="formRefA" @success="getList"/>
  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>生命周期-溯源</h3>
    </template>
    <template #default>
      <el-timeline style="max-width: 600px">
        <el-timeline-item
          v-for="item, index in formData"
          :key="index"
          :timestamp="formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') "
          placement="top"
        >
          <el-card>
            <h4>农事活动：{{ getValByDict(item.farmDefineType) }}</h4>
            <p>品类：
              <el-tag>{{ item.cropType }}</el-tag>
              <!--            <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="item.cropType"/>-->
            </p>
            <p>作物名称：{{ item.cropName }}</p>
            <p>记录时间：{{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">返回</el-button>
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
import HarvestManagementForm from "@/views/agriculture/harvestmanagement/HarvestManagementForm.vue";
import {DrawerProps} from "element-plus";
import {FarmRecordApi, FarmRecordVO} from "@/api/agriculture/farmrecord";
import {formatTime} from '@/utils/index'
import { CategoryManagementVO, allDataCacheManager} from "@/api/agriculture/categorymanagement";
import BreedFrom from "@/views/agriculture/varietymanagement/SelectVarirtManagement.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";

/** 鲁渝协作生命周期溯源 列表 */
defineOptions({name: 'AgriCropLifeTrace'})
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
  cropName: undefined,
  cropType: undefined,
  createTime: [],
  belongPark: undefined,
  belongPlot: undefined,
  deptId: undefined,
  userId: undefined,
})
const formData = ref<FarmRecordVO[]>([])
const queryParam = reactive({
  pageNo: 1,
  pageSize: 10,
  planId: undefined,
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
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CropBaseApi.getCropBasePage(queryParams)
    list.value = data.list
    //请求品类信息
    listCategoryManagement.value = await allDataCacheManager.getData({})
    //把品类数据的name拼接到列表中
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
  formRef.value.open(type, id)
}

/** 添加/修改操作 */
const formRefA = ref()
const openFormA = (type: string, row?: any) => {
  formRefA.value.open(type, row)
}




function cancelClick() {
  drawer2.value = false
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
</script>
