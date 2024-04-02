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
      <el-form-item label="上传时间" prop="upTime">
        <el-date-picker
          v-model="formData.upTime"
          type="datetime"
          value-format="x"
          placeholder="选择上传时间"
        />
      </el-form-item>
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
      <el-form-item label="基地名称" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="选择基地后自动写入" readonly/>
      </el-form-item>
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
      <el-form-item label="地块名称" prop="parkDetailName">
        <el-input v-model="formData.parkDetailName" placeholder="选择地块后自动写入" readonly/>
      </el-form-item>
      <el-form-item label="采收量" prop="harvestVolume">
        <el-input v-model="formData.harvestVolume" placeholder="请输入采收量"/>
      </el-form-item>
      <el-form-item label="人工数量" prop="laborQuantity">
        <el-input v-model="formData.laborQuantity" placeholder="请输入人工数量"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注"/>
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

/** 采收管理 表单 */
defineOptions({name: 'HarvestManagementForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

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

  console.log("--->>查看选择的地块信息：", order[0])
  formData.value.belongPark = String(order[0].parkId)
  formData.value.belongPlot = String(order[0].id)
  formData.value.parkDetailName = String(order[0].name)

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
  }
  formRef.value?.resetFields()
}
</script>
