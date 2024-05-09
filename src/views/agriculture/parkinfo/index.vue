<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create', 0)"
          v-hasPermi="['agriculture:park-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:park-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="parkDetail">
            <el-tab-pane label="地块基本信息" name="parkDetail">
              <ParkDetailList :park-id="scope.row.id"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center" prop="code" width="200"/>
      <el-table-column label="名称" align="center" prop="name" width="150"/>
      <el-table-column label="类型" align="center" prop="categoryName" width="150"/>
      <el-table-column label="海拔" align="center" prop="altitude" width="100">
        <template #default="scope">
          {{ scope.row.altitude != undefined ? scope.row.altitude + '米' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="纬度" align="center" prop="latitude"/>
      <el-table-column label="经度" align="center" prop="longitude"/>
      <el-table-column label="通讯地址" align="center" prop="address"/>
      <el-table-column label="联系人" align="center" prop="contact"/>
      <el-table-column label="联系电话" align="center" prop="tel"/>
      <el-table-column label="面积" align="center" prop="area" width="100">
        <template #default="scope">
          {{ scope.row.area != undefined ? scope.row.area + '亩' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="quantity" width="100">
        <template #default="scope">
          {{ scope.row.quantity != undefined ? scope.row.type === "chicken" ? scope.row.quantity + '只' : scope.row.quantity + '株' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center" prop="remark"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:park-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:park-info:delete']"
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
  <ParkInfoForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {ParkInfoApi, ParkInfoVO} from '@/api/agriculture/parkinfo'
import ParkInfoForm from './ParkInfoForm.vue'
import ParkDetailList from './components/ParkDetailList.vue'
import {DICT_TYPE} from "@/utils/dict";

/** 基地基本信息 列表 */
defineOptions({name: 'ParkInfo'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ParkInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  type: undefined,
  altitude: undefined,
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  contact: undefined,
  tel: undefined,
  area: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined,
  quantity: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ParkInfoApi.getParkInfoPage(queryParams)
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
    await ParkInfoApi.deleteParkInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ParkInfoApi.exportParkInfo(queryParams)
    download.excel(data, '基地基本信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
