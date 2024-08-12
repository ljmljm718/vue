<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!--      <el-form-item label="记录编号" prop="recordNum">-->
      <!--        <el-input v-model="formData.recordNum" placeholder="请输入记录编号" />-->
      <!--      </el-form-item>-->

      <el-form-item label="品种名称" prop="varietyId">
        <el-input v-model="formData.varietyId" placeholder="自动写入" readonly
                  :disabled="boo"/>
        <!--        <el-select-->
        <!--          v-model="formData.varietyId"-->
        <!--          placeholder="请选择品种"-->
        <!--          clearable-->
        <!--          :disabled="boo"-->
        <!--          @change="handleVarietyChange"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="dict in listVarietyManagement"-->
        <!--            :key="dict.id"-->
        <!--            :label="dict.varietyName"-->
        <!--            :value="dict.id"-->
        <!--          />-->
        <!--        </el-select>-->
        <!--        <el-input v-model="formData.varietyName" placeholder="请输入品种名称" :disabled="boo"/>-->
      </el-form-item>
      <el-form-item label="品类" prop="variety">
        <!-- <el-input v-model="formData.variety" placeholder="请输入品种"/> -->
        <el-input v-model="formData.variety" placeholder="自动写入" readonly
                  :disabled="boo"/>
        <!--        <el-select-->
        <!--          v-model="formData.variety"-->
        <!--          placeholder="选择品种后自动填入"-->
        <!--          clearable-->
        <!--          :disabled = "true"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="dict in listVarietyManagement"-->
        <!--            :key="dict.categoryId"-->
        <!--            :label="dict.categoryName"-->
        <!--            :value="dict.categoryId"-->
        <!--          />-->
        <!--        </el-select>-->
      </el-form-item>
      <!--      <el-form-item label="品种ID" prop="varietyId">-->
      <!--        <el-input v-model="formData.varietyId" placeholder="请输入品种ID" :disabled="boo"/>-->
      <!--      </el-form-item>-->
      <!-- 获取批次号 -->
      <el-form-item label="批次码" prop="batchCode">
        <el-input v-model="formData.batchCode" placeholder="请输入批次码" :disabled="boo"/>
      </el-form-item>


      <el-form-item label="所属基地" prop="belongPark">
        <el-input v-model="formData.belongPark" placeholder="自动写入" readonly
                  :disabled="boo"/>
        <!--        <el-input v-model="formData.belongPark" placeholder="请输入所属基地" :disabled="boo">-->
        <!--          <template #append>-->
        <!--            <el-button @click="openParkInfoPopup('0')" :disabled="boo">-->
        <!--              <Icon icon="ep:search"/>-->
        <!--              选择-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-input>-->
      </el-form-item>
      <el-form-item label="基地名称" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="自动写入" readonly
                  :disabled="boo"/>
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="自动写入" readonly
                  :disabled="boo"/>
        <!--        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" :disabled="boo">-->
        <!--          <template #append>-->
        <!--            <el-button @click="openParkDetailPopup(formData.belongPark)" :disabled="boo">-->
        <!--              <Icon icon="ep:search"/>-->
        <!--              选择-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-input>-->
      </el-form-item>
      <el-form-item label="地块名称" prop="parkDetailName">
        <el-input v-model="formData.parkDetailName" placeholder="自动写入" readonly
                  :disabled="boo"/>
      </el-form-item>
      <el-form-item label="上传时间" prop="upTime">
        <el-date-picker
          v-model="formData.upTime"
          type="datetime"
          value-format="x"
          placeholder="选择上传时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="采收量(/Kg)" prop="harvestVolume">
        <el-input v-model="formData.harvestVolume" placeholder="请输入采收量(/Kg)"/>
      </el-form-item>
      <el-form-item label="人工数量(人)" prop="laborQuantity">
        <el-input v-model="formData.laborQuantity" placeholder="请输入人工数量(人)"/>
      </el-form-item>
      <el-form-item label="库存(/Kg)" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入库存(/Kg)"/>
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
import {HarvestManagementApi, HarvestManagementVO} from '@/api/agriculture/harvestmanagement'
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import {VarietyManagementVO, allDataCacheManager} from "@/api/agriculture/varietymanagement/index";
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {CropBaseApi} from "@/api/agriculture/cropbase";
import {formatTime} from "@/utils";
import {DrawerProps} from "element-plus";
import {FarmRecordVO} from "@/api/agriculture/farmrecord";

/** 采收管理 表单 */
defineOptions({name: 'HarvestManagementAdd'})

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
  varietyCode: undefined, // 地块ID
})
const formRules = reactive({
  laborQuantity: [{required: true, message: '人工数量不能为空', trigger: 'blur'}],
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
    message.error("请选择地块")
  } else parkDetailPopupRef.value.open(id)
}
const handleParkDetailPopupChange = (order: ParkDetailVO) => {
  formData.value.belongPark = String(order[0].parkId)
  formData.value.belongPlot = String(order[0].id)
  formData.value.parkDetailName = String(order[0].name)

}


/** 打开弹窗 */
const open = async (type: string, id?: any) => {
  dialogVisible.value = true
  console.log("type", type)
  dialogTitle.value = t('action.' + type)
  if (type === 'create') dialogTitle.value = t('新增' + id.cropName + '产量')
  formType.value = type
  resetForm()
  if (typeof id === 'object') {
    formData.value.varietyId = id.id
    formData.value.varietyName = id.cropName
    formData.value.variety = id.cropType
    formData.value.varietyCode = id.cropId
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
    varietyCode: undefined,
  }
  formRef.value?.resetFields()
}
</script>
