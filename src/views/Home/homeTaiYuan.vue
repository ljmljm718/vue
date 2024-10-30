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
  snapType
} from './apis'
import { onMounted,ref,onBeforeUnmount } from 'vue'
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
const treeRef = ref()
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
  plotName.value = categoryTree.value[0].child[0].id
  // getGetSortNumberByDay(categoryTree.value[0].child[0].id)
  getCountDay(categoryTree.value[0].child[0].id,'day')
  getCountDay2(categoryTree.value[0].child[0].id,'day')
  getSnapShotDeviceOptions(categoryTree.value[0].child[0].id)
  getTopDataList(categoryTree.value[0].child[0].id)
  getGetNameQuantityByDateAndPlotId(categoryTree.value[0].child[0].id,'month')
  getPreWarnList(categoryTree.value[0].child[0].id)
  nextTick(()=>{
        treeRef.value.setCurrentKey(categoryTree.value[0].child[0].id,true); //  当节点被点击时，更新currentNodeKey的值
     })
}
getCategoryList()
const handleCurrentCategoryChange = (currNodeData) => {
  console.log("🚀 ~ handleCurrentCategoryChange ~ currNodeData:", currNodeData)
  if (currNodeData.child) {
    // 这是基地
  } else {
    // 这是地块
    plotName.value = currNodeData.id
    // getGetSortNumberByDay(plotName.value)
    getCountDay(plotName.value,'day')
    getCountDay2(plotName.value,'day')
    getSnapShotDeviceOptions(plotName.value)
    getTopDataList(plotName.value)
    getGetNameQuantityByDateAndPlotId(plotName.value,'month')
    getPreWarnList(plotName.value)
  }
}

const topDataList = ref<any[]>([])
const getTopDataList = async (landBlockId:string) => {
  const res = await getNumberByLandBlockId({ landBlockId })
  if (!Array.isArray(res)) return;
  const tempArr = [];
  res.forEach(item => {
    const { sum = 0, number = 0, category } = item;
    tempArr.push({ title: category + '总数', value: sum });
    tempArr.push({ title: category + '种类', value: number });
  })
  topDataList.value = tempArr;
}


// 今日抓拍
const snapShotDevice = ref<string>('');
const snapShotTime = ref<string>('');
const snapShotImg = ref<string>('');
const snapPictureList = ref<any[]>([]); // 抓拍图片列表
const snapPictureList2 = ref<any[]>([]); // 抓拍图片列表
const snapShotDeviceOptions = ref<any[]>([])
const getSnapShotDeviceOptions = async (id) => {
  let res = {}
  if (process.env.NODE_ENV == "development") {
    //开发环境
    res = await devicePageList({pageNo:1,pageSize:30,deviceType:'133,138',belongPlot:id})

  } else if (process.env.NODE_ENV == "production") {
    //生产环境
    res = await devicePageList({pageNo:1,pageSize:30,deviceType:'133,138',belongPlot:id})

  }
  console.log(res,' 今日抓拍 设备列表')
  snapDevice.value = res.list[0]

  snapShotDeviceOptions.value = res.list
  snapShotDevice.value = res.list[0].deviceName
  getSnapPage(res.list[0]?.id)
  //getSnapType(res.list[0].id)
  let date =  new Date() 
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  snapShotTime.value = `${year}-${month}-${day}`
}
//今日抓拍 设备列表点击
const snapId = ref<any>() 
const selectChange = (current) => {
  snapShotDeviceOptions.value.forEach(item=>{
    if(current == item.id) {
      snapShotDevice.value = item.deviceName
      snapId.value = item.id
      getSnapPage(item.id)
      //getSnapType(item.id)
    }
  })
}
const monitorTime = ref([]) 
const snapShotChange = (date) =>{
  monitorTime.value=[]
  let data = new Date(date)
  let year = data.getFullYear()
  let month = data.getMonth()+1 >= 10 ? data.getMonth() + 1 : '0' + (data.getMonth()+1)
  let day = data.getDate() >= 10 ? data.getDate() : '0' + data.getDate()
  let time = `${year}-${month}-${day} 00:00:00`
  let time2 = `${year}-${month}-${day} 23:59:59`
  monitorTime.value.push( time )
  monitorTime.value.push( time2 )
   getSnapPage(snapId.value)
}

