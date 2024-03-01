<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="父结点" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="projectCategoryTree"
          :props="{...defaultProps, label: 'name'}"
          check-strictly
          default-expand-all
          placeholder="请选择父结点"
        />
      </el-form-item>
      <el-form-item label="分类编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入分类编码" />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类标签" prop="label">
        <el-input v-model="formData.label" placeholder="请输入分类标签" />
      </el-form-item>
      <el-form-item label="是否显示" prop="status">
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

      <el-form-item label="分类排序" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入分类排序" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ProjectCategoryApi, ProjectCategoryVO } from '@/api/portal/projectcategory'
import { defaultProps, handleTree } from '@/utils/tree'

/** 项目分类 表单 */
defineOptions({ name: 'ProjectCategoryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  code: undefined,
  name: undefined,
  label: undefined,
  status: undefined,
  id: undefined,
  parentId: undefined,
  sort: undefined,
})
const formRules = reactive({
  code: [{ required: true, message: '分类编码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  label: [{ required: true, message: '分类标签不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '是否显示不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '父结点i不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const projectCategoryTree = ref() // 树形结构

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
      formData.value = await ProjectCategoryApi.getProjectCategory(id)
    } finally {
      formLoading.value = false
    }
  }
  await getProjectCategoryTree()
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
    const data = formData.value as unknown as ProjectCategoryVO
    if (formType.value === 'create') {
      await ProjectCategoryApi.createProjectCategory(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProjectCategoryApi.updateProjectCategory(data)
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
    label: undefined,
    status: undefined,
    id: undefined,
    parentId: undefined,
    sort: undefined,
  }
  formRef.value?.resetFields()
}

/** 获得项目分类树 */
const getProjectCategoryTree = async () => {
  projectCategoryTree.value = []
  const data = await ProjectCategoryApi.getProjectCategoryList({})
  const root: Tree = { id: 0, name: '顶级项目分类', children: [] }
  root.children = handleTree(data, 'id', 'parentId')
  projectCategoryTree.value.push(root)
}
</script>
