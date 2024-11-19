<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="编号" width="160">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.serialNumber`"
            :rules="formRules.serialNumber"
            class="mb-0px!"
          >
            <!--            <el-input v-model="row.serialNumber" placeholder="请输入编号" />-->
            <el-input-number
              v-model="row.serialNumber"
              :min="1"
              :step="1"
              step-strictly
              placeholder="请输入编号"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="监测类型" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.monitor`" :rules="formRules.monitor" class="mb-0px!">
            <el-input v-model="row.monitor" placeholder="请输入监测类型" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.unit`" :rules="formRules.unit" class="mb-0px!">
            <el-input v-model="row.unit" placeholder="请输入单位" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加监测类型</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { DeviceCategoryApi } from '@/api/agriculture/devicecategory';

const props = defineProps<{
  deviceId: undefined; // 设备分类id（主表的关联字段）
}>();
const formLoading = ref(false); // 表单的加载中
const formData = ref([]);
const formRules = reactive({
  serialNumber: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
  monitor: [{ required: true, message: '监测类型不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
});
const formRef = ref(); // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.deviceId,
  async (val) => {
    // 1. 重置表单
    formData.value = [];
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true;
      formData.value = await DeviceCategoryApi.getDeviceCategoryMonitorListByDeviceId(val);
    } finally {
      formLoading.value = false;
    }
  },
  { immediate: true }
);

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    deviceId: undefined,
    serialNumber: undefined,
    monitor: undefined,
    remark: undefined,
    unit: undefined
  };
  row.deviceId = props.deviceId;
  formData.value.push(row);
};

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1);
};

/** 表单校验 */
const validate = () => {
  return formRef.value.validate();
};

/** 表单值 */
const getData = () => {
  return formData.value;
};

defineExpose({ validate, getData });
</script>
