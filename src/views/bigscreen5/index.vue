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
          </div>
          <div class="main"></div>
          <div class="right"></div>
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

import * as echarts from "echarts"
import {ref,reactive,onMounted} from 'vue'
import { object } from 'vue-types';
import { resetSize } from '@/components/Verifition/src/utils/util';
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
}
.right{
  display: grid;
  grid-template-rows: 40% calc(60% - 10px);
  gap: 10px;
  grid-auto-columns: 100%;
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

</style>