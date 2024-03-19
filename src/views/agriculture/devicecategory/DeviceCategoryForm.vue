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
          :data="deviceCategoryTree"
          :props="{...defaultProps, label: 'categoryName'}"
          check-strictly
          default-expand-all
          placeholder="请选择父结点"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formData.categoryName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类编码" prop="categoryCode">
        <el-input v-model="formData.categoryCode" placeholder="请输入分类编码" />
      </el-form-item>
      <el-form-item label="分类标签" prop="categoryLabel">
        <el-input v-model="formData.categoryLabel" placeholder="请输入分类标签" />
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
      <el-form-item label="分类排序" prop="categorySort">
        <el-input-number
          v-model="formData.categorySort"
          :min="1"
          :step="1"
          step-strictly/>
      </el-form-item>
      <el-form-item label="图片" prop="imgId">
        <UploadImg v-model="formData.imgId" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="formData.description" />
      </el-form-item>
<!--      <el-form-item label="部门id" prop="deptId">-->
<!--        <el-input v-model="formData.deptId" placeholder="请输入部门id" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户id" prop="userId">-->
<!--        <el-input v-model="formData.userId" placeholder="请输入用户id" />-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { DeviceCategoryApi, DeviceCategoryVO } from '@/api/agriculture/devicecategory'
import { defaultProps, handleTree } from '@/utils/tree'

/** 初始赋值 */
const showStatus = 1;

/** 鲁渝协作设备分类 表单 */
defineOptions({ categoryName: 'DeviceCategoryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parentId: undefined,
  categoryCode: undefined,
  categoryName: undefined,
  categoryLabel: undefined,
  showStatus: showStatus,
  categorySort: undefined,
  imgId: undefined,
  description: undefined,
  deptId: undefined,
  userId: undefined,
})
const formRules = reactive({
  parentId: [{ required: true, message: '父结点不能为空', trigger: 'blur' }],
  categoryCode: [{ required: true, message: '分类编码不能为空', trigger: 'blur' }],
  categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  categoryLabel: [{ required: true, message: '分类标签不能为空', trigger: 'blur' }],
  showStatus: [{ required: true, message: '是否显示不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const deviceCategoryTree = ref() // 树形结构

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
      formData.value = await DeviceCategoryApi.getDeviceCategory(id)
    } finally {
      formLoading.value = false
    }
  }
  await getDeviceCategoryTree()
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
    const data = formData.value as unknown as DeviceCategoryVO
    if (formType.value === 'create') {
      await DeviceCategoryApi.createDeviceCategory(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeviceCategoryApi.updateDeviceCategory(data)
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
    categoryCode: undefined,
    categoryName: undefined,
    categoryLabel: undefined,
    showStatus: showStatus,
    categorySort: undefined,
    imgId: undefined,
    description: undefined,
    deptId: undefined,
    userId: undefined,
  }
  formRef.value?.resetFields()
}

/** 获得鲁渝协作设备分类树 */
const getDeviceCategoryTree = async () => {
  deviceCategoryTree.value = []
  const data = await DeviceCategoryApi.getDeviceCategoryList({})
  const root: Tree = { id: 0, categoryName: '顶级设备分类', children: [] }
  console.log("root", root)
  root.children = handleTree(data, 'id', 'parentId')
  deviceCategoryTree.value.push(root)
}
</script>
