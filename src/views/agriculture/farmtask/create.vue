<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :model="formData"
    :rules="formRules"
    label-width="80px"
  >
    <el-form-item label="所属基地" prop="belongPark">
      <el-input v-model="formData.belongPark" placeholder="请输入所属基地" />
    </el-form-item>
    <el-form-item label="基地名称" prop="parkName">
      <el-input v-model="formData.parkName" placeholder="请输入基地名称" />
    </el-form-item>
    <el-form-item label="所属地块" prop="belongPlot">
      <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />
    </el-form-item>
    <el-form-item label="地块名称" prop="plotName">
      <el-input v-model="formData.plotName" placeholder="请输入地块名称" />
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker
        v-model="formData.startTime"
        type="date"
        value-format="x"
        placeholder="选择开始时间"
      />
    </el-form-item>
    <el-form-item label="完成时间" prop="endTime">
      <el-date-picker
        v-model="formData.endTime"
        type="date"
        value-format="x"
        placeholder="选择完成时间"
      />
    </el-form-item>
    <el-form-item label="完成要求" prop="completeRequirement">
      <el-input v-model="formData.completeRequirement" placeholder="请输入完成要求" />
    </el-form-item>
    <el-form-item label="验收标准" prop="acceptanceStandard">
      <el-input v-model="formData.acceptanceStandard" placeholder="请输入验收标准" />
    </el-form-item>
    <el-col v-if="startUserSelectTasks.length > 0">
      <el-card class="mb-10px">
        <template #header>指定审批人</template>
        <el-form
          :model="startUserSelectAssignees"
          :rules="startUserSelectAssigneesFormRules"
          ref="startUserSelectAssigneesFormRef"
        >
          <el-form-item
            v-for="userTask in startUserSelectTasks"
            :key="userTask.id"
            :label="`任务【${userTask.name}】`"
            :prop="userTask.id"
          >
            <el-select
              v-model="startUserSelectAssignees[userTask.id]"
              multiple
              placeholder="请选择审批人"
            >
              <el-option
                v-for="user in userList"
                :key="user.id"
                :label="user.nickname"
                :value="user.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-form-item>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { FarmTaskApi, FarmTaskVO } from '@/api/agriculture/farmtask'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as DefinitionApi from '@/api/bpm/definition'
import * as UserApi from '@/api/system/user'

defineOptions({ name: 'FarmTaskForm' })

const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  processInstanceId: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
  completeRequirement: undefined,
  acceptanceStandard: undefined,
})
const formRules = reactive({
  parkName: [{ required: true, message: '基地名称不能为空', trigger: 'blur' }],
  plotName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '完成时间不能为空', trigger: 'blur' }],
  completeRequirement: [{ required: true, message: '完成要求不能为空', trigger: 'blur' }],
  acceptanceStandard: [{ required: true, message: '验收标准不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

// 指定审批人
const processDefineKey = 'farm_task' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref<any[]>([]) // 用户列表

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 校验指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    await startUserSelectAssigneesFormRef.value.validate()
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = { ...formData.value } as unknown as FarmTaskVO
    // 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      data.startUserSelectAssignees = startUserSelectAssignees.value
    }
      await FarmTaskApi.createFarmTask(data)
    message.success('发起成功')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    await push({ name: 'BpmOALeave' })
  } finally {
    formLoading.value = false
  }
}

/** 初始化 */
onMounted(async () => {
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined,
    processDefineKey
  )
  if (!processDefinitionDetail) {
    message.error('OA 请假的流程模型未配置，请检查！')
    return
  }
  startUserSelectTasks.value = processDefinitionDetail.startUserSelectTasks
  // 设置指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    // 设置校验规则
    for (const userTask of startUserSelectTasks.value) {
      startUserSelectAssignees.value[userTask.id] = []
      startUserSelectAssigneesFormRules.value[userTask.id] = [
        { required: true, message: '请选择审批人', trigger: 'blur' }
      ]
    }
    // 加载用户列表
    userList.value = await UserApi.getSimpleUserList()
  }
})
</script>
