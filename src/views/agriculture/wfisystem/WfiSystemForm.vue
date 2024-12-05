<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="系统标识码" prop="sysCode">
        <el-input v-model="formData.sysCode" placeholder="请输入系统标识码" />
      </el-form-item>
      <el-form-item label="系统名称" prop="sysName">
        <el-input v-model="formData.sysName" placeholder="请输入系统名称" />
      </el-form-item>
      <el-form-item label="所属水源地" prop="belongWaterSource">
        <el-select v-model="formData.belongWaterSource" placeholder="请输入所属水源地">
          <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.wsName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="系统状态" prop="sysStatus">
        <el-radio-group v-model="formData.sysStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_SYSTEM_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WfiSystemApi, WfiSystemVO } from '@/api/agriculture/wfisystem';
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict';
import { WaterSourceApi } from '@/api/agriculture/watersource';

/** 水肥一体化系统信息 表单 */
defineOptions({ name: 'WfiSystemForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  sysCode: undefined,
  sysName: undefined,
  belongWaterSource: undefined,
  sysStatus: undefined
});
const formRules = reactive({
  sysCode: [{ required: true, message: '系统标识码不能为空', trigger: 'blur' }],
  sysName: [{ required: true, message: '系统名称不能为空', trigger: 'blur' }],
  belongWaterSource: [{ required: true, message: '所属水源地不能为空', trigger: 'blur' }]
});
const formRef = ref(); // 表单 Ref

let sourceList = ref();
const getSourceList = async () => {
  sourceList.value = await WaterSourceApi.getSourceList();
  console.log(sourceList);
};
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  await getSourceList();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WfiSystemApi.getWfiSystem(id);
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
    const data = formData.value as unknown as WfiSystemVO;
    if (formType.value === 'create') {
      await WfiSystemApi.createWfiSystem(data);
      message.success(t('common.createSuccess'));
    } else {
      await WfiSystemApi.updateWfiSystem(data);
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
    sysCode: undefined,
    sysName: undefined,
    belongWaterSource: undefined,
    sysStatus: undefined
  };
  formRef.value?.resetFields();
};
</script>
