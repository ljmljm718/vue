<template>
    <div class="bigscreen-wrappper bigscreen-main-wrapper">
        <div class="header-main-wrapper">
            <div class="header-left-part-wrapper">
                <BigScreenTime />
            </div>
            <div class="header-title-wrapper">白帝镇农文旅产业数字化赋能</div>
            <div class="header-right-part-wrapper"></div>
        </div>
        <div class="content-main-wrapper">
            <div class="left">
                <div class="left1">
                    <div class="box-title">产品介绍</div>
                    <div class="left1-item">
                      <div class='left1-top'>
                        <div class="left1-item-Bg">
                          <div :class="['left1-icon','left1-icon-1']"></div>
                        <div style="margin-left: 15px;margin-top: -20px;">
                          <div style="font-size:20px;color:#c1c1c1;">{{ sticObjs.area }}</div>
                          <div style="color:#0050a4;font-size:14px;">种植面积</div>
                        </div>
                      </div>
                      <div class="left1-item-Bg2">
                        <div :class="['left1-icon','left1-icon-2']"></div>
                        <div style="margin-left: 15px; margin-top: 10px;margin-top: -20px;">
                          <div style="font-size:20px;color:#c1c1c1;">{{ sticObjs.quantity }}</div>
                          <div style="color:#0050a4;font-size:14px;">养殖数量</div>
                        </div>
                      </div>
                      </div>
                      <!-- 第二部分 -->
                      <div style="width:100%;height:32%;">
                        <div style="display: flex">
                          <img src='./assets/left2Bg.png' style="width: 100px;height:68%;margin-right:2%;"/>
                          <div style="color:#c1c1c1;font-size:14px;">海拔900米，地处中纬度，四季变化明显，具有雨水充沛、年温适中、昼夜温差较大、无霜期长、光照充足等得天独厚的气候优势。</div>
                        </div>
                        <div style='width:100%;height:29%;margin-top:1%;color:#c1c1c1;font-size:14px;'>
                          夏黑、户太8号、巨峰、玫瑰香等早中晚熟葡萄1万余株。绿色生产和优异品质也换来商家的青睐，果园与国内著名“四川国光”集团达成了合作
                        </div>
                      </div>
                      <!-- 横线 -->
                      <div class='xian'></div>
                      <!-- 第三部分 -->
                      <el-carousel indicator-position="outside"  style="height: 35%; ">
                      <el-carousel-item  v-for="item,index in left3List" :key="index">
                        <div style="width:100%;height:100%;margin-top:5%; display:flex;">
                        <img :src='item.imgId' style="width: 150px;height:60%;margin-right:2%;"/>
                        <div style="color:#c1c1c1;font-size:14px;">{{item.cropDesc}}</div>
                      </div>
                      </el-carousel-item>
                    </el-carousel>
                      
                    </div>
                </div>
                <div class="left2">
                    <div class="box-title">生长监控</div>
                    <div class="left2-item">
                      <div id='chart1'></div>
                    </div>
                </div>
                
            </div>
            <div class="content-main-item middle-main-wrapper">
                <div class="main-top">
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-1']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">110</div>
                        <div style="font-size:14px;">设备数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-2']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">93</div>
                        <div style="font-size:14px;">在线数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-3']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">11</div>
                        <div style="font-size:14px;">离线数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-4']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">6</div>
                        <div style="font-size:14px;">故障数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-5']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">896</div>
                        <div style="font-size:14px;">智能鸡脚环</div>
                      </div>
                    </div>
                </div>
                <div class="middle-main-item">
                      <div class='sxt' v-for="item,index in webcam" :key="index" @click="webcamCli(index)" :style="{left:item.latitude>100?item.latitude/10+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}">
                         <div :style="{visibility:webcamIndex==index?'visible':'hidden',top:-sxtHeight+'px',left:'-50px'}" ref="sxtList" class="message">
                            <div class="message-item">
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.deviceCode}}</div>
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.parkName}}-{{item.plotName}}</div>
                            </div>
                            <div v-show="item.deviceStatus=='online'" style="font-size:15px"> 设备状态：<span style="color:#00ffdd;">在线</span></div>
                            <div v-show="item.deviceStatus=='offline'" style="font-size:15px"> 设备状态：<span style="color:#c1c1c1;">离线</span></div>
                            <div v-show="item.deviceStatus=='fault'" style="font-size:15px"> 设备状态：<span style="color:red;">故障</span></div>
                            <div class="messageJk">查看监控</div>
                         </div>
                      </div>
                      <div class='cgq' v-for="item,index in sensor" :key="index" @click="sensorCli(index)" :style="{left:item.latitude>100?item.latitude/15+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}">
                        <div :style="{visibility:sensorIndex==index?'visible':'hidden',top:-sensorHeight+'px',left:'-50px'}" class="message" ref="sensorList" > 
                            <div class="message-item">
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.deviceCode}}</div>
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.parkName}}-{{item.plotName}}</div>
                            </div>
                            <div v-for="itm,inde in item.values" :key="inde">
                              <div>
                                {{itm.key}}：{{itm.values}}
                              </div>
                            </div>
                         </div>
                      </div>
                      <div class='alarm' v-for="item,index in warn" @click="warnCli(index)" :key="index" :style="{left:item.latitude>100?item.latitude/13+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}">
                        <div  :style="{visibility:warnIndex==index?'visible':'hidden',top:-alarmHeight+'px',left:'-50px'}" ref="alarmList" class="message">
                            <div class="message-item">
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.deviceCode}}</div>
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.parkName}}-{{item.plotName}}</div>
                            </div>
                            <div style="color:red;">
                                {{item.warnTitle}}({{item.threshold}}),阈值{{item.currentValue}}
                            </div>
                         </div>
                      </div> 
                </div>
                <div class="middle-main-footer">
                    <div style="width: 49%;height:100%;">
                      <div class="box-title">特色产品</div>
                      <div class="middli-main-left">
                        <div class='left-top'>
                          <div class="main-left-pie">
                            <div class="pie"></div>
                          </div>
                          <div class="middle-main-right">
                              <div style="margin-top: 10px;">精品葡萄</div>
                              <di style="width:90%;align-items: center; display:flex;margin-top: 15px;justify-content: space-between;">
                                <div>
                                  <span>订单</span>
                                  <span>108</span>
                                </div>
                                <div style="width: 3px;height: 20px;background-color:#0c57c7 ;"></div>
                                <div>
                                  <span>销售额</span>
                                  <span>5940</span>
                                </div>
                              </di>
                          </div>
                        </div>
                        <div class='left-top'>
                          <div class="main-left-pie">
                            <div class="pie2"></div>
                          </div>
                          <div class="middle-main-right">
                              <div style="margin-top: 10px;">散养土鸡</div>
                              <di style="width:90%;align-items: center; display:flex;margin-top: 15px;justify-content: space-between;">
                                <div>
                                  <span>订单</span>
                                  <span>67</span>
                                </div>
                                <div style="width: 3px;height: 20px;background-color:#0c57c7 ;"></div>
                                <div>
                                  <span>销售额</span>
                                  <span>7906</span>
                                </div>
                              </di>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="middli-main-right" style="width: 49%;height:100%;">
                      <div class="box-title">智慧文旅</div>
                      <div style="font-size: 14px;color:#c1c1c1;display: flex;align-items: center;">客流量与特色产品销售数据
                          <div class="main-right-xian"></div>
                      </div>
                      <div id="chart2"></div>
                    </div>
                </div>
                <div class="middle-sxt">
                   
                </div>
            </div>
            <div class="right">
                <div class="right1">
                    <div class="box-title">设备运行状态</div>
                    <div class="right1-item">
                      <!-- 第一部分 -->
                      <div class="right1-item-top">
                        <div style="font-size:23px;font-family:'TitleFont';">物联网设备</div>
                        <div style="margin-right:20px;">
                          总数<span style="color:#00f391;font-size:23px;font-family:'TitleFont';margin-top:10px ;">104</span>台
                        </div>
                      </div>
                      <!-- 第二部分 -->
                      <div class="right1-warper">
                        <div class="right1-warper-item">
                          <div style="width: 100%;display: flex;justify-content: space-between;align-items: center">
                            <span style="font-family:'TitleFont';">生长监控</span>
                            <span style="color:#00f792;">65</span>
                          </div>
                          <div>
                            <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;font-size:14px;margin-top: 5px;">
                              <span style="color:#54d1d5;">在线 1</span>
                              <span style="color:red;">离线 1</span>
                            </div>
                              <div :class="['right1-onlin','right1-1']"></div>                                                      
                          </div>
                        </div>
                        <div class="right1-warper-item">
                          <div style="width: 100%;display: flex;justify-content: space-between;align-items: center">
                            <span style="font-family:'TitleFont';">土壤墒情</span>
                            <span style="color:#00f792;">8</span>
                          </div>
                          <div>
                            <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;font-size:14px;margin-top: 5px;">
                              <span style="color:#54d1d5;">在线 7</span>
                              <span style="color:red;">离线 1</span>
                            </div>
                              <div :class="['right1-onlin','right1-2']"></div>                                                      
                          </div>
                        </div>
                        <div class="right1-warper-item">
                          <div style="width: 100%;display: flex;justify-content: space-between;align-items: center">
                            <span style="font-family:'TitleFont';">气象站</span>
                            <span style="color:#00f792;">4</span>
                          </div>
                          <div>
                            <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;font-size:14px;margin-top: 5px;">
                              <span style="color:#54d1d5;">在线 4</span>
                              <span style="color:red;">离线 0</span>
                            </div>
                              <div :class="['right1-onlin','right1-3']"></div>                                                      
                          </div>
                        </div>
                        <div class="right1-warper-item">
                          <div style="width: 100%;display: flex;justify-content: space-between;align-items: center">
                            <span style="font-family:'TitleFont';">无人机</span>
                            <span style="color:#00f792;">3</span>
                          </div>
                          <div>
                            <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;font-size:14px;margin-top: 5px;">
                              <span style="color:#54d1d5;">在线 1</span>
                              <span style="color:red;">离线 2</span>
                            </div>
                              <div :class="['right1-onlin','right1-4']"></div>                                                      
                          </div>
                        </div>
                        <div class="right1-warper-item">
                          <div style="width: 100%;display: flex;justify-content: space-between;align-items: center">
                            <span style="font-family:'TitleFont';">杀虫灯</span>
                            <span style="color:#00f792;">16</span>
                          </div>
                          <div>
                            <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;font-size:14px;margin-top: 5px;">
                              <span style="color:#54d1d5;">在线 13</span>
                              <span style="color:red;">离线 3</span>
                            </div>
                              <div :class="['right1-onlin','right1-5']"></div>                                                      
                          </div>
                        </div>
                        <div class="right1-warper-item">
                          <div style="width: 100%;display: flex;justify-content: space-between;align-items: center">
                            <span style="font-family:'TitleFont';">虫情测报灯</span>
                            <span style="color:#00f792;">8</span>
                          </div>
                          <div>
                            <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;font-size:14px;margin-top: 5px;">
                              <span style="color:#54d1d5;">在线 8</span>
                              <span style="color:red;">离线 0</span>
                            </div>
                              <div :class="['right1-onlin','right1-6']"></div>                                                      
                          </div>
                        </div>
                      </div>
                      <!-- 第三部分 -->
                      <div class="right1-warper2">
                        <div class="right1-selecte1">
                           <div class='right1-title'>环境监测</div>
                        </div>
                      </div>
                      <div class="right1-warper3">
                        <div class="right1-warper3-left">
                          <div class="right1-left">
                            <div class="img"></div>
                            <div style="color:#00de88">11.14<span style='font-size:14px;'>℃</span> </div>
                          </div>
                          <div class="right1-right">
                            <div style="font-size:14px;width:100% ; display: flex;justify-content: space-around">湿度 <span style="color:#62f3f4;">98.19%</span></div>
                            <div class='right1-xian'></div>
                            <div style="font-size:14px;display: flex;width: 100%;justify-content: space-around">气压 <span style="color:#62f3f4;">98480Pa</span></div>
                          </div>
                        </div>
                        <div class="right1-warper3-cent">
                          <div style="font-size:12px;">降雨量 <span style="color:#62f3f4;">0.0mm</span></div>
                          <div style="font-size:12px;">光照强度 <span style="color:#62f3f4;">5615Lux</span></div>
                        </div>
                        <div class="right1-warper3-right">
                          <div style="font-size:12px;">风速 <span style="color:#62f3f4;">0.7m/s</span></div>
                          <div style="font-size:12px;">风向 <span style="color:#62f3f4;">东北</span></div>
                        </div>
                      </div>
                      <!-- 第四部分 -->
                      <div class="right1-warper2">
                        <div class="right1-selecte1">
                           <div class='right1-title'>土壤墒情</div>
                        </div>
                      </div>
                      <div class="right1-warper4">
                           <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-1']"></div>
                            <div style="margin-left:8px;">
                              <div style="color:#68fffe;">18.3℃</div>
                              <div style="font-size:14px;">土壤温度</div>
                            </div>
                          </div>
                          <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-2']"></div>
                            <div style="margin-left:8px;">
                              <div style="color:#68fffe;">92.3℃</div>
                              <div style="font-size:14px;">土壤湿度</div>
                            </div>
                          </div>
                          <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-3']"></div>
                            <div style="margin-left:8px;">
                              <div style="color:#68fffe;">6.8</div>
                              <div style="font-size:14px;">PH值</div>
                            </div>
                          </div>
                          <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-4']"></div>
                            <div style="margin-left:8px;">
                              <div style="color:#68fffe;">0.42</div>
                              <div style="font-size:14px;">土壤EC值</div>
                            </div>
                          </div>
                      </div>
                    </div>
                </div>
                <div class="right2">
                    <div class="box-title">预警信息</div>
                    <div class="right2-item">
                         <div class="right2-warper" v-for="item,index in warnInfo" :key="index">
                           <div style="width:20%;font-size:12px ; color: #c1c1c1;display: flex;flex-direction: column;align-items: center;">
                            {{ item.warnTitle }}
                            <div :class="['right2-warper-leftBg','right2-warper-1']"></div>
                          </div>
                           <div style="width:40%;color: #c1c1c1;font-size: 14px;">{{ item.warnInfo }}</div>
                           <div style="width: 40%;">{{new Date().toLocaleString(item.warnTime)}}</div>
                         </div>
                    </div>
                </div>
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
import {
  Statistics,
  baidiParkInfo,
  page,
  warningRecordInfo,
  SmartTour,
  People
} from '@/api/bigscreen10/index'
import * as echarts from "echarts"
import {ref,reactive,onMounted} from 'vue'
import { object } from 'vue-types';
import { resetSize } from '@/components/Verifition/src/utils/util';

