<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="101px"
      v-loading="formLoading"
    >
      <!--      <el-form-item label="品种code" prop="cropCode">-->
      <!--        <el-input v-model="formData.cropCode" placeholder="请输入品种code"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="品种作物code" prop="cropId">
        <el-input v-model="formData.cropCode" readonly placeholder="请选择">
          <template #append>
            <el-button @click="openCropInfoPopup()">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="品种名称" prop="cropName">
        <el-input v-model="formData.cropName" placeholder="请输入品种名称" disabled/>
      </el-form-item>
      <el-form-item label="品种" prop="cropType">
        <el-select v-model="formData.cropType" placeholder="请选择品种" disabled>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="所属基地" prop="base">-->
      <!--        <el-input v-model="formData.base" placeholder="请输入所属基地" />-->
      <!--      </el-form-item>-->
      <el-form-item label="基地名称" prop="baseName">
        <el-input v-model="formData.baseName" placeholder="请输入基地名称" disabled/>
      </el-form-item>
      <!--      <el-form-item label="所属地块" prop="massif">-->
      <!--        <el-input v-model="formData.massif" placeholder="请输入所属地块" />-->
      <!--      </el-form-item>-->
      <el-form-item label="地块名称" prop="massifName">
        <el-input v-model="formData.massifName" placeholder="请输入地块名称" disabled/>
      </el-form-item>
      <el-form-item label="测量时间" prop="measureTime">
        <el-date-picker
          v-model="formData.measureTime"
          type="datetime"
          value-format="x"
          placeholder="选择测量时间"
        />
      </el-form-item>
      <el-form-item label="测量者" prop="measurer">
        <el-input v-model="formData.measurer" placeholder="请输入测量者"/>
      </el-form-item>
      <el-form-item label="测量类型" prop="measureType">
        <el-select v-model="formData.measureType" placeholder="请选择测量类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_GROW_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="测量值" prop="measureNum">
        <el-input v-model="formData.measureNum" placeholder="请输入测量值"/>
      </el-form-item>
      <el-form-item label="变化量" prop="measureSpike">
        <el-input v-model="formData.measureSpike" placeholder="请输入变化量"/>
      </el-form-item>
      <el-form-item label="测量单位" prop="measureUnit">
        <el-input v-model="formData.measureUnit" placeholder="请输入测量单位"/>
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
  <CropInfoPopup ref="cropInfoPopupRef" @success="handleCropInfoPopupChange"/>
</template>
<script setup lang="ts">
import {GrowRecordApi, GrowRecordVO} from '@/api/agriculture/growrecord'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {CropBaseVO} from "@/api/agriculture/cropbase";
import CropInfoPopup from "@/views/agriculture/cropgrowth/components/CropInfoPopup.vue";

/** 长势管理 表单 */
defineOptions({name: 'GrowRecordForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  base: undefined,
  baseName: undefined,
  massif: undefined,
  massifName: undefined,
  measureTime: undefined,
  measurer: undefined,
  measureType: undefined,
  measureNum: undefined,
  measureSpike: undefined,
  measureUnit: undefined,
  remark: undefined,
  id: undefined
})
const formRules = reactive({
  cropCode: [{ required: true, message: '品种code不能为空', trigger: 'blur' }],
  cropName: [{ required: true, message: '品种名称不能为空', trigger: 'blur' }],
  base: [{ required: true, message: '基地ID不能为空', trigger: 'blur' }],
  baseName: [{ required: true, message: '基地名称不能为空', trigger: 'blur' }],
  cropType: [{ required: true, message: '品种类型不能为空', trigger: 'blur' }],
  massif: [{ required: true, message: '地块ID不能为空', trigger: 'blur' }],
  massifName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
  measureTime: [{ required: true, message: '测量时间不能为空', trigger: 'change' }],
  measurer: [{ required: true, message: '测量者不能为空', trigger: 'change' }],
  measureType: [{ required: true, message: '测量类型不能为空', trigger: 'change' }],
  measureNum: [{ required: true, message: '测量值不能为空', trigger: 'change' }],
  measureSpike: [{ required: true, message: '变化量不能为空', trigger: 'change' }],
  measureUnit: [{ required: true, message: '测量单位不能为空', trigger: 'change' }],
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
      formData.value = await GrowRecordApi.getGrowRecord(id)
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
    const data = formData.value as unknown as GrowRecordVO
    if (formType.value === 'create') {
      await GrowRecordApi.createGrowRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await GrowRecordApi.updateGrowRecord(data)
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
    cropCode: undefined,
    cropName: undefined,
    cropType: undefined,
    base: undefined,
    baseName: undefined,
    massif: undefined,
    massifName: undefined,
    measureTime: undefined,
    measurer: undefined,
    measureType: undefined,
    measureNum: undefined,
    measureSpike: undefined,
    measureUnit: undefined,
    remark: undefined,
    id: undefined
  }
  formRef.value?.resetFields()
}

//作物的选择
const cropInfoPopupRef = ref()
const openCropInfoPopup = () => {
  cropInfoPopupRef.value.open()
}

const handleCropInfoPopupChange = (order: CropBaseVO) => {
  formData.value.cropCode = String(order[0].id)
  formData.value.cropName = String(order[0].cropName)
  formData.value.cropType = String(order[0].cropType)
  formData.value.base = String(order[0].belongPark)
  formData.value.massif = String(order[0].belongPlot)
  formData.value.baseName = String(order[0].parkName)
  formData.value.massifName = String(order[0].plotName)
}
</script>
