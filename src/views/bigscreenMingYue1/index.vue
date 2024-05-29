<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper flex items-center justify-around color-[#fff]">
        <div class="top-card-wrapper">
              <div class="active2" >
                <div class="value-card">基地导览</div>
              </div>
              <div class="actived2">
                <div class="value-card" @click="router.push('/bigscreenMYZH')">智慧种植</div>
              </div>
              <div class="actived2">
                <div class="value-card"  @click="router.push('/bigscreenMYFX')">风险预警</div>
              </div>
        </div>
        <BackOrHome/> 

      </div>
      <div class="linear-font-title header-title-wrapper">稻鱼鸭产业可视化数字驾驶舱</div>
      <div class="header-right-part-wrapper">
        <BigScreenTime />
      </div>
    </div>
    <div class="content-main-wrapper inner-border">
         <div class="left inner-border flex items-center p-[10px] color-[#fff]" style="flex-direction: column;">
          <el-tree
            style="width: 100%;height: 100%;background:transparent;color: #888888;background-color: transparent ;"
            :data="treeList"
            :props="defaultProps"   
            default-expand-all   
            accordion
            @node-click="handleNodeClick"
          />
        </div>
         <div class='main inner-border' >
          <div class="color-[#c1c1c1] w-32% h-[15rem] p-[10px] inner-border mb-15px mr-15px" style=" box-sizing: border-box; display: inline-block;" v-for="item,index in videoList" :Key='index'>
            <div class="mb-10px">{{ item?.deviceName }}</div>
            <video 
              v-if="item?.monitoringEquipmentDataDO?.videoLink"
              :src="item?.monitoringEquipmentDataDO?.videoLink"
              controls
              autoplay
              class="video"
              width="100%" 
              height="150px"
            ></video>
            <img style="width: 100%;height: 150px" v-if="item?.monitoringEquipmentDataDO?.videoLink==null" :src="item.monitoringEquipmentDataDO?.capturedImage" alt=""/>
            <img style="width: 100%;height: 150px" v-if="item?.deviceStatus=='fault'" :src="item.monitoringEquipmentDataDO?.capturedImage" alt=""/>
            <img style="width: 100%;height: 150px" v-if="item?.deviceStatus=='fault'" :src="item.monitoringEquipmentDataDO?.capturedImage" alt=""/>
            <div class="w-full flex justify-between">
              <div style="cursor: pointer;" @click="router.push('/internetMonitor/deviceData/monitoring-equipment-data')">{{ item?.location }}</div>
              <div v-if="item?.deviceStatus=='online'" class="color-[green]">在线</div>
              <div v-if="item?.deviceStatus=='offline'" class="color-[#c1c1c1]">离线</div>
              <div v-if="item?.deviceStatus=='fault'" class="color-[red]">故障</div>
            </div>
          </div>
         </div>
         <div class="right color-[#fff]  p-[10px] inner-border" style="box-sizing: border-box;">
          <div>通知事件</div>
          <div class="flex justify-between mt-10px">
            <el-date-picker
              v-model="dataVal"
              type="daterange"
              range-separator="To"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"              
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            value-format="YYYY-MM-DD HH:mm:ss"
              @change="dateChange"
            />
            <el-select :teleported="false" placeholder="请选择事件类型" popper-class="popperClass"  v-model="selectVal" class="select"  @change="selectCli">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="mt-20px right-list">
            <div @click="router.push('/internetMonitor/deviceData/monitoring-equipment-notice')" style="cursor: pointer;" v-for="item,index in pageList" :key="index" class='flex items-center justify-around color-[#c1c1c1] p-[15px] right-item'>
              <div class="w-35%">{{item.noticeEvent}}</div>
              <div class="w-40%">{{new Date().toLocaleString(item.createTime)}}</div>
              <img :src="item.captured" class="w-25% h-100%" alt=""/>
            </div>
         </div>
      </div>
  </div>
  </div>
</template>
<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import {ref,reactive,onMounted} from 'vue'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'

import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions,
} from "../../utils/bigscreenTool/index";
import { useRouter} from 'vue-router'
import { 
  getParkTree,
  EquipmentPhotographAndVideo,
  getPage
} from '@/api/bigscreenMingYue'
let router=useRouter()
const selectVal=ref()
const options2 = [
  {
    value: '全部事件',
    label: '全部事件',
  },
  {
    value: '非法入侵',
    label: '非法入侵',
  },
  {
    value: '逗留',
    label: '逗留',
  },
  {
    value: '经过',
    label: '经过',
  },
]
let dataVal=ref('')
let plotId=ref('')
let baseId=ref('')
let pageList=ref([])
const getGetParkTree=()=>{
  getParkTree().then(res=>{
    console.log(res,'左侧基地树')
    treeList.value=res
    baseId.value=res[0].id
    plotId.value=res[0].child[0].id
    getEquipmentPhotographAndVideo()
    getGetPage()
  })
}
getGetParkTree()
const getGetPage=(monitoringPlotId='',monitoringBaseId='',noticeEvent='',recordTime=[])=>{
  console.log(recordTime,'recordTime')
  getPage({monitoringPlotId,monitoringBaseId,noticeEvent,pageNo:'1',pageSize:'10'}).then(res=>{
    console.log(res,'通知事件')
    pageList.value=res.list
  })
}
getGetPage()
const selectCli=(e)=>{
  console.log(e,'事件')
  selectVal.value=e=='全部事件'?'':e
  e=='全部事件'?getGetPage():getGetPage(plotId.value,baseId.value,selectVal.value,dataVal.value)
}
const dateChange=(e)=>{
  console.log(e,'shijian')
  dataVal.value=e
  getGetPage(plotId.value,baseId.value,selectVal.value,dataVal.value)

}
const treeList=ref([])
const defaultProps = {
  children: 'child',
  label: 'name',
}


