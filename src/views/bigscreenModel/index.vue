
<script  lang='tsx'>
import { ref, onMounted } from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import mainBg from './assets/mainBg.png'
import headerBg from './assets/headerBg.png'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions,
} from "../../utils/bigscreenTool/index";
const {
  BigscreenAdapter,
  BigscreenContainer,
  BigscreenHeader,
  BigscreenFooter,
  BigscreenMain,
  BigscreenCard,

  BigscreenTab,
  // BigscreenSelector,
  BigscreenTable
} = BigscreenBuilder
export default defineComponent({
  name: 'BigscreenTest',
  setup() {
    const numVal=ref(1)
    const rightNum =ref(1)
    //模型周期tab
    const tabNum=(val)=>{
      console.log(val,'valval')
    }
    //雷达图
    const drawRadarChart = () => {
   initChartStatic('radarChart', {
    title: {
      // text: '评估评分占比分析图'
    },
    tooltip: {},
    radar: [
          {
            indicator:  [
          { name: 'EC值'  },
          { name: '土壤湿度'  },
          { name: '土壤温度' },
          { name: '土壤PH值' },
          { name: '温度' },
        ],
        name: {
          textStyle: {
            fontSize: 15,
            color: '#666666',
            fontWeight: 'bold'
          }
        },
        splitArea: {
          // 坐标轴在 grid 区域中的分隔区域，默认不显示。
          show: true,
          areaStyle: {
            // 分隔区域的样式设置。
            color: '#18303a' // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
          }
        },
        axisLine: {
          // 设置雷达图中间射线的颜色
          lineStyle: {
            color: '#rgba(241, 241, 241)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(241, 241, 241)'
          }
        }
      }
    ],
    series: [
      {
        name: '模型要素',
        type: 'radar',
        data: [
          {
            value: [40,15,20,35,17],
            name: '模型要素',
            itemStyle: {
              normal: {
                color: 'rgba(198, 234, 230)',
                lineStyle: {
                  color: 'rgba(0, 157, 143)'
                }
              }
            }
          }
        ],
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '',
          borderColor: '',
          borderWidth: 2
        },
        areaStyle: {
          color: '#26eae7'
        }
      }
    ]
  })
}
  //温度
  const initChartLine= async ()=>{
      initChartStatic(
        "chartLine",
        generateBaseOptions({
          xAxis: {
            data: [ '7/22','7/21','7/20','7/19','7/18','7/17'],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
          },
          legend: {
            show: false,
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
          yAxis: {
            type: "value",
            name:'单位：℃',
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#fff", //网格线颜色
                width: 1, //网格线的加粗程度
                type: "dashed", //网格线类型
              },
            },
            splitArea: {
              //网格区域
              show: false, //是否显示
            },
          },
          color:['#34d9d1'],
          series: [
            {
              name: '温度折线图',
              data: [15,25,20,30,28,40],
              type: "line",
              smooth: false,
              symbol:"none",
              barGap:'70%',
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#eee",
                  fontSize: 10,
                },
              },
              areaStyle: {
                color: '#18565c'
              }
            },
          ],
          grid: {
            left: "10%",
            right: "4%",
            top: "20%",
            bottom: "15%",
          },
        })
      );

}
  //湿度
  const initChartLine2= async ()=>{
      initChartStatic(
        "chartLine2",
        generateBaseOptions({
          xAxis: {
            data: [ '7/22','7/21','7/20','7/19','7/18','7/17'],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
          },
          legend: {
            show: false,
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
         color:['#34d9d1'],
          yAxis: {
            type: "value",
            name:'单位：RH',
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#fff", //网格线颜色
                width: 1, //网格线的加粗程度
                type: "dashed", //网格线类型
              },
            },
            splitArea: {
              //网格区域
              show: false, //是否显示
            },
          },
          series: [
            {
              name: '湿度折线图',
              data: [18,28,20,30,28,40],
              type: "line",
              smooth: false,
              barGap:'70%',
              symbol:'none',
              areaStyle: {
                color: '#18565c'
              }
            },
          ],
          grid: {
            left: "10%",
            right: "4%",
            top: "20%",
            bottom: "15%",
          },
        })
      );

}
onMounted(()=>{
  drawRadarChart()
  initChartLine()
  initChartLine2()
})
  //模型要素切换
  const tabFn=(val)=>{
    rightNum.value=val
  }
    //中间内容
    const MainContent=()=>{
      return (
        <div class='w-100% h-100% grid  gap-15px '  style="grid-template-columns: 25% calc(50% - 30px) 25%; grid-auto-rows: 100%;">
          {/* 左侧 */}
          <div class="grid gap-15px " style="grid-template-rows: 32% 32% calc(36% - 30px); grid-auto-rows: 100%;">
            {/* 模型监测 */}
            <div class="w-100% h-100%">
              <div class='box-title '>模型监测</div>
              <div class="box-item flex justify-center items-center flex-col">
                <div class="flex w-100% h-50% items-center justify-center">
                  <div class='left-icon-1 mr-15px'></div>
                  <div class="w-45% h-100% flex flex-col justify-center">
                    <div class="flex w-90% ml-[25px] mb-[-10px] items-center justify-between"> <div class="color-[#8a969c]">监测评分</div><div class="color-[#fff] text-xl">92.8<span class="color-[#304650] ml-10px text-14px">分</span></div></div>
                    <div class="xian w-100% h-20px"></div>
                  </div>
                </div>
                <div class="flex w-100% h-50% items-center justify-center">
                  <div class='left-icon-2 mr-15px'></div>
                  <div class="w-45% h-100% flex flex-col justify-center">
                    <div class="flex w-90% ml-[25px] mb-[-10px] items-center justify-between"> <div class="color-[#8a969c]">健康评估</div><div class="color-[#fff] text-xl">优秀</div> </div>
                    <div class="xian w-100% h-20px"></div>
                  </div>

                </div>
              </div>
            </div>
            {/* 地块信息 */}
            <div class="w-100% h-100%">
              <div class='box-title '>地块信息</div>
              <div class="box-item">
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">基地名称：</div>
                  <div class="color-[#fff]">稻花明月基地</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">地块名称：</div>
                  <div class="color-[#fff]">东三地块连梗11号水稻种植地块</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">种植品种：</div>
                  <div class="color-[#fff]">连梗11号</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">地块面积：</div>
                  <div class="color-[#fff]">100亩</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">预计产量：</div>
                  <div class="color-[#fff]">100000Kg</div>
                </div>
                <div class="left-plot flex items-center">
                  <div class=" color-[#6f8890]" style="text-indent:1.5rem;">经营人：</div>
                  <div class="color-[#fff]">张三</div>
                </div>

              </div>
            </div>
            {/* 模型周期 */}
            <div class="w-100% h-100%">
              <div class="box-title">模型周期</div>
              <div class="box-item pb-[15px] box-border" style="overflow:none;">
                <div class="grid grid-cols-4">
                  <div class={numVal.value==1?'left-active':'left-actived'} style="cursor: pointer; width:100%;" onClick={()=>{numVal.value=1}} >播种期</div>
                  <div class={numVal.value==2?'left-active':'left-actived'} style="cursor: pointer; width:100%;" onClick={()=>{numVal.value=2}}>出苗期</div>
                  <div class={numVal.value==3?'left-active':'left-actived'} style="cursor: pointer;width:100%;" onClick={()=>{numVal.value=3}}>拔节期</div>
                  <div class={numVal.value==4?'left-active':'left-actived'} style="cursor: pointer;width:100%;" onClick={()=>{numVal.value=4}}>成熟期</div>
                </div>
                <div class='w-100% mt-10px' style="height:calc(100% - 40px)">
                  <div class="flex items-center text-16px color-[#33d1ca]"><div class="w-3px ml-10px h-10px bg-[#33d1ca] mr-15px"></div> 周期事项</div>
                  <div class='mt-15px'>
                    <div class="flex ml-10px h-110px mb-10px">
                      <div class='color-[#33d1ca] text-xl'>1</div>
                      <div class="mx-15px flex flex-col items-center ">
                        <div class="left3-pie w-40px h-35px mr-[-13px]"></div>
                        <div class="w-2px h-110px mt-[-9px] mr-[-10px] bg-[#435b63]"></div>
                      </div>
                      <div class=" w-75% px-20px h-70px py-10px left3-meassage">
                        <div class='color-[#33d1ca] text-lg ml-5px'>种植前事项</div>
                        <div class="color-[#9db1b7] text-sm">苗期追肥具有促根、‌壮苗、‌促叶、‌壮秆等作用。‌一般在定苗后至拔节期进行。‌</div>
                      </div>
                    </div>
                    <div class="flex ml-10px mb-20px mt-[-20px] h-[120px]" style="overflow:hidden">
                      <div class='color-[#33d1ca] text-xl'>2</div>
                      <div class="mx-15px flex  flex-col items-center">
                        <div class="left3-pie w-40px h-35px mr-[-13px]"></div>
                        <div class="w-2px h-70px mt-[-9px] mr-[-10px] bg-[#435b63]"></div>
                      </div>
                      <div class=" w-75% px-20px py-10px h-70px left3-meassage">
                        <div class='color-[#33d1ca] text-lg ml-5px'>水分供应</div>
                        <div class="color-[#9db1b7] text-sm"> 三类苗、‌移栽苗、‌未施基肥或种肥的地块、‌低洼潮湿的地块和套，‌要早追、‌重追提苗肥。‌</div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          {/* 中间 */}
          <div class='middle-main-wrapper'>
            <div class='middle-main-item color-[#fff]'>
              <div class="main-pie w-90px h-90px flex flex-col items-center justify-center left-30% top-25%">
                <div class="text-14px">0.5ms/cm</div>  
                <div class="text-10px mt-5px">土壤EC</div>  
              </div>  
              <div class="main-pie w-90px h-90px flex flex-col items-center justify-center left-25% bottom-10%">
                <div class="text-14px">26.5℃</div>  
                <div class="text-10px mt-5px">土壤温度</div>  
                <div class="text-10px ">(-20cm)</div>  
              </div>  
              <div class="main-pie w-90px h-90px flex flex-col items-center justify-center  left-40% bottom-15%">
                <div class="text-14px">26.5℃</div>  
                <div class="text-10px mt-5px">土壤温度</div>  
                <div class="text-10px ">(-10cm)</div>  
              </div>  
              <div class="main-pie w-90px h-90px flex flex-col items-center justify-center right-25% bottom-10%">
                <div class="text-14px">26.5%</div>  
                <div class="text-10px mt-5px">土壤湿度</div>  
                <div class="text-10px">(-20cm)</div>  
              </div>  
              <div class="main-pie w-90px h-90px flex flex-col items-center justify-center right-40% bottom-25%">
                <div class="text-14px">26.5%</div>  
                <div class="text-10px mt-5px">土壤湿度</div>  
                <div class="text-10px">(-10cm)</div>  
              </div>  
              <div class="main-pie w-90px h-90px flex flex-col items-center justify-center right-30% top-20%">
                <div class="text-14px">0.5ms/cm</div>  
                <div class="text-10px mt-5px">土壤EC</div>  
              </div>  
            </div>
            <div style="height:calc(100% - 750px)" class='flex w-100% justify-evenly'>
              <div class="w-47% h-100%">
                <div class="box-title">温度折线图</div>
                <div class="box-item">
                  <div id="chartLine" class="w-100% h-100%"></div>
                </div>
              </div>
              <div class="w-47% h-100%">
                <div class="box-title">湿度折线图</div>
                <div class="box-item">
                  <div id="chartLine2" class="w-100% h-100%"></div>
                </div>
              </div>
            </div>
          </div>
          {/* 右侧 */}
          <div class="grid grid-rows-2 gap-20px " style="grid-template-rows: 49% calc(51% - 20px); grid-auto-columns: 100%;">
            <div>
              <div class="box-title">种植计划</div>
              <div class="box-item flex flex-col">
                <div class="flex justify-around ">
                  <div class="flex flex-col items-center">
                    <div class='w-20px h-20px right-warpper-bg' ></div>
                    <div class="w-2px h-90px mt-[-5px] bg-[#435b63]"></div>
                  </div>
                  <div class="w-85% left3-meassage h-75px px-[20px] box-border py-10px">
                    <div class="color-[#fff] flex justify-between items-center text-17px">
                      <div>施肥</div>
                      <div class="right-xian"></div>
                      <div>水稻种植地块</div>
                    </div>
                    <div class="flex text-14px mt-10px color-[#7c97a0] items-center">
                      <div>张三</div>
                      <div class="w-1px h-10px mx-10px bg-[#44656c]"></div>
                      <div>2024.7.1-2024.7.5</div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-around my-15px">
                  <div class="flex flex-col items-center">
                    <div class='w-20px h-20px right-warpper-bg mt-[-25px]' ></div>
                    <div class="w-2px h-90px mt-[-5px] bg-[#435b63]"></div>
                  </div>
                  <div class="w-85% left3-meassage   h-75px  px-[20px] box-border py-10px">
                    <div class="color-[#fff] flex justify-between items-center text-17px">
                      <div>浇水</div>
                      <div class="right-xian"></div>
                      <div>水稻种植地块</div>
                    </div>
                    <div class="flex text-14px mt-10px color-[#7c97a0] items-center">
                      <div>张三</div>
                      <div class="w-1px h-10px mx-10px bg-[#44656c]"></div>
                      <div>2024.7.1-2024.7.5</div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-around">
                  <div class="flex flex-col items-center">
                    <div class='w-20px h-20px right-warpper-bg mt-[-25px]' ></div>
                    <div class="w-2px h-90px mt-[-5px] bg-[#435b63]"></div>
                  </div>
                  <div class="w-85% left3-meassage  h-75px  px-[20px] box-border py-10px">
                    <div class="color-[#fff] flex justify-between items-center text-17px">
                      <div>施肥</div>
                      <div class="right-xian"></div>
                      <div>水稻种植地块</div>
                    </div>
                    <div class="flex text-14px mt-10px color-[#7c97a0] items-center">
                      <div>张三</div>
                      <div class="w-1px h-10px mx-10px bg-[#44656c]"></div>
                      <div>2024.7.1-2024.7.5</div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-around mt-15px">
                  <div class="flex flex-col items-center">
                    <div class='w-20px h-20px right-warpper-bg mt-[-25px]' ></div>
                    <div class="w-2px h-90px mt-[-5px] bg-[#435b63]"></div>
                  </div>
                  <div class="w-85% left3-meassage  h-75px  px-[20px] box-border py-10px">
                    <div class="color-[#fff] flex justify-between items-center text-17px">
                      <div>浇水</div>
                      <div class="right-xian"></div>
                      <div>水稻种植地块</div>
                    </div>
                    <div class="flex text-14px mt-10px color-[#7c97a0] items-center">
                      <div>张三</div>
                      <div class="w-1px h-10px mx-10px bg-[#44656c]"></div>
                      <div>2024.7.1-2024.7.5</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="box-title">模型要素</div>
              <div class="box-item">
                <div class='flex justify-evenly'>
                  <div onClick={()=>{ tabFn(1) }} style="cursor:pointer;" class={rightNum.value==1?'right-active':'right-actived'}>气象指标</div>
                  <div onClick={()=>{ tabFn(2) }} style="cursor:pointer;" class={rightNum.value==2?'right-active':'right-actived'}>土壤指标</div>
                  <div onClick={()=>{ tabFn(3) }} style="cursor:pointer;" class={rightNum.value==3?'right-active':'right-actived'}>物候指标</div>
                </div>
                <div id="radarChart" class='w-100%  mt-10px' style="height: calc(100% - 80px);"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return () => (
      <div class="bg-[#0b212c] w-[100vw] h-[100vh]">
                <BigscreenAdapter>
                    <BigscreenContainer backgroundImage={mainBg} >
                        <BigscreenHeader
                            backgroundImage={headerBg}
                            class="!bg-[#0b212c]"
                            v-slots={{
                                left: () => (
                                    <div class="flex space-x-4 relative">
                                        <BackOrHome />
                                    </div>
                                ),
                                right: () => (
                                    <BigScreenTime />
                                ),
                                default: () => (
                                    <div class="art-font tracking-wide color-[#caffec]">连梗11号模型概览</div>
                                )
                            }}
                        ></BigscreenHeader>
                        <BigscreenMain
                            v-slots={{
                              default: () => {
                                return MainContent()
                              }

                            }}
                        />
                        <BigscreenFooter height="30px" />
                    </BigscreenContainer>
                </BigscreenAdapter>
            </div>
    )
  }
})
</script>
<style lang='scss' scoped>
.box-title{
  color:  #caffec;
  font-weight: 550;
  background-size: 100% 100%;
  z-index: 9999;

  text-indent: 4.8rem;
  height: 40px;
  line-height: 35px;
  font-size: 18px;
  background-image: url(./assets/box-title.png);
}
.box-item{
  margin-top: 15px;
  z-index: 9999;
  box-sizing: border-box;
  padding: 10px;
  overflow-y: scroll;
  height: calc( 100% - 55px);
  background-size: 100% 100%;
  background-image: url(./assets/box-Item.png);
}
.box-item::-webkit-scrollbar{
  width:0
}
.xian{
  background-size: 100% 100%;
  background-image: url(./assets/xian.png);
}
.left-plot{
  width: 100%;
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
  background-size: 100% 100%;
  background-image: url(./assets/left-plot.png);
}
.left-active{
  height: 50px;
  line-height: 35px;
  text-align: center;
  color: #1f8384;
  background-size:100% 100%;
  background-image: url(./assets/active.png);
}
.left-actived{
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #afb9bc;
  background-size:100% 100%;
  background-image: url(./assets/actived.png);
}
.right-active{
  width: 130px;
  height: 50px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background-size:100% 100%;
  background-image: url(./assets/right-active.png);
}
.right-actived{
  width: 130px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #afb9bc;
  background-size:100% 100%;
  background-image: url(./assets/right-actived.png);
}
.left3-meassage{
  background-size: 100% 100%;
  background-image: url(./assets/meassage-bg.png);
}
.right-xian{
  width: 50%;
  height: 2px;
  background-size: 100% 100%;
  background-image: url(./assets/right-xian.png)
}
.middle-main-wrapper{
  position: relative;
    width: 100%;
    height: 100%;
    .middle-main-item{
      position: absolute;
      width: 1400px;
      height: 750px;
      left: calc(50% - 700px);
      top: calc(50% - 500px);
      background-size: 100% 100%;
      z-index: -1;
      background-image: url(./assets/main-bg.png);
      position: relative;
    }
}
.left3-pie{
  background-size: 100% 100%;
  background-image: url(./assets/left3-pie.png);
}
.right-warpper-bg{
  background-size: 100% 100%;
  background-image: url(./assets/right-item-bg.png);
}
.main-pie{
  position: absolute;
  color: #1bdbdc;
  background-image: url(./assets/main-pie.png);
  background-size: 100% 100%;
}
@for $i from 1 through 2 {
  .left-icon-#{$i} {
    background-image: url(./assets/left-icon-#{$i}.png);
    background-size: 100% 100%;
    width: 70px;
    height: 70px;
  }
}
</style>