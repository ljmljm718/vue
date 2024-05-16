<script setup lang="ts">
import {
  EditFrame,
  addFormStorage,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index'
import {ToolListManageApi, ToolListManageVO} from '@/api/machine/toollistmanage'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {WorkshopManagementVO} from "@/api/machine/workshopmanagement";
import ToolstencilListForm from "@/views/machine/toolstencil/toolstencilListForm.vue";
import SelectClientInfo from "@/views/machine/clientinfo/selectClientInfo.vue";
import RtuModuleListForm from "@/views/machine/rtumodule/rtuModuleListForm.vue";
import {ClientInfoVO} from "@/api/machine/clientinfo";
import {assignObjectCustom} from '@/utils/index'
import {RtuModuleVO} from "@/api/machine/rtumodule";
import SelectSysUser from "@/views/machine/followupplan/SelectSysUser.vue";
import {FolderChecked, TopRight, Refresh} from '@element-plus/icons-vue'
import {UserVO} from "@/api/login/types";
import {useTagsViewStore} from "@/store/modules/tagsView";
import * as path from "path";

defineOptions({name: 'ToolListManageNew'})

const {params} = useRoute()
const activeName = ref('1')
console.log("paramsId", params.id)

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<any>({
  id: undefined,
  productId: undefined,
  product: undefined,
  customerId: undefined,
  customer: undefined,
  rtuId: undefined,
  rtu: undefined,
  remark: undefined,
  phone: undefined,
  linkman: undefined,
  customerAddr: undefined,
  stencilId: undefined,
  stencilName: undefined,
  productType: undefined,
  productNum: undefined,
  deliveryTime: undefined,
  productionTime: undefined,
  expirationTime: undefined,
  cncSystem: undefined,
  machineRating: undefined,
  driverVersion: undefined,
  xyzRoute: undefined,
  bedDimension: undefined,
  magazineTool: undefined,
  spindleSpeed: undefined,
  spindleSpecification: undefined,
  spindleDriveKind: undefined,
  spindleNoseDistance: undefined,
  xySwiftMovingSpeed: undefined,
  zSwiftMovingSpeed: undefined,
  xLeadScrew: undefined,
  yLeadScrew: undefined,
  zLeadScrew: undefined,
  xTrack: undefined,
  zTrack: undefined,
  yTrack: undefined,
  xyzBearing: undefined,
  matchUnits: undefined,
  specialRequirementsRemarks: undefined,
  configurationList: undefined,
  systemParameterBackup: undefined,
  productManual: undefined,
  opticalMachineAssembly: undefined,
  electronicallyTest: undefined,
  machineDesign: undefined,
  sheetmetalDesign: undefined,
  groundDesign: undefined,
  groundPlot: undefined,
  additionalCustomization: undefined,
  additionalDesignDrawing: undefined,
  warehouseGetDetail: undefined,
  coreComponentDescription: undefined,
  qualityInspectionPersonnel: undefined,
  exteriorInterior1: undefined,
  exteriorInterior2: undefined,
  scrapingDrawing1: undefined,
  scrapingDrawing2: undefined,
  scrapingDrawing3: undefined,
  configurationCheck: undefined,
  qualityInspectionReport: undefined,
  packingList: undefined,
  shipmentLoadingDrawing: undefined,
  shippingWeight: undefined,
  figure: undefined,
  rtuCode: undefined,
  state: undefined,
  qrImg: undefined,
})
const formRules = reactive({
  rtuId: [{required: true, message: 'RTU不能为空', trigger: 'blur'}]
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
      formData.value = await ToolListManageApi.getToolListManage(id)
      if (formData.value.id) loadData(formData.value.id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗
const route = useRoute()
const router = useRouter() // 路由对象
const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}
const handlePurchaseOrderChange = (order: WorkshopManagementVO) => {
  const stencilId = order[0].id.toString()
  delete order[0].id
  formData.value = {
    ...formData.value,
    ...order[0],
    stencilId
  }
}
const purchaseOrderInEnableListRef1 = ref()
const openPurchaseOrderInEnableList1 = () => {
  purchaseOrderInEnableListRef1.value.open()
}
const handlePurchaseOrderChange1 = (order: ClientInfoVO) => {
  const customerId = order[0].id.toString()
  delete order[0].id
  formData.value = {
    ...formData.value,
    ...order[0],
    customerId,
    customer: String(order[0].clientName),
    customerAddr: String(order[0].provinceName) + '-' + String(order[0].cityName) + '-' + String(order[0].countiesName),
    phone: String(order[0].contactNumber),
    customerTags: String(order[0].clientTag),
  }
}
const purchaseOrderInEnableListRef2 = ref()
const openPurchaseOrderInEnableList2 = () => {
  purchaseOrderInEnableListRef2.value.open()
}
const handlePurchaseOrderChange2 = (order: RtuModuleVO) => {
  const rtuId = order[0].id.toString()
  delete order[0].id
  formData.value = {
    ...formData.value,
    rtuId,
    rtu: String(order[0].rtuName),
    rtuCode: String(order[0].serialNumber),
  }
}
const select = async () => {
  formLoading.value = true
  formData.value = await ToolListManageApi.getToolListManage(route.query.id as number)
  if (formData.value.id) loadData(formData.value.id)
  formLoading.value = false
}
select()
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ToolListManageVO
    if (!data.id) {
      await ToolListManageApi.createToolListManage(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolListManageApi.updateToolListManage(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    deleteFormStorage(
      '/machine/tool-list-manage-new',
      formData.value.id ? formData.value.id : 'new_form'
    )
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
    // 返回上一页面
    // router.go(-1);
    router.push('/machine/tool-list-manage')
  } finally {
    formLoading.value = false
  }
}
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    productId: undefined,
    product: undefined,
    customerId: undefined,
    customer: undefined,
    rtuId: undefined,
    rtu: undefined,
    remark: undefined,
    phone: undefined,
    linkman: undefined,
    customerAddr: undefined,
    stencilId: undefined,
    stencilName: undefined,
    productType: undefined,
    productNum: undefined,
    deliveryTime: undefined,
    productionTime: undefined,
    expirationTime: undefined,
    cncSystem: undefined,
    machineRating: undefined,
    driverVersion: undefined,
    xyzRoute: undefined,
    bedDimension: undefined,
    magazineTool: undefined,
    spindleSpeed: undefined,
    spindleSpecification: undefined,
    spindleDriveKind: undefined,
    spindleNoseDistance: undefined,
    xySwiftMovingSpeed: undefined,
    zSwiftMovingSpeed: undefined,
    xLeadScrew: undefined,
    yLeadScrew: undefined,
    zLeadScrew: undefined,
    xTrack: undefined,
    zTrack: undefined,
    yTrack: undefined,
    xyzBearing: undefined,
    matchUnits: undefined,
    specialRequirementsRemarks: undefined,
    configurationList: undefined,
    systemParameterBackup: undefined,
    productManual: undefined,
    opticalMachineAssembly: undefined,
    electronicallyTest: undefined,
    machineDesign: undefined,
    sheetmetalDesign: undefined,
    groundDesign: undefined,
    groundPlot: undefined,
    additionalCustomization: undefined,
    additionalDesignDrawing: undefined,
    warehouseGetDetail: undefined,
    coreComponentDescription: undefined,
    qualityInspectionPersonnel: undefined,
    exteriorInterior1: undefined,
    exteriorInterior2: undefined,
    scrapingDrawing1: undefined,
    scrapingDrawing2: undefined,
    scrapingDrawing3: undefined,
    configurationCheck: undefined,
    qualityInspectionReport: undefined,
    packingList: undefined,
    shipmentLoadingDrawing: undefined,
    shippingWeight: undefined,
    figure: undefined,
    rtuCode: undefined,
    state: undefined,
    qrImg: undefined,
  }
  formRef.value?.resetFields()
}
const selectSysUserRef1 = ref()
const openSelectSysUser1 = (id: string) => {
  selectSysUserRef1.value.open(id)
}
const handleSelectSysUserChange1 = (order: UserVO) => {
  formData.value.opticalMachineAssembly = String(order[0].nickname)
}
const selectSysUserRef2 = ref()
const openSelectSysUser2 = (id: string) => {
  selectSysUserRef2.value.open(id)
}
const handleSelectSysUserChange2 = (order: UserVO) => {
  formData.value.electronicallyTest = String(order[0].nickname)
}
const selectSysUserRef3 = ref()
const openSelectSysUser3 = (id: string) => {
  selectSysUserRef3.value.open(id)
}
const handleSelectSysUserChange3 = (order: UserVO) => {
  formData.value.machineDesign = String(order[0].nickname)
}
const selectSysUserRef4 = ref()
const openSelectSysUser4 = (id: string) => {
  selectSysUserRef4.value.open(id)
}
const handleSelectSysUserChange4 = (order: UserVO) => {
  formData.value.sheetmetalDesign = String(order[0].nickname)
}
const selectSysUserRef5 = ref()
const openSelectSysUser5 = (id: string) => {
  selectSysUserRef5.value.open(id)
}
const handleSelectSysUserChange5 = (order: UserVO) => {
  formData.value.qualityInspectionPersonnel = String(order[0].nickname)
}
const selectSysUserRef6 = ref()
const openSelectSysUser6 = (id: string) => {
  selectSysUserRef6.value.open(id)
}
const handleSelectSysUserChange6 = (order: UserVO) => {
  formData.value.groundDesign = String(order[0].nickname)
}
const selectSysUserRef7 = ref()
const openSelectSysUser7 = (id: string) => {
  selectSysUserRef7.value.open(id)
}
const handleSelectSysUserChange7 = (order: UserVO) => {
  formData.value.additionalCustomization = String(order[0].nickname)
}

const handleBrforeReset = () => {
  ElMessageBox.confirm('已有的改动将会丢失，是否继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resetForm()
  })
}

const localSave = () => {
  addOrUpdateFormStorage(
    '/machine/tool-list-manage-new',
    '机床列表管理端-' + (formData.value.id ? '编辑' : '新增'),
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}

const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage('/machine/tool-list-manage-new', id)
  if (_form) formData.value = _form.formContent
}

if (!formData.value.id) loadData()
</script>
<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex">
          <el-button type="primary" :icon="FolderChecked" plain @click="localSave()">
            保存
          </el-button>
          <el-button type="success" :icon="TopRight" plain @click="submitForm">提交</el-button>
          <el-button type="danger" :icon="Refresh" plain @click="handleBrforeReset()">清空
          </el-button>
        </div>
      </template>
      <template #content>
        <el-scrollbar style="height: calc(100vh - 250px);overflow: auto;">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            v-loading="formLoading"
            class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2 p-4"
          >
            <el-form-item label="模板编号" prop="stencilId">
              <!--        <el-input v-model="formData.stencilId" placeholder="请输入机床模板" />-->
              <el-input v-model="formData.stencilId" readonly disabled>
                <template #append>
                  <el-button @click="openPurchaseOrderInEnableList">
                    <Icon icon="ep:search"/>
                    选择模板
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="机床模板" prop="stencilName">
              <el-input v-model="formData.stencilName" placeholder="请输入机床模板" disabled/>
            </el-form-item>
            <el-form-item label="产品名称" prop="product">
              <el-input v-model="formData.product" placeholder="请输入产品名称"/>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <!--        <el-input v-model="formData.state" placeholder="请输入状态" />-->
              <el-select v-model="formData.state" placeholder="请选择状态">
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_STATE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="RTU编号" prop="rtuId">
              <!--        <el-input v-model="formData.rtuId" placeholder="请输入RTU编号" />-->
              <el-input v-model="formData.rtuId" readonly disabled>
                <template #append>
                  <el-button @click="openPurchaseOrderInEnableList2">
                    <Icon icon="ep:search"/>
                    选择RTU
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="RTU" prop="rtu">
              <el-input v-model="formData.rtu" placeholder="请输入RTU" disabled/>
            </el-form-item>
            <el-form-item label="RTU序列号" prop="rtuCode">
              <el-input v-model="formData.rtuCode" placeholder="请输入RTU序列号" disabled/>
            </el-form-item>
            <el-form-item label="产品类型" prop="productType">
              <el-select v-model="formData.productType" placeholder="请选择产品类型">
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_TEMPLATE_PRODUCT_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产品编号" prop="productNum">
              <el-input v-model="formData.productNum" placeholder="请输入产品编号"/>
            </el-form-item>
            <el-form-item label="交货时间" prop="deliveryTime">
              <el-date-picker
                v-model="formData.deliveryTime"
                type="date"
                value-format="x"
                placeholder="选择交货时间"
              />
            </el-form-item>
            <el-form-item label="出厂日期" prop="productionTime">
              <el-date-picker
                v-model="formData.productionTime"
                type="date"
                value-format="x"
                placeholder="选择出厂日期"
              />
            </el-form-item>
            <el-form-item label="过保日期" prop="expirationTime">
              <el-date-picker
                v-model="formData.expirationTime"
                type="date"
                value-format="x"
                placeholder="选择过保日期"
              />
            </el-form-item>
            <div
              class="demo-collapse 2xl:col-span-4 xl:col-span-3 lg:col-span-2 md:col-span-1 sm:grid-cols-1">
              <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="客户信息" name="1">
                  <div
                    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
                    <el-form-item label="客户编号" prop="customerId">
                      <!--        <el-input v-model="formData.customerId" placeholder="请输入客户编号" />-->
                      <el-input v-model="formData.customerId" readonly disabled>
                        <template #append>
                          <el-button @click="openPurchaseOrderInEnableList1">
                            <Icon icon="ep:search"/>
                            选择客户
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="客户" prop="customer">
                      <el-input v-model="formData.customer" placeholder="请输入客户名称" disabled/>
                    </el-form-item>
                    <el-form-item label="联系人" prop="linkman">
                      <el-input v-model="formData.linkman" placeholder="请输入联系人" disabled/>
                    </el-form-item>
                    <el-form-item label="客户地址" prop="customerAddr">
                      <el-input v-model="formData.customerAddr" placeholder="请输入客户地址"
                                disabled/>
                    </el-form-item>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="技术协议" name="2">
                  <div
                    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
                    <el-form-item label="数控系统" prop="cncSystem">
                      <el-select v-model="formData.cncSystem" placeholder="请选择数控系统">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_CNC_LINEAGE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="电机规格" prop="machineRating">
                      <el-input v-model="formData.machineRating" type="text"
                                placeholder="请输入电机规格"/>
                    </el-form-item>


                    <el-form-item label="驱动器型号" prop="driverVersion">
                      <el-input v-model="formData.driverVersion" placeholder="请输入驱动器型号"/>
                    </el-form-item>

                    <el-form-item label="XYZ行程" prop="xyzRoute">
                      <el-input v-model="formData.xyzRoute" placeholder="请输入XYZ行程"/>
                    </el-form-item>

                    <el-form-item label="工作台尺寸" prop="bedDimension">
                      <el-input v-model="formData.bedDimension" placeholder="请输入工作台尺寸"/>
                    </el-form-item>

                    <el-form-item label="刀库" prop="magazineTool">
                      <el-select v-model="formData.magazineTool" placeholder="请选择刀库">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_MAGAZINE_TOOL)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="主轴转速" prop="spindleSpeed">
                      <el-input v-model="formData.spindleSpeed" placeholder="请输入主轴转速"/>
                    </el-form-item>

                    <el-form-item label="主轴规格" prop="spindleSpecification">
                      <el-select v-model="formData.spindleSpecification"
                                 placeholder="请选择主轴规格">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_SPINDLE_SIZE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>


                    <el-form-item label="主轴传动方式" prop="spindleDriveKind">
                      <el-select v-model="formData.spindleDriveKind"
                                 placeholder="请选择主轴传动方式">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_SPINDLE_STATUSA)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="主轴鼻端距离" prop="spindleNoseDistance">
                      <el-input v-model="formData.spindleNoseDistance"
                                placeholder="请输入主轴鼻端距离"/>
                    </el-form-item>

                    <el-form-item label="XY快移速度" prop="xySwiftMovingSpeed">
                      <el-input v-model="formData.xySwiftMovingSpeed"
                                placeholder="请输入XY快移速度"/>
                    </el-form-item>

                    <el-form-item label="Z快移速度" prop="zSwiftMovingSpeed">
                      <el-input v-model="formData.zSwiftMovingSpeed" placeholder="请输入Z快移速度"/>
                    </el-form-item>

                    <el-form-item label="X向丝杆型号" prop="xLeadScrew">
                      <el-select v-model="formData.xLeadScrew" placeholder="请选择X向丝杆型号">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_LEAD_SCREW_XYZ)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="Y向丝杆型号" prop="yLeadScrew">
                      <el-select v-model="formData.yLeadScrew" placeholder="请选择Y向丝杆型号">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_LEAD_SCREW_XYZ)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="Z向丝杆型号" prop="zLeadScrew">
                      <el-select v-model="formData.zLeadScrew" placeholder="请选择Z向丝杆型号">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_LEAD_SCREW_XYZ)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="X向轨道" prop="xTrack">
                      <el-select v-model="formData.xTrack" placeholder="请选择X向轨道">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_TRACK_XYZ)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="Y向轨道" prop="yTrack">
                      <el-select v-model="formData.yTrack" placeholder="请选择Y向轨道">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_TRACK_XYZ)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="Z向轨道" prop="zTrack">
                      <el-select v-model="formData.zTrack" placeholder="请选择Z向轨道">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_TRACK_XYZ)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="xyz轴承" prop="xyzBearing">
                      <el-select v-model="formData.xyzBearing" placeholder="请选择xyz轴承">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.MACHINE_BEARING_XYZNAME)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="选配部件" prop="matchUnits">
                      <el-input v-model="formData.matchUnits" placeholder="请输入选配部件"/>
                    </el-form-item>

                    <el-form-item label="特殊要求备注" prop="specialRequirementsRemarks">
                      <el-input v-model="formData.specialRequirementsRemarks" type="textarea"
                                placeholder="请输入特殊要求备注"/>
                    </el-form-item>


                    <el-form-item label="产品手册" prop="productManual">
                      <UploadFile v-model="formData.productManual"/>
                    </el-form-item>

                    <el-form-item label="配置单原件" prop="configurationList">
                      <UploadFile v-model="formData.configurationList"/>
                    </el-form-item>

                    <el-form-item label="系统参数备份" prop="systemParameterBackup">
                      <UploadFile v-model="formData.systemParameterBackup"/>
                    </el-form-item>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="生产信息" name="3">
                  <div
                    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
                    <el-form-item label="附加等定制计" prop="additionalCustomization">
                      <el-input v-model="formData.additionalCustomization"
                                placeholder="请选择定制人"
                                disabled>
                        <template #append>
                          <el-button @click="openSelectSysUser7('0')">
                            <Icon icon="ep:search"/>
                            选择定制人
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="光机装配" prop="opticalMachineAssembly">
                      <el-input v-model="formData.opticalMachineAssembly"
                                placeholder="请选择光机装配人"
                                disabled>
                        <template #append>
                          <el-button @click="openSelectSysUser1('0')">
                            <Icon icon="ep:search"/>
                            选择光机装配人
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="电器调试" prop="electronicallyTest">
                      <el-input v-model="formData.electronicallyTest" placeholder="请选择电器调试人"
                                disabled>
                        <template #append>
                          <el-button @click="openSelectSysUser2('0')">
                            <Icon icon="ep:search"/>
                            选择电器调试人
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="机械设计" prop="machineDesign">
                      <el-input v-model="formData.machineDesign" placeholder="请选择机械设计人"
                                disabled>
                        <template #append>
                          <el-button @click="openSelectSysUser3('0')">
                            <Icon icon="ep:search"/>
                            选择机械设计人
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="钣金设计" prop="sheetmetalDesign">
                      <el-input v-model="formData.sheetmetalDesign" placeholder="请选择钣金设计人"
                                disabled>
                        <template #append>
                          <el-button @click="openSelectSysUser4('0')">
                            <Icon icon="ep:search"/>
                            选择钣金设计人
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="地基设计" prop="groundDesign">
                      <el-input v-model="formData.groundDesign" placeholder="请选择地基设计人"
                                disabled>
                        <template #append>
                          <el-button @click="openSelectSysUser6('0')">
                            <Icon icon="ep:search"/>
                            选择地基设计人
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="地基图" prop="groundPlot">
                      <UploadImg v-model="formData.groundPlot"/>
                    </el-form-item>

                    <el-form-item label="附加设计图" prop="additionalDesignDrawing">
                      <UploadImg v-model="formData.additionalDesignDrawing"/>
                    </el-form-item>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="仓库出库信息" name="4">
                  <div
                    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
                    <el-form-item label="核心部件说明" prop="coreComponentDescription">
                      <el-input v-model="formData.coreComponentDescription" type="text"
                                placeholder="请输入核心部件说明"/>
                    </el-form-item>
                    <el-form-item label="仓库领料明细" prop="warehouseGetDetail">
                      <UploadFile v-model="formData.warehouseGetDetail"/>
                    </el-form-item>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="质检信息" name="5">
                  <div
                    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
                    <el-form-item label="外观内饰1" prop="exteriorInterior1">
                      <UploadImg v-model="formData.exteriorInterior1"/>
                    </el-form-item>

                    <el-form-item label="外观内饰2" prop="exteriorInterior2">
                      <UploadImg v-model="formData.exteriorInterior2"/>
                    </el-form-item>

                    <el-form-item label="刮研图1" prop="scrapingDrawing1">
                      <UploadImg v-model="formData.scrapingDrawing1"/>
                    </el-form-item>

                    <el-form-item label="刮研图2" prop="scrapingDrawing2">
                      <UploadImg v-model="formData.scrapingDrawing2"/>
                    </el-form-item>

                    <el-form-item label="刮研图3" prop="scrapingDrawing3">
                      <UploadImg v-model="formData.scrapingDrawing3"/>
                    </el-form-item>

                    <el-form-item label="质检报告" prop="qualityInspectionReport">
                      <UploadFile v-model="formData.qualityInspectionReport"/>
                    </el-form-item>

                    <el-form-item label="配置核对" prop="configurationCheck">
                      <UploadFile v-model="formData.configurationCheck"/>
                    </el-form-item>

                    <el-form-item label="质检人员" prop="qualityInspectionPersonnel">
                      <el-input v-model="formData.qualityInspectionPersonnel"
                                placeholder="请选择质检人"
                                disabled>
                        <template #append>
                          <el-button @click="openSelectSysUser5('0')">
                            <Icon icon="ep:search"/>
                            选择质检人
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="发货信息" name="6">
                  <div
                    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
                    <el-form-item label="发货装车图" prop="shipmentLoadingDrawing">
                      <UploadImg v-model="formData.shipmentLoadingDrawing"/>
                    </el-form-item>
                    <el-form-item label="装箱单" prop="packingList">
                      <UploadFile v-model="formData.packingList"/>
                    </el-form-item>
                    <el-form-item label="发货重量" prop="shippingWeight">
                      <el-input v-model="formData.shippingWeight" placeholder="请输入发货重量"/>
                    </el-form-item>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="其他信息" name="7">
                  <div
                    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"/>
                    </el-form-item>
                    <el-form-item label="附图" prop="figure">
                      <UploadImg v-model="formData.figure"/>
                    </el-form-item>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-form>
        </el-scrollbar>
      </template>
    </EditFrame>
    <toolstencilListForm
      ref="purchaseOrderInEnableListRef"
      @success="handlePurchaseOrderChange"
    />
    <selectClientInfo
      ref="purchaseOrderInEnableListRef1"
      @success="handlePurchaseOrderChange1"
    />
    <rtuModuleListForm
      ref="purchaseOrderInEnableListRef2"
      @success="handlePurchaseOrderChange2"
    />
    <!--  负责人选择  -->
    <SelectSysUser ref="selectSysUserRef1" @success="handleSelectSysUserChange1"/>
    <SelectSysUser ref="selectSysUserRef2" @success="handleSelectSysUserChange2"/>
    <SelectSysUser ref="selectSysUserRef3" @success="handleSelectSysUserChange3"/>
    <SelectSysUser ref="selectSysUserRef4" @success="handleSelectSysUserChange4"/>
    <SelectSysUser ref="selectSysUserRef5" @success="handleSelectSysUserChange5"/>
    <SelectSysUser ref="selectSysUserRef6" @success="handleSelectSysUserChange6"/>
    <SelectSysUser ref="selectSysUserRef7" @success="handleSelectSysUserChange7"/>
  </div>
</template>
