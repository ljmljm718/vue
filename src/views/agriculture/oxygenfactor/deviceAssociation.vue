<template>
  <div>
    <Dialog title="关联设备" v-model="dialogVisible">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-form-item label="因素名称" prop="dealPerson">
          <el-input v-model="formData.factorName" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" disabled>
            <template #append>
              <el-button @click="openPurchaseOrderInEnableList">
                <Icon icon="ep:search" />
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="dealPerson">
          <el-input v-model="formData.deviceName" placeholder="选择后自动填入设备名称" disabled />
        </el-form-item>
        <el-form-item label="地块编号" prop="plotCode">
          <el-input v-model="formData.plotCode" placeholder="请输入地块编号" disabled />
        </el-form-item>
        <el-form-item label="基地编号" prop="parkCode">
          <el-input v-model="formData.parkCode" placeholder="请输入基地编号" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
  </div>
  <!-- 选择设备 -->
  <AgriculturalBaseList ref="AgriculturalBaseListRef" @success="deviceBaseList"  />
  <!-- 已绑定设备 抽屉 -->
  <el-drawer v-model="drawer" :direction="direction" :before-close="handleClose">
    <template #header="{ titleId }">
      <h3 :id="titleId" class="text-xl color-[#000]" style="font-weight: 600"
        >因素名称：{{ queryParams.drawerTile }}</h3
      >
    </template>
    <el-table v-loading="loading" :data="tableData" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="增氧设备名称" align="center" prop="equipName" />
      <el-table-column label="地块名称" align="center" prop="plotName" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="deletDevice(scope.row)"
            v-hasPermi="['agriculture:oxygen-factor:delete']"
          >
            解绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="queryParams.obj.pageNo"
      v-model:page-size="queryParams.obj.pageSize"
      :page-sizes="[5, 10, 15, 20]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout=" total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-drawer>
</template>

<script setup lang='ts'>
import { ref, reactive,watch } from 'vue'
import AgriculturalBaseList from '@/views/agriculture/deviceinfo/SelectDeviceInfoFrom.vue'
import { OxygenFactorEquipApi } from '@/api/agriculture/oxygenfactorequip'
const dialogVisible = ref(false)
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formRef = ref() //表单ref
const formData = ref({
  factorName: undefined,
  id: undefined,
  deviceCode: undefined,
  deviceName: undefined,
  plotCode: undefined,
  parkCode: undefined
})
const formRules = reactive({
  factorName: [{ required: true, message: '因素名称不能为空', trigger: 'blur' }],
  parkCode: [{ required: true, message: '园区编号不能为空', trigger: 'blur' }],
  plotCode: [{ required: true, message: '地块编号不能为空', trigger: 'blur' }],
  deviceCode: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
  warnType: [{ required: true, message: '预警类型不能为空', trigger: 'change' }]
})
const open = (item = {}) => {
  dialogVisible.value = true
  console.log(item, '123123')
  console.log(dialogVisible.value, 'dialogVisible.value123123')
  formData.value = item
}

//选择弹出框
const AgriculturalBaseListRef = ref()
const openPurchaseOrderInEnableList = () => {
  AgriculturalBaseListRef.value.open()
}
//选择上设备成功
const deviceBaseList = (val) => {
  console.log(val, '123val')
  //设备编号
  formData.value.deviceCode = val[0].id
  //基地
  formData.value.parkCode = val[0].belongPark
  //地块
  formData.value.plotCode = val[0].belongPlot
  //设备名称
  formData.value.deviceName = val[0].deviceName
}
//提交绑定设备
const formLoading = ref(false) //loading
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const obj = {
      id: undefined,
      factorId: formData.value.id,
      equipId: formData.value.deviceCode,
      baseId: formData.value.parkCode,
      plotId: formData.value.plotCode
    }
    const data = obj
    await OxygenFactorEquipApi.createOxygenFactorEquip(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    formData.value = {
      factorName: undefined,
      id: undefined,
      deviceCode: undefined,
      deviceName: undefined,
      plotCode: undefined,
      parkCode: undefined
    }
  } finally {
    formLoading.value = false
  }
}
//抽屉
const drawer = ref(false)
const drawerTile = ref('')
const tableData = ref([])
const deviceId = ref({})
const total=ref(0)
const queryParams=reactive(
  {
    obj:{
      pageNo: 1,
      pageSize: 10,
      factorId: ''
    },
    drawerTile:''
  }
)
const drawerList = async (item) => {
  drawer.value = true
  deviceId.value = item
  queryParams.drawerTile= item.factorName?item.factorName:queryParams.drawerTile
  console.log(item.id,'item.iditem.iditem.id')
  queryParams.obj.factorId=item.id?item.id:queryParams.obj.factorId
  let res = await OxygenFactorEquipApi.getOxygenFactorEquipPage(queryParams.obj)
  total.value=res.total
  tableData.value = res.list
}
//删除设备
const deletDevice = async (val) => {
  console.log(val.id, 'valvalval123')
  let id = val.id

  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await OxygenFactorEquipApi.deleteOxygenFactorEquip(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await drawerList(deviceId.value)
  } catch {}
}
defineExpose({
  drawerList,
  open
})
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  queryParams.obj.pageSize=val
  console.log(queryParams,'queryParamsqueryParams')
  drawerList(queryParams)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  queryParams.obj.pageNo=val
  drawerList(queryParams)
}
watch(()=>drawer.value,(val)=>{
  if(!val){
    queryParams.obj={
      pageNo: 1,
      pageSize: 10,
      factorId: ''
    }
    queryParams.drawerTile=''
    console.log(queryParams,'ddddd123')

  }
},
)    
</script>
<style lang='scss' scoped>
</style>