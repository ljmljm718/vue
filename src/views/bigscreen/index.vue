<template>
    <div class="bigscreen-wrappper bigscreen-main-wrapper">
        <div class="header-main-wrapper">
            <div class="header-left-part-wrapper">
                <BigScreenTime />
            </div>
            <div class="header-title-wrapper">明月村农业产业监管大屏</div>
            <div class="header-right-part-wrapper"></div>
        </div>
        <div class="content-main-wrapper">
            <div class="left">
                <div class="left1">
                    <div class="box-title">产品介绍</div>
                    <div class="left1-item">
                      <el-carousel @click="$router.push('/basic/cropbase')" :interval="3000" indicator-position='none' :autoplay='true' arrow="always" style="width: 100%;height: 100%;cursor: pointer;">
                        <el-carousel-item v-for="item in cropList" :key="item" style="width: 100%;height: 50%;display:flex;align-items:center;justify-content:space-between;">
                          <img :src="item.imgId" alt="" style="width: 30%;height: 100%;"/>
                          <div style="width: 67%;height: 100%;font-size:12px;color:#c1c1c1;">
                            {{item.cropDesc}}
                          </div>
                        </el-carousel-item>
                      </el-carousel>
                    </div>
                </div>
                <div class="left2">
                    <div class="box-title">种植资源</div>
                    <div class="left2-item">
                        <div class="left-warper">
                            <div style="width: 50%;height: 50%;display:flex;align-items:center;">
                                <div :class="['left2-icon','left2-1']"></div>
                                <div @click="$router.push('/basic/parkbase')" style="cursor: pointer;">
                                    <div style="font-size:12px;color:#c1c1c1;margin-bottom:15px">种植园区</div>
                                    <div style="font-size:16px;">{{plantInfo.parkNum}}</div>
                                </div>
                            </div>
                            <div style="width: 50%;height: 50%;display:flex;align-items:center;">
                                <div :class="['left2-icon','left2-2']"></div>
                                <div  @click="$router.push('/basic/parkbase')" style="cursor: pointer;">
                                    <div style="font-size:12px;color:#c1c1c1;margin-bottom:15px">种植地块</div>
                                    <div style="font-size:16px;">{{plantInfo.plotNum}}</div>
                                </div>
                            </div>
                            <div style="width: 50%;height: 50%;display:flex;align-items:center;">
                                <div :class="['left2-icon','left2-3']"></div>
                                <div  @click="$router.push('/smartAgri/plant-plan')" style="cursor: pointer;">
                                    <div style="font-size:12px;color:#c1c1c1;margin-bottom:15px">作物品种</div>
                                    <div style="font-size:16px;">{{plantInfo.cropNum}}</div>
                                </div>
                            </div>
                            <div style="width: 50%;height: 50%;display:flex;align-items:center;">
                                <div :class="['left2-icon','left2-4']"></div>
                                <div  @click="$router.push('/smartAgri/plant-plan')" style="cursor: pointer;">
                                    <div style="font-size:12px;color:#c1c1c1;margin-bottom:15px">种植面积</div>
                                    <div style="font-size:16px;">{{plantInfo.plantArea}} <span style="font-size:12px">亩</span> </div>
                                </div>
                            </div>
                        </div>
                        <div class="left-warper2">
                            <div id="chart1"></div>
                        </div>
                    </div>
                </div>
                <div class="left3">
                    <div class="box-title" style="cursor: pointer;" @click="$router.push('/basic/device/device-data')">物联设备数据</div>
                    <div class="left3-select">
                      <select name="" id="1" class="select1" @change="selectCli1">
                        <option :value="item.id" v-for="item,index in select" :key="index">{{item.name}}</option>
                      </select>
                      <select name="" id="2" class="select2" @change="selectCli2">
                        <option v:value="item.id" v-for="item,index in select2" :key="index">{{item.name}}</option>
                      </select>
                    </div>
                    <div class="left3-item">
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.envTemp}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">环境温度℃</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.envHumidity}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">环境湿度％</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.light}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">光照强度</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.rainFall}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">降雨量mm</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.speed}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">风速</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.wind}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">风向</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.pressure}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">气压Pa</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.soilTemp}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">土壤温度℃</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.soilHumidity}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">土壤湿度%</div>
                        </div>
                        <div class="left3-warper">
                            <div style="color:#4a84b4;text-align:center;font-size:18px;">{{IoTLates.soilConductivity}}</div>
                            <div style="color:#c1c1c1;font-size:10px;text-align:center;">土壤导电率S/m</div>
                        </div>
                    </div>
                </div>
                <div class="left4">
                    <div class="box-title" @click="$router.push('/warning/warning-record')" style="cursor: pointer;">预警信息</div>
                    <div class="table-wrapper" v-if="leftArr.tableData1.length>0">
                        <div class="table-header-row">
                        <div
                            class="table-header-cell"
                            v-for="column,index in leftArr.tableColumns1"
                            :style="`width: ${column.width};`" :key="index"
                        >{{ column.label }}</div>
                        </div>
                        <div class="table-data-row" v-for="item,index in leftArr.tableData1" :key="index" @click="$router.push(`/warning/warning-record?id=${item.id}`)" style="cursor: pointer;">
                        <div v-show="item[column.key]!= item.warnStatus"
                            class="table-data-cell"
                            v-for="column,inde in leftArr.tableColumns1" :key="inde"
                            :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                        >{{ item[column.key]}}</div>
                        <div v-show="item[column.key]== item.warnStatus"
                            class="table-data-cell"
                            v-for="column,inde in leftArr.tableColumns1" :key="inde"
                            :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                        >{{ item[column.key]==0?'未处理':'已处理'}}</div>
                        </div>
              </div>
              <div v-else>
                <div style="width: 100%;margin-top:40px; text-align:center; font-size:20px;font-family:'TitleFont';color:#ccc;">暂无预警...</div>
              </div>
                </div>
            </div>
            <div class="content-main-item middle-main-wrapper">
                <div class="main-top">
                    <div class="main-top-warper main-top-1">
                        <div @click="$router.push('/basic/device/devicebase')" style="display:flex;flex-direction:column;cursor: pointer; align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.deviceTotal}}</div>
                            <div style="color:#c1c1c1;font-size:14px">设备数量</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-2">
                        <div @click="$router.push('/basic/device/devicebase?deviceStatus=online')" style="display:flex; cursor: pointer;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.online}}</div>
                            <div style="color:#c1c1c1;font-size:14px">在线设备</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-3">
                        <div @click="$router.push('/basic/device/devicebase?deviceStatus=offline')" style="display:flex; cursor: pointer;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.offline}}</div>
                            <div style="color:#c1c1c1;font-size:14px">离线设备</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-4">
                        <div @click="$router.push('/basic/device/devicebase?deviceStatus=fault')" style="display:flex; cursor: pointer;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.fault}}</div>
                            <div style="color:#c1c1c1;font-size:14px">故障设备</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-5">
                        <div @click="$router.push('/warning/warning-record?warnStatus=0')" style="display:flex; cursor: pointer;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.warn}}</div>
                            <div style="color:#c1c1c1;font-size:14px">预警信息</div>
                        </div>
                    </div>
                </div>
                <div class="middle-main-item">
                      <div class='sxt' v-for="item,index in webcam" :key="index" @click="webcamCli(index)" :style="{left:item.latitude>100?item.latitude/10+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}">
                         <div v-show="webcamIndex==index" class="message">
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
                        <div v-show="sensorIndex==index" class="message">
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
                        <div v-show="warnIndex==index" class="message" ref="alarm">
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
                    <div class="box-title3">柑橘生产数据分析</div>
                    <div class="middle-footer-item">
                        <div id="chart4"></div>
                    </div>
                </div>
                <div class="middle-sxt">
                    <div style="display:flex;align-items:center;">
                        <div :class="['middle-icon','middle-sxt-1']"></div>
                        <div style="font-size:14px">摄像头</div>
                    </div>
                    <div style="display:flex;align-items:center;">
                        <div :class="['middle-icon','middle-sxt-2']"></div>
                        <div style="font-size:14px">传感器</div>
                    </div>
                    <div style="display:flex;align-items:center;">
                        <div :class="['middle-icon','middle-sxt-3']"></div>
                        <div style="font-size:14px">预警信息</div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="right1">
                    <div class="box-title">产业数据</div>
                    <div class="right1-item">
                        <div :class="['right1-warper','right1Item-1']">
                            <div style="margin-top:80px;">
                                <div style="text-align:center;color:#8bc4db;font-size:20px;margin-bottom: 10px;">2</div>
                                <div style="text-align:center;color:#8bc4db;font-size:13px">产线条数</div>
                            </div>
                        </div>
                        <div :class="['right1-warper','right1Item-2']">
                             <div style="margin-top:80px;cursor: pointer;" @click="$router.push('/basic/device/devicebase?kinds=produc')">
                                <div style="text-align:center;color:#8bc4db;font-size:20px;margin-bottom: 10px;">{{Industry.deviceNum}}</div>
                                <div style="text-align:center;color:#8bc4db;font-size:13px;">产线设备</div>
                            </div>
                        </div>
                        <div :class="['right1-warper','right1Item-3']">
                             <div style="margin-top:80px;cursor: pointer;"  @click="$router.push('/basic/device/device-data?deviceType=produc_storage')">
                                <div style="text-align:center;color:#8bc4db;font-size:20px;margin-bottom: 10px;">{{Industry.yield}}</div>
                                <div style="text-align:center;color:#8bc4db;font-size:13px">柑橘总量(万斤)</div>
                            </div>
                        </div>
                        <div :class="['right1-warper','right1Item-4']">
                             <div style="margin-top:80px;cursor: pointer;"  @click="$router.push('/erp/sale/order')">
                                <div style="text-align:center;color:#8bc4db;font-size:20px;margin-bottom: 10px;">{{Industry.price}}</div>
                                <div style="text-align:center;color:#8bc4db; font-size:13px">销售总额(万元)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right2">
                    <div class="box-title2">销售分析</div>
                    <div class="right2-item">
                        <div id="chart2"></div>
                    </div>
                </div>
                <div class="right3">
                    <div class="box-title">鲁渝有礼</div>
                    <div class="right3-item">
                        <div class="right3-top">
                            <div class="right3-top-item" style="cursor: pointer;" @click="$router.push('/basic/product/product')">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">{{lyObj.productKind}}</div>
                                <div style="text-align:center;color:#8bb2b6;font-size:14px;">特色产品</div>
                            </div>
                            <div class="right3-top-item">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">{{lyObj.brandKind}}</div>
                                <div style="text-align:center;color:#8bb2b6;font-size:14px;">品牌认证</div>
                            </div>
                            <div class="right3-top-item" style="cursor: pointer;" @click="$router.push('/erp/purchase/supplier')">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">{{lyObj.supplier}}</div>
                                <div style="text-align:center;color:#8bb2b6;font-size:14px;">注册商户</div>
                            </div>
                            <div class="right3-top-item" style="cursor: pointer;" @click="$router.push('/basic/identification/qrCode')">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">{{lyObj.productCode}}</div>
                                <div style="text-align:center;color:#8bb2b6;font-size:14px;">产品赋码</div>
                            </div>
                        </div>
                        <div class="right3-warper">
                            <div class="right3-warper-left"></div>
                            <div  class="right3-warper-right">“鲁渝有礼”IP账号已开设公共小程序、抖音电商平台，自目前线上已直播12次，上架货物18个品类、销售额达22.3万元。</div>
                        </div>
                    </div>
                </div>
                <div class="right4">
                    <div class="box-title">柑橘产量/销售趋势分析</div>
                    <div class="right4-item">
                        <div id="chart3"></div>
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
  deviceStatistics,
  ParkBaseInfo,
  ParkBaseInfo2,
  IoTLatestData,
  cropBase,
  PlantInfo,
  PlantArea,
  DeviceAndWarn,
  ProductionData,
  WarnInfo,
  YearSaleData,
  MonthSaleData,
  LuYu,
  IndustryData
  
} from '@/api/kaizhou/bigscreen/index'
import * as echarts from "echarts"
import {ref,reactive,onMounted} from 'vue'
import { object } from 'vue-types';
import { resetSize } from '@/components/Verifition/src/utils/util';

