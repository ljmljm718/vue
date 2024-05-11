<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '@/utils/bigscreenTool/index'
const initChart1=()=>{
  initChartStatic('chart1',generateBaseOptions({
    xAxis: {
        
        show:false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: false
      },
      yAxis: {
        show:false
      },
      series: [
        {
          name: '',
          data: [2,5,33,1,23,4],
          type: 'line',
          barWidth:'20',
          symbol:'none',
          areaStyle:{
            color:'#965ee4'
          },
          itemStyle: {
              normal: {
                lineStyle: {
                  color: "#965ee4", //改变折线颜色
                },
              },
            }
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '18%'
      }
  }))
}
const initChart2 = async () => {
  initChartStatic('chart2', generateBaseOptions({
    xAxis: {
        show:false,
        data: [1,2,3,4,5,6],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: false
      },
      yAxis: [
        {
          show:false,
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            color: '#000'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#e1e7f1', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        }
      ],

      series: [
        {
          name: '',
          data: [2,5,13,1,2,15,4],
          type: 'bar',
          barWidth:'20'
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '18%'
      }
  }))
}
const initChartBar = async () => {
  initChartStatic('chartBar', generateBaseOptions({
    xAxis: {
        data: ['2023-05','2023-06','2023-07','2023-08','2023-09','2023-10','2023-11','2023-12','2024-01','2024-02','2024-03','2024-04'],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: false
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            color: '#000'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#e1e7f1', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        }
      ],

      series: [
        {
          name: '',
          data: [2, 5,33,1,23,4,20,10,25,18,20,21,],
          type: 'bar',
          barWidth:'20'
        }
      ],
      grid: {
        left:'3%',
        top: '15%',
        bottom: '18%'
      }
  }))
}
const initChart3 = async () => {
  initChartStatic('chart3', generateBaseOptions({
    xAxis: {
        data: [1,2,3,4,5,6],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: false
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            color: '#000'
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#e1e7f1', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: {
            //网格区域
            show: false //是否显示
          }
        }
      ],

      series: [
        {
          name: '',
          data: [2,5,33,1,23,4],
          type: 'bar',
          barWidth:'20'
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '18%'
      }
  }))
}
const initChartLine=()=>{
  initChartStatic('chartLine',generateBaseOptions({
    xAxis: {
        
        show:false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: false
      },
      yAxis: {
        show:false
      },
      series: [
        {
          name: '',
          data: [2,5,33,1,23,4],
          type: 'line',
          barWidth:'20',
          symbol:'none',
          areaStyle:{
            color:'#3caffc'
          },
          itemStyle: {
              normal: {
                lineStyle: {
                  color: "#3caffc", //改变折线颜色
                },
              },
            }
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '18%'
      }
  }))
}
const initChartLine2=()=>{
  initChartStatic('chartLine2',generateBaseOptions({
    xAxis: {
        
        show:false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: false
      },
      yAxis: {
        show:false
      },
      series: [
        {
          name: '',
          data: [2,5,33,1,23,4],
          type: 'line',
          barWidth:'20',
          symbol:'none',
          areaStyle:{
            color:'#85dce5'
          },
          itemStyle: {
              normal: {
                lineStyle: {
                  color: "#85dce5", //改变折线颜色
                },
              },
            }
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '18%'
      }
  }))
}
const initChart4=()=>{
  initChartStatic('chart4',generateBaseOptions({
    xAxis: {
        data:['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        nameTextStyle: {
          color: '#000'
        }
      },
      legend: {
        show: true,
        textStyle: {
          color:'#000'
        }
      },
      yAxis: {
        type:'value',
        axisLine: {                                    
          show: true,                    
          lineStyle: {                        
            type: 'solid',                            
            opacity:1                                
          }
        }
      },
      series: [
        {
          name: '预警量',
          data: [10,17,30,15,23,10,20,30,20,3,15,20,28,40,20],
          type: 'line',
          barWidth:'20',
          symbol:'none',
          itemStyle: {
              normal: {
                lineStyle: {
                  color: "#108de9", //改变折线颜色
                },
              },
            }
        },
        {
          name: '处理数',
          data: [2,5,33,1,23,4,20,15,20,18,9,20,33,25,30],
          type: 'line',
          barWidth:'20',
          symbol:'none',
          itemStyle: {
              normal: {
                lineStyle: {
                  color: "#98d87d", //改变折线颜色
                },
              },
            }
        },
      ],
      grid: {
        left: '3%',
        right: '3%',
        top: '15%',
        bottom: '18%'
      }
  }))
}
const initChartPie = async () => {
  initChartStatic(
        "chartPie",
        generatePieOptions({
          legend: {
            show: true,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
            textStyle:{
              color:'#000'
            }
          },
          color: ["#00b4ff", "#00f496", "#3b72ad", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: [
                {value:'22',name:'气象监测'},
                {value:'22',name:'土壤监测'},
                {value:'22',name:'虫情监测'},
                {value:'22',name:'环境监测'},
                {value:'22',name:'其他'},
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
const initChartPie1 = async () => {
  initChartStatic(
        "chartPie1",
        generatePieOptions({
          legend: {
            show: false,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
            textStyle:{
              color:'#000'
            }
          },
          color: ["#99d5fd", "#e9e9e9", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: ['82','18'],
              labelLine:{  //删除指示线
              show:false
            }
            },
          ],
        })
      );
}
const initChartPie2 = async () => {
  initChartStatic(
        "chartPie2",
        generatePieOptions({
          legend: {
            show: false,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
            textStyle:{
              color:'#000'
            }
          },
          color: ["#99d5fd", "#e9e9e9", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: ['82','18'],
              labelLine:{  //删除指示线
              show:false
            }
            },
          ],
        })
      );
}
const initChartPie3 = async () => {
  initChartStatic(
        "chartPie3",
        generatePieOptions({
          legend: {
            show: false,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
            textStyle:{
              color:'#000'
            }
          },
          color: ["#99d5fd", "#e9e9e9", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: ['82','18'],
              labelLine:{  //删除指示线
              show:false
            }
            },
          ],
        })
      );
}
const initChartPie4 = async () => {
  initChartStatic(
        "chartPie4",
        generatePieOptions({
          legend: {
            show: false,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
            textStyle:{
              color:'#000'
            }
          },
          color: ["#99d5fd", "#e9e9e9", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: ['82','18'],
              labelLine:{  //删除指示线
              show:false
            }
            },
          ],
        })
      );
}
const initChartPie5 = async () => {
  initChartStatic(
        "chartPie5",
        generatePieOptions({
          legend: {
            show: false,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
            textStyle:{
              color:'#000'
            }
          },
          color: ["#99d5fd", "#e9e9e9", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: ['82','18'],
              labelLine:{  //删除指示线
              show:false
            }
            },
          ],
        })
      );
}
const initChartPie6 = async () => {
  initChartStatic(
        "chartPie6",
        generatePieOptions({
          legend: {
            show: false,
            top: "center",
            left: "right",
            bottom:'0',
            orient:'vertical',
            itemWidth: 12,
            itemHeight: 12,
            textStyle:{
              color:'#000'
            }
          },
          color: ["#99d5fd", "#e9e9e9", ],
          series: [
            {
              nam: "种植资源",
              type: "pie",
              radius: ["30%", "50%"],
              center: "center",
              data: ['82','18'],
              labelLine:{  //删除指示线
              show:false
            }
            },
          ],
        })
      );
}
onMounted(() => { 
  initChart1()
  initChart2()
  initChart3()
  initChart4()
  initChartBar()
  initChartLine()
  initChartLine2()
  initChartPie()
  initChartPie1()
  initChartPie2()
  initChartPie3()
  initChartPie4()
  initChartPie5()
  initChartPie6()
 })
const cardList=ref([
  {
    title:'基地一',
    value:'82%'
  },
  {
    title:'基地二',
    value:'78%'
  },
  {
    title:'基地三',
    value:'45%'
  },
  {
    title:'基地四',
    value:'30%'
  },
  {
    title:'基地五',
    value:'30%'
  },
  {
    title:'基地六',
    value:'70%'
  },
  {
    title:'基地六',
    value:'70%'
  },
  {
    title:'基地六',
    value:'70%'
  },
])

const devicePreviewList = ref<Array<any>>([])
const getDevicePreviewList = async () => {
  devicePreviewList.value = [
    {
      title: '巡检设备总次数',
      value: '124,543,23',
      unit: '台/次'
    },
    {
      title: '巡检完成率',
      value: '92',
      unit: '%'
    },
    {
      title: '巡检时长',
      value: '01:10:12',
      unit: ''
    },
    {
      title: '结果异常设备台次',
      value: '234',
      unit: '台/次'
    },
  ]
}
getDevicePreviewList()

// 选中的设备类型
const selectedDeviceType = ref('New York')

// 数据采集类型
const dataCollectTypes = ref<Array<any>>([
  {
    title:'环境温度',
    value:'323234'
  },
  {
    title:'环境湿度',
    value:'323234'
  },
  {
    title:'光照强度',
    value:'323234'
  },
])

// 产品制造及销售
const productSellList = ref<Array<any>>([])
const productSellParams = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})
const getProductSellList = () => {

}

//  数据采集
const dataPickerSelected = ref('全部')
const dataPickerVal = ref<any>([])
</script>
<template>
  <div class="w-full">
    <div class="grid grid-cols-4 gap-2">
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>数据采集量</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">8,846</div>
          <div class="h-[5rem] flex justify-center items-center">
            <div id="chart1"></div>
          </div>
          <el-divider  class="!my-2"/>
          <div class="flex items-center">
            <span>日数据采集量</span>
            <span class="pl-3">12,423</span>
          </div>
      </el-card>
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>设备报警数</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">6,560</div>

          <div class="h-[5rem] flex justify-center items-center">
            <div class="grid grid-cols-2 gap-2 w-full">
              <div class="flex items-center">
                <span>周同比</span>
                <el-icon style="color: green;"><Top /></el-icon>
                <span>12%</span>
              </div>
              <div class="flex items-center">
                <span>日环比</span>
                <el-icon style="color: red;"><Bottom /></el-icon>
                <span>11%</span>
              </div>
            </div>
          </div>
          
          <el-divider  class="!my-2"/>
          <div class="flex items-center">
            <span>今日报警数</span>
            <span class="pl-3">12,423</span>
          </div>
      </el-card>
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>巡检总次数</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">6,560</div>
          <div class="h-[5rem] flex justify-center items-center">
            <div id="chart2"></div>
          </div>
          
          <el-divider  class="!my-2"/>
          <div class="flex items-center">
            <span>巡检完成率</span>
            <span class="pl-3">92%</span>
          </div>
      </el-card>
      <el-card>
          <template #header>
            <div class="flex justify-between items-center">
              <span>订单完成率</span>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="text-[1.2rem] art-font">78%</div>
          <div class="h-[5rem] flex justify-center items-center"></div>
          <el-divider  class="!my-2"/>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center">
              <span>周同比</span>
              <el-icon style="color: green;"><Top /></el-icon>
              <span>12%</span>
            </div>
            <div class="flex items-center">
              <span>日环比</span>
              <el-icon style="color: red;"><Bottom /></el-icon>
              <span>11%</span>
            </div>
          </div>
      </el-card>
    </div>
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center art-font">
          <span>设备巡检预览</span>
        </div>
      </template>
      <div class="grid grid-cols-4 gap-3">
        <div
          class="p-3"
          v-for="(item, index) in devicePreviewList"
          :key="index"
        >
          <div>{{ item.title }}</div>
          <div class="flex items-end">
            <span class="art-font" style="font-size: 1.2rem;">{{ item.value }}</span>
            <span>{{ item.unit }}</span>
          </div>
        </div>
      </div>
      <div id="chart3"></div>
    </el-card>
    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="art-font">数据采集</span>
          <div class="flex space-x-3">
            <el-radio-group v-model="dataPickerSelected">
              <el-radio-button label="本周" value="New York" />
              <el-radio-button label="本月" value="Washington" />
              <el-radio-button label="全年" value="Los Angeles" />
            </el-radio-group>
            <el-date-picker
              v-model="dataPickerVal"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </div>
          
        </div>
      </template>
      <div class="flex justify-between h-[14rem]">
        <div class="h-full" style="width: calc(100% - 19rem);">
          <div class="art-font h-[1rem]">数据采集量趋势</div>
          <div style="height: calc(100% - 1rem);" id="chartBar"></div>
        </div>
        <div class="w-[18rem] h-full" >
          <div class="art-font h-[1rem]">数据采集类型</div>
          <div
            style="height: calc(100% - 1rem);"
            class="overflow-auto dataCollectTypes"
          >
            <div
              class="flex justify-between items-center p-[8px] "
              v-for="(item, index) in dataCollectTypes"
              :key="index"
            >
              <div>{{ index + 1 }}</div>
              <div class="flex-1 ml-.5rem">{{ item.title }}</div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">产品制造及销售</span>
          </div>
        </template>
        <div>
          <div class='flex items-center justify-between h-8rem color-[#c1c1c1] mt-[-1rem]'>
            <div class="w-[49%]">
              <div class="">产品制造</div>
              <div style="font-size:20px;" class='flex justify-around mb-[-5px]'>
                <div>8846 <span style="font-size:14px;"> 件</span> </div>
                <div>18846 <span style="font-size:14px;"> 库存量</span> </div>
              </div>
              <div id="chartLine"></div>
            </div>
            <div class="w-[49%]">
              <div>产品销量</div>
              <div style="font-size:20px;" class='flex justify-around mb-[5px]'>
                <div>4342 <span style="font-size:14px;"> 单</span> </div>
                <div>3432432 <span style="font-size:14px;"> 万元</span> </div>
              </div>
              <div id="chartLine2"></div>
            </div>
          </div>
          <el-table :data="productSellList" :show-overflow-tooltip="true" style="height: 10rem;" :stripe="true">
            <el-table-column align="center" label="销售排名" prop="mobile" />
            <el-table-column align="center" label="产品名称" prop="telephone" />
            <el-table-column align="center" label="月销量" prop="telephone" />
            <el-table-column align="center" label="月涨幅" prop="telephone" />
          </el-table>
          <Pagination
            v-model:limit="productSellParams.pageSize"
            v-model:page="productSellParams.pageNo"
            :total="productSellParams.total"
            @pagination="getProductSellList"
          />
        </div>
      </el-card>
      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="art-font">设备类型占比</span>
          </div>
        </template>
        <el-radio-group v-model="selectedDeviceType">
          <el-radio-button label="全部" value="New York" />
          <el-radio-button label="监测设备" value="Washington" />
          <el-radio-button label="监控设备" value="Los Angeles" />
          <el-radio-button label="产线设备" value="Chicago" />
        </el-radio-group>
        <div id="chartPie"></div>
      </el-card>
    </div>
    <el-card class="mt-4">
      <div class="color-[#c1c1c1] w-100% h-6.8rem  footer-top ">
        <div  style="flex: 0 0 auto" class="flex justify-between w-[20%]" v-for="item,index in cardList" :key="index">
          <div class='inline-block'>
            <div class="color-[#000]">{{item.title}}</div>
            <div style="font-size:13px;" class="mt-4px mb-2px">预警处理率</div>
            <div class="color-[#000]" style="font-size:1.3rem;">{{item.value}}</div>
          </div>
          <div :id="'chartPie'+(1+ index)" class="w-[60%] h-[5rem] inline-block"></div>
        </div>
      </div>
      <div id="chart4"></div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
#chart1, #chart2 {
  width: 100%;
  height: 3rem;
}

#chart3 {
  width: 100%;
  height: 6rem;
}

#chart4 {
  width: 100%;
  height: 12rem;
}
#chartPie{
  width: 100%;
  height: 18rem;
}
#chartLine,#chartLine2{
  width:100%;
  height:5rem;
}
.dataCollectTypes::-webkit-scrollbar{
  width:0
}
.footer-top{
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}
// .footer-top::-webkit-scrollbar{
//   width:0
// }
</style>
