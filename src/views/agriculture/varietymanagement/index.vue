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
      <el-form-item label="品种名称" prop="varietyName">
        <el-input
          v-model="queryParams.varietyName"
          placeholder="请输入品种名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品种编码" prop="varietyCode">
        <el-input
          v-model="queryParams.varietyCode"
          placeholder="请输入品种编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品类名称" prop="categoryId">
        <el-select v-model="queryParams.categoryId" clearable placeholder="请选择品类" class="!w-240px">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="品种来源" prop="categorySource">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.categorySource"-->
      <!--          placeholder="请输入品种来源"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="品种特征" prop="categoryStigma">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.categoryStigma"-->
      <!--          placeholder="请输入品种特征"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="分布地区" prop="areaDistribution">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.areaDistribution"-->
      <!--          placeholder="请输入分布地区"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="简介" prop="briefIntroduction">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.briefIntroduction"-->
      <!--          placeholder="请输入简介"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="是否启用" prop="status">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.status"-->
      <!--          placeholder="请选择启用停用"-->
      <!--          clearable-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option label="请选择字典生成" value="" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
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
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>

      </el-form-item>
      <div style="margin-top: 20px;margin-left: 30px;height: 30px">
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:variety-management:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:variety-management:export']"
          >
            <Icon icon="ep:download" class="mr-5px"/>
            导出
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id"/>-->
      <el-table-column label="品种名称" align="center" prop="varietyName"/>
<!--      <el-table-column label="品类ID" align="center" prop="categoryId"/>-->
      <el-table-column label="品类名称" align="center" prop="categoryName"/>
      <el-table-column label="品种编码" align="center" prop="varietyCode"/>
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
      <el-table-column label="品种来源" align="center" prop="categorySource"/>
      <el-table-column label="品种特征" align="center" prop="categoryStigma"/>
      <el-table-column label="分布地区" align="center" prop="areaDistribution"/>
      <el-table-column label="简介" align="center" prop="briefIntroduction"/>
      <el-table-column label="启用停用" align="center" prop="status">
        <template #default="{ row }">
          <span v-if="row.status == '1'">启用</span>
          <span v-if="row.status == '2'">停用</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="备注1" align="center" prop="remark2" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:variety-management:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:variety-management:delete']"
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
  <VarietyManagementForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {VarietyManagementApi, VarietyManagementVO} from '@/api/agriculture/varietymanagement'
import VarietyManagementForm from './VarietyManagementForm.vue'
import {CategoryManagementApi, CategoryManagementVO, allDataCacheManager } from "@/api/agriculture/categorymanagement";

/** 品种管理 列表 */
defineOptions({name: 'VarietyManagement'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<VarietyManagementVO[]>([]) // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  varietyName: undefined,
  varietyCode: undefined,
  images: undefined,
  categoryId: undefined,
  categorySource: undefined,
  categoryStigma: undefined,
  areaDistribution: undefined,
  briefIntroduction: undefined,
  status: undefined,
  remark2: undefined,
  createTime: []
})
const CategoryManagementQueryParams = reactive({})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams)
    const data = await VarietyManagementApi.getVarietyManagementPage(queryParams)
    list.value = data.list
    // list.value.forEach(item=>{
    //   listCategoryManagement.value.forEach(itm=>{
    //     if(item.categoryId==itm.id) item.categoryId=itm.categoryName
    //   })
    // })
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
    await VarietyManagementApi.deleteVarietyManagement(id)
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
    const data = await VarietyManagementApi.exportVarietyManagement(queryParams)
    download.excel(data, '品种管理.xls')
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
