<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!--      <el-form-item label="监测类型" prop="warnType">-->
      <!--        <el-select v-model="formData.warnType" placeholder="请选择监测类型">-->
      <!--          <el-option label="请选择字典生成" value=""/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="农作物" prop="breedId">
        <!--        <el-input v-model="formData.breedId" placeholder="请输入品种ID"/>-->
        <el-select v-model="formData.breedId" placeholder="请选择农作物">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="品种名称" prop="cropName">-->
      <!--        <el-input v-model="formData.cropName" placeholder="请输入品种名称"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="病虫害种类" prop="diseaseType">
        <!--        <el-input v-model="formData.diseaseType" placeholder="请输入病虫害种类"/>-->
        <el-select v-model="formData.diseaseType" clearable placeholder="请选择病虫害种类">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_DISEASE_NAME)"
            :key="dict.label"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
        <!--        <el-select v-model="formData.diseaseType" placeholder="请选择病害虫种类">-->
        <!--          <el-option label="请选择字典生成" value="" />-->
        <!--        </el-select>-->
      </el-form-item>
      <!--      <el-form-item label="病害虫Id" prop="diseaseId">-->
      <!--        <el-input v-model="formData.diseaseId" placeholder="请输入病害虫Id"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="监测周期" prop="monitorPeriod">
        <el-input v-model="formData.monitorPeriod" placeholder="请输入监测周期（天、周、月）"/>
      </el-form-item>
      <el-form-item label="阈值下限" prop="warnLowValue">
        <el-input v-model="formData.warnLowValue" placeholder="请输入阈值下限"/>
      </el-form-item>
      <el-form-item label="阈值上限" prop="warnHighValue">
        <el-input v-model="formData.warnHighValue" placeholder="请输入阈值上限"/>
      </el-form-item>
      <el-form-item label="单位" prop="warnUnit">
        <el-input v-model="formData.warnUnit" placeholder="请输入单位"/>
      </el-form-item>
      <el-form-item label="病虫害等级" prop="reservedOne">
        <el-input v-model="formData.reservedOne" placeholder="请输入病虫害等级"/>
      </el-form-item>
      <el-form-item label="预警信息" prop="lowMsg">
        <el-input v-model="formData.lowMsg" placeholder="请输入预警信息"/>
      </el-form-item>

      <!--      <el-form-item label="预留2" prop="reservedTwo">-->
      <!--        <el-input v-model="formData.reservedTwo" placeholder="请输入预留2"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留3" prop="reservedThree">-->
      <!--        <el-input v-model="formData.reservedThree" placeholder="请输入预留3"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留4" prop="reservedFour">-->
      <!--        <el-input v-model="formData.reservedFour" placeholder="请输入预留4"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留5" prop="reservedFive">-->
      <!--        <el-input v-model="formData.reservedFive" placeholder="请输入预留5"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {
  DiseaseThresholdRuleApi,
  DiseaseThresholdRuleVO
} from '@/api/agriculture/diseasethresholdrule'
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 病虫害预警阈值设置 表单 */
defineOptions({name: 'DiseaseThresholdRuleForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warnType: undefined,
  breedId: undefined,
  cropName: undefined,
  diseaseType: undefined,
  diseaseId: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  monitorPeriod: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined,
  reservedFive: undefined,
  remark: undefined
})
const formRules = reactive({
  breedId: [{ required: true, message: '农作物不能为空', trigger: 'blur' }],
  diseaseType: [{ required: true, message: '病虫害种类不能为空', trigger: 'change' }],
  monitorPeriod: [{ required: true, message: '监测周期不能为空', trigger: 'change' }],
  warnLowValue: [{ required: true, message: '阈值下限不能为空', trigger: 'change' }],
  warnHighValue: [{ required: true, message: '阈值上限不能为空', trigger: 'change' }],
  warnUnit: [{ required: true, message: '阈值单位不能为空', trigger: 'change' }],
  reservedOne: [{ required: true, message: '病虫害等级不能为空', trigger: 'change' }],
  lowMsg: [{ required: true, message: '预警信息不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

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
      formData.value = await DiseaseThresholdRuleApi.getDiseaseThresholdRule(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

const getType = async () => {
  listCategoryManagement.value = await allDataCacheManager.getData({})
}
getType()
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as DiseaseThresholdRuleVO
    if (formType.value === 'create') {
      await DiseaseThresholdRuleApi.createDiseaseThresholdRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await DiseaseThresholdRuleApi.updateDiseaseThresholdRule(data)
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
    warnType: undefined,
    breedId: undefined,
    cropName: undefined,
    diseaseType: undefined,
    diseaseId: undefined,
    warnLowValue: undefined,
    warnHighValue: undefined,
    warnUnit: undefined,
    lowMsg: undefined,
    monitorPeriod: undefined,
    reservedOne: undefined,
    reservedTwo: undefined,
    reservedThree: undefined,
    reservedFour: undefined,
    reservedFive: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
