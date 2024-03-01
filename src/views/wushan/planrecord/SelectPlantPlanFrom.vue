<template>
  <Dialog :title="dialogTitle" v-model="SelectShow">
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      ref="tableRef"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      highlight-current-row
    >
      <el-table-column label="计划编码" align="center" prop="plantCode" width="200" />
      <el-table-column label="园区名称" align="center" prop="parkName" />
      <el-table-column label="地块名称" align="center" prop="plotName" />
      <el-table-column label="种植作物品种名称" align="center" prop="plantVariety" width="200" />
      <el-table-column label="类别" align="center" prop="plantCategory" />
      <el-table-column label="状态" align="center" prop="plantStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.plantStatus" />
        </template>
      </el-table-column>
      <el-table-column label="面积" align="center" prop="area" width="100" />
      <el-table-column label="负责人" align="center" prop="plantPerson" width="100" />
      <el-table-column
        label="种植开始时间"
        align="center"
        prop="plantStarttime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="种植结束时间"
        align="center"
        prop="plantEndtime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { PlantPlanApi, PlantPlanVO } from '@/api/kaizhou/plantplan'
import PlantPlanForm from './PlantPlanForm.vue'
import { ref, emit,reactive } from 'vue';



/** 种植计划 表单 */
defineOptions({ name: 'PlantPlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const SelectShow = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parkId: '1',
  parkName: undefined,
  plotId: '1',
  plotName: undefined,
  plantVariety: undefined,
  plantCategory: undefined,
  plantStatus: undefined,
  area: undefined,
  plantPerson: undefined,
  plantStarttime: undefined,
  plantEndtime: undefined,
  cropId: '1',
  plantCode: undefined
})
const formRules = reactive({
  parkName: [{ required: true, message: '园区名称不能为空', trigger: 'blur' }],
  plotName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
  plantVariety: [{ required: true, message: '种植作物品种名称不能为空', trigger: 'blur' }],
  plantCategory: [{ required: true, message: '类别不能为空', trigger: 'blur' }],
  plantStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  area: [{ required: true, message: '面积不能为空', trigger: 'blur' }],
  plantStarttime: [{ required: true, message: '种植开始时间不能为空', trigger: 'blur' }],
  plantEndtime: [{ required: true, message: '种植结束时间不能为空', trigger: 'blur' }]
  // cropId: [{ required: true, message: '作物id不能为空', trigger: 'blur' }],
  // plantCode: [{ required: true, message: '计划编码不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  SelectShow.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PlantPlanApi.getPlantPlan(id)
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
    const data = formData.value as unknown as PlantPlanVO
    if (formType.value === 'create') {
      await PlantPlanApi.createPlantPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await PlantPlanApi.updatePlantPlan(data)
      message.success(t('common.updateSuccess'))
    }
    SelectShow.value = false
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
    parkId: undefined,
    parkName: undefined,
    plotId: undefined,
    plotName: undefined,
    plantVariety: undefined,
    plantCategory: undefined,
    plantStatus: undefined,
    area: undefined,
    plantPerson: undefined,
    plantStarttime: undefined,
    plantEndtime: undefined,
    cropId: undefined,
    plantCode: undefined
  }
  formRef.value?.resetFields()
}

  

/** 种植计划 列表 */
defineOptions({ name: 'PlantPlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PlantPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  parkId: undefined,
  parkName: undefined,
  plotId: undefined,
  plotName: undefined,
  plantVariety: undefined,
  plantCategory: undefined,
  plantStatus: undefined,
  area: undefined,
  plantPerson: undefined,
  plantStarttime: [],
  plantEndtime: [],
  cropId: undefined,
  createTime: [],
  plantCode: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PlantPlanApi.getPlantPlanPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PlantPlanApi.deletePlantPlan(id)
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
    const data = await PlantPlanApi.exportPlantPlan(queryParams)
    download.excel(data, '种植计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

// 假设你的组件有以下响应式数据  
const selectedItem = ref(null);  
const SelectShow = ref(false);  
  
// 假设你有一个引用到表格的 ref  
const tableRef = ref(null);  
  
// 提交选中的公园信息  
const submitCheckedPark = () => {  
  if (!selectedItem.value) {  
    return;  
  }  
  emit('setCheckedParkInfo', selectedItem.value);  
  tableRef.value.setCurrentRow();  
  SelectShow.value = false;  
}  
  
// 关闭公园管理助手  
const closeParkManageHelper = () => {  
  tableRef.value.setCurrentRow();  
  SelectShow.value = false;  
}  
</script>
