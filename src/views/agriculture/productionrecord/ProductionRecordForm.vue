<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <div class="header-title">
        <span>产线</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="设备编号" prop="lineNo">
            <el-select
              v-model="formData.lineNo"
              clearable
              filterable
              placeholder="请选择设备"
              @change="changeDevice"
              :disabled="formType === 'detail'"
              style="width: 100%;"
            >
              <el-option
                v-for="item in deviceList"
                :key="item.deviceCode"
                :label="item.deviceCode"
                :value="item.deviceCode"
              >
                <span style="float: left">{{ item.deviceName }}</span>
                <span style=" float: right; color: var(--el-text-color-secondary); font-size: 13px;" >
                  {{ item.deviceCode }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称" prop="lineName">
            <el-input :disabled="formType === 'detail'" v-model="formData.lineName" placeholder="请输入产线名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开始处理时间" prop="handleStartTime">
            <el-date-picker
              v-model="formData.handleStartTime"
              type="datetime"
              value-format="x"
              :disabled="formType === 'detail'"
              placeholder="选择开始处理时间"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束处理时间" prop="handleEndTime">
            <el-date-picker
              v-model="formData.handleEndTime"
              type="datetime"
              value-format="x"
              :disabled="formType === 'detail'"
              placeholder="选择结束处理时间"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="lineStatus">
            <el-select :disabled="formType === 'detail'" v-model="formData.lineStatus" placeholder="请选择状态">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_PRODUCTION_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品批次" prop="productBatch">
            <el-input :disabled="formType === 'detail'" v-model="formData.productBatch" placeholder="请输入产品批次" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="header-title">
        <span>原材料</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="关联出库单" prop="outOrderId">
            <el-input v-model="formData.outOrderId" readonly>
              <template #append>
                <el-button @click="openAuditOutList">
                  <Icon icon="ep:search"/> 选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="原材料信息" prop="rawName">
            <el-input v-model="formData.rawName" placeholder="请输入原材料信息" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="原材料数量" prop="rawNumber">
            <el-input v-model="formData.rawNumber" placeholder="请输入原材料数量" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--  原材料明细  -->
      <el-table v-if="rawList.length > 0" :data="rawList" :stripe="true" :show-overflow-tooltip="true" style="max-height: 130px;overflow-y: auto;margin-bottom: 10px">
        <el-table-column label="序号" width="60" align="center">
          <template v-slot="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="条码" align="center" prop="productBarCode" />
        <el-table-column label="名称" align="center" prop="productName" />
        <el-table-column label="单位" align="center" prop="productUnitName" />
        <el-table-column label="数量" align="center" prop="count" />
      </el-table>
      <!--  原材料明细  -->
      <div class="header-title">
        <span>产出产品</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品名称" prop="productName">
            <el-select
              v-model="formData.productName"
              :disabled="formType === 'detail'"
              clearable
              filterable
              @change="changeProduct"
              placeholder="请选择产品"
              style="width: 100%;"
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="productUnit">
            <el-input v-model="formData.productUnit" placeholder="请输入单位" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产出总数量" prop="totalNumber">
            <el-input :disabled="formType === 'detail'" v-model="formData.totalNumber" placeholder="请输入产出总数量" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合格数量" prop="qualifiedNumber">
            <el-input :disabled="formType === 'detail'" v-model="formData.qualifiedNumber" placeholder="请输入合格数量" />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.lineStatus === '2'">
          <el-form-item label="仓库" prop="warehouseName">
            <el-select
              v-model="formData.warehouseName"
              :disabled="formType === 'detail'"
              clearable
              @change="changeWarehouse"
              placeholder="请选择仓库"
              style="width: 100%;"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.lineStatus === '2'">
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              v-model="formData.supplierId"
              :disabled="formType === 'detail'"
              clearable
              placeholder="请选择仓库"
              style="width: 100%;"
            >
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button v-if="formType != 'detail'" @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 已审核的出库订单 -->
  <AuditOutList ref="auditOutListRef" @success="handleAuditOutChange"/>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { ProductionRecordApi, ProductionRecordVO } from '@/api/agriculture/productionrecord'
import { StockOutApi } from '@/api/erp/stock/out'
import { ProductApi, ProductVO } from '@/api/erp/product/product'
import AuditOutList from '@/views/agriculture/productionrecord/components/AuditOutList.vue'
import {DeviceInfoApi, DeviceInfoVO} from '@/api/agriculture/deviceinfo'
import { WarehouseApi, WarehouseVO } from '@/api/erp/stock/warehouse'
import { SupplierApi, SupplierVO } from '@/api/erp/purchase/supplier'

/** 生产记录 表单 */
defineOptions({ name: 'ProductionRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  lineNo: undefined,
  lineName: undefined,
  outOrderId: undefined,
  rawName: undefined,
  rawNumber: undefined,
  rawUnit: undefined,
  productBatch: undefined,
  productName: undefined,
  totalNumber: undefined,
  qualifiedNumber: undefined,
  productUnit: undefined,
  handleStartTime: undefined,
  handleEndTime: undefined,
  lineStatus: undefined,
  warehouseId: undefined,
  warehouseName: undefined,
  productId: undefined,
  supplierId: undefined
})
const checkTime = (rule: any, value: any, callback: any) => {
  if (value != undefined && value != null && value != '') {
    let startTime = formData.value.handleStartTime
    if (startTime != undefined && startTime!= null) {
      if (startTime > value) {
        callback(new Error('请选择正确的结束处理时间'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  } else {
    callback()
  }
}
const checkTotalNumber = (rule: any, value: any, callback: any) => {
  let totalNumber = formData.value.totalNumber
  if (formData.value.lineStatus === '2') {
    if (totalNumber != undefined && totalNumber != null && totalNumber != '') {
      callback()
    } else {
      callback(new Error('生产完成产出总数量不能为空'))
    }
  } else {
    callback()
  }
}
const checkQualifiedNumberNull = (rule: any, value: any, callback: any) => {
  let qualifiedNumber = formData.value.qualifiedNumber
  if (formData.value.lineStatus === '2') {
    if (qualifiedNumber != undefined && qualifiedNumber != null && qualifiedNumber != '') {
      callback()
    } else {
      callback(new Error('生产完成合格数量不能为空'))
    }
  } else {
    callback()
  }
}
const checkQualifiedNumber = (rule: any, value: any, callback: any) => {
  let totalNumber = formData.value.totalNumber
  if (Number(value) > Number(totalNumber)) {
    callback(new Error('合格数量不能大于产出总数量'))
  } else {
    callback()
  }
}
const formRules = reactive({
  lineNo: [{required: true, message: '设备编号不能为空', trigger: ['blur','change']}],
  lineName: [{required: true, message: '设备名称不能为空', trigger: ['blur','change']}],
  handleStartTime: [{required: true, message: '开始处理时间不能为空', trigger: ['blur','change']}],
  handleEndTime: [{validator: checkTime, trigger: ['blur','change']}],
  lineStatus: [{required: true, message: '状态不能为空', trigger: ['blur','change']}],
  productBatch: [{required: true, message: '产品批次不能为空', trigger: ['blur','change']}],
  outOrderId: [{required: true, message: '出库单不能为空', trigger: ['blur','change']}],
  productName: [{required: true, message: '产品名称不能为空', trigger: ['blur','change']}],
  totalNumber: [{pattern: /^[1-9]\d*$/, message: '请输入正确的产出总数量', trigger: ['blur','change']},
    {validator: checkTotalNumber, trigger: ['blur','change']}],
  qualifiedNumber: [{pattern: /^[1-9]\d*$/, message: '请输入正确的合格数量', trigger: ['blur','change']},
    {validator: checkQualifiedNumberNull, trigger: ['blur','change']},
    {validator: checkQualifiedNumber, trigger: ['blur','change']},
  ],
})
const formRef = ref() // 表单 Ref
/** 打开【已审核的其他出库订单】弹窗 */
const auditOutListRef = ref() // 已审核的其他出库订单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表
const rawList = ref<ProductVO[]>([]) // 原材料列表
const deviceList = ref<DeviceInfoVO[]>([]) // 设备列表的数据
const warehouseList = ref<WarehouseVO[]>([]) // 仓库列表
const supplierList = ref<SupplierVO[]>([]) // 供应商列表

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  const line_no = await initNo('B')
  // 加载产品列表
  productList.value = await ProductApi.getProductSimpleList()
  let data = await DeviceInfoApi.getDeviceInfoPage({pageNo: 1,pageSize:100})
  deviceList.value = data.list
  //加载仓库列表
  warehouseList.value = await WarehouseApi.getWarehouseSimpleList()
  if (warehouseList.value.length > 0) {
    formData.value.warehouseId = warehouseList.value[0].id
    formData.value.warehouseName = warehouseList.value[0].name
  }
  //加载供应商列表
  supplierList.value = await SupplierApi.getSupplierSimpleList()
  if (supplierList.value.length > 0) {
    formData.value.supplierId = supplierList.value[0].id
  }
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProductionRecordApi.getProductionRecord(id)
      //查询出库明细
      let outData = await StockOutApi.getStockOutPage({pageNo: 1,pageSize:100,no:formData.value.outOrderId})
      if (outData.list.length > 0) {
        rawList.value = outData.list[0].items
      }
      console.log(formData.value)
    } finally {
      formLoading.value = false
    }
  } else {
    formData.value.productBatch = line_no
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
    const data = formData.value as unknown as ProductionRecordVO
    if (formType.value === 'create') {
      await ProductionRecordApi.createProductionRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductionRecordApi.updateProductionRecord(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const initNo = async (bs?:string) => {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  //var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var number = Math.floor(Math.random() * 90) + 10
  return bs+year+month+day+hours+number
}

const openAuditOutList = () => {
  if (formType.value != 'detail') {
    auditOutListRef.value.open()
  }
}

const handleAuditOutChange = (item) => {
  formData.value.outOrderId = item.no
  formData.value.rawName = item.productNames
  formData.value.rawNumber = item.totalCount
  rawList.value = item.items
  console.log(item)
}

const changeDevice = (value: string) => {
  const selectItem = deviceList.value.filter((item: DeviceInfoVO) => {
    return item.deviceCode === value
  })
  if (selectItem.length > 0) {
    formData.value.lineName = selectItem[0].deviceName
  }
}
const changeProduct = (value: string) => {
  const selectItem = productList.value.filter((item: ProductVO) => {
    return item.id === value
  })
  if (selectItem.length > 0) {
    formData.value.productName = selectItem[0].name
    formData.value.productId = selectItem[0].id
    formData.value.productUnit = selectItem[0].unitName
  }
  console.log(formData)
}
const changeWarehouse = (value: string) => {
  const selectItem = warehouseList.value.filter((item: WarehouseVO) => {
    return item.id === value
  })
  if (selectItem.length > 0) {
    formData.value.warehouseId = selectItem[0].id
    formData.value.warehouseName = selectItem[0].name
  }
  console.log(formData)
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    lineNo: undefined,
    lineName: undefined,
    outOrderId: undefined,
    rawName: undefined,
    rawNumber: undefined,
    rawUnit: undefined,
    productBatch: undefined,
    productName: undefined,
    totalNumber: undefined,
    qualifiedNumber: undefined,
    productUnit: undefined,
    handleStartTime: undefined,
    handleEndTime: undefined,
    lineStatus: undefined,
    warehouseId: undefined,
    warehouseName: undefined,
    productId: undefined,
    supplierId: undefined
  }
  formRef.value?.resetFields()
  rawList.value = []
}
</script>
<style lang="css">
.header-title {
  width: 100%;
  height: 25px;
  border-bottom: 1px solid;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 15px;
}
</style>
