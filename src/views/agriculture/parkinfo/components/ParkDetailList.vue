<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--       <el-table-column label="编号" align="center" prop="code" width="200"/>-->
      <el-table-column label="名称" align="center" prop="name" width="150"/>
      <el-table-column label="海拔" align="center" prop="altitude" width="100">
        <template #default="scope">
          {{ scope.row.altitude != undefined ? scope.row.altitude + '米' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="通讯地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="联系电话" align="center" prop="tel" />
      <el-table-column label="面积" align="center" prop="area" width="100">
        <template #default="scope">
          {{ scope.row.area != undefined ? scope.row.area + '亩' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="quantity" width="100"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ParkInfoApi } from '@/api/agriculture/parkinfo'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  parkId: undefined // 主表（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ParkInfoApi.getParkDetailListByParkId(props.parkId)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
