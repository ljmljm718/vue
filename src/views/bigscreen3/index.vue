<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="linear-font-title header-title-wrapper">石柱县双龙村鲁渝协作乡村振兴服务大屏</div>
      <div class="header-right-part-wrapper"></div>
    </div>
    <div class="content-main-wrapper">
        <div class="left">
          <div class="left1">
            <div class="box-title">农业资源</div>
            <div class="left1-item">
              <div class="left1-warper">
                <div style="margin-top: -30px;">柑橘园区</div>
                <div style="margin-top:10px;">4</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">柑橘园区</div>
                <div style="margin-top:10px;">4</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">柑橘园区</div>
                <div style="margin-top:10px;">4</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">柑橘园区</div>
                <div style="margin-top:10px;">4</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">柑橘园区</div>
                <div style="margin-top:10px;">4</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">柑橘园区</div>
                <div style="margin-top:10px;">4</div>
              </div>
            </div>
          </div>
          <div class="left2">
            <div class="box-title">种植园区</div>
            <div class="left2-item">
              <div class="left2-warper">
                <div style="flex: 1;font-weight: 600; ">塘北A1园区</div>
                <div style="font-size: 14px; color: #c1c1c1;">地块：18</div>
                <div style="font-size: 14px; color: #c1c1c1;margin: 0 10px;">面积：2800亩</div>
                <div style="font-size: 14px; color: #c1c1c1;">柑橘品种：沃柑、晚橙</div>
              </div>
              <div class="left2-warper">
                <div style="flex: 1;font-weight: 600; ">塘北A1园区</div>
                <div style="font-size: 14px; color: #c1c1c1;">地块：18</div>
                <div style="font-size: 14px; color: #c1c1c1;margin: 0 10px;">面积：2800亩</div>
                <div style="font-size: 14px; color: #c1c1c1;">柑橘品种：沃柑、晚橙</div>
              </div>
              <div class="left2-warper">
                <div style="flex: 1;font-weight: 600; ">塘北A1园区</div>
                <div style="font-size: 14px; color: #c1c1c1;">地块：18</div>
                <div style="font-size: 14px; color: #c1c1c1;margin: 0 10px;">面积：2800亩</div>
                <div style="font-size: 14px; color: #c1c1c1;">柑橘品种：沃柑、晚橙</div>
              </div>
              <div class="left2-warper">
                <div style="flex: 1;font-weight: 600; ">塘北A1园区</div>
                <div style="font-size: 14px; color: #c1c1c1;">地块：18</div>
                <div style="font-size: 14px; color: #c1c1c1;margin: 0 10px;">面积：2800亩</div>
                <div style="font-size: 14px; color: #c1c1c1;">柑橘品种：沃柑、晚橙</div>
              </div>
              <div class="left2-warper">
                <div style="flex: 1;font-weight: 600; ">塘北A1园区</div>
                <div style="font-size: 14px; color: #c1c1c1;">地块：18</div>
                <div style="font-size: 14px; color: #c1c1c1;margin: 0 10px;">面积：2800亩</div>
                <div style="font-size: 14px; color: #c1c1c1;">柑橘品种：沃柑、晚橙</div>
              </div>
            </div>
          </div>
          <div class="left3">
            <div class="box-title">种植分布(亩)</div>
            <div class="left3-item">
              <div id="chart1"></div>
            </div>
          </div>
        </div>
        <div class="main"></div>
        <div class="right">
          <div class="right1">
            <div class="box-title">产品介绍</div>
            <div class="right1-item">
              <div class="right1-left">
                  <img src="./assets/left1LeftImg.png" style="width: 84%;height: 78%;" alt=""/>
              </div>
              <div class="right1-right">
                <div class="right1-top">
                  <span style="font-weight: 600;font-size: 20px;">沃柑</span> 
                  <div class="right1-warper"></div>
                </div>
                <div style="font-size: 14px; color: #c1c1c1;margin-top: 10px;">
                  早结丰产、适应性广、果实外观漂亮、品质优良、成熟期晚、采收期长。在重庆地区11月中下旬转色，1月中旬成熟，采收期从1月中旬至3上旬，果实耐贮性好，自然留果时间可从成熟的1-2月到7-8月份。
                </div>
              </div>
            </div>
          </div>
          <div class="right2">
            <div class="box-title">柑橘预测</div>
            <div class="right2-item">
              <div id="chart2"></div>
            </div>
          </div>
          <div class="right3">
            <div class="box-title">农资信息</div>
            <div class="right3-item">
              <div class="right3-top" style="text-align: center;color: #fff;margin-top: 20px;font-size: 16px;font-weight: 700;">农资费用(万)</div>
              <div id="chart3"></div>
            </div>
          </div>
        </div>    
      </div>
  </div>
