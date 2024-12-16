<script lang="tsx">
/** 生长监测模型数据中心大屏页面 */
/** 引入大屏组件 */
import BigscreenBuilder from '@/components/BigscreenBuilder';

/** echarts相关 */
import * as echarts from 'echarts';

/** 引入其他组件 */
import Header from './components/Header.vue';
// import Card from "./components/Card.vue"
// import NumberShow from "./components/NumberShow.vue"
import ModelIcon from './components/ModelIcon.vue';

/** 引入请求接口 */
import {
  getBase,
  getModel,
  getNum,
  getPlot,
  getCycle,
  getIndicator,
  updateModelEnableStatus
} from './api';

/** 引入图片 */
import bg from './assets/bg.png';
import bgFish from './assets/bg-fish.png';
import bgDuck from './assets/bg-duck.png';
import BgChaZhu from './assets/chazhu/bg.png';
import Dplayer from 'dplayer';

const { BigscreenAdapter, BigscreenContainer } = BigscreenBuilder;

export default defineComponent({
  components: { Header },
  props: {
    hiddenHeader: {
      type: Boolean,
      default: false
    },
    isChazhu: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { hiddenHeader, isChazhu } = toRefs(props);
    const imgBase = '/src/views/growthMonitoringModelDataCenter/assets';
    const message = useMessage(); // 消息弹窗

    /** Header组件需要的属性(heardBg不应该传进去) */
    const headerHeight = 100;
    const titleHeight = 30;
    const titleWidth = 386;
    const headerBg = `${imgBase}/header/header-bg.png`;
    const title = `${imgBase}/header/title.png`;

    /**
     * 基地列表相关
     * baseList      基地列表
     * base          当前选择的基地
     */
    const baseList = ref<Array<any>>([]);
    const base = ref();

    const getBaseList = async () => {
      baseList.value = [];
      const res = await getBase();
      console.log('基地列表: ', res);
      res.forEach((element: any) => {
        baseList.value.push({ id: element.id, name: element.name });
      });
      base.value = baseList.value[0];
    };

    /**
     * 品种数 模型数
     * varietyNumIcon       品种的图标
     * modelNumIcon         模型的图标
     * nVariety             品种数
     * nModel               模型数
     */
    // const varietyNumIcon = `${ imgBase }/variety-num.png`
    // const modelNumIcon = `${ imgBase }/model-num.png`
    const nVariety = ref();
    const nModel = ref();

    const getNums = async () => {
      const params = { parkId: '' };
      const res = await getNum(params);
      console.log('品种数 模型数: ', res);
      nVariety.value = res['品种数'];
      nModel.value = res['模型数'];
    };

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
    const modelList = ref<Array<any>>([]);
    let curModelId = '';
    const curVarietyName = ref('');
    const bgImage = ref(bg);

    const getModelList = async () => {
      const params = { parkId: '' };
      const res = await getModel(params);
      console.log('模型列表: ', res);
      if (!Array.isArray(res) || res.length === 0) return;
      modelList.value = res.map((item) => {
        return {
          ...item,
          activated: false,
          key: item.modelId
        };
      });
      modelList.value[0].activated = true;
      changeBackground(modelList.value[0]);
      curModelId = modelList.value[0].modelId;
      curVarietyName.value = modelList.value[0].varietyName;
    };

    const changeModel = async (idx) => {
      modelList.value.forEach((element, index) => {
        if (idx === index) {
          element.activated = true;
          curModelId = element.modelId;
          curVarietyName.value = element.varietyName;
          changeBackground(element);
          if (chartInstance) {
            chartInstance.dispose();
            chartInstance = null;
            chartDom = null;
          }
        } else {
          element.activated = false;
        }
        element.key = `${element.key}1`;
      });
      await getCycleList();
      await getPlotList(curModelId);
    };

    const changeBackground = (item) => {
      let str = item.varietyName;
      if (!str) return;
      if (str.includes('鱼')) {
        bgImage.value = bgFish;
      } else if (str.includes('鸭')) {
        bgImage.value = bgDuck;
      } else {
        bgImage.value = bg;
      }
    };

    /**
     * 地块监控相关
     * plotList          地块监控列表
     *
     * modelName表示模型名称 暂时轮流使用所有模型名称
     * enable表示是否启用 暂时全部设置为true
     */
    const plotList = ref<Array<any>>([]);

    const getPlotList = async (modelId: string) => {
      const params = { parkId: base.value.id, modelId };
      const res = await getPlot(params);
      console.log('地块列表: ', res);
      plotList.value = res.filter((item) => {
        return item.modelId === curModelId;
      });
      console.log('plotList', plotList.value);
    };

    /** 修改品种模型绑定状态 */
    const handleStatusChange = async (row) => {
      try {
        // 修改状态的二次确认
        const text = row.isEnableModel ? '停绑' : '绑定';
        await message.confirm('确认要' + text + '当前模型吗?');
        // 发起修改状态
        await updateModelEnableStatus(row.cropBaseId, !row.isEnableModel);
        // 刷新列表
        await getPlotList(curModelId);
      } catch {
        // 取消后，进行恢复按钮
        // row.isEnableModel = row.isEnableModel ? true : false
      }
    };

    const router = useRouter();
    const handleRoute = (item) => {
      if (item.isEnableModel) {
        router.push({
          path: '/bigscreenModel',
          query: {
            modelName: item.modelName,
            // growthId: item.growthId,
            plotId: item.plotId,
            modelId: item.modelId
            // batchCode:item.batchCode
          }
        });
      } else {
        ElMessage.warning('当前地块已禁用，请重新选择地块');
      }
    };
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
    const curPeriod = ref('');
    const cycleNameList = ref<Array<any>>([]);
    let curItem = 0;
    const curTips = ref<Array<any>>([]);
    const curCycle = ref(0);
    const cycleMap = ref(new Map());
    let curCropCode = '';
    const curRealPeriod = ref('');
    const offsetLeft = ref(0);

    const getCycleList = async () => {
      cycleNameList.value = [];
      curTips.value = [];
      cycleMap.value = new Map();
      curItem = 0;
      curCycle.value = 0;
      curCropCode = '';
      curRealPeriod.value = '';
      offsetLeft.value = 0;

      if (curModelId) {
        const params = { modelId: curModelId };
        const res = await getCycle(params);
        console.log('周期列表: ', res);
        if (!Array.isArray(res) || res.length === 0) {
          // 周期没数据则指标要素重置
          indicatorList.value = [];
          indicatorNames = [];
          curIndicatorIndex = 0;
          factorMap = new Map();
          curFactor.value = new Map();
          chartDom = null;
          chartInstance = null;
          curFactorData.value = [];
          return;
        }

        if (res[0].curPeriod) {
          curPeriod.value = res[0].curPeriod;
          curRealPeriod.value = res[0].curPeriod;

          res.map((item, index) => {
            if (index) {
              cycleMap.value.set(item.growth, {
                cycle: item.cycle,
                growthId: item.growthId,
                tips: item.child2,
                imgId: item.imgId,
                videoLike: item.videoLike
              });

              if (curPeriod.value === item.growth) {
                cycleNameList.value.push({ growth: item.growth, selected: true });
                curCropCode = item.growthId;
                curItem = index - 1;
              } else {
                cycleNameList.value.push({ growth: item.growth, selected: false });
              }
            }
          });
        } else {
          res.map((item, index) => {
            cycleMap.value.set(item.growth, {
              cycle: item.cycle,
              growthId: item.growthId,
              tips: item.child2,
              imgId: item.imgId,
              videoLike: item.videoLike
            });
            if (index) {
              cycleNameList.value.push({ growth: item.growth, selected: false });
            } else {
              cycleNameList.value.push({ growth: item.growth, selected: true });
              curCropCode = item.growthId;
              curItem = index;
            }
          });
        }

        if (cycleNameList.value.length > 0) handleClick(0);
        curTips.value = cycleMap.value.get(curPeriod.value).tips;
        curCycle.value = cycleMap.value.get(curPeriod.value).cycle;

        // 初始化周期列表的位置
        offsetLeft.value = 0;
        let tmp = curItem;
        curItem = 2;
        cycleListChange(tmp);
        curItem = tmp;
      }
      await getIndicatorList();
    };

    // 处理周期列表移动
    const cycleListChange = (index) => {
      if (cycleNameList.value.length > 5) {
        offsetLeft.value += (curItem - index) * 93 * 2;
      }
    };

    // 右箭头周期列表移动
    const rightArrowClick = () => {
      if (cycleNameList.value.length - 1 > curItem) {
        handleClick(curItem + 1);
      }
    };

    // 左箭头周期列表移动
    const leftArrowClick = () => {
      if (0 < curItem) {
        handleClick(curItem - 1);
      }
    };

    const handleClick = async (index) => {
      cycleListChange(index);

      cycleNameList.value[curItem].selected = false;
      cycleNameList.value[index].selected = true;
      let tmp = curItem;
      curItem = index;

      curPeriod.value = cycleNameList.value[curItem].growth;
      curTips.value = cycleMap.value.get(curPeriod.value).tips;
      curCycle.value = cycleMap.value.get(curPeriod.value).cycle;
      curCropCode = cycleMap.value.get(curPeriod.value).growthId;

      if (tmp != curItem) await getIndicatorList();
    };

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
    const indicatorList = ref<Array<any>>([]);
    let indicatorNames = [];
    let curIndicatorIndex = 0;
    let factorMap = new Map();
    const curFactor = ref<Map<any, any>>(new Map());
    let chartDom = null;
    let chartInstance = null;
    const curFactorData = ref<Array<any>>([]);

    const initChartStatic = (id = '', option = {}) => {
      if (!id) return;

      const chart = document.getElementById(id);
      const chartInstance = echarts.init(chart, 'default');
      chartInstance.setOption(option, true, true);
      window.addEventListener('resize', () => {
        setTimeout(() => {
          chartInstance && chartInstance.resize();
        }, 10);
      });

      return { chartDom: chart, chartInstance: chartInstance };
    };

    const initOption = () => {
      // console.log("curFactor", curFactor.value)
      // console.log("curFactorData", curFactorData.value)
      let baseColor = '#1DFFFF';
      let areaColor = '#172c37';
      let colorStops = [
        { offset: 0.25, color: 'rgba(53, 218, 210, 0.25)' },
        { offset: 0.91, color: 'rgba(29, 255, 255, 0.5)' }
      ];
      if (isChazhu.value) {
        baseColor = '#01F892';
        areaColor = 'rgba(67, 91, 99, 0.2)';
        colorStops = [
          { offset: 0.25, color: 'rgba(29, 255, 161, 0.25)' },
          { offset: 0.91, color: 'rgba(53, 218, 149, 0.5)' }
        ];
      }

      if (curFactor.value.size) {
        let indicatorData = [];
        let percentages = [];
        let totalPer = 0;
        curFactor.value.forEach((value, key) => {
          indicatorData.push({ name: key, max: 100 });
          let curPer = Number(value.weight.replace('%', ''));
          percentages.push(curPer);
          totalPer += curPer;
        });
        if (100 > totalPer) {
          indicatorData.push({ name: '其他', max: 100 });
          percentages.push(100 - totalPer);
        }
        let labelPos = 'top';
        if (indicatorData.length < 3) {
          labelPos = 'right';
        }
        const option = {
          color: [baseColor],
          tooltip: {
            valueFormatter: (params) => {
              return `${params}%`;
            },
            borderWidth: 3
          },
          radar: {
            axisNameGap: 10,
            triggerEvent: true,
            indicator: indicatorData,
            axisName: {
              color: baseColor,
              fontSize: '14px'
            },
            axisLine: {
              lineStyle: {
                color: '#616161'
              }
            },
            splitArea: {
              areaStyle: {
                color: areaColor
              }
            },
            splitLine: {
              lineStyle: {
                color: '#435B63'
              }
            }
          },
          series: [
            {
              type: 'radar',
              name: indicatorList.value[curIndicatorIndex].name,
              data: [
                {
                  value: percentages,
                  symbol: 'circle',
                  symbolSize: 12,
                  label: {
                    show: true,
                    color: '#fff',
                    fontSize: 18,
                    position: labelPos,
                    formatter: (params) => {
                      return `${params.value}%`;
                    }
                  },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: colorStops
                    }
                  }
                }
              ]
            }
          ]
        };
        if (indicatorData.length === 3) {
          option.radar = { ...option.radar, ...{ radius: '85%', center: ['50%', '60%'] } };
        }

        if (chartDom && chartInstance) {
          // console.log("option", option)
          chartInstance.setOption(option, true, true);
        } else {
          let tmp = initChartStatic('chart', option);
          chartDom = tmp.chartDom;
          chartInstance = tmp.chartInstance;

          // 雷达图点击名称的监听事件
          chartInstance.on('click', 'radar', (params) => {
            if ('其他' !== params.name) {
              curFactorData.value = curFactor.value.get(
                params.name
              ).modelIndicatorElementRangeDOList;
            } else {
              curFactorData.value = [];
            }
          });
          chartInstance.setOption(option, true, true);
        }
      }
    };

    const getIndicatorList = async () => {
      indicatorList.value = [];
      indicatorNames = [];

      if (curCropCode) {
        const params = { modelId: curModelId, growthId: curCropCode };
        // console.log("getIndicator params", params)
        const res = await getIndicator(params);
        console.log('指标要素: ', res);

        if (res.length) {
          res.map((item) => {
            if (!indicatorNames.includes(item.indicatorName)) {
              indicatorList.value.push({ name: item.indicatorName, selected: false });
              indicatorNames.push(item.indicatorName);
              let factorInfoMap = new Map();
              if (item.modelIndicatorElementCardVOList.length) {
                item.modelIndicatorElementCardVOList.forEach((ele) => {
                  factorInfoMap.set(ele.elementName, ele);
                });
              } else {
                curFactor.value = new Map();
                curFactorData.value = [];
              }
              factorMap.set(item.indicatorName, factorInfoMap);
            }
          });

          indicatorList.value[0].selected = true;
          curIndicatorIndex = 0;
          curFactor.value = factorMap.get(indicatorList.value[0].name);
          initOption();
          if (curFactor.value.size) {
            let tmpIter = curFactor.value.values();
            curFactorData.value = tmpIter.next().value.modelIndicatorElementRangeDOList;
          } else {
            curFactorData.value = [];
          }
        } else {
          curFactor.value = new Map();
          curFactorData.value = [];
        }
      } else {
        curFactor.value = new Map();
        curFactorData.value = [];
      }
    };

    const handleIndicatorClick = async (index) => {
      // console.log("handleIndicatorClick", index, curIndicatorIndex, indicatorList.value)
      indicatorList.value[curIndicatorIndex].selected = false;
      indicatorList.value[index].selected = true;
      let tmp = curIndicatorIndex;
      curIndicatorIndex = index;

      if (!(tmp === curIndicatorIndex)) {
        curFactor.value = factorMap.get(indicatorList.value[curIndicatorIndex].name);
        if (curFactor.value.size) {
          let tmpIter = curFactor.value.values();
          curFactorData.value = tmpIter.next().value.modelIndicatorElementRangeDOList;
        } else {
          curFactorData.value = [];
        }
        initOption();
      }
    };

    const handleResize = () => {
      // 设置屏幕宽度和高度为CSS变量
      document.documentElement.style.setProperty(
        '--growth-monitoring-model-datacenter-screen-width',
        `${window.innerWidth}px`
      );
      document.documentElement.style.setProperty(
        '--growth-monitoring-model-datacenter-screen-height',
        `${window.innerHeight}px`
      );
    };

    /**
     * 渲染页面
     */
    onMounted(async () => {
      await getBaseList();
      await getNums();
      await getModelList();
      await getPlotList('');
      await getCycleList();
      // await getIndicatorList()
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    let player: any = null;
    const showVideoDialog = ref(false);

    const handleClickVideo = async () => {
      const videoLink = cycleMap.value.get(curPeriod.value).videoLike;
      if (!videoLink) return;
      showVideoDialog.value = true;

      await nextTick();
      player = new Dplayer({
        container: document.getElementById('dplayer'),
        loop: false,
        autoplay: true,
        volume: 0,
        video: {
          url: videoLink
        },
        mutex: false
      });
    };

    const handleCloseVideo = () => {
      showVideoDialog.value = false;
      player.destroy();
    };

    onDeactivated(() => {
      if (player) {
        player.destroy();
      }
    });

    onUnmounted(() => {
      if (player) {
        player.destroy();
      }
    });

    const MainContainer = () => {
      return (
        <div class="w-[1880px] h-[947px] overflow-hidden bg-transparent px-[20px] pt-[13px] pb-[20px] flex relative text-[#fff]">
          <div class="absolute left-0 top-[-100px] w-100% h-1080px z-0">
            <img class="w-full h-full" src={bgImage.value} />
          </div>
          {/** 左 */}
          <div class="w-[400px] h-full z-2">
            <div class="h-40px w-400px dc-title-bg flex justify-between items-center px-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-title-icon h-27px w-24px"></div>
                <div class="dc-title-text">模型类型</div>
              </div>
              <div class="dc-right-arrow h-15px w-15px"></div>
            </div>
            <div class="mt-10px w-400px h-230px flex flex-col justify-center items-center dc-module-border">
              <div class="dc-variety-bg w-301px h-88px flex items-center justify-between">
                <div class="pl-120px">品种数</div>
                <div class="text-[#435B63]">
                  <span class="text-24px text-white pr-5px">{nVariety.value}</span>种
                </div>
              </div>
              <div class="dc-num-bg w-301px h-88px mt-18px flex items-center justify-between">
                <div class="pl-120px">模型数</div>
                <div class="text-[#435B63]">
                  <span class="text-24px text-white pr-5px">{nModel.value}</span>个
                </div>
              </div>
            </div>

            <div class="mt-25px h-40px w-400px dc-title-bg flex justify-between items-center px-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-title-icon h-27px w-24px"></div>
                <div class="dc-title-text">品种模型</div>
              </div>
              <div class="dc-right-arrow h-15px w-15px"></div>
            </div>
            <div class="mt-10px w-400px h-230px dc-module-border">
              {modelList.value.length > 0 ? (
                <el-scrollbar>
                  <div class="grid grid-cols-2 gap-3 justify-items-center cursor-pointer pt-[10px]">
                    {modelList.value.map((item, index) => (
                      <ModelIcon
                        modelName={item.modelName}
                        activated={item.activated}
                        modelImg={item.modelImg}
                        key={item.key}
                        onClick={() => {
                          changeModel(index);
                        }}
                      ></ModelIcon>
                    ))}
                  </div>
                </el-scrollbar>
              ) : (
                <div class="w-full h-full flex justify-center items-center">
                  <div class="growth-datacenter-no-data"></div>
                </div>
              )}
            </div>

            <div class="mt-25px h-40px w-400px dc-title-bg flex justify-between items-center px-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-title-icon h-27px w-24px"></div>
                <div class="dc-title-text">地块监测</div>
              </div>
              <div class="flex items-center">
                <el-select
                  id="base-select"
                  class="plot-selector mr-10px"
                  v-model={base.value}
                  value-key="id"
                  style={`background-image: url(${imgBase}/select-bg.png); background-size: 100% 100%; width: 200px; height: 24px;`}
                  popper-class="growth-monitoring-model-datacenter-popper"
                  onChange={() => {
                    getPlotList(curModelId);
                  }}
                >
                  {baseList.value.map((item) => (
                    <el-option key={item.id} label={item.name} value={item}></el-option>
                  ))}
                </el-select>
                <div class="dc-right-arrow h-15px w-15px"></div>
              </div>
            </div>
            <div class="mt-10px w-400px h-285px dc-module-border p-2 box-border">
              {plotList.value.length > 0 ? (
                <el-scrollbar>
                  <div class="grid grid-cols-2 gap-3 justify-items-center">
                    {/** 单个卡片 */}
                    {plotList.value.map((item) => (
                      <div class="w-full h-[130px] mb-[10px]">
                        <div
                          style={`background-image: url(${item.modelImg}); background-size: contain; background-position: center; background-repeat: no-repeat;`}
                          class="w-full h-[100px] relative cursor-pointer box-border border border-solid border-[#435B63]"
                          onClick={() => {
                            handleRoute(item);
                          }}
                        >
                          <div
                            class="absolute top-0 left-0 h-[20px] leading-[20px] text-[12px] px-[5px]"
                            style="background-color: rgba(0, 0, 0, 0.659);"
                          >
                            {item.modelName}
                          </div>
                        </div>
                        <div class="flex justify-between mt-[10px] px-[10px]">
                          <div>{item.plotName}</div>
                          <div>
                            {item.isEnableModel ? (
                              <el-button
                                style="color: #35DAD2; border: 1px solid #35DAD2; background-color: transparent;"
                                round
                                type="success"
                                onClick={() => {
                                  handleStatusChange(item);
                                }}
                              >
                                <el-icon>
                                  <CircleCheck />
                                </el-icon>
                                <span>启用</span>
                              </el-button>
                            ) : (
                              <el-button
                                style="color: #435B63; border: 1px solid #435B63; background-color: transparent;"
                                round
                                type="danger"
                                onClick={() => {
                                  handleStatusChange(item);
                                }}
                              >
                                <el-icon>
                                  <CircleClose />
                                </el-icon>
                                <span>禁用</span>
                              </el-button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </el-scrollbar>
              ) : (
                <div class="w-full h-full flex justify-center items-center">
                  <div class="growth-datacenter-no-data"></div>
                </div>
              )}
            </div>
          </div>
          {/** 中 */}
          <div class="grow h-full px-[20px] grid grid-cols-1 content-end relative">
            {/** 周期列表 */}
            {cycleNameList.value.length > 0 && (
              <div class="w-[1032px] h-[120px] absolute top-[0px] left-0 mx-[20px] mt-[30px] flex justify-center flex-wrap content-center">
                {cycleNameList.value.length < 6 ? (
                  /**
                   * 周期数不足5个 不展示最左和最右的箭头 整体剧中
                   * 指向当前展示周期的指针跟随选中的周期
                   */
                  <div class="w-full flex">
                    {/** 最左箭头 */}
                    <div
                      class="cycle-item cursor-pointer p-[15px] box-border"
                      onClick={() => {
                        leftArrowClick();
                      }}
                    >
                      <div class={0 < curItem ? 'left-arrow' : 'left-arrow-disable'}></div>
                    </div>
                    <div class="w-[837px] h-[100px] flex justify-center">
                      {cycleNameList.value.map((e, i, arr) => (
                        <div class="flex">
                          {/** 周期名称展示 */}
                          <div
                            class={
                              i === curItem
                                ? 'cycle-item chosen-cycle relative'
                                : e.growth === curRealPeriod.value
                                  ? 'cycle-item cur-cycle relative'
                                  : 'cycle-item normal-cycle relative'
                            }
                            onClick={() => {
                              handleClick(i);
                            }}
                          >
                            <span>{e.growth}</span>
                            {/** 当前物候期提示文字 */}
                            {e.growth === curRealPeriod.value ? (
                              <div class="absolute top-[71px]">
                                <span>{'(当前物候期)'}</span>
                              </div>
                            ) : null}
                            {/** 指向当前展示周期的指针 */}
                            {i === curItem ? <div class="cur-arrow"></div> : null}
                          </div>
                          {/** 周期之间的箭头 */}
                          {i != arr.length - 1 ? (
                            <div class="cycle-item px-[33.5px] py-[23px] box-border">
                              <div class="next-arrow"></div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    {/** 最右箭头 */}
                    <div
                      class="cycle-item cursor-pointer p-[15px] box-border"
                      onClick={() => {
                        rightArrowClick();
                      }}
                    >
                      <div
                        class={
                          cycleNameList.value.length - 1 > curItem
                            ? 'right-arrow'
                            : 'right-arrow-disable'
                        }
                      ></div>
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
                      onClick={() => {
                        leftArrowClick();
                      }}
                    >
                      <div class={0 < curItem ? 'left-arrow' : 'left-arrow-disable'}></div>
                    </div>
                    {/** 指向当前展示周期的指针 */}
                    <div class="cur-arrow cur-arrow-center"></div>
                    {/** 周期展示 */}
                    <div class="w-[837px] h-[100px] overflow-hidden">
                      <div class="flex relative" style={`left: ${offsetLeft.value}px;`}>
                        {cycleNameList.value.map((e, i, arr) => (
                          <div class="flex">
                            {/** 周期名称展示 */}
                            <div
                              class={
                                i === curItem
                                  ? 'cycle-item chosen-cycle relative'
                                  : e.growth === curRealPeriod.value
                                    ? 'cycle-item cur-cycle relative'
                                    : 'cycle-item normal-cycle relative'
                              }
                              onClick={() => {
                                handleClick(i);
                              }}
                            >
                              <span>{e.growth}</span>
                              {/** 当前物候期提示文字 */}
                              {e.growth === curRealPeriod.value ? (
                                <div class="absolute top-[71px]">
                                  <span>{'(当前物候期)'}</span>
                                </div>
                              ) : null}
                            </div>
                            {/** 周期之间的箭头 */}
                            {i != arr.length - 1 ? (
                              <div class="cycle-item px-[33.5px] py-[23px] box-border">
                                <div class="next-arrow"></div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/** 最右箭头 */}
                    <div
                      class="cycle-item cursor-pointer p-[15px] box-border"
                      onClick={() => {
                        rightArrowClick();
                      }}
                    >
                      <div
                        class={
                          cycleNameList.value.length - 1 > curItem
                            ? 'right-arrow'
                            : 'right-arrow-disable'
                        }
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/** 模型图片 */}
            {cycleMap.value.get(curPeriod.value) && cycleMap.value.get(curPeriod.value).tips ? (
              <div class="center-model flex justify-center text-center pt-[50px] box-border">
                <div class="w-fit h-fit relative">
                  <img
                    src={cycleMap.value.get(curPeriod.value).imgId}
                    class="object-contain h-[390px]"
                  />
                  <div class="dc-video-border">
                    <div class="absolute top-[11px] left-[106.53px] text-white text-[14px]">
                      种植技术视频
                    </div>
                    <div
                      class="absolute top-0 right-0 w-[205px] h-[150px] bg-transparent z-10 cursor-pointer"
                      onClick={() => {
                        handleClickVideo();
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : null}
            {/** 周期事项 */}
            <div class="w-1032px h-40px dc-title-bg-lg flex justify-between items-center px-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-title-icon h-27px w-24px"></div>
                <div class="dc-title-text">
                  周期事项-{curPeriod.value}（{curCycle.value}天）
                </div>
              </div>
              <div class="dc-right-arrow h-15px w-15px"></div>
            </div>
            <div class="mt-10px w-1032px h-230px dc-module-border-lg box-border p-5">
              {curTips.value.length ? (
                <el-scrollbar>
                  <el-timeline class="ps-[110px] pt-[10px]">
                    {curTips.value.map((item, index) => (
                      <el-timeline-item key={index} placement="top" class="relative">
                        <el-card style="color: #CDDEE3; border: 1px solid #435B63; background: linear-gradient(180deg, rgba(101, 239, 235, 0) 0%, rgba(53, 218, 210, 0.12) 100%);">
                          {item.itemContent}
                        </el-card>
                        <div class="absolute top-0 left-[-110px] w-[90px] h-[19px] text-[18px] leading-[19px] text-[#35DAD2] flex justify-end">
                          <div class="text-center tracking-widest">
                            {item.itemName}
                            <div>{item.remark1 ? `（${item.remark1}天）` : ''}</div>
                          </div>
                        </div>
                        <div class="absolute top-[10px] left-[-11px] line-mark"></div>
                        {!(index === curTips.value.length - 1) ? (
                          <div>
                            <div class="absolute top-[30px] left-[-8px] line-small-mark"></div>
                            <div class="absolute top-[50px] left-[-8px] line-small-mark"></div>
                            <div class="absolute top-[70px] left-[-8px] line-small-mark"></div>
                            <div class="absolute top-[90px] left-[-8px] line-small-mark"></div>
                          </div>
                        ) : null}
                      </el-timeline-item>
                    ))}
                  </el-timeline>
                </el-scrollbar>
              ) : (
                <div class="w-full h-[230px] flex justify-center items-center">
                  <div class="growth-datacenter-no-data"></div>
                </div>
              )}
            </div>
          </div>
          {/** 右 */}
          <div class="w-[400px] h-full z-2">
            <div class="h-40px w-400px dc-title-bg flex justify-between items-center px-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-title-icon h-27px w-24px"></div>
                <div class="dc-title-text">指标监测</div>
              </div>
              <div class="dc-right-arrow h-15px w-15px"></div>
            </div>
            <div class="mt-10 w-400px h-350px dc-module-border-sm">
              <el-scrollbar>
                {indicatorList.value.length ? (
                  <div class="grid grid-cols-2 gap-2 justify-items-center">
                    {indicatorList.value.map((item, index) => (
                      <div
                        class="cursor-pointer"
                        onClick={() => {
                          handleIndicatorClick(index);
                        }}
                        style={item.selected ? 'box-shadow: 0px 2px 10px 0px #08795D;' : ''}
                      >
                        <div
                          class={
                            item.selected
                              ? 'text-center text-[18px] text-[#35DAD2] index-title-active'
                              : 'text-center text-[18px] text-[#fff] index-title'
                          }
                        >
                          {item.name}
                        </div>
                        <div
                          class={
                            item.name.includes('气象')
                              ? 'weather'
                              : item.name.includes('土壤')
                                ? 'soil'
                                : 'phenology'
                          }
                        ></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="w-[400px] h-[350px] flex justify-center items-center">
                    <div class="growth-datacenter-no-data"></div>
                  </div>
                )}
              </el-scrollbar>
            </div>

            <div class="mt-25px h-40px w-400px dc-title-bg flex justify-between items-center px-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-title-icon h-27px w-24px"></div>
                <div class="dc-title-text">模型要素分析</div>
              </div>
              <div class="dc-right-arrow h-15px w-15px"></div>
            </div>
            <div class="mt-10px w-400px h-445px dc-module-border-md">
              <div class="relative">
                {/** 没有要素信息的提示 */}
                {curFactor.value.size ? null : (
                  <div
                    class="z-999 absolute top-0 left-1px w-[398px] h-[444px] flex justify-center items-center"
                    style="background: #0B212C;"
                  >
                    <div class="growth-datacenter-no-data"></div>
                  </div>
                )}
                <div class="w-full flex flex-col items-center">
                  {/** ECharts图 */}
                  <div id="chart" class="w-[400px] h-[254px]"></div>
                  {/** 要素信息表格 */}
                  {curFactorData.value.length ? (
                    <div class="text-[14px] border border-solid border-[#208282]">
                      <div
                        class="text-center w-[380px] h-[30px] leading-[30px]"
                        style="background: linear-gradient(270deg, rgba(53, 218, 210, 0) 0%, rgba(53, 218, 210, 0.2971) 50%, rgba(53, 218, 210, 0) 100%);"
                      >
                        要素描述
                      </div>
                      <el-table
                        data={curFactorData.value}
                        height="150"
                        style={{ width: '380px' }}
                        row-style={(data) => {
                          let curBgColor =
                            (Number(data.rowIndex) + 2) % 2 === 0 ? '#0F3940' : 'transparent';
                          return {
                            'background-color': curBgColor,
                            height: '45px',
                            'font-size': '16px'
                          };
                        }}
                        header-row-style={{
                          'background-color': 'transparent',
                          height: '45px',
                          'font-size': '16px'
                        }}
                      >
                        <el-table-column label="范围" align="center">
                          {({ row }) => {
                            return `${row.lowLimit}${row.unit} ~ ${row.highLimit}${row.unit}`;
                          }}
                        </el-table-column>
                        <el-table-column
                          label="健康值"
                          prop="healthRatio"
                          align="center"
                          width="65px"
                        />
                        <el-table-column label="要素结果" prop="indicatorResult" align="center" />
                      </el-table>
                    </div>
                  ) : (
                    <div class="w-[370px] h-[170px] flex justify-center items-center">
                      <div class="growth-datacenter-no-data"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Dialog
            v-model={showVideoDialog.value}
            title="种植技术视频"
            width={1280}
            onClose={() => {
              handleCloseVideo();
            }}
            top="80px"
          >
            <div id="dplayer">查看视频</div>
          </Dialog>
        </div>
      );
    };

    const ChazhuContainer = () => {
      return (
        <div class="w-[1880px] h-[947px] overflow-hidden bg-transparent px-[20px] pt-[13px] pb-[20px] flex relative text-[#fff]">
          <div class="absolute left-0 top-[-100px] w-100% h-1080px z-0">
            <img class="w-full h-full" src={BgChaZhu} />
          </div>
          {/** 左 */}
          <div class="w-[400px] h-full z-2">
            <div class="h-40px w-400px dc-cz-title-bg flex justify-between items-center pl-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-cz-title-icon h-27px w-24px"></div>
                <div class="art-font dc-cz-title-text">模型类型</div>
              </div>
              <div class="dc-cz-right-arrow h-30px w-30px"></div>
            </div>
            <div class="mt-10px w-400px h-230px flex flex-col justify-center items-center dc-cz-module-border">
              <div class="dc-cz-variety-bg w-301px h-88px flex items-center justify-between">
                <div class="pl-120px">品种数</div>
                <div class="text-[#435B63]">
                  <span class="text-24px text-white pr-5px">{nVariety.value}</span>种
                </div>
              </div>
              <div class="dc-cz-num-bg w-301px h-88px mt-18px flex items-center justify-between">
                <div class="pl-120px">模型数</div>
                <div class="text-[#435B63]">
                  <span class="text-24px text-white pr-5px">{nModel.value}</span>个
                </div>
              </div>
            </div>

            <div class="mt-25px h-40px w-400px dc-cz-title-bg flex justify-between items-center pl-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-cz-title-icon h-27px w-24px"></div>
                <div class="art-font dc-cz-title-text">品种模型</div>
              </div>
              <div class="dc-cz-right-arrow h-30px w-30px"></div>
            </div>
            <div class="mt-10px w-400px h-230px dc-cz-module-border">
              {modelList.value.length > 0 ? (
                <el-scrollbar>
                  <div class="grid grid-cols-2 gap-3 justify-items-center cursor-pointer p-[20px] pt-0">
                    {modelList.value.map((item, index) => (
                      <>
                        {item.activated ? (
                          <div
                            class="w-185px h-176px dc-cz-active-model flex justify-center items-center relative"
                            onClick={() => {
                              changeModel(index);
                            }}
                          >
                            <div class="w-70px h-70px absolute top-[50%] left-[50%] dc-cz-model-img">
                              <img src={item.modelImg} class="w-70px h-70px object-contain" />
                            </div>
                            <div class="mt-160px w-160px dc-cz-active-model-text">
                              {item.modelName}
                            </div>
                          </div>
                        ) : (
                          <div
                            class="w-185px h-176px dc-cz-normal-model flex justify-center items-center relative"
                            onClick={() => {
                              changeModel(index);
                            }}
                          >
                            <div class="w-70px h-70px absolute top-[50%] left-[50%] dc-cz-model-img">
                              <img src={item.modelImg} class="w-70px h-70px object-contain" />
                            </div>
                            <div class="mt-160px w-160px h-40px leading-40px text-center">
                              {item.modelName}
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </el-scrollbar>
              ) : (
                <div class="w-full h-full flex justify-center items-center">
                  <div class="growth-datacenter-no-data"></div>
                </div>
              )}
            </div>

            <div class="mt-25px h-40px w-400px dc-cz-title-bg flex justify-between items-center pl-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-cz-title-icon h-27px w-24px"></div>
                <div class="art-font dc-cz-title-text">地块监测</div>
              </div>
              <div class="flex items-center">
                <el-select
                  id="base-select"
                  class="plot-selector mr-10px"
                  v-model={base.value}
                  value-key="id"
                  style={`background-image: url(${imgBase}/select-bg.png); background-size: 100% 100%; width: 200px; height: 24px;`}
                  popper-class="growth-monitoring-model-datacenter-popper"
                  onChange={() => {
                    getPlotList(curModelId);
                  }}
                >
                  {baseList.value.map((item) => (
                    <el-option key={item.id} label={item.name} value={item}></el-option>
                  ))}
                </el-select>
                <div class="dc-cz-right-arrow h-30px w-30px"></div>
              </div>
            </div>
            <div class="mt-10px w-400px h-285px dc-cz-module-border p-2 box-border">
              {plotList.value.length > 0 ? (
                <el-scrollbar>
                  <div class="grid grid-cols-2 gap-3 justify-items-center">
                    {/** 单个卡片 */}
                    {plotList.value.map((item) => (
                      <div class="w-full h-[130px] mb-[10px]">
                        <div
                          style={`background-image: url(${item.modelImg}); background-size: contain; background-position: center; background-repeat: no-repeat;`}
                          class="w-full h-[100px] relative cursor-pointer box-border border border-solid border-[#435B63]"
                          onClick={() => {
                            handleRoute(item);
                          }}
                        >
                          <div
                            class="absolute top-0 left-0 h-[20px] leading-[20px] text-[12px] px-[5px]"
                            style="background-color: rgba(0, 0, 0, 0.659);"
                          >
                            {item.modelName}
                          </div>
                        </div>
                        <div class="flex justify-between mt-[10px] px-[10px]">
                          <div>{item.plotName}</div>
                          <div>
                            {item.isEnableModel ? (
                              <el-button
                                style="color: #01F892; border: 1px solid #01F892; background-color: transparent;"
                                round
                                type="success"
                                onClick={() => {
                                  handleStatusChange(item);
                                }}
                              >
                                <el-icon>
                                  <CircleCheck />
                                </el-icon>
                                <span>启用</span>
                              </el-button>
                            ) : (
                              <el-button
                                style="color: #435B63; border: 1px solid #435B63; background-color: transparent;"
                                round
                                type="danger"
                                onClick={() => {
                                  handleStatusChange(item);
                                }}
                              >
                                <el-icon>
                                  <CircleClose />
                                </el-icon>
                                <span>禁用</span>
                              </el-button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </el-scrollbar>
              ) : (
                <div class="w-full h-full flex justify-center items-center">
                  <div class="growth-datacenter-no-data"></div>
                </div>
              )}
            </div>
          </div>
          {/** 中 */}
          <div class="grow h-full px-[20px] grid grid-cols-1 content-end relative">
            {/** 周期列表 */}
            {cycleNameList.value.length > 0 && (
              <div class="w-[1032px] h-[120px] absolute top-[0px] left-0 mx-[20px] mt-[30px] flex justify-center flex-wrap content-center">
                {cycleNameList.value.length < 6 ? (
                  /**
                   * 周期数不足5个 不展示最左和最右的箭头 整体剧中
                   * 指向当前展示周期的指针跟随选中的周期
                   */
                  <div class="w-full flex">
                    {/** 最左箭头 */}
                    <div
                      class="cycle-item cursor-pointer p-[15px] box-border"
                      onClick={() => {
                        leftArrowClick();
                      }}
                    >
                      <div class={0 < curItem ? 'left-arrow' : 'left-arrow-disable'}></div>
                    </div>
                    <div class="w-[837px] h-[100px] flex justify-center">
                      {cycleNameList.value.map((e, i, arr) => (
                        <div class="flex">
                          {/** 周期名称展示 */}
                          <div
                            class={
                              i === curItem
                                ? 'cycle-item chosen-cycle relative'
                                : e.growth === curRealPeriod.value
                                  ? 'cycle-item cur-cycle relative'
                                  : 'cycle-item normal-cycle relative'
                            }
                            onClick={() => {
                              handleClick(i);
                            }}
                          >
                            <span>{e.growth}</span>
                            {/** 当前物候期提示文字 */}
                            {e.growth === curRealPeriod.value ? (
                              <div class="absolute top-[71px]">
                                <span>{'(当前物候期)'}</span>
                              </div>
                            ) : null}
                            {/** 指向当前展示周期的指针 */}
                            {i === curItem ? <div class="cur-arrow"></div> : null}
                          </div>
                          {/** 周期之间的箭头 */}
                          {i != arr.length - 1 ? (
                            <div class="cycle-item px-[33.5px] py-[23px] box-border">
                              <div class="next-arrow"></div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    {/** 最右箭头 */}
                    <div
                      class="cycle-item cursor-pointer p-[15px] box-border"
                      onClick={() => {
                        rightArrowClick();
                      }}
                    >
                      <div
                        class={
                          cycleNameList.value.length - 1 > curItem
                            ? 'right-arrow'
                            : 'right-arrow-disable'
                        }
                      ></div>
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
                      onClick={() => {
                        leftArrowClick();
                      }}
                    >
                      <div class={0 < curItem ? 'left-arrow' : 'left-arrow-disable'}></div>
                    </div>
                    {/** 指向当前展示周期的指针 */}
                    <div class="cur-arrow cur-arrow-center"></div>
                    {/** 周期展示 */}
                    <div class="w-[837px] h-[100px] overflow-hidden">
                      <div class="flex relative" style={`left: ${offsetLeft.value}px;`}>
                        {cycleNameList.value.map((e, i, arr) => (
                          <div class="flex">
                            {/** 周期名称展示 */}
                            <div
                              class={
                                i === curItem
                                  ? 'cycle-item chosen-cycle relative'
                                  : e.growth === curRealPeriod.value
                                    ? 'cycle-item cur-cycle relative'
                                    : 'cycle-item normal-cycle relative'
                              }
                              onClick={() => {
                                handleClick(i);
                              }}
                            >
                              <span>{e.growth}</span>
                              {/** 当前物候期提示文字 */}
                              {e.growth === curRealPeriod.value ? (
                                <div class="absolute top-[71px]">
                                  <span>{'(当前物候期)'}</span>
                                </div>
                              ) : null}
                            </div>
                            {/** 周期之间的箭头 */}
                            {i != arr.length - 1 ? (
                              <div class="cycle-item px-[33.5px] py-[23px] box-border">
                                <div class="next-arrow"></div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/** 最右箭头 */}
                    <div
                      class="cycle-item cursor-pointer p-[15px] box-border"
                      onClick={() => {
                        rightArrowClick();
                      }}
                    >
                      <div
                        class={
                          cycleNameList.value.length - 1 > curItem
                            ? 'right-arrow'
                            : 'right-arrow-disable'
                        }
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/** 模型图片 */}
            {cycleMap.value.get(curPeriod.value) && cycleMap.value.get(curPeriod.value).tips ? (
              <div class="center-model flex justify-center text-center pt-[50px] box-border z-2">
                <div class="w-fit h-fit relative">
                  <img
                    src={cycleMap.value.get(curPeriod.value).imgId}
                    class="object-contain h-[390px]"
                  />
                  <div class="dc-video-border">
                    <div class="absolute top-[11px] left-[106.53px] text-white text-[14px]">
                      种植技术视频
                    </div>
                    <div
                      class="absolute top-0 right-0 w-[205px] h-[150px] bg-transparent z-10 cursor-pointer"
                      onClick={() => {
                        handleClickVideo();
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : null}
            <div class="absolute bottom-250px left-137px w-801px h-240px cz-base"></div>
            {/** 周期事项 */}
            <div class="w-1032px h-40px dc-cz-title-bg-lg flex justify-between items-center pl-23px pb-10px box-border z-2">
              <div class="flex h-40px items-center">
                <div class="dc-cz-title-icon h-27px w-24px"></div>
                <div class="art-font dc-cz-title-text">
                  周期事项-{curPeriod.value}（{curCycle.value}天）
                </div>
              </div>
              <div class="dc-cz-right-arrow h-30px w-30px"></div>
            </div>
            <div class="mt-10px w-1032px h-230px dc-cz-module-border-lg box-border p-5">
              {curTips.value.length ? (
                <el-scrollbar>
                  <el-timeline class="ps-[110px] pt-[10px] cz-timeline">
                    {curTips.value.map((item, index) => (
                      <el-timeline-item key={index} placement="top" class="relative">
                        <div class="w-[95%] tip-bg p-20px text-[#CDDEE3]">{item.itemContent}</div>
                        <div class="absolute top-0 left-[-110px] w-[90px] h-[19px] text-[18px] leading-[19px] text-[#01F892] flex justify-end">
                          <div class="text-center tracking-widest">
                            {item.itemName}
                            <div>{item.remark1 ? `（${item.remark1}天）` : ''}</div>
                          </div>
                        </div>
                        <div
                          class="absolute top-[10px] left-[-11px] w-33px h-1px"
                          style="border-top: 1px dashed #01F892"
                        ></div>
                        {!(index === curTips.value.length - 1) && (
                          <div>
                            <div class="absolute top-[30px] left-[-8px] line-small-mark"></div>
                            <div class="absolute top-[50px] left-[-8px] line-small-mark"></div>
                            <div class="absolute top-[70px] left-[-8px] line-small-mark"></div>
                            <div class="absolute top-[90px] left-[-8px] line-small-mark"></div>
                          </div>
                        )}
                      </el-timeline-item>
                    ))}
                  </el-timeline>
                </el-scrollbar>
              ) : (
                <div class="w-full h-[230px] flex justify-center items-center">
                  <div class="growth-datacenter-no-data"></div>
                </div>
              )}
            </div>
          </div>
          {/** 右 */}
          <div class="w-[400px] h-full z-2">
            <div class="h-40px w-400px dc-cz-title-bg flex justify-between items-center pl-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-cz-title-icon h-27px w-24px"></div>
                <div class="art-font dc-cz-title-text">指标监测</div>
              </div>
              <div class="dc-cz-right-arrow h-30px w-30px"></div>
            </div>
            <div class="mt-10 w-400px h-350px dc-cz-module-border-sm">
              <el-scrollbar>
                {indicatorList.value.length ? (
                  <div class="grid grid-cols-2 justify-items-center">
                    {indicatorList.value.map((item, index) => (
                      <div
                        class="cursor-pointer"
                        onClick={() => {
                          handleIndicatorClick(index);
                        }}
                      >
                        {item.selected ? (
                          <>
                            <div class="w-132px dc-cz-active-model-text text-[18px] mb-20px">
                              {item.name}
                            </div>
                            <div
                              class={`${item.name.includes('气象') ? 'active-weather' : item.name.includes('土壤') ? 'active-soil' : 'active-phenology'} mb-20px`}
                            ></div>
                          </>
                        ) : (
                          <>
                            <div class="w-132px dc-cz-normal-indicator-text text-[18px] mb-20px">
                              {item.name}
                            </div>
                            <div
                              class={`${item.name.includes('气象') ? 'weather' : item.name.includes('土壤') ? 'soil' : 'phenology'} mb-20px`}
                            ></div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="w-[400px] h-[350px] flex justify-center items-center">
                    <div class="growth-datacenter-no-data"></div>
                  </div>
                )}
              </el-scrollbar>
            </div>

            <div class="mt-25px h-40px w-400px dc-cz-title-bg flex justify-between items-center pl-23px pb-10px box-border">
              <div class="flex h-40px items-center">
                <div class="dc-cz-title-icon h-27px w-24px"></div>
                <div class="art-font dc-cz-title-text">模型要素分析</div>
              </div>
              <div class="dc-cz-right-arrow h-30px w-30px"></div>
            </div>
            <div class="mt-10px w-400px h-445px dc-cz-module-border-md">
              <div class="relative">
                {/** 没有要素信息的提示 */}
                {curFactor.value.size ? null : (
                  <div
                    class="z-999 absolute top-0 left-1px w-[398px] h-[444px] flex justify-center items-center"
                    style="background: black;"
                  >
                    <div class="growth-datacenter-no-data"></div>
                  </div>
                )}
                <div class="w-full flex flex-col items-center">
                  {/** ECharts图 */}
                  <div id="chart" class="w-[400px] h-[254px]"></div>
                  {/** 要素信息表格 */}
                  {curFactorData.value.length ? (
                    <div class="text-[14px] border border-solid border-[#35DA95]">
                      <div
                        class="text-center w-[380px] h-[30px] leading-[30px]"
                        style="background: linear-gradient( 270deg, rgba(53,218,149,0) 0%, rgba(53,218,149,0.3) 51%, rgba(53,218,149,0) 100%);"
                      >
                        要素描述
                      </div>
                      <el-table
                        data={curFactorData.value}
                        height="150"
                        style={{ width: '380px' }}
                        row-style={(data) => {
                          let curBgColor =
                            (Number(data.rowIndex) + 2) % 2 === 0
                              ? 'rgba(1, 248, 146, 0.1)'
                              : 'transparent';
                          return {
                            'background-color': curBgColor,
                            height: '45px',
                            'font-size': '16px'
                          };
                        }}
                        header-row-style={{
                          'background-color': 'transparent',
                          height: '45px',
                          'font-size': '16px'
                        }}
                        header-cell-style={{ color: '#01F892' }}
                      >
                        <el-table-column label="范围" align="center">
                          {({ row }) => {
                            return `${row.lowLimit}${row.unit} ~ ${row.highLimit}${row.unit}`;
                          }}
                        </el-table-column>
                        <el-table-column
                          label="健康值"
                          prop="healthRatio"
                          align="center"
                          width="65px"
                        />
                        <el-table-column label="要素结果" prop="indicatorResult" align="center" />
                      </el-table>
                    </div>
                  ) : (
                    <div class="w-[370px] h-[170px] flex justify-center items-center">
                      <div class="growth-datacenter-no-data"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Dialog
            v-model={showVideoDialog.value}
            title="种植技术视频"
            width={1280}
            onClose={() => {
              handleCloseVideo();
            }}
            top="80px"
          >
            <div id="dplayer">查看视频</div>
          </Dialog>
        </div>
      );
    };

    return () => {
      if (hiddenHeader.value && !isChazhu.value) return <MainContainer />;
      if (hiddenHeader.value && isChazhu.value) return <ChazhuContainer />;
      return (
        <div class="bg-[#0B2131] w-full h-full select-none">
          <BigscreenAdapter>
            <BigscreenContainer
              backgroundImage={bgImage.value}
              key={bgImage.value}
              style="background-color: transparent;"
            >
              {/** 头部 */}
              <Header
                height={headerHeight}
                bgImg={headerBg}
                title={title}
                titleHeight={titleHeight}
                titleWidth={titleWidth}
              ></Header>
              {/** 内容 */}
              <MainContainer />
            </BigscreenContainer>
          </BigscreenAdapter>
        </div>
      );
    };
  }
});
</script>
<style lang="scss">
.dc-title-bg {
  background: {
    image: url(./assets/title-bg.png);
    size: 100% 100%;
  }
}

.dc-title-bg-lg {
  background-image: url(./assets/title-bg-lg.png);
  background-size: 100% 100%;
}

.dc-image-contain {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.dc-title-icon {
  @extend .dc-image-contain;
  background-image: url(./assets/title-icon.png);
}

.dc-right-arrow {
  @extend .dc-image-contain;
  background-image: url(./assets/title-right-arrow.png);
}

.dc-title-text {
  font-size: 20px;
  letter-spacing: 0.025em;
  background-image: linear-gradient(180deg, #ffffff 15%, #a9ffe1 100%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}

.dc-variety-bg {
  background-image: url(./assets/variety-bg.png);
  background-size: 100% 100%;
}

.dc-num-bg {
  background-image: url(./assets/num-bg.png);
  background-size: 100% 100%;
}

.dc-module-border {
  background-image: url(./assets/card/card-bg.png);
  background-size: 100% 100%;
}

.dc-module-border-lg {
  background-image: url(./assets/card-bg-lg.png);
  background-size: 100% 100%;
}

.dc-module-border-sm {
  background-image: url(./assets/card-bg-sm.png);
  background-size: 100% 100%;
}

.dc-module-border-md {
  background-image: url(./assets/card-bg-md.png);
  background-size: 100% 100%;
}

.plot-selector {
  /** 去掉el-selector的背景和边框 */
  :deep(.el-select__wrapper) {
    background-color: transparent;
    box-shadow: none;
  }

  /** 改变el-selector的文字颜色 */
  :deep(.el-select__placeholder) {
    color: #35dad2;
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
  color: #00ff73;
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

/** 周期事项 */
.line-mark {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/line-mark.png);
  background-size: 100% 100%;
  width: 33px;
  height: 1px;
}
.line-small-mark {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/line-small-mark.png);
  background-size: 100% 100%;
  width: 9px;
  height: 1px;
}
/** 周期事项 end */

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
  color: #1dffff;
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

.growth-datacenter-no-data {
  background: {
    image: url(../bigscreenModel/assets/null.png);
    size: contain;
    position: center;
    repeat: no-repeat;
  }
  width: 160px;
  height: 160px;
}

.dc-cz-title-bg {
  background: {
    image: url(./assets/chazhu/title-bg.png);
    size: 100% 100%;
  }
}

.dc-cz-title-bg-lg {
  background-image: url(./assets/chazhu/title-bg-lg.png);
  background-size: 100% 100%;
}

.dc-cz-title-icon {
  @extend .dc-image-contain;
  background-image: url(./assets/chazhu/title-icon.png);
}

.dc-cz-right-arrow {
  @extend .dc-image-contain;
  background-image: url(./assets/chazhu/title-right-arrow.png);
}

.dc-cz-title-text {
  font-size: 20px;
  letter-spacing: 0.025em;
  background: linear-gradient(90deg, #ffffff 0%, #a9ffdb 100%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}

.dc-cz-variety-bg {
  background-image: url(./assets/chazhu/variety-bg.png);
  background-size: 100% 100%;
}

.dc-cz-num-bg {
  background-image: url(./assets/chazhu/model-bg.png);
  background-size: 100% 100%;
}

.dc-cz-module-border {
  background-image: url(./assets/chazhu/card-bg.png);
  background-size: 100% 100%;
}

.dc-cz-module-border-lg {
  background-image: url(./assets/chazhu/card-bg-lg.png);
  background-size: 100% 100%;
}

.dc-cz-module-border-sm {
  background-image: url(./assets/chazhu/card-bg-sm.png);
  background-size: 100% 100%;
}

.dc-cz-module-border-md {
  background-image: url(./assets/chazhu/card-bg-md.png);
  background-size: 100% 100%;
}

.dc-cz-normal-model {
  @extend .dc-image-contain;
  background-image: url(./assets/chazhu/normal-model.png);
  background-size: 100% 100%;
}

.dc-cz-active-model {
  @extend .dc-image-contain;
  background-image: url(./assets/chazhu/active-model.png);
  background-size: 100% 100%;
}

.dc-cz-active-model-text {
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(19, 126, 81, 0) 0%,
    rgba(19, 126, 81, 0.3) 51%,
    rgba(19, 126, 81, 0) 100%
  );
  border: 1px solid;
  border-image: linear-gradient(
      90deg,
      rgba(1, 248, 146, 0),
      rgba(1, 248, 146, 1),
      rgba(1, 248, 146, 0)
    )
    1 1;
  color: #01f892;
  line-height: 40px;
  text-align: center;
}

.dc-cz-model-img {
  transform: translate(-50%, -50%);
}

.dc-cz-normal-indicator-text {
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(19, 126, 90, 0) 0%,
    rgba(19, 126, 90, 0.3) 51%,
    rgba(19, 126, 90, 0) 100%
  );
  border: 1px solid;
  border-image: linear-gradient(
      90deg,
      rgba(109, 233, 207, 0),
      rgba(29, 255, 255, 1),
      rgba(59, 206, 161, 0)
    )
    1 1;
  color: #36e9e9;
  line-height: 40px;
  text-align: center;
}

.active-weather {
  @extend .weather;
  background-image: url(./assets/chazhu/weather.png);
}

.active-soil {
  @extend .soil;
  background-image: url(./assets/chazhu/soil.png);
}

.active-phenology {
  @extend .phenology;
  background-image: url(./assets/chazhu/phenology.png);
}

.tip-bg {
  background-image: url(./assets/chazhu/tip-bg.png);
  background-size: 100% 100%;
}

.cz-base {
  @extend .dc-image-contain;
  background-image: url(./assets/chazhu/base.png);
}

.dc-video-border {
  width: 299px;
  height: 203px;
  background-image: url(./assets/video.png);
  background-size: 100% 100%;
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-100%);
}
</style>
<style lang="scss" scoped>
:deep(.el-timeline-item__timestamp) {
  color: #35dad2;
  font-size: 16px;
}

:deep(.el-timeline-item__tail) {
  border-color: #435b63;
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
:deep(.cz-timeline .el-timeline-item__node) {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  background-image: url(./assets/chazhu/mark.png);
  width: 17px;
  height: 17px;
  top: -1px;
  left: -3px;
}
:deep(.el-timeline-item__timestamp) {
  display: none;
}
:deep(.el-select--small .el-select__wrapper) {
  font-size: 14px;
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
:deep(.el-tabs--card > .el-tabs__header) {
  height: 20px;
}

/** 要素表格 */
:deep(.el-table--border th.el-table__cell, .el-table td.el-table__cell) {
  border-bottom: none !important;
}

:deep(.el-table--border .el-table__cell) {
  border-right: none !important;
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
:deep(.el-table .el-table__header-wrapper th, .el-table--border) {
  background-color: transparent !important;
  color: #35dad2;
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
$growth-monitoring-model-datacenter-screen-width: calc(
  var(--growth-monitoring-model-datacenter-screen-width)
);
$growth-monitoring-model-datacenter-screen-height: calc(
  var(--growth-monitoring-model-datacenter-screen-height)
);

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
