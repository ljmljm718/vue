<template>
  <Dialog
    title="选择设备"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1150"
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
        <el-form-item label="种类" prop="kinds">
          <el-select
            v-model="queryParams.kinds"
            placeholder="请选择种类"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_KINDS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select
            v-model="queryParams.deviceType"
            placeholder="请先选择种类"
            clearable
            class="!w-240px"
            :disabled="queryParams.kinds === undefined"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_TYPE).filter(item => item.value.toString().substring(0,6) === queryParams.kinds)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="设备号" align="center" prop="deviceCode" />
        <el-table-column label="名称" align="center" prop="deviceName" />
        <el-table-column label="种类" align="center" prop="kinds">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_KINDS" :value="scope.row.kinds" />
          </template>
        </el-table-column>
        <el-table-column label="设备类型" align="center" prop="deviceType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_TYPE" :value="scope.row.deviceType" />
          </template>
        </el-table-column>
<!--        <el-table-column label="经度" align="center" prop="longitude" />-->
<!--        <el-table-column label="纬度" align="center" prop="latitude" />-->
        <el-table-column label="状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus" />
          </template>
        </el-table-column>
        <el-table-column label="所属基地" align="center" prop="belongPark" />
        <el-table-column label="基地名称" align="center" prop="url" />
        <el-table-column label="所属地块" align="center" prop="belongPlot" />
        <el-table-column label="地块名称" align="center" prop="remark" />
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
      <el-button :disabled="!selectionList.length" type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { ElTable } from 'element-plus'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {WarningRecordApi, DeviceBaseVO} from "@/api/kaizhou/warningrecord";

defineOptions({ name: 'SelectDevice' })

const list = ref<DeviceBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceCode: undefined,
  deviceName: undefined,
  kinds: undefined,
  deviceType: undefined,
  longitude: undefined,
  latitude: undefined,
  deviceStatus: '',
  belongPark: undefined,
  belongPlot: undefined,
  url: undefined,
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<DeviceBaseVO[]>([])
const handleSelectionChange = (rows: DeviceBaseVO[]) => {
  selectionList.value = rows
}

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  await nextTick() // 等待，避免 queryFormRef 为空
  await resetQuery()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: DeviceBaseVO[]): void
}>()
const submitForm = () => {
  try {
    console.log("selectionList.value", selectionList.value)
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false

  }
}

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarningRecordApi.getDeviceBasePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  selectionList.value = []
  getList()
}
</script>
