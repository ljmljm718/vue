<script setup lang="ts">
import {
  getModelByParkId,
  getModelInfo,
  getModelMonitor,
  getMonitorIndicatorWithDetail,
  parkDetailGetAll
} from './api'
import {generatePieOptions, initChartStatic} from '@/utils/bigscreenTool/index'
import {ModelManagementApi} from '@/api/agriculture/modelmanagement'
// 引入图标
import execute from '@/assets/svgs/execute.svg'

// 是否折叠
const collapsed = ref<boolean>(false)
// 左侧地块列表
const plotListLoading = ref<boolean>(false)
const selectedPlotId = ref<string>('')
const plotList = ref<any[]>([])
const getPlotList = async () => {
  plotListLoading.value = true
  plotList.value = []
  const res = await parkDetailGetAll({}).catch((err) => {
    plotListLoading.value = false
  })
  activeGrowth.value = ''
  defaultGrowth.value = ''
  if (Array.isArray(res)) {
    plotList.value = res
    if (res.length > 0) {
      selectedPlotId.value = res[0].id
      getModelList(res[0].id)
    }
  }
  plotListLoading.value = false
}
getPlotList()
// 点击地块触发
const handlePlotClick = (item) => {
  activeGrowth.value = ''
  defaultGrowth.value = ''
  initChart([], '', '')
  periodList.value = [] //清除右侧生长期
  indexBtns.value = [] //清除监测指标按钮
  tableData.value = [] //清除表格数据
  keyPointList.value = [] //清除要点按钮
  selectedInfo.value = '' //清除要点
  selectedPlotId.value = item.id
  getModelList(item.id)
}

// 评分列表
const healthValLoading = ref<boolean>(false)
const healthValList = ref<any[]>([])
const getHealthValList = async (modelId, batch) => {
  healthValLoading.value = true
  healthValList.value = []
  const res = await getModelMonitor({ modelId, batch }).catch((err) => {
    healthValLoading.value = false
  })
  if (Array.isArray(res)) {
    healthValList.value = res.map((item, index) => ({ ...item, icon: `icon-${(index % 5) + 1}` }))
  }
  healthValLoading.value = false
}

// 模型列表
const modelListLoading = ref<boolean>(false)
const selectedModelId = ref<string>('')
const modelList = ref<any[]>([])
const defaultGrowth = ref<string>('')
const getModelList = async (plotId) => {
  listFirstItem.value = []
  modelListLoading.value = true
  modelList.value = []
  const res = await getModelByParkId({ plotId }).catch((err) => {
    modelListLoading.value = false
  })
  if (Array.isArray(res)) {
    modelList.value = res
    console.log('🚀 ~ getModelList ~ res:', res)
    healthValList.value = [] // 清空健康评分
    tableData.value = [] // 清空表格数据
    cycleInfoList.value = [] // 清空模型周期列表
    if (res.length > 0) {
      selectedModelId.value = res[0].modelId
      defaultGrowth.value = res[0].growth
      console.log('🚀 ~ getModelList ~ defaultGrowth.value:', defaultGrowth.value)
      // TODO: 获取健康评分 下面两个
      getHealthValList(res[0].modelId, res[0].batchCode)
      getTableData(res[0].modelId, res[0].growthId)
      getCycleInfoList(res[0].modelId, res[0].growthId)
    }
  }
  modelListLoading.value = false
}
const handleModelClick = (item) => {
  activeGrowth.value = ''
  keyPointList.value = []
  selectedInfo.value = ''
  activeGrowthId.value = item.growthId
  selectedModelId.value = item.modelId
  defaultGrowth.value = item.growth
  instance.value &&
    instance.value.setOption({
      title: { text: item.growth, subtext: item.cycle + '天' }
    })
  getHealthValList(item.modelId, item.batchCode)
  getTableData(item.modelId, item.modelId)
}

// 监测指标按钮
const indexBtns = ref<any[]>([])
const selectedBtn = ref<string>('') // 当前选中按钮

// 点击指标按钮后触发
const handleIndexBtnClick = (item) => {
  selectedBtn.value = item.id
  const _selectedOriginTableItem = originTableData.value.find((ele) => ele.id === item.id)
  tableData.value = formatTableData(_selectedOriginTableItem.modelIndicatorElementCardVOList)
}

