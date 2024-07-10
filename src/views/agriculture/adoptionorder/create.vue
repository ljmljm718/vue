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
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import AdoptionOrderDetailForm
  from "@/views/agriculture/adoptionorder/components/AdoptionOrderDetailForm.vue";
import {AdoptionOrderApi, AdoptionOrderVO} from "@/api/agriculture/adoptionorder";

const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '认养订单'
const ORIGIN_PATH = '/adoption/adoption-order' // 关闭表单时跳转的路径

// TODO: name使用创建菜单时填写的组件名
defineOptions({ name: 'AdoptionOrderDetail' })


// 表单字段数据
const formData = ref({
  id: undefined,
  serialNumber: undefined,
  orderNumber: undefined,
  parkId: undefined,
  plotId: undefined,
  orderType: undefined,
  addressNumber: undefined,
  orderAmount: undefined,
  realAmount: undefined,
  paymentTime: undefined,
  shippingTime: undefined,
  receiptTime: undefined,
  status: undefined,
  isPresented: undefined,
  isRemind: undefined,
  expectStart: undefined,
  expectEnd: undefined,
  remark: undefined,
})
const formRules = reactive({
  serialNumber: [{ required: true, message: '计划流水号不能为空', trigger: 'blur' }],
  orderNumber: [{ required: true, message: '订单流水号不能为空', trigger: 'blur' }],
  parkId: [{ required: true, message: '基地编号不能为空', trigger: 'blur' }],
  plotId: [{ required: true, message: '地块编号不能为空', trigger: 'blur' }],
  orderType: [{ required: true, message: '订单类型不能为空', trigger: 'change' }],
  addressNumber: [{ required: true, message: '地址标识号不能为空', trigger: 'blur' }],
  shippingTime: [{ required: true, message: '发货时间不能为空', trigger: 'blur' }],
  receiptTime: [{ required: true, message: '收货时间不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  isPresented: [{ required: true, message: '订单赠送标识不能为空', trigger: 'blur' }],
})
// 重置表单方法
const resetForm = () => {
  formData.value = {
    id: undefined,
    serialNumber: undefined,
    orderNumber: undefined,
    parkId: undefined,
    plotId: undefined,
    orderType: undefined,
    addressNumber: undefined,
    orderAmount: undefined,
    realAmount: undefined,
    paymentTime: undefined,
    shippingTime: undefined,
    receiptTime: undefined,
    status: undefined,
    isPresented: undefined,
    isRemind: undefined,
    expectStart: undefined,
    expectEnd: undefined,
    remark: undefined,
  }
}

const getFormInfo = async (id) => {
  resetForm()
  if(route.query.id){
    formData.value = await AdoptionOrderApi.getAdoptionOrder(id)
  }
}

// 页面禁用
const disabled = ref<boolean>(false)
if (route.query.id) {
  if (route.query.type === 'view'){
    disabled.value = true
  }
  getFormInfo(route.query.id)
}

// if (!route.query.id) getCategoryOptions()
// 页面 Loading
const formLoading = ref<boolean>(false)

// 表单 Ref
const formRef = ref()

/** 子表的表单 */
const subTabsName = ref('adoptionOrderDetail')
const adoptionOrderDetailFormRef = ref()


// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()

  formLoading.value = true
    try {

      const data = formData.value as unknown as AdoptionOrderVO
      // 拼接子表的数据
      data.adoptionOrderDetails = adoptionOrderDetailFormRef.value.getData()
      // adoptionRules
      if (!route.query.id) {
        await AdoptionOrderApi.createAdoptionOrder(data)
        ElMessage.success('提交成功！')
      } else {
        await AdoptionOrderApi.updateAdoptionOrder(data)
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
          <el-collapse v-model="activeName" class="" simple>
            <el-collapse-item title="认养订单" name="1">
              <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="110px"
                v-loading="formLoading"
                class="grid xl:grid-cols-4 xl:grid-cols-3 xl:grid-cols-2 xl:grid-cols-1 xl:grid-cols-1 gap-2 p-4"
              >
                <el-form-item label="计划流水号" prop="serialNumber">
                  <el-input v-model="formData.serialNumber" placeholder="请输入计划流水号" />
                </el-form-item>
                <el-form-item label="订单流水号" prop="orderNumber">
                  <el-input v-model="formData.orderNumber" placeholder="请输入订单流水号" />
                </el-form-item>
                <el-form-item label="基地编号" prop="parkId">
                  <el-input v-model="formData.parkId" placeholder="请输入基地编号" />
                </el-form-item>
                <el-form-item label="地块编号" prop="plotId">
                  <el-input v-model="formData.plotId" placeholder="请输入地块编号" />
                </el-form-item>
                <el-form-item label="订单类型" prop="orderType">
                  <el-select v-model="formData.orderType" placeholder="请选择订单类型">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.ADOPTION_ORDER_TYPE)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="地址标识号" prop="addressNumber">
                  <el-input v-model="formData.addressNumber" placeholder="请输入地址标识号" />
                </el-form-item>
                <el-form-item label="订单金额" prop="orderAmount">
                  <el-input v-model="formData.orderAmount" placeholder="请输入订单金额" />
                </el-form-item>
                <el-form-item label="实付金额" prop="realAmount">
                  <el-input v-model="formData.realAmount" placeholder="请输入实付金额"  width="300"/>
                </el-form-item>
                <el-form-item label="付款时间" prop="paymentTime">
                  <el-date-picker
                    v-model="formData.paymentTime"
                    type="date"
                    style="width: 100%"
                    value-format="x"
                    placeholder="选择付款时间"
                  />
                </el-form-item>
                <el-form-item label="发货时间" prop="shippingTime">
                  <el-date-picker
                    v-model="formData.shippingTime"
                    type="date"
                    style="width: 100%"
                    value-format="x"
                    placeholder="选择发货时间"
                  />
                </el-form-item>
                <el-form-item label="收货时间" prop="receiptTime">
                  <el-date-picker
                    v-model="formData.receiptTime"
                    type="date"
                    style="width: 100%"
                    value-format="x"
                    placeholder="选择收货时间"
                  />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="formData.status" placeholder="请选择订单状态">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.ADOPTION_ORDER_STATUS)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="订单赠送标识" prop="isPresented">
                  <el-select v-model="formData.isPresented" placeholder="请选择订单赠送标识">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.ADOPTION_ORDER_GIFT_STATUS)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否提醒" prop="isRemind">
                  <el-select v-model="formData.isPresented" placeholder="请选择是否提醒">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.ADOPTION_ODER_REMIND_STATUS)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="预计收货日期" prop="expectStart"  class="col-span-2" >
                  <el-date-picker
                    v-model="formData.expectStart"
                    type="date"
                    value-format="x"
                    placeholder="选择预计收货日期（起）"
                  />
                  -
                  <el-date-picker
                    v-model="formData.expectEnd"
                    type="date"
                    value-format="x"
                    placeholder="选择预计收货日期（止）"
                  />
                </el-form-item>
<!--                <el-form-item label="预计收货日期（止）" prop="expectEnd">-->

<!--                </el-form-item>-->
                <el-form-item label="备注" prop="remark" class="col-span-3">
                  <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
                </el-form-item>
              </el-form>
              <!-- 子表的表单 -->
              <el-tabs v-model="subTabsName">
                <el-tab-pane label="认养订单明细" name="adoptionOrderDetail">
                  <AdoptionOrderDetailForm ref="adoptionOrderDetailFormRef" :order-number="formData.orderNumber" />
                </el-tab-pane>
              </el-tabs>
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
