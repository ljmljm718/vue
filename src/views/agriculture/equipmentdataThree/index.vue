<template>
  <!-- 第一栏 -->
  <ContentWrap>
    <div class="top-area">
      <!-- 标题 -->
      <div class="clear-float">
        <div class="top-area-title float-left">实时数据</div>
        <div class="top-area-select float-right">
          <el-select v-model="refreshValue" placeholder="请选择自动刷新时间" size="small" @change="changeRefresh">
            <el-option
              v-for="item in refreshList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <!-- 数据 -->
      <div class="top-area-items">
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
          <!-- 单个项 -->
          <div
            class="weather-bg min-w-[8rem] rounded-lg py-2 px-3 flex justify-between items-center cursor-pointer space-x-3"
            v-for="item,index in trendData"
            :key="index"
            @click="tabCli(item.equipmentCode,item.monitoringType,index)"
          >
            <!-- 左侧名称和数值 -->
            <div class="top-area-item-data">
              <div class="top-area-item-name">{{ item.monitoringType }}</div>
              <div class="top-area-item-num">
                <span>{{ item.dataValue }}</span>
                <span class="top-area-item-unit">{{ item.yyUnit }}</span>
              </div>
            </div>
            <!-- 右侧图标 -->
            <div :class="`top-area-item-icon icon-extra-${getIconClass(item.monitoringType)}`"></div>
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>
  <!-- 第二栏 -->
  <ContentWrap class="mid-area relative">
    <div class="mid-area-fold">
      <div class="flex items-center" @click="changeCollis">
        <span>折叠/展示</span>
        <el-icon>
          <ArrowUp v-show="collis" />
          <ArrowDown v-show="!collis" />
        </el-icon>
      </div>
    </div>
    <div v-show="collis">
      <el-form
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
        class="mid-area-form"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="监测类型" prop="monitoringType">
          <el-input v-model="queryParams.monitoringType"
                    placeholder="请输入监测类型"
                    clearable
                    @keyup.enter="handleQuery"
                    class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="采集时间" prop="collectionTime">
          <el-date-picker
            v-model="queryParams.collectionTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" class="mid-area-query">查询</el-button>
          <el-button @click="resetQuery" class="mid-area-reset">重置</el-button>
          <el-button type="primary" @click="handleData"  v-if="route.query.equipmentCode != null && route.query.equipmentCode != undefined" >采集最新数据</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="false"
        :show-overflow-tooltip="true"
        class="mid-area-table"
        :header-cell-style="{'background-color': themeIsDark ? '#343A46' : '#F5F5F5', 'padding-top': '15px', 'padding-bottom': '18px', border: 'none'}"
        :row-style="{ height: '50px' }"
      >
        <el-table-column
          label="设备名称"
          align="center"
          prop="deviceName"
        />
        <el-table-column
          label="监测类型"
          align="center"
          prop="monitoringType"
        />
        <el-table-column
          label="数据值"
          align="center"
          prop="dataValue"
        />
        <el-table-column
          label="单位"
          align="center"
          prop="yyUnit"
        />
        <el-table-column
          label="采集时间"
          align="center"
          prop="collectionTime"
          :formatter="dateFormatter"
          width="180px"
        />
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList()"
      />
    </div>
  </ContentWrap>
  <!-- 第三栏 -->
  <ContentWrap>
    <div class="flex justify-between">
      <span class="bottom-area-title">{{obj.monitoringType}}趋势</span>
      <div class="flex items-center">
        <el-radio-group v-model="isLineRadio" size="small" @change="handleRadioChange">
          <el-radio-button label="pie" value="pie">
            柱状图
          </el-radio-button>
          <el-radio-button label="line" value="line">
            折线图
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div
      id="chart"
      style="width: 100%; height: 400px;"
    ></div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as echarts from 'echarts'
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'
import { initChartStatic,generateBaseOptions } from '../../../utils/bigscreenTool/index'
import { useRoute } from 'vue-router'

const isLine = ref(false)
const isLineRadio = ref('pie')
const handleRadioChange = (item) => {
  if (item === 'line') initChart(true)
  else initChart(false)
}
const handleSwitchChange = (val) => {
  initChart(val)
}

