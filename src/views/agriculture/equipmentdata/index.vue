<template>
  <ContentWrap>
    <div class="flex items-center relative">
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px "
      :style="`width:${isCollapse2?'':'57vw'}`"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="采集类型" prop="collectionType">
        <el-select  v-model="queryParams.collectionType" placeholder="请选择" clearable
          @keyup.enter="handleQuery"
          :class="`!w-${isCollapse2?'200px':'240px'}`">
          <el-option
            v-for="item in selectEquipmentType"
            :key="item"
            :label="item.categoryName"
            :value="item.categoryName"
            />
        </el-select>
        <!-- <el-input
          v-model="queryParams.collectionType"
          placeholder="请输入采集类型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
      </el-form-item>
      <el-form-item label="监测类型" prop="monitoringType">
        <el-select v-if="queryParams.collectionType"  v-model="queryParams.monitoringType" placeholder="请选择监测类型" clearable
          @keyup.enter="handleQuery"
          :class="`!w-${isCollapse2?'200px':'240px'}`">
          <el-option
            v-for="item in selectCollectionType"
            :key="item"
            :label="item"
            :value="item"
            />
        </el-select>
        <el-input v-else
          v-model="queryParams.monitoringType"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          :class="`!w-${isCollapse2?'200px':'240px'}`"
        />
      </el-form-item>


      <!-- <el-form-item label="数据值" prop="dataValue">
        <el-input
          v-model="queryParams.dataValue"
          placeholder="请输入数据值"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="单位" prop="yyUnit">
        <el-input
          v-model="queryParams.yyUnit"
          placeholder="请输入单位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="采集时间" prop="collectionTime">
        <el-date-picker
          v-model="queryParams.collectionTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          :class="`!w-${isCollapse2?'240px':'240px'}`"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          :class="`!w-${isCollapse2?'200px':'240px'}`"
        />
      </el-form-item>

      <!-- <el-form-item label="基地名称" prop="parkName">
        <el-select  v-model="queryParams.parkName" placeholder="请选择基地名称" clearable
          @keyup.enter="handleQuery"
          class="!w-240px">
          <el-option
            v-for="item in selectBase"
            :key="item"
            :label="item.name"
            :value="item.name"
            />
        </el-select> -->
        <!-- <el-input
          v-model="queryParams.parkName"
          placeholder="请输入基地名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
      <!-- </el-form-item> -->
      <!-- <el-form-item label="基地编码" prop="baseCode">
        <el-input
          v-model="queryParams.baseCode"
          placeholder="请输入基地编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
       -->



      <!-- <el-form-item label="地块名称" prop="parkDname">
        <el-input
          v-model="queryParams.parkDname"
          placeholder="请输入地块名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="地块编码" prop="plotCode">
        <el-input
          v-model="queryParams.plotCode"
          placeholder="请输入地块编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->

      <el-form-item label="通道编码" prop="channelId">
        <el-input
          v-model="queryParams.channelId"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          :class="`!w-${isCollapse2?'200px':'240px'}`"
        />
      </el-form-item>
      <el-form-item label="设备编号" prop="yyRemarks">
        <el-input
          v-model="queryParams.yyRemarks"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-260px"
        />
      </el-form-item>
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input
          v-model="queryParams.reserveOne"
          placeholder="请输入备用一"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input
          v-model="queryParams.reserveTwo"
          placeholder="请输入备用二"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input
          v-model="queryParams.reserveThree"
          placeholder="请输入备用三"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      
      
    </el-form>
    <div v-if="isCollapse2" class="absolute right-0 flex items-center">
        <div  class='w-3px h-70px bg-[#f1f1f1] -ml-20px mr-10px'></div>
        <el-form-item class='flex'>
          <el-button @click="handleQuery" class="!bg-[#009688] !color-[#fff]"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </div>
      <div v-if="!isCollapse2" class='w-3px h-70px bg-[#f1f1f1] -ml-10px mr-10px'></div>
      <div v-if="!isCollapse2" class='flex'>
        <el-button @click="handleQuery" class="!bg-[#009688] !color-[#fff]"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </div>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div  class='mb-20px -mt-5px ml-10px'>
        <el-button
              class="!bg-[#009688] !color-[#fff]"
              plain
              @click="openForm('create')"
              v-hasPermi="['yyang:equipment-data:create']"
            >
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
            <el-button
              plain
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['yyang:equipment-data:export']"
            >
              <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
    </div>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="采集类型" align="center" prop="collectionType" />
        <!-- <template #default="scope">
          <el-cascader
            style="width: 100%"
            v-model="scope.row.collectionType"
            :options="categoryOptions"
            :props="categoryProps"
            disabled
          />
        </template>
      </el-table-column> -->


      <el-table-column label="监测类型" align="center" prop="monitoringType" />
      <el-table-column label="数据值" align="center" prop="dataValue" />
      <el-table-column label="单位" align="center" prop="yyUnit" />
      <el-table-column
        label="采集时间"
        align="center"
        prop="collectionTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!-- <el-table-column label="基地编码" align="center" prop="baseCode" /> -->
      <el-table-column label="基地名称" align="center" prop="parkName" />
      <!-- <el-table-column label="地块编码" align="center" prop="plotCode" /> -->
      <el-table-column label="地块名称" align="center" prop="parkDname" />

      <el-table-column label="通道编码" align="center" prop="channelId" />
      <el-table-column label="设备编号" align="center" prop="yyRemarks" />
      <!-- <el-table-column label="设备id" align="center" prop="equipmentCode" /> -->
      <!-- <el-table-column label="备用一" align="center" prop="reserveOne" />
      <el-table-column label="备用二" align="center" prop="reserveTwo" />
      <el-table-column label="备用三" align="center" prop="reserveThree" /> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="操作" align="center" width='200px'>
        <template #default="scope" >
          <el-button
            link
            type="primary"
            @click="openForm('details', scope.row.id)"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['yyang:equipment-data:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['yyang:equipment-data:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <EquipmentDataForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'
import EquipmentDataForm from './EquipmentDataForm.vue'
//导入设备分类
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
//导入基地列表
import {ParkInfoApi} from "@/api/agriculture/parkinfo";
import {useRoute} from 'vue-router'
import {defineProps} from 'vue'
// import {defineExpose} from 'vue'
// let props=defineExpose({
//   currCategory:''
// })
// watch(()=>props.currCategory,(oldVal,newVal)=>{
//   console.log(oldVal,'oldVal')
//   console.log(newVal,'newVal')
// })
/** 设备数据 列表 */
defineOptions({ name: 'EquipmentData' })


const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<EquipmentDataVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentCode: undefined,
  collectionType: undefined,
  monitoringType: undefined,
  dataValue: undefined,
  yyUnit: undefined,
  collectionTime: [],
  baseCode: undefined,
  plotCode: undefined,
  channelId: undefined,
  yyRemarks: undefined,
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  deviceName: undefined,
  parkName: undefined,
  parkDname: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const props = defineProps({
  // todo (zhangyu26, 2024-03-26 15:19:17) : currCategory, 暂时没用
  currCategory: {
    type: Object,
    default: () => ({})
  },
  collectionType:{
    type:Object
  },
  isCollapse: {
    type: Boolean,
    default: false
  },
},
)
// 监听父组件category变化
watch(() => props.currCategory,
  () => {
    if (props.currCategory) {
      if (props.currCategory.parkId === undefined) {
        queryParams.baseCode = props.currCategory.id
        queryParams.plotCode = undefined
      } else {
        queryParams.baseCode = undefined
        queryParams.plotCode = props.currCategory.id
      }
    } else {
      queryParams.baseCode = undefined
      queryParams.plotCode = undefined
    }
    handleQuery()
  })

//监听父组件isCollapse变化
const isCollapse2=ref(false)
watch(()=>props.isCollapse,(val)=>{
  console.log(val,'1234isCollapse')
  isCollapse2.value=val
})
/**
 * 设备分类级联选择器
 */

//  let categoryOptions = ref([])// 设备分类选项
//  const categoryProps = {
//   value: 'id',
//   label: 'categoryName'
// }

// /** 初始化 **/
// onMounted(async () => {
//   categoryOptions.value = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
//   await getList()
// })
const emit=defineEmits(['clearTree'])
//存放监测类型
let selectEquipmentType=ref([])
//存放基地信息
let selectBase =ref([])
//存放采集类型
let selectCollectionType=ref([])
//查询上方列表
const queryList=async ()=>{
  const dataId = await DeviceCategoryApi.getDeviceCategoryList({categoryName:'监测设备'})
  // console.log(dataId,"dataId");
  selectEquipmentType.value = await DeviceCategoryApi.getDeviceCategoryList({parentId : dataId[0].id})
  // console.log(selectEquipmentType,"selectEquipmentType");
  const selectBaseList= await ParkInfoApi.getParkInfoPage({});
  selectBase.value = selectBaseList.list
}
queryList()
//查询采集类型列表
const queryType= async ()=>{
  if(queryParams.collectionType){
  queryParams.monitoringType=undefined
  selectCollectionType.value = await EquipmentDataApi.getCollectionType(queryParams.collectionType);
  // console.log(selectCollectionType,"selectCollectionType");
  }
}
watch(
  () => queryParams.collectionType, // 监听 queryParams.collectionType 的变化
  (newVal, oldVal) => {
    if (newVal !== oldVal) { // 确保值确实发生了变化
      queryType()
    }
  },
  { immediate: false, deep: false } // 立即执行和深度监听选项，根据你的需求进行调整
);

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await EquipmentDataApi.getEquipmentDataPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
if(props.collectionType){
  queryParams.collectionType=props.collectionType.collectionType
  getList()
}
/** 搜索按钮操作 */
const handleQuery = () => {
  if(queryParams.collectionTime == null){
    queryParams.collectionTime = undefined
  }
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  emit('clearTree')
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const router = useRouter()
const openForm = (type: string, id?: number) => {
  if(type=='create') {
    router.push('/internetMonitor/deviceData/equipmentdata/CreateOrUpdateEquipmentData')
  }else{
    router.push('/internetMonitor/deviceData/equipmentdata/CreateOrUpdateEquipmentData?type='+type+'&id='+id)
  }
  //formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await EquipmentDataApi.deleteEquipmentData(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await EquipmentDataApi.exportEquipmentData(queryParams)
    download.excel(data, '设备数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

let route=useRoute()

/** 初始化 **/
onMounted(() => {
  let location = route.query
  console.log(window.innerWidth,'123456innerwidth')
  if (location) {
    queryParams.collectionType = location.collectionType
  }
  getList()
})
</script>
<style lang="scss" scoped>
@media screen and (min-width:1450px) {
  .el-form{
    .el-select{
      width: 230px !important;
    }
    .el-input{
      width: 230px !important;
    }
    .el-date-picker{
      width: 160px !important;
    }
  }
}
@media screen and (max-width:1358px) { 
  .el-form{
    .el-select{
      width: 230px !important;
    }
    .el-input{
      width: 230px !important;
    }
  }
  
}
</style>