//获取设备信息 图片列表 以及图片总数
const snapDevice = ref({})
const snapImgTotal = ref<Number>(0)
const getSnapPage = async (id) =>{
  console.log(monitorTime.value,'monitorTime.valuemonitorTime.value')
  let res = await snapPage({identifyStatus:'0',pageNo:1,pageSize:10,device:id,monitorTime:monitorTime.value})
  snapShotImg.value = res.list[0]?.monitorPicture
  snapPictureList.value = res.list
  snapPictureList2.value = res.list 
  snapImgTotal.value = res.total
  snapDevice.value.monitorSpecies = res.list[0]?.monitorSpecies
  // console.log(res,'设备信息 v获取设备信息 图片 列表')
  pestType.value = 0
 pestTotalNum.value = 0
 pestList.value = []
  if(res.list.length > 0) getSnapType(res.list[0].id)
  

}

//今日抓拍 抓拍信息
const pestType = ref<Number>(0) // 虫害种类
const pestTotalNum = ref<Number>(0) //虫害总数量
const pestList = ref<any[]>([]) // 抓拍列表
// const pestListType = ref<boolean>(false) 
const getSnapType = async (id) => {
//  pestListType.value = false
 let res = await snapType({mainId:id})
 console.log( res , '获取抓怕信息') 
  pestType.value = res.pest_type
 pestTotalNum.value = res.pest_total_number
 pestList.value = res.pest_list

//  pestListType.value = true

}
//图片点击
const snapPictureChange = (item,index) =>{
  snapDevice.value.monitorSpecies = item.monitorSpecies

  getSnapType(item.id)
 
  snapNum1.value = snapNum.value
  snapShotImg.value = item.monitorPicture
  if(snapPictureList.value.length>4){
    left.value = (snapNum1.value - snapNum.value ) * 80
  }
  console.log(left.value,'left.valueleft.value')
  snapNum.value = index
}

// 预警信息列表
const preWarnList = ref<any[]>([]), preWarnLoading = ref<boolean>(false)
const getPreWarnList = async (id) => {
  console.log(id,' 预警信息 idid')
  preWarnLoading.value = true;
  const { list } = await diseaseWarnInfo({ pageNo: 1, pageSize: 10,belongPlot:id }).catch(() => {
    preWarnLoading.value = false;
  })
  preWarnLoading.value = false;
  console.log(list ,' 预警信息列表')

  if (!Array.isArray(list)) return;
  preWarnList.value = list;
}


// 病虫害排行日月年
const diseaseList = ref<any[]>([]) // 病虫害 列表
const bugTime = ref<string>('本月')
const bugTimeRange = ref<any[]>([])
// const getBugTime = () => {
//   const year = new Date().getUTCFullYear()
//   const month = new Date().getMonth()+1
//   const first = new Date( new Date().getFullYear(),new Date().getMonth()+1 ,1).getDate()
//   const last = new Date( new Date().getFullYear(),new Date().getMonth()+1 ,0).getDate()
//     bugTimeRange.value.push(`${year}-${month}-${first}`)
//     bugTimeRange.value.push(`${year}-${month}-${last}`)
// }
const getGetNameQuantityByDateAndPlotId = async (id, dateType = 'month') => {
  let res = await getNameQuantityByDateAndPlotId({plotId:id,dateType})
  diseaseList.value = []
  insectList.value = []
  res.forEach( (item:any) => {
    if(item.category == '病害') diseaseList.value.push(item)
    else insectList.value.push(item)
  })
}
// 获取 某一天 周一到周日的时间
const getDaysOfWeek = (date) => {
      const days = [];
      for (let i = 1; i <= 7; i++) {
        days.push(new Date(date));
      }
      // Set to Monday
      days[0].setDate(days[0].getDate() - days[0].getDay() + 1);
      // Set to Sunday
      days[6].setDate(days[0].getDate() + 6);
      return days;
    };
