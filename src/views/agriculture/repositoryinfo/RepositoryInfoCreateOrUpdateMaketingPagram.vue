<template>
  <div>

    <EditFrame>
      <template #header>
        <div class="flex">
           <!-- <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
          >
            保存
          </el-button> -->
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm"
          >提交</el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
            @click="resetForm()"
          >清空
          </el-button>
        </div>
      </template>

      <template #content>
        <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="60px"
        v-loading="formLoading"
        class="demo-form-inline"
        :inline="true"
      >
      <el-row>
      <el-col :span="20">
            <el-form-item
              label="分类"
              prop="repositoryType"
            >
              <el-select
                v-model="formData.repositoryType"
              >
              <div 
              v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_REPOSITORYINFO_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
              >
              <el-option
              v-if="dict.value!='全部'"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"/>
              </div>
              </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="repositoryTitle">
              <el-input v-model="formData.repositoryTitle" placeholder="请输入知识库标题"/>
            </el-form-item>
            <el-form-item label="标签" prop="repositoryLabel">
              <el-select v-model="formData.repositoryLabel" placeholder="请选择标签">
                <div 
              v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_REPOSITORYINFO_LABEL)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
              >
              <el-option
              v-if="dict.value!='全部'"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"/>
              </div>
              </el-select>
            </el-form-item>
            <el-form-item label="作者" prop="writer">
              <el-input v-model="formData.writer" placeholder="请输入作者"/>
            </el-form-item>
        <el-form-item label="简介" prop="synopsis">
          <el-input v-model="formData.synopsis" placeholder="请输入简介"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item  prop="attachmentFile">
              <div>
                <UploadImg height="100px" v-model="formData.attachmentImg" />
                <div style="font-size: .7rem;color:#deb581;">
                  上传1440*810px,小于500kb的图片
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容" prop="repositoryContent">
          <Editor v-model="formData.repositoryContent" height="300px"/>
        </el-form-item>
        <el-form-item label="附件文件" prop="attachmentFile">
        <UploadFile v-model="formData.attachmentFile" />
      </el-form-item>
      </el-form>

      </template>
    </EditFrame>

  </div>
</template>
<script setup lang="ts">
import {EditFrame,addOrUpdateFormStorage} from '@/components/EditFrame/index'
import { RepositoryInfoApi, RepositoryInfoVO } from '@/api/agriculture/repositoryinfo'
import {Refresh,TopRight} from '@element-plus/icons-vue'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = ''
const ORIGIN_PATH = '/pcg/repository-info' // 关闭表单时跳转的路径
const formRef = ref() 
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
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const { t } = useI18n() // 国际化

const formRules = reactive({
})

const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  message.success('保存成功！')
}

if(route.query.id){
    //替换成自己的
    // MarketingProgramApi.getMarketingProgram(route.query.id).then(res=>{
    // formData.value = res
    // formData.value.marketingType ='productmanual'
    // });
}
// 方式二 调用立即执行函数
onMounted(async () => {
      await open(route.query.type,route.query.id);
});
const open = async (type: string, id?: number) => {
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
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as RepositoryInfoVO
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
    router.push(ORIGIN_PATH);
  } finally {
    formLoading.value = false
  }
}
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
// 注意需要在submit最后一行,即faill前面加--router.push(ORIGIN_PATH),即跳转回原地址
</script>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>