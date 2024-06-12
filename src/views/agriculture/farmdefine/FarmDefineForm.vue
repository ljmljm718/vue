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
          :data="farmDefineTree"
          :props="{...defaultProps, label: 'defineName'}"
          check-strictly
          default-expand-all
          placeholder="请选择父结点"
        />
      </el-form-item>
      <el-form-item label="分类编码" prop="defineCode">
        <el-input v-model="formData.defineCode" placeholder="请输入分类编码" />
      </el-form-item>
      <el-form-item label="分类名称" prop="defineName">
        <el-input v-model="formData.defineName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类标签" prop="defineLabel">
        <el-input v-model="formData.defineLabel" placeholder="请输入分类标签" />
      </el-form-item>
      <el-form-item label="是否显示" prop="showStatus">
        <el-radio-group v-model="formData.showStatus">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_INTEGER_STRING)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类排序" prop="defineSort">
        <el-input-number v-model="formData.defineSort" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FarmDefineApi, FarmDefineVO } from '@/api/agriculture/farmdefine'
import { defaultProps, handleTree } from '@/utils/tree'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

/** 鲁渝协作农事定义 表单 */
defineOptions({ name: 'FarmDefineForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parentId: undefined,
  defineCode: undefined,
  defineName: undefined,
  defineLabel: undefined,
  showStatus: undefined,
  defineSort: undefined,
  isLeaf: undefined,
  imgId: undefined,
  description: undefined,
})
const formRules = reactive({
  parentId: [{ required: true, message: '父结点', trigger: 'blur' }],
  defineCode: [{ required: true, message: '分类编码不能为空', trigger: 'blur' }],
  defineName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  defineLabel: [{ required: true, message: '分类标签，默认和名称一样不能为空', trigger: 'blur' }],
  showStatus: [{ required: true, message: '是否显示不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const farmDefineTree = ref() // 树形结构

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
      formData.value = await FarmDefineApi.getFarmDefine(id)
    } finally {
      formLoading.value = false
    }
  }else {
    formData.value.defineSort =await FarmDefineApi.getMaxOrder()
  }
  await getFarmDefineTree()
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
    const data = formData.value as unknown as FarmDefineVO
    if (formType.value === 'create') {
      await FarmDefineApi.createFarmDefine(data)
      message.success(t('common.createSuccess'))
    } else {
      await FarmDefineApi.updateFarmDefine(data)
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
    parentId: undefined,
    defineCode: undefined,
    defineName: undefined,
    defineLabel: undefined,
    showStatus: undefined,
    defineSort: undefined,
    isLeaf: undefined,
    imgId: undefined,
    description: undefined,
  }
  formRef.value?.resetFields()
}

/** 获得鲁渝协作农事定义树 */
const getFarmDefineTree = async () => {
  farmDefineTree.value = []
  const data = await FarmDefineApi.getFarmDefineList()
  const root: Tree = { id: 0, defineName: '顶级农事定义',  children: [] }
  root.children = handleTree(data, 'id', 'parentId')
  farmDefineTree.value.push(root)
}
</script>
