<template>
  <ContentWrap>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="计划名称">
       <label style="cursor:pointer;color: #0072c6"    @click="lookPlanDetail(detailData.planCode)" > {{ detailData.planName }}</label>
      </el-descriptions-item>
      <el-descriptions-item label="基地名称">
        {{ detailData.parkName }}
      </el-descriptions-item>
      <el-descriptions-item label="地块名称">
        {{ detailData.plotName }}
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">
        {{ formatDate(detailData.startTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="结束时间">
        {{ formatDate(detailData.endTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="完成要求">
        {{ detailData.completeRequirement }}
      </el-descriptions-item>
      <el-descriptions-item label="验收标准">
        {{ detailData.acceptanceStandard }}
      </el-descriptions-item>
      <el-descriptions-item label="作业方式">
        <div v-for="dict in getStrDictOptions(DICT_TYPE.JOB_TYPE)" :key="dict.value" >
          <el-tag v-if="dict.value==detailData.jobType">
            {{dict.label}}
          </el-tag>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="消耗农资">
        <div v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CAPITAL_CONSUME)" :key="dict.value" >
          <el-tag v-if="dict.value==detailData.agriCapitalConsume">
            {{dict.label}}
          </el-tag>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="农资数量">
        <div v-for="dict in getStrDictOptions(DICT_TYPE.CRM_PRODUCT_UNIT)" :key="dict.value" >
          <lable v-if="dict.value==detailData.agriCapitalUnit">
            {{ detailData.agriCapitalAmount }}{{dict.label}}
          </lable>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="图片">
        <el-image :src=" detailData.taskImg"/>
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
</template>
<script lang="ts" setup>
import {DICT_TYPE, getStrDictOptions} from '@/utils/dict'
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


const router = useRouter();
const lookPlanDetail = (planId:any) => {
  router.push('/farm_work/farmManage/createOrUpdate?type=view&id='+planId)
}
/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
