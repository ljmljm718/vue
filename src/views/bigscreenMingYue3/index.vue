<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper flex items-center justify-around color-[#fff]">
        <div class="top-card-wrapper">
          <div class="actived2">
            <div class="value-card" @click="router.push('/bigscreenMYJD')">基地导览</div>
          </div>
          <div class="active2">
            <div class="value-card" >智慧种植</div>
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
    <div class="content-main-wrapper">
      <div class="left">
        <div>
          <div class="box-title">基础设施</div>
          <div class="box-item flex justify-evenly" style=" flex-direction: column;">
            <div class="flex justify-evenly items-center color-[#c1c1c1]">
              <div style='cursor: pointer;' @click="router.push('/asset/base/parkinfo')">示范基地</div>
              <div style='cursor: pointer;' @click="router.push('/asset/base/parkinfo')">{{selectCountObj?.parkSum}}亩</div>
              <div style='cursor: pointer;' @click="router.push('/asset/agriculturalResourcesManagement/duck-house-management')">鸭舍</div>
              <div style='cursor: pointer;' @click="router.push('/asset/agriculturalResourcesManagement/duck-house-management')">{{DuckSumObj?.duckCoopCount}}所</div>
            </div>
            <div class="flex justify-evenly items-center color-[#c1c1c1]">
              <div style='cursor: pointer;' @click="router.push('/asset/base/parkinfo')" >基地数量</div>
              <div style='cursor: pointer;' @click="router.push('/asset/base/parkinfo')" >{{selectCountObj?.parkCount}}</div>
              <div style='cursor: pointer;' @click="router.push('/asset/agriculturalResourcesManagement/duck-house-management')" >稻鸭</div>
              <div style='cursor: pointer;' @click="router.push('/asset/agriculturalResourcesManagement/duck-house-management')" >{{DuckSumObj?.riceDuckCount}}只</div>
            </div>
            <div class="flex justify-evenly items-center color-[#c1c1c1]">
              <div style='cursor: pointer;' @click="router.push('/asset/base/farmer-info')" >养殖农户</div>
              <div style='cursor: pointer;' @click="router.push('/asset/base/farmer-info')" >{{selectCountObj.farmerCount}}户</div>
              <div  >池塘</div>
              <div >{{frySumObj.pondCount}}</div>
              <div >稻鱼</div>
              <div  >{{frySumObj.fryCount}}尾</div>
            </div>
          </div>
        </div>
        <div>
          <div class="box-title" style="cursor:pointer" @click="router.push('/farm_work/grow-record')" >生长分析</div>
          <div class="box-item">
            <div id="chart1"></div>
          </div>
        </div>
        <div>
          <div class="box-title"  style="cursor:pointer" @click="router.push('/farm_work/harvest-management')" >产量分析</div>
          <div class="box-item">
            <div id="chart2"></div>
          </div>
        </div>
      </div>
      <div class="content-main-item middle-main-wrapper">
                <div class="main-top">
                  <div class="top-warper color-black" v-for="item,index in countSum" :key="index">
                    <div class="flex justify-evenly items-center h-full" style="cursor:pointer" @click="router.push('/internetMonitor/device/deviceView')" v-if="item.name=='设备总数'"><div>设备总数</div> <div>{{item.value}}</div></div>
                    <div class="flex justify-evenly items-center h-full" style="cursor:pointer" @click="router.push('/internetMonitor/device/deviceView')"  v-if="item.name=='在线设备'"><div>在线数量</div> <div>{{item.value}}</div></div>
                    <div class="flex justify-evenly items-center h-full" style="cursor:pointer" @click="router.push('/internetMonitor/device/deviceView')"  v-if="item.name=='离线设备'"><div>离线数量</div> <div>{{item.value}}</div></div>
                    <div class="flex justify-evenly items-center h-full" v-if="item.name=='报警设备'"><div>故障数量</div> <div>{{item.value}}</div></div>
                  </div>
                </div>
                <div class="middle-main-item">
                </div>
                <div class="middle-main-footer ">
                  <div class="box-title" style="cursor: pointer;" @click="router.push('/pcg/production/village-product')">特色产品</div>
                  <el-carousel indicator-position="outside" class="box-item w-full h-full">
                    <el-carousel-item v-for="item,index in mainFootList" :key="index" class="flex w-full p-15px" style="box-sizing:border-box;">
                    <div class="flex ">
                      <div class='w-48% h-100% flex justify-evenly'>
                        <img :src="item.photo" class="w-65% h-150px" alt=""/>
                        <div class="w-33% h-70% flex justify-evenly" style="flex-direction:column">
                          <div>产品名称：{{item.parkDetail}}</div> 
                          <div>产品批次：{{item.specifications}}</div>
                          <div>产品年份: {{item.years}}</div>
                        </div>
                      </div>
                      <div class='w-48% h-100% flex justify-evenly'>
                        <img :src="item.photo" class="w-65% h-150px" alt=""/>
                        <div class="w-33% h-70% flex justify-evenly" style="flex-direction:column">
                          <div>产品名称：{{item.parkDetail}}</div>
                          <div>产品批次：{{item.specifications}}</div>
                          <div>产品年份: {{item.years}}</div>
                        </div>
                      </div>
                    </div>
                      
                    </el-carousel-item>
                  </el-carousel>
                </div>
            </div>
      <div class="right">
        <div>
          <div class="box-title" style="cursor:pointer" @click="router.push('/internetMonitor/device/overview')">物联网设备</div>
          <div class="box-item">
            <div class="w-full flex justify-evenly items-center color-[#fff]"><div>总数</div><div class="color-[#4584c0]">{{countTotal}}<span>台</span></div></div>
            <div class="grid gap-10px w-full color-[#c1c1c1]" style="height: calc(100% - 20px); grid-template-columns: 50% calc(50% - 10px); grid-template-rows: 43% calc(57% - 30px);">
              <div>
                <div class="flex justify-between mt-10px"><div>生长监控</div> <div class="color-[#4584c0]">{{CountSumOrderByType.growthMonitoring.totality}}</div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线 {{CountSumOrderByType.growthMonitoring.online}}</div> <div>离线 {{CountSumOrderByType.growthMonitoring.offline}}</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-80% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mt-10px"><div>土壤墒情</div> <div class="color-[#4584c0]">{{CountSumOrderByType.soil.totality}}</div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线 {{CountSumOrderByType.soil.online}}</div> <div>离线 {{CountSumOrderByType.soil.offline}}</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-87% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mt-10px"><div>气象站</div> <div class="color-[#4584c0]">{{CountSumOrderByType.atmosphere.totality}}</div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线 {{CountSumOrderByType.atmosphere.online}}</div> <div>离线 {{CountSumOrderByType.atmosphere.offline}}</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-100% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mt-10px"><div>水质监测</div> <div class="color-[#4584c0]">{{CountSumOrderByType.waterQuality.totality}}</div></div>
                <div >
                  <div class="flex justify-around mt-10px" style="font-size: 14px;"><div>在线 {{CountSumOrderByType.waterQuality.online}}</div> <div>离线 {{CountSumOrderByType.waterQuality.offline}}</div></div>
                  <div class="mt-10px w-full h-15px bg-[#c1c1c1]" style="border-radius: 10px;border: nono"><div class="w-33% h-full bg-[#4584c0]" style="border-radius: 10px;border: nono"></div></div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <div>
          <div class="box-title relative">实时监测
            <div class="absolute top-0 right-5px">
              <select name="" @change="baseChange" id="" style="background-color: transparent !important; color:#fff;" >
                <option :value="item.id" v-for="item,index in baseList" :key="index">{{item.name}}</option>
              </select>
              <select name="" id="" @change="plotChange" style="background-color: transparent !important; color:#fff;margin-left: 8px;margin-right: 8px;" >
                <option :value="item.id" v-for="item,index in plotList" :key="index">{{item.name}}</option>
              </select>
            </div>
          </div>
          <div class="box-item " style="overflow-y: auto;">
            <div class="right2-warper w-full h-30% mb-10px  p-10px" v-for="item,index in homePageList" :key="index">
              <div class="warper-top w-100px color-[#fff]" @click="router.push(`/internetMonitor/deviceData/equipment-data?collectionType=${item.name}`)" style="cursor:pointer;text-align: center;font-family: 'TitleFont';">{{item.name}}</div>
              <div class="right2-item flex " style="height: calc(100% - 40px);font-size:14px; color: #c1c1c1;margin-top: 15px;">
                <div v-for="itm,inde in item.list" :key="inde" class="warper-item flex items-center justify-evenly mr-8px"><div>{{itm.monitoringType}}</div> <div >{{itm.dataValue}}<span style="font-size:13px;">{{itm.yyUnit}}</span> </div> </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import { ref, reactive, onMounted } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'

import {
  getPondCountFrySum,
  getLineChar,
  getCountRiceDuckSum,
  selectCount,
  selectHarvest,
  getEquipmentCountSum,
  getEquipmentCountSumOrderByType,
  maiFootPage,
  basePage,
  plotPage,
  environmentalDataHomePageB,
  environmentalDataHomePageC,
  environmentalDataHomePageA,
  waterQualityData
} from '@/api/bigscreenMingYue'
import { useRouter } from 'vue-router'
import { constant } from 'lodash'
let router = useRouter()

let leftArr = reactive<Object>({
  tableColumns1: [
    {
      key: 'warnInfo',
      label: '预警信息',
      width: '35%'
    },
    {
      key: 'warnAdress',
      label: '预警地点',
      width: '10%'
    },
    {
      key: 'warnTime',
      label: '报警时间',
      width: '30%'
    },
    {
      key: 'warnType',
      label: '预警类型',
      width: '10%'
    },
    {
      key: 'warnStatus',
      label: '预警状态',
      width: '10%'
    }
  ],
  tableData1: [
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
    {
      warnInfo: '1号基地土壤湿度报警',
      warnAdress: '1号基地',
      warnTime: '2024/05/23 11:46:00',
      warnType: '土壤',
      warnStatus: '未处理'
    },
  ]
})
const initChart1 = async () => {
  let res=await getLineChar({cropCode:'1787727824907661312'})
  console.log(res,'生长趋势')
  initChartStatic(
    'chart1',
    generateBaseOptions({
      xAxis: {
        data:res.xValue,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#ffa773', '#36e1d9'],
      yAxis: {
        name:res.measureUnit[0],
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#fff', //网格线颜色
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
          name: '稻米',
          data: res.yValue,
          type: 'line',
          smooth: true,
          symbol:'none'
        },
      ],
      grid: {
        left: '8%',
        right: '6%',
        top: '13%',
        bottom: '15%'
      }
    })
  )
}
const initChart2= async ()=>{
  const res = await selectHarvest()
            console.log("产量分析", res);
            let xAxis = res.map(item => (item.time))
            xAxis = [...new Set([...xAxis])].sort().reverse()
            console.log("xAxis", xAxis);
            let types = res.map(item => (item.variety))
            types = [...new Set([...types])]
            const findValByTimeAndvariety = (item) => {
                let _res = '0'
                res.forEach(ele => {
                    if (
                        item.time === ele.time
                        &&
                        item.variety === ele.variety
                    ) _res = parseFloat(ele.harvest).toFixed(2)
                })
                return _res
            }
            const series = types.map(item => {
                const nameMap = {
                    "duck": '稻田鸭',
                    "fish": '稻田鱼',
                    "rice": "稻谷"
                }
                return {
                    name: nameMap[item],
                    data: xAxis.map(x => {
                        return findValByTimeAndvariety({
                            time: x,
                            variety: item
                        })
                    }),
                    type: "bar",
                    smooth: false,
                    label: {
                        show: true, //开启显示
                        position: 'top', //在上方显示
                        textStyle: {
                            //数值样式
                            color: '#eee',
                            fontSize: 10
                        }
                    },
                }
            })
  initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data:xAxis,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
          },
          legend: { 
            show: true, 
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
          color: ["#ed7d31","#a9d18e","#d9d9d9"],
          yAxis: [
            {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#fff", //网格线颜色
                width: 1, //网格线的加粗程度
                type: "dashed", //网格线类型
              },
            },
            splitArea: {
              //网格区域
              show: false, //是否显示
            },
          },  
        ],
          series,
          grid: {
            left: "10%",
            right: "10%",
            top: "15%",
            bottom: "15%",
          },
        })
      );
    
}
onMounted(()=>{
  initChart1()
  initChart2()
})
let frySumObj=ref({})
let DuckSumObj=ref({})
let selectCountObj=ref({})
const getGetPondCountFrySum=()=>{
  getPondCountFrySum().then(res=>{
    console.log(res,'基础设施')
    frySumObj.value=res
  })
  getCountRiceDuckSum().then(res=>{
    console.log(res,'基础设施2')
    DuckSumObj.value=res
  })
  selectCount().then(res=>{
    console.log(res,'jichusheshi3')
    selectCountObj.value=res
  })
} 
getGetPondCountFrySum()
let countSum=ref([])
const getGetEquipmentCountSum=()=>{
  getEquipmentCountSum().then(res=>{
    console.log(res,'中间顶部')
    countSum.value=Object.keys(res).map(item=>{
      return { 
        name:item,
        value:res[item]
      }
    })
    countSum.value=countSum.value.filter(item=>{
      if(item.name=='设备总数'||item.name=='在线设备'||item.name=='离线设备'|| item.name=='报警设备') return item
    })
    console.log(countSum.value,'shuju')
  })
}
getGetEquipmentCountSum()
let CountSumOrderByType=ref({})
let countTotal=ref('')
const getGetEquipmentCountSumOrderByType=()=>{
  getEquipmentCountSumOrderByType().then(res=>{
    console.log(res,'物联网设备')
    CountSumOrderByType.value=res
    countTotal.value+=(res.atmosphere.totality+res.growthMonitoring.totality+res.soil.totality+res.waterQuality.totality)
  })
}
getGetEquipmentCountSumOrderByType()
let mainFootList=ref([])
const getMaiFootPage=()=>{
  maiFootPage().then(res=>{
    console.log(res,'中间下')
    mainFootList.value=res.list
  })
}
getMaiFootPage()
let baseList=ref([])
let plotList=ref([])
let baseParkId=ref('')
let plotParkId=ref('')
const getBasePage=()=>{
  basePage({pageReqVO:{}}).then(res=>{
    console.log(res,'获取基地')
    baseList.value=res.list
    baseParkId.value=res.list[0].id
    getPlotPage(res.list[0].id)

  })
}
getBasePage()
const getPlotPage=(id)=>{
  plotPage({pageReqVO:{},parkId:id}).then(res=>{
    console.log(res,'获取地块')
    plotList.value=res.list
    plotParkId.value=res.list[0].id
    getenvironmentalDataHomePageB(baseParkId.value,plotParkId.value)
  })
}
//实时数据
let homePageList=ref([])
const getenvironmentalDataHomePageB=(belongPark,belongPlot)=>{
  homePageList.value=[]
  //虫情
  environmentalDataHomePageB({belongPark,belongPlot}).then(res=>{
    console.log(res,'shishishuju')
    if(res.length){
    homePageList.value.push({
      name:'虫情监测',
      list:res
    })
  }
  })
  //土壤
  environmentalDataHomePageC({belongPark,belongPlot}).then(res=>{
    console.log(res,'shishishuju')
    if(res.length){
    homePageList.value.push({
      name:'土壤环境',
      list:res
    })
  }
  })
  //气象
  environmentalDataHomePageA({belongPark,belongPlot}).then(res=>{
    console.log(res,'shishishuju')
    if(res.length){
    homePageList.value.push({
      name:'气象监测',
      list:res
    })
  }
  })
  //水质
  waterQualityData({belongPark,belongPlot}).then(res=>{
    console.log(res,'shishishuju')
    if(res.length){
    homePageList.value.push({
      name:'水质监测',
      list:res
    })
  }
  })
  console.log(homePageList.value,'实时数据')
}
const baseChange=(e)=>{
 console.log(e.target.value,'基地id')
 baseParkId.value=e.target.value
}
const plotChange=(e)=>{
  plotParkId.value=e.target.value
  getenvironmentalDataHomePageB(baseParkId.value,plotParkId.value)
}
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);
.bigscreen2-wrappper {
  width: 100vw;
  height: 100vh;
  background-image: url('./assets/bg.png');
  background-size: 100% 100%;
  .header-main-wrapper {
    background-size: 100% 100%;
    background-image: url('./assets/headerBg.png');
  }
}
select{
  option{
    color: #000;
  }
}
.box-title {
  color: #fff;
  width: 100%;
  height: 2rem;
  font-size: 1.2rem;
  line-height: 2rem;
  text-indent: 2rem;
  font-family: 'TitleFont';
  background-size: 100% 100%;
  background-image: url('./assets/title.png');
}
.content-main-wrapper {
  margin-top: 10px;
  padding: 0 15px !important;
  height: 90% !important;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 25% calc(50% - 30px) 25%;
  gap: 15px;
  .left{
    z-index: 9999;
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 30% 30% calc(40% - 30px);
    gap: 15px;
    .box-item{
      width: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      height: calc(100% - 2rem);
      background-size: 100% 100%;
      background-image: url(./assets/cardBg.png);
      #chart1,#chart2{
        width: 100%;
        height: 100%;
      }
    }
  }
  .right{
    z-index: 9999;
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 30% calc(70% - 15px);
    gap: 15px;
    .box-item{
      width: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      height: calc(100% - 2rem);
      background-size: 100% 100%;
      background-image: url(./assets/cardBg.png);
      .right2-warper{
        box-sizing: border-box;
        background-size: 100% 100%;
        background-image: url(./assets/right2Bg.png);
        .warper-top{
          background-size: 100% 100%;
          background-image: url(./assets/warperTop.png);
        }
        .right2-item{
          display: flex;
          flex-wrap: wrap;
          overflow-y:scrolll;
        }
        .right2-item::-webkit-scrollbar{
          width: 0;
        }
        .warper-item{
          width: 47%;
          height: 20px;
          background-size: 100% 100%;
          background-image: url(./assets/wareprBg.png);
        }
      }
    
    }
    .box-item::-webkit-scrollbar{
      width: 0;
    }
  }
  .middle-main-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    .main-top{
      z-index: 9999;
      position: absolute;
      top: 20px;
      width: 95%;
      height: 100px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .top-warper{
        width: 23%;
        padding: 15px;
        box-sizing: border-box;
        height: 100%;
        background-size: 100% 100%;
        background-image: url(./assets/main-topBg.png);
      }
      
    }
    .middle-main-item{
      position: absolute;
      width: 1200px;
      height: 750px;
      left: calc(50% - 600px);
      top: calc(50% - 450px);
      background-size: 100% 100%;
      position: relative;
      background-image: url(./assets/mainBg.png);
    }
    .middle-main-footer{
        position: absolute;
        bottom: 2%;
        width: 97%;
        height: 24%;
        .box-item{
          width: 100%;
          padding: 10px 15px;
          box-sizing: border-box;
          height: calc(100% - 2rem);
          background-size: 100% 100%;
          background-image: url(./assets/cardBg.png);
        }
    }
  }
}
.top-card-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  .active2 {
    width: 100%;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
    background-size: 100% 100%;
    background-image: url('./assets/active.png');
    .value-card {
      font-size: 1rem;
      font-family: 'TitleFont';
    }
  }
  .actived2 {
    width: 100%;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
    background-size: 100% 100%;
    background-image: url('./assets/actived.png');
    .value-card {
      font-size: 1rem;
      font-family: 'TitleFont';
    }
  }
}
.inner-border {
    border: 1px solid #449ce9;
}
.active {
  width: 5rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  background-color: #012162;
}
.actived {
  width: 5rem;
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