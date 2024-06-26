<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键id" align="center" prop="id" />
       <el-table-column label="规格流水号" align="center" prop="specsNumber" />
      <el-table-column label="规则类型" align="center" prop="ruleType" />
      <el-table-column label="规格" align="center" prop="specs" />
      <el-table-column label="单价" align="center" prop="singlePrice" />
      <el-table-column label="份数" align="center" prop="servingNumber" />
      <el-table-column label="每份数量" align="center" prop="servingAmount" />
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
import { AdoptionRuleApi } from '@/api/agriculture/adoptionrule'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  ruleNumber: undefined // 认养规则流水号（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await AdoptionRuleApi.getAdoptionRuleSpecsListByRuleNumber(props.ruleNumber)
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
