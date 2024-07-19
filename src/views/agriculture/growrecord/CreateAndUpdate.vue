<template>
  <div>

    <EditFrame>
      <template #header>
        <div class="flex">
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm"
            v-if="isShow"
          >提交
          </el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
            @click="resetForm()"
            v-if="isShow"
          >清空
          </el-button>
        </div>
        <div>
          <el-button
            type="primary"
            plain
            @click="router.back()"
          >返回
          </el-button>
          <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
            v-if="route.query.type as any !=='detail'&&isShow"
          >
            暂存
          </el-button>
        </div>
      </template>

      <template #content>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="101px"
          :label-position="labelPosition"
          v-loading="formLoading"
          :disabled="!isShow"
          :inline="true"
          class="demo-form-inline"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备名称" prop="facilityName">
                <!-- <el-input v-model="formData.equipmentCode" placeholder="请输入设备编码" /> -->
                <el-input style="width: 200px" v-model="formData.facilityName"
                          placeholder="请选择设备">
                  <template #append>
                    <el-button @click="openPurchaseOrderInEnableList">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="种植作物" prop="cropName">
                <el-input style="width: 200px" v-model="formData.cropName"
                          placeholder="请选择种植作物" disabled>
                  <template #append>
                    <el-button @click="openCropInfoPopup()">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品类" prop="cropType">
                <el-select style="width: 200px" v-model="formData.cropType" clearable placeholder="请选择品类">
                  <el-option
                    v-for="item in listCategoryManagement"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
<!--            <el-col :span="8">
              <el-form-item label="设备名称" prop="facilityName">
                <el-input v-model="formData.facilityName" placeholder="选择设备后自动填入名称"
                          style="width: 200px"/>
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="种植作物" prop="cropName">
                <el-input style="width: 200px" v-model="formData.cropName"
                          placeholder="请输入种植作物" />
              </el-form-item>
            </el-col>-->
            <el-col :span="8">
              <el-form-item label="基地名称" prop="baseName">
                <el-input style="width: 200px" v-model="formData.baseName" placeholder="请选择所属基地" disabled>
                  <template #append>
                    <el-button @click="openParkInfoPopup('0')">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
                <!--                <el-input v-model="formData.belongPark" placeholder="请输入所属园区" />-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地块名称" prop="massifName">
                <el-input style="width: 200px" v-model="formData.massifName" placeholder="请选择所属地块" disabled>
                  <template #append>
                    <el-button @click="openParkDetailPopup(formData.base)">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="测量时间" prop="measureTime">
                <el-date-picker
                  v-model="formData.measureTime"
                  type="datetime"
                  value-format="x"
                  placeholder="选择测量时间"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="测量者" prop="measurer">
                <el-input style="width: 200px" v-model="formData.measurer"
                          placeholder="请输入测量者"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="测量类型" prop="measureType">
                <el-select style="width: 200px" v-model="formData.measureType"
                           placeholder="请选择测量类型">
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_GROW_TYPE)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="测量值" prop="measureNum">
                <el-input style="width: 200px" v-model="formData.measureNum"
                          placeholder="请输入测量值"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="测量单位" prop="measureUnit">
                <el-input style="width: 200px" v-model="formData.measureUnit"
                          placeholder="请输入测量单位"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="变化量" prop="measureSpike">
                <el-input style="width: 200px" v-model="formData.measureSpike"
                          placeholder="请输入变化量"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注:" prop="remark">
                <el-input style="width: 200px" v-model="formData.remark" placeholder="请输入备注"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="抓拍图片" prop="imgUrl">
                <UploadImg v-model="formData.imgUrl"/>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
        <BreedFrom ref="BreedFromRef" @success="handleCropInfoPopupChange"/>
        <AgriculturalBaseList ref="purchaseOrderInEnableListRef"
                              @success="handlePurchaseOrderChange"/>
        <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

        <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>
      </template>
    </EditFrame>

  </div>
</template>
<script setup lang="ts">
import {EditFrame, addOrUpdateFormStorage} from '@/components/EditFrame/index'
import {Refresh, TopRight} from '@element-plus/icons-vue'
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {GrowRecordApi, GrowRecordVO} from '@/api/agriculture/growrecord'
import type {FormProps} from 'element-plus'
import AgriculturalBaseList from "@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue";
import {EquipmentDataVO} from "@/api/agriculture/equipmentdata";
import BreedFrom from "@/views/agriculture/varietymanagement/SelectVarirtManagement.vue";
import { CategoryManagementVO, allDataCacheManager} from "@/api/agriculture/categorymanagement";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";

// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '长势管理新增/编辑/详情'
const ORIGIN_PATH = '/internetMonitor/deviceData/grow-record' // 关闭表单时跳转的路径
const formRef = ref()
const isShow = ref<boolean>(true);
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  base: undefined,
  baseName: undefined,
  massif: undefined,
  massifName: undefined,
  measureTime: undefined,
  measurer: undefined,
  measureType: undefined,
  measureNum: undefined,
  measureSpike: undefined,
  measureUnit: undefined,
  remark: undefined,
  facilityName: undefined,
  facilityId: undefined,
  imgUrl: undefined,
  id: undefined
})
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const {t} = useI18n() // 国际化
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

