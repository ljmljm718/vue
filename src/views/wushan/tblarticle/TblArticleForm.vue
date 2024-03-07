<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="文章标题" prop="articleTitle">
        <el-input v-model="formData.articleTitle" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="文章类别" prop="articleCategory">
        <el-input v-model="formData.articleCategory" placeholder="请输入文章类别" />
      </el-form-item>
      <el-form-item label="文章标签" prop="articleTag">
        <el-select v-model="formData.articleTag" placeholder="请选择文章标签">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WUSHAN_KNOWLEDGE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作者" prop="articleAuthor">
        <el-input v-model="formData.articleAuthor" placeholder="请输入作者" />
      </el-form-item>
      <el-form-item label="文章内容" prop="articleContent">
        <Editor v-model="formData.articleContent" height="150px" />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="formData.publishTime"
          type="date"
          value-format="x"
          placeholder="选择发布时间"
        />
      </el-form-item>
      <el-form-item label="浏览量" prop="articleReadQuantity">
        <el-input v-model="formData.articleReadQuantity" placeholder="请输入浏览量" />
      </el-form-item>
      <el-form-item label="文章状态" prop="articleStatus">
        <el-radio-group v-model="formData.articleStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.WUSHAN_ARTICLE_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文章略缩图" prop="articleImage">
        <UploadImg v-model="formData.articleImage" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="所属系统" prop="deptId">
        <el-input v-model="formData.deptId" placeholder="请输入所属系统" />
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
import { TblArticleApi, TblArticleVO } from '@/api/wushan/tblarticle'

/** 文章信息 表单 */
defineOptions({ name: 'TblArticleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  articleId: undefined,
  articleTitle: undefined,
  articleCategory: undefined,
  articleTag: undefined,
  articleAuthor: undefined,
  articleContent: undefined,
  publishTime: undefined,
  articleReadQuantity: undefined,
  articleStatus: undefined,
  articleImage: undefined,
  remark: undefined,
  deptId: undefined,
})
const formRules = reactive({
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
      formData.value = await TblArticleApi.getTblArticle(id)
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
    const data = formData.value as unknown as TblArticleVO
    if (formType.value === 'create') {
      await TblArticleApi.createTblArticle(data)
      message.success(t('common.createSuccess'))
    } else {
      await TblArticleApi.updateTblArticle(data)
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
    articleId: undefined,
    articleTitle: undefined,
    articleCategory: undefined,
    articleTag: undefined,
    articleAuthor: undefined,
    articleContent: undefined,
    publishTime: undefined,
    articleReadQuantity: undefined,
    articleStatus: undefined,
    articleImage: undefined,
    remark: undefined,
    deptId: undefined,
  }
  formRef.value?.resetFields()
}
</script>
