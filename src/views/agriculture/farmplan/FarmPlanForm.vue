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
          <el-form-item label="计划编码" prop="planCode">
            <el-input v-model="formData.planCode" disabled placeholder="系统自动生成...." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划名称" prop="planName">
            <el-input v-model="formData.planName" placeholder="请输入计划名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="作物id" prop="cropId">
            <el-input v-model="formData.cropId" disabled placeholder="请输入作物id" >
              <template #append>
                <el-button @click="openCropInfoPopup()">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作物名称" prop="cropName">
            <el-input v-model="formData.cropName" disabled placeholder="请输入作物名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="所属基地" prop="belongPark">
            <el-input v-model="formData.belongPark" disabled placeholder="请输入所属基地" >
              <template #append>
                <el-button @click="openParkInfoPopup('0')">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基地名称" prop="parkName">
            <el-input v-model="formData.parkName" disabled placeholder="请输入基地名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="所属地块" prop="belongPlot">
            <el-input v-model="formData.belongPlot" disabled placeholder="请输入所属地块" >
              <template #append>
                <el-button @click="openParkDetailPopup(formData.belongPark)">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地块名称" prop="plotName">
            <el-input v-model="formData.plotName" disabled placeholder="请输入地块名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="品种" prop="cropType">
            <el-select v-model="formData.cropType" disabled placeholder="请选择品种">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划状态" prop="planState">
            <el-select v-model="formData.planState" placeholder="请选择计划状态">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.FARM_PLAN_STATE)"
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
          <el-form-item label="责任人编号" prop="personId">
            <el-input v-model="formData.personId" disabled placeholder="请输入责任人编号" >
              <template #append>
                <el-button @click="openSelectSysUser('0')">
                  <Icon icon="ep:search"/>
                  选择员工
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人" prop="personName">
            <el-input v-model="formData.personName" disabled placeholder="请输入责任人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              type="date"
              style="width: 100%;"
              value-format="x"
              placeholder="选择开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              type="date"
              style="width: 100%;"
              value-format="x"
              placeholder="选择结束时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="农事阶段" prop="farmDefineType">
            <!--            <el-input v-model="formData.farmDefineType" placeholder="请输入农事阶段" />-->
            <el-select v-model="formData.farmDefineType" placeholder="请选择农事阶段">
              <el-option
                v-for="dict in farmDefineOptions"
                :key="dict.id"
                :label="dict.defineName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划面积（亩）" prop="planArea" label-width="120">
            <el-input v-model="formData.planArea" placeholder="请输入计划面积（亩）" />
          </el-form-item>
        </el-col>
      </el-row>

      <!--      <el-form-item label="土地面积（亩）" prop="area">-->
      <!--        <el-input v-model="formData.area" placeholder="请输入土地面积（亩）" />-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>


  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>

  <CropInfoPopup ref="cropInfoPopupRef" @success="handleCropInfoPopupChange"/>
  <!--  工作人员选择  -->
  <SelectSysUser ref="selectSysUserRef" @success="handleSelectSysUserChange"/>

</template>
<script setup lang="ts">
import { FarmPlanApi, FarmPlanVO } from '@/api/agri/farmplan'
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import {CropBaseVO} from "@/api/agriculture/cropbase";
import CropInfoPopup from "@/views/agriculture/cropgrowth/components/CropInfoPopup.vue";
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import SelectSysUser from "@/views/agriculture/farmplan/SelectSysUser.vue";
import {FarmDefineApi} from "@/api/agri/farmdefine";

/** 农事计划 表单 */
defineOptions({ name: 'FarmPlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planCode: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  planState: undefined,
  personId: undefined,
  personName: undefined,
  startTime: undefined,
  endTime: undefined,
  planArea: undefined,
  area: undefined,
  farmDefineType:undefined,
  finishArea:undefined,

})
const formRules = reactive({
  farmDefineType: [{ required: true, message: '农事阶段不能为空', trigger: 'blur' }],
  planName: [{ required: true, message: '计划名称不能为空', trigger: 'blur' }],
  parkName: [{ required: true, message: '基地名称不能为空', trigger: 'blur' }],
  plotName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '计划开始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '计划结束时间不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref


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
    formData.value.belongPark = String(order[0].code)
    formData.value.parkName = String(order[0].name)
  } else formData.value.belongPlot = String(order[0].id)
}

//地块的选择
const parkDetailPopupRef = ref()
const openType1 = ref('')
const openParkDetailPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value) {
    message.error("请先选择基地！")
  } else parkDetailPopupRef.value.open(id)
}
const handleParkDetailPopupChange = (order: ParkDetailVO) => {

  console.log("--->>查看选择的地块信息：", order[0])
  formData.value.belongPark = String(order[0].parkId)
  formData.value.belongPlot = String(order[0].id)
  formData.value.plotName = String(order[0].name)

}


//作物的选择
const cropInfoPopupRef = ref()
const openCropInfoPopup = () => {
  cropInfoPopupRef.value.open()
}
const handleCropInfoPopupChange = (order: CropBaseVO) => {

  console.log("--->>查看选择的作物信息：",order[0])
  formData.value.cropId = String(order[0].id)
  formData.value.cropName = String(order[0].cropName)
  formData.value.cropType=String(order[0].cropType)
  formData.value.belongPark = String(order[0].belongPark)
  formData.value.belongPlot = String(order[0].belongPlot)
  formData.value.parkName = String(order[0].parkName)
  formData.value.plotName = String(order[0].plotName)

}


//工作人员的选择
const selectSysUserRef = ref()
const openSelectSysUser = (id: string) => {
  selectSysUserRef.value.open(id)
}
const handleSelectSysUserChange = (order: UserVO) => {
  formData.value.personId = String(order[0].id)
  formData.value.personName = String(order[0].nickname)
}

let farmDefineOptions = ref([])// 设备分类选项
const farmDefineType = ref()
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type

  // 获取设备分类树
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await FarmPlanApi.getFarmPlan(id)
      formData.value.farmDefineType=parseInt(formData.value.farmDefineType);
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
    const data = formData.value as unknown as FarmPlanVO
    if (formType.value === 'create') {
      data.area=data.planArea
      data.finishArea="0"
      await FarmPlanApi.createFarmPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await FarmPlanApi.updateFarmPlan(data)
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
    planCode: undefined,
    planName: undefined,
    belongPark: undefined,
    parkName: undefined,
    belongPlot: undefined,
    plotName: undefined,
    cropId: undefined,
    cropName: undefined,
    cropType: undefined,
    planState: undefined,
    personId: undefined,
    personName: undefined,
    startTime: undefined,
    endTime: undefined,
    planArea: undefined,
    area: undefined,
    farmDefineType:undefined,
    finishArea:undefined,
  }
  formRef.value?.resetFields()
}
</script>