</template>
<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import {ref,reactive,onMounted} from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions,
} from "../../utils/bigscreenTool/index";
import img from './assets/chart1Img.png'
const initChart1= ()=> {
      initChartStatic(
        "chart1",
        generatePieOptions({
          legend: {
            show: true,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
          },
          graphic: { // 这个属性用于在饼图内部添加图片  
              elements: [{  
                  type: 'image', // 类型为图片  
                  style: {  
                      image: img, // 图片路径  
                      width: 50, // 图片宽度  
                      height: 50 // 图片高度  
                  },  
                  left: 'center', // 图片水平居中  
                  top: 'center' // 图片垂直居中  
              }]  
          },  
          color: ["#00ffff", "#0081ff", "#ffce54", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["40%", "60%"],
              center: "center",
              data: [
                {value:10000,name:'柑橘'},
                {value:5000,name:'柠檬'},
                {value:500,name:'百香果'},
              ],
              label: {
                // formatter: "{c|{c}},{d|{d}%}",
                formatter: "\n{c}\n {d}%",
                rich: {
                  c: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                  d: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                },
              },
            },
          ],
        })
      );
}
const initChart2=  ()=>{
      initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data: [ "3月",'4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月'],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
          },
          legend: { 
            data:['长势预测','产量预测'],
            show: true, 
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
          color: ["#1290ed","#0cb5b8"],
          yAxis: {
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
          series: [
            {
              data: [15,50,70,60,80,100,110,115,140,120,150,170],
              type: "line",
              smooth: false,
            },
          ],
          grid: {
            left: "20%",
            right: "4%",
            top: "15%",
            bottom: "15%",
          },
        })
      );
    
}
const initChart3= ()=> {
      initChartStatic(
        "chart3",
        generatePieOptions({
          legend: {
            show: true,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
          },
          graphic: {  
              type: 'text',  
              left: 'center',  
              top: 'center',  
              style: {  
                  text: '总访问量: ' + (335 + 310), 
                  textAlign: 'center',  
                  fontSize: 20,  
                  color: 'white'  
              }  
          }  ,
          color: ["#00ffff", "#0081ff", "#ffffff", "#ffce54"],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["40%", "60%"],
              center: "center",
              data: [
                {value:32,name:'施肥用料'},
                {value:46,name:'用工成本'},
                {value:13,name:'农具采购'},
                {value:8,name:'其他成本'},
              ],
              label: {
                // formatter: "{c|{c}},{d|{d}%}",
                formatter: "\n{c}\n {d}%",
                rich: {
                  c: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                  d: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                },
              },
            },
          ],
        })
      );
}
onMounted(()=>{
  initChart1()
  initChart2()
  initChart3()

})
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);
.bigscreen2-wrappper {
  width: 100vw;
  height: 100vh;
  background-image: url('./assets/bg.png');
  background-size: 100% 100%;
  .header-main-wrapper{
      background-size: 100% 100%;
        background-image: url('./assets/headerBg.png');
    }
}
.box-title{
  width: 100%;
  height: 2rem;
  text-indent: 2.5rem;
  color: #fff;
  font-size: 20px;
  line-height: 2rem;
  font-family: 'TitleFont';
  background-size: 100% 100%;
  background-image: url('./assets/box-title.png');
}
.content-main-wrapper {
    padding: 0 10px !important;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 25% calc(50% - 20px) 25%;
    gap: 10px;
    .left{
      display: grid;
      grid-template-rows: 32% 32% calc(36% - 20px);
      grid-auto-columns: 100%;
      gap:10px;
      width: 100%;
      height: 100%;
      .left1{
        width: 100%;
        height: 100%;
        .left1-item{
          width: 100%;
          height: calc( 100% - 2rem);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr ;
          gap:10px;
          .left1-warper{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #fff;
            font-weight: 600;
            font-size: 18px;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-image: url('./assets/left1ItemBg.png');
          }
        }
      }
      .left2{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .left2-item{
          width: 100%;
          overflow-y: auto;
          
          height: calc( 100% - 2rem );
          .left2-warper{
            margin-top: 10px;
            padding-left: 30px;
            padding-right: 15px;
            width: 100%;
            height: 50px;
            box-sizing: border-box;
            display: flex;
            background-size: 100% 100%;
            align-items: center;
            color: #fff;
            background-image: url('./assets/left2ItemBg.png');
          }
        }
        .left2-item::-webkit-scrollbar {
            display: none;
          };
      }
      .left3{
        width: 100%;
        height: 100%;
        .left3-item{
          width: 100%;
          height: calc( 100% - 2rem);
          #chart1{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .main{ 
      grid-auto-columns: 100%;
      width: 100%;
      height: 100%;
    }
    .right{
      display: grid;
      grid-template-rows: 32% 32% calc(36% - 20px);
      grid-auto-columns: 100%;
      gap:10px;
      width: 100%;
      height: 100%;
      .right1{
        width: 100%;
        height: 100%;
        .right1-item{
          width: 100%;
          height: calc(100% - 2rem );
          display: flex;
          align-items: center;
          justify-content: space-between;
          .right1-left{
            display: flex;
            align-items: center;
            justify-content:center;
            width: 49%;
            height: 70%;
            background-size: 100% 100%;
            background-image: url('./assets/right1Left.png');
          }
          .right1-right{
            width: 49%;
            color: #fff;
            height: 80%;
            .right1-top{
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              height: 10%;
              .right1-warper{
                width: 80%;
                height: 50%;
                background-size: 100% 100%;
                background-image: url('./assets/right1Top.png');
              }
            }
          }
        }
      }
      .right2{
        width: 100%;
        height: 100%;
        .right2-item{
          width: 100%;
          height: calc(100% - 2rem);
          #chart2{
            width: 100%;
            height: 100%;
          }
        }
      }
      .right3{
        width: 100%;
        height: 100%;
        .right3-item{
          width: 100%;
          height: calc(100% - 2rem );
          .right3-top{
            margin:auto;
            width: 60%;
            height: 10px;
            line-height: 10px;
            background-size: 100% 100%;
            background-image: url('./assets/right3Top.png');
          }
          #chart3{
            width: 100%;
            height: calc( 100% - 2.3rem);
          }
        }
      }
    }
  }


@for $i from 1 through 3 {
  .scan-#{$i} {
    background-image: url(./assets/scan#{$i}.png);
  }
}
</style>