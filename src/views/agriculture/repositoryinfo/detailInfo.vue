<template>
  <ContentWrap>
    <div>
      <div style="text-align: right;margin-bottom: 5px;margin-top: 5px;padding-right: 10%">
        <el-button size="small" @click="handleBack()">返回</el-button>
      </div>
      <div ref="mainDiv" style="overflow-y: auto">
        <h1 style="text-align: center;font-weight: bold;">{{ formData.repositoryTitle }}</h1>
        <div style="width: 80%;margin-left: 10%;">
          <div>
            <span style="color: #0072c6;font-size: 14px;font-weight: bold">{{ formData.writer }}&nbsp;&nbsp;</span>
            <span
              style="color: #5a5e66;font-size: 12px;margin-left: 1%;">{{ formData.releaseTimeA }}</span>
            <span style="float: right;font-size: 12px;">阅读量：{{ formData.browseNum }}</span>
          </div>
          <!--          <br>-->
          <!--          <br>-->
        </div>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap>
    <div class="ql-editor" v-html="formData.repositoryContent"></div>
  </ContentWrap>
</template>

<script setup lang="ts">
import {RepositoryInfoApi} from "@/api/agriculture/repositoryinfo";
defineOptions({name: 'repositoryInfoDetail'})
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const router = useRouter() // 路由
const formRef = ref() // 表单 Ref
const formData = ref({
  id: undefined,
  repositoryName: undefined,
  repositoryId: undefined,
  repositoryTitle: undefined,
  repositoryContent: undefined,
  attachmentFile: undefined,
  repositoryLabel: '',
  writer: undefined,
  browseNum: undefined,
  repositoryStatus: '0',
  releaseTime: undefined,
  releaseTimeA: undefined,
})
/** 打开弹窗 */
const getDetail = async () => {
  resetForm()
  formData.value.id = router.currentRoute._value.query.id
  if (formData.value.id) {
    formLoading.value = true
    try {
      formData.value = await RepositoryInfoApi.getRepositoryInfoDetail(formData.value.id)
      if (formData.value.releaseTime) {
        formData.value.releaseTimeA = new Date().toLocaleString(formData.value.releaseTime)
      }
    } finally {
      formLoading.value = false
    }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    repositoryName: undefined,
    repositoryId: undefined,
    repositoryTitle: undefined,
    repositoryContent: undefined,
    attachmentFile: undefined,
    repositoryLabel: '',
    writer: undefined,
    browseNum: undefined,
    repositoryStatus: '0',
    releaseTime: undefined
  }
  formRef.value?.resetFields()
}

const handleBack = () => {
  // router.push('RepositoryInfo')
  router.go(-1);
}

/** 初始化 **/
onMounted(() => {
  getDetail()
})
</script>
<style scoped lang="scss">
</style>