// 格式化表格内容
const formatTableData = (voList: any[]) => {
  return voList.map((item) => {
    const rangeItem = item.modelIndicatorElementRangeDOList

    if (!Array.isArray(rangeItem)) return item
    const firstItem = rangeItem[0],
      lastItem = rangeItem[rangeItem.length - 1]
    const minVal = firstItem.lowLimit,
      maxVal = lastItem.highLimit,
      unitVal = lastItem.unit
    let position = 0.55
    let hasData = true
    const _val = parseFloat(item.value)
    if (isNaN(_val)) {
      hasData = false
    } else {
      rangeItem.forEach((element, index) => {
        const lowVal = parseFloat(element.lowLimit),
          hightVal = parseFloat(element.highLimit)
        if (_val > lowVal && _val < hightVal) {
          position = (index + index + 1) / (2 * rangeItem.length)
        }
      })
    }
    const normalItem = rangeItem.find(
      (rItem) =>
        rItem.indicatorResult.indexOf('正常') !== -1 || rItem.indicatorResult.indexOf('适宜') !== -1
    )
    let text = ``
    if (normalItem) {
      text = `${normalItem.indicatorResult} ${normalItem.lowLimit}${normalItem.unit ?? ''} ~ ${
        normalItem.highLimit
      }${normalItem.unit ?? ''}`
    }
    return { ...item, minVal, maxVal, unitVal, position, hasData, text }
  })
}

// 表格数据
const tableLoading = ref<boolean>(false)
const tableData = ref<any[]>([])
const originTableData = ref<any[]>([])
const getTableData = async (modelId, growthId) => {
  tableLoading.value = true
  tableData.value = []
  const res = await getMonitorIndicatorWithDetail({ modelId, growthId }).catch((err) => {
    tableLoading.value = false
  })
  if (Array.isArray(res)) {
    originTableData.value = res
    indexBtns.value = res.map((item) => ({
      id: item.id,
      label: item.indicatorName
    }))
    if (res.length > 0) {
      selectedBtn.value = res[0].id
      tableData.value = formatTableData(res[0].modelIndicatorElementCardVOList)
    }
  }
  tableLoading.value = false
}

const handleItemHover = (cardItem, rangeItem, offset) => {
  cardItem.text = `${rangeItem.indicatorResult} ${rangeItem.lowLimit}${rangeItem.unit ?? ''}~${
    rangeItem.highLimit
  }${rangeItem.unit ?? ''}`
  cardItem.offset = offset
}

// 响应式状态，用于控制图标旋转
const isRotating = ref(false)
const message = useMessage() // 消息弹窗
const btnLoading = ref(false) // 加载动画

// 点击处理函数
const handleTriggerModelCalculate = () => {
  // 先移除旋转状态
  isRotating.value = false
  nextTick(async () => {
    // 重新触发旋转
    isRotating.value = true

    btnLoading.value = true
    // 调用后台触发计算要素得分;
    const res = await ModelManagementApi.triggerModelCalculate()
    message.success(res)

    getPlotList()

    // 动画结束后停止旋转
    setTimeout(() => {
      isRotating.value = false
    }, 1000) // 1秒后结束旋转（与CSS动画持续时间匹配）
  })
}

// 构造模型周期与栽培要点的chart数据
const buildChartData = (data: any[], growth: string = '', cycle: string = '') => {
  const series = data.map((item) => ({
    name: item.growth,
    value: item.cycle,
    growthId: item.growthId
  }))
  initChart(series, growth, cycle)
}
// 获取周期与栽培要点右侧信息
const cycleInfoList = ref<any[]>([])
const periodList = ref<any[]>([])
const listFirstItem = ref<any[]>([])
const keypointLoading = ref<boolean>(false)
const getCycleInfoList = async (modelId, growthId) => {
  keypointLoading.value = true
  const res = await getModelInfo({ modelId }).catch((err) => {
    keypointLoading.value = false
  })
  if (Array.isArray(res)) {
    cycleInfoList.value = res
    listFirstItem.value = res.shift()
    console.log('🚀 ~ getCycleInfoList ~ firstItem:', listFirstItem.value)
    const curPeriodItem = res.find((_item) => _item.growth === listFirstItem.value.curPeriod)
    periodList.value = res
    buildChartData(res, curPeriodItem.growth, curPeriodItem.cycle)
    if (periodList.value.length > 0) {
      const curGrowthItem = periodList.value.find((_period) => _period.growthId === growthId)
      keyPointList.value = curGrowthItem.child2
      activeGrowthId.value = curGrowthItem.growthId
      if (keyPointList.value.length > 0) {
        selectedKeyPoint.value = keyPointList.value[0].id
      }
    }
  }
  keypointLoading.value = false
}
// 点击右侧时期触发
const activeGrowthId = ref<string>('') // 当前活跃的时期id
const activeGrowth = ref<string>('') // 当前活跃的时期
const handlePeriodClick = (item) => {
  selectedInfo.value = ''
  activeGrowthId.value = item.growthId
  activeGrowth.value = item.growth
  keyPointList.value = item.child2
  if (keyPointList.value.length > 0) {
    selectedKeyPoint.value = keyPointList.value[0].id
  }
  instance.value &&
    instance.value.setOption({
      title: { text: item.growth, subtext: item.cycle + '天' }
    })
}

