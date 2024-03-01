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
        <el-input v-model="formData.code" placeholder="请输入编号" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="分类" prop="grade">
        <el-select v-model="formData.grade" placeholder="请选择分类" style="width: 100%" disabled>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_GRADE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
          <el-option
            v-for="dict in formData.grade === '0' ? getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_TYPE).filter(item => item.value.toString().substring(0,4) === 'park') : getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_TYPE).filter(item => item.value.toString().substring(0,6) === 'massif')"
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
      <el-form-item label="简介" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入简介" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { ParkBaseApi, ParkBaseVO } from '@/api/kaizhou/parkbase'

/** 园区/地块基本信息 表单 */
defineOptions({ name: 'ParkBaseForm' })

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
  grade: "0",
  type: undefined,
  altitude: undefined,
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  contact: undefined,
  tel: undefined,
  area: undefined,
  parentId: "0",
  remark: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  if (type === 'add')
    dialogTitle.value = '添加地块'
  else dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id && formType.value === 'update') {
    formLoading.value = true
    try {
      formData.value = await ParkBaseApi.getParkBase(id)
    } finally {
      formLoading.value = false
    }
  }else if (id && formType.value === 'add') {
    formData.value.grade = "10"
    formData.value.parentId = id
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ParkBaseVO
    if (formType.value === 'create') {
      await ParkBaseApi.createParkBase(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'add'){
      await ParkBaseApi.createParkBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await ParkBaseApi.updateParkBase(data)
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
    grade: "0",
    type: undefined,
    altitude: undefined,
    latitude: undefined,
    longitude: undefined,
    address: undefined,
    contact: undefined,
    tel: undefined,
    area: undefined,
    parentId: "0",
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
