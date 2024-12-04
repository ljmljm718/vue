<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="任务名称" prop="tiName">
        <el-input v-model="formData.tiName" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="灌溉类型" prop="irrigationType">
        <el-select v-model="formData.irrigationType" placeholder="请选择灌溉类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="灌溉时长/量" prop="amountTimeNumber">
        <el-input v-model="formData.amountTimeNumber" placeholder="请输入灌溉时长/量（分钟/L）" />
      </el-form-item>
      <el-form-item label="开始时间" prop="tiBeginTime">
        <el-date-picker
          v-model="formData.tiBeginTime"
          type="date"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="tiEndTime">
        <el-date-picker
          v-model="formData.tiEndTime"
          type="date"
          value-format="x"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item label="灌溉周期" prop="tiExecCron">
        <el-radio-group v-model="formData.tiExecCron">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_IRRIGATE_EXEC_CRON)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="灌溉周期天数" prop="tiExecCronDay">
        <el-input v-model="formData.tiExecCronDay" placeholder="请输入灌溉周期具体时间" />
      </el-form-item>
      <el-form-item label="灌溉日" prop="tiTaskInfo">
        <el-input
          v-model="formData.tiTaskInfo"
          placeholder="选择开始结束时间和灌溉周期后自动生成"
        />
      </el-form-item>
      <el-form-item label="任务执行时间" prop="tiExecBeginTime">
        <!--        <el-date-picker-->
        <!--          v-model="formData.tiExecBeginTime"-->
        <!--          type="date"-->
        <!--          value-format="x"-->
        <!--          placeholder="选择任务执行时间"-->
        <!--        />-->
        <el-input v-model="formData.tiExecBeginTime" placeholder="请输入任务执行时间" />
      </el-form-item>
      <el-form-item label="水泵控制" prop="waterPumpStatus">
        <el-radio v-model="formData.waterPumpStatus" label="是">是</el-radio>
        <el-radio v-model="formData.waterPumpStatus" label="否">否</el-radio>
      </el-form-item>
      <el-form-item label="并发执行数量" prop="concurrentTaskNumber">
        <el-input v-model="formData.concurrentTaskNumber" placeholder="请输入并发任务执行数量" />
      </el-form-item>

      <el-form-item label="执行灌区" prop="iaCodeList">
        <el-input v-model="formData.iaCodeList" placeholder="请输入任务执行灌区" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="formData.status" placeholder="请输入状态，停用、启用、未启用" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { WfiTaskIrrigationApi, WfiTaskIrrigationVO } from '@/api/agriculture/taskirrigation';

/** 灌溉任务 表单 */
defineOptions({ name: 'WfiTaskIrrigationForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  tiName: undefined,
  irrigationType: undefined,
  tiBeginTime: undefined,
  tiEndTime: undefined,
  tiExecCron: undefined,
  tiExecCronDay: undefined,
  tiExecBeginTime: undefined,
  waterPumpStatus: undefined,
  concurrentTaskNumber: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined,
  status: undefined,
  tiTaskInfo: undefined
});
const formRules = reactive({
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WfiTaskIrrigationApi.getWfiTaskIrrigation(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as WfiTaskIrrigationVO;
    if (formType.value === 'create') {
      await WfiTaskIrrigationApi.createWfiTaskIrrigation(data);
      message.success(t('common.createSuccess'));
    } else {
      await WfiTaskIrrigationApi.updateWfiTaskIrrigation(data);
      message.success(t('common.updateSuccess'));
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    tiName: undefined,
    irrigationType: undefined,
    tiBeginTime: undefined,
    tiEndTime: undefined,
    tiExecCron: undefined,
    tiExecBeginTime: undefined,
    waterPumpStatus: undefined,
    concurrentTaskNumber: undefined,
    amountTimeNumber: undefined,
    iaCodeList: undefined,
    status: undefined
  };
  formRef.value?.resetFields();
};
</script>
