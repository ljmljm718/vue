<template>
  <div class="w-full">
    <div class="mb-20px grid gap-5px h-70px" :style="`grid-template-columns: repeat(${10},9.7%);`">
      <div v-for="item,index in topList" :key="index" class="top-item" >
        <div style="color:#3a89ee;font-weight: 600;">{{item.title}}</div>
        <div class="flex justify-center mt-10px items-center" v-show="item.category==null || item.category=='49' || item.category=='48'||item.category=='47'||item.category=='53'|| item.category=='52'|| item.category=='55'">
          <div style="font-size: 20px;" class="mr-10px">
            <span class="art-font">{{ item.deviceCount }}</span>
            <span style="font-size: 12px;">台</span>
          </div>
          <div :class="['top-icon','top-'+(index+1)]"></div>
        </div>
        <div class="flex justify-center mt-10px " v-if="item.category=='online'">
          <div style="color:green;font-size: 20px;" class="mr-10px">{{ item.deviceCount }} <span style="font-size: 12px;">台</span></div>
         <div :class="['top-icon','top-'+(index+1)]"></div>
        </div>
        <div class="flex justify-center mt-10px " v-if=" item.category=='offline'">
          <div style="color:#c1c1c1;font-size: 20px;" class="mr-10px">{{ item.deviceCount }} <span style="font-size: 12px;">台</span></div>
         <div :class="['top-icon','top-'+(index+1)]"></div>
        </div>
        <div class="flex justify-center mt-10px " v-if=" item.category=='fault'">
          <div style="color:red;font-size: 20px;" class="mr-10px">{{ item.deviceCount }} <span style="font-size: 12px;">台</span></div>
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
              <div style="border:1px solid #c1c1c1;padding: 5px;">
                <div style="color: #847d78;">预警信息</div>
              <div class=" mt-20px ml-30px">
                <div style="color: #847d78;">今日报警</div>
                <div class="flex font-700 mt-10px" style="font-size: 20px">33 <div class="dayWarn-1 ml-10px mt-10px"></div> </div>
              </div>
              <div class=" mt-20px ml-30px">
                <div style="color: #847d78;">近30天报警</div>
                <div class="flex font-700 mt-10px" style="font-size: 20px">182 <div class="dayWarn-2 ml-10px mt-10px"></div> </div>
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
                        <span>{{ new Date().toLocaleString(scope.row.warnTime) }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
            </div> 
          </div>
            <!-- 右侧 -->
          <div class="p-[15px] bg-[#fff]">
          <div class="flex font-800"><div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>实时数据</div>
          <div style="height: calc(100% - 2rem);" class="mt-0.5rem grid grid-cols-2 gap-2 grid-rows-5 py-2">
              <div
                v-show="item!=null"
                class="rounded-sm flex items-center justify-around"
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
        <div class="w-100% h-30% bg-[#fff] mt-10px p-2">
          <div class="flex font-800"><div class="bg-[#7696eb] w-7px h-1.5rem mr-5px"></div>历史数据 </div>
          <div class="flex py-2">
            <el-select
              v-show='radio=="气象站" || radio=="棚内环境"'
              name=""
              id=""
              @change='selecteCli'
              v-model="test"
              placeholder="请选择类型"
              clearable
              class="!w-240px mx-2"
            >
              <el-option
                v-for="item, index in selecteList"
                :key="index"
                :label="item.title"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-show="radio=='土壤墒情' || radio=='虫情监测'"
              name=""
              id=""
              @change='selecteCli2'
              v-model="test2"
              placeholder="请选择类型"
              clearable
              class="!w-240px mx-2"
            >
              <el-option
                v-for="item, index in selecteList2"
                :key="index"
                :label="item.typeName"
                :value="index"
              />
            </el-select>
            <el-radio-group v-model="radio" @change="handleRadioChange">
              <el-radio-button label="气象站" value="weather" />
              <el-radio-button label="土壤墒情" value="solid" />
              <el-radio-button label="棚内环境" value="env" />
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
          <div class=" w-[100] h-140px relative">
            <div v-if='radio=="气象站"' id="chart3"></div>
            <div v-if="radio=='土壤墒情' || radio=='虫情监测'" id="chart4"></div>
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
import {
  HomeDeviceCard2,
  ParkTree,
  homeCheckLog,
  pageRealTimeData,
  CountListByNowTime,
  pageWarningInfo2,
  environmentView,
  DataByParkAndPlotAndType
} from './apis'
const dateData = ref('')
let radio=ref('气象站')
let pageWarnList=ref([])
let topList=ref([])
let data=ref([])
let deviceType=ref('15')
let deviceKind=ref('48')
let belongPark=ref(0) //基地id
let belongPlot=ref(0) // 地块id
let selecteList=ref([
  {
    title:'土壤温度',
    value:'1'    
  },
  {
    title:'土壤湿度',
    value:'2'    
  },
  {
    title:'光照',
    value:'3'    
  },
  {
    title:'大气压',
    value:'4'    
  },
  {
    title:'降雨量',
    value:'5'    
  },
  {
    title:'风速',
    value:'6'    
  },
])
let selecteList2=ref([])
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
const initChart2=async ()=>{
  let xAisData=[]
  let yAisData=[]
  let res= await CountListByNowTime({size:'10'})
  xAisData=res.xList
  yAisData=res.yList
  initChartStatic('chart2', generateBaseOptions({
    xAxis: {
            data:xAisData,
            interval:0,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
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
              name: "预警信息",
              data:yAisData,
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
const initChart3= (time2,list)=>{
  let time=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
  let data=['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
  let a= time2
  let b= list
  function fn(a){
    a.forEach((item,index)=> {
        data.splice(time.findIndex(itm=>itm.includes(item)),1,b[index])
    });
  }
  fn(a)
  initChartStatic('chart3', generateBaseOptions({
    xAxis: {
            data:a[0]=='00'?a:a.reverse(),
            interval:0,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
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
              name: "预警信息",
              data:b,
              type: "line",
              symbol:'none',
              areaStyle:{
                color:'#20cafd'
              }
            },
          ],
          grid: {
            left: "5%",
            right: "3%",
            top: "17%",
            bottom: "15%",
          },
  
  }))
}
const initChart4= (list)=>{
  let a=[]
  let b=[]
  list.forEach(item=>{
    a.push(item.gatherHour)
    b.push(item.gatherValue)
  })
  console.log(a,'a');
  console.log(b,'b');
  
  initChartStatic('chart4', generateBaseOptions({
    xAxis: {
            data:a,
            interval:0,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#c1c1c1",
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
              name: "预警信息",
              data:b,
              type: "line",
              symbol:'none',
              areaStyle:{
                color:'#20cafd'
              }
            },
          ],
          grid: {
            left: "5%",
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

const test = ref()
const test2 = ref()
const handleRadioChange = (e) => {
  if(e=='气象站'){
    deviceType.value='15'
    getEnvironmentView(belongPark.value,belongPlot.value)
  }else if(e=='彭内环境'){
    deviceType.value='16'
  }else if(e=='土壤墒情'){
    deviceKind.value='48'
    getDataByParkAndPlotAndType(belongPark,belongPlot)
  }else if(e=='虫情监测'){
    deviceKind.value='49'
    getDataByParkAndPlotAndType(belongPark,belongPlot)

  }
  
}
//获取顶部小卡片数据
const getHomeDeviceCard=()=>{
  HomeDeviceCard2().then(res=>{
    console.log(res,'顶部小卡片');
    
    topList.value=res
  })
}
getHomeDeviceCard()
//左侧基地树
const getParkTree=()=>{
  ParkTree().then(res=>{
    data.value=res
    console.log(res,'dd');
    belongPark.value=res[2].id
    belongPlot.value= res[2].child[1].id
    getHomeCheckLog(res[0].child[0].id)
    getPageRealTimeData(res[1].id, res[1].child[1].id)
    getpageWarningInfo(res[1].id, res[1].child[1].id)
    getEnvironmentView(res[2].id, res[2].child[1].id)
    getDataByParkAndPlotAndType(res[2].id, res[2].child[1].id)
  })
}
getParkTree()
//基地选择
const handleTreeChange=(data,b)=>{
  belongPark.value=b.data.id
  belongPlot.value=b.parent.data.id
  getHomeCheckLog(data.id)
  getPageRealTimeData(b.parent.data.id,b.data.id)
  getpageWarningInfo(b.parent.data.id,b.data.id)
  getEnvironmentView(b.parent.data.id,b.data.id)
  getDataByParkAndPlotAndType(b.parent.data.id,b.data.id)
}
//获取巡检进度
let typeList=ref([])
let deviceTotal=ref(0)
let devicePercent=ref(0)
const getHomeCheckLog=(id)=>{
  homeCheckLog({belongPlot:id}).then(res=>{
    typeList.value=res.deviceTypeList
    deviceTotal.value=res.deviceTotal
    devicePercent.value=res.progress
  })
}
//获取实时数据
let pageRealList=ref([])
const getPageRealTimeData=(id,id2)=>{
  pageRealTimeData({parkId:id,plotId:id2}).then(res=>{
    res.forEach(item=>{
      if(item==null) return
    })
    pageRealList.value=res
    
    
  }) 
}
//获取预警信息
const getpageWarningInfo=(id,id2)=>{
  pageWarningInfo2({parkId:id,plotId:id2}).then(res=>{
    pageWarnList.value=res
  })
}
//获取气象站历史数据
let chartList=ref({})
const getEnvironmentView=(id,id2)=>{
  environmentView({deviceType:deviceType.value,belongPark:id,belongPlot:id2}).then(res=>{
    console.log(res,'气象站历史数据');
    chartList.value=res
    initChart3(chartList.value.time,chartList.value.temperature)
  })
}
//获取土壤墒情和虫情监测
const getDataByParkAndPlotAndType=(id,id2)=>{
  DataByParkAndPlotAndType({deviceKind,belongPark:id,belongPlot:id2}).then(res=>{
    console.log(res,'土壤墒情和虫情监测');
    selecteList2.value=res
    initChart4(res[0].list)
  })
}
//下拉选择
const selecteCli=(e)=>{
  console.log(e,'下拉选择');
  test.value=e
  if(e==1){
    initChart3(chartList.value.time,chartList.value.temperature)
  }else if(e==2){
    initChart3(chartList.value.time,chartList.value.humidity)
  }else if(e==3){
    initChart3(chartList.value.time,chartList.value.lighting)
  }else if(e==4){
    initChart3(chartList.value.time,chartList.value.airPressure)
  }else if(e==5){
    initChart3(chartList.value.time,chartList.value.rainfall)
  }else if(e==6){
    initChart3(chartList.value.time,chartList.value.windSpeed)
  }
} 
//下拉选择2
const selecteCli2=(e)=>{
  test2.vlaue=e
  initChart4(selecteList2.value[e].list)
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
.top-asd{
  border: 1pxs;
  width: 120px;
  height: 222px;
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
#chart3{
  width: 100%;
  height: 100%;
}
#chart4{
  width: 100%;
  height: 100%;
}
select{
  position: absolute;
  z-index: 999;
  top: -40px;
  right:200px;
  width: 150px;
  height: 30px;
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