//柑橘数据分析
const initChart1= async ()=>{
  // let res= await ProductionData()
    initChartStatic(
        "chart1",
        generateBaseOptions({
          xAxis: {
            data:['1月','2月','3月','4月','5月','6月','7月'],
            interval:0,
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
         color:['#20cafd'],
          yAxis:{
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
              },
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#c1c1c1", //网格线颜色
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
              name: "生长监控",
              data:[0.2,0.5,0.7,1,1.25,1.40,1.75,],
              type: "line",
              symbol:'none',
              areaStyle:{
                color:'#20cafd'
              }
            },
          ],
          grid: {
            left: "10%",
            right: "3%",
            top: "17%",
            bottom: "15%",
          },
        })
      );
}
const initChart2= async ()=>{
  let res1=await SmartTour()
  let res2=await People()
  console.log(res1,'文旅销售额')
  console.log(res2,'旅客流量')
    initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data:['1月','2月','3月','4月','5月','6月','7月'],
            interval:0,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
              },
            },
          },
          legend: { 
            show: false, 
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
         color:['#2becfc','#fdca00'],
          yAxis:[
            {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
              },
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#c1c1c1", //网格线颜色
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
            type: "value",
            max:'5',
            main:'0'
          }
        ],
          series: [
            {
              name: "客流",
              data:[3681,1032,2486,2761,3962,4032,3561],
              type: "bar",
              barWidth:'20',
              label: {
               show: true, // 显示文字
               position: 'top', // 在顶部显示
             // 可以通过 formatter 自定义显示的文本内容
               formatter: '{c}', // {c} 表示数据值,
                color:'#c1c1c1'
              }
            },
            {
              name: "销售额",
              data:[2.25,1.75,2.25,2.8,3.5,2.6,3.25],
              type: "line",
              yAxisIndex:1,
              symbol:'none',
            },
          ],
          grid: {
            left: "10%",
            right: "10%",
            top: "17%",
            bottom: "15%",
          },
        })
      );
}
onMounted(()=>{
    initChart1()
    initChart2()
})
//获取左上角数据
let sticObjs=ref({})
const getStatistics=()=>{
  Statistics().then(res=>{
    console.log(res,'左上角数据');
    sticObjs.value=res
  })
}
getStatistics()
//左边第二部分
let parkInfo=ref({})
const getbaidiParkInfo=()=>{
  baidiParkInfo().then(res=>{
    console.log(res,'左边第二部分');
    parkInfo.value=res
  })
}
getbaidiParkInfo()
//左边第三部分
let left3List=ref([])
const getPage=()=>{
  page({pageReqVO:{}}).then(res=>{
    console.log(res,'左边第三部分');
    left3List.value=res.list
  })
}
getPage()
//预警信息
let warnInfo=ref([])
const getWarningRecordInfo=()=>{
  warningRecordInfo().then(res=>{
    console.log(res,'预警信息');
    warnInfo.value=res
  })
}
getWarningRecordInfo()
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);
.bigscreen-wrappper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .header-main-wrapper {
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
    line-height: 2rem;
    text-indent: 2.5rem;
    font-size: 1.3rem;
    font-family: "TitleFont";
    background-size: 100% 100%;
    background-image: url("./assets/titleBg.png");
}
.content-main-wrapper {
  padding: 0px 15px !important;
  box-sizing:border-box ;
  color: #fff;
  display: grid;
  grid-template-columns: 25% calc(50% - 20px) 25%;
  grid-auto-rows: 100%;
  gap: 10px;
  .left{
    z-index: 9999;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 70%  calc(30% - 10px);
    grid-auto-columns: 100%;
    gap: 10px;
    .left1{
        width: 100%;
        height:100%;
        .left1-item{
            box-sizing: border-box;
            width: 100%;
            margin-top: 10px;
            padding: 10px 15px ;
            height: calc(100% - 3rem);
            background-size: 100% 100%;
            background-image: url(./assets/left1Bg.png);
            .left1-top{
              width: 100%;
              height: 30%;
              display: flex;
              justify-content: space-between;
              .left1-item-Bg{
              width: 48%;
              height:80%;
              display: flex;
              align-items:center;
              justify-content: center;
              background-size: 100% 100%;
              background-image: url(./assets/left1ItemBg.png);
              .left1-icon{
                margin-top: -20px;
                width:3rem;
                height: 3rem;
                background-size: 100% 100%;
              }
            }
            .left1-item-Bg2{
              width: 48%;
              height:80%;
              display: flex;
              align-items:center;
              justify-content: center;
              background-size: 100% 100%;
              background-image: url(./assets/left1ItemBg.png);
              .left1-icon{
                width:3rem;
                margin-top: -20px;
                height: 3rem;
                background-size: 100% 100%;
              }
            }
            }
            .xian{
              width: 100%;
              height:1%;
              
              background-size: 100% 100;
              background-image: url(./assets/left2Xian.png);
            }
            
            
        }
    }
    .left2{
        width: 100%;
        height: 100%;
        .left2-item{
            width: 100%;
            height: calc(100% - 2rem);
            #chart1{
              width: 100%;
              height: 100%;
            }
        }
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
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .main-top-item{
        width:5rem;
        height:5rem;
        background-size: 100% 100%;
      }
      
    }
    .middle-main-item{
      position: absolute;
      width: 1200px;
      height: 750px;
      left: calc(50% - 600px);
      top: calc(50% - 450px);
      background-size: 100% 100%;
      background-image: url(./assets/mainBg.png);
      position: relative;
      
       
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
                width: 60%;
                height: 80%;
                background-size: 100% 100%;
                background-image: url(./assets/main-pie.png);
              }
              .pie2{
                width: 70%;
                height:80%;
                background-size: 100% 100%;
                background-image: url(./assets/main-pie2.png);
              }
            }
            .middle-main-right{
              width:70%;
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
        right: 5%;
        bottom: 24%;
        display: flex;
        width: 40%;
        align-items: center;
        justify-content: space-between;
        .middle-icon{
            width: 3rem;
            height: 3rem;
        }
    }
  }
  .right{
    width: 100%;
    z-index: 9999;
    height: 100%;
    display: grid;
    grid-template-rows: 70% calc(30% - 15px);
    grid-auto-columns: 100%;
    gap: 15px;
    .right1{
        width: 100%;
        height:100%;
        .right1-item{
            box-sizing:border-box;
            width: 100%;
            height:calc(100% - 2.5rem);
            margin-top: 10px;
            background-size: 100% 100%;
            background-image: url(./assets/left1Bg.png);
            .right1-item-top{
              box-sizing: border-box;
              width: 100%;
              height: 10%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 20px;
              background-size: 100% 100%;
              background-image: url(./assets/right1Top.png);
            }
            .right1-warper{
              width: 100%;
              margin-top: 10px;
              height: 40%;
              display: grid;
              grid-template-columns:  49% calc(51% - 10px);
              grid-template-rows: 30% 30% calc(40% - 20px);
              gap:10px;
              .right1-warper-item{
                
                padding: 5px 10px;
                box-sizing:border-box ;
                width: 100%;
                height: 100%;
                background-size: 100% 100%;
                background-image: url(./assets/right1Warper.png);
                  .right1-onlin{
                    margin-top:5px;
                    width: 100%;
                    height: 10px;
                    background-size: 100% 100%;
                }
                
                
                
              }
            }
            .right1-warper2{
              width: 100%;
              height: 30px;
              .right1-selecte1{
                width: 80%;
                height: 100%;
                line-height: 30px;
                text-indent: 2rem;
                font-size: 20px;
                font-family: 'TitleFont';
                background-size: 100% 100%;
                background-image: url(./assets/right1-title.png);
              }

            }
            .right1-warper3{
              width: 100%;
              height: 18%;
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .right1-warper3-left{
                width: 50%;
                height:100%;
                display: flex;
                background-size: 100% 100%;
                background-image: url(./assets/right1Warper3.png);
                .right1-left{
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  width: 40%;
                  height: 100%;
                  .img{
                    width: 2rem;
                    height: 2rem;
                    background-size: 100% 100%;
                    background-image: url(./assets/right1Left.png);
                  }
                }
                .right1-right{
                  width: 60%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: space-around;
                  .right1-xian{
                    width: 100%;
                    height: 2px;
                    background-size: 100% 100%;
                    background-image: url(./assets/right1Xian.png);
                  }
                }
              }
              .right1-warper3-cent{
                width: 23%;
                height:100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                background-size: 100% 100%;
                background-image: url(./assets/right1Warper3.2.png);
              }
              .right1-warper3-right{
                width: 23%;
                height:100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                background-size: 100% 100%;
                background-image: url(./assets/right1Warper3.2.png);
              }

            }
            .right1-warper4{
              margin-top:10px;
              width: 100%;
              height:14%;
              display: grid;
              grid-template-columns: 24% 24% 24% calc(28% - 30px);
              gap:10px;
              .right1-warper4-item{
                width: 100%;
                box-sizing: border-box;
                height:100%;
                padding:0 5px;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                background-image: url(./assets/right1Warper4Bg.png);
                .right1-warper4-icon{
                width:2rem;
                height:2rem;
                background-size: 100% 100%;
              }
              }
              
            }
        }
    }
    .right2{
        width: 100%;
        height: 100%;
        .right2-item{
            box-sizing: border-box;
            width: 100%;
            height: calc(100% - 2rem);
            background-size:100% 100%;
            background-image: url(./assets/right2Item.png);
            overflow-y: scroll;
          .right2-warper{
            margin-top: 10px;
            display: flex;
            align-items: center;
            border: 2px solid red;
            box-sizing: border-box;
            width:100%;
            height: 25%;
            .right2-warper-leftBg{
              width: 4rem;
              height:1rem;
              background-size: 100% 100%;
            }
          }
        }
        .right2-item::-webkit-scrollbar{
          display: none;
        }
    }
  }
}

@for $i from 1 through 5 {
  .main-#{$i} {
    background-image: url(./assets/mainTop#{$i}.png);
  }
}
@for $i from 1 through 6 {
  .right1-#{$i} {
    background-image: url(./assets/right1Bg#{$i}.png);
  }
}
@for $i from 1 through 4 {
  .right1-warper4-#{$i} {
    background-image: url(./assets/right1Warper4-#{$i}.png);
  }
}
@for $i from 1 through 3 {
  .right2-warper-#{$i} {
    background-image: url(./assets/right2WarperLeft#{$i}.png);
  }
}
@for $i from 1 through 2 {
  .left1-icon-#{$i} {
    background-image: url(./assets/left1WarperBg#{$i}.png);
  }
}



</style>