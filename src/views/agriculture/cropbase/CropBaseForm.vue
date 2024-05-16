<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编号" prop="cropCode">
        <el-input v-model="formData.cropCode" disabled placeholder="系统自动生成...."/>
      </el-form-item>
      <el-form-item label="名称" prop="cropName">
        <el-input v-model="formData.cropName" placeholder="请输入名称"/>
      </el-form-item>
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
        <!--                <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />-->
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="formData.plotName" placeholder="选择地块后自动写入" readonly/>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.receiptStartTime"
          type="date"
          style="width: 100%"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="startTime">
        <el-date-picker
          v-model="formData.receiptEndTime"
          type="date"
          style="width: 100%"
          value-format="x"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item label="图片" prop="imgId">
        <UploadImg v-model="formData.imgId"/>
      </el-form-item>
      <el-form-item label="描述" prop="cropDesc">
        <el-input v-model="formData.cropDesc" placeholder="请输入描述"/>
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
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {CropBaseApi, CropBaseVO} from '@/api/agriculture/cropbase'
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";

/** 鲁渝协作品种管理 表单 */
defineOptions({name: 'AgriCropBaseForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
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
  receiptStartTime: undefined,
  receiptEndTime: undefined,
})
const formRules = reactive({
  cropName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
  cropType: [{required: true, message: '品种不能为空', trigger: 'change'}],
  imgId: [{required: true, message: '图片不能为空', trigger: 'blur'}],
  belongPlot: [{required: true, message: '所属基地不能为空', trigger: 'blur'}],
  belongPark: [{required: true, message: '所属地块不能为空', trigger: 'blur'}],
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
    if (formType.value === 'create') {
      await CropBaseApi.createCropBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await CropBaseApi.updateCropBase(data)
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
  }
  formRef.value?.resetFields()
}
</script>
