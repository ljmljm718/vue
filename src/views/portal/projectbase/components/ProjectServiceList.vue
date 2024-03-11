<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['portal:project-base:create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
       <el-table-column label="服务编码" width="200px"  align="center" prop="code" />
      <el-table-column label="服务名称" width="400px" align="center" prop="name" />
      <el-table-column label="服务类型" width="150px" align="center" prop="type" />
      <el-table-column label="是否展示" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_INTEGER_STRING" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="访问路径" width="400px" align="center" prop="accessPath" />
      <el-table-column label="框架类型" width="200px" align="center" prop="frameType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PROJECT_FRAME_TYPE" :value="scope.row.frameType" />
        </template>
      </el-table-column>
      <el-table-column label="租户名称" width="150px" align="center" prop="tenantName" />
      <el-table-column label="用户名" width="150px" align="center" prop="username" />
      <el-table-column label="密码" width="150px" align="center" prop="password" />
      <el-table-column label="服务器地址" width="200px" align="center" prop="endpoint" />
      <el-table-column label="端口号" align="center" prop="ports" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="操作"
        align="center"
        width="200px"
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
    <!-- 表单弹窗：添加/修改 -->
    <ProjectServiceForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { ProjectBaseApi } from '@/api/portal/projectbase'
import ProjectServiceForm from './ProjectServiceForm.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  projectId: undefined // 项目（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectId: undefined
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.projectId,
  (val) => {
    if (val){
      queryParams.projectId = val
      handleQuery()
    }else {
      list.value = []
    }
  },
  { immediate: false }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProjectBaseApi.getProjectServicePage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (!props.projectId) {
    message.error('请选择一个门户项目基础信息')
    return
  }
  formRef.value.open(type, id, props.projectId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProjectBaseApi.deleteProjectService(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
</script>
