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
      <el-form-item label="编号" prop="cropCode">
        <el-input
            v-model="queryParams.cropCode"
            placeholder="请输入编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="名称" prop="cropName">
        <el-input
            v-model="queryParams.cropName"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品种" prop="cropType">
        <el-select
            v-model="queryParams.cropType"
            placeholder="请选择品种"
            clearable
            class="!w-240px"
        >
          <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
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
            v-hasPermi="['agriculture:crop-base:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:crop-base:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="cropCode" />
      <el-table-column label="名称" align="center" prop="cropName" />
      <el-table-column label="品种" align="center" prop="cropType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="scope.row.cropType" />
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
      <el-table-column label="所属基地" align="center" prop="belongPark"/>
      <el-table-column label="所属基地" align="center" prop="parkName"/>
      <el-table-column label="所属地块" align="center" prop="belongPlot" />
      <el-table-column label="所属基地" align="center" prop="plotName"/>
      <el-table-column label="描述" align="center" prop="cropDesc" />
      <el-table-column label="备注" align="center" prop="remark" />
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
              v-hasPermi="['agriculture:crop-base:update']"
          >
            编辑
          </el-button>
          <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:crop-base:delete']"
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
  <CropBaseForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CropBaseApi, CropBaseVO } from '@/api/agriculture/cropbase'
import CropBaseForm from './CropBaseForm.vue'
import ImageTable from "@/views/mp/material/components/ImageTable.vue";

/** 鲁渝协作品种管理 列表 */
defineOptions({ name: 'AgriCropBase' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CropBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  createTime: [],
  belongPark: undefined,
  belongPlot: undefined,
  deptId: undefined,
  userId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CropBaseApi.getCropBasePage(queryParams)
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
    await CropBaseApi.deleteCropBase(id)
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
    const data = await CropBaseApi.exportCropBase(queryParams)
    download.excel(data, '鲁渝协作品种管理.xls')
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
