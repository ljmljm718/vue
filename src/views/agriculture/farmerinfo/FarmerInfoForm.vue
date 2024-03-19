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
          <el-form-item label="农户身份码" prop="farmerId">
            <el-input v-model="formData.farmerId" placeholder="请输入农户身份码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="农户姓名" prop="farmerName">
            <el-input v-model="formData.farmerName" placeholder="请输入农户姓名" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="formData.sex">
              <el-radio
                v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_FARMER_SEX)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="formData.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="formData.mobile" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承包土地" prop="coveredLandArea">
            <el-input type="number" v-model="formData.coveredLandArea" placeholder="请输入承包土地面积" >
              <template #append>亩</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="种植种类" prop="plantingSpecies">
            <el-input v-model="formData.plantingSpecies" placeholder="请输入擅长种植种类" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="种植经验" prop="plantingExperience">
            <el-input type="number" v-model="formData.plantingExperience" placeholder="请输入种植经验" >
              <template #append>年</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

<!--      <el-form-item label="部门id" prop="deptId">-->
<!--        <el-input v-model="formData.deptId" placeholder="请输入部门id" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户id" prop="userId">-->
<!--        <el-input v-model="formData.userId" placeholder="请输入用户id" />-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { FarmerInfoApi, FarmerInfoVO } from '@/api/agriculture/farmerinfo'

/** 农户管理 表单 */
defineOptions({ name: 'FarmerInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  farmerId: undefined,
  farmerName: undefined,
  sex: undefined,
  age: undefined,
  mobile: undefined,
  coveredLandArea: undefined,
  plantingSpecies: undefined,
  plantingExperience: undefined,
  deptId: undefined,
  userId: undefined,
})
const formRules = reactive({
  farmerId: [{ required: true, message: '农户身份码不能为空', trigger: 'blur' }],
  farmerName: [{ required: true, message: '农户姓名不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
  mobile: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
  plantingSpecies: [{ required: true, message: '擅长种植种类不能为空', trigger: 'blur' }],
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
      formData.value = await FarmerInfoApi.getFarmerInfo(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FarmerInfoVO
    if (formType.value === 'create') {
      await FarmerInfoApi.createFarmerInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await FarmerInfoApi.updateFarmerInfo(data)
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
    farmerId: undefined,
    farmerName: undefined,
    sex: undefined,
    age: undefined,
    mobile: undefined,
    coveredLandArea: undefined,
    plantingSpecies: undefined,
    plantingExperience: undefined,
    deptId: undefined,
    userId: undefined,
  }
  formRef.value?.resetFields()
}
</script>
