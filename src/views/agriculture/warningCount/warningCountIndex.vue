<template>
  <ContentWrap>
    <el-row>
      <div class="flex flex-wrap gap-4">
        <el-card style="width: 750px;text-align: center" shadow="always">
          <div>
            今日报警
          </div>
          <div>
            {{ warningCountVO.todayCountNum }}
          </div>
        </el-card>
        <el-card style="width: 750px;text-align: center" shadow="hover">
          <div>
            近30天报警
          </div>
          <div>
            {{ warningCountVO.thirtyDayCountNum }}
          </div>
        </el-card>
      </div>
    </el-row>
  </ContentWrap>
  <ContentWrap>
    预警统计趋势图
    <div id="echarts1" style="width: 100%;height:400px;"></div>
  </ContentWrap>
</template>


<script setup lang="ts">
import {WarningRecordApi, WarningCountVO} from "@/api/kaizhou/warningrecord";
// 如果直接使用原生ECharts
import * as echarts from 'echarts';
const warningCountVO = ref<WarningCountVO>(
  {
    todayCountNum: 0, // 今日新增
    thirtyDayCountNum: 0 // 近30日新增数量
  }
)//新增数量对象
const loading = ref(true) // 列表的加载中
/**
 * 查询新增数量对象
 */
const getCount = async () => {
  loading.value = true
  try {
    //查询新增数量并进行对象赋值
    const countMap = await WarningRecordApi.getCountSum()
    warningCountVO.value = countMap

  } finally {
    loading.value = false
  }
}

const setChart1 = async () => {
  loading.value = true
  //查询新增数量折线图数据并进行对象赋值
  const countList = await WarningRecordApi.getCountListByNowTime(6)
  let myChart = echarts.init(document.getElementById("echarts1"))
  myChart.setOption({
    xAxis: {
      type: 'category',
      data: countList.xList
    },
    yAxis: {
      type: 'value',
      data: countList.yList
    },
    series: [
      {
        data: countList.yList,
        type: 'line',
        smooth: true
      }
    ]
  })
  loading.value = false
}

/** 初始化 **/
onMounted(() => {
  getCount()
  setChart1()
})
</script>
<style scoped lang="scss">

</style>
