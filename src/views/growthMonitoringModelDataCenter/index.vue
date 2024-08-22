<script lang="tsx">
/** 生长监测模型数据中心大屏页面 */ 

import { defineComponent, ref, onMounted } from "vue"

/** 引入大屏组件 */
import BigscreenBuilder from "@/components/BigscreenBuilder"
const {
  BigscreenAdapter,
  BigscreenContainer,
} = BigscreenBuilder

/** echarts相关 */
import * as echarts from 'echarts'

/** 引入其他组件 */
import Header from "./components/Header.vue"
import Card from "./components/Card.vue"
import NumberShow from "./components/NumberShow.vue"
import ModelIcon from "./components/ModelIcon.vue"

/** 引入请求接口 */
import { getBase, getModel, getNum, getPlot, getCycle, getIndicator, updateModelEnableStatus } from "./api"

/** 引入图片 */
import bg from "./assets/bg.png"
import bgFish from './assets/bg-fish.png'
import bgDuck from './assets/bg-duck.png'

export default defineComponent({
  components: {
    Header
  },
  setup() {
    
    const imgBase = "/src/views/growthMonitoringModelDataCenter/assets"
    const message = useMessage() // 消息弹窗

    /** Header组件需要的属性(heardBg不应该传进去) */
    const headerHeight = 100
    const titleHeight = 30
    const titleWidth = 386
    const headerBg = `${ imgBase }/header/header-bg.png`
    const title = `${ imgBase }/header/title.png`

    /**
     * 基地列表相关
     * baseList      基地列表
     * base          当前选择的基地
    */
    const baseList = ref<Array<any>>([])
    const base = ref()

    const getBaseList = async () => {
      baseList.value = []
      const res = await getBase()
      res.forEach((element: any) => {
        baseList.value.push({id: element.id, name: element.name})
      })
      base.value = baseList.value[0]
    }

    /**
     * 品种数 模型数
     * varietyNumIcon       品种的图标
     * modelNumIcon         模型的图标
     * nVariety             品种数
     * nModel               模型数
     */
    const varietyNumIcon = `${ imgBase }/variety-num.png`
    const modelNumIcon = `${ imgBase }/model-num.png`
    const nVariety = ref()
    const nModel = ref()

    const getNums = async () => {
      const params = {parkId: base.value.id}
      const res = await getNum(params)
      nVariety.value = res["品种数"]
      nModel.value = res["模型数"]
    }

    /**
     * 模型列表相关
     * modelList        模型列表
     * curVarietyName   品种名 用来判断是否展示模型图片
     * 
     * 每一项新增两个属性 activated表示当前模型是否被选中 
     * 
     * key用来让表示单个模型的组件重新渲染
     * key设置为模型id字符串 每次选择模型时在key拼接字符串"1"
     * 
     * 改变模型时重新查询周期信息
     */
    const modelList = ref<Array<any>>([])
    let curModelId = ""
    const curVarietyName = ref("")
    const bgImage = ref(bg)

    const getModelList = async () => {
      const params = {parkId: base.value.id}
      const res = await getModel(params)
      // console.log("ModelList", res)
      modelList.value = res.map((item) => {
        return {
          ...item,
          activated: false,
          key: item.modelId,
        }
      })
      modelList.value[0].activated = true
      changeBackground(modelList.value[0])
      curModelId = modelList.value[0].modelId
      curVarietyName.value = modelList.value[0].varietyName
    }

    const changeModel = async (idx) => {
      modelList.value.forEach((element, index) => {
        if (idx === index) {
          element.activated = true
          curModelId = element.modelId
          curVarietyName.value = element.varietyName
          changeBackground(element)
          if (chartInstance) {
            chartInstance.dispose()
            chartInstance = null
            chartDom = null
          }
        } else {
          element.activated = false
        }
        element.key = `${ element.key }1`
      });
      await getCycleList()
    }

    const changeBackground = (item) => {
      let str = item.varietyName
      if (str.includes("鱼")) {
        bgImage.value = bgFish
      } else if (str.includes("鸭")) {
        bgImage.value = bgDuck
      } else {
        bgImage.value = bg
      }
    }

    /**
     * 地块监控相关
     * plotList          地块监控列表
     * 
     * modelName表示模型名称 暂时轮流使用所有模型名称
     * enable表示是否启用 暂时全部设置为true
    */
    const plotList = ref<Array<any>>([])

    const getPlotList = async () => {
      const params = { parkId: base.value.id }
      const res = await getPlot(params)
      plotList.value = res.map( (item) => {
        return item
      })
      // console.log("plotList", plotList.value)
    }

    /** 修改品种模型绑定状态 */
    const handleStatusChange = async (row) => {
      try {
        // 修改状态的二次确认
        const text = row.isEnableModel ? '停绑' : '绑定'
        await message.confirm('确认要' + text + '当前模型吗?')
        // 发起修改状态
        await updateModelEnableStatus(row.cropBaseId, !row.isEnableModel)
        // 刷新列表
        await getPlotList()
      } catch {
        // 取消后，进行恢复按钮
        // row.isEnableModel = row.isEnableModel ? true : false
      }
    }

    const router = useRouter()
    const handleRoute = (item) => {
      router.push({
        path:"/bigscreenModel",
        query:{
          modelName: item.modelName,
          growthId: item.growthId,
          plotId:item.plotId,
          modelId: item.modelId,
          batchCode:item.batchCode
        }
      })
    }
    /**
     * 周期/物候期 相关
     * curPeriod           当前周期名称
     * curRealPeriod       当前周期名称(后端传来的curPeriod属性)
     * cycleNameList       周期名称列表 包括是否选中的标志selected
     * curItem             当前选中的周期在cycleNameList的下标
     * curTips             当前周期的注意事项
     * curCycle            当前周期时长
     * cycleMap            存放周期时长和注意事项的map key是周期名称
     * curCropCode         当前周期对应的周期id
     * offsetLeft          周期列表的移动距离
     * 
     * 清空当前列表 然后初始化上述指标
     * 
     * curItem记录当前点亮的周期 当点亮其他周期时 熄灭curItem 并将点亮的周期设置为curItem
     * 点亮其他周期时需要重新查询指标
     */
    const curPeriod = ref("")
    const cycleNameList = ref<Array<any>>([])
    let curItem = 0
    const curTips = ref<Array<any>>([])
    const curCycle = ref(0)
    const cycleMap = ref(new Map())
    let curCropCode = ""
    const curRealPeriod = ref("")
    const offsetLeft = ref(0);

    const getCycleList = async () => {
      cycleNameList.value = []

      if (curModelId) {
        const params = { modelId: curModelId }
        const res = await getCycle(params)
        // console.log("Cycle", res)

        curPeriod.value = res[0].curPeriod
        curRealPeriod.value = res[0].curPeriod

        res.map((item, index) => {
          if (index) {
            cycleMap.value.set(item.growth, {cycle: item.cycle, growthId: item.growthId, tips: item.child2, imgId: item.imgId})

            if (curPeriod.value === item.growth) {
              cycleNameList.value.push({growth: item.growth, selected: true})
              curCropCode = item.growthId
              curItem = index - 1
            } else {
              cycleNameList.value.push({growth: item.growth, selected: false})
            }
          }
        })
        curTips.value = cycleMap.value.get(curPeriod.value).tips
        curCycle.value = cycleMap.value.get(curPeriod.value).cycle

        // 初始化周期列表的位置
        offsetLeft.value = 0
        let tmp = curItem
        curItem = 2
        cycleListChange(tmp)
        curItem = tmp
      }
      await getIndicatorList()
    }

    // 处理周期列表移动
    const cycleListChange = (index) => {
      if (cycleNameList.value.length > 5) {
        offsetLeft.value += (curItem - index) * 93 * 2;
      }
    }

    // 右箭头周期列表移动
    const rightArrowClick = () => {
      if (cycleNameList.value.length - 1 > curItem) {
        handleClick(curItem + 1)
      }
    }

    // 左箭头周期列表移动
    const leftArrowClick = () => {
      if (0 < curItem) {
        handleClick(curItem - 1)
      }
    }

    const handleClick = async (index) => {
      cycleListChange(index)

      cycleNameList.value[curItem].selected = false
      cycleNameList.value[index].selected = true
      let tmp = curItem
      curItem = index
      
      curPeriod.value = cycleNameList.value[curItem].growth
      curTips.value = cycleMap.value.get(curPeriod.value).tips
      curCycle.value = cycleMap.value.get(curPeriod.value).cycle
      curCropCode = cycleMap.value.get(curPeriod.value).growthId

      if (tmp != curItem)
        await getIndicatorList()
    }

    /**
     * 指标 模型要素 相关
     * indicatorList         指标名称列表 包含是否被选中的标志selected
     * indicatorNames        指标名称列表 只包含名称字符串 用来排除重复添加相同名称的指标
     * curIndicatorIndex     当前选中的指标在indicatorList的下标
     * factorMap             从指标名称到模型要素数据的map
     * curFactor             存放当前的模型要素数据
     * factorInfoMap         从要素名称到要素信息的map
     * curFactorData         当前echarts图上选择的要素信息列表
     * 
     * 指标切换时 需要更新模型要素 设置option
     */
    const indicatorList = ref<Array<any>>([])
    let indicatorNames = []
    let curIndicatorIndex = 0
    let factorMap = new Map()
    const curFactor = ref<Map<any, any>>(new Map())
    let chartDom = null
    let chartInstance = null
    const curFactorData = ref<Array<any>>([])

    const initChartStatic = (id = '', option = {}) => {
      if (!id) return

      const chart = document.getElementById(id)
      const chartInstance = echarts.init(chart, 'default')
      chartInstance.setOption(option, true, true)
      window.addEventListener("resize", () => {
          setTimeout(() => {
              chartInstance && chartInstance.resize()
          }, 10)
      })

      return { chartDom: chart, chartInstance: chartInstance}
    }

    const initOption = () => {
      // console.log("curFactor", curFactor.value)
      // console.log("curFactorData", curFactorData.value)
      if (curFactor.value.size) {
        let indicatorData = []
        let percentages = []
        let totalPer = 0
        curFactor.value.forEach((value, key) => {
          indicatorData.push({ name: key, max: 100})
          let curPer = Number(value.weight.replace("%", ""))
          percentages.push(curPer)
          totalPer += curPer
        })
        if ( 100 > totalPer) {
          indicatorData.push({ name: "其他", max: 100})
          percentages.push(100 - totalPer)
        }
        let labelPos = "top"
        if (indicatorData.length < 3) {
          labelPos = "right"
        }
        const option = {
          color: [
            '#1DFFFF',
          ],
          tooltip:{
            valueFormatter: (params) => {
              return `${ params }%`
            },
            borderWidth: 3,
          },
          radar: {
            nameGap: 10,
            triggerEvent: true,
            indicator: indicatorData,
            axisName: {
              color: '#35DAD2',
              fontSize: "14px"
            },
            axisLine: {
              lineStyle: {
                color: '#616161'
              }
            },
            splitArea: {
              areaStyle: {
                color: '#172c37'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#435B63'
              }
            },
          },
          series: [
            {
              type: 'radar',
              name: indicatorList.value[curIndicatorIndex].name,
              data: [
                {
                  value: percentages,
                  symbol: "circle",
                  symbolSize: 12,
                  label: {
                    show: true,
                    color: "#fff",
                    fontSize: 18,
                    position: labelPos,
                    formatter: (params) => {
                      return `${ params.value }%`
                    }
                  },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                          offset: 0.25, color: "rgba(53, 218, 210, 0.25)"
                      }, {
                          offset: 0.91, color: 'rgba(29, 255, 255, 0.5)'
                      }],
                    }
                  }
                }
              ]
            }
          ]
        }
        if (indicatorData.length === 3) {
          option.radar = { ...option.radar, ...{radius: "85%", center: ["50%", "60%"]}}
        }
        
        if (chartDom && chartInstance) {
          // console.log("option", option)
          chartInstance.setOption(option, true, true)
        } else {
          let tmp = initChartStatic("chart", option)
          chartDom = tmp.chartDom
          chartInstance = tmp.chartInstance

          // 雷达图点击名称的监听事件
          chartInstance.on("click", "radar" ,(params) => {
            if ("其他" !== params.name) {
              curFactorData.value = curFactor.value.get(params.name).modelIndicatorElementRangeDOList
            } else {
              curFactorData.value = []
            }
          })
          chartInstance.setOption(option, true, true)
        }
      }
    }

    const getIndicatorList = async () => {
      indicatorList.value = []
      indicatorNames = []

      if (curCropCode) {
        const params = { modelId: curModelId, growthId: curCropCode }
        // console.log("getIndicator params", params)
        const res = await getIndicator(params)
        // console.log("Indicator", res)

        if (res.length) {
          res.map((item) => {
            if (!indicatorNames.includes(item.indicatorName)) {
              indicatorList.value.push({name: item.indicatorName, selected: false})
              indicatorNames.push(item.indicatorName)
              let factorInfoMap = new Map()
              if (item.modelIndicatorElementCardVOList.length) {
                item.modelIndicatorElementCardVOList.forEach((ele) => {
                  factorInfoMap.set(ele.elementName, ele)
                })
              } else {
                curFactor.value = new Map()
                curFactorData.value = []
              }
              factorMap.set(item.indicatorName, factorInfoMap)
            }
          })

          indicatorList.value[0].selected = true
          curIndicatorIndex = 0
          curFactor.value = factorMap.get(indicatorList.value[0].name)
          initOption()
          if (curFactor.value.size) {
            let tmpIter = curFactor.value.values()
            curFactorData.value = tmpIter.next().value.modelIndicatorElementRangeDOList
          } else {
            curFactorData.value = []
          }
        } else {
          curFactor.value = new Map()
          curFactorData.value = []
        }
      } else {
        curFactor.value = new Map()
        curFactorData.value = []
      }     
    }

    const handleIndicatorClick = async (index) => {
      // console.log("handleIndicatorClick", index, curIndicatorIndex, indicatorList.value)
      indicatorList.value[curIndicatorIndex].selected = false
      indicatorList.value[index].selected = true
      let tmp = curIndicatorIndex
      curIndicatorIndex = index

      if (!(tmp === curIndicatorIndex)) {
        curFactor.value = factorMap.get(indicatorList.value[curIndicatorIndex].name)
        if (curFactor.value.size) {
          let tmpIter = curFactor.value.values()
          curFactorData.value = tmpIter.next().value.modelIndicatorElementRangeDOList
        } else {
          curFactorData.value = []
        }
        initOption()
      }
    }

    const handleResize = () => {
      // 设置屏幕宽度和高度为CSS变量
      document.documentElement.style.setProperty('--growth-monitoring-model-datacenter-screen-width', `${ window.innerWidth }px`);
      document.documentElement.style.setProperty('--growth-monitoring-model-datacenter-screen-height', `${ window.innerHeight }px`);
    }

    /**
     * 渲染页面
     */
    onMounted(async () => {
      await getBaseList()
      await getNums()
      await getModelList()
      await getPlotList()
      await getCycleList()
      // await getIndicatorList()
      handleResize()
      window.addEventListener("resize", handleResize)
    })

    return () => (
      <div class="bg-[#0B2131] w-full h-full select-none">
        <BigscreenAdapter>
          <BigscreenContainer backgroundImage={ bgImage.value } key={ bgImage.value } style="background-color: transparent;">
            {/** 头部 */}
            <Header 
              height={ headerHeight } 
              bgImg={ headerBg }
              title={ title }
              titleHeight={ titleHeight }
              titleWidth={ titleWidth }
            >
            </Header>
            {/** 内容 */}
            <div class="w-[1880px] h-[947px] bg-transparent px-[20px] pt-[13px] pb-[20px] flex">
              {/** 左 */}
              <div class="w-[400px] h-full grid grid-cols-1 content-between">
                <Card 
                  height={ 280 }
                  titleText="模型类型"
                  cardWidth={ 400 }
                  cardHeight={ 230 }
                >
                  <div class="w-full h-[200px] flex flex-wrap justify-center content-between py-[15px]">
                    <NumberShow
                      iconImg={ varietyNumIcon }
                      numName="品种数"
                      numAmount={ nVariety.value }
                      numUnit="种"
                    >
                    </NumberShow>
                    <NumberShow
                      iconImg={ modelNumIcon }
                      numName="模型数"
                      numAmount={ nModel.value }
                      numUnit="个"
                    >
                    </NumberShow>
                  </div> 
                </Card>
                <Card 
                  height={ 280 }
                  titleText="品种模型"
                  cardWidth={ 400 }
                  cardHeight={ 230 }
                >
                  <el-scrollbar>
                    <div class="grid grid-cols-2 gap-3 justify-items-center cursor-pointer pt-[10px]">
                      {
                        modelList.value.map((item, index) => (
                          <ModelIcon 
                            modelName={ item.modelName }
                            activated={ item.activated }
                            modelImg={ item.modelImg }
                            key={ item.key }
                            onClick={ () => { changeModel(index) } }
                          >
                          </ModelIcon>
                        ))
                      }
                    </div>
                  </el-scrollbar>
                </Card>
                <Card
                  height={ 345 }
                  titleText="地块监测"
                  cardWidth={ 400 }
                  cardHeight={ 292 }
                  showSelect={ true }
                  v-slots={{
                    selector: () => {
                      return (
                        <el-select
                          id="base-select"
                          class="plot-selector"
                          v-model={ base.value }
                          value-key="id"
                          style={`background-image: url(${ imgBase }/select-bg.png); background-size: 100% 100%; width: 200px; height: 24px;`}
                          popper-class="growth-monitoring-model-datacenter-popper"
                          onChange={ () => { getPlotList() } }
                        >
                          {
                            baseList.value.map(item => (
                              <el-option key={ item.id } label={item.name} value={ item }>
                              </el-option>
                            ))
                          }
                        </el-select>
                      )
                    }
                  }}
                >
                  <el-scrollbar>
                    <div class="grid grid-cols-2 gap-3 justify-items-center">
                      {/** 单个卡片 */}
                      {
                        plotList.value.map((item) => (
                          <div class="w-full h-[130px] mb-[10px]">
                            <div 
                              style={`background-image: url(${ item.modelImg }); background-size: contain; background-position: center; background-repeat: no-repeat;`}
                              class="w-full h-[100px] relative cursor-pointer box-border border border-solid border-[#435B63]"
                              onClick={()=>{ handleRoute(item) }}
                            >
                              <div 
                                class="absolute top-0 left-0 h-[20px] leading-[20px] text-[12px] px-[5px]"
                                style="background-color: rgba(0, 0, 0, 0.659);"
                              >
                                { item.modelName }
                              </div>
                            </div>
                            <div class="flex justify-between mt-[10px] px-[10px]">
                              <div>{ item.plotName }</div>
                              <div>
                              {
                                item.isEnableModel ? (
                                  <el-button
                                    style="color: #35DAD2; border: 1px solid #35DAD2; background-color: transparent;"
                                    round
                                    type="success"
                                    onClick={ () => { handleStatusChange(item) } }
                                  >
                                    <el-icon><CircleCheck /></el-icon>
                                    <span>启用</span>
                                  </el-button>
                                ) : (
                                  <el-button
                                    style="color: #435B63; border: 1px solid #435B63; background-color: transparent;"
                                    round
                                    type="danger"
                                    onClick={ () => { handleStatusChange(item) } }
                                  >
                                    <el-icon><CircleClose /></el-icon>
                                    <span>禁用</span>
                                  </el-button>
                                )
                              }
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </el-scrollbar>
                </Card>
              </div>
              {/** 中 */}
              <div class="grow h-full px-[20px] grid grid-cols-1 content-end relative">
                {/** 周期列表 */}
                <div class="w-[1032px] h-[120px] absolute top-[0px] mx-[20px] mt-[30px] flex justify-center flex-wrap content-center">
                  {
                    cycleNameList.value.length < 6 ? (
                      /** 
                       * 周期数不足5个 不展示最左和最右的箭头 整体剧中 
                       * 指向当前展示周期的指针跟随选中的周期
                       */
                      <div class="w-full flex">
                        {/** 最左箭头 */}
                        <div 
                          class="cycle-item cursor-pointer p-[15px] box-border"
                          onClick={ () => {leftArrowClick()} }
                        >
                          <div class={0 < curItem ? "left-arrow" : "left-arrow-disable"}></div>
                        </div>
                        <div class="w-[837px] h-[100px] flex justify-center">
                          {
                            cycleNameList.value.map((e, i, arr) => (
                              <div class="flex">
                                {/** 周期名称展示 */}
                                <div 
                                  class={ i === curItem ? "cycle-item chosen-cycle relative" : (e.growth === curRealPeriod.value ? "cycle-item cur-cycle relative" : "cycle-item normal-cycle relative") }
                                  onClick={ () => { handleClick(i) } }
                                >
                                  <span>{ e.growth }</span>
                                  {/** 当前物候期提示文字 */}
                                  {
                                    e.growth === curRealPeriod.value ? (
                                      <div class="absolute top-[71px]">
                                        <span>{ "(当前物候期)" }</span>
                                      </div>
                                    ) : null
                                  }
                                  {/** 指向当前展示周期的指针 */}
                                  { i === curItem ? ( <div class="cur-arrow"></div> ) : null }
                                </div>
                                {/** 周期之间的箭头 */}
                                { i != arr.length - 1 ? ( 
                                  <div class="cycle-item px-[33.5px] py-[23px] box-border">
                                    <div class="next-arrow"></div>
                                  </div>
                                ) : null }
                              </div>
                            ))
                          }
                        </div>
                        {/** 最右箭头 */}
                        <div 
                          class="cycle-item cursor-pointer p-[15px] box-border"
                          onClick={ () => {rightArrowClick()} }
                        >
                          <div class={cycleNameList.value.length - 1 > curItem ? "right-arrow" : "right-arrow-disable"}></div>
                        </div>
                      </div>
                    ) : (
                      /**
                       * 周期数超越5个 一行只呈现5个 展示最左和最右的箭头
                       * 指向当前展示周期的指针始终在中间
                       */
                      <div class="w-full flex">
                        {/** 最左箭头 */}
                        <div 
                          class="cycle-item cursor-pointer p-[15px] box-border"
                          onClick={ () => {leftArrowClick()} }
                        >
                          <div class={0 < curItem ? "left-arrow" : "left-arrow-disable"}></div>
                        </div>
                        {/** 指向当前展示周期的指针 */}
                        <div class="cur-arrow cur-arrow-center"></div>
                        {/** 周期展示 */}
                        <div class="w-[837px] h-[100px] overflow-hidden">
                          <div class="flex relative" style={ `left: ${ offsetLeft.value }px;` }>
                          {
                            cycleNameList.value.map((e, i, arr) => (
                              <div class="flex">
                                {/** 周期名称展示 */}
                                <div 
                                  class={ i === curItem ? "cycle-item chosen-cycle relative" : (e.growth === curRealPeriod.value ? "cycle-item cur-cycle relative" : "cycle-item normal-cycle relative") }
                                  onClick={ () => { handleClick(i) } }
                                >
                                  <span>{ e.growth }</span>
                                  {/** 当前物候期提示文字 */}
                                  {
                                    e.growth === curRealPeriod.value ? (
                                      <div class="absolute top-[71px]">
                                        <span>{ "(当前物候期)" }</span>
                                      </div>
                                    ) : null
                                  }
                                </div>
                                {/** 周期之间的箭头 */}
                                { i != arr.length - 1 ? ( 
                                  <div class="cycle-item px-[33.5px] py-[23px] box-border">
                                    <div class="next-arrow"></div>
                                  </div>
                                ) : null }
                              </div>
                            ))
                          }
                          </div>
                        </div>
                        {/** 最右箭头 */}
                        <div 
                          class="cycle-item cursor-pointer p-[15px] box-border"
                          onClick={ () => {rightArrowClick()} }
                        >
                          <div class={cycleNameList.value.length - 1 > curItem ? "right-arrow" : "right-arrow-disable"}></div>
                        </div>
                      </div>
                    )
                  }
                </div>
                {/** 模型图片 */}
                {
                  cycleMap.value.get(curPeriod.value) && cycleMap.value.get(curPeriod.value).tips ? (
                    <div class="center-model text-center pt-[50px] box-border">
                      <img src={ cycleMap.value.get(curPeriod.value).imgId } class="object-contain h-[390px]" />
                    </div>
                  ) : null
                }
                {/** 周期事项 */}
                <Card
                  height={ 280 }
                  titleText="周期事项"
                  cardWidth={ 1032 }
                  cardHeight={ 230 }
                  addText={ `${ curPeriod.value }（${ curCycle.value }天）` }
                >
                  {
                    curTips.value.length ? (
                      <el-scrollbar>
                        <el-timeline class="ps-[110px] pt-[10px]">
                          {
                            curTips.value.map( (item, index) => (
                              <el-timeline-item
                                key={ index }
                                placement="top"
                                class="relative"
                              >
                                <el-card style="color: #CDDEE3; border: 1px solid #435B63; background: linear-gradient(180deg, rgba(101, 239, 235, 0) 0%, rgba(53, 218, 210, 0.12) 100%);">
                                  { item.itemContent }
                                </el-card>
                                <div class="absolute top-0 left-[-110px] w-[90px] h-[19px] text-[18px] leading-[19px] text-[#35DAD2] flex justify-end">
                                  <div class="text-center tracking-widest">
                                    { item.itemName }
                                    <div>{ item.remark1 ? `（${ item.remark1 }天）` : "" }</div>
                                  </div>
                                </div>
                                <div 
                                  class="absolute top-[10px] left-[-11px]" 
                                  style="background-image: url('/src/views/growthMonitoringModelDataCenter/assets/line-mark.png'); background-size: 100% 100%; width: 33px; height: 1px;"
                                >
                                </div>                              
                                {
                                  !(index === curTips.value.length - 1) ? (
                                    <div>
                                      <div 
                                        class="absolute top-[30px] left-[-8px]" 
                                        style="background-image: url('/src/views/growthMonitoringModelDataCenter/assets/line-small-mark.png'); background-size: 100% 100%; width: 9px; height: 1px;"
                                      >
                                      </div>
                                      <div 
                                        class="absolute top-[50px] left-[-8px]" 
                                        style="background-image: url('/src/views/growthMonitoringModelDataCenter/assets/line-small-mark.png'); background-size: 100% 100%; width: 9px; height: 1px;"
                                      >
                                      </div>
                                      <div 
                                        class="absolute top-[70px] left-[-8px]" 
                                        style="background-image: url('/src/views/growthMonitoringModelDataCenter/assets/line-small-mark.png'); background-size: 100% 100%; width: 9px; height: 1px;"
                                      >
                                      </div>
                                      <div 
                                        class="absolute top-[90px] left-[-8px]" 
                                        style="background-image: url('/src/views/growthMonitoringModelDataCenter/assets/line-small-mark.png'); background-size: 100% 100%; width: 9px; height: 1px;"
                                      >
                                      </div>
                                    </div>
                                  ) : null
                                }                              
                              </el-timeline-item>
                            ))
                          }
                        </el-timeline>
                      </el-scrollbar>
                    ) : (
                      <div class="w-full h-[230px] leading-[200px] text-center text-[#35DAD2] text-[40px] tracking-widest">
                        本周期暂无注意事项
                      </div>
                    )
                  }
                </Card>
              </div>
              {/** 右 */}
              <div class="w-[400px] h-full grid grid-cols-1 content-between">
                <Card 
                  height={ 400 }
                  titleText="指标监测"
                  cardWidth={ 400 }
                  cardHeight={ 350 }
                >
                  <el-scrollbar>
                  {
                    indicatorList.value.length ? (
                      <div class="grid grid-cols-2 gap-2 justify-items-center">
                        {
                          indicatorList.value.map((item, index) => (
                            <div 
                              class="cursor-pointer"
                              onClick={ () => { handleIndicatorClick(index) } }
                              style={ item.selected ? "box-shadow: 0px 2px 10px 0px #08795D;" : "" }
                            >
                              <div 
                                class={ item.selected ? "text-center text-[18px] text-[#35DAD2] index-title-active" : "text-center text-[18px] text-[#fff] index-title"}
                              >
                                { item.name }
                              </div>
                              <div class={ item.name.includes("气象") ? "weather" : (item.name.includes("土壤") ? "soil" : "phenology") }></div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div class="w-[370px] h-[320px] leading-[320px] text-[22px] text-center text-[#35DAD2] tracking-widest">
                        本周期暂无指标监测信息
                      </div>
                    )
                  }
                  </el-scrollbar>
                </Card>
                <Card 
                  height={ 532 }
                  titleText="模型要素分析"
                  cardWidth={ 400 }
                  cardHeight={ 478 }
                >
                  <div class="relative">
                    {/** 没有要素信息的提示 */}
                    {
                      curFactor.value.size ? null : (
                        <div 
                          class="z-999 absolute top-0 left-[-10px] w-[390px] h-[475px] leading-[320px] text-[22px] text-center text-[#35DAD2] tracking-widest"
                          style="background: #0B212C;"
                        >
                          本指标暂无要素信息
                        </div>
                      )
                    }   
                    <div class="w-full">
                      {/** ECharts图 */}
                      <div id="chart" class="w-[370px] h-[254px]"></div>
                      {/** 要素信息表格 */}
                      {
                        curFactorData.value.length ? (
                          <div class="text-[14px] border border-solid border-[#208282]">
                            <div 
                              class="text-center w-[363px] h-[30px] leading-[30px]"
                              style="background: linear-gradient(270deg, rgba(53, 218, 210, 0) 0%, rgba(53, 218, 210, 0.2971) 50%, rgba(53, 218, 210, 0) 100%);"
                            >
                              要素描述
                            </div>
                            <el-table 
                              data={ curFactorData.value }
                              height="180"
                              style={ {width: "370px"} }
                              row-style={(data) => {
                                let curBgColor = (Number(data.rowIndex) + 2) % 2 === 0 ? "#0F3940" : "transparent"
                                return {
                                  "background-color": curBgColor,
                                  "height": "45px",
                                  "font-size": "16px"
                                }
                              }}
                              header-row-style={ {"background-color": "transparent", "height": "45px", "font-size": "16px"} }
                            >
                              <el-table-column label="范围" align="center" >
                              {
                                ({ row }) => {
                                  return `${ row.lowLimit }${ row.unit } ~ ${ row.highLimit }${ row.unit }`
                                }
                              }
                              </el-table-column>
                              <el-table-column label="健康值" prop="healthRatio" align="center" width="65px"/>
                              <el-table-column label="要素结果" prop="indicatorResult" align="center" />
                            </el-table>
                          </div>
                        ) : (
                          <div class="w-[370px] h-[170px] leading-[170px] text-center text-[#35DAD2] tracking-widest" >
                            本要素暂无描述信息
                          </div>
                        )
                      }
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </BigscreenContainer>
        </BigscreenAdapter>
      </div>
    )
  }
})

</script>

<style lang="scss" scoped>
.plot-selector {

  /** 去掉el-selector的背景和边框 */
  :deep(.el-select__wrapper) {
    background-color: transparent;
    box-shadow: none;
  }

  /** 改变el-selector的文字颜色 */
  :deep(.el-select__placeholder) {
    color: #35DAD2;
  }

  /** 去掉el-selector的下拉倒三角箭头 */
  :deep(.el-icon svg) {
    display: none;
  }

  /** 增加自定义的el-selector的下拉倒三角箭头 */
  :deep(.el-icon) {
    background-image: url(/src/views/growthMonitoringModelDataCenter/assets/select-suffix.png);
    background-size: 100% 100%;
    width: 8px;
    height: 4px;
  }
}

:deep(.el-timeline-item__timestamp) {
  color: #35DAD2;
  font-size: 16px;
}

:deep(.el-timeline-item__tail) {
  border-color: #435B63;
}

:deep(.el-timeline-item__node) {
  background-color: transparent;
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/point.png);
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
  left: -10px;
  top: -7px;
}
:deep(.el-timeline-item__timestamp) {
  display: none;
}
:deep(.el-select--small .el-select__wrapper) {
  font-size: 14px;
}

/** 生长周期列表 */
.cur-arrow {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/cur-arrow.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 33px;
  height: 20px;
  position: absolute;
  top: -25px;
  left: 30px;
}
.cur-arrow-center {
  top: -25px;
  left: 497px;
}
.cycle-item {
  background-position: center;
  background-repeat: no-repeat;
  width: 93px;
  height: 67px;
  font-size: 16px;
  text-align: center;
}
.next-arrow {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/next-stage-arrow.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 26px;
  height: 21px;
}
.normal-cycle {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/normal-cycle.png);
  background-size: contain;
}
.cur-cycle {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/cur-cycle.png);
  background-size: contain;
}
.chosen-cycle {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/chosen-cycle.png);
  background-size: contain;
  color: #00FF73;
}
.normal-cycle:hover {
  cursor: pointer;
}
.cur-cycle:hover {
  cursor: pointer;
}
.left-arrow {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/left-arrow.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 63px;
  height: 37px;
}
.left-arrow-disable {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/left-arrow-disable.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 63px;
  height: 37px;
}
.right-arrow {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/right-arrow.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 63px;
  height: 37px;
}
.right-arrow-disable {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/right-arrow-disable.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 63px;
  height: 37px;
}
.center-model {
  width: 1032px;
  height: 520px;
  margin-bottom: 10px;
}
/** 生长周期列表 end */

