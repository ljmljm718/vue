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
      <el-form-item label="标题" prop="repositoryTitle">
        <el-input
          v-model="queryParams.repositoryTitle"
          placeholder="请输入知识库标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="标签" prop="repositoryLabel">
        <el-select
          v-model="queryParams.repositoryLabel"
          placeholder="请选择标签"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_REPOSITORY_TALLY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作者" prop="writer">
        <el-input
          v-model="queryParams.writer"
          placeholder="请输入作者"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="排序" prop="writer">
        <el-radio-group v-model="radioVal" @change="handleRadioChange">
          <el-radio-button label="时间正序" value="时间正序" />
          <el-radio-button label="时间倒序" value="时间倒序" />
        </el-radio-group>
        <!-- <el-input
          v-model="queryParams.selectFlag"
          placeholder="请输入排序标识 0 和1   只能输入一个"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
      </el-form-item>
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
      <el-form-item label="状态" prop="repositoryStatus">
        <el-select
          v-model="queryParams.repositoryStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_REPOSITORY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间" prop="releaseTime">
        <el-date-picker
          v-model="queryParams.releaseTime"
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
          <Icon
            icon="ep:search"
            class="mr-5px"
          />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon
            icon="ep:refresh"
            class="mr-5px"
          />
          重置
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:repository-info:create']"
        >
          <Icon
            icon="ep:plus"
            class="mr-5px"
          />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:repository-info:export']"
        >
          <Icon
            icon="ep:download"
            class="mr-5px"
          />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <!--      <el-table-column label="分类ID" align="center" prop="id" />-->
      <!--      <el-table-column label="知识库分类名称" align="center" prop="repositoryName" />-->
      <el-table-column label="分类" align="center" prop="repositoryId"/>
      <el-table-column label="标题" align="center" prop="repositoryTitle"/>
      <el-table-column label="简介" align="center" prop="synopsis"/>
      <el-table-column label="作者" align="center" prop="writer"/>
      <el-table-column label="标签" align="center" prop="repositoryLabel">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_REPOSITORYINFO_LABEL" :value="scope.row.repositoryLabel"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="repositoryStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_REPOSITORY_STATUS"
                    :value="scope.row.repositoryStatus"/>
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        align="center"
        prop="releaseTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--      <el-table-column label="内容" align="center" prop="repositoryContent" />-->
      <el-table-column label="缩略图" align="center" prop="attachmentFile">
        <template #default="scope">
          <el-image :src="scope.row.attachmentFile"
                    style="width: 50px; height: 50px;"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :initial-index="4"
                    :fit="fill"/>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" align="center" prop="browseNum"/>
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
        min-width="120px"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="lookRepositoryInfoDetail(scope.row.id)"
          >
            查看
          </el-button>
          <el-button
            link
            type="success"
            v-if="scope.row.repositoryStatus!== '1'"
            @click="updateRepositoryStatus(scope.row.id)"
          >
            发布
          </el-button>
          <el-button
            link
            type="warning"
            v-if="scope.row.repositoryStatus!== '1'"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:repository-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:repository-info:delete']"
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
  <RepositoryInfoForm
    ref="formRef"
    @success="getList"
  />
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {RepositoryInfoApi, RepositoryInfoVO} from '@/api/agriculture/repositoryinfo'
import RepositoryInfoForm from './RepositoryInfoForm.vue'
import {RepositoryTypeApi} from '@/api/agriculture/repositorytype'
import {getStrDictOptions, DICT_TYPE} from "@/utils/dict";

/** 知识库 列表 */
defineOptions({name: 'RepositoryInfo'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const router = useRouter() // 路由
const loading = ref(true) // 列表的加载中
const list = ref<RepositoryInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  repositoryName: undefined,
  repositoryId: undefined,
  repositoryTitle: undefined,
  createTime: [],
  repositoryContent: undefined,
  attachmentFile: undefined,
  repositoryLabel: '',
  repositoryStatus: '',
  selectFlag: '0',
})
let typeListAll = ref([])
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const radioVal = ref('时间正序')
const handleRadioChange = (item) => {
  if (item === '时间正序') {
    queryParams.selectFlag = '1'
  } else {
    queryParams.selectFlag = '0'
  }
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RepositoryInfoApi.getRepositoryInfoPage(queryParams)
    list.value = data.list
    list.value.forEach((item) => {
      typeListAll.value.forEach((itm) => {
        if (item.repositoryId == itm.id) {
          item.repositoryId = itm.repositoryName
        }
      })
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 查询列表 */
const getTypeAllList = async () => {
  loading.value = true
  try {
    const resAll = await RepositoryTypeApi.getAllRepositoryType()
    typeListAll.value = resAll
    console.log('列表resAll', resAll)
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
    await RepositoryInfoApi.deleteRepositoryInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}
/** 发布按钮操作 */
const updateRepositoryStatus = async (id: number) => {
  try {
    // 删除的二次确认
    await message.confirm("发布以后不可修改，确认发布该知识库么？")
    // 发起删除
    await RepositoryInfoApi.updateRepositoryStatus(id)
    message.success('发布成功')
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 查看富文本详情 */
const lookRepositoryInfoDetail = (id: number) => {
  router.push('repositoryInfoDetail?id=' + id)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await RepositoryInfoApi.exportRepositoryInfo(queryParams)
    download.excel(data, '知识库.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
// onMounted(() => {
//   getTypeAllList()
//   getList()
// })

onActivated(() => {
  getTypeAllList()
  getList()
})
</script>
