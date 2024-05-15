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

// 获取土壤墒情信息
const getSoilInfoList = async () => {
  const res = await EquipmentDataApi.environmentalDataHomePageC({})
  console.log("res", res);
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

// 数据采集量展示
const dataCollectRadio = ref()
const dataCollectDateRange = ref([])
onMounted(async () => {
  let res =await EquipmentDataApi.QueryCurrentDateCount({})
  console.log(res,'数据采集量展示')
  initChartStatic('dataCollectChart', generateBaseOptions({
    xAxis: {
      data: res.map(item=>item.collectionDate).reverse(),
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
        name: '',
        data: res.map(item=>item.totalValue).reverse(),
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
})

// 数据展示
const dataShowRadio = ref()
const dataShowDate = ref([])
// //今日本月今年
// const dataShowChange=(a)=>{
//   let day=new Date().getDay()
//   let month=new Date().getMonth()+1
//   let year=new Date().getFullYear()
//   if(a=='今日'){
//     console.log(new Date().getDay(),'shijian')
//     day=new Date().getDay()
//   }else if(a=='本月'){
//     console.log(new Date().getMonth(),'shijian')
//     month=new Date().getMonth()+1
//   }else{
//     console.log(new Date().getFullYear(),'shijian')
//     year=new Date().getFullYear()
//   }
//   dataShowDate.value=`${day}-${month}-${year}`
//   console.log(dataShowDate.value)
// }
const initDataShowChart=async ()=>{
  let res=await EquipmentDataApi.getDataPresentation({})
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
        name: res[0].collectionType,
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
onMounted( () => {
  initDataShowChart()
 
})

// 数据采集量情况
const collectConditionDateRange = ref([])
//数据采集量情况
onMounted( async() => {
  let res=await EquipmentDataApi.getPieDataList({})
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
        name: '',
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
        <div class="flex justify-evenly items-center">
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon1" />
            <div class="flex flex-col items-center justify-center">
              <div>温度(℃)</div>
              <div class="art-font text-lg">32</div>
            </div>
          </div>

          <el-divider direction="vertical" />
          <div class="flex flex-col items-center">
            <div>湿度(%)</div>
            <div class="art-font text-lg">60</div>
          </div>
          <div class="flex flex-col items-center">
            <div>EC值</div>
            <div class="art-font text-lg">0.5</div>
          </div>
          <div class="flex flex-col items-center">
            <div>PH值</div>
            <div class="art-font text-lg">6.5</div>
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
        <div class="flex justify-evenly items-center">
          <div class="flex px-1 py-2 justify-between items-center" v-for="item,index in infestation" :key='index'>
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
        <div class="flex justify-evenly items-center weather" style='flex-wrap: wrap;'>
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
                <el-radio-button label="今日" value="今日" />
                <el-radio-button label="本月" value="本月" />
                <el-radio-button label="本年" value="本年" />
              </el-radio-group>
              <el-date-picker
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
              <el-radio-group v-model="dataCollectRadio">
                <el-radio-button label="今日" value="今日" />
                <el-radio-button label="本月" value="本月" />
                <el-radio-button label="本年" value="本年" />
              </el-radio-group>
              <el-date-picker
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
}
</style>