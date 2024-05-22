<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    	    <el-card>
      <div class="flex justify-between">
        <el-input
          placeholder="请输入标题"
          v-model="queryParams.repositoryTitle"
          style="width: 16rem;"
          @keyup.enter="handleQuery"
        >
          <template #append>
            <el-button :icon="Search" @click="handleQuery"/>
          </template>
        </el-input>
        <div class="flex space-x-2">
          <el-button type="primary" :icon="Plus" @click="openForm('create')">新增</el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
          <el-radio-group v-model="radioVal" @change="handleRadioChange">
            <el-radio-button label="时间正序" value="时间正序"/>
            <el-radio-button label="时间倒序" value="时间倒序"/>
          </el-radio-group>
        </div>
      </div>
      <div class="flex flex-col py-2 space-y-2">
        <div class="flex items-center">
          <div class="px-2">分类:</div>

          <el-checkbox-group
            v-model="checkboxGroup1"
            @change="handleCheckBoxChange1"
            :min="0"
            :max="1"
          >
            <el-checkbox-button
              v-for="item in options1"
              :label="item"
              :value="item"
              :key="item"
            />
          </el-checkbox-group>
        </div>
        <div class="flex items-center">
          <div class="px-2">标签:</div>
          <el-checkbox-group
            v-model="checkboxGroup2"
            @change="handleCheckBoxChange2"
            :min="0"
            :max="1"
          >
          <el-checkbox-button
              v-for="item in options2"
              :label="item"
              :value="item"
              :key="item"
            />
          </el-checkbox-group>
        </div>
      </div>
    </el-card>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="标题" align="center" prop="repositoryTitle" />
      <el-table-column label="名称" align="center" prop="repositoryType" />
      <el-table-column label="标签" align="center" prop="repositoryLabel" />
      <el-table-column label="作者" align="center" prop="writer" />
      <el-table-column label="简介" align="center" prop="synopsis" />
      <el-table-column label="封面图片" align="center" prop="attachmentImg">
        <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.attachmentImg"
              preview-teleported
              fit="cover"
            />
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
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
  <RepositoryInfoForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { RepositoryInfoApi, RepositoryInfoVO } from '@/api/agriculture/repositoryinfo'
import RepositoryInfoForm from './RepositoryInfoForm.vue'
import {Search,Plus, Sort, Edit, Delete} from '@element-plus/icons-vue'

/** 助农知识库信息表 列表 */
defineOptions({ name: 'RepositoryInfo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<RepositoryInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  repositoryTitle: undefined,
  repositoryType: '全部',
  repositoryLabel: '全部',
  selectFlag:'1',
  writer: undefined,
  synopsis: undefined,
  repositoryContent: undefined,
  attachmentImg: undefined,
  attachmentFile: undefined,
  browseNum: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const checkboxGroup1 = ref(['全部'])
const options1 = ['全部','病虫害识别', '收获预测', '价格预测', '农事操作规程']
const checkboxGroup2 = ref(['全部'])
const options2 = ['全部', '专家经验', '白皮书']

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RepositoryInfoApi.getRepositoryInfoPage(queryParams)
    console.log("查询得到的结果")
    console.log(data)
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
    await RepositoryInfoApi.deleteRepositoryInfo(id)
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
    const data = await RepositoryInfoApi.exportRepositoryInfo(queryParams)
    download.excel(data, '助农知识库信息表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
const radioVal = ref('时间正序')
const handleRadioChange = (item) => {
  if (item === '时间正序') {
    queryParams.selectFlag = '1'
    handleQuery()
  } else {
    queryParams.selectFlag = '0'
    handleQuery()
  }
}

const handleCheckBoxChange1 = (item) => {
  if (Array.isArray(item) && item.length === 0) {
    queryParams.repositoryType = '全部'
    handleQuery()
  }else
  {
    queryParams.repositoryType=item[0]
    handleQuery()
  }
}
const handleCheckBoxChange2 = (item) => {
  if (Array.isArray(item) && item.length === 0) {
    queryParams.repositoryLabel = '全部'
    handleQuery()
  }else
  {
    queryParams.repositoryLabel=item[0]
    handleQuery()
  }
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>