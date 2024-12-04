<template>
  <!-- demo6.2.2新增 二级标题和新增按钮 -->
  <div class="flex justify-between items-center mb-[16px]">
    <h2 class="m-0 text-black dark:text-[#ccc] font-bold text-[16px]">地块基本信息</h2>
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
      <el-table-column label="名称" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.name`" :rules="formRules.name" class="mb-0px!">
            <el-input v-model="row.name" disabled />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="类型" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.type`" :rules="formRules.type" class="mb-0px!">
            <el-select v-model="row.type" disabled>
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
            <el-input v-model="row.altitude" disabled>
              <template #append>米</template>
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="纬度" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.latitude`" :rules="formRules.latitude" class="mb-0px!">
            <el-input v-model="row.latitude" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="经度" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.longitude`" :rules="formRules.longitude" class="mb-0px!">
            <el-input v-model="row.longitude" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="通讯地址" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.address`" :rules="formRules.address" class="mb-0px!">
            <el-input v-model="row.address" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.contact`" :rules="formRules.contact" class="mb-0px!">
            <el-input v-model="row.contact" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.tel`" :rules="formRules.tel" class="mb-0px!">
            <el-input v-model="row.tel" disabled />
          </el-form-item>
        </template>
      </el-table-column>

      <!-- demo6.2.2新增 缩小图片大小 -->
      <el-table-column label="图片" width="70" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.img`" :rules="formRules.img" class="mb-0px!">
            <UploadImg v-model="row.img" height="50px" width="50px" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="面积" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.area`" :rules="formRules.area" class="mb-0px!">
            <el-input v-model="row.area" disabled>
              <template #append>亩</template>
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">
            <el-input v-model="row.quantity" disabled />
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
            <el-input v-model="row.adoptionType" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150" align="center">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" disabled />
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

  <!--  选择地块-->
  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange" />
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue';

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

//地块的选择
const parkDetailPopupRef = ref();
const handleParkDetailPopupChange = (order: ParkDetailVO) => {
  console.log('--->>查看选择的地块信息：', order[0]);
  const row = {
    id: order[0].id,
    parkId: order[0].parkId,
    code: order[0].code,
    name: order[0].name,
    type: order[0].type,
    altitude: order[0].altitude,
    latitude: order[0].latitude,
    longitude: order[0].longitude,
    address: order[0].address,
    contact: order[0].contact,
    tel: order[0].tel,
    area: order[0].area,
    remark: order[0].remark,
    deptId: order[0].deptId,
    userId: order[0].userId,
    quantity: order[0].quantity,
    adoptionType: order[0].adoptionType,
    img: order[0].img,
    geofencing: order[0].geofencing,
    belongIrrigationArea: order[0].belongIrrigationArea
  };
  formData.value.push(row);
};

/** 新增按钮操作 */
const handleAdd = () => {
  parkDetailPopupRef.value.open();
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
