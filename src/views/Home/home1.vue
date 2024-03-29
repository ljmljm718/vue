<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {
  warnRecordList,
  deviceInfoPage
} from './apis'
import {formatTime} from '@/utils/index'
import {DICT_TYPE} from '@/utils/dict'
// import {generateBaseOptions, initChartStatic} from "@/utils/bigscreenTool";
import {
  initChartStatic,
  generateBaseOptions
} from "../../utils/bigscreenTool/index";

const initChart = async () => {
  // let res = await MonthSaleData()
  initChartStatic(
    "chart",
    generateBaseOptions({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        left: 'right',
        top: 'center',
        orient: "vertical"
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {value: 1048, name: 'Search Engine'},
            {value: 735, name: 'Direct'}
          ]
        }
      ]
    })
  );
}
const loading = ref(false)
setTimeout(() => {
  loading.value = false
}, 3000)
const cardList = ref([
  {
    id: '1',
    title: '设备总数'
  },
  {
    id: '2',
    title: '水质监测'
  },
  {
    id: '3',
    title: '摄像头'
  },
  {
    id: '4',
    title: '气象站'
  },
  {
    id: '5',
    title: '预警数量'
  },
])

const tableData = ref([])
const getTableData = async () => {
  const {list = []} = await warnRecordList();
  tableData.value = list
}
getTableData()

const getDeviceInfoPage = async () => {
  const {list} = await deviceInfoPage()
  console.log('getDeviceInfoPage', list);
}
getDeviceInfoPage()

onMounted(() => {
  initChart()
})
</script>
<template>
  <div>
    <div class="flex space-x-2 justify-between">
      <div
        :class="`w-full top-bg-${index + 1}`"
        style="aspect-ratio: 2 "
        v-for="(item, index) in cardList"
        :key="item.id"
      >{{ item.title }}
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4 py-4">
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>设备运行状态</span>
          </div>
          <el-divider class="!my-3"/>
          <div class="left1">
            <div id="chart"></div>
          </div>
        </el-skeleton>
      </el-card>
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>养殖品种</span>
          </div>
          <el-divider class="!my-3"/>
          <div class="p-1">
            <div
              class="text-center py-2"
              style="background: linear-gradient(to right, #79cefe00, #79cefeA0, #79cefe00);"
            >养殖物名称: 黄河口大闸蟹
            </div>
            <div style="border: 1px solid red;" class="h-10 mt-3"></div>
          </div>
        </el-skeleton>
      </el-card>
      <el-card class="col-span-2">
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>实时监测数据</span>
          </div>
          <el-divider class="!my-3"/>
          <div class="grid gap-2 grid-cols-5 grid-rows-4 h-[10rem]">
            <div
              class="row-span-2 flex flex-col items-center justify-center"
              style="border: 1px solid #5293EAA0;background-color: #5293EA30;"
            >
              <div>环境监测</div>
            </div>
          </div>
        </el-skeleton>
      </el-card>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>设备巡检</span>
          </div>
          <el-divider class="!my-3"/>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <img src="/images/blue.png" alt="" class="w-full h-[6rem]"
                   style="object-fit: contain;border: 1px solid red;"/>
              <div class="flex items-center px-3 py-1"
                   style="background: linear-gradient(to right, #7acfffA0, #7acfff00);">
                <span>气象站</span>
              </div>
              <div></div>
            </div>
          </div>
        </el-skeleton>
      </el-card>
      <el-card>
        <el-skeleton :loading="loading" animated>
          <div class="flex pl-7 title-icon">
            <span>预警信息</span>
          </div>
          <el-divider class="!my-3"/>
          <el-table :data="tableData" stripe max-height="240" fit border>
            <el-table-column label="塘口名称" prop="plotCode" min-width="100px"
                             show-overflow-tooltip/>
            <el-table-column label="设备" prop="deviceCode" min-width="100px"
                             show-overflow-tooltip/>
            <el-table-column label="预警信息" prop="warnInfo" min-width="100px"
                             show-overflow-tooltip/>
            <el-table-column label="时间" prop="warnTime" min-width="100px" show-overflow-tooltip>
              <template #default="scope">
                <span>{{ formatTime(scope.row.warnTime, 'yyyy-MM-dd') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="warnStatus" min-width="100px" show-overflow-tooltip>
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_STATUS" :value="scope.row.warnStatus"/>
              </template>
            </el-table-column>
          </el-table>
        </el-skeleton>
      </el-card>
    </div>
  </div>
</template>


<style lang="scss" scoped>
#chart {
  height: 10rem;
}

.title-icon {
  background-image: url(./assets/titleIcon.png);
  background-repeat: no-repeat;
  background-position: left center;
}
.left1{
  //width: 100%;
  //height: 100px;
}

@for $i from 1 through 5 {
  .top-bg-#{$i} {
    background-image: url(./assets/top#{$i}.png);
    background-size: 100% 100%;
  }
}
</style>
