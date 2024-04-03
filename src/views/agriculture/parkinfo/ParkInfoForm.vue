<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编号" prop="code">
        <el-input v-model="formData.code" placeholder="不填后台自动生成" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_PARK_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="海拔" prop="altitude">
        <el-input v-model="formData.altitude" placeholder="请输入海拔" />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="formData.latitude" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="formData.longitude" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="通讯地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入通讯地址" />
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="formData.contact" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="formData.tel" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="面积" prop="area">
        <el-input v-model="formData.area" placeholder="请输入面积" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="简介" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="地块基本信息" name="parkDetail">
        <ParkDetailForm ref="parkDetailFormRef" :park-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo'
import ParkDetailForm from './components/ParkDetailForm.vue'
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'

/** 基地基本信息 表单 */
defineOptions({ name: 'ParkInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
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
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('parkDetail')
const parkDetailFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ParkInfoApi.getParkInfo(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await parkDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'parkDetail'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ParkInfoVO
    // 拼接子表的数据
    data.parkDetails = parkDetailFormRef.value.getData()
    if (formType.value === 'create') {
      await ParkInfoApi.createParkInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await ParkInfoApi.updateParkInfo(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
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
  formRef.value?.resetFields()
}
</script>
