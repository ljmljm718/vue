//templateCreateOrUpdate
<template>
  <div>

    <EditFrame>
      <template #header v-if="show1">
        <div class="flex">
          <!-- <el-button
           type="primary"
           :icon="FolderChecked"
           plain
           @click="localSave()"
         >
           保存
         </el-button> -->
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm"
          >提交
          </el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
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
        >
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="产品名称" prop="product">
                <el-input v-model="formData.product" placeholder="请输入产品名称" :disabled="show"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次号" prop="batchCode">
                <el-input v-model="formData.batchCode" placeholder="请输入批次号" :disabled="show"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采收编号" prop="recoveryNum">
                <el-input v-model="formData.recoveryNum" placeholder="请输入采收编号"
                          :disabled="show"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="所属基地id" prop="parkId">
                <el-input v-model="formData.parkId" placeholder="请输入所属基地id" :disabled="true">
                  <template #append>
                    <el-button @click="openParkInfoPopup('0')">
                      <Icon icon="ep:search"/>
                      选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属基地" prop="park">
                <el-input v-model="formData.park" placeholder="选择基地后自动写入" readonly
                          :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属地块id" prop="parkDetailId">
                <el-input v-model="formData.parkDetailId" placeholder="请输入所属地块id"
                          :disabled="true">
                  <template #append>
                    <el-button @click="openParkDetailPopup(formData.belongPark)">
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
              <el-form-item label="所属地块" prop="parkDetail">
                <el-input v-model="formData.parkDetail" placeholder="选择地块后自动写入" readonly
                          :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品年份" prop="years">
                <el-input v-model="formData.years" placeholder="请输入产品年份" :disabled="show"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品数量(袋)" prop="inventory">
                <el-input v-model="formData.inventory" placeholder="请输入库存" :disabled="show"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="产品规格(Kg)" prop="specifications">
                <el-input v-model="formData.specifications" placeholder="请输入规格"
                          :disabled="show"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="show">
              <el-form-item label="消耗量(Kg)" prop="remark">
                <el-input v-model="formData.remark" placeholder="请输入消耗量(Kg)" :disabled="show"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图片" prop="photo">
                <UploadImg v-model="formData.photo" :disabled="show"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </EditFrame>
    <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

    <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>
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
import {VillageProductApi, VillageProductVO} from "@/api/digital/villageproduct";
import {useTagsViewStore} from "@/store/modules/tagsView";

/** 作物生长期管理 表单 */
defineOptions({name: 'CropGrowthForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const show = ref(false)
const show1 = ref(true)
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  product: undefined,
  parkId: undefined,
  park: undefined,
  parkDetailId: undefined,
  parkDetail: undefined,
  photo: undefined,
  years: undefined,
  inventory: undefined,
  specifications: undefined,
  remark: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  parkName: undefined,
  plotName: undefined,
  deptId: undefined,
  userId: undefined,
  batchCode: undefined,
  recoveryNum: undefined,
})
const formRules = reactive({
  product: [{required: true, message: '产品名称不能为空', trigger: 'blur'}],
  parkId: [{required: true, message: '基地不能为空', trigger: 'blur'}],
  parkDetailId: [{required: true, message: '地块不能为空', trigger: 'blur'}],
  years: [{required: true, message: '产品年份不能为空', trigger: 'blur'}],
  inventory: [{required: true, message: '产品数量不能为空', trigger: 'blur'}],
  specifications: [{required: true, message: '产品规格不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref
// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = ''
const ORIGIN_PATH = '/pcg/production/village-product' // 关闭表单时跳转的路径

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
    formData.value.parkId = (order[0].code).toString()
    formData.value.parkName = (order[0].name).toString()
    formData.value.park = (order[0].name).toString()
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
  formData.value.parkDetailId = (order[0].id).toString()
  formData.value.belongPlot = (order[0].id).toString()
  formData.value.parkDetail = (order[0].name).toString()
  formData.value.plotName = (order[0].name).toString()

}

if (route.query.id) {
  let idNumber = route.query.id;
  // show1.value = false
  if (route.query.type) {
    let type = route.query.type;
    if (type === 'show') {
      show1.value = false
    }
  }
  VillageProductApi.getVillageProduct(idNumber).then(res => {
    formData.value = res
    // formData.value.marketingType ='productmanual'
  });
}



/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  console.log(type)

  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await VillageProductApi.getVillageProduct(id)
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
    const data = formData.value as unknown as VillageProductVO
    if (!formData.value.id) {
      await VillageProductApi.createVillageProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await VillageProductApi.updateVillageProduct(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
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
    product: undefined,
    parkId: undefined,
    park: undefined,
    parkDetailId: undefined,
    parkDetail: undefined,
    photo: undefined,
    years: undefined,
    inventory: undefined,
    specifications: undefined,
    remark: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    parkName: undefined,
    plotName: undefined,
    deptId: undefined,
    userId: undefined,
    batchCode: undefined,
    recoveryNum: undefined,
  }
  formRef.value?.resetFields()
}
</script>
