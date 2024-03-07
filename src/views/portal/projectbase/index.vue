<template>
  <div class="affix-container">
    <el-affix target=".affix-container" :offset="120">
      <ContentWrap style="background-color: #ecf5ff">
        <!-- 搜索工作栏 -->
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="项目名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入项目名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="是否显示" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              class="!w-240px"
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
              v-hasPermi="['portal:project-base:create']"
            >
              <Icon icon="ep:plus" class="mr-5px"/>
              新增
            </el-button>
            <el-button
              type="success"
              plain
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['portal:project-base:export']"
            >
              <Icon icon="ep:download" class="mr-5px"/>
              导出
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
    </el-affix>

    <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="项目编码" align="center" prop="code" />
      <el-table-column label="项目名称" width="300px" align="center" prop="name"/>
      <el-table-column label="项目分类" width="230px" align="center" prop="category">
        <template #default="scope">
          <el-cascader
            style="width: 200px"
            v-model="scope.row.category"
            :options="categoryOptions"
            :props="categoryProps"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="是否展示" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_INTEGER_STRING" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="操作"
        width="200px"
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['portal:project-base:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['portal:project-base:delete']"
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

    <el-affix target=".affix-container" :offset="120">
      <!-- 子表的列表 -->
      <ContentWrap>
        <el-tabs model-value="projectService">
          <el-tab-pane label="门户项目服务" name="projectService">
            <ProjectServiceList :project-id="currentRow.id"/>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
    </el-affix>
  </div>
  <!-- 表单弹窗：添加/修改 -->
  <ProjectBaseForm ref="formRef" @success="getList" />

</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {ProjectBaseApi, ProjectBaseVO} from '@/api/portal/projectbase'
import ProjectBaseForm from './ProjectBaseForm.vue'
import ProjectServiceList from './components/ProjectServiceList.vue'
import {ProjectCategoryApi} from "@/api/portal/projectcategory";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 门户项目基础信息 列表 */
defineOptions({ name: 'ProjectBase' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProjectBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  category: undefined,
  status: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

let categoryOptions = ref([])// 项目分类选项

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProjectBaseApi.getProjectBasePage(queryParams)
    categoryOptions.value = await ProjectCategoryApi.getProjectCategoryTree({parentId: 0, status: 1})
    list.value = data.list.map((item: any) => {
      item.category = item.category.split(',').map(Number)
      return item;
    })

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

let clearCategoryEmit = defineEmits(["clearCategory"]);

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  clearCategoryEmit("clearCategory")
  // handleQuery()
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
    await ProjectBaseApi.deleteProjectBase(id)
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
    const data = await ProjectBaseApi.exportProjectBase(queryParams)
    download.excel(data, '门户项目基础信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row: any) => {
  currentRow.value = row
}

/**
 * 项目分类级联选择器
 */
const categoryProps = {
  value: 'id'
}

/** 初始化 **/
onMounted(() => {
  getList()
})

// 定义属性
const props = defineProps({
  currCategory: {
    type: Object,
    default: () => ({})
  },
})
// 监听父组件category变化
watch(() => props.currCategory, (newVal) => {
  if (newVal){
    queryParams.category = newVal.parentId + "," + newVal.id
  }else {
    queryParams.category = undefined
  }
  handleQuery()
})
</script>

<style scoped>
.affix-container {

}
</style>
