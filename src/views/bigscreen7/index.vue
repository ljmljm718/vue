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
              <div :class="mainIndex==1?'active':'actived'" @click="$router.push('/bigscreen5')">农业一张图</div>
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
               <div class="right1-warper" v-for="item,index in warnInfo" :key='index'>
                <div class="right1-left"><div class="tranig"></div>{{item.warnType}}</div>
                <div class='right1-right'>
                  <div>{{item.warnInfo}}</div>
                  <div style="margin-top:10px;">{{new Date().toLocaleString(item.warnTime)}}</div>
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
              <select id="" name="" @change='selectCli1' class='select-left'>
                <option v-for="item,index in selecte1" :key="index" :value="item.id">{{item.name}}</option>
              </select>
              <select id="" name=""  @change='selectCli2'  class='select-right'>
                <option v-for="item,index in selecte2" :key="index" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div class='left-soil'>
              <div :class='soilIndex==1?"active":"actived"' @click='soilCli("14,15",1)'>气象监测</div>
              <div :class='soilIndex==2?"active":"actived"' @click='soilCli("14,16",2)'>土壤墒情</div>
              <div :class='soilIndex==3?"active":"actived"' @click='soilCli("14,18",3)'>棚内环境</div>
              <div :class='soilIndex==4?"active":"actived"' @click='soilCli("14,17",4)'>虫情监测</div>
            </div>
            <div class='footer-chart'>
              <div class='footer-item'>
                <div :class='["foot-top","footTop-1"]'>
                    <div style='margin-left:30px;'>空气温度</div>
                    <div style='font-size:25px;margin-left:-100px;'>{{footTop.temperature}}<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart3'></div>
              </div>
              <div class='footer-item'>
                <div  :class='["foot-top","footTop-2"]'>
                    <div style='margin-left:30px;'>空气湿度</div>
                    <div style='font-size:25px;margin-left:-100px;'>{{footTop.humidity}}<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart4'></div>
              </div>
              <div class='footer-item'>
                <div :class='["foot-top","footTop-3"]'>
                    <div style='margin-left:30px;'>降雨量</div>
                    <div style='font-size:25px;margin-left:-100px;'>{{footTop.rainfall}}<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart5'></div>
              </div>
              <div class='footer-item'>
                <div :class='["foot-top","footTop-4"]'>
                    <div style='margin-left:30px;'>光照强度</div>
                    <div style='font-size:25px;margin-left:-100px;'>{{footTop.lighting}}<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart6'></div>
              </div>
              <div class='footer-item'>
                <div :class='["foot-top","footTop-5"]'>
                    <div style='margin-left:30px;'>风速</div>
                    <div style='font-size:25px;margin-left:-100px;'>{{footTop.windSpeed}}<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart7'></div>
              </div>
              <div class='footer-item'>
                <div :class='["foot-top","footTop-6"]'>
                    <div style='margin-left:30px;'>大气压力</div>
                    <div style='font-size:25px;margin-left:-100px;'>{{footTop.airPressure}}<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart8'></div>
              </div>
              <div class='footer-item' v-if="soilIndex==3">
                <div :class='["foot-top","footTop-7"]'>
                    <div style='margin-left:30px;'>二氧化碳</div>
                    <div style='font-size:25px;margin-left:-100px;'>{{footTop.co2Density}}<span style='font-size:12px;'>℃</span></div>
                </div>
                <div id='chart9'></div>
              </div>
            </div>
          </div>
          <div class='footer-right'>
            <div class='box-title' style='position:relative; text-indent: 7rem;'>监控设备
              <div class='select' style="position:absolute;right:20px;top:0;">
              <select id="" name="" class='select-left' @change="selectCli3" >
                <option  v-for="item,index in selecte3" :key="index" :value="item.id">{{item.name}}</option>
              </select>
              <select id="" name=""  class='select-right'  @change="selectCli4">
                <option  v-for="item,index in selecte4" :key="index" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            </div>
            <div class='footer-item2'>
              <div class=foot-warper v-for='item,index in ParkList' :key='index'>
                <div class='foot-top2'>
                  <img :src="item.imgId" alt="" style="width:100%;height:100%;"/>
                </div>
                <div class='foot-cont2'>
                  <div class='foot-img'></div>
                  <div style='margin-left:-20px;'>位置:<span>{{ item.location }}</span></div>
                </div>
                <div class='foot-cont2' style='margin-top:-20px;'>
                  <div class='foot-img'></div>
                  <div v-show="item.deviceStatus=='online'" style='margin-left:-20px;'>状态:<span class='online'>在线</span></div>
                  <div v-show="item.deviceStatus=='offline'" style='margin-left:-20px;'>状态:<span class='offline'>离线</span></div>
                  <div v-show="item.deviceStatus=='fault'" style='margin-left:-20px;'>状态:<span class='fault'>故障</span></div>
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
  environmentData,
  warningRecordInfo,
  ParkBaseInfo,
  environmentView,
  monitorDeviceByPark
} from '@/api/bigscreen7/index'
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
//获取基地
let selecte1 =ref<any>([])
let selecte2 =ref<any>([])
let selecte3 =ref<any>([])
let selecte4 =ref<any>([])
let selecte1Id =ref<any>('')
let select2Id=ref<any>('')
  let selecte3Id=ref(0)
  let selecte4Id=ref(0)
  let soilId=ref<any>('14,15')
