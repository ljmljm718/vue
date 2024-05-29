//templateCreateOrUpdate
<template>
  <div>

    <EditFrame>
      <template #header>
        <div class="flex">
           <!-- <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
          >
            保存
          </el-button> -->
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm"
          >提交</el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
            @click="resetForm()"
          >清空
          </el-button>
        </div>
      </template>

      <template #content>
        <!-- 原内容 -->
        <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      class="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2 p-4"
    >
     
      <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="formData.deviceId" placeholder="请输入设备ID" disabled>
              <template #append>
                  <el-button @click="openPurchaseOrderInEnableList">
                    <Icon icon="ep:search"/>
                      选择
                  </el-button>
              </template>
          </el-input>
      </el-form-item>

      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" disabled/>
      </el-form-item>

      <el-form-item label="监控基地ID" prop="monitoringBaseId">
          <el-input v-model="formData.monitoringBaseId" placeholder="请输入监控基地ID" disabled />
      </el-form-item>

      <el-form-item label="监控基地名称" prop="monitoringBaseName">
        <el-input v-model="formData.monitoringBaseName" placeholder="请输入监控基地名称" disabled />
      </el-form-item>

      <el-form-item label="监控地块ID" prop="monitoringPlotId">
        <el-input v-model="formData.monitoringPlotId" placeholder="请输入监控地块ID" disabled/>
      </el-form-item>

      <el-form-item label="监控地块名称" prop="monitoringPlotName">
        <el-input v-model="formData.monitoringPlotName" placeholder="请输入监控地块名称" disabled/>
      </el-form-item>

      <!-- <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="formData.deviceId" placeholder="请输入设备ID" />
      </el-form-item> -->
      <!-- <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" />
      </el-form-item> -->
      <!-- <el-form-item label="监控基地ID" prop="monitoringBaseId">
        <el-input v-model="formData.monitoringBaseId" placeholder="请输入监控基地ID" />
      </el-form-item> -->
      <!-- <el-form-item label="监控基地名称" prop="monitoringBaseName">
        <el-input v-model="formData.monitoringBaseName" placeholder="请输入监控基地名称" />
      </el-form-item> -->
      <!-- <el-form-item label="监控地块ID" prop="monitoringPlotId">
        <el-input v-model="formData.monitoringPlotId" placeholder="请输入监控地块ID" />
      </el-form-item> -->
      <!-- <el-form-item label="监控地块名称" prop="monitoringPlotName">
        <el-input v-model="formData.monitoringPlotName" placeholder="请输入监控地块名称" />
      </el-form-item> -->
      <!-- <el-form-item label="通知事件类型" prop="noticeEvent">
        <el-input v-model="formData.noticeEvent" placeholder="请输入通知事件类型" />
      </el-form-item> -->
      
      <el-form-item label="通知事件类型" prop="noticeEvent">
        <el-select  
          v-model="formData.noticeEvent"  
          placeholder="请选择通知事件类型"  
          clearable   
          class="!w-450px"  
        >  
          <el-option  
          v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_NOTICEEVENT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"  
          />  
        </el-select>  
      </el-form-item>
      
      <el-form-item label="消息內容" prop="remarks">
        <el-input v-model="formData.remarks" placeholder="请输入备注" />
      </el-form-item>

      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker
          v-model="formData.recordTime"
          type="datetime"
          value-format="x"
          placeholder="选择记录时间"
          class="!w-450px"  
        />
      </el-form-item>

      <el-form-item label="视频链接" prop="videoLink">
        <el-input v-model="formData.videoLink" placeholder="请输入视频链接" />
      </el-form-item>
      
      <el-form-item label="抓拍图片或视频" prop="captured">
        <UploadImg v-model="formData.captured" />
      </el-form-item>
      

    </el-form>
      </template>
    </EditFrame>
  </div>
  <!-- ====================新增的搜索栏 -->
  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange"/>
</template>
<script setup lang="ts">
import { MonitoringEquipmentNoticeApi, MonitoringEquipmentNoticeVO } from '@/api/agriculture/monitoringequipmentnotice'
import {EditFrame,addOrUpdateFormStorage} from '@/components/EditFrame/index'
import {Refresh,TopRight} from '@element-plus/icons-vue'
//=================新增的引用
import AgriculturalBaseList from "@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue";
import {DeviceInfoVO} from '@/api/agriculture/deviceinfo';
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'


/** 监控设备通知 表单 */
defineOptions({ name: 'MonitoringEquipmentNoticeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  captured: undefined,
  videoLink: undefined,
  noticeEvent: undefined,
  recordTime: undefined,
  remarks: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref


//==============================新增的搜索框
const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}
const handlePurchaseOrderChange = async (order: DeviceInfoVO) => {
  // 将订单设置到入库单
  //console.log("--->>查看查到的农资信息",order)
  //设备ID deviceId
  formData.value.deviceId = order[0].deviceCode;
  //监控基地ID monitoringBaseId
  formData.value.monitoringBaseId = order[0].belongPark;
  //监控地块ID monitoringPlotId
  formData.value.monitoringPlotId = order[0].belongPlot;
  //设备名称 deviceName
  formData.value.deviceName = order[0].deviceName;

  //在后面添加2个get方法后，在DeviceInfoVO添加两个字段，在AgriculturalBaseList对应的列表中添加这两个字段，在前端展示
  //监控基地名称 monitoringBaseName  前端查不到，只能后端加
  formData.value.monitoringBaseName = order[0].parkName;
  //监控地块名称 monitoringPlotName  前端查不到，只能后端加
  formData.value.monitoringPlotName = order[0].parkDetailName;
}


/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MonitoringEquipmentNoticeApi.getMonitoringEquipmentNotice(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as MonitoringEquipmentNoticeVO
    if (formType.value === 'create') {
      await MonitoringEquipmentNoticeApi.createMonitoringEquipmentNotice(data)
      message.success(t('common.createSuccess'))
    } else {
      await MonitoringEquipmentNoticeApi.updateMonitoringEquipmentNotice(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    router.push(ORIGIN_PATH)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    deviceId: undefined,
    deviceName: undefined,
    monitoringBaseId: undefined,
    monitoringBaseName: undefined,
    monitoringPlotId: undefined,
    monitoringPlotName: undefined,
    captured: undefined,
    videoLink: undefined,
    noticeEvent: undefined,
    recordTime: undefined,
    remarks: undefined
  }
  formRef.value?.resetFields()
}

// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = ''
const ORIGIN_PATH = '/internetMonitor/deviceData/monitoring-equipment-notice' // 关闭表单时跳转的路径

const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}

// 方式二 调用立即执行函数
onMounted(async () => {
      await open(route.query.type,route.query.id);
});
// 注意需要在submit最后一行,即faill前面加--router.push(ORIGIN_PATH),即跳转回原地址
</script>