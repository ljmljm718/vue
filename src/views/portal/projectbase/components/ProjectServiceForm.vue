<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
       <el-form-item label="服务编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入服务编码" />
      </el-form-item>
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入服务名称" />
      </el-form-item>
      <el-form-item prop="type">
        <template #label>
          <div>服务类型</div>
          <el-tooltip
            content="服务类型为【前台服务】的会展示在门户首页，其他类型仅做为维护使用"
            placement="top"
          >
            <Icon icon="ep:question-filled" style="vertical-align: middle" />
          </el-tooltip>
        </template>
        <el-select v-model="formData.type" placeholder="请选择服务类型">
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.PORTAL_PROJECT_SERVICE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <template #label>
          <div>是否展示</div>
          <el-tooltip
            content="状态为【是】的会展示在门户首页"
            placement="top"
          >
            <Icon icon="ep:question-filled" style="vertical-align: middle" />
          </el-tooltip>
        </template>
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
      <el-form-item label="访问路径" prop="accessPath">
        <el-input v-model="formData.accessPath" placeholder="请输入访问路径" />
      </el-form-item>
      <el-form-item label="服务器地址" prop="endpoint">
        <el-input v-model="formData.endpoint" placeholder="请输入服务器地址" />
      </el-form-item>
      <el-form-item label="端口号" prop="ports">
        <el-input v-model="formData.ports" placeholder="请输入端口号" />
      </el-form-item>
      <el-form-item label="框架类型" prop="frameType">
        <el-select v-model="formData.frameType" placeholder="请选择项目所用框架类型">
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.PROJECT_FRAME_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="租户名" prop="tenantName" v-show="formData.frameType && formData.frameType === 'saas'">
        <el-input v-model="formData.tenantName" placeholder="请输入租户名称"/>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入登录用户名"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入端口号"/>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {DICT_TYPE, getDictOptions, getIntDictOptions} from '@/utils/dict'
import {ProjectBaseApi} from '@/api/portal/projectbase'

/** 初始赋值 */
const status = 1;

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  projectId: undefined,
  code: undefined,
  name: undefined,
  type: 'front-end_service',
  status: status,
  accessPath: undefined,
  endpoint: undefined,
  ports: undefined,
  description: undefined,
  remark: undefined,
  frameType: undefined,
  tenantName: undefined,
  username: undefined,
  password: undefined,
})
const formRules = reactive({
  projectId: [{ required: true, message: '项目不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '服务编码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '服务类型不能为空', trigger: 'change' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  accessPath: [{ required: true, message: '访问路径不能为空', trigger: 'blur' }],
  // endpoint: [{ required: true, message: '服务器地址不能为空', trigger: 'blur' }],
  // ports: [{ required: true, message: '端口号不能为空', trigger: 'blur' }],
  // description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, projectId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.projectId = projectId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProjectBaseApi.getProjectService(id)
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
    const data = formData.value
    if (formType.value === 'create') {
      await ProjectBaseApi.createProjectService(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProjectBaseApi.updateProjectService(data)
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
    projectId: undefined,
    code: undefined,
    name: undefined,
    type: 'front-end_service',
    status: status,
    accessPath: undefined,
    endpoint: undefined,
    ports: undefined,
    description: undefined,
    remark: undefined,
    frameType: undefined,
    tenantName: undefined,
    username: undefined,
    password: undefined,
  }
  formRef.value?.resetFields()
}
</script>
