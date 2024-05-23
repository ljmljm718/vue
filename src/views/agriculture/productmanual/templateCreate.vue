//templateCreateOrUpdate
//class="grid 2xl:grid-cols-2 gap-3 p-4"
//class="col-span-2"
<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex">
           <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
          >
            保存
          </el-button>
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
        <el-scrollbar class="croll-bar-template">
        <!-- 原内容 -->

        <!-- 截至 -->
        </el-scrollbar>
      </template>
    </EditFrame>

  </div>
</template>
<script setup lang="ts">
import {EditFrame,addFormStorage,addOrUpdateFormStorage,getFormStorage,deleteFormStorage} from '@/components/EditFrame/index'
import { useTagsViewStore } from "@/store/modules/tagsView";

// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '菜单名称'
const ORIGIN_PATH = '/pcg/marketingCenter/productManual' // 关闭表单时跳转的路径 路由

//保存到浏览器缓存
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}
//获取浏览器缓存
const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage(ROUTE_PATH, id)
  if (_form) formData.value = _form.formContent
}
if (!formData.value.id) loadData()

//起步函数
const getFrom = async () =>{
  resetForm();
  if(route.query.id)  {
    formData.value = await 查询单挑方法 (route.query.id as any);
    loadData(route.query.id);
  }
}

// 方式二 调用立即执行函数
onMounted(async () => {
    getFrom();
});
// 注意需要在submit最后一行,即faill前面加--router.push(ORIGIN_PATH),即跳转回原地址
// submit后面加入删除缓存
// 将 !formData.value.id
</script>