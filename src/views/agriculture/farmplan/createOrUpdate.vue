<script setup lang="ts">
import {
  EditFrame,
  addFormStorage,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index'
import {
  FolderChecked,
  TopRight,
  Refresh
} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {useTagsViewStore} from "@/store/modules/tagsView";
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import CropInfoPopup from "@/views/agriculture/cropgrowth/components/CropInfoPopup.vue";
import SelectSysUser from "@/views/agriculture/farmplan/SelectSysUser.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import {CropBaseVO} from "@/api/agriculture/cropbase";
import {UserVO} from "@/api/login/types";
import {FarmPlanApi, FarmPlanVO} from "@/api/agriculture/farmplan";
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import {ParkCategoryApi} from "@/api/agriculture/parkcategory";

const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '农事计划'
const ORIGIN_PATH = '/farm_work/farmManage/farm-plan' // 关闭表单时跳转的路径
// TODO: name使用创建菜单时填写的组件名
defineOptions({name: 'CreateOrUpdateFarmPlanForm'})

// 页面 Loading
const formLoading = ref<boolean>(false)
// 表单 Ref
const formRef = ref()
// 表单字段数据
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
  finishArea: undefined,
  farmDefineType: undefined,
  batchCode: undefined,
})
// 表单校验规则
const formRules = reactive({
  farmDefineType: [{required: true, message: '农事阶段不能为空', trigger: 'blur'}],
  planName: [{required: true, message: '计划名称不能为空', trigger: 'blur'}],
  parkName: [{required: true, message: '基地名称不能为空', trigger: 'blur'}],
  plotName: [{required: true, message: '地块名称不能为空', trigger: 'blur'}],
  planArea: [{required: true, message: '计划面积不能为空', trigger: 'blur'}],
  startTime: [{required: true, message: '计划开始时间不能为空', trigger: 'blur'}],
  endTime: [{required: true, message: '计划结束时间不能为空', trigger: 'blur'}],
})

//基地的选择
const parkInfoPopupRef = ref()
const openType = ref('')
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    ElMessage.error("请先选择基地")
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
    ElMessage.error("请先选择基地！")
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

  console.log("--->>查看选择的作物信息：", order[0])
  formData.value.cropId = String(order[0].id)
  formData.value.cropName = String(order[0].cropName)
  formData.value.cropType = String(order[0].cropType)
  formData.value.belongPark = String(order[0].belongPark)
  formData.value.belongPlot = String(order[0].belongPlot)
  formData.value.parkName = String(order[0].parkName)
  formData.value.plotName = String(order[0].plotName)
  formData.value.batchCode = String(order[0].batchCode)

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
// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FarmPlanVO
    if (!formData.value.id) {
      // TODO: 没有id，说明是新增，下面调用新增接口
      // await API_INSERT({ ...formData.value })
      data.area = data.planArea
      data.finishArea = "0"
      await FarmPlanApi.createFarmPlan(data)
      ElMessage.success('提交成功！')
    } else {
      // TODO: 有id，说明是修改，下面调用修改接口
      await FarmPlanApi.updateFarmPlan(data)
      ElMessage.success('提交成功！')
    }
    // 表单已提交，从本地删除此表单
    deleteFormStorage(
      ROUTE_PATH,
      formData.value.id ? formData.value.id : 'new_form'
    )
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
    router.push(ORIGIN_PATH)
  } catch (err) {
    ElMessage.error('提交失败, 请联系管理员')
  } finally {
    formLoading.value = false
  }
}
// 重置表单方法
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
    farmDefineType: undefined,
    finishArea: undefined,
    batchCode: undefined,
  }
  formRef.value?.resetFields()
}
// 本地保存表单
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}

// 从本地加载数据
const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage(ROUTE_PATH, id)
  if (_form) formData.value = _form.formContent
}

