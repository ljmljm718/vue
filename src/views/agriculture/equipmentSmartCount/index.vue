<script lang="ts" setup>
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../../utils/bigscreenTool/index'
import { ParkInfoApi } from "@/api/agriculture/parkinfo";
import { EquipmentDataApi } from '@/api/agriculture/equipmentdata/index'
import * as echarts from 'echarts'
import icon1 from './assets/icon1.png'
import icon2 from './assets/icon2.png'
import icon3 from './assets/icon3.png'
import icon4 from './assets/icon4.png'
import icon5 from './assets/icon5.png'

//存放基地信息
const selectBase = ref([])
const getBaseDataList = async () => {
  const selectBaseList = await ParkInfoApi.getParkInfoPage({});
  console.log(selectBaseList.list,'selectBaseList.list')
  selectBase.value = selectBaseList.list
}
getBaseDataList()
const soilList=ref([])
// 获取土壤墒情信息
const getSoilInfoList = async () => {
  const res = await EquipmentDataApi.environmentalDataHomePageC({})
  console.log("res", res);
  soilList.value=res
}
getSoilInfoList()
//获取虫情信息
let infestation=ref([])
const getEnvironmentalDataHomePageB=async ()=>{
   infestation.value= await EquipmentDataApi.environmentalDataHomePageB({})
  console.log(infestation.value,'虫情信息')
}
getEnvironmentalDataHomePageB()
//获取气象信息
let weather=ref([])
const getEnvironmentalDataHomePageA=async()=>{
  weather.value= await EquipmentDataApi.environmentalDataHomePageA({})
  console.log(weather.value,'气象信息')
}
getEnvironmentalDataHomePageA()
//获取水质信息
let waterQuality=ref([])
const getWaterQualityData=async ()=>{
  waterQuality.value=await EquipmentDataApi.waterQualityData({})
  console.log(waterQuality.value,'水质信息')
}
getWaterQualityData()
const queryParams = ref({
  name: '',
  plot: ''
})
const handleQuery = async () => {}
const resetQuery = () => {
  queryParams.value = { name: '', plot: '' }
  handleQuery()
}
handleQuery()
//时间提取
function startTime(time){
  let data=new Date(time[0])
  let data2=new Date(time[1])
  let year=data.getFullYear()
  let year2=data2.getFullYear()
  let month=data.getMonth()+1
  let month2=data2.getMonth()+1
  let day=data.getDate()
  let day2=data2.getDate()
  initDataCollectChart('appoint',`${year}-${month}-${day}`,`${year2}-${month2}-${day2}`)
}

// 数据采集量展示
const dataCollectRadio = ref('本年')
const dataCollectDateRange = ref([])
const CollectDate=()=>{
  startTime(dataCollectDateRange.value)
}
const dataColleChange= (val)=>{
  if(val=='本年') val='year'
  else if(val=='本月') val='month'
  else if(val=='今日') val='day' 
  initDataCollectChart(val)
}
const initDataCollectChart=async (type,startDate='',endDate='')=>{
  console.log(type,startDate,endDate,'asdasdq123')
  let res =await EquipmentDataApi.QueryCurrentDateCount(type=='appoint'?{type,startDate,endDate}:{type} )
  console.log(res,'数据采集量展示')
  initChartStatic('dataCollectChart', generateBaseOptions({
    xAxis: {
      data:type=='appoint'?res.map(item=>item.collectionDate):res.map(item=>item.collectionDate).reverse(),
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      }
    },
    legend: {
      show: false,
      orient: 'horizontal',
      itemWidth: 15,
      itemHeight: 15,
    },
    color: ['#ffa773', '#36e1d9'],
    yAxis: {
      name: '',
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      },
      splitLine: {
        //网格线
        show: true, //是否显示
        lineStyle: {
          //网格线样式
          color: '#a1a1aa80', //网格线颜色
          width: 1, //网格线的加粗程度
          type: 'dashed' //网格线类型
        }
      },
      splitArea: {
        //网格区域
        show: false //是否显示
      }
    },
    series: [
      {
        name: '数据采集量展示',
        data:type=='appoint'?res.map(item=>item.totalValue):res.map(item=>item.totalValue).reverse() ,
        type: 'line',
        smooth: true,
        label: {
          show: true, //开启显示
          position: 'right', //在上方显示
          textStyle: {
            //数值样式
            color: '#a1a1aa',
            fontSize: 10
          }
        },
      }
    ],
    grid: {
      left: '5%',
      right: '4%',
      top: '8%',
      bottom: '12%'
    }
  }))

}
// 数据展示
const dataShowRadio = ref('气象站')
let seletValue=ref()
let options=ref([])
const dataShowDate = ref('')
// //获取下拉
const dataShowChange= async(val)=>{
  let res=await EquipmentDataApi.QueryCollectionType({monitoringType:val})
  options.value=res
  dataShowRadio.value=val
  console.log(res,'实时数据下拉')
  initDataShowChart(dataShowRadio.value,res[0],dataShowDate.value)
}
dataShowChange('气象站')
//下拉选择
const selectCli=(e)=>{
  console.log(e,'value221')
  seletValue.value=e
  initDataShowChart(dataShowRadio.value,seletValue.value,dataShowDate.value)
}
//选择时间
const dataShowDateChange=(val)=>{
  console.log(val,'val')
  let data=new Date(val) 
  let year=val.getFullYear()
  let month=data.getMonth()+1
  let day=data.getDate()
  dataShowDate.value=`${year}-${month}-${day}`
  initDataShowChart(dataShowRadio.value,seletValue.value,dataShowDate.value)
}
const initDataShowChart=async (collectionType='',monitoringType='',date='')=>{
  let res=await EquipmentDataApi.getDataPresentation({collectionType,monitoringType,date})
  console.log(res,'数据展示')
  initChartStatic('dataShowChart', generateBaseOptions({
    xAxis: {
      data:res.map(item=>item.dateTime),
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      }
    },
    legend: {
      show: false,
      orient: 'horizontal',
      itemWidth: 15,
      itemHeight: 15,
    },
    color: ['#46bff6', '#36e1d9'],
    yAxis: {
      name: '',
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#a1a1aa80'
        }
      },
      splitLine: {
        //网格线
        show: true, //是否显示
        lineStyle: {
          //网格线样式
          color: '#a1a1aa80', //网格线颜色
          width: 1, //网格线的加粗程度
          type: 'dashed' //网格线类型
        }
      },
      splitArea: {
        //网格区域
        show: false //是否显示
      }
    },
    series: [
      {
        name: '数据展示' ,
        data: res.map(item=>item.dataValue),
        type: 'line',
        smooth: true,
        label: {
          show: true, //开启显示
          position: 'right', //在上方显示
          textStyle: {
            //数值样式
            color: '#a1a1aa',
            fontSize: 10
          }
        },
      }
    ],
    grid: {
      left: '5%',
      right: '4%',
      top: '8%',
      bottom: '12%'
    }
  }))
}

