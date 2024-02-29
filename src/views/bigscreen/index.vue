<template>
    <div class="bigscreen-wrappper bigscreen-main-wrapper">
        <div class="header-main-wrapper">
            <div class="header-left-part-wrapper">
                <!-- <BigScreenTime /> -->
            </div>
            <div class="header-title-wrapper">鲁渝协作乡村振兴示范村</div>
            <div class="header-right-part-wrapper"></div>
        </div>
        <div class="content-main-wrapper">
            <div class="left">
                <div class="left1">
                    <div class="box-title">产品介绍</div>
                    <div class="left1-item">
                      <el-carousel :interval="3000" indicator-position='none' :autoplay='true' arrow="always" style="width: 100%;height: 100%;">
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
                                <div>
                                    <div style="font-size:12px;color:#c1c1c1;margin-bottom:15px">种植园区</div>
                                    <div style="font-size:16px;">{{plantInfo.parkNum}}</div>
                                </div>
                            </div>
                            <div style="width: 50%;height: 50%;display:flex;align-items:center;">
                                <div :class="['left2-icon','left2-2']"></div>
                                <div>
                                    <div style="font-size:12px;color:#c1c1c1;margin-bottom:15px">种植地块</div>
                                    <div style="font-size:16px;">{{plantInfo.plotNum}}</div>
                                </div>
                            </div>
                            <div style="width: 50%;height: 50%;display:flex;align-items:center;">
                                <div :class="['left2-icon','left2-3']"></div>
                                <div>
                                    <div style="font-size:12px;color:#c1c1c1;margin-bottom:15px">作物品种</div>
                                    <div style="font-size:16px;">{{plantInfo.cropNum}}</div>
                                </div>
                            </div>
                            <div style="width: 50%;height: 50%;display:flex;align-items:center;">
                                <div :class="['left2-icon','left2-4']"></div>
                                <div>
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
                    <div class="box-title">物联设备数据</div>
                    <div class="left3-select">
                      <select name="" id="123" class="select1">
                        <option value="123">1号茶园</option>
                        <option value="123">2号茶园</option>
                      </select>
                      <select name="" id="456" class="select2">
                        <option value="123">D3地块</option>
                        <option value="123">D4地块</option>
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
                    <div class="box-title">预警信息</div>
                    <div class="table-wrapper">
                        <div class="table-header-row">
                        <div
                            class="table-header-cell"
                            v-for="column,index in leftArr.tableColumns1"
                            :style="`width: ${column.width};`" :key="index"
                        >{{ column.label }}</div>
                        </div>
                        <div class="table-data-row" v-for="item,index in leftArr.tableData1" :key="index">
                        <div
                            class="table-data-cell"
                            v-for="column,inde in leftArr.tableColumns1" :key="inde"
                            :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                        >{{ item[column.key] }}</div>
                        </div>
              </div>
                </div>
            </div>
            <div class="content-main-item middle-main-wrapper">
                <div class="main-top">
                    <div class="main-top-warper main-top-1">
                        <div style="display:flex;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.deviceTotal}}</div>
                            <div style="color:#c1c1c1;font-size:14px">设备数量</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-2">
                        <div style="display:flex;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.online}}</div>
                            <div style="color:#c1c1c1;font-size:14px">在线设备</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-3">
                        <div style="display:flex;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.offline}}</div>
                            <div style="color:#c1c1c1;font-size:14px">离线设备</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-4">
                        <div style="display:flex;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.fault}}</div>
                            <div style="color:#c1c1c1;font-size:14px">故障设备</div>
                        </div>
                    </div>
                    <div class="main-top-warper main-top-5">
                        <div style="display:flex;flex-direction:column;align-items:center;width: 100%;height: 100%;justify-content:center;margin-left:20px;">
                            <div style="color:#63ccd2;font-size:25px;margin-left:-20px">{{device.warn}}</div>
                            <div style="color:#c1c1c1;font-size:14px">预警信息</div>
                        </div>
                    </div>
                </div>
                <div class="middle-main-item">
                      <div class='sxt' v-for="item,index in webcam" :key="index" @click="webcamCli(index)" :style="{left:item.latitude>100?item.latitude/10+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}">
                         <div v-show="webcamIndex==index" class="message">
                            <div class="message-item"></div>
                         </div>
                      </div>
                      <div class='cgq' v-for="item,index in sensor" :key="index" :style="{left:item.latitude>100?item.latitude/15+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}"></div>
                      <div class='alarm' v-for="item,index in warn" :key="index" :style="{left:item.latitude>100?item.latitude/13+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}"></div> 
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
                             <div style="margin-top:80px;">
                                <div style="text-align:center;color:#8bc4db;font-size:20px;margin-bottom: 10px;">12</div>
                                <div style="text-align:center;color:#8bc4db;font-size:13px;">产线设备</div>
                            </div>
                        </div>
                        <div :class="['right1-warper','right1Item-3']">
                             <div style="margin-top:80px;">
                                <div style="text-align:center;color:#8bc4db;font-size:20px;margin-bottom: 10px;">1867</div>
                                <div style="text-align:center;color:#8bc4db;font-size:13px">柑橘总量(万斤)</div>
                            </div>
                        </div>
                        <div :class="['right1-warper','right1Item-4']">
                             <div style="margin-top:80px;">
                                <div style="text-align:center;color:#8bc4db;font-size:20px;margin-bottom: 10px;">32.6</div>
                                <div style="text-align:center;color:#8bc4db; font-size:13px">销售总额(亿)</div>
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
                            <div class="right3-top-item">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">5</div>
                                <div style="text-align:center;color:#8bb2b6;font-size:14px;">特色产品</div>
                            </div>
                            <div class="right3-top-item">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">32</div>
                                <div style="text-align:center;color:#8bb2b6;font-size:14px;">品牌认证</div>
                            </div>
                            <div class="right3-top-item">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">89</div>
                                <div style="text-align:center;color:#8bb2b6;font-size:14px;">注册商户</div>
                            </div>
                            <div class="right3-top-item">
                                <div style="text-align:center;color:#8bb2b6;font-size:20px;">4784</div>
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
  IoTLatestData,
  cropBase,
  PlantInfo,
  PlantArea,
  DeviceAndWarn
  
} from '@/api/bigscreen/index'
import * as echarts from "echarts"
import {ref,reactive,onMounted} from 'vue'
let leftArr=reactive<Object>({
    tableColumns1: [
        {
          key: 'name',
          label: '预警信息',
          width: '50%',
        },
        {
          key: 'time',
          label: '报警时间',
          width: '40%',
        },
        {
          key: 'status',
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
const initChart2=()=>{
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
              name: "2022",
              data: [36,140,],
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
              name: "2023",
              data: [48,154,],
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
            left: "10%",
            right: "4%",
            top: "15%",
            bottom: "15%",
          },
        })
      );
    
}
const initChart3=()=>{
      initChartStatic(
        "chart3",
        generateBaseOptions({
          xAxis: {
            data: [ "2023-9",'2023-10','2023-11','2023-12','2024-1','2024-2'],
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
            max:100000
          }
        ],
          series: [
            {
              name: "2022",
              data: [8709,10923,8821,15321,13289,20231],
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
              name: "2023",
              data: [8709,10923,8821,15321,13289,20231],
              type: "line",
              smooth: false,
            },
          ],
          grid: {
            left: "13%",
            right: "13%",
            top: "10%",
            bottom: "15%",
          },
        })
      );
    
}
const initChart4=()=>{
    initChartStatic(
        "chart4",
        generateBaseOptions({
          xAxis: {
            data: ['2024/2/24','2024/2/25','2024/2/26','2024/2/27','2024/2/28'],
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
              data: [35,29,38,31,41,39],
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
              data: [29,34,27,30,39,43],
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
              data: [32,47,32,41,35,38],
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
              data: [85,75,69,77,83,88],
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
const getParkBaseInfo=()=>{
  ParkBaseInfo().then(res=>{
    console.log(res,'选择园区');
  })
}
getParkBaseInfo()
// 物联设备数据 设备数据
let IoTLates=ref<object>({})
const getIoTLatestData=()=>{
  IoTLatestData().then(res=>{
      IoTLates.value=res
  })
}
getIoTLatestData()
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
    a.forEach(item=>{
      item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    b.forEach(item=>{
      item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    c.forEach(item=>{
      item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    console.log(a,b,b,'修改');
    
    webcam.value=a
    sensor.value=b
    warn.value=c
  })
}
getDeviceAndWarn()
const webcamCli=(val:any)=>{
  webcamIndex.value=val
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
          z-index: 9999;
          right: -200px;
          top: -180px;
          width: 200px;
          height: 200px;
          background-size: 100% 100%;
          background-image:url('./assets/middleBg.png');
          .message-item{
            width: 150%;
            height: 50px;
            background-size: 100% 100%;
            background-image:url('./assets/middle-top.png');
          }
        }
      }
      .cgq{
        position: absolute;
        width: 3rem;
        height: 5rem;
        background-size: 100% 100%;
        background-image: url('./assets/cgq.png');
      }
      .alarm{
        position: absolute;
        width: 3rem;
        height: 6rem;
        background-size: 100% 100%;
        background-image: url('./assets/alarm.png');
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