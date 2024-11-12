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
  <ContentWrap>
    <!--    待修改-->
    <el-table v-loading="loading" :data="listDevice" :show-overflow-tooltip="true" :stripe="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="checkDetail">
            <el-tab-pane label="巡检信息" name="checkDetail">
              <CheckDetailList :check-row="scope.row" :base-id="queryParamsCountPageByBaseId"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center" prop="categoryName" width="450"/>
      <el-table-column label="巡检设备总数" align="center" prop="sumNum" width="100"/>
      <el-table-column label="未巡检/个" align="center" prop="unFinishCheckNum"/>
      <el-table-column label="已巡检/个" align="center" prop="finishCheckNum" />
<!--      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="goCheck(scope.row)"
          >
            去巡检
          </el-button>
        </template>
      </el-table-column>-->
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
<script setup lang="ts">/** 巡检记录 列表 */
import CheckDetailList from "@/views/agriculture/checkview/components/checkDetailList.vue";

defineOptions({name: 'CheckList'})

import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {
  CheckLogsApi,
} from "@/api/agriculture/checklogs";
// 设备统计信息列表的数据
const listDevice = ref<ParkInfoVO[]>([])
// 设备统计信息列表的总页数
const totalDevice = ref(0)
const loading = ref(false) // 列表的加载中

const queryParamsCountPageByBaseId = reactive({
  pageNo: 1,
  pageSize: 10,
  baseId: '',
  createTime: '',
})

/** 查询设备分类统计列表 */
const getDeviceCountList = async () => {
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
  queryParamsCountPageByBaseId.pageNo = 1
  queryParamsCountPageByBaseId.pageSize = 10
  queryParamsCountPageByBaseId.createTime = formatCurrentDate()
  handleQuery()
}

/**获取当前时间 */
function formatCurrentDate() {
  const now = new Date();
  return now.getFullYear() + '-' +
    (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
    now.getDate().toString().padStart(2, '0');
}

/** 初始化 **/
onMounted(() => {
  //默认赋值查询参数
  resetQuery()
})

// 定义属性
const props = defineProps({
  currCategory: {
    type: Object,
    default: () => ({})
  }
})

// 监听父组件category变化
watch(() => props.currCategory,
  () => {
    if (props.currCategory) {
      queryParamsCountPageByBaseId.baseId = props.currCategory.id
    }
    handleQuery()
  })
</script>
<style scoped lang="scss">
</style>
