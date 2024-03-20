<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="formData.equipmentName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="经度" prop="yyLongitude">
        <el-input v-model="formData.yyLongitude" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="纬度" prop="yyLatitude">
        <el-input v-model="formData.yyLatitude" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item label="位置" prop="yyLocation">
        <el-input v-model="formData.yyLocation" placeholder="请输入位置" />
      </el-form-item>
      <el-form-item label="启用时间" prop="activationTime">
        <el-date-picker
          v-model="formData.activationTime"
          type="datetime"
          value-format="x"
          placeholder="选择启用时间"
        />
      </el-form-item>
      <el-form-item label="状态" prop="yyStatus">
        <el-radio-group v-model="formData.yyStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="监控基地ID" prop="monitoringBaseId">
        <!-- <el-input v-model="formData.monitoringBaseId" placeholder="请输入监控基地ID" /> -->
        <el-input v-model="formData.monitoringBaseId" placeholder="请选择右侧按钮监控基地" readonly>
          <template #append> 
            <el-button @click="openParkBaseHelper('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="抓拍图片" prop="capturedImage">
        <UploadImg v-model="formData.capturedImage" />
      </el-form-item>
      <el-form-item label="视频URL" prop="videoUrl">
        <el-input v-model="formData.videoUrl" placeholder="请选择视频" />
        <el-upload
          action="#"
          :auto-upload="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="beforeUpload"
        >
          <el-button solt="trigger" size="small" type="primary">选择视频</el-button>
        </el-upload>

      </el-form-item>
      <el-form-item label="备注" prop="yyRemarks">
        <el-input v-model="formData.yyRemarks" placeholder="请输入备注" />
      </el-form-item>
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input v-model="formData.reserveOne" placeholder="请输入备用一" />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input v-model="formData.reserveTwo" placeholder="请输入备用二" />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input v-model="formData.reserveThree" placeholder="请输入备用三" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!-- 基地/地块列表 -->
  <ParkBaseHelper
    ref="parkBaseHelperRef"
    @success="handleParkBaseChange"
  />
  <div class="container" v-show="videoType">
    <div class="mask" v-show="videoType"></div>
    <div class="spinner" v-show="videoType"></div>
  </div>
  
  
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { MonitoringEquipmentApi, MonitoringEquipmentVO } from '@/api/yyang/monitoringequipment'
import ParkBaseHelper from "@/views/kaizhou/parkbase/components/ParkBaseHelper.vue";
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { updateFile } from "@/api/infra/file/index";

// 视频监控
let fileList = ref([]);
 
 const handleSuccess = (response, file, fileList) => {
   console.log('Upload success:', response, file, fileList);
   videoType.value=false
 };

 const handleError = (err, file, fileList) => {
   console.error('Upload error:', err, file, fileList);
 };
let videoType=ref(false)
 const beforeUpload = async (file) => {
  console.log('file', file);
  
   const isVideo = file.raw.type === 'video/mp4';
   if (!isVideo) {
     ElMessageBox.alert('请上传视频文件（.mp4格式）', '错误', { type: 'error' });
   } else {
    videoType.value=true
      const fileForm = new FormData()
      fileForm.append('file', file.raw)
      const { data } = await updateFile(fileForm);
      console.log('res', data);
        formData.value.videoUrl=data
        videoType.value=false
      
        
      
   }
   return isVideo;
 };

 
 const submitUpload = () => {
   if (fileList.value && fileList.value.length > 0) {
     const formData = new FormData();
     formData.append('file', fileList.value[0].raw);
     // 使用你的HTTP库发送formData到服务器
   } else {
     ElMessageBox.alert('请选择一个视频文件上传', '提示', { type: 'info' });
   }
 };
//视频监控结尾


/** 监控设备 表单 */
defineOptions({ name: 'MonitoringEquipmentForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  equipmentName: undefined,
  yyLongitude: undefined,
  yyLatitude: undefined,
  yyLocation: undefined,
  activationTime: undefined,
  yyStatus: undefined,
  monitoringBaseId: undefined,
  capturedImage: undefined,
  videoUrl: undefined,
  yyRemarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

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
      formData.value = await MonitoringEquipmentApi.getMonitoringEquipment(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const parkBaseHelperRef = ref()
const openType = ref('')
const openParkBaseHelper = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === ""){
    message.error("请选择基地")
  }else parkBaseHelperRef.value.open(id)
}

const handleParkBaseChange = (order: MonitoringEquipmentVO) => {
  if (openType.value === '0') formData.value.monitoringBaseId = String(order[0].id)
  else formData.value.monitoringBaseId = String(order[0].id)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as MonitoringEquipmentVO
    if (formType.value === 'create') {
      await MonitoringEquipmentApi.createMonitoringEquipment(data)
      message.success(t('common.createSuccess'))
    } else {
      await MonitoringEquipmentApi.updateMonitoringEquipment(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    equipmentName: undefined,
    yyLongitude: undefined,
    yyLatitude: undefined,
    yyLocation: undefined,
    activationTime: undefined,
    yyStatus: undefined,
    monitoringBaseId: undefined,
    capturedImage: undefined,
    videoUrl: undefined,
    yyRemarks: undefined,
    reserveOne: undefined,
    reserveTwo: undefined,
    reserveThree: undefined,
  }
  formRef.value?.resetFields()
}
</script>
<style scope="scoped" scss>
.container {
  position: relative;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
  z-index: 10000;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

</style>