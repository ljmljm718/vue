//class="grid 2xl:grid-cols-2 gap-3 p-4"
//class="col-span-2"
<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex">
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm()"
            v-if="route.query.type as any !=='select'"
          >提交</el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
            @click="resetForm()"
            v-if="route.query.type as any !=='select'"
          >清空
          </el-button>
        </div>
        <div>
          <el-button
            type="primary"
            plain
            @click="router.back()"
          >返回</el-button>
          <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
            v-if="route.query.type as any !=='select'"
          >
            暂存
          </el-button>
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
        >
    <!--      <el-row :gutter="3">-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="农事计划编码" prop="planId">-->
    <!--            <el-input v-model="formData.planId" disabled placeholder="请输入农事计划编码" >-->
    <!--              <template #append>-->
    <!--                <el-button @click="openFarmPlanPopup()">-->
    <!--                  <Icon icon="ep:search"/>-->
    <!--                  选择-->
    <!--                </el-button>-->
    <!--              </template>-->
    <!--            </el-input>-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="农事计划名称" prop="planName">-->
    <!--            <el-input v-model="formData.planName" disabled placeholder="请输入农事计划名称" />-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
          <el-row :gutter="3">
            <el-col :span="12" v-if="show !==117">
              <el-form-item label="作物编号" prop="cropId">
                <el-input v-model="formData.cropId" disabled placeholder="请输入作物编号" >
                  <template #append>
                    <el-button @click="openCropInfoPopup()">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="show !==117">
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
              <el-form-item label="种植品类" prop="cropType">
                <el-select v-model="formData.cropType" disabled placeholder="请选择种植品类">
                  <el-option
                    v-for="item in listCategoryManagement"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.id"/>
                </el-select>
<!--                <el-input v-model="formData.cropType" placeholder="请选择种植品类">-->
<!--                  <template #append>-->
<!--                    <el-button @click="openBreedFrom()">-->
<!--                      <Icon icon="ep:search"/>-->
<!--                      选择-->
<!--                    </el-button>-->
<!--                  </template>-->
<!--                </el-input>-->
              </el-form-item>
            </el-col>
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="计划状态" prop="planState">-->
    <!--            <el-select v-model="formData.planState" disabled placeholder="请选择计划状态">-->
    <!--              <el-option-->
    <!--                v-for="dict in getStrDictOptions(DICT_TYPE.FARM_PLAN_STATE)"-->
    <!--                :key="dict.value"-->
    <!--                :label="dict.label"-->
    <!--                :value="dict.value"-->
    <!--              />-->
    <!--            </el-select>-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row :gutter="3">-->
            <el-col :span="12" v-if="show !==117">
              <el-form-item label="批次码" prop="batchCode">
                <el-input v-model="formData.batchCode" placeholder="请输入批次码" />
              </el-form-item>
            </el-col>
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
    <!--      <el-row :gutter="3">-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="计划开始时间"   prop="startTime">-->
    <!--            <el-date-picker-->
    <!--              v-model="formData.startTime"-->
    <!--              disabled-->
    <!--              type="date"-->
    <!--              style="width: 100%"-->
    <!--              value-format="x"-->
    <!--              placeholder="选择计划开始时间"-->
    <!--            />-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="计划结束时间"  prop="endTime">-->
    <!--            <el-date-picker-->
    <!--              v-model="formData.endTime"-->
    <!--              disabled-->
    <!--              type="date"-->
    <!--              style="width: 100%"-->
    <!--              value-format="x"-->
    <!--              placeholder="选择计划结束时间"-->
    <!--            />-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
          <el-row :gutter="3">
            <el-col :span="12">
              <el-form-item label="记录时间" prop="recordTime">
                <el-date-picker
                  v-model="formData.recordTime"
                  type="datetime"
                  style="width: 100%"
                  value-format="x"
                  placeholder="选择记录时间"
                />
              </el-form-item>
            </el-col>
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="计划面积（亩）"  prop="planArea"  label-width="120">-->
    <!--            <el-input v-model="formData.planArea" disabled placeholder="请输入计划面积（亩）" />-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row :gutter="3">-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="完成面积（亩）" prop="finishArea"  label-width="120">-->
    <!--            <el-input v-model="formData.finishArea" disabled />-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="剩余面积（亩）" prop="area"  label-width="120">-->
    <!--            <el-input v-model="formData.area" disabled />-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row :gutter="3">-->
            <el-col :span="12" v-if="show !==117">
              <el-form-item label="土地面积（亩）" prop="recordArea" label-width="120">
                <el-input v-model="formData.recordArea" placeholder="请输入土地面积（亩）" />
              </el-form-item>
            </el-col>
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="记录状态" prop="recordState">-->
    <!--            <el-select v-model="formData.recordState" placeholder="请选择记录状态">-->
    <!--              <el-option-->
    <!--                v-for="dict in getStrDictOptions(DICT_TYPE.FARM_RECORD_STATE)"-->
    <!--                :key="dict.value"-->
    <!--                :label="dict.label"-->
    <!--                :value="dict.value"-->
    <!--              />-->
    <!--            </el-select>-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
          </el-row>
          <el-row :gutter="3">
            <el-col :span="12">
              <el-form-item label="记录图片" prop="recordImg">
                <UploadImg v-model="formData.recordImg" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 截至 -->
        </el-scrollbar>
      </template>
    </EditFrame>


  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>

  <CropInfoPopup ref="cropInfoPopupRef" @success="handleCropInfoPopupChange"/>
  <!--  工作人员选择  -->
  <SelectSysUser ref="selectSysUserRef" @success="handleSelectSysUserChange"/>

  <SelectFarmPlan ref="selectFarmPlanRef" @success="handleSelectFarmPlanChange"/>

  <BreedFrom ref="BreedFromRef" @success="BreedFromSuccess"/>
  </div>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { FarmRecordApi, FarmRecordVO } from '@/api/agriculture/farmrecord'
