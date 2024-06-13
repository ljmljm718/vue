<template>
  <ContentWrap>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="基地名称">
        {{ detailData.parkName }}
      </el-descriptions-item>
      <el-descriptions-item label="地块名称">
        {{ detailData.plotName }}
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">
        {{ formatDate(detailData.startTime, 'YYYY-MM-DD HH:Mi:SS') }}
      </el-descriptions-item>
      <el-descriptions-item label="结束时间">
        {{ formatDate(detailData.endTime, 'YYYY-MM-DD HH:Mi:SS') }}
      </el-descriptions-item>
      <el-descriptions-item label="完成要求">
        {{ detailData.completeRequirement }}
      </el-descriptions-item>
      <el-descriptions-item label="验收标准">
        {{ detailData.acceptanceStandard }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import * as LeaveApi from '@/api/bpm/leave'
import { FarmTaskApi, FarmTaskVO } from '@/api/agriculture/farmtask'


defineOptions({ name: 'FarmTaskDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<any>({}) // 详情数据
const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  try {
    detailData.value = await FarmTaskApi.getFarmTask(props.id || queryId)
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
