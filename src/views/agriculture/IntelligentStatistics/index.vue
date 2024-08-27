<template>
  <div class="bg-[#f5f5f5]">
    <div class="bg-[#fff] flex h-40px items-center">
      <el-form :model="formData" label-width="80px" class="!h-25px" :inline="true">
        <el-form-item label="选择基地">
          <el-select class="!w-300px" v-model="formData.baseCode">
            <el-option
              v-for="(item, index) in baseList"
              :key="index"
              :value="item.id"
              :label="item.name"
              placeholder="请选择"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择地块">
          <el-select class="!w-300px" v-model="formData.plotCode">
            <el-option
              v-for="(item, index) in plotList"
              :key="index"
              :value="item.id"
              :label="item.name"
              placeholder="请选择"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="offSubmit">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="grid grid-cols-3 mt-15px gap-15px w-100% h-300px">
      <el-card class="w-100% h-100%">
        <template #header>
          <div class="flex font-800">
            <div>养殖品种</div>
          </div>
        </template>
        <div :class="`w-[100%] h-210px relative ${distributionList.length==0?'chartNull':''}`" >
          <div id="chartPie1"  class="w-100% h-100%"></div>
          <div  v-if="distributionList.length==0" class="text-center mt-[-40px] color-[#999999] text-[14px]">暂无养殖品种，去“智慧农事”-“种植管理”中添加</div>
        </div>
      </el-card>
      <el-card class="w-100% h-100%">
        <template #header>
          <div class="flex font-800">
            <div>农事计划</div>
          </div>
        </template>
        <div :class="`w-[100%] h-210px relative ${DistriButionList.length==0?'chartNull':''}`">
          <div id="chartPie2" class="w-100% h-100%" ></div>
          <div v-if="DistriButionList.length==0" class="text-center mt-[-40px] color-[#999999] text-[14px]">暂无农事计划，去“智慧农事”-“种植管理”中添加</div>
        </div>
      </el-card>
      <el-card class="w-100% h-100%">
        <template #header>
          <div class="flex font-800">
            <div>投入产出分析</div>
          </div>
        </template>
        <div class="w-[100] h-210px relative">
          <div id="chartBar1" class="w-100% h-100%"></div>
        </div>
      </el-card>
    </div>
    <div class="grid grid-cols-2 mt-15px gap-15px w-100% h-300px">
      <el-card class="w-100% h-100%">
        <template #header>
          <div class="flex font-800">
            <div>产量一览图</div>
          </div>
        </template>
        <div class="w-[100] h-210px relative">
          <div id="chartBar2" class="w-100% h-100%"></div>
        </div>
      </el-card>
      <el-card class="w-100% h-100%">
        <template #header>
          <div class="flex font-800">
            <div>农事活动</div>
          </div>
        </template>
        <div class="w-[100] h-210px relative">
          <div id="chartBar3" class="w-100% h-100%"></div>
        </div>
      </el-card>
    </div>
    <el-card class="h-400px mt-15px">
      <template #header>
        <div class="flex font-800">
          <div>收获趋势图</div>
        </div>
      </template>
      <div class="flex py-2">
        <el-radio-group v-model="radio" @change="handleRadioChange">
          <el-radio-button label="本月" value="month" class="mr-15px" />
          <el-radio-button label="本年" value="years" />
        </el-radio-group>
        <div style="margin: 0 0.4rem">
          <el-date-picker
            v-model="dateData"
            @change="dataTime"
            type="daterange"
            value-format="YYYY-MM-DD"
            :default-time="[new Date('1 '), new Date('1')]"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </div>
      </div>
      <div class="w-[100] h-280px relative">
        <div id="chartLine" class="w-100% h-100%"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../../utils/bigscreenTool/index'
import {
  page,
  parkPage,
  stateDistriBution,
  getInOrOutAnalysis,
  distribution,
  selectHarvest,
  getFarmRecordMap,
  getHarvestManagementNumList
} from './api'
const formData = ref({
  baseCode: '',
  plotCode: ''
})
//获取基地
const baseCode = ref('')
const plotCode = ref('')
const baseList = ref([])
const getPage = async () => {
  let res = await page()
  baseList.value = res.list
  baseCode.value = res.list[0].id
  getParkPage({ parkId: res.list.id })
}
getPage()
//获取地块
const plotList = ref([])

