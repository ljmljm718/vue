<template>
  <div class="bigscreen-wrappper bigscreen-main-wrapper">
      <div class="header-main-wrapper">
          <div class="header-left-part-wrapper">
          </div>
          <div class="header-title-wrapper">武隆县高山番茄数字化赋能</div>
          <div class="header-right-part-wrapper"><BigScreenTime /></div>
      </div>
      <div class="content-main-wrapper">
          <div class="left">
            <div class="left1">
              <div class="box-title">设备信息</div>
              <div class="left1-item">
                  <div class='left1-top'>
                    <div style="font-size: 13px;margin-left: 5px;">设备总数</div>
                    <div style="color:#00e4ec;font-weight: 700;font-size: 20px;">117</div>
                  </div>
                  <div v-for="item,index in left1Top" :key="index" :class="['leftTop','leftTop-'+(index+1).toString()]">
                    <div  style="font-size: 13px;margin-left: 5px;">{{item.title}}</div>
                    <div>{{item.val}}
                  </div>
              </div>
            </div>
            </div>
            <div class="left2">
              <div v-for="item,index in left2List" :key="index" :class="['left2Bg','left2Bg-'+(index+1).toString()]">
                <div class="left2-top">
                  <div class=left2-top-bg></div>
                  <div style='flex:1;margin-left: 15px;'>{{item.title}}</div>
                  <div>{{item.val}}</div>
                </div>
                <div class="left2-content">
                  <div class="left2-warper" v-for='itm,inde in item.list' :key=inde>
                    <div :class="['blockBg','block-'+(inde+1).toString()]"></div>
                    <div style="flex:1;margin-left:10px;">{{itm.title}}</div>
                    <div style="margin-right:20px;">{{itm.val}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="left3">
             <div id="chart1"></div>
            </div>
           
          </div>
          <div class="content-main-item middle-main-wrapper">
            <div class="main-top">
              <div :class="mainIndex==1?'active':'actived'" @click="mainIndex=1">农业一张图</div>
              <div :class="mainIndex==2?'active':'actived'" @click="mainIndex=2">产业一张图</div>
              <div :class="mainIndex==3?'active':'actived'" @click="mainIndex=3">设备监控</div>
            </div>
            <div class="middle-main-item">
                <div class="sxt" style="left: 30%;top: 50%;">
                  <div class="message">
                    <div class="message-top">基地1 监控</div>
                    <div style="margin-left:20px;margin-top:10px;">监控摄像头-枪机</div>
                    <div  style="margin-bottom: 20px; margin-left:20px;margin-top:10px;display: flex;align-items: center;color: #43ffd0;">
                      <div class="pie"></div>
                      在线
                    </div>
                    <div class="Jkbtn">查看监控</div>
                  </div>
                </div>
                <div class="soil" style="left: 40%;top: 60%;"></div>
                <div class="shed" style="left: 50%;top: 40%;"></div>
              <div class="footer">
                <div style="display: flex;align-items: center;"><div :class="['sxt-icon','sxt-1']"></div><div>监控设备</div> </div>
                <div style="display: flex;align-items: center;margin-left: 20px;margin-right: 20px;"><div :class="['sxt-icon','sxt-2']"></div><div>土壤墒情监控</div> </div>
                <div style="display: flex;align-items: center;"><div :class="['sxt-icon','sxt-3']"></div><div>棚内环境监测</div> </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="right1">
              <div class="box-title">预警信息</div>
              <div class="right1-item">
               <div class="right1-warper">
                <div class="right1-left"><div class="tranig"></div>虫情预警</div>
                <div class='right1-right'>
                  <div>3号大棚虫害数量已经接近阈值95，建议开启诱虫灯</div>
                  <div style="margin-top:10px;">2024-03-19 16:48:09</div>
                </div>
               </div>
               <div class="right1-warper">
                <div class="right1-left"><div class="tranig"></div>虫情预警</div>
                <div class='right1-right'>
                  <div>3号大棚虫害数量已经接近阈值95，建议开启诱虫灯</div>
                  <div style="margin-top:10px;">2024-03-19 16:48:09</div>
                </div>
               </div>
               <div class="right1-warper">
                <div class="right1-left"><div class="tranig"></div>虫情预警</div>
                <div class='right1-right'>
                  <div>3号大棚虫害数量已经接近阈值95，建议开启诱虫灯</div>
                  <div style="margin-top:10px;">2024-03-19 16:48:09</div>
                </div>
               </div>
               <div class="right1-warper">
                <div class="right1-left"><div class="tranig"></div>虫情预警</div>
                <div class='right1-right'>
                  <div>3号大棚虫害数量已经接近阈值95，建议开启诱虫灯</div>
                  <div style="margin-top:10px;">2024-03-19 16:48:09</div>
                </div>
               </div>
               
              </div>
            </div>
            <div class="right2">
              <div class="box-title">设备运行统计</div>
              <div class="right2-item">
               <div id="chart2"></div>
              </div>
            </div>
          </div>
      </div>
      <div class="footter">
          <div class='footer-left'>
            <div class='select'>
              <select id="" name="" class='select-left'>
                <option value="">基地</option>
              </select>
              <select id="" name=""  class='select-right'>
                <option value="">1号大鹏</option>
              </select>
            </div>
            <div class='left-soil'>
              <div :class='soilIndex==1?"active":"actived"' @click='soilIndex=1'>气象监测</div>
              <div :class='soilIndex==2?"active":"actived"' @click='soilIndex=2'>土壤墒情</div>
              <div :class='soilIndex==3?"active":"actived"' @click='soilIndex=3'>棚内环境</div>
              <div :class='soilIndex==4?"active":"actived"' @click='soilIndex=4'>虫情监测</div>
            </div>
            <div class='footer-chart'>
              <div class='footer-item'>
                <div class='foot-top'>
                    <div style='margin-left:30px;'>空气温度</div>
                    <div style='font-size:25px;margin-left:-100px;'>12.3<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart3'></div>
              </div>
              <div class='footer-item'>
                <div class='foot-top'>
                    <div style='margin-left:30px;'>空气温度</div>
                    <div style='font-size:25px;margin-left:-100px;'>12.3<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart4'></div>
              </div>
              <div class='footer-item'>
                <div class='foot-top'>
                    <div style='margin-left:30px;'>空气温度</div>
                    <div style='font-size:25px;margin-left:-100px;'>12.3<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart5'></div>
              </div>
            </div>
          </div>
          <div class='footer-right'>
            <div class='box-title' style='position:relative; text-indent: 7rem;'>监控设备
              <div class='select' style="position:absolute;right:20px;top:0;">
              <select id="" name="" class='select-left'>
                <option value="">基地</option>
              </select>
              <select id="" name=""  class='select-right'>
                <option value="">1号大鹏</option>
              </select>
            </div>
            </div>
            <div class='footer-item'></div>
          </div>
      </div>

    </div>

</template>
<script setup lang='ts'>
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import {
initChartStatic,
generateBaseOptions,
generatePieOptions,
} from "../../utils/bigscreenTool/index";
import { resetSize } from '@/components/Verifition/src/utils/util';
import {ref,onMounted} from 'vue'
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
          color: ["#1ec9b9", "#a01c12", "#ffffff" ],
          series: [
            {
              type: "pie",
              radius: ["45%", "70%"],
              center: "center",
              data: [
                {value: "104",name:'在线'},
                {value: "5",name:'故障'},
                {value: "8",name:'离线'},
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
            data: [ '10月','11月','12月','1月','2月',"3月"],
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
            left:'center'            
         },
          yAxis: [{
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
          {
            type:'value',
            name:'%',
            min:0,
            max:14
          }
        ],
        color:['#0bbdc4','red'],
          series: [
            {
              name:'在线率',
              data: [98,95,90,88,85,80],
              type: "bar",
              barWidth:'20',
              smooth: false,
              label: {
                show: true,
                position: 'top', // 顶部显示
                formatter: '{c}', // 显示数据值
              },
            },
            {
              name:'离线率',
              data: [0,2,5,4,10,13],
              type: "line",
              yAxisIndex:1,
              barWidth:'20',
              smooth: false,
              symbol:'none',
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
const initChart3=  ()=>{
      initChartStatic(
        "chart3",
        generateBaseOptions({
          xAxis: {
            data: [ '0','3','6','9','12',"15","18","21"],
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
            left:'center'            
         },
          yAxis: [{
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
          }
        ],
        color:['#0bbdc4','red'],
          series: [
            {
              name:'空气温度',
              data: [11,15,20,18,20,15,22,19],
              type: "line",
              barWidth:'20', 
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
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
const initChart4=  ()=>{
      initChartStatic(
        "chart4",
        generateBaseOptions({
          xAxis: {
            data: [ '0','3','6','9','12',"15","18","21"],
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
            left:'center'            
         },
          yAxis: [{
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
          }
        ],
        color:['#0bbdc4','red'],
          series: [
            {
              name:'空气温度',
              data: [11,15,20,18,20,15,22,19],
              type: "line",
              barWidth:'20', 
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
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
const initChart5=  ()=>{
      initChartStatic(
        "chart5",
        generateBaseOptions({
          xAxis: {
            data: [ '0','3','6','9','12',"15","18","21"],
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
            left:'center'            
         },
          yAxis: [{
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
          }
        ],
        color:['#0bbdc4','red'],
          series: [
            {
              name:'空气温度',
              data: [11,15,20,18,20,15,22,19],
              type: "line",
              barWidth:'20', 
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
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
  initChart3()
  initChart4()
  initChart5()
})
let mainIndex=ref(1)
let left1Top=ref([
  {
    title:'在线',
    val:'104'
  },
  {
    title:'离线',
    val:'8'
  },
  {
    title:'故障',
    val:'5'
  },
])
let left2List=ref([
  {
    title:'气象监测',
    val:1,
    list:[
      {
        title:'在线',
        val:'1'
      }
    ]
  },
  {
    title:'监控设备',
    val:92,
    list:[
      {
        title:'在线',
        val:'81'
      },
      {
        title:'离线',
        val:'4'
      },
      {
        title:'故障',
        val:'7'
      },
    ]
  },
  {
    title:'土壤墒情',
    val:24,
    list:[
      {
        title:'在线',
        val:'21'
      },
      {
        title:'离线',
        val:'2'
      },
      {
        title:'故障',
        val:'1'
      },
    ]
  },
  {
    title:'虫情监测',
    val:14,
    list:[
      {
        title:'在线',
        val:'11'
      },
      {
        title:'离线',
        val:'3'
      },
      {
        title:'故障',
        val:'1'
      },
    ]
  },
])
let soilIndex=ref(1)
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);

.bigscreen-wrappper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .header-main-wrapper {
    z-index: 9999;
    background-size: 100% 100%;
      background-image: url(./assets/headerBg.png);
  }

  .content-main-item {
      padding: 10px;
      position: relative;
      z-index: 99;
  }
}
.box-title{
  width: 100%;
  height: 2rem;
  color:#fff;
  line-height: 2rem;
  text-indent: 4.5rem;
  font-size: 1.3rem;
  font-family: "TitleFont";
  background-size: 100% 100%;
  background-image: url(./assets/titleBg.png);
}
.content-main-wrapper {
padding: 0px 15px !important;
box-sizing:border-box ;
height: 58% !important;
color: #fff;
display: grid;
grid-template-columns: 25% calc(50% - 20px) 25%;
grid-auto-rows: 100%;
gap: 10px;
.left{
  z-index: 999;
  display: grid;
  grid-template-rows: 15% 40% calc( 45% - 30px);
  gap: 10px;
  grid-auto-columns: 100%;
  .left1{
    width: 100%;
    height: 100%;
    .left1-item{
      width: 100%;
      height: calc(100% - 2rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left1-top{
        width: 23%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-size: 100% 100%;
        background-image: url(./assets/total.png);
      }
      .leftTop{
        width: 21%;
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-size: 100% 100%;
      }
    }
  }
  .left2{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 49% calc(51% - 10px);
    grid-template-rows: 49% calc(51% - 10px);
    gap: 10px;
    .left2Bg{
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-size: 100% 100%;
      .left2-top{
        width: 100%;
        font-weight: 700;
        padding: 10px 15px;
        box-sizing:border-box ;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-size: 100% 100%;
        background-image: url(./assets/left2Top.png);
        .left2-top-bg{
          width: 5px;
          height: 10px;
          background-size: 100% 100%;
          background-image:url(./assets/left2TopBg.png)
        }
      }
      .left2-content{
        width: 100%;
        height: calc(100% - 30px);
        display: flex;
        align-items: center;
        flex-direction: column;
        .left2-warper{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .blockBg{
            margin-left: 20px;
            width:10px;
            height: 10px;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .left3{
    width: 100%;
    height:100%;
    #chart1{
      width: 100%;
      height: 100%;
    }
  }
}
.middle-main-wrapper{
     z-index:1;
    position: relative;
    width: 100%;
    height: 100%;
    .main-top{
      z-index: 9999;
      position: absolute;
      width: 95%;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-around;      
      .active{
        padding: 5px 50px;
        height: 100%;
        font-weight: 700;
        text-align: center;
        line-height: 30px;
        color: #fff;
        background-size: 100% 100%;
        background-image: url(./assets/active2.png);
      }
      .actived{
        padding: 5px 50px;
        height: 100%;
        color: #c1c1c1;
        text-align: center;
        line-height: 30px;
        background-size: 100% 100%;
        background-image: url(./assets/actived2.png);
      }
    }
    .middle-main-item{
      position: absolute;
      width: 1200px;
      height: 800px;
      left: calc(50% - 600px);
      top: calc(50% - 300px);
      background-size: 100% 100%;
      background-image: url(./assets/mainBg.png); 
      position: relative;
      .sxt{
        z-index: 99;
        position: absolute;
        width: 4.5rem;
        height: 4.5rem;
        background-size: 100% 100%;
        background-image: url(./assets/sxt1.png);
        position: relative;
        .message{
          position: absolute;
          top: -250px;
          left: -80px;
          padding: 15px 15px !important;
          width: 200px;
          height: 250px;
          color: #c1c1c1;
          background-size: 100% 100%;
          background-image: url(./assets/message.png);
          .message-top{
            width: 100%;
            margin-left: 20px;
            font-weight: 600;
            line-height: 30px;
            color: #fff;
            padding: 5px;
            box-sizing: border-box;
            margin-top: 20px;
            height: 40px;
            background-size: 100% 100%;
            background-image: url(./assets/messageTop.png);
          }
          .pie{
            width: 5px;
            height: 10px;
            background-repeat: no-repeat;
            background-image: url(./assets/pie.png);
          }
          .Jkbtn{
            width: 100px;
            margin: auto;
            text-align: center;
            line-height: 50px;
            height: 50px;
            background-size: 100% 100%;
            background-image: url(./assets/jkBtn.png);
          }
        }
      }
      .soil{
        z-index: 99;
        position: absolute;
        width: 4.5rem;
        height: 4.5rem;
        background-size: 100% 100%;
        background-image: url(./assets/sxt2.png);
      }
      .shed{
        z-index: 99;
        position: absolute;
        width: 4.5rem;
        height: 4.5rem;
        background-size: 100% 100%;
        background-image: url(./assets/sxt3.png);
      }
      .footer{
        display: flex;
        position: absolute;
        left: 20%;
        bottom: 18%;
        .sxt-icon{
          width: 3rem;
          height: 3rem;
          margin-right:10px;
          background-size: 100% 100%;
        }
      }   
      }

  }
.right{
  z-index: 999;
  display: grid;
  grid-template-rows: 49% calc(51% - 10px);
  gap: 10px;
  grid-auto-columns: 100%;
    .right1{
      width: 100%;
      height:100%;
      .right1-item{
        width: 100%;
        height: calc(100% - 2rem);
        overflow-y: scroll;
        .right1-warper{
          width: 100%;
          box-sizing:border-box;
          padding:5px 0;
          display: flex;
          margin-top:10px;
          align-items: center;
          justify-content:space-between;
          background-size:100% 100%;
          background-image:url(./assets/warn.png);
          .right1-left{
            width: 25%;
            display: flex;
            font-size:14px;
            align-items: center;
            .tranig{
              width:50px;
              height: 50px;
              background-size:100% 100%;
              background-image:url(./assets/tranig.png);
            }
          }
          .right1-right{
            width: 73%;
            font-size:14px;
          }
        }
      }
      .right1-item::-webkit-scrollbar {
            display: none;
          };
    }
    .right2{
      width:100%;
      height:100%;
      .right2-item{
        width: 100%;
        height: calc(100% - 2rem);
        #chart2{
          width: 100%;
          height:100%;
        }
      }
    }
  }
}

.footter{
  padding:10px 15px !important;
  box-sizing:border-box;
  width: 100%;
  height:34.5%;
  display:flex;
  justify-content:space-between;
  .footer-left{
  z-index:9999; 
    width:60%;
    height:100%;
    display:grid;
    grid-template-rows: 15% 15% calc(70% - 20px );
    gap:10px;
    grid-auto-columns:100%;
    .select{
      width:100%;
      height:100%;
      .select-left{
        width:100px;
        padding:0 5px;
        height:60%;
        color:#fff;
        margin-right:20px;
        background-size:100% 100%;
        background:none;
        background-image:url(./assets/select.png);
      }
      .select-right{
        width:100px;
        padding:0 5px;
        height:60%;
        color:#fff;
        background-size:100% 100%;
        background:none;
        background-image:url(./assets/select.png);
      }
    }
    .left-soil{
      width:500px;
      height:50%;
      display:flex;
      .active{
        height:100%;
        color:#fff;
        padding:8px 15px !important;
        display:flex;
        align-items:center;
        background-size:100% 100%;
        background-image:url(./assets/active.png);
      }
      .actived{
        height:100%;
        color:#c1c1c1;
        padding:8px 15px !important;
        display:flex;
        align-items:center;
        background-size:100% 100%;
        background-image:url(./assets/actived.png);
      }
      
    }
    .footer-chart{
      width:100%;
      height:100%;
      display:flex;
      justify-content:space-between;
      .footer-item{
        width:32%;
        padding:10px !important;
        box-sizing:border-box;
        height:100%;
        background-size:100% 100%;
        background-image:url(./assets/footerBg.png);
        .foot-top{
          width:100%;
          height:50px;
          display:flex;
          align-items:center;
          color:#fff;
          justify-content:space-around;
          background-size:100% 100%;
          background-image:url(./assets/footerTop.png);
        }
        #chart3{
          width:100%;
          height:calc(100% - 50px);
        }
        #chart4{
          width:100%;
          height:calc(100% - 50px);
        }
        #chart5{
          width:100%;
          height:calc(100% - 50px);
        }
      }
    }
  }
  .footer-right{
  z-index:9999; 
    width:39%;
    height:100%;
    .select{
      display:flex;
      .select-left{
        width:100px;
        padding:0 5px;
        height:30px;
        color:#fff;
        margin-right:20px;
        background-size:100% 100%;
        background:none;
        background-image:url(./assets/select.png);
      }
      .select-right{
        width:100px;
        padding:0 5px;
        height:30px;
        color:#fff;
        margin-right:20px;
        background-size:100% 100%;
        background:none;
        background-image:url(./assets/select.png);
      }
    }
    .footer-item{
      width:100%;
      height:calc(100% - 2rem);

    }
  }
}
@for $i from 1 through 4 {
.leftTop-#{$i} {
  background-image: url(./assets/left1Top#{$i}.png);
}
}
@for $i from 1 through 4 {
.left2Bg-#{$i} {
  background-image: url(./assets/left2Bg#{$i}.png);
}
}
@for $i from 1 through 4 {
.block-#{$i} {
  background-image: url(./assets/block#{$i}.png);
}
}
@for $i from 1 through 3 {
.sxt-#{$i} {
  background-image: url(./assets/sxt#{$i}.png);
}
}

</style>