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
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
//存放基地信息
const selectBase = ref([])
const getBaseDataList = async () => {
  const selectBaseList = await ParkInfoApi.getParkInfoPage({});
  console.log(selectBaseList.list,'selectBaseList.list')
  selectBase.value = selectBaseList.list
  console.log(selectBase,"-=---=")
}
getBaseDataList()
const soilList=ref([])
// 获取土壤墒情信息
const getSoilInfoList = async (belongPark?:any,belongPlot?:any) => {
  const res = await EquipmentDataApi.environmentalDataHomePageC({belongPark,belongPlot})
  console.log("土壤墒情", res);
  soilList.value=res
}
getSoilInfoList()
//获取虫情信息
let infestation=ref([])
const getEnvironmentalDataHomePageB=async (belongPark?:any,belongPlot?:any)=>{
   infestation.value= await EquipmentDataApi.environmentalDataHomePageB({belongPark,belongPlot})
  console.log(infestation.value,'虫情信息')
}
getEnvironmentalDataHomePageB()
//获取气象信息
let weather=ref([])
const getEnvironmentalDataHomePageA=async(belongPark?:any,belongPlot?:any)=>{
  weather.value= await EquipmentDataApi.environmentalDataHomePageA({belongPark,belongPlot})
  console.log(weather.value,'气象信息')
}
getEnvironmentalDataHomePageA()
//获取水质信息
let waterQuality=ref([])
const getWaterQualityData=async (belongPark?:any,belongPlot?:any)=>{
  waterQuality.value=await EquipmentDataApi.waterQualityData({belongPark,belongPlot})
  console.log(waterQuality.value,'水质信息')
}
getWaterQualityData()
const queryParams = ref({
  name: '',
  plot: ''
})
const handleQuery = async () => {
  getSoilInfoList(queryParams.value.name,queryParams.value.plot)
  getEnvironmentalDataHomePageB(queryParams.value.name,queryParams.value.plot)
  getEnvironmentalDataHomePageA(queryParams.value.name,queryParams.value.plot)
  getWaterQualityData(queryParams.value.name,queryParams.value.plot)
}
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
  let month=data.getMonth()+1>9?data.getMonth()+1:'0'+(data.getMonth()+1)
  let month2=data2.getMonth()+1>9?data2.getMonth()+1:'0'+(data2.getMonth()+1)
  let day=data.getDate()>9?data.getDate():'0'+data.getDate()
  let day2=data2.getDate()>9?data2.getDate():'0'+data2.getDate()
  initDataCollectChart('appoint',`${year}-${month}-${day}`,`${year2}-${month2}-${day2}`)
}