const getIconClass = (text:string) => {
    const iconMap = {
        '溶解氧饱和度': '1',
        '余氯浓度': '2',
        '温度': '3',
        '盐度': '4',
        'ORP': '5',
        '电导率': '6',
        '溶解氧浓度': '7',
        '浊度': '8',
        'TDS': '9',
        'PH': '10',
        'default': '9',
    }
    let keys = Object.keys(iconMap);
    if (keys.includes(text)) {
      return iconMap[text]
    } else {
      return iconMap['default']
    }
}

const getIcon = (item) => {
  let resIconIndex = '1'
  const titleMap = {
    "温度": "1",
    "湿度": "2",
    "雨量": "6",
    "风速": "4",
    "气压": "3",
    "光照": "5"
  }
  for (const key in titleMap) {
    if (item.indexOf(key) !== -1) resIconIndex = titleMap[key]
  }
  return resIconIndex
}

const collis = ref(true)
const changeCollis = () => {
  collis.value = !collis.value
}
let route = useRoute()

let active = ref(0)

const refreshValue = ref(0)
const refreshList = [
  {
    value: 0,
    label: '不自动刷新'
  },
  {
    value: 1,
    label: '1秒'
  },
  {
    value: 5,
    label: '5秒'
  },
  {
    value: 30,
    label: '30秒'
  },
  {
    value: 60,
    label: '1分钟'
  },
  {
    value: 300,
    label: '5分钟'
  },
  {
    value: 600,
    label: '10分钟'
  },
  {
    value: 1800,
    label: '30分钟'
  }
]

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
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const getRandomColor = (index:number) => {
  const colorArr = ['#f9e1dc', '#f9ecea', '#d8e2da', '#ede3db', '#ffd7b9', '#caf0f8']
  return colorArr[index % colorArr.length]
}

/**
 * 设备分类级联选择器
 */

let categoryOptions = ref([]) // 设备分类选项
const categoryProps = {
  value: 'id',
  label: 'categoryName'
}

