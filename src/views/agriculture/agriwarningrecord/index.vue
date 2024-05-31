<template>
  <ContentWrap>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="传感器设备预警" name="first">
        <ContentWrap>
          <!-- 搜索工作栏 -->
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="68px"
          >
            <!--      <el-form-item label="设备类型" prop="deviceType">-->
            <!--        <el-select-->
            <!--          v-model="queryParams.deviceType"-->
            <!--          placeholder="请选择设备类型"-->
            <!--          clearable-->
            <!--          class="!w-240px"-->
            <!--        >-->
            <!--          <el-option label="请选择字典生成" value="" />-->
            <!--        </el-select>-->
            <!--      </el-form-item>-->
            <el-form-item label="预警类型" prop="warnType">
              <el-select
                v-model="queryParams.warnType"
                placeholder="请选择预警类型"
                clearable
                class="!w-240px"
              >
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预警状态" prop="warnStatus">
              <el-select
                v-model="queryParams.warnStatus"
                placeholder="请选择预警状态"
                clearable
                class="!w-240px"
              >
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_STATUS)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预警等级" prop="warnLevel">
              <el-select
                v-model="queryParams.warnLevel"
                placeholder="请选择预警等级"
                clearable
                class="!w-240px"
              >
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_WARN_LEVEL)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预警时间" prop="warnTime">
              <el-date-picker
                v-model="queryParams.warnTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                class="!w-240px"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="handleQuery" type="primary">
                <Icon icon="ep:search" class="mr-5px"/>
                搜索
              </el-button>
              <el-button @click="resetQuery">
                <Icon icon="ep:refresh" class="mr-5px"/>
                重置
              </el-button>
            </el-form-item>
            <div style="margin-top: 20px;margin-left: 30px;height: 30px">
              <el-form-item>
                <el-button
                  type="primary"
                  plain
                  @click="openForm('create')"
                  v-hasPermi="['agriculture:agri-warning-record:create']"
                >
                  <Icon icon="ep:plus" class="mr-5px"/>
                  新增
                </el-button>
                <el-button
                  type="success"
                  plain
                  @click="handleExport"
                  :loading="exportLoading"
                  v-hasPermi="['agriculture:agri-warning-record:export']"
                >
                  <Icon icon="ep:download" class="mr-5px"/>
                  导出
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </ContentWrap>

        <!-- 列表 -->
        <ContentWrap>
          <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
            <!--      <el-table-column label="主键" align="center" prop="id" />-->
            <!--      <el-table-column label="园区编号" align="center" prop="parkCode" />-->
            <!--      <el-table-column label="地块编号" align="center" prop="plotCode" />-->
            <!--            <el-table-column label="设备编号" align="center" prop="deviceCode"/>-->
            <el-table-column label="设备名称" align="center" prop="deviceName"/>
            <!--      <el-table-column label="设备类型" align="center" prop="deviceType" />-->
            <el-table-column label="预警类型" align="center" prop="warnType">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="scope.row.warnType"/>
              </template>
            </el-table-column>
            <el-table-column label="预警等级" align="center" prop="warnLevel">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.AGRI_WARN_LEVEL" :value="scope.row.warnLevel"/>
              </template>
            </el-table-column>
            <!--      <el-table-column label="预警标题" align="center" prop="warnTitle" />-->
            <el-table-column label="预警信息" align="center" prop="warnInfo"/>
            <el-table-column label="当前值" align="center">
              <template #default="scope">
                <div> {{ scope.row["currentValue"] }}{{ scope.row["warnUnit"] }}</div>
              </template>
            </el-table-column>
            <el-table-column label="阈值" align="center">
              <template #default="scope">
                <div> {{ scope.row["threshold"] }}{{ scope.row["warnUnit"] }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="预警时间"
              align="center"
              prop="warnTime"
              :formatter="dateFormatter"
              width="180px"
            />
            <el-table-column label="预警状态" align="center" prop="warnStatus">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.KAIZHOU_WARN_STATUS" :value="scope.row.warnStatus"/>
              </template>
            </el-table-column>
            <el-table-column
              label="处理时间"
              align="center"
              prop="dealTime"
              :formatter="dateFormatter"
              width="180px"
            />
            <el-table-column label="处理人" align="center" prop="dealPerson"/>
            <!--      <el-table-column label="处理人编号" align="center" prop="dealPersonId" />-->
            <el-table-column label="处理信息" align="center" prop="dealInfo"/>
            <!--      <el-table-column label="预警图片" align="center" prop="imgId" />-->
            <el-table-column label="操作" align="center" width="160" fixed="right">
              <template #default="scope">
                <el-button
                  link
                  type="success"
                  @click="handleDeal(scope.row.id)"
                  v-show="scope.row.warnStatus === '0'"
                >
                  处理
                </el-button>
                <el-button
                  link
                  type="primary"
                  @click="openForm('update', scope.row.id)"
                  v-hasPermi="['agriculture:agri-warning-record:update']"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  v-hasPermi="['agriculture:agri-warning-record:delete']"
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
      </el-tab-pane>

      <!-- 表单弹窗：添加/修改 -->
      <AgriWarningRecordForm ref="formRef" @success="getList"/>

      <!-- 处理预警信息对话框 -->
      <el-dialog :title="title" v-model="openDeal" :rules="dealDataRules" width="40%" append-to-body
                 :close-on-click-modal="false">
        <el-form :model="dealData" size="small" label-width="68px">
          <el-form-item label="处理人" prop="dealPerson">
            <el-input v-model="dealData.dealPerson" placeholder="请输入处理人"/>
          </el-form-item>
          <el-form-item label="处理信息" prop="dealInfo">
            <el-input v-model="dealData.dealInfo" type="textarea" placeholder="请填写处理信息"
                      clearable/>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="submitDialog" type="primary">确 定</el-button>
          <el-button @click="openDeal = false">取 消</el-button>
        </template>
      </el-dialog>
      <el-tab-pane label="监控设备预警" name="second">
        <ContentWrap>
          <!-- 搜索工作栏 -->
          <el-form
            class="-mb-15px"
            :model="queryParamsA"
            ref="queryFormRefA"
            :inline="true"
            label-width="100px"
          >

            <el-form-item label="监控基地名称" prop="monitoringBaseName">
              <el-input
                v-model="queryParamsA.monitoringBaseName"
                placeholder="请输入监控基地名称"
                clearable
                @keyup.enter="handleQueryA"
                class="!w-240px"
              />
            </el-form-item>

            <el-form-item label="监控地块名称" prop="monitoringPlotName">
              <el-input
                v-model="queryParamsA.monitoringPlotName"
                placeholder="请输入监控地块名称"
                clearable
                @keyup.enter="handleQueryA"
                class="!w-240px"
              />
            </el-form-item>


            <el-form-item label="设备名称" prop="deviceName">
              <el-input
                v-model="queryParamsA.deviceName"
                placeholder="请输入设备名称"
                clearable
                @keyup.enter="handleQueryA"
                class="!w-240px"
              />
            </el-form-item>


            <el-form-item label="通知事件类型" prop="noticeEvent">
              <el-select
                v-model="queryParamsA.noticeEvent"
                placeholder="请输入通知事件类型"
                clearable
                @change="handleSelectChangeA"
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
                v-model="queryParamsA.recordTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                class="!w-240px"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="handleQueryA" type="primary">
                <Icon icon="ep:search" class="mr-5px"/>
                搜索
              </el-button>
              <el-button @click="resetQueryA">
                <Icon icon="ep:refresh" class="mr-5px"/>
                重置
              </el-button>
            </el-form-item>
            <div style="margin-top: 20px;margin-left: 30px;height: 30px">
              <el-form-item>
                <el-button
                  type="primary"
                  plain
                  @click="openFormA('create')"
                  v-hasPermi="['agriculture:monitoring-equipment-notice:create']"
                >
                  <Icon icon="ep:plus" class="mr-5px"/>
                  新增
                </el-button>
                <el-button
                  type="success"
                  plain
                  @click="handleExportA"
                  :loading="exportLoadingA"
                  v-hasPermi="['agriculture:monitoring-equipment-notice:export']"
                >
                  <Icon icon="ep:download" class="mr-5px"/>
                  导出
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </ContentWrap>
        <!-- 列表 -->
        <ContentWrap>
          <el-table v-loading="loading" :data="listA" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="监控基地名称" align="center" prop="monitoringBaseName"
                             width="120px"/>
            <el-table-column label="监控地块名称" align="center" prop="monitoringPlotName"
                             width="120px"/>
            <el-table-column label="通知事件类型" align="center" prop="noticeEvent" width="120px"/>
            <el-table-column label="设备名称" align="center" prop="deviceName" width="120px"/>
            <el-table-column label="抓拍图片" align="center" prop="captured" width="150px">
              <template #default="scope">
                <el-image
                  class="h-50px w-50px"
                  lazy
                  :src="scope.row.captured"
                  :preview-src-list="[scope.row.captured]"
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
            <el-table-column label="备注" align="center" prop="remarks"/>

            <el-table-column label="操作" align="center" width="200px">
              <template #default="scope">
                <el-button
                  v-if="scope.row.videoLink"
                  link
                  type="primary"
                  @click="openVideoA(scope.row.videoLink)"
                >查看视频
                </el-button>
                <el-button
                  link
                  type="primary"
                  @click="openFormA('update', scope.row.id)"
                  v-hasPermi="['agriculture:monitoring-equipment-notice:update']"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  @click="handleDeleteA(scope.row.id)"
                  v-hasPermi="['agriculture:monitoring-equipment-notice:delete']"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <Pagination
            :total="totalA"
            v-model:page="queryParamsA.pageNo"
            v-model:limit="queryParamsA.pageSize"
            @pagination="getListA"
          />
        </ContentWrap>

        <!-- 表单弹窗：添加/修改 -->
        <MonitoringEquipmentNoticeForm ref="formRefA" @success="getListA"/>
        <!-- 视频弹窗 -->
        <el-dialog v-model="isShow" width="900px" height="900px" @close="closeDialog"
                   class="videoBox">
          <video
            :src="videoUrl"
            controls
            autoplay
            class="video"
            width="800px"
            height="800px"
          ></video>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {AgriWarningRecordApi, AgriWarningRecordVO} from '@/api/agriculture/agriwarningrecord'
import AgriWarningRecordForm from './AgriWarningRecordForm.vue'
import {
  MonitoringEquipmentNoticeApi,
  MonitoringEquipmentNoticeVO
} from "@/api/agriculture/monitoringequipmentnotice";
import MonitoringEquipmentNoticeForm
  from "@/views/agriculture/monitoringequipmentnotice/MonitoringEquipmentNoticeForm.vue";
import {useRoute} from 'vue-router'

/** 预警记录 列表 */
defineOptions({name: 'AgriWarningRecord'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const activeName = ref('first')
const loading = ref(true) // 列表的加载中
const list = ref<AgriWarningRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warnTime: [],
  warnStatus: undefined,
  deviceType: undefined,
  warnType: undefined,
  id: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    console.log(1)
    const data = await AgriWarningRecordApi.getAgriWarningRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const route = useRoute()
if (route.query.id) {
  queryParams.id = route.query.id
  getList()
}

if (route.query.warnStatus) {
  queryParams.warnStatus = route.query.warnStatus
  getList()
}
if (route.query.time) {
  let data = new Date()
  let year = data.getFullYear()
  let month = data.getMonth() + 1 >= 9 ? data.getMonth() + 1 : '0' + (data.getMonth() + 1)
  let day = data.getDate()
  if (route.query.time == '1') {
    console.log(`${year}-${month}-${day} 00:00-00-00`, '`${year}-${month}-${day} 00:00-00-00`')
    queryParams.warnTime.push(`${year}-${month}-${day} 00:00:00`)
    queryParams.warnTime.push(`${year}-${month}-${day} 23:59:59`)
    console.log(queryParams, 'queryParams')
  } else {
    // let  month2=data.getMonth()>=9?data.getMonth():'0'+data.getMonth()
    // if(month=='01'){
    //   console.log("11111111LIKHAI")
    //   month2=12
    //   let year2=data.getFullYear()-1
    //   queryParams.warnTime.push(`${year2}-${month2}-${day} 23:59:59`)
    //   queryParams.warnTime.push(`${year}-${month}-${day} 00:00:00`)
    //   console.log("11111111LIKHAI",queryParams.warnTime)
    // }else{
    //   console.log("222222LIKHEI")
    //   queryParams.warnTime.push(`${year}-${month2}-${day} 23:59:59`)
    //   console.log("111111222222LIKHEI",queryParams.warnTime)
    //   queryParams.warnTime.push(`${year}-${month}-${day} 00:00:00`)
    //   console.log("222222LIKHEI",queryParams.warnTime)
    // }
    // 获取当前时间
    console.log("11111:");
    let now = new Date();
// 获取一个月前的时间
    now.setMonth(now.getMonth() - 1);
// 格式化日期（可选），这里使用自定义函数格式化日期
    function formatDate(date) {
      let year = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的，所以加1
      let day = ("0" + date.getDate()).slice(-2);
      let hours = ("0" + date.getHours()).slice(-2);
      let minutes = ("0" + date.getMinutes()).slice(-2);
      let seconds = ("0" + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    let currentTime = formatDate(new Date());
    let oneMonthAgo = formatDate(now);
    queryParams.warnTime.push(oneMonthAgo)
    queryParams.warnTime.push(currentTime)
  }
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
    await AgriWarningRecordApi.deleteAgriWarningRecord(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await AgriWarningRecordApi.exportAgriWarningRecord(queryParams)
    download.excel(data, '预警记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const dealData = ref({
  id: undefined,
  parkCode: undefined,
  plotCode: undefined,
  deviceCode: undefined,
  warnInfo: undefined,
  currentValue: undefined,
  threshold: undefined,
  warnTime: undefined,
  warnStatus: undefined,
  dealTime: undefined,
  dealPerson: undefined,
  dealPersonId: undefined,
  dealInfo: undefined,
  deviceType: undefined,
  imgId: undefined,
  warnType: undefined,
  warnUnit: undefined,
  warnTitle: undefined,
  warnLevel: undefined,
} as any)
const dealDataRules = reactive({
  dealPerson: [{required: true, message: '处理人不能为空', trigger: 'blur'}],
  dealInfo: [{required: true, message: '处理信息不能为空', trigger: 'blur'}],
})
const title = ref('')
const openDeal = ref(false)
/** 处理按钮操作 */
const handleDeal = async (id: number) => {
  openDeal.value = true
  title.value = '预警处理'
  resetForm()
  // 修改时，设置数据
  console.log("ID", id)
  if (id) {
    try {
      dealData.value = await AgriWarningRecordApi.getAgriWarningRecord(id)
    } finally {
    }
  }
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitDialog = async () => {
  try {
    console.log("dealData", dealData.value)
    dealData.value.dealTime = new Date().valueOf()
    dealData.value.warnStatus = '1'
    const data = dealData.value as unknown as AgriWarningRecordVO
    await AgriWarningRecordApi.updateAgriWarningRecord(data)
    message.success(t('common.updateSuccess'))
    openDeal.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    resetQuery()
  }
}

const resetForm = () => {
  dealData.value = {
    id: undefined,
    parkCode: undefined,
    plotCode: undefined,
    deviceCode: undefined,
    warnInfo: undefined,
    currentValue: undefined,
    threshold: undefined,
    warnTime: undefined,
    warnStatus: undefined,
    dealTime: undefined,
    dealPerson: undefined,
    dealPersonId: undefined,
    dealInfo: undefined,
    deviceType: undefined,
    imgId: undefined,
    warnType: undefined,
    warnUnit: undefined,
    warnTitle: undefined,
    warnLevel: undefined,
  }
}

//tab点击切换事件
const handleClick = (tab, event) => {
  if (tab.props.name === 'first') {
    getList()
  } else if (tab.props.name === 'second') {
    getListA()
  }
}

// openVideo
let videoUrl = ref();
let isShow = ref(false);
const openVideoA = (video: any) => {
  videoUrl.value = video;
  isShow.value = true;
}
const closeDialog = () => {
  isShow.value = false;
}
const queryFormRefA = ref() // 搜索的表单
const exportLoadingA = ref(false) // 导出的加载中
const listA = ref<MonitoringEquipmentNoticeVO[]>([]) // 列表的数据
const totalA = ref(0) // 列表的总页数
const queryParamsA = reactive({
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
const options = [{
  value: '停留',
  label: '停留'
}, {
  value: '经过',
  label: '经过'
}, {
  value: '非法入侵',
  label: '非法入侵'
}]

/** 查询列表 */
const getListA = async () => {
  loading.value = true
  try {
    const data = await MonitoringEquipmentNoticeApi.getMonitoringEquipmentNoticePage(queryParamsA)
    listA.value = data.list
    totalA.value = data.total
  } finally {
    loading.value = false
  }
}
/** 搜索按钮操作 */
const handleQueryA = () => {
  queryParamsA.pageNo = 1
  getListA()
}
/** 重置按钮操作 */
const resetQueryA = () => {
  queryFormRefA.value.resetFields()
  handleQueryA()
}
/** 添加/修改操作 */
const formRefA = ref()
const openFormA = (type: string, id?: number) => {
  formRefA.value.open(type, id)
}

/** 删除按钮操作 */
const handleDeleteA = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MonitoringEquipmentNoticeApi.deleteMonitoringEquipmentNotice(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getListA()
  } catch {
  }
}

/** 导出按钮操作 */
const handleExportA = async () => {
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
