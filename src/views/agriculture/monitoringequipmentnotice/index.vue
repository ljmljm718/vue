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

    <el-form-item label="监控基地名称" prop="monitoringBaseName">
        <el-input
          v-model="queryParams.monitoringBaseName"
          placeholder="请输入监控基地名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

    <el-form-item label="监控地块名称" prop="monitoringPlotName">
        <el-input
          v-model="queryParams.monitoringPlotName"
          placeholder="请输入监控地块名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>


      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      

      <el-form-item label="通知事件类型" prop="noticeEvent">
        <el-select  
          v-model="queryParams.noticeEvent"  
          placeholder="请输入通知事件类型"  
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

      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker
          v-model="queryParams.recordTime"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:monitoring-equipment-notice:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:monitoring-equipment-notice:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="监控基地名称" align="center" prop="monitoringBaseName" width="120px"/>
      <el-table-column label="监控地块名称" align="center" prop="monitoringPlotName" width="120px"/>
      <el-table-column label="通知事件类型" align="center" prop="noticeEvent" width="120px"/>
      <el-table-column label="设备名称" align="center" prop="deviceName" width="120px"/>
      <el-table-column label="抓拍图片" align="center" prop="captured"  width="150px">
        <template #default="{ row }">
          <el-image
            class="h-100px w-100px"
            lazy
            :src="row.captured"
            :preview-src-list="[row.captured]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      
      <!-- <el-table-column label="视频链接" align="center" prop="videoLink" />-->
      
      <el-table-column
        label="记录时间"
        align="center"
        prop="recordTime"
        :formatter="dateFormatter"
        width="180px"
      />
    <el-table-column label="备注" align="center" prop="remarks" />

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
            v-hasPermi="['agriculture:monitoring-equipment-notice:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:monitoring-equipment-notice:delete']"
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
  <MonitoringEquipmentNoticeForm ref="formRef" @success="getList" />
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
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MonitoringEquipmentNoticeApi, MonitoringEquipmentNoticeVO } from '@/api/agriculture/monitoringequipmentnotice'
import MonitoringEquipmentNoticeForm from './MonitoringEquipmentNoticeForm.vue'

/** 监控设备通知 列表 */
defineOptions({ name: 'MonitoringEquipmentNotice' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MonitoringEquipmentNoticeVO[]>([]) // 列表的数据
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
  captured: undefined,
  videoLink: undefined,
  noticeEvent: undefined,
  recordTime: [],
  remarks: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const options = [{
          value: '逗留',
          label: '逗留'
        }, {
          value: '经过',
          label: '经过'
        }, {
          value: '非法入侵',
          label: '非法入侵'
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
    const data = await MonitoringEquipmentNoticeApi.getMonitoringEquipmentNoticePage(queryParams)
    list.value = data.list
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
    await MonitoringEquipmentNoticeApi.deleteMonitoringEquipmentNotice(id)
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
    const data = await MonitoringEquipmentNoticeApi.exportMonitoringEquipmentNotice(queryParams)
    download.excel(data, '监控设备通知.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>