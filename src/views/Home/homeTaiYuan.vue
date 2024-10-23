<script setup lang="ts">
import { 
  getNumberByLandBlockId,
  getSortNumberByDay,
  getNameQuantityByDateAndPlotId,
  getSortNumberByCustomize,
  countDay,
  countMonth,
  devicePageList,
  snapPage,
  diseaseWarnInfo,

} from './apis'
import { onMounted,ref } from 'vue'
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo'
import { formatTime } from '@/utils/index'
import dayjs from 'dayjs'
import { initChartStatic, generateBaseOptions } from '@/utils/bigscreenTool/index'

const defaultProps = { children: 'child', label: 'name' }
/** 搜索节点过滤 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}
const categoryTree = ref<ParkInfoVO[]>([]) // 列表的数据
const plotName = ref('') //地块ID
const treeLoading = ref<boolean>(false)
/** 查询基地地块列表 */
const getCategoryList = async () => {
  treeLoading.value = true
  const data = await ParkInfoApi.getParkTree({}).catch(() => {
    treeLoading.value = false
  })
  console.log("🚀 ~ getCategoryList ~ data:", data)
  if (!Array.isArray(data)) return;
  categoryTree.value = data
  console.log(categoryTree.value[0].child[0].id,'categoryTree.value[0].child[0].id')
  plotName.value = categoryTree.value[0].child[0].id
  getGetSortNumberByDay(categoryTree.value[0].child[0].id)
  getCountDay(categoryTree.value[0].child[0].id)
  getSnapShotDeviceOptions(categoryTree.value[0].child[0].id)
}
getCategoryList()
const handleCurrentCategoryChange = (currNodeData) => {
  console.log("🚀 ~ handleCurrentCategoryChange ~ currNodeData:", currNodeData)
  if (currNodeData.child) {
    // 这是基地
    console.log(123) 
  } else {
    // 这是地块
    console.log(999)
  }
}

const topDataList = ref<any[]>([])
const getTopDataList = async (landBlockId:string) => {
  const res = await getNumberByLandBlockId({ landBlockId })
  console.log("🚀 ~ getTopDataList ~ res:", res)
  if (!Array.isArray(res)) return;
  const tempArr = [];
  res.forEach(item => {
    const { sum = 0, number = 0, category } = item;
    tempArr.push({ title: category + '总数', value: sum });
    tempArr.push({ title: category + '种类', value: number });
  })
  topDataList.value = tempArr;
  console.log("🚀 ~ getTopDataList ~ tempArr:", tempArr)
}
getTopDataList('1838062866524188672')

// 今日抓拍
const snapShotDevice = ref<string>('');
const snapShotTime = ref<string>('');
const snapShotDeviceOptions = ref<any[]>([])
const getSnapShotDeviceOptions = async (id) => {
  let res = await devicePageList({pageNo:1,pageSize:30,deviceType:'131,134',belongPlot:id})
  console.log(res,'设别列表')
  snapShotDeviceOptions.value = res.list
  getSnapPage(res.list[0].deviceName)
}
//获取设备信息
const snapDevice = ref({})
const snapImgTotal = ref<Number>(0)
const getSnapPage = async (name) =>{
  let res = await snapPage({identifyStatus:'0',pageNo:1,pageSize:10,device:"孢子捕捉仪1",})
  console.log(res,'设备信息')
  snapDevice.value = res.list[0]
  snapImgTotal.value = res.total
}

// 抓拍图片列表
const snapPictureList = ref<any[]>([1,2,3,4]);
const getSnapPictureList = async () => {}
getSnapPictureList()

// 预警信息列表
// const preWarnList = ref<any[]>([])
// const getPreWarnList = async () => {
//   let res = await pageWranList({pageNo: 1,pageSize:10})
//   console.log(res,'预警信息列表')
//   preWarnList.value = res.list
// }
// getPreWarnList()


// 预警信息列表
const preWarnList = ref<any[]>([]), preWarnLoading = ref<boolean>(false)
const getPreWarnList = async () => {
  preWarnLoading.value = true;
  const { list } = await diseaseWarnInfo({ pageNo: 1, pageSize: 10 }).catch(() => {
    preWarnLoading.value = false;
  })
  preWarnLoading.value = false;
  console.log("🚀 ~ getPreWarnList ~ res:", list)

  if (!Array.isArray(list)) return;
  preWarnList.value = list;
}
getPreWarnList()

