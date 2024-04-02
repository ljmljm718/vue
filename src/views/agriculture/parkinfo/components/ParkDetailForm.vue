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
       <el-table-column label="编号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.code`" :rules="formRules.code" class="mb-0px!">
            <el-input v-model="row.code" placeholder="不填后台自动生成" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.name`" :rules="formRules.name" class="mb-0px!">
            <el-input v-model="row.name" placeholder="请输入名称" />
          </el-form-item>
        </template>
      </el-table-column>
<!--      <el-table-column label="类型" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.type`" :rules="formRules.type" class="mb-0px!">
            <el-select v-model="row.type" placeholder="请选择类型">
                <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>-->
      <el-table-column label="海拔" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.altitude`" :rules="formRules.altitude" class="mb-0px!">
            <el-input v-model="row.altitude" placeholder="请输入海拔" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="纬度" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.latitude`" :rules="formRules.latitude" class="mb-0px!">
            <el-input v-model="row.latitude" placeholder="请输入纬度" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="经度" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.longitude`" :rules="formRules.longitude" class="mb-0px!">
            <el-input v-model="row.longitude" placeholder="请输入经度" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="通讯地址" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.address`" :rules="formRules.address" class="mb-0px!">
            <el-input v-model="row.address" placeholder="请输入通讯地址" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.contact`" :rules="formRules.contact" class="mb-0px!">
            <el-input v-model="row.contact" placeholder="请输入联系人" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.tel`" :rules="formRules.tel" class="mb-0px!">
            <el-input v-model="row.tel" placeholder="请输入联系电话" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="面积" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.area`" :rules="formRules.area" class="mb-0px!">
            <el-input v-model="row.area" placeholder="请输入面积" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">
            <el-input v-model="row.quantity" placeholder="请输入数量" />
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
    <el-button @click="handleAdd" round>+ 添加地块基本信息</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { ParkInfoApi } from '@/api/agriculture/parkinfo'

const props = defineProps<{
  parkId: undefined // 主表（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.parkId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await ParkInfoApi.getParkDetailListByParkId(val)
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
    parkId: undefined,
    code: undefined,
    name: undefined,
    type: undefined,
    altitude: undefined,
    latitude: undefined,
    longitude: undefined,
    address: undefined,
    contact: undefined,
    tel: undefined,
    area: undefined,
    remark: undefined,
    deptId: undefined,
    userId: undefined,
    quantity: undefined
  }
  row.parkId = props.parkId
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