/** 指标监测 */
.weather {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/weather.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 132px;
  height: 86px;
}
.phenology {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/phenology.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 132px;
  height: 86px;
}
.soil {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/soil.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 132px;
  height: 86px;
}
.index-title-active {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/text-bg.png);
  background-size: 100% 100%;
  width: 132px;
  height: 41px;
  line-height: 41px;
  margin-bottom: 17px;
}
.index-title {
  width: 132px;
  height: 41px;
  line-height: 41px;
  margin-bottom: 17px;
}
.factor-item {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/factor-bg.png);
  background-size: 100% 100%;
}
.factor-left {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/factor-left.png);
  background-size: 100% 100%;
  width: 8px;
  height: 30px;
  position: absolute;
  left: -5px;
}
.factor-mid {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/factor-mid-bg.png);
  background-size: 100% 100%;
  width: 100px;
  height: 100px;
  font-size: 18px;
  color: #1DFFFF;
}
.factor-left-up {
  position: absolute;
  top: 147px;
  left: 322px;
}
.factor-left-down {
  position: absolute;
  top: 357px;
  left: 180px;
}
.factor-right-up {
  position: absolute;
  top: 212px;
  left: 683px;
}
.factor-right-down {
  position: absolute;
  top: 413px;
  left: 764px;
}

