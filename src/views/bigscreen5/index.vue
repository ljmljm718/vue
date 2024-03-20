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
                  <div v-for="item,index in leftTop1List" :key="index" :class="['left1-warper','leftTop-'+(index+1).toString()]">
                    <div style="color: #c1c1c1;margin-left: 120px;">{{ item.title }}</div>
                    <div style="font-weight:600;margin-left: 120px;font-size: 23px; font-family:TitleFont ;">{{ item.val }}</div>
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
                    <div style="flex:1;margin-left: 15px;">地基1</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">大棚： 13</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">农户： 4</div>
                    <div style="color: #c1c1c1;font-size: 14px;">种植品种：喜力、金红九等</div>
                  </div>
                <div class="left2-warper">
                    <div style="flex:1;margin-left: 15px;">地基1</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">大棚： 13</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">农户： 4</div>
                    <div style="color: #c1c1c1;font-size: 14px;">种植品种：喜力、金红九等</div>
                  </div>
                <div class="left2-warper">
                    <div style="flex:1;margin-left: 15px;">地基1</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">大棚： 13</div>
                    <div style="margin-right: 15px;color: #c1c1c1;font-size: 14px;">农户： 4</div>
                    <div style="color: #c1c1c1;font-size: 14px;">种植品种：喜力、金红九等</div>
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
          <div class="main"></div>
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

import {ref,reactive,onMounted} from 'vue'
import { resetSize } from '@/components/Verifition/src/utils/util';
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
          color: ["#0097f4", "#17968b", "#b39946",'#c1764a' ,'#dfdfe0'],
          series: [
            {
              nam: "种植分布",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: [
                {value: "32",name:'喜力'},
                {value: "26",name:'金红九'},
                {value: "21",name:'红满园'},
                {value: "6",name:'格雷'},
                {value: "7",name:'百利'},
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
})
let qxzIndex=ref(1)
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
    title:'环境传染',
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
  display: grid;
  grid-template-rows: 24% 24% 24% calc(28% - 10px);
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
.right{
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
      height: calc(100% - 2rem);
      .right2-select{
        height: 33px;
        margin-left: 230px;
        display: flex;
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
        height: calc(100% - 48px);
        background-color: red;
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

</style>