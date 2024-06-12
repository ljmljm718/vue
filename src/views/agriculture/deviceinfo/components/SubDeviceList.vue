<template>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
<!--      <el-table-column label="子设备编号" align="center" prop="subDevicesNum"/>-->
      <el-table-column label="子设备名称" align="center" prop="subDevicesName"/>
<!--      <el-table-column label="所属设备" align="center" prop="devicesId"/>-->
      <el-table-column label="开关状态" align="center" prop="swithState">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                     @change="handleSwitchChange(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="所属设备点位" align="center" prop="remark"/>
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:sub-device:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:sub-device:delete']"
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
  <SubDeviceForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import {SubDeviceApi, SubDeviceVO} from '@/api/agriculture/subdevice'
import {useRoute} from "vue-router";
import SubDeviceForm from "@/views/agriculture/subdevice/SubDeviceForm.vue";

let route = useRoute();
/** 子设备管理 列表 */
defineOptions({name: 'SubDeviceList'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
// 定义属性
const props = defineProps<{
  deviceId: undefined // 主表（主表的关联字段）
}>()
const loading = ref(true) // 列表的加载中
const list = ref<SubDeviceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  subDevicesNum: undefined,
  devicesId: undefined,
  subDevicesName: undefined,
  swithState: undefined,
  remark: undefined,
  createTime: [],
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  queryParams.devicesId = props.deviceId
  console.log("deviceid",props.deviceId )
  try {
    const data = await SubDeviceApi.getSubDevicePage(queryParams)
    list.value = data.list.map(item => ({...item, status: item.swithState === '0'}))
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
    await SubDeviceApi.deleteSubDevice(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

const handleSwitchChange = async (item) => {
  message.success(t('操作成功'))
  try {
    await SubDeviceApi.updateSubDevice({
      ...item, swithState: item.swithState === '0' ? '1' : '0'
    })
  } catch {
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