const getFormInfo = async () => {
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
  resetForm()
  formData.value = await FarmPlanApi.getFarmPlan(route.query.id)
  formData.value.farmDefineType = formData.value.farmDefineType ? parseInt(formData.value.farmDefineType) : "";
}
const getTreeOptions = async () => {
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
}
const Updisabled = ref<boolean>(false)
if (route.query.id) {
  if (route.query.type === 'view'){
    Updisabled.value = true
  }
  getFormInfo()
} else {
  getTreeOptions()
}

if (!formData.value.id) loadData()

// 手风琴展开项
const activeName = ref<any>(['1', '2'])
</script>
<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex">
          <el-button
            type="success"
            v-show="!Updisabled"
            :icon="TopRight"
            plain
            @click="submitForm"
          >提交
          </el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            v-show="!Updisabled"
            plain
            @click="resetForm()"
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
            v-show="!Updisabled"
            plain
            @click="localSave()"
          >
            暂存
          </el-button>
        </div>
      </template>
      <template #content>
        <el-scrollbar class="croll-bar-template">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            :disabled="Updisabled"
            label-width="100px"
            v-loading="formLoading"
            class="grid gap-3 p-4"
          >
            <!-- TODO: 表单项写在这里 -->
            <!-- TODO: 如果使用手风琴，参考下面的代码 下面的注意不用的话要删掉 -->
            <el-collapse v-model="activeName" simple>
              <el-collapse-item class="grid sm:grid-cols-1 gap-2 p-4"
                                title="作物信息" name="1">
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="作物编码" prop="cropId">
                      <el-input v-model="formData.cropId" disabled placeholder="请输入作物编码">
                        <template #append>
                          <el-button style="color: black" @click="openCropInfoPopup()">
                            <Icon icon="ep:search"/>
                            选择
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="作物名称" prop="cropName">
                      <el-input v-model="formData.cropName" disabled placeholder="请输入作物名称"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="所属基地" prop="belongPark">
                      <el-input v-model="formData.belongPark" disabled placeholder="请输入所属基地">
                        <template #append>
                          <el-button style="color: black" @click="openParkInfoPopup('0')">
                            <Icon icon="ep:search"/>
                            选择
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="基地名称" prop="parkName">
                      <el-input v-model="formData.parkName" disabled placeholder="请输入基地名称"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="所属地块" prop="belongPlot">
                      <el-input v-model="formData.belongPlot" disabled placeholder="请输入所属地块">
                        <template #append>
                          <el-button style="color: black"
                                     @click="openParkDetailPopup(formData.belongPark)">
                            <Icon icon="ep:search"/>
                            选择
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="地块名称" prop="plotName">
                      <el-input v-model="formData.plotName" disabled placeholder="请输入地块名称"/>
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
                    <el-form-item label="批次码" prop="batchCode">
                      <el-input v-model="formData.batchCode" disabled placeholder="请输入批次码"/>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-collapse-item>
              <el-collapse-item class="grid sm:grid-cols-1 gap-2 p-4" title="计划信息" name="2">
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="计划编码" prop="planCode">
                      <el-input v-model="formData.planCode" disabled
                                placeholder="系统自动生成...."/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="计划名称" prop="planName">
                      <el-input v-model="formData.planName" placeholder="请输入计划名称"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="责任人编号" prop="personId">
                      <el-input v-model="formData.personId" disabled placeholder="请输入责任人编号">
                        <template #append>
                          <el-button style="color: black" @click="openSelectSysUser('0')">
                            <Icon icon="ep:search"/>
                            选择员工
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任人" prop="personName">
                      <el-input v-model="formData.personName" disabled placeholder="请输入责任人"/>
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
                    <el-form-item label="计划面积(亩)" prop="planArea" label-width="120">
                      <el-input v-model="formData.planArea" placeholder="请输入计划面积（亩）"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
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
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-scrollbar>
      </template>
    </EditFrame>
  </div>


  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>

  <CropInfoPopup ref="cropInfoPopupRef" @success="handleCropInfoPopupChange"/>
  <!--  工作人员选择  -->
  <SelectSysUser ref="selectSysUserRef" @success="handleSelectSysUserChange"/>
</template>
<style scoped>
.scroll-bar-template {
  height: calc(100vh - 200px);
  overflow: auto;
}</style>
