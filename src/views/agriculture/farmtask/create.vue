<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex">
<!--          <el-button-->
<!--            type="primary"-->
<!--            :icon="FolderChecked"-->
<!--            plain-->
<!--            @click="localSave()"-->
<!--          >-->
<!--            保存-->
<!--          </el-button>-->
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm"
          >提交</el-button>
<!--          <el-button-->
<!--            type="danger"-->
<!--            :icon="Refresh"-->
<!--            plain-->
<!--            @click="resetForm()"-->
<!--          >清空-->
<!--          </el-button>-->
        </div>
      </template>
      <template #content>
        <el-scrollbar class="croll-bar-template">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            v-loading="formLoading"
            class="grid gap-3 p-4"
          >
            <!-- TODO: 表单项写在这里 -->
            <!-- TODO: 如果使用手风琴，参考下面的代码 下面的注意不用的话要删掉 -->
            <el-collapse v-model="activeName" simple>
              <el-collapse-item class="grid sm:grid-cols-1 gap-2 p-4"
                                title="任务信息" name="1" >
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="农事计划" prop="planCode">
                      <el-input v-model="formData.planCode" disabled placeholder="请选择农事计划" >
                        <template #append>
                          <el-button style="color: black"  @click="openPlannfoPopup()">
                            <Icon icon="ep:search"/>
                            选择
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="农事计划名称" prop="planName" label-width="120">
                      <el-input v-model="formData.planName" disabled placeholder="请选择农事计划" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="所属基地" prop="belongPark">
                      <el-input v-model="formData.belongPark" disabled placeholder="请输入所属基地" >
                        <template #append>
                          <el-button style="color: black"  @click="openParkInfoPopup('0')">
                            <Icon icon="ep:search"/>
                            选择
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="基地名称" prop="parkName">
                      <el-input v-model="formData.parkName" disabled placeholder="请输入基地名称" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="所属地块" prop="belongPlot">
                      <el-input v-model="formData.belongPlot" disabled placeholder="请输入所属地块" >
                        <template #append>
                          <el-button style="color: black"  @click="openParkDetailPopup(formData.belongPark)">
                            <Icon icon="ep:search"/>
                            选择
                          </el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="地块名称" prop="plotName">
                      <el-input v-model="formData.plotName" disabled placeholder="请输入地块名称" />
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
                    <el-form-item label="作业方式" prop="jobType">
                      <el-select v-model="formData.jobType" placeholder="请选择作业方式" style="width: 100%;">
<!--                        <el-option label="机械作业" value="1" />-->
<!--                        <el-option label="人工作业" value="2" />-->
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.JOB_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="消耗农资" prop="agriCapitalConsume">
                        <el-select v-model="formData.agriCapitalConsume" placeholder="请选择消耗农资" style="width: 100%;">
                          <el-option
                            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CAPITAL_CONSUME)"
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
                    <el-form-item label="农资数量" prop="agriCapitalAmount">
                      <el-input-number controls-position="right" type="number"  placeholder="请输入内容" v-model="formData.agriCapitalAmount" style="width: 100%"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="农资单位" prop="agriCapitalUnit">
                      <el-select v-model="formData.agriCapitalUnit" placeholder="请选择单位" style="width: 100%;">
                        <el-option
                          v-for="dict in getStrDictOptions(DICT_TYPE.CRM_PRODUCT_UNIT)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="24">
                    <el-form-item label="完成要求" prop="completeRequirement">
                      <el-input type="textarea" v-model="formData.completeRequirement" placeholder="请输入完成要求" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="验收标准" prop="acceptanceStandard">
                      <el-input type="textarea" v-model="formData.acceptanceStandard" placeholder="请输入验收标准" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
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
                            :multiple-limit="1"
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
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-scrollbar>
      </template>
    </EditFrame>
  </div>


  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>
  <PlanInfoPopup ref="planInfoPopupRef" @success="handlePlanInfoPopupChange" />
  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>
</template>
<script lang="ts" setup>
import {DICT_TYPE, getIntDictOptions, getStrDictOptions} from '@/utils/dict'
import { FarmTaskApi, FarmTaskVO } from '@/api/agriculture/farmtask'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as DefinitionApi from '@/api/bpm/definition'
import * as UserApi from '@/api/system/user'
import {FolderChecked, Refresh, TopRight} from "@element-plus/icons-vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import {ElMessage} from "element-plus";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import PlanInfoPopup from "@/views/agriculture/farmtask/PlanInfoPopup.vue";
import {
  EditFrame,
  addFormStorage,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index'
import {FarmPlanVO} from "@/api/agriculture/farmplan";
import {AdoptionPlanApi} from "@/api/agriculture/adoptionplan";
import {AdoptionRuleApi} from "@/api/agriculture/adoptionrule";

defineOptions({ name: 'FarmTaskForm' })

const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}

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
  planCode:undefined,
  planName:undefined,
  agriCapitalUnit:undefined,
  agriCapitalAmount:undefined,
  agriCapitalConsume:undefined,
  jobType:undefined,
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


//计划的选择
const planInfoPopupRef = ref()
const openPlannfoPopup = () => {
    planInfoPopupRef.value.open()
}
const handlePlanInfoPopupChange = (order: FarmPlanVO) => {
    formData.value.planCode = String(order[0].id)
    formData.value.planName = String(order[0].planName)
    formData.value.belongPark = String(order[0].belongPark)
    formData.value.parkName = String(order[0].parkName)
    formData.value.belongPlot = String(order[0].belongPlot)
    formData.value.plotName = String(order[0].plotName)
}


//基地的选择
const parkInfoPopupRef = ref()
const openType = ref('')
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    ElMessage.error("请先选择基地")
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
    ElMessage.error("请先选择基地！")
  } else parkDetailPopupRef.value.open(id)
}
const handleParkDetailPopupChange = (order: ParkDetailVO) => {

  console.log("--->>查看选择的地块信息：", order[0])
  formData.value.belongPark = String(order[0].parkId)
  formData.value.belongPlot = String(order[0].id)
  formData.value.plotName = String(order[0].name)

}
const route = useRoute()
const router = useRouter()
const activeName = ref<any>(['1'])
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '农事计划'
const ORIGIN_PATH = '/farm_work/farmManage/farm-task' // 关闭表单时跳转的路径
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
    // 表单已提交，从本地删除此表单
    deleteFormStorage(
      ROUTE_PATH,
      formData.value.id ? formData.value.id : 'new_form'
    )
    // 关闭当前 Tab
    delView(unref(currentRoute))
    router.push(ORIGIN_PATH)
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
    message.error('流程模型未配置，请检查！')
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