/** 初始化 **/
let trendData = ref<Array<any>>([])
let listRes = ref<any>({})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    //设置默认第一条数据
    let aa = route.query.equipmentCode
    queryParams.equipmentCode = aa
    //结束
    const data = await EquipmentDataApi.getEquipmentDataPage(queryParams)
    list.value = data.list

    //初始化上发图片
    //console.log(listRes,"==listRes==");
    if (queryParams.pageNo == 1) {
      listRes.value = list.value[0]
      trendData.value = await EquipmentDataApi.getEquipmentDataByEquipmentCode(
        listRes.value?.equipmentCode
      )
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

if (route.query.collectionType) {
  queryParams.collectionType = route.query.collectionType
  getList()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const handleData = async () => {
  loading.value = true
  try {
    let aa = route.query.equipmentCode
    if (!aa) {
      aa = '1788451950035959808'
    }
    await EquipmentDataApi.queryNewData(aa)
    resetQuery()
    message.success("采集最新数据成功")
  } finally {
    loading.value = false
  }
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
let res = null
let obj = ref({})
//tab切换
const tabCli = async (id, val, index) => {
  active.value = index
  res = await EquipmentDataApi.getEquipmentDataByEquipmentIdAndType(id, val)
  //console.log(res,'res,22')
  initChart()
}
//echarts
const initChart = async (line = false) => {
  if (res != null) {
    res = res
    obj.value = res[0]
  } else {
    res = await EquipmentDataApi.getEquipmentDataByEquipmentIdAndType(
      listRes.value.equipmentCode,
      listRes.value.monitoringType
    )
    obj.value = res[0]
  }
  let xAxisData = []
  let yAxisData = []
  res.forEach((item) => {
    xAxisData.unshift(item.collectionTime + ':00')
    yAxisData.unshift(item.dataValue)
  })
  initChartStatic(
    'chart',
    generateBaseOptions({
      xAxis: {
        data: xAxisData,
        axisLine: {
          show: true,
          lineStyle: {
            color: themeIsDark.value ? '#999' : '#000'
          }
        },
        axisLabel: {
          formatter: (param) => {
            const labelArr = param.split(" ")
            if (labelArr.length > 1) return labelArr[1]
            return param;
          }
        }
      },
      legend : {
        show: false
      },
      yAxis: [
        {
          type: 'value',
          name: `单位：${obj.value.yyUnit}`,
          nameTextStyle: {
            color: 'rgba(153, 153, 153, 1)',
            "font-family": "AlibabaPuHuiTi",
            fontSize: "13px",
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: themeIsDark.value ? '#999' : '#000'
            }
          },
          axisLabel: {
            color: '#999'
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
          name: res[0].monitoringType,
          data: yAxisData,
          type: line ? 'line' : 'bar',
          smooth: false,
          itemStyle: {
            normal: {
              color: "rgba(0, 150, 136, 1)"
            },
          },
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      }
    })
  )
}
/** 初始化 **/
onMounted(() => {
  getList()

  // 获取当前是否是深色主题
  themeIsDark.value = appStore.getIsDark
})

const timerId = ref()
const changeRefresh = async (value) => {
  if (value === 0) {
    if (timerId.value) {
      clearInterval(timerId.value)
    }
  } else {
    if (timerId.value) {
      clearInterval(timerId.value)
    }
    timerId.value = setInterval(function() {
      getList()
    },value*1000)
  }
}

import { useAppStore } from '@/store/modules/app'
import { watch } from "vue"

const appStore = useAppStore()
const themeIsDark = ref(false)

// 监听主题模式变化
watch(() => appStore.isDark, (newVal, oldVal) => {
  console.log("isDark", newVal, oldVal)
  themeIsDark.value = newVal
  // 为了重新刷新Echarts
  initChart()
})
</script>

<style scoped lang="scss">
$percentage: 100%;
.clear-float::after {
  content: "";
  display: table;
  clear: both;
}
.float-left {
  float: left;
}
.float-right {
  float: right;
}

// ---------------- top-area start ------------------
.top-area {
  margin-top: -8px;
  margin-right: 6px;
}
.top-area-title {
  font: 18px AlibabaPuHuiTi;
}
.top-area-select {
  width: 150px;
  height: 30px;
}
.top-area-items {
  width: 100%;
  margin-top: 10px;
}
.weather-bg {
  height: 80px;
  background-size: $percentage 100%;
  background-color: rgba(0, 150, 136, 0.08);
}
.top-area-item-name {
  font: 13px PingFangSC;
}
.top-area-item-num {
  margin-top: 7px;
  font: 20px, "PingFangSC";
  color: rgba(0, 150, 136, 1);
}
.top-area-item-unit {
  font-size: 14px;
}
.top-area-item-icon {
  width: 36px;
  height: 36px;
  background-color: rgba(0, 150, 136, 1);
  border-radius: 90%;
  background-repeat: no-repeat;
  background-size: 50% 50%;
  background-position: center;
}

@for $i from 1 through 24 {
  .icon-extra-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}
// ---------------- top-area end ------------------

// ---------------- mid-area start ------------------
.mid-area .el-card__body {
  padding: 0;
}
.mid-area-form {
  margin-bottom: 20px;
}
.mid-area-fold {
  position: absolute;
  top: 20px;
  right: 20px;
  font: 14px AlibabaPuHuiTi;
  color: #009688;
}
.mid-area-fold:hover {
  cursor: pointer;
}
.mid-area-query {
  background-color: #009688;
  color: #FFFFFF;
}
.mid-area-reset {
  color: #666666;
}
.mid-area-table {
  padding-top: 19px;
  border-top: 1px solid #E5E5E5;
}
:deep(.el-table__row) :deep(.el-table__cell) {
  border-bottom: 1px dashed rgba(229, 229, 229, 1);
}
// ---------------- mid-area end ------------------

// ---------------- bottom-area start ------------------
.bottom-area-title {
  font: 18px "PingFangSC";
  font-weight: bold;
}
:deep(.el-radio-button){
  border-radius: 4px 0px 0px 4px;
  width: 90px;
  height: 30px;
  .el-radio-button__inner {//修改按钮样式
    width: 90px;
    line-height: 30px;
    vertical-align: middle;
    background-color: transparent;
    color:rgba(102, 102, 102, 1);
    font: 14px;
    text-align: center;
  }
  .el-radio-button__original-radio:checked+.el-radio-button__inner {// 修改按钮激活样式
      color: rgba(0, 150, 136, 1);
      border-color: rgba(0, 150, 136, 1);
  }
}

// ---------------- bottom-area end ------------------


</style>
