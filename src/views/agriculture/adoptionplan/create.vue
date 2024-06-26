<script setup lang="ts">
import {
  EditFrame,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index'
import {
  TopRight,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTagsViewStore } from "@/store/modules/tagsView";
import {AdoptionPlanApi, AdoptionPlanVO} from "@/api/agriculture/adoptionplan";

const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '认养计划'
const ORIGIN_PATH = '/adoption/adoption-plan' // 关闭表单时跳转的路径

// TODO: name使用创建菜单时填写的组件名
defineOptions({ name: 'AdoptionPlanDetail' })


// 表单字段数据
const formData = ref({
  id: undefined,
  serialNumber: undefined,
  planName: undefined,
  planYear: undefined,
  adoptionKind: undefined,
  presaleStart: undefined,
  presaleEnd: undefined,
  receivingStart: undefined,
  receivingEnd: undefined,
  planDescribe: undefined,
})

// 重置表单方法
const resetForm = () => {
  formData.value = {
    id: undefined,
    serialNumber: undefined,
    planName: undefined,
    planYear: undefined,
    adoptionKind: undefined,
    presaleStart: undefined,
    presaleEnd: undefined,
    receivingStart: undefined,
    receivingEnd: undefined,
    planDescribe: undefined,
  }
}

const getFormInfo = async () => {
  resetForm()
  console.log("route.query.id", route.query.id)
  formData.value = await AdoptionPlanApi.getAdoptionPlan(route.query.id as any)
}

// 页面禁用
const disabled = ref<boolean>(false)
if (route.query.id) {
  if (route.query.type === 'view'){
    disabled.value = true
  }
  getFormInfo()
} else{
  AdoptionPlanApi.getInitNumber().then(res =>{
    formData.value.serialNumber = res
    formData.value.id = res
  })
}

// if (!route.query.id) getCategoryOptions()
// 页面 Loading
const formLoading = ref<boolean>(false)

// 表单 Ref
const formRef = ref()

// 表单校验规则
const formRules = reactive({
  planName: [{ required: true, message: '计划名称不能为空', trigger: 'blur' }],
})

/** 子表的表单 */
// const subTabsName = ref('parkDetail')
// const parkDetailFormRef = ref()

// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  // try {
  //   await parkDetailFormRef.value.validate()
  // } catch (e) {
  //   subTabsName.value = 'parkDetail'
  //   return
  // }
  // 提交请求
  formLoading.value = true
  try {
    // formData.value.parkDetails.forEach(parkDetail => {
    //   if (!parkDetail.parkId){
    //     parkDetail.parkId = formData.value.id
    //   }
    // })
    console.log("AdoptionPlan认养计划", formData.value)
    const data = formData.value as unknown as AdoptionPlanVO
    if (!formData.value.id) {
      await AdoptionPlanApi.createAdoptionPlan(data)
      ElMessage.success('提交成功！')
    } else {
      await AdoptionPlanApi.updateAdoptionPlan(data)
      ElMessage.success('提交成功！')
    }
    // 表单已提交，从本地删除此表单
    deleteFormStorage(
      ROUTE_PATH,
      formData.value.id ? formData.value.id : 'new_form'
    )
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
    router.push(ORIGIN_PATH)
  } catch (err) {
    ElMessage.error('提交失败, 请联系管理员')
  } finally {
    formLoading.value = false
  }
}

// 本地保存表单
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
const activeName = ref<any>(['1','2','3','4'])
</script>
<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex justify-between w-full">
          <div>
            <el-button
            type="success"
            v-show="!disabled"
            :icon="TopRight"
            @click="submitForm"
          >提交</el-button>
          <el-button
            type="danger"
            v-show="!disabled"
            :icon="Refresh"
            @click="resetForm()"
          >清空
          </el-button>
          </div>
          <div>
            <el-button
              type="primary"
              plain
              @click="router.back()"
            >返回</el-button>
            <el-button
            type="primary"
            v-show="!disabled"
            plain
            @click="localSave()"
          >
            暂存
          </el-button>
          </div>
        </div>
      </template>
      <template #content>
        <el-scrollbar class="croll-bar-template">
          <el-collapse v-model="activeName" simple>
            <el-collapse-item title="认养计划" name="1">
                <el-form
                  ref="formRef"
                  :disabled="disabled"
                  :model="formData"
                  :rules="formRules"
                  label-width="100px"
                  v-loading="formLoading"
                  class="grid grid-cols-4 gap-2 p-4"
                >
                  <el-form-item label="流水号" prop="serialNumber">
                    <el-input v-model="formData.serialNumber" placeholder="流水号后台自动生成" disabled/>
                  </el-form-item>
                  <el-form-item label="计划名称" prop="planName">
                    <el-input v-model="formData.planName" placeholder="请输入计划名称" />
                  </el-form-item>
                  <el-form-item label="计划年度" prop="planYear">
                    <el-date-picker
                      v-model="formData.planYear"
                      type="year"
                      value-format="x"
                      placeholder="选择计划年度"
                    />
                  </el-form-item>
                  <el-form-item label="认养品种" prop="adoptionKind">
                    <el-input v-model="formData.adoptionKind" placeholder="请输入认养品种" />
                  </el-form-item>
                  <el-form-item label="预售时间" prop="presaleStart"  class="col-span-2" >
                    <el-date-picker
                      v-model="formData.presaleStart"
                      type="date"
                      value-format="x"
                      placeholder="选择预售开始时间"
                    />
                    -
                    <el-date-picker
                      v-model="formData.presaleEnd"
                      type="date"
                      value-format="x"
                      placeholder="选择预售结束时间"
                    />
                  </el-form-item>
<!--                  <el-form-item label="预售结束时间" prop="presaleEnd">-->

<!--                  </el-form-item>-->
                  <el-form-item label="预计收货时间" prop="receivingStart" class="col-span-2">
                    <el-date-picker
                      v-model="formData.receivingStart"
                      type="date"
                      value-format="x"
                      placeholder="选择预计收货开始时间"
                    />
                    -
                    <el-date-picker
                      v-model="formData.receivingEnd"
                      type="date"
                      value-format="x"
                      placeholder="选择预计收货结束时间"
                    />
                  </el-form-item>
<!--                  <el-form-item label="预计收货结束时间" prop="receivingEnd">-->

<!--                  </el-form-item>-->
                  <el-form-item label="计划描述" prop="planDescribe" class="col-span-4">
                    <el-input type="textarea" v-model="formData.planDescribe" placeholder="请输入计划描述" />
                  </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="认养蟹塘" name="2">
              认养蟹塘
            </el-collapse-item>
            <el-collapse-item title="认养规则" name="3">
              认养规则
            </el-collapse-item>
            <el-collapse-item title="宣传包装图" name="4">
              宣传包装图
            </el-collapse-item>
          </el-collapse>

        </el-scrollbar>
      </template>
    </EditFrame>
  </div>
</template>
<style scoped>
.scroll-bar-template {
  height: calc(100vh - 250px);
  overflow: auto;
}
</style>
