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
      <el-form-item label="源码名称" prop="codeName">
        <el-input
          v-model="queryParams.codeName"
          placeholder="请输入源码名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品类" prop="categoryId">
        <el-select
          v-model="queryParams.categoryId"
          placeholder="请选择品类"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="码前缀" prop="codeBefore">-->
<!--        <el-input-->
<!--          v-model="queryParams.codeBefore"-->
<!--          placeholder="请输入码前缀"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="日期" prop="codeDate">-->
<!--        <el-select-->
<!--          v-model="queryParams.codeDate"-->
<!--          placeholder="请选择日期"-->
<!--          clearable-->
<!--          class="!w-240px"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CODE_DATE_FORMAT)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
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
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:code-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--          v-hasPermi="['agriculture:code-rule:export']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="源码名称" align="center" prop="codeName" />
      <el-table-column label="品类" align="center" prop="categoryName" />
      <el-table-column label="码前缀" align="center" prop="codeBefore" />
      <el-table-column label="日期" align="center" prop="codeDate">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_CODE_DATE_FORMAT" :value="scope.row.codeDate" />
        </template>
      </el-table-column>
      <el-table-column label="序列号" align="center" prop="codeSerial">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_CODE_SERIAL" :value="scope.row.codeSerial" />
        </template>
      </el-table-column>
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
            v-hasPermi="['agriculture:code-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:code-rule:delete']"
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
  <CodeRuleForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CodeRuleApi, CodeRuleVO } from '@/api/agriculture/coderule'
import CodeRuleForm from './CodeRuleForm.vue'
import { CategoryManagementApi, CategoryManagementVO } from '@/api/agriculture/categorymanagement'

/** 码规则 列表 */
defineOptions({ name: 'CodeRule' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CodeRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  codeName: undefined,
  categoryId: undefined,
  codeBefore: undefined,
  codeDate: undefined,
  codeSerial: undefined,
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const categoryList = ref<CategoryManagementVO[]>([]) // 品类的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CodeRuleApi.getCodeRulePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 查询品类列表 */
const getCategoryList = async () => {
  const data = await CategoryManagementApi.getAllCategoryManagement()
  categoryList.value = data
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
    await CodeRuleApi.deleteCodeRule(id)
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
    const data = await CodeRuleApi.exportCodeRule(queryParams)
    download.excel(data, '码规则.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getCategoryList()
  getList()
})
</script>
