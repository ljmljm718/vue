<template>
  <Dialog
    title="设备列表"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1300"
  >

    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="设备号" prop="deviceCode">
          <el-input
            v-model="queryParams.deviceCode"
            placeholder="请输入设备号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <!--        <el-form-item label="种类" prop="kinds">-->
        <!--          <el-select-->
        <!--            v-model="queryParams.kinds"-->
        <!--            placeholder="请选择种类"-->
        <!--            clearable-->
        <!--            class="!w-240px"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="dict in categoryOptions"-->
        <!--              :key="dict.id"-->
        <!--              :label="dict.categoryLabel"-->
        <!--              :value="dict.id"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="设备类型" prop="deviceType">
          <el-cascader
            style="width: 100%"
            v-model="deviceType"
            :options="categoryOptions"
            :props="categoryProps"
          />
        </el-form-item>
        <el-form-item label="状态" prop="deviceStatus">
          <el-select
            v-model="queryParams.deviceStatus"
            placeholder="请选择状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属基地" prop="belongPark">
          <el-input
            v-model="queryParams.belongPark"
            placeholder="请输入所属基地"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="所属地块" prop="belongPlot">
          <el-input
            v-model="queryParams.belongPlot"
            placeholder="请输入所属地块"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px"/>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
                ref="multipleTableRef"
                @selection-change="handleSelectionChange" @select="select" @row-click="selectClick">
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="设备编号" align="center" prop="deviceCode" width="200"/>
        <el-table-column label="设备名称" align="center" prop="deviceName" width="150"/>
        <el-table-column label="设备类型" align="center" prop="deviceType" width="200">
          <template #default="scope">
            <el-cascader
              style="width: 100%"
              v-model="scope.row.deviceType"
              :options="categoryOptions"
              :props="categoryProps"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column label="经度" align="center" prop="longitude"/>
        <el-table-column label="纬度" align="center" prop="latitude"/>
        <el-table-column label="状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="imgId">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.imgId"
              :preview-src-list="[row.imgId]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="所属基地" align="center" prop="belongPark" width="200"/>
        <el-table-column label="所属地块" align="center" prop="belongPlot" width="200"/>
        <el-table-column label="位置" align="center" prop="location"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
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
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import {getTenantId} from '@/utils/auth'
import {DeviceBaseApi, DeviceBaseVO} from '@/api/kaizhou/devicebase'
import {DeviceInfoApi, DeviceInfoVO} from "@/api/agriculture/deviceinfo";
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import {retainFirstTwoLayers} from "@/utils/tree";
import {ElTable} from "element-plus";


/** 设备管理 表单 */
defineOptions({name: 'DeviceBaseForm'})
const list = ref<DeviceBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const deviceType = ref()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceCode: undefined,
  deviceName: undefined,
  deviceType: undefined,
  longitude: undefined,
  latitude: undefined,
  deviceStatus: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined,
  location: undefined
})
const parentValue = ref('')
// const formRules = reactive({
//   deviceName: [{required: true, message: '设备名称不能为空', trigger: 'blur'}],
//   belongPlot: [{required: true, message: '所属地块不能为空', trigger: 'blur'}],
//   belongPark: [{required: true, message: '所属园区不能为空', trigger: 'blur'}],
//   kinds: [{required: true, message: '种类不能为空', trigger: 'blur'}],
//   deviceType: [{required: true, message: '设备类型不能为空', trigger: 'blur'}],
// })
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<DeviceBaseVO[]>([])
const handleSelectionChange = (rows: DeviceBaseVO[]) => {
  selectionList.value = rows
}
let categoryOptions = ref([])// 设备分类选项
/**
 * 设备分类级联选择器
 */
const categoryProps = {
  value: 'id',
  label: 'categoryName'
}
/** 初始化 **/
onMounted(async () => {
  const categoryTree = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
  categoryOptions.value = retainFirstTwoLayers(categoryTree)
  console.log("categoryOptions.value", categoryOptions.value)
  await getList()
})

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: DeviceBaseVO[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}


const open = async (id: string) => {
  dialogVisible.value = true
  parentValue.value = id
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗


/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceInfoApi.getDeviceInfoPage(queryParams)
    console.log(data)
    list.value = data.list.map(item => ({
      ...item,
      deviceType: item.deviceType.split(',').map(Number)
    }))
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  deviceType.value = null
  handleQuery()
}
const multipleTableRef = ref()
const select = (selection, row) => {
  // 清除 所有勾选项
  multipleTableRef.value.clearSelection()
  // 当表格数据都没有被勾选的时候 就返回
  // 主要用于将当前勾选的表格状态清除
  if (selection.length == 0) return
  multipleTableRef.value.toggleRowSelection(row, true);
}

// 控制单选——table选择项发生变化时
const selectClick = (row) => {
  const selectData = selectionList.value
  multipleTableRef.value.clearSelection()
  if (selectData.length == 1) {
    selectData.forEach(item => {
      // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
      if (item == row) {
        multipleTableRef.value.toggleRowSelection(row, false);
      }
      // 不然就让当前的一行勾选
      else {
        multipleTableRef.value.toggleRowSelection(row, true);
      }
    })
  } else {
    multipleTableRef.value.toggleRowSelection(row, true);
  }
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  queryParams.id = parentValue.value
  if (deviceType.value != null && deviceType.value != undefined) {
    queryParams.deviceType = deviceType.value.join(",")
  }
  getList()
}
</script>
