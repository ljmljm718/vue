//templateCreateOrUpdate_s
//class="grid 2xl:grid-cols-2 gap-3 p-4"
//class="col-span-2"
<template>
  <div v-if= !boo>
    <EditFrame>
      <template #header>
        <div class="flex w-full justify-between">
          <div>
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
          <div>
            <el-button
              :icon="FolderChecked"
              plain
              @click="localSave()"
            >
              暂存
            </el-button>
            <el-button
              type="primary"
              plain
              @click="router.back()"
            >返回</el-button>
          </div>
        </div>
      </template>


      <template #content>
        <el-scrollbar class="croll-bar-template">
        <!-- 原内容 -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          v-loading="formLoading"
          class="grid 2xl:grid-cols-2 gap-3 p-4"
        >
          <el-form-item label="设备id" prop="equipmentCode">
            <!-- <el-input v-model="formData.equipmentCode" placeholder="请输入设备编码" /> -->
            <el-input v-model="formData.equipmentCode" placeholder="请选择设备id" :disabled="true">
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
            <el-input v-model="formData.collectionType" placeholder="请输入采集类型" :disabled="true"/>
          </el-form-item>
          <el-form-item label="监测类型" prop="monitoringType">
            <!-- <el-input v-model="formData.monitoringType" placeholder="请输入监测类型" /> -->
            <el-select  v-model="formData.monitoringType" placeholder="请输入监测类型">
                <el-option
                  v-for="item in selectList"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
            <!-- <el-select  v-if="selectList"  v-model="formData.monitoringType" placeholder="请输入监测类型">
                <el-option
                  v-for="item in selectList"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select> -->
              <!-- <el-select  v-else  v-model="formData.monitoringType" placeholder="请输入监测类型">
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
          <el-form-item label="设备编号" prop="yyRemarks">
            <el-input v-model="formData.yyRemarks" placeholder="请输入设备编号" :disabled="true"/>
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
        <!-- 截至 -->
        </el-scrollbar>
      </template>

    </EditFrame>
    <AgriculturalBaseList   ref="purchaseOrderInEnableListRef"
                          @success="handlePurchaseOrderChange"/>
  </div>

  <div v-if= boo>
    <EditFrame>
      <template #content>
        <el-scrollbar class="croll-bar-template">
        <!-- 原内容 -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          v-loading="formLoading"
          class="grid 2xl:grid-cols-2 gap-3 p-4"
        >
          <el-form-item label="设备id" prop="equipmentCode">
            <!-- <el-input v-model="formData.equipmentCode" placeholder="请输入设备编码" /> -->
            <el-input v-model="formData.equipmentCode" placeholder="请选择设备id" :disabled="true" />
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
            <el-input v-model="formData.collectionType" placeholder="请输入采集类型" :disabled="true"/>
          </el-form-item>
          <el-form-item label="监测类型" prop="monitoringType">
            <!-- <el-input v-model="formData.monitoringType" placeholder="请输入监测类型" /> -->
            <el-select  v-model="formData.monitoringType" placeholder="请输入监测类型" :disabled="true" >
                <el-option
                  v-for="item in selectList"
                  :key="item"
                  :label="item"
                  :value="item"
                  :disabled="true"
                  />
              </el-select>
            <!-- <el-select  v-if="selectList"  v-model="formData.monitoringType" placeholder="请输入监测类型">
                <el-option
                  v-for="item in selectList"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select> -->
              <!-- <el-select  v-else  v-model="formData.monitoringType" placeholder="请输入监测类型">
                <el-option value='' />
              </el-select> -->
          </el-form-item>

          <el-form-item label="数据值" prop="dataValue">
            <el-input v-model="formData.dataValue" placeholder="请输入数据值" :disabled="true" />
          </el-form-item>
          <el-form-item label="单位" prop="yyUnit">
            <el-input v-model="formData.yyUnit" placeholder="请输入单位" :disabled="true" />
          </el-form-item>
          <el-form-item label="采集时间" prop="collectionTime">
            <el-date-picker
              v-model="formData.collectionTime"
              type="datetime"
              value-format="x"
              placeholder="选择采集时间"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="基地编码" prop="baseCode">
            <el-input v-model="formData.baseCode" placeholder="请输入基地编码" :disabled="true"/>
          </el-form-item>
          <el-form-item label="地块编码" prop="plotCode">
            <el-input v-model="formData.plotCode" placeholder="请输入地块编码" :disabled="true"/>
          </el-form-item>
          <el-form-item label="通道编码" prop="channelId">
            <el-input v-model="formData.channelId" placeholder="请输入通道编码" :disabled="true" />
          </el-form-item>
          <el-form-item label="设备编号" prop="yyRemarks">
            <el-input v-model="formData.yyRemarks" placeholder="请输入设备编号" :disabled="true" />
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
        <!-- 截至 -->
        </el-scrollbar>
      </template>

    </EditFrame>
    <AgriculturalBaseList   ref="purchaseOrderInEnableListRef"
                          @success="handlePurchaseOrderChange"/>
  </div>
