<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="linear-font-title header-title-wrapper">石柱县双龙村鲁渝协作乡村振兴服务大屏</div>
      <div class="header-right-part-wrapper"></div>
    </div>
    <div class="content-main-wrapper">
        <div class="left">
          <div class="left1">
            <div class="box-title">农业资源</div>
            <div class="left1-item">
              <div class="left1-warper">
                <div style="margin-top: -30px;">柑橘园区</div>
                <div style="margin-top:10px;">{{ sources.park }}</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">种植地块</div>
                <div style="margin-top:10px;">{{ sources.plot }}</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">种植面积</div>
                <div style="margin-top:10px;">{{sources.area}}万亩</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">作物品种</div>
                <div style="margin-top:10px;">{{ sources.crop }}</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">农户数量</div>
                <div style="margin-top:10px;">{{sources.farmer}}</div>
              </div>
              <div class="left1-warper">
                <div style="margin-top: -30px;">公司数量</div>
                <div style="margin-top:10px;">{{sources.company}}</div>
              </div>
            </div>
          </div>
          <div class="left2">
            <div class="box-title">种植园区 <span style="margin-left: 40px;color: #ffce54;font-size: 20px;">{{ total }}</span> </div>
            <div class="left2-item">
              <div class="left2-warper" v-for="item,index in parkList" :key="index">
                <div style="flex: 1;font-size: 14px; font-weight: 600; ">{{ item.parkName }}</div>
                <div style="font-size: 14px; color: #c1c1c1;">地块：{{ item.plotCout }}</div>
                <div style="font-size: 14px; color: #c1c1c1;margin: 0 10px;">面积：{{ item.area }}</div>
                <div style="font-size: 14px; color: #c1c1c1;">柑橘品种：{{ item.crop }}</div>
              </div>
            </div>
          </div>
          <div class="left3">
            <div class="box-title">种植分布(亩)</div>
            <div class="left3-item">
              <div id="chart1"></div>
            </div>
          </div>
        </div>
        <div class="main">
          <div class="middle-main-item">
              <div class="dian" style="left:27%;bottom:33%;width: 23rem;height: 5rem;" @click="dianCli(0)">
                <div class="message" ref="message" :style="{visibility:dianIndex==0?'visible':'hidden',top:-messageHeight+'px',right:'-150px'}">
                  <div style="text-align: center;color:#fff;margin-bottom: 15px;margin-top: -5px;">塘北A2园区-05地块</div>
                  <div style="margin-top: 8px;">经纬度:120.07765 29.761076</div>
                  <div style="display: flex;justify-content: space-between;align-items: center;margin-bottom:10px;margin-top: 10px;">
                    <div>作物:沃柑</div>
                    <div>面积:12.5亩</div>
                  </div>
                  <div style="display: flex;margin-bottom:10px; justify-content: space-between;align-items: center;">
                    <div>负责人:王少卿</div>
                    <div>投入设备:4台</div>
                  </div>
                  <div>农事活动：育肥→酒药→灌溉→修枝</div>
                </div>
              </div>
              <div class="dian" style="left:34%;bottom:45%;width: 15rem;height: 3rem;" @click="dianCli(1)">
                <div class="message" ref="message" :style="{visibility:dianIndex==1?'visible':'hidden',top:-messageHeight+'px',right:'-150px'}">
                  <div style="text-align: center;color:#fff;margin-bottom: 15px;margin-top: -5px;">塘北A2园区-05地块</div>
                  <div>经纬度:120.07765 29.761076</div>
                  <div style="display: flex;justify-content: space-between;align-items: center;margin-bottom:10px;margin-top: 10px;">
                    <div>作物:沃柑</div>
                    <div>面积:12.5亩</div>
                  </div>
                  <div style="display: flex;margin-bottom:10px; justify-content: space-between;align-items: center;">
                    <div>负责人:王少卿</div>
                    <div>投入设备:4台</div>
                  </div>
                  <div>农事活动：育肥→酒药→灌溉→修枝</div>
                </div>
              </div>
          </div>
          <div class="main-citrus">
            <div class="box-title2" >柑橘种植信息
              <select name="" id="" class="select">
                <option value="">塘北A1园区</option>
              </select>
            </div>
            <div class="citrus-item">
                <div class="citrus-left">
                  <div class="left-item1">
                    <div class="left-border">
                      <img src="./assets/citrusImg.png" style="width: 95%;height: 95%;" alt=""/>
                    </div>
                    <div class="left-citrus">
                      <div style="color:#fff;font-size: 14px;">沃柑 1900亩</div>
                      <div>
                        <div style="display: flex;justify-content: end;margin-right: 20px;color: #c1c1c1;font-size: 14px;">67.86%</div>
                        <div class="citrusbg">
                          <div style="height: 100%;width: 67%;">
                            <img src="./assets/jdt.png" alt=""/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="left-item1">
                    <div class="left-border">
                      <img src="./assets/citrusImg.png" style="width: 95%;height: 95%;" alt=""/>
                    </div>
                    <div class="left-citrus">
                      <div style="color:#fff;font-size: 14px;">晚橙 900亩</div>
                      <div>
                        <div style="display: flex;justify-content: end;margin-right: 20px;color: #c1c1c1;font-size: 14px;">32.14%</div>
                        <div class="citrusbg">
                          <div style="height: 100%;width: 32%;">
                            <img src="./assets/jdt2.png" alt=""/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="citrus-right">
                  <div class="table-wrapper">
                        <div class="table-header-row">
                        <div
                            class="table-header-cell"
                            v-for="column,index in leftArr.tableColumns1"
                            :style="`width: ${column.width};`" :key="index"
                        >{{ column.label }}</div>
                        </div>
                        <div class="table-data-row" v-for="item,index in leftArr.tableData1" :key="index" >
                        <div v-show="item[column.key]!= item.warnStatus"
                            class="table-data-cell"
                            v-for="column,inde in leftArr.tableColumns1" :key="inde"
                            :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                        >{{ item[column.key]}}</div>
                        </div>
              </div>
                </div>
            </div>
            
          </div>
          <div class="main-footer">
            <div v-for="item,index in mainList" :key="index" @click="goPage(index)" :class="mainIndex==index?'active':'actived'">
            {{ item }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right1">
            <div class="box-title">产品介绍</div>
            <div class="right1-item">
              <el-carousel :interval="3000" indicator-position='none' :autoplay='true' arrow="always" style="width: 100%;height: 100%;">
                        <el-carousel-item v-for="item in cropList" :key="item" style="width: 100%;height: 100%;display:flex;align-items:center;justify-content:space-between;">
                         <div class="right1-left">
                      <img :src="item.imgId" style="width: 84%;height: 78%;" alt=""/>
                    </div>
                    <div class="right1-right">
                      <div class="right1-top">
                        <span style="font-weight: 600;font-size: 16px;">{{ item.cropName }}</span> 
                        <div class="right1-warper"></div>
                      </div>
                      <div style="font-size: 14px; color: #c1c1c1;margin-top: 10px;">
                       {{ item.cropDesc }}
                      </div>
                    </div>
                        </el-carousel-item>
                      </el-carousel>
              
            </div>
          </div>
          <div class="right2">
            <div class="box-title">柑橘预测</div>
            <div class="right2-item">
              <div id="chart2"></div>
            </div>
          </div>
          <div class="right3">
            <div class="box-title">农资信息</div>
            <div class="right3-item">
              <div class="right3-top" style="text-align: center;color: #fff;margin-top: 20px;font-size: 16px;font-weight: 700;">农资费用(万)</div>
              <div id="chart3"></div>
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
import {
  agResources,
  planParks,
  page
} from '@/api/bigscreen3/index'
import { useRouter} from 'vue-router'
import img from './assets/chart1Img.png'
const initChart1= ()=> {
      initChartStatic(
        "chart1",
        generatePieOptions({
          legend: {
            show: true,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
          },
          graphic: { // 这个属性用于在饼图内部添加图片  
              elements: [{  
                  type: 'image', // 类型为图片  
                  style: {  
                      image: img, // 图片路径  
                      width: 50, // 图片宽度  
                      height: 50 // 图片高度  
                  },  
                  left: 'center', // 图片水平居中  
                  top: 'center' // 图片垂直居中  
              }]  
          },  
          color: ["#00ffff", "#0081ff", "#ffce54", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["40%", "60%"],
              center: "center",
              data: [
                {value:10000,name:'柑橘'},
                {value:5000,name:'柠檬'},
                {value:500,name:'百香果'},
              ],
              label: {
                // formatter: "{c|{c}},{d|{d}%}",
                formatter: "\n{c}\n {d}%",
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
const initChart2=  ()=>{
      initChartStatic(
        "chart2",
        generateBaseOptions({
          xAxis: {
            data: [ "3月",'4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月'],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
              },
            },
          },
          legend: { 
            data:['长势预测','产量预测'],
            show: true, 
            orient:'horizontal',
         },
          yAxis: {
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
          series: [
            {
              data: [15,50,70,60,80,100,110,115,140,120,150,170],
              type: "line",
              smooth: false,
              symbol:'none',
              areaStyle: { // 区域面积
             color: {
                type: 'line',
                colorStops: [
                  {
                    offset: 0,
                    color: '#128feb' // 0% 处的颜色
                  },
                  {
                    offset: 0.4,
                    color: '#128feb' // 50% 处的颜色
                  },
                  {
                    offset: 0.6,
                    color: '#04e1e5' // 50% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#04e1e5' // 100% 处的颜色
                  }
                ]
              }
          },
            },
          ],
          grid: {
            left: "20%",
            right: "4%",
            top: "15%",
            bottom: "15%",
          },
        })
      );
    
}
const initChart3= ()=> {
      initChartStatic(
        "chart3",
        generatePieOptions({
          title : {
            show:true,
            text: 96+'\n'+'总数', // \n可以换行
            x:'50%', // center
            y: 'center',
            textAlign: 'center',
            textStyle: {
              fontSize: '16',
              fontStyle: 'normal',
              fontWeight: '600',
              color:'#fff'
            },
          },
          legend: {
            show: true,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
          },
          
          // graphic: {  
          //     type: 'text',  
          //     left: 'center',  
          //     top: 'center',  
          //     style: {  
          //         text: '总访问量: ' + (335 + 310), 
          //         textAlign: 'center',  
          //         fontSize: 20,  
          //         color: 'white'  
          //     }  
          // }  ,
          color: ["#00ffff", "#0081ff", "#ffffff", "#ffce54"],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["40%", "60%"],
              center: "center",
              data: [
                {value:32,name:'施肥用料'},
                {value:46,name:'用工成本'},
                {value:13,name:'农具采购'},
                {value:8,name:'其他成本'},
              ],
              label: {
                // formatter: "{c|{c}},{d|{d}%}",
                formatter: "\n{c}\n {d}%",
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
onMounted(()=>{
  initChart1()
  initChart2()
  initChart3()

})
let leftArr=reactive<Object>({
    tableColumns1: [
        {
          key: 'massif',
          label: '地块',
          width: '25%',
        },
        {
          key: 'breed',
          label: '作物品种',
          width: '25%',
        },
        {
          key: 'area',
          label: '种植面积(亩)',
          width: '25%',
        },
        {
          key: 'per',
          label: '亩产(斤)',
          width: '25%',
        },
      ],
      tableData1: [
        {
          massif:'D1-1',
          breed:'沃柑',
          area:'132',
          per:'3200'
        },
        {
          massif:'D1-1',
          breed:'沃柑',
          area:'132',
          per:'3200'
        },
        {
          massif:'D1-1',
          breed:'沃柑',
          area:'132',
          per:'3200'
        },
        {
          massif:'D1-1',
          breed:'沃柑',
          area:'132',
          per:'3200'
        },
      ],
})
let mainIndex=ref('0')
let mainList=ref<any>([
'农业资源','设备监控','产业数据','鲁渝有礼','视频监控'
])
//农业资源
let sources=ref({})
const getagResources=()=>{
  agResources().then(res=>{
    sources.value=res
  })
}
getagResources()
//种植园区
let total=ref<any>(0)
let parkList=ref<any>([])
const getPlanParks=()=>{
  planParks().then(res=>{
    total.value=res.total
    parkList.value=res.parkList
  })
}
getPlanParks()
//产品介绍
let cropList=ref<any>([])
const getPage=()=>{
  page().then(res=>{
    cropList.value=res.list
  })
}
getPage()
let router=useRouter()
const goPage=(val)=>{
  mainIndex.value=val
  if(val=='1'){
    router.push('/bigscreen4')
  }
}
//
let dianIndex=ref<any>(-1)
let message=ref<any>(null)
let messageHeight=ref<any>(0)
const  dianCli=(val)=>{
  dianIndex.value=val
  messageHeight.value=message.value.offsetHeight
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
.box-title{
  width: 100%;
  height: 2rem;
  text-indent: 2.5rem;
  color: #fff;
  font-size: 20px;
  line-height: 2rem;
  font-family: 'TitleFont';
  background-size: 100% 100%;
  background-image: url('./assets/box-title.png');
}
.box-title2{
  width: 100%;
  height: 2rem;
  text-indent: 2.5rem;
  color: #fff;
  font-size: 20px;
  line-height: 2rem;
  font-family: 'TitleFont';
  background-size: 100% 100%;
  background-image: url('./assets/box-title2.png');
  position: relative;
  .select{
    position: absolute;
    background: none;
    color: #fff;
    padding: 3px 5px;
    background-size: 100% 100%;
    background-image: url('./assets/select.png');
    top: 0;
    right: 0;
  }
}
.content-main-wrapper {
    padding: 0 10px !important;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 25% calc(50% - 20px) 25%;
    gap: 10px;
    .left{
      display: grid;
      grid-template-rows: 32% 32% calc(36% - 20px);
      grid-auto-columns: 100%;
      gap:10px;
      width: 100%;
      height: 100%;
      .left1{
        width: 100%;
        height: 100%;
        .left1-item{
          width: 100%;
          height: calc( 100% - 2rem);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr ;
          gap:10px;
          .left1-warper{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #fff;
            font-weight: 600;
            font-size: 18px;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-image: url('./assets/left1ItemBg.png');
          }
        }
      }
      .left2{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .left2-item{
          width: 100%;
          overflow-y: auto;
          
          height: calc( 100% - 2rem );
          .left2-warper{
            margin-top: 10px;
            padding-left: 30px;
            padding-right: 15px;
            width: 100%;
            height: 50px;
            box-sizing: border-box;
            display: flex;
            background-size: 100% 100%;
            align-items: center;
            color: #fff;
            background-image: url('./assets/left2ItemBg.png');
          }
        }
        .left2-item::-webkit-scrollbar {
            display: none;
          };
      }
      .left3{
        width: 100%;
        height: 100%;
        .left3-item{
          width: 100%;
          height: calc( 100% - 2rem);
          #chart1{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .main{ 
      position: relative;
      grid-auto-columns: 100%;
      width: 100%;
      height: 100%;
      .middle-main-item{
      position: absolute;
      width: 1000px;
      height: 600px;
      left: calc(50% - 500px);
      top: calc(50% - 540px );
      background-size: 100% 100%;
      background-image: url(./assets/mainBg.png);
      position: relative;
      .dian{
        z-index: 999;
        position: absolute;
        background-size: 100% 100%;
        background-image: url(./assets/dian.png);
        .message{
          position: absolute;
          padding: 8px 15px 20px;
          color:#c1c1c1;
          background-size: 100% 100%;
          background-image: url(./assets/message.png);
        }
      }
      }
      .main-citrus{
        position: absolute;
        left: 0;
        bottom: 15%;
        width: 100%;
        height: 300px;
        .citrus-item{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: calc( 100% - 2rem);
          .citrus-left{
            width: 40%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .left-item1{
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-around;
              height: 40%;
              background-size: 100% 100%;
              background-image: url('./assets/citrus.png');
              .left-border{
                width: 20%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left:20px;
                height: 60%;
                background-size: 100% 100%;
                background-image: url('./assets/left1-border.png');
              }
              .left-citrus{
                width: 60%;
                height: 60%;
                .citrusbg{
                  width: 90%;
                  height: 20px;
                  background-size: 100% 100%;
                  background-image: url('./assets/jdtBg.png');

                }
              }
            }
          }
          .citrus-right{
            width: 57%;
            height: 90%;
            .table-wrapper {
            width: 100%;
            height: calc(100% - 3rem);
            position: relative;
            overflow: auto;
            font-size: .9rem;
            .table-header-row {
                width: 100%;
                padding: 8px 0;
                display: flex;
                align-items: center;
                position: sticky;
                top: 0;
                background-color: #2b5f93;
                .table-header-cell {
                color: #fff;
                text-align: center;
                }
            }
            .table-data-row {
                margin-top: 10px;
                width: 100%;
                height: 18%;
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
        }
      }
      .main-footer{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 13%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        .active{
          width: 20%;
          height: 50px;
          cursor: pointer;
          text-align: center;
          font-weight: 600;
          background-size: 100% 100%;
          background-image: url('./assets/active.png');
        }
        .actived{
          cursor: pointer;
          width: 20%;
          height: 50px;
          text-align: center;
          font-weight: 600;
          color: #c1c1c1;
          background-size: 100% 100%;
          background-image: url('./assets/actived.png');
        }
      }
    }
    .right{
      display: grid;
      grid-template-rows: 32% 32% calc(36% - 20px);
      grid-auto-columns: 100%;
      gap:10px;
      width: 100%;
      height: 100%;
      .right1{
        width: 100%;
        height: 100%;
        .right1-item{
          width: 100%;
          height: calc(100% - 2rem );
          display: flex;
          align-items: center;
          justify-content: space-between;
          .right1-left{
            display: flex;
            align-items: center;
            justify-content:center;
            width: 49%;
            height: 70%;
            background-size: 100% 100%;
            background-image: url('./assets/right1Left.png');
          }
          .right1-right{
            width: 49%;
            color: #fff;
            height: 80%;
            .right1-top{
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              height: 10%;
              .right1-warper{
                width: 80%;
                height: 50%;
                background-size: 100% 100%;
                background-image: url('./assets/right1Top.png');
              }
            }
          }
        }
      }
      .right2{
        width: 100%;
        height: 100%;
        .right2-item{
          width: 100%;
          height: calc(100% - 2rem);
          #chart2{
            width: 100%;
            height: 100%;
          }
        }
      }
      .right3{
        width: 100%;
        height: 100%;
        .right3-item{
          width: 100%;
          height: calc(100% - 2rem );
          .right3-top{
            margin:auto;
            width: 60%;
            height: 10px;
            line-height: 10px;
            background-size: 100% 100%;
            background-image: url('./assets/right3Top.png');
          }
          #chart3{
            width: 100%;
            height: calc( 100% - 2.3rem);
          }
        }
      }
    }
  }


@for $i from 1 through 3 {
  .scan-#{$i} {
    background-image: url(./assets/scan#{$i}.png);
  }
}
</style>