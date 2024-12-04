<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      v-loading="formLoading"
    >
      <!-- <el-form-item label="任务名称" prop="tfName">
        <el-input v-model="formData.tfName" placeholder="请输入任务名称" />
      </el-form-item> -->
      <!-- <el-form-item label="所属系统" prop="belongWfiSystem">
        <el-input v-model="formData.belongWfiSystem" placeholder="请输入所属系统" />
      </el-form-item> -->
      <el-form-item label="施肥类型" prop="fertilizationType">
        <el-select v-model="formData.fertilizationType" placeholder="请选择施肥类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="搅拌类型" prop="mixingType">
        <el-select v-model="formData.mixingType" placeholder="请选择搅拌类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_STIR_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="水泵控制" prop="waterPumpStatus">
        <el-select
          v-model="formData.waterPumpStatus"
          placeholder="请选择水泵控制状态"
        >
          <el-option
            label="是"
            value="是"
          />
          <el-option
            label="否"
            value="否"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="并发任务执行数量" prop="concurrentTaskNumber">
        <el-input v-model="formData.concurrentTaskNumber" placeholder="请输入并发任务执行数量" />
      </el-form-item>
      <el-form-item label="施肥时长/量（分钟/L）" prop="amountTimeNumber">
        <el-input v-model="formData.amountTimeNumber" placeholder="请输入施肥时长/量（分钟/L）" />
      </el-form-item>
      <el-form-item label="任务执行灌区" prop="iaCodeList">
        <!-- <el-input v-model="formData.iaCodeList" placeholder="请输入任务执行灌区" /> -->
        <el-input v-model="formData.iaCodeList" placeholder="请选择任务执行灌区" :disabled="true">
          <template #append>
            <el-button @click="openIrrigationareaList(formData.iaCodeList)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>

      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!-- 罐区选框 -->
  <SelectIrrigtionareaForm ref="selectIrrigtionareaRef" @success="irrigatedAreaList" />
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { TaskFertilizationApi, TaskFertilizationVO } from '@/api/agriculture/taskfertilization'
import SelectIrrigtionareaForm from '@/views/agriculture/irrigationarea/components/SelectIrrigtionarea.vue';

/** 施肥任务 表单 */
defineOptions({ name: 'TaskFertilizationForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  tfName: undefined,
  belongWfiSystem: undefined,
  fertilizationType: undefined,
  mixingType: undefined,
  waterPumpStatus: undefined,
  concurrentTaskNumber: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined,
  status: undefined
})
const formRules = reactive({
  // status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

const selectIrrigtionareaRef = ref()
const openIrrigationareaList = (ids:string) => {
  selectIrrigtionareaRef.value.open(ids)
}

const irrigatedAreaIds = ref('');
const irrigatedAreaList = async(reslist:any)=>{
  for (let i = 0; i < reslist.length; i++) {
    if( i != reslist.length-1)
      irrigatedAreaIds.value += reslist[i].id+",";
    else irrigatedAreaIds.value += reslist[i].id;
  }
  irrigatedAreaIds.value =irrigatedAreaIds.value.substring(0,irrigatedAreaIds.value.length)
  console.log("irrigatedAreaIds",irrigatedAreaIds.value);
  formData.value.iaCodeList = irrigatedAreaIds.value;
  irrigatedAreaIds.value = ''
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
      formData.value = await TaskFertilizationApi.getTaskFertilization(id)
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
    const data = formData.value as unknown as TaskFertilizationVO
    if (formType.value === 'create') {
      await TaskFertilizationApi.createTaskFertilization(data)
      message.success(t('common.createSuccess'))
    } else {
      await TaskFertilizationApi.updateTaskFertilization(data)
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
    tfName: undefined,
    belongWfiSystem: undefined,
    fertilizationType: undefined,
    mixingType: undefined,
    waterPumpStatus: undefined,
    concurrentTaskNumber: undefined,
    amountTimeNumber: undefined,
    iaCodeList: undefined,
    status: undefined
  }
  formRef.value?.resetFields()
}
</script>