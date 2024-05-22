<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper flex items-center justify-around color-[#fff]">
        <div class="top-card-wrapper">
              <div class="active2" >
                <div class="value-card">基地导览</div>
              </div>
              <div class="actived2">
                <div class="value-card">智慧种植</div>
              </div>
              <div class="actived2">
                <div class="value-card">风险预警</div>
              </div>
        </div>
      </div>
      <div class="linear-font-title header-title-wrapper">稻鱼鸭产业可视化数字驾驶舱</div>
      <div class="header-right-part-wrapper">
        <BigScreenTime />
      </div>
    </div>
    <div class="content-main-wrapper">
         <div class="left flex items-center p-[10px] color-[#fff]" style="flex-direction: column;">
          <div @click="leftCli(-1)" :class="activeNum==-1?'active':'actived'" style="margin-top: 30px;margin-bottom: 15px;">全部</div>
          <div @click="leftCli(index)" v-for="item,index in 5" :class="activeNum==index?'active':'actived'" style="margin-bottom: 15px;" :key="index">库房{{ item }}</div>
         </div>
         <div class='main' style=' flex-wrap: wrap; '>
          <div class="color-[#c1c1c1] w-full h-[10rem] p-[10px]" style="box-sizing: border-box; display: inline-block" v-for="item,index in 9" :Key='index'>
            <div>设备{{ item }}</div>
            <video
              :src="''"
              controls
              autoplay
              class="video"
              width="100%" 
              height="150px"
            ></video>
            <div class="w-full flex justify-between">
              <div>基地全景</div>
              <div class="color-[green]">在线</div>
            </div>
          </div>
         </div>
         <div class="right color-[#fff]">
          <div>通知事件</div>
          <div class="flex justify-between mt-10px">
            <el-select v-model="selectVal" class="select"  @change="selectCli">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="selectVal2" class="select" @change="selectCli">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="mt-20px">
            <div class='flex items-center justify-around color-[#c1c1c1]' style="border: 1px solid #c1c1c1">
              <div>有人在监测区域停留</div>
              <video 
                src='' 
                width='30%' 
                height='100px'
                controls
                autoplay></video>
            </div>
          </div>
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
import { useRouter} from 'vue-router'
let activeNum=ref(-1)
const leftCli=(val)=>{
  activeNum.value=val
}
const selectVal=ref()
const selectVal2=ref()
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
const selectCli=()=>{

}
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);
.bigscreen2-wrappper {
  width: 100vw;
  height: 100vh;
  background-image: url('./assets/bg.png');
  background-size: 100% 100%;
  .header-main-wrapper{
      background-size: 100% 100%;
        background-image: url('./assets/headerBg.png');
    }
}
.content-main-wrapper {
    padding: 0 10px !important;
    height: 90% !important;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 10% calc(65% - 20px) 25%;
    gap: 10px;
    .left{
      box-sizing: border-box;
    }
    .main{
      overflow-y: scroll;
      padding: 10px 15px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap:20px;
      grid-template-rows: 1fr 1fr 1fr;
    }
    .main::-webkit-scrollbar{
      width: 0;
    }
    .right{
      box-sizing: border-box;
      .select {
        width: 48%;
        background-color: none !important;
      }
    }
}
.top-card-wrapper{
  width: 100%;
 display: grid;
 grid-template-columns:1fr 1fr 1fr;
 gap: 10px;
 .active2{
  width:100%;
  height: 2.5rem;
  text-align: center;
  line-height: 2.5rem;
  background-size:100% 100%;
  background-image: url('./assets/active.png'); 
  .value-card{
    font-size: 1rem;
    font-family: 'TitleFont';
  } 
 }
 .actived2{
  width:100%;
  height: 2.5rem;
  text-align: center;
  line-height: 2.5rem;
  background-size:100% 100%;
  background-image: url('./assets/actived.png'); 
  .value-card{
    font-size: 1rem;
    font-family: 'TitleFont';
  } 
 }
}
.active{
  width:5rem;
  height: 3rem; 
  line-height: 3rem; 
  text-align: center;
  background-color: #012162;
}
.actived{
  width:5rem;
  height: 3rem; 
  line-height: 3rem; 
  text-align: center;
  background-color: #016aba;
}
@for $i from 1 through 3 {
  .scan-#{$i} {
    background-image: url(./assets/scan#{$i}.png);
  }
}
</style>