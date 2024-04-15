<template>
  <div class="bigscreen-wrappper bigscreen-main-wrapper">
      <div class="header-main-wrapper">
          <div class="header-left-part-wrapper">
            <BackOrHome />
          </div>
          <div class="header-title-wrapper">武隆县高山番茄数字化赋能</div>
          <div class="header-right-part-wrapper"><BigScreenTime /></div>
      </div>
      <div class="content-main-wrapper">
          <div class="left">
            <div class="left1">
              <div class="box-title">农业资源</div>
              <div class="left1-item">
                  <div @click="$router.push('/base/parkinfo')" :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">基地</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.parkCount }}</div>
                  </div>
                  <div @click="$router.push('/base/parkdetail')" :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">棚区</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.plotCount }}</div>
                  </div>
                  <div @click="$router.push('/base/parkinfo')" :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">种植面积</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.area }}</div>
                  </div>
                  <div @click="$router.push('/base/farmer-info')" :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">农户</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.farmer }}</div>
                  </div>
              </div>
            </div>
            <div class="left2">
              <div class="box-title">种植基地</div>
              <div class="left2-item">
                <div class="left2-warper" v-for="item,index in baseColl" :key="index">
                    <div style="margin-left: 8px;">{{item.baseName}}</div>
                    <div style="margin-left:25px; margin-right: 15px; color: #c1c1c1;font-size: 14px;">大棚： {{item.plotCount}}</div>
                    <div style="margin-left:1 5px; margin-right: 15px;color: #c1c1c1;font-size: 14px;">农户： {{item.farmerCout}}</div>
                    <div style="color: #c1c1c1;font-size: 14px;">种植品种：{{item.variety}}</div>
                  </div>
              </div>
            </div>
            <div class="left3">
              <div class="box-title">设备资源</div>
              <div class="left3-item">
                <div @click="goPage(index,item.category)" v-for="item,index in leftTop3List" :key="index" :class="['left3-warper','left3Top-'+(index+1).toString()]">
                    <div style="color: #c1c1c1;margin-left: 50px;">{{ item.title }}</div>
                 
                    <div style="font-weight:600;margin-left: 50px;font-size: 23px; font-family:TitleFont ;">{{ item.deviceCount }}</div>
                  </div>
              </div>
            </div>
            <div class="left4">
              <div class="box-title" @click="$router.push('/crop/crop-base')">种植分布</div>
              <div class="left4-item">
                <div id="chart1"></div>
              </div>
            </div>
          </div>
          <div class="content-main-item middle-main-wrapper">
            <div class="top-card-wrapper">
              <div class="top-card-item card-selected">
                <div class="value-card">农业一张图</div>
              </div>
              <div class="top-card-item" @click="$router.push('/bigscreen8')">
                <div class="value-card">产业一张图</div>
              </div>
              <div class="top-card-item" @click="$router.push('/bigscreen7')">
                <div class="value-card">设备监控</div>
              </div>
            </div>
            <!-- <div class="main-top">
              <div :class="mainIndex==1?'active':'actived'" @click="mainIndex=1">农业一张图</div>
              <div :class="mainIndex==2?'active':'actived'" @click="mainIndex=2">产业一张图</div>
              <div :class="mainIndex==3?'active':'actived'" @click="$router.push('/bigscreen7')">设备监控</div>
            </div> -->
            <div class="middle-main-item">
                <div class="sxt" v-for="item,index in jkList" :key='index' @click="sxtCli(index)" :style="{left:item.latitude.length>3?item.latitude/100+'%':item.latitude/10+'%',top:item.longitude.length>=3?item.longitude/20+'%':item.longitude+'%'}">
                  <div class="message" :style="{visibility:sxtIndex==index?'visible':'hidden',top:-sxtHeight+'px',left:'-50px'}" ref="sxtList">
                    <div class="message-top">{{ item.parkName+'-'+item.plotName }}</div>
                    <div style="margin-left:20px;margin-top:10px;">{{item.deviceName}}</div>
                    <div v-show="item.deviceStatus=='online'" style="margin-bottom: 20px; margin-left:20px;margin-top:10px;display: flex;align-items: center;color: #43ffd0;">
                      <div class="pie"></div>
                      在线
                    </div>
                    <div v-show="item.deviceStatus=='offline'" style="margin-bottom: 20px; margin-left:20px;margin-top:10px;display: flex;align-items: center;color: #c1c1c1;">
                      <div class="pie"></div>
                      离线
                    </div>
                    <div v-show="item.deviceStatus=='fault'" style="margin-bottom: 20px; margin-left:20px;margin-top:10px;display: flex;align-items: center;color: red;">
                      <div class="pie"></div>
                      故障
                    </div>
                    <div class="Jkbtn">查看监控</div>
                  </div>
                </div>
                <div class="soil"  @click="soilCli(index)" v-for="item,index in soilList" :key='index' :style="{left:item.latitude.length>=3?item.latitude/100+'%':item.latitude/10+'%',top:item.longitude.length>=3?item.longitude/20+'%':item.longitude+'%'}">
                  <div class="message"  :style="{visibility:soilIndex==index?'visible':'hidden',top:-soilHeight+'px',left:'-65px'}" ref="soilList2">
                    <div class="message-top">{{ item.parkName+'-'+item.plotName }}</div>
                    <div class="message-content">
                      <div v-for="itm,inde in item.result" :key='inde' style="margin-left:20px;margin-bottom:15px;">{{itm.dataType}}：{{itm.avgData+itm.dataUnit}}</div>
                    </div>
                    <div class='messageBar'></div>
                  </div>
                </div>
                <div class="shed"  @click="largeCli(index)" v-for="item,index in largeList" :key='index' :style="{left:item.latitude.length>=3?item.latitude/100+'%':item.latitude/100+'%',top:item.longitude.length>=3?item.longitude/10+'%':item.longitude+'%'}">
                  <div class="message" :style="{visibility:largeIndex==index?'visible':'hidden',top:-largeHeight+'px',left:'-65px'}" ref="largeList2">
                    <div class="message-top">{{ item.parkName+'-'+item.plotName }}</div>
                    <div class="message-content">
                      <div v-for="itm,inde in item.result" :key='inde' style="margin-left:20px;margin-bottom:15px;">{{itm.dataType}}：{{itm.avgData+itm.dataUnit}}</div>
                    </div>
                    <div class='messageBar'></div>
                  </div>
                  
                </div>
              <div class="footer">
                <div style="display: flex;align-items: center;"><div :class="['sxt-icon','sxt-1']"></div><div>监控设备</div> </div>
                <div style="display: flex;align-items: center;margin-left: 20px;margin-right: 20px;"><div :class="['sxt-icon','sxt-2']"></div><div>土壤墒情监控</div> </div>
                <div style="display: flex;align-items: center;"><div :class="['sxt-icon','sxt-3']"></div><div>棚内环境监测</div> </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="right1">
              <div class="box-title"  @click="$router.push('/device/equipment-data')">气象监测</div>
              <div class="right1-item">
                <div class="right1-top">
                  <div v-for="item,index in deviceList" :key="index" :class="qxzIndex==index?'active':'actived'" @click="qxzCli(index,item.id)" style="margin-right:10px;">{{item.deviceName}}</div>
                 
                </div>
                <div class="right1-warper">
                  <div  class="right1Bg">
                    <div :class="['right1-icon','right1bg-1']"></div>
                    <div style="margin-left: 20px;display: flex;flex-direction: column;align-items: center;height: 40%;justify-content: space-between;;">
                      <div style="color:#16bee2;font-size: 18px;">{{ deviceObj.temperature }}</div>
                      <div style="font-size: 13px;">大气温度</div>
                    </div>
                  </div>
                  <div  class="right1Bg">
                    <div :class="['right1-icon','right1bg-2']"></div>
                    <div style="margin-left: 20px;display: flex;flex-direction: column;align-items: center;height: 40%;justify-content: space-between;;">
                      <div style="color:#16bee2;font-size: 18px;">{{ deviceObj.humidity }}</div>
                      <div style="font-size: 13px;">大气湿度</div>
                    </div>
                  </div>
                  <div  class="right1Bg">
                    <div :class="['right1-icon','right1bg-3']"></div>
                    <div style="margin-left: 20px;display: flex;flex-direction: column;align-items: center;height: 40%;justify-content: space-between;;">
                      <div style="color:#16bee2;font-size: 18px;">{{ deviceObj.rainfall }}</div>
                      <div style="font-size: 13px;">降雨量</div>
                    </div>
                  </div>
                  <div  class="right1Bg">
                    <div :class="['right1-icon','right1bg-4']"></div>
                    <div style="margin-left: 20px;display: flex;flex-direction: column;align-items: center;height: 40%;justify-content: space-between;;">
                      <div style="color:#16bee2;font-size: 18px;">{{ deviceObj.airPressure }}</div>
                      <div style="font-size: 13px;">气压</div>
                    </div>
                  </div>
                  <div  class="right1Bg">
                    <div :class="['right1-icon','right1bg-5']"></div>
                    <div style="margin-left: 20px;display: flex;flex-direction: column;align-items: center;height: 40%;justify-content: space-between;;">
                      <div style="color:#16bee2;font-size: 18px;">{{ deviceObj.lighting }}</div>
                      <div style="font-size: 13px;">光照</div>
                    </div>
                  </div>
                  <div  class="right1Bg">
                    <div :class="['right1-icon','right1bg-6']"></div>
                    <div style="margin-left: 20px;display: flex;flex-direction: column;align-items: center;height: 40%;justify-content: space-between;;">
                      <div style="color:#16bee2;font-size: 18px;">{{ deviceObj.windSpeed }}</div>
                      <div style="font-size: 13px;">风速</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right2">
              <div class="box-title" @click="$router.push('/device/equipment-data')">棚内环境监测</div>
              <div class="right2-item">
                <div class="right2-select" style="margin-top: 15px;">
                  <select name="" id="" class="select" style="margin-right: 20px;" @change="seleCli1">
                    <option v-for="item,index in selecte1" :key="index" :value="item.id">{{item.name}}</option>
                  </select>
                  <select name="" id="" class="select"  @change="seleCli2">
                    <option v-for="item,index in selecte2" :key="index" :value="item.id">{{item.name}}</option>
                  </select>
                </div>
                <div class="right2-warper">
                  <div class="right2-warper-item" v-for="item,index in right2List" :key="index">
                      <div class="warper-top">{{item.collectionType}}</div>
                      <div class="warper-foot">
                        <div class="warper-item2" v-for="itm,inde in item.result" :key='inde'><div>{{itm.monitoringType}}：</div><div style="color:#22a7bf">{{itm.avgData+itm.dataUnit}}</div> </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
