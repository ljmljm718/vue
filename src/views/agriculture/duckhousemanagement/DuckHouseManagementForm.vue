<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编号" prop="duckFarmCode">
        <el-input v-model="formData.duckFarmCode" placeholder="请输入编号,不填写时会自动生成" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <!-- <el-input v-model="formData.category" placeholder="请输入分类" /> -->
        <el-select
          v-model="formData.category"
          placeholder="请输入分类"
          clearable
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_DUCKHOUSE_CLASSIFICATION)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input v-model="formData.location" placeholder="请输入位置" />
      </el-form-item>
      <el-form-item label="养鸭数量" prop="duckCount">
        <el-input v-model="formData.duckCount" placeholder="请输入养鸭数量" />
      </el-form-item>
      <el-form-item label="图片" prop="duckFarmImage">
        <UploadImg v-model="formData.duckFarmImage" />
      </el-form-item>
      <el-form-item label="建设时间" prop="constructionTime">
        <el-date-picker
          v-model="formData.constructionTime"
          type="datetime"
          value-format="x"
          placeholder="选择建设时间"
        />
      </el-form-item>
      <el-form-item label="面积㎡" prop="area">
        <el-input v-model="formData.area" placeholder="请输入面积" />
      </el-form-item>
      <el-form-item label="所属村民" prop="belongingVillager">
        <el-input v-model="formData.belongingVillager" placeholder="请输入所属村民" />
      </el-form-item>
      <el-form-item label="负责人" prop="responsiblePerson">
        <el-input v-model="formData.responsiblePerson" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="介绍" prop="introduction">
        <el-input v-model="formData.introduction" type="textarea" placeholder="请输入介绍" />
      </el-form-item>
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input v-model="formData.reserveOne" placeholder="请输入备用一" />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input v-model="formData.reserveTwo" placeholder="请输入备用二" />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input v-model="formData.reserveThree" placeholder="请输入备用三" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DuckHouseManagementApi, DuckHouseManagementVO } from '@/api/agriculture/duckhousemanagement'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

/** 鸭舍管理 表单 */
defineOptions({ name: 'DuckHouseManagementForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  duckFarmCode: undefined,
  category: undefined,
  location: undefined,
  duckCount: undefined,
  duckFarmImage: undefined,
  constructionTime: undefined,
  area: undefined,
  belongingVillager: undefined,
  responsiblePerson: undefined,
  introduction: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
})
const formRules = reactive({
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
      formData.value = await DuckHouseManagementApi.getDuckHouseManagement(id)
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
    const data = formData.value as unknown as DuckHouseManagementVO
    if (formType.value === 'create') {
      await DuckHouseManagementApi.createDuckHouseManagement(data)
      message.success(t('common.createSuccess'))
    } else {
      await DuckHouseManagementApi.updateDuckHouseManagement(data)
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
    name: undefined,
    duckFarmCode: undefined,
    category: undefined,
    location: undefined,
    duckCount: undefined,
    duckFarmImage: undefined,
    constructionTime: undefined,
    area: undefined,
    belongingVillager: undefined,
    responsiblePerson: undefined,
    introduction: undefined,
    reserveOne: undefined,
    reserveTwo: undefined,
    reserveThree: undefined,
  }
  formRef.value?.resetFields()
}
</script>