<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
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
          value-format="x"
          placeholder="选择付款时间"
        />
      </el-form-item>
      <el-form-item label="发货时间" prop="shippingTime">
        <el-date-picker
          v-model="formData.shippingTime"
          type="date"
          value-format="x"
          placeholder="选择发货时间"
        />
      </el-form-item>
      <el-form-item label="收货时间" prop="receiptTime">
        <el-date-picker
          v-model="formData.receiptTime"
          type="date"
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
      <el-form-item label="预计收货日期（起）" prop="expectStart">
        <el-date-picker
          v-model="formData.expectStart"
          type="date"
          value-format="x"
          placeholder="选择预计收货日期（起）"
        />
      </el-form-item>
      <el-form-item label="预计收货日期（止）" prop="expectEnd">
        <el-date-picker
          v-model="formData.expectEnd"
          type="date"
          value-format="x"
          placeholder="选择预计收货日期（止）"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AdoptionOrderApi, AdoptionOrderVO } from '@/api/agriculture/adoptionorder'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

/** 认养订单 表单 */
defineOptions({ name: 'AdoptionOrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
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
  remark: undefined
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
  isPresented: [{ required: true, message: '订单赠送标识不能为空', trigger: 'blur' }]
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
      formData.value = await AdoptionOrderApi.getAdoptionOrder(id)
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
    const data = formData.value as unknown as AdoptionOrderVO
    if (formType.value === 'create') {
      await AdoptionOrderApi.createAdoptionOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await AdoptionOrderApi.updateAdoptionOrder(data)
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
    remark: undefined
  }
  formRef.value?.resetFields()
}

//分转换成元
const conversion = (num: number) => {
    const str = num / 100 + "";
    const intSum = str
      .substring(0, str.indexOf("."))
      .replace(/\B(?=(?:\d{3})+$)/g, ","); //取到整数部分
    const dot = str.substring(str.length, str.indexOf(".")); //取到小数部分搜索
    const ret = intSum + dot;
    return ret;
  };
</script>