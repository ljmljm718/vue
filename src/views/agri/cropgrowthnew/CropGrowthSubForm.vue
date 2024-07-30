<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="subformRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="生长期id" prop="cropCode">
        <el-input disabled v-model="formData.cropCode" placeholder="请输入生长期id" />
      </el-form-item>
      <el-form-item label="事项名称" prop="itemName">
        <el-input v-model="formData.itemName" placeholder="请输入事项名称" />
      </el-form-item>
      <el-form-item label="事项内容" prop="itemContent">
        <el-input v-model="formData.itemContent" height="150px" type="textarea"/>
      </el-form-item>
      <el-form-item label="周期" prop="remark1">
        <el-input v-model="formData.remark1" placeholder="请输入周期">
          <template #append>天</template>
        </el-input>
      </el-form-item>
      <!--<el-form-item label="备注2" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注2" />
      </el-form-item>
      <el-form-item label="所属基地" prop="belongPark">
        <el-input v-model="formData.belongPark" placeholder="请输入所属基地" />
      </el-form-item>
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="formData.endTime"
          type="date"
          value-format="x"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item label="作物关联id" prop="cropId">
        <el-input v-model="formData.cropId" placeholder="请输入作物关联id" />
      </el-form-item>
      <el-form-item label="环境条件" prop="envCondition">
        <el-input v-model="formData.envCondition" placeholder="请输入环境条件" />
      </el-form-item>
      <el-form-item label="生长地点" prop="growSite">
        <el-input v-model="formData.growSite" placeholder="请输入生长地点" />
      </el-form-item>
      <el-form-item label="基地名称" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="请输入基地名称" />
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="formData.plotName" placeholder="请输入地块名称" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CropGrowthSubApi, CropGrowthSubVO } from '@/api/agriculture/cropgrowthsub'

/** 生长周期子表 表单 */
defineOptions({ name: 'CropGrowthSubForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  cropCode: undefined,
  itemName: undefined,
  itemContent: undefined,
  remark1: undefined,
  remark: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  startTime: undefined,
  endTime: undefined,
  cropId: undefined,
  envCondition: undefined,
  growSite: undefined,
  parkName: undefined,
  plotName: undefined
})
const formRules = reactive({
  itemName: [{ required: true, message: '事项名称不能为空', trigger: 'blur' }]
})
const subformRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  console.log("ID", id);


  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formData.value.cropCode = id
    formLoading.value = true
    try {
      // const res = await CropGrowthSubApi.getCropGrowthSub(id)
      // console.log("RES", res);

      // formData.value = res
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  console.log("DDD");

  // 校验表单
  await subformRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CropGrowthSubVO
    if (formType.value === 'create') {
      await CropGrowthSubApi.createCropGrowthSub(data)
      message.success(t('common.createSuccess'))
    } else {
      await CropGrowthSubApi.updateCropGrowthSub(data)
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
    cropCode: undefined,
    itemName: undefined,
    itemContent: undefined,
    remark1: undefined,
    remark: undefined,
    belongPark: undefined,
    belongPlot: undefined,
    startTime: undefined,
    endTime: undefined,
    cropId: undefined,
    envCondition: undefined,
    growSite: undefined,
    parkName: undefined,
    plotName: undefined
  }
  subformRef.value?.resetFields()
}
</script>
