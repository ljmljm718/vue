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
      <el-form-item label="分类编码" prop="defineCode">
        <el-input
          v-model="queryParams.defineCode"
          placeholder="请输入分类编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="defineName">
        <el-input
          v-model="queryParams.defineName"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="分类标签" prop="defineLabel">
        <el-input
          v-model="queryParams.defineLabel"
          placeholder="请输入分类标签"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="是否显示" prop="showStatus">
        <el-select
          v-model="queryParams.showStatus"
          placeholder="请选择是否显示"
          clearable
          class="!w-150px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_INTEGER_STRING)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
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
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex items-center mb-3">
      <div style="margin-bottom: 1rem;margin-left: 1.5rem;margin-right: 1.5rem;height: 2rem">
        <el-form-item>
          <el-button
            type="primary"
            class="!h-2.4rem"
            plain
            @click="openForm('create')"
            v-hasPermi="['agri:farm-define:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
        </el-form-item>
      </div>
      <div class="grow">
        <IntroduceAlert title="该模块是阐述每个生长阶段所需的具体农事活动，帮助农业生产者合理安排作业计划。"/>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
      :default-expand-all="isExpandAll"
      v-if="refreshTable"
    >
      <el-table-column label="分类编码" align="center" prop="defineCode"/>
      <el-table-column label="分类名称" align="center" prop="defineName"/>
      <el-table-column label="分类标签" align="center" prop="defineLabel"/>
      <el-table-column label="是否显示" align="center" prop="showStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_INTEGER_STRING" :value="scope.row.showStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="分类排序" align="center" prop="defineSort"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="描述" align="center" prop="description"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:farm-define:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:farm-define:delete']"
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
  <FarmDefineForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import {handleTree} from '@/utils/tree'
import download from '@/utils/download'
import {FarmDefineApi, FarmDefineVO} from '@/api/agriculture/farmdefine'
import FarmDefineForm from './FarmDefineForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 鲁渝协作农事定义 列表 */
defineOptions({name: 'FarmDefine'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FarmDefineVO[]>([]) // 列表的数据
const queryParams = reactive({
  parentId: undefined,
  defineCode: undefined,
  defineName: undefined,
  defineLabel: undefined,
  showStatus: undefined,
  defineSort: undefined,
  isLeaf: undefined,
  createTime: [],
  imgId: undefined,
  description: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmDefineApi.getFarmDefineList(queryParams)
    list.value = handleTree(data, 'id', 'parentId')
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
    await FarmDefineApi.deleteFarmDefine(id)
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
    const data = await FarmDefineApi.exportFarmDefine(queryParams)
    download.excel(data, '鲁渝协作农事定义.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 展开/折叠操作 */
const isExpandAll = ref(true) // 是否展开，默认全部展开
const refreshTable = ref(true) // 重新渲染表格状态
const toggleExpandAll = async () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  await nextTick()
  refreshTable.value = true
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
