<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="888px">
    <el-form
      ref="formRef"
      class="py-6 px-3"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="采收量(/Kg)" prop="harvestVolume">
            <el-input v-model="formData.harvestVolume" placeholder="请输入采收量(/Kg)"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人工数量(人)" prop="laborQuantity">
            <el-input v-model="formData.laborQuantity" placeholder="请输入人工数量(人)"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="库存(/Kg)" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入库存(/Kg)"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="种植品种" prop="varietyName">
            <el-input v-model="formData.varietyName" placeholder="请输入种植作物" disabled>
              <template #append>
                <el-button @click="openParkInfoPopup('0')" :disabled="boo">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="品类" prop="variety">
            <el-input v-model="formData.variety" placeholder="自动写入" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次码" prop="batchCode">
            <el-input v-model="formData.batchCode" placeholder="自动写入" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="基地名称" prop="parkName">
            <el-input v-model="formData.parkName" placeholder="自动写入" readonly
                      disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地块名称" prop="parkDetailName">
            <el-input v-model="formData.parkDetailName" placeholder="自动写入" readonly
                      disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-form-item label="品种ID" prop="varietyId">-->
      <!--        <el-input v-model="formData.varietyId" placeholder="请输入品种ID" :disabled="boo"/>-->
      <!--      </el-form-item>-->
      <!-- 获取批次号 -->
      <!--      <el-form-item label="所属基地" prop="belongPark">-->
      <!--        <el-input v-model="formData.belongPark" placeholder="请输入所属基地" :disabled="boo">-->
      <!--          <template #append>-->
      <!--            <el-button @click="openParkInfoPopup('0')" :disabled="boo">-->
      <!--              <Icon icon="ep:search"/>-->
      <!--              选择-->
      <!--            </el-button>-->
      <!--          </template>-->
      <!--        </el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="基地名称" prop="parkName">-->
      <!--        <el-input v-model="formData.parkName" placeholder="选择基地后自动写入" readonly-->
      <!--                  :disabled="boo"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="所属地块" prop="belongPlot">-->
      <!--        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" :disabled="boo">-->
      <!--          <template #append>-->
      <!--            <el-button @click="openParkDetailPopup(formData.belongPark)" :disabled="boo">-->
      <!--              <Icon icon="ep:search"/>-->
      <!--              选择-->
      <!--            </el-button>-->
      <!--          </template>-->
      <!--        </el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="地块名称" prop="parkDetailName">-->
      <!--        <el-input v-model="formData.parkDetailName" placeholder="选择地块后自动写入" readonly-->
      <!--                  :disabled="boo"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="采收量(/Kg)" prop="harvestVolume">-->
      <!--        <el-input v-model="formData.harvestVolume" placeholder="请输入采收量(/Kg)"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="人工数量(人)" prop="laborQuantity">-->
      <!--        <el-input v-model="formData.laborQuantity" placeholder="请输入人工数量(人)"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="库存(/Kg)" prop="remark">-->
      <!--        <el-input v-model="formData.remark" placeholder="请输入库存(/Kg)"/>-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!--   种植作物弹窗-->
  <SelectCropBaseList ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>


</template>
<script setup lang="ts">
import {HarvestManagementApi, HarvestManagementVO} from '@/api/agriculture/harvestmanagement'
import SelectCropBaseList from "@/views/agriculture/cropbase/SelectCropBaseList.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {VarietyManagementVO, allDataCacheManager} from "@/api/agriculture/varietymanagement";
import {CropBaseVO} from "@/api/agriculture/cropbase";
import {string} from "vue-types";

/** 采收管理 表单 */
defineOptions({name: 'HarvestManagementForm'})

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  listVarietyManagement.value = await allDataCacheManager.getData({})
}
getTypeData()

const handleVarietyChange = (e) => {
  const _item = listVarietyManagement.value.find(item => (item.id === e))
  if (_item) formData.value.variety = _item.categoryId
}

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const boo = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  recordNum: undefined,
  upTime: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  harvestVolume: undefined,
  laborQuantity: undefined,
  remark: undefined,
  parkName: undefined,
  parkDetailName: undefined,
  varietyName: undefined, // 品种名称
  variety: undefined, // 品种
  varietyId: undefined, // 品种ID
  batchCode: undefined, // 批次码
  belongParkId: undefined, // 基地ID
  belongPlotId: undefined, // 地块ID
  varietyCode: undefined
})
const formRules = reactive({
  harvestVolume: [{required: true, message: '采收量不能为空', trigger: 'blur'}],
  laborQuantity: [{required: true, message: '人工数量不能为空', trigger: 'blur'}],
  remark: [{required: true, message: '库存不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref

//种植作物的选择
const parkInfoPopupRef = ref()
const openType = ref('')
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择种植作物")
  } else parkInfoPopupRef.value.open(id)
}
const handleParkInfoPopupChange = (order: CropBaseVO) => {
  formData.value.variety = String(order[0].cropType)
  formData.value.varietyId = String(order[0].cropCode)
  formData.value.varietyName = String(order[0].cropName)
  formData.value.batchCode = String(order[0].batchCode)
  formData.value.belongPark = String(order[0].belongPark)
  formData.value.parkName = String(order[0].parkName)
  formData.value.belongPlot = String(order[0].belongPlot)
  formData.value.parkDetailName = String(order[0].plotName)
}

/** 打开弹窗 */
const open = async (type: string, id?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (typeof id === 'object') {
    formData.value.varietyId = id.id
    formData.value.varietyName = id.cropName
    formData.value.variety = id.cropType
    formData.value.batchCode = id.batchCode
    formData.value.belongPark = id.belongPark
    formData.value.parkName = id.parkName
    formData.value.belongPlot = id.belongPlot
    formData.value.parkDetailName = id.plotName
    boo.value = true
  }
  // 修改时，设置数据
  if (typeof id === 'string' || typeof id === 'number') {
    formLoading.value = true
    try {
      formData.value = await HarvestManagementApi.getHarvestManagement(id)
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
    const data = formData.value as unknown as HarvestManagementVO
    if (formType.value === 'create') {
      await HarvestManagementApi.createHarvestManagement(data)
      // const dataCropBase = {
      //   id: data.varietyId,
      //   recoveryNo: true
      // }
      // await CropBaseApi.updateCropBase(dataCropBase)
      message.success(t('common.createSuccess'))
    } else {
      await HarvestManagementApi.updateHarvestManagement(data)
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
    recordNum: undefined,
    upTime: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    harvestVolume: undefined,
    laborQuantity: undefined,
    remark: undefined,
    parkName: undefined,
    parkDetailName: undefined,
    varietyCode: undefined
  }
  formRef.value?.resetFields()
}
</script>