//获取基地
const getParkBaseInfo=()=>{
  ParkBaseInfo({parentId:'0'}).then(res=>{
    console.log(res,'获取基地');
    selecte1.value=res
    selecte1Id.value=res[0].id
    getParkBase({parentId:res[0].id})
  })
}
getParkBaseInfo()
const getParkBaseInfo2=()=>{
  ParkBaseInfo({parentId:'0'}).then(res=>{
    console.log(res,'获取基地2');
    selecte3.value=res
    selecte3Id.value=res[0].id
    getParkBase2({parentId:res[0].id})
  })
}
getParkBaseInfo2()
//获取棚区
const getParkBase=(val)=>{
  ParkBaseInfo(val).then(res=>{
    console.log(res,'棚区');
    selecte2.value=res
    select2Id.value=res[0].id
  })
}
//获取棚区
const getParkBase2=(val)=>{
  ParkBaseInfo(val).then(res=>{
    console.log(res,'棚区2');
    selecte4.value=res
    selecte4Id.value=res[0].id
    getMonitorDeviceByPark({belongPark:selecte3Id.value,belongPlot:res[0].id})

  })
}
//气象点击
const soilCli=(val:any,index:any)=>{
  soilId.value=val
  soilIndex.value=index
  getEnvironmentData()
  getEnvironmentView()
}

//筛选基地
const selectCli1=(val:any)=>{
  console.log(val,'val')
  selecte1Id.value=val.target.value
  getParkBase({parentId:val.target.value})
}
//筛选设备
const selectCli2=(val:any)=>{
  select2Id.value=val.target.value
}


//环境数据顶部
let footTop=ref<any>({})
let footChart=ref<any>({})
let getEnvironmentData=()=>{
  environmentData({deviceType:soilId.value,belongPark:selecte1Id.value,belongPlot:select2Id.value}).then(res=>{
    console.log(res,'环境数据');
    footTop.value=res
  })
}
getEnvironmentData()
let getEnvironmentView=()=>{
  environmentView({deviceType:soilId.value,belongPark:selecte1Id.value,belongPlot:select2Id.value}).then(res=>{
    console.log(res,'环境数据');
    footChart.value=res
    setTimeout(()=>{
        initChart3()
        initChart4()
        initChart5()
        initChart6()
        initChart7()
        initChart8()
        initChart9()
    },200)
  })
}
getEnvironmentView()

