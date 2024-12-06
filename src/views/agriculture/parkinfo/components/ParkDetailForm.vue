<template>
  <!-- demo6.2.2新增 二级标题和新增按钮 -->
  <div class="flex justify-between items-center mb-[16px]">
    <h2 class="m-0 font-bold text-[16px]">地块基本信息</h2>
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
      <!--       <el-table-column label="编号" min-width="150" align="center">-->
      <!--        <template #default="{ row, $index }">-->
      <!--          <el-form-item :prop="`${$index}.code`" :rules="formRules.code" class="mb-0px!">-->
      <!--            <el-input v-model="row.code" placeholder="不填后台自动生成" />-->
      <!--          </el-form-item>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="名称" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.name`" :rules="formRules.name" class="mb-0px!">
            <el-input v-model="row.name" placeholder="请输入名称" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="类型" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.type`" :rules="formRules.type" class="mb-0px!">
            <el-select v-model="row.type" placeholder="请选择类型">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_PLOT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="海拔" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.altitude`" :rules="formRules.altitude" class="mb-0px!">
            <el-input v-model="row.altitude" placeholder="请输入海拔">
              <template #append>米</template>
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="纬度" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.latitude`" :rules="formRules.latitude" class="mb-0px!">
            <el-input v-model="row.latitude" placeholder="请输入纬度" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="经度" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.longitude`" :rules="formRules.longitude" class="mb-0px!">
            <el-input v-model="row.longitude" placeholder="请输入经度" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="通讯地址" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.address`" :rules="formRules.address" class="mb-0px!">
            <el-input v-model="row.address" placeholder="请输入通讯地址" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.contact`" :rules="formRules.contact" class="mb-0px!">
            <el-input v-model="row.contact" placeholder="请输入联系人" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.tel`" :rules="formRules.tel" class="mb-0px!">
            <el-input v-model="row.tel" placeholder="请输入联系电话" />
          </el-form-item>
        </template>
      </el-table-column>

      <!-- demo6.2.2新增 缩小图片大小 -->
      <el-table-column label="图片" width="70" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.img`" :rules="formRules.img" class="mb-0px!">
            <UploadImg v-model="row.img" height="50px" width="50px" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="面积" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.area`" :rules="formRules.area" class="mb-0px!">
            <el-input v-model="row.area" placeholder="请输入面积">
              <template #append>亩</template>
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">
            <el-input v-model="row.quantity" placeholder="请输入数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="模式" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item
            :prop="`${$index}.adoptionType`"
            :rules="formRules.adoptionType"
            class="mb-0px!"
          >
            <el-input v-model="row.adoptionType" placeholder="请输入模式" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
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
  parkDetails: undefined;
}>();
const formLoading = ref(false); // 表单的加载中
const formData = ref([]);
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  altitude: [{ required: true, message: '海拔不能为空', trigger: 'blur' }],
  latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
  longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '通讯地址不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  tel: [
    {
      required: true,
      pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
      message: '请输入正确的号码',
      trigger: 'blur'
    }
  ],
  area: [{ required: true, message: '面积不能为空', trigger: 'blur' }]
  //img: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 初始化设置入库项 */
watch(
  () => props.parkDetails,
  async (val) => {
    formData.value = val;
  },
  { immediate: true }
);
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
    quantity: undefined,
    adoptionType: undefined,
    img: undefined,
    geofencing: undefined
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
