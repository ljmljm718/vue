//templateCreateOrUpdate
<template>
  <div>

    <EditFrame>
      <template #header>
        <div :disabled="isShow" class="flex">
          <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
          >
            保存
          </el-button>
          <el-button
            type="success"
            :icon="TopRight"
            plain
            :disabled="isShow"
            @click="submitForm"
          >提交
          </el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
            :disabled="isShow"
            @click="resetForm()"
          >清空
          </el-button>
        </div>
      </template>

      <template #content>
        <!-- 原内容 -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          v-loading="formLoading"
          :disabled="isShow"
        >
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="作物id" prop="cropId">
                <el-input v-model="formData.cropId" readonly placeholder="请选择">
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
              <el-form-item label="名称" prop="cropName">
                <el-input v-model="formData.cropName" placeholder="请输入名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品种" prop="cropType">
                <el-select v-model="formData.cropType" placeholder="请选择品种">
                  <el-option
                    v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="生长期" prop="growth">
                <el-input v-model="formData.growth" placeholder="请输入生长期"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="特点" prop="feature">
                <el-input v-model="formData.feature" type="textarea" placeholder="请输入特点"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生长地点" prop="growSite">
                <el-input v-model="formData.growSite" type="textarea" placeholder="请输入生长地点"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="环境条件" prop="envCondition">
                <el-input
                  v-model="formData.envCondition" type="textarea"
                  placeholder="请输入环境条件"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属基地" prop="belongPark">
                <el-input v-model="formData.belongPark" placeholder="请输入所属基地">
                  <template #append>
                    <el-button @click="openParkInfoPopup('0')">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="基地名称" prop="parkName">
                <el-input v-model="formData.parkName" placeholder="选择基地后自动写入" readonly/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属地块" prop="belongPlot">
                <el-input v-model="formData.belongPlot" placeholder="请输入所属地块">
                  <template #append>
                    <el-button @click="openParkDetailPopup(formData.belongPark)">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地块名称" prop="plotName">
                <el-input v-model="formData.plotName" placeholder="选择地块后自动写入" readonly/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="formData.startTime"
                  type="date"
                  value-format="x"
                  placeholder="选择开始时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="formData.endTime"
                  type="date"
                  value-format="x"
                  placeholder="选择结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="图片" prop="imgId">
                <UploadImg :disabled="isShow" v-model="formData.imgId"/>
              </el-form-item>
            </el-col>
          </el-row>


        </el-form>
      </template>
    </EditFrame>
    <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

    <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>

    <CropInfoPopup ref="cropInfoPopupRef" @success="handleCropInfoPopupChange"/>
  </div>
</template>
<script setup lang="ts">
import {
  EditFrame,
  addFormStorage,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {CropGrowthApi, CropGrowthVO} from '@/api/agriculture/cropgrowth'
import {ParkInfoApi, ParkInfoVO} from '@/api/agriculture/parkinfo'
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import {ParkDetailApi, ParkDetailVO} from '@/api/agriculture/parkdetail'
import CropInfoPopup from "@/views/agriculture/cropgrowth/components/CropInfoPopup.vue";
import {CropBaseVO} from "@/api/agriculture/cropbase";
import {MarketingProgramApi} from "@/api/agriculture/marketingprogram";

/** 作物生长期管理 表单 */
defineOptions({name: 'CropGrowthForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  cropCode: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  growth: undefined,
  feature: undefined,
  remark: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  startTime: undefined,
  endTime: undefined,
  parkName: undefined,
  plotName: undefined,
  parkDetailName: undefined,
  envCondition: undefined,
  growSite: undefined,

})
const formRules = reactive({
  cropName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref
const isShow = ref<boolean>(false);
// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = ''
const ORIGIN_PATH = '/farm_work/crop-growth' // 关闭表单时跳转的路径

const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage(ROUTE_PATH, id)
  if (_form) formData.value = _form.formContent
}
if (!formData.value.id) loadData()

const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}
//方式一:调用
// if(route.query.id){
//     替换成自己的
//     MarketingProgramApi.getMarketingProgram(route.query.id).then(res=>{
//     formData.value = res
//     formData.value.marketingType ='productmanual'
//     });
// }
// 方式二 调用立即执行函数
// onMounted(async () => {
//       await open(route.query.type,route.query.id);
// });
// 注意需要在submit最后一行,即faill前面加--router.push(ORIGIN_PATH),即跳转回原地址


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
    formData.value.belongPark = (order[0].code).toString()
    formData.value.parkName = (order[0].name).toString()
  } else formData.value.belongPlot = (order[0].id).toString()
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

  console.log("--->>查看选择的地块信息：", order[0])
  formData.value.belongPark = (order[0].parkId).toString()
  formData.value.belongPlot = (order[0].id).toString()
  formData.value.parkDetailName = (order[0].name).toString()
  formData.value.plotName = (order[0].name).toString()

}

if (route.query.id) {
  let idNumber = route.query.id;
  CropGrowthApi.getCropGrowth(idNumber).then(res => {
    formData.value = res

    // formData.value.marketingType ='productmanual'
  });
}
if (route.query.type == 'select') {
  isShow.value = true;
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
  formData.value.plotName = String(order[0].plotName)
  formData.value.parkName = String(order[0].parkName)
  formData.value.parkDetailName = String(order[0].plotName)

}


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
      formData.value = await CropGrowthApi.getCropGrowth(id)
    } finally {
      formLoading.value = false
      isShow.value = true;

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
    const data = formData.value as unknown as CropGrowthVO
    console.log(formType.value)
    if (!formData.value.id) {
      await CropGrowthApi.createCropGrowth(data)
      message.success(t('common.createSuccess'))
    } else {
      await CropGrowthApi.updateCropGrowth(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    router.push(ORIGIN_PATH)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    cropCode: undefined,
    cropId: undefined,
    cropName: undefined,
    cropType: undefined,
    imgId: undefined,
    growth: undefined,
    feature: undefined,
    remark: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    startTime: undefined,
    endTime: undefined,
    parkName: undefined,
    parkDetailName: undefined,
    envCondition: undefined,
    growSite: undefined,
  }
  formRef.value?.resetFields()
}
</script>
