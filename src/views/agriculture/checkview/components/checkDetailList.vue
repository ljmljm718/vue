<template>
  <ContentWrap>
    <el-tabs type="border-card" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="未巡检" name="first">
        <ContentWrap>
          <!--    待修改-->
          <el-table v-loading="loading" :data="listDevice" :show-overflow-tooltip="true"
                    :stripe="true">
            <el-table-column label="设备名称" align="center" prop="equName" width="600"/>
            <el-table-column label="设备状态" align="center" prop="deviceStatus" width="200">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
              </template>
            </el-table-column>
            <el-table-column
              label="上次巡检时间"
              align="center"
              prop="inspectionTime"
              :formatter="dateFormatter"
              width="180px"
            />
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="getCheckLog(scope.row)"
                >
                  巡检日志
                </el-button>
                <el-button
                  link
                  type="primary"
                  @click="openFormA('create', scope.row)"
                >
                  去巡检
                </el-button>
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
      <el-tab-pane label="已巡检" name="second">
        <ContentWrap>
          <!--    待修改-->
          <el-table v-loading="loading" :data="listDevice" :show-overflow-tooltip="true"
                    :stripe="true">
            <el-table-column label="设备名称" align="center" prop="equName" width="600"/>
            <el-table-column label="设备状态" align="center" prop="deviceStatus" width="200">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
              </template>
            </el-table-column>
            <el-table-column
              label="巡检时间"
              align="center"
              prop="inspectionTime"
              :formatter="dateFormatter"
              width="180px"
            />
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="getCheckLog(scope.row)"
                >
                  巡检日志
                </el-button>
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
    <el-drawer
      v-model="drawerOpen"
      title="巡检日志"
      direction="rtl"
      size="40%"
      :append-to-body="true"
      :modal-append-to-body="false"
    >
      <el-table :data="listCheckLog" v-loading="loading" :show-overflow-tooltip="true"
                :stripe="true">
        <!--        <el-table-column label="基地名称" align="center" prop="base" width="600"/>-->
        <!--        <el-table-column label="设备名称" align="center" prop="equName" width="200"/>-->
        <el-table-column
          label="巡检时间"
          align="center"
          prop="inspectionTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="巡检状态" align="center" prop="inspectionState">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.CHECK_STATE" :value="scope.row.inspectionState"/>
          </template>
        </el-table-column>
        <el-table-column label="巡检结果" align="center" prop="inspectionResults"/>
        <el-table-column label="巡检人" align="center" prop="inspector" width="200"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParamsCheckLog.pageSize"
          v-model:page="queryParamsCheckLog.pageNo"
          :total="totalCheckLogList"
          @pagination="getCheckLog"
        />
      </el-table>
    </el-drawer>
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <CheckLogsFormLook ref="formRef" @success="getALLList"/>
  <!-- 表单弹窗：添加/修改 -->
  <CheckLogsFormL ref="formRefA" @success="getALLList"/>
</template>

<script setup lang="ts">
import {ElDrawer} from 'element-plus'
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import {
  CheckDeviceV0,
  CheckLogsApi,
  CheckLogV01,
} from "@/api/agriculture/checklogs";
import {dateFormatter} from "@/utils/formatTime";
import {DICT_TYPE} from "@/utils/dict";
import CheckLogsFormLook from "@/views/agriculture/checkview/components/CheckLogsFormLook.vue";
import CheckLogsFormL from "@/views/agriculture/checkview/components/CheckLogsFormL.vue";
// 基地列表的数据
const listBase = ref<ParkInfoVO[]>([])
// 基地列表的总页数
const totalBase = ref(0)
// 设备列表的数据
const listDevice = ref<CheckDeviceV0[]>([])
// 设备列表的总页数
const totalDevice = ref(0)
const loading = ref(false) // 列表的加载中
const activeName = ref('first')
const categoryName = ref('123')//设备类型名称显示
const drawerOpen = ref(false) //抽屉开关
const listCheckLog = ref<CheckLogV01[]>([])//抽屉内列表数据
const totalCheckLogList = ref(0)// 抽屉内列表总页数
const props = defineProps<{
  checkRow: undefined, // 主表（主表的关联字段）
  baseId: undefined, //查询条件
}>()
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
//巡检日志请求参数 1 已完成巡检
const queryParamsCheckLog = reactive({
  pageNo: 1,
  pageSize: 100,
  inspectionState: '1',
  equNum: ''
})

/** 查询设备是否巡检 记录 */
const getCheckList = async () => {
  //请求接口进行页面数据回传 agriculture/check-logs/getCheckDeviceBySome
  loading.value = true
  try {
    const data = await CheckLogsApi.getCheckDeviceBySome(queryParamsCheckParams)
    listDevice.value = data.list
    totalDevice.value = data.total
  } finally {
    loading.value = false
  }
}

/** 路由传参赋值 */
const setCheckParams = () => {
  //首先将路由传参的参数  赋值给查询参数
  queryParamsCheckParams.base = props.baseId.baseId
  queryParamsCheckParams.createTime = props.baseId.createTime
  queryParamsCheckParams.deviceStatus = props.checkRow.categoryId
  categoryName.value = props.checkRow.categoryName
  getCheckList()
}

/** 查询基地列表数据支持 */
const getBaseList = async () => {
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
/** 查询巡检日志 */
const getCheckLog = async (row) => {
  //打开抽屉
  drawerOpen.value = true
  loading.value = true
  try {
    queryParamsCheckLog.equNum = row.equNum
    //查询 巡检日志 数据
    const data = await CheckLogsApi.pageByCondition(queryParamsCheckLog)
    listCheckLog.value = data.list
    totalCheckLogList.value = data.total
  } finally {
    loading.value = false
  }
}

/** */
const lookCheckLog = async (row) => {
  loading.value = true
  try {
    // console.log("查询巡检记录前参数输出", row)
    //查询 巡检日志 数据
    // const data = await CheckLogsApi.pageByCondition(queryParamsCheckLog)
    // console.log(data)
    // listCheckLog.value = data.list
    // totalCheckLogList.value = data.total
    loading.value = false
  } finally {
    loading.value = false
  }
}

/** 查看操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}
/** 去巡检操作 */
const formRefA = ref()
const openFormA = (type: string, row) => {
  formRefA.value.open(type, row)
}
/** 去巡检操作后关闭窗口刷新事件 */
const getALLList = () => {
  console.log("刷新我刷新")
  //首先将路由传参的参数  赋值给查询参数
  getCheckList()
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