//种植资源面积
const initChart1=async ()=> {
  let res= await PlantArea()
  let data=[]
  res.forEach( item => {
    data.push({
      name:item.plant,
      value:item.area
    })    
  });  
      initChartStatic(
        "chart1",
        generatePieOptions({
          legend: {
            show: true,
            top: "bottom",
            left: "right",
            bottom:'0',
            orient:'horizontal',
            itemWidth: 12,
            itemHeight: 12,
          },
          color: ["#00b4ff", "#00f496", "#3b72ad", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: data,
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
const initChart2= async ()=>{
  let res =await YearSaleData()
  let bar1=[res.yields[0],res.sales[0]];
  let bar2=[res.yields[1],res.sales[1]]
 
      initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data: [ "产量(万斤)", "销售额(万元)"],
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
          color: ["#30c3ef","#36e1d9"],
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
              name: res.years[0],
              data: bar1,
              type: "bar",
              barWidth: "20",
              smooth: false,
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
            },
            {
              name: res.years[1],
              data: bar2,
              type: "bar",
              barWidth: "20",
              smooth: false,
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#eee",
                  fontSize: 10,
                },
              },
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
const initChart3=async ()=>{
  let res = await MonthSaleData()  
      initChartStatic(
        "chart3",
        generateBaseOptions({
          xAxis: {
            data: res.Months.reverse(),
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
            axisLabel: {
            interval:0,
            }
          },
          legend: { 
            show: false, 
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
          color: ["#30c3ef","#36e1d9"],
          yAxis:[ {
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
            type: "value",
            min:0,
            max:Math.max(...res.sales)
          }
        ],
          series: [
            {
              name: "柑橘产量",
              data: res.yields,
              type: "bar",
              barWidth: "20",
              smooth: false,
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#eee",
                  fontSize: 10,
                },
              },
            },
            {
              name: "柑橘销售趋势",
              data: res.sales,
              type: "line",
              yAxisIndex:1,
              smooth: false,
            },
          ],
          grid: {
            left: "19%",
            right: "20%",
            top: "10%",
            bottom: "15%",
          },
        })
      );
    
}
//柑橘数据分析
const initChart4= async ()=>{
  let res= await ProductionData()
    initChartStatic(
        "chart4",
        generateBaseOptions({
          xAxis: {
            data:res.dates,
            interval:0,
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
          color: ["#0678b7","#a39e43",'#117f89','#186a40'],
          yAxis:{
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
              name: "采摘柑橘",
              data: res.pick,
              type: "bar",
              barWidth: "20",
              smooth: false,
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#eee",
                  fontSize: 10,
                },
              },
            },
            {
              name: "洗选过程",
              data: res.wash,
              type: "bar",
              barWidth: "20",
              smooth: false,
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#eee",
                  fontSize: 10,
                },
              },
            },
            {
              name: "盛具标识",
              data: res.markers,
              type: "bar",
              barWidth: "20",
              smooth: false,
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#eee",
                  fontSize: 10,
                },
              },
            },
            {
              name: "仓库库存",
              data: res.stash,
              type: "bar",
              barWidth: "20",
              smooth: false,
              label: {
                position: "top", //在上方显示
                show: true, //开启显示
                textStyle: {
                  //数值样式
                  color: "#eee",
                  fontSize: 10,
                },
              },
            },
            
          ],
          grid: {
            left: "5%",
            right: "3%",
            top: "17%",
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
})
let device=ref<object>({})
//中间-设备数量统计
const getDeviceStatistics=()=>{
  deviceStatistics().then(res=>{
    device.value=res
  })
}
getDeviceStatistics()
// 选择园区
let select=ref<any>([])
let selectId=ref<any>('')
let select2Id=ref<any>('')
let select2=ref<any>([])
//园区
const getParkBaseInfo=async (params)=>{
  let res= await ParkBaseInfo(params)  
  select.value=res
  getParkBaseInfo2({parentId:select.value[0].id})
}
getParkBaseInfo({parentId:'0'})
//地块
const getParkBaseInfo2=async (params)=>{
  let res= await ParkBaseInfo2(params)
  select2.value=res
  getIoTLatestData({plotId:res[0].id})
}
const selectCli1=(val:any)=>{
  getParkBaseInfo2({parentId:val.target.value})
}
// 物联设备数据 设备数据
let IoTLates=ref<object>({})
const getIoTLatestData=(params)=>{
  IoTLatestData(params).then(res=>{
      IoTLates.value=res
  })
}

