<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
import img1 from './assets/img1.png'
import * as echarts from 'echarts'
import {
  initChartStatic,
  generateBaseOptions
} from '../../utils/bigscreenTool/index'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { jsonData } from './assets/china'
console.log('jsonData', jsonData);
onBeforeUnmount(() => {
  echarts.dispose(document.getElementById("jl_chart1") as HTMLElement)
  echarts.dispose(document.getElementById("jl_chart2") as HTMLElement)
  echarts.dispose(document.getElementById("jl_chart3") as HTMLElement)
})

const initChart1 = async () => {
  initChartStatic(
    'jl_chart1',
    generateBaseOptions({
      xAxis: {
        data: ['喜力', '渝红六号', '樱桃番茄', '金红九', '格雷'],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
          }
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#ffa773', '#36e1d9'],
      yAxis: {
        name: '亩',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#ffffff80', //网格线颜色
            width: 1, //网格线的加粗程度
            type: 'dashed' //网格线类型
          }
        },
        splitArea: {
          //网格区域
          show: false //是否显示
        }
      },
      series: [
        {
          name: '',
          data: [32, 128, 198, 188, 76],
          barWidth: 30,
          type: 'bar',
          smooth: true,
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#eee',
              fontSize: 10
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: '#1bcad600' },
                { offset: 0, color: '#1bcad6' }
              ])
            },
          },
          areaStyle: {normal: {}},
        }
      ],
      grid: {
        left: '8%',
        right: '6%',
        top: '13%',
        bottom: '15%'
      }
    })
  )
}

const initChart2 = async () => {
  initChartStatic(
    'jl_chart2',
    generateBaseOptions({
      yAxis: {
        data: ['台州', '湖北', '山东', '哈尔滨', '四川', '重庆', '浙江'],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
          }
        }
      },
      legend: {
        show: true,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#ffa773', '#36e1d9'],
      xAxis: {
        name: '万元',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#ffffff80', //网格线颜色
            width: 1, //网格线的加粗程度
            type: 'dashed' //网格线类型
          }
        },
        splitArea: {
          //网格区域
          show: false //是否显示
        }
      },
      series: [
        {
          name: '',
          data: [2321, 3021, 3508, 4268, 4771, 5867, 7632],
          barWidth: 20,
          type: 'bar',
          smooth: true,
          label: {
            show: true, //开启显示
            position: 'right', //在上方显示
            textStyle: {
              //数值样式
              color: '#eee',
              fontSize: 10
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#1bcad600' },
                { offset: 1, color: '#1bcad6' }
              ])
            },
          },
          areaStyle: {normal: {}},
        }
      ],
      grid: {
        left: '8%',
        right: '10%',
        top: '10%',
        bottom: '15%'
      }
    })
  )
}

const initChart3 = async () => {
  initChartStatic(
    'jl_chart3',
    generateBaseOptions({
      xAxis: {
        data: ['10月', '11月', '12月', '1月', '2月'],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
          }
        }
      },
      legend: {
        show: true,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#ffa773', '#36e1d9'],
      yAxis: {
        name: '万元',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#ffffff80', //网格线颜色
            width: 1, //网格线的加粗程度
            type: 'dashed' //网格线类型
          }
        },
        splitArea: {
          //网格区域
          show: false //是否显示
        }
      },
      series: [
        {
          name: '喜力',
          data: [32, 128, 198, 188, 76],
          type: 'line',
          smooth: true,
        },
        {
          name: '红满园',
          data: [312, 18, 98, 18, 96],
          type: 'line',
          smooth: true,
        },
        {
          name: '樱桃番茄',
          data: [321, 12, 98, 128, 76],
          type: 'line',
          smooth: true,
        },
        {
          name: '金红九',
          data: [312, 128, 18, 188, 176],
          type: 'line',
          smooth: true,
        },
        {
          name: '格雷',
          data: [32, 28, 198, 188, 76],
          type: 'line',
          smooth: true,
        },
      ],
      grid: {
        left: '8%',
        right: '6%',
        top: '13%',
        bottom: '15%'
      }
    })
  )
}

