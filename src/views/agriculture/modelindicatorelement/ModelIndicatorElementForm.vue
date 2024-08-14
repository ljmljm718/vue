<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="60%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="监测指标" prop="indicatorId">
            <el-input v-model="indicatorName" disabled placeholder="请选择监测指标" />
<!--              <template #append>-->
<!--                <el-button @click="openIndicatorSelectPopup('0')">-->
<!--                  <Icon icon="ep:search"/>-->
<!--                  选择-->
<!--                </el-button>-->
<!--              </template>-->
<!--            </el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="要素名称" prop="elementName">
            <el-select v-model="formData.elementName" placeholder="请选择要素" clearable
                       style="width: 100%">
              <el-option v-for="item in deviceTypeList" :key="item" :label="item"
                         :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="权重(%)" prop="weight">
            <el-input v-model="formData.weight" :placeholder="weightPlaceholder" :disabled="weightDisabled"
                      type="number"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="绑定设备" prop="bindDevice">
            <el-input v-model="deviceName" placeholder="请选择绑定设备" >
              <template #append>
                <el-button @click="openDeviceSelectPopup('0')">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="指标说明" prop="indicatorDescription">
        <el-input v-model="formData.indicatorDescription" type="textarea" placeholder="请输入指标说明" />
      </el-form-item>
      <el-form-item label="实现类" prop="implementationClass">
        <el-input v-model="formData.implementationClass" placeholder="请输入实现类" />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="指标要素范围" name="modelIndicatorElementRange">
        <ModelIndicatorElementRangeForm ref="modelIndicatorElementRangeFormRef" :indicator-element-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!--  选择检测指标-->
  <IndicatorSelectPopup ref="indicatorSelectPopupRef" @success="handleIndicatorSelectPopupChange"/>

  <!--  选择设备-->
  <SelectDeviceInfoMultiple ref="deviceSelectRef" @success="handleDeviceSelectPopupChange" :device-monitor-type="formData.elementName"/>
</template>
<script setup lang="ts">
import { ModelIndicatorElementApi, ModelIndicatorElementVO } from '@/api/agriculture/modelindicatorelement'
import ModelIndicatorElementRangeForm from './components/ModelIndicatorElementRangeForm.vue'
import {
  ModelMonitorIndicatorApi,
  ModelMonitorIndicatorVO
} from "@/api/agriculture/modelmonitorindicator";
import IndicatorSelectPopup from "@/views/agriculture/modelmonitorindicator/IndicatorSelectPopup.vue"
import SelectDeviceInfoMultiple from "@/views/agriculture/deviceinfo/components/SelectDeviceInfoMultiple.vue"
import {DeviceInfoApi, DeviceInfoVO} from "@/api/agriculture/deviceinfo";
import {ModelManagementVO} from "@/api/agriculture/modelmanagement";

/** 指标要素 表单 */
defineOptions({ name: 'ModelIndicatorElementForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  indicatorId: undefined,
  elementName: undefined,
  weight: undefined,
  indicatorDescription: undefined,
  bindDevice: undefined,
  status: 1,
  implementationClass: undefined,
})
const maxNum = ref(100) // 权重可填写最大值

const formRules = reactive({
  indicatorId: [{ required: true, message: '监测指标不能为空', trigger: 'blur' }],
  weight: [
    { required: true, message: '请分配权重', trigger: 'blur' },
    {
      type: 'number',
      validator: (rule, value, callback) => {
        if (value < 1) return callback(new Error(`请输入大于0小于${maxNum.value}的数字!`))
        if (value > maxNum.value) return callback(new Error(`请输入大于0小于${maxNum.value}的数字!`))
        return callback()
      },
      trigger: 'change'
    },
  ],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('modelIndicatorElementRange')
const modelIndicatorElementRangeFormRef = ref()

const monitorIndicatorList = ref<ModelMonitorIndicatorVO[]>([])
const deviceTypeList = ref<List<String>>([]) // 设备检测类型列表的数据
const getDeviceTypeData = async () => {
  const res = await DeviceInfoApi.getDeviceMonitorType()
  if (Array.isArray(res)) deviceTypeList.value = res
}

/** 打开弹窗 */
const open = async (type: string, item: any) => {
  await getDeviceTypeData()
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if ( item !== null && item !== undefined) {
    const { id, indicatorId:_indicatorId } = item;
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        const res = await ModelIndicatorElementApi.getModelIndicatorElement(id)
        formData.value = { ...res, weight: res.weight }
        const indicator = await ModelMonitorIndicatorApi.getModelMonitorIndicator(_indicatorId)
        indicatorName.value = indicator.indicatorName
        deviceName.value = item.deviceName
      } finally {
        formLoading.value = false
      }
    } else {
      const indicator = await ModelMonitorIndicatorApi.getModelMonitorIndicator(_indicatorId)
      // 设置数据
      indicatorName.value = indicator.indicatorName;
      formData.value.indicatorId = _indicatorId;
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
    await modelIndicatorElementRangeFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'modelIndicatorElementRange'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ModelIndicatorElementVO
    // 拼接子表的数据
    data.modelIndicatorElementRanges = modelIndicatorElementRangeFormRef.value.getData()
    if (formType.value === 'create') {
      await ModelIndicatorElementApi.createModelIndicatorElement(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelIndicatorElementApi.updateModelIndicatorElement(data)
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
    indicatorId: undefined,
    elementName: undefined,
    weight: undefined,
    indicatorDescription: undefined,
    bindDevice: undefined,
    status: 1,
    implementationClass: undefined,
  }
  formRef.value?.resetFields()
  indicatorName.value = undefined
  deviceName.value = undefined
  weightDisabled.value = true
  weightPlaceholder.value = "请优先选择监测指标"
}

//监测指标名称
const indicatorName = ref()
//监测指标的选择
const indicatorSelectPopupRef = ref()
const openIndicatorSelectPopup = (id: string) => {
  indicatorSelectPopupRef.value.open(id)
}
const handleIndicatorSelectPopupChange = (order: ModelMonitorIndicatorVO) => {
  formData.value.indicatorId = order[0].id?.toString()
  indicatorName.value = order[0].indicatorName?.toString()
}

const deviceName = ref()
//设备的选择
const deviceSelectRef = ref()
const openDeviceSelectPopup = (id: string) => {
  deviceSelectRef.value.open(id)
}
const handleDeviceSelectPopupChange = (order: DeviceInfoVO) => {
  formData.value.bindDevice = order.map(item => item.id).join(',')
  deviceName.value = order.map(item => item.deviceName).join(',')
}

// 权重禁用
const weightDisabled = ref(true)

// 监听 indicatorId 变化
const weightPlaceholder = ref("请优先选择监测指标")
watch(
  () => formData.value.indicatorId,
  async (val) => {
    if (val) {
      weightDisabled.value = false
      const currentNum = await ModelIndicatorElementApi.getElementWeight(val)
      maxNum.value = 100 - +currentNum
      if (formData.value.id) {
        maxNum.value = Number(formData.value.weight) + maxNum.value
      }
      weightPlaceholder.value = "可分配权限范围为0~" + maxNum.value
      console.log("maxNum.value", maxNum.value)
    }
  },
  { immediate: true }
)
</script>