// 病害排行 日 周 月 查询
const handleShortcutDaysChange = (e) =>{
  const year = new Date().getUTCFullYear()
  const month = new Date().getMonth()+1
  const first = new Date( new Date().getFullYear(),new Date().getMonth()+1 ,1).getDate()
  const last = new Date( new Date().getFullYear(),new Date().getMonth()+1 ,0).getDate()
  bugTimeRange.value = []
  if(e == '本周') {
    let day = new Date()
     bugTimeRange.value.push(`${new Date(getDaysOfWeek(day)[0]).getFullYear()}-${new Date(getDaysOfWeek(day)[0]).getMonth()+1}-${new Date(getDaysOfWeek(day)[0]).getDate()}`)
     bugTimeRange.value.push(`${new Date(getDaysOfWeek(day)[6]).getFullYear()}-${new Date(getDaysOfWeek(day)[6]).getMonth()+1}-${new Date(getDaysOfWeek(day)[6]).getDate()}`)
    getGetNameQuantityByDateAndPlotId(plotName.value,'week')
  }else if(e == '本月'){
    bugTimeRange.value.push(`${year}-${month}-${first}`)
    bugTimeRange.value.push(`${year}-${month}-${last}`)
    getGetNameQuantityByDateAndPlotId(plotName.value,'month')
  }else if(e == '当日'){
    let data= new Date().getDate()
    bugTimeRange.value.push(`${year}-${month}-${data}`)
    bugTimeRange.value.push(`${year}-${month}-${data}`)
    getGetSortNumberByDay(plotName.value)
  } 
}
handleShortcutDaysChange('本月')
// 病害排行日期自定义查询
const datePickerChange = async (e) =>{
  let startTime= formatTime(bugTimeRange.value[0], 'yyyy-MM-dd HH:mm:ss')
  let endTime= formatTime(bugTimeRange.value[1], 'yyyy-MM-dd HH:mm:ss')
  let res = await getSortNumberByCustomize({landBlockId:plotName.value,startTime,endTime,})
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
  if(sickTraceRadio.value != '按月' ){
    diseaseChart.value.count.forEach((item)=>{
      let data = item.date.split('-')
      item.date = `${data[1]}-${data[2]}`
    })
  }
  initChartStatic(
        "diseaseDomLeft",
        generateBaseOptions({
          xAxis: {
            data: diseaseChart.value.count.map( item => item.date),
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
          },
          legend: {
            show: false,
            orient:'horizontal',
            itemWidth: 15,
            itemHeight: 15,
         },
          yAxis: {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#fff", //网格线颜色
                width: 1, //网格线的加粗程度
                type: "dashed", //网格线类型
              },
            },
            splitArea: {
              //网格区域
              show: false, //是否显示
            },
          },
          color:['#42b1a8'],
          series:
           [
            {
              name: '孢子数量分析',
              data: diseaseChart.value.count.map( (item) => item.count),
              type: "line",
              smooth: true,
              symbol:'none',
              areaStyle:{
                color:'#d3edea'
              }
            }
          ],
          grid: {
              bottom: "27%",
            },
        })
      );
  
}
const diseaseInitChart2 = async () =>{
  const countByType = Object.keys(diseaseChart.value.countByType)
  if(sickTraceRadio.value != '按月' ){
    diseaseChart.value.countByType[countByType[0]].forEach((item)=>{
      let data = item.date.split('-')
      item.date = `${data[1]}-${data[2]}`
    })
  }
  let series = []
  countByType.forEach(item=>{
    series.push({
        name: item,
        data: diseaseChart.value.countByType[item].map( (item) => item.count),
        type: "line",
        barWidth: "20",
        smooth: true,
        symbol:'none',
      })
  })
  initChartStatic(
    'diseaseDomRight',
    generateBaseOptions({
            xAxis: {
              data: diseaseChart.value.countByType[countByType[0]].map( item => item.date),
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#000",
                },
              },
            },
            legend: {
              show: true,
              orient:'horizontal',
              itemWidth: 15,
              itemHeight: 15,
              top:'bottom',
              left:'center',
              textStyle:{
                color:'#000',
                fontSize:'13px'
              }
          },
            yAxis: {
              type: "value",
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#000",
                },
              },
              splitLine: {
                //网格线
                show: true, //是否显示
                lineStyle: {
                  //网格线样式
                  color: "#fff", //网格线颜色
                  width: 1, //网格线的加粗程度
                  type: "dashed", //网格线类型
                },
              },
              splitArea: {
                //网格区域
                show: false, //是否显示
              },
            },
            color:['#009688','#73c0de',''],
            series,
            grid: {
            bottom: "27%",
          },
          })

  )

}
const insectInitChart = () => {
  const countByType = Object.keys(insectChart.value.countByType)
  if(bugTraceRadio.value != '按月' ){
    insectChart.value.countByType[countByType[0]].forEach((item)=>{
      let data = item.date.split('-')
      item.date = `${data[1]}-${data[2]}`
    })
  }
  initChartStatic(
    'insectNumChart',
    generateBaseOptions({
            xAxis: {
              data: insectChart.value.countByType[countByType[0]].map( item => item.date),
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#000",
                },
              },
            },
            legend: {
              show: false,
              orient:'horizontal',
              itemWidth: 15,
              itemHeight: 15,
              top:'bottom'
          },
            yAxis: {
              type: "value",
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#000",
                },
              },
              splitLine: {
                //网格线
                show: true, //是否显示
                lineStyle: {
                  //网格线样式
                  color: "#fff", //网格线颜色
                  width: 1, //网格线的加粗程度
                  type: "dashed", //网格线类型
                },
              },
              splitArea: {
                //网格区域
                show: false, //是否显示
              },
            },
            color:['#009688'],
            series: [
              {
                name: '虫害数量趋势',
                data: insectChart.value.count.map( (item) => item.count),
                type: "line",
                barWidth: "20",
                smooth: true,
                symbol:'none',
                areaStyle:{
                  color:'#dcf1ef'
                }
              },
            ],
            grid: {
            bottom: "27%",
          },
          })

  )

}
const insectInitChart2 = () => {
  const countByType = Object.keys(insectChart.value.countByType)
  if(bugTraceRadio.value != '按月' ){
    insectChart.value.countByType[countByType[0]].forEach((item)=>{
      // let data = item.date.split('-')
      // item.date = `${data[1]}-${data[2]}`
    })
  }
  let series = []
  countByType.forEach(item=>{
    series.push({
        name: item,
        data: insectChart.value.countByType[item].map( (item) => item.count),
        type: "line",
        barWidth: "20",
        smooth: true,
        symbol:'none',
      })
  })
  initChartStatic(
    'insectTypeChart',
    generateBaseOptions({
            xAxis: {
              data: insectChart.value.countByType[countByType[0]].map( item => item.date),
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#000",
                },
              },
            },
            legend: {
              show: true,
              orient:'horizontal',
              itemWidth: 15,
              itemHeight: 15,
              top:'bottom',
              left:'center',
              textStyle:{
                color:'#000',
                fontSize:'13px'
              }
          },
            yAxis: {
              type: "value",
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#000",
                },
              },
              splitLine: {
                //网格线
                show: true, //是否显示
                lineStyle: {
                  //网格线样式
                  color: "#fff", //网格线颜色
                  width: 1, //网格线的加粗程度
                  type: "dashed", //网格线类型
                },
              },
              splitArea: {
                //网格区域
                show: false, //是否显示
              },
            },
            color:['#009688','#73c0de',''],
            series:series,
            grid: {
              bottom: "27%",
            },
          })

  )

}
// 虫害趋势分析
const bugTraceRadio = ref<string>('按天')
const bugTraceTimeRange = ref<any[]>([]);
const insectChart = ref<Object>({}) // 虫害趋势 echarts 数据
const insectList = ref<any[]>([]); // 虫害列表 数据
//病虫害排行 按照日期查询
const getGetSortNumberByDay = async (id) => {
  let res = await getSortNumberByDay({landBlockId:id})
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
  let strDate1 =year +"-" + dateArr1[0] +"-" +dateArr1[1] +" " 
  let strDate2 =year +"-" + dateArr2[0] +"-" +dateArr2[1] +" "
  timeList.value = [strDate1,strDate2]  
}
getTime()
// 获取 病虫害趋势分析 默认  按天 以及自定义时间 查询
const getCountDay = async (id,type) =>{
  sickTraceTimeRange.value = []
  sickTraceTimeRange.value.push(timeList.value[0])
  sickTraceTimeRange.value.push(timeList.value[1])
  let res = await countDay({belongPark:id,category:'病害',startTime:timeList.value[0],endTime:timeList.value[1],type})  //day

  console.log(res,'病虫害趋势分析')
  diseaseChart.value = res
  // insectChar.value = res2
  
  diseaseInitChart()
  diseaseInitChart2()
}
const getCountDay2 = async (id,type) =>{
  let res = await countDay({belongPark:id,category:'虫害',startTime:timeList.value[0],endTime:timeList.value[1],type})

  insectChart.value = res
  
  insectInitChart()
  insectInitChart2()
}

