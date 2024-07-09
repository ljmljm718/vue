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
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="明细编号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.detailCode`" :rules="formRules.detailCode" class="mb-0px!">
            <el-input v-model="row.detailCode" placeholder="请输入明细编号" />
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column label="认养规则规格编号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.specsCode`" :rules="formRules.specsCode" class="mb-0px!">
            <el-input v-model="row.specsCode" placeholder="请输入认养规则规格编号" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productAmount`" :rules="formRules.productAmount" class="mb-0px!">
            <el-input v-model="row.productAmount" placeholder="请输入产品数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="保险数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.guaranteeAmount`" :rules="formRules.guaranteeAmount" class="mb-0px!">
            <el-input v-model="row.guaranteeAmount" placeholder="请输入保险数量" />
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
<!--      <el-table-column align="center" fixed="right" label="操作" width="60">-->
<!--        <template #default="{ $index }">-->
<!--          <el-button @click="handleDelete($index)" link>—</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
  </el-form>
<!--  <el-row justify="center" class="mt-3">-->
<!--    <el-button @click="handleAdd" round>+ 添加认养订单明细</el-button>-->
<!--  </el-row>-->
</template>
<script setup lang="ts">
import { AdoptionOrderApi } from '@/api/agriculture/adoptionorder'

const props = defineProps<{
  orderNumber: undefined // 订单流水号（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  orderNumber: [{ required: true, message: '订单流水号不能为空', trigger: 'blur' }],
  specsCode: [{ required: true, message: '认养规则规格编号不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.orderNumber,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      debugger
      formData.value = await AdoptionOrderApi.getAdoptionOrderDetailListByOrderNumber(val)
      debugger
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
    detailCode: undefined,
    orderNumber: undefined,
    specsCode: undefined,
    productAmount: undefined,
    guaranteeAmount: undefined,
    remark: undefined,
  }
  row.orderNumber = props.orderNumber
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