const handleNodeClick=(data,node,val,obj)=>{
  console.log(node.parent,'aa')
   plotId.value=data.id
   baseId.value=node.parent.data.id
  getEquipmentPhotographAndVideo(baseId.value,plotId.value)
}
let videoList=ref([])
const getEquipmentPhotographAndVideo=(baseId='',plotId='')=>{
  EquipmentPhotographAndVideo({baseId,plotId}).then(res=>{
    console.log(res,'视频')
    videoList.value=res
  })
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
.inner-border {
    border: 1px solid #449ce9;
}
.content-main-wrapper {
    padding: 10px !important;
    height: 90% !important;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 10% calc(65% - 20px) 25%;
    gap: 10px;
    .left{
      box-sizing: border-box;
      .el-tree-node:hover {
        background-color: transparent !important;
      }
    }
    .main{
      overflow-y: scroll;
      padding: 10px 15px;
      box-sizing: border-box;
      white-space: wrap;
    }
    .main::-webkit-scrollbar{
      width: 0;
    }
    .right{
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .select  {
        width: 48%;
        background-color: none !important;
      }
      :deep(.el-popper.is-light){
            background: #307cbf ;
            border: 1px solid #273f70 ;
        }

      :deep(.el-select-dropdown__item.hover){
            background: transparent ;
            border: none ;
            color: #04FAA0;
        }


      :deep(.el-select-dropdown__item){
            background: transparent ;
            border: none ;
            color: #fff;
        }

      :deep(.el-popper.is-light .el-popper__arrow::before) {
            border: 1px solid #4778d9;
            background: #4778d9;
            right: 0;
        } 
      
      .right-list{
        width:100%;
        height: 750px;
        overflow-y: scroll;
          .right-item{
          width: 100%;
          height: 13%;
          margin-bottom:10px;
          background-size:100% 100%;
          box-sizing: border-box;
          background-image: url('./assets/right-itemBg.png');
        }
      }
      .right-list::-webkit-scrollbar{
        width: 0;
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
.el-tree::hover{
  background-color: none;
}
</style>