//病害 虫害 按天 按月  获取数据
const sickTraceChange = (e) => {
  if(e == '按天') {
     getCountDay(plotName.value,'day')
     sickTraceTimeRange.value = []
     sickTraceTimeRange.value.push(timeList.value[0])
     sickTraceTimeRange.value.push(timeList.value[1])
  }else{
     sickTraceTimeRange.value = []
     
     getCountMonthdisease(plotName.value)
  }
}
sickTraceChange('按天')
const bugTraceChange = (e) => {
  if(e == '按天')  getCountDay2(plotName.value,'day')
  else getCountDayInsect(plotName.value)
}
//病害 虫害 按天 按月  获取数据
const sickTraceTimeChange = async (e) =>{
  sickTraceTimeRange.value
  // sickTraceRadio.value = ''
}
//病害搜索
const sickTraceSearch = async () =>{
  let startTime= formatTime(sickTraceTimeRange.value[0], 'yyyy-MM-dd')
  let endTime= formatTime(sickTraceTimeRange.value[1], 'yyyy-MM-dd')
  // let startData = startTime.split('-')[1]
  // let endData = endTime.split('-')[1]
  // console.log(startData,'dasssssd')
  let res = await countDay({belongPark:plotName.value,category:'病害',startTime,endTime,type: sickTraceRadio.value == '按月'? 'month' : 'day'  })
  console.log(res ,' zidingyihsijain cahxun ')
  diseaseChart.value = res
  diseaseInitChart()
  diseaseInitChart2()
}
const bugTraceTimeChange = async (e) => {
  // bugTraceRadio.value = ''
}
//虫害搜素
const bugTraceSeacrh = async () => {
  let startTime= formatTime(bugTraceTimeRange.value[0], 'yyyy-MM-dd')
  let endTime= formatTime(bugTraceTimeRange.value[1], 'yyyy-MM-dd')
  let res = await countDay({belongPark:plotName.value,category:'虫害',startTime,endTime,type:bugTraceRadio.value == '按月' ? 'month' :'day'})
  insectChart.value = res
  insectInitChart()
  insectInitChart2()
}
//获取 病虫害趋势 按照月查询
const getCountMonthdisease = async (id) => {
  let res = await countMonth({belongPark:id,category:'病害'})
  diseaseChart.value = res
  diseaseInitChart()
  diseaseInitChart2()
}
const getCountDayInsect = async (id) => {
  let res = await countMonth({belongPark:id,category:'虫害'})
  insectChart.value = res
  insectInitChart()
  insectInitChart2()
}