watch([activeGrowthId, selectedModelId], (newData) => {
  const [growthId, modelId] = newData
  getTableData(modelId, growthId)
})

// 栽培要点
const keyPointList = ref<any[]>([])
const selectedKeyPoint = ref<string>('')
const selectedInfo = ref<string>('')
const handleKeyPointItemClick = (item) => {
  selectedKeyPoint.value = item.id
}
watch([selectedKeyPoint], (val) => {
  const _item = keyPointList.value.find((item) => item.id === val[0])
  selectedInfo.value = _item.itemContent
})

// 饼图
const instance = ref<any>(null)
const initChart = (series: any[], growth: string = '', cycle: string = '') => {
  instance.value = initChartStatic(
    `chart`,
    generatePieOptions({
      title: {
        text: growth,
        subtext: cycle ? `${cycle} 天` : '',
        left: 'center',
        top: '37%',
        textStyle: {
          color: '#252525',
          fontSize: 15
        },
        subtextStyle: {
          color: '#252525',
          fontSize: 15
        }
      },
      legend: { show: false },
      tooltip: { show: false },
      color: ['#59b756', '#009688', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '86%'],
          center: 'center',
          data: series,
          label: {
            position: 'inside',
            formatter: '{b}',
            rich: {
              c: { color: '#c1c1c1', fontSize: 10 },
              d: { color: '#c1c1c1', fontSize: 10 }
            }
          },
          emphasis: { disabled: false },
          itemStyle: { borderWidth: 5, borderColor: '#ffffff' }
        }
      ]
    })
  )
  instance.value &&
    instance.value.on('click', (params) => {
      const { data } = params
      const { growthId, name, value } = data
      instance.value.setOption({
        title: { text: name, subtext: value + '天' }
      })
      const _activePeroid = periodList.value.find((_period) => _period.growthId === growthId)
      handlePeriodClick(_activePeroid)
    })
}
</script>
<template>
  <div class="flex justify-between">
    <el-card :style="{ width: collapsed ? '7rem' : '15rem' }">
      <div
        class="bg-[#009688] py-2 w-full rounded-md text-white text-center cursor-pointer"
        @click="collapsed = !collapsed"
        >{{ collapsed ? '展开' : '折叠' }}</div
      >
      <div
        class="max-h-80vh space-y-3 py-3 overflow-auto mt-2"
        v-loading="plotListLoading"
        v-show="!collapsed"
      >
        <div
          v-for="item in plotList"
          class="shadow-md rounded-2 p-1 overflow-hidden bg-[#f5f5f5] transition-all cursor-pointer hover:bg-[#e5f4f3] hover:text-[#009688]"
          :key="item.id"
          :style="{
            border: selectedPlotId === item.id ? '1px solid #009688' : '1px solid #00000000',
            color: selectedPlotId === item.id ? '#009688' : '#333333'
          }"
          @click="handlePlotClick(item)"
        >
          <div class="w-full h-[6rem] bg-gray">
            <img :src="item.img" alt="" class="w-full h-full object-cover" />
          </div>
          <div class="w-full py-1 text-center">{{ item.name }}</div>
        </div>
      </div>
      <!--  -->
      <div
        class="max-h-80vh space-y-3 py-3 overflow-auto hidden-scrollbar mt-2"
        v-loading="plotListLoading"
        v-show="collapsed"
      >
        <div
          v-for="item in plotList"
          class="shadow-md rounded-2 overflow-hidden bg-[#f5f5f5] transition-all cursor-pointer hover:bg-[#e5f4f3] hover:text-[#009688]"
          :key="item.id"
          :style="{
            border: selectedPlotId === item.id ? '1px solid #009688' : '1px solid #00000000',
            color: selectedPlotId === item.id ? '#009688' : '#333333'
          }"
          @click="handlePlotClick(item)"
        >
          <div class="w-full h-[2rem]  text-center">{{ item.name }} </div>
        </div>
      </div>
    </el-card>
    <div
      class="space-y-2"
      :style="{
        width: `calc(100% - ${collapsed ? '7.5rem' : '15.5rem'})`
      }"
    >
      <el-card>
        <div
          class="flex space-x-[3rem] px-4 box-border min-h-[2.8rem]"
          v-loading="healthValLoading"
        >
          <div v-for="item in healthValList" :key="item.id" class="flex space-x-4">
            <div :class="[item.icon, 'w-[2.6rem] h-[2.6rem] bg-[length:100%_100%]']"></div>
            <div class="flex flex-col space-y-1 text-[.7rem]">
              <div class="text-[1.2rem] art-font">{{ item.value || '暂无数据' }}</div>
              <div class="flex space-x-1">
                <span>{{ item.title }}</span>
                <span>{{ item.weight }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="flex space-x-3" v-loading="modelListLoading">
          <div
            class="bg-[#e5f4f3] rounded-2 flex flex-col items-center justify-center space-y-1 p-3 px-5"
          >
            <div class="art-font text-[#009688]">{{ modelList.length }}</div>
            <div class="text-[.8rem]">模型总数</div>
          </div>
          <div class="grow overflow-auto flex space-x-3">
            <div
              v-for="item in modelList"
              :key="item.id"
              class="flex items-center space-x-2 px-4 py-2 rounded-md shadow-md cursor-pointer"
              :style="{
                border: selectedModelId === item.modelId ? '1px solid #009688' : '1px solid #E5E5E5'
              }"
              @click="handleModelClick(item)"
            >
              <img :src="item.modelImg" alt="" class="w-[3rem] h-[3rem] mr-2 bg-black" />
              <div class="space-y-1">
                <div class="text-[1.1rem]">{{ item.modelName }} </div>
                <div class="flex space-x-1">
                  <div class="text-[.9rem]">{{ item.growth }} :</div>
                  <div class="text-[#009688] text-[.9rem]">{{ item.cycle }}天</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="text-[1rem]">{{ listFirstItem.model }}模型周期与栽培要点</div>
        <div class="flex space-x-2 p-3 pb-0" v-loading="keypointLoading">
          <div id="chart" class="w-[15rem] h-[12rem]"></div>
          <div class="grow w-[calc(100%_-_15.4rem)]">
            <div class="flex justify-between items-center mt-3 px-6 overflow-hidden pb-[25px]">
              <div
                v-for="(ele, idx) in periodList"
                :key="idx"
                class="relative cursor-pointer"
                @click="handlePeriodClick(ele)"
              >
                <div
                  :class="`relative right-1rem ${
                    ele.growthId === activeGrowthId ? 'progress-font-active' : ''
                  }`"
                >
                  <div>{{ ele.growth }}</div>
                  <div class="flex justify-center">{{ ele.cycle }}天</div>
                </div>
                <div
                  :class="[
                    ele.growthId === activeGrowthId ? 'progress-bar-active' : 'progress-bar'
                  ]"
                ></div>
              </div>
            </div>
            <div class="flex mt-2 overflow-auto hidden-scrollbar items-center">
              <div class="flex justify-center w-full">
                <div
                  :class="`px-4 text-nowrap grow text-[#ffffff] select-none cursor-pointer rounded-md ${
                    child.id === selectedKeyPoint ? 'bg-[#009688]' : 'bg-[#f1f1f1] text-black'
                  } text-center py-2`"
                  v-for="(child, flag) in keyPointList"
                  :key="flag"
                  @click="handleKeyPointItemClick(child)"
                  >{{ child.itemName }}</div
                >
              </div>
            </div>
            <div class="px-[1rem] pt-3">{{ selectedInfo }} </div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="text-[1rem]"
          >{{ listFirstItem.model }}{{ activeGrowth || defaultGrowth }}监测指标</div
        >
        <div class="w-full flex justify-center">
          <div class="overflow-hidden rounded-2 flex">
            <div
              class="bg-[#f5f5f5] p-2 px-4 cursor-pointer hover:bg-[#f0f0f0] transition-all select-none"
              v-for="item in indexBtns"
              :key="item.id"
              :style="{
                backgroundColor: selectedBtn === item.id ? '#009688' : '#f5f5f5',
                color: selectedBtn === item.id ? '#fff' : '#000'
              }"
              @click="handleIndexBtnClick(item)"
              >{{ item.label }}</div
            >
          </div>
        </div>
        <div class="p-2 pt-4">
          <el-table
            :data="tableData"
            :stripe="true"
            v-loading="tableLoading"
            :show-overflow-tooltip="false"
            :header-cell-style="{
              fontWeight: 'bold'
            }"
          >
            <el-table-column label="要素名称" align="center" prop="elementName" />
            <el-table-column label="监测指标范围" align="center">
              <template #default="scope">
                <div class="py-3">
                  <div class="flex flex-col items-center space-y-1">
                    <div
                      :style="{ left: `${scope.row.offset ?? 0}rem` }"
                      class="bg-[#666666] text-white rounded-md px-5 py-1 extra-triangle relative top-[-2px]"
                      >{{ scope.row.text }}</div
                    >
                    <div class="flex space-x-[.5rem] items-center">
                      <div class="w-[3rem] text-center"
                        >{{ scope.row.minVal }}{{ scope.row.unitVal }}</div
                      >
                      <div class="flex space-x-[2px] rounded-full overflow-hidden w-[12rem]">
                        <div
                          v-for="(rangeItem, idx) in scope.row.modelIndicatorElementRangeDOList"
                          :key="rangeItem.id"
                          @mouseenter="
                            handleItemHover(
                              scope.row,
                              rangeItem,
                              (6 * (idx * 2 + 1)) /
                                scope.row.modelIndicatorElementRangeDOList.length -
                                6
                            )
                          "
                          :class="`color-bar-${idx + 1} grow w-[${
                            100 / scope.row.modelIndicatorElementRangeDOList.length
                          }%] h-[.6rem]`"
                        ></div>
                      </div>
                      <div class="w-[3rem] text-center line-height-[1rem]"
                        >{{ scope.row.maxVal }}{{ scope.row.unitVal }}</div
                      >
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前值" align="center" prop="value">
              <template #default="scope">
                <span v-if="scope.row.value !== null && scope.row.value !== undefined">
                  {{ scope.row.value }}
                </span>
                <span v-else> 暂无数据 </span>
              </template>
            </el-table-column>

            <el-table-column label="健康评估" align="center" prop="assess">
              <template #default="scope">
                <span v-if="scope.row.assess !== null && scope.row.assess !== undefined">
                  {{ scope.row.assess }}
                </span>
                <span v-else> 暂无数据 </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <div class="fixed floating-refresh-button" @click="handleTriggerModelCalculate">
      <!--      <el-icon :class="{ rotate: isRotating }" class="icon">-->
      <!--        <RefreshRight />-->
      <!--      </el-icon>-->
      <img :src="execute" alt="执行同步数据"  class="w-6 h-6"/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.floating-refresh-button {
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #009688;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1000;
}

.floating-refresh-button:hover {
  background-color: #61c4b4; /* 鼠标悬停时的按钮颜色 */
}

.icon {
  font-size: 24px;
}

@for $i from 1 through 5 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}

.tool-bar-1 {
  background: linear-gradient(to right, #06d41d, #4abd14);
}
.tool-bar-2 {
  background: linear-gradient(to right, #4abd14, #9ba30a);
}
.tool-bar-3 {
  background: linear-gradient(to right, #9ba30a, #e58a01);
}
.tool-bar-4 {
  background: linear-gradient(to right, #e58a01, #e54901);
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

.extra-triangle {
  position: relative;
}

.extra-triangle::after {
  content: '';
  position: absolute;
  left: calc(50% - 5px);
  top: 100%;
  width: 0;
  height: 0;
  border: 10px solid #666666;
  border-color: #666666 transparent transparent transparent;
}

.progress-bar-active {
  position: absolute;
  left: 0px;
  bottom: -15px;
  width: 14000px;
  height: 2px;
  background-color: #b7b7b7;
}
.progress-font-active {
  color: #009688;
  font-weight: bold;
}
.progress-bar-active::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #009688;
  border-radius: 5px;
  position: absolute;
  top: -4px;
}

.progress-bar {
  position: absolute;
  left: 0px;
  bottom: -15px;
  width: 1400px;
  height: 2px;
  background-color: #b7b7b7;
}

.progress-bar::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #009688;
  border-radius: 5px;
  position: absolute;
  top: -4px;
}
</style>
