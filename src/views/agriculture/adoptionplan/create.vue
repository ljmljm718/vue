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
import AdoptionRuleSpecsForm
  from "@/views/agriculture/adoptionrule/components/AdoptionRuleSpecsForm.vue";
import AdoptionPlanProfileForm
  from "@/views/agriculture/adoptionplan/components/AdoptionPlanProfileForm.vue";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import AddParkDetail from "@/views/agriculture/adoptionplan/components/AddParkDetail.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";

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

const formData2 = ref({
  id: undefined,
  ruleNumber: undefined,
  planNumber: undefined,
  ruleType: undefined,
  ruleOverview: undefined,
  ruleDescribe: undefined,
  remark: undefined
})
const formRules2 = reactive({
  ruleNumber: [{ required: true, message: '规则流水号不能为空', trigger: 'blur' }],
  planNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  ruleOverview: [{ required: true, message: '规则概述不能为空', trigger: 'blur' }]
})
const formRef2 = ref() // 表单 Ref
/** 子表的表单 */
const subTabsName = ref('adoptionRuleSpecs')
const adoptionRuleSpecsFormRef = ref()

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
    formData2.value.planNumber=res
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

// 单选选中的地块id
const parkDetailId = ref()
// 选中行的索引
const parkDetailIndex = ref()
// 单选
const handleCurrentChange = (val: any) => {
  parkDetailId.value = val?.id
  parkDetailIndex.value = val?.index
}

const message = useMessage() // 消息弹窗
const parkDetailList = ref<ParkDetailVO[]>([]) // 蟹塘列表的数据
// 计划蟹塘中间表数据
// const formParkDetail = ref({
//   planId: undefined,
//   parkId: undefined,
//   plotId: undefined,
// })

// 新增蟹塘
const addParkDetailRef = ref()
const addParkDetail = () => {
  addParkDetailRef.value.open()
}
const handleParkDetailChange = (order: ParkDetailVO) => {
  parkDetailList.value.splice(parkDetailList.value.length, 0, order[0])
  console.log("parkDetailList.value", parkDetailList.value)
}

const tableRowClassName = ({row, rowIndex}) => {
  row.index = rowIndex;
}

// 删除蟹塘
const deleteParkDetail = (index) => {
  parkDetailList.value.splice(index, 1)
}

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
              <div style="margin-bottom:10px;">
                <el-button
                  type="primary"
                  plain
                  @click="addParkDetail()"
                >增加
                </el-button>
                <el-button
                  type="danger"
                  plain
                  :disabled="!parkDetailId"
                  @click="deleteParkDetail(parkDetailIndex.value)"
                >删除
                </el-button>
              </div>
              <ContentWrap>
                <el-table :data="parkDetailList" :stripe="true" :show-overflow-tooltip="true"
                          @current-change="handleCurrentChange" highlight-current-row :row-class-name="tableRowClassName">
                  <el-table-column type="index" width="50" />
                  <el-table-column label="蟹塘编号" align="center" prop="code" width="200"/>
                  <el-table-column label="蟹塘名称" align="center" prop="name" width="200"/>
                  <!--      <el-table-column label="类型" align="center" prop="type" />-->
                  <el-table-column label="所属基地" align="center" prop="parkId" width="200"/>
                  <el-table-column label="基地名称" align="center" prop="parkName" width="200"/>
                  <el-table-column label="海拔" align="center" prop="altitude"/>
                  <el-table-column label="纬度" align="center" prop="latitude" width="120"/>
                  <el-table-column label="经度" align="center" prop="longitude" width="120"/>
                  <el-table-column label="通讯地址" align="center" prop="address"  width="200"/>
                  <el-table-column label="联系人" align="center" prop="contact"/>
                  <el-table-column label="联系电话" align="center" prop="tel"  width="120"/>
                  <el-table-column label="面积" align="center" prop="area"/>
                </el-table>
              </ContentWrap>

            </el-collapse-item>
            <el-collapse-item title="认养规则" name="3">
              <div class="grid grid-cols-3  ">
                <div class="col-span-2">
                  <!-- 子表的表单 -->
                  <el-tabs class="mt-[-12px]" v-model="subTabsName">
                      <AdoptionRuleSpecsForm ref="adoptionRuleSpecsFormRef" :rule-number="formData.serialNumber" />
                  </el-tabs>
                </div>
                <div class="col-span-1">
                  <el-form
                    ref="formRef2"
                    :model="formData2"
                    :rules="formRules2"
                    label-width="100px"
                    v-loading="formLoading"
                  >
                    <el-form-item label="认养" prop="ruleOverview">
                      <el-input type="textarea" v-model="formData2.ruleOverview" placeholder="请输入规则概述" />
                    </el-form-item>
                    <el-form-item label="认养人权益" prop="ruleDescribe">
                      <el-input type="textarea" v-model="formData2.ruleDescribe" placeholder="请输入具体说明" />
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="宣传包装图" name="4">
              <div class="grid grid-cols-3  ">
                <div class="col-span-2">
                  <el-tabs class="mt-[-12px]" v-model="subTabsName">
                      <AdoptionPlanProfileForm ref="adoptionPlanProfileFormRef" :serial-number="formData.serialNumber" />
                  </el-tabs>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>

        </el-scrollbar>
      </template>
    </EditFrame>
  </div>

  <AddParkDetail ref="addParkDetailRef" @success="handleParkDetailChange"/>
</template>
<style scoped>
.scroll-bar-template {
  height: calc(100vh - 250px);
  overflow: auto;
}
</style>
