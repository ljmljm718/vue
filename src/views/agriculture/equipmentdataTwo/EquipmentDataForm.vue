<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备编码" prop="equipmentCode">
        <!-- <el-input v-model="formData.equipmentCode" placeholder="请输入设备编码" /> -->
        <el-input v-model="formData.equipmentCode" placeholder="请选择设备编码" :disabled="true">
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请选择设备名称" :disabled="true"/>
      </el-form-item>
      <el-form-item label="采集类型" prop="collectionType">
        <!-- <el-cascader
          v-model="formData.collectionType"
          :options="categoryOptions"
          :props="categoryProps"
          @change="handleChange"
          disabled
        /> -->
        <el-input v-model="formData.collectionType" placeholder="请输入采集类型" />
      </el-form-item>
      <el-form-item label="监测类型" prop="monitoringType">
        <el-input v-model="formData.monitoringType" placeholder="请输入监测类型" />
        <!-- <el-select  v-if="selectList"  v-model="formData.monitoringType" placeholder="请输入监测类型">  
          <el-option
            v-for="item in selectList"  
            :key="item?.id"
            :label="item?.categoryName"
            :value="item?.categoryName"/>
          
        </el-select>
        <el-select  v-else  v-model="formData.monitoringType" placeholder="请输入监测类型">  
          <el-option value='' />
        </el-select> -->
      </el-form-item>

      <el-form-item label="数据值" prop="dataValue">
        <el-input v-model="formData.dataValue" placeholder="请输入数据值" />
      </el-form-item>
      <el-form-item label="单位" prop="yyUnit">
        <el-input v-model="formData.yyUnit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="采集时间" prop="collectionTime">
        <el-date-picker
          v-model="formData.collectionTime"
          type="datetime"
          value-format="x"
          placeholder="选择采集时间"
        />
      </el-form-item>
      <el-form-item label="基地编码" prop="baseCode">
        <el-input v-model="formData.baseCode" placeholder="请输入基地编码" :disabled="true"/>
      </el-form-item>
      <el-form-item label="地块编码" prop="plotCode">
        <el-input v-model="formData.plotCode" placeholder="请输入地块编码" :disabled="true"/>
      </el-form-item>
      <el-form-item label="通道编码" prop="channelId">
        <el-input v-model="formData.channelId" placeholder="请输入通道编码" />
      </el-form-item>
      <el-form-item label="备注" prop="yyRemarks">
        <el-input v-model="formData.yyRemarks" type="textarea" placeholder="请输入备注" />
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
  <AgriculturalBaseList   ref="purchaseOrderInEnableListRef"
                          @success="handlePurchaseOrderChange"/>

</template>
<script setup lang="ts">
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue'

import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";



/** 设备数据 表单 */
defineOptions({ name: 'EquipmentDataForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  equipmentCode: undefined,
  collectionType: undefined,
  monitoringType: undefined,
  dataValue: undefined,
  yyUnit: undefined,
  collectionTime: undefined,
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
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 新加方法 */
//const deviceName=ref()

const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
  
}

let selectList=ref<any>([])
const handlePurchaseOrderChange = async (order: EquipmentDataVO) => {
  // 将订单设置到入库单
  //console.log("--->>查看查到的农资信息",order)
  //赋值id
  formData.value.equipmentCode = order[0].id
  //赋值采集类型
  let DeviceCategoryVO =await DeviceCategoryApi.getDeviceCategory(order[0].deviceType[1])
  console.log(DeviceCategoryVO,"===");
  //formData.value.collectionType = DeviceCategoryVO.value.get;
  //赋值设备名称
  formData.value.deviceName = String(order[0].deviceName);
  //基地
  formData.value.baseCode = String(order[0].belongPark);
  //地块
  formData.value.plotCode = order[0].belongPlot

  let a=formData.value.collectionType[1]
  let res= await DeviceCategoryApi.getDeviceCategoryList({parentId:a, status: 1})
  selectList.value=res
}

// 结尾  
/**
 * 设备分类级联选择器
 */

 let categoryOptions = ref([])// 设备分类选项
 const categoryProps = {
  value: 'id',
  label: 'categoryName'
}

/** 初始化 **/
onMounted(async () => {
  categoryOptions.value = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
})


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
       let dataA= await EquipmentDataApi.getEquipmentData(id);
       formData.value=dataA.list[0];
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
    const data = formData.value as unknown as EquipmentDataVO
    if (formType.value === 'create') {
      await EquipmentDataApi.createEquipmentData(data)
      message.success(t('common.createSuccess'))
    } else {
      await EquipmentDataApi.updateEquipmentData(data)
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
    equipmentCode: undefined,
    collectionType: undefined,
    monitoringType: undefined,
    dataValue: undefined,
    yyUnit: undefined,
    collectionTime: undefined,
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
  }
  formRef.value?.resetFields()
}
</script>