const getParkPage = async (parkId) => {
  let res = await parkPage(parkId)
  plotList.value = res.list
  plotCode.value = res.list[0].id
}
//养殖品种
const distributionList=ref([])
const chartPieWidth=ref(0)
const initChartPie1 = async () => {
  let res = await distribution({ parkId: baseCode.value, plotId: plotCode.value })
  distributionList.value=res  
  let data = []
  res.forEach((item) => {
    data.push({
      value: item.number,
      name: item.cropName
    })
  })
  initChartStatic(
    'chartPie1',
    generatePieOptions({
      legend: {
        show: true,
        top: 'center',
        left: 'right',
        bottom: '0',
        orient: '',
        textStyle: {
          color: '#000'
        },
        itemWidth: 12,
        itemHeight: 12
      },
      color: ['#00b4ff', '#00f496', '#3b72ad'],
      series: [
        {
          nam: '养殖品种',
          type: 'pie',
          radius: '50%',
          center: 'center',
          data: data,
          label: {
            // formatter: "{c|{c}},{d|{d}%}",
            formatter: '\n{c}\n {d}%',
            rich: {
              c: {
                color: '#c1c1c1',
                fontSize: 10
              },
              d: {
                color: '#c1c1c1',
                fontSize: 10
              }
            }
          }
        }
      ]
    })
  )
}

//农事计划
const DistriButionList=ref([])
const initChartPie2 = async () => {
  let res = await stateDistriBution({ parkId: baseCode.value, plotId: plotCode.value })
  DistriButionList.value=res
  initChartStatic(
    'chartPie2',
    generatePieOptions({
      legend: {
        show: true,
        top: 'center',
        left: 'right',
        bottom: '0',
        orient: '',
        textStyle: {
          color: '#000'
        },
        itemWidth: 12,
        itemHeight: 12
      },
      color: ['#80ffff', '#3b72ad'],
      series: [
        {
          nam: '农事计划',
          type: 'pie',
          radius: '50%',
          center: 'center',
          data: res.map((item) => {
            return {
              value: item.number,
              name: item.planState
            }
          }),
          label: {
            // formatter: "{c|{c}},{d|{d}%}",
            formatter: '\n{c}\n {d}%',
            rich: {
              c: {
                color: '#c1c1c1',
                fontSize: 10
              },
              d: {
                color: '#c1c1c1',
                fontSize: 10
              }
            }
          }
        }
      ]
    })
  )
}