// 病虫害排行日月年
const diseaseList = ref<any[]>([]) // 病虫害 列表
const bugTime = ref<string>('当日')
const bugTimeRange = ref<any[]>([])
const getGetNameQuantityByDateAndPlotId = async (id, dateType = 'month') => {
  let res = await getNameQuantityByDateAndPlotId({plotId:id,dateType})
  console.log(res,'binghconghai 日月排行')
  diseaseList.value = []
  insectList.value = []
  res.forEach( (item:any) => {
    if(item.category == '病害') diseaseList.value.push(item)
    else insectList.value.push(item)
  })
}
// 病害排行 日 周 月 查询
const handleShortcutDaysChange = (e) =>{
  if(e == '本周')  getGetNameQuantityByDateAndPlotId(plotName.value,'week')
  else if(e == '本月') getGetNameQuantityByDateAndPlotId(plotName.value,'month')
  else getGetSortNumberByDay(plotName.value)
}
// 病害排行日期自定义查询
const datePickerChange = async (e) =>{
  let startTime= formatTime(bugTimeRange.value[0], 'yyyy-MM-dd HH:mm:ss')
  let endTime= formatTime(bugTimeRange.value[1], 'yyyy-MM-dd HH:mm:ss')
  let res = await getSortNumberByCustomize({landBlockId:plotName.value,startTime,endTime,})
  console.log(res['病害'],'ddddres 日期自定义')
  diseaseList.value = []
  insectList.value = []
  res['病害'].forEach( (item:any) => {
    diseaseList.value.push({
      name:item.name,
      quantity:item.number
    })
  })
  res['虫害'].forEach( (item:any) => {
    insectList.value.push({
      name:item.name,
      quantity:item.number
    })
  })
}

// 病害趋势分析
const sickTraceRadio = ref<string>('按天')
const sickTraceTimeRange = ref<any[]>([]);
const diseaseChart = ref<Object>({}) // 病害趋势 echarts 数据
const diseaseInitChart = async () =>{

  initChartStatic(
    'diseaseDomLeft',
    generateBaseOptions({
      xAxis: {
        data: diseaseChart.value.count.map( item => item.date),
        axisLine: {
          show: true,
          lineStyle: {
            color: '#a1a1aa80'
          }
        },
      },
      // legend: {
      //   show: true,
      //   orient: 'horizontal',
      //   itemWidth: 15,
      //   itemHeight: 15,
      //   // left: '80%',
      //   padding:[0,40,0,0],
      //   textStyle: {
      //     color: '#999999',
      //     fontSize: 14
      //   }
      // },
      color: ['#3aada3'],
      yAxis: [{
          name: '',
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#a1a1aa80'
            }
          },
          // minInterval:1,
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
            show: true //是否显示
          },
          axisLabel: {
            show: true, // 确保显示坐标轴标签
            color: '#999999', // 设置标签文字的颜色
            fontSize: 10,
          }
        }],
      series: {
        name: '',
        data: diseaseChart.value.count.map( (item) => item.count),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: '#d9efed'
        }
      },
      grid: {
        left: '4%',
        right: '4%',
        top: '17%',
        bottom: '10%'
      }
    })
  )
}
// 虫害趋势分析
const bugTraceRadio = ref<string>('按天')
const bugTraceTimeRange = ref<any[]>([]);
const insectChar = ref<Object>({}) // 虫害趋势 echarts 数据
const insectList = ref<any[]>([]); // 虫害列表 数据
//病虫害排行 按照日期查询
const getGetSortNumberByDay = async (id) => {
  let res = await getSortNumberByDay({landBlockId:id})
  console.log("🚀 ~ getGetSortNumberByDay ~ res:", res)
  diseaseList.value = []
  insectList.value = []
  res['病害'].forEach( (item:any) => {
    diseaseList.value.push({
      name:item.name,
      quantity:item.number
    })
  })
  res['虫害'].forEach( (item:any) => {
    insectList.value.push({
      name:item.name,
      quantity:item.number
    })
  })
}

//获取前六天时间
const timeList = ref<any[]>([])
const getTime = () =>{
  let date = new Date();
  let frontDate = new Date() 
  let year = date.getFullYear(); 
  frontDate.setDate(frontDate.getDate() - 5)//前7天减7，前N天减N
  let dateArr1 = [frontDate.getMonth() + 1,frontDate.getDate()];
  let dateArr2 = [date.getMonth() + 1,date.getDate()];
  //开始格式是M,经过以下循环变为MM
  for (let i = 0; i < dateArr1.length; i++) {
    if (dateArr1[i] >= 1 && dateArr1[i] <= 9) {
          dateArr1[i] = "0" + dateArr1[i];
      }
  }
  for (let i = 0; i < dateArr2.length; i++) {
      if (dateArr2[i] >= 1 && dateArr2[i] <= 9) {
          dateArr2[i] = "0" + dateArr2[i];
      }
  }
  let strDate1 =year +"/" + dateArr1[0] +"/" +dateArr1[1] +" " 
  let strDate2 =year +"/" + dateArr2[0] +"/" +dateArr2[1] +" "
  timeList.value = [strDate1,strDate2]  
}
getTime()
// 获取 病虫害趋势分析 默认  按天 以及自定义时间 查询
const getCountDay = async (id) =>{
  console.log(timeList.value,'timeList.value123')
  let res = await countDay({belongPark:id,category:'病害',startTime:timeList.value[0],endTime:timeList.value[1]})
  let res2 = await countDay({belongPark:id,category:'虫害',startTime:timeList.value[0],endTime:timeList.value[1]})

  diseaseChart.value = res
  console.log("🚀 ~ getCountDay ~ diseaseChart.value :", diseaseChart.value )
  insectChar.value = res2
  
  diseaseInitChart()

}

