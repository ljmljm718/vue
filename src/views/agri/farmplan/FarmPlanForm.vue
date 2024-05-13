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
          <el-form-item label="计划编码" prop="planCode">
            <el-input v-model="formData.planCode" placeholder="请输入计划编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划名称" prop="planName">
            <el-input v-model="formData.planName" placeholder="请输入计划名称" />
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
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划状态" prop="planState">
            <el-input v-model="formData.planState" placeholder="请输入计划状态" />
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
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              type="date"
              style="width: 100%;"
              value-format="x"
              placeholder="选择开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              type="date"
              style="width: 100%;"
              value-format="x"
              placeholder="选择结束时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="3">
        <el-col :span="12">
          <el-form-item label="面积（亩）" prop="planArea">
            <el-input v-model="formData.planArea" placeholder="请输入计划面积（亩）" />
          </el-form-item>
        </el-col>
      </el-row>

<!--      <el-form-item label="土地面积（亩）" prop="area">-->
<!--        <el-input v-model="formData.area" placeholder="请输入土地面积（亩）" />-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FarmPlanApi, FarmPlanVO } from '@/api/agri/farmplan'

/** 农事计划 表单 */
defineOptions({ name: 'FarmPlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planCode: undefined,
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
  planArea: undefined,
  area: undefined,
})
const formRules = reactive({
  planCode: [{ required: true, message: '计划编码不能为空', trigger: 'blur' }],
  planName: [{ required: true, message: '计划名称不能为空', trigger: 'blur' }],
  parkName: [{ required: true, message: '基地名称不能为空', trigger: 'blur' }],
  plotName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '计划开始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '计划结束时间不能为空', trigger: 'blur' }],
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
      formData.value = await FarmPlanApi.getFarmPlan(id)
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
    const data = formData.value as unknown as FarmPlanVO
    if (formType.value === 'create') {
      await FarmPlanApi.createFarmPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await FarmPlanApi.updateFarmPlan(data)
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
    planCode: undefined,
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
    planArea: undefined,
    area: undefined,
  }
  formRef.value?.resetFields()
}
</script>
