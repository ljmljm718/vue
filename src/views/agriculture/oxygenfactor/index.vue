<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="78px"
    >
      <el-form-item label="因素名称" prop="factorName">
        <el-input
          v-model="queryParams.factorName"
          placeholder="请输入因素名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="因素编码" prop="factorCode">
        <el-input
          v-model="queryParams.factorCode"
          placeholder="请输入因素编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="数据库名称" prop="nameDatabase">
        <el-input
          v-model="queryParams.nameDatabase"
          placeholder="请输入数据库名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="影响指标" prop="impactIndicator">
        <el-input
          v-model="queryParams.impactIndicator"
          placeholder="请输入影响指标"
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
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:oxygen-factor:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:oxygen-factor:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="因素名称" align="center" prop="factorName" />
      <el-table-column label="因素编码" align="center" prop="factorCode" />
      <el-table-column label="数据库名称" align="center" prop="nameDatabase" />
      <el-table-column label="影响指标" align="center" prop="impactIndicator" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="设备关联" align="center" width="200px">
        <template #default="scope">
         
            <el-button
            plain
            type="primary"
            @click="deviceForm('deviceForm',scope.row)"
            style="border:1px solid"
            v-hasPermi="['agriculture:oxygen-factor:delete']"
          >
          <Icon icon="ep:plus" class="mr-5px" size='10' />绑定设备
          </el-button>
          <el-button
            link
            type="danger"
            @click="deviceForm('drawerList',scope.row)"
            class="!color-[#67c23a] !bdDevice !px-7px !py-6px"
            style="border:1px solid #67c23a"
            v-hasPermi="['agriculture:oxygen-factor:delete']"
          >
          已绑定设备
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:oxygen-factor:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:oxygen-factor:delete']"
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
  <OxygenFactorForm ref="formRef" @success="getList" />
  <!-- 关联设备弹窗 -->
  <deviceAssociation ref="formDevice"  @success="getList()"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OxygenFactorApi, OxygenFactorVO } from '@/api/agriculture/oxygenfactor'
import OxygenFactorForm from './OxygenFactorForm.vue'
import deviceAssociation from './deviceAssociation.vue'
/** 溶解氧因素 列表 */
defineOptions({ name: 'OxygenFactor' })
//因素名称 设备编号 设备名称 基地编号 地块编号
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OxygenFactorVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  factorName: undefined,
  factorCode: undefined,
  nameDatabase: undefined,
  remark: undefined,
  impactIndicator: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OxygenFactorApi.getOxygenFactorPage(queryParams)
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
    await OxygenFactorApi.deleteOxygenFactor(id)
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
    const data = await OxygenFactorApi.exportOxygenFactor(queryParams)
    download.excel(data, '溶解氧因素.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
// 绑定设备 已绑定设备
const formDevice=ref()
const deviceForm=( val,item)=>{
  val=='deviceForm'? formDevice.value.open(item):formDevice.value.drawerList(item)
 
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.bdDevice::hover{
  color:#fff  !important;
  background-color: #67c23a !important; 
}
</style>