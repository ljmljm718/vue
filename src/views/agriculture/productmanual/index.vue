<template>
  <!-- 搜索栏 -->
  <ContentWrap>
    <el-form
      class="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5"
      :model="queryParams"
      ref="queryFormRef"
      label-width="68px"
      :inline="true"
    >
      <!-- 表单内容 -->
      <el-form-item label="手册名称" prop="schemeName">
        <el-input
          v-model="queryParams.schemeName"
          placeholder="请输入手册名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创作人" prop="marketingCreator">
        <el-input
          v-model="queryParams.marketingCreator"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="marketingCategory">
        <el-input
          v-model="queryParams.marketingCategory"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签" prop="marketingTags">
        <el-input
          v-model="queryParams.marketingTags"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传时间" prop="marketingUploadTime">
        <el-date-picker
          v-model="queryParams.marketingUploadTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
      <!-- 表单按钮 -->
      <el-form-item>
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" />
          查询
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <!-- 数据列表 -->
  <ContentWrap>
    <!-- 第一行功能按钮 -->
    <div class="flex justify-between">
      <div class="flex flex-wrap content-center">
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:marketing-program:create']"
        >
          <el-icon><Plus /></el-icon>
          新增
        </el-button>
        <el-button
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:marketing-program:export']"
        >
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
      <div class="flex flex-wrap content-center">
        <el-radio-group v-model="listType" size="small" @change="handleCardChange">
          <el-radio-button label="card" value="card">
            <el-icon><Menu /></el-icon>
            卡片
          </el-radio-button>
          <el-radio-button label="list" value="list">
            <el-icon><List /></el-icon>
            列表
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <!-- 第二行列表数据 -->
    <div class="mt-[20px]">
      <!-- 卡片形式 -->
      <div v-if="list.length && listType === 'card'" class="text-[12px] 2xl:text-[14px] text-[#999999]">
        <!-- 卡片列表区 -->
        <div class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-3 rounded">
          <div
            class="bg-[#F5F5F5] pb-[20px] cursor-pointer shadow-md rounded-md"
            v-for="item in list"
            :key="item.id"
          >
            <!-- 展示区 -->
            <div class="relative">
              <!-- 图片 -->
              <el-image
                :src="item.coverImage"
                preview-teleported
                fit="contain"
                class="w-full h-[31vh] rounded-md"
              />
              <!-- 功能按钮 -->
              <div
                v-show="item.fileManagement"
                @click="filePreview(item.fileManagement)"
                class="absolute bg-black opacity-50 w-[40px] h-[40px] top-[11px] right-[110px] rounded text-center leading-[40px] hover:cursor-pointer"
              >
                <el-icon color="#FFFFFF" size="16px"><View /></el-icon>
              </div>
              <div
                class="absolute bg-black opacity-50 w-[40px] h-[40px] top-[11px] right-[60px] rounded text-center leading-[40px] hover:cursor-pointer"
                @click="openForm('update', item.id)"
                v-hasPermi="['agriculture:marketing-program:update']"
              >
                <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
              </div>
              <div
                class="absolute bg-black opacity-50 w-[40px] h-[40px] top-[11px] right-[10px] rounded text-center leading-[40px] hover:cursor-pointer"
                @click="handleDelete(item.id)"
                v-hasPermi="['agriculture:marketing-program:delete']"
              >
                <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
              </div>
            </div>
            <!-- 文字介绍 -->
            <div
              class="grid grid-cols-1 2xl:row-span-1 2xl:gap-1 2xl:mt-[10px] text-[14px] lg:text-[8px] xl:text-[10px] 2xl:text-[14px] ml-2px mb-2px px-3"
            >
              <div class="text-center">
                <span class="text-[#666666]">{{ item.schemeName }}</span>
              </div>
              <div class="text-center">
                <span>{{ item.briefIntroduction }}</span>
              </div>
              <div class="text-center">
                <el-button
                  type="primary"
                  round
                  v-if="item.fileManagement"
                  class="w-1/2 lg:w-1/4 text-center"
                >
                  <a :href="item.fileManagement" class="text-white no-underline text-[14px] lg:text-[8px] xl:text-[10px] 2xl:text-[14px]">
                    <el-icon class="align-bottom"><Download /></el-icon>
                    <span>下载</span>
                  </a>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="listType === 'card'" class="text-center tracking-widest">
        暂无数据
      </div>
      <!-- 列表形式 -->
      <div v-show="listType === 'list'">
        <el-table :data="list" v-loading="loading" :show-overflow-tooltip="true">
          <el-table-column label="手册名称" align="center" prop="schemeName" />
          <el-table-column label="简介" align="center" prop="briefIntroduction" />
          <el-table-column label="创作人" align="center" prop="marketingCreator" />
          <el-table-column
            label="上传时间"
            align="center"
            prop="marketingUploadTime"
            :formatter="dateFormatter"
            width="180px"
          />
          <el-table-column label="分类" align="center" prop="marketingCategory" />
          <el-table-column label="标签" align="center" prop="marketingTags" />
          <el-table-column label="文件管理" align="center" prop="fileManagement">
            <template #default="scope">
              <el-button type="primary" round v-if="scope.row.fileManagement">
                <a :href="scope.row.fileManagement" style="color: aliceblue; text-decoration: none">
                  点击下载
                </a>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="封面图片" align="center" prop="coverImage">
            <template #default="{ row }">
              <el-image
                class="h-60px w-60px"
                :src="row.coverImage"
                :preview-src-list="[row.coverImage]"
                preview-teleported
                fit="contain"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="200px">
            <template #default="scope">
              <el-button
                v-if="scope.row.fileManagement"
                link
                type="primary"
                @click="filePreview(scope.row.fileManagement)"
              >
                文件预览
              </el-button>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:marketing-program:update']"
              >
                编辑
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:marketing-program:delete']"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList()"
      />
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <MarketingProgramForm ref="formRef" @success="getList" />

  <!-- 文件预览 -->
  <el-dialog v-model="dialogVisible" title="预览" width="70vw" :before-close="handleDialogClose">
    <el-scrollbar height="65vh" class="px-2">
      <div id="filePreview"></div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MarketingProgramApi, MarketingProgramVO } from '@/api/agriculture/marketingprogram'
