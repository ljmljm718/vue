<template>
  <ContentWrap>
    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item label="订单名称">
        {{ detailData.orderName }}
      </el-descriptions-item>
      <el-descriptions-item label="产品名称">
        {{ detailData.productName }}
      </el-descriptions-item>
      <el-descriptions-item label="批次">
        {{ detailData.batch }}
      </el-descriptions-item>
      <el-descriptions-item label="截止时间">
        {{ formatDate(detailData.deadline, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="详细要求">
        {{ detailData.requireDetail }}
      </el-descriptions-item>
      <el-descriptions-item label="委外公司">
        {{ detailData.companyName }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import {OutsourcingManageApi, OutsourcingManageVO} from "@/api/machine/outsourcingmanage";

defineOptions({ name: 'ServiceEventDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<OutsourcingManageVO>({}) // 详情数据
const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

/** 获得数据 */
const getInfo = async () => {
  console.log("----------------------",query)
  detailLoading.value = true
  try {
    detailData.value = await OutsourcingManageApi.getOutsourcingManage(props.id || queryId)
    console.log(detailData.value)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
