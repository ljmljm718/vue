<template>
  <!-- 列表 -->
  <ContentWrap>
    <div class="flex justify-between items-center">
      <div>
        <el-button
          class="!bg-[#009688] !text-white"
          @click="createOpenForm('create')"
          v-hasPermi="['agriculture:model-monitor-indicator:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </div>
      <div class="flex rounded-md">
        <div
          :class="[showType === 'card' ? 'tab-btn-selected' : 'tab-btn']"
          style="border-radius: 5px 0 0 5px"
          @click="(showType = 'card'), (showElement = false)"
        >
          <el-icon>
            <Menu />
          </el-icon>
          <div class="pl-1 text-[13px]">卡片</div>
        </div>
        <div
          :class="[showType === 'list' ? 'tab-btn-selected' : 'tab-btn']"
          style="border-radius: 0 5px 5px 0"
          @click="(showType = 'list'), (showElement = true)"
        >
          <el-icon>
            <List />
          </el-icon>
          <div class="pl-1 text-[13px]">列表</div>
        </div>
      </div>
    </div>
    <div class="w-full h-[1rem]"></div>
    <div class="flex space-x-2 mt-3">
      <div class="w-[10rem]" style="border-right: 2px solid #66666660">
        <div
          v-for="item in leftDataList"
          :key="item.id"
          :class="[
            'flex space-x-2 p-2 px-3 items-center transition hoverPointer',
            selectedKey === item.id ? 'selected-item' : ''
          ]"
          @click="handleLeftItemClick(item)"
        >
          <img :src="item.imgId" alt="" class="w-[2.2rem] h-[2.2rem] object-contain" />
          <div>
            <div>{{ item.growth }}</div>
            <div>{{ item.cycle }}天</div>
          </div>
        </div>
      </div>
      <div class="grow" v-loading="loading">
        <div v-if="showType === 'card'">
          <div class="grid gap-4 grid-custom-col w-full">
            <div v-if="cardDataList.length === 0" class="col-span-36">
              <el-empty description="暂无数据" />
            </div>
            <template v-else>
              <div
                v-for="item in cardDataList"
                :key="item.id"
                class="p-3 border-[1px] border-slate-200 border-solid rounded-md shadow-md relative"
              >
                <div
                  class="btn-icon absolute right-4 top-4 cursor-pointer"
                  @click="
                    router.push(`/growth_monitor/model-indicator-element?indicatorId=${item.id}`)
                  "
                ></div>
                <div class="text-[.9rem] font-bold">{{ item.indicatorName }}重要程度占比</div>
                <div class="w-full h-[13rem]" :id="'chart_' + item.id"></div>
                <div class="py-3 space-y-4">
                  <div
                    class="flex justify-center space-x-2 items-end"
                    v-for="(cardVo, index) in item.modelIndicatorElementCardVOList"
                    :key="cardVo"
                  >
                    <div class="flex justify-center items-center space-x-2">
                      <div
                        class="w-[1rem] h-[1rem] rounded-[.2rem]"
                        :style="`background-color: ${COLOR_LIST[index]};`"
                      >
                      </div>
                      <div class="w-[5rem] text-[.8rem]">{{ cardVo.elementName }}</div>
                    </div>
                    <div class="flex flex-col items-center space-y-1">
                      <div
                        :style="{ left: `${cardVo.offset ?? 0}rem` }"
                        class="bg-[#666666] text-white rounded-md px-5 py-1 triangle-bar relative"
                        >{{ cardVo.text }}
                      </div>
                      <div class="flex space-x-[.5rem] items-center">
                        <div class="w-[3.7rem] text-center"
                          >{{ cardVo.lowVal }}{{ cardVo.unit ?? '' }}</div
                        >
                        <div class="flex space-x-[2px] rounded-full overflow-hidden w-[12rem]">
                          <div
                            v-for="(rangeItem, idx) in cardVo.modelIndicatorElementRangeDOList"
                            :key="rangeItem.id"
                            @mouseenter="
                              handleItemHover(
                                cardVo,
                                rangeItem,
                                (6 * (idx * 2 + 1)) /
                                  cardVo.modelIndicatorElementRangeDOList.length -
                                  6
                              )
                            "
                            :class="`color-bar-${idx + 1} grow w-[${
                              100 / cardVo.modelIndicatorElementRangeDOList.length
                            }%] h-[.6rem]`"
                          >
                          </div>
                        </div>
                        <div class="w-[3.7rem] text-center"
                          >{{ cardVo.hightVal }}{{ cardVo.unit ?? '' }}</div
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-else>
          <el-table
            v-loading="loading"
            :data="list"
            :show-overflow-tooltip="true"
            @row-click="handleRowClick"
            highlight-current-row
            :header-cell-style="{ fontSize: '14px', backgroundColor: '#f8f8f8', color: '#333' }"
            ref="tableRef"
            :current-row="currentRow"
          >
            <el-table-column label="指标编号" align="center" prop="id" width="160" />
            <el-table-column label="模型名称" align="center" prop="modelName" />
            <el-table-column label="生长周期" align="center" prop="growth" />
            <el-table-column label="指标名称" align="center" prop="indicatorName" />
            <el-table-column label="指标说明" align="center" prop="indicatorDescription" />
            <el-table-column label="权重(%)" align="center" prop="weight" width="70" />
            <el-table-column label="是否默认" align="center" prop="isDefault">
              <template #default="scope">
                <dict-tag
                  :type="DICT_TYPE.ADOPTION_ODER_REMIND_STATUS"
                  :value="scope.row.isDefault"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="190">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click.stop="
                    router.push(
                      `/growth_monitor/model-indicator-element?indicatorId=${scope.row.id}`
                    )
                  "
                >
                  指标要素
                </el-button>
                <el-button
                  link
                  type="primary"
                  @click.stop="openForm('update', scope.row)"
                  v-hasPermi="['agriculture:model-monitor-indicator:update']"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  @click.stop="handleDelete(scope.row.id)"
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
          class="md-10 mt-10"
          @pagination="getList"
        />

        <div v-if="showElement">
          <div class="mt-17 mb-2"></div>
          <el-table
            v-loading="loading"
            :data="elementList"
            :header-cell-style="{ fontSize: '14px', backgroundColor: '#f8f8f8', color: '#333' }"
          >
            <el-table-column label="要素标号" type="index" align="center" width="90px" />
            <el-table-column label="要素名称" align="center">
              <template #default="{ row }">
                <div style="text-align: center">
                  <div>{{ row.elementName }}</div>
                  <div>({{ row.weight }}%)</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="指标说明" prop="indicatorDescription" align="center" />
            <el-table-column label="指标范围" align="center">
              <template #default="{ row }">
                <div v-for="(item, index) in row.rangeItems" :key="index">
                  {{ item.limit }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="指标结果" align="center">
              <template #default="{ row }">
                <div v-for="(item, index) in row.rangeItems" :key="index">
                  {{ item.indicatorResult }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="健康值" align="center">
              <template #default="{ row }">
                <div v-for="(item, index) in row.rangeItems" :key="index">
                  {{ item.healthRatio }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ModelMonitorIndicatorForm ref="formRef" @success="getList" />

  <!--  选择模型-->
  <ModelSelectPopup ref="modelSelectPopupRef" @success="handleModelSelectPopupChange" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import {
  ModelMonitorIndicatorApi,
  ModelMonitorIndicatorVO
} from '@/api/agriculture/modelmonitorindicator'
// @ts-ignore
import ModelMonitorIndicatorForm from './ModelMonitorIndicatorForm.vue'
import { DICT_TYPE } from '@/utils/dict'
import { ModelManagementApi, ModelManagementVO } from '@/api/agriculture/modelmanagement'
import { CropGrowthNewApi, CropGrowthNewVO } from '@/api/agri/cropgrowthnew'
// @ts-ignore
import ModelSelectPopup from '@/views/agriculture/modelmanagement/ModelSelectPopup.vue'
import { initChartStatic, generatePieOptions } from '@/utils/bigscreenTool/index'
import { cloneDeep } from 'lodash-es'
import {ModelIndicatorElementApi} from "@/api/agriculture/modelindicatorelement";

/** 监测指标 列表 */
defineOptions({ name: 'ModelMonitorIndicator' })

const showType = ref('card')
const showElement = ref(false)
const selectedKey = ref<string>('')
const selectedName = ref<string>('')
const leftDataList = ref<any[]>([])
// 左侧列表点击事件
const handleLeftItemClick = (item) => {
  showElement.value = false
  selectedKey.value = item.id
  selectedName.value = item.growth
  getList()
  const { modelId } = route.query
  if (typeof modelId === 'string') getCardDataList(modelId, item.id)
}

const handleItemHover = (cardItem, rangeItem, offset) => {
  cardItem.text = `${rangeItem.indicatorResult} ${rangeItem.lowLimit}${rangeItem.unit ?? ''}~${
    rangeItem.highLimit
  }${rangeItem.unit ?? ''}`
  cardItem.offset = offset
}

const cardDataList = ref<any[]>([])

const getCardDataList = async (modelId, growthId) => {
  const res = await ModelMonitorIndicatorApi.getCardData({ modelId, growthId })
  if (!Array.isArray(res)) return
  cardDataList.value = res.map((item) => {
    const { modelIndicatorElementCardVOList: VoList } = item
    let modelIndicatorElementCardVOList = cloneDeep(VoList)
    if (Array.isArray(modelIndicatorElementCardVOList)) {
      modelIndicatorElementCardVOList = modelIndicatorElementCardVOList.map((cardItem) => {
        const { modelIndicatorElementRangeDOList: DoList } = cardItem

        let lowVal = Infinity,
          hightVal = -Infinity,
          unitVal = '',
          text = ''
        if (Array.isArray(DoList)) {
          DoList.forEach((doItem) => {
            const { lowLimit, highLimit, unit, indicatorResult } = doItem
            if (+lowLimit < lowVal) lowVal = lowLimit
            if (+highLimit > hightVal) hightVal = highLimit
            if (!unitVal) unitVal = unit
            if (
              (indicatorResult.indexOf('正常') !== -1 || indicatorResult.indexOf('适宜') !== -1) &&
              !text
            ) {
              text = `${indicatorResult} ${lowLimit}${unit ?? ''}~${highLimit}${unit ?? ''}`
            }
          })
        }
        cardItem.lowVal = lowVal
        cardItem.hightVal = hightVal
        cardItem.unit = unitVal
        cardItem.text = text
        return cardItem
      })
    }

    return { ...item, modelIndicatorElementCardVOList }
  })
  nextTick(() => {
    initCharts()
  })
}

const router = useRouter()
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute()

const COLOR_LIST = ['#59b756', '#73c0de', '#ee6666', '#fac858', '#009688']

const checkModelParam = async () => {
  const { modelId, belongVarietyId } = route.query
  if (typeof modelId === 'string') {
    const _item = await ModelManagementApi.getModelManagement(modelId)
    if (_item) handleModelSelectPopupChange(_item)
  }
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
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const listModelManagement = ref<ModelManagementVO[]>([]) // 模型列表的数据
const listCropGrowthNew = ref<CropGrowthNewVO[]>([]) // 生长周期列表的数据
const getTypeData = async () => {
  const { list: list1 } = await ModelManagementApi.getModelManagementNoPage({})
  if (Array.isArray(list1)) listModelManagement.value = list1
  const { list: growthNewList } = await CropGrowthNewApi.getCropGrowthNewNoPage({})
  if (Array.isArray(growthNewList)) listCropGrowthNew.value = growthNewList
}

// 获取左侧生长期列表
const getGrowthDataList = async (varietyId: string) => {
  if (!varietyId) return
  const { data } = await ModelMonitorIndicatorApi.getGrowthByVarietyId({ varietyId })
  console.log('左侧生长期列表', data)

  if (Array.isArray(data)) {
    leftDataList.value = data
    if (data.length > 0) handleLeftItemClick(data[0])
  }
}

watch(showType, (val: string) => {
  if (val === 'card') {
    nextTick(() => {
      initCharts()
    })
  }
})

const initCharts = () => {
  if (!Array.isArray(cardDataList.value)) return
  cardDataList.value.forEach((item) => {
    const chartId = 'chart_' + item.id
    const seriesData = item.modelIndicatorElementCardVOList
    if (!Array.isArray(seriesData)) return
    const _dom = document.getElementById(chartId)
    if (!_dom) return
    initChartStatic(
      chartId,
      generatePieOptions({
        legend: { show: false },
        color: COLOR_LIST,
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
            hoverAnimation: false,
            name: '整体指标',
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['50%', '50%'],
            data: seriesData.map((ele) => ({
              value: ele.weight,
              name: ele.elementName
            })),
            label: {
              formatter: '{b} | {d}%',
              shadowColor: 'transparent',
              borderColor: 'transparent',
              color: '#666666'
            }
          }
        ]
      })
    )
  })
}

// const createDisabled = ref(false) //新增按钮是否禁用
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (selectedKey.value) queryParams.growthPeriodId = selectedKey.value
    const data = await ModelMonitorIndicatorApi.getModelMonitorIndicatorPage(queryParams)
    list.value = data.list.map((item) => {
      const element = Array.isArray(listModelManagement.value)
        ? listModelManagement.value.find((ele) => ele.id === item.modelId)
        : null
      const cropItem = Array.isArray(listCropGrowthNew.value)
        ? listCropGrowthNew.value.find((ele) => ele.id === item.growthPeriodId)
        : null
      return {
        ...item,
        modelName: element ? element.modelName : '',
        growth: cropItem ? cropItem.growth : ''
      }
    })
    total.value = data.total
    if (list.value.length > 0) {
      console.log('list.value[0]', list.value[0])
      tableRef.value.setCurrentRow(list.value[0])
      currentRow.value = list.value[0]
      setTimeout(() => {
        handleRowClick(list.value[0])
      }, 300)
    }
  } finally {
    loading.value = false
    nextTick(() => {
      initCharts()
    })
  }
}

window.addEventListener('resize', () => {
  const _list = list.value
  list.value = []
  nextTick(() => {
    list.value = _list
    nextTick(() => {
      initCharts()
    })
  })
})

//--------出现下方的元素列表--------------
const currentRow = ref()
const tableRef = ref()
const elementList = ref<any[]>([])
const handleRowClick = (row) => {
  showElement.value = true
  cardDataList.value.forEach((item) => {
    if (item.indicatorName === row.indicatorName) {
      console.log('if (item.indicatorName === row.indicatorName) ')
      const { modelIndicatorElementCardVOList: VoList } = item
      let ElementVOList = cloneDeep(VoList)
      elementList.value = ElementVOList.map((elementItem) => {
        const {
          elementName,
          indicatorDescription,
          weight,
          modelIndicatorElementRangeDOList: RangeDOList
        } = elementItem
        let rangeItems = RangeDOList.map((rangeItem) => {
          const { lowLimit, highLimit, indicatorResult, healthRatio, unit } = rangeItem
          return {
            limit: `${lowLimit}${unit ?? ''}~${highLimit}${unit ?? ''}`,
            indicatorResult,
            healthRatio
          }
        })
        return {
          elementName,
          indicatorDescription,
          weight,
          rangeItems
        }
      })
      console.log('elementList.value', elementList.value)
    }
  })
}
// 默认选中第一行
watch(showType, (val: string) => {
  if (val === 'list') {
    nextTick(() => {
      tableRef.value.setCurrentRow(list.value[0])
      currentRow.value = list.value[0]
      handleRowClick(list.value[0])
    })
  }
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
  const { belongVarietyId } = route.query
  if (typeof belongVarietyId === 'string') getGrowthDataList(belongVarietyId)
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
const openForm = (type: string, item?: any) => {
  formRef.value.open(type, item)
}

/** 新增操作，自动添加模型与生长期 */
const createOpenForm = (type: string) => {
  if (selectedKey.value) {
    const item = {
      growthPeriodId: selectedKey.value,
      growth: selectedName.value,
      modelId: queryParams.modelId,
      modelName: modelName.value
    }
    formRef.value.createOpen(type, item)
  } else {
    ElMessage.error('请选择生长期后再新增！')
  }
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
  // if (!Array.isArray(order)) return;
  if (order.length === 0) return
  const _order = order
  if (!_order.id) return
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
.tab-btn,
.tab-btn-selected {
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
  background: linear-gradient(to right, #01d51d, #4cbd14);
}

.color-bar-3 {
  background: linear-gradient(to right, #4cbd14, #9aa30a);
}

.color-bar-4 {
  background: linear-gradient(to right, #9aa30a, #e78900);
}

.triangle-bar {
  position: relative;
}

.triangle-bar::after {
  content: '';
  position: absolute;
  left: calc(50% - 4px);
  top: 100%;
  width: 0;
  height: 0;
  border: 8px solid;
  border-color: #666666 transparent transparent transparent;
}

@for $i from 1 through 10 {
  @media screen and (min-width: calc(400px + calc(#{$i} * 500px))) {
    .grid-custom-col {
      grid-template-columns: repeat(#{$i}, 1fr);
    }
  }
}

.btn-icon {
  background-image: url(./btn.png);
  background-size: 100% 100%;
  width: 1rem;
  height: 1rem;
}

.hoverPointer {
  cursor: pointer;
}
.el-table .cell {
  white-space: nowrap;
}
</style>
