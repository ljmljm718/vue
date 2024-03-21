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
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="经度" prop="yyLongitude">
        <el-input
          v-model="queryParams.yyLongitude"
          placeholder="请输入经度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="yyLatitude">
        <el-input
          v-model="queryParams.yyLatitude"
          placeholder="请输入纬度"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="位置" prop="yyLocation">
        <el-input
          v-model="queryParams.yyLocation"
          placeholder="请输入位置"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="启用时间" prop="activationTime">
        <el-date-picker
          v-model="queryParams.activationTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="yyStatus">
        <el-select
          v-model="queryParams.yyStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监控基地ID" prop="monitoringBaseId">
        <el-input
          v-model="queryParams.monitoringBaseId"
          placeholder="请输入监控基地ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="监控基地名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="监控基地名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="备注" prop="yyRemarks">
        <el-input
          v-model="queryParams.yyRemarks"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input
          v-model="queryParams.reserveOne"
          placeholder="请输入备用一"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input
          v-model="queryParams.reserveTwo"
          placeholder="请输入备用二"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input
          v-model="queryParams.reserveThree"
          placeholder="请输入备用三"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
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
          v-hasPermi="['yyang:monitoring-equipment:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['yyang:monitoring-equipment:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编码" align="center" prop="id" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="经度" align="center" prop="yyLongitude" />
      <el-table-column label="纬度" align="center" prop="yyLatitude" />
      <el-table-column label="位置" align="center" prop="yyLocation" />
      <el-table-column
        label="启用时间"
        align="center"
        prop="activationTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="状态" align="center" prop="yyStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.yyStatus" />
        </template>
      </el-table-column>
      <el-table-column label="监控基地ID" align="center" prop="monitoringBaseId" />
      <el-table-column label="基地名称" align="center" prop="name" />
      <el-table-column label="抓拍图片" align="center" prop="capturedImage" />
      <el-table-column label="视频URL" align="center" prop="videoUrl" />
      <el-table-column label="备注" align="center" prop="yyRemarks" />
      <!-- <el-table-column label="备用一" align="center" prop="reserveOne" />
      <el-table-column label="备用二" align="center" prop="reserveTwo" />
      <el-table-column label="备用三" align="center" prop="reserveThree" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['yyang:monitoring-equipment:update']"
          >查看视频</el-button>
<!-- 
  size="mini"
            type="text"
            icon="el-icon-video-camera"
            @click="playVideo(scope.row)"
            v-hasPermi="['species:video:remove']"
 -->
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['yyang:monitoring-equipment:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['yyang:monitoring-equipment:delete']"
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
  <MonitoringEquipmentForm ref="formRef" @success="getList" />
  <!-- 视频弹窗 -->
  <!-- <el-dialog title :visible="isShow" width="600px" @close="closeDialog" class="videoBox">
      <video
        :src="videoUrl"
        controls
        autoplay
        class="video"
        width="100%"
      ></video>
    </el-dialog> -->

</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MonitoringEquipmentApi, MonitoringEquipmentVO } from '@/api/yyang/monitoringequipment'
import MonitoringEquipmentForm from './MonitoringEquipmentForm.vue'

/** 监控设备 列表 */
defineOptions({ name: 'MonitoringEquipment' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MonitoringEquipmentVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentName: undefined,
  yyLongitude: undefined,
  yyLatitude: undefined,
  yyLocation: undefined,
  activationTime: [],
  yyStatus: undefined,
  monitoringBaseId: undefined,
  capturedImage: undefined,
  videoUrl: undefined,
  yyRemarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  createTime: [],
  name : undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MonitoringEquipmentApi.getMonitoringEquipmentPage(queryParams)
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
    await MonitoringEquipmentApi.deleteMonitoringEquipment(id)
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
    const data = await MonitoringEquipmentApi.exportMonitoringEquipment(queryParams)
    download.excel(data, '监控设备.xls')
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
