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
  selectBase.value = selectBaseList.list
}
getBaseDataList()

// 获取土壤墒情信息
const getSoilInfoList = async () => {
  const res = await EquipmentDataApi.environmentalDataHomePageC({})
  console.log("res", res);
}
getSoilInfoList()

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
onMounted(() => {
  initChartStatic('dataCollectChart', generateBaseOptions({
    xAxis: {
      data: [1,2,3,4,5,6,7,8,9,10],
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
        data: [2,3,4,5,3,4,3,2,1],
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
onMounted(() => {
  initChartStatic('dataShowChart', generateBaseOptions({
    xAxis: {
      data: [1,2,3,4,5,6,7,8,9,10],
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
        name: '',
        data: [2,32,14,52,311,42,31,112,19, 99],
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

// 数据采集量情况
const collectConditionDateRange = ref([])
onMounted(() => {
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
        data: [
          { name: 'ts', value: 14 },
          { name: 'ts1', value: 14 },
        ],
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
          <div class="flex px-1 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon2" />
            <div class="flex px-2 pt-1 flex-col items-center justify-center">
              <div style="font-size: 12px;">虫害种类</div>
              <div class="art-font text-lg">5个</div>
            </div>
          </div>
          <div class="flex px-1 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon2" />
            <div class="flex px-2 pt-1 flex-col items-center justify-center">
              <div style="font-size: 12px;">虫害数量</div>
              <div class="art-font text-lg">6个</div>
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
        <div class="flex justify-evenly items-center">
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon1" />
            <div class="flex flex-col items-center justify-center">
              <div>温度(℃)</div>
              <div class="art-font text-lg">28.5</div>
            </div>
          </div>
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon3" />
            <div class="flex flex-col items-center justify-center">
              <div>湿度(%)</div>
              <div class="art-font text-lg">25.8</div>
            </div>
          </div>
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon4" />
            <div class="flex flex-col items-center justify-center">
              <div>光照(lux)</div>
              <div class="art-font text-lg">9000</div>
            </div>
          </div>
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon5" />
            <div class="flex flex-col items-center justify-center">
              <div>雨量(mm)</div>
              <div class="art-font text-lg">12</div>
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
        <div class="flex justify-evenly items-center">
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon1" />
            <div class="flex flex-col items-center justify-center">
              <div>温度(℃)</div>
              <div class="art-font text-lg">28.5</div>
            </div>
          </div>
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon3" />
            <div class="flex flex-col items-center justify-center">
              <div>湿度(%)</div>
              <div class="art-font text-lg">25.8</div>
            </div>
          </div>
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon4" />
            <div class="flex flex-col items-center justify-center">
              <div>光照(lux)</div>
              <div class="art-font text-lg">9000</div>
            </div>
          </div>
          <div class="min-w-32 flex px-3 py-2 justify-between items-center">
            <el-avatar shape="square" :src="icon5" />
            <div class="flex flex-col items-center justify-center">
              <div>雨量(mm)</div>
              <div class="art-font text-lg">12</div>
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
              <el-radio-group v-model="dataShowRadio">
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