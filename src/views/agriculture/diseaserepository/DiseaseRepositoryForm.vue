<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="学名" prop="scientificName">
            <el-input v-model="formData.scientificName" placeholder="请输入学名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="知识库类别" prop="reservedOne">
            <el-select v-model="formData.reservedOne" placeholder="请选择知识库类别">
              <el-option
                v-for="item in optionsType"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图片" prop="imgId">
            <UploadImg v-model="formData.imgId"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作物品类" prop="cropType">
            <el-select v-model="formData.cropType" placeholder="请选择作物品类">
              <el-option
                v-for="item in listCategoryManagement"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="易发月份" prop="proneMonth">
            <el-input v-model="formData.proneMonth" placeholder="请输入易发月份"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危害等级" prop="hazardRating">
            <el-select v-model="formData.hazardRating" placeholder="请选择危害等级">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="诱发病虫" prop="reservedTwo">
<!--                <el-input v-model="formData.reservedTwo" placeholder="请输入诱发病虫"/>-->
        <el-select v-model="formData.reservedTwo" clearable placeholder="请选择诱发病虫">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_DISEASE_NAME)"
            :key="dict.label"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <el-input v-model="formData.intro" type="textarea" placeholder="请输入形态特征"
                  maxlength="500" show-word-limit :rows="4"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="形态特征" prop="description">
            <el-input v-model="formData.description" type="textarea" placeholder="请输入形态特征"
                      maxlength="500" show-word-limit :rows="4"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发病条件" prop="morbidityCondition">
            <el-input v-model="formData.morbidityCondition" type="textarea" :rows="4"
                      placeholder="请输入发病条件" maxlength="500" show-word-limit/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发病规律" prop="morbidityLaw">
            <el-input v-model="formData.morbidityLaw" type="textarea" placeholder="请输入发病规律"
                      maxlength="500" show-word-limit :rows="4"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="症状表现" prop="manifestedIllness">
            <el-input v-model="formData.manifestedIllness" type="textarea" :rows="4"
                      placeholder="请输入症状表现" maxlength="500" show-word-limit/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="治理方法" prop="treatmentMethod">
        <el-input v-model="formData.treatmentMethod" type="textarea" placeholder="请输入治理方法"
                  maxlength="500" show-word-limit :rows="4"/>
      </el-form-item>

      <!--      <el-form-item label="预留3" prop="reservedThree">-->
      <!--        <el-input v-model="formData.reservedThree" placeholder="请输入预留3"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留4" prop="reservedFour">-->
      <!--        <el-input v-model="formData.reservedFour" placeholder="请输入预留4"/>-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {DiseaseRepositoryApi, DiseaseRepositoryVO} from '@/api/agriculture/diseaserepository'
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 病虫害知识库 表单 */
defineOptions({name: 'DiseaseRepositoryForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
//危害等级
const options = ref([{
  value: '低',
  label: '低'
}, {
  value: '中',
  label: '中'
}, {
  value: '高',
  label: '高'
}])
//知识库类别
const optionsType = ref([{
  value: '病害',
  label: '病害'
}, {
  value: '虫害',
  label: '虫害'
}])
const formData = ref({
  id: undefined,
  scientificName: undefined,
  imgId: undefined,
  breedId: undefined,
  cropName: undefined,
  cropType: undefined,
  remark: undefined,
  proneMonth: undefined,
  hazardRating: undefined,
  intro: undefined,
  description: undefined,
  morbidityCondition: undefined,
  morbidityLaw: undefined,
  manifestedIllness: undefined,
  treatmentMethod: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined
})
const formRules = reactive({
  reservedOne: [{required: true, message: '知识库类别不能为空', trigger: 'blur'}],
  scientificName: [{required: true, message: '学名不能为空', trigger: 'blur'}],
  cropType: [{required: true, message: '作物种类不能为空', trigger: 'blur'}],
  imgId: [{required: true, message: '图片不能为空', trigger: 'blur'}],
  hazardRating: [{required: true, message: '危害等级不能为空', trigger: 'blur'}],
  reservedTwo: [{required: true, message: '诱发病虫不能为空', trigger: 'blur'}],
  intro: [{required: true, message: '简介不能为空', trigger: 'blur'}]
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
      formData.value = await DiseaseRepositoryApi.getDiseaseRepository(id)
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
    const data = formData.value as unknown as DiseaseRepositoryVO
    if (formType.value === 'create') {
      await DiseaseRepositoryApi.createDiseaseRepository(data)
      message.success(t('common.createSuccess'))
    } else {
      await DiseaseRepositoryApi.updateDiseaseRepository(data)
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
    scientificName: undefined,
    imgId: undefined,
    breedId: undefined,
    cropName: undefined,
    cropType: undefined,
    remark: undefined,
    proneMonth: undefined,
    hazardRating: undefined,
    intro: undefined,
    description: undefined,
    morbidityCondition: undefined,
    morbidityLaw: undefined,
    manifestedIllness: undefined,
    treatmentMethod: undefined,
    reservedOne: undefined,
    reservedTwo: undefined,
    reservedThree: undefined,
    reservedFour: undefined
  }
  formRef.value?.resetFields()
}
</script>
