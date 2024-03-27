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
              <div class="box-title">农业资源</div>
              <div class="left1-item">
                  <div  :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">基地</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.parkCount }}</div>
                  </div>
                  <div  :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">棚区</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.plotCount }}</div>
                  </div>
                  <div  :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">种植面积</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.area }}</div>
                  </div>
                  <div  :class="['left1-warper','leftTop-1']">
                    <div style="color: #c1c1c1;margin-left: 120px;">农户</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ leftTop.farmer }}</div>
                  </div>
              </div>
            </div>
            <div class="left2">
              <div class="box-title">种植基地</div>
              <div class="left2-item">
                <div class="left2-warper">
                    <div style="flex:1;margin-left: 15px;">地基1</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">大棚： 13</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">农户： 4</div>
                    <div style="color: #c1c1c1;font-size: 14px;">种植品种：喜力、金红九等</div>
                  </div>
                <div class="left2-warper">
                    <div style="flex:1;margin-left: 15px;">地基2</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">大棚： 17</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">农户： 5</div>
                    <div style="color: #c1c1c1;font-size: 14px;">种植品种：喜力、红满园等</div>
                  </div>
                <div class="left2-warper">
                    <div style="flex:1;margin-left: 15px;">地基3</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">大棚： 21</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">农户： 5</div>
                    <div style="color: #c1c1c1;font-size: 14px;">种植品种：红满园、格雷等</div>
                  </div>
              </div>
            </div>
            <div class="left3">
              <div class="box-title">设备资源</div>
              <div class="left3-item">
                <div v-for="item,index in leftTop3List" :key="index" :class="['left3-warper','left3Top-'+(index+1).toString()]">
                    <div style="color: #c1c1c1;margin-left: 50px;">{{ item.title }}</div>
                    <div style="font-weight:600;margin-left: 50px;font-size: 23px; font-family:TitleFont ;">{{ item.val }}</div>
                  </div>
              </div>
            </div>
            <div class="left4">
              <div class="box-title">种植分布</div>
              <div class="left4-item">
                <div id="chart1"></div>
              </div>
            </div>
          </div>
          <div class="content-main-item middle-main-wrapper">
            <div class="main-top">
              <div :class="mainIndex==1?'active':'actived'" @click="mainIndex=1">农业一张图</div>
              <div :class="mainIndex==2?'active':'actived'" @click="mainIndex=2">产业一张图</div>
              <div :class="mainIndex==3?'active':'actived'" @click="$router.push('/bigscreen7')">设备监控</div>
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
              <div class="box-title">气象监测</div>
              <div class="right1-item">
                <div class="right1-top">
                  <div :class="qxzIndex==1?'active':'actived'" @click="qxzIndex=1" style="margin-right:10px;">气象站1</div>
                  <div :class="qxzIndex==2?'active':'actived'" @click="qxzIndex=2">气象站2</div>
                </div>
                <div class="right1-warper">
                  <div v-for="item,index in right1List" :key="index" class="right1Bg">
                    <div :class="['right1-icon','right1bg-'+(index+1).toString()]"></div>
                    <div style="margin-left: 20px;display: flex;flex-direction: column;align-items: center;height: 40%;justify-content: space-between;;">
                      <div style="color:#16bee2;font-size: 18px;">{{ item.val }}</div>
                      <div style="font-size: 13px;">{{ item.title }}</div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <div class="right2">
              <div class="box-title">棚内环境监测</div>
              <div class="right2-item">
                <div class="right2-select" style="margin-top: 15px;">
                  <select name="" id="" class="select" style="margin-right: 20px;">
                    <option value="12">基地</option>
                  </select>
                  <select name="" id="" class="select">
                    <option value="12">1号大鹏</option>
                  </select>
                </div>
                <div class="right2-warper">
                  <div class="right2-warper-item">
                      <div class="warper-top">土壤墒情</div>
                      <div class="warper-foot">
                        <div class="warper-item2"><div>土壤温度：</div><div style="color:#22a7bf">19.6℃</div> </div>
                        <div class="warper-item2"><div>土壤湿度：</div><div style="color:#22a7bf">79.3%/RH</div> </div>
                        <div class="warper-item2"><div>PH值：</div><div style="color:#22a7bf">6.3</div> </div>
                        <div class="warper-item2"><div>导电率：</div><div style="color:#22a7bf">0.42</div> </div>
                        <div class="warper-item2"><div>N:P:K比例：</div><div style="color:#22a7bf">1:0:46:1.32</div> </div>
                      </div>
                  </div>
                  <div class="right2-warper-item">
                      <div class="warper-top">棚内环境监测</div>
                      <div class="warper-foot">
                        <div class="warper-item2"><div>温度：</div><div style="color:#22a7bf">27.34℃</div> </div>
                        <div class="warper-item2"><div>湿度：</div><div style="color:#22a7bf">76.21%/RH</div> </div>
                        <div class="warper-item2"><div>光照：</div><div style="color:#22a7bf">20890Lux</div> </div>
                        <div class="warper-item2"><div>气压：</div><div style="color:#22a7bf">91.25kPa</div> </div>
                        <div class="warper-item2"><div>降雨量：</div><div style="color:#22a7bf">0.3mm</div> </div>
                        <div class="warper-item2"><div>CO₂：</div><div style="color:#22a7bf">4.4mmol/L</div> </div>
                      </div>
                  </div>
                  <div class="right2-warper-item">
                      <div class="warper-top">虫情测报监测</div>
                      <div class="warper-foot">
                        <div class="warper-item2"><div>虫害数量：</div><div style="color:#22a7bf">16</div> </div>
                        <div class="warper-item2"><div>虫害种类：</div><div style="color:#22a7bf">3</div> </div>
                        <div class="warper-item2"><div>杀虫仓温度：</div><div style="color:#22a7bf">20℃</div> </div>
                        <div class="warper-item2"><div>烘干仓温度：</div><div style="color:#22a7bf">20℃</div> </div>
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
import {
initChartStatic,
generateBaseOptions,
generatePieOptions,
} from "../../utils/bigscreenTool/index";
import {
  AgriResources,
  getCropInfo
} from '@/api/bigscreen5/index'
import {ref,reactive,onMounted} from 'vue'
import { resetSize } from '@/components/Verifition/src/utils/util';
const initChart1= async ()=> {
  let res =await getCropInfo()
  console.log(res,'种植分布')
  let data=[]
  res.forEach(item=>{
    data.push({name:item.name,value:item.area})
  })
  console.log(data,'data')
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
let leftTop1List=ref<any>([
  {
    title:'基地',
    val:'3'
  },
  {
    title:'棚区',
    val:'51'
  },
  {
    title:'种植面积',
    val:'108亩'
  },
  {
    title:'农户',
    val:'48'
  },
])
let leftTop3List=ref<any>([
  {
    title:'监控设备',
    val:'108台'
  },
  {
    title:'环境传感',
    val:'13台'
  },
  {
    title:'土壤墒情',
    val:'5台'
  },
  {
    title:'虫情监测',
    val:'21台'
  },
])
let right1List=ref([
  {
    val:'17.3℃',
    title:'大气温度'
  },
  {
    val:'67.4%/RH',
    title:'大气温度'
  },
  {
    val:'0.01mm',
    title:'降雨量'
  },
  {
    val:'90.17kPa',
    title:'气压'
  },
  {
    val:'20890Lux',
    title:'光照'
  },
  {
    val:'0.75m/s',
    title:'风速'
  },
])
//农业资源
let leftTop=ref<any>({})
const getAgriResources=()=>{
  AgriResources().then(res=>{
    console.log(res,'农业资源');
    leftTop.value=res
  })
}
getAgriResources()
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
        justify-content: space-between;
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
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 10px;
      .left3-warper{
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
    .main-top{
      z-index: 9999;
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
        height: 33px;
        margin-left: 280px;
        display: flex;
        .active{
          color: #fff;
          font-size: 14px;
          padding: 7px 15px;
          
          background-size: 100% 100%;
          background-image: url(./assets/active.png);
        }
        .actived{
          color: #c1c1c1;
          padding: 7px 15px;
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
        margin-left: 230px;
        display: flex;
        margin-bottom: 10px;
        .select{
          background: none;
          padding: 0 15px;
          color: #fff;
          background-size: 100% 100%;
          background-image: url(./assets/select.png);
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
@for $i from 1 through 4 {
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