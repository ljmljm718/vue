<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="项目编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入项目编码"/>
      </el-form-item>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入项目名称"/>
      </el-form-item>
      <el-form-item label="项目分类" prop="category">
        <el-cascader
          v-model="category"
          :options="categoryOptions"
          @change="handleChange"
          :props="props"
          filterable
        />
      </el-form-item>
      <el-form-item label="图片" prop="pic">
        <UploadImg v-model="formData.pic"/>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入描述"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_INTEGER_STRING)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入排序"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {ProjectBaseApi, ProjectBaseVO} from '@/api/portal/projectbase'
import {ProjectCategoryApi} from '@/api/portal/projectcategory'
import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'

/** 门户项目基础信息 表单 */
defineOptions({name: 'ProjectBaseForm'})

/** 初始赋值 */
const status = 1;

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  code: undefined,
  name: undefined,
  category: '',
  pic: undefined,
  description: undefined,
  status: status,
  sort: undefined,
  remark: undefined,
})
const formRules = reactive({
  code: [{required: true, message: '项目编码不能为空', trigger: 'blur'}],
  name: [{required: true, message: '项目名称不能为空', trigger: 'blur'}],
  category: [{required: true, message: '项目分类不能为空', trigger: 'blur'}],
  status: [{required: true, message: '状态不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref
let categoryOptions = ref([])// 项目分类选项
const category = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type

  // 获取项目分类树
  categoryOptions.value = await ProjectCategoryApi.getProjectCategoryTree({parentId: 0, status: 1})
  console.log(categoryOptions.value )

  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProjectBaseApi.getProjectBase(id)
      category.value = formData.value.category.split(',').map(Number)
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
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProjectBaseVO
    if (formType.value === 'create') {
      await ProjectBaseApi.createProjectBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProjectBaseApi.updateProjectBase(data)
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
    code: undefined,
    name: undefined,
    category: '',
    pic: undefined,
    description: undefined,
    status: status,
    sort: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}

/**
 * 项目分类级联选择器
 */
const props = {
  value: 'id',
  expandTrigger: 'hover' as const,
}
const handleChange = (value: any) => {
  console.log(value)
  formData.value.category = value.join(',')
}

</script>
