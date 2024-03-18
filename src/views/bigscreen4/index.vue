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
          <div class="box-title">智能物联设备信息</div>
          <div class="left1-item">
            <div class="left1-warper">
              <div class="total" @click="$router.push('/basic/device/devicebase')" style="cursor: pointer;">
                <div style="margin-top:-80px;">设备总数</div>
                <div style="font-weight: 600;">{{ device.total }}</div>
              </div>
              <div class="left1-warper-num">
                <div class="warper-top" @click="$router.push(`/basic/device/devicebase?deviceStatus=online`)" style="cursor: pointer;"><span>在线数量</span><span>{{ device.online?.sum }}</span></div>
                <div class="warper-num">
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=online&deviceType=sensor_env')"  style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>环境监测</div>
                    <div>{{ device.online?.env }}</div>
                  </div>
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=online&deviceType=sensor_soil')"  style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>土壤墒情</div>
                    <div>{{ device.online?.soil }}</div>
                  </div>
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=online&deviceType=camera_env')"  style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>视频监控</div>
                    <div>{{ device.online?.video }}</div>
                  </div>
                </div>
              </div>
              <div class="left1-warper-num">
                <div class="warper-top" @click="$router.push('/basic/device/devicebase?deviceStatus=fault')" style="cursor: pointer;"><span>故障数量</span><span>{{ device.fault?.sum }}</span></div>
                <div class="warper-num">
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=fault&deviceType=sensor_env')" style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>环境监测</div>
                    <div>{{ device.fault?.env }}</div>
                  </div>
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=fault&deviceType=sensor_soil')" style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>土壤墒情</div>
                    <div>{{ device.fault?.soil }}</div>
                  </div>
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=fault&deviceType=camera_env')" style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>视频监控</div>
                    <div>{{ device.fault?.video }}</div>
                  </div>
                </div>
              </div>
              <div class="left1-warper-num">
                <div class="warper-top" @click="$router.push('/basic/device/devicebase?deviceStatus=offline')" style="cursor: pointer;"><span>离线数量</span><span>{{ device.offline?.sum }}</span></div>
                <div class="warper-num">
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=offline&deviceType=sensor_env')" style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>环境监测</div>
                    <div>{{ device.offline?.env }}</div>
                  </div>
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=offline&deviceType=sensor_soil')" style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>土壤墒情</div>
                    <div>{{ device.offline?.soil }}</div>
                  </div>
                  <div @click="$router.push('/basic/device/devicebase?deviceStatus=offline&deviceType=camera_env')" style="cursor: pointer; display: flex;justify-content: space-around;">
                    <div>视频监控</div>
                    <div>{{ device.offline?.video }}</div>
                  </div>
                </div>
              </div>
              <div class="xian"></div>
            </div>
          </div> 
        </div>
        <div class="left2">
            <div class="left2-warper" v-for="item,index in tistics" :key="index">
              <div class="left-top">
                <div class="top"  @click="$router.push(`/basic/device/devicebase?deviceType=${tisticsList2[index]}`)" style="cursor: pointer;">
                  <div class="bg"></div>
                  <span style="margin-left: -20px; "> {{ tisticsList[index] }}</span> 
                  <span>{{ item.total }}</span> 
                </div>
                <div style="color: #c1c1c1;font-size: 13px;">在线率 {{ item.onlineRate }}</div>
              </div>
              <div style="width: 70%;">
              <div style="display: flex;justify-content: space-between;align-items: center; width: 100%;margin-bottom: 10px; " v-for="itm,inde in item.detail" :key="inde">
                <div @click="$router.push(`/basic/device/devicebase?deviceName=${tisticsList2[index]}`)" style="display: flex;width: 49%;font-size: 12px; align-items: center;justify-content: space-between; color: #c1c1c1;cursor: pointer;">
                  <div>{{ itm.deviceName }}</div>
                  <div>{{ itm.sum }}</div>
                </div>
                <div @click="$router.push(`/basic/device/devicebase?deviceName=${tisticsList2[index]}&deviceStatus=online`)"  style="cursor: pointer; display: flex;width: 49%;font-size: 14px; align-items: center;justify-content: space-between; color: #c1c1c1;">
                  <div>在线数量</div>
                  <div>{{ itm.online }}</div>
                </div>
              </div>
            </div>
                <div class="xian"></div>
            </div>
            
            
        </div>
        <div class="left3">
            <div id="chart1"></div>
        </div>
      </div>
      <div class="main">
        <div class="middle-main-item">
          <div class='sxt' v-for="item,index in webcam" :key="index" @click="webcamCli(index)" :style="{left:item.latitude>100?item.latitude/10+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}">
                         <!-- <div :style="{visibility:webcamIndex==index?'visible':'hidden',top:-sxtHeight+'px',left:'-50px'}" ref="sxtList" class="message">
                            <div class="message-item">
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.deviceCode}}</div>
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.parkName}}-{{item.plotName}}</div>
                            </div>
                            <div v-show="item.deviceStatus=='online'" style="font-size:15px"> 设备状态：<span style="color:#00ffdd;">在线</span></div>
                            <div v-show="item.deviceStatus=='offline'" style="font-size:15px"> 设备状态：<span style="color:#c1c1c1;">离线</span></div>
                            <div v-show="item.deviceStatus=='fault'" style="font-size:15px"> 设备状态：<span style="color:red;">故障</span></div>
                            <div class="messageJk">查看监控</div>
                         </div> -->
                      </div>
                      <div class='cgq' v-for="item,index in sensor" :key="index" @click="sensorCli(index)" :style="{left:item.latitude>100?item.latitude/15+'%':item.latitude+'%',top:item.longitude>100?item.longitude/15+'%':item.longitude+'%'}">
                        <!-- <div :style="{visibility:sensorIndex==index?'visible':'hidden',top:-sensorHeight+'px',left:'-50px'}" class="message" ref="sensorList" > 
                            <div class="message-item">
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.deviceCode}}</div>
                              <div style="font-size:12px;color:#c1c1c1;text-indent:1rem">{{item.parkName}}-{{item.plotName}}</div>
                            </div>
                            <div v-for="itm,inde in item.values" :key="inde">
                              <div>
                                {{itm.key}}：{{itm.values}}
                              </div>
                            </div>
                         </div> -->
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
                </div>
      </div>
      <div class="right">
        <div class="right1">
          <div class="box-title">预警信息</div>
          <div class="right1-item">
            <div class="right1-warper" v-for="item,index in record" :key="index">
              <div class="right1-left">
                <img :src="item.imgId" style="width: 85%;height: 80%;" alt=""/>
              </div>
              <div class="right1-right">
                  <div class="right-top">
                    <div style="font-weight: 900;font-size: 14px;width: 30%;">{{ item.warnTitle }}</div>
                    <div class="right1-warper2"></div>
                  </div>
                  <div class="warn">
                    <div class="warnBg"></div>
                    <div>{{item.warnInfo}}</div>
                  </div>
                  <div class="warn">
                    <div class="warnBg"></div>
                    <div>{{ item.parkName+item.plotName }} {{ item.deviceName }}</div>
                  </div>
                  <div class="warn">
                    <div class="warnBg"></div>
                    <div>{{ item.warnTime }}</div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right2">
          <div class="box-title">设备运行</div>
          <div class="right2-item">
            <div id="chart2"></div>
          </div>
        </div>
      </div>
      </div>
      <div class="footer">
        <div class="box-title2">实时监测
          <div class="btn">
            <div :class="btnIndex=='1'?'active2':'actived2'" @click="qxCli(1)">气象监测</div>
            <div :class="btnIndex=='2'?'active2':'actived2'" @click="tsCli('2')">土壤墒情</div>
          </div>
        </div>
        <div class="footer-item">
          <div class="footer-warper" v-for="item,index in byHour" :key="index">
              <div :class="['footer-top','footerBg-'+(index+1).toString()]" v-show="btnIndex==2">
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==0">土壤温度</div>
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==1">土壤温度</div>
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==2">土壤导电率</div>
                <div style="font-size: 20px;">{{item.newData.data}} <span style="font-size: 12px;">{{ item.newData.unit }}</span></div>
              </div>
              <div :class="['footer-top','footerBg-'+(index+1).toString()]" v-show="btnIndex==1">
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==0">气象温度</div>
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==1">气象湿度</div>
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==2">气象降雨量</div>
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==3">气象光照</div>
                <div style="font-size: 14px;color: #c1c1c1;margin-left:35px;" v-show="index==4">气象风速</div>
                <div style="font-size: 20px;">{{item.newData?.data}} <span style="font-size: 12px;">{{ item.newData?.unit }}</span></div>
              </div>
              <div :id="'chart' + (index + 3)"></div>
          </div>
        </div>
      </div>
      <div class="main-footer">
            <div v-for="item,index in mainList" :key="index" @click="goPage(index)" :class="mainIndex==index?'active':'actived'">
            {{ item }}
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
import {
  deviceTotal,
  deviceTypeStatistics,
  deviceStateStatistics,
  AvgDataValueByHour,
  MonitorWarnRecord,
  DeviceAndWarn
} from '@/api/bigscreen4/index'
import { useRouter} from 'vue-router'
import img from './assets/imgchart1.png'
//左侧饼状图
const initChart1=async ()=> {
  let res= await deviceStateStatistics()  
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
                      width: 40, // 图片宽度  
                      height: 40 // 图片高度  
                  },  
                  left: 'center', // 图片水平居中  
                  top: 'center' // 图片垂直居中  
              }]  
          },  
          color: ["#00ffff", "#ffce54", "#ffffff", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["50%", "70%"],
              center: "center",
              data: res,
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
            min:0,
            max:14
          }
        ],
        color:['#0cdbe4','red'],
          series: [
            {
              name:'在线率',
              data: [98,95,90,88,85,80],
              type: "bar",
              barWidth:'20',
              smooth: false,
            },
            {
              name:'离线率',
              data: [2,4,7,5,11,12],
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
//实时监测
let byHour=ref<any>([])
  let btnIndex=ref<any>(1)
const tsCli= async(val)=>{
  btnIndex.value=val
  let res = await Promise.all([AvgDataValueByHour({deviceType:'sensor_soil',type:'soil_humidity'}),AvgDataValueByHour({deviceType:'sensor_soil',type:'soil_temperature'}),AvgDataValueByHour({deviceType:'sensor_soil',type:'soil_conductivity'})])
      byHour.value=res
      setTimeout(() => {
        initChart3()
        initChart4()
        initChart5()
      }, 200)
}
const qxCli=async (val)=>{
  btnIndex.value=val
  let res = await Promise.all([AvgDataValueByHour({deviceType:'sensor_env',type:'env_temperature'}),AvgDataValueByHour({deviceType:'sensor_env',type:'env_humidity'}),AvgDataValueByHour({deviceType:'sensor_env',type:'env_rainfall'}),AvgDataValueByHour({deviceType:'sensor_env',type:'env_light'}),AvgDataValueByHour({deviceType:'sensor_env',type:'env_speed'})])
      byHour.value=res
      setTimeout(() => {
        initChart3()
        initChart4()
        initChart5()
        initChart6()
        initChart7()
      }, 200)
}
qxCli(1)
const initChart3= ()=>{
      initChartStatic(
        "chart3",
        generateBaseOptions({
          xAxis: {
            data:byHour.value[0].list.map(item =>item.time),
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
         },
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
          color:['#48c0ce'],
          series: [
            {
              data: byHour.value[0].list.map(item =>item.data),
              type: "line",
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
              },
            },
          ],
          grid: {
            left: "10%",
            right: "4%",
            top: "15%",
            bottom: "20%",
          },
        })
      );
}
const initChart4= ()=>{
      initChartStatic(
        "chart4",
        generateBaseOptions({
          xAxis: {
            data:byHour.value[1].list.map(item =>item.time),
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
         },
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
          color:['#48c0ce'],
          series: [
            {
              data: byHour.value[1].list.map(item =>item.data),
              type: "line",
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
              },
            },
          ],
          grid: {
            left: "10%",
            right: "4%",
            top: "15%",
            bottom: "20%",
          },
        })
      );
}
const initChart5= ()=>{
      initChartStatic(
        "chart5",
        generateBaseOptions({
          xAxis: {
            data:byHour.value[2].list.map(item =>item.time),
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
         },
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
          color:['#48c0ce'],
          series: [
            {
              data: byHour.value[2].list.map(item =>item.data),
              type: "line",
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
              },
            },
          ],
          grid: {
            left: "10%",
            right: "4%",
            top: "15%",
            bottom: "20%",
          },
        })
      );
}
const initChart6= ()=>{
      initChartStatic(
        "chart6",
        generateBaseOptions({
          xAxis: {
            data:byHour.value[3].list.map(item =>item.time),
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
         },
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
          color:['#48c0ce'],
          series: [
            {
              data: byHour.value[3].list.map(item =>item.data),
              type: "line",
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
              },
            },
          ],
          grid: {
            left: "10%",
            right: "4%",
            top: "15%",
            bottom: "20%",
          },
        })
      );
}
const initChart7= ()=>{
      initChartStatic(
        "chart7",
        generateBaseOptions({
          xAxis: {
            data:byHour.value[4].list.map(item =>item.time),
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
         },
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
          color:['#48c0ce'],
          series: [
            {
              data: byHour.value[4].list.map(item =>item.data),
              type: "line",
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
                color:'#48c0ce'
              },
            },
          ],
          grid: {
            left: "10%",
            right: "4%",
            top: "15%",
            bottom: "20%",
          },
        })
      );
}
onMounted(()=>{
  initChart1()
  initChart2()
  
})
let mainIndex=ref(1)
let mainList=ref<any>([
'农业资源','设备监控','产业数据','鲁渝有礼','视频监控'
])
let router=useRouter()
const goPage=(val)=>{
  mainIndex.value=val
  if(val=='0'){
    router.push('/bigscreen3')
  }
}
//左上总设备信息
let device=ref<any>({})
const getDeviceTotal=()=>{
  deviceTotal().then(res=>{
    device.value=res
  })
} 
getDeviceTotal()
//土壤环境
let tistics=ref<any>([])
let tisticsList=ref<any>([
  '环境监测','土壤墒情','视频监控'
])
let tisticsList2=ref<any>([
  'sensor_env','sensor_soil','camera_env'
])
const getDeviceTypeStatistics= async ()=>{
  let a= await deviceTypeStatistics({type:'sensor_env'})
  let b=await  deviceTypeStatistics({type:'sensor_soil'})
  let c=await  deviceTypeStatistics({type:'camera_env'})
  

 tistics.value.push(a,b,c)
 console.log(tistics.value , 9999);
 

}
getDeviceTypeStatistics()
//预警信息
let record=ref<any>([])
const getMonitorWarnRecord=()=>{
  MonitorWarnRecord().then(res=>{
    record.value=res
  })
}
getMonitorWarnRecord()
//地图预警信息
let webcam=ref<any>([])
let webcamIndex=ref<any>('-1')
let sensor=ref<any>([])
 let sensorIndex=ref<any>('-1')
