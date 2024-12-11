<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData">
      <!--      <el-table-column label="序号" type="index" width="50" />-->
      <el-table-column label="下限" align="center" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.lowLimit`" :rules="formRules.lowLimit" class="mb-0px!">
            <el-input v-model="row.lowLimit" placeholder="请输入下限" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="上限" align="center" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.highLimit`" :rules="formRules.highLimit" class="mb-0px!">
            <el-input v-model="row.highLimit" placeholder="请输入上限" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" min-width="80">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.unit`" :rules="formRules.unit" class="mb-0px!">
            <el-input v-model="row.unit" placeholder="请输入单位" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="健康值" align="center" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.healthRatio`"
            :rules="formRules.healthRatio"
            class="mb-0px!"
          >
            <el-input v-model="row.healthRatio" placeholder="请输入健康值" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="健康等级" align="center" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.healthLevel`"
            :rules="formRules.healthLevel"
            class="mb-0px!"
          >
            <el-select v-model="row.healthLevel" placeholder="请选择健康等级">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_HEALTH_LEVEL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="指标结果" align="center" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.indicatorResult`"
            :rules="formRules.indicatorResult"
            class="mb-0px!"
          >
            <el-input v-model="row.indicatorResult" placeholder="请输入指标结果" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.sortBy`" :rules="formRules.sortBy" class="mb-0px!">
            <el-input v-model="row.sortBy" placeholder="请输入排序" />
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
    <el-button @click="handleAdd" round>+ 添加指标要素范围</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { ModelIndicatorElementApi } from '@/api/agriculture/modelindicatorelement';
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict';

const props = defineProps<{
  indicatorElementId: undefined; // 指标要素id（主表的关联字段）
}>();
const formLoading = ref(false); // 表单的加载中
const formData = ref([]);
const formRules = reactive({
  indicatorElementId: [{ required: true, message: '指标要素id不能为空', trigger: 'blur' }]
});
const formRef = ref(); // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.indicatorElementId,
  async (val) => {
    // 1. 重置表单
    formData.value = [];
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true;
      formData.value =
        await ModelIndicatorElementApi.getModelIndicatorElementRangeListByIndicatorElementId(val);
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
    indicatorElementId: undefined,
    lowLimit: undefined,
    highLimit: undefined,
    unit: undefined,
    healthRatio: undefined,
    healthLevel: undefined,
    indicatorResult: undefined,
    sortBy: undefined
  };
  row.indicatorElementId = props.indicatorElementId;
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
