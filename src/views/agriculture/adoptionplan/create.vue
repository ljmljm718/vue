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
import {AdoptionRuleApi, AdoptionRuleVO} from "@/api/agriculture/adoptionrule";

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
  startTime: undefined,
  endTime: undefined,
})
//按只认养的formdata
const formData2 = ref({
  id: undefined,
  ruleNumber:undefined,
  planNumber: undefined,
  ruleType: '0',
  ruleOverview: undefined,
  ruleDescribe: undefined,
  remark: undefined,
  insuranceAmount: undefined,
})
const formRules2 = reactive({
  ruleNumber: [{ required: true, message: '规则流水号不能为空', trigger: 'blur' }],
  planNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  ruleOverview: [{ required: true, message: '认养价格不能为空', trigger: 'blur' }]
})
const formRef2 = ref() // 表单 Ref

//按亩认养的formdata
const formData3 = ref({
  id: undefined,
  ruleNumber:undefined,
  planNumber: undefined,
  ruleType: '1',
  ruleOverview: undefined,
  ruleDescribe: undefined,
  remark: undefined,
  insuranceAmount: undefined,
})
const formRules3 = reactive({
  ruleNumber: [{ required: true, message: '规则流水号不能为空', trigger: 'blur' }],
  planNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  ruleOverview: [{ required: true, message: '认养价格不能为空', trigger: 'blur' }]
})
const formRef3 = ref() // 表单 Ref

//全部认养的formdata
const formDataQuanBu = ref({
  id: undefined,
  ruleNumber:undefined,
  planNumber: undefined,
  ruleType: '2',
  ruleOverview: undefined,
  ruleDescribe: undefined,
  remark: undefined,
  insuranceAmount: undefined,
})
const formRulesaQuanBu = reactive({
  ruleNumber: [{ required: true, message: '规则流水号不能为空', trigger: 'blur' }],
  planNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  ruleType: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
  ruleOverview: [{ required: true, message: '认养价格不能为空', trigger: 'blur' }]
})
const formRef4 = ref() // 表单 Ref

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
    startTime: undefined,
    endTime: undefined,
  }
}

