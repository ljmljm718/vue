<script setup lang="ts">
import BigscreenCalendar from './components/calendar.vue'
import {
  getAgriMissionPlan,
  getAllBase,
  getAllPlotByBaseID
} from './api'

const calendarIns = ref()
const missionList = ref<Array<any>>([])
const remindArr = ref<Array<string>>([])
const curBase = ref<any>({})
const baseList = ref<Array<any>>([])
const curPlot = ref<any>({})
const plotList = ref<Array<any>>([])
const showOptions = ref<boolean>(false)
const showOptionsBase = ref<boolean>(false)
const showingMission = ref<any>()

window.addEventListener('click', () => {
  showOptions.value = false
  showOptionsBase.value = false
})

const showOpt = (e: any) => {
  e.stopPropagation()
  showOptions.value = true
}

const showOptBase = (e: any) => {
  e.stopPropagation()
  showOptionsBase.value = true
}

const changeOpt = (item: any) => {
  curPlot.value = item
  const _date = new Date()
  getMissionPlan(`${_date.getFullYear()}-${_date.getMonth() + 1}`, item.code)
}

const changeOptBase = async (item: any) => {
  curBase.value = item
  // 根据基地ID获取地块列表
  let pList = await getAllPlotByBaseID({ parkId: curBase.value.id })
  if (!pList || !Array.isArray(pList) || pList.length === 0) {
    curPlot.value = {}
    plotList.value = []
    return
  }
  plotList.value = pList
  curPlot.value = plotList.value[0]
  // console.log("切换基地后 地块列表: ", pList)
  const _date = new Date()
  getMissionPlan(`${_date.getFullYear()}-${_date.getMonth() + 1}`, curPlot.value.code)
}

// 获取指定年月 指定地块 的农事任务列表
const getMissionPlan = async (yearMonth: string, belongPlot: string) => {
  const res = await getAgriMissionPlan({ yearMonth, belongPlot })
  if (Array.isArray(res)) {
    missionList.value = res
    remindArr.value = res.filter(item => (Array.isArray(item.planList) && item.planList.length > 0)).map(item => item.monthDate)
  }
  // console.log("哪些日期有任务: ", remindArr.value)
}

// 初始化农事任务
const initMission = async () => {
  
  // 获取基地列表 设置第0项为当前基地
  let bList = await getAllBase()
  if (!bList || !Array.isArray(bList) || bList.length === 0) {
    return
  }
  baseList.value = bList
  curBase.value = baseList.value[0]
  // console.log("基地列表: ", bList)

  // 根据基地ID获取地块列表 设置第0项为当前地块
  let pList = await getAllPlotByBaseID({ parkId: curBase.value.id })
  if (!pList || !Array.isArray(pList) || pList.length === 0) {
    return
  }
  plotList.value = pList
  curPlot.value = plotList.value[0]
  // console.log("地块列表: ", pList)

  // 获取农事任务列表
  let tmp = new Date()
  let year = tmp.getFullYear()
  let month = tmp.getMonth() + 1
  getMissionPlan(`${ year }-${ month }`, curPlot.value.code)
}
initMission()

// 显示当天的事项
const handleCalendarClick = (item: any) => {
  const formatMonthDay = (val) => val > 9 ? val : ('0' + val)
  // console.log('处理日历点击事件: ', item)
  showingMission.value = null
  showingMission.value = missionList.value.find((ele) => {
    const _date_ = item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date)
    return _date_ === ele.monthDate
  })
  // console.log("对应农事任务列表: ", showingMission.value)
  showingMission.value.monthDate = showingMission.value.monthDate ? showingMission.value.monthDate : item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date)
}

// 切换月份 重新获取农事任务列表
const handleCalendarChange = (item: Date) => {
  if (!curBase.value.id || !curPlot.value.code) {
    return
  }
  getMissionPlan(`${item.getFullYear()}-${item.getMonth() + 1}`, curPlot.value.code)
}

const missionAddPlanClass = (event: any) => {
  event.currentTarget.className = "mb-10px leading-[30px] mission-plan"
}

const missionremovePlanClass = (event: any) => {
  event.currentTarget.className = "mb-10px leading-[30px]"
}
</script>
<template>
  <div class="w-full h-full">
    <!-- 选择基地和地块 -->
    <div class="flex justify-between items-center text-[#11eeaf] cursor-pointer py-[3px]">
      <div class="relative h-[1.4rem] w-[15rem]">
        <div class="h-full text-center cursor-pointer" @click="showOptBase">
          {{ curBase.name }}
          <el-icon class="ml-3 relative top-[.1rem]"><CaretBottom /></el-icon>
        </div>
        <div
          v-if="showOptionsBase && Array.isArray(baseList) && baseList.length > 0"
          class="absolute left-0 top-[1.4rem] z-1000 w-full max-h-[8rem]"
        >
          <el-scrollbar max-height="8rem">
            <div
              v-for="item in baseList"
              :key="item.id"
              class="py-3 text-center w-full bg-[#0d1724]"
              @click="changeOptBase(item)"
            >
              {{ item.name }}
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="relative h-[1.4rem] w-[10rem]">
        <div class="h-full text-center cursor-pointer" @click="showOpt">
          {{ curPlot.name ? curPlot.name : '-----' }}
          <el-icon class="ml-3 relative top-[.1rem]"><CaretBottom /></el-icon>
        </div>
        <div
          v-if="showOptions && Array.isArray(plotList) && plotList.length > 0"
          class="absolute left-0 top-[1.4rem] z-1000 w-full max-h-[8rem]"
        >
          <el-scrollbar max-height="8rem">
            <div
              v-for="item in plotList"
              :key="item.code"
              class="py-3 text-center w-full bg-[#0d1724]"
              @click="changeOpt(item)"
            >
              {{ item.name }}
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- 日历 -->
    <div style="height: calc(100% - 2rem)">
      <div class="w-420px h-330px">
        <BigscreenCalendar
          :key="curPlot ? curPlot.code : ''"
          ref="calendarIns"
          :remind="remindArr"
          @select="
            (item) => {
              handleCalendarClick(item)
            }
          "
          @change="
            (item) => {
              handleCalendarChange(item)
            }
          "
        >
          <!-- 提示框内容 -->
          <template #tip>
            <div
              v-if="showingMission"
              class="pt-[10px] pb-[20px] px-[15px] w-full h-full box-border font-normal"
            >
              <div class="w-full text-white text-center">{{ showingMission.monthDate }}</div>
              <div class="mt-[10px] w-full h-[90px] text-center text-[#01F892]">
                <el-scrollbar>
                  <div
                    v-for="(item, index) in showingMission.planList"
                    :key="`item.planName${index}`"
                    class="tracking-widest"
                  >
                    <div
                      class="mb-10px leading-[30px]"
                      @mouseenter="missionAddPlanClass"
                      @mouseleave="missionremovePlanClass"
                    >
                      {{ item.planName }}
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </template>
        </BigscreenCalendar>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
