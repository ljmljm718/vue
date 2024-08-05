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
      <el-form-item label="模型名称" prop="name">
        <el-input
          v-model="modelName"
          placeholder="请选择模型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        >
          <template #append>
            <el-button @click="openModelSelectPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="生长周期" prop="growthPeriodId">-->
<!--        <el-input-->
<!--          v-model="queryParams.growthPeriodId"-->
<!--          placeholder="请输入生长周期"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="指标名称" prop="indicatorName">-->
<!--        <el-input-->
<!--          v-model="queryParams.indicatorName"-->
<!--          placeholder="请输入指标名称"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="指标范围" prop="indicatorRange">-->
<!--        <el-input-->
<!--          v-model="queryParams.indicatorRange"-->
<!--          placeholder="请输入指标范围"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex justify-between items-center">
      <div>
        <el-button
          class="!bg-[#009688] !text-white"
          @click="openForm('create')"
          v-hasPermi="['agriculture:model-monitor-indicator:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:model-monitor-indicator:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </div>
      <div class="flex rounded-md">
        <div
          :class="[showType === 'card' ? 'tab-btn-selected' : 'tab-btn']"
          style="border-radius: 5px 0 0 5px"
          @click="showType = 'card'"
        >
          <el-icon><Menu /></el-icon>
          <div class="pl-1 text-[13px]">卡片</div>
        </div>
        <div
          :class="[showType === 'list' ? 'tab-btn-selected' : 'tab-btn']"
          style="border-radius: 0 5px 5px 0"
          @click="showType = 'list'"
        >
          <el-icon><List /></el-icon>
          <div class="pl-1 text-[13px]">列表</div>
        </div>
      </div>
    </div>
    <div class="w-full h-[1rem]"></div>
    <div class="flex space-x-2 mt-3">
      <div class="w-[10rem]" style="border-right: 2px solid #66666660;">
        <div
          v-for="item in leftDataList"
          :key="item.id"
          :class="['flex space-x-2 p-2 px-3 items-center transition', selectedKey === item.id ? 'selected-item' : '']"
          @click="handleLeftItemClick(item)"
        >
          <img :src="item.imgId" alt="" class="w-[2rem] h-[2rem]" />
          <div>
            <div>{{ item.growth }}</div>
            <div>{{ item.cycle }}</div>
          </div>
        </div>
      </div>
      <div class="grow" v-loading="loading">
        <div v-if="showType === 'card'">
          <div class="grid grid-cols-3">
            <div
              v-for="item, index in list"
              :key="index"
              class="p-3 border-[1px] border-slate-200 border-solid rounded-md shadow-md"
            >
              <div class="text-[.9rem] font-bold">{{ item.modelName }}</div>
              <div class="w-full h-[13rem]" :id="'chart_' + item.id"></div>
              <div class="py-3">
                <div class="flex justify-center space-x-7 items-end">
                  <div class="flex justify-center items-center space-x-2">
                    <div class="w-[1rem] h-[1rem] bg-red rounded-[.2rem]"></div>
                    <div>温度</div>
                  </div>
                  <div class="flex flex-col items-center space-y-1">
                    <div class="bg-[#666666] text-white rounded-md px-5 py-1 triangle-bar">温度适宜25℃</div>
                    <div class="flex space-x-[.5rem] items-center">
                      <div>0</div>
                      <div class="flex space-x-[2px] rounded-full overflow-hidden">
                        <div class="color-bar-1 grow w-[4rem] h-[.6rem]"></div>
                        <div class="color-bar-2 grow w-[4rem] h-[.6rem]"></div>
                        <div class="color-bar-3 grow w-[4rem] h-[.6rem]"></div>
                      </div>
                      <div>25</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="指标编号" align="center" prop="id" />
            <el-table-column label="模型名称" align="center" prop="modelName" />
            <el-table-column label="生长周期" align="center" prop="growth" />
            <el-table-column label="指标名称" align="center" prop="indicatorName" />
            <el-table-column label="指标说明" align="center" prop="indicatorDescription" />
            <el-table-column label="指标范围" align="center" prop="indicatorRange" />
            <el-table-column label="指标结果" align="center" prop="indicatorResult" />
            <el-table-column label="健康分值" align="center" prop="healthScore" />
            <el-table-column label="权重" align="center" prop="weight" />
            <el-table-column label="是否默认" align="center" prop="isDefault" >
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.ADOPTION_ODER_REMIND_STATUS" :value="scope.row.isDefault" />
              </template>
            </el-table-column>
            <el-table-column label="实现类" align="center" prop="implementationClass" />
      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        align="center"-->
      <!--        prop="createTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="openForm('update', scope.row.id)"
                  v-hasPermi="['agriculture:model-monitor-indicator:update']"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  v-hasPermi="['agriculture:model-monitor-indicator:delete']"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ModelMonitorIndicatorForm ref="formRef" @success="getList" />

  <!--  选择模型-->
  <ModelSelectPopup ref="modelSelectPopupRef" @success="handleModelSelectPopupChange"/>
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { ModelMonitorIndicatorApi, ModelMonitorIndicatorVO } from '@/api/agriculture/modelmonitorindicator'
// @ts-ignore
import ModelMonitorIndicatorForm from './ModelMonitorIndicatorForm.vue'
import {DICT_TYPE} from "@/utils/dict";
import {ModelManagementApi, ModelManagementVO} from "@/api/agriculture/modelmanagement";
import {CropGrowthNewApi, CropGrowthNewVO} from '@/api/agri/cropgrowthnew'
// @ts-ignore
import ModelSelectPopup from "@/views/agriculture/modelmanagement/ModelSelectPopup.vue"
import {
  initChartStatic,
  generatePieOptions
} from '@/utils/bigscreenTool/index'