const getDeviceAndWarn=()=>{
  DeviceAndWarn().then(res=>{
    let i=7
    let i2=6
    let a= res.webcam
    let b= res.sensor    
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
    webcam.value=a
    sensor.value=b
  })
}
getDeviceAndWarn()
let sxtList=ref<any>(null)
let sxtHeight=ref()
const webcamCli=(val:any)=>{
  sxtHeight.value=sxtList.value[val].offsetHeight
  if(webcamIndex.value==val) webcamIndex.value=-1
  else  webcamIndex.value=val
}
let sensorList=ref<any>(null)
let sensorHeight=ref<any>('')
const sensorCli=(val:any)=>{
  sensorHeight.value=sensorList.value[val].offsetHeight
  if(sensorIndex.value==val) sensorIndex.value=-1
  else  sensorIndex.value=val
}
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);
.bigscreen2-wrappper {
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/bg.png);
  background-size: 100% 100%;
  .header-main-wrapper{
      background-size: 100% 100%;
        background-image: url(./assets/headerBg.png);
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
  background-image: url(./assets/box-title.png);
}
.box-title2{
  width: 100%;
  height: 2rem;
  position: relative;
  text-indent: 2.5rem;
  color: #fff;
  font-size: 20px;
  line-height: 2rem;
  font-family: 'TitleFont';
  background-size: 100% 100%;
  background-image: url(./assets/box-title2.png);
  .btn{
    position: absolute;
    top: 2%;
    font-size: 14px;
    font-family: none;
    right: 5%;
    display: flex;
    width: 230px;
    justify-content: space-between;
    .active2{
      width: 100px;
      height: 2rem;
      cursor: pointer;
      display: flex;
      font-weight: 600;
      align-items: center;
      text-indent: -0.3rem;
      justify-content: center;
      background-size: 100% 100%;
      background-image: url(./assets/active2.png);
    }
    .actived2{
      width: 100px;
      height: 2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      text-indent: -0.3rem;
      justify-content: center;
      color: #c1c1c1;
      background-size: 100% 100%;
      background-image: url(./assets/actived2.png);
    }
  }
}
.content-main-wrapper {
    padding: 0 10px !important;
    box-sizing: border-box;
    height: 65% !important;
    display: grid;
    grid-template-columns: 25% calc(50% - 16px) 25%;
    gap: 8px;
    grid-auto-columns: 100%;
    .left{
      display: grid;
      color: #fff;
      grid-template-rows: 32% 32% calc(34% - 20PX);
      gap: 10PX;
      grid-auto-columns: 100%;
      .left1{
        width: 100%;
        height: 100%;
        .left1-item{
          width: 100%;
          display: flex;
          align-items: center;
          height: calc(100% - 2rem);
          .left1-warper{
            width: 100%;
            position: relative;
            height: 90%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #fff;
            background-size: 100% 100%;
            background-image: url(./assets/left1-item.png);
            .xian{
              position: absolute;
              left: 24%;
              top: 18%;
              width: 2px;
              height: 80px;
              background-size: 100% 100%;
              background-image: url(./assets/xian.png);
            }
            .total{
              display: flex;
              color: #fff;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 20%;
              height: 80%;
              background-size: 100% 100%;
              background-image: url(./assets/tatol.png);
            }
            .left1-warper-num{
              width: 21%;
              height: 85%;
              .warper-top{
                width: 100%;
                height: 20%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-size: 100% 100%;
                background-image: url(./assets/left1-warper.png);
              }
              .warper-num{
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                height: 80%;
                color: #c1c1c1;
                font-size: 14px;
                background-size: 100% 100%;
                background-image: url(./assets/warper-num.png);
              }
            }
          }
        }
      }
      .left2{
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        .left2-warper{
          padding: 10px 10px !important;
          margin-bottom: 10px;
          position: relative;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background-size: 100% 100%;
          background-image: url(./assets/left2Item.png);
          .xian{
            position: absolute;
            width: 1px;
            height: 50px;
            top: 8%;
            left: 28.5%;
            background-size: 100% 100%;
            background-image: url(./assets/xian.png);
          }
          .left-top{
            width: 25%;
            height: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            .top{
              width: 100%;
              display: flex;
              align-items: center;
              font-size: 16px;
              justify-content: space-between;
              .bg{
                margin-top: -15px;
                width: 40px;
                height: 40px;
                background-size: 100%;
                background-image: url(./assets/zhu.png);
              }
            }
          }
        }
      }
      .left2::-webkit-scrollbar{
        display: none;
      }
      .left3{
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        background-image: url(./assets/left3Bg.png);
        #chart1{
          width: 100%;
          height: 100%;
        }
      }
    }
    .main{
      position: relative;
      grid-auto-columns: 100%;
      width: 100%;
      height: 100%;
      .middle-main-item{
        position: absolute;
        width: 1000px;
        height: 100%;
        left: calc(50% - 500px);
        top: calc(50% - 50% );
        background-size: 100% 100%;
        background-image: url(./assets/mainBg.png);
        position: relative;
        .sxt{
        position: absolute;
        z-index: 999;
        width: 2rem;
        height:4rem;
        background-size: 100% 100%;
        background-image: url(./assets/jk2.png);
        position: relative
      }
      .cgq{
        position: absolute;
        z-index: 9999;
        width: 2rem;
        height: 4rem;
        background-size: 100% 100%;
        background-image: url(./assets/cgq2.png);
      }
        }
        .middle-sxt{
        position: absolute;
        right: 5%;
        bottom: 10%;
        display: flex;
        width: 20%;
        color: #fff;
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
      display: grid;
      grid-template-rows: 49% calc(51% - 10px);
      gap: 10px;
      grid-auto-columns: 100%;
      .right1{
        width: 100%;
        height: 100%;
        .right1-item{
          width: 100%;
          height: calc(100% - 2rem);
          overflow-y: scroll;
          .right1-warper{
            width: 100%;
            height: 49%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .right1-left{
              width: 35%;
              height: 85%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-size: 100% 100%;
              background-image: url(./assets/right1Warn.png);

            }
            .right1-right{
              width: 61%;
              height: 90%;
              color: #ffff;
              .right-top{
                width: 100%;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                .right1-warper2{
                width: 70%;
                height: 10px;
                background-size: 100% 100%;
                background-image: url(./assets/right1Top.png);
              }
              }
              .warn{
                display: flex;
                align-items: center;
                color: #c1c1c1;
                font-size: 14px;
                margin-bottom: 8px;
                .warnBg{
                  width: 10px;
                  height: 10px;
                  margin-right: 10px;
                  background-size: 100% 100%;
                  background-image:url(./assets/warn.png);
                }
                
              }
            }
          }
        }
        .right1-item::-webkit-scrollbar {
          display: none;
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
    }
  }
.footer{
  padding: 0 15px !important;
  box-sizing: border-box;
  width: 100%;
  height: 20%;
  color:#fff;
  .footer-item{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: calc(100% - 2rem);
    .footer-warper{
      padding:  10px !important;
      box-sizing: border-box;
      width: 19%;
      height: 85%;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background-image: url(./assets/footerItemBg.png);
      .footer-top{
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 28%;
        background-size: 100% 100%;
      }
      #chart3{
        width: 100%;
        height: calc(100% - 28%);
      }
      #chart4{
        width: 100%;
        height: calc(100% - 28%);
      }
      #chart5{
        width: 100%;
        height: calc(100% - 28%);
      }
      #chart6{
        width: 100%;
        height: calc(100% - 28%);
      }
      #chart7{
        width: 100%;
        height: calc(100% - 28%);
      }
    }
  }
}
.main-footer{
        position:fixed;
        left: 23%;
        bottom: 0;
        width: 50%;
        height: 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        .active{
          width: 20%;
          height: 50px;
          cursor: pointer;
          text-align: center;
          font-weight: 600;
          background-size: 100% 100%;
          background-image: url(./assets/active.png);
        }
        .actived{
          cursor: pointer;
          width: 20%;
          height: 50px;
          text-align: center;
          font-weight: 600;
          color: #c1c1c1;
          background-size: 100% 100%;
          background-image: url(./assets/actived.png);
        }
      }

@for $i from 1 through 5 {
  .footerBg-#{$i} {
    background-image: url(./assets/footer-top#{$i}.png);
  }
}
@for $i from 1 through 2 {
  .middle-sxt-#{$i} {
    background-size: 100% 100%;
    background-image: url(./assets/sxt#{$i}.png);
  }
}
</style>