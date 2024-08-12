<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex justify-between w-full">
          <div>
            <el-button
              type="success"
              :icon="TopRight"
              @click="submitForm"
              v-if="route.query.type as any !=='detail'"
            >提交
            </el-button>
            <el-button
              type="danger"
              :icon="Refresh"
              @click="resetForm()"
              v-if="route.query.type as any !=='detail'"
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
              v-if="route.query.type as any !=='detail'"
            >
              暂存
            </el-button>
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
            :disabled="disabled"
          >
            <el-form-item label="编号" prop="cropCode">
              <el-input v-model="formData.cropCode" disabled placeholder="系统自动生成...."/>
            </el-form-item>
            <el-row>
              <el-col :span="12">

                <el-form-item label="种植品种" prop="cropName">
                  <el-input v-model="formData.cropName" placeholder="请选择品种">
                    <template #append>
                      <el-button @click="openBreedFrom()">
                        <Icon icon="ep:search"/>
                        选择
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品类" prop="cropTypeName" >
                  <el-input v-model="cropTypeName" placeholder="选择品种后自动写入" readonly disabled/>
<!--                  <el-select v-model="formData.cropType" placeholder="请选择品种">-->
<!--                    <el-option-->
<!--                      v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"-->
<!--                      :key="dict.value"-->
<!--                      :label="dict.label"-->
<!--                      :value="dict.value"-->
<!--                    />-->
<!--                  </el-select>-->
<!--                  <el-select v-model="formData.cropType" clearable placeholder="请选择品类">-->
<!--                    <el-option-->
<!--                      v-for="item in listCategoryManagement"-->
<!--                      :key="item.id"-->
<!--                      :label="item.categoryName"-->
<!--                      :value="item.id"/>-->
<!--                  </el-select>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属基地" prop="belongPark">
                  <el-input v-model="formData.belongPark" placeholder="请输入所属基地">
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
              <el-col :span="12">
                <el-form-item label="基地名称" prop="parkName">
                  <el-input v-model="formData.parkName" placeholder="选择基地后自动写入" readonly disabled/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">  <el-form-item label="所属地块" prop="belongPlot">
                <el-input v-model="formData.belongPlot" placeholder="请输入所属地块">
                  <template #append>
                    <el-button @click="openParkDetailPopup(formData.belongPark)">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
                <!--                <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />-->
              </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="地块名称" prop="plotName">
                  <el-input v-model="formData.plotName" placeholder="选择地块后自动写入" readonly disabled/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime">
                  <el-date-picker
                    v-model="formData.receiptStartTime"
                    type="date"
                    style="width: 100%"
                    value-format="x"
                    placeholder="选择开始时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="startTime">
                  <el-date-picker
                    v-model="formData.receiptEndTime"
                    type="date"
                    style="width: 100%"
                    value-format="x"
                    placeholder="选择结束时间"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="数量" prop="number">
                  <el-input v-model="formData.number" placeholder="请输入数量" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位" prop="unit">
                  <el-input v-model="formData.unit" placeholder="请输入单位" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计产量" prop="predictedOutput">
                  <el-input v-model="formData.predictedOutput" placeholder="请输入预计产量" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="图片" prop="imgId">
                  <UploadImg :disabled="disabled" v-model="formData.imgId"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="描述" prop="cropDesc" style="height: 100%">
                  <el-input v-model="formData.cropDesc" placeholder="请输入描述" type="textarea"
                            :autosize="{ minRows: 7, maxRows: 8}"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea"
                        :autosize="{ minRows: 6, maxRows: 6}"/>
            </el-form-item>
          </el-form>
          <!-- 截至 -->
        </el-scrollbar>
      </template>
    </EditFrame>
  </div>
  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>

  <BreedFrom ref="BreedFromRef" @success="BreedFromSuccess"/>
</template>
<script setup lang="ts">
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
import {
  EditFrame,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {CropBaseApi, CropBaseVO} from '@/api/agriculture/cropbase'
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import { CategoryManagementVO, allDataCacheManager} from "@/api/agriculture/categorymanagement";
//品种管理页面
import BreedFrom from "@/views/agriculture/varietymanagement/SelectVarirtManagement.vue";

/** 鲁渝协作品种管理 表单 */
defineOptions({name: 'CreateOrUpdateCropbase'})
// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '种植管理'
const ORIGIN_PATH = '/farm_work/crop-base' // 关闭表单时跳转的路由
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const disabled = ref<boolean>(false) //表单是否可编辑
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const CategoryManagementQueryParams = reactive({})
const formData = ref({
  id: undefined,
  cropCode: undefined,
  breedId: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  cropDesc: undefined,
  remark: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  parkName: undefined,
  plotName: undefined,
  deptId: undefined,
  userId: undefined,
  receiptStartTime: undefined,
  receiptEndTime: undefined,
  number:undefined,
  unit:undefined,
  predictedOutput: undefined,
})
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
const cropTypeName = ref()
const getFrom = async () => {
  console.log(route.query.type  as any)
  resetForm();
  if (route.query.id) {
    // todo 
    formData.value = await CropBaseApi.getCropBase(route.query.id as any);
    //获取所有品类的详情数据
    console.log("-----=========")
    listCategoryManagement.value = await allDataCacheManager.getData({})
    console.log("-----=========++++")
    listCategoryManagement.value.forEach(itm => {
        
        if (formData.value.cropType == itm.id){
          cropTypeName.value = itm.categoryName
        }
    })
    await loadData(route.query.id);
  }
}

const formRules = reactive({
  cropName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
  cropType: [{required: true, message: '品种不能为空', trigger: 'change'}],
  imgId: [{required: true, message: '图片不能为空', trigger: 'blur'}],
  belongPlot: [{required: true, message: '所属基地不能为空', trigger: 'blur'}],
  belongPark: [{required: true, message: '所属地块不能为空', trigger: 'blur'}],
  number: [{required: true, message: '数量不能为空', trigger: 'blur'}],
  unit: [{required: true, message: '单位不能为空', trigger: 'blur'}],
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
      formData.value = await CropBaseApi.getCropBase(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

// 详情页面判断
if (route.query.type == 'detail') {
  disabled.value = true;
}

//品种名称管理
const BreedFromRef = ref()
const openBreedFrom = () => {
  BreedFromRef.value.open();
}
const BreedFromSuccess = (order: any) => {
  console.log(order,"---------=----");  
  formData.value.breedId = String(order[0].id)
  formData.value.cropName = String(order[0].varietyName)
  formData.value.cropType = String(order[0].categoryId)
  cropTypeName.value = String(order[0].categoryName)

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
    message.error("请选择地块")
  } else parkDetailPopupRef.value.open(id)
}
const handleParkDetailPopupChange = (order: ParkDetailVO) => {
  formData.value.belongPark = String(order[0].parkId)
  formData.value.belongPlot = String(order[0].id)
  formData.value.plotName = String(order[0].name)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CropBaseVO
    if (!formData.value.id) {
      await CropBaseApi.createCropBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await CropBaseApi.updateCropBase(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    await router.push(ORIGIN_PATH)
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
    cropCode: undefined,
    cropName: undefined,
    cropType: undefined,
    imgId: undefined,
    cropDesc: undefined,
    remark: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    parkName: undefined,
    plotName: undefined,
    deptId: undefined,
    userId: undefined,
    number:undefined,
    unit:undefined,
    predictedOutput: undefined,
  }
  formRef.value?.resetFields()
}




// 方式二 调用立即执行函数
onMounted(async () => {
  await getFrom();
});

</script>
