<template>
  <!-- demo6.2.2新增 二级标题和新增按钮 -->
  <div class="flex justify-between items-center mb-[16px]">
    <h2 class="m-0 font-bold text-[16px]">用药量信息</h2>
    <div>
      <el-button @click="handleAdd" type="primary" icon="plus">新增</el-button>
    </div>
  </div>

  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
    scroll-to-error
  >
    <!-- demo6.2.2新增 无需-mb-10px -->
    <el-table :data="formData">
      <el-table-column label="序号" type="index" width="70" align="center" />
      <el-table-column label="作物场所" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.cropSites`" :rules="formRules.cropSites" class="mb-0px!">
            <el-input v-model="row.cropSites" placeholder="请输入作物场所" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="防治对象" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.objects`" :rules="formRules.objects" class="mb-0px!">
            <el-input v-model="row.objects" placeholder="请输入防治对象" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="用药量" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.objects`" :rules="formRules.dosage" class="mb-0px!">
            <el-input v-model="row.dosage" placeholder="请输入用药量" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="施用方式" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.method`" :rules="formRules.method" class="mb-0px!">
            <el-input v-model="row.method" placeholder="请输入施用方式" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link type="primary">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';

const props = defineProps<{
  pesticideRegistrationSubDOList: undefined;
}>();
const formLoading = ref(false); // 表单的加载中
const formData = ref([]);
const formRules = reactive({
  //img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 初始化设置入库项 */
// 子属性名称
watch(
  () => props.pesticideRegistrationSubDOList,
  async (val) => {
    if (val != 'undefined' && val != undefined) {
      formData.value = val;
    } else {
      formData.value = [];
    }
  },
  { immediate: true }
);
/** 初始化设置入库项 */
// watch(
//   () => props.subList,
//   async (val) => {
//     console.log("val===",val);

//     formData.value = val;
//   },
//   { immediate: true }
// );
/** 监听主表的关联字段的变化，加载对应的子表数据 */
/*watch(
  () => props.parkId,
  async (val) => {
    console.log("props.parkId", val)
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await ParkInfoApi.getParkDetailListByParkId(val)
      console.log("子表formdata", formData.value)
    } finally {
      formLoading.value = false
    }
  },
  { deep: true }
)*/

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    parentId: undefined,
    cropSites: undefined,
    objects: undefined,
    dosage: undefined,
    method: undefined
  };
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