const initChart3=  ()=>{
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= footChart.value.time
  let b= footChart.value.temperature
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
  
      initChartStatic(
        "chart3",
        generateBaseOptions({
          xAxis: {
            data: time,
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
              data: data,
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
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= footChart.value.time
  let b= footChart.value.humidity
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
      initChartStatic(
        "chart4",
        generateBaseOptions({
          xAxis: {
            data: time,
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
              data: data,
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
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= footChart.value.time
  let b= footChart.value.rainfall
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
      initChartStatic(
        "chart5",
        generateBaseOptions({
          xAxis: {
            data:time,
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
              data: data,
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
const initChart6=  ()=>{
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= footChart.value.time
  let b= footChart.value.lighting
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
      initChartStatic(
        "chart6",
        generateBaseOptions({
          xAxis: {
            data: time,
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
              data: data,
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
const initChart7=  ()=>{
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= footChart.value.time
  let b= footChart.value.windSpeed
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
      initChartStatic(
        "chart7",
        generateBaseOptions({
          xAxis: {
            data: time,
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
              data: data,
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
const initChart8=  ()=>{
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= footChart.value.time
  let b= footChart.value.airPressure
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
      initChartStatic(
        "chart8",
        generateBaseOptions({
          xAxis: {
            data: time,
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
              data: data,
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
const initChart9=  ()=>{
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= footChart.value.time
  let b= footChart.value.co2Density
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
      initChartStatic(
        "chart9",
        generateBaseOptions({
          xAxis: {
            data: time,
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
              data: data,
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
})
let mainIndex=ref(3)
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
//预警信息
let warnInfo=ref([])
const getWarningRecordInfo=()=>{
  warningRecordInfo().then(res=>{
    console.log(res,'预警信息');
    warnInfo.value=res
  })
}
getWarningRecordInfo()
//获取基地视频
let ParkList=ref<any>([])
const getMonitorDeviceByPark=(val)=>{
  monitorDeviceByPark(val).then(res=>{
    console.log(res,'获取基地视频');
    ParkList.value=res
  })
}
//筛选基地
const selectCli3=(val:any)=>{
  selecte3Id.value=val.target.value
  getParkBase2({parentId:val.target.value})
}
//筛选设备
const selectCli4=(val:any)=>{
  selecte4Id.value=val.target.value
  getMonitorDeviceByPark({belongPark:selecte3Id.value,belongPlot:selecte4Id.value})
}
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
            z-index: 9999;
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

        height:60%;
        color: #fff;
        margin-right:20px;
        background-size:100% 100%;
        background:none;
        background-image:url(./assets/select.png);
        option{
          color: #000;
        }
      }
      .select-right{
        padding:0 5px;
        height:60%;
        color:#fff;
        background-size:100% 100%;
        background:none;
        background-image:url(./assets/select.png);
        option{
          color: #000;
        }
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
      overflow-x: scroll;
      white-space: nowrap;
      .footer-item{
        display: inline-block;
        margin-right:15px;
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
          background-image:url(./assets/footerTop1.png);
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
        #chart6{
          width:100%;
          height:calc(100% - 50px);
        }
        #chart7{
          width:100%;
          height:calc(100% - 50px);
        }
        #chart8{
          width:100%;
          height:calc(100% - 50px);
        }
        #chart9{
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
        option{
          color:#000
        }
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
        option{
          color:#000
        }
      }
    }
    .footer-item2{
      width:100%;
      padding:10px!important;
      box-sizing:border-box;
      height:calc(100% - 2rem);
      display:flex;
      justify-content:space-between;
      flex-wrap:wrap;
      .foot-warper{
        width:23%;
        height:45%;
        .foot-top2{
          width:100%;
          height:65%;
          background-image:url(./assets/footRightBg.png);
          background-size:100% 100%;
        }
        .foot-cont2{
          width:100%;
          height:35%;
          color:#c1c1c1;
          display:flex;
          align-items:center;
          .foot-img{
            width:60px;
            height:60px;
            background-size:100% 100%;
            background-image:url(./assets/jg.png)
          }
          .online{
            color:green;
          }
          .offline{
            color:#c1c1c1;
          }
          .fault{
            color:red;
          }
        }
      }
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
@for $i from 1 through 7 {
.footTop-#{$i} {
  background-image: url(./assets/footerTop#{$i}.png);
}
}

</style>