//投入产出分析
const initChartBar1 = async () => {
  let res = await getInOrOutAnalysis({ parkId: baseCode.value, plotId: plotCode.value })
  let yData = Object.keys(res)
  let harvestList = []
  let inputList = []
  yData.forEach((item) => {
    harvestList.push(res[item].harvestAmount)
    inputList.push(res[item].inputAmount)
  })
  initChartStatic(
    'chartBar1',
    generateBaseOptions({
      xAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        }
      },
      legend: {
        show: true,
        textStyle: {
          color: '#000'
        }
      },
      yAxis: [
        {
          data: yData,
          nameTextStyle: {
            color: 'rgba(153, 153, 153, 1)',
            'font-family': 'AlibabaPuHuiTi',
            fontSize: '13px'
          },
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
      color: ['#5470c6', '#91cc75'],
      series: [
        {
          name: '投入量',
          data: inputList,
          type: 'bar',
          smooth: false
        },
        {
          name: '收获量',
          data: harvestList,
          type: 'bar',
          smooth: false
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      }
    })
  )
}
//产量一览图
const initChartBar2 = async () => {
  let res = await selectHarvest({ parkId: baseCode.value, plotId: plotCode.value })
  let yData1 = []
  let yData2 = []
  let yData3 = []
  let yData4 = []
  let yData5 = []
  let xData = []
  let seriesList = []
  let seriesList2 = []
  let nameList={ ...Array.from(new Set(res.map(item=>item.variety)))}
  res.forEach((item) => {
    if (nameList[0] == item.variety) {
      yData1.push({ name: item.variety, value: item.harvest })
    } else if (nameList[1] == item.variety) {
      yData2.push({ name: item.variety, value: item.harvest })
     
    } else if (nameList[2] == item.variety) {
      yData3.push({ name: item.variety, value: item.harvest })
      
    } else if (nameList[3] == item.variety) {
      yData4.push({ name: item.variety, value: item.harvest })
    
    } else if (nameList[4] == item.variety) {
      yData5.push({ name: item.variety, value: item.harvest })
    }
  })
 
  initChartStatic(
    'chartBar2',
    generateBaseOptions({
      xAxis: {
        data: Array.from(new Set(res.map((item) => item.time))),
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        }
      },
      legend: {
        show: true,
        top: 'top',
        left: 'center',
        textStyle: {
          color: '#000'
        }
      },
      yAxis: [
        {
          type: 'value',
          nameTextStyle: {
            color: 'rgba(153, 153, 153, 1)',
            'font-family': 'AlibabaPuHuiTi',
            fontSize: '13px'
          },
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
      toolbox: {
        show: true,
        feature: {
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      color: ['#5470c6', '#91cc75'],
      series: 
      [
        {
          name:nameList[0],
          data: yData1,
          type: 'bar',
          smooth: false,
          barWidth: 28
        },
        {
          name:nameList[1],
          data:yData2,
          type: 'bar',
          smooth: false,
          barWidth: 28
        },
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      }
    })
  )
}
//农事活动
const initChartBar3 = async () => {
  let res = await getFarmRecordMap({ parkId: baseCode.value, plotId: plotCode.value })
  initChartStatic(
    'chartBar3',
    generateBaseOptions({
      xAxis: {
        data: res.listXContent,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        }
      },
      legend: {
        show: true,
        textStyle: {
          color: '#000'
        }
      },
      yAxis: [
        {
          type: 'value',
          nameTextStyle: {
            color: 'rgba(153, 153, 153, 1)',
            'font-family': 'AlibabaPuHuiTi',
            fontSize: '13px'
          },
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
      color: ['#5470c6'],
      series: [
        {
          name: '农事活动',
          data: res.listYContent,
          type: 'bar',
          barWidth: 25,
          smooth: false
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      }
    })
  )
}
//收获趋势图
const yAxisData = ref([])
const radio = ref('本月')
const dateData = ref([])
const initChartLine = async (val, num, type) => {
  let res = await getHarvestManagementNumList({
    parkId: baseCode.value,
    plotId: plotCode.value,
    startTime: val[0],
    endTime: val[1],
    findType: type
  })
  let yData = res.map((item) => item.sumNum)
  let xData = res.map((item) => item.dateContent)
  let yAxisData = []
  let xAxisData = []
  if (radio.value == '本月' && xData.length != 0) {
    if (num == 1) {
      let month = xData[0]
      let _Month = month.split('-')
      let _Ydata = []
      let _X = []
      for (let i = 1; i <= 31; i++) {
        xAxisData.push(`${_Month[1]}-${i > 10 ? i : '0' + i}`)
        _X.push(`${i > 10 ? i : '0' + i}`)
        _Ydata.push(0)
      }
      xData.forEach((itm, index) => {
        _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
      })
      yAxisData = _Ydata
    } else if (num == 2) {
      let month = xData[0]
      let _Month = month.split('-')
      let _Ydata = []
      let _X = []
      for (let i = 1; i <= 29; i++) {
        xAxisData.push(`${_Month[1]}-${i > 10 ? i : '0' + i}`)
        _X.push(`${i > 10 ? i : '0' + i}`)
        _Ydata.push(0)
      }
      xData.forEach((itm, index) => {
        _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
      })
      yAxisData = _Ydata
    } else if (num == 3) {
      let month = xData[0]
      let _Month = month.split('-')
      let _Ydata = []
      let _X = []
      for (let i = 1; i <= 30; i++) {
        xAxisData.push(`${_Month[1]}-${i > 10 ? i : '0' + i}`)
        _X.push(`${i > 10 ? i : '0' + i}`)
        _Ydata.push(0)
      }
      xData.forEach((itm, index) => {
        _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
      })
      yAxisData = _Ydata
    }

  }
  if (xData.length == 0 && radio.value == '本月') {
    let _Ydata = []
    let _X = []
    let month = val[0]
    let month2 = val[1]
    if (month.split('-')[1] == month2.split('-')[1]) {
      const day = month.split('-')[2]
      const day2 = month2.split('-')[2]
      for (let i = day; i <= day2; i++) {
        xAxisData.push(`${month.split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
        _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
        _Ydata.push(0)
      }
      yAxisData = _Ydata
    } else if (month.split('-')[1] != month2.split('-')[1]) {
      let month3 = ['01', '03', '05', '07', '08', '10', '12']
      if (month3.includes(month.split('-')[1])) {
        for (let i = month.split('-')[2]; i <= 31; i++) {
          xAxisData.push(`${month.split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        for (let i = 1; i <= month2.split('-')[2]; i++) {
          xAxisData.push(`${month2.split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        xData.forEach((itm, index) => {
          _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
        })
        yAxisData = _Ydata
      } else if (val[0].split('-')[1] == '02') {
        for (let i = val[0].split('-')[2]; i <= 29; i++) {
          xAxisData.push(`${val[0].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        for (let i = 1; i <= val[1].split('-')[2]; i++) {
          xAxisData.push(`${val[1].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        xData.forEach((itm, index) => {
          _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
        })
        yAxisData = _Ydata
      } else {
        for (let i = val[0].split('-')[2]; i <= 30; i++) {
          xAxisData.push(`${val[0].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        for (let i = 1; i <= val[1].split('-')[2]; i++) {
          xAxisData.push(`${val[1].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        xData.forEach((itm, index) => {
          _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
        })
        yAxisData = _Ydata
      }
    }
  } else if (num == 4) {
    let _Ydata = []
    let _X = []
    if (val[0].split('-')[1] == val[1].split('-')[1]) {
      const day = val[0].split('-')[2]
      const day2 = val[1].split('-')[2]
      for (let i = day; i <= day2; i++) {
        xAxisData.push(`${val[0].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
        _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
        _Ydata.push(0)
      }

      xData.forEach((itm, index) => {
        _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
      })
      yAxisData = _Ydata
    } else if (val[0].split('-')[1] != val[1].split('-')[1]) {
      let month3 = ['01', '03', '05', '07', '08', '10', '12']
      if (month3.includes(val[0].split('-')[1])) {
        for (let i = val[0].split('-')[2]; i <= 31; i++) {
          xAxisData.push(`${val[0].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        for (let i = 1; i <= val[1].split('-')[2]; i++) {
          xAxisData.push(`${val[1].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        xData.forEach((itm, index) => {
          _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
        })
        yAxisData = _Ydata
      } else if (val[0].split('-')[1] == '02') {
        for (let i = val[0].split('-')[2]; i <= 29; i++) {
          xAxisData.push(`${val[0].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        for (let i = 1; i <= val[1].split('-')[2]; i++) {
          xAxisData.push(`${val[1].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        xData.forEach((itm, index) => {
          _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
        })
        yAxisData = _Ydata
      } else {
        for (let i = val[0].split('-')[2]; i <= 30; i++) {
          xAxisData.push(`${val[0].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        for (let i = 1; i <= val[1].split('-')[2]; i++) {
          xAxisData.push(`${val[1].split('-')[1]}-${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _X.push(`${i.length == 2 ? i : i >= 10 ? i : '0' + i}`)
          _Ydata.push(0)
        }
        xData.forEach((itm, index) => {
          _Ydata.splice(_X.indexOf(itm.split('-')[2]), 1, yData[index])
        })
        yAxisData = _Ydata
      }
    }
  }
  if (radio.value == '本年' && xData.length !== 0) {
    let _Y = []
    for (let i = 1; i <= 12; i++) {
      xAxisData.push(`${xData[0].split('-')[0]}-${i >= 10 ? i : '0' + i}`)
      _Y.push(0)
    }
    let _Xdata = xAxisData
    xData.forEach((item, index) => {
      _Y.splice(xAxisData.indexOf(item), 1, yData[index])
    })
    xData
    yData
    yAxisData = _Y
  }
  if (radio.value == '本年' && xData.length === 0) {
    let _Y = []
    for (let i = 1; i <= 12; i++) {
      xAxisData.push(`${val[0].split('-')[0]}-${i >= 10 ? i : '0' + i}`)
      _Y.push(0)
    }
    yAxisData = _Y
  }
  initChartStatic(
    'chartLine',
    generateBaseOptions({
      xAxis: {
        data: xAxisData,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        }
      },
      legend: {
        show: true,
        textStyle: {
          color: '#000'
        }
      },
      yAxis: [
        {
          type: 'value',
          nameTextStyle: {
            color: 'rgba(153, 153, 153, 1)',
            'font-family': 'AlibabaPuHuiTi',
            fontSize: '13px'
          },
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
      color: ['#5470c6'],
      series: [
        {
          name: '收获趋势图',
          data: yAxisData,
          type: 'line',
          smooth: false
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      }
    })
  )
}
//查询
const onSubmit = () => {
  baseCode.value = formData.value.baseCode
  plotCode.value = formData.value.plotCode
  initChartPie1()
  initChartPie2()
  initChartBar1()
  initChartBar2()
  initChartBar3()
  handleRadioChange(radio.value)
}
//年月切换
const handleRadioChange = (e) => {
  dateData.value=[]
  let data = new Date()
  let _ANu = 0
  let type = 'month'
  let dataList = []
  if (e == '本月') {
    type = 'month'
    let monthList = ['01', '03', '05', '07', '08', '10', '12']
    let month = data.getMonth() + 1 > 10 ? data.getMonth() + 1 : '0' + (data.getMonth() + 1)
    let years = data.getFullYear()
    if (monthList.includes(month)) {
      _ANu = 1
      dataList.push(`${years}-${month}-01`)
      dataList.push(`${years}-${month}-31`)
    } else if (month == '02') {
      _ANu = 2
      dataList.push(`${years}-${month}-01`)
      dataList.push(`${years}-${month}-29`)
    } else {
      _ANu = 3
      dataList.push(`${years}-${month}-01`)
      dataList.push(`${years}-${month}-30`)
    }
  } else {
    _ANu = 3
    type = 'year'
    let year = data.getFullYear()
    dataList.push(`${year}-01-01`)
    dataList.push(`${year}-12-31`)
  }
  //年月日
  initChartLine(dataList, _ANu, type)
}
//时间选择
const message = useMessage() // 消息弹窗
const dataTime = (e) => {
  radio.value = ''
  let month = e[0].split('-')[1]
  let month2 = e[1].split('-')[1]
  let day = e[0].split('-')[2]
  let day2 = e[1].split('-')[2]
  if (month2 - month == 1 || month2 - month == 0) {
    if (month == month2) {
      initChartLine(e, 4, 'month')
    } else {
      let _Day = 30 - Number(day) + Number(day2)
      _Day >= 30 ? message.warning('选择的日期不能超过30天') : initChartLine(e, 4, 'month')
    }
  }
}
//重置
const offSubmit = () => {
  baseCode.value = ''
  plotCode.value = ''
  initChartPie1()
  initChartPie2()
  initChartBar1()
  initChartBar2()
  initChartBar3()
  handleRadioChange(radio.value)
}
onMounted(() => {

  initChartPie1()
  initChartPie2()
  initChartBar1()
  initChartBar2()
  initChartBar3()
  handleRadioChange(radio.value)
})
</script>
<style lang='scss' scoped>
.chartNull {
  background-size: 45% 80%;
  background-position: center center;
  background-repeat: no-repeat  ;
  background-image: url(../../../assets/imgs/chartNull.png);

}
</style>