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
      <el-form-item label="品类名称" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入品类名称hahahahh"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品类编码" prop="categoryCode">
        <el-input
          v-model="queryParams.categoryCode"
          placeholder="请输入品类编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="门类" prop="phylum">
        <el-input
          v-model="queryParams.phylum"
          placeholder="请输入门类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="科类" prop="family">
        <el-input
          v-model="queryParams.family"
          placeholder="请输入科类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="属类" prop="genus">
        <el-input
          v-model="queryParams.genus"
          placeholder="请输入属类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="图片" prop="images">
        <el-input
          v-model="queryParams.images"
          placeholder="请输入图片"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="简介" prop="briefIntroduction">
        <el-input
          v-model="queryParams.briefIntroduction"
          placeholder="请输入简介"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="备注1" prop="remark1">
        <el-input
          v-model="queryParams.remark1"
          placeholder="请输入备注1"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注2" prop="remark2">
        <el-input
          v-model="queryParams.remark2"
          placeholder="请输入备注2"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
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
        <el-button @click="handleQuery"  type="primary"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>

    <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:category-management:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:category-management:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </div>

  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="品类名称" align="center" prop="categoryName" />
      <el-table-column label="品类编码" align="center" prop="categoryCode" min-width="140"/>
      <el-table-column label="门类" align="center" prop="phylum" />
      <el-table-column label="科类" align="center" prop="family" />
      <el-table-column label="属类" align="center" prop="genus" />
      <!-- <el-table-column label="图片" align="center" prop="images" /> -->
      <el-table-column label="图片" align="center" prop="images">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.images"
            :preview-src-list="[row.images]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center" prop="briefIntroduction" />
      <!-- <el-table-column label="备注1" align="center" prop="remark1" />
      <el-table-column label="备注2" align="center" prop="remark2" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:category-management:update']"
          >
            编辑
          </el-button>

          <el-button
            link
            type="primary"
            @click="openForm('select', scope.row.id, true)"
          >
            详情
          </el-button>

          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:category-management:delete']"
          >
            删除
          </el-button>
          
          <el-button
            link
            type="primary"
            @click="goGrowthCycle(scope.row.id)"
            v-hasPermi="['agriculture:category-management:update']"
          >
            生长周期
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
  <CategoryManagementForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CategoryManagementApi, CategoryManagementVO } from '@/api/agriculture/categorymanagement'
import CategoryManagementForm from './CategoryManagementForm.vue'

import router from "@/router"


/** 品类管理 列表 */
defineOptions({ name: 'CategoryManagement' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CategoryManagementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  categoryName: undefined,
  categoryCode: undefined,
  phylum: undefined,
  family: undefined,
  genus: undefined,
  images: undefined,
  briefIntroduction: undefined,
  remark1: undefined,
  remark2: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CategoryManagementApi.getCategoryManagementPage(queryParams)
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
// 生长周期按钮操作
const goGrowthCycle = ( id: number) =>{

  // console.log('id',id)
  router.push({ path:'/growthCycle', query: { cropId: id }})
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 加上字段diable，将详情设为不可更改*/
const formRef = ref()
const openForm = (type: string, id?: number, diable = false) => {
  formRef.value.open(type, id)
  if (diable) formRef.value.turnDisable(true)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CategoryManagementApi.deleteCategoryManagement(id)
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
    const data = await CategoryManagementApi.exportCategoryManagement(queryParams)
    download.excel(data, '品类管理.xls')
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
