<template>
  <ContentWrap>
    <div class="flex space-x-4">
      <div
        class="weather-bg w-[8rem] py-2 px-4 flex justify-between items-center cursor-pointer"
        v-for="item,index in trendData"
        :key="index"
      >
        <div class="box-top">
          <div style="text-align: center;color: white;">{{ item.monitoringType }}</div>
          <div style="text-align: center;color: white;">
            <span style="font-family: 'ArtFont';">{{ item.dataValue }}</span>
            <span class="pl-1">{{ item.yyUnit }}</span>
          </div>
        </div>
        <div :class="`w-[2rem] h-[2rem] icon-${getIcon(item.monitoringType)}`" style="background-size: 100% 100%;"></div>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
    >
      <el-form-item label="设备编号" prop="equipmentCode">
        <el-input
          v-model="queryParams.equipmentCode"
          placeholder="请输入设备编号"
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
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备编码" align="center" prop="equipmentCode" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="采集类型" align="center" prop="collectionType" />
      <el-table-column label="监测类型" align="center" prop="monitoringType" />
      <el-table-column label="数据值" align="center" prop="dataValue" />
      <el-table-column label="单位" align="center" prop="yyUnit" />
      <el-table-column
        label="采集时间"
        align="center"
        prop="collectionTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="基地编码" align="center" prop="baseCode" />
      <el-table-column label="基地名称" align="center" prop="parkName" />
      <el-table-column label="地块编码" align="center" prop="plotCode" />
      <el-table-column label="地块名称" align="center" prop="parkDname" />
<!--      <el-table-column label="通道编码" align="center" prop="channelId" />-->
    </el-table>
    <!-- 分页 -->
    <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'

/** 环境数据 列表 */
defineOptions({ name: 'InDoorEnvironmentData' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<EquipmentDataVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentCode: undefined,
  collectionType: '气象站',
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

const getIcon = (item) => {
  let resIconIndex = '1'
  const titleMap = {
    "温度": "1",
    "土壤温度": "1",
    "湿度": "2",
    "土壤湿度": "2",
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

let trendData = ref<Array<any>>([])
let listRes = ref<any>({})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await EquipmentDataApi.getEquipmentDataPage(queryParams)
    list.value = data.list
    total.value = data.total

    if (queryParams.pageNo == 1) {
      listRes.value = list.value[0]
      trendData.value = await EquipmentDataApi.getEquipmentDataByEquipmentCode(
        listRes.value?.equipmentCode
      )
    }
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
  handleQuery()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style scoped lang="scss">
.weather-bg {
  background-image: url(@/views/agriculture/equipmentdataThree/assets/weatherBg.png);
  background-size: 100% 100%;
}

.container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.box {
  width: 5%;
  display: flex;
  margin-right: 20px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .box-top {
    width: 100%;
    padding: 3px 0;
    height: 50px;
    background-size: 100% 100%;
    background-image: url(@/views/agriculture/equipmentdataThree/assets/topBg.png);
  }
  .active {
    width: 100%;
    margin-top: 10px;
    padding: 0 5px;
    height: 50px;
    text-align: center;
    background-size: 100% 100%;
    background-image: url(@/views/agriculture/equipmentdataThree/assets/active.png);
  }
  .actived {
    width: 100%;
    margin-top: 10px;
    height: 50px;
    text-align: center;
    background-size: 100% 100%;
    background-image: url(@/views/agriculture/equipmentdataThree/assets/actived.png);
  }
}

@for $i from 1 through 8 {
  .icon-#{$i} {
    background-image: url(@/views/agriculture/equipmentdataThree/assets/icon#{$i}.png);
  }
}
</style>
