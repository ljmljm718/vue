<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!--      <el-form-item label="模板ID" prop="templateId">-->
      <!--        <el-input v-model="formData.templateId" placeholder="请输入模板ID"/>-->
      <!--      </el-form-item>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板名称" prop="templateId">
            <el-input v-model="formData.prepareOneA" placeholder="请输入模板名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="formData.productName" placeholder="请输入产品名称" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产商" prop="producer">
            <el-input v-model="formData.producer" placeholder="请输入生产商" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原产地" prop="sourceArea">
            <el-input v-model="formData.sourceArea" placeholder="请输入原产地" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则名称" prop="prepareOneB">
            <el-input v-model="formData.prepareOneB" placeholder="请输入规则名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否赋码" prop="codeType">
            <el-radio v-model="formData.codeType" label="1" disabled>未赋码</el-radio>
            <el-radio v-model="formData.codeType" label="2" disabled>已赋码</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品认证" prop="productCertification">
            <el-input v-model="formData.productCertification" placeholder="请输入产品认证"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产时间" prop="productionTime">
            <el-date-picker
              v-model="formData.productionTime"
              type="datetime"
              value-format="x"
              placeholder="选择生产时间"
              style="width: 100%"
              @change="handleDateChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始码" prop="prepareTwo">
            <el-input v-model="formData.prepareTwo" placeholder="选择生产时间后自动输入开始码" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束码" prop="prepareThree">
            <el-input v-model="formData.prepareThree" placeholder="选择生产时间后自动输入结束码" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-form-item label="源码" prop="codeContent">-->
      <!--        <el-input v-model="formData.codeContent" placeholder="请输入源码"/>-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="批次号" prop="batchNum">-->
      <!--        <el-input v-model="formData.batchNum" placeholder="请输入批次号" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="规则ID" prop="prepareOne">-->
      <!--        <el-input v-model="formData.prepareOne" placeholder="请输入规则ID"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="备注" prop="remark">-->
      <!--        <el-input v-model="formData.remark" placeholder="请输入备注" />-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {CodeSendingInfoApi, CodeSendingInfoVO} from '@/api/agriculture/codesendinginfo'
import {TraceTemplateApi} from "@/api/agriculture/tracetemplate";
import {CodeRuleApi} from "@/api/agriculture/coderule";
import dayjs from "dayjs";
import {CodeApplyApi, CodeApplyVO} from "@/api/agriculture/codeapply";

/** 发码记录 表单 */
defineOptions({name: 'CodeSendingInfoForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  codeContent: undefined,
  templateId: undefined,
  productName: undefined,
  productNameA: undefined,
  producer: undefined,
  sourceArea: undefined,
  productCertification: undefined,
  productionTime: undefined,
  codeType: "1",
  batchNum: undefined,
  prepareOne: undefined,
  prepareOneA: undefined,
  prepareOneB: undefined,
  prepareTwo: undefined,
  prepareThree: undefined,
  remark: undefined
})
const TraceTemplate = ref({
  id: undefined,
  templateName: undefined,
  mfrsId: undefined,
  origin: undefined,
  brandId: undefined,
  headerImg: undefined,
  productImg: undefined,
  remark: undefined,
  remark1: undefined,
  productImgs: undefined
})
const CodeRule = ref({
  id: undefined,
  codeName: undefined,
  categoryId: undefined,
  codeBefore: undefined,
  codeDate: undefined,
  codeSerial: undefined,
  remark: undefined,
})
const CodeApply = ref({
  id: undefined,
  applyName: undefined,
  applyNumber: undefined,
  applyDescribe: undefined,
  sourceId: undefined,
  ruleId: undefined,
  applyStatus: "2",
  remark: undefined,
})
const formRules = reactive({
  productCertification: [{ required: true, message: '产品认证不能为空', trigger: 'blur' }],
  productionTime: [{ required: true, message: '生产时间不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (type: string, CodeApplyVO?: CodeApplyVO) => {
  TraceTemplate.value = await TraceTemplateApi.getTraceTemplate(CodeApplyVO.sourceId)
  CodeRule.value = await CodeRuleApi.getCodeRule(CodeApplyVO.ruleId)
  dialogVisible.value = true
  dialogTitle.value = "发码"
  formType.value = type
  resetForm()
  //设置数据
  formData.value.templateId = CodeApplyVO.sourceId
  formData.value.prepareOne = CodeApplyVO.ruleId
  CodeApply.value.id = CodeApplyVO.id
  formData.value.prepareOneA = CodeApplyVO.ruleName
  formData.value.prepareOneB = CodeApplyVO.sourceName
  formData.value.productName = TraceTemplate.value.brandName
  formData.value.producer = TraceTemplate.value.companyName
  formData.value.sourceArea = TraceTemplate.value.origin
  formData.value.prepareOne = CodeApplyVO.applyNumber
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗
//时间
const handleDateChange = async (value) => {
  let codeDateString = '';
  const date = new Date(value);
  if (CodeRule.value.codeDate == "YYYYMMDD") {
    codeDateString = dayjs(date).format('YYYYMMDD');
  } else if (CodeRule.value.codeDate == "YYYYMMDDHH") {
    codeDateString = dayjs(date).format('YYYYMMDDHH');
  } else if (CodeRule.value.codeDate == "YYYYMMDDHHmm") {
    codeDateString = dayjs(date).format('YYYYMMDDHHmm');
  } else if (CodeRule.value.codeDate == "YYYYMMDDHHmmss") {
    codeDateString = dayjs(date).format('YYYYMMDDHHmmss');
  }
  let startNum = '';
  let endNum = '';
  formData.value.codeContent = CodeRule.value.codeSerial
  if (CodeRule.value.codeSerial == "4") {
    startNum = "0001"
    endNum = formData.value.prepareOne.toString().padStart(4, '0')
  } else if (CodeRule.value.codeSerial == "6") {
    startNum = "000001"
    endNum = formData.value.prepareOne.toString().padStart(6, '0')
  }
  formData.value.prepareTwo = CodeRule.value.codeBefore + codeDateString + startNum
  formData.value.prepareThree = CodeRule.value.codeBefore + codeDateString + endNum
  formData.value.remark = CodeRule.value.codeBefore + codeDateString
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CodeSendingInfoVO
    if (formType.value === 'create') {
      await CodeSendingInfoApi.createCodeSendingInfo(data)
      const dataCodeApply = CodeApply.value as unknown as CodeApplyVO
      await CodeApplyApi.updateCodeApply(dataCodeApply)
      message.success(t('common.createSuccess'))
    } else {
      await CodeSendingInfoApi.updateCodeSendingInfo(data)
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
    codeContent: undefined,
    templateId: undefined,
    productName: undefined,
    producer: undefined,
    sourceArea: undefined,
    productCertification: undefined,
    productionTime: undefined,
    codeType: "1",
    batchNum: undefined,
    prepareOne: undefined,
    prepareOneA: undefined,
    prepareOneB: undefined,
    prepareTwo: undefined,
    prepareThree: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