import CropInfoPopup from "@/views/agriculture/cropgrowth/components/CropInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import SelectSysUser from "@/views/agriculture/farmplan/SelectSysUser.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import {CropBaseVO} from "@/api/agriculture/cropbase";
import SelectFarmPlan from "@/views/agriculture/farmrecord/SelectFarmPlan.vue";
import {FarmPlanVO} from "@/api/agriculture/farmplan";
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import {EditFrame,addFormStorage,addOrUpdateFormStorage,getFormStorage,deleteFormStorage} from '@/components/EditFrame/index'
import { useTagsViewStore } from "@/store/modules/tagsView";
import {useUserStore} from "@/store/modules/user";
import { createA, updatestate } from '@/api/bigscreenMingYue'
import {UserVO} from "@/api/login/types";
import BreedFrom from "@/views/agriculture/varietymanagement/SelectVarirtManagement.vue";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

/** 农事记录 表单 */
defineOptions({ name: 'FarmRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const formData = ref<any>({
  id: undefined,
  planId: undefined,
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
  recordTime: undefined,
  planArea: undefined,
  recordArea: undefined,
  recordState: undefined,
  finishArea:undefined,
  area:undefined,
  farmDefineType:undefined,
  batchCode:undefined,
  recordImg: undefined,

})
const formRules = reactive({
  recordTime: [{ required: true, message: '记录时间不能为空', trigger: 'blur' }],
  recordState: [{ required: true, message: '记录状态不能为空', trigger: 'blur' }],
  recordImg: [{ required: true, message: '记录图片不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
let farmDefineOptions = ref([])// 设备分类选项

const show = ref()
const userStore = useUserStore()
//获取部门ID
const userName = computed(() => userStore.user.deptId ?? '0')
//show的值是部门ID的值
show.value = userName.value
//农事计划
const selectFarmPlanRef = ref()
const openFarmPlanPopup = () => {
  selectFarmPlanRef.value.open()
}
const handleSelectFarmPlanChange = (order: FarmPlanVO) => {
  console.log("--->>查看选择的地块信息：", order[0])

  formData.value.planId = String(order[0].id)
  formData.value.planName = String(order[0].planName)
  formData.value.cropId = String(order[0].cropId)
  formData.value.cropName = String(order[0].cropName)
  formData.value.cropType=String(order[0].cropType)
  formData.value.belongPark = String(order[0].belongPark)
  formData.value.belongPlot = String(order[0].belongPlot)
  formData.value.parkName = String(order[0].parkName)
  formData.value.plotName = String(order[0].plotName)
  formData.value.planState = String(order[0].planState)
  formData.value.personId = String(order[0].personId)
  formData.value.personName = String(order[0].personName)
  formData.value.startTime = order[0].startTime
  formData.value.endTime = order[0].startTime
  formData.value.planArea = String(order[0].planArea)
  formData.value.finishArea = String(order[0].finishArea)
  formData.value.area = String(order[0].area)
  formData.value.farmDefineType=order[0].farmDefineType?parseInt(order[0].farmDefineType):""
  formData.value.batchCode=String(order[0].batchCode)
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
  formData.value.batchCode=String(order[0].batchCode)

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

//品种名称管理
const BreedFromRef = ref()
const openBreedFrom = () => {
  BreedFromRef.value.open();
}
const BreedFromSuccess = (order: any) => {
  console.log(order,"---------=----");
  formData.value.cropId = String(order[0].id)
  formData.value.cropName = String(order[0].varietyName)
  formData.value.cropType = String(order[0].categoryId)
  console.log("formData", formData.value)
}


/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  debugger
  dialogTitle.value = t('action.' + type)
  formType.value = type
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      // 获取设备分类树
      farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
      formData.value = await FarmRecordApi.getFarmRecord(id)
      formData.value.farmDefineType=formData.value.farmDefineType?parseInt(formData.value.farmDefineType):"";

      formData.value.personName = formData.value.personName ==null? '': formData.value.personName
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  formData.value.recordTime = new Date(formData.value.recordTime).getTime()
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FarmRecordVO
    if (!formData.value.id) {
      await FarmRecordApi.createFarmRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await FarmRecordApi.updateFarmRecord(data)
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

  if (route.query.type === 'create' && route.query.id) {
    updatestate({
      id: route.query.id,
      planState: 2
    })
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    planId: undefined,
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
    recordTime: undefined,
    planArea: undefined,
    recordArea: undefined,
    recordState: undefined,
  }
  formRef.value?.resetFields()
}

// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '农事记录'
const ORIGIN_PATH = '/farm_work/farmManage/farm-record' // 关闭表单时跳转的路由

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
  listCategoryManagement.value = await allDataCacheManager.getData({})
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
  formData.value.recordTime= new Date().toLocaleString(route.query.recordTime);
  if(route.query.id && route.query.type !== 'create')  {
    formData.value = await FarmRecordApi.getFarmRecord (route.query.id as any);
    formData.value.farmDefineType=formData.value.farmDefineType?parseInt(formData.value.farmDefineType):"";
    formData.value.personName = formData.value.personName =="null"? '': formData.value.personName
    loadData(route.query.id);
  }
  if (route.query && route.query.type === 'create') {
    formData.value = { ...route.query }
    console.log("formData", formData.value);

    formData.value.recordArea = route.query.area
    formData.value.recordTime = new Date().toLocaleString(route.query.recordTime)
  }
}

// 方式二 调用立即执行函数
onMounted(async () => {
    getFrom();
});

</script>
