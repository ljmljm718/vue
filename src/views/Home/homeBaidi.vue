<template>
  <div class="w-full">
    <div class="mb-20px grid gap-5px h-70px" :style="`grid-template-columns: repeat(${10},9.7%);`">
      <div v-for="item,index in topList" :key="index" class="top-item" >
        <div style="color:#3a89ee;font-weight: 600;">{{item.title}}</div>
        <div class="flex justify-center mt-10px ">
          <div v-if="item.category=='online'" style="color:green;font-size: 20px;" class="mr-10px">{{ item.deviceCount }} <span style="font-size: 12px;">台</span></div>
          <div v-if="item.category=='offline'" style="color: #ccc;font-size: 20px;" class="mr-10px">{{ item.deviceCount }} <span style="font-size: 12px;">台</span></div>
          <div v-if="item.category=='fault'" style="color: red;font-size: 20px;" class="mr-10px">{{ item.deviceCount }} <span style="font-size: 12px;">台</span></div>
          <div :class="['top-icon','top-'+(index+1)]"></div>
        </div>
      </div>
    </div>
    <div class="flex justify-between h-720px">
      <!-- 左侧 -->
      <div style="box-sizing: border-box;" class="w-20% bg-[#ebf3ff]">
        <el-tree
          style="max-width: 100%;background: none;height:100%"
          :data="data"
          :props="defaultProps"
          :default-expand-all="true"
          highlight-current
          node-key="id"
          @current-change="handleTreeChange"
        />
      </div>
      <div class="w-79% ml-10px">
          <!-- 左侧 -->
        <div class="w-100% h-69% bg-[#ededed] mb-10px grid gap-8px" style="grid-template-columns: 22% 56% calc(22% - 16px);">
          <div class="bg-[#fff] p-[10px]">
            <div class="flex font-800"><div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>巡检进度 </div>
            <div class="relative">
              <div id="chart1"></div>
              <div class="absolute left--6 top-0 w-full h-full flex flex-col items-center justify-center">
              <div style="font-size: 1.1rem;color:#7696eb;font-weight: bold;">{{devicePercent}}</div>
              <div style="font-size: .8rem">种植进度</div>
            </div>
            </div>
            <div class="font-700 w-100% h-50px bg-[#ffc653] flex" style="align-items: center;justify-content: space-around">
              <div class="flex ml--40px"><div class="sanjiao mr-8px" style="align-items: center;"></div> 总设备数</div>
              <div>{{deviceTotal}}</div>
            </div>
            <div class="grid grid-cols-2 gap-5px grid-rows-2 h-40% mt-10px ">
              <div class="bg-[#f2f2f2] p-[10px]" v-for="item,index in typeList" :key="index">
                <div class="flex justify-between mb-4px">{{item.deviceName}} <span>{{item.deviceCount}}</span></div>
                <div style="color: #c1c1c1;">已巡检 <span class="ml-20px">{{item.inspect}}</span></div>
                <div style="color: #c1c1c1;margin-top: 10px;">未巡检 <span class="ml-20px">{{item.notInspect}}</span></div>
              </div>
            </div>
          </div>
          <!-- 中间 -->
          <div class="p-[15px]  bg-[#fff]">
            <div class="flex w-100% h-49% mb-10px">
            <div class=" h-49% mr-20px w-20% ">
              <div>
                <div style="color: #847d78;">预警信息</div>
              <div class=" mt-20px">
                <div style="color: #847d78;">今日报警</div>
                <div class="flex font-700" style="font-size: 20px">33 <div class="dayWarn-1 mt-10px"></div> </div>
              </div>
              <div class=" mt-20px">
                <div style="color: #847d78;">近30天报警</div>
                <div class="flex font-700" style="font-size: 20px">182 <div class="dayWarn-2 mt-10px"></div> </div>
              </div>
            </div>
            </div>
            <div class="w-78% ">
                <div id="chart2"></div>
              </div>
            </div>
            <div class="w-100% h-49%">
              <div class="flex font-800"><div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>设备预警 </div>
              <el-table :data="pageWarnList" :stripe="true" :show-overflow-tooltip="true" height="10rem">
                    <el-table-column label="设备" align="center" prop="deviceName" />
                    <el-table-column label="预警类型" align="center" prop="warnType" />
                    <el-table-column label="描述" align="center" prop="warnInfo" />
                    <el-table-column label="时间" align="center" prop="warnTime">
                      <template #default="scope">
                        <span>{{ formatTime(scope.row.warnTime, 'yyyy-MM-dd') }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
            </div> 
          </div>
            <!-- 右侧 -->
          <div class="p-[15px] bg-[#fff]">
          <div class="flex font-800"><div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>实时数据</div>
          <div style="height: calc(100% - 2rem);" class="mt-0.5rem grid grid-cols-2 gap-2 grid-rows-5 py-2">
              <div v-show="item!=null"
                class="rounded-sm"
                style="background-color: #237ced16;border: 1px solid #ffffff40;"
                v-for="item,index in pageRealList"
                :key="index"
              >
                <div class="flex p-1 px-2 items-center justify-between">
                  <div class="flex flex-col">
                    <div style="color: #1173ed;font-weight: bold;font-size:13px;">
                      <span>{{ item?.avgData }}</span>
                      <span>{{ item?.dataUnit }}</span>
                    </div>
                    <div class="text-sm">{{ item?.dataType }}</div>
                  </div>
                  <div :class="`w-9 h-9 border icon-${index+1}`" style="background-size: 100% 100%;">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="w-100% h-30% bg-[#fff] mt-10px ">
          <div class="flex font-800"><div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>历史数据 </div>
          <div class="flex py-2">
            <el-radio-group v-model="radio" @change="handleRadioChange">
              <el-radio-button label="棚内环境" value="env" />
              <el-radio-button label="气象站" value="weather" />
              <el-radio-button label="土壤墒情" value="solid" />
              <el-radio-button label="虫情监测" value="situation" />
            </el-radio-group>
            <div style="margin: 0 .4rem;">
              <el-date-picker
                v-model="dateData"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </div>
            <el-button type="primary" @click="handleRadioChange(radio)">查询</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import { formatTime } from '@/utils/index'
import {
  HomeDeviceCard2,
  ParkTree,
  homeCheckLog,
  pageRealTimeData
} from './apis'
const dateData = ref('')
let radio=ref('棚内环境')
let pageWarnList=ref([])
let topList=ref([])
let data=ref([])
const initChart1=()=>{
  initChartStatic('chart1', generatePieOptions({
    legend: {
      show: false,
      top: "center",
      left: "right",
      bottom: '0',
      orient: 'vertical',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#a1a1aa'
      }
    },
    color: ["#3381ed"],
    series: [
      {
        type: "pie",
        radius: ["45%", "65%"],
        center: ["40%", "50%"],
        data: [
        { value: 81, name: 'Search Engine' },
          { value: 19, name: 'Direct' },
      ],
        label: {
          show: true,
          position: 'center',
          color:'#000',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
      },
    ],
  }))
}
const initChart2=()=>{
  initChartStatic('chart2', generateBaseOptions({
    xAxis: {
            data:['1月','2月','2月','2月','2月',],
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
         color:['#20cafd'],
          yAxis:{
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
              },
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#c1c1c1", //网格线颜色
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
              name: "生长监控",
              data:[1,2,3,4,5,6,],
              type: "line",
              symbol:'none',
              areaStyle:{
                color:'#20cafd'
              }
            },
          ],
          grid: {
            left: "10%",
            right: "3%",
            top: "17%",
            bottom: "15%",
          },
  
  }))
}
const defaultProps = {
  children: 'child',
  label: 'name',
}
onMounted(()=>{
  initChart1()
  initChart2()
})
const handleRadioChange = (e) => {
  console.log('e', e);
  
}
//获取顶部小卡片数据
const getHomeDeviceCard=()=>{
  HomeDeviceCard2().then(res=>{
    console.log(res,'小卡片数据');
    topList.value=res
  })
}
getHomeDeviceCard()
//左侧基地树
const getParkTree=()=>{
  ParkTree().then(res=>{
    console.log(res,'左侧基地树');
    data.value=res
    getHomeCheckLog(res[0].child[0].id)
    getPageRealTimeData(res[1].id, res[1].child[1].id)
  })
}
getParkTree()
//基地选择
const handleTreeChange=(data,b)=>{
  console.log(data,'data');
  console.log(b.data.id,b.parent.data.id,'b');
  getHomeCheckLog(data.id)
  getPageRealTimeData(b.parent.data.id,b.data.id)
  
}
//获取巡检进度
let typeList=ref([])
let deviceTotal=ref(0)
let devicePercent=ref(0)
const getHomeCheckLog=(id)=>{
  homeCheckLog({belongPlot:id}).then(res=>{
    console.log(res,'巡检进度');
    typeList.value=res.deviceTypeList
    deviceTotal.value=res.deviceTotal
    devicePercent.value=res.progress
  })
}
//获取实时数据
let pageRealList=ref([])
const getPageRealTimeData=(id,id2)=>{
  pageRealTimeData({parkId:id,plotId:id2}).then(res=>{
    console.log(res,"实施诗句");
    res.forEach(item=>{
      if(item==null) return
    })
    pageRealList.value=res
    
    
  }) 
}
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);

