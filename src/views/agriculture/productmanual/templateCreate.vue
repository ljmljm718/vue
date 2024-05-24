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
// 需要修改的方法
// 1.submitForm 中 if判断条件改为 !formData.value.id
// 2.submitForm方法中 "emit('success')" 行后面添加
// 开始
//     deleteFormStorage(
//       ROUTE_PATH,
//       formData.value.id ? formData.value.id : 'new_form'
//     )
//     // 关闭当前页面
//     useTagsViewStore().delView(router.currentRoute.value);
//     // 发送操作成功的事件
//     router.push(ORIGIN_PATH)
// 截至
// 3.getFrom方法中  formData.value = await "后端函数" 
// 改为open方法中 try 下方的第一行 即"fromData.value = await MarkeryingProgramApi.getMakertingProgram(id)" 
// 注意其中的id要改为 route.query.id as any
// 4.const FORMPAGE_NAME = '产品手册' 将它改为菜单名称
// 5.const ORIGIN_PATH = '/pcg/marketingCenter/productManual' // 将它改为保存之后的路由
import {EditFrame,addFormStorage,addOrUpdateFormStorage,getFormStorage,deleteFormStorage} from '@/components/EditFrame/index'
import { useTagsViewStore } from "@/store/modules/tagsView";

// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '菜单名称'
const ORIGIN_PATH = '/pcg/marketingCenter/productManual' // 关闭表单时跳转的路由

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
    formData.value = await open中的根据id查询的方法 (route.query.id as any);
    loadData(route.query.id);
  }
}

// 方式二 调用立即执行函数
onMounted(async () => {
    getFrom();
});

</script>