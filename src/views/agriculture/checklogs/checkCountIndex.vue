<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParamsCountPageByBaseId"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="基地" prop="baseId">
        <el-select
          v-model="queryParamsCountPageByBaseId.baseId"
          placeholder="请选择基地"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in listBase"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="createTime">
        <el-date-picker
          v-model="queryParamsCountPageByBaseId.createTime"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="请选择时间"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
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
  <ContentWrap>
    <!--    待修改-->
    <el-table v-loading="loading" :data="listDevice" :show-overflow-tooltip="true" :stripe="true"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column width="30" label="选择" type="selection"/>-->
      <el-table-column label="设备类型" align="center" prop="categoryName" width="600"/>
      <el-table-column label="巡检设备总数" align="center" prop="sumNum" width="200"/>
      <el-table-column label="已巡检/个" align="center" prop="finishCheckNum" width="200"/>
      <el-table-column label="未巡检/个" align="center" prop="unFinishCheckNum" width="200"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="goCheck(scope.row)"
          >
            去巡检
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParamsCountPageByBaseId.pageSize"
      v-model:page="queryParamsCountPageByBaseId.pageNo"
      :total="totalDevice"
      @pagination="getDeviceCountList"
    />
  </ContentWrap>
</template>
<script setup lang="ts">
/** 巡检记录 列表 */
defineOptions({name: 'checkCountIndex'})

import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import {
  CheckLogsApi,
  CheckLogsCountPageVO,
} from "@/api/agriculture/checklogs";
// 基地列表的数据
const listBase = ref<ParkInfoVO[]>([])
// 基地列表的总页数
const totalBase = ref(0)
// 设备统计信息列表的数据
const listDevice = ref<ParkInfoVO[]>([])
// 设备统计信息列表的总页数
const totalDevice = ref(0)
const loading = ref(false) // 列表的加载中
//基地请求参数 为保证全部请求到，数据设置100
const queryParamsBase = reactive({
  pageNo: 1,
  pageSize: 100
})
const queryParamsCountPageByBaseId = reactive({
  pageNo: 1,
  pageSize: 10,
  baseId: '1772430391404294144',
  createTime: '',
})
/** 查询基地列表 */
const getBaseList = async () => {
  loading.value = true
  try {
    const data = await ParkInfoApi.getParkInfoPage(queryParamsBase)
    listBase.value = data.list
    totalBase.value = data.total
    if (listBase.value.length > 0) {
      queryParamsCountPageByBaseId.baseId = listBase.value[0].code
      queryParamsCountPageByBaseId.createTime = formatCurrentDate()
    }
  } finally {
    loading.value = false
  }
}

/** 查询设备分类统计列表 */
const getDeviceCountList = async () => {
  console.log(queryParamsCountPageByBaseId)
  loading.value = true
  try {
    const data = await CheckLogsApi.getCountPageByBaseId(queryParamsCountPageByBaseId)
    listDevice.value = data.list
    totalDevice.value = data.total
  } finally {
    loading.value = false
  }
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParamsCountPageByBaseId.pageNo = 1
  getDeviceCountList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryParamsCountPageByBaseId.baseId = listBase.value[0].code
  queryParamsCountPageByBaseId.pageNo = 1
  queryParamsCountPageByBaseId.pageSize = 10
  queryParamsCountPageByBaseId.createTime = formatCurrentDate()
  handleQuery()
}

/** */
const {push} = useRouter()
const goCheck = (row) => {
  //打开新的页签并传递参数
  console.log("准备打开的页签", queryParamsCountPageByBaseId.baseId,queryParamsCountPageByBaseId.createTime,row.categoryId,row.categoryName)
  push(`/check/checkCountTwo?baseId=${queryParamsCountPageByBaseId.baseId}&createTime=${queryParamsCountPageByBaseId.createTime}&categoryId=${row.categoryId}&categoryName=${row.categoryName}`);
}

/**获取当前时间 */
function formatCurrentDate() {
  const now = new Date();
  return now.getFullYear() + '-' +
    (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
    now.getDate().toString().padStart(2, '0');
}

const handleSelectionChange = (rows: CheckLogsCountPageVO[]) => {
  selectionList.value = rows
}
/** 初始化 **/
onMounted(() => {
  //首先查询所有基地供选择
  //默认赋值查询参数
  getBaseList()
  getDeviceCountList()
})
</script>
<style scoped lang="scss">
</style>
