<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="888px">
    <div class="flex space-x-3 px-4 my-3">
      <div class="flex grow justify-between items-center shadow-md rounded-md p-2 px-4 bg-blue-100">
        <div>种/养植数量：</div>
        <div>{{
            formData.sum != undefined ? formData.sum : ''
          }}{{
            formData.unit !=
            undefined ? formData.unit : ''
          }}
        </div>
      </div>
      <div
        class="flex grow justify-between items-center shadow-md rounded-md p-2 px-4 bg-green-100">
        <div>已采收数量：</div>
        <div>
          {{
            formData.harvested != undefined ? formData.harvested : ''
          }}{{
            formData.unit !=
            undefined ? formData.unit : ''
          }}
        </div>
      </div>
      <div
        class="flex grow justify-between items-center shadow-md rounded-md p-2 px-4 bg-yellow-100">
        <div>未采收数量：</div>
        <div>
          {{
            formData.notHarvested != undefined ? formData.notHarvested : ''
          }}{{
            formData.unit !=
            undefined ? formData.unit : ''
          }}
        </div>
      </div>
    </div>
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
          <el-form-item label="采收数量" prop="harvestNum">
            <el-input v-model="formData.harvestNum" placeholder="请输入采收数量">
              <template #append>{{
                  formData.unit !=
                  undefined ? formData.unit : '亩/只/条'
                }}
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采收量" prop="harvestVolume">
            <el-input v-model="formData.harvestVolume" placeholder="请输入采收量">
              <template #append>Kg</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="人工数量" prop="laborQuantity">
            <el-input v-model="formData.laborQuantity" placeholder="请输入人工数量">
              <template #append>人</template>
            </el-input>
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
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="采收图片" prop="harvestImg">
            <UploadImg v-model="formData.harvestImg" />
          </el-form-item>
        </el-col>
      </el-row>
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
  varietyCode: undefined,
  harvestNum: undefined,
  sum: undefined,
  unit: undefined,
  harvested: undefined,
  notHarvested: undefined,
  harvestImg: undefined,
})
const formRules = reactive({
  harvestVolume: [{required: true, message: '采收量不能为空', trigger: 'blur'}],
  laborQuantity: [{required: true, message: '人工数量不能为空', trigger: 'blur'}],
  harvestNum: [{required: true, message: '采收数量不能为空', trigger: 'blur'}],
  harvestImg: [{required: true, message: '采收图片不能为空', trigger: 'blur'}],
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
const handleParkInfoPopupChange = async (order: CropBaseVO) => {
  console.log("order", order);

  const {
    id, cropType, breedId, cropName, batchCode, belongPark,
    parkName, belongPlot, plotName, number, unit, cropCode
  } = order[0];

  Object.assign(formData.value, {
    variety: String(cropType),
    formData: String(id),
    varietyId: String(breedId),
    varietyName: String(cropName),
    batchCode: String(batchCode),
    belongPark: String(belongPark),
    parkName: String(parkName),
    belongPlot: String(belongPlot),
    parkDetailName: String(plotName),
    sum: String(number),
    unit: String(unit),
  });

  try {
    const res = await HarvestManagementApi.getHarvestManagementNum({
      varietyId: String(cropCode),
      belongPlot: String(belongPlot),
      batchCode: String(batchCode),
      number: String(number)
    });

    formData.value = {...formData.value, ...res};
  } catch (error) {
    console.error("Error fetching harvest management data:", error);
  }

  console.log("formData.value", formData.value.unit);
};

console.log("HERE")

/** 打开弹窗 */
const open = async (type: string, id?: any) => {
  console.log("OPEN")
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  console.log("OPEN")
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
  console.log("OPEN")
  // 修改时，设置数据
  if (typeof id === 'string' || typeof id === 'number') {
    console.log("OPEN")
    formLoading.value = true
    try {
      formData.value = await HarvestManagementApi.getHarvestManagement(id)
    } finally {
      formLoading.value = false;
      console.log("batchCode", formData.value.batchCode)
      if (formData.value.batchCode) parkInfoPopupRef.value.getItemByBatchCode(formData.value.batchCode)
    }
  }
  console.log("FORMDATA", formData.value)
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
    harvestNum: undefined,
    sum: undefined,
    unit: undefined,
    harvested: undefined,
    notHarvested: undefined
  }
  formRef.value?.resetFields()
}
</script>
