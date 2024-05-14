<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="农事计划id" prop="planId">
            <el-input v-model="formData.planId" placeholder="请输入农事计划id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="农事计划名称" prop="planName">
            <el-input v-model="formData.planName" placeholder="请输入农事计划名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="所属基地" prop="belongPark">
            <el-input v-model="formData.belongPark" placeholder="请输入所属基地" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基地名称" prop="parkName">
            <el-input v-model="formData.parkName" placeholder="请输入基地名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="所属地块" prop="belongPlot">
            <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地块名称" prop="plotName">
            <el-input v-model="formData.plotName" placeholder="请输入地块名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="作物id" prop="cropId">
            <el-input v-model="formData.cropId" placeholder="请输入作物id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作物名称" prop="cropName">
            <el-input v-model="formData.cropName" placeholder="请输入作物名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="品种" prop="cropType">
            <el-select v-model="formData.cropType" placeholder="请选择品种">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划状态" prop="planState">
            <el-select v-model="formData.planState" placeholder="请选择计划状态">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="责任人编号" prop="personId">
            <el-input v-model="formData.personId" placeholder="请输入责任人编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人" prop="personName">
            <el-input v-model="formData.personName" placeholder="请输入责任人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="计划开始时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              type="date"
              style="width: 100%"
              value-format="x"
              placeholder="选择计划开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划结束时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              type="date"
              style="width: 100%"
              value-format="x"
              placeholder="选择计划结束时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="记录时间" prop="recordTime">
            <el-date-picker
              v-model="formData.recordTime"
              type="date"
              style="width: 100%"
              value-format="x"
              placeholder="选择记录时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划面积（亩）" prop="planArea"  label-width="120">
            <el-input v-model="formData.planArea" placeholder="请输入计划面积（亩）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="土地面积（亩）" prop="recordArea" label-width="120">
            <el-input v-model="formData.recordArea" placeholder="请输入土地面积（亩）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录状态" prop="recordState">
            <el-select v-model="formData.recordState" placeholder="请选择记录状态">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_OPERATE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { FarmRecordApi, FarmRecordVO } from '@/api/agri/farmrecord'

/** 农事记录 表单 */
defineOptions({ name: 'FarmRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planId: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  planState: undefined,
  personId: undefined,
  personName: undefined,
  startTime: undefined,
  endTime: undefined,
  recordTime: undefined,
  planArea: undefined,
  recordArea: undefined,
  recordState: undefined,
})
const formRules = reactive({
  recordTime: [{ required: true, message: '记录时间不能为空', trigger: 'blur' }],
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
      formData.value = await FarmRecordApi.getFarmRecord(id)
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
    const data = formData.value as unknown as FarmRecordVO
    if (formType.value === 'create') {
      await FarmRecordApi.createFarmRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await FarmRecordApi.updateFarmRecord(data)
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
    planId: undefined,
    planName: undefined,
    belongPark: undefined,
    parkName: undefined,
    belongPlot: undefined,
    plotName: undefined,
    cropId: undefined,
    cropName: undefined,
    cropType: undefined,
    planState: undefined,
    personId: undefined,
    personName: undefined,
    startTime: undefined,
    endTime: undefined,
    recordTime: undefined,
    planArea: undefined,
    recordArea: undefined,
    recordState: undefined,
  }
  formRef.value?.resetFields()
}
</script>