//处理今日抓拍图片移动
const snapDom = ref (null)
const snapNum = ref (0)
const snapNum1 = ref (0)
const left = ref<number>(0)
const snapDomWidth = ref<number>()
onMounted(()=>{
  console.log(snapDom.value.offsetWidth/4,'width9999')
  snapDomWidth.value = snapDom.value.offsetWidth
})
const tabLeft = (str) => { 
  if(str == 'right'){
    if(snapNum.value >= snapPictureList.value.length-1 ){
      left.value = 0
      snapNum .value = 0
      snapNum1.value = 0
      snapShotImg.value = snapPictureList.value[snapNum.value].monitorPicture
      snapDevice.value.monitorSpecies  = snapPictureList.value[snapNum.value].monitorSpecies
      getSnapType(snapPictureList.value[snapNum.value].id)
    }else{

      if(snapPictureList.value.length>4 && snapNum.value >=3){
        left.value = (snapNum1.value - snapNum.value ) * 80
      }
      snapNum1.value = snapNum.value

      snapNum.value++
      console.log(snapNum.value)
      snapShotImg.value = snapPictureList.value[snapNum.value].monitorPicture
      snapDevice.value.monitorSpecies  = snapPictureList.value[snapNum.value].monitorSpecies

      getSnapType(snapPictureList.value[snapNum.value].id)
    }
  }else{
    if(snapNum.value <= 0){
      
      if(snapPictureList.value.length>4){
        left.value = (3 - snapPictureList.value.length) * 80
      }

      snapNum.value =  snapPictureList.value.length-1
      snapNum1.value =  snapPictureList.value.length-2
     
      snapShotImg.value = snapPictureList.value[snapNum.value].monitorPicture
      getSnapType(snapPictureList.value[snapNum.value].id)
      snapDevice.value.monitorSpecies  = snapPictureList.value[snapNum.value].monitorSpecies

    }else{
      console.log(snapNum1.value,'snapNum1.value')
      console.log(snapNum.value,'snapNum.value')
      if(snapPictureList.value.length>4){
        left.value = (snapNum1.value - snapNum.value ) * 80
      }else{ 
        // left.value = (snapNum1.value - snapNum.value ) * 80

      }
      left.value = (snapNum1.value - snapNum.value ) * 80
      snapNum1.value = snapNum.value
      snapNum.value--
      snapDevice.value.monitorSpecies  = snapPictureList.value[snapNum.value].monitorSpecies
      snapShotImg.value = snapPictureList.value[snapNum.value].monitorPicture
      getSnapType(snapPictureList.value[snapNum.value].id)
    }
  }
  console.log(left.value,'left.valueleft.value9999')
}