const selectCli2=(val:any)=>{
  if(typeof(val)=='string'){
    getIoTLatestData({plotId:selectId.value})
  }else{
    getIoTLatestData({plotId:val.target.value}) 
  }
}
selectCli2(selectId.value)
//产品介绍
const cropList=ref<any>([])
const getCropBase=()=>{
  cropBase({pageNo:"1",pageSize:"10"}).then(res=>{
    cropList.value=res.list
    
  })
}
getCropBase()
//种植资源
let plantInfo=ref<any>({})
const  getPlantInfo=()=>{
  PlantInfo().then(res=>{
    plantInfo.value=res
  })
}
getPlantInfo()
//地图预警信息
let webcam=ref<any>([])
let webcamIndex=ref<any>('-1')
let sensor=ref<any>([])
 let sensorIndex=ref<any>('-1')
let warn=ref<any>([])
let warnIndex=ref<any>('-1')
const getDeviceAndWarn=()=>{
  DeviceAndWarn().then(res=>{
    let i=7
    let i2=6
    let a= res.webcam
    let b= res.sensor    
    let c= res.warn
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
    c.forEach((item,index)=>{
      if(typeof(item.latitude)!='string') return c.splice(index, 1)
      else  item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    webcam.value=a
    sensor.value=b
    warn.value=c
  })
}
getDeviceAndWarn()
const webcamCli=(val:any)=>{
  if(webcamIndex.value==val) webcamIndex.value=-1
  else  webcamIndex.value=val
}
const sensorCli=(val:any)=>{
  if(sensorIndex.value==val) sensorIndex.value=-1
  else  sensorIndex.value=val
}
const warnCli=(val:any)=>{
  if(warnIndex.value==val) warnIndex.value=-1
  else  warnIndex.value=val
}
//预警信息
let leftArr=reactive<Object>({
    tableColumns1: [
        {
          key: 'warnInfo',
          label: '预警信息',
          width: '50%',
        },
        {
          key: 'warnTime',
          label: '报警时间',
          width: '40%',
        },
        {
          key: 'warnStatus',
          label: '状态',
          width: '10%',
        },
      ],
      tableData1: [
        {
          name: '1号茶园D3地块土堰湿度偏低,当前...',
          time: '2024-2-1 13:12:31',
          status: '未处理'
        },
        {
          name: '1号茶园D3地块土堰湿度偏低,当前...',
          time: '2024-2-1 13:12:31',
          status: '未处理'
        },
        {
          name: '1号茶园D3地块土堰湿度偏低,当前...',
          time: '2024-2-1 13:12:31',
          status: '未处理'
        },
      ],
})
const getWarnInfo=async ()=>{
  let res= await WarnInfo()
  leftArr.tableData1=res
}
getWarnInfo()
//鲁渝有礼
let lyObj=ref<any>({})
const getLuYu=async ()=>{
  let res= await LuYu()
  lyObj.value=res
}
getLuYu()
//产业数据
let Industry=ref<any>({})
const getIndustryData=async ()=>{
  let res = await IndustryData()
  Industry.value=res
}
getIndustryData()
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
    text-indent: 4.5rem;
    font-size: 1.3rem;
    font-family: "TitleFont";
    background-size: 100% 100%;
    background-image: url("./assets/titleBg.png");
}
.box-title2{
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    text-indent: 2rem;
    font-size: 1.3rem;
    font-family: "TitleFont";
    background-size: 100% 100%;
    background-image: url("./assets/box-title2.png");
}
.box-title3{
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    text-indent: 4rem;
    font-size: 1.3rem;
    font-family: "TitleFont";
    background-size: 100% 100%;
    background-image: url("./assets/box-title3.png");
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
    grid-template-rows:24% 24% 24% calc(28% - 30px);
    grid-auto-columns: 100%;
    gap: 10px;
    .left1{
        width: 100%;
        height:100%;
        .left1-item{
            box-sizing: border-box;
            width: 100%;
            margin-top: 10px;
            padding: 10px 20px ;
            height: calc(100% - 3rem);
            background-size: 100% 100%;
            background-image: url('./assets/leftItemBg.png');
            
        }
    }
    .left2{
        width: 100%;
        height: 100%;
        .left2-item{
            width: 100%;
            height: calc(100% - 2rem);
            display: flex;
            box-sizing: border-box;
            padding: 10px 15px;
            align-items: center;
            justify-content: space-between;
            .left-warper{
                width: 49%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                .left2-icon{
                    width: 2rem;
                    height: 2rem;
                    background-size: 100% 100%;
                }
            }
            .left-warper2{
                width: 49%;
                height: 100%;
                #chart1{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .left3{
        width: 100% ;
        height: 100%;
        position: relative;
        .left3-select{
          display: flex;
          z-index: 99999;
          position: absolute;
          right:2%;
          top:3%;
          .select1{
            padding: 5px;
            box-sizing: border-box;
            background: none;
            color:#fff;
            background-size: 100% 100%;
            border: none;
            background-image: url('./assets/select1.png') ;
            option{
              color:#000;
            }
          }
          .select2{
            padding: 5px;
            box-sizing: border-box;
            background: none;
            color:#fff;
            border: none;
            background-size: 100% 100%;
            background-image: url('./assets/select2.png') ;
            option{
              color:#000;
            }
          }
          
            

        }
        .left3-item{
            padding: 10px 15px;
            width: 100%;
            height: calc(100% - 3rem);
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .left3-warper{
                width: 20%;
                height: 50%;
                background-size: 100% 100%;
                background-image: url("./assets/left3-ItemBg.png");
            }
        }
    }
    .left4{
        width: 100%;
        height: 100%;
        .table-wrapper {
            width: 100%;
            height: calc(100% - 3rem);
            position: relative;
            overflow: auto;
            font-size: .9rem;
            .table-header-row {
                width: 100%;
                padding: 8px 0;
                display: flex;
                align-items: center;
                position: sticky;
                top: 0;
                background-color: #01121c;
                .table-header-cell {
                color: #6C9BFF;
                text-align: center;
                }
            }
            .table-data-row {
                margin-top: 10px;
                width: 100%;
                height: 18%;
                background-size: 100% 100%;
                background-image: url('./assets/left4ItemBg.png');
                display: flex;
                align-items: center;
                padding: 8px 0;
                .table-data-cell {
                text-align: center;
                }
            }
    }
        .table-wrapper::-webkit-scrollbar {
        width: 0px;
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
      .main-top-warper{
        width: 18%;
        height: 100%;
        background-size: 100% 100%;
      }
      
    }
    .middle-main-item{
      position: absolute;
      width: 1400px;
      height: 900px;
      left: calc(50% - 700px);
      top: calc(50% - 450px);
      background-size: 100% 100%;
      background-image: url(./assets/mainBg.png);
      position: relative;
      
      .sxt{
        position: absolute;
        cursor: pointer;
        width: 3.5rem;
        height: 5rem;
        background-size: 100% 100%;
        background-image: url('./assets/sxt.png');
        position: relative;
        .message{
          position: absolute;
          padding: 10px 15px 15px;
          box-sizing: border-box;
          z-index: 9999;
          left:-50px;
          top: -150px;
          background-size: 100% 100%;
          background-image:url('./assets/middleBg.png');
          .message-item{
            width: 105%;
            margin-bottom: 10px;
            padding: 10px 15px;
            margin-top: -10px;
            margin-left: -25px;
            background-size: 100% 100%;
            background-image:url('./assets/middle-top.png');
          }
          .messageJk{
              margin: 15px 0 ;
              padding: 5px ;
              text-align: center;
              background-size: 100% 100%;
              background-image: url('./assets/messageJk.png');
            }
        }
      }
      .cgq{
        position: absolute;
        width: 3rem;
        cursor: pointer;
        height: 5rem;
        background-size: 100% 100%;
        background-image: url('./assets/cgq.png');
        .message{
          position: absolute;
          padding: 10px 15px 15px;
          box-sizing: border-box;
          z-index: 9999;
          left:-50px;
          top: -130px;
          background-size: 100% 100%;
          background-image:url('./assets/middleBg.png');
          .message-item{
            width: 105%;
            margin-bottom: 10px;
            padding: 10px 15px;
            margin-top: -10px;
            margin-left: -25px;
            background-size: 100% 100%;
            background-image:url('./assets/middle-top.png');
          }
          .messageJk{
              margin: 15px 0 ;
              padding: 5px ;
              text-align: center;
              background-size: 100% 100%;
              background-image: url('./assets/messageJk.png');
            }
        }
      }
      .alarm{
        cursor: pointer;
        position: absolute;
        width: 3rem;
        height: 6rem;
        background-size: 100% 100%;
        background-image: url('./assets/alarm.png');
        .message{
          position: absolute;
          padding: 10px 15px 15px;
          box-sizing: border-box;
          z-index: 9999;
          left:-50px;
          top: -150px;
          background-size: 100% 100%;
          background-image:url('./assets/middleBg.png');
          .message-item{
            width: 105%;
            margin-bottom: 10px;
            padding: 10px 15px;
            margin-top: -10px;
            margin-left: -25px;
            background-size: 100% 100%;
            background-image:url('./assets/middle-top.png');
          }
          .messageJk{
              margin: 15px 0 ;
              padding: 5px ;
              text-align: center;
              background-size: 100% 100%;
              background-image: url('./assets/messageJk.png');
            }
        }
      }
       
    }
    .middle-main-footer{
        position: absolute;
        bottom: 2%;
        width: 97%;
        height: 20%;
        .middle-footer-item{
            width: 100%;
            height: calc(100% - 2rem);
            #chart4{
                width: 100%;
                height: 100%;
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
    grid-template-rows:24% 24% 24% calc(28% - 45px);
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
            display: flex;
            justify-content: space-between;
            .right1-warper{
                width: 23%;
                height: 100%;
                background-size: 100% 100%;
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
            box-sizing: border-box;
            width: 100%;
            height: calc(100% - 2rem);
            padding: 10px;
            .right3-top{
                width: 100%;
                height: 48%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .right3-top-item{
                    width: 23%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    height: 100%;
                    background-size: 100% 100%;
                    background-image: url('./assets/right3-top.png');
                }
            }
            .right3-warper{
                padding: 10px;
                box-sizing: border-box;
                width: 100%;
                margin-top: 15px;
                display: flex;
                justify-content:space-between;
                height: 50%;
                background-size: 100% 100%;
                background-image: url('./assets/long.png');
                .right3-warper-left{
                    width: 15%;
                    height: 100%;
                    background-size: 100% 100%;
                    background-image: url('./assets/trumpet.png');
                }
                .right3-warper-right{
                    width: 84%;
                    height: 100%;
                    font-size: 13px;
                    color: #c1c1c1;
                }
            }
        }
    }
    .right4{
        width: 100%;
        height: 100%;
        .right4-item{
            width: 100%;
            height: calc(100% - 2rem);
            #chart3{
                width: 100%;
                height: 100%;
            }
        }
    }
  }
}

@for $i from 1 through 4 {
  .left2-#{$i} {
    background-image: url(./assets/left2Warper#{$i}.png);
  }
}
@for $i from 1 through 4 {
  .right1Item-#{$i} {
    background-image: url(./assets/right1Item#{$i}.png);
  }
}
@for $i from 1 through 5 {
  .main-top-#{$i} {
    background-size: 100% 100%;
    background-image: url(./assets/main-top#{$i}.png);
  }
}
@for $i from 1 through 3 {
  .middle-sxt-#{$i} {
    background-size: 100% 100%;
    background-image: url(./assets/sxt#{$i}.png);
  }
}

</style>