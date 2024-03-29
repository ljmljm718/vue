<template>
  <h1>数据采集</h1>
  <ContentWrap>
    <h3>最新数据</h3>
    <div class="container">
          <div class="box" v-for="item,index in trendData" :key="index">
                <div class="box-top">
                  <div style="text-align: center">{{ item.monitoringType }}</div>
                  <div style="text-align: center">{{ item.dataValue}}{{ item.yyUnit}}</div>
                </div>
                <div @click="tabCli(item.equipmentCode,item.monitoringType,index)" :class="active==index?'active':'actived'">查看趋势</div>
          </div>
    </div>
   
  </ContentWrap>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="监测类型" align="center" prop="monitoringType" />
      <el-table-column label="数据值" align="center" prop="dataValue" />
      <el-table-column label="单位" align="center" prop="yyUnit" />
      <el-table-column label="采集时间" align="center" prop="collectionTime" :formatter="dateFormatter" width="180px" />
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList()"
    />
  </ContentWrap>
  <!-- 列表 -->
  <ContentWrap>
    <div style="width: 100%;text-align: center;font-weight: 700;font-size: 25px;">{{obj.monitoringType}}{{ obj.yyUnit?'('+obj.yyUnit+')':'' }}趋势</div>
    <div id="chart" style="width: 100%; height: 400px;"></div>  
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'
import EquipmentDataForm from './EquipmentDataForm.vue'
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../../utils/bigscreenTool/index'
import { log } from 'console';
import {useRoute} from 'vue-router'
let route = useRoute();


let active=ref(0)
/** 设备数据 列表 */      
defineOptions({ name: 'EquipmentData' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<EquipmentDataVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentCode: undefined,
  collectionType: undefined,
  monitoringType: undefined,
  dataValue: undefined,
  yyUnit: undefined,
  collectionTime: [],
  baseCode: undefined,
  plotCode: undefined,
  channelId: undefined,
  yyRemarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  deviceName: undefined,
  parkName: undefined,
  parkDname: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/**
 * 设备分类级联选择器
 */

 let categoryOptions = ref([])// 设备分类选项
 const categoryProps = {
  value: 'id',
  label: 'categoryName'
}

/** 初始化 **/


let trendData=ref([]);
let listRes=ref<any>({})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    //设置默认第一条数据
    let aa=route.query.equipmentCode;
    queryParams.equipmentCode=aa;
    //结束
    const data = await EquipmentDataApi.getEquipmentDataPage(queryParams)
    list.value = data.list

    
    
    //初始化上发图片
    //console.log(listRes,"==listRes==");
    if(queryParams.pageNo==1){
    listRes.value = list.value[0];
    trendData.value=await EquipmentDataApi.getEquipmentDataByEquipmentCode(listRes.value.equipmentCode)
    }
    //console.log(trendData.value,"==trendData==");
    //初始化柱桩图
    initChart()
    //结束
    total.value = data.total
  } finally {
    loading.value = false
  }
}


/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  //handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await EquipmentDataApi.deleteEquipmentData(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await EquipmentDataApi.exportEquipmentData(queryParams)
    download.excel(data, '设备数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
let res=null;
let obj=ref({})
//tab切换
const tabCli=async (id,val,index)=>{
  active.value=index
  res=await EquipmentDataApi.getEquipmentDataByEquipmentIdAndType(id,val)
  //console.log(res,'res,22')
  initChart()
}
//echarts
const initChart= async ()=>{

  if(res!=null){
    res=res
    obj.value=res[0]
  }else{
    res=await EquipmentDataApi.getEquipmentDataByEquipmentIdAndType(listRes.value.equipmentCode,listRes.value.monitoringType)
    obj.value=res[0]
  }
  console.log(res,'==res');
  let xAxisData=[]
  let yAxisData=[]
  res.forEach(item => {
    xAxisData.unshift(item.collectionTime+':00')
    yAxisData.unshift(item.dataValue)
  });
      initChartStatic(
        "chart",
        generateBaseOptions({
          xAxis: {
            data: xAxisData,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
            nameTextStyle:{
              color:'#000'
            }
          },
          legend: { 
            show: true, 
            orient:'horizontal',
         },
          yAxis: [
            {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
            axisLabel: {
              color:'#000'
            },
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#000", //网格线颜色
                width: 3, //网格线的加粗程度
                type: "dashed", //网格线类型
              },
            },
            splitArea: {
              //网格区域
              show: false, //是否显示
            },
          },
        ],
       
          series: [
            {
              name:res[0].monitoringType,
              data:yAxisData,
              type: "bar",
              barWidth:'120',
              smooth: false,
              itemStyle: {   //配置样式，设置每个柱子的颜色
               normal:{  
                  color: function (params){
                  var colorList = ['#61a5e8','#7ecf51','#eecb5f','#9570e5'];
                   return colorList[params.dataIndex];
               }
         },}
            },
            
          ],
          grid: {
            left: "10%",
            right: "10%",
            top: "15%",
            bottom: "15%",
          },
        })
      );
    
}
/** 初始化 **/
onMounted(() => {
  getList()
})



</script>
<style scoped lang="scss">
.container{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.box{
  width: 5%;
  display: flex;
  margin-right:20px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .box-top{
    width: 100%;
    padding: 3px 0;
    height: 50px;
    background-size: 100% 100%;
    background-image: url(./assets/topBg.png);
  }
  .active{
    width: 100%;
    margin-top: 10px;
    padding:0 5px;
    height: 50px;
    text-align: center;
    background-size: 100% 100%;
    background-image: url(./assets/active.png);
  }
  .actived{
    width: 100%;
    margin-top: 10px;
    height: 50px;
    text-align: center;
    background-size: 100% 100%;
    background-image: url(./assets/actived.png);
  }
}
</style>