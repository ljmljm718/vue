<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper flex items-center justify-around color-[#fff]">
        <div class="top-card-wrapper">
          <div class="actived2">
            <div class="value-card" @click="router.push('/bigscreenMYJD')">基地导览</div>
          </div>
          <div class="active2">
            <div class="value-card" >智慧种植</div>
          </div>
          <div class="actived2">
            <div class="value-card"  @click="router.push('/bigscreenMYFX')">风险预警</div>
          </div>
        </div>
      </div>
      <div class="linear-font-title header-title-wrapper">稻鱼鸭产业可视化数字驾驶舱</div>
      <div class="header-right-part-wrapper">
        <BigScreenTime />
      </div>
    </div>
    <div class="content-main-wrapper">
      <div class="left">
        <div>
          <div class="box-title">基础设施</div>
          <div class="box-item flex justify-evenly" style=" flex-direction: column;">
            <div class="flex justify-evenly items-center color-[#c1c1c1]">
              <div>示范基地</div>
              <div>300亩</div>
              <div>鸭舍</div>
              <div>15所</div>
            </div>
            <div class="flex justify-evenly items-center color-[#c1c1c1]">
              <div>基地数量</div>
              <div>4</div>
              <div>稻鸭</div>
              <div>800只</div>
            </div>
            <div class="flex justify-evenly items-center color-[#c1c1c1]">
              <div>养殖农户</div>
              <div>15户</div>
              <div>稻鱼</div>
              <div>20000尾</div>
            </div>
          </div>
        </div>
        <div>
          <div class="box-title">生长分析</div>
          <div class="box-item">
            <div id="chart1"></div>
          </div>
        </div>
        <div>
          <div class="box-title">产量分析</div>
          <div class="box-item">
            <div id="chart2"></div>
          </div>
        </div>
      </div>
      <div class="content-main-item middle-main-wrapper">
                <div class="main-top">
                  <div class="top-warper">
                    <div style="text-align:center;">预计产量</div>
                    <div class="flex mt-10px color-[#c1c1c1] justify-evenly">
                      <div class="flex"><div class="mr-5px">稻谷</div> <div>3200万斤</div></div>
                      <div class="flex"><div>稻鸭</div> <div>1000斤</div></div>
                      <div class="flex"><div>稻鱼</div> <div>1300斤</div></div>
                    </div>
                  </div>
                  <div class="top-warper">
                    <div class="flex justify-evenly items-center"><div>监控设备</div> <div>32</div></div>
                    <div class="flex mt-15px justify-evenly color-[#c1c1c1]">
                      <div class="flex "><div class="mr-8px">在线</div> <div>21</div></div>
                      <div class="flex "><div class="mr-8px">离线</div> <div>6</div></div>
                      <div class="flex "><div>故障</div> <div class="mr-8px"> 2</div></div>
                    </div>
                  </div>
                  <div class="top-warper">
                    <div class="flex justify-evenly items-center"><div>传感设备</div> <div>12</div></div>
                    <div class="flex mt-15px justify-evenly color-[#c1c1c1]">
                      <div class="flex "><div class="mr-8px">在线</div> <div>10</div></div>
                      <div class="flex "><div class="mr-8px">离线</div> <div>2</div></div>
                      <div class="flex "><div class="mr-8px">故障</div> <div class="mr-8px"> 0</div></div>
                    </div>
                  </div>
                </div>
                <div class="middle-main-item">
                  
                   
                      
                      
                </div>
                <div class="middle-main-footer box-item">
                    <div style="width: 49%;height:100%;">
                      
                    </div>
                    <div class="middli-main-right" style="width: 49%;height:100%;">
                      
                    </div>
                </div>
            </div>
      <div class="right">
        <div>
          <div class="box-title">物联网设备</div>
          <div class="box-item">
            <div class="w-full flex justify-evenly items-center color-[#fff]"><div>总数</div><div class="color-[#4584c0]">104<span>台</span></div></div>
            <div class="grid gap-10px w-full color-[#c1c1c1]" style="height: calc(100% - 20px); grid-template-columns: 50% calc(50% - 10px); grid-template-rows: 43% calc(57% - 30px);">
              <div>
                <div class="flex justify-between mt-10px"><div>生长监控</div> <div class="color-[#4584c0]">65</div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线60</div> <div>离线5</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-80% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mt-10px"><div>土壤墒情</div> <div class="color-[#4584c0]">8</div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线7</div> <div>离线1</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-87% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mt-10px"><div>气象站</div> <div class="color-[#4584c0]">4</div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线4</div> <div>离线0</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-100% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mt-10px"><div>水质监测</div> <div class="color-[#4584c0]"></div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线1</div> <div>离线2</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-33% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <div>
          <div class="box-title">实时监测</div>
          <div class="box-item grid gap-10px" style="grid-template-rows:33% 33% calc(34% - 20px);overflow-y: auto;">
            <div class="right2-warper w-full p-10px">
              <div class="warper-top w-100px color-[#fff]" style="text-align: center;font-family: 'TitleFont';">气象监测</div>
              <div style="height: calc(100% - 21px);overflow: auto;color: #c1c1c1;margin-top: 15px;display: flex;flex-wrap: wrap;justify-content:space-between;">
                <div class="flex items-center justify-evenly warper-item"><div>土壤温度</div> <div>21℃</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>土壤湿度</div> <div>67%</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>降雨量</div> <div>0mm</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>光照强度</div> <div>560Lux</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>风向风速</div> <div>南风五级</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>co2浓度</div> <div>23℃</div> </div>
              </div>
            </div>
            <div class="right2-warper w-full p-10px">
              <div class="warper-top w-100px color-[#fff]" style="text-align: center;font-family: 'TitleFont';">土壤墒情</div>
              <div style="height: calc(100% - 21px);overflow: auto;color: #c1c1c1;margin-top: 15px;display: flex;flex-wrap: wrap;justify-content:space-between;">
                <div class="flex items-center justify-evenly warper-item"><div>土壤温度</div> <div>21℃</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>土壤温度</div> <div>75%</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>氮</div> <div>0mm</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>磷</div> <div>0mm</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>钾</div> <div>0mm</div> </div>
              </div>
            </div>
            <div class="right2-warper w-full p-10px">
              <div class="warper-top w-100px color-[#fff]" style="text-align: center;font-family: 'TitleFont';">水质监测</div>
              <div style="height: calc(100% - 21px);overflow: auto;color: #c1c1c1;margin-top: 15px;display: flex;flex-wrap: wrap;justify-content:space-between;">
                <div class="flex items-center justify-evenly warper-item"><div>水PH</div> <div>8.2</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>氨氮</div> <div>0mm</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>溶解氧</div> <div>0mm</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>亚硝酸盐</div> <div>0mm</div> </div>
                <div class="flex items-center justify-evenly warper-item"><div>余氯</div> <div>0mm</div> </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import { ref, reactive, onMounted } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import { useRouter } from 'vue-router'
let router = useRouter()

let leftArr = reactive<Object>({
  tableColumns1: [
    {
      key: 'warnInfo',
      label: '预警信息',
      width: '35%'
    },
    {
      key: 'warnAdress',
      label: '预警地点',
      width: '10%'
    },
    {
      key: 'warnTime',
      label: '报警时间',
      width: '30%'
    },
    {
      key: 'warnType',
      label: '预警类型',
      width: '10%'
    },
    {
      key: 'warnStatus',
      label: '预警状态',
      width: '10%'
    }
  ],
  tableData1: [
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
  ]
})
const initChart1 =  () => {
  initChartStatic(
    'chart1',
    generateBaseOptions({
      xAxis: {
        data:[1,2,3,4,5,6,7,8,9,10,11,12,],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
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
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#fff', //网格线颜色
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
          name: '稻米',
          data: [2,3,4,1,5,7,2,8,10,8,11,8],
          type: 'line',
          smooth: true,
          symbol:'none'
        },
        {
          name: '鱼',
          data: [2,3,1,4,5,1,3,2,5,1,2,3,],
          type: 'line',
          smooth: true,
          symbol:'none'
        },
        {
          name: '鸭',
          data: [3,1,2,3,1,2,3,1,3,4,5,2],
          type: 'line',
          smooth: true,
          symbol:'none'
          // label: {
          //   show: true, //开启显示
          //   position: 'top', //在上方显示
          //   textStyle: {
          //     //数值样式
          //     color: '#eee',
          //     fontSize: 10
          //   }
          // },
          
          // areaStyle: {normal: {}},
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
const initChart2=  ()=>{
      initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data: [ '2024','2023','2022'],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
          },
          legend: { 
            show: true, 
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
          color: ["#ed7d31","#a9d18e","#d9d9d9"],
          yAxis: [
            {
            type: "value",
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
        ],
          series: [
            {
              name: '稻谷',
              data: [3200,2980,2750],
              type: "bar",
              smooth: false,
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#eee',
                  fontSize: 10
                }
              },
            },
            {
              name: '稻鸭',
              data: [1200,1320,1050],
              type: "bar",
              smooth: false,
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#eee',
                  fontSize: 10
                }
              },
            },
            {
              name: '稻鱼',
              data: [1089,1180,988],
              type: "bar",
              smooth: false,
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#eee',
                  fontSize: 10
                }
              },
            },
          ],
          grid: {
            left: "10%",
            right: "10%",
            top: "15%",
            bottom: "15%",
          },
        })
      );
    
}
onMounted(()=>{
  initChart1()
  initChart2()
})
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);
.bigscreen2-wrappper {
  width: 100vw;
  height: 100vh;
  background-image: url('./assets/bg.png');
  background-size: 100% 100%;
  .header-main-wrapper {
    background-size: 100% 100%;
    background-image: url('./assets/headerBg.png');
  }
}
.box-title {
  color: #fff;
  width: 100%;
  height: 2rem;
  font-size: 1.2rem;
  line-height: 2rem;
  text-indent: 2rem;
  font-family: 'TitleFont';
  background-size: 100% 100%;
  background-image: url('./assets/title.png');
}
.content-main-wrapper {
  margin-top: 10px;
  padding: 0 15px !important;
  height: 90% !important;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 25% calc(50% - 30px) 25%;
  // justify-content: spa;
  gap: 15px;
  .left{
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 30% 30% calc(40% - 30px);
    gap: 15px;
    .box-item{
      width: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      height: calc(100% - 2rem);
      background-size: 100% 100%;
      background-image: url(./assets/cardBg.png);
      #chart1,#chart2{
        width: 100%;
        height: 100%;
      }
    }
  }
  .right{
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 30% calc(70% - 15px);
    gap: 15px;
    .box-item{
      width: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      height: calc(100% - 2rem);
      background-size: 100% 100%;
      background-image: url(./assets/cardBg.png);
      .right2-warper{
        box-sizing: border-box;
        background-size: 100% 100%;
        background-image: url(./assets/right2Bg.png);
        .warper-top{
          background-size: 100% 100%;
          background-image: url(./assets/warperTop.png);
        }
        .warper-item{
          width: 47%;
          height: 20px;
          background-size: 100% 100%;
          background-image: url(./assets/wareprBg.png);
        }
      }
    
    }
    .box-item::-webkit-scrollbar{
      width: 0;
    }
  }
  .middle-main-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    .main-top{
      z-index: 9999;
      position: absolute;
      top: 20px;
      width: 95%;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .top-warper{
        width: 32%;
        padding: 15px;
        box-sizing: border-box;
        height: 100%;
        background-size: 100% 100%;
        background-image: url(./assets/main-topBg.png);
      }
      
    }
    .middle-main-item{
      position: absolute;
      width: 1200px;
      height: 750px;
      left: calc(50% - 600px);
      top: calc(50% - 450px);
      background-size: 100% 100%;
      position: relative;
      .sxt1{
        position: absolute;
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        background-size: 100% 100%;
        background-image: url('./assets/sxt1.png');
        position: relative;
        .message{
          position: absolute;
          padding: 0 15px 30px !important;
          box-sizing: border-box;
          width: 250px;
          z-index: 9999;
          background-size: 100% 100%;
          background-image:url(./assets/meassage.png);
        }
      }
      .sxt2{
        position: absolute;
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        background-size: 100% 100%;
        background-image: url('./assets/sxt2.png');
        position: relative;
        .message{
          position: absolute;
          padding: 0 15px 30px !important;
          box-sizing: border-box;
          width: 250px;
          z-index: 9999;
          background-size: 100% 100%;
          background-image:url(./assets/meassage.png);
        }
      }
      .sxt3{
        position: absolute;
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        background-size: 100% 100%;
        background-image: url('./assets/sxt3.png');
        position: relative;
        .message{
          position: absolute;
          padding: 0 15px 30px !important;
          box-sizing: border-box;
          width: 250px;
          z-index: 9999;
          background-size: 100% 100%;
          background-image:url(./assets/meassage.png);
          .middle-btn{
            width: 100px;
            height: 50px;
            line-height: 50px;
            margin: auto;
            text-align: center;
            background-size: 100% 100%;
            background-image: url(./assets/middle-btn.png);
          }
        }
      }
      .sxt4{
        position: absolute;
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        background-size: 100% 100%;
        background-image: url('./assets/sxt4.png');
        position: relative;
        .message{
          position: absolute;
          padding: 0 15px 30px !important;
          box-sizing: border-box;
          width: 250px;
          z-index: 9999;
          background-size: 100% 100%;
          background-image:url(./assets/meassage.png);
        }
      }
    }
    .middle-main-footer{
        position: absolute;
        bottom: 2%;
        width: 97%;
        height: 24%;
        display: flex;
        justify-content: space-between;
        .middli-main-left{
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          height: calc(100% - 2rem);
          background-size: 100% 100%;
          background-image: url(./assets/main-footer-item.png);
          .left-top{
            width: 80%;
            height: 45%;
            display: flex;
            justify-content:space-between;
            margin-top:10px;
            background-size: 100% 100%;
            background-image: url(./assets/middle-main-warper.png);
            .main-left-pie{
              width:25%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-size: 100% 100%;
              background-image: url(./assets/main-left-pie.png);
              .pie{
                width: 100%;
                height:100%;
              }
            }
            .middle-main-right{
              width:70%;
                border-radius:50%;
              height:100%;
            }
          }
        }
        .middli-main-right{
          .main-right-xian{
            width: 58%;
            margin-left: 10px;
            height: 8px;
            background-size: 100% 100%;
            background-image: url(./assets/main-right-xian.png);
          }
          #chart2{
            width: 100%;
            height:calc(100% - 3rem);
          }
        }
    }
    .middle-sxt{
        position: absolute;
        left: 5%;
        bottom: 28%;
        display: flex;
        width: 40%;
        align-items: center;
        justify-content: space-between;
        .middle-icon{
            width: 2rem;
            height: 2rem;
            background-size: 100% 100%;
        }
    }
  }
}
.top-card-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  .active2 {
    width: 100%;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
    background-size: 100% 100%;
    background-image: url('./assets/active.png');
    .value-card {
      font-size: 1rem;
      font-family: 'TitleFont';
    }
  }
  .actived2 {
    width: 100%;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
    background-size: 100% 100%;
    background-image: url('./assets/actived.png');
    .value-card {
      font-size: 1rem;
      font-family: 'TitleFont';
    }
  }
}
.inner-border {
    border: 1px solid #449ce9;
}
.active {
  width: 5rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  background-color: #012162;
}
.actived {
  width: 5rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  background-color: #016aba;
}
@for $i from 1 through 3 {
  .scan-#{$i} {
    background-image: url(./assets/scan#{$i}.png);
  }
}
</style>