/** 监测指标 列表 */
defineOptions({ name: 'ModelMonitorIndicator' })

const showType = ref("card")
const selectedKey = ref<string>('')
const leftDataList = ref<any[]>([])
const handleLeftItemClick = (item) => {
  selectedKey.value = item.id;
  getList()
}

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute()

const checkModelParam = () => {
  const { modelId, belongVarietyId } = route.query;
  if (typeof modelId === 'string') openModelSelectPopup(modelId)
  if (typeof belongVarietyId === 'string') getGrowthDataList(belongVarietyId)
}
onMounted(() => checkModelParam())

const loading = ref(true) // 列表的加载中
const list = ref<ModelMonitorIndicatorVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive<any>({
  pageNo: 1,
  pageSize: 10,
  modelId: undefined,
  growthPeriodId: undefined,
  indicatorName: undefined,
  indicatorDescription: undefined,
  indicatorRange: undefined,
  indicatorResult: undefined,
  healthScore: undefined,
  weight: undefined,
  isDefault: undefined,
  implementationClass: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const listModelManagement = ref<ModelManagementVO[]>([]) // 模型列表的数据
const listCropGrowthNew = ref<CropGrowthNewVO[]>([]) // 生长周期列表的数据
const getTypeData = async () => {
  const { list: list1 } = await ModelManagementApi.getModelManagementNoPage({})
  if (Array.isArray(list1)) listModelManagement.value = list1
  const { list: growthNewList } = await CropGrowthNewApi.getCropGrowthNewNoPage({})
  console.log("growthNewList", growthNewList)
  if (Array.isArray(growthNewList)) listCropGrowthNew.value = growthNewList
}

// 获取左侧生长期列表
const getGrowthDataList = async (varietyId:string) => {
  if (!varietyId) return;
  const { data } = await ModelMonitorIndicatorApi.getGrowthByVarietyId({ varietyId })
  console.log("左侧生长期列表", data);
  
  if (Array.isArray(data)) leftDataList.value = data;
}

watch(showType, (val:string) => {
  if (val === 'card') {
    nextTick(() => {
      initCharts()
    })
  }
})
const initCharts = () => {
  if (!Array.isArray(list.value)) return;
  list.value.forEach(item => {
    const chartId = 'chart_' + item.id
    initChartStatic(chartId, generatePieOptions({
      legend: { show: false },
      title: {
        text: item.indicatorName ?? '',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '整体指标',
          type: "pie",
          radius: ["35%", "65%"],
          center: ["50%", "50%"],
          data: [
            { value: 46, name: '温度' },
            { value: 29, name: '湿度' },
            { value: 25, name: '光照' },
          ],
          label: {
            formatter: "{b} | {c} - {d}%",
            shadowColor: 'transparent',
            borderColor: 'transparent',
            color: '#666666'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
        },
      ],
    }))
  })
}


watch(showType, (val:string) => {
  if (val === 'card') {
    nextTick(() => {
      initCharts()
    })
  }
})


/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (selectedKey.value) queryParams.growthPeriodId = selectedKey.value
    const data = await ModelMonitorIndicatorApi.getModelMonitorIndicatorPage(queryParams)
    console.log("data", data.list)
    list.value = data.list.map(item => {
      const element = Array.isArray(listModelManagement.value) ? listModelManagement.value.find(ele => (ele.id === item.modelId)) : null
      const cropItem = Array.isArray(listCropGrowthNew.value) ? listCropGrowthNew.value.find(ele => ele.id === item.growthPeriodId) : null
      return {
        ...item,
        modelName: element ? element.modelName : '',
        growth: cropItem ? cropItem.growth : ''
      }
    })
    console.log("list", list.value)
    total.value = data.total
  } finally {
    loading.value = false
    nextTick(() => {
      initCharts()
    })
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
  modelName.value = undefined
  queryParams.modelId = undefined
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
    await ModelMonitorIndicatorApi.deleteModelMonitorIndicator(id)
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
    const data = await ModelMonitorIndicatorApi.exportModelMonitorIndicator(queryParams)
    download.excel(data, '监测指标.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

//模型的选择
const modelSelectPopupRef = ref()
const openModelSelectPopup = (id: string) => {
  modelSelectPopupRef.value.open(id)
}
const modelName = ref()
const handleModelSelectPopupChange = (order: ModelManagementVO[]) => {
  if (!Array.isArray(order)) return;
  if (order.length === 0) return;
  const _order = order[0];
  if (!_order.id) return;
  queryParams.modelId = _order.id.toString()
  modelName.value = _order.modelName?.toString()
}

const init = async () => {
  await getTypeData()
  await getList()
}
/** 初始化 **/
onMounted(() => {
  init()
})
</script>
<style scoped lang="scss">

.tab-btn, .tab-btn-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 1.5rem;
}

.tab-btn {
  border: 1px solid #e6e6e6;
  color: #666666;
}

.tab-btn-selected {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}

.selected-item {
  background-color: #e5f4f3;
  border-right: 4px solid #009688;
  color: #009688;
}

.color-bar-1 {
  background: linear-gradient(to right, #01d51d, #4cbd14);
}

.color-bar-2 {
  background: linear-gradient(to right, #4cbd14, #9aa30a);
}

.color-bar-3 {
  background: linear-gradient(to right, #9aa30a, #e78900);
}

.triangle-bar {
  position: relative;
}

.triangle-bar::after {
  content: "";
  position: absolute;
  left: calc(50% - 4px);
  top: 100%;
  width: 0;
  height: 0;
  border: 8px solid;
  border-color: #666666 transparent transparent transparent;
}
</style>
