<script lang="ts" setup name="HomeWenFeng">
import { ref, onMounted } from 'vue'
import {
  initChartStatic,
  generateBaseOptions
} from '@/utils/bigscreenTool/index'

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
          type: 'bar'
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      }
  }))
}
onMounted(() => { initChart3() })


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
const dataCollectTypes = ref<Array<any>>([])

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
const dataPickerSelected = ref('New York')
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
              <el-radio-button label="New York" value="New York" />
              <el-radio-button label="Washington" value="Washington" />
              <el-radio-button label="Los Angeles" value="Los Angeles" />
              <el-radio-button label="Chicago" value="Chicago" />
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
        <div class="h-full" style="width: calc(100% - 19rem);border: 1px solid red;">
          <div class="art-font h-[1rem]">数据采集量趋势</div>
          <div style="height: calc(100% - 1rem);"></div>
        </div>
        <div class="w-[18rem] h-full" style="border: 1px solid red;">
          <div class="art-font h-[1rem]">数据采集类型</div>
          <div
            style="height: calc(100% - 1rem);"
            class="overflow-auto"
          >
            <div
              class="flex justify-between items-center"
              v-for="(item, index) in dataCollectTypes"
              :key="index"
            >
              <div>{{ index + 1 }}</div>
              <div>{{ item.title }}</div>
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
          <el-table :data="productSellList" :show-overflow-tooltip="true" :stripe="true">
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
          <el-radio-button label="New York" value="New York" />
          <el-radio-button label="Washington" value="Washington" />
          <el-radio-button label="Los Angeles" value="Los Angeles" />
          <el-radio-button label="Chicago" value="Chicago" />
        </el-radio-group>
      </el-card>
    </div>
    <el-card class="mt-4">
      <div id="chart4"></div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
#chart1, #chart2 {
  width: 100%;
  height: 3rem;
  border: 1px solid red;
}

#chart3 {
  width: 100%;
  height: 6rem;
  border: 1px solid red;
}

#chart4 {
  width: 100%;
  height: 12rem;
  border: 1px solid red;
}
</style>
