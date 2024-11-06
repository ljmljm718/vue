<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      :show-labels="['分类编码','分类名称']"
    >
      <!--      <el-form-item label="父结点id" prop="parentId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.parentId"-->
      <!--          placeholder="请输入父结点id（第一级父结点是0，自关联字段id）"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-row>
        <el-form-item label="分类编码" prop="categoryCode">
          <el-input
            v-model="queryParams.categoryCode"
            placeholder="请输入分类编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="queryParams.categoryName"
            placeholder="请输入分类名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="分类标签" prop="categoryLabel">
          <el-input
            v-model="queryParams.categoryLabel"
            placeholder="请输入分类标签"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <!--      <el-form-item label="是否显示" prop="showStatus">-->
        <!--        <el-select-->
        <!--          v-model="queryParams.showStatus"-->
        <!--          placeholder="请选择是否显示"-->
        <!--          clearable-->
        <!--          class="!w-240px"-->
        <!--        >-->
        <!--          <el-option-->
        <!--            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"-->
        <!--            :key="dict.value"-->
        <!--            :label="dict.label"-->
        <!--            :value="dict.value"-->
        <!--          />-->
        <!--        </el-select>-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="创建时间" prop="createTime">-->
        <!--        <el-date-picker-->
        <!--          v-model="queryParams.createTime"-->
        <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
        <!--          type="daterange"-->
        <!--          start-placeholder="开始日期"-->
        <!--          end-placeholder="结束日期"-->
        <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
        <!--          class="!w-240px"-->
        <!--        />-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="部门id" prop="deptId">-->
        <!--        <el-input-->
        <!--          v-model="queryParams.deptId"-->
        <!--          placeholder="请输入部门id"-->
        <!--          clearable-->
        <!--          @keyup.enter="handleQuery"-->
        <!--          class="!w-240px"-->
        <!--        />-->
        <!--      </el-form-item>-->
        <!--      <el-form-item label="用户id" prop="userId">-->
        <!--        <el-input-->
        <!--          v-model="queryParams.userId"-->
        <!--          placeholder="请输入用户id"-->
        <!--          clearable-->
        <!--          @keyup.enter="handleQuery"-->
        <!--          class="!w-240px"-->
        <!--        />-->
        <!--      </el-form-item>-->
        <el-form-item>
          <el-button @click="handleQuery" type="primary">
            <Icon icon="ep:search" class="mr-5px"/>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:device-category:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:device-category:export']"
          >
            <Icon icon="ep:download" class="mr-5px"/>
            导出
          </el-button>
          <el-button type="danger" plain @click="toggleExpandAll">
            <Icon icon="ep:sort" class="mr-5px"/>
            展开/折叠
          </el-button>
        </el-form-item>
      </el-row>
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-key="id"
      :default-expand-all="isExpandAll"
      v-if="refreshTable"
      :row-class-name="tableRowClassName"
    >
      <!--      <el-table-column label="id主键" align="center" prop="id" />-->
      <!--      <el-table-column label="父结点" align="center" prop="parentId" />-->
      <el-table-column label="分类名称" align="left" prop="categoryName"/>
      <el-table-column label="分类编码" align="left" prop="categoryCode" width="160"/>
      <el-table-column label="分类标签" align="center" prop="categoryLabel"/>
      <el-table-column label="是否显示" align="center" prop="showStatus" width="140">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_INTEGER_STRING" :value="scope.row.showStatus"/>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="分类排序" align="center" prop="categorySort" width="120"/>
      <el-table-column label="监测属性" align="center" prop="monitor" width="160">
        <template #default="scope">
          <span>{{scope.row.monitor == undefined || scope.row.monitor == null ? "无" : scope.row.monitor}}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="图片" align="center" prop="imgId" />-->
      <el-table-column label="描述" align="center" prop="description"/>
      <!--      <el-table-column label="部门id" align="center" prop="deptId" />-->
      <!--      <el-table-column label="用户id" align="center" prop="userId" />-->
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            v-if = ids.includes(scope.row.id)
            link
            type="primary"
            @click="router.push('/internetMonitor/deviceData/monitoring-threshold')"
          >
            监测阈值配置
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:device-category:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:device-category:delete']"
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
  <DeviceCategoryForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import {handleTree} from '@/utils/tree'
import download from '@/utils/download'
import {DeviceCategoryApi, DeviceCategoryVO} from '@/api/agriculture/devicecategory'
import DeviceCategoryForm from './DeviceCategoryForm.vue'
import router from '@/router'

/** 鲁渝协作设备分类 列表 */
defineOptions({name: 'DeviceCategory'})
//监测阈值配置
const ids = [100,103,104];
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DeviceCategoryVO[]>([]) // 列表的数据
const queryParams = reactive({
  parentId: undefined,
  categoryCode: undefined,
  categoryName: undefined,
  categoryLabel: undefined,
  showStatus: undefined,
  categorySort: undefined,
  createTime: [],
  imgId: undefined,
  description: undefined,
  deptId: undefined,
  userId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceCategoryApi.getDeviceCategoryList(queryParams)
    list.value = handleTree(data, 'id', 'parentId')
    console.log("list.value", list.value)
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
    await DeviceCategoryApi.deleteDeviceCategory(id)
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
    const data = await DeviceCategoryApi.exportDeviceCategory(queryParams)
    download.excel(data, '鲁渝协作设备分类.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 展开/折叠操作 */
const isExpandAll = ref(false) // 是否展开，默认全部展开
const refreshTable = ref(true) // 重新渲染表格状态
const toggleExpandAll = async () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  await nextTick()
  refreshTable.value = true
}

// 表格行颜色
const tableRowClassName = ({row}: { row: DeviceCategoryVO, rowIndex: number }) => {
  if (row.parentId === 0) {
    return 'primary-row'
  } else {
    return 'success-row'
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
