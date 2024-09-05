<!-- 设备列表 -->
<template>
  <Dialog
    title="绑定设备"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1250"
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
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input
            v-model="queryParams.deviceCode"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
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
<!--        <el-form-item label="所属基地" prop="belongPark">-->
<!--          <el-input-->
<!--            v-model="queryParams.belongPark"-->
<!--            placeholder="请输入所属基地"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--            class="!w-240px"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="所属地块" prop="belongPlot">-->
<!--          <el-input-->
<!--            v-model="queryParams.belongPlot"-->
<!--            placeholder="请输入所属地块"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--            class="!w-240px"-->
<!--          />-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table ref="dialogTable" v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true"
                :row-key="getRowKeys" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="30" label="选择" :reserve-selection="true"/>
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
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="纬度" align="center" prop="latitude" />
        <el-table-column label="状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus" />
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="imgId" >
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
        <el-table-column label="所属基地" align="center" prop="belongPark" />
        <el-table-column label="所属地块" align="center" prop="belongPlot" />
<!--        <el-table-column label="备注" align="center" prop="remark" />-->
<!--        <el-table-column-->
<!--          label="创建时间"-->
<!--          align="center"-->
<!--          prop="createTime"-->
<!--          :formatter="dateFormatter"-->
<!--          width="180px"-->
<!--        />-->
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button type="primary" @click="handleBindDevice">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import { DeviceInfoApi, DeviceInfoVO } from '@/api/agriculture/deviceinfo'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {DeviceCategoryApi} from "@/api/agriculture/devicecategory";
import { AgriWarningRuleDeviceApi } from "@/api/agriculture/agriwarningruledevice";
import {createEmptyNewsItem, NewsItem} from "@/views/mp/draft/components";

defineOptions({name: 'AgriWarnRuleBindDevice'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps({
  warnRuleId: {
    type: String,
    default: ''
  },
  deviceId: {
    type: Array,
    default: () => []
  },
  currCategory: {
    type: Object,
    default: () => ({})
  },
})// 绑定的规则id
const ids = ref([]) // 绑定的设备id
const list = ref<DeviceInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
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
  userId: undefined
})
const queryFormRef = ref() // 搜索的表单

const multipleSelection: any = ref([])
let categoryOptions = ref([])// 设备分类选项
const deviceType = ref()

const open = async (id: string) => {
  dialogVisible.value = true
  console.log("id:"+ id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


/** 加载列表  */
const dialogTable = ref()
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceInfoApi.getDeviceInfoPage(queryParams)
    list.value = data.list.map((item: any) => {
      item.deviceType = item.deviceType.split(',').map(Number)
      return item;
    })
    list.value.forEach(row => {
      if (Array.isArray(props.deviceId)) props.deviceId.forEach(ele => {
        if (row.deviceCode == ele) dialogTable.value.toggleRowSelection(row, true)
      })
    })

    total.value = data.total
    multipleSelection.value = props.deviceId
  } finally {
    loading.value = false
  }
}

//选中的list
const getRowKeys = (row) => {
  //记录每行的key值
  return row.id;
}

//当表格选择项发生变化时会触发该事件
const handleSelectionChange = (val) => {
  // 解决来回切换页面，也无法清除上次选中情况
  multipleSelection.value = val;
  ids.value = [];
  if (val) {
    undefined;
    val.forEach((row) => {
      undefined;
      if (row) {
        undefined;
        ids.value.push(row.id);
      }
    });
  }
}

/**
 * 设备分类级联选择器
 */
const categoryProps = {
  value: 'id',
  label: 'categoryName'
}

/** 初始化 **/
onMounted(async () => {
  categoryOptions.value = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
  await getList()
})

// 监听父组件category变化
watch(() => props.currCategory,
  () => {
    if (props.currCategory) {
      if (props.currCategory.parentId === 0) {
        queryParams.deviceType = props.currCategory.id
      }else{
        queryParams.deviceType = props.currCategory.parentId + "," + props.currCategory.id
      }
    }else {
      queryParams.deviceType = undefined
    }
    handleQuery()
  })

/** 确认绑定设备  */

// v-model=newsList
const emit = defineEmits(["bind"])
const handleBindDevice = async () => {
  loading.value = true
  try {
    const temp = {warnRuleId: props.warnRuleId, deviceId: ids.value}
    const data = temp as any
    await AgriWarningRuleDeviceApi.AgriWarnRuleBindDevice(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    emit("bind")
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

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  if (deviceType.value != null && deviceType.value != undefined){
    queryParams.deviceType = deviceType.value.join(",")
  }
  getList()
}
</script>
