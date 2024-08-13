<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="指标要素" prop="indicatorElementId">
        <el-input v-model="queryParams.indicatorElementId" placeholder="请选择指标要素" disabled>
          <template #append>
            <el-button @click="openModelIndicatorElementSelectPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="下限" prop="lowLimit">-->
<!--        <el-input-->
<!--          v-model="queryParams.lowLimit"-->
<!--          placeholder="请输入下限"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="上限" prop="highLimit">-->
<!--        <el-input-->
<!--          v-model="queryParams.highLimit"-->
<!--          placeholder="请输入上限"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="单位" prop="unit">-->
<!--        <el-input-->
<!--          v-model="queryParams.unit"-->
<!--          placeholder="请输入单位"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="健康比例" prop="healthRatio">-->
<!--        <el-input-->
<!--          v-model="queryParams.healthRatio"-->
<!--          placeholder="请输入健康比例"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="健康等级" prop="healthLevel">
        <el-input
          v-model="queryParams.healthLevel"
          placeholder="请输入健康等级"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="指标结果" prop="indicatorResult">-->
<!--        <el-input-->
<!--          v-model="queryParams.indicatorResult"-->
<!--          placeholder="请输入指标结果"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="排序" prop="sortBy">-->
<!--        <el-input-->
<!--          v-model="queryParams.sortBy"-->
<!--          placeholder="请输入排序"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          @click="openForm('create')"-->
<!--          v-hasPermi="['agriculture:model-indicator-element-range:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--          v-hasPermi="['agriculture:model-indicator-element-range:export']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="指标要素" align="center" prop="indicatorElementId" width="240"/>
      <el-table-column label="指标范围" align="center" width="240">
        <template #default="scope">
          {{ scope.row.lowLimit + '  ~  ' + scope.row.highLimit + '  ' + ((!scope.row.unit) ? '' : scope.row.unit) }}
        </template>
      </el-table-column>
<!--      <el-table-column label="下限" align="center" prop="lowLimit" />-->
<!--      <el-table-column label="上限" align="center" prop="highLimit" />-->
<!--      <el-table-column label="单位" align="center" prop="unit" />-->
      <el-table-column label="健康值" align="center" prop="healthRatio" />
      <el-table-column label="健康等级" align="center" prop="healthLevel" />
      <el-table-column label="指标结果" align="center" prop="indicatorResult" width="240"/>
      <el-table-column label="排序" align="center" prop="sortBy" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:model-indicator-element-range:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:model-indicator-element-range:delete']"
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
  <ModelIndicatorElementRangeForm ref="formRef" @success="getList" />

  <!--  选择指标要素-->
  <ModelIndicatorElementSelectPopup ref="modelIndicatorElementSelectPopupRef" @success="handleModelIndicatorElementSelectPopupChange"/>
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { ModelIndicatorElementRangeApi, ModelIndicatorElementRangeVO } from '@/api/agriculture/modelindicatorelementrange'
import ModelIndicatorElementRangeForm from './ModelIndicatorElementRangeForm.vue'
import {ModelIndicatorElementVO} from "@/api/agriculture/modelindicatorelement";
import ModelIndicatorElementSelectPopup from "@/views/agriculture/modelindicatorelement/components/ModelIndicatorElementSelectPopup.vue";

/** 指标要素范围 列表 */
defineOptions({ name: 'ModelIndicatorElementRange' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ModelIndicatorElementRangeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  indicatorElementId: undefined,
  lowLimit: undefined,
  highLimit: undefined,
  unit: undefined,
  healthRatio: undefined,
  healthLevel: undefined,
  indicatorResult: undefined,
  sortBy: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const route = useRoute()
onMounted(() => {
  if (route.query) queryParams.indicatorElementId = route.query.indicatorElementId
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ModelIndicatorElementRangeApi.getModelIndicatorElementRangePage(queryParams)
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
  queryFormRef.value.resetFields()
  // queryParams.indicatorElementId = undefined
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ModelIndicatorElementRangeApi.deleteModelIndicatorElementRange(id)
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
    const data = await ModelIndicatorElementRangeApi.exportModelIndicatorElementRange(queryParams)
    download.excel(data, '指标要素范围.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

//指标要素的选择
const modelIndicatorElementSelectPopupRef = ref()
const openModelIndicatorElementSelectPopup = (id: string) => {
  modelIndicatorElementSelectPopupRef.value.open(id)
}
const handleModelIndicatorElementSelectPopupChange = (order: ModelIndicatorElementVO) => {
  queryParams.indicatorElementId = order[0].id?.toString()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
