<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="25%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="日期" prop="countDate">
        <el-date-picker
          v-model="formData.countDate"
          type="date"
          value-format="x"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="地点" prop="countPlace">
        <el-input v-model="formData.countPlace" placeholder="请输入地点" type="textarea"/>
      </el-form-item>
      <el-form-item label="进入人数" prop="inPeople">
        <el-input type="number" v-model="formData.inPeople" placeholder="请输入进入人数" >
          <template #append>人次</template>
        </el-input>
      </el-form-item>
      <el-form-item label="离开人数" prop="outPeople">
        <el-input type="number" v-model="formData.outPeople" placeholder="请输入离开人数" >
          <template #append>人次</template>
        </el-input>
      </el-form-item>
      <el-form-item label="净流量" prop="stayPeople">
        <el-input type="number" v-model="formData.stayPeople" placeholder="计算净流量" >
          <template #append>人次</template>
        </el-input>
      </el-form-item>
      <el-form-item label="当日天气" prop="weather">
        <el-input v-model="formData.weather" placeholder="请输入当日天气" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PeopleCountingApi, PeopleCountingVO } from '@/api/agriculture/peoplecounting'

/** 旅游人流量统计 表单 */
defineOptions({ name: 'PeopleCountingForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  countDate: undefined,
  countPlace: undefined,
  inPeople: undefined,
  outPeople: undefined,
  stayPeople: undefined,
  weather: undefined,
})
const formRules = reactive({
  countDate: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
  countPlace: [{ required: true, message: '地点不能为空', trigger: 'blur' }],
  inPeople: [{ required: true, message: '进入人数不能为空', trigger: 'blur' }],
  outPeople: [{ required: true, message: '离开人数不能为空', trigger: 'blur' }],
  stayPeople: [{ required: true, message: '净流量不能为空', trigger: 'blur' }],
  weather: [{ required: true, message: '当日天气不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

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
      formData.value = await PeopleCountingApi.getPeopleCounting(id)
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
    const data = formData.value as unknown as PeopleCountingVO
    if (formType.value === 'create') {
      await PeopleCountingApi.createPeopleCounting(data)
      message.success(t('common.createSuccess'))
    } else {
      await PeopleCountingApi.updatePeopleCounting(data)
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
    countDate: undefined,
    countPlace: undefined,
    inPeople: undefined,
    outPeople: undefined,
    stayPeople: undefined,
    weather: undefined,
  }
  formRef.value?.resetFields()
}
</script>