const getFormInfo = async () => {
  resetForm()
  formData.value = await AdoptionPlanApi.getAdoptionPlan(route.query.id as any)
  const result= await AdoptionRuleApi.getAdoptionRuleByPlanNumber(formData.value.serialNumber? formData.value.serialNumber:route.query.id)
  result.forEach(item => {
    if (item.ruleType=='0'){
      formData2.value = item
    }
    if (item.ruleType=='1'){
      formData3.value = item
    }
    if (item.ruleType=='2'){
      formDataQuanBu.value = item
    }
  })
  // 获取当前计划绑定的蟹塘
  const data = await AdoptionPlanApi.getPlanParkPlot(route.query.id as any)
  parkDetailList.value = data
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

// 新增蟹塘
const addParkDetailRef = ref()
const addParkDetail = () => {
  addParkDetailRef.value.open()
}
const handleParkDetailChange = (order: ParkDetailVO) => {
  parkDetailList.value.splice(parkDetailList.value.length, 0, order[0])
}

const tableRowClassName = ({row, rowIndex}) => {
  row.index = rowIndex;
}

// 删除蟹塘
const deleteParkDetail = (index) => {
  parkDetailList.value.splice(index.parkDetailIndex, 1)
}

/** 子表的表单 */
const subTabsNameFile = ref('adoptionPlanProfile')
const adoptionPlanProfileFormRef = ref()
/** 子表的表单 */
const subTabsNameRule = ref('adoptionRuleSpecs')
const adoptionRuleSpecsFormRefZhi = ref()
const adoptionRuleSpecsFormRefMu = ref()
const adoptionRuleSpecsFormRefQuanbu = ref()

// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await formRef2.value.validate()
  await formRef3.value.validate()
  await formRef4.value.validate()
  await adoptionPlanProfileFormRef.value.validate()
  await adoptionRuleSpecsFormRefZhi.value.validate()
  await adoptionRuleSpecsFormRefMu.value.validate()
  await adoptionRuleSpecsFormRefQuanbu.value.validate()

  formLoading.value = true
    try {
      // 更新蟹塘
      parkDetailList.value = parkDetailList.value.map (item=> {
        return {
          plotId: item.id,
          parkId: item.parkId,
          planId: formData.value.id,
        }
      })

      await AdoptionPlanApi.updatePlanParkPlot(parkDetailList.value, formData.value.id)

      const data = formData.value as unknown as AdoptionPlanVO
      // 拼接子表的数据
      data.adoptionPlanProfiles = adoptionPlanProfileFormRef.value.getData()
      //按只认养formData2
      const data2 = formData2.value as unknown as AdoptionRuleVO
      data2.planNumber=data.serialNumber
      // 拼接子表的数据
      data2.adoptionRuleSpecss = adoptionRuleSpecsFormRefZhi.value.getData()
      //按亩认养formData3
      const data3 = formData3.value as unknown as AdoptionRuleVO
      data3.planNumber=data.serialNumber
      data3.adoptionRuleSpecss = adoptionRuleSpecsFormRefMu.value.getData()
      //全部认养
      const data4 = formDataQuanBu.value as unknown as AdoptionRuleVO
      data4.planNumber=data.serialNumber
      data4.adoptionRuleSpecss = adoptionRuleSpecsFormRefQuanbu.value.getData()
      // adoptionRules
      if (!route.query.id) {
        await AdoptionPlanApi.createAdoptionPlan(data)
        if (!data2.id){
          await AdoptionRuleApi.createAdoptionRule(data2)
        }else {
          await AdoptionRuleApi.updateAdoptionRule(data2)
        }
        if (!data3.id){
          await AdoptionRuleApi.createAdoptionRule(data3)
        }else {
          await AdoptionRuleApi.updateAdoptionRule(data3)
        }
        if (!data4.id){
          await AdoptionRuleApi.createAdoptionRule(data4)
        }else {
          await AdoptionRuleApi.updateAdoptionRule(data4)
        }
        ElMessage.success('提交成功！')
      } else {
        await AdoptionPlanApi.updateAdoptionPlan(data)
        if (!data2.id){
          await AdoptionRuleApi.createAdoptionRule(data2)
        }else {
          await AdoptionRuleApi.updateAdoptionRule(data2)
        }
        if (!data3.id){
          await AdoptionRuleApi.createAdoptionRule(data3)
        }else {
          await AdoptionRuleApi.updateAdoptionRule(data3)
        }
        if (!data4.id){
          await AdoptionRuleApi.createAdoptionRule(data4)
        }else {
          await AdoptionRuleApi.updateAdoptionRule(data4)
        }
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


    // await adoptionPlanProfileFormRef.value.validate()
    // await adoptionRuleSpecsFormRefZhi.value.validate()
    // await adoptionRuleSpecsFormRefMu.value.validate()
  // 校验子表单
  // try {
  //   await parkDetailFormRef.value.validate()
  // } catch (e) {
  //   subTabsName.value = 'parkDetail'
  //   return
  // }
  // 提交请求

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
const activeTab = ref<any>('first')
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
                  <el-form-item label="计划流水号" prop="serialNumber">
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
                  <el-form-item label="计划生效时间" prop="startTime"  class="col-span-2" >
                    <el-date-picker
                      v-model="formData.startTime"
                      type="date"
                      value-format="x"
                      placeholder="选择计划开始时间"
                    />
                    -
                    <el-date-picker
                      v-model="formData.endTime"
                      type="date"
                      value-format="x"
                      placeholder="选择计划结束时间"
                    />
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
                  <el-form-item label="预计收获时间" prop="receivingStart" class="col-span-2">
                    <el-date-picker
                      v-model="formData.receivingStart"
                      type="date"
                      value-format="x"
                      placeholder="选择预计收获开始时间"
                    />
                    -
                    <el-date-picker
                      v-model="formData.receivingEnd"
                      type="date"
                      value-format="x"
                      placeholder="选择预计收获结束时间"
                    />
                  </el-form-item>
<!--                  <el-form-item label="预计收货结束时间" prop="receivingEnd">-->

<!--                  </el-form-item>-->
                <el-form-item label="计划描述" prop="planDescribe" class="col-span-2">
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
                >新增
                </el-button>
                <el-button
                  type="danger"
                  plain
                  :disabled="!parkDetailId"
                  @click="deleteParkDetail({parkDetailIndex})"
                >删除
                </el-button>
              </div>
              <ContentWrap>
                <el-table  v-loading="formLoading" :data="parkDetailList" :stripe="true" :show-overflow-tooltip="true"
                          @current-change="handleCurrentChange" highlight-current-row :row-class-name="tableRowClassName">
                  <el-table-column type="index" width="50" />
                  <el-table-column label="蟹塘编号" align="center" prop="id" width="200"/>
                  <el-table-column label="蟹塘名称" align="center" prop="name" width="200"/>
                  <!--      <el-table-column label="类型" align="center" prop="type" />-->
                  <el-table-column label="所属基地" align="center" prop="parkId" width="200"/>
                  <el-table-column label="海拔（米）" align="center" prop="altitude"/>
                  <el-table-column label="纬度" align="center" prop="latitude" width="120"/>
                  <el-table-column label="经度" align="center" prop="longitude" width="120"/>
                  <el-table-column label="通讯地址" align="center" prop="address"  width="200"/>
                  <el-table-column label="联系人" align="center" prop="contact"/>
                  <el-table-column label="联系电话" align="center" prop="tel"  width="120"/>
                  <el-table-column label="面积（亩）" align="center" prop="area"/>
                </el-table>
              </ContentWrap>

            </el-collapse-item>
            <el-collapse-item title="认养规则" name="3">
              <el-tabs  v-model="activeTab"  v-loading="formLoading" type="card">
                <el-tab-pane label="按份认养"  name="first">
                  <div class="grid grid-cols-3  ">
                    <div class="col-span-2">
                      <!-- 子表的表单 -->
                      <el-tabs class="mt-[-12px]"  v-loading="formLoading" v-model="subTabsNameRule">
                        <AdoptionRuleSpecsForm ref="adoptionRuleSpecsFormRefZhi" :rule-type="formData2.ruleType" :rule-number="formData2.ruleNumber" />
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
                        <el-form-item label="保险价格" prop="insuranceAmount">
                          <el-input-number style="width: 100%"  v-model="formData2.insuranceAmount" placeholder="请输入保险价格" />
                        </el-form-item>
                        <el-form-item label="认养价格" prop="ruleOverview">
                          <el-input type="textarea" v-model="formData2.ruleOverview" placeholder="请输入认养价格" />
                        </el-form-item>
                        <el-form-item label="认养人权益" prop="ruleDescribe">
                          <el-input type="textarea" v-model="formData2.ruleDescribe" placeholder="请输入认养人权益" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="按亩认养" name="second">
                  <div class="grid grid-cols-3  ">
                    <div class="col-span-2">
                      <!-- 子表的表单 -->
                      <el-tabs class="mt-[-12px]"  v-model="subTabsNameRule">
                        <AdoptionRuleSpecsForm ref="adoptionRuleSpecsFormRefMu" :rule-type="formData3.ruleType" :rule-number="formData3.ruleNumber" />
                      </el-tabs>
                    </div>
                    <div class="col-span-1">
                      <el-form
                        ref="formRef3"
                        :model="formData3"
                        :rules="formRules3"
                        label-width="100px"
                        v-loading="formLoading"
                      >
                        <el-form-item label="保险价格" prop="insuranceAmount">
                          <el-input-number style="width: 100%"  v-model="formData3.insuranceAmount" placeholder="请输入保险价格" />
                        </el-form-item>
                        <el-form-item label="认养价格" prop="ruleOverview">
                          <el-input type="textarea" v-model="formData3.ruleOverview" placeholder="请输入认养价格" />
                        </el-form-item>
                        <el-form-item label="认养人权益" prop="ruleDescribe">
                          <el-input type="textarea" v-model="formData3.ruleDescribe" placeholder="请输入认养人权益" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="全部认养" name="third">
                  <div class="grid grid-cols-3  ">
                    <div class="col-span-2">
                      <!-- 子表的表单 -->
                      <el-tabs class="mt-[-12px]"  v-model="subTabsNameRule">
                        <AdoptionRuleSpecsForm ref="adoptionRuleSpecsFormRefQuanbu" :rule-type="formDataQuanBu.ruleType" :rule-number="formDataQuanBu.ruleNumber" />
                      </el-tabs>
                    </div>
                    <div class="col-span-1">
                      <el-form
                        ref="formRef4"
                        :model="formDataQuanBu"
                        :rules="formRulesaQuanBu"
                        label-width="100px"
                        v-loading="formLoading"
                      >
                        <el-form-item label="保险价格" prop="insuranceAmount">
                          <el-input-number style="width: 100%"  v-model="formDataQuanBu.insuranceAmount" placeholder="请输入保险价格" />
                        </el-form-item>
                        <el-form-item label="认养价格" prop="ruleOverview">
                          <el-input type="textarea" v-model="formDataQuanBu.ruleOverview" placeholder="请输入认养价格" />
                        </el-form-item>
                        <el-form-item label="认养人权益" prop="ruleDescribe">
                          <el-input type="textarea" v-model="formDataQuanBu.ruleDescribe" placeholder="请输入认养人权益" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>

            </el-collapse-item>
            <el-collapse-item title="宣传包装图" name="4">
              <div class="grid grid-cols-3  ">
                <div class="col-span-2">
                  <el-tabs class="mt-[-12px]"  v-loading="formLoading" v-model="subTabsNameFile">
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