</template>
<script setup lang="ts">
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue'

import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import {DeviceInfoApi} from '@/api/agriculture/deviceinfo'



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
// const deviceName=ref()

const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}

const getDeviceInfoType= async()=>{
  if(formData.value.equipmentCode){
    let order=await DeviceInfoApi.getDeviceInfo(formData.value.equipmentCode);
    let res =order.deviceMonitorType.split(',');
    selectList.value=res
  }else{
    selectList.value= []
  }
}

let selectList=ref([])
const handlePurchaseOrderChange = async (order: EquipmentDataVO) => {
  // 将订单设置到入库单
  //console.log("--->>查看查到的农资信息",order)
  //赋值id
  formData.value.equipmentCode = order[0].id
  //赋值采集类型
  let DeviceCategoryVO =await DeviceCategoryApi.getDeviceCategory(order[0].deviceType[1])
  console.log(DeviceCategoryVO.categoryName,"===");
  formData.value.collectionType = DeviceCategoryVO.categoryName;
  //赋值设备名称
  formData.value.deviceName = String(order[0].deviceName);
  //基地
  formData.value.baseCode = order[0].belongPark;
  //地块
  formData.value.plotCode = order[0].belongPlot
  //设备编号
  formData.value.yyRemarks = order[0].deviceCode
  //重置检查类型让他重新选择
  //formData.value.monitoringType = ''
  //给下拉列表赋值
  let res =order[0].deviceMonitorType.split(',');
  selectList.value=res
  //console.log(res,"==-==");
  // let a=order[0].deviceType[1]
  // let res= await DeviceCategoryApi.getDeviceCategoryList({parentId:a, status: 1})
  //console.log(selectList,"==selectList==");

}

// 结尾
/**
 * 设备分类级联选择器
 */

//  let categoryOptions = ref([])// 设备分类选项
//  const categoryProps = {
//   value: 'id',
//   label: 'categoryName'
// }

// /** 初始化 **/
// onMounted(async () => {
//   categoryOptions.value = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
// })


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
      // selectList.value=[];
      let dataA= await EquipmentDataApi.getEquipmentData(id);
      formData.value=dataA.list[0];
    } finally {
      formLoading.value = false
    }
  }
  //设置默认下拉框,如果有设备id就去设备id中查找,如果没有,设置为null
  getDeviceInfoType();
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
    if (!formData.value.id) {
      await EquipmentDataApi.createEquipmentData(data)
      message.success(t('common.createSuccess'))
    } else {
      await EquipmentDataApi.updateEquipmentData(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    deleteFormStorage(
      ROUTE_PATH,
      formData.value.id ? formData.value.id : 'new_form'
    )
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
    // 发送操作成功的事件
    router.push(ORIGIN_PATH)
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
// 需要修改的方法
// 1.submitForm 中 if判断条件改为 !formData.value.id
// 2.submitForm方法中 "emit('success')" 行后面添加
// 开始
//     deleteFormStorage(
//       ROUTE_PATH,
//       formData.value.id ? formData.value.id : 'new_form'
//     )
//     // 关闭当前页面
//     useTagsViewStore().delView(router.currentRoute.value);
//     // 发送操作成功的事件
//     router.push(ORIGIN_PATH)
// 截至
// 3.getFrom方法中  formData.value = await "后端函数"
// 改为open方法中 try 下方的第一行 即"fromData.value = await MarkeryingProgramApi.getMakertingProgram(id)"
// 注意其中的id要改为 route.query.id as any
// 4.const FORMPAGE_NAME = '产品手册' 将它改为菜单名称
// 5.const ORIGIN_PATH = '/pcg/marketingCenter/productManual' // 将它改为保存之后的路由
import {EditFrame,addFormStorage,addOrUpdateFormStorage,getFormStorage,deleteFormStorage} from '@/components/EditFrame/index'
import { useTagsViewStore } from "@/store/modules/tagsView";

// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '历史数据'
const ORIGIN_PATH = '/internetMonitor/deviceData/equipment-data' // 关闭表单时跳转的路由

//保存到浏览器缓存
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}
//获取浏览器缓存
const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage(ROUTE_PATH, id)
  if (_form) formData.value = _form.formContent
}
if (!formData.value.id) loadData()

//起步函数
const getFrom = async () =>{
  resetForm();
  if(route.query.id)  {
    const aa = await EquipmentDataApi.getEquipmentData(route.query.id as any);
    formData.value = aa.list[0];
    loadData(route.query.id);
  }
}

let boo = ref(false)
if(route.query.type == 'details'){
  boo.value = true
}

// 方式二 调用立即执行函数
onMounted(async () => {
    getFrom();
});

</script>
