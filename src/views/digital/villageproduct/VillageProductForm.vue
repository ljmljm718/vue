<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <div v-if="boo">
        <el-form-item label="产品名称" prop="product">
          <el-input v-model="formData.product" placeholder="请输入产品名称" :disabled="true"/>
        </el-form-item>
        <el-form-item label="批次号" prop="batchCode">
          <el-input v-model="formData.batchCode" placeholder="请输入批次号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="采收编号" prop="recoveryNum">
          <el-input v-model="formData.recoveryNum" placeholder="请输入采收编号" :disabled="true"/>
        </el-form-item>

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
        <el-form-item label="所属基地" prop="park">
          <el-input v-model="formData.park" placeholder="选择基地后自动写入" readonly :disabled="true"/>
        </el-form-item>
        <el-form-item label="所属地块id" prop="parkDetailId">
          <el-input v-model="formData.parkDetailId" placeholder="请输入所属地块id" :disabled="true">
            <template #append>
              <el-button @click="openParkDetailPopup(formData.belongPark)">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属地块" prop="parkDetail">
          <el-input v-model="formData.parkDetail" placeholder="选择地块后自动写入" readonly :disabled="true"/>
        </el-form-item>
      </div>

      <div v-if="!boo" >
        <el-form-item label="产品名称" prop="product">
          <el-input v-model="formData.product" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="批次号" prop="batchCode">
          <el-input v-model="formData.batchCode" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="采收编号" prop="recoveryNum">
          <el-input v-model="formData.recoveryNum" placeholder="请输入采收编号" />
        </el-form-item>

        <el-form-item label="所属基地id" prop="parkId">
          <el-input v-model="formData.parkId" placeholder="请输入所属基地id" >
            <template #append>
              <el-button @click="openParkInfoPopup('0')">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属基地" prop="park">
          <el-input v-model="formData.park" placeholder="选择基地后自动写入" readonly />
        </el-form-item>
        <el-form-item label="所属地块id" prop="parkDetailId">
          <el-input v-model="formData.parkDetailId" placeholder="请输入所属地块id" >
            <template #append>
              <el-button @click="openParkDetailPopup(formData.belongPark)">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属地块" prop="parkDetail">
          <el-input v-model="formData.parkDetail" placeholder="选择地块后自动写入" readonly />
        </el-form-item>
      </div>

      <el-form-item label="图片" prop="photo">
        <UploadImg v-model="formData.photo"/>
      </el-form-item>
      <el-form-item label="产品年份" prop="years">
        <el-input v-model="formData.years" placeholder="请输入产品年份"/>
      </el-form-item>
      <el-form-item label="产品数量(袋)" prop="inventory">
        <el-input v-model="formData.inventory" placeholder="请输入产品数量"/>
      </el-form-item>
      <el-form-item label="产品规格(Kg)" prop="specifications">
        <el-input v-model="formData.specifications" placeholder="请输入产品规格"/>
      </el-form-item>
      <!-- <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="formData.batchCode" placeholder="请输入批次号" />
      </el-form-item> -->
      <el-form-item label="消耗量(Kg)" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入消耗量(Kg)"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>
</template>
<script setup lang="ts">
import {VillageProductApi, VillageProductVO} from '@/api/digital/villageproduct'
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";

/** 特色产品 表单 */
defineOptions({name: 'VillageProductForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
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
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const boo = ref(false)
const open = async (type: string, id?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if(typeof id === 'object' || typeof id === 'number'){
    console.log(id,"-----===")
    //批次号
    formData.value.batchCode = id.batchCode
    //采收编号
    formData.value.recoveryNum = id.id
    //基地id
    formData.value.parkId = id.belongPark
    //基地名称
    formData.value.park = id.parkName
    //地块id
    formData.value.parkDetailId = id.belongPlot
    //地块名称
    formData.value.parkDetail = id.parkDetailName
    //产品名称
    formData.value.product = id.varietyName
    boo.value= true
  }
  // 修改时，设置数据
  if (typeof id === 'string') {
    console.log( "--进来了id");
    formLoading.value = true
    try {
      formData.value = await VillageProductApi.getVillageProduct(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

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
    formData.value.park = String(order[0].name)
    formData.value.parkId = String(order[0].id)
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

  console.log("--->>查看选择的地块信息：", order[0])
  formData.value.belongPark = String(order[0].parkId)
  formData.value.parkDetailId = String(order[0].id)
  formData.value.parkDetail = String(order[0].name)

}


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as VillageProductVO
    if (formType.value === 'create') {
      await VillageProductApi.createVillageProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await VillageProductApi.updateVillageProduct(data)
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
