<script setup lang="ts">
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'

// 种植作物数量 chart
const initPlantCropNumChart = () => {
  initChartStatic('plantCropNum', generateBaseOptions({
    xAxis: {
      data: [1,2,3,4],
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
        data: [1,2,3,4],
        type: 'bar',
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
      left: '8%',
      right: '6%',
      top: '6%',
      bottom: '12%'
    }
  }))
}
onMounted(() => { initPlantCropNumChart() })

// 种植品种一览图
const initPlantTypeChart = (list = [
  { name: '1', value: '2' },
  { name: '4', value: '88' },
]) => {
  initChartStatic('plantTypeChart', generatePieOptions({
    legend: {
      show: true,
      top: "bottom",
      left: "center",
      bottom: '0',
      orient: 'horizontal',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#a1a1aa'
      }
    },
    color: ["#48e5e5", "#9dadb0", "#3254dd", "#feba47", "#bee5fb", "#3cd495", "#ffedb7"],
    series: [
      {
        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        data: list,
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],
  }))
}
onMounted(() => { initPlantTypeChart() })

// 数字产销
const initDigitalSaleChart = (list = [
  { name: '1', value: '2' },
  { name: '4', value: '88' },
]) => {
  initChartStatic('digitalSale', generatePieOptions({
    legend: {
      show: true,
      top: "bottom",
      left: "center",
      bottom: '0',
      orient: 'horizontal',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#a1a1aa'
      }
    },
    color: ["#48e5e5", "#9dadb0", "#3254dd", "#feba47", "#bee5fb", "#3cd495", "#ffedb7"],
    series: [
      {
        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        data: list,
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],
  }))
}
onMounted(() => { initDigitalSaleChart() })

// 数字产销 特色产品
const initFeatureProductChart = () => {
  initChartStatic('featureProduct', generateBaseOptions({
    xAxis: {
      data: [1,2,3,4],
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
        data: [1,2,3,4],
        type: 'bar',
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
      left: '8%',
      right: '6%',
      top: '6%',
      bottom: '12%'
    }
  }))
}
onMounted(() => { initFeatureProductChart() })

// 农事任务
const initAgriMissionChart = (list = [
  { name: '1', value: '2' },
  { name: '4', value: '88' },
]) => {
  initChartStatic('agriMission', generatePieOptions({
    legend: {
      show: true,
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
    color: ["#48e5e5", "#9dadb0", "#3254dd", "#feba47", "#bee5fb", "#3cd495", "#ffedb7"],
    series: [
      {
        type: "pie",
        radius: "65%",
        center: ["40%", "50%"],
        data: list,
        label: {
          formatter: "{c} - {d}%",
          shadowColor: 'transparent',
          borderColor: 'transparent',
          color: '#a1a1aa'
        },
      },
    ],
  }))
}
onMounted(() => { initAgriMissionChart() })

// 农事建议列表
const agriAdviceDataList = ref<any[]>([
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
])

// 农事建议
const selectedAgriAdvice = ref<string>('')
const agriAdviceOptions = ref<any[]>([])
const handleAgriAdviceChange = (item) => {
  console.log("🚀 ~ item:", item);
}
</script>
<template>
  <div class="space-y-3">
    <div class="flex items-stretch space-x-3">
      <div class="flex flex-col space-y-3 grow">
        <div class="grid xl:grid-cols-3 2xl:grid-cols-6 gap-3">
          <el-card
            v-for="item in 6"
            :key="item"
          >
            <div class="flex items-center space-x-1rem justify-evenly">
              <div class="w-2rem h-2rem bg-red"></div>
              <div class="w-3rem">
                <div>title</div>
                <div>value</div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="flex space-x-3 items-stretch">
          <el-card
            class="grow p-2"
            header="种植作物数量"
          >
            <div id="plantCropNum" class="w-full h-16rem"></div>
          </el-card>
          <el-card
            class="w-20rem p-2"
            header="种植品种一览图"
          >
            <div id="plantTypeChart" class="w-full h-16rem"></div>
          </el-card>
        </div>
      </div>
      <el-card
        class="w-26rem p-2"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div>农事建议</div>
            <div>
              <el-select
                v-model="selectedAgriAdvice"
                @change="handleAgriAdviceChange"
                class="!w-8rem"
              >
                <el-option
                  v-for="item in agriAdviceOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </template>
        <div
          class="w-full h-20rem overflow-auto space-y-.4rem p-2 box-border"
          v-if="agriAdviceDataList.length > 0"
        >
          <div
            v-for="item in agriAdviceDataList"
            :key="item.id"
            class="flex box-border p-3 space-x-3 shadow-md"
          >
            <div class="!w-5rem h-5rem bg-black"></div>
            <div style="width: calc(100% - 5.5rem)">
              <div>幼苗期</div>
              <div class="h-2.5rem text-.9rem line-clamp-2 pl-.5rem">描述assdfsdfgsdfsdfsdfsdf描述assdfsdfgsdfsdfsdfsdf描述assdfsdfgsdfsdfsdfsdf描述assdfsdfgsdfsdfsdfsdf描述assdfsdfgsdfsdfsdfsdf描述assdfsdfgsdfsdfsdfsdf</div>
              <div class="w-full flex justify-between items-center text-#666 text-.8rem pt-.1rem">
                <div>农事建议</div>
                <div>2024-05-05 12:12:12</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-full min-h-15rem flex flex-col justify-center space-y-2 items-center">
          <img src="/images/noData.png" class="aspect-1 w-8rem" />
          <div
            class="py-3 text-[.9rem] text-[#999]"
          >暂无数据</div>
        </div>
      </el-card>
    </div>
    <div class="flex items-stretch space-x-3">
      <el-card
        class="grow p-2"
        header="数字产销"
      >
        <div class="flex justify-between">
          <div id="digitalSale" class="w-16rem h-18rem"></div>
          <div id="featureProduct" style="width: calc(100% - 16.6rem)"></div>
        </div>
      </el-card>
      <el-card
        class="w-26rem p-2"
        header="农事任务"
      >
        <div class="shadow-md flex justify-between items-center p-3">
          <div>总农事任务:</div>
          <div></div>
        </div>
        <div id="agriMission" class="w-full h-14rem mt-3"></div>
      </el-card>
    </div>
  </div>
</template>