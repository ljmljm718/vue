<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <el-form-item label="设备编号" prop="deviceCode">
        <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="formData.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-cascader
          style="width: 100%"
          v-model="deviceType"
          :options="categoryOptions"
          @change="handleChange"
          :props="props"
          filterable
        />
      </el-form-item>
      <el-form-item label="设备检测类型" prop="deviceMonitorType">
          <el-select
                  v-model="formData.deviceMonitorType"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择设备检测类型">
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
          </el-select>
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="formData.longitude" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="formData.latitude" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item label="状态" prop="deviceStatus">
        <el-radio-group v-model="formData.deviceStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属基地" prop="belongPark">
        <el-input v-model="formData.belongPark" placeholder="请输入所属基地" />
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="图片" prop="imgId">
        <UploadImg v-model="formData.imgId" />
      </el-form-item>
      <el-form-item label="视频url" prop="url">
        <el-input v-model="formData.url" placeholder="请输入视频url" />
      </el-form-item>
      <el-form-item label="位置" prop="location">
        <el-input v-model="formData.location" placeholder="请输入位置" />
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
import { DeviceInfoApi, DeviceInfoVO } from '@/api/agriculture/deviceinfo'
import {DeviceCategoryApi} from '@/api/agriculture/devicecategory'
import {retainFirstTwoLayers} from "@/utils/tree";
import {any} from "vue-types";

/** 设备信息 表单 */
defineOptions({ name: 'DeviceInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  deviceCode: undefined,
  deviceName: undefined,
  deviceType: '',
  longitude: undefined,
  latitude: undefined,
  deviceStatus: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  remark: undefined,
  deptId: undefined,
  userId: undefined,
  imgId: undefined,
  location: undefined,
  url: undefined,
  deviceKind: undefined,
  deviceMonitorType: undefined
})
const options=ref([
  {
    value: '温度',
    label: '温度'
  },
  {
      value: '风速',
      label: '风速'
  },
  {
      value: '光照',
      label: '光照'
  },
{
  value: '湿度',
  label: '湿度'
},
{
  value: 'PH值检测',
  label: 'PH值检测'
}]
)
const formRules = reactive({
  deviceName: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
  deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'change' }],
  deviceMonitorType: [{ required: true, message: '设备监测类型不能为空', trigger: 'change' }],
  imgId: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
let categoryOptions = ref([])// 设备分类选项
const deviceType = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // 获取设备分类树
  const categoryTree = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
  categoryOptions.value = retainFirstTwoLayers(categoryTree);

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DeviceInfoApi.getDeviceInfo(id)
      formData.value.deviceMonitorType=formData.value.deviceMonitorType.split(',');
      deviceType.value = formData.value.deviceType.split(',').map(Number)
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
  // 提交请求
  formLoading.value = true
  try {
      formData.value.deviceMonitorType
    const data = formData.value as unknown as DeviceInfoVO
      console.log(data,333333)
    if (formType.value === 'create') {
      await DeviceInfoApi.createDeviceInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeviceInfoApi.updateDeviceInfo(data)
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
    deviceCode: undefined,
    deviceName: undefined,
    deviceType: '',
    longitude: undefined,
    latitude: undefined,
    deviceStatus: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    remark: undefined,
    deptId: undefined,
    userId: undefined,
    imgId: undefined,
    location: undefined,
    url: undefined,
    deviceKind: undefined
  }
  deviceType.value = []
  formRef.value?.resetFields()
}
/**
 * 设备分类级联选择器
 */
const props = {
  value: 'id',
  label: 'categoryName',
  expandTrigger: 'hover' as const,
}
const handleChange = (value: any) => {
  console.log(value)
  formData.value.deviceType = value.join(',')
  formData.value.deviceKind = value[1]
}
</script>