// 数据采集量情况
const collectConditionDateRange = ref([])
//数据采集量情况时间提取
function getTime(time){
  let data=new Date(time[0])
  let data2=new Date(time[1])
  console.log(data.getDate(),'asdasdq123')
  let year=data.getFullYear()
  let year2=data2.getFullYear()
  let month=data.getMonth()+1
  let month2=data2.getMonth()+1
  let day=data.getDate()
  let day2=data2.getDate()
  let hour=data.getHours()
  let hour2=data2.getHours()
  let minute=data.getMinutes()
  let minute2=data2.getMinutes()
  let miao=data.getSeconds()
  let miao2=data2.getSeconds()
  initCollectConditionChart(`${year}-${month}-${day} ${hour}:${minute}:${miao}`,`${year2}-${month2}-${day2} ${hour2}:${minute2}:${miao2}`)

}
const collectChange=()=>{
  getTime(collectConditionDateRange.value)
}
//数据采集量情况
const initCollectConditionChart=async (dataStarTime='',dataEndTime='')=>{
  let res=await EquipmentDataApi.getPieDataList({dataStarTime,dataEndTime})
  console.log(res,'数据采集量情况')
  let data=[]
  res.forEach(item=>{
    data.push({
      name:item.collectionType,
      value:item.countNum
    })
  })
  initChartStatic('collectConditionChart', generatePieOptions({
    legend: {
      show: true,
      top: 'center',
      right: '10%',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#252525'
      }
    },
    color: ['#00b4ff', '#00f496', '#3b72ad'],
    series: [
      {
        name: '数据采集量情况',
        type: 'pie',
        radius: ['40%', '62%'],
        center: ['35%', '50%'],
        data:data,
        label: {
          // formatter: "{c|{c}},{d|{d}%}",
          formatter: '{c} - {d}%',
          color: '#252525',
          borderWidth: 0,
          rich: {
            c: {
              color: '#000',
              fontSize: 20
            },
            d: {
              color: '#252525',
              fontSize: 10
            }
          }
        }
      }
    ]
  }))

}
onMounted( async() => {
  initDataShowChart()
  initDataCollectChart('year')
  initCollectConditionChart()
})
</script>
<template>
  <div>
    <el-card style="height: 75px;">
      <el-form :model="queryParams" label-width="90px" class="flex space-x-3">
        <el-form-item label="基地名称">
          <el-select
            v-model="queryParams.name"
            placeholder="请选择基地名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          >  
            <el-option
              v-for="item in selectBase"  
              :key="item"
              :label="item.name"
              :value="item.name"
            />   
          </el-select>
        </el-form-item>
        <el-form-item label="地块名称">
          <el-input
            v-model="queryParams.plot"
            clearable
            placeholder="请输入地块名称"
            style="width: 240px;"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <div class="flex space-x-3">
            <el-button @click="handleQuery" type="primary">
              <Icon icon="ep:search" class="mr-5px"/>
              搜索
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" class="mr-5px"/>
              重置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="mt-3 grid gap-3 2xl:grid-cols-12 xl:grid-cols-6">
      <el-card class="col-span-4">
        <template #header>
          <div class="flex items-center space-x-2">
            <el-icon><HelpFilled /></el-icon>
            <span>土壤墒情</span>
          </div>
        </template>
        <div class="grid grid-rows-3 grid-cols-3" style="flex-wrap:wrap;">
          <div class="min-w-32 flex px-3 py-2 justify-between items-center" v-for="item,index in soilList" :key="index">
            <el-avatar shape="square" :src="icon1" v-show="index==0"/>
            <div class="flex flex-col items-center justify-center">
              <div>{{item.monitoringType}}({{item.yyUnit}})</div>
              <div class="art-font text-lg">{{item.dataValue}}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="col-span-2">
        <template #header>
          <div class="flex items-center space-x-2">
            <el-icon><HelpFilled /></el-icon>
            <span>虫情监测</span>
          </div>
        </template>
        <div class="flex justify-evenly items-center" style="flex-direction:column;">
          <div class="flex px-1 py-2 justify-between items-center mb-15px" v-for="item,index in infestation" :key='index'>
            <el-avatar shape="square" :src="icon2" />
            <div class="flex px-2 pt-1 flex-col items-center justify-center">
              <div style="font-size: 11px;">{{item.monitoringType}}</div>
              <div class="art-font text-sm" >{{item.dataValue}}{{item.yyUnit}}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="col-span-6">
        <template #header>
          <div class="flex items-center space-x-2">
            <el-icon><HelpFilled /></el-icon>
            <span>气象站</span>
          </div>
        </template>
        <div class="grid grid-rows-2 grid-cols-4 weather">
          <div class="min-w-32 flex px-3 py-2 justify-between items-center" v-for="item,index in weather" :key="index">
            <el-avatar shape="square" :src="icon1" />
            <div class="flex flex-col items-center justify-center">
              <div>{{item.monitoringType}}({{item.yyUnit}})</div>
              <div class="art-font text-lg">{{item.dataValue}}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="col-span-6">
        <template #header>
          <div class="flex items-center space-x-2">
            <el-icon><HelpFilled /></el-icon>
            <span>水质监测</span>
          </div>
        </template>
        <div class="flex justify-evenly items-center mt-15px" style="flex-wrap:wrap;">
          <div class="min-w-32 flex px-3 py-2 justify-between items-center " v-for='item,index in waterQuality' :key='index'>
            <el-avatar shape="square" :src="icon5" />
            <div class="flex flex-col items-center justify-center">
              <div>{{item.monitoringType}}({{item.yyUnit}})</div>
              <div class="art-font text-lg">{{item.dataValue}}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="col-span-6">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <el-icon><HelpFilled /></el-icon>
              <span>数据采集量情况</span>
            </div>
            <div class="flex items-center space-x-2">
              <el-date-picker
                v-model="collectConditionDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change='collectChange'
              />
            </div>
          </div>
        </template>
        <div id="collectConditionChart"></div>
      </el-card>
      <el-card class="col-span-6">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <el-icon><HelpFilled /></el-icon>
              <span>数据展示</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <el-radio-group v-model="dataShowRadio" @change='dataShowChange'>
                <el-radio-button label="气象站" value="气象站" />
                <el-radio-button label="水质监测" value="水质监测" />
                <el-radio-button label="土壤监测" value="土壤监测" />
                <el-radio-button label="虫情监测" value="虫情监测" />
              </el-radio-group>
              <el-select
              @change="selectCli"
              v-model="seletValue"
              :placeholder="options[0]"
              style="width: 100px;height: 31px;"
            >
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
              <el-date-picker
                @change="dataShowDateChange"
                v-model="dataShowDate"
                placeholder="请选择时间"
              />
            </div>
          </div>
        </template>
        <div id="dataShowChart"></div>
      </el-card>
      <el-card class="col-span-6">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <el-icon><HelpFilled /></el-icon>
              <span>数据采集量展示</span>
            </div>
            <div class="flex items-center space-x-2">
              <el-radio-group v-model="dataCollectRadio" @change="dataColleChange">
                <el-radio-button label="今日" value="今日" />
                <el-radio-button label="本月" value="本月" />
                <el-radio-button label="本年" value="本年" />
              </el-radio-group>
              <el-date-picker 
                @change="CollectDate"
                v-model="dataCollectDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </div>
          </div>
        </template>
        <div id="dataCollectChart"></div>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#dataShowChart, #dataCollectChart {
  height: 16rem;
}

#collectConditionChart {
  height: 12rem;
  flex-direction: column;
}
</style>