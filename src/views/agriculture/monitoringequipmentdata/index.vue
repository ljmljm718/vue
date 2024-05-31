<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <!-- <el-form-item label="设备ID" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="监控基地ID" prop="monitoringBaseId">
        <el-input
          v-model="queryParams.monitoringBaseId"
          placeholder="请输入监控基地ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="监控基地名称" prop="monitoringBaseName">
        <!-- <el-input
          v-model="queryParams.monitoringBaseName"
          placeholder="请输入监控基地名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-input v-model="queryParams.monitoringBaseName" placeholder="请选择所属基地">
          <template #append>
            <el-button @click="openParkPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="监控地块ID" prop="monitoringPlotId">
        <el-input
          v-model="queryParams.monitoringPlotId"
          placeholder="请输入监控地块ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="监控地块名称" prop="monitoringPlotName">
        <!-- <el-input
          v-model="queryParams.monitoringPlotName"
          placeholder="请输入监控地块名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-input v-model="queryParams.monitoringPlotName" placeholder="请选择所属地块">
          <template #append>
            <el-button @click="openPlotPopup(queryParams.monitoringBaseId)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <!-- <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-input v-model="queryParams.deviceName" placeholder="请选择设备名称">
          <template #append>
            <el-button @click="openSelectDeviceInfo()">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <!-- 原备用一 -->
      <el-form-item label="录入方式" prop="reserveOne">
        <el-select  
          v-model="queryParams.reserveOne"  
          placeholder="请选择录入方式"  
          clearable  
          @change="handleSelectChange"  
          class="!w-240px"  
        >  
          <el-option  
            v-for="item in options"  
            :key="item.value"  
            :label="item.label"  
            :value="item.value"  
          />  
        </el-select>  
      </el-form-item>

      <!-- 原备用二 -->
      <el-form-item label="图片拍摄时间" prop="reserveTwo">
        <!-- <el-input
          v-model="queryParams.reserveTwo"
          placeholder="请输入备用二"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-date-picker
          v-model="queryParams.reserveTwo"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="视频链接" prop="videoLink">
        <el-input
          v-model="queryParams.videoLink"
          placeholder="请输入视频链接"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="queryParams.remarks"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- 
      
      <el-form-item label="备用三" prop="reserveThree">
        <el-input
          v-model="queryParams.reserveThree"
          placeholder="请输入备用三"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agri:monitoring-equipment-data:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agri:monitoring-equipment-data:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </div>
    <!-- <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
      </el-form-item>
    </div> -->
  </ContentWrap>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="设备ID" align="center" prop="deviceId" /> -->
      <!-- <el-table-column label="监控基地ID" align="center" prop="monitoringBaseId" /> -->
      <el-table-column label="监控基地名称" align="center" prop="monitoringBaseName" />
      <!-- <el-table-column label="监控地块ID" align="center" prop="monitoringPlotId" /> -->
      <el-table-column label="监控地块名称" align="center" prop="monitoringPlotName" />
      <el-table-column label="录入方式" align="center" prop="reserveOne" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="抓拍图片" align="center" prop="capturedImage" width="150px" >
        <!-- <template #default="scope">
          <el-image :src="scope.row.capturedImage" width="50px" />
        </template> -->
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.capturedImage"
            :preview-src-list="[row.capturedImage]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="视频链接" align="center" prop="videoLink" /> -->
      <el-table-column label="图片拍摄时间" align="center" prop="reserveTwo" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="备注" align="center" prop="remarks" />
      <!-- 
      <el-table-column label="备用三" align="center" prop="reserveThree" /> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="操作" align="center" width="200px">
        <template #default="scope">
          <el-button
            v-if="scope.row.videoLink"
            link
            type="primary"
            @click="openVideo(scope.row.videoLink)"
          >查看视频</el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:monitoring-equipment-data:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:monitoring-equipment-data:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <MonitoringEquipmentDataForm ref="formRef" @success="getList" />
   <!-- 视频弹窗 -->
  <el-dialog v-model="isShow" width="900px" height="900px" @close="closeDialog" class="videoBox">
  
    <video
      :src="videoUrl"
      controls
      autoplay
      class="video"
      width="800px" 
      height="800px"
    ></video>
  </el-dialog>
  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>
   <!--  选择设备-->
   <SelectDeviceInfo ref="SelectDeviceInfoRef" @success="SelectDeviceInfoSuccess"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MonitoringEquipmentDataApi, MonitoringEquipmentDataVO } from '@/api/agriculture/monitoringequipmentdata'
import MonitoringEquipmentDataForm from './MonitoringEquipmentDataForm.vue'
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import SelectDeviceInfo  from '@/views/agriculture/deviceinfo/SelectDeviceInfoForms.vue'

/** 监控设备数据 列表 */
defineOptions({ name: 'MonitoringEquipmentData' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MonitoringEquipmentDataVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  capturedImage: undefined,
  videoLink: undefined,
  remarks: undefined,
  reserveOne: undefined,
  reserveTwo: [],
  reserveThree: undefined,
  createTime: [],
})

const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const options = [{
          value: '人工',
          label: '人工'
        }, {
          value: '机器',
          label: '机器'
        }]

// openVideo
let videoUrl=ref();
let isShow=ref(false);
const openVideo = (video: any) => {
  videoUrl.value=video;
  isShow.value=true;
}
const closeDialog=()=>{
  isShow.value=false;
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MonitoringEquipmentDataApi.getMonitoringEquipmentDataPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  if(queryParams.monitoringBaseName == null || queryParams.monitoringBaseName == ''){
    queryParams.monitoringBaseName= undefined
    queryParams.monitoringBaseId= undefined
  }
  if(queryParams.monitoringPlotName == null || queryParams.monitoringPlotName == ''){
    queryParams.monitoringPlotName= undefined
    queryParams.monitoringPlotId= undefined
  }
  if(queryParams.deviceName == null || queryParams.deviceName == ''){
    queryParams.deviceName = undefined
    queryParams.deviceId = undefined
  }
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
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
    await MonitoringEquipmentDataApi.deleteMonitoringEquipmentData(id)
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
    const data = await MonitoringEquipmentDataApi.exportMonitoringEquipmentData(queryParams)
    download.excel(data, '监控设备数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})


//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择基地")
  } else parkPopupRef.value.open(id)
}
const handleParkPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    queryParams.monitoringBaseId = String(order[0].id)
    queryParams.monitoringBaseName = String(order[0].name)
  } else queryParams.monitoringBaseName = String(order[0].name)
}

//地块的选择
const plotPopupRef = ref()
const openType1 = ref('')
const openPlotPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value) {
    message.error("请选择基地")
  } else plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log("--->>查看选择的地块信息：", order[0])
  queryParams.monitoringPlotName = String(order[0].name)
}
// 机器信息选择
const SelectDeviceInfoRef = ref()
const openSelectDeviceInfo = () => {
  // console.log(item);
  SelectDeviceInfoRef.value.open("jk")//监控
  // if (!item.monitoringBaseId || item.monitoringBaseId === undefined ){
  //   message.error("请选择基地")
  // }else if(!item.monitoringPlotId || !item.monitoringPlotId === undefined){
  //   message.error("请选择地块")
  // }else SelectDeviceInfoRef.value.open(item)
}
//点击确定后
const SelectDeviceInfoSuccess =  (item:any) => {
  //console.log(item[0],"--------");
  queryParams.deviceId = item[0].id
  queryParams.deviceName = item[0].deviceName
}
</script>