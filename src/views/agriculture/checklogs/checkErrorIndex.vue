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
      <el-form-item label="巡检编号" prop="inspectionNum">
        <el-input
          v-model="queryParams.inspectionNum"
          placeholder="请输入巡检编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="巡检状态" prop="inspectionState">
        <el-select
          v-model="queryParams.inspectionState"
          placeholder="请选择巡检状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.CHECK_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="巡检结果" prop="inspectionResults">
        <el-input
          v-model="queryParams.inspectionResults"
          placeholder="请输入巡检结果"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="巡检人" prop="inspector">
        <el-input
          v-model="queryParams.inspector"
          placeholder="请输入巡检人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="巡检时间" prop="inspectionTime">
        <el-date-picker
          v-model="queryParams.inspectionTime"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:check-logs:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:check-logs:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" prefix="right" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="巡检编号" align="center" prop="inspectionNum" width="200"/>
      <el-table-column label="巡检状态" align="center" prop="inspectionState" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CHECK_STATE" :value="scope.row.inspectionState"/>
        </template>
      </el-table-column>
      <el-table-column label="巡检结果状态" align="center" prop="resultState" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CHECK_RESULT_STATE" :value="scope.row.resultState"/>
        </template>
      </el-table-column>
      <el-table-column label="巡检结果" align="center" prop="inspectionResults"/>
      <!--      <el-table-column label="设备" align="center" prop="equNum"/>-->
      <el-table-column label="设备" align="center" prop="equName" width="200"/>
      <el-table-column label="所属基地" align="center" prop="base" width="200"/>
      <el-table-column :label="getTenantId() === 157 ? '所属鱼塘' : '所属地块'" align="center"
                       prop="massif" width="200"/>
      <!--      <el-table-column label="巡检人id" align="center" prop="inspectorId" />-->
      <el-table-column label="巡检人" align="center" prop="inspector"/>
      <el-table-column
        label="巡检时间"
        align="center"
        prop="inspectionTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--      <el-table-column label="巡检影像" align="center" prop="inspectionImage"/>-->
      <el-table-column label="巡检影像" align="center" prop="inspectionImage" >
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.inspectionImage"
            :preview-src-list="[row.inspectionImage]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="巡检内容" align="center" prop="content"/>
      <el-table-column label="处理人" align="center" prop="dealPerson" />
      <el-table-column
        label="处理时间"
        align="center"
        prop="dealTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="处理结果" align="center" prop="dealResult"/>
      <el-table-column label="处理图片" align="center" prop="dealImage" >
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.dealImage"
            :preview-src-list="[row.inspectionImage]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        align="center"-->
      <!--        prop="createTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openErrorFrom('update', scope.row.id)"
            v-hasPermi="['agriculture:check-logs:update']"
          >
            处理
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:check-logs:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:check-logs:delete']"
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
  <CheckLogsForm ref="formRef" @success="getList"/>
  <CheckErrorLogsForm ref="errFormRef" @success="getList"/>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {CheckLogsApi, CheckLogsVO} from '@/api/agriculture/checklogs'
import CheckLogsForm from './CheckLogsForm.vue'
import CheckErrorLogsForm from "@/views/agriculture/checklogs/CheckErrorLogsForm.vue";
import {getTenantId} from "@/utils/auth";

/** 巡检记录 列表 */
defineOptions({name: 'CheckLogs'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CheckLogsVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  inspectionNum: undefined,
  inspectionState: undefined,
  inspectionResults: undefined,
  resultState: 2,
  equNum: undefined,
  equName: undefined,
  base: undefined,
  massif: undefined,
  inspectorId: undefined,
  inspector: undefined,
  inspectionTime: [],
  inspectionImage: undefined,
  content: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CheckLogsApi.getCheckLogsPage(queryParams)
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

const errFormRef= ref()
const openErrorFrom = (type: string, id?: number) => {
    errFormRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CheckLogsApi.deleteCheckLogs(id)
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
    const data = await CheckLogsApi.exportCheckLogs(queryParams)
    download.excel(data, '巡检记录.xls')
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