import MarketingProgramForm from './MarketingProgramForm.vue'
//文件预览引入
import { renderAsync } from 'docx-preview'
import axios from 'axios'

/** 营销方案 列表 */
defineOptions({ name: 'MarketingProgram' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MarketingProgramVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  schemeName: undefined,
  briefIntroduction: undefined,
  marketingCreator: undefined,
  marketingUploadTime: [],
  marketingCategory: undefined,
  marketingTags: undefined,
  fileManagement: undefined,
  coverImage: undefined,
  marketingType: 'productmanual',
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

//文件预览
let dialogVisible = ref(false)
let fileUrl = ref()
const filePreview = (url: any) => {
  dialogVisible.value = true
  console.log('preview url', url)

  if (url.endsWith('docx')) renderDocx(url)
  else if (url.endsWith('pdf')) renderPDF(url)
  else renderError()
}

const renderError = () => {
  const _p = document.createElement('p')
  _p.innerHTML = '格式暂不支持！'
  setTimeout(() => {
    const _dom = document.getElementById('filePreview') as HTMLElement
    if (_dom) _dom.appendChild(_p)
  }, 200)
}

const handleDialogClose = () => {
  const _dom = document.getElementById('filePreview') as HTMLElement
  if (_dom) _dom.innerHTML = ''
  dialogVisible.value = false
}
// 渲染docx
const renderDocx = (url: string) => {
  if (!url.endsWith('docx')) return
  axios.get(url, { responseType: 'blob' }).then(({ data }) => {
    const _dom = document.getElementById('filePreview') as HTMLElement
    renderAsync(data, _dom)
  })
}

const renderPDF = (url: string) => {
  const _iframe = document.createElement('iframe')
  _iframe.src = url
  _iframe.width = '100%'
  _iframe.height = '600px'
  setTimeout(() => {
    const _dom = document.getElementById('filePreview') as HTMLElement
    console.log('dom', _dom)

    if (_dom) _dom.appendChild(_iframe)
  }, 200)
}
//--------结束文件预览

/** 查询列表 */
const getList = async () => {
  if (sessionStorage.getItem('latestListType')) {
    listType.value = sessionStorage.getItem('latestListType')
  }
  sessionStorage.removeItem('latestListType')
  loading.value = true
  try {
    const data = await MarketingProgramApi.getMarketingProgramPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
onActivated(() => {
  resetQuery()
})
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

// 列表展示形式
const listType = ref('card')

// listType切换list或card
const handleCardChange = () => {
  queryParams.pageNo = 1
  getList()
}

/** 添加/修改操作 */
const router = useRouter() // 路由
const formRef = ref()
const openForm = (type: string, id?: number) => {
  sessionStorage.setItem('latestListType', listType.value)
  if (type == 'create') {
    router.push('/pcg/marketingCenter/productManual/CreateMarketingProgram')
  } else {
    router.push(
      '/pcg/marketingCenter/productManual/CreateMarketingProgram?type=' + type + '&id=' + id
    )
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MarketingProgramApi.deleteMarketingProgram(id)
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
    const data = await MarketingProgramApi.exportMarketingProgram(queryParams)
    download.excel(data, '产品手册.xls')
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

<style scoped lang="scss">
/* 消除element部分组件的部分样式 */
.el-tabs__nav-wrap::after {
  display: none;
}
.el-form-item {
  margin-bottom: 0;
}
.el-form-item--small {
  margin-bottom: 0;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-range-editor.el-input__wrapper {
  padding: 0;
}
.el-button + .el-button {
  margin-left: 10px;
}
</style>
