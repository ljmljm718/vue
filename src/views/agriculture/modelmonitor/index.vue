<template>
  <div class="flex justify-between" v-loading="loading">
    <div class="flex flex-shrink:0 w-[12rem]">
      <div class="flex flex-col space-y-3 p-2 w-[10rem] bg-white h-[100vh] overflow-y-auto">
        <div
          v-for="(item, index) in filteredLeftList"
          :key="index"
          :class="`flex flex-col space-y-2 p-1 bg-[#f1f1f1] rounded-2 shadow-md ${
            activeId === item.id ? 'font-bold' : ''
          }`"
          @click="getmodelList(item.id)"
        >
          <img :src="item.img" alt="" class="w-full" />
          <div class="w-full bg-[#f1f1f1] text-center py-2">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="space-y-3 grow" style="width: calc(100% - 12.2rem)">
      <!-- 评分 -->
      <div class="flex bg-white p-2 min-h-[4rem]  ">
        <div
          v-for="(item, index) in healthValueData"
          :key="index"
          class="flex space-x-3 justify-center items-center px-2 min-w-[8rem]"
        >
          <div :class="[item.imgList, 'w-[2rem] h-[2rem]']"  style="background-size: 100% 100%"></div>
          <div class=" flex flex-col space-y-1 text-[.7rem]">
            <div class="text-[.8rem]">{{ item.value }}</div>
            <div class="flex space-x-1 font-light">
              <span>{{ item.title }}</span>
              <span>{{ item.weight }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white p-2 min-h-[4rem] overflow-x-auto px-2">
        <div class="flex space-x-3">
          <div class="bg-[#e5f4f3] p-3 flex flex-col justify-center items-center min-w-[5rem]">
            <div class="text-[#009688] text-[1rem] pb-1">{{ modelList.length }}</div>
            <div class="text-[13px]">模型总数</div>
          </div>
          <div
            v-for="(item, index) in modelList"
            :key="index"
            :class="`flex space-x-1 items-center justify-center border-solid border-2 border-[#E5E5E5] rounded-md p-2 !px-3 min-w-[12rem] ${
              activeModelId === item.modelId ? 'shadow-md font-bold ' : ''
            }`"
            @click="selectModel(item.modelId), handleFilterModelClick(item)"
          >
            <img :src="item.modelImg" alt="" class="w-[3rem] h-[3rem] mr-2 bg-black" />
            <div>
              <div class="text-[1.1rem]">{{ item.modelName }} </div>
              <div class="flex space-x-1">
                <div class="text-[.9rem]">{{ item.growth }} :</div>
                <div class="text-[#009688] text-[.9rem]">{{ item.cycle }}天</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-x-3 bg-white p-2 min-h-[4rem]">
        <div class="pl-2 font-bold py-1 pb-3" v-show="Array.isArray(res) && res.length > 0"
          >{{ Array.isArray(res) && res.length > 0 && res[0]?.model }}模型周期与栽培要点</div
        >
        <div class="flex space-x-4">
          <div id="chart" class="w-[15rem] h-[12rem]"></div>
          <div class="grow" style="width: calc(100% - 15.4rem)">
            <div class="flex justify-between items-center mt-3 px-6 overflow-hidden pb-[25px]">
              <div
                v-for="(ele, idx) in filteredModelList"
                :key="idx"
                class="relative"
                @click="handleFilterModelClick(ele), console.log('1')"
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
                    child.id === topSelectedBtn ? 'bg-[#009688]' : 'bg-[#f1f1f1] text-black'
                  } text-center py-2`"
                  v-for="(child, flag) in newItemButtonList"
                  :key="flag"
                  @click="handleItemClick(child)"
                  >{{ child.itemName }}</div
                >
              </div>
            </div>
            <div class="px-[1rem] pt-3">{{ selectedInfo }} </div>
          </div>
        </div>
      </div>
      <div class="space-x-3 bg-white p-2 min-h-[4rem]">
        <div class="flex justify-between items-center">
          <div class="pl-2 font-bold py-1 pb-3" v-show="Array.isArray(res) && res.length > 0"
            >{{
              Array.isArray(res) && res.length > 0 && res[0]?.model + res[0]?.curPeriod
            }}监测指标</div
          >
          <div
            class="flex relative bg-[#f5f5f5] rounded-2 overflow-hidden"
            :style="{ right: 'calc(50% - 10rem)' }"
          >
            <div
              v-for="item in tableBtns"
              :key="item.id"
              :class="[
                'text-[12px] p-2 px-4 transition  ',
                selectedBtn === item.id ? '!bg-[#009688] text-[#fff]' : ''
              ]"
              @click=";(selectedBtn = item.id), getFilteredTableData(item.id)"
              >{{ item.value }}</div
            >
          </div>
        </div>
        <div class="mt-2">
          <el-table
            :data="tableData"
            :stripe="true"
            v-loading="loading"
            :show-overflow-tooltip="true"
            :header-cell-style="{
              backgroundColor: '#f5f7fa',
              color: '#009688',
              fontWeight: 'bold'
            }"
          >
            <el-table-column label="要素名称" align="center" prop="elementName" />
            <el-table-column label="监测指标范围" align="center">
              <template #default="scope">
                <div class="py-3">
                  <div class="flex flex-col items-center">
                    <div class="w-full relative flex px-[2rem]">
                      <div
                        class="bg-[#666666] text-[#fff] rounded-2 extra-triangle mb-2 px-2 absolute left-4 inline-block"
                        :style="`left: calc(${scope.row.position * 100}% - 2rem)`"
                      >
                        <template v-if="scope.row.hasData">
                          {{ scope.row.assess }} ({{ scope.row.value }}{{ scope.row.unitVal }})
                        </template>
                        <template v-else> 暂无数据 </template>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-[2.5rem] text-center">
                        <span>{{ scope.row.minVal }}</span>
                        <span>{{ scope.row.unitVal }}</span>
                      </div>
                      <div class="flex rounded-[4px] overflow-hidden space-x-.5 w-[10rem]">
                        <div
                          v-for="(item, index) in scope.row.modelIndicatorElementRangeDOList"
                          :key="item.id"
                          :class="`w-[${(
                            (1 * 10) /
                            scope.row.modelIndicatorElementRangeDOList.length
                          ).toFixed(0)}rem]`"
                        >
                          <div :class="`h-[8px] w-full tool-bar-${index + 1}`"></div>
                        </div>
                      </div>
                      <div class="w-[2.5rem] text-center">
                        <span>{{ scope.row.maxVal }}</span>
                        <span>{{ scope.row.unitVal }}</span>
                      </div>
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
      </div>
    </div>
    <div class="floating-refresh-button" @click="handleTriggerModelCalculate">
      <el-icon :class="{ rotate: isRotating }" class="icon">
        <RefreshRight />
      </el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  baidiParkInfo,
  getModelByParkId,
  getModelInfo,
  getMonitorIndicatorWithDetail,
  getModelMonitor
} from './api'
import { initChartStatic, generatePieOptions } from '@/utils/bigscreenTool/index'
import { ModelManagementApi, ModelManagementVO } from '@/api/agriculture/modelmanagement'

// 左侧基地列表
const filteredLeftList = ref<any[]>([])
const getleftList = async () => {
  const leftList = await baidiParkInfo()
  if (!Array.isArray(leftList)) return
  filteredLeftList.value = leftList.filter((item) => item.img != null)
  if (filteredLeftList.value.length > 0) {
    getmodelList(filteredLeftList.value[0].id)
  }
}

//评分列表
const healthValueData = ref<any[]>([])
const getHealthValueData = async (modelId, batch) => {
  const healthDataList = await getModelMonitor({ modelId, batch })
  healthValueData.value = healthDataList.map((item, index) => ({
    title: item.title,
    value: item.value ,
    weight: item.weight ? `(${item.weight})` : '',
    imgList: `icon-${(index %5)+ 1}`
  }))
}
getHealthValueData('MXGL20240806000002', '202407221511110884')
// 模型列表
const modelList = ref<any[]>([])
const activeId = ref<string | null>(null)
const getmodelList = async (parkId: string) => {
  const result = await getModelByParkId({ parkId })
  if (!Array.isArray(result)) return
  modelList.value = result
  if (result.length <= 0) return
  activeId.value = parkId
  selectModel(modelList.value[0].modelId)
}

const activeGrowthId = ref<string>('')
const handleFilterModelClick = (item) => {
  activeGrowth.value = item.growth
  selectedInfo.value = ''
  activeGrowthId.value = item.growthId
  const { child2 } = item
  if (Array.isArray(child2)) {
    newItemButtonList.value = child2
  }
  if (Array.isArray(newItemButtonList.value) && newItemButtonList.value.length > 0) {
    handleItemClick(newItemButtonList.value[0])
  }
}

const res = ref<any[]>([])
const selectedModel = ref<any[]>([])
const filteredModelList = ref<any[]>([])
const activeGrowth = ref<string>('')
const activeModelId = ref<string>('')
const selectModel = async (modelId) => {
  activeModelId.value = modelId

  //getTableData(activeModelId.value,growthId)
  res.value = await getModelInfo({ modelId })
  selectedModel.value = res.value
  filterModel(res.value)
}

const selectedInfo = ref<string>('')
const newItemButtonList = ref<any[]>([])
const handleItemClick = (item) => {
  console.log('🚀 ~ handleItemClick ~ item:', item)

  topSelectedBtn.value = item.id
  selectedInfo.value = item.itemContent || ''
}

const filterModel = (resItem) => {
  filteredModelList.value = resItem.filter((item, index) => index !== 0)
  nextTick(() => {
    if (Array.isArray(resItem) && resItem.length > 0) {
      const firstItemPeriod = resItem[0].curPeriod
      if (!firstItemPeriod) return
      initChart(filteredModelList.value, firstItemPeriod)
      const [firstModelItem] = filteredModelList.value
      if (firstModelItem) handleFilterModelClick(firstModelItem)
      console.log('🚀 ~ nextTick ~ firstItemPeriod:', firstItemPeriod)
      console.log('🚀 ~ nextTick ~ filteredModelList.value:', filteredModelList.value)
    }
  })

  const extractIteContent = (filteredModelList) => {
    newItemButtonList.value = filteredModelList.value.flatMap((parent) =>
      parent.child2.map(({ itemName, itemContent, id }) => ({ itemName, itemContent, id }))
    )
  }
  extractIteContent(filteredModelList)
}

const topSelectedBtn = ref<string>('sfgy')

// 饼图
const initChart = (series: any[], period: string) => {
  const _activePeriod = series.find((item) => item.growth === period)
  activeGrowth.value = _activePeriod.growth
  activeGrowthId.value = _activePeriod.growthId

  const instance = initChartStatic(
    `chart`,
    generatePieOptions({
      title: {
        text: _activePeriod.growth ?? '',
        subtext: _activePeriod.cycle ? _activePeriod.cycle + '天' : '',
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
          radius: ['50%', '100%'],
          center: 'center',
          data: series.map((item) => ({
            name: item.growth,
            value: item.cycle,
            growthId: item.growthId
          })),
          label: {
            position: 'inside',
            formatter: '{b}',
            rich: {
              c: { color: '#c1c1c1', fontSize: 10 },
              d: { color: '#c1c1c1', fontSize: 10 }
            }
          },
          emphasis: { disabled: true },
          itemStyle: { borderWidth: 5, borderColor: '#ffffff' }
        }
      ]
    })
  )
  instance &&
    instance.on('click', (params) => {
      activeGrowth.value = params.name
      activeGrowthId.value = params.data.growthId
      instance &&
        instance.setOption({
          title: {
            text: params.name,
            subtext: params.value + '天'
          }
        })
    })
}

const selectedBtn = ref<string>('qx')

const tableData = ref<any[]>([])

const monitorIndicatorList = ref<any[]>([])
const tableBtns = ref<any[]>([])
const getTableData = async (modelId, growthId) => {
  loading.value = true
  monitorIndicatorList.value = await getMonitorIndicatorWithDetail({ modelId, growthId })
  tableBtns.value = monitorIndicatorList.value.map((item, index) => ({
    key: index,
    value: item.indicatorName,
    id: item.id
  }))
  if (Array.isArray(tableBtns.value) && tableBtns.value.length > 0) {
    selectedBtn.value = tableBtns.value[0].id
  }
  getFilteredTableData(selectedBtn.value)
  loading.value = false
}

const getFilteredTableData = (selectedBtn) => {
  const filtered_res = monitorIndicatorList.value.find(({ id }) => id === selectedBtn)
  console.log('🚀 ~ getFilteredTableData ~ filtered_res:', filtered_res)
  if (filtered_res === undefined) {
    tableData.value = []
  }
  if (!filtered_res?.modelIndicatorElementCardVOList) return
  if (Array.isArray(filtered_res.modelIndicatorElementCardVOList)) {
    tableData.value = filtered_res.modelIndicatorElementCardVOList.map((item) => {
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

      return { ...item, minVal, maxVal, unitVal, position, hasData }
    })
  }
}

// 响应式状态，用于控制图标旋转
const isRotating = ref(false)
const message = useMessage() // 消息弹窗
const loading = ref(false) // 加载动画

// 点击处理函数
const handleTriggerModelCalculate = () => {
  // 先移除旋转状态
  isRotating.value = false

  // 让浏览器完成 DOM 更新以确保类被移除
  requestAnimationFrame(async () => {
    // 重新触发旋转
    isRotating.value = true

    loading.value = true

    // 调用后台触发计算要素得分;
    const res = await ModelManagementApi.triggerModelCalculate()
    message.success(res)

    // todo (zhangyu26, 2024-08-12 17:40:00) : 重新加载页面

    await init()

    // 动画结束后停止旋转
    setTimeout(() => {
      isRotating.value = false
    }, 1000) // 1秒后结束旋转（与CSS动画持续时间匹配）
  })
}

//监听：
watch([activeModelId, activeGrowthId], ([newModelId, newGrowthId]) => {
  if (newModelId || newGrowthId) {
    getTableData(newModelId, newGrowthId)
  }
})

const init = async () => {
  loading.value = true
  await getleftList()
  // await getmodelList('1787680115895037952')
  // await getTableData('MXGL20240731000001', '1813742898268782592')
  loading.value = false
}
onMounted(() => init())
</script>

<style lang="scss" scoped>
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

.floating-refresh-button {
  position: fixed;
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
  transition: background-color 0.3s ease;
}

.floating-refresh-button:hover {
  background-color: #61c4b4; /* 鼠标悬停时的按钮颜色 */
}

.icon {
  font-size: 24px;
}

.rotate {
  animation: rotate-animation 1s linear;
}

@keyframes rotate-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@for $i from 1 through 5 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}
</style>
