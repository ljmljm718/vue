<template>
  <el-button type="primary" plain @click="handleAdd">新增</el-button>

  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="mt-10px">
       <el-table-column label="型号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.specsNumber`" :rules="formRules.specsNumber" class="mb-0px!">
            <el-input v-model="row.specsNumber" placeholder="请输入型号" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="认养模式" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.ruleType`" :rules="formRules.ruleType" class="mb-0px!">
            <el-select v-model="row.ruleType" placeholder="请选择认养模式" disabled>
              <el-option label="份" value="0" />
              <el-option label="亩" value="1" />
              <el-option label="全部" value="2" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.specs`" :rules="formRules.specs" class="mb-0px!">
            <el-input v-model="row.specs" placeholder="请输入规格" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单价" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.singlePrice`" :rules="formRules.singlePrice" class="mb-0px!">
            <el-input-number v-model="row.singlePrice" placeholder="请输入单价" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="份数" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.servingNumber`" :rules="formRules.servingNumber" class="mb-0px!">
            <el-input-number v-model="row.servingNumber" placeholder="请输入份数" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.servingAmount`" :rules="formRules.servingAmount" class="mb-0px!">
            <el-input-number v-model="row.servingAmount" placeholder="请输入数量" />
          </el-form-item>
        </template>
      </el-table-column>
<!--      <el-table-column label="备注" min-width="150">-->
<!--        <template #default="{ row, $index }">-->
<!--          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">-->
<!--            <el-input v-model="row.remark" placeholder="请输入备注" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
<script setup lang="ts">
import { AdoptionRuleApi } from '@/api/agriculture/adoptionrule'

const props = defineProps<{
  ruleNumber: undefined, // 认养规则流水号（主表的关联字段），
  ruleType: undefined // 认养规则流水号（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  ruleNumber: [{ required: true, message: '认养规则流水号不能为空', trigger: 'blur' }],
  specsNumber: [{ required: true, message: '型号不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.ruleNumber,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await AdoptionRuleApi.getAdoptionRuleSpecsListByRuleNumber(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    ruleNumber: undefined,
    specsNumber: undefined,
    ruleType: undefined,
    specs: undefined,
    singlePrice: undefined,
    servingNumber: undefined,
    servingAmount: undefined,
    remark: undefined
  }
  row.ruleNumber = props.ruleNumber
  row.ruleType = props.ruleType
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({ validate, getData })
</script>
