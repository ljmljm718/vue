<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1100px">
    <div class="p-5">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="60px"
        v-loading="formLoading"
      >
        <div class="grid grid-cols-4 gap-2">
          <div class="col-span-3">
            <el-form-item
              label="分类"
              prop="repositoryType"
            >
              <el-select
                v-model="formData.repositoryType"
              >
                <el-option
                  v-for="item in typeListAll"
                  :label="item"
                  :value="item"
                  :key="item"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="row-span-4">
            <el-form-item prop="attachmentFile">
              <div>
                <UploadImg v-model="formData.attachmentImg" />
                <div style="font-size: .7rem;color:#deb581;">
                  上传1440*810px,小于500kb的图片
                </div>
              </div>

            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item label="标题" prop="repositoryTitle">
              <el-input v-model="formData.repositoryTitle" placeholder="请输入知识库标题"/>
            </el-form-item>
          </div>

          <div class="col-span-3">
            <el-form-item label="标签" prop="repositoryLabel">
              <el-select v-model="formData.repositoryLabel" placeholder="请选择标签">
                <el-option
                  v-for="item in labelListAll"
                  :label="item"
                  :value="item"
                  :key="item"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item label="作者" prop="writer">
              <el-input v-model="formData.writer" placeholder="请输入作者"/>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="简介" prop="synopsis">
          <el-input v-model="formData.synopsis" placeholder="请输入简介"/>
        </el-form-item>
        <el-form-item label="内容" prop="repositoryContent">
          <Editor v-model="formData.repositoryContent" height="300px"/>
        </el-form-item>
        <el-form-item label="附件文件" prop="attachmentFile">
        <UploadFile v-model="formData.attachmentFile" />
      </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button
        @click="submitForm"
        type="primary"
        :disabled="formLoading"
      >确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { RepositoryInfoApi, RepositoryInfoVO } from '@/api/agriculture/repositoryinfo'

/** 助农知识库信息表 表单 */
defineOptions({ name: 'RepositoryInfoForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  repositoryTitle: undefined,
  repositoryType: undefined,
  repositoryLabel: undefined,
  writer: undefined,
  synopsis: undefined,
  repositoryContent: undefined,
  attachmentImg: undefined,
  attachmentFile: undefined,
  browseNum: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

const typeListAll = ['病虫害识别', '收获预测', '价格预测', '农事操作规程']
const labelListAll = ['专家经验', '白皮书']
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
      formData.value = await RepositoryInfoApi.getRepositoryInfo(id)
      formData.value.attachmentFile=formData.value.attachmentFile.split(",");
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
    const data = formData.value as unknown as RepositoryInfoVO
    console.log("要提交的表单")
    console.log(data)
    if (formType.value === 'create') {
      await RepositoryInfoApi.createRepositoryInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await RepositoryInfoApi.updateRepositoryInfo(data)
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
    repositoryTitle: undefined,
    repositoryType: undefined,
    repositoryLabel: undefined,
    writer: undefined,
    synopsis: undefined,
    repositoryContent: undefined,
    attachmentImg: undefined,
    attachmentFile: undefined,
    browseNum: undefined,
  }
  formRef.value?.resetFields()
}
</script>