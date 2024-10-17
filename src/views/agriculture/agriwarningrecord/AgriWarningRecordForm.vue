<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="设备编号" prop="deviceCode">
            <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" disabled>
              <template #append>
                <el-button @click="openPurchaseOrderInEnableList">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="dealPerson">
            <el-input v-model="formData.deviceName" placeholder="选择后自动填入设备名称" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="地块编号" prop="plotCode">
            <el-input v-model="formData.plotCode" placeholder="请输入地块编号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基地编号" prop="parkCode">
            <el-input v-model="formData.parkCode" placeholder="请输入基地编号" disabled/>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="3">
        <el-col :span="8">
          <el-form-item label="预警信息" prop="warnInfo">
            <el-input v-model="formData.warnInfo" placeholder="请输入预警信息"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预警类型" prop="warnType">
            <el-select v-model="formData.warnType" placeholder="请选择预警类型">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预警单位" prop="warnUnit">
            <el-select v-model="formData.warnUnit" placeholder="请选择预警单位">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_UNIT)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="当前值" prop="currentValue">
            <el-input v-model="formData.currentValue" placeholder="请输入当前值"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="阈值" prop="threshold">
            <el-input v-model="formData.threshold" placeholder="请输入阈值"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="预警时间" prop="warnTime">
            <el-date-picker
              v-model="formData.warnTime"
              type="datetime"
              value-format="x"
              placeholder="选择预警时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警状态" prop="warnStatus">
            <el-radio-group v-model="formData.warnStatus">
              <el-radio
                v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_STATUS)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-row :gutter="3">-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="处理时间" prop="dealTime">-->
<!--            <el-date-picker-->
<!--              v-model="formData.dealTime"-->
<!--              type="datetime"-->
<!--              value-format="x"-->
<!--              placeholder="选择处理时间"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="处理人" prop="dealPerson">-->
<!--            <el-input v-model="formData.dealPerson" placeholder="请输入处理人"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row :gutter="3">-->
<!--        &lt;!&ndash;            <el-col :span="12">&ndash;&gt;-->
<!--        &lt;!&ndash;                <el-form-item label="处理人编号" prop="dealPersonId">&ndash;&gt;-->
<!--        &lt;!&ndash;                    <el-input v-model="formData.dealPersonId" placeholder="请输入处理人编号" />&ndash;&gt;-->
<!--        &lt;!&ndash;                </el-form-item>&ndash;&gt;-->
<!--        &lt;!&ndash;            </el-col>&ndash;&gt;-->
<!--        <el-col :span="24">-->
<!--          <el-form-item label="处理信息" prop="dealInfo">-->
<!--            <el-input type="textarea" v-model="formData.dealInfo" placeholder="请输入处理信息"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row :gutter="3">
        <!--            <el-col :span="12">-->
        <!--                <el-form-item label="设备类型" prop="deviceType">-->
        <!--                    <el-select v-model="formData.deviceType" placeholder="请选择设备类型">-->
        <!--                        <el-option label="请选择字典生成" value="" />-->
        <!--                    </el-select>-->
        <!--                </el-form-item>-->
        <!--            </el-col>-->
        <el-col :span="12">
          <el-form-item label="预警等级" prop="warnLevel">
            <el-select v-model="formData.warnLevel" placeholder="请选择预警等级">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_WARN_LEVEL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警图片" prop="imgId">
            <UploadImg v-model="formData.imgId"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!--  选择基地-->
  <!--  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>-->
  <!--  选择地块-->
  <!--  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>-->

  <AgriculturalBaseList ref="purchaseOrderInEnableListRef" @success="handlePurchaseOrderChange"/>
</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {AgriWarningRecordApi, AgriWarningRecordVO} from '@/api/agriculture/agriwarningrecord'
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import {ParkDetailVO} from '@/api/agriculture/parkdetail'
import {ParkInfoVO} from '@/api/agriculture/parkinfo'
import {EquipmentDataVO} from "@/api/agriculture/equipmentdata";
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import AgriculturalBaseList from "@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue";

/** 预警记录 表单 */
defineOptions({name: 'AgriWarningRecordForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
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
  deviceName: undefined,
})
const formRules = reactive({
  parkCode: [{required: true, message: '园区编号不能为空', trigger: 'blur'}],
  plotCode: [{required: true, message: '地块编号不能为空', trigger: 'blur'}],
  deviceCode: [{required: true, message: '设备编号不能为空', trigger: 'blur'}],
  warnType: [{required: true, message: '预警类型不能为空', trigger: 'change'}],
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
      formData.value = await AgriWarningRecordApi.getAgriWarningRecord(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as AgriWarningRecordVO
    if (formType.value === 'create') {
      await AgriWarningRecordApi.createAgriWarningRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await AgriWarningRecordApi.updateAgriWarningRecord(data)
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
    deviceName: undefined,
  }
  formRef.value?.resetFields()
}

// 基地的选择
// const parkPopupRef = ref()
// const openType = ref('')
// const openParkPopup = (id: string) => {
//   openType.value = id;
//   if (openType.value === undefined || openType.value === ""){
//     message.error("请选择基地")
//   }else parkPopupRef.value.open(id)
// }
// const handleParkPopupChange = (order: ParkInfoVO) => {
//   if (openType.value === '0'){
//     formData.value.parkCode = String(order[0].code)
//   }
//   else formData.value.plotCode = String(order[0].id)
// }
//
// //地块的选择
// const plotPopupRef = ref()
// const openType1 = ref('')
// const openPlotPopup = (id: string) => {
//   openType1.value = id;
//   if (!openType1.value){
//     message.error("请选择基地")
//   }else plotPopupRef.value.open(id)
// }
// const handlePlotPopupChange = (order: ParkDetailVO) => {
//
//   console.log("--->>查看选择的地块信息：",order[0])
//   formData.value.parkCode = String(order[0].parkId)
//   formData.value.plotCode = String(order[0].id)
//
// }

const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()

}

const handlePurchaseOrderChange = async (order: EquipmentDataVO) => {
  // 将订单设置到入库单
  console.log("--->>查看查到的农资信息", order[0])
  //赋值id
  formData.value.deviceCode = order[0].id
  //基地
  formData.value.parkCode = order[0].belongPark;
  //地块
  formData.value.plotCode = order[0].belongPlot
  //设备名称
  formData.value.deviceName = order[0].deviceName
}
</script>