//获取 病虫害趋势 按照月查询
//  const

</script>
<template>
  <div
    class="flex space-x-[.5rem]"
    style="height: calc(100vh - 125px);"
  >
    <el-card class="w-12rem h-full">
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        class="filter-tree"
        :data="categoryTree"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        @current-change="handleCurrentCategoryChange"
      />
    </el-card>
    <div
      class="grow space-y-[1rem] flex flex-col pl-.5rem box-border"
      style="max-width: calc(100% - 38rem);"
    >
      <el-card class="h-[7rem] mr-.5rem">
        <div class="flex justify-center space-x-1rem items-center h-3.5rem">
          <div
            v-for="item, index in topDataList"
            :key="index"
            class="flex space-x-3 items-center px-1.3rem py-2 rounded-2"
            style="border: 1px solid #99999980;"
          >
            <div :class="` w-2.5rem h-2.5rem disease-top-${index+1}`"></div>
            <div>
              <div>{{ item.title }}</div>
              <div class="art-font text-[1.4rem]">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-scrollbar class="space-y-[1rem] grow">
        <div class="space-y-[1rem] pr-.5rem pb-.5rem">
          <el-card class="h-[21rem]">
            <div class="title-frame">病虫害排行</div>
            <div class="flex space-x-3 py-2">
              <el-radio-group v-model="bugTime" @change="handleShortcutDaysChange">
                <el-radio-button label="当日" value="当日" />
                <el-radio-button label="本周" value="本周" />
                <el-radio-button label="本月" value="本月" />
              </el-radio-group>
              <div>
                <el-date-picker
                  v-model="bugTimeRange"
                  type="daterange"
                  range-separator="至"
                  @change="datePickerChange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="grow" style="border: 1px solid #d1d1d1;">
                  <div
                    class="h-2rem flex items-center px-1rem"
                    style="border-bottom: 1px solid #d1d1d1;"
                  >虫害</div>
                  <el-scrollbar height="12rem">
                    <div
                      class="py-4 flex justify-center space-x-3 items-center"
                      style="border-bottom: 1px solid #99999929;"
                      v-for="item in insectList"
                      :key="item.id"
                    >
                      <div class="w-6rem text-right mr-1rem">{{ item.name }}</div>
                      <div class="relative bg-[#e1e1e1] h-.5rem grow">
                        <div class="absolute left-0 top-0 w-40% h-full bg-#009688"></div>
                      </div>
                      <div class="w-3rem text-left ml-1rem">{{ item.quantity }}</div>
                    </div>
                    <div
                      class="h-12rem w-full flex items-center justify-center"
                      v-if="insectList.length === 0"
                    >暂无数据</div>
                  </el-scrollbar>
                </div>
                <div class="grow" style="border: 1px solid #d1d1d1;">
                  <div
                    class="h-2rem flex items-center px-1rem"
                    style="border-bottom: 1px solid #d1d1d1;"
                  >病害</div>
                  <el-scrollbar height="12rem">
                    <div
                      class="py-4 flex justify-center space-x-3 items-center"
                      style="border-bottom: 1px solid #99999929;"
                      v-for="item in diseaseList"
                      :key="item.id"
                    >
                      <div class="w-6rem text-right mr-1rem">{{ item.name }}</div>
                      <div class="relative bg-[#e1e1e1] h-.5rem grow">
                        <div class="absolute left-0 top-0 w-40% h-full bg-#009688"></div>
                      </div>
                      <div class="w-3rem text-left ml-1rem">{{ item.quantity }}</div>
                    </div>
                    <div
                      class="h-12rem w-full flex items-center justify-center"
                      v-if="diseaseList.length === 0"
                    >暂无数据</div>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="h-[21rem]">
            <div class="flex justify-between items-center">
              <div class="title-frame">病害趋势分析</div>
              <div class="flex items-center space-x-3">
                <el-radio-group v-model="sickTraceRadio">
                  <el-radio-button label="按天" value="按天" />
                  <el-radio-button label="按月" value="按月" />
                </el-radio-group>
                <div>
                  <el-date-picker
                    v-model="sickTraceTimeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </div>
                <el-button type="primary">查询</el-button>
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>孢子数量分析</div>
                  </div>
                  <div id='diseaseDomLeft' class="h-14.5rem mt-.6rem"></div>
                </div>
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>孢子种类分析</div>
                  </div>
                  <div id='diseaseDomRight' class="h-14.5rem bg-red mt-.6rem"></div>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="h-[21rem]">
            <div class="flex justify-between items-center">
              <div class="title-frame">虫害趋势分析</div>
              <div class="flex items-center space-x-3">
                <el-radio-group v-model="bugTraceRadio">
                  <el-radio-button label="按天" value="按天" />
                  <el-radio-button label="按月" value="按月" />
                </el-radio-group>
                <div>
                  <el-date-picker
                    v-model="bugTraceTimeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </div>
                <el-button type="primary">查询</el-button>
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>虫量趋势分析</div>
                  </div>
                  <div class="h-14.5rem bg-red mt-.6rem"></div>
                </div>
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>虫类趋势分析</div>
                  </div>
                  <div class="h-14.5rem bg-red mt-.6rem"></div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </div>
    <el-scrollbar class="w-24rem h-full">
      <div class="flex flex-col space-y-[1rem] h-full">
        <el-card>
          <el-scrollbar height="calc(100vh - 440px)">
            <div class="title-frame">今日抓拍</div>
            <div class="flex justify-between space-x-2 py-2">
              <el-select v-model="snapShotDevice">
                <el-option
                  v-for="item in snapShotDeviceOptions"
                  :key="item.value"
                  :label="item.deviceName"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-model="snapShotTime"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <div class="rounded-1 h-10rem bg-#666"></div>
            <div class="grid grid-cols-4 gap-1 py-2">
              <div
                v-for="item in snapPictureList"
                :key="item"
                class="rounded-1 bg-#666 aspect-square"
              >{{item}}</div>
            </div>
            <div class="title-frame">设备信息</div>
            <div class="rounded-1 flex justify-evenly items-center bg-#00968810 p-2 my-2">
              <div>
                <div class="text-center color-[#000] text-17px mb-7px" style="font-weight:600">{{ snapDevice.monitorSpecies }}</div>
                <div class="color-[#9ea2a2] text-13px">监测作物</div>
              </div>
              <div>
                <div class="text-center flex items-center color-[#000] text-17px mb-7px" style="font-weight:600"><div :class="`${snapDevice.deviceStatus==0?'online-1': snapDevice.deviceStatus==1?'online-3':'online-2'} w-15px h-15px mr-7px`"></div> <div>{{ snapDevice.deviceStatus==0?'在线': snapDevice.deviceStatus==1?'故障':'离线'}}</div></div>
                <div class="color-[#9ea2a2] text-13px">设备状态</div>
              </div>
              <div>
                <div class="text-center color-[#000] text-17px mb-7px" style="font-weight:600">{{ snapImgTotal }}</div>
                <div class="color-[#9ea2a2] text-13px">抓拍图片</div>
              </div>
            </div>
            <div class="title-frame">抓拍信息</div>
            <el-scrollbar>
              <div class="grid grid-cols-2">
                <div v-for="item, index in  []" :key="index">
                  
                </div>
              </div>
            </el-scrollbar>
          </el-scrollbar>
          
        </el-card>
        <el-card class="h-250px">
          <div class="title-frame mb-2">预警信息</div>
          <el-scrollbar height="190px">
            <div
              class="p-3 box-border"
              v-loading="preWarnLoading"
            >
              <div
                class="py-1rem"
                style="border-top: 1px solid #99999980;"
                v-for="item in preWarnList"
                :key="item.id"
              >
                <div
                  class="line-clamp-1 mb-2 cursor-pointer font-bold text-[.9rem]"
                  :title="item.lowMsg"
                >{{ item.lowMsg }}</div>
                <div class="flex space-x-3 items-center text-[.7rem]">
                  <div class="rounded-1 bg-#fdefef px-2 py-1">{{ item.reservedFour }} {{ item.warnType }}</div>
                  <div class="text-[.8rem]">{{ formatTime(item.createTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>
<style scoped lang="scss">
.title-frame {
  font-weight: bold;
}
@for $i from 1 through  4{
  .disease-top-#{$i}{
    background-size: 100% 100%;
    background-image: url(./assets/disease-top-#{$i}.png);
  }
}
@for $i from 1 through  3{
  .online-#{$i}{
    background-size: 100% 100%;
    background-image: url(./assets/online-#{$i}.png);
  }
}
</style>