</div>
</template>
<script setup lang='ts'>
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
import {
initChartStatic,
generateBaseOptions,
generatePieOptions
} from "../../utils/bigscreenTool/index";
import {
  AgriResources,
  getCropInfo,
  BaseCollect,
  homeDeviceCard,
  MeteorologyDevice,
  MeteorologyDeviceData,
  ParkBaseInfo,
  pageShedMonitoringData,
  bigScreenDevicePoint
} from '@/api/bigscreen5/index'
import {ref,reactive,onMounted} from 'vue'
import { useRouter} from 'vue-router'
import { resetSize } from '@/components/Verifition/src/utils/util';
const initChart1= async ()=> {
  let res =await getCropInfo()
  console.log(res,'种植分布')
  let data=[]
  res.forEach(item=>{
    data.push({name:item.name,value:item.area})
  })
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
          color: ["#0097f4", "#17968b", "#b39946",'#c1764a' ,'#dfdfe0'],
          series: [
            {
              nam: "种植分布",
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
onMounted(()=>{
  initChart1()
})
let qxzIndex=ref(1)
let mainIndex=ref(1)

let leftTop3List=ref<any>([])
let router=useRouter()
const goPage=(index,id)=>{
  if(id==null) id=0
    router.push({
      path:'/device/deviceView',
      query:{
        id
      }
    })
  
}
//农业资源
let leftTop=ref<any>({})
const getAgriResources=()=>{
  AgriResources().then(res=>{
    console.log(res,'农业资源');
    leftTop.value=res
  })
}
getAgriResources()
//种植基地
let baseColl=ref<any>([])
const getBaseCollect=()=>{
  BaseCollect().then(res=>{
    console.log(res,'种植基地')
    baseColl.value=res
  })
}
getBaseCollect()
//设备资源
const getHomeDeviceCard=()=>{
  homeDeviceCard().then(res=>{
    console.log(res,'设备资源2');
    
    console.log(res.slice(1,6),'设备资源');
    leftTop3List.value=res.splice(1,6)

  })
}
getHomeDeviceCard()
//气象站获取设备数据
let deviceList=ref<any>([])
const getMeteorologyDevice=()=>{
  MeteorologyDevice().then(res=>{
    console.log(res,'气象站设备');
    deviceList.value=res
    qxzCli('0',res[0].id)
  })
}
getMeteorologyDevice()
//气象站事件
let deviceObj=ref<any>({})
const qxzCli=(val,id)=>{
  qxzIndex.value=val
  MeteorologyDeviceData({deviceCode:id}).then(res=>{
    console.log(res,'气象站数据');
    deviceObj.value=res
  })
}
//获取基地
let selecte1=ref<any>([])
let selecte2=ref<any>([])
let selecte1Id=ref<any>('')
let selecte2Id=ref<any>('')
const getParkBaseInf=()=>{
  ParkBaseInfo({parentId:0}).then(res=>{
    console.log(res,'基地');
    selecte1.value=res.reverse()
    selecte1Id.value=res[0].id
    getParkBaseInf2({parentId:res[0].id})
  })
}
getParkBaseInf()
//获取棚区
const getParkBaseInf2=(val)=>{
  ParkBaseInfo(val).then(res=>{
    console.log(res,'棚区');
    selecte2.value=res
    getPageShedMonitoringData({parkId:selecte1Id.value,plotId:res[0].id})
  })
}
//获取棚内环境数据  parkId  ：基地编号 plotId  ：地块编号
let right2List=ref([])
const getPageShedMonitoringData=(val)=>{
  pageShedMonitoringData(val).then(res=>{
    console.log(res,'彭内环境数据')
    right2List.value=res
  })
}

//筛选基地
const seleCli1=(e)=>{
  selecte1Id.value=e.target.value
  getParkBaseInf2({parentId:e.target.value})
}
//筛选基地
const seleCli2=(e)=>{
  selecte2Id.value=e.target.value
  getPageShedMonitoringData({parkId:selecte1Id.value,plotId:e.target.value})
}
//获取地图数据
let jkList=ref([])
let soilList=ref([])
let largeList=ref([])
const getBigScreenDevicePoint=()=>{
  bigScreenDevicePoint().then(res=>{
    console.log(res,'地图数据')
    let i=7
    let i2=5
    let a= res.monitorDevice.splice(0,4)
    let b= []
    let c= []
    b.push(res.SensorDevice[0])
    c.push(res.SensorDevice[1])
    a.forEach((item,index)=>{
      if(typeof(item.latitude)!='string') return  a.splice(index, 1)
      else  item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    console.log(a,'地图监控数据')
    b.forEach((item,index)=>{
      if(typeof(item.latitude)!='string') return b.splice(index, 1)
      else  item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    c.forEach((item,index)=>{
      if(typeof(item.latitude)!='string') return b.splice(index, 1)
      else  item.latitude=item.latitude.substring(i2)
      item.longitude=item.longitude.substring(i)
    })
    console.log(b,'地图传感器数据b')
    console.log(c,'地图传感器数据c')
    jkList.value=a
    soilList.value=b
    largeList.value=c

  
  })
}
getBigScreenDevicePoint()
//监控点击
let sxtIndex=ref(-1)
let sxtList=ref<any>(null)
let sxtHeight=ref()
const sxtCli=(val)=>{
  sxtHeight.value=sxtList.value[val].offsetHeight
  if(sxtIndex.value==val) sxtIndex.value=-1
  else sxtIndex.value=val
}
//土壤点击
let soilIndex=ref(-1)
let soilList2=ref<any>(null)
let soilHeight=ref()
const soilCli=(val)=>{
  soilHeight.value=soilList2.value[val].offsetHeight+20
  if(soilIndex.value==val) soilIndex.value=-1
  else soilIndex.value=val
}
//土壤点击
let largeIndex=ref(-1)
let largeList2=ref<any>(null)
let largeHeight=ref()
const largeCli=(val)=>{
  largeHeight.value=largeList2.value[val].offsetHeight+20
  if(largeIndex.value==val) largeIndex.value=-1
  else largeIndex.value=val
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
  background-image: url(./assets/titleBg.png);
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
  z-index: 999;
  display: grid;
  grid-template-rows: 24% 24% 24% calc(28% - 30px);
  gap: 10px;
  grid-auto-columns: 100%;
  .left1{
    width: 100%;
    height: 100%;
    .left1-item{
      width: 100%;
      height: calc(100% - 2rem);
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 10px;
      .left1-warper{
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .left2{
    width: 100%;
    height: 100%;
    .left2-item{
      width: 100%;
      height: calc(100% - 2rem);
      color:#c1c1c1;
      overflow-y: scroll;
      .left2-warper{
        margin-top: 10px;
        padding: 15px 10px ;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background-image: url(./assets/left2Bg.png);
        background-size: 100% 100%;
      }
    }
    .left2-item::-webkit-scrollbar {
        display: none;
        }
  }
  .left3{
    width: 100%;
    height: 100%;
    .left3-item{
      width: 100%;
      height: calc(100% - 2rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .left3-warper{
        display: inline-block;
        width: 33%;
        height: 48%;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .left4{
    width: 100%;
    height: 100%;
  .left4-item{
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
    .main-top{
      z-index: 999;
      position: absolute;
      width: 95%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-around;      
      .active{
        padding: 5px 50px;
        height: 100%;
        font-weight: 700;
        text-align: center;
        line-height: 45px;
        color: #fff;
        background-size: 100% 100%;
        background-image: url(./assets/active2.png);
      }
      .actived{
        padding: 5px 50px;
        height: 100%;
        color: #c1c1c1;
        text-align: center;
        line-height: 45px;
        background-size: 100% 100%;
        background-image: url(./assets/actived2.png);
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
        z-index: 9999;
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
          padding: 0 15px !important;
          width: 200px;
          color: #c1c1c1;
          background-size: 100% 100%;
          background-image: url(./assets/message.png);
          .message-top{
            width: 100%;
            margin-left: 20px;
            margin-bottom: 15px;
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
        z-index: 9999;
        position: absolute;
        width: 4.5rem;
        height: 4.5rem;
        background-size: 100% 100%;
        background-image: url(./assets/sxt2.png);
        .message{
          position: absolute;
          top: -250px;
          left: -80px;
          padding: 20px 15px !important;
          width: 200px;
          color: #c1c1c1;
          background-size: 100% 100%;
          background-image: url(./assets/message.png);
          .message-top{
            width: 100%;
            margin-bottom: 15px;
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
          .message-content{
            width:100%;
            height: 150px;
            overflow-y: scroll;
            
          }
          .message-content::-webkit-scrollbar {
            display: none;
          }
          .messageBar{
            width: 5px;
            height: 60px;
            background-size: 100% 100%;
            background-image: url(./assets/messageBar.png);
            position: absolute;
            bottom: -40px;
            left: 100px;
          }
        }
      }
      .shed{
        z-index: 9999;
        position: absolute;
        width: 4.5rem;
        height: 4.5rem;
        background-size: 100% 100%;
        background-image: url(./assets/sxt3.png);
        .message{
          position: absolute;
          top: -250px;
          left: -80px;
          padding: 15px 15px !important;
          width: 200px;
          color: #c1c1c1;
          background-size: 100% 100%;
          background-image: url(./assets/message.png);
          .message-top{
            width: 100%;
            margin-left: 20px;
            font-weight: 600;
            margin-bottom: 15px;
            line-height: 30px;
            color: #fff;
            padding: 5px;
            box-sizing: border-box;
            margin-top: 20px;
            height: 40px;
            background-size: 100% 100%;
            background-image: url(./assets/messageTop.png);
          }
          .message-content{
            width:100%;
            height: 150px;
            overflow-y: scroll;
            
          }
          .message-content::-webkit-scrollbar {
            display: none;
          }
          .messageBar{
            width: 5px;
            height: 60px;
            background-size: 100% 100%;
            background-image: url(./assets/messageBar.png);
            position: absolute;
            bottom: -40px;
            left: 100px;
          }
        }
      }
      .footer{
        display: flex;
        position: absolute;
        left: 20%;
        bottom: 2%;
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
  grid-template-rows: 35% calc(65% - 10px);
  gap: 10px;
  grid-auto-columns: 100%;
  .right1{
    width: 100%;
    height: 100%;
    .right1-item{
      width: 100%;
      height: calc(100% - 2rem);
      .right1-top{
        width: 100%;
        height: 33px;
        margin-left: 230px;
        display: flex;
        .active{
          width: 20%;
          color: #fff;
          font-size: 14px;
          padding: 7px 10px;
          background-size: 100% 100%;
          background-image: url(./assets/active.png);
        }
        .actived{
          color: #c1c1c1;
          width: 20%;
          padding: 7px 10px;
          font-size: 14px;
          background-size: 100% 100%;
          background-image: url(./assets/actived.png);
        }
      }
      .right1-warper{
        width: 100%;
        height: calc(100% - 33px);
        display: grid;
        grid-template-columns: 1fr 1fr 1fr ;
        gap: 8px;
        grid-template-rows: 1fr 1fr;
        .right1Bg{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;

          .right1-icon{
            width: 3rem;
            height: 3rem;
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
      width: 100%;
      height: calc(100% - 2.7rem);
      .right2-select{
        height: 33px;
        margin-left: 180px;
        display: flex;
        margin-bottom: 10px;
        .select{
          background: none;
          padding: 0 20px;
          color: #fff;
          background-size: 100% 100%;
          background-image: url(./assets/select.png);
          option{
            color:#000
          }
        }
      }
      .right2-warper{
        width: 100%;
        height: calc(100% - 58px);
        overflow-y: scroll;
        .right2-warper-item{
          width: 100%;
          height: 32%;
          margin-bottom: 20px;
          background-size: 100% 100%;
          background-image: url(./assets/right2Bg.png);
          padding: 15px 20px !important;
            box-sizing: border-box;
          .warper-top{
            width: 40%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            font-size: 18px;
            font-weight: 600;
            background-size: 100% 100%;
            background-image: url(./assets/warperTop.png);
          }
          .warper-foot{
            width: 100%;
            margin-top: 15px;
            height: calc(100% - 45px);
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            overflow-y: scroll;
              .warper-item2{
                width: 43%;
                height: 20px;
                color: #c1c1c1;
                padding: 3px 10px !important;
                margin-bottom: 10px;
                display: flex;
                background-size: 100% 100%;
                background-image: url(./assets/wareprBg.png);
              }
          }
          .warper-foot::-webkit-scrollbar{
            display: none;
          }
        }
      }
      .right2-warper::-webkit-scrollbar{
        display: none;
      }
    }
  }
}
}

@for $i from 1 through 4 {
.leftTop-#{$i} {
  background-image: url(./assets/leftTop#{$i}.png);
}
}
@for $i from 1 through 6 {
.left3Top-#{$i} {
  background-image: url(./assets/left3Top#{$i}.png);
}
}
@for $i from 1 through 6 {
.right1bg-#{$i} {
  background-image: url(./assets/right1Bg#{$i}.png);
}
}
@for $i from 1 through 3 {
.sxt-#{$i} {
  background-image: url(./assets/sxt#{$i}.png);
}
}

</style>