/** echarts图切换 */
:deep(.el-tabs__nav) {
  border: none !important;
}
:deep(.el-tabs__item) {
  border: none !important;
  padding: 10px;
  height: 20px;
  font-size: 16px;
}
:deep(.el-tabs__item:nth-child(2)) {
  padding: 0 !important;
}
:deep(.el-tabs__header) {
  border: none !important;
  margin: 0 !important;
}
:deep(.el-tabs--card>.el-tabs__header) {
  height: 20px;
}

/** 要素表格 */
:deep(.el-table--border th.el-table__cell,
.el-table td.el-table__cell) {
  border-bottom: none !important;
}
 
:deep(.el-table--border .el-table__cell) {
  border-right:none !important;
}
 
:deep(.el-table--group, .el-table--border) {
  border: none !important;
}
:deep(.el-table__cell) {
  border: none !important;
}
:deep(.el-table__inner-wrapper::before) {
  height: 0px;
}
// 去掉el-table的所有背景颜色以及所有hover的颜色
:deep(.el-table),
:deep(.el-table .el-table__header-wrapper th,
.el-table--border) {
  background-color: transparent !important;
  color: #35DAD2;
}
:deep(.el-table__body tr:hover > td) {
  background-color: transparent !important;
}
// 字体
:deep(.el-table--small) {
  font-size: 14px;
}
:deep(td .cell) {
  color: #fff;
}

@for $i from 1 through 9 {
  .model-#{$i} {
    background-image: url(/src/views/growthMonitoringModelDataCenter/assets/stage#{$i}.png);
  }
}

</style>

<style lang="scss">
// 使用CSS变量作为SCSS变量
$growth-monitoring-model-datacenter-screen-width: calc(var(--growth-monitoring-model-datacenter-screen-width));
$growth-monitoring-model-datacenter-screen-height: calc(var(--growth-monitoring-model-datacenter-screen-height));

.growth-monitoring-model-datacenter-popper {
  width: calc(#{$growth-monitoring-model-datacenter-screen-width} * 0.11);
  min-width: 0 !important;
}

.growth-monitoring-model-datacenter-popper .el-select-dropdown__item {
  font-size: calc(#{$growth-monitoring-model-datacenter-screen-height} * 0.012);
  height: calc(#{$growth-monitoring-model-datacenter-screen-height} * 0.02);
  line-height: calc(#{$growth-monitoring-model-datacenter-screen-height} * 0.02);
}
</style>