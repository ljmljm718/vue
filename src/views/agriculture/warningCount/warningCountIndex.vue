<template>
  <ContentWrap>
    <el-row>
      新增统计
    </el-row>
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
    预警折现图
    <div id="main" style="width: 100%;height:400px;"></div>
  </ContentWrap>
</template>


<script setup lang="ts">
import {WarningRecordApi, WarningCountVO} from "@/api/kaizhou/warningrecord";

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
    //查询新增数量折线图数据并进行对象赋值
    const countList = await WarningRecordApi.getCountListByNowTime(6)
    console.log(countList)
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getCount()
})
</script>
<style scoped lang="scss">

</style>
