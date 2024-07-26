<template>
  <Dialog title="调试配置" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      v-loading="formLoading"
      label-width="0px"
      :inline-message="true"
      :rules="formRules"
    >
      <el-table :data="formData" class="-mt-10px">
        <el-table-column label="参数名称" prop="subDevicesName">
          <template #default="{ row, $index }">
            <el-form-item
:prop="`${$index}.subDevicesName`" class="mb-0px!"
                          :rules="formRules.subDevicesName">
              <el-input v-model="row.subDevicesName"/>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="参数值" prop="parameterValue">
          <template #default="{ row, $index }">
            <el-form-item
:prop="`${$index}.parameterValue`" class="mb-0px!"
                          :rules="formRules.parameterValue">
              <el-input v-model="row.parameterValue"/>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="开关状态" prop="swithState">
          <template #default="{ row, $index }">
            <el-form-item
:prop="`${$index}.swithState`" class="mb-0px!"
                          :rules="formRules.swithState">
              <el-switch v-model="row.status" active-color="#13ce66" inactive-color="#ff4949"/>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="60">
          <template #default="{ $index }">
            <el-button @click="handleDelete($index)" link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row justify="center" class="mt-3">
      <el-button @click="handleAdd" round>+ 添加</el-button>
    </el-row>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {SubDeviceApi, SubDeviceVO} from '@/api/agriculture/subdevice'

/** 子设备管理 表单 */
defineOptions({name: 'SubDeviceListForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref()
const formRef = ref() // 表单 Ref
const masterId = ref() // 主表id

const formRules = reactive({
  subDevicesName: [{required: true, message: '子设备名称不能为空', trigger: 'blur'}],
})

/** 打开弹窗 */
const open = async (id?: string) => {
  dialogVisible.value = true
  masterId.value = id
  formData.value = []
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await SubDeviceApi.getSubDeviceByDeviceId(id)
      if (data != null)
        formData.value =data.map(item => ({...item, status: item.swithState === '0'}))
      console.log("formData",formData.value)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 保存按钮二次确认
  await message.confirm("是否确认保存调试配置信息")
  // 提交请求
  formLoading.value = true
  try {
    if (formData.value.length === 0) {
      handleAdd()
    }
    // data = formData.value as unknown as SubDeviceVO
    const data =formData.value.map(item => ({...item, swithState: item.status === false?'1':'0'}))
    await SubDeviceApi.editSubDevice(data)
    message.success(t('调试配置已保存'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    subDevicesNum: undefined,
    devicesId: undefined,
    subDevicesName: undefined,
    swithState: '1',
    remark: undefined,
    status: false,
    parameterValue:undefined,
  }
  row.devicesId = masterId.value
  formData.value.push(row)
}
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}
</script>