const initChinaMap = () => {
  echarts.registerMap('china', jsonData);
  const chartDom = document.getElementById("mainMap");
  const myChart = echarts.init(chartDom)
  myChart.setOption({
    baseOption: {
      geo: {
        aspectScale: 0.9, //长宽比
        map: 'china',
        roam: false,
        itemStyle: {
          borderColor: '#1877cd',
          borderWidth: 2,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [{
              offset: 0,
              color: '#000000' // 0% 处的颜色// 0% 处的颜色
            }, {
              offset: 1,
              color: '#0335b5'  // 100% 处的颜色 // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          },
          shadowColor: '#0938b6',
          shadowOffsetX: -10,
          shadowOffsetY: -10,
          shadowBlur: 19,
          emphasis: {
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [{
                offset: 0,
                color: '#0335b5' // 0% 处的颜色// 0% 处的颜色
              }, {
                offset: 1,
                color: '#fba509'  // 100% 处的颜色 // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            borderWidth: 2,
            borderColor: '#fda809',
          }
        },
      },
      tooltip: {
        show: true,
        className: 'tooltip-frame',
      },
      series: [
        {
          show: false,
          type: 'map',
          map: 'china',
          zoom: 1,
          aspectScale: 0.9,
          itemStyle: {
            borderColor: '#05d6f8',
            borderWidth: 2,
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [{
                offset: 0,
                color: '#012188' // 0% 处的颜色// 0% 处的颜色
              }, {
                offset: 1,
                color: '#0335b5'  // 100% 处的颜色 // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            shadowColor: '#0938b6',
            shadowOffsetX: -10,
            shadowOffsetY: -10,
            shadowBlur: 19,
            emphasis: {
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [{
                  offset: 0,
                  color: '#0335b5' // 0% 处的颜色// 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#fba509'  // 100% 处的颜色 // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              },
              borderWidth: 2,
              borderColor: '#fda809',
            }
          },
          label: {
            show: true,
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '11',
            emphasis: {
              color: '#ffffff',
            }
          },
          tooltip: {
            show: false
          },
        },
      ]
    }
  }, true);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
}

onMounted(() => {
  initChart1()
  initChart2()
  initChart3()
  initChinaMap()
})
</script>
<template>
  <div class="bigscreen-main-wrapper">
    <div class="header-main-wrapper header-bg">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="header-title-wrapper">武隆县高山番茄数字化赋能</div>
      <div class="header-right-part-wrapper">
        <BackOrHome />
      </div>
    </div>
    <div class="content-main-wrapper grid-container">
      <div class="gird-item-wrapper" style="grid-row: span 2;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>产业介绍</div>
          </div>
          <div class="main-item-container flex flex-col">
            <div class="flex justify-around pb-3">
              <div class="w-20 text-sm team-bg bg-[length:100%_100%] px-1 text-center">喜力</div>
              <div class="w-20 text-sm team-bg bg-[length:100%_100%] px-1 text-center">渝红六号</div>
              <div class="w-20 text-sm team-bg bg-[length:100%_100%] px-1 text-center">樱桃番茄</div>
              <div class="w-20 text-sm team-bg bg-[length:100%_100%] px-1 text-center">金红九</div>
              <div class="w-20 text-sm team-bg bg-[length:100%_100%] px-1 text-center">格雷</div>
            </div>
            <img :src="img1" alt="" class="h-full w-full" style="object-fit: contain;" />
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-row: span 4;">
        <div class="grid-main-item center-container">
          <div class="top-card-wrapper">
              <div class="top-card-item" @click="$router.push('/bigscreen5')">
                <div class="value-card">产业一张图</div>
              </div>
              <div class="top-card-item card-selected">
                <div class="value-card">产业一张图</div>
              </div>
              <div class="top-card-item" @click="$router.push('/bigscreen7')">
                <div class="value-card">设备监控</div>
              </div>
            </div>
          <div id="mainMap" style="width: 100%; height: 100%;"></div>
        </div>
        
      </div>
      <div class="gird-item-wrapper" style="">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>产品流通城市分析</div>
          </div>
          <div class="main-item-container">
            <div id="jl_chart2"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-row: span 2;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>“消费帮扶”品牌认证</div>
          </div>
          <div class="main-item-container right-center-wrapper">
            <div class="right-center-item"></div>
            <div class="right-center-item"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-row: span 2;">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>产业服务</div>
          </div>
          <div class="main-item-container flex flex-col">
            <div class="flex justify-around">
              <div class="service-bg flex flex-col items-center justify-start">
                <div class="value">8</div>
                <div class="label">流通城市</div>
              </div>
              <div class="service-bg flex flex-col items-center justify-start">
                <div class="value">8</div>
                <div class="label">流通城市</div>
              </div>
              <div class="service-bg flex flex-col items-center justify-start">
                <div class="value">8</div>
                <div class="label">流通城市</div>
              </div>
            </div>
            <div class="flex items-center my-2">
              <div class="text-md" style="font-family: 'TitleFont';">种植分布</div>
              <div style="width: calc(100% - 5rem);height: 1rem;background: linear-gradient(to right, #1d4daa, #1d4daa00);margin-left: .4rem;"></div>
            </div>
            <div id="jl_chart1"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>订单销售数据</div>
          </div>
          <div class="main-item-container">
            <div id="jl_chart3"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-main-wrapper"></div>
  </div>
</template>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);
#jl_chart1, #jl_chart2, #jl_chart3 {
  height: 100%;
  
}

.right-center-wrapper {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: .8rem;
  .right-center-item {
    height: 100%;
    background-size: 100% 100%;
    background-image: url(./assets/rcBg.png);
  }
}

.service-bg {
  background-image: url(./assets/serviceBg.png);
  background-size: 100% 100%;
  width: 6rem;
  height: 6rem;
  .value {
    font-size: 1.4rem;
    font-family: 'TitleFont';
  }
  .label {
    font-size: 0.9rem;
  }
}

.team-bg {
  background-image: url(./assets/teamBg.png);
}

.bigscreen-main-wrapper {
  background-image: url(./assets/bg.png);
}

.header-bg {
  background-image: url(./assets/headerBg.png);
}

.title-bg {
  background-image: url(./assets/titleBg.png);
}

.grid-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 33% 13% 22% 32%;
  color: aliceblue;
  .gird-item-wrapper {
    padding: 0.5rem;
    position: relative;
    z-index: 20;
    .grid-main-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      .main-item-title {
        height: 2.2rem;
        padding: 0 2rem;
        padding-left: 5.2rem;
        background-size: 100% 100%;
        font-family: 'TitleFont';
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .main-item-container {
        height: calc(100% - 2.2rem);
        background-image: url(./assets/bottomBg.png);
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center bottom;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        .sub-title-wrapper {
          height: 1rem;
          display: flex;
          margin: 0.7rem 0;
          align-items: center;
        }
        .chart-wrapper {
          height: 100%;
        }
      }
    }
  }
}

.center-container {
  position: relative;
  .top-card-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 10;
      padding: 0.8rem 0;
      .top-card-item {
        margin: 0 1.3rem;
        width: 10rem;
        aspect-ratio: 3.7;
        background-image: url(./assets/actived2.png);
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .value-card {
          font-size: 1.1rem;
          font-family: 'TitleFont';
        }
        .label-card {
          font-size: 0.9rem;
        }
      }
      .card-selected {
        background-image: url(./assets/active2.png) !important;
      }
    }

  #mainMap {
    width: 100%;
    height: 400px;
  }
}
</style>