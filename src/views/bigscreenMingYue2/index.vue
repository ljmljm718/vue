<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper flex items-center justify-around color-[#fff]">
        <div class="top-card-wrapper">
          <div class="actived2">
            <div class="value-card" @click="router.push('/bigscreenMYJD')">基地导览</div>
          </div>
          <div class="actived2">
            <div class="value-card"  @click="router.push('/bigscreenMYZH')">智慧种植</div>
          </div>
          <div class="active2">
            <div class="value-card">风险预警</div>
          </div>
        </div>
        <BackOrHome/> 
      </div>
      <div class="linear-font-title header-title-wrapper"> 稻鱼鸭产业可视化数字驾驶舱</div>
      <div class="header-right-part-wrapper">
        <BigScreenTime />
      </div>
    </div>
    <div class="content-main-wrapper">
      <div class="content-foot">
        <div class="foot-left">
          <div class='box-title' style="cursor: pointer;" @click="router.push('/internetMonitor/warn/agri-warning-record')">预警分布</div>
          <div id="chart1"></div>
        </div>
        <div class="foot-main">
          <div class='box-title' style="cursor: pointer;" @click="router.push('/internetMonitor/deviceData/equipment-data?collectionType=虫情监测')">虫害数量</div>
          <div id="chart2"></div>
        </div>
        <div class='foot-right'>
          <div class='box-title' style="cursor: pointer;" @click="router.push('/farm_work/farmManage/farm-plan')">指挥调度</div>
          <div class="w-full h-80px color-[#c1c1c1] flex items-center justify-evenly">
            <div style="cursor:pointer;" @click="tabAgriculture(item.id)" v-for="item,index in ListAll" :key='index'>
              <div :class="['right-icon','top-'+(index+1)]"></div>
              <div class="mt-5px">{{item.defineName}}</div>
            </div>
          </div>
          <div class="table-wrapper2">
            <div class="table-header-row2">
              <div
                class="table-header-cell2"
                v-for="(column, index) in leftArr2.tableColumns1"
                :style="`width: ${column.width};`"
                :key="index"
                >{{ column.label }}</div
              >
            </div>
            <div
              class="table-data-row2"
              v-for="(item, index) in leftArr2.tableData1"
              :key="index"
            >
              <div
                class="table-data-cell2"
                v-for="(column, inde) in leftArr2.tableColumns1"
                :key="inde"
                :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                >{{ item[column.key] }}</div
              >
              <div
              
                class="table-data-cell2"
                @click="goCreate(item)"
                style="width: 15%;margin-left: -80px;color:red;cursor: pointer; font-size:12px;text-align:center;"
                >去处理</div>

            </div>
              
          </div>
        </div>
      </div>
      <div class="content-top">
        <div class="top-left">
          <div class="box-title" style="cursor: pointer;" @click="router.push('/internetMonitor/warn/agri-warning-record')">预警信息</div>
          <div class="table-wrapper">
            <div class="table-header-row">
              <div
                class="table-header-cell"
                v-for="(column, index) in leftArr.tableColumns1"
                :style="`width: ${column.width};`"
                :key="index"
                >{{ column.label }}</div
              >
            </div>
            <div
              class="table-data-row"
              v-for="(item, index) in leftArr.tableData1"
              :key="index"
            >
              <div
                class="table-data-cell"
                v-for="(column, inde) in leftArr.tableColumns1"
                :key="inde"
                :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                >{{ item[column.key] }}</div>
            </div>
          </div>
        </div>
        <div class="top-right ">
          <div class="box-title" style="cursor: pointer;" @click="router.push('/internetMonitor/warn/agri-warning-record')">报警信息处理情况</div>
          <div class="top-right-ietm p-[15px] flex">
            <div class="w-20% h-full mr-[20px] flex" style="flex-direction: column;" >
              <div v-for='item,index in warnIngList' :key='index' class='mb-20px'>
              <div class="w-100% flex justify-around" v-show="item.warnStatus==0">未处理 <span>{{item.num}}</span> </div>
              <div class="w-100% flex justify-around" v-show="item.warnStatus==1">已处理 <span>{{item.num}}</span> </div>
              <div class="w-100% flex justify-around" v-show="item.warnStatus==2">已忽略 <span>{{item.num}}</span> </div>
            </div>
            </div>
            <div class="w-79% h-full p-[15px]" style="box-sizing: border-box;">
              <div v-for="item,index in pageList" :key='index' class="flex mb-1.5rem justify-evenly items-center top-right-item">
                <div class="w-42%" style="font-size:14px;">{{item.warnTitle}},{{item.warnInfo}}</div>
                <div class="w-35%">{{ new Date().toLocaleString(item.warnTime)  }}</div>
                <div class="w-10% mr-20px ml-20px" style="cursor: pointer;" @click="router.push(`/internetMonitor/warn/agri-warning-record?id=${item.id}&status=2`)">忽略</div>
                <div class="w-13%" style="cursor: pointer;" @click="router.push(`/internetMonitor/warn/agri-warning-record?id=${item.id}`)">去处理</div>
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
  fulingWarningDistr,
  getPestLevelChart,
  fulingWarningInfo,
  listAll,
  warningNum,
  page,
  pageW
} from '@/api/bigscreenMingYue'
import BackOrHome from '@/utils/bigscreenTool/backOrHome.vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import { useRouter } from 'vue-router'
let router = useRouter()

