<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="水源编号" prop="wsCode">
        <el-input v-model="formData.wsCode" placeholder="请输入水源编号" />
      </el-form-item>
      <el-form-item label="水源名称" prop="wsName">
        <el-input v-model="formData.wsName" placeholder="请输入水源名称" />
      </el-form-item>
      <el-form-item label="水源类型" prop="wsType">
        <el-select v-model="formData.wsType" placeholder="请选择水源类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WS_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="省市区" prop="areaLocation">
        <el-cascader
          :options="areaSelectData"
          style="width: 100%"
          @change="handleChange"
          class="full-width"
          v-model="formData.district"
          placeholder="请选择省市区"
        />
      </el-form-item>
      <!--      <el-form-item label="省" prop="province">-->
      <!--        <el-input v-model="formData.province" placeholder="请输入省" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="市" prop="city">-->
      <!--        <el-input v-model="formData.city" placeholder="请输入市" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="区" prop="district">-->
      <!--        <el-input v-model="formData.district" placeholder="请输入区" />-->
      <!--      </el-form-item>-->
      <el-form-item label="最高水位(米)" prop="maxLevel">
        <el-input v-model="formData.maxLevel" placeholder="请输入最高水位(米)" />
      </el-form-item>
      <el-form-item label="最低水位(米)" prop="minLevel">
        <el-input v-model="formData.minLevel" placeholder="请输入最低水位(米)" />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="formData.longitude" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="formData.latitude" placeholder="请输入纬度" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WaterSourceApi, WaterSourceVO } from '@/api/agriculture/watersource';
import { codeToText, regionData } from 'element-china-area-data';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'; // 地址级联选择器

/** 水源信息 表单 */
defineOptions({ name: 'WaterSourceForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const areaSelectData = regionData; // options绑定的数据就是引入的 regionData
const areaLocation = ref(); // 省市区的统一回显
const formData = ref({
  id: undefined,
  wsCode: undefined,
  wsName: undefined,
  wsType: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  maxLevel: undefined,
  minLevel: undefined,
  longitude: undefined,
  latitude: undefined
});
const formRules = reactive({
  wsCode: [{ required: true, message: '水源编号不能为空', trigger: 'blur' }],
  wsName: [{ required: true, message: '水源名称不能为空', trigger: 'blur' }],
  wsType: [{ required: true, message: '水源类型不能为空', trigger: 'change' }],
  maxLevel: [
    { required: true, message: '请输入最高水位', trigger: 'blur' },
    { pattern: /^\d*\.?\d{0,2}$/, message: '最多保留两位小数', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && formData.value.minLevel) {
          const minLevelValue = parseInt(formData.value.minLevel, 10);
          const maxLevelValue = parseInt(value, 10);
          if (maxLevelValue <= minLevelValue) {
            callback(new Error('最高水位必须高于最低水位'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  minLevel: [
    { required: true, message: '请输入最低水位', trigger: 'blur' },
    { pattern: /^\d*\.?\d{0,2}$/, message: '最多保留两位小数', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && formData.value.minLevel) {
          const minLevelValue = parseInt(value, 10);
          const maxLevelValue = parseInt(formData.value.maxLevel, 10);
          if (maxLevelValue <= minLevelValue) {
            callback(new Error('最低水位必须低于最高水位'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await WaterSourceApi.getWaterSource(id);
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
    const data = formData.value as unknown as WaterSourceVO;
    if (formType.value === 'create') {
      await WaterSourceApi.createWaterSource(data);
      message.success(t('common.createSuccess'));
    } else {
      await WaterSourceApi.updateWaterSource(data);
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
    wsCode: undefined,
    wsName: undefined,
    wsType: undefined,
    province: undefined,
    city: undefined,
    district: undefined,
    maxLevel: undefined,
    minLevel: undefined,
    longitude: undefined,
    latitude: undefined
  };
  formRef.value?.resetFields();
  areaLocation.value = undefined;
};

// 编辑格式化地址
const handleChange = (e) => {
  const self = e;
  // CodeToText属性是区域码，属性值是汉字 CodeToText['110000']输出北京市
  formData.value.province = self[0];
  formData.value.city = self[1];
  formData.value.district = self[2];
  areaLocation.value = codeToText[self[0]] + '/' + codeToText[self[1]] + '/' + codeToText[self[2]];
};
</script>
