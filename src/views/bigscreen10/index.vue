<template>
    <div class="bigscreen-wrappper bigscreen-main-wrapper">
        <div class="header-main-wrapper">
            <div class="header-left-part-wrapper">
                <BigScreenTime />
            </div>
            <div class="header-title-wrapper">白帝镇农文旅产业数字化赋能</div>
            <div class="header-right-part-wrapper">
              <BackOrHome />
            </div>
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
                      <el-carousel indicator-position="outside"  style="height: 33%;margin-bottom: 20px; ">
                      <el-carousel-item  v-for="item,index in parkInfo" :key="index">
                        <div style="width:100%;height:100%;margin-top:5%; display:flex;">
                        <img :src='item.img' style="width: 150px;height:60%;margin-right:2%;"/>
                        <div class="left2-right" style="color:#c1c1c1;font-size:14px;height: 100%;">{{item.remark}}</div>
                      </div>
                      </el-carousel-item>
                    </el-carousel>
                      <!-- 横线 -->
                      <div class='xian'></div>
                      <!-- 第三部分 -->
                      <el-carousel indicator-position="outside"  style="height: 35%; ">
                      <el-carousel-item  v-for="item,index in left3List" :key="index">
                        <div style="width:100%;height:100%;margin-top:5%; display:flex;">
                        <img :src='item.imgId' style="width: 150px;height:55%;margin-right:2%;"/>
                        <div  style="color:#c1c1c1; font-size:14px;">{{item.cropDesc}}</div>
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
                        <div style="font-size:25px">{{ contObj.equipmentNum }}</div>
                        <div style="font-size:14px;">设备数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-2']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">{{ contObj.equipmentOnline }}</div>
                        <div style="font-size:14px;">在线数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-3']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">{{ contObj.equipmentOffline }}</div>
                        <div style="font-size:14px;">离线数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-4']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">{{ contObj.equipmentFault }}</div>
                        <div style="font-size:14px;">故障数量</div>
                      </div>
                    </div>
                    <div style="width:19%;height: 100%;display: flex;align-items: center;">
                      <div :class="['main-top-item','main-5']"></div>
                      <div style="display:flex;flex-direction: column;align-items: center;margin-left: 10px;">
                        <div style="font-size:25px">{{ contObj.chickenNum }}</div>
                        <div style="font-size:14px;">智能鸡脚环</div>
                      </div>
                    </div>
                </div>
                <div class="middle-main-item">
                  <div class='sxt1' @click="sxt1Cli(index)" v-for="item,index in sxt1List" :key="index" :style="{left:item.latitude>100?item.latitude/60+'%':item.latitude+'%',top:item.longitude>100?item.longitude/20+'%':item.longitude+'%'}">
                         <div :style="{visibility:sxt1Index==index?'visible':'hidden', top:-sxt1Height+'px',left:'-50px'}" ref="sxtList1" class="message">
                           <div style="text-align:center;margin-top:30px;margin-bottom:15px">{{item.deviceName}}</div>
                           <div style=" display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;color:#c1c1c1;">
                              <div v-for="itm,inde in item.result" :key="inde">{{itm.dataType}}：{{itm.avgData+itm?.dataUnit}}</div>
                              <div v-show="item.deviceStatus=='online'">状态：<span style="color:#1ea362;">在线</span></div>
                              <div v-show="item.deviceStatus=='offline'">状态：<span style="color:#c1c1c1;">离线</span></div>
                              <div v-show="item.deviceStatus=='fault'">状态：<span style="color:red;">故障</span></div>
                           </div>
                           
                         </div>
                    </div>
                    <div class='sxt2' @click="sxt2Cli(index)" v-for="item,index in sxt2List" :key="index" :style="{left:item.latitude>100?item.latitude/10+'%':item.latitude+'%',top:item.longitude>100?item.longitude/20+'%':item.longitude+'%'}">
                         <div :style="{visibility:sxt2Index==index?'visible':'hidden', top:-sxt2Height+'px',left:'-50px'}" ref="sxtList2" class="message">
                           <div style="text-align:center;margin-top:30px;margin-bottom:15px">{{item.deviceName}}</div>
                           <div style=" display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;color:#c1c1c1;">
                              <div v-for="itm,inde in item.result" :key="inde">{{itm.dataType}}：{{itm.avgData+itm?.dataUnit}}</div>
                              <div v-show="item.deviceStatus=='online'">状态：<span style="color:#1ea362;">在线</span></div>
                              <div v-show="item.deviceStatus=='offline'">状态：<span style="color:#c1c1c1;">离线</span></div>
                              <div v-show="item.deviceStatus=='fault'">状态：<span style="color:red;">故障</span></div>
                           </div>
                           
                         </div>
                    </div>
                    <div class='sxt3' @click="sxt3Cli(index)" v-for="item,index in sxt3List" :key="index" :style="{left:item.latitude>100?item.latitude/10+'%':item.latitude+'%',top:item.longitude>100?item.longitude/40+'%':item.longitude+'%'}">
                         <div :style="{visibility:sxt3Index==index?'visible':'hidden', top:-sxt3Height+'px',left:'-50px'}" ref="sxtList3" class="message">
                           <div style="text-align:center;margin-top:30px;margin-bottom:15px">{{item.deviceName}}</div>
                           <div style=" display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;color:#c1c1c1;">
                              <div v-for="itm,inde in item.result" :key="inde">{{itm.dataType}}：{{itm.avgData+itm?.dataUnit}}</div>
                              <div v-show="item.deviceStatus=='online'">状态：<span style="color:#1ea362;">在线</span></div>
                              <div v-show="item.deviceStatus=='offline'">状态：<span style="color:#c1c1c1;">离线</span></div>
                              <div v-show="item.deviceStatus=='fault'">状态：<span style="color:red;">故障</span></div>
                           </div>
                           <div class="middle-btn">查看监控</div>
                         </div>
                    </div>
                    <div class='sxt4' @click="sxt4Cli(index)" v-for="item,index in sxt4List" :key="index" :style="{left:item.latitude>100?item.latitude/10+'%':item.latitude+'%',top:item.longitude>100?item.longitude/20+'%':item.longitude+'%'}">
                         <div :style="{visibility:sxt4Index==index?'visible':'hidden', top:-sxt4Height+'px',left:'-50px'}" ref="sxtList4" class="message">
                           <div style="text-align:center;margin-top:30px;margin-bottom:15px">{{item.deviceName}}</div>
                           <div style=" display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;color:#c1c1c1;">
                              <div v-for="itm,inde in item.result" :key="inde">{{itm.dataType}}：{{itm.avgData+itm?.dataUnit}}</div>
                              <div v-show="item.deviceStatus=='online'">状态：<span style="color:#1ea362;">在线</span></div>
                              <div v-show="item.deviceStatus=='offline'">状态：<span style="color:#c1c1c1;">离线</span></div>
                              <div v-show="item.deviceStatus=='fault'">状态：<span style="color:red;">故障</span></div>
                           </div>
                           
                         </div>
                    </div>
                      
                      
                </div>
                <div class="middle-main-footer">
                    <div style="width: 49%;height:100%;">
                      <div class="box-title">特色产品</div>
                      <div class="middli-main-left">
                        <div class='left-top' v-for="item,index in ProductList" :key="index">
                          <div class="main-left-pie">
                          <img :src="item.img" style="width:4rem;height: 4rem;border-radius: 50%;"/>
                          </div>
                          <div class="middle-main-right">
                              <div style="margin-top: 10px;">{{ item.featureName }}</div>
                              <di style="width:90%;align-items: center; display:flex;margin-top: 15px;justify-content: space-between;">
                                <div>
                                  <span>订单</span>
                                  <span>{{item.orderNum}}</span>
                                </div>
                                <div style="width: 3px;height: 20px;background-color:#0c57c7 ;"></div>
                                <div>
                                  <span>销售额</span>
                                  <span>{{ item.sale}}<span style="font-size:12px">({{item.saleUnit}})</span> </span>
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
                   <div style="display:flex;align-items: center;width:23%;font-size:13px;"><div :class="['middle-icon','main-sxt-1']"></div> 气象站</div>
                   <div style="display:flex;align-items: center;width:23%;font-size:13px;"><div :class="['middle-icon','main-sxt-2']"></div> 监控设备</div>
                   <div style="display:flex;align-items: center;width:23%;font-size:13px;"><div :class="['middle-icon','main-sxt-3']"></div> 土壤传感</div>
                   <div style="display:flex;align-items: center;width:23%;font-size:13px;"><div :class="['middle-icon','main-sxt-4']"></div> 虫情测报灯</div>
                </div>
            </div>
            <div class="right">
                <div class="right1">
                    <div class="box-title">设备运行状态</div>
                    <div class="right1-item">
                      <!-- 第一部分 -->
                      <div class="right1-item-top">
                        <div style="font-size:23px;font-family:'TitleFont';">{{statisticsObj.name}}</div>
                        <div style="margin-right:20px;">
                          总数<span style="color:#00f391;font-size:23px;font-family:'TitleFont';margin-top:10px ;">{{statisticsObj.total}}</span>台
                        </div>
                      </div>
                      <!-- 第二部分 -->
                      <div class="right1-warper">
                        <div class="right1-warper-item" v-for="item,index in statisticsList" :key="index">
                          <div style="width: 100%;display: flex;justify-content: space-between;align-items: center">
                            <span style="font-family:'TitleFont';">{{item.name}}</span>
                            <span style="color:#00f792;">{{item.equipmentNum}}</span>
                          </div>
                          <div>
                            <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;font-size:14px;margin-top: 5px;">
                              <span style="color:#54d1d5;">在线 {{item.equipmentOnline}}</span>
                              <span style="color:red;">离线 {{item.equipmentOffline}}</span>
                            </div>
                              <div :class="['right1-onlin','right1-1']">
                                <div style="background-color:#0287d1;widht:100%;height:100%;border-radius:25px;"></div>
                              </div>                                                      
                          </div>
                        </div>
                      </div>
                      <!-- 第三部分 -->
                      <div class="right1-warper2">
                        <div class="right1-selecte1">
                           <div class='right1-title'>环境监测</div>
                        </div>
                        <div class="selecte">
                          <select id='' name="" @change="select1">
                            <option :value="item.id" :data-value1="item.deviceType" v-for="item,index in selecteList.meteorology" :key="index">{{item.deviceName}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="right1-warper3">
                        <div class="right1-warper3-left">
                          <div class="right1-left">
                            <div class="img"></div>
                            <div style="color:#00de88">{{timeData.temperature}} </div>
                          </div>
                          <div class="right1-right">
                            <div style="font-size:14px;width:100% ; display: flex;justify-content: space-around">湿度 <span style="color:#62f3f4;">{{ timeData.humidity }}</span></div>
                            <div class='right1-xian'></div>
                            <div style="font-size:14px;display: flex;width: 100%;justify-content: space-around">气压 <span style="color:#62f3f4;">{{ timeData.airPressure }}</span></div>
                          </div>
                        </div>
                        <div class="right1-warper3-cent">
                          <div style="font-size:12px;">降雨量 <span style="color:#62f3f4;">{{ timeData.rainfall }}</span></div>
                          <div style="font-size:12px;">光照强度 <span style="color:#62f3f4;">{{timeData.lighting}}</span></div>
                        </div>
                        <div class="right1-warper3-right">
                          <div style="font-size:12px;">风速 <span style="color:#62f3f4;">{{ timeData.windSpeed }}</span></div>
                          <div style="font-size:12px;">风向 <span style="color:#62f3f4;">{{ timeData.wind }}</span></div>
                        </div>
                      </div>
                      <!-- 第四部分 -->
                      <div class="right1-warper2">
                        <div class="right1-selecte1">
                           <div class='right1-title'>土壤墒情</div>
                        </div>
                        <div class="selecte">
                          <select id='' name="" @change="select2">
                            <option :value="item.id"  v-for="item,index in selecteList.soil" :key="index">{{item.deviceName}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="right1-warper4">
                           <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-1']"></div>
                            <div style="margin-left:8px;width: calc(100% - 2rem);">
                              <div style="color:#68fffe;">{{ soilObj.soilDepth }}</div>
                              <div style="font-size:14px;">土壤温度</div>
                            </div>
                          </div>
                          <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-2']"></div>
                            <div style="margin-left:8px;width: calc(100% - 2rem);">
                              <div style="color:#68fffe;">{{soilObj.soilTemperature}}</div>
                              <div style="font-size:14px;">土壤湿度</div>
                            </div>
                          </div>
                          <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-3']"></div>
                            <div style="margin-left:8px;width: calc(100% - 2rem);">
                              <div style="color:#68fffe;font-size: 13px;">{{soilObj.soilHumidity}}</div>
                              <div style="font-size:14px;">PH值</div>
                            </div>
                          </div>
                          <div class="right1-warper4-item">
                            <div :class="['right1-warper4-icon','right1-warper4-4']"></div>
                            <div style="margin-left:8px; width: calc(100% - 2rem);">
                              <div style="color:#68fffe;font-size: 13px;">{{soilObj.soilEC}}</div>
                              <div style="font-size:13px;">土壤EC值</div>
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
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
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
  People,
  deviceCount,
  getLineChar,
  featureProduct,
  sensorDevice,
  realTimeDataByDeviceId,
  deviceStatistics,
  DevicePoint
} from '@/api/bigscreen10/index'
import * as echarts from "echarts"
import {ref,reactive,onMounted} from 'vue'
import { object } from 'vue-types';
import { resetSize } from '@/components/Verifition/src/utils/util';


const initChart1= async ()=>{
   let res= await getLineChar({
    cropCode:'1774714272496418816',
    pageNo:1,
    pageSize: 6
   })
   let xValue=res.xValue
   let yValue=res.yValue
   console.log(res,'左二')
    initChartStatic(
        "chart1",
        generateBaseOptions({
          xAxis: {
            data:xValue,
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
              data:yValue,
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
  let xAxisData=Object.keys(res1)
  let lineData=Object.values(res1)
  let barData=Object.values(res2)
  console.log(res1,'客流')
  console.log(res1,'销售额')
    initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data:xAxisData,
            interval:0,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
              },
            },
            axisLabel:{
              interval:0
            }
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
            max:Math.max.apply(null,lineData),
            main:'0'
          }
        ],
          series: [
            {
              name: "客流",
              data:barData,
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
              data:lineData,
              type: "line",
              yAxisIndex:1,
              symbol:'none',
            },
          ],
          grid: {
            left: "15%",
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
//获取中间顶部卡片
let contObj=ref({})
const getDeviceCount=()=>{
  deviceCount().then(res=>{
    console.log(res,'中间顶部卡片');
    contObj.value=res
  })
}
getDeviceCount()
//获取特色产品 土鸡
let ProductList=ref([])
const getFeatureProduct=()=>{
  featureProduct().then(res=>{
    console.log(res,'特色产品 土鸡');
    ProductList.value=res.reverse()
  })
}
getFeatureProduct()
//设备运行-设备接口
let selecteList=ref([])
const getSensorDevice=()=>{
  sensorDevice().then(res=>{
    console.log(res,'设备运行-设备接口');
    selecteList.value=res
    getTimeDataByDeviceId({deviceId:res.meteorology[0].id,deviceType:'meteorology'})
    getTimeDataByDeviceId2({deviceId:res.soil[0].id,deviceType:'soil'})
  })
}
getSensorDevice()
//获取实时环境数据
let timeData=ref({})
let soilObj=ref({})
const getTimeDataByDeviceId=(val)=>{
  realTimeDataByDeviceId(val).then(res=>{
    console.log(res,'获取实时环境数据');
    timeData.value=res
  })
}
//获取实时土壤数据
const getTimeDataByDeviceId2=(val)=>{
  realTimeDataByDeviceId(val).then(res=>{
    console.log(res,'获取实时土壤数据');
    soilObj.value=res
  })
}
//土壤监测点击
const select1=(e)=>{
  getTimeDataByDeviceId({deviceId:e.target.value,deviceType:'meteorology'})

}
//环境监测点击
const select2=(e)=>{
  getTimeDataByDeviceId2({deviceId:e.target.value,deviceType:'soil'})

}
//设备数量统计
let statisticsObj=ref({})
let statisticsList=ref({})
const getDeviceStatistics=()=>{
  deviceStatistics().then(res=>{
    console.log(res,'设备数量统计');
    statisticsObj.value=res
    statisticsList.value=res.list
  })
}
getDeviceStatistics()
//获取地图数据
let sxt1List=ref([])
let sxt2List=ref([])
let sxt3List=ref([])
let sxt4List=ref([])
const getDevicePoint=()=>{
  DevicePoint().then(res=>{
    console.log(res,'地图中间');
    let a=res.SensorDevice
    let b=res.monitorDevice
    let i=7
    let i2=6
    a.forEach((item,index)=>{
      if(typeof(item.latitude)!='string') return  a.splice(index, 1)
      else  item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    b.forEach((item,index)=>{
      if(typeof(item.latitude)!='string') return b.splice(index, 1)
      else  item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    sxt1List.value.push(a[0])
    sxt2List.value.push(a[1])
    for(let i =0 ;i<7;i++){
      if(i<5){
        sxt3List.value.push(b[i])
      }else{
        sxt4List.value.push(b[i])
      }
      
    }
    console.log(sxt1List.value,'sxt1List');
    console.log(sxt2List.value,'sxt1List');
    console.log(sxt3List.value,'sxt1List');
    console.log(sxt4List.value,'sxt1List');
    
  })
}
getDevicePoint()
//获取高度
let sxtList1=ref(null)
let sxt1Index=ref(-1)
let sxt1Height=ref(0)
const sxt1Cli=(index)=>{
  sxt1Index.value=index
  sxt1Height.value=sxtList1.value[index].offsetHeight
}
let sxtList2=ref(null)
let sxt2Index=ref(-1)
let sxt2Height=ref(0)
const sxt2Cli=(index)=>{
  sxt2Index.value=index
  sxt2Height.value=sxtList2.value[index].offsetHeight
}
let sxtList3=ref(null)
let sxt3Index=ref(-1)
let sxt3Height=ref(0)
const sxt3Cli=(index)=>{
  sxt3Index.value=index
  sxt3Height.value=sxtList3.value[index].offsetHeight
}
let sxtList4=ref(null)
let sxt4Index=ref(-1)
let sxt4Height=ref(0)
const sxt4Cli=(index)=>{
  sxt4Index.value=index
  sxt4Height.value=sxtList4.value[index].offsetHeight
}
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
            .left2-right{
              overflow-y:scroll;
            }
            .left2-right::-webkit-scrollbar{
              display: none;
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
              position: relative;
              height: 30px;
              .right1-selecte1{
                width: 80%;
                height: 100%;
                line-height: 30px;
                text-indent: 2rem;
                font-size: 20px;
                font-family: 'TitleFont';
                background-size: 100% 100%;
                background:none;
                background-image: url(./assets/right1-title.png);
              }
              .selecte{
                position:absolute;
                top: 0;
                right:0;
                select{
                  background:none;
                  color:#fff;
                  background-size: 100% 100%;
                  background-image: url(./assets/select.png);
                  option{
                  color:#000;
                  }
                }
                
                
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
@for $i from 1 through 1 {
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
@for $i from 1 through 4 {
  .main-sxt-#{$i} {
    background-image: url(./assets/sxt#{$i}.png);
  }
}



</style>