let leftArr = reactive<Object>({
  tableColumns1: [
    {
      key: 'warnInfo',
      label: '预警信息',
      width: '35%'
    },
    {
      key: 'warnLocation',
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
  tableData1: []
})
const initChart1= async ()=> {
  let res= await fulingWarningDistr()
  let data=[]
  res.forEach(item=>{
    data.push({
      name:item.warnType,
      value:item.warnRatio
    })
  })
  console.log(res,'预警分布')
      initChartStatic(
        "chart1",
        generatePieOptions({
          legend: {
            show: true,
            top: "center",
            left: "right",
            orient:'vertical',
          },
          color: ["#a5a5a5", "#ed7d31", "#5b9bd5", ],
          series: [
            {
              nam: "预警分布",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data,
              label: {
                // formatter: "{c|{c}},{d|{d}%}",
                formatter: "{c},{d}%",
                rich: {
                  c: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                  d: {
                    color: "#c1c1c1",
                    fontSize: 10,
                  },
                },
              },
            },
          ],
        })
      );
}
let leftArr2 = reactive<Object>({
  tableColumns1: [
    {
      key: 'parkName',
      label: '基地',
      width: '30%'
    },
    {
      key: 'plotName',
      label: '地块',
      width: '10%'
    },
    {
      key: 'startTime',
      label: '上次操作时间',
      width: '30%'
    },
    {
      key: 'planName',
      label: '预警',
      width: '10%'
    },
    {
      key: 'btn',
      label: '操作',
      width: '15%'
    }
  ],
  tableData1: [
  ]
})
const initChart2= async ()=>{
  let res=await getPestLevelChart()
  console.log(res,'虫害数量')
      initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data:res.abscissaList,
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
          color: ["#ed7d31","#a9d18e","#d9d9d9","#ff5757"],
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
          {
            type:'value',
            min:0,
            interval:200,
            max:Math.floor(Math.max(...res.sumList))
          }
        ],
          series: [
            {
              name: '金龟子',
              data:res.jinList,
              type: "bar",
              smooth: false,
            },
            {
              name: '蟋蟀',
              data:res.xiList,
              type: "bar",
              smooth: false,
            },
            {
              name: '蛾',
              data: res.eList,
              type: "bar",
              smooth: false,
            },
            {
              name: '总数',
              data: res.sumList,
              type: "line",
              smooth: true,
              symbol: "none",
              yAxisIndex:1,
            },
          ],
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
const getfulingWarningInfo=()=>{
  fulingWarningInfo().then(res=>{
    res.forEach(item=>{
      if(item.warnStatus=='0') item.warnStatus='未处理'
      else if(item.warnStatus=='1') item.warnStatus='已处理'
       item.warnTime= new Date().toLocaleString(item.warnTime)
    })
    console.log(res,'预警信息')
    leftArr.tableData1=res
  })
}
getfulingWarningInfo()
let ListAll=ref([])
const getListAll=()=>{
  listAll().then(res=>{
    console.log(res,'数据')
    ListAll.value=res
    getpageW(res[0].id)
  })
}
getListAll()  
let warnIngList=ref([])
const getwarningNum=()=>{
  warningNum().then(res=>{
    console.log(res,'预警统计')
    warnIngList.value=res
  })
}
getwarningNum()
let pageList=ref([])
const getPage=()=>{
  page().then(res=>{
    console.log(res,'未处理信息')
    pageList.value=res.list
  })
}
getPage()
const getpageW=(id:string)=>{
  pageW({farmDefineType:id,pageNo:1,pageSize:3}).then(res=>{
    console.log(res,'农事计划')
    leftArr2.tableData1=res.list
    leftArr2.tableData1.forEach(item=>{
      item['btn']
      if(item.startTime) item.startTime=new Date().toLocaleString(item.startTime)
    })

  })
}
const tabAgriculture=(id)=>{
  getpageW(id)
}
const goCreate=(val)=>{
  router.push({
    path:'/farm_work/farmManage/farm-record/CreateOrUpdate?type=create',
    query:{...val}
  })
  // router.push('/farm_work/farmManage/farm-record/CreateOrUpdate?type=create&obj='+val)
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
.box-title {
  color: #fff;
  width: 300px;
  height: 2rem;
  font-size: 1.2rem;
  line-height: 2rem;
  text-indent: 2rem;
  font-family: 'TitleFont';
  background-size: 100% 100%;
  background-image: url('./assets/box-title.png');
}
.content-main-wrapper {
  margin-top: 10px;
  padding: 0 10px !important;
  height: 90% !important;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: calc(50% - 15px) 50%;
  gap: 15px;
  .content-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    .top-left {
      .table-wrapper {
        width: 100%;
        height: calc(100% - 2rem);
        position: relative;
        overflow: auto;
        font-size: 0.9rem;
        .table-header-row {
          width: 100%;
          padding: 8px 0;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          background-color: #01121c;
          .table-header-cell {
            color: #6c9bff;
            text-align: center;
          }
        }
        .table-data-row {
          margin-top: 10px;
          width: 100%;
          height: 12%;
          background-size: 100% 100%;
          background-image: url(./assets/left4ItemBg.png);
          display: flex;
          align-items: center;
          padding: 8px 0;
          .table-data-cell {
            text-align: center;
          }
        }
      }
      .table-wrapper::-webkit-scrollbar {
        width: 0px;
      }
    }
    .top-right{
      box-sizing: border-box;
      color: #c1c1c1;
      .top-right-ietm{
        box-sizing: border-box;
        width:100%;
        height: calc( 100% - 2rem);
        background-size:100% 100%;
        .top-right-item{
          padding: 10px 15px;
          background-size: 100% 100%;
          background-image: url(./assets/top-rightItemBg.png)
        }
      }
    }
  }
  .content-foot {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    #chart1{
      width: 100%;
      height: calc(100% - 2rem);
    }
    #chart2{
      width: 100%;
      height: calc(100% - 2rem)
    }
    .foot-right{
      .right-icon{
        width: 2rem;
        height: 2rem;
        background-size: 100% 100%;
      }
      .table-wrapper2 {
        width: 100%;
        height: calc(100% - 6rem);
        position: relative;
        overflow: auto;
        font-size: 0.9rem;
        .table-header-row2 {
          width: 100%;
          padding: 8px 0;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          background-color: #01121c;
          .table-header-cell2 {
            color: #6c9bff;
            text-align: center;
          }
        }
        .table-data-row2 {
          margin-top: 10px;
          width: 100%;
          height: 12%;
          background-size: 100% 100%;
          background-image: url(./assets/footTabelBg.png);
          display: flex;
          align-items: center;
          padding: 8px 0;
          .table-data-cell2 {
            text-align: center;
          }
        }
      }
      .table-wrapper::-webkit-scrollbar {
        width: 0px;
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
@for $i from 1 through 6 {
  .top-#{$i} {
    background-image: url(./assets/top-Item#{$i}.png);
  }
}
</style>