const formRules = reactive({
  facilityName: [{required: true, message: '设备名称不能为空', trigger: 'change'}],
  facilityId: [{required: true, message: '设备code不能为空', trigger: 'blur'}],
  cropCode: [{required: true, message: '品种code不能为空', trigger: 'blur'}],
  cropName: [{required: true, message: '种植作物不能为空', trigger: 'change'}],
  base: [{required: true, message: '基地ID不能为空', trigger: 'blur'}],
  baseName: [{required: true, message: '基地名称不能为空', trigger: 'change'}],
  cropType: [{required: true, message: '品类不能为空', trigger: 'change'}],
  massif: [{required: true, message: '地块ID不能为空', trigger: 'blur'}],
  massifName: [{required: true, message: '地块名称不能为空', trigger: 'change'}],
  measureTime: [{required: true, message: '测量时间不能为空', trigger: 'change'}],
  measurer: [{required: true, message: '测量者不能为空', trigger: 'change'}],
  measureType: [{required: true, message: '测量类型不能为空', trigger: 'change'}],
  measureNum: [{required: true, message: '测量值不能为空', trigger: 'change'}],
  measureSpike: [{required: true, message: '变化量不能为空', trigger: 'change'}],
  measureUnit: [{required: true, message: '测量单位不能为空', trigger: 'change'}],
})
const labelPosition = ref<FormProps['labelPosition']>('left')

const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  message.success('保存成功！')
}
if (route.query.type == 'select') {
  isShow.value = false;
}
onMounted(async () => {
  await open(route.query.type, route.query.id);
});
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  //获取所有品类的详情数据
  listCategoryManagement.value = await allDataCacheManager.getData({})
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await GrowRecordApi.getGrowRecord(id)
    } finally {
      formLoading.value = false
    }
  }
}
/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as GrowRecordVO
    if (formType.value === 'create') {
      await GrowRecordApi.createGrowRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await GrowRecordApi.updateGrowRecord(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    await router.push(ORIGIN_PATH);
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    cropCode: undefined,
    cropName: undefined,
    cropType: undefined,
    base: undefined,
    baseName: undefined,
    massif: undefined,
    massifName: undefined,
    measureTime: undefined,
    measurer: undefined,
    measureType: undefined,
    measureNum: undefined,
    measureSpike: undefined,
    measureUnit: undefined,
    remark: undefined,
    facilityName: undefined,
    facilityId: undefined,
    imgUrl: undefined,
    id: undefined
  }
  formRef.value?.resetFields()
}

//作物的选择
const BreedFromRef = ref()
// const deviceType = ref("99,102")
const openCropInfoPopup = () => {
  BreedFromRef.value.open()
}
const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}

const handleCropInfoPopupChange = (order: any) => {
  formData.value.cropCode = String(order[0].id)
  formData.value.cropName = String(order[0].varietyName)
  formData.value.cropType = String(order[0].categoryName)
}
// 注意需要在submit最后一行,即faill前面加--router.push(ORIGIN_PATH),即跳转回原地址

const handlePurchaseOrderChange = async (orderA: EquipmentDataVO) => {
  // 将订单设置到入库单
  // console.log("--->>查看查到设备信息", orderA[0])
  //赋值id
  formData.value.facilityId = String(orderA[0].deviceCode)
  // //赋值设备名称
  formData.value.facilityName = String(orderA[0].deviceName);
  //赋值采集类型
  // let DeviceCategoryVO =await DeviceCategoryApi.getDeviceCategory(order[0].deviceType[1])
  // console.log(DeviceCategoryVO.categoryName,"===");
  // formData.value.collectionType = DeviceCategoryVO.categoryName;

  // //基地
  // formData.value.baseCode = order[0].belongPark;
  // //地块
  // formData.value.plotCode = order[0].belongPlot
  // //重置检查类型让他重新选择
  // //formData.value.monitoringType = ''
  // //给下拉列表赋值
  // let res =order[0].deviceMonitorType.split(',');
  // selectList.value=res
  //console.log(res,"==-==");
  // let a=order[0].deviceType[1]
  // let res= await DeviceCategoryApi.getDeviceCategoryList({parentId:a, status: 1})
  //console.log(selectList,"==selectList==");

}
//基地的选择
const parkInfoPopupRef = ref()
const openType = ref('')
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择基地")
  } else parkInfoPopupRef.value.open(id)
}
const handleParkInfoPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    formData.value.base = String(order[0].code)
    formData.value.baseName = String(order[0].name)
  } else formData.value.belongPlot = String(order[0].id)
}

//地块的选择
const parkDetailPopupRef = ref()
const openType1 = ref('')
const openParkDetailPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value) {
    message.error("请选择基地")
  } else parkDetailPopupRef.value.open(id)
}
const handleParkDetailPopupChange = (order: ParkDetailVO) => {
  formData.value.massif = String(order[0].id)
  formData.value.massifName = String(order[0].name)
}

</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 150px;
}

.demo-form-inline .el-select {
  --el-select-width: 150px;
}
</style>
