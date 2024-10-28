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
      <el-form-item label="名称" prop="cropName">
        <el-input
          v-model="queryParams.cropName"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品类" prop="cropType">
        <el-select
          v-model="queryParams.cropType"
          placeholder="请选择品类"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生长期" prop="growth">
        <el-input
          v-model="queryParams.growth"
          placeholder="请输入生长期"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="选择基地">
          <el-select  class="!w-240px" v-model="queryParams.belongPark">
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
          <el-select  class="!w-240px" v-model="queryParams.belongPlot">
            <el-option
              v-for="(item, index) in plotList"
              :key="index"
              :value="item.id"
              :label="item.name"
              placeholder="请选择"
            />
          </el-select>
        </el-form-item>
      <!-- <el-form-item label="所属基地" prop="parkName">
        <el-input v-model="queryParams.parkName" placeholder="请选择所属基地">
          <template #append>
            <el-button @click="openParkPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="所属地块" prop="plotName">
        <el-input v-model="queryParams.plotName" placeholder="请选择所属地块">
          <template #append>
            <el-button @click="openPlotPopup(queryParams.belongPark)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item> -->
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
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
          v-hasPermi="['agri:crop-growth:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="warning"
          plain
          class="!h-2.4rem"
          @click="handleAddGrowth"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          批量添加
        </el-button>
      </div>
      <div class="grow">
        <IntroduceAlert title="该模块是对不同基地地块下的不同作物的各个生长期进行解释说明，具体包括各生长期的起止时间，环境条件等等。"/>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="编号" align="center" prop="cropCode" />-->
      <el-table-column label="名称" align="center" prop="cropName" min-width="130"/>
      <el-table-column label="品类" align="center" prop="cropType">
        <template #default="scope">
          <!-- <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="scope.row.cropType"/> -->
          <el-tag >{{scope.row.cropType}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="生长期" align="center" prop="growth"/>
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
      <el-table-column label="所属园区" align="center" prop="parkName" min-width="140"/>
      <el-table-column label="所属地块" align="center" prop="plotName" min-width="140"/>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column label="特点" align="center" prop="feature" min-width="140"/>
      <el-table-column label="环境条件" align="center" prop="envCondition" min-width="200"/>
      <el-table-column label="生长地点" align="center" prop="growSite" min-width="200"/>
      <!--      <el-table-column label="备注" align="center" prop="remark" width="200px"/>-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="160px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:crop-growth:update']"
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
            v-hasPermi="['agri:crop-growth:delete']"
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
  <CropGrowthForm ref="formRef" @success="getList"/>

  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>
  <!-- 批量添加生长周期 -->
  <AddGrowthDialog ref="addGrowthDialogIns" @update="handleUpdate" />
</template>

<script setup lang="ts">
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import {CropGrowthApi, CropGrowthVO} from '@/api/agriculture/cropgrowth'
import CropGrowthForm from './CropGrowthForm.vue'
// @ts-ignore
import AddGrowthDialog from './addGrowthDialog.vue'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ParkDetailVO} from '@/api/agriculture/parkdetail'
import {ParkInfoVO} from '@/api/agriculture/parkinfo'
import { CategoryManagementVO, allDataCacheManager} from "@/api/agriculture/categorymanagement";

import {page,parkPage} from '@/views/agriculture/IntelligentStatistics/api.ts'


/** 作物生长期管理 列表 */
defineOptions({name: 'CropGrowth'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CropGrowthVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  growth: undefined,
  feature: undefined,
  remark: undefined,
  createTime: [],
  belongPark: undefined,
  belongPlot: undefined,
  startTime: [],
  endTime: [],
  parkName: undefined,
  plotName: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

const addGrowthDialogIns = ref()
const handleAddGrowth = () => {
  if (!addGrowthDialogIns.value) return;
  addGrowthDialogIns.value.open()
}
const handleUpdate = () => { resetQuery() }

//获取基地
const baseList = ref([])
const getPage = async () => {
  let res = await page()
  console.log(res, 'res123x')
  baseList.value = res.list
  // queryParams.belongPark = res.list[0].id
  getParkPage({ parkId: res.list.id })
}
getPage()
//获取地块
const plotList = ref([])

const getParkPage = async (parkId) => {
  let res = await parkPage(parkId)
  console.log(res.list[0].id, 'dikuia')
  plotList.value = res.list
  // queryParams.belongPlot = res.list[0].id
}


/** 查询列表 */
const getList = async () => {
  loading.value = true
  listCategoryManagement.value = await allDataCacheManager.getData({})
  try {
    const data = await CropGrowthApi.getCropGrowthPage(queryParams)
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
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.belongPark = undefined
  queryParams.belongPlot = undefined
  handleQuery()
}
const router = useRouter() // 路由
/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  // formRef.value.open(type, id)
  router.push('/farm_work/cropgrowth?id=' +id+ '&type='+type)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CropGrowthApi.deleteCropGrowth(id)
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
    const data = await CropGrowthApi.exportCropGrowth(queryParams)
    download.excel(data, '作物生长期管理.xls')
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
    queryParams.belongPark = String(order[0].code)
    queryParams.parkName = String(order[0].name)
  } else queryParams.belongPlot = String(order[0].id)
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
  queryParams.belongPark = String(order[0].parkId)
  queryParams.belongPlot = String(order[0].id)
  queryParams.plotName = String(order[0].name)
}
</script>
