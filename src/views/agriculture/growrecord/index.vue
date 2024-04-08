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
      <!--      <el-form-item label="品种code" prop="cropCode">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.cropCode"-->
      <!--          placeholder="请输入品种code"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="品种" prop="cropType">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.cropType"-->
      <!--          placeholder="请选择品种"-->
      <!--          clearable-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"-->
      <!--            :key="dict.value"-->
      <!--            :label="dict.label"-->
      <!--            :value="dict.value"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="所属基地" prop="base">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.base"-->
      <!--          placeholder="请输入所属基地"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="所属地块" prop="massif">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.massif"-->
      <!--          placeholder="请输入所属地块"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="测量时间" prop="measureTime">
        <el-date-picker
          v-model="queryParams.measureTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="测量者" prop="measurer">
        <el-input
          v-model="queryParams.measurer"
          placeholder="请输入测量者"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="测量类型" prop="measureType">
        <el-select
          v-model="queryParams.measureType"
          placeholder="请选择测量类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_GROW_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          @click="openForm('create')"
          v-hasPermi="['agriculture:grow-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:grow-record:export']"
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
      <el-table-column label="品种code" align="center" prop="cropCode"/>
      <el-table-column label="品种名称" align="center" prop="cropName"/>
      <el-table-column label="品种" align="center" prop="cropType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="scope.row.cropType"/>
        </template>
      </el-table-column>
      <el-table-column label="所属基地" align="center" prop="base"/>
      <!--      <el-table-column label="基地名称" align="center" prop="baseName"/>-->
      <el-table-column label="所属地块" align="center" prop="massif"/>
      <!--      <el-table-column label="地块名称" align="center" prop="massifName"/>-->
      <el-table-column
        label="测量时间"
        align="center"
        prop="measureTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="测量者" align="center" prop="measurer"/>
      <el-table-column label="测量类型" align="center" prop="measureType"/>
      <el-table-column label="测量值" align="center" prop="measureNum"/>
      <el-table-column label="变化量" align="center" prop="measureSpike"/>
      <el-table-column label="测量单位" align="center" prop="measureUnit"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
      <!--      <el-table-column label="主键ID" align="center" prop="id"/>-->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:grow-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:grow-record:delete']"
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
  <GrowRecordForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {GrowRecordApi, GrowRecordVO} from '@/api/agriculture/growrecord'
import GrowRecordForm from './GrowRecordForm.vue'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";

/** 长势管理 列表 */
defineOptions({name: 'GrowRecord'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<GrowRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  base: undefined,
  baseName: undefined,
  massif: undefined,
  massifName: undefined,
  measureTime: [],
  measurer: undefined,
  measureType: undefined,
  measureNum: undefined,
  measureSpike: undefined,
  measureUnit: undefined,
  createTime: [],
  remark: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await GrowRecordApi.getGrowRecordPage(queryParams)
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
    await GrowRecordApi.deleteGrowRecord(id)
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
    const data = await GrowRecordApi.exportGrowRecord(queryParams)
    download.excel(data, '长势管理.xls')
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
