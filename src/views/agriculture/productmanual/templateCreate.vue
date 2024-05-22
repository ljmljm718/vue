//templateCreateOrUpdate
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
        <!-- 原内容 -->

      </template>
    </EditFrame>

  </div>
</template>
<script setup lang="ts">
import {EditFrame,addFormStorage,addOrUpdateFormStorage,getFormStorage,deleteFormStorage} from '@/components/EditFrame/index'

// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = ''
const ORIGIN_PATH = '/pcg/marketingCenter/productManual' // 关闭表单时跳转的路径

const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
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
// 注意需要在submit最后一行,即faill前面加--router.push(ORIGIN_PATH),即跳转回原地址
</script>