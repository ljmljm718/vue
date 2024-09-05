<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="农户身份码" prop="farmerId">
        <el-input
          v-model="queryParams.farmerId"
          placeholder="请输入农户身份码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农户姓名" prop="farmerName">
        <el-input
          v-model="queryParams.farmerName"
          placeholder="请输入农户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="queryParams.sex"
          placeholder="请选择性别"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_FARMER_SEX)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="种植种类" prop="plantingSpecies">
        <el-input
          v-model="queryParams.plantingSpecies"
          placeholder="请输入擅长种植种类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="选择基地">
        <el-select class="!w-240px" v-model="queryParams.belongPark">
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
        <el-select class="!w-240px" v-model="queryParams.belongPlot">
          <el-option
            v-for="(item, index) in plotList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
<!--
      <el-form-item label="所属基地" prop="belongPark">
        <el-input v-model="queryParams.belongPark" placeholder="请选择所属基地" class="!w-240px">
          <template #append>
            <el-button @click="openParkPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="queryParams.belongPlot" placeholder="请输入所属地块" class="!w-240px">
          <template #append>
            <el-button @click="openPlotPopup(queryParams.belongPark)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"  type="primary"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>

    <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:farmer-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:farmer-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="农户ID" align="center" prop="id" />-->
      <el-table-column label="农户身份码" align="center" prop="farmerId" width="150"/>
      <el-table-column label="农户姓名" align="center" prop="farmerName" />
      <!-- <el-table-column label="所属基地" align="center" prop="belongPark" width="200"/> -->
      <el-table-column label="所属基地" align="center" prop="belongParkName" width="200"/>
      <!-- <el-table-column label="所属地块" align="center" prop="belongPlot" width="200"/> -->
      <el-table-column label="所属地块" align="center" prop="belongPlotName" width="200"/>
      <el-table-column label="性别" align="center" prop="sex" width="90">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_FARMER_SEX" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" prop="age" width="90">
        <template #default="scope">
          <div> {{ scope.row["age"] }}{{ "岁" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" prop="mobile" width="120"/>
      <el-table-column label="承包土地面积" align="center" prop="coveredLandArea" width="150">
        <template #default="scope">
          <div> {{ scope.row["coveredLandArea"] }}{{ "亩" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="擅长种植种类" align="center" prop="plantingSpecies" width="150"/>
      <el-table-column label="种植经验" align="center" prop="plantingExperience"  width="110">
        <template #default="scope">
          <div> {{ scope.row["plantingExperience"] }}{{ "年" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
<!--      <el-table-column label="部门id" align="center" prop="deptId" />-->
<!--      <el-table-column label="用户id" align="center" prop="userId" />-->
      <el-table-column label="操作" align="center" fixed="right" width="150px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:farmer-info:update']"
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
            v-hasPermi="['agriculture:farmer-info:delete']"
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
  <FarmerInfoForm ref="formRef" @success="getList" />

  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
  <!--  选择大棚-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { FarmerInfoApi, FarmerInfoVO } from '@/api/agriculture/farmerinfo'
import FarmerInfoForm from './FarmerInfoForm.vue'
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import { ParkDetailVO } from '@/api/agriculture/parkdetail'
import { ParkInfoVO } from '@/api/agriculture/parkinfo'
import {page, parkPage} from '@/views/agriculture/IntelligentStatistics/api.ts'

/** 农户管理 列表 */
defineOptions({ name: 'FarmerInfo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FarmerInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  farmerId: undefined,
  farmerName: undefined,
  sex: undefined,
  plantingSpecies: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  belongParkName: undefined,
  belongPlotName: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmerInfoApi.getFarmerInfoPage(queryParams)
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
  queryParams.belongPark = undefined
  queryParams.belongPlot = undefined
  queryFormRef.value.resetFields()
  handleQuery()
}


/** 添加/修改操作 */
const router = useRouter()
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if(type == 'create'){
    router.push('/asset/base/farmer-info/CreateOrUpdate?type='+type)
  }else{
    router.push('/asset/base/farmer-info/CreateOrUpdate?type='+type+'&id='+id)
  }
  
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FarmerInfoApi.deleteFarmerInfo(id)
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
    const data = await FarmerInfoApi.exportFarmerInfo(queryParams)
    download.excel(data, '农户管理.xls')
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
</script>
