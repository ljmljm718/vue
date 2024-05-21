<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :model="formData"
    :rules="formRules"
    label-width="150px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="关联订单" prop="orderId">
          <el-input v-model="formData.orderId" placeholder="请点击选择订单计划按钮" disabled>
            <template #append>
              <el-button @click="openProductionPlanList">
                <Icon icon="ep:search"/> 选择订单计划
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="计划编号" prop="orderName">
          <el-input v-model="formData.orderName" placeholder="请点击左侧选择订单计划按钮" disabled/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="关联计划" prop="planId">
          <el-input v-model="formData.planId" placeholder="请点击上方选择订单计划按钮" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="关联批次" prop="batch">
          <el-input v-model="formData.batch" disabled placeholder="请点击选择批次按钮">
            <template #append>
              <el-button @click="openProductionBatchList" :disabled="!formData.orderId">
                <Icon icon="ep:search"/> 选择批次
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="formData.productName" placeholder="请点击选择批次按钮" disabled/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="详细要求" prop="requireDetail">
          <el-input v-model="formData.requireDetail" placeholder="请输入详细要求" type="textarea"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="委外公司" prop="companyName">
          <el-input v-model="formData.companyName" placeholder="请输入委外公司" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="formData.contact" placeholder="请输入联系人"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="联系方式" prop="contactPhone">
          <el-input v-model="formData.contactPhone" placeholder="请输入联系方式"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            style="width: 100%"
            v-model="formData.deadline"
            type="date"
            value-format="x"
            placeholder="选择截止时间"
          />
        </el-form-item>
      </el-col>
    </el-row>
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
      <el-button
        :disabled="formLoading"
        type="primary"
        @click="submitForm"
      >确 定</el-button>
      <el-button
        :disabled="formLoading"
        type="warning"
        @click="comeBack"
      >返 回</el-button>
    </el-form-item>
  </el-form>

  <!-- 生产计划列表 -->
  <ProductionPlanList ref="productionPlanListRef" @success="handleProductionPlanChange"/>

  <!-- 计划批次列表 -->
  <ProductionBatchList ref="productionBatchListRef" @success="handleProductionBatchChange" :plan-id="formData.planId"/>

</template>
<script lang="ts" setup>
import * as DefinitionApi from '@/api/bpm/definition'
import {OutsourcingManageApi, OutsourcingManageVO} from "@/api/machine/outsourcingmanage";
import ProductionPlanList from "@/views/machine/productionschedule/components/ProdutionPlanList.vue";
import ProductionBatchList from "@/views/machine/outsourcingmanage/components/ProdutionBatchList.vue";
import {useTagsViewStore} from '@/store/modules/tagsView'
import * as UserApi from "@/api/system/user";

defineOptions({ name: 'OutsourcingManageCreate' })

const { delView } = useTagsViewStore() // 视图操作
const { back, currentRoute, push } = useRouter() // 路由
const message = useMessage() // 消息弹窗

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  orderId: undefined,
  orderName: undefined,
  productId: undefined,
  productName: undefined,
  batch: undefined,
  planId: undefined,
  deadline: undefined,
  requireDetail: undefined,
  companyId: undefined,
  companyName: undefined,
  contact: undefined,
  contactPhone: undefined,
  processInstanceId: undefined,
  status: undefined,
})
const formRules = reactive({
  orderName: [{ required: true, message: '订单名称不能为空', trigger: 'blur' }],
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  batch: [{ required: true, message: '批次不能为空', trigger: 'blur' }],
  planId: [{ required: true, message: '计划编号不能为空', trigger: 'blur' }],
  deadline: [{ required: true, message: '截止时间不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const processDefineKey = 'outsourcing_manage' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref<any[]>([]) // 用户列表

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const { t } = useI18n() // 国际化
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
    const data = formData.value as unknown as OutsourcingManageVO
// 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      data.startUserSelectAssignees = startUserSelectAssignees.value
    }
    await OutsourcingManageApi.createOutsourcingManage(data)
    message.success('发起成功')
    // 发送操作成功的事件
    emit('success')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    back()
  } finally {
    formLoading.value = false
  }
}

const comeBack = () => {
  // 关闭当前页面
  delView(unref(currentRoute))
  push('/production/outsourcing-manage')
}

/** 初始化 */
onMounted(async () => {
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined,
    processDefineKey
  )
  if (!processDefinitionDetail) {
    message.error('委外管理的流程模型未配置，请检查！')
    return
  }
  startUserSelectTasks.value = processDefinitionDetail.startUserSelectTasks
  // 设置指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    // 设置校验规则
    for (const userTask of startUserSelectTasks.value) {
      startUserSelectAssignees.value[userTask.id] = []
      startUserSelectAssigneesFormRules.value[userTask.id] = [
        {required: true, message: '请选择审批人', trigger: 'blur'}
      ]
    }
    // 加载用户列表
    userList.value = await UserApi.getSimpleUserList()
  }
})

const productionPlanListRef = ref() // 生产计划 Ref
const openProductionPlanList = () => {
  productionPlanListRef.value.open()
}
const handleProductionPlanChange = (item) => {
  //将生产计划设置到生产计划排期
  formData.value.orderId = item.orderId;
  formData.value.planId = item.id;
  //没有订单名称，所以改为计划编号
  formData.value.orderName = item.planNo;
}

const productionBatchListRef = ref() // 计划批次 Ref
const openProductionBatchList = () => {
  productionBatchListRef.value.open()
}
const handleProductionBatchChange = (item) => {
  formData.value.batch = item.productionBatch;
  //将批次子表中的产品id和名称取出
  formData.value.productName = item.items.map(e => (e.productName)).join(',');
  formData.value.productId = item.items.map(e => (e.productId)).join(',');
}
</script>