.top-item{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image:url(./assets/topBg.png);
  background-size: 100% 100%;
  .top-icon{
    width: 1.5rem;
    height: 1.5rem;
    background-size: 100% 100%;
  }
}
.sanjiao{
  width: 0;  
  height: 0;  
  border-top: 8px solid transparent;   /* 顶部边框 */  
  border-bottom: 8px solid transparent; /* 底部边框 */  
  border-left: 8px solid #fff;         /* 左边边框，即三角形的可见部分 */ 
}
.dayWarn-1{
  width: 0;
  height: 0;
  border-right: 8px solid transparent;   /* 顶部边框 */  
  border-bottom: 8px solid #00d531; /* 底部边框 */  
  border-left: 8px solid transparent;         /* 左边边框，即三角形的可见部分 */ 
}
.dayWarn-2{
  width: 0;
  height: 0;
  border-right: 8px solid transparent;   /* 顶部边框 */  
  border-top: 8px solid red; /* 底部边框 */  
  border-left: 8px solid transparent;         /* 左边边框，即三角形的可见部分 */ 
}
#chart1{
  width: 100%;
  height: 200px;
}
#chart2{
  width: 100%;
  height: 100%;
}
@for $i from 1 through 10  {
  .top-#{$i} {
    background-image: url(./assets/s#{$i}.png);
  }
}

@for $i from 1 through 10 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}
</style>