// 数据采集量展示
const dataCollectRadio = ref('本年')
const dataCollectDateRange = ref([])
const CollectDate=(e)=>{
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
const selectEquipmentType=ref([])
//获取气象站等数据
const getTopList= async ()=>{
  const dataId = await DeviceCategoryApi.getDeviceCategoryList({categoryName:'监测设备'})
  // console.log(dataId,"dataId");
  selectEquipmentType.value = await DeviceCategoryApi.getDeviceCategoryList({parentId : dataId[0].id}) 
  dataShowRadio.value= selectEquipmentType.value[0].categoryName
}
getTopList()
// //获取下拉
const dataShowChange= async(val)=>{
  let res=await EquipmentDataApi.QueryCollectionType({monitoringType:val})
  options.value=res
  dataShowRadio.value=val
  console.log(res,'实时数据下拉')
  initDataShowChart(dataShowRadio.value,res[0],dataShowDate.value)
}
dataShowChange(dataShowRadio.value)
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
  let data=res.map(item=>item.dateTime)
  let xAxisData=[]
  data.forEach(item=>{
    xAxisData.push(item.slice(11))
  })
  console.log(xAxisData,'data数据展示')
  initChartStatic('dataShowChart', generateBaseOptions({
    xAxis: {
      data:xAxisData,
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
  const res = await EquipmentDataApi.getPieDataList({dataStarTime,dataEndTime})
  console.log('数据采集量情况', res)
  const data:Array<any> = []
  res.forEach(item => {
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
          formatter: '{c},{d}%',
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

const getIconFrame = (text:string) => {
  const _iconMap = {
    "温度": "icon-1",
    "磷": "icon-2",
    "氮": "icon-3",
    "钾": "icon-4",
    "PH": "icon-5",
    "湿度": "icon-6",
    "EC": "icon-7",
    "虫害": "icon-8",
    "光": "icon-9",
    "风": "icon-10",
    "雨量": "icon-12",
    "水位": "icon-13",
    "盐度": "icon-14",
    "亚硝酸盐": "icon-15",
    "浑浊": "icon-16",
    "量": "icon-11"
  }
  let res:string = 'icon-11'
  let flag:boolean = false
  Object.keys(_iconMap).forEach(item => {
    if (text.indexOf(item) !== -1 && !flag) {
      res = _iconMap[item]
      flag = true
    }
  })
  return res
}
const boo = ref(false)
let listPlot= ref([])
watch(
  () => queryParams.value.name,
  async (val) => {
    if (val != null && val != '' && val != undefined) {
      boo.value=true
      listPlot.value = await ParkInfoApi.getParkDetailListByParkId(queryParams.value.name);
    }
  }
)
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
              :value="item.id"
            />   
          </el-select>
        </el-form-item>
        <el-form-item :model="queryParams" label="地块名称" class="flex space-x-3">
          <el-input 
            v-if = !boo
            v-model="queryParams.plot"
            clearable
            placeholder="请输入地块名称"
            style="width: 240px;"
            @keyup.enter="handleQuery"
          />
          
          <el-select v-if="boo"
            v-model="queryParams.plot"
            placeholder="请选择基地名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          >  
            <el-option
              v-for="items in listPlot"  
              :key="items"
              :label="items.name"
              :value="items.id"
            />   
          </el-select>
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
      <el-card class="col-span-6">
        <template #header>
          <div class="flex items-center space-x-2">
            <el-icon><HelpFilled /></el-icon>
            <span>土壤墒情</span>
          </div>
        </template>
        <div class="extra-grid-css grid xl:grid-cols-2 2xl:grid-cols-3 gap-1 xl:gap-2">
          <div
            class="min-w-32 flex px-3 py-2 justify-between items-center rounded-lg"
            v-for="item,index in soilList"
            :key="index"
            style="border: 1px solid #888888;"
          >
            <i alt="" :class="`w-2rem h-2rem ${getIconFrame(item.monitoringType)}`"></i>
            <div class="flex flex-col items-end justify-center">
              <div style="font-size: 14px;">{{item.monitoringType}}({{item.yyUnit}})</div>
              <div class="art-font text-lg">{{item.dataValue}}</div>
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
        <div class="grid xl:grid-cols-3 2xl:grid-cols-4 gap-1 xl:gap-2">
          <div
            class="min-w-32 flex px-3 py-2 justify-between items-center rounded-lg"
            v-for="item,index in weather"
            :key="index"
            style="border: 1px solid #888888;"
          >
            <i alt="" :class="`w-2rem h-2rem ${getIconFrame(item.monitoringType)}`"></i>
            <div class="flex flex-col items-end justify-center">
              <div style="font-size: 14px;">{{item.monitoringType}}({{item.yyUnit}})</div>
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
        <div class="grid xl:grid-cols-3 2xl:grid-cols-4 gap-1 xl:gap-2">
          <div
            class="min-w-32 flex px-3 py-2 justify-between items-center rounded-lg"
            v-for="item,index in waterQuality"
            :key="index"
            style="border: 1px solid #888888;"
          >
            <i alt="" :class="`w-2rem h-2rem ${getIconFrame(item.monitoringType)}`"></i>
            <div class="flex flex-col items-end justify-center">
              <div style="font-size: 14px;">{{item.monitoringType}}({{item.yyUnit}})</div>
              <div class="art-font text-lg">{{item.dataValue}}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="col-span-6">
        <template #header>
          <div class="flex items-center space-x-2">
            <el-icon><HelpFilled /></el-icon>
            <span>虫情监测</span>
          </div>
        </template>
        <div class="grid xl:grid-cols-3 2xl:grid-cols-4 gap-1 xl:gap-2">
          <div
            class="min-w-32 flex px-3 py-2 justify-between items-center rounded-lg"
            v-for="item,index in infestation"
            :key="index"
            style="border: 1px solid #888888;"
          >
            <i alt="" :class="`w-2rem h-2rem ${getIconFrame(item.monitoringType)}`"></i>
            <div class="flex flex-col items-end justify-center">
              <div style="font-size: 14px;">{{item.monitoringType}}({{item.yyUnit}})</div>
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
              <span>数据展示</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <el-radio-group v-model="dataShowRadio" @change='dataShowChange'>
                <el-radio-button v-for="item,index in  selectEquipmentType" :key="index" :label="item.categoryName" :value="item.categoryName" />
              </el-radio-group>
              <el-select
                @change="selectCli"
                v-model="seletValue"
                :placeholder="options[0]"
                style="width: 100px;"
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
     
      <el-card class="col-span-12">
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
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                value-format="YYYY-MM-DD HH:mm:ss"
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

@media (max-width: 1722px) {
  .extra-grid-css {
    grid-template-columns: 1fr 1fr !important;
  }
}

.extra-grid-css {
  grid-template-columns: 1fr 1fr 1fr;
}

@for $i from 1 through 16 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% 100%;
  }
}

</style>