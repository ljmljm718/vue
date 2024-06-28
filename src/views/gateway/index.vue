<template>
  <div>
    <div class="w-full h-[200px] flex items-center  bg-[#f1f1f1]">
      <div class="logo ml-[30px]"></div>
      <div class="m-auto">
        <div class=" color-[#fb0100] text-4xl" style="font-family:'TitleFont';">鲁渝协作乡村振兴示范村数字化赋能工程</div>
        <div class="bg-[#fff] color-[#fe1271] m-auto w-420px p-[15px] mt-20px">强化产业协作，实施“东产西移”，大力推动区域协同发展</div>
      </div>
    </div>
    <div :style="`height:${mainNum>0?'440px':'300px'}`" class="w-full border-2 flex justify-between p-[20px] box-border">
      <el-card style="width: 49%">
          <template #header>
            <div class="card-header">
              <span>基础数据</span>
            </div>
          </template>
          <div class="grid grid-cols-3 gap-5 grid-rows-2 color-[#fff]">
              <div @mouseenter="mouseenterChange(1)" @mouseleave='mainNum=0' class="flex box-border py-[5px] bg-[#07494c] items-center justify-around">
                <div class="data-icon"></div>
                <div calss='flex-1'>
                  <div class="text-center mb-[10px]">14</div>
                  <div>帮扶区县</div>
                </div>
              </div>
              <div  @mouseenter="mouseenterChange(2)" @mouseleave='mainNum=0' class="flex box-border py-[5px] bg-[#0b4979] items-center justify-around">
                <div class="data-icon"></div>
                <div calss='flex-1'>
                  <div class="text-center mb-[10px]">25</div>
                  <div>示范村</div>
                </div>
              </div>
              <div  @mouseenter="mouseenterChange(3)" @mouseleave='mainNum=0' class="flex box-border py-[5px] bg-[#07494c] items-center justify-around">
                <div class="data-icon"></div>
                <div calss='flex-1'>
                  <div class="text-center mb-[10px]">32</div>
                  <div>精准帮扶基地</div>
                </div>
              </div>
              <div  @mouseenter="mouseenterChange(4)" @mouseleave='mainNum=0' class="flex box-border py-[5px] bg-[#0b4979] items-center justify-around">
                <div class="data-icon"></div>
                <div calss='flex-1'>
                  <div class="text-center mb-[10px]">35</div>
                  <div>产业形态</div>
                </div>
              </div>
              <div class="flex items-center box-border py-[5px] bg-[#0b4979] justify-around">
                <div class="data-icon"></div>
                <div calss='flex-1'>
                  <div class="text-center mb-[10px]">35</div>
                  <div>打造品牌</div>
                </div>
              </div>
              <div class="flex items-center box-border py-[5px] bg-[#07494c] justify-around">
                <div class="data-icon"></div>
                <div calss='flex-1'>
                  <div class="text-center mb-[10px]">224</div>
                  <div>数字感知设备</div>
                </div>
              </div>
          </div>
          <template #footer v-if="mainNum>0">
            <div class="card-header">
              <span>移入展示数据</span>
            </div>
          </template>
        </el-card>
        <el-card style="width: 49%;height:400px">
          <template #header>
            <div class="card-header">
              <span>地图展示</span>
            </div>
          </template>
          <div calss='rightMap'></div>
        </el-card>
    </div>
  </div>
</template>
<script setup lang='ts'>
import {ref} from 'vue'
import {

} from './api'
const mainNum=ref(0)
//鼠标移入事件
const mouseenterChange=(val)=>{
  mainNum.value=val
}
</script>
<style lang="scss" scoped>
@import url(../../utils/bigscreenTool/index.scss);
  .logo{
    width: 13rem;
    height: 9rem;
    background-size: 100% 100%;
    background-image: url(./assets/logo.png);
  }
  .data-icon{
    width:2rem;
    height: 2rem;
    border:2px solid red;
  }
  .rightMap{
    width: 100%;
    height: 100px;
    border: 1px solid red;
  }
</style>