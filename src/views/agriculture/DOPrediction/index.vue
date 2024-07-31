<template>
  <div class="w-full">
    <div class="md:col-span-3 mb-4">
      <el-card>
        <el-select
          v-model="selectedDeviceName"
          size="large"
          style="width: 240px"
          @change="filterData"
        >
          <el-option
            v-for="item in allData"
            :key="item.id"
            :label="item.deviceName"
            :value="item.deviceName"
          />
        </el-select>
        <div v-if="filteredData.length" class="flex space-x-35 mt-4">
          <div v-for="(data, index) in filteredData" :key="index">
            <span> {{ data.title }} :</span>
            <span class="pl-3">{{ data.value }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <el-card>
        <div class="flex mb-4">
          <div class="font-bold">溶解氧当前值：</div>
          <div class="font-bold text-#009688">
            {{ dataValue }}
            <span v-if="dataValue !== '暂无数据'">{{ yyUnit }}</span>
          </div>
        </div>
        <div class="flex items-center my-2 bg-[#fdeceb] text-[#E31205] p-2">
          <img src="./assets/warnIcon.png" class="w-4 h-4 mr-2" />
          <span>设备警告：{{ warningMessage }}</span>
        </div>

      </el-card>
      <el-card class="w-full">
        <div class="font-bold mb-4">增氧机参数</div>
        <div class="flex h-17 gap-3 mx-3">
          <div
            class="flex-1 bg-#E5F4F3 text-center border-0 border-t-3.5 border-t-#009688 border-solid p-2"
            ><span class="text-#666 block">当前功率</span>
            <span class="text-#333 block">{{ currentPower }}</span></div
          >
          <div
            class="flex-1 bg-#eef7ee text-center border-0 border-t-3.5 border-t-#59b756 border-solid p-2"
          >
            <span class="text-#666 block">建议功率</span>
            <span class="text-#333 block">{{ suggestNumList[0] }}</span>
          </div>
        </div>
        <div class="text-#009688 mx-3 my-2">调整建议：</div>
        <span class="block mx-3">{{ suggestMessage }}</span>
        <div class="flex justify-end mr-3">
          <el-button type="primary" color="#009688">去调整</el-button></div
        >
      </el-card>
      <el-card>
        <div class="font-bold mb-4">评分占比分析图</div>
      </el-card>
    </div>

    <div class="md:col-span-3 mt-4">
      <el-card>
        <div class="flex justify-between items-center p-4">
          <div class="font-bold">实时数据</div>
          <div class="flex items-center">
            <div class="flex items-center mr-9">
              <img src="./assets/data1.png" class="w-6 h-3 mr-2" />
              <div>数据1</div>
            </div>
            <div class="flex items-center mr-9">
              <img src="./assets/data2.png" class="w-6 h-3 mr-2" />
              <div>数据2</div>
            </div>
            <div class="flex items-center mr-9">
              <img src="./assets/data3.png" class="w-6 h-3 mr-2" />
              <div>数据3</div>
            </div>
            <el-select v-model="value" placeholder="2024-07-24" size="large" style="width: 240px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </el-card>
      <div id="radarChart" class="w-400 h-30"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { getBasicInfo, getChartData, getCurrentPower, getScore } from './api'
import { log } from 'console'
//基本信息
const allData = ref<any[]>([])
const selectedDeviceName = ref('')
const filteredData = ref<any[]>([])
const collectionTime = ref('')
const dataValue = ref('')
const yyUnit = ref('')
const getallData = async (deviceKind) => {
  const res = await getBasicInfo({ deviceKind })
  console.log('ssssss', res)
  allData.value = res
  if (res.length > 0) {
    yyUnit.value = res[0].yyUnit
    const isValidTimestamp = (timestamp) => {
      const date = new Date(timestamp)
      return !isNaN(date.getTime())
    }
    collectionTime.value = isValidTimestamp(res[0].collectionTime)
      ? new Date(res[0].collectionTime).toISOString().split('T')[0]
      : 'Invalid Date'
  }
}
const filterData = () => {
  const selectedItem = allData.value.find((item) => item.deviceName === selectedDeviceName.value)
  if (selectedItem) {
    dataValue.value = selectedItem.dataValue
    filteredData.value = [
      { title: '增氧机状态', value: selectedItem.deviceStatus },
      { title: '地块名称', value: selectedItem.plotName },
      {
        title: '通信时间',
        value: collectionTime.value
      },
      { title: '负责人', value: selectedItem.contact }
    ]
  } else {
    filteredData.value = []
    yyUnit.value = ''
  }
}

const currentPower = ref<any[]>([])
const getCurrentPowerInfo = async (devicesId, subDevicesName) => {
  const _res = await getCurrentPower({ devicesId, subDevicesName })
  currentPower.value = _res
  // console.log('currentPower',currentPower.value);
}
getCurrentPowerInfo('1777173933829857345', '当前功率')
//当前功率写死放在哪个参数上（还有设备id119）

const ScoreData = ref<any[]>([])

const factorName = ref<string[]>([])
const targetNum = ref<number[]>([])
const currentNum = ref<number[]>([])
const suggestNumList = ref<string[]>([])
const warningList = ref<string[]>([])
const suggestList = ref<string[]>([])
const warningMessage = ref<string>('')
const suggestMessage = ref<string>('')

const getScoreInfo = async (equipId) => {
  const ScoreData = await getScore({ equipId })
  console.log('score', ScoreData)
  targetNum.value = ScoreData.targetNum.map(Number) || []
  currentNum.value = ScoreData.currentNum.map(Number) || []
  // suggestNumList.value = ScoreData.suggestNumList.map((item) => Number(item.replace('%', ''))) || []
  suggestNumList.value = ScoreData.suggestNumList || []
  factorName.value = ScoreData.factorName || []
  suggestList.value = ScoreData.suggestList || []
  warningList.value = ScoreData.warningList || []
  // console.log('sdadsdasds',targetNum.value,currentNum.value,suggestNumList.value,factorName.value,suggestList.value,warningList.value);
  warningMessage.value = warningList.value.join('; ');
  suggestMessage.value = suggestList.value.join('; ');
}
getScoreInfo('1777173933829857345')


//画图
// const radarChartRef = ref(null)
// const initRadarChart = () => {

// }

// 初始化
onMounted(async () => {
  await getallData(119)
  if (allData.value.length > 0) {
    selectedDeviceName.value = allData.value[0].deviceName
    filterData()
  }
})
//根据下拉框获取设备id？
// const handleSelectChange = (item) => {
//   console.log("ITEM", item);
//   getBasicData(item)
// }
</script>