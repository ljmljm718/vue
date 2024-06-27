<template>
  <el-row justify="start" class="mt-3">
    <el-button @click="handleAdd" type="primary">新增</el-button>
  </el-row>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="mt-10px">
<!--      <el-table-column label="序号" type="index" width="100" />-->
       <el-table-column label="类型" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.detailType`" :rules="formRules.detailType" class="mb-0px!">
            <el-select v-model="row.detailType" placeholder="请选择明细类型">
                <el-option label="请选择字典生成" value="0" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.imgId`" :rules="formRules.imgId" class="mb-0px!">
<!--            <el-input v-model="row.imgId" placeholder="请输入图片" />-->
            <UploadImg v-model="row.imgId" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.detailDescribe`" :rules="formRules.detailDescribe" class="mb-0px!">
            <el-input type="textarea"  v-model="row.detailDescribe" placeholder="请输入描述" />
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
          <el-button @click="handleDelete($index)" type="danger" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>

</template>
<script setup lang="ts">
import { AdoptionPlanApi } from '@/api/agriculture/adoptionplan'

const props = defineProps<{
  serialNumber: undefined // 计划流水号（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  serialNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  detailType: [{ required: true, message: '明细类型不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.serialNumber,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await AdoptionPlanApi.getAdoptionPlanProfileListBySerialNumber(val)
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
    serialNumber: undefined,
    detailType: undefined,
    detailDescribe: undefined,
    imgId: undefined,
    remark: undefined,
  }
  row.serialNumber = props.serialNumber
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
