<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParamsCheckParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="基地" prop="baseId">
        <el-select
          v-model="queryParamsCheckParams.base"
          placeholder="请选择基地"
          clearable
          class="!w-240px"
          disabled
        >
          <el-option
            v-for="item in listBase"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-input
          v-model="categoryName"
          placeholder="请输入设备类型"
          clearable
          class="!w-240px"
          disabled
        />
      </el-form-item>
      <el-form-item label="时间" prop="createTime">
        <el-date-picker
          v-model="queryParamsCheckParams.createTime"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="请选择时间"
          class="!w-240px"
          disabled
        />
      </el-form-item>
    </el-form>
  </ContentWrap>
  <el-tabs type="border-card" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="未巡检" name="first"><ContentWrap>
      <!--    待修改-->
      <el-table v-loading="loading" :data="listDevice" :show-overflow-tooltip="true"
                :stripe="true"
                @selection-change="handleSelectionChange">
        <el-table-column label="设备名称" align="center" prop="equName" width="600"/>
        <el-table-column label="设备状态" align="center" prop="deviceStatus" width="200"/>
        <el-table-column label="上次巡检时间" align="center" prop="inspectionTime"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="goCheck(scope.row)"
            >
              巡检日志
            </el-button>
            <!--              <el-button-->
            <!--                link-->
            <!--                type="primary"-->
            <!--                @click="goCheck(scope.row)"-->
            <!--              >-->
            <!--                去巡检-->
            <!--              </el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParamsCheckParams.pageSize"
        v-model:page="queryParamsCheckParams.pageNo"
        :total="totalDevice"
        @pagination="getCheckList"
      />
    </ContentWrap></el-tab-pane>
    <el-tab-pane label="已巡检" name="second">
      <ContentWrap>
        <!--    待修改-->
        <el-table v-loading="loading" :data="listDevice" :show-overflow-tooltip="true"
                  :stripe="true"
                  @selection-change="handleSelectionChange">
          <el-table-column label="设备名称" align="center" prop="equName" width="600"/>
          <el-table-column label="设备状态" align="center" prop="deviceStatus" width="200"/>
          <el-table-column label="上次巡检时间" align="center" prop="inspectionTime"/>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="goCheck(scope.row)"
              >
                巡检日志
              </el-button>
<!--              <el-button-->
<!--                link-->
<!--                type="primary"-->
<!--                @click="goCheck(scope.row)"-->
<!--              >-->
<!--                去巡检-->
<!--              </el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParamsCheckParams.pageSize"
          v-model:page="queryParamsCheckParams.pageNo"
          :total="totalDevice"
          @pagination="getCheckList"
        />
      </ContentWrap>
    </el-tab-pane>
  </el-tabs>

</template>

<script setup lang="ts">
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import {
  CheckLogsApi,
  CheckLogsCountPageVO,
} from "@/api/agriculture/checklogs";
// 基地列表的数据
const listBase = ref<ParkInfoVO[]>([])
// 基地列表的总页数
const totalBase = ref(0)
// 基地列表的数据
const listDevice = ref<ParkInfoVO[]>([])
// 基地列表的总页数
const totalDevice = ref(0)
const loading = ref(false) // 列表的加载中
const activeName = ref('first')
let categoryName = '123'
const queryParamsCheckParams = reactive({
  pageNo: 1,
  pageSize: 10,
  base: '1772430391404294144',
  createTime: '',
  deviceStatus: '36',
  inspectionState: '0'
})
//基地请求参数 为保证全部请求到，数据设置100
const queryParamsBase = reactive({
  pageNo: 1,
  pageSize: 100
})

/** 查询设备是否巡检记录 */
const getCheckList = async () => {
  console.log("查询设备相关巡检统计",queryParamsCheckParams)
  //请求接口进行页面数据回传 agriculture/check-logs/getCheckDeviceBySome
  loading.value = true
  try {
    const data = await CheckLogsApi.getCheckDeviceBySome(queryParamsCheckParams)
    listDevice.value = data.list
    totalDevice.value = data.total
    console.log(data)
  } finally {
    loading.value = false
  }
}

const route = useRoute()
/** 路由传参赋值 */
const setCheckParams = () => {
  console.log("基地数据赋值执行了")
  //首先将路由传参的参数  赋值给查询参数
  queryParamsCheckParams.base = route.query.baseId
  queryParamsCheckParams.createTime = route.query.createTime
  queryParamsCheckParams.deviceStatus = route.query.categoryId
  categoryName = route.query.categoryName
  getCheckList()
}


/** 查询基地列表数据支持 */
const getBaseList = async () => {
  console.log("请求基地数据执行了")
  loading.value = true
  try {
    const data = await ParkInfoApi.getParkInfoPage(queryParamsBase)
    listBase.value = data.list
    totalBase.value = data.total
  } finally {
    loading.value = false
  }
}

/** Tabs切换赋值 */
const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (tab.props.name === 'first') {//0 代表未巡检
    queryParamsCheckParams.inspectionState = '0'
  }
  if (tab.props.name === 'second') {//1 代表已巡检
    queryParamsCheckParams.inspectionState = '1'
  }
  getCheckList()
}

const handleSelectionChange = (rows: CheckLogsCountPageVO[]) => {
  selectionList.value = rows
}
/** 初始化 **/
onMounted(() => {
  //获取基地数据支撑
  getBaseList()
  //路由传参赋值
  setCheckParams()
})
</script>
<style scoped lang="scss">

</style>