</script>
<template>
  <div
    class="flex space-x-[.5rem]"
    style="height: calc(100vh - 125px);"
  >
    <el-card class="w-12rem h-100vh">
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
        <div class="flex justify-evenly space-x-1rem items-center h-3.5rem">
          <div
            v-for="item, index in topDataList"
            :key="index"
            :class="`flex space-x-3 items-center px-1.5rem py-3 rounded-2  homt-top-bg${index+1}`"
            
          >
            <div :class="` w-2.5rem h-2.5rem disease-top-${index+1}`"></div>
            <div>
              <div>{{ item.title }}</div>
              <div class="art-font text-[1.4rem]">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </el-card>
      <div class="space-y-[1rem] grow">
        <div class="space-y-[1rem] pr-.5rem pb-.5rem">
          <el-card class="h-[21rem]">
            <div class='flex justify-between items-center'>
              <div class="title-frame">病虫害排行</div>
              <div class="flex space-x-3 py-2">
                <el-radio-group v-model="bugTime" @change="handleShortcutDaysChange">
                  <el-radio-button label="当日" value="当日" />
                  <el-radio-button label="本周" value="本周" />
                  <el-radio-button label="本月" value="本月" />
                  <el-radio-button label="自定义" value="自定义" />
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
                        <div :class="`absolute left-0 top-0 h-full bg-#009688`" :style="`width:${item.quantity >= 100 ? '100' : item.quantity }% `"></div>
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
                        <div class="absolute left-0 top-0 h-full bg-#009688"  :style="`width:${item.quantity >= 100 ? '100' : item.quantity }% `"></div>
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
                <el-radio-group v-model="sickTraceRadio" @change="sickTraceChange">
                  <el-radio-button label="按天" value="按天" />
                  <el-radio-button label="按月" value="按月" />
                </el-radio-group>
                <div>
                  <el-date-picker
                    v-model="sickTraceTimeRange"
                    type="daterange"
                    range-separator="至"
                    @change="sickTraceTimeChange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </div>
                <el-button type="primary" @click="sickTraceSearch()">查询</el-button>
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="w-50%">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>孢子数量分析</div>
                  </div>
                  <div id='diseaseDomLeft' class="h-14.5rem mt-.6rem"></div>
                </div>
                <div class="w-50%">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>孢子种类分析</div>
                  </div>
                  <div id='diseaseDomRight' class="h-14.5rem  mt-.6rem"></div>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="h-[21rem]">
            <div class="flex justify-between items-center">
              <div class="title-frame">虫害趋势分析</div>
              <div class="flex items-center space-x-3">
                <el-radio-group v-model="bugTraceRadio" @change="bugTraceChange">
                  <el-radio-button label="按天" value="按天" />
                  <el-radio-button label="按月" value="按月" />
                </el-radio-group>
                <div>
                  <el-date-picker
                    v-model="bugTraceTimeRange"
                    type="daterange"
                    @change="bugTraceTimeChange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </div>
                <el-button type="primary" @click='bugTraceSeacrh()'>查询</el-button>
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="w-49%">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>虫量趋势分析</div>
                  </div>
                  <div id='insectNumChart' class="h-14.5rem mt-.6rem"></div>
                </div>
                <div class="w-49%">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>虫类趋势分析</div>
                  </div>
                  <div id='insectTypeChart' class="h-14.5rem mt-.6rem"></div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="w-24rem ">
      <div class="flex flex-col space-y-[1rem]">
        <el-card class="h-708px">
          <div height="calc(100vh - 440px)">
            <div class="title-frame">今日抓拍</div>
            <div class="flex justify-between space-x-2 py-2">
              <el-select v-model="snapShotDevice"  placeholder="请选择" clearable @change="selectChange">
                <el-option v-for="item in snapShotDeviceOptions"
                :key="item.id"
                :label="item.deviceName"
                :value="item.id"/>
              </el-select>
              <el-date-picker
                v-model="snapShotTime"
                @change="snapShotChange"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <div class="rounded-1 h-10rem bg-#666"> <img :src='snapShotImg' class='w-100% h-100%'/> </div>
            <div class="flex w-full py-2 relative" style='overflow:hidden'>
             <div v-if='snapPictureList.length != 0' @click='tabLeft("left")' style="opacity:.6; background-color:#000;transform:rotate(180deg)" class='z-22 cursor-pointer absolute left-0 top-20px w-50px h-50px rounded-50% color-[#fff] flex justify-center items-center text-20px'> <div> > </div>  </div>
              <div  ref='snapDom' class='flex w-full relative' :style='`left:${left}px`'>
                <div
                 
                  v-for="item,index in snapPictureList"
                  :key="item"
                  
                  @click="snapPictureChange(item,index)"
                  :class="`aspect-square mr-10px ${snapNum == index ? 'snapNum' :''} `"
                > 
                  <img :src='item.monitorPicture' class='w-100% h-100%'/>
                </div>
              </div>
              
              <div  v-if='snapPictureList.length != 0' @click='tabLeft("right")' style="opacity: .6; background-color:#000" class='z-22 cursor-pointer absolute right-0 top-20px w-50px h-50px rounded-50% color-[#fff] flex justify-center items-center text-20px'> <div class="-mt-[5px]"> > </div> </div>

            </div>
            <div class="title-frame">设备信息</div>
            <div v-if="snapDevice" class="rounded-1 flex justify-evenly items-center bg-#00968810 p-2 my-2">
              <div>
                <div class="color-[#9ea2a2] text-15px mb-5px">监测作物</div>
                  <div class="text-center color-[#000] text-17px mb-7px" style="font-weight:600">{{ snapDevice?.monitorSpecies }}</div>
              </div>
              <div>
                <div class="color-[#9ea2a2] text-15px mb-5px">设备状态</div>
                <div class="text-center flex items-center color-[#000] text-17px mb-7px" style="font-weight:600">
                  <div :class="`${snapDevice.deviceStatus==0?'online-1': snapDevice.deviceStatus==1?'online-3': snapDevice.deviceStatus=='online'? 'online-1': snapDevice.deviceStatus=='offline'? 'online-3':'online-2'} w-15px h-15px mr-7px`"></div> 
                  <div>{{ snapDevice.deviceStatus==0?'在线': snapDevice.deviceStatus==1?'离线':snapDevice.deviceStatus == 'online'? '在线': snapDevice.deviceStatus=='offline'? '离线': '故障'}}</div></div>
              </div>
              <div>
                  <div class="color-[#9ea2a2] text-15px mb-5px">抓拍图片</div>
                  <div class="text-center color-[#000] text-17px mb-7px" style="font-weight:600">{{ snapImgTotal }}张</div>
              </div>
            </div>
            <div class="h-3rem w-full my-2 flex items-center bg-#00968810 justify-center"
                v-if="!snapDevice"
              >暂无数据</div>
            <div class="title-frame">抓拍信息</div>
            <div class="flex mt-10px justify-center space-x-1rem items-center h-3.5rem">
              <div
                class="flex space-x-3 items-center bg-[#f1f8fb] px-1.3rem py-2 rounded-2"
              >
                <div :class="` w-2.5rem h-2.5rem disease-top-3`"></div>
                <div>
                  <div class="text-16px">虫害总数</div>
                  <div class="art-font text-[1.4rem]">{{ pestTotalNum }}</div>
                </div>
              </div>
              <div
                class="flex space-x-3 items-center px-1.3rem bg-[#fef9ee] py-2 rounded-2"
              >
                <div :class="` w-2.5rem h-2.5rem disease-top-4`"></div>
                <div>
                  <div  class="text-16px">虫害种类</div>
                  <div class="art-font text-[1.4rem]">{{ pestType }}</div>
                </div>
              </div>
            </div>
            <el-scrollbar class="h-150px mt-1rem px-15px py-15px box-border" style="border: 1px solid #ededed" >
              <div v-for="item, index in pestList" :key="index" class="h-40px leading-40px w-100% flex w-100% justify-between" style="border-bottom:1px dashed #ededed">
                <div style="font-weight:600" class="color-[#7b7b7b] text-[13px]">{{ item.name }}</div>
                <div style="font-weight:600">{{ item.quantity }}</div>
              </div>
            </el-scrollbar>
          </div>
          
        </el-card>
        <el-card class="h-335px">
          <div class="title-frame mb-2">预警信息</div>
          <el-scrollbar height="300px">
            <div class="p-3 box-border" v-loading="preWarnLoading">
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
              <div class="h-10rem w-full flex items-center justify-center"
                      v-if="preWarnList.length === 0"
                    >暂无数据</div>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.title-frame {
  font-weight: bold;
  color: #626262
}
.diseaseDomLeft, .diseaseDomRight{
  width: 100%;
  height: 100%;
  border:1px solid red
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
// element-plus中tree时修改选中当前的样式
::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  // background: pink !important;
  background-color: #e5f4f3 !important;
  color: #3caea4 !important;
  height: 35px;
  line-height: 35px;
}
//修改未选中的元素
::v-deep .el-tree .el-tree-node__content:not(.is-current) {
  height: 35px;
  line-height: 35px;
  margin: 5px;
}
.homt-top-bg1{
  background-color:#ebf5f0
}
.homt-top-bg2{
  background-color:#eef7ee
}
.homt-top-bg3{
  background-color:#f1f8fb
}
.homt-top-bg4{
  background-color:#fef9ee
}
.snapNum{
  width:23%;
  border: 3px solid #009688
}

</style>